// manda-notifiche: manda gli avvisi sul telefono del cliente.
//
// Tre avvisi (proprietario, 6 ottobre 2026): richiesta CONFERMATA, richiesta
// ANNULLATA, PROMEMORIA prima dell'escursione. Quando parte il promemoria lo
// decide il database, in notifiche_da_mandare()
// (supabase/modifiche/2026-10-13-notifiche.sql): qui si scrive e si manda.
//
// Chi la chiama:
//   - Cron di Supabase, ogni 10 minuti (promemoria, e quello che e' rimasto);
//   - venditori.html subito dopo Conferma o Annulla, per non far aspettare.
// E' aperta (Verify JWT spento): chi la chiamasse otterrebbe solo quello che
// fa gia' lei ogni 10 minuti. Non riceve niente e restituisce solo conteggi.
//
// Le chiavi VAPID: la pubblica sta anche nel sito (supabase-config.js), la
// privata SOLO nei Secrets di Supabase. Con la privata si firma ogni avviso:
// Google, Apple e Mozilla consegnano solo quelli firmati dalla chiave con cui
// il telefono si e' iscritto. Se si cambiano, i telefoni gia' iscritti non
// ricevono piu' niente finche' non si iscrivono di nuovo.

import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

// L'indirizzo che Google, Apple e Mozilla usano se qualcosa non va.
const CONTATTO = "mailto:info@islatenerife.com";
// Un avviso che il telefono non riceve entro 12 ore (spento, senza rete) non
// arriva piu': un promemoria del giorno prima letto il giorno dopo confonde.
const DURATA = 12 * 60 * 60;

type Avviso = {
  booking_id: string;
  tipo: "confirmed" | "cancelled" | "reminder";
  request_token: string;
  excursion_id: string | null;
  date: string;              // "2026-10-14"
  time: string | null;       // "08:30:00", l'ora del ritrovo messa dall'ufficio
  meeting_point: string | null;
};

type Iscrizione = {
  request_token: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  lang: "it" | "en" | "es" | "fr" | "de";
  titoli: Record<string, string>;
};

// I testi, nelle cinque lingue del sito. {t} il titolo, {d} il giorno, {o} l'ora.
const TESTI = {
  it: {
    confirmed: "{t}: confermata",
    cancelled: "{t}: annullata",
    reminder: "Promemoria: {t}",
    ora: "{d}, ritrovo alle {o}",
    oggi: "Oggi",
    domani: "Domani",
    luogo: "Ritrovo: ",
    annullata: "{d}. Apri l'app per vedere cosa fare.",
    escursione: "La tua escursione",
  },
  en: {
    confirmed: "{t}: confirmed",
    cancelled: "{t}: cancelled",
    reminder: "Reminder: {t}",
    ora: "{d}, meet at {o}",
    oggi: "Today",
    domani: "Tomorrow",
    luogo: "Meeting point: ",
    annullata: "{d}. Open the app to see your options.",
    escursione: "Your excursion",
  },
  es: {
    confirmed: "{t}: confirmada",
    cancelled: "{t}: cancelada",
    reminder: "Recordatorio: {t}",
    ora: "{d}, encuentro a las {o}",
    oggi: "Hoy",
    domani: "Mañana",
    luogo: "Punto de encuentro: ",
    annullata: "{d}. Abre la app para ver qué hacer.",
    escursione: "Tu excursión",
  },
  fr: {
    confirmed: "{t} : confirmée",
    cancelled: "{t} : annulée",
    reminder: "Rappel : {t}",
    ora: "{d}, rendez-vous à {o}",
    oggi: "Aujourd'hui",
    domani: "Demain",
    luogo: "Point de rendez-vous : ",
    annullata: "{d}. Ouvrez l'app pour voir quoi faire.",
    escursione: "Votre excursion",
  },
  de: {
    confirmed: "{t}: bestätigt",
    cancelled: "{t}: abgesagt",
    reminder: "Erinnerung: {t}",
    ora: "{d}, Treffpunkt um {o}",
    oggi: "Heute",
    domani: "Morgen",
    luogo: "Treffpunkt: ",
    annullata: "{d}. Öffnen Sie die App, um zu sehen, was zu tun ist.",
    escursione: "Ihr Ausflug",
  },
};

function riempi(testo: string, valori: Record<string, string>): string {
  return testo.replace(/\{(\w)\}/g, (_, k) => valori[k] ?? "");
}

// Il giorno di oggi a Tenerife, "2026-10-14".
function oggiTenerife(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Atlantic/Canary" }).format(new Date());
}

function giornoDopo(giorno: string): string {
  const d = new Date(giorno + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

// "mercoledì 14 ottobre", oppure "Oggi" / "Domani" nel promemoria.
function giornoScritto(a: Avviso, lang: "it" | "en" | "es" | "fr" | "de"): string {
  const T = TESTI[lang];
  if (a.tipo === "reminder") {
    const oggi = oggiTenerife();
    if (a.date === oggi) return T.oggi;
    if (a.date === giornoDopo(oggi)) return T.domani;
  }
  const scritto = new Intl.DateTimeFormat(lang, {
    weekday: "long", day: "numeric", month: "long", timeZone: "UTC",
  }).format(new Date(a.date + "T12:00:00Z"));
  return scritto.charAt(0).toUpperCase() + scritto.slice(1);
}

function messaggio(a: Avviso, isc: Iscrizione) {
  const lang = TESTI[isc.lang] ? isc.lang : "it";
  const T = TESTI[lang];
  const titolo = (a.excursion_id && isc.titoli && isc.titoli[a.excursion_id]) || T.escursione;
  const d = giornoScritto(a, lang);
  let corpo: string;
  if (a.tipo === "cancelled") {
    corpo = riempi(T.annullata, { d });
  } else {
    corpo = a.time ? riempi(T.ora, { d, o: a.time.slice(0, 5) }) : d;
    // "Oggi, ritrovo alle 12:00 · Los Cristianos": con l'ora, "ritrovo" e'
    // gia' scritto; senza, lo si dice davanti al posto.
    if (a.meeting_point) corpo += " · " + (a.time ? "" : T.luogo) + a.meeting_point;
  }
  return {
    title: riempi(T[a.tipo], { t: titolo }),
    body: corpo,
    // Lo stesso tag per la stessa escursione: l'avviso nuovo prende il posto
    // del vecchio invece di accumularsi (confermata → promemoria).
    tag: "isla-" + a.booking_id,
    url: indirizzo(a),
  };
}

// Toccato l'avviso, la pagina delle richieste si apre sull'escursione di cui
// parla (16 ottobre 2026): prima si apriva la lista intera, e con piu'
// escursioni non si capiva di quale fosse il promemoria. L'escursione si
// riconosce da richiesta, scheda e giorno: booking.js non conosce l'id del
// ticket, e cosi' non serve cambiare le_mie_richieste.
function indirizzo(a: Avviso): string {
  const q = new URLSearchParams({ richieste: "1", r: a.request_token, d: a.date });
  if (a.excursion_id) q.set("e", a.excursion_id);
  return "booking.html?" + q.toString();
}

function risposta(corpo: unknown, stato = 200): Response {
  return new Response(JSON.stringify(corpo), {
    status: stato,
    headers: {
      "Content-Type": "application/json",
      // venditori.html la chiama dal browser, da un altro indirizzo
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
    },
  });
}

// Pulizia: gli indirizzi delle richieste con tutte le escursioni passate da
// piu' di due giorni non servono piu'. Le richieste ancora vive si tengono.
// Restituisce quante richieste ha tolto.
// deno-lint-ignore no-explicit-any
async function pulisci(db: any): Promise<number> {
  const limite = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
  const { data: vecchie } = await db
    .from("push_iscrizioni").select("request_token").lt("created_at", limite + "T00:00:00Z");
  const daGuardare = [...new Set((vecchie ?? []).map((v: { request_token: string }) => v.request_token))];
  if (!daGuardare.length) return 0;
  const { data: vive } = await db
    .from("bookings").select("request_token")
    .in("request_token", daGuardare).gte("date", limite);
  const ancoraVive = new Set((vive ?? []).map((v: { request_token: string }) => v.request_token));
  const finite = daGuardare.filter(t => !ancoraVive.has(t));
  if (finite.length) await db.from("push_iscrizioni").delete().in("request_token", finite);
  return finite.length;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return risposta({});

  const pubblica = Deno.env.get("VAPID_PUBLIC_KEY");
  const privata = Deno.env.get("VAPID_PRIVATE_KEY");
  if (!pubblica || !privata) return risposta({ errore: "mancano le chiavi VAPID nei Secrets" }, 500);
  webpush.setVapidDetails(CONTATTO, pubblica, privata);

  // La chiave "service_role" la mette Supabase in ogni funzione: serve per
  // leggere gli indirizzi dei telefoni, che dal sito non si leggono.
  const db = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: avvisi, error } = await db.rpc("notifiche_da_mandare");
  if (error) return risposta({ errore: error.message }, 500);
  const elenco = (avvisi ?? []) as Avviso[];
  if (!elenco.length) return risposta({ mandati: 0, iscrizioniTolte: await pulisci(db) });

  // Una escursione confermata tardi puo' avere conferma e promemoria nello
  // stesso giro: parte solo la conferma, che dice gia' giorno e ora, e il
  // promemoria si segna come fatto. Due avvisi uguali di fila sembrano un errore.
  const confermate = new Set(elenco.filter(a => a.tipo === "confirmed").map(a => a.booking_id));
  const assorbiti = elenco.filter(a => a.tipo === "reminder" && confermate.has(a.booking_id));
  const daMandare = elenco.filter(a => !(a.tipo === "reminder" && confermate.has(a.booking_id)));

  // Si segnano prima di mandarli: solo le righe segnate QUI partono. Se un
  // altro giro le ha appena segnate, questo le salta (vedi notifiche_mandate).
  const segna = elenco.map(a => ({ booking_id: a.booking_id, tipo: a.tipo }));
  const { data: segnati, error: errSegna } = await db
    .from("notifiche_mandate")
    .upsert(segna, { onConflict: "booking_id,tipo", ignoreDuplicates: true })
    .select("booking_id, tipo");
  if (errSegna) return risposta({ errore: errSegna.message }, 500);
  const nostri = new Set((segnati ?? []).map(s => s.booking_id + "|" + s.tipo));

  const chiavi = [...new Set(daMandare.map(a => a.request_token))];
  const { data: iscrizioni, error: errIsc } = await db
    .from("push_iscrizioni")
    .select("request_token, endpoint, p256dh, auth, lang, titoli")
    .in("request_token", chiavi);
  if (errIsc) return risposta({ errore: errIsc.message }, 500);

  let mandati = 0, falliti = 0;
  const morti = new Set<string>();
  for (const a of daMandare) {
    if (!nostri.has(a.booking_id + "|" + a.tipo)) continue;
    for (const isc of (iscrizioni ?? []) as Iscrizione[]) {
      if (isc.request_token !== a.request_token || morti.has(isc.endpoint)) continue;
      try {
        await webpush.sendNotification(
          { endpoint: isc.endpoint, keys: { p256dh: isc.p256dh, auth: isc.auth } },
          JSON.stringify(messaggio(a, isc)),
          { TTL: DURATA, urgency: "high" },
        );
        mandati++;
      } catch (err) {
        falliti++;
        // 404 e 410: il telefono ha tolto il permesso o cancellato il sito.
        // Quell'indirizzo non servira' piu' a nessuna richiesta.
        const stato = (err as { statusCode?: number }).statusCode;
        if (stato === 404 || stato === 410) morti.add(isc.endpoint);
        else console.error("avviso non partito", stato, (err as Error).message);
      }
    }
  }

  if (morti.size) {
    await db.from("push_iscrizioni").delete().in("endpoint", [...morti]);
  }

  return risposta({ mandati, falliti, promemoriaAssorbiti: assorbiti.length, iscrizioniTolte: await pulisci(db) });
});

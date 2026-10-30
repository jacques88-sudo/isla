// manda-notifiche: manda gli avvisi sul telefono del cliente.
//
// Tre avvisi (proprietario, 6 ottobre 2026): richiesta CONFERMATA, richiesta
// ANNULLATA, PROMEMORIA prima dell'escursione. Dal 20 ottobre 2026 un quarto,
// RECENSIONE: il giorno dopo l'escursione, "com'e' andata?", una volta sola per
// cliente. Quando parte ogni avviso lo decide il database, in
// notifiche_da_mandare() (supabase/modifiche/2026-10-13-notifiche.sql, rifatta
// in 2026-10-20-recensioni3-avviso.sql): qui si scrive e si manda.
//
// Dal 22 ottobre 2026 manda anche gli avvisi dell'UFFICIO (richiesta nuova,
// ticket nuovo, recensione da approvare): vedi mandaAllUfficio() qui sotto.
//
// Chi la chiama:
//   - Cron di Supabase, ogni 10 minuti (promemoria, e quello che e' rimasto);
//   - venditori.html subito dopo Conferma o Annulla, e dopo un ticket nuovo,
//     per non far aspettare.
// Solo loro due (16 ottobre 2026; prima era aperta a chiunque):
//   - Cron manda la parola segreta nell'intestazione "x-orologio": la stessa
//     sta nei Secrets della funzione (OROLOGIO_SEGRETO) e nel lavoro di Cron
//     (supabase/modifiche/2026-10-16-notifiche-chiuse.sql). MAI nel repository;
//   - venditori.html manda il login del venditore, come per leggi-ticket.
// "Verify JWT" resta spento: Cron un login non ce l'ha. Il controllo lo fa
// questa funzione, qui sotto.
//
// Le chiavi VAPID: la pubblica sta anche nel sito (supabase-config.js), la
// privata SOLO nei Secrets di Supabase. Con la privata si firma ogni avviso:
// Google, Apple e Mozilla consegnano solo quelli firmati dalla chiave con cui
// il telefono si e' iscritto. Se si cambiano, i telefoni gia' iscritti non
// ricevono piu' niente finche' non si iscrivono di nuovo.

import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

// La chiave pubblica del sito, la stessa di supabase-config.js: serve solo a
// chiedere a Supabase "chi e' questo utente" (come in leggi-ticket).
const CHIAVE_PUBBLICA = "sb_publishable_Qjmd8qP9J_GH1WjUmBolSw_vBdM5G3L";

// L'indirizzo che Google, Apple e Mozilla usano se qualcosa non va.
const CONTATTO = "mailto:info@islaexcursionstenerife.com";
// Un avviso che il telefono non riceve entro 12 ore (spento, senza rete) non
// arriva piu': un promemoria del giorno prima letto il giorno dopo confonde.
const DURATA = 12 * 60 * 60;

type Avviso = {
  booking_id: string;
  tipo: "confirmed" | "cancelled" | "reminder" | "review";
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
    review: "{t}: com'è andata?",
    recensione: "Ci farebbe piacere leggere la tua recensione: bastano due righe.",
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
    review: "{t}: how did it go?",
    recensione: "We'd love to read your review: two lines are enough.",
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
    review: "{t}: ¿qué tal fue?",
    recensione: "Nos encantaría leer tu reseña: bastan dos líneas.",
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
    review: "{t} : comment ça s'est passé ?",
    recensione: "Nous aimerions beaucoup lire votre avis : deux lignes suffisent.",
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
    review: "{t}: Wie war es?",
    recensione: "Wir würden uns über Ihre Bewertung freuen: zwei Zeilen genügen.",
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
  if (a.tipo === "review") {
    corpo = T.recensione;
  } else if (a.tipo === "cancelled") {
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
// Quello della recensione apre anche il modulo ("recensione=1", booking.js).
function indirizzo(a: Avviso): string {
  const q = new URLSearchParams({ richieste: "1", r: a.request_token, d: a.date });
  if (a.excursion_id) q.set("e", a.excursion_id);
  if (a.tipo === "review") q.set("recensione", "1");
  return "booking.html?" + q.toString();
}

function risposta(corpo: unknown, stato = 200): Response {
  return new Response(JSON.stringify(corpo), {
    status: stato,
    headers: {
      "Content-Type": "application/json",
      // venditori.html la chiama dal browser, da un altro indirizzo
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info, x-orologio",
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

// Due testi uguali, confrontati tutti fino in fondo: un confronto che si ferma
// alla prima lettera diversa dice, col tempo che ci mette, quante ne hai
// indovinate.
function uguali(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diversi = 0;
  for (let i = 0; i < a.length; i++) diversi |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diversi === 0;
}

// Chi chiama: Cron con la parola segreta, o un venditore col suo login.
async function autorizzato(req: Request): Promise<boolean> {
  const segreto = Deno.env.get("OROLOGIO_SEGRETO");
  const parola = req.headers.get("x-orologio");
  if (segreto && parola && uguali(parola, segreto)) return true;

  const login = req.headers.get("Authorization") ?? "";
  if (!login.startsWith("Bearer ")) return false;
  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY") ?? CHIAVE_PUBBLICA,
    { global: { headers: { Authorization: login } }, auth: { persistSession: false } },
  );
  // Le regole dello schema danno la riga di sellers solo a un venditore: con
  // la chiave pubblica al posto del login la risposta e' vuota.
  const { data, error } = await sb.from("sellers").select("name").limit(1);
  return !error && !!data && data.length > 0;
}

// ─── Gli avvisi dell'ufficio (22 ottobre 2026) ─────────────────────────────
// Richiesta nuova, ticket nuovo, recensione da approvare: sui telefoni
// dell'ufficio iscritti da Isla Ticket (ufficio_iscrizioni), solo in italiano.
// Cosa mandare lo dice avvisi_ufficio_da_mandare()
// (supabase/modifiche/2026-10-22-avvisi-ufficio.sql). Se quel file non e'
// ancora stato lanciato, qui si salta e gli avvisi dei clienti partono lo stesso.

type AvvisoUfficio = {
  id: number;
  tipo: "richiesta" | "ticket" | "recensione";
  request_code: string | null;
  customer_name: string | null;
  ticket_number: string | null;
  seller: string | null;
  excursion_id: string | null;
  option_label: string | null;
  date: string | null;
  adults: number | null;
  kids: number | null;
  babies: number | null;
  total: number | string | null;
  nome: string | null;
  stelle: number | null;
  testo: string | null;
};

type Messaggio = { title: string; body: string; tag: string; url: string };

// Il catalogo sta nel sito, non nel database: i titoli si leggono da li', come
// fa il foglio Google (titoliDelCatalogo in foglio-google/Codice.gs). Se il sito
// non risponde, l'avviso scrive l'id della scheda.
const CATALOGO_URL = "https://islaexcursionstenerife.com/esplora-catalog.js";

async function titoliDelCatalogo(): Promise<Record<string, string>> {
  const titoli: Record<string, string> = {};
  try {
    const testo = await (await fetch(CATALOGO_URL)).text();
    const cerca = /\bid:\s*"([^"]+)",\s*(?:\/\/[^\n]*\n\s*)*title:\s*(?:"([^"]+)"|\{\s*it:\s*"([^"]+)")/g;
    let m;
    while ((m = cerca.exec(testo))) titoli[m[1]] = m[2] || m[3];
  } catch (err) {
    console.warn("catalogo non raggiungibile", (err as Error).message);
  }
  return titoli;
}

// "2 adulti, 1 bambino"
function persone(a: AvvisoUfficio): string {
  const parti: string[] = [];
  const n = (x: number | null, uno: string, tanti: string) => {
    if (x && x > 0) parti.push(x + " " + (x === 1 ? uno : tanti));
  };
  n(a.adults, "adulto", "adulti");
  n(a.kids, "bambino", "bambini");
  n(a.babies, "neonato", "neonati");
  return parti.join(", ");
}

// "ven 25 ott"
function giornoBreve(giorno: string | null): string {
  if (!giorno) return "";
  return new Intl.DateTimeFormat("it", {
    weekday: "short", day: "numeric", month: "short", timeZone: "UTC",
  }).format(new Date(giorno + "T12:00:00Z"));
}

function escursione(a: AvvisoUfficio, titoli: Record<string, string>): string {
  const titolo = a.excursion_id ? (titoli[a.excursion_id] || a.excursion_id) : "Escursione";
  return titolo + (a.option_label ? " · " + a.option_label : "");
}

function messaggiUfficio(elenco: AvvisoUfficio[], titoli: Record<string, string>): Messaggio[] {
  const fuori: Messaggio[] = [];
  // Una richiesta con tre escursioni sono tre righe: un avviso solo.
  const richieste = new Map<string, AvvisoUfficio[]>();
  for (const a of elenco) {
    if (a.tipo === "richiesta") {
      const chiave = a.request_code || String(a.id);
      richieste.set(chiave, [...(richieste.get(chiave) ?? []), a]);
    } else if (a.tipo === "ticket") {
      const totale = a.total == null ? "" : "€" + Number(a.total).toLocaleString("it", { maximumFractionDigits: 2 });
      fuori.push({
        title: "Nuovo ticket" + (a.ticket_number ? " " + a.ticket_number : ""),
        body: [escursione(a, titoli), giornoBreve(a.date), persone(a), totale,
               a.seller ? "venditore: " + a.seller : ""].filter(Boolean).join(" · "),
        tag: "ufficio-ticket-" + a.id,
        url: "./",
      });
    } else if (a.tipo === "recensione") {
      const testo = (a.testo || "").trim();
      fuori.push({
        title: "Nuova recensione da approvare",
        body: (a.stelle ? "★".repeat(a.stelle) + " " : "") + (a.nome || "") +
              (testo ? ": " + (testo.length > 100 ? testo.slice(0, 100) + "…" : testo) : ""),
        tag: "ufficio-recensione-" + a.id,
        url: "./",
      });
    }
  }
  for (const [codice, righe] of richieste) {
    const nome = righe[0].customer_name;
    fuori.push({
      title: "Nuova richiesta" + (righe[0].request_code ? " " + codice : ""),
      body: (nome ? nome + "\n" : "") + righe.map(a =>
        [escursione(a, titoli), giornoBreve(a.date), persone(a)].filter(Boolean).join(" · ")).join("\n"),
      tag: "ufficio-richiesta-" + codice,
      url: "./",
    });
  }
  return fuori;
}

// deno-lint-ignore no-explicit-any
async function mandaAllUfficio(db: any) {
  const { data, error } = await db.rpc("avvisi_ufficio_da_mandare");
  if (error) return { errore: error.message };
  const elenco = (data ?? []) as AvvisoUfficio[];
  if (!elenco.length) return { mandati: 0 };

  const { data: telefoni, error: errTel } = await db
    .from("ufficio_iscrizioni").select("endpoint, p256dh, auth");
  if (errTel) return { errore: errTel.message };
  if (!telefoni?.length) return { mandati: 0, senzaTelefoni: elenco.length };

  const messaggi = messaggiUfficio(elenco, await titoliDelCatalogo());
  let mandati = 0, falliti = 0;
  const morti = new Set<string>();
  for (const m of messaggi) {
    for (const tel of telefoni as { endpoint: string; p256dh: string; auth: string }[]) {
      if (morti.has(tel.endpoint)) continue;
      try {
        await webpush.sendNotification(
          { endpoint: tel.endpoint, keys: { p256dh: tel.p256dh, auth: tel.auth } },
          JSON.stringify(m),
          { TTL: DURATA, urgency: "high" },
        );
        mandati++;
      } catch (err) {
        falliti++;
        const stato = (err as { statusCode?: number }).statusCode;
        if (stato === 404 || stato === 410) morti.add(tel.endpoint);
        else console.error("avviso all'ufficio non partito", stato, (err as Error).message);
      }
    }
  }
  if (morti.size) await db.from("ufficio_iscrizioni").delete().in("endpoint", [...morti]);
  return { mandati, falliti };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return risposta({});
  if (!(await autorizzato(req))) return risposta({ errore: "non autorizzato" }, 401);

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

  const ufficio = await mandaAllUfficio(db);

  const { data: avvisi, error } = await db.rpc("notifiche_da_mandare");
  if (error) return risposta({ errore: error.message, ufficio }, 500);
  const elenco = (avvisi ?? []) as Avviso[];
  if (!elenco.length) return risposta({ mandati: 0, iscrizioniTolte: await pulisci(db), ufficio });

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

  return risposta({ mandati, falliti, promemoriaAssorbiti: assorbiti.length, iscrizioniTolte: await pulisci(db), ufficio });
});

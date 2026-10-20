// meteo-aemet: prende da AEMET le previsioni delle spiagge e le salva nella
// tabella meteo (supabase/modifiche/2026-10-20-meteo.sql). Il sito le legge
// in "Le mie prenotazioni", sulle escursioni confermate (meteo.js).
//
// Le spiagge: quelle delle zone del catalogo, per le prenotazioni (meteo.js,
// METEO_ZONE), e quelle della mappa (mappa.js, campo meteo). Una spiaggia nuova
// si aggiunge QUI e la' dove si mostra. Per "Teide e nord" le spiagge no:
// AEMET da' solo la previsione dei paesi, e quella di La Orotava (300 m) non
// dice niente del Teide (3700 m). Per il Teide c'e' il bollettino di montagna
// (20 ottobre 2026): vedi TEIDE piu' sotto.
//
// Chi la chiama: Cron di Supabase, ogni 3 ore. La funzione e' aperta (Verify
// JWT spento), come pulisci-foto: prende solo previsioni pubbliche e non
// restituisce niente dei clienti. Per non far consumare la chiave a chi la
// chiamasse di continuo, se l'ultimo aggiornamento ha meno di un'ora non chiede
// niente ad AEMET.
//
// La chiave AEMET sta SOLO nei Secrets (AEMET_API_KEY), mai nel repository.
// AEMET risponde in due passi: il primo da' l'indirizzo dei dati, il secondo i
// dati, in ISO-8859-15 (non UTF-8).

import { createClient } from "npm:@supabase/supabase-js@2";
import { extractText, getDocumentProxy } from "npm:unpdf@0.12.1";

// I codici delle spiagge: Playas_codigos.csv di AEMET (20 ottobre 2026).
// Nove spiagge, due chiamate ciascuna, ogni 3 ore: lontanissimi dai limiti.
const SPIAGGE = [
  "3800112",  // Fañabe, Adeje: zona Costa Adeje, e Playa del Duque sulla mappa
  "3800603",  // Las Vistas, Arona: zona Los Cristianos, e sulla mappa
  "3804004",  // La Arena, Puerto Santiago: zona Los Gigantes; mappa: La Arena, Los Guíos, La Jaquita
  "3801905",  // San Juan, Guía de Isora: mappa, Abama
  "3801705",  // El Médano, Granadilla: mappa, El Médano e La Tejita
  "3803806",  // Las Teresitas, Santa Cruz: mappa
  "3802601",  // El Bollullo, La Orotava: mappa
  "3802801",  // Jardín, Puerto de la Cruz: mappa
  "3803101",  // El Socorro, Los Realejos: mappa
];

const AEMET = "https://opendata.aemet.es/opendata/api/prediccion/especifica/playa/";
const UN_ORA = 60 * 60 * 1000;

function risposta(corpo: unknown, stato = 200): Response {
  return new Response(JSON.stringify(corpo), {
    status: stato,
    headers: { "Content-Type": "application/json" },
  });
}

// deno-lint-ignore no-explicit-any
type Giorno = any;

// I codici documentati da AEMET (metadati delle previsioni delle spiagge), e
// la descrizione che li accompagna. A volte il codice e' un altro, fuori
// elenco (il 20 ottobre 2026 a La Arena: -116 con "muy nuboso con lluvia",
// -126 con "chubascos"): allora vale la descrizione. Se non si riconosce
// nemmeno quella, il dato resta vuoto e la pagina non lo mostra: meglio niente
// che un cielo sbagliato.
const CODICI: Record<string, Record<string, number>> = {
  cielo: { "despejado": 100, "nuboso": 110, "muy nuboso": 120, "chubascos": 130, "muy nuboso con lluvia": 140 },
  vento: { "flojo": 210, "moderado": 220, "fuerte": 230 },
  onde: { "débil": 310, "moderado": 320, "fuerte": 330 },
};

function codice(tipo: string, numero: unknown, descrizione: unknown): number | null {
  const noti = CODICI[tipo];
  const n = Number(numero);
  if (Object.values(noti).includes(n)) return n;
  const testo = String(descrizione ?? "").trim().toLowerCase();
  return noti[testo] ?? null;
}

// Un giorno di AEMET → la riga della tabella. Solo numeri: i testi li scrive
// la pagina, nelle cinque lingue. Un giorno senza cielo o senza data si salta.
function riga(spiaggia: string, g: Giorno, elaborato: string | null) {
  const n = (x: unknown) => (x === undefined || x === null || x === "" ? null : Number(x));
  const coppia = (tipo: string, campo: Giorno) =>
    [codice(tipo, campo?.f1, campo?.descripcion1), codice(tipo, campo?.f2, campo?.descripcion2)];
  const f = String(g?.fecha ?? "");
  if (!/^\d{8}$/.test(f) || !g?.estadoCielo) return null;
  return {
    spiaggia,
    giorno: `${f.slice(0, 4)}-${f.slice(4, 6)}-${f.slice(6, 8)}`,
    dati: {
      cielo: coppia("cielo", g.estadoCielo),
      vento: coppia("vento", g.viento),
      onde: coppia("onde", g.oleaje),
      tmax: n(g.tMaxima?.valor1),
      acqua: n(g.tAgua?.valor1),
      uv: n(g.uvMax?.valor1),
    },
    // "2026-10-20T08:51:16", senza fuso orario: si salva come testo
    elaborato,
    aggiornato: new Date().toISOString(),
  };
}

// IL TEIDE (20 ottobre 2026, proprietario). AEMET fa ogni giorno, verso le 18,
// un bollettino di montagna per il Teide, ma solo in PDF (non sta in
// OpenData, quindi niente chiave). Si legge il testo e si prendono solo le
// temperature del giorno dopo, l'unico che ha la tabella:
//   "Pronóstico para el día 21 (miércoles) ... Teide (3715 m) -1 ( -3) 2 ( -2)"
// cioe' minima, (percepita), massima, (percepita). Cielo e pioggia sono frasi
// in spagnolo: non si prendono, il sito parla cinque lingue. Si salva sotto
// spiaggia "teide" (supabase/modifiche/2026-10-20-meteo-teide.sql). La riga
// di oggi resta quella del bollettino di ieri.
const TEIDE = "https://www.aemet.es/documentos/es/eltiempo/prediccion/montana/boletin_montana/BM_Teide.pdf";
const MESI = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
  "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

// Il testo del PDF → le righe della tabella meteo. Se il formato cambia e non
// si riconosce niente, nessuna riga: meglio niente che un numero sbagliato.
export function leggiTeide(testo: string) {
  const t = testo.replace(/\s+/g, " ");
  const fatto = t.match(/Día (\d{1,2}) de ([a-zé]+) de (\d{4}) a las (\d{1,2}:\d{2})/i);
  if (!fatto) return [];
  const mese = MESI.indexOf(fatto[2].toLowerCase());
  if (mese < 0) return [];
  const anno = Number(fatto[3]), giornoFatto = Number(fatto[1]);
  const pad = (n: number) => String(n).padStart(2, "0");
  const elaborato = `${anno}-${pad(mese + 1)}-${pad(giornoFatto)}T${fatto[4].padStart(5, "0")}:00`;
  const righe = [];
  const pezzi = t.split(/Pronóstico para el día /i).slice(1);
  for (const pezzo of pezzi) {
    const g = Number((pezzo.match(/^(\d{1,2})/) || [])[1]);
    if (!g) continue;
    // il giorno e' solo il numero: se e' piu' piccolo di quello del
    // bollettino, e' del mese dopo (31 ottobre → 1 novembre)
    const d = new Date(Date.UTC(anno, mese + (g < giornoFatto ? 1 : 0), g));
    const punti = [];
    const re = /([A-ZÁÉÍÓÚÑ][\wáéíóúñ ]*?) \((\d{3,4}) m\) (-?\d+) \( ?(-?\d+)\) (-?\d+) \( ?(-?\d+)\)/g;
    for (const m of pezzo.matchAll(re)) {
      punti.push({ nome: m[1].trim(), quota: Number(m[2]), min: Number(m[3]), stMin: Number(m[4]), max: Number(m[5]), stMax: Number(m[6]) });
    }
    if (!punti.length) continue;
    righe.push({
      spiaggia: "teide",
      giorno: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`,
      dati: { punti },
      elaborato,
      aggiornato: new Date().toISOString(),
    });
  }
  return righe;
}

async function teide() {
  const risposta = await fetch(TEIDE);
  if (!risposta.ok) throw new Error(`Teide: ${risposta.status}`);
  const pdf = await getDocumentProxy(new Uint8Array(await risposta.arrayBuffer()));
  const { text } = await extractText(pdf, { mergePages: true });
  const righe = leggiTeide(Array.isArray(text) ? text.join(" ") : text);
  if (!righe.length) throw new Error("Teide: bollettino non riconosciuto");
  return righe;
}

async function previsione(chiave: string, codice: string): Promise<{ elaborato: string | null; giorni: Giorno[] }> {
  const primo = await fetch(AEMET + codice, { headers: { api_key: chiave } });
  const passo = await primo.json();
  if (passo?.estado !== 200 || !passo?.datos) throw new Error(`AEMET ${codice}: ${passo?.estado} ${passo?.descripcion}`);
  const secondo = await fetch(passo.datos);
  const testo = new TextDecoder("iso-8859-15").decode(await secondo.arrayBuffer());
  const dati = JSON.parse(testo)?.[0];
  return { elaborato: dati?.elaborado ?? null, giorni: dati?.prediccion?.dia ?? [] };
}

Deno.serve(async () => {
  const chiave = Deno.env.get("AEMET_API_KEY");
  if (!chiave) return risposta({ errore: "manca AEMET_API_KEY nei Secrets" }, 500);

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  // il freno: meno di un'ora dall'ultimo giro, non si chiama AEMET
  const { data: ultimo } = await db.from("meteo").select("aggiornato")
    .order("aggiornato", { ascending: false }).limit(1);
  if (ultimo?.[0] && Date.now() - new Date(ultimo[0].aggiornato).getTime() < UN_ORA) {
    return risposta({ saltato: "aggiornato meno di un'ora fa" });
  }

  const righe = [];
  const errori: string[] = [];
  for (const codice of SPIAGGE) {
    try {
      const { elaborato, giorni } = await previsione(chiave, codice);
      for (const g of giorni) {
        const r = riga(codice, g, elaborato);
        if (r) righe.push(r);
      }
    } catch (err) {
      // una spiaggia che non risponde non ferma le altre; la sua riga vecchia
      // resta finche' il giorno non passa
      errori.push((err as Error).message);
    }
  }

  try {
    righe.push(...await teide());
  } catch (err) {
    errori.push((err as Error).message);
  }

  if (righe.length) {
    const { error } = await db.from("meteo").upsert(righe, {  onConflict: "spiaggia,giorno" });
    if (error) return risposta({ errore: error.message }, 500);
  }
  // i giorni passati non servono piu'
  const oggi = new Intl.DateTimeFormat("en-CA", { timeZone: "Atlantic/Canary" }).format(new Date());
  await db.from("meteo").delete().lt("giorno", oggi);

  return risposta({ salvati: righe.length, errori });
});

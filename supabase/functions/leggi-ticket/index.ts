// leggi-ticket: la foto di un ticket di carta → i campi del modulo dei venditori.
//
// Gira su Supabase (Edge Function, Deno), NON nel sito: qui dentro c'e' la
// chiave di Anthropic, e dal sito non deve mai passare. La chiave si mette in
// Supabase → Edge Functions → Secrets, col nome ANTHROPIC_API_KEY.
//
// Chi la chiama: venditori.js, con sb.functions.invoke("leggi-ticket", …).
// Riceve: { image: <JPEG in base64>, catalogo: [...], oggi: "AAAA-MM-GG" }
// Risponde: { campi: {...} }   oppure   { errore: "..." } con uno stato HTTP.
//
// La funzione NON salva niente: legge e risponde. Il venditore controlla i
// campi e salva lui, come prima. Un campo letto male costa un'occhiata; un
// campo inventato sarebbe peggio di un campo vuoto, e il prompt lo dice.

import Anthropic from "npm:@anthropic-ai/sdk@0.129.0";
import { createClient } from "npm:@supabase/supabase-js@2";

// Il modello di default per questo lavoro. Legge scrittura a mano, numeri
// evidenziati e foto storte: e' il caso in cui conta essere bravi.
const MODELLO = "claude-opus-5-5";

// La chiave pubblica del sito, la stessa di supabase-config.js: serve solo a
// chiedere a Supabase "chi e' questo utente". Supabase di solito la mette gia'
// in SUPABASE_ANON_KEY; se non c'e', si usa questa.
const CHIAVE_PUBBLICA = "sb_publishable_Qjmd8qP9J_GH1WjUmBolSw_vBdM5G3L";

// Una foto rimpicciolita dal telefono pesa 150-300 KB (400 KB in base64).
// 6 MB di testo sono gia' dieci volte tanto: oltre, e' un errore o un abuso.
const MASSIMO_IMMAGINE = 6_000_000;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function risposta(corpo: unknown, stato = 200): Response {
  return new Response(JSON.stringify(corpo), {
    status: stato,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

// ─── Cosa deve restituire Claude ────────────────────────────────────────────
// Con output_config.format la risposta e' SEMPRE un JSON con questa forma: non
// serve cercarlo in mezzo al testo. Ogni campo puo' essere null (= non c'e' o
// non si legge), e "dubbi" elenca i campi letti ma incerti.

const testo = { anyOf: [{ type: "string" }, { type: "null" }] };
const intero = { anyOf: [{ type: "integer" }, { type: "null" }] };
const cifra = { anyOf: [{ type: "number" }, { type: "null" }] };

const CAMPI = {
  ticket_number: testo,
  reference: testo,
  excursion_text: testo,
  excursion_id: testo,
  option_label: testo,
  date: testo,
  time: testo,
  meeting_point: testo,
  hotel: testo,
  nationality: testo,
  phone: testo,
  adults: intero,
  kids: intero,
  babies: intero,
  total: cifra,
  deposit: cifra,
  rest_to_pay: cifra,
  paid_in_full: { type: "boolean" },
  seller: testo,
  notes: testo,
  dubbi: { type: "array", items: { type: "string" } },
};

const SCHEMA = {
  type: "object",
  properties: CAMPI,
  required: Object.keys(CAMPI),
  additionalProperties: false,
};

// ─── Le istruzioni ─────────────────────────────────────────────────────────
// Stanno nel "system", insieme all'elenco delle escursioni: sono uguali per
// tutte le foto, quindi Anthropic le tiene in cache (cache_control sotto) e dalla
// seconda foto in poi costano un decimo. Tutto quello che cambia (la foto, la
// data di oggi) va nel messaggio, DOPO.

const ISTRUZIONI = `Leggi la foto di un ticket di carta di Admiral Excursions (Tenerife), compilato a mano da un venditore, e trascrivi i campi.

Regole generali:
- Scrivi solo quello che leggi sul ticket. Un campo vuoto, sbarrato o illeggibile vale null. Non inventare mai un valore e non dedurlo da altri campi.
- Se leggi un campo ma non sei sicuro di una cifra o di una lettera, scrivilo lo stesso e metti il nome del campo nell'elenco "dubbi". Il telefono, il numero del ticket, la data e l'ora vanno in "dubbi" appena c'è un'incertezza: sono i campi che, sbagliati, fanno più danno.
- La foto può essere ruotata, storta o avere sopra dell'evidenziatore: leggi il ticket come se fosse dritto.

Campo per campo:
- ticket_number: il numero stampato in rosso accanto a "TICKET NUMBER".
- reference: il numero scritto a mano dopo "REF", di solito in alto. Solo il numero.
- excursion_text: quello che è scritto accanto a "Excursion", così com'è.
- excursion_id: l'id dell'escursione dell'elenco qui sotto che corrisponde a excursion_text (il nome della barca o del tour). null se nessuna corrisponde con sicurezza.
- option_label: la variante (per esempio la durata) solo se il ticket la indica, scelta tra quelle elencate per quell'escursione e scritta esattamente come nell'elenco. Altrimenti null.
- date: il ticket scrive giorno/mese all'europea (1/10 = 1 ottobre), spesso con il giorno della settimana in inglese (THURS, SAT…), quasi mai l'anno. Restituisci AAAA-MM-GG, con l'anno che rende la data uguale o successiva a oggi. Se il giorno della settimana scritto non corrisponde alla data, metti "date" in "dubbi".
- time: l'ora accanto a "Time", in formato 24 ore HH:MM (9.40 → 09:40).
- meeting_point: il punto di incontro, così com'è scritto (per esempio "Puerto Colón, Gate 15").
- hotel: l'hotel e l'eventuale numero di camera, così come sono scritti.
- nationality: il codice ISO di due lettere (GB, IT, ES, DE…) solo se sul ticket è scritta una nazionalità. Non dedurla dal telefono.
- phone: il numero accanto a "Contact Number" così com'è scritto, compresi il + e il prefisso se ci sono. Solo cifre, spazi e +.
- adults, kids, babies: numeri interi. Una casella vuota, con una barra o con un trattino vale null.
- total, deposit, rest_to_pay ("To Pay"): importi in euro, come numeri.
- paid_in_full: true se Deposit e To Pay sono entrambi sbarrati ("/" o "—") e il Total è scritto: vuol dire che il cliente ha pagato tutto. In quel caso deposit e rest_to_pay valgono null. Altrimenti false.
- seller: le sigle o i nomi dei venditori, di solito nel riquadro della firma ("FRA / MATT"), così come sono scritti. Non la firma del cliente.
- notes: eventuali osservazioni scritte a mano che non stanno in nessun altro campo. Altrimenti null.

Elenco delle escursioni (id — titolo — varianti):
`;

type Scheda = { id: string; title: string; options?: string[] };

function elencoEscursioni(catalogo: Scheda[]): string {
  return catalogo
    .map((s) => `${s.id} — ${s.title}${s.options && s.options.length ? " — " + s.options.join(" | ") : ""}`)
    .join("\n");
}

// Il catalogo arriva dal sito (esplora-catalog.js) a ogni chiamata: una fonte
// sola, e quando si aggiunge una scheda la funzione la conosce subito.
// Si controlla la forma, perche' finisce nel prompt.
function catalogoValido(x: unknown): x is Scheda[] {
  return Array.isArray(x) && x.length > 0 && x.length < 500 && x.every((s) =>
    s && typeof s.id === "string" && typeof s.title === "string" &&
    (s.options === undefined || (Array.isArray(s.options) && s.options.every((o: unknown) => typeof o === "string")))
  );
}

// ─── La funzione ────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return risposta({ errore: "Solo POST." }, 405);

  // 1. Solo i venditori. Si chiede a Supabase, con il login di chi chiama,
  //    di leggere la sua riga in `sellers`: le regole dello schema la danno
  //    solo a un venditore. Senza questo controllo chiunque potrebbe far
  //    leggere foto a Claude a spese di Admiral.
  const autorizzazione = req.headers.get("Authorization") ?? "";
  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY") ?? CHIAVE_PUBBLICA,
    { global: { headers: { Authorization: autorizzazione } }, auth: { persistSession: false } },
  );
  const { data: venditori, error: errVenditore } = await sb.from("sellers").select("name").limit(1);
  if (errVenditore || !venditori || !venditori.length) {
    return risposta({ errore: "Solo i venditori possono leggere i ticket." }, 401);
  }

  // 2. La richiesta.
  let corpo: { image?: unknown; catalogo?: unknown; oggi?: unknown };
  try {
    corpo = await req.json();
  } catch {
    return risposta({ errore: "Richiesta non leggibile." }, 400);
  }
  const { image, catalogo, oggi } = corpo;
  if (typeof image !== "string" || !image || image.length > MASSIMO_IMMAGINE || !/^[A-Za-z0-9+/=]+$/.test(image)) {
    return risposta({ errore: "Foto mancante o troppo grande." }, 400);
  }
  if (!catalogoValido(catalogo)) return risposta({ errore: "Catalogo mancante." }, 400);
  if (typeof oggi !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(oggi)) {
    return risposta({ errore: "Data di oggi mancante." }, 400);
  }

  const chiave = Deno.env.get("ANTHROPIC_API_KEY");
  if (!chiave) return risposta({ errore: "Manca la chiave di Anthropic nei Secrets di Supabase." }, 500);
  const client = new Anthropic({ apiKey: chiave });

  // 3. La lettura.
  let messaggio;
  try {
    messaggio = await client.beta.messages.create({
      model: MODELLO,
      max_tokens: 16000,
      // Se i filtri di sicurezza rifiutassero la richiesta (improbabile con un
      // ticket, ma possibile), Anthropic la ripete da solo su un altro modello.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      // "medium" e' anche il default di questo modello: scritto qui per non
      // dipendere da un default che puo' cambiare.
      output_config: { effort: "medium", format: { type: "json_schema", schema: SCHEMA } },
      system: [{
        type: "text",
        text: ISTRUZIONI + elencoEscursioni(catalogo),
        cache_control: { type: "ephemeral" },
      }],
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/jpeg", data: image } },
          { type: "text", text: `Oggi è ${oggi}. Leggi questo ticket.` },
        ],
      }],
    });
  } catch (err) {
    console.error(err);
    if (err instanceof Anthropic.RateLimitError) {
      return risposta({ errore: "Troppe foto insieme: riprova fra un minuto." }, 429);
    }
    if (err instanceof Anthropic.AuthenticationError) {
      return risposta({ errore: "La chiave di Anthropic non è valida." }, 500);
    }
    if (err instanceof Anthropic.APIError) {
      return risposta({ errore: `Anthropic ha risposto ${err.status}.` }, 502);
    }
    return risposta({ errore: "Anthropic non raggiungibile." }, 502);
  }

  if (messaggio.stop_reason === "refusal") {
    return risposta({ errore: "La foto non è stata letta. Compila a mano." }, 422);
  }
  if (messaggio.stop_reason === "max_tokens") {
    return risposta({ errore: "Lettura interrotta. Riprova o compila a mano." }, 502);
  }

  const blocco = messaggio.content.find((b) => b.type === "text");
  let campi: Record<string, unknown>;
  try {
    campi = JSON.parse(blocco && blocco.type === "text" ? blocco.text : "");
  } catch {
    return risposta({ errore: "Risposta non leggibile. Compila a mano." }, 502);
  }

  // 4. Controlli finali: l'escursione e la variante devono esistere davvero
  //    nel catalogo, altrimenti il menu del modulo non le troverebbe.
  const scheda = catalogo.find((s) => s.id === campi.excursion_id);
  if (!scheda) campi.excursion_id = null;
  if (!scheda || !(scheda.options ?? []).includes(campi.option_label as string)) campi.option_label = null;

  // Quanto e' costata, per tenerlo d'occhio nei log di Supabase.
  console.log(JSON.stringify({ ticket: campi.ticket_number, uso: messaggio.usage }));

  return risposta({ campi });
});

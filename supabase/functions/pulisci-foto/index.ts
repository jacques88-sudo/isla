// pulisci-foto: cancella le foto dei ticket che non appartengono piu' a nessun
// ticket.
//
// Perche' una funzione e non una riga SQL: Supabase non permette di togliere i
// file dello spazio con SQL (sparirebbe la riga in storage.objects, ma il file
// resterebbe e occuperebbe spazio). Si passa dall'API dello spazio, come fa la
// pagina dei venditori quando carica.
//
// Chi la chiama: Cron di Supabase, ogni notte alle 3:30
// (supabase/modifiche/2026-10-01-pulizia-foto.sql). Si puo' anche aprire a mano
// l'indirizzo della funzione per provarla.
//
// Una foto e' "orfana" quando nessuna riga di bookings la nomina in photo_path:
//   - il ticket e' stato tolto dalla pulizia mensile (pulisci_ticket_vecchi);
//   - la foto e' stata caricata ma il ticket non e' mai stato salvato (rete
//     caduta fra il caricamento e il salvataggio, doppione scoperto tardi).
// Si cancellano solo le orfane con PIU' DI UN GIORNO: una foto appena caricata
// e' orfana per un secondo, fra il caricamento e il salvataggio del ticket.
//
// La funzione e' aperta (Verify JWT spento): chi la chiamasse otterrebbe solo
// quello che fa gia' lei ogni notte, cioe' togliere foto senza ticket. Non
// riceve niente e non restituisce dati dei clienti, solo dei conteggi.

import { createClient } from "npm:@supabase/supabase-js@2";

const SPAZIO = "ticket-foto";
const UN_GIORNO = 24 * 60 * 60 * 1000;
const PAGINA = 1000;          // quante righe o file chiedere per volta
const BLOCCO = 100;           // quanti file cancellare per volta

function risposta(corpo: unknown, stato = 200): Response {
  return new Response(JSON.stringify(corpo), {
    status: stato,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async () => {
  // La chiave "service_role" c'e' gia' nei Secrets di ogni funzione, la mette
  // Supabase: scavalca le regole, e qui serve per vedere tutti i ticket e tutte
  // le foto. Resta sul server; il sito non la vede mai.
  const url = Deno.env.get("SUPABASE_URL");
  const chiave = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !chiave) return risposta({ errore: "Mancano SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY." }, 500);
  const sb = createClient(url, chiave, { auth: { persistSession: false } });

  // 1. Le foto che i ticket nominano: quelle restano.
  const usate = new Set<string>();
  for (let da = 0; ; da += PAGINA) {
    const { data, error } = await sb
      .from("bookings")
      .select("photo_path")
      .not("photo_path", "is", null)
      .order("id")
      .range(da, da + PAGINA - 1);
    if (error) return risposta({ errore: "Ticket non leggibili: " + error.message }, 500);
    data.forEach((r) => usate.add(r.photo_path as string));
    if (data.length < PAGINA) break;
  }

  // 2. Le foto nello spazio. Stanno tutte nella radice (venditori.js le salva
  //    come "<ticket>-<ora>.jpg"); le cartelle, se mai ce ne fossero, si saltano.
  const orfane: string[] = [];
  let controllate = 0;
  const limite = Date.now() - UN_GIORNO;
  for (let da = 0; ; da += PAGINA) {
    const { data, error } = await sb.storage.from(SPAZIO).list("", {
      limit: PAGINA,
      offset: da,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) return risposta({ errore: "Foto non leggibili: " + error.message }, 500);
    for (const f of data) {
      if (!f.id) continue;                       // una cartella, non un file
      controllate++;
      const creata = Date.parse(f.created_at ?? "");
      if (!usate.has(f.name) && Number.isFinite(creata) && creata < limite) orfane.push(f.name);
    }
    if (data.length < PAGINA) break;
  }

  // 3. Via le orfane, a blocchi.
  let cancellate = 0;
  for (let i = 0; i < orfane.length; i += BLOCCO) {
    const blocco = orfane.slice(i, i + BLOCCO);
    const { error } = await sb.storage.from(SPAZIO).remove(blocco);
    if (error) {
      return risposta({ errore: "Cancellazione interrotta: " + error.message, controllate, cancellate }, 500);
    }
    cancellate += blocco.length;
  }

  const esito = { controllate, nei_ticket: usate.size, cancellate };
  console.log(JSON.stringify(esito));
  return risposta(esito);
});

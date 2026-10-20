-- 20 ottobre 2026: il meteo sulle escursioni confermate (proprietario).
--
-- In "Le mie prenotazioni", sulle escursioni confermate di oggi, domani e
-- dopodomani, una riga con la previsione della zona: cielo, vento, onde,
-- temperatura, acqua, UV. Solo i dati, nessun giudizio ("buona giornata per la
-- barca" no): se si esce lo decide l'operatore.
--
-- I dati sono di AEMET (l'agenzia meteo dello Stato spagnolo), previsioni delle
-- spiagge: "Autorizado el uso de la información y su reproducción citando a
-- AEMET como autora de la misma". In pagina si scrive sempre "Fonte: AEMET".
-- Le prende la funzione meteo-aemet (supabase/functions/meteo-aemet/), con la
-- chiave che sta SOLO nei Secrets (AEMET_API_KEY), e le salva qui. Il sito le
-- legge da meteo_prossimi(): niente dati dei clienti, solo il tempo.
--
-- Come si usa, UNA volta sola:
--   1. Edge Functions → Secrets → Add new secret: nome AEMET_API_KEY,
--      valore la chiave di AEMET;
--   2. Edge Functions → Deploy a new function → nome meteo-aemet → incollare
--      supabase/functions/meteo-aemet/index.ts → Deploy. "Verify JWT" SPENTO
--      (l'orologio un login non ce l'ha; vedi il commento nella funzione);
--   3. SQL Editor → New query → incollare TUTTO questo file → Run.
-- Si puo' rilanciare: non rompe niente.


-- 1. LA TABELLA ---------------------------------------------------------------
-- Una riga per zona e giorno. "dati" e' quello che serve alla pagina:
--   {"cielo": [mattina, pomeriggio], "vento": [..], "onde": [..],
--    "tmax": 27, "acqua": 24, "uv": 5}
-- con i codici di AEMET (cielo 100-140, vento 210-230, onde 310-330).

create table if not exists public.meteo (
  zona        text not null check (zona in ('costa-adeje', 'los-cristianos', 'los-gigantes')),
  giorno      date not null,
  dati        jsonb not null,
  -- quando AEMET l'ha fatta, com'e' scritto da loro ("2026-10-20T08:51:16",
  -- senza fuso orario: per questo testo e non un'ora; serve solo a controllare)
  elaborato   text,
  aggiornato  timestamptz not null default now(), -- quando l'abbiamo presa
  primary key (zona, giorno)
);

alter table public.meteo enable row level security;
-- Nessuna regola: dal sito nessuno legge ne' scrive la tabella. Scrive solo la
-- funzione (service_role), si legge da meteo_prossimi().
grant select, insert, update, delete on public.meteo to service_role;


-- 2. IL SITO LEGGE ------------------------------------------------------------

create or replace function public.meteo_prossimi()
returns table (zona text, giorno date, dati jsonb)
language sql
stable
security definer
set search_path = ''
as $$
  select m.zona, m.giorno, m.dati
    from public.meteo m
   where m.giorno >= (now() at time zone 'Atlantic/Canary')::date
   order by m.giorno, m.zona;
$$;

revoke all on function public.meteo_prossimi() from public;
grant execute on function public.meteo_prossimi() to anon, authenticated;


-- 3. L'OROLOGIO ---------------------------------------------------------------
-- Ogni 3 ore, al minuto 7. AEMET rifa' le previsioni delle spiagge due volte
-- al giorno: ogni 3 ore basta per averle fresche poco dopo.

select cron.schedule(
  'meteo-aemet',
  '7 */3 * * *',
  $$
  select net.http_post(
    url     := 'https://vjotkgsjtwmtctxtfeqa.supabase.co/functions/v1/meteo-aemet',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body    := '{}'::jsonb
  );
  $$
);


-- Per controllare, dopo il primo giro (o aprendo a mano l'indirizzo della
-- funzione): devono esserci 3 zone per 3 giorni.
--   select zona, giorno, dati, elaborato, aggiornato from public.meteo order by giorno, zona;

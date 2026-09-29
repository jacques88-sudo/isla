-- 30 settembre 2026: la pulizia mensile dei ticket vecchi.
--
-- La regola (proprietario): ogni mese si cancellano i ticket delle escursioni di
-- DUE mesi prima. Il 1° marzo spariscono quelli di gennaio (e piu' vecchi);
-- quelli di febbraio restano fino al 1° aprile. Conta la DATA DELL'ESCURSIONE,
-- non quella di inserimento: un ticket venduto oggi per un'escursione fra tre
-- mesi resta finche' serve.
--
-- Come si usa, UNA volta sola:
--   1. Supabase → Integrations → Cron → attivarlo ("Enable").
--   2. SQL Editor → New query → incollare TUTTO questo file → Run.
--
-- Le foto dei ticket NON si cancellano da qui: Supabase non permette di
-- togliere i file con SQL (resterebbero nello spazio senza piu' un ticket).
-- Per le foto servira' un passo a parte.


-- 1. La pulizia, come funzione: si puo' anche lanciare a mano per provarla.
--    Restituisce quanti ticket ha cancellato.
create or replace function public.pulisci_ticket_vecchi()
returns integer
language plpgsql
set search_path = ''
as $$
declare
  -- Il primo giorno del mese scorso: il 1° marzo diventa il 1° febbraio.
  -- Si cancella tutto quello che viene PRIMA (gennaio e indietro).
  limite date := (date_trunc('month', current_date) - interval '1 month')::date;
  quanti integer;
begin
  delete from public.bookings
   where date < limite
      -- ticket rimasti senza data (una foto caricata e mai confermata):
      -- contano i giorni da quando sono stati inseriti
      or (date is null and created_at < limite);
  get diagnostics quanti = row_count;
  return quanti;
end;
$$;

-- IMPORTANTE: nessuno dal sito puo' lanciarla. In Postgres una funzione nuova
-- la puo' chiamare chiunque; senza queste righe un visitatore qualsiasi potrebbe
-- cancellare i ticket passando dall'indirizzo pubblico di Supabase.
revoke all on function public.pulisci_ticket_vecchi() from public;
revoke all on function public.pulisci_ticket_vecchi() from anon, authenticated;


-- 2. L'orologio: il giorno 1 di ogni mese alle 3:00 (ora UTC: a Tenerife le 3
--    d'inverno, le 4 d'estate). Se il lavoro esiste gia' con questo nome, viene
--    sostituito: il file si puo' rilanciare.
select cron.schedule(
  'pulizia-ticket-vecchi',
  '0 3 1 * *',
  $$ select public.pulisci_ticket_vecchi(); $$
);


-- Per controllare, in seguito (una query alla volta):
--
--   quali lavori ci sono:
--     select jobname, schedule, active from cron.job;
--
--   come sono andate le ultime volte:
--     select start_time, status, return_message
--       from cron.job_run_details order by start_time desc limit 5;
--
--   quanti ticket cancellerebbe OGGI, senza cancellare niente:
--     select count(*) from public.bookings
--      where date < (date_trunc('month', current_date) - interval '1 month')::date;

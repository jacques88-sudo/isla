-- 1° ottobre 2026: ogni notte si cancellano le foto dei ticket che non hanno
-- piu' un ticket.
--
-- Il lavoro lo fa la funzione supabase/functions/pulisci-foto (con SQL le
-- foto non si possono cancellare: vedi il commento in quel file). Qui c'e'
-- solo l'orologio che la chiama, alle 3:30 (ora UTC), mezz'ora dopo la pulizia
-- dei ticket (2026-09-30-pulizia-mensile.sql): quella libera le foto il giorno
-- 1 del mese, questa le toglie. Gira ogni notte e non solo il giorno 1 perche'
-- tiene pulite anche le foto rimaste a meta' (caricate, ticket mai salvato).
--
-- Prima di lanciare questo file:
--   1. pubblicare la funzione pulisci-foto (Edge Functions → Deploy a new
--      function → Via Editor, nome "pulisci-foto") e spegnere "Verify JWT"
--      nelle sue impostazioni: l'orologio la chiama senza login;
--   2. Cron gia' attivo (lo e' dal 30 settembre).
--
-- Poi: SQL Editor → New query → incollare TUTTO → Run. Si puo' rilanciare:
-- un lavoro con lo stesso nome viene sostituito.


-- pg_net: l'estensione che permette al database di chiamare un indirizzo web.
create extension if not exists pg_net with schema extensions;

select cron.schedule(
  'pulizia-foto-orfane',
  '30 3 * * *',
  $$
  select net.http_post(
    url     := 'https://vjotkgsjtwmtctxtfeqa.supabase.co/functions/v1/pulisci-foto',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body    := '{}'::jsonb
  );
  $$
);


-- Per controllare, in seguito (una query alla volta):
--
--   i lavori:
--     select jobname, schedule, active from cron.job;
--
--   le ultime chiamate e la risposta della funzione (i conteggi):
--     select created, status_code, content from net._http_response
--      order by created desc limit 5;

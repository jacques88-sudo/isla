-- 16 ottobre 2026: la funzione manda-notifiche non risponde piu' a chiunque.
--
-- Prima era aperta: chiunque conoscesse l'indirizzo poteva farla partire.
-- Mandava solo gli avvisi gia' dovuti, e mai due volte, ma ogni chiamata la
-- faceva lavorare. Ora risponde solo a due:
--   - venditori.html, col login del venditore (dopo Conferma o Annulla);
--   - l'orologio di Cron, con una PAROLA SEGRETA nell'intestazione "x-orologio".
--
-- La parola segreta NON sta in questo file (il repository e' pubblico): qui
-- c'e' un segnaposto al suo posto. Claude prepara la copia con la
-- parola vera nella scratchpad, come per i netti.
--
-- IN QUESTO ORDINE (se la funzione nuova arriva prima dell'orologio nuovo,
-- per qualche minuto i promemoria si fermano):
--   1. Edge Functions → Secrets → Add new secret:
--        nome  OROLOGIO_SEGRETO
--        valore la parola segreta
--   2. SQL Editor: incolla la copia di questo file con la parola vera → Run.
--      Rifa' il lavoro di Cron "manda-notifiche" con la stessa ora (ogni 10
--      minuti): cron.schedule con lo stesso nome sostituisce quello vecchio.
--   3. Edge Functions → manda-notifiche → incolla il nuovo index.ts → Deploy.
--      "Verify JWT" resta SPENTO: l'orologio un login non ce l'ha, e il
--      controllo lo fa la funzione da se'.
--
-- Per cambiare la parola: rifare 1 e 2 con quella nuova.

select cron.schedule(
  'manda-notifiche',
  '*/10 * * * *',
  $$
  select net.http_post(
    url     := 'https://vjotkgsjtwmtctxtfeqa.supabase.co/functions/v1/manda-notifiche',
    headers := '{"Content-Type": "application/json", "x-orologio": "METTI-QUI-LA-PAROLA"}'::jsonb,
    body    := '{}'::jsonb
  );
  $$
);

-- Per controllare, dopo 10 minuti (una query alla volta):
--
--   l'orologio c'e' e porta la parola (deve comparire "x-orologio"):
--     select jobname, schedule, command from cron.job where jobname = 'manda-notifiche';
--
--   le ultime risposte della funzione (deve essere 200, non 401):
--     select status_code, content, created from net._http_response
--      order by created desc limit 5;

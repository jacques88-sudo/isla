-- Il meteo del Teide (20 ottobre 2026, proprietario).
--
-- La funzione meteo-aemet legge anche il bollettino di montagna di AEMET per
-- il Teide e lo salva nella tabella meteo con spiaggia = 'teide' (dati:
-- {"punti": [{"nome": "Teide", "quota": 3715, "min": -1, "stMin": -3,
-- "max": 2, "stMax": -2}, ...]}). La tabella accettava solo i codici di sette
-- cifre delle spiagge: qui si aggiunge "teide". meteo_prossimi() non cambia.
--
-- Si incolla nel SQL Editor di Supabase, DOPO 2026-10-20-meteo.sql, e poi si
-- ridistribuisce la funzione meteo-aemet.

alter table public.meteo drop constraint if exists meteo_spiaggia_check;
alter table public.meteo
  add constraint meteo_spiaggia_check
  check (spiaggia ~ '^([0-9]{7}|teide)$');

-- Per controllare, dopo il primo giro della funzione:
--   select giorno, dati, elaborato from public.meteo where spiaggia = 'teide';

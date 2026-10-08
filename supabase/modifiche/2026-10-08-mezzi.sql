-- 8 ottobre 2026: quanti mezzi, e di che tipo, sul ticket.
--
-- Sul ticket di carta delle moto d'acqua, dei buggy, dei quad e delle Mustang
-- il venditore scrive il numero di mezzi e il tipo ("2 doppie", "1 buggy da 4
-- posti"). Fin qui nel database si perdeva: c'erano solo adulti, bambini e
-- neonati. Serve per sapere quanto va alla compagnia quando il netto e' a
-- mezzo e non a persona.
--
-- La colonna tiene un oggetto con le chiavi dei tipi di esplora-catalog.js
-- (units.types[].key) e quanti ce ne sono:  {"singola": 2, "doppia": 1}
-- Vuota (null) sulle escursioni che non vanno a mezzo.
--
-- Si incolla in Supabase → SQL Editor → New query → Run. Una volta sola;
-- se lanciato di nuovo non fa danni ("if not exists").

alter table public.bookings
  add column if not exists units jsonb
  check (units is null or jsonb_typeof(units) = 'object');

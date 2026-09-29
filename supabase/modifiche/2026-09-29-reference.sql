-- 29 settembre 2026: il campo REF del ticket.
--
-- Per un database creato PRIMA di questa data con schema.sql. Chi crea il
-- database da zero non ne ha bisogno: schema.sql ha gia' la colonna.
--
-- Si incolla in Supabase → SQL Editor → New query → Run. Una volta sola;
-- se lanciato di nuovo non fa danni ("if not exists").

alter table public.bookings add column if not exists reference text;

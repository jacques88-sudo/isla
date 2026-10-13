-- 8 ottobre 2026: i netti delle compagnie, e la compagnia sul ticket.
--
-- Il NETTO e' quanto Isla paga alla compagnia: barca da 100 €, netto 40 →
-- 40 alla compagnia, 60 a Isla.
--
-- QUESTO FILE CREA SOLO LA TABELLA, VUOTA. I numeri NON vanno mai scritti in
-- un file del progetto: il repository e' pubblico e chiunque potrebbe leggerli.
-- I netti si inseriscono a parte, incollando nel SQL Editor il testo che
-- prepara Claude in chat (vedi CLAUDE.md, "I netti delle compagnie").
--
-- Lo stesso giro puo' essere di compagnie diverse con netti diversi (Teide by
-- Night: la serata italiana del gruppo piccolo e' di Andromeda, quelle in
-- inglese e tedesco no). Per questo un netto dice scheda, variante E compagnia,
-- e il ticket dice la compagnia (colonna company, con i `nomi` del catalogo).
--
-- Si incolla in Supabase → SQL Editor → New query → Run, DOPO
-- 2026-10-08-mezzi.sql. Una volta sola; lanciato di nuovo non fa danni.

-- 1. La compagnia sul ticket: uno dei `nomi` della scheda ("Andromeda"), o
--    vuota se sul ticket non c'e'.
alter table public.bookings add column if not exists company text;

-- 2. I netti.
create table if not exists public.nets (
  id            uuid primary key default gen_random_uuid(),
  excursion_id  text not null,           -- l'id della scheda (es. "la-gomera")
  option_label  text,                    -- la variante, in italiano; null = tutte
  company       text,                    -- uno dei `nomi`; null = qualunque compagnia
  net_adult     numeric(8,2) check (net_adult  >= 0),
  net_child     numeric(8,2) check (net_child  >= 0),
  net_infant    numeric(8,2) check (net_infant >= 0),
  -- A mezzo, con le chiavi di units.types del catalogo: {"doppia": 30}.
  net_units     jsonb check (net_units is null or jsonb_typeof(net_units) = 'object'),
  updated_at    timestamptz not null default now()
);

-- Una riga sola per scheda + variante + compagnia: aggiornare un netto vuol
-- dire cambiare quella riga, non aggiungerne un'altra.
create unique index if not exists nets_unico
  on public.nets (excursion_id, coalesce(option_label, ''), coalesce(company, ''));

alter table public.nets enable row level security;

-- Li leggono i venditori (il promemoria nel modulo) e l'ufficio. Nessuno li
-- scrive dal sito: si cambiano solo dal SQL Editor, che passa sopra a queste
-- regole. Il cliente (anon) non legge niente.
drop policy if exists "i venditori leggono i netti" on public.nets;
create policy "i venditori leggono i netti"
  on public.nets for select
  to authenticated
  using (public.is_seller());

grant select on public.nets to authenticated;

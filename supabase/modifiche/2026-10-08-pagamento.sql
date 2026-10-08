-- 8 ottobre 2026: card o cash sul ticket, e le commissioni nel foglio Google.
--
-- La COMMISSIONE di un ticket e' il totale meno il netto: quello che resta a
-- Isla. Si divide fra il venditore e l'ufficio secondo come ha pagato il
-- cliente, una cosa sola per ticket (proprietario, 8 ottobre 2026):
--   - card → una parte al venditore e il resto all'ufficio;
--   - cash → un'altra parte.
-- Si conta sempre sul TOTALE, anche se il cliente paga il resto dopo.
--
-- QUANTO va al venditore NON e' scritto qui: il progetto e' pubblico, e le
-- percentuali sono roba dell'ufficio come i netti. Stanno nella tabella
-- commission_rates, che nasce VUOTA e si riempie col testo che prepara Claude
-- in chat. Finche' e' vuota, nel foglio le due colonne restano vuote.
--
-- Si incolla in Supabase → SQL Editor → New query → Run, DOPO
-- 2026-10-08-foglio.sql. Lanciato di nuovo non fa danni.

-- 1. Card o cash sul ticket. Lo sceglie il venditore nel modulo (sul ticket di
--    carta non e' scritto). Vuoto sui ticket di prima e sulle richieste WhatsApp.
alter table public.bookings
  add column if not exists payment_method text
  check (payment_method in ('card', 'cash'));

-- I venditori leggono bookings colonna per colonna (2026-10-08-foglio.sql):
-- la colonna nuova va data anche a loro, se no la pagina non la legge.
grant select (payment_method) on public.bookings to authenticated;

-- 2. Le percentuali. seller_share e' la parte del VENDITORE, da 0 a 1 (0.40 =
--    40%); all'ufficio va il resto. Nessun permesso a nessuno: la legge solo
--    la porta del foglio.
create table if not exists public.commission_rates (
  payment_method text primary key check (payment_method in ('card', 'cash')),
  seller_share   numeric(5,4) not null check (seller_share between 0 and 1),
  updated_at     timestamptz not null default now()
);
alter table public.commission_rates enable row level security;
revoke all on public.commission_rates from anon, authenticated;

-- 3. La porta del foglio, con le colonne nuove. Quello che c'era resta uguale;
--    in piu': pagamento, pagato, commissione, al venditore, all'ufficio.
--   pagato        = totale meno il resto da pagare (un ticket "pagato tutto"
--                   ha il resto a 0); se il resto non c'e', l'acconto
--   commissione   = totale meno netto; vuota se il netto manca
--   al_venditore  = commissione × la parte del venditore, arrotondata al
--                   centesimo; vuota se manca card/cash o la percentuale
--   all_ufficio   = commissione meno al_venditore (cosi' le due fanno sempre
--                   esattamente la commissione, senza un centesimo perso)
drop function if exists public.foglio_ticket(text);
create function public.foglio_ticket(p_segreto text)
returns table (
  id              uuid,
  inserito        date,
  settimana       date,
  ticket_number   text,
  stato           text,
  origine         text,
  excursion_id    text,
  option_label    text,
  company         text,
  data_gita       date,
  adults          integer,
  kids            integer,
  babies          integer,
  units           jsonb,
  total           numeric,
  deposit         numeric,
  rest_to_pay     numeric,
  pagato          numeric,
  payment_method  text,
  seller          text,
  netto           numeric,
  quota_isla      numeric,
  commissione     numeric,
  al_venditore    numeric,
  all_ufficio     numeric,
  nota            text
)
language sql
stable
security definer
set search_path = ''
as $$
  select b.id,
         (b.created_at at time zone 'Atlantic/Canary')::date,
         (date_trunc('week', (b.created_at at time zone 'Atlantic/Canary')::date))::date,
         b.ticket_number,
         case b.status when 'confirmed' then 'confermato'
                       when 'cancelled' then 'annullato'
                       else 'in attesa' end,
         b.source, b.excursion_id, b.option_label, b.company, b.date,
         b.adults, b.kids, b.babies, b.units, b.total, b.deposit, b.rest_to_pay,
         case when b.total is not null and b.rest_to_pay is not null then b.total - b.rest_to_pay
              else b.deposit end,
         b.payment_method, b.seller,
         b.net_amount,
         c.commissione,
         c.commissione,
         v.venditore,
         c.commissione - v.venditore,
         coalesce(b.net_note,
                  case when b.status = 'confirmed' and b.payment_method is null
                       then 'card o cash non scritto' end)
    from public.bookings b
    left join public.commission_rates r on r.payment_method = b.payment_method
    cross join lateral (
      select case when b.net_amount is not null and b.total is not null
                  then b.total - b.net_amount end as commissione
    ) c
    cross join lateral (
      select round(c.commissione * r.seller_share, 2) as venditore
    ) v
   where exists (
     select 1 from public.export_keys k
      where k.hash = encode(sha256(convert_to(coalesce(p_segreto, ''), 'UTF8')), 'hex')
   )
   order by b.created_at;
$$;

revoke all on function public.foglio_ticket(text) from public;
grant execute on function public.foglio_ticket(text) to anon;

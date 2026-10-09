-- 9 ottobre 2026: i parchi contano SEMPRE come pagati con carta.
--
-- Loro Parque, Siam Park e Twin Ticket: comunque paghi il cliente, il ticket
-- vale come "card", e la commissione si divide fra venditore e ufficio con la
-- parte della carta (proprietario, 9 ottobre 2026). Quanto sia quella parte
-- non e' scritto qui: sta in commission_rates (2026-10-08-pagamento.sql).
--
-- Il modulo dei venditori lo sceglie gia' da solo (campo `pagamento: "card"`
-- nel catalogo); qui lo fa valere il database, anche sui ticket salvati prima
-- e su quelli che arrivano da una richiesta WhatsApp confermata.
-- L'elenco deve essere uguale a quello del catalogo: `controlla.js` lo verifica.
--
-- Si incolla in Supabase → SQL Editor → New query → Run, DOPO
-- 2026-10-08-pagamento.sql. Lanciato di nuovo non fa danni.

create or replace function public.sempre_card()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.excursion_id in ('loro-parque', 'siam-park', 'twin-ticket') then
    new.payment_method := 'card';
  end if;
  return new;
end;
$$;

revoke all on function public.sempre_card() from public, anon, authenticated;

drop trigger if exists sempre_card on public.bookings;
create trigger sempre_card
  before insert or update on public.bookings
  for each row execute function public.sempre_card();

-- I ticket gia' salvati. Il guardiano del netto non ricalcola niente: non
-- cambia nessuno dei campi da cui il netto dipende.
update public.bookings
   set payment_method = 'card'
 where excursion_id in ('loro-parque', 'siam-park', 'twin-ticket')
   and payment_method is distinct from 'card';

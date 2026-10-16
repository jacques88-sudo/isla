-- 16 ottobre 2026: un freno alla ricerca del ticket, e il link di pagamento
-- solo https anche nel database (controllo di sicurezza del 16 ottobre).
--
-- 1. IL FRENO. le_mie_escursioni(telefono, numero) e' aperta a tutti. "Telefono
--    + numero" protegge da chi prova telefoni a caso, non da chi CONOSCE gia'
--    un telefono (un ex, un vicino d'albergo) e prova i numeri del ticket:
--    sono corti e prenumerati in ordine, ne bastano poche centinaia. Con quello
--    giusto vedrebbe dove sara' una famiglia e quando.
--    Ora ogni telefono ha al massimo 10 tentativi l'ora (proprietario, 16
--    ottobre 2026): un cliente vero sbaglia una o due volte. Il limite vale
--    per OGNI telefono, che esista o no nel database: l'errore non rivela
--    niente. All'undicesimo la funzione risponde "troppi tentativi" e
--    booking.js lo dice al cliente nella sua lingua.
--    I tentativi restano un'ora e poi si cancellano da soli (li toglie la
--    funzione stessa a ogni chiamata): lo dice anche privacy.html.
--
-- 2. IL LINK DI PAGAMENTO. venditori.js accetta solo https://, ma un account
--    venditore puo' scrivere in bookings anche senza la pagina. Un indirizzo
--    "javascript:..." finirebbe nel bottone "Paga ora" del cliente. Ora lo
--    rifiuta il database.
--
-- Come si usa, UNA volta sola, PRIMA di pubblicare il sito nuovo:
--   SQL Editor → New query → incollare TUTTO questo file → Run.
-- Lanciato due volte non fa danni.


-- 1. I TENTATIVI -----------------------------------------------------------
-- Una riga per ogni ricerca: quale telefono e quando. Nessuno dal sito la
-- legge o la scrive: ci entra solo le_mie_escursioni(), che e' security definer.
create table if not exists public.tentativi_ticket (
  phone text        not null,
  at    timestamptz not null default now()
);
create index if not exists tentativi_ticket_phone_at on public.tentativi_ticket (phone, at);

alter table public.tentativi_ticket enable row level security;
revoke all on public.tentativi_ticket from anon, authenticated;

-- La funzione deve SCRIVERE il tentativo, quindi non puo' piu' essere
-- "language sql stable": diventa plpgsql (e volatile, il normale). Le colonne
-- restituite sono le stesse di prima: booking.js non cambia per leggerle.
create or replace function public.le_mie_escursioni(p_phone text, p_ticket text)
returns table (
  ticket_number  text,
  excursion_id   text,
  option_label   text,
  "date"         date,
  "time"         time,
  time_kind      text,
  meeting_point  text,
  adults         integer,
  kids           integer,
  babies         integer,
  rest_to_pay    numeric
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- i tentativi di piu' di un'ora fa non servono piu': via, di tutti
  delete from public.tentativi_ticket where at < now() - interval '1 hour';

  -- PRIMA si contano, poi si cerca: all'undicesimo nell'ora non si cerca
  if (select count(*) from public.tentativi_ticket t where t.phone = p_phone) >= 10 then
    raise exception 'troppi tentativi, riprova fra un''ora';
  end if;
  insert into public.tentativi_ticket (phone) values (p_phone);

  -- da qui e' la stessa ricerca di prima (supabase/schema.sql)
  return query
  select b.ticket_number, b.excursion_id, b.option_label, b.date, b.time,
         b.time_kind, b.meeting_point, b.adults, b.kids, b.babies, b.rest_to_pay
    from public.bookings b
   where b.phone = p_phone
     and b.status = 'confirmed'
     and exists (
       select 1 from public.bookings v
        where v.phone = p_phone
          and v.ticket_number = trim(p_ticket)
          and v.status = 'confirmed'
     )
   order by b.date, b.time;
end;
$$;

revoke all on function public.le_mie_escursioni(text, text) from public;
grant execute on function public.le_mie_escursioni(text, text) to anon, authenticated;


-- 2. IL LINK DI PAGAMENTO ----------------------------------------------------
-- Solo "https://" seguito da un indirizzo senza spazi, come in venditori.js.
-- Se un link gia' salvato non lo rispettasse, questa riga darebbe errore e
-- non cambierebbe niente: si guarda quale con
--   select id, payment_link from public.bookings
--    where payment_link is not null and payment_link !~ '^https://\S+$';
alter table public.bookings drop constraint if exists payment_link_https;
alter table public.bookings
  add constraint payment_link_https
  check (payment_link is null or payment_link ~ '^https://\S+$');


-- Per controllare, in seguito:
--   quanti tentativi ci sono adesso (sono solo quelli dell'ultima ora):
--     select phone, count(*) from public.tentativi_ticket group by phone order by 2 desc;

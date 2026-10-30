-- 15 ottobre 2026: il link di pagamento fra la richiesta e la conferma.
--
-- Il proprietario: si paga SEMPRE prima della conferma. Quasi sempre il
-- totale; alcune compagnie vogliono solo un acconto (il netto) e il resto si
-- paga sul posto. Il link lo crea l'ufficio a mano sul portale Redsys e lo
-- incolla in venditori.html ("Manda il pagamento"), che prepara il messaggio
-- WhatsApp per il cliente. Il cliente vede il link anche in "Le mie
-- prenotazioni" ("Paga ora"). Pagato, l'ufficio preme Conferma come prima.
--
-- La richiesta resta 'pending' finche' non e' confermata: niente stato nuovo,
-- cosi' il foglio Google (che non conta le richieste in attesa), gli avvisi e
-- la pulizia mensile non cambiano. "In attesa di pagamento" vuol dire:
-- pending con payment_sent_at.
--
-- Un link vale per tutta la richiesta (lo stesso codice, anche con tre
-- escursioni): le colonne si scrivono uguali su tutte le sue righe.
--   payment_link     l'indirizzo Redsys incollato dall'ufficio
--   payment_amount   quanto si paga adesso (il totale, o l'acconto)
--   payment_total    il totale della richiesta; se e' piu' di payment_amount,
--                    la differenza si paga sul posto
--   payment_sent_at  quando l'ufficio l'ha mandato
--
-- Come si usa, UNA volta sola, PRIMA di pubblicare il sito nuovo:
--   SQL Editor → New query → incollare TUTTO questo file → Run.
-- Lanciato due volte non fa danni.

alter table public.bookings
  add column if not exists payment_link    text,
  add column if not exists payment_amount  numeric,
  add column if not exists payment_total   numeric,
  add column if not exists payment_sent_at timestamptz;

-- Dall'8 ottobre i venditori leggono bookings colonna per colonna (per tenere
-- fuori i netti): ogni colonna nuova va data anche a loro.
grant select (payment_link, payment_amount, payment_total, payment_sent_at)
  on public.bookings to authenticated;

-- Il cliente rilegge la sua richiesta con le chiavi del suo telefono: ora
-- anche il link e gli importi, per il bottone "Paga ora". Non il telefono.
-- "create or replace" non puo' cambiare le colonne restituite: prima si toglie.
drop function if exists public.le_mie_richieste(uuid[]);

create function public.le_mie_richieste(p_tokens uuid[])
returns table (
  request_token   uuid,
  request_code    text,
  status          text,
  excursion_id    text,
  option_label    text,
  "date"          date,
  "time"          time,
  wanted_time     text,
  meeting_point   text,
  adults          integer,
  kids            integer,
  babies          integer,
  created_at      timestamptz,
  ticket_number   text,
  payment_link    text,
  payment_amount  numeric,
  payment_total   numeric,
  payment_sent_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select b.request_token, b.request_code, b.status, b.excursion_id, b.option_label,
         b.date, b.time, b.wanted_time, b.meeting_point, b.adults, b.kids, b.babies,
         b.created_at, b.ticket_number,
         b.payment_link, b.payment_amount, b.payment_total, b.payment_sent_at
    from public.bookings b
   where b.source = 'whatsapp'
     and cardinality(p_tokens) <= 50
     and b.request_token = any (p_tokens)
   order by b.date, b.created_at;
$$;

revoke all on function public.le_mie_richieste(uuid[]) from public;
grant execute on function public.le_mie_richieste(uuid[]) to anon, authenticated;

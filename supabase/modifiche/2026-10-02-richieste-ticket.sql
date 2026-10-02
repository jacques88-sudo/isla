-- 2 ottobre 2026: una richiesta WhatsApp confermata diventa un ticket.
--
-- Quando l'ufficio conferma una richiesta, al cliente da' comunque un ticket
-- (proprietario). Da oggi "Conferma" in venditori.html chiede anche il numero
-- del ticket (obbligatorio) e, se c'e', il telefono del cliente. Con il numero:
--   - nella pagina venditori la richiesta esce da "Richieste da WhatsApp" ed
--     entra in "Ultimi inseriti", come un ticket di carta;
--   - il cliente, in "Le mie richieste", la vede come "Ticket n. …";
--   - con anche il telefono, il cliente la ritrova da qualunque telefono con
--     "Il mio ticket" (numero + telefono), come i ticket di carta: lo fa gia'
--     le_mie_escursioni(), che guarda solo numero, telefono e status.
--
-- Le colonne ci sono gia' tutte (ticket_number, phone): qui cambia solo cosa
-- restituisce le_mie_richieste, che ora dice anche il numero del ticket.
-- Serve 2026-09-30-richieste-whatsapp.sql gia' lanciato.
--
-- Come si usa, UNA volta sola:
--   SQL Editor → New query → incollare TUTTO questo file → Run.
-- Lanciato due volte non fa danni.

-- "create or replace" non puo' cambiare le colonne restituite: prima si toglie.
drop function if exists public.le_mie_richieste(uuid[]);

create function public.le_mie_richieste(p_tokens uuid[])
returns table (
  request_token  uuid,
  request_code   text,
  status         text,
  excursion_id   text,
  option_label   text,
  "date"         date,
  "time"         time,
  wanted_time    text,
  meeting_point  text,
  adults         integer,
  kids           integer,
  babies         integer,
  created_at     timestamptz,
  ticket_number  text
)
language sql
stable
security definer
set search_path = ''
as $$
  select b.request_token, b.request_code, b.status, b.excursion_id, b.option_label,
         b.date, b.time, b.wanted_time, b.meeting_point, b.adults, b.kids, b.babies,
         b.created_at, b.ticket_number
    from public.bookings b
   where b.source = 'whatsapp'
     and cardinality(p_tokens) <= 50
     and b.request_token = any (p_tokens)
   order by b.date, b.created_at;
$$;

revoke all on function public.le_mie_richieste(uuid[]) from public;
grant execute on function public.le_mie_richieste(uuid[]) to anon, authenticated;

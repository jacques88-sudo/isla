-- 13 ottobre 2026: la richiesta WhatsApp arriva nel database col suo messaggio.
--
-- Fino a ieri nel database entravano solo escursione, data, ora chiesta e
-- persone: nome, hotel e note l'ufficio li leggeva nella chat. Confermare
-- voleva dire ricopiare a mano ora e meeting point. Da oggi (proprietario)
-- ogni riga porta anche:
--   - customer_name    il nome che il cliente ha scritto nella lista;
--   - request_message  il messaggio WhatsApp intero, col codice, cosi' come
--                      e' partito (uguale su tutte le righe della richiesta);
--   - hotel            dove alloggia, come l'ha scritto (la colonna c'era gia',
--                      la usavano i venditori coi ticket di carta);
--   - pickup_point     dove sale, ricavato dall'hotel in hotel.js;
--   - pickup_time      a che ora passa il pulmino, se lo sappiamo.
-- In venditori.html il modulo "Conferma" parte gia' riempito con questi dati;
-- l'ufficio li cambia solo se serve.
--
-- Il cliente NON li rilegge: le_mie_richieste resta com'e'.
-- Il telefono resta fuori: il sito non lo conosce, il messaggio parte dal
-- WhatsApp del cliente.
--
-- Serve 2026-09-30-richieste-whatsapp.sql gia' lanciato.
--
-- Come si usa, UNA volta sola, PRIMA di pubblicare il sito nuovo:
--   SQL Editor → New query → incollare TUTTO questo file → Run.
-- Lanciato due volte non fa danni.


-- 1. I CAMPI NUOVI ----------------------------------------------------------

alter table public.bookings
  add column if not exists customer_name   text,
  add column if not exists request_message text,
  add column if not exists pickup_point    text,
  -- testo e non "time": e' una proposta da rileggere, non l'ora del ticket
  add column if not exists pickup_time     text;


-- 2. MANDA_RICHIESTA CON NOME E MESSAGGIO -----------------------------------
-- Si toglie la vecchia (tre parametri) e si rifa' con due in piu', che hanno
-- un valore di partenza: un telefono che ha ancora in memoria il sito di ieri
-- manda tre parametri e finisce qui lo stesso, senza nome e senza messaggio.
-- Tenerle tutte e due no: con due funzioni dallo stesso nome Supabase non sa
-- quale chiamare.
--
-- Ogni voce di p_items puo' avere in piu' "hotel", "pickup_point" e
-- "pickup_time".

drop function if exists public.manda_richiesta(uuid, text, jsonb);

create or replace function public.manda_richiesta(
  p_token uuid, p_code text, p_items jsonb,
  p_name text default null, p_message text default null)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  voce jsonb;
  quante integer := 0;
begin
  if p_token is null or p_code !~ '^[A-Z0-9]{6}$' then
    raise exception 'richiesta non valida';
  end if;
  if jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 10 then
    raise exception 'richiesta non valida';
  end if;
  if length(coalesce(p_name, '')) > 120 or length(coalesce(p_message, '')) > 8000 then
    raise exception 'richiesta non valida';
  end if;

  -- gia' arrivata: si risponde come se fosse andata ora
  if exists (select 1 from public.bookings where request_token = p_token) then
    return 0;
  end if;

  if (select count(*) from public.bookings
       where source = 'whatsapp' and created_at > now() - interval '1 hour') > 300 then
    raise exception 'troppe richieste, riprova piu'' tardi';
  end if;

  for voce in select * from jsonb_array_elements(p_items) loop
    if voce->>'date' is null
       or coalesce(voce->>'excursion_id', '') !~ '^[a-z0-9-]{1,60}$'
       or length(coalesce(voce->>'option_label', '')) > 120
       or length(coalesce(voce->>'wanted_time', '')) > 40
       or length(coalesce(voce->>'hotel', '')) > 200
       or length(coalesce(voce->>'pickup_point', '')) > 200
       or length(coalesce(voce->>'pickup_time', '')) > 20
       or (voce->>'date')::date < current_date - 1
       or (voce->>'date')::date > current_date + 400
       or coalesce((voce->>'adults')::int, 0) not between 0 and 99
       or coalesce((voce->>'kids')::int,   0) not between 0 and 99
       or coalesce((voce->>'babies')::int, 0) not between 0 and 99 then
      raise exception 'richiesta non valida';
    end if;

    insert into public.bookings
      (source, status, request_token, request_code, excursion_id, option_label,
       date, wanted_time, adults, kids, babies, seller_id,
       customer_name, request_message, hotel, pickup_point, pickup_time)
    values
      ('whatsapp', 'pending', p_token, p_code, voce->>'excursion_id',
       nullif(voce->>'option_label', ''), (voce->>'date')::date,
       nullif(voce->>'wanted_time', ''),
       coalesce((voce->>'adults')::int, 0), coalesce((voce->>'kids')::int, 0),
       coalesce((voce->>'babies')::int, 0), null,
       nullif(trim(coalesce(p_name, '')), ''), nullif(p_message, ''),
       nullif(trim(coalesce(voce->>'hotel', '')), ''),
       nullif(voce->>'pickup_point', ''), nullif(voce->>'pickup_time', ''));
    quante := quante + 1;
  end loop;
  return quante;
end;
$$;

revoke all on function public.manda_richiesta(uuid, text, jsonb, text, text) from public;
grant execute on function public.manda_richiesta(uuid, text, jsonb, text, text) to anon, authenticated;


-- Per controllare, dopo:
--   select request_code, customer_name, hotel, pickup_point, pickup_time,
--          left(request_message, 60)
--     from public.bookings where source = 'whatsapp' order by created_at desc;

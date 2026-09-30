-- 30 settembre 2026: le richieste mandate su WhatsApp entrano nel database.
--
-- Il cliente che trova l'app da solo non ha un ticket di carta: sceglie le
-- escursioni, le mette nella lista e manda UN messaggio WhatsApp all'ufficio.
-- Da oggi, nello stesso momento, le stesse escursioni si salvano qui come
-- "da confermare" (status = 'pending', source = 'whatsapp'). L'ufficio le
-- conferma o le annulla da venditori.html, e il cliente vede il colore cambiare
-- nella sua pagina "Le mie richieste" (booking.html).
--
-- Come si usa, UNA volta sola:
--   SQL Editor → New query → incollare TUTTO questo file → Run.
--
-- Il cliente non ha login e non da' il telefono. Come ritrova le sue richieste?
--   - il telefono del cliente inventa una CHIAVE lunga e impossibile da
--     indovinare (request_token, un uuid) e se la tiene in localStorage;
--   - chi ha la chiave vede quelle richieste, chi non ce l'ha non vede niente.
--   - nel messaggio WhatsApp va invece un CODICE corto (request_code, es.
--     "K7PM3Q"): serve all'ufficio per trovare la richiesta nell'elenco.
--     Il codice non basta a leggerla: per quello serve la chiave.
--   Conseguenza voluta: le richieste si vedono solo dal telefono che le ha
--   mandate. Chi cambia telefono o svuota il browser le perde (l'ufficio no).


-- 1. I CAMPI NUOVI ----------------------------------------------------------

alter table public.bookings
  add column if not exists request_token uuid,
  add column if not exists request_code  text,
  -- L'ora che ha chiesto il cliente, cosi' come l'ha scelta ("10:00" oppure
  -- una fascia "09:00 - 12:00"). Non e' l'ora di ritrovo: quella la mette
  -- l'ufficio in "time" quando conferma.
  add column if not exists wanted_time   text;

create index if not exists bookings_request_token_idx on public.bookings (request_token);
create index if not exists bookings_request_code_idx  on public.bookings (request_code);

-- Una richiesta confermata non ha il numero di un ticket di carta ne' il
-- telefono (il cliente scrive dal suo WhatsApp, lo schema non lo conosce).
-- La regola di prima valeva per tutti: ora le due cose si chiedono solo ai
-- ticket di carta.
alter table public.bookings drop constraint if exists confermato_completo;
alter table public.bookings add constraint confermato_completo check (
  status <> 'confirmed'
  or (excursion_id is not null and date is not null
      and (source = 'whatsapp'
           or (ticket_number is not null and phone is not null)))
);


-- 2. IL CLIENTE MANDA UNA RICHIESTA -----------------------------------------
-- L'unica porta da cui il sito pubblico SCRIVE nel database. Non c'e' una regola
-- "anon puo' inserire nella tabella": passa tutto da qui, e qui si decide cosa
-- entra.
--   - lo stato e' sempre 'pending' e la fonte sempre 'whatsapp': un visitatore
--     non puo' mettersi da solo una richiesta "confermata";
--   - si controlla ogni campo (lunghezze, date, persone);
--   - al massimo 10 escursioni per richiesta (come la lista, LISTA_MAX);
--   - la stessa chiave mandata due volte non crea doppioni: il telefono
--     riprova da solo se la prima volta non c'era campo;
--   - un tetto per tutti: piu' di 300 richieste nell'ultima ora vuol dire che
--     qualcuno sta riempiendo il database a macchina, e ci si ferma.
--
-- p_items e' un elenco JSON, una voce per escursione:
--   [{"excursion_id": "peter-pan", "option_label": null, "date": "2026-10-04",
--     "wanted_time": "12:00", "adults": 2, "kids": 0, "babies": 0}, ...]

create or replace function public.manda_richiesta(p_token uuid, p_code text, p_items jsonb)
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
       or (voce->>'date')::date < current_date - 1
       or (voce->>'date')::date > current_date + 400
       or coalesce((voce->>'adults')::int, 0) not between 0 and 99
       or coalesce((voce->>'kids')::int,   0) not between 0 and 99
       or coalesce((voce->>'babies')::int, 0) not between 0 and 99 then
      raise exception 'richiesta non valida';
    end if;

    insert into public.bookings
      (source, status, request_token, request_code, excursion_id, option_label,
       date, wanted_time, adults, kids, babies, seller_id)
    values
      ('whatsapp', 'pending', p_token, p_code, voce->>'excursion_id',
       nullif(voce->>'option_label', ''), (voce->>'date')::date,
       nullif(voce->>'wanted_time', ''),
       coalesce((voce->>'adults')::int, 0), coalesce((voce->>'kids')::int, 0),
       coalesce((voce->>'babies')::int, 0), null);
    quante := quante + 1;
  end loop;
  return quante;
end;
$$;

revoke all on function public.manda_richiesta(uuid, text, jsonb) from public;
grant execute on function public.manda_richiesta(uuid, text, jsonb) to anon, authenticated;


-- 3. IL CLIENTE GUARDA LE SUE RICHIESTE -------------------------------------
-- Riceve le chiavi che ha nel telefono (al massimo 50) e vede solo quelle.
-- Escono solo i campi della sua pagina: niente note interne, niente venditore.

create or replace function public.le_mie_richieste(p_tokens uuid[])
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
  created_at     timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select b.request_token, b.request_code, b.status, b.excursion_id, b.option_label,
         b.date, b.time, b.wanted_time, b.meeting_point, b.adults, b.kids, b.babies,
         b.created_at
    from public.bookings b
   where b.source = 'whatsapp'
     and cardinality(p_tokens) <= 50
     and b.request_token = any (p_tokens)
   order by b.date, b.created_at;
$$;

revoke all on function public.le_mie_richieste(uuid[]) from public;
grant execute on function public.le_mie_richieste(uuid[]) to anon, authenticated;


-- Per controllare, dopo (una query alla volta):
--
--   le richieste arrivate:
--     select request_code, status, excursion_id, date, wanted_time, created_at
--       from public.bookings where source = 'whatsapp' order by created_at desc;

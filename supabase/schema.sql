-- Isla — il database delle prenotazioni (ticket di carta + online)
--
-- Come si usa: su supabase.com, nel progetto, menu "SQL Editor" → "New query",
-- si incolla TUTTO questo file e si preme "Run". Si fa una volta sola.
--
-- Cosa crea:
--   1. sellers    → chi puo' caricare ticket (i 2 venditori)
--   2. bookings   → una riga per ogni ticket / prenotazione
--   3. le regole di accesso (RLS): chi puo' leggere e scrivere cosa
--   4. le_mie_escursioni() → l'unica porta da cui passa il cliente
--   5. ticket-foto → lo spazio privato per le foto dei ticket
--
-- Questo file non contiene nessuna chiave segreta: puo' stare nel repo.


-- 1. I VENDITORI ------------------------------------------------------------
-- Il login lo fa Supabase (tabella auth.users). Qui si dice solo QUALI di quegli
-- account sono venditori. Un account che non sta qui non vede e non scrive niente,
-- anche se riesce a registrarsi.

create table public.sellers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name    text not null            -- come compare nel campo SELLER del ticket
);

alter table public.sellers enable row level security;

-- Un venditore legge solo la propria riga (serve alla PWA per sapere il suo nome).
create policy "il venditore vede se stesso"
  on public.sellers for select
  to authenticated
  using (user_id = auth.uid());

-- Vero se chi sta chiamando e' un venditore. Usata da tutte le regole sotto.
create function public.is_seller()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.sellers where user_id = auth.uid());
$$;


-- 2. LE PRENOTAZIONI --------------------------------------------------------

create table public.bookings (
  id             uuid primary key default gen_random_uuid(),

  -- Unico: e' la difesa contro i doppioni e la "password" del cliente.
  -- Vuoto finche' la foto non e' stata letta (pending) e nelle prenotazioni online.
  ticket_number  text unique,

  source         text not null default 'strada'
                 check (source in ('strada', 'online', 'whatsapp')),
  status         text not null default 'pending'
                 check (status in ('pending', 'confirmed', 'cancelled')),

  -- L'id della scheda in esplora-catalog.js (es. "royal-delfin") e, se la scheda
  -- ha varianti, l'etichetta italiana della variante (es. "2 ore"): le varianti
  -- nel catalogo non hanno un id loro.
  excursion_id   text,
  option_label   text,

  date           date,
  time           time,
  -- 'pickup' = ora del ritiro, 'departure' = ora di partenza (schede senza ritiro).
  time_kind      text check (time_kind in ('pickup', 'departure')),
  meeting_point  text,

  hotel          text,                 -- solo venditore
  nationality    text,                 -- solo venditore

  -- Formato E.164: +, prefisso, numero, senza spazi. Es. +393331234567
  phone          text check (phone ~ '^\+[1-9][0-9]{6,14}$'),

  adults         integer check (adults >= 0),
  kids           integer check (kids   >= 0),
  babies         integer check (babies >= 0),

  total          numeric(8,2) check (total       >= 0),
  deposit        numeric(8,2) check (deposit     >= 0),
  rest_to_pay    numeric(8,2) check (rest_to_pay >= 0),

  seller_id      uuid references auth.users (id) default auth.uid(),
  seller         text,                 -- il nome scritto sul ticket
  notes          text,
  photo_path     text,                 -- percorso dentro ticket-foto, NON un link pubblico

  created_at     timestamptz not null default now(),
  confirmed_at   timestamptz,

  -- Un ticket confermato deve avere almeno quello che serve al cliente per
  -- trovarlo e per presentarsi: numero, telefono, escursione e data.
  constraint confermato_completo check (
    status <> 'confirmed'
    or (ticket_number is not null and phone is not null
        and excursion_id is not null and date is not null)
  )
);

-- Il cliente cerca per telefono: questo indice rende la ricerca immediata.
create index bookings_phone_idx on public.bookings (phone);

alter table public.bookings enable row level security;

-- I venditori leggono, aggiungono e correggono tutte le prenotazioni.
-- Cancellare una riga non si puo' da nessuno: si mette status = 'cancelled'.
create policy "i venditori leggono"
  on public.bookings for select
  to authenticated
  using (public.is_seller());

create policy "i venditori aggiungono"
  on public.bookings for insert
  to authenticated
  with check (public.is_seller());

create policy "i venditori correggono"
  on public.bookings for update
  to authenticated
  using (public.is_seller())
  with check (public.is_seller());

-- Nessuna regola per 'anon' (il cliente senza login): dalla tabella non legge
-- niente. Passa solo dalla funzione qui sotto.


-- 3. LA PORTA DEL CLIENTE ---------------------------------------------------
-- Il cliente da' telefono + numero di uno dei suoi ticket.
-- Se quel ticket confermato esiste con quel telefono, riceve TUTTE le sue
-- prenotazioni confermate; altrimenti riceve zero righe.
-- Zero righe sia per "numero sbagliato" sia per "numero senza prenotazioni":
-- chi prova a caso non scopre se un telefono e' nel database.
--
-- Escono solo i campi che il cliente puo' vedere: niente hotel, nazionalita',
-- venditore, foto, note interne.

create function public.le_mie_escursioni(p_phone text, p_ticket text)
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
language sql
stable
security definer
set search_path = ''
as $$
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
$$;

revoke all on function public.le_mie_escursioni(text, text) from public;
grant execute on function public.le_mie_escursioni(text, text) to anon, authenticated;


-- 4. LE FOTO DEI TICKET -----------------------------------------------------
-- Spazio PRIVATO: le foto hanno telefono e firma del cliente. Le vedono solo i
-- venditori, attraverso link temporanei.

insert into storage.buckets (id, name, public)
values ('ticket-foto', 'ticket-foto', false);

create policy "i venditori caricano le foto"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'ticket-foto' and public.is_seller());

create policy "i venditori guardano le foto"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'ticket-foto' and public.is_seller());

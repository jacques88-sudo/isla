-- 22 ottobre 2026: gli avvisi sul telefono dell'UFFICIO (proprietario).
--
-- Tre avvisi, per "avere piu' controllo se qualcosa non va":
--   - RICHIESTA nuova: un cliente ha mandato la lista su WhatsApp;
--   - TICKET nuovo: un venditore ha inserito un ticket di carta;
--   - RECENSIONE nuova da approvare.
-- Solo l'ufficio (is_office). Arrivano su Isla Ticket, col suo service worker
-- (isla-ticket/sw.js), non su Isla. Le richieste in se' le legge ogni venditore:
-- vedi "Venditori e ufficio sono le stesse due persone" in CLAUDE.md.
--
-- Come funziona:
--   1. ogni riga nuova in bookings o recensioni lascia un segno in
--      avvisi_ufficio (lo fa il database da solo, coi trigger qui sotto);
--   2. manda-notifiche, a ogni giro (Cron ogni 10 minuti, e subito dopo che un
--      venditore salva un ticket), prende i segni non ancora mandati e manda
--      l'avviso a tutti i telefoni dell'ufficio iscritti;
--   3. il telefono si iscrive da Isla Ticket, "Avvisi su questo telefono".
--
-- Come si usa, UNA volta sola:
--   SQL Editor → New query → incollare TUTTO questo file → Run.
-- Poi va ridistribuita la funzione manda-notifiche (Edge Functions →
-- manda-notifiche → incollare il nuovo index.ts → Deploy).
-- Lanciato due volte non fa danni.


-- 1. I TELEFONI DELL'UFFICIO ------------------------------------------------
-- Uno per riga. Se l'account ufficio viene cancellato, spariscono anche i suoi
-- telefoni. Nessuno dal sito legge la tabella: si passa dalle funzioni sotto.

create table if not exists public.ufficio_iscrizioni (
  endpoint    text primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  p256dh      text not null,
  auth        text not null,
  created_at  timestamptz not null default now()
);

alter table public.ufficio_iscrizioni enable row level security;
-- manda-notifiche legge i telefoni e toglie quelli che non esistono piu'
grant select, delete on public.ufficio_iscrizioni to service_role;


-- 2. ISCRIVERSI E TOGLIERSI ---------------------------------------------------
-- Solo un account ufficio. L'indirizzo deve essere di un servizio di notifiche
-- vero, come in avvisami() (2026-10-13-notifiche.sql).

create or replace function public.avvisami_ufficio(p_endpoint text, p_p256dh text, p_auth text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_office() then
    raise exception 'solo l''ufficio';
  end if;
  if length(coalesce(p_endpoint, '')) > 1000
     or coalesce(p_endpoint, '') !~ '^https://(fcm\.googleapis\.com|[a-z0-9.-]*push\.services\.mozilla\.com|web\.push\.apple\.com|[a-z0-9.-]*\.notify\.windows\.com)/'
     or coalesce(p_p256dh, '') !~ '^[A-Za-z0-9_=-]{20,200}$'
     or coalesce(p_auth, '')   !~ '^[A-Za-z0-9_=-]{8,100}$' then
    raise exception 'iscrizione non valida';
  end if;
  -- al massimo 10 telefoni per account: di piu' non ne ha nessuno
  if (select count(*) from public.ufficio_iscrizioni
       where user_id = auth.uid() and endpoint <> p_endpoint) >= 10 then
    raise exception 'troppi telefoni per questo account';
  end if;

  insert into public.ufficio_iscrizioni (endpoint, user_id, p256dh, auth)
  values (p_endpoint, auth.uid(), p_p256dh, p_auth)
  on conflict (endpoint) do update
    set user_id = excluded.user_id, p256dh = excluded.p256dh, auth = excluded.auth;
  return true;
end;
$$;

create or replace function public.smetti_avvisi_ufficio(p_endpoint text)
returns boolean
language sql
security definer
set search_path = ''
as $$
  with tolti as (
    delete from public.ufficio_iscrizioni
     where endpoint = p_endpoint and user_id = auth.uid()
    returning 1
  )
  select exists (select 1 from tolti);
$$;

revoke all on function public.avvisami_ufficio(text, text, text) from public;
revoke all on function public.avvisami_ufficio(text, text, text) from anon;
grant execute on function public.avvisami_ufficio(text, text, text) to authenticated;
revoke all on function public.smetti_avvisi_ufficio(text) from public;
revoke all on function public.smetti_avvisi_ufficio(text) from anon;
grant execute on function public.smetti_avvisi_ufficio(text) to authenticated;


-- 3. I SEGNI DA MANDARE -------------------------------------------------------
-- Una riga per ogni ticket, richiesta (una per escursione: manda-notifiche le
-- raccoglie per codice) o recensione nuova. Se il ticket o la recensione
-- spariscono, sparisce anche il segno.

create table if not exists public.avvisi_ufficio (
  id             bigint generated always as identity primary key,
  tipo           text not null check (tipo in ('richiesta', 'ticket', 'recensione')),
  booking_id     uuid references public.bookings (id) on delete cascade,
  recensione_id  uuid references public.recensioni (id) on delete cascade,
  created_at     timestamptz not null default now(),
  sent_at        timestamptz
);

alter table public.avvisi_ufficio enable row level security;
-- manda-notifiche toglie il segno a un avviso non partito, per riprovarlo
grant select, update (sent_at) on public.avvisi_ufficio to service_role;

create or replace function public.segna_avviso_ticket()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- 'online' non arriva da nessuna pagina di oggi: niente avviso
  if new.source in ('whatsapp', 'strada') then
    insert into public.avvisi_ufficio (tipo, booking_id)
    values (case new.source when 'whatsapp' then 'richiesta' else 'ticket' end, new.id);
  end if;
  return new;
end;
$$;

create or replace function public.segna_avviso_recensione()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- solo quelle scritte dai clienti: le vecchie di Tripadvisor e Facebook le
  -- inserisce l'ufficio, a mano
  if new.fonte = 'isla' then
    insert into public.avvisi_ufficio (tipo, recensione_id) values ('recensione', new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists avviso_ufficio on public.bookings;
create trigger avviso_ufficio after insert on public.bookings
  for each row execute function public.segna_avviso_ticket();

drop trigger if exists avviso_ufficio on public.recensioni;
create trigger avviso_ufficio after insert on public.recensioni
  for each row execute function public.segna_avviso_recensione();


-- 4. COSA C'E' DA MANDARE ADESSO --------------------------------------------
-- Prende i segni non ancora mandati e li segna come mandati, nello stesso
-- passo: se Cron e un venditore chiamano manda-notifiche insieme, ogni segno
-- lo prende uno solo dei due. Un segno piu' vecchio di un giorno non parte
-- piu' (un avviso di ieri confonde); dopo una settimana si cancella.

create or replace function public.avvisi_ufficio_da_mandare()
returns table (
  id             bigint,
  tipo           text,
  request_code   text,
  customer_name  text,
  ticket_number  text,
  seller         text,
  excursion_id   text,
  option_label   text,
  "date"         date,
  adults         integer,
  kids           integer,
  babies         integer,
  total          numeric,
  nome           text,
  stelle         smallint,
  testo          text
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.avvisi_ufficio a where a.created_at < now() - interval '7 days';
  return query
    with presi as (
      update public.avvisi_ufficio a set sent_at = now()
       where a.sent_at is null and a.created_at > now() - interval '1 day'
      returning a.id, a.tipo, a.booking_id, a.recensione_id
    )
    select p.id, p.tipo, b.request_code, b.customer_name, b.ticket_number, b.seller,
           coalesce(b.excursion_id, r.excursion_id), b.option_label, b.date,
           b.adults, b.kids, b.babies, b.total, r.nome, r.stelle, r.testo
      from presi p
      left join public.bookings b on b.id = p.booking_id
      left join public.recensioni r on r.id = p.recensione_id
     order by p.id;
end;
$$;

revoke all on function public.avvisi_ufficio_da_mandare() from public;
revoke all on function public.avvisi_ufficio_da_mandare() from anon, authenticated;
grant execute on function public.avvisi_ufficio_da_mandare() to service_role;


-- Per controllare, in seguito (una query alla volta):
--
--   quanti telefoni dell'ufficio sono iscritti:
--     select count(*) from public.ufficio_iscrizioni;
--
--   gli ultimi avvisi, mandati o no:
--     select tipo, created_at, sent_at from public.avvisi_ufficio order by id desc limit 10;

-- 20 ottobre 2026: le recensioni dei clienti.
--
-- Decisioni del proprietario (20 ottobre 2026):
--   - la scrive SOLO chi c'e' stato: un'escursione confermata e gia' passata,
--     ritrovata in "Le mie prenotazioni" (ticket di carta: numero + telefono;
--     richiesta WhatsApp: la chiave che sta nel telefono);
--   - esce sul sito solo dopo che l'ufficio l'ha approvata (venditori.html);
--     scartata, si cancella subito;
--   - si vede il nome con l'iniziale ("Marco R."), la lingua e il mese;
--   - una pubblicata resta finche' il cliente non chiede di toglierla.
--
-- Nella tabella NON ci sono telefono, numero del ticket, chiave, email: solo
-- quello che si mostra, piu' il legame col ticket (booking_id) che serve a non
-- farne scrivere due per la stessa escursione. Quando la pulizia mensile
-- cancella il ticket, il legame diventa vuoto e la recensione resta.
--
-- Come si usa, UNA volta sola:
--   SQL Editor → New query → incollare TUTTO questo file → Run.
-- Si puo' rilanciare: non rompe niente.


-- 1. LA TABELLA ---------------------------------------------------------------

create table if not exists public.recensioni (
  id            uuid primary key default gen_random_uuid(),
  booking_id    uuid unique references public.bookings (id) on delete set null,
  excursion_id  text not null check (excursion_id ~ '^[a-z0-9-]{1,60}$'),
  stelle        smallint not null check (stelle between 1 and 5),
  testo         text check (length(testo) <= 1000),
  nome          text not null check (length(nome) between 1 and 40),
  lingua        text not null check (lingua in ('it', 'en', 'es', 'fr', 'de')),
  -- il primo giorno del mese dell'escursione: in pagina "ottobre 2026"
  mese          date not null,
  stato         text not null default 'in_attesa'
                check (stato in ('in_attesa', 'pubblicata')),
  created_at    timestamptz not null default now(),
  pubblicata_at timestamptz
);

create index if not exists recensioni_scheda_idx on public.recensioni (excursion_id, stato);

alter table public.recensioni enable row level security;

-- L'ufficio (i venditori col login) legge tutte, pubblica, scarta.
-- Scartare = cancellare: una recensione scartata non si tiene.
drop policy if exists "i venditori leggono le recensioni" on public.recensioni;
create policy "i venditori leggono le recensioni"
  on public.recensioni for select to authenticated using (public.is_seller());
drop policy if exists "i venditori pubblicano le recensioni" on public.recensioni;
create policy "i venditori pubblicano le recensioni"
  on public.recensioni for update to authenticated
  using (public.is_seller()) with check (public.is_seller());
drop policy if exists "i venditori scartano le recensioni" on public.recensioni;
create policy "i venditori scartano le recensioni"
  on public.recensioni for delete to authenticated using (public.is_seller());

-- Leggere tutto tranne il legame col ticket; correggere solo lo stato.
-- Il testo non lo cambia nessuno: o si pubblica com'e', o si scarta.
grant select (id, excursion_id, stelle, testo, nome, lingua, mese, stato, created_at, pubblicata_at)
  on public.recensioni to authenticated;
grant update (stato, pubblicata_at) on public.recensioni to authenticated;
grant delete on public.recensioni to authenticated;

-- Nessuna regola per 'anon' (il cliente senza login): dalla tabella non legge
-- e non scrive niente. Passa solo dalle funzioni qui sotto.


-- 2. IL CLIENTE SCRIVE LA RECENSIONE ----------------------------------------
-- Una porta sola, con due modi di dimostrare che c'e' stato:
--   - ticket di carta: p_phone + p_ticket (come le_mie_escursioni);
--   - richiesta WhatsApp: p_token + p_excursion_id + p_date (la chiave nel
--     telefono, come le_mie_richieste).
-- L'escursione deve essere confermata, gia' passata, e non piu' vecchia di 30
-- giorni (dopo, il ticket puo' essere gia' stato tolto dalla pulizia mensile).
-- Risponde 'ok', 'gia' se per quell'escursione una recensione c'e' gia', 'no'
-- per tutto il resto (ticket che non c'e', non confermato, data futura o
-- troppo vecchia): sempre la stessa parola, chi prova a caso non scopre niente.
--
-- Il freno: la strada del ticket conta nella stessa tabella delle ricerche
-- (tentativi_ticket, supabase/modifiche/2026-10-16-tentativi-ticket.sql),
-- al massimo 10 l'ora per telefono, insieme a le_mie_escursioni. Senza, questa
-- porta servirebbe a provare i numeri dei ticket scavalcando quel limite.
-- Per questo "non trovato" risponde 'no' e non un errore: un errore annulla
-- tutto quello che la funzione ha scritto, anche il tentativo appena contato.

create or replace function public.lascia_recensione(
  p_phone text, p_ticket text, p_token uuid, p_excursion_id text, p_date date,
  p_stelle integer, p_testo text, p_nome text, p_lingua text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  b public.bookings%rowtype;
  oggi date := (now() at time zone 'Atlantic/Canary')::date;
begin
  if p_stelle is null or p_stelle not between 1 and 5
     or length(trim(coalesce(p_nome, ''))) not between 1 and 40
     or length(coalesce(p_testo, '')) > 1000
     or coalesce(p_lingua, '') not in ('it', 'en', 'es', 'fr', 'de') then
    raise exception 'recensione non valida';
  end if;

  -- un tetto per tutti: piu' di 100 recensioni in un'ora vuol dire che qualcuno
  -- sta riempiendo il database a macchina
  if (select count(*) from public.recensioni where created_at > now() - interval '1 hour') > 100 then
    raise exception 'troppe recensioni, riprova piu'' tardi';
  end if;

  if p_token is not null then
    select * into b from public.bookings x
     where x.request_token = p_token and x.source = 'whatsapp'
       and x.excursion_id = p_excursion_id and x.date = p_date
       and x.status = 'confirmed'
     order by (exists (select 1 from public.recensioni r where r.booking_id = x.id)), x.created_at
     limit 1;
  elsif p_phone is not null and p_ticket is not null then
    delete from public.tentativi_ticket where at < now() - interval '1 hour';
    if (select count(*) from public.tentativi_ticket t where t.phone = p_phone) >= 10 then
      raise exception 'troppi tentativi, riprova fra un''ora';
    end if;
    insert into public.tentativi_ticket (phone) values (p_phone);
    select * into b from public.bookings x
     where x.phone = p_phone and x.ticket_number = trim(p_ticket)
       and x.status = 'confirmed'
     limit 1;
  end if;

  if b.id is null or b.date is null or b.date >= oggi or b.date < oggi - 30 then
    return 'no';
  end if;

  if exists (select 1 from public.recensioni where booking_id = b.id) then
    return 'gia';
  end if;

  insert into public.recensioni (booking_id, excursion_id, stelle, testo, nome, lingua, mese)
  values (b.id, b.excursion_id, p_stelle, nullif(trim(coalesce(p_testo, '')), ''),
          trim(p_nome), p_lingua, date_trunc('month', b.date)::date);
  return 'ok';
end;
$$;

revoke all on function public.lascia_recensione(text, text, uuid, text, date, integer, text, text, text) from public;
grant execute on function public.lascia_recensione(text, text, uuid, text, date, integer, text, text, text) to anon, authenticated;


-- 3. IL SITO LEGGE LE RECENSIONI PUBBLICATE ---------------------------------
-- Solo le pubblicate, e solo quello che si mostra.

create or replace function public.recensioni_della_scheda(p_excursion_id text)
returns table (nome text, stelle smallint, testo text, lingua text, mese date)
language sql
stable
security definer
set search_path = ''
as $$
  select r.nome, r.stelle, r.testo, r.lingua, r.mese
    from public.recensioni r
   where r.excursion_id = p_excursion_id and r.stato = 'pubblicata'
   order by r.pubblicata_at desc
   limit 50;
$$;

revoke all on function public.recensioni_della_scheda(text) from public;
grant execute on function public.recensioni_della_scheda(text) to anon, authenticated;

-- La media e quante sono, scheda per scheda: per le stelle nell'elenco.
create or replace function public.recensioni_medie()
returns table (excursion_id text, media numeric, quante integer)
language sql
stable
security definer
set search_path = ''
as $$
  select r.excursion_id, round(avg(r.stelle), 1), count(*)::integer
    from public.recensioni r
   where r.stato = 'pubblicata'
   group by r.excursion_id;
$$;

revoke all on function public.recensioni_medie() from public;
grant execute on function public.recensioni_medie() to anon, authenticated;


-- Per controllare, in seguito (una query alla volta):
--
--   le recensioni in attesa:
--     select created_at, excursion_id, stelle, nome, testo from public.recensioni
--      where stato = 'in_attesa' order by created_at;
--
--   togliere una recensione pubblicata (il cliente lo ha chiesto):
--     delete from public.recensioni where id = '...';

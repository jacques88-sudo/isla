-- 20 ottobre 2026: le recensioni dei clienti.
--
-- Decisioni del proprietario (20 ottobre 2026):
--   - si recensisce IL SERVIZIO, non la singola escursione: i clienti parlano
--     di noi, dei consigli, di Francesca (cosi' sono le recensioni che avevamo
--     gia' su Tripadvisor e Facebook, come "Fran.escursioni"). UNA per cliente;
--   - la scrive SOLO chi c'e' stato: un'escursione confermata e gia' passata,
--     ritrovata in "Le mie prenotazioni" (ticket di carta: numero + telefono;
--     richiesta WhatsApp: la chiave che sta nel telefono);
--   - esce sul sito solo dopo che l'ufficio l'ha approvata (venditori.html);
--     scartata, si cancella subito;
--   - si vede nella home ("Dicono di noi"): nome con l'iniziale ("Marco R."),
--     stelle, testo, mese e, in piccolo, quale escursione ha fatto;
--   - ci vanno anche le recensioni vecchie di Tripadvisor e Facebook, inserite
--     a mano dall'ufficio, con scritto da dove vengono (colonna fonte). Quelle
--     di Facebook non hanno stelle ("consiglia"): stelle resta vuoto e nella
--     media non contano;
--   - una pubblicata resta finche' il cliente non chiede di toglierla.
--
-- Nella tabella NON ci sono telefono, numero del ticket, chiave, email: solo
-- quello che si mostra, piu' il legame col ticket (booking_id) che serve a non
-- farne scrivere due allo stesso cliente. Quando la pulizia mensile cancella il
-- ticket, il legame diventa vuoto e la recensione resta.
--
-- Come si usa, UNA volta sola:
--   SQL Editor → New query → incollare TUTTO questo file → Run.
-- Si puo' rilanciare: non rompe niente.


-- 1. LA TABELLA ---------------------------------------------------------------

create table if not exists public.recensioni (
  id            uuid primary key default gen_random_uuid(),
  booking_id    uuid unique references public.bookings (id) on delete set null,
  -- vuota nelle recensioni copiate da Tripadvisor e Facebook
  excursion_id  text check (excursion_id ~ '^[a-z0-9-]{1,60}$'),
  -- vuota solo in quelle di Facebook, che non hanno stelle
  stelle        smallint check (stelle between 1 and 5),
  testo         text check (length(testo) <= 1000),
  nome          text not null check (length(nome) between 1 and 40),
  lingua        text not null check (lingua in ('it', 'en', 'es', 'fr', 'de')),
  -- il primo giorno del mese dell'escursione: in pagina "ottobre 2026"
  mese          date not null,
  -- da dove viene: scritta su Isla, oppure copiata dall'ufficio
  fonte         text not null default 'isla'
                check (fonte in ('isla', 'tripadvisor', 'facebook', 'google')),
  stato         text not null default 'in_attesa'
                check (stato in ('in_attesa', 'pubblicata')),
  created_at    timestamptz not null default now(),
  pubblicata_at timestamptz
);

-- Per chi aveva gia' lanciato la prima versione di questo file (una
-- recensione per escursione): le colonne nuove, e i due campi che adesso
-- possono restare vuoti. Su un database nuovo non fanno niente.
alter table public.recensioni add column if not exists fonte text not null default 'isla'
  check (fonte in ('isla', 'tripadvisor', 'facebook', 'google'));
alter table public.recensioni alter column excursion_id drop not null;
alter table public.recensioni alter column stelle drop not null;

-- Su Isla le stelle ci sono sempre
alter table public.recensioni drop constraint if exists recensioni_stelle_isla;
alter table public.recensioni add constraint recensioni_stelle_isla
  check (fonte <> 'isla' or stelle is not null);

drop index if exists public.recensioni_scheda_idx;
create index if not exists recensioni_stato_idx on public.recensioni (stato, mese);

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
grant select (id, excursion_id, stelle, testo, nome, lingua, mese, fonte, stato, created_at, pubblicata_at)
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
-- Una per cliente: se un altro suo ticket (stesso telefono) o un'altra sua
-- escursione della stessa richiesta (stessa chiave) ha gia' la recensione,
-- non se ne scrive un'altra. I ticket restano nel database almeno 32 giorni,
-- piu' dei 30 in cui si puo' scrivere, quindi il controllo li trova sempre.
-- Risponde 'ok', 'gia' se questo cliente l'ha gia' scritta, 'no'
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

  if exists (select 1 from public.recensioni r
               join public.bookings x on x.id = r.booking_id
              where x.phone = b.phone
                 or (b.request_token is not null and x.request_token = b.request_token)) then
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
-- Solo le pubblicate, e solo quello che si mostra: la home ("Dicono di noi")
-- le prende tutte insieme (al massimo 200) e fa da sola la media delle stelle.

drop function if exists public.recensioni_della_scheda(text);
drop function if exists public.recensioni_medie();

create or replace function public.recensioni_pubblicate()
returns table (nome text, stelle smallint, testo text, lingua text, mese date,
               excursion_id text, fonte text)
language sql
stable
security definer
set search_path = ''
as $$
  select r.nome, r.stelle, r.testo, r.lingua, r.mese, r.excursion_id, r.fonte
    from public.recensioni r
   where r.stato = 'pubblicata'
   order by r.mese desc, r.pubblicata_at desc nulls last
   limit 200;
$$;

revoke all on function public.recensioni_pubblicate() from public;
grant execute on function public.recensioni_pubblicate() to anon, authenticated;


-- Per controllare, in seguito (una query alla volta):
--
--   le recensioni in attesa:
--     select created_at, excursion_id, stelle, nome, testo from public.recensioni
--      where stato = 'in_attesa' order by created_at;
--
--   inserire una recensione copiata da Tripadvisor o Facebook (gia' pubblicata;
--   stelle null per Facebook, che non le ha):
--     insert into public.recensioni (nome, stelle, testo, lingua, mese, fonte, stato, pubblicata_at)
--     values ('Elisa C.', 5, '...', 'it', '2025-08-01', 'tripadvisor', 'pubblicata', now());
--
--   togliere una recensione pubblicata (il cliente lo ha chiesto):
--     delete from public.recensioni where id = '...';

-- 18 ottobre 2026: il transfer sul ticket, e un netto con o senza transfer.
--
-- Su alcune schede il netto cambia se il cliente prende il transfer
-- (proprietario, 18 ottobre 2026): Mokkai in condivisione, adulto 35 col
-- trasporto e 30 senza; il Castillo col transfer ha un netto suo. Fino a oggi
-- il ticket non diceva se il transfer c'era, e il netto non poteva saperlo.
--
--   - bookings.transfer  true = col transfer, false = senza, vuoto = non si
--                        sa o la scheda non lo offre. Lo scrive il venditore
--                        (casella "Con transfer", solo sulle schede che hanno
--                        il transfer nel catalogo) e la richiesta WhatsApp,
--                        dalla casella "Vuoi il transfer?" del cliente.
--   - nets.transfer      true = netto col transfer, false = senza, vuoto =
--                        uguale nei due casi (tutte le righe di prima).
--                        Come variante e compagnia: vince la riga che lo dice.
--
-- QUANTO non e' scritto qui: il progetto e' pubblico. I numeri vanno in nets
-- col testo che prepara Claude in chat, come gli altri netti.
--
-- ATTENZIONE: cambia la chiave di nets. Da qui un netto nuovo si scrive con
--   on conflict (excursion_id, coalesce(option_label, ''), coalesce(company, ''),
--                coalesce(transfer::text, ''))
-- e i testi preparati prima di oggi, con tre colonne, non vanno piu'.
--
-- Si incolla in Supabase → SQL Editor → New query → Run, DOPO
-- 2026-10-17-netto-fisso.sql e PRIMA di pubblicare il sito nuovo.
-- Lanciato di nuovo non fa danni.


-- 1. IL TRANSFER SUL TICKET -------------------------------------------------

alter table public.bookings add column if not exists transfer boolean;

-- I venditori leggono bookings colonna per colonna (2026-10-08-foglio.sql):
-- la colonna nuova va data anche a loro, se no la pagina non la legge.
grant select (transfer) on public.bookings to authenticated;


-- 2. IL TRANSFER SUL NETTO --------------------------------------------------

alter table public.nets add column if not exists transfer boolean;

drop index if exists public.nets_unico;
create unique index nets_unico
  on public.nets (excursion_id, coalesce(option_label, ''), coalesce(company, ''),
                  coalesce(transfer::text, ''));


-- 3. IL CALCOLO, COL TRANSFER IN PIU' ---------------------------------------
-- Uguale a quello di 2026-10-17-netto-fisso.sql; in piu' una riga col transfer
-- vale solo per i ticket che lo dicono uguale. Un ticket col transfer vuoto
-- prende solo le righe col transfer vuoto.

create or replace function public.calcola_netto(
  p_excursion text, p_option text, p_company text,
  p_adults integer, p_kids integer, p_babies integer, p_units jsonb,
  p_total numeric, p_deposit numeric, p_transfer boolean,
  out netto numeric, out nota text)
language plpgsql
stable
set search_path = ''
as $$
declare
  n public.nets;
  k text;
begin
  select x.* into n from public.nets x
   where x.excursion_id = p_excursion
     and (x.option_label is null or x.option_label = p_option)
     and (x.company is null or x.company = p_company)
     and (x.transfer is null or x.transfer = p_transfer)
   order by (x.option_label is not null) desc, (x.company is not null) desc,
            (x.transfer is not null) desc
   limit 1;

  if n.id is null then
    nota := case when p_company is null then 'netto mancante: compagnia non scritta'
                 else 'netto mancante per ' || p_company end;
    return;
  end if;

  if n.net_fixed is not null then
    netto := n.net_fixed;
    return;
  end if;

  if n.net_from_deposit then
    if p_total is null or p_deposit is null then
      nota := 'netto mancante: totale o acconto non scritto';
      return;
    end if;
    netto := greatest(p_total - p_deposit, 0);
    return;
  end if;

  if n.net_percent is not null then
    if p_total is null then
      nota := 'netto mancante: totale non scritto';
      return;
    end if;
    netto := round(p_total * n.net_percent, 2);
    return;
  end if;

  if n.net_units is not null then
    if p_units is null or p_units = '{}'::jsonb then
      nota := 'netto mancante: mezzi non scritti';
      return;
    end if;
    netto := 0;
    for k in select jsonb_object_keys(p_units) loop
      if not (n.net_units ? k) then
        netto := null;
        nota := 'netto mancante per ' || k;
        return;
      end if;
      netto := netto + (p_units ->> k)::numeric * (n.net_units ->> k)::numeric;
    end loop;
    return;
  end if;

  if coalesce(p_adults, 0) > 0 and n.net_adult is null then nota := 'netto adulto mancante'; return; end if;
  if coalesce(p_kids, 0)   > 0 and n.net_child is null then nota := 'netto bambino mancante'; return; end if;
  if coalesce(p_babies, 0) > 0 and n.net_infant is null then nota := 'netto neonato mancante'; return; end if;
  netto := coalesce(p_adults, 0) * coalesce(n.net_adult, 0)
         + coalesce(p_kids, 0)   * coalesce(n.net_child, 0)
         + coalesce(p_babies, 0) * coalesce(n.net_infant, 0);
end;
$$;

-- Quella di prima, senza il transfer, resta per i testi gia' preparati che la
-- chiamano: passa a quella nuova col transfer vuoto.
create or replace function public.calcola_netto(
  p_excursion text, p_option text, p_company text,
  p_adults integer, p_kids integer, p_babies integer, p_units jsonb,
  p_total numeric, p_deposit numeric,
  out netto numeric, out nota text)
language sql
stable
set search_path = ''
as $$
  select c.netto, c.nota
    from public.calcola_netto(p_excursion, p_option, p_company,
                              p_adults, p_kids, p_babies, p_units,
                              p_total, p_deposit, null::boolean) c;
$$;


-- 4. IL GUARDIANO: si ricalcola anche quando cambia il transfer ---------------

create or replace function public.fissa_netto()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  r record;
begin
  if tg_op = 'UPDATE'
     and (old.net_amount is not null or old.net_note is not null)
     and new.excursion_id is not distinct from old.excursion_id
     and new.option_label is not distinct from old.option_label
     and new.company      is not distinct from old.company
     and new.adults       is not distinct from old.adults
     and new.kids         is not distinct from old.kids
     and new.babies       is not distinct from old.babies
     and new.units        is not distinct from old.units
     and new.total        is not distinct from old.total
     and new.deposit      is not distinct from old.deposit
     and new.transfer     is not distinct from old.transfer then
    new.net_amount := old.net_amount;
    new.net_note   := old.net_note;
    return new;
  end if;
  select * into r from public.calcola_netto(new.excursion_id, new.option_label, new.company,
                                            new.adults, new.kids, new.babies, new.units,
                                            new.total, new.deposit, new.transfer);
  new.net_amount := r.netto;
  new.net_note   := r.nota;
  return new;
end;
$$;


-- 5. LA RICHIESTA WHATSAPP PORTA IL TRANSFER ----------------------------------
-- Uguale a quella di 2026-10-13-richieste-messaggio.sql; ogni voce di p_items
-- puo' avere in piu' "transfer": true o false. Un telefono col sito di ieri
-- non lo manda, e la colonna resta vuota.

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
       or coalesce((voce->>'babies')::int, 0) not between 0 and 99
       or coalesce(voce->>'transfer', 'false') not in ('true', 'false') then
      raise exception 'richiesta non valida';
    end if;

    insert into public.bookings
      (source, status, request_token, request_code, excursion_id, option_label,
       date, wanted_time, adults, kids, babies, seller_id,
       customer_name, request_message, hotel, pickup_point, pickup_time, transfer)
    values
      ('whatsapp', 'pending', p_token, p_code, voce->>'excursion_id',
       nullif(voce->>'option_label', ''), (voce->>'date')::date,
       nullif(voce->>'wanted_time', ''),
       coalesce((voce->>'adults')::int, 0), coalesce((voce->>'kids')::int, 0),
       coalesce((voce->>'babies')::int, 0), null,
       nullif(trim(coalesce(p_name, '')), ''), nullif(p_message, ''),
       nullif(trim(coalesce(voce->>'hotel', '')), ''),
       nullif(voce->>'pickup_point', ''), nullif(voce->>'pickup_time', ''),
       (voce->>'transfer')::boolean);
    quante := quante + 1;
  end loop;
  return quante;
end;
$$;

revoke all on function public.calcola_netto(text, text, text, integer, integer, integer, jsonb, numeric, numeric, boolean) from public, anon, authenticated;
revoke all on function public.calcola_netto(text, text, text, integer, integer, integer, jsonb, numeric, numeric) from public, anon, authenticated;
revoke all on function public.fissa_netto() from public, anon, authenticated;
revoke all on function public.manda_richiesta(uuid, text, jsonb, text, text) from public;
grant execute on function public.manda_richiesta(uuid, text, jsonb, text, text) to anon, authenticated;

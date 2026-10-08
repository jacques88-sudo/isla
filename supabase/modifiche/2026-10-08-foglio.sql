-- 8 ottobre 2026: la porta da cui il foglio Google legge i ticket coi netti.
--
-- Il riepilogo dei netti (quanto va a ogni compagnia, quanto resta a Isla) non
-- sta su Isla ma su un foglio Google del proprietario. Il programma del foglio
-- (foglio-google/Codice.gs) ogni ora chiama la funzione foglio_ticket() qui
-- sotto e riceve i ticket col netto gia' calcolato.
--
-- La funzione si apre solo con una PAROLA SEGRETA. Qui c'e' solo il posto dove
-- metterla (la tabella export_keys, che dal sito non si raggiunge): la parola
-- vera non sta in nessun file del progetto, che e' pubblico. Si inserisce a
-- parte, col testo che prepara Claude in chat. Nella tabella non si salva la
-- parola ma la sua impronta (sha256): anche chi leggesse la tabella non
-- saprebbe la parola.
--
-- Fa anche un'altra cosa: FISSA IL NETTO SUL TICKET quando si salva (punto 2).
--
-- Si incolla in Supabase → SQL Editor → New query → Run, DOPO
-- 2026-10-08-netti.sql. Lanciato di nuovo non fa danni.

-- 1. Le parole segrete, una per foglio. Nessun permesso a nessuno: la legge
--    solo la funzione qui sotto ("security definer").
create table if not exists public.export_keys (
  hash        text primary key,          -- sha256 della parola, in esadecimale
  name        text not null,             -- a cosa serve ("Foglio Google ufficio")
  created_at  timestamptz not null default now()
);
alter table public.export_keys enable row level security;
revoke all on public.export_keys from anon, authenticated;

-- 2. Il netto si FISSA sul ticket quando si salva (net_amount, net_note).
--
-- Cosi' un netto cambiato domani non riscrive i ticket di oggi: Agua Safari
-- che passa da 60 a 65 vale per i ticket nuovi, non per quelli gia' venduti.
-- Si ricalcola solo quando cambia quello da cui dipende (scheda, variante,
-- compagnia, persone, mezzi): un ticket rinviato con una persona in piu' prende
-- il netto giusto per come e' adesso.
--
-- Come si calcola:
--   - si cerca in nets la riga della scheda; la variante e la compagnia della
--     riga, se ci sono, devono essere quelle del ticket. Se ce ne sono piu'
--     d'una vince la piu' precisa (variante e compagnia scritte);
--   - se la riga ha net_units (moto d'acqua, buggy…) si contano i mezzi:
--     doppie × netto doppia + …; altrimenti le persone: adulti × netto adulto
--     + bambini × netto bambino + neonati × netto neonato;
--   - se manca un pezzo (nessuna riga, un bambino senza netto bambino, un tipo
--     di mezzo senza netto) net_amount resta VUOTO e net_note dice perche'. Mai
--     un numero inventato o preso da un'altra compagnia.

alter table public.bookings
  add column if not exists net_amount numeric(8,2),
  add column if not exists net_note   text;

create or replace function public.calcola_netto(
  p_excursion text, p_option text, p_company text,
  p_adults integer, p_kids integer, p_babies integer, p_units jsonb,
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
   order by (x.option_label is not null) desc, (x.company is not null) desc
   limit 1;

  if n.id is null then
    nota := case when p_company is null then 'netto mancante: compagnia non scritta'
                 else 'netto mancante per ' || p_company end;
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

-- Il "guardiano" che lo fissa. Gira prima di ogni inserimento e modifica di un
-- ticket; "security definer" perche' legge nets anche quando il ticket lo
-- salva una richiesta WhatsApp (il cliente, che nets non la puo' leggere).
-- Su una modifica che non tocca i campi del netto tiene quello di prima: anche
-- chi provasse a scriverlo a mano non lo cambia. Solo se un netto c'e' gia'
-- stato calcolato (net_amount o net_note scritti): un ticket di prima di oggi
-- lo calcola alla prima modifica, ed e' cosi' che lo calcola l'update in fondo.
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
     and new.units        is not distinct from old.units then
    new.net_amount := old.net_amount;
    new.net_note   := old.net_note;
    return new;
  end if;
  select * into r from public.calcola_netto(new.excursion_id, new.option_label, new.company,
                                            new.adults, new.kids, new.babies, new.units);
  new.net_amount := r.netto;
  new.net_note   := r.nota;
  return new;
end;
$$;

drop trigger if exists fissa_netto on public.bookings;
create trigger fissa_netto
  before insert or update on public.bookings
  for each row execute function public.fissa_netto();

-- I ticket gia' salvati prima di oggi: il netto si calcola una volta adesso.
-- L'update non cambia niente, ma fa girare il guardiano qui sopra, che sui
-- ticket senza netto lo calcola.
update public.bookings
   set net_note = net_note
 where net_amount is null and net_note is null;

-- Il netto non lo legge nessuno dal sito, nemmeno i venditori: non serve a
-- nessuna pagina (il promemoria nel modulo e' stato scartato dal proprietario
-- l'8 ottobre), e un venditore di strada non ha bisogno di sapere quanto
-- guadagna Isla. Si legge solo dal foglio, attraverso la porta qui sotto.
--   - nets: i venditori non la leggono piu';
--   - bookings: i venditori leggono tutte le colonne TRANNE net_amount e
--     net_note. Il permesso si da' colonna per colonna, quindi si fa per tutte
--     quelle che ci sono adesso; una colonna aggiunta DOPO va aggiunta anche
--     qui ("grant select (nome) on public.bookings to authenticated"),
--     altrimenti la pagina dei venditori non la legge.
-- Il sito chiede sempre colonne precise, mai "select *": per questo non si rompe.
drop policy if exists "i venditori leggono i netti" on public.nets;
revoke all on public.nets from anon, authenticated;

do $$
declare
  colonne text;
begin
  select string_agg(quote_ident(column_name), ', ' order by ordinal_position)
    into colonne
    from information_schema.columns
   where table_schema = 'public' and table_name = 'bookings'
     and column_name not in ('net_amount', 'net_note');
  revoke select on public.bookings from authenticated;
  execute format('grant select (%s) on public.bookings to authenticated', colonne);
end;
$$;

revoke all on function public.calcola_netto(text, text, text, integer, integer, integer, jsonb) from public, anon, authenticated;
revoke all on function public.fissa_netto() from public, anon, authenticated;

-- 3. La porta. Sola lettura: restituisce righe, non scrive e non cancella.
-- I giorni sono quelli di Tenerife: un ticket inserito alle 00:30 e' di oggi.
drop function if exists public.foglio_ticket(text);
create function public.foglio_ticket(p_segreto text)
returns table (
  id             uuid,
  inserito       date,
  settimana      date,                   -- il lunedi' della settimana di "inserito"
  ticket_number  text,
  stato          text,
  origine        text,
  excursion_id   text,
  option_label   text,
  company        text,
  data_gita      date,
  adults         integer,
  kids           integer,
  babies         integer,
  units          jsonb,
  total          numeric,
  deposit        numeric,
  rest_to_pay    numeric,
  seller         text,
  netto          numeric,
  quota_isla     numeric,
  nota           text
)
language sql
stable
security definer
set search_path = ''
as $$
  select b.id,
         (b.created_at at time zone 'Atlantic/Canary')::date,
         (date_trunc('week', (b.created_at at time zone 'Atlantic/Canary')::date))::date,
         b.ticket_number,
         case b.status when 'confirmed' then 'confermato'
                       when 'cancelled' then 'annullato'
                       else 'in attesa' end,
         b.source, b.excursion_id, b.option_label, b.company, b.date,
         b.adults, b.kids, b.babies, b.units, b.total, b.deposit, b.rest_to_pay, b.seller,
         b.net_amount,
         case when b.net_amount is not null and b.total is not null then b.total - b.net_amount end,
         b.net_note
    from public.bookings b
   where exists (
     select 1 from public.export_keys k
      where k.hash = encode(sha256(convert_to(coalesce(p_segreto, ''), 'UTF8')), 'hex')
   )
   order by b.created_at;
$$;

revoke all on function public.foglio_ticket(text) from public;
grant execute on function public.foglio_ticket(text) to anon;

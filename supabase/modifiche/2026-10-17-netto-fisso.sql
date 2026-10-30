-- 17 ottobre 2026: due modi nuovi di dire il netto.
--
-- 1. NETTO FISSO PER TICKET (net_fixed). La barca privata: alla compagnia va
--    una cifra per tutta la barca, quante che siano le persone a bordo
--    (Mokkai, Kalima Kat; proprietario, 17 ottobre 2026).
--
-- 2. LA COMMISSIONE E' L'ACCONTO (net_from_deposit). Isla tiene l'acconto, il
--    resto il cliente lo paga sul posto alla compagnia: netto = totale meno
--    acconto (Fevi, il rent bike; MRB, dove l'acconto e' il 40% del prezzo
--    ufficiale; proprietario, 17 ottobre 2026).
--
-- QUANTO non e' scritto qui: il progetto e' pubblico. I numeri vanno in nets
-- col testo che prepara Claude in chat, come gli altri netti.
--
-- Il netto dipende adesso anche dall'ACCONTO: il guardiano lo ricalcola anche
-- quando cambia l'acconto.
--
-- Si incolla in Supabase → SQL Editor → New query → Run, DOPO
-- 2026-10-09-percentuale.sql. Lanciato di nuovo non fa danni.

alter table public.nets
  add column if not exists net_fixed numeric(8,2) check (net_fixed >= 0);
alter table public.nets
  add column if not exists net_from_deposit boolean not null default false;

-- Il calcolo, con l'acconto in piu'. Per il resto e' uguale a quello di
-- 2026-10-09-percentuale.sql.
create or replace function public.calcola_netto(
  p_excursion text, p_option text, p_company text,
  p_adults integer, p_kids integer, p_babies integer, p_units jsonb,
  p_total numeric, p_deposit numeric,
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

-- Quella di prima, senza l'acconto, resta per i testi gia' preparati che la
-- chiamano: passa a quella nuova. Un netto "commissione = acconto", da qui,
-- resta vuoto.
create or replace function public.calcola_netto(
  p_excursion text, p_option text, p_company text,
  p_adults integer, p_kids integer, p_babies integer, p_units jsonb,
  p_total numeric,
  out netto numeric, out nota text)
language sql
stable
set search_path = ''
as $$
  select c.netto, c.nota
    from public.calcola_netto(p_excursion, p_option, p_company,
                              p_adults, p_kids, p_babies, p_units,
                              p_total, null::numeric) c;
$$;

-- Il guardiano: come prima, ma guarda anche l'acconto.
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
     and new.deposit      is not distinct from old.deposit then
    new.net_amount := old.net_amount;
    new.net_note   := old.net_note;
    return new;
  end if;
  select * into r from public.calcola_netto(new.excursion_id, new.option_label, new.company,
                                            new.adults, new.kids, new.babies, new.units,
                                            new.total, new.deposit);
  new.net_amount := r.netto;
  new.net_note   := r.nota;
  return new;
end;
$$;

revoke all on function public.calcola_netto(text, text, text, integer, integer, integer, jsonb, numeric, numeric) from public, anon, authenticated;
revoke all on function public.calcola_netto(text, text, text, integer, integer, integer, jsonb, numeric) from public, anon, authenticated;
revoke all on function public.fissa_netto() from public, anon, authenticated;

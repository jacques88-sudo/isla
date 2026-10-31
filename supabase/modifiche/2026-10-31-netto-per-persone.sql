-- 31 ottobre 2026: il netto della barca intera che cambia col numero di persone.
--
-- Fino a oggi un charter privato aveva un netto solo (net_fixed), qualunque
-- fosse il gruppo. Ocean Blue (sul ticket anche "Xixaron") ha tre scaglioni
-- (proprietario, 31 ottobre 2026): fino a 11 persone, fino a 15, fino a 18,
-- ognuno col suo netto.
--
--   - nets.net_fixed_people   {"11": X, "15": Y, "18": Z}: la chiave e' il
--                             massimo di persone dello scaglione, il valore il
--                             netto della barca intera. Si contano adulti,
--                             bambini e neonati: sulla barca salgono tutti.
--                             Vince lo scaglione piu' piccolo che basta; oltre
--                             l'ultimo il ticket resta senza netto, con la
--                             nota "netto mancante: piu' di N persone".
--
-- I NUMERI non sono qui: il progetto e' pubblico. Vanno in nets col testo che
-- prepara Claude in chat, come gli altri netti.
--
-- Si incolla in Supabase → SQL Editor → New query → Run, DOPO
-- 2026-10-18-transfer.sql. Lanciato di nuovo non fa danni. La chiave di nets
-- non cambia, e i ticket gia' salvati non cambiano.

alter table public.nets
  add column if not exists net_fixed_people jsonb
  check (net_fixed_people is null or jsonb_typeof(net_fixed_people) = 'object');

-- calcola_netto() come in 2026-10-18-transfer.sql, con un caso in piu' prima
-- del netto fisso: gli scaglioni di persone.
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
  persone integer;
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

  if n.net_fixed_people is not null then
    persone := coalesce(p_adults, 0) + coalesce(p_kids, 0) + coalesce(p_babies, 0);
    if persone = 0 then
      nota := 'netto mancante: persone non scritte';
      return;
    end if;
    select v.value::numeric into netto
      from jsonb_each_text(n.net_fixed_people) v
     where v.key::integer >= persone
     order by v.key::integer
     limit 1;
    if netto is null then
      select 'netto mancante: più di ' || max(v.key::integer) || ' persone' into nota
        from jsonb_each_text(n.net_fixed_people) v;
    end if;
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

revoke all on function public.calcola_netto(text, text, text, integer, integer, integer, jsonb, numeric, numeric, boolean) from public, anon, authenticated;

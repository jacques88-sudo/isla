-- 20 ottobre 2026: le recensioni le pubblica, scarta e toglie SOLO l'ufficio
-- (proprietario). Prima ogni venditore col login poteva farlo
-- (2026-10-20-recensioni.sql); i venditori per strada non le devono toccare.
-- "Ufficio" e' chi ha office = true in sellers, come per le statistiche
-- (is_office(), supabase/modifiche/2026-10-05-ufficio.sql).
--
-- Si lancia DOPO 2026-10-20-recensioni.sql.
-- Come si usa, UNA volta sola:
--   SQL Editor → New query → incollare TUTTO questo file → Run.
-- Si puo' rilanciare: non rompe niente.

drop policy if exists "i venditori leggono le recensioni" on public.recensioni;
drop policy if exists "i venditori pubblicano le recensioni" on public.recensioni;
drop policy if exists "i venditori scartano le recensioni" on public.recensioni;

drop policy if exists "l'ufficio legge le recensioni" on public.recensioni;
create policy "l'ufficio legge le recensioni"
  on public.recensioni for select to authenticated using (public.is_office());
drop policy if exists "l'ufficio pubblica le recensioni" on public.recensioni;
create policy "l'ufficio pubblica le recensioni"
  on public.recensioni for update to authenticated
  using (public.is_office()) with check (public.is_office());
drop policy if exists "l'ufficio scarta le recensioni" on public.recensioni;
create policy "l'ufficio scarta le recensioni"
  on public.recensioni for delete to authenticated using (public.is_office());

-- I permessi colonna per colonna restano quelli del primo file: si legge tutto
-- tranne il legame col ticket, si cambia solo lo stato, si cancella.

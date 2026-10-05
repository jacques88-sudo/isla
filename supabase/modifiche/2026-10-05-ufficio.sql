-- 5 ottobre 2026: quali account sono dell'ufficio.
--
-- In venditori.html c'e' una sezione "Statistiche" (quante prenotazioni, quali
-- escursioni, quanto incassato, chi ha venduto) che il proprietario vuole far
-- vedere SOLO all'ufficio, non ai venditori di strada. Fin qui il database
-- conosceva una sola specie di account, il venditore (tabella sellers). Questo
-- file aggiunge un segno, "office", a quelli dell'ufficio, e una domanda che il
-- sito puo' fare: is_office(), "chi e' entrato e' dell'ufficio?".
--
-- ATTENZIONE, il limite: questo NASCONDE la sezione ai venditori, non toglie
-- loro i dati. Le regole di oggi lasciano leggere tutti i ticket a ogni
-- venditore (serve a cercare il ticket di un cliente), e da li' le somme si
-- possono rifare. Togliere quella lettura e' un'altra decisione: vedi NOTES.md.
--
-- Come si usa, UNA volta sola:
--   SQL Editor → New query → incollare TUTTO questo file → Run.
--   Poi, in fondo, la riga "update" con il nome giusto (vedi sotto).
-- Lanciato due volte non fa danni.

-- 1. Il segno. Falso per tutti: nessuno diventa ufficio senza che lo si dica.
alter table public.sellers
  add column if not exists office boolean not null default false;

-- 2. La domanda. "security definer" perche' un venditore legge solo la propria
-- riga di sellers: cosi' la risposta e' sempre giusta, ma dice solo si' o no,
-- e solo di chi sta chiamando.
create or replace function public.is_office()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.sellers where user_id = auth.uid() and office
  );
$$;

revoke all on function public.is_office() from public;
grant execute on function public.is_office() to authenticated;

-- 3. Chi e' dell'ufficio. Si scrive il nome come compare in alto nella pagina
-- dei venditori ("Ciao, …"), che e' la colonna name di sellers. Per vedere i
-- nomi:   select name, office from public.sellers;
-- Togliere i due trattini davanti alla riga qui sotto, cambiare il nome, Run:
--
-- update public.sellers set office = true where name = 'NOME DELL''UFFICIO';

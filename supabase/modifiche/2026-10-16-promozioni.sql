-- 16 ottobre 2026: le email per le promozioni, solo con il si' del cliente.
--
-- Deciso dal proprietario: strada B, solo email. Nella finestra della lista
-- (lista.js) c'e' una casella NON spuntata, "Voglio ricevere le offerte di
-- Admiral per email". Solo chi la spunta finisce qui: email, lingua, quando ha
-- detto si' e la frase esatta che ha spuntato (e' la prova del consenso).
--
-- Questa tabella NON si svuota ogni mese come le richieste: una riga resta
-- finche' il cliente non chiede di uscire. Per toglierlo: Table Editor →
-- promozioni → la riga → Delete (oppure la riga "delete" in fondo).
-- L'elenco si scarica da Table Editor → promozioni → Export to CSV.
--
-- Le email delle richieste restano FUORI dal database come prima: qui c'e'
-- solo chi ha detto si'. Lo spiega privacy.html.
--
-- Come si usa, UNA volta sola: SQL Editor → New query → incollare TUTTO →
-- Run. Lanciato due volte non fa danni.


-- 1. L'ELENCO ---------------------------------------------------------------

create table if not exists public.promozioni (
  email          text primary key
                 check (length(email) <= 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]{2,}$'),
  lang           text not null default 'it' check (lang in ('it', 'en', 'es', 'fr', 'de')),
  consenso_at    timestamptz not null default now(),
  testo_consenso text not null
);

-- RLS accesa: dal sito nessuno la legge. Si scrive solo da iscrivi_promozioni().
alter table public.promozioni enable row level security;

-- L'ufficio (sellers.office, vedi 2026-10-05-ufficio.sql) la puo' leggere e
-- togliere qualcuno dalla pagina dei venditori, se un giorno servira'.
drop policy if exists "ufficio legge promozioni" on public.promozioni;
create policy "ufficio legge promozioni" on public.promozioni
  for select to authenticated using (public.is_office());
drop policy if exists "ufficio toglie promozioni" on public.promozioni;
create policy "ufficio toglie promozioni" on public.promozioni
  for delete to authenticated using (public.is_office());
grant select, delete on public.promozioni to authenticated;


-- 2. IL CLIENTE DICE SI' ----------------------------------------------------
-- L'unica porta da cui il sito scrive. La stessa email due volte non fa un
-- doppione: si aggiornano lingua, data e frase.

create or replace function public.iscrivi_promozioni(p_email text, p_lang text, p_testo text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.promozioni (email, lang, testo_consenso)
  values (
    lower(trim(p_email)),
    case when p_lang in ('it', 'en', 'es', 'fr', 'de') then p_lang else 'it' end,
    left(coalesce(nullif(trim(p_testo), ''), 'si'), 500)
  )
  on conflict (email) do update
    set lang = excluded.lang,
        consenso_at = now(),
        testo_consenso = excluded.testo_consenso;
end;
$$;

revoke all on function public.iscrivi_promozioni(text, text, text) from public;
grant execute on function public.iscrivi_promozioni(text, text, text) to anon, authenticated;


-- 3. TOGLIERE QUALCUNO --------------------------------------------------------
-- Togliere i due trattini, scrivere l'email, Run:
--
-- delete from public.promozioni where email = lower('cliente@esempio.com');

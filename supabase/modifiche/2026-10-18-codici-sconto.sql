-- 18 ottobre 2026: i codici sconto dei venditori.
--
-- Deciso dal proprietario: ogni venditore ha il suo codice. Il cliente lo
-- scrive nella finestra della lista (lista.js) e il totale scende del 5% sulle
-- escursioni singole. Niente sconto su parchi, spettacoli, schede a prezzo
-- fisso (`fixedPrice`) e pacchetti, che hanno gia' il loro: lo decide il sito
-- (scontoPossibile in pacchetti.js), non questa tabella.
--
-- I codici stanno QUI e non nel sito: il repository e' pubblico, e un codice
-- scritto in un file lo leggerebbe chiunque. Il sito chiede solo "questo
-- codice vale?" (codice_sconto) e riceve la percentuale, o niente. L'elenco
-- non lo legge nessuno da fuori.
--
-- Il codice finisce nel messaggio WhatsApp e nella sua copia nel database
-- (request_message): e' li' che l'ufficio vede da quale venditore arriva il
-- cliente e con che totale preparare il link di pagamento.
--
-- Come si usa, UNA volta sola: SQL Editor → New query → incollare TUTTO →
-- Run. Lanciato due volte non fa danni. Poi i codici si aggiungono con le
-- righe in fondo.


-- 1. L'ELENCO ---------------------------------------------------------------
-- Il codice si scrive in maiuscolo, lettere, numeri e trattino, da 3 a 30:
-- il cliente lo ricopia dal telefono o da un biglietto, e "marco5" o
-- "MARCO 5" diventano MARCO5 (la funzione qui sotto e lista.js fanno lo
-- stesso). Spento (`attivo = false`) non vale piu', ma resta nell'elenco:
-- i messaggi vecchi lo nominano ancora.

create table if not exists public.codici_sconto (
  codice     text primary key check (codice ~ '^[A-Z0-9-]{3,30}$'),
  venditore  text not null,
  percento   int not null default 5 check (percento between 1 and 50),
  attivo     boolean not null default true,
  creato_at  timestamptz not null default now()
);

-- RLS accesa e nessun permesso al sito: si legge solo da codice_sconto().
alter table public.codici_sconto enable row level security;

-- L'ufficio (sellers.office, vedi 2026-10-05-ufficio.sql) lo puo' leggere
-- dalla pagina dei venditori, se un giorno servira'.
drop policy if exists "ufficio legge codici sconto" on public.codici_sconto;
create policy "ufficio legge codici sconto" on public.codici_sconto
  for select to authenticated using (public.is_office());
grant select on public.codici_sconto to authenticated;


-- 2. IL SITO CHIEDE SE UN CODICE VALE ---------------------------------------
-- Torna la percentuale, o null se il codice non c'e' o e' spento. Mai il nome
-- del venditore: quello lo legge l'ufficio, non il cliente.

create or replace function public.codice_sconto(p_codice text)
returns int
language sql
stable
security definer
set search_path = ''
as $$
  select percento
  from public.codici_sconto
  where codice = upper(regexp_replace(coalesce(p_codice, ''), '\s', '', 'g'))
    and attivo;
$$;

revoke all on function public.codice_sconto(text) from public;
grant execute on function public.codice_sconto(text) to anon, authenticated;


-- 3. AGGIUNGERE, SPEGNERE, VEDERE --------------------------------------------
-- Togliere i due trattini, cambiare codice e nome, Run.
--
-- Un codice nuovo (5% se non si scrive altro):
-- insert into public.codici_sconto (codice, venditore) values ('MARCO', 'Marco');
--
-- Spegnerlo (un venditore che non lavora piu' con Isla):
-- update public.codici_sconto set attivo = false where codice = 'MARCO';
--
-- Tutti i codici:
-- select * from public.codici_sconto order by venditore;

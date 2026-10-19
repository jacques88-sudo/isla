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
-- Dentro anche la colonna discount_code delle richieste (punto 3), per
-- contare quante richieste porta ogni venditore.
--
-- Come si usa, UNA volta sola: SQL Editor → New query → incollare TUTTO →
-- Run. Lanciato due volte non fa danni. Va lanciato DOPO
-- 2026-10-18-transfer.sql. Poi i codici si aggiungono con le righe in fondo.


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


-- 3. IL CODICE SULLA RICHIESTA -------------------------------------------------
-- Per contare le richieste di ogni venditore senza leggere i messaggi: la
-- colonna discount_code di bookings, riempita da manda_richiesta. Ci entra
-- solo un codice che c'e' ed e' acceso: quello che il sito ha gia' controllato.
-- Un codice inventato da chi chiama la funzione a mano resta fuori.

alter table public.bookings add column if not exists discount_code text;

-- Una colonna nuova di bookings va data anche ai venditori (CLAUDE.md), se no
-- la loro pagina non la legge.
grant select (discount_code) on public.bookings to authenticated;

-- manda_richiesta: uguale a quella di 2026-10-18-transfer.sql, con in piu'
-- p_discount_code. Quella di prima (cinque argomenti) si toglie: con due
-- versioni il database non saprebbe quale usare. Un telefono col sito di ieri
-- non manda il codice, e la richiesta entra lo stesso.

drop function if exists public.manda_richiesta(uuid, text, jsonb, text, text);

create or replace function public.manda_richiesta(
  p_token uuid, p_code text, p_items jsonb,
  p_name text default null, p_message text default null,
  p_discount_code text default null)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  voce jsonb;
  quante integer := 0;
  sconto text;
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

  -- il codice sconto, solo se esiste ed e' acceso; se no la richiesta entra
  -- senza, come se non l'avesse scritto
  select codice into sconto
  from public.codici_sconto
  where codice = upper(regexp_replace(coalesce(p_discount_code, ''), '\s', '', 'g'))
    and attivo;

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
       customer_name, request_message, hotel, pickup_point, pickup_time, transfer,
       discount_code)
    values
      ('whatsapp', 'pending', p_token, p_code, voce->>'excursion_id',
       nullif(voce->>'option_label', ''), (voce->>'date')::date,
       nullif(voce->>'wanted_time', ''),
       coalesce((voce->>'adults')::int, 0), coalesce((voce->>'kids')::int, 0),
       coalesce((voce->>'babies')::int, 0), null,
       nullif(trim(coalesce(p_name, '')), ''), nullif(p_message, ''),
       nullif(trim(coalesce(voce->>'hotel', '')), ''),
       nullif(voce->>'pickup_point', ''), nullif(voce->>'pickup_time', ''),
       (voce->>'transfer')::boolean,
       sconto);
    quante := quante + 1;
  end loop;
  return quante;
end;
$$;

revoke all on function public.manda_richiesta(uuid, text, jsonb, text, text, text) from public;
grant execute on function public.manda_richiesta(uuid, text, jsonb, text, text, text) to anon, authenticated;


-- 4. AGGIUNGERE, SPEGNERE, VEDERE --------------------------------------------
-- Togliere i due trattini, cambiare codice e nome, Run.
--
-- Un codice nuovo (5% se non si scrive altro):
-- insert into public.codici_sconto (codice, venditore) values ('MARCO', 'Marco')
--   on conflict (codice) do nothing;
--
-- Spegnerlo (un venditore che non lavora piu' con Isla):
-- update public.codici_sconto set attivo = false where codice = 'MARCO';
--
-- Tutti i codici:
-- select * from public.codici_sconto order by venditore;
--
-- Quante richieste ha portato ogni venditore (una richiesta = un codice
-- richiesta, anche se dentro ci sono piu' escursioni). Attenzione: la pulizia
-- mensile cancella le richieste vecchie, quindi si conta prima di fine mese.
-- select c.venditore, b.discount_code,
--        count(distinct b.request_code) as richieste,
--        count(distinct b.request_code) filter (where b.status = 'confirmed') as confermate
-- from public.bookings b
-- join public.codici_sconto c on c.codice = b.discount_code
-- group by c.venditore, b.discount_code
-- order by richieste desc;

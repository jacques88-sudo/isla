-- 30 ottobre 2026: le correzioni dell'audit che toccano il database.
--
-- 1. LA PULIZIA MENSILE SI FERMA SE IL FOGLIO GOOGLE E' FERMO. Il foglio e'
--    l'unico archivio dei conti: prima la pulizia cancellava i ticket anche se
--    il foglio non li leggeva da settimane. Ora il foglio segna ogni lettura
--    riuscita (foglio_letto) e la pulizia, se l'ultima ha piu' di 3 giorni, non
--    cancella niente. Riprova il mese dopo; l'errore si legge in
--    cron.job_run_details.
-- 2. UN LIMITE ALLE RICHIESTE PER INDIRIZZO DI RETE. Prima c'era solo il tetto
--    di 300 righe l'ora per tutti: bastavano 30 chiamate fatte a macchina per
--    bloccare i clienti veri. Ora ogni indirizzo di rete ha 30 righe l'ora, e il
--    tetto generale resta. Dell'indirizzo si tiene solo l'impronta (sha256), per
--    un'ora: lo dice anche privacy.html.
-- 3. IL TELEFONO DEI TENTATIVI DEVE ESSERE UN TELEFONO. Prima ci entrava
--    qualunque testo, di qualunque lunghezza.
-- 4. GLI AVVISI NON PARTITI SI RIPROVANO. manda-notifiche toglie il segno di un
--    avviso fallito per un errore passeggero: le servono i due permessi qui sotto.
-- 5. pulisci-foto E meteo-aemet RISPONDONO SOLO ALL'OROLOGIO. I due lavori di Cron
--    mandano la stessa parola segreta di manda-notifiche, che viene letta dal
--    suo lavoro: la parola non sta in questo file.
--
-- IN QUESTO ORDINE:
--   1. SQL Editor → New query → incollare TUTTO questo file → Run;
--   2. Edge Functions: incollare e distribuire i nuovi index.ts di manda-notifiche,
--      pulisci-foto e meteo-aemet. "Verify JWT" resta SPENTO;
--   3. foglio Google: Estensioni → Apps Script → incollare il nuovo Codice.gs →
--      Salva, poi toccare "Aggiorna adesso". FINCHE' NON SI FA, LA PULIZIA MENSILE
--      NON CANCELLA NIENTE (non fa danni: riprova il mese dopo).
-- Si puo' rilanciare: non rompe niente.


-- 1. LA PULIZIA E IL FOGLIO --------------------------------------------------

alter table public.export_keys add column if not exists ultima_lettura timestamptz;

create or replace function public.foglio_letto(p_segreto text)
returns boolean
language sql
security definer
set search_path = ''
as $$
  with segnate as (
    update public.export_keys k set ultima_lettura = now()
     where k.hash = encode(sha256(convert_to(coalesce(p_segreto, ''), 'UTF8')), 'hex')
    returning 1
  )
  select exists (select 1 from segnate);
$$;

revoke all on function public.foglio_letto(text) from public;
grant execute on function public.foglio_letto(text) to anon;

-- La stessa di 2026-09-30-pulizia-mensile.sql, col controllo in piu'.
create or replace function public.pulisci_ticket_vecchi()
returns integer
language plpgsql
set search_path = ''
as $$
declare
  limite date := (date_trunc('month', current_date) - interval '1 month')::date;
  quanti integer;
begin
  if coalesce((select max(k.ultima_lettura) from public.export_keys k), '-infinity')
     < now() - interval '3 days' then
    raise exception 'il foglio Google non legge i ticket da piu'' di 3 giorni: non cancello niente';
  end if;

  delete from public.bookings
   where date < limite
      or (date is null and created_at < limite);
  get diagnostics quanti = row_count;
  return quanti;
end;
$$;

revoke all on function public.pulisci_ticket_vecchi() from public;
revoke all on function public.pulisci_ticket_vecchi() from anon, authenticated;


-- 2. IL LIMITE PER INDIRIZZO DI RETE -----------------------------------------

create table if not exists public.tentativi_richieste (
  impronta text        not null,
  righe    integer     not null,
  at       timestamptz not null default now()
);
create index if not exists tentativi_richieste_impronta_at on public.tentativi_richieste (impronta, at);

alter table public.tentativi_richieste enable row level security;
revoke all on public.tentativi_richieste from anon, authenticated;

-- La stessa di 2026-10-18-codici-sconto.sql, col limite in piu'. Senza un
-- indirizzo leggibile vale solo il tetto generale: meglio una richiesta in piu'
-- che un cliente vero bloccato.
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
  intestazioni json := nullif(current_setting('request.headers', true), '')::json;
  rete text := nullif(trim(coalesce(intestazioni->>'cf-connecting-ip',
                                    split_part(intestazioni->>'x-forwarded-for', ',', 1))), '');
  chi text := encode(sha256(convert_to(rete, 'UTF8')), 'hex');
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

  if chi is not null then
    delete from public.tentativi_richieste where at < now() - interval '1 hour';
    if (select coalesce(sum(t.righe), 0) from public.tentativi_richieste t where t.impronta = chi)
       + jsonb_array_length(p_items) > 30 then
      raise exception 'troppe richieste, riprova piu'' tardi';
    end if;
    insert into public.tentativi_richieste (impronta, righe)
    values (chi, jsonb_array_length(p_items));
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


-- 3. IL TELEFONO DEI TENTATIVI -----------------------------------------------
-- Lo stesso controllo di bookings.phone. "not valid": non guarda le righe che ci
-- sono gia', che fra un'ora non ci saranno piu'.

alter table public.tentativi_ticket drop constraint if exists tentativi_ticket_phone_valido;
alter table public.tentativi_ticket
  add constraint tentativi_ticket_phone_valido
  check (phone ~ '^\+[1-9][0-9]{6,14}$') not valid;


-- 4. I PERMESSI PER RIPROVARE GLI AVVISI ---------------------------------------

grant delete on public.notifiche_mandate to service_role;

-- avvisi_ufficio c'e' solo se 2026-10-22-avvisi-ufficio.sql e' stato lanciato;
-- se si lancia dopo, quel file da' lo stesso permesso.
do $do$
begin
  if to_regclass('public.avvisi_ufficio') is not null then
    grant select, update (sent_at) on public.avvisi_ufficio to service_role;
  end if;
end;
$do$;


-- 5. GLI OROLOGI CON LA PAROLA SEGRETA -----------------------------------------
-- Stesse ore di prima. Si ferma con un errore se la parola non si trova, e allora
-- non cambia niente.

do $do$
declare
  parola text;
begin
  select substring(j.command from '"x-orologio": *"([^"]+)"') into parola
    from cron.job j where j.jobname = 'manda-notifiche';
  if parola is null then
    raise exception 'parola segreta non trovata nel lavoro manda-notifiche';
  end if;

  perform cron.schedule('pulizia-foto-orfane', '30 3 * * *', format($cmd$
    select net.http_post(
      url     := 'https://vjotkgsjtwmtctxtfeqa.supabase.co/functions/v1/pulisci-foto',
      headers := %L::jsonb,
      body    := '{}'::jsonb
    );
  $cmd$, json_build_object('Content-Type', 'application/json', 'x-orologio', parola)::text));

  perform cron.schedule('meteo-aemet', '7 */3 * * *', format($cmd$
    select net.http_post(
      url     := 'https://vjotkgsjtwmtctxtfeqa.supabase.co/functions/v1/meteo-aemet',
      headers := %L::jsonb,
      body    := '{}'::jsonb
    );
  $cmd$, json_build_object('Content-Type', 'application/json', 'x-orologio', parola)::text));
end;
$do$;


-- Per controllare, in seguito (una query alla volta):
--
--   l'ultima lettura del foglio:
--     select name, ultima_lettura from public.export_keys;
--
--   i lavori con la parola (devono mostrare "x-orologio"):
--     select jobname, schedule, command from cron.job;
--
--   le ultime risposte delle funzioni (devono essere 200, non 401):
--     select status_code, content, created from net._http_response
--      order by created desc limit 5;

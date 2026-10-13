-- 13 ottobre 2026: le notifiche sul telefono del cliente.
--
-- Il cliente che manda la lista su WhatsApp puo' chiedere un avviso sul
-- telefono (la casella "Avvisami" nella finestra della lista, lista.js). Riceve
-- tre avvisi, decisi dal proprietario il 6 ottobre:
--   - CONFERMATA: l'ufficio ha confermato la richiesta da venditori.html;
--   - ANNULLATA:  l'ufficio l'ha annullata;
--   - PROMEMORIA: prima dell'escursione. Se si parte prima delle 9:00 arriva
--     la SERA PRIMA alle 20:00; dalle 9:00 in poi DUE ORE PRIMA. Senza nessuna
--     ora (ne' quella del ritrovo ne' quella chiesta dal cliente) la sera prima.
--
-- Come funziona:
--   1. il telefono del cliente da' un "indirizzo" per le notifiche (lo da' il
--      browser, e passa da Google, Apple o Mozilla). Si salva qui in
--      push_iscrizioni, accanto alla CHIAVE della richiesta (request_token):
--      e' la stessa chiave che il telefono usa gia' per leggere le sue
--      richieste (2026-09-30-richieste-whatsapp.sql);
--   2. notifiche_da_mandare() dice cosa c'e' da mandare adesso;
--   3. la funzione supabase/functions/manda-notifiche lo manda e lo segna in
--      notifiche_mandate, cosi' nessun avviso parte due volte. La chiama
--      l'orologio (Cron, ogni 10 minuti, in fondo a questo file) e anche
--      venditori.html subito dopo Conferma o Annulla, per non aspettare.
--
-- Prima di lanciare questo file:
--   1. pubblicare la funzione manda-notifiche (Edge Functions → Deploy a new
--      function → Via Editor, nome "manda-notifiche") e spegnere "Verify JWT"
--      nelle sue impostazioni: l'orologio e venditori.html la chiamano senza
--      login. Chi la chiamasse da fuori otterrebbe solo quello che fa gia'
--      lei ogni 10 minuti;
--   2. mettere nei Secrets delle funzioni (Edge Functions → Secrets):
--        VAPID_PUBLIC_KEY   la stessa di VAPID_PUBLIC_KEY in supabase-config.js
--        VAPID_PRIVATE_KEY  quella segreta, che NON va mai nel sito
--   3. Cron e pg_net gia' attivi (lo sono dal 1° ottobre).
--
-- Poi: SQL Editor → New query → incollare TUTTO → Run. Si puo' rilanciare.


-- 1. GLI INDIRIZZI DEI TELEFONI ---------------------------------------------
-- Una riga per ogni richiesta e ogni telefono. Lo stesso telefono con tre
-- richieste ha tre righe con lo stesso endpoint: ogni richiesta sa a chi
-- mandare i suoi avvisi.

create table if not exists public.push_iscrizioni (
  request_token  uuid not null,
  endpoint       text not null,
  -- le due chiavi con cui si cifra il messaggio: solo quel telefono lo legge
  p256dh         text not null,
  auth           text not null,
  -- la lingua in cui il cliente usava il sito: gli avvisi arrivano in quella
  lang           text not null default 'it' check (lang in ('it', 'en', 'es')),
  -- i titoli delle escursioni della richiesta: {"peter-pan": "Peter Pan", ...}.
  -- Il catalogo sta nel sito, non nel database: senza questi l'avviso non
  -- saprebbe dire "Peter Pan".
  titoli         jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now(),
  primary key (request_token, endpoint)
);

-- Dal sito nessuno legge ne' scrive la tabella direttamente: si passa da
-- avvisami() qui sotto. RLS accesa e nessuna regola = porta chiusa.
alter table public.push_iscrizioni enable row level security;


-- 2. GLI AVVISI GIA' MANDATI ------------------------------------------------
-- Si segnano PRIMA di mandarli: se l'orologio e venditori.html chiamano la
-- funzione nello stesso momento, solo una delle due riesce a segnarlo, e solo
-- quella lo manda. Se il ticket sparisce (pulizia mensile) sparisce anche qui.

create table if not exists public.notifiche_mandate (
  booking_id  uuid not null references public.bookings (id) on delete cascade,
  tipo        text not null check (tipo in ('confirmed', 'cancelled', 'reminder')),
  sent_at     timestamptz not null default now(),
  primary key (booking_id, tipo)
);

alter table public.notifiche_mandate enable row level security;


-- 3. IL CLIENTE CHIEDE GLI AVVISI -------------------------------------------
-- L'unica porta da cui il sito scrive un indirizzo. Si controlla tutto:
--   - l'indirizzo deve essere di un servizio di notifiche vero (Google,
--     Mozilla, Apple, Microsoft): la funzione manda-notifiche non deve poter
--     essere usata per chiamare un sito qualunque;
--   - al massimo 5 telefoni per richiesta;
--   - un tetto per tutti, come per le richieste: piu' di 300 iscrizioni
--     nell'ultima ora vuol dire che qualcuno riempie la tabella a macchina.
-- NON si controlla che la richiesta sia gia' arrivata: il telefono manda la
-- richiesta e l'iscrizione nello stesso momento, mentre la pagina se ne va
-- verso WhatsApp, e l'iscrizione puo' arrivare prima. Un'iscrizione senza
-- richiesta non riceve mai niente, e la funzione la toglie dopo due giorni.

create or replace function public.avvisami(
  p_token uuid, p_endpoint text, p_p256dh text, p_auth text, p_lang text, p_titoli jsonb)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_token is null
     or length(coalesce(p_endpoint, '')) > 1000
     or coalesce(p_endpoint, '') !~ '^https://(fcm\.googleapis\.com|[a-z0-9.-]*push\.services\.mozilla\.com|web\.push\.apple\.com|[a-z0-9.-]*\.notify\.windows\.com)/'
     or coalesce(p_p256dh, '') !~ '^[A-Za-z0-9_=-]{20,200}$'
     or coalesce(p_auth, '')   !~ '^[A-Za-z0-9_=-]{8,100}$'
     or coalesce(p_lang, '') not in ('it', 'en', 'es')
     or p_titoli is null or jsonb_typeof(p_titoli) <> 'object'
     or length(p_titoli::text) > 3000 then
    raise exception 'iscrizione non valida';
  end if;

  if (select count(*) from public.push_iscrizioni
       where created_at > now() - interval '1 hour') > 300 then
    raise exception 'troppe iscrizioni, riprova piu'' tardi';
  end if;

  if (select count(*) from public.push_iscrizioni
       where request_token = p_token and endpoint <> p_endpoint) >= 5 then
    raise exception 'troppi telefoni per questa richiesta';
  end if;

  insert into public.push_iscrizioni (request_token, endpoint, p256dh, auth, lang, titoli)
  values (p_token, p_endpoint, p_p256dh, p_auth, p_lang, p_titoli)
  on conflict (request_token, endpoint) do update
    set p256dh = excluded.p256dh, auth = excluded.auth,
        lang = excluded.lang, titoli = excluded.titoli;
  return true;
end;
$$;

revoke all on function public.avvisami(uuid, text, text, text, text, jsonb) from public;
grant execute on function public.avvisami(uuid, text, text, text, text, jsonb) to anon, authenticated;


-- 4. COSA C'E' DA MANDARE ADESSO --------------------------------------------
-- Una riga per avviso: la escursione, il tipo, e i dati da scrivere.
-- Le ore sono quelle di Tenerife (Atlantic/Canary), anche se il server sta
-- altrove e il cliente ha il telefono con l'ora di casa sua.
--
-- L'ora dell'escursione per il promemoria:
--   - quella del ritrovo, se l'ufficio l'ha messa confermando ("time");
--   - se no l'inizio di quella chiesta dal cliente ("10:00", o "09:00 - 12:00"
--     → 09:00);
--   - se no nessuna: promemoria la sera prima.
-- Un promemoria che non e' partito in tempo (richiesta confermata tardi) parte
-- lo stesso finche' l'escursione non e' cominciata; dopo, non serve piu'.

create or replace function public.notifiche_da_mandare()
returns table (
  booking_id     uuid,
  tipo           text,
  request_token  uuid,
  excursion_id   text,
  "date"         date,
  "time"         time,
  meeting_point  text
)
language sql
stable
security definer
set search_path = ''
as $$
  with vive as (
    select b.*,
           coalesce(b.time,
                    substring(b.wanted_time from '^\s*((?:[01]?[0-9]|2[0-3]):[0-5][0-9])')::time)
             as ora
      from public.bookings b
     where b.source = 'whatsapp'
       and b.date >= (now() at time zone 'Atlantic/Canary')::date
       and exists (select 1 from public.push_iscrizioni p
                    where p.request_token = b.request_token)
  ),
  tempi as (
    select v.*,
           case when v.ora is null or v.ora < time '09:00'
                then ((v.date - 1) + time '20:00') at time zone 'Atlantic/Canary'
                else ((v.date + v.ora) at time zone 'Atlantic/Canary') - interval '2 hours'
           end as promemoria_da,
           (v.date + coalesce(v.ora, time '09:00')) at time zone 'Atlantic/Canary' as inizio
      from vive v
  ),
  avvisi as (
    select t.*, 'confirmed'::text as tipo_avviso from tempi t where t.status = 'confirmed'
    union all
    select t.*, 'cancelled' from tempi t where t.status = 'cancelled'
    union all
    select t.*, 'reminder' from tempi t
     where t.status = 'confirmed' and now() >= t.promemoria_da and now() < t.inizio
  )
  select a.id, a.tipo_avviso, a.request_token, a.excursion_id, a.date, a.time, a.meeting_point
    from avvisi a
   where not exists (select 1 from public.notifiche_mandate n
                      where n.booking_id = a.id and n.tipo = a.tipo_avviso)
   order by a.date, a.id;
$$;

revoke all on function public.notifiche_da_mandare() from public;
grant execute on function public.notifiche_da_mandare() to service_role;


-- 5. I PERMESSI DELLA FUNZIONE ----------------------------------------------
-- Il progetto ha "Automatically expose new tables" spento: senza queste righe
-- la funzione manda-notifiche risponde "permission denied" (vedi
-- 2026-10-01-pulizia-foto.sql).

grant select, delete on public.push_iscrizioni to service_role;
grant select, insert on public.notifiche_mandate to service_role;


-- 6. L'OROLOGIO -------------------------------------------------------------
-- Ogni 10 minuti: il promemoria arriva al massimo 10 minuti dopo l'ora giusta.
-- Conferme e annullamenti arrivano subito (li chiama venditori.html); se in
-- quel momento la rete dell'ufficio cade, li manda l'orologio al giro dopo.

select cron.schedule(
  'manda-notifiche',
  '*/10 * * * *',
  $$
  select net.http_post(
    url     := 'https://vjotkgsjtwmtctxtfeqa.supabase.co/functions/v1/manda-notifiche',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body    := '{}'::jsonb
  );
  $$
);


-- Per controllare, in seguito (una query alla volta):
--
--   i telefoni iscritti:
--     select request_token, lang, titoli, created_at from public.push_iscrizioni
--      order by created_at desc;
--
--   gli avvisi partiti:
--     select n.tipo, n.sent_at, b.request_code, b.excursion_id, b.date
--       from public.notifiche_mandate n join public.bookings b on b.id = n.booking_id
--      order by n.sent_at desc limit 20;
--
--   le ultime chiamate dell'orologio e la risposta della funzione:
--     select created, status_code, content from net._http_response
--      order by created desc limit 5;

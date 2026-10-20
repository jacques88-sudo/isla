-- 20 ottobre 2026: l'avviso sul telefono il giorno dopo l'escursione,
-- "Com'e' andata?", per chiedere la recensione (proprietario).
--
-- Quando: il giorno dopo l'escursione, dalle 18:00 di Tenerife a mezzanotte
-- (l'orologio gira ogni 10 minuti). Se in quelle ore non parte, non parte piu':
-- due giorni dopo chiedere "com'e' andata?" ha meno senso, e gli indirizzi dei
-- telefoni si cancellano due giorni dopo l'ultima escursione.
-- A chi:
--   - solo le richieste WhatsApp confermate (i ticket di carta non hanno
--     avvisi: l'indirizzo del telefono e' legato alla richiesta);
--   - UNA volta per cliente (una recensione per cliente): se la richiesta ha
--     piu' escursioni, l'avviso parte una volta sola, per la piu' recente; e
--     non parte se quella richiesta l'avviso l'ha gia' avuto, o la recensione
--     l'ha gia' scritta;
--   - solo ai telefoni iscritti dal 21 ottobre 2026: chi ha detto si' prima
--     ha letto "quando l'ufficio conferma o annulla, e prima dell'escursione",
--     e a questo avviso non ha detto si'.
--
-- Si lancia DOPO 2026-10-20-recensioni.sql, e poi si RIDISTRIBUISCE la
-- funzione manda-notifiche (sa scrivere il testo del nuovo avviso).
-- Come si usa, UNA volta sola:
--   SQL Editor → New query → incollare TUTTO questo file → Run.
-- Si puo' rilanciare: non rompe niente.


-- 1. IL TIPO NUOVO ----------------------------------------------------------

alter table public.notifiche_mandate drop constraint if exists notifiche_mandate_tipo_check;
alter table public.notifiche_mandate add constraint notifiche_mandate_tipo_check
  check (tipo in ('confirmed', 'cancelled', 'reminder', 'review'));


-- 2. COSA C'E' DA MANDARE ADESSO --------------------------------------------
-- La stessa di 2026-10-13-notifiche.sql, con due cambi:
--   - "vive" guarda anche le escursioni di ieri (per l'avviso della
--     recensione); conferme e annullamenti restano solo da oggi in poi, come
--     prima;
--   - il quarto tipo, 'review'.

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
       and b.date >= (now() at time zone 'Atlantic/Canary')::date - 1
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
  oggi as (
    select (now() at time zone 'Atlantic/Canary')::date as giorno
  ),
  -- la recensione: ieri, confermata, dalle 18:00; una per richiesta
  recensione as (
    select distinct on (t.request_token) t.*
      from tempi t, oggi
     where t.status = 'confirmed'
       and t.date = oggi.giorno - 1
       and now() >= (oggi.giorno + time '18:00') at time zone 'Atlantic/Canary'
       and exists (select 1 from public.push_iscrizioni p
                    where p.request_token = t.request_token
                      and p.created_at >= timestamptz '2026-10-21 00:00:00+01')
       and not exists (select 1 from public.notifiche_mandate n
                         join public.bookings x on x.id = n.booking_id
                        where n.tipo = 'review' and x.request_token = t.request_token)
       and not exists (select 1 from public.recensioni r
                         join public.bookings x on x.id = r.booking_id
                        where x.request_token = t.request_token)
     order by t.request_token, t.date desc, t.ora desc nulls last, t.id
  ),
  avvisi as (
    select t.*, 'confirmed'::text as tipo_avviso from tempi t, oggi
     where t.status = 'confirmed' and t.date >= oggi.giorno
    union all
    select t.*, 'cancelled' from tempi t, oggi
     where t.status = 'cancelled' and t.date >= oggi.giorno
    union all
    select t.*, 'reminder' from tempi t
     where t.status = 'confirmed' and now() >= t.promemoria_da and now() < t.inizio
    union all
    select r.*, 'review' from recensione r
  )
  select a.id, a.tipo_avviso, a.request_token, a.excursion_id, a.date, a.time, a.meeting_point
    from avvisi a
   where not exists (select 1 from public.notifiche_mandate n
                      where n.booking_id = a.id and n.tipo = a.tipo_avviso)
   order by a.date, a.id;
$$;

revoke all on function public.notifiche_da_mandare() from public;
grant execute on function public.notifiche_da_mandare() to service_role;

-- La funzione gira come chi l'ha creata (security definer): per guardare se
-- la recensione c'e' gia' non servono altri permessi.


-- Per controllare, in seguito:
--   gli avvisi della recensione partiti:
--     select n.sent_at, b.request_code, b.excursion_id, b.date
--       from public.notifiche_mandate n join public.bookings b on b.id = n.booking_id
--      where n.tipo = 'review' order by n.sent_at desc limit 20;

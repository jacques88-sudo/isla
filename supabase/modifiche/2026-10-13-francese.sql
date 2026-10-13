-- 13 ottobre 2026: il francese, quarta lingua del sito.
--
-- Gli avvisi sul telefono (2026-10-13-notifiche.sql) arrivano nella lingua in
-- cui il cliente usava il sito, e il database accettava solo it, en ed es: chi
-- usa il sito in francese si vedeva rifiutare l'iscrizione. Il telefono la
-- riprova da solo (richieste.js), quindi dopo questo file si iscrive senza
-- che il cliente rifaccia niente.
--
-- Cambiano due cose: la regola sulla colonna lang di push_iscrizioni, e il
-- controllo dentro avvisami(). La funzione e' riscritta uguale a prima, con
-- 'fr' in piu'.
--
-- Dopo questo file va ripubblicata anche la funzione manda-notifiche
-- (Edge Functions → manda-notifiche → incolla il nuovo index.ts → Deploy):
-- e' lei che ha i testi degli avvisi, e ora ha anche quelli in francese.
-- L'ordine non conta: senza la funzione nuova un avviso in francese esce in
-- italiano, che e' quello che fa gia' con una lingua che non conosce.

alter table public.push_iscrizioni
  drop constraint if exists push_iscrizioni_lang_check;
alter table public.push_iscrizioni
  add constraint push_iscrizioni_lang_check check (lang in ('it', 'en', 'es', 'fr'));

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
     or coalesce(p_lang, '') not in ('it', 'en', 'es', 'fr')
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

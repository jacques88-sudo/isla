# In che ordine si lanciano i file SQL

Per rifare il database da zero: su Supabase, **SQL Editor → New query**, si incolla un file
alla volta e si preme **Run**, in quest'ordine. L'ordine viene dalla cronologia di git (il
giorno in cui ogni file è entrato nel progetto), **non dal nome**: il 13 ottobre, per esempio,
`francese` viene dopo `notifiche`, e il 18 `codici-sconto` dopo `transfer`.

**Un file nuovo in `modifiche/` si aggiunge in fondo a questo elenco.**

Non è stato provato su un progetto vuoto: se un file dà errore, leggi il suo commento in
testa, che dice cosa gli serve prima.

**Prima di cominciare**: Integrations → Cron attivato, e pubblicate le funzioni in
`functions/` (i commenti dei file dicono quando). Le chiavi e le parole segrete non stanno
qui: vanno rimesse nei Secrets di Supabase.

1. `schema.sql`
2. `modifiche/2026-09-29-reference.sql`
3. `modifiche/2026-09-30-pulizia-mensile.sql`
4. `modifiche/2026-09-30-richieste-whatsapp.sql`
5. `modifiche/2026-10-01-pulizia-foto.sql`
6. `modifiche/2026-10-02-richieste-ticket.sql`
7. `modifiche/2026-10-05-ufficio.sql`
8. `modifiche/2026-10-08-mezzi.sql` (già compreso in `schema.sql`: si può saltare)
9. `modifiche/2026-10-08-netti.sql` (già compreso in `schema.sql`: si può saltare)
10. `modifiche/2026-10-08-foglio.sql`
11. `modifiche/2026-10-08-pagamento.sql`
12. `modifiche/2026-10-09-percentuale.sql`
13. `modifiche/2026-10-09-solo-card.sql`
14. `modifiche/2026-10-13-notifiche.sql`
15. `modifiche/2026-10-13-richieste-messaggio.sql`
16. `modifiche/2026-10-13-francese.sql`
17. `modifiche/2026-10-13-tedesco.sql`
18. `modifiche/2026-10-15-link-pagamento.sql`
19. `modifiche/2026-10-16-promozioni.sql`
20. `modifiche/2026-10-16-notifiche-chiuse.sql` (ha un segnaposto per la parola segreta)
21. `modifiche/2026-10-16-tentativi-ticket.sql`
22. `modifiche/2026-10-17-netto-fisso.sql`
23. `modifiche/2026-10-18-transfer.sql`
24. `modifiche/2026-10-18-codici-sconto.sql`
25. `modifiche/2026-10-20-recensioni.sql`
26. `modifiche/2026-10-20-recensioni2-ufficio.sql`
27. `modifiche/2026-10-20-recensioni3-avviso.sql`
28. `modifiche/2026-10-20-meteo.sql`
29. `modifiche/2026-10-20-meteo-teide.sql`
30. `modifiche/2026-10-22-avvisi-ufficio.sql`
31. `modifiche/2026-10-30-audit.sql`
32. `modifiche/2026-10-31-netto-per-persone.sql`

## La copia di sicurezza dello schema

Questo elenco dice come rifare il database, non com'è oggi. Per averne la fotografia esatta,
senza dati, serve la password del database, quindi si fa dal proprio computer:

```bash
npx supabase db dump --db-url "<Connection string di Supabase, Project Settings → Database>" -f supabase/schema-oggi.sql
```

Poi si controlla che nel file non ci siano parole segrete prima di committarlo: i lavori di
Cron le portano scritte, e il repository è pubblico. Nel dubbio, il file si tiene fuori dal
repository.

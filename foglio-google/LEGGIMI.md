# Il foglio Google dei netti

Ogni ora il foglio chiede a Supabase i ticket, col **netto** già calcolato (quanto va
alla compagnia) e la **quota di Isla** (totale meno netto), e li scrive in quattro schede:

| scheda | cosa c'è |
|---|---|
| **Ticket** | una riga per ticket. Si aggiunge e si aggiorna, **non si cancella mai**: la pulizia mensile di Supabase toglie i ticket vecchi, qui restano |
| **Per giorno** | i totali giorno per giorno, dal giorno in cui il ticket è stato **inserito** |
| **Per settimana** | lo stesso, settimana per settimana (dal lunedì) |
| **Per compagnia** | settimana per settimana, quanto va a ogni compagnia |

Nei totali entrano solo i ticket **confermati**. Gli annullati sono contati a parte
(colonna "Annullati"); le richieste WhatsApp in attesa stanno in "Ticket" ma non nei
totali. Quando il netto manca (compagnia non scritta, netto non ancora dato) la cella
del netto resta **vuota** e la colonna "Nota" dice perché: nei riepiloghi è la colonna
"Senza netto". Non si inventa mai un numero.

**Attenzione:** il foglio contiene i netti e i guadagni. Chi ha il link lo vede tutto:
condividilo solo con chi deve.

---

## Installazione (una volta sola, circa 10 minuti)

Servono due cose che Claude ti dà **in chat** e che non stanno qui, perché il progetto è
pubblico: la **parola segreta** e l'SQL che la registra su Supabase.

### 1. Su Supabase

SQL Editor → New query → incolla **tutto** `supabase/modifiche/2026-10-08-foglio.sql`
→ Run. Poi, in una query nuova, l'SQL con la parola segreta che ti ha dato Claude → Run.

### 2. Il foglio

1. Su [sheets.google.com](https://sheets.google.com) crea un foglio vuoto e dagli un
   nome (per esempio "Isla — netti").
2. Menu **Estensioni → Apps Script**. Si apre una pagina con un file `Codice.gs` che
   contiene già qualche riga: **cancella tutto** e incolla il contenuto di
   `foglio-google/Codice.gs`. Premi l'icona del dischetto (Salva).
3. A sinistra, l'ingranaggio **Impostazioni del progetto** → in fondo **Proprietà dello
   script** → **Aggiungi proprietà dello script**:
   - Proprietà: `SEGRETO`
   - Valore: la parola segreta che ti ha dato Claude

   → **Salva le proprietà dello script**.
4. Torna all'editor (icona `< >` a sinistra). In alto, nel menu accanto a "Debug",
   scegli la funzione **`installa`** e premi **Esegui**.
5. Google chiede il permesso: **Rivedi autorizzazioni** → scegli il tuo account →
   se compare "Google non ha verificato questa app" premi **Avanzate** → **Vai a …
   (non sicuro)** → **Consenti**. È normale: l'app è il programma che hai appena
   incollato tu, e i permessi servono a scrivere nel foglio, a chiamare Supabase e a
   ripetersi ogni ora.
6. Torna al foglio: in pochi secondi compaiono le quattro schede.

Da qui in poi si aggiorna da solo ogni ora. Per aggiornarlo subito: Apps Script →
funzione **`aggiorna`** → Esegui.

---

## Se qualcosa non va

- **Le schede non compaiono e non c'è nessun errore**: quasi sempre è la parola
  segreta sbagliata (la porta risponde "niente", non "no"). In Apps Script, menu
  **Esecuzioni** a sinistra: c'è scritto "Nessun ticket da Supabase". Ricontrolla la
  proprietà `SEGRETO`, senza spazi prima o dopo.
- **"Supabase ha risposto 404"**: l'SQL del punto 1 non è stato lanciato.
- **Per cambiare la parola segreta**: chiedi a Claude una parola nuova e il suo SQL,
  lancialo su Supabase e cambia la proprietà `SEGRETO`. Per spegnere quella vecchia:
  `delete from public.export_keys where name = 'Foglio Google ufficio';` prima di
  inserire la nuova.
- **Non spostare né rinominare le colonne della scheda "Ticket"**, e non toccare la
  colonna "ID": è così che il programma riconosce un ticket già scritto. Colonne in
  più a destra, colori, filtri, grafici in altre schede: tutto va bene.
- Le schede "Per giorno", "Per settimana" e "Per compagnia" si **riscrivono ogni ora**:
  quello che scrivi lì dentro si perde. Per i tuoi conti usa una scheda nuova.

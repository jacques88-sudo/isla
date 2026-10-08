# Il foglio Google dei netti

Ogni ora il foglio chiede a Supabase i ticket, col **netto** già calcolato (quanto va
alla compagnia) e la **commissione** (totale meno netto) divisa fra venditore e ufficio,
e li scrive in cinque schede:

| scheda | cosa c'è |
|---|---|
| **Ticket** | una riga per ticket. Si aggiunge e si aggiorna, **non si cancella mai**: la pulizia mensile di Supabase toglie i ticket vecchi, qui restano |
| **Per giorno** | i totali giorno per giorno, dal giorno in cui il ticket è stato **inserito** |
| **Per settimana** | lo stesso, settimana per settimana (dal lunedì) |
| **Per venditore** | settimana per settimana, quanto spetta a ogni venditore |
| **Per compagnia** | settimana per settimana, quanto va a ogni compagnia |

Le colonne della scheda Ticket, nell'ordine: Inserito · Ticket · Data escursione ·
Adulti · Bambini · Totale · Pagato · Da pagare · Card · Cash · Netto · Commissione ·
Al venditore · All'ufficio, e poi stato, escursione, compagnia, venditore e il resto.
In **Card** o **Cash** c'è quanto il cliente ha già pagato, nella colonna del suo
metodo: il totale della colonna Cash è il contante da contare.

**La commissione** è il totale meno il netto, e si conta sempre sul totale. Card o
cash lo sceglie il venditore nel modulo, uno solo per ticket, e decide quanta parte va
al venditore e quanta all'ufficio. Le percentuali **non sono scritte qui** (il progetto
è pubblico): stanno su Supabase, nella tabella `commission_rates`. Se manca card/cash
o il netto, "Al venditore" e "All'ufficio" restano vuote e la Nota dice perché.

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
→ Run. Poi, una per volta: l'SQL con la parola segreta che ti ha dato Claude,
**tutto** `supabase/modifiche/2026-10-08-pagamento.sql`, e l'SQL con le percentuali
delle commissioni che ti ha dato Claude.

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
6. Torna al foglio: in pochi secondi compaiono le cinque schede.

Da qui in poi si aggiorna da solo ogni ora. Per aggiornarlo subito, nel foglio: menu
**Isla → Aggiorna adesso** (compare qualche secondo dopo che il foglio si apre).

---

## Quando cambia il programma

Se Claude manda una versione nuova di `Codice.gs`: Apps Script → cancella tutto →
incolla → dischetto → funzione **`installa`** → Esegui. La parola segreta resta dov'è,
non va riscritta. Se le colonne sono cambiate, la scheda Ticket vecchia viene rinominata
"Ticket (vecchio …)" e ne nasce una nuova: i ticket ancora su Supabase tornano tutti.
Le tue colonne a mano restano nella vecchia: ricopiale nella nuova se servono.

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

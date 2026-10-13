# Il foglio Google dei netti

Ogni ora il foglio chiede a Supabase i ticket, col **netto** già calcolato (quanto va
alla compagnia) e la **commissione** (totale meno netto) divisa fra venditore e ufficio,
e li scrive in una scheda per settimana più quattro di riepilogo:

| scheda | cosa c'è |
|---|---|
| **Settimana 05-10-2026**, **Settimana 12-10-2026**… | una scheda per settimana (dal lunedì, la più nuova davanti), con i ticket **emessi** in quella settimana, una riga per ticket. La scheda nuova nasce da sola col primo ticket della settimana. Si aggiunge e si aggiorna, **non si cancella mai**: la pulizia mensile di Supabase toglie i ticket vecchi, qui restano |
| **Per giorno** | i totali giorno per giorno, dal giorno in cui il ticket è stato **inserito** |
| **Per settimana** | lo stesso, settimana per settimana (dal lunedì) |
| **Per venditore** | settimana per settimana, quanto spetta a ogni venditore |
| **Per compagnia** | settimana per settimana, quanto va a ogni compagnia |

Le colonne di ogni settimana sono **solo queste quindici**, nell'ordine scelto dal
proprietario: Data emissione · Ticket · Escursione · Data escursione ·
Adulti · Bambini · Totale ·
Pagato · Da pagare · Card · Cash · Netto · Al venditore · All'ufficio · Commissioni.
In **Card** o **Cash** c'è quanto il cliente ha già pagato, nella colonna del suo
metodo: il totale della colonna Cash è il contante da contare.

**Escursione** è la compagnia (o, se non c'è, il nome della scheda), i mezzi e la
variante: "Agua Safari · Doppia · 1 ora", "Andromeda · Gruppo piccolo (…)",
"Buggy Tour Tenerife · 2 posti ×2, 4 posti · Offroad, 3 ore".

Ogni giorno finisce con una riga **"Totale del giorno"**, in grassetto su fondo sabbia:
il totale **Cash**, **Al venditore**, **All'ufficio** e **Commissioni** dei ticket
confermati di quel giorno (gli annullati no). Il giorno in corso ha il suo totale da
subito, e si aggiorna a ogni ticket nuovo: il ticket entra sopra il totale. Fra un
giorno e l'altro c'è **una riga vuota**.

Le tue colonne a mano (dalla U) **si spostano insieme al loro ticket**: il programma
rilegge ogni riga intera e la riscrive al suo posto. Non scrivere però nelle righe vuote
fra un giorno e l'altro: lì si perde. Le righe dei totali e quelle vuote non contano nei
riepiloghi.

A destra ci sono cinque colonne **nascoste** (Stato, Settimana, Venditore, Compagnia,
ID): servono al programma per riconoscere i ticket e fare i riepiloghi. Non mostrarle
per toccarle, e non cancellarle. I ticket **annullati** sono **barrati in grigio** e non
entrano nei totali; le richieste WhatsApp ancora in attesa non ci sono, entrano quando
l'ufficio le conferma.

**La commissione** è il totale meno il netto, e si conta sempre sul totale. Card o
cash lo sceglie il venditore nel modulo, uno solo per ticket, e decide quanta parte va
al venditore e quanta all'ufficio. Le percentuali **non sono scritte qui** (il progetto
è pubblico): stanno su Supabase, nella tabella `commission_rates`. Se manca card/cash
o il netto, "Al venditore" e "All'ufficio" restano vuote.

Nei totali entrano solo i ticket **confermati**; gli annullati sono contati a parte
(colonna "Annullati"). Quando il netto manca (compagnia non scritta, netto non ancora
dato) la cella del netto resta **vuota**, e nei riepiloghi lo dice la colonna "Senza
netto". Lo stesso per "Al venditore" e "All'ufficio" quando manca card o cash. Non si
inventa mai un numero.

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
6. Torna al foglio: in pochi secondi compaiono le schede delle settimane e i riepiloghi.

Da qui in poi si aggiorna da solo ogni ora. Per aggiornarlo subito:
- **dal telefono** (l'app Fogli): la prima scheda, **Aggiorna**, ha una casella. La
  tocchi, in qualche secondo il foglio si aggiorna, la casella si toglie da sola e sotto
  c'è scritto "Ultimo aggiornamento: …";
- **dal computer**: anche il menu **Isla → Aggiorna adesso** (compare qualche secondo
  dopo che il foglio si apre). L'app del telefono questo menu non lo mostra.

---

## Quando cambia il programma

Se Claude manda una versione nuova di `Codice.gs`: Apps Script → cancella tutto →
incolla → dischetto → funzione **`installa`** → Esegui. La parola segreta resta dov'è,
non va riscritta. Se le colonne sono cambiate, ogni scheda di settimana viene rinominata
"… (vecchio …)" e ne nasce una nuova: i ticket ancora su Supabase tornano tutti. Le tue
colonne a mano restano nella vecchia: ricopiale nella nuova se servono. Le schede
"(vecchio …)" non entrano nei riepiloghi.

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
- **Non rinominare le schede delle settimane** e non spostare le loro colonne: dalla A
  alla O ci sono le quindici che vedi, dalla P alla T quelle nascoste (con l'"ID", che
  è come il programma riconosce un ticket già scritto). **Colonne tue** si aggiungono
  **dalla U in poi**, dopo le nascoste: lì restano. Colori, filtri, ordinare le righe,
  grafici in altre schede: tutto va bene.
- Le schede "Per giorno", "Per settimana", "Per venditore" e "Per compagnia" si
  **riscrivono ogni ora**: quello che scrivi lì dentro si perde. Per i tuoi conti usa
  una scheda nuova.

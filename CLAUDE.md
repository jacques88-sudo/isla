# Isla — regole del progetto

PWA mobile-first di escursioni a Tenerife per **Admiral Excursions**. HTML, CSS e
JavaScript scritti a mano: niente framework, niente build, niente backend. Va su GitHub
Pages così com'è.

`NOTES.md` (1900+ righe) è la memoria lunga: **il perché** di ogni scelta e ogni errore
già fatto. Qui c'è solo quello che serve sapere **prima di toccare qualcosa**.

Chi lavora al progetto sta imparando a programmare: si va **un passo alla volta**, si
spiega cosa si sta facendo, e le domande si fanno invece di indovinare.

---

## Prima di ogni consegna

```bash
node controlla.js        # controlla il catalogo, esce 1 se trova un errore
node --check <file>.js   # solo sintassi, non prende gli errori a runtime
```

Poi **alza sempre `CACHE_NAME` in `sw.js`** (`isla-v134` → `isla-v135`) se hai toccato un
`.js`, un `.css` o un `.html`. Se non lo alzi, chi ha già visitato il sito **continua a
vedere la versione vecchia**: la modifica c'è ma non la vede nessuno, e non se ne accorge
nessun test.

Poi prova nel browser vero, sempre — `node --check` non prende un `null`, una variabile
usata prima di esistere o un elemento che su quella pagina non c'è:

```bash
python3 -m http.server 8912
NODE_PATH=$(npm root -g) node prova.js   # playwright, executablePath: '/opt/pw-browsers/chromium'
```

Infine: aggiorna `NOTES.md`, committa, apri la PR, fai lo **squash-merge**, riallinea il
branch (`git checkout -B <branch> origin/main`).

---

## Admiral è un rivenditore

Non gestisce le escursioni: vende attività di altri operatori. Per questo le schede
portano il nome della barca vera (Freebird, Royal Delfin, Shogun, Peter Pan).

Le prenotazioni **non sono automatiche**: il cliente manda una *richiesta* su WhatsApp
(`+34662908073`), l'ufficio conferma entro 24 ore e il pagamento si concorda dopo.

---

## Regole sui dati — quelle che si sbagliano

**Le 24 ore di preavviso sono di Isla, non dei fornitori.** Se una pagina fornitore dice
48 ore o 72, **non si copia**. Vale sempre, anche per i dati che arrivano domani.

**I prezzi barrati sono offerte del rivenditore: sul sito va il prezzo pieno.** Lo sconto
di un altro non è nostro. Abbassare un prezzo dopo si può, alzarlo dopo che il cliente
l'ha letto è la cosa che fa arrabbiare.

**Non si copiano** dai fornitori: policy di cancellazione, "best price guarantee",
"official tickets", punteggi e numero di recensioni, testi promozionali. Le descrizioni si
**riscrivono da zero** nelle tre lingue.

**Le fasce d'età devono combaciare**: `0-2`, `3-11`, `12+`. Un buco (`0-2` e `4-11`)
lascia i bambini di 3 anni senza prezzo; una sovrapposizione (`0-3` e `3-11`) non dice
quale prezzo pagano. `controlla.js` lo verifica.

**`priceInfant: 0` vuol dire "non pagano".** Se non lo sappiamo, o se sotto una certa età
non si sale proprio, **il campo non si mette**: assente ≠ gratis.

**Il totale usa solo `priceAdult` e `priceChild`.** `price` da solo può essere il prezzo
di tutta la barca, e sommarlo a persona darebbe un numero falso.

**`swimstop` e `snorkel` sono due cose diverse.** `swimstop` è la sosta bagno; `snorkel` è
l'attrezzatura prestata, e si mette **solo** dove il fornitore lo scrive.

**Il menu delle lingue (`languages`) si mette solo dove viene segnalato**, non ovunque
appaia "multilingual guides".

**I titoli restano come li scrive Admiral**, uguali in tutte e tre le lingue. Tradotte
sono descrizione, zona e durata.

**Prima di creare una scheda nuova, controlla che non esista già.** È già successo di
duplicare una barca (Kalima Kat era il Small Group Catamaran). Confronta prezzo, durata,
porto e capienza con le schede della stessa categoria.

---

## I tre campi con più di un significato

| campo | stato | vuol dire |
|---|---|---|
| `times` | pieno | le partenze vere: il cliente sceglie fra quelle, "Da concordare" sparisce |
| `times` | `[]` | charter o noleggio: l'ora si concorda davvero |
| `times` | assente | non le sappiamo: fasce segnaposto + "Da concordare" |
| `days` | pieno | `dom lun mar mer gio ven sab` — **`mar` è martedì, `mer` è mercoledì** |
| `days` | assente | si fa tutti i giorni (sette su sette non è una limitazione da mostrare) |
| `priceInfant` | `0` | i neonati non pagano |
| `priceInfant` | assente | non lo sappiamo, oppure non si sale |

`days` e `times` valgono sia sulla scheda sia dentro una singola variante
(`options.choices[]`), e la variante vince.

---

## Struttura

| file | cosa contiene |
|---|---|
| `esplora-catalog.js` | il catalogo, e in testa il vocabolario di **tutti** i campi |
| `escursioni.js` | elenco + finestra della richiesta; le sue funzioni servono anche a `tour.js` e `lista.js` |
| `tour.js` | pagina di dettaglio, e le icone `INCLUDED_ICONS` |
| `lista.js` | la lista delle richieste (localStorage), costruita in JS perché serve a tre pagine |
| `i18n.js` | tutti i testi fissi nelle tre lingue |
| `controlla.js` | il controllo del catalogo |

**La finestra della richiesta è scritta due volte**, in `escursioni.html` e in `tour.html`.
Se ne tocchi una, tocca anche l'altra.

Il `<select>` delle varianti dentro la finestra **è codice morto**: la variante arriva
sempre dai bottoni della pagina di dettaglio. Non serve che abbia listener.

---

## Cose decise, da non riproporre

- **Il flusso "Prenota ora" con i dati finti resta**, per scelta del proprietario: è il
  segnaposto di un sistema di prenotazioni futuro.
- **Il pallino della chat resta dov'è**, anche quando passa sopra un prezzo.
- **Le fasce d'orario segnaposto restano** dove le partenze vere non le sappiamo: sono
  intervalli, il cliente li legge come una preferenza.

---

## Icone di "Cosa è incluso"

Diciannove, disegnate a mano su griglia 24×24, prendono il colore del testo. Per
aggiungerne una servono **due righe**: il disegno in `INCLUDED_ICONS` (`tour.js`) e il
testo `inc.<parola>` in `i18n.js`. Una parola senza icona **viene saltata in silenzio** —
`controlla.js` la segnala.

Le icone si guardano **tutte in fila**, mai una alla volta: da sole sembrano giuste. Un
asciugamano appeso sembrava un bicchiere e una pompa di benzina sembrava una caraffa,
scoperti solo mettendole vicino alle altre.

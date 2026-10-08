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

**Anche la cancellazione è di Isla** (6 ottobre 2026, proprietario): **fino a 24 ore
prima** il cliente può annullare gratis **oppure** spostare la data, una volta sola e se
c'è posto; **meno di 24 ore prima**, o se non si presenta, non si annulla né si sposta, e
non si rimborsa. Vale anche per charter privati e noleggi. Se annulla l'operatore
(maltempo, mare, pochi partecipanti) il cliente sceglie fra altra data e rimborso
completo; si annulla con un messaggio WhatsApp e conta l'ora del messaggio. Sta in
`faq.a5`. I giorni entro cui si rimborsa **non sono decisi**: non scriverne uno.

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
| `orari-mancanti.js` | la lista delle schede senza orari di partenza; il sito non lo carica |
| `foglio-google/` | il programma (Apps Script) del foglio Google dei netti, e come si installa; il sito non lo carica |
| `venditori.html/.js` | la pagina dei venditori: ticket di carta nel database (Supabase) |
| `supabase-config.js` | URL e chiave **pubblica** di Supabase; lo schema e le regole stanno in `supabase/` |
| `telefono.js` | prefissi e `telefonoE164()`: **uno solo** per venditori e clienti, il telefono è la chiave che li fa incontrare |
| `supabase/functions/leggi-ticket/` | la funzione sul server che fa leggere a Claude la foto del ticket e riempie il modulo dei venditori; la chiave Anthropic sta **solo** nei Secrets di Supabase |
| `supabase/functions/pulisci-foto/` | ogni notte (Cron) cancella le foto dei ticket che nessun ticket nomina più; con SQL le foto non si cancellano |
| `booking.js` | "Le mie escursioni": i ticket veri da Supabase (numero + telefono); i codici `ISLA-…` restano la pagina finta; con `?richieste=1` le richieste mandate su WhatsApp |
| `richieste.js` | le richieste della lista salvate anche su Supabase (`pending`), con la **chiave** che resta nel telefono del cliente e il **codice** che va nel messaggio; l'ufficio le conferma o annulla da `venditori.html` |

**La finestra della richiesta è scritta due volte**, in `escursioni.html` e in `tour.html`.
Se ne tocchi una, tocca anche l'altra.

Il `<select>` delle varianti dentro la finestra **è codice morto**: la variante arriva
sempre dai bottoni della pagina di dettaglio. Non serve che abbia listener.

---

## Cose decise, da non riproporre

- **I codici finti (`ISLA-4521`, `TEN-7788`) restano**, per scelta del proprietario: sono
  il segnaposto di un sistema di prenotazioni futuro. Il pulsante in alto che li apriva
  si chiamava "Prenota ora"; dal 30 settembre 2026 si chiama **"Il mio ticket"**, perché
  apre la finestra dei ticket veri (numero + telefono). Prenotare si fa dalle schede.
  Dal 3 ottobre 2026 si chiama **"Le mie prenotazioni"** (My bookings / Mis reservas,
  chiave `nav.myBookings`): "ticket" il cliente poteva non capirlo. Sta nella capsula
  in alto (icona del biglietto col sole, lo stesso sole del carrello) **e** come prima voce del Menu.
  Il biglietto porta un **numerino sabbia** (`prenotazioniProssime()` in `richieste.js`):
  quante escursioni il cliente ha davanti, da oggi in poi, in attesa o confermate, dalle
  richieste WhatsApp e dall'ultimo ticket cercato, senza contarne nessuna due volte.
- **La striscia in alto è una capsula scura** ("isola galleggiante", 3 ottobre 2026):
  Home · Esperienze · carrello · prenotazioni · Menu, a icone, e la scritta solo sulla voce della
  pagina in cui si è. **Il carrello è la lista delle richieste**, non un acquisto: apre
  la stessa finestra della lista e porta il numerino. Sta **in alto**, al posto delle
  vecchie pillole, per scelta del proprietario: in basso c'erano già il pallino della
  chat e la barra "Prenota ora". È scritta uguale nelle sei pagine. **"Installa l'app"
  non ci sta**: con cinque voci la capsula usciva dallo schermo, resta nel Menu.
- **Le lingue si scelgono con le bandiere** (3 ottobre 2026, proprietario), non con
  IT/EN/ES. Sono **SVG scritti nell'HTML**, non emoji: Windows le emoji delle bandiere
  non le ha e scriverebbe le due lettere. Il nome della lingua sta in `aria-label`.
- **Il pallino della chat resta dov'è**, anche quando passa sopra un prezzo.
- **Le fasce d'orario segnaposto restano** dove le partenze vere non le sappiamo: sono
  intervalli, il cliente li legge come una preferenza.
- **Sulle escursioni nuove non si chiedono pick-up e orari.** Prima si mettono tutte le
  schede, poi il proprietario aggiunge punto di raccolta e orari **una alla volta**, con
  calma. Una scheda senza orari suoi non è incompleta: mostra il punto senza l'ora, o
  niente, e va benissimo così.
- **Il campo "Il tuo nome" nella richiesta resta**, per scelta del proprietario. Era stata
  proposta la sua rimozione — il messaggio parte dal WhatsApp del cliente, quindi l'ufficio
  vede già chi scrive e da che numero — ed è stata respinta. Non si ripropone.
- **La tastiera dell'iPhone sul fondo della finestra si lascia com'è**, per scelta del
  proprietario. Misurato: col campo del nome a fuoco il pulsante finisce dietro la
  tastiera e la casella la scavalca di 6 px sull'iPhone SE. Il rimedio esiste (alzare la
  finestra leggendo `visualViewport`) ed è stato **scartato**: tocca quanto è alta e dove
  sta la finestra, quindi un errore lì si vedrebbe su tutte le schede. Non si ripropone.
- **I prezzi scritti sui ticket di carta non si confrontano col catalogo**, per scelta del
  proprietario (30 settembre 2026). Il venditore per strada può fare un prezzo diverso da
  quello della scheda: è normale, non è un errore. Il ticket non cambia la scheda, e la
  differenza non si segnala.
- **Zona e durata nell'elenco stanno dietro il bottone "Filtri"** (5 ottobre 2026,
  proprietario), non sempre in vista. I gruppi stanno in `ZONE_FILTRO` e `DURATE_FILTRO`;
  ogni scheda nuova dice i suoi in `zoneGroups` e `durationGroups`. **Los Gigantes è una
  zona a sé**, per scelta del proprietario.
- **Il calendario della data è scritto a mano, e non si torna a `<input type="date">`.**
  Il campo nativo non sa spegnere i giorni in cui l'escursione non parte: accetta solo un
  minimo e un massimo. Prima delle pastiglie "Domani / Sab 19", provate e bocciate.

---

## Il pick-up

Il **punto di raccolta dipende dall'hotel**, l'**ora dipende dall'escursione**.
Sono tabelle separate in `hotel.js`, e vale la pena non confonderle: il punto si
scrive una volta e vale per tutte le escursioni, gli orari vanno messi per ognuna.

| tabella | cosa c'è | quando cambia |
|---|---|---|
| `PICKUP_POINTS` | 66 punti: nome e tipo | quasi mai |
| `HOTELS` | 433 hotel, ognuno col suo punto — **nessuno senza il nome della fermata**, salvo i punti porta a porta | quando apre un hotel nuovo |
| `PUNTI_PORTA_A_PORTA` | 4 punti (13, 41, 48, 53) dove il pulmino passa davanti a ogni hotel del gruppo | solo se l'ufficio lo conferma |
| `PICKUP_TIMES[scheda][punto]` | gli orari, escursione per escursione | quando il fornitore li cambia |
| `PICKUP_IN_HOTEL` | le schede che passano **sotto l'hotel** | quando si aggiunge un fornitore che fa così |
| `PICKUP_NESSUNO` | le schede senza ritiro: il cliente ci arriva da solo | quando una scheda cambia fornitore |

**"Il punto dipende solo dall'hotel" vale dentro un fornitore, non fra fornitori.**
`PICKUP_POINTS` e `HOTELS` vengono da Island Excursions, ed è lì che è stato verificato.
Canaventura, sulle camminate, il pulmino lo porta sotto l'albergo: quelle schede stanno
in `PICKUP_IN_HOTEL` e per loro le due tabelle non valgono. **Prima di mettere una scheda
nuova di un fornitore nuovo, chiedi dove passa a prendere il cliente** — è la domanda che
non ci si ricorda di fare, perché la risposta sembra già scritta.

Sbagliarla fa danno in tutte e due le direzioni: chi legge una fermata che non esiste esce
di casa per niente, chi legge "in hotel" quando il punto è altrove resta davanti alla
reception a guardare l'ora.

**Le fermate di `PICKUP_POINTS` valgono solo per le sei schede di Island Excursions**, quelle
che stanno in `PICKUP_TIMES`. Per tutte le altre il proprietario ha deciso il 24 settembre
2026: se la scheda **permette il transfer** il pulmino arriva **all'hotel** (`PICKUP_IN_HOTEL`),
compreso o a pagamento che sia; se **non lo permette** non c'è nessun ritiro
(`PICKUP_NESSUNO`) e la richiesta non chiede nemmeno dove alloggi, perché la domanda
serve solo a dire dove si sale. **Ogni scheda pubblicata sta in uno dei tre gruppi**: se ne
aggiungi una senza metterla da nessuna parte, mostrerà la fermata di un altro fornitore.

**Il nome del posto non si traduce, il tipo sì.** "Best Tenerife" è un nome proprio e
resta uguale in tutte e tre le lingue, come i titoli delle escursioni: chi lo deve
chiedere per strada lo chiede così. A tradursi è il tipo (`pickup.bus`, `pickup.taxi`…).

**Una scheda che non sta in `PICKUP_TIMES` mostra il punto senza l'ora**, e il menu
"A che ora" resta quello normale con le fasce. Dove invece gli orari ci sono, il menu
sparisce e al suo posto c'è l'ora dell'hotel scelto: non è più una domanda, è una
risposta. Un'ora inventata è la cosa peggiore che questo campo possa fare — un cliente
alla fermata all'ora sbagliata.

Gli orari di una scheda nuova si prendono in novanta secondi: si apre la pagina
di quell'escursione sul sito del fornitore e si incolla `dati-fornitore/raccogli-orari.js`
nella console del browser. I dati grezzi e la storia di come sono stati raccolti
stanno in `dati-fornitore/`.

### In `HOTELS` sta solo chi ha una fermata con un nome

**Se non sappiamo dire dove si sale, l'hotel non sta in elenco.** Deciso dal
proprietario il 24 settembre 2026, in due passaggi: prima i 36 che avevano l'ora ma
non il nome della fermata, poi i 110 che non avevano né l'una né l'altro. Da 562 a
416. Gli elenchi nominativi stanno in `NOTES.md`.

Il 5 ottobre 2026 il proprietario ha chiuso la questione, e oggi sono **433**:
- **i 146 non tornano dalla tendina di Puerto de la Cruz**: sul sito del fornitore i
  punti del nord non hanno nessun nome da copiare. Quelli del nord sono fuori per
  sempre, anche i 19 che avevano un orario;
- **The Harbour Club e Punta del Rey sono rientrati**: avevano l'ora e un punto tutto
  loro, che nessun altro hotel condivide. Il punto ha preso il nome dell'hotel senza
  tipo, come Altamira, così la pagina scrive "il tuo hotel" **e tiene l'ora**;
- **15 hotel del sud** con l'ora ma un punto condiviso (punti 41, 53, 13, 48: Regency
  Country Club, Florida, Chayofa, Maravilla…) sono rientrati come "il tuo hotel":
  il proprietario ha confermato che sono vicinissimi e il pulmino passa **porta a
  porta**, a volte a un minuto l'uno dall'altro, e solo da chi ha prenotato. Stanno
  in `PUNTI_PORTA_A_PORTA`, e tengono l'ora del loro punto.

Si può fare senza perdere nessuno perché **il campo "dove alloggi" è una casella di
testo, non un menu chiuso**: chi non trova il suo alloggio lo scrive a mano e arriva
lo stesso nel messaggio, come già facevano quelli con un appartamento privato.
Quella libertà non si toglie.

Restano quindi tre casi:

| il fornitore risponde | vuol dire | la richiesta mostra |
|---|---|---|
| `id_punto: 0` | si sale **in hotel**, confermato dal proprietario | "il tuo hotel", senza ora |
| un punto di `PUNTI_PORTA_A_PORTA` | gruppo di hotel vicini, il pulmino passa da ognuno | "il tuo hotel" e l'ora |
| un punto che sta in `PICKUP_POINTS` | la fermata, la sbarra, il posteggio taxi | il nome del posto e l'ora |

**Un hotel nuovo con un punto che non sta in `PICKUP_POINTS` né in
`PUNTI_PORTA_A_PORTA` non si aggiunge**: un codice senza nome di regola non è l'hotel, è una fermata di cui non sappiamo l'indirizzo, e
undici alberghi diversi possono condividerlo. Scrivere "il tuo hotel" lì lascerebbe
il cliente davanti alla reception mentre il pulmino aspetta due strade più in là.

`dati-fornitore/hotel.tsv` non è stato toccato e ha ancora tutte e 567 le righe.

**Prima di togliere una riga, guarda cosa fa in pagina.** Altamira stava per uscire
perché nei dati è l'unico hotel con la fermata e senza nessun orario; nel browser
però scrive "il tuo hotel" come i 29 col punto `0`, perché la sua fermata si chiama
come lui e non ha un tipo. La tabella e il comportamento non dicono la stessa cosa.

---

## I nomi delle compagnie sul ticket (`nomi`)

Sul ticket di carta i venditori scrivono spesso **il nome della compagnia** ("COOL
SAILING"), non il titolo della scheda. Il campo `nomi` della scheda li elenca:

```js
nomi: ["King Buggy", "Ultimate Buggies", "Ultimate Buggy"],
```

`catalogoPerLettura()` in `venditori.js` li attacca al titolo che va a Claude ("… (sul
ticket anche: …)"), e Claude dalla foto risale alla scheda: **la funzione `leggi-ticket`
non va ridistribuita** quando si aggiunge un nome. Il cliente non li vede, non si
traducono. Il **tipo** (barca, quad, moto d'acqua) non si scrive: lo dice la `category`
della scheda, perché **una compagnia fa una cosa sola** (proprietario, 30 settembre
2026). Più compagnie sulla stessa scheda vanno bene (i buggy); lo stesso nome su due
schede no, e `controlla.js` dà errore. Quando il proprietario manda il nome di una
compagnia: trova la scheda, aggiungi il nome, e se non è chiaro quale sia **chiedi**.

## I netti delle compagnie — MAI nel repository

Il **netto** è quanto Isla paga alla compagnia (barca da 100 €, netto 40: 40 alla
compagnia, 60 a Isla). Il proprietario li manda in chat, scheda per scheda: netto
adulto, netto bambino e, per moto d'acqua, buggy, quad e privati, il netto **a mezzo**.

**Il repository è pubblico e il sito è su GitHub Pages**: un netto scritto in un file
(catalogo, commento, `NOTES.md`, un `.sql` in `supabase/`) lo legge chiunque, clienti e
compagnie compresi. I netti stanno **solo su Supabase**: si prepara l'SQL nella
scratchpad, il proprietario lo incolla nel SQL Editor, e il file non si committa.

Deciso l'8 ottobre 2026, a passi:
1. **fatto** — i mezzi sul ticket: colonna `units` di `bookings` (`{"singola": 2}`, chiavi
   di `units.types` del catalogo), caselle nel modulo e in "Modifica";
2. **fatto** — tabella `nets` su Supabase (`supabase/modifiche/2026-10-08-netti.sql`,
   nasce **vuota**): un netto dice scheda, variante **e compagnia**, perché lo stesso giro
   può essere di compagnie diverse (Teide by Night: la serata italiana del gruppo piccolo
   è di Andromeda, le altre no). Il ticket ha la colonna `company`, con un menu fatto dei
   `nomi` della scheda. Un ticket senza compagnia, o di una compagnia senza netto,
   **resta senza netto**: mai uno preso a caso. I valori si inseriscono con
   `insert … on conflict … do update` preparato nella scratchpad;
3. ~~promemoria nel modulo dei venditori~~ — **scartato** dal proprietario (8 ottobre):
   "non serve, non è importante". Non si ripropone;
4. **fatto** — il netto si **fissa sul ticket** (`net_amount`, `net_note`, guardiano
   `fissa_netto` in `supabase/modifiche/2026-10-08-foglio.sql`): un netto cambiato in
   `nets` non riscrive i ticket già salvati; si ricalcola solo se cambiano scheda,
   variante, compagnia, persone o mezzi;
5. **fatto** — il riepilogo **non sta su Isla**: un foglio Google (`foglio-google/`) che
   **ogni ora** legge `foglio_ticket()` con una parola segreta, aggiunge e aggiorna i
   ticket e **non ne cancella mai**: la pulizia mensile toglie i ticket vecchi, il foglio
   è l'archivio. Riepiloghi per giorno, settimana e compagnia, contati da quando il
   ticket è inserito; nei totali solo i confermati, gli annullati a parte. La parola
   segreta, come i netti, non sta nel repository.

**Le commissioni** (proprietario, 8 ottobre 2026): commissione = **totale − netto**,
sempre sul totale anche se il cliente paga il resto dopo. Si divide fra venditore e
ufficio secondo **card o cash**, uno solo per ticket, scelto dal venditore nel modulo
(`payment_method`, obbligatorio sul ticket nuovo; sul ticket di carta non c'è). **Le
percentuali non vanno nel repository**, come i netti: stanno in `commission_rates` su
Supabase (`supabase/modifiche/2026-10-08-pagamento.sql`, nasce vuota). Nel foglio: Card €
e Cash € sono **quanto ha già pagato** il cliente, nella colonna del suo metodo.

**Il netto non lo legge nessuna pagina, nemmeno i venditori**: `nets` è chiusa, e su
`bookings` i venditori hanno il permesso **colonna per colonna**, tutte tranne
`net_amount` e `net_note`. Quindi: **una colonna nuova in `bookings` va data anche ai
venditori** (`grant select (nome) on public.bookings to authenticated`), altrimenti la
pagina dei venditori non la legge. E nel sito mai `select("*")` su `bookings`.

## Gli orari ancora da mettere

Il proprietario manda gli orari **una scheda alla volta**, quando li ha. Per sapere quali
mancano, adesso:

```bash
node orari-mancanti.js
```

Rifà la lista dal catalogo a ogni lancio (non scriverla a mano: invecchia). Quando
arrivano gli orari:

- sono **partenze**, e vanno in `times` (sulla scheda o sulla variante giusta);
- se due compagnie fanno lo stesso giro, sulla variante vanno **le ore di tutte e due**
  e il cliente sceglie l'ora, **non la compagnia**: chi lo porta lo decide l'ufficio
  (buggy, 5 ottobre 2026). Su un giro che fa una compagnia sola, solo le sue ore;
- i parchi (Loro Parque, Siam Park, Aqualand…) sono biglietti d'ingresso: chiedi se un
  orario serve davvero prima di metterlo.

Dopo, prova la finestra della richiesta nel browser: il menu "A che ora" deve mostrare
esattamente quelle ore, e "Da concordare" deve sparire.

---

## Icone di "Cosa è incluso"

Ventuno, disegnate a mano su griglia 24×24, prendono il colore del testo. Per
aggiungerne una servono **due righe**: il disegno in `INCLUDED_ICONS` (`tour.js`) e il
testo `inc.<parola>` in `i18n.js`. Una parola senza icona **viene saltata in silenzio** —
`controlla.js` la segnala.

Le icone si guardano **tutte in fila**, mai una alla volta: da sole sembrano giuste. Un
asciugamano appeso sembrava un bicchiere e una pompa di benzina sembrava una caraffa,
scoperti solo mettendole vicino alle altre.

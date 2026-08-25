# Isla — appunti di progetto

Riepilogo per riprendere il lavoro (anche da un altro dispositivo o in una nuova sessione).

## Cos'è Isla

PWA mobile-first per turisti a Tenerife. Funzione centrale: l'utente inserisce il codice
della prenotazione (ticket number / booking code) e vede subito orario, punto d'incontro,
durata, cosa portare e note del proprio tour — senza cercare tra email, PDF e screenshot.

## Obiettivo del progetto

PWA per **escursioni, tour e show a Tenerife**, dove il cliente può vedere le attività,
**prenotare** e **comprare** online, poi usare il biglietto tramite **scan ticket** al punto
d'incontro. In un secondo momento anche la scelta del **pickup** per alcune escursioni.

## Roadmap

La lista completa e aggiornata di cosa manca è su Notion:
**Isla — Roadmap PWA escursioni Tenerife**
<https://app.notion.com/p/3c30f3d8ea1881e4820afc5e5893cade>

Organizzata in 10 fasi in ordine di dipendenza (0 rifiniture → 9 apertura al pubblico).

## Scelta tecnica

**Oggi:** HTML, CSS e JavaScript puri. Niente framework, niente build tool, niente backend:
sito statico pubblicato su GitHub Pages.

**Limite noto:** questo stack basta per *mostrare* informazioni, ma non può gestire
prenotazioni e pagamenti veri, perché servono un database, il calcolo dei posti disponibili
e chiavi segrete che non possono stare nel browser.

**Direzione presa (fase 2 della roadmap):** restare su HTML/CSS/JS — niente riscrittura in
React — e aggiungere Supabase (database, login, codice lato server) più Stripe Checkout per i
pagamenti. La libreria JS di Supabase funziona anche da HTML normale, quindi il salto di
complessità resta gestibile.

Resta valida la scelta di **non** replicare l'intero stack di isla-adventures (React +
TypeScript + Vite + Tailwind). Di quel progetto prendiamo lo stile visivo e la struttura dei
contenuti, non il codice.

## Stile

Ispirato a due riferimenti:
- **isla-adventures** (repo GitHub dell'utente): palette calda oklch (nero caldo come colore
  primario, accento sabbia/oro usato con parsimonia), font Cormorant Garamond (titoli) + Jost
  (corpo, peso leggero 300), card quasi squadrate (radius 6px) contro pulsanti/input a pillola.
- **Anantara** (sito di hotel di lusso): fotografia a piena pagina, etichette maiuscole molto
  spaziate, molto spazio bianco, colore d'accento unico e sobrio.

Tutti i colori sono definiti come variabili CSS in `styles.css`, sotto `:root`. Il tema
scuro è stato rimosso su richiesta: il sito resta sempre chiaro.

## Struttura dei file

- `index.html` — home
- `booking.html` + `booking.js` — schermata dettagli prenotazione (cerca per codice)
- `styles.css` — tutto lo stile, un solo file
- `app.js` — logica condivisa (splash, banner fisso, service worker, finestra ricerca
  ticket, video hero, pulsante installa app)
- `escursioni.html` + `escursioni.js` — catalogo "Tutte le escursioni" con filtri,
  ricerca e finestra "Richiedi disponibilità" che apre WhatsApp
- `tour.html` + `tour.js` — pagina di dettaglio di una singola escursione,
  indirizzo `tour.html?id=<id della voce nel catalogo>`. Riusa da `escursioni.js`
  il prezzo, il nome della categoria e la finestra della richiesta
- `esplora-catalog.js` — dati delle 45 attività, divise nelle 8 categorie
- `assistente.js` — assistente guidato: tre domande (interesse, bambini, budget), poi
  consigli dal catalogo e un riquadro per chiedere su WhatsApp quello che non c'è
- `i18n.js` — tutte le traduzioni it/en/es e il selettore della lingua
- `manifest.json`, `sw.js`, `offline.html` — parte PWA (installabilità, cache offline)
- `assets/` — foto e video veri (logo, hero video, foto categorie, cala segreta, team)

## Fatto finora

Home: splash con anello blu di caricamento → banner fisso in cima (logo, wordmark, pillole
Esperienze / Prenota ora / Menu, si restringe scorrendo) → video hero con play/pausa →
"Inizia la tua avventura con…" → griglia bento (Pacchetti, Scan ticket, Con bambini,
3/5/7 Days, più un riquadro largo "Noleggio auto, moto e bici" che apre WhatsApp) →
"come funziona" → categorie (7 foto vere) → posti segreti → chi siamo →
FAQ → richiamo finale → footer. Layout ottimizzato anche per desktop.

Il menu "More" si apre da destra. La ricerca del ticket vive in una finestra che si apre
dai vari punti d'accesso, non più fissa in home.

`booking.html` mostra i dettagli di una prenotazione cercata per codice, con dati di
esempio (`MOCK_BOOKINGS` in `booking.js`) e stato di errore per codici non trovati.

Online su GitHub Pages: <https://jacques88-sudo.github.io/isla/>

## Da fare

La lista completa è su Notion (link in cima a questo file). In sintesi, i punti che
toccano il codice già scritto:

- `MOCK_BOOKINGS` in `booking.js` sono 2 prenotazioni finte scritte a mano → da sostituire
  con dati veri dal database
- **Tutte e sei le categorie di Admiral sono state riversate nel catalogo.** Su 56
  attività, **45 sono prodotti Admiral e hanno tutte un prezzo**. Le 11 rimaste vengono
  ancora dai tre siti concorrenti guardati all'inizio e restano come "Su richiesta":
  Paisaje Lunar, canyoning, immersioni, flyboard, tour completo dell'isola,
  Icod/Garachico/Orotava, Puerto de la Cruz, Gran Canaria, cantine vinicole, e le due
  voci di "Tour privati"
- Categoria "Parchi e spettacoli": sostituita per intero, 10 prodotti tutti con prezzo.
  E l'unica finora dove ogni voce dei concorrenti aveva un corrispondente Admiral,
  quindi non restano orfani
- La categoria `island-tours` di Admiral copre **due** categorie di Isla: i due tour del
  Teide sono finiti in "Teide e natura", La Gomera e Santa Cruz in "Tour dell'isola".
  Admiral ne ha in vetrina 4 dove i concorrenti ne avevano 13: restano 7 voci senza
  corrispondenza (tour completo dell'isola, Icod/Garachico/Orotava, Puerto de la Cruz,
  Gran Canaria, cantine vinicole, Paisaje Lunar, canyoning), tenute come "Su richiesta"
- Categoria "Sport acquatici": i 7 prodotti Admiral hanno tutti il prezzo, solo la Fiat
  500 ha la foto. Restano immersioni e flyboard, che sul sito Admiral non ci sono: si
  tengono lo stesso, come "Su richiesta" (vedi "Come funziona il lavoro di Admiral")
- Categoria "Avventura e motori": 9 voci, tutte Admiral. I 7 prodotti quad e buggy hanno
  la foto. Il 2-Hour e il 3-Hour Buggy Tour sono stati uniti in una scheda sola
  ("2 or 3-Hour Buggy Tour") su richiesta dell'ufficio: erano identici a parte durata e
  prezzo
- La categoria Admiral `Sky & Stars` e' stata divisa: elicottero e parapendio restano in
  "Avventura e motori" perche' e' li' che un cliente li cerca, le due serate di
  osservazione stanno in "Stelle e astronomia"
- "Tour privati" ha ora 4 voci: i due tour privati del Teide (confermati dall'ufficio) piu'
  le 2 vecchie dei concorrenti. `charter-privato` resta di fatto un doppione del
  `Private Charter` che sta fra le barche: da decidere se toglierlo
- La "Mustang Experience" è un giro in Ford Mustang decappottabile, non un buggy: si è
  capito dalla foto mandata dall'ufficio
- **Deciso:** nel frattempo le voci dei concorrenti restano visibili (`published: true`),
  non si nascondono. Ognuna sparisce quando arriva la categoria vera che la sostituisce
- Il campo `family` (adatta ai bambini) va rivisto su tutto il catalogo: rimandato a piu'
  avanti su decisione dell'ufficio
- Delle 13 barche Admiral: tutte hanno la foto, 5 hanno la zona di partenza (Puerto Colón,
  confermato), 7 hanno la durata. Il campo `family` (adatta ai bambini) è una valutazione
  da confermare in ufficio
- `Cat-mare.jpg` è usata sia dalla card categoria "Mare e barche" in home sia dalla scheda
  del 3-Hour Whale & Dolphin Boat Trip: scelta voluta, non è una svista

### Prezzi cercati in rete (24 agosto) — leggere prima di aggiungerne altri

L'ufficio ha detto che **i prezzi pubblici sono anche i nostri**. Ne sono stati messi
quattro, quelli con un operatore unico e un listino esposto:

| Scheda | Adulto | Bambino | Fonte |
| --- | --- | --- | --- |
| Trenino turistico | 9 | 5 | prezzo esposto a bordo |
| Submarine Safari | 61 | 37 | sito di prenotazione dell'operatore |
| Karting | 20 | 15 | listino del circuito, tanda da 10 minuti |
| Tuk tuk | 24 | — | prezzo a persona di un tour |

**Gli altri 22 non sono stati messi, e non e' pigrizia.** Due motivi:

1. **Gli aggregatori non concordano fra loro.** Nella stessa sessione due ricerche hanno
   dato Twin Ticket a 78 euro e a 58, Aqualand a 37 e a 25, Loro Parque a 44 e a 40.
   Alcuni siti espongono un **acconto** e non il prezzo pieno: era gia' successo con
   Canary2Go (Siam Park a 20 contro i 48 di Admiral). Un prezzo sbagliato davanti a un
   cliente e' peggio di "Su richiesta"
2. **I siti ufficiali degli operatori sono bloccati** dal proxy di rete, come
   admiral-excursions.com: si vedono solo i riassunti delle ricerche, non il listino

**Perche' i prezzi trovati in rete ballano cosi' tanto** (spiegato dall'ufficio, e va
ricordato la prossima volta): molti rivenditori espongono il **prezzo bambino** e ci
scrivono davanti "a partire da". Il Twin Ticket a 58 euro che avevo trovato non era un
altro prezzo: era il prezzo bambino (57) presentato come prezzo di partenza. Quindi un
numero molto piu' basso degli altri, di solito, e' un prezzo bambino o un acconto — non
un'offerta

**Attenzione:** una ricerca dava il Siam Park a 44 euro adulti mentre in catalogo c'e' 48
(preso dal sito Admiral). **I prezzi gia' presenti non sono stati toccati.** Se i 44 sono
quelli giusti lo dice l'ufficio

Per le attivita' generiche (lezione di surf, immersioni, canyoning, cavallo, trekking,
tour dell'isola, tour privati) **un prezzo pubblico unico non esiste**: cambia da
operatore a operatore, e siamo noi a scegliere da chi comprare

### Le varianti da scegliere (24 agosto)

Campo `options`: le varianti della stessa attivita' fra cui il cliente sceglie — 1 o 2 ore
per la moto d'acqua, quale percorso per il tuk tuk. Prima erano scritte solo dentro la
descrizione, quindi il cliente le leggeva ma non poteva dire quale voleva.

- Sulla **pagina di dettaglio** diventano **bottoni da premere**, sopra il pulsante della
  richiesta. Erano nate come righe della tabella, ma l'ufficio ha chiesto meno passaggi:
  cosi' la scelta si fa qui e la richiesta parte gia' completa. La prima e' selezionata di
  partenza, quindi non si puo' mandare una richiesta senza variante
- **La riga "Prezzo" segue la variante scelta.** Senza, uno sceglieva le 2 ore e continuava
  a leggere "da €150" appena sopra
- Nella **finestra della richiesta** il menu a tendina resta, ma **solo quando la scelta non
  e' gia' stata fatta sulla pagina** — cioe' quando la richiesta parte da una scheda del
  catalogo, dove quei bottoni non ci sono. Il collegamento fra le due pagine e'
  `sceltaDallaPagina()` in escursioni.js, che cerca il bottone premuto
- La scelta finisce nel messaggio WhatsApp subito sotto il nome dell'attivita': e' la prima
  cosa che serve per rispondere col prezzo giusto
- Il menu **si ricostruisce a ogni apertura**, come la spunta del transfer: la finestra e'
  una sola per tutte le attivita' e le voci di quella aperta prima resterebbero li'
- `price` nella singola variante si puo' omettere: il tuk tuk ha i tre percorsi ma il
  prezzo per percorso non lo sappiamo ancora, quindi le voci mostrano solo il nome

**Un dettaglio che sembra un dettaglio e non lo e':** quando le varianti *sono* le durate,
il campo `duration` ripete la stessa cosa in forma riassunta ("1 o 2 ore") e la pagina
diceva "Durata" due volte di fila. Sulla pagina di dettaglio la riassunta ora si salta;
sulla scheda del catalogo resta, perche' li' la pillola serve ancora.

### I tre spettacoli (24 agosto)

Ricerca mirata dopo che l'ufficio ha spiegato come leggere i "a partire da".

- **History – The Evolution of Music**: da 49 euro a persona, piu' venditori d'accordo.
  2 ore e 30, alla Piramide de Arona. **La sede e' da confermare**: una fonte dava
  l'indirizzo dell'azienda a Costa Adeje, ma lo spettacolo si fa alla Piramide
- **¡Olé! Flamenco Show**: da 35 euro, 1 ora e 30, il giovedi' al GF Victoria di Costa
  Adeje. I bambini dai 3 ai 12 pagano meno ma **la cifra non si trova**; sotto i 3 anni
  non si entra
- **Scandal Dinner Show**: **prezzo non messo**, le fonti dicono 89, 109, 220 e 280 euro
  e non e' chiaro se siano a persona o a tavolo. Il sito ufficiale e' bloccato dal proxy.
  Confermato invece il **limite di 16 anni**, scritto nella descrizione

Tutti e tre i prezzi sono "da": sono spettacoli con posti di categorie diverse, quindi il
numero e' la categoria piu' economica, non l'unica.

### Il transfer cambia il prezzo (24 agosto)

Il Twin Ticket col transfer costa **99 euro adulti, 74 bambini e 17 per i neonati**, dove
i 17 sono **solo il posto sul pullman**: senza transfer il neonato non paga niente e la
voce non esiste. Dati dell'ufficio.

Il campo si chiama `transferPrice: { adult, child, baby }` e compare come **una riga sola**
in fondo alla pagina di dettaglio, non tre: la tabella diventerebbe un listino. Ce l'ha
solo il Twin Ticket.

Senza transfer il Twin Ticket e' **78 adulti e 57 bambini** (confermato dall'ufficio).

**Da chiedere ancora:** se anche Loro Parque da solo ha un prezzo col transfer, e i prezzi
bambino degli altri parchi (Siam Park, Aqualand, Jungle Park, Monkey Park), che in
catalogo hanno solo l'adulto.

### Tuk tuk e trenino (24 agosto)

Aggiunte su richiesta dell'ufficio, in "Tour dell'isola" e non in "Avventura e motori":
sono giri turistici tranquilli, non adrenalina come quad e buggy. Entrambe `family: true`.

- **Tuk tuk** — tuk tuk elettrici guidati sulla costa di Adeje (Plaza del Duque, Fañabé,
  La Enramada, La Caleta, Torviscas). Esistono versioni di durata diversa, per questo la
  durata resta da definire
- **Trenino turistico** — trenino su gomma fra Costa Adeje e Los Cristianos, hop-on
  hop-off con 6 fermate, biglietto valido tutta la giornata, partenze ogni 30 minuti
  dalle 10:20 alle 20:50
- **Prezzo lasciato "Su richiesta" apposta.** Il prezzo pubblico del trenino, pagato a
  bordo, e' 9 euro adulti e 5 bambini, ma **non e' detto che sia il prezzo di Admiral**:
  noi siamo rivenditori. Lo mette l'ufficio
- Da non confondere col **trenino gratuito del Loro Parque**, che fa la spola col centro
  di Puerto de la Cruz: e' un altro servizio, non si vende

### La scheda porta alla pagina, non alla richiesta (24 agosto)

Il pulsante sulla scheda del catalogo apriva **direttamente** la finestra della richiesta,
saltando la pagina di dettaglio. Adesso che quella pagina ha itinerario, cosa e' incluso e
consigli, era uno spreco: il cliente chiedeva disponibilita' avendo letto tre righe.

Ora il pulsante dice **"Scopri di piu'"** e porta alla pagina. "Richiedi disponibilita'"
sta solo li', in fondo, dopo che c'e' tutto da leggere.

**Conseguenze da tenere a mente:**

- Nessun pulsante apre piu' la richiesta dal catalogo. La finestra in `escursioni.html`
  resta nel file ma **non si apre piu' da li'**: e' un div nascosto, non da' fastidio, ma
  prima o poi si puo' togliere
- Il **menu a tendina delle varianti** dentro la finestra serviva proprio alle richieste
  che partivano dalla scheda. Ora quel percorso non esiste, quindi il menu non compare
  mai: le varianti si scelgono coi bottoni sulla pagina. Anche questo e' codice che si
  puo' togliere, ma non fa danni
- **Attenzione a `href`:** era definito *dopo* il pulsante che lo usa. `node --check`
  passa lo stesso perche' e' un errore di esecuzione, non di sintassi. Riordinato

### La sosta bagno su tutte le barche (24 agosto)

L'ufficio: la sosta bagno c'e' su tutte le barche anche quando non e' scritta nella
descrizione, ed e' **bagno e snorkeling**, non solo bagno. Etichetta cambiata di
conseguenza.

Aggiunta a **11 barche su 15**. Le quattro fuori, e perche':

- `submarine-safari` — e' un sottomarino, non si nuota
- `pesca-altura` — uscita di pesca, non e' quel tipo di giornata
- `self-drive-boats` e `small-catamaran-rental` — sono **noleggi senza skipper**: ti fermi
  dove vuoi, ma non e' una sosta inclusa nel programma

Da confermare se qualcuna di queste quattro invece ce l'ha.

**Una descrizione andava corretta:** il glass bottom boat diceva "si guarda sott'acqua
restando a bordo", che con la sosta bagno si contraddiceva. Riscritta nelle tre lingue.

**Sul 3-Hour Whale & Dolphin** ora compaiono sia "Attrezzatura da snorkeling" sia "Bagno e
snorkeling": sono due cose diverse (l'attrezzatura fornita e la sosta), ma se all'ufficio
sembra ripetitivo si toglie la prima.

### I due campi mancanti, fatti (24 agosto)

L'ufficio ha detto di costruirli subito invece di continuare a riempire schede. Giusto:
erano nati tutti e due da contenuti veri che non entravano da nessuna parte.

**`itinerary`** — le tappe in ordine, con l'orario dove c'e'. Sulla pagina diventa un
elenco con la linea del tempo e un pallino per tappa. `time` si puo' omettere: le tappe
senza orario fisso (l'ingresso all'acquario, la visita a Vegueta) restano allineate col
resto senza inventare orari.

**`notes`** — i consigli pratici, uno per riga. Qui e' **testo libero** e non parole
chiave come `included`: "arriva 15 minuti prima" e "porta il costume" cambiano troppo per
stare in un vocabolario chiuso. L'ufficio le ha volute "sotto forma di consiglio", quindi
il titolo e' "Consigli" e non "Informazioni".

**L'ordine sulla pagina** e' pensato come le domande di un cliente: quanto costa (In
breve), cosa si fa (Come si svolge), cosa ricevo (Cosa e' incluso), cosa devo sapere
(Consigli).

Riempite subito le due schede che avevano i dati: Poema del Mar prende l'itinerario
completo delle sette tappe piu' i consigli, il Luxury Catamaran prende i consigli — e
"porta asciugamano e costume", che stava infilata in fondo alla descrizione, **e' uscita
dal testo** e ora sta al posto suo.

### Luxury Catamaran, e cosa non entra nei campi (24 agosto)

Prezzi, fasce d'eta', descrizione e riquadro. Due parole nuove nel vocabolario:
**`fingerfood`** (perche' "Snack" sminuiva un prodotto di fascia alta) e **`swimstop`**,
la sosta bagno, che tornera' su parecchie uscite in barca.

**Tre cose mandate dall'ufficio non hanno un campo dove stare:**

1. **"Arrivare 15 minuti prima della partenza"** — non messa da nessuna parte
2. **"Portare asciugamano, costume e protezione solare"** — infilata in fondo alla
   descrizione, che regge ma non e' il posto suo
3. **"Ideale per coppie e piccoli gruppi"** — lasciata fuori: e' pubblicita', non
   informazione

Le prime due sono **informazioni pratiche**, e non sono un caso isolato: le stesse cose
torneranno su surf, immersioni, kayak, quad. Servirebbe un campo tipo `notes`, reso come
un elenco breve sotto il riquadro. Da decidere con l'ufficio.

**A questo punto sono due i campi in attesa**, tutti e due nati da contenuti veri che non
entravano: `itinerary` (dall'itinerario di Poema del Mar) e `notes`. Conviene farli
entrambi **prima** che arrivino le altre 60 descrizioni, non dopo.

### Come dividersi il lavoro fra descrizione e riquadro

Regola emersa mettendo `included` su Poema del Mar: **la descrizione dice cosa si fa, il
riquadro dice cosa si riceve.** La descrizione finiva con "Transfer dal sud, traghetto e
ingressi inclusi", cioe' esattamente quello che dicono le icone: tagliata. Ora dice solo
il giro (acquario, Vegueta, Arehucas) e il resto lo dice il riquadro.

Da tenere presente quando arrivano le altre descrizioni dall'ufficio: la parte "include:"
non va copiata nel testo, va tradotta in parole chiave.

### Fasce d'eta' e "Cosa e' incluso" (24 agosto)

Due campi nuovi, chiesti dall'ufficio guardando il sito di una scuola di surf.

**`ages: { adult, child, infant }`** — le fasce si scrivono **come le scrive il fornitore**
(`"12+"`, `"3-11"`), non si calcolano. Finiscono fra parentesi accanto al prezzo:
"Adulti (12+)". Senza il campo resta solo "Adulti".

**`included: ["snorkel", "snack", "drinks"]`** — parole chiave, non testo libero. L'icona e
la traduzione nelle tre lingue le mette il sito, cosi' due schede che includono la stessa
cosa la scrivono uguale. Diventa un riquadro sotto "In breve", icona sopra e parola sotto,
due colonne sul telefono e tre da 480px.

Le tredici parole disponibili: `snorkel wetsuit board equipment drinks snack lunch tasting
guide transfer ferry ticket photos`. Per aggiungerne una servono **due righe**: l'icona in
`INCLUDED_ICONS` dentro `tour.js` e il testo `inc.<parola>` in `i18n.js`. Una parola
sconosciuta viene **saltata**, non disegna un buco.

**Le icone hanno richiesto tre giri.** Disegnate a mano su griglia 24x24, prendono il
colore del testo. Quelle rifatte e perche':

- **snorkel** — la prima sembrava il simbolo di Marte, la seconda una borsa. Ora lente,
  cinghia e tubo. Resta la piu' difficile da leggere a 30px, ma ha l'etichetta sotto
- **snack** — prima una tazza fumante (sembrava caffe'), poi un biscotto coi puntini
  (sembrava una faccina). Ora un panino
- **drinks** — era un bicchiere da cocktail: su una barca per famiglie meglio un bicchiere
  normale
- **equipment** — era una chiave inglese e sembrava "riparazioni". Ora uno zaino

**Come si controllano:** in `tour.js` c'e' `INCLUDED_ICONS`; per vederle tutte insieme
basta riempire il riquadro con `Object.keys(INCLUDED_ICONS)` da console e fare uno
screenshot. Guardarle una alla volta non basta: e' guardandole in fila che si vede quale
non si capisce.

### Prima descrizione e prezzi veri: il giro in barca a vela (24 agosto)

L'ufficio ha mandato testo e prezzi di un'uscita in barca a vela. **Assegnata a
`whale-dolphin-3h`** perche' tre dati coincidono esattamente: Puerto Colon, 3 ore e 55
euro. Le altre candidate no — `small-group-catamaran` e' 60 euro e non ha ne' zona ne'
durata, `catamaran-3h` e' 45.

Messi `priceAdult: 55` e `priceChild: 30`. Descrizione riscritta nelle tre lingue coi
dati veri: massimo 11 persone a bordo, snorkeling con attrezzatura inclusa, snack e
bevande.

**Due cose emerse, sistemate subito, che valgono per tutte le schede da qui in avanti:**

1. **Campo nuovo `priceInfant`.** Qui **0 vuol dire davvero gratis**, al contrario di
   `priceAdult` e `priceChild` dove 0 vuol dire "non ancora deciso" e nasconde la riga.
   Per dire "non lo sappiamo" si **omette il campo**. La riga esce come "Fino a 2 anni:
   Gratis". Prima quell'informazione era finita dentro la descrizione, che era un ripiego
2. **Via il prezzo ripetuto.** "Prezzo: da €55" e "Adulti: €55" dicevano la stessa cosa.
   Ora la riga generica **si salta quando `priceAdult` coincide con `priceFrom`**, cioe'
   quando non aggiunge niente. Torna da sola se i due numeri non coincidono, o se il
   prezzo adulto non c'e' ancora: verificato su tutte e sette le forme di prezzo del
   catalogo (adulto+bambino+neonato, con transfer, a scaglioni, solo "da", "su richiesta")

### Le foto sono finite (24 agosto)

**62 attivita' visibili, 62 con la foto. Tutte e sette le categorie complete.**

Con l'acquario di Poema del Mar si chiude il lavoro sulle immagini, cominciato quando le
schede con foto erano 21 su 69.

**Quello che l'ufficio aveva messo in coda dietro le foto, e che adesso torna in cima:**

1. Le **descrizioni** delle escursioni
2. Un campo **`itinerary`** — da costruire *prima* di riempire le descrizioni, altrimenti
   itinerari come quello di Poema del Mar (orari, tappe, cosa e' incluso) finiscono
   compressi in due righe e poi c'e' da rifare
3. Il **listino prezzi**: restano schede a "Su richiesta"
4. **Quad e buggy**: dove va ognuno dei sette, costa o Teide
5. I **due Teide + Masca**: stesso giro o prodotti diversi?
6. **Dividere "Parchi e spettacoli"** in "Parchi" e "Serate e spettacoli"

**Tre foto restano da sostituire**, non da aggiungere:

- `teide-national-park`, `teide-masca`, `la-gomera` — 300x300, sgranate sul PC
- `flyboard` — marchio "Water Sports Tenerife" in basso a destra
- `About-team.jpg` — 5 MB, e l'ufficio la vuole cambiare

E `Hero-poster.mp4` da comprimere: 3.7 MB, e' la prima cosa che il telefono scarica.

### Via la categoria "Tour privati" (24 agosto)

Decisione dell'ufficio: **la categoria e i tre tour privati spariscono**, e il charter in
barca **resta solo come opzione** sulle escursioni dove e' gia' collegato.

Nascoste (`published: false`, non cancellate): `tour-privato-su-misura`,
`teide-privato-giorno`, `teide-privato-notte` e `charter-privato`, che era il doppione
segnalato da tempo.

**Il Private Charter resta**, dove e' sempre stato: in "Mare e barche", con i suoi
prezzi a scaglioni. E' lui il bersaglio del campo `privateOption` su tre uscite in barca —
verificato che il rimando "vuoi la barca solo per il tuo gruppo?" funzioni ancora.

**Due cose sparite da sole, senza toccarle:**

- La **pillola del filtro** "Tour privati": `escursioni.js` costruisce le pillole solo
  dalle categorie che hanno almeno un'attivita' pubblicata
- Il **riquadro in home** invece **e' stato tolto a mano**: le card categoria sono scritte
  in `index.html`, non generate dal catalogo. Da ricordare, e' la stessa trappola di quando
  mancava "Tour e visite"

La voce `tour-privati` resta dentro `CATEGORIES`: non da' fastidio a nessuno e serve se un
giorno quelle attivita' tornano.

**Il catalogo ora e' 62 attivita' visibili, 61 con la foto.** Sei categorie su sette
complete. **L'unica scheda senza foto e' Poema del Mar.**

### Poema del Mar passa ai parchi (24 agosto)

Spostata da "Tour e visite" a "Parchi e spettacoli", **quinta in lista, subito sotto il
Twin Ticket**, su decisione dell'ufficio. Ha senso: la scheda ora si chiama come
l'acquario, e chi guarda i parchi la trova.

**Effetto collaterale buono: "Tour e visite" e' diventata completa**, 8 schede su 8 con la
foto. Sesta categoria chiusa.

**Nota tecnica sullo spostamento.** Muovere una scheda vuol dire tagliarla e reincollarla
altrove: la funzione che trova i confini del blocco deve partire **dall'inizio della riga**,
non dalla graffa, altrimenti gli spazi di indentazione restano indietro e il file esce
storto (il primo tentativo l'ha fatto: `node --check` passava lo stesso, ma
l'indentazione era rotta in tre punti). Il controllo che serve e' ordinare le righe del
file prima e dopo e confrontarle: devono essere le stesse, solo in ordine diverso.

### Gran Canaria diventa "Poema del Mar" (24 agosto)

L'ufficio ha mandato l'itinerario vero e il nome nuovo. Titolo, descrizione nelle tre
lingue e zona aggiornati. **L'id resta `gran-canaria`**, come sempre.

**Itinerario completo, da mettere sulla pagina quando ci sara' il campo apposta:**

- Partenza nave Fred Olsen Santa Cruz – Agaete, 10:00
- Arrivo ad Agaete, 11:30
- Ingresso a Poema del Mar (pranzo non incluso)
- Visita al quartiere di Vegueta
- Visita guidata alle Destilerias Arehucas, degustazione inclusa
- Partenza da Arucas verso Agaete, 17:00
- Nave Agaete – Santa Cruz, 18:00

**Incluso:** transfer andata e ritorno al Muelle de Santa Cruz dal sud, biglietti della
nave, ingressi a Poema del Mar, visita guidata alle Arehucas con degustazione di rum e
liquori, guida ufficiale.

**Serve un campo `itinerary`.** Oggi tutto questo sta compresso in due righe di
descrizione, e per una gita di una giornata l'itinerario e' quello che vende. Quando
arrivano le descrizioni delle altre escursioni conviene costruirlo: una lista di tappe
sulla pagina di dettaglio, piu' un elenco "cosa e' incluso".

**Attenzione a `zone`:** la riga sul dettaglio si chiama gia' "Punto di partenza", quindi
scrivere "Partenza da Santa Cruz" nel valore faceva "Punto di partenza: Partenza da Santa
Cruz". Il valore va scritto secco: "Santa Cruz".

### Tour completo, La Palma e cantine (24 agosto)

Catalogo a **61 foto su 67**, "Tour e visite" a 8 su 10.

- La foto del **tour completo** e' in realta' **Puerto de la Cruz vista dall'alto**, col
  Lago Martianez in primo piano e il Teide dietro. Assegnata li' dall'ufficio, e funziona:
  citta' e Teide nella stessa inquadratura sono esattamente "tutta l'isola in un giorno"
- **`puerto-de-la-cruz` e' stata nascosta** (`published: false`) subito dopo, su decisione
  dell'ufficio. Non serviva piu' una scheda a se': il posto si vede nella foto del tour
  completo. Nascosta e non cancellata, come le altre tre — le descrizioni nelle tre lingue
  restano nel file. Il catalogo scende a **66 attivita' visibili**, "Tour e visite" a 9
- Le quadrate si ritagliano bene al centro: verificato prima di agganciare, la fascia 16:10
  tiene Teide, costa e citta'
- `cantine-vinicole` e' 500x375 e `island-tour-completo` 800x800: piccole. Sulla scheda
  vanno bene, sul dettaglio a schermo largo si ingrandiscono. Stessa lista di quelle da
  rifare se arrivano gli originali

### Pulizia (24 agosto)

- Tolto `assets/tenerife-video.mp4` (3.9 MB): **non era citato da nessuna parte**. Il video
  della home e' `Hero-poster.mp4`, che resta. Verificato riga per riga prima di toglierlo
- `assets/` scende da 24 a 20 MB
- **Attenzione:** togliere un file dal progetto non lo toglie dalla storia di git, quindi
  chi scarica il repository per intero se lo porta comunque dietro. Sul sito pubblicato
  invece non c'e' piu'. Ripulire anche la storia si puo' fare, ma riscrive tutti i commit:
  non ne vale la pena per 4 MB
- Cancellate anche le foto caricate in chat (22 MB) e i file di lavoro dei test (86 MB):
  stavano fuori dal progetto, gli originali sono sul telefono dell'ufficio e le versioni
  ridotte in `assets/`

**Restano i due file pesanti veri:** `About-team.jpg` (5.0 MB, da sostituire) e
`Hero-poster.mp4` (3.7 MB, da comprimere a 1-1.5 MB). Insieme fanno il 44% di `assets/`.

### Trenino e tuk tuk (24 agosto)

Le due foto mancanti dei giri corti a Costa Adeje. Catalogo a **58 foto su 67**,
"Tour e visite" a 5 su 10.

- Il tuk tuk porta stampati sulla carrozzeria il **sito e il telefono dell'operatore**
  (SweetTourTenerife.com). Non e' un marchio aggiunto alla foto, e' la livrea del mezzo.
  Controllato dove finisce: sulla **scheda** e' illeggibile a 255px, e sulla **pagina di
  dettaglio** il ritaglio taglia via tutto il fianco destro dove sta la scritta. Resta
  visibile solo "COSTA ADEJE" e "100% ELECTRIC", che anzi aiutano
- Il **trenino e' 426x357**, piccolo: sulla scheda va bene, sul dettaglio a schermo largo
  viene ingrandito del 35%. Meno grave dei 300x300 di Teide/Masca/La Gomera, ma nella
  stessa lista di quelle da rifare se arriva l'originale

### Ordine di lavoro deciso dall'ufficio (24 agosto)

**Prima si finiscono le foto, poi tutto il resto.** Le domande aperte sui tour e le
divisioni di categoria restano in sospeso apposta, non sono state dimenticate:

1. I **due Teide + Masca** (`teide-masca` da 60 euro e `icod-garachico-orotava` a giornata
   intera): stesso giro o prodotti diversi? Se diversi, le descrizioni devono dire cosa
   cambia
2. **`charter-privato`** in "Tour privati" e' un doppione del Private Charter fra le
   barche. Togliendolo, "Mare e barche" si chiude senza bisogno di foto
3. **Dividere "Parchi e spettacoli"** in "Parchi" (8) e "Serate e spettacoli" (5): due
   momenti d'acquisto diversi, e oggi lo Scandal vietato ai 16 sta accanto al Monkey Park
4. **Quad e buggy**: dove va ognuno dei sette, costa o Teide. Restano tutti in "Avventura",
   la differenza andra' nel campo `zone` o nei bottoni di scelta
5. Le **descrizioni** delle escursioni, che l'ufficio manda piu' avanti
6. Il **listino prezzi**: 20 schede ancora "Su richiesta"

**Foto che mancano: 11.** Sette in "Tour e visite" (tour completo, Puerto de la Cruz, Gran
Canaria, La Palma, cantine, tuk tuk, trenino) e quattro in "Tour privati" (charter, su
misura, Teide di giorno, Teide di notte).

Piu' tre da **sostituire**: Teide/Masca/La Gomera (300x300, sgranate sul PC), il flyboard
(marchio "Water Sports Tenerife") e `About-team.jpg`.

### Icod/Garachico rinominato (24 agosto)

"Icod, Garachico & La Orotava" e' diventato **"Teide, Icod, Garachico e Masca"**: cambia
il giro, non solo il nome — La Orotava esce, Teide e Masca entrano. Riscritta anche la
descrizione nelle tre lingue, che parlava dei balconi de La Orotava.

**L'id resta `icod-garachico-orotava`**, come si e' fatto per le categorie: i nomi che si
vedono e i codici interni sono cose separate, e cosi' nessun link si rompe. Il nome del
file della foto segue l'id, non il titolo. Da tenere a mente leggendo il catalogo: quell'id
adesso nomina un posto dove il tour non passa piu'.

**Sovrapposizione da chiarire con l'ufficio:** ora ci sono **due schede che fanno Teide e
Masca** — questa (giornata intera, prezzo da definire) e `teide-masca` da 60 euro, che sta
in "Teide e natura". Se sono due prodotti diversi va bene, ma andrebbe scritto nelle
descrizioni cosa cambia; se sono lo stesso, una delle due va tolta.

### La foto della bici, e una scartata (24 agosto)

`trekking-bici` ha la foto: **"Teide e natura" e' completa**, 3 schede su 3. Quinta
categoria chiusa.

**La prima foto mandata e' stata scartata.** Portava scritto in basso a sinistra
"photo: cyclingholidaystenerife.com - all right reserved": non un logo di fornitore come
quello sul flyboard, ma una **rivendicazione esplicita di diritti di un'altra azienda che
vende tour in bici a Tenerife**, cioe' un concorrente su quel prodotto. Isla e' un sito
commerciale: pubblicarla senza accordo puo' tornare indietro come richiesta di rimozione.
Ritagliare via la scritta sarebbe stato peggio, non meglio. L'ufficio ne ha mandata
un'altra, pulita.

**Regola per le prossime:** guardare gli angoli prima di agganciare. Un logo di fornitore
si puo' discutere, un "all rights reserved" di un concorrente no.

### Tre schede nascoste (24 agosto)

`paisaje-lunar`, `canyoning` e `pico-teide` messe a `published: false` su richiesta
dell'ufficio: "eliminarle **per il momento**".

**Nascoste, non cancellate.** Il campo `published` esiste apposta, e le descrizioni nelle
tre lingue restano nel file: quando quelle attivita' tornano si riaccendono cambiando una
parola, senza riscrivere niente. Cancellarle avrebbe buttato via lavoro da rifare.

Il catalogo scende da 70 a **67 attivita' visibili**, e "Teide e natura" da 6 a 3 (restano
Teide National Park, Teide + Masca e Trekking e bici).

Verificato che spariscano da tutte le parti: catalogo, conteggio in cima, filtro di
categoria, ricerca, e la pagina di dettaglio risponde "escursione non trovata" invece di
mostrarle lo stesso.

### L'ottava card in home (24 agosto)

"Tour e visite" non compariva fra le categorie in home. **Non era per la foto mancante:**
le card sono scritte a mano in `index.html` e per quella categoria il `<li>` non c'era
proprio. Aggiunto, piu' l'immagine nel campo `image` di CATEGORIES, che serve all'i18n e
all'assistente.

**La foto e' `santa-cruz-taganana.jpg`**, l'Auditorio col Parque Maritimo. E' anche la
foto della scheda Santa Cruz, ma quella vive nel catalogo e non in questa griglia, quindi
non si scontrano — come gia' succede con `Cat-mare.jpg` e `Cat-parchi.jpg`.

Prima si era provato con `Cat-teide.jpg`: la **stessa foto compariva due volte nella
stessa griglia** e si vedeva. Quel file per giunta non e' un paesaggio del Teide, e' un
buggy al tramonto con due sagome, che per "Tour e visite" non dice niente.

Quando arriva quella vera: **1200x800**, orizzontale. La card la ritaglia a **16:9**,
quindi mangia circa il 12% sopra e sotto — soggetto centrato. E in basso c'e' una
sfumatura scura con la scritta bianca allineata a sinistra: la meta' inferiore sinistra
va tenuta libera.

### Tre categorie rinominate (24 agosto)

Cambiati **solo i nomi che si vedono**, non gli id: `stelle`, `avventura-motori` e
`tour-isola` restano quelli, quindi indirizzi tipo `escursioni.html?cat=tour-isola` e i
filtri continuano a funzionare. Verificato.

| Prima | Adesso | Perche' |
| --- | --- | --- |
| Stelle e astronomia | **Sotto le stelle** | Diceva la stessa cosa due volte, e "astronomia" suonava da museo |
| Avventura e motori | **Avventura** | Dentro c'e' una passeggiata a cavallo, che non e' un motore |
| Tour dell'isola | **Tour e visite** | Dentro ci sono La Gomera, Gran Canaria e La Palma, che non sono quest'isola |

**Restano da sistemare** (proposte fatte all'ufficio, non ancora decise):

- **"Parchi e spettacoli" sono due cose diverse:** 8 parchi (giornata coi bambini) e 5
  spettacoli (serata, spesso da adulti — lo Scandal e' vietato ai minori di 16). Oggi la
  scheda dello Scandal sta nella stessa griglia del Monkey Park. Andrebbero divise in
  "Parchi" e "Serate e spettacoli": nove categorie invece di otto, e la griglia in home
  tornerebbe piena (3 colonne x 3 righe invece dei 7 attuali che lasciano due buchi)
- `Teide + Masca` sta in "Teide e natura" ma e' un giro in pullman come Icod o Garachico:
  potrebbe stare in "Tour e visite"

### Teide, Masca, La Gomera e Santa Cruz (24 agosto)

Quattro foto, il catalogo arriva a 54 con foto su 70.

- I ritagli automatici al centro funzionano tutti e tre sui quadrati: il Teide tiene il
  cono intero col pennacchio, Masca il paese sul crinale, La Gomera i Roques dietro la
  palma. Non e' stato necessario ritagliare a mano, al contrario delle locandine
- **Le tre foto quadrate sono pero' piccole: 300x300.** Sulla scheda vanno bene (mostrate
  a 255), ma sulla **pagina di dettaglio a schermo largo vengono ingrandite del 92%**
  (300px mostrati a 577) e si vede che sono sgranate. Sul telefono l'ingrandimento e' del
  16% e non si nota. **Da rimpiazzare quando l'ufficio ha gli originali**
- Non sono state ingrandite in fase di preparazione: aggiungere pixel inventati non
  aggiunge dettaglio, fa solo pesare di piu' il file

### Le 10 foto dei parchi (24 agosto)

Assegnate una per una dall'ufficio, nell'ordine in cui le ha mandate: Siam Park (aerea),
Siam Night (Tower of Power coi laser), Loro Parque (orche), Aqualand (fiume lento),
Jungle Park (leone marino), Combo Ticket, Monkey Park (ingresso col moai), MHT (le artiste
in scena), Castillo San Miguel (giostra).

- Il **Twin Ticket riusa `Cat-parchi.jpg`**, la foto della card categoria in home, che e'
  gia' un'immagine del biglietto combinato. Il file sta in `assets/` una volta sola:
  scelta dell'ufficio, non una svista. Come `Cat-mare.jpg` col whale watching
- La foto del **Combo Ticket e' una grafica pubblicitaria dell'operatore**, non una foto,
  e porta una fascia verde **"PROMO"**. Se un giorno vendiamo quel biglietto a prezzo
  pieno, quella scritta promette uno sconto che non c'e': da tenere d'occhio
- I tre spettacoli hanno la foto dal 24 agosto: **parchi e spettacoli e' completa**,
  13 schede su 13
- Due delle tre erano **quadrate** (locandine dell'operatore) e una **verticale**. La
  cornice della scheda e' 16:10 e ritaglia al centro, quindi:
  - la locandina di **Scandal** e' stata ritagliata a mano sulla fascia in basso: il
    centro del quadrato tagliava la S rossa a meta' e sembrava un graffio. Cosi' si legge
    tutto il marchio
  - **History** va bene al centro: sono i due mezzi volti (Mozart e Michael Jackson), che
    e' l'idea stessa dello spettacolo
  - il **flamenco** era 3863x5794, verticale: ritagliato a mano intorno ai ballerini e non
    al centro geometrico, dove c'e' solo palco vuoto
- Le cornici delle schede restano **tutte uguali** (255x159 a schermo largo) qualunque sia
  la forma della foto: `.tour-media` ha `aspect-ratio: 16 / 10` e `overflow: hidden`. Una
  foto di forma strana non sfonda la griglia, viene solo ritagliata piu' o meno male

### Le 13 foto del 24 agosto

Coperte 34 schede su 69 (prima 21). I file si chiamano come l'`id` della scheda.

- I **nomi dei file caricati non arrivano** nella chat: si vede solo il contenuto
  dell'immagine. Ogni assegnazione qui sotto viene da quello che si vede nella foto
- `submarine-safari` — sottomarino giallo con la scritta "Sub Fun", che è il **Sub Fun
  Cinco**: parte da Marina Amarilla, a Tenerife. Verificato, perché un sottomarino
  giallo uguale gira anche a Lanzarote e sarebbe stata una foto sbagliata
- `pesca-altura` — un Rodman 1250 sotto le falesie di Los Gigantes. Che sia pesca e non
  whale watching si vede dalle **canne nei portacanne** a dritta, ingrandendo lo scafo
- `stargazing-group` (due telescopi, Via Lattea) e `stargazing-vip` (un telescopio solo,
  al tramonto): erano un'intuizione, **l'ufficio ha confermato che sono giuste**
  (24 agosto). Non c'è più niente da verificare qui
- `jet-car-rental` — la jet car verde. Da non confondere con `fiat-500-water-car`, che è
  un'altra attività e ha già la sua foto
- **Transfer** (deciso il 24 agosto): Loro Parque si puo' avere col trasporto incluso, e
  quindi anche il Twin Ticket — ma li' il transfer vale **solo per la giornata a Loro
  Parque**, non per quella al Siam Park. Ha senso: il Siam Park e' a Costa Adeje, dove
  alloggiano i clienti, mentre Loro Parque e' a Puerto de la Cruz, dall'altra parte
  dell'isola. Il campo si chiama `transfer` e lo hanno solo queste due voci
- Nella finestra della richiesta compare la casella "Vuoi il transfer?", solo sulle
  attivita' col campo `transfer`. La risposta finisce nel messaggio WhatsApp **sempre**,
  anche quando e' no: cosi' l'ufficio sa che la domanda e' stata fatta invece di doverla
  rifare in chat. La finestra e' una sola per tutte le attivita', quindi la spunta si
  azzera a ogni apertura
- La finestra della richiesta e' **duplicata in `escursioni.html` e `tour.html`**: quando
  si tocca una, va toccata anche l'altra. Un `diff` fra i due blocchi lo verifica
- `immersioni` (tartaruga verde e sub), `flyboard` (Costa Adeje) e `surf-lesson`
  (surfista sull'onda) aggiunte il 24 agosto: **gli sport acquatici hanno la foto tutti e
  nove**, prima categoria completa dopo le barche
- La foto del surf e' un ritaglio molto largo (784x298, quasi 3:1). Sta bene lo stesso:
  la scheda la mostra a 255x159 e il dettaglio a 348x218, quindi il taglio prende il
  centro dove c'e' il surfista. Se un giorno serve piu' grande, va rifatta
- **La foto del flyboard ha il marchio "Water Sports Tenerife" in basso a destra.** Sulla
  scheda si vede poco perché il taglio lo mangia quasi tutto, ma c'è. Da sostituire con
  una versione senza marchio: ritagliarlo via non si fa, è la firma di chi l'ha scattata
- Le due moto d'acqua da 1 e 2 ore sono state **unite in una scheda sola**
  (`jet-ski-safari-1-2h`), come si era fatto per il 2 e 3 ore del buggy: stessa
  attività, cambia solo la durata. `priceFrom` è il taglio più corto (€150) e i due
  prezzi stanno nella descrizione
- Le più deboli come qualità: `cavallo` (640x480) e `karting` (784x523). Vanno bene per
  ora, ma su schermo grande si vede che sono piccole
- `assets/fiat-500-on-water.jpg` è tornata in uso: la Fiat 500 Water Car non era una voce
  dei concorrenti da buttare, Admiral la vende davvero — sotto `watersports`, non fra le
  barche dove l'avevamo messa all'inizio
- La categoria "Tour dell'isola" non ha ancora la foto per la card in home
### Layout su PC

Un solo file che si adatta (layout responsive), non due siti separati: con 69
attivita' e 3 lingue, due pagine da tenere allineate raddoppierebbero ogni
modifica. Le soglie sono 480, 640, 768, 900, 960, 1200 e 1280 pixel.

Cose da ricordare, imparate sistemando la versione PC:
- Una regola che arriva dopo `.wrap` e ridichiara `margin` ne annulla la
  centratura. E' successo a `.bento-grid`
- In una griglia a colonne di pari altezza, lo spazio in piu' viene diviso fra
  le righe: senza `align-content: start` la colonna col testo piu' corto scende
  rispetto alle altre. E' successo ai tre passi
- Gli attributi `width`/`height` nell'HTML di un `<img>` battono `aspect-ratio`
  se il CSS non dice `height: auto`. La foto di "Chi siamo" restava alta 1100px
  su tutti gli schermi
- Le strisce che si scorrono col dito (`overflow-x: auto` con la barra
  nascosta) sul PC diventano irraggiungibili: col mouse non si scorre e la
  barra non si vede. Su schermo largo devono andare a capo. E' successo ai
  filtri per categoria

- I riquadri bento (Pacchetti, Con bambini, 3/5/7 Days) puntano a `#categories` e al
  filtro famiglia: servono pagine vere per i pacchetti
- Il riquadro "Noleggio auto, moto e bici" non è un'attività del catalogo: non ha una
  scheda, apre WhatsApp con un messaggio già scritto (`wa.rental` in `i18n.js`). Il link
  lo costruisce `initRentalLink()` in `app.js`, che si nasconde da solo se
  `WHATSAPP_NUMBER` non c'è (booking.html carica `app.js` ma non `esplora-catalog.js`).
  Se un giorno avremo dei noleggi da listare, diventerà una categoria vera
- Testo "Chi siamo" è un **placeholder onesto** (nessuna affermazione inventata) — da
  sostituire con la storia vera
- La foto `assets/About-team.jpg` **va sostituita**, non compressa: l'ufficio ne manderà
  un'altra (deciso il 24 agosto). Non ha senso perderci tempo adesso. Quando arriva la
  nuova: ridurla a ~1200px di lato lungo e qualità 82, come le foto delle escursioni.
  L'attuale pesa 5.1MB e il sito la mostra al massimo a 500x520
- Per chi sceglie la foto nuova del team: il taglio sulla pagina è **4/5**, con un tetto
  di 520px di altezza sul PC. Uno scatto orizzontale o poco verticale rende meglio; uno
  verticale da telefono viene tagliato sopra e sotto
- Video hero `assets/Hero-poster.mp4` pesa 3.7MB — da comprimere a ~1-1.5MB (720p, 6-10s,
  senza audio) con uno strumento tipo HandBrake
- Sezione recensioni volutamente omessa: quelle di isla-adventures sono inventate, non le
  abbiamo copiate

## Come funziona il lavoro di Admiral

**Admiral è un rivenditore.** Non gestisce le escursioni: vende attività già presenti
sull'isola, gestite da altri operatori. Per questo i prodotti portano il nome della barca
o del mezzo di chi le opera davvero — Freebird, Diamant, Opera 60, Monte Cristo, Shogun.

Due conseguenze pratiche, da tenere a mente prima di togliere qualcosa dal catalogo:

- **Il sito di Admiral non è l'elenco di tutto quello che possono vendere.** È quello che
  hanno messo in vetrina. Se un'attività esiste a Tenerife, in linea di massima possono
  procurarla. Su ogni pagina categoria c'è scritto *"Tell us what you want and we will
  organise it"*.
- Quindi **un'attività assente dal sito non va cancellata da Isla**: va lasciata con
  `priceFrom: null`, che il catalogo mostra come "Su richiesta". È la verità: il prezzo
  dipende dall'operatore e si concorda al momento.

Vale anche per la Fase 9 della roadmap: rivendere tour di altri operatori richiede
**accordi scritti** con loro prima di incassare soldi dai clienti.

## Attivita' aggiunte guardando la concorrenza

Quattro voci non vengono dal sito di Admiral ma da un confronto con il catalogo di
Tenerife First Excursions, un'altra agenzia dell'isola: **Submarine Safari**,
**¡Olé! Flamenco Show**, **Scandal Dinner Show** e **History – The Evolution of Music**.
Sono attivita' di operatori locali che qualunque agenzia puo' rivendere, e l'ufficio ha
confermato che Admiral le procura. Stanno a "Su richiesta" finche' non arriva un prezzo.

Le descrizioni sono scritte da zero, non copiate. Idem per le foto: nessuna presa da loro.

Scartato dallo stesso confronto: i beach club (Monkey Beach Club, Kaluna), che Admiral
non vende.

Un secondo confronto, col catalogo di **Canary2Go**, ha aggiunto altre nove voci
confermate dall'ufficio: i due **tour privati del Teide** (giorno e notte), **lezione di
surf**, **pesca d'altura**, **karting**, **passeggiata a cavallo**, **trekking e bici**,
**salita al Pico del Teide** e **La Palma**. Scartati kitesurf, wing foil, Forestal Park,
Piramidi di Güímar e Palmetum.

**Attenzione ai prezzi di Canary2Go: non sono comparabili.** Elencano Siam Park a 20 euro
e Loro Parque a 20 dove Admiral sta a 48 e 44, l'elicottero a 11 dove Admiral sta a 98:
sono acconti, non prezzi pieni. Non ne e' stato copiato nessuno.

I titoli di queste nove sono scritti nelle tre lingue, non lasciati in inglese come i
prodotti Admiral: qui un nome ufficiale Admiral ancora non c'e'. Quando arrivera', vanno
allineati alla regola degli altri.

## Attivita' stagionali

Il campo `season` in `esplora-catalog.js` segna le attivita' che si fanno solo in certi
mesi. Oggi ce l'ha solo **Siam Night** (solo luglio e agosto, confermato dall'ufficio).

Quando c'e', compare in tre punti: etichetta color sabbia sulla scheda del catalogo, riga
"Periodo" sulla pagina di dettaglio, e **avviso dentro la finestra della richiesta, sopra
il calendario** — cioe' prima che il cliente scelga una data in cui l'attivita' non si fa.

## Da dove vengono i dati del catalogo

Il sito di Admiral **non è raggiungibile** da queste sessioni: la rete blocca
`admiral-excursions.com`. Gli elenchi vanno quindi incollati a mano nella chat, una
categoria alla volta, prendendoli da `admiral-excursions.com/product-category/<nome>/`.

Regola sui nomi: i **titoli restano scritti come li scrive Admiral**, uguali in tutte
e tre le lingue. Così il cliente vede lo stesso nome del sito Admiral e, quando la
richiesta arriva su WhatsApp, in ufficio si trova davanti il nome esatto da cercare.
Tradotte sono solo le descrizioni, la zona e la durata.

Quando un prodotto è in offerta (prezzo barrato + prezzo scontato) si mette il
**prezzo scontato**, cioè quello che il cliente paga davvero.

## Le tre lingue

Il sito è in **italiano, inglese e spagnolo**. Il selettore è il pulsante tondo in alto a
destra nella barra (mostra la sigla della lingua attiva) e c'è anche dentro il menu
laterale, sotto "Lingua".

Come funziona:

- tutti i testi fissi stanno in `i18n.js`, uno sotto l'altro, con le tre versioni;
- nell'HTML si scrive `data-i18n="chiave"` sull'elemento e il testo viene sostituito;
- nel JavaScript si usa `t("chiave")`;
- i testi del catalogo (`esplora-catalog.js`) si scrivono come `{ it: "…", en: "…",
  es: "…" }`; se un testo è uguale in tutte le lingue (i nomi propri, tipo "Siam Park")
  basta la stringa da sola. `tf()` sceglie la versione giusta.

La lingua di partenza è quella del browser; se non è una delle tre parte in inglese.
La scelta viene ricordata nel telefono (`localStorage`) e vale su tutte le pagine.
Anche il messaggio WhatsApp della richiesta parte nella lingua scelta dal cliente.

## Note pratiche

- Il service worker (`sw.js`) ha una cache con nome tipo `isla-vN`: quando si cambia
  `styles.css`, `i18n.js` o uno qualsiasi dei file `.html` e `.js`, bisogna aumentare
  il numero (es. `isla-v10` → `isla-v11`) altrimenti i browser che hanno già visitato il
  sito continuano a vedere la versione vecchia.
- Le foto in `assets/Cat-*.jpg` sono già rinominate e pronte per la pagina categorie/escursioni.
- **Un solo colore di sfondo: `#FCFAF6`.** È il valore che rende `--bg` in `styles.css`, ed
  è ripetuto in tre posti che devono restare allineati: `background_color` e `theme_color`
  in `manifest.json`, il `<meta name="theme-color">` di ogni pagina, e lo sfondo dipinto
  dentro `icon-192.png`, `icon-512.png` e `icon-maskable-512.png`. Le icone non sono
  trasparenti apposta (da trasparenti Android disegna un bordo suo), quindi il loro sfondo
  è cotto dentro il file: se un giorno cambia `--bg`, **vanno rigenerate**, altrimenti
  all'apertura della PWA ricompare un quadrato più scuro intorno al logo.

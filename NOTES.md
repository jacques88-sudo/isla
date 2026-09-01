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

### Il pallino della chat resta dov'e' (25 agosto)

Avevo segnalato che il pallino dell'assistente, in basso a destra, **copre i prezzi**
quando la tabella "In breve" capita a quell'altezza: i valori sono allineati a destra ed
e' li' che galleggia il pallino.

**L'ufficio ha deciso di lasciarlo com'e': il pallino e' importante.** Quindi non e' un
bug da sistemare e non va "aggiustato" la prossima volta che salta all'occhio. Scorrendo
la pagina il numero riappare, e l'assistente vale il fastidio.

### "In breve" con una riga per fascia d'eta', anche sulle schede a varianti (25 agosto)

Chiesto dall'ufficio: sul Royal Delfin (e sul Freebird) la tabella deve leggersi come sul
3-Hour Whale & Dolphin, cioe' **una riga per fascia**, invece della riga sola
"Prezzo: €33 (bambini 4-11: €20)".

    Adulti (12+)      €63
    Bambini (4-11)    €40
    Neonati (0-3)     Gratis

**Il pezzo che mancava.** `detailRows()` leggeva i prezzi solo dalla scheda, e su queste
due schede i prezzi stanno **dentro le varianti**. Ora la funzione riceve la variante
scelta e prende i prezzi da li' quando ci sono. Da quel punto in poi non fa differenza da
dove vengano: le righe che escono sono le stesse.

**La tabella si ridisegna a ogni bottone premuto**, come gia' facevano la descrizione della
variante e il riquadro delle icone. I tre aggiornamenti erano tre funzioni separate, ora
sono uno solo (`aggiornaScheda`): fanno sempre la stessa cosa nello stesso momento, e
tenerli separati era solo un modo per dimenticarne uno.

**Roba tolta perche' non serve piu':** l'aggancio `data-detail-prezzo`, l'attributo
`data-option-price-child` sui bottoni e il pezzo che scriveva "(bambini 4-11: €31)"
attaccato al prezzo. Quella scritta era un ripiego di quando la tabella non sapeva
mostrare le fasce; adesso le mostra, e ripeterle sarebbe dirle due volte.

**`price` liscio sulla variante resta fuori dalle righe per fascia.** Vale la stessa
regola del totale: puo' essere il prezzo del **mezzo** e non della persona. Il jet ski
infatti continua a mostrare "Prezzo → €150" sulla riga generica, non "Adulti → €150".

**Aggiunta la fascia adulti "12+"** su tutte e due le schede. Non l'ha detta nessuno, ma
discende dalle altre: se i bambini finiscono a 11 e sopra non c'e' altra fascia, a dodici
anni si paga come un grande. Senza, la riga usciva "Adulti" liscia mentre le altre due
avevano la parentesi.

**Controllate una per una le schede che NON dovevano cambiare:** whale-dolphin-3h (il
modello), Twin Ticket (col transfer), Private Charter (scaglioni di gruppo), jet ski
(prezzo del mezzo), Self Drive Boat (prezzo a barca) e Siam Park (solo "da €48"). Tutte
identiche.

### Il giorno sbagliato non passa piu' (25 agosto)

L'ufficio: *"dovremo far selezionare solo i giorni in cui e' disponibile l'attivita'"*.
Era il buco che avevo segnalato quattro volte senza chiuderlo — Freebird, Royal Delfin,
sottomarino, Utopia — e ogni volta avevo scritto i giorni solo a parole, sperando che il
cliente li leggesse.

**Campo nuovo `days`**, con sette sigle: `dom lun mar mer gio ven sab`.

    days: ["lun", "mer", "ven"]

Vale sulla scheda e **dentro la variante**, perche' su queste barche i giorni cambiano da
una formula all'altra: sul Freebird il giro di 2 ore si fa lun/mer/ven e quello dal nord
mar/gio/ven/dom.

**Se l'attivita' si fa tutti i giorni, il campo non si scrive.** Sette su sette non e'
un'informazione, e' rumore: la riga "Giorni" non compare e non c'e' niente da controllare.

**Due cose, non una.** Il campo serve a tutte e due, e da solo nessuna delle due basterebbe:

1. **Prima**: la riga "Giorni" in "In breve", accanto a orari e lingue. Chi guarda la scheda
   sa in che giorni si fa senza aprire niente.
2. **Durante**: appena il cliente sceglie una data che non va, sotto il campo compare
   *"Questa escursione si fa solo: Lun · Mer · Ven."* E la richiesta **non parte**.

Il messaggio compare **al cambio della data**, non all'invio. Scoprirlo alla fine, con nome,
persone e note gia' compilati, e' la cosa che fa chiudere la pagina.

**Una trappola evitata:** `new Date("2026-09-12")` viene letto come UTC, e in certi fusi
orari torna indietro di un giorno — il sabato diventerebbe venerdi'. La data si legge pezzo
per pezzo e si costruisce con `new Date(anno, mese - 1, giorno)`, che e' ora locale.

**Sigle giuste, controllate a macchina.** `mar` e `mer` si somigliano abbastanza da
sbagliarsi, e una sigla sbagliata pubblicherebbe dei giorni falsi in silenzio. Passate tutte
le liste del catalogo attraverso la tabella delle sigle: nessuna ignota.

**Giorni scritti finora:** Freebird (2 ore e dal nord), Royal Delfin (2 ore e 3 ore),
sottomarino (tutti tranne sabato), Utopia (solo sabato), Shogun (lun mer gio ven dom).
**Le altre schede non hanno limitazioni conosciute** e restano senza campo: se ne salta
fuori una, si aggiunge una riga.

**Sistemata anche una cosa vicina:** la riga "Orari" leggeva solo gli orari della scheda,
quindi su Freebird e Royal Delfin — dove stanno dentro le varianti — non compariva mai.
Adesso legge prima quelli della variante, come i giorni.

### Shogun, riempita (25 agosto)

Una goletta orientale di 26 metri, tutta in teak, costruita per uno sceicco: 135 posti su
due ponti. Cinque ore, partenza alle 11:00 da Puerto Colón, pontile 14. Lunedi', mercoledi',
giovedi', venerdi' e domenica.

| partenza | adulto | bambino | neonato | ritrovo |
|---|---|---|---|---|
| Dal sud | €61 | €30 | gratis | Puerto Colón |
| Dal nord | €65 | €32 | gratis | Puerto de la Cruz |

**Qui le varianti non sono durate ne' formule ne' biglietti: sono due punti di partenza.**
Il giro e' identico, cambia solo da dove ti prende la navetta e quanto costa. Sono il quarto
tipo di variante che incontriamo (durata, formula, biglietto, partenza), e il campo `label`
lo dice ogni volta con la parola giusta: qui "Partenza".

Il `zone` dentro la variante — quello aggiunto per il Royal Delfin — serve esattamente a
questo: chi sceglie "Dal nord" legge **Puerto de la Cruz** come punto di partenza, non
Puerto Colón.

**Le fasce d'eta' sono arrivate subito dopo: bambini 3-11, neonati 0-2**, quindi adulti
12+. Le stesse del Whale & Dolphin, del Luxury Catamaran e del Small Group, che e' un
segnale che a Tenerife sono lo standard delle barche. Le due fasce si toccano, come sempre
si controlla.

**Cosa c'e' di notevole e finisce nei consigli:** i tre bagni, di cui **uno accessibile**, e
la barca attrezzata per chi ha difficolta' motorie. E' l'unica del catalogo che lo dice, ed
e' un'informazione che chi ne ha bisogno cerca prima di tutto il resto. Poi il menu del
pranzo per esteso, le zone fumatori, e il solito consiglio sull'alcol prima di salire.

**Non preso:** la politica di cancellazione (48 ore, 90% di rimborso — la nostra resta 24
ore), il "best price guaranteed" e le loro recensioni.

### Pesca d'altura, riempita (25 agosto)

Era la scheda piu' vuota che restava: "Su richiesta", zona e durata da definire, due righe
di descrizione. Adesso ha tre formule:

| formula | prezzo | come si paga |
|---|---|---|
| 4 ore, in condivisione | €85 adulto, €69 bambino | a persona |
| Charter privato fino a 7 | da €525 | a barca |
| Charter privato fino a 10 | da €700 | a barca |

Quattro ore da Puerto Colón sulla **No Limits**, partenze alle 9:00 e alle 14:00, tonni,
marlin e lampughe, traina e jigging, canne e attrezzatura a bordo.

**Lo spettatore paga €69, come i bambini**, ma non e' una fascia d'eta': e' un adulto che
non pesca. Il sito conta adulti e bambini, e non ha un terzo tipo di persona. **Sta nei
consigli**, con l'invito a scriverlo nelle note della richiesta — invece di inventare un
terzo campo per una scheda sola.

**La fascia degli adulti non e' scritta, e stavolta non si ricava.** Sulle altre schede
"bambini 4-11" implicava "adulti 12+", perche' sopra non c'era altro. Qui il fornitore dice
solo che **dagli 8 ai 10 anni** si paga €69: **sotto gli 8 non dice niente**, e non si sa se
si sale (magari solo a guardare, a €69). Scritto nei consigli: *"Per i piu' piccoli
chiedici: dipende dall'uscita."* **Da confermare in ufficio.**

**Il pesce non si porta a casa**, ed e' la prima cosa nei consigli: e' la sorpresa che
rovina la giornata a chi non lo sa.

**Panini e stuzzichini solo dai sei ore in su**, quindi non sono un'icona di "Cosa e'
incluso" — che vale per tutta la scheda — ma stanno scritti dentro la descrizione delle due
formule private, dove la condizione si puo' dire per esteso.

### I prezzi barrati sono offerte del rivenditore: sul sito va il pieno (25 agosto)

Su tre pagine di fila (Opera 60, Kalima/Small Group, Utopia) c'era un prezzo barrato con un
"Sale!". L'ufficio ha chiarito: **quelli sono i prezzi delle offerte, che ogni venditore
mette come vuole.** Non sono nostri.

**Regola, da qui in avanti: sul sito va il prezzo pieno, mai lo sconto di un altro.** Se poi
Admiral vuole fare la sua offerta, si abbassa quando lo decide l'ufficio — mentre **alzare**
un prezzo che il cliente ha gia' letto e' la cosa che fa arrabbiare.

Applicato:

- **Opera 60**, giro condiviso: €70 → **€80**. Il prezzo dei bambini resta €50, che l'aveva
  mandato l'ufficio e non era barrato.
- **Utopia**, biglietto Basic: €70 → **€75**. Solo il Basic era barrato; Standard, Premium e
  VIP non avevano nessun cartello e restano €90, €110 e €130. **Da controllare** che lo
  sconto non riguardasse anche loro.
- **Small Group Catamaran: lasciato €60**, e non e' una dimenticanza. Li' il prezzo pieno
  della pagina era €75, ma **€60 l'aveva mandato l'ufficio come listino nostro**, mesi di
  differenza a parte. €60 non e' lo sconto di un altro: e' il nostro numero, e sovrascriverlo
  con quello di un rivenditore sarebbe stato il contrario di quello che l'ufficio ha chiesto.
  **Resta da sciogliere** il nodo gia' segnalato: €60/€30 (ufficio) contro €75-€59/€39
  (pagina Kalima).

### Utopia Boat Party, riempita (25 agosto)

Aveva una riga di descrizione e un prezzo. Adesso ha i **quattro biglietti**, che non sono
durate ne' formule ma **quanto si beve**:

| biglietto | prezzo | cosa dà |
|---|---|---|
| Basic | €70 | quattro consumazioni |
| Standard | €90 | open bar per tre ore, roba locale |
| Premium | €110 | open bar con le marche, piu' Red Bull |
| VIP | €130 | tutto il Premium, piu' imbarco prioritario e area VIP |

Tre ore, il sabato alle 12:30, da Puerto Colón. Ritrovo al Black Pearl Bar, dove si beve
qualcosa prima e si torna dopo per l'after.

**`ages: { adult: "18+" }` e basta, ed e' voluto.** Sotto i 18 non si sale, quindi bambini
e neonati **non esistono**: niente `priceChild`, niente `priceInfant`. Su questa scheda quei
campi non vorrebbero dire "non lo sappiamo", vorrebbero dire "non puo' venire" — la stessa
distinzione del Submarine Safari, dove sotto i 2 anni non si imbarca.

Effetto collaterale visto in prova: se un cliente scrive comunque dei bambini nella
richiesta, **il totale sparisce** invece di dare un numero sbagliato. Va bene cosi', ma la
finestra continua a chiedere "Bambini" anche su un'attivita' per soli maggiorenni. Si
potrebbe nascondere il campo dove `family` e' false — **da valutare, non fatto**: vale per
tutte le attivita' da adulti, non solo per questa.

**Non preso:** il "5% di sconto automatico al checkout", che e' il carrello del rivenditore
e non il nostro; il prezzo barrato (€75 → €70, stessa domanda dell'Opera 60 e del Kalima);
la politica di cancellazione (7, 12 o 16 giorni a seconda del gruppo — la nostra resta 24
ore); le loro recensioni e il "best price guaranteed". Preso il consiglio sul mal di mare,
che qui e' anche piu' utile del solito visto quanto si beve.

**Una cosa da guardare:** in "Cosa e' incluso" c'e' "Bagno e snorkeling", che c'era gia'
prima. Su una festa in barca lo snorkeling suona strano, ma l'etichetta e' quella scelta
dall'ufficio per la sosta bagno e la regola era "su tutte le barche". Lasciata, da
confermare.

### Kalima Kat era il Small Group Catamaran (25 agosto)

Avevo aperto una scheda nuova, `kalima-kat`. **L'ufficio: e' la stessa barca del Small
Group Catamaran, usa quella.** Aveva ragione, e i segnali c'erano tutti: massimo 22 o 23
persone, tre ore, paella di pollo, Puerto Colón. Non li ho messi insieme.

**Lezione:** quando arriva una barca "nuova", prima si guarda se qualcuna di quelle che
abbiamo le somiglia troppo. Capienza, porto, durata e cosa si mangia bastano a
riconoscerla — nessun rivenditore usa lo stesso nome dell'altro.

`kalima-kat` e' stata tolta e `small-group-catamaran` ha preso quello che le mancava:

- la **seconda formula**, il charter privato da €800 per tre o sei ore, con l'uscita al
  tramonto
- gli **orari** del giro condiviso: 9:30 e 12:30
- la **toilette a bordo**, l'**equipaggio e l'assicurazione** compresi, e la guida fra le
  icone
- una descrizione che dice le due formule e il fatto che 22-23 persone su una barca privata
  a Tenerife sono un'eccezione

**⚠ Le due fonti non dicono gli stessi numeri, e ho tenuto i nostri:**

| | l'ufficio (prima) | la pagina Kalima |
|---|---|---|
| adulto | **€60** | €59 (in saldo da €75) |
| bambino | **€30** | €39 |
| fascia bambini | **3-11** | 2-12 |
| neonati gratis | **0-2** | 0-1 |
| capienza | **23** | 22 |
| anticipo | **15 minuti** | 30 minuti |

In grassetto quello che c'e' sulla scheda: sono i numeri che l'ufficio aveva mandato come
listino nostro, mentre gli altri vengono dalla pagina di un rivenditore con sopra un
cartello "Sale!". **Da confermare quali valgono** — bastano due righe e sistemo.

### Opera 60, riempita: due formule molto diverse (25 agosto)

Aveva `priceFrom: 80` e una riga di descrizione. Adesso ha due formule, e sono **due modi
di pagare diversi**, non due durate:

| formula | prezzo | come si paga |
|---|---|---|
| 3 ore, in condivisione | €70 adulto, €50 bambino | **a persona** |
| Charter privato | da €545 | **a barca**, fino a 12 persone |

E' il caso per cui la distinzione fra `price` e `priceAdult`/`priceChild` era stata
inventata, e qui si vede in una scheda sola: sulla formula condivisa il totale si calcola
(2 adulti + 1 bambino = €190), sul charter privato **non compare**, perche' moltiplicare
€545 per le persone darebbe €1635.

**Orari: 10:00 e 13:30. Bambini 1-11 anni €50. Bebe' 0-11 mesi gratis.**

**La fascia dei bebe' e' in mesi, e ha rotto una cosa.** `ages` finora conteneva solo
numeri ("12+", "4-11"), uguali in tutte le lingue, e il codice li scriveva cosi' com'erano.
"0-11 mesi" invece ha una parola dentro. Adesso le fasce passano da `tf()` come tutto il
resto del catalogo, quindi si possono scrivere nelle tre lingue quando serve:

    infant: { it: "0-11 mesi", en: "0-11 months", es: "0-11 meses" }

Da notare che **"0-11 mesi" e "1-11 anni" si toccano** senza buchi, che e' la regola che
ci eravamo dati col Freebird.

**Due cose viste solo guardando la pagina, non leggendo il codice:**

1. Sul charter privato compariva **"Neonati (0-11 mesi): Gratis"**. Su una barca che si
   paga intera non vuol dire niente — non paga nessuno a testa. Ora la riga dei neonati
   compare solo insieme alle altre righe a persona.
2. La durata diceva **"Da 3 a 9 ore"** anche sulla formula condivisa, che dura tre ore e
   basta. Aggiunto `duration` dentro la variante, come gia' `zone`, `times`, `included`,
   `desc` e i prezzi.

**Cosa non ho preso:** il prezzo barrato ("Sale! €80 → €70"). Il sito non ha il concetto di
sconto, e €70 e' quello che l'ufficio ha mandato. **Se €70 e' un prezzo di stagione,
segnalatelo.** Fuori anche la politica di cancellazione (48/96 ore — la nostra resta 24),
il "best price guarantee", le loro 6 recensioni.

**Una cosa che ho scritto e che nessun rivenditore scriverebbe:** *"con il mare mosso si
sente piu' che su un catamarano"*. E' un gommone veloce, ed e' vero. Un cliente che sta
male in mare deve poterlo sapere prima, non dopo.

### La finestra della richiesta non scorreva (25 agosto)

Segnalato dall'ufficio: *"in piu' schede questa pagina rimane fissa, non scorre ne' su ne'
giu'"*. Bug vero, e la causa e' una combinazione:

- `body.menu-open { overflow: hidden }` blocca la pagina sotto mentre la finestra e' aperta
  — giusto, se no si scorre il contenuto dietro
- ma `.ticket-dialog` non aveva **ne' `max-height` ne' `overflow-y`**, quindi non scorreva
  nemmeno per conto suo

Finche' la finestra era corta non si notava. Con tutti i campi aggiunti in questi giorni
(data, ora, lingua, persone, totale, varianti, transfer, note) su un telefono arriva a
**1177 px in una finestra da 528**: piu' della meta' non si raggiungeva, pulsante "Continua
su WhatsApp" compreso.

`max-height: 88dvh; overflow-y: auto` messo su **`.ticket-dialog`**, cioe' su tutte e tre
le finestre. Piu' `overscroll-behavior: contain`, cosi' arrivati in fondo il dito non
trascina la pagina dietro.

**La regola c'era gia', ma su una finestra sola.** L'avevo scritta per `.lista-dialog`
pensando "questa puo' diventare lunga", senza chiedermi se valesse anche per le altre.
Quella riga duplicata adesso e' tolta: la generale la copre.

Verificato su schermo 420x600 (telefono basso) su tre schede diverse, sulla finestra della
lista e su desktop 1280x720, dove la finestra e' centrata e resta dentro lo schermo.

### Royal Delfin: la gita dal nord parte da un altro porto (25 agosto)

Il punto di partenza era `Puerto Colón` per tutte e quattro le varianti. Chi sta nel nord
pero' a Puerto Colón non ci passa: sale sulla navetta a **Puerto de la Cruz**, e per lui il
punto di partenza e' quello.

`zone` si puo' scrivere anche **dentro la variante**, e quando c'e' vince su quello della
scheda. E' l'ultimo pezzo che mancava: adesso una variante puo' avere prezzi, orari,
lingua... no, la lingua e' della scheda; ma zona, orari, prezzi, cose incluse e descrizione
sono tutti suoi.

### Il transfer in una riga sola, e orari e lingue si vedono (25 agosto)

Due segnalazioni dell'ufficio sulla stessa scheda.

**1. La riga del transfer confondeva.** Diceva *"Solo se stai nel nord dell'isola: dal sud
la navetta e' gia' compresa nel prezzo"*, e sotto una seconda riga *"Con il transfer: €74
adulti · €45 bambini"*. Due righe che parlavano della stessa cosa con parole diverse, e
nessuna delle due diceva la cosa semplice.

Adesso e' **una riga sola**, con le parole dell'ufficio:

    Transfer   Dal sud incluso nel prezzo, dal nord €13 a adulto e €8 a bambino.

I €74 e €45 restano nel catalogo, perche' **servono al totale**: quando il cliente spunta
il transfer il conto passa da €159 a €193, che e' 159 + 13 + 13 + 8. Ma non si stampano
piu': campo nuovo `transferPriceHidden: true`, che vuol dire "quanto costa e' gia' scritto
nella riga qui sopra". Il Twin Ticket non lo usa e continua a mostrare la sua riga
"Con il transfer".

Tolto anche il consiglio che ripeteva la stessa cosa piu' in basso.

**2. "Non riesco a vedere l'opzione delle lingue ne' quello degli orari."** Non era un
guasto: **stavano solo dentro la finestra della richiesta**, che si apre col pulsante.
Chi guardava la pagina non li trovava, ed e' un'informazione che si vuole sapere *prima*
di chiedere disponibilita'.

Ora "In breve" ha due righe in piu', subito sotto la durata — dove, quando e in che lingua
stanno insieme, i prezzi vengono dopo:

    Orari    10:00 · 13:00
    Lingue   English · Español · Deutsch · Italiano · Français

**Ci vanno solo gli orari veri.** Le fasce segnaposto che la finestra usa come ripiego non
compaiono in tabella: sarebbero un orario inventato scritto sulla pagina, che e' esattamente
quello che ORARI_PREDEFINITI evita. Le due righe compaiono solo dove `times` e `languages`
ci sono davvero.

### La scelta della lingua, ma solo dove serve (25 agosto)

Chiesto dall'ufficio, con una condizione precisa: **"questa opzione non sara' in tutte le
attivita' ma solo in quelle in cui te lo segnalero'"**. Quindi non e' una domanda che
compare sempre — compare solo dove c'e' il campo `languages`.

**Come si accende una scheda.** Con le lingue solite basta:

    languages: LINGUE_TOUR,

e chi ne ha altre scrive la sua lista. `LINGUE_TOUR` sta in cima al catalogo, accanto a
ORARI_PREDEFINITI: English, Español, Deutsch, Italiano, Français. **⚠ Anche questa e' da
confermare:** sono le cinque che si sentono di piu' a Tenerife, non l'elenco vero di
un'attivita' precisa. La prima accesa e' il Submarine Safari, che sulla pagina del
fornitore ha proprio il menu della lingua.

**Le lingue si scrivono nella lingua stessa** — "Deutsch", non "Tedesco". Un tedesco
riconosce la sua riga anche mentre guarda il sito in spagnolo, ed e' come fanno tutti i
siti di prenotazione. Di conseguenza **non si traducono**: al cambio lingua del sito
cambia l'etichetta ("In che lingua" → "En qué idioma") e cambia "Indifferente", ma i nomi
delle lingue restano quelli. Verificato.

**"Indifferente" e' la voce di partenza**, come "Da concordare" per gli orari: se il
cliente non sceglie, **la riga non compare proprio** nel messaggio WhatsApp. Non compare
una riga che dice "indifferente".

La scelta viaggia dappertutto: messaggio singolo, messaggio della lista, e riga della
lista (`10/09/2026 · 10:00 · Italiano · 2 adulti e 1 bambino`).

### Submarine Safari, riempita (25 agosto)

Aveva solo i due prezzi (€61 / €37) e due righe di descrizione. Adesso ha tutto: si parte
da **Marina Amarilla** (San Miguel de Abona, zona Amarilla Golf), dura **un'ora**, si
scende **tutti i giorni tranne il sabato**, si arriva 15 minuti prima.

**Fasce d'eta': bambini 2-14, adulti 15+.** Il 15+ discende dal 2-14, come al solito.

**Sotto i 2 anni non c'e' nessuna fascia, e non e' una dimenticanza:** a bordo non si sale
proprio. Non e' "gratis", quindi **niente `priceInfant`** — quel campo vuol dire "paga
zero", non "non puo' venire". Sarebbe stato l'errore facile da fare, visto che tutte le
barche di questi giorni hanno i neonati gratis.

**La navetta dal nord usa `transfer` + `transferPrice`,** gli stessi campi del Twin Ticket.
Attenzione a cosa ci va dentro: `transferPrice` sono i prezzi **completi** con la navetta,
non il supplemento. Il fornitore dice "+€13 adulto, +€8 bambino", quindi si scrive 74 e 45,
non 13 e 8. Verificato col totale: 2 adulti + 1 bambino fanno €159 senza e €193 con.

Il testo della domanda pero' e' rovesciato rispetto al Twin Ticket: qui la navetta dal
**sud e' gia' compresa**, e la spunta serve solo a chi sta nel nord. Sta scritto sotto la
domanda: *"Solo se stai nel nord dell'isola: dal sud la navetta e' gia' compresa nel
prezzo."*

**Gli orari sono arrivati subito dopo: 10:00 e 13:00.** Prima erano le fasce segnaposto,
perche' la pagina diceva solo "multiple timeframes" senza elencarle.

**Non preso, come sempre:** "best price guarantee", "official tickets", le 8 recensioni
loro, e la politica di cancellazione (la nostra resta 24 ore). Preso solo il consiglio sul
mal di mare.

### Royal Delfin, scheda nuova (25 agosto)

Catamarano da 200 persone con le finestre panoramiche sotto la linea di galleggiamento.
Quattro varianti, come il Freebird ma con giorni, orari e prezzi suoi:

| variante | adulto | bambino | giorni | orario |
|---|---|---|---|---|
| 2 ore | €33 | €20 | mar, gio, dom | 10:30 |
| 3 ore | €50 | €30 | mer, sab | 10:30 |
| 4 ore e mezza | €63 | €40 | tutti i giorni | 14:00 (e 9:30 in certi periodi) |
| 4 ore e mezza dal nord | €68 | €45 | tutti i giorni | 14:00 |

Bambini 4-11, come sul Freebird (detto dall'ufficio).

**E' la prima scheda che usa tutto insieme quello che abbiamo costruito in due giorni:**
prezzi dentro le varianti, orari dentro le varianti, descrizione della variante, e il
riquadro delle icone che cambia. Senza, questa scheda non si poteva scrivere: **il giro
di 2 ore non ha ne' la sosta bagno ne' il pranzo**, gli altri tre ce li hanno tutti e due,
e una lista sola per tutta la scheda avrebbe mentito a qualcuno.

Nel riquadro fisso restano `guide` e `transfer`, le uniche due vere per tutte e quattro.

**La sosta bagno non c'e' sul giro di 2 ore.** Contro la regola generale dell'ufficio
("la sosta bagno e' inclusa in tutte le barche"), ma qui il fornitore la nomina
esplicitamente per il giro di 3 ore (Diego Hernández) e per quelli di 4 ore e mezza
(Masca) e **non** per quello di 2, che descrive come "quick sightings tour". Due ore
andata e ritorno sono poche per fermarsi. **Da confermare.**

**Cosa NON ho preso dalla pagina.** Vale la regola gia' scritta: politiche e pubblicita'
del rivenditore restano fuori. Quindi niente "best price guarantee", niente "official
tickets", niente politica di cancellazione (la nostra resta 24 ore, decisa dall'ufficio),
niente politica per il maltempo o per chi non si presenta. Preso solo il consiglio sul
mal di mare, che non promette niente.

**Le tre cose che mancavano, arrivate subito dopo:**

1. **La foto c'e'** (`royal-delfin.jpg`). E' proprio il Royal Delfin: sulla fiancata si
   legge il logo coi due delfini e la scritta "Visión Submarina / Submarine Vision", che
   e' la sua caratteristica. Nessuna filigrana, e nel taglio della scheda ci sta la barca
   intera coi bagnanti e il getto d'acqua.
2. **I neonati non pagano**, fascia 0-3 come sul Freebird. `priceInfant: 0`.
3. **La partenza delle 9:30** c'e' **dall'11 luglio al 5 settembre**. Ora e' scritta cosi'
   nella descrizione della variante, invece del vago "in certi periodi dell'anno".
   Resta un dubbio piccolo che non vale la pena inseguire: la pagina diceva "lunedi' e
   venerdi'" in un punto e "venerdi'" in un altro. La scheda non nomina i giorni, quindi
   non promette niente di sbagliato, e la conferma passa comunque dall'ufficio.

**L'orario delle 9:30 resta nel menu tutto l'anno.** Fuori stagione un cliente puo'
sceglierlo, ma la finestra di date sta scritta due dita sopra e la richiesta la conferma
l'ufficio. Per farlo sparire da solo servirebbe legare gli orari alla data scelta:
si puo' fare, ma per una riga sola non vale la complicazione.

### Freebird: neonati 0-2 gratis (25 agosto)

`priceInfant: 0`, che sul campo dei neonati vuol dire **davvero gratis** e non "non lo
sappiamo" (li' lo zero e' un prezzo; il campo che manca del tutto e' il "non lo sappiamo").
La riga "Neonati (0-2): Gratis" ora si vede in tutte e tre le lingue.

**Sta sulla scheda e non sulle varianti** perche' vale su tutte e quattro. I prezzi di
adulti e bambini invece restano dentro le varianti, che e' dove cambiano.

**Le fasce d'eta': neonati 0-2, bambini 4-11.** Arrivate dall'ufficio. Quella degli
adulti non e' scritta da nessuna parte e non serve: "bambini 4-11" basta a far capire che
a dodici anni si paga come un grande.

La fascia dei bambini non aveva un posto dove comparire, perche' la riga "Bambini" della
tabella si vede solo quando `priceChild` sta sulla scheda, e qui sta dentro le varianti.
Ora si attacca al prezzo della variante: **"€62 (bambini 4-11: €31)"**. E' li' che serve —
chi ha un ragazzino di dodici anni capisce quale dei due numeri lo riguarda.

**Il buco a 3 anni e' chiuso: 0-3 gratis, 4-11 meta'.** Le prime due fasce che erano
arrivate (0-2 e 4-11) lasciavano fuori i bambini di tre anni. L'ufficio ha confermato che
i tre anni non pagano, quindi la fascia dei neonati arriva a 3.

Vale la pena tenerlo a mente per le prossime schede: **quando arrivano due fasce d'eta',
si controlla che si tocchino.** Un anno scoperto in mezzo non e' un dettaglio grafico —
e' un cliente che scopre al molo di dover pagare, o noi che regaliamo un posto.

### Il riquadro delle icone cambia con la variante (25 agosto)

Domanda dell'ufficio: *"il riquadro con le icone puo' cambiare a seconda del tour
scelto?"*. Si', e serviva: e' esattamente il limite in cui ero andato a sbattere il giorno
prima col transfer del Freebird, quando l'unica risposta era stata togliere dal riquadro
tutto quello che non valeva per tutte le varianti.

**Come funziona.** Ogni variante puo' avere il suo `included`, che si **somma** a quello
della scheda invece di sostituirlo. Sulla scheda si scrive quello che vale per tutte, sulla
variante solo quello che ha in piu':

    scheda:            swimstop, drinks, guide
    2 ore:             (niente)
    3 ore:             snack, transfer
    4 ore e mezza:     lunch, transfer

Cosi' le cose comuni si scrivono una volta sola invece di ripeterle in ogni variante, e
aggiungerne una nuova non vuol dire ricopiare tutta la lista.

**Il riquadro si ridisegna a ogni bottone premuto**, come gia' facevano il prezzo e la
descrizione della variante. Chi sceglie le 2 ore vede tre icone, chi sceglie le 4 ore e
mezza ne vede cinque, e nessuno legge una promessa che la sua barca non mantiene.

**Un dettaglio da non sbagliare:** il riquadro si disegna anche quando la scheda non ha
`included` ma una variante si'. Se no al primo clic non ci sarebbe niente da riempire.
Quando la lista risultante e' vuota il riquadro si nasconde invece di restare li' vuoto.

Le schede senza varianti non cambiano di una virgola: controllate.

### Le 24 ore sono nostre, e non si toccano (25 agosto)

Deciso dall'ufficio, e vale **per sempre, anche per le informazioni che arriveranno**:
la riga "le richieste vanno fatte con almeno 24 ore di anticipo" resta a **24 ore**.

Le pagine degli operatori e dei rivenditori scrivono le loro politiche (48 ore, 72 ore,
rimborsi per maltempo): **non si copiano sul sito**. Isla prenota a mano su WhatsApp, e
questo numero lo decide l'ufficio, non il fornitore di turno.

L'avvertenza e' scritta in `i18n.js`, attaccata alla riga `req.hint`: e' li' che
qualcuno andrebbe a cambiarla dopo aver letto "free cancellation up to 48 hours" da
qualche parte.

**Confermato anche:** i giorni del giro di 2 ore del Freebird sono lun/mer/ven, come sulla
scheda. Le due fonti coincidono, il dubbio era mio.

### Freebird, secondo giro di dati: una contraddizione da correggere (25 agosto)

L'ufficio ha mandato la descrizione dell'operatore (Freebird One), non piu' quella del
rivenditore. Molto di quello che c'era e' stato confermato, ma **due cose erano
sbagliate** sulla scheda gia' pubblicata.

**1. Il transfer non e' su tutte le varianti.** Il giro di 2 ore e' *senza* navetta: al
porto ci si arriva da soli. La scheda aveva `transfer` in "Cosa e' incluso", cioe' lo
prometteva anche a chi sceglieva le 2 ore.

Tolto dal riquadro. **Nel riquadro restano solo le cose vere per tutte le varianti**
(bagno, bevande, guida); quello che cambia da variante a variante sta scritto sotto il
bottone della variante e nei consigli. La stessa ragione per cui `snack` non ci e' finito:
sul giro di 2 ore da mangiare non c'e'.

Questa e' la regola generale da tenere: `included` e' **una lista sola per tutta la
scheda**, quindi ci va solo cio' che vale per tutte le varianti. Il resto vive nelle
varianti.

**2. I giorni del giro di 2 ore.** Il rivenditore diceva lun/mer/ven/**dom**, l'operatore
dice lun/mer/ven. Ho tenuto quelli dell'operatore, che e' la fonte piu' vicina alla barca.
**Da confermare in ufficio**, perche' e' l'unico punto in cui le due fonti si smentiscono.

**Cose nuove aggiunte:** le bevande sono **illimitate** e c'e' anche la sangria; da
mangiare sono panini, **anche vegetariani se lo si chiede prenotando**; si sale al **molo
10** di Puerto Colón arrivando **10 minuti prima**; si possono aggiungere i **lettini
balinesi a €25 l'uno** fino a esaurimento; il giro lungo passa dalle **scogliere di Los
Gigantes** e non solo da Masca; l'equipaggio parla piu' lingue e racconta quello che si
vede; la barca segue le regole per avvicinare gli animali senza disturbarli.

**Cosa ho lasciato fuori, e perche'.** La descrizione dell'operatore dice "cancellazione
gratuita fino a 48 ore prima" e la politica in caso di maltempo (data alternativa o
rimborso). Sono **politiche di prenotazione**, e l'ufficio aveva appena deciso che quelle
delle pagine altrui non sono le nostre — noi prenotiamo a mano su WhatsApp. Non le ho
messe di mia iniziativa: decide l'ufficio, ora che sa che stavolta arrivano
dall'operatore e non dal rivenditore.

Del pezzo sul maltempo ho preso solo la parte che non promette niente: **"se soffri il mal
di mare, prendi le tue precauzioni"**, che e' un consiglio pratico e non un impegno.

### Le varianti salgono sopra "In breve" (25 agosto)

Detto dall'ufficio, e ha ragione. Sulla pagina di dettaglio le varianti stavano in fondo,
appena sopra il pulsante: il cliente leggeva "Prezzo €30" in "In breve", scendeva, sceglieva
le 4 ore e mezza, e **quel prezzo cambiava alle sue spalle** in un pezzo di pagina che
aveva gia' superato.

Adesso le varianti stanno subito sotto la descrizione, prima di "In breve": si sceglie
prima e si legge il riassunto dopo, che e' l'ordine in cui quei due pezzi si parlano.

Non ci sono `if`: `detailOptions()` non scrive niente dove le varianti non ci sono, quindi
le schede senza varianti restano identiche a prima. Controllate tutte e quattro quelle che
ce le hanno (Freebird, Self Drive Boat, jet ski, tuk tuk) piu' una senza.

### Due schede diventano una: Freebird Catamaran Trip (25 agosto)

L'ufficio ha mandato il listino del catamarano Freebird e ha chiesto di **unire in una
scheda sola** il "4-Hour Catamaran to Los Gigantes & Masca" e il "3-Hour Catamaran
Excursion": sono giri diversi della stessa barca, dallo stesso porto.

Le due schede sono state **tolte** e sostituite da `freebird-catamaran`, con quattro
varianti:

| variante | prezzo | giorni | orario |
|---|---|---|---|
| 2 ore | €30 | lun, mer, ven, dom | 11:00 |
| 3 ore | €47 | tutti i giorni | 10:00 |
| 4 ore e mezza | €62 | tutti i giorni | 13:00 |
| 4 ore e mezza dal nord | €69 | mar, gio, ven, dom | 13:00 |

**I prezzi sono cambiati:** le vecchie schede dicevano €45 e €58, presi all'inizio dai
siti dei concorrenti. Ora sono €47 e €62, che vengono dal listino mandato dall'ufficio.

**Due campi nuovi, dentro le varianti.** Servivano tutti e due a questa scheda e non
c'era modo di dirlo con quello che c'era:

- `desc` su ogni variante — giorni, orario, cosa si mangia, dove si fa il bagno. Compare
  **una alla volta**, in un riquadro sotto i bottoni: quattro varianti con due righe di
  testo dentro ogni bottone diventano un muro e non si sceglie piu' niente
- `times` su ogni variante — perche' qui **l'orario dipende dalla durata**: il giro di 2
  ore parte alle 11:00 e quello di 3 alle 10:00. Il campo `times` dell'attivita' resta
  per le barche con un orario solo; quello della variante, dove c'e', batte l'altro

Senza `times` sulla variante questa scheda avrebbe mostrato le **fasce segnaposto**
generiche, che qui sarebbero state informazione sbagliata: gli orari veri li abbiamo.

**Cosa NON ho preso dalla pagina mandata.** Il listino arriva da un rivenditore
(CanaryVIP), non dall'operatore, quindi:

- "Up to 48h Cancelation" → **non l'ho scritto**, e l'ufficio ha poi confermato che era
  giusto cosi': **quella e' la politica di CanaryVIP, non la nostra**. La nostra
  prenotazione si fa a mano su WhatsApp e la cancellazione la decide Admiral. Domanda
  chiusa: sul sito non c'e' nessuna promessa di cancellazione, e non ce ne va nessuna
  finche' l'ufficio non ne detta una sua
- "Secure Payment", "Best Price Guaranteed", "Official Tickets", "26 customer reviews",
  "Book Now and Save" → e' la loro pubblicita' e sono le loro recensioni, non le nostre
- le descrizioni sono riscritte da zero, come sempre: i fatti (durate, prezzi, orari,
  cosa e' incluso) si possono usare, il testo con cui li raccontano no

**I prezzi dei bambini sono arrivati** (15 / 23 / 31 / 34), e hanno tirato fuori un
problema: **cambiano con la variante**, mentre `priceAdult` e `priceChild` sono uno solo
per scheda. Il totale sarebbe stato sbagliato su tre varianti su quattro.

Ora `priceAdult` e `priceChild` si possono scrivere **dentro la variante**, e quando ci
sono valgono quelli. Il posto dove si sceglie la variante e' uno solo (`opzioneScelta()`),
cosi' i bottoni della pagina e il menu della finestra non possono rispondere in modo
diverso.

**Il campo `price` da solo NON entra nel totale, e non e' una dimenticanza.** `price` e'
il numero da scrivere sul bottone e puo' essere il prezzo del **mezzo**, non della
persona: il jet ski costa €150 l'ora *a moto d'acqua*, e moltiplicarlo per due persone
darebbe €300 a chi ne noleggia una sola. La coppia `priceAdult`/`priceChild` invece dice
a chiare lettere "questa variante si paga a testa, ed ecco i due prezzi". Verificato che
il jet ski continui a non mostrare nessun totale.

**Il prezzo dei bambini si attacca alla riga del prezzo** ("€47 (bambini €23)") invece di
avere la sua riga in "In breve": quella tabella e' fissa, e qui i due numeri cambiano
tutte le volte che si preme un bottone.

**La foto e' un "Freebird Gold", il listino e' del "Freebird One".** Stessa compagnia,
barche diverse — il nome si legge sulle vele in tutte e due le foto che abbiamo. Per non
mettere un titolo che la foto smentisce, la scheda si chiama **"Freebird Catamaran
Trip"**, col nome della compagnia e non della singola barca.

**I giorni sono controllati** (fatto dopo, vedi "Il giorno sbagliato non passa piu'"):
il campo `days` sulla scheda o sulla variante blocca la richiesta e spiega quali giorni si
fa. Prima non lo era: il cliente poteva chiedere il giro di 2 ore di martedi', che non si
fa.

**`catamaran-3h.jpg` l'ho poi cancellata** (pulizia del 28 agosto): era la seconda foto
della stessa barca, che la sua scheda ce l'ha gia', e non esiste una galleria che possa
usarne due. Se dovesse riservire sta nella storia di git.

### Small Group Catamaran (25 agosto)

Dati veri dall'ufficio. **€60 adulto, €30 bambino 3-11, gratis 0-2**, tre ore, massimo 23
persone, pranzo con paella di pollo, bevande, sosta bagno.

**Come ho capito quale scheda era.** "small catamarano" poteva essere tre schede diverse:
`small-group-catamaran`, `small-catamaran-rental` e `catamaran-3h`. Decisivo il prezzo:
`small-group-catamaran` aveva gia' `priceFrom: 60`, esattamente l'adulto del listino
nuovo. Il rental e' senza skipper (niente pranzo, niente equipaggio) e `catamaran-3h`
sta a €45.

**Dove e' finito ognuno dei pezzi:**

- €60 / €30 / gratis → `priceAdult`, `priceChild`, `priceInfant`, con `ages` 12+ / 3-11 /
  0-2. La riga "Prezzo: da €60" sparisce da sola perche' ripeterebbe "Adulti: €60"
- pranzo, bevande, sosta bagno, attrezzatura → `included`
- "massimo 23 persone" e "paella di pollo" → nella descrizione, dove vendono
- 15 minuti prima, cosa portare, e **quali** bevande → `notes`

**"Snorkel equipment is available onboard" vale `snorkel`.** E' il fornitore che dice che
la maschera la mette lui, che e' esattamente la condizione fissata ieri. Nel riquadro
compaiono sia "Bagno e snorkeling" sia "Attrezzatura da snorkeling": e' voluto, l'ufficio
ha confermato che sono due cose diverse.

**La birra sta nei consigli, non fra le icone.** `inc.drinks` dice "Bevande a bordo" e un
cliente puo' chiedersi se la birra si paga: la riga "Le bevande comprese sono analcoliche,
birra e acqua" toglie il dubbio. Meglio di una parola nuova `beer` nel vocabolario delle
icone, che si userebbe su una scheda sola.

**Il porto di partenza e' Puerto Colón**, confermato dall'ufficio subito dopo. Non
l'avevo scritto prima pur essendo quello di quasi tutte le altre barche: indovinarlo
vorrebbe dire mandare un cliente al molo sbagliato, e su una cosa cosi' un'informazione
inventata e' peggio di una mancante.

**Le due note "15 minuti prima" e "cosa portare" sono identiche a quelle del Luxury
Catamaran.** Copiate apposta: `notes` e' testo libero per ogni scheda, e due schede che
dicono la stessa cosa con parole diverse confondono piu' di quanto la ripetizione
infastidisca.

### La lista: piu' escursioni in un messaggio solo (25 agosto)

Il cliente che ne vuole tre non deve aprire WhatsApp tre volte. Le mette in una lista
mentre gira il sito e alla fine parte **un solo messaggio**, con tutte dentro e il
totale sommato. File nuovo: **`lista.js`**.

**Le due decisioni dell'ufficio.**

1. **Tutto per ogni escursione** (data, orario, persone, variante, transfer, note).
   Il nome no: quello si chiede una volta sola quando si manda la lista.
2. **"Richiedi disponibilita'" resta.** Chi ne vuole una sola fa come prima, senza
   passaggi in piu'. Sotto c'e' il secondo pulsante, "Aggiungi alla lista".

**Come funziona.** Il pulsante "Aggiungi alla lista" apre **la stessa finestra** della
richiesta singola, in "modalita' aggiungi": sparisce il campo del nome e il pulsante in
fondo cambia scritta. Un modulo solo per due strade: se domani si aggiunge un campo,
lo si aggiunge una volta.

**Dove sta la lista.** Nel browser del cliente (`localStorage`, chiave `isla-lista`),
come la lingua. Non arriva a nessun server: finche' il cliente non manda il messaggio,
quella lista non la vede nessuno. Sopravvive al cambio pagina e alla chiusura del sito.

**Si salvano le scelte, mai i prezzi.** I prezzi cambiano: uno salvato ieri nel browser
di qualcuno domani sarebbe sbagliato. Il conto si rifa' ogni volta leggendo il catalogo,
con le stesse regole del totale singolo — quindi Self Drive Boat (a barca) e Private
Charter (a scaglioni) nella lista mostrano il prezzo della scheda, non un totale.

**Il totale parziale si dichiara.** Se due escursioni su tre hanno il prezzo, la riga
non dice "Totale €140": dice **"Totale indicativo (solo le escursioni con il prezzo)"**.
Un numero secco, con delle voci non contate, il cliente lo legge come il prezzo di tutto.

**Cosa fa "Su richiesta" nella lista.** Niente: le voci senza totale mostrano il prezzo
della scheda ("da €48"). Alla prima prova scrivevano "Su richiesta" anche per Siam Park,
che sul catalogo dice "da €48": due schermate dello stesso sito che si contraddicono.

**Con una voce sola parte il messaggio singolo**, non un elenco numerato di un elemento.
All'ufficio arriva un formato solo per la stessa cosa.

**Tetto di 10 escursioni.** Oltre, il messaggio diventa illeggibile e la richiesta non e'
piu' una richiesta, e' un preventivo. Quando e' piena lo dice, invece di far finta di
aggiungere.

**Dopo l'invio la lista si svuota**, se no alla visita dopo il cliente rimanderebbe due
volte le stesse escursioni.

**Il pulsante che galleggia sta a SINISTRA.** In basso a destra c'e' gia' il pallino
dell'assistente e i due si coprivano a vicenda — visto solo guardando la schermata, non
leggendo il codice. C'e' solo quando la lista ha qualcosa dentro: a lista vuota sarebbe
un bottone che non fa niente piantato sopra il contenuto.

**Costruito da JavaScript, non in HTML.** Pulsante e finestra servono su tre pagine, e
tre copie dello stesso HTML e' il modo sicuro per ritrovarsele diverse dopo la prossima
modifica (la finestra della richiesta, che le copie ce le ha, insegna). `index.html` ora
carica anche `escursioni.js`: gli servono i conti e il formato del messaggio.

**Due cose spostate perche' servivano a piu' file:**

- `esc()` da `tour.js` a `escursioni.js` — `lista.js` gira anche dove `tour.js` non c'e'
- le righe del messaggio ora sono `righeRichiesta()`, usata sia dal messaggio singolo sia
  da quello della lista: l'ufficio legge sempre le stesse cose nello stesso ordine

**Un errore preso in prova:** `form.querySelector(...)` era scritto **prima** della
guardia `if (!form) return`. In home la finestra della richiesta non c'e', quindi `form`
e' `null` e la pagina si rompeva. `node --check` non lo vede: e' un errore di esecuzione.
L'ha trovato la prova col browser, che segnala gli errori di pagina.

**Provato:** tre escursioni aggiunte da pagine diverse, la lista che sopravvive al cambio
pagina, togliere una voce (il nome gia' scritto resta), svuotare, il messaggio con tre
voci e quello con una sola, la richiesta singola che funziona come prima, il cambio
lingua a lista aperta, e tutte e quattro le pagine senza errori.

### L'orario e il totale nella finestra della richiesta (25 agosto)

Due richieste dell'ufficio, tutte e due dentro "Richiedi disponibilita'".

**1. Si sceglie l'orario.** Nuovo campo "A che ora", subito sotto la data.

Gli orari veri l'ufficio li mandera' dopo. Nel frattempo c'e' `ORARI_PREDEFINITI`
in cima a `esplora-catalog.js`: sette fasce generiche, marcate come **segnaposto**.
Ogni attivita' puo' avere i suoi col campo `times`, che prende il posto della lista
generica; oggi non ce l'ha nessuna.

Il punto che tiene tutto in piedi: **la prima voce e' sempre "Da concordare" e vale
stringa vuota.** Il sito non sceglie mai un orario al posto del cliente, e se il
cliente non ne sceglie uno la riga dell'orario **non compare** nel messaggio WhatsApp
— non compare una riga che dice "da concordare", proprio non c'e'. Cosi' finche' gli
orari sono finti nessuno rischia di chiedere le 10:00 per una barca che parte alle
09:30, a meno che non lo scelga apposta.

Gli orari si scrivono uguali in tutte e tre le lingue: niente `{ it, en, es }`.

**2. Il totale mentre si scelgono le persone.** "2 adulti × €55 + 1 bambino × €30" e
sopra, grosso, "Totale €140". Si aggiorna mentre il cliente cambia i numeri.

Il totale **va anche nel messaggio WhatsApp**, per decisione dell'ufficio ("per piu'
chiarezza"): cosi' vedono subito che conto ha fatto il cliente e lo correggono prima di
confermare.

    • Totale indicativo: €140 (2 adulti × €55 + 1 bambino × €30)

Avevo proposto di tenerlo fuori dalla chat, perche' un numero scritto diventa un
impegno. L'ufficio ha deciso di metterlo: la parola **"indicativo"** ci resta attaccata
in tutte e tre le lingue, in chat come nella finestra, e il prezzo buono resta quello
della conferma.

Il conto lo fa **una funzione sola**, `calcolaTotale()` in `escursioni.js`, usata sia
dalla finestra sia dal messaggio. Erano due posti che dovevano dire lo stesso numero:
scriverlo due volte era il modo sicuro per farli diventare diversi al primo cambio.

**Dove il totale NON si mostra, e perche'.** Moltiplicare per le persone un prezzo che
non e' a persona darebbe un numero sbagliato, e un numero sbagliato scritto nero su
bianco e' peggio di nessun numero:

- `priceUnit` — il prezzo e' a barca o all'ora (Self Drive Boat: €190 sono la barca
  intera, non €190 a testa)
- `priceTiers` — a scaglioni di gruppo (Private Charter)
- bambini > 0 ma `priceChild: 0`, cioe' "non ancora deciso": il totale verrebbe fuori
  come se i bambini non pagassero. Oggi non c'e' nessuna attivita' cosi', ma appena
  l'ufficio manda un prezzo adulto senza quello bambino succede

**Col transfer il listino e' un altro.** Se il cliente spunta il transfer e l'attivita'
ha `transferPrice`, il totale usa quei prezzi: sul Twin Ticket 2 adulti + 1 bambino
passano da €213 a €272. Il posto sul pullman per i neonati non entra nel conto, perche'
la finestra non chiede quanti neonati ci sono.

**Provato:** i cinque casi qui sopra, le tre lingue, il cambio lingua a finestra aperta
(l'orario scelto resta, "Da concordare" e "2 adulti × €55" si ritraducono), e che il
numero della finestra e quello del messaggio siano sempre lo stesso.

**Le due finestre restano gemelle.** I campi nuovi sono stati messi sia in `tour.html`
sia in `escursioni.html`, anche se quella del catalogo non si apre piu' da nessuna parte
(vedi qui sotto). Tenerle uguali costa due copia-incolla; lasciarle divergere costa un
bug il giorno che si tocca quella sbagliata.

### Self Drive Boat: prezzi a scaglioni di ore (25 agosto)

Primi dati veri per `self-drive-boats`. **2 ore €190, 3 ore €265, 4 ore €335, 5 ore €395**,
oltre le 5 ore si chiede. Barca senza patente, massimo 4 persone, eta' minima per guidare
18 anni, cauzione di €100 in contanti il giorno stesso, e da 3 ore in su una prova di jet
blade in omaggio.

**Dove e' finito ognuno di questi pezzi:**

- le quattro durate → `options`, gli stessi bottoni del jet ski. Il cliente sceglie qui e
  la scelta arriva su WhatsApp gia' scritta ("Durata: 3 ore")
- **non** `priceTiers`: quello e' a scaglioni di *persone* (lo usa il Private Charter),
  qui gli scaglioni sono di *ore*
- eta' minima, cauzione, jet blade, "oltre le 5 ore si chiede" → `notes`
- "massimo 4 persone" e "non serve la patente" → dentro la descrizione, dove vendono
- attrezzatura, casse, giubbotti, asciugamani, carburante → `included`

**Il prezzo e' per la barca, non a persona.** E' la cosa piu' facile da fraintendere di
tutta la scheda: €190 letto come "a testa" su una barca da 4 fa scappare il cliente, letto
come "a barca" fa €47 a testa. Tre cose lo dicono: `priceUnit: "a barca"` sulla scheda del
catalogo e nella riga "Prezzo", la prima riga dei consigli, e la descrizione.

Per farlo funzionare ho dovuto sistemare due punti:

- `priceUnit` veniva **attaccato** al prezzo senza spazio, perche' finora conteneva solo
  "/ora". "da €190a barca" non si legge. Ora l'unita' che inizia con "/" resta attaccata e
  le altre prendono lo spazio: e' `priceUnitSuffix()` in `escursioni.js`, e la stessa
  regola e' ripetuta in `assistente.js` (la home non carica `escursioni.js`)
- premendo un bottone della durata la riga "Prezzo" mostrava solo "€335", perdendo
  "a barca". Adesso l'unita' segue anche la variante

**Quattro parole nuove per `included`:** `lifejacket`, `speaker`, `towels`, `fuel`. Le
prime due sono venute bene subito, le altre due no:

- `towels` — l'asciugamano appeso alla sbarra: la sbarra e il bordo di sopra del telo si
  toccavano e veniva fuori un **bicchiere**. Rifatto come pila di teli piegati
- `fuel` — la pompa di benzina senza basamento e senza il vetro del display sembrava una
  **caraffa col manico**. Aggiunti tutti e due

Come sempre: si guardano tutte le icone in fila, non una alla volta. Da sole sembrano
sempre giuste.

**Cambio di idea sulla sosta bagno.** Ieri avevo tenuto `self-drive-boats` fuori da
`swimstop` ragionando che in un noleggio senza skipper la sosta non e' "nel programma".
La descrizione mandata dall'ufficio include l'attrezzatura da snorkeling, quindi il bagno
c'e' eccome — ed e' proprio quello che l'ufficio aveva detto ("la sosta bagno e' inclusa in
tutte le barche, anche se non c'e' scritto nelle descrizioni che ti invio"). Aggiunta.
**Resta fuori `small-catamaran-rental`**, per cui non e' ancora arrivato niente.

**Le due cose che mancavano, arrivate subito dopo:** i bambini **possono** salire come
passeggeri (`family: true`, quindi la scheda entra nel filtro "Con bambini") e si parte da
**Puerto Colón**. La nota sull'eta' e' stata riscritta di conseguenza: dice che chi *guida*
deve avere 18 anni e che i bambini salgono come passeggeri. Serve proprio a chi arriva dal
filtro "Con bambini" e vede scritto "18 anni" senza spiegazione.

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

*(25 agosto: `self-drive-boats` ce l'ha. Vedi "Self Drive Boat" qui sopra.)*

**Una descrizione andava corretta:** il glass bottom boat diceva "si guarda sott'acqua
restando a bordo", che con la sosta bagno si contraddiceva. Riscritta nelle tre lingue.

**Sul 3-Hour Whale & Dolphin** compaiono sia "Attrezzatura da snorkeling" sia "Bagno e
snorkeling". Avevo chiesto se fosse ripetitivo: **l'ufficio ha detto di tenerle tutte e
due** (25 agosto), perche' sono due cose diverse e **alcune barche fanno la sosta ma
l'attrezzatura non la danno**. Quindi, da qui in avanti:

- `swimstop` va su **tutte** le barche: la sosta c'e' sempre, anche quando la descrizione
  non la nomina
- `snorkel` va **solo** dove il fornitore dice davvero che maschera e boccaglio li da' lui.
  Non si deduce dalla sosta bagno: se non c'e' scritto, non si mette

Al 25 agosto ce l'hanno in due, `whale-dolphin-3h` e `self-drive-boats`, e in tutti e due
i casi perche' era scritto nel testo mandato dall'ufficio. Nessuna e' stata indovinata.

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

Le diciannove parole disponibili: `snorkel wetsuit board equipment drinks snack fingerfood
swimstop lunch tasting guide transfer ferry ticket photos lifejacket speaker towels fuel`. Per aggiungerne una servono **due righe**: l'icona in
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

~~Quando un prodotto è in offerta si mette il prezzo scontato.~~ **Superato il 25
agosto**: l'ufficio ha chiarito che i prezzi barrati sono le offerte dei rivenditori, non
nostre, e sul sito va il **prezzo pieno**. Vedi "I prezzi barrati sono offerte del
rivenditore" più sopra.

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

## La pulizia del 28 agosto

Cercata la ridondanza misurandola, non a occhio. Il risultato utile e' che il progetto
era gia' quasi pulito: **nessuna funzione dichiarata e mai chiamata**, **nessuna chiave
i18n morta** su 249, **una sola classe CSS inutilizzata** su 196, **una sola foto**
orfana su 76.

**Il grep ingenuo mente due volte.** Cercando le chiavi i18n dentro il codice ne
risultavano 20 morte: erano tutte le `inc.*`, che non compaiono mai scritte per intero
perche' si costruiscono a runtime (`t("inc." + parola)` in `tour.js`), piu'
`categories.altSuffix`, usata dentro `i18n.js` stesso, che avevo escluso dalla ricerca.
Le chiavi morte vere erano zero. Prima di cancellare qualcosa perche' "non risulta usato",
va guardato **come** viene usato.

**`wetsuit` e `board` sembravano icone di troppo: erano l'opposto.** Nessuna scheda le
citava, ma `surf-lesson` e' pubblicata e la sua descrizione promette gia' "tavola e muta
compresi". Non erano avanzi da buttare, era una riga `included` che mancava. Aggiunta.

### Il flusso "Prenota ora" resta finto, e si e' deciso cosi'

`booking.html` + `booking.js` cercano il codice del cliente dentro `MOCK_BOOKINGS`: due
prenotazioni inventate (`ISLA-4521`, `TEN-7788`), un'email che non esiste
(`info@islatenerife.com`), un bollino "Confermata". Ci arrivano **quattro** punti
d'ingresso su tre pagine: "Prenota ora" nell'header, la casella "Scan ticket" nel menu e
nella home, "Cerca il tuo codice" nel footer.

Con le richieste via WhatsApp **un codice il cliente non ce l'ha mai**, quindi chi clicca
"Prenota ora" finisce su "non trovato". Ho proposto di togliere tutto e far puntare
"Prenota ora" alle escursioni; **il proprietario ha scelto di lasciare tutto com'e'**,
come segnaposto di un sistema di prenotazioni vero. Registrato qui per non riproporlo a
ogni pulizia: e' una scelta, non una svista.

## "Da concordare" solo dove l'ora si concorda davvero (28 agosto)

Il proprietario ha notato che il menu degli orari offriva **"Da concordare" anche sulle
schede di cui aveva appena dato le partenze vere**. Offrirlo dove la barca parte alle
10:00 e alle 13:00 fa credere che l'ora si tratti, e non e' vero: quel giro parte a
quell'ora e basta.

**Il campo `times` ha tre stati e vogliono dire tre cose diverse.** Prima ne aveva due e
mezzo, ora sono espliciti (documentati in testa a `esplora-catalog.js`):

| `times` | significato | cosa vede il cliente |
|---|---|---|
| pieno | le partenze vere del fornitore | solo quelle, niente "Da concordare" |
| `[]` | charter o noleggio, l'ora si concorda | solo "Da concordare" |
| assente | non le sappiamo ancora | fasce segnaposto + "Da concordare" |

**Come si riconosce un charter senza doverlo chiedere: dal prezzo.** `private-charter` sta
a "€350 a gruppo", `self-drive-boats` a "€190 a barca", `small-catamaran-rental` a
"€100/ora" — la barca e' tutta del cliente, quindi l'ora la concorda. `luxury-cruiser`,
`glass-bottom-boat` e `luxury-catamaran` costano €65, €58 e €75 **a persona**, senza
`priceUnit`: sono giri condivisi con una partenza fissa, che pero' non conosciamo ancora.
E' lo stesso segnale che distingue `price` da `priceAdult` nel conto del totale.

A quelle tre schede ho messo `times: []`. Le altre tre restano coi segnaposto finche'
l'ufficio non manda gli orari: **non ho inventato una partenza per farle sembrare
complete.**

**Le fasce segnaposto restano dove non sappiamo, e c'e' un motivo.** Sono intervalli
("09:00 - 10:00"), non orari esatti: il cliente le legge come una preferenza, non come una
promessa di partenza. Toglierle costringerebbe chi ha una preferenza a non poterla dire.

**Il menu delle varianti dentro la finestra e' codice morto**, scoperto testando questa
modifica. `riempiOpzioni()` lo nasconde appena la pagina ha i bottoni delle varianti
(`sceltaDallaPagina()`), e dalla lista la finestra non si apre piu': il pulsante della
scheda porta al dettaglio. Quindi la variante arriva **sempre** dai bottoni della pagina.
Non l'ho tolto — funziona e non da' fastidio — ma va saputo prima di andare a caccia di un
bug li' dentro: **il `<select>` non ha nessun `addEventListener`, e non serve che ce
l'abbia.**

## Whale & Dolphin e Glass Bottom Boat: le partenze vere (28 agosto)

Le prime due schede a uscire dai segnaposto. Le partenze sono **09:00, 12:00, 15:00 e
18:00** su tutte e due: tre ore l'una, una dietro l'altra, dallo stesso porto (Puerto
Colón). Le 18:00 si fanno **solo d'estate**.

**La partenza stagionale sta in elenco, non fuori.** Stesso trattamento gia' dato alla
9:30 di Royal Delfin: l'orario e' selezionabile come gli altri e il limite lo spiega una
nota sotto. Nasconderlo d'inverno vorrebbe dire sapere quando comincia l'estate, e non lo
sappiamo: **l'ufficio non ha dato le date**, per questo la nota dice "solo d'estate" e non
un periodo preciso. Se arrivano le date esatte, si scrivono li'.

**Glass Bottom Boat: bambini €45 dai 2 agli 11.** L'adulto l'ufficio non l'ha detto: ho
messo €58, che e' il valore che la scheda **gia' pubblicava** come `priceFrom`, cosi' il
totale funziona e il prezzo mostrato non cambia. Non e' un dato nuovo, e' quello vecchio
reso esplicito — ma va confermato.

**Sotto i 2 anni non c'e' nessun campo**, come da regola: i bambini partono da 2 anni e
non sappiamo se sotto si sale gratis o non si sale affatto. Niente `priceInfant`, che
vorrebbe dire "gratis". Da chiedere.

## Peter Pan Pirate Ship (28 agosto)

Goletta portoghese in legno, due alberi, **l'unica barca che parte da Los Cristianos** e
l'unica di due ore: €27 adulto, €13 bambino, neonati gratis, partenze 10:00, 12:00 e 14:00
tutti i giorni. Prima di crearla ho controllato che non fosse un doppione — la lezione del
Kalima Kat: nessuna delle quindici schede "mare e barche" sta a €27, nessun'altra dura due
ore e nessun'altra parte da Los Cristianos. Lo Shogun e' anche lui una goletta, ma di 26
metri, cinque ore, da Puerto Colon.

**Il bagno non e' compreso, e non e' una dimenticanza.** Il fornitore scrive "3-Hour Tour:
includes swimming and a full lunch" e per il giro di due ore "food and drinks are not
included, but you can buy them onboard". Il contrasto e' esplicito: sul giro corto non si
nuota e non si mangia. Nelle icone c'e' solo `guide`. Mettere `swimstop` perche' la
descrizione generale della pagina parla di una sosta bagno avrebbe promesso una cosa che
su **questo** giro non c'e'.

**Il transfer e' gratis ma non a tutte le partenze** ("free pick-up available only at
12:00"). E' una condizione, non un prezzo: sta scritto nella riga `transfer`, senza
`transferPrice` e **senza** "transfer" fra le icone, che direbbe che vale sempre.

**Niente `languages`, anche se la pagina dice "multilingual guides".** Vale la regola data
dal proprietario: il menu delle lingue si mette solo dove me lo segnala lui.

**Non copiato**, come sempre da CanaryVIP: le 48 ore di cancellazione (le nostre sono 24,
sempre), "best price guarantee", "discounts activated", "official tickets", il punteggio e
il numero di recensioni.

**Due cose lasciate in sospeso e non indovinate:**

- **L'eta' dei tre anni.** Il proprietario ha scritto "bambini 3-11" e "bebe' 0-3": i tre
  anni stavano in tutte e due le fasce. Ho messo neonati **0-2**, che e' l'unica lettura
  che fa combaciare le fasce senza sovrapporle, ed e' anche quella delle altre barche. Se
  un bambino di tre anni non paga davvero, diventa 0-3 e i bambini 4-11, come su Freebird.
- **Il giro di tre ore con bagno e pranzo non e' pubblicato.** Esiste, parte alle 10:00,
  ma il fornitore non ne da' il prezzo e dice solo "available only for a limited time,
  check the calendar". Senza prezzo e senza date non e' una scheda: e' una domanda.


## Tre strumenti per lavorare meglio (28 agosto)

Il proprietario ha chiesto quali "competenze" aggiungere per farmi lavorare meglio. La
risposta e' venuta guardando cosa si e' rotto davvero in questa sessione, e sono tre cose
di natura diversa.

**1. `CLAUDE.md`.** Questi appunti hanno superato le 1900 righe e **non vengono letti da
soli**: li apro solo quando mi viene in mente di cercarci dentro. Le regole che dimentico
sono sempre le stesse — le 24 ore, non copiare le policy dei rivenditori, `swimstop` non
e' `snorkel`, le fasce d'eta' devono combaciare, alzare `sw.js`. `CLAUDE.md` viene
caricato **all'inizio di ogni sessione**: sta li' il minimo indispensabile, qui il perche'.

**2. `.claude/skills/nuova-scheda/`.** Aggiungere una scheda da una pagina fornitore e' il
lavoro che si ripete di piu' e quello con piu' regole taciute. La skill mette in ordine i
passi, e il primo e' **controllare che la scheda non esista gia'** — che e' esattamente il
passo che era saltato col Kalima Kat.

**3. `controlla.js`.** Questo non e' un'istruzione ma un programma, e va meglio proprio
per questo: e' **deterministico**, non dipende da cosa mi ricordo. Controlla fasce d'eta',
sigle dei giorni, orari, parole di `included` senza icona, foto mancanti, traduzioni
incomplete, id doppi. Finora questi controlli li scrivevo come scriptini usa e getta, uno
per volta, e li buttavo.

**L'ho messo alla prova rompendo il catalogo di proposito** — un buco d'eta', una sigla
inventata, una parola senza icona, una foto inesistente: li ha trovati tutti e quattro. Un
controllore che dice "tutto a posto" senza essere mai stato provato non vale niente.

**Due difetti erano nel controllore, non nel catalogo.** Al primo giro segnalava 20 chiavi
i18n senza traduzione: era la sua regex che si fermava alla prima graffa chiusa, e le
chiavi con segnaposto (`da €{p}`, `{giorni}`) ne chiudono una a meta' valore. E dava per
illeggibile la fascia neonati di Opera 60, che e' scritta in **mesi** ("0-11 mesi") perche'
cosi' l'ha mandata l'ufficio: ora avvisa e tira dritto, invece di chiedere di storpiare un
dato vero per far contento un controllo.

**Trovata una contraddizione dentro questi stessi appunti.** "Da dove vengono i dati del
catalogo" diceva ancora di pubblicare il **prezzo scontato**, mentre la regola del 25
agosto dice il **prezzo pieno**. Corretta. E' il rischio di appunti che crescono: due
paragrafi scritti in giorni diversi che si contraddicono, e nessuno dei due sa dell'altro.

## Small Catamaran Rental, riempita (28 agosto)

Prima scheda passata dalla skill `nuova-scheda`, e il primo passo della procedura ha fatto
il suo lavoro: **non era una scheda nuova.** Il proprietario ha confermato subito che i
dati erano per `small-catamaran-rental`, che stava gia' in catalogo a €100/ora, senza
patente, con zona e durata da definire.

**€100 l'ora, da 2 a 6 ore, massimo 6 persone, senza patente nautica.** Cinque varianti di
durata (€200, €300, €400, €500, €600), come sul Self Drive Boat: cosi' il cliente legge il
totale invece di doverselo moltiplicare.

### L'errore che ho fatto, e come si e' visto

Avevo lasciato `priceUnit: "/ora"` e aggiunto le varianti. La pagina scrive il prezzo della
variante seguito dall'unita' della scheda, e usciva **"€200/ora"**: il totale di due ore
spacciato per tariffa oraria. Falso, e sul prezzo.

Il codice non e' sbagliato — su Self Drive Boat scrive "€190 a barca", che e' giusto,
perche' li' l'unita' e' "a barca". Era il mio dato a non stare in piedi: con le varianti di
durata, `priceUnit` **deve** essere un'unita' di barca, non di tempo. Corretto in
"a barca", con `priceFrom: 200`.

**Il "da €" e' passato da €100 a €200, e non e' un aumento.** Sotto le due ore non si
noleggia: €200 e' il minimo che il cliente puo' davvero spendere, mentre "da €100/ora"
prometteva un conto che non poteva fare. La tariffa di €100 l'ora e' rimasta, scritta per
esteso nella prima nota.

**Si e' visto solo guardando la pagina resa**, non il codice. E' il terzo caso dopo
"Neonati: Gratis" su una variante a barca intera e la durata che non seguiva la variante.

### La ventesima icona: la borsa frigo

La borsa frigo non aveva un'icona, e delle quattro cose comprese era l'unica che sarebbe
finita solo in una nota. Aggiunta — due righe, come da regola: il disegno in
`INCLUDED_ICONS` e `inc.cooler` in `i18n.js`.

**Ci sono voluti due giri, e il secondo l'ha deciso il foglio con tutte e venti in fila.**
Il primo disegno era una scatola con la maniglia in cima, la riga del coperchio e un
fiocco di neve piccolo: da sola sembrava giusta, in fila leggeva "cassetta degli attrezzi"
ed era troppo vicina a `equipment`, che e' gia' una borsa con manico e riga in mezzo. Il
secondo ha il **coperchio largo che sporge** sopra un corpo piu' stretto: quella sagoma
non ce l'ha nessun'altra icona.

**`towels` invece non c'e'**, ed e' voluto: qui il fornitore scrive "bring swimwear,
towels and sunscreen". Gli asciugamani il cliente se li porta, non glieli danno. Sul Self
Drive Boat `towels` c'e' perche' li' li prestano davvero.

**`family` da `false` a `true`.** Il fornitore scrive "ideal for families" e chiede i 18
anni **a chi guida**: i bambini salgono come passeggeri, come sul Self Drive Boat.

**Resta senza porto.** `zone` e' ancora "Da definire": il testo del fornitore non lo dice.
Il Self Drive Boat parte da Puerto Colon, ma e' un'altra barca e non si copia un porto per
somiglianza. Da chiedere.

## Flipper One, scheda nuova — e il porto del noleggio (28 agosto)

**Il porto del Small Catamaran Rental è Puerto Colón**, detto dall'ufficio. Era l'unica
cosa che mancava a quella scheda.

### Flipper One Boat Tour

Goletta di legno costruita a mano a Tenerife — diciotto mesi, quattro fratelli falegnami di
Alcalá, polena a forma di delfino. **L'unica scheda che parte da Los Gigantes**: tutte le
altre barche sono a Puerto Colón, Los Cristianos o Marina Amarilla. Massimo 91 persone.

Tre varianti, coi prezzi dentro ciascuna: **2 ore €33/€23**, **3 ore €40/€25**, **3 ore con
navetta €44/€29**. Neonati gratis su tutti e tre. Fasce `12+` / `2-11` / `0-1`.

**Il pranzo e la sosta bagno non stanno nel riquadro della scheda** ma dentro le due
varianti da tre ore, e la navetta solo dentro la terza. Nel riquadro di primo livello
restano `drinks` e `guide`, le uniche due cose vere su tutti e tre i giri: le bevande sono
comprese anche sul giro corto, il fornitore lo scrive esplicitamente.

**Una contraddizione dentro la pagina del fornitore, e come l'ho sciolta.** L'elenco in
cima dice "partenze alle 11:30 e alle 14:30". Le descrizioni delle varianti dicono 17:30
per il giro di due ore e 11:30 per quelli di tre. Il modulo di prenotazione, con il giro di
due ore selezionato, mostra 17:30. **Due pezzi indipendenti della pagina dicono la stessa
cosa e l'elenco in cima ne dice una terza**: ho preso i due che concordano e le 14:30 non
compaiono da nessuna parte. Da confermare con l'ufficio.

**Niente `days`, e non perché si faccia tutti i giorni.** Il fornitore scrive "quasi ogni
giorno" senza dire quali: non si può scrivere un elenco che non abbiamo. Il campo resta
fuori e una nota dice che non si parte proprio tutti i giorni e che la conferma arriva con
la richiesta. È l'unico caso finora in cui l'assenza di `days` non vuol dire "sette su
sette".

**Non copiato**: le 48 ore di cancellazione (le nostre sono 24), "miglior prezzo garantito",
"sconti attivati", "biglietti ufficiali", "pagamento sicuro", il punteggio e le sette
recensioni. **E nemmeno l'"avvistamento garantito"**: garantire di vedere un animale
selvatico non è una cosa che possiamo promettere noi.

**Niente `languages`** anche se la pagina dice "equipaggio multilingue": vale la regola che
il menu delle lingue si mette solo dove lo segnala il proprietario.

**Manca la foto.** L'immagine della barca è arrivata nella chat ma non come file
raggiungibile: la scheda è pubblicata senza, e `controlla.js` lo segnala come avviso
("pubblicata senza foto: in elenco esce il riquadro grigio"). È il primo avviso vero che il
controllo ha prodotto da solo su un lavoro in corso.

## Twin Ticket — neonati gratis (28 agosto 2026)

È arrivata incollata la pagina di CanaryVIP (un rivenditore concorrente, non un fornitore)
per lo stesso biglietto combinato. **Non era una scheda nuova**: `twin-ticket` esiste già,
con `priceAdult: 78` e `priceChild: 57` identici — prezzi già confermati dall'ufficio (vedi
sopra). Dalla pagina del concorrente non ho copiato niente: "Best Price Guaranteed",
"Official Tickets", punteggio e recensioni, la loro cancellazione, sono tutte cose che le
regole del progetto dicono di non riprendere.

L'unico dato mancante era `priceInfant`: la pagina di CanaryVIP mostrava "Toddler (Free)"
ma senza fascia d'età, e non è una fonte da fidarsi. **Confermato dal proprietario**: i
neonati non pagano fino a 0-2 anni. Aggiunto `priceInfant: 0` e `ages: { infant: "0-2" }`.

Confermate poi anche `ages.adult: "12+"` e `ages.child: "3-11"`: l'avviso su
`ages.adult` è sparito, `controlla.js` torna a 0 errori e 2 avvisi (quelli di sempre, non
legati a questa scheda).

## Twin Ticket — secondo transfer, per il Siam Park (28 agosto 2026)

Il proprietario ha chiesto di aggiungere anche il transfer per chi arriva dal nord e va al
Siam Park, usando i prezzi di CanaryVIP: **21€/17€ adulto/bambino per Loro Parque**
(combaciano esattamente col supplemento già in `transferPrice`, 99-78 e 74-57 — buon
segno) e **25€/21€ per il Siam Park**, entrambi con neonati gratis.

**Non era solo un dato da cambiare.** Il codice aveva un solo checkbox/prezzo per scheda
(`transfer` + `transferPrice`, usato anche dal Submarine Safari), quindi ho chiesto prima
di scrivere: il proprietario ha confermato **due checkbox indipendenti**, e per i neonati
di **passare a gratis per entrambi** (l'ufficio aveva confermato 17€ per Loro Parque, ma
qui ha deciso di allinearsi al dato nuovo).

**Aggiunto** `transferSiam` + `transferSiamPrice: { adult: 103, child: 78 }` (78+25,
57+21) sul Twin Ticket, gemello di `transfer`/`transferPrice` ma per il Siam Park. Nessun
campo `baby` in nessuno dei due: **gratis vuol dire niente riga in più**, non un valore a
zero — il cliente lo sa già dalla riga "Neonati: Gratis" del prezzo base.

**I due checkbox si escludono a vicenda** nella finestra della richiesta: spuntarne uno
toglie la spunta all'altro. Un cliente sta al nord o al sud, non in tutti e due i posti, e
il calcolo del totale non saprebbe cosa fare con entrambi spuntati.

Toccati 7 file: `esplora-catalog.js` (dati + vocabolario), `escursioni.js` (calcolo prezzo,
riga WhatsApp, badge, finestra della richiesta), `tour.js` (due righe nuove sulla pagina di
dettaglio), `escursioni.html` e `tour.html` (secondo checkbox, va tenuto allineato se si
tocca il primo), `i18n.js` (le tre lingue), `lista.js` (riga di dettaglio nella lista
salvata). Provato nel browser vero: le due righe extra sul dettaglio, l'esclusione dei
checkbox, il totale con ciascuno dei due transfer, e il messaggio WhatsApp finale.

**Da confermare, se serve**: se un cliente potesse davvero volere *entrambi* i transfer
(es. resta qualche giorno al nord e qualche giorno al sud), il calcolo attuale non lo
gestisce — mostrerebbe solo il prezzo dell'ultimo spuntato. Non è successo in pratica
finora con nessun'altra scheda, quindi non l'ho aggiunto da solo.

### Twin Ticket — quattro righe transfer erano troppe (28 agosto 2026)

Segnalato con uno screenshot dal telefono: "Transfer / Con il transfer / Transfer Siam
Park / Con il transfer per il Siam Park" sono quattro righe che dicono la stessa cosa due
volte a testa, e la tabella "In breve" diventava un elenco confuso.

**Accorpate in una riga sola per transfer**, col nome che dice subito la direzione:
"Transfer Loro Parque (da sud) — €99 adulti · €74 bambini" e "Transfer Siam Park (da
nord) — €103 adulti · €78 bambini". Aggiunti due campi nuovi, `transferPriceLabel` e
`transferSiamPriceLabel`: se ci sono, sostituiscono le due righe normali con una sola.

**Deciso da solo**: ho reso il cambiamento opzionale invece di riscrivere il rendering per
tutti. Il Submarine Safari usa lo stesso `transfer`/`transferPrice` ma ha un solo transfer,
non due che si confondono a vicenda — per lui le due righe separate (descrizione, poi
prezzo) restano com'erano, e senza `transferPriceLabel` continuano a comparire così su
qualunque scheda futura con un solo transfer.

**Non toccato**: il testo dentro la finestra della richiesta (sotto ai due checkbox) resta
quello per esteso di prima ("Disponibile su richiesta, solo per la giornata a ..."). Lì
serve la spiegazione completa, non l'etichetta corta — è un posto diverso dalla tabella
"In breve".

**Corretto subito dopo**: la riga accorpata mostrava €99/€74 ed €103/€78, cioè il prezzo
**completo** (biglietto+transfer) che serve al calcolo del totale — ma accanto ad "Adulti
(12+) €78" un secondo "€99 adulti" si legge come un secondo prezzo del biglietto, non come
il costo del bus. **Ora la riga mostra solo il supplemento**: €21/€17 per Loro Parque,
€25/€21 per il Siam Park — cioè `transferPrice - priceAdult/priceChild`, calcolato al volo
in `tour.js` solo per la riga accorpata. Il totale nella finestra della richiesta continua
a usare il prezzo completo come prima (verificato: €272 per 2 adulti + 1 bambino col
transfer Loro Parque) — cambia solo cosa si stampa, non cosa si calcola.

### Nuova scheda: Skyline Cruiser (30 agosto 2026)

Dati arrivati da CanaryVIP (id fornitore 14642): motoryacht Fairline di 42 piedi (quasi 13
metri), fino a 12 persone, da Puerto Colón. Prima di scrivere ho confrontato prezzo,
durata e porto con le altre schede `mare-barche`, come dice la procedura — ed è saltato
fuori un segnale forte: la scheda segnaposto `luxury-cruiser` ha **esattamente** gli stessi
€65 e 3 ore, zona "Da definire". Ho chiesto al proprietario se fosse la stessa barca: **ha
confermato che sono due barche diverse**, quindi ho lasciato `luxury-cruiser` intatta e ho
creato `skyline-cruiser` come scheda separata.

**Cosa ho messo**: `times: ["09:45", "13:15", "16:20"]` (le tre partenze vere date
dall'ufficio), `priceAdult: 65`, `privateOption: "private-charter"` (il fornitore elenca
anche un'opzione "privato", e in catalogo esiste già quel rimando generico usato da
Freebird, Royal Delfin e Whale & Dolphin). `included`: `swimstop`, `snorkel` (attrezzatura
a bordo, lo dice il fornitore), `fingerfood` (tortilla, pizza, salsicce, formaggio,
pomodorini, frutta — è uno spuntino, non un pranzo vero, come sul Luxury Catamaran) e
`drinks`, `towels`.

**Cosa ho lasciato fuori, di proposito**:
- **`priceChild`**: il fornitore non manda un prezzo bambini, solo "da €65". Resta a `0`
  ("non ancora deciso"), niente `ages`: **da chiedere all'ufficio**.
- **cancellazione, "best price guarantee", punteggio 5.0/8 recensioni, "sconti famiglia
  attivi", `languages: "guide multilingue"`**: tutte cose che la procedura dice di non
  copiare (le nostre cancellazioni sono sempre 24 ore, non quelle del fornitore; le altre
  sono marketing o troppo generiche per il campo `languages`).
- **pagamento intero alla prenotazione**: è la policy del fornitore, non la nostra — da
  noi il pagamento si concorda dopo la conferma via WhatsApp.
- **il tour "al tramonto"** che il fornitore elenca fra i tipi di gita: non ho un prezzo
  o un orario diverso per quella versione, quindi non l'ho inventata. **Da chiedere
  all'ufficio** se è un giro a parte o solo il nome dato alla partenza delle 16:20.

**Foto**: non ne ho ricevuta una, quindi la scheda è pubblicata senza (`published: true`,
niente campo `image`) — stesso caso già presente di `flipper-one`. In elenco esce il
riquadro grigio finché non arriva una foto vera.

Provato nel browser vero: pagina di dettaglio (prezzo, orari, icone, itinerario, note,
rimando al charter privato) e finestra della richiesta (i tre orari nel menu, totale €130
per 2 adulti, nessuna riga fantasma per i bambini con `priceChild: 0`). `node controlla.js`
dà 0 errori; l'unico avviso nuovo è la foto mancante, come previsto. Alzato `sw.js` a
`isla-v143`.

### Skyline Cruiser: foto, prezzo bambini, e spostato Small Catamaran Rental (31 agosto 2026)

Arrivate 4 foto della barca e il prezzo bambini (2-12 anni, €45).

**Foto**: una delle quattro aveva il logo "Skyline Cruiser" incollato sopra (angolo in
alto a sinistra, sul cielo) — non fa parte della livrea della barca, è una grafica
promozionale aggiunta dopo, quindi l'ho **ritagliata via** invece di pubblicarla così
com'è (il resto della foto, barca compresa, restava intatto). Una delle quattro era anche
piuttosto piccola (506×338, contro i 1200×800 delle altre): ingrandita 2,37×, più del
precedente di Opera 60 (1,6×), ma guardata a schermo intero regge ancora, non è sfocata
in modo evidente — usata comunque, come ultima della galleria. Scelta come foto
principale quella con la barca affiancata alle scogliere vulcaniche in controluce: è la
stessa scena descritta nel testo ("rientro costeggiando... le scogliere vulcaniche"), e
regge meglio delle altre da grande. Le altre tre in `gallery`. File circa 110-235 KB,
1200×800, dentro il range richiesto.

**Prezzo bambini**: `priceChild: 45`, fascia **2-12**. Ho aggiunto `ages: { adult: "13+",
child: "2-12" }` — il 13+ non è stato mandato, l'ho dedotto io perché è l'unico modo per
far combaciare le fasce senza buchi né sovrapposizioni (se l'adulto restasse "12+" ci
sarebbero due prezzi per i dodicenni). **Da confermare con l'ufficio**: sotto i 2 anni non
c'è ancora un prezzo, quindi non ho messo `priceInfant` — non so se sotto i 2 anni si
sale gratis o non si sale proprio.

**Small Catamaran Rental spostato da "Mare e barche" a "Sport acquatici"**: è un noleggio
che si guida da soli (nessun capitano), più vicino a Jet Ski Safari e Flyboard che alle
altre barche con equipaggio. Cambiato solo `category`, nessun altro campo. `self-drive-boats`
(stesso tipo di noleggio, capienza diversa) non l'avevo toccato in un primo momento perché
non era nella richiesta iniziale — **spostato anche lui** subito dopo, su richiesta
esplicita: stesso ragionamento, stesso singolo campo cambiato.

Provato nel browser vero: le quattro foto compaiono nella galleria di Skyline Cruiser,
"Adulti (13+) €65" e "Bambini (2-12) €45" sulla pagina, totale €175 per 2 adulti + 1
bambino nella finestra della richiesta. Small Catamaran Rental e Self-Drive Boats ora
escono entrambi con l'etichetta "Sport acquatici" sulla loro pagina. `node controlla.js`
→ 0 errori, nessun avviso. Alzato `sw.js` a `isla-v162`.

### Nuova scheda: Ragnarok (30 agosto 2026)

Barca a tema vichingo da Los Cristianos, avvistamento balene pilota e tursiopi, dati da
`canaryvip.com` (id fornitore 10467). Prima controllato che non fosse un doppione: nessuna
scheda a Los Cristianos con questo prezzo/durata/porto (la più vicina è Peter Pan, ma è
un'altra barca, altro prezzo, niente varianti).

**Non copiato dal fornitore**: il prezzo scontato (25€, pieno 30€ — sul sito va il pieno),
la cancellazione (48/72h del fornitore non c'entrano, restano le 24h di Isla), punteggio e
numero di recensioni, "best price"/testi promozionali. `languages` non messo: il
fornitore scrive solo "equipaggio multilingue", non un elenco, e la regola dice di
mettere il campo solo dove le lingue sono elencate davvero.

**Deciso col proprietario**: gli orari 11:00 e 13:30 non erano abbinati a una durata —
confermato che 11:00 è il giro di 2 ore e 13:30 quello di 3. Il prezzo bambini non era nel
documento: pubblicata senza (`priceChild: 0`), la riga resta nascosta finché non arriva.

**Deciso da solo**: il prezzo del giro di 3 ore non è mai stato dato (solo un "da" generico
per l'intera scheda) — lasciato senza `priceAdult` nella variante, la pagina mostra "Da
€30" come per un dato ancora da confermare, invece di indovinare un numero. Le info di
bordo del fornitore (bar-ristorante, servizi igienici, posti a sedere, aree accessibili)
non sono nel vocabolario di `included` (non sono "compresi nel prezzo", sono dotazioni
della barca) e sono finite nelle note. Gli spettacoli a tema, i giochi e la prova
dell'equipaggiamento vichingo sono finiti nella descrizione, riscritta da zero nelle tre
lingue: sono quello che rende diversa questa barca da tutte le altre.

**Resta in sospeso, scheda non pubblicata (`published: false`)**: manca la foto (nessuna
in `assets/`), manca il prezzo bambini/neonati, manca il prezzo del giro di 3 ore. Provata
nel browser vero con `published: true` temporaneo (poi rimesso a `false`): entrambe le
varianti, il cambio di orario e il fallback di prezzo sul giro di 3 ore funzionano.
Quando arrivano i dati mancanti, aggiornare la scheda, aggiungere la foto e mettere
`published: true`.

### Ragnarok, prezzi e orari veri (30 agosto 2026)

Arrivati dall'ufficio i dati mancanti, e sono molto diversi dal segnaposto messo prima:
i due giri non condividono ne' gli orari ne' i giorni.

- **2 ore**: adulti €25, bambini €20, neonati €5 (non gratis: prima non c'era nessun
  `priceInfant` diverso da zero in tutto il catalogo). Si fa solo **il lunedì**, tre
  partenze: 10:30, 12:30, 14:30.
- **3 ore**: adulti €38, bambini €25, neonati €5. Si fa **martedì, giovedì e sabato**,
  una partenza alle 13:00.

**Deciso col proprietario**: l'orario del giro di 3 ore era arrivato tagliato ("13:"),
confermato 13:00. Le fasce d'età (bambino 4-11, neonato 0-3) valgono su entrambe le
durate, non solo sul giro di 3 ore dove erano scritte.

**Cambiato rispetto alla prima versione**: tolto il `days` in cima alla scheda — i due
giri si fanno in giorni diversi, quindi ora `days` sta solo dentro ciascuna variante,
come previsto dal vocabolario quando "la variante vince". `priceFrom` era 30 (il prezzo
pieno segnato dal fornitore): ora è 25, il prezzo vero più basso fra i due, confermato
dall'ufficio — qui non è più un caso di "non copiare lo sconto del rivenditore", è il
prezzo reale che va sul sito.

**Pubblicata (`published: true`)** anche senza foto, come già successo per flipper-one:
in elenco esce il riquadro grigio, `controlla.js` lo segnala come avviso e basta. Restava
solo la foto da aggiungere, e con prezzi ed età confermati non c'era più motivo di tenerla
nascosta. Provata di nuovo nel browser vero: prezzi, età, giorni e orario di entrambe le
varianti sono corretti, e la scheda compare nell'elenco con il segnaposto "ISLA" al posto
della foto.

### Ragnarok, foto vere e prima mini-galleria del sito (30 agosto 2026)

Arrivate cinque foto vere della barca. Guardate una per una prima di usarle (una barca era
gia' stata scartata in passato perche' portava il marchio di un'altra azienda): nessun logo
di rivenditori o piattaforme di prenotazione, solo il nome "Ragnarok" scritto sulla barca
stessa, che e' il soggetto della foto e non un marchio da evitare. Ridimensionate tutte a
1200×800 come le altre foto barche (`assets/ragnarok.jpg` e `ragnarok-2.jpg` … `-5.jpg`,
100-180 KB l'una).

**La prima foto (il manifesto "Ragnarok — Viking adventure on the Atlantic Ocean") come
foto della card**, per scelta del proprietario. Le altre quattro non stavano da nessuna
parte: fino a oggi ogni scheda aveva **una** foto sola, e in NOTES.md c'e' scritto (28
agosto, Freebird) che una seconda foto della stessa barca era stata cancellata perche'
"non esiste una galleria che possa usarne due".

**Aggiunta la prima mini-galleria del sito**, non solo per Ragnarok: e' un campo nuovo del
vocabolario, `gallery` (facoltativo, un elenco di foto oltre a `image`), quindi qualunque
scheda futura con piu' foto puo' usarla allo stesso modo. Sulla pagina di dettaglio esce
una striscia di miniature sotto la foto grande (`tour.js`, funzioni `detailGallery()` e
`collegaGalleria()`): un tocco su una miniatura cambia la foto grande, senza aprire
un'altra pagina o caricare una libreria di lightbox — resta "niente framework, niente
build".

**Un dettaglio di layout da tablet in su**: la pagina di dettaglio diventa a due colonne
(foto a sinistra, testo a destra) con CSS Grid. Mettere la galleria come terzo elemento
diretto dentro `.detail-tour` l'avrebbe mandata nella colonna sbagliata (la griglia
riempie le celle in ordine, non per tipo). Risolto avvolgendo foto grande e galleria in un
contenitore solo, `.detail-media`, cosi' la griglia li vede come un blocco unico nella
prima colonna.

Provata nel browser vero, a due larghezze: le cinque miniature ci sono, il click cambia la
foto grande e sposta il bordo dorato su quella scelta, e da tablet in su la galleria resta
sotto la foto invece di finire a fianco del testo. La scheda in elenco mostra la foto vera
al posto del riquadro grigio.

### Ragnarok, la galleria allargava tutta la pagina sul telefono (30 agosto 2026)

Segnalato dal proprietario: aprendo la scheda Ragnarok da telefono, la pagina si apriva un
po' più larga dello schermo e bisognava allargare le dita per stringerla di nuovo (lo zoom
iniziale non era a 1:1). Non successo su nessun'altra scheda, solo su questa: e' la prima
con la galleria.

**La causa non si vedeva scorrendo la pagina** (le miniature scorrevano bene, sembrava
tutto a posto): il telefono allarga **tutta** la finestra, non solo la striscia delle foto.
Riprodotto con Playwright su una larghezza vera da telefono (320px, iPhone SE): la pagina
si apriva a 452px anche con `<meta name="viewport" content="width=device-width">`. La
causa era `.detail-gallery`: cinque miniature a larghezza fissa che non si restringono
(giusto, altrimenti la foto si schiaccia) dentro un contenitore con `overflow-x: auto` —
ma **`overflow-x: auto` da solo non basta**: il browser dei telefoni calcola comunque
quanto spazio servirebbe alle miniature *senza* scorrimento, e se serve piu' spazio del
telefono allarga tutta la pagina per non "spezzare" niente. Riprodotto anche il contrario:
rimpicciolendo le miniature a 1rem il problema spariva, a conferma che era proprio la loro
larghezza a spingere fuori la pagina.

**La correzione** e' su `.detail-gallery` in `styles.css`: `width: 0` insieme a
`min-width: 100%` (con `box-sizing: border-box`) invece di lasciare la larghezza `auto`.
Cosi' il contenitore prende sempre esattamente lo spazio disponibile, mai di piu', e le
miniature che non ci stanno scorrono **dentro** la striscia invece di allargare la pagina
intorno a lei. Verificato con lo stesso test automatico (la finestra ora si apre a 320px,
non piu' a 452) e a occhio, su telefono e su desktop: le miniature scorrono ancora, il
click cambia la foto grande come prima, il layout a due colonne da tablet in su non e'
cambiato.

Vale la pena ricordarlo se si aggiunge un'altra striscia di elementi a scorrimento
orizzontale (tipo di questa galleria) in futuro: `overflow-x: auto` senza `width: 0` +
`min-width: 100%` (o un equivalente che dia una larghezza definita invece di lasciarla
"auto") puo' rifare lo stesso scherzo sul telefono, anche se sul desktop sembra perfetto.

### Freebird: la seconda mini-galleria del sito, e un segnaposto per chi non ha foto (30 agosto 2026)

Arrivate quattro foto vere del Freebird dal proprietario. Guardate una per una (vale la
stessa regola di Ragnarok): tutte e quattro mostrano barche della flotta Freebird — quella
gialla "Freebird Gold" del manifesto e delle vele "España", e quella rossa/bianca "F13"
con la scritta FREEBIRD grande sullo scafo — nessun marchio di un altro operatore. **Una
delle quattro e' stata scartata**: 424×280, troppo piccola per arrivare a 1200×800 senza
sgranarsi. Restano tre, salvate come `assets/freebird-2.jpg` … `-4.jpg` (150-210 KB,
stesso ritaglio al centro e ridimensionamento delle foto barche).

**La foto della card resta quella di prima** (`catamaran-gigantes-masca.jpg`, il giro
lungo verso Los Gigantes), le tre nuove vanno nel campo `gallery` — lo stesso campo
aggiunto ieri per Ragnarok, qui usato per la seconda volta. Nessuna modifica al codice
della galleria: `detailGallery()` e il CSS di `.detail-gallery` in `tour.js`/`styles.css`
sono generici, bastava valorizzare il campo nel catalogo.

**Aggiunto anche un segnaposto vero per le schede senza foto**, al posto della scritta
"Isla" che c'era finora (in `escursioni.js`, `tour.js` — sia la foto grande che la
miniatura nelle "altre esperienze" — tutti e tre i posti che disegnano
`.tour-media-empty`). Ora dice "Foto in arrivo" (nuova chiave i18n `tour.photoSoon`,
tradotta anche in inglese e spagnolo), cosi' chi vede la scheda capisce che manca la foto
e non pensa a un errore. Il CSS di `.tour-media-empty` e' stato addolcito (meno spaziatura
fra le lettere, testo centrato, puo' andare a capo) perche' il testo nuovo e' piu' lungo
di "Isla" e prima sarebbe uscito dal riquadro sulle card piu' strette. Provato su
flipper-one (l'unica scheda pubblicata senza foto) in elenco e nel dettaglio.

Non toccato il riquadro grigio in se': resta lo stesso spazio, cambia solo la scritta
dentro.

### Royal Delfin: terza mini-galleria del sito (30 agosto 2026)

Arrivate quattro foto del Royal Delfin. Guardate una per una: tre mostrano chiaramente il
nome "Royal Delfin" sullo scafo e il logo del fornitore (nessun marchio di un altro
operatore), la quarta era la grafica delle finestre subacquee con tartaruga e delfini —
**scartata**, sia perche' troppo piccola (720×719, da ingrandire 1,67× per arrivare a
1200×800) sia perche' sembra un'illustrazione/grafica da marketing generica piu' che una
foto vera della barca: meglio non rischiare di pubblicare qualcosa che non e' certamente
il Royal Delfin.

Le tre buone sono salvate come `assets/royal-delfin-2.jpg` … `-4.jpg` (133-203 KB, stesso
ritaglio al centro e ridimensionamento a 1200×800 delle altre foto barche). La foto della
card resta quella di prima (`royal-delfin.jpg`), le tre nuove vanno nel campo `gallery` —
nessuna modifica al codice, come per Ragnarok e Freebird. Provato in `tour.html`: foto
grande più quattro miniature cliccabili, tutte caricate correttamente.

### "Altre esperienze" in fondo alla scheda: ora da categorie diverse (30 agosto 2026)

Chiesto dal proprietario: la sezione in fondo a `tour.html` mostrava tre schede della
**stessa** categoria di quella aperta. Cambiata per mostrare il resto del catalogo invece
di ripetere la stessa famiglia di gite — chi guarda una barca ha già visto le altre barche
nell'elenco della categoria, qui serve fargli scoprire cos'altro c'è.

`detailRelated()` in `tour.js` ora scarta la categoria della scheda aperta **e** si ferma
alla prima scheda trovata per ogni altra categoria, cosi' le tre proposte sono sempre di
tre categorie diverse fra loro invece di poter essere, per caso, tre barche di un'unica
altra categoria. Provato aprendo una scheda `mare-barche` (Royal Delfin, Ragnarok) e una
`teide-natura`: risultati sempre di categorie diverse dalla propria e diverse tra loro.

Il titolo della sezione (`detail.related` in `i18n.js`) diceva "Altre esperienze di questa
categoria": non ha più senso, cambiato in "Altre esperienze da scoprire" nelle tre lingue.

### Peter Pan: mini-galleria (30 agosto 2026)

Arrivate quattro foto di Peter Pan. Guardate una per una:

- prua/porto e quella con i globicefali in primo piano mostrano chiaramente il nome
  "Peter Pan" sullo scafo — **tenute**;
- una era quasi identica alla foto già pubblicata (stessa inquadratura, qualità peggiore)
  — **scartata**, inutile duplicarla;
- una mostrava un gruppo che nuota sotto una falesia (Los Gigantes), ma lo scafo è di
  legno naturale, non rosso bordeaux come Peter Pan, e non si legge nessun nome —
  probabilmente **un'altra barca**. Scartata anche per questo: la scheda dice già che sul
  giro di 2 ore il bagno non c'è, quindi pubblicarla avrebbe comunque promesso qualcosa
  che non c'è, a prescindere da quale barca sia davvero.

Le due buone sono salvate come `assets/peter-pan-2.jpg` e `-3.jpg` (1200×800, 175-180 KB,
stesso ritaglio al centro delle altre foto barche). La foto della card resta quella di
prima (`peter-pan.jpg`), le due nuove vanno nel campo `gallery`. Provato in `tour.html`:
foto grande più due miniature cliccabili, caricate correttamente.

### Flipper One: arrivate le foto, sparito il riquadro grigio (31 agosto 2026)

Era l'unica scheda pubblicata senza foto (vedi la sezione più sopra sul segnaposto "Foto
in arrivo"). Arrivate cinque foto della barca. Guardate una per una:

- quattro sono foto vere della barca (vela spiegata con i delfini e il Teide sullo
  sfondo, il tuffo con la teleferica visto dal ponte, il profilo mentre naviga, il tuffo
  visto dal basso con le scogliere di Los Gigantes) — **tenute**;
- una era una grafica promozionale con il logo "Flipper Uno Los Gigantes" sovrapposto in
  un angolo e la scritta "Free Trial" (di uno strumento di editing) in altri due angoli —
  **scartata**: non è la foto in sé ma un'immagine con marchio/filigrana sopra.

Le quattro buone sono salvate come `assets/flipper-one.jpg` (foto della card e apertura
scheda) e `assets/flipper-one-2.jpg` … `-4.jpg` (galleria), 1200×800, 118-229 KB, stesso
ritaglio al centro delle altre foto barche. La più piccola in origine (quella del tuffo
dal basso, 718×603) ha richiesto un ingrandimento di 1,67×: meno del limite già scartato
altrove (2,84× su una foto di 424×280), e a schermo resta nitida.

`controlla.js` non segnala più l'avviso su flipper-one. Provato in `tour.html` (foto
grande più tre miniature cliccabili) e nell'elenco (niente più riquadro grigio, la card
mostra la prima foto). Alzato `CACHE_NAME` in `sw.js` a `isla-v151`.

### Submarine Safari: galleria, e due foto scartate perché di un'altra barca (31 agosto 2026)

Arrivate quattro foto per `submarine-safari` (Marina Amarilla). Guardate una per una, **non
sono tutte lo stesso sottomarino**:

- due mostrano il sottomarino giallo con lo scafo rosso e la scritta "Sub Fun Cinco" sulla
  torretta — stessa livrea, stesso logo rotondo blu e stesso stile della foto già
  pubblicata (`submarine-safari.jpg`, che ha anche la sigla "6 AT-3-02-91" sullo scafo).
  Una delle due ha il Teide bene in vista sullo sfondo, che conferma Tenerife. — **tenute**;
- una mostra un sottomarino con lo scafo **arancione** (non rosso) e il logo "Atlantida
  Submarine" sulla torretta, ormeggiato in un porto con case bianche a terrazza su una
  parete di roccia — quello è Puerto de Mogán, a **Gran Canaria**, non Tenerife: un'altra
  azienda, su un'altra isola. **Scartata**, altrimenti la scheda avrebbe mostrato il
  sottomarino sbagliato;
- una è una foto subacquea generica (pesci, un sommozzatore, oblò) senza nessun elemento
  che dica di quale sottomarino si tratta — poteva essere di uno dei due. **Scartata**
  anche questa, per lo stesso motivo: meglio una galleria di due foto sicure che di tre
  con una incerta in mezzo.

Le due buone sono salvate come `assets/submarine-safari-2.jpg` e `-3.jpg` (1200×800,
144-206 KB). La seconda partiva da una foto piccola (589×392, quasi già nel rapporto
giusto) e ha richiesto un ingrandimento di 2×: guardata a schermo dopo il ridimensionamento
resta nitida, tenuta. La foto della card resta quella di prima (`submarine-safari.jpg`), le
due nuove vanno nel campo `gallery`. Provato in `tour.html`: foto grande più tre miniature
cliccabili, tutte caricate correttamente. Alzato `CACHE_NAME` in `sw.js` a `isla-v152`.

### Luxury Catamaran Experience: galleria del Monte Cristo (31 agosto 2026)

Il proprietario ha confermato che "Monte Cristo" è il nome della barca dietro la scheda
`luxury-catamaran` (che in catalogo ha ancora `zone` e `duration` "Da definire": quello
resta da fare, qui sono arrivate solo le foto). Arrivate quattro foto: tutte mostrano
chiaramente lo scritto "Monte Cristo" sullo scafo e tre delle quattro anche la sigla di
immatricolazione "6ª TE-1-13-17", identica su tutte — stessa barca della foto già
pubblicata (che ha lo stesso scritto). **Tenute tutte e quattro**.

Salvate come `assets/luxury-catamaran-2.jpg` … `-5.jpg` (1200×800, 138-236 KB, stesso
ritaglio al centro delle altre foto barche). La foto della card resta quella di prima
(`luxury-catamaran.jpg`), le quattro nuove vanno nel campo `gallery`. Provato in
`tour.html`: foto grande più cinque miniature cliccabili, tutte caricate correttamente.
Alzato `CACHE_NAME` in `sw.js` a `isla-v153`.

### Luxury Catamaran Experience: confermati porto e durata (31 agosto 2026)

Il proprietario ha confermato i due dati che restavano "Da definire": si parte da **Puerto
Colón**, dura **3 ore**. Aggiornati `zone` e `duration` nello stesso formato delle altre
schede di categoria `mare-barche`. Provato in `tour.html`: "Departure point" e "Duration"
ora mostrano i valori veri invece del segnaposto. Alzato `CACHE_NAME` in `sw.js` a
`isla-v154`.

### Small Group Catamaran: galleria del Kalima Kat (31 agosto 2026)

Confermato dal proprietario quello che diceva già `NOTES.md`: Kalima Kat è la barca dietro
`small-group-catamaran`, non una barca diversa (era già successo di quasi duplicarla in
passato). Arrivate tre foto: una mostra chiaramente il nome "KALIMAKAT" sullo scafo e la
sigla "6ª TE-1-03-94", identica a quella della foto già pubblicata; le altre due sono
aeree, senza scritte leggibili ma con la stessa forma di barca (catamarano a vela con un
solo albero, cuscini color tortora in coperta) e una delle due nella stessa cala rocciosa
della foto già pubblicata. **Tenute tutte e tre**.

Salvate come `assets/small-group-catamaran-2.jpg` … `-4.jpg` (1200×800, 137-209 KB, stesso
ritaglio al centro delle altre foto barche). La foto della card resta quella di prima
(`small-group-catamaran.jpg`), le tre nuove vanno nel campo `gallery`. Provato in
`tour.html`: foto grande più quattro miniature cliccabili, tutte caricate correttamente.
Alzato `CACHE_NAME` in `sw.js` a `isla-v155`.

### Glass Bottom Boat Adventure: galleria della Diamant (31 agosto 2026)

Confermato dal proprietario che la Diamant (nome che compariva solo in `NOTES.md` fra le
barche vere degli operatori, riga ~1728) è la barca dietro `glass-bottom-boat`. Non era un
dubbio da controllare: la foto della card già pubblicata mostra chiaramente "DIAMANT"
sullo scafo, quindi non c'era nessun doppione da correggere — solo altre foto della stessa
barca da aggiungere.

Arrivate tre foto: una vista dall'oblò subacqueo (corallo e pesci) e due foto esterne
della Diamant, con "DIAMANT" e i numeri di telefono dell'armatore (Omega Group S.L.)
leggibili sullo scafo. Una delle tre, 300×300, era troppo piccola per arrivare a 1200×800
senza sgranarsi (sotto la soglia già scartata una volta, 424×280) — **scartata**. Le altre
due (600×600 e 1200×806) sono state ritagliate al centro e salvate come
`assets/glass-bottom-boat-2.jpg` e `-3.jpg` (1200×800, 90-125 KB). La foto della card
resta quella di prima (`glass-bottom-boat.jpg`), le due nuove vanno nel campo `gallery`.
Provato in `tour.html`: foto grande più tre miniature cliccabili, tutte caricate
correttamente. Alzato `CACHE_NAME` in `sw.js` a `isla-v156`.

### Utopia Boat Party: una foto in più (31 agosto 2026)

Arrivata una foto della festa a bordo (640×427, coerente col rapporto 3:2): stessa
goletta in legno a due alberi della foto già pubblicata, dove si legge "UTOPIA" sullo
striscione a poppa — nessun dubbio di doppione, solo un'altra foto della stessa barca.

Ritagliata al centro e salvata come `assets/party-boat-2.jpg` (1200×800, 219 KB); la
qualità regge nonostante l'ingrandimento da 640×427. La foto della card resta
`party-boat.jpg`, la nuova va nel campo `gallery`. Provato in `tour.html`: foto grande più
due miniature cliccabili, caricate correttamente. Alzato `CACHE_NAME` in `sw.js` a
`isla-v157`.

### Shogun: due foto in più (31 agosto 2026)

Arrivate tre foto della Shogun. Una (870×580, vele bianche viste da poppavia, scogliere di
Los Gigantes sullo sfondo) è la stessa inquadratura già usata per la card pubblicata —
niente di nuovo lì, tenuta com'era. Le altre due sono nuove: una con le vele rosse issate e
alcuni bagnanti in acqua accanto allo scafo (1280×720), l'altra con le vele bianche issate
e "SHOGUN" leggibile sullo scafo (900×600) — stessa barca, nessun dubbio di doppione, solo
la sua livrea.

Ritagliate al centro e salvate come `assets/shogun-2.jpg` e `-3.jpg` (1200×800, 123-163
KB). La foto della card resta `shogun.jpg`, le due nuove vanno nel campo `gallery`.
Provato in `tour.html`: foto grande più tre miniature cliccabili, tutte caricate
correttamente. Alzato `CACHE_NAME` in `sw.js` a `isla-v158`.

### Opera 60: sostituita la foto della card (31 agosto 2026)

La foto pubblicata finora (bandiera greca sul T-top, sfondo che sembra Santorini) non era
il nostro gommone: era una foto stock, non la barca vera che parte da Puerto Colón.
Arrivate tre foto vere, tutte con la stessa sigla sullo scafo ("SA 3814D"): una aerea con
bagnanti in acqua (750×750), una di profilo con il gruppo a bordo e bandiera italiana
(1885×1257, già 3:2) e una vicino a una scogliera vulcanica (1333×750). Il proprietario ha
scelto l'aerea come foto della card.

Ritagliate al centro e salvate come `assets/opera-60.jpg` (sostituita), `-2.jpg` e `-3.jpg`
(1200×800, 96-160 KB — l'aerea era 750×750, quindi ingrandita di 1,6× nel ritaglio, ma
regge). Le foto di profilo e alla scogliera vanno nel campo `gallery`. Provato in
`tour.html`: foto grande più tre miniature cliccabili, tutte caricate correttamente.
Alzato `CACHE_NAME` in `sw.js` a `isla-v159`.

### Parchi e spettacoli: zona, durata e orari da canaryvip.com (31 agosto 2026)

Il proprietario ha incollato i dati di 5 biglietti presi da canaryvip.com (Siam Park, Loro
Parque, Aqualand, Jungle Park, Combo Jungle Park + Aqualand): prezzi, orari di apertura,
cosa è incluso, zone di pickup. Aggiornate le schede corrispondenti già in catalogo
(`siam-park`, `loro-parque`, `aqualand`, `jungle-park`, `combo-jungle-aqualand`), che erano
ferme a "Da definire" su zona e durata.

**Cosa è stato preso**: zona (Costa Adeje, Puerto de la Cruz, Chayofa), durata ("Giornata
intera" o "2 giorni, 1 per parco" per il combo), orari di apertura (in `notes`, sono un
fatto pratico per il cliente), e `included: ["transfer"]` per la navetta gratuita già
compresa nel biglietto standard. Per Siam Park aggiunto anche un `transfer` testuale per il
servizio opzionale da Puerto de la Cruz (a pagamento, non incluso), senza prezzo perché la
pagina del fornitore non lo scriveva.

**Cosa NON è stato copiato**, per le regole di `CLAUDE.md`: politica di cancellazione (resta
quella di Isla, 24 ore, non le 72 ore del fornitore), punteggi e numero di recensioni,
"ingresso rapido per i titolari di pass" e altro testo promozionale, i prezzi barrati.

**Prezzi — deciso col proprietario, da tenere d'occhio**: la pagina del fornitore mostrava
il banner "prezzi scontati natalizi ora applicati", quindi i valori raccolti (Siam Park e
Loro Parque €44, Aqualand €36, Jungle Park €35, Combo €51) potrebbero essere uno sconto
temporaneo e non il prezzo pieno. Il proprietario ha scelto comunque di usarli come
`priceFrom`: **da riconfermare più avanti** quando lo sconto natalizio finisce, per capire
se il prezzo pieno è diverso.

**Non toccato**: `priceAdult`/`priceChild` restano a 0 (il fornitore non dava un prezzo
bambini separato, `child_price` era `null` per tutti e cinque) — sulla pagina restano le
righe del totale nascoste finché non arriva quel dato. Le fasce d'età (`ages`) restano
assenti per lo stesso motivo. `siam-night` e `twin-ticket` non sono nei dati ricevuti e
restano invariate.

Provato in `tour.html` (Siam Park e Combo Jungle Park + Aqualand): zona, durata, prezzo,
pillola "Transfer disponibile", riquadro "Cosa è incluso" e note sugli orari mostrano tutti
i valori nuovi. Alzato `CACHE_NAME` in `sw.js` a `isla-v161`.

Prima di arrivare a questo punto il repository locale era rimasto indietro di 177 commit
rispetto a GitHub (l'ultimo sviluppo era stato fatto da un altro dispositivo/sessione): un
primo tentativo di aggiornare le schede era stato fatto sulla versione vecchia del file,
poi scartato non appena il `git pull` ha mostrato lo schema vero.

### Foto vere per il 3-Hour Whale & Dolphin Boat Trip (31 agosto 2026)

La scheda usava `Cat-mare.jpg`, la stessa foto generica della copertina categoria "Mare e
barche" — non una foto sua. Arrivate 6 foto della barca vera (uno sloop Beneteau, targa
6ª-TE-21-07, coerente con la descrizione "barca a vela, massimo 11 persone").

**Scartata una delle sei**: aveva il logo "dentsu AEGIS network" stampato sulla vela — il
marchio di un'altra azienda (sponsor di qualche regata/evento), non nostro. Stesso motivo
per cui in passato si era scartata una foto con lo scafo di un'altra azienda: non si
pubblica.

**Foto principale**: quella in porto con la randa alzata e le montagne di Costa Adeje
dietro — è già 1280×853, quasi esattamente 1200×800, nessun ingrandimento vero. Le altre
quattro in `gallery`, compresa quella con il Teide innevato sullo sfondo (bella, anche se
ingrandita 1,78×: guardata a piena pagina regge lo stesso).

Provato nel browser vero: 5 foto in galleria (principale + 4), tutte cariche. `node
controlla.js` → 0 errori. Alzato `sw.js` a `isla-v164`.

### Siam Park: due tipi di biglietto e due transfer a pagamento (31 agosto 2026)

Il proprietario ha incollato i dati del modulo di prenotazione vero (non più solo
canaryvip.com): due tipi di biglietto (normale €44, tutto compreso €165) e due transfer a
pagamento con prezzi propri per persona, da due zone diverse (Tenerife Nord; Los Gigantes /
Callao Salvaje / Playa Paraíso).

**Prezzo base**: `priceAdult: 44`, `priceChild: 32`, `priceInfant: 0` (neonati gratis in
tutte le sezioni del modulo). Fasce d'età non date dai nuovi dati: usate quelle del Twin
Ticket e di Loro Parque, `12+` / `3-11` / `0-2`, per coerenza col resto del catalogo —
**deciso col proprietario**.

**I due tipi di biglietto**, come le varianti di un tour (`options`, sullo stesso modello di
Freebird): "Biglietti normali" (uguale al prezzo base) e "Biglietti tutto compreso" (€165,
Fast Pass illimitato, armadietto, asciugamano — icona `towels` — e All Inclusive con alcolici).
**Manca il prezzo bambini del tutto compreso**: il modulo non lo dava, solo quello
dell'adulto. Niente `priceChild` per quella variante finché non arriva: la riga bambini e il
totale restano nascosti se il cliente ne mette uno, invece di inventare un numero — **da
chiedere all'ufficio**.

**Il prezzo estivo (luglio/agosto)** non ha un campo suo nel catalogo: 44€→48€ e 165€→169€
restano scritti in `notes`, non nel prezzo mostrato — **deciso col proprietario**, che ha
scelto di non costruire una logica di prezzo stagionale per questa volta.

**I due transfer**: il campo `transfer`/`transferPrice` esistente (già "da Puerto de la
Cruz", cioè Tenerife Nord) è diventato quello con prezzo vero (+25€ adulto, +21€ bambino →
€69/€53 col biglietto normale). Il secondo transfer (Los Gigantes, Callao Salvaje, Playa
Paraíso, +15€/+10€) riusa `transferSiam`/`transferSiamPrice`, finora esistenti solo sul Twin
Ticket. **Generalizzato il meccanismo**, come chiesto dal proprietario invece di riadattare
qualcosa di specifico al Twin Ticket: aggiunti i campi opzionali `transferLabel` e
`transferSiamLabel` (in `esplora-catalog.js`, `escursioni.js`, `escursioni.html`, `tour.html`,
`tour.js`, `lista.js`, `controlla.js`) che sostituiscono il testo fisso della domanda nella
finestra di richiesta quando due transfer sulla stessa scheda non sono "per il Siam Park" ma
per due zone di partenza qualsiasi. Il Twin Ticket continua a funzionare come prima, senza
modifiche ai suoi dati.

**Trovato e corretto un bug mentre si provava**: `prezziAPersona()` in `escursioni.js`
sommava il prezzo del transfer come importo fisso a livello di scheda (`tour.transferPrice`),
ignorando la variante scelta. Con "Biglietti tutto compreso" selezionato e un transfer
spuntato il totale sarebbe uscito sul prezzo del biglietto normale (es. €69) invece che su
quello vero (€165+25=€190). Riscritta la funzione per calcolare il supplemento del transfer
rispetto al prezzo base della scheda e sommarlo al prezzo della variante scelta: stesso
risultato di prima ovunque il prezzo di variante coincide col prezzo scheda (compreso il Twin
Ticket, verificato a mano), corretto anche quando non coincide.

Provato nel browser vero (`tour.html?id=siam-park`): le due varianti nei bottoni, le due
domande di transfer col testo giusto (zona, non "Siam Park"), i totali di entrambe le
combinazioni transfer × variante corretti a mano (69/53, 59/42, 190/—, 180/—), e il totale
che sparisce invece di mostrare un numero falso quando si mettono bambini sul biglietto tutto
compreso. `node controlla.js` → 0 errori. Alzato `sw.js` a `isla-v165`.

### Twin Ticket: stesso problema, stessa etichetta (31 agosto 2026)

Il proprietario ha visto la finestra di richiesta del **Twin Ticket** (non di Siam Park) e
l'ha trovata confusionaria: "Vuoi il transfer?" non dice ne' la zona ne' il parco, e "Vuoi
il transfer per il Siam Park?" ripete "Siam Park" come se fosse l'unico dei due a riguardarlo.
Il meccanismo `transferLabel`/`transferSiamLabel` costruito per Siam Park serviva esattamente
a questo: aggiunte le due etichette al Twin Ticket, riprendendo la stessa coppia
zona/parco gia' scritta in `transferPriceLabel`/`transferSiamPriceLabel` sulla pagina di
dettaglio ("Transfer Loro Parque (da sud)" → "Vuoi il transfer da sud per Loro Parque?",
"Transfer Siam Park (da nord)" → "Vuoi il transfer da nord per Siam Park?"). Nessun'altra
modifica al codice: il campo esisteva gia'.

Provato nel browser vero (`tour.html?id=twin-ticket`): le due domande si leggono ora chiare,
i totali restano quelli di sempre (€78 base, €99 con transfer sud, €103 con transfer nord).
`node controlla.js` → 0 errori. Alzato `sw.js` a `isla-v166`.

### Siam Park: Cabina, Casa e Villa VIP da canaryvip.com (31 agosto 2026)

Il proprietario ha incollato i dati di tre prodotti VIP di Siam Park presi da
canaryvip.com (Cabina, Casa, Villa), chiedendo di aggiungerli "come se fossero tour" — cioe'
come altre varianti dentro lo stesso `options` di Siam Park, sullo stesso modello del
biglietto tutto compreso fatto in precedenza.

**Prezzo**: sono forfettari per lo spazio (non a persona), con un numero di ospiti incluso e
un sovrapprezzo per ospite oltre quel numero (151€, fino a un tetto). Il fornitore stesso
segnalava un dato incerto — due prezzi diversi per ogni prodotto, quello dell'intestazione e
quello citato nel corpo del testo (Cabina 660/610, Casa 990/910, Villa 1320/1215), marcati
"da verificare" sulla sua stessa pagina. **Tenuto il prezzo piu' alto** (660/990/1320): si puo'
sempre abbassare dopo, alzarlo dopo che il cliente l'ha letto e' la cosa che fa arrabbiare —
regola di CLAUDE.md, **da riconfermare con l'ufficio**.

**Cosa NON e' stato copiato**: la politica di cancellazione del fornitore (a scaglioni,
30/7 giorni) — resta quella di Isla, 24 ore; punteggi e numero di recensioni.

**Il costo per ospite extra resta scritto in `desc`**, non in un campo di prezzo: le tre
varianti hanno `price` (forfettario, sul bottone) ma niente `priceAdult`/`priceChild` apposta,
cosi' il totale automatico della finestra di richiesta non si fa (darebbe un numero a
persona che non ha senso su un prezzo a spazio). Il catalogo ha gia' un campo per i prezzi a
scaglioni di persone (`priceTiers`, usato su Private Charter) ma **solo a livello di scheda,
non di singola variante** — servirebbe toccare il codice per collegarlo a una variante, non
fatto qui per restare dentro la richiesta.

**Bug trovato mentre si provava, stesso tipo del precedente**: sia `prezziAPersona()` in
`escursioni.js` sia `detailRows()` in `tour.js` ricadevano sul prezzo a persona **della
scheda** (44€/32€) quando la variante scelta non aveva il suo `priceAdult` — corretto per il
tutto compreso di Siam Park (che ce l'ha sull'adulto), sbagliato per una variante che il
prezzo a persona apposta non ce l'ha mai, come le tre VIP: selezionando "Cabina VIP" la
pagina avrebbe mostrato "Adulti (12+): €44" e la finestra un totale a persona, invece del
prezzo forfettario vero. Sistemato in entrambi i file: il ripiego sul prezzo della scheda
vale solo quando **non c'e' nessuna variante scelta**, mai quando la variante c'e' ma non ha
il suo prezzo a persona. Controllato che non cambi niente per le altre 13 schede del
catalogo che usano `options`: nessun'altra ha il prezzo a persona sulla scheda insieme a
`options` (Siam Park era l'unica), quindi il comportamento vecchio non serviva a nessun'altra
scheda.

**Non aggiunto**: foto per le tre varianti — il catalogo non ha un campo foto per singola
variante (solo `image`/`gallery` a livello di scheda), e le foto del fornitore sono sue,
da valutare se scaricarle e usarle o farsele mandare dall'ufficio. **Anche il transfer a
pagamento (Tenerife Nord / Los Gigantes ecc.) resta visibile nella finestra di richiesta con
tutte e cinque le varianti**, comprese le tre VIP che hanno gia' il bus navetta incluso nel
prezzo: la finestra non sa ancora nascondere il transfer in base alla variante scelta, quindi
un cliente potrebbe spuntarlo per sbaglio su una VIP. Non e' un dato sbagliato (il testo della
variante dice chiaramente che il bus e' incluso), ma **e' un limite da segnalare**, da
sistemare se capita davvero in una richiesta.

Provato nel browser vero (`tour.html?id=siam-park`): le tre nuove varianti nei bottoni con
prezzo giusto, "In breve" mostra solo "Prezzo: €660/990/1320" (niente righe adulti/bambini
inventate), la finestra di richiesta nasconde il totale invece di mostrarne uno falso, le due
varianti di biglietto normale restano invariate. `node controlla.js` → 0 errori. Alzato
`sw.js` a `isla-v167`.

**Confermato dal proprietario**: i prezzi 660/990/1320 sono quelli giusti (non i 610/910/1215
citati nel corpo del testo del fornitore). Il transfer a pagamento resta visibile anche sulle
varianti VIP, cosi' com'e' — nessuna modifica da fare. Niente foto per le tre varianti.
Nessun codice toccato in questo aggiornamento, solo la conferma.

### Loro Parque: due tipi di biglietto e transfer a pagamento (31 agosto 2026)

Stessi dati, stessa forma di Siam Park: biglietti normali (44€/32€, invariati) e biglietti
tutto compreso (132€), come due varianti di `options`. **Il proprietario ha detto
esplicitamente che nel tutto compreso adulti e bambini pagano uguale**: `priceAdult: 132` e
`priceChild: 132` sulla stessa variante, non un errore di battitura. Il tutto compreso
include cappellino, esperienza Loro Explore, posti VIP agli spettacoli e cibo/bevande
illimitati (escluso il Mercato del Gambia, negozi e bazar) — nessuna icona precisa per
cappellino/Loro Explore/posti VIP, restano descritti a testo; usate le icone `drinks` e
`lunch` per il cibo e le bevande illimitate.

**Un solo transfer** (da Tenerife Sud, non due zone come Siam Park): `transfer`/
`transferPrice`, senza `transferPriceLabel` perche' con un solo transfer non serve accorpare
righe. Prezzo pieno col transfer 65€/49€ (44+21, 32+17). Tolto `included: ["transfer"]` dalla
scheda: prima il transfer era "su richiesta" senza prezzo (quindi ambiguo se incluso), ora ha
un prezzo vero ed e' chiaramente un extra a pagamento. La nota del transfer riporta i giorni
diversi per zona di ritiro (tutti i giorni da Costa Adeje/Los Cristianos, lun/mer/gio/sab da
Alcalá/Abama/Los Gigantes, mar/ven da Golf del Sur) — fatto pratico, non testo promozionale,
si puo' scrivere.

**Trovata un'icona sbagliata per il contesto mentre si controllava**: `inc.drinks` diceva
"Bevande a bordo" ("Drinks on board") in `i18n.js` — giusto per una barca, sbagliato per un
parco. Cambiato il testo fisso in "Bevande incluse" ("Drinks included"), generico: controllate
le altre 11 schede che usano la stessa icona (tutte barche), il testo nuovo resta corretto
anche li'. Un'icona vera e propria per "cibo e bevande illimitati in un parco" non serve
crearla apposta: `drinks`+`lunch` gia' esistenti bastano col testo generalizzato.

Fasce d'eta' non date dai nuovi dati: riusate 12+/3-11/0-2, come su Siam Park e Twin Ticket.

Provato nel browser vero (`tour.html?id=loro-parque`): le due varianti nei bottoni, il tutto
compreso con lo stesso prezzo per adulti e bambini, il transfer con supplemento corretto su
entrambe le varianti (65/49 sul normale, 153/149 sul tutto compreso), l'icona "Bevande
incluse" al posto di "Bevande a bordo". `node controlla.js` → 0 errori. Alzato `sw.js` a
`isla-v168`.

### Siam Park e Loro Parque: l'orario al posto di "Giornata intera" (31 agosto 2026)

Il proprietario ha chiesto di togliere "Giornata intera" da `duration` (non dice niente di
utile) mettendo al suo posto l'orario vero, e di togliere l'orario dai `notes` visto che
adesso sta gia' scritto sopra, in "In breve" — due volte la stessa informazione confondeva.

**Siam Park**: `duration` diventa "10:00-18:00 in estate, 10:00-17:00 in inverno" (prima
"Giornata intera"). Tolte le date esatte del cambio stagione (30 marzo, 21 ottobre, ecc.) che
stavano nella nota: per stare corto in "In breve" resta solo l'orario, **da riguardare se
servono anche le date**. Il resto della nota (i due prezzi estivi 48€/169€) resta in
`notes`.

**Loro Parque**: `duration` diventa "09:30-17:30". La nota sugli orari era l'unica che aveva:
tolta, e con lei tolto anche tutto il campo `notes` (vuoto non si scrive).

Provato nel browser vero (`tour.html?id=siam-park` e `loro-parque`): "In breve" mostra
l'orario al posto di "Giornata intera", "Consigli" non ripete piu' l'orario (su Loro Parque
la sezione "Consigli" sparisce del tutto, non essendoci altro). Controllata anche la card
nell'elenco (`escursioni.html`): l'orario ci sta su una riga sola, senza rompere il layout.
`node controlla.js` → 0 errori. Alzato `sw.js` a `isla-v169`.

### Combo Aqualand + Jungle Park: prezzi veri al posto del segnaposto (1 settembre 2026)

`combo-jungle-aqualand` aveva `priceAdult: 0` e `priceChild: 0` (mai compilati), col solo
`priceFrom: 51` a comparire sulla card. Arrivati da una pagina di un rivenditore (CanaryVIP):
adulto 51€, bambino 42€, un terzo prezzo a 21€.

**Non copiati**: la cancellazione a 72 ore (Isla resta a 24, come sempre), "best price
guarantee", punteggio e numero di recensioni, tutto il testo promozionale — la descrizione e'
riscritta da zero nelle tre lingue, con dentro solo i due fatti utili (un giorno per parco,
navetta gratuita) e senza gli orari che stavano gia' in `notes`.

**Deciso senza conferma dell'ufficio**: le fasce d'eta' per il terzo prezzo. La pagina non
le scriveva vicino ai prezzi; l'ufficio ha indicato **12+ / 4-11 / 0-3** (non 3-11/0-2 come
altre schede parchi) — messe cosi' in `ages`, con `priceInfant: 21` (a pagamento, non
gratis: **da riconfermare con l'ufficio se e' davvero cosi'**, la pagina del rivenditore non
lo diceva esplicitamente). Orari (Aqualand 10-17, Jungle Park 10-17:30) e navetta gratuita
confermati uguali a quanto gia' in `notes`/`included`.

Provato nel browser vero (`tour.html?id=combo-jungle-aqualand`): le tre righe prezzo
(Adulti 12+ €51, Bambini 4-11 €42, Neonati 0-3 €21), "Transfer" nel riquadro incluso, "24
ore" nella finestra della richiesta (non 72). Totale verificato a mano nella finestra
richiesta: 2 adulti + 1 bambino → €144 (2×51 + 1×42), coerente con `priceAdult`/`priceChild`
soltanto. `node controlla.js` → 0 errori. Alzato `sw.js` a `isla-v170`.

**Aggiunti i punti di ritiro delle navette, su richiesta del proprietario (1 settembre
2026).** La pagina CanaryVIP elencava fermate e orari precisi per la navetta Aqualand (Los
Cristianos, Playa de las Américas, Costa Adeje, con orari diversi per punto) e per quella
Jungle Park (collegamento diretto da Aqualand). Sono fatti pratici, non pubblicità del
rivenditore, quindi presi e tradotti nelle tre lingue: tre righe nuove in `notes`, con anche
gli orari di ritorno e l'avviso di arrivare 15 minuti prima (i posti si riempiono in ordine
di arrivo). Provato nel browser vero: la sezione "Consigli" resta leggibile anche con tre
paragrafi lunghi, non rompe il layout. `node controlla.js` → 0 errori. Alzato `sw.js` a
`isla-v171`.

### Aqualand (scheda singola): stesso trattamento del combo (1 settembre 2026)

Stessa pagina del rivenditore (CanaryVIP), stavolta per Aqualand da solo. Anche qui
`priceAdult: 0` e `priceChild: 0` erano mai stati compilati. Prezzi veri: adulto 36€,
bambino 29€, "toddler" 16€.

**Fasce d'eta' non ripetute dalla pagina**, come per il combo: riusate le stesse 12+/4-11/0-3
gia' confermate dall'ufficio per il biglietto combinato, trattandosi dello stesso parco.
**Da confermare se valgono anche qui.**

**Aggiunto lo spettacolo dei delfini (15:30, incluso nel biglietto)**, che sulla pagina del
combo non c'era scritto in dettaglio. E i punti di ritiro della navetta, stavolta piu'
completi che sul combo: **la pagina di Aqualand elenca due fermate in piu'** che il combo
aveva fuso in una sola — "Bar Leonardo" (9:45/10:45/11:45) come fermata separata da "Hotel
Best Tenerife" (9:40/10:40/11:40, sul combo erano allo stesso orario), e "Via Llanos de
Troya" (9:50/10:50/11:50) che sul combo non c'era proprio. **Le due pagine dello stesso
rivenditore non concordano fra loro** sulla stessa navetta: presa la versione piu' dettagliata
(quella di Aqualand) per questa scheda. **Da valutare se allineare anche le note del combo**,
non fatto qui per restare nello scopo della richiesta.

Provato nel browser vero (`tour.html?id=aqualand`): le tre righe prezzo, "Transfer" incluso,
le tre note leggibili senza rompere il layout, "24 ore" nella finestra della richiesta.
Totale verificato: 2 adulti + 1 bambino → €101 (2×36 + 1×29). `node controlla.js` → 0 errori.
Alzato `sw.js` a `isla-v172`.

### Jungle Park (scheda singola): stesso trattamento (1 settembre 2026)

Terza pagina dello stesso rivenditore (CanaryVIP), stavolta Jungle Park da solo. Stesso
schema delle due precedenti: `priceAdult`/`priceChild` erano a `0`. Prezzi veri: adulto 35€,
bambino 29€, toddler 16€.

**Fasce d'eta' di nuovo riusate** (12+/4-11/0-3), non scritte su questa pagina — stesso
avviso delle altre due: **da riconfermare**.

**Aggiunti i due spettacoli** (leoni marini 13:30, rapaci 12:30, entrambi inclusi) e i punti
di ritiro della navetta.

**Terza versione della stessa navetta, e stavolta e' ancora diversa dalle altre due.** Non
solo tempi: cambiano anche le fermate. Questa pagina ha "Hotel Allsun Hibiscos" che non
compare ne' sul combo ne' su Aqualand, e i minuti di Bar Leonardo/Hotel Best/Pasarela non
coincidono con la pagina Aqualand (che a sua volta non coincideva col combo). **Non e' un
errore di trascrizione: sono tre pagine del rivenditore che descrivono lo stesso servizio in
tre modi leggermente diversi.** Presa la versione della pagina Jungle Park per questa scheda,
quella della pagina Aqualand per la scheda Aqualand, quella del combo per il combo — ognuna
riporta la sua fonte, senza mescolarle. **Segnalato per la terza volta: se l'ufficio ha
l'orario vero della navetta, conviene sostituire tutte e tre le versioni con quello.**

Provato nel browser vero (`tour.html?id=jungle-park`): le tre righe prezzo, note leggibili,
"24 ore" nella richiesta. Totale verificato: 2 adulti + 1 bambino → €99 (2×35 + 1×29).
`node controlla.js` → 0 errori. Alzato `sw.js` a `isla-v173`.

### Spettacoli serali: le quattro schede ferme a "Da definire" da canaryvip.com, più Gladiux nuovo (1 settembre 2026)

Arrivati da canaryvip.com i dati di 5 spettacoli serali. Quattro corrispondevano a schede
già in catalogo, ancora sui campi segnaposto messi mesi fa (`castillo-san-miguel`,
`flamenco-show`, `scandal-dinner-show`, `history-music-show`); il quinto (Gladiux) non
esisteva — controllato prima nella categoria `parchi-spettacoli` che non fosse un doppione
di uno degli altri quattro (prezzo, zona, giorni tutti diversi), poi creato come
`gladiux-show`. **Il proprietario aveva scritto "gladiuxkl" come nome della scheda nuova**:
tenuto come titolo/testo, ma per l'id ho usato `gladiux-show` per restare sullo stesso
schema `nome-show` delle altre quattro (gli id finiscono negli URL `tour.html?id=...`) —
**da confermare, va rinominato se "gladiuxkl" doveva essere l'id vero**.

**Anche stavolta la pagina del fornitore aveva il banner "prezzi scontati natalizi ora
applicati"** (la stessa frase già vista per Siam Park/Aqualand/Loro Parque ad agosto):
usati comunque i prezzi come `priceFrom`, **da riconfermare quando lo sconto finisce**,
stessa scelta già fatta col proprietario per quel caso.

**Castillo San Miguel**: `priceFrom` 44€ → 50€ (il fornitore dava 49,50€; nessun'altra
scheda del catalogo usa prezzi coi decimali, arrotondato per eccesso per non rischiare di
far pagare meno del dovuto — **da riconfermare**). Aggiunti `days: ["mar","gio","sab"]`
(prima mancava, quindi la pagina mostrava "tutti i giorni", sbagliato), `times: ["19:00"]`,
`zone: "San Miguel de Abona"` (prima "Da definire"), `included: ["lunch","drinks"]` per il
banchetto e le bevande, e un `transfer` testuale senza prezzo (il fornitore parla di navetta
opzionale ma non dice quanto costa). Nelle note: distanza da Costa Adeje, apertura porte,
parcheggio, menu vegetariano/bambini su richiesta, e l'esistenza di un pacchetto VIP senza
prezzo pubblicato (ingresso prioritario, cava, posti premium) — segnalato ma non prezzato.

**¡Olé! Flamenco Show**: qui il prezzo "da" del fornitore (51€) **non tornava** con i due
prezzi di categoria che stavano nel corpo della pagina (Gold 49€, Platinum 59€ — 51 sta in
mezzo, ma è più basso del Gold): il fornitore stesso segnalava la cosa come da riconciliare.
Invece di scegliere alla cieca uno dei tre numeri, ho usato Gold e Platinum come due
`options` (stesso meccanismo del biglietto normale/tutto compreso di Siam Park): prezzo
sulla scheda preso dal più basso (Gold, 49€). Platinum include un bicchiere di vino e
snack (`included: ["drinks","snack"]` sulla variante). **Deciso da solo, senza conferma
dell'ufficio: da rivedere se i tre numeri del fornitore vanno intesi diversamente.**
Corretta anche la durata, che era sbagliata: la scheda diceva "1 ora e 30" ma il fornitore
dà "≈ 2h" → aggiornata a "2 ore". Aggiunti `days: ["gio"]` (era senza, quindi "tutti i
giorni", sbagliato — lo spettacolo è solo il giovedì) e `times: ["20:15"]`. Note aggiunte:
dress code, parcheggio al CC Plaza del Duque.

**Scandal Dinner Show**: `priceFrom` era `null` ("Su richiesta"), ora 94€ (il "da" del
fornitore) — **la pagina del fornitore dice esplicitamente che i prezzi variano per
stagione e categoria e vanno letti da un modulo di prenotazione in tempo reale**, quindi
94€ è solo indicativo: **da riconfermare con l'ufficio più di ogni altro prezzo preso
oggi**. `days: ["sab"]` e `times: ["20:30"]` aggiunti (era senza giorni, "tutti i giorni"
sbagliato: è solo il sabato). Durata corretta da "Serata" a "3 ore" (doors 20:00, inizio
20:30, fine 23:30). Aggiunto `transfer` testuale (navette dai punti indicati dal fornitore,
prezzo su richiesta) e tre note: chiusura porte alle 20:30 (fatto pratico, non la nostra
cancellazione — quella resta a 24 ore), dress code, menu vegetariano/vegano/senza glutine e
preavviso allergie. **Non presi**: nomi dei presentatori (testo da locandina, non un fatto
utile alla prenotazione), pacchetti per gruppi privati 30-150 persone con add-on (fuori
scopo per questo aggiornamento).

**History – The Evolution of Music**: prezzo già a 49€, invariato. Corretta la durata, che
era sbagliata: la scheda diceva "2 ore e 30" ma il fornitore dà 2h15m → aggiornata. `zone`
da "Pirámide de Arona" (nome della sede, non della zona) a "Playa de las Américas" (l'area
vera secondo il fornitore); il nome della sede è finito in una nota. Aggiunti
`days: ["sab"]` (era senza — è solo il sabato) e `times: ["21:00"]`. Note su apertura
porte, posti non assegnati, parcheggio, dress code.

**Nessuna delle quattro usa il campo `languages`**, anche se il fornitore segnala la lingua
dello spettacolo (inglese, per tre su quattro): quel campo fa comparire "In che lingua?"
nella finestra della richiesta, cioè una scelta per il cliente, e qui non è una scelta — lo
spettacolo è in inglese e basta. Scritto invece come nota ("Spettacolo in inglese.") dove il
fornitore lo segnalava.

**Gladiux Show (nuova, `gladiux-show`)**: gladiatori a cavallo, mercoledì e sabato
(`days: ["mer","sab"]`), 19:30 (`times: ["19:30"]`). `priceFrom: 35`, stesso avviso sconto
natalizio delle altre. **Durata "≈ 1 ora e 30" dedotta** dagli orari 19:30-21:00: il
fornitore stesso dice di non averla dichiarata esplicitamente, quindi è scritta col "≈" e
segnalata qui come da confermare. **La cena è inclusa solo il sabato** (grigliata + vino,
sangria, birra, bibite e acqua); il mercoledì è solo lo spettacolo, con un menu à la carte
pagato a parte — spiegato in `desc`, non messo nel riquadro "Cosa è incluso" perché quel
riquadro vale per tutte le partenze e qui non sarebbe stato vero il mercoledì. `family: true`
deciso per somiglianza con Castillo San Miguel (stesso tipo di spettacolo per famiglie, niente
segnali di contenuto per adulti come Scandal) — **il fornitore non lo dice, da confermare**.

**Niente foto**: la pagina del fornitore ha una sua immagine, ma è di un rivenditore
concorrente (CanaryVIP), non del fornitore originale né di Admiral — stessa scelta già fatta
per le VIP di Siam Park, non scaricata. `image: ""` e **`published: false`**, come le altre
schede senza foto in catalogo (`paisaje-lunar`, `canyoning`, ecc.): la scheda esiste già
pronta ma resta invisibile ai clienti finché non arriva una foto vera, dall'ufficio o dal
fornitore diretto.

**Non copiato da nessuna delle cinque pagine**, per le regole di `CLAUDE.md`: le politiche di
cancellazione dei fornitori (24/48/72 ore secondo lo spettacolo — Isla resta sempre a 24
ore), punteggi e numero di recensioni, "best price guarantee" e testo promozionale. Le
descrizioni esistenti non sono state toccate (erano già scritte da zero, non dal
fornitore); quella di Gladiux è nuova, scritta da zero.

Provato nel browser vero le quattro schede aggiornate (`tour.html?id=castillo-san-miguel`,
`flamenco-show`, `scandal-dinner-show`, `history-music-show`): zona, durata, giorni, orari,
prezzo, transfer/incluso e note tutti a posto, "24 ore" nella finestra della richiesta su
tutte. La scheda Gladiux provata pubblicandola temporaneamente (`published: true`) solo per
il test, poi rimessa a `false`: mostra "Photo coming soon" al posto della foto e il resto dei
dati corretto. Controllata anche `escursioni.html?cat=parchi-spettacoli`: le card aggiornate
compaiono con i dati nuovi, nessun errore console. `node controlla.js` → 0 errori, lo stesso
avviso di sempre su `opera-60` (non legato a questo aggiornamento). Alzato `sw.js` a
`isla-v174`.

**Da confermare con l'ufficio, in ordine di urgenza**: il prezzo di Scandal Dinner Show
(94€, il fornitore stesso dice che varia); il prezzo di Castillo San Miguel (50€, arrotondato
da 49,50€); i due prezzi di categoria di ¡Olé! Flamenco Show (49€/59€, scelti al posto del
"da" 51€ che non tornava); tutti i cinque prezzi per lo sconto natalizio del fornitore; se
"gladiuxkl" doveva essere l'id della scheda nuova invece di `gladiux-show`; `family: true` su
Gladiux; la durata dedotta di Gladiux.

**Gladiux pubblicata senza foto, su richiesta del proprietario (1 settembre 2026).** Il
proprietario ha chiesto di "mettere Gladiux in Parchi e spettacoli": la scheda ci era gia'
(`category: "parchi-spettacoli"` dal primo momento), ma con `published: false` non compariva
da nessuna parte — ecco perche' sembrava mancante. Messo `published: true` lasciando
`image: ""`.

**Quindi la regola "senza foto non si pubblica" non e' assoluta**: le altre otto schede senza
foto (`paisaje-lunar`, `canyoning`, `pico-teide`, `puerto-de-la-cruz`, i quattro tour privati)
restano `false`, ma il segnaposto esiste apposta ed e' il comportamento descritto in testa a
`esplora-catalog.js` ("quelle senza foto con un segnaposto"). Guardata l'elenco nel browser
prima di dire di si': il riquadro "Foto in arrivo" / "Photo coming soon" e' beige come il
resto della pagina, non un rettangolo grigio rotto, e sta in fila con le card che la foto ce
l'hanno senza sembrare un errore. `controlla.js` ha il suo avviso apposta ("pubblicata senza
foto: in elenco esce il riquadro grigio"): resta acceso ed e' giusto cosi', e' un promemoria,
non un errore.

Provato nel browser vero (`escursioni.html?cat=parchi-spettacoli`, in italiano e in inglese):
la categoria passa da 14 a 15 attivita' su 67 pubblicate, la card esce completa — segnaposto,
"Parchi e spettacoli", titolo, descrizione, "A circa 20 minuti da Costa Adeje", "≈ 1 ora e
30", "Adatta ai bambini", "Transfer disponibile", "da €35" e "Scopri di piu'". `node
controlla.js` → 0 errori, 2 avvisi (quello di `opera-60` di sempre piu' quello nuovo sulla
foto). Alzato `sw.js` a `isla-v175`.

**Resta da fare**: la foto vera. Finche' non arriva, la scheda e' online col segnaposto —
**da chiedere all'ufficio o al fornitore diretto** (quella sulla pagina di CanaryVIP e' di un
rivenditore concorrente e resta non scaricata).

### Tolte quattro schede segnaposto mai compilate (1 settembre 2026)

Subito dopo aver pubblicato Gladiux, il proprietario ha chiesto di eliminare definitivamente
`paisaje-lunar`, `canyoning`, `pico-teide` e `puerto-de-la-cruz`. Erano le quattro schede
rimaste dal primo abbozzo del catalogo, mai compilate: `published: false`, `image: ""`,
`priceFrom: null`, `priceAdult`/`priceChild` a `0`, zona e durata "Da definire". L'unica cosa
scritta davvero era la descrizione nelle tre lingue.

**Controllato prima di cancellare** che non le richiamasse nessuno: nessun altro file del
repo le nomina, e tutti i `privateOption` del catalogo puntano a `private-charter`, non a
loro. Quindi via il blocco e basta, niente da sistemare altrove.

**Nessun effetto per i clienti**: erano tutte e quattro invisibili, quindi il catalogo passa
da 75 a **71 schede ma le pubblicate restano 67**. Le due categorie toccate mostrano le
stesse card di prima (`teide-natura` 3, `tour-isola` 8): quello che sparisce e' solo roba che
non si vedeva.

**Se dovessero servire di nuovo** non vanno riscritte a mano: stanno nella storia di git fino
al commit precedente (`git show 80be84e:esplora-catalog.js`). Per lo stesso motivo le
descrizioni gia' scritte nelle tre lingue non sono perse.

**Non toccate le altre quattro schede senza foto** (`charter-privato`,
`tour-privato-su-misura`, `teide-privato-giorno`, `teide-privato-notte`): il proprietario ha
nominato solo queste quattro, e quelle private sono un'altra cosa — hanno una categoria
tutta loro e un senso commerciale, non sono abbozzi dimenticati. **Da chiedere** se vanno
tenute cosi' o compilate.

Provato nel browser vero: le due categorie renderizzano con le card di sempre, i quattro
indirizzi diretti (`tour.html?id=paisaje-lunar` ecc.) danno la pagina "Escursione non
trovata" invece di rompersi, home a posto, zero errori console. `node --check
esplora-catalog.js` ok, `node controlla.js` → 0 errori (restano i due avvisi noti, `opera-60`
e la foto di Gladiux). Alzato `sw.js` a `isla-v176`.

### Castillo San Miguel: i prezzi veri dal modulo di prenotazione, e i centesimi (1 settembre 2026)

Il proprietario ha incollato la pagina intera di CanaryVIP per la cena medievale, **modulo di
prenotazione compreso**: non piu' solo un prezzo "da", ma i quattro prezzi veri per tipo di
biglietto e per fascia, piu' il prezzo del transfer. Sono gli stessi dati che ad agosto
avevano dato solo "49,50 €" e un tier VIP senza prezzo.

**I numeri**: normale 49,50 € adulto / 29 € bambino, VIP 59,50 € / 35 €, transfer +15 €
adulto e +10 € bambino. Il transfer in catalogo si scrive **completo** (prezzo del biglietto
piu' il bus, e' quello che serve al totale), quindi `transferPrice: { adult: 64.50, child: 39 }`.
I due tipi di biglietto sono diventati due `options`, sullo stesso modello di Siam Park e Loro
Parque. Sparita la nota "pacchetto VIP: prezzo su richiesta": adesso il prezzo c'e'.

**Cosa NON e' stato copiato**, come sempre da questo rivenditore: "Miglior prezzo garantito",
"Biglietti Ufficiali", "Pagamento sicuro", "Prenotate in anticipo, i posti si riempiono
velocemente", punteggio e numero di recensioni, e la loro politica di cancellazione (che qui
diceva 24 ore come la nostra, ma resta la nostra per principio: non si copia una policy, si
scrive la propria). Le note sul menu e sullo spettacolo sono riscritte da zero nelle tre lingue.

**Manca ancora**: le fasce d'eta'. Il modulo del fornitore ha "Adulto" e "Bambino" con un
punto interrogativo accanto, ma il testo delle fasce non era nella pagina incollata. Niente
campo `ages`, quindi la pagina scrive "Adulti €49,50" e "Bambini €29" senza dire da che eta'
a che eta' — **da chiedere all'ufficio**, e' il buco piu' fastidioso di questa scheda.

**I centesimi: il sito non sapeva scriverli.** 49,50 € e' il primo prezzo del catalogo con i
decimali, e tutti i punti che stampano un prezzo facevano `"€" + numero`: sarebbe uscito
"€49.5", che su una pagina di prenotazione sembra un errore di battitura. Il proprietario ha
scelto di **mettere i prezzi esatti e sistemare la stampa**, invece di arrotondare a 50 € (che
avrebbe dato totali diversi da quelli del fornitore: 2 adulti €100 invece di €99).

Aggiunta quindi `eur(n)` in `i18n.js`, accanto a `t()` e `tf()` perche' la virgola e' una
questione di lingua e quel file lo caricano tutte le pagine. Regole: **i prezzi interi restano
come sono** ("44", non "44,00" — sono quasi tutti cosi' e riempire il sito di zeri non l'ha
chiesto nessuno), quelli coi centesimi prendono sempre due decimali, con la virgola in
italiano e spagnolo e il punto in inglese. Il simbolo € non lo mette lei: lo scrivono gia' i
19 punti che la chiamano, in `escursioni.js`, `tour.js` e `lista.js` (card, "In breve",
bottoni delle varianti, totale della finestra, messaggio WhatsApp, lista delle richieste).

**Non toccato `data-option-price`** in `tour.js`: e' un attributo che nessuno rilegge (come il
`<select>` morto della finestra), e per un dato il numero grezzo e' piu' giusto di un numero
formattato.

**Trovato e corretto un bug mentre si provava — il terzo dello stesso tipo.** Con la variante
VIP scelta, la riga "Con il transfer" continuava a dire "€64,50 adulti · €39 bambini", cioe' i
prezzi dell'**ingresso normale**, mentre due righe sotto il totale diceva €194: due numeri
sulla stessa pagina che si contraddicono. Il totale (`prezziAPersona()`) era gia' stato
insegnato a rifare il conto sulla variante, la riga di "In breve" no. Aggiunta `conVariante()`
in `detailRows()`: prende il supplemento del bus e lo somma al prezzo della variante scelta,
e non fa niente quando la variante un prezzo a persona non ce l'ha (le cabine VIP di Siam
Park, che si pagano a spazio) — li' resta il prezzo della scheda, come prima.

**Il bug c'era gia' e non solo qui**: su Loro Parque il "tutto compreso" mostrava "Con il
transfer €65 · €49" (i prezzi del biglietto normale) mentre il totale calcolava 153/149.
Adesso la riga dice €153 · €149, cioe' gli stessi numeri gia' scritti in queste note ad
agosto. Siam Park non era toccato dal problema perche' usa `transferPriceLabel`, che mostra
il **supplemento** (€25/€21) e non cambia con la variante.

Provato nel browser vero, in italiano e in inglese, su tutte e tre le schede che hanno
varianti e transfer insieme. Totali verificati a mano, 2 adulti + 1 bambino:
Castillo normale €128 (2×49,50+29) e €168 col transfer (2×64,50+39), VIP €154 (2×59,50+35) e
€194 col transfer (2×74,50+45); Loro Parque €120/€179 sul normale e €396/€455 sul tutto
compreso; Siam Park €120/€191 sul normale, totale nascosto sul tutto compreso e sulle VIP
(giusto: il prezzo bambini non ce l'hanno). Controllato che le schede a prezzo intero non
siano cambiate: `siam-park`, `loro-parque`, `combo-jungle-aqualand`, `private-charter` e
`gladiux-show` scrivono ancora "€44", "€165", "€350", mai "€44,00". In inglese i decimali
escono col punto ("€49.50"), in italiano e spagnolo con la virgola. Zero errori console.
`node controlla.js` → 0 errori. Alzato `sw.js` a `isla-v177`.

**Da confermare con l'ufficio**: le fasce d'eta' adulto/bambino; e i prezzi restano quelli
del rivenditore col banner dello sconto natalizio, quindi valgono gli stessi avvisi delle
altre schede prese da CanaryVIP.

### ¡Olé! Flamenco Show: la pagina intera, e due dati che avevo sbagliato (1 settembre 2026)

Stessa storia di Castillo: il proprietario ha incollato la pagina intera con dentro il
**modulo di prenotazione**, e i dati veri hanno smentito due cose che avevo scritto ad agosto
partendo dal riassunto.

**1. I prezzi erano 49/59, sono 51/61.** Il modulo dice Gold 51 € e Platinum 61 €; il corpo
della pagina continua a scrivere "49 euro" e "59 euro" nel testo descrittivo. **Vale il
modulo**: e' quello che il cliente paga davvero, il testo intorno e' rimasto indietro. E cosi'
torna anche il "Da 51,00 €" dell'intestazione, che ad agosto sembrava incoerente e che avevo
scartato proprio perche' non tornava coi 49/59 — era l'unico dei tre numeri giusto.

**2. La durata era "1 ora e 30", io l'avevo cambiata in "2 ore": sbagliato, ed e' tornata
com'era.** Il riassunto di agosto diceva "≈ 2h" e mi ero fidato. La pagina intera dice
"spettacolo di 90 minuti" e da' gli orari: porte 20:15, inizio **21:00**, fine 22:30, con un
intervallo di 15 minuti. 21:00-22:30 fa un'ora e mezza. Il "≈ 2h" del fornitore conta
dall'apertura delle porte.

**3. E per lo stesso motivo l'orario era sbagliato.** Avevo `times: ["20:15"]` perche'
l'intestazione del fornitore dice "ogni giovedi' alle 20:15", ma quella e' l'**apertura delle
porte**: lo spettacolo comincia alle 21:00. Anche l'"interval_min: 15" del riassunto di agosto
non erano partenze ogni quarto d'ora, era l'intervallo in mezzo allo spettacolo. Messo
`times: ["21:00"]`, con porte e intervallo in una nota.

**Morale, per la prossima volta**: quando arriva un riassunto e poi la pagina intera, i numeri
del **modulo di prenotazione** battono tutto il resto, e un orario in cima a una pagina puo'
essere l'apertura delle porte anche se sembra l'inizio.

**Prezzi bambini e fasce d'eta', che prima non c'erano proprio**: Gold 25,50 €, Platinum
30,50 €, e il fornitore scrive **"3-12 anni"** accanto al prezzo bambini del Platinum. Messo
`ages: { adult: "13+", child: "3-12" }`: il 13+ non e' scritto da nessuna parte ma e' l'unico
completamento possibile di 3-12, e `controlla.js` vuole la fascia adulti quando c'e' quella
bambini. **Niente fascia neonati e niente `priceInfant`**: sotto i 3 anni non si entra, che
non e' "gratis" — resta scritto nella descrizione, dove stava gia'.

Le due varianti sono passate da `price` (un numero solo sul bottone) a `priceAdult` +
`priceChild`: cosi' il totale della finestra si fa davvero, invece di restare nascosto.

**Cosa NON e' stato copiato**: "Miglior prezzo garantito", "Biglietti Ufficiali", "Pagamento
sicuro", "Molto popolare!", "i posti si riempiono velocemente", punteggio e recensioni, gli
eventi privati organizzati dal rivenditore, e **la loro cancellazione a 48 ore** — qui, al
contrario di Castillo, e' proprio diversa dalla nostra: Isla resta a 24 ore. Lasciato fuori
anche il nome del direttore artistico, come i presentatori di Scandal: e' una locandina, non
un dato che serve a prenotare. La descrizione e' stata riscritta piu' corta, togliendo la
frase sui bambini che adesso e' scritta due volte (la fascia esce da sola accanto al prezzo).

Provato nel browser vero in italiano e in inglese, tutte e due le varianti. Totali verificati
a mano, 2 adulti + 1 bambino: **Gold €127,50** (2×51 + 25,50) e **Platinum €152,50**
(2×61 + 30,50) — due totali coi centesimi, che e' anche la prova sul campo della `eur()`
aggiunta poco fa: "€25,50" in italiano, "€25.50" in inglese. Le fasce escono accanto ai
prezzi ("Adulti (13+)", "Bambini (3-12)"). Zero errori console. `node controlla.js` → 0
errori, e le due fasce combaciano senza buchi. Alzato `sw.js` a `isla-v178`.

### Scandal Dinner Show: pagina intera, e la pagina si contraddice in due punti (1 settembre 2026)

Terza pagina intera di fila. La regola imparata col flamenco — **il modulo di prenotazione
batte il testo intorno** — e' servita subito, due volte.

**1. I biglietti sono due, non tre.** Il corpo della pagina parla di "tre livelli (Standard,
Gold, Platinum)" e ci costruisce sopra una domanda frequente che spiega le differenze fra
tutti e tre. Nel modulo pero' lo Standard **non si puo' comprare**: ci sono solo "Ingresso Oro"
(94 €) e "Ingresso Platinum" (114 €). Messe due varianti, non tre. E il "Da 94,00 €"
dell'intestazione torna con l'Oro, che e' il piu' economico dei due comprabili.

**2. I giorni: "ogni sabato" contro "venerdi' e sabato".** L'intestazione dice sabato, il corpo
dice **venerdi' e sabato** nella riga degli orari e lo ripete nelle domande frequenti ("il
venerdi' e il sabato sera, con occasionali eccezioni in date specifiche"). Anche il riassunto
di agosto diceva solo sabato, ma quel riassunto veniva dalla stessa intestazione, quindi non e'
una conferma indipendente: e' la stessa fonte contata due volte.

**Tenuto venerdi' e sabato**, per due motivi. Il primo: e' il dato scritto due volte e nei
punti piu' precisi della pagina, mentre le intestazioni di questo fornitore hanno gia'
sbagliato due volte (l'orario del flamenco, che era l'apertura delle porte, e la sua durata).
Il secondo, che conta di piu': **`days` blocca la richiesta del cliente**. Se scrivo solo
sabato e il venerdi' si fa davvero, un cliente che vuole il venerdi' non riesce nemmeno a
mandare la richiesta — vendita persa e lui non sa perche'. Al contrario, se scrivo anche il
venerdi' e non si fa, la richiesta arriva in ufficio e l'ufficio risponde: nessuna prenotazione
e' automatica, c'e' sempre una persona in mezzo. Il danno e' asimmetrico, quindi si sbaglia
dalla parte che si puo' correggere. **DA CONFERMARE CON L'UFFICIO: e' la cosa piu' importante
di questo aggiornamento.**

**Prezzi**: `priceAdult: 94` (prima era `0`, c'era solo il `priceFrom`), Oro 94 € e Platinum
114 € come varianti. **Niente `priceChild`**: si entra solo dai 16 anni, quindi un prezzo
bambini non esiste — non e' "non lo sappiamo". Aggiunto `ages: { adult: "16+" }`, cosi' il
limite d'eta' si legge accanto al prezzo e non solo dentro la descrizione. Provato: se un
cliente mette un bambino nella finestra, il totale **sparisce** invece di dare un numero
falso, che e' il comportamento giusto.

Aggiunto `included: ["lunch", "drinks"]` (menu degustazione e bevande di base illimitate) e
tre note nuove: come si svolge la serata (porte 20:00 col drink di benvenuto, chiusura 20:30,
fine 23:30, portate alternate ai numeri), il menu di cinque portate con cosa e' compreso e
cosa si paga a parte, e la sede con i parcheggi.

**Il menu esatto non e' stato copiato**, al contrario di Castillo dove i tre piatti sono
scritti: qui la pagina stessa dice che "il menu cambia periodicamente", quindi elencare i
cinque piatti di adesso vorrebbe dire pubblicare una cosa che invecchia da sola. Scritto solo
il fatto che resta vero: cinque portate, fusion asiatico-mediterranea, cambia di tanto in
tanto.

**Non copiato**: "Miglior prezzo garantito", "Biglietti Ufficiali", "Pagamento sicuro",
"Molto popolare!", "i posti si riempiono velocemente", punteggio e recensioni, **la
cancellazione a 48 ore e gli scaglioni per i gruppi** (Isla resta a 24 ore), i pacchetti per
addii al nubilato e gruppi privati da 30-150 persone, i nomi delle presentatrici, e tutto il
testo di paragone con gli altri spettacoli dell'isola ("il piu' raffinato del sud", "in stile
Las Vegas"), che e' marketing del rivenditore contro i suoi concorrenti.

Provato nel browser vero. Totali verificati a mano: **Oro €188** (2×94), **Platinum €228**
(2×114); col bambino il totale sparisce. La riga "Adulti (16+)" esce col limite d'eta',
"Adatta a: Adulti". **Provata anche la validazione della data**: giovedi' 3 settembre viene
rifiutato con "Questa escursione si fa solo: Ven · Sab", venerdi' 4 e sabato 5 passano. Zero
errori console. `node controlla.js` → 0 errori. Alzato `sw.js` a `isla-v179`.

### History – The Evolution of Music: tre fasce di prezzo, una gratis (1 settembre 2026)

Quarta e ultima pagina intera. Questa volta senza contraddizioni: il modulo di prenotazione
ha **tre righe** invece delle solite due — Adulto 49 €, Bambino 25 € e **"Bambino
(gratuito)"**. La scheda aveva solo il `priceFrom: 49` e nessun prezzo a persona.

**Le fasce le ha date il proprietario, non la pagina**: "bambini 5-15". Il fornitore le tre
righe le scrive senza dire a che eta' valgono. Da li' il resto viene da se': `16+` per gli
adulti e `0-4` per i gratuiti sono **gli unici completamenti che non lasciano buchi** fra le
tre righe del modulo. Messe cosi' in `ages`, e `controlla.js` conferma che combaciano.

**Questo e' uno dei rari casi in cui `priceInfant: 0` e' giusto davvero**: il modulo scrive
"gratuito" a lettere, quindi lo zero vuol dire "non pagano" e non "non lo sappiamo". Sulla
pagina esce "Neonati (0-4): Gratis". Su tutte le altre schede spettacolo il campo resta
assente apposta.

**Confermato, non cambiato**: giorni (ogni sabato), orario (porte 20:00, spettacolo 21:00) e
durata 2h15. Su questa scheda avevo letto giusto gia' ad agosto — la pagina dice "due ore piu'
un intervallo di 15 minuti", che fa esattamente il "≈ 2:15h" dell'intestazione. Aggiunta una
nota con questa spiegazione e col fatto che e' presentato in inglese, e arricchita la
descrizione con quello che si vede davvero (trenta artisti, musica/danza/teatro/acrobazie,
dal classico a Elvis, Beatles, Queen, ABBA e Michael Jackson).

**Trovato un pezzo di pagina sbagliato dal fornitore, e non copiato.** La pagina ha un
paragrafo "Ingresso della mostra: usate l'ingresso designato sul lato sinistro dell'ingresso
principale **dell'hotel**" — ma questo spettacolo si tiene in un auditorium, non in un hotel.
E' la stessa identica frase della pagina del flamenco, che invece sta davvero dentro il GF
Victoria: e' un copia-incolla che il fornitore si e' portato dietro. **Quarta prova che le
parti "di contorno" di queste pagine non sono affidabili** (dopo l'orario del flamenco, la sua
durata e i giorni di Scandal): fidarsi del modulo e delle righe specifiche, non del testo
riempitivo.

**Non copiato**: "Miglior prezzo garantito", "Biglietti Ufficiali", "Pagamento sicuro", "Nuovo
spettacolo a Tenerife!", punteggio e recensioni, gli spettacoli privati per eventi aziendali,
gli sconti gruppi non quantificati, e la loro cancellazione a 24 ore (che qui coincide con la
nostra, ma resta la nostra per principio).

Provato nel browser vero in italiano e in inglese. Le tre righe escono complete: "Adulti
(16+) €49", "Bambini (5-15) €25", "Neonati (0-4) Gratis" / "Infants (0-4) Free". Totale
verificato a mano, 2 adulti + 1 bambino: **€123** (2×49 + 25), e i neonati non entrano nel
totale, come vuole la regola. Zero errori console. `node controlla.js` → 0 errori. Alzato
`sw.js` a `isla-v180`.

**Con questa, quattro delle sei schede spettacolo sono complete** (Castillo, Flamenco,
Scandal, History). Restano: **Gladiux**, che ha i dati ma non la foto, e **MHT – Music Hall
Tavern**, che non e' mai arrivata e resta com'era, "Da definire" su zona e orari.

### MHT – Music Hall Tavern: la prima pagina di un operatore vero (1 settembre 2026)

L'ultima delle sei, e la piu' facile: i dati stavolta **non vengono da CanaryVIP ma dal sito
dell'operatore stesso**. Si vede: niente contraddizioni interne, niente testo riciclato da
un'altra pagina, e le informazioni difficili (fasce d'eta', giorni) scritte per esteso invece
che da dedurre. La scheda era ferma al primo abbozzo: "Da definire" su zona e durata,
`priceAdult`/`priceChild` a `0`, nessun giorno, nessun orario.

**Le fasce le scrive l'operatore, tutte e tre**: "Adult tickets are for guests aged 13 and
over, child tickets are for ages 4 to 12, and infants up to 3 years old do not need a
ticket". Quindi `ages: { adult: "13+", child: "4-12", infant: "0-3" }` senza dedurre niente —
la prima volta in tutto il lotto. Prezzi 49 € adulto e 39 € bambino; `priceInfant: 0` di
nuovo giusto davvero ("do not need a ticket"). L'operatore chiede pero' che i neonati siano
**dichiarati lo stesso**, per i posti a sedere: scritto in una nota, perche' e' il tipo di
cosa che fa arrivare una famiglia a un tavolo senza sedia.

**I giorni vengono dal calendario**, che elenca le date una per una: lunedi', martedi',
giovedi' e venerdi' di ogni settimana, e la pagina conferma da sola con "four shows a week".
`days: ["lun", "mar", "gio", "ven"]` — e **`mar` e' martedi'**, la trappola di sempre.
Provata apposta nel browser contro il calendario dell'operatore: martedi' 8 settembre passa,
mercoledi' 9 viene rifiutato. Se avessi sbagliato sigla sarebbe successo il contrario.

**Orario e durata dalla scaletta della serata**, che l'operatore pubblica minuto per minuto:
porte 19:00, prima alzata di sipario 19:30, cena 19:45, spettacolo vero 20:45, intervallo
22:00, sipario finale 23:00. Messo `times: ["19:30"]` (l'inizio, non l'apertura porte — la
lezione del flamenco) e durata 3h30. La scaletta intera sta in una nota: e' utile, una cena
che arriva alle 19:45 cambia i piani della giornata.

**Zona**: da "Da definire" a "Playa de las Américas". L'operatore si e' spostato nel 2025 al
Vivo Show Bar, in Avenida Rafael Puig Lluvina 7, e la pagina dice due volte che **non offre
nessun trasporto**: quindi niente campo `transfer` (una pillola "Transfer disponibile"
sarebbe una bugia) e una nota che dice di arrivarci a piedi o in taxi.

**`family` da `false` a `true`**: l'operatore vende un biglietto bambini dai 4 anni e fa posto
ai neonati, e non c'e' nessun limite d'eta' scritto da nessuna parte — al contrario di Scandal
che dice "16+" a chiare lettere. **Deciso da solo leggendo i dati: se il proprietario sa che
lo spettacolo non e' per bambini, si rimette `false` in una parola.**

**`included: ["lunch", "photos"]`**: cena di tre portate e foto ricordo gratis. **Niente
`drinks`**, e qui e' importante: la pagina vanta un "Amazing Drinks Menu", che e' un bar dove
si paga, non delle bevande comprese. Sulle altre due cene-spettacolo (Castillo e Scandal) le
bevande sono incluse davvero ed e' scritto; qui no.

**Trovata un'icona col testo sbagliato per il contesto, la seconda volta che succede.**
`inc.lunch` diceva "Pranzo" / "Lunch" / "Almuerzo", e su una cena che comincia alle 19:45 e'
proprio sbagliato. E' lo stesso caso di `inc.drinks`, che ad agosto diceva "Bevande a bordo"
ed e' diventato "Bevande incluse" quando l'icona e' finita su un parco: **si generalizza il
testo, non si disegna un'icona nuova** — una posata per la cena e una per il pranzo sarebbero
due icone quasi identiche, e il progetto le guarda tutte in fila proprio per evitarlo.
Adesso dice **"Pasto incluso" / "Meal included" / "Comida incluida"**. Controllate tutte e
dieci le schede che la usano: sei gite in barca (dove il pasto e' davvero un pranzo, e il
testo nuovo resta corretto), Loro Parque e le tre cene-spettacolo. Verificate nel browser
nelle tre lingue.

Provato nel browser vero. Totale verificato a mano, 2 adulti + 1 bambino: **€137**
(2×49 + 39). Le tre righe escono complete, "Adatta a: Famiglie con bambini", il riquadro dice
"Pasto incluso · Foto". Le sei date provate contro il calendario dell'operatore danno tutte
il risultato giusto. Zero errori console. `node controlla.js` → 0 errori. Alzato `sw.js` a
`isla-v181`.

**Con questa le schede spettacolo sono cinque su sei complete.** Resta solo **Gladiux**: ha i
dati ma non la foto, quindi e' online col segnaposto, e non ha i prezzi per persona (il
riassunto di CanaryVIP dava solo il "da 35 €"). Se arriva la sua pagina intera, si chiude
anche quella.

### Il menu si sceglie nella richiesta: campo `menus` (1 settembre 2026)

Il proprietario ha chiesto di scrivere nelle informazioni che si puo' avere il menu
vegetariano o vegano e quello per bambini, di ricordare di segnalare le allergie, e **di far
scegliere l'opzione nella finestra della richiesta** — su MHT e sul Castillo San Miguel.

La prima parte era testo, la seconda un pezzo di meccanismo che non c'era. Costruito sul
modello di `languages`, che fa esattamente la stessa cosa per la lingua del tour: un campo
facoltativo del catalogo che accende una domanda nella finestra e aggiunge una riga al
messaggio WhatsApp.

**Il campo nuovo si chiama `menus`** ed e' un elenco di scelte scritte nelle tre lingue
(a differenza di `languages`, dove le lingue si scrivono nella lingua stessa e non si
traducono). Dove il campo non c'e', la domanda non compare: come per le lingue, si mette
**solo dove il fornitore lo dice**, non ovunque ci sia una cena.

**"Menu standard" non si scrive nel catalogo**: lo mette il sito come prima voce e vale
stringa vuota, quindi chi la lascia li' non fa comparire nessuna riga nel messaggio. E' la
stessa scelta gia' fatta per l'orario e per la lingua: all'ufficio serve leggere l'esigenza
vera, non un "nessuna esigenza" che allunga il messaggio senza dire niente.

**Le allergie non stanno nell'elenco, e apposta.** Sono troppo diverse una dall'altra per
entrare in una tendina: sotto la domanda compare una riga fissa che ricorda di scriverle
nelle note, che sono gia' testo libero e finiscono in fondo al messaggio. Cosi' l'ufficio
riceve "Menu: Vegano" e "Note: allergia alle noci" come due righe distinte.

**Toccati sette file**, che e' il prezzo di una domanda nuova nella finestra:
`esplora-catalog.js` (il campo e il vocabolario in testa), `i18n.js` (quattro testi nuovi),
`escursioni.js` (riferimenti, `riempiMenu()`, raccolta del valore, riga del messaggio,
richiesta messa da parte), `lista.js` (la scelta si legge anche nella lista), `controlla.js`
(le tre lingue del campo nuovo si controllano come quelle di `notes`), e **tutti e due gli
HTML**: `tour.html` **e** `escursioni.html`, perche' la finestra della richiesta e' scritta
due volte e chi ne tocca una sola lascia l'altra rotta. Provate tutte e due.

**`controlla.js` ha preso un errore mentre lavoravo**, ed e' giusto cosi': avevo scritto
`req.menuHint` su tre righe per leggibilita', ma il controllo legge `i18n.js` una riga per
chiave e diceva che mancavano l'inglese e lo spagnolo. Rimessa su una riga sola come tutte le
altre, anche le lunghissime: e' la convenzione del file, non un capriccio del controllo.

**I dati sulle due schede.** MHT: vegetariano, vegano e menu bambini **con la pizza**, che e'
il dettaglio dato dall'ufficio. Castillo: vegetariano, vegano e menu bambini **senza dire
quale piatto** — la pizza l'ufficio l'ha detta parlando di MHT, e per il castello non la dice
nessuno: la pagina del fornitore parlava solo di "menu vegetariano e menu bambini".
**Confermato dal proprietario: al castello la pizza non c'e'**, quindi resta "Menu bambini" e
la domanda e' chiusa — il commento nel catalogo lo dice, cosi' non si riapre fra sei mesi. Su
tutte e due la nota vecchia sui menu e' stata riscritta, perche' adesso rimanda alla scelta
nella richiesta invece di dire genericamente "su richiesta".

**⚠ Questa prima versione era sbagliata, ed e' stata rifatta il giorno stesso: vedi la
sezione qui sotto.** Una tendina sola non regge una coppia in cui uno mangia standard e
l'altro vegetariano — se ne e' accorto il proprietario. Il resto di quello che c'e' scritto
qui (dove sta il campo, perche' le allergie restano nelle note, i sette file da toccare)
vale ancora.

Provato nel browser vero nelle tre lingue: la domanda esce su MHT e sul castello con le voci
giuste e la riga delle allergie, e **non esce** su `flamenco-show` e `siam-park`, che il campo
non ce l'hanno. Provata anche la copia della finestra dentro `escursioni.html` (i bottoni che
la aprono li disegna solo `tour.js`, quindi per esercitarla ho iniettato il bottone vero):
identica. Messaggio WhatsApp verificato in tre casi: col menu standard nessuna riga, con
"Vegano" e con "Menu bambini (pizza)" la riga "• Menu: …" al posto giusto, e l'allergia
scritta nelle note che resta la sua riga in fondo. Provata la richiesta messa da parte: la
scelta si salva e si rilegge nella lista ("… · 2 adulti e 1 bambino · Menu bambini (pizza)").
`node controlla.js` → 0 errori. Alzato `sw.js` a `isla-v182`.

### Il menu era una scelta sola per tutta la prenotazione: rifatto a numeri (1 settembre 2026)

Consegnata la tendina del menu, il proprietario ha fatto la domanda giusta: **"se prenotano
più persone, ad esempio una coppia una con menu standard e l'altro vegetariano, come faccio a
capire?"**

Non si capiva. Era un buco vero del disegno, non un dettaglio: la tendina dava **una scelta
sola per tutta la richiesta**, quindi "Menu: Vegetariano" su una prenotazione da due persone
poteva voler dire "tutti e due vegetariani" oppure "uno dei due", e l'ufficio doveva
richiedere in chat proprio la cosa che la domanda serviva a evitare. E il caso della coppia
con un menu diverso a testa non e' l'eccezione, e' il caso normale.

**Rifatta con una casella numerica per ogni menu**, sullo stesso schema delle righe "Quante
persone" che stanno due campi piu' su (stesso markup, stessa classe CSS, nessuno stile
nuovo). Chi non ha esigenze lascia tutto a zero e non succede niente.

**Il resto del gruppo si scrive da solo come standard.** Con due persone e un vegetariano il
messaggio dice `Vegetariano × 1 · Menu standard × 1`: l'ufficio legge la composizione del
tavolo senza fare la sottrazione fra il numero di persone e i menu speciali. Se sono tutti
vegetariani non compare nessuno "standard" di troppo, e se non c'e' nessuna esigenza la riga
non compare affatto, come prima.

**Scritto "Vegetariano × 2" e non "2 Vegetariano".** Il "×" e' gia' il modo in cui il sito
scrive le quantita' nel totale ("2 adulti × €49,50"), ma il motivo vero e' un altro: le
etichette dei menu le scrive il catalogo in tre lingue e nessuna delle tre fa il plurale allo
stesso modo. "2 Vegetariano" e' italiano sbagliato, e inventare una regola per pluralizzare
delle etichette libere sarebbe stato peggio del problema.

**Aggiunto un controllo**: piu' menu speciali che persone e' sicuramente un errore, quindi
sotto le caselle compare "Hai indicato più menu speciali che persone." e la richiesta non
parte — stessa idea del giorno sbagliato sotto la data. L'avviso si riaccende anche se il
cliente **toglie una persona** dopo aver messo i menu, non solo se cambia i menu.

**Un dettaglio che si vede solo provando**: cambiare lingua ridisegna le caselle, e i numeri
gia' messi si sarebbero azzerati. Le righe si ricostruiscono tenendo i valori, con l'indice
come chiave e non l'etichetta — che cambiando lingua cambia.

Provato nel browser vero nelle tre lingue, su MHT e sul castello, e anche nella copia della
finestra dentro `escursioni.html`. I casi verificati: coppia con 1 vegetariano
(`Vegetariano × 1 · Menu standard × 1`), famiglia di 3 con vegano e menu bambini
(`Vegano × 1 · Menu bambini × 1 · Menu standard × 1`), tutti standard (nessuna riga), tutti e
due vegetariani (`Vegetariano × 2`, senza standard di troppo), e 3 menu per 2 persone: avviso
acceso, invio bloccato, finestra ancora aperta, e avviso che sparisce da solo rimettendo 1.
La richiesta messa da parte si rilegge nella lista col riepilogo scritto per esteso.
`node controlla.js` → 0 errori. Alzato `sw.js` a `isla-v183`.

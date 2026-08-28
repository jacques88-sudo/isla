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

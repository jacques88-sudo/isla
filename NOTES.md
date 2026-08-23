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
- `esplora-catalog.js` — dati delle 45 attività, divise nelle 8 categorie
- `assistente.js` — assistente guidato (due domande, poi consigli dal catalogo)
- `i18n.js` — tutte le traduzioni it/en/es e il selettore della lingua
- `manifest.json`, `sw.js`, `offline.html` — parte PWA (installabilità, cache offline)
- `assets/` — foto e video veri (logo, hero video, foto categorie, cala segreta, team)

## Fatto finora

Home: splash con anello blu di caricamento → banner fisso in cima (logo, wordmark, pillole
Esperienze / Prenota ora / Menu, si restringe scorrendo) → video hero con play/pausa →
"Inizia la tua avventura con…" → griglia bento (Pacchetti, Scan ticket, Con bambini,
3/5/7 Days) → "come funziona" → categorie (7 foto vere) → posti segreti → chi siamo →
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
- **Il catalogo è a metà strada.** La categoria "Mare e barche" (13 voci) viene dal
  catalogo vero di Admiral, con i prezzi del sito. Le altre 37 attività vengono ancora
  dai tre siti concorrenti guardati all'inizio: vanno sostituite categoria per categoria
  man mano che arrivano gli elenchi veri (`watersports`, `quad-buggy`, `island-tours`,
  `parks-shows`, `teide-stargazing`)
- Delle 13 barche Admiral: manca la zona di partenza per 12 su 13 e la durata per 6;
  il campo `family` (adatta ai bambini) è una valutazione da confermare in ufficio
- `assets/fiat-500-on-water.jpg` non è più usato: quell'attività veniva dai concorrenti
  e non è nel catalogo Admiral. La foto resta in `assets/` in attesa di sapere se
  Admiral la vende sotto un'altra categoria
- La categoria "Tour dell'isola" non ha ancora la foto per la card in home
- I riquadri bento (Pacchetti, Con bambini, 3/5/7 Days) puntano a `#categories` e al
  filtro famiglia: servono pagine vere per i pacchetti
- Testo "Chi siamo" è un **placeholder onesto** (nessuna affermazione inventata) — da
  sostituire con la storia vera
- Video hero `assets/Hero-poster.mp4` pesa 3.7MB — da comprimere a ~1-1.5MB (720p, 6-10s,
  senza audio) con uno strumento tipo HandBrake
- Sezione recensioni volutamente omessa: quelle di isla-adventures sono inventate, non le
  abbiamo copiate

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

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
- `esplora-catalog.js` — dati delle 14 escursioni vere, non ancora collegato a nessuna pagina
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
- `esplora-catalog.js` ha le 14 escursioni ma non è collegato a nessuna pagina, e le
  immagini sono stock/placeholder
- I riquadri bento (Pacchetti, Con bambini, 3/5/7 Days) puntano tutti a `#categories`:
  servono pagine vere
- Le card delle categorie in home non sono cliccabili
- Testo "Chi siamo" è un **placeholder onesto** (nessuna affermazione inventata) — da
  sostituire con la storia vera
- Video hero `assets/Hero-poster.mp4` pesa 3.7MB — da comprimere a ~1-1.5MB (720p, 6-10s,
  senza audio) con uno strumento tipo HandBrake
- Sezione recensioni volutamente omessa: quelle di isla-adventures sono inventate, non le
  abbiamo copiate

## Note pratiche

- Il service worker (`sw.js`) ha una cache con nome tipo `isla-vN`: quando si cambia
  `styles.css`, `index.html`, `booking.html`, `booking.js` o `app.js`, bisogna aumentare
  il numero (es. `isla-v10` → `isla-v11`) altrimenti i browser che hanno già visitato il
  sito continuano a vedere la versione vecchia.
- Le foto in `assets/Cat-*.jpg` sono già rinominate e pronte per la pagina categorie/escursioni.

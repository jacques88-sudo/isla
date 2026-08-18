# Isla — appunti di progetto

Riepilogo per riprendere il lavoro (anche da un altro dispositivo o in una nuova sessione).

## Cos'è Isla

PWA mobile-first per turisti a Tenerife. Funzione centrale: l'utente inserisce il codice
della prenotazione (ticket number / booking code) e vede subito orario, punto d'incontro,
durata, cosa portare e note del proprio tour — senza cercare tra email, PDF e screenshot.

## Scelta tecnica

HTML, CSS e JavaScript puri. Niente framework, niente build tool, niente backend: un sito
statico pubblicabile direttamente su GitHub Pages.

Scelta esplicita e discussa: **non** replicare lo stack di isla-adventures (React + TypeScript
+ Vite + Tailwind + Supabase). Troppa complessità da mantenere in autonomia per un principiante.
Di quel progetto abbiamo preso solo lo stile visivo e la struttura dei contenuti, non il codice.

## Stile

Ispirato a due riferimenti:
- **isla-adventures** (repo GitHub dell'utente): palette calda oklch (nero caldo come colore
  primario, accento sabbia/oro usato con parsimonia), font Cormorant Garamond (titoli) + Jost
  (corpo, peso leggero 300), card quasi squadrate (radius 6px) contro pulsanti/input a pillola.
- **Anantara** (sito di hotel di lusso): fotografia a piena pagina, etichette maiuscole molto
  spaziate, molto spazio bianco, colore d'accento unico e sobrio.

Tutti i colori sono definiti come variabili CSS in `styles.css` (`:root` e `[data-theme="dark"]`).

## Struttura dei file

- `index.html` — home
- `booking.html` + `booking.js` — schermata dettagli prenotazione (cerca per codice)
- `styles.css` — tutto lo stile, un solo file
- `app.js` — logica condivisa (tema chiaro/scuro, service worker, form di ricerca, video hero)
- `esplora-catalog.js` — dati delle 14 escursioni vere, non ancora collegato a nessuna pagina
- `manifest.json`, `sw.js`, `offline.html` — parte PWA (installabilità, cache offline)
- `assets/` — foto e video veri (logo, hero video, foto categorie, cala segreta, team)

## Fatto finora

Home completa in 5 passi: video hero con play/pausa → intro → ricerca ticket (azione
principale) → "come funziona" → categorie (7 foto vere) → posti segreti → chi siamo →
FAQ → richiamo finale alla ricerca → footer.

`booking.html` mostra i dettagli di una prenotazione cercata per codice, con dati di
esempio (`MOCK_BOOKINGS` in `booking.js`) e stato di errore per codici non trovati.

Tutto è su GitHub, branch `main`, repository `jacques88-sudo/isla`.

## Da fare

- Pagina "Tutte le escursioni" — dati veri già pronti in `esplora-catalog.js`, mancano
  markup, stile e pagina
- Pagina dettaglio di una singola escursione
- Testo "Chi siamo" in home è un **placeholder onesto** (nessuna affermazione inventata) —
  da sostituire con la storia vera quando disponibile
- Sezione recensioni volutamente omessa: quelle di isla-adventures sono inventate, non le
  abbiamo copiate
- Video hero `assets/Hero-poster.mp4` pesa 3.8MB — da comprimere a ~1-1.5MB (720p, 6-10s,
  senza audio) prima della pubblicazione finale, con uno strumento tipo HandBrake
- GitHub Pages non ancora attivato (nessun link pubblico condivisibile per ora)

## Note pratiche

- Il service worker (`sw.js`) ha una cache con nome tipo `isla-vN`: quando si cambia
  `styles.css`, `index.html`, `booking.html`, `booking.js` o `app.js`, bisogna aumentare
  il numero (es. `isla-v10` → `isla-v11`) altrimenti i browser che hanno già visitato il
  sito continuano a vedere la versione vecchia.
- Le foto in `assets/Cat-*.jpg` sono già rinominate e pronte per la pagina categorie/escursioni.

# Lo stile di Isla

Come appare e come parla Isla. Da leggere **prima** di disegnare una pagina, un pulsante,
una grafica dei social o di scrivere un testo nuovo. Le regole di `CLAUDE.md` vincono
sempre; il perché delle scelte sta in `NOTES.md`.

## L'idea in una riga

**Un hotel di lusso al mare, ma alla mano.** Carta chiara e calda, nero caldo, un filo di
oro, tanta aria, foto vere a tutta larghezza. Ispirato a `isla-adventures` (palette e
font) e ad Anantara (foto grandi, etichette maiuscole spaziate, un solo accento sobrio).

## Colori — sempre dalle variabili di `:root` in `styles.css`

| variabile | a cosa serve |
|---|---|
| `--bg` | carta chiara calda (`#FCFAF6`, uguale in manifest, `theme-color` e icone) |
| `--surface` | il bianco delle card |
| `--cream`, `--sand` | i riquadri da mettere in evidenza (piano, più forte) |
| `--text`, `--muted` | nero caldo e grigio caldo, mai nero puro |
| `--primary` | il pulsante principale: **nero caldo**, non colorato |
| `--gold` / `--gold-testo` | l'accento, **con parsimonia**; per le scritte piccole `--gold-testo` |
| `--wave-blue-light` | l'azzurro: **solo** "Aggiungi alla lista", i numerini e l'anello del caricamento |
| `--ok`, `--wait`, `--danger` | gli stati (confermata, in attesa, errore) |

- Tutto in `oklch`, con la tinta calda (60–85). Un colore nuovo nasce da questi, non da zero
  (anche Halloween li gira, non li sostituisce).
- **Il tema scuro c'è solo sui telefoni (e computer) impostati sul tema scuro**: lo decide
  `prefers-color-scheme: dark`, e sul sito non c'è nessun interruttore per sceglierlo.
  Chi ha il telefono sul tema chiaro vede sempre Isla chiara. Le variabili si girano da sole. Cose che
  devono restare uguali di giorno e di notte (il logo nel cerchio `#fff`, il bottone
  azzurro) hanno i colori scritti a mano, con un commento che lo dice.
- Contrasto: si misura. Testo bianco sull'azzurro no (2,2:1), scuro sì (7,4:1).

## Caratteri

- **Titoli**: Cormorant Garamond, peso 500 (`--font-display`). Grandi e fluidi con
  `clamp()`.
- **Testo**: Jost **300**, leggero, interlinea 1,65 (`--font-body`).
- **Etichette, pulsanti, pillole, eyebrow**: Jost MAIUSCOLO, piccolo (.6–.78rem), molto
  spaziato (`letter-spacing` .12–.3em). È la firma del sito.
- Caveat (`--font-hand`) **solo** nella cartolina della lista.

## Forme

- **Le card con la foto hanno angoli tondi** (16–20 px: categorie, mappa, riquadri della
  home): al proprietario piacciono così (5 novembre 2026), non si squadrano. Le card di
  solo testo e le foto da sole (Chi siamo) restano quasi squadrate (`--radius-card: 6px`).
  **Pulsanti e campi a pillola** (`--radius-pill`).
- **Le scritte sopra le foto** sono in Jost MAIUSCOLO spaziato, bianche, come
  "PACCHETTI" e "MARE E BARCHE"; non nel carattere dei titoli.
- Ombra unica, morbida e lunga (`--shadow`); bordo sottile `--border`.
- Colonna stretta da telefono (`--max: 640px`), `--max-wide: 1120px` solo per le sezioni
  ricche da tablet in su. Si disegna **prima per il telefono**, e si prova a 320 px e in
  tutte e cinque le lingue (lo spagnolo e il tedesco sono i più lunghi).
- Pulsanti alti almeno 44–48 px. Un testo lungo va a capo invece di uscire dallo schermo.

## Pezzi già fatti, da riusare

- `.btn` + `.btn-primary` (nero caldo), `.btn-soft` (contorno), `.btn-lista` (azzurro).
- `.eyebrow`: la riga d'oro maiuscola sopra un titolo.
- La **capsula scura** in alto (`.isla-tabs`): icone, la scritta solo sulla voce attiva.
- Il **logo sempre nel cerchio bianco**.
- Le icone: SVG su griglia 24×24, tratto, `currentColor`; si guardano tutte in fila.
- Le bandiere sono SVG, non emoji.

## Movimento

Poco e lento: dissolvenze e piccoli sollevamenti (`.2s`–`.5s ease`, card che salgono di
4 px all'hover). Sempre con `prefers-reduced-motion` rispettato.

## Come parla

- **Tu**, caldo e semplice, frasi corte. Spiega cosa succede e cosa fare dopo:
  "Questo codice non esiste. Controllalo, oppure cancellalo per mandare la richiesta senza
  sconto."
- Onesto: è una **richiesta**, non un acquisto ("Ora non paghi niente"). Niente urgenza
  finta, niente "best price", niente stelle o punteggi.
- Gli errori non danno la colpa: dicono come rimediare.
- Ogni testo in cinque lingue (it, en, es, fr, de), riscritto, non tradotto parola per
  parola. I nomi propri dei posti restano uguali.

## Foto e social

Foto vere (del sito o dei fornitori), mai fatte con l'IA; niente marchi di altri; testo
grande e leggibile, niente corsivi sottili su foto chiare. Le regole complete stanno in
`social/LEGGIMI.md`.

## Da non fare

- Colori nuovi saturi, gradienti vistosi, più di un accento.
- Nero puro `#000` o grigi freddi.
- Pulsanti squadrati, o angoli tondi sulle card di solo testo.
- Testo in grassetto pesante nel corpo: il corpo è leggero.
- Copiare stile o testi promozionali dei fornitori.

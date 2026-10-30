# Le grafiche dei social di Isla

Qui stanno i **modelli** delle grafiche per Instagram, Facebook e TikTok, fatti per il post
del pacchetto coppia (26 ottobre 2026). Il sito non li carica. Il piano dei contenuti (cosa
si pubblica e quando) sta su Notion: "Piano social Isla — 12 settimane", dentro la pagina
"Social — video, clip e cose imparate".

| file | cosa è |
|---|---|
| `carosello.html` | le 5 slide del feed, 4:5 (1080×1350): copertina, una slide per escursione, prezzo finale |
| `verticali.html` | le stesse in 9:16 (1080×1920) per TikTok e il video, più le 2 storie |
| `fai-grafiche.js` | dai modelli alle immagini e al video di 12 secondi (vedi in testa al file) |
| `foto/` | foto già sistemate per i social (il parascending senza il logo di Tripadvisor sul paracadute) |

```bash
NODE_PATH=$(npm root -g) node social/fai-grafiche.js /percorso/della/scratchpad/grafiche
```

Le immagini finite non si committano: si rifanno dai modelli in pochi secondi.

## Per un post nuovo

Si copia `carosello.html` e `verticali.html`, si cambiano testi e foto (le foto stanno in
`../assets/`, le stesse del sito), si lancia `fai-grafiche.js` e si guarda **ogni** immagine
prima di mandarla.

## Le regole (proprietario, 26 ottobre 2026)

- **Il logo sempre nel cerchio a sfondo bianco**, anche sulle grafiche.
- **Il prezzo del post è quello del sito**, uguale al centesimo. Se si vuole un prezzo da
  social diverso, prima si cambia il sito (`prezzoOfferta` in `pacchetti.js`) e poi si fa
  il post. Mai un prezzo più basso sul post che sul sito.
- **Foto vere**, quelle del sito o dei fornitori (i permessi ci sono). Niente immagini fatte
  con l'intelligenza artificiale: sembrano finte, e chi vende esperienze vere non se lo può
  permettere.
- **Niente marchi di altri** (Hard Rock Cafe, Tripadvisor sui paracadute) e **niente stelle**
  o punteggi: sembrano recensioni, e quelle dei fornitori non si copiano.
- **Feed 4:5, storie / reel / TikTok 9:16.** In 9:16 i testi stanno lontani dall'alto
  (nome e pulsanti dell'app) e dal basso (didascalia): da 150 px sopra e 400 sotto.
- **Testo grande e leggibile**, niente corsivi sottili su foto chiare.
- Su Instagram e TikTok il link nella didascalia non si tocca: si scrive "link in bio" e il
  link in bio è `islaexcursionstenerife.com/link`. A ogni post si cambia il riquadro in cima
  a quella pagina (`ULTIMO_VIDEO` in `link.js`) e, se serve, si crea l'indirizzo corto
  (`indirizzi-corti.js`). Su Facebook e nelle storie l'indirizzo corto si tocca.

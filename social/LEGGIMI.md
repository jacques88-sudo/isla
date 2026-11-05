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
| `spiagge-sud/` | il post "Le 5 spiagge del sud": 7 slide, 7 verticali, 2 storie, il reel a strati, e le sue foto |

```bash
NODE_PATH=$(npm root -g) node social/fai-grafiche.js /percorso/della/scratchpad/grafiche
```

Le immagini finite non si committano: si rifanno dai modelli in pochi secondi.

## Per un post nuovo

**Ogni post ha la sua cartella** dentro `social/`, coi suoi `carosello.html`, `verticali.html`
e `foto/` (dal 5 novembre 2026; il pacchetto coppia è rimasto in `social/` stesso). Si parte
da `spiagge-sud/`, che è il modello più nuovo: si copia la cartella, si cambiano testi e foto,
e si lancia col nome della cartella:

```bash
NODE_PATH=$(npm root -g) node social/fai-grafiche.js /percorso/della/scratchpad/grafiche spiagge-sud
```

Le slide si contano da sole (`#s1`, `#s2`… nel carosello, `#t1`, `#t2`… nelle verticali, `#s1`
e `#s2` per le storie): se ne possono mettere quante si vuole. Il reel dura sempre 12 secondi.
Si guarda **ogni** immagine prima di mandarla.

**Il reel a strati.** Nelle verticali la classe `t` segna il testo e `fisso` la testata. Così
lo zoom e la dissolvenza li fa solo la foto, la testata sta ferma, e il testo di ogni slide
entra dopo la dissolvenza ed esce prima della prossima. Senza le due classi (il pacchetto
coppia) si dissolve l'immagine intera, e nei cambi le scritte si sovrappongono: era il
difetto del reel delle spiagge di ottobre.

**Foto nitide.** Le foto della mappa (`assets/mappa/`) sono larghe 720 px: su una grafica
larga 1080 escono sfocate. Si prende la stessa foto da Wikimedia Commons, larga 1920. La
miniatura a 1920 px si scarica (le misure strane e l'originale Wikimedia le rifiuta, e dopo
poche richieste di fila risponde 429: si aspetta un minuto e si riprova).

## Le foto di `spiagge-sud/` (5 novembre 2026)

| file | da dove | autore e licenza |
|---|---|---|
| `duque.jpg` | Commons, "Tenerife Playa El Duque R03" | Marc Ryckaert, CC BY 3.0 |
| `tejita.jpg` | Commons, "Playa nudista La Tejita. Tenerife (72399)" | Karmelo26, CC0 |
| `abama.jpg` | Commons, "ESP Tenerife, Guía de Isora, Abama, Playa Abama 0006" | -wuppertaler, CC BY 4.0 |
| `las-vistas.jpg`, `el-medano.jpg` | ritagliate dalle grafiche di ottobre | **fonte non scritta**: non sono fra le foto del sito, e su Commons non le ho ritrovate |

CC BY chiede di scrivere autore e licenza (come fa la mappa del sito): sulle grafiche non ci
sono, si possono mettere nella didascalia del post. Le due senza fonte vanno chieste a chi le
ha scelte prima di riusarle.

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

# Dati di pick-up del fornitore

Tabelle degli hotel, dei punti di raccolta e degli orari, prese dal widget di
prenotazione del fornitore il **7 settembre 2026**.

**Non sono ancora usate dal sito.** Sono materiale grezzo, salvato qui perché
raccoglierlo di nuovo costa dieci minuti e perché serve una revisione con
l'ufficio prima di pubblicare un orario.

---

## Da dove vengono

Dal widget di `islandexcursionstenerife.com`, il fornitore con cui Admiral
vende queste escursioni. Il proprietario ha confermato che **gli orari di
Admiral sono gli stessi di quella pagina**.

Il widget ha tre caselle in fila — `Hotel` → `Punto de recogida` → `Hora` — e
a ogni cambio di hotel chiede al server (`POST /webfapinere/widget/hotel_pickup`)
che risponde `{"result":"ok","id_punto":"1","hora":"08:15"}`.

I file in `grezzo/` sono quello che è uscito, senza ritocchi.

---

## I file

| file | cosa c'è |
|---|---|
| `hotel.tsv` | 567 hotel: codice, nome, punto di raccolta, ora sul Teide mezza giornata |
| `punti.tsv` | 104 punti di raccolta: codice, nome, quanti hotel serve, a che ora |
| `raccogli-orari.js` | il comando da incollare in console per gli orari di una nuova escursione |
| `grezzo/` | le catture originali, non toccate |

Sono file separati da tabulazione (`\t`), non da virgola: parecchi nomi di
hotel contengono una virgola.

---

## Come si leggono — le tre cose che si sbagliano

**`id_punto` vale per tutte le escursioni, l'ora no.** Il punto di raccolta
dipende solo da dove alloggi: PERLA GRIS sale alla fermata TITSA CALLAO sia sul
Teide mezza giornata sia su Masca+Teide (verificato su due escursioni). L'ora
invece cambia da un'escursione all'altra, ed è l'unica colonna da rifare per
ogni nuovo tour.

**Il punto di raccolta spesso non è l'hotel.** Trenta punti su settanta sono
fermate dell'autobus pubblico (TITSA), sbarre di residence, posteggi taxi,
centri commerciali. Chi sta al CLEOPATRA deve camminare fino alla fermata del
BEST TENERIFE. Se il cliente non lo legge, alle 09:15 è ancora davanti al suo
hotel.

**`id_punto = 0` non è un dato mancante: vuol dire che si sale direttamente in
hotel** (confermato dal proprietario). Sono 29 hotel. Sul sito diventa "passiamo
a prenderti in hotel", non "pick-up non disponibile".

**Ora vuota** vuol dire che quel punto **non è servito da quell'escursione**.
Sul Teide mezza giornata sono 170 hotel, quasi tutti a Puerto de la Cruz e nel
nord: da lì questa escursione non passa.

---

## Cosa è già stato verificato con l'ufficio

- **`12:15` sul punto 41** (REGENCY COUNTRY CLUB, FLORIDA, CHAYOFA CLUB) è
  **corretto**, anche se tutti gli altri orari stanno fra le 08:15 e le 09:25.
- **`09:04` → `09:05`** e **`09:16` → `09:15`**: refusi del fornitore, corretti
  in `hotel.tsv` e `punti.tsv`. In `grezzo/` restano com'erano.

## Cosa manca ancora

- **39 punti su 104 non hanno il nome.** La tendina del Teide mezza giornata
  mostra solo i punti che quell'escursione serve davvero; gli altri — quasi tutti
  del nord — hanno solo il codice. Si recuperano aprendo la tendina dei punti su
  un'escursione che parte da Puerto de la Cruz, senza altre richieste al server.
- **Gli orari delle altre escursioni.** Non servono all'ufficio: si prendono in
  novanta secondi con `raccogli-orari.js`, una colonna in più per ciascuna.
  Fatte finora: Teide mezza giornata, Teide + Icod + Garachico + Masca, Poema
  del Mar, La Gomera, giro completo dell'isola, Santa Cruz + Anaga + La Laguna.

---

## Prendere gli orari di una nuova escursione

Si apre la pagina di quell'escursione sul sito del fornitore, si incolla
`raccogli-orari.js` nella console del browser e si aspetta un minuto e mezzo.
Escono 104 righe `id_punto → ora`, una per punto di raccolta.

**Sono 104 richieste e non 567** perché il punto dipende solo dall'hotel e quello
è già in `hotel.tsv`: basta un hotel campione per punto. L'unica cosa che cambia
da un'escursione all'altra è l'ora.

Una casella dell'ora vuota **non è un dato mancante**: vuol dire che quel punto
non è servito da quell'escursione.

---

## Prima di mettere un orario sul sito

Gli orari sono una promessa: un cliente alla fermata all'ora sbagliata è il
danno peggiore che questo campo possa fare. Vanno confermati dall'ufficio prima
di pubblicarli, e ricontrollati quando il fornitore cambia i giri.

I **nomi degli hotel** e i **punti di raccolta**, invece, si possono usare
subito: sono luoghi, non promesse.

---

## Non solo pick-up: `grezzo/karting-las-americas.json`

Questa cartella è nata per gli orari di raccolta, ma qui dentro sta anche lo
**scraping del sito di Karting Las Américas** (10 settembre 2026), mandato dal
proprietario perché `www.kartingamericas.com` è bloccato dal proxy di rete e
dall'esterno non si legge.

Undici prodotti presi dalle schede WooCommerce: le tande, le nove gare, la
promozione per residenti, i tre modelli di kart, indirizzo e dati del circuito.

Su cinque formati di gara su sei il sito dà **due prezzi diversi**, e il file
li tiene tutti e due (`precio`, dal carrello, e `precio_en_descripcion`).

**Sui prezzi però non si guarda più questo file.** Il 15 settembre 2026
l'ufficio ha mandato la foto del **listino esposto al circuito**, trascritto
in `grezzo/karting-listino.txt`, e quello è la fonte: dà 20 e 15 dove il
carrello dà 22 e 16, e gruppi **da 5 a 15 persone** dove il carrello chiede un
minimo di 8. Il JSON resta per quello che il volantino non dice — fasce d'età,
altezze, modelli dei kart, orari junior del fine settimana.

Non è finito in scheda quello che il file chiama `plaza_gratis_desde`: il
circuito regala la gara al festeggiato dai 10 partecipanti in su, ma è la
promozione di un altro e non è nostra da offrire.

---

## `grezzo/canaventura-senderismo.json`

Le tre camminate di **Canaventura** (11 settembre 2026), mandate dall'ufficio già in JSON
pulito: Teide Light, Camino Real, La Laguna & Anaga. Sono le **tre varianti** della scheda
`trekking-bici`, che dalla v281 si chiama "Trekking" (in v280 erano tre schede separate).

Il file è tenuto **com'è arrivato**, e due dei suoi campi in catalogo sono cambiati apposta:

- **`times: []` non è stato copiato.** Nel file vuol dire "la pagina del fornitore non
  pubblica l'ora"; in Isla la lista vuota vuol dire charter, con l'ora da concordare
  davvero. Nelle schede il campo **manca**, che è lo stato giusto — non le sappiamo ancora.
- **`punto_partenza: "Santiago del Teide"`** è dove comincia il sentiero, non da dove parte
  il cliente: in scheda `zone` è "Tenerife Sud" come su tutte le escursioni in bus, e
  Santiago del Teide sta in una nota.

Gli **undici link delle foto** servono ancora: `canaventura.es` e il suo CDN
(`crokis-sites.fra1.cdn.digitaloceanspaces.com`) sono bloccati dal proxy di rete, come
`kartingamericas.com`, quindi le foto le deve mandare l'ufficio. Finché non arrivano le tre
schede escono col riquadro "Foto in arrivo".

---

## `grezzo/franz-surf-school.json`

Il listino della **Franz Surf School** di Playa de las Américas (13 settembre 2026),
mandato dall'ufficio già in JSON pulito: diciannove prodotti presi dall'API WooCommerce
del loro sito (`wp-json/wc/store/v1/products`), più l'indirizzo del negozio e le anomalie
trovate durante l'estrazione.

Nella scheda `surf-lesson`, che prima era un segnaposto vuoto, sono finite **solo le nove
lezioni**. Resta fuori:

- tutto il **noleggio delle tavole** (le sei softboard a 15 €, la fibra a 20, la longboard
  a 25): il proprietario ha detto il 13 settembre 2026 che ad Admiral interessano solo le
  lezioni. I prezzi restano qui per il giorno che cambiasse idea, e la strada era il prezzo
  scritto **nell'etichetta** della variante ("da 15 € al giorno"), perché il fornitore
  vende a giornate e pubblica solo il primo giorno;
- la **tariffa residenti** (25 €, `clases-grupales-para-residentes`), riservata a chi
  risiede a Tenerife: Admiral vende a turisti, e un prezzo che il cliente non può avere è
  peggio di nessun prezzo;
- i due **prodotti di test** del fornitore (0,05 € e 0 €), che il file segna già in
  `esclusi`.

Il campo `anomalie_da_verificare` è l'elenco delle domande che il file si portava dietro.
Tre sono chiuse dal proprietario (13 settembre 2026) e **il file non è stato ritoccato** —
resta com'è arrivato, la risposta sta qui:

- la **muta nel noleggio** (compresa in un punto della loro pagina, non compresa in un
  altro) non è più una domanda: il noleggio non si vende;
- il **minimo di 13 anni** vale per tutte le lezioni, non solo per quelle di gruppo, anche
  se il loro sito lo scrive solo lì;
- le lezioni durano **2 ore tutte**, non solo quelle del pacchetto da 3;
- il **massimo di 6 persone** vale per tutte le lezioni, non solo per quelle di gruppo. Da
  qui una domanda nuova: gli scaglioni della lezione per famiglie e amici si fermano a
  cinque (120-165-200-225 €), quindi **il prezzo del sesto posto non c'è** e in scheda è
  scritto che lo conferma l'ufficio. Non si ricava dagli altri: gli scarti sono 45, 35, 25.

Le **foto** non servono: la scheda usa `surf-lesson.jpg`, che era già in `assets/`.

### `grezzo/franz-surf-school-come-arrivare.txt`

La pagina "Come arrivare" del loro sito, incollata dal proprietario lo stesso giorno come
risposta alla domanda sul punto di ritrovo: **Calle México 15, Playa de las Américas**, cioè
il negozio.

**L'indirizzo si ferma qui e non va in scheda.** Poche ore dopo il proprietario ha precisato
«o più in generale las Américas», e la nota dice appunto che il ritrovo è a **Playa de las
Américas** e che il punto esatto lo conferma l'ufficio insieme all'ora: da un indirizzo
scritto sul sito il cliente capirebbe "ci vediamo alla porta del negozio", e una lezione di
surf comincia in spiaggia. Quello che resta in scheda è che **ci si arriva da soli** — una
deduzione (una scuola che passa a prenderti non pubblica una pagina "come arrivare"),
scritta così perché fra i due errori possibili è quello che costa due passi invece di una
lezione persa.

I **due numeri di telefono** della scuola stanno in questo file e non sul sito: Admiral è un
rivenditore, e un cliente che chiama la scuola esce dal giro della richiesta su WhatsApp.

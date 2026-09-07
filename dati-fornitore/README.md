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
- **Gli orari delle altre escursioni.** Ce li deve dare l'ufficio: una colonna
  in più per ciascuna.

---

## Prima di mettere un orario sul sito

Gli orari sono una promessa: un cliente alla fermata all'ora sbagliata è il
danno peggiore che questo campo possa fare. Vanno confermati dall'ufficio prima
di pubblicarli, e ricontrollati quando il fornitore cambia i giri.

I **nomi degli hotel** e i **punti di raccolta**, invece, si possono usare
subito: sono luoghi, non promesse.

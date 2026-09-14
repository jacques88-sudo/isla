// I PACCHETTI DI ISLA
//
// A COSA SERVE
//   Un pacchetto e' un gruppo di escursioni del catalogo vendute insieme con
//   uno sconto. Sono quelli che l'ufficio ha gia' deciso: il cliente li trova
//   pronti nella pagina "Pacchetti", e li chiede **interi** — un pacchetto non
//   si smonta, vedi "IL PACCHETTO SI CHIEDE INTERO" piu' sotto.
//
// COSA SI SPINGE
//   Questa lista e' costruita attorno a quattro prodotti da spingere: Luxury
//   Cruiser Experience, i giri in buggy, lo stargazing in gruppo piccolo e il
//   jet ski da un'ora. Ognuno compare in piu' pacchetti, dentro temi diversi,
//   cosi' il cliente ci arriva da strade diverse e non sembra la stessa
//   proposta ripetuta sette volte. Nei sette di oggi: il Luxury Cruiser sta in
//   cinque, il buggy e lo stargazing in tre, il jet ski in due.
//
// IL PREZZO NON SI SCRIVE QUI
//   Nessun pacchetto ha un prezzo suo. Si somma quello delle escursioni
//   leggendolo da `esplora-catalog.js` e si toglie `sconto`. E' la stessa
//   regola della lista: un prezzo scritto due volte e' un prezzo che prima o
//   poi si contraddice. Se domani cambi 39 in 45 sul Teide, i pacchetti che lo
//   contengono si aggiornano da soli.
//
// COME SI COMPILA UNA VOCE
//   id          → l'id della scheda in `esplora-catalog.js`, scritto uguale.
//                 Se sbagli l'id la voce sparisce e basta, non rompe niente,
//                 ma non se ne accorge nessuno: lo controlla `controlla.js`.
//   optionIndex → facoltativo: quale variante, contando da 0 nell'ordine in
//                 cui stanno in `options.choices`. Serve quando il pacchetto
//                 vende una variante precisa (il jet ski da un'ora, lo
//                 stargazing in gruppo piccolo): quella finisce scritta fra
//                 parentesi nel messaggio all'ufficio. Senza, la scelta resta
//                 aperta e si concorda rispondendo — e' il caso del buggy,
//                 dove i quattro percorsi costano uguale e scegliere prima non
//                 serve a nessuno.
//
//   Gli indici che servono qui, presi dal catalogo:
//     buggy-volcano-4h    0 Offroad 3h · 1 Tramonto sul Teide · 2 Completo 4h
//                         3 Montagna su strada
//     jet-ski-safari-1-2h 0 quaranta minuti · 1 un'ora · 2 due ore
//     stargazing-group    0 gruppo grande · 1 gruppo piccolo
//     luxury-cruiser      0 tre ore in condivisione · 1 barca privata
//
// IL TEIDE UNA VOLTA SOLA
//   Vale quando si **scrive** un pacchetto, non quando lo si legge: il Parco
//   Nazionale ci puo' stare una volta. Tre salite allo stesso posto sono lo
//   stesso posto venduto tre volte, e il cliente se ne accorge il secondo
//   giorno. Le voci che ci salgono non sono solo quelle col Teide nel nome:
//     teide-national-park                il parco di giorno
//     stargazing-group                   ci si sale la sera, tutte e due le varianti
//     buggy-volcano-4h  optionIndex 1    "Tramonto sul Teide"
//     buggy-volcano-4h  optionIndex 2    "Completo": dentro c'e' il parco
//     quad-teide-adventure               tutte e due le varianti
//     trekking-bici     optionIndex 0    "Teide Light"
//     helicopter-tours  optionIndex 4    "Grand Teide Luxury"
//   Il buggy lasciato senza `optionIndex` puo' finire su un percorso del
//   Teide: dove succede, nel pacchetto non ci deve stare nient'altro che ci
//   salga.
//
// PREZZO A PERSONA E PREZZO A MEZZO
//   Attenzione ai pacchetti con buggy o jet ski: quelle schede hanno
//   `priceUnit` e il prezzo e' del **mezzo**, non della persona. I pacchetti
//   dove succede hanno il commento PREZZO MISTO qui sotto, e il numero che
//   mostrano e' quello di **una persona da sola** — vedi "IL NUMERO IN
//   VETRINA" piu' giu'.
//
// LO SCONTO
//   `sconto` e' una percentuale: oggi sono tutti al 10%: resta un campo per
//   pacchetto e non una costante unica perche' il primo pacchetto che va al
//   15% non deve costringere a riscrivere la struttura. Vale sui mezzi come
//   sulle persone — il buggy sconta come la barca — ma **non su tutto**:
//   vedi qui sotto.
//
// SU COSA LO SCONTO NON SI PUO' FARE
//   Su quello che si compra a prezzo fisso e si rivende uguale: un 10% in meno
//   uscirebbe dalla tasca di Admiral, non dal margine. Sono due elenchi, e
//   servono tutti e due.
//     1. I parchi e gli spettacoli — Siam Park, Monkey Park, il flamenco, il
//        drag show, il castello — per **categoria**, qui sotto. Cosi' un parco
//        o uno show nuovo e' gia' coperto il giorno che entra nel catalogo.
//     2. I giri in pullman con guida e i biglietti a giornata, con
//        `fixedPrice: true` sulla **scheda** (vedi il vocabolario in testa a
//        `esplora-catalog.js`). Qui la categoria non basta: i tour in bus
//        stanno in tre categorie diverse, e "Teide National Park" sta nella
//        stessa dello stargazing, che invece si sconta.
//   Il campo sta sulla scheda e non in un elenco dentro questo file perche' un
//   elenco lontano dai dati si dimentica, e dimenticarselo vuol dire promettere
//   al cliente uno sconto che l'ufficio non puo' fare.
//
// QUELLO CHE NON SI SCONTA NON SI SCRIVE IN PAGINA
//   Il sito non dice piu' **su cosa** lo sconto non si applica: niente nota
//   sotto il prezzo, niente "prezzo fisso" accanto alle voci (14 settembre
//   2026, scelta del proprietario). Quello che si vede resta vero e verificabile
//   — il prezzo pieno barrato, quello scontato e "Risparmi €X" — e sono numeri
//   giusti: il conto continua a togliere lo sconto solo dove si puo' fare. La
//   spiegazione la da' l'ufficio rispondendo, che e' anche dove si concorda il
//   pagamento.

// I PACCHETTI IN FAMIGLIA
//   `famiglia: true` marca i pacchetti fatti per chi viaggia coi bambini. Non
//   e' un'etichetta grafica: cambia tre cose.
//     1. Si vedono da soli su `pacchetti.html?famiglia=1`, che e' dove porta il
//        riquadro "In famiglia" della home. Nella pagina di tutti i pacchetti
//        ci sono lo stesso: un pacchetto di famiglia resta un pacchetto.
//     2. Ogni voce mostra **due** prezzi, adulti e bambini, con la fascia
//        d'eta' accanto. Su un pacchetto di famiglia il prezzo che conta e'
//        quello dei bambini, e farlo cercare scheda per scheda non ha senso.
//     3. Sotto il prezzo a persona compare il conto di una famiglia tipo — due
//        adulti e due bambini — che e' il numero vero che si va a cercare.
//
//   Perche' un pacchetto possa essere di famiglia servono tre cose, e
//   `controlla.js` le verifica tutte e tre:
//     - **tutte** le schede dentro hanno `family: true`. Una sola che non ce
//       l'ha e il pacchetto promette una vacanza coi bambini e dentro ha
//       qualcosa dove i bambini non salgono.
//     - **tutte** hanno un prezzo bambini vero (non 0, che vuol dire "non lo
//       sappiamo"). Se ne manca uno il conto della famiglia non si fa, e un
//       pacchetto di famiglia senza il conto della famiglia e' mezzo pacchetto.
//     - niente prezzi a mezzo (buggy, moto d'acqua): li' il totale non si puo'
//       fare finche' non si sa quanti mezzi servono, e la domanda "quanti
//       buggy per due adulti e due bambini" non ha una risposta scritta.
//
//   LE FASCE D'ETA' NON COMBACIANO FRA SCHEDE DIVERSE, ed e' normale: il
//   sottomarino chiama bambino un dodicenne (2-14), la goletta no (3-11). Per
//   questo la fascia si scrive accanto a ogni prezzo e il conto della famiglia
//   porta la sua nota: "due bambini" qui vuol dire due bambini **nella fascia
//   di quella escursione**. Un numero solo senza la nota sarebbe giusto per
//   alcune famiglie e falso per altre.
//
//   L'ETA' MINIMA SI SCRIVE NELLA DESCRIZIONE. Il kart dei ragazzi parte dai
//   7 anni, il gonfiabile dai 10: non e' un dettaglio da scoprire dopo aver
//   mandato la richiesta. Dove c'e' un limite, sta scritto nel testo del
//   pacchetto.

const PACCHETTI_SCONTO_DEFAULT = 10;

const PACCHETTI_CATEGORIE_SENZA_SCONTO = ["parchi-spettacoli"];

const PACCHETTI = [

  // ─── I CLASSICI ───────────────────────────────────────────────────────────

  {
    id: "tenerife-classico",
    // Il nome non si traduce: "Tenerife Trio" e' un nome, e vale nelle tre
    // lingue come i titoli delle escursioni. A tradursi e' solo quello che lo
    // descrive, cioe' "versione buggy" sull'altro.
    title: {
      it: "Tenerife Trio",
      en: "Tenerife Trio",
      es: "Tenerife Trio"
    },
    image: "teide-national-park.jpg",
    sconto: 10,
    // 39 + 55 + 44 = 138. Si sconta solo la barca: il Siam Park e' un
    // biglietto, il Teide in pullman e' `fixedPrice`. −5,50 → 132,50 a persona
    // Teide: una volta, di giorno.
    voci: [
      { id: "teide-national-park" },
      { id: "luxury-cruiser", optionIndex: 0 },
      { id: "siam-park" }
    ],
    desc: {
      it: "La montagna, il mare e il parco: tre giorni che coprono l'isola senza ripetersi. Il Teide in pullman con la guida, una giornata in barca da Las Galletas e il Siam Park.",
      en: "The mountain, the sea and the park: three days that cover the island without repeating themselves. Teide by coach with a guide, a day on the water from Las Galletas and Siam Park.",
      es: "La montaña, el mar y el parque: tres días que recorren la isla sin repetirse. El Teide en autocar con guía, un día en barco desde Las Galletas y el Siam Park."
    }
  },

  {
    id: "tenerife-buggy",
    // PREZZO MISTO: il buggy si paga a mezzo, le altre due a persona.
    // 180 + 55 + 44 = 279, ma il Siam Park non si sconta: −23,50 → 255,50
    // per una persona da sola.
    title: {
      it: "Tenerife Trio, versione buggy",
      en: "Tenerife Trio, buggy version",
      es: "Tenerife Trio, versión buggy"
    },
    image: "buggy-volcano-4h.jpg",
    sconto: 10,
    // Il percorso resta aperto: i quattro costano uguale e si concorda
    // rispondendo. Qui si puo' fare perche' nel pacchetto non c'e' nient'altro
    // che salga al Teide — se un giorno ci si aggiunge lo stargazing, il
    // percorso va fissato su `optionIndex: 0` (Offroad) o `3` (Montagna su
    // strada), gli unici due che al parco non ci vanno.
    voci: [
      { id: "buggy-volcano-4h" },
      { id: "luxury-cruiser", optionIndex: 0 },
      { id: "siam-park" }
    ],
    desc: {
      it: "Lo stesso trio, ma al volante: il buggy al posto del pullman, la giornata in barca da Las Galletas e il Siam Park. Il percorso del buggy lo scegliamo insieme quando rispondiamo.",
      en: "The same trio, but behind the wheel: a buggy instead of the coach, the day on the water from Las Galletas and Siam Park. We agree on the buggy route when we reply.",
      es: "El mismo trío, pero al volante: el buggy en lugar del autocar, el día en barco desde Las Galletas y el Siam Park. El recorrido del buggy lo elegimos juntos al responder."
    }
  },

  // ─── PER TEMA ─────────────────────────────────────────────────────────────

  {
    id: "terra-mare-stelle",
    // PREZZO MISTO: il buggy si paga a mezzo, barca e stelle a persona.
    // 180 + 55 + 79 = 314, tutto scontabile: −31,40 → 282,60 per una persona
    // da sola. E' il pacchetto con dentro tre dei quattro prodotti da
    // spingere e nessun biglietto a prezzo fisso: lo sconto si vede tutto.
    title: {
      it: "Terra, mare e stelle",
      en: "Land, sea and stars",
      es: "Tierra, mar y estrellas"
    },
    image: "teide-by-night.jpg",
    sconto: 10,
    voci: [
      // optionIndex 0 = "Offroad, 3 ore". Fissato apposta: e' un percorso che
      // al Parco Nazionale non sale, e la salita al Teide in questo pacchetto
      // e' gia' quella della sera.
      { id: "buggy-volcano-4h", optionIndex: 0 },
      { id: "luxury-cruiser", optionIndex: 0 },
      // optionIndex 1 = gruppo piccolo, in minivan.
      { id: "stargazing-group", optionIndex: 1 }
    ],
    desc: {
      it: "Tre giorni, tre modi di stare sull'isola: lo sterrato nel sud al volante del buggy, la costa vista dal mare con la barca da Las Galletas e la notte in quota col telescopio, in gruppo piccolo. Al Teide si sale una volta sola, e al buio.",
      en: "Three days, three ways to be on the island: the dirt tracks in the south at the wheel of a buggy, the coast seen from the water on the boat from Las Galletas, and the night up high with the telescope, in a small group. You go up to Teide once, and in the dark.",
      es: "Tres días, tres formas de vivir la isla: las pistas de tierra del sur al volante del buggy, la costa vista desde el mar en el barco de Las Galletas y la noche en altura con el telescopio, en grupo pequeño. Al Teide se sube una sola vez, y de noche."
    }
  },

  {
    id: "adrenalina",
    // PREZZO MISTO: buggy e jet ski si pagano a mezzo, il parascending a persona.
    // 180 + 100 + 55 = 335, tutto scontabile: −33,50 → 301,50 per una persona
    // da sola.
    title: {
      it: "Adrenalina",
      en: "Adrenaline",
      es: "Adrenalina"
    },
    image: "parascending.jpg",
    sconto: 10,
    voci: [
      // optionIndex 2 = "Completo, 4 ore", il percorso lungo. Dentro c'e' il
      // Parco Nazionale: e' l'unica salita al Teide di questo pacchetto.
      { id: "buggy-volcano-4h", optionIndex: 2 },
      // optionIndex 1 = un'ora. I quaranta minuti sono un assaggio, le due ore
      // sono un'altra spesa: l'ora e' quella che si vende.
      { id: "jet-ski-safari-1-2h", optionIndex: 1 },
      { id: "parascending" }
    ],
    desc: {
      it: "Terra, acqua e aria in tre giorni: il buggy sul percorso lungo, un'ora di safari in moto d'acqua e il volo col paracadute trainato dalla barca.",
      en: "Land, water and air in three days: the buggy on the long route, an hour of jet ski safari and the parachute flight towed by the boat.",
      es: "Tierra, agua y aire en tres días: el buggy en el recorrido largo, una hora de safari en moto de agua y el vuelo en paracaídas remolcado por la lancha."
    }
  },

  {
    id: "mare-a-tutto-gas",
    // PREZZO MISTO: il jet ski si paga a mezzo, le altre due a persona.
    // 55 + 100 + 15 = 170, tutto scontabile: −17,00 → 153,00 per una persona
    // da sola.
    title: {
      it: "Mare a tutto gas",
      en: "Sea, full throttle",
      es: "Mar a todo gas"
    },
    image: "jet-ski-safari-1-2h.jpg",
    sconto: 10,
    voci: [
      { id: "luxury-cruiser", optionIndex: 0 },
      { id: "jet-ski-safari-1-2h", optionIndex: 1 },
      { id: "banana-boat" }
    ],
    desc: {
      it: "Il mare con calma e il mare di corsa: la giornata in barca da Las Galletas, un'ora di moto d'acqua lungo la costa e dieci minuti di banana con le risate.",
      en: "The sea slow and the sea fast: the day on the water from Las Galletas, an hour on a jet ski along the coast and ten minutes on the banana boat.",
      es: "El mar con calma y el mar a toda velocidad: el día en barco desde Las Galletas, una hora de moto de agua por la costa y diez minutos de banana entre risas."
    }
  },

  {
    id: "cielo-e-mare",
    title: {
      it: "Cielo e mare",
      en: "Sky and sea",
      es: "Cielo y mar"
    },
    image: "luxury-cruiser-2.jpg",
    sconto: 10,
    // 79 + 55 + 51 = 185, ma il flamenco non si sconta: −13,40 → 171,60 a persona
    voci: [
      { id: "stargazing-group", optionIndex: 1 },
      { id: "luxury-cruiser", optionIndex: 0 },
      { id: "flamenco-show" }
    ],
    desc: {
      // Prima diceva "per chi viaggia in due": il pacchetto e' rimasto, la
      // riga sulla coppia no. Quello che lo tiene insieme e' l'orario — tre
      // cose che si fanno tardi — e vale per chiunque, non per una coppia.
      it: "Tre appuntamenti lenti, tutti nella seconda metà della giornata: le stelle dal Teide in gruppo piccolo, il pomeriggio in barca da Las Galletas e il flamenco. Niente sveglie presto, niente code.",
      en: "Three unhurried outings, all in the second half of the day: the stars from Teide in a small group, an afternoon on the water from Las Galletas and a flamenco show. No early starts, no queues.",
      es: "Tres citas tranquilas, todas en la segunda mitad del día: las estrellas desde el Teide en grupo pequeño, la tarde en barco desde Las Galletas y el flamenco. Sin madrugones y sin colas."
    }
  },

  {
    id: "tre-sere",
    title: {
      it: "Tre sere a Tenerife",
      en: "Three nights in Tenerife",
      es: "Tres noches en Tenerife"
    },
    image: "castillo-san-miguel.jpg",
    sconto: 10,
    // 49 + 49,50 + 79 = 177,50, ma si sconta solo lo stargazing (i due show
    // sono a prezzo fisso): −7,90 → 169,60 a persona.
    //
    // Il terzo era "history-music-show", e i tre show insieme facevano un
    // pacchetto che **non risparmiava niente**: tre biglietti a prezzo fisso
    // messi in fila non sono un pacchetto, sono un elenco. Al suo posto lo
    // stargazing in gruppo piccolo, che e' l'unica serata scontabile del
    // catalogo con un prezzo a persona (le altre serali si pagano a mezzo o
    // non hanno un prezzo leggibile) — ed e' uno dei prodotti da spingere.
    voci: [
      { id: "mht-drag-show" },
      { id: "castillo-san-miguel" },
      // optionIndex 1 = gruppo piccolo, in minivan.
      { id: "stargazing-group", optionIndex: 1 }
    ],
    desc: {
      // "cena compresa" valeva per tre show; adesso la terza sera e' un picnic
      // al tramonto in quota, che la scheda dello stargazing dice a chiare
      // lettere non essere una cena a tavola. Scritto come e'.
      it: "Tre sere fuori: il drag show con la cena, la notte medievale al castello e le stelle dal Teide, con il picnic al tramonto sopra le nuvole. Per chi sta in hotel a mezza pensione e la sera esce.",
      en: "Three evenings out: the drag show with dinner, the medieval night at the castle and the stars from Teide, with a picnic at sunset above the clouds. For anyone on half board who goes out in the evening.",
      es: "Tres noches fuera: el drag show con cena, la noche medieval en el castillo y las estrellas desde el Teide, con picnic al atardecer por encima de las nubes. Para quien está en media pensión y sale por la noche."
    }
  },

  // ─── IN FAMIGLIA ──────────────────────────────────────────────────────────
  // Da qui in giu' i pacchetti con `famiglia: true`: le regole stanno in testa
  // al file, sotto "I PACCHETTI IN FAMIGLIA". Niente mezzi da dividere, niente
  // notti fuori tranne quella delle stelle (e li' e' scritto che si torna
  // tardi), e ogni scheda col suo prezzo bambini.

  {
    id: "famiglia-mare",
    // 27 + 61 + 36 = 124 a persona, bambini 13 + 37 + 29 = 79. L'Aqualand e' un
    // biglietto e non si sconta: −8,80 sul prezzo di un adulto → 115,20.
    title: {
      it: "Il mare dei bambini",
      en: "The sea for kids",
      es: "El mar de los niños"
    },
    image: "submarine-safari.jpg",
    sconto: 10,
    famiglia: true,
    voci: [
      { id: "peter-pan" },
      { id: "submarine-safari" },
      { id: "aqualand" }
    ],
    desc: {
      it: "Il mare guardato da sopra, da sotto e a tutta velocità: due ore sulla goletta di legno da Los Cristianos a cercare delfini e globicefali, un'ora nel sottomarino giallo dove ogni posto ha il suo oblò, e una giornata di scivoli all'Aqualand.",
      en: "The sea seen from above, from below and at full speed: two hours on the wooden schooner out of Los Cristianos looking for dolphins and pilot whales, an hour in the yellow submarine where every seat has its own porthole, and a day of slides at Aqualand.",
      es: "El mar visto desde arriba, desde abajo y a toda velocidad: dos horas en la goleta de madera desde Los Cristianos buscando delfines y calderones, una hora en el submarino amarillo donde cada asiento tiene su ojo de buey, y un día de toboganes en Aqualand."
    }
  },

  {
    id: "famiglia-animali",
    // 55 + 44 + 10 = 109 a persona, bambini 30 + 32 + 5 = 67. Loro Parque e
    // Monkey Park sono biglietti: si sconta solo la barca a vela, −5,50 → 103,50.
    title: {
      it: "Animali da vicino",
      en: "Animals up close",
      es: "Animales de cerca"
    },
    image: "loro-parque.jpg",
    sconto: 10,
    famiglia: true,
    voci: [
      { id: "whale-dolphin-3h" },
      { id: "loro-parque" },
      { id: "monkey-park" }
    ],
    desc: {
      it: "Gli animali dove vivono e gli animali da toccare: tre ore in barca a vela da Puerto Colón in cerca di balene e delfini, una giornata al Loro Parque e il Monkey Park, il piccolo zoo dove si entra nei recinti e si dà da mangiare a lemuri, iguane e pappagalli.",
      en: "Animals where they live and animals you can touch: three hours on a sailing boat from Puerto Colón looking for whales and dolphins, a day at Loro Parque and Monkey Park, the little zoo where you walk into the enclosures and feed lemurs, iguanas and parrots.",
      es: "Los animales donde viven y los animales que se tocan: tres horas en velero desde Puerto Colón buscando ballenas y delfines, un día en el Loro Parque y el Monkey Park, el pequeño zoo donde se entra en los recintos y se da de comer a lémures, iguanas y loros."
    }
  },

  {
    id: "famiglia-piccoli",
    // 24 + 58 + 35 = 117 a persona, bambini 12 + 45 + 29 = 86. Il Jungle Park e'
    // un biglietto: si scontano tuk tuk e barca, −8,20 → 108,80.
    title: {
      it: "Piccoli esploratori",
      en: "Little explorers",
      es: "Pequeños exploradores"
    },
    image: "tuk-tuk.jpg",
    sconto: 10,
    famiglia: true,
    voci: [
      { id: "tuk-tuk" },
      { id: "glass-bottom-boat" },
      { id: "jungle-park" }
    ],
    desc: {
      it: "Tre uscite tranquille, per chi ha bambini piccoli: un'ora in tuk tuk elettrico sulla costa di Adeje con la guida che racconta, tre ore sulla barca col fondo di vetro a guardare i pesci restando a bordo, e una giornata al Jungle Park fra i rapaci in volo libero e le scimmie.",
      en: "Three unhurried outings, for families with small children: an hour in an electric tuk tuk along the Adeje coast with a guide, three hours on the glass-bottom boat watching the fish without leaving the deck, and a day at Jungle Park among free-flying birds of prey and monkeys.",
      es: "Tres salidas tranquilas, para quien viaja con niños pequeños: una hora en tuk tuk eléctrico por la costa de Adeje con un guía que cuenta, tres horas en el barco con fondo de cristal mirando los peces sin bajar de a bordo, y un día en el Jungle Park entre rapaces en vuelo libre y monos."
    }
  },

  {
    id: "famiglia-ragazzi",
    // 22 + 15 + 44 = 81 a persona, bambini 16 + 15 + 32 = 63. Il Siam Park e' un
    // biglietto: si scontano kart e gonfiabile, −3,70 → 77,30.
    // Le eta' minime sono nella descrizione, e vengono dalle fasce delle schede:
    // kart dei ragazzi 7-13, gonfiabile 10-15. Chi ha un bambino di sei anni
    // deve saperlo prima di mandare la richiesta, non dopo.
    title: {
      it: "Per i ragazzi grandi",
      en: "For the big kids",
      es: "Para los mayores"
    },
    image: "karting.jpg",
    sconto: 10,
    famiglia: true,
    voci: [
      { id: "karting" },
      { id: "banana-boat" },
      { id: "siam-park" }
    ],
    desc: {
      it: "Per chi in famiglia non è più un bambino piccolo: dieci minuti di kart sulla pista di Fañabé, una corsa sul gonfiabile trainato dal motoscafo davanti a Puerto Colón e una giornata al Siam Park. Sul kart dei ragazzi si sale dai 7 anni, sul gonfiabile dai 10.",
      en: "For the ones in the family who aren't little any more: ten minutes of karting on the Fañabé track, a ride on the inflatable towed by the speedboat off Puerto Colón and a day at Siam Park. The kids' kart starts at 7, the inflatable at 10.",
      es: "Para quien en la familia ya no es un niño pequeño: diez minutos de kart en el circuito de Fañabé, una vuelta en el hinchable remolcado por la lancha frente a Puerto Colón y un día en el Siam Park. En el kart de los chicos se sube desde los 7 años; en el hinchable, desde los 10."
    }
  },

  {
    id: "famiglia-stelle",
    // 79 + 55 + 44 = 178 a persona, bambini 69 + 35 + 32 = 136. Il Siam Park e'
    // un biglietto: si scontano stelle e barca, −13,40 → 164,60.
    // Teide: una volta sola, ed e' quella della sera.
    title: {
      it: "Stelle in famiglia",
      en: "Stars as a family",
      es: "Estrellas en familia"
    },
    image: "stargazing-group.jpg",
    sconto: 10,
    famiglia: true,
    voci: [
      // optionIndex 1 = gruppo piccolo, in minivan e anche in italiano.
      { id: "stargazing-group", optionIndex: 1 },
      { id: "luxury-cruiser", optionIndex: 0 },
      { id: "siam-park" }
    ],
    desc: {
      it: "Una serata grande e due giornate con calma: il tramonto sopra le nuvole col picnic e il telescopio, in gruppo piccolo, poi tre ore in barca da Las Galletas con la sosta per il bagno e una giornata al Siam Park. Dal Teide si torna tardi: il giorno dopo, sveglia con comodo.",
      en: "One big evening and two easy days: sunset above the clouds with a picnic and the telescope, in a small group, then three hours on the water from Las Galletas with a swim stop and a day at Siam Park. You get back from Teide late, so take the next morning slowly.",
      es: "Una noche grande y dos días con calma: el atardecer por encima de las nubes con picnic y telescopio, en grupo pequeño, luego tres horas en barco desde Las Galletas con parada de baño y un día en el Siam Park. Del Teide se vuelve tarde: al día siguiente, sin madrugar."
    }
  }

];

// ─────────────────────────────────────────────────────────────────────────
// IL CONTO
//
// DOVE STA IL PREZZO DI UNA VOCE
//   Non sempre nello stesso posto. Tre schede di questi pacchetti hanno
//   `priceAdult: 0` e il prezzo dentro la variante: stargazing (75 o 79 a
//   persona), buggy e jet ski (180 e 100, ma **a mezzo**). Sommare `priceAdult`
//   e basta le farebbe entrare nel conto come se fossero gratis. Quindi si
//   legge in quest'ordine: la variante scelta dal pacchetto, poi la scheda, e
//   dove il prezzo e' del mezzo si ripiega su `priceFrom` (il mezzo piu'
//   piccolo, cioe' il numero piu' basso che quella scheda puo' costare).
//
// IL NUMERO IN VETRINA
//   Dove sono tutti prezzi a persona il numero e' esatto: "€124,20 a persona".
//   Dove c'e' un mezzo no, perche' il buggy si divide fra chi ci sale: da solo
//   sono 180 a testa, in due 90. Il numero che mettiamo e' quello di **una
//   persona da sola**, cioe' il piu' alto: e' l'unico che al cliente puo' solo
//   scendere quando si sa quanti sono. Un "da €170" (il prezzo in due) sarebbe
//   piu' bello e sarebbe la cosa che fa arrabbiare: chi viaggia da solo se lo
//   vedrebbe **salire** al momento della richiesta.
//
// IL CONTO VERO
//   Lo fa la finestra della richiesta, una escursione alla volta, e poi la
//   lista che le somma. Qui dentro non si prenota niente: questa pagina serve
//   a far vedere che cosa c'e' dentro e quanto si risparmia.
// ─────────────────────────────────────────────────────────────────────────

// I prezzi si moltiplicano per una percentuale, e 138 * 0.9 in JavaScript fa
// 124.19999999999999. Senza questo, un pacchetto su due mostrerebbe un numero
// con dodici decimali.
function pacchettoArrotonda(n) {
  return Math.round(n * 100) / 100;
}

function pacchettoDi(id) {
  return PACCHETTI.find(p => p.id === id) || null;
}

function pacchettoSconto(pack) {
  return pack.sconto === undefined ? PACCHETTI_SCONTO_DEFAULT : pack.sconto;
}

// La scheda di catalogo di una voce, oppure null se l'id e' scritto male o la
// scheda non e' piu' pubblicata. Chi chiama deve saperlo gestire: un pacchetto
// con una voce che non c'e' non si mostra.
function pacchettoVoceTour(voce) {
  if (typeof ESPLORA_CATALOG === "undefined") return null;
  return ESPLORA_CATALOG.find(t => t.id === voce.id && t.published) || null;
}

// La variante che il pacchetto ha deciso, se l'ha decisa.
function pacchettoVoceVariante(voce, tour) {
  const scheda = tour || pacchettoVoceTour(voce);
  if (!scheda || voce.optionIndex === undefined) return null;
  const scelte = scheda.options && scheda.options.choices;
  return (Array.isArray(scelte) && scelte[voce.optionIndex]) || null;
}

// Il prezzo di una voce, con scritto **di che tipo** e':
//   { tipo: "persona", prezzo }  il prezzo di un adulto
//   { tipo: "mezzo",   prezzo }  il prezzo del mezzo piu' piccolo
//   null                         non si riesce a leggere: il pacchetto non
//                                mostra nessun numero invece di mostrarne uno
//                                inventato
function pacchettoVocePrezzo(voce) {
  const tour = pacchettoVoceTour(voce);
  if (!tour) return null;
  const variante = pacchettoVoceVariante(voce, tour);

  // Dove il prezzo e' del mezzo, `priceAdult` sulla scheda e' 0 e non vuol dire
  // gratis: vuol dire "qui non si paga a persona". Si guarda prima questo.
  if (tour.units || tour.priceUnit) {
    const prezzo = (variante && variante.price) || tour.priceFrom;
    return prezzo ? { tipo: "mezzo", prezzo: prezzo } : null;
  }

  // Una variante con `price` e senza `priceAdult` e' il prezzo di tutta la cosa
  // — la barca privata del Luxury Cruiser, le cabine VIP del Siam Park — anche
  // quando la scheda non ha `units`. Senza questa riga si ricadeva su
  // `tour.priceAdult` e la barca privata da 450 entrava nel conto a 55: il
  // prezzo del posto singolo spacciato per quello dell'intera barca.
  if (variante && variante.priceAdult === undefined && variante.price) {
    return { tipo: "mezzo", prezzo: variante.price };
  }

  const adulto = (variante && variante.priceAdult !== undefined)
    ? variante.priceAdult
    : tour.priceAdult;
  return adulto ? { tipo: "persona", prezzo: adulto } : null;
}

// Il prezzo di un bambino su una voce, o null dove non c'e'.
//
// Zero **non** e' un prezzo: sulle schede `priceChild: 0` vuol dire "non lo
// sappiamo ancora" (il vocabolario in testa a `esplora-catalog.js`), e infatti
// la riga del prezzo bambini li' non si accende nemmeno. Trattarlo come gratis
// farebbe uscire una famiglia di quattro al prezzo di due adulti: un numero
// verosimile e falso, che e' il tipo peggiore.
function pacchettoVocePrezzoBambino(voce) {
  const tour = pacchettoVoceTour(voce);
  if (!tour) return null;
  const variante = pacchettoVoceVariante(voce, tour);
  const bambino = (variante && variante.priceChild !== undefined)
    ? variante.priceChild
    : tour.priceChild;
  return bambino > 0 ? bambino : null;
}

// I pacchetti per chi viaggia coi bambini. Le regole stanno in testa al file.
function pacchettoDiFamiglia(pack) {
  return pack.famiglia === true;
}

// Su questa voce lo sconto si puo' fare? Una scheda che non si trova non si
// sconta: nel dubbio si sconta di meno, mai di piu' di quello che si puo'.
//
// Due strade, e servono tutte e due. La **categoria** copre i parchi e gli
// spettacoli in blocco, cosi' un parco nuovo e' escluso il giorno che entra in
// catalogo senza che nessuno se ne ricordi. Il campo **`fixedPrice`** copre
// quello che una categoria non sa dire: i giri in pullman con guida stanno in
// tre categorie diverse, e nella stessa categoria dello stargazing, che invece
// si sconta. La variante vince sulla scheda, come per `days` e `times`.
function pacchettoVoceScontabile(voce) {
  const tour = pacchettoVoceTour(voce);
  if (!tour) return false;
  // Basta una categoria sola fra quelle senza sconto: una scheda che sta nei
  // parchi e anche nei tour resta comunque un biglietto comprato a prezzo
  // fisso, e scontarlo toglierebbe il 10% al margine di Admiral.
  if (categorieDi(tour).some(id => PACCHETTI_CATEGORIE_SENZA_SCONTO.indexOf(id) >= 0)) return false;
  const variante = pacchettoVoceVariante(voce, tour);
  if (variante && variante.fixedPrice !== undefined) return !variante.fixedPrice;
  return !tour.fixedPrice;
}

// Il conto di un pacchetto:
//   pieno      la somma di tutto
//   scontabile la parte su cui lo sconto si puo' fare
//   risparmio  quanto si toglie davvero — il numero che il cliente guarda
//   scontato   quello che paga: pieno meno risparmio
//   misto      c'e' dentro almeno un prezzo a mezzo: il numero vale per una
//              persona da sola e va scritto con la sua nota
// Torna null se anche una sola voce non ha un prezzo leggibile.
function pacchettoConto(pack) {
  let pieno = 0;
  let scontabile = 0;
  let misto = false;
  let completo = true;

  pack.voci.forEach(voce => {
    const p = pacchettoVocePrezzo(voce);
    if (!p) { completo = false; return; }
    if (p.tipo === "mezzo") misto = true;
    pieno += p.prezzo;
    if (pacchettoVoceScontabile(voce)) scontabile += p.prezzo;
  });
  if (!completo) return null;

  const sconto = pacchettoSconto(pack);
  const risparmio = pacchettoArrotonda(scontabile * sconto / 100);
  return {
    pieno: pacchettoArrotonda(pieno),
    scontabile: pacchettoArrotonda(scontabile),
    risparmio: risparmio,
    scontato: pacchettoArrotonda(pieno - risparmio),
    sconto: sconto,
    misto: misto
  };
}

// ─────────────────────────────────────────────────────────────────────────
// IL PACCHETTO SI CHIEDE INTERO
//
// Un pacchetto non si smonta: il cliente lo chiede tutto con una richiesta
// sola, e le tre escursioni non si aggiungono una alla volta alla lista. Sono
// **dentro** il pacchetto, e i tre giorni li mette d'accordo l'ufficio quando
// risponde — che e' poi quello che succede gia' al telefono.
//
// Per questo qui non si chiede un orario: tre escursioni in tre giorni diversi
// non hanno un'ora sola da scegliere, e chiederla darebbe l'idea di una
// prenotazione che questo sito non fa. Si chiede il minimo per poter
// rispondere: da che giorno, in quanti, dove alloggia e il nome.
// ─────────────────────────────────────────────────────────────────────────

// Il totale di un pacchetto per una comitiva, o `null` quando non si puo' fare.
// I tre casi in cui torna null sono tutti lo stesso caso — meglio niente che un
// numero falso, la regola della finestra della richiesta:
//   - una voce si paga a mezzo (buggy, jet ski): finche' non si sa quanti
//     mezzi servono, un totale a persona non esiste
//   - ci sono bambini e una delle escursioni il prezzo dei bambini non ce l'ha
//   - una voce non ha un prezzo leggibile
function pacchettoTotale(pack, adulti, bambini) {
  const n = Math.max(1, parseInt(adulti, 10) || 0);
  const k = Math.max(0, parseInt(bambini, 10) || 0);

  let unAdulto = 0;
  let unBambino = 0;
  let scontabileAdulto = 0;
  let scontabileBambino = 0;
  let possibile = true;

  pack.voci.forEach(voce => {
    const tour = pacchettoVoceTour(voce);
    const prezzo = pacchettoVocePrezzo(voce);
    if (!tour || !prezzo || prezzo.tipo === "mezzo") { possibile = false; return; }

    // `null` quando il prezzo dei bambini non c'e' **o e' zero**: zero vuol
    // dire "non lo sappiamo", non "gratis". Con dei bambini dentro, un totale
    // che li conta a zero e' piu' basso del vero, e il cliente lo scopre
    // quando l'ufficio gli risponde con un altro numero. Stessa regola della
    // finestra della richiesta di una singola escursione.
    const bambino = pacchettoVocePrezzoBambino(voce);
    if (k > 0 && !bambino) { possibile = false; return; }

    unAdulto += prezzo.prezzo;
    unBambino += bambino || 0;
    if (pacchettoVoceScontabile(voce)) {
      scontabileAdulto += prezzo.prezzo;
      scontabileBambino += bambino || 0;
    }
  });
  if (!possibile) return null;

  const pieno = unAdulto * n + unBambino * k;
  const base = scontabileAdulto * n + scontabileBambino * k;
  const risparmio = pacchettoArrotonda(base * pacchettoSconto(pack) / 100);
  return {
    pieno: pacchettoArrotonda(pieno),
    risparmio: risparmio,
    totale: pacchettoArrotonda(pieno - risparmio)
  };
}

// "Teide National Park + Luxury Cruiser Experience (3 ore, in condivisione) +
// Siam Park": cosa c'e' dentro, per il messaggio. La variante fra parentesi
// solo dove il pacchetto l'ha decisa, perche' li' non e' una scelta del
// cliente ma parte di quello che sta chiedendo.
function pacchettoVociTesto(pack) {
  return pack.voci.map(voce => {
    const tour = pacchettoVoceTour(voce);
    if (!tour) return "";
    const variante = pacchettoVoceVariante(voce, tour);
    return tf(tour.title) + (variante ? " (" + tf(variante.label) + ")" : "");
  }).filter(Boolean).join(" + ");
}

function pacchettoWhatsappUrl(pack, req) {
  const righe = [
    "• " + t("pack.inside") + ": " + pacchettoVociTesto(pack),
    // "Dal giorno" e non "Data": e' il primo dei tre, non una data fissa, e
    // l'ufficio deve saperlo leggendo il messaggio.
    "• " + t("wa.fromDay") + ": " + formatDate(req.date),
    "• " + t("wa.people") + ": " + peopleText(req.adults, req.kids, 0)
  ];
  if (req.hotel) righe.push("• " + t("wa.hotel") + ": " + req.hotel);
  if (req.note) righe.push("• " + t("wa.notes") + ": " + req.note);

  const conto = pacchettoTotale(pack, req.adults, req.kids);
  if (conto) {
    righe.push("• " + t("wa.total") + ": €" + eur(conto.totale) +
      (conto.risparmio > 0 ? " (" + t("pack.save", { n: eur(conto.risparmio) }) + ")" : ""));
  } else {
    // Niente totale: invece di tacere si dice **perche'**, o all'ufficio
    // arriva una richiesta che sembra dimenticarsi il prezzo.
    righe.push("• " + t("pack.unitAsk"));
  }

  const testo = t("wa.introPack", { name: req.name, pack: tf(pack.title) }) +
    "\n\n" + righe.join("\n");
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(testo);
}

// La finestra della richiesta del pacchetto. Costruita qui in JavaScript e non
// nell'HTML per la stessa ragione della lista: quella delle escursioni e' gia'
// scritta due volte (escursioni.html e tour.html) e tenerle allineate e' una
// fatica che si paga a ogni modifica. Questa e' anche piu' corta — niente
// orario, niente varianti, niente mezzi da contare — quindi copiare l'altra
// sarebbe stato portarsi dietro dieci campi da nascondere.
function initPacchettoRichiesta() {
  if (typeof WHATSAPP_NUMBER === "undefined" || !WHATSAPP_NUMBER) return;

  const scrim = document.createElement("div");
  scrim.className = "ticket-scrim";
  scrim.hidden = true;
  document.body.appendChild(scrim);

  const dialog = document.createElement("div");
  dialog.className = "ticket-dialog request-dialog";
  dialog.id = "packDialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "packDialogTitle");
  dialog.hidden = true;
  document.body.appendChild(dialog);

  let corrente = null;

  function disegna() {
    if (!corrente) return;
    const conto = pacchettoTotale(corrente, 2, 0);
    dialog.innerHTML = `
      <div class="ticket-dialog-head">
        <h2 id="packDialogTitle">${esc(t("pack.ask"))}</h2>
        <button class="iconbtn" type="button" data-pack-close
                aria-label="${esc(t("common.close"))}">✕</button>
      </div>
      <p class="request-activity">${esc(tf(corrente.title))}</p>
      <form data-pack-form>
        <label for="packName">${esc(t("req.name"))}</label>
        <input id="packName" name="name" type="text" autocomplete="name"
               placeholder="${esc(t("req.namePlaceholder"))}" required />

        <label for="packDate">${esc(t("pack.fromDay"))}</label>
        <input id="packDate" name="date" type="date" required
               min="${minRequestDate()}" max="${maxRequestDate()}" />
        <p class="hint">${esc(t("pack.fromDayHint"))}</p>

        <span class="request-people-label">${esc(t("req.people"))}</span>
        <div class="request-people">
          <label for="packAdults"><span>${esc(t("req.adults"))}</span>
            <input id="packAdults" name="adults" type="number" inputmode="numeric"
                   min="1" max="30" value="2" required />
          </label>
          <label for="packKids"><span>${esc(t("req.kids"))}</span>
            <input id="packKids" name="kids" type="number" inputmode="numeric"
                   min="0" max="30" value="0" />
          </label>
        </div>

        <p class="request-total" data-pack-total></p>

        <label for="packHotel"><span>${esc(t("req.hotel"))}</span>
          <span class="request-optional">${esc(t("req.hotelWhy"))}</span></label>
        <input id="packHotel" name="hotel" type="text" autocomplete="off"
               placeholder="${esc(t("pack.hotelPlaceholder"))}" />

        <label for="packNote"><span>${esc(t("wa.notes"))}</span>
          <span class="request-optional">${esc(t("req.optional"))}</span></label>
        <input id="packNote" name="note" type="text" autocomplete="off"
               placeholder="${esc(t("req.notePlaceholder"))}" />

        <button class="btn btn-primary btn-block request-submit" type="submit">
          ${esc(t("req.submit"))}</button>
        <p class="hint">${esc(t("pack.askHint"))}</p>
        <p class="hint request-privacy">${esc(t("req.privacy"))}</p>
      </form>`;
    aggiornaTotale();
  }

  // Il totale si rifa' a ogni numero battuto: il cliente mette 4 adulti e vede
  // il conto cambiare li', senza mandare niente.
  function aggiornaTotale() {
    const el = dialog.querySelector("[data-pack-total]");
    if (!el || !corrente) return;
    const adulti = dialog.querySelector("#packAdults").value;
    const bambini = dialog.querySelector("#packKids").value;
    const conto = pacchettoTotale(corrente, adulti, bambini);
    if (!conto) {
      el.hidden = false;
      el.textContent = t("pack.unitAsk");
      return;
    }
    el.hidden = false;
    el.textContent = t("wa.total") + ": €" + eur(conto.totale) +
      (conto.risparmio > 0 ? " · " + t("pack.save", { n: eur(conto.risparmio) }) : "");
  }

  function apri(pack) {
    corrente = pack;
    disegna();
    dialog.hidden = false;
    scrim.hidden = false;
    requestAnimationFrame(() => {
      dialog.classList.add("is-open");
      scrim.classList.add("is-visible");
    });
    document.body.classList.add("menu-open");
  }

  function chiudi() {
    dialog.classList.remove("is-open");
    scrim.classList.remove("is-visible");
    document.body.classList.remove("menu-open");
    setTimeout(() => {
      dialog.hidden = true;
      scrim.hidden = true;
    }, 300);
  }

  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-pack-ask]");
    if (!btn) return;
    const pack = pacchettoDi(btn.dataset.packAsk);
    if (pack) apri(pack);
  });

  dialog.addEventListener("click", e => {
    if (e.target.closest("[data-pack-close]")) chiudi();
  });
  scrim.addEventListener("click", chiudi);
  dialog.addEventListener("input", aggiornaTotale);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && dialog.classList.contains("is-open")) chiudi();
  });
  // Cambio lingua a finestra aperta: si riscrive com'e', coi campi gia'
  // riempiti — il nome scritto a meta' non si perde.
  document.addEventListener("islalang", () => {
    if (!dialog.classList.contains("is-open")) return;
    const vecchi = ["packName", "packDate", "packAdults", "packKids", "packHotel", "packNote"]
      .map(id => [id, (dialog.querySelector("#" + id) || {}).value]);
    disegna();
    vecchi.forEach(([id, val]) => {
      const campo = dialog.querySelector("#" + id);
      if (campo && val) campo.value = val;
    });
    aggiornaTotale();
  });

  dialog.addEventListener("submit", e => {
    e.preventDefault();
    if (!corrente) return;
    const req = {
      name: dialog.querySelector("#packName").value.trim(),
      date: dialog.querySelector("#packDate").value,
      adults: parseInt(dialog.querySelector("#packAdults").value, 10) || 1,
      kids: parseInt(dialog.querySelector("#packKids").value, 10) || 0,
      hotel: dialog.querySelector("#packHotel").value.trim(),
      note: dialog.querySelector("#packNote").value.trim()
    };
    if (!req.name || !req.date) return;
    chiudi();
    window.location.href = pacchettoWhatsappUrl(corrente, req);
  });
}

// ─────────────────────────────────────────────────────────────────────────
// LE DUE PAGINE
//
// `pacchetti.html` e' la vetrina: i riquadri, stile bento come in home.
// `pacchetto.html?id=...` e' il pacchetto aperto, con un indirizzo suo da
// mandare a un cliente ("ti mando il pacchetto Adrenalina") invece della
// pagina di tutti e otto.
// ─────────────────────────────────────────────────────────────────────────

function pacchettoHref(pack) {
  return "./pacchetto.html?id=" + encodeURIComponent(pack.id);
}

// Il prezzo come si scrive in vetrina: barrato + scontato dove c'e' uno
// sconto, il numero solo dove non c'e' niente da togliere (barrare un numero e
// riscrivere lo stesso numero e' una finta offerta).
function pacchettoPrezzoHTML(conto) {
  if (!conto) {
    return `<span class="pack-price"><strong>${esc(t("pack.noPrice"))}</strong></span>`;
  }
  const barrato = conto.risparmio > 0
    ? `<s class="price-before">€${esc(eur(conto.pieno))}</s> `
    : "";
  return `<span class="pack-price">${barrato}<strong>€${esc(eur(conto.scontato))}</strong>
      <small>${esc(t("pack.perPerson"))}</small></span>`;
}

// Il riquadro della vetrina: foto, titolo e prezzo, e si tocca tutto.
function pacchettoTileHTML(pack) {
  const conto = pacchettoConto(pack);
  return `
    <li class="pack-tile">
      <a class="pack-tile-link" href="${pacchettoHref(pack)}">
        <img src="./assets/${encodeURIComponent(pack.image)}" alt="" loading="lazy" />
        <span class="pack-tile-testo">
          <strong>${esc(tf(pack.title))}</strong>
          <span class="pack-tile-prezzo">${pacchettoPrezzoHTML(conto)}</span>
        </span>
        ${conto && conto.risparmio > 0
          ? `<span class="pack-badge">${esc(t("pack.save", { n: eur(conto.risparmio) }))}</span>`
          : ""}
      </a>
    </li>`;
}

// La vista "In famiglia" e' la stessa pagina con un indirizzo diverso,
// `pacchetti.html?famiglia=1`, non una pagina nuova: la vetrina, la finestra
// della richiesta e il conto sono gli stessi, cambiano il titolo e quali
// pacchetti si vedono. Una seconda pagina copiata sarebbe un secondo posto da
// aggiornare a ogni modifica — e' gia' successo con la finestra della
// richiesta, scritta due volte fra `escursioni.html` e `tour.html`.
//
// Il vestito si cambia spostando le **chiavi** di i18n, non scrivendo il testo:
// cosi' il cambio lingua continua a funzionare da solo, che e' il lavoro di
// `applyI18n`. Si fa una volta al caricamento, non a ogni ridisegno.
function pacchettiVestiDaFamiglia() {
  const cambia = (chiaveVecchia, chiaveNuova) => {
    const el = document.querySelector('[data-i18n="' + chiaveVecchia + '"]');
    if (el) el.dataset.i18n = chiaveNuova;
  };
  cambia("packs.eyebrow", "packs.familyEyebrow");
  cambia("packs.title", "packs.familyTitle");
  cambia("packs.intro", "packs.familyIntro");

  const meta = document.querySelector('[data-i18n-content="meta.packs.desc"]');
  if (meta) meta.dataset.i18nContent = "meta.family.desc";
  if (document.body.dataset.i18nDoctitle === "meta.packs.title") {
    document.body.dataset.i18nDoctitle = "meta.family.title";
  }

  // I due modi di uscire di qui: le escursioni per bambini una per una, o
  // tutti i pacchetti. Nella pagina normale questo piede resta nascosto.
  const piede = document.querySelector("[data-pack-foot]");
  if (piede) piede.hidden = false;

  if (typeof applyI18n === "function") applyI18n();
}

function initPacchettiGriglia() {
  const grid = document.querySelector("[data-pack-grid]");
  if (!grid || typeof ESPLORA_CATALOG === "undefined") return;

  const soloFamiglia = new URLSearchParams(location.search).get("famiglia") === "1";
  if (soloFamiglia) pacchettiVestiDaFamiglia();

  function disegna() {
    // Un pacchetto con dentro una scheda che nel catalogo non c'e' piu' non si
    // mostra: meglio un pacchetto in meno che uno che promette tre escursioni
    // e ne ha due.
    //
    // Nella pagina di tutti i pacchetti ci sono anche quelli di famiglia: sono
    // pacchetti, e chi arriva dal riquadro "Pacchetti" deve poterli trovare.
    // A togliere qualcosa e' solo `?famiglia=1`, che tiene solo quelli.
    grid.innerHTML = PACCHETTI
      .filter(p => !soloFamiglia || pacchettoDiFamiglia(p))
      .filter(p => p.voci.every(v => pacchettoVoceTour(v)))
      .map(pacchettoTileHTML)
      .join("");
  }

  disegna();
  document.addEventListener("islalang", disegna);
}

// La riga di un'escursione dentro il pacchetto: titolo, due righe di cosa e',
// e il prezzo. **Non e' un link**: dal pacchetto non si esce per andare a
// prendere una escursione da sola — si chiede il pacchetto intero. La
// descrizione serve proprio a questo, a far sapere che cos'e' senza doverla
// aprire; dove il pacchetto ha scelto una variante si usa la descrizione della
// variante, che e' piu' precisa di quella della scheda.
function pacchettoVoceHTML(voce, n, famiglia) {
  const tour = pacchettoVoceTour(voce);
  if (!tour) return "";

  const variante = pacchettoVoceVariante(voce, tour);
  const prezzo = pacchettoVocePrezzo(voce);
  const desc = (variante && variante.desc) ? tf(variante.desc) : tf(tour.desc);
  const bambino = pacchettoVocePrezzoBambino(voce);

  const dettagli = [];
  if (variante) dettagli.push(tf(variante.label));
  // In un pacchetto di famiglia la riga porta tutti e due i prezzi, con la
  // fascia d'eta' accanto a quello dei bambini: le fasce cambiano da una
  // scheda all'altra (il sottomarino chiama bambino un dodicenne, la goletta
  // no) e senza scriverla il numero vale per la famiglia sbagliata.
  if (prezzo && famiglia && prezzo.tipo === "persona" && bambino) {
    dettagli.push(t("pack.priceAdults", { n: eur(prezzo.prezzo) }));
    const fascia = (tour.ages && tour.ages.child) ? " (" + tf(tour.ages.child) + ")" : "";
    dettagli.push(t("pack.priceChildren", { n: eur(bambino) }) + fascia);
  } else if (prezzo) {
    dettagli.push("€" + eur(prezzo.prezzo) + priceUnitSuffix(tour));
  }

  return `
    <li class="pack-voce">
      <span class="pack-voce-n" aria-hidden="true">${n}</span>
      <div class="pack-voce-testo">
        <strong>${esc(tf(tour.title))}</strong>
        <span class="pack-voce-meta">${esc(dettagli.join(" · "))}</span>
        <span class="pack-voce-desc">${esc(desc)}</span>
      </div>
    </li>`;
}

// Il conto di una famiglia tipo — due adulti e due bambini — sotto il prezzo a
// persona. E' il numero che su un pacchetto di famiglia si va a cercare: "a
// persona" con dei bambini dentro non si moltiplica per quattro.
//
// Due e due e' un esempio, non un vincolo: chi e' in tre o in cinque fa il suo
// conto nella finestra della richiesta, dove i numeri si battono e il totale si
// rifa' da solo. E resta un esempio anche sulle eta': "due bambini" vuol dire
// due bambini nella fascia di **ogni** escursione, che e' quello che dice la
// nota qui sotto.
function pacchettoFamigliaHTML(pack) {
  if (!pacchettoDiFamiglia(pack)) return "";
  const conto = pacchettoTotale(pack, 2, 2);
  if (!conto) return "";
  return `
        <p class="pack-family">${esc(t("pack.familyTotal", { n: eur(conto.totale) }))}</p>
        <p class="pack-note">${esc(t("pack.familyAges"))}</p>`;
}

function initPacchetto() {
  const contenitore = document.querySelector("[data-pack-detail]");
  if (!contenitore || typeof ESPLORA_CATALOG === "undefined") return;

  function disegna() {
    const id = new URLSearchParams(location.search).get("id");
    const pack = id ? pacchettoDi(id) : null;
    const completo = pack && pack.voci.every(v => pacchettoVoceTour(v));

    if (!completo) {
      document.title = t("pack.notFound") + " · Isla";
      contenitore.innerHTML = `
        <div class="state">
          <h2>${esc(t("pack.notFound"))}</h2>
          <p>${esc(t("pack.notFoundText"))}</p>
          <a class="btn btn-primary" href="./pacchetti.html">${esc(t("pack.seeAll"))}</a>
        </div>`;
      return;
    }

    document.title = tf(pack.title) + " · Isla";
    const conto = pacchettoConto(pack);
    const famiglia = pacchettoDiFamiglia(pack);
    const righe = pack.voci
      .map((voce, i) => pacchettoVoceHTML(voce, i + 1, famiglia))
      .join("");

    contenitore.innerHTML = `
      <article class="pack-detail">
        <div class="pack-detail-media">
          <img src="./assets/${encodeURIComponent(pack.image)}" alt="" />
          ${conto && conto.risparmio > 0
            ? `<span class="pack-badge">${esc(t("pack.save", { n: eur(conto.risparmio) }))}</span>`
            : ""}
        </div>
        <span class="eyebrow">${esc(t("pack.eyebrow"))}</span>
        <h1 class="pack-detail-title">${esc(tf(pack.title))}</h1>
        <p class="pack-detail-lead">${esc(tf(pack.desc))}</p>
        <div class="pack-foot">${pacchettoPrezzoHTML(conto)}</div>
        ${conto && conto.misto ? `<p class="pack-note">${esc(t("pack.unitNote"))}</p>` : ""}
        ${pacchettoFamigliaHTML(pack)}
        <span class="pack-inside">${esc(t("pack.inside"))}</span>
        <ol class="pack-voci">${righe}</ol>
        <button class="btn btn-primary btn-block" type="button" data-pack-ask="${esc(pack.id)}"
                aria-haspopup="dialog" aria-controls="packDialog">${esc(t("pack.ask"))}</button>
        <p class="hint">${esc(t("pack.oneRequest"))}</p>
        <a class="pack-back" href="./pacchetti.html">${esc(t("pack.seeAll"))}</a>
      </article>`;
  }

  disegna();
  document.addEventListener("islalang", disegna);
}

// `controlla.js` carica questo file da Node, dove `document` non esiste:
// senza questa riga il controllo si fermerebbe qui.
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    initPacchettiGriglia();
    initPacchetto();
    initPacchettoRichiesta();
  });
}

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
//   mostrano e' un **"da €"**: il mezzo diviso fra tutti i posti che ha —
//   vedi "IL NUMERO IN VETRINA" piu' giu'.
//
//   In vetrina e' un numero solo e non puo' che essere quello. Nella finestra
//   della richiesta invece i mezzi si contano, e il totale e' quello vero:
//   vedi "I MEZZI DENTRO UN PACCHETTO" piu' sotto, sopra pacchettoTotale().
//   Sono due numeri diversi apposta e non si contraddicono — quello in vetrina
//   e' il minimo a testa, quello nella finestra e' quello che si paga — ma se
//   tocchi uno dei due guarda anche l'altro.
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
//     - niente prezzi a mezzo (buggy, moto d'acqua). La ragione di prima — "li'
//       il totale non si puo' fare" — non vale piu': da settembre 2026 i mezzi
//       si contano nella finestra e il totale viene. La regola resta lo stesso,
//       e per una ragione sua: "quanti buggy per due adulti e due bambini" non
//       ha una risposta scritta da nessuna parte, e un pacchetto di famiglia
//       deve poter essere chiesto senza dover prima decidere una cosa del
//       genere. Toglierla e' una scelta del proprietario, non una conseguenza.
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

// GLI ITINERARI A GIORNI (3, 5, 7)
//   `giorni: 3 | 5 | 7` marca gli itinerari della vetrina "3/5/7 Days
//   Experience" — il riquadro della home che fino a oggi non portava da
//   nessuna parte. Non sono pacchetti a tema: sono la stessa vacanza in tre
//   misure, per chi sta sull'isola quei giorni, o resta di piu' ma vuole
//   impegnarsi solo quelli.
//
//   UN GIORNO, UNA ESCURSIONE. `giorni` non e' un'etichetta: deve essere
//   uguale al numero delle voci, e `controlla.js` lo verifica. Un itinerario
//   che dice sette giorni e dentro ne ha cinque promette una settimana piena e
//   ne riempie cinque.
//
//   LO SCONTO CRESCE COI GIORNI: 10% a tre, 12% a cinque, 15% a sette (scelta
//   del proprietario, 14 settembre 2026). Vale la regola di sempre — si sconta
//   solo quello che non e' a prezzo fisso — quindi su un itinerario pieno di
//   parchi e di pullman il 15% si vedrebbe appena. Per questo dentro ci sono
//   soprattutto cose scontabili (barche, kayak, parascending, stelle): se no
//   il numero grande in cima e' una promessa che il conto non mantiene.
//
//   NIENTE PREZZI A MEZZO, ed e' voluto. Su tre escursioni il "prezzo di una
//   persona da sola" del buggy si spiega in una riga; su sette diventa un
//   totale che non somiglia a quello che si paga davvero. Senza mezzi il
//   numero in vetrina e' esatto in tutti e sei gli itinerari, e la finestra
//   della richiesta fa il totale vero anche coi bambini.
//
//   SI VEDONO SOLO NELLA LORO VETRINA, `pacchetti.html?giorni=...`. Non stanno
//   in mezzo ai pacchetti e nemmeno in `?famiglia=1` — al contrario dei
//   pacchetti di famiglia, che restano pacchetti. Un itinerario ha un'altra
//   misura: in una griglia di pacchetti da tre farebbe sembrare gli altri
//   piccoli e se stesso caro, perche' il prezzo di sette giorni accanto a
//   quello di tre non e' un confronto, e' uno spavento. Chi cerca "In
//   famiglia" trova i cinque pacchetti da tre, che su quello sono calibrati.
//
//   QUELLI DI FAMIGLIA VALGONO LE STESSE TRE REGOLE scritte qui sopra (tutte
//   le schede `family: true`, tutte col prezzo bambini vero, niente prezzi a
//   mezzo): un itinerario di famiglia e' un pacchetto di famiglia piu' lungo,
//   non un'altra cosa.

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
    // PREZZO MISTO: il buggy si paga a mezzo, le altre due a persona. In
    // vetrina il buggy entra diviso per i posti del piu' capiente: 330 : 6 =
    // 55. 55 + 55 + 44 = 154, e il Siam Park non si sconta: −11,00 → da 143
    // a persona.
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
    // Il buggy in vetrina e' 330 : 6 = 55. 55 + 55 + 79 = 189, tutto
    // scontabile: −18,90 → da 170,10 a persona. E' il pacchetto con dentro
    // tre dei quattro prodotti da spingere e nessun biglietto a prezzo fisso:
    // lo sconto si vede tutto.
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
    // PREZZO MISTO: buggy e jet ski si pagano a mezzo, il parascending a
    // persona. In vetrina i due mezzi entrano divisi per i loro posti: il
    // buggy da 6 posti 330 : 6 = 55, la moto d'acqua doppia 120 : 2 = 60.
    // 55 + 60 + 55 = 170, tutto scontabile: −17,00 → da 153 a persona.
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
    // PREZZO MISTO: il jet ski si paga a mezzo, le altre due a persona. La
    // moto d'acqua in vetrina e' la doppia, 120 : 2 = 60. 55 + 60 + 15 = 130,
    // tutto scontabile: −13,00 → da 117 a persona.
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
    // 24 + 55 + 35 = 114 a persona, bambini 12 + 30 + 29 = 71. Il Jungle Park e'
    // un biglietto: si scontano tuk tuk e barca, −7,90 → 106,10.
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
      { id: "whale-dolphin-3h" },
      { id: "jungle-park" }
    ],
    desc: {
      it: "Tre uscite tranquille, per chi ha bambini piccoli: un'ora in tuk tuk elettrico sulla costa di Adeje con la guida che racconta, tre ore in barca a vela da Puerto Colón in cerca di balene e delfini, con la sosta per il bagno, e una giornata al Jungle Park fra i rapaci in volo libero e le scimmie.",
      en: "Three unhurried outings, for families with small children: an hour in an electric tuk tuk along the Adeje coast with a guide, three hours under sail from Puerto Colón looking for whales and dolphins, with a stop for a swim, and a day at Jungle Park among free-flying birds of prey and monkeys.",
      es: "Tres salidas tranquilas, para quien viaja con niños pequeños: una hora en tuk tuk eléctrico por la costa de Adeje con un guía que cuenta, tres horas en velero desde Puerto Colón buscando ballenas y delfines, con parada de baño, y un día en el Jungle Park entre rapaces en vuelo libre y monos."
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
  },

  // ─── A GIORNI: 3, 5, 7 ────────────────────────────────────────────────────
  // Da qui in giu' gli itinerari con `giorni`: le regole stanno in testa al
  // file, sotto "GLI ITINERARI A GIORNI". Sono tre misure della stessa
  // vacanza, e si contengono: **il cinque e' il tre piu' due giorni, il sette
  // e' il cinque piu' due**. E' scritto apposta cosi': chi allunga la vacanza
  // non scopre di aver preso "l'itinerario sbagliato", aggiunge dei giorni. E
  // per chi li scrive e' una rete: se il tre e' giusto, i primi tre giorni
  // degli altri due lo sono gia'.
  //
  // Il Teide sta nel primo giorno del tre, quindi ce l'hanno tutti e tre gli
  // itinerari — una volta sola per itinerario, che e' la regola. Per lo stesso
  // motivo qui non c'e' lo stargazing: e' un'altra salita al Teide, e nei
  // pacchetti a tema ce n'e' gia' in abbondanza.

  {
    id: "giorni-3",
    title: {
      it: "Tre giorni a Tenerife",
      en: "Three days in Tenerife",
      es: "Tres días en Tenerife"
    },
    image: "teide-masca.jpg",
    giorni: 3,
    sconto: 10,
    // 39 + 55 + 35 = 129. Il Teide in pullman e' `fixedPrice` e non si sconta:
    // il 10% si toglie da 90 → −9,00 → 120,00 a persona.
    voci: [
      { id: "teide-national-park" },
      // optionIndex 0 = tre ore in condivisione. La barca privata e' un prezzo
      // a barca e qui dentro i prezzi a mezzo non ci vanno.
      { id: "luxury-cruiser", optionIndex: 0 },
      { id: "kayak-snorkelling" }
    ],
    desc: {
      it: "Un giorno in montagna, uno in mare e uno sulla costa: il Parco Nazionale del Teide in pullman con la guida, tre ore di barca lungo le scogliere del sud con la sosta per il bagno, e l'uscita in kayak da Los Cristianos, con mezz'ora in acqua dove passano le tartarughe. Una escursione al giorno: il resto della giornata resta tuo.",
      en: "One day in the mountains, one at sea and one along the coast: Teide National Park by coach with a guide, three hours on the water along the southern cliffs with a swim stop, and the kayak outing from Los Cristianos, with half an hour in the water where the turtles pass. One excursion a day: the rest of the day stays yours.",
      es: "Un día en la montaña, uno en el mar y uno en la costa: el Parque Nacional del Teide en autocar con guía, tres horas en barco por los acantilados del sur con parada de baño, y la salida en kayak desde Los Cristianos, con media hora en el agua por donde pasan las tortugas. Una excursión al día: el resto del día sigue siendo tuyo."
    }
  },

  {
    id: "giorni-3-famiglia",
    title: {
      it: "Tre giorni in famiglia",
      en: "Three days as a family",
      es: "Tres días en familia"
    },
    image: "peter-pan.jpg",
    giorni: 3,
    sconto: 10,
    famiglia: true,
    // 27 + 36 + 24 = 87 a persona, bambini 13 + 29 + 12 = 54. L'Aqualand e' un
    // biglietto e non si sconta: −5,10 sull'adulto → 81,90.
    voci: [
      { id: "peter-pan" },
      { id: "aqualand" },
      // La scelta fra i due percorsi resta aperta: costano uguale (24 tutti e
      // due) e si concorda rispondendo.
      { id: "tuk-tuk" }
    ],
    desc: {
      it: "Tre giorni misurati sui bambini: due ore sulla goletta di legno da Los Cristianos a cercare delfini e globicefali, una giornata di scivoli all'Aqualand con lo spettacolo dei delfini compreso, e un'ora in tuk tuk elettrico sulla costa di Adeje con la guida che racconta.",
      en: "Three days measured on the children: two hours on the wooden schooner out of Los Cristianos looking for dolphins and pilot whales, a day of slides at Aqualand with the dolphin show included, and an hour in an electric tuk tuk along the Adeje coast with a guide.",
      es: "Tres días pensados para los niños: dos horas en la goleta de madera desde Los Cristianos buscando delfines y calderones, un día de toboganes en Aqualand con el espectáculo de delfines incluido, y una hora en tuk tuk eléctrico por la costa de Adeje con un guía que cuenta."
    }
  },

  {
    id: "giorni-5",
    title: {
      it: "Cinque giorni a Tenerife",
      en: "Five days in Tenerife",
      es: "Cinco días en Tenerife"
    },
    image: "luxury-cruiser-3.jpg",
    giorni: 5,
    sconto: 12,
    // I tre di "giorni-3" piu' due. 129 + 55 + 50 = 234. Santa Cruz e' in
    // pullman con guida (`fixedPrice`) come il Teide: si sconta sempre la
    // stessa roba, 55 + 35 + 55 = 145 → −17,40 → 216,60 a persona.
    voci: [
      { id: "teide-national-park" },
      { id: "luxury-cruiser", optionIndex: 0 },
      { id: "kayak-snorkelling" },
      { id: "parascending" },
      { id: "santa-cruz-taganana" }
    ],
    desc: {
      it: "Gli stessi tre giorni, con dentro altri due: il volo col paracadute trainato dalla barca sopra Costa Adeje, una decina di minuti in aria, e una giornata dall'altra parte dell'isola — Santa Cruz, La Laguna Patrimonio UNESCO e il bosco di allori del Parco Rurale di Anaga, in pullman con la guida.",
      en: "The same three days, with two more inside: the parachute flight towed by the boat above Costa Adeje, about ten minutes in the air, and a day on the other side of the island — Santa Cruz, La Laguna (a UNESCO site) and the laurel forest of the Anaga Rural Park, by coach with a guide.",
      es: "Los mismos tres días, con otros dos dentro: el vuelo en paracaídas remolcado por la lancha sobre Costa Adeje, unos diez minutos en el aire, y un día al otro lado de la isla — Santa Cruz, La Laguna Patrimonio UNESCO y la laurisilva del Parque Rural de Anaga, en autocar con guía."
    }
  },

  {
    id: "giorni-5-famiglia",
    title: {
      it: "Cinque giorni in famiglia",
      en: "Five days as a family",
      es: "Cinco días en familia"
    },
    image: "submarine-safari.jpg",
    giorni: 5,
    sconto: 12,
    famiglia: true,
    // I tre di "giorni-3-famiglia" piu' due. 87 + 61 + 44 = 192 a persona,
    // bambini 54 + 37 + 32 = 123. Aqualand e Siam Park sono biglietti: si
    // scontano goletta, tuk tuk e sottomarino, −13,44 sull'adulto → 178,56.
    voci: [
      { id: "peter-pan" },
      { id: "aqualand" },
      { id: "tuk-tuk" },
      { id: "submarine-safari" },
      { id: "siam-park", optionIndex: 0 }
    ],
    desc: {
      it: "Gli stessi tre giorni, con dentro altri due: l'ora nel sottomarino giallo, dove ogni posto ha il suo oblò e si scende fra i 30 e i 60 metri restando all'asciutto, e una giornata intera al Siam Park.",
      en: "The same three days, with two more inside: the hour in the yellow submarine, where every seat has its own porthole and you go down between 30 and 60 metres without getting wet, and a full day at Siam Park.",
      es: "Los mismos tres días, con otros dos dentro: la hora en el submarino amarillo, donde cada asiento tiene su ojo de buey y se baja entre 30 y 60 metros sin mojarse, y un día entero en el Siam Park."
    }
  },

  {
    id: "giorni-7",
    title: {
      it: "Sette giorni a Tenerife",
      en: "Seven days in Tenerife",
      es: "Siete días en Tenerife"
    },
    image: "kayak-snorkelling.jpg",
    giorni: 7,
    sconto: 15,
    // I cinque di "giorni-5" piu' due. 234 + 35 + 51 = 320. Il flamenco e' uno
    // spettacolo e non si sconta: 55 + 35 + 55 + 35 = 180 → −27,00 → 293,00.
    voci: [
      { id: "teide-national-park" },
      { id: "luxury-cruiser", optionIndex: 0 },
      { id: "kayak-snorkelling" },
      { id: "parascending" },
      { id: "santa-cruz-taganana" },
      // optionIndex 0 = lezione di gruppo, due ore. Le private e i pacchetti da
      // tre o cinque lezioni sono un'altra spesa e un altro impegno: qui il
      // surf e' un giorno, non un corso.
      { id: "surf-lesson", optionIndex: 0 },
      // optionIndex 0 = Gold. Il Platinum costa dieci euro in piu' e cambia il
      // posto a sedere: la serata e' la stessa.
      { id: "flamenco-show", optionIndex: 0 }
    ],
    desc: {
      it: "La settimana intera, una uscita al giorno: il Teide, la barca lungo le scogliere, il kayak, il volo col paracadute e la giornata nel nord-est, più due giorni che ci sono solo qui — la prima lezione di surf, due ore in gruppo con l'istruttore, e il flamenco dal vivo, con cante, chitarra e ballo.",
      en: "The whole week, one outing a day: Teide, the boat along the cliffs, the kayak, the parachute flight and the day in the north-east, plus two days you only get here — a first surf lesson, two hours in a group with the instructor, and live flamenco, with singing, guitar and dance.",
      es: "La semana entera, una salida al día: el Teide, el barco por los acantilados, el kayak, el vuelo en paracaídas y el día en el noreste, más dos días que solo están aquí — la primera clase de surf, dos horas en grupo con el monitor, y el flamenco en directo, con cante, guitarra y baile."
    }
  },

  {
    id: "giorni-7-famiglia",
    title: {
      it: "Sette giorni in famiglia",
      en: "Seven days as a family",
      es: "Siete días en familia"
    },
    image: "whale-dolphin-3h.jpg",
    giorni: 7,
    sconto: 15,
    famiglia: true,
    // I cinque di "giorni-5-famiglia" piu' due. 192 + 10 + 55 = 257 a persona,
    // bambini 123 + 5 + 30 = 158. I tre parchi sono biglietti: si scontano le
    // due barche, il tuk tuk e il sottomarino, −25,05 sull'adulto → 231,95.
    voci: [
      { id: "peter-pan" },
      { id: "aqualand" },
      { id: "tuk-tuk" },
      { id: "submarine-safari" },
      { id: "siam-park", optionIndex: 0 },
      { id: "monkey-park" },
      { id: "whale-dolphin-3h" }
    ],
    desc: {
      it: "La settimana intera, una uscita al giorno: la goletta, l'Aqualand, il tuk tuk, il sottomarino e il Siam Park, più due giorni che ci sono solo qui — il Monkey Park, dove si entra nei recinti a dare da mangiare a lemuri, iguane e pappagalli, e le tre ore in barca a vela da Puerto Colón, che finiscono con la sosta bagno e lo snorkeling.",
      en: "The whole week, one outing a day: the schooner, Aqualand, the tuk tuk, the submarine and Siam Park, plus two days you only get here — Monkey Park, where you walk into the enclosures to feed lemurs, iguanas and parrots, and three hours under sail from Puerto Colón, which end with a swim and a snorkel.",
      es: "La semana entera, una salida al día: la goleta, Aqualand, el tuk tuk, el submarino y el Siam Park, más dos días que solo están aquí — el Monkey Park, donde se entra en los recintos a dar de comer a lémures, iguanas y loros, y las tres horas en velero desde Puerto Colón, que terminan con parada de baño y snorkel."
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
//   Quel numero pero' e' del mezzo: per sommarlo agli altri ci vuole il
//   prezzo **a testa**, e lo fa pacchettoMezzoAPersona() dividendo ogni
//   mezzo per i suoi posti.
//
// IL NUMERO IN VETRINA
//   Dove sono tutti prezzi a persona il numero e' esatto e si scrive senza
//   "da": "€124,20 a persona". Uno solo si puo' fare, uno solo si paga.
//
//   Dove c'e' un mezzo il numero e' la **combinazione piu' bassa possibile a
//   persona** (scelta del proprietario, 16 settembre 2026): ogni mezzo diviso
//   fra tutti i posti che ha, e le escursioni a persona a testa. Su Adrenalina
//   e' il buggy da 6 posti (330 : 6 = 55), la moto d'acqua doppia (120 : 2 =
//   60) e il parascending (55): da €153 scontato.
//
//   **Si scrive "da €153", mai "€153".** Il "da" e' la differenza fra un
//   minimo e una bugia: chi e' in due sul buggy paga 90 a testa e non 55, e un
//   numero secco gli **salirebbe** in faccia al momento della richiesta — la
//   cosa che `CLAUDE.md` dice di non fare mai. Col "da" davanti e la nota
//   sotto (`pack.unitNote`, che dice che in meno persone il mezzo costa di
//   piu' a testa) il numero resta vero e non sorprende nessuno.
//
//   Fino al 16 settembre 2026 qui c'era il numero opposto — quello di una
//   persona da sola, il piu' alto — per la ragione contraria: e' l'unico che
//   puo' solo scendere. E' stato cambiato dal proprietario. Non si torna
//   indietro senza che lo chieda lui.
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
//   { tipo: "mezzo",   prezzo }  il prezzo del mezzo piu' piccolo, piu':
//                                  aPersona    quanto costa a testa il mezzo
//                                              diviso fra tutti i suoi posti
//                                  mezzo       quale tipo di mezzo e' (per
//                                              scriverlo accanto: "6 posti")
//                                  prezzoMezzo quanto costa quel mezzo intero
//                                Le ultime tre sono null dove i mezzi non si
//                                sanno contare (vedi pacchettoMezzoAPersona).
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
    if (!prezzo) return null;
    const diviso = pacchettoMezzoAPersona(voce);
    return {
      tipo: "mezzo",
      prezzo: prezzo,
      aPersona: diviso ? diviso.aPersona : null,
      mezzo: diviso ? diviso.tipo : null,
      prezzoMezzo: diviso ? diviso.prezzo : null
    };
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

// Quanti giorni dura un itinerario, 0 se e' un pacchetto a tema. Il numero e'
// scritto nei dati e non ricavato da `voci.length` apposta: cosi' i due si
// possono contraddire, e `controlla.js` se ne accorge. Ricavarlo avrebbe reso
// impossibile l'errore "sette giorni con cinque escursioni" e anche
// impossibile accorgersi di averlo pensato.
function pacchettoGiorni(pack) {
  return pack.giorni || 0;
}

// I giorni chiesti dall'indirizzo: 3, 5, 7, oppure 0 per "tutti". Qualunque
// altra cosa (`?giorni=tutti`, ma anche una schifezza scritta a mano nella
// barra dell'indirizzo) vale 0: in una vetrina, davanti a un parametro che non
// si capisce, far vedere tutto e' meglio che far vedere niente.
function pacchettiGiorniChiesti(valore) {
  const n = parseInt(valore, 10);
  return [3, 5, 7].indexOf(n) === -1 ? 0 : n;
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
//   misto      c'e' dentro almeno un prezzo a mezzo: il numero e' un minimo
//              e si scrive "da €X", con la sua nota
// Torna null se anche una sola voce non ha un prezzo leggibile — e, su una
// voce a mezzo, se non si riesce a dividerla per i posti: li' un numero ci
// sarebbe (il prezzo del mezzo intero) ma non sarebbe un prezzo a persona, e
// sommarlo agli altri darebbe un totale che non vuol dire niente.
function pacchettoConto(pack) {
  let pieno = 0;
  let scontabile = 0;
  let misto = false;
  let completo = true;

  pack.voci.forEach(voce => {
    const p = pacchettoVocePrezzo(voce);
    if (!p) { completo = false; return; }
    // Il mezzo entra nel conto **diviso per i suoi posti**: e' l'unico modo
    // per sommarlo a un prezzo a persona senza mescolare due unita' di misura.
    let quanto = p.prezzo;
    if (p.tipo === "mezzo") {
      if (!p.aPersona) { completo = false; return; }
      misto = true;
      quanto = p.aPersona;
    }
    pieno += quanto;
    if (pacchettoVoceScontabile(voce)) scontabile += quanto;
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

// ─────────────────────────────────────────────────────────────────────────
// I MEZZI DENTRO UN PACCHETTO
//
// Su buggy, quad, moto d'acqua e Mustang si paga il **mezzo** e non chi ci
// sale: un buggy da 4 posti costa 240 € che ci salgano due persone o quattro,
// e un bambino a bordo non aggiunge niente. Per questo il totale di un
// pacchetto misto non e' "tot a persona per quante persone siete": e' la somma
// dei mezzi (che sta li' ferma) piu' le escursioni a testa (che si
// moltiplicano).
//
// Quanti mezzi servono **lo sa solo il cliente**, e non e' un dettaglio: su
// Adrenalina, in due, due buggy e due moto singole fanno 603 €, un buggy e una
// moto doppia ne fanno 369. Sono 234 € di differenza e tutte e due le risposte
// sono giuste — due che vogliono guidare ognuno il suo non stanno sbagliando,
// stanno comprando un'altra cosa.
//
// Quindi si chiede, e non si indovina. I contatori partono da **zero** e
// finche' non si sceglie il totale non compare: un numero pre-riempito sarebbe
// per forza quello della configurazione piu' piccola, cioe' il piu' basso, e
// chi manda la richiesta senza accorgersene si vedrebbe rispondere con un
// numero piu' alto. Alzare un prezzo dopo che il cliente l'ha letto e' la cosa
// che non si fa.
// ─────────────────────────────────────────────────────────────────────────

// Le voci del pacchetto dove i mezzi si contano, con dentro tutto quello che
// serve per contarli: i tipi e i prezzi **della variante che il pacchetto ha
// scelto** (sulla moto d'acqua la doppia costa 120 sull'ora e 200 sulle due
// ore, e il pacchetto l'ora l'ha gia' decisa).
//
// `indice` e' la posizione della voce dentro `pack.voci`, ed e' la chiave con
// cui la finestra e il messaggio ritrovano i numeri battuti dal cliente. La
// posizione e non l'id perche' un pacchetto potrebbe avere due volte lo stesso
// mezzo in due varianti diverse.
//
// Restano fuori di proposito le voci col prezzo "di tutta la cosa" ma senza
// `units` — la barca privata del Luxury Cruiser, le cabine VIP del Siam Park:
// li' non c'e' niente da contare, e infatti il totale continua a non farsi.
function pacchettoVoceMezzi(voce) {
  const tour = pacchettoVoceTour(voce);
  const tipi = (tour && tour.units && Array.isArray(tour.units.types)) ? tour.units.types : [];
  if (!tipi.length) return null;
  const variante = pacchettoVoceVariante(voce, tour);
  // Lo stesso ripiego di totaleMezzi() in escursioni.js: i prezzi stanno
  // nella variante dove le varianti ci sono (buggy, moto d'acqua, quad) e
  // sulla scheda dove non ce ne sono (la Mustang, dove a cambiare non e' la
  // durata ma quanti salgono in macchina). Piu' il terzo caso, che qui
  // succede e nella finestra singola no: la variante il pacchetto puo' non
  // averla scelta.
  const prezzi = (variante && variante.unitPrices) || tour.unitPrices ||
    pacchettoPrezziMezziUguali(tour);
  if (!prezzi) return null;
  return { voce: voce, tour: tour, mezzi: tour.units, tipi: tipi, prezzi: prezzi };
}

function pacchettoMezziDaContare(pack) {
  return pack.voci.map((voce, i) => {
    const gruppo = pacchettoVoceMezzi(voce);
    if (!gruppo) return null;
    return { indice: i, voce: gruppo.voce, tour: gruppo.tour, mezzi: gruppo.mezzi,
      tipi: gruppo.tipi, prezzi: gruppo.prezzi };
  }).filter(Boolean);
}

// IL MEZZO CHE COSTA MENO A TESTA, che e' quello che fa il "da €" della
// vetrina. Un mezzo non si paga a persona, quindi un prezzo a persona ce
// l'ha solo quando si dice **in quanti ci si sale**: il buggy da 6 posti
// costa 330 e diviso per sei fa 55 a testa, quello da 2 ne costa 180 e a
// testa ne fa 90. Il piu' basso e' sempre il mezzo pieno, e quello e' il
// minimo vero: sotto non si puo' andare.
//
// Torna { aPersona, prezzo, tipo, posti }, o null dove non c'e' niente da
// dividere: un tipo senza posti o senza prezzo non entra nel confronto, e se
// non ne resta nemmeno uno il pacchetto non mostra nessun numero invece di
// mostrarne uno inventato — la regola di sempre.
function pacchettoMezzoAPersona(voce) {
  const gruppo = pacchettoVoceMezzi(voce);
  if (!gruppo) return null;

  let migliore = null;
  gruppo.tipi.forEach(tipo => {
    const prezzo = gruppo.prezzi[tipo.key];
    const posti = tipo.seats || 0;
    if (!prezzo || !posti) return;
    const aTesta = prezzo / posti;
    if (!migliore || aTesta < migliore.aPersona) {
      migliore = { aPersona: aTesta, prezzo: prezzo, tipo: tipo, posti: posti };
    }
  });
  return migliore;
}

// I prezzi dei mezzi quando il pacchetto la variante non l'ha scelta. Succede
// per davvero: "Tenerife Trio versione buggy" lascia aperto il percorso, perche'
// i quattro giri costano uguale e sceglierne uno prima non serve a nessuno.
//
// Valgono **solo se tutte le varianti dicono lo stesso numero**. Dove un giro
// costasse piu' di un altro il prezzo dipenderebbe da una scelta che non e'
// ancora stata fatta, e mettere in conto quello della prima variante sarebbe
// tirare a indovinare fra due numeri veri: li' si torna a non fare nessun
// totale, che e' la regola di sempre.
function pacchettoPrezziMezziUguali(tour) {
  const scelte = (tour.options && tour.options.choices) || [];
  const listini = scelte.map(v => v.unitPrices).filter(Boolean);
  // `filter` piu' corto di `scelte` vuol dire che una variante il suo listino
  // non ce l'ha: e' proprio il caso in cui la scelta cambia il prezzo.
  if (!listini.length || listini.length !== scelte.length) return null;

  const primo = listini[0];
  const chiavi = Object.keys(primo);
  const uguali = listini.every(p =>
    Object.keys(p).length === chiavi.length && chiavi.every(k => p[k] === primo[k]));
  return uguali ? primo : null;
}

// Il conto dei mezzi di una voce, dati i numeri battuti nella finestra (un
// numero per tipo, nell'ordine in cui stanno in `types`):
//   costo     quanto costano in tutto — non si moltiplica per le persone
//   posti     quante persone ci stanno sopra, per il controllo dei posti
//   nome      "Buggy", "Moto d'acqua": il nome del gruppo, dal catalogo
//   righe     "1 × 4 posti €240", per il conto sotto il totale e per il messaggio
// Torna null se non si e' scelto niente o se un tipo contato non ha prezzo:
// e' la stessa regola di sempre, meglio nessun totale che uno inventato.
function pacchettoContoMezzi(gruppo, numeri) {
  let costo = 0;
  let posti = 0;
  let quanti = 0;
  let manca = false;
  const righe = [];

  gruppo.tipi.forEach((tipo, i) => {
    const n = Math.max(0, parseInt((numeri || [])[i], 10) || 0);
    if (!n) return;
    const prezzo = gruppo.prezzi[tipo.key];
    if (!prezzo) { manca = true; return; }
    costo += prezzo * n;
    posti += (tipo.seats || 0) * n;
    quanti += n;
    // "1 × 4 posti €240" e non "4 posti × 1": davanti il numero dei mezzi,
    // che e' quello che il cliente ha appena battuto, e dietro il tipo col suo
    // prezzo. Il "×" e il punto in mezzo sono gli stessi del riepilogo dei
    // mezzi in escursioni.js, cosi' le due finestre si leggono uguali.
    righe.push(n + " × " + tf(tipo.name) + " €" + eur(prezzo));
  });
  if (manca || !quanti) return null;

  return {
    costo: costo,
    posti: posti,
    quanti: quanti,
    nome: tf(gruppo.mezzi.name),
    righe: righe.join(" · ")
  };
}

// Il totale di un pacchetto per una comitiva, o `null` quando non si puo' fare.
// `mezzi` e' quello che il cliente ha scelto nella finestra, un elenco di
// numeri per ogni voce a mezzo: `{ 0: [0, 1, 0], 1: [0, 1] }` vuol dire un
// buggy da 4 posti e una moto doppia. Chi non ha mezzi da contare (i pacchetti
// di famiglia, gli itinerari) lo puo' lasciare stare.
//
// I casi in cui torna null sono tutti lo stesso caso — meglio niente che un
// numero falso, la regola della finestra della richiesta:
//   - c'e' una voce a mezzo e i mezzi non sono ancora stati scelti
//   - ci sono bambini e una delle escursioni il prezzo dei bambini non ce l'ha
//   - una voce non ha un prezzo leggibile, o ce l'ha "di tutta la cosa" senza
//     `units`: li' non c'e' niente da contare (vedi pacchettoMezziDaContare)
function pacchettoTotale(pack, adulti, bambini, mezzi) {
  const n = Math.max(1, parseInt(adulti, 10) || 0);
  const k = Math.max(0, parseInt(bambini, 10) || 0);

  // I mezzi si sommano una volta sola: il loro prezzo non si moltiplica ne'
  // per gli adulti ne' per i bambini. E' tutta la differenza fra questo conto
  // e quello di prima, che sapeva fare solo i prezzi a testa.
  let fisso = 0;
  let scontabileFisso = 0;
  let unAdulto = 0;
  let unBambino = 0;
  let scontabileAdulto = 0;
  let scontabileBambino = 0;
  let possibile = true;
  const pezzi = [];

  const gruppi = {};
  pacchettoMezziDaContare(pack).forEach(g => { gruppi[g.indice] = g; });

  pack.voci.forEach((voce, i) => {
    const tour = pacchettoVoceTour(voce);
    const prezzo = pacchettoVocePrezzo(voce);
    if (!tour || !prezzo) { possibile = false; return; }

    if (prezzo.tipo === "mezzo") {
      const conto = gruppi[i] && pacchettoContoMezzi(gruppi[i], (mezzi || {})[i]);
      if (!conto) { possibile = false; return; }
      fisso += conto.costo;
      if (pacchettoVoceScontabile(voce)) scontabileFisso += conto.costo;
      pezzi.push(conto.nome + " " + conto.righe);
      return;
    }

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

  // Il prezzo a testa e' la somma di tutte le voci a persona, non di una sola:
  // "2 adulti × €173" su un pacchetto con tre escursioni a testa. Scritto voce
  // per voce sarebbero tre righe per dire lo stesso numero.
  if (unAdulto > 0) {
    pezzi.push(n + " " + t(n === 1 ? "wa.adult" : "wa.adults") + " × €" + eur(unAdulto));
  }
  if (k > 0 && unBambino > 0) {
    pezzi.push(k + " " + t(k === 1 ? "wa.child" : "wa.children") + " × €" + eur(unBambino));
  }

  const pieno = fisso + unAdulto * n + unBambino * k;
  const base = scontabileFisso + scontabileAdulto * n + scontabileBambino * k;
  const risparmio = pacchettoArrotonda(base * pacchettoSconto(pack) / 100);
  return {
    pieno: pacchettoArrotonda(pieno),
    risparmio: risparmio,
    totale: pacchettoArrotonda(pieno - risparmio),
    dettaglio: pezzi.join(" · ")
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

  // I mezzi scelti, un rigo per gruppo ("Buggy: 1 × 4 posti €240"). Sta sopra
  // l'hotel e sotto le persone perche' e' la seconda cosa che l'ufficio guarda
  // per rispondere: quanti sono e su cosa salgono. Col prezzo dentro, che e'
  // lo stesso che il cliente ha visto nella finestra: se i due numeri non
  // combaciassero se ne accorgerebbe l'ufficio, non lui.
  pacchettoMezziDaContare(pack).forEach(gruppo => {
    const conto = pacchettoContoMezzi(gruppo, (req.mezzi || {})[gruppo.indice]);
    if (conto) righe.push("• " + conto.nome + ": " + conto.righe);
  });

  if (req.hotel) righe.push("• " + t("wa.hotel") + ": " + req.hotel);
  if (req.note) righe.push("• " + t("wa.notes") + ": " + req.note);

  const conto = pacchettoTotale(pack, req.adults, req.kids, req.mezzi);
  if (conto) {
    righe.push("• " + t("wa.total") + ": €" + eur(conto.totale) +
      (conto.risparmio > 0 ? " (" + t("pack.save", { n: eur(conto.risparmio) }) + ")" : ""));
  } else {
    // Niente totale: invece di tacere si dice **perche'**, o all'ufficio
    // arriva una richiesta che sembra dimenticarsi il prezzo.
    righe.push("• " + t("pack.noTotal"));
  }

  // "il pacchetto «X»" su un itinerario da sette giorni fa arrivare in ufficio
  // una richiesta che sembra di tre: il numero dei giorni e' la prima cosa da
  // cui si parte per rispondere, e va scritto nella prima riga.
  const giorni = pacchettoGiorni(pack);
  const testo = (giorni
      ? t("wa.introDays", { name: req.name, pack: tf(pack.title), n: giorni })
      : t("wa.introPack", { name: req.name, pack: tf(pack.title) })) +
    "\n\n" + righe.join("\n");
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(testo);
}

// La finestra della richiesta del pacchetto. Costruita qui in JavaScript e non
// nell'HTML per la stessa ragione della lista: quella delle escursioni e' gia'
// scritta due volte (escursioni.html e tour.html) e tenerle allineate e' una
// fatica che si paga a ogni modifica. Questa e' anche piu' corta — niente
// orario, niente varianti — quindi copiare l'altra sarebbe stato portarsi
// dietro dieci campi da nascondere.
//
// I mezzi invece si contano anche qui, e sono l'unica cosa che le due finestre
// fanno in due modi diversi. Su una singola escursione i mezzi **sostituiscono**
// le persone (sul jet ski quattro amici sono "due doppie", e chiedere anche
// "quanti adulti" sarebbe un secondo numero da far tornare). In un pacchetto
// servono tutti e due: il buggy si paga a mezzo e il parascending a testa, e
// sono due domande diverse con due risposte diverse.
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

  // I contatori dei mezzi, un gruppo per ogni escursione che si paga a mezzo.
  // Stringa vuota dove non ce n'e' nessuna, che sono quasi tutti i pacchetti.
  //
  // **Partono tutti da zero, anche il primo tipo**, ed e' la differenza voluta
  // con la finestra della singola escursione, dove il primo parte da 1 perche'
  // "una moto d'acqua" e' il caso normale e chi ne vuole una non deve toccare
  // niente. Qui un numero gia' scritto sarebbe per forza la configurazione piu'
  // piccola, cioe' la piu' economica, e chi manda la richiesta senza guardarla
  // si vedrebbe rispondere un totale piu' alto di quello che ha letto.
  //
  // Le classi sono quelle di "Quante persone" (`request-people`): sono righe
  // con un'etichetta e una casella, identiche a quelle, e un CSS nuovo sarebbe
  // stato lo stesso CSS scritto una seconda volta.
  function mezziHTML(pack) {
    const gruppi = pacchettoMezziDaContare(pack);
    if (!gruppi.length) return "";

    const blocchi = gruppi.map(gruppo => {
      const righe = gruppo.tipi.map((tipo, i) => {
        const prezzo = gruppo.prezzi[tipo.key];
        const id = "packUnit" + gruppo.indice + "_" + i;
        // I posti non si riscrivono qui: sul buggy stanno gia' nel nome del
        // tipo ("4 posti") e sulla moto d'acqua nella domanda sopra. `seats`
        // serve al conto, non alla vetrina.
        return `
          <label for="${id}"><span>${esc(tf(tipo.name) + (prezzo ? " · €" + eur(prezzo) : ""))}</span>
            <input id="${id}" type="number" inputmode="numeric" min="0" max="20" value="0"
                   data-pack-unit="${gruppo.indice}" data-pack-unit-i="${i}" />
          </label>`;
      }).join("");
      return `
        <span class="request-people-label">${esc(tf(gruppo.mezzi.label))}</span>
        <div class="request-people">${righe}</div>`;
    }).join("");

    return blocchi + `
        <p class="hint">${esc(t("pack.unitsIntro"))}</p>
        <p class="hint" data-pack-seats hidden></p>
        <p class="request-day-error" data-pack-units-error hidden></p>`;
  }

  // Quello che il cliente ha battuto: `{ "0": [0, 1, 0], "1": [0, 1] }`, cioe'
  // un elenco di numeri per ogni voce a mezzo, nell'ordine dei tipi. La chiave
  // e' la posizione della voce dentro il pacchetto, la stessa che usano
  // pacchettoTotale() e il messaggio: e' scritta nell'HTML delle caselle, cosi'
  // non c'e' nessun secondo posto dove il numero possa diventare un altro.
  function mezziScelti() {
    const scelti = {};
    dialog.querySelectorAll("[data-pack-unit]").forEach(inp => {
      const chiave = inp.dataset.packUnit;
      if (!scelti[chiave]) scelti[chiave] = [];
      scelti[chiave][Number(inp.dataset.packUnitI)] = parseInt(inp.value, 10) || 0;
    });
    return scelti;
  }

  // Zero mezzi non e' una richiesta, come nella finestra della singola
  // escursione. Vale gruppo per gruppo: su Adrenalina servono sia il buggy sia
  // la moto d'acqua, e sceglierne uno solo lascerebbe fuori mezzo pacchetto.
  function mezziValidi(pack) {
    const scelti = mezziScelti();
    return pacchettoMezziDaContare(pack)
      .every(gruppo => !!pacchettoContoMezzi(gruppo, scelti[gruppo.indice]));
  }

  // L'avviso dei mezzi mancanti compare **solo quando si prova a mandare**, e
  // sparisce da solo appena i mezzi ci sono. Mostrarlo da subito vorrebbe dire
  // aprire la finestra con un errore rosso gia' acceso, quando il cliente non
  // ha ancora fatto niente di sbagliato: ha solo appena aperto.
  function aggiornaErroreMezzi(mostra) {
    const el = dialog.querySelector("[data-pack-units-error]");
    if (!el || !corrente) return;
    const ok = mezziValidi(corrente);
    if (ok) { el.hidden = true; return; }
    if (!mostra) return;
    el.textContent = t("req.unitsError");
    el.hidden = false;
  }

  // I posti scelti bastano per quanti siete? **Non blocca**, e non deve: due
  // persone che prendono una moto sola perche' ci sale uno solo hanno ragione
  // loro. Ma si dice, che e' il modo di accorgersene prima di mandare la
  // richiesta invece che dopo, leggendo la risposta dell'ufficio.
  function aggiornaPosti() {
    const el = dialog.querySelector("[data-pack-seats]");
    if (!el || !corrente) return;
    const persone = (parseInt(dialog.querySelector("#packAdults").value, 10) || 0) +
                    (parseInt(dialog.querySelector("#packKids").value, 10) || 0);
    const scelti = mezziScelti();
    const corti = pacchettoMezziDaContare(corrente)
      .map(gruppo => pacchettoContoMezzi(gruppo, scelti[gruppo.indice]))
      .filter(conto => conto && conto.posti < persone);
    el.hidden = !corti.length;
    if (corti.length) {
      el.textContent = corti.map(c => t("pack.unitsSeats", { name: c.nome, n: c.posti })).join(" · ") +
        " — " + t("pack.unitsSeatsNote", { p: persone });
    }
  }

  function disegna() {
    if (!corrente) return;
    const giorni = pacchettoGiorni(corrente);
    dialog.innerHTML = `
      <div class="ticket-dialog-head">
        <h2 id="packDialogTitle">${esc(giorni ? t("days.ask") : t("pack.ask"))}</h2>
        <button class="iconbtn" type="button" data-pack-close
                aria-label="${esc(t("common.close"))}">✕</button>
      </div>
      <p class="request-activity">${esc(tf(corrente.title))}</p>
      <form data-pack-form>
        <label for="packDate">${esc(t("pack.fromDay"))}</label>
        <input id="packDate" name="date" type="date" required
               min="${minRequestDate()}" max="${maxRequestDate()}" />
        <p class="hint">${esc(giorni ? t("days.fromDayHint", { n: giorni }) : t("pack.fromDayHint"))}</p>

        <span class="request-people-label">${esc(t("req.people"))}</span>
        <div class="request-people">
          <label for="packAdults"><span>${esc(t("req.adults"))}</span>
            <input id="packAdults" name="adults" type="number" inputmode="numeric"
                   min="1" max="30" value="1" required />
          </label>
          <label for="packKids"><span>${esc(t("req.kids"))}</span>
            <input id="packKids" name="kids" type="number" inputmode="numeric"
                   min="0" max="30" value="0" />
          </label>
        </div>

        ${mezziHTML(corrente)}

        <label for="packHotel"><span>${esc(t("req.hotel"))}</span>
          <span class="request-optional">${esc(t("req.hotelWhy"))}</span></label>
        <input id="packHotel" name="hotel" type="text" autocomplete="off"
               value="${esc(hotelRicordato())}"
               placeholder="${esc(t("pack.hotelPlaceholder"))}" />

        <label for="packNote"><span>${esc(t("wa.notes"))}</span>
          <span class="request-optional">${esc(t("req.optional"))}</span></label>
        <input id="packNote" name="note" type="text" autocomplete="off"
               placeholder="${esc(t("req.notePlaceholder"))}" />

        <!-- Come nella finestra della richiesta: il nome in fondo, perche' e'
             l'unica domanda che non riguarda il viaggio. -->
        <label for="packName">${esc(t("req.name"))}</label>
        <input id="packName" name="name" type="text" autocomplete="name"
               placeholder="${esc(t("req.namePlaceholder"))}" required />

        <!-- Come nella finestra della richiesta: conto e pulsante restano in
             fondo mentre il modulo scorre. -->
        <div class="request-foot">
          <p class="request-total" data-pack-total></p>
          <button class="btn btn-primary btn-block request-submit" type="submit">
            ${esc(t("req.submit"))}</button>
        </div>
        <p class="hint">${esc(t("pack.askHint"))}</p>
        <p class="hint request-privacy">${esc(t("req.privacy"))}</p>
      </form>`;
    // La finestra si ridisegna tutta a ogni apertura e a ogni cambio lingua:
    // le caselle sono nuove ogni volta, e ogni volta si rivestono.
    applicaStepper(dialog);
    aggiornaTotale();
  }

  // Il totale si rifa' a ogni numero battuto: il cliente mette 4 adulti, o un
  // buggy in piu', e vede il conto cambiare li', senza mandare niente.
  function aggiornaTotale() {
    const el = dialog.querySelector("[data-pack-total]");
    if (!el || !corrente) return;
    const adulti = dialog.querySelector("#packAdults").value;
    const bambini = dialog.querySelector("#packKids").value;
    const gruppi = pacchettoMezziDaContare(corrente);
    const scelti = mezziScelti();
    const conto = pacchettoTotale(corrente, adulti, bambini, scelti);

    aggiornaPosti();
    aggiornaErroreMezzi(false);
    el.hidden = false;

    if (!conto) {
      // Due motivi diversi, da non confondere: i mezzi ancora da scegliere —
      // e basta contarli — oppure un prezzo che non abbiamo, e li' non c'e'
      // niente che il cliente possa fare. Scrivere "scegli i mezzi" dove i
      // mezzi non c'entrano lo manderebbe a cercare un campo che non esiste.
      const daScegliere = gruppi.some(g => !pacchettoContoMezzi(g, scelti[g.indice]));
      el.innerHTML = "<small>" +
        esc(t(daScegliere ? "pack.unitsEmpty" : "pack.noTotal")) + "</small>";
      return;
    }

    // Le stesse tre parti della finestra della singola escursione, e lo stesso
    // CSS: il totale grosso, il risparmio a destra, il conto da cui viene
    // sotto. Il conto per esteso non e' un vezzo — e' l'unico modo perche' chi
    // legge €472,50 possa vedere da dove vengono, invece di doverci credere.
    el.innerHTML =
      "<strong>" + esc(t("wa.total") + ": €" + eur(conto.totale)) + "</strong>" +
      (conto.risparmio > 0
        ? "<span>" + esc(t("pack.save", { n: eur(conto.risparmio) })) + "</span>"
        : "") +
      (conto.dettaglio ? "<small>" + esc(conto.dettaglio) + "</small>" : "");
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
    // Tutte le caselle con un id, non un elenco scritto a mano: i contatori
    // dei mezzi ne hanno uno per tipo e per voce, e un elenco fisso li avrebbe
    // dimenticati — cambiando lingua i tre buggy appena contati tornavano zero.
    const vecchi = [...dialog.querySelectorAll("input[id]")].map(c => [c.id, c.value]);
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
      note: dialog.querySelector("#packNote").value.trim(),
      mezzi: mezziScelti()
    };
    if (!req.name || !req.date) return;
    // Senza mezzi la richiesta partirebbe senza la meta' del prezzo: l'ufficio
    // dovrebbe richiamare per chiedere quanti buggy, che e' esattamente il giro
    // di messaggi che questa finestra serve a togliere.
    if (!mezziValidi(corrente)) { aggiornaErroreMezzi(true); return; }
    // Come nella finestra della richiesta: l'hotel si ricorda quando la
    // richiesta parte davvero, e solo se c'e' scritto qualcosa.
    ricordaHotel(req.hotel);
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
//
// Il "da" davanti va **solo** dove dentro c'e' un mezzo (`misto`): li' il
// numero e' la combinazione piu' bassa possibile e in meno persone sale. Dove
// sono tutti prezzi a persona il numero e' quello e basta, e un "da" lo
// farebbe sembrare un minimo che puo' crescere. E' la stessa chiave `tour.from`
// delle schede, non una seconda scritta da tenere allineata in tre lingue.
function pacchettoPrezzoHTML(conto) {
  if (!conto) {
    return `<span class="pack-price"><strong>${esc(t("pack.noPrice"))}</strong></span>`;
  }
  const barrato = conto.risparmio > 0
    ? `<s class="price-before">€${esc(eur(conto.pieno))}</s> `
    : "";
  const numero = conto.misto
    ? t("tour.from", { p: eur(conto.scontato) })
    : "€" + eur(conto.scontato);
  return `<span class="pack-price">${barrato}<strong>${esc(numero)}</strong>
      <small>${esc(t("pack.perPerson"))}</small></span>`;
}

// Il riquadro della vetrina: foto, titolo e prezzo, e si tocca tutto. Sugli
// itinerari sopra il titolo c'e' quanti giorni sono: nella vetrina "tutti" i
// sei riquadri si somigliano, e "Tre giorni" e "Sette giorni" scritti nel
// titolo si leggono solo dopo — il numero sopra si legge prima.
function pacchettoTileHTML(pack) {
  const conto = pacchettoConto(pack);
  const giorni = pacchettoGiorni(pack);
  return `
    <li class="pack-tile">
      <a class="pack-tile-link" href="${pacchettoHref(pack)}">
        <img src="./assets/${encodeURIComponent(pack.image)}" alt="" loading="lazy" />
        <span class="pack-tile-testo">
          ${giorni ? `<span class="pack-tile-giorni">${esc(t("days.count", { n: giorni }))}</span>` : ""}
          <strong>${esc(tf(pack.title))}</strong>
          <span class="pack-tile-prezzo">${pacchettoPrezzoHTML(conto)}</span>
        </span>
        ${conto && conto.risparmio > 0
          ? `<span class="pack-badge">${esc(t("pack.save", { n: eur(conto.risparmio) }))}</span>`
          : ""}
      </a>
    </li>`;
}

// Le due viste di questa pagina — "In famiglia" e "3/5/7 giorni" — si vestono
// spostando le **chiavi** di i18n, non scrivendo il testo: cosi' il cambio
// lingua continua a funzionare da solo, che e' il lavoro di `applyI18n`. Si fa
// una volta al caricamento, non a ogni ridisegno.
function pacchettiCambiaChiave(chiaveVecchia, chiaveNuova) {
  const el = document.querySelector('[data-i18n="' + chiaveVecchia + '"]');
  if (el) el.dataset.i18n = chiaveNuova;
}

// Titolo della finestra del browser e descrizione per chi condivide il link:
// due attributi che stanno fuori dalla pagina e che e' facile dimenticare.
function pacchettiCambiaTesta(chiaveDesc, chiaveTitolo) {
  const meta = document.querySelector('[data-i18n-content="meta.packs.desc"]');
  if (meta) meta.dataset.i18nContent = chiaveDesc;
  if (document.body.dataset.i18nDoctitle === "meta.packs.title") {
    document.body.dataset.i18nDoctitle = chiaveTitolo;
  }
}

// La vista "In famiglia" e' la stessa pagina con un indirizzo diverso,
// `pacchetti.html?famiglia=1`, non una pagina nuova: la vetrina, la finestra
// della richiesta e il conto sono gli stessi, cambiano il titolo e quali
// pacchetti si vedono. Una seconda pagina copiata sarebbe un secondo posto da
// aggiornare a ogni modifica — e' gia' successo con la finestra della
// richiesta, scritta due volte fra `escursioni.html` e `tour.html`.
function pacchettiVestiDaFamiglia() {
  pacchettiCambiaChiave("packs.eyebrow", "packs.familyEyebrow");
  pacchettiCambiaChiave("packs.title", "packs.familyTitle");
  pacchettiCambiaChiave("packs.intro", "packs.familyIntro");
  pacchettiCambiaTesta("meta.family.desc", "meta.family.title");

  // I due modi di uscire di qui: le escursioni per bambini una per una, o
  // tutti i pacchetti. Nella pagina normale questo piede resta nascosto.
  const piede = document.querySelector("[data-pack-foot]");
  if (piede) piede.hidden = false;

  if (typeof applyI18n === "function") applyI18n();
}

// La vista "3, 5 o 7 giorni", `pacchetti.html?giorni=...`, e' la terza volta
// che questa pagina si riveste. In piu' rispetto a quella di famiglia ha la
// riga delle pillole: e' un filtro fatto di **link**, non di bottoni, perche'
// ogni durata deve avere un indirizzo suo da mandare a un cliente ("ti mando i
// cinque giorni") e da ritrovare indietro col tasto del telefono.
function pacchettiVestiDaGiorni(quanti) {
  pacchettiCambiaChiave("packs.eyebrow", "days.eyebrow");
  pacchettiCambiaChiave("packs.title", "days.title");
  pacchettiCambiaChiave("packs.intro", "days.intro");
  pacchettiCambiaTesta("meta.days.desc", "meta.days.title");

  const nav = document.querySelector("[data-days-nav]");
  if (nav) {
    nav.hidden = false;
    nav.querySelectorAll("[data-days-link]").forEach(a => {
      const attivo = parseInt(a.dataset.daysLink, 10) === quanti;
      a.classList.toggle("is-active", attivo);
      // Per chi legge la pagina con lo screen reader: "is-active" e' un
      // colore, e un colore da solo non si sente.
      if (attivo) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  const piede = document.querySelector("[data-days-foot]");
  if (piede) piede.hidden = false;

  if (typeof applyI18n === "function") applyI18n();
}

function initPacchettiGriglia() {
  const grid = document.querySelector("[data-pack-grid]");
  if (!grid || typeof ESPLORA_CATALOG === "undefined") return;

  const parametri = new URLSearchParams(location.search);
  const soloFamiglia = parametri.get("famiglia") === "1";
  // `?giorni` c'e' o non c'e': e' questo a decidere la vetrina. **Quali**
  // giorni e' un'altra domanda, e la risposta puo' essere "tutti".
  const vistaGiorni = parametri.has("giorni");
  const quanti = vistaGiorni ? pacchettiGiorniChiesti(parametri.get("giorni")) : 0;

  if (vistaGiorni) pacchettiVestiDaGiorni(quanti);
  else if (soloFamiglia) pacchettiVestiDaFamiglia();

  function disegna() {
    // Un pacchetto con dentro una scheda che nel catalogo non c'e' piu' non si
    // mostra: meglio un pacchetto in meno che uno che promette tre escursioni
    // e ne ha due.
    //
    // Chi entra da dove:
    //   ?giorni=...  solo gli itinerari, tutti o quelli di una durata
    //   ?famiglia=1  solo i pacchetti di famiglia, che restano pacchetti
    //   niente       tutti i pacchetti, compresi quelli di famiglia
    // Gli itinerari a giorni stanno **solo** nella loro vetrina: il perche' e'
    // in testa al file, sotto "GLI ITINERARI A GIORNI".
    grid.innerHTML = PACCHETTI
      .filter(p => vistaGiorni
        ? (pacchettoGiorni(p) && (!quanti || pacchettoGiorni(p) === quanti))
        : (!pacchettoGiorni(p) && (!soloFamiglia || pacchettoDiFamiglia(p))))
      .filter(p => p.voci.every(v => pacchettoVoceTour(v)))
      .map(p => pacchettoTileHTML(p))
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
  } else if (prezzo && prezzo.tipo === "mezzo" && prezzo.aPersona) {
    // Due numeri, e servono tutti e due: il "da €55 a persona" e' quello che
    // entra nel conto in cima alla pagina, e "6 posti €330/buggy" e' da dove
    // esce. Senza il secondo il cliente legge un prezzo a testa su una cosa
    // che a testa non si paga, e nella finestra della richiesta si trova
    // davanti i contatori dei mezzi senza sapere perche'.
    dettagli.push(t("tour.from", { p: eur(prezzo.aPersona) }) + " " + t("pack.perPerson"));
    dettagli.push(tf(prezzo.mezzo.name) + " €" + eur(prezzo.prezzoMezzo) + priceUnitSuffix(tour));
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
    // Su un itinerario a giorni la stessa pagina cambia quattro parole, e sono
    // quelle che dicono che cos'e': il numero sopra il titolo, il titolo
    // dell'elenco ("Giorno per giorno" invece di "Cosa c'e' dentro" — li' il
    // numero nel pallino **e'** il giorno), il bottone e la riga sotto. Il
    // resto — prezzo, conto della famiglia, finestra della richiesta — e'
    // identico, perche' identico e' quello che succede.
    const giorni = pacchettoGiorni(pack);
    const righe = pack.voci
      .map((voce, i) => pacchettoVoceHTML(voce, i + 1, famiglia))
      .join("");
    const indietro = giorni
      ? "./pacchetti.html?giorni=" + giorni
      : "./pacchetti.html";

    contenitore.innerHTML = `
      <article class="pack-detail">
        <div class="pack-detail-media">
          <img src="./assets/${encodeURIComponent(pack.image)}" alt="" />
          ${conto && conto.risparmio > 0
            ? `<span class="pack-badge">${esc(t("pack.save", { n: eur(conto.risparmio) }))}</span>`
            : ""}
        </div>
        <span class="eyebrow">${esc(giorni ? t("days.detailEyebrow", { n: giorni }) : t("pack.eyebrow"))}</span>
        <h1 class="pack-detail-title">${esc(tf(pack.title))}</h1>
        <p class="pack-detail-lead">${esc(tf(pack.desc))}</p>
        <div class="pack-foot">${pacchettoPrezzoHTML(conto)}</div>
        ${conto && conto.misto ? `<p class="pack-note">${esc(t("pack.unitNote"))}</p>` : ""}
        ${pacchettoFamigliaHTML(pack)}
        <span class="pack-inside">${esc(giorni ? t("days.inside") : t("pack.inside"))}</span>
        <ol class="pack-voci">${righe}</ol>
        <button class="btn btn-primary btn-block" type="button" data-pack-ask="${esc(pack.id)}"
                aria-haspopup="dialog" aria-controls="packDialog">${esc(giorni ? t("days.ask") : t("pack.ask"))}</button>
        <p class="hint">${esc(giorni ? t("days.oneRequest", { n: giorni }) : t("pack.oneRequest"))}</p>
        <a class="pack-back" href="${indietro}">${esc(giorni ? t("days.seeAll") : t("pack.seeAll"))}</a>
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

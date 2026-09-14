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
//   proposta ripetuta otto volte.
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
//   Sui biglietti dei parchi e degli spettacoli: Siam Park, Monkey Park, il
//   flamenco, il drag show, il castello. Sono biglietti a prezzo fisso, li
//   paghiamo quanto li rivendiamo e un 10% in meno uscirebbe dalla tasca di
//   Admiral, non dal margine. La regola e' la **categoria**, non un elenco di
//   schede: cosi' un parco o uno show nuovo e' gia' coperto il giorno che
//   entra nel catalogo. Un elenco a mano si dimentica, e dimenticarselo vuol
//   dire promettere al cliente uno sconto che l'ufficio non puo' fare.

const PACCHETTI_SCONTO_DEFAULT = 10;

const PACCHETTI_CATEGORIE_SENZA_SCONTO = ["parchi-spettacoli"];

const PACCHETTI = [

  // ─── I CLASSICI ───────────────────────────────────────────────────────────

  {
    id: "tenerife-classico",
    title: {
      it: "Tenerife in tre mosse",
      en: "Tenerife in three moves",
      es: "Tenerife en tres pasos"
    },
    image: "teide-national-park.jpg",
    sconto: 10,
    // 39 + 55 + 44 = 138, ma il Siam Park non si sconta: −9,40 → 128,60 a persona
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
    title: {
      it: "Tre mosse, versione buggy",
      en: "Three moves, buggy version",
      es: "Tres pasos, versión buggy"
    },
    image: "buggy-volcano-4h.jpg",
    sconto: 10,
    voci: [
      // Senza `optionIndex`: dei quattro percorsi sceglie il cliente. E' voluto
      // — qui il buggy e' il pezzo forte del pacchetto e non va ristretto.
      // I quattro costano uguale (180 il buggy da due posti), quindi il numero
      // in vetrina non cambia con la scelta.
      { id: "buggy-volcano-4h" },
      { id: "luxury-cruiser", optionIndex: 0 },
      { id: "siam-park" }
    ],
    desc: {
      it: "Lo stesso giro del pacchetto classico, ma alla montagna ci si arriva col buggy invece che in pullman: si sceglie il percorso, dall'offroad sulla costa alla salita al vulcano. Poi il mare e il Siam Park.",
      en: "The same trip as the classic package, but you reach the mountain in a buggy instead of a coach: you pick the route, from the coastal off-road to the climb up the volcano. Then the sea and Siam Park.",
      es: "El mismo recorrido del paquete clásico, pero a la montaña se llega en buggy en vez de en autocar: se elige el recorrido, del offroad en la costa a la subida al volcán. Después el mar y el Siam Park."
    }
  },

  {
    id: "famiglia",
    title: {
      it: "Famiglia",
      en: "Family",
      es: "Familia"
    },
    image: "luxury-cruiser.jpg",
    sconto: 10,
    // 55 + 10 + 44 = 109, ma i due parchi non si scontano: lo sconto e' solo
    // sulla barca, −5,50 → 103,50 a persona (i bambini pagano meno su tutte e tre)
    voci: [
      { id: "luxury-cruiser", optionIndex: 0 },
      { id: "monkey-park" },
      { id: "siam-park" }
    ],
    desc: {
      it: "La barca, le scimmie e il parco acquatico. Tre uscite per chi viaggia coi bambini, tutte con prezzo ridotto per i piccoli e nessuna sveglia all'alba.",
      en: "The boat, the monkeys and the water park. Three days out for families, all with a reduced price for children and no early starts.",
      es: "El barco, los monos y el parque acuático. Tres salidas para quien viaja con niños, todas con precio reducido para los pequeños y sin madrugones."
    }
  },

  // ─── IL TEIDE ─────────────────────────────────────────────────────────────

  {
    id: "teide-tre-volte",
    // PREZZO MISTO: il buggy si paga a mezzo, il pullman e la serata a persona.
    title: {
      it: "Il Teide tre volte",
      en: "Teide three times over",
      es: "El Teide tres veces"
    },
    image: "teide-by-night.jpg",
    sconto: 10,
    voci: [
      { id: "teide-national-park" },
      // optionIndex 1 = "Tramonto sul Teide, 3 ore".
      { id: "buggy-volcano-4h", optionIndex: 1 },
      // optionIndex 1 = gruppo piccolo, in minivan, con l'astrofotografia.
      { id: "stargazing-group", optionIndex: 1 }
    ],
    desc: {
      it: "Lo stesso parco a tre ore diverse: di giorno col pullman e la guida, al tramonto col buggy, e di notte col telescopio in gruppo piccolo. Chi lo fa torna a casa con tre Teide diversi, non con la stessa foto tre volte.",
      en: "The same park at three different hours: by day with the coach and a guide, at sunset in a buggy, and at night with the telescope in a small group. You go home with three different Teides, not the same photo three times.",
      es: "El mismo parque a tres horas distintas: de día en autocar con guía, al atardecer en buggy, y de noche con el telescopio en grupo pequeño. Te vuelves con tres Teides distintos, no con la misma foto tres veces."
    }
  },

  // ─── PER TEMA ─────────────────────────────────────────────────────────────

  {
    id: "adrenalina",
    // PREZZO MISTO: buggy e jet ski si pagano a mezzo, il parascending a persona.
    title: {
      it: "Adrenalina",
      en: "Adrenaline",
      es: "Adrenalina"
    },
    image: "parascending.jpg",
    sconto: 10,
    voci: [
      // optionIndex 2 = "Completo, 4 ore", il percorso lungo.
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
      it: "Tre serate lente, per chi viaggia in due: le stelle dal Teide in gruppo piccolo, il tramonto dalla barca e il flamenco. Niente sveglie presto, niente code.",
      en: "Three slow evenings, for couples: the stars from Teide in a small group, the sunset from the boat and a flamenco show. No early starts, no queues.",
      es: "Tres veladas tranquilas, para quien viaja en pareja: las estrellas desde el Teide en grupo pequeño, el atardecer desde el barco y el flamenco. Sin madrugones y sin colas."
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
      // optionIndex 1 = gruppo piccolo, in minivan, in italiano.
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

  const adulto = (variante && variante.priceAdult !== undefined)
    ? variante.priceAdult
    : tour.priceAdult;
  return adulto ? { tipo: "persona", prezzo: adulto } : null;
}

// Su questa voce lo sconto si puo' fare? Una scheda che non si trova non si
// sconta: nel dubbio si sconta di meno, mai di piu' di quello che si puo'.
function pacchettoVoceScontabile(voce) {
  const tour = pacchettoVoceTour(voce);
  if (!tour) return false;
  return PACCHETTI_CATEGORIE_SENZA_SCONTO.indexOf(tour.category) < 0;
}

// Il conto di un pacchetto:
//   pieno      la somma di tutto
//   scontabile la parte su cui lo sconto si puo' fare
//   risparmio  quanto si toglie davvero — il numero che il cliente guarda
//   scontato   quello che paga: pieno meno risparmio
//   misto      c'e' dentro almeno un prezzo a mezzo: il numero vale per una
//              persona da sola e va scritto con la sua nota
//   parziale   una parte del pacchetto e' a prezzo fisso (parchi, spettacoli)
//              e va detto, o il cliente fa il 10% a mente e trova un altro
//              numero
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
    misto: misto,
    parziale: scontabile < pieno
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

    const variante = pacchettoVoceVariante(voce, tour);
    const bambino = (variante && variante.priceChild !== undefined)
      ? variante.priceChild
      : tour.priceChild;
    if (k > 0 && bambino === undefined) { possibile = false; return; }

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

function initPacchettiGriglia() {
  const grid = document.querySelector("[data-pack-grid]");
  if (!grid || typeof ESPLORA_CATALOG === "undefined") return;

  function disegna() {
    // Un pacchetto con dentro una scheda che nel catalogo non c'e' piu' non si
    // mostra: meglio un pacchetto in meno che uno che promette tre escursioni
    // e ne ha due.
    grid.innerHTML = PACCHETTI
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
function pacchettoVoceHTML(voce, n) {
  const tour = pacchettoVoceTour(voce);
  if (!tour) return "";

  const variante = pacchettoVoceVariante(voce, tour);
  const prezzo = pacchettoVocePrezzo(voce);
  const desc = (variante && variante.desc) ? tf(variante.desc) : tf(tour.desc);

  const dettagli = [];
  if (variante) dettagli.push(tf(variante.label));
  if (prezzo) dettagli.push("€" + eur(prezzo.prezzo) + priceUnitSuffix(tour));
  if (!pacchettoVoceScontabile(voce)) dettagli.push(t("pack.fixedShort"));

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
    const righe = pack.voci.map((voce, i) => pacchettoVoceHTML(voce, i + 1)).join("");

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
        ${conto && conto.parziale ? `<p class="pack-note">${esc(t("pack.fixedNote"))}</p>` : ""}
        ${conto && conto.misto ? `<p class="pack-note">${esc(t("pack.unitNote"))}</p>` : ""}
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

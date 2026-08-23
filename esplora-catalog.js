// Catalogo delle attività di Isla, smistate nelle categorie della home.
//
// COME COMPILARE UNA VOCE
//   image      → nome del file dentro assets/. Vuoto = foto ancora da caricare.
//   priceFrom  → numero in euro, oppure null se il prezzo non è ancora definito.
//   family     → true se adatta ai bambini (serve al filtro "Con bambini").
//   published  → la pagina catalogo mostra solo le voci a true. Ora sono tutte
//                pubblicate per averle sott'occhio: quelle senza prezzo appaiono
//                come "Su richiesta" e quelle senza foto con un segnaposto.
//                Metti false per nascondere una voce ai clienti.
//
// Le descrizioni sono scritte da zero per Isla: non copiare quelle di altri siti.

const CATEGORIES = [
  { id: "mare-barche",       name: "Mare e barche",       image: "Cat-mare.jpg" },
  { id: "teide-natura",      name: "Teide e natura",      image: "Cat-teide.jpg" },
  { id: "stelle",            name: "Stelle e astronomia", image: "Cat-stelle.jpg" },
  { id: "avventura-motori",  name: "Avventura e motori",  image: "Cat-avventura.jpg" },
  { id: "sport-acquatici",   name: "Sport acquatici",     image: "Cat-sport.jpg" },
  { id: "parchi-spettacoli", name: "Parchi e spettacoli", image: "Cat-parchi.jpg" },
  { id: "tour-isola",        name: "Tour dell'isola",     image: "" },
  { id: "tour-privati",      name: "Tour privati",        image: "Cat-privati.jpg" }
];

const ESPLORA_CATALOG = [

  // ─── MARE E BARCHE ────────────────────────────────────────────────────────
  {
    id: "whale-dolphin-sailing",
    title: "Whale & Dolphin Watching in barca a vela",
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: "3 ore",
    priceFrom: 55,
    family: true,
    desc: "Uscita in barca a vela alla ricerca di balene pilota e delfini, con snack e bevande a bordo.",
    image: "whale-dolphin-sailing.jpg",
    published: true
  },
  {
    id: "whale-catamaran",
    title: "Whale Watching Catamaran",
    category: "mare-barche",
    zone: "Costa Adeje",
    duration: "3 ore",
    priceFrom: 47,
    family: true,
    desc: "Catamarano lungo la costa sud, con avvistamento di balene e delfini e sosta bagno.",
    image: "",
    published: true
  },
  {
    id: "shogun",
    title: "Shogun — veliero in teak",
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: "5 ore",
    priceFrom: 65,
    family: true,
    desc: "Navigazione verso Los Gigantes e Masca a bordo di un veliero orientale interamente in teak. Pranzo e bevande inclusi.",
    image: "shogun.jpg",
    published: true
  },
  {
    id: "catamaran-los-gigantes",
    title: "Catamaran Los Gigantes",
    category: "mare-barche",
    zone: "Costa Adeje",
    duration: "4,5 ore",
    priceFrom: 60,
    family: true,
    desc: "Catamarano fino alle scogliere di Los Gigantes, con avvistamento cetacei lungo il percorso.",
    image: "",
    published: true
  },
  {
    id: "motor-yacht-condiviso",
    title: "Motor Yacht condiviso",
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: "3 ore",
    priceFrom: 50,
    family: true,
    desc: "Piccolo gruppo a bordo di un motor yacht, con snorkeling e tempo libero in mare.",
    image: "",
    published: true
  },
  {
    id: "party-boat",
    title: "Party Boat",
    category: "mare-barche",
    zone: "Costa Adeje",
    duration: "3 ore",
    priceFrom: null,
    family: false,
    desc: "Tre ore di musica, ballo e open bar in mare aperto.",
    image: "party-boat.jpg",
    published: true
  },
  {
    id: "fiat-500-on-water",
    title: "Fiat 500 on Water",
    category: "mare-barche",
    zone: "Costa Adeje",
    duration: "Da definire",
    priceFrom: null,
    family: true,
    desc: "Una Fiat 500 galleggiante da guidare al largo della costa: la foto che tutti si portano a casa.",
    image: "fiat-500-on-water.jpg",
    published: true
  },
  {
    id: "baia-masca-barca",
    title: "Baia di Masca in barca",
    category: "mare-barche",
    zone: "Los Gigantes",
    duration: "Da definire",
    priceFrom: null,
    family: true,
    desc: "Uscita fino alla baia di Masca, raggiungibile comodamente solo dal mare.",
    image: "",
    published: true
  },

  // ─── TEIDE E NATURA ───────────────────────────────────────────────────────
  {
    id: "teide-teleferico",
    title: "Teide e Teleférico",
    category: "teide-natura",
    zone: "Parco Nazionale del Teide",
    duration: "Giornata intera",
    priceFrom: null,
    family: true,
    desc: "Salita in funivia fino a quota 3.555 m, tra colate laviche e vista sulle isole vicine.",
    image: "",
    published: true
  },
  {
    id: "teide-dal-sud",
    title: "Teide — partenza dal sud",
    category: "teide-natura",
    zone: "Tenerife sud",
    duration: "Giornata intera",
    priceFrom: null,
    family: true,
    desc: "Tour del Parco Nazionale con partenza dalle zone turistiche del sud.",
    image: "",
    published: true
  },
  {
    id: "teide-dal-nord",
    title: "Teide — partenza dal nord",
    category: "teide-natura",
    zone: "Tenerife nord",
    duration: "Giornata intera",
    priceFrom: null,
    family: true,
    desc: "Stesso parco, salita dal versante nord tra pinete e mare di nuvole.",
    image: "",
    published: true
  },
  {
    id: "masca",
    title: "Masca",
    category: "teide-natura",
    zone: "Masca",
    duration: "Da definire",
    priceFrom: null,
    family: false,
    desc: "Il borgo sospeso tra le montagne e la sua gola, uno dei luoghi più fotografati dell'isola.",
    image: "",
    published: true
  },
  {
    id: "anaga",
    title: "Parco Rurale di Anaga",
    category: "teide-natura",
    zone: "Tenerife nord-est",
    duration: "Giornata intera",
    priceFrom: null,
    family: false,
    desc: "Foresta di alloro primordiale, riserva della biosfera UNESCO, sentieri tra le nuvole.",
    image: "",
    published: true
  },
  {
    id: "paisaje-lunar",
    title: "Paisaje Lunar",
    category: "teide-natura",
    zone: "Vilaflor",
    duration: "Da definire",
    priceFrom: null,
    family: false,
    desc: "Camminata tra le formazioni di tufo bianco scolpite dall'erosione, dal paesaggio quasi lunare.",
    image: "",
    published: true
  },
  {
    id: "canyoning",
    title: "Canyoning",
    category: "teide-natura",
    zone: "Da definire",
    priceFrom: null,
    duration: "Da definire",
    family: false,
    desc: "Discesa di un canyon vulcanico tra calate in corda e pozze d'acqua.",
    image: "",
    published: true
  },

  // ─── STELLE E ASTRONOMIA ──────────────────────────────────────────────────
  {
    id: "stargazing-teide",
    title: "Star Gazing sul Teide",
    category: "stelle",
    zone: "Parco Nazionale del Teide",
    duration: "5 ore",
    priceFrom: 89,
    family: true,
    desc: "Cena, tramonto sopra le nuvole e osservazione delle stelle con telescopi e guida astronomica.",
    image: "",
    published: true
  },
  {
    id: "teide-tramonto-stelle",
    title: "Tramonto e stelle con cena",
    category: "stelle",
    zone: "Parco Nazionale del Teide",
    duration: "Da definire",
    priceFrom: null,
    family: true,
    desc: "Salita nel tardo pomeriggio, cena in quota e cielo notturno tra i più limpidi d'Europa.",
    image: "",
    published: true
  },

  // ─── AVVENTURA E MOTORI ───────────────────────────────────────────────────
  {
    id: "quad-teide-sunset",
    title: "Teide Sunset Quad Trip",
    category: "avventura-motori",
    zone: "Mount Teide",
    duration: "3 ore",
    priceFrom: 150,
    family: false,
    desc: "Quad al tramonto verso il Teide. Età minima 18 anni per guidare.",
    image: "",
    published: true
  },
  {
    id: "quad-100-offroad",
    title: "100% Off-Road Quad Tour",
    category: "avventura-motori",
    zone: "Tenerife sud",
    duration: "Variabile",
    priceFrom: null,
    family: false,
    desc: "Percorso interamente fuoristrada, per chi cerca solo sterrato.",
    image: "",
    published: true
  },
  {
    id: "quad-garachico-masca",
    title: "Garachico & Masca Quad Trip",
    category: "avventura-motori",
    zone: "Masca",
    duration: "4 ore",
    priceFrom: null,
    family: false,
    desc: "Quad tra tornanti e punti panoramici del versante nord-ovest.",
    image: "",
    published: true
  },
  {
    id: "buggy-teide-4h",
    title: "Teide Buggy Tour 4 ore",
    category: "avventura-motori",
    zone: "Las Chafiras",
    duration: "4 ore",
    priceFrom: 150,
    family: false,
    desc: "Buggy con tratto off-road verso il Teide, tra paesaggi vulcanici.",
    image: "",
    published: true
  },
  {
    id: "buggy-costa-adeje-2h",
    title: "Buggy Tour Costa Adeje 2 ore",
    category: "avventura-motori",
    zone: "Costa Adeje",
    duration: "2 ore",
    priceFrom: 120,
    family: false,
    desc: "Due ore di buggy con circa 40 minuti di fuoristrada.",
    image: "",
    published: true
  },
  {
    id: "buggy-sunset-volcano",
    title: "Sunset Volcano Buggy Tour",
    category: "avventura-motori",
    zone: "Tenerife sud",
    duration: "3 ore",
    priceFrom: 230,
    family: false,
    desc: "Buggy al tramonto con vista sui coni vulcanici, in gruppo con guida.",
    image: "",
    published: true
  },
  {
    id: "elicottero",
    title: "Giro in elicottero",
    category: "avventura-motori",
    zone: "Tenerife sud",
    duration: "Da definire",
    priceFrom: null,
    family: true,
    desc: "Sorvolo di spiagge, gole e delle scogliere di Los Gigantes.",
    image: "",
    published: true
  },
  {
    id: "parapendio",
    title: "Parapendio",
    category: "avventura-motori",
    zone: "Da definire",
    priceFrom: null,
    duration: "Da definire",
    family: false,
    desc: "Volo in tandem con istruttore, decollo dalla montagna e atterraggio vicino al mare.",
    image: "",
    published: true
  },

  // ─── SPORT ACQUATICI ──────────────────────────────────────────────────────
  {
    id: "jet-ski",
    title: "Jet Ski",
    category: "sport-acquatici",
    zone: "Costa Adeje",
    duration: "Da definire",
    priceFrom: null,
    family: false,
    desc: "Moto d'acqua lungo la costa, in sicurezza con istruttore.",
    image: "",
    published: true
  },
  {
    id: "parascending",
    title: "Parascending",
    category: "sport-acquatici",
    zone: "Costa Adeje",
    duration: "Da definire",
    priceFrom: null,
    family: true,
    desc: "Paracadute trainato da motoscafo, con vista dall'alto sulla costa.",
    image: "",
    published: true
  },
  {
    id: "kayak",
    title: "Kayak con delfini e tartarughe",
    category: "sport-acquatici",
    zone: "Costa Adeje",
    duration: "Da definire",
    priceFrom: null,
    family: true,
    desc: "Pagaiata guidata lungo la costa, spesso in compagnia di tartarughe e delfini.",
    image: "",
    published: true
  },
  {
    id: "immersioni",
    title: "Immersioni: battesimo e corso",
    category: "sport-acquatici",
    zone: "Da definire",
    priceFrom: null,
    duration: "Da definire",
    family: false,
    desc: "Prima immersione per principianti, oppure percorso per il brevetto.",
    image: "",
    published: true
  },
  {
    id: "flyboard",
    title: "Flyboard",
    category: "sport-acquatici",
    zone: "Costa Adeje",
    duration: "Da definire",
    priceFrom: null,
    family: false,
    desc: "Sollevarsi sull'acqua con la tavola a getto, con istruttore.",
    image: "",
    published: true
  },

  // ─── PARCHI E SPETTACOLI ──────────────────────────────────────────────────
  {
    id: "siam-park",
    title: "Siam Park",
    category: "parchi-spettacoli",
    zone: "Costa Adeje",
    duration: "Giornata intera",
    priceFrom: null,
    family: true,
    desc: "Parco acquatico a tema thailandese, tra i più premiati al mondo.",
    image: "",
    published: true
  },
  {
    id: "loro-parque",
    title: "Loro Parque",
    category: "parchi-spettacoli",
    zone: "Puerto de la Cruz",
    duration: "Giornata intera",
    priceFrom: null,
    family: true,
    desc: "Zoo e giardino tropicale con la più grande collezione di pappagalli al mondo.",
    image: "",
    published: true
  },
  {
    id: "twin-ticket",
    title: "Twin Ticket — Siam + Loro Parque",
    category: "parchi-spettacoli",
    zone: "Costa Adeje / Puerto de la Cruz",
    duration: "2 giornate",
    priceFrom: null,
    family: true,
    desc: "Biglietto combinato per i due parchi, con bus incluso.",
    image: "",
    published: true
  },
  {
    id: "aqualand",
    title: "Aqualand",
    category: "parchi-spettacoli",
    zone: "Costa Adeje",
    duration: "Giornata intera",
    priceFrom: null,
    family: true,
    desc: "Parco acquatico con scivoli e aree per i più piccoli.",
    image: "",
    published: true
  },
  {
    id: "jungle-park",
    title: "Jungle Park",
    category: "parchi-spettacoli",
    zone: "Las Águilas, Arona",
    duration: "Giornata intera",
    priceFrom: null,
    family: true,
    desc: "Parco naturale con rapaci in volo libero, a pochi minuti da Los Cristianos.",
    image: "",
    published: true
  },
  {
    id: "fun-trip",
    title: "Fun Trip — Aqualand + Jungle Park",
    category: "parchi-spettacoli",
    zone: "Tenerife sud",
    duration: "2 giornate",
    priceFrom: null,
    family: true,
    desc: "Biglietto combinato per i due parchi del sud.",
    image: "",
    published: true
  },
  {
    id: "cena-medievale",
    title: "Cena spettacolo medievale",
    category: "parchi-spettacoli",
    zone: "Castillo San Miguel",
    duration: "Serata",
    priceFrom: null,
    family: true,
    desc: "Cavalieri, cavalli e tornei dal vivo, con cena servita durante lo spettacolo.",
    image: "",
    published: true
  },

  // ─── TOUR DELL'ISOLA ──────────────────────────────────────────────────────
  {
    id: "island-tour-completo",
    title: "Tour completo dell'isola",
    category: "tour-isola",
    zone: "Tutta l'isola",
    duration: "Giornata intera",
    priceFrom: null,
    family: true,
    desc: "I punti simbolo di Tenerife in un giorno solo, in pullman con guida.",
    image: "",
    published: true
  },
  {
    id: "icod-garachico-orotava",
    title: "Icod, Garachico e La Orotava",
    category: "tour-isola",
    zone: "Tenerife nord",
    duration: "Giornata intera",
    priceFrom: null,
    family: true,
    desc: "Il Drago Millenario di Icod, le piscine naturali di Garachico e i balconi di La Orotava.",
    image: "",
    published: true
  },
  {
    id: "puerto-de-la-cruz",
    title: "Puerto de la Cruz",
    category: "tour-isola",
    zone: "Tenerife nord",
    duration: "Giornata intera",
    priceFrom: null,
    family: true,
    desc: "Una delle città più antiche dell'isola: Lago Martiánez, giardino botanico e Plaza del Charco.",
    image: "",
    published: true
  },
  {
    id: "la-gomera",
    title: "La Gomera",
    category: "tour-isola",
    zone: "Isola di La Gomera",
    duration: "Giornata intera",
    priceFrom: null,
    family: true,
    desc: "Traghetto e giro dell'isola vicina, con il Parco Nazionale di Garajonay.",
    image: "",
    published: true
  },
  {
    id: "gran-canaria",
    title: "Gran Canaria",
    category: "tour-isola",
    zone: "Isola di Gran Canaria",
    duration: "Giornata intera",
    priceFrom: null,
    family: true,
    desc: "Escursione di un giorno sull'isola vicina.",
    image: "",
    published: true
  },
  {
    id: "cantine-vinicole",
    title: "Cantine vinicole con sommelier",
    category: "tour-isola",
    zone: "Da definire",
    duration: "Da definire",
    priceFrom: null,
    family: false,
    desc: "Degustazione di vini vulcanici e prodotti tipici, guidati da un sommelier.",
    image: "",
    published: true
  },

  // ─── TOUR PRIVATI ─────────────────────────────────────────────────────────
  {
    id: "charter-privato",
    title: "Charter privato all inclusive",
    category: "tour-privati",
    zone: "Puerto Colón",
    duration: "3 ore",
    priceFrom: null,
    family: true,
    desc: "Barca riservata al tuo gruppo, con percorso e orari concordati.",
    image: "",
    published: true
  },
  {
    id: "tour-privato-su-misura",
    title: "Tour privato su misura",
    category: "tour-privati",
    zone: "Tutta l'isola",
    duration: "Da concordare",
    priceFrom: null,
    family: true,
    desc: "Itinerario costruito su richiesta, con guida e mezzo dedicati.",
    image: "",
    published: true
  }
];

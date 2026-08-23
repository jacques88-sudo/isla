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
// LE TRE LINGUE
//   title, zone, duration e desc si scrivono così:
//       title: { it: "...", en: "...", es: "..." }
//   Se un testo è uguale in tutte e tre le lingue (i nomi propri, per esempio
//   "Siam Park" o "Costa Adeje") basta scrivere la stringa da sola:
//       zone: "Costa Adeje"
//
// Le descrizioni sono scritte da zero per Isla: non copiare quelle di altri siti.

const CATEGORIES = [
  {
    id: "mare-barche",
    name: { it: "Mare e barche", en: "Sea and boats", es: "Mar y barcos" },
    image: "Cat-mare.jpg"
  },
  {
    id: "teide-natura",
    name: { it: "Teide e natura", en: "Teide and nature", es: "Teide y naturaleza" },
    image: "Cat-teide.jpg"
  },
  {
    id: "stelle",
    name: { it: "Stelle e astronomia", en: "Stars and astronomy", es: "Estrellas y astronomía" },
    image: "Cat-stelle.jpg"
  },
  {
    id: "avventura-motori",
    name: { it: "Avventura e motori", en: "Adventure and engines", es: "Aventura y motor" },
    image: "Cat-avventura.jpg"
  },
  {
    id: "sport-acquatici",
    name: { it: "Sport acquatici", en: "Water sports", es: "Deportes acuáticos" },
    image: "Cat-sport.jpg"
  },
  {
    id: "parchi-spettacoli",
    name: { it: "Parchi e spettacoli", en: "Parks and shows", es: "Parques y espectáculos" },
    image: "Cat-parchi.jpg"
  },
  {
    id: "tour-isola",
    name: { it: "Tour dell'isola", en: "Island tours", es: "Tours de la isla" },
    image: ""
  },
  {
    id: "tour-privati",
    name: { it: "Tour privati", en: "Private tours", es: "Tours privados" },
    image: "Cat-privati.jpg"
  }
];

const ESPLORA_CATALOG = [

  // ─── MARE E BARCHE ────────────────────────────────────────────────────────
  {
    id: "whale-dolphin-sailing",
    title: {
      it: "Whale & Dolphin Watching in barca a vela",
      en: "Whale & Dolphin Watching by sailing boat",
      es: "Whale & Dolphin Watching en velero"
    },
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    priceFrom: 55,
    family: true,
    desc: {
      it: "Uscita in barca a vela alla ricerca di balene pilota e delfini, con snack e bevande a bordo.",
      en: "A sailing trip in search of pilot whales and dolphins, with snacks and drinks on board.",
      es: "Salida en velero en busca de calderones y delfines, con aperitivos y bebidas a bordo."
    },
    image: "whale-dolphin-sailing.jpg",
    published: true
  },
  {
    id: "whale-catamaran",
    title: "Whale Watching Catamaran",
    category: "mare-barche",
    zone: "Costa Adeje",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    priceFrom: 47,
    family: true,
    desc: {
      it: "Catamarano lungo la costa sud, con avvistamento di balene e delfini e sosta bagno.",
      en: "Catamaran along the south coast, with whale and dolphin watching and a swim stop.",
      es: "Catamarán por la costa sur, con avistamiento de ballenas y delfines y parada de baño."
    },
    image: "",
    published: true
  },
  {
    id: "shogun",
    title: {
      it: "Shogun — veliero in teak",
      en: "Shogun — teak sailing ship",
      es: "Shogun — velero de teca"
    },
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "5 ore", en: "5 hours", es: "5 horas" },
    priceFrom: 65,
    family: true,
    desc: {
      it: "Navigazione verso Los Gigantes e Masca a bordo di un veliero orientale interamente in teak. Pranzo e bevande inclusi.",
      en: "Sailing towards Los Gigantes and Masca aboard an oriental ship built entirely in teak. Lunch and drinks included.",
      es: "Navegación hacia Los Gigantes y Masca a bordo de un velero oriental íntegramente de teca. Comida y bebidas incluidas."
    },
    image: "shogun.jpg",
    published: true
  },
  {
    id: "catamaran-los-gigantes",
    title: "Catamaran Los Gigantes",
    category: "mare-barche",
    zone: "Costa Adeje",
    duration: { it: "4,5 ore", en: "4.5 hours", es: "4,5 horas" },
    priceFrom: 60,
    family: true,
    desc: {
      it: "Catamarano fino alle scogliere di Los Gigantes, con avvistamento cetacei lungo il percorso.",
      en: "Catamaran out to the cliffs of Los Gigantes, spotting whales and dolphins along the way.",
      es: "Catamarán hasta los acantilados de Los Gigantes, con avistamiento de cetáceos por el camino."
    },
    image: "",
    published: true
  },
  {
    id: "motor-yacht-condiviso",
    title: {
      it: "Motor Yacht condiviso",
      en: "Shared Motor Yacht",
      es: "Motor Yacht compartido"
    },
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    priceFrom: 50,
    family: true,
    desc: {
      it: "Piccolo gruppo a bordo di un motor yacht, con snorkeling e tempo libero in mare.",
      en: "A small group aboard a motor yacht, with snorkelling and free time in the water.",
      es: "Grupo reducido a bordo de un motor yacht, con snorkel y tiempo libre en el mar."
    },
    image: "",
    published: true
  },
  {
    id: "party-boat",
    title: "Party Boat",
    category: "mare-barche",
    zone: "Costa Adeje",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    priceFrom: null,
    family: false,
    desc: {
      it: "Tre ore di musica, ballo e open bar in mare aperto.",
      en: "Three hours of music, dancing and open bar out at sea.",
      es: "Tres horas de música, baile y barra libre en mar abierto."
    },
    image: "party-boat.jpg",
    published: true
  },
  {
    id: "fiat-500-on-water",
    title: "Fiat 500 on Water",
    category: "mare-barche",
    zone: "Costa Adeje",
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Una Fiat 500 galleggiante da guidare al largo della costa: la foto che tutti si portano a casa.",
      en: "A floating Fiat 500 you drive off the coast: the photo everyone takes home.",
      es: "Un Fiat 500 flotante para conducir frente a la costa: la foto que todos se llevan a casa."
    },
    image: "fiat-500-on-water.jpg",
    published: true
  },
  {
    id: "baia-masca-barca",
    title: {
      it: "Baia di Masca in barca",
      en: "Masca Bay by boat",
      es: "Bahía de Masca en barco"
    },
    category: "mare-barche",
    zone: "Los Gigantes",
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Uscita fino alla baia di Masca, raggiungibile comodamente solo dal mare.",
      en: "A trip out to Masca bay, which is only comfortably reached from the sea.",
      es: "Salida hasta la bahía de Masca, a la que solo se llega cómodamente desde el mar."
    },
    image: "",
    published: true
  },

  // ─── TEIDE E NATURA ───────────────────────────────────────────────────────
  {
    id: "teide-teleferico",
    title: {
      it: "Teide e Teleférico",
      en: "Teide and cable car",
      es: "Teide y Teleférico"
    },
    category: "teide-natura",
    zone: {
      it: "Parco Nazionale del Teide",
      en: "Teide National Park",
      es: "Parque Nacional del Teide"
    },
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Salita in funivia fino a quota 3.555 m, tra colate laviche e vista sulle isole vicine.",
      en: "Cable car up to 3,555 m, among lava flows and views over the neighbouring islands.",
      es: "Subida en teleférico hasta los 3.555 m, entre coladas de lava y vistas a las islas vecinas."
    },
    image: "",
    published: true
  },
  {
    id: "teide-dal-sud",
    title: {
      it: "Teide — partenza dal sud",
      en: "Teide — departure from the south",
      es: "Teide — salida desde el sur"
    },
    category: "teide-natura",
    zone: { it: "Tenerife sud", en: "South Tenerife", es: "Tenerife sur" },
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Tour del Parco Nazionale con partenza dalle zone turistiche del sud.",
      en: "National Park tour departing from the tourist areas in the south.",
      es: "Tour del Parque Nacional con salida desde las zonas turísticas del sur."
    },
    image: "",
    published: true
  },
  {
    id: "teide-dal-nord",
    title: {
      it: "Teide — partenza dal nord",
      en: "Teide — departure from the north",
      es: "Teide — salida desde el norte"
    },
    category: "teide-natura",
    zone: { it: "Tenerife nord", en: "North Tenerife", es: "Tenerife norte" },
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Stesso parco, salita dal versante nord tra pinete e mare di nuvole.",
      en: "The same park, climbing from the northern side through pine forests and a sea of clouds.",
      es: "El mismo parque, subiendo por la vertiente norte entre pinares y mar de nubes."
    },
    image: "",
    published: true
  },
  {
    id: "masca",
    title: "Masca",
    category: "teide-natura",
    zone: "Masca",
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    family: false,
    desc: {
      it: "Il borgo sospeso tra le montagne e la sua gola, uno dei luoghi più fotografati dell'isola.",
      en: "The hamlet suspended between the mountains and its gorge, one of the most photographed places on the island.",
      es: "El pueblo suspendido entre las montañas y su barranco, uno de los lugares más fotografiados de la isla."
    },
    image: "",
    published: true
  },
  {
    id: "anaga",
    title: {
      it: "Parco Rurale di Anaga",
      en: "Anaga Rural Park",
      es: "Parque Rural de Anaga"
    },
    category: "teide-natura",
    zone: { it: "Tenerife nord-est", en: "North-east Tenerife", es: "Tenerife noreste" },
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo" },
    priceFrom: null,
    family: false,
    desc: {
      it: "Foresta di alloro primordiale, riserva della biosfera UNESCO, sentieri tra le nuvole.",
      en: "Primeval laurel forest, a UNESCO biosphere reserve, with trails among the clouds.",
      es: "Bosque de laurisilva primigenio, reserva de la biosfera UNESCO, senderos entre las nubes."
    },
    image: "",
    published: true
  },
  {
    id: "paisaje-lunar",
    title: "Paisaje Lunar",
    category: "teide-natura",
    zone: "Vilaflor",
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    family: false,
    desc: {
      it: "Camminata tra le formazioni di tufo bianco scolpite dall'erosione, dal paesaggio quasi lunare.",
      en: "A walk among white tuff formations carved by erosion, in an almost lunar landscape.",
      es: "Caminata entre formaciones de toba blanca esculpidas por la erosión, en un paisaje casi lunar."
    },
    image: "",
    published: true
  },
  {
    id: "canyoning",
    title: { it: "Canyoning", en: "Canyoning", es: "Barranquismo" },
    category: "teide-natura",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    family: false,
    desc: {
      it: "Discesa di un canyon vulcanico tra calate in corda e pozze d'acqua.",
      en: "Descending a volcanic canyon between rope abseils and rock pools.",
      es: "Descenso de un barranco volcánico entre rápeles y pozas de agua."
    },
    image: "",
    published: true
  },

  // ─── STELLE E ASTRONOMIA ──────────────────────────────────────────────────
  {
    id: "stargazing-teide",
    title: {
      it: "Star Gazing sul Teide",
      en: "Star Gazing on Teide",
      es: "Star Gazing en el Teide"
    },
    category: "stelle",
    zone: {
      it: "Parco Nazionale del Teide",
      en: "Teide National Park",
      es: "Parque Nacional del Teide"
    },
    duration: { it: "5 ore", en: "5 hours", es: "5 horas" },
    priceFrom: 89,
    family: true,
    desc: {
      it: "Cena, tramonto sopra le nuvole e osservazione delle stelle con telescopi e guida astronomica.",
      en: "Dinner, sunset above the clouds and stargazing with telescopes and an astronomy guide.",
      es: "Cena, atardecer por encima de las nubes y observación de estrellas con telescopios y guía astronómico."
    },
    image: "",
    published: true
  },
  {
    id: "teide-tramonto-stelle",
    title: {
      it: "Tramonto e stelle con cena",
      en: "Sunset and stars with dinner",
      es: "Atardecer y estrellas con cena"
    },
    category: "stelle",
    zone: {
      it: "Parco Nazionale del Teide",
      en: "Teide National Park",
      es: "Parque Nacional del Teide"
    },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Salita nel tardo pomeriggio, cena in quota e cielo notturno tra i più limpidi d'Europa.",
      en: "A late-afternoon climb, dinner at altitude and one of the clearest night skies in Europe.",
      es: "Subida a última hora de la tarde, cena en altura y uno de los cielos nocturnos más limpios de Europa."
    },
    image: "",
    published: true
  },

  // ─── AVVENTURA E MOTORI ───────────────────────────────────────────────────
  {
    id: "quad-teide-sunset",
    title: "Teide Sunset Quad Trip",
    category: "avventura-motori",
    zone: { it: "Teide", en: "Mount Teide", es: "Teide" },
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    priceFrom: 150,
    family: false,
    desc: {
      it: "Quad al tramonto verso il Teide. Età minima 18 anni per guidare.",
      en: "Quad biking at sunset towards Teide. Minimum age to drive is 18.",
      es: "Quad al atardecer hacia el Teide. Edad mínima para conducir: 18 años."
    },
    image: "",
    published: true
  },
  {
    id: "quad-100-offroad",
    title: "100% Off-Road Quad Tour",
    category: "avventura-motori",
    zone: { it: "Tenerife sud", en: "South Tenerife", es: "Tenerife sur" },
    duration: { it: "Variabile", en: "Variable", es: "Variable" },
    priceFrom: null,
    family: false,
    desc: {
      it: "Percorso interamente fuoristrada, per chi cerca solo sterrato.",
      en: "An entirely off-road route, for those who only want dirt tracks.",
      es: "Recorrido completamente fuera de pista, para quien solo busca tierra."
    },
    image: "",
    published: true
  },
  {
    id: "quad-garachico-masca",
    title: "Garachico & Masca Quad Trip",
    category: "avventura-motori",
    zone: "Masca",
    duration: { it: "4 ore", en: "4 hours", es: "4 horas" },
    priceFrom: null,
    family: false,
    desc: {
      it: "Quad tra tornanti e punti panoramici del versante nord-ovest.",
      en: "Quad biking through hairpin bends and viewpoints on the north-west side.",
      es: "Quad entre curvas de montaña y miradores de la vertiente noroeste."
    },
    image: "",
    published: true
  },
  {
    id: "buggy-teide-4h",
    title: {
      it: "Teide Buggy Tour 4 ore",
      en: "Teide Buggy Tour 4 hours",
      es: "Teide Buggy Tour 4 horas"
    },
    category: "avventura-motori",
    zone: "Las Chafiras",
    duration: { it: "4 ore", en: "4 hours", es: "4 horas" },
    priceFrom: 150,
    family: false,
    desc: {
      it: "Buggy con tratto off-road verso il Teide, tra paesaggi vulcanici.",
      en: "Buggy with an off-road stretch towards Teide, through volcanic landscapes.",
      es: "Buggy con tramo off-road hacia el Teide, entre paisajes volcánicos."
    },
    image: "",
    published: true
  },
  {
    id: "buggy-costa-adeje-2h",
    title: {
      it: "Buggy Tour Costa Adeje 2 ore",
      en: "Buggy Tour Costa Adeje 2 hours",
      es: "Buggy Tour Costa Adeje 2 horas"
    },
    category: "avventura-motori",
    zone: "Costa Adeje",
    duration: { it: "2 ore", en: "2 hours", es: "2 horas" },
    priceFrom: 120,
    family: false,
    desc: {
      it: "Due ore di buggy con circa 40 minuti di fuoristrada.",
      en: "Two hours of buggy driving with around 40 minutes off-road.",
      es: "Dos horas de buggy con unos 40 minutos fuera de pista."
    },
    image: "",
    published: true
  },
  {
    id: "buggy-sunset-volcano",
    title: "Sunset Volcano Buggy Tour",
    category: "avventura-motori",
    zone: { it: "Tenerife sud", en: "South Tenerife", es: "Tenerife sur" },
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    priceFrom: 230,
    family: false,
    desc: {
      it: "Buggy al tramonto con vista sui coni vulcanici, in gruppo con guida.",
      en: "Buggy at sunset with views over the volcanic cones, in a guided group.",
      es: "Buggy al atardecer con vistas a los conos volcánicos, en grupo con guía."
    },
    image: "",
    published: true
  },
  {
    id: "elicottero",
    title: {
      it: "Giro in elicottero",
      en: "Helicopter flight",
      es: "Vuelo en helicóptero"
    },
    category: "avventura-motori",
    zone: { it: "Tenerife sud", en: "South Tenerife", es: "Tenerife sur" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Sorvolo di spiagge, gole e delle scogliere di Los Gigantes.",
      en: "Flying over beaches, gorges and the cliffs of Los Gigantes.",
      es: "Sobrevuelo de playas, barrancos y los acantilados de Los Gigantes."
    },
    image: "",
    published: true
  },
  {
    id: "parapendio",
    title: { it: "Parapendio", en: "Paragliding", es: "Parapente" },
    category: "avventura-motori",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    family: false,
    desc: {
      it: "Volo in tandem con istruttore, decollo dalla montagna e atterraggio vicino al mare.",
      en: "A tandem flight with an instructor: take off from the mountain, land near the sea.",
      es: "Vuelo en tándem con instructor, despegue desde la montaña y aterrizaje cerca del mar."
    },
    image: "",
    published: true
  },

  // ─── SPORT ACQUATICI ──────────────────────────────────────────────────────
  {
    id: "jet-ski",
    title: { it: "Jet Ski", en: "Jet Ski", es: "Moto de agua" },
    category: "sport-acquatici",
    zone: "Costa Adeje",
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    family: false,
    desc: {
      it: "Moto d'acqua lungo la costa, in sicurezza con istruttore.",
      en: "Jet skiing along the coast, safely, with an instructor.",
      es: "Moto de agua por la costa, con seguridad y con instructor."
    },
    image: "",
    published: true
  },
  {
    id: "parascending",
    title: "Parascending",
    category: "sport-acquatici",
    zone: "Costa Adeje",
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Paracadute trainato da motoscafo, con vista dall'alto sulla costa.",
      en: "A parachute towed by a speedboat, with the coast seen from above.",
      es: "Paracaídas remolcado por una lancha, con vistas de la costa desde el aire."
    },
    image: "",
    published: true
  },
  {
    id: "kayak",
    title: {
      it: "Kayak con delfini e tartarughe",
      en: "Kayaking with dolphins and turtles",
      es: "Kayak con delfines y tortugas"
    },
    category: "sport-acquatici",
    zone: "Costa Adeje",
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Pagaiata guidata lungo la costa, spesso in compagnia di tartarughe e delfini.",
      en: "A guided paddle along the coast, often in the company of turtles and dolphins.",
      es: "Paseo guiado en kayak por la costa, a menudo en compañía de tortugas y delfines."
    },
    image: "",
    published: true
  },
  {
    id: "immersioni",
    title: {
      it: "Immersioni: battesimo e corso",
      en: "Diving: taster dive and course",
      es: "Buceo: bautizo y curso"
    },
    category: "sport-acquatici",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    family: false,
    desc: {
      it: "Prima immersione per principianti, oppure percorso per il brevetto.",
      en: "A first dive for beginners, or the full path to certification.",
      es: "Primera inmersión para principiantes o curso completo para obtener el título."
    },
    image: "",
    published: true
  },
  {
    id: "flyboard",
    title: "Flyboard",
    category: "sport-acquatici",
    zone: "Costa Adeje",
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    family: false,
    desc: {
      it: "Sollevarsi sull'acqua con la tavola a getto, con istruttore.",
      en: "Rising above the water on a jet-powered board, with an instructor.",
      es: "Elevarse sobre el agua con la tabla a chorro, con instructor."
    },
    image: "",
    published: true
  },

  // ─── PARCHI E SPETTACOLI ──────────────────────────────────────────────────
  {
    id: "siam-park",
    title: "Siam Park",
    category: "parchi-spettacoli",
    zone: "Costa Adeje",
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Parco acquatico a tema thailandese, tra i più premiati al mondo.",
      en: "Thai-themed water park, one of the most awarded in the world.",
      es: "Parque acuático de temática tailandesa, uno de los más premiados del mundo."
    },
    image: "",
    published: true
  },
  {
    id: "loro-parque",
    title: "Loro Parque",
    category: "parchi-spettacoli",
    zone: "Puerto de la Cruz",
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Zoo e giardino tropicale con la più grande collezione di pappagalli al mondo.",
      en: "Zoo and tropical garden with the largest parrot collection in the world.",
      es: "Zoo y jardín tropical con la mayor colección de loros del mundo."
    },
    image: "",
    published: true
  },
  {
    id: "twin-ticket",
    title: "Twin Ticket — Siam + Loro Parque",
    category: "parchi-spettacoli",
    zone: "Costa Adeje / Puerto de la Cruz",
    duration: { it: "2 giornate", en: "2 days", es: "2 días" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Biglietto combinato per i due parchi, con bus incluso.",
      en: "Combined ticket for both parks, bus included.",
      es: "Entrada combinada para los dos parques, con autobús incluido."
    },
    image: "",
    published: true
  },
  {
    id: "aqualand",
    title: "Aqualand",
    category: "parchi-spettacoli",
    zone: "Costa Adeje",
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Parco acquatico con scivoli e aree per i più piccoli.",
      en: "Water park with slides and areas for younger children.",
      es: "Parque acuático con toboganes y zonas para los más pequeños."
    },
    image: "",
    published: true
  },
  {
    id: "jungle-park",
    title: "Jungle Park",
    category: "parchi-spettacoli",
    zone: "Las Águilas, Arona",
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Parco naturale con rapaci in volo libero, a pochi minuti da Los Cristianos.",
      en: "Nature park with free-flying birds of prey, minutes from Los Cristianos.",
      es: "Parque natural con aves rapaces en vuelo libre, a pocos minutos de Los Cristianos."
    },
    image: "",
    published: true
  },
  {
    id: "fun-trip",
    title: "Fun Trip — Aqualand + Jungle Park",
    category: "parchi-spettacoli",
    zone: { it: "Tenerife sud", en: "South Tenerife", es: "Tenerife sur" },
    duration: { it: "2 giornate", en: "2 days", es: "2 días" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Biglietto combinato per i due parchi del sud.",
      en: "Combined ticket for the two parks in the south.",
      es: "Entrada combinada para los dos parques del sur."
    },
    image: "",
    published: true
  },
  {
    id: "cena-medievale",
    title: {
      it: "Cena spettacolo medievale",
      en: "Medieval dinner show",
      es: "Cena espectáculo medieval"
    },
    category: "parchi-spettacoli",
    zone: "Castillo San Miguel",
    duration: { it: "Serata", en: "Evening", es: "Noche" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Cavalieri, cavalli e tornei dal vivo, con cena servita durante lo spettacolo.",
      en: "Knights, horses and live tournaments, with dinner served during the show.",
      es: "Caballeros, caballos y torneos en directo, con cena servida durante el espectáculo."
    },
    image: "",
    published: true
  },

  // ─── TOUR DELL'ISOLA ──────────────────────────────────────────────────────
  {
    id: "island-tour-completo",
    title: {
      it: "Tour completo dell'isola",
      en: "Full island tour",
      es: "Tour completo de la isla"
    },
    category: "tour-isola",
    zone: { it: "Tutta l'isola", en: "All over the island", es: "Toda la isla" },
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo" },
    priceFrom: null,
    family: true,
    desc: {
      it: "I punti simbolo di Tenerife in un giorno solo, in pullman con guida.",
      en: "Tenerife's landmark sights in a single day, by coach with a guide.",
      es: "Los lugares emblemáticos de Tenerife en un solo día, en autobús con guía."
    },
    image: "",
    published: true
  },
  {
    id: "icod-garachico-orotava",
    title: "Icod, Garachico & La Orotava",
    category: "tour-isola",
    zone: { it: "Tenerife nord", en: "North Tenerife", es: "Tenerife norte" },
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Il Drago Millenario di Icod, le piscine naturali di Garachico e i balconi di La Orotava.",
      en: "The thousand-year-old dragon tree of Icod, the natural pools of Garachico and the balconies of La Orotava.",
      es: "El Drago Milenario de Icod, las piscinas naturales de Garachico y los balcones de La Orotava."
    },
    image: "",
    published: true
  },
  {
    id: "puerto-de-la-cruz",
    title: "Puerto de la Cruz",
    category: "tour-isola",
    zone: { it: "Tenerife nord", en: "North Tenerife", es: "Tenerife norte" },
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Una delle città più antiche dell'isola: Lago Martiánez, giardino botanico e Plaza del Charco.",
      en: "One of the oldest towns on the island: Lago Martiánez, the botanical garden and Plaza del Charco.",
      es: "Una de las ciudades más antiguas de la isla: Lago Martiánez, jardín botánico y Plaza del Charco."
    },
    image: "",
    published: true
  },
  {
    id: "la-gomera",
    title: "La Gomera",
    category: "tour-isola",
    zone: { it: "Isola di La Gomera", en: "Island of La Gomera", es: "Isla de La Gomera" },
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Traghetto e giro dell'isola vicina, con il Parco Nazionale di Garajonay.",
      en: "Ferry and a tour of the neighbouring island, including Garajonay National Park.",
      es: "Ferry y recorrido por la isla vecina, con el Parque Nacional de Garajonay."
    },
    image: "",
    published: true
  },
  {
    id: "gran-canaria",
    title: "Gran Canaria",
    category: "tour-isola",
    zone: { it: "Isola di Gran Canaria", en: "Island of Gran Canaria", es: "Isla de Gran Canaria" },
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Escursione di un giorno sull'isola vicina.",
      en: "A day trip to the neighbouring island.",
      es: "Excursión de un día a la isla vecina."
    },
    image: "",
    published: true
  },
  {
    id: "cantine-vinicole",
    title: {
      it: "Cantine vinicole con sommelier",
      en: "Wineries with a sommelier",
      es: "Bodegas con sumiller"
    },
    category: "tour-isola",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    family: false,
    desc: {
      it: "Degustazione di vini vulcanici e prodotti tipici, guidati da un sommelier.",
      en: "Tasting of volcanic wines and local produce, led by a sommelier.",
      es: "Cata de vinos volcánicos y productos típicos, guiada por un sumiller."
    },
    image: "",
    published: true
  },

  // ─── TOUR PRIVATI ─────────────────────────────────────────────────────────
  {
    id: "charter-privato",
    title: {
      it: "Charter privato all inclusive",
      en: "All-inclusive private charter",
      es: "Chárter privado todo incluido"
    },
    category: "tour-privati",
    zone: "Puerto Colón",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Barca riservata al tuo gruppo, con percorso e orari concordati.",
      en: "A boat reserved for your group, with the route and times agreed with you.",
      es: "Barco reservado para tu grupo, con ruta y horarios acordados."
    },
    image: "",
    published: true
  },
  {
    id: "tour-privato-su-misura",
    title: {
      it: "Tour privato su misura",
      en: "Tailor-made private tour",
      es: "Tour privado a medida"
    },
    category: "tour-privati",
    zone: { it: "Tutta l'isola", en: "All over the island", es: "Toda la isla" },
    duration: { it: "Da concordare", en: "By arrangement", es: "A convenir" },
    priceFrom: null,
    family: true,
    desc: {
      it: "Itinerario costruito su richiesta, con guida e mezzo dedicati.",
      en: "An itinerary built on request, with a dedicated guide and vehicle.",
      es: "Itinerario diseñado a petición, con guía y vehículo dedicados."
    },
    image: "",
    published: true
  }
];

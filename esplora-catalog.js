// Catalogo delle attività di Isla, smistate nelle categorie della home.
//
// COME COMPILARE UNA VOCE
//   image      → nome del file dentro assets/. Vuoto = foto ancora da caricare.
//                Piu voci possono indicare lo stesso file: la foto sta in
//                assets/ una volta sola e il telefono la scarica una volta
//                sola, anche se compare in dieci schede diverse.
//   priceFrom  → numero in euro, oppure null se il prezzo non è ancora definito.
//   priceUnit  → facoltativo: si aggiunge dopo il prezzo quando non è "a persona"
//                ma a ore o a gruppo, es. { it: "/ora", en: "/hr", es: "/h" }.
//   priceTiers → facoltativo: prezzi a scaglioni per numero di persone. La
//                scheda del catalogo mostra comunque priceFrom, la pagina di
//                dettaglio elenca tutti gli scaglioni:
//                    priceTiers: [ { from: 7, to: 10, price: 350 } ]
//   priceAdult → prezzo per adulto, in euro. 0 = non ancora deciso.
//   priceChild → prezzo per bambino, in euro. 0 = non ancora deciso.
//                A 0 le righe NON compaiono sulla pagina: un "€0" davanti a un
//                cliente sembra gratis o rotto. Appena metti un numero vero,
//                la riga si accende da sola.
//   privateOption → facoltativo: id dell'escursione in versione privata. Sulla
//                pagina di dettaglio compare un rimando "vuoi la barca solo per
//                il tuo gruppo?".
//   season     → facoltativo: quando l'attivita' si fa solo in certi mesi. Compare
//                come etichetta sulla scheda, come riga sulla pagina di dettaglio e
//                come avviso nella finestra della richiesta, cioe' prima che il
//                cliente scelga una data impossibile. Esempio:
//                    season: { it: "Solo luglio e agosto", en: "July and August only",
//                              es: "Solo julio y agosto" }
//   transfer   → facoltativo: quando l'attivita' si puo' avere col trasporto incluso.
//                Sulla scheda compare la pillola "Transfer disponibile", sulla pagina
//                di dettaglio questo testo per esteso, che e' il posto dove spiegare
//                i limiti (per il Twin Ticket il transfer vale solo per Loro Parque).
//                    transfer: { it: "Disponibile su richiesta", en: "...", es: "..." }
//   transferPrice → facoltativo: quanto costa la stessa attivita' col transfer
//                incluso, in euro. { adult, child, baby }. `baby` e' il solo posto
//                sul pullman per i neonati, che senza transfer non esiste. Compare
//                come riga in fondo alla pagina di dettaglio.
//                    transferPrice: { adult: 99, child: 74, baby: 17 }
//   options    → facoltativo: le varianti della stessa attivita' fra cui il cliente
//                sceglie (1 o 2 ore, quale percorso, quale spettacolo). Sulla pagina
//                di dettaglio diventano una riga ciascuna, con il prezzo se c'e';
//                nella finestra della richiesta diventano un menu a tendina, e la
//                scelta finisce nel messaggio WhatsApp.
//                    options: {
//                      label: { it: "Durata", en: "Duration", es: "Duración" },
//                      choices: [
//                        { label: { it: "1 ora", ... }, price: 150 },
//                        { label: { it: "2 ore", ... }, price: 180 }
//                      ]
//                    }
//                `price` si puo' omettere quando il prezzo della variante non lo
//                sappiamo ancora: la riga mostra solo il nome.
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

// Numero WhatsApp su cui arrivano le richieste. Formato internazionale, senza
// + e senza spazi. Sta qui perche' questo file e' caricato da tutte le pagine:
// lo usano sia le schede del catalogo sia l'assistente. Svuotalo per nascondere
// ovunque i pulsanti che aprono WhatsApp.
const WHATSAPP_NUMBER = "34662908073";

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
  // Prodotti presi dal catalogo Admiral (categoria "Boats").
  // I titoli restano scritti come li scrive Admiral, uguali in tutte le lingue:
  // cosi' il cliente vede lo stesso nome del sito e, quando la richiesta
  // arriva su WhatsApp, in ufficio si ritrova il nome esatto da cercare.
  {
    id: "private-charter",
    title: "Private Charter",
    category: "mare-barche",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 350,
    priceUnit: { it: " a gruppo", en: " per group", es: " por grupo" },
    priceTiers: [
      { from: 7,  to: 10, price: 350 },
      { from: 11, to: 15, price: 450 }
    ],
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Barca riservata solo al tuo gruppo, con percorso e orari concordati. Il prezzo è per l'intera barca, non a persona.",
      en: "A boat reserved for your group alone, with the route and times agreed with you. The price is for the whole boat, not per person.",
      es: "Barco reservado solo para tu grupo, con ruta y horarios acordados. El precio es por el barco entero, no por persona."
    },
    image: "private-charter.jpg",
    published: true
  },
  {
    id: "catamaran-3h",
    title: "3-Hour Catamaran Excursion",
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    priceFrom: 45,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Tre ore di catamarano lungo la costa, senza programmi complicati.",
      en: "Three hours of catamaran along the coast, with nothing complicated planned.",
      es: "Tres horas de catamaran por la costa, sin planes complicados."
    },
    image: "catamaran-3h.jpg",
    published: true
  },
  {
    id: "whale-dolphin-3h",
    title: "3-Hour Whale & Dolphin Boat Trip",
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    priceFrom: 55,
    privateOption: "private-charter",
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Tre ore in barca alla ricerca di balene e delfini, con partenza da Puerto Colón.",
      en: "Three hours at sea looking for whales and dolphins, departing from Puerto Colón.",
      es: "Tres horas en barco buscando ballenas y delfines, saliendo de Puerto Colón."
    },
    image: "Cat-mare.jpg",
    published: true
  },
  {
    id: "submarine-safari",
    title: "Submarine Safari",
    category: "mare-barche",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 61,
    priceAdult: 61,
    priceChild: 37,
    family: true,
    desc: {
      it: "Discesa sott'acqua a bordo di un sottomarino turistico, per vedere il fondale senza bagnarsi.",
      en: "A dive below the surface aboard a tourist submarine, to see the seabed without getting wet.",
      es: "Inmersión bajo el agua a bordo de un submarino turístico, para ver el fondo sin mojarse."
    },
    image: "submarine-safari.jpg",
    published: true
  },
  {
    id: "pesca-altura",
    title: { it: "Pesca d'altura", en: "Deep sea fishing", es: "Pesca de altura" },
    category: "mare-barche",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Uscita di pesca sportiva al largo, con attrezzatura e equipaggio a bordo.",
      en: "A sport fishing trip offshore, with tackle and crew on board.",
      es: "Salida de pesca deportiva mar adentro, con equipo y tripulación a bordo."
    },
    image: "pesca-altura.jpg",
    published: true
  },
  {
    id: "luxury-catamaran",
    title: "Luxury Catamaran Experience",
    category: "mare-barche",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 75,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Catamarano di categoria superiore, per chi vuole navigare con un occhio all'eleganza.",
      en: "A premium catamaran, for sailing with an eye on elegance.",
      es: "Catamarán de categoría superior, para navegar cuidando la elegancia."
    },
    image: "luxury-catamaran.jpg",
    published: true
  },
  {
    id: "small-group-catamaran",
    title: "Small Group Catamaran",
    category: "mare-barche",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 60,
    privateOption: "private-charter",
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Catamarano in piccolo gruppo: navigazione tranquilla e avvistamento dei delfini.",
      en: "Catamaran in a small group: relaxed cruising and dolphin spotting.",
      es: "Catamarán en grupo reducido: navegación tranquila y avistamiento de delfines."
    },
    image: "small-group-catamaran.jpg",
    published: true
  },
  {
    id: "glass-bottom-boat",
    title: "Glass Bottom Boat Adventure",
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    priceFrom: 58,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Tre ore su una barca con il fondo trasparente: si guarda sott'acqua restando a bordo.",
      en: "Three hours on a glass-bottomed boat: you watch below the surface without leaving the deck.",
      es: "Tres horas en un barco con fondo de cristal: se mira bajo el agua sin salir de cubierta."
    },
    image: "glass-bottom-boat.jpg",
    published: true
  },
  {
    id: "utopia-boat-party",
    title: "Utopia Boat Party",
    category: "mare-barche",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 70,
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "La festa in barca piu' scatenata dell'isola, quella originale.",
      en: "The wildest boat party on the island, and the original one.",
      es: "La fiesta en barco mas animada de la isla, la original."
    },
    image: "party-boat.jpg",
    published: true
  },
  {
    id: "shogun",
    title: "Shogun",
    category: "mare-barche",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "5 ore", en: "5 hours", es: "5 horas" },
    priceFrom: 58,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Cinque ore a bordo dello Shogun, veliero dalle linee orientali.",
      en: "Five hours aboard the Shogun, a sailing ship with oriental lines.",
      es: "Cinco horas a bordo del Shogun, velero de lineas orientales."
    },
    image: "shogun.jpg",
    published: true
  },
  {
    id: "opera-60",
    title: "Opera 60",
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 80,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Avvistamento di delfini e balene a bordo dell'Opera 60, in versione premium.",
      en: "Dolphin and whale watching aboard the Opera 60, in its premium version.",
      es: "Avistamiento de delfines y ballenas a bordo del Opera 60, en version premium."
    },
    image: "opera-60.jpg",
    published: true
  },
  {
    id: "self-drive-boats",
    title: "Self-Drive Boats",
    category: "mare-barche",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 190,
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Al timone ci sei tu: barca senza skipper, si guida da soli.",
      en: "You take the helm: a boat without a skipper, you drive it yourself.",
      es: "Al timon vas tu: barco sin patron, lo conduces tu mismo."
    },
    image: "self-drive-boats.jpg",
    published: true
  },
  {
    id: "small-catamaran-rental",
    title: "Small Catamaran Rental",
    category: "mare-barche",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Noleggio a ore", en: "Hourly rental", es: "Alquiler por horas" },
    priceFrom: 100,
    priceUnit: { it: "/ora", en: "/hr", es: "/h" },
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Noleggio di un piccolo catamarano a ore. Non serve la patente nautica.",
      en: "Hourly rental of a small catamaran. No boat licence needed.",
      es: "Alquiler por horas de un catamaran pequeno. No hace falta titulacion."
    },
    image: "small-catamaran-rental.jpg",
    published: true
  },
  {
    id: "luxury-cruiser",
    title: "Luxury Cruiser Experience",
    category: "mare-barche",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    priceFrom: 65,
    privateOption: "private-charter",
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Tre ore a bordo di un cruiser di lusso, senza fretta.",
      en: "Three hours aboard a luxury cruiser, with no rush.",
      es: "Tres horas a bordo de un crucero de lujo, sin prisa."
    },
    image: "luxury-cruiser.jpg",
    published: true
  },
  {
    id: "catamaran-gigantes-masca",
    title: "4-Hour Catamaran to Los Gigantes & Masca",
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "4 ore", en: "4 hours", es: "4 horas" },
    priceFrom: 58,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Quattro ore in catamarano fino alle scogliere di Los Gigantes e alla baia di Masca.",
      en: "Four hours by catamaran out to the cliffs of Los Gigantes and Masca bay.",
      es: "Cuatro horas en catamaran hasta los acantilados de Los Gigantes y la bahia de Masca."
    },
    image: "catamaran-gigantes-masca.jpg",
    published: true
  },

  // ─── TEIDE E NATURA ───────────────────────────────────────────────────────
  {
    id: "teide-national-park",
    title: "Teide National Park",
    category: "teide-natura",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 48,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Giornata nel Parco Nazionale del Teide, fra colate laviche e paesaggi vulcanici.",
      en: "A day in Teide National Park, among lava flows and volcanic landscapes.",
      es: "Un día en el Parque Nacional del Teide, entre coladas de lava y paisajes volcánicos."
    },
    image: "",
    published: true
  },
  {
    id: "teide-masca",
    title: "Teide + Masca Tour",
    category: "teide-natura",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 60,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Il Parco Nazionale del Teide e il borgo di Masca nella stessa giornata.",
      en: "Teide National Park and the hamlet of Masca in the same day.",
      es: "El Parque Nacional del Teide y el pueblo de Masca en la misma jornada."
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
    priceAdult: 0,
    priceChild: 0,
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
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Discesa di un canyon vulcanico tra calate in corda e pozze d'acqua.",
      en: "Descending a volcanic canyon between rope abseils and rock pools.",
      es: "Descenso de un barranco volcánico entre rápeles y pozas de agua."
    },
    image: "",
    published: true
  },
  {
    id: "trekking-bici",
    title: { it: "Trekking e bici", en: "Hiking & biking", es: "Senderismo y bici" },
    category: "teide-natura",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Giornata fra sentieri e bicicletta, con guida.",
      en: "A day between trails and bike, with a guide.",
      es: "Jornada entre senderos y bicicleta, con guía."
    },
    image: "",
    published: true
  },
  {
    id: "pico-teide",
    title: { it: "Salita al Pico del Teide", en: "Teide summit climb", es: "Subida al Pico del Teide" },
    category: "teide-natura",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Salita a piedi fino alla cima del Teide. Serve il permesso, che va chiesto in anticipo.",
      en: "The climb on foot to the summit of Teide. A permit is required and must be requested in advance.",
      es: "La subida a pie hasta la cima del Teide. Hace falta permiso, que se solicita con antelación."
    },
    image: "",
    published: true
  },

  // ─── STELLE E ASTRONOMIA ──────────────────────────────────────────────────
  {
    id: "stargazing-group",
    title: "Stargazing – Large Group Experience",
    category: "stelle",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 75,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Serata di osservazione delle stelle in gruppo, con guida.",
      en: "An evening of stargazing in a group, with a guide.",
      es: "Velada de observación de estrellas en grupo, con guía."
    },
    image: "stargazing-group.jpg",
    published: true
  },
  {
    id: "stargazing-vip",
    title: "VIP Stargazing Experience",
    category: "stelle",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 85,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Osservazione delle stelle in versione VIP, in gruppo ristretto.",
      en: "Stargazing in its VIP version, in a small group.",
      es: "Observación de estrellas en versión VIP, en grupo reducido."
    },
    image: "stargazing-vip.jpg",
    published: true
  },

  // ─── AVVENTURA E MOTORI ───────────────────────────────────────────────────
  {
    id: "quad-provisional-license",
    title: "1.5 Hour Provisional License Quad Trip",
    category: "avventura-motori",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "1 ora e mezza", en: "1.5 hours", es: "1,5 horas" },
    priceFrom: 160,
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Uscita in quad di un'ora e mezza, nella formula con licenza provvisoria.",
      en: "An hour and a half out on a quad, in the provisional licence format.",
      es: "Salida en quad de hora y media, en la modalidad con licencia provisional."
    },
    image: "quad-provisional-license.jpg",
    published: true
  },
  {
    id: "mustang-experience",
    title: "Mustang Experience",
    category: "avventura-motori",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 250,
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Al volante di una Ford Mustang decappottabile, su fino ai punti panoramici del Teide.",
      en: "At the wheel of a Ford Mustang convertible, up to the viewpoints on Teide.",
      es: "Al volante de un Ford Mustang descapotable, hasta los miradores del Teide."
    },
    image: "mustang-experience.jpg",
    published: true
  },
  {
    id: "buggy-volcano-4h",
    title: "4-Hour Volcano Buggy Tour",
    category: "avventura-motori",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "4 ore", en: "4 hours", es: "4 horas" },
    priceFrom: 210,
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Quattro ore in buggy tra i vulcani, di cui un'ora di fuoristrada. Disponibile a 2, 4 o 6 posti.",
      en: "Four hours of buggy among the volcanoes, one of them off-road. Available as a 2, 4 or 6 seater.",
      es: "Cuatro horas en buggy entre volcanes, una de ellas fuera de pista. Disponible de 2, 4 o 6 plazas."
    },
    image: "buggy-volcano-4h.jpg",
    published: true
  },
  {
    id: "buggy-volcano-sunset",
    title: "Volcano Sunset Buggy Tour",
    category: "avventura-motori",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    priceFrom: 190,
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Buggy al tramonto tra i coni vulcanici, tre ore. Disponibile a 2, 4 o 6 posti.",
      en: "Buggy at sunset among the volcanic cones, three hours. Available as a 2, 4 or 6 seater.",
      es: "Buggy al atardecer entre los conos volcánicos, tres horas. Disponible de 2, 4 o 6 plazas."
    },
    image: "buggy-volcano-sunset.jpg",
    published: true
  },
  {
    id: "buggy-2-3h",
    title: "2 or 3-Hour Buggy Tour",
    category: "avventura-motori",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "2 o 3 ore", en: "2 or 3 hours", es: "2 o 3 horas" },
    priceFrom: 160,
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Due o tre ore in buggy, di cui 40 minuti di fuoristrada. Due ore da €160, tre ore da €190.",
      en: "Two or three hours of buggy, including 40 minutes off-road. Two hours from €160, three hours from €190.",
      es: "Dos o tres horas en buggy, con 40 minutos fuera de pista. Dos horas desde €160, tres horas desde €190."
    },
    image: "buggy-2-3h.jpg",
    published: true
  },
  {
    id: "quad-teide-sunset",
    title: "Sunset on Teide Quad Tour",
    category: "avventura-motori",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    priceFrom: 150,
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Tre ore in quad verso il Teide, al tramonto.",
      en: "Three hours on a quad towards Teide, at sunset.",
      es: "Tres horas en quad hacia el Teide, al atardecer."
    },
    image: "quad-teide-sunset.jpg",
    published: true
  },
  {
    id: "quad-teide-adventure",
    title: "Teide Quad Adventure",
    category: "avventura-motori",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    priceFrom: 150,
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Tre ore in quad sul Teide.",
      en: "Three hours on a quad on Teide.",
      es: "Tres horas en quad en el Teide."
    },
    image: "quad-teide-adventure.jpg",
    published: true
  },
  {
    id: "helicopter-tours",
    title: "Helicopter Tours",
    category: "avventura-motori",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 98,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Tenerife vista dall'alto: sorvolo dell'isola in elicottero.",
      en: "Tenerife seen from above: a helicopter flight over the island.",
      es: "Tenerife vista desde el aire: sobrevuelo de la isla en helicóptero."
    },
    image: "helicopter-tours.jpg",
    published: true
  },
  {
    id: "paragliding",
    title: "Paragliding",
    category: "avventura-motori",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 110,
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Volo in parapendio in tandem con istruttore.",
      en: "A tandem paragliding flight with an instructor.",
      es: "Vuelo en parapente en tándem con instructor."
    },
    image: "paragliding.jpg",
    published: true
  },
  {
    id: "karting",
    title: "Karting",
    category: "avventura-motori",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "10 minuti a tanda", en: "10-minute session", es: "10 minutos por tanda" },
    priceFrom: 20,
    priceAdult: 20,
    priceChild: 15,
    family: false,
    desc: {
      it: "Giri in pista su kart, cronometrati.",
      en: "Timed laps on a go-kart track.",
      es: "Vueltas cronometradas en pista de karts."
    },
    image: "karting.jpg",
    published: true
  },
  {
    id: "cavallo",
    title: { it: "Passeggiata a cavallo", en: "Horseback riding", es: "Paseo a caballo" },
    category: "avventura-motori",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Passeggiata a cavallo con guida, lungo sentieri con vista sull'oceano.",
      en: "A guided horseback ride along trails with ocean views.",
      es: "Paseo a caballo con guía por senderos con vistas al océano."
    },
    image: "cavallo.jpg",
    published: true
  },

  // ─── SPORT ACQUATICI ──────────────────────────────────────────────────────
  {
    id: "fiat-500-water-car",
    title: "Fiat 500 Water Car",
    category: "sport-acquatici",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 130,
    priceAdult: 0,
    priceChild: 0,
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
    id: "jet-car-rental",
    title: "Jet Car Rental",
    category: "sport-acquatici",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 100,
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Noleggio di una jet car: al timone ci sei tu, in mezzo al mare.",
      en: "Jet car rental: you take the wheel, out on the open water.",
      es: "Alquiler de jet car: llevas tú el timón, en mar abierto."
    },
    image: "jet-car-rental.jpg",
    published: true
  },
  {
    id: "banana-boat",
    title: "Banana Boat or Fly Fish Ride",
    category: "sport-acquatici",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 18,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Il gonfiabile trainato dal motoscafo, in versione banana o fly fish. Si sceglie sul posto.",
      en: "The inflatable towed by a speedboat, banana or fly fish. You choose on the spot.",
      es: "El hinchable remolcado por la lancha, en versión banana o fly fish. Se elige allí mismo."
    },
    image: "banana-boat.jpg",
    published: true
  },
  {
    id: "kayak-snorkelling",
    title: "Kayaking & Snorkelling Combo",
    category: "sport-acquatici",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 45,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Kayak lungo la costa e sosta con maschera e boccaglio, nella stessa uscita.",
      en: "Kayaking along the coast plus a mask-and-snorkel stop, in the same outing.",
      es: "Kayak por la costa y parada con máscara y tubo, en la misma salida."
    },
    image: "kayak-snorkelling.jpg",
    published: true
  },
  {
    id: "parascending",
    title: "Parascending",
    category: "sport-acquatici",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 60,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Paracadute trainato da motoscafo, con vista dall'alto sulla costa.",
      en: "A parachute towed by a speedboat, with the coast seen from above.",
      es: "Paracaídas remolcado por una lancha, con vistas de la costa desde el aire."
    },
    image: "parascending.jpg",
    published: true
  },
  {
    id: "jet-ski-safari-1-2h",
    title: "Jet Ski Safari – 1 or 2 Hours",
    category: "sport-acquatici",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "1 o 2 ore", en: "1 or 2 hours", es: "1 o 2 horas" },
    priceFrom: 150,
    priceAdult: 0,
    priceChild: 0,
    options: {
      label: { it: "Durata", en: "Duration", es: "Duración" },
      choices: [
        { label: { it: "1 ora",  en: "1 hour",  es: "1 hora" },  price: 150 },
        { label: { it: "2 ore",  en: "2 hours", es: "2 horas" }, price: 180 }
      ]
    },
    family: false,
    desc: {
      it: "Safari in moto d'acqua lungo la costa, con istruttore. Un'ora da €150, due ore da €180.",
      en: "Jet ski safari along the coast, with an instructor. One hour from €150, two hours from €180.",
      es: "Safari en moto de agua por la costa, con instructor. Una hora desde €150, dos horas desde €180."
    },
    image: "jet-ski-safari-1-2h.jpg",
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
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Prima immersione per principianti, oppure percorso per il brevetto.",
      en: "A first dive for beginners, or the full path to certification.",
      es: "Primera inmersión para principiantes o curso completo para obtener el título."
    },
    image: "immersioni.jpg",
    published: true
  },
  {
    id: "flyboard",
    title: "Flyboard",
    category: "sport-acquatici",
    zone: "Costa Adeje",
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Sollevarsi sull'acqua con la tavola a getto, con istruttore.",
      en: "Rising above the water on a jet-powered board, with an instructor.",
      es: "Elevarse sobre el agua con la tabla a chorro, con instructor."
    },
    image: "flyboard.jpg",
    published: true
  },
  {
    id: "surf-lesson",
    title: { it: "Lezione di surf", en: "Surf lesson", es: "Clase de surf" },
    category: "sport-acquatici",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Prima lezione di surf con istruttore, tavola e muta compresi.",
      en: "A first surf lesson with an instructor, board and wetsuit included.",
      es: "Primera clase de surf con instructor, tabla y neopreno incluidos."
    },
    image: "surf-lesson.jpg",
    published: true
  },

  // ─── PARCHI E SPETTACOLI ──────────────────────────────────────────────────
  {
    id: "siam-park",
    title: "Siam Park",
    category: "parchi-spettacoli",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 48,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Parco acquatico a tema thailandese, fra i più premiati al mondo.",
      en: "Thai-themed water park, one of the most awarded in the world.",
      es: "Parque acuático de temática tailandesa, uno de los más premiados del mundo."
    },
    image: "siam-park.jpg",
    published: true
  },
  {
    id: "siam-night",
    title: "Siam Night",
    category: "parchi-spettacoli",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    season: {
      it: "Solo luglio e agosto",
      en: "July and August only",
      es: "Solo julio y agosto"
    },
    priceFrom: 48,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Il Siam Park dopo il tramonto, nella sua versione serale.",
      en: "Siam Park after dark, in its evening version.",
      es: "El Siam Park después del atardecer, en su versión nocturna."
    },
    image: "siam-night.jpg",
    published: true
  },
  {
    id: "loro-parque",
    title: "Loro Parque",
    category: "parchi-spettacoli",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 44,
    priceAdult: 0,
    priceChild: 0,
    transfer: {
      it: "Disponibile su richiesta",
      en: "Available on request",
      es: "Disponible bajo petición"
    },
    family: true,
    desc: {
      it: "Zoo e giardino tropicale, conosciuto in tutto il mondo per i suoi animali.",
      en: "Zoo and tropical garden, known worldwide for its animals.",
      es: "Zoo y jardín tropical, conocido en todo el mundo por sus animales."
    },
    image: "loro-parque.jpg",
    published: true
  },
  {
    id: "twin-ticket",
    title: "Twin Ticket – Siam Park + Loro Parque",
    category: "parchi-spettacoli",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 78,
    priceAdult: 78,
    priceChild: 57,
    transfer: {
      it: "Disponibile su richiesta, solo per la giornata a Loro Parque",
      en: "Available on request, for the Loro Parque day only",
      es: "Disponible bajo petición, solo para el día en Loro Parque"
    },
    transferPrice: { adult: 99, child: 74, baby: 17 },
    family: true,
    desc: {
      it: "Biglietto combinato per i due parchi più conosciuti dell'isola.",
      en: "Combined ticket for the two best-known parks on the island.",
      es: "Entrada combinada para los dos parques más conocidos de la isla."
    },
    image: "Cat-parchi.jpg",
    published: true
  },
  {
    id: "aqualand",
    title: "Aqualand",
    category: "parchi-spettacoli",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 37,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Parco acquatico con scivoli e aree per tutte le età.",
      en: "Water park with slides and areas for every age.",
      es: "Parque acuático con toboganes y zonas para todas las edades."
    },
    image: "aqualand.jpg",
    published: true
  },
  {
    id: "jungle-park",
    title: "Jungle Park",
    category: "parchi-spettacoli",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 36,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Parco naturale con animali e rapaci in volo libero.",
      en: "Nature park with animals and free-flying birds of prey.",
      es: "Parque natural con animales y aves rapaces en vuelo libre."
    },
    image: "jungle-park.jpg",
    published: true
  },
  {
    id: "combo-jungle-aqualand",
    title: "Combo Ticket – Jungle Park + Aqualand",
    category: "parchi-spettacoli",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 53,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Biglietto combinato per i due parchi del sud.",
      en: "Combined ticket for the two parks in the south.",
      es: "Entrada combinada para los dos parques del sur."
    },
    image: "combo-jungle-aqualand.jpg",
    published: true
  },
  {
    id: "monkey-park",
    title: "Monkey Park",
    category: "parchi-spettacoli",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 10,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Piccolo parco dedicato alle scimmie e ad altri animali.",
      en: "A small park dedicated to monkeys and other animals.",
      es: "Pequeño parque dedicado a los monos y a otros animales."
    },
    image: "monkey-park.jpg",
    published: true
  },
  {
    id: "mht-drag-show",
    title: "MHT – Music Hall Tavern Drag Show & Dinner",
    category: "parchi-spettacoli",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Serata", en: "Evening", es: "Noche" },
    priceFrom: 49,
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Cena e spettacolo drag al Music Hall Tavern.",
      en: "Dinner and drag show at the Music Hall Tavern.",
      es: "Cena y espectáculo drag en el Music Hall Tavern."
    },
    image: "mht-drag-show.jpg",
    published: true
  },
  {
    id: "castillo-san-miguel",
    title: "Castillo San Miguel – Medieval Night",
    category: "parchi-spettacoli",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Serata", en: "Evening", es: "Noche" },
    priceFrom: 44,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Serata medievale al castello: cavalieri, cavalli e torneo, con cena servita durante lo spettacolo.",
      en: "A medieval night at the castle: knights, horses and a tournament, with dinner served during the show.",
      es: "Noche medieval en el castillo: caballeros, caballos y torneo, con cena servida durante el espectáculo."
    },
    image: "castillo-san-miguel.jpg",
    published: true
  },
  {
    id: "flamenco-show",
    title: "¡Olé! Flamenco Show",
    category: "parchi-spettacoli",
    zone: "Costa Adeje",
    duration: { it: "1 ora e 30", en: "1.5 hours", es: "1 hora y media" },
    priceFrom: 35,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Spettacolo di flamenco dal vivo, con musicisti e ballerini. I bambini dai 3 ai 12 anni pagano meno; sotto i 3 anni non si entra.",
      en: "A live flamenco show, with musicians and dancers. Children aged 3 to 12 pay less; under 3s are not admitted.",
      es: "Espectáculo de flamenco en directo, con músicos y bailaores. Los niños de 3 a 12 años pagan menos; menores de 3 años no entran."
    },
    image: "",
    published: true
  },
  {
    id: "scandal-dinner-show",
    title: "Scandal Dinner Show",
    category: "parchi-spettacoli",
    zone: "Costa Adeje",
    duration: { it: "Serata", en: "Evening", es: "Noche" },
    priceFrom: null,
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Cena e cabaret in una serata pensata per adulti: vietata ai minori di 16 anni.",
      en: "Dinner and cabaret in an evening made for adults: no under-16s.",
      es: "Cena y cabaret en una velada pensada para adultos: prohibida a menores de 16 años."
    },
    image: "",
    published: true
  },
  {
    id: "history-music-show",
    title: "History – The Evolution of Music",
    category: "parchi-spettacoli",
    zone: "Pirámide de Arona",
    duration: { it: "2 ore e 30", en: "2.5 hours", es: "2 horas y media" },
    priceFrom: 49,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Spettacolo musicale dal vivo che ripercorre la storia della musica.",
      en: "A live music show travelling through the history of music.",
      es: "Espectáculo musical en directo que recorre la historia de la música."
    },
    image: "",
    published: true
  },

  // ─── TOUR DELL'ISOLA ──────────────────────────────────────────────────────
  {
    id: "la-gomera",
    title: "La Gomera Island Tour",
    category: "tour-isola",
    zone: { it: "Isola di La Gomera", en: "Island of La Gomera", es: "Isla de La Gomera" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 99,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Escursione di una giornata sull'isola vicina di La Gomera.",
      en: "A day trip to the neighbouring island of La Gomera.",
      es: "Excursión de un día a la isla vecina de La Gomera."
    },
    image: "",
    published: true
  },
  {
    id: "santa-cruz-taganana",
    title: "Santa Cruz + Taganana Tour",
    category: "tour-isola",
    zone: { it: "Tenerife nord-est", en: "North-east Tenerife", es: "Tenerife noreste" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: 48,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "La capitale Santa Cruz e il borgo di Taganana, nel massiccio di Anaga.",
      en: "The capital Santa Cruz and the village of Taganana, in the Anaga massif.",
      es: "La capital, Santa Cruz, y el pueblo de Taganana, en el macizo de Anaga."
    },
    image: "",
    published: true
  },
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
    priceAdult: 0,
    priceChild: 0,
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
    priceAdult: 0,
    priceChild: 0,
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
    priceAdult: 0,
    priceChild: 0,
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
    id: "gran-canaria",
    title: "Gran Canaria",
    category: "tour-isola",
    zone: { it: "Isola di Gran Canaria", en: "Island of Gran Canaria", es: "Isla de Gran Canaria" },
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo" },
    priceFrom: null,
    priceAdult: 0,
    priceChild: 0,
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
    id: "la-palma",
    title: "La Palma",
    category: "tour-isola",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Escursione di una giornata sull'isola di La Palma.",
      en: "A day trip to the island of La Palma.",
      es: "Excursión de un día a la isla de La Palma."
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
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Degustazione di vini vulcanici e prodotti tipici, guidati da un sommelier.",
      en: "Tasting of volcanic wines and local produce, led by a sommelier.",
      es: "Cata de vinos volcánicos y productos típicos, guiada por un sumiller."
    },
    image: "",
    published: true
  },
  {
    id: "tuk-tuk",
    title: { it: "Tour in tuk tuk", en: "Tuk Tuk Tour", es: "Tour en tuk tuk" },
    category: "tour-isola",
    zone: "Costa Adeje",
    duration: { it: "Da 1 ora", en: "From 1 hour", es: "Desde 1 hora" },
    priceFrom: 24,
    priceAdult: 0,
    priceChild: 0,
    options: {
      label: { it: "Percorso", en: "Route", es: "Ruta" },
      choices: [
        { label: {
            it: "Panoramico, con sosta per un drink",
            en: "Scenic, with a drinks stop",
            es: "Panorámica, con parada para tomar algo" } },
        { label: {
            it: "I punti principali di Costa Adeje",
            en: "The main sights of Costa Adeje",
            es: "Los puntos principales de Costa Adeje" } },
        { label: {
            it: "Completo, fino ai vulcani",
            en: "The complete one, out to the volcanoes",
            es: "La completa, hasta los volcanes" } }
      ]
    },
    family: true,
    desc: {
      it: "Giro guidato in tuk tuk elettrico sulla costa di Adeje. Ci sono più percorsi: quello panoramico con sosta per un drink, quello dei punti principali di Costa Adeje e quello lungo che arriva fino ai vulcani.",
      en: "A guided ride in an electric tuk tuk along the Adeje coast. There are several routes: the scenic one with a drinks stop, the one around the main sights of Costa Adeje, and the long one that reaches the volcanoes.",
      es: "Recorrido guiado en tuk tuk eléctrico por la costa de Adeje. Hay varias rutas: la panorámica con parada para tomar algo, la de los puntos principales de Costa Adeje y la larga que llega hasta los volcanes."
    },
    image: "",
    published: true
  },
  {
    id: "trenino-turistico",
    title: { it: "Trenino turistico", en: "Tourist Train", es: "Tren turístico" },
    category: "tour-isola",
    zone: "Costa Adeje – Los Cristianos",
    duration: { it: "Tutto il giorno", en: "All day", es: "Todo el día" },
    priceFrom: 9,
    priceAdult: 9,
    priceChild: 5,
    family: true,
    desc: {
      it: "Trenino su gomma fra Costa Adeje e Los Cristianos: si sale e si scende alle fermate quando si vuole, il biglietto vale tutta la giornata.",
      en: "A road train between Costa Adeje and Los Cristianos: hop on and off at the stops as you like, the ticket lasts all day.",
      es: "Tren sobre ruedas entre Costa Adeje y Los Cristianos: subes y bajas en las paradas cuando quieras, el billete vale todo el día."
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
    priceAdult: 0,
    priceChild: 0,
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
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Itinerario costruito su richiesta, con guida e mezzo dedicati.",
      en: "An itinerary built on request, with a dedicated guide and vehicle.",
      es: "Itinerario diseñado a petición, con guía y vehículo dedicados."
    },
    image: "",
    published: true
  },
  {
    id: "teide-privato-giorno",
    title: { it: "Tour privato del Teide", en: "Private Teide Tour", es: "Tour privado del Teide" },
    category: "tour-privati",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Il Parco Nazionale del Teide con guida e mezzo riservati al tuo gruppo.",
      en: "Teide National Park with a guide and vehicle reserved for your group.",
      es: "El Parque Nacional del Teide con guía y vehículo reservados para tu grupo."
    },
    image: "",
    published: true
  },
  {
    id: "teide-privato-notte",
    title: { it: "Tour privato del Teide di notte", en: "Private Teide Tour by Night", es: "Tour privado del Teide de noche" },
    category: "tour-privati",
    zone: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar" },
    priceFrom: null,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Salita al Teide dopo il tramonto, con guida e mezzo solo per il tuo gruppo.",
      en: "Up to Teide after sunset, with a guide and vehicle for your group alone.",
      es: "Subida al Teide tras el atardecer, con guía y vehículo solo para tu grupo."
    },
    image: "",
    published: true
  },
];

// Cosa portare: i consigli che la pagina "Le mie prenotazioni" (booking.js)
// mostra sotto un'escursione CONFERMATA e non ancora passata.
//
// Vengono dalla pagina Notion "cose da portare" del proprietario (11 ottobre
// 2026). Su Notion i gruppi vuoti (Teide Stars, Mustang, 500, Banana boat,
// Kayak, Parascending, Immersioni, Surf, Siam Park, Poema del Mar, Show
// serali) qui non ci sono: quando il proprietario li riempie, si aggiunge un
// gruppo con le sue schede.
//
// COME SI COMPILA UN GRUPPO
//   schede → gli id delle schede di esplora-catalog.js che usano questa lista.
//            Una scheda sta in un gruppo solo; una scheda che non sta in
//            nessun gruppo non mostra il riquadro, e va benissimo così.
//   cose   → le voci, ognuna nelle quattro lingue.
// controlla.js verifica che ogni id esista, che nessuna scheda stia in due
// gruppi e che ogni voce abbia it, en, es e fr.

const COSE_DA_PORTARE = [
  {
    gruppo: "Barca",
    schede: [
      "freebird-catamaran", "royal-delfin", "whale-dolphin-3h", "peter-pan",
      "flipper-one", "luxury-catamaran", "small-group-catamaran",
      "utopia-boat-party", "shogun", "opera-60", "luxury-cruiser",
      "skyline-cruiser", "ragnarok",
      "private-charter", "whale-dolphin-3h-charter", "luxury-catamaran-charter",
      "small-group-catamaran-charter", "opera-60-charter",
      "skyline-cruiser-charter", "luxury-cruiser-charter"
    ],
    cose: [
      { it: "Costume", en: "Swimsuit", es: "Bañador", fr: "Maillot de bain" },
      { it: "Crema solare", en: "Sun cream", es: "Crema solar", fr: "Crème solaire" },
      { it: "Asciugamano", en: "Towel", es: "Toalla", fr: "Serviette" },
      { it: "Giacca leggera", en: "Light jacket", es: "Chaqueta ligera", fr: "Veste légère" }
    ]
  },
  {
    gruppo: "Tour guidati",
    schede: [
      "teide-national-park", "icod-garachico-orotava", "trekking-bici",
      "la-gomera", "santa-cruz-taganana", "island-tour-completo", "la-palma",
      "cantine-vinicole", "bananas-wines", "finca-tuno",
      "masca-teide-cabrio-bus"
    ],
    cose: [
      { it: "Felpa o giacca", en: "Sweatshirt or jacket", es: "Sudadera o chaqueta", fr: "Sweat ou veste" },
      { it: "Scarpe comode", en: "Comfortable shoes", es: "Calzado cómodo", fr: "Chaussures confortables" },
      { it: "Protezione solare", en: "Sun protection", es: "Protección solar", fr: "Protection solaire" },
      { it: "Pranzo, se non è previsto dal tour", en: "Lunch, if the tour doesn't include it", es: "Comida, si el tour no la incluye", fr: "Le déjeuner, si l'excursion ne le comprend pas" }
    ]
  },
  {
    gruppo: "Giro in elicottero",
    schede: ["helicopter-tours"],
    cose: [
      { it: "Documento d'identità valido con foto", en: "Valid photo ID", es: "Documento de identidad válido con foto", fr: "Pièce d'identité avec photo valide" },
      { it: "Abbigliamento comodo", en: "Comfortable clothes", es: "Ropa cómoda", fr: "Vêtements confortables" },
      { it: "Scarpe chiuse", en: "Closed shoes", es: "Calzado cerrado", fr: "Chaussures fermées" },
      { it: "Occhiali da sole", en: "Sunglasses", es: "Gafas de sol", fr: "Lunettes de soleil" }
    ]
  },
  {
    gruppo: "Buggy",
    schede: ["buggy-volcano-4h"],
    cose: [
      { it: "Patente di guida valida", en: "Valid driving licence", es: "Carné de conducir válido", fr: "Permis de conduire valide" },
      { it: "Abbigliamento comodo e scarpe chiuse", en: "Comfortable clothes and closed shoes", es: "Ropa cómoda y calzado cerrado", fr: "Vêtements confortables et chaussures fermées" },
      { it: "Una giacca nei mesi più freschi", en: "A jacket in the cooler months", es: "Una chaqueta en los meses más frescos", fr: "Une veste pendant les mois plus frais" },
      { it: "Crema solare, occhiali da sole e cappello per i tour di giorno", en: "Sun cream, sunglasses and a hat for daytime tours", es: "Crema solar, gafas de sol y gorra para los tours de día", fr: "Crème solaire, lunettes de soleil et chapeau pour les sorties de jour" }
    ]
  },
  {
    gruppo: "Quad",
    schede: ["quad-teide-adventure"],
    cose: [
      { it: "Patente di guida valida", en: "Valid driving licence", es: "Carné de conducir válido", fr: "Permis de conduire valide" },
      { it: "Abbigliamento comodo e scarpe chiuse (niente sandali)", en: "Comfortable clothes and closed shoes (no sandals)", es: "Ropa cómoda y calzado cerrado (nada de sandalias)", fr: "Vêtements confortables et chaussures fermées (pas de sandales)" },
      { it: "Una giacca", en: "A jacket", es: "Una chaqueta", fr: "Une veste" },
      { it: "Crema solare e occhiali da sole", en: "Sun cream and sunglasses", es: "Crema solar y gafas de sol", fr: "Crème solaire et lunettes de soleil" }
    ]
  },
  {
    gruppo: "Talaria",
    schede: ["talaria-off-road"],
    cose: [
      { it: "Documento d'identità", en: "ID", es: "Documento de identidad", fr: "Pièce d'identité" },
      { it: "Patente di guida, se ce l'hai", en: "Driving licence, if you have one", es: "Carné de conducir, si lo tienes", fr: "Permis de conduire, si vous en avez un" },
      { it: "Scarpe chiuse e pantaloni lunghi", en: "Closed shoes and long trousers", es: "Calzado cerrado y pantalón largo", fr: "Chaussures fermées et pantalon long" },
      { it: "Acqua e crema solare", en: "Water and sun cream", es: "Agua y crema solar", fr: "Eau et crème solaire" }
    ]
  },
  {
    gruppo: "Jet ski",
    schede: ["jet-ski-safari-1-2h"],
    cose: [
      { it: "Costume", en: "Swimsuit", es: "Bañador", fr: "Maillot de bain" },
      { it: "Crema solare", en: "Sun cream", es: "Crema solar", fr: "Crème solaire" },
      { it: "Asciugamano", en: "Towel", es: "Toalla", fr: "Serviette" }
    ]
  },
  {
    gruppo: "Loro Parque e Jungle Park",
    schede: ["loro-parque", "jungle-park"],
    cose: [
      { it: "Crema solare", en: "Sun cream", es: "Crema solar", fr: "Crème solaire" },
      { it: "Scarpe comode", en: "Comfortable shoes", es: "Calzado cómodo", fr: "Chaussures confortables" },
      { it: "Acqua", en: "Water", es: "Agua", fr: "Eau" }
    ]
  }
];

// Le voci da portare per una scheda, o null se la scheda non sta in nessun
// gruppo (allora il riquadro non si mostra).
function coseDaPortare(idScheda) {
  const g = COSE_DA_PORTARE.find(x => x.schede.includes(idScheda));
  return g ? g.cose : null;
}

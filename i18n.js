// Traduzioni del sito in italiano, inglese, spagnolo e francese.
//
// COME FUNZIONA
//   Ogni testo ha una "chiave" (es. "nav.bookNow") e quattro versioni: it, en, es, fr.
//   Nell'HTML si scrive data-i18n="nav.bookNow" su un elemento: al caricamento
//   il testo viene sostituito con quello della lingua scelta.
//   Nel JavaScript si usa t("nav.bookNow").
//
// COME AGGIUNGERE UN TESTO
//   1. aggiungi una riga qui sotto con le quattro lingue;
//   2. nell'HTML metti data-i18n="la.tua.chiave" sull'elemento.
//
// ATTRIBUTI DISPONIBILI NELL'HTML
//   data-i18n              → il testo dentro l'elemento
//   data-i18n-html         → come sopra, ma accetta tag (es. <strong>)
//   data-i18n-placeholder  → il placeholder di un input
//   data-i18n-aria-label   → l'etichetta per i lettori di schermo
//   data-i18n-alt          → il testo alternativo di un'immagine
//   data-i18n-content      → il content di un <meta>
//   data-i18n-doctitle     → il titolo della pagina (si mette sul <body>)
//   data-i18n-cat="id"     → il nome di una categoria del catalogo

const I18N_LANGS = ["it", "en", "es", "fr"];
const I18N_DEFAULT = "en";           // lingua usata se il browser non è it/es/fr
const I18N_STORAGE_KEY = "isla-lang";

const I18N_LANG_NAMES = {
  it: "Italiano",
  en: "English",
  es: "Español",
  fr: "Français"
};

const I18N = {
  // ── generali ────────────────────────────────────────────────────────────
  "common.skip":        { it: "Vai al contenuto", en: "Skip to content", es: "Ir al contenido", fr: "Aller au contenu" },
  "common.close":       { it: "Chiudi", en: "Close", es: "Cerrar", fr: "Fermer" },
  "common.search":      { it: "Cerca", en: "Search", es: "Buscar", fr: "Rechercher" },
  "common.homeAria":    { it: "Isla, vai alla home", en: "Isla, go to home", es: "Isla, ir al inicio", fr: "Isla, aller à l'accueil" },
  "common.logoAlt":     { it: "Logo Isla", en: "Isla logo", es: "Logo de Isla", fr: "Logo Isla" },
  "lang.label":         { it: "Lingua", en: "Language", es: "Idioma", fr: "Langue" },

  // ── barra in alto ───────────────────────────────────────────────────────
  "nav.aria":           { it: "Menu principale", en: "Main menu", es: "Menú principal", fr: "Menu principal" },
  "nav.home":           { it: "Home", en: "Home", es: "Inicio", fr: "Accueil" },
  "nav.experiences":    { it: "Esperienze", en: "Experiences", es: "Experiencias", fr: "Expériences" },
  "nav.bookNow":        { it: "Prenota ora", en: "Book now", es: "Reservar", fr: "Réserver" },
  // Il pulsante in alto a destra apre la finestra del ticket (numero + telefono):
  // si chiamava "Prenota ora", ma prenotare si fa dalle schede (proprietario,
  // 30 settembre 2026).
  "nav.myBookings":     { it: "Le mie prenotazioni", en: "My bookings", es: "Mis reservas", fr: "Mes réservations" },
  "nav.menu":           { it: "Menu", en: "Menu", es: "Menú", fr: "Menu" },

  // ── titoli delle pagine ─────────────────────────────────────────────────
  "meta.home.title":    { it: "Isla · La tua escursione a Tenerife", en: "Isla · Your excursion in Tenerife", es: "Isla · Tu excursión en Tenerife", fr: "Isla · Votre excursion à Tenerife" },
  "meta.home.desc":     { it: "Isla — trova subito orario, punto d'incontro e informazioni della tua escursione a Tenerife.", en: "Isla — find the time, meeting point and details of your excursion in Tenerife straight away.", es: "Isla — encuentra al instante el horario, el punto de encuentro y la información de tu excursión en Tenerife.", fr: "Isla — trouvez tout de suite l'horaire, le point de rendez-vous et les infos de votre excursion à Tenerife." },
  "meta.catalog.title": { it: "Tutte le escursioni · Isla", en: "All excursions · Isla", es: "Todas las excursiones · Isla", fr: "Toutes les excursions · Isla" },
  "meta.catalog.desc":  { it: "Tutte le escursioni, i tour e gli show di Isla a Tenerife: mare, Teide, parchi, avventura e molto altro.", en: "All of Isla's excursions, tours and shows in Tenerife: sea, Teide, parks, adventure and much more.", es: "Todas las excursiones, tours y espectáculos de Isla en Tenerife: mar, Teide, parques, aventura y mucho más.", fr: "Toutes les excursions, visites et spectacles d'Isla à Tenerife : mer, Teide, parcs, aventure et bien plus." },
  "meta.packs.title":   { it: "I pacchetti · Isla", en: "Packages · Isla", es: "Los paquetes · Isla", fr: "Les forfaits · Isla" },
  "meta.family.title":  { it: "In famiglia · Isla", en: "As a family · Isla", es: "En familia · Isla", fr: "En famille · Isla" },
  "meta.family.desc":   { it: "I pacchetti di Isla per chi viaggia coi bambini a Tenerife: tre escursioni insieme, col prezzo dei bambini scritto accanto a quello degli adulti.", en: "Isla's packages for families travelling with children in Tenerife: three excursions together, with the kids' price written next to the adults'.", es: "Los paquetes de Isla para quien viaja con niños en Tenerife: tres excursiones juntas, con el precio de los niños junto al de los adultos.", fr: "Les forfaits d'Isla pour les familles qui voyagent avec des enfants à Tenerife : trois excursions ensemble, avec le prix enfant écrit à côté du prix adulte." },
  "meta.two.title":     { it: "Perfetto per 2 · Isla", en: "Perfect for two · Isla", es: "Perfecto para dos · Isla", fr: "Parfait à deux · Isla" },
  "meta.two.desc":      { it: "I pacchetti di Isla per le coppie a Tenerife: tre esperienze da fare in due, con lo sconto già tolto dal prezzo.", en: "Isla's packages for couples in Tenerife: three experiences to share, with the discount already taken off.", es: "Los paquetes de Isla para parejas en Tenerife: tres experiencias para dos, con el descuento ya aplicado.", fr: "Les forfaits d'Isla pour les couples à Tenerife : trois expériences à partager, avec la remise déjà déduite." },
  "meta.days.title":    { it: "3, 5 o 7 giorni · Isla", en: "3, 5 or 7 days · Isla", es: "3, 5 o 7 días · Isla", fr: "3, 5 ou 7 jours · Isla" },
  "meta.days.desc":     { it: "Gli itinerari di Isla a Tenerife da 3, 5 o 7 giorni: una escursione al giorno, con lo sconto già tolto dal prezzo.", en: "Isla's 3, 5 and 7-day itineraries in Tenerife: one excursion a day, with the discount already taken off.", es: "Los itinerarios de Isla en Tenerife de 3, 5 o 7 días: una excursión al día, con el descuento ya aplicado.", fr: "Les itinéraires d'Isla à Tenerife sur 3, 5 ou 7 jours : une excursion par jour, avec la remise déjà déduite." },
  "meta.packs.desc":    { it: "I pacchetti di Isla a Tenerife: tre escursioni scelte insieme, con lo sconto già tolto dal prezzo.", en: "Isla's packages in Tenerife: three excursions picked to go together, with the discount already taken off.", es: "Los paquetes de Isla en Tenerife: tres excursiones elegidas para ir juntas, con el descuento ya aplicado.", fr: "Les forfaits d'Isla à Tenerife : trois excursions choisies pour aller ensemble, avec la remise déjà déduite." },
  "meta.pack.desc":     { it: "Un pacchetto di Isla a Tenerife: tre escursioni scelte insieme, con lo sconto già tolto dal prezzo.", en: "An Isla package in Tenerife: three excursions picked to go together, with the discount already taken off.", es: "Un paquete de Isla en Tenerife: tres excursiones elegidas para ir juntas, con el descuento ya aplicado.", fr: "Un forfait d'Isla à Tenerife : trois excursions choisies pour aller ensemble, avec la remise déjà déduite." },
  "meta.rent.title":    { it: "Noleggio · Isla", en: "Rentals · Isla", es: "Alquiler · Isla", fr: "Location · Isla" },
  "meta.rent.desc":     { it: "Noleggio auto, moto, scooter e bici a Tenerife con Isla: i prezzi al giorno e la richiesta su WhatsApp.", en: "Car, motorbike, scooter and bike rental in Tenerife with Isla: daily prices and your request on WhatsApp.", es: "Alquiler de coches, motos, scooters y bicis en Tenerife con Isla: los precios por día y la solicitud por WhatsApp.", fr: "Location de voitures, motos, scooters et vélos à Tenerife avec Isla : les prix à la journée et la demande sur WhatsApp." },
  "meta.booking.title": { it: "La tua prenotazione · Isla", en: "Your booking · Isla", es: "Tu reserva · Isla", fr: "Votre réservation · Isla" },

  // ── hero ────────────────────────────────────────────────────────────────
  "hero.pause":         { it: "Metti in pausa il video", en: "Pause the video", es: "Pausar el vídeo", fr: "Mettre la vidéo en pause" },
  "hero.play":          { it: "Riproduci il video", en: "Play the video", es: "Reproducir el vídeo", fr: "Lire la vidéo" },

  // ── intro e bento ───────────────────────────────────────────────────────
  "intro.eyebrow":      { it: "Tenerife", en: "Tenerife", es: "Tenerife", fr: "Tenerife" },
  "intro.title":        { it: "Inizia la tua avventura con…", en: "Start your adventure with…", es: "Empieza tu aventura con…", fr: "Commencez votre aventure avec…" },
  "bento.packages":     { it: "Pacchetti", en: "Packages", es: "Paquetes", fr: "Forfaits" },
  // Era "Con bambini" e portava all'elenco filtrato: adesso porta ai pacchetti
  // di famiglia. Il nome cambiato e' una scelta del proprietario (14 settembre
  // 2026): "In famiglia" parla a chi viaggia coi bambini, non ai bambini.
  "bento.family":       { it: "In famiglia", en: "As a family", es: "En familia", fr: "En famille" },
  // I due riquadri del 6 ottobre 2026 (proprietario). "Food Experience" porta
  // alle degustazioni una per una (escursioni.html?sel=food), "Perfetto per 2"
  // alla vetrina dei pacchetti per le coppie. "Food Experience" resta in
  // inglese nelle quattro lingue, come "3/5/7 Days Experience".
  "bento.food":         { it: "Food Experience", en: "Food Experience", es: "Food Experience", fr: "Food Experience" },
  "bento.forTwo":       { it: "Perfetto per 2", en: "Perfect for two", es: "Perfecto para dos", fr: "Parfait à deux" },
  "bento.days":         { it: "3/5/7 Days Experience", en: "3/5/7 Days Experience", es: "3/5/7 Days Experience", fr: "3/5/7 Days Experience" },
  "bento.rental":       { it: "Noleggio auto, moto e bici", en: "Car, moto & bike rental", es: "Alquiler de coche, moto y bici", fr: "Location voiture, moto et vélo" },
  "wa.rental":          { it: "Ciao Isla! Vorrei noleggiare un mezzo a Tenerife. Mi interessa: ", en: "Hi Isla! I'd like to rent a vehicle in Tenerife. I'm interested in: ", es: "¡Hola Isla! Quisiera alquilar un vehículo en Tenerife. Me interesa: ", fr: "Bonjour Isla ! Je voudrais louer un véhicule à Tenerife. Je suis intéressé(e) par : " },
  "wa.rentItem":        { it: "Ciao Isla! Vorrei noleggiare: {mezzo}. Dal … al …", en: "Hi Isla! I'd like to rent: {mezzo}. From … to …", es: "¡Hola Isla! Quisiera alquilar: {mezzo}. Del … al …", fr: "Bonjour Isla ! Je voudrais louer : {mezzo}. Du … au …" },

  // ── pagina noleggio (noleggio.html) ─────────────────────────────────────
  "meta.map.title":     { it: "Scopri Tenerife · Isla", en: "Discover Tenerife · Isla", es: "Descubre Tenerife · Isla", fr: "Découvrir Tenerife · Isla" },
  "meta.map.desc":      { it: "La mappa di Tenerife di Isla: spiagge, punti panoramici, posti segreti e cose da vedere, con la strada per arrivarci.", en: "Isla's map of Tenerife: beaches, viewpoints, secret spots and must-sees, with directions to get there.", es: "El mapa de Tenerife de Isla: playas, miradores, lugares secretos e imprescindibles, con la ruta para llegar.", fr: "La carte de Tenerife d'Isla : plages, belvédères, coins secrets et incontournables, avec l'itinéraire pour y aller." },
  "map.eyebrow":        { it: "La mappa", en: "The map", es: "El mapa", fr: "La carte" },
  "map.title":          { it: "Scopri Tenerife", en: "Discover Tenerife", es: "Descubre Tenerife", fr: "Découvrir Tenerife" },
  "map.intro":          { it: "Spiagge, panorami, posti segreti e cose da vedere. Scegli una categoria sotto la mappa e tocca un punto per leggere cos'è e farti portare lì.", en: "Beaches, viewpoints, secret spots and must-sees. Pick a category below the map and tap a spot to read about it and get directions.", es: "Playas, miradores, lugares secretos e imprescindibles. Elige una categoría debajo del mapa y toca un punto para leer qué es y cómo llegar.", fr: "Plages, belvédères, coins secrets et incontournables. Choisissez une catégorie sous la carte et touchez un lieu pour savoir ce que c'est et vous y faire guider." },
  "map.aria":           { it: "Mappa di Tenerife", en: "Map of Tenerife", es: "Mapa de Tenerife", fr: "Carte de Tenerife" },
  "map.cat.beach":      { it: "Spiagge", en: "Beaches", es: "Playas", fr: "Plages" },
  "map.cat.view":       { it: "Panorami", en: "Viewpoints", es: "Miradores", fr: "Belvédères" },
  "map.cat.secret":     { it: "Posti segreti", en: "Secret spots", es: "Lugares secretos", fr: "Coins secrets" },
  "map.cat.sight":      { it: "Da vedere", en: "Must-see", es: "Imprescindibles", fr: "À voir" },
  "map.cat.food":       { it: "Ristoranti", en: "Restaurants", es: "Restaurantes", fr: "Restaurants" },
  "map.go":             { it: "Portami qui", en: "Take me there", es: "Llévame aquí", fr: "M'y emmener" },
  "map.photoBy":        { it: "Foto:", en: "Photo:", es: "Foto:", fr: "Photo :" },
  "map.stato.chiusa":   { it: "Chiusa", en: "Closed", es: "Cerrada", fr: "Fermée" },
  "map.stato.regolamentata": { it: "Con prenotazione", en: "Booking needed", es: "Con reserva", fr: "Sur réservation" },
  "map.tipo.scenografica": { it: "Da foto", en: "Picture-perfect", es: "De postal", fr: "Carte postale" },
  "map.tipo.comoda":    { it: "Comoda", en: "Easy", es: "Cómoda", fr: "Facile d'accès" },
  "map.tipo.selvaggia": { it: "Selvaggia", en: "Wild", es: "Salvaje", fr: "Sauvage" },
  "map.sabbia.dorata":  { it: "Sabbia dorata", en: "Golden sand", es: "Arena dorada", fr: "Sable doré" },
  "map.sabbia.chiara":  { it: "Sabbia chiara", en: "Light sand", es: "Arena clara", fr: "Sable clair" },
  "map.sabbia.scura":   { it: "Sabbia scura", en: "Dark sand", es: "Arena oscura", fr: "Sable foncé" },
  "map.sabbia.nera":    { it: "Sabbia nera", en: "Black sand", es: "Arena negra", fr: "Sable noir" },
  "map.sabbia.ciottoli": { it: "Ciottoli", en: "Pebbles", es: "Callaos", fr: "Galets" },
  "map.beachNote":      { it: "Le spiagge del nord e le calette selvagge hanno onde e correnti forti. Guarda la bandiera e i cartelli sul posto: con mare mosso o divieto, niente bagno.", en: "North-coast beaches and wild coves have strong waves and currents. Check the flag and the signs on site: no swimming in rough sea or where it is banned.", es: "Las playas del norte y las calas salvajes tienen olas y corrientes fuertes. Mira la bandera y los carteles: con mar agitado o prohibición, no te bañes.", fr: "Les plages du nord et les criques sauvages ont des vagues et des courants forts. Regardez le drapeau et les panneaux sur place : mer agitée ou baignade interdite, pas de baignade." },
  "map.example":        { it: "esempio", en: "example", es: "ejemplo", fr: "exemple" },
  "rent.eyebrow":       { it: "Tenerife su ruote", en: "Tenerife on wheels", es: "Tenerife sobre ruedas", fr: "Tenerife sur roues" },
  "rent.title":         { it: "Noleggio", en: "Rentals", es: "Alquiler", fr: "Location" },
  "rent.intro":         { it: "Auto, moto, scooter e bici per girare l'isola coi tuoi tempi. Scegli il mezzo e mandaci la richiesta con le date: ti confermiamo disponibilità e ritiro entro 24 ore.", en: "Cars, motorbikes, scooters and bikes to explore the island at your own pace. Pick a vehicle and send us your request with the dates: we confirm availability and collection within 24 hours.", es: "Coches, motos, scooters y bicis para recorrer la isla a tu ritmo. Elige el vehículo y envíanos la solicitud con las fechas: te confirmamos disponibilidad y recogida en 24 horas.", fr: "Voitures, motos, scooters et vélos pour parcourir l'île à votre rythme. Choisissez le véhicule et envoyez-nous la demande avec les dates : nous vous confirmons la disponibilité et le retrait sous 24 heures." },
  "rent.navAria":       { it: "Tipo di mezzo", en: "Vehicle type", es: "Tipo de vehículo", fr: "Type de véhicule" },
  "rent.cars":          { it: "Auto", en: "Cars", es: "Coches", fr: "Voitures" },
  "rent.motos":         { it: "Moto e scooter", en: "Motorbikes & scooters", es: "Motos y scooters", fr: "Motos et scooters" },
  "rent.carsNote":      { it: "A luglio, agosto, dicembre e gennaio i prezzi salgono di €5 al giorno.", en: "In July, August, December and January prices go up by €5 a day.", es: "En julio, agosto, diciembre y enero los precios suben 5 € al día.", fr: "En juillet, août, décembre et janvier, les prix augmentent de €5 par jour." },
  "rent.motosNote":     { it: "Sempre compresi: assicurazione, casco, lucchetto e chilometri illimitati.", en: "Always included: insurance, helmet, lock and unlimited mileage.", es: "Siempre incluidos: seguro, casco, candado y kilómetros ilimitados.", fr: "Toujours compris : assurance, casque, antivol et kilométrage illimité." },
  "rent.d12":           { it: "1-2 giorni", en: "1-2 days", es: "1-2 días", fr: "1-2 jours" },
  "rent.d36":           { it: "3-6 giorni", en: "3-6 days", es: "3-6 días", fr: "3-6 jours" },
  "rent.d7":            { it: "7 giorni o più", en: "7 days or more", es: "7 días o más", fr: "7 jours ou plus" },
  "rent.day1":          { it: "1 giorno", en: "1 day", es: "1 día", fr: "1 jour" },
  "rent.dayN":          { it: "{n} giorni", en: "{n} days", es: "{n} días", fr: "{n} jours" },
  "rent.dayExtra":      { it: "dall'{n}° giorno, ogni giorno", en: "from day {n}, each day", es: "desde el día {n}, cada día", fr: "à partir du {n}e jour, chaque jour" },
  "rent.perDayShort":   { it: "al giorno", en: "per day", es: "al día", fr: "par jour" },
  "rent.unitDay":       { it: "prezzo al giorno", en: "price per day", es: "precio por día", fr: "prix par jour" },
  "rent.unitTotal":     { it: "prezzo per tutto il periodo", en: "price for the whole period", es: "precio por todo el periodo", fr: "prix pour toute la période" },
  "rent.seats":         { it: "{n} posti", en: "{n} seats", es: "{n} plazas", fr: "{n} places" },
  "rent.request":       { it: "Richiedi su WhatsApp", en: "Request on WhatsApp", es: "Solicitar por WhatsApp", fr: "Demander sur WhatsApp" },
  "rent.otherText":     { it: "Cerchi un altro mezzo? Scrivici e lo cerchiamo noi.", en: "Looking for another vehicle? Write to us and we'll find it.", es: "¿Buscas otro vehículo? Escríbenos y lo buscamos nosotros.", fr: "Vous cherchez un autre véhicule ? Écrivez-nous et nous le trouvons." },
  "rent.otherBtn":      { it: "Scrivici su WhatsApp", en: "Write to us on WhatsApp", es: "Escríbenos por WhatsApp", fr: "Écrivez-nous sur WhatsApp" },
  "rent.kind.auto":     { it: "cambio automatico", en: "automatic", es: "cambio automático", fr: "boîte automatique" },
  "rent.kind.van":      { it: "furgone", en: "van", es: "furgoneta", fr: "fourgon" },
  "rent.kind.scooter125": { it: "Scooter 50/125 cc", en: "Scooter 50/125 cc", es: "Scooter 50/125 cc", fr: "Scooter 50/125 cc" },
  "rent.kind.scooter300": { it: "Maxi scooter 300 cc", en: "Maxi scooter 300 cc", es: "Maxi scooter 300 cc", fr: "Maxi-scooter 300 cc" },
  "rent.kind.scooter400": { it: "Maxi scooter 400 cc", en: "Maxi scooter 400 cc", es: "Maxi scooter 400 cc", fr: "Maxi-scooter 400 cc" },
  "rent.kind.gear125":  { it: "Moto 125 cc con le marce", en: "125 cc geared motorbike", es: "Moto 125 cc con marchas", fr: "Moto 125 cc à vitesses" },
  "rent.kind.moto500":  { it: "Moto 500 cc", en: "500 cc motorbike", es: "Moto 500 cc", fr: "Moto 500 cc" },
  "rent.kind.moto750":  { it: "Moto 750 cc", en: "750 cc motorbike", es: "Moto 750 cc", fr: "Moto 750 cc" },
  "rent.kind.moto800":  { it: "Moto 800 cc", en: "800 cc motorbike", es: "Moto 800 cc", fr: "Moto 800 cc" },
  "rent.lic.B3":        { it: "Patente B da almeno 3 anni", en: "Car licence held for at least 3 years", es: "Carnet B con al menos 3 años de antigüedad", fr: "Permis B depuis au moins 3 ans" },
  "rent.lic.A2":        { it: "Patente A2 o A", en: "A2 or A licence", es: "Carnet A2 o A", fr: "Permis A2 ou A" },
  "rent.lic.A":         { it: "Patente A", en: "A licence", es: "Carnet A", fr: "Permis A" },
  "rent.bikes":         { it: "Bici", en: "Bikes", es: "Bicis", fr: "Vélos" },
  "rent.bikesNote":     { it: "La bici te la portiamo all'alloggio, nel sud dell'isola, e la veniamo a riprendere; lucchetto e assistenza sono compresi. Nel messaggio scrivi altezza ed età di chi pedala.", en: "We bring the bike to where you're staying in the south of the island and pick it up again; lock and assistance are included. In your message, tell us the rider's height and age.", es: "Te llevamos la bici a tu alojamiento en el sur de la isla y pasamos a recogerla; candado y asistencia incluidos. En el mensaje indica la altura y la edad de quien va a pedalear.", fr: "Nous vous apportons le vélo à votre logement, dans le sud de l'île, et venons le reprendre ; antivol et assistance sont compris. Dans votre message, indiquez la taille et l'âge du cycliste." },
  "rent.bike.city":     { it: "Bici da città", en: "City bike", es: "Bici urbana", fr: "Vélo de ville" },
  "rent.bike.mtb":      { it: "Mountain bike", en: "Mountain bike", es: "Bicicleta de montaña", fr: "VTT" },
  "rent.bike.ecity":    { it: "Bici elettrica da città", en: "Electric city bike", es: "Bici eléctrica urbana", fr: "Vélo de ville électrique" },
  "rent.bike.emtb":     { it: "Mountain bike elettrica", en: "Electric mountain bike", es: "Bicicleta de montaña eléctrica", fr: "VTT électrique" },
  "rent.kind.basket":   { it: "con cestino", en: "with basket", es: "con cesta", fr: "avec panier" },
  "rent.kind.trek":     { it: "Trek Marlin", en: "Trek Marlin", es: "Trek Marlin", fr: "Trek Marlin" },
  "rent.kind.bosch500": { it: "motore Bosch, batteria 500 Wh", en: "Bosch motor, 500 Wh battery", es: "motor Bosch, batería de 500 Wh", fr: "moteur Bosch, batterie 500 Wh" },
  "rent.kind.bosch":    { it: "motore Bosch", en: "Bosch motor", es: "motor Bosch", fr: "moteur Bosch" },
  "rent.bike.charger":  { it: "Da 2 giorni in su c'è anche il caricabatterie, per ricaricarla la notte.", en: "From 2 days up the charger comes too, so you can recharge it overnight.", es: "A partir de 2 días también va el cargador, para recargarla por la noche.", fr: "À partir de 2 jours, le chargeur est fourni aussi, pour le recharger la nuit." },
  "rent.deposit":       { it: "Cauzione: €{n}, si paga alla consegna della bici", en: "Deposit: €{n}, paid when the bike is delivered", es: "Fianza: {n} €, se paga al entregar la bici", fr: "Caution : €{n}, à payer à la livraison du vélo" },

  // ── categorie ───────────────────────────────────────────────────────────
  "categories.eyebrow": { it: "Esplora", en: "Explore", es: "Explora", fr: "Explorer" },
  "categories.title":   { it: "Categorie", en: "Categories", es: "Categorías", fr: "Catégories" },
  "categories.altSuffix": { it: "a Tenerife", en: "in Tenerife", es: "en Tenerife", fr: "à Tenerife" },

  // ── posti segreti ───────────────────────────────────────────────────────

  // ── chi siamo ───────────────────────────────────────────────────────────
  "about.eyebrow":      { it: "Chi siamo", en: "About us", es: "Quiénes somos", fr: "Qui sommes-nous" },
  "about.title":        { it: "Siamo Jack e Francesca", en: "We are Jack and Francesca", es: "Somos Jack y Francesca", fr: "Nous sommes Jack et Francesca" },
  "about.p1":           { it: "Una coppia, due genitori, una famiglia. Da poco la nostra vita si è arricchita con l'arrivo della nostra bambina, il nostro piccolo grande motivo per guardare avanti e costruire qualcosa di nostro.", en: "A couple, two parents, a family. Our life has recently grown richer with the arrival of our baby girl, our little big reason to look ahead and build something of our own.", es: "Una pareja, dos padres, una familia. Hace poco nuestra vida se ha llenado con la llegada de nuestra niña, nuestro pequeño gran motivo para mirar hacia delante y construir algo nuestro.", fr: "Un couple, deux parents, une famille. Notre vie s'est enrichie depuis peu avec l'arrivée de notre petite fille, notre petite grande raison de regarder devant nous et de construire quelque chose à nous." },
  "about.p2":           { it: "Dal 2018 lavoriamo nel mondo delle escursioni a Tenerife. In questi anni abbiamo imparato che le vacanze più belle nascono dai consigli giusti, dati da persone di cui ti fidi. Da qui nasce Isla.", en: "Since 2018 we have worked in the world of excursions in Tenerife. Over these years we have learned that the best holidays come from the right advice, given by people you trust. That is how Isla was born.", es: "Desde 2018 trabajamos en el mundo de las excursiones en Tenerife. En estos años hemos aprendido que las mejores vacaciones nacen de los consejos adecuados, dados por personas en las que confías. Así nace Isla.", fr: "Depuis 2018, nous travaillons dans le monde des excursions à Tenerife. Au fil des années, nous avons appris que les plus belles vacances naissent des bons conseils, donnés par des personnes de confiance. C'est ainsi qu'est née Isla." },
  "about.p3":           { it: "Isla è la vostra guida per vivere Tenerife davvero: escursioni, attività e spettacoli serali in un'unica app, sempre a portata di mano. Niente ricerche infinite: scegliete, chiedeteci e pensate solo a godervi la vacanza.", en: "Isla is your guide to truly living Tenerife: excursions, activities and evening shows in one app, always at hand. No endless searching: choose, ask us and just think about enjoying your holiday.", es: "Isla es vuestra guía para vivir Tenerife de verdad: excursiones, actividades y espectáculos nocturnos en una sola app, siempre a mano. Nada de búsquedas interminables: elegid, preguntadnos y pensad solo en disfrutar de las vacaciones.", fr: "Isla est votre guide pour vivre vraiment Tenerife : excursions, activités et spectacles du soir dans une seule app, toujours à portée de main. Pas de recherches sans fin : choisissez, demandez-nous et pensez seulement à profiter de vos vacances." },
  "about.alt":          { it: "Il team di Isla a Tenerife", en: "The Isla team in Tenerife", es: "El equipo de Isla en Tenerife", fr: "L'équipe d'Isla à Tenerife" },

  // ── FAQ ─────────────────────────────────────────────────────────────────
  "faq.eyebrow":        { it: "FAQ", en: "FAQ", es: "FAQ", fr: "FAQ" },
  "faq.title":          { it: "Domande frequenti", en: "Frequently asked questions", es: "Preguntas frecuentes", fr: "Questions fréquentes" },
  "faq.q1":             { it: "Come prenoto un'escursione?", en: "How do I book an excursion?", es: "¿Cómo reservo una excursión?", fr: "Comment réserver une excursion ?" },
  "faq.a1":             { it: "Scegli l'esperienza dal catalogo e premi \"Richiedi disponibilità\": indichi data e numero di persone, e la richiesta ci arriva su WhatsApp. Verifichiamo i posti e ti confermiamo.", en: "Pick the experience from the catalogue and tap \"Check availability\": you enter the date and number of people, and the request reaches us on WhatsApp. We check the places and confirm.", es: "Elige la experiencia del catálogo y pulsa \"Consultar disponibilidad\": indicas la fecha y el número de personas, y la solicitud nos llega por WhatsApp. Comprobamos las plazas y te confirmamos.", fr: "Choisissez l'expérience dans le catalogue et touchez « Vérifier la disponibilité » : vous indiquez la date et le nombre de personnes, et la demande nous arrive sur WhatsApp. Nous vérifions les places et vous confirmons." },
  "faq.q2":             { it: "Quanto tempo prima devo richiedere?", en: "How far in advance should I ask?", es: "¿Con cuánta antelación debo solicitarla?", fr: "Combien de temps à l'avance dois-je demander ?" },
  "faq.a2":             { it: "Almeno 24 ore prima della data dell'escursione. Ti rispondiamo entro 24 ore con la conferma e i dettagli.", en: "At least 24 hours before the date of the excursion. We reply within 24 hours with the confirmation and the details.", es: "Al menos 24 horas antes de la fecha de la excursión. Te respondemos en 24 horas con la confirmación y los detalles.", fr: "Au moins 24 heures avant la date de l'excursion. Nous vous répondons sous 24 heures avec la confirmation et les détails." },
  "faq.q3":             { it: "La richiesta è già una prenotazione?", en: "Is the request already a booking?", es: "¿La solicitud ya es una reserva?", fr: "La demande est-elle déjà une réservation ?" },
  "faq.a3":             { it: "No. La richiesta serve a verificare che ci sia posto: la prenotazione è confermata solo quando ricevi la nostra conferma.", en: "No. The request is there to check availability: the booking is confirmed only when you receive our confirmation.", es: "No. La solicitud sirve para comprobar que hay plazas: la reserva se confirma solo cuando recibes nuestra confirmación.", fr: "Non. La demande sert à vérifier qu'il reste de la place : la réservation n'est confirmée que lorsque vous recevez notre confirmation." },
  "faq.q4":             { it: "Come si paga?", en: "How do I pay?", es: "¿Cómo se paga?", fr: "Comment payer ?" },
  "faq.a4":             { it: "Al momento della conferma ti indichiamo come saldare. Non ti viene chiesto nulla al momento della richiesta.", en: "When we confirm, we tell you how to pay. Nothing is asked of you when you send the request.", es: "En el momento de la confirmación te indicamos cómo pagar. No se te pide nada al enviar la solicitud.", fr: "Au moment de la confirmation, nous vous indiquons comment régler. Rien ne vous est demandé au moment de la demande." },
  "faq.q5":             { it: "Posso annullare?", en: "Can I cancel?", es: "¿Puedo cancelar?", fr: "Puis-je annuler ?" },
  // Politica di cancellazione decisa dal proprietario il 6 ottobre 2026 e
  // corretta lo stesso giorno: fino a 24 ore prima si annulla gratis oppure si
  // sposta la data (una volta sola, se c'e' posto); meno di 24 ore prima non si
  // annulla e non si sposta piu'. Vale anche per charter e noleggi.
  // Come le 24 ore di req.hint, e' la regola di Isla: non si cambia dopo aver
  // letto quella di un fornitore. I giorni entro cui si rimborsa non sono
  // ancora decisi, per questo il testo non li dice.
  "faq.a5":             { it: "Sì: fino a 24 ore prima dell'escursione puoi annullare gratis oppure spostarla a un'altra data, una volta sola e se c'è posto. Basta un messaggio su WhatsApp, e conta l'ora del messaggio. Meno di 24 ore prima, o se non ti presenti, non si può più annullare né spostare, e il prezzo non si rimborsa. Vale anche per i charter privati e i noleggi. Se invece ad annullare è l'operatore, per il maltempo, il mare mosso o troppo pochi partecipanti, scegli tu: un'altra data o il rimborso completo. Il rimborso arriva con lo stesso mezzo con cui hai pagato.", en: "Yes: up to 24 hours before the excursion you can cancel free of charge or move it to another date, once only and if there is space. Just send us a WhatsApp message, and the time of the message is what counts. Less than 24 hours before, or if you don't show up, it can no longer be cancelled or moved, and the price is not refunded. This also applies to private charters and rentals. If it's the operator who cancels, because of bad weather, rough sea or too few participants, you choose: another date or a full refund. Refunds are made the same way you paid.", es: "Sí: hasta 24 horas antes de la excursión puedes cancelar gratis o cambiarla a otra fecha, una sola vez y si hay plazas. Basta un mensaje por WhatsApp, y cuenta la hora del mensaje. Con menos de 24 horas, o si no te presentas, ya no se puede cancelar ni cambiar, y el precio no se reembolsa. Vale también para los chárter privados y los alquileres. Si quien cancela es el operador, por mal tiempo, mar agitado o pocos participantes, eliges tú: otra fecha o el reembolso completo. El reembolso se hace con el mismo medio con el que pagaste.", fr: "Oui : jusqu'à 24 heures avant l'excursion, vous pouvez annuler gratuitement ou la déplacer à une autre date, une seule fois et s'il y a de la place. Il suffit d'un message WhatsApp, et c'est l'heure du message qui compte. Moins de 24 heures avant, ou si vous ne vous présentez pas, on ne peut plus annuler ni déplacer, et le prix n'est pas remboursé. Cela vaut aussi pour les charters privés et les locations. Si c'est l'opérateur qui annule, à cause du mauvais temps, de la mer agitée ou d'un nombre insuffisant de participants, c'est vous qui choisissez : une autre date ou le remboursement intégral. Le remboursement se fait par le même moyen que le paiement." },
  "faq.q6":             { it: "Funziona anche senza connessione?", en: "Does it work without a connection?", es: "¿Funciona sin conexión?", fr: "Ça marche aussi sans connexion ?" },
  "faq.a6":             { it: "Sì. Isla è un'app installabile: una volta aperta la prima volta, le informazioni restano disponibili anche offline, utile quando sei in giro per l'isola.", en: "Yes. Isla is an installable app: once you've opened it the first time, the information stays available offline — handy while you're out around the island.", es: "Sí. Isla es una app instalable: una vez abierta la primera vez, la información sigue disponible sin conexión, útil cuando estás recorriendo la isla.", fr: "Oui. Isla est une app installable : une fois ouverte la première fois, les informations restent disponibles hors ligne, pratique quand vous êtes en balade sur l'île." },

  // ── menu laterale ───────────────────────────────────────────────────────
  "menu.aria":          { it: "Menu", en: "Menu", es: "Menú", fr: "Menu" },
  "menu.sections":      { it: "Sezioni", en: "Sections", es: "Secciones", fr: "Rubriques" },
  "menu.close":         { it: "Chiudi menu", en: "Close menu", es: "Cerrar menú", fr: "Fermer le menu" },
  "menu.install":       { it: "Installa l'app", en: "Install the app", es: "Instalar la app", fr: "Installer l'app" },
  "menu.excursions":    { it: "Escursioni", en: "Excursions", es: "Excursiones", fr: "Excursions" },
  "menu.packages":      { it: "Pacchetti", en: "Packages", es: "Paquetes", fr: "Forfaits" },
  "menu.map":           { it: "Scopri Tenerife", en: "Discover Tenerife", es: "Descubre Tenerife", fr: "Découvrir Tenerife" },
  "menu.secret":        { it: "Posti segreti", en: "Secret spots", es: "Lugares secretos", fr: "Coins secrets" },
  "menu.about":         { it: "Chi siamo", en: "About us", es: "Quiénes somos", fr: "Qui sommes-nous" },
  "menu.cta":           { it: "Prenota ora", en: "Book now", es: "Reservar", fr: "Réserver" },

  // ── finestra del ticket (numero + telefono del ticket di carta) ──────────
  "ticket.title":       { it: "Il tuo ticket", en: "Your ticket", es: "Tu ticket", fr: "Votre ticket" },
  "ticket.codeLabel":   { it: "Numero del ticket", en: "Ticket number", es: "Número del ticket", fr: "Numéro du ticket" },
  "ticket.placeholder": { it: "Es. 2213", en: "E.g. 2213", es: "Ej. 2213", fr: "Ex. 2213" },
  "ticket.phoneLabel":  { it: "Telefono scritto sul ticket", en: "Phone number on the ticket", es: "Teléfono escrito en el ticket", fr: "Téléphone écrit sur le ticket" },
  "ticket.prefix":      { it: "Prefisso", en: "Country code", es: "Prefijo", fr: "Indicatif" },
  "ticket.otherPrefix": { it: "Altro: +…", en: "Other: +…", es: "Otro: +…", fr: "Autre : +…" },
  "ticket.phoneInvalid":{ it: "Il telefono non sembra giusto: controlla il prefisso e le cifre.", en: "That phone number doesn't look right: check the country code and the digits.", es: "El teléfono no parece correcto: revisa el prefijo y las cifras.", fr: "Le téléphone ne semble pas correct : vérifiez l'indicatif et les chiffres." },
  "ticket.hint":        { it: "Il numero è stampato in rosso sul ticket che ti abbiamo dato.", en: "The number is printed in red on the ticket we gave you.", es: "El número está impreso en rojo en el ticket que te dimos.", fr: "Le numéro est imprimé en rouge sur le ticket que nous vous avons remis." },

  // ── piè di pagina ───────────────────────────────────────────────────────
  "footer.findCode":    { it: "Cerca il tuo codice", en: "Find your code", es: "Busca tu código", fr: "Chercher votre code" },
  "footer.operator":    { it: "Isla è un servizio di <strong>Admiral Travel Agencia de Viajes SL</strong>", en: "Isla is a service of <strong>Admiral Travel Agencia de Viajes SL</strong>", es: "Isla es un servicio de <strong>Admiral Travel Agencia de Viajes SL</strong>", fr: "Isla est un service de <strong>Admiral Travel Agencia de Viajes SL</strong>" },
  "footer.privacy":     { it: "Privacy", en: "Privacy", es: "Privacidad", fr: "Confidentialité" },
  "footer.terms":       { it: "Termini di vendita", en: "Terms of sale", es: "Condiciones de venta", fr: "Conditions de vente" },
  "terms.title":        { it: "Termini di vendita · Isla", en: "Terms of sale · Isla", es: "Condiciones de venta · Isla", fr: "Conditions de vente · Isla" },
  "terms.desc":         { it: "Come si richiede, si paga, si annulla e si sposta un'escursione con Isla.", en: "How to request, pay for, cancel and change an excursion with Isla.", es: "Cómo se solicita, se paga, se cancela y se cambia una excursión con Isla.", fr: "Comment demander, payer, annuler et déplacer une excursion avec Isla." },
  "privacy.title":      { it: "Privacy · Isla", en: "Privacy · Isla", es: "Privacidad · Isla", fr: "Confidentialité · Isla" },
  "privacy.desc":       { it: "Come Isla e Admiral Travel trattano i tuoi dati.", en: "How Isla and Admiral Travel handle your data.", es: "Cómo tratan tus datos Isla y Admiral Travel.", fr: "Comment Isla et Admiral Travel traitent vos données." },
  "footer.copy":        { it: "© Isla · Escursioni a Tenerife", en: "© Isla · Tenerife excursions", es: "© Isla · Excursiones en Tenerife", fr: "© Isla · Excursions à Tenerife" },

  // ── pagina catalogo ─────────────────────────────────────────────────────
  "catalog.eyebrow":    { it: "Esplora", en: "Explore", es: "Explora", fr: "Explorer" },
  "catalog.title":      { it: "Tutte le escursioni", en: "All excursions", es: "Todas las excursiones", fr: "Toutes les excursions" },
  "catalog.searchLabel":       { it: "Cerca un'escursione", en: "Search for an excursion", es: "Busca una excursión", fr: "Rechercher une excursion" },
  "catalog.searchPlaceholder": { it: "Cerca: barca, Teide, quad…", en: "Search: boat, Teide, quad…", es: "Busca: barco, Teide, quad…", fr: "Rechercher : bateau, Teide, quad…" },
  "catalog.filterAria": { it: "Filtra per categoria", en: "Filter by category", es: "Filtrar por categoría", fr: "Filtrer par catégorie" },
  "catalog.recommended":      { it: "Raccomandate", en: "Recommended", es: "Recomendadas", fr: "Recommandées" },
  "catalog.foodTitle":  { it: "Food Experience", en: "Food Experience", es: "Food Experience", fr: "Food Experience" },
  "catalog.recommendedTitle": { it: "Le nostre raccomandate", en: "Our recommendations", es: "Nuestras recomendadas", fr: "Nos recommandations" },
  "catalog.all":        { it: "Tutte le escursioni", en: "All excursions", es: "Todas las excursiones", fr: "Toutes les excursions" },
  "catalog.countAll":   { it: "{n} attività disponibili", en: "{n} activities available", es: "{n} actividades disponibles", fr: "{n} activités disponibles" },
  "catalog.countSome":  { it: "{n} di {total} attività", en: "{n} of {total} activities", es: "{n} de {total} actividades", fr: "{n} sur {total} activités" },
  "catalog.emptyTitle": { it: "Nessun risultato", en: "No results", es: "Sin resultados", fr: "Aucun résultat" },
  "catalog.emptyText":  { it: "Prova a cambiare categoria o a cercare un'altra parola.", en: "Try another category, or search for a different word.", es: "Prueba con otra categoría o busca otra palabra.", fr: "Essayez une autre catégorie, ou cherchez un autre mot." },
  "catalog.filters":    { it: "Filtri", en: "Filters", es: "Filtros", fr: "Filtres" },
  "catalog.filterZone": { it: "Zona", en: "Area", es: "Zona", fr: "Zone" },
  "catalog.filterDuration": { it: "Durata", en: "Duration", es: "Duración", fr: "Durée" },
  "catalog.filterReset": { it: "Togli i filtri", en: "Clear filters", es: "Quitar filtros", fr: "Retirer les filtres" },
  "catalog.emptyFilters": { it: "Nessuna attività con questi filtri. Prova a toglierne uno.", en: "No activities match these filters. Try removing one.", es: "Ninguna actividad con estos filtros. Prueba a quitar uno.", fr: "Aucune activité avec ces filtres. Essayez d'en retirer un." },
  "catalog.prepTitle":  { it: "Catalogo in preparazione", en: "Catalogue coming soon", es: "Catálogo en preparación", fr: "Catalogue en préparation" },
  "catalog.prepText":   { it: "Nessuna attività è ancora pubblicata.", en: "No activity has been published yet.", es: "Todavía no hay ninguna actividad publicada.", fr: "Aucune activité n'est encore publiée." },

  // ── schede attività ─────────────────────────────────────────────────────
  "tour.onRequest":     { it: "Su richiesta", en: "On request", es: "Bajo petición", fr: "Sur demande" },
  "tour.from":          { it: "da €{p}", en: "from €{p}", es: "desde €{p}", fr: "dès €{p}" },
  "tour.offer":         { it: "Offerta", en: "Offer", es: "Oferta", fr: "Offre" },
  "tour.family":        { it: "Adatta ai bambini", en: "Kid-friendly", es: "Apta para niños", fr: "Adaptée aux enfants" },
  "tour.transfer":      { it: "Transfer disponibile", en: "Transfer available", es: "Traslado disponible", fr: "Transfert disponible" },
  "tour.ask":           { it: "Richiedi disponibilità", en: "Check availability", es: "Consultar disponibilidad", fr: "Vérifier la disponibilité" },
  "tour.details":       { it: "Scopri di più", en: "See details", es: "Ver detalles", fr: "En savoir plus" },
  "tour.photoSoon":     { it: "Foto in arrivo", en: "Photo coming soon", es: "Foto próximamente", fr: "Photo à venir" },

  // ── pagina di dettaglio di una singola escursione ───────────────────────
  "detail.back":        { it: "Tutte le escursioni", en: "All excursions", es: "Todas las excursiones", fr: "Toutes les excursions" },
  "detail.zoom":        { it: "Ingrandisci la foto", en: "Enlarge the photo", es: "Ampliar la foto", fr: "Agrandir la photo" },
  "detail.photo":       { it: "Foto {n}", en: "Photo {n}", es: "Foto {n}", fr: "Photo {n}" },
  "detail.summary":     { it: "In breve", en: "At a glance", es: "En resumen", fr: "En bref" },
  "detail.departure":   { it: "Punto di partenza", en: "Departure point", es: "Punto de salida", fr: "Point de départ" },
  "detail.duration":    { it: "Durata", en: "Duration", es: "Duración", fr: "Durée" },
  // Ripiego per la riga di `activityDuration` quando la scheda non scrive il
  // suo `activityLabel`. Generica apposta: la parola giusta ("Tempo di
  // cammino", "Tempo in acqua") la sa solo la scheda.
  "detail.chosen":      { it: "Scelto: {v}", en: "Selected: {v}", es: "Elegido: {v}", fr: "Choisi : {v}" },
  "detail.activity":    { it: "Durata dell'attività", en: "Activity time", es: "Duración de la actividad", fr: "Durée de l'activité" },
  "detail.price":       { it: "Prezzo", en: "Price", es: "Precio", fr: "Prix" },
  "detail.offer":       { it: "Offerta", en: "Offer", es: "Oferta", fr: "Offre" },
  "detail.offerUntil":  { it: "Valida fino al {d}", en: "Valid until {d}", es: "Válida hasta el {d}", fr: "Valable jusqu'au {d}" },
  "detail.suitable":    { it: "Adatta a", en: "Suitable for", es: "Apta para", fr: "Adaptée à" },
  "detail.season":      { it: "Periodo", en: "Season", es: "Temporada", fr: "Période" },
  "detail.infants":     { it: "Neonati", en: "Infants", es: "Bebés", fr: "Bébés" },
  "detail.included":    { it: "Cosa è incluso", en: "What's included", es: "Qué incluye", fr: "Ce qui est compris" },
  "detail.itinerary":   { it: "Come si svolge", en: "How the day goes", es: "Cómo se desarrolla", fr: "Déroulement" },
  "detail.notes":       { it: "Consigli", en: "Tips", es: "Consejos", fr: "Conseils" },

  // ── cosa e' incluso: le parole chiave del campo `included` ──────────────
  "inc.snorkel":        { it: "Attrezzatura da snorkeling", en: "Snorkelling gear", es: "Equipo de snorkel", fr: "Matériel de snorkeling" },
  "inc.wetsuit":        { it: "Muta", en: "Wetsuit", es: "Neopreno", fr: "Combinaison" },
  "inc.board":          { it: "Tavola", en: "Board", es: "Tabla", fr: "Planche" },
  "inc.equipment":      { it: "Attrezzatura", en: "Equipment", es: "Equipo", fr: "Équipement" },
  "inc.drinks":         { it: "Bevande incluse", en: "Drinks included", es: "Bebidas incluidas", fr: "Boissons comprises" },
  "inc.snack":          { it: "Snack", en: "Snacks", es: "Snacks", fr: "En-cas" },
  "inc.fingerfood":     { it: "Finger food", en: "Finger food", es: "Finger food", fr: "Bouchées" },
  "inc.swimstop":       { it: "Bagno e snorkeling", en: "Swim & snorkel", es: "Baño y snorkel", fr: "Baignade et snorkeling" },
  // Generico apposta: la stessa icona sta su sei gite in barca (dove il pasto
  // e' davvero un pranzo) e su tre cene-spettacolo, dove "Pranzo" era proprio
  // sbagliato. Stesso motivo per cui "Bevande a bordo" e' diventato "Bevande
  // incluse" quando l'icona e' finita su un parco.
  "inc.lunch":          { it: "Pasto incluso", en: "Meal included", es: "Comida incluida", fr: "Repas compris" },
  "inc.tasting":        { it: "Degustazione", en: "Tasting", es: "Degustación", fr: "Dégustation" },
  "inc.guide":          { it: "Guida", en: "Guide", es: "Guía", fr: "Guide" },
  "inc.transfer":       { it: "Transfer", en: "Transfer", es: "Traslado", fr: "Transfert" },
  "inc.ferry":          { it: "Traghetto", en: "Ferry", es: "Barco", fr: "Ferry" },
  "inc.ticket":         { it: "Ingressi", en: "Entrance tickets", es: "Entradas", fr: "Entrées" },
  "inc.photos":         { it: "Foto", en: "Photos", es: "Fotos", fr: "Photos" },
  "inc.lifejacket":     { it: "Giubbotti di salvataggio", en: "Life jackets", es: "Chalecos salvavidas", fr: "Gilets de sauvetage" },
  "inc.speaker":        { it: "Cassa Bluetooth", en: "Bluetooth speaker", es: "Altavoz Bluetooth", fr: "Enceinte Bluetooth" },
  "inc.towels":         { it: "Asciugamani", en: "Towels", es: "Toallas", fr: "Serviettes" },
  "inc.cooler":         { it: "Borsa frigo", en: "Cooler box", es: "Nevera portátil", fr: "Glacière" },
  "inc.fuel":           { it: "Carburante", en: "Fuel", es: "Combustible", fr: "Carburant" },
  "inc.insurance":      { it: "Assicurazione", en: "Insurance", es: "Seguro", fr: "Assurance" },
  // ── la lista delle richieste ────────────────────────────────────────────
  "lista.title":        { it: "La tua lista", en: "Your list", es: "Tu lista", fr: "Votre liste" },
  "lista.added":        { it: "Aggiunta alla tua lista", en: "Added to your list", es: "Añadida a tu lista", fr: "Ajoutée à votre liste" },
  "lista.none":         { it: "La tua lista è vuota. Apri un'escursione e tocca «Aggiungi alla lista»: qui le ritrovi tutte, e le chiedi con un solo messaggio.", en: "Your list is empty. Open an excursion and tap “Add to list”: you'll find them all here, and ask for them in a single message.", es: "Tu lista está vacía. Abre una excursión y toca «Añadir a la lista»: aquí las encuentras todas, y las pides con un solo mensaje.", fr: "Votre liste est vide. Ouvrez une excursion et touchez « Ajouter à la liste » : vous les retrouvez toutes ici, et vous les demandez en un seul message." },
  "lista.empty":        { it: "Non c'è più niente nella lista.", en: "There is nothing left in the list.", es: "Ya no queda nada en la lista.", fr: "Il n'y a plus rien dans la liste." },
  "lista.remove":       { it: "Togli dalla lista", en: "Remove from the list", es: "Quitar de la lista", fr: "Retirer de la liste" },
  "lista.clear":        { it: "Svuota la lista", en: "Empty the list", es: "Vaciar la lista", fr: "Vider la liste" },
  "lista.full":         { it: "Nella lista ci stanno al massimo {n} escursioni. Mandaci questa richiesta e poi ne inizi un'altra.", en: "The list holds at most {n} excursions. Send this request and then start another one.", es: "En la lista caben como máximo {n} excursiones. Envíanos esta solicitud y luego empiezas otra.", fr: "La liste contient au maximum {n} excursions. Envoyez-nous cette demande, puis commencez-en une autre." },
  "lista.avvisi":       { it: "Avvisami sul telefono", en: "Notify me on my phone", es: "Avísame en el móvil", fr: "M'avertir sur mon téléphone" },
  "lista.avvisiNota":   { it: "Quando l'ufficio conferma o annulla, e prima dell'escursione.", en: "When the office confirms or cancels, and before the excursion.", es: "Cuando la oficina confirme o cancele, y antes de la excursión.", fr: "Quand le bureau confirme ou annule, et avant l'excursion." },
  "lista.avvisiIos":    { it: "Sull'iPhone gli avvisi arrivano solo con l'app installata: Condividi → «Aggiungi alla schermata Home».", en: "On iPhone, notifications only arrive with the app installed: Share → “Add to Home Screen”.", es: "En el iPhone, los avisos solo llegan con la app instalada: Compartir → «Añadir a pantalla de inicio».", fr: "Sur iPhone, les notifications n'arrivent qu'avec l'app installée : Partager → « Sur l'écran d'accueil »." },
  "lista.hint":         { it: "Parte un solo messaggio con tutte le escursioni della lista.", en: "One single message goes out with every excursion in the list.", es: "Se envía un solo mensaje con todas las excursiones de la lista.", fr: "Un seul message part avec toutes les excursions de la liste." },

  // ── i pacchetti ─────────────────────────────────────────────────────────
  "packs.eyebrow":      { it: "Scelti per te", en: "Picked for you", es: "Elegidos para ti", fr: "Choisis pour vous" },
  "packs.title":        { it: "I pacchetti", en: "Packages", es: "Los paquetes", fr: "Les forfaits" },
  "packs.intro":        { it: "Tre escursioni che stanno bene insieme, con lo sconto già tolto dal prezzo. Si prendono intere: una richiesta sola, e i giorni li mettiamo d'accordo insieme.", en: "Three excursions that go well together, with the discount already taken off. You take them as a whole: one single request, and we agree the days together.", es: "Tres excursiones que van bien juntas, con el descuento ya aplicado. Se toman enteras: una sola solicitud, y los días los acordamos juntos.", fr: "Trois excursions qui vont bien ensemble, avec la remise déjà déduite. Elles se prennent en entier : une seule demande, et nous fixons les jours ensemble." },
  "packs.familyEyebrow": { it: "Con i bambini", en: "With the kids", es: "Con los niños", fr: "Avec les enfants" },
  "packs.familyTitle":  { it: "In famiglia", en: "As a family", es: "En familia", fr: "En famille" },
  "packs.familyIntro":  { it: "Pacchetti per chi viaggia coi bambini: tre escursioni dove i piccoli hanno il loro prezzo, con lo sconto già tolto. Si prendono interi: una richiesta sola, e i giorni li mettiamo d'accordo insieme.", en: "Packages for families travelling with children: three excursions where the little ones have their own price, with the discount already taken off. You take them as a whole: one single request, and we agree the days together.", es: "Paquetes para quien viaja con niños: tres excursiones donde los pequeños tienen su propio precio, con el descuento ya aplicado. Se toman enteros: una sola solicitud, y los días los acordamos juntos.", fr: "Des forfaits pour les familles qui voyagent avec des enfants : trois excursions où les petits ont leur propre prix, avec la remise déjà déduite. Ils se prennent en entier : une seule demande, et nous fixons les jours ensemble." },
  "packs.twoEyebrow":   { it: "In coppia", en: "As a couple", es: "En pareja", fr: "En couple" },
  "packs.twoTitle":     { it: "Perfetto per 2", en: "Perfect for two", es: "Perfecto para dos", fr: "Parfait à deux" },
  "packs.twoIntro":     { it: "Pacchetti pensati per chi viaggia in due, con lo sconto già tolto. Il prezzo è a persona. Si prendono interi: una richiesta sola, e i giorni li mettiamo d'accordo insieme.", en: "Packages made for those travelling as a pair, with the discount already taken off. The price is per person. You take them as a whole: one single request, and we agree the days together.", es: "Paquetes pensados para quien viaja en pareja, con el descuento ya aplicado. El precio es por persona. Se toman enteros: una sola solicitud, y los días los acordamos juntos.", fr: "Des forfaits pensés pour ceux qui voyagent à deux, avec la remise déjà déduite. Le prix est par personne. Ils se prennent en entier : une seule demande, et nous fixons les jours ensemble." },
  "packs.familyAll":    { it: "Tutte le escursioni adatte ai bambini", en: "All the kid-friendly excursions", es: "Todas las excursiones aptas para niños", fr: "Toutes les excursions adaptées aux enfants" },
  "pack.eyebrow":       { it: "Pacchetto", en: "Package", es: "Paquete", fr: "Forfait" },
  "pack.ask":           { it: "Richiedi il pacchetto", en: "Request the package", es: "Solicitar el paquete", fr: "Demander le forfait" },
  "pack.oneRequest":    { it: "Il pacchetto si chiede intero, con una richiesta sola: i tre giorni li mettiamo d'accordo insieme quando ti rispondiamo.", en: "The package is requested as a whole, in a single request: we agree the three days together when we reply.", es: "El paquete se solicita entero, con una sola solicitud: los tres días los acordamos juntos cuando te respondemos.", fr: "Le forfait se demande en entier, en une seule demande : nous fixons les trois jours ensemble en vous répondant." },
  "pack.askHint":       { it: "Le richieste vanno fatte con almeno 24 ore di anticipo. Ti rispondiamo entro 24 ore con la conferma e i giorni.", en: "Requests need at least 24 hours' notice. We reply within 24 hours with the confirmation and the days.", es: "Las solicitudes se hacen con al menos 24 horas de antelación. Te respondemos en 24 horas con la confirmación y los días.", fr: "Les demandes doivent être faites au moins 24 heures à l'avance. Nous vous répondons sous 24 heures avec la confirmation et les jours." },
  "pack.fromDay":       { it: "Da che giorno", en: "Starting from", es: "A partir de qué día", fr: "À partir de quel jour" },
  "pack.fromDayHint":   { it: "Il primo dei tre giorni, indicativo: gli altri due li mettiamo d'accordo quando ti rispondiamo.", en: "The first of the three days, roughly: we agree the other two when we reply.", es: "El primero de los tres días, orientativo: los otros dos los acordamos cuando te respondemos.", fr: "Le premier des trois jours, à titre indicatif : nous fixons les deux autres en vous répondant." },
  "pack.hotelPlaceholder": { it: "Nome dell'hotel", en: "Hotel name", es: "Nombre del hotel", fr: "Nom de l'hôtel" },
  // Il totale che non si fa. Prima diceva "c'è un mezzo che si paga a buggy o
  // a moto d'acqua": adesso i mezzi si contano nella finestra e quello non è
  // più il motivo. Restano i due casi veri — un prezzo che non si riesce a
  // leggere, o dei bambini su un'escursione che il prezzo dei bambini non ce
  // l'ha — e il testo non prova più a indovinare quale dei due è.
  "pack.noTotal":       { it: "Il totale non si può fare da qui: di qualcosa qui dentro non abbiamo un prezzo da sommare senza inventarlo. Te lo diciamo noi rispondendo.", en: "We can't total this up here: for something inside we don't have a price we could add without making it up. We'll tell you when we reply.", es: "El total no se puede hacer aquí: de algo de lo que hay dentro no tenemos un precio que sumar sin inventarlo. Te lo decimos al responderte.", fr: "Le total ne peut pas se calculer ici : pour un élément de ce forfait, nous n'avons pas de prix à additionner sans l'inventer. Nous vous le dirons en répondant." },
  "pack.unitsIntro":    { it: "Il mezzo si paga tutto intero, chiunque ci salga: i bambini non aggiungono niente. Le altre escursioni del pacchetto si pagano a testa.", en: "A vehicle is paid for whole, whoever rides it: children add nothing. The other excursions in the package are priced per person.", es: "El vehículo se paga entero, suba quien suba: los niños no añaden nada. Las demás excursiones del paquete se pagan por persona.", fr: "Le véhicule se paie en entier, quel que soit le nombre de personnes à bord : les enfants n'ajoutent rien. Les autres excursions du forfait se paient par personne." },
  "pack.unitsEmpty":    { it: "Scegli quanti mezzi: il totale si fa quando l'hai deciso.", en: "Choose how many vehicles: the total appears once you have.", es: "Elige cuántos vehículos: el total se hace cuando lo hayas decidido.", fr: "Choisissez combien de véhicules : le total se calcule une fois décidé." },
  // I posti e le persone scritti come due etichette e non in una frase ("{n}
  // posti") apposta: con un mezzo solo verrebbe "1 posti", e le quattro lingue non
  // fanno il plurale allo stesso modo. E' la stessa ragione per cui il conto
  // dei menu scrive "Vegetariano × 2" invece di provare a pluralizzare.
  //
  // Sono due chiavi e non una perche' i mezzi corti possono essere due (il
  // buggy **e** la moto d'acqua): con una chiave sola la frase "va bene se non
  // salite tutti" si sarebbe ripetuta identica due volte di fila.
  "pack.unitsSeats":    { it: "{name}: posti scelti {n}", en: "{name}: seats chosen {n}", es: "{name}: plazas elegidas {n}", fr: "{name} : places choisies {n}" },
  "pack.unitsSeatsNote": { it: "Siete in {p}. Va bene se non salite tutti, se no aggiungi un mezzo.", en: "You are {p}. Fine if not everyone is going, otherwise add one.", es: "Sois {p}. Está bien si no subís todos, si no añade uno.", fr: "Vous êtes {p}. Ça va si tout le monde ne monte pas, sinon ajoutez un véhicule." },
  "pack.notFound":      { it: "Pacchetto non trovato", en: "Package not found", es: "Paquete no encontrado", fr: "Forfait introuvable" },
  "pack.notFoundText":  { it: "Questo indirizzo non corrisponde a nessun pacchetto. Forse è stato tolto.", en: "This address doesn't match any package. It may have been removed.", es: "Esta dirección no corresponde a ningún paquete. Puede que se haya retirado.", fr: "Cette adresse ne correspond à aucun forfait. Il a peut-être été retiré." },
  "pack.seeAll":        { it: "Vedi tutti i pacchetti", en: "See all the packages", es: "Ver todos los paquetes", fr: "Voir tous les forfaits" },
  "pack.seeOthers":     { it: "Vedi gli altri pacchetti", en: "See the other packages", es: "Ver los otros paquetes", fr: "Voir les autres forfaits" },
  "pack.perPerson":     { it: "a persona", en: "per person", es: "por persona", fr: "par personne" },
  "pack.save":          { it: "Risparmi €{n}", en: "You save €{n}", es: "Ahorras €{n}", fr: "Vous économisez €{n}" },
  "pack.noPrice":       { it: "Prezzo su richiesta", en: "Price on request", es: "Precio a consultar", fr: "Prix sur demande" },
  "pack.unitNote":      { it: "Qui dentro c'è un mezzo che si paga a buggy o a moto d'acqua, non a testa: questo è il prezzo a persona quando il mezzo si divide fra tutti i posti che ha. Se siete di meno, a testa si paga di più — il totale vero lo fai nella richiesta, scegliendo quanti mezzi.", en: "This one includes a vehicle priced per buggy or per jet ski, not per head: this is the price per person when the vehicle is shared across all its seats. With fewer of you it comes to more each — the real total is worked out in the request, once you choose how many vehicles.", es: "Aquí hay un vehículo que se paga por buggy o por moto de agua, no por persona: este es el precio por persona cuando el vehículo se reparte entre todas sus plazas. Si sois menos, sale más por cabeza — el total real se hace en la solicitud, al elegir cuántos vehículos.", fr: "Ce forfait comprend un véhicule qui se paie au buggy ou au jet-ski, pas par personne : voici le prix par personne quand le véhicule est partagé entre toutes ses places. Si vous êtes moins nombreux, chacun paie plus — le vrai total se calcule dans la demande, en choisissant combien de véhicules." },
  "pack.priceAdults":   { it: "€{n} adulti", en: "€{n} adults", es: "€{n} adultos", fr: "€{n} adultes" },
  "pack.priceChildren": { it: "€{n} bambini", en: "€{n} kids", es: "€{n} niños", fr: "€{n} enfants" },
  "pack.familyTotal":   { it: "Famiglia tipo, 2 adulti e 2 bambini: €{n} in tutto", en: "A typical family, 2 adults and 2 kids: €{n} in total", es: "Familia tipo, 2 adultos y 2 niños: €{n} en total", fr: "Famille type, 2 adultes et 2 enfants : €{n} en tout" },
  "pack.familyAges":    { it: "Le fasce d'età cambiano da un'escursione all'altra: le trovi qui sotto, accanto al prezzo dei bambini. Con altri numeri il totale si rifà da solo nella richiesta.", en: "Age brackets differ from one excursion to the next: you'll find them below, next to the children's price. With other numbers the total recalculates itself in the request.", es: "Las franjas de edad cambian de una excursión a otra: las encuentras abajo, junto al precio de los niños. Con otros números el total se recalcula solo en la solicitud.", fr: "Les tranches d'âge changent d'une excursion à l'autre : vous les trouvez ci-dessous, à côté du prix enfant. Avec d'autres nombres, le total se recalcule tout seul dans la demande." },
  "pack.inside":        { it: "Cosa c'è dentro", en: "What's inside", es: "Qué incluye", fr: "Ce qu'il y a dedans" },

  // ── Gli itinerari a giorni (3/5/7) ──────────────────────────────────────
  // Chiavi loro, non "pack." riscritte: la pagina e' la stessa e i testi si
  // scambiano spostando le chiavi (vedi `pacchettiVestiDaGiorni`). Dove c'e'
  // {n} il numero arriva dai dati — scrivere "sette" a mano vorrebbe dire
  // riscrivere queste righe il giorno che nasce un itinerario da dieci giorni.
  "days.eyebrow":       { it: "Quanti giorni hai", en: "How many days", es: "Cuántos días tienes", fr: "Combien de jours avez-vous" },
  "days.title":         { it: "3, 5 o 7 giorni", en: "3, 5 or 7 days", es: "3, 5 o 7 días", fr: "3, 5 ou 7 jours" },
  "days.intro":         { it: "Un'escursione al giorno, scelte per non ripetersi. L'itinerario si prende intero, con una richiesta sola, e i giorni li mettiamo d'accordo insieme. Se resti sull'isola più a lungo, gli altri giorni restano tuoi.", en: "One excursion a day, picked so they don't repeat each other. You take the itinerary as a whole, in a single request, and we agree the days together. If you're staying on the island longer, the other days stay yours.", es: "Una excursión al día, elegidas para no repetirse. El itinerario se toma entero, con una sola solicitud, y los días los acordamos juntos. Si te quedas más tiempo en la isla, los demás días siguen siendo tuyos.", fr: "Une excursion par jour, choisies pour ne pas se répéter. L'itinéraire se prend en entier, en une seule demande, et nous fixons les jours ensemble. Si vous restez plus longtemps sur l'île, les autres jours restent à vous." },
  "days.navAria":       { it: "Quanti giorni", en: "How many days", es: "Cuántos días", fr: "Combien de jours" },
  "days.all":           { it: "Tutti", en: "All", es: "Todos", fr: "Tous" },
  "days.d3":            { it: "3 giorni", en: "3 days", es: "3 días", fr: "3 jours" },
  "days.d5":            { it: "5 giorni", en: "5 days", es: "5 días", fr: "5 jours" },
  "days.d7":            { it: "7 giorni", en: "7 days", es: "7 días", fr: "7 jours" },
  "days.count":         { it: "{n} giorni", en: "{n} days", es: "{n} días", fr: "{n} jours" },
  "days.detailEyebrow": { it: "Itinerario di {n} giorni", en: "{n}-day itinerary", es: "Itinerario de {n} días", fr: "Itinéraire de {n} jours" },
  "days.inside":        { it: "Giorno per giorno", en: "Day by day", es: "Día a día", fr: "Jour par jour" },
  "days.ask":           { it: "Richiedi l'itinerario", en: "Request the itinerary", es: "Solicitar el itinerario", fr: "Demander l'itinéraire" },
  "days.oneRequest":    { it: "L'itinerario si chiede intero, con una richiesta sola: i {n} giorni li mettiamo d'accordo insieme quando ti rispondiamo.", en: "The itinerary is requested as a whole, in a single request: we agree the {n} days together when we reply.", es: "El itinerario se solicita entero, con una sola solicitud: los {n} días los acordamos juntos cuando te respondemos.", fr: "L'itinéraire se demande en entier, en une seule demande : nous fixons les {n} jours ensemble en vous répondant." },
  "days.fromDayHint":   { it: "Il primo dei {n} giorni, indicativo: gli altri li mettiamo d'accordo quando ti rispondiamo.", en: "The first of the {n} days, roughly: we agree the others when we reply.", es: "El primero de los {n} días, orientativo: los demás los acordamos cuando te respondemos.", fr: "Le premier des {n} jours, à titre indicatif : nous fixons les autres en vous répondant." },
  "days.seeAll":        { it: "Vedi gli altri itinerari", en: "See the other itineraries", es: "Ver los demás itinerarios", fr: "Voir les autres itinéraires" },

  "detail.days":        { it: "Giorni", en: "Days", es: "Días", fr: "Jours" },
  "detail.times":       { it: "Orari", en: "Departure times", es: "Horarios", fr: "Horaires" },
  "detail.languages":   { it: "Lingue", en: "Languages", es: "Idiomas", fr: "Langues" },
  "detail.free":        { it: "Gratis", en: "Free", es: "Gratis", fr: "Gratuit" },
  "detail.transfer":    { it: "Transfer", en: "Transfer", es: "Traslado", fr: "Transfert" },
  "detail.withTransfer": { it: "Con il transfer", en: "With the transfer", es: "Con el traslado", fr: "Avec le transfert" },
  "detail.transferSiam": { it: "Transfer Siam Park", en: "Siam Park transfer", es: "Traslado Siam Park", fr: "Transfert Siam Park" },
  "detail.withTransferSiam": { it: "Con il transfer per il Siam Park", en: "With the Siam Park transfer", es: "Con el traslado a Siam Park", fr: "Avec le transfert pour le Siam Park" },
  "detail.babySeat":    { it: "posto sul pullman", en: "coach seat", es: "plaza en el autobús", fr: "place dans le car" },
  "req.transfer":       { it: "Vuoi il transfer?", en: "Would you like the transfer?", es: "¿Quieres el traslado?", fr: "Voulez-vous le transfert ?" },
  "req.transferSiam":   { it: "Vuoi il transfer per il Siam Park?", en: "Would you like the Siam Park transfer?", es: "¿Quieres el traslado a Siam Park?", fr: "Voulez-vous le transfert pour le Siam Park ?" },
  "detail.people":      { it: "Da {from} a {to} persone", en: "{from} to {to} people", es: "De {from} a {to} personas", fr: "De {from} à {to} personnes" },
  "detail.privateTitle":{ it: "Vuoi la barca solo per il tuo gruppo?", en: "Want the boat just for your group?", es: "¿Quieres el barco solo para tu grupo?", fr: "Vous voulez le bateau rien que pour votre groupe ?" },
  "detail.privateLink": { it: "Vedi il charter privato", en: "See the private charter", es: "Ver el chárter privado", fr: "Voir le charter privé" },
  "detail.kidsYes":     { it: "Famiglie con bambini", en: "Families with children", es: "Familias con niños", fr: "Familles avec enfants" },
  "detail.kidsNo":      { it: "Adulti", en: "Adults", es: "Adultos", fr: "Adultes" },
  "detail.related":     { it: "Altre esperienze da scoprire", en: "More experiences to discover", es: "Más experiencias por descubrir", fr: "D'autres expériences à découvrir" },
  "detail.notFound":    { it: "Escursione non trovata", en: "Excursion not found", es: "Excursión no encontrada", fr: "Excursion introuvable" },
  "detail.notFoundText":{ it: "Questo indirizzo non corrisponde a nessuna escursione. Forse è stato tolto dal catalogo.", en: "This address doesn't match any excursion. It may have been removed from the catalogue.", es: "Esta dirección no corresponde a ninguna excursión. Puede que se haya retirado del catálogo.", fr: "Cette adresse ne correspond à aucune excursion. Elle a peut-être été retirée du catalogue." },
  "detail.seeAll":      { it: "Vedi tutte le escursioni", en: "See all excursions", es: "Ver todas las excursiones", fr: "Voir toutes les excursions" },

  // ── finestra Richiedi disponibilità ─────────────────────────────────────
  "req.title":          { it: "Richiedi disponibilità", en: "Check availability", es: "Consultar disponibilidad", fr: "Vérifier la disponibilité" },
  "req.name":           { it: "Il tuo nome", en: "Your name", es: "Tu nombre", fr: "Votre nom" },
  "req.namePlaceholder":{ it: "Nome e cognome", en: "First and last name", es: "Nombre y apellidos", fr: "Prénom et nom" },
  "req.email":          { it: "La tua email", en: "Your email", es: "Tu email", fr: "Votre e-mail" },
  "req.emailPlaceholder":{ it: "nome@esempio.com", en: "name@example.com", es: "nombre@ejemplo.com", fr: "nom@exemple.com" },
  "req.emailHint":      { it: "Molte compagnie mandano il biglietto per email.", en: "Many operators send the ticket by email.", es: "Muchas compañías envían la entrada por email.", fr: "Beaucoup de compagnies envoient le billet par e-mail." },
  "req.emailInvalid":   { it: "Controlla l'email: manca qualcosa dopo la @ (per esempio .com).", en: "Check your email: something is missing after the @ (for example .com).", es: "Revisa el email: falta algo después de la @ (por ejemplo .com).", fr: "Vérifiez l'e-mail : il manque quelque chose après le @ (par exemple .com)." },
  "req.date":           { it: "Quando vorresti andare", en: "When would you like to go", es: "Cuándo quieres ir", fr: "Quand voudriez-vous y aller" },
  "req.time":           { it: "A che ora", en: "What time", es: "A qué hora", fr: "À quelle heure" },
  "req.timeAny":        { it: "Da concordare", en: "To be agreed", es: "Por concretar", fr: "À convenir" },
  "req.lang":           { it: "In che lingua", en: "Which language", es: "En qué idioma", fr: "En quelle langue" },
  "req.langAny":        { it: "Indifferente", en: "No preference", es: "Indiferente", fr: "Indifférent" },
  "req.menu":           { it: "Esigenze sul menu", en: "Dietary requirements", es: "Necesidades del menú", fr: "Besoins alimentaires" },
  "req.menuStandard":   { it: "Menu standard", en: "Standard menu", es: "Menú estándar", fr: "Menu standard" },
  "req.menuError":      { it: "Hai indicato più menu speciali che persone.", en: "You've asked for more special menus than there are people.", es: "Has indicado más menús especiales que personas.", fr: "Vous avez indiqué plus de menus spéciaux que de personnes." },
  "req.unitsError":     { it: "Serve almeno un mezzo per fare la richiesta.", en: "Add at least one to send the request.", es: "Hace falta al menos uno para enviar la solicitud.", fr: "Il faut au moins un véhicule pour faire la demande." },
  "req.menuHint":       { it: "Allergie o intolleranze: scrivile nelle note qui sotto, così la cucina le sa in anticipo.", en: "Allergies or intolerances: write them in the notes below, so the kitchen knows in advance.", es: "Alergias o intolerancias: escríbelas en las notas de abajo, para que la cocina lo sepa con antelación.", fr: "Allergies ou intolérances : écrivez-les dans les notes ci-dessous, pour que la cuisine les connaisse à l'avance." },
  // Ferma la richiesta, quindi dice "solo" e non "di solito": un'escursione non
  // si prenota nel giorno in cui non c'e'. Che i giorni possano cambiare con la
  // lingua della guida si dice nelle note della scheda, non qui: qui il cliente
  // ha gia' scelto la data e gli serve sapere che quella non va.
  "req.dayError":       { it: "Questa escursione si fa solo: {giorni}.", en: "This excursion only runs on: {giorni}.", es: "Esta excursión solo se hace: {giorni}.", fr: "Cette excursion n'a lieu que : {giorni}." },

  // I giorni della settimana, in forma corta: servono alla riga "Giorni" e al
  // messaggio che compare quando il cliente sceglie una data in cui
  // l'escursione non si fa.
  "day.sun":            { it: "Dom", en: "Sun", es: "Dom", fr: "Dim" },
  "day.mon":            { it: "Lun", en: "Mon", es: "Lun", fr: "Lun" },
  "day.tue":            { it: "Mar", en: "Tue", es: "Mar", fr: "Mar" },
  "day.wed":            { it: "Mer", en: "Wed", es: "Mié", fr: "Mer" },
  "day.thu":            { it: "Gio", en: "Thu", es: "Jue", fr: "Jeu" },
  "day.fri":            { it: "Ven", en: "Fri", es: "Vie", fr: "Ven" },
  "day.sat":            { it: "Sab", en: "Sat", es: "Sáb", fr: "Sam" },
  "req.people":         { it: "Quante persone", en: "How many people", es: "Cuántas personas", fr: "Combien de personnes" },
  "req.total":          { it: "Totale", en: "Total", es: "Total", fr: "Total" },
  "req.adults":         { it: "Adulti", en: "Adults", es: "Adultos", fr: "Adultes" },
  "req.kids":           { it: "Bambini", en: "Children", es: "Niños", fr: "Enfants" },
  "req.babies":         { it: "Neonati", en: "Infants", es: "Bebés", fr: "Bébés" },
  // I due bottoni del "meno / piu'" accanto ai numeri. Non si leggono: sono un
  // segno solo, e questo e' il nome che sente chi usa lo schermo a voce.
  "req.minus":          { it: "Uno in meno", en: "One less", es: "Uno menos", fr: "Un de moins" },
  "req.plus":           { it: "Uno in più", en: "One more", es: "Uno más", fr: "Un de plus" },
  // Il calendario della data. I nomi dei mesi **non** stanno qui: il browser li
  // da' giusti in tutte e quattro le lingue (`toLocaleDateString`), e dodici nomi
  // per quattro lingue sarebbero quarantotto righe per una cosa che sappiamo gia'.
  // I nomi dei giorni invece si', e sono quelli di sopra (`day.mon`...): sono
  // gli stessi che compaiono nell'avviso "si fa solo il...".
  "req.datePick":       { it: "Scegli la data", en: "Choose the date", es: "Elige la fecha", fr: "Choisir la date" },
  "req.dateMissing":    { it: "Scegli la data dell'escursione.", en: "Choose the date of the excursion.", es: "Elige la fecha de la excursión.", fr: "Choisissez la date de l'excursion." },
  "req.prevMonth":      { it: "Mese precedente", en: "Previous month", es: "Mes anterior", fr: "Mois précédent" },
  "req.nextMonth":      { it: "Mese successivo", en: "Next month", es: "Mes siguiente", fr: "Mois suivant" },
  // Quando in tutto l'anno non c'e' un giorno buono: non capita col catalogo di
  // oggi, ma un `days` scritto male domani lo farebbe, e una griglia tutta
  // grigia senza una riga che spieghi sembra il sito rotto.
  "req.dateNone":       { it: "Per questa escursione non ci sono date disponibili: scrivici su WhatsApp.", en: "No dates available for this excursion: write to us on WhatsApp.", es: "No hay fechas disponibles para esta excursión: escríbenos por WhatsApp.", fr: "Pour cette excursion, il n'y a pas de dates disponibles : écrivez-nous sur WhatsApp." },
  "req.hotel":          { it: "Dove alloggi", en: "Where you are staying", es: "Dónde te alojas", fr: "Où logez-vous" },
  "req.hotelPlaceholder": { it: "Scrivi le prime lettere dell'hotel", en: "Type the first letters of your hotel", es: "Escribe las primeras letras del hotel", fr: "Tapez les premières lettres de l'hôtel" },
  "req.pickup":         { it: "Punto di raccolta", en: "Pick-up point", es: "Punto de recogida", fr: "Point de prise en charge" },
  "req.pickupHotel":    { it: "il tuo hotel", en: "your hotel", es: "tu hotel", fr: "votre hôtel" },
  "pickup.bus":         { it: "alla fermata dell'autobus", en: "at the bus stop", es: "en la parada de guagua", fr: "à l'arrêt de bus" },
  "pickup.taxi":        { it: "al posteggio dei taxi", en: "at the taxi rank", es: "en la parada de taxis", fr: "à la station de taxis" },
  "pickup.sbarra":      { it: "alla sbarra", en: "at the barrier", es: "en la barrera", fr: "à la barrière" },
  "pickup.reception":   { it: "fuori dalla reception", en: "outside reception", es: "fuera de recepción", fr: "devant la réception" },
  "pickup.centro":      { it: "al centro commerciale", en: "at the shopping centre", es: "en el centro comercial", fr: "au centre commercial" },
  "pickup.angolo":      { it: "all'angolo", en: "on the corner", es: "en la esquina", fr: "au coin de la rue" },
  "req.hotelWhy":       { it: "(utile per il pick-up)", en: "(useful for the pick-up)", es: "(útil para la recogida)", fr: "(utile pour la prise en charge)" },
  "req.hotelHintTime":  { it: "Serve a dirti dove e a che ora passiamo a prenderti. Se non trovi il tuo, scrivilo nelle note.", en: "It tells us where and when to pick you up. If yours is not listed, write it in the notes.", es: "Nos dice dónde y a qué hora recogerte. Si no encuentras el tuyo, escríbelo en las notas.", fr: "Cela sert à vous dire où et à quelle heure nous passons vous prendre. Si vous ne trouvez pas le vôtre, écrivez-le dans les notes." },
  "req.hotelHint":      { it: "Serve a dirti dove passiamo a prenderti. Se non trovi il tuo, scrivilo nelle note.", en: "It tells us where to pick you up. If yours is not listed, write it in the notes.", es: "Nos dice dónde recogerte. Si no encuentras el tuyo, escríbelo en las notas.", fr: "Cela sert à vous dire où nous passons vous prendre. Si vous ne trouvez pas le vôtre, écrivez-le dans les notes." },
  "req.note":           { it: "Note", en: "Notes", es: "Notas", fr: "Notes" },
  "req.optional":       { it: "(facoltativo)", en: "(optional)", es: "(opcional)", fr: "(facultatif)" },
  "req.notePlaceholder":{ it: "Richieste particolari…", en: "Special requests…", es: "Peticiones especiales…", fr: "Demandes particulières…" },
  "req.submit":         { it: "Continua su WhatsApp", en: "Continue on WhatsApp", es: "Continuar en WhatsApp", fr: "Continuer sur WhatsApp" },
  "req.addToList":      { it: "Aggiungi alla lista", en: "Add to list", es: "Añadir a la lista", fr: "Ajouter à la liste" },
  // ⚠ LE 24 ORE SONO LA REGOLA DI ISLA, non quella dei fornitori. Le pagine
  // degli operatori e dei rivenditori scrivono le loro (48 ore, 72 ore...):
  // **non si copiano qui**. Isla prenota a mano su WhatsApp e questa riga
  // resta a 24 ore finche' non e' l'ufficio a dire un altro numero.
  "req.hint":           { it: "Le richieste vanno fatte con almeno <strong>24 ore di anticipo</strong>. Ti rispondiamo entro 24 ore con la conferma.", en: "Requests must be sent at least <strong>24 hours in advance</strong>. We reply within 24 hours with the confirmation.", es: "Las solicitudes deben enviarse con al menos <strong>24 horas de antelación</strong>. Respondemos en 24 horas con la confirmación.", fr: "Les demandes doivent être faites au moins <strong>24 heures à l'avance</strong>. Nous vous répondons sous 24 heures avec la confirmation." },
  // Diceva "non viene salvato dal sito", e da quando l'hotel si ricorda non era
  // piu' vero. Non era del tutto vero nemmeno prima: la lista delle richieste
  // sta nel browser da sempre, hotel e note comprese.
  // La riga nuova dice le due cose che contano e sono vere: a chi serve quello
  // che scrive (a rispondergli su WhatsApp, e nel sito non c'e' una sola
  // chiamata di rete che mandi qualcosa a qualcuno), e dove finisce l'hotel
  // (nel suo dispositivo, non da noi). Due frasi corte: quelle lunghe le ha
  // bocciate il proprietario e aveva ragione.
  "req.privacy":        { it: "Quello che scrivi serve solo a risponderti su WhatsApp. L'hotel resta salvato su questo dispositivo, per non riscriverlo ogni volta. <a href=\"./privacy.html\" target=\"_blank\" rel=\"noopener\">Come trattiamo i tuoi dati</a>", en: "What you type is only used to reply to you on WhatsApp. Your hotel stays saved on this device, so you don't have to type it again. <a href=\"./privacy.html\" target=\"_blank\" rel=\"noopener\">How we handle your data</a>", es: "Lo que escribes solo sirve para responderte por WhatsApp. El hotel se queda guardado en este dispositivo, para no escribirlo cada vez. <a href=\"./privacy.html\" target=\"_blank\" rel=\"noopener\">Cómo tratamos tus datos</a>", fr: "Ce que vous écrivez sert seulement à vous répondre sur WhatsApp. L'hôtel reste enregistré sur cet appareil, pour ne pas le retaper à chaque fois. <a href=\"./privacy.html\" target=\"_blank\" rel=\"noopener\">Comment nous traitons vos données</a>" },

  // ── messaggio WhatsApp ──────────────────────────────────────────────────
  "wa.intro":           { it: "Ciao Isla! Sono {name}, vorrei richiedere disponibilità per:", en: "Hi Isla! I'm {name}, I'd like to check availability for:", es: "¡Hola Isla! Soy {name}, quisiera consultar disponibilidad para:", fr: "Bonjour Isla ! Je suis {name}, je voudrais connaître la disponibilité pour :" },
  "wa.date":            { it: "Data", en: "Date", es: "Fecha", fr: "Date" },
  "wa.time":            { it: "Orario", en: "Time", es: "Hora", fr: "Horaire" },
  "wa.lang":            { it: "Lingua", en: "Language", es: "Idioma", fr: "Langue" },
  "wa.menu":            { it: "Menu", en: "Menu", es: "Menú", fr: "Menu" },
  "wa.people":          { it: "Persone", en: "People", es: "Personas", fr: "Personnes" },
  "wa.hotel":           { it: "Hotel", en: "Hotel", es: "Hotel", fr: "Hôtel" },
  "wa.pickup":          { it: "Punto di raccolta", en: "Pick-up point", es: "Punto de recogida", fr: "Point de prise en charge" },
  "wa.pickupHotel":     { it: "in hotel", en: "at the hotel", es: "en el hotel", fr: "à l'hôtel" },
  "wa.notes":           { it: "Note", en: "Notes", es: "Notas", fr: "Notes" },
  "wa.transfer":        { it: "Transfer", en: "Transfer", es: "Traslado", fr: "Transfert" },
  "wa.transferSiam":    { it: "Transfer Siam Park", en: "Siam Park transfer", es: "Traslado Siam Park", fr: "Transfert Siam Park" },
  "wa.total":           { it: "Totale", en: "Total", es: "Total", fr: "Total" },
  "wa.email":           { it: "Email: {email}", en: "Email: {email}", es: "Email: {email}", fr: "E-mail : {email}" },
  "wa.code":            { it: "Codice richiesta: {code}", en: "Request code: {code}", es: "Código de solicitud: {code}", fr: "Code de la demande : {code}" },
  "wa.introList":       { it: "Ciao Isla! Sono {name}, vorrei richiedere disponibilità per {n} escursioni:", en: "Hi Isla! I'm {name}, I'd like to check availability for {n} excursions:", es: "¡Hola Isla! Soy {name}, quisiera consultar disponibilidad para {n} excursiones:", fr: "Bonjour Isla ! Je suis {name}, je voudrais connaître la disponibilité pour {n} excursions :" },
  "wa.fromDay":         { it: "Dal giorno", en: "From", es: "Desde el día", fr: "À partir du" },
  "wa.introPack":       { it: "Ciao Isla! Sono {name}, vorrei richiedere il pacchetto «{pack}»:", en: "Hi Isla! I'm {name}, I'd like to request the «{pack}» package:", es: "¡Hola Isla! Soy {name}, quisiera solicitar el paquete «{pack}»:", fr: "Bonjour Isla ! Je suis {name}, je voudrais demander le forfait « {pack} » :" },
  "wa.introDays":       { it: "Ciao Isla! Sono {name}, vorrei richiedere l'itinerario «{pack}», {n} giorni:", en: "Hi Isla! I'm {name}, I'd like to request the «{pack}» itinerary, {n} days:", es: "¡Hola Isla! Soy {name}, quisiera solicitar el itinerario «{pack}», {n} días:", fr: "Bonjour Isla ! Je suis {name}, je voudrais demander l'itinéraire « {pack} », {n} jours :" },
  "wa.totalPartial":    { it: "Totale (solo le escursioni con il prezzo)", en: "Total (priced excursions only)", es: "Total (solo las excursiones con precio)", fr: "Total (seulement les excursions avec un prix)" },
  "wa.yes":             { it: "sì", en: "yes", es: "sí", fr: "oui" },
  "wa.no":              { it: "no", en: "no", es: "no", fr: "non" },
  "wa.adult":           { it: "adulto", en: "adult", es: "adulto", fr: "adulte" },
  "wa.adults":          { it: "adulti", en: "adults", es: "adultos", fr: "adultes" },
  "wa.child":           { it: "bambino", en: "child", es: "niño", fr: "enfant" },
  "wa.children":        { it: "bambini", en: "children", es: "niños", fr: "enfants" },
  "wa.baby":            { it: "neonato", en: "baby", es: "bebé", fr: "bébé" },
  "wa.babies":          { it: "neonati", en: "babies", es: "bebés", fr: "bébés" },
  "wa.and":             { it: "e", en: "and", es: "y", fr: "et" },

  // ── assistente ──────────────────────────────────────────────────────────
  "assist.open":        { it: "Apri l'assistente per trovare un'escursione", en: "Open the assistant to find an excursion", es: "Abre el asistente para encontrar una excursión", fr: "Ouvrir l'assistant pour trouver une excursion" },
  "assist.title":       { it: "Assistente Isla", en: "Isla Assistant", es: "Asistente Isla", fr: "Assistant Isla" },
  "assist.sub":         { it: "Ti aiuto a scegliere", en: "I'll help you choose", es: "Te ayudo a elegir", fr: "Je vous aide à choisir" },
  "assist.hello":       { it: "Ciao! Ti faccio tre domande veloci e ti propongo qualcosa.", en: "Hi! Three quick questions and I'll suggest something.", es: "¡Hola! Te hago tres preguntas rápidas y te propongo algo.", fr: "Bonjour ! Trois questions rapides et je vous propose quelque chose." },
  "assist.q1":          { it: "Cosa ti piacerebbe fare?", en: "What would you like to do?", es: "¿Qué te gustaría hacer?", fr: "Qu'aimeriez-vous faire ?" },
  "assist.q2":          { it: "Ci sono bambini con te?", en: "Are there children with you?", es: "¿Vienen niños contigo?", fr: "Y a-t-il des enfants avec vous ?" },
  "assist.yes":         { it: "Sì", en: "Yes", es: "Sí", fr: "Oui" },
  "assist.no":          { it: "No", en: "No", es: "No", fr: "Non" },
  "assist.int.sea":     { it: "Mare e barche", en: "Sea and boats", es: "Mar y barcos", fr: "Mer et bateaux" },
  // Segue il nome della categoria in esplora-catalog.js: la risposta e il posto
  // dove porta si devono leggere uguali. La riga "assist.int.stars" e' sparita
  // con la categoria "stelle": adesso le stelle stanno qui dentro.
  "assist.int.nature":  { it: "Natura, Teide e stelle", en: "Nature, Teide and stars", es: "Naturaleza, Teide y estrellas", fr: "Nature, Teide et étoiles" },
  "assist.int.adrenaline": { it: "Adrenalina", en: "Adrenaline", es: "Adrenalina", fr: "Adrénaline" },
  "assist.int.parks":   { it: "Parchi e spettacoli", en: "Parks and shows", es: "Parques y espectáculos", fr: "Parcs et spectacles" },
  "assist.int.island":  { it: "Girare l'isola", en: "Tour the island", es: "Recorrer la isla", fr: "Faire le tour de l'île" },
  "assist.int.unsure":  { it: "Non lo so ancora", en: "I'm not sure yet", es: "Todavía no lo sé", fr: "Je ne sais pas encore" },
  "assist.q3":          { it: "Che budget hai in mente?", en: "What's your budget?", es: "¿Qué presupuesto tienes?", fr: "Quel budget avez-vous en tête ?" },
  "assist.budget.low":  { it: "Fino a €50", en: "Up to €50", es: "Hasta €50", fr: "Jusqu'à €50" },
  "assist.budget.mid":  { it: "Da €50 a €100", en: "€50 to €100", es: "De €50 a €100", fr: "De €50 à €100" },
  "assist.budget.high": { it: "Più di €100", en: "Over €100", es: "Más de €100", fr: "Plus de €100" },
  "assist.budget.any":  { it: "Non importa", en: "Doesn't matter", es: "Da igual", fr: "Peu importe" },
  "assist.noBudget":    { it: "Con questo budget non ho trovato niente con un prezzo fisso. Molte esperienze però si organizzano su richiesta.", en: "Nothing with a fixed price fits this budget. Many experiences are arranged on request, though.", es: "Con este presupuesto no hay nada con precio fijo. Aun así, muchas experiencias se organizan bajo petición.", fr: "Avec ce budget, je n'ai rien trouvé à prix fixe. Mais beaucoup d'expériences s'organisent sur demande." },
  "assist.customTitle": { it: "Non trovi quello che cerchi?", en: "Can't find what you're looking for?", es: "¿No encuentras lo que buscas?", fr: "Vous ne trouvez pas ce que vous cherchez ?" },
  "assist.customText":  { it: "Scrivici cosa ti piacerebbe fare e te lo organizziamo noi.", en: "Tell us what you'd like to do and we'll organise it for you.", es: "Cuéntanos qué te gustaría hacer y te lo organizamos.", fr: "Écrivez-nous ce que vous aimeriez faire et nous l'organisons pour vous." },
  "assist.customBtn":   { it: "Chiedi su WhatsApp", en: "Ask on WhatsApp", es: "Preguntar por WhatsApp", fr: "Demander sur WhatsApp" },
  "assist.customWa":    { it: "Ciao Isla! Sto cercando un'esperienza a Tenerife che non ho trovato sul sito. Vorrei: ", en: "Hi Isla! I'm looking for an experience in Tenerife that I couldn't find on the site. I'd like: ", es: "¡Hola Isla! Busco una experiencia en Tenerife que no he encontrado en la web. Me gustaría: ", fr: "Bonjour Isla ! Je cherche une expérience à Tenerife que je n'ai pas trouvée sur le site. Je voudrais : " },
  "assist.results":     { it: "Ecco cosa ti consiglio:", en: "Here's what I'd suggest:", es: "Esto es lo que te recomiendo:", fr: "Voici ce que je vous conseille :" },
  "assist.resultsFamily": { it: "Ecco cosa ti consiglio, tutto adatto ai bambini:", en: "Here's what I'd suggest, all kid-friendly:", es: "Esto es lo que te recomiendo, todo apto para niños:", fr: "Voici ce que je vous conseille, tout adapté aux enfants :" },
  "assist.none":        { it: "Su questa combinazione non ho trovato nulla. Prova a cambiare risposta, oppure guarda tutto il catalogo.", en: "I found nothing for this combination. Try a different answer, or browse the whole catalogue.", es: "No he encontrado nada con esta combinación. Prueba a cambiar de respuesta o mira todo el catálogo.", fr: "Je n'ai rien trouvé pour cette combinaison. Essayez de changer une réponse, ou regardez tout le catalogue." },
  "assist.more":        { it: "Ce ne sono altre {n}.", en: "There are {n} more.", es: "Hay {n} más.", fr: "Il y en a {n} autres." },
  "assist.catalog":     { it: "Vedi il catalogo", en: "See the catalogue", es: "Ver el catálogo", fr: "Voir le catalogue" },
  "assist.restart":     { it: "Ricomincia", en: "Start again", es: "Empezar de nuevo", fr: "Recommencer" },

  // ── pagina prenotazione ─────────────────────────────────────────────────
  "booking.back":       { it: "Torna alla home", en: "Back to home", es: "Volver al inicio", fr: "Retour à l'accueil" },
  "booking.h1":         { it: "La tua escursione", en: "Your excursion", es: "Tu excursión", fr: "Votre excursion" },
  "booking.found":      { it: "Prenotazione trovata", en: "Booking found", es: "Reserva encontrada", fr: "Réservation trouvée" },
  "booking.confirmed":  { it: "Confermata", en: "Confirmed", es: "Confirmada", fr: "Confirmée" },
  "booking.code":       { it: "Codice", en: "Code", es: "Código", fr: "Code" },
  "booking.time":       { it: "Orario", en: "Time", es: "Hora", fr: "Horaire" },
  "booking.duration":   { it: "Durata", en: "Duration", es: "Duración", fr: "Durée" },
  "booking.meeting":    { it: "Punto d'incontro", en: "Meeting point", es: "Punto de encuentro", fr: "Point de rendez-vous" },
  "booking.openMap":    { it: "Apri in mappa →", en: "Open in maps →", es: "Abrir en el mapa →", fr: "Ouvrir dans la carte →" },
  "booking.bring":      { it: "Cosa portare", en: "What to bring", es: "Qué llevar", fr: "Quoi apporter" },
  "booking.notes":      { it: "Note importanti", en: "Important notes", es: "Notas importantes", fr: "Remarques importantes" },
  "booking.another":    { it: "Cerca un'altra prenotazione", en: "Look up another booking", es: "Buscar otra reserva", fr: "Chercher une autre réservation" },
  "booking.help":       { it: "Richiedi assistenza", en: "Get help", es: "Solicitar ayuda", fr: "Demander de l'aide" },
  "booking.helpSubject":{ it: "Assistenza prenotazione", en: "Booking support", es: "Asistencia con la reserva", fr: "Assistance réservation" },
  "booking.notFound":   { it: "Ticket non trovato", en: "Ticket not found", es: "Ticket no encontrado", fr: "Ticket introuvable" },
  "booking.notFoundText": { it: "Non troviamo un ticket con il numero \"{code}\" e questo telefono. Controlla tutti e due sul ticket: il telefono è quello che hai dato al venditore.", en: "We can't find a ticket with the number \"{code}\" and this phone number. Check both on your ticket: the phone is the one you gave the seller.", es: "No encontramos ningún ticket con el número \"{code}\" y este teléfono. Revisa los dos en el ticket: el teléfono es el que diste al vendedor.", fr: "Nous ne trouvons pas de ticket avec le numéro « {code} » et ce téléphone. Vérifiez les deux sur le ticket : le téléphone est celui que vous avez donné au vendeur." },
  "booking.retry":      { it: "Riprova", en: "Try again", es: "Inténtalo de nuevo", fr: "Réessayer" },
  "booking.needPhone":  { it: "Manca il telefono", en: "Phone number missing", es: "Falta el teléfono", fr: "Il manque le téléphone" },
  "booking.needPhoneText": { it: "Per vedere il ticket {code} scrivi anche il telefono che hai dato al venditore.", en: "To see ticket {code}, also enter the phone number you gave the seller.", es: "Para ver el ticket {code}, escribe también el teléfono que diste al vendedor.", fr: "Pour voir le ticket {code}, indiquez aussi le téléphone que vous avez donné au vendeur." },
  "booking.loading":    { it: "Cerco il tuo ticket…", en: "Looking up your ticket…", es: "Buscando tu ticket…", fr: "Je cherche votre ticket…" },
  "booking.offline":    { it: "Niente connessione", en: "No connection", es: "Sin conexión", fr: "Pas de connexion" },
  "booking.offlineText":{ it: "Adesso non riusciamo a cercare il ticket. Riprova quando hai campo.", en: "We can't look up your ticket right now. Try again when you have signal.", es: "Ahora no podemos buscar tu ticket. Inténtalo de nuevo cuando tengas cobertura.", fr: "Nous ne pouvons pas chercher le ticket pour l'instant. Réessayez quand vous avez du réseau." },
  "booking.offlineSaved": { it: "Senza connessione: è l'ultima versione salvata su questo telefono.", en: "No connection: this is the last version saved on this phone.", es: "Sin conexión: es la última versión guardada en este teléfono.", fr: "Sans connexion : c'est la dernière version enregistrée sur ce téléphone." },
  "booking.ticketN":    { it: "Ticket {code}", en: "Ticket {code}", es: "Ticket {code}", fr: "Ticket {code}" },
  "booking.pending":    { it: "Da confermare", en: "Pending", es: "Por confirmar", fr: "À confirmer" },
  "booking.cancelled":  { it: "Annullata", en: "Cancelled", es: "Cancelada", fr: "Annulée" },
  "booking.pendingText":{ it: "L'ufficio ha ricevuto la tua richiesta e ti risponde su WhatsApp entro 24 ore.", en: "The office has received your request and will reply on WhatsApp within 24 hours.", es: "La oficina ha recibido tu solicitud y te responde por WhatsApp en 24 horas.", fr: "Le bureau a reçu votre demande et vous répond sur WhatsApp sous 24 heures." },
  "booking.cancelledText": { it: "Questa escursione non si può fare. Scrivici su WhatsApp e cerchiamo insieme un'altra data.", en: "This excursion can't go ahead. Message us on WhatsApp and we'll find another date together.", es: "Esta excursión no se puede realizar. Escríbenos por WhatsApp y buscamos juntos otra fecha.", fr: "Cette excursion ne peut pas avoir lieu. Écrivez-nous sur WhatsApp et nous chercherons ensemble une autre date." },
  "booking.requestOf":  { it: "Richiesta del {date}", en: "Request of {date}", es: "Solicitud del {date}", fr: "Demande du {date}" },
  "booking.wantedTime": { it: "Orario richiesto", en: "Requested time", es: "Hora solicitada", fr: "Horaire demandé" },
  "booking.requestsIntro": { it: "Le richieste che hai mandato su WhatsApp. Lo stato lo aggiorna l'ufficio.", en: "The requests you sent on WhatsApp. The office updates their status.", es: "Las solicitudes que enviaste por WhatsApp. La oficina actualiza su estado.", fr: "Les demandes que vous avez envoyées sur WhatsApp. Le bureau met à jour leur état." },
  "booking.waRequests": { it: "Ciao, ho una domanda sulle mie richieste ({code}).", en: "Hi, I have a question about my requests ({code}).", es: "Hola, tengo una pregunta sobre mis solicitudes ({code}).", fr: "Bonjour, j'ai une question sur mes demandes ({code})." },
  "booking.ticketsTitle": { it: "I tuoi ticket", en: "Your tickets", es: "Tus tickets", fr: "Vos tickets" },
  "booking.openRequestsTitle": { it: "Richieste", en: "Requests", es: "Solicitudes", fr: "Demandes" },
  "booking.ticketsH1":  { it: "I miei ticket", en: "My tickets", es: "Mis tickets", fr: "Mes tickets" },
  "booking.requestsH1": { it: "Le mie richieste", en: "My requests", es: "Mis solicitudes", fr: "Mes demandes" },
  "booking.noRequests": { it: "Nessuna richiesta", en: "No requests", es: "Ninguna solicitud", fr: "Aucune demande" },
  "booking.noRequestsText": { it: "Qui compaiono le escursioni che richiedi su WhatsApp da questo telefono.", en: "The excursions you request on WhatsApp from this phone will appear here.", es: "Aquí aparecen las excursiones que solicitas por WhatsApp desde este teléfono.", fr: "Ici apparaissent les excursions que vous demandez sur WhatsApp depuis ce téléphone." },
  "ticket.requestsLink": { it: "Le mie richieste ({n})", en: "My requests ({n})", es: "Mis solicitudes ({n})", fr: "Mes demandes ({n})" },
  "ticket.requestsSub":  { it: "Mandate su WhatsApp, anche senza ticket", en: "Sent on WhatsApp, even without a ticket", es: "Enviadas por WhatsApp, también sin ticket", fr: "Envoyées sur WhatsApp, même sans ticket" },
  "ticket.requestsOr":   { it: "oppure cerca un ticket di carta", en: "or look up a paper ticket", es: "o busca un ticket de papel", fr: "ou cherchez un ticket papier" },
  "booking.past":       { it: "Già fatta", en: "Done", es: "Realizada", fr: "Déjà faite" },
  "booking.pastTitle":  { it: "Escursioni passate", en: "Past excursions", es: "Excursiones pasadas", fr: "Excursions passées" },
  "booking.when":       { it: "Quando", en: "When", es: "Cuándo", fr: "Quand" },
  "booking.people":     { it: "Persone", en: "People", es: "Personas", fr: "Personnes" },
  "booking.meetAt":     { it: "Presentati alle {time}", en: "Be there at {time}", es: "Preséntate a las {time}", fr: "Présentez-vous à {time}" },
  "booking.payment":    { it: "Pagamento", en: "Payment", es: "Pago", fr: "Paiement" },
  "booking.paid":       { it: "Pagato", en: "Paid", es: "Pagado", fr: "Payé" },
  "booking.toPay":      { it: "Da pagare: €{n}", en: "Left to pay: €{n}", es: "Por pagar: €{n}", fr: "Reste à payer : €{n}" },
  "booking.adult1":     { it: "1 adulto", en: "1 adult", es: "1 adulto", fr: "1 adulte" },
  "booking.adultN":     { it: "{n} adulti", en: "{n} adults", es: "{n} adultos", fr: "{n} adultes" },
  "booking.kid1":       { it: "1 bambino", en: "1 child", es: "1 niño", fr: "1 enfant" },
  "booking.kidN":       { it: "{n} bambini", en: "{n} children", es: "{n} niños", fr: "{n} enfants" },
  "booking.baby1":      { it: "1 neonato", en: "1 infant", es: "1 bebé", fr: "1 bébé" },
  "booking.babyN":      { it: "{n} neonati", en: "{n} infants", es: "{n} bebés", fr: "{n} bébés" },
  "booking.seeTour":    { it: "Vedi l'escursione", en: "See the excursion", es: "Ver la excursión", fr: "Voir l'excursion" },
  "booking.otherExc":   { it: "La tua escursione", en: "Your excursion", es: "Tu excursión", fr: "Votre excursion" },
  "booking.whatsapp":   { it: "Scrivi all'ufficio", en: "Message the office", es: "Escribe a la oficina", fr: "Écrire au bureau" },
  "booking.waText":     { it: "Ciao, ho una domanda sul ticket {code}.", en: "Hi, I have a question about ticket {code}.", es: "Hola, tengo una pregunta sobre el ticket {code}.", fr: "Bonjour, j'ai une question sur le ticket {code}." },
  "booking.noCode":     { it: "Trova la tua escursione", en: "Find your excursion", es: "Encuentra tu excursión", fr: "Trouvez votre excursion" },
  "booking.noCodeText": { it: "Scrivi il numero del ticket e il telefono che hai dato al venditore.", en: "Enter your ticket number and the phone number you gave the seller.", es: "Escribe el número del ticket y el teléfono que diste al vendedor.", fr: "Indiquez le numéro du ticket et le téléphone que vous avez donné au vendeur." },
  "booking.goHome":     { it: "Vai alla home", en: "Go to home", es: "Ir al inicio", fr: "Aller à l'accueil" },

  // ── pagina offline ──────────────────────────────────────────────────────
  "offline.title":      { it: "Sei offline", en: "You're offline", es: "Estás sin conexión", fr: "Vous êtes hors ligne" },
  "offline.text":       { it: "La PWA è installata, ma questa pagina non è disponibile senza connessione.", en: "The app is installed, but this page isn't available without a connection.", es: "La app está instalada, pero esta página no está disponible sin conexión.", fr: "L'app est installée, mais cette page n'est pas disponible sans connexion." }
};

// Lingua attiva. Ordine: scelta salvata → lingua del browser → I18N_DEFAULT.
let I18N_CURRENT = (function () {
  let salvata = null;
  try { salvata = localStorage.getItem(I18N_STORAGE_KEY); } catch (e) { /* modalità privata */ }
  if (I18N_LANGS.includes(salvata)) return salvata;

  const lingue = navigator.languages || [navigator.language || ""];
  for (const l of lingue) {
    const corta = String(l).slice(0, 2).toLowerCase();
    if (I18N_LANGS.includes(corta)) return corta;
  }
  return I18N_DEFAULT;
})();

function getLang() {
  return I18N_CURRENT;
}

// Sostituisce i segnaposto {nome} con i valori passati:
//   fill("{n} attività", { n: 5 }) → "5 attività"
function fill(testo, vars) {
  if (!vars) return testo;
  return testo.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}

// Il testo di una chiave nella lingua attiva.
// Se manca la traduzione ripiega sull'inglese, poi sull'italiano.
function t(key, vars) {
  const voce = I18N[key];
  if (!voce) return key;                    // chiave sbagliata: si vede subito
  const testo = voce[I18N_CURRENT] || voce.en || voce.it || "";
  return fill(testo, vars);
}

// Il numero di un prezzo, scritto come lo scrive la lingua attiva.
//
// I prezzi interi restano come sono ("44"): sono quasi tutti cosi' e "44,00"
// riempirebbe il sito di zeri che nessuno ha chiesto. Quelli coi centesimi
// prendono sempre **due** decimali, con la virgola in italiano, spagnolo e
// francese ("49,50") e il punto in inglese ("49.50"): "49.5" non e' un prezzo, e' un
// numero, e su una pagina di prenotazione sembra un errore.
//
// Il simbolo € non lo mette: lo scrivono gia' i punti che la usano, che lo
// mettono prima del numero ("€49,50") in tutte e quattro le lingue.
function eur(n) {
  const num = Number(n);
  if (!isFinite(num)) return String(n);
  if (Number.isInteger(num)) return String(num);
  const testo = num.toFixed(2);
  return I18N_CURRENT === "en" ? testo : testo.replace(".", ",");
}

// Il messaggio WhatsApp che arriva all'ufficio. Si scrive nella lingua del
// cliente, ma il francese l'ufficio non lo legge: chi usa il sito in francese
// manda il messaggio in italiano (proprietario, 13 ottobre 2026). Va avvolto
// **tutto** il testo del messaggio, non solo le etichette: date, persone,
// titoli e varianti passano anche loro da t() e tf().
const I18N_UFFICIO = { fr: "it" };

function perUfficio(scrivi) {
  const prima = I18N_CURRENT;
  if (!I18N_UFFICIO[prima]) return scrivi();
  I18N_CURRENT = I18N_UFFICIO[prima];
  try { return scrivi(); } finally { I18N_CURRENT = prima; }
}

// Campo del catalogo che può essere una stringa uguale in tutte le lingue
// (i nomi propri, per esempio "Siam Park") oppure un oggetto { it, en, es, fr }.
function tf(campo) {
  if (campo === null || campo === undefined) return "";
  if (typeof campo === "string") return campo;
  return campo[I18N_CURRENT] || campo.en || campo.it || "";
}

// Applica le traduzioni a tutti gli elementi marcati nell'HTML.
function applyI18n(root) {
  const r = root || document;

  r.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  r.querySelectorAll("[data-i18n-html]").forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  r.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  r.querySelectorAll("[data-i18n-aria-label]").forEach(el => {
    el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel));
  });
  r.querySelectorAll("[data-i18n-alt]").forEach(el => {
    el.alt = t(el.dataset.i18nAlt);
  });
  r.querySelectorAll("[data-i18n-content]").forEach(el => {
    el.setAttribute("content", t(el.dataset.i18nContent));
  });

  // Nomi delle categorie: la fonte è esplora-catalog.js, così restano
  // scritti in un posto solo.
  if (typeof CATEGORIES !== "undefined") {
    r.querySelectorAll("[data-i18n-cat]").forEach(el => {
      const cat = CATEGORIES.find(c => c.id === el.dataset.i18nCat);
      if (!cat) return;
      const nome = tf(cat.name);
      if (el.tagName === "IMG") el.alt = nome + " " + t("categories.altSuffix");
      else el.textContent = nome;
    });
  }

  const titolo = document.body && document.body.dataset.i18nDoctitle;
  if (titolo) document.title = t(titolo);

  document.documentElement.lang = I18N_CURRENT;
}

// Cambia lingua, la ricorda e avvisa il resto della pagina.
function setLang(lang) {
  if (!I18N_LANGS.includes(lang) || lang === I18N_CURRENT) return;
  I18N_CURRENT = lang;
  try { localStorage.setItem(I18N_STORAGE_KEY, lang); } catch (e) { /* modalità privata */ }
  applyI18n();
  paintLangButtons();
  document.dispatchEvent(new CustomEvent("islalang", { detail: { lang } }));
}

// Evidenzia la lingua attiva su tutti i selettori presenti nella pagina.
function paintLangButtons() {
  document.querySelectorAll("[data-lang-set]").forEach(btn => {
    const attivo = btn.dataset.langSet === I18N_CURRENT;
    btn.classList.toggle("is-active", attivo);
    btn.setAttribute("aria-pressed", attivo ? "true" : "false");
  });
}

// I bottoni della lingua: la riga IT/EN/ES della home e quella dentro il menu
// laterale. Il vecchio bottone tondo che apriva un elenco a tendina non c'e'
// piu' su nessuna pagina, ed e' andato via con la barra fissa che lo teneva.
function initLangSwitch() {
  document.querySelectorAll("[data-lang-set]").forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.dataset.langSet));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyI18n();
  initLangSwitch();
  paintLangButtons();
});

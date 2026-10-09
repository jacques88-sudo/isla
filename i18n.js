// Traduzioni del sito in italiano, inglese e spagnolo.
//
// COME FUNZIONA
//   Ogni testo ha una "chiave" (es. "nav.bookNow") e tre versioni: it, en, es.
//   Nell'HTML si scrive data-i18n="nav.bookNow" su un elemento: al caricamento
//   il testo viene sostituito con quello della lingua scelta.
//   Nel JavaScript si usa t("nav.bookNow").
//
// COME AGGIUNGERE UN TESTO
//   1. aggiungi una riga qui sotto con le tre lingue;
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

const I18N_LANGS = ["it", "en", "es"];
const I18N_DEFAULT = "en";           // lingua usata se il browser non è it/es
const I18N_STORAGE_KEY = "isla-lang";

const I18N_LANG_NAMES = {
  it: "Italiano",
  en: "English",
  es: "Español"
};

const I18N = {
  // ── generali ────────────────────────────────────────────────────────────
  "common.skip":        { it: "Vai al contenuto", en: "Skip to content", es: "Ir al contenido" },
  "common.close":       { it: "Chiudi", en: "Close", es: "Cerrar" },
  "common.search":      { it: "Cerca", en: "Search", es: "Buscar" },
  "common.homeAria":    { it: "Isla, vai alla home", en: "Isla, go to home", es: "Isla, ir al inicio" },
  "common.logoAlt":     { it: "Logo Isla", en: "Isla logo", es: "Logo de Isla" },
  "lang.label":         { it: "Lingua", en: "Language", es: "Idioma" },

  // ── barra in alto ───────────────────────────────────────────────────────
  "nav.aria":           { it: "Menu principale", en: "Main menu", es: "Menú principal" },
  "nav.home":           { it: "Home", en: "Home", es: "Inicio" },
  "nav.experiences":    { it: "Esperienze", en: "Experiences", es: "Experiencias" },
  "nav.bookNow":        { it: "Prenota ora", en: "Book now", es: "Reservar" },
  // Il pulsante in alto a destra apre la finestra del ticket (numero + telefono):
  // si chiamava "Prenota ora", ma prenotare si fa dalle schede (proprietario,
  // 30 settembre 2026).
  "nav.myBookings":     { it: "Le mie prenotazioni", en: "My bookings", es: "Mis reservas" },
  "nav.menu":           { it: "Menu", en: "Menu", es: "Menú" },

  // ── titoli delle pagine ─────────────────────────────────────────────────
  "meta.home.title":    { it: "Isla · La tua escursione a Tenerife", en: "Isla · Your excursion in Tenerife", es: "Isla · Tu excursión en Tenerife" },
  "meta.home.desc":     { it: "Isla — trova subito orario, punto d'incontro e informazioni della tua escursione a Tenerife.", en: "Isla — find the time, meeting point and details of your excursion in Tenerife straight away.", es: "Isla — encuentra al instante el horario, el punto de encuentro y la información de tu excursión en Tenerife." },
  "meta.catalog.title": { it: "Tutte le escursioni · Isla", en: "All excursions · Isla", es: "Todas las excursiones · Isla" },
  "meta.catalog.desc":  { it: "Tutte le escursioni, i tour e gli show di Isla a Tenerife: mare, Teide, parchi, avventura e molto altro.", en: "All of Isla's excursions, tours and shows in Tenerife: sea, Teide, parks, adventure and much more.", es: "Todas las excursiones, tours y espectáculos de Isla en Tenerife: mar, Teide, parques, aventura y mucho más." },
  "meta.packs.title":   { it: "I pacchetti · Isla", en: "Packages · Isla", es: "Los paquetes · Isla" },
  "meta.family.title":  { it: "In famiglia · Isla", en: "As a family · Isla", es: "En familia · Isla" },
  "meta.family.desc":   { it: "I pacchetti di Isla per chi viaggia coi bambini a Tenerife: tre escursioni insieme, col prezzo dei bambini scritto accanto a quello degli adulti.", en: "Isla's packages for families travelling with children in Tenerife: three excursions together, with the kids' price written next to the adults'.", es: "Los paquetes de Isla para quien viaja con niños en Tenerife: tres excursiones juntas, con el precio de los niños junto al de los adultos." },
  "meta.two.title":     { it: "Perfetto per 2 · Isla", en: "Perfect for two · Isla", es: "Perfecto para dos · Isla" },
  "meta.two.desc":      { it: "I pacchetti di Isla per le coppie a Tenerife: tre esperienze da fare in due, con lo sconto già tolto dal prezzo.", en: "Isla's packages for couples in Tenerife: three experiences to share, with the discount already taken off.", es: "Los paquetes de Isla para parejas en Tenerife: tres experiencias para dos, con el descuento ya aplicado." },
  "meta.days.title":    { it: "3, 5 o 7 giorni · Isla", en: "3, 5 or 7 days · Isla", es: "3, 5 o 7 días · Isla" },
  "meta.days.desc":     { it: "Gli itinerari di Isla a Tenerife da 3, 5 o 7 giorni: una escursione al giorno, con lo sconto già tolto dal prezzo.", en: "Isla's 3, 5 and 7-day itineraries in Tenerife: one excursion a day, with the discount already taken off.", es: "Los itinerarios de Isla en Tenerife de 3, 5 o 7 días: una excursión al día, con el descuento ya aplicado." },
  "meta.packs.desc":    { it: "I pacchetti di Isla a Tenerife: tre escursioni scelte insieme, con lo sconto già tolto dal prezzo.", en: "Isla's packages in Tenerife: three excursions picked to go together, with the discount already taken off.", es: "Los paquetes de Isla en Tenerife: tres excursiones elegidas para ir juntas, con el descuento ya aplicado." },
  "meta.pack.desc":     { it: "Un pacchetto di Isla a Tenerife: tre escursioni scelte insieme, con lo sconto già tolto dal prezzo.", en: "An Isla package in Tenerife: three excursions picked to go together, with the discount already taken off.", es: "Un paquete de Isla en Tenerife: tres excursiones elegidas para ir juntas, con el descuento ya aplicado." },
  "meta.rent.title":    { it: "Noleggio · Isla", en: "Rentals · Isla", es: "Alquiler · Isla" },
  "meta.rent.desc":     { it: "Noleggio auto, moto, scooter e bici a Tenerife con Isla: i prezzi al giorno e la richiesta su WhatsApp.", en: "Car, motorbike, scooter and bike rental in Tenerife with Isla: daily prices and your request on WhatsApp.", es: "Alquiler de coches, motos, scooters y bicis en Tenerife con Isla: los precios por día y la solicitud por WhatsApp." },
  "meta.booking.title": { it: "La tua prenotazione · Isla", en: "Your booking · Isla", es: "Tu reserva · Isla" },

  // ── hero ────────────────────────────────────────────────────────────────
  "hero.pause":         { it: "Metti in pausa il video", en: "Pause the video", es: "Pausar el vídeo" },
  "hero.play":          { it: "Riproduci il video", en: "Play the video", es: "Reproducir el vídeo" },

  // ── intro e bento ───────────────────────────────────────────────────────
  "intro.eyebrow":      { it: "Tenerife", en: "Tenerife", es: "Tenerife" },
  "intro.title":        { it: "Inizia la tua avventura con…", en: "Start your adventure with…", es: "Empieza tu aventura con…" },
  "bento.packages":     { it: "Pacchetti", en: "Packages", es: "Paquetes" },
  // Era "Con bambini" e portava all'elenco filtrato: adesso porta ai pacchetti
  // di famiglia. Il nome cambiato e' una scelta del proprietario (14 settembre
  // 2026): "In famiglia" parla a chi viaggia coi bambini, non ai bambini.
  "bento.family":       { it: "In famiglia", en: "As a family", es: "En familia" },
  // I due riquadri del 6 ottobre 2026 (proprietario). "Food Experience" porta
  // alle degustazioni una per una (escursioni.html?sel=food), "Perfetto per 2"
  // alla vetrina dei pacchetti per le coppie. "Food Experience" resta in
  // inglese nelle tre lingue, come "3/5/7 Days Experience".
  "bento.food":         { it: "Food Experience", en: "Food Experience", es: "Food Experience" },
  "bento.forTwo":       { it: "Perfetto per 2", en: "Perfect for two", es: "Perfecto para dos" },
  "bento.days":         { it: "3/5/7 Days Experience", en: "3/5/7 Days Experience", es: "3/5/7 Days Experience" },
  "bento.rental":       { it: "Noleggio auto, moto e bici", en: "Car, moto & bike rental", es: "Alquiler de coche, moto y bici" },
  "wa.rental":          { it: "Ciao Isla! Vorrei noleggiare un mezzo a Tenerife. Mi interessa: ", en: "Hi Isla! I'd like to rent a vehicle in Tenerife. I'm interested in: ", es: "¡Hola Isla! Quisiera alquilar un vehículo en Tenerife. Me interesa: " },
  "wa.rentItem":        { it: "Ciao Isla! Vorrei noleggiare: {mezzo}. Dal … al …", en: "Hi Isla! I'd like to rent: {mezzo}. From … to …", es: "¡Hola Isla! Quisiera alquilar: {mezzo}. Del … al …" },

  // ── pagina noleggio (noleggio.html) ─────────────────────────────────────
  "meta.map.title":     { it: "Scopri Tenerife · Isla", en: "Discover Tenerife · Isla", es: "Descubre Tenerife · Isla" },
  "meta.map.desc":      { it: "La mappa di Tenerife di Isla: spiagge, punti panoramici, posti segreti e cose da vedere, con la strada per arrivarci.", en: "Isla's map of Tenerife: beaches, viewpoints, secret spots and must-sees, with directions to get there.", es: "El mapa de Tenerife de Isla: playas, miradores, lugares secretos e imprescindibles, con la ruta para llegar." },
  "map.eyebrow":        { it: "La mappa", en: "The map", es: "El mapa" },
  "map.title":          { it: "Scopri Tenerife", en: "Discover Tenerife", es: "Descubre Tenerife" },
  "map.intro":          { it: "Spiagge, panorami, posti segreti e cose da vedere. Tocca un punto per leggere cos'è e farti portare lì.", en: "Beaches, viewpoints, secret spots and must-sees. Tap a spot to read about it and get directions.", es: "Playas, miradores, lugares secretos e imprescindibles. Toca un punto para leer qué es y cómo llegar." },
  "map.aria":           { it: "Mappa di Tenerife", en: "Map of Tenerife", es: "Mapa de Tenerife" },
  "map.filterAria":     { it: "Cosa mostrare", en: "What to show", es: "Qué mostrar" },
  "map.cat.all":        { it: "Tutto", en: "All", es: "Todo" },
  "map.cat.beach":      { it: "Spiagge", en: "Beaches", es: "Playas" },
  "map.cat.view":       { it: "Panorami", en: "Viewpoints", es: "Miradores" },
  "map.cat.secret":     { it: "Posti segreti", en: "Secret spots", es: "Lugares secretos" },
  "map.cat.sight":      { it: "Da vedere", en: "Must-see", es: "Imprescindibles" },
  "map.cat.food":       { it: "Ristoranti", en: "Restaurants", es: "Restaurantes" },
  "map.go":             { it: "Portami qui", en: "Take me there", es: "Llévame aquí" },
  "map.photoBy":        { it: "Foto:", en: "Photo:", es: "Foto:" },
  "map.example":        { it: "esempio", en: "example", es: "ejemplo" },
  "rent.eyebrow":       { it: "Tenerife su ruote", en: "Tenerife on wheels", es: "Tenerife sobre ruedas" },
  "rent.title":         { it: "Noleggio", en: "Rentals", es: "Alquiler" },
  "rent.intro":         { it: "Auto, moto, scooter e bici per girare l'isola coi tuoi tempi. Scegli il mezzo e mandaci la richiesta con le date: ti confermiamo disponibilità e ritiro entro 24 ore.", en: "Cars, motorbikes, scooters and bikes to explore the island at your own pace. Pick a vehicle and send us your request with the dates: we confirm availability and collection within 24 hours.", es: "Coches, motos, scooters y bicis para recorrer la isla a tu ritmo. Elige el vehículo y envíanos la solicitud con las fechas: te confirmamos disponibilidad y recogida en 24 horas." },
  "rent.navAria":       { it: "Tipo di mezzo", en: "Vehicle type", es: "Tipo de vehículo" },
  "rent.cars":          { it: "Auto", en: "Cars", es: "Coches" },
  "rent.motos":         { it: "Moto e scooter", en: "Motorbikes & scooters", es: "Motos y scooters" },
  "rent.carsNote":      { it: "A luglio, agosto, dicembre e gennaio i prezzi salgono di €5 al giorno.", en: "In July, August, December and January prices go up by €5 a day.", es: "En julio, agosto, diciembre y enero los precios suben 5 € al día." },
  "rent.motosNote":     { it: "Sempre compresi: assicurazione, casco, lucchetto e chilometri illimitati.", en: "Always included: insurance, helmet, lock and unlimited mileage.", es: "Siempre incluidos: seguro, casco, candado y kilómetros ilimitados." },
  "rent.d12":           { it: "1-2 giorni", en: "1-2 days", es: "1-2 días" },
  "rent.d36":           { it: "3-6 giorni", en: "3-6 days", es: "3-6 días" },
  "rent.d7":            { it: "7 giorni o più", en: "7 days or more", es: "7 días o más" },
  "rent.day1":          { it: "1 giorno", en: "1 day", es: "1 día" },
  "rent.dayN":          { it: "{n} giorni", en: "{n} days", es: "{n} días" },
  "rent.dayExtra":      { it: "dall'{n}° giorno, ogni giorno", en: "from day {n}, each day", es: "desde el día {n}, cada día" },
  "rent.perDayShort":   { it: "al giorno", en: "per day", es: "al día" },
  "rent.unitDay":       { it: "prezzo al giorno", en: "price per day", es: "precio por día" },
  "rent.unitTotal":     { it: "prezzo per tutto il periodo", en: "price for the whole period", es: "precio por todo el periodo" },
  "rent.seats":         { it: "{n} posti", en: "{n} seats", es: "{n} plazas" },
  "rent.request":       { it: "Richiedi su WhatsApp", en: "Request on WhatsApp", es: "Solicitar por WhatsApp" },
  "rent.otherText":     { it: "Cerchi un altro mezzo? Scrivici e lo cerchiamo noi.", en: "Looking for another vehicle? Write to us and we'll find it.", es: "¿Buscas otro vehículo? Escríbenos y lo buscamos nosotros." },
  "rent.otherBtn":      { it: "Scrivici su WhatsApp", en: "Write to us on WhatsApp", es: "Escríbenos por WhatsApp" },
  "rent.kind.auto":     { it: "cambio automatico", en: "automatic", es: "cambio automático" },
  "rent.kind.van":      { it: "furgone", en: "van", es: "furgoneta" },
  "rent.kind.scooter125": { it: "Scooter 50/125 cc", en: "Scooter 50/125 cc", es: "Scooter 50/125 cc" },
  "rent.kind.scooter300": { it: "Maxi scooter 300 cc", en: "Maxi scooter 300 cc", es: "Maxi scooter 300 cc" },
  "rent.kind.scooter400": { it: "Maxi scooter 400 cc", en: "Maxi scooter 400 cc", es: "Maxi scooter 400 cc" },
  "rent.kind.gear125":  { it: "Moto 125 cc con le marce", en: "125 cc geared motorbike", es: "Moto 125 cc con marchas" },
  "rent.kind.moto500":  { it: "Moto 500 cc", en: "500 cc motorbike", es: "Moto 500 cc" },
  "rent.kind.moto750":  { it: "Moto 750 cc", en: "750 cc motorbike", es: "Moto 750 cc" },
  "rent.kind.moto800":  { it: "Moto 800 cc", en: "800 cc motorbike", es: "Moto 800 cc" },
  "rent.lic.B3":        { it: "Patente B da almeno 3 anni", en: "Car licence held for at least 3 years", es: "Carnet B con al menos 3 años de antigüedad" },
  "rent.lic.A2":        { it: "Patente A2 o A", en: "A2 or A licence", es: "Carnet A2 o A" },
  "rent.lic.A":         { it: "Patente A", en: "A licence", es: "Carnet A" },
  "rent.bikes":         { it: "Bici", en: "Bikes", es: "Bicis" },
  "rent.bikesNote":     { it: "La bici te la portiamo all'alloggio, nel sud dell'isola, e la veniamo a riprendere; lucchetto e assistenza sono compresi. Nel messaggio scrivi altezza ed età di chi pedala.", en: "We bring the bike to where you're staying in the south of the island and pick it up again; lock and assistance are included. In your message, tell us the rider's height and age.", es: "Te llevamos la bici a tu alojamiento en el sur de la isla y pasamos a recogerla; candado y asistencia incluidos. En el mensaje indica la altura y la edad de quien va a pedalear." },
  "rent.bike.city":     { it: "Bici da città", en: "City bike", es: "Bici urbana" },
  "rent.bike.mtb":      { it: "Mountain bike", en: "Mountain bike", es: "Bicicleta de montaña" },
  "rent.bike.ecity":    { it: "Bici elettrica da città", en: "Electric city bike", es: "Bici eléctrica urbana" },
  "rent.bike.emtb":     { it: "Mountain bike elettrica", en: "Electric mountain bike", es: "Bicicleta de montaña eléctrica" },
  "rent.kind.basket":   { it: "con cestino", en: "with basket", es: "con cesta" },
  "rent.kind.trek":     { it: "Trek Marlin", en: "Trek Marlin", es: "Trek Marlin" },
  "rent.kind.bosch500": { it: "motore Bosch, batteria 500 Wh", en: "Bosch motor, 500 Wh battery", es: "motor Bosch, batería de 500 Wh" },
  "rent.kind.bosch":    { it: "motore Bosch", en: "Bosch motor", es: "motor Bosch" },
  "rent.bike.charger":  { it: "Da 2 giorni in su c'è anche il caricabatterie, per ricaricarla la notte.", en: "From 2 days up the charger comes too, so you can recharge it overnight.", es: "A partir de 2 días también va el cargador, para recargarla por la noche." },
  "rent.deposit":       { it: "Cauzione: €{n}, si paga alla consegna della bici", en: "Deposit: €{n}, paid when the bike is delivered", es: "Fianza: {n} €, se paga al entregar la bici" },

  // ── categorie ───────────────────────────────────────────────────────────
  "categories.eyebrow": { it: "Esplora", en: "Explore", es: "Explora" },
  "categories.title":   { it: "Categorie", en: "Categories", es: "Categorías" },
  "categories.altSuffix": { it: "a Tenerife", en: "in Tenerife", es: "en Tenerife" },

  // ── posti segreti ───────────────────────────────────────────────────────
  "secret.eyebrow":     { it: "Posti segreti", en: "Secret spots", es: "Lugares secretos" },
  "secret.title":       { it: "Dove non arrivano i pullman", en: "Where the coaches don't go", es: "Donde no llegan los autobuses" },
  "secret.text":        { it: "Cale di sabbia nera, piscine naturali e punti panoramici che i pullman turistici non raggiungono. Fanno parte di Tenerife tanto quanto le grandi attrazioni.", en: "Black-sand coves, natural pools and viewpoints the tour coaches never reach. They are as much a part of Tenerife as the big attractions.", es: "Calas de arena negra, piscinas naturales y miradores a los que no llegan los autobuses turísticos. Forman parte de Tenerife tanto como las grandes atracciones." },
  "secret.cta":         { it: "Scoprili sulla mappa", en: "Find them on the map", es: "Descúbrelos en el mapa" },
  "secret.alt":         { it: "Cala segreta a Tenerife", en: "Secret cove in Tenerife", es: "Cala secreta en Tenerife" },

  // ── chi siamo ───────────────────────────────────────────────────────────
  "about.eyebrow":      { it: "Chi siamo", en: "About us", es: "Quiénes somos" },
  "about.title":        { it: "Siamo Jack e Francesca", en: "We are Jack and Francesca", es: "Somos Jack y Francesca" },
  "about.p1":           { it: "Una coppia, due genitori, una famiglia. Da poco la nostra vita si è arricchita con l'arrivo della nostra bambina, il nostro piccolo grande motivo per guardare avanti e costruire qualcosa di nostro.", en: "A couple, two parents, a family. Our life has recently grown richer with the arrival of our baby girl, our little big reason to look ahead and build something of our own.", es: "Una pareja, dos padres, una familia. Hace poco nuestra vida se ha llenado con la llegada de nuestra niña, nuestro pequeño gran motivo para mirar hacia delante y construir algo nuestro." },
  "about.p2":           { it: "Dal 2018 lavoriamo nel mondo delle escursioni a Tenerife. In questi anni abbiamo imparato che le vacanze più belle nascono dai consigli giusti, dati da persone di cui ti fidi. Da qui nasce Isla.", en: "Since 2018 we have worked in the world of excursions in Tenerife. Over these years we have learned that the best holidays come from the right advice, given by people you trust. That is how Isla was born.", es: "Desde 2018 trabajamos en el mundo de las excursiones en Tenerife. En estos años hemos aprendido que las mejores vacaciones nacen de los consejos adecuados, dados por personas en las que confías. Así nace Isla." },
  "about.p3":           { it: "Isla è la vostra guida per vivere Tenerife davvero: escursioni, attività e spettacoli serali in un'unica app, sempre a portata di mano. Niente ricerche infinite: scegliete, chiedeteci e pensate solo a godervi la vacanza.", en: "Isla is your guide to truly living Tenerife: excursions, activities and evening shows in one app, always at hand. No endless searching: choose, ask us and just think about enjoying your holiday.", es: "Isla es vuestra guía para vivir Tenerife de verdad: excursiones, actividades y espectáculos nocturnos en una sola app, siempre a mano. Nada de búsquedas interminables: elegid, preguntadnos y pensad solo en disfrutar de las vacaciones." },
  "about.alt":          { it: "Il team di Isla a Tenerife", en: "The Isla team in Tenerife", es: "El equipo de Isla en Tenerife" },

  // ── FAQ ─────────────────────────────────────────────────────────────────
  "faq.eyebrow":        { it: "FAQ", en: "FAQ", es: "FAQ" },
  "faq.title":          { it: "Domande frequenti", en: "Frequently asked questions", es: "Preguntas frecuentes" },
  "faq.q1":             { it: "Come prenoto un'escursione?", en: "How do I book an excursion?", es: "¿Cómo reservo una excursión?" },
  "faq.a1":             { it: "Scegli l'esperienza dal catalogo e premi \"Richiedi disponibilità\": indichi data e numero di persone, e la richiesta ci arriva su WhatsApp. Verifichiamo i posti e ti confermiamo.", en: "Pick the experience from the catalogue and tap \"Check availability\": you enter the date and number of people, and the request reaches us on WhatsApp. We check the places and confirm.", es: "Elige la experiencia del catálogo y pulsa \"Consultar disponibilidad\": indicas la fecha y el número de personas, y la solicitud nos llega por WhatsApp. Comprobamos las plazas y te confirmamos." },
  "faq.q2":             { it: "Quanto tempo prima devo richiedere?", en: "How far in advance should I ask?", es: "¿Con cuánta antelación debo solicitarla?" },
  "faq.a2":             { it: "Almeno 24 ore prima della data dell'escursione. Ti rispondiamo entro 24 ore con la conferma e i dettagli.", en: "At least 24 hours before the date of the excursion. We reply within 24 hours with the confirmation and the details.", es: "Al menos 24 horas antes de la fecha de la excursión. Te respondemos en 24 horas con la confirmación y los detalles." },
  "faq.q3":             { it: "La richiesta è già una prenotazione?", en: "Is the request already a booking?", es: "¿La solicitud ya es una reserva?" },
  "faq.a3":             { it: "No. La richiesta serve a verificare che ci sia posto: la prenotazione è confermata solo quando ricevi la nostra conferma.", en: "No. The request is there to check availability: the booking is confirmed only when you receive our confirmation.", es: "No. La solicitud sirve para comprobar que hay plazas: la reserva se confirma solo cuando recibes nuestra confirmación." },
  "faq.q4":             { it: "Come si paga?", en: "How do I pay?", es: "¿Cómo se paga?" },
  "faq.a4":             { it: "Al momento della conferma ti indichiamo come saldare. Non ti viene chiesto nulla al momento della richiesta.", en: "When we confirm, we tell you how to pay. Nothing is asked of you when you send the request.", es: "En el momento de la confirmación te indicamos cómo pagar. No se te pide nada al enviar la solicitud." },
  "faq.q5":             { it: "Posso annullare?", en: "Can I cancel?", es: "¿Puedo cancelar?" },
  // Politica di cancellazione decisa dal proprietario il 6 ottobre 2026 e
  // corretta lo stesso giorno: fino a 24 ore prima si annulla gratis oppure si
  // sposta la data (una volta sola, se c'e' posto); meno di 24 ore prima non si
  // annulla e non si sposta piu'. Vale anche per charter e noleggi.
  // Come le 24 ore di req.hint, e' la regola di Isla: non si cambia dopo aver
  // letto quella di un fornitore. I giorni entro cui si rimborsa non sono
  // ancora decisi, per questo il testo non li dice.
  "faq.a5":             { it: "Sì: fino a 24 ore prima dell'escursione puoi annullare gratis oppure spostarla a un'altra data, una volta sola e se c'è posto. Basta un messaggio su WhatsApp, e conta l'ora del messaggio. Meno di 24 ore prima, o se non ti presenti, non si può più annullare né spostare, e il prezzo non si rimborsa. Vale anche per i charter privati e i noleggi. Se invece ad annullare è l'operatore, per il maltempo, il mare mosso o troppo pochi partecipanti, scegli tu: un'altra data o il rimborso completo. Il rimborso arriva con lo stesso mezzo con cui hai pagato.", en: "Yes: up to 24 hours before the excursion you can cancel free of charge or move it to another date, once only and if there is space. Just send us a WhatsApp message, and the time of the message is what counts. Less than 24 hours before, or if you don't show up, it can no longer be cancelled or moved, and the price is not refunded. This also applies to private charters and rentals. If it's the operator who cancels, because of bad weather, rough sea or too few participants, you choose: another date or a full refund. Refunds are made the same way you paid.", es: "Sí: hasta 24 horas antes de la excursión puedes cancelar gratis o cambiarla a otra fecha, una sola vez y si hay plazas. Basta un mensaje por WhatsApp, y cuenta la hora del mensaje. Con menos de 24 horas, o si no te presentas, ya no se puede cancelar ni cambiar, y el precio no se reembolsa. Vale también para los chárter privados y los alquileres. Si quien cancela es el operador, por mal tiempo, mar agitado o pocos participantes, eliges tú: otra fecha o el reembolso completo. El reembolso se hace con el mismo medio con el que pagaste." },
  "faq.q6":             { it: "Funziona anche senza connessione?", en: "Does it work without a connection?", es: "¿Funciona sin conexión?" },
  "faq.a6":             { it: "Sì. Isla è un'app installabile: una volta aperta la prima volta, le informazioni restano disponibili anche offline, utile quando sei in giro per l'isola.", en: "Yes. Isla is an installable app: once you've opened it the first time, the information stays available offline — handy while you're out around the island.", es: "Sí. Isla es una app instalable: una vez abierta la primera vez, la información sigue disponible sin conexión, útil cuando estás recorriendo la isla." },

  // ── menu laterale ───────────────────────────────────────────────────────
  "menu.aria":          { it: "Menu", en: "Menu", es: "Menú" },
  "menu.sections":      { it: "Sezioni", en: "Sections", es: "Secciones" },
  "menu.close":         { it: "Chiudi menu", en: "Close menu", es: "Cerrar menú" },
  "menu.install":       { it: "Installa l'app", en: "Install the app", es: "Instalar la app" },
  "menu.excursions":    { it: "Escursioni", en: "Excursions", es: "Excursiones" },
  "menu.packages":      { it: "Pacchetti", en: "Packages", es: "Paquetes" },
  "menu.map":           { it: "Scopri Tenerife", en: "Discover Tenerife", es: "Descubre Tenerife" },
  "menu.secret":        { it: "Posti segreti", en: "Secret spots", es: "Lugares secretos" },
  "menu.about":         { it: "Chi siamo", en: "About us", es: "Quiénes somos" },
  "menu.cta":           { it: "Prenota ora", en: "Book now", es: "Reservar" },

  // ── finestra del ticket (numero + telefono del ticket di carta) ──────────
  "ticket.title":       { it: "Il tuo ticket", en: "Your ticket", es: "Tu ticket" },
  "ticket.codeLabel":   { it: "Numero del ticket", en: "Ticket number", es: "Número del ticket" },
  "ticket.placeholder": { it: "Es. 2213", en: "E.g. 2213", es: "Ej. 2213" },
  "ticket.phoneLabel":  { it: "Telefono scritto sul ticket", en: "Phone number on the ticket", es: "Teléfono escrito en el ticket" },
  "ticket.prefix":      { it: "Prefisso", en: "Country code", es: "Prefijo" },
  "ticket.otherPrefix": { it: "Altro: +…", en: "Other: +…", es: "Otro: +…" },
  "ticket.phoneInvalid":{ it: "Il telefono non sembra giusto: controlla il prefisso e le cifre.", en: "That phone number doesn't look right: check the country code and the digits.", es: "El teléfono no parece correcto: revisa el prefijo y las cifras." },
  "ticket.hint":        { it: "Il numero è stampato in rosso sul ticket che ti abbiamo dato.", en: "The number is printed in red on the ticket we gave you.", es: "El número está impreso en rojo en el ticket que te dimos." },

  // ── piè di pagina ───────────────────────────────────────────────────────
  "footer.findCode":    { it: "Cerca il tuo codice", en: "Find your code", es: "Busca tu código" },
  "footer.operator":    { it: "Isla è un servizio di <strong>Admiral Travel Agencia de Viajes SL</strong>", en: "Isla is a service of <strong>Admiral Travel Agencia de Viajes SL</strong>", es: "Isla es un servicio de <strong>Admiral Travel Agencia de Viajes SL</strong>" },
  "footer.privacy":     { it: "Privacy", en: "Privacy", es: "Privacidad" },
  "footer.terms":       { it: "Termini di vendita", en: "Terms of sale", es: "Condiciones de venta" },
  "terms.title":        { it: "Termini di vendita · Isla", en: "Terms of sale · Isla", es: "Condiciones de venta · Isla" },
  "terms.desc":         { it: "Come si richiede, si paga, si annulla e si sposta un'escursione con Isla.", en: "How to request, pay for, cancel and change an excursion with Isla.", es: "Cómo se solicita, se paga, se cancela y se cambia una excursión con Isla." },
  "privacy.title":      { it: "Privacy · Isla", en: "Privacy · Isla", es: "Privacidad · Isla" },
  "privacy.desc":       { it: "Come Isla e Admiral Travel trattano i tuoi dati.", en: "How Isla and Admiral Travel handle your data.", es: "Cómo tratan tus datos Isla y Admiral Travel." },
  "footer.copy":        { it: "© Isla · Escursioni a Tenerife", en: "© Isla · Tenerife excursions", es: "© Isla · Excursiones en Tenerife" },

  // ── pagina catalogo ─────────────────────────────────────────────────────
  "catalog.eyebrow":    { it: "Esplora", en: "Explore", es: "Explora" },
  "catalog.title":      { it: "Tutte le escursioni", en: "All excursions", es: "Todas las excursiones" },
  "catalog.searchLabel":       { it: "Cerca un'escursione", en: "Search for an excursion", es: "Busca una excursión" },
  "catalog.searchPlaceholder": { it: "Cerca: barca, Teide, quad…", en: "Search: boat, Teide, quad…", es: "Busca: barco, Teide, quad…" },
  "catalog.filterAria": { it: "Filtra per categoria", en: "Filter by category", es: "Filtrar por categoría" },
  "catalog.recommended":      { it: "Raccomandate", en: "Recommended", es: "Recomendadas" },
  "catalog.foodTitle":  { it: "Food Experience", en: "Food Experience", es: "Food Experience" },
  "catalog.recommendedTitle": { it: "Le nostre raccomandate", en: "Our recommendations", es: "Nuestras recomendadas" },
  "catalog.all":        { it: "Tutte le escursioni", en: "All excursions", es: "Todas las excursiones" },
  "catalog.countAll":   { it: "{n} attività disponibili", en: "{n} activities available", es: "{n} actividades disponibles" },
  "catalog.countSome":  { it: "{n} di {total} attività", en: "{n} of {total} activities", es: "{n} de {total} actividades" },
  "catalog.emptyTitle": { it: "Nessun risultato", en: "No results", es: "Sin resultados" },
  "catalog.emptyText":  { it: "Prova a cambiare categoria o a cercare un'altra parola.", en: "Try another category, or search for a different word.", es: "Prueba con otra categoría o busca otra palabra." },
  "catalog.filters":    { it: "Filtri", en: "Filters", es: "Filtros" },
  "catalog.filterZone": { it: "Zona", en: "Area", es: "Zona" },
  "catalog.filterDuration": { it: "Durata", en: "Duration", es: "Duración" },
  "catalog.filterReset": { it: "Togli i filtri", en: "Clear filters", es: "Quitar filtros" },
  "catalog.emptyFilters": { it: "Nessuna attività con questi filtri. Prova a toglierne uno.", en: "No activities match these filters. Try removing one.", es: "Ninguna actividad con estos filtros. Prueba a quitar uno." },
  "catalog.prepTitle":  { it: "Catalogo in preparazione", en: "Catalogue coming soon", es: "Catálogo en preparación" },
  "catalog.prepText":   { it: "Nessuna attività è ancora pubblicata.", en: "No activity has been published yet.", es: "Todavía no hay ninguna actividad publicada." },

  // ── schede attività ─────────────────────────────────────────────────────
  "tour.onRequest":     { it: "Su richiesta", en: "On request", es: "Bajo petición" },
  "tour.from":          { it: "da €{p}", en: "from €{p}", es: "desde €{p}" },
  "tour.offer":         { it: "Offerta", en: "Offer", es: "Oferta" },
  "tour.family":        { it: "Adatta ai bambini", en: "Kid-friendly", es: "Apta para niños" },
  "tour.transfer":      { it: "Transfer disponibile", en: "Transfer available", es: "Traslado disponible" },
  "tour.ask":           { it: "Richiedi disponibilità", en: "Check availability", es: "Consultar disponibilidad" },
  "tour.details":       { it: "Scopri di più", en: "See details", es: "Ver detalles" },
  "tour.photoSoon":     { it: "Foto in arrivo", en: "Photo coming soon", es: "Foto próximamente" },

  // ── pagina di dettaglio di una singola escursione ───────────────────────
  "detail.back":        { it: "Tutte le escursioni", en: "All excursions", es: "Todas las excursiones" },
  "detail.zoom":        { it: "Ingrandisci la foto", en: "Enlarge the photo", es: "Ampliar la foto" },
  "detail.photo":       { it: "Foto {n}", en: "Photo {n}", es: "Foto {n}" },
  "detail.summary":     { it: "In breve", en: "At a glance", es: "En resumen" },
  "detail.departure":   { it: "Punto di partenza", en: "Departure point", es: "Punto de salida" },
  "detail.duration":    { it: "Durata", en: "Duration", es: "Duración" },
  // Ripiego per la riga di `activityDuration` quando la scheda non scrive il
  // suo `activityLabel`. Generica apposta: la parola giusta ("Tempo di
  // cammino", "Tempo in acqua") la sa solo la scheda.
  "detail.chosen":      { it: "Scelto: {v}", en: "Selected: {v}", es: "Elegido: {v}" },
  "detail.activity":    { it: "Durata dell'attività", en: "Activity time", es: "Duración de la actividad" },
  "detail.price":       { it: "Prezzo", en: "Price", es: "Precio" },
  "detail.offer":       { it: "Offerta", en: "Offer", es: "Oferta" },
  "detail.offerUntil":  { it: "Valida fino al {d}", en: "Valid until {d}", es: "Válida hasta el {d}" },
  "detail.suitable":    { it: "Adatta a", en: "Suitable for", es: "Apta para" },
  "detail.season":      { it: "Periodo", en: "Season", es: "Temporada" },
  "detail.infants":     { it: "Neonati", en: "Infants", es: "Bebés" },
  "detail.included":    { it: "Cosa è incluso", en: "What's included", es: "Qué incluye" },
  "detail.itinerary":   { it: "Come si svolge", en: "How the day goes", es: "Cómo se desarrolla" },
  "detail.notes":       { it: "Consigli", en: "Tips", es: "Consejos" },

  // ── cosa e' incluso: le parole chiave del campo `included` ──────────────
  "inc.snorkel":        { it: "Attrezzatura da snorkeling", en: "Snorkelling gear", es: "Equipo de snorkel" },
  "inc.wetsuit":        { it: "Muta", en: "Wetsuit", es: "Neopreno" },
  "inc.board":          { it: "Tavola", en: "Board", es: "Tabla" },
  "inc.equipment":      { it: "Attrezzatura", en: "Equipment", es: "Equipo" },
  "inc.drinks":         { it: "Bevande incluse", en: "Drinks included", es: "Bebidas incluidas" },
  "inc.snack":          { it: "Snack", en: "Snacks", es: "Snacks" },
  "inc.fingerfood":     { it: "Finger food", en: "Finger food", es: "Finger food" },
  "inc.swimstop":       { it: "Bagno e snorkeling", en: "Swim & snorkel", es: "Baño y snorkel" },
  // Generico apposta: la stessa icona sta su sei gite in barca (dove il pasto
  // e' davvero un pranzo) e su tre cene-spettacolo, dove "Pranzo" era proprio
  // sbagliato. Stesso motivo per cui "Bevande a bordo" e' diventato "Bevande
  // incluse" quando l'icona e' finita su un parco.
  "inc.lunch":          { it: "Pasto incluso", en: "Meal included", es: "Comida incluida" },
  "inc.tasting":        { it: "Degustazione", en: "Tasting", es: "Degustación" },
  "inc.guide":          { it: "Guida", en: "Guide", es: "Guía" },
  "inc.transfer":       { it: "Transfer", en: "Transfer", es: "Traslado" },
  "inc.ferry":          { it: "Traghetto", en: "Ferry", es: "Barco" },
  "inc.ticket":         { it: "Ingressi", en: "Entrance tickets", es: "Entradas" },
  "inc.photos":         { it: "Foto", en: "Photos", es: "Fotos" },
  "inc.lifejacket":     { it: "Giubbotti di salvataggio", en: "Life jackets", es: "Chalecos salvavidas" },
  "inc.speaker":        { it: "Cassa Bluetooth", en: "Bluetooth speaker", es: "Altavoz Bluetooth" },
  "inc.towels":         { it: "Asciugamani", en: "Towels", es: "Toallas" },
  "inc.cooler":         { it: "Borsa frigo", en: "Cooler box", es: "Nevera portátil" },
  "inc.fuel":           { it: "Carburante", en: "Fuel", es: "Combustible" },
  "inc.insurance":      { it: "Assicurazione", en: "Insurance", es: "Seguro" },
  // ── la lista delle richieste ────────────────────────────────────────────
  "lista.title":        { it: "La tua lista", en: "Your list", es: "Tu lista" },
  "lista.added":        { it: "Aggiunta alla tua lista", en: "Added to your list", es: "Añadida a tu lista" },
  "lista.none":         { it: "La tua lista è vuota. Apri un'escursione e tocca «Aggiungi alla lista»: qui le ritrovi tutte, e le chiedi con un solo messaggio.", en: "Your list is empty. Open an excursion and tap “Add to list”: you'll find them all here, and ask for them in a single message.", es: "Tu lista está vacía. Abre una excursión y toca «Añadir a la lista»: aquí las encuentras todas, y las pides con un solo mensaje." },
  "lista.empty":        { it: "Non c'è più niente nella lista.", en: "There is nothing left in the list.", es: "Ya no queda nada en la lista." },
  "lista.remove":       { it: "Togli dalla lista", en: "Remove from the list", es: "Quitar de la lista" },
  "lista.clear":        { it: "Svuota la lista", en: "Empty the list", es: "Vaciar la lista" },
  "lista.full":         { it: "Nella lista ci stanno al massimo {n} escursioni. Mandaci questa richiesta e poi ne inizi un'altra.", en: "The list holds at most {n} excursions. Send this request and then start another one.", es: "En la lista caben como máximo {n} excursiones. Envíanos esta solicitud y luego empiezas otra." },
  "lista.hint":         { it: "Parte un solo messaggio con tutte le escursioni della lista.", en: "One single message goes out with every excursion in the list.", es: "Se envía un solo mensaje con todas las excursiones de la lista." },

  // ── i pacchetti ─────────────────────────────────────────────────────────
  "packs.eyebrow":      { it: "Scelti per te", en: "Picked for you", es: "Elegidos para ti" },
  "packs.title":        { it: "I pacchetti", en: "Packages", es: "Los paquetes" },
  "packs.intro":        { it: "Tre escursioni che stanno bene insieme, con lo sconto già tolto dal prezzo. Si prendono intere: una richiesta sola, e i giorni li mettiamo d'accordo insieme.", en: "Three excursions that go well together, with the discount already taken off. You take them as a whole: one single request, and we agree the days together.", es: "Tres excursiones que van bien juntas, con el descuento ya aplicado. Se toman enteras: una sola solicitud, y los días los acordamos juntos." },
  "packs.familyEyebrow": { it: "Con i bambini", en: "With the kids", es: "Con los niños" },
  "packs.familyTitle":  { it: "In famiglia", en: "As a family", es: "En familia" },
  "packs.familyIntro":  { it: "Pacchetti per chi viaggia coi bambini: tre escursioni dove i piccoli hanno il loro prezzo, con lo sconto già tolto. Si prendono interi: una richiesta sola, e i giorni li mettiamo d'accordo insieme.", en: "Packages for families travelling with children: three excursions where the little ones have their own price, with the discount already taken off. You take them as a whole: one single request, and we agree the days together.", es: "Paquetes para quien viaja con niños: tres excursiones donde los pequeños tienen su propio precio, con el descuento ya aplicado. Se toman enteros: una sola solicitud, y los días los acordamos juntos." },
  "packs.twoEyebrow":   { it: "In coppia", en: "As a couple", es: "En pareja" },
  "packs.twoTitle":     { it: "Perfetto per 2", en: "Perfect for two", es: "Perfecto para dos" },
  "packs.twoIntro":     { it: "Pacchetti pensati per chi viaggia in due, con lo sconto già tolto. Il prezzo è a persona. Si prendono interi: una richiesta sola, e i giorni li mettiamo d'accordo insieme.", en: "Packages made for those travelling as a pair, with the discount already taken off. The price is per person. You take them as a whole: one single request, and we agree the days together.", es: "Paquetes pensados para quien viaja en pareja, con el descuento ya aplicado. El precio es por persona. Se toman enteros: una sola solicitud, y los días los acordamos juntos." },
  "packs.familyAll":    { it: "Tutte le escursioni adatte ai bambini", en: "All the kid-friendly excursions", es: "Todas las excursiones aptas para niños" },
  "pack.eyebrow":       { it: "Pacchetto", en: "Package", es: "Paquete" },
  "pack.ask":           { it: "Richiedi il pacchetto", en: "Request the package", es: "Solicitar el paquete" },
  "pack.oneRequest":    { it: "Il pacchetto si chiede intero, con una richiesta sola: i tre giorni li mettiamo d'accordo insieme quando ti rispondiamo.", en: "The package is requested as a whole, in a single request: we agree the three days together when we reply.", es: "El paquete se solicita entero, con una sola solicitud: los tres días los acordamos juntos cuando te respondemos." },
  "pack.askHint":       { it: "Le richieste vanno fatte con almeno 24 ore di anticipo. Ti rispondiamo entro 24 ore con la conferma e i giorni.", en: "Requests need at least 24 hours' notice. We reply within 24 hours with the confirmation and the days.", es: "Las solicitudes se hacen con al menos 24 horas de antelación. Te respondemos en 24 horas con la confirmación y los días." },
  "pack.fromDay":       { it: "Da che giorno", en: "Starting from", es: "A partir de qué día" },
  "pack.fromDayHint":   { it: "Il primo dei tre giorni, indicativo: gli altri due li mettiamo d'accordo quando ti rispondiamo.", en: "The first of the three days, roughly: we agree the other two when we reply.", es: "El primero de los tres días, orientativo: los otros dos los acordamos cuando te respondemos." },
  "pack.hotelPlaceholder": { it: "Nome dell'hotel", en: "Hotel name", es: "Nombre del hotel" },
  // Il totale che non si fa. Prima diceva "c'è un mezzo che si paga a buggy o
  // a moto d'acqua": adesso i mezzi si contano nella finestra e quello non è
  // più il motivo. Restano i due casi veri — un prezzo che non si riesce a
  // leggere, o dei bambini su un'escursione che il prezzo dei bambini non ce
  // l'ha — e il testo non prova più a indovinare quale dei due è.
  "pack.noTotal":       { it: "Il totale non si può fare da qui: di qualcosa qui dentro non abbiamo un prezzo da sommare senza inventarlo. Te lo diciamo noi rispondendo.", en: "We can't total this up here: for something inside we don't have a price we could add without making it up. We'll tell you when we reply.", es: "El total no se puede hacer aquí: de algo de lo que hay dentro no tenemos un precio que sumar sin inventarlo. Te lo decimos al responderte." },
  "pack.unitsIntro":    { it: "Il mezzo si paga tutto intero, chiunque ci salga: i bambini non aggiungono niente. Le altre escursioni del pacchetto si pagano a testa.", en: "A vehicle is paid for whole, whoever rides it: children add nothing. The other excursions in the package are priced per person.", es: "El vehículo se paga entero, suba quien suba: los niños no añaden nada. Las demás excursiones del paquete se pagan por persona." },
  "pack.unitsEmpty":    { it: "Scegli quanti mezzi: il totale si fa quando l'hai deciso.", en: "Choose how many vehicles: the total appears once you have.", es: "Elige cuántos vehículos: el total se hace cuando lo hayas decidido." },
  // I posti e le persone scritti come due etichette e non in una frase ("{n}
  // posti") apposta: con un mezzo solo verrebbe "1 posti", e le tre lingue non
  // fanno il plurale allo stesso modo. E' la stessa ragione per cui il conto
  // dei menu scrive "Vegetariano × 2" invece di provare a pluralizzare.
  //
  // Sono due chiavi e non una perche' i mezzi corti possono essere due (il
  // buggy **e** la moto d'acqua): con una chiave sola la frase "va bene se non
  // salite tutti" si sarebbe ripetuta identica due volte di fila.
  "pack.unitsSeats":    { it: "{name}: posti scelti {n}", en: "{name}: seats chosen {n}", es: "{name}: plazas elegidas {n}" },
  "pack.unitsSeatsNote": { it: "Siete in {p}. Va bene se non salite tutti, se no aggiungi un mezzo.", en: "You are {p}. Fine if not everyone is going, otherwise add one.", es: "Sois {p}. Está bien si no subís todos, si no añade uno." },
  "pack.notFound":      { it: "Pacchetto non trovato", en: "Package not found", es: "Paquete no encontrado" },
  "pack.notFoundText":  { it: "Questo indirizzo non corrisponde a nessun pacchetto. Forse è stato tolto.", en: "This address doesn't match any package. It may have been removed.", es: "Esta dirección no corresponde a ningún paquete. Puede que se haya retirado." },
  "pack.seeAll":        { it: "Vedi tutti i pacchetti", en: "See all the packages", es: "Ver todos los paquetes" },
  "pack.perPerson":     { it: "a persona", en: "per person", es: "por persona" },
  "pack.save":          { it: "Risparmi €{n}", en: "You save €{n}", es: "Ahorras €{n}" },
  "pack.noPrice":       { it: "Prezzo su richiesta", en: "Price on request", es: "Precio a consultar" },
  "pack.unitNote":      { it: "Qui dentro c'è un mezzo che si paga a buggy o a moto d'acqua, non a testa: questo è il prezzo a persona quando il mezzo si divide fra tutti i posti che ha. Se siete di meno, a testa si paga di più — il totale vero lo fai nella richiesta, scegliendo quanti mezzi.", en: "This one includes a vehicle priced per buggy or per jet ski, not per head: this is the price per person when the vehicle is shared across all its seats. With fewer of you it comes to more each — the real total is worked out in the request, once you choose how many vehicles.", es: "Aquí hay un vehículo que se paga por buggy o por moto de agua, no por persona: este es el precio por persona cuando el vehículo se reparte entre todas sus plazas. Si sois menos, sale más por cabeza — el total real se hace en la solicitud, al elegir cuántos vehículos." },
  "pack.priceAdults":   { it: "€{n} adulti", en: "€{n} adults", es: "€{n} adultos" },
  "pack.priceChildren": { it: "€{n} bambini", en: "€{n} kids", es: "€{n} niños" },
  "pack.familyTotal":   { it: "Famiglia tipo, 2 adulti e 2 bambini: €{n} in tutto", en: "A typical family, 2 adults and 2 kids: €{n} in total", es: "Familia tipo, 2 adultos y 2 niños: €{n} en total" },
  "pack.familyAges":    { it: "Le fasce d'età cambiano da un'escursione all'altra: le trovi qui sotto, accanto al prezzo dei bambini. Con altri numeri il totale si rifà da solo nella richiesta.", en: "Age brackets differ from one excursion to the next: you'll find them below, next to the children's price. With other numbers the total recalculates itself in the request.", es: "Las franjas de edad cambian de una excursión a otra: las encuentras abajo, junto al precio de los niños. Con otros números el total se recalcula solo en la solicitud." },
  "pack.inside":        { it: "Cosa c'è dentro", en: "What's inside", es: "Qué incluye" },

  // ── Gli itinerari a giorni (3/5/7) ──────────────────────────────────────
  // Chiavi loro, non "pack." riscritte: la pagina e' la stessa e i testi si
  // scambiano spostando le chiavi (vedi `pacchettiVestiDaGiorni`). Dove c'e'
  // {n} il numero arriva dai dati — scrivere "sette" a mano vorrebbe dire
  // riscrivere queste righe il giorno che nasce un itinerario da dieci giorni.
  "days.eyebrow":       { it: "Quanti giorni hai", en: "How many days", es: "Cuántos días tienes" },
  "days.title":         { it: "3, 5 o 7 giorni", en: "3, 5 or 7 days", es: "3, 5 o 7 días" },
  "days.intro":         { it: "Un'escursione al giorno, scelte per non ripetersi. L'itinerario si prende intero, con una richiesta sola, e i giorni li mettiamo d'accordo insieme. Se resti sull'isola più a lungo, gli altri giorni restano tuoi.", en: "One excursion a day, picked so they don't repeat each other. You take the itinerary as a whole, in a single request, and we agree the days together. If you're staying on the island longer, the other days stay yours.", es: "Una excursión al día, elegidas para no repetirse. El itinerario se toma entero, con una sola solicitud, y los días los acordamos juntos. Si te quedas más tiempo en la isla, los demás días siguen siendo tuyos." },
  "days.navAria":       { it: "Quanti giorni", en: "How many days", es: "Cuántos días" },
  "days.all":           { it: "Tutti", en: "All", es: "Todos" },
  "days.d3":            { it: "3 giorni", en: "3 days", es: "3 días" },
  "days.d5":            { it: "5 giorni", en: "5 days", es: "5 días" },
  "days.d7":            { it: "7 giorni", en: "7 days", es: "7 días" },
  "days.count":         { it: "{n} giorni", en: "{n} days", es: "{n} días" },
  "days.detailEyebrow": { it: "Itinerario di {n} giorni", en: "{n}-day itinerary", es: "Itinerario de {n} días" },
  "days.inside":        { it: "Giorno per giorno", en: "Day by day", es: "Día a día" },
  "days.ask":           { it: "Richiedi l'itinerario", en: "Request the itinerary", es: "Solicitar el itinerario" },
  "days.oneRequest":    { it: "L'itinerario si chiede intero, con una richiesta sola: i {n} giorni li mettiamo d'accordo insieme quando ti rispondiamo.", en: "The itinerary is requested as a whole, in a single request: we agree the {n} days together when we reply.", es: "El itinerario se solicita entero, con una sola solicitud: los {n} días los acordamos juntos cuando te respondemos." },
  "days.fromDayHint":   { it: "Il primo dei {n} giorni, indicativo: gli altri li mettiamo d'accordo quando ti rispondiamo.", en: "The first of the {n} days, roughly: we agree the others when we reply.", es: "El primero de los {n} días, orientativo: los demás los acordamos cuando te respondemos." },
  "days.seeAll":        { it: "Vedi gli altri itinerari", en: "See the other itineraries", es: "Ver los demás itinerarios" },

  "detail.days":        { it: "Giorni", en: "Days", es: "Días" },
  "detail.times":       { it: "Orari", en: "Departure times", es: "Horarios" },
  "detail.languages":   { it: "Lingue", en: "Languages", es: "Idiomas" },
  "detail.free":        { it: "Gratis", en: "Free", es: "Gratis" },
  "detail.transfer":    { it: "Transfer", en: "Transfer", es: "Traslado" },
  "detail.withTransfer": { it: "Con il transfer", en: "With the transfer", es: "Con el traslado" },
  "detail.transferSiam": { it: "Transfer Siam Park", en: "Siam Park transfer", es: "Traslado Siam Park" },
  "detail.withTransferSiam": { it: "Con il transfer per il Siam Park", en: "With the Siam Park transfer", es: "Con el traslado a Siam Park" },
  "detail.babySeat":    { it: "posto sul pullman", en: "coach seat", es: "plaza en el autobús" },
  "req.transfer":       { it: "Vuoi il transfer?", en: "Would you like the transfer?", es: "¿Quieres el traslado?" },
  "req.transferSiam":   { it: "Vuoi il transfer per il Siam Park?", en: "Would you like the Siam Park transfer?", es: "¿Quieres el traslado a Siam Park?" },
  "detail.people":      { it: "Da {from} a {to} persone", en: "{from} to {to} people", es: "De {from} a {to} personas" },
  "detail.privateTitle":{ it: "Vuoi la barca solo per il tuo gruppo?", en: "Want the boat just for your group?", es: "¿Quieres el barco solo para tu grupo?" },
  "detail.privateLink": { it: "Vedi il charter privato", en: "See the private charter", es: "Ver el chárter privado" },
  "detail.kidsYes":     { it: "Famiglie con bambini", en: "Families with children", es: "Familias con niños" },
  "detail.kidsNo":      { it: "Adulti", en: "Adults", es: "Adultos" },
  "detail.related":     { it: "Altre esperienze da scoprire", en: "More experiences to discover", es: "Más experiencias por descubrir" },
  "detail.notFound":    { it: "Escursione non trovata", en: "Excursion not found", es: "Excursión no encontrada" },
  "detail.notFoundText":{ it: "Questo indirizzo non corrisponde a nessuna escursione. Forse è stato tolto dal catalogo.", en: "This address doesn't match any excursion. It may have been removed from the catalogue.", es: "Esta dirección no corresponde a ninguna excursión. Puede que se haya retirado del catálogo." },
  "detail.seeAll":      { it: "Vedi tutte le escursioni", en: "See all excursions", es: "Ver todas las excursiones" },

  // ── finestra Richiedi disponibilità ─────────────────────────────────────
  "req.title":          { it: "Richiedi disponibilità", en: "Check availability", es: "Consultar disponibilidad" },
  "req.name":           { it: "Il tuo nome", en: "Your name", es: "Tu nombre" },
  "req.namePlaceholder":{ it: "Nome e cognome", en: "First and last name", es: "Nombre y apellidos" },
  "req.date":           { it: "Quando vorresti andare", en: "When would you like to go", es: "Cuándo quieres ir" },
  "req.time":           { it: "A che ora", en: "What time", es: "A qué hora" },
  "req.timeAny":        { it: "Da concordare", en: "To be agreed", es: "Por concretar" },
  "req.lang":           { it: "In che lingua", en: "Which language", es: "En qué idioma" },
  "req.langAny":        { it: "Indifferente", en: "No preference", es: "Indiferente" },
  "req.menu":           { it: "Esigenze sul menu", en: "Dietary requirements", es: "Necesidades del menú" },
  "req.menuStandard":   { it: "Menu standard", en: "Standard menu", es: "Menú estándar" },
  "req.menuError":      { it: "Hai indicato più menu speciali che persone.", en: "You've asked for more special menus than there are people.", es: "Has indicado más menús especiales que personas." },
  "req.unitsError":     { it: "Serve almeno un mezzo per fare la richiesta.", en: "Add at least one to send the request.", es: "Hace falta al menos uno para enviar la solicitud." },
  "req.menuHint":       { it: "Allergie o intolleranze: scrivile nelle note qui sotto, così la cucina le sa in anticipo.", en: "Allergies or intolerances: write them in the notes below, so the kitchen knows in advance.", es: "Alergias o intolerancias: escríbelas en las notas de abajo, para que la cocina lo sepa con antelación." },
  // Ferma la richiesta, quindi dice "solo" e non "di solito": un'escursione non
  // si prenota nel giorno in cui non c'e'. Che i giorni possano cambiare con la
  // lingua della guida si dice nelle note della scheda, non qui: qui il cliente
  // ha gia' scelto la data e gli serve sapere che quella non va.
  "req.dayError":       { it: "Questa escursione si fa solo: {giorni}.", en: "This excursion only runs on: {giorni}.", es: "Esta excursión solo se hace: {giorni}." },

  // I giorni della settimana, in forma corta: servono alla riga "Giorni" e al
  // messaggio che compare quando il cliente sceglie una data in cui
  // l'escursione non si fa.
  "day.sun":            { it: "Dom", en: "Sun", es: "Dom" },
  "day.mon":            { it: "Lun", en: "Mon", es: "Lun" },
  "day.tue":            { it: "Mar", en: "Tue", es: "Mar" },
  "day.wed":            { it: "Mer", en: "Wed", es: "Mié" },
  "day.thu":            { it: "Gio", en: "Thu", es: "Jue" },
  "day.fri":            { it: "Ven", en: "Fri", es: "Vie" },
  "day.sat":            { it: "Sab", en: "Sat", es: "Sáb" },
  "req.people":         { it: "Quante persone", en: "How many people", es: "Cuántas personas" },
  "req.total":          { it: "Totale", en: "Total", es: "Total" },
  "req.adults":         { it: "Adulti", en: "Adults", es: "Adultos" },
  "req.kids":           { it: "Bambini", en: "Children", es: "Niños" },
  "req.babies":         { it: "Neonati", en: "Infants", es: "Bebés" },
  // I due bottoni del "meno / piu'" accanto ai numeri. Non si leggono: sono un
  // segno solo, e questo e' il nome che sente chi usa lo schermo a voce.
  "req.minus":          { it: "Uno in meno", en: "One less", es: "Uno menos" },
  "req.plus":           { it: "Uno in più", en: "One more", es: "Uno más" },
  // Il calendario della data. I nomi dei mesi **non** stanno qui: il browser li
  // da' giusti in tutte e tre le lingue (`toLocaleDateString`), e dodici nomi
  // per tre lingue sarebbero trentasei righe per una cosa che sappiamo gia'.
  // I nomi dei giorni invece si', e sono quelli di sopra (`day.mon`...): sono
  // gli stessi che compaiono nell'avviso "si fa solo il...".
  "req.datePick":       { it: "Scegli la data", en: "Choose the date", es: "Elige la fecha" },
  "req.dateMissing":    { it: "Scegli la data dell'escursione.", en: "Choose the date of the excursion.", es: "Elige la fecha de la excursión." },
  "req.prevMonth":      { it: "Mese precedente", en: "Previous month", es: "Mes anterior" },
  "req.nextMonth":      { it: "Mese successivo", en: "Next month", es: "Mes siguiente" },
  // Quando in tutto l'anno non c'e' un giorno buono: non capita col catalogo di
  // oggi, ma un `days` scritto male domani lo farebbe, e una griglia tutta
  // grigia senza una riga che spieghi sembra il sito rotto.
  "req.dateNone":       { it: "Per questa escursione non ci sono date disponibili: scrivici su WhatsApp.", en: "No dates available for this excursion: write to us on WhatsApp.", es: "No hay fechas disponibles para esta excursión: escríbenos por WhatsApp." },
  "req.hotel":          { it: "Dove alloggi", en: "Where you are staying", es: "Dónde te alojas" },
  "req.hotelPlaceholder": { it: "Scrivi le prime lettere dell'hotel", en: "Type the first letters of your hotel", es: "Escribe las primeras letras del hotel" },
  "req.pickup":         { it: "Punto di raccolta", en: "Pick-up point", es: "Punto de recogida" },
  "req.pickupHotel":    { it: "il tuo hotel", en: "your hotel", es: "tu hotel" },
  "pickup.bus":         { it: "alla fermata dell'autobus", en: "at the bus stop", es: "en la parada de guagua" },
  "pickup.taxi":        { it: "al posteggio dei taxi", en: "at the taxi rank", es: "en la parada de taxis" },
  "pickup.sbarra":      { it: "alla sbarra", en: "at the barrier", es: "en la barrera" },
  "pickup.reception":   { it: "fuori dalla reception", en: "outside reception", es: "fuera de recepción" },
  "pickup.centro":      { it: "al centro commerciale", en: "at the shopping centre", es: "en el centro comercial" },
  "pickup.angolo":      { it: "all'angolo", en: "on the corner", es: "en la esquina" },
  "req.hotelWhy":       { it: "(utile per il pick-up)", en: "(useful for the pick-up)", es: "(útil para la recogida)" },
  "req.hotelHintTime":  { it: "Serve a dirti dove e a che ora passiamo a prenderti. Se non trovi il tuo, scrivilo nelle note.", en: "It tells us where and when to pick you up. If yours is not listed, write it in the notes.", es: "Nos dice dónde y a qué hora recogerte. Si no encuentras el tuyo, escríbelo en las notas." },
  "req.hotelHint":      { it: "Serve a dirti dove passiamo a prenderti. Se non trovi il tuo, scrivilo nelle note.", en: "It tells us where to pick you up. If yours is not listed, write it in the notes.", es: "Nos dice dónde recogerte. Si no encuentras el tuyo, escríbelo en las notas." },
  "req.note":           { it: "Note", en: "Notes", es: "Notas" },
  "req.optional":       { it: "(facoltativo)", en: "(optional)", es: "(opcional)" },
  "req.notePlaceholder":{ it: "Richieste particolari…", en: "Special requests…", es: "Peticiones especiales…" },
  "req.submit":         { it: "Continua su WhatsApp", en: "Continue on WhatsApp", es: "Continuar en WhatsApp" },
  "req.addToList":      { it: "Aggiungi alla lista", en: "Add to list", es: "Añadir a la lista" },
  // ⚠ LE 24 ORE SONO LA REGOLA DI ISLA, non quella dei fornitori. Le pagine
  // degli operatori e dei rivenditori scrivono le loro (48 ore, 72 ore...):
  // **non si copiano qui**. Isla prenota a mano su WhatsApp e questa riga
  // resta a 24 ore finche' non e' l'ufficio a dire un altro numero.
  "req.hint":           { it: "Le richieste vanno fatte con almeno <strong>24 ore di anticipo</strong>. Ti rispondiamo entro 24 ore con la conferma.", en: "Requests must be sent at least <strong>24 hours in advance</strong>. We reply within 24 hours with the confirmation.", es: "Las solicitudes deben enviarse con al menos <strong>24 horas de antelación</strong>. Respondemos en 24 horas con la confirmación." },
  // Diceva "non viene salvato dal sito", e da quando l'hotel si ricorda non era
  // piu' vero. Non era del tutto vero nemmeno prima: la lista delle richieste
  // sta nel browser da sempre, hotel e note comprese.
  // La riga nuova dice le due cose che contano e sono vere: a chi serve quello
  // che scrive (a rispondergli su WhatsApp, e nel sito non c'e' una sola
  // chiamata di rete che mandi qualcosa a qualcuno), e dove finisce l'hotel
  // (nel suo dispositivo, non da noi). Due frasi corte: quelle lunghe le ha
  // bocciate il proprietario e aveva ragione.
  "req.privacy":        { it: "Quello che scrivi serve solo a risponderti su WhatsApp. L'hotel resta salvato su questo dispositivo, per non riscriverlo ogni volta. <a href=\"./privacy.html\" target=\"_blank\" rel=\"noopener\">Come trattiamo i tuoi dati</a>", en: "What you type is only used to reply to you on WhatsApp. Your hotel stays saved on this device, so you don't have to type it again. <a href=\"./privacy.html\" target=\"_blank\" rel=\"noopener\">How we handle your data</a>", es: "Lo que escribes solo sirve para responderte por WhatsApp. El hotel se queda guardado en este dispositivo, para no escribirlo cada vez. <a href=\"./privacy.html\" target=\"_blank\" rel=\"noopener\">Cómo tratamos tus datos</a>" },

  // ── messaggio WhatsApp ──────────────────────────────────────────────────
  "wa.intro":           { it: "Ciao Isla! Sono {name}, vorrei richiedere disponibilità per:", en: "Hi Isla! I'm {name}, I'd like to check availability for:", es: "¡Hola Isla! Soy {name}, quisiera consultar disponibilidad para:" },
  "wa.date":            { it: "Data", en: "Date", es: "Fecha" },
  "wa.time":            { it: "Orario", en: "Time", es: "Hora" },
  "wa.lang":            { it: "Lingua", en: "Language", es: "Idioma" },
  "wa.menu":            { it: "Menu", en: "Menu", es: "Menú" },
  "wa.people":          { it: "Persone", en: "People", es: "Personas" },
  "wa.hotel":           { it: "Hotel", en: "Hotel", es: "Hotel" },
  "wa.pickup":          { it: "Punto di raccolta", en: "Pick-up point", es: "Punto de recogida" },
  "wa.pickupHotel":     { it: "in hotel", en: "at the hotel", es: "en el hotel" },
  "wa.notes":           { it: "Note", en: "Notes", es: "Notas" },
  "wa.transfer":        { it: "Transfer", en: "Transfer", es: "Traslado" },
  "wa.transferSiam":    { it: "Transfer Siam Park", en: "Siam Park transfer", es: "Traslado Siam Park" },
  "wa.total":           { it: "Totale", en: "Total", es: "Total" },
  "wa.code":            { it: "Codice richiesta: {code}", en: "Request code: {code}", es: "Código de solicitud: {code}" },
  "wa.introList":       { it: "Ciao Isla! Sono {name}, vorrei richiedere disponibilità per {n} escursioni:", en: "Hi Isla! I'm {name}, I'd like to check availability for {n} excursions:", es: "¡Hola Isla! Soy {name}, quisiera consultar disponibilidad para {n} excursiones:" },
  "wa.fromDay":         { it: "Dal giorno", en: "From", es: "Desde el día" },
  "wa.introPack":       { it: "Ciao Isla! Sono {name}, vorrei richiedere il pacchetto «{pack}»:", en: "Hi Isla! I'm {name}, I'd like to request the «{pack}» package:", es: "¡Hola Isla! Soy {name}, quisiera solicitar el paquete «{pack}»:" },
  "wa.introDays":       { it: "Ciao Isla! Sono {name}, vorrei richiedere l'itinerario «{pack}», {n} giorni:", en: "Hi Isla! I'm {name}, I'd like to request the «{pack}» itinerary, {n} days:", es: "¡Hola Isla! Soy {name}, quisiera solicitar el itinerario «{pack}», {n} días:" },
  "wa.totalPartial":    { it: "Totale (solo le escursioni con il prezzo)", en: "Total (priced excursions only)", es: "Total (solo las excursiones con precio)" },
  "wa.yes":             { it: "sì", en: "yes", es: "sí" },
  "wa.no":              { it: "no", en: "no", es: "no" },
  "wa.adult":           { it: "adulto", en: "adult", es: "adulto" },
  "wa.adults":          { it: "adulti", en: "adults", es: "adultos" },
  "wa.child":           { it: "bambino", en: "child", es: "niño" },
  "wa.children":        { it: "bambini", en: "children", es: "niños" },
  "wa.baby":            { it: "neonato", en: "baby", es: "bebé" },
  "wa.babies":          { it: "neonati", en: "babies", es: "bebés" },
  "wa.and":             { it: "e", en: "and", es: "y" },

  // ── assistente ──────────────────────────────────────────────────────────
  "assist.open":        { it: "Apri l'assistente per trovare un'escursione", en: "Open the assistant to find an excursion", es: "Abre el asistente para encontrar una excursión" },
  "assist.title":       { it: "Assistente Isla", en: "Isla Assistant", es: "Asistente Isla" },
  "assist.sub":         { it: "Ti aiuto a scegliere", en: "I'll help you choose", es: "Te ayudo a elegir" },
  "assist.hello":       { it: "Ciao! Ti faccio tre domande veloci e ti propongo qualcosa.", en: "Hi! Three quick questions and I'll suggest something.", es: "¡Hola! Te hago tres preguntas rápidas y te propongo algo." },
  "assist.q1":          { it: "Cosa ti piacerebbe fare?", en: "What would you like to do?", es: "¿Qué te gustaría hacer?" },
  "assist.q2":          { it: "Ci sono bambini con te?", en: "Are there children with you?", es: "¿Vienen niños contigo?" },
  "assist.yes":         { it: "Sì", en: "Yes", es: "Sí" },
  "assist.no":          { it: "No", en: "No", es: "No" },
  "assist.int.sea":     { it: "Mare e barche", en: "Sea and boats", es: "Mar y barcos" },
  // Segue il nome della categoria in esplora-catalog.js: la risposta e il posto
  // dove porta si devono leggere uguali. La riga "assist.int.stars" e' sparita
  // con la categoria "stelle": adesso le stelle stanno qui dentro.
  "assist.int.nature":  { it: "Natura, Teide e stelle", en: "Nature, Teide and stars", es: "Naturaleza, Teide y estrellas" },
  "assist.int.adrenaline": { it: "Adrenalina", en: "Adrenaline", es: "Adrenalina" },
  "assist.int.parks":   { it: "Parchi e spettacoli", en: "Parks and shows", es: "Parques y espectáculos" },
  "assist.int.island":  { it: "Girare l'isola", en: "Tour the island", es: "Recorrer la isla" },
  "assist.int.unsure":  { it: "Non lo so ancora", en: "I'm not sure yet", es: "Todavía no lo sé" },
  "assist.q3":          { it: "Che budget hai in mente?", en: "What's your budget?", es: "¿Qué presupuesto tienes?" },
  "assist.budget.low":  { it: "Fino a €50", en: "Up to €50", es: "Hasta €50" },
  "assist.budget.mid":  { it: "Da €50 a €100", en: "€50 to €100", es: "De €50 a €100" },
  "assist.budget.high": { it: "Più di €100", en: "Over €100", es: "Más de €100" },
  "assist.budget.any":  { it: "Non importa", en: "Doesn't matter", es: "Da igual" },
  "assist.noBudget":    { it: "Con questo budget non ho trovato niente con un prezzo fisso. Molte esperienze però si organizzano su richiesta.", en: "Nothing with a fixed price fits this budget. Many experiences are arranged on request, though.", es: "Con este presupuesto no hay nada con precio fijo. Aun así, muchas experiencias se organizan bajo petición." },
  "assist.customTitle": { it: "Non trovi quello che cerchi?", en: "Can't find what you're looking for?", es: "¿No encuentras lo que buscas?" },
  "assist.customText":  { it: "Scrivici cosa ti piacerebbe fare e te lo organizziamo noi.", en: "Tell us what you'd like to do and we'll organise it for you.", es: "Cuéntanos qué te gustaría hacer y te lo organizamos." },
  "assist.customBtn":   { it: "Chiedi su WhatsApp", en: "Ask on WhatsApp", es: "Preguntar por WhatsApp" },
  "assist.customWa":    { it: "Ciao Isla! Sto cercando un'esperienza a Tenerife che non ho trovato sul sito. Vorrei: ", en: "Hi Isla! I'm looking for an experience in Tenerife that I couldn't find on the site. I'd like: ", es: "¡Hola Isla! Busco una experiencia en Tenerife que no he encontrado en la web. Me gustaría: " },
  "assist.results":     { it: "Ecco cosa ti consiglio:", en: "Here's what I'd suggest:", es: "Esto es lo que te recomiendo:" },
  "assist.resultsFamily": { it: "Ecco cosa ti consiglio, tutto adatto ai bambini:", en: "Here's what I'd suggest, all kid-friendly:", es: "Esto es lo que te recomiendo, todo apto para niños:" },
  "assist.none":        { it: "Su questa combinazione non ho trovato nulla. Prova a cambiare risposta, oppure guarda tutto il catalogo.", en: "I found nothing for this combination. Try a different answer, or browse the whole catalogue.", es: "No he encontrado nada con esta combinación. Prueba a cambiar de respuesta o mira todo el catálogo." },
  "assist.more":        { it: "Ce ne sono altre {n}.", en: "There are {n} more.", es: "Hay {n} más." },
  "assist.catalog":     { it: "Vedi il catalogo", en: "See the catalogue", es: "Ver el catálogo" },
  "assist.restart":     { it: "Ricomincia", en: "Start again", es: "Empezar de nuevo" },

  // ── pagina prenotazione ─────────────────────────────────────────────────
  "booking.back":       { it: "Torna alla home", en: "Back to home", es: "Volver al inicio" },
  "booking.h1":         { it: "La tua escursione", en: "Your excursion", es: "Tu excursión" },
  "booking.found":      { it: "Prenotazione trovata", en: "Booking found", es: "Reserva encontrada" },
  "booking.confirmed":  { it: "Confermata", en: "Confirmed", es: "Confirmada" },
  "booking.code":       { it: "Codice", en: "Code", es: "Código" },
  "booking.time":       { it: "Orario", en: "Time", es: "Hora" },
  "booking.duration":   { it: "Durata", en: "Duration", es: "Duración" },
  "booking.meeting":    { it: "Punto d'incontro", en: "Meeting point", es: "Punto de encuentro" },
  "booking.openMap":    { it: "Apri in mappa →", en: "Open in maps →", es: "Abrir en el mapa →" },
  "booking.bring":      { it: "Cosa portare", en: "What to bring", es: "Qué llevar" },
  "booking.notes":      { it: "Note importanti", en: "Important notes", es: "Notas importantes" },
  "booking.another":    { it: "Cerca un'altra prenotazione", en: "Look up another booking", es: "Buscar otra reserva" },
  "booking.help":       { it: "Richiedi assistenza", en: "Get help", es: "Solicitar ayuda" },
  "booking.helpSubject":{ it: "Assistenza prenotazione", en: "Booking support", es: "Asistencia con la reserva" },
  "booking.notFound":   { it: "Ticket non trovato", en: "Ticket not found", es: "Ticket no encontrado" },
  "booking.notFoundText": { it: "Non troviamo un ticket con il numero \"{code}\" e questo telefono. Controlla tutti e due sul ticket: il telefono è quello che hai dato al venditore.", en: "We can't find a ticket with the number \"{code}\" and this phone number. Check both on your ticket: the phone is the one you gave the seller.", es: "No encontramos ningún ticket con el número \"{code}\" y este teléfono. Revisa los dos en el ticket: el teléfono es el que diste al vendedor." },
  "booking.retry":      { it: "Riprova", en: "Try again", es: "Inténtalo de nuevo" },
  "booking.needPhone":  { it: "Manca il telefono", en: "Phone number missing", es: "Falta el teléfono" },
  "booking.needPhoneText": { it: "Per vedere il ticket {code} scrivi anche il telefono che hai dato al venditore.", en: "To see ticket {code}, also enter the phone number you gave the seller.", es: "Para ver el ticket {code}, escribe también el teléfono que diste al vendedor." },
  "booking.loading":    { it: "Cerco il tuo ticket…", en: "Looking up your ticket…", es: "Buscando tu ticket…" },
  "booking.offline":    { it: "Niente connessione", en: "No connection", es: "Sin conexión" },
  "booking.offlineText":{ it: "Adesso non riusciamo a cercare il ticket. Riprova quando hai campo.", en: "We can't look up your ticket right now. Try again when you have signal.", es: "Ahora no podemos buscar tu ticket. Inténtalo de nuevo cuando tengas cobertura." },
  "booking.offlineSaved": { it: "Senza connessione: è l'ultima versione salvata su questo telefono.", en: "No connection: this is the last version saved on this phone.", es: "Sin conexión: es la última versión guardada en este teléfono." },
  "booking.ticketN":    { it: "Ticket {code}", en: "Ticket {code}", es: "Ticket {code}" },
  "booking.pending":    { it: "Da confermare", en: "Pending", es: "Por confirmar" },
  "booking.cancelled":  { it: "Annullata", en: "Cancelled", es: "Cancelada" },
  "booking.pendingText":{ it: "L'ufficio ha ricevuto la tua richiesta e ti risponde su WhatsApp entro 24 ore.", en: "The office has received your request and will reply on WhatsApp within 24 hours.", es: "La oficina ha recibido tu solicitud y te responde por WhatsApp en 24 horas." },
  "booking.cancelledText": { it: "Questa escursione non si può fare. Scrivici su WhatsApp e cerchiamo insieme un'altra data.", en: "This excursion can't go ahead. Message us on WhatsApp and we'll find another date together.", es: "Esta excursión no se puede realizar. Escríbenos por WhatsApp y buscamos juntos otra fecha." },
  "booking.requestOf":  { it: "Richiesta del {date}", en: "Request of {date}", es: "Solicitud del {date}" },
  "booking.wantedTime": { it: "Orario richiesto", en: "Requested time", es: "Hora solicitada" },
  "booking.requestsIntro": { it: "Le richieste che hai mandato su WhatsApp. Lo stato lo aggiorna l'ufficio.", en: "The requests you sent on WhatsApp. The office updates their status.", es: "Las solicitudes que enviaste por WhatsApp. La oficina actualiza su estado." },
  "booking.waRequests": { it: "Ciao, ho una domanda sulle mie richieste ({code}).", en: "Hi, I have a question about my requests ({code}).", es: "Hola, tengo una pregunta sobre mis solicitudes ({code})." },
  "booking.ticketsTitle": { it: "I tuoi ticket", en: "Your tickets", es: "Tus tickets" },
  "booking.openRequestsTitle": { it: "Richieste", en: "Requests", es: "Solicitudes" },
  "booking.ticketsH1":  { it: "I miei ticket", en: "My tickets", es: "Mis tickets" },
  "booking.requestsH1": { it: "Le mie richieste", en: "My requests", es: "Mis solicitudes" },
  "booking.noRequests": { it: "Nessuna richiesta", en: "No requests", es: "Ninguna solicitud" },
  "booking.noRequestsText": { it: "Qui compaiono le escursioni che richiedi su WhatsApp da questo telefono.", en: "The excursions you request on WhatsApp from this phone will appear here.", es: "Aquí aparecen las excursiones que solicitas por WhatsApp desde este teléfono." },
  "ticket.requestsLink": { it: "Le mie richieste ({n})", en: "My requests ({n})", es: "Mis solicitudes ({n})" },
  "ticket.requestsSub":  { it: "Mandate su WhatsApp, anche senza ticket", en: "Sent on WhatsApp, even without a ticket", es: "Enviadas por WhatsApp, también sin ticket" },
  "ticket.requestsOr":   { it: "oppure cerca un ticket di carta", en: "or look up a paper ticket", es: "o busca un ticket de papel" },
  "booking.past":       { it: "Già fatta", en: "Done", es: "Realizada" },
  "booking.pastTitle":  { it: "Escursioni passate", en: "Past excursions", es: "Excursiones pasadas" },
  "booking.when":       { it: "Quando", en: "When", es: "Cuándo" },
  "booking.people":     { it: "Persone", en: "People", es: "Personas" },
  "booking.meetAt":     { it: "Presentati alle {time}", en: "Be there at {time}", es: "Preséntate a las {time}" },
  "booking.payment":    { it: "Pagamento", en: "Payment", es: "Pago" },
  "booking.paid":       { it: "Pagato", en: "Paid", es: "Pagado" },
  "booking.toPay":      { it: "Da pagare: €{n}", en: "Left to pay: €{n}", es: "Por pagar: €{n}" },
  "booking.adult1":     { it: "1 adulto", en: "1 adult", es: "1 adulto" },
  "booking.adultN":     { it: "{n} adulti", en: "{n} adults", es: "{n} adultos" },
  "booking.kid1":       { it: "1 bambino", en: "1 child", es: "1 niño" },
  "booking.kidN":       { it: "{n} bambini", en: "{n} children", es: "{n} niños" },
  "booking.baby1":      { it: "1 neonato", en: "1 infant", es: "1 bebé" },
  "booking.babyN":      { it: "{n} neonati", en: "{n} infants", es: "{n} bebés" },
  "booking.seeTour":    { it: "Vedi l'escursione", en: "See the excursion", es: "Ver la excursión" },
  "booking.otherExc":   { it: "La tua escursione", en: "Your excursion", es: "Tu excursión" },
  "booking.whatsapp":   { it: "Scrivi all'ufficio", en: "Message the office", es: "Escribe a la oficina" },
  "booking.waText":     { it: "Ciao, ho una domanda sul ticket {code}.", en: "Hi, I have a question about ticket {code}.", es: "Hola, tengo una pregunta sobre el ticket {code}." },
  "booking.noCode":     { it: "Trova la tua escursione", en: "Find your excursion", es: "Encuentra tu excursión" },
  "booking.noCodeText": { it: "Scrivi il numero del ticket e il telefono che hai dato al venditore.", en: "Enter your ticket number and the phone number you gave the seller.", es: "Escribe el número del ticket y el teléfono que diste al vendedor." },
  "booking.goHome":     { it: "Vai alla home", en: "Go to home", es: "Ir al inicio" },

  // ── pagina offline ──────────────────────────────────────────────────────
  "offline.title":      { it: "Sei offline", en: "You're offline", es: "Estás sin conexión" },
  "offline.text":       { it: "La PWA è installata, ma questa pagina non è disponibile senza connessione.", en: "The app is installed, but this page isn't available without a connection.", es: "La app está instalada, pero esta página no está disponible sin conexión." }
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
// prendono sempre **due** decimali, con la virgola in italiano e spagnolo
// ("49,50") e il punto in inglese ("49.50"): "49.5" non e' un prezzo, e' un
// numero, e su una pagina di prenotazione sembra un errore.
//
// Il simbolo € non lo mette: lo scrivono gia' i punti che la usano, che lo
// mettono prima del numero ("€49,50") in tutte e tre le lingue.
function eur(n) {
  const num = Number(n);
  if (!isFinite(num)) return String(n);
  if (Number.isInteger(num)) return String(num);
  const testo = num.toFixed(2);
  return I18N_CURRENT === "en" ? testo : testo.replace(".", ",");
}

// Campo del catalogo che può essere una stringa uguale in tutte le lingue
// (i nomi propri, per esempio "Siam Park") oppure un oggetto { it, en, es }.
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

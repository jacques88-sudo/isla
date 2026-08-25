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
  "lang.change":        { it: "Cambia lingua", en: "Change language", es: "Cambiar idioma" },

  // ── barra in alto ───────────────────────────────────────────────────────
  "nav.aria":           { it: "Menu principale", en: "Main menu", es: "Menú principal" },
  "nav.experiences":    { it: "Esperienze", en: "Experiences", es: "Experiencias" },
  "nav.bookNow":        { it: "Prenota ora", en: "Book now", es: "Reservar" },
  "nav.menu":           { it: "Menu", en: "Menu", es: "Menú" },

  // ── titoli delle pagine ─────────────────────────────────────────────────
  "meta.home.title":    { it: "Isla · La tua escursione a Tenerife", en: "Isla · Your excursion in Tenerife", es: "Isla · Tu excursión en Tenerife" },
  "meta.home.desc":     { it: "Isla — trova subito orario, punto d'incontro e informazioni della tua escursione a Tenerife.", en: "Isla — find the time, meeting point and details of your excursion in Tenerife straight away.", es: "Isla — encuentra al instante el horario, el punto de encuentro y la información de tu excursión en Tenerife." },
  "meta.catalog.title": { it: "Tutte le escursioni · Isla", en: "All excursions · Isla", es: "Todas las excursiones · Isla" },
  "meta.catalog.desc":  { it: "Tutte le escursioni, i tour e gli show di Isla a Tenerife: mare, Teide, parchi, avventura e molto altro.", en: "All of Isla's excursions, tours and shows in Tenerife: sea, Teide, parks, adventure and much more.", es: "Todas las excursiones, tours y espectáculos de Isla en Tenerife: mar, Teide, parques, aventura y mucho más." },
  "meta.booking.title": { it: "La tua prenotazione · Isla", en: "Your booking · Isla", es: "Tu reserva · Isla" },

  // ── hero ────────────────────────────────────────────────────────────────
  "hero.pause":         { it: "Metti in pausa il video", en: "Pause the video", es: "Pausar el vídeo" },
  "hero.play":          { it: "Riproduci il video", en: "Play the video", es: "Reproducir el vídeo" },
  "hero.discover":      { it: "Scopri di più", en: "Discover more", es: "Descubre más" },

  // ── intro e bento ───────────────────────────────────────────────────────
  "intro.eyebrow":      { it: "Tenerife", en: "Tenerife", es: "Tenerife" },
  "intro.title":        { it: "Inizia la tua avventura con…", en: "Start your adventure with…", es: "Empieza tu aventura con…" },
  "bento.packages":     { it: "Pacchetti", en: "Packages", es: "Paquetes" },
  "bento.scan":         { it: "Scan ticket", en: "Scan ticket", es: "Scan ticket" },
  "bento.kids":         { it: "Con bambini", en: "With kids", es: "Con niños" },
  "bento.days":         { it: "3/5/7 Days Experience", en: "3/5/7 Days Experience", es: "3/5/7 Days Experience" },
  "bento.rental":       { it: "Noleggio auto, moto e bici", en: "Car, moto & bike rental", es: "Alquiler de coche, moto y bici" },
  "wa.rental":          { it: "Ciao Isla! Vorrei noleggiare un mezzo a Tenerife. Mi interessa: ", en: "Hi Isla! I'd like to rent a vehicle in Tenerife. I'm interested in: ", es: "¡Hola Isla! Quisiera alquilar un vehículo en Tenerife. Me interesa: " },

  // ── i tre passi ─────────────────────────────────────────────────────────
  "steps.eyebrow":      { it: "The journey", en: "The journey", es: "The journey" },
  "steps.title":        { it: "Tre passi, nessun pensiero", en: "Three steps, no worries", es: "Tres pasos, sin preocupaciones" },
  "steps.intro":        { it: "Dalla scelta dell'esperienza alla conferma: pochi minuti, dal telefono. Il catalogo lo sfogli anche senza connessione.", en: "From choosing the experience to the confirmation: a few minutes, from your phone. You can browse the catalogue even offline.", es: "Desde elegir la experiencia hasta la confirmación: pocos minutos, desde el móvil. El catálogo lo consultas incluso sin conexión." },
  "steps.1.title":      { it: "Scegli", en: "Choose", es: "Elige" },
  "steps.1.desc":       { it: "Sfoglia escursioni e pacchetti selezionati.", en: "Browse hand-picked excursions and packages.", es: "Explora excursiones y paquetes seleccionados." },
  "steps.2.title":      { it: "Richiedi", en: "Ask", es: "Solicita" },
  "steps.2.desc":       { it: "Ci scrivi su WhatsApp con data e partecipanti.", en: "Message us on WhatsApp with your date and group.", es: "Nos escribes por WhatsApp con fecha y participantes." },
  "steps.3.title":      { it: "Vivi", en: "Live it", es: "Vívelo" },
  "steps.3.desc":       { it: "Confermiamo entro 24 ore e pensi solo a goderti la giornata.", en: "We confirm within 24 hours and you just enjoy the day.", es: "Confirmamos en 24 horas y tú solo disfrutas del día." },

  // ── categorie ───────────────────────────────────────────────────────────
  "categories.eyebrow": { it: "Esplora", en: "Explore", es: "Explora" },
  "categories.title":   { it: "Categorie", en: "Categories", es: "Categorías" },
  "categories.altSuffix": { it: "a Tenerife", en: "in Tenerife", es: "en Tenerife" },

  // ── posti segreti ───────────────────────────────────────────────────────
  "secret.eyebrow":     { it: "Posti segreti", en: "Secret spots", es: "Lugares secretos" },
  "secret.title":       { it: "Dove non arrivano i pullman", en: "Where the coaches don't go", es: "Donde no llegan los autobuses" },
  "secret.text":        { it: "Cale di sabbia nera, piscine naturali e punti panoramici che i pullman turistici non raggiungono. Fanno parte di Tenerife tanto quanto le grandi attrazioni.", en: "Black-sand coves, natural pools and viewpoints the tour coaches never reach. They are as much a part of Tenerife as the big attractions.", es: "Calas de arena negra, piscinas naturales y miradores a los que no llegan los autobuses turísticos. Forman parte de Tenerife tanto como las grandes atracciones." },
  "secret.alt":         { it: "Cala segreta a Tenerife", en: "Secret cove in Tenerife", es: "Cala secreta en Tenerife" },

  // ── chi siamo ───────────────────────────────────────────────────────────
  "about.eyebrow":      { it: "Chi siamo", en: "About us", es: "Quiénes somos" },
  "about.title":        { it: "Isolani, per scelta", en: "Islanders, by choice", es: "Isleños, por elección" },
  "about.p1":           { it: "Isla nasce dalla voglia di rendere più semplice la vacanza a Tenerife: un unico posto dove trovare subito le informazioni della propria escursione, senza perdersi tra email, PDF e messaggi.", en: "Isla was born to make a holiday in Tenerife simpler: one single place to find your excursion details straight away, without digging through emails, PDFs and messages.", es: "Isla nace de las ganas de hacer más sencillas las vacaciones en Tenerife: un único lugar donde encontrar al instante la información de tu excursión, sin perderte entre correos, PDF y mensajes." },
  "about.p2":           { it: "Il nostro obiettivo è uno solo: farti godere l'isola, senza pensieri organizzativi.", en: "We have one goal only: to let you enjoy the island, with no organising to worry about.", es: "Nuestro objetivo es uno solo: que disfrutes de la isla, sin preocuparte por la organización." },
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
  "faq.a5":             { it: "Scrivici su WhatsApp il prima possibile: ti diciamo subito cosa è previsto per quell'escursione.", en: "Message us on WhatsApp as soon as you can: we'll tell you right away what applies to that excursion.", es: "Escríbenos por WhatsApp cuanto antes: te decimos enseguida qué condiciones tiene esa excursión." },
  "faq.q6":             { it: "Funziona anche senza connessione?", en: "Does it work without a connection?", es: "¿Funciona sin conexión?" },
  "faq.a6":             { it: "Sì. Isla è un'app installabile: una volta aperta la prima volta, le informazioni restano disponibili anche offline, utile quando sei in giro per l'isola.", en: "Yes. Isla is an installable app: once you've opened it the first time, the information stays available offline — handy while you're out around the island.", es: "Sí. Isla es una app instalable: una vez abierta la primera vez, la información sigue disponible sin conexión, útil cuando estás recorriendo la isla." },

  // ── menu laterale ───────────────────────────────────────────────────────
  "menu.aria":          { it: "Menu", en: "Menu", es: "Menú" },
  "menu.sections":      { it: "Sezioni", en: "Sections", es: "Secciones" },
  "menu.close":         { it: "Chiudi menu", en: "Close menu", es: "Cerrar menú" },
  "menu.install":       { it: "Installa l'app", en: "Install the app", es: "Instalar la app" },
  "menu.excursions":    { it: "Escursioni", en: "Excursions", es: "Excursiones" },
  "menu.packages":      { it: "Pacchetti", en: "Packages", es: "Paquetes" },
  "menu.scan":          { it: "Scan ticket", en: "Scan ticket", es: "Scan ticket" },
  "menu.secret":        { it: "Posti segreti", en: "Secret spots", es: "Lugares secretos" },
  "menu.about":         { it: "Chi siamo", en: "About us", es: "Quiénes somos" },
  "menu.cta":           { it: "Prenota ora", en: "Book now", es: "Reservar" },

  // ── finestra Scan ticket ────────────────────────────────────────────────
  "ticket.title":       { it: "Scan ticket", en: "Scan ticket", es: "Scan ticket" },
  "ticket.codeLabel":   { it: "Codice prenotazione o ticket", en: "Booking or ticket code", es: "Código de reserva o de ticket" },
  "ticket.placeholder": { it: "Es. ISLA-4521", en: "E.g. ISLA-4521", es: "Ej. ISLA-4521" },
  "ticket.hint":        { it: "Lo trovi nella email o nel messaggio di conferma della prenotazione.", en: "You'll find it in your booking confirmation email or message.", es: "Lo encuentras en el correo o el mensaje de confirmación de la reserva." },

  // ── piè di pagina ───────────────────────────────────────────────────────
  "footer.findCode":    { it: "Cerca il tuo codice", en: "Find your code", es: "Busca tu código" },
  "footer.copy":        { it: "© Isla · Escursioni a Tenerife", en: "© Isla · Tenerife excursions", es: "© Isla · Excursiones en Tenerife" },

  // ── pagina catalogo ─────────────────────────────────────────────────────
  "catalog.eyebrow":    { it: "Esplora", en: "Explore", es: "Explora" },
  "catalog.title":      { it: "Tutte le escursioni", en: "All excursions", es: "Todas las excursiones" },
  "catalog.searchLabel":       { it: "Cerca un'escursione", en: "Search for an excursion", es: "Busca una excursión" },
  "catalog.searchPlaceholder": { it: "Cerca: barca, Teide, quad…", en: "Search: boat, Teide, quad…", es: "Busca: barco, Teide, quad…" },
  "catalog.filterAria": { it: "Filtra per categoria", en: "Filter by category", es: "Filtrar por categoría" },
  "catalog.all":        { it: "Tutte", en: "All", es: "Todas" },
  "catalog.countAll":   { it: "{n} attività disponibili", en: "{n} activities available", es: "{n} actividades disponibles" },
  "catalog.countSome":  { it: "{n} di {total} attività", en: "{n} of {total} activities", es: "{n} de {total} actividades" },
  "catalog.emptyTitle": { it: "Nessun risultato", en: "No results", es: "Sin resultados" },
  "catalog.emptyText":  { it: "Prova a cambiare categoria o a cercare un'altra parola.", en: "Try another category, or search for a different word.", es: "Prueba con otra categoría o busca otra palabra." },
  "catalog.prepTitle":  { it: "Catalogo in preparazione", en: "Catalogue coming soon", es: "Catálogo en preparación" },
  "catalog.prepText":   { it: "Nessuna attività è ancora pubblicata.", en: "No activity has been published yet.", es: "Todavía no hay ninguna actividad publicada." },

  // ── schede attività ─────────────────────────────────────────────────────
  "tour.onRequest":     { it: "Su richiesta", en: "On request", es: "Bajo petición" },
  "tour.from":          { it: "da €{p}", en: "from €{p}", es: "desde €{p}" },
  "tour.family":        { it: "Adatta ai bambini", en: "Kid-friendly", es: "Apta para niños" },
  "tour.transfer":      { it: "Transfer disponibile", en: "Transfer available", es: "Traslado disponible" },
  "tour.ask":           { it: "Richiedi disponibilità", en: "Check availability", es: "Consultar disponibilidad" },
  "tour.details":       { it: "Scopri di più", en: "See details", es: "Ver detalles" },

  // ── pagina di dettaglio di una singola escursione ───────────────────────
  "detail.back":        { it: "Tutte le escursioni", en: "All excursions", es: "Todas las excursiones" },
  "detail.summary":     { it: "In breve", en: "At a glance", es: "En resumen" },
  "detail.departure":   { it: "Punto di partenza", en: "Departure point", es: "Punto de salida" },
  "detail.duration":    { it: "Durata", en: "Duration", es: "Duración" },
  "detail.price":       { it: "Prezzo", en: "Price", es: "Precio" },
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
  "inc.drinks":         { it: "Bevande a bordo", en: "Drinks on board", es: "Bebidas a bordo" },
  "inc.snack":          { it: "Snack", en: "Snacks", es: "Snacks" },
  "inc.fingerfood":     { it: "Finger food", en: "Finger food", es: "Finger food" },
  "inc.swimstop":       { it: "Bagno e snorkeling", en: "Swim & snorkel", es: "Baño y snorkel" },
  "inc.lunch":          { it: "Pranzo", en: "Lunch", es: "Almuerzo" },
  "inc.tasting":        { it: "Degustazione", en: "Tasting", es: "Degustación" },
  "inc.guide":          { it: "Guida", en: "Guide", es: "Guía" },
  "inc.transfer":       { it: "Transfer", en: "Transfer", es: "Traslado" },
  "inc.ferry":          { it: "Traghetto", en: "Ferry", es: "Barco" },
  "inc.ticket":         { it: "Ingressi", en: "Entrance tickets", es: "Entradas" },
  "inc.photos":         { it: "Foto", en: "Photos", es: "Fotos" },
  "detail.free":        { it: "Gratis", en: "Free", es: "Gratis" },
  "detail.transfer":    { it: "Transfer", en: "Transfer", es: "Traslado" },
  "detail.withTransfer": { it: "Con il transfer", en: "With the transfer", es: "Con el traslado" },
  "detail.babySeat":    { it: "posto sul pullman", en: "coach seat", es: "plaza en el autobús" },
  "req.transfer":       { it: "Vuoi il transfer?", en: "Would you like the transfer?", es: "¿Quieres el traslado?" },
  "detail.people":      { it: "Da {from} a {to} persone", en: "{from} to {to} people", es: "De {from} a {to} personas" },
  "detail.privateTitle":{ it: "Vuoi la barca solo per il tuo gruppo?", en: "Want the boat just for your group?", es: "¿Quieres el barco solo para tu grupo?" },
  "detail.privateLink": { it: "Vedi il charter privato", en: "See the private charter", es: "Ver el chárter privado" },
  "detail.kidsYes":     { it: "Famiglie con bambini", en: "Families with children", es: "Familias con niños" },
  "detail.kidsNo":      { it: "Adulti", en: "Adults", es: "Adultos" },
  "detail.related":     { it: "Altre esperienze di questa categoria", en: "More in this category", es: "Más en esta categoría" },
  "detail.notFound":    { it: "Escursione non trovata", en: "Excursion not found", es: "Excursión no encontrada" },
  "detail.notFoundText":{ it: "Questo indirizzo non corrisponde a nessuna escursione. Forse è stato tolto dal catalogo.", en: "This address doesn't match any excursion. It may have been removed from the catalogue.", es: "Esta dirección no corresponde a ninguna excursión. Puede que se haya retirado del catálogo." },
  "detail.seeAll":      { it: "Vedi tutte le escursioni", en: "See all excursions", es: "Ver todas las excursiones" },

  // ── finestra Richiedi disponibilità ─────────────────────────────────────
  "req.title":          { it: "Richiedi disponibilità", en: "Check availability", es: "Consultar disponibilidad" },
  "req.name":           { it: "Il tuo nome", en: "Your name", es: "Tu nombre" },
  "req.namePlaceholder":{ it: "Nome e cognome", en: "First and last name", es: "Nombre y apellidos" },
  "req.date":           { it: "Quando vorresti andare", en: "When would you like to go", es: "Cuándo quieres ir" },
  "req.people":         { it: "Quante persone", en: "How many people", es: "Cuántas personas" },
  "req.adults":         { it: "Adulti", en: "Adults", es: "Adultos" },
  "req.kids":           { it: "Bambini", en: "Children", es: "Niños" },
  "req.note":           { it: "Note", en: "Notes", es: "Notas" },
  "req.optional":       { it: "(facoltativo)", en: "(optional)", es: "(opcional)" },
  "req.notePlaceholder":{ it: "Hotel, zona, richieste particolari…", en: "Hotel, area, special requests…", es: "Hotel, zona, peticiones especiales…" },
  "req.submit":         { it: "Continua su WhatsApp", en: "Continue on WhatsApp", es: "Continuar en WhatsApp" },
  "req.hint":           { it: "Le richieste vanno fatte con almeno <strong>24 ore di anticipo</strong>. Ti rispondiamo entro 24 ore con la conferma.", en: "Requests must be sent at least <strong>24 hours in advance</strong>. We reply within 24 hours with the confirmation.", es: "Las solicitudes deben enviarse con al menos <strong>24 horas de antelación</strong>. Respondemos en 24 horas con la confirmación." },
  "req.privacy":        { it: "Quello che scrivi qui serve solo a risponderti su WhatsApp: non viene salvato dal sito.", en: "What you type here is only used to reply to you on WhatsApp: the site does not store it.", es: "Lo que escribes aquí solo sirve para responderte por WhatsApp: el sitio no lo guarda." },

  // ── messaggio WhatsApp ──────────────────────────────────────────────────
  "wa.intro":           { it: "Ciao Isla! Sono {name}, vorrei richiedere disponibilità per:", en: "Hi Isla! I'm {name}, I'd like to check availability for:", es: "¡Hola Isla! Soy {name}, quisiera consultar disponibilidad para:" },
  "wa.date":            { it: "Data", en: "Date", es: "Fecha" },
  "wa.people":          { it: "Persone", en: "People", es: "Personas" },
  "wa.notes":           { it: "Note", en: "Notes", es: "Notas" },
  "wa.transfer":        { it: "Transfer", en: "Transfer", es: "Traslado" },
  "wa.yes":             { it: "sì", en: "yes", es: "sí" },
  "wa.no":              { it: "no", en: "no", es: "no" },
  "wa.adult":           { it: "adulto", en: "adult", es: "adulto" },
  "wa.adults":          { it: "adulti", en: "adults", es: "adultos" },
  "wa.child":           { it: "bambino", en: "child", es: "niño" },
  "wa.children":        { it: "bambini", en: "children", es: "niños" },
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
  "assist.int.nature":  { it: "Teide e natura", en: "Teide and nature", es: "Teide y naturaleza" },
  "assist.int.adrenaline": { it: "Adrenalina", en: "Adrenaline", es: "Adrenalina" },
  "assist.int.parks":   { it: "Parchi e spettacoli", en: "Parks and shows", es: "Parques y espectáculos" },
  "assist.int.stars":   { it: "Stelle di notte", en: "Stars at night", es: "Estrellas de noche" },
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
  "booking.notFound":   { it: "Codice non trovato", en: "Code not found", es: "Código no encontrado" },
  "booking.notFoundText": { it: "Non troviamo una prenotazione con il codice \"{code}\". Controlla di averlo copiato correttamente dalla email di conferma.", en: "We can't find a booking with the code \"{code}\". Check that you copied it correctly from the confirmation email.", es: "No encontramos ninguna reserva con el código \"{code}\". Comprueba que lo hayas copiado bien del correo de confirmación." },
  "booking.retry":      { it: "Riprova con un altro codice", en: "Try another code", es: "Prueba con otro código" },
  "booking.noCode":     { it: "Nessun codice inserito", en: "No code entered", es: "No has introducido ningún código" },
  "booking.noCodeText": { it: "Torna alla home e inserisci il codice della tua prenotazione per vedere i dettagli del tour.", en: "Go back to the home page and enter your booking code to see the tour details.", es: "Vuelve al inicio e introduce el código de tu reserva para ver los detalles del tour." },
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
  document.querySelectorAll("[data-lang-current]").forEach(el => {
    el.textContent = I18N_CURRENT.toUpperCase();
  });
}

// Selettore nella barra in alto: un bottone tondo con la sigla della lingua
// che apre l'elenco delle tre lingue.
let chiudiMenuLingua = function () {};   // sostituita sotto se il menu esiste

function initLangSwitch() {
  document.querySelectorAll("[data-lang-set]").forEach(btn => {
    btn.addEventListener("click", () => {
      setLang(btn.dataset.langSet);
      chiudiMenuLingua();
    });
  });

  const toggle = document.querySelector("[data-lang-toggle]");
  const menu = document.querySelector("[data-lang-menu]");
  if (!toggle || !menu) return;

  // Velo invisibile a tutto schermo: mentre l'elenco è aperto raccoglie lui
  // il tocco fuori e chiude. Senza, l'elenco coprirebbe i pulsanti sotto e
  // un tocco di troppo cambierebbe lingua per sbaglio.
  const velo = document.createElement("div");
  velo.className = "lang-scrim";
  velo.hidden = true;
  document.body.appendChild(velo);

  function apri() {
    menu.hidden = false;
    velo.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
  }
  function chiudi() {
    menu.hidden = true;
    velo.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }
  chiudiMenuLingua = chiudi;

  toggle.addEventListener("click", () => {
    if (menu.hidden) apri(); else chiudi();
  });
  velo.addEventListener("click", chiudi);
  // Il velo sta sotto la barra in alto: un tocco sugli altri pulsanti della
  // barra arriva qui e chiude comunque l'elenco.
  document.addEventListener("click", e => {
    if (menu.hidden) return;
    if (menu.contains(e.target) || toggle.contains(e.target)) return;
    chiudi();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !menu.hidden) chiudi();
  });
  // scorrendo, la barra si rimpicciolisce e l'elenco resterebbe staccato
  window.addEventListener("scroll", () => {
    if (!menu.hidden) chiudi();
  }, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  applyI18n();
  initLangSwitch();
  paintLangButtons();
});

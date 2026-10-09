// La mappa dei posti: spiagge, punti panoramici, posti segreti, punti di
// interesse e ristoranti. Dieci per categoria (ristoranti a parte), scelti
// incrociando le classifiche delle guide di viaggio (ottobre 2026).
//
// Non ci sono "piastrelle" scaricate da un server di mappe: l'isola e' un
// disegno, il contorno della costa preso da OpenStreetMap (licenza ODbL, per
// questo la scritta in basso a destra). Cosi' la mappa ha i colori del sito,
// funziona anche senza campo (sta nella cache come tutto il resto) e non
// dipende da nessun servizio esterno. Per arrivarci, ogni punto ha il bottone
// "Portami qui", che apre Google Maps e CERCA IL NOME del posto (nome, zona,
// Tenerife): cosi' il navigatore porta al posto vero anche dove il pallino
// sulla nostra mappa e' spostato di qualche centinaio di metri.
// Leaflet (vendor/leaflet-1.9.4.js) serve solo a muovere e ingrandire col dito.
//
// COME E' FATTO UN PUNTO
//   cat      "spiaggia", "panorama", "segreto", "interesse" o "ristorante":
//            decide colore e icona
//   name     il nome del posto, uguale in tutte e tre le lingue (come i titoli
//            delle escursioni: chi lo chiede per strada lo chiede cosi')
//   zone     dove sta, uguale in tutte e tre le lingue
//   text     due righe in it, en, es — scritte da noi, non copiate
//   at       [latitudine, longitudine]: dove sta il pallino. Si prende da
//            Google Maps, tasto destro (o dito premuto) sul punto
//   q        facoltativo: cosa cercare su Google Maps, se "nome, zona" non
//            trova il posto giusto
//   esempio  true = segnaposto della prova, da togliere prima di pubblicare
//
// SOLO PER LE SPIAGGE (si mostrano nel pannello, sotto la zona):
//   tipo     "scenografica" (da foto), "comoda" (servizi, bagno facile) o
//            "selvaggia" (niente servizi, mare spesso forte)
//   sabbia   "dorata", "chiara", "scura", "nera" o "ciottoli"
//   stato    assente = aperta; "chiusa" (il pallino diventa grigio e la scritta
//            rossa) o "regolamentata" (serve prenotare o un permesso)
//   avviso   una riga it/en/es col triangolo: frane, onde, vento, accessi.
//            Vale anche per gli altri posti, ma per ora ce l'hanno le spiagge.
//            Uno "stato" si ricontrolla prima di ogni stagione: le chiusure
//            per frana durano mesi, e una spiaggia riaperta segnata chiusa
//            manda i clienti altrove per niente.
//
// Le coordinate qui sotto sono indicative (alcune da fonti ufficiali, altre a
// occhio): vanno ricontrollate prima di pubblicare (vedi NOTES.md, "La mappa").

const MAP_CATS = {
  spiaggia: {
    label: "map.cat.beach",
    icon: '<path d="M3 15c1.5 0 1.5-1.2 3-1.2s1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2"/><path d="M3 19c1.5 0 1.5-1.2 3-1.2s1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2"/><circle cx="12" cy="7.5" r="3"/>'
  },
  panorama: {
    label: "map.cat.view",
    icon: '<path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="2.8"/>'
  },
  segreto: {
    label: "map.cat.secret",
    icon: '<circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M15.5 12v2"/>'
  },
  interesse: {
    label: "map.cat.sight",
    icon: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>'
  },
  ristorante: {
    label: "map.cat.food",
    icon: '<path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10"/><path d="M17 21V3c-2 1.5-3 4-3 7v3h3"/>'
  }
};

const MAP_POINTS = [
  // ── 16 spiagge ──
  // Stato verificato il 9 ottobre 2026 (Diario de Avisos, Ayuntamiento di Santa
  // Cruz, RTVC): Benijo chiusa dal 2024; Las Gaviotas chiusa da giugno 2026 e
  // per questo NON in elenco. Vedi NOTES.md, "Le spiagge migliorate".
  { cat: "spiaggia", name: "Playa de Las Teresitas", zone: "San Andrés", at: [28.5086, -16.1863],
    tipo: "scenografica", sabbia: "dorata",
    text: { it: "Sabbia dorata, palme e acqua calma dietro la diga, con le montagne di Anaga alle spalle.",
            en: "Golden sand, palm trees and calm water behind the breakwater, with the Anaga mountains behind you.",
            es: "Arena dorada, palmeras y agua tranquila tras el dique, con las montañas de Anaga detrás." } },
  { cat: "spiaggia", name: "Playa de Abama", zone: "Guía de Isora", at: [28.1719, -16.8055],
    tipo: "scenografica", sabbia: "dorata",
    text: { it: "Sabbia chiara e acqua calma in fondo alla scogliera: sembra il Caribe. È pubblica e gratuita.",
            en: "Light sand and calm water at the foot of the cliff: it looks like the Caribbean. It is public and free.",
            es: "Arena clara y agua tranquila al pie del acantilado: parece el Caribe. Es pública y gratuita." },
    avviso: { it: "Si scende a piedi dal parcheggio pubblico, una decina di minuti con le scale. Porta acqua e scarpe comode.",
              en: "You walk down from the public car park, about ten minutes with steps. Bring water and comfortable shoes.",
              es: "Se baja a pie desde el aparcamiento público, unos diez minutos con escaleras. Lleva agua y calzado cómodo." } },
  { cat: "spiaggia", name: "Playa de la Tejita", zone: "El Médano", at: [28.0335, -16.5560],
    tipo: "scenografica", sabbia: "scura",
    text: { it: "La spiaggia naturale più grande dell'isola, sotto il cono rosso della Montaña Roja. Niente palazzi.",
            en: "The island's largest natural beach, below the red cone of Montaña Roja. No buildings.",
            es: "La playa natural más grande de la isla, bajo el cono rojo de la Montaña Roja. Sin edificios." },
    avviso: { it: "Spesso c'è vento forte.", en: "It is often very windy.", es: "Suele haber mucho viento." } },
  { cat: "spiaggia", name: "Playa del Bollullo", zone: "La Orotava", at: [28.4204, -16.5093],
    tipo: "scenografica", sabbia: "nera",
    text: { it: "Sabbia nera in fondo a una scogliera, fra i bananeti. Si scende a piedi.",
            en: "Black sand at the foot of a cliff, among banana plantations. You walk down to it.",
            es: "Arena negra al pie de un acantilado, entre plataneras. Se baja a pie." },
    avviso: { it: "Mare del nord: onde e correnti forti. Con mare mosso il bagno è vietato, guarda la bandiera.",
              en: "North coast sea: strong waves and currents. In rough sea swimming is banned, check the flag.",
              es: "Mar del norte: olas y corrientes fuertes. Con mar agitado se prohíbe el baño, mira la bandera." } },
  { cat: "spiaggia", name: "Playa Jardín", zone: "Puerto de la Cruz", at: [28.4146, -16.5627],
    tipo: "scenografica", sabbia: "nera",
    text: { it: "Sabbia nera fra i giardini, con il Teide che spunta dietro la città.",
            en: "Black sand among gardens, with Teide rising behind the town.",
            es: "Arena negra entre jardines, con el Teide asomando detrás de la ciudad." },
    avviso: { it: "Mare del nord: guarda la bandiera prima di fare il bagno.",
              en: "North coast sea: check the flag before swimming.",
              es: "Mar del norte: mira la bandera antes de bañarte." } },
  { cat: "spiaggia", name: "Playa de los Guíos", zone: "Los Gigantes", at: [28.2440, -16.8420],
    tipo: "scenografica", sabbia: "nera",
    text: { it: "Piccola e nera, proprio sotto le scogliere di Los Gigantes.",
            en: "Small and black, right below the Los Gigantes cliffs.",
            es: "Pequeña y negra, justo debajo de los acantilados de Los Gigantes." },
    avviso: { it: "Dalla scogliera possono cadere pietre: una parte della spiaggia può essere chiusa. Rispetta transenne e cartelli.",
              en: "Stones can fall from the cliff: part of the beach may be closed. Respect barriers and signs.",
              es: "Del acantilado pueden caer piedras: parte de la playa puede estar cerrada. Respeta vallas y carteles." } },
  { cat: "spiaggia", name: "Playa de Benijo", zone: "Anaga", at: [28.5704, -16.1882],
    tipo: "scenografica", sabbia: "nera", stato: "chiusa",
    text: { it: "Sabbia nera e scogli che escono dal mare. Oggi si guarda solo dall'alto, ed è bellissima al tramonto.",
            en: "Black sand and rocks rising from the sea. Today you can only see it from above, and it is beautiful at sunset.",
            es: "Arena negra y roques que salen del mar. Hoy solo se mira desde arriba, y es preciosa al atardecer." },
    avviso: { it: "Chiusa dal 2024 per il rischio di frane: non si scende in spiaggia, e chi entra può essere multato.",
              en: "Closed since 2024 because of the risk of rockfalls: you cannot go down to the beach, and those who enter can be fined.",
              es: "Cerrada desde 2024 por riesgo de desprendimientos: no se baja a la playa, y quien entra puede ser multado." } },
  { cat: "spiaggia", name: "Playa del Duque", zone: "Costa Adeje", at: [28.0935, -16.7405],
    tipo: "comoda", sabbia: "dorata",
    text: { it: "Sabbia chiara, lettini e una passeggiata sul mare fino a Fañabé.",
            en: "Light sand, sunbeds and a seafront walk all the way to Fañabé.",
            es: "Arena clara, hamacas y un paseo junto al mar hasta Fañabé." } },
  { cat: "spiaggia", name: "Playa de Las Vistas", zone: "Los Cristianos", at: [28.0485, -16.7195],
    tipo: "comoda", sabbia: "chiara",
    text: { it: "Lunga, riparata e con poca onda: quella giusta per i bambini.",
            en: "Long, sheltered and with little swell: the right one for children.",
            es: "Larga, resguardada y con poco oleaje: la ideal para los niños." } },
  { cat: "spiaggia", name: "El Médano", zone: "Granadilla", at: [28.0445, -16.5385],
    tipo: "comoda", sabbia: "dorata",
    text: { it: "La spiaggia del kitesurf e del windsurf, con il paese e i bar a due passi.",
            en: "The kitesurfing and windsurfing beach, with the village and bars a few steps away.",
            es: "La playa del kitesurf y el windsurf, con el pueblo y los bares a dos pasos." },
    avviso: { it: "Il vento c'è quasi sempre.", en: "There is almost always wind.", es: "Casi siempre hay viento." } },
  { cat: "spiaggia", name: "Playa de la Arena", zone: "Puerto de Santiago", at: [28.2280, -16.8405],
    tipo: "comoda", sabbia: "nera",
    text: { it: "Sabbia nera fine e tramonti sulla Gomera, con il paese tutto intorno.",
            en: "Fine black sand and sunsets over La Gomera, with the village all around.",
            es: "Arena negra fina y atardeceres sobre La Gomera, con el pueblo alrededor." } },
  { cat: "spiaggia", name: "Playa de La Jaquita", zone: "Alcalá", at: [28.2065, -16.8350],
    tipo: "comoda", sabbia: "scura",
    text: { it: "Una spiaggia scura e tranquilla accanto alle piscine naturali di Alcalá. Bella al tramonto.",
            en: "A quiet dark beach next to the natural pools of Alcalá. Lovely at sunset.",
            es: "Una playa oscura y tranquila junto a las piscinas naturales de Alcalá. Bonita al atardecer." } },
  { cat: "spiaggia", name: "Playa de Almáciga", zone: "Anaga", at: [28.5721, -16.1926],
    tipo: "selvaggia", sabbia: "scura",
    text: { it: "Sabbia nera e onde lunghe davanti alle montagne di Anaga: piace a chi fa surf e a chi fa foto.",
            en: "Black sand and long waves in front of the Anaga mountains: loved by surfers and photographers.",
            es: "Arena negra y olas largas frente a las montañas de Anaga: gusta a surfistas y fotógrafos." },
    avviso: { it: "Onde e correnti forti: non è una spiaggia sicura per il bagno.",
              en: "Strong waves and currents: not a safe beach for swimming.",
              es: "Olas y corrientes fuertes: no es una playa segura para el baño." } },
  { cat: "spiaggia", name: "Playa de El Socorro", zone: "Los Realejos", at: [28.3945, -16.6033],
    tipo: "selvaggia", sabbia: "scura",
    text: { it: "Spiaggia nera del nord fra le scogliere: ci si viene per il surf e per il tramonto.",
            en: "A black north-coast beach between cliffs: people come for the surf and the sunset.",
            es: "Playa negra del norte entre acantilados: se viene por el surf y el atardecer." },
    avviso: { it: "Il mare qui è spesso impegnativo: bagno solo con mare calmo.",
              en: "The sea here is often rough: swim only when it is calm.",
              es: "El mar aquí suele ser exigente: baño solo con el mar en calma." } },
  { cat: "spiaggia", name: "Playa de Antequera", zone: "Anaga", at: [28.5353, -16.1322],
    tipo: "selvaggia", sabbia: "scura",
    text: { it: "Una spiaggia isolata in fondo al suo barranco, senza strade: ci si arriva in barca o con ore di cammino.",
            en: "An isolated beach at the end of its gorge, with no roads: you get there by boat or after hours of walking.",
            es: "Una playa aislada al final de su barranco, sin carreteras: se llega en barco o tras horas de camino." },
    avviso: { it: "Il sentiero è lungo e difficile, non si improvvisa. Correnti forti, e con l'alta marea la sabbia quasi sparisce.",
              en: "The trail is long and hard, not for improvising. Strong currents, and at high tide the sand almost disappears.",
              es: "El sendero es largo y difícil, no se improvisa. Corrientes fuertes, y con la marea alta la arena casi desaparece." } },
  { cat: "spiaggia", name: "Playa de Masca", zone: "Buenavista del Norte", at: [28.2885, -16.8620],
    tipo: "selvaggia", sabbia: "ciottoli", stato: "regolamentata",
    text: { it: "La caletta dove finisce il barranco di Masca, sotto pareti altissime. Ci si arriva a piedi dal barranco o in barca.",
            en: "The cove where the Masca gorge ends, below towering walls. You reach it on foot down the gorge or by boat.",
            es: "La cala donde termina el barranco de Masca, bajo paredes altísimas. Se llega a pie por el barranco o en barco." },
    avviso: { it: "Il sentiero del barranco si fa solo con prenotazione, e si torna in barca. Controlla regole e posti prima di andare.",
              en: "The gorge trail needs a booking, and you return by boat. Check the rules and availability before you go.",
              es: "El sendero del barranco requiere reserva, y se vuelve en barco. Comprueba normas y plazas antes de ir." } },

  // ── 10 punti panoramici ──
  { cat: "panorama", name: "Mirador Roques de García", zone: "Parque Nacional del Teide", at: [28.2228, -16.6331],
    text: { it: "Le rocce scolpite dal vento con il Teide dietro: la foto più famosa dell'isola.",
            en: "Wind-carved rocks with Teide behind them: the island's most famous photo.",
            es: "Rocas talladas por el viento con el Teide detrás: la foto más famosa de la isla." } },
  { cat: "panorama", name: "Mirador de Chipeque", zone: "La Esperanza", at: [28.3739, -16.4638],
    text: { it: "A quasi 1900 metri, sopra il mare di nubi, con il Teide davanti. Il tramonto è il momento.",
            en: "At almost 1,900 metres, above the sea of clouds, with Teide ahead. Sunset is the time.",
            es: "A casi 1.900 metros, sobre el mar de nubes, con el Teide delante. El atardecer es el momento." } },
  { cat: "panorama", name: "Mirador Cruz del Carmen", zone: "Anaga", at: [28.5310, -16.2800],
    text: { it: "La porta del bosco di Anaga: la vista su La Laguna e l'inizio dei sentieri.",
            en: "The gateway to the Anaga forest: the view over La Laguna and the start of the trails.",
            es: "La puerta del bosque de Anaga: la vista sobre La Laguna y el inicio de los senderos." } },
  { cat: "panorama", name: "Mirador Pico del Inglés", zone: "Anaga", at: [28.5330, -16.2655],
    text: { it: "Sopra il bosco di Anaga: le creste, le nuvole basse e i due mari.",
            en: "Above the Anaga forest: the ridges, the low clouds and both coasts.",
            es: "Sobre el bosque de Anaga: las crestas, las nubes bajas y los dos mares." } },
  { cat: "panorama", name: "Mirador de Archipenque", zone: "Santiago del Teide", at: [28.2404, -16.8371],
    text: { it: "La vista dall'alto sulle scogliere di Los Gigantes e sul porticciolo.",
            en: "The view from above over the Los Gigantes cliffs and the little harbour.",
            es: "La vista desde arriba de los acantilados de Los Gigantes y el puerto." } },
  { cat: "panorama", name: "Mirador de Cherfe", zone: "Santiago del Teide", at: [28.2930, -16.8260],
    text: { it: "Sulla strada per Masca, a 1100 metri: la valle, i tornanti e nei giorni chiari La Gomera.",
            en: "On the road to Masca, at 1,100 metres: the valley, the bends and, on clear days, La Gomera.",
            es: "En la carretera de Masca, a 1.100 metros: el valle, las curvas y, en días claros, La Gomera." } },
  { cat: "panorama", name: "Mirador de Humboldt", zone: "La Orotava", at: [28.4078, -16.5073],
    text: { it: "La valle dell'Orotava verde fino al mare, con il Teide in cima.",
            en: "The Orotava valley green all the way to the sea, with Teide on top.",
            es: "El valle de La Orotava verde hasta el mar, con el Teide en lo alto." } },
  { cat: "panorama", name: "Mirador de la Garañona", zone: "El Sauzal", at: [28.4840, -16.4280],
    text: { it: "Una terrazza a picco sull'oceano, quasi trecento metri sopra le onde.",
            en: "A terrace hanging over the ocean, almost three hundred metres above the waves.",
            es: "Una terraza sobre el océano, casi trescientos metros por encima de las olas." } },
  { cat: "panorama", name: "Mirador de Ortuño", zone: "La Victoria de Acentejo", at: [28.4056, -16.4239],
    text: { it: "Fra i pini, sulla strada del Teide: da qui si vede il mare di nubi.",
            en: "Among the pines, on the road to Teide: from here you see the sea of clouds.",
            es: "Entre pinos, en la carretera del Teide: desde aquí se ve el mar de nubes." } },
  { cat: "panorama", name: "Mirador de La Centinela", zone: "San Miguel de Abona", at: [28.0786, -16.6407],
    text: { it: "Tutto il sud in un colpo d'occhio, fino al mare e ai vulcani spenti.",
            en: "The whole south at a glance, down to the sea and the extinct volcanoes.",
            es: "Todo el sur de un vistazo, hasta el mar y los volcanes apagados." } },

  // ── 10 posti segreti ──
  { cat: "segreto", name: "Paisaje Lunar", zone: "Vilaflor", at: [28.1600, -16.6370],
    text: { it: "Torri di pietra pomice bianca in mezzo alla pineta: sembra la luna. Ci si arriva a piedi.",
            en: "White pumice towers in the middle of the pine forest: it looks like the moon. You get there on foot.",
            es: "Torres de piedra pómez blanca en medio del pinar: parece la luna. Se llega a pie." } },
  { cat: "segreto", name: "Sanatorio de Abades", zone: "Arico", at: [28.1390, -16.4435],
    text: { it: "Il villaggio fantasma sul mare, costruito e mai aperto. Si guarda da fuori.",
            en: "The ghost village by the sea, built and never opened. Look at it from outside.",
            es: "El pueblo fantasma junto al mar, construido y nunca abierto. Se mira desde fuera." } },
  { cat: "segreto", name: "El Pijaral", zone: "Anaga", at: [28.5480, -16.2000],
    text: { it: "Il bosco incantato di Anaga, alberi coperti di muschio. Serve il permesso gratuito, da chiedere prima.",
            en: "Anaga's enchanted forest, trees covered in moss. You need a free permit, booked in advance.",
            es: "El bosque encantado de Anaga, árboles cubiertos de musgo. Hace falta el permiso gratuito, pedido antes." } },
  { cat: "segreto", name: "Chinamada", zone: "Anaga", at: [28.5570, -16.2950],
    text: { it: "Il paesino dove si vive ancora nelle case scavate nella roccia.",
            en: "The hamlet where people still live in houses dug into the rock.",
            es: "El caserío donde todavía se vive en casas excavadas en la roca." } },
  { cat: "segreto", name: "Playa del Roque de las Bodegas", zone: "Taganana", at: [28.5698, -16.2049],
    text: { it: "Una caletta nera con due ristorantini di pesce, dove finisce la strada.",
            en: "A little black cove with two small fish restaurants, where the road ends.",
            es: "Una cala negra con dos pequeños restaurantes de pescado, donde acaba la carretera." } },
  { cat: "segreto", name: "Charco de la Laja", zone: "San Juan de la Rambla", at: [28.3950, -16.6450],
    text: { it: "Una piscina naturale fra le rocce nere. Solo col mare calmo.",
            en: "A natural pool among the black rocks. Only when the sea is calm.",
            es: "Una piscina natural entre las rocas negras. Solo con el mar en calma." } },
  { cat: "segreto", name: "Charco del Viento", zone: "La Guancha", at: [28.3858, -16.6905],
    text: { it: "Pozze di lava lungo la costa, poca gente e tanto silenzio. Solo col mare calmo.",
            en: "Lava pools along the coast, few people and lots of quiet. Only when the sea is calm.",
            es: "Charcos de lava junto a la costa, poca gente y mucho silencio. Solo con el mar en calma." } },
  { cat: "segreto", name: "Punta de Teno", zone: "Buenavista del Norte", at: [28.3421, -16.9229],
    text: { it: "Il faro all'estremo ovest, sotto le scogliere di Teno. In certi orari la strada è chiusa alle auto: controlla prima.",
            en: "The lighthouse at the far west, below the Teno cliffs. At some times the road is closed to cars: check first.",
            es: "El faro en el extremo oeste, bajo los acantilados de Teno. A ciertas horas la carretera está cerrada a los coches: compruébalo antes." } },
  { cat: "segreto", name: "Cueva del Viento", zone: "Icod de los Vinos", at: [28.3530, -16.7050],
    text: { it: "Una galleria di lava lunga chilometri, sotto Icod. Si entra solo con la visita prenotata.",
            en: "A lava tunnel kilometres long, under Icod. You can only enter on a booked visit.",
            es: "Un tubo volcánico de kilómetros, bajo Icod. Solo se entra con la visita reservada." } },
  { cat: "segreto", name: "Montaña Amarilla", zone: "Costa del Silencio", at: [28.0080, -16.6410],
    text: { it: "Un vulcano giallo tagliato dal mare: rocce a strati e acqua trasparente.",
            en: "A yellow volcano cut open by the sea: layered rocks and clear water.",
            es: "Un volcán amarillo cortado por el mar: rocas en capas y agua transparente." } },

  // ── 10 punti di interesse ──
  { cat: "interesse", name: "Teleférico del Teide", zone: "Parque Nacional del Teide", at: [28.2553, -16.6180],
    text: { it: "La funivia che sale quasi in cima al vulcano più alto di Spagna.",
            en: "The cable car that goes almost to the top of Spain's highest volcano.",
            es: "El teleférico que sube casi a la cima del volcán más alto de España." } },
  { cat: "interesse", name: "Masca", zone: "Buenavista del Norte", at: [28.3060, -16.8420],
    text: { it: "Il paesino appeso fra le montagne di Teno. Il sentiero del barranco va prenotato.",
            en: "The village hanging among the Teno mountains. The gorge trail must be booked.",
            es: "El caserío colgado entre las montañas de Teno. El sendero del barranco hay que reservarlo." } },
  { cat: "interesse", name: "Drago Milenario", zone: "Icod de los Vinos", at: [28.3667, -16.7213],
    text: { it: "L'albero simbolo delle Canarie: un drago di centinaia di anni in un giardino.",
            en: "The symbol of the Canary Islands: a dragon tree hundreds of years old in a garden.",
            es: "El árbol símbolo de Canarias: un drago de cientos de años en un jardín." } },
  { cat: "interesse", name: "Garachico", zone: "Garachico", at: [28.3735, -16.7640],
    text: { it: "Il paese ricostruito dopo l'eruzione, con le piscine naturali nella lava.",
            en: "The town rebuilt after the eruption, with natural pools in the lava.",
            es: "El pueblo reconstruido tras la erupción, con piscinas naturales en la lava." } },
  { cat: "interesse", name: "San Cristóbal de La Laguna", zone: "La Laguna", at: [28.4880, -16.3140],
    text: { it: "Il centro storico patrimonio UNESCO: case colorate, chiese e vie a piedi.",
            en: "The UNESCO old town: colourful houses, churches and pedestrian streets.",
            es: "El casco histórico patrimonio de la UNESCO: casas de colores, iglesias y calles peatonales." } },
  { cat: "interesse", name: "La Orotava", zone: "La Orotava", at: [28.3907, -16.5226],
    text: { it: "Balconi di legno, giardini e palazzi antichi nel cuore della valle.",
            en: "Wooden balconies, gardens and old mansions in the heart of the valley.",
            es: "Balcones de madera, jardines y casonas antiguas en el corazón del valle." } },
  { cat: "interesse", name: "Pirámides de Güímar", zone: "Güímar", at: [28.3205, -16.4130],
    text: { it: "Sei piramidi a gradini di pietra lavica, in un parco con giardini e museo.",
            en: "Six stepped pyramids of lava stone, in a park with gardens and a museum.",
            es: "Seis pirámides escalonadas de piedra volcánica, en un parque con jardines y museo." } },
  { cat: "interesse", name: "Loro Parque", zone: "Puerto de la Cruz", at: [28.4094, -16.5640],
    text: { it: "Il grande parco degli animali del nord: pappagalli, pinguini, delfini e orche.",
            en: "The big animal park in the north: parrots, penguins, dolphins and orcas.",
            es: "El gran parque de animales del norte: loros, pingüinos, delfines y orcas." } },
  { cat: "interesse", name: "Siam Park", zone: "Costa Adeje", at: [28.0724, -16.7262],
    text: { it: "Il parco acquatico a tema thailandese, con scivoli e un'onda gigante.",
            en: "The Thai-themed water park, with slides and a giant wave.",
            es: "El parque acuático de temática tailandesa, con toboganes y una ola gigante." } },
  { cat: "interesse", name: "Auditorio de Tenerife", zone: "Santa Cruz", at: [28.4557, -16.2524],
    text: { it: "La vela bianca di Calatrava sul mare di Santa Cruz.",
            en: "Calatrava's white sail by the sea in Santa Cruz.",
            es: "La vela blanca de Calatrava junto al mar de Santa Cruz." } }

  // ── ristoranti: la categoria e' pronta (MAP_CATS.ristorante), mancano i nomi.
  // Li sceglie il proprietario; col primo ristorante torna anche il bottone
  // "Ristoranti" in mappa.html (data-map-cat="ristorante").
];

// Le citta' scritte sull'isola, solo per orientarsi: non si toccano.
const MAP_TOWNS = [
  { name: "Santa Cruz", at: [28.4636, -16.2518] },
  { name: "La Laguna", at: [28.4874, -16.3159] },
  { name: "Puerto de la Cruz", at: [28.4140, -16.5480] },
  { name: "Los Gigantes", at: [28.2450, -16.8400] },
  { name: "Costa Adeje", at: [28.0900, -16.7300] },
  { name: "Los Cristianos", at: [28.0510, -16.7170] },
  { name: "El Médano", at: [28.0450, -16.5360] }
];
const MAP_TEIDE = [28.2724, -16.6425];

// Il contorno di Tenerife, [longitudine, latitudine] come vuole GeoJSON.
// Viene da @geo-maps/earth-lands-100m (OpenStreetMap, precisione 100 m).
const MAP_COAST = [[-16.5228,28.4174],[-16.5035,28.4248],[-16.4939,28.4406],[-16.4876,28.4375],[-16.4755,28.442],[-16.47,28.4486],[-16.4744,28.4535],[-16.4673,28.4554],[-16.466,28.4599],[-16.4558,28.4601],[-16.4567,28.4686],[-16.4491,28.4739],[-16.4518,28.4772],[-16.4453,28.4743],[-16.4442,28.4802],[-16.4295,28.4883],[-16.4198,28.5125],[-16.4216,28.5177],[-16.3984,28.5338],[-16.3976,28.5385],[-16.3804,28.548],[-16.3656,28.5452],[-16.3545,28.5497],[-16.3539,28.5534],[-16.334,28.5576],[-16.3341,28.5717],[-16.3296,28.5771],[-16.3193,28.579],[-16.3158,28.5712],[-16.3071,28.5744],[-16.2974,28.5691],[-16.288,28.5711],[-16.2855,28.5765],[-16.2745,28.5721],[-16.2725,28.578],[-16.257,28.5693],[-16.2432,28.5718],[-16.2237,28.5654],[-16.1933,28.5722],[-16.1721,28.5859],[-16.1684,28.584],[-16.1581,28.5891],[-16.1323,28.5812],[-16.1341,28.5739],[-16.1264,28.5713],[-16.1267,28.5637],[-16.1199,28.5593],[-16.1194,28.5536],[-16.1267,28.5481],[-16.1294,28.5368],[-16.1256,28.5321],[-16.1353,28.5338],[-16.1431,28.5214],[-16.1563,28.5228],[-16.167,28.5183],[-16.1806,28.5081],[-16.1867,28.5082],[-16.1957,28.4965],[-16.2111,28.4928],[-16.2027,28.4991],[-16.2252,28.4837],[-16.2284,28.4829],[-16.2197,28.4894],[-16.2369,28.4856],[-16.2462,28.471],[-16.2434,28.469],[-16.2356,28.4791],[-16.247,28.4557],[-16.2422,28.466],[-16.2428,28.4681],[-16.249,28.4545],[-16.2698,28.4472],[-16.3007,28.4143],[-16.3203,28.4],[-16.3337,28.4006],[-16.3472,28.3867],[-16.3604,28.3794],[-16.3609,28.3686],[-16.3694,28.3538],[-16.3593,28.3195],[-16.3616,28.3045],[-16.3835,28.2849],[-16.3873,28.2646],[-16.3946,28.2581],[-16.4096,28.2237],[-16.4247,28.2046],[-16.421,28.1985],[-16.4303,28.1737],[-16.425,28.1683],[-16.4271,28.1642],[-16.4315,28.1646],[-16.4344,28.1568],[-16.4257,28.1493],[-16.4333,28.1411],[-16.4396,28.1426],[-16.4417,28.1351],[-16.4489,28.1346],[-16.4488,28.1294],[-16.463,28.1206],[-16.4621,28.1139],[-16.4899,28.0902],[-16.4927,28.0786],[-16.5029,28.077],[-16.5066,28.0677],[-16.5145,28.0639],[-16.5154,28.0593],[-16.5207,28.0594],[-16.5253,28.0502],[-16.5317,28.0496],[-16.5341,28.0427],[-16.5413,28.0422],[-16.5413,28.0289],[-16.5469,28.0248],[-16.5576,28.0313],[-16.5955,28.0292],[-16.6132,28.0189],[-16.6109,28.0221],[-16.6255,28.0186],[-16.6309,28.0098],[-16.6383,28.0093],[-16.6436,28.0038],[-16.6612,28.0089],[-16.6788,27.9981],[-16.6939,27.9997],[-16.7076,28.0115],[-16.7045,28.0269],[-16.7112,28.0471],[-16.7183,28.05],[-16.7174,28.0459],[-16.7242,28.052],[-16.7326,28.051],[-16.7372,28.055],[-16.7326,28.0653],[-16.7378,28.0866],[-16.7498,28.0924],[-16.7625,28.1099],[-16.7694,28.1096],[-16.7682,28.1136],[-16.7726,28.1127],[-16.7794,28.1202],[-16.8043,28.1578],[-16.8069,28.1745],[-16.8197,28.1807],[-16.828,28.1998],[-16.8374,28.2075],[-16.8362,28.2174],[-16.8464,28.2392],[-16.8384,28.2526],[-16.8409,28.2643],[-16.8507,28.2687],[-16.8501,28.2728],[-16.8593,28.2748],[-16.8617,28.2879],[-16.8707,28.2995],[-16.88,28.3029],[-16.8804,28.3124],[-16.8944,28.3228],[-16.8967,28.332],[-16.9159,28.3424],[-16.9259,28.3419],[-16.9207,28.3429],[-16.9236,28.3538],[-16.9178,28.3609],[-16.905,28.3652],[-16.891,28.3633],[-16.8853,28.3689],[-16.8712,28.3712],[-16.8701,28.3756],[-16.8602,28.3756],[-16.849,28.3881],[-16.8417,28.3871],[-16.8412,28.3906],[-16.8329,28.393],[-16.8257,28.3922],[-16.8254,28.3872],[-16.8083,28.3762],[-16.8044,28.3791],[-16.7922,28.3734],[-16.774,28.3746],[-16.7683,28.3708],[-16.7649,28.3756],[-16.7551,28.375],[-16.7518,28.3707],[-16.7343,28.3824],[-16.7307,28.377],[-16.7248,28.3769],[-16.7193,28.3877],[-16.7132,28.3838],[-16.7013,28.3837],[-16.6946,28.3873],[-16.694,28.3959],[-16.6932,28.3927],[-16.6808,28.3906],[-16.6755,28.3944],[-16.6742,28.402],[-16.6708,28.399],[-16.6581,28.4015],[-16.6528,28.3958],[-16.6442,28.3986],[-16.6375,28.3942],[-16.6041,28.394],[-16.5973,28.4004],[-16.5883,28.3981],[-16.5782,28.4051],[-16.5728,28.4042],[-16.5547,28.4188],[-16.546,28.4175],[-16.5434,28.421],[-16.5395,28.4204],[-16.5401,28.4168],[-16.5228,28.4174]];

let mapState = { cat: "tutti", map: null, markers: [], open: null, groups: new Set() };

function mapEsc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function mapIconSvg(cat) {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + MAP_CATS[cat].icon + "</svg>";
}

// "Montaña Amarilla" -> "montana-amarilla": il nome nell'indirizzo, per i link
// che arrivano dalla home (mappa.html?cat=segreto&punto=chinamada).
function mapSlug(s) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Le etichette sotto la zona: lo stato (se non e' aperta), il tipo e la sabbia.
function mapTagsHtml(p) {
  const tags = [];
  if (p.stato) tags.push('<span class="map-chip is-' + p.stato + '">' + mapEsc(t("map.stato." + p.stato)) + "</span>");
  if (p.tipo) tags.push('<span class="map-chip">' + mapEsc(t("map.tipo." + p.tipo)) + "</span>");
  if (p.sabbia) tags.push('<span class="map-chip">' + mapEsc(t("map.sabbia." + p.sabbia)) + "</span>");
  return tags.length ? '<span class="map-chips">' + tags.join("") + "</span>" : "";
}

// Il pannello che sale dal basso quando si tocca un posto: le foto in cima
// (si sfogliano col dito), poi cos'e' e il bottone per arrivarci. Era un
// fumetto sulla mappa, ma con le foto diventava piu' alto della mappa stessa.
// Le foto stanno in mappa-foto.js (MAP_PHOTOS), con autore e licenza.
function mapSheetHtml(p) {
  const lang = getLang();
  const dir = "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(p.q || p.name + ", " + p.zone + ", Tenerife");
  const photos = (typeof MAP_PHOTOS !== "undefined" && MAP_PHOTOS[mapSlug(p.name)]) || [];
  const gallery = photos.length
    ? '<div class="map-sheet-photos" data-map-photos>' + photos.map((f, k) =>
        '<figure class="map-sheet-photo">' +
          '<img src="./assets/mappa/' + mapEsc(f.f) + '" alt="' + mapEsc(p.name) + '" width="720" height="480"' +
            (k ? ' loading="lazy"' : "") + ' onerror="this.parentNode.classList.add(\'is-missing\')" />' +
          '<figcaption>' + mapEsc(t("map.photoBy")) + " " +
            '<a href="' + mapEsc(f.url) + '" target="_blank" rel="noopener noreferrer">' + mapEsc(f.by) + "</a> · " + mapEsc(f.lic) +
          "</figcaption>" +
        "</figure>").join("") + "</div>" +
      (photos.length > 1 ? '<div class="map-sheet-dots" aria-hidden="true">' + photos.map((_, k) => "<span" + (k ? "" : ' class="is-on"') + "></span>").join("") + "</div>" : "")
    : "";
  return gallery +
    '<div class="map-sheet-body">' +
      '<span class="map-pop-cat map-cat-' + p.cat + '">' + mapEsc(t(MAP_CATS[p.cat].label)) +
        (p.esempio ? ' · <em>' + mapEsc(t("map.example")) + "</em>" : "") + "</span>" +
      '<h2 id="mapSheetTitle">' + mapEsc(p.name) + "</h2>" +
      '<span class="map-pop-zone">' + mapEsc(p.zone) + "</span>" +
      mapTagsHtml(p) +
      "<p>" + mapEsc(p.text[lang] || p.text.it) + "</p>" +
      (p.avviso ? '<p class="map-warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.2v.1"/></svg><span>' + mapEsc(p.avviso[lang] || p.avviso.it) + "</span></p>" : "") +
      '<a class="btn btn-primary btn-block" href="' + dir + '" target="_blank" rel="noopener noreferrer">' + mapEsc(t("map.go")) + "</a>" +
    "</div>";
}

function openMapSheet(i) {
  const sheet = document.querySelector("[data-map-sheet]");
  if (!sheet) return;
  mapState.open = i;
  sheet.querySelector("[data-map-sheet-content]").innerHTML = mapSheetHtml(MAP_POINTS[i]);
  sheet.hidden = false;
  sheet.scrollTop = 0;
  document.body.classList.add("map-sheet-open");
  mapState.markers.forEach((m, k) => {
    const node = m.getElement();
    if (node) node.classList.toggle("is-selected", k === i);
  });
  // I pallini sotto le foto seguono la foto in vista.
  const strip = sheet.querySelector("[data-map-photos]");
  const dots = sheet.querySelectorAll(".map-sheet-dots span");
  if (strip && dots.length) {
    strip.addEventListener("scroll", () => {
      const k = Math.round(strip.scrollLeft / strip.clientWidth);
      dots.forEach((d, j) => d.classList.toggle("is-on", j === k));
    }, { passive: true });
  }
  // La mappa sale in cima allo schermo, cosi' il pannello non la copre.
  const el = document.getElementById("islaMap");
  const top = el.getBoundingClientRect().top + window.scrollY - 90;
  if (Math.abs(window.scrollY - top) > 40) window.scrollTo({ top, behavior: "smooth" });
  sheet.querySelector("[data-map-sheet-close]").focus({ preventScroll: true });
}

function closeMapSheet() {
  const sheet = document.querySelector("[data-map-sheet]");
  if (!sheet || sheet.hidden) return;
  sheet.hidden = true;
  document.body.classList.remove("map-sheet-open");
  const i = mapState.open;
  mapState.open = null;
  mapState.markers.forEach(m => { const n = m.getElement(); if (n) n.classList.remove("is-selected"); });
  if (i != null && mapState.markers[i].getElement()) mapState.markers[i].getElement().focus({ preventScroll: true });
}

// Porta il punto in vista nella parte alta della mappa e apre il pannello.
function showMapPoint(i, animate) {
  const map = mapState.map;
  const z = Math.max(map.getZoom(), 11);
  if (animate) map.flyTo(MAP_POINTS[i].at, z, { duration: 0.8 });
  else map.setView(MAP_POINTS[i].at, z, { animate: false });
  openMapSheet(i);
}

// L'elenco sotto la mappa, chiuso in un pulsante per categoria: si tocca e
// si apre l'elenco di quei posti, si ritocca e si chiude. Piu' gruppi possono
// stare aperti insieme. Se in alto si sceglie un filtro, resta solo il suo
// gruppo, ed e' gia' aperto.
const MAP_GROUP_ORDER = ["spiaggia", "panorama", "segreto", "interesse", "ristorante"];

function renderMapList() {
  const box = document.querySelector("[data-map-list]");
  if (!box) return;
  const lang = getLang();
  const cats = MAP_GROUP_ORDER.filter(c =>
    MAP_POINTS.some(p => p.cat === c) && (mapState.cat === "tutti" || mapState.cat === c));
  box.innerHTML = cats.map(c => {
    const items = MAP_POINTS.map((p, i) => ({ p, i })).filter(x => x.p.cat === c);
    const open = mapState.cat === c || mapState.groups.has(c);
    return '<section class="map-group map-cat-' + c + (open ? " is-open" : "") + '">' +
      '<button type="button" class="map-group-head" data-map-group="' + c + '" aria-expanded="' + open + '" aria-controls="mapGroup-' + c + '">' +
        '<span class="map-dot">' + mapIconSvg(c) + "</span>" +
        '<span class="map-group-name">' + mapEsc(t(MAP_CATS[c].label)) + "</span>" +
        '<span class="map-group-count">' + items.length + "</span>" +
        '<svg class="map-group-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>' +
      "</button>" +
      '<ul class="map-group-list" id="mapGroup-' + c + '"' + (open ? "" : " hidden") + ">" +
      (c === "spiaggia" ? '<li class="map-group-note">' + mapEsc(t("map.beachNote")) + "</li>" : "") +
      items.map(({ p, i }) =>
        '<li><button type="button" class="map-item" data-map-point="' + i + '">' +
          '<span class="map-dot map-cat-' + p.cat + '">' + mapIconSvg(p.cat) + "</span>" +
          '<span class="map-item-body"><strong>' + mapEsc(p.name) + (p.esempio ? ' <em class="map-tag">' + mapEsc(t("map.example")) + "</em>" : "") +
            (p.stato ? ' <em class="map-tag is-' + p.stato + '">' + mapEsc(t("map.stato." + p.stato)) + "</em>" : "") + "</strong>" +
          '<span class="map-item-zone">' + mapEsc(p.zone) + "</span>" +
          '<span class="map-item-text">' + mapEsc(p.text[lang] || p.text.it) + "</span></span>" +
        "</button></li>").join("") +
      "</ul></section>";
  }).join("");
}

function applyMapFilter() {
  const map = mapState.map;
  mapState.markers.forEach((m, i) => {
    const on = mapState.cat === "tutti" || MAP_POINTS[i].cat === mapState.cat;
    if (on && !map.hasLayer(m)) m.addTo(map);
    if (!on && map.hasLayer(m)) m.remove();
  });
  document.querySelectorAll("[data-map-cat]").forEach(b => {
    const on = b.dataset.mapCat === mapState.cat;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  renderMapList();
  if (mapState.open != null && mapState.cat !== "tutti" && MAP_POINTS[mapState.open].cat !== mapState.cat) closeMapSheet();
}

function initMap() {
  const el = document.getElementById("islaMap");
  if (!el || typeof L === "undefined") return;

  const bounds = L.latLngBounds([27.95, -17.0], [28.65, -16.05]);
  const map = L.map(el, {
    zoomSnap: 0.25,
    minZoom: 9,
    maxZoom: 12.5,
    maxBounds: bounds.pad(1),
    attributionControl: true,
    zoomControl: true
  });
  map.attributionControl.setPrefix(false);
  map.attributionControl.addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>');
  mapState.map = map;

  L.geoJSON({ type: "Polygon", coordinates: [MAP_COAST] }, {
    interactive: false,
    style: { className: "map-island", weight: 1.2 }
  }).addTo(map);

  MAP_TOWNS.forEach(tw => {
    L.marker(tw.at, {
      interactive: false, keyboard: false,
      icon: L.divIcon({ className: "map-town", html: "<span>" + mapEsc(tw.name) + "</span>", iconSize: null })
    }).addTo(map);
  });
  L.marker(MAP_TEIDE, {
    interactive: false, keyboard: false,
    icon: L.divIcon({ className: "map-peak", html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 20 10 7l3 4 2-2 7 11z"/></svg><span>Teide · 3715 m</span>', iconSize: null })
  }).addTo(map);

  mapState.markers = MAP_POINTS.map(p => {
    const m = L.marker(p.at, {
      title: p.name,
      alt: p.name,
      riseOnHover: true,
      icon: L.divIcon({
        className: "map-pin map-cat-" + p.cat + (p.esempio ? " is-example" : "") + (p.stato === "chiusa" ? " is-closed" : ""),
        html: mapIconSvg(p.cat),
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      })
    });
    m.on("click", () => showMapPoint(MAP_POINTS.indexOf(p), true));
    return m.addTo(map);
  });
  // Toccare il mare o l'isola fuori dai pallini chiude il pannello.
  map.on("click", closeMapSheet);
  document.querySelector("[data-map-sheet-close]").addEventListener("click", closeMapSheet);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMapSheet(); });

  map.fitBounds(L.latLngBounds([27.99, -16.93], [28.59, -16.11]), { padding: [6, 6] });

  // Da lontano i punti sono tanti e vicini (a Los Gigantes ce ne sono tre):
  // si fanno piu' piccoli, e i nomi delle citta' compaiono solo ingrandendo,
  // altrimenti finiscono sotto i pallini.
  const zoomClass = () => el.classList.toggle("is-far", map.getZoom() < 10.5);
  map.on("zoomend", zoomClass);
  zoomClass();

  document.querySelectorAll("[data-map-cat]").forEach(b => {
    b.addEventListener("click", () => {
      mapState.cat = b.dataset.mapCat;
      applyMapFilter();
    });
  });

  document.querySelector("[data-map-list]").addEventListener("click", e => {
    const head = e.target.closest("[data-map-group]");
    if (head) {
      const c = head.dataset.mapGroup;
      const open = head.getAttribute("aria-expanded") !== "true";
      if (open) mapState.groups.add(c); else mapState.groups.delete(c);
      // Chiudere il gruppo del filtro scelto vuol dire tornare a "Tutto".
      if (!open && mapState.cat === c) { mapState.cat = "tutti"; applyMapFilter(); return; }
      head.setAttribute("aria-expanded", String(open));
      head.parentNode.classList.toggle("is-open", open);
      document.getElementById("mapGroup-" + c).hidden = !open;
      return;
    }
    const btn = e.target.closest("[data-map-point]");
    if (!btn) return;
    showMapPoint(Number(btn.dataset.mapPoint), true);
  });

  // Si arriva gia' con un filtro o un punto scelto (i link della home).
  const params = new URLSearchParams(location.search);
  if (MAP_CATS[params.get("cat")]) mapState.cat = params.get("cat");
  applyMapFilter();
  const i = MAP_POINTS.findIndex(p => mapSlug(p.name) === params.get("punto"));
  if (i >= 0) {
    if (mapState.cat !== "tutti" && mapState.cat !== MAP_POINTS[i].cat) {
      mapState.cat = MAP_POINTS[i].cat;
      applyMapFilter();
    }
    showMapPoint(i, false);
  }
}

document.addEventListener("DOMContentLoaded", initMap);
document.addEventListener("islalang", () => {
  if (!mapState.map) return;
  renderMapList();
  if (mapState.open != null) openMapSheet(mapState.open);
});

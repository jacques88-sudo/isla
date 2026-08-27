// Catalogo delle attività di Isla, smistate nelle categorie della home.
//
// COME COMPILARE UNA VOCE
//   image      → nome del file dentro assets/. Vuoto = foto ancora da caricare.
//                Piu voci possono indicare lo stesso file: la foto sta in
//                assets/ una volta sola e il telefono la scarica una volta
//                sola, anche se compare in dieci schede diverse.
//   priceFrom  → numero in euro, oppure null se il prezzo non è ancora definito.
//   priceUnit  → facoltativo: si aggiunge dopo il prezzo quando non è "a persona"
//                ma a ore o a gruppo, es. { it: "/ora", en: "/hr", es: "/h" }
//                oppure { it: "a barca", en: "per boat", es: "por barco" }.
//                Quello che inizia con "/" si attacca al prezzo, il resto va
//                staccato: ci pensa il sito.
//   priceTiers → facoltativo: prezzi a scaglioni per numero di persone. La
//                scheda del catalogo mostra comunque priceFrom, la pagina di
//                dettaglio elenca tutti gli scaglioni:
//                    priceTiers: [ { from: 7, to: 10, price: 350 } ]
//   priceAdult → prezzo per adulto, in euro. 0 = non ancora deciso.
//   priceChild → prezzo per bambino, in euro. 0 = non ancora deciso.
//                A 0 le righe NON compaiono sulla pagina: un "€0" davanti a un
//                cliente sembra gratis o rotto. Appena metti un numero vero,
//                la riga si accende da sola.
//   priceInfant → facoltativo: prezzo per i piu' piccoli, in euro. Qui **0 vuol
//                dire davvero gratis**, al contrario di priceAdult e priceChild
//                dove 0 vuol dire "non ancora deciso". Se il campo manca del tutto
//                la riga non compare: e' cosi' che si dice "non lo sappiamo".
//   ages       → facoltativo: le fasce d'eta', scritte come le scrive il fornitore.
//                Di solito bastano dei numeri ("12+", "4-11"), uguali in tutte
//                le lingue. Quando invece c'e' una parola dentro si scrivono
//                nelle tre lingue come tutto il resto:
//                    infant: { it: "0-11 mesi", en: "0-11 months", es: "0-11 meses" }
//                Finiscono fra parentesi accanto alle righe del prezzo:
//                "Adulti (12+)", "Bambini (3-11)", "Neonati (0-2)".
//                    ages: { adult: "12+", child: "3-11", infant: "0-2" }
//   included   → facoltativo: cosa comprende il prezzo. Si scrivono delle parole
//                chiave, non del testo: l'icona e la traduzione nelle tre lingue
//                le mette il sito. Sulla pagina di dettaglio diventano un
//                riquadro "Cosa e' incluso".
//                    included: ["snorkel", "snack", "drinks"]
//                Parole disponibili: snorkel, wetsuit, board, equipment, drinks,
//                snack, fingerfood, lunch, tasting, swimstop, guide, transfer,
//                ferry, ticket, photos, lifejacket, speaker, towels, fuel.
//                Attenzione a due parole che sembrano la stessa cosa e non lo
//                sono: `swimstop` e' la sosta per il bagno e va su tutte le
//                barche, `snorkel` e' maschera e boccaglio dati dal fornitore
//                e va solo dove lo dice lui. Certe barche si fermano ma
//                l'attrezzatura te la porti tu.
//                Per aggiungerne una servono l'icona in tour.js e il testo in
//                i18n.js: una riga per parte.
//   itinerary  → facoltativo: le tappe della giornata, in ordine. `time` si puo'
//                omettere quando l'orario non e' fisso. Diventa un elenco con la
//                linea del tempo sulla pagina di dettaglio.
//                    itinerary: [ { time: "10:00", text: { it: "...", ... } } ]
//   notes      → facoltativo: i consigli pratici, uno per riga. Qui e' **testo
//                libero** e non parole chiave come `included`: "arriva 15 minuti
//                prima", "porta il costume" cambiano troppo da attivita' a
//                attivita' per stare in un vocabolario.
//                    notes: [ { it: "...", en: "...", es: "..." } ]
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
//   transferPriceHidden → facoltativo: metti true quando quanto costa la navetta
//                e' gia' scritto per esteso nella riga `transfer`. I prezzi qui
//                sopra continuano a servire al **totale**, ma non si stampano
//                una seconda volta: due righe che dicono la stessa cosa con
//                parole diverse confondono.
//   languages  → facoltativo: le lingue fra cui il cliente puo' scegliere. Solo
//                dove c'e' questo campo la finestra della richiesta mostra la
//                domanda "In che lingua". Le solite si scrivono cosi':
//                    languages: LINGUE_TOUR
//                e chi ne ha altre scrive la sua lista, nella lingua stessa:
//                    languages: ["English", "Deutsch"]
//                Attenzione: `times: []` (lista **vuota**) non e' come non
//                scrivere il campo. Vuoto vuol dire "non ci sono orari fissi,
//                si concorda" e lascia solo "Da concordare"; il campo che manca
//                fa comparire le fasce segnaposto.
//   times      → facoltativo: gli orari di partenza fra cui scegliere, scritti
//                come li scrive il fornitore. Dove manca, la finestra della
//                richiesta usa le fasce segnaposto di ORARI_PREDEFINITI qui
//                sopra: sostituirle attivita' per attivita' appena l'ufficio
//                manda gli orari veri.
//                    times: ["09:30 - 12:30", "14:00 - 17:00"]
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
//                Ogni variante puo' avere anche:
//                  duration → la durata **di quella variante**, quando e'
//                          diversa da quella della scheda.
//                  zone  → il punto di partenza **di quella variante**, quando
//                          e' diverso da quello della scheda (la gita col
//                          ritrovo nel nord dell'isola, per esempio).
//                  priceAdult e priceChild → i due prezzi **a persona** di
//                          quella variante, quando il prezzo cambia con la
//                          durata. Solo questi entrano nel totale: `price` da
//                          solo no, perche' puo' essere il prezzo del mezzo e
//                          non della persona (il jet ski si paga a moto
//                          d'acqua, non a testa) e moltiplicarlo per le
//                          persone darebbe il doppio. Sul bottone si scrive
//                          `price` se c'e', altrimenti `priceAdult`.
//                  included → le parole di "Cosa e' incluso" che ha **in piu'**
//                          rispetto alla scheda. Si sommano, non sostituiscono:
//                          sulla scheda si scrive quello che vale per tutte le
//                          varianti, sulla variante solo il resto. Il riquadro
//                          si ridisegna a ogni bottone premuto.
//                  desc  → due righe che spiegano quella variante (giorni,
//                          orario, cosa si mangia, dove si fa il bagno).
//                          Compaiono sotto i bottoni, una alla volta: quella
//                          della variante scelta.
//                  times → gli orari di partenza **di quella variante**, quando
//                          dipendono dalla durata (il giro di 2 ore parte alle
//                          11:00 e quello di 3 alle 10:00). Battono il campo
//                          `times` dell'attivita'.
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

// GLI ORARI DI PARTENZA
//
// ⚠ QUESTI SONO SEGNAPOSTO: sono fasce generiche, non gli orari veri delle
// attività. Servono per far funzionare il campo "A che ora" finché l'ufficio
// non manda quelli giusti.
//
// Ogni attività può avere i suoi: si scrive `times: ["09:30 - 12:30", ...]`
// nella sua scheda e quella lista prende il posto di questa. Sono orari, quindi
// si scrivono uguali in tutte e tre le lingue: niente { it, en, es }.
//
// In ogni caso il cliente parte sempre da "Da concordare": il sito non sceglie
// mai un orario al posto suo, e se lui non ne sceglie uno la riga dell'orario
// nel messaggio WhatsApp non compare proprio.
// LE LINGUE DEL TOUR
//
// Si scrivono nella lingua stessa ("Deutsch", non "Tedesco"): un tedesco
// riconosce la sua riga anche se sta guardando il sito in spagnolo, ed e' come
// fanno tutti i siti di prenotazione.
//
// ⚠ QUESTA LISTA E' DA CONFERMARE: sono le cinque lingue che si sentono di piu'
// a Tenerife, non l'elenco vero di una attivita' precisa.
//
// L'opzione compare **solo dove si scrive il campo `languages`**, che l'ufficio
// segnala attivita' per attivita'. Chi ha le lingue solite scrive
// `languages: LINGUE_TOUR`; chi ne ha altre scrive la sua lista.
const LINGUE_TOUR = ["English", "Español", "Deutsch", "Italiano", "Français"];

const ORARI_PREDEFINITI = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00"
];

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
    name: { it: "Sotto le stelle", en: "Under the stars", es: "Bajo las estrellas" },
    image: "Cat-stelle.jpg"
  },
  {
    id: "avventura-motori",
    name: { it: "Avventura", en: "Adventure", es: "Aventura" },
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
    name: { it: "Tour e visite", en: "Tours & sightseeing", es: "Tours y visitas" },
    image: "santa-cruz-taganana.jpg"
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
    included: ["swimstop"],
    desc: {
      it: "Barca riservata solo al tuo gruppo, con percorso e orari concordati. Il prezzo è per l'intera barca, non a persona.",
      en: "A boat reserved for your group alone, with the route and times agreed with you. The price is for the whole boat, not per person.",
      es: "Barco reservado solo para tu grupo, con ruta y horarios acordados. El precio es por el barco entero, no por persona."
    },
    image: "private-charter.jpg",
    published: true
  },
  {
    id: "freebird-catamaran",
    title: "Freebird Catamaran Trip",
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "Da 2 a 4 ore e mezza", en: "2 to 4.5 hours", es: "De 2 a 4,5 horas" },
    priceFrom: 30,
    privateOption: "private-charter",
    priceAdult: 0,
    priceChild: 0,
    // I due prezzi veri stanno dentro le varianti, perche' cambiano con la
    // durata. Qui resta solo quello dei neonati, che e' zero su tutte: e' un
    // prezzo, non un "non lo sappiamo", e la riga "Gratis" si vede sempre.
    priceInfant: 0,
    // 12+ non l'ha detto nessuno, ma discende dalle altre due: se i bambini
    // finiscono a 11 e sopra non c'e' nient'altro, a 12 si paga come un grande.
    ages: { adult: "12+", child: "4-11", infant: "0-3" },
    options: {
      label: { it: "Durata", en: "Duration", es: "Duración" },
      choices: [
        {
          label: { it: "2 ore", en: "2 hours", es: "2 horas" },
          priceAdult: 30,
          priceChild: 15,
          times: ["11:00"],
          desc: {
            it: "Balene e delfini, con sosta bagno davanti a Bahía del Duque. A bordo bevande illimitate, ma niente da mangiare e niente transfer: al porto ci si arriva da soli. Lunedì, mercoledì e venerdì, partenza alle 11:00.",
            en: "Whales and dolphins, with a swim stop off Bahía del Duque. Unlimited drinks on board, but no food and no transfer: you make your own way to the harbour. Mondays, Wednesdays and Fridays, leaving at 11:00.",
            es: "Ballenas y delfines, con parada de baño frente a Bahía del Duque. A bordo bebidas ilimitadas, pero sin comida y sin traslado: al puerto se llega por cuenta propia. Lunes, miércoles y viernes, salida a las 11:00."
          }
        },
        {
          label: { it: "3 ore", en: "3 hours", es: "3 horas" },
          priceAdult: 47,
          priceChild: 23,
          included: ["snack", "transfer"],
          times: ["10:00"],
          desc: {
            it: "Balene e delfini, con sosta bagno a Diego Hernández e tempo per stare al sole. A bordo un panino e bevande illimitate. Transfer dall'hotel compreso. Tutti i giorni, partenza alle 10:00.",
            en: "Whales and dolphins, with a swim stop at Diego Hernández and time to sit in the sun. A sandwich and unlimited drinks on board. Hotel transfer included. Every day, leaving at 10:00.",
            es: "Ballenas y delfines, con parada de baño en Diego Hernández y tiempo para tomar el sol. A bordo un bocadillo y bebidas ilimitadas. Traslado desde el hotel incluido. Todos los días, salida a las 10:00."
          }
        },
        {
          label: { it: "4 ore e mezza", en: "4.5 hours", es: "4,5 horas" },
          priceAdult: 62,
          priceChild: 31,
          included: ["lunch", "transfer"],
          times: ["13:00"],
          desc: {
            it: "Il giro lungo: balene e delfini, le scogliere di Los Gigantes e bagno nella baia di Masca. A bordo si pranza, con bevande illimitate. Transfer dall'hotel compreso. Tutti i giorni, partenza alle 13:00.",
            en: "The long trip: whales and dolphins, the cliffs of Los Gigantes and a swim in Masca bay. Lunch on board, with unlimited drinks. Hotel transfer included. Every day, leaving at 13:00.",
            es: "La salida larga: ballenas y delfines, los acantilados de Los Gigantes y baño en la bahía de Masca. Se come a bordo, con bebidas ilimitadas. Traslado desde el hotel incluido. Todos los días, salida a las 13:00."
          }
        },
        {
          label: {
            it: "4 ore e mezza, partenza dal nord",
            en: "4.5 hours, pickup in the north",
            es: "4,5 horas, salida desde el norte"
          },
          priceAdult: 69,
          priceChild: 34,
          included: ["lunch", "transfer"],
          times: ["13:00"],
          desc: {
            it: "Lo stesso giro lungo, Los Gigantes e Masca comprese, per chi alloggia nel nord dell'isola: la navetta ti prende e ti riporta a casa. La barca parte alle 13:00, la navetta passa prima. Martedì, giovedì, venerdì e domenica.",
            en: "The same long trip, for anyone staying in the north of the island: the shuttle picks you up and brings you back. The boat leaves at 13:00, the shuttle comes earlier. Tuesdays, Thursdays, Fridays and Sundays.",
            es: "La misma salida larga, para quien se aloja en el norte de la isla: la lanzadera te recoge y te devuelve. El barco sale a las 13:00, la lanzadera pasa antes. Martes, jueves, viernes y domingos."
          }
        }
      ]
    },
    included: ["swimstop", "drinks", "guide"],
    notes: [
      {
        it: "Il transfer dall'hotel è compreso sul giro di 3 ore e su quello di 4 ore e mezza, dalle zone del sud. Sul giro di 2 ore non c'è: al porto ci si arriva da soli.",
        en: "The hotel transfer is included on the 3-hour and 4.5-hour trips, from the southern areas. It is not included on the 2-hour trip: you make your own way to the harbour.",
        es: "El traslado desde el hotel está incluido en la salida de 3 horas y en la de 4,5 horas, desde las zonas del sur. En la de 2 horas no: al puerto se llega por cuenta propia."
      },
      {
        it: "Puoi anche andare direttamente al porto: Puerto Colón, molo 10. Arriva almeno 10 minuti prima della partenza.",
        en: "You can also go straight to the harbour: Puerto Colón, dock 10. Get there at least 10 minutes before departure.",
        es: "También puedes ir directamente al puerto: Puerto Colón, muelle 10. Llega al menos 10 minutos antes de la salida."
      },
      {
        it: "Le bevande sono illimitate per tutto il giro: acqua, analcoliche, birra e sangria.",
        en: "Drinks are unlimited for the whole trip: water, soft drinks, beer and sangria.",
        es: "Las bebidas son ilimitadas durante toda la salida: agua, refrescos, cerveza y sangría."
      },
      {
        it: "Da mangiare ci sono dei panini, anche vegetariani se lo chiedi quando prenoti. Sul giro di 2 ore ci sono solo le bevande.",
        en: "There are sandwiches to eat, vegetarian ones too if you ask when you book. On the 2-hour trip there are drinks only.",
        es: "Para comer hay bocadillos, también vegetarianos si lo pides al reservar. En la salida de 2 horas solo hay bebidas."
      },
      {
        it: "Si possono aggiungere i lettini balinesi a €25 l'uno, fino a esaurimento.",
        en: "Balinese day beds can be added for €25 each, while they last.",
        es: "Se pueden añadir camas balinesas por 25 € cada una, hasta agotar existencias."
      },
      {
        it: "Se soffri il mal di mare, prendi le tue precauzioni prima di salire a bordo.",
        en: "If you get seasick, take your precautions before boarding.",
        es: "Si te mareas en el mar, toma tus precauciones antes de embarcar."
      }
    ],
    family: true,
    desc: {
      it: "Un catamarano grande che parte da Puerto Colón, con tre giri fra cui scegliere: due ore, tre ore o quello lungo fino alle scogliere di Los Gigantes e alla baia di Masca. Balene e delfini, sosta bagno e bevande illimitate a bordo. L'equipaggio parla più lingue e racconta quello che si vede, e la barca segue le regole per avvicinare gli animali senza disturbarli.",
      en: "A big catamaran out of Puerto Colón, with three trips to choose from: two hours, three hours, or the long one out to the cliffs of Los Gigantes and Masca bay. Whales and dolphins, a swim stop and unlimited drinks on board. The crew speaks several languages and tells you what you are looking at, and the boat follows the rules for approaching the animals without disturbing them.",
      es: "Un catamarán grande que sale de Puerto Colón, con tres salidas a elegir: dos horas, tres horas o la larga hasta los acantilados de Los Gigantes y la bahía de Masca. Ballenas y delfines, parada de baño y bebidas ilimitadas a bordo. La tripulación habla varios idiomas y te cuenta lo que estás viendo, y el barco sigue las normas para acercarse a los animales sin molestarlos."
    },
    image: "catamaran-gigantes-masca.jpg",
    published: true
  },
  {
    id: "royal-delfin",
    title: "Royal Delfin Boat Tour",
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "Da 2 a 4 ore e mezza", en: "2 to 4.5 hours", es: "De 2 a 4,5 horas" },
    priceFrom: 33,
    privateOption: "private-charter",
    priceAdult: 0,
    priceChild: 0,
    // I due prezzi veri stanno dentro le varianti. Qui resta quello dei
    // neonati, zero su tutte: e' un prezzo, non un "non lo sappiamo".
    priceInfant: 0,
    // 12+ discende dai bambini 4-11: sopra gli 11 non c'e' altra fascia.
    ages: { adult: "12+", child: "4-11", infant: "0-3" },
    options: {
      label: { it: "Durata", en: "Duration", es: "Duración" },
      choices: [
        {
          label: { it: "2 ore", en: "2 hours", es: "2 horas" },
          priceAdult: 33,
          priceChild: 20,
          times: ["10:30"],
          desc: {
            it: "Il giro corto, per vedere balene e delfini senza starci mezza giornata. Non c'è la sosta bagno e il pranzo non è compreso: a bordo c'è il bar, dove si paga. Martedì, giovedì e domenica, partenza alle 10:30.",
            en: "The short trip, to see whales and dolphins without giving up half a day. There is no swim stop and lunch is not included: there is a bar on board, where you pay. Tuesdays, Thursdays and Sundays, leaving at 10:30.",
            es: "La salida corta, para ver ballenas y delfines sin dedicarle media jornada. No hay parada de baño y la comida no está incluida: a bordo hay bar, donde se paga. Martes, jueves y domingos, salida a las 10:30."
          }
        },
        {
          label: { it: "3 ore", en: "3 hours", es: "3 horas" },
          priceAdult: 50,
          priceChild: 30,
          times: ["10:30"],
          included: ["swimstop", "lunch", "drinks"],
          desc: {
            it: "Balene e delfini, con sosta bagno e pranzo nella baia di Diego Hernández. Bevande illimitate a bordo. Mercoledì e sabato, partenza alle 10:30.",
            en: "Whales and dolphins, with a swim stop and lunch in Diego Hernández bay. Unlimited drinks on board. Wednesdays and Saturdays, leaving at 10:30.",
            es: "Ballenas y delfines, con parada de baño y comida en la bahía de Diego Hernández. Bebidas ilimitadas a bordo. Miércoles y sábados, salida a las 10:30."
          }
        },
        {
          label: { it: "4 ore e mezza", en: "4.5 hours", es: "4,5 horas" },
          priceAdult: 63,
          priceChild: 40,
          times: ["14:00", "09:30"],
          included: ["swimstop", "lunch", "drinks"],
          desc: {
            it: "Il giro lungo: balene e delfini e bagno nella baia di Masca. Si comincia con la frutta di stagione e si pranza con riso e pollo, bevande comprese. Tutti i giorni alle 14:00; dall'11 luglio al 5 settembre c'è anche la partenza delle 9:30, con un menù diverso.",
            en: "The long trip: whales and dolphins, and a swim in Masca bay. It starts with seasonal fruit and lunch is rice and chicken, drinks included. Every day at 14:00; from 11 July to 5 September there is also a 9:30 departure, with a different menu.",
            es: "La salida larga: ballenas y delfines y baño en la bahía de Masca. Se empieza con fruta de temporada y se come arroz con pollo, bebidas incluidas. Todos los días a las 14:00; del 11 de julio al 5 de septiembre hay también la salida de las 9:30, con un menú distinto."
          }
        },
        {
          label: {
            it: "4 ore e mezza, partenza dal nord",
            en: "4.5 hours, pickup in the north",
            es: "4,5 horas, salida desde el norte"
          },
          priceAdult: 68,
          priceChild: 45,
          // Chi sta nel nord non passa da Puerto Colón: sale sulla navetta a
          // Puerto de la Cruz, e per lui il punto di partenza e' quello.
          zone: "Puerto de la Cruz",
          times: ["14:00"],
          included: ["swimstop", "lunch", "drinks"],
          desc: {
            it: "Lo stesso giro lungo, con bagno a Masca e pranzo a bordo, per chi alloggia nel nord: la navetta parte da Puerto de la Cruz. Tutti i giorni, la barca parte alle 14:00.",
            en: "The same long trip, with the Masca swim and lunch on board, for anyone staying in the north: the shuttle leaves from Puerto de la Cruz. Every day, the boat leaves at 14:00.",
            es: "La misma salida larga, con baño en Masca y comida a bordo, para quien se aloja en el norte: la lanzadera sale desde Puerto de la Cruz. Todos los días, el barco sale a las 14:00."
          }
        }
      ]
    },
    included: ["guide", "transfer"],
    notes: [
      {
        it: "La presa e la riconsegna in hotel sono gratis dai principali alberghi del sud: Los Cristianos, Playa de las Américas, Costa Adeje e La Caleta. Dicci dove stai e ti confermiamo l'orario del passaggio.",
        en: "Hotel pick-up and drop-off are free from the main hotels in the south: Los Cristianos, Playa de las Américas, Costa Adeje and La Caleta. Tell us where you are staying and we'll confirm the pick-up time.",
        es: "La recogida y la vuelta al hotel son gratis desde los principales hoteles del sur: Los Cristianos, Playa de las Américas, Costa Adeje y La Caleta. Dinos dónde te alojas y te confirmamos la hora de recogida."
      },
      {
        it: "Se vieni con la tua macchina: Puerto Colón, pantalán 12. Arriva 20 minuti prima, la guida ti aspetta al cancello 12. Vicino al porto c'è un parcheggio pubblico a pagamento.",
        en: "If you come by car: Puerto Colón, pantalán 12. Get there 20 minutes early — the guide will meet you at gate 12. There is paid public parking near the harbour.",
        es: "Si vienes en coche: Puerto Colón, pantalán 12. Llega 20 minutos antes, el guía te espera en la puerta 12. Cerca del puerto hay aparcamiento público de pago."
      },
      {
        it: "Sul giro di 3 ore e su quelli di 4 ore e mezza il pranzo è compreso, con opzioni senza glutine e vegetariane: chiedile quando prenoti e l'equipaggio le prepara.",
        en: "Lunch is included on the 3-hour and the 4.5-hour trips, with gluten-free and vegetarian options: ask for them when you book and the crew will prepare them.",
        es: "En la salida de 3 horas y en las de 4,5 horas la comida está incluida, con opciones sin gluten y vegetarianas: pídelas al reservar y la tripulación las prepara."
      },
      {
        it: "A bordo c'è il Wi-Fi gratuito, ma in mare la copertura può mancare.",
        en: "There is free Wi-Fi on board, but out at sea the signal can drop.",
        es: "A bordo hay Wi-Fi gratuito, pero en el mar la cobertura puede fallar."
      },
      {
        it: "Il catamarano è per non fumatori ed è attrezzato per chi ha difficoltà motorie.",
        en: "The catamaran is non-smoking and equipped for guests with reduced mobility.",
        es: "El catamarán es para no fumadores y está equipado para personas con movilidad reducida."
      },
      {
        it: "Porta costume e crema solare.",
        en: "Bring swimwear and sunscreen.",
        es: "Trae bañador y crema solar."
      },
      {
        it: "Se soffri il mal di mare, prendi le tue precauzioni prima di salire a bordo.",
        en: "If you get seasick, take your precautions before boarding.",
        es: "Si te mareas en el mar, toma tus precauciones antes de embarcar."
      }
    ],
    family: true,
    image: "royal-delfin.jpg",
    desc: {
      it: "Un catamarano grande, fino a 200 persone, con finestre panoramiche sotto la linea di galleggiamento: balene e delfini si guardano anche da sotto, non solo dal ponte. Si sceglie fra due ore, tre ore o il giro lungo fino alla baia di Masca. La barca segue la carta per la tutela dei cetacei e le guide parlano più lingue.",
      en: "A big catamaran, up to 200 people, with panoramic windows below the waterline: you watch whales and dolphins from underneath as well as from the deck. Choose between two hours, three hours or the long trip out to Masca bay. The boat follows the whale conservation charter and the guides speak several languages.",
      es: "Un catamarán grande, hasta 200 personas, con ventanas panorámicas bajo la línea de flotación: las ballenas y los delfines se ven también desde abajo, no solo desde cubierta. Se elige entre dos horas, tres horas o la salida larga hasta la bahía de Masca. El barco sigue la carta para la protección de los cetáceos y los guías hablan varios idiomas."
    },
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
    priceAdult: 55,
    priceChild: 30,
    priceInfant: 0,
    ages: { adult: "12+", child: "3-11", infant: "0-2" },
    included: ["snorkel", "snack", "drinks", "swimstop"],
    family: true,
    desc: {
      it: "Tre ore in barca a vela da Puerto Colón, con un massimo di 11 persone a bordo. Avvistamento di balene e delfini, sosta per lo snorkeling con attrezzatura inclusa, snack e bevande a bordo.",
      en: "Three hours under sail from Puerto Colón, with a maximum of 11 guests on board. Whale and dolphin watching, a snorkelling stop with gear included, snacks and drinks on board.",
      es: "Tres horas en velero desde Puerto Colón, con un máximo de 11 personas a bordo. Avistamiento de ballenas y delfines, parada para hacer snorkel con equipo incluido, snacks y bebidas a bordo."
    },
    image: "Cat-mare.jpg",
    published: true
  },
  {
    id: "submarine-safari",
    title: "Submarine Safari",
    category: "mare-barche",
    zone: "Marina Amarilla",
    duration: { it: "1 ora", en: "1 hour", es: "1 hora" },
    times: ["10:00", "13:00"],
    languages: LINGUE_TOUR,
    priceFrom: 61,
    priceAdult: 61,
    priceChild: 37,
    // 15+ discende dai bambini 2-14: sopra i 14 non c'e' altra fascia. Sotto i
    // 2 anni invece non c'e' nessuna fascia perche' non si sale proprio: non e'
    // "gratis", quindi niente priceInfant.
    ages: { adult: "15+", child: "2-14" },
    // La navetta dal sud e' compresa; dal nord costa in piu'. `transferPrice`
    // sono i prezzi **completi** con la navetta dal nord, non il supplemento:
    // 61 + 13 e 37 + 8.
    transfer: {
      it: "Dal sud incluso nel prezzo, dal nord €13 a adulto e €8 a bambino.",
      en: "Included in the price from the south; from the north €13 per adult and €8 per child.",
      es: "Desde el sur incluido en el precio; desde el norte 13 € por adulto y 8 € por niño."
    },
    transferPrice: { adult: 74, child: 45 },
    // I due prezzi qui sopra servono al **totale**, non da leggere: quanto costa
    // la navetta e' gia' scritto per esteso nella riga `transfer`, e stamparlo
    // una seconda volta come "Con il transfer" era proprio la confusione che
    // l'ufficio ha segnalato.
    transferPriceHidden: true,
    included: ["transfer", "guide"],
    notes: [
      {
        it: "Si scende tutti i giorni tranne il sabato.",
        en: "It runs every day except Saturday.",
        es: "Se hace todos los días excepto el sábado."
      },
      {
        it: "Si parte dal porto di Marina Amarilla, a San Miguel de Abona, zona Amarilla Golf. Arriva almeno 15 minuti prima.",
        en: "You leave from Marina Amarilla harbour, in San Miguel de Abona, the Amarilla Golf area. Get there at least 15 minutes early.",
        es: "Se sale del puerto de Marina Amarilla, en San Miguel de Abona, zona Amarilla Golf. Llega al menos 15 minutos antes."
      },
      {
        it: "Si sale dai 2 anni in su, e sotto i 16 bisogna essere accompagnati da un adulto.",
        en: "Children can board from age 2, and under-16s must be with an adult.",
        es: "Se puede subir a partir de los 2 años, y los menores de 16 deben ir acompañados por un adulto."
      },
      {
        it: "Prima di salire si fa una spiegazione sulla sicurezza, poi si prende posto.",
        en: "Before boarding there is a safety briefing, then you take your seat.",
        es: "Antes de embarcar se hace una explicación de seguridad y luego se toma asiento."
      },
      {
        it: "Se soffri il mal di mare, prendi le tue precauzioni prima di salire a bordo.",
        en: "If you get seasick, take your precautions before boarding.",
        es: "Si te mareas en el mar, toma tus precauciones antes de embarcar."
      }
    ],
    family: true,
    desc: {
      it: "Il sottomarino giallo scende fra i 30 e i 60 metri, e si guarda il fondale restando all'asciutto. Ogni posto ha il suo oblò e uno schermo che dice a che profondità si è e che temperatura fa fuori. Sotto passano pesci e razze, e ogni tanto anche i delfini. Dura circa un'ora.",
      en: "The yellow submarine goes down between 30 and 60 metres, and you watch the seabed while staying dry. Every seat has its own porthole and a screen telling you how deep you are and the temperature outside. Fish and stingrays go past, and now and then dolphins too. It lasts about an hour.",
      es: "El submarino amarillo baja entre 30 y 60 metros, y se mira el fondo sin mojarse. Cada asiento tiene su ojo de buey y una pantalla que dice a qué profundidad estás y qué temperatura hace fuera. Abajo pasan peces y rayas, y de vez en cuando también delfines. Dura alrededor de una hora."
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
    priceAdult: 75,
    priceChild: 50,
    priceInfant: 0,
    ages: { adult: "12+", child: "3-11", infant: "0-2" },
    included: ["fingerfood", "drinks", "swimstop"],
    notes: [
      { it: "Presentati 15 minuti prima della partenza.",
        en: "Please arrive 15 minutes before departure.",
        es: "Preséntate 15 minutos antes de la salida." },
      { it: "Porta asciugamano, costume e protezione solare.",
        en: "Bring a towel, swimwear and sun protection.",
        es: "Trae toalla, bañador y protección solar." }
    ],
    family: true,
    desc: {
      it: "Catamarano di categoria superiore, con un massimo di 22 persone a bordo: atmosfera rilassata, avvistamento di delfini e balene e aree lounge per stare comodi.",
      en: "An upscale catamaran with a maximum of 22 guests on board: a relaxed atmosphere, dolphin and whale watching, and plush lounging areas.",
      es: "Catamarán de categoría superior, con un máximo de 22 personas a bordo: ambiente relajado, avistamiento de delfines y ballenas y zonas lounge para estar cómodos."
    },
    image: "luxury-catamaran.jpg",
    published: true
  },
  {
    id: "small-group-catamaran",
    title: "Small Group Catamaran",
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "3 o 6 ore", en: "3 or 6 hours", es: "3 o 6 horas" },
    priceFrom: 60,
    priceAdult: 0,
    priceChild: 0,
    priceInfant: 0,
    ages: { adult: "12+", child: "3-11", infant: "0-2" },
    options: {
      label: { it: "Formula", en: "Option", es: "Fórmula" },
      choices: [
        {
          label: { it: "3 ore, in condivisione", en: "3 hours, shared", es: "3 horas, compartido" },
          priceAdult: 60,
          priceChild: 30,
          duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
          times: ["09:30", "12:30"],
          desc: {
            it: "Si sale insieme ad altri e si fa lo stesso giro del charter privato, spendendo meno. Tre ore lungo la costa, con sosta bagno, snorkeling e paella di pollo a bordo. Tutti i giorni alle 9:30 e alle 12:30.",
            en: "You share the boat with others and do the same route as the private charter, for less. Three hours along the coast, with a swim stop, snorkelling and chicken paella on board. Every day at 9:30 and 12:30.",
            es: "Se sube junto a otras personas y se hace la misma ruta que el chárter privado, gastando menos. Tres horas por la costa, con parada de baño, snorkel y paella de pollo a bordo. Todos los días a las 9:30 y a las 12:30."
          }
        },
        {
          label: { it: "Charter privato", en: "Private charter", es: "Chárter privado" },
          price: 800,
          duration: { it: "3 o 6 ore", en: "3 or 6 hours", es: "3 o 6 horas" },
          // Lista vuota, non campo mancante: il charter privato non ha orari
          // fissi, l'ora si concorda. Senza questa riga sarebbero comparse le
          // fasce segnaposto, cioe' degli orari inventati.
          times: [],
          desc: {
            it: "La barca solo per il tuo gruppo: da €800, tre ore oppure sei. Con sei ore si gira più in largo, si vedono più cale e si sta più tempo in acqua. Si può fare anche al tramonto. Il prezzo è della barca intera, non a persona: scrivici quante siete e quante ore vuoi.",
            en: "The boat just for your group: from €800, three hours or six. With six hours you range further, see more coves and stay longer in the water. It can also be done at sunset. The price is for the whole boat, not per person: tell us how many you are and how many hours you want.",
            es: "El barco solo para tu grupo: desde 800 €, tres horas o seis. Con seis horas se va más lejos, se ven más calas y se está más tiempo en el agua. También se puede hacer al atardecer. El precio es del barco entero, no por persona: escríbenos cuántos sois y cuántas horas quieres."
          }
        }
      ]
    },
    included: ["lunch", "drinks", "swimstop", "snorkel", "guide"],
    notes: [
      {
        it: "Le bevande comprese sono analcoliche, birra e acqua.",
        en: "The drinks included are soft drinks, beer and water.",
        es: "Las bebidas incluidas son refrescos, cerveza y agua."
      },
      {
        it: "A bordo c'è la toilette, che su una barca di questo tipo non è scontato.",
        en: "There is a toilet on board, which is not a given on a boat like this.",
        es: "A bordo hay aseo, que en un barco de este tipo no se da por hecho."
      },
      {
        it: "Nel prezzo ci sono anche l'equipaggio e l'assicurazione.",
        en: "The crew and the insurance are included in the price as well.",
        es: "En el precio están también la tripulación y el seguro."
      },
      {
        it: "Presentati 15 minuti prima della partenza.",
        en: "Please arrive 15 minutes before departure.",
        es: "Preséntate 15 minutos antes de la salida."
      },
      {
        it: "Porta asciugamano, costume e protezione solare.",
        en: "Bring a towel, swimwear and sun protection.",
        es: "Trae toalla, bañador y protección solar."
      }
    ],
    family: true,
    desc: {
      it: "Un catamarano che porta fino a 23 persone: quasi nessuna barca privata a Tenerife ne porta più di 12. Si parte da Puerto Colón, si cercano delfini e balene e ci si ferma nelle cale per il bagno e lo snorkeling, con la paella di pollo a bordo. Si sceglie fra il giro di tre ore in condivisione e la barca tutta per sé, per tre o sei ore.",
      en: "A catamaran that takes up to 23 people: hardly any private boat in Tenerife takes more than 12. You leave Puerto Colón, look for dolphins and whales and stop in the coves to swim and snorkel, with chicken paella on board. Choose between the shared three-hour trip and having the boat to yourselves, for three hours or six.",
      es: "Un catamarán que lleva hasta 23 personas: casi ningún barco privado en Tenerife lleva más de 12. Se sale de Puerto Colón, se buscan delfines y ballenas y se para en las calas para bañarse y hacer snorkel, con paella de pollo a bordo. Se elige entre la salida de tres horas compartida y el barco entero para ti, tres horas o seis."
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
    included: ["swimstop"],
    desc: {
      it: "Tre ore su una barca con il fondo trasparente: si guarda il fondale da bordo, poi ci si ferma per il bagno.",
      en: "Three hours on a glass-bottomed boat: you watch the seabed from the deck, then stop for a swim.",
      es: "Tres horas en un barco con fondo de cristal: se mira el fondo desde cubierta y luego hay parada de baño."
    },
    image: "glass-bottom-boat.jpg",
    published: true
  },
  {
    id: "utopia-boat-party",
    title: "Utopia Boat Party",
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    times: ["12:30"],
    priceFrom: 70,
    priceAdult: 0,
    priceChild: 0,
    // Solo la fascia degli adulti: sotto i 18 non si sale, quindi non esistono
    // ne' bambini ne' neonati. Niente priceChild e niente priceInfant: qui non
    // vogliono dire "non lo sappiamo", vogliono dire "non puo' venire".
    ages: { adult: "18+" },
    options: {
      label: { it: "Biglietto", en: "Ticket", es: "Entrada" },
      choices: [
        {
          label: { it: "Basic", en: "Basic", es: "Basic" },
          priceAdult: 70,
          desc: {
            it: "Quattro consumazioni a scelta: superalcolici locali, birra Victoria Málaga o analcoliche.",
            en: "Four drinks of your choice: local spirits, Victoria Málaga beer or soft drinks.",
            es: "Cuatro consumiciones a elegir: licores locales, cerveza Victoria Málaga o refrescos."
          }
        },
        {
          label: { it: "Standard", en: "Standard", es: "Standard" },
          priceAdult: 90,
          desc: {
            it: "Open bar per tutte e tre le ore: birra locale, superalcolici locali e mixer, senza limite.",
            en: "Open bar for the whole three hours: local beer, local spirits and mixers, no limit.",
            es: "Barra libre durante las tres horas: cerveza local, licores locales y refrescos, sin límite."
          }
        },
        {
          label: { it: "Premium", en: "Premium", es: "Premium" },
          priceAdult: 110,
          desc: {
            it: "Open bar con le marche: Absolut, Bacardi, Havana, Beefeater, Disaronno, Malibu, Jim Beam e Ballantine's, più Red Bull e mixer premium.",
            en: "Open bar with the brands: Absolut, Bacardi, Havana, Beefeater, Disaronno, Malibu, Jim Beam and Ballantine's, plus Red Bull and premium mixers.",
            es: "Barra libre con las marcas: Absolut, Bacardi, Havana, Beefeater, Disaronno, Malibu, Jim Beam y Ballantine's, además de Red Bull y refrescos premium."
          }
        },
        {
          label: { it: "VIP", en: "VIP", es: "VIP" },
          priceAdult: 130,
          desc: {
            it: "Tutto quello del Premium, più l'imbarco prioritario e l'accesso all'area VIP, che ha il suo bar.",
            en: "Everything in Premium, plus priority boarding and access to the VIP area, which has its own bar.",
            es: "Todo lo del Premium, más embarque prioritario y acceso a la zona VIP, que tiene su propia barra."
          }
        }
      ]
    },
    included: ["drinks", "swimstop", "photos"],
    notes: [
      {
        it: "Si fa il sabato.",
        en: "It runs on Saturdays.",
        es: "Se hace los sábados."
      },
      {
        it: "Solo maggiorenni: sotto i 18 anni non si sale.",
        en: "Over-18s only: under 18 you cannot board.",
        es: "Solo mayores de edad: por debajo de los 18 años no se sube."
      },
      {
        it: "Il ritrovo è al Black Pearl Bar di Puerto Colón, dove si beve qualcosa insieme prima di salire e dove si torna dopo per l'after. Arriva almeno 15 minuti prima. Al porto c'è parcheggio.",
        en: "You meet at the Black Pearl Bar in Puerto Colón, where everyone has a drink together before boarding and where the after-party is afterwards. Get there at least 15 minutes early. There is parking at the marina.",
        es: "El punto de encuentro es el Black Pearl Bar de Puerto Colón, donde se toma algo juntos antes de subir y donde se vuelve después para el after. Llega al menos 15 minutos antes. En el puerto hay aparcamiento."
      },
      {
        it: "Le foto fatte a bordo dai fotografi si scaricano dopo, gratis.",
        en: "The photos taken on board by the photographers can be downloaded afterwards, free.",
        es: "Las fotos hechas a bordo por los fotógrafos se descargan después, gratis."
      },
      {
        it: "Mangia qualcosa prima di salire e vacci piano con l'alcol prima della partenza: aiuta parecchio col mal di mare.",
        en: "Eat something before boarding and go easy on the alcohol beforehand: it helps a lot with seasickness.",
        es: "Come algo antes de subir y ve con calma con el alcohol antes de salir: ayuda bastante con el mareo."
      },
      {
        it: "Porta costume e crema solare.",
        en: "Bring swimwear and sunscreen.",
        es: "Trae bañador y crema solar."
      }
    ],
    family: false,
    desc: {
      it: "Tre ore di festa in barca da Puerto Colón, con DJ dal vivo, un impianto da 15.000 watt e musica house, reggaeton, hip hop e drum and bass. Si comincia con un bicchiere al Black Pearl e si finisce lì con l'after. Solo maggiorenni. Il biglietto si sceglie in base a quanto si beve: quattro consumazioni, oppure open bar per tutte e tre le ore.",
      en: "Three hours of boat party out of Puerto Colón, with live DJs, a 15,000-watt sound system and house, reggaeton, hip hop and drum and bass. It starts with a drink at the Black Pearl and ends there with the after-party. Over-18s only. You pick your ticket by how much you plan to drink: four drinks, or an open bar for the whole three hours.",
      es: "Tres horas de fiesta en barco desde Puerto Colón, con DJ en directo, un equipo de 15.000 vatios y música house, reggaetón, hip hop y drum and bass. Se empieza con una copa en el Black Pearl y se termina allí con el after. Solo mayores de 18 años. La entrada se elige según cuánto se va a beber: cuatro consumiciones, o barra libre durante las tres horas."
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
    included: ["swimstop"],
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
    duration: { it: "Da 3 a 9 ore", en: "3 to 9 hours", es: "De 3 a 9 horas" },
    times: ["10:00", "13:30"],
    priceFrom: 70,
    priceAdult: 0,
    priceChild: 0,
    // 12+ discende dai bambini 1-11. La fascia dei bebe' e' in mesi, quindi va
    // scritta nelle tre lingue: "0-11" da solo si leggerebbe come anni.
    ages: {
      adult: "12+",
      child: "1-11",
      infant: { it: "0-11 mesi", en: "0-11 months", es: "0-11 meses" }
    },
    priceInfant: 0,
    options: {
      label: { it: "Formula", en: "Option", es: "Fórmula" },
      choices: [
        {
          label: { it: "3 ore, in condivisione", en: "3 hours, shared", es: "3 horas, compartido" },
          priceAdult: 70,
          priceChild: 50,
          duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
          included: ["snack"],
          desc: {
            it: "Si sale insieme ad altri, fino a 12 persone in tutto. Tre ore lungo la costa sud-ovest, con sosta bagno, qualcosa da mangiare e da bere a bordo, e buone possibilità di vedere delfini e globicefali.",
            en: "You share the boat with others, up to 12 people in all. Three hours along the south-west coast, with a swim stop, something to eat and drink on board, and a good chance of spotting dolphins and pilot whales.",
            es: "Se sube junto a otras personas, hasta 12 en total. Tres horas por la costa suroeste, con parada de baño, algo de comer y beber a bordo, y buenas posibilidades de ver delfines y calderones."
          }
        },
        {
          label: { it: "Charter privato", en: "Private charter", es: "Chárter privado" },
          price: 545,
          duration: { it: "Da 3 a 9 ore", en: "3 to 9 hours", es: "De 3 a 9 horas" },
          included: ["lunch"],
          desc: {
            it: "La barca solo per il tuo gruppo, fino a 12 persone: da €545 per tre ore, e si può allungare fino a nove. Pranzo a bordo e bar aperto compresi. Il prezzo è della barca intera, non a persona: scrivici quante siete e quante ore vuoi e ti facciamo il conto.",
            en: "The boat just for your group, up to 12 people: from €545 for three hours, and you can stretch it to nine. Lunch on board and open bar included. The price is for the whole boat, not per person: tell us how many you are and how many hours you want and we'll work it out.",
            es: "El barco solo para tu grupo, hasta 12 personas: desde 545 € por tres horas, y se puede alargar hasta nueve. Comida a bordo y barra libre incluidas. El precio es del barco entero, no por persona: escríbenos cuántos sois y cuántas horas quieres y te hacemos las cuentas."
          }
        }
      ]
    },
    included: ["swimstop", "snorkel", "drinks", "guide"],
    notes: [
      {
        it: "È un gommone rigido di grandi dimensioni, con motori potenti: si va veloci e si arriva lontano, ma con il mare mosso si sente più che su un catamarano.",
        en: "It is a large rigid inflatable with powerful engines: you go fast and get far, but in rough seas you feel it more than on a catamaran.",
        es: "Es una neumática rígida de gran tamaño, con motores potentes: se va rápido y se llega lejos, pero con mar movido se nota más que en un catamarán."
      },
      {
        it: "A bordo ci sono zone al sole e zone all'ombra, e una piattaforma da cui si scende in acqua.",
        en: "On board there are areas in the sun and areas in the shade, and a platform to get into the water from.",
        es: "A bordo hay zonas al sol y zonas a la sombra, y una plataforma para bajar al agua."
      },
      {
        it: "Fra le bevande comprese ci sono birra, vino e analcoliche, e non manca lo spumante.",
        en: "The drinks included are beer, wine and soft drinks, and there is sparkling wine too.",
        es: "Entre las bebidas incluidas hay cerveza, vino y refrescos, y no falta el espumoso."
      },
      {
        it: "La barca ha la certificazione \"Blue Boat\", che si dà a chi rispetta le regole per avvicinare i cetacei senza disturbarli.",
        en: "The boat holds the \"Blue Boat\" certification, given to those who follow the rules for approaching cetaceans without disturbing them.",
        es: "El barco tiene la certificación \"Blue Boat\", que se da a quien respeta las normas para acercarse a los cetáceos sin molestarlos."
      },
      {
        it: "Vicino a Puerto Colón c'è un parcheggio a pagamento, se vieni con la tua macchina.",
        en: "There is a paid car park near Puerto Colón, if you come by car.",
        es: "Cerca de Puerto Colón hay un aparcamiento de pago, si vienes en coche."
      }
    ],
    family: true,
    desc: {
      it: "Un gommone rigido da diciotto metri che corre lungo la costa sud-ovest: zone per prendere il sole, ombra dove ripararsi e una piattaforma per scendere in acqua. Attrezzatura da snorkeling a bordo, da mangiare e da bere compresi, e un equipaggio che parla più lingue e racconta quello che si vede. Si sceglie fra il giro di tre ore in condivisione e la barca tutta per sé.",
      en: "An eighteen-metre rigid inflatable that runs along the south-west coast: areas to sunbathe, shade to retreat to and a platform to get into the water from. Snorkelling gear on board, food and drinks included, and a crew that speaks several languages and tells you what you are looking at. Choose between the shared three-hour trip and having the boat to yourselves.",
      es: "Una neumática rígida de dieciocho metros que recorre la costa suroeste: zonas para tomar el sol, sombra donde resguardarse y una plataforma para bajar al agua. Equipo de snorkel a bordo, comida y bebida incluidas, y una tripulación que habla varios idiomas y te cuenta lo que estás viendo. Se elige entre la salida de tres horas compartida y el barco entero para ti."
    },
    image: "opera-60.jpg",
    published: true
  },
  {
    id: "self-drive-boats",
    title: "Self-Drive Boats",
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "Da 2 a 5 ore", en: "2 to 5 hours", es: "De 2 a 5 horas" },
    priceFrom: 190,
    priceUnit: { it: "a barca", en: "per boat", es: "por barco" },
    priceAdult: 0,
    priceChild: 0,
    options: {
      label: { it: "Durata", en: "Duration", es: "Duración" },
      choices: [
        { label: { it: "2 ore", en: "2 hours", es: "2 horas" }, price: 190 },
        { label: { it: "3 ore", en: "3 hours", es: "3 horas" }, price: 265 },
        { label: { it: "4 ore", en: "4 hours", es: "4 horas" }, price: 335 },
        { label: { it: "5 ore", en: "5 hours", es: "5 horas" }, price: 395 }
      ]
    },
    included: ["swimstop", "lifejacket", "snorkel", "snack", "speaker", "towels", "fuel"],
    notes: [
      {
        it: "Il prezzo è per la barca, non a persona: si divide fra chi sale a bordo.",
        en: "The price is for the boat, not per person: you split it between whoever comes on board.",
        es: "El precio es por barco, no por persona: se reparte entre quienes suben a bordo."
      },
      {
        it: "Chi guida la barca deve avere almeno 18 anni. I bambini possono salire come passeggeri.",
        en: "Whoever drives the boat must be at least 18. Children are welcome on board as passengers.",
        es: "Quien conduzca el barco debe tener al menos 18 años. Los niños pueden subir como pasajeros."
      },
      {
        it: "Il giorno stesso si lascia una cauzione di €100 in contanti.",
        en: "A €100 cash deposit is left on the day.",
        es: "El mismo día se deja una fianza de 100 € en efectivo."
      },
      {
        it: "Da 3 ore in su è compresa anche una prova di jet blade.",
        en: "Bookings of 3 hours or more also include a jet blade experience.",
        es: "A partir de 3 horas se incluye también una prueba de jet blade."
      },
      {
        it: "Per più di 5 ore si può fare: scrivici e ti diciamo il prezzo.",
        en: "More than 5 hours is possible: message us and we'll quote you.",
        es: "Más de 5 horas es posible: escríbenos y te decimos el precio."
      }
    ],
    family: true,
    desc: {
      it: "Al timone ci sei tu: barca senza skipper, si guida da soli e non serve la patente nautica. Fino a 4 persone a bordo, si sceglie il tratto di costa e ci si ferma dove si vuole per un bagno.",
      en: "You take the helm: no skipper, and no boat licence needed. Up to 4 people on board, you pick the stretch of coast and stop wherever you like for a swim.",
      es: "Al timón vas tú: barco sin patrón y sin necesidad de titulación. Hasta 4 personas a bordo, eliges el tramo de costa y paras donde quieras para bañarte."
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
    included: ["swimstop"],
    desc: {
      it: "Tre ore a bordo di un cruiser di lusso, senza fretta.",
      en: "Three hours aboard a luxury cruiser, with no rush.",
      es: "Tres horas a bordo de un crucero de lujo, sin prisa."
    },
    image: "luxury-cruiser.jpg",
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
    image: "teide-national-park.jpg",
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
    image: "teide-masca.jpg",
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
    published: false
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
    published: false
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
    image: "trekking-bici.jpg",
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
    published: false
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
    id: "gran-canaria",
    title: "Poema del Mar",
    category: "parchi-spettacoli",
    zone: "Santa Cruz",
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo" },
    priceFrom: null,
    priceAdult: 0,
    priceChild: 0,
    included: ["transfer", "ferry", "ticket", "guide", "tasting"],
    itinerary: [
      { time: "10:00", text: { it: "Nave da Santa Cruz verso Agaete",
                               en: "Ferry from Santa Cruz to Agaete",
                               es: "Barco desde Santa Cruz hacia Agaete" } },
      { time: "11:30", text: { it: "Arrivo ad Agaete, a Gran Canaria",
                               en: "Arrival at Agaete, on Gran Canaria",
                               es: "Llegada a Agaete, en Gran Canaria" } },
      { text: { it: "Ingresso all'acquario Poema del Mar",
                en: "Entry to the Poema del Mar aquarium",
                es: "Entrada al acuario Poema del Mar" } },
      { text: { it: "Visita al quartiere antico di Vegueta",
                en: "A walk through the old quarter of Vegueta",
                es: "Visita al barrio antiguo de Vegueta" } },
      { text: { it: "Visita guidata alle distillerie Arehucas, con degustazione",
                en: "Guided visit to the Arehucas distillery, with a tasting",
                es: "Visita guiada a las destilerías Arehucas, con degustación" } },
      { time: "17:00", text: { it: "Partenza da Arucas verso Agaete",
                               en: "Departure from Arucas towards Agaete",
                               es: "Salida desde Arucas hacia Agaete" } },
      { time: "18:00", text: { it: "Nave da Agaete verso Santa Cruz",
                               en: "Ferry from Agaete back to Santa Cruz",
                               es: "Barco desde Agaete hacia Santa Cruz" } }
    ],
    notes: [
      { it: "Il pranzo non è incluso.",
        en: "Lunch is not included.",
        es: "El almuerzo no está incluido." },
      { it: "Il transfer dal sud fino al porto di Santa Cruz è compreso, andata e ritorno.",
        en: "The transfer from the south to Santa Cruz harbour is included, both ways.",
        es: "El traslado desde el sur hasta el puerto de Santa Cruz está incluido, ida y vuelta." }
    ],
    family: true,
    desc: {
      it: "Giornata a Gran Canaria in nave: l'acquario Poema del Mar, il quartiere antico di Vegueta e le distillerie Arehucas.",
      en: "A day on Gran Canaria by ferry: the Poema del Mar aquarium, the old quarter of Vegueta and the Arehucas distillery.",
      es: "Un día en Gran Canaria en barco: el acuario Poema del Mar, el barrio antiguo de Vegueta y las destilerías Arehucas."
    },
    image: "gran-canaria.jpg",
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
    image: "flamenco-show.jpg",
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
    image: "scandal-dinner-show.jpg",
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
    image: "history-music-show.jpg",
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
    image: "la-gomera.jpg",
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
    image: "santa-cruz-taganana.jpg",
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
    image: "island-tour-completo.jpg",
    published: true
  },
  {
    id: "icod-garachico-orotava",
    title: {
      it: "Teide, Icod, Garachico e Masca",
      en: "Teide, Icod, Garachico & Masca",
      es: "Teide, Icod, Garachico y Masca"
    },
    category: "tour-isola",
    zone: { it: "Tenerife nord", en: "North Tenerife", es: "Tenerife norte" },
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo" },
    priceFrom: null,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Il Teide, il Drago Millenario di Icod, le piscine naturali di Garachico e il borgo di Masca, in una giornata sola.",
      en: "The Teide, the thousand-year-old dragon tree of Icod, the natural pools of Garachico and the hamlet of Masca, in a single day.",
      es: "El Teide, el Drago Milenario de Icod, las piscinas naturales de Garachico y el pueblo de Masca, en un solo día."
    },
    image: "icod-garachico-orotava.jpg",
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
    published: false
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
    image: "la-palma.jpg",
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
    image: "cantine-vinicole.jpg",
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
    image: "tuk-tuk.jpg",
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
    image: "trenino-turistico.jpg",
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
    published: false
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
    published: false
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
    published: false
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
    published: false
  },
];

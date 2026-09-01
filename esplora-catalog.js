// Catalogo delle attività di Isla, smistate nelle categorie della home.
//
// COME COMPILARE UNA VOCE
//   image      → nome del file dentro assets/. Vuoto = foto ancora da caricare.
//                Piu voci possono indicare lo stesso file: la foto sta in
//                assets/ una volta sola e il telefono la scarica una volta
//                sola, anche se compare in dieci schede diverse.
//   gallery    → facoltativo: altre foto oltre a `image`, stessa cartella
//                assets/. Sulla pagina di dettaglio diventano una striscia di
//                miniature sotto la foto grande; toccandone una cambia la foto
//                grande, senza aprire un'altra pagina. Niente senza `image`:
//                la prima miniatura è sempre la foto principale.
//                    gallery: ["nome-2.jpg", "nome-3.jpg"]
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
//   transferSiam, transferSiamPrice → facoltativi: un **secondo** transfer,
//                indipendente dal primo. Nasce sul Twin Ticket (quello sopra e'
//                per chi sta al sud e va a Loro Parque, questo per chi sta al
//                nord e va al Siam Park) ma il meccanismo e' generico: qualsiasi
//                scheda con due zone di partenza puo' usarlo, per esempio due
//                aree di ritiro diverse per lo stesso Siam Park. Stessa forma di
//                `transfer`/`transferPrice` (prezzi **completi**, non il
//                supplemento). Nella finestra della richiesta i due checkbox si
//                escludono a vicenda: un cliente sta in una zona sola, non in
//                tutte e due. Ha anche il suo `transferSiamPriceHidden`, come
//                `transferPriceHidden`.
//   transferLabel, transferSiamLabel → facoltativi: sostituiscono il testo
//                fisso della domanda nella finestra della richiesta ("Vuoi il
//                transfer?", "Vuoi il transfer per il Siam Park?") quando una
//                scheda ha due transfer che non sono "per il Siam Park" ma per
//                due zone qualsiasi. Senza questo campo resta il testo di
//                sempre: serve solo dove il testo fisso confonderebbe.
//                    transferLabel: { it: "Vuoi il transfer da Tenerife Nord?", ... }
//   transferPriceLabel, transferSiamPriceLabel → facoltativi, solo dove ci sono
//                due transfer sulla stessa scheda. Accorpano la descrizione e il
//                prezzo in una riga sola, con la direzione nel nome, invece
//                delle due righe normali che con due transfer diventerebbero
//                quattro e si confonderebbero a vicenda:
//                    transferPriceLabel: { it: "Transfer Loro Parque (da sud)", ... }
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
//   days       → facoltativo: i giorni in cui l'attivita' si fa. Dove c'e', il
//                cliente che sceglie un altro giorno se lo sente dire subito,
//                sotto la data, e la richiesta non parte.
//                Si scrivono con queste sette sigle, e basta sbagliarne una
//                per pubblicare dei giorni sbagliati: **mar e' martedi', mer e'
//                mercoledi'**.
//                    dom  lun  mar  mer  gio  ven  sab
//                Esempio, un'attivita' che si fa lunedi', mercoledi' e venerdi':
//                    days: ["lun", "mer", "ven"]
//                Se l'attivita' si fa tutti i giorni **non si scrive il campo**:
//                sette giorni su sette non sono una limitazione da mostrare.
//                Vale anche dentro una variante, quando i giorni cambiano da
//                una all'altra.
//   times      → facoltativo, e i suoi tre stati vogliono dire tre cose diverse.
//                Scritto e pieno: sono le partenze vere del fornitore, il cliente
//                sceglie fra quelle e "Da concordare" non compare.
//                    times: ["09:30", "12:30"]
//                Scritto e vuoto: e' un charter o un noleggio, la barca e' tutta
//                sua e l'ora si concorda. "Da concordare" resta l'unica voce.
//                    times: []
//                Non scritto: le partenze vere non le sappiamo ancora. Restano le
//                fasce segnaposto di ORARI_PREDEFINITI piu' "Da concordare", da
//                sostituire attivita' per attivita' appena l'ufficio le manda.
//                Vale anche dentro una variante, quando le partenze cambiano da
//                una all'altra.
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

// Le sette sigle dei giorni e il numero che JavaScript usa per la domenica, il
// lunedi' e cosi' via (Date.getDay(): 0 e' domenica). Serve a tradurre quello
// che si scrive nel catalogo in qualcosa con cui confrontare una data.
const GIORNI_SIGLE = { dom: 0, lun: 1, mar: 2, mer: 3, gio: 4, ven: 5, sab: 6 };

// Le chiavi i18n dei sette giorni, nell'ordine di getDay().
const GIORNI_CHIAVI = ["day.sun", "day.mon", "day.tue", "day.wed",
                       "day.thu", "day.fri", "day.sat"];

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
    // La barca e' tutta tua: l'ora di partenza si concorda, non si sceglie da un
    // elenco. `times: []` lascia "Da concordare" come unica voce, invece delle
    // fasce segnaposto che qui sarebbero inventate.
    times: [],
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
          days: ["lun", "mer", "ven"],
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
          days: ["mar", "gio", "ven", "dom"],
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
    gallery: ["freebird-2.jpg", "freebird-3.jpg", "freebird-4.jpg"],
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
          days: ["mar", "gio", "dom"],
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
          days: ["mer", "sab"],
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
    gallery: ["royal-delfin-2.jpg", "royal-delfin-3.jpg", "royal-delfin-4.jpg"],
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
    // Quattro partenze a tre ore l'una dall'altra. Le 18:00 ci sono solo
    // d'estate: sta in elenco come le altre e la nota qui sotto lo dice, come
    // gia' fatto per la partenza delle 9:30 di Royal Delfin.
    times: ["09:00", "12:00", "15:00", "18:00"],
    priceFrom: 55,
    privateOption: "private-charter",
    priceAdult: 55,
    priceChild: 30,
    priceInfant: 0,
    ages: { adult: "12+", child: "3-11", infant: "0-2" },
    included: ["snorkel", "snack", "drinks", "swimstop"],
    notes: [
      {
        it: "Le partenze sono ogni tre ore. Quella delle 18:00 si fa solo d'estate.",
        en: "Departures are every three hours. The 18:00 one runs in summer only.",
        es: "Las salidas son cada tres horas. La de las 18:00 solo se hace en verano."
      }
    ],
    family: true,
    desc: {
      it: "Tre ore in barca a vela da Puerto Colón, con un massimo di 11 persone a bordo. Avvistamento di balene e delfini, sosta per lo snorkeling con attrezzatura inclusa, snack e bevande a bordo.",
      en: "Three hours under sail from Puerto Colón, with a maximum of 11 guests on board. Whale and dolphin watching, a snorkelling stop with gear included, snacks and drinks on board.",
      es: "Tres horas en velero desde Puerto Colón, con un máximo de 11 personas a bordo. Avistamiento de ballenas y delfines, parada para hacer snorkel con equipo incluido, snacks y bebidas a bordo."
    },
    image: "whale-dolphin-3h.jpg",
    gallery: ["whale-dolphin-3h-2.jpg", "whale-dolphin-3h-3.jpg", "whale-dolphin-3h-4.jpg", "whale-dolphin-3h-5.jpg"],
    published: true
  },
  {
    id: "peter-pan",
    title: "Peter Pan Pirate Ship",
    category: "mare-barche",
    zone: "Los Cristianos",
    duration: { it: "2 ore", en: "2 hours", es: "2 horas" },
    // Tre partenze tutti i giorni: nessun campo `days`, non c'e' limite da dire.
    times: ["10:00", "12:00", "14:00"],
    priceFrom: 27,
    priceAdult: 27,
    priceChild: 13,
    priceInfant: 0,
    ages: { adult: "12+", child: "3-11", infant: "0-2" },
    family: true,
    // Solo la guida. Sul giro di due ore da mangiare e da bere **non** sono
    // compresi (si comprano a bordo) e il bagno non c'e': la sosta per nuotare
    // il fornitore la mette sul giro di tre ore, non su questo.
    included: ["guide"],
    // Gratis, ma non a tutte le partenze: e' una condizione, non un prezzo,
    // quindi niente `transferPrice` e niente "transfer" fra le icone, che
    // direbbero che vale sempre.
    transfer: {
      it: "Il passaggio dagli hotel del sud è gratis, ma solo per la partenza delle 12:00.",
      en: "Pick-up from the southern hotels is free, but only for the 12:00 departure.",
      es: "La recogida en los hoteles del sur es gratis, pero solo para la salida de las 12:00."
    },
    desc: {
      it: "Una goletta portoghese in legno, a due alberi, che parte da Los Cristianos: due ore al largo per vedere delfini e globicefali. A bordo ci sono l'ombra, un ponte superiore per stare al sole e i bagni.",
      en: "A wooden two-masted Portuguese schooner leaving from Los Cristianos: two hours offshore to see dolphins and pilot whales. On board there is shade, an upper deck for sunbathing and toilets.",
      es: "Una goleta portuguesa de madera, de dos palos, que sale de Los Cristianos: dos horas mar adentro para ver delfines y calderones. A bordo hay sombra, una cubierta superior para tomar el sol y aseos."
    },
    notes: [
      {
        it: "Si parte dal porto di Los Cristianos. Arriva almeno 30 minuti prima dell'orario, così l'imbarco si fa con calma.",
        en: "You leave from Los Cristianos harbour. Get there at least 30 minutes before your departure time so boarding is unhurried.",
        es: "Se sale del puerto de Los Cristianos. Llega al menos 30 minutos antes de la hora para embarcar con calma."
      },
      {
        it: "Da mangiare e da bere non sono compresi, ma si comprano a bordo.",
        en: "Food and drinks are not included, but you can buy them on board.",
        es: "La comida y las bebidas no están incluidas, pero se compran a bordo."
      },
      {
        it: "A bordo si sta fino a 60 persone: c'è una zona all'ombra con un tavolone, il ponte superiore per il sole e due bagni.",
        en: "The ship takes up to 60 people: there is a shaded area with a big table, the upper deck for the sun and two toilets.",
        es: "A bordo caben hasta 60 personas: hay una zona a la sombra con una mesa grande, la cubierta superior para el sol y dos aseos."
      }
    ],
    image: "peter-pan.jpg",
    gallery: ["peter-pan-2.jpg", "peter-pan-3.jpg"],
    published: true
  },
  {
    id: "flipper-one",
    title: "Flipper One Boat Tour",
    category: "mare-barche",
    // L'unica scheda che parte da Los Gigantes: tutte le altre barche sono a
    // Puerto Colon, Los Cristianos o Marina Amarilla.
    zone: "Los Gigantes",
    duration: { it: "2 o 3 ore", en: "2 or 3 hours", es: "2 o 3 horas" },
    priceFrom: 33,
    // I prezzi veri stanno dentro le varianti, che costano tutte diverso. Qui
    // resta quello dei neonati, zero su tutti e tre i giri: e' un prezzo, non
    // un "non lo sappiamo".
    priceAdult: 0,
    priceChild: 0,
    priceInfant: 0,
    // 12+ discende dai bambini 2-11: sopra gli 11 non c'e' altra fascia.
    ages: { adult: "12+", child: "2-11", infant: "0-1" },
    options: {
      label: { it: "Durata", en: "Duration", es: "Duración" },
      choices: [
        {
          label: { it: "2 ore", en: "2 hours", es: "2 horas" },
          priceAdult: 33,
          priceChild: 23,
          times: ["17:30"],
          desc: {
            it: "Il giro corto, per vedere balene e delfini senza starci mezza giornata. Non c'è la sosta bagno e non si mangia, ma le bevande sono comprese. Partenza alle 17:30.",
            en: "The short trip, to see whales and dolphins without giving up half a day. There is no swim stop and no meal, but drinks are included. Leaving at 17:30.",
            es: "La salida corta, para ver ballenas y delfines sin dedicarle media jornada. No hay parada de baño ni comida, pero las bebidas están incluidas. Salida a las 17:30."
          }
        },
        {
          label: { it: "3 ore", en: "3 hours", es: "3 horas" },
          priceAdult: 40,
          priceChild: 25,
          times: ["11:30"],
          included: ["swimstop", "lunch"],
          desc: {
            it: "Balene e delfini, poi le scogliere di Masca e Los Gigantes e la sosta bagno nella baia di Diego Hernández, dove c'è anche una teleferica per tuffarsi. Pranzo con paella di pollo e frutta, bevande comprese. Partenza alle 11:30.",
            en: "Whales and dolphins, then the cliffs of Masca and Los Gigantes and a swim stop in Diego Hernández bay, where there is also a zip line to dive from. Lunch of chicken paella and fruit, drinks included. Leaving at 11:30.",
            es: "Ballenas y delfines, luego los acantilados de Masca y Los Gigantes y la parada de baño en la bahía de Diego Hernández, donde hay también una tirolina para tirarse al agua. Comida de paella de pollo y fruta, bebidas incluidas. Salida a las 11:30."
          }
        },
        {
          label: { it: "3 ore con navetta", en: "3 hours with shuttle", es: "3 horas con lanzadera" },
          priceAdult: 44,
          priceChild: 29,
          times: ["11:30"],
          included: ["swimstop", "lunch", "transfer"],
          desc: {
            it: "Lo stesso giro di tre ore, con il passaggio per andare e tornare dal porto: utile perché Los Gigantes è lontano dagli alberghi del sud. Partenza alle 11:30.",
            en: "The same three-hour trip, with a ride to and from the harbour: useful because Los Gigantes is a long way from the southern hotels. Leaving at 11:30.",
            es: "La misma salida de tres horas, con el traslado de ida y vuelta al puerto: útil porque Los Gigantes queda lejos de los hoteles del sur. Salida a las 11:30."
          }
        }
      ]
    },
    // Solo quello che vale per tutti e tre i giri. Il pranzo e la sosta bagno
    // stanno dentro le varianti, e la navetta solo dentro la terza.
    included: ["drinks", "guide"],
    family: true,
    desc: {
      it: "Una goletta di legno costruita a mano a Tenerife, la prima di questa misura: ci sono voluti diciotto mesi a quattro fratelli falegnami di Alcalá, polena a forma di delfino compresa. Parte da Los Gigantes per andare a cercare balene e delfini sotto le scogliere.",
      en: "A wooden schooner built by hand in Tenerife, the first of this size: it took four carpenter brothers from Alcalá eighteen months, dolphin figurehead included. It leaves from Los Gigantes to look for whales and dolphins below the cliffs.",
      es: "Una goleta de madera construida a mano en Tenerife, la primera de este tamaño: cuatro hermanos carpinteros de Alcalá tardaron dieciocho meses, mascarón de delfín incluido. Sale de Los Gigantes a buscar ballenas y delfines bajo los acantilados."
    },
    notes: [
      {
        it: "Si parte dal porto di Los Gigantes, dove c'è il parcheggio. Arriva 10 minuti prima della partenza.",
        en: "You leave from Los Gigantes harbour, where there is parking. Get there 10 minutes before departure.",
        es: "Se sale del puerto de Los Gigantes, donde hay aparcamiento. Llega 10 minutos antes de la salida."
      },
      {
        it: "Si va quasi tutti i giorni, ma non proprio tutti: quando mandi la richiesta ti confermiamo se quel giorno si parte.",
        en: "It runs almost every day, but not quite every day: when you send your request we will confirm whether it sails that day.",
        es: "Se hace casi todos los días, pero no todos: cuando mandes la solicitud te confirmamos si ese día sale."
      },
      {
        it: "A bordo si sta fino a 91 persone, e c'è una guida che racconta cosa si sta vedendo.",
        en: "The boat takes up to 91 people, and there is a guide who explains what you are looking at.",
        es: "A bordo caben hasta 91 personas, y hay un guía que cuenta lo que se está viendo."
      },
      {
        it: "Sul giro di tre ore portati costume e crema solare: la sosta bagno è la parte migliore.",
        en: "On the three-hour trip bring swimwear and sun cream: the swim stop is the best part.",
        es: "En la salida de tres horas lleva bañador y crema solar: la parada de baño es lo mejor."
      }
    ],
    image: "flipper-one.jpg",
    gallery: ["flipper-one-2.jpg", "flipper-one-3.jpg", "flipper-one-4.jpg"],
    published: true
  },
  {
    id: "submarine-safari",
    title: "Submarine Safari",
    category: "mare-barche",
    zone: "Marina Amarilla",
    duration: { it: "1 ora", en: "1 hour", es: "1 hora" },
    times: ["10:00", "13:00"],
    // tutti i giorni tranne il sabato
    days: ["lun", "mar", "mer", "gio", "ven", "dom"],
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
    gallery: ["submarine-safari-2.jpg", "submarine-safari-3.jpg"],
    published: true
  },
  {
    id: "pesca-altura",
    title: { it: "Pesca d'altura", en: "Deep sea fishing", es: "Pesca de altura" },
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "4 ore", en: "4 hours", es: "4 horas" },
    times: ["09:00", "14:00"],
    priceFrom: 85,
    priceAdult: 0,
    priceChild: 0,
    // Solo la fascia dei bambini. Quella degli adulti non si scrive perche'
    // non si ricava: il fornitore dice che dagli 8 ai 10 anni si paga €69, ma
    // sotto gli 8 non dice niente e non si sa se si sale (magari solo a
    // guardare). Vedi i consigli.
    ages: { child: "8-10" },
    options: {
      label: { it: "Formula", en: "Option", es: "Fórmula" },
      choices: [
        {
          label: { it: "4 ore, in condivisione", en: "4 hours, shared", es: "4 horas, compartido" },
          priceAdult: 85,
          priceChild: 69,
          duration: { it: "4 ore", en: "4 hours", es: "4 horas" },
          desc: {
            it: "Si esce insieme ad altri, fino a 10 persone in tutto, e ognuno che vuole pescare ha la sua canna. Quattro ore al largo, partenza alle 9:00 o alle 14:00.",
            en: "You go out with others, up to 10 people in all, and everyone who wants to fish gets their own rod. Four hours offshore, leaving at 9:00 or 14:00.",
            es: "Se sale junto a otras personas, hasta 10 en total, y cada uno que quiera pescar tiene su caña. Cuatro horas mar adentro, salida a las 9:00 o a las 14:00."
          }
        },
        {
          label: { it: "Charter privato, fino a 7", en: "Private charter, up to 7", es: "Chárter privado, hasta 7" },
          price: 525,
          duration: { it: "Da 4 ore", en: "From 4 hours", es: "Desde 4 horas" },
          desc: {
            it: "La barca solo per il tuo gruppo, fino a 7 persone: da €525. Da sei ore in su sono compresi anche panini e stuzzichini. Il prezzo è della barca intera, non a persona.",
            en: "The boat just for your group, up to 7 people: from €525. From six hours upwards sandwiches and snacks are included too. The price is for the whole boat, not per person.",
            es: "El barco solo para tu grupo, hasta 7 personas: desde 525 €. A partir de seis horas se incluyen también bocadillos y aperitivos. El precio es del barco entero, no por persona."
          }
        },
        {
          label: { it: "Charter privato, fino a 10", en: "Private charter, up to 10", es: "Chárter privado, hasta 10" },
          price: 700,
          duration: { it: "Da 4 ore", en: "From 4 hours", es: "Desde 4 horas" },
          desc: {
            it: "Come sopra ma con più posto: fino a 10 persone, da €700. Da sei ore in su sono compresi anche panini e stuzzichini. Il prezzo è della barca intera, non a persona.",
            en: "As above but with more room: up to 10 people, from €700. From six hours upwards sandwiches and snacks are included too. The price is for the whole boat, not per person.",
            es: "Como arriba pero con más sitio: hasta 10 personas, desde 700 €. A partir de seis horas se incluyen también bocadillos y aperitivos. El precio es del barco entero, no por persona."
          }
        }
      ]
    },
    included: ["equipment", "drinks", "guide"],
    notes: [
      {
        it: "Il pesce preso non si può portare a casa: si pesca e si rimette in mare, oppure resta alla barca.",
        en: "You cannot take your catch home: you fish and release, or the catch stays with the boat.",
        es: "El pescado que se captura no se puede llevar a casa: se pesca y se devuelve al mar, o se queda en el barco."
      },
      {
        it: "Chi viene solo a guardare paga €69, anche da adulto: a bordo ci sono i lettini e una zona d'ombra per chi non pesca. Dillo nelle note della richiesta.",
        en: "Anyone coming just to watch pays €69, adults included: there are sunbeds and a shaded area on board for those not fishing. Say so in the notes of your request.",
        es: "Quien viene solo a mirar paga 69 €, también los adultos: a bordo hay tumbonas y una zona de sombra para quien no pesca. Dilo en las notas de la solicitud."
      },
      {
        it: "I bambini dagli 8 ai 10 anni che pescano pagano €69. Per i più piccoli chiedici: dipende dall'uscita.",
        en: "Children aged 8 to 10 who fish pay €69. For younger ones ask us: it depends on the trip.",
        es: "Los niños de 8 a 10 años que pescan pagan 69 €. Para los más pequeños pregúntanos: depende de la salida."
      },
      {
        it: "Le canne ci sono per tutti quelli che pescano, e l'attrezzatura la mette la barca: esche e terminali compresi. Si va di traina e di jigging, secondo la stagione.",
        en: "There are rods for everyone who fishes, and the boat provides the tackle: bait and rigs included. You troll and jig, depending on the season.",
        es: "Hay cañas para todos los que pescan, y el barco pone el equipo: cebos y aparejos incluidos. Se va al curricán y al jigging, según la temporada."
      },
      {
        it: "A bordo c'è la toilette e un frigo con le bevande fredde, che si prendono da soli.",
        en: "There is a toilet on board and a fridge with cold drinks, which you help yourself to.",
        es: "A bordo hay aseo y una nevera con bebidas frías, que se cogen uno mismo."
      },
      {
        it: "Si parte da Puerto Colón: arriva almeno 10 minuti prima. Al porto c'è parcheggio.",
        en: "You leave from Puerto Colón: get there at least 10 minutes early. There is parking at the marina.",
        es: "Se sale de Puerto Colón: llega al menos 10 minutos antes. En el puerto hay aparcamiento."
      }
    ],
    family: true,
    desc: {
      it: "Quattro ore a pesca al largo di Puerto Colón, a bordo della No Limits. Si cercano tonni, marlin e lampughe, e la canna ce l'ha chiunque voglia provare, anche chi non ha mai pescato: l'equipaggio lavora in queste acque da più di vent'anni. Chi non pesca ha i lettini e la zona d'ombra. Si sceglie fra l'uscita in condivisione e la barca tutta per sé.",
      en: "Four hours fishing offshore from Puerto Colón, aboard the No Limits. You go after tuna, marlin and dorado, and anyone who wants to try gets a rod, first-timers included: the crew has been working these waters for over twenty years. Those not fishing have sunbeds and a shaded area. Choose between the shared trip and having the boat to yourselves.",
      es: "Cuatro horas de pesca mar adentro desde Puerto Colón, a bordo del No Limits. Se buscan atunes, marlines y dorados, y tiene caña cualquiera que quiera probar, también quien no ha pescado nunca: la tripulación lleva más de veinte años en estas aguas. Quien no pesca tiene tumbonas y zona de sombra. Se elige entre la salida compartida y el barco entero para ti."
    },
    image: "pesca-altura.jpg",
    published: true
  },
  {
    id: "luxury-catamaran",
    title: "Luxury Catamaran Experience",
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
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
    gallery: ["luxury-catamaran-2.jpg", "luxury-catamaran-3.jpg", "luxury-catamaran-4.jpg", "luxury-catamaran-5.jpg"],
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
    gallery: ["small-group-catamaran-2.jpg", "small-group-catamaran-3.jpg", "small-group-catamaran-4.jpg"],
    published: true
  },
  {
    id: "glass-bottom-boat",
    title: "Glass Bottom Boat Adventure",
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    // Stesse partenze del giro di tre ore in barca a vela, e anche qui le 18:00
    // valgono solo d'estate.
    times: ["09:00", "12:00", "15:00", "18:00"],
    priceFrom: 58,
    priceAdult: 58,
    priceChild: 45,
    ages: { adult: "12+", child: "2-11" },
    family: true,
    included: ["swimstop"],
    notes: [
      {
        it: "Le partenze sono ogni tre ore. Quella delle 18:00 si fa solo d'estate.",
        en: "Departures are every three hours. The 18:00 one runs in summer only.",
        es: "Las salidas son cada tres horas. La de las 18:00 solo se hace en verano."
      }
    ],
    desc: {
      it: "Tre ore su una barca con il fondo trasparente: si guarda il fondale da bordo, poi ci si ferma per il bagno.",
      en: "Three hours on a glass-bottomed boat: you watch the seabed from the deck, then stop for a swim.",
      es: "Tres horas en un barco con fondo de cristal: se mira el fondo desde cubierta y luego hay parada de baño."
    },
    image: "glass-bottom-boat.jpg",
    gallery: ["glass-bottom-boat-2.jpg", "glass-bottom-boat-3.jpg"],
    published: true
  },
  {
    id: "utopia-boat-party",
    title: "Utopia Boat Party",
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    times: ["12:30"],
    days: ["sab"],
    priceFrom: 75,
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
          priceAdult: 75,
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
    gallery: ["party-boat-2.jpg"],
    published: true
  },
  {
    id: "shogun",
    title: "Shogun",
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "5 ore", en: "5 hours", es: "5 horas" },
    times: ["11:00"],
    days: ["lun", "mer", "gio", "ven", "dom"],
    priceFrom: 61,
    priceAdult: 0,
    priceChild: 0,
    // Gratis su tutte e due le partenze.
    priceInfant: 0,
    // 12+ discende dai bambini 3-11, e 0-2 tocca il 3 senza buchi.
    ages: { adult: "12+", child: "3-11", infant: "0-2" },
    options: {
      label: { it: "Partenza", en: "Departure", es: "Salida" },
      choices: [
        {
          label: { it: "Dal sud", en: "From the south", es: "Desde el sur" },
          priceAdult: 61,
          priceChild: 30,
          desc: {
            it: "La navetta ti prende in hotel nel sud dell'isola e ti riporta indietro, compresa nel prezzo. La barca parte alle 11:00 da Puerto Colón.",
            en: "The shuttle picks you up at your hotel in the south of the island and brings you back, included in the price. The boat leaves at 11:00 from Puerto Colón.",
            es: "La lanzadera te recoge en el hotel en el sur de la isla y te devuelve, incluida en el precio. El barco sale a las 11:00 desde Puerto Colón."
          }
        },
        {
          label: { it: "Dal nord", en: "From the north", es: "Desde el norte" },
          priceAdult: 65,
          priceChild: 32,
          zone: "Puerto de la Cruz",
          desc: {
            it: "Per chi alloggia nel nord: la navetta parte da Puerto de la Cruz e ti riporta indietro. Stessa gita, la barca parte alle 11:00 da Puerto Colón.",
            en: "For anyone staying in the north: the shuttle leaves from Puerto de la Cruz and brings you back. Same trip, the boat leaves at 11:00 from Puerto Colón.",
            es: "Para quien se aloja en el norte: la lanzadera sale de Puerto de la Cruz y te devuelve. La misma salida, el barco parte a las 11:00 desde Puerto Colón."
          }
        }
      ]
    },
    included: ["swimstop", "lunch", "drinks", "transfer", "guide"],
    notes: [
      {
        it: "Si fa il lunedì, il mercoledì, il giovedì, il venerdì e la domenica.",
        en: "It runs on Mondays, Wednesdays, Thursdays, Fridays and Sundays.",
        es: "Se hace los lunes, miércoles, jueves, viernes y domingos."
      },
      {
        it: "La barca parte da Puerto Colón, pontile 14: arriva almeno 30 minuti prima.",
        en: "The boat leaves from Puerto Colón, pontoon 14: get there at least 30 minutes early.",
        es: "El barco sale de Puerto Colón, pantalán 14: llega al menos 30 minutos antes."
      },
      {
        it: "A pranzo: riso con verdure, coscia di pollo arrosto, insalata, pane e frutta fresca. Fra le bevande comprese ci sono acqua, analcoliche, birra e vino, e le analcoliche sono a volontà.",
        en: "For lunch: rice with vegetables, a roast chicken drumstick, salad, bread and fresh fruit. The drinks included are water, soft drinks, beer and wine, and the soft drinks are unlimited.",
        es: "Para comer: arroz con verduras, muslo de pollo asado, ensalada, pan y fruta fresca. Entre las bebidas incluidas hay agua, refrescos, cerveza y vino, y los refrescos son ilimitados."
      },
      {
        it: "A bordo ci sono tre bagni, uno attrezzato per chi ha difficoltà motorie: la barca è accessibile.",
        en: "There are three toilets on board, one fitted for guests with reduced mobility: the boat is accessible.",
        es: "A bordo hay tres aseos, uno equipado para personas con movilidad reducida: el barco es accesible."
      },
      {
        it: "Si fuma solo nelle zone apposite.",
        en: "Smoking is allowed only in the designated areas.",
        es: "Solo se puede fumar en las zonas habilitadas."
      },
      {
        it: "Porta costume, asciugamano, crema solare e la macchina fotografica. E vacci piano con l'alcol prima di salire: aiuta col mal di mare.",
        en: "Bring swimwear, a towel, sunscreen and a camera. And go easy on the alcohol before boarding: it helps with seasickness.",
        es: "Trae bañador, toalla, crema solar y la cámara. Y ve con calma con el alcohol antes de subir: ayuda con el mareo."
      }
    ],
    family: true,
    desc: {
      it: "Una goletta orientale di 26 metri, tutta in teak, costruita per uno sceicco: è la barca più particolare che parte da Puerto Colón. Cinque ore, con mezz'ora passata accanto a delfini e balene, poi le scogliere di Los Gigantes e il bagno nella baia di Masca, con il pranzo servito a bordo. Su due ponti c'è posto per 135 persone e tanta ombra dove ripararsi. Ha la bandiera blu che si dà alle barche che si avvicinano ai cetacei rispettando le regole.",
      en: "A 26-metre oriental schooner, all teak, built for a sheikh: it is the most unusual boat leaving Puerto Colón. Five hours, with half an hour spent alongside dolphins and whales, then the cliffs of Los Gigantes and a swim in Masca bay, with lunch served on board. Across two decks there is room for 135 people and plenty of shade. It flies the blue flag given to boats that approach cetaceans by the rules.",
      es: "Una goleta oriental de 26 metros, toda de teca, construida para un jeque: es el barco más singular que sale de Puerto Colón. Cinco horas, con media hora junto a delfines y ballenas, luego los acantilados de Los Gigantes y el baño en la bahía de Masca, con la comida servida a bordo. En dos cubiertas hay sitio para 135 personas y mucha sombra donde resguardarse. Lleva la bandera azul que se da a los barcos que se acercan a los cetáceos respetando las normas."
    },
    image: "shogun.jpg",
    gallery: ["shogun-2.jpg", "shogun-3.jpg"],
    published: true
  },
  {
    id: "opera-60",
    title: "Opera 60",
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "Da 3 a 9 ore", en: "3 to 9 hours", es: "De 3 a 9 horas" },
    times: ["10:00", "13:30"],
    priceFrom: 80,
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
          priceAdult: 80,
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
    gallery: ["opera-60-2.jpg", "opera-60-3.jpg"],
    published: true
  },
  {
    id: "self-drive-boats",
    title: "Self-Drive Boats",
    category: "sport-acquatici",
    zone: "Puerto Colón",
    duration: { it: "Da 2 a 5 ore", en: "2 to 5 hours", es: "De 2 a 5 horas" },
    priceFrom: 190,
    priceUnit: { it: "a barca", en: "per boat", es: "por barco" },
    // La barca e' tutta tua: l'ora di partenza si concorda, non si sceglie da un
    // elenco. `times: []` lascia "Da concordare" come unica voce, invece delle
    // fasce segnaposto che qui sarebbero inventate.
    times: [],
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
    category: "sport-acquatici",
    zone: "Puerto Colón",
    duration: { it: "Da 2 a 6 ore", en: "2 to 6 hours", es: "De 2 a 6 horas" },
    // "a barca" e non "/ora", come sul Self Drive Boat. Con le varianti di durata
    // la pagina scrive il prezzo della variante seguito da questa unita': con
    // "/ora" usciva **"€200/ora"**, che e' il totale di due ore spacciato per
    // tariffa oraria. €200 e' anche il minimo vero che il cliente puo' spendere,
    // perche' sotto le due ore non si noleggia. La tariffa di €100 l'ora resta
    // scritta per esteso nella prima nota.
    priceFrom: 200,
    priceUnit: { it: " a barca", en: " per boat", es: " por barco" },
    // La barca e' tutta tua: l'ora di partenza si concorda, non si sceglie da un
    // elenco. `times: []` lascia "Da concordare" come unica voce, invece delle
    // fasce segnaposto che qui sarebbero inventate.
    times: [],
    priceAdult: 0,
    priceChild: 0,
    options: {
      label: { it: "Durata", en: "Duration", es: "Duración" },
      choices: [
        { label: { it: "2 ore", en: "2 hours", es: "2 horas" }, price: 200 },
        { label: { it: "3 ore", en: "3 hours", es: "3 horas" }, price: 300 },
        { label: { it: "4 ore", en: "4 hours", es: "4 horas" }, price: 400 },
        { label: { it: "5 ore", en: "5 hours", es: "5 horas" }, price: 500 },
        { label: { it: "6 ore", en: "6 hours", es: "6 horas" }, price: 600 }
      ]
    },
    // `towels` no: gli asciugamani qui il cliente se li porta, non glieli danno.
    included: ["snorkel", "lifejacket", "cooler", "speaker", "fuel"],
    // Il fornitore scrive "ideal for families" e chiede i 18 anni **a chi
    // guida**: i bambini salgono come passeggeri, come sul Self Drive Boat.
    family: true,
    desc: {
      it: "Un piccolo catamarano tutto vostro, da guidare da soli: non serve la patente nautica. Fino a sei persone a bordo, da due a sei ore, con attrezzatura da snorkeling, borsa frigo e cassa Bluetooth.",
      en: "A small catamaran all to yourselves, to drive on your own: no boat licence needed. Up to six people on board, from two to six hours, with snorkelling gear, a cooler box and a Bluetooth speaker.",
      es: "Un catamarán pequeño solo para vosotros, para conducirlo vosotros mismos: no hace falta titulación. Hasta seis personas a bordo, de dos a seis horas, con equipo de snorkel, nevera portátil y altavoz Bluetooth."
    },
    notes: [
      {
        it: "Si paga €100 l'ora, per la barca e non a persona: il conto si divide fra chi sale a bordo. Il noleggio minimo è di due ore, il massimo di sei.",
        en: "It costs €100 an hour, for the boat and not per person: you split it between whoever comes on board. The minimum rental is two hours, the maximum six.",
        es: "Cuesta 100 € la hora, por barco y no por persona: se reparte entre quienes suben a bordo. El alquiler mínimo es de dos horas y el máximo de seis."
      },
      {
        it: "Non serve la patente nautica. Chi guida deve avere almeno 18 anni e portare un documento con la foto; i bambini possono salire come passeggeri.",
        en: "No boat licence is needed. Whoever drives must be at least 18 and bring photo ID; children are welcome on board as passengers.",
        es: "No hace falta titulación náutica. Quien conduzca debe tener al menos 18 años y llevar un documento con foto; los niños pueden subir como pasajeros."
      },
      {
        it: "A bordo si sta fino a sei persone.",
        en: "The boat takes up to six people.",
        es: "A bordo caben hasta seis personas."
      },
      {
        it: "Il giorno stesso si lascia una cauzione di €100 in contanti.",
        en: "A €100 cash deposit is left on the day.",
        es: "El mismo día se deja una fianza de 100 € en efectivo."
      },
      {
        it: "Portati costume, asciugamano e crema solare: quelli non sono compresi.",
        en: "Bring swimwear, a towel and sun cream: those are not included.",
        es: "Lleva bañador, toalla y crema solar: eso no está incluido."
      }
    ],
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
  {
    id: "skyline-cruiser",
    title: "Skyline Cruiser",
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    times: ["09:45", "13:15", "16:20"],
    priceFrom: 65,
    privateOption: "private-charter",
    priceAdult: 65,
    priceChild: 45,
    // 13+ discende dai bambini 2-12: sopra i 12 non c'e' altra fascia.
    // Sotto i 2 anni non abbiamo un prezzo: da chiedere all'ufficio se
    // viaggiano gratis o non salgono proprio.
    ages: { adult: "13+", child: "2-12" },
    included: ["swimstop", "snorkel", "fingerfood", "drinks", "towels"],
    family: true,
    itinerary: [
      {
        text: {
          it: "Navigazione al largo, fino a tre miglia dalla costa, in cerca di delfini e balene.",
          en: "Sailing offshore, up to three miles from the coast, looking for dolphins and whales.",
          es: "Navegación mar adentro, hasta tres millas de la costa, buscando delfines y ballenas."
        }
      },
      {
        text: {
          it: "Sosta bagno in una baia riparata, con l'attrezzatura da snorkeling a bordo.",
          en: "A swim stop in a sheltered bay, with snorkelling gear on board.",
          es: "Parada de baño en una bahía resguardada, con equipo de snorkel a bordo."
        }
      },
      {
        text: {
          it: "Rientro costiero, con vista sulle grotte hippie e le scogliere vulcaniche.",
          en: "A coastal return, passing the hippie caves and volcanic cliffs.",
          es: "Vuelta bordeando la costa, con vistas a las cuevas hippies y los acantilados volcánicos."
        }
      }
    ],
    notes: [
      {
        it: "Presentati al porto almeno 30 minuti prima della partenza.",
        en: "Get to the harbour at least 30 minutes before departure.",
        es: "Llega al puerto al menos 30 minutos antes de la salida."
      },
      {
        it: "A bordo: tortilla, pizza, salsicce, formaggio, pomodorini conditi, frutta secca e frutta fresca; da bere acqua, bibite, birra, vino e cava.",
        en: "On board: tortilla, pizza, sausages, cheese, dressed cherry tomatoes, dried fruit and fresh fruit; to drink, water, soft drinks, beer, wine and cava.",
        es: "A bordo: tortilla, pizza, salchichas, queso, tomates cherry aliñados, frutos secos y fruta fresca; para beber, agua, refrescos, cerveza, vino y cava."
      },
      {
        it: "Su richiesta, con un po' di preavviso, ci sono menu alternativi.",
        en: "Alternative menus are available on request, with a little notice.",
        es: "Bajo petición, con un poco de antelación, hay menús alternativos."
      },
      {
        it: "Porta costume, asciugamano, crema solare, occhiali da sole e una giacca leggera.",
        en: "Bring swimwear, a towel, sunscreen, sunglasses and a light jacket.",
        es: "Trae bañador, toalla, crema solar, gafas de sol y una chaqueta ligera."
      }
    ],
    desc: {
      it: "Tre ore a bordo dello Skyline Cruiser, un motoryacht Fairline di quasi 13 metri, fino a 12 persone. Si esce al largo in cerca di delfini e balene, poi la sosta bagno con lo snorkeling in una baia riparata, e il rientro costeggiando le grotte hippie e le scogliere vulcaniche. A bordo capitano ed equipaggio, snack e bevande comprese.",
      en: "Three hours aboard the Skyline Cruiser, a Fairline motor yacht just under 13 metres long, up to 12 people. You head offshore looking for dolphins and whales, then a swim stop with snorkelling in a sheltered bay, and a coastal return past the hippie caves and volcanic cliffs. On board: captain and crew, with snacks and drinks included.",
      es: "Tres horas a bordo del Skyline Cruiser, un yate a motor Fairline de casi 13 metros, hasta 12 personas. Se navega mar adentro buscando delfines y ballenas, luego la parada de baño con snorkel en una bahía resguardada, y la vuelta bordeando la costa junto a las cuevas hippies y los acantilados volcánicos. A bordo: capitán y tripulación, con aperitivos y bebidas incluidas."
    },
    image: "skyline-cruiser.jpg",
    gallery: ["skyline-cruiser-2.jpg", "skyline-cruiser-3.jpg", "skyline-cruiser-4.jpg"],
    published: true
  },
  {
    id: "ragnarok",
    title: "Ragnarok Viking Boat Tour",
    category: "mare-barche",
    zone: "Los Cristianos",
    duration: { it: "2 o 3 ore", en: "2 or 3 hours", es: "2 o 3 horas" },
    priceFrom: 25,
    // I due prezzi veri stanno dentro le varianti, perche' cambiano con la
    // durata. Il neonato invece e' lo stesso su entrambe (e paga, non e'
    // gratis: priceInfant qui non e' zero).
    priceAdult: 0,
    priceChild: 0,
    priceInfant: 5,
    // 12+ discende dai bambini 4-11: sopra gli 11 non c'e' altra fascia.
    // Confermato dall'ufficio che vale su entrambe le durate.
    ages: { adult: "12+", child: "4-11", infant: "0-3" },
    // I giorni cambiano con la durata: il giro corto e' solo il lunedi', il
    // lungo solo martedi'/giovedi'/sabato. Niente `days` sulla scheda,
    // ciascuna variante ha il suo.
    options: {
      label: { it: "Durata", en: "Duration", es: "Duración" },
      choices: [
        {
          label: { it: "2 ore", en: "2 hours", es: "2 horas" },
          priceAdult: 25,
          priceChild: 20,
          days: ["lun"],
          times: ["10:30", "12:30", "14:30"],
          desc: {
            it: "Il giro corto, in cerca di balene pilota e tursiopi al largo di Los Cristianos. Lunedì, partenze alle 10:30, 12:30 e 14:30.",
            en: "The short trip, looking for pilot whales and bottlenose dolphins off Los Cristianos. Mondays, leaving at 10:30, 12:30 and 14:30.",
            es: "La salida corta, en busca de calderones y delfines mulares frente a Los Cristianos. Lunes, salidas a las 10:30, 12:30 y 14:30."
          }
        },
        {
          label: { it: "3 ore", en: "3 hours", es: "3 horas" },
          priceAdult: 38,
          priceChild: 25,
          days: ["mar", "gio", "sab"],
          times: ["13:00"],
          desc: {
            it: "Lo stesso giro con più tempo al largo, in cerca di balene pilota e tursiopi. Martedì, giovedì e sabato, partenza alle 13:00.",
            en: "The same trip with more time offshore, looking for pilot whales and bottlenose dolphins. Tuesdays, Thursdays and Saturdays, leaving at 13:00.",
            es: "La misma salida con más tiempo mar adentro, en busca de calderones y delfines mulares. Martes, jueves y sábado, salida a las 13:00."
          }
        }
      ]
    },
    family: true,
    desc: {
      it: "Una barca a tema vichingo che parte da Los Cristianos per andare a cercare balene pilota e tursiopi al largo. L'equipaggio veste i panni dei vichinghi, fra spettacoli a tema, giochi a bordo e la possibilità di provare l'armatura vichinga: un giro pensato anche per chi viaggia con bambini.",
      en: "A Viking-themed boat leaving from Los Cristianos to look for pilot whales and bottlenose dolphins offshore. The crew dresses up as Vikings, with themed shows, games on board and the chance to try on Viking gear: a trip built with families in mind too.",
      es: "Un barco de temática vikinga que sale de Los Cristianos para buscar calderones y delfines mulares mar adentro. La tripulación se viste de vikingos, con espectáculos temáticos, juegos a bordo y la posibilidad de probarse el equipo vikingo: una salida pensada también para quien viaja con niños."
    },
    notes: [
      {
        it: "Ritrovo nella Zona Excursiones A del porto di Los Cristianos, dove c'è anche un parcheggio pubblico a pagamento. Arriva tra i 10 e i 20 minuti prima della partenza.",
        en: "Meeting point in the Zona Excursiones A at Los Cristianos harbour, where there is also paid public parking. Get there 10 to 20 minutes before departure.",
        es: "Punto de encuentro en la Zona Excursiones A del puerto de Los Cristianos, donde también hay aparcamiento público de pago. Llega entre 10 y 20 minutos antes de la salida."
      },
      {
        it: "A bordo ci sono un bar-ristorante, i servizi igienici, posti a sedere in diverse zone e aree accessibili.",
        en: "On board there is a bar-restaurant, toilets, seating spread across different areas and accessible spaces.",
        es: "A bordo hay un bar-restaurante, aseos, asientos repartidos en distintas zonas y espacios accesibles."
      },
      {
        it: "Con mare mosso o maltempo l'operatore organizza un piano alternativo.",
        en: "In rough seas or bad weather the operator arranges an alternative plan.",
        es: "Con mar agitado o mal tiempo el operador organiza un plan alternativo."
      }
    ],
    image: "ragnarok.jpg",
    gallery: ["ragnarok-2.jpg", "ragnarok-3.jpg", "ragnarok-4.jpg", "ragnarok-5.jpg"],
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
    included: ["board", "wetsuit"],
    image: "surf-lesson.jpg",
    published: true
  },

  // ─── PARCHI E SPETTACOLI ──────────────────────────────────────────────────
  {
    id: "siam-park",
    title: "Siam Park",
    category: "parchi-spettacoli",
    zone: "Costa Adeje",
    // Al posto di "Giornata intera" (che non dice niente) l'orario vero,
    // spostato qui da `notes`: due volte la stessa informazione confondeva.
    duration: {
      it: "10:00-18:00 in estate, 10:00-17:00 in inverno",
      en: "10am-6pm in summer, 10am-5pm in winter",
      es: "10:00-18:00 en verano, 10:00-17:00 en invierno"
    },
    priceFrom: 44,
    priceAdult: 44,
    priceChild: 32,
    priceInfant: 0,
    ages: { adult: "12+", child: "3-11", infant: "0-2" },
    // Due varianti di biglietto, come un tour con le sue durate: il normale e
    // il tutto compreso hanno prezzo diverso e includono cose diverse. Il
    // prezzo estivo (luglio/agosto) non ha un campo suo nel catalogo, quindi
    // resta scritto nella descrizione di ciascuna variante e in `notes`.
    options: {
      label: { it: "Tipo di biglietto", en: "Ticket type", es: "Tipo de entrada" },
      choices: [
        {
          label: { it: "Biglietti normali", en: "Regular tickets", es: "Entradas normales" },
          priceAdult: 44,
          priceChild: 32,
          desc: {
            it: "Biglietti d'ingresso regolari.",
            en: "Regular admission tickets.",
            es: "Entradas regulares."
          }
        },
        {
          // Bambini e neonati: il fornitore non ha ancora dato i due prezzi
          // per questa variante, solo quello dell'adulto. Niente priceChild
          // finche' non arriva: un numero inventato sarebbe peggio di niente.
          label: { it: "Biglietti tutto compreso", en: "All-inclusive tickets", es: "Entradas todo incluido" },
          priceAdult: 165,
          included: ["towels"],
          desc: {
            it: "Ingresso, Fast Pass illimitato per tutte le attrazioni (tranne Power of Tower e Lazy River), armadietto, asciugamano e servizio All Inclusive illimitato ai bar e ristoranti, bevande alcoliche comprese.",
            en: "Admission, unlimited Fast Pass for all attractions (except Power of Tower and Lazy River), locker, towel and unlimited All Inclusive service at bars and restaurants, alcoholic drinks included.",
            es: "Entrada, Fast Pass ilimitado para todas las atracciones (excepto Power of Tower y Lazy River), taquilla, toalla y servicio All Inclusive ilimitado en bares y restaurantes, con bebidas alcohólicas incluidas."
          }
        },
        // Le tre VIP sono un prezzo forfettario per lo spazio (cabina, casa,
        // villa), non a persona: `price` sul bottone, niente priceAdult/
        // priceChild, cosi' il totale automatico non si fa (darebbe un numero
        // falso, vedi prezziAPersona() in escursioni.js). Il fornitore dava
        // due prezzi diversi per ciascuna (intestazione e corpo del testo,
        // marcati "da verificare" sulla sua stessa pagina): tenuto quello piu'
        // alto, perche' abbassarlo dopo si puo' ma alzarlo dopo che il
        // cliente l'ha letto no. Il costo per persona in piu' oltre gli
        // ospiti inclusi resta scritto in `desc`: non c'e' un modo di
        // collegare uno scaglione a scaglioni (`priceTiers`) a una singola
        // variante, solo alla scheda intera.
        {
          label: { it: "Cabina VIP (fino a 4 persone)", en: "VIP Cabin (up to 4 people)", es: "Cabaña VIP (hasta 4 personas)" },
          price: 660,
          included: ["towels"],
          desc: {
            it: "Prezzo forfettario per l'uso esclusivo della cabina, fino a 4 persone incluse (fino a 6, con 151€ a persona per ciascuna oltre le 4). Doccia privata e lettini in terrazza, minibar, cassetta di sicurezza, TV, cibo e bevande illimitati nei ristoranti del parco, bus navetta gratuito. Stesso prezzo anche a luglio e agosto.",
            en: "Flat price for exclusive use of the cabin, up to 4 people included (up to 6, with €151 per extra person beyond 4). Private shower and sun loungers on the terrace, minibar, safe, TV, unlimited food and drinks at the park's restaurants, free shuttle bus. Same price in July and August too.",
            es: "Precio fijo por el uso exclusivo de la cabaña, hasta 4 personas incluidas (hasta 6, con 151€ por persona extra a partir de la 4ª). Ducha privada y tumbonas en la terraza, minibar, caja fuerte, TV, comida y bebida ilimitadas en los restaurantes del parque, autobús lanzadera gratuito. Mismo precio también en julio y agosto."
          }
        },
        {
          label: { it: "Casa VIP (fino a 6 persone)", en: "VIP House (up to 6 people)", es: "Casa VIP (hasta 6 personas)" },
          price: 990,
          included: ["towels"],
          desc: {
            it: "Prezzo forfettario per l'uso esclusivo della casa, fino a 6 persone incluse (fino a 10, con 151€ a persona per ciascuna oltre le 6). Jacuzzi privata e doccia privata in terrazza, lettini, minibar, cassetta di sicurezza, TV, cibo e bevande illimitati nei ristoranti del parco, bus navetta gratuito.",
            en: "Flat price for exclusive use of the house, up to 6 people included (up to 10, with €151 per extra person beyond 6). Private jacuzzi and private shower on the terrace, sun loungers, minibar, safe, TV, unlimited food and drinks at the park's restaurants, free shuttle bus.",
            es: "Precio fijo por el uso exclusivo de la casa, hasta 6 personas incluidas (hasta 10, con 151€ por persona extra a partir de la 6ª). Jacuzzi privada y ducha privada en la terraza, tumbonas, minibar, caja fuerte, TV, comida y bebida ilimitadas en los restaurantes del parque, autobús lanzadera gratuito."
          }
        },
        {
          label: { it: "Villa VIP (fino a 8 persone)", en: "VIP Villa (up to 8 people)", es: "Villa VIP (hasta 8 personas)" },
          price: 1320,
          included: ["towels"],
          desc: {
            it: "Prezzo forfettario per l'uso esclusivo della villa, fino a 8 persone incluse (fino a 12, con 151€ a persona per ciascuna oltre le 8). Jacuzzi privata e doccia privata in terrazza, lettini, minibar, cassetta di sicurezza, TV, area lounge, cibo e bevande illimitati nei ristoranti premium del parco, bus navetta gratuito.",
            en: "Flat price for exclusive use of the villa, up to 8 people included (up to 12, with €151 per extra person beyond 8). Private jacuzzi and private shower on the terrace, sun loungers, minibar, safe, TV, lounge area, unlimited food and drinks at the park's premium restaurants, free shuttle bus.",
            es: "Precio fijo por el uso exclusivo de la villa, hasta 8 personas incluidas (hasta 12, con 151€ por persona extra a partir de la 8ª). Jacuzzi privada y ducha privada en la terraza, tumbonas, minibar, caja fuerte, TV, zona lounge, comida y bebida ilimitadas en los restaurantes premium del parque, autobús lanzadera gratuito."
          }
        }
      ]
    },
    transfer: {
      it: "Disponibile su richiesta, da Tenerife Nord (Puerto de la Cruz e dintorni). Basta indicare l'hotel o l'indirizzo di ritiro.",
      en: "Available on request, from Tenerife North (Puerto de la Cruz and the surrounding area). Just give the hotel or pickup address.",
      es: "Disponible bajo petición, desde Tenerife Norte (Puerto de la Cruz y alrededores). Basta con indicar el hotel o la dirección de recogida."
    },
    transferPrice: { adult: 69, child: 53 },
    transferPriceLabel: {
      it: "Transfer da Tenerife Nord",
      en: "Transfer from Tenerife North",
      es: "Traslado desde Tenerife Norte"
    },
    transferLabel: {
      it: "Vuoi il transfer da Tenerife Nord?",
      en: "Would you like the transfer from Tenerife North?",
      es: "¿Quieres el traslado desde Tenerife Norte?"
    },
    transferSiam: {
      it: "Disponibile su richiesta, da Los Gigantes, Callao Salvaje o Playa Paraíso. Basta indicare l'hotel o l'indirizzo di ritiro.",
      en: "Available on request, from Los Gigantes, Callao Salvaje or Playa Paraíso. Just give the hotel or pickup address.",
      es: "Disponible bajo petición, desde Los Gigantes, Callao Salvaje o Playa Paraíso. Basta con indicar el hotel o la dirección de recogida."
    },
    transferSiamPrice: { adult: 59, child: 42 },
    transferSiamPriceLabel: {
      it: "Transfer da Los Gigantes / Callao Salvaje / Playa Paraíso",
      en: "Transfer from Los Gigantes / Callao Salvaje / Playa Paraíso",
      es: "Traslado desde Los Gigantes / Callao Salvaje / Playa Paraíso"
    },
    transferSiamLabel: {
      it: "Vuoi il transfer da Los Gigantes, Callao Salvaje o Playa Paraíso?",
      en: "Would you like the transfer from Los Gigantes, Callao Salvaje or Playa Paraíso?",
      es: "¿Quieres el traslado desde Los Gigantes, Callao Salvaje o Playa Paraíso?"
    },
    notes: [
      { it: "In luglio e agosto il biglietto normale costa 48€ per adulto invece di 44€.",
        en: "In July and August the regular ticket costs €48 per adult instead of €44.",
        es: "En julio y agosto la entrada normal cuesta 48 € por adulto en lugar de 44 €." },
      { it: "In luglio e agosto il biglietto tutto compreso costa 169€ per adulto invece di 165€.",
        en: "In July and August the all-inclusive ticket costs €169 per adult instead of €165.",
        es: "En julio y agosto la entrada todo incluido cuesta 169 € por adulto en lugar de 165 €." }
    ],
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
    zone: "Puerto de la Cruz",
    // Al posto di "Giornata intera" l'orario vero, spostato qui da `notes`.
    duration: { it: "09:30-17:30", en: "9:30am-5:30pm", es: "09:30-17:30" },
    priceFrom: 44,
    priceAdult: 44,
    priceChild: 32,
    priceInfant: 0,
    ages: { adult: "12+", child: "3-11", infant: "0-2" },
    // Due varianti di biglietto, come su Siam Park: il normale e' a
    // persona, il tutto compreso ha lo stesso prezzo per adulti e bambini
    // (dato cosi' dall'ufficio, non e' un errore).
    options: {
      label: { it: "Tipo di biglietto", en: "Ticket type", es: "Tipo de entrada" },
      choices: [
        {
          label: { it: "Biglietti normali", en: "Regular tickets", es: "Entradas normales" },
          priceAdult: 44,
          priceChild: 32,
          desc: {
            it: "Biglietti d'ingresso regolari.",
            en: "Regular admission tickets.",
            es: "Entradas regulares."
          }
        },
        {
          label: { it: "Biglietti tutto compreso", en: "All-inclusive tickets", es: "Entradas todo incluido" },
          priceAdult: 132,
          priceChild: 132,
          included: ["drinks", "lunch"],
          desc: {
            it: "Ingresso VIP con accesso all-inclusive: cappellino Loro Parque, esperienza Loro Explore, posti riservati VIP agli spettacoli e cibo e bevande illimitati nei ristoranti (escluso il Mercato del Gambia, negozi e bazar). Stesso prezzo per adulti e bambini.",
            en: "VIP admission with all-inclusive access: Loro Parque cap, Loro Explore experience, VIP reserved seats at the shows and unlimited food and drinks at the restaurants (not including the Gambia Market, shops and bazaar). Same price for adults and children.",
            es: "Entrada VIP con acceso todo incluido: gorra de Loro Parque, experiencia Loro Explore, asientos VIP reservados en los espectáculos y comida y bebida ilimitadas en los restaurantes (no incluye el Mercado de Gambia, tiendas y bazar). Mismo precio para adultos y niños."
          }
        }
      ]
    },
    transfer: {
      it: "Disponibile su richiesta, da Tenerife Sud. Tutti i giorni da Costa Adeje e Los Cristianos; lunedì, mercoledì, giovedì e sabato da Alcalá, Abama e Los Gigantes; martedì e venerdì da Golf del Sur. Basta indicare l'hotel o l'indirizzo di ritiro.",
      en: "Available on request, from Tenerife South. Every day from Costa Adeje and Los Cristianos; Mondays, Wednesdays, Thursdays and Saturdays from Alcalá, Abama and Los Gigantes; Tuesdays and Fridays from Golf del Sur. Just give the hotel or pickup address.",
      es: "Disponible bajo petición, desde Tenerife Sur. Todos los días desde Costa Adeje y Los Cristianos; lunes, miércoles, jueves y sábado desde Alcalá, Abama y Los Gigantes; martes y viernes desde Golf del Sur. Basta con indicar el hotel o la dirección de recogida."
    },
    transferPrice: { adult: 65, child: 49 },
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
    priceInfant: 0,
    ages: { adult: "12+", child: "3-11", infant: "0-2" },
    transfer: {
      it: "Disponibile su richiesta, solo per la giornata a Loro Parque",
      en: "Available on request, for the Loro Parque day only",
      es: "Disponible bajo petición, solo para el día en Loro Parque"
    },
    transferPrice: { adult: 99, child: 74 },
    transferPriceLabel: {
      it: "Transfer Loro Parque (da sud)",
      en: "Loro Parque transfer (from the south)",
      es: "Traslado a Loro Parque (desde el sur)"
    },
    // Senza queste due, la finestra della richiesta chiede "Vuoi il
    // transfer?" e poi "Vuoi il transfer per il Siam Park?": la prima non
    // dice ne' la zona ne' il parco, e con due domande sulla stessa scheda
    // si legge come se riguardassero la stessa cosa due volte. Qui si scrive
    // la stessa coppia zona/parco gia' usata sopra in `transferPriceLabel`.
    transferLabel: {
      it: "Vuoi il transfer da sud per Loro Parque?",
      en: "Would you like the transfer from the south, to Loro Parque?",
      es: "¿Quieres el traslado desde el sur, a Loro Parque?"
    },
    transferSiam: {
      it: "Disponibile su richiesta, solo per la giornata al Siam Park",
      en: "Available on request, for the Siam Park day only",
      es: "Disponible bajo petición, solo para el día en Siam Park"
    },
    transferSiamPrice: { adult: 103, child: 78 },
    transferSiamPriceLabel: {
      it: "Transfer Siam Park (da nord)",
      en: "Siam Park transfer (from the north)",
      es: "Traslado a Siam Park (desde el norte)"
    },
    transferSiamLabel: {
      it: "Vuoi il transfer da nord per Siam Park?",
      en: "Would you like the transfer from the north, to Siam Park?",
      es: "¿Quieres el traslado desde el norte, a Siam Park?"
    },
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
    zone: "Costa Adeje",
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo" },
    priceFrom: 36,
    priceAdult: 36,
    priceChild: 29,
    priceInfant: 16,
    ages: { adult: "12+", child: "4-11", infant: "0-3" },
    included: ["transfer"],
    notes: [
      { it: "Aperto tutti i giorni, 10:00-17:00. Spettacolo dei delfini alle 15:30, incluso nel biglietto.",
        en: "Open every day, 10am-5pm. Dolphin show at 3:30pm, included in the ticket.",
        es: "Abierto todos los días, 10:00-17:00. Espectáculo de delfines a las 15:30, incluido en la entrada." },
      { it: "Navetta gratuita Aqualand: Centro Commerciale Pasarela (Los Cristianos) alle 9:30, 10:30 e 11:30; Hotel Sol Arona alle 9:35, 10:35 e 11:35; Hotel Best Tenerife alle 9:40, 10:40 e 11:40; Bar Leonardo alle 9:45, 10:45 e 11:45; Via Llanos de Troya alle 9:50, 10:50 e 11:50; H. Suite Labranda e C.C. Duke Shops (Costa Adeje) alle 10:05, 11:05 e 12:05; Hotel Sunwing Fañabé alle 10:10, 11:10 e 12:10. Ritorno da Aqualand alle 16:30 e alle 17:15.",
        en: "Free Aqualand shuttle: Pasarela shopping centre (Los Cristianos) at 9:30, 10:30 and 11:30; Hotel Sol Arona at 9:35, 10:35 and 11:35; Hotel Best Tenerife at 9:40, 10:40 and 11:40; Bar Leonardo at 9:45, 10:45 and 11:45; Via Llanos de Troya at 9:50, 10:50 and 11:50; H. Suite Labranda and Duke Shops mall (Costa Adeje) at 10:05, 11:05 and 12:05; Hotel Sunwing Fañabé at 10:10, 11:10 and 12:10. Return from Aqualand at 16:30 and 17:15.",
        es: "Lanzadera gratuita a Aqualand: C.C. Pasarela (Los Cristianos) a las 9:30, 10:30 y 11:30; Hotel Sol Arona a las 9:35, 10:35 y 11:35; Hotel Best Tenerife a las 9:40, 10:40 y 11:40; Bar Leonardo a las 9:45, 10:45 y 11:45; Via Llanos de Troya a las 9:50, 10:50 y 11:50; H. Suite Labranda y C.C. Duke Shops (Costa Adeje) a las 10:05, 11:05 y 12:05; Hotel Sunwing Fañabé a las 10:10, 11:10 y 12:10. Regreso desde Aqualand a las 16:30 y a las 17:15." },
      { it: "I posti in navetta si assegnano in ordine di arrivo, senza prenotazione: presentarsi al punto di ritiro con un po' di anticipo.",
        en: "Shuttle seats are given on a first-come, first-served basis, no booking: arrive at the pickup point a little early.",
        es: "Las plazas en la lanzadera se asignan por orden de llegada, sin reserva: preséntese en el punto de recogida con algo de antelación." }
    ],
    family: true,
    desc: {
      it: "Parco acquatico a Costa Adeje con scivoli per tutte le età, spettacolo dei delfini incluso nel biglietto e navetta gratuita da diverse zone del sud dell'isola.",
      en: "Water park in Costa Adeje with slides for every age, a dolphin show included in the ticket and a free shuttle from several areas in the south of the island.",
      es: "Parque acuático en Costa Adeje con toboganes para todas las edades, espectáculo de delfines incluido en la entrada y lanzadera gratuita desde varias zonas del sur de la isla."
    },
    image: "aqualand.jpg",
    published: true
  },
  {
    id: "jungle-park",
    title: "Jungle Park",
    category: "parchi-spettacoli",
    zone: "Chayofa (Arona)",
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo" },
    priceFrom: 35,
    priceAdult: 0,
    priceChild: 0,
    included: ["transfer"],
    notes: [
      { it: "Aperto tutti i giorni, 10:00-17:30.",
        en: "Open every day, 10am-5:30pm.",
        es: "Abierto todos los días, 10:00-17:30." }
    ],
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
    zone: "Costa Adeje / Chayofa",
    duration: {
      it: "2 giorni, 1 per parco (non necessariamente consecutivi)",
      en: "2 days, 1 per park (not necessarily consecutive)",
      es: "2 días, 1 por parque (no necesariamente consecutivos)"
    },
    priceFrom: 51,
    priceAdult: 51,
    priceChild: 42,
    priceInfant: 21,
    ages: { adult: "12+", child: "4-11", infant: "0-3" },
    included: ["transfer"],
    notes: [
      { it: "Aqualand 10:00-17:00, Jungle Park 10:00-17:30.",
        en: "Aqualand 10am-5pm, Jungle Park 10am-5:30pm.",
        es: "Aqualand 10:00-17:00, Jungle Park 10:00-17:30." },
      { it: "Navetta per Aqualand: da Los Cristianos (C.C. Pasarela) alle 9:30, 10:30 e 11:30; da Playa de las Américas (Hotel Sol Arona) alle 9:35, 10:35 e 11:35 e (Hotel Best Tenerife / Bar Leonardo's) alle 9:40, 10:40 e 11:40; da Costa Adeje (H. Labranda Suites / The Duke Shops) alle 10:05, 11:05 e 12:05 e (Hotel Sunwing Fañabé) alle 10:10, 11:10 e 12:10. Ritorno da Aqualand alle 16:30 e alle 17:15.",
        en: "Shuttle to Aqualand: from Los Cristianos (Pasarela shopping centre) at 9:30, 10:30 and 11:30; from Playa de las Américas (Hotel Sol Arona) at 9:35, 10:35 and 11:35 and (Hotel Best Tenerife / Bar Leonardo's) at 9:40, 10:40 and 11:40; from Costa Adeje (H. Labranda Suites / The Duke Shops) at 10:05, 11:05 and 12:05 and (Hotel Sunwing Fañabé) at 10:10, 11:10 and 12:10. Return from Aqualand at 16:30 and 17:15.",
        es: "Lanzadera a Aqualand: desde Los Cristianos (C.C. Pasarela) a las 9:30, 10:30 y 11:30; desde Playa de las Américas (Hotel Sol Arona) a las 9:35, 10:35 y 11:35 y (Hotel Best Tenerife / Bar Leonardo's) a las 9:40, 10:40 y 11:40; desde Costa Adeje (H. Labranda Suites / The Duke Shops) a las 10:05, 11:05 y 12:05 y (Hotel Sunwing Fañabé) a las 10:10, 11:10 y 12:10. Regreso desde Aqualand a las 16:30 y a las 17:15." },
      { it: "Navetta per Jungle Park: collegamento diretto da Aqualand Costa Adeje alle 9:30 e alle 10:45, oppure dagli stessi punti di ritiro di Aqualand con orario leggermente anticipato. Ritorno da Jungle Park alle 16:30 e alle 17:30.",
        en: "Shuttle to Jungle Park: direct connection from Aqualand Costa Adeje at 9:30 and 10:45, or from the same Aqualand pickup points a little earlier. Return from Jungle Park at 16:30 and 17:30.",
        es: "Lanzadera a Jungle Park: conexión directa desde Aqualand Costa Adeje a las 9:30 y a las 10:45, o desde los mismos puntos de recogida de Aqualand con horario ligeramente anticipado. Regreso desde Jungle Park a las 16:30 y a las 17:30." },
      { it: "I posti in navetta si assegnano in ordine di arrivo: presentarsi al punto di ritiro almeno 15 minuti prima dell'orario.",
        en: "Shuttle seats are given on a first-come, first-served basis: arrive at the pickup point at least 15 minutes before the scheduled time.",
        es: "Las plazas en la lanzadera se asignan por orden de llegada: preséntese en el punto de recogida al menos 15 minutos antes de la hora prevista." }
    ],
    family: true,
    desc: {
      it: "Biglietto combinato per i due parchi del sud: un giorno all'Aqualand e uno al Jungle Park, con navetta gratuita da diverse zone del sud dell'isola.",
      en: "Combined ticket for the two parks in the south: one day at Aqualand and one at Jungle Park, with a free shuttle from several areas in the south of the island.",
      es: "Entrada combinada para los dos parques del sur: un día en Aqualand y otro en Jungle Park, con lanzadera gratuita desde varias zonas del sur de la isla."
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

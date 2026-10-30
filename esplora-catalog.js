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
//                ma a ore o a gruppo, es. { it: "/ora", en: "/hr", es: "/h", fr: "/h", de: "/Std." }
//                oppure { it: "a barca", en: "per boat", es: "por barco", fr: "par bateau", de: "pro Boot" }.
//                Quello che inizia con "/" si attacca al prezzo, il resto va
//                staccato: ci pensa il sito.
//   units      → facoltativo, e va insieme a priceUnit: dove il prezzo e' del
//                mezzo e non della persona, i mezzi da prenotare, uno per tipo.
//                Nella finestra della richiesta prende il posto di "Quante
//                persone" — non si aggiunge, lo **sostituisce**: sul jet ski
//                quattro amici sono "due doppie e due singole", e un "4 adulti"
//                accanto sarebbe un secondo numero da far tornare.
//                    units: {
//                      label: { it: "Quante moto d'acqua", en: "...", es: "...", fr: "...", de: "..." },
//                      name:  { it: "Moto d'acqua", en: "Jet skis", es: "...", fr: "Jet-skis", de: "Jetskis" },
//                      types: [
//                        { key: "singola", seats: 1, name: { it: "Singola", ... } },
//                        { key: "doppia",  seats: 2, name: { it: "Doppia",  ... } }
//                      ]
//                    }
//                `label` e' la domanda nella finestra, `name` il nome che va
//                nel messaggio ("Moto d'acqua: Singola × 2 · Doppia × 1"): in
//                cinque lingue non si ricavano l'uno dall'altro.
//                `seats` e' **quante persone ci salgono**, e serve al conto dei
//                pacchetti: li' si contano i mezzi e le persone insieme (il
//                buggy a mezzo, il parascending a testa), e senza i posti il
//                sito non puo' dire "avete scelto due posti ma siete in
//                quattro". Non si vede da nessuna parte in pagina: i posti
//                dove contano sono gia' scritti dentro `name` ("2 posti") o
//                dentro `label` ("il singolo porta 1 persona, il doppio 2"),
//                e riscriverli accanto darebbe "2 posti · 2 posti · €180".
//                Va su **tutti** i tipi di ogni `units`, e `controlla.js` lo
//                verifica: un tipo senza posti farebbe sparire il controllo
//                senza dirlo a nessuno.
//                Il prezzo di ogni tipo lo mette la **variante**, con
//                `unitPrices` e le stesse chiavi, perche' cambia con la durata:
//                    unitPrices: { singola: 180, doppia: 200 }
//                La prima riga parte da 1 e le altre da 0; zero mezzi in tutto
//                non e' una richiesta e la finestra lo dice.
//                `transferPrice` dentro `units` e' quanto costa il ritiro **a
//                mezzo**, non a persona: e' il motivo per cui non sta in
//                `transferPrice` della scheda, che invece e' fatto di prezzi a
//                testa. Ha tre stati, come `priceInfant`:
//                    transferPrice: 12  → supplemento a mezzo, entra nel totale
//                                         con la sua riga nel conto
//                    transferPrice: 0   → ritiro compreso: niente riga, il
//                                         totale non cambia
//                    (assente)          → non si sa quanto costa: col transfer
//                                         spuntato il totale non si fa, perche'
//                                         mancherebbe un pezzo di quello che il
//                                         cliente paga
//                Zero e' un numero vero e va scritto: "assente" vuol dire che
//                non lo sappiamo, non che e' gratis.
//   priceTiers → facoltativo: prezzi a scaglioni per numero di persone. La
//                scheda del catalogo mostra comunque priceFrom, la pagina di
//                dettaglio elenca tutti gli scaglioni:
//                    priceTiers: [ { from: 7, to: 10, price: 350 } ]
//   priceList  → facoltativo: il prezzo di LISTINO, quello pieno. Serve alle
//                offerte a tempo e va insieme a `offerUntil`.
//                Finche' l'offerta e' viva si vede BARRATO davanti al prezzo
//                scontato, e si paga `priceAdult`. Quando l'offerta scade
//                questo diventa il prezzo vero: la scheda si aggiorna da
//                sola, e con lei il totale della richiesta.
//                Deve essere piu' ALTO del prezzo scontato, se no non e' uno
//                sconto e controlla.js da' errore.
//                ⚠ ATTENZIONE, NON E' SOLO GRAFICA: su un prezzo barrato la
//                direttiva Omnibus (UE 2019/2161, in Spagna dal 2022) chiede
//                che il prezzo barrato sia stato davvero applicato nei 30
//                giorni PRECEDENTI. Un listino che entra in vigore solo DOPO
//                la promozione non lo e' mai stato, e barrarlo e' la pratica
//                che la norma sanziona — la sanzione la prende Admiral. Se il
//                45 e' il prezzo futuro e non quello passato, la strada
//                pulita e' non barrare niente e scrivere "prezzo di lancio,
//                dal 1 novembre 45 €": stessa urgenza, nessun rischio.
//                Da non confondere col prezzo barrato di un RIVENDITORE, che
//                non si copia mai: quello e' lo sconto di un altro.
//                    priceList: 45
//   offerUntil → facoltativo, e va insieme a priceList: l'ultimo giorno in cui
//                si paga il prezzo scontato, scritto "2026-10-31". Vale per
//                tutto quel giorno.
//                Il giorno dopo la scheda passa da sola a `priceList`: il
//                barrato sparisce, il prezzo SALE al listino e il totale della
//                richiesta lo segue. E' una scelta esplicita del proprietario
//                (7 settembre 2026) e va contro la regola generale del
//                progetto, che dice di non alzare un prezzo gia' letto: qui
//                l'aumento e' il senso stesso della promozione a tempo.
//                Senza questo campo l'offerta non scade mai, e controlla.js
//                avvisa: uno sconto permanente non e' uno sconto.
//                    offerUntil: "2026-10-31"
//   priceAdult → prezzo per adulto, in euro. 0 = non ancora deciso.
//   priceChild → prezzo per bambino, in euro. 0 = non ancora deciso.
//                A 0 le righe NON compaiono sulla pagina: un "€0" davanti a un
//                cliente sembra gratis o rotto. Appena metti un numero vero,
//                la riga si accende da sola.
//   priceInfant → facoltativo: prezzo per i piu' piccoli, in euro. Qui **0 vuol
//                dire davvero gratis**, al contrario di priceAdult e priceChild
//                dove 0 vuol dire "non ancora deciso". Se il campo manca del tutto
//                la riga non compare: e' cosi' che si dice "non lo sappiamo".
//   fixedPrice → facoltativo: questa attivita' si compra a prezzo fisso e si
//                rivende uguale, quindi **lo sconto dei pacchetti non la
//                tocca**. Ci vanno i giri in pullman con guida, dove si compra
//                un posto sul bus di un operatore, e i biglietti a giornata:
//                un 10% in meno uscirebbe dalla tasca di Admiral, non dal
//                margine. I parchi e gli spettacoli non hanno bisogno di
//                questo campo — sono gia' coperti per categoria, vedi
//                `PACCHETTI_CATEGORIE_SENZA_SCONTO` in pacchetti.js.
//                Si puo' mettere anche dentro una singola variante, e li' la
//                variante vince: se un giorno lo stesso tour si fa in pullman
//                o in minivan, il pullman e' a prezzo fisso e il minivan no.
//                Non cambia niente su questa scheda: si vede solo nel conto di
//                un pacchetto che la contiene.
//                    fixedPrice: true
//   ages       → facoltativo: le fasce d'eta', scritte come le scrive il fornitore.
//                Di solito bastano dei numeri ("12+", "4-11"), uguali in tutte
//                le lingue. Quando invece c'e' una parola dentro si scrivono
//                nelle cinque lingue come tutto il resto:
//                    infant: { it: "0-11 mesi", en: "0-11 months", es: "0-11 meses", fr: "0-11 mois", de: "0-11 Monate" }
//                Finiscono fra parentesi accanto alle righe del prezzo:
//                "Adulti (12+)", "Bambini (3-11)", "Neonati (0-2)".
//                    ages: { adult: "12+", child: "3-11", infant: "0-2" }
//                **Solo per adulti**: la sola fascia `adult` che parte da 13 anni
//                o piu' ("16+", "18+"), senza `child` ne' `infant`, toglie il
//                campo dei bambini dalla richiesta (soloAdulti in escursioni.js).
//                    ages: { adult: "18+" }
//   included   → facoltativo: cosa comprende il prezzo. Si scrivono delle parole
//                chiave, non del testo: l'icona e la traduzione nelle cinque lingue
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
//                    notes: [ { it: "...", en: "...", es: "...", fr: "...", de: "..." } ]
//   activityDuration, activityLabel → facoltativi, e vanno insieme: quanto dura
//                l'**attivita'** dentro la giornata, che non e' quanto dura
//                l'escursione. Sulle camminate si sta in giro tutto il giorno e
//                si cammina due ore: scritte da sole le due cose si scacciano a
//                vicenda — "Giornata intera" nasconde quanto si cammina, "2 ore"
//                fa tornare il cliente a pranzo. Sono due righe di "In breve",
//                una sotto l'altra, perche' sono due domande.
//                `activityDuration` e' il valore e sta sulla scheda oppure
//                **dentro la variante**, dove vince come `duration` e `days`:
//                i tre cammini durano diverso.
//                `activityLabel` e' il nome della riga e sta solo sulla scheda,
//                perche' e' lo stesso per tutte le varianti. Senza, si ripiega
//                su `detail.activity` ("Durata dell'attivita'"), che e' generico
//                apposta: la parola giusta la sa la scheda.
//                    activityLabel: { it: "Tempo di cammino", en: "Walking time", es: "...", fr: "Temps de marche", de: "Gehzeit" }
//                    // e dentro ogni variante:
//                    activityDuration: { it: "2 ore", en: "2 hours", es: "2 horas", fr: "2 heures", de: "2 Stunden" }
//                Si vede solo sulla pagina di dettaglio: fra le pillole
//                dell'elenco sarebbe una terza riga senza la variante scelta.
//   privateOption → facoltativo: id dell'escursione in versione privata. Sulla
//                pagina di dettaglio compare un rimando "vuoi la barca solo per
//                il tuo gruppo?".
//   privateTitle, privateLink → facoltativi, e vanno con privateOption:
//                sostituiscono quelle due frasi fisse, che parlano di barche
//                perche' li' sono nate. Servono dove la versione privata non e'
//                una barca — sul tuk tuk "vuoi la barca" sarebbe la frase
//                sbagliata — e si scrivono nelle cinque lingue come tutto il resto.
//                Senza questi campi resta il testo di sempre, quindi le schede
//                delle barche non si toccano.
//                    privateTitle: { it: "Vuoi il tuk tuk solo per il tuo gruppo?", ... }
//                    privateLink:  { it: "Vedi i giri privati", ... }
//   season     → facoltativo: quando l'attivita' si fa solo in certi mesi. Compare
//                come etichetta sulla scheda, come riga sulla pagina di dettaglio e
//                come avviso nella finestra della richiesta, cioe' prima che il
//                cliente scelga una data impossibile. Esempio:
//                    season: { it: "Solo luglio e agosto", en: "July and August only",
//                              es: "Solo julio y agosto", fr: "Juillet et août seulement", de: "Nur Juli und August" }
//   pochiPosti → facoltativo: l'avvertimento che i posti finiscono presto, dove
//                il proprietario lo chiede (Freebird, 29 ottobre 2026). Nella
//                pagina di dettaglio e' un riquadro sotto la descrizione, col
//                testo per intero; nell'elenco la scheda porta l'etichetta
//                "Posti limitati" (tour.fewSeats in i18n.js).
//                    pochiPosti: { it: "I posti si esauriscono in fretta: ...", ... }
//   transfer   → facoltativo: quando l'attivita' si puo' avere col trasporto incluso.
//                Sulla scheda compare la pillola "Transfer disponibile", sulla pagina
//                di dettaglio questo testo per esteso, che e' il posto dove spiegare
//                i limiti (per il Twin Ticket il transfer vale solo per Loro Parque).
//                    transfer: { it: "Disponibile su richiesta", en: "...", es: "...", fr: "...", de: "..." }
//                Vale anche dentro una variante (`options.choices[].transfer`), e la
//                variante vince: sul Freebird il transfer c'e' sui giri di 3 e 4 ore
//                e mezza, non su quello di 2 (15 ottobre 2026). Nella finestra della
//                richiesta diventa la casella "Vuoi il transfer?": spuntata, chiede
//                l'hotel anche su una scheda di PICKUP_NESSUNO (hotel.js); non
//                spuntata, mostra il `ritrovo`.
//   ritrovo    → facoltativo: dove ci si presenta quando non si passa a prendere
//                il cliente (la scheda sta in PICKUP_NESSUNO) o lui il transfer non
//                lo vuole. Compare nella finestra della richiesta ("Punto di
//                ritrovo: … ci arrivi da solo"), va nel messaggio WhatsApp e nel
//                database (pickup_point), e la conferma dei venditori parte gia'
//                scritta con quello. Il nome del posto non si traduce, il resto si':
//                    ritrovo: "Black Pearl Bar, Puerto Colón"
//                    ritrovo: { it: "Puerto Colón, molo 10", en: "Puerto Colón, dock 10", ... }
//                Vale anche dentro una variante, e la variante vince. Solo dove il
//                posto e' scritto davvero: senza, la finestra non dice niente e il
//                punto lo scrive l'ufficio confermando.
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
//   transferPriceUnknown → facoltativo: metti true quando il transfer si paga
//                ma il prezzo si sa solo su richiesta (Scandal Dinner Show). Col
//                transfer spuntato il totale non si fa. Senza questo campo, su una
//                scheda a persona un `transferPrice` assente vuol dire che il
//                transfer non cambia il prezzo (compreso, gratis o pagato sul
//                posto): e' il caso di Peter Pan, immersioni, kayak.
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
//   menus      → facoltativo: le scelte di menu, sulle attivita' dove si mangia
//                e la cucina prepara alternative (vegetariano, vegano, menu
//                bambini). Solo dove c'e' questo campo la finestra della
//                richiesta mostra la domanda "Esigenze sul menu", e la scelta
//                finisce nel messaggio WhatsApp. Come `languages`: si mette solo
//                dove il fornitore lo dice, non ovunque ci sia una cena.
//                A differenza di `languages` queste sono parole normali, quindi
//                si scrivono nelle cinque lingue:
//                    menus: [ { it: "Vegetariano", en: "Vegetarian", es: "Vegetariano", fr: "Végétarien", de: "Vegetarisch" } ]
//                La voce "Menu standard" non si scrive: la mette il sito come
//                prima scelta, e chi la lascia li' non fa comparire nessuna riga
//                nel messaggio — all'ufficio interessa solo l'esigenza vera.
//                Le allergie **non** vanno qui: sono troppo diverse una
//                dall'altra per stare in un elenco, e si scrivono nelle note.
//                Sotto la domanda compare da sola una riga che lo ricorda.
//   days       → facoltativo: i giorni in cui l'attivita' si fa. Dove c'e', il
//                cliente che sceglie un altro giorno se lo sente dire subito,
//                sotto la data, e la richiesta non parte.
//                Il blocco e' voluto: un'escursione non si prenota nel giorno
//                in cui non c'e' (proprietario, 8 settembre 2026, dopo averlo
//                provato a togliere e rimesso lo stesso giorno).
//                Dove i giorni possono cambiare con la lingua della guida, il
//                cliente lo legge in una **nota** della scheda — l'avviso e la
//                nota fanno due mestieri diversi e stanno bene insieme.
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
//                      label: { it: "Durata", en: "Duration", es: "Duración", fr: "Durée", de: "Dauer" },
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
//                  group → la chiave del gruppo a cui appartiene, vedi
//                          `groups` qui sotto.
//                  times → gli orari di partenza **di quella variante**, quando
//                          dipendono dalla durata (il giro di 2 ore parte alle
//                          11:00 e quello di 3 alle 10:00). Battono il campo
//                          `times` dell'attivita'.
//                `groups` → facoltativo, dentro `options`: dove le varianti
//                sono tante, i gruppi in cui stanno. Ogni gruppo diventa un
//                pulsante chiuso che toccandolo apre le sue varianti, e la
//                pagina resta corta. Ogni variante dice il suo con `group`.
//                    groups: [ { key: "strada", label: { it: "Bici da strada", ... },
//                                desc: { it: "Otto giri su asfalto", ... } } ]
//                Le varianti di un gruppo stanno **in fila** in `choices`, e i
//                gruppi nello stesso ordine di `groups`: la richiesta ritrova
//                la variante scelta per posizione. `controlla.js` lo verifica.
//   category   → la categoria in cui sta la scheda, una sola. E' quella
//                scritta sulla card e in cima alla pagina di dettaglio.
//   alsoIn     → facoltativo: le ALTRE categorie in cui la stessa scheda deve
//                comparire, quando una sola non la racconta tutta. "Poema del
//                Mar" e' un parco (l'acquario) ed e' una giornata su un'altra
//                isola: chi guarda fra i parchi e chi guarda fra i tour devono
//                trovarla tutti e due.
//                    category: "parchi-spettacoli",
//                    alsoIn: ["tour-isola"]
//                La scheda resta **una**, con un id solo e una pagina sola: e'
//                lo stesso riquadro che esce sotto piu' filtri. Copiarla in
//                due voci vorrebbe dire due prezzi da tenere allineati a mano,
//                e prima o poi uno resta indietro.
//                Il nome scritto sulla card resta quello di `category`, anche
//                quando si e' arrivati dall'altra categoria: un riquadro che
//                cambia etichetta a seconda del filtro premuto non si
//                riconosce piu' da una pagina all'altra.
//                Attenzione ai pacchetti: basta che UNA delle categorie sia
//                fra quelle senza sconto (`PACCHETTI_CATEGORIE_SENZA_SCONTO`
//                in pacchetti.js) perche' lo sconto non si faccia. E' la
//                direzione prudente: su un biglietto di un parco, comprato a
//                prezzo fisso e rivenduto uguale, il 10% uscirebbe dalla
//                tasca di Admiral.
//   zoneGroups → facoltativo: i gruppi di zona per il filtro "Zona" dell'elenco,
//                presi da ZONE_FILTRO qui sotto. `zone` resta il testo per il
//                cliente; questo e' solo per filtrare, e il cliente non lo legge.
//                Se la scheda parte da due posti (anche in una variante) ci
//                vanno tutti e due, ed esce sotto entrambi:
//                    zoneGroups: ["costa-adeje", "los-cristianos"]
//                Per le gite col ritiro dal sud vale **dove si va**: il Teide
//                sta in "teide-nord". Senza il campo (zona "Da definire") la
//                scheda sparisce appena si sceglie una zona.
//   durationGroups → facoltativo, come zoneGroups ma per la durata, da
//                DURATE_FILTRO. "2 o 3 ore" sta in "breve" e in "mezza".
//   family     → true se adatta ai bambini (serve al filtro "Con bambini").
//   published  → la pagina catalogo mostra solo le voci a true. Ora sono tutte
//                pubblicate per averle sott'occhio: quelle senza prezzo appaiono
//                come "Su richiesta" e quelle senza foto con un segnaposto.
//                Metti false per nascondere una voce ai clienti.
//   venditori  → facoltativo: true su una voce con published: false che deve
//                stare SOLO nel menu del modulo dei venditori (i noleggi,
//                proprietario 14 ottobre 2026): il cliente non la vede in
//                nessuna pagina, ma un ticket di carta la puo' scegliere e
//                averne compagnia e netto.
//   nomi       → facoltativo: gli altri nomi con cui i venditori scrivono
//                questa attivita' sul ticket di carta, di solito il nome
//                della compagnia ("COOL SAILING"). Servono solo alla lettura
//                della foto in venditori.html: Claude li vede accanto al
//                titolo e dal nome risale alla scheda. Il cliente non li vede
//                mai, e non si traducono: sono nomi propri.
//                    nomi: ["Cool Sailing"]
//                Un nome va su una scheda sola: se due schede lo avessero,
//                Claude non saprebbe quale scegliere. `controlla.js` lo
//                verifica. Maiuscole e minuscole non contano.
//                Si mette anche dentro una VARIANTE (options.choices[]),
//                quando una compagnia fa proprio quella e sul ticket c'e' solo
//                il suo nome, non la variante: "Andromeda" e' la serata del
//                gruppo piccolo di Teide Stars & Sunset. Allora il modulo dei
//                venditori, trovata la compagnia, sceglie anche la variante.
//                Il nome della variante deve stare anche nei `nomi` della
//                scheda (e' da li' che nasce il menu "Compagnia"):
//                `controlla.js` lo verifica.
//   pagamento  → facoltativo: "card" quando il ticket di questa scheda conta
//                SEMPRE come pagato con carta, comunque abbia pagato il cliente
//                (i parchi: Loro Parque, Siam Park, Siam Night, Twin Ticket; proprietario,
//                9 ottobre 2026; e dall'11 ottobre le cinque escursioni di
//                Island Excursions; dal 13 ottobre Peter Pan, dal 14 Aqualand, dal 17 Freebird). Nel modulo dei venditori il pagamento si
//                sceglie da solo e Cash non si puo' scegliere. Lo stesso elenco
//                sta su Supabase (supabase/modifiche/2026-10-09-solo-card.sql),
//                che lo fa valere anche sui ticket gia' salvati: `controlla.js`
//                verifica che i due elenchi siano uguali.
//                    pagamento: "card"
//
// LE TRE LINGUE
//   title, zone, duration e desc si scrivono così:
//       title: { it: "...", en: "...", es: "...", fr: "...", de: "..." }
//   Se un testo è uguale in tutte e cinque le lingue (i nomi propri, per esempio
//   "Siam Park" o "Costa Adeje") basta scrivere la stringa da sola:
//       zone: "Costa Adeje"
//
// Le descrizioni sono scritte da zero per Isla: non copiare quelle di altri siti.

// Numero WhatsApp su cui arrivano le richieste. Formato internazionale, senza
// + e senza spazi. Sta qui perche' questo file e' caricato da tutte le pagine:
// lo usano sia le schede del catalogo sia l'assistente. Svuotalo per nascondere
// ovunque i pulsanti che aprono WhatsApp.
const WHATSAPP_NUMBER = "34657772032";

// GLI ORARI DI PARTENZA
//
// ⚠ QUESTI SONO SEGNAPOSTO: sono fasce generiche, non gli orari veri delle
// attività. Servono per far funzionare il campo "A che ora" finché l'ufficio
// non manda quelli giusti.
//
// Ogni attività può avere i suoi: si scrive `times: ["09:30 - 12:30", ...]`
// nella sua scheda e quella lista prende il posto di questa. Sono orari, quindi
// si scrivono uguali in tutte e cinque le lingue: niente { it, en, es, fr, de }.
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
    name: { it: "Mare e barche", en: "Sea and boats", es: "Mar y barcos", fr: "Mer et bateaux", de: "Meer und Boote" },
    image: "Cat-mare.webp"
  },
  // La categoria "stelle" non c'e' piu': aveva una scheda sola, e una categoria
  // con dentro un'unica voce fa fare un giro in piu' per arrivare a una cosa.
  // La serata al Teide e' passata di qua, e il nome lo dice.
  {
    id: "teide-natura",
    name: { it: "Natura, Teide e stelle", en: "Nature, Teide and stars", es: "Naturaleza, Teide y estrellas", fr: "Nature, Teide et étoiles", de: "Natur, Teide und Sterne" },
    image: "Cat-teide.webp"
  },
  {
    id: "avventura-motori",
    name: { it: "Avventura", en: "Adventure", es: "Aventura", fr: "Aventure", de: "Abenteuer" },
    image: "Cat-avventura.webp"
  },
  {
    id: "sport-acquatici",
    name: { it: "Sport acquatici", en: "Water sports", es: "Deportes acuáticos", fr: "Sports nautiques", de: "Wassersport" },
    image: "Cat-sport.webp"
  },
  {
    id: "parchi-spettacoli",
    name: { it: "Parchi e spettacoli", en: "Parks and shows", es: "Parques y espectáculos", fr: "Parcs et spectacles", de: "Parks und Shows" },
    image: "Cat-parchi.webp"
  },
  {
    id: "tour-isola",
    name: { it: "Tour e visite", en: "Tours & sightseeing", es: "Tours y visitas", fr: "Visites et découvertes", de: "Touren und Besichtigungen" },
    image: "santa-cruz-taganana.webp"
  },
  {
    id: "tour-privati",
    name: { it: "Tour privati", en: "Private tours", es: "Tours privados", fr: "Visites privées", de: "Private Touren" },
    image: "Cat-privati.jpg"
  },
  // I noleggi non sono escursioni: per il cliente stanno nella pagina
  // Noleggio (noleggio.js). Questa categoria serve solo a raggrupparli nel
  // menu dei venditori; le sue voci non sono pubblicate, quindi nell'elenco
  // delle esperienze non compare mai (14 ottobre 2026).
  {
    id: "noleggi",
    name: { it: "Noleggi", en: "Rentals", es: "Alquileres", fr: "Locations", de: "Vermietungen" }
  }
];

// Le RACCOMANDATE: le schede che spingiamo. Nella pagina "Esperienze" sono il
// primo filtro, ed e' quello acceso quando ci si arriva senza scegliere niente
// (in fondo alla riga c'e' "Tutte"). Si scrivono gli id, uguali a quelli del
// catalogo, nell'ordine in cui devono uscire: l'elenco li mostra cosi'.
// Per ora sono i quattro prodotti da spingere dei pacchetti (vedi pacchetti.js).
// Un id sbagliato o una scheda non pubblicata li segnala `controlla.js`.
const RACCOMANDATE = [
  "luxury-cruiser",
  "buggy-volcano-4h",
  "stargazing-group",
  "jet-ski-safari-1-2h"
];

// Le SELEZIONI: elenchi di schede scelti a mano, a cui porta un riquadro della
// home. Si aprono con `escursioni.html?sel=<chiave>`, che mostra solo quelle
// schede, nell'ordine scritto qui, col titolo `title` (una chiave di i18n).
// Come le raccomandate, ma non sono un filtro della riga: ci si arriva solo
// dal link, e toccando una categoria si torna al catalogo normale.
// Un id sbagliato o una scheda non pubblicata li segnala `controlla.js`.
const SELEZIONI = {
  // "Food Experience" (proprietario, 6 ottobre 2026): le degustazioni, una per
  // una. Prima il riquadro portava a due pacchetti; il proprietario vuole le
  // escursioni singole. Solo le degustazioni, non le cene-spettacolo e non le
  // barche col pranzo a bordo: anche questa e' una sua scelta.
  food: {
    title: "catalog.foodTitle",
    ids: ["cantine-vinicole", "bananas-wines", "finca-tuno"]
  }
};

// I gruppi del bottone "Filtri" nell'elenco. Le zone scritte nelle schede sono
// ventisei, ognuna a modo suo ("Puerto Colón", "Costa Adeje – Los Cristianos"):
// un filtro con ventisei bottoni non serve a nessuno, quindi si raggruppano.
// Gruppi decisi dal proprietario il 5 ottobre 2026; Los Gigantes sta da solo,
// per sua scelta. Ogni scheda dice i suoi in `zoneGroups` e `durationGroups`.
const ZONE_FILTRO = [
  { id: "costa-adeje", name: "Costa Adeje" },
  { id: "los-cristianos", name: { it: "Los Cristianos e dintorni", en: "Los Cristianos area", es: "Los Cristianos y alrededores", fr: "Los Cristianos et alentours", de: "Los Cristianos und Umgebung" } },
  { id: "los-gigantes", name: "Los Gigantes" },
  { id: "teide-nord", name: { it: "Teide e nord", en: "Teide and the north", es: "Teide y el norte", fr: "Teide et le nord", de: "Teide und der Norden" } },
  { id: "altre-isole", name: { it: "Altre isole", en: "Other islands", es: "Otras islas", fr: "Autres îles", de: "Andere Inseln" } }
];
const DURATE_FILTRO = [
  { id: "breve", name: { it: "Fino a 2 ore", en: "Up to 2 hours", es: "Hasta 2 horas", fr: "Jusqu'à 2 heures", de: "Bis 2 Stunden" } },
  { id: "mezza", name: { it: "Mezza giornata", en: "Half day", es: "Media jornada", fr: "Demi-journée", de: "Halbtags" } },
  { id: "intera", name: { it: "Giornata intera", en: "Full day", es: "Día completo", fr: "Journée entière", de: "Ganztags" } }
];

// Le categorie di una scheda: la sua, piu' quelle facoltative di `alsoIn`.
// Sta qui, accanto a CATEGORIES, perche' questo file lo caricano tutte le
// pagine — e perche' chi legge il catalogo deve vedere le stesse categorie
// dappertutto: i filtri dell'elenco, la ricerca, l'assistente, le schede
// correlate e il conto dei pacchetti. Se uno dei cinque leggesse solo
// `category`, la scheda uscirebbe in una categoria e sparirebbe nell'altra.
function categorieDi(tour) {
  return [tour.category].concat(tour.alsoIn || []);
}

const ESPLORA_CATALOG = [

  // ─── MARE E BARCHE ────────────────────────────────────────────────────────
  // Prodotti presi dal catalogo Admiral (categoria "Boats").
  // I titoli restano scritti come li scrive Admiral, uguali in tutte le lingue:
  // cosi' il cliente vede lo stesso nome del sito e, quando la richiesta
  // arriva su WhatsApp, in ufficio si ritrova il nome esatto da cercare.
  {
    id: "freebird-catamaran",
    // Il nome della barca non sta nel titolo (proprietario, 28 ottobre 2026):
    // il cliente legge che giro e', nella sua lingua. Sta in `nomi`, per i
    // venditori e i ticket.
    title: { it: "Crociera in catamarano con balene e delfini", en: "Whale & Dolphin Catamaran Cruise", es: "Crucero en catamarán con ballenas y delfines", fr: "Croisière en catamaran baleines et dauphins", de: "Wal- und Delfin-Katamarantour" },
    nomi: ["Freebird"],
    // Proprietario, 29 ottobre 2026: si riempie presto.
    pochiPosti: {
      it: "I posti si esauriscono in fretta: meglio chiederlo con qualche giorno di anticipo.",
      en: "Seats sell out fast: it's best to request it a few days in advance.",
      es: "Las plazas se agotan rápido: mejor solicitarlo con unos días de antelación.",
      fr: "Les places partent vite : mieux vaut faire la demande quelques jours à l'avance.",
      de: "Die Plätze sind schnell vergeben: am besten ein paar Tage vorher anfragen."
    },
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "Da 2 a 4 ore e mezza", en: "2 to 4.5 hours", es: "De 2 a 4,5 horas", fr: "De 2 à 4 heures et demie", de: "2 bis 4,5 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["breve", "mezza"],
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
    // Il ticket conta sempre come pagato con carta (proprietario, 17 ottobre
    // 2026): stessa regola dei parchi, e stesso elenco in sempre_card.
    pagamento: "card",
    options: {
      label: { it: "Durata", en: "Duration", es: "Duración", fr: "Durée", de: "Dauer" },
      choices: [
        {
          label: { it: "2 ore", en: "2 hours", es: "2 horas", fr: "2 heures", de: "2 Stunden" },
          priceAdult: 30,
          priceChild: 15,
          days: ["lun", "mer", "ven"],
          times: ["11:00"],
          desc: {
            it: "Balene e delfini, con sosta bagno davanti a Bahía del Duque. A bordo bevande illimitate, ma niente da mangiare e niente transfer: al porto ci si arriva da soli. Lunedì, mercoledì e venerdì, partenza alle 11:00.",
            en: "Whales and dolphins, with a swim stop off Bahía del Duque. Unlimited drinks on board, but no food and no transfer: you make your own way to the harbour. Mondays, Wednesdays and Fridays, leaving at 11:00.",
            es: "Ballenas y delfines, con parada de baño frente a Bahía del Duque. A bordo bebidas ilimitadas, pero sin comida y sin traslado: al puerto se llega por cuenta propia. Lunes, miércoles y viernes, salida a las 11:00.",
            fr: "Baleines et dauphins, avec un arrêt baignade devant Bahía del Duque. À bord, boissons à volonté, mais rien à manger et pas de transfert : on se rend au port par ses propres moyens. Lundi, mercredi et vendredi, départ à 11:00.",
            de: "Wale und Delfine, mit Badestopp vor Bahía del Duque. An Bord unbegrenzt Getränke, aber nichts zu essen und kein Transfer: Zum Hafen kommt man selbst. Montag, Mittwoch und Freitag, Abfahrt um 11:00."
          }
        },
        {
          label: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
          priceAdult: 47,
          priceChild: 23,
          included: ["snack", "transfer"],
          transfer: {
            it: "Compreso, dalle zone del sud. Se preferisci raggiungerci, ti aspettiamo al porto: Puerto Colón, molo 10.",
            en: "Included, from the southern areas. If you'd rather come on your own, we'll be waiting for you at the harbour: Puerto Colón, dock 10.",
            es: "Incluido, desde las zonas del sur. Si prefieres venir por tu cuenta, te esperamos en el puerto: Puerto Colón, muelle 10.",
            fr: "Compris, depuis les zones du sud. Si vous préférez venir par vos propres moyens, nous vous attendons au port : Puerto Colón, quai 10.",
            de: "Inklusive, aus dem Süden der Insel. Wenn Sie lieber selbst kommen, erwarten wir Sie am Hafen: Puerto Colón, Steg 10."
          },
          times: ["10:00"],
          desc: {
            it: "Balene e delfini, con sosta bagno a Diego Hernández e tempo per stare al sole. A bordo un panino e bevande illimitate. Transfer dall'hotel compreso. Tutti i giorni, partenza alle 10:00.",
            en: "Whales and dolphins, with a swim stop at Diego Hernández and time to sit in the sun. A sandwich and unlimited drinks on board. Hotel transfer included. Every day, leaving at 10:00.",
            es: "Ballenas y delfines, con parada de baño en Diego Hernández y tiempo para tomar el sol. A bordo un bocadillo y bebidas ilimitadas. Traslado desde el hotel incluido. Todos los días, salida a las 10:00.",
            fr: "Baleines et dauphins, avec un arrêt baignade à Diego Hernández et du temps pour profiter du soleil. À bord, un sandwich et des boissons à volonté. Transfert depuis l'hôtel compris. Tous les jours, départ à 10:00.",
            de: "Wale und Delfine, mit Badestopp bei Diego Hernández und Zeit zum Sonnen. An Bord ein Sandwich und unbegrenzt Getränke. Transfer vom Hotel inklusive. Täglich, Abfahrt um 10:00."
          }
        },
        {
          label: { it: "4 ore e mezza", en: "4.5 hours", es: "4,5 horas", fr: "4 heures et demie", de: "4,5 Stunden" },
          priceAdult: 62,
          priceChild: 31,
          included: ["lunch", "transfer"],
          transfer: {
            it: "Compreso, dalle zone del sud. Se preferisci raggiungerci, ti aspettiamo al porto: Puerto Colón, molo 10.",
            en: "Included, from the southern areas. If you'd rather come on your own, we'll be waiting for you at the harbour: Puerto Colón, dock 10.",
            es: "Incluido, desde las zonas del sur. Si prefieres venir por tu cuenta, te esperamos en el puerto: Puerto Colón, muelle 10.",
            fr: "Compris, depuis les zones du sud. Si vous préférez venir par vos propres moyens, nous vous attendons au port : Puerto Colón, quai 10.",
            de: "Inklusive, aus dem Süden der Insel. Wenn Sie lieber selbst kommen, erwarten wir Sie am Hafen: Puerto Colón, Steg 10."
          },
          times: ["13:00"],
          desc: {
            it: "Il giro lungo: balene e delfini, le scogliere di Los Gigantes e bagno nella baia di Masca. A bordo si pranza, con bevande illimitate. Transfer dall'hotel compreso. Tutti i giorni, partenza alle 13:00.",
            en: "The long trip: whales and dolphins, the cliffs of Los Gigantes and a swim in Masca bay. Lunch on board, with unlimited drinks. Hotel transfer included. Every day, leaving at 13:00.",
            es: "La salida larga: ballenas y delfines, los acantilados de Los Gigantes y baño en la bahía de Masca. Se come a bordo, con bebidas ilimitadas. Traslado desde el hotel incluido. Todos los días, salida a las 13:00.",
            fr: "La grande sortie : baleines et dauphins, les falaises de Los Gigantes et baignade dans la baie de Masca. Déjeuner à bord, avec boissons à volonté. Transfert depuis l'hôtel compris. Tous les jours, départ à 13:00.",
            de: "Die lange Tour: Wale und Delfine, die Klippen von Los Gigantes und Baden in der Bucht von Masca. Mittagessen an Bord, mit unbegrenzt Getränken. Transfer vom Hotel inklusive. Täglich, Abfahrt um 13:00."
          }
        },
        {
          label: {
            it: "4 ore e mezza, partenza dal nord",
            en: "4.5 hours, pickup in the north",
            es: "4,5 horas, salida desde el norte",
            fr: "4 heures et demie, départ du nord",
            de: "4,5 Stunden, Abholung im Norden"
          },
          priceAdult: 69,
          priceChild: 34,
          days: ["mar", "gio", "ven", "dom"],
          included: ["lunch", "transfer"],
          // la variante del nord e' fatta per la navetta: la si chiede lo stesso,
          // chi alloggia al nord e vuole andare al porto da solo puo' farlo
          transfer: {
            it: "Compreso, dalle zone del nord. Se preferisci raggiungerci, ti aspettiamo al porto: Puerto Colón, molo 10.",
            en: "Included, from the northern areas. If you'd rather come on your own, we'll be waiting for you at the harbour: Puerto Colón, dock 10.",
            es: "Incluido, desde las zonas del norte. Si prefieres venir por tu cuenta, te esperamos en el puerto: Puerto Colón, muelle 10.",
            fr: "Compris, depuis les zones du nord. Si vous préférez venir par vos propres moyens, nous vous attendons au port : Puerto Colón, quai 10.",
            de: "Inklusive, aus dem Norden der Insel. Wenn Sie lieber selbst kommen, erwarten wir Sie am Hafen: Puerto Colón, Steg 10."
          },
          times: ["13:00"],
          desc: {
            it: "Lo stesso giro lungo, Los Gigantes e Masca comprese, per chi alloggia nel nord dell'isola: la navetta ti prende e ti riporta a casa. La barca parte alle 13:00, la navetta passa prima. Martedì, giovedì, venerdì e domenica.",
            en: "The same long trip, for anyone staying in the north of the island: the shuttle picks you up and brings you back. The boat leaves at 13:00, the shuttle comes earlier. Tuesdays, Thursdays, Fridays and Sundays.",
            es: "La misma salida larga, para quien se aloja en el norte de la isla: la lanzadera te recoge y te devuelve. El barco sale a las 13:00, la lanzadera pasa antes. Martes, jueves, viernes y domingos.",
            fr: "La même grande sortie, Los Gigantes et Masca comprises, pour ceux qui logent dans le nord de l'île : la navette vous prend et vous ramène. Le bateau part à 13:00, la navette passe avant. Mardi, jeudi, vendredi et dimanche.",
            de: "Dieselbe lange Tour, mit Los Gigantes und Masca, für alle, die im Norden der Insel wohnen: Der Shuttle holt Sie ab und bringt Sie zurück. Das Boot legt um 13:00 ab, der Shuttle kommt früher. Dienstag, Donnerstag, Freitag und Sonntag."
          }
        }
      ]
    },
    included: ["swimstop", "drinks", "guide"],
    // Dove ci si presenta senza transfer: sul giro di 2 ore sempre, sugli
    // altri se il cliente non lo vuole (proprietario, 15 ottobre 2026).
    ritrovo: { it: "Puerto Colón, molo 10", en: "Puerto Colón, dock 10", es: "Puerto Colón, muelle 10", fr: "Puerto Colón, quai 10", de: "Puerto Colón, Steg 10" },
    notes: [
      {
        it: "Il transfer dall'hotel è compreso sul giro di 3 ore e su quello di 4 ore e mezza, dalle zone del sud. Sul giro di 2 ore non c'è: al porto ci si arriva da soli.",
        en: "The hotel transfer is included on the 3-hour and 4.5-hour trips, from the southern areas. It is not included on the 2-hour trip: you make your own way to the harbour.",
        es: "El traslado desde el hotel está incluido en la salida de 3 horas y en la de 4,5 horas, desde las zonas del sur. En la de 2 horas no: al puerto se llega por cuenta propia.",
        fr: "Le transfert depuis l'hôtel est compris sur la sortie de 3 heures et sur celle de 4 heures et demie, depuis les zones du sud. Il n'est pas compris sur la sortie de 2 heures : on se rend au port par ses propres moyens.",
        de: "Der Transfer vom Hotel ist bei der 3-Stunden- und der 4,5-Stunden-Tour inklusive, aus den Gebieten im Süden. Bei der 2-Stunden-Tour nicht: Zum Hafen kommt man selbst."
      },
      {
        it: "Puoi anche andare direttamente al porto: Puerto Colón, molo 10. Arriva almeno 10 minuti prima della partenza.",
        en: "You can also go straight to the harbour: Puerto Colón, dock 10. Get there at least 10 minutes before departure.",
        es: "También puedes ir directamente al puerto: Puerto Colón, muelle 10. Llega al menos 10 minutos antes de la salida.",
        fr: "Vous pouvez aussi aller directement au port : Puerto Colón, quai 10. Arrivez au moins 10 minutes avant le départ.",
        de: "Sie können auch direkt zum Hafen kommen: Puerto Colón, Steg 10. Seien Sie mindestens 10 Minuten vor der Abfahrt da."
      },
      {
        it: "Le bevande sono illimitate per tutto il giro: acqua, analcoliche, birra e sangria.",
        en: "Drinks are unlimited for the whole trip: water, soft drinks, beer and sangria.",
        es: "Las bebidas son ilimitadas durante toda la salida: agua, refrescos, cerveza y sangría.",
        fr: "Les boissons sont à volonté pendant toute la sortie : eau, sodas, bière et sangria.",
        de: "Die Getränke sind während der ganzen Tour unbegrenzt: Wasser, Softdrinks, Bier und Sangria."
      },
      {
        it: "Da mangiare ci sono dei panini, anche vegetariani se lo chiedi quando prenoti. Sul giro di 2 ore ci sono solo le bevande.",
        en: "There are sandwiches to eat, vegetarian ones too if you ask when you book. On the 2-hour trip there are drinks only.",
        es: "Para comer hay bocadillos, también vegetarianos si lo pides al reservar. En la salida de 2 horas solo hay bebidas.",
        fr: "Pour manger, il y a des sandwichs, végétariens aussi si vous le demandez en réservant. Sur la sortie de 2 heures, il n'y a que les boissons.",
        de: "Zu essen gibt es Sandwiches, auch vegetarisch, wenn Sie es bei der Buchung sagen. Bei der 2-Stunden-Tour gibt es nur Getränke."
      },
      {
        it: "Si possono aggiungere i lettini balinesi a €25 l'uno, fino a esaurimento.",
        en: "Balinese day beds can be added for €25 each, while they last.",
        es: "Se pueden añadir camas balinesas por 25 € cada una, hasta agotar existencias.",
        fr: "On peut ajouter des lits balinais à €25 chacun, dans la limite des disponibilités.",
        de: "Balinesische Liegen können für €25 pro Stück dazugebucht werden, solange der Vorrat reicht."
      },
      {
        it: "Se soffri il mal di mare, prendi le tue precauzioni prima di salire a bordo.",
        en: "If you get seasick, take your precautions before boarding.",
        es: "Si te mareas en el mar, toma tus precauciones antes de embarcar.",
        fr: "Si vous avez le mal de mer, prenez vos précautions avant de monter à bord.",
        de: "Wenn Sie leicht seekrank werden, treffen Sie Ihre Vorkehrungen vor dem Einsteigen."
      }
    ],
    family: true,
    desc: {
      it: "Un catamarano grande che parte da Puerto Colón, con tre giri fra cui scegliere: due ore, tre ore o quello lungo fino alle scogliere di Los Gigantes e alla baia di Masca. Balene e delfini, sosta bagno e bevande illimitate a bordo. L'equipaggio parla più lingue e racconta quello che si vede, e la barca segue le regole per avvicinare gli animali senza disturbarli.",
      en: "A big catamaran out of Puerto Colón, with three trips to choose from: two hours, three hours, or the long one out to the cliffs of Los Gigantes and Masca bay. Whales and dolphins, a swim stop and unlimited drinks on board. The crew speaks several languages and tells you what you are looking at, and the boat follows the rules for approaching the animals without disturbing them.",
      es: "Un catamarán grande que sale de Puerto Colón, con tres salidas a elegir: dos horas, tres horas o la larga hasta los acantilados de Los Gigantes y la bahía de Masca. Ballenas y delfines, parada de baño y bebidas ilimitadas a bordo. La tripulación habla varios idiomas y te cuenta lo que estás viendo, y el barco sigue las normas para acercarse a los animales sin molestarlos.",
      fr: "Un grand catamaran qui part de Puerto Colón, avec trois sorties au choix : deux heures, trois heures ou la grande jusqu'aux falaises de Los Gigantes et à la baie de Masca. Baleines et dauphins, arrêt baignade et boissons à volonté à bord. L'équipage parle plusieurs langues et raconte ce que l'on voit, et le bateau suit les règles pour approcher les animaux sans les déranger.",
      de: "Ein großer Katamaran ab Puerto Colón, mit drei Touren zur Wahl: zwei Stunden, drei Stunden oder die lange bis zu den Klippen von Los Gigantes und der Bucht von Masca. Wale und Delfine, Badestopp und unbegrenzt Getränke an Bord. Die Crew spricht mehrere Sprachen und erklärt, was man sieht, und das Boot hält sich an die Regeln, um sich den Tieren zu nähern, ohne sie zu stören."
    },
    image: "catamaran-gigantes-masca.webp",
    gallery: ["freebird-2.webp", "freebird-3.jpg", "freebird-4.webp"],
    published: true
  },
  {
    id: "royal-delfin",
    // Il nome della barca non sta nel titolo (proprietario, 28 ottobre 2026):
    // il cliente legge che giro e', nella sua lingua. Sta in `nomi`, per i
    // venditori e i ticket.
    title: { it: "Catamarano con vista sottomarina", en: "Underwater View Catamaran", es: "Catamarán con vista submarina", fr: "Catamaran à vision sous-marine", de: "Katamaran mit Unterwassersicht" },
    nomi: ["Royal Delfin"],
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "Da 2 a 4 ore e mezza", en: "2 to 4.5 hours", es: "De 2 a 4,5 horas", fr: "De 2 à 4 heures et demie", de: "2 bis 4,5 Stunden" },
    zoneGroups: ["costa-adeje", "teide-nord"],
    durationGroups: ["breve", "mezza"],
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
      label: { it: "Durata", en: "Duration", es: "Duración", fr: "Durée", de: "Dauer" },
      choices: [
        {
          label: { it: "2 ore", en: "2 hours", es: "2 horas", fr: "2 heures", de: "2 Stunden" },
          priceAdult: 33,
          priceChild: 20,
          days: ["mar", "gio", "dom"],
          times: ["10:30"],
          desc: {
            it: "Il giro corto, per vedere balene e delfini senza starci mezza giornata. Non c'è la sosta bagno e il pranzo non è compreso: a bordo c'è il bar, dove si paga. Martedì, giovedì e domenica, partenza alle 10:30.",
            en: "The short trip, to see whales and dolphins without giving up half a day. There is no swim stop and lunch is not included: there is a bar on board, where you pay. Tuesdays, Thursdays and Sundays, leaving at 10:30.",
            es: "La salida corta, para ver ballenas y delfines sin dedicarle media jornada. No hay parada de baño y la comida no está incluida: a bordo hay bar, donde se paga. Martes, jueves y domingos, salida a las 10:30.",
            fr: "La sortie courte, pour voir baleines et dauphins sans y passer une demi-journée. Il n'y a pas d'arrêt baignade et le déjeuner n'est pas compris : il y a un bar à bord, payant. Mardi, jeudi et dimanche, départ à 10:30.",
            de: "Die kurze Tour, um Wale und Delfine zu sehen, ohne einen halben Tag dafür zu brauchen. Es gibt keinen Badestopp und kein Mittagessen inklusive: An Bord gibt es eine Bar, wo man bezahlt. Dienstag, Donnerstag und Sonntag, Abfahrt um 10:30."
          }
        },
        {
          label: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
          priceAdult: 50,
          priceChild: 30,
          days: ["mer", "sab"],
          times: ["10:30"],
          included: ["swimstop", "lunch", "drinks"],
          desc: {
            it: "Balene e delfini, con sosta bagno e pranzo nella baia di Diego Hernández. Bevande illimitate a bordo. Mercoledì e sabato, partenza alle 10:30.",
            en: "Whales and dolphins, with a swim stop and lunch in Diego Hernández bay. Unlimited drinks on board. Wednesdays and Saturdays, leaving at 10:30.",
            es: "Ballenas y delfines, con parada de baño y comida en la bahía de Diego Hernández. Bebidas ilimitadas a bordo. Miércoles y sábados, salida a las 10:30.",
            fr: "Baleines et dauphins, avec arrêt baignade et déjeuner dans la baie de Diego Hernández. Boissons à volonté à bord. Mercredi et samedi, départ à 10:30.",
            de: "Wale und Delfine, mit Badestopp und Mittagessen in der Bucht von Diego Hernández. Unbegrenzt Getränke an Bord. Mittwoch und Samstag, Abfahrt um 10:30."
          }
        },
        {
          label: { it: "4 ore e mezza", en: "4.5 hours", es: "4,5 horas", fr: "4 heures et demie", de: "4,5 Stunden" },
          priceAdult: 63,
          priceChild: 40,
          times: ["14:00", "09:30"],
          included: ["swimstop", "lunch", "drinks"],
          desc: {
            it: "Il giro lungo: balene e delfini e bagno nella baia di Masca. Si comincia con la frutta di stagione e si pranza con riso e pollo, bevande comprese. Tutti i giorni alle 14:00; dall'11 luglio al 5 settembre c'è anche la partenza delle 9:30, con un menù diverso.",
            en: "The long trip: whales and dolphins, and a swim in Masca bay. It starts with seasonal fruit and lunch is rice and chicken, drinks included. Every day at 14:00; from 11 July to 5 September there is also a 9:30 departure, with a different menu.",
            es: "La salida larga: ballenas y delfines y baño en la bahía de Masca. Se empieza con fruta de temporada y se come arroz con pollo, bebidas incluidas. Todos los días a las 14:00; del 11 de julio al 5 de septiembre hay también la salida de las 9:30, con un menú distinto.",
            fr: "La grande sortie : baleines et dauphins et baignade dans la baie de Masca. On commence par des fruits de saison et on déjeune de riz et poulet, boissons comprises. Tous les jours à 14:00 ; du 11 juillet au 5 septembre, il y a aussi un départ à 9:30, avec un menu différent.",
            de: "Die lange Tour: Wale und Delfine und Baden in der Bucht von Masca. Zum Auftakt gibt es Obst der Saison, zu Mittag Reis mit Hähnchen, Getränke inklusive. Täglich um 14:00; vom 11. Juli bis 5. September gibt es auch eine Abfahrt um 9:30, mit anderem Menü."
          }
        },
        {
          label: {
            it: "4 ore e mezza, partenza dal nord",
            en: "4.5 hours, pickup in the north",
            es: "4,5 horas, salida desde el norte",
            fr: "4 heures et demie, départ du nord",
            de: "4,5 Stunden, Abholung im Norden"
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
            es: "La misma salida larga, con baño en Masca y comida a bordo, para quien se aloja en el norte: la lanzadera sale desde Puerto de la Cruz. Todos los días, el barco sale a las 14:00.",
            fr: "La même grande sortie, avec baignade à Masca et déjeuner à bord, pour ceux qui logent dans le nord : la navette part de Puerto de la Cruz. Tous les jours, le bateau part à 14:00.",
            de: "Dieselbe lange Tour, mit Baden in Masca und Mittagessen an Bord, für alle, die im Norden wohnen: Der Shuttle fährt ab Puerto de la Cruz. Täglich, das Boot legt um 14:00 ab."
          }
        }
      ]
    },
    included: ["guide", "transfer"],
    notes: [
      {
        it: "La presa e la riconsegna in hotel sono gratis dai principali alberghi del sud: Los Cristianos, Playa de las Américas, Costa Adeje e La Caleta. Dicci dove stai e ti confermiamo l'orario del passaggio.",
        en: "Hotel pick-up and drop-off are free from the main hotels in the south: Los Cristianos, Playa de las Américas, Costa Adeje and La Caleta. Tell us where you are staying and we'll confirm the pick-up time.",
        es: "La recogida y la vuelta al hotel son gratis desde los principales hoteles del sur: Los Cristianos, Playa de las Américas, Costa Adeje y La Caleta. Dinos dónde te alojas y te confirmamos la hora de recogida.",
        fr: "La prise en charge et le retour à l'hôtel sont gratuits depuis les principaux hôtels du sud : Los Cristianos, Playa de las Américas, Costa Adeje et La Caleta. Dites-nous où vous logez et nous vous confirmons l'heure de passage.",
        de: "Abholung und Rückfahrt zum Hotel sind kostenlos ab den wichtigsten Hotels im Süden: Los Cristianos, Playa de las Américas, Costa Adeje und La Caleta. Sagen Sie uns, wo Sie wohnen, und wir bestätigen die Abholzeit."
      },
      {
        it: "Se vieni con la tua macchina: Puerto Colón, pantalán 12. Arriva 20 minuti prima, la guida ti aspetta al cancello 12. Vicino al porto c'è un parcheggio pubblico a pagamento.",
        en: "If you come by car: Puerto Colón, pantalán 12. Get there 20 minutes early — the guide will meet you at gate 12. There is paid public parking near the harbour.",
        es: "Si vienes en coche: Puerto Colón, pantalán 12. Llega 20 minutos antes, el guía te espera en la puerta 12. Cerca del puerto hay aparcamiento público de pago.",
        fr: "Si vous venez en voiture : Puerto Colón, pantalán 12. Arrivez 20 minutes avant, le guide vous attend au portail 12. Près du port, il y a un parking public payant.",
        de: "Wenn Sie mit dem eigenen Auto kommen: Puerto Colón, pantalán 12. Seien Sie 20 Minuten früher da, der Guide wartet am Tor 12. In Hafennähe gibt es einen gebührenpflichtigen öffentlichen Parkplatz."
      },
      {
        it: "Sul giro di 3 ore e su quelli di 4 ore e mezza il pranzo è compreso, con opzioni senza glutine e vegetariane: chiedile quando prenoti e l'equipaggio le prepara.",
        en: "Lunch is included on the 3-hour and the 4.5-hour trips, with gluten-free and vegetarian options: ask for them when you book and the crew will prepare them.",
        es: "En la salida de 3 horas y en las de 4,5 horas la comida está incluida, con opciones sin gluten y vegetarianas: pídelas al reservar y la tripulación las prepara.",
        fr: "Sur la sortie de 3 heures et sur celles de 4 heures et demie, le déjeuner est compris, avec des options sans gluten et végétariennes : demandez-les en réservant et l'équipage les prépare.",
        de: "Bei der 3-Stunden-Tour und den 4,5-Stunden-Touren ist das Mittagessen inklusive, mit glutenfreien und vegetarischen Optionen: Fragen Sie bei der Buchung danach, und die Crew bereitet sie zu."
      },
      {
        it: "A bordo c'è il Wi-Fi gratuito, ma in mare la copertura può mancare.",
        en: "There is free Wi-Fi on board, but out at sea the signal can drop.",
        es: "A bordo hay Wi-Fi gratuito, pero en el mar la cobertura puede fallar.",
        fr: "Il y a le Wi-Fi gratuit à bord, mais en mer la couverture peut manquer.",
        de: "An Bord gibt es kostenloses WLAN, aber auf dem Meer kann der Empfang fehlen."
      },
      {
        it: "Il catamarano è per non fumatori ed è attrezzato per chi ha difficoltà motorie.",
        en: "The catamaran is non-smoking and equipped for guests with reduced mobility.",
        es: "El catamarán es para no fumadores y está equipado para personas con movilidad reducida.",
        fr: "Le catamaran est non-fumeur et équipé pour les personnes à mobilité réduite.",
        de: "Der Katamaran ist rauchfrei und für Menschen mit eingeschränkter Mobilität ausgestattet."
      },
      {
        it: "Porta costume e crema solare.",
        en: "Bring swimwear and sunscreen.",
        es: "Trae bañador y crema solar.",
        fr: "Apportez maillot de bain et crème solaire.",
        de: "Bringen Sie Badesachen und Sonnencreme mit."
      },
      {
        it: "Se soffri il mal di mare, prendi le tue precauzioni prima di salire a bordo.",
        en: "If you get seasick, take your precautions before boarding.",
        es: "Si te mareas en el mar, toma tus precauciones antes de embarcar.",
        fr: "Si vous avez le mal de mer, prenez vos précautions avant de monter à bord.",
        de: "Wenn Sie leicht seekrank werden, treffen Sie Ihre Vorkehrungen vor dem Einsteigen."
      }
    ],
    family: true,
    image: "royal-delfin.webp",
    gallery: ["royal-delfin-2.webp", "royal-delfin-3.webp", "royal-delfin-4.webp"],
    desc: {
      it: "Un catamarano grande, fino a 200 persone, con finestre panoramiche sotto la linea di galleggiamento: balene e delfini si guardano anche da sotto, non solo dal ponte. Si sceglie fra due ore, tre ore o il giro lungo fino alla baia di Masca. La barca segue la carta per la tutela dei cetacei e le guide parlano più lingue.",
      en: "A big catamaran, up to 200 people, with panoramic windows below the waterline: you watch whales and dolphins from underneath as well as from the deck. Choose between two hours, three hours or the long trip out to Masca bay. The boat follows the whale conservation charter and the guides speak several languages.",
      es: "Un catamarán grande, hasta 200 personas, con ventanas panorámicas bajo la línea de flotación: las ballenas y los delfines se ven también desde abajo, no solo desde cubierta. Se elige entre dos horas, tres horas o la salida larga hasta la bahía de Masca. El barco sigue la carta para la protección de los cetáceos y los guías hablan varios idiomas.",
      fr: "Un grand catamaran, jusqu'à 200 personnes, avec des hublots panoramiques sous la ligne de flottaison : baleines et dauphins se regardent aussi par en dessous, pas seulement depuis le pont. On choisit entre deux heures, trois heures ou la grande sortie jusqu'à la baie de Masca. Le bateau suit la charte de protection des cétacés et les guides parlent plusieurs langues.",
      de: "Ein großer Katamaran für bis zu 200 Personen, mit Panoramafenstern unter der Wasserlinie: Wale und Delfine sieht man auch von unten, nicht nur vom Deck. Zur Wahl stehen zwei Stunden, drei Stunden oder die lange Tour bis zur Bucht von Masca. Das Boot folgt der Charta zum Schutz der Wale, und die Guides sprechen mehrere Sprachen."
    },
    published: true
  },
  {
    id: "whale-dolphin-3h",
    title: { it: "Balene e delfini in barca a vela", en: "Whale & Dolphin Boat Trip", es: "Ballenas y delfines en velero", fr: "Baleines et dauphins en voilier", de: "Wale und Delfine im Segelboot" },
    // Il nome della compagnia, come i venditori lo scrivono sul ticket.
    // Solo qui e non sul charter qui sotto: un ticket "Cool Sailing" con
    // due adulti e' l'uscita a persona.
    // Lina7 e Mizendoha sono altre due barche, ognuna col suo netto
    // (proprietario, 9 ottobre 2026). Atlantic Star e' un'altra ancora
    // (proprietario, 14 ottobre 2026). Arriro e' una barca a vela, anche lei
    // solo sull'uscita a persona (proprietario, 14 ottobre 2026). Kasamui fa
    // anche il charter privato, ma il nome sta qui sola: lo stesso nome su
    // due schede e' un errore (proprietario, 21 ottobre 2026). Ocean Blue e'
    // un'altra barca delle 3 ore, sul ticket anche "Xixaron", e Nomada
    // un'altra ancora (proprietario, 29 ottobre 2026); Samba anche, ma col
    // charter a un netto suo: il suo nome sta sulla scheda del charter.
    nomi: ["Cool Sailing", "Lina7", "Mizendoha", "Atlantic Star", "Arriro", "Kasamui", "Ocean Blue", "Xixaron", "Nomada", "Nómada"],
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["mezza"],
    // Quattro partenze a tre ore l'una dall'altra. Le 18:00 ci sono solo
    // d'estate: sta in elenco come le altre e la nota qui sotto lo dice, come
    // gia' fatto per la partenza delle 9:30 di Royal Delfin.
    times: ["09:00", "12:00", "15:00", "18:00"],
    priceFrom: 55,
    privateOption: "whale-dolphin-3h-charter",
    priceAdult: 55,
    priceChild: 30,
    priceInfant: 0,
    ages: { adult: "12+", child: "3-11", infant: "0-2" },
    included: ["snorkel", "snack", "drinks", "swimstop"],
    notes: [
      {
        it: "Le partenze sono ogni tre ore. Quella delle 18:00 si fa solo d'estate.",
        en: "Departures are every three hours. The 18:00 one runs in summer only.",
        es: "Las salidas son cada tres horas. La de las 18:00 solo se hace en verano.",
        fr: "Les départs ont lieu toutes les trois heures. Celui de 18:00 ne se fait qu'en été.",
        de: "Abfahrten gibt es alle drei Stunden. Die um 18:00 fährt nur im Sommer."
      }
    ],
    family: true,
    desc: {
      it: "Tre ore in barca a vela da Puerto Colón, con un massimo di 11 persone a bordo. Avvistamento di balene e delfini, sosta per lo snorkeling con attrezzatura inclusa, snack e bevande a bordo.",
      en: "Three hours under sail from Puerto Colón, with a maximum of 11 guests on board. Whale and dolphin watching, a snorkelling stop with gear included, snacks and drinks on board.",
      es: "Tres horas en velero desde Puerto Colón, con un máximo de 11 personas a bordo. Avistamiento de ballenas y delfines, parada para hacer snorkel con equipo incluido, snacks y bebidas a bordo.",
      fr: "Trois heures à la voile depuis Puerto Colón, avec 11 passagers au maximum à bord. Observation des baleines et des dauphins, arrêt snorkeling avec matériel compris, en-cas et boissons à bord.",
      de: "Drei Stunden unter Segeln ab Puerto Colón, mit höchstens 11 Gästen an Bord. Wal- und Delfinbeobachtung, ein Schnorchelstopp mit Ausrüstung inklusive, Snacks und Getränke an Bord."
    },
    image: "whale-dolphin-3h.webp",
    gallery: ["whale-dolphin-3h-6.webp", "whale-dolphin-3h-7.webp", "whale-dolphin-3h-2.webp", "whale-dolphin-3h-3.webp", "whale-dolphin-3h-4.webp", "whale-dolphin-3h-5.webp", "whale-dolphin-3h-8.webp"],
    published: true
  },
  {
    // Maxicat (23 ottobre 2026): due catamarani, Maxicat 1 da 104 posti e
    // Maxicat 2 da 70, dal pantalán 9 di Puerto Colón. Non e' un doppione:
    // nessun'altra barca delle 3 ore ha il menu canario a bordo.
    id: "maxicat",
    // Il nome della barca non sta nel titolo (proprietario, 28 ottobre 2026):
    // il cliente legge che giro e', nella sua lingua. Sta in `nomi`, per i
    // venditori e i ticket.
    title: { it: "Balene e delfini con pranzo canario", en: "Whale Watching & Canarian Lunch", es: "Avistamiento de cetáceos con almuerzo canario", fr: "Baleines et dauphins avec déjeuner canarien", de: "Walbeobachtung mit kanarischem Mittagessen" },
    // Serve anche al menu della compagnia nel modulo dei venditori: il netto
    // di Maxicat e' per compagnia.
    nomi: ["Maxicat"],
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["mezza"],
    // Le tre partenze del fornitore. Il pulmino passa prima, a un'ora che
    // dipende dalla zona e che l'ufficio conferma.
    times: ["10:00", "13:15", "16:00"],
    // Prezzi e fasce dalla pagina di prenotazione del fornitore (23 ottobre
    // 2026). Non copiati: le tariffe per i residenti canari e il 42 € di un
    // giorno solo, che e' un'offerta loro.
    priceFrom: 46,
    priceAdult: 46,
    priceChild: 23,
    priceInfant: 0,
    ages: { adult: "12+", child: "6-11", infant: "0-5" },
    family: true,
    // Conta sempre come card (proprietario, 21 ottobre 2026): stesso elenco
    // in sempre_card.
    pagamento: "card",
    // Niente `snorkel`: la maschera il fornitore la mette fra le cose NON
    // incluse ("consigliamo di portare la tua"). Il bagno c'e'.
    included: ["lunch", "drinks", "swimstop", "guide"],
    menus: [
      { it: "Vegano / vegetariano", en: "Vegan / vegetarian", es: "Vegano / vegetariano", fr: "Végan / végétarien", de: "Vegan / vegetarisch" }
    ],
    // Il ritiro e' gratis ma e' una scelta: si puo' anche arrivare da soli al
    // pontile. Per questo la scheda sta in PICKUP_NESSUNO (hotel.js), con la
    // casella "Vuoi il transfer?" e il `ritrovo`. Niente `transferPrice`: il
    // transfer non cambia il prezzo.
    transfer: {
      it: "Gratis dalle zone di Callao Salvaje, Las Américas, Los Cristianos e Golf del Sur, fino al porto. L'ora e il punto di raccolta più vicino al tuo hotel te li diciamo quando confermiamo.",
      en: "Free from the Callao Salvaje, Las Américas, Los Cristianos and Golf del Sur areas, to the harbour. We tell you the time and the pick-up point closest to your hotel when we confirm.",
      es: "Gratis desde las zonas de Callao Salvaje, Las Américas, Los Cristianos y Golf del Sur, hasta el puerto. La hora y el punto de recogida más cercano a tu hotel te los decimos al confirmar.",
      fr: "Gratuit depuis les zones de Callao Salvaje, Las Américas, Los Cristianos et Golf del Sur, jusqu'au port. L'heure et le point de prise en charge le plus proche de votre hôtel, nous vous les donnons à la confirmation.",
      de: "Kostenlos aus den Gebieten Callao Salvaje, Las Américas, Los Cristianos und Golf del Sur bis zum Hafen. Uhrzeit und den Abholpunkt in der Nähe Ihres Hotels nennen wir Ihnen bei der Bestätigung."
    },
    ritrovo: { it: "Puerto Colón, pontile 9", en: "Puerto Colón, pontoon 9", es: "Puerto Colón, pantalán 9", fr: "Puerto Colón, ponton 9", de: "Puerto Colón, Steg 9" },
    notes: [
      {
        it: "Chi arriva da solo si presenta al pontile 9 di Puerto Colón 15 minuti prima della partenza.",
        en: "If you come on your own, be at pontoon 9 in Puerto Colón 15 minutes before departure.",
        es: "Si vienes por tu cuenta, preséntate en el pantalán 9 de Puerto Colón 15 minutos antes de la salida.",
        fr: "Si vous venez par vos propres moyens, présentez-vous au ponton 9 de Puerto Colón 15 minutes avant le départ.",
        de: "Wer selbst anreist, ist 15 Minuten vor der Abfahrt an Steg 9 in Puerto Colón."
      },
      {
        it: "Col transfer, il pulmino passa fra un'ora e mezza e dieci minuti prima della partenza, secondo la zona. Aspetta al punto di raccolta un quarto d'ora prima dell'ora che ti diamo: col traffico può cambiare.",
        en: "With the transfer, the minibus comes between an hour and a half and ten minutes before departure, depending on the area. Wait at the pick-up point a quarter of an hour before the time we give you: traffic can change it.",
        es: "Con el traslado, el microbús pasa entre una hora y media y diez minutos antes de la salida, según la zona. Espera en el punto de recogida un cuarto de hora antes de la hora que te damos: con el tráfico puede cambiar.",
        fr: "Avec le transfert, le minibus passe entre une heure et demie et dix minutes avant le départ, selon la zone. Attendez au point de prise en charge un quart d'heure avant l'heure indiquée : avec la circulation, elle peut varier.",
        de: "Mit Transfer kommt der Kleinbus je nach Gebiet zwischen anderthalb Stunden und zehn Minuten vor der Abfahrt. Warten Sie eine Viertelstunde vor der genannten Uhrzeit am Abholpunkt: Der Verkehr kann sie verschieben."
      },
      {
        it: "A bordo si mangia un riso alla canaria con i mojos, senza glutine e senza lattosio, e un dolce canario; per i bambini nuggets e patatine. Chi vuole il menu vegano o vegetariano lo dice nella richiesta.",
        en: "On board you eat Canarian-style rice with mojo sauces, gluten-free and lactose-free, and a Canarian dessert; for children, nuggets and chips. If you want the vegan or vegetarian menu, say so in your request.",
        es: "A bordo se come un arroz al estilo canario con mojos, sin gluten y sin lactosa, y un postre canario; para los niños, nuggets con papas fritas. Quien quiera el menú vegano o vegetariano lo indica en la solicitud.",
        fr: "À bord, on mange un riz à la canarienne avec des mojos, sans gluten et sans lactose, et un dessert canarien ; pour les enfants, nuggets et frites. Si vous voulez le menu végan ou végétarien, indiquez-le dans la demande.",
        de: "An Bord gibt es Reis nach kanarischer Art mit Mojo-Soßen, gluten- und laktosefrei, und ein kanarisches Dessert; für Kinder Nuggets mit Pommes. Wer das vegane oder vegetarische Menü möchte, gibt es in der Anfrage an."
      },
      {
        it: "La maschera da snorkeling non c'è: se vuoi guardare sott'acqua, porta la tua. I gelati si comprano a bordo.",
        en: "Snorkel masks are not provided: if you want to look underwater, bring your own. Ice creams can be bought on board.",
        es: "No hay gafas de snorkel: si quieres mirar bajo el agua, trae las tuyas. Los helados se compran a bordo.",
        fr: "Les masques de snorkeling ne sont pas fournis : si vous voulez regarder sous l'eau, apportez le vôtre. Les glaces s'achètent à bord.",
        de: "Schnorchelmasken gibt es nicht: Wer unter Wasser schauen will, bringt seine eigene mit. Eis kann man an Bord kaufen."
      },
      {
        it: "Porta crema solare, cappello, asciugamano e, fuori dall'estate, una felpa. Se soffri il mal di mare, prendi la pastiglia prima di salire.",
        en: "Bring sun cream, a hat, a towel and, outside summer, a jumper. If you get seasick, take a tablet before boarding.",
        es: "Trae crema solar, sombrero, toalla y, fuera del verano, una sudadera. Si te mareas, tómate la pastilla antes de subir.",
        fr: "Apportez crème solaire, chapeau, serviette et, hors saison d'été, un pull. Si vous avez le mal de mer, prenez un comprimé avant d'embarquer.",
        de: "Bringen Sie Sonnencreme, Hut, Handtuch und außerhalb des Sommers einen Pullover mit. Wer seekrank wird, nimmt die Tablette vor dem Einsteigen."
      }
    ],
    desc: {
      it: "Tre ore in catamarano da Puerto Colón, lungo la costa sud, dove i globicefali e i delfini vivono tutto l'anno. Dopo l'avvistamento si pranza a bordo alla canaria e ci si ferma a fare il bagno a Playa Diego Hernández, se il mare lo permette. I catamarani sono due, da 104 e da 70 posti, con zone d'ombra e spazio per stare comodi.",
      en: "Three hours by catamaran from Puerto Colón, along the south coast, where pilot whales and dolphins live all year round. After the watching you have a Canarian lunch on board and stop for a swim at Playa Diego Hernández, sea permitting. There are two catamarans, with 104 and 70 seats, shaded areas and room to relax.",
      es: "Tres horas en catamarán desde Puerto Colón, por la costa sur, donde los calderones y los delfines viven todo el año. Después del avistamiento se come a bordo al estilo canario y se para a darse un baño en Playa Diego Hernández, si el mar lo permite. Los catamaranes son dos, de 104 y de 70 plazas, con zonas de sombra y espacio para estar cómodos.",
      fr: "Trois heures en catamaran depuis Puerto Colón, le long de la côte sud, où globicéphales et dauphins vivent toute l'année. Après l'observation, on déjeune à bord à la canarienne et on s'arrête pour se baigner à Playa Diego Hernández, si la mer le permet. Il y a deux catamarans, de 104 et de 70 places, avec des zones d'ombre et de l'espace pour être à l'aise.",
      de: "Drei Stunden im Katamaran ab Puerto Colón entlang der Südküste, wo Grindwale und Delfine das ganze Jahr leben. Nach der Beobachtung gibt es an Bord ein kanarisches Mittagessen und einen Badestopp an der Playa Diego Hernández, wenn das Meer es zulässt. Es gibt zwei Katamarane mit 104 und 70 Plätzen, Schattenbereichen und Platz zum Entspannen."
    },
    image: "maxicat.webp",
    // Le altre due arrivano a 800 e 768 di larghezza: lasciate come sono,
    // senza ingrandirle, come luxury-catamaran.webp.
    gallery: ["maxicat-2.webp", "maxicat-3.webp"],
    published: true
  },
  {
    id: "peter-pan",
    // Il nome della barca non sta nel titolo (proprietario, 28 ottobre 2026):
    // il cliente legge che giro e', nella sua lingua. Sta in `nomi`, per i
    // venditori e i ticket.
    title: { it: "Nave pirata con i delfini", en: "Pirate Ship Dolphin Trip", es: "Barco pirata con delfines", fr: "Bateau pirate à la rencontre des dauphins", de: "Piratenschiff-Delfintour" },
    nomi: ["Peter Pan"],
    category: "mare-barche",
    zone: "Los Cristianos",
    duration: { it: "2 ore", en: "2 hours", es: "2 horas", fr: "2 heures", de: "2 Stunden" },
    zoneGroups: ["los-cristianos"],
    durationGroups: ["breve"],
    // Tre partenze tutti i giorni: nessun campo `days`, non c'e' limite da dire.
    times: ["10:00", "12:00", "14:00"],
    priceFrom: 27,
    priceAdult: 27,
    priceChild: 13,
    priceInfant: 0,
    ages: { adult: "12+", child: "3-11", infant: "0-2" },
    family: true,
    // Il ticket conta sempre come pagato con carta (proprietario, 13 ottobre
    // 2026): stessa regola dei parchi, e stesso elenco in sempre_card.
    pagamento: "card",
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
      es: "La recogida en los hoteles del sur es gratis, pero solo para la salida de las 12:00.",
      fr: "La prise en charge depuis les hôtels du sud est gratuite, mais seulement pour le départ de 12:00.",
      de: "Die Abholung von den Hotels im Süden ist kostenlos, aber nur für die Abfahrt um 12:00."
    },
    desc: {
      it: "Una goletta portoghese in legno, a due alberi, che parte da Los Cristianos: due ore al largo per vedere delfini e globicefali. A bordo ci sono l'ombra, un ponte superiore per stare al sole e i bagni.",
      en: "A wooden two-masted Portuguese schooner leaving from Los Cristianos: two hours offshore to see dolphins and pilot whales. On board there is shade, an upper deck for sunbathing and toilets.",
      es: "Una goleta portuguesa de madera, de dos palos, que sale de Los Cristianos: dos horas mar adentro para ver delfines y calderones. A bordo hay sombra, una cubierta superior para tomar el sol y aseos.",
      fr: "Une goélette portugaise en bois à deux mâts qui part de Los Cristianos : deux heures au large pour voir dauphins et globicéphales. À bord, il y a de l'ombre, un pont supérieur pour bronzer et des toilettes.",
      de: "Ein portugiesischer Zweimastschoner aus Holz ab Los Cristianos: zwei Stunden auf dem offenen Meer, um Delfine und Grindwale zu sehen. An Bord gibt es Schatten, ein Oberdeck zum Sonnen und Toiletten."
    },
    notes: [
      {
        it: "Si parte dal porto di Los Cristianos. Arriva almeno 30 minuti prima dell'orario, così l'imbarco si fa con calma.",
        en: "You leave from Los Cristianos harbour. Get there at least 30 minutes before your departure time so boarding is unhurried.",
        es: "Se sale del puerto de Los Cristianos. Llega al menos 30 minutos antes de la hora para embarcar con calma.",
        fr: "On part du port de Los Cristianos. Arrivez au moins 30 minutes avant l'heure de départ, pour embarquer sans vous presser.",
        de: "Abfahrt ist im Hafen von Los Cristianos. Seien Sie mindestens 30 Minuten vor Ihrer Abfahrtszeit da, damit das Einsteigen in Ruhe geht."
      },
      {
        it: "Da mangiare e da bere non sono compresi, ma si comprano a bordo.",
        en: "Food and drinks are not included, but you can buy them on board.",
        es: "La comida y las bebidas no están incluidas, pero se compran a bordo.",
        fr: "Nourriture et boissons ne sont pas comprises, mais on peut les acheter à bord.",
        de: "Essen und Getränke sind nicht inklusive, man kann sie aber an Bord kaufen."
      },
      {
        it: "A bordo si sta fino a 60 persone: c'è una zona all'ombra con un tavolone, il ponte superiore per il sole e due bagni.",
        en: "The ship takes up to 60 people: there is a shaded area with a big table, the upper deck for the sun and two toilets.",
        es: "A bordo caben hasta 60 personas: hay una zona a la sombra con una mesa grande, la cubierta superior para el sol y dos aseos.",
        fr: "Le bateau accueille jusqu'à 60 personnes : il y a un espace ombragé avec une grande table, le pont supérieur pour le soleil et deux toilettes.",
        de: "Das Schiff fasst bis zu 60 Personen: Es gibt einen schattigen Bereich mit einem großen Tisch, das Oberdeck für die Sonne und zwei Toiletten."
      }
    ],
    image: "peter-pan.webp",
    gallery: ["peter-pan-2.webp", "peter-pan-3.webp"],
    published: true
  },
  {
    id: "flipper-one",
    // Il nome della barca non sta nel titolo (proprietario, 28 ottobre 2026):
    // il cliente legge che giro e', nella sua lingua. Sta in `nomi`, per i
    // venditori e i ticket.
    title: { it: "Veliero di legno da Los Gigantes", en: "Wooden Schooner from Los Gigantes", es: "Goleta de madera desde Los Gigantes", fr: "Goélette en bois depuis Los Gigantes", de: "Holzschoner ab Los Gigantes" },
    nomi: ["Flipper One"],
    category: "mare-barche",
    // L'unica scheda che parte da Los Gigantes: tutte le altre barche sono a
    // Puerto Colon, Los Cristianos o Marina Amarilla.
    zone: "Los Gigantes",
    duration: { it: "2 o 3 ore", en: "2 or 3 hours", es: "2 o 3 horas", fr: "2 ou 3 heures", de: "2 oder 3 Stunden" },
    zoneGroups: ["los-gigantes"],
    durationGroups: ["breve", "mezza"],
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
      label: { it: "Durata", en: "Duration", es: "Duración", fr: "Durée", de: "Dauer" },
      choices: [
        {
          label: { it: "2 ore", en: "2 hours", es: "2 horas", fr: "2 heures", de: "2 Stunden" },
          priceAdult: 33,
          priceChild: 23,
          times: ["17:30"],
          desc: {
            it: "Il giro corto, per vedere balene e delfini senza starci mezza giornata. Non c'è la sosta bagno e non si mangia, ma le bevande sono comprese. Partenza alle 17:30.",
            en: "The short trip, to see whales and dolphins without giving up half a day. There is no swim stop and no meal, but drinks are included. Leaving at 17:30.",
            es: "La salida corta, para ver ballenas y delfines sin dedicarle media jornada. No hay parada de baño ni comida, pero las bebidas están incluidas. Salida a las 17:30.",
            fr: "La sortie courte, pour voir baleines et dauphins sans y passer une demi-journée. Il n'y a ni arrêt baignade ni repas, mais les boissons sont comprises. Départ à 17:30.",
            de: "Die kurze Tour, um Wale und Delfine zu sehen, ohne einen halben Tag dafür zu brauchen. Es gibt keinen Badestopp und kein Essen, aber Getränke sind inklusive. Abfahrt um 17:30."
          }
        },
        {
          label: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
          priceAdult: 40,
          priceChild: 25,
          times: ["11:30"],
          included: ["swimstop", "lunch"],
          desc: {
            it: "Balene e delfini, poi le scogliere di Masca e Los Gigantes e la sosta bagno nella baia di Diego Hernández, dove c'è anche una teleferica per tuffarsi. Pranzo con paella di pollo e frutta, bevande comprese. Partenza alle 11:30.",
            en: "Whales and dolphins, then the cliffs of Masca and Los Gigantes and a swim stop in Diego Hernández bay, where there is also a zip line to dive from. Lunch of chicken paella and fruit, drinks included. Leaving at 11:30.",
            es: "Ballenas y delfines, luego los acantilados de Masca y Los Gigantes y la parada de baño en la bahía de Diego Hernández, donde hay también una tirolina para tirarse al agua. Comida de paella de pollo y fruta, bebidas incluidas. Salida a las 11:30.",
            fr: "Baleines et dauphins, puis les falaises de Masca et de Los Gigantes et un arrêt baignade dans la baie de Diego Hernández, où il y a aussi une tyrolienne d'où plonger. Déjeuner de paella au poulet et fruits, boissons comprises. Départ à 11:30.",
            de: "Wale und Delfine, dann die Klippen von Masca und Los Gigantes und ein Badestopp in der Bucht von Diego Hernández, wo es auch eine Seilrutsche zum Reinspringen gibt. Mittagessen mit Hähnchen-Paella und Obst, Getränke inklusive. Abfahrt um 11:30."
          }
        },
        {
          label: { it: "3 ore con navetta", en: "3 hours with shuttle", es: "3 horas con lanzadera", fr: "3 heures avec navette", de: "3 Stunden mit Shuttle" },
          priceAdult: 44,
          priceChild: 29,
          times: ["11:30"],
          included: ["swimstop", "lunch", "transfer"],
          desc: {
            it: "Lo stesso giro di tre ore, con il passaggio per andare e tornare dal porto: utile perché Los Gigantes è lontano dagli alberghi del sud. Partenza alle 11:30.",
            en: "The same three-hour trip, with a ride to and from the harbour: useful because Los Gigantes is a long way from the southern hotels. Leaving at 11:30.",
            es: "La misma salida de tres horas, con el traslado de ida y vuelta al puerto: útil porque Los Gigantes queda lejos de los hoteles del sur. Salida a las 11:30.",
            fr: "La même sortie de trois heures, avec l'aller-retour jusqu'au port : utile, car Los Gigantes est loin des hôtels du sud. Départ à 11:30.",
            de: "Dieselbe Drei-Stunden-Tour, mit Hin- und Rückfahrt zum Hafen: praktisch, denn Los Gigantes liegt weit von den Hotels im Süden. Abfahrt um 11:30."
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
      es: "Una goleta de madera construida a mano en Tenerife, la primera de este tamaño: cuatro hermanos carpinteros de Alcalá tardaron dieciocho meses, mascarón de delfín incluido. Sale de Los Gigantes a buscar ballenas y delfines bajo los acantilados.",
      fr: "Une goélette en bois construite à la main à Tenerife, la première de cette taille : il a fallu dix-huit mois à quatre frères charpentiers d'Alcalá, figure de proue en dauphin comprise. Elle part de Los Gigantes à la recherche des baleines et des dauphins au pied des falaises.",
      de: "Ein Holzschoner, auf Teneriffa von Hand gebaut, der erste in dieser Größe: Vier Zimmermannsbrüder aus Alcalá haben achtzehn Monate daran gearbeitet, die Delfin-Galionsfigur inklusive. Er fährt ab Los Gigantes, um unter den Klippen nach Walen und Delfinen zu suchen."
    },
    notes: [
      {
        it: "Si parte dal porto di Los Gigantes, dove c'è il parcheggio. Arriva 10 minuti prima della partenza.",
        en: "You leave from Los Gigantes harbour, where there is parking. Get there 10 minutes before departure.",
        es: "Se sale del puerto de Los Gigantes, donde hay aparcamiento. Llega 10 minutos antes de la salida.",
        fr: "On part du port de Los Gigantes, où il y a un parking. Arrivez 10 minutes avant le départ.",
        de: "Abfahrt ist im Hafen von Los Gigantes, wo es Parkplätze gibt. Seien Sie 10 Minuten vor der Abfahrt da."
      },
      {
        it: "Si va quasi tutti i giorni, ma non proprio tutti: quando mandi la richiesta ti confermiamo se quel giorno si parte.",
        en: "It runs almost every day, but not quite every day: when you send your request we will confirm whether it sails that day.",
        es: "Se hace casi todos los días, pero no todos: cuando mandes la solicitud te confirmamos si ese día sale.",
        fr: "Elle sort presque tous les jours, mais pas vraiment tous : quand vous envoyez la demande, nous vous confirmons si elle part ce jour-là.",
        de: "Er fährt fast jeden Tag, aber nicht ganz jeden: Wenn Sie die Anfrage schicken, bestätigen wir Ihnen, ob er an dem Tag ausläuft."
      },
      {
        it: "A bordo si sta fino a 91 persone, e c'è una guida che racconta cosa si sta vedendo.",
        en: "The boat takes up to 91 people, and there is a guide who explains what you are looking at.",
        es: "A bordo caben hasta 91 personas, y hay un guía que cuenta lo que se está viendo.",
        fr: "Le bateau accueille jusqu'à 91 personnes, et un guide explique ce que l'on voit.",
        de: "Das Boot fasst bis zu 91 Personen, und ein Guide erklärt, was man sieht."
      },
      {
        it: "Sul giro di tre ore portati costume e crema solare: la sosta bagno è la parte migliore.",
        en: "On the three-hour trip bring swimwear and sun cream: the swim stop is the best part.",
        es: "En la salida de tres horas lleva bañador y crema solar: la parada de baño es lo mejor.",
        fr: "Pour la sortie de trois heures, apportez maillot de bain et crème solaire : l'arrêt baignade est le meilleur moment.",
        de: "Bringen Sie für die Drei-Stunden-Tour Badesachen und Sonnencreme mit: Der Badestopp ist das Beste daran."
      }
    ],
    image: "flipper-one.webp",
    gallery: ["flipper-one-2.webp", "flipper-one-3.webp", "flipper-one-4.webp"],
    // dove ci si presenta: era gia' scritto nei consigli (15 ottobre 2026)
    ritrovo: "Puerto de Los Gigantes",
    published: true
  },
  {
    id: "submarine-safari",
    title: { it: "Safari in sottomarino", en: "Submarine Safari", es: "Safari en submarino", fr: "Safari en sous-marin", de: "U-Boot-Safari" },
    category: "mare-barche",
    // Il ticket conta sempre come pagato con carta, come i parchi
    // (proprietario, 20 ottobre 2026): stesso elenco in sempre_card.
    pagamento: "card",
    zone: "Marina Amarilla",
    duration: { it: "1 ora", en: "1 hour", es: "1 hora", fr: "1 heure", de: "1 Stunde" },
    zoneGroups: ["los-cristianos"],
    durationGroups: ["breve"],
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
    // Due caselle, una per zona (proprietario, 19 ottobre 2026): la navetta dal
    // sud e' compresa, quella dal nord costa in piu'. Prima la casella era una
    // sola col prezzo del nord, e chi stava al sud la spuntava e vedeva 74 €
    // invece di 61. Dal sud: niente `transferPrice`, il prezzo non cambia. Dal
    // nord: `transferSiamPrice`, i prezzi **completi** (61 + 13 e 37 + 8).
    transfer: {
      it: "Compreso nel prezzo.",
      en: "Included in the price.",
      es: "Incluido en el precio.",
      fr: "Compris dans le prix.",
      de: "Im Preis inbegriffen."
    },
    transferLabel: {
      it: "Transfer dal sud",
      en: "Transfer from the south",
      es: "Traslado desde el sur",
      fr: "Transfert depuis le sud",
      de: "Transfer aus dem Süden"
    },
    transferSiam: {
      it: "€13 in più a adulto e €8 a bambino.",
      en: "€13 extra per adult and €8 per child.",
      es: "13 € más por adulto y 8 € por niño.",
      fr: "€13 de plus par adulte et €8 par enfant.",
      de: "€13 mehr pro Erwachsenem und €8 pro Kind."
    },
    transferSiamLabel: {
      it: "Transfer dal nord",
      en: "Transfer from the north",
      es: "Traslado desde el norte",
      fr: "Transfert depuis le nord",
      de: "Transfer aus dem Norden"
    },
    transferSiamPrice: { adult: 74, child: 45 },
    // I prezzi del nord servono al **totale**, non da leggere: il supplemento
    // e' gia' scritto per esteso nella riga `transferSiam`, e stamparlo una
    // seconda volta era proprio la confusione che l'ufficio aveva segnalato.
    transferSiamPriceHidden: true,
    included: ["transfer", "guide"],
    notes: [
      {
        it: "Si scende tutti i giorni tranne il sabato.",
        en: "It runs every day except Saturday.",
        es: "Se hace todos los días excepto el sábado.",
        fr: "Il fonctionne tous les jours sauf le samedi.",
        de: "Es fährt täglich außer samstags."
      },
      {
        it: "Si parte dal porto di Marina Amarilla, a San Miguel de Abona, zona Amarilla Golf. Arriva almeno 15 minuti prima.",
        en: "You leave from Marina Amarilla harbour, in San Miguel de Abona, the Amarilla Golf area. Get there at least 15 minutes early.",
        es: "Se sale del puerto de Marina Amarilla, en San Miguel de Abona, zona Amarilla Golf. Llega al menos 15 minutos antes.",
        fr: "On part du port de Marina Amarilla, à San Miguel de Abona, dans la zone d'Amarilla Golf. Arrivez au moins 15 minutes en avance.",
        de: "Abfahrt ist im Hafen von Marina Amarilla, in San Miguel de Abona, im Gebiet von Amarilla Golf. Seien Sie mindestens 15 Minuten früher da."
      },
      {
        it: "Si sale dai 2 anni in su, e sotto i 16 bisogna essere accompagnati da un adulto.",
        en: "Children can board from age 2, and under-16s must be with an adult.",
        es: "Se puede subir a partir de los 2 años, y los menores de 16 deben ir acompañados por un adulto.",
        fr: "Les enfants peuvent monter dès 2 ans, et les moins de 16 ans doivent être accompagnés d'un adulte.",
        de: "Kinder dürfen ab 2 Jahren mit, und unter 16-Jährige müssen von einem Erwachsenen begleitet werden."
      },
      {
        it: "Prima di salire si fa una spiegazione sulla sicurezza, poi si prende posto.",
        en: "Before boarding there is a safety briefing, then you take your seat.",
        es: "Antes de embarcar se hace una explicación de seguridad y luego se toma asiento.",
        fr: "Avant d'embarquer, il y a un briefing de sécurité, puis on prend place.",
        de: "Vor dem Einsteigen gibt es eine Sicherheitseinweisung, dann nimmt man Platz."
      },
      {
        it: "Se soffri il mal di mare, prendi le tue precauzioni prima di salire a bordo.",
        en: "If you get seasick, take your precautions before boarding.",
        es: "Si te mareas en el mar, toma tus precauciones antes de embarcar.",
        fr: "Si vous avez le mal de mer, prenez vos précautions avant de monter à bord.",
        de: "Wenn Sie leicht seekrank werden, treffen Sie Ihre Vorkehrungen vor dem Einsteigen."
      }
    ],
    family: true,
    desc: {
      it: "Il sottomarino giallo scende fra i 30 e i 60 metri, e si guarda il fondale restando all'asciutto. Ogni posto ha il suo oblò e uno schermo che dice a che profondità si è e che temperatura fa fuori. Sotto passano pesci e razze, e ogni tanto anche i delfini. Dura circa un'ora.",
      en: "The yellow submarine goes down between 30 and 60 metres, and you watch the seabed while staying dry. Every seat has its own porthole and a screen telling you how deep you are and the temperature outside. Fish and stingrays go past, and now and then dolphins too. It lasts about an hour.",
      es: "El submarino amarillo baja entre 30 y 60 metros, y se mira el fondo sin mojarse. Cada asiento tiene su ojo de buey y una pantalla que dice a qué profundidad estás y qué temperatura hace fuera. Abajo pasan peces y rayas, y de vez en cuando también delfines. Dura alrededor de una hora.",
      fr: "Le sous-marin jaune descend entre 30 et 60 mètres, et on regarde les fonds marins en restant au sec. Chaque siège a son hublot et un écran qui indique la profondeur et la température extérieure. Poissons et raies passent devant, et parfois aussi des dauphins. Cela dure environ une heure.",
      de: "Das gelbe U-Boot taucht zwischen 30 und 60 Meter tief, und man sieht den Meeresgrund, ohne nass zu werden. Jeder Sitz hat sein eigenes Bullauge und einen Bildschirm, der die Tiefe und die Wassertemperatur anzeigt. Fische und Rochen ziehen vorbei, und ab und zu auch Delfine. Es dauert etwa eine Stunde."
    },
    image: "submarine-safari.webp",
    gallery: ["submarine-safari-2.webp", "submarine-safari-3.webp"],
    published: true
  },
  {
    id: "pesca-altura",
    // La compagnia come i venditori la scrivono sul ticket (proprietario, 29
    // ottobre 2026; fogli del 19-25 ottobre, "BLACK & BLUE").
    nomi: ["Black & Blue", "Black and Blue"],
    title: { it: "Pesca d'altura", en: "Deep sea fishing", es: "Pesca de altura", fr: "Pêche en haute mer", de: "Hochseeangeln" },
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "4 ore", en: "4 hours", es: "4 horas", fr: "4 heures", de: "4 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["mezza"],
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
      label: { it: "Formula", en: "Option", es: "Fórmula", fr: "Option", de: "Option" },
      choices: [
        {
          label: { it: "4 ore, in condivisione", en: "4 hours, shared", es: "4 horas, compartido", fr: "4 heures, partagée", de: "4 Stunden, geteilt" },
          priceAdult: 85,
          priceChild: 69,
          duration: { it: "4 ore", en: "4 hours", es: "4 horas", fr: "4 heures", de: "4 Stunden" },
          desc: {
            it: "Si esce insieme ad altri, fino a 10 persone in tutto, e ognuno che vuole pescare ha la sua canna. Quattro ore al largo, partenza alle 9:00 o alle 14:00.",
            en: "You go out with others, up to 10 people in all, and everyone who wants to fish gets their own rod. Four hours offshore, leaving at 9:00 or 14:00.",
            es: "Se sale junto a otras personas, hasta 10 en total, y cada uno que quiera pescar tiene su caña. Cuatro horas mar adentro, salida a las 9:00 o a las 14:00.",
            fr: "Vous sortez avec d'autres personnes, 10 au maximum en tout, et chacun de ceux qui veulent pêcher a sa propre canne. Quatre heures au large, départ à 9:00 ou à 14:00.",
            de: "Sie fahren mit anderen hinaus, insgesamt höchstens 10 Personen, und jeder, der angeln will, bekommt seine eigene Rute. Vier Stunden auf dem offenen Meer, Abfahrt um 9:00 oder 14:00."
          }
        },
        {
          label: { it: "Charter privato, fino a 7", en: "Private charter, up to 7", es: "Chárter privado, hasta 7", fr: "Charter privé, jusqu'à 7", de: "Privatcharter, bis 7" },
          price: 525,
          duration: { it: "Da 4 ore", en: "From 4 hours", es: "Desde 4 horas", fr: "À partir de 4 heures", de: "Ab 4 Stunden" },
          desc: {
            it: "La barca solo per il tuo gruppo, fino a 7 persone: da €525. Da sei ore in su sono compresi anche panini e stuzzichini. Il prezzo è della barca intera, non a persona.",
            en: "The boat just for your group, up to 7 people: from €525. From six hours upwards sandwiches and snacks are included too. The price is for the whole boat, not per person.",
            es: "El barco solo para tu grupo, hasta 7 personas: desde 525 €. A partir de seis horas se incluyen también bocadillos y aperitivos. El precio es del barco entero, no por persona.",
            fr: "Le bateau rien que pour votre groupe, jusqu'à 7 personnes : à partir de €525. À partir de six heures, sandwichs et en-cas sont compris aussi. Le prix est pour tout le bateau, pas par personne.",
            de: "Das Boot nur für Ihre Gruppe, bis zu 7 Personen: ab €525. Ab sechs Stunden sind auch Sandwiches und Snacks inklusive. Der Preis gilt für das ganze Boot, nicht pro Person."
          }
        },
        {
          label: { it: "Charter privato, fino a 10", en: "Private charter, up to 10", es: "Chárter privado, hasta 10", fr: "Charter privé, jusqu'à 10", de: "Privatcharter, bis 10" },
          price: 700,
          duration: { it: "Da 4 ore", en: "From 4 hours", es: "Desde 4 horas", fr: "À partir de 4 heures", de: "Ab 4 Stunden" },
          desc: {
            it: "Come sopra ma con più posto: fino a 10 persone, da €700. Da sei ore in su sono compresi anche panini e stuzzichini. Il prezzo è della barca intera, non a persona.",
            en: "As above but with more room: up to 10 people, from €700. From six hours upwards sandwiches and snacks are included too. The price is for the whole boat, not per person.",
            es: "Como arriba pero con más sitio: hasta 10 personas, desde 700 €. A partir de seis horas se incluyen también bocadillos y aperitivos. El precio es del barco entero, no por persona.",
            fr: "Comme ci-dessus mais avec plus de place : jusqu'à 10 personnes, à partir de €700. À partir de six heures, sandwichs et en-cas sont compris aussi. Le prix est pour tout le bateau, pas par personne.",
            de: "Wie oben, aber mit mehr Platz: bis zu 10 Personen, ab €700. Ab sechs Stunden sind auch Sandwiches und Snacks inklusive. Der Preis gilt für das ganze Boot, nicht pro Person."
          }
        }
      ]
    },
    included: ["equipment", "drinks", "guide"],
    notes: [
      {
        it: "Il pesce preso non si può portare a casa: si pesca e si rimette in mare, oppure resta alla barca.",
        en: "You cannot take your catch home: you fish and release, or the catch stays with the boat.",
        es: "El pescado que se captura no se puede llevar a casa: se pesca y se devuelve al mar, o se queda en el barco.",
        fr: "On ne peut pas emporter le poisson pêché : on pêche et on relâche, ou la prise reste au bateau.",
        de: "Den Fang darf man nicht mit nach Hause nehmen: Man angelt und lässt ihn frei, oder der Fang bleibt beim Boot."
      },
      {
        it: "Chi viene solo a guardare paga €69, anche da adulto: a bordo ci sono i lettini e una zona d'ombra per chi non pesca. Dillo nelle note della richiesta.",
        en: "Anyone coming just to watch pays €69, adults included: there are sunbeds and a shaded area on board for those not fishing. Say so in the notes of your request.",
        es: "Quien viene solo a mirar paga 69 €, también los adultos: a bordo hay tumbonas y una zona de sombra para quien no pesca. Dilo en las notas de la solicitud.",
        fr: "Ceux qui viennent seulement pour regarder paient €69, adultes compris : à bord, il y a des transats et un espace à l'ombre pour ceux qui ne pêchent pas. Indiquez-le dans les notes de la demande.",
        de: "Wer nur zum Zuschauen mitkommt, zahlt €69, auch Erwachsene: An Bord gibt es Liegen und einen Schattenbereich für alle, die nicht angeln. Schreiben Sie es in die Notizen der Anfrage."
      },
      {
        it: "I bambini dagli 8 ai 10 anni che pescano pagano €69. Per i più piccoli chiedici: dipende dall'uscita.",
        en: "Children aged 8 to 10 who fish pay €69. For younger ones ask us: it depends on the trip.",
        es: "Los niños de 8 a 10 años que pescan pagan 69 €. Para los más pequeños pregúntanos: depende de la salida.",
        fr: "Les enfants de 8 à 10 ans qui pêchent paient €69. Pour les plus petits, demandez-nous : cela dépend de la sortie.",
        de: "Kinder von 8 bis 10 Jahren, die angeln, zahlen €69. Für Jüngere fragen Sie uns: Es hängt von der Fahrt ab."
      },
      {
        it: "Le canne ci sono per tutti quelli che pescano, e l'attrezzatura la mette la barca: esche e terminali compresi. Si va di traina e di jigging, secondo la stagione.",
        en: "There are rods for everyone who fishes, and the boat provides the tackle: bait and rigs included. You troll and jig, depending on the season.",
        es: "Hay cañas para todos los que pescan, y el barco pone el equipo: cebos y aparejos incluidos. Se va al curricán y al jigging, según la temporada.",
        fr: "Il y a des cannes pour tous ceux qui pêchent, et le bateau fournit le matériel : appâts et montages compris. On pêche à la traîne et au jig, selon la saison.",
        de: "Es gibt Ruten für alle, die angeln, und das Boot stellt das Zubehör: Köder und Montagen inklusive. Je nach Saison wird geschleppt oder gejiggt."
      },
      {
        it: "A bordo c'è la toilette e un frigo con le bevande fredde, che si prendono da soli.",
        en: "There is a toilet on board and a fridge with cold drinks, which you help yourself to.",
        es: "A bordo hay aseo y una nevera con bebidas frías, que se cogen uno mismo.",
        fr: "Il y a des toilettes à bord et un frigo avec des boissons fraîches, en libre-service.",
        de: "An Bord gibt es eine Toilette und einen Kühlschrank mit kalten Getränken zur Selbstbedienung."
      },
      {
        it: "Si parte da Puerto Colón: arriva almeno 10 minuti prima. Al porto c'è parcheggio.",
        en: "You leave from Puerto Colón: get there at least 10 minutes early. There is parking at the marina.",
        es: "Se sale de Puerto Colón: llega al menos 10 minutos antes. En el puerto hay aparcamiento.",
        fr: "On part de Puerto Colón : arrivez au moins 10 minutes en avance. Il y a un parking à la marina.",
        de: "Abfahrt ist in Puerto Colón: Seien Sie mindestens 10 Minuten früher da. Am Jachthafen gibt es Parkplätze."
      }
    ],
    family: true,
    desc: {
      it: "Quattro ore a pesca al largo di Puerto Colón, a bordo della No Limits. Si cercano tonni, marlin e lampughe, e la canna ce l'ha chiunque voglia provare, anche chi non ha mai pescato: l'equipaggio lavora in queste acque da più di vent'anni. Chi non pesca ha i lettini e la zona d'ombra. Si sceglie fra l'uscita in condivisione e la barca tutta per sé.",
      en: "Four hours fishing offshore from Puerto Colón, aboard the No Limits. You go after tuna, marlin and dorado, and anyone who wants to try gets a rod, first-timers included: the crew has been working these waters for over twenty years. Those not fishing have sunbeds and a shaded area. Choose between the shared trip and having the boat to yourselves.",
      es: "Cuatro horas de pesca mar adentro desde Puerto Colón, a bordo del No Limits. Se buscan atunes, marlines y dorados, y tiene caña cualquiera que quiera probar, también quien no ha pescado nunca: la tripulación lleva más de veinte años en estas aguas. Quien no pesca tiene tumbonas y zona de sombra. Se elige entre la salida compartida y el barco entero para ti.",
      fr: "Quatre heures de pêche au large de Puerto Colón, à bord du No Limits. On cherche le thon, le marlin et la dorade coryphène, et quiconque veut essayer a une canne, débutants compris : l'équipage connaît ces eaux depuis plus de vingt ans. Ceux qui ne pêchent pas ont des transats et un espace à l'ombre. On choisit entre la sortie partagée et le bateau rien que pour vous.",
      de: "Vier Stunden Hochseeangeln vor Puerto Colón, an Bord der No Limits. Es geht auf Thunfisch, Marlin und Goldmakrele, und wer es versuchen will, bekommt eine Rute, auch Anfänger: Die Crew kennt diese Gewässer seit über zwanzig Jahren. Wer nicht angelt, hat Liegen und einen Schattenbereich. Zur Wahl stehen die geteilte Fahrt oder das Boot ganz für Sie."
    },
    image: "pesca-altura.webp",
    // dove ci si presenta: era gia' scritto nei consigli (15 ottobre 2026)
    ritrovo: "Puerto Colón",
    published: true
  },
  {
    id: "luxury-catamaran",
    title: { it: "Catamarano di lusso", en: "Luxury Catamaran Experience", es: "Catamarán de lujo", fr: "Catamaran de luxe", de: "Luxus-Katamaran" },
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["mezza"],
    // Partenze dal proprietario, 9 ottobre 2026.
    times: ["11:00", "14:00", "17:00"],
    priceFrom: 75,
    privateOption: "luxury-catamaran-charter",
    priceAdult: 75,
    priceChild: 50,
    priceInfant: 0,
    ages: { adult: "12+", child: "3-11", infant: "0-2" },
    included: ["fingerfood", "drinks", "swimstop"],
    notes: [
      { it: "Presentati 15 minuti prima della partenza.",
        en: "Please arrive 15 minutes before departure.",
        es: "Preséntate 15 minutos antes de la salida.",
        fr: "Merci d'arriver 15 minutes avant le départ.",
        de: "Bitte seien Sie 15 Minuten vor der Abfahrt da." },
      { it: "Porta asciugamano, costume e protezione solare.",
        en: "Bring a towel, swimwear and sun protection.",
        es: "Trae toalla, bañador y protección solar.",
        fr: "Apportez une serviette, un maillot de bain et une protection solaire.",
        de: "Bringen Sie Handtuch, Badesachen und Sonnenschutz mit." }
    ],
    family: true,
    desc: {
      it: "Catamarano di categoria superiore, con un massimo di 22 persone a bordo: atmosfera rilassata, avvistamento di delfini e balene e aree lounge per stare comodi.",
      en: "An upscale catamaran with a maximum of 22 guests on board: a relaxed atmosphere, dolphin and whale watching, and plush lounging areas.",
      es: "Catamarán de categoría superior, con un máximo de 22 personas a bordo: ambiente relajado, avistamiento de delfines y ballenas y zonas lounge para estar cómodos.",
      fr: "Un catamaran haut de gamme avec 22 passagers au maximum à bord : ambiance détendue, observation des dauphins et des baleines, et des espaces de détente confortables.",
      de: "Ein gehobener Katamaran mit höchstens 22 Gästen an Bord: entspannte Atmosphäre, Delfin- und Walbeobachtung und bequeme Liegebereiche."
    },
    image: "luxury-catamaran.webp",
    gallery: ["luxury-catamaran-2.webp", "luxury-catamaran-3.webp", "luxury-catamaran-4.webp", "luxury-catamaran-5.webp"],
    published: true
  },
  {
    id: "small-group-catamaran",
    title: { it: "Catamarano per piccoli gruppi", en: "Small Group Catamaran", es: "Catamarán para grupos pequeños", fr: "Catamaran en petit groupe", de: "Katamaran für kleine Gruppen" },
    // La barca e' il Kalima Kat: sul ticket i venditori scrivono "KALIMAKA"
    // (proprietario, 17 ottobre 2026). Solo qui e non sulla gemella dei Tour
    // privati: lo stesso nome su due schede controlla.js non lo accetta.
    // Eden e' un'altra compagnia di catamarani piccoli (proprietario, 29
    // ottobre 2026).
    nomi: ["Kalima Kat", "Kalimaka", "Eden"],
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "3 o 6 ore", en: "3 or 6 hours", es: "3 o 6 horas", fr: "3 ou 6 heures", de: "3 oder 6 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["mezza", "intera"],
    priceFrom: 60,
    priceAdult: 0,
    priceChild: 0,
    priceInfant: 0,
    ages: { adult: "12+", child: "3-11", infant: "0-2" },
    options: {
      label: { it: "Formula", en: "Option", es: "Fórmula", fr: "Option", de: "Option" },
      choices: [
        {
          label: { it: "3 ore, in condivisione", en: "3 hours, shared", es: "3 horas, compartido", fr: "3 heures, partagée", de: "3 Stunden, geteilt" },
          priceAdult: 60,
          priceChild: 30,
          duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
          times: ["09:30", "12:30"],
          desc: {
            it: "Si sale insieme ad altri e si fa lo stesso giro del charter privato, spendendo meno. Tre ore lungo la costa, con sosta bagno, snorkeling e paella di pollo a bordo. Tutti i giorni alle 9:30 e alle 12:30.",
            en: "You share the boat with others and do the same route as the private charter, for less. Three hours along the coast, with a swim stop, snorkelling and chicken paella on board. Every day at 9:30 and 12:30.",
            es: "Se sube junto a otras personas y se hace la misma ruta que el chárter privado, gastando menos. Tres horas por la costa, con parada de baño, snorkel y paella de pollo a bordo. Todos los días a las 9:30 y a las 12:30.",
            fr: "Vous partagez le bateau avec d'autres personnes et faites le même parcours que le charter privé, pour moins cher. Trois heures le long de la côte, avec arrêt baignade, snorkeling et paella au poulet à bord. Tous les jours à 9:30 et 12:30.",
            de: "Sie teilen das Boot mit anderen und fahren dieselbe Route wie der Privatcharter, für weniger Geld. Drei Stunden entlang der Küste, mit Badestopp, Schnorcheln und Hähnchen-Paella an Bord. Täglich um 9:30 und 12:30."
          }
        },
        // Tre ore e sei ore sono due varianti e non una sola: il netto della
        // compagnia e' diverso (il doppio, come il prezzo), e il ticket deve dire
        // quale delle due (proprietario, 17 ottobre 2026). Prezzi ufficiali del
        // foglio dei venditori.
        {
          label: { it: "Charter privato, 3 ore", en: "Private charter, 3 hours", es: "Chárter privado, 3 horas", fr: "Charter privé, 3 heures", de: "Privatcharter, 3 Stunden" },
          price: 690,
          duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
          // Lista vuota, non campo mancante: il charter privato non ha orari
          // fissi, l'ora si concorda. Senza questa riga sarebbero comparse le
          // fasce segnaposto, cioe' degli orari inventati.
          times: [],
          desc: {
            it: "La barca solo per il tuo gruppo, per tre ore: €690. Si può fare anche al tramonto. Il prezzo è della barca intera, non a persona: scrivici quante siete.",
            en: "The boat just for your group, for three hours: €690. It can also be done at sunset. The price is for the whole boat, not per person: tell us how many you are.",
            es: "El barco solo para tu grupo, durante tres horas: 690 €. También se puede hacer al atardecer. El precio es del barco entero, no por persona: escríbenos cuántos sois.",
            fr: "Le bateau rien que pour votre groupe, pendant trois heures : €690. On peut aussi le faire au coucher du soleil. Le prix est pour tout le bateau, pas par personne : dites-nous combien vous êtes.",
            de: "Das Boot nur für Ihre Gruppe, drei Stunden lang: €690. Es geht auch zum Sonnenuntergang. Der Preis gilt für das ganze Boot, nicht pro Person: Sagen Sie uns, wie viele Sie sind."
          }
        },
        {
          label: { it: "Charter privato, 6 ore", en: "Private charter, 6 hours", es: "Chárter privado, 6 horas", fr: "Charter privé, 6 heures", de: "Privatcharter, 6 Stunden" },
          price: 1380,
          duration: { it: "6 ore", en: "6 hours", es: "6 horas", fr: "6 heures", de: "6 Stunden" },
          times: [],
          desc: {
            it: "La barca solo per il tuo gruppo, per sei ore: €1.380. Si gira più in largo, si vedono più cale e si sta più tempo in acqua. Il prezzo è della barca intera, non a persona: scrivici quante siete.",
            en: "The boat just for your group, for six hours: €1,380. You range further, see more coves and stay longer in the water. The price is for the whole boat, not per person: tell us how many you are.",
            es: "El barco solo para tu grupo, durante seis horas: 1.380 €. Se va más lejos, se ven más calas y se está más tiempo en el agua. El precio es del barco entero, no por persona: escríbenos cuántos sois.",
            fr: "Le bateau rien que pour votre groupe, pendant six heures : €1 380. On va plus loin, on voit plus de criques et on reste plus longtemps dans l'eau. Le prix est pour tout le bateau, pas par personne : dites-nous combien vous êtes.",
            de: "Das Boot nur für Ihre Gruppe, sechs Stunden lang: €1.380. Man fährt weiter, sieht mehr Buchten und bleibt länger im Wasser. Der Preis gilt für das ganze Boot, nicht pro Person: Sagen Sie uns, wie viele Sie sind."
          }
        }
      ]
    },
    included: ["lunch", "drinks", "swimstop", "snorkel", "guide"],
    notes: [
      {
        it: "Le bevande comprese sono analcoliche, birra e acqua.",
        en: "The drinks included are soft drinks, beer and water.",
        es: "Las bebidas incluidas son refrescos, cerveza y agua.",
        fr: "Les boissons comprises sont sodas, bière et eau.",
        de: "Die inklusiven Getränke sind Softdrinks, Bier und Wasser."
      },
      {
        it: "A bordo c'è la toilette, che su una barca di questo tipo non è scontato.",
        en: "There is a toilet on board, which is not a given on a boat like this.",
        es: "A bordo hay aseo, que en un barco de este tipo no se da por hecho.",
        fr: "Il y a des toilettes à bord, ce qui n'est pas évident sur un bateau comme celui-ci.",
        de: "An Bord gibt es eine Toilette, was auf so einem Boot keine Selbstverständlichkeit ist."
      },
      {
        it: "Nel prezzo ci sono anche l'equipaggio e l'assicurazione.",
        en: "The crew and the insurance are included in the price as well.",
        es: "En el precio están también la tripulación y el seguro.",
        fr: "L'équipage et l'assurance sont aussi compris dans le prix.",
        de: "Crew und Versicherung sind ebenfalls im Preis inbegriffen."
      },
      {
        it: "Presentati 15 minuti prima della partenza.",
        en: "Please arrive 15 minutes before departure.",
        es: "Preséntate 15 minutos antes de la salida.",
        fr: "Merci d'arriver 15 minutes avant le départ.",
        de: "Bitte seien Sie 15 Minuten vor der Abfahrt da."
      },
      {
        it: "Porta asciugamano, costume e protezione solare.",
        en: "Bring a towel, swimwear and sun protection.",
        es: "Trae toalla, bañador y protección solar.",
        fr: "Apportez une serviette, un maillot de bain et une protection solaire.",
        de: "Bringen Sie Handtuch, Badesachen und Sonnenschutz mit."
      }
    ],
    family: true,
    desc: {
      it: "Un catamarano che porta fino a 23 persone: quasi nessuna barca privata a Tenerife ne porta più di 12. Si parte da Puerto Colón, si cercano delfini e balene e ci si ferma nelle cale per il bagno e lo snorkeling, con la paella di pollo a bordo. Si sceglie fra il giro di tre ore in condivisione e la barca tutta per sé, per tre o sei ore.",
      en: "A catamaran that takes up to 23 people: hardly any private boat in Tenerife takes more than 12. You leave Puerto Colón, look for dolphins and whales and stop in the coves to swim and snorkel, with chicken paella on board. Choose between the shared three-hour trip and having the boat to yourselves, for three hours or six.",
      es: "Un catamarán que lleva hasta 23 personas: casi ningún barco privado en Tenerife lleva más de 12. Se sale de Puerto Colón, se buscan delfines y ballenas y se para en las calas para bañarse y hacer snorkel, con paella de pollo a bordo. Se elige entre la salida de tres horas compartida y el barco entero para ti, tres horas o seis.",
      fr: "Un catamaran qui accueille jusqu'à 23 personnes : à Tenerife, presque aucun bateau privé n'en prend plus de 12. On part de Puerto Colón, on cherche dauphins et baleines et on s'arrête dans les criques pour se baigner et faire du snorkeling, avec paella au poulet à bord. On choisit entre la sortie partagée de trois heures et le bateau rien que pour vous, trois heures ou six.",
      de: "Ein Katamaran für bis zu 23 Personen: Kaum ein Privatboot auf Teneriffa nimmt mehr als 12. Sie legen in Puerto Colón ab, suchen Delfine und Wale und halten in den Buchten zum Baden und Schnorcheln, mit Hähnchen-Paella an Bord. Zur Wahl stehen die geteilte Drei-Stunden-Fahrt oder das Boot ganz für Sie, drei oder sechs Stunden."
    },
    image: "small-group-catamaran.webp",
    gallery: ["small-group-catamaran-2.webp", "small-group-catamaran-3.webp", "small-group-catamaran-4.webp"],
    published: true
  },
  {
    id: "utopia-boat-party",
    // Il nome della barca non sta nel titolo (proprietario, 28 ottobre 2026):
    // il cliente legge che giro e', nella sua lingua. Sta in `nomi`, per i
    // venditori e i ticket.
    title: { it: "Festa in barca", en: "Boat Party", es: "Fiesta en barco", fr: "Soirée en bateau", de: "Bootsparty" },
    nomi: ["Utopia"],
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["mezza"],
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
      label: { it: "Biglietto", en: "Ticket", es: "Entrada", fr: "Billet", de: "Ticket" },
      choices: [
        {
          label: { it: "Basic", en: "Basic", es: "Basic", fr: "Basic", de: "Basic" },
          priceAdult: 75,
          desc: {
            it: "Quattro consumazioni a scelta: superalcolici locali, birra Victoria Málaga o analcoliche.",
            en: "Four drinks of your choice: local spirits, Victoria Málaga beer or soft drinks.",
            es: "Cuatro consumiciones a elegir: licores locales, cerveza Victoria Málaga o refrescos.",
            fr: "Quatre boissons au choix : alcools locaux, bière Victoria Málaga ou sodas.",
            de: "Vier Getränke nach Wahl: lokale Spirituosen, Victoria-Málaga-Bier oder Softdrinks."
          }
        },
        {
          label: { it: "Standard", en: "Standard", es: "Standard", fr: "Standard", de: "Standard" },
          priceAdult: 90,
          desc: {
            it: "Open bar per tutte e tre le ore: birra locale, superalcolici locali e mixer, senza limite.",
            en: "Open bar for the whole three hours: local beer, local spirits and mixers, no limit.",
            es: "Barra libre durante las tres horas: cerveza local, licores locales y refrescos, sin límite.",
            fr: "Open bar pendant les trois heures : bière locale, alcools locaux et softs, sans limite.",
            de: "Open Bar die ganzen drei Stunden: lokales Bier, lokale Spirituosen und Mixer, ohne Limit."
          }
        },
        {
          label: { it: "Premium", en: "Premium", es: "Premium", fr: "Premium", de: "Premium" },
          priceAdult: 110,
          desc: {
            it: "Open bar con le marche: Absolut, Bacardi, Havana, Beefeater, Disaronno, Malibu, Jim Beam e Ballantine's, più Red Bull e mixer premium.",
            en: "Open bar with the brands: Absolut, Bacardi, Havana, Beefeater, Disaronno, Malibu, Jim Beam and Ballantine's, plus Red Bull and premium mixers.",
            es: "Barra libre con las marcas: Absolut, Bacardi, Havana, Beefeater, Disaronno, Malibu, Jim Beam y Ballantine's, además de Red Bull y refrescos premium.",
            fr: "Open bar avec les marques : Absolut, Bacardi, Havana, Beefeater, Disaronno, Malibu, Jim Beam et Ballantine's, plus Red Bull et softs premium.",
            de: "Open Bar mit Markengetränken: Absolut, Bacardi, Havana, Beefeater, Disaronno, Malibu, Jim Beam und Ballantine's, dazu Red Bull und Premium-Mixer."
          }
        },
        {
          label: { it: "VIP", en: "VIP", es: "VIP", fr: "VIP", de: "VIP" },
          priceAdult: 130,
          desc: {
            it: "Tutto quello del Premium, più l'imbarco prioritario e l'accesso all'area VIP, che ha il suo bar.",
            en: "Everything in Premium, plus priority boarding and access to the VIP area, which has its own bar.",
            es: "Todo lo del Premium, más embarque prioritario y acceso a la zona VIP, que tiene su propia barra.",
            fr: "Tout ce qu'il y a dans Premium, plus l'embarquement prioritaire et l'accès à l'espace VIP, qui a son propre bar.",
            de: "Alles aus Premium, dazu bevorzugtes Einsteigen und Zugang zum VIP-Bereich mit eigener Bar."
          }
        }
      ]
    },
    included: ["drinks", "swimstop", "photos"],
    notes: [
      {
        it: "Si fa il sabato.",
        en: "It runs on Saturdays.",
        es: "Se hace los sábados.",
        fr: "Elle a lieu le samedi.",
        de: "Sie findet samstags statt."
      },
      {
        it: "Solo maggiorenni: sotto i 18 anni non si sale.",
        en: "Over-18s only: under 18 you cannot board.",
        es: "Solo mayores de edad: por debajo de los 18 años no se sube.",
        fr: "Réservée aux plus de 18 ans : en dessous de 18 ans, on ne monte pas à bord.",
        de: "Nur ab 18: Unter 18 Jahren darf man nicht an Bord."
      },
      {
        it: "Il ritrovo è al Black Pearl Bar di Puerto Colón, dove si beve qualcosa insieme prima di salire e dove si torna dopo per l'after. Arriva almeno 15 minuti prima. Al porto c'è parcheggio.",
        en: "You meet at the Black Pearl Bar in Puerto Colón, where everyone has a drink together before boarding and where the after-party is afterwards. Get there at least 15 minutes early. There is parking at the marina.",
        es: "El punto de encuentro es el Black Pearl Bar de Puerto Colón, donde se toma algo juntos antes de subir y donde se vuelve después para el after. Llega al menos 15 minutos antes. En el puerto hay aparcamiento.",
        fr: "Rendez-vous au Black Pearl Bar de Puerto Colón, où l'on boit un verre tous ensemble avant d'embarquer et où a lieu l'after ensuite. Arrivez au moins 15 minutes en avance. Il y a un parking à la marina.",
        de: "Treffpunkt ist die Black Pearl Bar in Puerto Colón, wo alle vor dem Einsteigen zusammen etwas trinken und wo danach die Afterparty steigt. Seien Sie mindestens 15 Minuten früher da. Am Jachthafen gibt es Parkplätze."
      },
      {
        it: "Le foto fatte a bordo dai fotografi si scaricano dopo, gratis.",
        en: "The photos taken on board by the photographers can be downloaded afterwards, free.",
        es: "Las fotos hechas a bordo por los fotógrafos se descargan después, gratis.",
        fr: "Les photos prises à bord par les photographes se téléchargent ensuite, gratuitement.",
        de: "Die Fotos der Fotografen an Bord kann man danach kostenlos herunterladen."
      },
      {
        it: "Mangia qualcosa prima di salire e vacci piano con l'alcol prima della partenza: aiuta parecchio col mal di mare.",
        en: "Eat something before boarding and go easy on the alcohol beforehand: it helps a lot with seasickness.",
        es: "Come algo antes de subir y ve con calma con el alcohol antes de salir: ayuda bastante con el mareo.",
        fr: "Mangez quelque chose avant d'embarquer et allez-y doucement sur l'alcool avant : cela aide beaucoup contre le mal de mer.",
        de: "Essen Sie vor dem Einsteigen etwas und halten Sie sich vorher mit Alkohol zurück: Das hilft sehr gegen Seekrankheit."
      },
      {
        it: "Porta costume e crema solare.",
        en: "Bring swimwear and sunscreen.",
        es: "Trae bañador y crema solar.",
        fr: "Apportez maillot de bain et crème solaire.",
        de: "Bringen Sie Badesachen und Sonnencreme mit."
      }
    ],
    family: false,
    desc: {
      it: "Tre ore di festa in barca da Puerto Colón, con DJ dal vivo, un impianto da 15.000 watt e musica house, reggaeton, hip hop e drum and bass. Si comincia con un bicchiere al Black Pearl e si finisce lì con l'after. Solo maggiorenni. Il biglietto si sceglie in base a quanto si beve: quattro consumazioni, oppure open bar per tutte e tre le ore.",
      en: "Three hours of boat party out of Puerto Colón, with live DJs, a 15,000-watt sound system and house, reggaeton, hip hop and drum and bass. It starts with a drink at the Black Pearl and ends there with the after-party. Over-18s only. You pick your ticket by how much you plan to drink: four drinks, or an open bar for the whole three hours.",
      es: "Tres horas de fiesta en barco desde Puerto Colón, con DJ en directo, un equipo de 15.000 vatios y música house, reggaetón, hip hop y drum and bass. Se empieza con una copa en el Black Pearl y se termina allí con el after. Solo mayores de 18 años. La entrada se elige según cuánto se va a beber: cuatro consumiciones, o barra libre durante las tres horas.",
      fr: "Trois heures de boat party au départ de Puerto Colón, avec DJ en live, une sono de 15 000 watts et de la house, du reggaeton, du hip-hop et de la drum and bass. On commence par un verre au Black Pearl et on y finit avec l'after. Réservée aux plus de 18 ans. On choisit son billet selon ce qu'on compte boire : quatre boissons, ou l'open bar pendant les trois heures.",
      de: "Drei Stunden Bootsparty ab Puerto Colón, mit Live-DJs, einer 15.000-Watt-Anlage und House, Reggaeton, Hip-Hop und Drum and Bass. Es beginnt mit einem Drink im Black Pearl und endet dort mit der Afterparty. Nur ab 18. Das Ticket wählt man danach, wie viel man trinken will: vier Getränke oder Open Bar die ganzen drei Stunden."
    },
    image: "party-boat.webp",
    gallery: ["party-boat-2.webp"],
    // dove ci si presenta: era gia' scritto nei consigli (15 ottobre 2026)
    ritrovo: "Black Pearl Bar, Puerto Colón",
    published: true
  },
  {
    id: "shogun",
    // Il nome della barca non sta nel titolo (proprietario, 28 ottobre 2026):
    // il cliente legge che giro e', nella sua lingua. Sta in `nomi`, per i
    // venditori e i ticket.
    title: { it: "Veliero orientale alla baia di Masca", en: "Oriental Schooner to Masca Bay", es: "Goleta oriental a la bahía de Masca", fr: "Goélette orientale vers la baie de Masca", de: "Orientalischer Schoner zur Bucht von Masca" },
    nomi: ["Shogun"],
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "5 ore", en: "5 hours", es: "5 horas", fr: "5 heures", de: "5 Stunden" },
    zoneGroups: ["costa-adeje", "teide-nord"],
    durationGroups: ["mezza"],
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
      label: { it: "Partenza", en: "Departure", es: "Salida", fr: "Départ", de: "Abfahrt" },
      choices: [
        {
          label: { it: "Dal sud", en: "From the south", es: "Desde el sur", fr: "Depuis le sud", de: "Aus dem Süden" },
          priceAdult: 61,
          priceChild: 30,
          desc: {
            it: "La navetta ti prende in hotel nel sud dell'isola e ti riporta indietro, compresa nel prezzo. La barca parte alle 11:00 da Puerto Colón.",
            en: "The shuttle picks you up at your hotel in the south of the island and brings you back, included in the price. The boat leaves at 11:00 from Puerto Colón.",
            es: "La lanzadera te recoge en el hotel en el sur de la isla y te devuelve, incluida en el precio. El barco sale a las 11:00 desde Puerto Colón.",
            fr: "La navette vous prend à votre hôtel dans le sud de l'île et vous ramène, compris dans le prix. Le bateau part à 11:00 de Puerto Colón.",
            de: "Der Shuttle holt Sie im Süden der Insel am Hotel ab und bringt Sie zurück, im Preis inbegriffen. Das Boot legt um 11:00 in Puerto Colón ab."
          }
        },
        {
          label: { it: "Dal nord", en: "From the north", es: "Desde el norte", fr: "Depuis le nord", de: "Aus dem Norden" },
          priceAdult: 65,
          priceChild: 32,
          zone: "Puerto de la Cruz",
          desc: {
            it: "Per chi alloggia nel nord: la navetta parte da Puerto de la Cruz e ti riporta indietro. Stessa gita, la barca parte alle 11:00 da Puerto Colón.",
            en: "For anyone staying in the north: the shuttle leaves from Puerto de la Cruz and brings you back. Same trip, the boat leaves at 11:00 from Puerto Colón.",
            es: "Para quien se aloja en el norte: la lanzadera sale de Puerto de la Cruz y te devuelve. La misma salida, el barco parte a las 11:00 desde Puerto Colón.",
            fr: "Pour ceux qui logent dans le nord : la navette part de Puerto de la Cruz et vous ramène. Même sortie, le bateau part à 11:00 de Puerto Colón.",
            de: "Für alle, die im Norden wohnen: Der Shuttle fährt ab Puerto de la Cruz und bringt Sie zurück. Dieselbe Tour, das Boot legt um 11:00 in Puerto Colón ab."
          }
        }
      ]
    },
    included: ["swimstop", "lunch", "drinks", "transfer", "guide"],
    notes: [
      {
        it: "Si fa il lunedì, il mercoledì, il giovedì, il venerdì e la domenica.",
        en: "It runs on Mondays, Wednesdays, Thursdays, Fridays and Sundays.",
        es: "Se hace los lunes, miércoles, jueves, viernes y domingos.",
        fr: "Elle a lieu le lundi, mercredi, jeudi, vendredi et dimanche.",
        de: "Sie findet montags, mittwochs, donnerstags, freitags und sonntags statt."
      },
      {
        it: "La barca parte da Puerto Colón, pontile 14: arriva almeno 30 minuti prima.",
        en: "The boat leaves from Puerto Colón, pontoon 14: get there at least 30 minutes early.",
        es: "El barco sale de Puerto Colón, pantalán 14: llega al menos 30 minutos antes.",
        fr: "Le bateau part de Puerto Colón, ponton 14 : arrivez au moins 30 minutes en avance.",
        de: "Das Boot legt in Puerto Colón ab, Ponton 14: Seien Sie mindestens 30 Minuten früher da."
      },
      {
        it: "A pranzo: riso con verdure, coscia di pollo arrosto, insalata, pane e frutta fresca. Fra le bevande comprese ci sono acqua, analcoliche, birra e vino, e le analcoliche sono a volontà.",
        en: "For lunch: rice with vegetables, a roast chicken drumstick, salad, bread and fresh fruit. The drinks included are water, soft drinks, beer and wine, and the soft drinks are unlimited.",
        es: "Para comer: arroz con verduras, muslo de pollo asado, ensalada, pan y fruta fresca. Entre las bebidas incluidas hay agua, refrescos, cerveza y vino, y los refrescos son ilimitados.",
        fr: "Pour le déjeuner : riz aux légumes, cuisse de poulet rôti, salade, pain et fruits frais. Les boissons comprises sont eau, sodas, bière et vin, et les sodas sont à volonté.",
        de: "Zu Mittag: Reis mit Gemüse, eine gebratene Hähnchenkeule, Salat, Brot und frisches Obst. Die inklusiven Getränke sind Wasser, Softdrinks, Bier und Wein, und die Softdrinks sind unbegrenzt."
      },
      {
        it: "A bordo ci sono tre bagni, uno attrezzato per chi ha difficoltà motorie: la barca è accessibile.",
        en: "There are three toilets on board, one fitted for guests with reduced mobility: the boat is accessible.",
        es: "A bordo hay tres aseos, uno equipado para personas con movilidad reducida: el barco es accesible.",
        fr: "Il y a trois toilettes à bord, dont une adaptée aux personnes à mobilité réduite : le bateau est accessible.",
        de: "An Bord gibt es drei Toiletten, eine davon für Menschen mit eingeschränkter Mobilität: Das Boot ist barrierefrei."
      },
      {
        it: "Si fuma solo nelle zone apposite.",
        en: "Smoking is allowed only in the designated areas.",
        es: "Solo se puede fumar en las zonas habilitadas.",
        fr: "On ne peut fumer que dans les zones prévues.",
        de: "Geraucht werden darf nur in den dafür vorgesehenen Bereichen."
      },
      {
        it: "Porta costume, asciugamano, crema solare e la macchina fotografica. E vacci piano con l'alcol prima di salire: aiuta col mal di mare.",
        en: "Bring swimwear, a towel, sunscreen and a camera. And go easy on the alcohol before boarding: it helps with seasickness.",
        es: "Trae bañador, toalla, crema solar y la cámara. Y ve con calma con el alcohol antes de subir: ayuda con el mareo.",
        fr: "Apportez maillot de bain, serviette, crème solaire et appareil photo. Et allez-y doucement sur l'alcool avant d'embarquer : cela aide contre le mal de mer.",
        de: "Bringen Sie Badesachen, Handtuch, Sonnencreme und Kamera mit. Und halten Sie sich vor dem Einsteigen mit Alkohol zurück: Das hilft gegen Seekrankheit."
      }
    ],
    family: true,
    desc: {
      it: "Una goletta orientale di 26 metri, tutta in teak, costruita per uno sceicco: è la barca più particolare che parte da Puerto Colón. Cinque ore, con mezz'ora passata accanto a delfini e balene, poi le scogliere di Los Gigantes e il bagno nella baia di Masca, con il pranzo servito a bordo. Su due ponti c'è posto per 135 persone e tanta ombra dove ripararsi. Ha la bandiera blu che si dà alle barche che si avvicinano ai cetacei rispettando le regole.",
      en: "A 26-metre oriental schooner, all teak, built for a sheikh: it is the most unusual boat leaving Puerto Colón. Five hours, with half an hour spent alongside dolphins and whales, then the cliffs of Los Gigantes and a swim in Masca bay, with lunch served on board. Across two decks there is room for 135 people and plenty of shade. It flies the blue flag given to boats that approach cetaceans by the rules.",
      es: "Una goleta oriental de 26 metros, toda de teca, construida para un jeque: es el barco más singular que sale de Puerto Colón. Cinco horas, con media hora junto a delfines y ballenas, luego los acantilados de Los Gigantes y el baño en la bahía de Masca, con la comida servida a bordo. En dos cubiertas hay sitio para 135 personas y mucha sombra donde resguardarse. Lleva la bandera azul que se da a los barcos que se acercan a los cetáceos respetando las normas.",
      fr: "Une goélette orientale de 26 mètres, tout en teck, construite pour un cheikh : c'est le bateau le plus insolite qui part de Puerto Colón. Cinq heures, dont une demi-heure aux côtés des dauphins et des baleines, puis les falaises de Los Gigantes et une baignade dans la baie de Masca, avec le déjeuner servi à bord. Sur deux ponts, il y a de la place pour 135 personnes et beaucoup d'ombre. Elle arbore le pavillon bleu donné aux bateaux qui approchent les cétacés dans les règles.",
      de: "Ein 26 Meter langer orientalischer Schoner, ganz aus Teakholz, gebaut für einen Scheich: das ungewöhnlichste Boot ab Puerto Colón. Fünf Stunden, davon eine halbe Stunde bei Delfinen und Walen, dann die Klippen von Los Gigantes und Baden in der Bucht von Masca, mit Mittagessen an Bord. Auf zwei Decks ist Platz für 135 Personen und viel Schatten. Er führt die blaue Flagge, die Booten verliehen wird, die sich den Walen nach den Regeln nähern."
    },
    image: "shogun.webp",
    gallery: ["shogun-2.webp", "shogun-3.webp"],
    published: true
  },
  {
    id: "opera-60",
    // Il nome della barca non sta nel titolo (proprietario, 28 ottobre 2026):
    // il cliente legge che giro e', nella sua lingua. Sta in `nomi`, per i
    // venditori e i ticket.
    title: { it: "Gommone veloce e snorkeling", en: "Speedboat & Snorkel Trip", es: "Lancha rápida y snorkel", fr: "Bateau rapide et snorkeling", de: "Schnellboot- und Schnorcheltour" },
    nomi: ["Opera 60"],
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "Da 3 a 9 ore", en: "3 to 9 hours", es: "De 3 a 9 horas", fr: "De 3 à 9 heures", de: "3 bis 9 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["mezza", "intera"],
    times: ["10:00", "13:30"],
    priceFrom: 80,
    priceAdult: 0,
    priceChild: 0,
    // 12+ discende dai bambini 1-11. La fascia dei bebe' e' in mesi, quindi va
    // scritta nelle cinque lingue: "0-11" da solo si leggerebbe come anni.
    ages: {
      adult: "12+",
      child: "1-11",
      infant: { it: "0-11 mesi", en: "0-11 months", es: "0-11 meses", fr: "0-11 mois", de: "0-11 Monate" }
    },
    priceInfant: 0,
    options: {
      label: { it: "Formula", en: "Option", es: "Fórmula", fr: "Option", de: "Option" },
      choices: [
        {
          label: { it: "3 ore, in condivisione", en: "3 hours, shared", es: "3 horas, compartido", fr: "3 heures, partagée", de: "3 Stunden, geteilt" },
          priceAdult: 80,
          priceChild: 50,
          duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
          included: ["snack"],
          desc: {
            it: "Si sale insieme ad altri, fino a 12 persone in tutto. Tre ore lungo la costa sud-ovest, con sosta bagno, qualcosa da mangiare e da bere a bordo, e buone possibilità di vedere delfini e globicefali.",
            en: "You share the boat with others, up to 12 people in all. Three hours along the south-west coast, with a swim stop, something to eat and drink on board, and a good chance of spotting dolphins and pilot whales.",
            es: "Se sube junto a otras personas, hasta 12 en total. Tres horas por la costa suroeste, con parada de baño, algo de comer y beber a bordo, y buenas posibilidades de ver delfines y calderones.",
            fr: "Vous partagez le bateau avec d'autres personnes, 12 au maximum en tout. Trois heures le long de la côte sud-ouest, avec arrêt baignade, de quoi manger et boire à bord, et de bonnes chances de voir dauphins et globicéphales.",
            de: "Sie teilen das Boot mit anderen, insgesamt höchstens 12 Personen. Drei Stunden entlang der Südwestküste, mit Badestopp, etwas zu essen und zu trinken an Bord und guten Chancen auf Delfine und Grindwale."
          }
        },
        {
          label: { it: "Charter privato", en: "Private charter", es: "Chárter privado", fr: "Charter privé", de: "Privatcharter" },
          price: 545,
          duration: { it: "Da 3 a 9 ore", en: "3 to 9 hours", es: "De 3 a 9 horas", fr: "De 3 à 9 heures", de: "3 bis 9 Stunden" },
          included: ["lunch"],
          desc: {
            it: "La barca solo per il tuo gruppo, fino a 12 persone: da €545 per tre ore, e si può allungare fino a nove. Pranzo a bordo e bar aperto compresi. Il prezzo è della barca intera, non a persona: scrivici quante siete e quante ore vuoi e ti facciamo il conto.",
            en: "The boat just for your group, up to 12 people: from €545 for three hours, and you can stretch it to nine. Lunch on board and open bar included. The price is for the whole boat, not per person: tell us how many you are and how many hours you want and we'll work it out.",
            es: "El barco solo para tu grupo, hasta 12 personas: desde 545 € por tres horas, y se puede alargar hasta nueve. Comida a bordo y barra libre incluidas. El precio es del barco entero, no por persona: escríbenos cuántos sois y cuántas horas quieres y te hacemos las cuentas.",
            fr: "Le bateau rien que pour votre groupe, jusqu'à 12 personnes : à partir de €545 pour trois heures, et on peut aller jusqu'à neuf. Déjeuner à bord et open bar compris. Le prix est pour tout le bateau, pas par personne : dites-nous combien vous êtes et combien d'heures vous voulez, et nous faisons le calcul.",
            de: "Das Boot nur für Ihre Gruppe, bis zu 12 Personen: ab €545 für drei Stunden, verlängerbar bis neun. Mittagessen an Bord und Open Bar inklusive. Der Preis gilt für das ganze Boot, nicht pro Person: Sagen Sie uns, wie viele Sie sind und wie viele Stunden Sie möchten, und wir rechnen es aus."
          }
        }
      ]
    },
    included: ["swimstop", "snorkel", "drinks", "guide"],
    notes: [
      {
        it: "È un gommone rigido di grandi dimensioni, con motori potenti: si va veloci e si arriva lontano, ma con il mare mosso si sente più che su un catamarano.",
        en: "It is a large rigid inflatable with powerful engines: you go fast and get far, but in rough seas you feel it more than on a catamaran.",
        es: "Es una neumática rígida de gran tamaño, con motores potentes: se va rápido y se llega lejos, pero con mar movido se nota más que en un catamarán.",
        fr: "C'est un grand semi-rigide aux moteurs puissants : on va vite et loin, mais par mer agitée on le sent plus que sur un catamaran.",
        de: "Es ist ein großes Festrumpfschlauchboot mit starken Motoren: Man ist schnell und kommt weit, aber bei rauer See spürt man es mehr als auf einem Katamaran."
      },
      {
        it: "A bordo ci sono zone al sole e zone all'ombra, e una piattaforma da cui si scende in acqua.",
        en: "On board there are areas in the sun and areas in the shade, and a platform to get into the water from.",
        es: "A bordo hay zonas al sol y zonas a la sombra, y una plataforma para bajar al agua.",
        fr: "À bord, il y a des espaces au soleil et à l'ombre, et une plateforme pour entrer dans l'eau.",
        de: "An Bord gibt es Bereiche in der Sonne und im Schatten und eine Plattform, um ins Wasser zu gehen."
      },
      {
        it: "Fra le bevande comprese ci sono birra, vino e analcoliche, e non manca lo spumante.",
        en: "The drinks included are beer, wine and soft drinks, and there is sparkling wine too.",
        es: "Entre las bebidas incluidas hay cerveza, vino y refrescos, y no falta el espumoso.",
        fr: "Les boissons comprises sont bière, vin et sodas, et il y a aussi du vin pétillant.",
        de: "Die inklusiven Getränke sind Bier, Wein und Softdrinks, und es gibt auch Sekt."
      },
      {
        it: "La barca ha la certificazione \"Blue Boat\", che si dà a chi rispetta le regole per avvicinare i cetacei senza disturbarli.",
        en: "The boat holds the \"Blue Boat\" certification, given to those who follow the rules for approaching cetaceans without disturbing them.",
        es: "El barco tiene la certificación \"Blue Boat\", que se da a quien respeta las normas para acercarse a los cetáceos sin molestarlos.",
        fr: "Le bateau a la certification « Blue Boat », donnée à ceux qui suivent les règles pour approcher les cétacés sans les déranger.",
        de: "Das Boot hat die Zertifizierung „Blue Boat“, die bekommt, wer sich an die Regeln hält, um sich Walen und Delfinen zu nähern, ohne sie zu stören."
      },
      {
        it: "Vicino a Puerto Colón c'è un parcheggio a pagamento, se vieni con la tua macchina.",
        en: "There is a paid car park near Puerto Colón, if you come by car.",
        es: "Cerca de Puerto Colón hay un aparcamiento de pago, si vienes en coche.",
        fr: "Il y a un parking payant près de Puerto Colón, si vous venez en voiture.",
        de: "In der Nähe von Puerto Colón gibt es einen gebührenpflichtigen Parkplatz, falls Sie mit dem Auto kommen."
      }
    ],
    family: true,
    desc: {
      it: "Un gommone rigido da diciotto metri che corre lungo la costa sud-ovest: zone per prendere il sole, ombra dove ripararsi e una piattaforma per scendere in acqua. Attrezzatura da snorkeling a bordo, da mangiare e da bere compresi, e un equipaggio che parla più lingue e racconta quello che si vede. Si sceglie fra il giro di tre ore in condivisione e la barca tutta per sé.",
      en: "An eighteen-metre rigid inflatable that runs along the south-west coast: areas to sunbathe, shade to retreat to and a platform to get into the water from. Snorkelling gear on board, food and drinks included, and a crew that speaks several languages and tells you what you are looking at. Choose between the shared three-hour trip and having the boat to yourselves.",
      es: "Una neumática rígida de dieciocho metros que recorre la costa suroeste: zonas para tomar el sol, sombra donde resguardarse y una plataforma para bajar al agua. Equipo de snorkel a bordo, comida y bebida incluidas, y una tripulación que habla varios idiomas y te cuenta lo que estás viendo. Se elige entre la salida de tres horas compartida y el barco entero para ti.",
      fr: "Un semi-rigide de dix-huit mètres qui longe la côte sud-ouest : des espaces pour bronzer, de l'ombre où se réfugier et une plateforme pour entrer dans l'eau. Matériel de snorkeling à bord, nourriture et boissons comprises, et un équipage qui parle plusieurs langues et raconte ce que l'on voit. On choisit entre la sortie partagée de trois heures et le bateau rien que pour vous.",
      de: "Ein achtzehn Meter langes Festrumpfschlauchboot, das die Südwestküste entlangfährt: Bereiche zum Sonnen, Schatten zum Zurückziehen und eine Plattform, um ins Wasser zu gehen. Schnorchelausrüstung an Bord, Essen und Getränke inklusive, und eine Crew, die mehrere Sprachen spricht und erklärt, was man sieht. Zur Wahl stehen die geteilte Drei-Stunden-Fahrt oder das Boot ganz für Sie."
    },
    image: "opera-60.webp",
    gallery: ["opera-60-2.webp", "opera-60-3.webp"],
    published: true
  },
  {
    id: "luxury-cruiser",
    title: { it: "Yacht di lusso", en: "Luxury Cruiser Experience", es: "Yate de lujo", fr: "Yacht de luxe", de: "Luxusyacht" },
    // La compagnia, come la scrivono i venditori sul ticket. Solo qui e non
    // sul charter: un ticket "Mokkai" con due adulti e' l'uscita a persona.
    // Anche White Dream fa l'uscita a persona (proprietario, 17 ottobre 2026);
    // sul ticket la scrivono anche "White Dr".
    nomi: ["Mokkai", "White Dream", "White Dr"],
    category: "mare-barche",
    // Confermato dall'ufficio: si parte da Las Galletas, cioe' la Marina del
    // Sur che si legge nel cartello dietro la barca nelle foto. Nome proprio,
    // uguale nelle cinque lingue.
    zone: "Las Galletas",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
    zoneGroups: ["los-cristianos"],
    durationGroups: ["mezza"],
    times: ["10:00", "13:00", "16:00"],
    priceFrom: 55,
    // I due prezzi stanno anche qui, non solo dentro la variante in
    // condivisione, perche' il supplemento del transfer si calcola come
    // `transferPrice - priceAdult` della **scheda**: lasciandoli a 0 il
    // ritiro sarebbe costato €60 in piu' invece di €5.
    priceAdult: 55,
    priceChild: 35,
    // I bambini 3-11 li ha confermati l'ufficio; il 12+ degli adulti discende
    // da li', sopra gli 11 non c'e' un'altra fascia. Sotto i 3 anni invece
    // niente `priceInfant`: assente vuol dire "non lo sappiamo", 0 vorrebbe
    // dire "non pagano" e nessuno ce l'ha detto. Resta da chiedere.
    ages: { adult: "12+", child: "3-11" },
    family: true,
    // Segnalate dal fornitore: la guida a bordo parla queste tre.
    languages: ["Español", "English", "Italiano"],
    // `swimstop` e' la sosta bagno, che c'e'; l'attrezzatura da snorkeling il
    // fornitore non la nomina, quindi niente `snorkel`. Il cibo a bordo e' "un
    // tentempie'", uno spuntino: `snack`, non `lunch`. Il transfer **non** sta
    // qui: costa €5 in piu' e le icone dicono "vale sempre".
    included: ["swimstop", "snack", "drinks", "guide"],
    // I prezzi stanno dentro il testo, e la riga automatica sotto e' spenta
    // (`transferPriceHidden`), perche' quella riga e' una sola per tutta la
    // scheda e non segue la variante: sulla barca privata avrebbe continuato a
    // dire "€60 a adulto · €40 a bambino", che li' non vuol dire niente — li'
    // il ritiro costa €5 a persona sopra il prezzo della barca (proprietario,
    // 17 ottobre 2026).
    transfer: {
      it: "Ti veniamo a prendere negli hotel del sud dell'isola, circa 30 minuti prima della partenza: €60 a adulto e €40 a bambino invece di €55 e €35. Sulla barca privata sono €5 in più a persona.",
      en: "We pick you up at hotels in the south of the island, about 30 minutes before departure: €60 per adult and €40 per child instead of €55 and €35. On the private boat it is €5 extra per person.",
      es: "Te recogemos en los hoteles del sur de la isla, unos 30 minutos antes de la salida: 60 € por adulto y 40 € por niño en lugar de 55 € y 35 €. En el barco privado son 5 € más por persona.",
      fr: "Nous passons vous prendre aux hôtels du sud de l'île, environ 30 minutes avant le départ : €60 par adulte et €40 par enfant au lieu de €55 et €35. Sur le bateau privé, c'est €5 de plus par personne.",
      de: "Wir holen Sie an den Hotels im Süden der Insel ab, etwa 30 Minuten vor der Abfahrt: €60 pro Erwachsenem und €40 pro Kind statt €55 und €35. Beim privaten Boot sind es €5 mehr pro Person."
    },
    // Prezzo **completo** col ritiro, non il supplemento: €55 diventano €60 e
    // €35 diventano €40. Serve al totale, non si stampa (vedi sopra).
    transferPrice: { adult: 60, child: 40 },
    transferPriceHidden: true,
    options: {
      label: { it: "Formula", en: "Option", es: "Fórmula", fr: "Option", de: "Option" },
      choices: [
        {
          label: { it: "3 ore, in condivisione", en: "3 hours, shared", es: "3 horas, compartido", fr: "3 heures, partagée", de: "3 Stunden, geteilt" },
          priceAdult: 55,
          priceChild: 35,
          times: ["10:00", "13:00", "16:00"],
          desc: {
            it: "Si sale insieme ad altri: tre ore lungo la costa sud, con la sosta bagno a metà giro e uno spuntino a bordo. Partenze alle 10:00, alle 13:00 e alle 16:00.",
            en: "You share the boat with others: three hours along the south coast, with the swim stop halfway and a snack on board. Departures at 10:00, 13:00 and 16:00.",
            es: "Se sube junto a otras personas: tres horas por la costa sur, con la parada de baño a mitad de recorrido y un tentempié a bordo. Salidas a las 10:00, 13:00 y 16:00.",
            fr: "Vous partagez le bateau avec d'autres personnes : trois heures le long de la côte sud, avec l'arrêt baignade à mi-parcours et un en-cas à bord. Départs à 10:00, 13:00 et 16:00.",
            de: "Sie teilen das Boot mit anderen: drei Stunden entlang der Südküste, mit Badestopp auf halber Strecke und einem Snack an Bord. Abfahrten um 10:00, 13:00 und 16:00."
          }
        },
        {
          label: { it: "Barca privata", en: "Private boat", es: "Barco privado", fr: "Bateau privé", de: "Privates Boot" },
          // Il prezzo ufficiale del foglio dei venditori (proprietario, 17 ottobre 2026).
          price: 550,
          // Lista vuota, non campo mancante: con la barca tutta per se' l'ora
          // si concorda. Senza questa riga sarebbero comparse le fasce
          // segnaposto, cioe' degli orari inventati.
          times: [],
          desc: {
            it: "La barca solo per il tuo gruppo: €550 per le tre ore; il ritiro costa €5 in più a persona. Il prezzo è della barca intera, non a persona: scrivici quante siete e a che ora vorreste partire.",
            en: "The boat just for your group: €550 for the three hours; pick-up is €5 extra per person. The price is for the whole boat, not per person: tell us how many you are and what time you would like to leave.",
            es: "El barco solo para tu grupo: 550 € por las tres horas; la recogida cuesta 5 € más por persona. El precio es del barco entero, no por persona: escríbenos cuántos sois y a qué hora queréis salir.",
            fr: "Le bateau rien que pour votre groupe : €550 pour les trois heures ; la prise en charge coûte €5 de plus par personne. Le prix est pour tout le bateau, pas par personne : dites-nous combien vous êtes et à quelle heure vous voudriez partir.",
            de: "Das Boot nur für Ihre Gruppe: €550 für die drei Stunden; die Abholung kostet €5 mehr pro Person. Der Preis gilt für das ganze Boot, nicht pro Person: Sagen Sie uns, wie viele Sie sind und wann Sie losfahren möchten."
          }
        }
      ]
    },
    itinerary: [
      {
        text: {
          it: "Navigazione lungo la costa sud, con le scogliere e le grotte che si vedono solo dal mare, in cerca di delfini e balene.",
          en: "Sailing along the south coast, past cliffs and caves you can only see from the water, looking for dolphins and whales.",
          es: "Navegación por la costa sur, con los acantilados y las cuevas que solo se ven desde el mar, buscando delfines y ballenas.",
          fr: "Navigation le long de la côte sud, entre falaises et grottes que l'on ne voit que depuis la mer, à la recherche des dauphins et des baleines.",
          de: "Fahrt entlang der Südküste, vorbei an Klippen und Höhlen, die man nur vom Wasser aus sieht, auf der Suche nach Delfinen und Walen."
        }
      },
      {
        text: {
          it: "A metà giro la sosta in una baia riparata, dove si fa il bagno; a bordo lo spuntino e le bevande.",
          en: "Halfway through, a stop in a sheltered bay for a swim; snack and drinks on board.",
          es: "A mitad de recorrido, parada en una bahía resguardada para bañarse; tentempié y bebidas a bordo.",
          fr: "À mi-parcours, un arrêt dans une baie abritée pour se baigner ; en-cas et boissons à bord.",
          de: "Auf halber Strecke ein Stopp in einer geschützten Bucht zum Baden; Snack und Getränke an Bord."
        }
      },
      {
        text: {
          it: "Rientro breve e tranquillo verso il porto.",
          en: "A short, relaxed return to the harbour.",
          es: "Vuelta corta y tranquila al puerto.",
          fr: "Un retour au port court et tranquille.",
          de: "Eine kurze, entspannte Rückfahrt zum Hafen."
        }
      }
    ],
    notes: [
      {
        it: "Con il ritiro il pulmino passa circa 30 minuti prima della partenza: l'orario esatto te lo confermiamo insieme alla prenotazione.",
        en: "With pick-up, the minibus comes by about 30 minutes before departure: we confirm the exact time along with the booking.",
        es: "Con la recogida, la furgoneta pasa unos 30 minutos antes de la salida: la hora exacta te la confirmamos junto con la reserva.",
        fr: "Avec la prise en charge, le minibus passe environ 30 minutes avant le départ : nous confirmons l'heure exacte avec la réservation.",
        de: "Mit Abholung kommt der Minibus etwa 30 Minuten vor der Abfahrt: Die genaue Uhrzeit bestätigen wir mit der Buchung."
      },
      {
        it: "La barca ha due ponti, più posti dove stare all'ombra o al sole, e la toilette a bordo.",
        en: "The boat has two decks, several places to sit in the shade or in the sun, and a toilet on board.",
        es: "El barco tiene dos cubiertas, varios sitios para estar a la sombra o al sol, y aseo a bordo.",
        fr: "Le bateau a deux ponts, plusieurs endroits pour s'asseoir à l'ombre ou au soleil, et des toilettes à bord.",
        de: "Das Boot hat zwei Decks, mehrere Plätze im Schatten oder in der Sonne und eine Toilette an Bord."
      },
      {
        it: "Delfini e balene si incontrano spesso lungo questa costa, ma sono animali liberi: nessuno può prometterteli.",
        en: "Dolphins and whales are often met along this coast, but they are wild animals: nobody can promise them.",
        es: "Delfines y ballenas se encuentran a menudo en esta costa, pero son animales libres: nadie puede prometértelos.",
        fr: "On croise souvent dauphins et baleines le long de cette côte, mais ce sont des animaux sauvages : personne ne peut les promettre.",
        de: "Delfine und Wale trifft man an dieser Küste oft, aber es sind wilde Tiere: Niemand kann sie versprechen."
      },
      {
        it: "Porta costume, asciugamano e crema solare.",
        en: "Bring swimwear, a towel and sun cream.",
        es: "Trae bañador, toalla y crema solar.",
        fr: "Apportez maillot de bain, serviette et crème solaire.",
        de: "Bringen Sie Badesachen, Handtuch und Sonnencreme mit."
      }
    ],
    desc: {
      it: "Tre ore lungo la costa sud di Tenerife su un cruiser a due ponti, senza fretta. Si costeggiano scogliere e grotte che dalla strada non si vedono, si cercano delfini e balene, e a metà giro ci si ferma in una baia riparata per il bagno, con uno spuntino e le bevande a bordo. L'equipaggio spiega tutto e risponde alle domande in spagnolo, inglese e italiano. Se ti serve, veniamo a prenderti in hotel nel sud dell'isola.",
      en: "Three hours along the south coast of Tenerife on a two-deck cruiser, with no rush. You follow cliffs and caves you cannot see from the road, look for dolphins and whales, and halfway through you stop in a sheltered bay for a swim, with a snack and drinks on board. The crew explains everything and answers questions in Spanish, English and Italian. If you need it, we pick you up at your hotel in the south of the island.",
      es: "Tres horas por la costa sur de Tenerife en un crucero de dos cubiertas, sin prisa. Se bordean acantilados y cuevas que desde la carretera no se ven, se buscan delfines y ballenas, y a mitad de recorrido se para en una bahía resguardada para bañarse, con un tentempié y bebidas a bordo. La tripulación lo explica todo y responde a las preguntas en español, inglés e italiano. Si lo necesitas, te recogemos en tu hotel del sur de la isla.",
      fr: "Trois heures le long de la côte sud de Tenerife sur un bateau à deux ponts, sans se presser. On longe des falaises et des grottes invisibles depuis la route, on cherche dauphins et baleines, et à mi-parcours on s'arrête dans une baie abritée pour se baigner, avec un en-cas et des boissons à bord. L'équipage explique tout et répond aux questions en espagnol, anglais et italien. Si besoin, nous passons vous prendre à votre hôtel dans le sud de l'île.",
      de: "Drei Stunden entlang der Südküste Teneriffas auf einem Boot mit zwei Decks, ganz ohne Eile. Sie folgen Klippen und Höhlen, die man von der Straße aus nicht sieht, suchen Delfine und Wale und halten auf halber Strecke in einer geschützten Bucht zum Baden, mit Snack und Getränken an Bord. Die Crew erklärt alles und beantwortet Fragen auf Spanisch, Englisch und Italienisch. Wenn nötig, holen wir Sie im Süden der Insel am Hotel ab."
    },
    image: "luxury-cruiser.webp",
    gallery: ["luxury-cruiser-2.webp", "luxury-cruiser-3.webp", "luxury-cruiser-4.webp"],
    published: true
  },
  {
    id: "skyline-cruiser",
    // Il nome della barca non sta nel titolo (proprietario, 28 ottobre 2026):
    // il cliente legge che giro e', nella sua lingua. Sta in `nomi`, per i
    // venditori e i ticket.
    title: { it: "Motoryacht con i delfini", en: "Motor Yacht Dolphin Trip", es: "Yate a motor con delfines", fr: "Yacht à moteur à la rencontre des dauphins", de: "Motorjacht-Delfintour" },
    nomi: ["Skyline Cruiser", "Skyline"],
    category: "mare-barche",
    zone: "Puerto Colón",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["mezza"],
    times: ["09:45", "13:15", "16:20"],
    priceFrom: 65,
    privateOption: "skyline-cruiser-charter",
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
          es: "Navegación mar adentro, hasta tres millas de la costa, buscando delfines y ballenas.",
          fr: "Navigation au large, jusqu'à trois milles de la côte, à la recherche des dauphins et des baleines.",
          de: "Fahrt aufs offene Meer, bis zu drei Meilen vor der Küste, auf der Suche nach Delfinen und Walen."
        }
      },
      {
        text: {
          it: "Sosta bagno in una baia riparata, con l'attrezzatura da snorkeling a bordo.",
          en: "A swim stop in a sheltered bay, with snorkelling gear on board.",
          es: "Parada de baño en una bahía resguardada, con equipo de snorkel a bordo.",
          fr: "Un arrêt baignade dans une baie abritée, avec matériel de snorkeling à bord.",
          de: "Ein Badestopp in einer geschützten Bucht, mit Schnorchelausrüstung an Bord."
        }
      },
      {
        text: {
          it: "Rientro costiero, con vista sulle grotte hippie e le scogliere vulcaniche.",
          en: "A coastal return, passing the hippie caves and volcanic cliffs.",
          es: "Vuelta bordeando la costa, con vistas a las cuevas hippies y los acantilados volcánicos.",
          fr: "Un retour le long de la côte, devant les grottes des hippies et les falaises volcaniques.",
          de: "Rückfahrt entlang der Küste, vorbei an den Hippie-Höhlen und den Vulkanklippen."
        }
      }
    ],
    notes: [
      {
        it: "Presentati al porto almeno 30 minuti prima della partenza.",
        en: "Get to the harbour at least 30 minutes before departure.",
        es: "Llega al puerto al menos 30 minutos antes de la salida.",
        fr: "Arrivez au port au moins 30 minutes avant le départ.",
        de: "Seien Sie mindestens 30 Minuten vor der Abfahrt am Hafen."
      },
      {
        it: "A bordo: tortilla, pizza, salsicce, formaggio, pomodorini conditi, frutta secca e frutta fresca; da bere acqua, bibite, birra, vino e cava.",
        en: "On board: tortilla, pizza, sausages, cheese, dressed cherry tomatoes, dried fruit and fresh fruit; to drink, water, soft drinks, beer, wine and cava.",
        es: "A bordo: tortilla, pizza, salchichas, queso, tomates cherry aliñados, frutos secos y fruta fresca; para beber, agua, refrescos, cerveza, vino y cava.",
        fr: "À bord : tortilla, pizza, saucisses, fromage, tomates cerises assaisonnées, fruits secs et fruits frais ; à boire, eau, sodas, bière, vin et cava.",
        de: "An Bord: Tortilla, Pizza, Würstchen, Käse, angemachte Kirschtomaten, Trockenobst und frisches Obst; zu trinken Wasser, Softdrinks, Bier, Wein und Cava."
      },
      {
        it: "Su richiesta, con un po' di preavviso, ci sono menu alternativi.",
        en: "Alternative menus are available on request, with a little notice.",
        es: "Bajo petición, con un poco de antelación, hay menús alternativos.",
        fr: "Des menus différents sont possibles sur demande, en prévenant un peu à l'avance.",
        de: "Andere Menüs gibt es auf Anfrage, mit etwas Vorlauf."
      },
      {
        it: "Porta costume, asciugamano, crema solare, occhiali da sole e una giacca leggera.",
        en: "Bring swimwear, a towel, sunscreen, sunglasses and a light jacket.",
        es: "Trae bañador, toalla, crema solar, gafas de sol y una chaqueta ligera.",
        fr: "Apportez maillot de bain, serviette, crème solaire, lunettes de soleil et une veste légère.",
        de: "Bringen Sie Badesachen, Handtuch, Sonnencreme, Sonnenbrille und eine leichte Jacke mit."
      }
    ],
    desc: {
      it: "Tre ore a bordo di un motoryacht Fairline di quasi 13 metri, fino a 12 persone. Si esce al largo in cerca di delfini e balene, poi la sosta bagno con lo snorkeling in una baia riparata, e il rientro costeggiando le grotte hippie e le scogliere vulcaniche. A bordo capitano ed equipaggio, snack e bevande comprese.",
      en: "Three hours aboard a Fairline motor yacht just under 13 metres long, up to 12 people. You head offshore looking for dolphins and whales, then a swim stop with snorkelling in a sheltered bay, and a coastal return past the hippie caves and volcanic cliffs. On board: captain and crew, with snacks and drinks included.",
      es: "Tres horas a bordo de un yate a motor Fairline de casi 13 metros, hasta 12 personas. Se navega mar adentro buscando delfines y ballenas, luego la parada de baño con snorkel en una bahía resguardada, y la vuelta bordeando la costa junto a las cuevas hippies y los acantilados volcánicos. A bordo: capitán y tripulación, con aperitivos y bebidas incluidas.",
      fr: "Trois heures à bord d'un yacht à moteur Fairline d'un peu moins de 13 mètres, jusqu'à 12 personnes. On part au large à la recherche des dauphins et des baleines, puis un arrêt baignade avec snorkeling dans une baie abritée, et un retour le long de la côte devant les grottes des hippies et les falaises volcaniques. À bord : capitaine et équipage, en-cas et boissons compris.",
      de: "Drei Stunden an Bord einer knapp 13 Meter langen Fairline-Motorjacht, bis zu 12 Personen. Es geht aufs offene Meer auf der Suche nach Delfinen und Walen, dann ein Badestopp mit Schnorcheln in einer geschützten Bucht und die Rückfahrt entlang der Küste, vorbei an den Hippie-Höhlen und Vulkanklippen. An Bord: Kapitän und Crew, Snacks und Getränke inklusive."
    },
    image: "skyline-cruiser.jpg",
    gallery: ["skyline-cruiser-2.webp", "skyline-cruiser-3.webp", "skyline-cruiser-4.webp"],
    published: true
  },
  {
    id: "ragnarok",
    // Il nome della barca non sta nel titolo (proprietario, 28 ottobre 2026):
    // il cliente legge che giro e', nella sua lingua. Sta in `nomi`, per i
    // venditori e i ticket.
    title: { it: "Barca vichinga", en: "Viking Boat Tour", es: "Barco vikingo", fr: "Bateau viking", de: "Wikingerboot-Tour" },
    // Anche "Ragnarock", come lo scrivono sul ticket (Pat, 1595).
    nomi: ["Ragnarok", "Ragnarock"],
    category: "mare-barche",
    zone: "Los Cristianos",
    duration: { it: "2 o 3 ore", en: "2 or 3 hours", es: "2 o 3 horas", fr: "2 ou 3 heures", de: "2 oder 3 Stunden" },
    zoneGroups: ["los-cristianos"],
    durationGroups: ["breve", "mezza"],
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
      label: { it: "Durata", en: "Duration", es: "Duración", fr: "Durée", de: "Dauer" },
      choices: [
        {
          label: { it: "2 ore", en: "2 hours", es: "2 horas", fr: "2 heures", de: "2 Stunden" },
          priceAdult: 25,
          priceChild: 20,
          days: ["lun"],
          times: ["10:30", "12:30", "14:30"],
          desc: {
            it: "Il giro corto, in cerca di balene pilota e tursiopi al largo di Los Cristianos. Lunedì, partenze alle 10:30, 12:30 e 14:30.",
            en: "The short trip, looking for pilot whales and bottlenose dolphins off Los Cristianos. Mondays, leaving at 10:30, 12:30 and 14:30.",
            es: "La salida corta, en busca de calderones y delfines mulares frente a Los Cristianos. Lunes, salidas a las 10:30, 12:30 y 14:30.",
            fr: "La sortie courte, à la recherche des globicéphales et des grands dauphins au large de Los Cristianos. Le lundi, départs à 10:30, 12:30 et 14:30.",
            de: "Die kurze Tour, auf der Suche nach Grindwalen und Großen Tümmlern vor Los Cristianos. Montags, Abfahrten um 10:30, 12:30 und 14:30."
          }
        },
        {
          label: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
          priceAdult: 38,
          priceChild: 25,
          days: ["mar", "gio", "sab"],
          times: ["13:00"],
          desc: {
            it: "Lo stesso giro con più tempo al largo, in cerca di balene pilota e tursiopi. Martedì, giovedì e sabato, partenza alle 13:00.",
            en: "The same trip with more time offshore, looking for pilot whales and bottlenose dolphins. Tuesdays, Thursdays and Saturdays, leaving at 13:00.",
            es: "La misma salida con más tiempo mar adentro, en busca de calderones y delfines mulares. Martes, jueves y sábado, salida a las 13:00.",
            fr: "La même sortie avec plus de temps au large, à la recherche des globicéphales et des grands dauphins. Mardi, jeudi et samedi, départ à 13:00.",
            de: "Dieselbe Tour mit mehr Zeit auf dem Meer, auf der Suche nach Grindwalen und Großen Tümmlern. Dienstag, Donnerstag und Samstag, Abfahrt um 13:00."
          }
        }
      ]
    },
    family: true,
    desc: {
      it: "Una barca a tema vichingo che parte da Los Cristianos per andare a cercare balene pilota e tursiopi al largo. L'equipaggio veste i panni dei vichinghi, fra spettacoli a tema, giochi a bordo e la possibilità di provare l'armatura vichinga: un giro pensato anche per chi viaggia con bambini.",
      en: "A Viking-themed boat leaving from Los Cristianos to look for pilot whales and bottlenose dolphins offshore. The crew dresses up as Vikings, with themed shows, games on board and the chance to try on Viking gear: a trip built with families in mind too.",
      es: "Un barco de temática vikinga que sale de Los Cristianos para buscar calderones y delfines mulares mar adentro. La tripulación se viste de vikingos, con espectáculos temáticos, juegos a bordo y la posibilidad de probarse el equipo vikingo: una salida pensada también para quien viaja con niños.",
      fr: "Un bateau sur le thème des Vikings qui part de Los Cristianos à la recherche des globicéphales et des grands dauphins au large. L'équipage se déguise en Vikings, avec des animations à thème, des jeux à bord et la possibilité d'essayer l'équipement viking : une sortie pensée aussi pour les familles.",
      de: "Ein Boot im Wikinger-Stil ab Los Cristianos, auf der Suche nach Grindwalen und Großen Tümmlern auf dem offenen Meer. Die Crew verkleidet sich als Wikinger, mit Themenshows, Spielen an Bord und der Möglichkeit, Wikinger-Ausrüstung anzuprobieren: eine Tour, die auch an Familien denkt."
    },
    notes: [
      {
        it: "Ritrovo nella Zona Excursiones A del porto di Los Cristianos, dove c'è anche un parcheggio pubblico a pagamento. Arriva tra i 10 e i 20 minuti prima della partenza.",
        en: "Meeting point in the Zona Excursiones A at Los Cristianos harbour, where there is also paid public parking. Get there 10 to 20 minutes before departure.",
        es: "Punto de encuentro en la Zona Excursiones A del puerto de Los Cristianos, donde también hay aparcamiento público de pago. Llega entre 10 y 20 minutos antes de la salida.",
        fr: "Rendez-vous dans la Zona Excursiones A du port de Los Cristianos, où il y a aussi un parking public payant. Arrivez de 10 à 20 minutes avant le départ.",
        de: "Treffpunkt in der Zona Excursiones A im Hafen von Los Cristianos, wo es auch einen gebührenpflichtigen öffentlichen Parkplatz gibt. Seien Sie 10 bis 20 Minuten vor der Abfahrt da."
      },
      {
        it: "A bordo ci sono un bar-ristorante, i servizi igienici, posti a sedere in diverse zone e aree accessibili.",
        en: "On board there is a bar-restaurant, toilets, seating spread across different areas and accessible spaces.",
        es: "A bordo hay un bar-restaurante, aseos, asientos repartidos en distintas zonas y espacios accesibles.",
        fr: "À bord, il y a un bar-restaurant, des toilettes, des places assises réparties dans plusieurs espaces et des zones accessibles.",
        de: "An Bord gibt es eine Bar mit Restaurant, Toiletten, Sitzplätze in verschiedenen Bereichen und barrierefreie Bereiche."
      },
      {
        it: "Con mare mosso o maltempo l'operatore organizza un piano alternativo.",
        en: "In rough seas or bad weather the operator arranges an alternative plan.",
        es: "Con mar agitado o mal tiempo el operador organiza un plan alternativo.",
        fr: "Par mer agitée ou mauvais temps, l'opérateur organise un plan alternatif.",
        de: "Bei rauer See oder schlechtem Wetter organisiert der Anbieter eine Alternative."
      }
    ],
    image: "ragnarok.webp",
    gallery: ["ragnarok-2.webp", "ragnarok-3.webp", "ragnarok-4.webp", "ragnarok-5.webp"],
    // dove ci si presenta: era gia' scritto nei consigli (15 ottobre 2026)
    ritrovo: { it: "Porto di Los Cristianos, Zona Excursiones A", en: "Los Cristianos harbour, Zona Excursiones A", es: "Puerto de Los Cristianos, Zona Excursiones A", fr: "Port de Los Cristianos, Zona Excursiones A", de: "Hafen Los Cristianos, Zona Excursiones A" },
    published: true
  },

  // ─── TEIDE E NATURA ───────────────────────────────────────────────────────
  {
    id: "teide-national-park",
    // Conta sempre come card (proprietario, 11 ottobre 2026: le escursioni
    // di Island Excursions).
    pagamento: "card",
    title: "Teide National Park",
    category: "teide-natura",
    zone: { it: "Tenerife Sud", en: "South Tenerife", es: "Tenerife sur", fr: "Sud de Tenerife", de: "Süden von Teneriffa" },
    duration: { it: "6-8 ore circa", en: "About 6-8 hours", es: "6-8 horas aprox.", fr: "Environ 6-8 heures", de: "Etwa 6-8 Stunden" },
    zoneGroups: ["teide-nord"],
    durationGroups: ["intera"],
    priceFrom: 39,
    fixedPrice: true,
    // Offerta a tempo decisa dal proprietario: si vende a 39 fino al 31
    // ottobre, poi il prezzo diventa 45. Il 45 NON e' un prezzo gia' applicato
    // in passato: e' quello futuro (detto esplicitamente il 7 settembre 2026).
    // E' anche il motivo per cui questo barrato e' il caso che la direttiva
    // Omnibus guarda — vedi la nota su `priceList` in testa al file.
    // Da non confondere col barrato del rivenditore: la pagina CanaryVIP
    // dava 50 -> 39, e quello non si copia mai.
    priceList: 45,
    offerUntil: "2026-10-31",
    priceAdult: 39,
    priceChild: 27,
    // Zero vero, non un "non lo sappiamo": il listino del fornitore scrive
    // "Bebes 0€", il posto in pullman per i piu' piccoli non si paga.
    priceInfant: 0,
    // Il listino da' solo "Ninos (2-11)". Il 12+ degli adulti e lo 0-1 dei
    // bebe' sono gli unici completamenti che non lasciano buchi fra le tre
    // righe: sopra gli 11 e sotto i 2 non c'e' altra fascia.
    ages: { adult: "12+", child: "2-11", infant: "0-1" },
    // Quattro giorni, **martedi' compreso**, confermati dall'ufficio il 7
    // settembre 2026. Ci siamo passati sopra due volte: prima erano stati
    // corretti in tre, poi rimessi a quattro. Il martedi' c'e': se lo trovi
    // tolto, e' un errore, non una correzione.
    days: ["mar", "mer", "sab", "dom"],
    // Confermate dall'ufficio: sono le cinque solite. Il segnale sta anche sul
    // foglio del fornitore, nel suo campo Observaciones ("Todos los idiomas").
    languages: LINGUE_TOUR,
    // Il biglietto della funivia NON e' incluso: si compra sul posto ed e'
    // facoltativo, quindi niente `ticket` qui.
    included: ["transfer", "guide"],
    // Senza orari: il fornitore da' le tappe in ordine ma non l'ora, e il
    // ritiro cambia da hotel a hotel.
    itinerary: [
      { text: { it: "Ritiro in hotel e salita verso il parco",
                en: "Hotel pickup and the climb up towards the park",
                es: "Recogida en el hotel y subida hacia el parque",
                fr: "Prise en charge à l'hôtel et montée vers le parc",
                de: "Abholung am Hotel und Fahrt hinauf zum Park" } },
      { text: { it: "Sosta a Vilaflor, il paese più alto della Spagna, in mezzo ai pini",
                en: "Stop at Vilaflor, the highest village in Spain, in the middle of the pine woods",
                es: "Parada en Vilaflor, el pueblo más alto de España, entre los pinos",
                fr: "Arrêt à Vilaflor, le village le plus haut d'Espagne, au milieu des pinèdes",
                de: "Stopp in Vilaflor, dem höchstgelegenen Dorf Spaniens, mitten in den Kiefernwäldern" } },
      { text: { it: "Roques de García: si cammina fra le rocce e le colate di lava, dentro la caldera delle Cañadas",
                en: "Roques de García: a walk among the rocks and the lava flows, inside the Cañadas caldera",
                es: "Roques de García: se camina entre las rocas y las coladas de lava, dentro de la caldera de Las Cañadas",
                fr: "Roques de García : promenade entre les rochers et les coulées de lave, dans la caldeira de Las Cañadas",
                de: "Roques de García: ein Spaziergang zwischen Felsen und Lavaströmen, im Krater von Las Cañadas" } },
      { text: { it: "Sosta alla funivia del Teide, con il tempo per salire in cima a chi vuole",
                en: "Stop at the Teide cable car, with time to go up to the top for those who want to",
                es: "Parada en el teleférico del Teide, con tiempo para subir a la cumbre a quien quiera",
                fr: "Arrêt au téléphérique du Teide, avec du temps pour monter au sommet pour ceux qui le souhaitent",
                de: "Stopp an der Teide-Seilbahn, mit Zeit, um auf den Gipfel zu fahren, wer möchte" } },
      { text: { it: "Rientro in hotel scendendo per il paese di Chío",
                en: "Back to the hotel, coming down through the village of Chío",
                es: "Vuelta al hotel bajando por el pueblo de Chío",
                fr: "Retour à l'hôtel, en redescendant par le village de Chío",
                de: "Rückfahrt zum Hotel, hinunter durch das Dorf Chío" } }
    ],
    notes: [
      { it: "La salita in funivia è facoltativa e non è compresa nel prezzo: il biglietto si compra sul posto.",
        en: "Going up by cable car is optional and not included in the price: you buy the ticket there.",
        es: "La subida en teleférico es opcional y no está incluida en el precio: el billete se compra allí.",
        fr: "La montée en téléphérique est facultative et n'est pas comprise dans le prix : le billet s'achète sur place.",
        de: "Die Fahrt mit der Seilbahn ist optional und nicht im Preis inbegriffen: Das Ticket kauft man vor Ort." },
      { it: "A 2.000 metri fa freddo anche in piena estate: porta una felpa o una giacca. E la macchina fotografica.",
        en: "At 2,000 metres it's cold even in high summer: bring a sweatshirt or a jacket. And your camera.",
        es: "A 2.000 metros hace frío incluso en pleno verano: lleva una sudadera o una chaqueta. Y la cámara.",
        fr: "À 2 000 mètres, il fait froid même en plein été : apportez un sweat ou une veste. Et votre appareil photo.",
        de: "Auf 2.000 Metern ist es selbst im Hochsommer kalt: Bringen Sie einen Pullover oder eine Jacke mit. Und Ihre Kamera." },
      { it: "Il pranzo non è incluso.",
        en: "Lunch is not included.",
        es: "El almuerzo no está incluido.",
        fr: "Le déjeuner n'est pas compris.",
        de: "Das Mittagessen ist nicht inklusive." },
      // I giorni sono un blocco: la finestra non lascia mandare una richiesta
      // per un giorno in cui non si parte. Questa nota fa il mestiere che il
      // blocco non puo fare — dire che quei giorni non sono incisi nella
      // pietra, perche cambiano con la lingua della guida. Una riga sola: nel
      // riquadro dei consigli una nota lunga si legge come un paragrafo.
      { it: "I giorni possono cambiare secondo la lingua della guida.",
        en: "The days can change depending on the language of the guide.",
        es: "Los días pueden cambiar según el idioma del guía.",
        fr: "Les jours peuvent changer selon la langue du guide.",
        de: "Die Tage können sich je nach Sprache des Guides ändern." }
    ],
    family: true,
    desc: {
      it: "Giornata nel Parco Nazionale del Teide: Vilaflor, i Roques de García e la sosta alla funivia, con ritiro in hotel.",
      en: "A day in Teide National Park: Vilaflor, the Roques de García and the cable car stop, with hotel pickup.",
      es: "Un día en el Parque Nacional del Teide: Vilaflor, los Roques de García y la parada del teleférico, con recogida en el hotel.",
      fr: "Une journée dans le parc national du Teide : Vilaflor, les Roques de García et l'arrêt au téléphérique, avec prise en charge à l'hôtel.",
      de: "Ein Tag im Teide-Nationalpark: Vilaflor, die Roques de García und der Stopp an der Seilbahn, mit Abholung am Hotel."
    },
    image: "teide-national-park.webp",
    published: true
  },
  // ─── Trekking e bici: due schede, non piu' una ────────────────────────────
  // Fino a v280 "Trekking e bici" era **una scheda segnaposto sola** che
  // prometteva due cose diverse ("Giornata fra sentieri e bicicletta"), e le
  // tre camminate di Canaventura stavano fuori, una per scheda. Scelta del
  // proprietario (11 settembre 2026): la scheda si chiama **Trekking** e tiene
  // i tre cammini come varianti, la **bici** diventa una scheda sua.
  //
  // Il motivo per cui i tre cammini stanno insieme e non separati: sono lo
  // stesso prodotto comprato tre volte — stesso fornitore, stesso prezzo,
  // stessa formula (bus dal sud, guida di montagna, un giorno fisso a
  // settimana). Quello che cambia e' **dove si cammina**, ed e' esattamente la
  // domanda a cui servono i bottoni delle varianti. Tre schede uguali in fila,
  // tutte "da 59 €", facevano scegliere fra tre righe identiche.
  //
  // L'id resta `trekking-bici` anche se la scheda adesso e' solo il trekking:
  // gli id non si cambiano, si romperebbero i link gia' salvati e le richieste
  // ferme in localStorage. Stessa regola di `santa-cruz-taganana`.
  {
    id: "trekking-bici",
    title: { it: "Trekking", en: "Hiking", es: "Senderismo", fr: "Randonnée", de: "Wandern" },
    category: "teide-natura",
    // Il bus passa a prendere il cliente dagli alloggi del sud: la partenza e'
    // il sud su tutti e tre i cammini, anche su Camino Real che si cammina a
    // Santiago del Teide e su Anaga che sta all'altro capo dell'isola. Questo
    // campo in pagina si legge "Punto di partenza" — e' lo stesso inciampo
    // gia' fatto sul giro di Icod, dove diceva "Tenerife nord" e dal nord non
    // partiva niente. Dove si cammina sta nelle varianti.
    zone: { it: "Tenerife Sud", en: "South Tenerife", es: "Tenerife sur", fr: "Sud de Tenerife", de: "Süden von Teneriffa" },
    // "Giornata intera" e' giusta, e la domanda era un'altra: in giro si sta
    // tutto il giorno, ma **si cammina** due ore (proprietario, 11 settembre
    // 2026). In v284 avevo tolto la durata credendola falsa; era vera, mancava
    // la riga accanto. Adesso sono due: questa dice quanto dura la giornata,
    // `activityDuration` dentro ogni variante dice quanto dura il cammino.
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo", fr: "Journée entière", de: "Ganztags" },
    zoneGroups: ["teide-nord"],
    durationGroups: ["intera"],
    // Nessun orario fisso: l'ora si decide insieme al cliente (proprietario,
    // 16 ottobre 2026). [] = solo "Da concordare", senza fasce segnaposto.
    times: [],
    // Il nome della seconda riga. Sta sulla scheda e non nelle varianti perche'
    // e' lo stesso per tutti e tre: quello che cambia e' il numero.
    activityLabel: { it: "Tempo di cammino", en: "Walking time", es: "Tiempo de caminata", fr: "Temps de marche", de: "Gehzeit" },
    priceFrom: 59,
    // I prezzi stanno **sia qui sia dentro ogni variante**, ed e' voluto: qui
    // perche' tutti e tre i cammini costano uguale e le righe "Adulti €59" e
    // "Bambini €29,50" devono vedersi in "In breve" prima ancora di scegliere;
    // dentro le varianti perche' il totale, appena una variante e' scelta,
    // guarda **solo** il suo `priceAdult` e non ripiega su quello della scheda
    // (escursioni.js, riga ~219). Senza, chi preme un bottone vedrebbe sparire
    // il totale.
    priceAdult: 59,
    priceChild: 29.5,
    // **Bambini fino a 11 anni, confermato dal proprietario l'11 settembre
    // 2026.** Erano dedotte dalle due sole fasce del fornitore, adesso sono
    // confermate: 12+ e 0-11, che combaciano senza buchi.
    // Niente `priceInfant`, ed e' la conseguenza della conferma: due fasce
    // sole vogliono dire che **chiunque abbia meno di 12 anni paga il prezzo
    // bambino**, neonati compresi. Non c'e' una fascia gratis da scrivere, e
    // il campo assente e' proprio questo — non "non lo sappiamo".
    // Resta da chiedere una cosa sola, ed e' un'altra: se sotto una certa eta'
    // sul sentiero non si sale proprio. Quella non e' un prezzo, e' una nota.
    ages: { adult: "12+", child: "0-11" },
    // L'unione dei tre giorni: ogni cammino ne ha uno solo, e la sua variante
    // lo restringe (escursioni.js, `giorniDi`, riga ~24). Qui serve perche'
    // prima di scegliere il cammino il blocco non deve rifiutare un giorno
    // buono. **mer e' mercoledi'.**
    days: ["lun", "mer", "gio"],
    // Valgono per tutti e tre. Acqua e pranzo al sacco NON sono compresi:
    // stanno nelle note, perche' "Cosa e' incluso" dice quello che c'e'.
    included: ["guide", "transfer"],
    options: {
      label: { it: "Quale cammino", en: "Which walk", es: "Qué recorrido", fr: "Quelle randonnée", de: "Welche Wanderung" },
      choices: [
        // I nomi dei percorsi sono quelli del fornitore e restano uguali in
        // tutte e cinque le lingue, come i titoli: quando la richiesta arriva su
        // WhatsApp, in ufficio si ritrova il nome esatto da cercare.
        { label: "Teide Light",
          priceAdult: 59,
          priceChild: 29.5,
          days: ["gio"],
          // Notazione compatta, uguale in tutte e cinque le lingue: "h" si legge
          // ovunque, e in forma distesa ("3 ore e mezza – 4 ore") il valore
          // finiva sotto il pallino della chat, che non si sposta.
          activityDuration: "2h",
          desc: {
            it: "Il giovedì, nel Parco Nazionale del Teide: si cammina in quota fra i paesaggi vulcanici, con 175 metri di dislivello e difficoltà 2 su 6. È il più facile dei tre.",
            en: "Thursdays, in Teide National Park: walking at altitude through the volcanic landscapes, with 175 metres of ascent and difficulty 2 out of 6. The easiest of the three.",
            es: "Los jueves, en el Parque Nacional del Teide: se camina en altura entre los paisajes volcánicos, con 175 metros de desnivel y dificultad 2 sobre 6. El más fácil de los tres.",
            fr: "Le jeudi, dans le parc national du Teide : marche en altitude à travers les paysages volcaniques, avec 175 mètres de dénivelé et une difficulté de 2 sur 6. La plus facile des trois.",
            de: "Donnerstags, im Teide-Nationalpark: Wandern in der Höhe durch Vulkanlandschaften, mit 175 Höhenmetern und Schwierigkeit 2 von 6. Die leichteste der drei."
          } },
        { label: "Camino Real",
          priceAdult: 59,
          priceChild: 29.5,
          days: ["mer"],
          activityDuration: "3h30 – 4h",
          desc: {
            it: "Il mercoledì, sull'antico camino real che parte da Santiago del Teide, dove arriva il bus: 350 metri di dislivello e difficoltà 3 su 6. È il più impegnativo dei tre.",
            en: "Wednesdays, on the old royal path out of Santiago del Teide, where the bus drops you off: 350 metres of ascent and difficulty 3 out of 6. The most demanding of the three.",
            es: "Los miércoles, por el antiguo camino real que sale de Santiago del Teide, adonde llega el autobús: 350 metros de desnivel y dificultad 3 sobre 6. El más exigente de los tres.",
            fr: "Le mercredi, sur l'ancien chemin royal au départ de Santiago del Teide, où le bus vous dépose : 350 mètres de dénivelé et une difficulté de 3 sur 6. La plus exigeante des trois.",
            de: "Mittwochs, auf dem alten Königsweg ab Santiago del Teide, wo der Bus Sie absetzt: 350 Höhenmeter und Schwierigkeit 3 von 6. Die anspruchsvollste der drei."
          } },
        { label: "La Laguna & Anaga",
          priceAdult: 59,
          priceChild: 29.5,
          days: ["lun"],
          activityDuration: "1h30 – 2h",
          desc: {
            it: "Il lunedì, fra La Laguna — città Patrimonio UNESCO — e il Parco Rurale di Anaga, Riserva della Biosfera: 300 metri di dislivello e difficoltà 2 su 6. È il più corto dei tre.",
            en: "Mondays, between UNESCO-listed La Laguna and the Anaga Rural Park, a Biosphere Reserve: 300 metres of ascent and difficulty 2 out of 6. The shortest of the three.",
            es: "Los lunes, entre La Laguna — ciudad Patrimonio de la UNESCO — y el Parque Rural de Anaga, Reserva de la Biosfera: 300 metros de desnivel y dificultad 2 sobre 6. El más corto de los tres.",
            fr: "Le lundi, entre La Laguna, classée par l'UNESCO, et le parc rural d'Anaga, réserve de biosphère : 300 mètres de dénivelé et une difficulté de 2 sur 6. La plus courte des trois.",
            de: "Montags, zwischen dem UNESCO-Welterbe La Laguna und dem Landschaftspark Anaga, einem Biosphärenreservat: 300 Höhenmeter und Schwierigkeit 2 von 6. Die kürzeste der drei."
          } }
      ]
    },
    notes: [
      { it: "Acqua e pranzo al sacco non sono compresi: portali con te.",
        en: "Water and a packed lunch are not included: bring them with you.",
        es: "El agua y el picnic no están incluidos: llévalos contigo.",
        fr: "L'eau et le pique-nique ne sont pas compris : apportez-les.",
        de: "Wasser und Lunchpaket sind nicht inklusive: Bringen Sie sie mit." },
      { it: "Scarpe chiuse da camminata. In quota fa più fresco che sulla costa e il tempo cambia in fretta, anche quando al sud c'è il sole: porta una felpa o una giacca leggera.",
        en: "Closed walking shoes. It is cooler up there than on the coast and the weather changes quickly, even when it is sunny in the south: bring a sweatshirt or a light jacket.",
        es: "Calzado cerrado de montaña. En altura hace más fresco que en la costa y el tiempo cambia rápido, aunque en el sur haga sol: lleva una sudadera o una chaqueta ligera.",
        fr: "Chaussures de marche fermées. Là-haut, il fait plus frais que sur la côte et le temps change vite, même quand il fait soleil dans le sud : apportez un sweat ou une veste légère.",
        de: "Geschlossene Wanderschuhe. Oben ist es kühler als an der Küste und das Wetter ändert sich schnell, auch wenn im Süden die Sonne scheint: Bringen Sie einen Pullover oder eine leichte Jacke mit." },
      { it: "Ogni cammino si fa in un giorno solo della settimana: scegli il percorso qui sopra e la data si regola da sola.",
        en: "Each walk runs on one day of the week only: pick the route above and the date adjusts to it.",
        es: "Cada recorrido se hace un solo día de la semana: elige el itinerario arriba y la fecha se ajusta sola.",
        fr: "Chaque randonnée n'a lieu qu'un jour par semaine : choisissez le parcours ci-dessus et la date s'adapte.",
        de: "Jede Wanderung findet nur an einem Wochentag statt: Wählen Sie oben die Route, und das Datum passt sich an." }
    ],
    // `family: true` con una riserva scritta nelle varianti. Due cammini su
    // tre sono corti e facili; il Camino Real con le sue tre ore e mezza-quattro lo
    // dice da se' nella sua riga ("il più impegnativo dei tre"). `family` sta
    // sulla scheda e non sulla variante, quindi il filtro "Con bambini" e' uno
    // solo per tutte e tre: tenerla fuori avrebbe nascosto anche le due facili.
    family: true,
    desc: {
      it: "Tre cammini con guida di montagna, uno per giorno della settimana: il Parco Nazionale del Teide, l'antico camino real di Santiago del Teide e la laurisilva di Anaga con La Laguna. Bus andata e ritorno dagli alloggi del sud.",
      en: "Three guided walks with a mountain guide, one for each day of the week: Teide National Park, the old royal path out of Santiago del Teide, and the Anaga laurel forest with La Laguna. Return bus from accommodation in the south.",
      es: "Tres recorridos con guía de montaña, uno por día de la semana: el Parque Nacional del Teide, el antiguo camino real de Santiago del Teide y la laurisilva de Anaga con La Laguna. Autobús de ida y vuelta desde los alojamientos del sur.",
      fr: "Trois randonnées avec un guide de montagne, une pour chaque jour de la semaine : le parc national du Teide, l'ancien chemin royal au départ de Santiago del Teide, et la forêt de lauriers d'Anaga avec La Laguna. Bus aller-retour depuis les logements du sud.",
      de: "Drei geführte Wanderungen mit einem Bergführer, eine für jeden Wochentag: der Teide-Nationalpark, der alte Königsweg ab Santiago del Teide und der Lorbeerwald von Anaga mit La Laguna. Bus hin und zurück ab den Unterkünften im Süden."
    },
    // Foto ancora da caricare: canaventura.es e il suo CDN sono bloccati dal
    // proxy di rete, come gia' kartingamericas.com, quindi le foto dei tre
    // cammini non si scaricano e non si possono nemmeno guardare. Le deve
    // mandare l'ufficio. `trekking-bici.jpg` non e' rimasta qui: e' un
    // ciclista, ed e' passata alla scheda della bici, che e' il suo soggetto.
    image: "trekking.webp",
    published: true
  },
  {
    // La meta' "bici" della vecchia scheda, staccata nel settembre 2026. Fino
    // al 6 ottobre 2026 era un segnaposto senza prezzi; adesso porta i 16 giri
    // di Cycling in Tenerife, 8 su strada e 8 in mountain bike.
    //
    // Una scheda sola con 16 varianti, come le Immersioni che ne hanno 15:
    // scelta del proprietario (6 ottobre 2026). Il nome del giro resta quello
    // del fornitore, uguale nelle cinque lingue come "Teide Light" sul trekking:
    // quando la richiesta arriva su WhatsApp, l'ufficio cerca quel nome.
    // Tradotta e' solo la parola davanti, Strada o MTB.
    //
    // Le descrizioni dei singoli giri sono riscritte dalle pagine del
    // fornitore, mandate dal proprietario il 6 ottobre 2026.
    id: "bici",
    title: { it: "Bici", en: "Biking", es: "Bici", fr: "Vélo", de: "Radfahren" },
    category: "teide-natura",
    // "Tenerife Sud" dal proprietario (15 ottobre 2026): si passa a prendere in
    // hotel, al sud, come per le gite al Teide. Le ore si concordano con
    // l'ufficio, per sua scelta: times: [] lascia solo "Da concordare".
    zone: { it: "Tenerife Sud", en: "South Tenerife", es: "Tenerife sur", fr: "Sud de Tenerife", de: "Süden von Teneriffa" },
    times: [],
    // Dove si va: la maggior parte dei giri sale al Teide, e Masca e Santiago
    // del Teide stanno dalla parte di Los Gigantes.
    zoneGroups: ["teide-nord", "los-gigantes"],
    // "4/5 hours" su tutti e sedici i giri.
    duration: { it: "4-5 ore", en: "4-5 hours", es: "4-5 horas", fr: "4-5 heures", de: "4-5 Stunden" },
    durationGroups: ["mezza"],
    priceFrom: 110,
    // Solo il prezzo adulti, per scelta del proprietario: il fornitore non da'
    // un prezzo bambini. Niente `ages` e niente `priceInfant`.
    priceAdult: 110,
    options: {
      label: { it: "Quale giro", en: "Which ride", es: "Qué recorrido", fr: "Quelle sortie", de: "Welche Tour" },
      // Sedici giri uno sotto l'altro facevano una pagina lunghissima: i due
      // tipi diventano due pulsanti che si aprono (proprietario, 6 ottobre
      // 2026). Ogni variante dice il suo con `group`, e il nome del gruppo
      // non si ripete piu' davanti al nome del giro.
      groups: [
        { key: "strada",
          label: { it: "Bici da strada", en: "Road bike", es: "Bici de carretera", fr: "Vélo de route", de: "Rennrad" },
          desc: { it: "Otto giri su asfalto, dal Teide alla costa", en: "Eight rides on tarmac, from Teide to the coast", es: "Ocho recorridos por asfalto, del Teide a la costa", fr: "Huit sorties sur route, du Teide à la côte", de: "Acht Touren auf Asphalt, vom Teide bis zur Küste" } },
        { key: "mtb",
          label: { it: "Mountain bike", en: "Mountain bike", es: "Bicicleta de montaña", fr: "VTT", de: "Mountainbike" },
          desc: { it: "Otto giri su sterrato, fra vulcani, pinete e mare", en: "Eight off-road rides, among volcanoes, pine forests and sea", es: "Ocho recorridos por pista, entre volcanes, pinares y mar", fr: "Huit sorties tout-terrain, entre volcans, pinèdes et mer", de: "Acht Offroad-Touren, zwischen Vulkanen, Kiefernwäldern und Meer" } }
      ],
      // Tre giri hanno due prezzi ("110/150", "110/120"): dipendono dalla
      // lunghezza del giro, corto o lungo, e lo spiega la descrizione (pagine
      // del fornitore, 6 ottobre 2026). Il
      // prezzo resta **nell'etichetta**
      // e non in `priceAdult`, come le immersioni a pacchetto: il cliente lo
      // legge sul bottone e il totale della richiesta non si fa, invece di
      // mostrare 110 dove potrebbe essere 150. Niente `price` nemmeno: per i
      // pacchetti vorrebbe dire "prezzo del mezzo", che qui non e'.
      choices: [
        { label: { it: "Mount Teide Challenge West Slope (110/150 €)", en: "Mount Teide Challenge West Slope (€110/150)", es: "Mount Teide Challenge West Slope (110/150 €)", fr: "Mount Teide Challenge versant ouest (€110/150)", de: "Mount Teide Challenge Westhang (€110/150)" },
          group: "strada",
          desc: {
            it: "Dalla costa di Adeje al Teide dal versante ovest: la salita fra le piantagioni di banane verso Guía de Isora, la sosta a Chío e poi 28 km di salita costante, fra il 5 e il 7%, fino al paesaggio lunare del parco. Si torna giù fra le pinete. Due lunghezze: circa 75 km e 1.750 m di dislivello a 110 €, oppure circa 130 km e 3.000 m a 150 €; in e-bike 130 € e 190 €. Difficoltà medio-alta, tutto asfalto.",
            en: "From the Adeje coast up Teide's west side: the climb through the banana plantations towards Guía de Isora, a stop in Chío, then 28 km of steady climbing at 5 to 7% up to the park's lunar landscape. Back down through the pine forests. Two lengths: about 75 km and 1,750 m of climbing for €110, or about 130 km and 3,000 m for €150; by e-bike €130 and €190. Medium to hard, all on tarmac.",
            es: "De la costa de Adeje al Teide por la vertiente oeste: la subida entre plataneras hacia Guía de Isora, la parada en Chío y luego 28 km de subida constante, entre el 5 y el 7%, hasta el paisaje lunar del parque. Se baja entre pinares. Dos distancias: unos 75 km y 1.750 m de desnivel por 110 €, o unos 130 km y 3.000 m por 150 €; en e-bike 130 € y 190 €. Dificultad media-alta, todo asfalto.",
            fr: "De la côte d'Adeje jusqu'au versant ouest du Teide : la montée à travers les bananeraies vers Guía de Isora, un arrêt à Chío, puis 28 km de montée régulière à 5-7 % jusqu'au paysage lunaire du parc. Descente à travers les pinèdes. Deux longueurs : environ 75 km et 1 750 m de dénivelé pour €110, ou environ 130 km et 3 000 m pour €150 ; en vélo électrique €130 et €190. Moyen à difficile, tout sur route.",
            de: "Von der Küste von Adeje auf die Westseite des Teide: der Anstieg durch die Bananenplantagen nach Guía de Isora, ein Stopp in Chío, dann 28 km gleichmäßiger Anstieg mit 5 bis 7 % bis in die Mondlandschaft des Parks. Abfahrt durch die Kiefernwälder. Zwei Längen: etwa 75 km und 1.750 Höhenmeter für €110, oder etwa 130 km und 3.000 m für €150; mit E-Bike €130 und €190. Mittel bis schwer, alles auf Asphalt."
          } },
        { label: { it: "Mount Teide Challenge South Slope (110/120 €)", en: "Mount Teide Challenge South Slope (€110/120)", es: "Mount Teide Challenge South Slope (110/120 €)", fr: "Mount Teide Challenge versant sud (€110/120)", de: "Mount Teide Challenge Südhang (€110/120)" },
          group: "strada",
          desc: {
            it: "Da Adeje si sale dal versante sud: Arona, i vigneti e Vilaflor, il Pino Gordo e venti chilometri di pineta fino ai 2.270 m del belvedere di Boca Tauce, davanti al Teide. Si scende dal lato ovest, per Chío, e il giro si chiude ad anello. Due lunghezze: circa 55 km e 1.000 m di dislivello a 110 €, oppure circa 100 km e 2.500 m a 120 €; in e-bike 130 € e 140 €. Difficoltà medio-alta, tutto asfalto.",
            en: "From Adeje up Teide's south side: Arona, the vineyards and Vilaflor, the Pino Gordo and twenty kilometres of pine forest up to the 2,270 m Boca Tauce viewpoint, facing Teide. Down the west side through Chío, closing the loop. Two lengths: about 55 km and 1,000 m of climbing for €110, or about 100 km and 2,500 m for €120; by e-bike €130 and €140. Medium to hard, all on tarmac.",
            es: "Desde Adeje se sube por la vertiente sur: Arona, los viñedos y Vilaflor, el Pino Gordo y veinte kilómetros de pinar hasta los 2.270 m del mirador de Boca Tauce, frente al Teide. Se baja por el lado oeste, por Chío, cerrando el círculo. Dos distancias: unos 55 km y 1.000 m de desnivel por 110 €, o unos 100 km y 2.500 m por 120 €; en e-bike 130 € y 140 €. Dificultad media-alta, todo asfalto.",
            fr: "D'Adeje jusqu'au versant sud du Teide : Arona, les vignes et Vilaflor, le Pino Gordo et vingt kilomètres de pinède jusqu'au belvédère de Boca Tauce, à 2 270 m, face au Teide. Descente par le versant ouest via Chío, pour boucler la boucle. Deux longueurs : environ 55 km et 1 000 m de dénivelé pour €110, ou environ 100 km et 2 500 m pour €120 ; en vélo électrique €130 et €140. Moyen à difficile, tout sur route.",
            de: "Von Adeje auf die Südseite des Teide: Arona, die Weinberge und Vilaflor, der Pino Gordo und zwanzig Kilometer Kiefernwald bis zum Aussichtspunkt Boca Tauce auf 2.270 m, gegenüber dem Teide. Abfahrt über die Westseite durch Chío, damit schließt sich die Runde. Zwei Längen: etwa 55 km und 1.000 Höhenmeter für €110, oder etwa 100 km und 2.500 m für €120; mit E-Bike €130 und €140. Mittel bis schwer, alles auf Asphalt."
          } },
        { label: "Vilaflor Tour",
          group: "strada",
          priceAdult: 110,
          desc: {
            it: "Da Adeje verso Los Cristianos, la salita di La Camella, il belvedere della Centinela e Granadilla; poi 14 km di salita dolce in pineta fino a Vilaflor, a 1.400 m il paese più alto di Spagna. Pausa al Pino Gordo e discesa per Arona. 67 km, 1.450 m di dislivello, difficoltà media, tutto asfalto. In e-bike 130 €.",
            en: "From Adeje towards Los Cristianos, the La Camella climb, the La Centinela viewpoint and Granadilla; then 14 km of gentle climbing through the pines to Vilaflor, at 1,400 m the highest village in Spain. A break at the Pino Gordo and down via Arona. 67 km, 1,450 m of climbing, medium difficulty, all on tarmac. By e-bike €130.",
            es: "De Adeje hacia Los Cristianos, la subida de La Camella, el mirador de La Centinela y Granadilla; luego 14 km de subida suave entre pinos hasta Vilaflor, a 1.400 m el pueblo más alto de España. Pausa en el Pino Gordo y bajada por Arona. 67 km, 1.450 m de desnivel, dificultad media, todo asfalto. En e-bike 130 €.",
            fr: "D'Adeje vers Los Cristianos, la montée de La Camella, le belvédère de La Centinela et Granadilla ; puis 14 km de montée douce à travers les pins jusqu'à Vilaflor, à 1 400 m, le village le plus haut d'Espagne. Une pause au Pino Gordo et descente par Arona. 67 km, 1 450 m de dénivelé, difficulté moyenne, tout sur route. En vélo électrique €130.",
            de: "Von Adeje Richtung Los Cristianos, der Anstieg von La Camella, der Aussichtspunkt La Centinela und Granadilla; dann 14 km sanfter Anstieg durch die Kiefern bis Vilaflor, auf 1.400 m das höchstgelegene Dorf Spaniens. Eine Pause am Pino Gordo und Abfahrt über Arona. 67 km, 1.450 Höhenmeter, mittlere Schwierigkeit, alles auf Asphalt. Mit E-Bike €130."
          } },
        { label: "Teide Downhill",
          group: "strada",
          priceAdult: 110,
          desc: {
            it: "Quasi tutta discesa: il pulmino porta su a 2.200 m, sul versante ovest del Teide, e da lì si scendono circa 50 km per Chío, Guía de Isora con la pausa caffè e Los Menores, fino alla base del fornitore ad Adeje; il furgone riporta in hotel chi vuole. Facile, va bene anche per chi non pedala spesso: dai 12 anni, con un adulto. In e-bike 130 €; in mountain bike tradizionale, su richiesta, 20 € in più. Il ritiro è compreso entro 5 km dalla base di Adeje: da più lontano lo conferma l'ufficio.",
            en: "Almost all downhill: the minibus takes you up to 2,200 m on Teide's west side, and from there you ride about 50 km down through Chío, Guía de Isora with a coffee break, and Los Menores, to the operator's base in Adeje; the van takes you back to your hotel if you like. Easy, fine even if you rarely ride: from age 12, with an adult. By e-bike €130; on a traditional mountain bike, on request, €20 extra. Pick-up is included within 5 km of the Adeje base: from further away, the office will confirm.",
            es: "Casi todo bajada: la furgoneta sube hasta los 2.200 m, en la vertiente oeste del Teide, y desde allí se bajan unos 50 km por Chío, Guía de Isora con pausa para el café y Los Menores, hasta la base del proveedor en Adeje; la furgoneta lleva de vuelta al hotel a quien quiera. Fácil, apto aunque no montes a menudo: desde los 12 años, con un adulto. En e-bike 130 €; en bicicleta de montaña tradicional, bajo petición, 20 € más. La recogida está incluida a menos de 5 km de la base de Adeje: desde más lejos lo confirma la oficina.",
            fr: "Presque tout en descente : le minibus vous monte à 2 200 m sur le versant ouest du Teide, et de là vous descendez environ 50 km par Chío, Guía de Isora avec une pause café, et Los Menores, jusqu'à la base de l'opérateur à Adeje ; le van vous ramène à l'hôtel si vous le souhaitez. Facile, convient même si vous roulez rarement : dès 12 ans, avec un adulte. En vélo électrique €130 ; en VTT classique, sur demande, €20 de plus. La prise en charge est comprise dans un rayon de 5 km de la base d'Adeje : au-delà, le bureau vous confirmera.",
            de: "Fast nur bergab: Der Minibus bringt Sie auf 2.200 m an die Westseite des Teide, und von dort fahren Sie etwa 50 km hinunter durch Chío, Guía de Isora mit Kaffeepause und Los Menores, bis zur Basis des Anbieters in Adeje; der Van bringt Sie auf Wunsch zum Hotel zurück. Leicht, auch für alle, die selten fahren: ab 12 Jahren, mit einem Erwachsenen. Mit E-Bike €130; mit klassischem Mountainbike, auf Anfrage, €20 mehr. Die Abholung ist im Umkreis von 5 km um die Basis in Adeje inklusive: von weiter weg bestätigt es das Büro."
          } },
        { label: "El Poris by San Isidro – TF 28",
          group: "strada",
          priceAdult: 110,
          desc: {
            it: "Il pulmino porta ciclisti e bici a San Isidro; da lì su e giù per la vecchia TF-28 fino a Villa de Arico, pausa caffè e discesa a El Porís, villaggio di pescatori con la spiaggia nera. Poi l'unica salita del giorno, dolce (3-5%), in mezzo al parco eolico più grande dell'isola. Circa 65 km e 1.250 m di dislivello, difficoltà media per la lunghezza, tutto asfalto. In e-bike 130 €.",
            en: "The minibus takes riders and bikes to San Isidro; from there, up and down the old TF-28 to Villa de Arico, a coffee break and the descent to El Porís, a fishing village with a black-sand beach. Then the only climb of the day, a gentle one (3-5%), through the island's largest wind farm. About 65 km and 1,250 m of climbing, medium difficulty because of the distance, all on tarmac. By e-bike €130.",
            es: "La furgoneta lleva ciclistas y bicis a San Isidro; desde allí, sube y baja por la antigua TF-28 hasta Villa de Arico, pausa para el café y bajada a El Porís, pueblo de pescadores con playa de arena negra. Después la única subida del día, suave (3-5%), entre el mayor parque eólico de la isla. Unos 65 km y 1.250 m de desnivel, dificultad media por la distancia, todo asfalto. En e-bike 130 €.",
            fr: "Le minibus emmène cyclistes et vélos à San Isidro ; de là, montées et descentes sur l'ancienne TF-28 jusqu'à Villa de Arico, une pause café et la descente vers El Porís, village de pêcheurs avec une plage de sable noir. Puis la seule montée de la journée, douce (3-5 %), à travers le plus grand parc éolien de l'île. Environ 65 km et 1 250 m de dénivelé, difficulté moyenne à cause de la distance, tout sur route. En vélo électrique €130.",
            de: "Der Minibus bringt Fahrer und Räder nach San Isidro; von dort auf und ab über die alte TF-28 bis Villa de Arico, Kaffeepause und Abfahrt nach El Porís, einem Fischerdorf mit schwarzem Sandstrand. Dann der einzige Anstieg des Tages, ein sanfter (3-5 %), durch den größten Windpark der Insel. Etwa 65 km und 1.250 Höhenmeter, mittlere Schwierigkeit wegen der Distanz, alles auf Asphalt. Mit E-Bike €130."
          } },
        { label: "Medano via Granadilla",
          group: "strada",
          priceAdult: 110,
          desc: {
            it: "Un anello senza salite dure: da Costa Adeje per Los Cristianos, Chayofa e La Camella, il belvedere della Centinela, San Miguel de Abona e Granadilla; poi in discesa fino a El Médano per un caffè sul mare, e ritorno lungo la costa davanti alla Montaña Roja. 65 km, 1.100 m di dislivello, facile, tutto asfalto. In e-bike 130 €.",
            en: "A loop with no hard climbs: from Costa Adeje via Los Cristianos, Chayofa and La Camella, the La Centinela viewpoint, San Miguel de Abona and Granadilla; then downhill to El Médano for a coffee by the sea, and back along the coast past Montaña Roja. 65 km, 1,100 m of climbing, easy, all on tarmac. By e-bike €130.",
            es: "Un circuito sin subidas duras: de Costa Adeje por Los Cristianos, Chayofa y La Camella, el mirador de La Centinela, San Miguel de Abona y Granadilla; luego bajando hasta El Médano para un café junto al mar, y vuelta por la costa frente a la Montaña Roja. 65 km, 1.100 m de desnivel, fácil, todo asfalto. En e-bike 130 €.",
            fr: "Une boucle sans montées difficiles : de Costa Adeje par Los Cristianos, Chayofa et La Camella, le belvédère de La Centinela, San Miguel de Abona et Granadilla ; puis descente vers El Médano pour un café au bord de la mer, et retour le long de la côte devant la Montaña Roja. 65 km, 1 100 m de dénivelé, facile, tout sur route. En vélo électrique €130.",
            de: "Eine Runde ohne harte Anstiege: von Costa Adeje über Los Cristianos, Chayofa und La Camella, den Aussichtspunkt La Centinela, San Miguel de Abona und Granadilla; dann bergab nach El Médano zu einem Kaffee am Meer und zurück entlang der Küste, vorbei an der Montaña Roja. 65 km, 1.100 Höhenmeter, leicht, alles auf Asphalt. Mit E-Bike €130."
          } },
        { label: "Santiago del Teide",
          group: "strada",
          priceAdult: 110,
          desc: {
            it: "Da Costa Adeje lungo la costa ovest: la salita fra le piantagioni di banane fino a Guía de Isora, la discesa verso Playa San Juan e le scogliere di Los Gigantes, poi la salita a tappe per Tamaimo fino a Santiago del Teide, a 1.000 m, e le lave nere di Arguayo. Sosta a Chío e 18 km di discesa per tornare. Da 70 a 85 km e da 1.500 a 2.200 m di dislivello, secondo il livello; impegnativo, tutto asfalto. In e-bike 130 €.",
            en: "From Costa Adeje along the west coast: the climb through the banana plantations to Guía de Isora, down towards Playa San Juan and the Los Gigantes cliffs, then the stepped climb through Tamaimo to Santiago del Teide, at 1,000 m, and the black lava of Arguayo. A stop in Chío and 18 km of descent back. 70 to 85 km and 1,500 to 2,200 m of climbing, depending on your level; demanding, all on tarmac. By e-bike €130.",
            es: "De Costa Adeje por la costa oeste: la subida entre plataneras hasta Guía de Isora, la bajada hacia Playa San Juan y los acantilados de Los Gigantes, luego la subida por etapas por Tamaimo hasta Santiago del Teide, a 1.000 m, y la lava negra de Arguayo. Parada en Chío y 18 km de bajada para volver. De 70 a 85 km y de 1.500 a 2.200 m de desnivel, según el nivel; exigente, todo asfalto. En e-bike 130 €.",
            fr: "De Costa Adeje le long de la côte ouest : la montée à travers les bananeraies jusqu'à Guía de Isora, la descente vers Playa San Juan et les falaises de Los Gigantes, puis la montée en escalier par Tamaimo jusqu'à Santiago del Teide, à 1 000 m, et la lave noire d'Arguayo. Un arrêt à Chío et 18 km de descente pour rentrer. De 70 à 85 km et de 1 500 à 2 200 m de dénivelé, selon votre niveau ; exigeant, tout sur route. En vélo électrique €130.",
            de: "Von Costa Adeje die Westküste entlang: der Anstieg durch die Bananenplantagen nach Guía de Isora, hinunter Richtung Playa San Juan und zu den Klippen von Los Gigantes, dann der Stufenanstieg durch Tamaimo bis Santiago del Teide auf 1.000 m und die schwarze Lava von Arguayo. Ein Stopp in Chío und 18 km Abfahrt zurück. 70 bis 85 km und 1.500 bis 2.200 Höhenmeter, je nach Niveau; anspruchsvoll, alles auf Asphalt. Mit E-Bike €130."
          } },
        { label: { it: "Masca Tour (110/150 €)", en: "Masca Tour (€110/150)", es: "Masca Tour (110/150 €)", fr: "Masca Tour (€110/150)", de: "Masca Tour (€110/150)" },
          group: "strada",
          desc: {
            it: "Per ciclisti esperti. Da Costa Adeje per Guía de Isora, Los Gigantes e Santiago del Teide fino al Mirador de Cherfe; poi giù a Masca, ai piedi del Teno, e su per la salita più dura dell'isola: 4,2 km con tratti fino al 22%. Due lunghezze: circa 60 km e 1.550 m di dislivello a 110 €, oppure circa 130 km e 3.000 m, passando per Buenavista del Norte ed El Tanque, a 150 €; in e-bike 130 € e 180 €. Tutto asfalto.",
            en: "For experienced riders. From Costa Adeje via Guía de Isora, Los Gigantes and Santiago del Teide up to the Mirador de Cherfe; then down to Masca, at the foot of the Teno mountains, and up the island's hardest climb: 4.2 km with stretches of up to 22%. Two lengths: about 60 km and 1,550 m of climbing for €110, or about 130 km and 3,000 m, via Buenavista del Norte and El Tanque, for €150; by e-bike €130 and €180. All on tarmac.",
            es: "Para ciclistas expertos. De Costa Adeje por Guía de Isora, Los Gigantes y Santiago del Teide hasta el Mirador de Cherfe; luego bajada a Masca, al pie del Teno, y subida por la cuesta más dura de la isla: 4,2 km con tramos de hasta el 22%. Dos distancias: unos 60 km y 1.550 m de desnivel por 110 €, o unos 130 km y 3.000 m, pasando por Buenavista del Norte y El Tanque, por 150 €; en e-bike 130 € y 180 €. Todo asfalto.",
            fr: "Pour cyclistes expérimentés. De Costa Adeje par Guía de Isora, Los Gigantes et Santiago del Teide jusqu'au Mirador de Cherfe ; puis descente vers Masca, au pied des montagnes de Teno, et la montée la plus dure de l'île : 4,2 km avec des passages jusqu'à 22 %. Deux longueurs : environ 60 km et 1 550 m de dénivelé pour €110, ou environ 130 km et 3 000 m, par Buenavista del Norte et El Tanque, pour €150 ; en vélo électrique €130 et €180. Tout sur route.",
            de: "Für erfahrene Fahrer. Von Costa Adeje über Guía de Isora, Los Gigantes und Santiago del Teide bis zum Mirador de Cherfe; dann hinunter nach Masca, am Fuß des Teno-Gebirges, und hinauf den härtesten Anstieg der Insel: 4,2 km mit Abschnitten bis 22 %. Zwei Längen: etwa 60 km und 1.550 Höhenmeter für €110, oder etwa 130 km und 3.000 m, über Buenavista del Norte und El Tanque, für €150; mit E-Bike €130 und €180. Alles auf Asphalt."
          } },
        { label: "Santiago del Teide – El Chinyero",
          group: "mtb",
          priceAdult: 110,
          desc: {
            it: "Il pulmino porta a Santiago del Teide, dove c'è il tempo per un caffè; da lì si pedala su piste sterrate larghe, con la vista sulla costa nord fino a Garachico e Puerto de la Cruz, accanto alla Montaña Negra fino al cono di lava del Chinyero, l'ultima grande eruzione dell'isola nel 1909, e al rifugio della Casa Forestal. 33 km e 600 m di dislivello, tutto sterrato. Media in mountain bike, facile in e-bike: qualche strappo breve su sabbia vulcanica, ma va bene anche per chi non è mai andato fuori strada. In e-bike 130 €.",
            en: "The minibus takes you to Santiago del Teide, with time for a coffee; from there you ride wide dirt tracks, looking out over the north coast to Garachico and Puerto de la Cruz, past Montaña Negra to the Chinyero lava cone, the island's last major eruption in 1909, and the Casa Forestal refuge. 33 km and 600 m of climbing, all off-road. Medium on a mountain bike, easy by e-bike: a few short steep bits on volcanic sand, but fine even if you have never ridden off-road. By e-bike €130.",
            es: "La furgoneta lleva a Santiago del Teide, con tiempo para un café; desde allí se pedalea por pistas anchas, con vistas a la costa norte hasta Garachico y Puerto de la Cruz, junto a la Montaña Negra hasta el cono de lava del Chinyero, la última gran erupción de la isla en 1909, y el refugio de la Casa Forestal. 33 km y 600 m de desnivel, todo pista. Media en bicicleta de montaña, fácil en e-bike: algunas rampas cortas sobre arena volcánica, pero apta aunque nunca hayas ido fuera de carretera. En e-bike 130 €.",
            fr: "Le minibus vous emmène à Santiago del Teide, avec le temps d'un café ; de là, vous roulez sur de larges pistes en terre, avec vue sur la côte nord jusqu'à Garachico et Puerto de la Cruz, devant la Montaña Negra jusqu'au cône de lave du Chinyero, la dernière grande éruption de l'île en 1909, et le refuge de la Casa Forestal. 33 km et 600 m de dénivelé, tout en tout-terrain. Moyen en VTT, facile en vélo électrique : quelques courts passages raides sur sable volcanique, mais ça va même si vous n'avez jamais fait de tout-terrain. En vélo électrique €130.",
            de: "Der Minibus bringt Sie nach Santiago del Teide, mit Zeit für einen Kaffee; von dort fahren Sie auf breiten Schotterwegen mit Blick über die Nordküste bis Garachico und Puerto de la Cruz, vorbei an der Montaña Negra bis zum Lavakegel des Chinyero, dem letzten großen Ausbruch der Insel 1909, und zur Hütte Casa Forestal. 33 km und 600 Höhenmeter, alles offroad. Mittel mit dem Mountainbike, leicht mit dem E-Bike: ein paar kurze steile Stücke auf Vulkansand, aber machbar, auch wenn Sie noch nie offroad gefahren sind. Mit E-Bike €130."
          } },
        { label: "Izaña – El Poris, Teide Easy Downhill",
          group: "mtb",
          priceAdult: 140,
          desc: {
            it: "Dalla montagna al mare, quasi tutto in discesa: il pulmino porta all'osservatorio di Izaña, a 2.390 m sul versante est del Teide, e da lì si scende per piste vulcaniche larghe e pinete, la zona di El Contador, vigneti e campi di patate fino a Villa de Arico e al villaggio di pescatori di El Porís. 45 km, 70% sterrato. Facile, ma serve un po' di pratica di mountain bike su fondo smosso. Alla fine il furgone riporta in hotel.",
            en: "From the mountain to the sea, almost all downhill: the minibus takes you to the Izaña observatory, at 2,390 m on Teide's east side, and from there you ride down wide volcanic tracks and pine forests, the El Contador area, vineyards and potato fields to Villa de Arico and the fishing village of El Porís. 45 km, 70% off-road. Easy, but some mountain-biking experience on loose ground is needed. At the end the van takes you back to your hotel.",
            es: "De la montaña al mar, casi todo bajada: la furgoneta sube al observatorio de Izaña, a 2.390 m en la vertiente este del Teide, y desde allí se baja por pistas volcánicas anchas y pinares, la zona de El Contador, viñedos y campos de papas hasta Villa de Arico y el pueblo pesquero de El Porís. 45 km, 70% pista. Fácil, pero hace falta algo de práctica en bicicleta de montaña sobre terreno suelto. Al final la furgoneta lleva de vuelta al hotel.",
            fr: "De la montagne à la mer, presque tout en descente : le minibus vous emmène à l'observatoire d'Izaña, à 2 390 m sur le versant est du Teide, et de là vous descendez par de larges pistes volcaniques et des pinèdes, la zone d'El Contador, les vignes et les champs de pommes de terre jusqu'à Villa de Arico et au village de pêcheurs d'El Porís. 45 km, dont 70 % en tout-terrain. Facile, mais il faut un peu d'expérience du VTT sur terrain meuble. À la fin, le van vous ramène à l'hôtel.",
            de: "Vom Berg ans Meer, fast nur bergab: Der Minibus bringt Sie zum Observatorium Izaña auf 2.390 m an der Ostseite des Teide, und von dort geht es auf breiten Vulkanpisten hinunter durch Kiefernwälder, das Gebiet El Contador, Weinberge und Kartoffelfelder bis Villa de Arico und zum Fischerdorf El Porís. 45 km, 70 % offroad. Leicht, aber etwas Mountainbike-Erfahrung auf losem Untergrund ist nötig. Am Ende bringt der Van Sie zum Hotel zurück."
          } },
        { label: "Teide South Off-road Downhill",
          group: "mtb",
          priceAdult: 110,
          desc: {
            it: "Discesa tecnica dal versante sud del Teide alla costa: il pulmino porta a 2.200 m, poi si scende fra colate di lava e pinete, con la vista su Adeje e, nei giorni limpidi, su La Gomera, fino al borgo di La Quinta; da lì i vecchi camini reales di pietra e i barrancos fino a Costa Adeje. 30 km, 90% sterrato. Difficoltà media: per chi ha già esperienza fuori strada e sa guidare la bici su roccia e ciottolato. Alla fine il furgone riporta in hotel.",
            en: "A technical descent from Teide's south side to the coast: the minibus takes you up to 2,200 m, then you ride down through lava flows and pine forests, looking out over Adeje and, on clear days, La Gomera, to the hamlet of La Quinta; from there the old stone caminos reales and the barrancos down to Costa Adeje. 30 km, 90% off-road. Medium difficulty: for riders with off-road experience who are confident on rock and cobbles. At the end the van takes you back to your hotel.",
            es: "Bajada técnica desde la vertiente sur del Teide hasta la costa: la furgoneta sube a 2.200 m y luego se baja entre coladas de lava y pinares, con vistas a Adeje y, en días claros, a La Gomera, hasta el caserío de La Quinta; desde allí los antiguos caminos reales de piedra y los barrancos hasta Costa Adeje. 30 km, 90% pista. Dificultad media: para quien ya tiene experiencia fuera de carretera y maneja la bici con soltura sobre roca y empedrado. Al final la furgoneta lleva de vuelta al hotel.",
            fr: "Une descente technique du versant sud du Teide jusqu'à la côte : le minibus vous monte à 2 200 m, puis vous descendez à travers coulées de lave et pinèdes, avec vue sur Adeje et, par temps clair, La Gomera, jusqu'au hameau de La Quinta ; de là, les anciens caminos reales en pierre et les barrancos jusqu'à Costa Adeje. 30 km, dont 90 % en tout-terrain. Difficulté moyenne : pour cyclistes ayant l'expérience du tout-terrain et à l'aise sur la roche et les pavés. À la fin, le van vous ramène à l'hôtel.",
            de: "Eine technische Abfahrt von der Südseite des Teide bis zur Küste: Der Minibus bringt Sie auf 2.200 m, dann geht es hinunter durch Lavaströme und Kiefernwälder, mit Blick auf Adeje und an klaren Tagen auf La Gomera, bis zum Weiler La Quinta; von dort über die alten gepflasterten Caminos Reales und die Barrancos bis Costa Adeje. 30 km, 90 % offroad. Mittlere Schwierigkeit: für Fahrer mit Offroad-Erfahrung, die sich auf Fels und Pflaster sicher fühlen. Am Ende bringt der Van Sie zum Hotel zurück."
          } },
        { label: "Off-road Escape",
          group: "mtb",
          priceAdult: 110,
          desc: {
            it: "Fra la lava e il mare del sud: dopo Las Américas e Los Cristianos si sale in furgone sul vulcano di Guaza, poi circa 25 km di sterrato nella riserva del Malpaís de la Rasca, fino al faro di Rasca e alle sue scogliere. Pausa con un leche leche sul lungomare di Las Galletas, la Costa del Silencio e altri 7 km di sterrato fino al vulcano della Montaña Amarilla. 35-40 km, 600 m di dislivello, 90% sterrato; difficoltà medio-alta. C'è anche una versione più facile, da Pal-Mar a Pal-Mar: 30 km e 150 m di dislivello. In e-bike 130 €.",
            en: "Between lava and the southern sea: past Las Américas and Los Cristianos the van takes you up the Guaza volcano, then about 25 km off-road through the Malpaís de la Rasca reserve to the Rasca lighthouse and its cliffs. A leche leche on the Las Galletas seafront, the Costa del Silencio and another 7 km off-road to the Montaña Amarilla volcano. 35-40 km, 600 m of climbing, 90% off-road; medium to hard. There is also an easier version, from Pal-Mar and back: 30 km and 150 m of climbing. By e-bike €130.",
            es: "Entre la lava y el mar del sur: pasados Las Américas y Los Cristianos se sube en furgoneta al volcán de Guaza, y luego unos 25 km de pista por la reserva del Malpaís de la Rasca, hasta el faro de Rasca y sus acantilados. Un leche leche en el paseo de Las Galletas, la Costa del Silencio y otros 7 km de pista hasta el volcán de la Montaña Amarilla. 35-40 km, 600 m de desnivel, 90% pista; dificultad media-alta. Hay también una versión más fácil, de Pal-Mar a Pal-Mar: 30 km y 150 m de desnivel. En e-bike 130 €.",
            fr: "Entre lave et mer du sud : après Las Américas et Los Cristianos, le van vous monte sur le volcan de Guaza, puis environ 25 km en tout-terrain à travers la réserve du Malpaís de la Rasca jusqu'au phare de Rasca et ses falaises. Un leche leche sur le front de mer de Las Galletas, la Costa del Silencio et encore 7 km de tout-terrain jusqu'au volcan de la Montaña Amarilla. 35-40 km, 600 m de dénivelé, 90 % en tout-terrain ; moyen à difficile. Il existe aussi une version plus facile, aller-retour depuis Pal-Mar : 30 km et 150 m de dénivelé. En vélo électrique €130.",
            de: "Zwischen Lava und Südmeer: hinter Las Américas und Los Cristianos bringt der Van Sie auf den Vulkan Guaza, dann etwa 25 km offroad durch das Reservat Malpaís de la Rasca bis zum Leuchtturm von Rasca und seinen Klippen. Ein Leche Leche an der Promenade von Las Galletas, die Costa del Silencio und weitere 7 km offroad bis zum Vulkan Montaña Amarilla. 35-40 km, 600 Höhenmeter, 90 % offroad; mittel bis schwer. Es gibt auch eine leichtere Version, ab Pal-Mar und zurück: 30 km und 150 Höhenmeter. Mit E-Bike €130."
          } },
        { label: "Costa del Silencio – El Médano – Palm Mar",
          group: "mtb",
          priceAdult: 110,
          desc: {
            it: "Il giro più facile, pensato per chi va in mountain bike per la prima volta. Da Costa del Silencio verso Golf del Sur e il villaggio di pescatori di Los Abrigos, poi la spiaggia della Tejita fino a El Médano, davanti alla Montaña Roja, per un frullato di frutta. Il ritorno passa per un'altra strada, fra le piantagioni di banane vicino all'aeroporto del sud, fino al faro di Punta de Rasca. 40 km, 400 m di dislivello, tutto sterrato. Esiste anche in versione più corta, adatta alle famiglie con bambini. In e-bike 130 €.",
            en: "The easiest ride, designed for first-time mountain bikers. From Costa del Silencio towards Golf del Sur and the fishing village of Los Abrigos, then along La Tejita beach to El Médano, facing Montaña Roja, for a fruit shake. The way back takes another route, through banana plantations near the south airport, to the Punta de Rasca lighthouse. 40 km, 400 m of climbing, all off-road. A shorter version is also available, suitable for families with children. By e-bike €130.",
            es: "El recorrido más fácil, pensado para quien va en bicicleta de montaña por primera vez. De Costa del Silencio hacia Golf del Sur y el pueblo pesquero de Los Abrigos, luego por la playa de La Tejita hasta El Médano, frente a la Montaña Roja, para un batido de fruta. La vuelta va por otro camino, entre plataneras cerca del aeropuerto del sur, hasta el faro de Punta de Rasca. 40 km, 400 m de desnivel, todo pista. Existe también en versión más corta, apta para familias con niños. En e-bike 130 €.",
            fr: "La sortie la plus facile, pensée pour ceux qui découvrent le VTT. De Costa del Silencio vers Golf del Sur et le village de pêcheurs de Los Abrigos, puis le long de la plage de La Tejita jusqu'à El Médano, face à la Montaña Roja, pour un smoothie aux fruits. Le retour prend un autre chemin, à travers les bananeraies près de l'aéroport sud, jusqu'au phare de la Punta de Rasca. 40 km, 400 m de dénivelé, tout en tout-terrain. Une version plus courte existe aussi, adaptée aux familles avec enfants. En vélo électrique €130.",
            de: "Die leichteste Tour, gedacht für alle, die zum ersten Mal Mountainbike fahren. Von Costa del Silencio Richtung Golf del Sur und zum Fischerdorf Los Abrigos, dann am Strand La Tejita entlang bis El Médano, gegenüber der Montaña Roja, auf einen Fruchtshake. Zurück geht es auf einem anderen Weg, durch Bananenplantagen nahe dem Südflughafen, bis zum Leuchtturm der Punta de Rasca. 40 km, 400 Höhenmeter, alles offroad. Es gibt auch eine kürzere Version, geeignet für Familien mit Kindern. Mit E-Bike €130."
          } },
        { label: "Barbacoa – Corona Forestal",
          group: "mtb",
          priceAdult: 110,
          desc: {
            it: "Il pulmino passa da Villa de Arico e porta alla riserva di El Contador, a 1.000 m; da lì una salita lunga e costante su sterrato, circa 17 km e 1.300 m di dislivello, fino all'osservatorio di Izaña. Poi 20 km di discesa su piste larghe e qualche tratto d'asfalto verso la Valle di Güímar, con la sosta al Mirador de Pájara. 45 km, 1.400 m di dislivello, 90% sterrato. Medio-alta per la salita, non per la tecnica: la discesa va bene anche per chi ha poca esperienza. In e-bike 130 €.",
            en: "The minibus goes via Villa de Arico to the El Contador reserve, at 1,000 m; from there a long, steady climb on dirt tracks, about 17 km and 1,300 m of ascent, up to the Izaña observatory. Then 20 km of descent on wide tracks and a few stretches of tarmac towards the Güímar valley, with a stop at the Mirador de Pájara. 45 km, 1,400 m of climbing, 90% off-road. Medium to hard because of the climb, not the technique: the descent is fine even for less experienced riders. By e-bike €130.",
            es: "La furgoneta pasa por Villa de Arico y lleva a la reserva de El Contador, a 1.000 m; desde allí una subida larga y constante por pista, unos 17 km y 1.300 m de desnivel, hasta el observatorio de Izaña. Luego 20 km de bajada por pistas anchas y algún tramo de asfalto hacia el Valle de Güímar, con parada en el Mirador de Pájara. 45 km, 1.400 m de desnivel, 90% pista. Media-alta por la subida, no por la técnica: la bajada es apta también para quien tiene poca experiencia. En e-bike 130 €.",
            fr: "Le minibus passe par Villa de Arico jusqu'à la réserve d'El Contador, à 1 000 m ; de là, une longue montée régulière sur pistes en terre, environ 17 km et 1 300 m de dénivelé, jusqu'à l'observatoire d'Izaña. Puis 20 km de descente sur de larges pistes et quelques tronçons de route vers la vallée de Güímar, avec un arrêt au Mirador de Pájara. 45 km, 1 400 m de dénivelé, 90 % en tout-terrain. Moyen à difficile à cause de la montée, pas de la technique : la descente convient même aux cyclistes moins expérimentés. En vélo électrique €130.",
            de: "Der Minibus fährt über Villa de Arico zum Reservat El Contador auf 1.000 m; von dort ein langer, gleichmäßiger Anstieg auf Schotterwegen, etwa 17 km und 1.300 Höhenmeter, bis zum Observatorium Izaña. Dann 20 km Abfahrt auf breiten Pisten und ein paar Asphaltstücken Richtung Güímar-Tal, mit Stopp am Mirador de Pájara. 45 km, 1.400 Höhenmeter, 90 % offroad. Mittel bis schwer wegen des Anstiegs, nicht wegen der Technik: Die Abfahrt schaffen auch weniger erfahrene Fahrer. Mit E-Bike €130."
          } },
        { label: "El Médano – El Poris",
          group: "mtb",
          priceAdult: 110,
          desc: {
            it: "Il pulmino porta a El Médano, il paese dei surfisti, e da lì si pedala sugli sterrati della costa est: il villaggio di pescatori di San Miguel de Tajao, El Porís e il suo faro, ultima sosta prima di ritrovare il furgone. 40 km, 600 m di dislivello, tutto sterrato. Difficoltà media: qualche tratto corto e roccioso fra i barrancos, che volendo si fa a piedi spingendo la bici per pochi metri. In e-bike 130 €.",
            en: "The minibus takes you to El Médano, the surfers' town, and from there you ride the dirt tracks of the east coast: the fishing village of San Miguel de Tajao, El Porís and its lighthouse, the last stop before meeting the van. 40 km, 600 m of climbing, all off-road. Medium difficulty: a few short rocky stretches between the barrancos, which you can walk, pushing the bike for a few metres, if you prefer. By e-bike €130.",
            es: "La furgoneta lleva a El Médano, el pueblo de los surfistas, y desde allí se pedalea por las pistas de la costa este: el pueblo pesquero de San Miguel de Tajao, El Porís y su faro, última parada antes de volver a la furgoneta. 40 km, 600 m de desnivel, todo pista. Dificultad media: algunos tramos cortos y rocosos entre los barrancos, que se pueden hacer a pie empujando la bici unos metros. En e-bike 130 €.",
            fr: "Le minibus vous emmène à El Médano, la ville des surfeurs, et de là vous roulez sur les pistes en terre de la côte est : le village de pêcheurs de San Miguel de Tajao, El Porís et son phare, dernier arrêt avant de retrouver le van. 40 km, 600 m de dénivelé, tout en tout-terrain. Difficulté moyenne : quelques courts passages rocheux entre les barrancos, que l'on peut faire à pied, en poussant le vélo sur quelques mètres, si on préfère. En vélo électrique €130.",
            de: "Der Minibus bringt Sie nach El Médano, dem Surferort, und von dort fahren Sie auf den Schotterwegen der Ostküste: das Fischerdorf San Miguel de Tajao, El Porís und sein Leuchtturm, der letzte Halt, bevor Sie den Van treffen. 40 km, 600 Höhenmeter, alles offroad. Mittlere Schwierigkeit: ein paar kurze felsige Stücke zwischen den Barrancos, die man, wenn man lieber will, zu Fuß gehen kann und das Rad ein paar Meter schiebt. Mit E-Bike €130."
          } },
        { label: "Vilaflor – Corona Forestal",
          group: "mtb",
          priceAdult: 110,
          desc: {
            it: "Il pulmino porta a Vilaflor, a 1.400 m; pochi chilometri d'asfalto fino al Pino Gordo, il pino canario più grande dell'arcipelago, poi circa 13 km di sterrato nella pineta fino a Madre de Agua. Cinque minuti a piedi lungo il ruscello del Barranco del Río, poi in sella fino a El Salto e giù verso il mare fra asfalto e sterrati facili. 40 km, 500 m di dislivello. Difficoltà media: qualche tratto tecnico in discesa e un paio di passaggi da fare a piedi. In e-bike 130 €.",
            en: "The minibus takes you to Vilaflor, at 1,400 m; a few kilometres of tarmac to the Pino Gordo, the largest Canary pine in the archipelago, then about 13 km off-road through the pine forest to Madre de Agua. A five-minute walk along the stream of the Barranco del Río, then back in the saddle to El Salto and down towards the sea on tarmac and easy tracks. 40 km, 500 m of climbing. Medium difficulty: a few technical downhill stretches and a couple of sections to walk. By e-bike €130.",
            es: "La furgoneta lleva a Vilaflor, a 1.400 m; unos pocos kilómetros de asfalto hasta el Pino Gordo, el mayor pino canario del archipiélago, y luego unos 13 km de pista por el pinar hasta Madre de Agua. Cinco minutos a pie junto al arroyo del Barranco del Río, de nuevo en la bici hasta El Salto y bajada hacia el mar entre asfalto y pistas fáciles. 40 km, 500 m de desnivel. Dificultad media: algunos tramos técnicos de bajada y un par de pasos que hay que hacer a pie. En e-bike 130 €.",
            fr: "Le minibus vous emmène à Vilaflor, à 1 400 m ; quelques kilomètres de route jusqu'au Pino Gordo, le plus grand pin des Canaries de l'archipel, puis environ 13 km en tout-terrain à travers la pinède jusqu'à Madre de Agua. Cinq minutes à pied le long du ruisseau du Barranco del Río, puis de nouveau en selle jusqu'à El Salto et la descente vers la mer sur route et pistes faciles. 40 km, 500 m de dénivelé. Difficulté moyenne : quelques passages techniques en descente et deux tronçons à faire à pied. En vélo électrique €130.",
            de: "Der Minibus bringt Sie nach Vilaflor auf 1.400 m; ein paar Kilometer Asphalt bis zum Pino Gordo, der größten Kanarenkiefer des Archipels, dann etwa 13 km offroad durch den Kiefernwald bis Madre de Agua. Fünf Minuten zu Fuß am Bach des Barranco del Río entlang, dann wieder in den Sattel bis El Salto und hinunter zum Meer auf Asphalt und leichten Pisten. 40 km, 500 Höhenmeter. Mittlere Schwierigkeit: ein paar technische Abfahrten und zwei Abschnitte zu Fuß. Mit E-Bike €130."
          } }
      ]
    },
    // Valgono per tutti e sedici i giri: ogni pagina del fornitore scrive
    // le stesse cose (bici con casco e kit, guida, ritiro e riconsegna in
    // hotel, acqua con frutta o snack). Finche' mancavano delle pagine
    // stavano dentro le varianti; dal 6 ottobre 2026 ci sono tutte.
    included: ["guide", "equipment", "transfer", "snack"],
    // Valgono per tutti i giri: sono scritte uguali in fondo a ognuna delle
    // pagine del fornitore. La politica di cancellazione per il maltempo e
    // i livelli in W/kg non sono stati copiati.
    notes: [
      { it: "Le guide parlano italiano, inglese e spagnolo.",
        en: "The guides speak Italian, English and Spanish.",
        es: "Los guías hablan italiano, inglés y español.",
        fr: "Les guides parlent italien, anglais et espagnol.",
        de: "Die Guides sprechen Italienisch, Englisch und Spanisch." },
      { it: "Ogni giro dura al massimo 5 ore, compresi il ritiro e il ritorno in hotel.",
        en: "Each ride lasts 5 hours at most, including hotel pick-up and drop-off.",
        es: "Cada recorrido dura como máximo 5 horas, incluidas la recogida y la vuelta al hotel.",
        fr: "Chaque sortie dure 5 heures au maximum, prise en charge et retour à l'hôtel compris.",
        de: "Jede Tour dauert höchstens 5 Stunden, Abholung und Rückfahrt zum Hotel inklusive." },
      // Non tutti i giri hanno la e-bike: i due MTB arrivati il 6 ottobre
      // danno solo il prezzo della bici normale.
      { it: "Su molti giri si può avere la e-bike: dove c'è, il prezzo è nella descrizione del giro. Se la vuoi scrivilo nelle note della richiesta.",
        en: "Many rides can be done by e-bike: where available, the price is in the ride's description. If you want one, say so in the notes of your request.",
        es: "En muchos recorridos se puede ir en e-bike: donde la hay, el precio está en la descripción del recorrido. Si la quieres, escríbelo en las notas de la solicitud.",
        fr: "Beaucoup de sorties peuvent se faire en vélo électrique : quand c'est possible, le prix est dans la description de la sortie. Si vous en voulez un, indiquez-le dans les notes de la demande.",
        de: "Viele Touren gehen auch mit dem E-Bike: Wo möglich, steht der Preis in der Beschreibung der Tour. Wenn Sie eins möchten, schreiben Sie es in die Notizen der Anfrage." }
    ],
    family: false,
    desc: {
      it: "Sedici giri in bicicletta con guida, otto su strada e otto in mountain bike: dalle salite del Teide alle discese verso la costa, passando per Vilaflor, Masca, la corona forestale e il sud dell'isola. Mezza giornata in sella, per chi pedala già e per chi è esperto.",
      en: "Sixteen guided bike rides, eight on the road and eight by mountain bike: from the climbs up Teide to the descents towards the coast, through Vilaflor, Masca, the pine forest and the south of the island. Half a day in the saddle, for regular riders and experts alike.",
      es: "Dieciséis recorridos en bicicleta con guía, ocho por carretera y ocho en bicicleta de montaña: de las subidas al Teide a las bajadas hacia la costa, pasando por Vilaflor, Masca, la corona forestal y el sur de la isla. Media jornada sobre la bici, para quien ya pedalea y para expertos.",
      fr: "Seize sorties guidées à vélo, huit sur route et huit en VTT : des montées vers le Teide aux descentes vers la côte, en passant par Vilaflor, Masca, la pinède et le sud de l'île. Une demi-journée en selle, pour cyclistes réguliers comme pour experts.",
      de: "Sechzehn geführte Radtouren, acht auf der Straße und acht mit dem Mountainbike: von den Anstiegen zum Teide bis zu den Abfahrten zur Küste, durch Vilaflor, Masca, den Kiefernwald und den Süden der Insel. Ein halber Tag im Sattel, für regelmäßige Fahrer wie für Profis."
    },
    nomi: ["Cycling in Tenerife"],
    // La foto che stava sulla vecchia scheda "Trekking e bici": un ciclista in
    // mezzo alle lave. Rinominata `bici.webp` perche' adesso il nome dice quello
    // che c'e' dentro, e il file non e' citato da nessun'altra parte (solo da
    // qui: sw.js precarica solo le icone).
    image: "bici.webp",
    published: true
  },
  {
    id: "icod-garachico-orotava",
    // Conta sempre come card (proprietario, 11 ottobre 2026: le escursioni
    // di Island Excursions).
    pagamento: "card",
    // L'id nomina ancora La Orotava, dove il tour non passa piu' dal 24
    // agosto: i codici interni non si cambiano, si romperebbero i link.
    title: {
      it: "Teide, Icod, Garachico e Masca",
      en: "Teide, Icod, Garachico & Masca",
      es: "Teide, Icod, Garachico y Masca",
      fr: "Teide, Icod, Garachico et Masca",
      de: "Teide, Icod, Garachico und Masca"
    },
    // Categoria decisa dal proprietario l'8 settembre 2026: sta con il Teide,
    // non con i tour dell'isola.
    category: "teide-natura",
    // "Tenerife nord" era rimasto da quando la scheda si chiamava
    // Icod/Garachico/Orotava, e diceva il falso: quel campo in pagina si legge
    // "Punto di partenza", e dal nord non parte niente. Il proprietario l'8
    // settembre 2026: la partenza e' **una sola**, il sud, e vale per tutte
    // le escursioni. Il nord qui e' dove si va, non da dove si parte.
    zone: { it: "Tenerife Sud", en: "South Tenerife", es: "Tenerife sur", fr: "Sud de Tenerife", de: "Süden von Teneriffa" },
    // "Circa 8 ore", detto dal proprietario l'8 settembre 2026. Era "Giornata
    // intera": vero ma vago, e per chi deve organizzarsi la giornata otto ore
    // e dodici non sono la stessa cosa.
    duration: { it: "8 ore circa", en: "About 8 hours", es: "8 horas aprox.", fr: "Environ 8 heures", de: "Etwa 8 Stunden" },
    zoneGroups: ["teide-nord"],
    durationGroups: ["intera"],
    // Niente `times`: l'ora di partenza non e' una sola, la decide il punto di
    // raccolta del cliente. Sta in PICKUP_TIMES dentro hotel.js, e la finestra
    // della richiesta al posto del menu "A che ora" mostra l'ora del suo hotel
    // (Perla Gris 07:45, Cleopatra 08:45).
    // Listino del fornitore (Nere Izerdie / Island Excursions, Costa Adeje),
    // mandato dall'ufficio l'8 settembre 2026: 58 € adulti, 37,50 € bambini.
    priceFrom: 58,
    fixedPrice: true,
    priceAdult: 58,
    priceChild: 37.5,
    // Il pranzo si puo' aggiungere (proprietario, 18 ottobre 2026): 20 EUR in
    // piu', uguale per adulti e bambini. Due formule e non una casella perche'
    // il netto lo trova dalla variante: "Con pranzo" ha su Supabase una riga
    // sua, "Senza pranzo" prende quella di sempre della scheda.
    options: {
      label: { it: "Pranzo", en: "Lunch", es: "Almuerzo", fr: "Déjeuner", de: "Mittagessen" },
      choices: [
        { label: { it: "Senza pranzo", en: "Without lunch", es: "Sin almuerzo", fr: "Sans déjeuner", de: "Ohne Mittagessen" },
          priceAdult: 58,
          priceChild: 37.5,
          desc: {
            it: "Il giro completo; alla sosta per mangiare, a Icod o a Garachico, il pranzo lo scegli e lo paghi tu.",
            en: "The full tour; at the meal stop, in Icod or Garachico, you choose and pay for your own lunch.",
            es: "La excursión completa; en la parada para comer, en Icod o en Garachico, el almuerzo lo eliges y lo pagas tú.",
            fr: "L'excursion complète ; à l'arrêt repas, à Icod ou à Garachico, vous choisissez et payez votre déjeuner.",
            de: "Die ganze Tour; beim Essensstopp in Icod oder Garachico wählen und bezahlen Sie Ihr Mittagessen selbst."
          } },
        { label: { it: "Con pranzo", en: "With lunch", es: "Con almuerzo", fr: "Avec déjeuner", de: "Mit Mittagessen" },
          priceAdult: 78,
          priceChild: 57.5,
          included: ["lunch"],
          desc: {
            it: "Il giro completo, con il pranzo già compreso alla sosta di Icod o di Garachico.",
            en: "The full tour, with lunch already included at the stop in Icod or Garachico.",
            es: "La excursión completa, con el almuerzo ya incluido en la parada de Icod o de Garachico.",
            fr: "L'excursion complète, avec le déjeuner déjà compris à l'arrêt d'Icod ou de Garachico.",
            de: "Die ganze Tour, mit dem Mittagessen bereits inklusive beim Stopp in Icod oder Garachico."
          } }
      ]
    },
    // Il fornitore da' solo "Ninos (2-11)", quindi gli adulti sono 12+.
    // La riga dei bebe' l'ufficio ha scritto di NON metterla: niente
    // `ages.infant` e niente `priceInfant`. Campo assente = "non lo
    // sappiamo", che e' esattamente la situazione — non "gratis".
    ages: { adult: "12+", child: "2-11" },
    // Tutti i giorni tranne la domenica (proprietario, 8 settembre 2026). Il
    // campo elenca i giorni buoni, non quello escluso, quindi sono sei sigle.
    // **mar e' martedi', mer e' mercoledi'.**
    days: ["lun", "mar", "mer", "gio", "ven", "sab"],
    // Sette lingue, mandate dal proprietario (8 settembre 2026). E' la scheda
    // che ne ha di piu': le cinque di `LINGUE_TOUR` piu' l'olandese e il
    // **russo**, che qui compare per la prima volta. Come sempre nella lingua
    // stessa — "Русский" in cirillico, non "Russo" — che e' come lo trova chi
    // lo parla, anche guardando il sito in spagnolo. L'ordine e' quello
    // dell'ufficio.
    languages: ["Español", "English", "Deutsch", "Русский", "Italiano", "Français", "Nederlands"],
    // Il fornitore scriveva solo il ritiro ("le recogeremos en su parada") e
    // per questo la guida era rimasta fuori. Il proprietario ha detto che la
    // guida c'e' su tutte queste escursioni (8 settembre 2026): l'ufficio sa
    // cosa vende meglio della pagina del fornitore, e la guida entra.
    included: ["transfer", "guide"],
    // Le tappe sono in ordine ma senza orario: il fornitore non li da', e
    // l'ora del ritiro cambia da fermata a fermata.
    itinerary: [
      { text: { it: "Ritiro alla fermata concordata e salita verso il Parco Nazionale delle Cañadas del Teide",
                en: "Pickup at your agreed stop and the climb up towards Las Cañadas del Teide National Park",
                es: "Recogida en su parada y subida hacia el Parque Nacional de Las Cañadas del Teide",
                fr: "Prise en charge à l'arrêt convenu et montée vers le parc national de Las Cañadas del Teide",
                de: "Abholung an der vereinbarten Haltestelle und Fahrt hinauf zum Nationalpark Las Cañadas del Teide" } },
      { text: { it: "Breve sosta a Vilaflor, il paese più alto della Spagna",
                en: "A short stop at Vilaflor, the highest village in Spain",
                es: "Breve parada en Vilaflor, el pueblo más alto de España",
                fr: "Un court arrêt à Vilaflor, le village le plus haut d'Espagne",
                de: "Ein kurzer Stopp in Vilaflor, dem höchstgelegenen Dorf Spaniens" } },
      { text: { it: "Seconda sosta dentro il Parco Nazionale, fra le colate di lava e i roques",
                en: "A second stop inside the National Park, among the lava flows and the roques",
                es: "Segunda parada dentro del Parque Nacional, entre las coladas de lava y los roques",
                fr: "Un deuxième arrêt dans le parc national, entre les coulées de lave et les roques",
                de: "Ein zweiter Stopp im Nationalpark, zwischen Lavaströmen und Roques" } },
      { text: { it: "Icod de los Vinos, dove c'è il Drago Millenario, l'albero simbolo delle Canarie",
                en: "Icod de los Vinos, home of the thousand-year-old dragon tree, the symbol of the Canaries",
                es: "Icod de los Vinos, donde está el Drago Milenario, el árbol símbolo de Canarias",
                fr: "Icod de los Vinos, où se trouve le dragonnier millénaire, symbole des Canaries",
                de: "Icod de los Vinos, Heimat des tausendjährigen Drachenbaums, des Symbols der Kanaren" } },
      { text: { it: "Si prosegue lungo la costa nord fino alla villa storica di Garachico",
                en: "On along the north coast to the historic town of Garachico",
                es: "Se sigue por la costa norte hasta la histórica Villa de Garachico",
                fr: "On continue le long de la côte nord jusqu'à la ville historique de Garachico",
                de: "Weiter an der Nordküste entlang bis zur historischen Stadt Garachico" } },
      { text: { it: "Ultima tappa a Masca, il borgo in fondo al barranco, fra pareti di roccia e vegetazione",
                en: "Last stop at Masca, the hamlet at the bottom of the ravine, among rock walls and greenery",
                es: "Última parada en Masca, el caserío en el fondo del barranco, entre paredes de roca y vegetación",
                fr: "Dernier arrêt à Masca, le hameau au fond du ravin, entre parois rocheuses et verdure",
                de: "Letzter Halt in Masca, dem Weiler am Grund der Schlucht, zwischen Felswänden und Grün" } },
      { text: { it: "Rientro in hotel",
                en: "Back to the hotel",
                es: "Vuelta al hotel",
                fr: "Retour à l'hôtel",
                de: "Rückfahrt zum Hotel" } }
    ],
    notes: [
      { it: "Il pranzo è compreso solo nella formula con pranzo: la sosta per mangiare si fa a Icod o a Garachico.",
        en: "Lunch is only included in the option with lunch: the meal stop is either in Icod or in Garachico.",
        es: "El almuerzo solo está incluido en la opción con almuerzo: la parada para comer se hace en Icod o en Garachico.",
        fr: "Le déjeuner n'est compris que dans la formule avec déjeuner : l'arrêt repas se fait à Icod ou à Garachico.",
        de: "Das Mittagessen ist nur in der Variante mit Mittagessen inklusive: Die Essenspause ist in Icod oder in Garachico." },
      { it: "Nel parco si sta sopra i 2.000 metri e fa freddo anche d'estate: porta una felpa o una giacca.",
        en: "Up in the park you are above 2,000 metres and it is cold even in summer: bring a sweatshirt or a jacket.",
        es: "En el parque se está por encima de los 2.000 metros y hace frío incluso en verano: lleva una sudadera o una chaqueta.",
        fr: "Dans le parc, on est au-dessus de 2 000 mètres et il fait froid même en été : apportez un sweat ou une veste.",
        de: "Oben im Park ist man über 2.000 Metern und es ist selbst im Sommer kalt: Bringen Sie einen Pullover oder eine Jacke mit." },
      // I giorni sono un blocco: la finestra non lascia mandare una richiesta
      // per un giorno in cui non si parte. Questa nota fa il mestiere che il
      // blocco non puo fare — dire che quei giorni non sono incisi nella
      // pietra, perche cambiano con la lingua della guida. Una riga sola: nel
      // riquadro dei consigli una nota lunga si legge come un paragrafo.
      { it: "I giorni possono cambiare secondo la lingua della guida.",
        en: "The days can change depending on the language of the guide.",
        es: "Los días pueden cambiar según el idioma del guía.",
        fr: "Les jours peuvent changer selon la langue du guide.",
        de: "Die Tage können sich je nach Sprache des Guides ändern." }
    ],
    family: true,
    desc: {
      it: "Una giornata sola per il Parco Nazionale del Teide, il Drago Millenario di Icod, la villa storica di Garachico e il borgo di Masca, con ritiro alla fermata concordata.",
      en: "A single day for Teide National Park, the thousand-year-old dragon tree of Icod, the historic town of Garachico and the hamlet of Masca, with pickup at your agreed stop.",
      es: "Un solo día para el Parque Nacional del Teide, el Drago Milenario de Icod, la histórica Villa de Garachico y el pueblo de Masca, con recogida en su parada.",
      fr: "Une seule journée pour le parc national du Teide, le dragonnier millénaire d'Icod, la ville historique de Garachico et le hameau de Masca, avec prise en charge à l'arrêt convenu.",
      de: "Ein einziger Tag für den Teide-Nationalpark, den tausendjährigen Drachenbaum von Icod, die historische Stadt Garachico und den Weiler Masca, mit Abholung an der vereinbarten Haltestelle."
    },
    image: "icod-garachico-orotava.jpg",
    published: true
  },

  // ─── STELLE E ASTRONOMIA ──────────────────────────────────────────────────
  {
    // Una scheda sola con dentro due serate, scelta del proprietario: prima
    // erano due schede, `stargazing-group` e `stargazing-vip`. Sopravvive
    // `stargazing-group`; l'indirizzo `stargazing-vip` non risponde piu', come
    // era successo ai due buggy assorbiti.
    //
    // DIETRO OGNI BOTTONE C'E' PIU' DI UN FORNITORE, e i loro nomi non si
    // pubblicano (proprietario, 10 settembre 2026). Admiral vende due
    // prodotti a due prezzi suoi, e sceglie il fornitore in base alla lingua:
    //   gruppo grande  75 EUR  pullman, inglese - spagnolo - tedesco - francese
    //   gruppo piccolo 79 EUR  minivan, italiano - inglese - tedesco
    // DUE FORNITORI PER BOTTONE, quattro in tutto. E' il motivo per cui
    // nessuna delle due varianti ha `days`, `times` o una durata sola: quei
    // campi descrivevano un fornitore solo, e lasciarli avrebbe raccontato la
    // serata sbagliata a chi sceglie l'altra lingua.
    // Stessa ragione per cui il gruppo grande **non ha un'icona per il cibo**:
    // sulla serata in inglese, spagnolo e tedesco c'e' una cena in quota, su
    // quella in francese un panino alla sosta. "Pasto incluso" sopra un panino
    // promette troppo, "Snack" sopra una cena a tre portate svende: la
    // differenza sta scritta nella descrizione, che si legge sotto il bottone
    // appena lo premi. Fuori per lo stesso motivo `photos` (gratis su una,
    // a pagamento sull'altra) e `drinks` (dichiarate solo da una).
    //
    // La lingua sta nelle etichette dei bottoni e non in `languages`: quel
    // campo sta sulla scheda e non sulla variante, e offrirebbe le lingue di
    // una serata anche all'altra. Adesso serve anche di piu' di prima, perche'
    // le due liste **si sovrappongono in parte**: chi parla inglese o tedesco
    // sceglie davvero fra le due, chi parla italiano ha solo il piccolo e chi
    // parla spagnolo solo il grande. Senza la lingua sul bottone un italiano
    // premerebbe "Gruppo grande" e lo scoprirebbe troppo tardi.
    id: "stargazing-group",
    // I titoli di Admiral erano "Stargazing - Large Group Experience" e "VIP
    // Stargazing Experience": il "VIP" e' caduto insieme ai nomi dei fornitori,
    // perche' due etichette che si confrontano su una cosa sola — quanti si e',
    // e in che lingua — si leggono in un colpo d'occhio. Da "Stargazing
    // Experience" a **"Teide by Night"** e' una scelta del proprietario: dice
    // dove si va, non solo cosa si guarda, e adesso che la scheda sta fra le
    // altre del Teide si legge in fila con loro. Uguale in tutte e cinque le
    // lingue, come tutti i titoli.
    //
    // Il 9 ottobre 2026 il proprietario l'ha cambiato in **"Teide Stars &
    // Sunset"**: "Teide by Night" e' il nome proprio dell'escursione di una
    // compagnia, e a Isla serve un nome generico. Dice le due cose della
    // serata, il tramonto e le stelle, e resta sul Teide.
    title: "Teide Stars & Sunset",
    // La compagnia della serata in italiano (gruppo piccolo), come i
    // venditori la scrivono sul ticket (proprietario, 8 ottobre 2026).
    // "Ben Stargazing": una piccola compagnia in inglese, da trattare come
    // Andromeda (proprietario, 17 ottobre 2026): fa il gruppo piccolo.
    // Tenerife Stars ("TNF Stars" sul ticket) fa il gruppo grande
    // (proprietario, 19 ottobre 2026).
    nomi: ["Andromeda", "Ben Stargazing", "Tenerife Stars", "TNF Stars"],
    // Era la sola scheda della categoria "stelle", che infatti non c'e' piu'.
    category: "teide-natura",
    // Tutte e due le serate salgono nel Parco Nazionale: qui la riga non e'
    // piu' "Da definire" come quando del gruppo grande non sapevamo niente.
    zone: { it: "Parco Nazionale del Teide", en: "Teide National Park", es: "Parque Nacional del Teide", fr: "Parc national du Teide", de: "Teide-Nationalpark" },
    // Da cinque a otto ore secondo la serata: il pullman e' il piu' lungo, il
    // minivan il piu' corto. Ogni variante scrive poi la sua.
    duration: { it: "5-8 ore", en: "5 to 8 hours", es: "5-8 horas", fr: "De 5 à 8 heures", de: "5 bis 8 Stunden" },
    zoneGroups: ["teide-nord"],
    durationGroups: ["mezza", "intera"],
    // Dal proprietario, 9 ottobre 2026: si parte intorno alle 17, e l'ora puo'
    // cambiare col tramonto. Un'ora sola nel menu; che si sposti lo dice la nota.
    times: ["17:00"],
    priceFrom: 75,
    // I prezzi a persona veri stanno dentro le varianti. Sono i prezzi di
    // ADMIRAL, non quelli dei fornitori: 75 EUR il gruppo grande, 79 EUR il
    // piccolo, e i bambini pagano 10 EUR in meno su tutte e due
    // (proprietario, 10 settembre 2026).
    priceAdult: 0,
    priceChild: 0,
    // Fasce del proprietario. Sotto i 2 anni non sappiamo se e quanto pagano:
    // `priceInfant` non si scrive, perche' assente non vuol dire gratis.
    ages: { adult: "12+", child: "2-11" },
    family: true,
    options: {
      label: { it: "Serata", en: "Evening", es: "Velada", fr: "Soirée", de: "Abend" },
      choices: [
        { label: {
            it: "Gruppo grande (inglese, spagnolo, tedesco, francese)",
            en: "Big group (English, Spanish, German, French)",
            es: "Grupo grande (inglés, español, alemán, francés)",
            fr: "Grand groupe (anglais, espagnol, allemand, français)",
            de: "Große Gruppe (Englisch, Spanisch, Deutsch, Französisch)"
          },
          // Tenerife Stars fa questa (proprietario, 19 ottobre 2026).
          nomi: ["Tenerife Stars", "TNF Stars"],
          priceAdult: 75,
          priceChild: 65,
          duration: { it: "6-8 ore", en: "6 to 8 hours", es: "6-8 horas", fr: "De 6 à 8 heures", de: "6 bis 8 Stunden" },
          included: ["transfer", "equipment"],
          desc: {
            it: "La serata in pullman, con ritiro in hotel nel sud dell'isola: si sale nel Parco Nazionale, si guarda il tramonto sopra le nuvole e poi si osserva col telescopio, con l'astronomo che racconta il cielo. Si mangia, ma non allo stesso modo: sulla serata in inglese, spagnolo e tedesco c'è una cena in quota, su quella in francese un panino alla sosta lungo la strada.",
            en: "The coach evening, with hotel pickup in the south of the island: you climb into the National Park, watch the sunset above the clouds and then observe through the telescope, with an astronomer telling the story of the sky. You eat, but not in the same way: the English, Spanish and German evening has dinner up there, the French one a sandwich at the stop along the way.",
            es: "La velada en autobús, con recogida en el hotel en el sur de la isla: se sube al Parque Nacional, se mira el atardecer por encima de las nubes y después se observa con el telescopio, con el astrónomo contando el cielo. Se come, pero no de la misma manera: la velada en inglés, español y alemán incluye una cena en altura, la de francés un bocadillo en la parada del camino.",
            fr: "La soirée en car, avec prise en charge à l'hôtel dans le sud de l'île : on monte dans le parc national, on regarde le coucher du soleil au-dessus des nuages, puis on observe au télescope, avec un astronome qui raconte le ciel. On mange, mais pas de la même façon : la soirée en anglais, espagnol et allemand dîne là-haut, la soirée en français a un sandwich à l'arrêt en chemin.",
            de: "Der Abend im Reisebus, mit Abholung am Hotel im Süden der Insel: Man fährt in den Nationalpark, sieht den Sonnenuntergang über den Wolken und beobachtet dann durchs Teleskop, während ein Astronom den Himmel erklärt. Gegessen wird, aber nicht überall gleich: Der Abend auf Englisch, Spanisch und Deutsch isst oben zu Abend, der auf Französisch bekommt ein Sandwich beim Halt unterwegs."
          } },
        { label: {
            it: "Gruppo piccolo (italiano, inglese, tedesco)",
            en: "Small group (Italian, English, German)",
            es: "Grupo pequeño (italiano, inglés, alemán)",
            fr: "Petit groupe (italien, anglais, allemand)",
            de: "Kleine Gruppe (Italienisch, Englisch, Deutsch)"
          },
          // Sul ticket c'e' solo "Andromeda", non la serata: Andromeda fa
          // questa (proprietario, 8 ottobre 2026). Vedi `nomi` in testa.
          // Ben Stargazing come Andromeda (proprietario, 17 ottobre 2026).
          nomi: ["Andromeda", "Ben Stargazing"],
          priceAdult: 79,
          priceChild: 69,
          duration: { it: "5-6 ore", en: "5 to 6 hours", es: "5-6 horas", fr: "De 5 à 6 heures", de: "5 bis 6 Stunden" },
          included: ["transfer", "equipment", "fingerfood", "drinks", "photos"],
          desc: {
            it: "La serata in minivan, in gruppo ridotto: ritiro in hotel, tramonto sopra le nuvole con un picnic preparato dal fornitore e compreso nel prezzo — da mangiare e da bere all'aperto, non una cena a tavola — e poi il telescopio col buio. Sulla serata in inglese e tedesco si è al massimo in otto; quella in italiano è un gruppo un po' più largo, con l'astrofotografia e la foto della galassia da portare a casa.",
            en: "The minivan evening, in a small group: hotel pickup, sunset above the clouds with a picnic laid on by the operator and included in the price — food and drink outdoors, not a sit-down dinner — then the telescope once it is dark. The English and German evening is eight people at most; the Italian one is a slightly larger group, with live astrophotography and a photo of the galaxy to take home.",
            es: "La velada en minivan, en grupo reducido: recogida en el hotel, atardecer por encima de las nubes con un picnic preparado por el proveedor e incluido en el precio — de comer y beber al aire libre, no una cena de mesa — y después el telescopio ya de noche. La velada en inglés y alemán es de ocho personas como máximo; la de italiano es un grupo algo más amplio, con astrofotografía en directo y una foto de la galaxia para llevarse a casa.",
            fr: "La soirée en minivan, en petit groupe : prise en charge à l'hôtel, coucher du soleil au-dessus des nuages avec un pique-nique offert par l'opérateur et compris dans le prix — à manger et à boire en plein air, pas un dîner assis — puis le télescope une fois la nuit tombée. La soirée en anglais et allemand, c'est huit personnes au maximum ; celle en italien, un groupe un peu plus grand, avec astrophotographie en direct et une photo de la galaxie à emporter.",
            de: "Der Abend im Minivan, in kleiner Gruppe: Abholung am Hotel, Sonnenuntergang über den Wolken mit einem Picknick vom Anbieter, im Preis inbegriffen — Essen und Trinken im Freien, kein Abendessen am Tisch — dann das Teleskop, sobald es dunkel ist. Der Abend auf Englisch und Deutsch hat höchstens acht Personen; der auf Italienisch ist eine etwas größere Gruppe, mit Live-Astrofotografie und einem Foto der Galaxie zum Mitnehmen."
          } }
      ]
    },
    desc: {
      it: "Una sera in quota, sopra le nuvole: prima il tramonto, poi il buio vero, quello in cui le stelle si vedono a occhio nudo prima ancora di guardare nel telescopio. Due serate fra cui scegliere, e cambia anche la lingua: il gruppo grande sale in pullman e si fa in inglese, spagnolo, tedesco e francese; il gruppo piccolo va in minivan e al tramonto ti offre un picnic, compreso nel prezzo, in italiano, inglese e tedesco.",
      en: "An evening high up, above the clouds: first the sunset, then real darkness, the kind where you see the stars with the naked eye before you even look through the telescope. Two evenings to choose from, and the language changes too: the big group goes up by coach and runs in English, Spanish, German and French; the small group travels by minivan and lays on a picnic at sunset, included in the price, in Italian, English and German.",
      es: "Una tarde en altura, por encima de las nubes: primero el atardecer y después la oscuridad de verdad, esa en la que se ven las estrellas a simple vista antes incluso de mirar por el telescopio. Dos veladas a elegir, y el idioma también cambia: el grupo grande sube en autobús y se hace en inglés, español, alemán y francés; el grupo pequeño va en minivan y al atardecer te ofrece un picnic, incluido en el precio, en italiano, inglés y alemán.",
      fr: "Une soirée en altitude, au-dessus des nuages : d'abord le coucher du soleil, puis la vraie nuit, celle où l'on voit les étoiles à l'œil nu avant même de regarder dans le télescope. Deux soirées au choix, et la langue change aussi : le grand groupe monte en car et se fait en anglais, espagnol, allemand et français ; le petit groupe part en minivan et vous offre un pique-nique au coucher du soleil, compris dans le prix, en italien, anglais et allemand.",
      de: "Ein Abend in der Höhe, über den Wolken: erst der Sonnenuntergang, dann echte Dunkelheit, in der man die Sterne mit bloßem Auge sieht, noch bevor man durchs Teleskop schaut. Zwei Abende zur Wahl, und auch die Sprache ändert sich: Die große Gruppe fährt im Reisebus und ist auf Englisch, Spanisch, Deutsch und Französisch; die kleine Gruppe fährt im Minivan und bietet zum Sonnenuntergang ein Picknick, im Preis inbegriffen, auf Italienisch, Englisch und Deutsch."
    },
    included: ["guide"],
    // Le tappe stanno sulla scheda e non sulla variante, perche' `itinerary`
    // dentro `options.choices[]` non esiste. Sono scritte al livello che e'
    // vero per tutti e quattro i fornitori: nessuna quota, nessuna durata
    // della sessione, nessun nome di paese — quelli cambiavano da una serata
    // all'altra e qui direbbero "vale sempre".
    itinerary: [
      { text: {
          it: "Il ritiro in hotel, nel pomeriggio: si parte dagli hotel del sud dell'isola.",
          en: "Hotel pickup in the afternoon: you set off from the hotels in the south of the island.",
          es: "La recogida en el hotel, por la tarde: se sale desde los hoteles del sur de la isla.",
          fr: "Prise en charge à l'hôtel l'après-midi : on part des hôtels du sud de l'île.",
          de: "Abholung am Hotel am Nachmittag: Abfahrt von den Hotels im Süden der Insel."
        } },
      { text: {
          it: "Si sale verso il Parco Nazionale, con la sosta per mangiare: una cena, un panino o un picnic secondo la serata scelta. Lo porta il fornitore, non c'è niente da preparare a casa.",
          en: "Up towards the National Park, with a stop to eat: dinner, a sandwich or a picnic depending on the evening you choose. The operator brings it — there is nothing to pack at home.",
          es: "Se sube hacia el Parque Nacional, con la parada para comer: una cena, un bocadillo o un picnic según la velada elegida. Lo pone el proveedor, no hay nada que preparar en casa.",
          fr: "Montée vers le parc national, avec un arrêt pour manger : dîner, sandwich ou pique-nique selon la soirée choisie. C'est l'opérateur qui l'apporte — rien à préparer à la maison.",
          de: "Hinauf zum Nationalpark, mit einem Halt zum Essen: Abendessen, Sandwich oder Picknick, je nach gewähltem Abend. Das bringt der Anbieter mit — zu Hause müssen Sie nichts einpacken."
        } },
      { text: {
          it: "Il tramonto visto dall'alto, sopra il mare di nuvole.",
          en: "The sunset seen from up there, above the sea of clouds.",
          es: "El atardecer visto desde arriba, por encima del mar de nubes.",
          fr: "Le coucher du soleil vu de là-haut, au-dessus de la mer de nuages.",
          de: "Der Sonnenuntergang von dort oben, über dem Wolkenmeer."
        } },
      { text: {
          it: "Col buio l'osservazione col telescopio: pianeti, costellazioni e la guida che racconta cosa si sta guardando.",
          en: "Once it is dark, the telescope session: planets, constellations and the guide talking you through what you are looking at.",
          es: "Ya de noche, la observación con telescopio: planetas, constelaciones y el guía contando lo que se está viendo.",
          fr: "Une fois la nuit tombée, la séance au télescope : planètes, constellations et le guide qui vous explique ce que vous regardez.",
          de: "Sobald es dunkel ist, die Teleskop-Session: Planeten, Sternbilder und der Guide, der erklärt, was Sie sehen."
        } },
      { text: {
          it: "Rientro in hotel a sera.",
          en: "Back at the hotel in the evening.",
          es: "Regreso al hotel por la noche.",
          fr: "Retour à l'hôtel dans la soirée.",
          de: "Am Abend zurück am Hotel."
        } }
    ],
    notes: [
      {
        it: "La lingua non è un extra da chiedere: è quello che decide la serata. In italiano si va solo col gruppo piccolo; in spagnolo e in francese solo col grande; in inglese e tedesco si può scegliere. Scrivi la tua nella richiesta e l'ufficio ti mette sulla partenza giusta.",
        en: "The language is not an extra to ask for: it is what decides the evening. In Italian only the small group runs; in Spanish and French only the big one; in English and German you can choose. Say yours in the request and the office puts you on the right departure.",
        es: "El idioma no es un extra que se pida: es lo que decide la velada. En italiano solo va el grupo pequeño; en español y en francés solo el grande; en inglés y alemán se puede elegir. Indica el tuyo en la solicitud y la oficina te pone en la salida correcta.",
        fr: "La langue n'est pas une option à demander : c'est elle qui décide la soirée. En italien, seul le petit groupe part ; en espagnol et en français, seulement le grand ; en anglais et en allemand, on peut choisir. Indiquez la vôtre dans la demande et le bureau vous place sur le bon départ.",
        de: "Die Sprache ist kein Extra, das man anfragt: Sie entscheidet den Abend. Auf Italienisch fährt nur die kleine Gruppe; auf Spanisch und Französisch nur die große; auf Englisch und Deutsch kann man wählen. Schreiben Sie Ihre Sprache in die Anfrage, und das Büro setzt Sie auf die richtige Abfahrt."
      },
      {
        it: "Il ritiro è negli hotel del sud dell'isola, intorno alle 17: l'ora segue il tramonto e può cambiare con la stagione, quindi te la conferma l'ufficio insieme al punto di ritiro.",
        en: "Pickup is at hotels in the south of the island, at around 5 pm: the time follows the sunset and may change with the season, so the office confirms it together with the pickup point.",
        es: "La recogida es en los hoteles del sur de la isla, hacia las 17:00: la hora sigue al atardecer y puede cambiar con la temporada, así que te la confirma la oficina junto con el punto de recogida.",
        fr: "La prise en charge se fait aux hôtels du sud de l'île, vers 17 heures : l'heure suit le coucher du soleil et peut changer avec la saison, donc le bureau la confirme avec le point de prise en charge.",
        de: "Die Abholung ist an Hotels im Süden der Insel, gegen 17 Uhr: Die Uhrzeit richtet sich nach dem Sonnenuntergang und kann sich mit der Jahreszeit ändern, deshalb bestätigt das Büro sie zusammen mit dem Abholpunkt."
      },
      {
        it: "Si sta fermi al buio e in quota: fa freddo anche d'estate. Su qualche serata giacca e cappello li presta il fornitore, ma non su tutte: vestiti a strati e mettiti scarpe chiuse.",
        en: "You stand still in the dark, high up: it gets cold even in summer. On some evenings the operator lends a jacket and hat, but not on all of them: dress in layers and wear closed shoes.",
        es: "Se está quieto a oscuras y en altura: hace frío incluso en verano. En algunas veladas el proveedor presta chaqueta y gorro, pero no en todas: vístete por capas y ponte zapatos cerrados.",
        fr: "On reste immobile dans le noir, en altitude : il fait froid même en été. Certains soirs, l'opérateur prête veste et bonnet, mais pas tous : habillez-vous en couches et portez des chaussures fermées.",
        de: "Man steht in der Höhe still im Dunkeln: Es wird selbst im Sommer kalt. An manchen Abenden leiht der Anbieter Jacke und Mütze, aber nicht an allen: Ziehen Sie sich in Schichten an und tragen Sie geschlossene Schuhe."
      }
    ],
    image: "stargazing-group.webp",
    // La terza foto era `Cat-stelle.jpg`, il riquadro della categoria "stelle"
    // che non esiste piu': rinominata col nome della scheda, perche' una foto
    // qui dentro si chiama come la scheda che la usa, non come il posto da cui
    // arriva. E' il Roque Cinchado sotto l'arco della Via Lattea, cioe' la
    // sagoma che si riconosce del Parco Nazionale: col titolo sul Teide,
    // quella e' la foto che lo fa vedere.
    //
    // In fila si leggono come una sera che passa: il tramonto sopra le nuvole,
    // poi il buio con la Via Lattea. La copertina resta quella dei due
    // telescopi.
    gallery: ["stargazing-vip.webp", "teide-by-night.webp", "stargazing-group-2.webp", "stargazing-group-3.webp", "stargazing-group-4.webp", "stargazing-group-5.webp"],
    published: true
  },

  // ─── AVVENTURA E MOTORI ───────────────────────────────────────────────────
  {
    // Era un segnaposto della vetrina Admiral: solo il prezzo (250) e la foto,
    // zona e durata "Da definire". I dati veri sono arrivati il 12 settembre
    // 2026 e sono quelli del "Mustang Sunset Tour al Teide" di Pirati
    // Tenerife: stesso prezzo di partenza, stessa Mustang decappottabile,
    // stessa meta, e la foto che c'era gia' e' proprio quella — una Mustang
    // blu ai Roques de Garcia col sole basso.
    // L'id resta `mustang-experience` e non diventa `mustang-sunset-teide`:
    // e' la stessa scelta fatta per i tre giri in buggy, gli indirizzi gia' in
    // giro devono continuare a funzionare. Anche il titolo resta quello di
    // Admiral, come tutti i titoli.
    // Attenzione se un domani arrivano altri dati Mustang: Pirati Tenerife ha
    // **due** prodotti, questo al tramonto e un "Mustang Teide" diurno che e'
    // un'altra cosa. Il secondo non e' una scheda nuova, e' una variante di
    // questa — come i tre percorsi del buggy qui sotto.
    id: "mustang-experience",
    title: "Mustang Experience",
    // Sta anche in "Natura, Teide e stelle" (proprietario, 14 settembre 2026):
    // la meta e' il Parco Nazionale, e chi cerca cosa fare al Teide questa la
    // deve trovare. La principale resta l'avventura, perche' la cosa che si
    // compra e' la Mustang: il posto dove va e' la seconda meta' della frase.
    category: "avventura-motori",
    alsoIn: ["teide-natura"],
    zone: "Adeje",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["mezza"],
    priceFrom: 250,
    // Il prezzo e' dell'**auto**, non della persona, e cambia con quanti si
    // sale: 250 € fino a due, 350 € da tre a quattro. Con `priceUnit` il sito
    // smette di moltiplicare per le persone (prezziAPersona() torna null) e
    // scrive "da €250 a Mustang" invece di un totale falso.
    priceUnit: { it: "a Mustang", en: "per Mustang", es: "por Mustang", fr: "par Mustang", de: "pro Mustang" },
    // Le due fasce restano scritte anche in "In breve": `units` piu' sotto e'
    // la finestra della richiesta, qui e' il listino che si legge prima di
    // arrivarci. Non si ripetono a vicenda, stanno in due posti diversi.
    priceTiers: [
      { from: 1, to: 2, price: 250 },
      { from: 3, to: 4, price: 350 }
    ],
    // Le Mustang si contano, e possono essere piu' di una: in sei si va con
    // due auto, una con quattro e una con due, e sono due prezzi diversi
    // (350 + 250). E' la stessa forma del jet ski, dove quattro amici sono
    // "due doppie e due singole".
    // I due "tipi" non sono due modelli di auto ma le due fasce di prezzo:
    // e' quanti salgono a cambiare il prezzo dell'auto, non l'auto.
    // `units` **sostituisce** "Quante persone" nella finestra (mostraPersone()
    // la nasconde): il numero delle persone e' gia' dentro il nome della
    // fascia, e chiederlo due volte darebbe due conti da far tornare.
    units: {
      label: {
        it: "Quante Mustang — il prezzo è dell'auto e cambia con quanti ci salgono",
        en: "How many Mustangs — the price is per car and changes with how many get in",
        es: "¿Cuántos Mustang? — el precio es del coche y cambia según cuántos suban",
        fr: "Combien de Mustang — le prix est par voiture et change selon le nombre de passagers",
        de: "Wie viele Mustangs — der Preis gilt pro Auto und ändert sich mit der Anzahl der Insassen"
      },
      name: { it: "Mustang", en: "Mustangs", es: "Mustang", fr: "Mustang", de: "Mustangs" },
      // `seats` e' il massimo della fascia, non un numero fisso: la fascia
      // "Con 1 o 2 persone" porta fino a due. E' quello che serve al conto —
      // quanti ce ne stanno — e il prezzo e' lo stesso che ci salga uno o due.
      types: [
        { key: "due", seats: 2, name: { it: "Con 1 o 2 persone", en: "With 1 or 2 people", es: "Con 1 o 2 personas", fr: "Avec 1 ou 2 personnes", de: "Mit 1 oder 2 Personen" } },
        { key: "quattro", seats: 4, name: { it: "Con 3 o 4 persone", en: "With 3 or 4 people", es: "Con 3 o 4 personas", fr: "Avec 3 ou 4 personnes", de: "Mit 3 oder 4 Personen" } }
      ]
      // Niente `transferPrice` perche' qui non c'e' nessuna casella del
      // ritiro: e' **compreso nel prezzo** (proprietario, 12 settembre 2026) e
      // sta fra le icone di `included`, non nel campo `transfer` — vedi il
      // commento li' sotto. Se un giorno la casella ci finisse, il campo da
      // mettere sarebbe `transferPrice: 0` ("compreso"), non l'assenza, che
      // vuol dire "quanto costa non lo sappiamo" e fa sparire il totale.
    },
    // Il prezzo di ogni fascia. Sta sulla scheda e non dentro una variante
    // perche' qui varianti non ce ne sono: a cambiare non e' la durata, e'
    // quanti salgono.
    unitPrices: { due: 250, quattro: 350 },
    priceAdult: 0,
    priceChild: 0,
    // Nessuna tariffa ridotta per i bambini (fornitore). Non e' scritto da
    // nessuna parte se e da che eta' si sale, quindi niente `ages` e niente
    // `priceInfant`: assente non vuol dire gratis. `family` resta false in
    // attesa di sapere l'eta' minima.
    family: false,
    // L'auto e' tutta del cliente e l'ora segue il tramonto, che si sposta di
    // ore fra dicembre e giugno: e' il caso del charter, `times: []` lascia
    // "Da concordare" come unica voce. Il fornitore dice "a partire dalle
    // 17:00" e quel riferimento sta nelle note, dove si puo' spiegare; messo
    // in `times` sarebbe diventato un orario da scegliere, cioe' una promessa.
    times: [],
    // Si fa tutti i giorni: `days` non si scrive.
    languages: ["Italiano", "English", "Français", "Español"],
    // I due scaglioni del prezzo erano `priceTiers`, cioe' due righe da
    // **leggere** sulla pagina di dettaglio e niente altro: il cliente non
    // poteva dire in quanti sale, e nel messaggio all'ufficio non finiva
    // niente. Diventati `options`, sono due bottoni sulla scheda e una tendina
    // nella finestra della richiesta, e la scelta arriva su WhatsApp.
    // `price` e non `priceAdult`: il numero e' dell'auto, non della persona, e
    // `priceAdult` lo farebbe moltiplicare per quanti sono — 350 × 4.
    // `priceTiers` e' stato tolto e non tenuto insieme: avrebbe scritto gli
    // stessi due numeri una seconda volta, sopra i bottoni che li dicono gia'.
    desc: {
      it: "Una Ford Mustang decappottabile solo per te, su per la strada del Parco Nazionale del Teide con la luce della sera: si sale fra le colate di lava fino alla Cañada Blanca e si torna che è già buio. Guidi tu, se hai la patente; se preferisci non guidare, l'auto la porta una guida dell'agenzia. Il prezzo è dell'auto e non a persona, e il ritiro in hotel è compreso.",
      en: "A Ford Mustang convertible just for you, up the road into Teide National Park in the evening light: you climb between the lava flows as far as Cañada Blanca and come back down after dark. You drive, if you hold a licence; if you would rather not, one of the agency's guides takes the wheel. The price is for the car and not per person, and hotel pickup is included.",
      es: "Un Ford Mustang descapotable solo para ti, subiendo por la carretera del Parque Nacional del Teide con la luz de la tarde: se sube entre las coladas de lava hasta la Cañada Blanca y se vuelve ya de noche. Conduces tú, si tienes carné; si prefieres no conducir, el coche lo lleva un guía de la agencia. El precio es del coche y no por persona, y la recogida en el hotel está incluida.",
      fr: "Une Ford Mustang décapotable rien que pour vous, sur la route du parc national du Teide dans la lumière du soir : on monte entre les coulées de lave jusqu'à Cañada Blanca et on redescend à la nuit tombée. Vous conduisez, si vous avez le permis ; si vous préférez ne pas conduire, un des guides de l'agence prend le volant. Le prix est pour la voiture et non par personne, et la prise en charge à l'hôtel est comprise.",
      de: "Ein Ford Mustang Cabrio nur für Sie, auf der Straße in den Teide-Nationalpark im Abendlicht: Sie fahren zwischen den Lavaströmen hinauf bis Cañada Blanca und kommen nach Einbruch der Dunkelheit wieder herunter. Sie fahren selbst, wenn Sie einen Führerschein haben; wenn Sie lieber nicht fahren, übernimmt einer der Guides der Agentur das Steuer. Der Preis gilt für das Auto und nicht pro Person, und die Abholung am Hotel ist inklusive."
    },
    // `transfer` sta qui fra le icone, e **non** nel campo `transfer` della
    // scheda, che quello vuol dire un'altra cosa: "si puo' avere col trasporto
    // incluso", cioe' una cosa da chiedere e magari da pagare. Qui il ritiro
    // e' compreso per tutti e sempre, che e' esattamente quello che dicono le
    // icone. Tenendo il campo, la finestra della richiesta avrebbe continuato
    // a chiedere "Vuoi il transfer?" e un cliente che risponde no avrebbe
    // mandato all'ufficio "Transfer: no" su un ritiro che e' gia' pagato.
    included: ["snack", "drinks", "transfer"],
    itinerary: [
      { text: {
          it: "Il ritiro in hotel, nel tardo pomeriggio, e la partenza da Adeje con la capote abbassata.",
          en: "Hotel pickup in the late afternoon, then off from Adeje with the roof down.",
          es: "La recogida en el hotel, a última hora de la tarde, y la salida desde Adeje con la capota bajada.",
          fr: "Prise en charge à l'hôtel en fin d'après-midi, puis départ d'Adeje, capote baissée.",
          de: "Abholung am Hotel am späten Nachmittag, dann geht es mit offenem Verdeck ab Adeje los."
        } },
      { text: {
          it: "La salita al Parco Nazionale del Teide: la strada che sale fra i pini e poi esce sull'altopiano.",
          en: "The climb into Teide National Park: the road up through the pines, then out onto the plateau.",
          es: "La subida al Parque Nacional del Teide: la carretera que sube entre los pinos y sale a la llanura.",
          fr: "La montée dans le parc national du Teide : la route à travers les pins, puis l'arrivée sur le plateau.",
          de: "Die Fahrt hinauf in den Teide-Nationalpark: die Straße durch die Kiefern, dann hinaus auf die Hochebene."
        } },
      { text: {
          it: "Cañada Blanca, con la sosta per le foto mentre il sole va giù dietro le colate di lava.",
          en: "Cañada Blanca, with a photo stop while the sun drops behind the lava flows.",
          es: "Cañada Blanca, con la parada para las fotos mientras el sol baja detrás de las coladas de lava.",
          fr: "Cañada Blanca, avec un arrêt photo pendant que le soleil descend derrière les coulées de lave.",
          de: "Cañada Blanca, mit Fotostopp, während die Sonne hinter den Lavaströmen versinkt."
        } },
      { text: {
          it: "Il ritorno verso la costa, col buio.",
          en: "The drive back down to the coast, in the dark.",
          es: "La vuelta hacia la costa, ya de noche.",
          fr: "La redescente vers la côte, dans le noir.",
          de: "Die Rückfahrt hinunter zur Küste, im Dunkeln."
        } }
    ],
    notes: [
      { it: "Per guidare serve la patente di guida in corso di validità. Se preferisci non guidare tu, l'auto la porta una guida dell'agenzia: scrivilo nella richiesta.",
        en: "To drive you need a valid driving licence. If you would rather not drive, one of the agency's guides takes the wheel: say so in your request.",
        es: "Para conducir hace falta un carné de conducir en vigor. Si prefieres no conducir, el coche lo lleva un guía de la agencia: escríbelo en la solicitud.",
        fr: "Pour conduire, il faut un permis de conduire valide. Si vous préférez ne pas conduire, un des guides de l'agence prend le volant : indiquez-le dans la demande.",
        de: "Zum Fahren brauchen Sie einen gültigen Führerschein. Wenn Sie lieber nicht fahren, übernimmt einer der Guides der Agentur das Steuer: Schreiben Sie es in die Anfrage." },
      { it: "Si parte nel tardo pomeriggio, non prima delle 17:00: l'ora esatta segue il tramonto e si muove con la stagione, quindi te la conferma l'ufficio.",
        en: "You set off in the late afternoon, not before 17:00: the exact time follows the sunset and moves with the season, so the office confirms it with you.",
        es: "Se sale a última hora de la tarde, no antes de las 17:00: la hora exacta sigue al atardecer y se mueve con la temporada, así que te la confirma la oficina.",
        fr: "On part en fin d'après-midi, pas avant 17:00 : l'heure exacte suit le coucher du soleil et change avec la saison, donc le bureau vous la confirme.",
        de: "Los geht es am späten Nachmittag, nicht vor 17:00: Die genaue Uhrzeit richtet sich nach dem Sonnenuntergang und ändert sich mit der Jahreszeit, deshalb bestätigt das Büro sie Ihnen." },
      // Il ritiro e' compreso, quindi non e' una domanda ma un fatto: sta
      // fra le icone e detto per esteso qui, non nel campo `transfer`.
      { it: "Il ritiro in hotel è compreso nel prezzo: passano a prenderti sotto il tuo albergo, senza supplemento. Scrivi dove alloggi nella richiesta; se non trovi il tuo hotel nell'elenco, mettilo nelle note.",
        en: "Hotel pickup is included in the price: they come for you at your own hotel, with no supplement. Put where you are staying in the request; if you cannot find your hotel in the list, write it in the notes.",
        es: "La recogida en el hotel está incluida en el precio: te recogen en tu propio hotel, sin suplemento. Escribe dónde te alojas en la solicitud; si no encuentras tu hotel en la lista, ponlo en las notas.",
        fr: "La prise en charge à l'hôtel est comprise dans le prix : on vient vous chercher à votre hôtel, sans supplément. Indiquez où vous logez dans la demande ; si vous ne trouvez pas votre hôtel dans la liste, écrivez-le dans les notes.",
        de: "Die Abholung am Hotel ist im Preis inbegriffen: Man holt Sie an Ihrem eigenen Hotel ab, ohne Aufpreis. Geben Sie in der Anfrage an, wo Sie wohnen; finden Sie Ihr Hotel nicht in der Liste, schreiben Sie es in die Notizen." },
      // I due numeri non si ripetono qui: li dicono gia' le righe di "In
      // breve" e i contatori della richiesta. Quello che resta e' il
      // principio, piu' la capienza — che era dentro le vecchie varianti e
      // senza questa riga andava persa.
      { it: "Il prezzo è dell'auto e non della persona: a cambiare è quanti ci salgono, non quanto paga ognuno. In Mustang si sta in quattro al massimo, autista compreso; se siete di più si prendono due auto, e nella richiesta le conti tu.",
        en: "The price is for the car, not per person: what changes is how many of you get in, not what each one pays. The Mustang seats four at most, driver included; if there are more of you, you take two cars — you count them yourself in the request.",
        es: "El precio es del coche y no por persona: lo que cambia es cuántos subís, no lo que paga cada uno. En el Mustang caben cuatro como máximo, conductor incluido; si sois más se cogen dos coches, y en la solicitud los cuentas tú.",
        fr: "Le prix est pour la voiture, pas par personne : ce qui change, c'est combien vous êtes à bord, pas ce que chacun paie. La Mustang a quatre places au maximum, conducteur compris ; si vous êtes plus nombreux, vous prenez deux voitures — vous les comptez vous-même dans la demande.",
        de: "Der Preis gilt für das Auto, nicht pro Person: Was sich ändert, ist, wie viele einsteigen, nicht was jeder zahlt. Der Mustang hat höchstens vier Plätze, Fahrer inklusive; sind Sie mehr, nehmen Sie zwei Autos — die zählen Sie selbst in der Anfrage." },
      { it: "Si va con la capote abbassata e lassù si passano i 2.000 metri: al tramonto fa fresco anche d'estate. Porta una felpa o una giacca.",
        en: "You travel with the roof down and up there you go above 2,000 metres: at sunset it is chilly even in summer. Bring a sweatshirt or a jacket.",
        es: "Se va con la capota bajada y allí arriba se pasan los 2.000 metros: al atardecer refresca incluso en verano. Lleva una sudadera o una chaqueta.",
        fr: "On roule capote baissée et là-haut on dépasse les 2 000 mètres : au coucher du soleil, il fait frais même en été. Apportez un sweat ou une veste.",
        de: "Man fährt mit offenem Verdeck, und oben geht es über 2.000 Meter: Bei Sonnenuntergang ist es selbst im Sommer frisch. Bringen Sie einen Pullover oder eine Jacke mit." }
    ],
    // Niente campo `transfer`: il ritiro e' compreso, e sta fra le icone di
    // `included` piu' sopra. Passano sotto l'hotel (proprietario, 12
    // settembre 2026), ed e' per questo che la scheda sta in PICKUP_IN_HOTEL
    // in hotel.js: se no il cliente leggerebbe una fermata delle tabelle di
    // Island Excursions, che e' un altro fornitore e un altro giro.
    // Stessa foto della card "Avventura e motori" in home: `mustang-experience.jpg`
    // era un doppione byte per byte di `Cat-avventura.webp`, cioe' 202 KB che il
    // telefono scaricava due volte. Tolto il doppione e puntata questa, come si
    // fa col Twin Ticket su `Cat-parchi.webp`.
    // ⚠ Adesso le due immagini sono LEGATE: cambiare la foto del Mustang
    // cambia anche quella della categoria in home. Se un giorno devono essere
    // diverse, si rimette un file suo.
    image: "Cat-avventura.webp",
    published: true
  },
  {
    // Una scheda sola per i tre giri in buggy di King Buggy Tenerife: prima
    // erano tre schede (`buggy-volcano-4h` per il Teide, `buggy-volcano-sunset`
    // per il tramonto, `buggy-2-3h` per il fuoristrada), nate da un'altra fonte
    // e uguali in tutto tranne la foto, il titolo e la durata. Stesso
    // fornitore, stessi buggy, stessa base: affiancate in elenco sembravano tre
    // attivita' diverse quando sono tre percorsi della stessa.
    // Sopravvive l'id `buggy-volcano-4h`, non uno nuovo, perche' gli indirizzi
    // gia' in giro continuino a funzionare — come si era fatto per i due quad.
    id: "buggy-volcano-4h",
    title: "Buggy Tour Tenerife",
    // Le due compagnie che portano questi giri, come i venditori le scrivono
    // sul ticket. Tutte e due sulla scheda e non su una variante: Offroad e
    // Tramonto li fanno entrambe, e il nome da solo non dice quale giro e'.
    // Top Buggy e' una compagnia in piu' (proprietario, 19 ottobre 2026), e
    // Paradise ("Buggy Paradise", "Paradise Bug") anche (29 ottobre 2026).
    nomi: ["King Buggy", "Ultimate Buggies", "Ultimate Buggy", "Top Buggy", "Paradise"],
    // Anche fra Teide e natura (proprietario, 14 settembre 2026). Qui `alsoIn`
    // e' della scheda e non della variante: dei quattro giri due salgono al
    // Parco Nazionale (Tramonto sul Teide e Completo) e due no, ma la scheda
    // e' una e ci si arriva per quella. Chi entra dal Teide legge i bottoni e
    // sceglie il giro giusto — un filtro che nascondesse le altre due varianti
    // vorrebbe dire quattro schede di nuovo separate, che e' esattamente
    // quello da cui si e' venuti via.
    category: "avventura-motori",
    alsoIn: ["teide-natura"],
    zone: "Las Chafiras",
    duration: { it: "3 o 4 ore", en: "3 or 4 hours", es: "3 o 4 horas", fr: "3 ou 4 heures", de: "3 oder 4 Stunden" },
    zoneGroups: ["los-cristianos", "costa-adeje"],
    durationGroups: ["mezza"],
    priceFrom: 180,
    // Il prezzo e' del buggy e non della persona: 180 € il buggy da 2 posti,
    // 240 € quello da 4, 330 € quello da 6, uguali su tutti e quattro i giri
    // (prezzi Admiral, 9 settembre). Senza questo campo il totale
    // moltiplicherebbe per le persone un numero che il mezzo lo comprende
    // gia' tutto.
    priceUnit: { it: "/buggy", en: "/buggy", es: "/buggy", fr: "/buggy", de: "/Buggy" },
    units: {
      label: {
        it: "Quanti buggy — il prezzo è del mezzo e cambia con i posti",
        en: "How many buggies — the price is per buggy and changes with the seats",
        es: "¿Cuántos buggies? — el precio es por buggy y cambia con las plazas",
        fr: "Combien de buggys — le prix est par buggy et change selon les places",
        de: "Wie viele Buggys — der Preis gilt pro Buggy und ändert sich mit den Plätzen"
      },
      name: { it: "Buggy", en: "Buggies", es: "Buggies", fr: "Buggys", de: "Buggys" },
      // Il transfer dei giri di King Buggy e' gratis (proprietario, 19 ottobre
      // 2026): 0 vuol dire "compreso". Senza il campo, col transfer spuntato
      // il totale spariva e il buggy usciva dal totale della lista.
      transferPrice: 0,
      types: [
        { key: "due", seats: 2, name: { it: "2 posti", en: "2 seats", es: "2 plazas", fr: "2 places", de: "2 Plätze" } },
        { key: "quattro", seats: 4, name: { it: "4 posti", en: "4 seats", es: "4 plazas", fr: "4 places", de: "4 Plätze" } },
        { key: "sei", seats: 6, name: { it: "6 posti", en: "6 seats", es: "6 plazas", fr: "6 places", de: "6 Plätze" } }
      ]
    },
    priceAdult: 0,
    priceChild: 0,
    family: false,
    // I tre percorsi del fornitore. I prezzi stanno dentro le varianti anche se
    // oggi sono uguali su tutte e tre: e' li' che il sito li legge per scriverli
    // accanto ai contatori, ed e' li' che andranno cambiati se un giro comincia
    // a costare piu' di un altro.
    // Gli orari sono le PARTENZE delle due compagnie (proprietario, 5 ottobre
    // 2026): King Buggy 8:20, 14:00 e tramonto 17:30; Ultimate 11:00, 13:30 e
    // tramonto 18:00. Su ogni giro ci sono solo le ore di chi lo fa davvero:
    // Offroad e Tramonto tutte e due, Completo solo King, Montagna su strada
    // solo Ultimate. Il cliente sceglie l'ora, non la compagnia: chi lo porta
    // lo decide l'ufficio quando conferma.
    options: {
      label: { it: "Percorso", en: "Route", es: "Recorrido", fr: "Parcours", de: "Route" },
      choices: [
        { label: { it: "Offroad, 3 ore", en: "Off-road, 3 hours", es: "Offroad, 3 horas", fr: "Tout-terrain, 3 heures", de: "Offroad, 3 Stunden" },
          price: 180,
          transfer: {
            it: "Passiamo a prenderti.",
            en: "We'll pick you up.",
            es: "Pasamos a recogerte.",
            fr: "Nous venons vous chercher.",
            de: "Wir holen Sie ab."
          },
          times: ["08:20", "11:00", "13:30", "14:00"],
          duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
          unitPrices: { due: 180, quattro: 240, sei: 330 },
          desc: {
            it: "Il giro vicino alla costa, con la parte fuori dall'asfalto: sterrato, polvere e saliscendi nel sud dell'isola.",
            en: "The route close to the coast, with the off-road part: dirt tracks, dust and climbs in the south of the island.",
            es: "El recorrido cerca de la costa, con la parte fuera del asfalto: pistas de tierra, polvo y subidas en el sur de la isla.",
            fr: "Le parcours près de la côte, avec la partie tout-terrain : pistes en terre, poussière et montées dans le sud de l'île.",
            de: "Die Route nahe der Küste, mit dem Offroad-Teil: Schotterwege, Staub und Anstiege im Süden der Insel."
          } },
        { label: { it: "Tramonto sul Teide, 3 ore", en: "Teide at sunset, 3 hours", es: "Atardecer en el Teide, 3 horas", fr: "Le Teide au coucher du soleil, 3 heures", de: "Teide bei Sonnenuntergang, 3 Stunden" },
          price: 180,
          transfer: {
            it: "Passiamo a prenderti.",
            en: "We'll pick you up.",
            es: "Pasamos a recogerte.",
            fr: "Nous venons vous chercher.",
            de: "Wir holen Sie ab."
          },
          times: ["17:30", "18:00"],
          duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
          unitPrices: { due: 180, quattro: 240, sei: 330 },
          desc: {
            it: "Su verso il Teide con la luce della sera, tutto su strada: le soste per le foto quando il sole è basso.",
            en: "Up towards Teide in the evening light, all on paved roads: photo stops while the sun is low.",
            es: "Subida hacia el Teide con la luz de la tarde, todo por carretera: las paradas para fotos cuando el sol está bajo.",
            fr: "Montée vers le Teide dans la lumière du soir, tout sur routes goudronnées : arrêts photo pendant que le soleil est bas.",
            de: "Hinauf zum Teide im Abendlicht, alles auf Asphalt: Fotostopps, während die Sonne tief steht."
          } },
        { label: { it: "Completo, 4 ore", en: "Full tour, 4 hours", es: "Completo, 4 horas", fr: "Tour complet, 4 heures", de: "Komplette Tour, 4 Stunden" },
          price: 180,
          transfer: {
            it: "Passiamo a prenderti.",
            en: "We'll pick you up.",
            es: "Pasamos a recogerte.",
            fr: "Nous venons vous chercher.",
            de: "Wir holen Sie ab."
          },
          times: ["08:20", "14:00"],
          duration: { it: "4 ore", en: "4 hours", es: "4 horas", fr: "4 heures", de: "4 Stunden" },
          unitPrices: { due: 180, quattro: 240, sei: 330 },
          desc: {
            it: "Il giro lungo: il Parco Nazionale del Teide, un tratto vicino alla costa e la parte fuoristrada.",
            en: "The long tour: Teide National Park, a stretch near the coast and the off-road part.",
            es: "El tour largo: el Parque Nacional del Teide, un tramo cerca de la costa y la parte todoterreno.",
            fr: "Le grand tour : le parc national du Teide, un tronçon près de la côte et la partie tout-terrain.",
            de: "Die lange Tour: der Teide-Nationalpark, ein Stück nahe der Küste und der Offroad-Teil."
          } },
        // Il quarto giro non e' di King Buggy ma di Ultimate Buggies: parte da
        // un altro posto, non ha il ritiro in hotel e vuole 21 anni per
        // guidare. Le sue regole stanno qui dentro e non fra le note della
        // scheda, che direbbero "vale sempre"; `zone` dentro la variante fa
        // cambiare da sola la riga "Punto di partenza". Il ritiro in hotel
        // invece non e' fra le icone di nessuno dei quattro giri: ce l'hanno
        // solo i tre di King Buggy, e un'icona dice "vale sempre". Sta nelle
        // note, che possono dire su quali giri c'e' e su quale no.
        { label: { it: "Montagna su strada, 3 ore", en: "Mountain roads, 3 hours", es: "Montaña por carretera, 3 horas", fr: "Routes de montagne, 3 heures", de: "Bergstraßen, 3 Stunden" },
          price: 180,
          // senza ritiro: si parte da Playa de las Américas, il punto esatto lo
          // dice l'ufficio confermando
          ritrovo: "Playa de las Américas",
          times: ["11:00", "13:30"],
          duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
          zone: "Playa de las Américas",
          unitPrices: { due: 180, quattro: 240, sei: 330 },
          desc: {
            it: "Tutto su asfalto, senza fuoristrada: strade di montagna, villaggi canari e i punti panoramici del Parco Nazionale. Ritrovo a Playa de las Américas, senza ritiro in hotel, e si guida da 21 anni.",
            en: "All on paved roads, no off-road: mountain roads, Canarian villages and the viewpoints of the National Park. Meeting point in Playa de las Américas, no hotel pickup, and drivers from 21.",
            es: "Todo por asfalto, sin todoterreno: carreteras de montaña, pueblos canarios y los miradores del Parque Nacional. Punto de encuentro en Playa de las Américas, sin recogida en el hotel, y se conduce desde los 21 años.",
            fr: "Tout sur routes goudronnées, sans tout-terrain : routes de montagne, villages canariens et belvédères du parc national. Rendez-vous à Playa de las Américas, sans prise en charge à l'hôtel, et conducteurs dès 21 ans.",
            de: "Alles auf Asphalt, kein Offroad: Bergstraßen, kanarische Dörfer und die Aussichtspunkte des Nationalparks. Treffpunkt in Playa de las Américas, ohne Abholung am Hotel, und Fahrer ab 21."
          } }
      ]
    },
    desc: {
      it: "Al volante di un buggy fra i paesaggi del sud di Tenerife: quattro giri fra cui scegliere — il fuoristrada, il Teide al tramonto, il giro lungo che li mette insieme e la montagna di giorno, tutta su strada. Buggy da 2, 4 e 6 posti, e si guida con la patente.",
      en: "At the wheel of a buggy through the landscapes of southern Tenerife: four routes to choose from — the off-road ride, Teide at sunset, the long tour that puts the two together, and the mountains by day, all on paved roads. Buggies with 2, 4 and 6 seats; a driving licence is required.",
      es: "Al volante de un buggy por los paisajes del sur de Tenerife: cuatro recorridos a elegir — el todoterreno, el Teide al atardecer, el tour largo que junta los dos y la montaña de día, todo por carretera. Buggies de 2, 4 y 6 plazas, y se conduce con el carné.",
      fr: "Au volant d'un buggy à travers les paysages du sud de Tenerife : quatre parcours au choix — la sortie tout-terrain, le Teide au coucher du soleil, le grand tour qui réunit les deux, et la montagne de jour, tout sur routes goudronnées. Buggys de 2, 4 et 6 places ; le permis de conduire est obligatoire.",
      de: "Am Steuer eines Buggys durch die Landschaften im Süden Teneriffas: vier Routen zur Wahl — die Offroad-Tour, der Teide bei Sonnenuntergang, die lange Tour, die beides verbindet, und die Berge bei Tag, alles auf Asphalt. Buggys mit 2, 4 und 6 Plätzen; ein Führerschein ist Pflicht."
    },
    included: ["guide", "fuel", "equipment", "insurance"],
    notes: [
      {
        it: "Il prezzo è del buggy e non a persona: 180 € il buggy da 2 posti, 240 € quello da 4 e 330 € quello da 6, uguali su tutti e quattro i giri. Nella richiesta si contano i buggy, non le persone.",
        en: "The price is per buggy, not per person: €180 for the 2-seat buggy, €240 for the 4-seat and €330 for the 6-seat, the same on all four routes. In the request you count buggies, not people.",
        es: "El precio es por buggy y no por persona: 180 € el buggy de 2 plazas, 240 € el de 4 y 330 € el de 6, iguales en los cuatro recorridos. En la solicitud se cuentan los buggies, no las personas.",
        fr: "Le prix est par buggy, pas par personne : €180 pour le buggy 2 places, €240 pour le 4 places et €330 pour le 6 places, le même sur les quatre parcours. Dans la demande, vous comptez des buggys, pas des personnes.",
        de: "Der Preis gilt pro Buggy, nicht pro Person: €180 für den 2-Sitzer, €240 für den 4-Sitzer und €330 für den 6-Sitzer, auf allen vier Routen gleich. In der Anfrage zählen Sie Buggys, nicht Personen."
      },
      {
        it: "Ritiro in hotel gratuito su Offroad, Tramonto sul Teide e Completo; Montagna su strada parte da Playa de las Américas, senza ritiro. Il punto e l'ora te li conferma l'ufficio.",
        en: "Free hotel pickup on the Off-road, Teide at sunset and Full tours; Mountain roads starts from Playa de las Américas, with no pickup. The office confirms the point and the time.",
        es: "Recogida en el hotel gratuita en Offroad, Atardecer en el Teide y Completo; Montaña por carretera sale desde Playa de las Américas, sin recogida. El punto y la hora te los confirma la oficina.",
        fr: "Prise en charge gratuite à l'hôtel pour les parcours Tout-terrain, Teide au coucher du soleil et Tour complet ; Routes de montagne part de Playa de las Américas, sans prise en charge. Le bureau confirme le point et l'heure.",
        de: "Kostenlose Abholung am Hotel bei den Touren Offroad, Teide bei Sonnenuntergang und Komplett; Bergstraßen startet in Playa de las Américas, ohne Abholung. Das Büro bestätigt Ort und Uhrzeit."
      },
      {
        it: "Buggy automatici da 2, 4 e 6 posti. Chi guida porta con sé la patente valida, l'originale e non una fotocopia; su Montagna su strada servono 21 anni e la patente da un anno.",
        en: "Automatic buggies with 2, 4 and 6 seats. Drivers carry a valid licence, the original and not a photocopy; Mountain roads asks for 21 years of age and a licence held for a year.",
        es: "Buggies automáticos de 2, 4 y 6 plazas. Quien conduce lleva consigo el carné válido, el original y no una fotocopia; en Montaña por carretera hacen falta 21 años y el carné desde hace un año.",
        fr: "Buggys automatiques de 2, 4 et 6 places. Les conducteurs ont sur eux un permis valide, l'original et non une photocopie ; Routes de montagne demande 21 ans et un an de permis.",
        de: "Automatik-Buggys mit 2, 4 und 6 Plätzen. Fahrer haben einen gültigen Führerschein dabei, im Original und keine Kopie; Bergstraßen verlangt ein Alter von 21 Jahren und ein Jahr Führerschein."
      },
      {
        it: "I passeggeri salgono dai 3 anni.",
        en: "Passengers from age 3.",
        es: "Los pasajeros suben desde los 3 años.",
        fr: "Passagers dès 3 ans.",
        de: "Mitfahrer ab 3 Jahren."
      },
      {
        it: "Casco, guanti, giacca e occhiali forniti. Non consigliato in gravidanza. Pacchetto foto professionale disponibile a pagamento.",
        en: "Helmet, gloves, jacket and goggles provided. Not recommended during pregnancy. Professional photo package available for an extra fee.",
        es: "Casco, guantes, chaqueta y gafas incluidos. No recomendado durante el embarazo. Paquete de fotos profesionales disponible con coste adicional.",
        fr: "Casque, gants, veste et lunettes fournis. Déconseillé pendant la grossesse. Pack photo professionnel disponible en supplément.",
        de: "Helm, Handschuhe, Jacke und Brille werden gestellt. In der Schwangerschaft nicht empfohlen. Professionelles Fotopaket gegen Aufpreis erhältlich."
      }
    ],
    languages: LINGUE_TOUR,
    image: "buggy-volcano-4h.webp",
    gallery: ["buggy-2-3h.webp", "buggy-volcano-sunset.webp", "buggy-volcano-4h-guide.webp", "buggy-volcano-4h-guida.webp", "buggy-volcano-4h-fila.webp"],
    published: true
  },
  {
    // Una scheda sola per le due partenze dello stesso safari: prima erano due
    // schede gemelle (`quad-teide-adventure` per la mattina e
    // `quad-teide-sunset` per il tramonto) identiche in tutto tranne la foto e
    // il titolo. Stesso porto, stessa durata, stesso quad, stesso percorso: due
    // card affiancate in elenco sembravano un doppione. Ora l'ora del giorno e'
    // una variante, e la foto del tramonto e' finita nella galleria.
    id: "quad-teide-adventure",
    title: "Teide Quad Adventure",
    // La compagnia come i venditori la scrivono sul ticket (proprietario, 20
    // ottobre 2026; foglio di Maarten, ticket 0229 "Prime Quads 1D").
    // Anche Monster ("Monster quad"; proprietario, 29 ottobre 2026).
    nomi: ["Prime Quads", "Monster"],
    // Anche fra Teide e natura (proprietario, 14 settembre 2026): il Teide sta
    // gia' nel titolo, e restare fuori da quella categoria era la cosa che
    // stonava di piu' di tutte.
    category: "avventura-motori",
    alsoIn: ["teide-natura"],
    zone: "Chío",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
    zoneGroups: ["teide-nord"],
    durationGroups: ["mezza"],
    // Il quad piu' economico che si puo' davvero prenotare: il singolo del
    // mattino. Prima erano i €140 del listino CanaryVIP, un segnaposto tenuto
    // finche' non sapevamo i prezzi veri; adesso l'ufficio li ha dati (110/120
    // il mattino, 130 e 130 il tramonto) e "da €140" direbbe un numero che non
    // esiste piu' su nessuna variante, piu' alto di quello che la finestra
    // della richiesta calcola davvero.
    priceFrom: 110,
    // Il prezzo e' del quad e non della persona: il modulo del fornitore fa
    // contare quanti quad singoli e quanti doppi, non quante persone. E' la
    // risposta al dubbio lasciato aperto il 2 settembre.
    priceUnit: { it: "a quad", en: "per quad", es: "por quad", fr: "par quad", de: "pro Quad" },
    units: {
      // Quanti persone porta ognuno sta nella domanda e non nel nome del tipo:
      // il nome finisce anche nel messaggio all'ufficio e nel riepilogo della
      // lista, dove "Singolo (1 persona) x 1 . Doppio (2 persone) x 2" e' una
      // riga che va a capo tre volte per dire una cosa sola.
      label: {
        it: "Quanti quad — il singolo porta 1 persona, il doppio 2",
        en: "How many quads — a single carries 1 person, a double 2",
        es: "¿Cuántos quads? — el individual lleva 1 persona, el doble 2",
        fr: "Combien de quads — un simple porte 1 personne, un double 2",
        de: "Wie viele Quads — ein Single fasst 1 Person, ein Doppel 2"
      },
      name: { it: "Quad", en: "Quads", es: "Quads", fr: "Quads", de: "Quads" },
      types: [
        { key: "singolo", seats: 1, name: { it: "Singolo", en: "Single", es: "Individual", fr: "Simple", de: "Single" } },
        { key: "doppio", seats: 2, name: { it: "Doppio", en: "Double", es: "Doble", fr: "Double", de: "Doppel" } }
      ]
    },
    // I prezzi dei due tipi stanno nelle varianti (`unitPrices`): cambiano con
    // l'ora del giorno, non con la persona. Qui `priceAdult` e `priceChild`
    // restano a 0 perche' su questa scheda non si paga a testa.
    priceAdult: 0,
    priceChild: 0,
    family: false,
    options: {
      label: { it: "Quando", en: "When", es: "Cuándo", fr: "Quand", de: "Wann" },
      choices: [
        {
          label: { it: "Mattina", en: "Morning", es: "Mañana", fr: "Matin", de: "Vormittag" },
          // `price` e' quello che si scrive sul bottone: il piu' basso dei due
          // tipi, cioe' il singolo. Il doppio costa 10 in piu' solo la mattina.
          price: 110,
          unitPrices: { singolo: 110, doppio: 120 },
          times: ["10:00", "11:00"],
          desc: {
            it: "Partenza alle 10:00 o alle 11:00, con la luce piena sul cratere e sulle colate laviche.",
            en: "Departure at 10:00 or 11:00, with full daylight over the crater and the lava fields.",
            es: "Salida a las 10:00 o a las 11:00, con luz plena sobre el cráter y las coladas de lava.",
            fr: "Départ à 10:00 ou 11:00, en pleine lumière sur le cratère et les champs de lave.",
            de: "Abfahrt um 10:00 oder 11:00, bei vollem Tageslicht über Krater und Lavafeldern."
          }
        },
        {
          label: { it: "Tramonto", en: "Sunset", es: "Atardecer", fr: "Coucher du soleil", de: "Sonnenuntergang" },
          // Al tramonto singolo e doppio costano uguale: 130 e 130, confermati
          // dall'ufficio. Non e' un errore di copiatura.
          price: 130,
          unitPrices: { singolo: 130, doppio: 130 },
          times: ["16:00", "17:00"],
          desc: {
            it: "Partenza alle 16:00 o alle 17:00: stesso percorso, con le soste nel momento in cui il sole scende dietro il Teide.",
            en: "Departure at 16:00 or 17:00: the same route, with the stops timed for the sun going down behind Teide.",
            es: "Salida a las 16:00 o a las 17:00: el mismo recorrido, con las paradas justo cuando el sol baja tras el Teide.",
            fr: "Départ à 16:00 ou 17:00 : le même parcours, avec les arrêts calés sur le soleil qui descend derrière le Teide.",
            de: "Abfahrt um 16:00 oder 17:00: dieselbe Route, mit den Stopps abgestimmt auf die Sonne, die hinter dem Teide versinkt."
          }
        }
      ]
    },
    desc: {
      it: "Safari guidato in quad automatico da Chío verso il Parco Nazionale del Teide, fra pinete, villaggi di montagna e colate laviche, con soste ai punti panoramici. Si sceglie fra la partenza del mattino e quella del tramonto.",
      en: "A guided automatic quad safari from Chío towards Teide National Park, through pine woods, mountain villages and lava fields, with stops at the viewpoints. Choose between the morning and the sunset departure.",
      es: "Safari guiado en quad automático desde Chío hacia el Parque Nacional del Teide, entre pinares, pueblos de montaña y coladas de lava, con paradas en los miradores. Se elige entre la salida de la mañana y la del atardecer.",
      fr: "Un safari guidé en quad automatique de Chío vers le parc national du Teide, à travers pinèdes, villages de montagne et champs de lave, avec des arrêts aux belvédères. On choisit entre le départ du matin et celui du coucher du soleil.",
      de: "Eine geführte Safari mit Automatik-Quads von Chío Richtung Teide-Nationalpark, durch Kiefernwälder, Bergdörfer und Lavafelder, mit Stopps an den Aussichtspunkten. Zur Wahl stehen die Abfahrt am Vormittag oder zum Sonnenuntergang."
    },
    included: ["guide", "transfer", "equipment"],
    notes: [
      {
        it: "Il prezzo è per quad e non a persona: il singolo porta una persona, il doppio due. Si va in gruppi piccoli, dietro alla guida.",
        en: "The price is per quad, not per person: a single carries one person, a double carries two. You ride in small groups, behind the guide.",
        es: "El precio es por quad y no por persona: el individual lleva a una persona, el doble a dos. Se va en grupos pequeños, detrás del guía.",
        fr: "Le prix est par quad, pas par personne : un simple porte une personne, un double en porte deux. On roule en petits groupes, derrière le guide.",
        de: "Der Preis gilt pro Quad, nicht pro Person: Ein Single fasst eine Person, ein Doppel zwei. Man fährt in kleinen Gruppen hinter dem Guide."
      },
      {
        it: "Prelievo e riconsegna in hotel inclusi a Tenerife Sud. Chi guida deve avere almeno 18 anni e la patente con sé: senza, non si può guidare. I passeggeri salgono da 7 anni.",
        en: "Hotel pickup and drop-off included in Tenerife South. Drivers must be at least 18 and have their licence with them: without it, they cannot ride. Passengers from age 7.",
        es: "Recogida y regreso en el hotel incluidos en Tenerife Sur. Quien conduce debe tener al menos 18 años y llevar el carné encima: sin él, no puede conducir. Los pasajeros suben desde los 7 años.",
        fr: "Prise en charge et retour à l'hôtel compris dans le sud de Tenerife. Les conducteurs doivent avoir au moins 18 ans et leur permis sur eux : sans permis, ils ne peuvent pas conduire. Passagers dès 7 ans.",
        de: "Abholung und Rückfahrt zum Hotel im Süden Teneriffas inklusive. Fahrer müssen mindestens 18 sein und den Führerschein dabeihaben: Ohne ihn dürfen sie nicht fahren. Mitfahrer ab 7 Jahren."
      },
      {
        it: "Quad automatici, senza marce da cambiare: non serve esperienza, le istruzioni si danno prima di partire. Si resta sempre sull'asfalto, il fuoristrada non è previsto.",
        en: "Automatic quads, no gears to change: no experience needed, instructions are given before setting off. You stay on paved roads throughout; off-roading is not part of this tour.",
        es: "Quads automáticos, sin marchas que cambiar: no hace falta experiencia, las instrucciones se dan antes de salir. Se va siempre por asfalto; el todoterreno no forma parte de este tour.",
        fr: "Quads automatiques, pas de vitesses à passer : aucune expérience nécessaire, les instructions sont données avant le départ. On reste sur routes goudronnées tout du long ; le tout-terrain ne fait pas partie de cette sortie.",
        de: "Automatik-Quads, kein Schalten: Keine Erfahrung nötig, die Einweisung gibt es vor dem Start. Man bleibt die ganze Zeit auf Asphalt; Offroad gehört nicht zu dieser Tour."
      },
      {
        it: "Casco e guanti forniti, scarpe chiuse obbligatorie (niente sandali o infradito) e una giacca nei mesi freddi; per la partenza del mattino anche crema solare, occhiali da sole e cappello. Assicurazione di base inclusa, copertura completa a pagamento.",
        en: "Helmet and gloves provided, closed shoes required (no sandals or flip-flops) and a jacket in the colder months; for the morning departure also sun cream, sunglasses and a hat. Basic insurance included, full cover for an extra fee.",
        es: "Casco y guantes incluidos, calzado cerrado obligatorio (nada de sandalias ni chanclas) y una chaqueta en los meses fríos; para la salida de la mañana también crema solar, gafas de sol y gorra. Seguro básico incluido, cobertura completa con coste adicional.",
        fr: "Casque et gants fournis, chaussures fermées obligatoires (pas de sandales ni de tongs) et une veste pendant les mois plus frais ; pour le départ du matin, aussi crème solaire, lunettes de soleil et chapeau. Assurance de base comprise, couverture complète en supplément.",
        de: "Helm und Handschuhe werden gestellt, geschlossene Schuhe sind Pflicht (keine Sandalen oder Flip-Flops) und in den kühleren Monaten eine Jacke; für die Vormittagsabfahrt auch Sonnencreme, Sonnenbrille und Hut. Basisversicherung inklusive, Vollschutz gegen Aufpreis."
      },
      {
        it: "Non adatto in gravidanza o in presenza di certe condizioni mediche: se hai un dubbio, scrivilo nelle note e l'ufficio ti risponde prima di confermare. Il pacchetto foto professionale è a pagamento e si paga sul posto.",
        en: "Not suitable during pregnancy or with certain medical conditions: if in doubt, add it in the notes and the office will get back to you before confirming. The professional photo package costs extra and is paid on site.",
        es: "No apto durante el embarazo ni con ciertas condiciones médicas: si tienes dudas, escríbelo en las notas y la oficina te responde antes de confirmar. El paquete de fotos profesionales tiene coste adicional y se paga allí mismo.",
        fr: "Ne convient pas pendant la grossesse ni avec certains problèmes de santé : en cas de doute, indiquez-le dans les notes et le bureau vous recontacte avant de confirmer. Le pack photo professionnel est en supplément et se paie sur place.",
        de: "Nicht geeignet in der Schwangerschaft oder bei bestimmten gesundheitlichen Problemen: Im Zweifel schreiben Sie es in die Notizen, und das Büro meldet sich vor der Bestätigung. Das professionelle Fotopaket kostet extra und wird vor Ort bezahlt."
      }
    ],
    languages: LINGUE_TOUR,
    image: "quad-teide-adventure.webp",
    gallery: ["quad-teide-sunset.webp"],
    published: true
  },
  {
    // Moto elettriche Talaria fuoristrada a Guargacho (pagina del fornitore
    // incollata in chat, 13 ottobre 2026). Nessuna scheda simile in catalogo:
    // il quad e il buggy sono a mezzo e vanno al Teide, questa e' a persona e
    // resta sulle piste del sud.
    // Il prezzo e' a pilota, una moto a testa: niente `units`, si contano le
    // persone. Si guida dai 14 anni e il prezzo e' lo stesso per tutti: per
    // questo `ages` dice solo "14+" e non c'e' `priceChild`. Con dei bambini
    // sotto i 14 il totale non si fa, perche' non possono salire.
    // Partenze 10, 13 e 16, le stesse per tutte e tre le durate: le 18 erano
    // state messe e poi tolte, la pagina del fornitore non le ha (proprietario,
    // 13 ottobre 2026).
    id: "talaria-off-road",
    title: "Talaria Electric Off-Road",
    nomi: ["eBike Adventure Tenerife"],
    category: "avventura-motori",
    zone: "Guargacho",
    times: ["10:00", "13:00", "16:00"],
    duration: { it: "Da 40 minuti a 2 ore", en: "40 minutes to 2 hours", es: "De 40 minutos a 2 horas", fr: "De 40 minutes à 2 heures", de: "40 Minuten bis 2 Stunden" },
    zoneGroups: ["los-cristianos"],
    durationGroups: ["breve"],
    priceFrom: 59,
    priceAdult: 59,
    priceChild: 0,
    ages: { adult: "14+" },
    family: false,
    options: {
      label: { it: "Durata", en: "Duration", es: "Duración", fr: "Durée", de: "Dauer" },
      choices: [
        {
          label: { it: "Pista sterrata · 40 minuti", en: "Dirt track · 40 minutes", es: "Pista de tierra · 40 minutos", fr: "Piste en terre · 40 minutes", de: "Schotterpiste · 40 Minuten" },
          duration: { it: "40 minuti", en: "40 minutes", es: "40 minutos", fr: "40 minutes", de: "40 Minuten" },
          priceAdult: 59,
          desc: {
            it: "Quaranta minuti sulla pista in terra battuta. È la sola formula per cui non serve la patente.",
            en: "Forty minutes on the dirt track. It is the only option that needs no driving licence.",
            es: "Cuarenta minutos en la pista de tierra. Es la única opción que no necesita carné de conducir.",
            fr: "Quarante minutes sur la piste en terre. C'est la seule option qui ne demande pas de permis de conduire.",
            de: "Vierzig Minuten auf der Schotterpiste. Die einzige Option, für die man keinen Führerschein braucht."
          }
        },
        {
          label: { it: "Giro guidato · 1 ora", en: "Guided ride · 1 hour", es: "Ruta guiada · 1 hora", fr: "Sortie guidée · 1 heure", de: "Geführte Tour · 1 Stunde" },
          duration: { it: "1 ora", en: "1 hour", es: "1 hora", fr: "1 heure", de: "1 Stunde" },
          priceAdult: 99,
          desc: {
            it: "Un'ora fuori dalla pista, dietro la guida, fra sterrati e tratti di roccia attorno a Guargacho e Playa El Barranco.",
            en: "One hour off the track, behind the guide, on dirt roads and rocky stretches around Guargacho and Playa El Barranco.",
            es: "Una hora fuera de la pista, detrás del guía, entre caminos de tierra y tramos de roca alrededor de Guargacho y Playa El Barranco.",
            fr: "Une heure hors piste, derrière le guide, sur chemins de terre et passages rocheux autour de Guargacho et de Playa El Barranco.",
            de: "Eine Stunde abseits der Piste, hinter dem Guide, auf Schotterwegen und felsigen Abschnitten rund um Guargacho und Playa El Barranco."
          }
        },
        {
          label: { it: "Giro guidato · 2 ore", en: "Guided ride · 2 hours", es: "Ruta guiada · 2 horas", fr: "Sortie guidée · 2 heures", de: "Geführte Tour · 2 Stunden" },
          duration: { it: "2 ore", en: "2 hours", es: "2 horas", fr: "2 heures", de: "2 Stunden" },
          priceAdult: 189,
          desc: {
            it: "Lo stesso giro, il doppio del tempo: si arriva più lontano nel paesaggio vulcanico del sud.",
            en: "The same ride, twice as long: you get further into the volcanic landscape of the south.",
            es: "La misma ruta, el doble de tiempo: se llega más lejos en el paisaje volcánico del sur.",
            fr: "La même sortie, deux fois plus longue : on va plus loin dans le paysage volcanique du sud.",
            de: "Dieselbe Tour, doppelt so lang: Man kommt weiter in die Vulkanlandschaft des Südens."
          }
        }
      ]
    },
    desc: {
      it: "Moto elettriche Talaria in fuoristrada nel sud di Tenerife: sterrati compatti, tratti di roccia e paesaggi di deserto vulcanico attorno a Guargacho e Playa El Barranco. Silenziose e senza gas di scarico. Si sceglie fra la pista sterrata, senza patente, e il giro guidato di una o due ore.",
      en: "Electric Talaria bikes off-road in the south of Tenerife: compact dirt tracks, rocky stretches and volcanic desert scenery around Guargacho and Playa El Barranco. Quiet and with no exhaust fumes. Choose between the dirt track, no licence needed, and a guided ride of one or two hours.",
      es: "Motos eléctricas Talaria todoterreno en el sur de Tenerife: pistas de tierra compacta, tramos de roca y paisajes de desierto volcánico alrededor de Guargacho y Playa El Barranco. Silenciosas y sin gases de escape. Se elige entre la pista de tierra, sin carné, y la ruta guiada de una o dos horas.",
      fr: "Motos électriques Talaria en tout-terrain dans le sud de Tenerife : pistes en terre compacte, passages rocheux et paysages de désert volcanique autour de Guargacho et de Playa El Barranco. Silencieuses et sans gaz d'échappement. On choisit entre la piste en terre, sans permis, et une sortie guidée d'une ou deux heures.",
      de: "Elektrische Talaria-Bikes offroad im Süden Teneriffas: feste Schotterwege, felsige Abschnitte und Vulkanwüste rund um Guargacho und Playa El Barranco. Leise und ohne Abgase. Zur Wahl stehen die Schotterpiste, ohne Führerschein, und eine geführte Tour von einer oder zwei Stunden."
    },
    included: ["guide", "equipment"],
    notes: [
      {
        it: "Il prezzo è a persona: ogni pilota guida la sua moto. Al massimo 4 piloti per uscita.",
        en: "The price is per person: each rider has their own bike. Up to 4 riders per departure.",
        es: "El precio es por persona: cada piloto lleva su moto. Como máximo 4 pilotos por salida.",
        fr: "Le prix est par personne : chaque pilote a sa moto. Jusqu'à 4 pilotes par départ.",
        de: "Der Preis gilt pro Person: Jeder Fahrer hat sein eigenes Bike. Bis zu 4 Fahrer pro Abfahrt."
      },
      {
        it: "Prima di partire la guida spiega la moto e le regole, e dà l'attrezzatura. Percorso e andatura li sceglie lei, secondo il terreno e il gruppo.",
        en: "Before setting off the guide explains the bike and the rules and hands out the gear. The guide picks the route and the pace to suit the terrain and the group.",
        es: "Antes de salir el guía explica la moto y las normas y entrega el equipo. El recorrido y el ritmo los elige el guía, según el terreno y el grupo.",
        fr: "Avant de partir, le guide explique la moto et les règles et distribue l'équipement. Le guide choisit le parcours et le rythme selon le terrain et le groupe.",
        de: "Vor dem Start erklärt der Guide das Bike und die Regeln und verteilt die Ausrüstung. Der Guide wählt Route und Tempo passend zu Gelände und Gruppe."
      },
      {
        it: "Si guida dai 14 anni. Sotto i 18 serve l'autorizzazione di un genitore o di chi ne fa le veci.",
        en: "Riders must be at least 14. Under 18s need permission from a parent or legal guardian.",
        es: "Se conduce a partir de los 14 años. Los menores de 18 necesitan la autorización de un padre, una madre o su tutor legal.",
        fr: "Les pilotes doivent avoir au moins 14 ans. Les moins de 18 ans ont besoin de l'autorisation d'un parent ou du tuteur légal.",
        de: "Fahrer müssen mindestens 14 sein. Unter 18-Jährige brauchen die Erlaubnis eines Elternteils oder Erziehungsberechtigten."
      },
      {
        it: "Chi non ha la patente fa solo l'attività fuoristrada che il fornitore accetta. I requisiti cambiano col percorso e li verifica il fornitore prima della partenza: scrivi nelle note se hai la patente.",
        en: "Without a driving licence you can only do the off-road activity the operator accepts. Requirements depend on the route and are checked by the operator before departure: say in the notes whether you hold a licence.",
        es: "Quien no tiene carné solo puede hacer la actividad todoterreno que acepte el proveedor. Los requisitos dependen del recorrido y los comprueba el proveedor antes de salir: indica en las notas si tienes carné.",
        fr: "Sans permis de conduire, on ne peut faire que l'activité tout-terrain que l'opérateur accepte. Les conditions dépendent du parcours et sont vérifiées par l'opérateur avant le départ : indiquez dans les notes si vous avez le permis.",
        de: "Ohne Führerschein kann man nur die Offroad-Aktivität machen, die der Anbieter zulässt. Die Voraussetzungen hängen von der Route ab und werden vom Anbieter vor dem Start geprüft: Schreiben Sie in die Notizen, ob Sie einen Führerschein haben."
      },
      {
        it: "Scarpe chiuse e pantaloni lunghi. Porta un documento d'identità e la patente, se ce l'hai; consigliate acqua e crema solare. Arriva con un po' di anticipo: prima di partire c'è la spiegazione e la preparazione.",
        en: "Closed shoes and long trousers. Bring ID and your driving licence if you have one; water and sun cream are recommended. Arrive a little early: there is a briefing and preparation before setting off.",
        es: "Calzado cerrado y pantalón largo. Lleva un documento de identidad y el carné si lo tienes; se recomiendan agua y crema solar. Llega con algo de antelación: antes de salir hay explicación y preparación.",
        fr: "Chaussures fermées et pantalon long. Apportez une pièce d'identité et votre permis de conduire si vous en avez un ; eau et crème solaire conseillées. Arrivez un peu en avance : il y a un briefing et une préparation avant le départ.",
        de: "Geschlossene Schuhe und lange Hose. Bringen Sie einen Ausweis und Ihren Führerschein mit, falls Sie einen haben; Wasser und Sonnencreme empfohlen. Kommen Sie etwas früher: Vor dem Start gibt es eine Einweisung und Vorbereitung."
      },
      {
        it: "Non c'è il ritiro in hotel: a Guargacho si arriva da soli. Prima dell'uscita il fornitore manda un link per fare il check-in.",
        en: "There is no hotel pick-up: you make your own way to Guargacho. Before the ride the operator sends a link to check in.",
        es: "No hay recogida en el hotel: a Guargacho se llega por cuenta propia. Antes de la salida el proveedor envía un enlace para hacer el check-in.",
        fr: "Il n'y a pas de prise en charge à l'hôtel : on se rend à Guargacho par ses propres moyens. Avant la sortie, l'opérateur envoie un lien pour l'enregistrement.",
        de: "Es gibt keine Abholung am Hotel: Nach Guargacho kommt man selbst. Vor der Tour schickt der Anbieter einen Link zum Einchecken."
      }
    ],
    // Le due immagini del proprietario (13 ottobre 2026): le moto sulla
    // spiaggia di ciottoli e, in galleria, il logo del fornitore.
    image: "talaria-off-road.webp",
    gallery: ["talaria-off-road-2.webp"],
    published: true
  },
  {
    id: "helicopter-tours",
    title: "Helicopter Tours",
    category: "avventura-motori",
    zone: "Adeje",
    duration: { it: "Da 8 a 50 minuti di volo", en: "8 to 50 minutes of flight", es: "De 8 a 50 minutos de vuelo", fr: "De 8 à 50 minutes de vol", de: "8 bis 50 Minuten Flug" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["breve"],
    priceFrom: 98,
    priceAdult: 98,
    // Sul volo paga lo stesso prezzo chiunque occupi un posto, l'ha confermato
    // l'ufficio: bambini e neonati come gli adulti. Percio' `priceChild` e'
    // uguale a `priceAdult` su ogni variante, e non c'e' nessun `ages`: senza
    // uno sconto per eta' non c'e' nessuna fascia da scrivere.
    // **Niente `priceInfant`**, e non e' una dimenticanza: il campo sta solo
    // sulla scheda e non sulla variante (vedi prezziAPersona in escursioni.js),
    // quindi un numero solo qui varrebbe uguale sul volo da €98 e su quello da
    // €495, e il totale di chi porta un neonato sul Grand Teide verrebbe fuori
    // sbagliato di quattrocento euro. Con la riga "Neonati" nascosta il cliente
    // li conta fra i passeggeri, che al prezzo pieno e' esatto, e la nota qui
    // sotto glielo dice.
    priceChild: 98,
    family: true,
    times: [],
    options: {
      label: { it: "Percorso", en: "Route", es: "Recorrido", fr: "Parcours", de: "Route" },
      choices: [
        {
          label: { it: "20 km - Costa sud", en: "20 km - South Coast", es: "20 km - Costa sur", fr: "20 km - Côte sud", de: "20 km - Südküste" },
          priceAdult: 98,
          priceChild: 98,
          duration: { it: "8-9 minuti di volo", en: "8-9 minutes of flight", es: "8-9 minutos de vuelo", fr: "8-9 minutes de vol", de: "8-9 Minuten Flug" },
          desc: {
            it: "Il giro più breve: si decolla da Adeje e si segue la costa sud, sopra spiagge, porticcioli e la roccia vulcanica che scende in mare. In aria si sta 8-9 minuti.",
            en: "The shortest ride: you lift off from Adeje and follow the south coast, over beaches, small harbours and the volcanic rock running down to the sea. You stay up 8-9 minutes.",
            es: "El recorrido más corto: se despega en Adeje y se sigue la costa sur, sobre playas, puertos deportivos y la roca volcánica que baja hasta el mar. En el aire se está 8-9 minutos.",
            fr: "Le vol le plus court : on décolle d'Adeje et on suit la côte sud, au-dessus des plages, des petits ports et de la roche volcanique qui descend vers la mer. On reste en l'air 8-9 minutes.",
            de: "Der kürzeste Flug: Start in Adeje und entlang der Südküste, über Strände, kleine Häfen und das Vulkangestein, das ins Meer abfällt. Sie bleiben 8-9 Minuten in der Luft."
          }
        },
        {
          label: { it: "30 km - Spiagge e barrancos", en: "30 km - Beaches and ravines", es: "30 km - Playas y barrancos", fr: "30 km - Plages et ravins", de: "30 km - Strände und Schluchten" },
          priceAdult: 145,
          priceChild: 145,
          duration: { it: "12-15 minuti di volo", en: "12-15 minutes of flight", es: "12-15 minutos de vuelo", fr: "12-15 minutes de vol", de: "12-15 Minuten Flug" },
          desc: {
            it: "Il giro si allarga sulle spiagge e sui barrancos, i valloni scavati nella roccia che dall'interno scendono verso la costa. In aria si sta 12-15 minuti.",
            en: "A wider loop over the beaches and the barrancos, the ravines cut into the rock that run down from inland to the coast. You stay up 12-15 minutes.",
            es: "El recorrido se amplía sobre las playas y los barrancos, las gargantas excavadas en la roca que bajan del interior hacia la costa. En el aire se está 12-15 minutos.",
            fr: "Une boucle plus large au-dessus des plages et des barrancos, les ravins creusés dans la roche qui descendent de l'intérieur vers la côte. On reste en l'air 12-15 minutes.",
            de: "Eine größere Runde über die Strände und die Barrancos, die in den Fels geschnittenen Schluchten, die vom Landesinneren zur Küste hinunterlaufen. Sie bleiben 12-15 Minuten in der Luft."
          }
        },
        {
          label: { it: "50 km - Scogliere di Los Gigantes", en: "50 km - Los Gigantes cliffs", es: "50 km - Acantilados de Los Gigantes", fr: "50 km - Falaises de Los Gigantes", de: "50 km - Klippen von Los Gigantes" },
          priceAdult: 279,
          priceChild: 279,
          duration: { it: "20-22 minuti di volo", en: "20-22 minutes of flight", es: "20-22 minutos de vuelo", fr: "20-22 minutes de vol", de: "20-22 Minuten Flug" },
          desc: {
            it: "Si risale la costa fino alle scogliere di Los Gigantes, che cadono a picco sull'oceano per centinaia di metri, con La Gomera all'orizzonte. In aria si sta 20-22 minuti.",
            en: "Up along the coast to the Los Gigantes cliffs, dropping sheer into the ocean for hundreds of metres, with La Gomera on the horizon. You stay up 20-22 minutes.",
            es: "Se remonta la costa hasta los acantilados de Los Gigantes, que caen a pico sobre el océano cientos de metros, con La Gomera en el horizonte. En el aire se está 20-22 minutos.",
            fr: "On remonte la côte jusqu'aux falaises de Los Gigantes, qui tombent à pic dans l'océan sur des centaines de mètres, avec La Gomera à l'horizon. On reste en l'air 20-22 minutes.",
            de: "Die Küste hinauf bis zu den Klippen von Los Gigantes, die Hunderte Meter senkrecht in den Ozean fallen, mit La Gomera am Horizont. Sie bleiben 20-22 Minuten in der Luft."
          }
        },
        {
          label: { it: "85 km - Il giro lungo dell'isola", en: "85 km - The long island loop", es: "85 km - La vuelta larga a la isla", fr: "85 km - Le grand tour de l'île", de: "85 km - Die große Inselrunde" },
          priceAdult: 390,
          priceChild: 390,
          duration: { it: "35-40 minuti di volo", en: "35-40 minutes of flight", es: "35-40 minutos de vuelo", fr: "35-40 minutes de vol", de: "35-40 Minuten Flug" },
          desc: {
            it: "Il giro lungo: coste, valli e coni vulcanici dell'interno, per vedere in un volo solo i paesaggi diversi dell'isola. In aria si sta 35-40 minuti.",
            en: "The long loop: coastline, valleys and the volcanic cones inland, the island's different landscapes in a single flight. You stay up 35-40 minutes.",
            es: "La vuelta larga: costa, valles y conos volcánicos del interior, los distintos paisajes de la isla en un solo vuelo. En el aire se está 35-40 minutos.",
            fr: "La grande boucle : littoral, vallées et cônes volcaniques de l'intérieur, les différents paysages de l'île en un seul vol. On reste en l'air 35-40 minutes.",
            de: "Die große Runde: Küste, Täler und die Vulkankegel im Inneren, die verschiedenen Landschaften der Insel in einem einzigen Flug. Sie bleiben 35-40 Minuten in der Luft."
          }
        },
        {
          label: "Grand Teide Luxury",
          priceAdult: 495,
          priceChild: 495,
          duration: { it: "45-50 minuti di volo", en: "45-50 minutes of flight", es: "45-50 minutos de vuelo", fr: "45-50 minutes de vol", de: "45-50 Minuten Flug" },
          desc: {
            it: "Il volo più lungo, fin sopra il Teide: i 3.715 metri della vetta più alta di Spagna e il cratere delle Cañadas, con l'isola intera intorno. In aria si sta 45-50 minuti.",
            en: "The longest flight, all the way over Teide: the 3,715 metres of Spain's highest peak and the Cañadas crater, with the whole island around it. You stay up 45-50 minutes.",
            es: "El vuelo más largo, hasta sobrevolar el Teide: los 3.715 metros de la cima más alta de España y el circo de Las Cañadas, con la isla entera alrededor. En el aire se está 45-50 minutos.",
            fr: "Le vol le plus long, jusqu'au-dessus du Teide : les 3 715 mètres du plus haut sommet d'Espagne et le cratère de Las Cañadas, avec toute l'île autour. On reste en l'air 45-50 minutes.",
            de: "Der längste Flug, bis über den Teide: die 3.715 Meter des höchsten Gipfels Spaniens und der Krater von Las Cañadas, mit der ganzen Insel ringsum. Sie bleiben 45-50 Minuten in der Luft."
          }
        }
      ]
    },
    desc: {
      it: "Tenerife vista dall'alto: sorvolo in elicottero dall'elisuperficie di Adeje, con cinque percorsi fra la costa sud e il Teide e il commento del pilota durante il volo.",
      en: "Tenerife seen from above: a helicopter flight from the Adeje helipad, with five routes between the south coast and Teide and the pilot's commentary along the way.",
      es: "Tenerife vista desde el aire: sobrevuelo en helicóptero desde el helipuerto de Adeje, con cinco recorridos entre la costa sur y el Teide y los comentarios del piloto durante el vuelo.",
      fr: "Tenerife vue d'en haut : un vol en hélicoptère depuis l'héliport d'Adeje, avec cinq parcours entre la côte sud et le Teide et les commentaires du pilote en chemin.",
      de: "Teneriffa von oben: ein Hubschrauberflug vom Hubschrauberlandeplatz Adeje, mit fünf Routen zwischen Südküste und Teide und den Erklärungen des Piloten unterwegs."
    },
    notes: [
      {
        it: "Nessun servizio di prelievo: il punto d'incontro è l'elisuperficie di Adeje, raggiungibile in autonomia. Serve il passaporto per ogni passeggero.",
        en: "No pickup service: the meeting point is the Adeje helipad, reached independently. A passport is required for every passenger.",
        es: "Sin servicio de recogida: el punto de encuentro es el helipuerto de Adeje, al que se llega por cuenta propia. Se requiere pasaporte para cada pasajero.",
        fr: "Pas de prise en charge : le rendez-vous est à l'héliport d'Adeje, où l'on se rend par ses propres moyens. Un passeport est obligatoire pour chaque passager.",
        de: "Keine Abholung: Treffpunkt ist der Hubschrauberlandeplatz Adeje, den man selbst erreicht. Für jeden Passagier ist ein Reisepass nötig."
      },
      {
        it: "Limite di peso 110 kg a passeggero (oltre puo' servire un posto aggiuntivo), massimo 4 passeggeri a volo. Pacchetto foto/video opzionale a pagamento.",
        en: "Weight limit 110 kg per passenger (an extra seat may be needed above that), maximum 4 passengers per flight. Optional photo/video package available for an extra fee.",
        es: "Límite de peso 110 kg por pasajero (por encima puede requerir un asiento adicional), máximo 4 pasajeros por vuelo. Paquete de foto/vídeo opcional con coste adicional.",
        fr: "Poids maximum 110 kg par passager (au-delà, un siège supplémentaire peut être nécessaire), 4 passagers au maximum par vol. Pack photo/vidéo facultatif disponible en supplément.",
        de: "Gewichtsgrenze 110 kg pro Passagier (darüber kann ein zusätzlicher Sitz nötig sein), höchstens 4 Passagiere pro Flug. Optionales Foto-/Videopaket gegen Aufpreis."
      },
      {
        it: "Il prezzo è uguale per tutti, bambini e neonati compresi: ogni passeggero occupa un posto e non c'è un prezzo ridotto. Nella richiesta contali tutti fra i passeggeri. L'orario del volo si concorda con l'ufficio.",
        en: "The price is the same for everyone, children and infants included: every passenger takes a seat and there is no reduced price. Count them all as passengers in your request. The time of the flight is arranged with the office.",
        es: "El precio es el mismo para todos, niños y bebés incluidos: cada pasajero ocupa una plaza y no hay precio reducido. En la solicitud cuéntalos a todos como pasajeros. La hora del vuelo se acuerda con la oficina.",
        fr: "Le prix est le même pour tous, enfants et bébés compris : chaque passager occupe un siège et il n'y a pas de tarif réduit. Comptez-les tous comme passagers dans la demande. L'heure du vol se fixe avec le bureau.",
        de: "Der Preis ist für alle gleich, Kinder und Babys inklusive: Jeder Passagier belegt einen Sitz und es gibt keinen ermäßigten Preis. Zählen Sie in der Anfrage alle als Passagiere. Die Flugzeit wird mit dem Büro vereinbart."
      }
    ],
    languages: ["English", "Español"],
    image: "helicopter-tours.webp",
    // dove ci si presenta: era gia' scritto nei consigli (15 ottobre 2026)
    ritrovo: { it: "Elisuperficie di Adeje", en: "Adeje heliport", es: "Helipuerto de Adeje", fr: "Héliport d'Adeje", de: "Hubschrauberlandeplatz Adeje" },
    published: true
  },
  {
    id: "paragliding",
    title: "Paragliding",
    // "Roberto paragliding" sul foglio dei venditori: stessa attivita'
    // (proprietario, 19 ottobre 2026).
    nomi: ["Roberto Paragliding"],
    category: "avventura-motori",
    zone: "Adeje",
    duration: { it: "Attività di circa 2 ore, volo di 20-40 minuti", en: "About 2 hours in all, 20-40 minutes in the air", es: "Actividad de unas 2 horas, vuelo de 20-40 minutos", fr: "Environ 2 heures en tout, 20-40 minutes en l'air", de: "Etwa 2 Stunden insgesamt, 20-40 Minuten in der Luft" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["breve"],
    priceFrom: 95,
    priceAdult: 95,
    priceChild: 0,
    family: false,
    times: ["10:00", "12:00", "14:00", "16:00"],
    options: {
      label: { it: "Volo", en: "Flight", es: "Vuelo", fr: "Vol", de: "Flug" },
      choices: [
        {
          label: { it: "20-25 minuti, decollo a 750 m", en: "20-25 minutes, takeoff at 750 m", es: "20-25 minutos, despegue a 750 m", fr: "20-25 minutes, décollage à 750 m", de: "20-25 Minuten, Start auf 750 m" },
          priceAdult: 95,
          desc: {
            it: "Il volo classico: si sorvolano le valli e i costoni sopra Adeje, con tutto il sud dell'isola davanti. In aria si sta 20-25 minuti, secondo il vento della giornata.",
            en: "The classic flight: over the valleys and ridges above Adeje, with the whole south of the island in front of you. You stay up 20-25 minutes, depending on the day's wind.",
            es: "El vuelo clásico: se sobrevuelan los valles y las laderas sobre Adeje, con todo el sur de la isla enfrente. En el aire se está 20-25 minutos, según el viento del día.",
            fr: "Le vol classique : au-dessus des vallées et des crêtes qui dominent Adeje, avec tout le sud de l'île devant vous. On reste en l'air 20-25 minutes, selon le vent du jour.",
            de: "Der klassische Flug: über den Tälern und Graten oberhalb von Adeje, mit dem ganzen Süden der Insel vor Ihnen. Sie bleiben 20-25 Minuten in der Luft, je nach Wind des Tages."
          }
        },
        {
          label: { it: "30-40 minuti, decollo a 1.000 m", en: "30-40 minutes, takeoff at 1,000 m", es: "30-40 minutos, despegue a 1.000 m", fr: "30-40 minutes, décollage à 1 000 m", de: "30-40 Minuten, Start auf 1.000 m" },
          priceAdult: 115,
          desc: {
            it: "Il volo più lungo e più tranquillo, quello buono per la prima volta: si decolla sopra Adeje, con la Costa Adeje sotto e La Gomera all'orizzonte. In aria si sta 30-40 minuti, secondo il vento della giornata.",
            en: "The longest and calmest flight, the good one for a first time: takeoff above Adeje, with Costa Adeje below and La Gomera on the horizon. You stay up 30-40 minutes, depending on the day's wind.",
            es: "El vuelo más largo y más tranquilo, el bueno para la primera vez: se despega sobre Adeje, con Costa Adeje abajo y La Gomera en el horizonte. En el aire se está 30-40 minutos, según el viento del día.",
            fr: "Le vol le plus long et le plus tranquille, le bon pour une première fois : décollage au-dessus d'Adeje, avec Costa Adeje en dessous et La Gomera à l'horizon. On reste en l'air 30-40 minutes, selon le vent du jour.",
            de: "Der längste und ruhigste Flug, der richtige fürs erste Mal: Start oberhalb von Adeje, mit Costa Adeje unter Ihnen und La Gomera am Horizont. Sie bleiben 30-40 Minuten in der Luft, je nach Wind des Tages."
          }
        },
        {
          label: { it: "25-30 minuti, decollo a 1.000 m, alte prestazioni", en: "25-30 minutes, takeoff at 1,000 m, high performance", es: "25-30 minutos, despegue a 1.000 m, altas prestaciones", fr: "25-30 minutes, décollage à 1 000 m, haute performance", de: "25-30 Minuten, Start auf 1.000 m, sportlich" },
          priceAdult: 130,
          desc: {
            it: "Il volo sportivo: si cercano le correnti termiche per salire di quota e, se te la senti, il pilota ti fa provare i comandi della vela. In aria si sta 25-30 minuti, secondo il vento della giornata.",
            en: "The sporty flight: you chase thermals to gain height and, if you feel up to it, the pilot lets you try the glider's controls. You stay up 25-30 minutes, depending on the day's wind.",
            es: "El vuelo deportivo: se buscan las térmicas para ganar altura y, si te apetece, el piloto te deja probar los mandos de la vela. En el aire se está 25-30 minutos, según el viento del día.",
            fr: "Le vol sportif : on cherche les thermiques pour prendre de la hauteur et, si vous vous sentez prêt, le pilote vous laisse essayer les commandes de la voile. On reste en l'air 25-30 minutes, selon le vent du jour.",
            de: "Der sportliche Flug: Man sucht Thermik, um an Höhe zu gewinnen, und wenn Sie sich trauen, lässt der Pilot Sie die Steuerung des Schirms ausprobieren. Sie bleiben 25-30 Minuten in der Luft, je nach Wind des Tages."
          }
        }
      ]
    },
    desc: {
      it: "Volo in tandem con istruttore esperto: decollo in quota sopra Adeje, dove porta il vento, e atterraggio in spiaggia. Prelievo e riconsegna gratuiti.",
      en: "A tandem flight with an experienced instructor: takeoff up above Adeje, wherever the wind takes you, landing on the beach. Free pickup and drop-off.",
      es: "Vuelo en tándem con instructor experimentado: despegue en altura sobre Adeje, allí donde lleve el viento, y aterrizaje en la playa. Recogida y regreso gratuitos.",
      fr: "Un vol en tandem avec un moniteur expérimenté : décollage au-dessus d'Adeje, là où le vent vous porte, atterrissage sur la plage. Prise en charge et retour gratuits.",
      de: "Ein Tandemflug mit einem erfahrenen Lehrer: Start hoch über Adeje, wohin der Wind Sie trägt, Landung am Strand. Kostenlose Abholung und Rückfahrt."
    },
    included: ["guide", "transfer"],
    notes: [
      {
        it: "Il ritiro in hotel a Tenerife Sud è compreso: il pulmino passa mezz'ora prima dell'orario scelto, e alla fine ti riporta indietro.",
        en: "Hotel pickup in the south of Tenerife is included: the van comes half an hour before the time you pick, and brings you back at the end.",
        es: "La recogida en el hotel en el sur de Tenerife está incluida: la furgoneta pasa media hora antes de la hora elegida y al final te lleva de vuelta.",
        fr: "La prise en charge à l'hôtel dans le sud de Tenerife est comprise : le van passe une demi-heure avant l'heure choisie, et vous ramène à la fin.",
        de: "Die Abholung am Hotel im Süden Teneriffas ist inklusive: Der Van kommt eine halbe Stunde vor der gewählten Zeit und bringt Sie am Ende zurück."
      },
      {
        it: "Età 8-80 anni secondo il fornitore, ma la pagina segnala altrove un minimo di 14 anni: da confermare prima di prenotare per un bambino.",
        en: "Ages 8-80 according to the operator, though the page states a minimum of 14 elsewhere: to be confirmed before booking for a child.",
        es: "Edad 8-80 años según el proveedor, aunque la página indica en otra parte un mínimo de 14 años: a confirmar antes de reservar para un menor.",
        fr: "De 8 à 80 ans selon l'opérateur, mais ailleurs sa page indique un minimum de 14 ans : à confirmer avant de réserver pour un enfant.",
        de: "Von 8 bis 80 Jahren laut Anbieter, aber an anderer Stelle nennt seine Seite ein Mindestalter von 14: vor der Buchung für ein Kind zu bestätigen."
      },
      {
        it: "Peso da 40 kg in su; sul massimo il fornitore dà due numeri diversi, 100 e 120 kg, da confermare. Non consigliato in gravidanza o con determinate condizioni mediche. Scarpe comode e abbigliamento a strati.",
        en: "Weight from 40 kg up; on the maximum the operator gives two different figures, 100 and 120 kg, to be confirmed. Not recommended during pregnancy or with certain medical conditions. Comfortable shoes and layered clothing.",
        es: "Peso a partir de 40 kg; sobre el máximo el proveedor da dos cifras distintas, 100 y 120 kg, a confirmar. No recomendado durante el embarazo o con determinadas condiciones médicas. Calzado cómodo y ropa por capas.",
        fr: "Poids à partir de 40 kg ; pour le maximum, l'opérateur donne deux chiffres différents, 100 et 120 kg, à confirmer. Déconseillé pendant la grossesse ou avec certains problèmes de santé. Chaussures confortables et vêtements en couches.",
        de: "Gewicht ab 40 kg; für das Maximum nennt der Anbieter zwei verschiedene Werte, 100 und 120 kg, zu bestätigen. Nicht empfohlen in der Schwangerschaft oder bei bestimmten gesundheitlichen Problemen. Bequeme Schuhe und Kleidung in Schichten."
      },
      {
        it: "L'atterraggio è di solito sulla Playa de la Enramada, a La Caleta, quando il vento lo permette.",
        en: "Landing is usually on La Enramada beach, in La Caleta, when the wind allows it.",
        es: "El aterrizaje suele ser en la playa de La Enramada, en La Caleta, cuando el viento lo permite.",
        fr: "L'atterrissage se fait d'habitude sur la plage de La Enramada, à La Caleta, quand le vent le permet.",
        de: "Gelandet wird meist am Strand La Enramada in La Caleta, wenn der Wind es zulässt."
      }
    ],
    languages: LINGUE_TOUR,
    image: "paragliding.jpg",
    published: true
  },
  {
    id: "karting",
    title: "Karting",
    category: "avventura-motori",
    zone: "Fañabé",
    duration: { it: "10 minuti a tanda", en: "10-minute session", es: "10 minutos por tanda", fr: "Session de 10 minutes", de: "10-Minuten-Session" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["breve"],
    priceFrom: 20,
    priceAdult: 20,
    priceChild: 15,
    ages: { adult: "14+", child: "7-13" },
    family: true,
    included: ["equipment"],
    // Una voce sola, e non e' una svista: le tande sono libere, non ci sono
    // partenze, e l'unico orario vero e' quando il circuito e' aperto
    // (10:00-20:30, ufficio 10 settembre 2026). Spezzarlo in fasce faceva
    // sembrare che si scegliesse fra dei turni che non esistono; le fasce
    // segnaposto erano peggio ancora, offrivano le 09:00 a cancello chiuso.
    // Chi ha una preferenza sull'ora la scrive nelle note della richiesta.
    times: ["10:00 - 20:30"],
    // Le quattro voci del listino esposto al circuito (foto dell'ufficio, 15
    // settembre 2026). Il Superkart Double non sta qui perche' si paga **a
    // kart** e non a persona: moltiplicato per le persone darebbe il doppio.
    // Sta in nota, col suo prezzo.
    options: {
      label: { it: "Formula", en: "Format", es: "Fórmula", fr: "Formule", de: "Format" },
      choices: [
        {
          label: { it: "Tanda da 10 minuti", en: "10-minute session", es: "Tanda de 10 minutos", fr: "Session de 10 minutes", de: "10-Minuten-Session" },
          duration: { it: "10 minuti", en: "10 minutes", es: "10 minutos", fr: "10 minutes", de: "10 Minuten" },
          priceAdult: 20,
          priceChild: 15,
          desc: {
            it: "Una tanda da 10 minuti.",
            en: "One 10-minute session.",
            es: "Una tanda de 10 minutos.",
            fr: "Une session de 10 minutes.",
            de: "Eine Session von 10 Minuten."
          }
        },
        {
          // Per i junior i venti minuti non esistono (ufficio, 15 settembre
          // 2026): senza `priceChild` il totale con dei bambini non si fa,
          // invece di farli passare gratis.
          label: { it: "Tanda da 20 minuti", en: "20-minute session", es: "Tanda de 20 minutos", fr: "Session de 20 minutes", de: "20-Minuten-Session" },
          duration: { it: "20 minuti", en: "20 minutes", es: "20 minutos", fr: "20 minutes", de: "20 Minuten" },
          priceAdult: 35,
          desc: {
            it: "Venti minuti di pista. Esiste solo per gli adulti: i bambini fanno la tanda da 10 minuti.",
            en: "Twenty minutes on track. It exists for adults only: children do the 10-minute session.",
            es: "Veinte minutos en pista. Existe solo para adultos: los niños hacen la tanda de 10 minutos.",
            fr: "Vingt minutes sur la piste. Elle existe seulement pour les adultes : les enfants font la session de 10 minutes.",
            de: "Zwanzig Minuten auf der Strecke. Nur für Erwachsene: Kinder fahren die 10-Minuten-Session."
          }
        },
        {
          label: { it: "Mini Prix", en: "Mini Prix", es: "Mini Prix", fr: "Mini Prix", de: "Mini Prix" },
          duration: { it: "20 minuti", en: "20 minutes", es: "20 minutos", fr: "20 minutes", de: "20 Minuten" },
          // Solo adulti (ufficio, 15 settembre 2026): niente `priceChild`, cosi'
          // con dei bambini il totale non si fa invece di contarli a 40 euro.
          priceAdult: 40,
          desc: {
            it: "Dieci minuti di qualifica, dieci di gara e la coppa al primo. Da 5 a 15 persone, e solo adulti: alle gare i bambini non partecipano.",
            en: "Ten minutes of qualifying, ten of racing and a trophy for the winner. From 5 to 15 people, and adults only: children do not take part in the races.",
            es: "Diez minutos de clasificación, diez de carrera y el trofeo para el primero. De 5 a 15 personas, y solo adultos: los niños no participan en las carreras.",
            fr: "Dix minutes de qualifications, dix de course et un trophée pour le gagnant. De 5 à 15 personnes, et seulement des adultes : les enfants ne participent pas aux courses.",
            de: "Zehn Minuten Qualifying, zehn Minuten Rennen und ein Pokal für den Sieger. Von 5 bis 15 Personen, und nur Erwachsene: Kinder nehmen an den Rennen nicht teil."
          }
        },
        {
          label: { it: "Grand Prix", en: "Grand Prix", es: "Grand Prix", fr: "Grand Prix", de: "Grand Prix" },
          duration: { it: "30 minuti", en: "30 minutes", es: "30 minutos", fr: "30 minutes", de: "30 Minuten" },
          // Solo adulti, come il Mini Prix.
          priceAdult: 60,
          desc: {
            it: "Dieci minuti di prove, dieci di qualifica e dieci di gara, poi la coppa e il brindisi. Da 5 a 15 persone, e solo adulti.",
            en: "Ten minutes of practice, ten of qualifying and ten of racing, then the trophy and a toast. From 5 to 15 people, and adults only.",
            es: "Diez minutos de entrenamientos, diez de clasificación y diez de carrera, después el trofeo y el brindis. De 5 a 15 personas, y solo adultos.",
            fr: "Dix minutes d'essais, dix de qualifications et dix de course, puis le trophée et un toast. De 5 à 15 personnes, et seulement des adultes.",
            de: "Zehn Minuten Training, zehn Qualifying und zehn Rennen, dann Pokal und ein Anstoßen. Von 5 bis 15 Personen, und nur Erwachsene."
          }
        }
      ]
    },
    desc: {
      it: "Pista all'aperto di 857 metri a Fañabé, otto curve e impianto di illuminazione per girare anche dopo il tramonto. Si guida a tande da 10 minuti: kart da adulto dai 14 anni, kart junior dai 7, e un biposto per chi è ancora troppo piccolo per guidare da solo.",
      en: "An 857-metre outdoor track in Fañabé, eight corners and floodlights for driving after sunset too. You drive in 10-minute sessions: adult karts from 14, junior karts from 7, and a two-seater for anyone still too small to drive alone.",
      es: "Circuito al aire libre de 857 metros en Fañabé, ocho curvas e iluminación para rodar también después del atardecer. Se conduce en tandas de 10 minutos: karts de adulto desde los 14 años, karts junior desde los 7 y un biplaza para quien todavía es pequeño para conducir solo.",
      fr: "Une piste en plein air de 857 mètres à Fañabé, huit virages et un éclairage pour rouler aussi après le coucher du soleil. On roule par sessions de 10 minutes : karts adultes dès 14 ans, karts juniors dès 7 ans, et un biplace pour ceux qui sont encore trop petits pour conduire seuls.",
      de: "Eine 857 Meter lange Freiluftstrecke in Fañabé, acht Kurven und Flutlicht, um auch nach Sonnenuntergang zu fahren. Gefahren wird in 10-Minuten-Sessions: Erwachsenenkarts ab 14, Juniorkarts ab 7 und ein Zweisitzer für alle, die noch zu klein sind, um allein zu fahren."
    },
    notes: [
      {
        it: "Kart da adulto dai 14 anni in su. Kart junior dai 7 ai 13 anni, con almeno 1,30 m di altezza. Chi non è maggiorenne deve essere accompagnato da un adulto.",
        en: "Adult karts from age 14 up. Junior karts from 7 to 13, with a minimum height of 1.30 m. Anyone under 18 must be accompanied by an adult.",
        es: "Karts de adulto a partir de los 14 años. Karts junior de 7 a 13 años, con al menos 1,30 m de altura. Los menores de 18 años deben ir acompañados de un adulto.",
        fr: "Karts adultes à partir de 14 ans. Karts juniors de 7 à 13 ans, avec une taille minimum de 1,30 m. Les moins de 18 ans doivent être accompagnés d'un adulte.",
        de: "Erwachsenenkarts ab 14 Jahren. Juniorkarts von 7 bis 13, mit einer Mindestgröße von 1,30 m. Unter 18-Jährige müssen von einem Erwachsenen begleitet werden."
      },
      {
        it: "Chi è troppo piccolo per guidare sale sul kart biposto come passeggero: si può dai 3 anni, con un adulto maggiorenne al volante. Costa 25 € a kart, non a persona.",
        en: "Anyone too small to drive rides in the two-seater kart as a passenger: from age 3, with an adult over 18 at the wheel. It costs €25 per kart, not per person.",
        es: "Quien es demasiado pequeño para conducir sube al kart biplaza como pasajero: se puede desde los 3 años, con un adulto mayor de 18 al volante. Cuesta 25 € por kart, no por persona.",
        fr: "Ceux qui sont trop petits pour conduire montent dans le kart biplace comme passagers : dès 3 ans, avec un adulte de plus de 18 ans au volant. Cela coûte €25 par kart, pas par personne.",
        de: "Wer zu klein zum Fahren ist, fährt im Zweisitzer-Kart als Beifahrer mit: ab 3 Jahren, mit einem Erwachsenen über 18 am Steuer. Es kostet €25 pro Kart, nicht pro Person."
      },
      {
        it: "Nel fine settimana i kart junior girano solo in due fasce, dalle 10:00 alle 11:00 e dalle 15:00 alle 16:00. Negli altri giorni non ci sono fasce riservate.",
        en: "At weekends the junior karts run in two slots only, from 10:00 to 11:00 and from 15:00 to 16:00. On other days there are no set slots.",
        es: "Los fines de semana los karts junior ruedan solo en dos franjas, de 10:00 a 11:00 y de 15:00 a 16:00. El resto de días no hay franjas reservadas.",
        fr: "Le week-end, les karts juniors roulent seulement sur deux créneaux, de 10:00 à 11:00 et de 15:00 à 16:00. Les autres jours, il n'y a pas de créneaux fixes.",
        de: "Am Wochenende fahren die Juniorkarts nur in zwei Zeitfenstern, von 10:00 bis 11:00 und von 15:00 bis 16:00. An den anderen Tagen gibt es keine festen Zeiten."
      },
      {
        it: "Il circuito è aperto tutti i giorni dalle 10:00 alle 20:30. Il casco lo dà il circuito; chi preferisce il suo può portarlo, purché sia un integrale da moto.",
        en: "The track is open every day from 10:00 to 20:30. The helmet is provided; if you prefer your own you may bring it, as long as it is a full-face motorcycle helmet.",
        es: "El circuito abre todos los días de 10:00 a 20:30. El casco lo da el circuito; quien prefiera el suyo puede traerlo, siempre que sea un integral de moto.",
        fr: "La piste est ouverte tous les jours de 10:00 à 20:30. Le casque est fourni ; si vous préférez le vôtre, vous pouvez l'apporter, à condition que ce soit un casque de moto intégral.",
        de: "Die Strecke ist täglich von 10:00 bis 20:30 geöffnet. Der Helm wird gestellt; wer lieber den eigenen nimmt, darf ihn mitbringen, sofern es ein Motorrad-Integralhelm ist."
      },
      {
        it: "Il Mini Prix e il Grand Prix sono solo per adulti, si prenotano prima e vogliono un gruppo da 5 a 15 persone. Per i bambini, e per chi è in pochi, c'è la tanda da 10 minuti: quella non ha minimi.",
        en: "The Mini Prix and the Grand Prix are for adults only, are booked in advance and need a group of 5 to 15 people. For children, and for small parties, there is the 10-minute session: that one has no minimum.",
        es: "El Mini Prix y el Grand Prix son solo para adultos, se reservan antes y necesitan un grupo de 5 a 15 personas. Para los niños, y para quien va en pocos, está la tanda de 10 minutos: esa no tiene mínimo.",
        fr: "Le Mini Prix et le Grand Prix sont réservés aux adultes, se réservent à l'avance et demandent un groupe de 5 à 15 personnes. Pour les enfants, et pour les petits groupes, il y a la session de 10 minutes : celle-là n'a pas de minimum.",
        de: "Mini Prix und Grand Prix sind nur für Erwachsene, werden im Voraus gebucht und brauchen eine Gruppe von 5 bis 15 Personen. Für Kinder und kleine Gruppen gibt es die 10-Minuten-Session: Die hat kein Minimum."
      }
    ],
    image: "karting.webp",
    published: true
  },
  {
    id: "cavallo",
    title: { it: "Passeggiata a cavallo", en: "Horseback riding", es: "Paseo a caballo", fr: "Balade à cheval", de: "Reiten" },
    category: "avventura-motori",
    zone: "Guargacho",
    duration: { it: "1 o 2 ore", en: "1 or 2 hours", es: "1 o 2 horas", fr: "1 ou 2 heures", de: "1 oder 2 Stunden" },
    zoneGroups: ["los-cristianos"],
    durationGroups: ["breve"],
    priceFrom: 50,
    priceAdult: 50,
    priceChild: 0,
    family: true,
    options: {
      label: { it: "Durata", en: "Duration", es: "Duración", fr: "Durée", de: "Dauer" },
      choices: [
        // Orari e prezzo delle 2 ore dal proprietario e dalla pagina di Xanadú
        // (15 ottobre 2026): partenza ogni giorno, 1 ora alle 12:00 e 2 ore
        // alle 9:30. A persona: priceAdult e non price, cosi' si fa il totale.
        // Il giro al tramonto tolto dal proprietario: Xanadú non lo fa.
        { label: { it: "1 ora", en: "1 hour", es: "1 hora", fr: "1 heure", de: "1 Stunde" }, priceAdult: 50, times: ["12:00"] },
        {
          label: { it: "2 ore (percorso costiero)", en: "2 hours (coastal route)", es: "2 horas (ruta costera)", fr: "2 heures (parcours côtier)", de: "2 Stunden (Küstenroute)" },
          priceAdult: 85,
          times: ["09:30"],
          duration: { it: "2 ore", en: "2 hours", es: "2 horas", fr: "2 heures", de: "2 Stunden" }
        }
      ]
    },
    desc: {
      it: "Passeggiata a cavallo con guida da Guargacho, in gruppo o privata, lungo sentieri adatti anche a chi non ha mai cavalcato.",
      en: "A guided horseback ride from Guargacho, in a group or private, along trails suitable even for first-time riders.",
      es: "Paseo a caballo con guía desde Guargacho, en grupo o privado, por senderos aptos incluso para quien nunca ha montado.",
      fr: "Une balade à cheval guidée depuis Guargacho, en groupe ou en privé, sur des sentiers adaptés même à ceux qui montent pour la première fois.",
      de: "Ein geführter Ausritt ab Guargacho, in der Gruppe oder privat, auf Wegen, die auch für Anfänger geeignet sind."
    },
    // La compagnia, come si scrive sul ticket di carta (15 ottobre 2026).
    nomi: ["Xanadú", "Xanadu"],
    // Il ritiro c'e' ma si paga a famiglia, non a persona: niente
    // transferPrice (il totale lo farebbe a testa) e niente icona. La scheda
    // resta in PICKUP_NESSUNO: nella richiesta compare "Vuoi il transfer?", e
    // l'hotel si chiede solo a chi lo spunta, come sul Freebird.
    transfer: {
      it: "Il ritiro in hotel costa 10 € a famiglia, solo nel sud: da Callao Salvaje a El Médano.",
      en: "Hotel pick-up costs €10 per family, only in the south: from Callao Salvaje to El Médano.",
      es: "La recogida en el hotel cuesta 10 € por familia, solo en el sur: de Callao Salvaje a El Médano.",
      fr: "La prise en charge à l'hôtel coûte 10 € par famille, seulement dans le sud : de Callao Salvaje à El Médano.",
      de: "Die Abholung vom Hotel kostet 10 € pro Familie, nur im Süden: von Callao Salvaje bis El Médano."
    },
    included: ["guide", "equipment"],
    notes: [
      {
        it: "Età minima 6 anni, peso massimo 95 kg. Gruppo di massimo 6 persone. Consigliati pantaloni lunghi, scarpe chiuse e robuste, crema solare e acqua.",
        en: "Minimum age 6, maximum weight 95 kg. Groups of up to 6 people. Long trousers, sturdy closed shoes, sun cream and water recommended.",
        es: "Edad mínima 6 años, peso máximo 95 kg. Grupos de hasta 6 personas. Se recomiendan pantalones largos, calzado cerrado y resistente, crema solar y agua.",
        fr: "Âge minimum 6 ans, poids maximum 95 kg. Groupes de 6 personnes au maximum. Pantalon long, chaussures fermées et solides, crème solaire et eau conseillés.",
        de: "Mindestalter 6 Jahre, Höchstgewicht 95 kg. Gruppen von höchstens 6 Personen. Lange Hose, feste geschlossene Schuhe, Sonnencreme und Wasser empfohlen."
      },
      {
        it: "Casco di sicurezza e armadietti per gli effetti personali inclusi.",
        en: "Safety helmet and lockers for personal belongings included.",
        es: "Casco de seguridad y taquillas para los objetos personales incluidos.",
        fr: "Casque de sécurité et casiers pour les affaires personnelles compris.",
        de: "Schutzhelm und Schließfächer für persönliche Sachen inklusive."
      }
    ],
    languages: ["English", "Español"],
    image: "cavallo.webp",
    published: true
  },

  // ─── SPORT ACQUATICI ──────────────────────────────────────────────────────
  {
    id: "fiat-500-water-car",
    title: "Fiat 500 Water Car",
    // La compagnia come i venditori la scrivono sul ticket (proprietario, 29
    // ottobre 2026; foglio di Nancy, ticket 0470 "Dolce Vita 1h").
    nomi: ["Dolce Vita"],
    category: "sport-acquatici",
    zone: "Puerto Colón, Costa Adeje",
    duration: { it: "40 minuti, 1 o 2 ore", en: "40 minutes, 1 or 2 hours", es: "40 minutos, 1 o 2 horas", fr: "40 minutes, 1 ou 2 heures", de: "40 Minuten, 1 oder 2 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["breve"],
    // Stesse partenze del Jet Ski Safari (proprietario, 9 ottobre 2026).
    times: ["10:00", "12:00", "14:00", "16:00", "17:00"],
    priceFrom: 130,
    priceUnit: { it: "a Fiat 500", en: "per Fiat 500", es: "por Fiat 500", fr: "par Fiat 500", de: "pro Fiat 500" },
    priceAdult: 0,
    priceChild: 0,
    options: {
      label: { it: "Durata", en: "Duration", es: "Duración", fr: "Durée", de: "Dauer" },
      choices: [
        // Il giro corto (proprietario, 21 ottobre 2026; ticket 0599 di Kristine).
        { label: { it: "40 minuti", en: "40 minutes", es: "40 minutos", fr: "40 minutes", de: "40 Minuten" }, price: 130 },
        { label: { it: "1 ora", en: "1 hour", es: "1 hora", fr: "1 heure", de: "1 Stunde" }, price: 170 },
        { label: { it: "2 ore", en: "2 hours", es: "2 horas", fr: "2 heures", de: "2 Stunden" }, price: 220 }
      ]
    },
    family: true,
    desc: {
      it: "Una Fiat 500 galleggiante da guidare al largo della costa sud, con un capitano a bordo che vi accompagna. Si parte da Puerto Colón verso El Duque o Los Cristianos, secondo il mare, con una sosta per il bagno: la foto che tutti si portano a casa.",
      en: "A floating Fiat 500 you drive along the south coast, with a captain on board beside you. It sets off from Puerto Colón towards El Duque or Los Cristianos, depending on the sea, with a stop for a swim: the photo everyone takes home.",
      es: "Un Fiat 500 flotante para conducir por la costa sur, con un capitán a bordo que os acompaña. Sale de Puerto Colón hacia El Duque o Los Cristianos, según el mar, con una parada para bañarse: la foto que todos se llevan a casa.",
      fr: "Une Fiat 500 flottante que vous conduisez le long de la côte sud, avec un capitaine à bord à côté de vous. Elle part de Puerto Colón vers El Duque ou Los Cristianos, selon la mer, avec un arrêt baignade : la photo que tout le monde rapporte.",
      de: "Ein schwimmender Fiat 500, den Sie selbst an der Südküste entlang steuern, mit einem Kapitän an Bord neben Ihnen. Abfahrt ab Puerto Colón Richtung El Duque oder Los Cristianos, je nach Meer, mit einem Badestopp: das Foto, das alle mit nach Hause nehmen."
    },
    included: ["swimstop", "snorkel"],
    notes: [
      {
        it: "Il capitano resta sempre a bordo: lo chiedono le regole del mare. Guidate voi, sotto il suo controllo. Per guidare servono 18 anni, la patente nautica no.",
        en: "The captain stays on board the whole time: maritime rules require it. You drive, under the captain's supervision. Drivers must be 18 or over; no boating licence is needed.",
        es: "El capitán va siempre a bordo: lo exigen las normas del mar. Conducís vosotros, bajo su supervisión. Para conducir hay que tener 18 años; no hace falta licencia de navegación.",
        fr: "Le capitaine reste à bord tout le temps : les règles maritimes l'exigent. Vous conduisez, sous la surveillance du capitaine. Les conducteurs doivent avoir 18 ans ou plus ; aucun permis bateau n'est nécessaire.",
        de: "Der Kapitän bleibt die ganze Zeit an Bord: Die Seefahrtsregeln schreiben es vor. Sie fahren, unter Aufsicht des Kapitäns. Fahrer müssen mindestens 18 sein; ein Bootsführerschein ist nicht nötig."
      },
      {
        it: "Al massimo 3 adulti e 1 bambino fino a 12 anni: 4 adulti non possono salire. Portate un documento d'identità.",
        en: "Maximum 3 adults and 1 child up to 12 years old: 4 adults are not allowed. Bring an identity document.",
        es: "Como máximo 3 adultos y 1 niño de hasta 12 años: 4 adultos no pueden subir. Traed un documento de identidad.",
        fr: "Au maximum 3 adultes et 1 enfant jusqu'à 12 ans : 4 adultes ne sont pas acceptés. Apportez une pièce d'identité.",
        de: "Höchstens 3 Erwachsene und 1 Kind bis 12 Jahre: 4 Erwachsene sind nicht erlaubt. Bringen Sie einen Ausweis mit."
      }
    ],
    image: "fiat-500-on-water.webp",
    published: true
  },
  {
    id: "banana-boat",
    title: "Banana Boat, Fly Fish or Crazy UFO Ride",
    // La compagnia dei tre gonfiabili, come la scrivono i venditori sul
    // ticket ("Wow crazy ufo"; proprietario, 14 ottobre 2026).
    nomi: ["WoW"],
    category: "sport-acquatici",
    zone: "Puerto Colón, Costa Adeje",
    duration: { it: "10 o 15 minuti", en: "10 or 15 minutes", es: "10 o 15 minutos", fr: "10 ou 15 minutes", de: "10 oder 15 Minuten" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["breve"],
    priceFrom: 15,
    priceAdult: 15,
    priceChild: 15,
    ages: { adult: "16+", child: "10-15" },
    family: true,
    included: ["lifejacket", "equipment", "guide"],
    // Una voce sola, come sul karting: le corse sono continue, non ci sono
    // partenze fra cui scegliere e l'unico orario vero e' quando il molo e'
    // aperto (10:00-18:00, proprietario 13 settembre 2026). Scritto come
    // intervallo non c'e' l'ambiguita' che sul parascending era costata una
    // correzione: qui le 18:00 sono la chiusura, non l'ultima partenza.
    times: ["10:00 - 18:00"],
    // Tre gonfiabili diversi tenuti in una scheda sola per scelta del
    // proprietario (13 settembre 2026): la corsa è la stessa cosa, cambia solo
    // l'attrezzo. Partono tutti e tre dallo stesso molo di Puerto Colón, sempre
    // dal proprietario: la fonte dava il Pantalán 4 solo per il Crazy UFO, e
    // quella distinzione è stata tolta.
    options: {
      label: { it: "Quale gonfiabile", en: "Which inflatable", es: "Qué hinchable", fr: "Quelle bouée", de: "Welcher Reifen" },
      choices: [
        {
          label: "Banana Boat",
          duration: { it: "10 minuti", en: "10 minutes", es: "10 minutos", fr: "10 minutes", de: "10 Minuten" },
          priceAdult: 15,
          priceChild: 15,
          desc: {
            it: "La banana classica trainata dal motoscafo, fino a dodici persone per corsa: ci si tiene forte e si finisce quasi sempre in acqua. Non serve saper nuotare.",
            en: "The classic banana towed by the speedboat, up to twelve people per ride: you hold on tight and almost always end up in the water. You do not need to know how to swim.",
            es: "La banana clásica remolcada por la lancha, hasta doce personas por salida: hay que agarrarse fuerte y casi siempre se acaba en el agua. No hace falta saber nadar.",
            fr: "La bouée banane classique tirée par le hors-bord, jusqu'à douze personnes par tour : on se tient bien et on finit presque toujours à l'eau. Pas besoin de savoir nager.",
            de: "Die klassische Banane, gezogen vom Schnellboot, bis zu zwölf Personen pro Fahrt: Man hält sich gut fest und landet fast immer im Wasser. Schwimmen können ist nicht nötig."
          }
        },
        {
          label: "Fly Fish",
          duration: { it: "Circa 10 minuti", en: "About 10 minutes", es: "Unos 10 minutos", fr: "Environ 10 minutes", de: "Etwa 10 Minuten" },
          priceAdult: 15,
          priceChild: 15,
          desc: {
            it: "La zattera che con la velocità si stacca dall'acqua e si alza come un'ala, fino a sei persone per corsa. Su questa bisogna saper nuotare.",
            en: "The raft that lifts off the water like a wing as the boat picks up speed, up to six people per ride. For this one you need to be able to swim.",
            es: "La balsa que con la velocidad se despega del agua y se eleva como un ala, hasta seis personas por salida. En esta hay que saber nadar.",
            fr: "La bouée qui décolle de l'eau comme une aile quand le bateau prend de la vitesse, jusqu'à six personnes par tour. Pour celle-ci, il faut savoir nager.",
            de: "Das Floß, das sich wie ein Flügel aus dem Wasser hebt, wenn das Boot Fahrt aufnimmt, bis zu sechs Personen pro Fahrt. Dafür muss man schwimmen können."
          }
        },
        {
          label: "Crazy UFO & Twister",
          duration: { it: "15 minuti", en: "15 minutes", es: "15 minutos", fr: "15 minutes", de: "15 Minuten" },
          priceAdult: 15,
          priceChild: 15,
          desc: {
            it: "Il gonfiabile rotondo che gira e sbanda dietro al motoscafo, fino a otto persone per corsa: è la più lunga delle tre.",
            en: "The round inflatable that spins and slides behind the speedboat, up to eight people per ride: it is the longest of the three.",
            es: "El hinchable redondo que gira y derrapa detrás de la lancha, hasta ocho personas por salida: es la más larga de las tres.",
            fr: "La bouée ronde qui tourne et glisse derrière le hors-bord, jusqu'à huit personnes par tour : c'est la plus longue des trois.",
            de: "Der runde Reifen, der sich hinter dem Schnellboot dreht und rutscht, bis zu acht Personen pro Fahrt: der längste der drei."
          }
        }
      ]
    },
    desc: {
      it: "Una corsa breve sul gonfiabile trainato dal motoscafo, davanti a Puerto Colón: la banana classica, il Fly Fish che si alza sull'acqua o il Crazy UFO che gira su se stesso. Dieci o quindici minuti, giubbotto e briefing compresi, con il personale del motoscafo che segue la corsa dall'inizio alla fine. Al porto ci si arriva da soli.",
      en: "A short ride on an inflatable towed by a speedboat, just off Puerto Colón: the classic banana, the Fly Fish that lifts off the water or the Crazy UFO that spins on itself. Ten or fifteen minutes, life jacket and briefing included, with the speedboat crew watching the ride from start to finish. You make your own way to the marina.",
      es: "Una salida corta en el hinchable remolcado por la lancha, frente a Puerto Colón: la banana clásica, el Fly Fish que se eleva sobre el agua o el Crazy UFO que gira sobre sí mismo. Diez o quince minutos, chaleco y briefing incluidos, con el personal de la lancha siguiendo la salida de principio a fin. Al puerto se llega por cuenta propia.",
      fr: "Un court tour sur une bouée tractée par un hors-bord, juste au large de Puerto Colón : la banane classique, le Fly Fish qui décolle de l'eau ou le Crazy UFO qui tourne sur lui-même. Dix ou quinze minutes, gilet de sauvetage et briefing compris, avec l'équipage du hors-bord qui surveille le tour du début à la fin. On se rend à la marina par ses propres moyens.",
      de: "Eine kurze Fahrt auf einem Reifen, gezogen von einem Schnellboot, gleich vor Puerto Colón: die klassische Banane, der Fly Fish, der sich aus dem Wasser hebt, oder das Crazy UFO, das sich um sich selbst dreht. Zehn oder fünfzehn Minuten, Schwimmweste und Einweisung inklusive, und die Crew des Schnellboots beobachtet die Fahrt von Anfang bis Ende. Zum Jachthafen kommt man selbst."
    },
    notes: [
      {
        it: "Si sale dai 10 anni compiuti. Chi non ha ancora 16 anni deve essere accompagnato da un adulto.",
        en: "Minimum age 10. Anyone under 16 must be accompanied by an adult.",
        es: "Se sube a partir de los 10 años cumplidos. Los menores de 16 deben ir acompañados de un adulto.",
        fr: "Âge minimum 10 ans. Les moins de 16 ans doivent être accompagnés d'un adulte.",
        de: "Mindestalter 10 Jahre. Unter 16-Jährige müssen von einem Erwachsenen begleitet werden."
      },
      {
        it: "Sul Fly Fish bisogna saper nuotare. Sulla banana e sul Crazy UFO no: basta il giubbotto, che è compreso.",
        en: "On the Fly Fish you need to be able to swim. On the banana and the Crazy UFO you do not: the life jacket is enough, and it is included.",
        es: "En el Fly Fish hay que saber nadar. En la banana y en el Crazy UFO no: basta el chaleco, que está incluido.",
        fr: "Sur le Fly Fish, il faut savoir nager. Sur la banane et le Crazy UFO, non : le gilet de sauvetage suffit, et il est compris.",
        de: "Beim Fly Fish muss man schwimmen können. Bei Banane und Crazy UFO nicht: Die Schwimmweste reicht, und sie ist inklusive."
      },
      {
        it: "Sconsigliato a chi ha problemi di schiena o di cuore, in gravidanza, e a chi in acqua non si sente a proprio agio: è una corsa fisica e si finisce in mare.",
        en: "Not advisable if you have back or heart problems, during pregnancy, or if you are not comfortable in the water: it is a physical ride and you end up in the sea.",
        es: "No se recomienda a quien tiene problemas de espalda o de corazón, durante el embarazo, ni a quien no se siente cómodo en el agua: es una salida física y se acaba en el mar.",
        fr: "Déconseillé en cas de problèmes de dos ou de cœur, pendant la grossesse, ou si vous n'êtes pas à l'aise dans l'eau : c'est un tour physique et on finit à la mer.",
        de: "Nicht ratsam bei Rücken- oder Herzproblemen, in der Schwangerschaft oder wenn Sie sich im Wasser nicht wohlfühlen: Es ist eine körperliche Fahrt und man landet im Meer."
      },
      {
        it: "Non c'è il ritiro in hotel: al Puerto Colón ci si arriva da soli. Tutti e tre i gonfiabili partono da lì.",
        en: "There is no hotel pick-up: you make your own way to Puerto Colón. All three inflatables leave from there.",
        es: "No hay recogida en el hotel: se llega por cuenta propia a Puerto Colón. Los tres hinchables salen de allí.",
        fr: "Il n'y a pas de prise en charge à l'hôtel : on se rend à Puerto Colón par ses propres moyens. Les trois bouées partent de là.",
        de: "Es gibt keine Abholung am Hotel: Nach Puerto Colón kommt man selbst. Alle drei Reifen starten dort."
      },
      {
        it: "Porta il costume da bagno, un asciugamano e la crema solare. Al porto ci sono le cassette dove lasciare scarpe, telefono e chiavi.",
        en: "Bring a swimsuit, a towel and sun cream. There are lockers at the marina for shoes, phone and keys.",
        es: "Lleva bañador, una toalla y crema solar. En el puerto hay taquillas para dejar zapatos, móvil y llaves.",
        fr: "Apportez maillot de bain, serviette et crème solaire. Il y a des casiers à la marina pour les chaussures, le téléphone et les clés.",
        de: "Bringen Sie Badesachen, Handtuch und Sonnencreme mit. Am Jachthafen gibt es Schließfächer für Schuhe, Handy und Schlüssel."
      },
      {
        it: "Le foto e i video della corsa non sono compresi: si comprano sul posto, lo stesso giorno.",
        en: "Photos and videos of the ride are not included: you can buy them on the spot, on the day.",
        es: "Las fotos y los vídeos de la salida no están incluidos: se compran allí mismo, el mismo día.",
        fr: "Les photos et vidéos du tour ne sont pas comprises : on peut les acheter sur place, le jour même.",
        de: "Fotos und Videos der Fahrt sind nicht inklusive: Man kann sie am selben Tag vor Ort kaufen."
      },
      {
        it: "Si va dalle 10:00 alle 18:00, tutti i giorni: le corse sono continue, non ci sono partenze fisse.",
        en: "It runs from 10:00 to 18:00, every day: the rides are continuous, there are no set departure times.",
        es: "Se sale de 10:00 a 18:00, todos los días: las salidas son continuas, no hay horarios fijos.",
        fr: "Elle fonctionne de 10:00 à 18:00, tous les jours : les tours sont continus, il n'y a pas d'horaires de départ fixes.",
        de: "Es läuft täglich von 10:00 bis 18:00: Die Fahrten gehen durchgehend, es gibt keine festen Abfahrtszeiten."
      },
      {
        it: "Il prezzo è a persona, per una corsa, ed è lo stesso per tutti: adulti, ragazzi e gruppi.",
        en: "The price is per person, for one ride, and it is the same for everyone: adults, teenagers and groups.",
        es: "El precio es por persona, por una salida, y es el mismo para todos: adultos, jóvenes y grupos.",
        fr: "Le prix est par personne, pour un tour, et il est le même pour tous : adultes, ados et groupes.",
        de: "Der Preis gilt pro Person, für eine Fahrt, und ist für alle gleich: Erwachsene, Jugendliche und Gruppen."
      }
    ],
    image: "banana-boat.webp",
    published: true
  },
  {
    id: "kayak-snorkelling",
    title: "Kayaking & Snorkelling Combo",
    // La compagnia come la scrivono i venditori sul ticket (proprietario,
    // 13 ottobre 2026).
    nomi: ["Shaka Kayak"],
    category: "sport-acquatici",
    zone: "Los Cristianos",
    duration: { it: "2 ore", en: "2 hours", es: "2 horas", fr: "2 heures", de: "2 Stunden" },
    zoneGroups: ["los-cristianos"],
    durationGroups: ["breve"],
    // 35 e' il prezzo che ha deciso l'ufficio, non lo sconto copiato dal
    // rivenditore: la sua pagina dava 45 barrato -> 35, e il pieno sarebbe
    // stato 45. Abbassare si puo' sempre ed e' una scelta di Admiral; e'
    // alzarlo dopo che il cliente l'ha letto che non si fa. Il prezzo dei
    // bambini non era barrato, quindi resta com'era scritto.
    priceFrom: 35,
    priceAdult: 35,
    priceChild: 20,
    // Sotto i 6 anni non si sale: per questo non c'e' nessuna fascia neonati
    // e nessun priceInfant. Assente non vuol dire gratis.
    ages: { adult: "11+", child: "6-10" },
    times: ["10:00", "12:30", "14:00"],
    family: true,
    desc: {
      it: "Un'ora e mezza di pagaiata lungo la costa di Los Cristianos, poi mezz'ora in acqua con maschera e boccaglio dove passano le tartarughe. Delfini e razze capita di vederli, ma dipende dal mare e non sono promessi.",
      en: "An hour and a half of paddling along the Los Cristianos coast, then half an hour in the water with mask and snorkel where the turtles go by. Dolphins and rays do turn up, but that depends on the sea and is not promised.",
      es: "Hora y media remando por la costa de Los Cristianos y luego media hora en el agua con máscara y tubo, por donde pasan las tortugas. Delfines y rayas se ven algunos días, pero depende del mar y no están garantizados.",
      fr: "Une heure et demie de pagaie le long de la côte de Los Cristianos, puis une demi-heure dans l'eau avec masque et tuba là où passent les tortues. Dauphins et raies se montrent parfois, mais cela dépend de la mer et n'est pas promis.",
      de: "Anderthalb Stunden Paddeln entlang der Küste von Los Cristianos, dann eine halbe Stunde mit Maske und Schnorchel im Wasser, wo die Schildkröten vorbeikommen. Delfine und Rochen tauchen manchmal auf, aber das hängt vom Meer ab und ist nicht versprochen."
    },
    included: ["snorkel", "lifejacket", "guide", "swimstop"],
    // Quattro supplementi diversi, e due sono a macchina invece che a persona:
    // in `transferPrice` ci sta **un numero solo**, che poi finisce nel totale,
    // quindi qui il ritiro si spiega a parole. Per lo stesso motivo "transfer"
    // non sta fra le icone: quelle dicono "vale sempre", e qui si paga a parte.
    transfer: {
      it: "Ritiro dall'hotel su richiesta, con un supplemento da pagare all'arrivo: €2 a persona nel sud di Tenerife, €4 a persona da Callao Salvaje e Palm-Mar, €10 a macchina dal Golf del Sur e €15 a macchina da El Médano. Scrivi nelle note l'indirizzo o il nome dell'hotel.",
      en: "Hotel pick-up on request, with a supplement paid on arrival: €2 per person in the south of Tenerife, €4 per person from Callao Salvaje and Palm-Mar, €10 per car from Golf del Sur and €15 per car from El Médano. Add your address or hotel name in the notes.",
      es: "Recogida en el hotel bajo petición, con un suplemento a pagar al llegar: €2 por persona en el sur de Tenerife, €4 por persona desde Callao Salvaje y Palm-Mar, €10 por coche desde Golf del Sur y €15 por coche desde El Médano. Escribe en las notas la dirección o el nombre del hotel.",
      fr: "Prise en charge à l'hôtel sur demande, avec un supplément payé à l'arrivée : €2 par personne dans le sud de Tenerife, €4 par personne depuis Callao Salvaje et Palm-Mar, €10 par voiture depuis Golf del Sur et €15 par voiture depuis El Médano. Indiquez votre adresse ou le nom de l'hôtel dans les notes.",
      de: "Abholung am Hotel auf Anfrage, mit Aufpreis, der bei Ankunft gezahlt wird: €2 pro Person im Süden Teneriffas, €4 pro Person ab Callao Salvaje und Palm-Mar, €10 pro Auto ab Golf del Sur und €15 pro Auto ab El Médano. Schreiben Sie Ihre Adresse oder den Hotelnamen in die Notizen."
    },
    notes: [
      { it: "Bisogna saper nuotare: mezz'ora dell'uscita si passa in acqua con maschera e boccaglio.",
        en: "You need to be able to swim: half an hour of the trip is spent in the water with mask and snorkel.",
        es: "Hay que saber nadar: media hora de la salida se pasa en el agua con máscara y tubo.",
        fr: "Il faut savoir nager : une demi-heure de la sortie se passe dans l'eau avec masque et tuba.",
        de: "Sie müssen schwimmen können: Eine halbe Stunde der Tour verbringt man mit Maske und Schnorchel im Wasser." },
      { it: "Si sale dai 6 anni compiuti, e i più piccoli vanno in kayak insieme a un adulto.",
        en: "Minimum age 6, and the youngest paddlers share a kayak with an adult.",
        es: "Se sube a partir de los 6 años cumplidos, y los más pequeños van en el kayak con un adulto.",
        fr: "Âge minimum 6 ans, et les plus jeunes partagent un kayak avec un adulte.",
        de: "Mindestalter 6 Jahre, und die Jüngsten teilen sich ein Kajak mit einem Erwachsenen." },
      { it: "Il kayak si può fare da soli, in due o in tre: il prezzo non cambia.",
        en: "You can paddle alone, in a pair or in a three: the price is the same.",
        es: "Puedes ir solo, en pareja o de tres en el kayak: el precio no cambia.",
        fr: "Vous pouvez pagayer seul, à deux ou à trois : le prix est le même.",
        de: "Sie können allein, zu zweit oder zu dritt paddeln: Der Preis ist gleich." },
      { it: "Costume sotto i vestiti, scarpe chiuse (le infradito non tengono), crema solare, cappello e un asciugamano per dopo.",
        en: "Swimsuit under your clothes, closed shoes (flip-flops do not hold), sun cream, a hat and a towel for afterwards.",
        es: "Bañador debajo de la ropa, zapato cerrado (las chanclas no sujetan), crema solar, gorra y una toalla para después.",
        fr: "Maillot de bain sous les vêtements, chaussures fermées (les tongs ne tiennent pas), crème solaire, un chapeau et une serviette pour après.",
        de: "Badesachen unter der Kleidung, geschlossene Schuhe (Flip-Flops halten nicht), Sonnencreme, ein Hut und ein Handtuch für danach." },
      { it: "Ci sono gli armadietti per lasciare le tue cose mentre sei in acqua.",
        en: "There are lockers to leave your things in while you are in the water.",
        es: "Hay taquillas para dejar tus cosas mientras estás en el agua.",
        fr: "Il y a des casiers pour laisser vos affaires pendant que vous êtes dans l'eau.",
        de: "Es gibt Schließfächer, um Ihre Sachen zu lassen, während Sie im Wasser sind." },
      { it: "Sconsigliata in gravidanza oltre il quinto mese.",
        en: "Not recommended in pregnancy beyond the fifth month.",
        es: "No se recomienda en embarazos de más de cinco meses.",
        fr: "Déconseillé pendant la grossesse au-delà du cinquième mois.",
        de: "Nicht empfohlen in der Schwangerschaft ab dem fünften Monat." }
    ],
    image: "kayak-snorkelling.webp",
    published: true
  },
  {
    id: "parascending",
    title: "Parascending",
    // Ocean Wings vola da Los Cristianos (proprietario, 10 ottobre 2026): e'
    // una compagnia in piu', non un'altra scheda. Si parte da uno dei due
    // porti, e quale lo dice l'ufficio nella conferma, come sul Jet Ski.
    // AJ Fly ("Aj Fly Parascending" sul foglio dei venditori), 19 ottobre 2026.
    nomi: ["Ocean Wings", "AJ Fly"],
    category: "sport-acquatici",
    zone: { it: "Puerto Colón o Los Cristianos", en: "Puerto Colón or Los Cristianos", es: "Puerto Colón o Los Cristianos", fr: "Puerto Colón ou Los Cristianos", de: "Puerto Colón oder Los Cristianos" },
    // Due durate diverse e tutte e due vere: quaranta minuti e' quanto dura
    // l'uscita (tragitto in barca compreso), dieci e' quanto si sta in aria.
    // Scritta una sola, l'altra diventa una bugia: "40 minuti" fa credere di
    // volare mezz'ora, "10 minuti" fa tornare il cliente al porto troppo presto.
    duration: { it: "40 minuti", en: "40 minutes", es: "40 minutos", fr: "40 minutes", de: "40 Minuten" },
    zoneGroups: ["costa-adeje", "los-cristianos"],
    durationGroups: ["breve"],
    activityLabel: { it: "Tempo di volo", en: "Flight time", es: "Tiempo de vuelo", fr: "Temps de vol", de: "Flugzeit" },
    activityDuration: { it: "Circa 10 minuti", en: "About 10 minutes", es: "Unos 10 minutos", fr: "Environ 10 minutes", de: "Etwa 10 Minuten" },
    // €55 a persona, confermato dal proprietario il 13 settembre 2026: la
    // scheda portava €60 da prima ed e' **sceso**, che e' la direzione
    // permessa. Sul volo paga lo stesso prezzo chiunque occupi un posto,
    // bambini compresi, quindi `priceChild` e' uguale a `priceAdult` e non
    // c'e' nessun `ages`: senza uno sconto per eta' non c'e' nessuna fascia
    // da scrivere. Niente `priceInfant`: sotto i 3 anni non si vola, e
    // assente non vuol dire gratis.
    priceFrom: 55,
    priceAdult: 55,
    priceChild: 55,
    family: true,
    // Le partenze vere, dal proprietario: ogni ora dalle 10:00, e **l'ultimo
    // volo e' alle 17:00**. Prendono il posto delle fasce segnaposto e "Da
    // concordare" sparisce. Niente `days`: si vola tutti i giorni.
    times: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    desc: {
      it: "Si decolla dalla barca appesi al paracadute e si sale sopra la costa del sud: una decina di minuti in aria, con il porto, le spiagge e le montagne sotto i piedi. Fra il tragitto in barca e il volo si sta fuori circa quaranta minuti.",
      en: "You lift off from the boat hanging under the parachute and rise above the southern coast: some ten minutes in the air, with the marina, the beaches and the mountains under your feet. Between the boat ride and the flight you are out for about forty minutes.",
      es: "Se despega desde el barco colgado del paracaídas y se sube sobre la costa sur: unos diez minutos en el aire, con el puerto, las playas y las montañas bajo los pies. Entre el trayecto en barco y el vuelo se está fuera unos cuarenta minutos.",
      fr: "Vous décollez du bateau, suspendu sous le parachute, et vous montez au-dessus de la côte sud : une dizaine de minutes en l'air, avec la marina, les plages et les montagnes sous vos pieds. Entre le bateau et le vol, vous êtes dehors environ quarante minutes.",
      de: "Sie heben vom Boot ab, unter dem Schirm hängend, und steigen über die Südküste: etwa zehn Minuten in der Luft, mit dem Jachthafen, den Stränden und den Bergen unter den Füßen. Mit Bootsfahrt und Flug sind Sie etwa vierzig Minuten unterwegs."
    },
    // L'attrezzatura e il giubbotto li da' il fornitore, e l'istruttore sta a
    // bordo per tutta l'uscita. Le foto **non** ci sono: si comprano sul posto,
    // e stanno in nota invece che fra le icone, che dicono "compreso".
    included: ["equipment", "lifejacket", "guide"],
    notes: [
      { it: "Si vola da soli, in due o in tre: il paracadute porta fino a tre persone per volo.",
        en: "You fly alone, in a pair or in a three: the parachute carries up to three people per flight.",
        es: "Se vuela solo, en pareja o de tres: el paracaídas lleva hasta tres personas por vuelo.",
        fr: "Vous volez seul, à deux ou à trois : le parachute porte jusqu'à trois personnes par vol.",
        de: "Sie fliegen allein, zu zweit oder zu dritt: Der Schirm trägt bis zu drei Personen pro Flug." },
      { it: "Si vola dai 3 anni compiuti; sotto quell'età non si sale.",
        en: "Minimum age 3; below that children cannot fly.",
        es: "Se vuela a partir de los 3 años cumplidos; por debajo de esa edad no se sube.",
        fr: "Âge minimum 3 ans ; en dessous, les enfants ne peuvent pas voler.",
        de: "Mindestalter 3 Jahre; jüngere Kinder dürfen nicht fliegen." },
      { it: "Non serve saper nuotare, e prima di partire c'è un briefing sulla sicurezza con l'istruttore.",
        en: "You do not need to know how to swim, and there is a safety briefing with the instructor before you set off.",
        es: "No hace falta saber nadar, y antes de salir hay un briefing de seguridad con el instructor.",
        fr: "Pas besoin de savoir nager, et il y a un briefing de sécurité avec le moniteur avant de partir.",
        de: "Schwimmen können ist nicht nötig, und vor dem Start gibt es eine Sicherheitseinweisung mit dem Lehrer." },
      { it: "Sconsigliato in gravidanza.",
        en: "Not recommended during pregnancy.",
        es: "No se recomienda durante el embarazo.",
        fr: "Déconseillé pendant la grossesse.",
        de: "In der Schwangerschaft nicht empfohlen." },
      { it: "Porta il costume da bagno, un asciugamano e la crema solare.",
        en: "Bring a swimsuit, a towel and sun cream.",
        es: "Lleva bañador, una toalla y crema solar.",
        fr: "Apportez maillot de bain, serviette et crème solaire.",
        de: "Bringen Sie Badesachen, Handtuch und Sonnencreme mit." },
      { it: "Le foto del volo non sono comprese: si comprano sul posto, lo stesso giorno.",
        en: "Photos of your flight are not included: you can buy them on the spot, on the day.",
        es: "Las fotos del vuelo no están incluidas: se compran allí mismo, el mismo día.",
        fr: "Les photos de votre vol ne sont pas comprises : on peut les acheter sur place, le jour même.",
        de: "Fotos Ihres Flugs sind nicht inklusive: Man kann sie am selben Tag vor Ort kaufen." },
      { it: "Si parte da Puerto Colón o da Los Cristianos: il porto te lo diciamo nella conferma. Non c'è il ritiro in hotel: al porto ci si arriva da soli.",
        en: "Departures are from Puerto Colón or Los Cristianos: we tell you which one in the confirmation. There is no hotel pick-up: you make your own way to the port.",
        es: "Se sale desde Puerto Colón o desde Los Cristianos: el puerto te lo decimos en la confirmación. No hay recogida en el hotel: se llega por cuenta propia al puerto.",
        fr: "Les départs se font de Puerto Colón ou de Los Cristianos : nous vous disons lequel dans la confirmation. Il n'y a pas de prise en charge à l'hôtel : on se rend au port par ses propres moyens.",
        de: "Abfahrt ist in Puerto Colón oder Los Cristianos: Welcher Hafen, sagen wir Ihnen in der Bestätigung. Es gibt keine Abholung am Hotel: Zum Hafen kommt man selbst." }
    ],
    image: "parascending.webp",
    published: true
  },
  {
    id: "jet-ski-safari-1-2h",
    title: "Jet Ski Safari",
    // Le compagnie come i venditori le scrivono sul ticket: Agua Safari parte
    // da Las Galletas (proprietario, 8 ottobre 2026), Flash Jetski e Jetski
    // Island da Puerto Colón (proprietario, 13 ottobre 2026). Ognuna ha il
    // suo netto, quindi sul ticket la compagnia va scelta. Extreme e' la
    // quarta (proprietario, 14 ottobre 2026), Ace la quinta (19 ottobre).
    nomi: ["Agua Safari", "Flash Jetski", "Jetski Island", "Extreme", "Ace"],
    category: "sport-acquatici",
    zone: { it: "Puerto Colón o Las Galletas", en: "Puerto Colón or Las Galletas", es: "Puerto Colón o Las Galletas", fr: "Puerto Colón ou Las Galletas", de: "Puerto Colón oder Las Galletas" },
    duration: { it: "40 minuti, 1 o 2 ore", en: "40 minutes, 1 or 2 hours", es: "40 minutos, 1 o 2 horas", fr: "40 minutes, 1 ou 2 heures", de: "40 Minuten, 1 oder 2 Stunden" },
    zoneGroups: ["costa-adeje", "los-cristianos"],
    durationGroups: ["breve"],
    priceFrom: 90,
    // Il prezzo e' della moto d'acqua, che porta una o due persone: senza
    // questo campo il totale moltiplicherebbe per le persone un numero che
    // non e' a persona. Per lo stesso motivo le varianti hanno `price` e non
    // `priceAdult`.
    priceUnit: { it: "a moto d'acqua", en: "per jet ski", es: "por moto de agua", fr: "par jet-ski", de: "pro Jetski" },
    units: {
      label: { it: "Quante moto d'acqua", en: "How many jet skis", es: "¿Cuántas motos de agua?", fr: "Combien de jet-skis", de: "Wie viele Jetskis" },
      name: { it: "Moto d'acqua", en: "Jet skis", es: "Motos de agua", fr: "Jet-skis", de: "Jetskis" },
      transferPrice: 0,
      types: [
        { key: "singola", seats: 1, name: { it: "Singola", en: "Single", es: "Individual", fr: "Simple", de: "Single" } },
        { key: "doppia", seats: 2, name: { it: "Doppia", en: "Double", es: "Doble", fr: "Double", de: "Doppel" } }
      ]
    },
    priceAdult: 0,
    priceChild: 0,
    // Gli stessi cinque orari per tutte e tre le durate: confermato dal
    // proprietario il 12 settembre 2026. Prima erano divisi per durata (1 ora
    // alle 10/14/16/17, 2 ore alle 12) perche' cosi' li scriveva la pagina di
    // CanaryVIP, un rivenditore: era la sua disponibilita', non la nostra.
    // Quindi niente `times` dentro le varianti, e niente `desc` sulle 2 ore,
    // che serviva solo a spiegare gli orari "forse" di quella pagina.
    times: ["10:00", "12:00", "14:00", "16:00", "17:00"],
    options: {
      label: { it: "Durata", en: "Duration", es: "Duración", fr: "Durée", de: "Dauer" },
      choices: [
        { label: { it: "40 minuti", en: "40 minutes", es: "40 minutos", fr: "40 minutes", de: "40 Minuten" },
          price: 90,
          duration: { it: "40 minuti", en: "40 minutes", es: "40 minutos", fr: "40 minutes", de: "40 Minuten" },
          unitPrices: { singola: 90, doppia: 110 } },
        { label: { it: "1 ora", en: "1 hour", es: "1 hora", fr: "1 heure", de: "1 Stunde" },
          price: 100,
          duration: { it: "1 ora", en: "1 hour", es: "1 hora", fr: "1 heure", de: "1 Stunde" },
          unitPrices: { singola: 100, doppia: 120 } },
        { label: { it: "2 ore", en: "2 hours", es: "2 horas", fr: "2 heures", de: "2 Stunden" },
          price: 180,
          duration: { it: "2 ore", en: "2 hours", es: "2 horas", fr: "2 heures", de: "2 Stunden" },
          unitPrices: { singola: 180, doppia: 200 } }
      ]
    },
    family: false,
    desc: {
      it: "Giro guidato in moto d'acqua lungo la costa sud, con istruttore e barca d'appoggio. Si sceglie fra 40 minuti, un'ora e due ore; il prezzo è per moto d'acqua, con una o due persone a bordo.",
      en: "A guided jet ski ride along the south coast, with an instructor and a support boat. Choose between 40 minutes, one hour and two hours; the price is per jet ski, with one or two people on board.",
      es: "Paseo guiado en moto de agua por la costa sur, con instructor y lancha de apoyo. Se elige entre 40 minutos, una hora y dos horas; el precio es por moto de agua, con una o dos personas a bordo.",
      fr: "Une sortie guidée en jet-ski le long de la côte sud, avec un moniteur et un bateau d'assistance. On choisit entre 40 minutes, une heure et deux heures ; le prix est par jet-ski, avec une ou deux personnes à bord.",
      de: "Eine geführte Jetski-Tour entlang der Südküste, mit Lehrer und Begleitboot. Zur Wahl stehen 40 Minuten, eine Stunde und zwei Stunden; der Preis gilt pro Jetski, mit einer oder zwei Personen an Bord."
    },
    included: ["guide"],
    // Il ritiro e' **compreso** (`transferPrice: 0`, proprietario 12 settembre
    // 2026): niente supplemento, e infatti il totale non cambia spuntandolo.
    // Due righe e basta, e non e' poco lavoro tolto per pigrizia: il cliente
    // chiede **quando** e **quante moto**, poi l'ufficio guarda la
    // disponibilita' e decide da quale porto farlo partire. Come si decide e'
    // roba nostra: al cliente arriva solo il posto dove deve andare, scritto
    // nella conferma. Il testo di prima glielo spiegava ("il porto lo
    // assegniamo noi in base all'orario e alle moto che scegli") ed era un
    // dettaglio di magazzino in vetrina: non lo aiutava a decidere niente, e
    // in cambio lo faceva dubitare che il posto fosse gia' sicuro.
    // Quello che serve sapere resta: da dove parte il ritiro, e che lo deve
    // chiedere nella richiesta.
    transfer: {
      it: "Ritiro in hotel senza supplemento sulle partenze da Las Galletas (Palm-Mar, Guaza, Los Cristianos, Las Américas, Costa Adeje). Chiedilo nella richiesta: te lo confermiamo nella risposta.",
      en: "Free hotel pickup on departures from Las Galletas (Palm-Mar, Guaza, Los Cristianos, Las Américas, Costa Adeje). Ask for it in your request: we confirm it in our reply.",
      es: "Recogida en el hotel sin suplemento en las salidas desde Las Galletas (Palm-Mar, Guaza, Los Cristianos, Las Américas, Costa Adeje). Pídela en la solicitud: te lo confirmamos en la respuesta.",
      fr: "Prise en charge gratuite à l'hôtel pour les départs de Las Galletas (Palm-Mar, Guaza, Los Cristianos, Las Américas, Costa Adeje). Demandez-la dans votre demande : nous la confirmons dans notre réponse.",
      de: "Kostenlose Abholung am Hotel bei Abfahrten ab Las Galletas (Palm-Mar, Guaza, Los Cristianos, Las Américas, Costa Adeje). Fragen Sie in Ihrer Anfrage danach: Wir bestätigen sie in unserer Antwort."
    },
    // "Vuoi il transfer?" fa pensare a un pullman che porta all'escursione, e
    // qui la domanda vera e' un'altra. Vale sia per la casella nella finestra
    // sia per la riga del messaggio ("Ritiro in hotel: sì"), che e' quello che
    // l'ufficio legge per sapere da quale porto farlo partire.
    transferLabel: { it: "Ritiro in hotel", en: "Hotel pickup", es: "Recogida en el hotel", fr: "Prise en charge à l'hôtel", de: "Abholung am Hotel" },
    notes: [
      {
        it: "Il prezzo è per moto d'acqua e non a persona: la singola porta una persona, la doppia due. Un istruttore accompagna il gruppo in motoscafo.",
        en: "The price is per jet ski, not per person: a single carries one person, a double carries two. An instructor follows the group on a speedboat.",
        es: "El precio es por moto de agua, no por persona: la individual lleva a una persona, la doble a dos. Un instructor acompaña al grupo en lancha.",
        fr: "Le prix est par jet-ski, pas par personne : un simple porte une personne, un double en porte deux. Un moniteur suit le groupe en hors-bord.",
        de: "Der Preis gilt pro Jetski, nicht pro Person: Ein Single fasst eine Person, ein Doppel zwei. Ein Lehrer begleitet die Gruppe im Schnellboot."
      },
      {
        it: "Si parte da Puerto Colón o da Las Galletas: il porto te lo diciamo nella conferma. Se ti serve il ritiro in hotel chiedilo nella richiesta: si fa dalle partenze di Las Galletas.",
        en: "Departures are from Puerto Colón or Las Galletas: we tell you which one in the confirmation. If you need hotel pickup, ask for it in your request: it runs from the Las Galletas departures.",
        es: "Se sale desde Puerto Colón o desde Las Galletas: el puerto te lo decimos en la confirmación. Si necesitas recogida en el hotel, pídela en la solicitud: se hace desde las salidas de Las Galletas.",
        fr: "Les départs se font de Puerto Colón ou de Las Galletas : nous vous disons lequel dans la confirmation. Si vous avez besoin de la prise en charge à l'hôtel, demandez-la dans votre demande : elle se fait pour les départs de Las Galletas.",
        de: "Abfahrt ist in Puerto Colón oder Las Galletas: Welcher Hafen, sagen wir Ihnen in der Bestätigung. Wenn Sie eine Abholung am Hotel brauchen, fragen Sie in der Anfrage danach: Sie gibt es für die Abfahrten ab Las Galletas."
      },
      {
        it: "Passeggeri dai 7 anni, sempre insieme a un adulto. Si guida da 16 anni: a 16 e 17 serve l'autorizzazione firmata di un genitore, o il genitore presente alla partenza, e non si può portare un altro minorenne sulla stessa moto d'acqua.",
        en: "Passengers from age 7, always with an adult. Riding is allowed from 16: at 16 and 17 a signed parental authorisation is required, or the parent present at departure, and they cannot carry another minor on the same jet ski.",
        es: "Pasajeros a partir de 7 años, siempre con un adulto. Se conduce desde los 16: a los 16 y 17 hace falta la autorización firmada de un progenitor, o su presencia en la salida, y no se puede llevar a otro menor en la misma moto de agua.",
        fr: "Passagers dès 7 ans, toujours avec un adulte. On peut piloter dès 16 ans : à 16 et 17 ans, il faut une autorisation parentale signée, ou le parent présent au départ, et on ne peut pas emmener un autre mineur sur le même jet-ski.",
        de: "Mitfahrer ab 7 Jahren, immer mit einem Erwachsenen. Fahren darf man ab 16: Mit 16 und 17 braucht es eine unterschriebene Erlaubnis der Eltern oder einen Elternteil vor Ort, und man darf keinen anderen Minderjährigen auf demselben Jetski mitnehmen."
      },
      {
        it: "Porta costume, asciugamano e crema solare; le scarpe restano custodite a terra. Non adatta in gravidanza. Le foto in acqua le fanno gli operatori sul posto e si pagano a loro il giorno stesso: non sono comprese nel prezzo.",
        en: "Bring swimwear, a towel and sunscreen; shoes are kept safe on land. Not suitable during pregnancy. Photos in the water are taken by the operators on site and paid to them on the day: they are not included in the price.",
        es: "Trae bañador, toalla y crema solar; el calzado queda guardado en tierra. No apta durante el embarazo. Las fotos en el agua las hacen los operadores allí mismo y se pagan el día de la actividad: no están incluidas en el precio.",
        fr: "Apportez maillot de bain, serviette et crème solaire ; les chaussures restent en sécurité à terre. Ne convient pas pendant la grossesse. Les photos dans l'eau sont prises par les opérateurs sur place et se paient à eux le jour même : elles ne sont pas comprises dans le prix.",
        de: "Bringen Sie Badesachen, Handtuch und Sonnencreme mit; die Schuhe bleiben sicher an Land. Nicht geeignet in der Schwangerschaft. Die Fotos im Wasser machen die Anbieter vor Ort und werden am selben Tag bei ihnen bezahlt: Sie sind nicht im Preis inbegriffen."
      }
    ],
    image: "jet-ski-safari-1-2h.webp",
    published: true
  },
  {
    id: "immersioni",
    // Il centro e' il Big Fish; sul ticket "Try dive" e' il battesimo
    // (foglio dei venditori, 16 ottobre 2026).
    nomi: ["Big Fish"],
    title: {
      it: "Immersioni: battesimo e corso",
      en: "Diving: taster dive and course",
      es: "Buceo: bautizo y curso",
      fr: "Plongée : baptême et cours",
      de: "Tauchen: Schnuppertauchen und Kurse"
    },
    category: "sport-acquatici",
    zone: "Los Cristianos",
    // Il centro Big Fish (proprietario, 19 ottobre 2026; su Google Maps anche
    // "372H+4R Los Cristianos"). Lo vede chi non chiede il transfer: lo
    // snorkeling, che il ritiro non ce l'ha, e chi non spunta la casella.
    ritrovo: "Big Fish, C. Jesus Dominguez Grillo 19, loc. 2, Los Cristianos",
    // Le uniche due durate certe sono quelle di snorkeling e battesimo, e stanno
    // sulle loro varianti. Per tutto il resto — le immersioni con brevetto e i
    // corsi — l'ufficio ha detto che si concordano, e questa e' una risposta,
    // non un buco: "Da definire" la pagina la nasconde (vedi daDefinire()),
    // "Da concordare" invece si legge, come sul tour privato su misura.
    duration: { it: "Da concordare", en: "By arrangement", es: "A convenir", fr: "Sur rendez-vous", de: "Nach Vereinbarung" },
    zoneGroups: ["los-cristianos"],
    durationGroups: ["breve", "mezza"],
    // 45 e' lo snorkeling, la cosa piu' economica del listino. L'immersione
    // vera parte da 50.
    priceFrom: 45,
    priceAdult: 45,
    // I bambini pagano come gli adulti, l'ha confermato l'ufficio: percio' ogni
    // variante porta priceChild uguale a priceAdult e il totale di una famiglia
    // si fa. Le due fasce si toccano senza buchi e senza sovrapposizioni; il
    // 12+ discende dagli 8-11, sopra gli 11 non c'e' altro. Sotto gli 8 anni
    // non si scende, quindi niente fascia neonati e niente priceInfant:
    // assente non vuol dire gratis.
    priceChild: 45,
    ages: { adult: "12+", child: "8-11" },
    family: true,
    desc: {
      it: "Il centro Big Fish di Los Cristianos porta sott'acqua sia chi non si è mai immerso sia chi ha già il brevetto: il battesimo con l'istruttore accanto, le immersioni singole o a pacchetto, quella notturna e i corsi PADI fino al livello Rescue.",
      en: "The Big Fish centre in Los Cristianos takes both first-timers and certified divers underwater: the taster dive with an instructor beside you, single dives or dive packages, the night dive, and PADI courses up to Rescue level.",
      es: "El centro Big Fish de Los Cristianos lleva bajo el agua tanto a quien no se ha sumergido nunca como a quien ya tiene el título: el bautizo con el instructor al lado, inmersiones sueltas o en paquete, la nocturna y los cursos PADI hasta el nivel Rescue.",
      fr: "Le centre Big Fish de Los Cristianos emmène sous l'eau débutants comme plongeurs certifiés : le baptême avec un moniteur à vos côtés, plongées à l'unité ou en forfait, la plongée de nuit, et les cours PADI jusqu'au niveau Rescue.",
      de: "Das Zentrum Big Fish in Los Cristianos bringt Anfänger wie zertifizierte Taucher unter Wasser: Schnuppertauchen mit einem Lehrer an Ihrer Seite, Einzeltauchgänge oder Pakete, Nachttauchgang und PADI-Kurse bis zum Rescue-Level."
    },
    // Attrezzatura e istruttore valgono per tutto. Il ritiro **no**: lo
    // snorkeling delle 10:30 e' senza, l'ha detto l'ufficio. Le icone della
    // scheda vogliono dire "vale sempre", quindi `transfer` sta nell'`included`
    // delle singole varianti che ce l'hanno, e il riquadro si ridisegna a ogni
    // bottone premuto.
    included: ["equipment", "guide"],
    transfer: {
      it: "Ritiro e riconsegna in hotel compresi nel prezzo delle immersioni e dei corsi. Per il battesimo il pulmino passa 20 minuti prima dell'orario scelto. Lo snorkeling delle 10:30 è invece senza ritiro: a Los Cristianos ci si arriva da soli. Scrivi nelle note l'indirizzo o il nome dell'hotel.",
      en: "Hotel pick-up and drop-off are included in the price of the dives and the courses. For the taster dive the minibus comes 20 minutes before the time you choose. The 10:30 snorkelling has no pick-up: you make your own way to Los Cristianos. Add your address or hotel name in the notes.",
      es: "Recogida y regreso al hotel incluidos en el precio de las inmersiones y de los cursos. Para el bautizo la furgoneta pasa 20 minutos antes de la hora elegida. El snorkel de las 10:30 va sin recogida: a Los Cristianos se llega por cuenta propia. Escribe en las notas la dirección o el nombre del hotel.",
      fr: "La prise en charge et le retour à l'hôtel sont compris dans le prix des plongées et des cours. Pour le baptême, le minibus passe 20 minutes avant l'heure choisie. Le snorkeling de 10:30 n'a pas de prise en charge : on se rend à Los Cristianos par ses propres moyens. Indiquez votre adresse ou le nom de l'hôtel dans les notes.",
      de: "Abholung und Rückfahrt zum Hotel sind im Preis der Tauchgänge und Kurse inbegriffen. Beim Schnuppertauchen kommt der Minibus 20 Minuten vor der gewählten Zeit. Das Schnorcheln um 10:30 hat keine Abholung: Nach Los Cristianos kommt man selbst. Schreiben Sie Ihre Adresse oder den Hotelnamen in die Notizen."
    },
    options: {
      label: { it: "Cosa vuoi fare", en: "What you want to do", es: "Qué quieres hacer", fr: "Ce que vous voulez faire", de: "Was Sie machen möchten" },
      // Due modi di scrivere il prezzo, e la differenza conta.
      // Dove una variante si paga **a testa** e il numero e' uno solo, c'e'
      // `priceAdult`: il totale della richiesta si fa e viene giusto.
      // Dove invece il listino da' un prezzo **a immersione** su un intervallo
      // ("3-4 dives, 40 EUR/uds") o un "da 99 EUR", un numero solo non esiste:
      // moltiplicarlo per le persone darebbe un totale falso. In quei casi il
      // prezzo sta scritto **nell'etichetta** e non in `price`, cosi' il
      // cliente lo legge sul bottone e il totale si rifiuta di farsi invece di
      // mostrare una cifra verosimile e sbagliata.
      choices: [
        {
          label: { it: "Snorkeling", en: "Snorkelling", es: "Snorkel", fr: "Snorkeling", de: "Schnorcheln" },
          priceAdult: 45,
          priceChild: 45,
          // L'ora e mezza e' quella dell'uscita, l'ora e' il tempo in acqua.
          duration: {
            it: "1 ora e mezza, di cui 1 ora in acqua",
            en: "1 hour 30, an hour of it in the water",
            es: "1 hora y media, de ellas 1 hora en el agua",
            fr: "1 heure 30, dont une heure dans l'eau",
            de: "1 Stunde 30, davon eine Stunde im Wasser"
          },
          times: ["10:30"],
          // L'unica variante senza ritiro: al centro, il `ritrovo` della
          // scheda, ci si arriva da soli. `null` e non l'assenza del campo, perche' il transfer sta
          // sulla scheda e la variante lo ereditava: la finestra mostrava la
          // casella e chiedeva l'hotel (proprietario, 19 ottobre 2026).
          transfer: null,
          included: ["snorkel"],
          desc: {
            it: "Uscita in superficie con maschera, boccaglio e pinne, accompagnati. Per chi non vuole scendere con le bombole o accompagna chi si immerge.",
            en: "A guided outing on the surface with mask, snorkel and fins. For anyone who would rather not go down with tanks, or who is coming along with someone who is diving.",
            es: "Salida en superficie con máscara, tubo y aletas, acompañados. Para quien no quiere bajar con botellas o acompaña a quien se sumerge.",
            fr: "Une sortie guidée en surface avec masque, tuba et palmes. Pour ceux qui préfèrent ne pas descendre avec des bouteilles, ou qui accompagnent quelqu'un qui plonge.",
            de: "Ein geführter Ausflug an der Oberfläche mit Maske, Schnorchel und Flossen. Für alle, die nicht mit Flaschen abtauchen möchten oder jemanden begleiten, der taucht."
          }
        },
        {
          // Il centro lo tiene a 90; 70 e' il prezzo che ha deciso l'ufficio.
          // Come per il kayak: abbassare si puo' sempre ed e' una scelta di
          // Admiral, e' alzarlo dopo che il cliente l'ha letto che non si fa.
          label: { it: "Battesimo subacqueo", en: "Try dive", es: "Bautizo de buceo", fr: "Baptême de plongée", de: "Schnuppertauchen" },
          priceAdult: 70,
          priceChild: 70,
          included: ["transfer"],
          // Le due ore e mezza contano anche il viaggio: il pulmino passa 20
          // minuti prima dell'orario scelto e riporta indietro dopo.
          duration: {
            it: "2 ore e mezza: 1 di scuola, 1 di immersione, mezz'ora di ritiro e riconsegna",
            en: "2 hours 30: 1 of lessons, 1 of diving, half an hour of pick-up and drop-off",
            es: "2 horas y media: 1 de clase, 1 de inmersión, media hora de recogida y regreso",
            fr: "2 heures 30 : 1 de cours, 1 de plongée, une demi-heure de prise en charge et de retour",
            de: "2 Stunden 30: 1 Theorie, 1 Tauchen, eine halbe Stunde Abholung und Rückfahrt"
          },
          times: ["09:00", "11:00", "13:00", "15:00"],
          desc: {
            it: "La prima immersione, senza brevetto e senza esperienza: si scende con l'istruttore accanto per tutto il tempo. Bisogna saper nuotare.",
            en: "A first dive, no certification and no experience needed: you go down with the instructor beside you the whole time. You do need to be able to swim.",
            es: "La primera inmersión, sin título ni experiencia: se baja con el instructor al lado todo el rato. Hay que saber nadar.",
            fr: "Une première plongée, sans certification ni expérience : vous descendez avec le moniteur à vos côtés tout le temps. Il faut en revanche savoir nager.",
            de: "Ein erster Tauchgang, ohne Zertifikat und ohne Erfahrung: Sie tauchen mit dem Lehrer die ganze Zeit an Ihrer Seite. Schwimmen können müssen Sie aber."
          }
        },
        {
          label: { it: "1 immersione con brevetto", en: "1 dive, certified", es: "1 inmersión con título", fr: "1 plongée, certifiés", de: "1 Tauchgang, zertifiziert" },
          priceAdult: 50,
          priceChild: 50,
          included: ["transfer"],
          desc: {
            it: "Una singola immersione per chi ha già il brevetto.",
            en: "A single dive for divers who already hold a certification.",
            es: "Una inmersión suelta para quien ya tiene el título.",
            fr: "Une seule plongée pour les plongeurs déjà certifiés.",
            de: "Ein einzelner Tauchgang für Taucher, die schon ein Zertifikat haben."
          }
        },
        {
          label: { it: "2 immersioni con brevetto", en: "2 dives, certified", es: "2 inmersiones con título", fr: "2 plongées, certifiés", de: "2 Tauchgänge, zertifiziert" },
          priceAdult: 90,
          priceChild: 90,
          included: ["transfer"],
          desc: {
            it: "Due immersioni a 45 € l'una: 90 € a persona.",
            en: "Two dives at €45 each: €90 per person.",
            es: "Dos inmersiones a 45 € cada una: 90 € por persona.",
            fr: "Deux plongées à €45 chacune : €90 par personne.",
            de: "Zwei Tauchgänge zu je €45: €90 pro Person."
          }
        },
        {
          label: {
            it: "3-4 immersioni con brevetto (40 € l'una)",
            en: "3-4 dives, certified (€40 each)",
            es: "3-4 inmersiones con título (40 € cada una)",
            fr: "3-4 plongées, certifiés (€40 chacune)",
            de: "3-4 Tauchgänge, zertifiziert (je €40)"
          },
          included: ["transfer"],
          desc: {
            it: "Quaranta euro a immersione: 120 € per tre, 160 € per quattro.",
            en: "Forty euros per dive: €120 for three, €160 for four.",
            es: "Cuarenta euros por inmersión: 120 € por tres, 160 € por cuatro.",
            fr: "Quarante euros par plongée : €120 pour trois, €160 pour quatre.",
            de: "Vierzig Euro pro Tauchgang: €120 für drei, €160 für vier."
          }
        },
        {
          label: {
            it: "5-9 immersioni con brevetto (35 € l'una)",
            en: "5-9 dives, certified (€35 each)",
            es: "5-9 inmersiones con título (35 € cada una)",
            fr: "5-9 plongées, certifiés (€35 chacune)",
            de: "5-9 Tauchgänge, zertifiziert (je €35)"
          },
          included: ["transfer"],
          desc: {
            it: "Trentacinque euro a immersione: da 175 € per cinque a 315 € per nove.",
            en: "Thirty-five euros per dive: from €175 for five to €315 for nine.",
            es: "Treinta y cinco euros por inmersión: desde 175 € por cinco hasta 315 € por nueve.",
            fr: "Trente-cinq euros par plongée : de €175 pour cinq à €315 pour neuf.",
            de: "Fünfunddreißig Euro pro Tauchgang: von €175 für fünf bis €315 für neun."
          }
        },
        {
          label: { it: "10 immersioni con brevetto", en: "10 dives, certified", es: "10 inmersiones con título", fr: "10 plongées, certifiés", de: "10 Tauchgänge, zertifiziert" },
          priceAdult: 300,
          priceChild: 300,
          included: ["transfer"],
          desc: {
            it: "Dieci immersioni a 30 € l'una: 300 € a persona.",
            en: "Ten dives at €30 each: €300 per person.",
            es: "Diez inmersiones a 30 € cada una: 300 € por persona.",
            fr: "Dix plongées à €30 chacune : €300 par personne.",
            de: "Zehn Tauchgänge zu je €30: €300 pro Person."
          }
        },
        {
          label: { it: "Immersione notturna", en: "Night dive", es: "Inmersión nocturna", fr: "Plongée de nuit", de: "Nachttauchgang" },
          priceAdult: 65,
          priceChild: 65,
          included: ["transfer"],
          // `times: []` e non "campo assente": le fasce segnaposto sono di
          // giorno (09:00-10:00 e via cosi') e su una notturna facevano ridere.
          // Vuoto lascia solo "Da concordare", che qui e' anche vero: l'ora
          // dipende da quando tramonta, e cambia lungo l'anno.
          times: [],
          desc: {
            it: "Un'immersione dopo il tramonto, per chi ha già il brevetto.",
            en: "A dive after sunset, for certified divers.",
            es: "Una inmersión después del atardecer, para quien ya tiene el título.",
            fr: "Une plongée après le coucher du soleil, pour plongeurs certifiés.",
            de: "Ein Tauchgang nach Sonnenuntergang, für zertifizierte Taucher."
          }
        },
        {
          label: "Discover Scuba Diver",
          priceAdult: 150,
          priceChild: 150,
          included: ["transfer"],
          desc: {
            it: "Il primo passo verso il brevetto: la teoria di base e due immersioni, una da riva e una dalla barca.",
            en: "The first step towards certification: the basic theory plus two dives, one from the shore and one from the boat.",
            es: "El primer paso hacia el título: la teoría básica y dos inmersiones, una desde la orilla y otra desde el barco.",
            fr: "Le premier pas vers la certification : la théorie de base plus deux plongées, une du bord et une du bateau.",
            de: "Der erste Schritt zum Zertifikat: die Grundtheorie plus zwei Tauchgänge, einer vom Ufer und einer vom Boot."
          }
        },
        {
          label: "Scuba Diver",
          priceAdult: 300,
          priceChild: 300,
          included: ["transfer"],
          desc: {
            it: "Brevetto limitato, per chi vuole cominciare con calma: permette di scendere fino a 12 metri accompagnati da un istruttore.",
            en: "A limited certification, for anyone who would rather start gradually: it allows dives to 12 metres alongside an instructor.",
            es: "Título limitado, para quien quiere empezar con calma: permite bajar hasta 12 metros acompañado de un instructor.",
            fr: "Une certification limitée, pour ceux qui préfèrent commencer progressivement : elle permet de plonger jusqu'à 12 mètres avec un moniteur.",
            de: "Ein eingeschränktes Zertifikat, für alle, die schrittweise anfangen möchten: Es erlaubt Tauchgänge bis 12 Meter mit einem Lehrer."
          }
        },
        {
          label: "Open Water Diver (OWD)",
          priceAdult: 460,
          priceChild: 460,
          included: ["transfer"],
          desc: {
            it: "Il primo livello PADI vero e proprio: si scende fino a 18 metri in tutto il mondo, con compagni di pari livello o superiore. Non serve aver fatto prima lo Scuba Diver.",
            en: "The first full PADI level: dives to 18 metres anywhere in the world, with buddies of the same level or higher. The Scuba Diver course is not a prerequisite.",
            es: "El primer nivel PADI de verdad: se baja hasta 18 metros en todo el mundo, con compañeros del mismo nivel o superior. No hace falta haber hecho antes el Scuba Diver.",
            fr: "Le premier niveau PADI complet : plongées jusqu'à 18 mètres partout dans le monde, avec des binômes de même niveau ou plus. Le cours Scuba Diver n'est pas obligatoire avant.",
            de: "Das erste vollständige PADI-Level: Tauchgänge bis 18 Meter überall auf der Welt, mit Partnern auf gleichem oder höherem Niveau. Der Scuba-Diver-Kurs ist keine Voraussetzung."
          }
        },
        {
          label: "Advanced Open Water Diver",
          priceAdult: 350,
          priceChild: 350,
          included: ["transfer"],
          desc: {
            it: "Per chi ha già l'Open Water e vuole andare avanti: si arriva a 30 metri e si provano ambienti nuovi.",
            en: "For divers who already hold the Open Water and want to go further: down to 30 metres, and new environments to try.",
            es: "Para quien ya tiene el Open Water y quiere seguir: se llega a 30 metros y se prueban ambientes nuevos.",
            fr: "Pour les plongeurs qui ont déjà l'Open Water et veulent aller plus loin : jusqu'à 30 mètres, et de nouveaux environnements à essayer.",
            de: "Für Taucher, die schon den Open Water haben und weitergehen möchten: bis 30 Meter, und neue Umgebungen zum Ausprobieren."
          }
        },
        {
          label: "Re-activate",
          priceAdult: 90,
          priceChild: 90,
          included: ["transfer"],
          desc: {
            it: "Un'immersione di ripasso per chi ha il brevetto ma è fermo da un po', da fare prima di ripartire.",
            en: "A refresher dive for certified divers who have been out of the water for a while, to do before starting again.",
            es: "Una inmersión de repaso para quien tiene el título pero lleva tiempo parado, para hacer antes de volver a empezar.",
            fr: "Une plongée de remise à niveau pour les plongeurs certifiés qui ne sont pas allés sous l'eau depuis un moment, à faire avant de recommencer.",
            de: "Ein Auffrischungstauchgang für zertifizierte Taucher, die eine Weile nicht im Wasser waren, bevor sie wieder anfangen."
          }
        },
        {
          label: "Rescue Diver + EFR",
          priceAdult: 450,
          priceChild: 450,
          included: ["transfer"],
          desc: {
            it: "Corso di soccorso subacqueo per subacquei esperti: come si prevengono gli incidenti e cosa si fa quando succedono.",
            en: "An underwater rescue course for experienced divers: how accidents are prevented, and what to do when they happen.",
            es: "Curso de rescate subacuático para buceadores con experiencia: cómo se previenen los accidentes y qué hacer cuando ocurren.",
            fr: "Un cours de sauvetage sous l'eau pour plongeurs expérimentés : comment on prévient les accidents, et que faire quand ils arrivent.",
            de: "Ein Rettungskurs unter Wasser für erfahrene Taucher: wie man Unfälle verhindert und was man tut, wenn sie passieren."
          }
        },
        {
          label: {
            it: "Specialità PADI (da 99 €)",
            en: "PADI specialties (from €99)",
            es: "Especialidades PADI (desde 99 €)",
            fr: "Spécialités PADI (dès €99)",
            de: "PADI-Spezialkurse (ab €99)"
          },
          included: ["transfer"],
          desc: {
            it: "Corsi brevi per chi ha già il brevetto e vuole aggiungere una specialità. Il prezzo cambia con la specialità scelta: lo conferma l'ufficio.",
            en: "Short courses for certified divers who want to add a specialty. The price depends on which one: the office confirms it.",
            es: "Cursos cortos para quien ya tiene el título y quiere añadir una especialidad. El precio cambia según cuál: lo confirma la oficina.",
            fr: "Des cours courts pour plongeurs certifiés qui veulent ajouter une spécialité. Le prix dépend de laquelle : le bureau le confirme.",
            de: "Kurze Kurse für zertifizierte Taucher, die eine Spezialisierung hinzufügen möchten. Der Preis hängt vom Kurs ab: Das Büro bestätigt ihn."
          }
        }
      ]
    },
    notes: [
      { it: "Bisogna saper nuotare, anche per il battesimo: l'esperienza subacquea non serve, il saper stare in acqua sì.",
        en: "You need to be able to swim, the taster dive included: no diving experience is required, but being at ease in the water is.",
        es: "Hay que saber nadar, también para el bautizo: la experiencia de buceo no hace falta, estar a gusto en el agua sí.",
        fr: "Il faut savoir nager, baptême compris : aucune expérience de plongée n'est demandée, mais il faut être à l'aise dans l'eau.",
        de: "Sie müssen schwimmen können, auch beim Schnuppertauchen: Taucherfahrung ist nicht nötig, aber man sollte sich im Wasser wohlfühlen." },
      { it: "Si scende dagli 8 anni compiuti, e dagli 8 agli 11 sempre insieme a un adulto. I ragazzi pagano come gli adulti.",
        en: "Minimum age 8, and between 8 and 11 always together with an adult. Children pay the same as adults.",
        es: "Se baja a partir de los 8 años cumplidos, y de los 8 a los 11 siempre con un adulto. Los niños pagan como los adultos.",
        fr: "Âge minimum 8 ans, et entre 8 et 11 ans toujours avec un adulte. Les enfants paient comme les adultes.",
        de: "Mindestalter 8 Jahre, und zwischen 8 und 11 immer zusammen mit einem Erwachsenen. Kinder zahlen wie Erwachsene." },
      { it: "Attrezzatura completa e istruttore sono compresi in tutto. Il ritiro in hotel è compreso nelle immersioni e nei corsi, ma non nello snorkeling. Se hai la tua attrezzatura puoi portarla.",
        en: "Full equipment and instructor are included in everything. Hotel pick-up is included in the dives and the courses, but not in the snorkelling. If you have your own kit you can bring it.",
        es: "Equipo completo e instructor están incluidos en todo. La recogida en el hotel está incluida en las inmersiones y los cursos, pero no en el snorkel. Si tienes tu propio equipo puedes traerlo.",
        fr: "L'équipement complet et le moniteur sont compris partout. La prise en charge à l'hôtel est comprise pour les plongées et les cours, mais pas pour le snorkeling. Si vous avez votre propre matériel, vous pouvez l'apporter.",
        de: "Komplette Ausrüstung und Lehrer sind überall inklusive. Die Abholung am Hotel ist bei Tauchgängen und Kursen inklusive, beim Schnorcheln nicht. Wer eigene Ausrüstung hat, kann sie mitbringen." },
      { it: "L'acqua sta fra i 18 e i 25 °C tutto l'anno e la visibilità va dai 15 ai 30 metri. Sotto capita di incontrare razze, tartarughe, polpi, murene e barracuda: dipende dal giorno, non sono promessi.",
        en: "The water stays between 18 and 25°C all year and visibility runs from 15 to 30 metres. Down there you may meet rays, turtles, octopus, moray eels and barracuda: it depends on the day, and none of it is promised.",
        es: "El agua está entre 18 y 25 °C todo el año y la visibilidad va de 15 a 30 metros. Abajo se pueden encontrar rayas, tortugas, pulpos, morenas y barracudas: depende del día, no están garantizados.",
        fr: "L'eau reste entre 18 et 25 °C toute l'année et la visibilité va de 15 à 30 mètres. En bas, vous pouvez croiser raies, tortues, poulpes, murènes et barracudas : cela dépend du jour, et rien n'est promis.",
        de: "Das Wasser hat das ganze Jahr 18 bis 25 °C und die Sicht reicht von 15 bis 30 Metern. Unten können Ihnen Rochen, Schildkröten, Kraken, Muränen und Barrakudas begegnen: Es hängt vom Tag ab, und nichts davon ist versprochen." },
      { it: "Porta il costume, un asciugamano e le infradito. La macchina fotografica subacquea puoi portarla, a tuo rischio.",
        en: "Bring a swimsuit, a towel and flip-flops. You can bring an underwater camera, at your own risk.",
        es: "Trae bañador, una toalla y chanclas. Puedes traer una cámara subacuática, bajo tu responsabilidad.",
        fr: "Apportez maillot de bain, serviette et tongs. Vous pouvez apporter un appareil photo étanche, à vos risques.",
        de: "Bringen Sie Badesachen, Handtuch und Flip-Flops mit. Eine Unterwasserkamera dürfen Sie auf eigenes Risiko mitnehmen." },
      { it: "Sconsigliata in gravidanza oltre il quinto mese.",
        en: "Not recommended in pregnancy beyond the fifth month.",
        es: "No se recomienda en embarazos de más de cinco meses.",
        fr: "Déconseillé pendant la grossesse au-delà du cinquième mois.",
        de: "Nicht empfohlen in der Schwangerschaft ab dem fünften Monat." },
      { it: "Il centro fa anche i livelli professionali: se ti interessano, chiedi in ufficio.",
        en: "The centre also runs the professional levels: ask the office if you are interested.",
        es: "El centro también imparte los niveles profesionales: pregunta en la oficina si te interesan.",
        fr: "Le centre propose aussi les niveaux professionnels : demandez au bureau si cela vous intéresse.",
        de: "Das Zentrum bietet auch die Profi-Level an: Fragen Sie das Büro, wenn Sie Interesse haben." }
    ],
    image: "immersioni.webp",
    published: true
  },
  {
    id: "flyboard",
    title: "Flyboard",
    category: "sport-acquatici",
    zone: "Costa Adeje",
    duration: { it: "Da definire", en: "To be confirmed", es: "Por confirmar", fr: "À confirmer", de: "Wird bestätigt" },
    zoneGroups: ["costa-adeje"],
    priceFrom: null,
    priceAdult: 0,
    priceChild: 0,
    family: false,
    desc: {
      it: "Sollevarsi sull'acqua con la tavola a getto, con istruttore.",
      en: "Rising above the water on a jet-powered board, with an instructor.",
      es: "Elevarse sobre el agua con la tabla a chorro, con instructor.",
      fr: "S'élever au-dessus de l'eau sur une planche propulsée par jet, avec un moniteur.",
      de: "Auf einem Board mit Wasserstrahlantrieb über das Wasser steigen, mit einem Lehrer."
    },
    image: "flyboard.webp",
    // Spenta il 6 ottobre 2026: il proprietario non lo vende piu'. La scheda
    // resta qui, con la foto, nel caso torni: basta rimettere true.
    published: false
  },
  {
    // Franz Surf School, Playa de las Americas (dati del 13 settembre 2026,
    // in dati-fornitore/grezzo/franz-surf-school.json).
    //
    // ⚠ Il nome della scuola **non va sul sito** (proprietario, 13 settembre
    // 2026): in descrizione si dice "una scuola di surf". Qui nel commento
    // resta, perche' serve a ritrovare il fornitore fra sei mesi. Attenzione:
    // dal 28 ottobre 2026 vale anche per le barche: il nome vero (Freebird,
    // Shogun) sta in `nomi`, non nel titolo.
    //
    // Il fornitore vende anche il noleggio delle tavole (softboard, fibra,
    // longboard): **non e' in catalogo per scelta del proprietario** (13
    // settembre 2026). Ad Admiral interessano le lezioni. Se un giorno
    // cambia idea, i prezzi stanno nel file grezzo, e la strada era il
    // prezzo nell'etichetta ("da 15 € al giorno") perche' il fornitore
    // pubblica solo il primo giorno.
    id: "surf-lesson",
    title: { it: "Lezioni di surf", en: "Surf lessons", es: "Clases de surf", fr: "Cours de surf", de: "Surfkurse" },
    category: "sport-acquatici",
    zone: "Playa de las Américas",
    // Due ore, tutte: in gruppo, private e dentro i pacchetti (proprietario,
    // 13 settembre 2026). Il sito del fornitore la dichiarava solo sul
    // pacchetto da 3 lezioni. Le varianti dei pacchetti hanno la loro durata
    // ("3 lezioni da 2 ore"), che dice anche quante sono.
    duration: { it: "2 ore", en: "2 hours", es: "2 horas", fr: "2 heures", de: "2 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["breve"],
    // Partenze dal proprietario, 9 ottobre 2026: valgono per tutte le lezioni.
    times: ["09:00", "11:00", "16:00", "18:00"],
    priceFrom: 35,
    priceAdult: 35,
    // Dai 13 anni in su, e sopra i 13 si paga tutti uguale: non c'e' una
    // tariffa bambini da mettere, e `priceChild` a 0 tiene la riga spenta.
    // L'eta' vale per tutte le lezioni, singole o di gruppo (proprietario,
    // 13 settembre 2026) - sul sito del fornitore era scritta solo sotto le
    // lezioni di gruppo.
    priceChild: 0,
    ages: { adult: "13+" },
    // Il filtro "Con bambini" non la deve pescare: sotto i 13 anni non si
    // entra in acqua con la scuola.
    family: false,
    desc: {
      it: "Una scuola di surf sulla spiaggia di Playa de las Américas: lezioni da due ore in gruppi di sei persone al massimo, lezioni private con l'istruttore solo per te, lezioni riservate a una famiglia o a un gruppo di amici, e pacchetti da tre, cinque o sette lezioni per chi vuole andare avanti per tutto il soggiorno. Muta, tavola e scarpette in neoprene sono comprese.",
      en: "A surf school on the beach at Playa de las Américas: two-hour lessons in groups of no more than six, private lessons with the instructor all to yourself, lessons kept for one family or group of friends, and packages of three, five or seven lessons for anyone who wants to keep going through the whole stay. Wetsuit, board and neoprene boots are included.",
      es: "Una escuela de surf en la playa de Playa de las Américas: clases de dos horas en grupos de seis personas como máximo, clases privadas con el instructor solo para ti, clases reservadas a una familia o a un grupo de amigos, y packs de tres, cinco o siete clases para quien quiere seguir durante toda la estancia. Neopreno, tabla y escarpines están incluidos.",
      fr: "Une école de surf sur la plage de Playa de las Américas : cours de deux heures en groupes de six au maximum, cours particuliers avec le moniteur rien que pour vous, cours réservés à une famille ou à un groupe d'amis, et forfaits de trois, cinq ou sept cours pour ceux qui veulent continuer pendant tout le séjour. Combinaison, planche et chaussons en néoprène sont compris.",
      de: "Eine Surfschule am Strand von Playa de las Américas: Zwei-Stunden-Kurse in Gruppen von höchstens sechs, Privatstunden mit dem Lehrer ganz für Sie, Stunden nur für eine Familie oder Freundesgruppe und Pakete mit drei, fünf oder sieben Stunden für alle, die den ganzen Aufenthalt dranbleiben wollen. Neoprenanzug, Board und Neoprenschuhe sind inklusive."
    },
    // Vale per tutte e nove le varianti, quindi sta sulla scheda: muta,
    // tavola e scarpette in neoprene sono comprese in ogni lezione e in ogni
    // pacchetto, e l'istruttore c'e' sempre. Le scarpette non hanno una
    // parola loro nel vocabolario: stanno nella descrizione e in nota.
    included: ["board", "wetsuit", "guide"],
    options: {
      label: { it: "Cosa vuoi fare", en: "What you want to do", es: "Qué quieres hacer", fr: "Ce que vous voulez faire", de: "Was Sie machen möchten" },
      // Due modi di scrivere il prezzo, come sulle immersioni.
      // Le lezioni e i pacchetti si pagano **a testa** e hanno un numero
      // solo: `priceAdult`, e il totale della richiesta si fa.
      // La lezione riservata al proprio gruppo si paga **a gruppo** e cambia
      // con quante persone siete: li' c'e' `price` (il numero sul bottone) e
      // gli scaglioni scritti in `desc`, cosi' il totale si rifiuta di farsi
      // invece di moltiplicare 120 € per le teste.
      choices: [
        {
          label: { it: "Lezione di gruppo", en: "Group lesson", es: "Clase en grupo", fr: "Cours en groupe", de: "Gruppenkurs" },
          priceAdult: 35,
          desc: {
            it: "Due ore in gruppo di massimo sei persone, con l'istruttore in acqua. Si parte da zero: come stare sulla tavola, come remare, come alzarsi in piedi.",
            en: "Two hours in a group of no more than six, with the instructor in the water with you. It starts from scratch: how to lie on the board, how to paddle, how to stand up.",
            es: "Dos horas en grupo de un máximo de seis personas, con el instructor en el agua. Se empieza de cero: cómo colocarse en la tabla, cómo remar, cómo ponerse de pie.",
            fr: "Deux heures en groupe de six au maximum, avec le moniteur dans l'eau avec vous. On part de zéro : comment s'allonger sur la planche, comment ramer, comment se lever.",
            de: "Zwei Stunden in einer Gruppe von höchstens sechs, mit dem Lehrer bei Ihnen im Wasser. Man fängt bei null an: wie man sich aufs Board legt, wie man paddelt, wie man aufsteht."
          }
        },
        {
          label: { it: "Lezione privata", en: "Private lesson", es: "Clase privada", fr: "Cours particulier", de: "Privatstunde" },
          priceAdult: 80,
          desc: {
            it: "Un istruttore per un allievo solo: il ritmo e gli esercizi sono decisi su di te. Il prezzo è di una lezione.",
            en: "One instructor for one student: the pace and the exercises are set around you. The price is for one lesson.",
            es: "Un instructor para un solo alumno: el ritmo y los ejercicios se deciden sobre ti. El precio es de una clase.",
            fr: "Un moniteur pour un élève : le rythme et les exercices sont adaptés à vous. Le prix est pour un cours.",
            de: "Ein Lehrer für einen Schüler: Tempo und Übungen richten sich nach Ihnen. Der Preis gilt für eine Stunde."
          }
        },
        {
          // A gruppo, non a testa: niente priceAdult, se no il totale
          // moltiplicherebbe 120 € per il numero di persone.
          label: {
            it: "Lezione privata per famiglie o amici (da 2 a 6 persone)",
            en: "Private lesson for family or friends (2 to 6 people)",
            es: "Clase privada para familias o amigos (de 2 a 6 personas)",
            fr: "Cours privé pour famille ou amis (de 2 à 6 personnes)",
            de: "Privatstunde für Familie oder Freunde (2 bis 6 Personen)"
          },
          price: 120,
          desc: {
            it: "Lezione riservata al tuo gruppo, con l'istruttore solo per voi: si può essere di livelli diversi, principianti compresi. Il prezzo è del gruppo intero e non a testa, e si parte da due persone: 120 € in due, 165 € in tre, 200 € in quattro, 225 € in cinque. In sei si può, e il prezzo del sesto posto te lo confermiamo noi.",
            en: "A lesson kept for your own group, with the instructor only for you: you can be at different levels, complete beginners included. The price is for the whole group and not per person, and it starts at two people: €120 for two, €165 for three, €200 for four, €225 for five. Six is possible too, and we confirm the price for the sixth place.",
            es: "Clase reservada a tu grupo, con el instructor solo para vosotros: podéis ser de niveles distintos, principiantes incluidos. El precio es del grupo entero y no por persona, y se empieza desde dos personas: 120 € en dos, 165 € en tres, 200 € en cuatro, 225 € en cinco. En seis también se puede, y el precio de la sexta plaza te lo confirmamos nosotros.",
            fr: "Un cours réservé à votre groupe, avec le moniteur rien que pour vous : vous pouvez avoir des niveaux différents, débutants complets compris. Le prix est pour tout le groupe et non par personne, et il commence à deux personnes : €120 pour deux, €165 pour trois, €200 pour quatre, €225 pour cinq. Six, c'est possible aussi, et nous confirmons le prix de la sixième place.",
            de: "Eine Stunde nur für Ihre Gruppe, mit dem Lehrer nur für Sie: Sie können verschiedene Niveaus haben, absolute Anfänger inklusive. Der Preis gilt für die ganze Gruppe und nicht pro Person und beginnt bei zwei Personen: €120 für zwei, €165 für drei, €200 für vier, €225 für fünf. Sechs sind auch möglich, den Preis für den sechsten Platz bestätigen wir."
          }
        },
        {
          label: {
            it: "Pacchetto 3 lezioni di gruppo",
            en: "Package of 3 group lessons",
            es: "Pack de 3 clases en grupo",
            fr: "Forfait de 3 cours en groupe",
            de: "Paket mit 3 Gruppenkursen"
          },
          priceAdult: 95,
          duration: { it: "3 lezioni da 2 ore", en: "3 lessons of 2 hours", es: "3 clases de 2 horas", fr: "3 cours de 2 heures", de: "3 Kurse à 2 Stunden" },
          desc: {
            it: "Tre lezioni di gruppo, da usare nei giorni che vuoi durante il soggiorno. Il pacchetto è intestato a una persona e non si può passare a un'altra.",
            en: "Three group lessons, to use on whichever days you like during your stay. The package is in one person's name and cannot be passed on to someone else.",
            es: "Tres clases en grupo, para usar los días que quieras durante la estancia. El pack va a nombre de una persona y no se puede ceder a otra.",
            fr: "Trois cours en groupe, à utiliser les jours que vous voulez pendant votre séjour. Le forfait est au nom d'une personne et ne peut pas être cédé à quelqu'un d'autre.",
            de: "Drei Gruppenkurse, an beliebigen Tagen Ihres Aufenthalts. Das Paket läuft auf eine Person und kann nicht an jemand anderen weitergegeben werden."
          }
        },
        {
          label: {
            it: "Pacchetto 5 lezioni di gruppo",
            en: "Package of 5 group lessons",
            es: "Pack de 5 clases en grupo",
            fr: "Forfait de 5 cours en groupe",
            de: "Paket mit 5 Gruppenkursen"
          },
          priceAdult: 140,
          duration: { it: "5 lezioni da 2 ore", en: "5 lessons of 2 hours", es: "5 clases de 2 horas", fr: "5 cours de 2 heures", de: "5 Kurse à 2 Stunden" },
          desc: {
            it: "Cinque lezioni di gruppo, da usare nei giorni che vuoi durante il soggiorno.",
            en: "Five group lessons, to use on whichever days you like during your stay.",
            es: "Cinco clases en grupo, para usar los días que quieras durante la estancia.",
            fr: "Cinq cours en groupe, à utiliser les jours que vous voulez pendant votre séjour.",
            de: "Fünf Gruppenkurse, an beliebigen Tagen Ihres Aufenthalts."
          }
        },
        {
          label: {
            it: "Pacchetto 7 lezioni di gruppo",
            en: "Package of 7 group lessons",
            es: "Pack de 7 clases en grupo",
            fr: "Forfait de 7 cours en groupe",
            de: "Paket mit 7 Gruppenkursen"
          },
          priceAdult: 175,
          duration: { it: "7 lezioni da 2 ore", en: "7 lessons of 2 hours", es: "7 clases de 2 horas", fr: "7 cours de 2 heures", de: "7 Kurse à 2 Stunden" },
          desc: {
            it: "Sette lezioni di gruppo: è la formula che costa meno a lezione, per i soggiorni lunghi.",
            en: "Seven group lessons: the cheapest formula per lesson, for longer stays.",
            es: "Siete clases en grupo: es la fórmula que menos cuesta por clase, para estancias largas.",
            fr: "Sept cours en groupe : la formule la moins chère par cours, pour les séjours plus longs.",
            de: "Sieben Gruppenkurse: die günstigste Formel pro Stunde, für längere Aufenthalte."
          }
        },
        {
          label: {
            it: "Pacchetto 3 lezioni private",
            en: "Package of 3 private lessons",
            es: "Pack de 3 clases privadas",
            fr: "Forfait de 3 cours particuliers",
            de: "Paket mit 3 Privatstunden"
          },
          priceAdult: 230,
          duration: { it: "3 lezioni da 2 ore", en: "3 lessons of 2 hours", es: "3 clases de 2 horas", fr: "3 cours de 2 heures", de: "3 Kurse à 2 Stunden" },
          desc: {
            it: "Tre lezioni individuali con l'istruttore dedicato. Il pacchetto è intestato a una persona e non si può passare a un'altra.",
            en: "Three one-to-one lessons with your own instructor. The package is in one person's name and cannot be passed on to someone else.",
            es: "Tres clases individuales con el instructor dedicado. El pack va a nombre de una persona y no se puede ceder a otra.",
            fr: "Trois cours individuels avec votre moniteur. Le forfait est au nom d'une personne et ne peut pas être cédé à quelqu'un d'autre.",
            de: "Drei Einzelstunden mit Ihrem eigenen Lehrer. Das Paket läuft auf eine Person und kann nicht an jemand anderen weitergegeben werden."
          }
        },
        {
          label: {
            it: "Pacchetto 5 lezioni private",
            en: "Package of 5 private lessons",
            es: "Pack de 5 clases privadas",
            fr: "Forfait de 5 cours particuliers",
            de: "Paket mit 5 Privatstunden"
          },
          priceAdult: 370,
          duration: { it: "5 lezioni da 2 ore", en: "5 lessons of 2 hours", es: "5 clases de 2 horas", fr: "5 cours de 2 heures", de: "5 Kurse à 2 Stunden" },
          desc: {
            it: "Cinque lezioni individuali con l'istruttore dedicato.",
            en: "Five one-to-one lessons with your own instructor.",
            es: "Cinco clases individuales con el instructor dedicado.",
            fr: "Cinq cours individuels avec votre moniteur.",
            de: "Fünf Einzelstunden mit Ihrem eigenen Lehrer."
          }
        },
        {
          label: {
            it: "Pacchetto 7 lezioni private",
            en: "Package of 7 private lessons",
            es: "Pack de 7 clases privadas",
            fr: "Forfait de 7 cours particuliers",
            de: "Paket mit 7 Privatstunden"
          },
          priceAdult: 490,
          duration: { it: "7 lezioni da 2 ore", en: "7 lessons of 2 hours", es: "7 clases de 2 horas", fr: "7 cours de 2 heures", de: "7 Kurse à 2 Stunden" },
          desc: {
            it: "Sette lezioni individuali con l'istruttore dedicato.",
            en: "Seven one-to-one lessons with your own instructor.",
            es: "Siete clases individuales con el instructor dedicado.",
            fr: "Sept cours individuels avec votre moniteur.",
            de: "Sieben Einzelstunden mit Ihrem eigenen Lehrer."
          }
        }
      ]
    },
    notes: [
      { it: "Si va dai 13 anni in su, ed è lo stesso per tutte le lezioni: in gruppo, private o riservate alla famiglia. Il prezzo è uguale per tutti, quindi nella richiesta conta anche i ragazzi fra gli adulti.",
        en: "From 13 years old, and it is the same for every lesson: group, private or kept for the family. Everyone pays the same, so count teenagers among the adults when you send the request.",
        es: "A partir de los 13 años, y es igual para todas las clases: en grupo, privadas o reservadas a la familia. El precio es igual para todos, así que en la solicitud cuenta también a los chavales entre los adultos.",
        fr: "Dès 13 ans, et c'est pareil pour tous les cours : en groupe, particuliers ou réservés à la famille. Tout le monde paie pareil, donc comptez les ados parmi les adultes quand vous envoyez la demande.",
        de: "Ab 13 Jahren, und das gilt für jede Stunde: Gruppe, privat oder nur für die Familie. Alle zahlen gleich, zählen Sie Jugendliche also bei den Erwachsenen mit, wenn Sie die Anfrage schicken." },
      { it: "In acqua non si è mai più di sei per istruttore: vale per le lezioni di gruppo, per i pacchetti e per quelle riservate a una famiglia o a un gruppo di amici.",
        en: "There are never more than six of you in the water per instructor: that goes for the group lessons, for the packages and for the ones kept for a family or a group of friends.",
        es: "En el agua nunca se está más de seis por instructor: vale para las clases en grupo, para los packs y para las reservadas a una familia o a un grupo de amigos.",
        fr: "Vous n'êtes jamais plus de six dans l'eau par moniteur : cela vaut pour les cours en groupe, pour les forfaits et pour ceux réservés à une famille ou à un groupe d'amis.",
        de: "Pro Lehrer sind nie mehr als sechs im Wasser: Das gilt für die Gruppenkurse, für die Pakete und für die Stunden nur für eine Familie oder Freundesgruppe." },
      { it: "Ogni lezione dura due ore, anche quelle dentro un pacchetto.",
        en: "Every lesson lasts two hours, the ones inside a package included.",
        es: "Cada clase dura dos horas, también las que van dentro de un pack.",
        fr: "Chaque cours dure deux heures, y compris ceux d'un forfait.",
        de: "Jede Stunde dauert zwei Stunden, auch die aus einem Paket." },
      { it: "Gli orari possono spostarsi di 30 minuti, prima o dopo, secondo la marea: l'ora esatta te la diciamo quando confermiamo la richiesta.",
        en: "Times may move by 30 minutes, earlier or later, depending on the tide: we give you the exact time when we confirm your request.",
        es: "Los horarios pueden moverse 30 minutos, antes o después, según la marea: la hora exacta te la decimos cuando confirmamos la solicitud.",
        fr: "Les horaires peuvent bouger de 30 minutes, avant ou après, selon la marée : nous vous donnons l'heure exacte quand nous confirmons votre demande.",
        de: "Die Zeiten können sich je nach Gezeiten um 30 Minuten nach vorn oder hinten verschieben: Die genaue Uhrzeit geben wir Ihnen mit der Bestätigung Ihrer Anfrage." },
      { it: "Muta, tavola e scarpette in neoprene le dà la scuola, in tutte le lezioni e in tutti i pacchetti.",
        en: "Wetsuit, board and neoprene boots are provided by the school, in every lesson and every package.",
        es: "Neopreno, tabla y escarpines los pone la escuela, en todas las clases y en todos los packs.",
        fr: "Combinaison, planche et chaussons en néoprène sont fournis par l'école, à chaque cours et dans chaque forfait.",
        de: "Neoprenanzug, Board und Neoprenschuhe stellt die Schule, bei jeder Stunde und jedem Paket." },
      { it: "Il ritrovo è a Playa de las Américas: ci si arriva da soli, la scuola non passa a prendere in hotel. Il punto esatto te lo diciamo insieme all'ora, quando confermiamo la richiesta.",
        en: "You meet in Playa de las Américas: you make your own way there, the school does not pick you up at your hotel. We give you the exact spot along with the time, when we confirm your request.",
        es: "El punto de encuentro está en Playa de las Américas: se llega por cuenta propia, la escuela no recoge en el hotel. El sitio exacto te lo decimos junto con la hora, cuando confirmamos la solicitud.",
        fr: "Le rendez-vous est à Playa de las Américas : on s'y rend par ses propres moyens, l'école ne passe pas vous prendre à l'hôtel. Nous vous donnons l'endroit exact avec l'heure, quand nous confirmons votre demande.",
        de: "Treffpunkt ist Playa de las Américas: Dorthin kommen Sie selbst, die Schule holt Sie nicht am Hotel ab. Den genauen Ort geben wir Ihnen zusammen mit der Uhrzeit, wenn wir Ihre Anfrage bestätigen." },
      { it: "Porta il costume, un asciugamano, la crema solare e qualcosa da bere: il resto lo dà la scuola.",
        en: "Bring a swimsuit, a towel, sun cream and something to drink: the school provides the rest.",
        es: "Trae bañador, una toalla, crema solar y algo de beber: el resto lo pone la escuela.",
        fr: "Apportez maillot de bain, serviette, crème solaire et de quoi boire : l'école fournit le reste.",
        de: "Bringen Sie Badesachen, Handtuch, Sonnencreme und etwas zu trinken mit: Den Rest stellt die Schule." }
    ],
    image: "surf-lesson.webp",
    published: true
  },
  {
    // Sea Trek Tenerife: la camminata sul fondo del mare col casco, a Los
    // Cristianos (pagina del fornitore incollata dal proprietario, 15 ottobre
    // 2026). La pagina non dava prezzi, eta', durata ne' indirizzo:
    //   - i prezzi (85 adulti, 70 bambini) sono del proprietario, 15 ottobre;
    //   - eta' minima 8 anni, durata 1 ora e mezza - 2 ore, ritrovo in Paseo
    //     Aquilino 10 e gruppi da 6 vengono dalle schede dei rivenditori
    //     (Musement, TUI, easyJet), che dicono tutte la stessa cosa;
    //   - niente ritiro in hotel (proprietario, 15 ottobre): sta in
    //     PICKUP_NESSUNO.
    // E' una scheda a se' e non una variante di "immersioni": e' un'altra
    // compagnia e un'altra cosa, niente bombola e niente brevetto
    // (proprietario, 15 ottobre).
    // I rivenditori nominano l'operatore "Diving on the Moon", ma la compagnia
    // si chiama Seatrek (proprietario, 15 ottobre 2026): sul ticket di carta
    // la scrivono cosi', tutta attaccata.
    id: "sea-trek",
    title: "Sea Trek Tenerife",
    nomi: ["Seatrek"],
    category: "sport-acquatici",
    zone: "Los Cristianos",
    duration: { it: "1 ora e mezza - 2 ore", en: "1.5 - 2 hours", es: "1 hora y media - 2 horas", fr: "1 h 30 - 2 heures", de: "1,5 - 2 Stunden" },
    zoneGroups: ["los-cristianos"],
    durationGroups: ["breve"],
    // Partenze dal proprietario, 15 ottobre 2026.
    times: ["10:00", "11:30", "13:00", "14:00"],
    priceFrom: 85,
    priceAdult: 85,
    priceChild: 70,
    // Sotto gli 8 anni non si scende: niente fascia neonati e niente
    // priceInfant (assente non vuol dire gratis). Bambini 8-11, confermato
    // dal proprietario (15 ottobre 2026).
    ages: { adult: "12+", child: "8-11" },
    family: true,
    desc: {
      it: "Si cammina sul fondo del mare con un casco che ti porta aria di continuo: la testa resta asciutta e si respira normalmente, come fuori dall'acqua. Non serve saper nuotare né aver mai fatto immersioni. Dopo le spiegazioni, con l'istruttore si entra in acqua dalla spiaggia di Las Vistas, a Los Cristianos, e si passeggia fra i pesci. Gruppi piccoli, al massimo sei persone, dagli 8 anni in su.",
      en: "You walk on the sea floor wearing a helmet that keeps feeding you air: your head stays dry and you breathe normally, just as you do out of the water. You don't need to swim or to have ever dived. After the briefing you go in with the instructor from Las Vistas beach, in Los Cristianos, and stroll among the fish. Small groups of six at most, from age 8 up.",
      es: "Se camina por el fondo del mar con un casco que te da aire sin parar: la cabeza se queda seca y se respira con normalidad, como fuera del agua. No hace falta saber nadar ni haber buceado nunca. Después de la explicación se entra al agua con el instructor desde la playa de Las Vistas, en Los Cristianos, y se pasea entre los peces. Grupos pequeños, de seis personas como máximo, a partir de 8 años.",
      fr: "On marche au fond de la mer avec un casque qui vous apporte de l'air en continu : la tête reste au sec et on respire normalement, comme hors de l'eau. Pas besoin de savoir nager ni d'avoir déjà plongé. Après les explications, on entre dans l'eau avec le moniteur depuis la plage de Las Vistas, à Los Cristianos, et on se promène au milieu des poissons. Petits groupes de six au maximum, à partir de 8 ans.",
      de: "Man geht auf dem Meeresboden, mit einem Helm, der ständig Luft zuführt: Der Kopf bleibt trocken und man atmet ganz normal, wie außerhalb des Wassers. Man muss weder schwimmen können noch je getaucht sein. Nach der Einweisung geht es mit dem Lehrer vom Strand Las Vistas in Los Cristianos ins Wasser, und man spaziert zwischen den Fischen. Kleine Gruppen mit höchstens sechs Personen, ab 8 Jahren."
    },
    // Il casco e' l'attrezzatura: `equipment`. Le foto si pagano a parte sul
    // posto, quindi `photos` no.
    included: ["equipment", "wetsuit", "guide"],
    ritrovo: {
      it: "Paseo Aquilino 10, Los Cristianos (primo piano)",
      en: "Paseo Aquilino 10, Los Cristianos (first floor)",
      es: "Paseo Aquilino 10, Los Cristianos (primera planta)",
      fr: "Paseo Aquilino 10, Los Cristianos (premier étage)",
      de: "Paseo Aquilino 10, Los Cristianos (erster Stock)"
    },
    notes: [
      { it: "Ci si arriva da soli: non c'è ritiro in hotel. Dal punto di ritrovo si va a piedi fino alla spiaggia di Las Vistas.",
        en: "You make your own way there: there is no hotel pick-up. From the meeting point you walk to Las Vistas beach.",
        es: "Se llega por cuenta propia: no hay recogida en el hotel. Desde el punto de encuentro se va a pie hasta la playa de Las Vistas.",
        fr: "On s'y rend par ses propres moyens : il n'y a pas de prise en charge à l'hôtel. Du point de rendez-vous, on va à pied jusqu'à la plage de Las Vistas.",
        de: "Sie kommen selbst dorthin: Es gibt keine Abholung am Hotel. Vom Treffpunkt geht es zu Fuß zum Strand Las Vistas." },
      { it: "Non si può fare in gravidanza né nello stesso giorno di un volo. Bisogna riuscire a camminare per un breve tratto e stare tranquilli in acqua.",
        en: "Not possible during pregnancy or on the same day as a flight. You need to be able to walk a short distance and feel at ease in the water.",
        es: "No se puede hacer durante el embarazo ni el mismo día de un vuelo. Hay que poder caminar un tramo corto y estar tranquilo en el agua.",
        fr: "Impossible pendant la grossesse ou le jour d'un vol. Il faut pouvoir marcher sur une courte distance et être à l'aise dans l'eau.",
        de: "Nicht möglich während der Schwangerschaft oder am Tag eines Fluges. Man muss eine kurze Strecke gehen können und sich im Wasser wohlfühlen." },
      { it: "Porta il costume e un asciugamano. Ci sono gli armadietti per le tue cose. Le foto ricordo si possono comprare sul posto, a parte.",
        en: "Bring a swimsuit and a towel. There are lockers for your belongings. Souvenir photos can be bought on site, separately.",
        es: "Trae bañador y una toalla. Hay taquillas para tus cosas. Las fotos de recuerdo se pueden comprar allí, aparte.",
        fr: "Apportez un maillot de bain et une serviette. Il y a des casiers pour vos affaires. Les photos souvenir s'achètent sur place, en plus.",
        de: "Bringen Sie Badesachen und ein Handtuch mit. Für Ihre Sachen gibt es Schließfächer. Erinnerungsfotos kann man vor Ort extra kaufen." }
    ],
    image: "sea-trek.webp",
    // Il gruppo coi caschi e l'istruttore (proprietario, 15 ottobre 2026).
    gallery: ["sea-trek-2.webp"],
    published: true
  },

  // ─── PARCHI E SPETTACOLI ──────────────────────────────────────────────────
  {
    id: "siam-park",
    title: "Siam Park",
    pagamento: "card",
    category: "parchi-spettacoli",
    zone: "Costa Adeje",
    // Al posto di "Giornata intera" (che non dice niente) l'orario vero,
    // spostato qui da `notes`: due volte la stessa informazione confondeva.
    // Le date del cambio dal proprietario, 5 ottobre 2026: "estate" e
    // "inverno" da soli non dicono a chi prenota per fine ottobre quale vale.
    duration: {
      it: "10:00-18:00 dal 1° maggio al 29 ottobre, 10:00-17:00 dal 30 ottobre al 30 aprile",
      en: "10am-6pm from 1 May to 29 October, 10am-5pm from 30 October to 30 April",
      es: "10:00-18:00 del 1 de mayo al 29 de octubre, 10:00-17:00 del 30 de octubre al 30 de abril",
      fr: "10:00-18:00 du 1er mai au 29 octobre, 10:00-17:00 du 30 octobre au 30 avril",
      de: "10:00-18:00 vom 1. Mai bis 29. Oktober, 10:00-17:00 vom 30. Oktober bis 30. April"
    },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["intera"],
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
      label: { it: "Tipo di biglietto", en: "Ticket type", es: "Tipo de entrada", fr: "Type de billet", de: "Ticketart" },
      choices: [
        {
          label: { it: "Biglietti normali", en: "Regular tickets", es: "Entradas normales", fr: "Billets normaux", de: "Normale Tickets" },
          priceAdult: 44,
          priceChild: 32,
          desc: {
            it: "Biglietti d'ingresso regolari.",
            en: "Regular admission tickets.",
            es: "Entradas regulares.",
            fr: "Billets d'entrée normaux.",
            de: "Normale Eintrittskarten."
          }
        },
        {
          // Bambini e neonati: il fornitore non ha ancora dato i due prezzi
          // per questa variante, solo quello dell'adulto. Niente priceChild
          // finche' non arriva: un numero inventato sarebbe peggio di niente.
          label: { it: "Biglietti tutto compreso", en: "All-inclusive tickets", es: "Entradas todo incluido", fr: "Billets tout compris", de: "All-inclusive-Tickets" },
          priceAdult: 165,
          included: ["towels"],
          desc: {
            it: "Ingresso, Fast Pass illimitato per tutte le attrazioni (tranne Power of Tower e Lazy River), armadietto, asciugamano e servizio All Inclusive illimitato ai bar e ristoranti, bevande alcoliche comprese.",
            en: "Admission, unlimited Fast Pass for all attractions (except Power of Tower and Lazy River), locker, towel and unlimited All Inclusive service at bars and restaurants, alcoholic drinks included.",
            es: "Entrada, Fast Pass ilimitado para todas las atracciones (excepto Power of Tower y Lazy River), taquilla, toalla y servicio All Inclusive ilimitado en bares y restaurantes, con bebidas alcohólicas incluidas.",
            fr: "Entrée, Fast Pass illimité pour toutes les attractions (sauf Power of Tower et Lazy River), casier, serviette et service All Inclusive illimité dans les bars et restaurants, boissons alcoolisées comprises.",
            de: "Eintritt, unbegrenzter Fast Pass für alle Attraktionen (außer Power of Tower und Lazy River), Schließfach, Handtuch und unbegrenzter All-inclusive-Service in Bars und Restaurants, alkoholische Getränke inklusive."
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
          label: { it: "Cabina VIP (fino a 4 persone)", en: "VIP Cabin (up to 4 people)", es: "Cabaña VIP (hasta 4 personas)", fr: "Cabane VIP (jusqu'à 4 personnes)", de: "VIP-Cabin (bis 4 Personen)" },
          price: 660,
          included: ["towels"],
          desc: {
            it: "Prezzo forfettario per l'uso esclusivo della cabina, fino a 4 persone incluse (fino a 6, con 151€ a persona per ciascuna oltre le 4). Doccia privata e lettini in terrazza, minibar, cassetta di sicurezza, TV, cibo e bevande illimitati nei ristoranti del parco, bus navetta gratuito. Stesso prezzo anche a luglio e agosto.",
            en: "Flat price for exclusive use of the cabin, up to 4 people included (up to 6, with €151 per extra person beyond 4). Private shower and sun loungers on the terrace, minibar, safe, TV, unlimited food and drinks at the park's restaurants, free shuttle bus. Same price in July and August too.",
            es: "Precio fijo por el uso exclusivo de la cabaña, hasta 4 personas incluidas (hasta 6, con 151€ por persona extra a partir de la 4ª). Ducha privada y tumbonas en la terraza, minibar, caja fuerte, TV, comida y bebida ilimitadas en los restaurantes del parque, autobús lanzadera gratuito. Mismo precio también en julio y agosto.",
            fr: "Prix forfaitaire pour l'usage exclusif de la cabane, jusqu'à 4 personnes comprises (jusqu'à 6, avec €151 par personne en plus au-delà de 4). Douche privée et transats sur la terrasse, minibar, coffre-fort, TV, nourriture et boissons à volonté dans les restaurants du parc, navette gratuite. Même prix aussi en juillet et août.",
            de: "Pauschalpreis für die exklusive Nutzung der Cabin, bis zu 4 Personen inklusive (bis zu 6, mit €151 pro weiterer Person über 4). Private Dusche und Liegen auf der Terrasse, Minibar, Safe, TV, unbegrenzt Essen und Getränke in den Restaurants des Parks, kostenloser Shuttlebus. Gleicher Preis auch im Juli und August."
          }
        },
        {
          label: { it: "Casa VIP (fino a 6 persone)", en: "VIP House (up to 6 people)", es: "Casa VIP (hasta 6 personas)", fr: "Maison VIP (jusqu'à 6 personnes)", de: "VIP-Haus (bis 6 Personen)" },
          price: 990,
          included: ["towels"],
          desc: {
            it: "Prezzo forfettario per l'uso esclusivo della casa, fino a 6 persone incluse (fino a 10, con 151€ a persona per ciascuna oltre le 6). Jacuzzi privata e doccia privata in terrazza, lettini, minibar, cassetta di sicurezza, TV, cibo e bevande illimitati nei ristoranti del parco, bus navetta gratuito.",
            en: "Flat price for exclusive use of the house, up to 6 people included (up to 10, with €151 per extra person beyond 6). Private jacuzzi and private shower on the terrace, sun loungers, minibar, safe, TV, unlimited food and drinks at the park's restaurants, free shuttle bus.",
            es: "Precio fijo por el uso exclusivo de la casa, hasta 6 personas incluidas (hasta 10, con 151€ por persona extra a partir de la 6ª). Jacuzzi privada y ducha privada en la terraza, tumbonas, minibar, caja fuerte, TV, comida y bebida ilimitadas en los restaurantes del parque, autobús lanzadera gratuito.",
            fr: "Prix forfaitaire pour l'usage exclusif de la maison, jusqu'à 6 personnes comprises (jusqu'à 10, avec €151 par personne en plus au-delà de 6). Jacuzzi privé et douche privée sur la terrasse, transats, minibar, coffre-fort, TV, nourriture et boissons à volonté dans les restaurants du parc, navette gratuite.",
            de: "Pauschalpreis für die exklusive Nutzung des Hauses, bis zu 6 Personen inklusive (bis zu 10, mit €151 pro weiterer Person über 6). Privater Whirlpool und private Dusche auf der Terrasse, Liegen, Minibar, Safe, TV, unbegrenzt Essen und Getränke in den Restaurants des Parks, kostenloser Shuttlebus."
          }
        },
        {
          label: { it: "Villa VIP (fino a 8 persone)", en: "VIP Villa (up to 8 people)", es: "Villa VIP (hasta 8 personas)", fr: "Villa VIP (jusqu'à 8 personnes)", de: "VIP-Villa (bis 8 Personen)" },
          price: 1320,
          included: ["towels"],
          desc: {
            it: "Prezzo forfettario per l'uso esclusivo della villa, fino a 8 persone incluse (fino a 12, con 151€ a persona per ciascuna oltre le 8). Jacuzzi privata e doccia privata in terrazza, lettini, minibar, cassetta di sicurezza, TV, area lounge, cibo e bevande illimitati nei ristoranti premium del parco, bus navetta gratuito.",
            en: "Flat price for exclusive use of the villa, up to 8 people included (up to 12, with €151 per extra person beyond 8). Private jacuzzi and private shower on the terrace, sun loungers, minibar, safe, TV, lounge area, unlimited food and drinks at the park's premium restaurants, free shuttle bus.",
            es: "Precio fijo por el uso exclusivo de la villa, hasta 8 personas incluidas (hasta 12, con 151€ por persona extra a partir de la 8ª). Jacuzzi privada y ducha privada en la terraza, tumbonas, minibar, caja fuerte, TV, zona lounge, comida y bebida ilimitadas en los restaurantes premium del parque, autobús lanzadera gratuito.",
            fr: "Prix forfaitaire pour l'usage exclusif de la villa, jusqu'à 8 personnes comprises (jusqu'à 12, avec €151 par personne en plus au-delà de 8). Jacuzzi privé et douche privée sur la terrasse, transats, minibar, coffre-fort, TV, coin salon, nourriture et boissons à volonté dans les restaurants premium du parc, navette gratuite.",
            de: "Pauschalpreis für die exklusive Nutzung der Villa, bis zu 8 Personen inklusive (bis zu 12, mit €151 pro weiterer Person über 8). Privater Whirlpool und private Dusche auf der Terrasse, Liegen, Minibar, Safe, TV, Lounge-Bereich, unbegrenzt Essen und Getränke in den Premium-Restaurants des Parks, kostenloser Shuttlebus."
          }
        }
      ]
    },
    transfer: {
      it: "Disponibile su richiesta, da Tenerife Nord (Puerto de la Cruz e dintorni). Basta indicare l'hotel o l'indirizzo di ritiro.",
      en: "Available on request, from Tenerife North (Puerto de la Cruz and the surrounding area). Just give the hotel or pickup address.",
      es: "Disponible bajo petición, desde Tenerife Norte (Puerto de la Cruz y alrededores). Basta con indicar el hotel o la dirección de recogida.",
      fr: "Disponible sur demande, depuis Tenerife Nord (Puerto de la Cruz et alentours). Il suffit d'indiquer l'hôtel ou l'adresse de prise en charge.",
      de: "Auf Anfrage, ab Teneriffa Nord (Puerto de la Cruz und Umgebung). Einfach das Hotel oder die Abholadresse angeben."
    },
    transferPrice: { adult: 69, child: 53 },
    transferPriceLabel: {
      it: "Transfer da Tenerife Nord",
      en: "Transfer from Tenerife North",
      es: "Traslado desde Tenerife Norte",
      fr: "Transfert depuis Tenerife Nord",
      de: "Transfer ab Teneriffa Nord"
    },
    transferLabel: {
      it: "Vuoi il transfer da Tenerife Nord?",
      en: "Would you like the transfer from Tenerife North?",
      es: "¿Quieres el traslado desde Tenerife Norte?",
      fr: "Voulez-vous le transfert depuis Tenerife Nord ?",
      de: "Möchten Sie den Transfer ab Teneriffa Nord?"
    },
    transferSiam: {
      it: "Disponibile su richiesta, da Los Gigantes, Callao Salvaje o Playa Paraíso. Basta indicare l'hotel o l'indirizzo di ritiro.",
      en: "Available on request, from Los Gigantes, Callao Salvaje or Playa Paraíso. Just give the hotel or pickup address.",
      es: "Disponible bajo petición, desde Los Gigantes, Callao Salvaje o Playa Paraíso. Basta con indicar el hotel o la dirección de recogida.",
      fr: "Disponible sur demande, depuis Los Gigantes, Callao Salvaje ou Playa Paraíso. Il suffit d'indiquer l'hôtel ou l'adresse de prise en charge.",
      de: "Auf Anfrage, ab Los Gigantes, Callao Salvaje oder Playa Paraíso. Einfach das Hotel oder die Abholadresse angeben."
    },
    transferSiamPrice: { adult: 59, child: 42 },
    transferSiamPriceLabel: {
      it: "Transfer da Los Gigantes / Callao Salvaje / Playa Paraíso",
      en: "Transfer from Los Gigantes / Callao Salvaje / Playa Paraíso",
      es: "Traslado desde Los Gigantes / Callao Salvaje / Playa Paraíso",
      fr: "Transfert depuis Los Gigantes / Callao Salvaje / Playa Paraíso",
      de: "Transfer ab Los Gigantes / Callao Salvaje / Playa Paraíso"
    },
    transferSiamLabel: {
      it: "Vuoi il transfer da Los Gigantes, Callao Salvaje o Playa Paraíso?",
      en: "Would you like the transfer from Los Gigantes, Callao Salvaje or Playa Paraíso?",
      es: "¿Quieres el traslado desde Los Gigantes, Callao Salvaje o Playa Paraíso?",
      fr: "Voulez-vous le transfert depuis Los Gigantes, Callao Salvaje ou Playa Paraíso ?",
      de: "Möchten Sie den Transfer ab Los Gigantes, Callao Salvaje oder Playa Paraíso?"
    },
    notes: [
      { it: "In luglio e agosto il biglietto normale costa 48€ per adulto invece di 44€.",
        en: "In July and August the regular ticket costs €48 per adult instead of €44.",
        es: "En julio y agosto la entrada normal cuesta 48 € por adulto en lugar de 44 €.",
        fr: "En juillet et août, le billet normal coûte €48 par adulte au lieu de €44.",
        de: "Im Juli und August kostet das normale Ticket €48 pro Erwachsenem statt €44." },
      { it: "In luglio e agosto il biglietto tutto compreso costa 169€ per adulto invece di 165€.",
        en: "In July and August the all-inclusive ticket costs €169 per adult instead of €165.",
        es: "En julio y agosto la entrada todo incluido cuesta 169 € por adulto en lugar de 165 €.",
        fr: "En juillet et août, le billet tout compris coûte €169 par adulte au lieu de €165.",
        de: "Im Juli und August kostet das All-inclusive-Ticket €169 pro Erwachsenem statt €165." }
    ],
    family: true,
    desc: {
      it: "Parco acquatico a tema thailandese, fra i più premiati al mondo.",
      en: "Thai-themed water park, one of the most awarded in the world.",
      es: "Parque acuático de temática tailandesa, uno de los más premiados del mundo.",
      fr: "Parc aquatique sur le thème de la Thaïlande, l'un des plus primés au monde.",
      de: "Wasserpark im Thai-Stil, einer der meistprämierten der Welt."
    },
    image: "siam-park.jpg",
    published: true
  },
  {
    id: "siam-night",
    title: "Siam Night",
    pagamento: "card",
    category: "parchi-spettacoli",
    // Zona e orario dal proprietario, 5 ottobre 2026: e' il Siam Park di sera,
    // dalle 20 a mezzanotte, solo a luglio e agosto (vedi `season`). Quattro
    // ore: nel filtro sta con le mezze giornate.
    zone: "Costa Adeje",
    duration: { it: "20:00-24:00", en: "8pm-midnight", es: "20:00-24:00", fr: "20:00-minuit", de: "20:00-Mitternacht" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["mezza"],
    season: {
      it: "Solo luglio e agosto",
      en: "July and August only",
      es: "Solo julio y agosto",
      fr: "Juillet et août seulement",
      de: "Nur Juli und August"
    },
    priceFrom: 48,
    priceAdult: 0,
    priceChild: 0,
    family: true,
    desc: {
      it: "Il Siam Park dopo il tramonto, nella sua versione serale.",
      en: "Siam Park after dark, in its evening version.",
      es: "El Siam Park después del atardecer, en su versión nocturna.",
      fr: "Le Siam Park à la nuit tombée, dans sa version du soir.",
      de: "Der Siam Park nach Einbruch der Dunkelheit, in seiner Abendversion."
    },
    image: "siam-night.webp",
    published: true
  },
  {
    id: "loro-parque",
    title: "Loro Parque",
    pagamento: "card",
    category: "parchi-spettacoli",
    zone: "Puerto de la Cruz",
    // Al posto di "Giornata intera" l'orario vero, spostato qui da `notes`.
    duration: { it: "09:30-17:30", en: "9:30am-5:30pm", es: "09:30-17:30", fr: "9:30-17:30", de: "9:30-17:30" },
    zoneGroups: ["teide-nord"],
    durationGroups: ["intera"],
    priceFrom: 44,
    priceAdult: 44,
    priceChild: 32,
    priceInfant: 0,
    ages: { adult: "12+", child: "3-11", infant: "0-2" },
    // Due varianti di biglietto, come su Siam Park: il normale e' a
    // persona, il tutto compreso ha lo stesso prezzo per adulti e bambini
    // (dato cosi' dall'ufficio, non e' un errore).
    options: {
      label: { it: "Tipo di biglietto", en: "Ticket type", es: "Tipo de entrada", fr: "Type de billet", de: "Ticketart" },
      choices: [
        {
          label: { it: "Biglietti normali", en: "Regular tickets", es: "Entradas normales", fr: "Billets normaux", de: "Normale Tickets" },
          priceAdult: 44,
          priceChild: 32,
          desc: {
            it: "Biglietti d'ingresso regolari.",
            en: "Regular admission tickets.",
            es: "Entradas regulares.",
            fr: "Billets d'entrée normaux.",
            de: "Normale Eintrittskarten."
          }
        },
        {
          label: { it: "Biglietti tutto compreso", en: "All-inclusive tickets", es: "Entradas todo incluido", fr: "Billets tout compris", de: "All-inclusive-Tickets" },
          priceAdult: 132,
          priceChild: 132,
          included: ["drinks", "lunch"],
          desc: {
            it: "Ingresso VIP con accesso all-inclusive: cappellino Loro Parque, esperienza Loro Explore, posti riservati VIP agli spettacoli e cibo e bevande illimitati nei ristoranti (escluso il Mercato del Gambia, negozi e bazar). Stesso prezzo per adulti e bambini.",
            en: "VIP admission with all-inclusive access: Loro Parque cap, Loro Explore experience, VIP reserved seats at the shows and unlimited food and drinks at the restaurants (not including the Gambia Market, shops and bazaar). Same price for adults and children.",
            es: "Entrada VIP con acceso todo incluido: gorra de Loro Parque, experiencia Loro Explore, asientos VIP reservados en los espectáculos y comida y bebida ilimitadas en los restaurantes (no incluye el Mercado de Gambia, tiendas y bazar). Mismo precio para adultos y niños.",
            fr: "Entrée VIP avec accès tout compris : casquette Loro Parque, expérience Loro Explore, places VIP réservées aux spectacles et nourriture et boissons à volonté dans les restaurants (sauf le Gambia Market, les boutiques et le bazar). Même prix pour adultes et enfants.",
            de: "VIP-Eintritt mit All-inclusive-Zugang: Loro-Parque-Kappe, Erlebnis Loro Explore, reservierte VIP-Plätze bei den Shows und unbegrenzt Essen und Getränke in den Restaurants (außer Gambia Market, Läden und Basar). Gleicher Preis für Erwachsene und Kinder."
          }
        }
      ]
    },
    transfer: {
      it: "Disponibile su richiesta, da Tenerife Sud. Tutti i giorni da Costa Adeje e Los Cristianos; lunedì, mercoledì, giovedì e sabato da Alcalá, Abama e Los Gigantes; martedì e venerdì da Golf del Sur. Basta indicare l'hotel o l'indirizzo di ritiro.",
      en: "Available on request, from Tenerife South. Every day from Costa Adeje and Los Cristianos; Mondays, Wednesdays, Thursdays and Saturdays from Alcalá, Abama and Los Gigantes; Tuesdays and Fridays from Golf del Sur. Just give the hotel or pickup address.",
      es: "Disponible bajo petición, desde Tenerife Sur. Todos los días desde Costa Adeje y Los Cristianos; lunes, miércoles, jueves y sábado desde Alcalá, Abama y Los Gigantes; martes y viernes desde Golf del Sur. Basta con indicar el hotel o la dirección de recogida.",
      fr: "Disponible sur demande, depuis Tenerife Sud. Tous les jours depuis Costa Adeje et Los Cristianos ; lundi, mercredi, jeudi et samedi depuis Alcalá, Abama et Los Gigantes ; mardi et vendredi depuis Golf del Sur. Il suffit d'indiquer l'hôtel ou l'adresse de prise en charge.",
      de: "Auf Anfrage, ab Teneriffa Süd. Täglich ab Costa Adeje und Los Cristianos; montags, mittwochs, donnerstags und samstags ab Alcalá, Abama und Los Gigantes; dienstags und freitags ab Golf del Sur. Einfach das Hotel oder die Abholadresse angeben."
    },
    transferPrice: { adult: 65, child: 49 },
    family: true,
    desc: {
      it: "Zoo e giardino tropicale, conosciuto in tutto il mondo per i suoi animali.",
      en: "Zoo and tropical garden, known worldwide for its animals.",
      es: "Zoo y jardín tropical, conocido en todo el mundo por sus animales.",
      fr: "Zoo et jardin tropical, connu dans le monde entier pour ses animaux.",
      de: "Zoo und tropischer Garten, weltweit bekannt für seine Tiere."
    },
    image: "loro-parque.webp",
    published: true
  },
  {
    id: "twin-ticket",
    title: "Twin Ticket – Siam Park + Loro Parque",
    pagamento: "card",
    category: "parchi-spettacoli",
    // Dal proprietario, 5 ottobre 2026: due parchi in due zone, quindi la
    // scheda sta in tutti e due i filtri di zona; due giorni, uno per parco.
    // Nel filtro della durata sta con le giornate intere: ogni visita lo e'.
    zone: "Costa Adeje + Puerto de la Cruz",
    duration: { it: "2 giorni, uno per parco", en: "2 days, one per park", es: "2 días, uno por parque", fr: "2 jours, un par parc", de: "2 Tage, einer pro Park" },
    zoneGroups: ["costa-adeje", "teide-nord"],
    durationGroups: ["intera"],
    priceFrom: 78,
    priceAdult: 78,
    priceChild: 57,
    priceInfant: 0,
    ages: { adult: "12+", child: "3-11", infant: "0-2" },
    transfer: {
      it: "Disponibile su richiesta, solo per la giornata a Loro Parque",
      en: "Available on request, for the Loro Parque day only",
      es: "Disponible bajo petición, solo para el día en Loro Parque",
      fr: "Disponible sur demande, seulement pour la journée au Loro Parque",
      de: "Auf Anfrage, nur für den Tag im Loro Parque"
    },
    transferPrice: { adult: 99, child: 74 },
    transferPriceLabel: {
      it: "Transfer Loro Parque (da sud)",
      en: "Loro Parque transfer (from the south)",
      es: "Traslado a Loro Parque (desde el sur)",
      fr: "Transfert Loro Parque (depuis le sud)",
      de: "Transfer Loro Parque (aus dem Süden)"
    },
    // Senza queste due, la finestra della richiesta chiede "Vuoi il
    // transfer?" e poi "Vuoi il transfer per il Siam Park?": la prima non
    // dice ne' la zona ne' il parco, e con due domande sulla stessa scheda
    // si legge come se riguardassero la stessa cosa due volte. Qui si scrive
    // la stessa coppia zona/parco gia' usata sopra in `transferPriceLabel`.
    transferLabel: {
      it: "Vuoi il transfer da sud per Loro Parque?",
      en: "Would you like the transfer from the south, to Loro Parque?",
      es: "¿Quieres el traslado desde el sur, a Loro Parque?",
      fr: "Voulez-vous le transfert depuis le sud, pour le Loro Parque ?",
      de: "Möchten Sie den Transfer aus dem Süden zum Loro Parque?"
    },
    transferSiam: {
      it: "Disponibile su richiesta, solo per la giornata al Siam Park",
      en: "Available on request, for the Siam Park day only",
      es: "Disponible bajo petición, solo para el día en Siam Park",
      fr: "Disponible sur demande, seulement pour la journée au Siam Park",
      de: "Auf Anfrage, nur für den Tag im Siam Park"
    },
    transferSiamPrice: { adult: 103, child: 78 },
    transferSiamPriceLabel: {
      it: "Transfer Siam Park (da nord)",
      en: "Siam Park transfer (from the north)",
      es: "Traslado a Siam Park (desde el norte)",
      fr: "Transfert Siam Park (depuis le nord)",
      de: "Transfer Siam Park (aus dem Norden)"
    },
    transferSiamLabel: {
      it: "Vuoi il transfer da nord per Siam Park?",
      en: "Would you like the transfer from the north, to Siam Park?",
      es: "¿Quieres el traslado desde el norte, a Siam Park?",
      fr: "Voulez-vous le transfert depuis le nord, pour le Siam Park ?",
      de: "Möchten Sie den Transfer aus dem Norden zum Siam Park?"
    },
    family: true,
    desc: {
      it: "Biglietto combinato per i due parchi più conosciuti dell'isola.",
      en: "Combined ticket for the two best-known parks on the island.",
      es: "Entrada combinada para los dos parques más conocidos de la isla.",
      fr: "Billet combiné pour les deux parcs les plus connus de l'île.",
      de: "Kombiticket für die zwei bekanntesten Parks der Insel."
    },
    image: "Cat-parchi.webp",
    published: true
  },
  {
    id: "gran-canaria",
    // Il titolo del fornitore ufficiale e' POEMA DEL MAR "GRAN CANARIA
    // EXPERIENCE". Prima qui c'era solo "Poema del Mar", che in una categoria
    // di parchi si legge come il biglietto di un acquario: questa invece e' una
    // giornata su un'altra isola, nave compresa. Il nome dell'isola nel titolo
    // e' la differenza fra le due cose.
    title: "Poema del Mar – Gran Canaria Experience",
    // Due categorie per una scheda sola: l'acquario e' un parco, ma la
    // giornata e' una gita a Gran Canaria, nave e guida comprese. Chi filtra
    // "Parchi e spettacoli" e chi filtra "Tour e visite" la trovano tutti e
    // due, ed e' sempre la stessa pagina. Il nome sulla card resta quello di
    // `category`: "Parchi e spettacoli".
    category: "parchi-spettacoli",
    alsoIn: ["tour-isola"],
    // Il transfer dal sud e' compreso, quindi il cliente non parte da Santa
    // Cruz: ci arriva. La zona lo dice, se no "Punto di partenza: Santa Cruz"
    // farebbe pensare a chi sta nel sud di doverci andare da solo.
    zone: {
      it: "Ritiro dal sud, imbarco a Santa Cruz",
      en: "Pickup in the south, boarding at Santa Cruz",
      es: "Recogida en el sur, embarque en Santa Cruz",
      fr: "Prise en charge dans le sud, embarquement à Santa Cruz",
      de: "Abholung im Süden, Einschiffung in Santa Cruz"
    },
    // "Circa 12 ore" viene dalla pagina del rivenditore, che e' l'unica a dire
    // quanto dura in tutto; l'ufficiale da' solo gli orari della nave, che
    // restano fra parentesi perche' sono il pezzo certo. "Giornata intera" era
    // vero ma vago, e qui la differenza si sente: chi parte alle 8 e torna alle
    // 20:30 la sera non la organizza.
    duration: {
      it: "Circa 12 ore (traghetto 10:00-18:00)",
      en: "About 12 hours (ferry 10:00-18:00)",
      es: "Unas 12 horas (ferry 10:00-18:00)",
      fr: "Environ 12 heures (ferry 10:00-18:00)",
      de: "Etwa 12 Stunden (Fähre 10:00-18:00)"
    },
    zoneGroups: ["altre-isole"],
    durationGroups: ["intera"],
    priceFrom: 135,
    priceAdult: 135,
    priceChild: 32,
    // I neonati **pagano**: 20 €, non e' uno zero. Il posto sul pullman e sulla
    // nave lo occupano comunque.
    priceInfant: 20,
    // "Children (3-11)" e' scritto nel modulo di prenotazione; il 12+ degli
    // adulti e lo 0-2 dei neonati sono gli unici completamenti che non lasciano
    // buchi fra le tre righe.
    ages: { adult: "12+", child: "3-11", infant: "0-2" },
    days: ["ven"],
    // Niente `times`. Le 10:00 sono il traghetto, non la partenza del cliente:
    // lui parte dal suo hotel, fra le 07:15 e le 08:15 a seconda di dove
    // alloggia, e quell'ora gliela dice ora il campo dell'hotel (PICKUP_TIMES
    // in hotel.js). Scriverle qui le faceva uscire come "Orari: 10:00" sopra la
    // scheda, accanto a un pick-up delle 08:05: due numeri diversi nella stessa
    // pagina, e chi legge in fretta perde il pullman.
    // Il 10:00 resta dov'e' giusto, nella durata e nella prima riga del
    // programma, dove si legge che e' la nave.
    // Il servizio di guida ufficiale e' in queste tre lingue, ed e' una scelta
    // vera del cliente. L'italiano non c'e': il modulo del fornitore lo elenca
    // ma risponde "no excursions available". Le tre sono state riconfermate
    // dall'ufficio l'8 settembre 2026, e sono scritte nel suo ordine.
    languages: ["Español", "Deutsch", "English"],
    included: ["transfer", "ferry", "ticket", "guide", "tasting"],
    itinerary: [
      { time: "10:00", text: { it: "Nave da Santa Cruz verso Agaete",
                               en: "Ferry from Santa Cruz to Agaete",
                               es: "Barco desde Santa Cruz hacia Agaete",
                               fr: "Ferry de Santa Cruz à Agaete",
                               de: "Fähre von Santa Cruz nach Agaete" } },
      { time: "11:30", text: { it: "Arrivo ad Agaete, a Gran Canaria",
                               en: "Arrival at Agaete, on Gran Canaria",
                               es: "Llegada a Agaete, en Gran Canaria",
                               fr: "Arrivée à Agaete, à Gran Canaria",
                               de: "Ankunft in Agaete, auf Gran Canaria" } },
      { text: { it: "Ingresso all'acquario Poema del Mar",
                en: "Entry to the Poema del Mar aquarium",
                es: "Entrada al acuario Poema del Mar",
                fr: "Entrée à l'aquarium Poema del Mar",
                de: "Eintritt ins Aquarium Poema del Mar" } },
      { text: { it: "Visita al quartiere antico di Vegueta",
                en: "A walk through the old quarter of Vegueta",
                es: "Visita al barrio antiguo de Vegueta",
                fr: "Promenade dans le vieux quartier de Vegueta",
                de: "Ein Spaziergang durch die Altstadt Vegueta" } },
      { text: { it: "Visita guidata alle distillerie Arehucas, con degustazione",
                en: "Guided visit to the Arehucas distillery, with a tasting",
                es: "Visita guiada a las destilerías Arehucas, con degustación",
                fr: "Visite guidée de la distillerie Arehucas, avec dégustation",
                de: "Führung durch die Destillerie Arehucas, mit Verkostung" } },
      { time: "17:00", text: { it: "Partenza da Arucas verso Agaete",
                               en: "Departure from Arucas towards Agaete",
                               es: "Salida desde Arucas hacia Agaete",
                               fr: "Départ d'Arucas vers Agaete",
                               de: "Abfahrt von Arucas Richtung Agaete" } },
      { time: "18:00", text: { it: "Nave da Agaete verso Santa Cruz",
                               en: "Ferry from Agaete back to Santa Cruz",
                               es: "Barco desde Agaete hacia Santa Cruz",
                               fr: "Ferry d'Agaete pour revenir à Santa Cruz",
                               de: "Fähre von Agaete zurück nach Santa Cruz" } }
    ],
    notes: [
      { it: "Serve il documento d'identità o il passaporto originale, in corso di validità: senza non si sale sulla nave.",
        en: "You need your original ID card or passport, still valid: without it you can't board the ferry.",
        es: "Hace falta el DNI o el pasaporte original, en vigor: sin él no se puede embarcar.",
        fr: "Il faut votre carte d'identité ou votre passeport originaux, en cours de validité : sans eux, on ne monte pas sur le ferry.",
        de: "Sie brauchen Ihren gültigen Personalausweis oder Reisepass im Original: Ohne ihn darf man nicht auf die Fähre." },
      { it: "Il pranzo non è incluso. Si può mangiare al ristorante dentro il Poema del Mar, che affaccia sulla vasca grande.",
        en: "Lunch is not included. You can eat at the restaurant inside Poema del Mar, which looks onto the big tank.",
        es: "El almuerzo no está incluido. Se puede comer en el restaurante dentro del Poema del Mar, con vistas al tanque grande.",
        fr: "Le déjeuner n'est pas compris. Vous pouvez manger au restaurant à l'intérieur du Poema del Mar, qui donne sur le grand bassin.",
        de: "Das Mittagessen ist nicht inklusive. Sie können im Restaurant im Poema del Mar essen, das auf das große Becken blickt." },
      { it: "Il transfer dal sud fino al porto di Santa Cruz è compreso, andata e ritorno: l'ora del ritiro in hotel si conferma con la prenotazione.",
        en: "The transfer from the south to Santa Cruz harbour is included, both ways: the hotel pickup time is confirmed with the booking.",
        es: "El traslado desde el sur hasta el puerto de Santa Cruz está incluido, ida y vuelta: la hora de recogida en el hotel se confirma con la reserva.",
        fr: "Le transfert du sud au port de Santa Cruz est compris, aller et retour : l'heure de prise en charge à l'hôtel est confirmée avec la réservation.",
        de: "Der Transfer vom Süden zum Hafen von Santa Cruz ist inklusive, hin und zurück: Die Abholzeit am Hotel wird mit der Buchung bestätigt." },
      // Le due ore approssimate vengono dalla pagina del rivenditore. Stanno in
      // una nota, con "intorno a" davanti, e non in `times` o in PICKUP_TIMES:
      // li' sarebbero un orario preciso che nessuno ci ha dato.
      { it: "È una giornata lunga: si parte dall'hotel intorno alle 8:00 e si rientra intorno alle 20:30, con qualche minuto di differenza secondo l'hotel.",
        en: "It is a long day: you leave the hotel around 8:00 and get back around 20:30, give or take a few minutes depending on your hotel.",
        es: "Es un día largo: se sale del hotel sobre las 8:00 y se vuelve sobre las 20:30, con algunos minutos de diferencia según el hotel.",
        fr: "C'est une longue journée : on quitte l'hôtel vers 8:00 et on rentre vers 20:30, à quelques minutes près selon votre hôtel.",
        de: "Es ist ein langer Tag: Man verlässt das Hotel gegen 8:00 und ist gegen 20:30 zurück, plus minus ein paar Minuten je nach Hotel." },
      // I giorni sono un blocco: la finestra non lascia mandare una richiesta
      // per un giorno in cui non si parte. Questa nota fa il mestiere che il
      // blocco non puo fare — dire che quei giorni non sono incisi nella
      // pietra, perche cambiano con la lingua della guida. Una riga sola: nel
      // riquadro dei consigli una nota lunga si legge come un paragrafo.
      { it: "I giorni possono cambiare secondo la lingua della guida.",
        en: "The days can change depending on the language of the guide.",
        es: "Los días pueden cambiar según el idioma del guía.",
        fr: "Les jours peuvent changer selon la langue du guide.",
        de: "Die Tage können sich je nach Sprache des Guides ändern." }
    ],
    family: true,
    desc: {
      it: "Giornata a Gran Canaria in nave: l'acquario Poema del Mar, il quartiere antico di Vegueta e le distillerie Arehucas.",
      en: "A day on Gran Canaria by ferry: the Poema del Mar aquarium, the old quarter of Vegueta and the Arehucas distillery.",
      es: "Un día en Gran Canaria en barco: el acuario Poema del Mar, el barrio antiguo de Vegueta y las destilerías Arehucas.",
      fr: "Une journée à Gran Canaria en ferry : l'aquarium Poema del Mar, le vieux quartier de Vegueta et la distillerie Arehucas.",
      de: "Ein Tag auf Gran Canaria mit der Fähre: das Aquarium Poema del Mar, die Altstadt Vegueta und die Destillerie Arehucas."
    },
    image: "gran-canaria.webp",
    published: true
  },
  {
    id: "aqualand",
    title: "Aqualand",
    category: "parchi-spettacoli",
    zone: "Costa Adeje",
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo", fr: "Journée entière", de: "Ganztags" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["intera"],
    priceFrom: 36,
    priceAdult: 36,
    priceChild: 29,
    priceInfant: 16,
    ages: { adult: "12+", child: "4-11", infant: "0-3" },
    included: ["transfer"],
    // Il ticket conta sempre come pagato con carta, come gli altri parchi
    // (proprietario, 14 ottobre 2026): stesso elenco in sempre_card.
    pagamento: "card",
    notes: [
      { it: "Aperto tutti i giorni, 10:00-17:00. Spettacolo dei delfini alle 15:30, incluso nel biglietto.",
        en: "Open every day, 10am-5pm. Dolphin show at 3:30pm, included in the ticket.",
        es: "Abierto todos los días, 10:00-17:00. Espectáculo de delfines a las 15:30, incluido en la entrada.",
        fr: "Ouvert tous les jours, 10:00-17:00. Spectacle de dauphins à 15:30, compris dans le billet.",
        de: "Täglich geöffnet, 10:00-17:00. Delfinshow um 15:30, im Ticket inbegriffen." },
      { it: "Navetta gratuita Aqualand: Centro Commerciale Pasarela (Los Cristianos) alle 9:30, 10:30 e 11:30; Hotel Sol Arona alle 9:35, 10:35 e 11:35; Hotel Best Tenerife alle 9:40, 10:40 e 11:40; Bar Leonardo alle 9:45, 10:45 e 11:45; Via Llanos de Troya alle 9:50, 10:50 e 11:50; H. Suite Labranda e C.C. Duke Shops (Costa Adeje) alle 10:05, 11:05 e 12:05; Hotel Sunwing Fañabé alle 10:10, 11:10 e 12:10. Ritorno da Aqualand alle 16:30 e alle 17:15.",
        en: "Free Aqualand shuttle: Pasarela shopping centre (Los Cristianos) at 9:30, 10:30 and 11:30; Hotel Sol Arona at 9:35, 10:35 and 11:35; Hotel Best Tenerife at 9:40, 10:40 and 11:40; Bar Leonardo at 9:45, 10:45 and 11:45; Via Llanos de Troya at 9:50, 10:50 and 11:50; H. Suite Labranda and Duke Shops mall (Costa Adeje) at 10:05, 11:05 and 12:05; Hotel Sunwing Fañabé at 10:10, 11:10 and 12:10. Return from Aqualand at 16:30 and 17:15.",
        es: "Lanzadera gratuita a Aqualand: C.C. Pasarela (Los Cristianos) a las 9:30, 10:30 y 11:30; Hotel Sol Arona a las 9:35, 10:35 y 11:35; Hotel Best Tenerife a las 9:40, 10:40 y 11:40; Bar Leonardo a las 9:45, 10:45 y 11:45; Via Llanos de Troya a las 9:50, 10:50 y 11:50; H. Suite Labranda y C.C. Duke Shops (Costa Adeje) a las 10:05, 11:05 y 12:05; Hotel Sunwing Fañabé a las 10:10, 11:10 y 12:10. Regreso desde Aqualand a las 16:30 y a las 17:15.",
        fr: "Navette gratuite Aqualand : centre commercial Pasarela (Los Cristianos) à 9:30, 10:30 et 11:30 ; Hotel Sol Arona à 9:35, 10:35 et 11:35 ; Hotel Best Tenerife à 9:40, 10:40 et 11:40 ; Bar Leonardo à 9:45, 10:45 et 11:45 ; Via Llanos de Troya à 9:50, 10:50 et 11:50 ; H. Suite Labranda et centre commercial Duke Shops (Costa Adeje) à 10:05, 11:05 et 12:05 ; Hotel Sunwing Fañabé à 10:10, 11:10 et 12:10. Retour depuis Aqualand à 16:30 et 17:15.",
        de: "Kostenloser Aqualand-Shuttle: Einkaufszentrum Pasarela (Los Cristianos) um 9:30, 10:30 und 11:30; Hotel Sol Arona um 9:35, 10:35 und 11:35; Hotel Best Tenerife um 9:40, 10:40 und 11:40; Bar Leonardo um 9:45, 10:45 und 11:45; Via Llanos de Troya um 9:50, 10:50 und 11:50; H. Suite Labranda und Einkaufszentrum Duke Shops (Costa Adeje) um 10:05, 11:05 und 12:05; Hotel Sunwing Fañabé um 10:10, 11:10 und 12:10. Rückfahrt ab Aqualand um 16:30 und 17:15." },
      { it: "I posti in navetta si assegnano in ordine di arrivo, senza prenotazione: presentarsi al punto di ritiro con un po' di anticipo.",
        en: "Shuttle seats are given on a first-come, first-served basis, no booking: arrive at the pickup point a little early.",
        es: "Las plazas en la lanzadera se asignan por orden de llegada, sin reserva: preséntese en el punto de recogida con algo de antelación.",
        fr: "Les places dans la navette sont attribuées dans l'ordre d'arrivée, sans réservation : arrivez au point de prise en charge un peu en avance.",
        de: "Die Plätze im Shuttle werden in der Reihenfolge der Ankunft vergeben, ohne Reservierung: Seien Sie etwas früher am Abholpunkt." }
    ],
    family: true,
    desc: {
      it: "Parco acquatico a Costa Adeje con scivoli per tutte le età, spettacolo dei delfini incluso nel biglietto e navetta gratuita da diverse zone del sud dell'isola.",
      en: "Water park in Costa Adeje with slides for every age, a dolphin show included in the ticket and a free shuttle from several areas in the south of the island.",
      es: "Parque acuático en Costa Adeje con toboganes para todas las edades, espectáculo de delfines incluido en la entrada y lanzadera gratuita desde varias zonas del sur de la isla.",
      fr: "Parc aquatique à Costa Adeje avec des toboggans pour tous les âges, un spectacle de dauphins compris dans le billet et une navette gratuite depuis plusieurs zones du sud de l'île.",
      de: "Wasserpark in Costa Adeje mit Rutschen für jedes Alter, einer Delfinshow im Ticket und einem kostenlosen Shuttle aus mehreren Orten im Süden der Insel."
    },
    image: "aqualand.webp",
    published: true
  },
  {
    id: "jungle-park",
    title: "Jungle Park",
    category: "parchi-spettacoli",
    // Il ticket conta sempre come pagato con carta, come gli altri parchi
    // (proprietario, 20 ottobre 2026): stesso elenco in sempre_card.
    pagamento: "card",
    zone: "Chayofa (Arona)",
    duration: { it: "Giornata intera", en: "Full day", es: "Día completo", fr: "Journée entière", de: "Ganztags" },
    zoneGroups: ["los-cristianos"],
    durationGroups: ["intera"],
    priceFrom: 35,
    priceAdult: 35,
    priceChild: 29,
    priceInfant: 16,
    ages: { adult: "12+", child: "4-11", infant: "0-3" },
    included: ["transfer"],
    notes: [
      { it: "Aperto tutti i giorni, 10:00-17:30. Spettacolo dei leoni marini alle 13:30, spettacolo dei rapaci alle 12:30: entrambi inclusi nel biglietto.",
        en: "Open every day, 10am-5:30pm. Sea lion show at 1:30pm, birds of prey show at 12:30pm: both included in the ticket.",
        es: "Abierto todos los días, 10:00-17:30. Espectáculo de leones marinos a las 13:30, espectáculo de aves rapaces a las 12:30: ambos incluidos en la entrada.",
        fr: "Ouvert tous les jours, 10:00-17:30. Spectacle d'otaries à 13:30, spectacle de rapaces à 12:30 : tous deux compris dans le billet.",
        de: "Täglich geöffnet, 10:00-17:30. Seelöwenshow um 13:30, Greifvogelshow um 12:30: beide im Ticket inbegriffen." },
      { it: "Navetta gratuita Jungle Park: Aqualand Costa Adeje alle 9:30 e 10:45; H. Suite Labranda Costa Adeje alle 9:35 e 10:50; C.C. Duke Shops alle 9:35 e 10:55; Hotel Sunwing Fañabé alle 9:40 e 11:00; Hotel Allsun Hibiscos alle 9:45 e 11:05; Calle Llanos de Troya alle 9:50 e 11:35; Bar Leonardo alle 9:55 e 11:40; Hotel Best Tenerife alle 10:00 e 11:45; C.C. Pasarela \"La Pepa\" (Los Cristianos) alle 10:10 e 11:50; Hotel Sol Arona alle 10:15 e 11:55. Ritorno da Jungle Park alle 16:30 e alle 17:30.",
        en: "Free Jungle Park shuttle: Aqualand Costa Adeje at 9:30 and 10:45; H. Suite Labranda Costa Adeje at 9:35 and 10:50; Duke Shops mall at 9:35 and 10:55; Hotel Sunwing Fañabé at 9:40 and 11:00; Hotel Allsun Hibiscos at 9:45 and 11:05; Calle Llanos de Troya at 9:50 and 11:35; Bar Leonardo at 9:55 and 11:40; Hotel Best Tenerife at 10:00 and 11:45; Pasarela \"La Pepa\" shopping centre (Los Cristianos) at 10:10 and 11:50; Hotel Sol Arona at 10:15 and 11:55. Return from Jungle Park at 16:30 and 17:30.",
        es: "Lanzadera gratuita a Jungle Park: Aqualand Costa Adeje a las 9:30 y 10:45; H. Suite Labranda Costa Adeje a las 9:35 y 10:50; C.C. Duke Shops a las 9:35 y 10:55; Hotel Sunwing Fañabé a las 9:40 y 11:00; Hotel Allsun Hibiscos a las 9:45 y 11:05; Calle Llanos de Troya a las 9:50 y 11:35; Bar Leonardo a las 9:55 y 11:40; Hotel Best Tenerife a las 10:00 y 11:45; C.C. Pasarela \"La Pepa\" (Los Cristianos) a las 10:10 y 11:50; Hotel Sol Arona a las 10:15 y 11:55. Regreso desde Jungle Park a las 16:30 y a las 17:30.",
        fr: "Navette gratuite Jungle Park : Aqualand Costa Adeje à 9:30 et 10:45 ; H. Suite Labranda Costa Adeje à 9:35 et 10:50 ; centre commercial Duke Shops à 9:35 et 10:55 ; Hotel Sunwing Fañabé à 9:40 et 11:00 ; Hotel Allsun Hibiscos à 9:45 et 11:05 ; Calle Llanos de Troya à 9:50 et 11:35 ; Bar Leonardo à 9:55 et 11:40 ; Hotel Best Tenerife à 10:00 et 11:45 ; centre commercial Pasarela « La Pepa » (Los Cristianos) à 10:10 et 11:50 ; Hotel Sol Arona à 10:15 et 11:55. Retour depuis Jungle Park à 16:30 et 17:30.",
        de: "Kostenloser Jungle-Park-Shuttle: Aqualand Costa Adeje um 9:30 und 10:45; H. Suite Labranda Costa Adeje um 9:35 und 10:50; Einkaufszentrum Duke Shops um 9:35 und 10:55; Hotel Sunwing Fañabé um 9:40 und 11:00; Hotel Allsun Hibiscos um 9:45 und 11:05; Calle Llanos de Troya um 9:50 und 11:35; Bar Leonardo um 9:55 und 11:40; Hotel Best Tenerife um 10:00 und 11:45; Einkaufszentrum Pasarela „La Pepa“ (Los Cristianos) um 10:10 und 11:50; Hotel Sol Arona um 10:15 und 11:55. Rückfahrt ab Jungle Park um 16:30 und 17:30." },
      { it: "I posti in navetta si assegnano in ordine di arrivo, senza prenotazione: presentarsi al punto di ritiro con un po' di anticipo.",
        en: "Shuttle seats are given on a first-come, first-served basis, no booking: arrive at the pickup point a little early.",
        es: "Las plazas en la lanzadera se asignan por orden de llegada, sin reserva: preséntese en el punto de recogida con algo de antelación.",
        fr: "Les places dans la navette sont attribuées dans l'ordre d'arrivée, sans réservation : arrivez au point de prise en charge un peu en avance.",
        de: "Die Plätze im Shuttle werden in der Reihenfolge der Ankunft vergeben, ohne Reservierung: Seien Sie etwas früher am Abholpunkt." }
    ],
    family: true,
    desc: {
      it: "Parco naturale a Chayofa fra zoo e giardino botanico, con animali esotici e rapaci in volo libero, spettacoli inclusi nel biglietto e navetta gratuita da diverse zone del sud dell'isola.",
      en: "Nature park in Chayofa, part zoo and part botanical garden, with exotic animals and free-flying birds of prey, shows included in the ticket and a free shuttle from several areas in the south of the island.",
      es: "Parque natural en Chayofa a medio camino entre zoo y jardín botánico, con animales exóticos y aves rapaces en vuelo libre, espectáculos incluidos en la entrada y lanzadera gratuita desde varias zonas del sur de la isla.",
      fr: "Parc naturel à Chayofa, mi-zoo mi-jardin botanique, avec des animaux exotiques et des rapaces en vol libre, des spectacles compris dans le billet et une navette gratuite depuis plusieurs zones du sud de l'île.",
      de: "Naturpark in Chayofa, halb Zoo, halb botanischer Garten, mit exotischen Tieren und frei fliegenden Greifvögeln, Shows im Ticket und einem kostenlosen Shuttle aus mehreren Orten im Süden der Insel."
    },
    image: "jungle-park.webp",
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
      es: "2 días, 1 por parque (no necesariamente consecutivos)",
      fr: "2 jours, 1 par parc (pas forcément consécutifs)",
      de: "2 Tage, 1 pro Park (nicht unbedingt aufeinanderfolgend)"
    },
    zoneGroups: ["costa-adeje", "los-cristianos"],
    durationGroups: ["intera"],
    priceFrom: 51,
    priceAdult: 51,
    priceChild: 42,
    priceInfant: 21,
    ages: { adult: "12+", child: "4-11", infant: "0-3" },
    included: ["transfer"],
    notes: [
      { it: "Aqualand 10:00-17:00, Jungle Park 10:00-17:30.",
        en: "Aqualand 10am-5pm, Jungle Park 10am-5:30pm.",
        es: "Aqualand 10:00-17:00, Jungle Park 10:00-17:30.",
        fr: "Aqualand 10:00-17:00, Jungle Park 10:00-17:30.",
        de: "Aqualand 10:00-17:00, Jungle Park 10:00-17:30." },
      { it: "Navetta per Aqualand: da Los Cristianos (C.C. Pasarela) alle 9:30, 10:30 e 11:30; da Playa de las Américas (Hotel Sol Arona) alle 9:35, 10:35 e 11:35 e (Hotel Best Tenerife / Bar Leonardo's) alle 9:40, 10:40 e 11:40; da Costa Adeje (H. Labranda Suites / The Duke Shops) alle 10:05, 11:05 e 12:05 e (Hotel Sunwing Fañabé) alle 10:10, 11:10 e 12:10. Ritorno da Aqualand alle 16:30 e alle 17:15.",
        en: "Shuttle to Aqualand: from Los Cristianos (Pasarela shopping centre) at 9:30, 10:30 and 11:30; from Playa de las Américas (Hotel Sol Arona) at 9:35, 10:35 and 11:35 and (Hotel Best Tenerife / Bar Leonardo's) at 9:40, 10:40 and 11:40; from Costa Adeje (H. Labranda Suites / The Duke Shops) at 10:05, 11:05 and 12:05 and (Hotel Sunwing Fañabé) at 10:10, 11:10 and 12:10. Return from Aqualand at 16:30 and 17:15.",
        es: "Lanzadera a Aqualand: desde Los Cristianos (C.C. Pasarela) a las 9:30, 10:30 y 11:30; desde Playa de las Américas (Hotel Sol Arona) a las 9:35, 10:35 y 11:35 y (Hotel Best Tenerife / Bar Leonardo's) a las 9:40, 10:40 y 11:40; desde Costa Adeje (H. Labranda Suites / The Duke Shops) a las 10:05, 11:05 y 12:05 y (Hotel Sunwing Fañabé) a las 10:10, 11:10 y 12:10. Regreso desde Aqualand a las 16:30 y a las 17:15.",
        fr: "Navette pour Aqualand : depuis Los Cristianos (centre commercial Pasarela) à 9:30, 10:30 et 11:30 ; depuis Playa de las Américas (Hotel Sol Arona) à 9:35, 10:35 et 11:35 et (Hotel Best Tenerife / Bar Leonardo's) à 9:40, 10:40 et 11:40 ; depuis Costa Adeje (H. Labranda Suites / The Duke Shops) à 10:05, 11:05 et 12:05 et (Hotel Sunwing Fañabé) à 10:10, 11:10 et 12:10. Retour depuis Aqualand à 16:30 et 17:15.",
        de: "Shuttle zum Aqualand: ab Los Cristianos (Einkaufszentrum Pasarela) um 9:30, 10:30 und 11:30; ab Playa de las Américas (Hotel Sol Arona) um 9:35, 10:35 und 11:35 und (Hotel Best Tenerife / Bar Leonardo's) um 9:40, 10:40 und 11:40; ab Costa Adeje (H. Labranda Suites / The Duke Shops) um 10:05, 11:05 und 12:05 und (Hotel Sunwing Fañabé) um 10:10, 11:10 und 12:10. Rückfahrt ab Aqualand um 16:30 und 17:15." },
      { it: "Navetta per Jungle Park: collegamento diretto da Aqualand Costa Adeje alle 9:30 e alle 10:45, oppure dagli stessi punti di ritiro di Aqualand con orario leggermente anticipato. Ritorno da Jungle Park alle 16:30 e alle 17:30.",
        en: "Shuttle to Jungle Park: direct connection from Aqualand Costa Adeje at 9:30 and 10:45, or from the same Aqualand pickup points a little earlier. Return from Jungle Park at 16:30 and 17:30.",
        es: "Lanzadera a Jungle Park: conexión directa desde Aqualand Costa Adeje a las 9:30 y a las 10:45, o desde los mismos puntos de recogida de Aqualand con horario ligeramente anticipado. Regreso desde Jungle Park a las 16:30 y a las 17:30.",
        fr: "Navette pour Jungle Park : liaison directe depuis Aqualand Costa Adeje à 9:30 et 10:45, ou depuis les mêmes points de prise en charge d'Aqualand un peu plus tôt. Retour depuis Jungle Park à 16:30 et 17:30.",
        de: "Shuttle zum Jungle Park: direkte Verbindung ab Aqualand Costa Adeje um 9:30 und 10:45, oder etwas früher ab denselben Abholpunkten des Aqualand. Rückfahrt ab Jungle Park um 16:30 und 17:30." },
      { it: "I posti in navetta si assegnano in ordine di arrivo: presentarsi al punto di ritiro almeno 15 minuti prima dell'orario.",
        en: "Shuttle seats are given on a first-come, first-served basis: arrive at the pickup point at least 15 minutes before the scheduled time.",
        es: "Las plazas en la lanzadera se asignan por orden de llegada: preséntese en el punto de recogida al menos 15 minutos antes de la hora prevista.",
        fr: "Les places dans la navette sont attribuées dans l'ordre d'arrivée : arrivez au point de prise en charge au moins 15 minutes avant l'heure prévue.",
        de: "Die Plätze im Shuttle werden in der Reihenfolge der Ankunft vergeben: Seien Sie mindestens 15 Minuten vor der geplanten Zeit am Abholpunkt." }
    ],
    family: true,
    desc: {
      it: "Biglietto combinato per i due parchi del sud: un giorno all'Aqualand e uno al Jungle Park, con navetta gratuita da diverse zone del sud dell'isola.",
      en: "Combined ticket for the two parks in the south: one day at Aqualand and one at Jungle Park, with a free shuttle from several areas in the south of the island.",
      es: "Entrada combinada para los dos parques del sur: un día en Aqualand y otro en Jungle Park, con lanzadera gratuita desde varias zonas del sur de la isla.",
      fr: "Billet combiné pour les deux parcs du sud : une journée à Aqualand et une au Jungle Park, avec une navette gratuite depuis plusieurs zones du sud de l'île.",
      de: "Kombiticket für die zwei Parks im Süden: ein Tag im Aqualand und einer im Jungle Park, mit kostenlosem Shuttle aus mehreren Orten im Süden der Insel."
    },
    image: "combo-jungle-aqualand.webp",
    published: true
  },
  {
    id: "monkey-park",
    title: "Monkey Park",
    category: "parchi-spettacoli",
    zone: { it: "Vicino a Los Cristianos", en: "Near Los Cristianos", es: "Cerca de Los Cristianos", fr: "Près de Los Cristianos", de: "Bei Los Cristianos" },
    // Orario di apertura al posto di "Da definire", come su Siam Park e Loro
    // Parque. Aperto tutti i giorni, quindi niente `days`.
    duration: { it: "09:30-16:00", en: "9:30am-4pm", es: "09:30-16:00", fr: "9:30-16:00", de: "9:30-16:00" },
    zoneGroups: ["los-cristianos"],
    durationGroups: ["breve"],
    priceFrom: 10,
    priceAdult: 10,
    priceChild: 5,
    // Il parco scrive due tariffe sole e dice che quella bambini vale "hasta
    // los 12 años": da li' il 13+ degli adulti. **Non dice niente sui piu'
    // piccoli**, quindi niente `priceInfant` e nessuna fascia neonati — la
    // fascia bambini parte da 0 perche' e' quello che dice il listino, non
    // perche' sappiamo che i neonati pagano. Da chiedere.
    ages: { adult: "13+", child: "0-12" },
    family: true,
    desc: {
      it: "Piccolo zoo dove si entra nei recinti per vedere da vicino e dare da mangiare agli animali: lemuri, scimmiette, iguane, tartarughe e pappagalli, e qualche specie a rischio come il coccodrillo cubano.",
      en: "A small zoo where you go inside the enclosures to get close to the animals and feed them: lemurs, squirrel monkeys, iguanas, tortoises and parrots, plus a few endangered species such as the Cuban crocodile.",
      es: "Pequeño zoo donde se entra en los recintos para ver de cerca y dar de comer a los animales: lémures, monos ardilla, iguanas, tortugas y papagayos, y alguna especie amenazada como el cocodrilo cubano.",
      fr: "Un petit zoo où l'on entre dans les enclos pour s'approcher des animaux et les nourrir : lémuriens, singes-écureuils, iguanes, tortues et perroquets, plus quelques espèces menacées comme le crocodile de Cuba.",
      de: "Ein kleiner Zoo, in dem man in die Gehege geht, um den Tieren nahe zu kommen und sie zu füttern: Lemuren, Totenkopfaffen, Leguane, Schildkröten und Papageien, dazu ein paar bedrohte Arten wie das Kubakrokodil."
    },
    notes: [
      { it: "A circa 5 minuti da Los Cristianos e 10 da Playa de las Américas. Aperto tutti i giorni.",
        en: "About 5 minutes from Los Cristianos and 10 from Playa de las Américas. Open every day.",
        es: "A unos 5 minutos de Los Cristianos y 10 de Playa de las Américas. Abierto todos los días.",
        fr: "À environ 5 minutes de Los Cristianos et 10 de Playa de las Américas. Ouvert tous les jours.",
        de: "Etwa 5 Minuten von Los Cristianos und 10 von Playa de las Américas. Täglich geöffnet." }
    ],
    image: "monkey-park.webp",
    published: true
  },
  {
    id: "mht-drag-show",
    title: "MHT – Music Hall Tavern Drag Show & Dinner",
    category: "parchi-spettacoli",
    zone: "Playa de las Américas",
    // 19:30 (prima alzata di sipario) - 23:00 (sipario finale).
    duration: { it: "3 ore e 30", en: "3.5 hours", es: "3 horas y media", fr: "3 heures et demie", de: "3,5 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["mezza"],
    priceFrom: 49,
    priceAdult: 49,
    priceChild: 39,
    // Qui `0` vuol dire gratis davvero: il sito dell'operatore scrive che sotto
    // i 4 anni non serve il biglietto. Vanno pero' dichiarati lo stesso, per i
    // posti a sedere: sta scritto nelle note.
    priceInfant: 0,
    // Fasce scritte per esteso dall'operatore: "Adult tickets are for guests
    // aged 13 and over, child tickets are for ages 4 to 12, and infants up to
    // 3 years old do not need a ticket."
    ages: { adult: "13+", child: "4-12", infant: "0-3" },
    // L'operatore vende un biglietto bambini dai 4 anni e fa posto ai neonati:
    // i bambini ci vanno. Nessun limite d'eta' scritto da nessuna parte, al
    // contrario di Scandal che dice "16+" a chiare lettere.
    family: true,
    // Dal calendario dell'operatore, che elenca le date una per una: lunedi',
    // martedi', giovedi' e venerdi' (**mar** e' martedi'), tutte le settimane.
    // Torna con le "four shows a week" scritte nella pagina.
    days: ["lun", "mar", "gio", "ven"],
    times: ["19:30"],
    // Cena di tre portate e foto ricordo, tutte e due comprese. Le bevande
    // **no**: la pagina parla di un "drinks menu", cioe' un bar dove si paga.
    included: ["lunch", "photos"],
    menus: [
      { it: "Vegetariano", en: "Vegetarian", es: "Vegetariano", fr: "Végétarien", de: "Vegetarisch" },
      { it: "Vegano", en: "Vegan", es: "Vegano", fr: "Végan", de: "Vegan" },
      { it: "Menu bambini (pizza)", en: "Children's menu (pizza)", es: "Menú infantil (pizza)", fr: "Menu enfant (pizza)", de: "Kindermenü (Pizza)" }
    ],
    desc: {
      it: "Cena e spettacolo drag al Music Hall Tavern: commedia, musica dal vivo e una cena di tre portate servita mentre lo spettacolo va avanti.",
      en: "Dinner and drag show at the Music Hall Tavern: comedy, live music and a three-course dinner served while the show goes on.",
      es: "Cena y espectáculo drag en el Music Hall Tavern: comedia, música en directo y una cena de tres platos servida mientras el espectáculo continúa.",
      fr: "Dîner et spectacle drag au Music Hall Tavern : comédie, musique live et un dîner de trois plats servi pendant le spectacle.",
      de: "Dinner und Dragshow in der Music Hall Tavern: Comedy, Livemusik und ein Drei-Gänge-Menü, das während der Show serviert wird."
    },
    notes: [
      { it: "Le porte aprono alle 19:00, si comincia alle 19:30 e si finisce alle 23:00. La cena arriva alle 19:45, lo spettacolo vero comincia alle 20:45 e c'è un intervallo verso le 22:00.",
        en: "Doors open at 19:00, it starts at 19:30 and ends at 23:00. Dinner is served at 19:45, the main show starts at 20:45 and there is an interval at around 22:00.",
        es: "Las puertas abren a las 19:00, empieza a las 19:30 y termina a las 23:00. La cena se sirve a las 19:45, el espectáculo principal empieza a las 20:45 y hay un intervalo sobre las 22:00.",
        fr: "Les portes ouvrent à 19:00, cela commence à 19:30 et se termine à 23:00. Le dîner est servi à 19:45, le spectacle principal commence à 20:45 et il y a un entracte vers 22:00.",
        de: "Einlass um 19:00, Beginn um 19:30, Ende um 23:00. Das Essen wird um 19:45 serviert, die Hauptshow beginnt um 20:45, und gegen 22:00 gibt es eine Pause." },
      { it: "I bambini sotto i 4 anni non pagano, ma vanno segnalati lo stesso nella richiesta: servono a chi prepara i posti a sedere.",
        en: "Children under 4 don't pay, but still need to be mentioned in the request: whoever arranges the seating needs to know.",
        es: "Los menores de 4 años no pagan, pero hay que indicarlos igualmente en la solicitud: quien prepara los asientos necesita saberlo.",
        fr: "Les enfants de moins de 4 ans ne paient pas, mais il faut quand même les indiquer dans la demande : ceux qui organisent le placement doivent le savoir.",
        de: "Kinder unter 4 zahlen nicht, müssen aber trotzdem in der Anfrage stehen: Wer die Plätze einteilt, muss es wissen." },
      { it: "La cena si può avere vegetariana o vegana, e per i bambini c'è un menu con la pizza: si sceglie nella richiesta. Qualsiasi allergia o intolleranza va segnalata lì, così la cucina la sa in anticipo.",
        en: "Dinner can be vegetarian or vegan, and there is a children's menu with pizza: you choose in the request. Any allergy or intolerance should be flagged there, so the kitchen knows in advance.",
        es: "La cena puede ser vegetariana o vegana, y para los niños hay un menú con pizza: se elige en la solicitud. Cualquier alergia o intolerancia hay que indicarla ahí, para que la cocina lo sepa con antelación.",
        fr: "Le dîner peut être végétarien ou végan, et il y a un menu enfant avec pizza : vous choisissez dans la demande. Toute allergie ou intolérance doit être signalée là, pour que la cuisine la connaisse à l'avance.",
        de: "Das Essen kann vegetarisch oder vegan sein, und es gibt ein Kindermenü mit Pizza: Sie wählen in der Anfrage. Allergien oder Unverträglichkeiten bitte dort angeben, damit die Küche sie vorher kennt." },
      { it: "Si tiene al Vivo Show Bar, in Avenida Rafael Puig Lluvina 7, a due passi dal centro di Playa de las Américas. L'operatore non offre nessun servizio di trasporto: ci si arriva a piedi o in taxi.",
        en: "Held at the Vivo Show Bar, Avenida Rafael Puig Lluvina 7, a short walk from the centre of Playa de las Américas. The operator offers no transport service: you get there on foot or by taxi.",
        es: "Se celebra en el Vivo Show Bar, Avenida Rafael Puig Lluvina 7, a dos pasos del centro de Playa de las Américas. El operador no ofrece ningún servicio de transporte: se llega a pie o en taxi.",
        fr: "Ça se passe au Vivo Show Bar, Avenida Rafael Puig Lluvina 7, à quelques pas du centre de Playa de las Américas. L'opérateur ne propose pas de transport : on y va à pied ou en taxi.",
        de: "Im Vivo Show Bar, Avenida Rafael Puig Lluvina 7, ein paar Schritte vom Zentrum von Playa de las Américas. Der Anbieter bietet keinen Transport an: Man kommt zu Fuß oder mit dem Taxi." }
    ],
    image: "mht-drag-show.webp",
    // dove ci si presenta: era gia' scritto nei consigli (15 ottobre 2026)
    ritrovo: "Vivo Show Bar, Avenida Rafael Puig Lluvina 7, Playa de las Américas",
    published: true
  },
  {
    id: "castillo-san-miguel",
    title: "Castillo San Miguel – Medieval Night",
    // Il ticket conta sempre come pagato con carta (proprietario, 21 ottobre
    // 2026): stessa regola dei parchi, e stesso elenco in sempre_card.
    pagamento: "card",
    category: "parchi-spettacoli",
    zone: "San Miguel de Abona",
    duration: { it: "2 ore e 30", en: "2.5 hours", es: "2 horas y media", fr: "2 heures et demie", de: "2,5 Stunden" },
    zoneGroups: ["los-cristianos"],
    durationGroups: ["mezza"],
    priceFrom: 52,
    priceAdult: 52,
    priceChild: 31,
    // Il neonato non paga lo spettacolo: paga solo il posto sul bus (11 €,
    // `transferPrice.baby`). Proprietario, 19 ottobre 2026.
    priceInfant: 0,
    ages: { adult: "14+", child: "3-13", infant: "0-2" },
    family: true,
    days: ["mar", "gio", "sab"],
    times: ["19:00"],
    included: ["lunch", "drinks"],
    // Il menu bambini qui resta senza piatto: su MHT e' la pizza, al castello
    // no — chiesto e confermato dal proprietario, non e' un dato mancante.
    menus: [
      { it: "Vegetariano", en: "Vegetarian", es: "Vegetariano", fr: "Végétarien", de: "Vegetarisch" },
      { it: "Vegano", en: "Vegan", es: "Vegano", fr: "Végan", de: "Vegan" },
      { it: "Menu bambini", en: "Children's menu", es: "Menú infantil", fr: "Menu enfant", de: "Kindermenü" }
    ],
    // I due tipi di biglietto del modulo di prenotazione del fornitore. Il
    // normale ripete il prezzo della scheda: cosi' il cliente che sceglie
    // "VIP" vede cambiare il totale, invece di dover indovinare.
    options: {
      label: { it: "Tipo di biglietto", en: "Ticket type", es: "Tipo de entrada", fr: "Type de billet", de: "Ticketart" },
      choices: [
        {
          label: { it: "Ingresso normale", en: "Standard entry", es: "Entrada normal", fr: "Entrée standard", de: "Standard-Eintritt" },
          priceAdult: 52,
          priceChild: 31,
          desc: {
            it: "Spettacolo, cena di tre portate e bevande incluse.",
            en: "Show, three-course dinner and drinks included.",
            es: "Espectáculo, cena de tres platos y bebidas incluidas.",
            fr: "Spectacle, dîner de trois plats et boissons compris.",
            de: "Show, Drei-Gänge-Menü und Getränke inklusive."
          }
        },
        {
          label: { it: "Ingresso VIP", en: "VIP entry", es: "Entrada VIP", fr: "Entrée VIP", de: "VIP-Eintritt" },
          priceAdult: 63,
          priceChild: 37,
          desc: {
            it: "Tutto quello dell'ingresso normale, più ingresso prioritario, un bicchiere di cava di benvenuto e posti nelle file migliori.",
            en: "Everything in the standard entry, plus priority entry, a glass of welcome cava and seats in the best rows.",
            es: "Todo lo de la entrada normal, más entrada prioritaria, una copa de cava de bienvenida y asientos en las mejores filas.",
            fr: "Tout ce qu'il y a dans l'entrée standard, plus l'entrée prioritaire, une coupe de cava de bienvenue et des places dans les meilleurs rangs.",
            de: "Alles aus dem Standard-Eintritt, dazu bevorzugter Einlass, ein Glas Cava zur Begrüßung und Plätze in den besten Reihen."
          }
        }
      ]
    },
    transfer: {
      it: "Ritiro dal tuo hotel nel sud di Tenerife, a pagamento: basta indicare l'hotel nella richiesta.",
      en: "Pickup from your hotel in the south of Tenerife, at extra cost: just give the hotel in the request.",
      es: "Recogida en tu hotel en el sur de Tenerife, con suplemento: basta con indicar el hotel en la solicitud.",
      fr: "Prise en charge à votre hôtel dans le sud de Tenerife, en supplément : il suffit d'indiquer l'hôtel dans la demande.",
      de: "Abholung an Ihrem Hotel im Süden Teneriffas, gegen Aufpreis: einfach das Hotel in der Anfrage angeben."
    },
    // Col bus 68 / 42 / 11 (VIP 79 / 48 / 11): +16 adulto e +11 bambino su
    // tutti e due i biglietti, e il VIP lo rifa' conVariante() in tour.js.
    transferPrice: { adult: 68, child: 42, baby: 11 },
    desc: {
      it: "Serata medievale al castello: cavalieri, cavalli e torneo, con cena servita durante lo spettacolo.",
      en: "A medieval night at the castle: knights, horses and a tournament, with dinner served during the show.",
      es: "Noche medieval en el castillo: caballeros, caballos y torneo, con cena servida durante el espectáculo.",
      fr: "Une nuit médiévale au château : chevaliers, chevaux et tournoi, avec le dîner servi pendant le spectacle.",
      de: "Eine mittelalterliche Nacht im Schloss: Ritter, Pferde und Turnier, mit dem Essen während der Show."
    },
    notes: [
      { it: "A circa 20 minuti da Costa Adeje e da Playa de las Américas. Apertura porte alle 18:30. Parcheggio gratuito in loco.",
        en: "About 20 minutes from Costa Adeje and Playa de las Américas. Doors open at 18:30. Free on-site parking.",
        es: "A unos 20 minutos de Costa Adeje y de Playa de las Américas. Apertura de puertas a las 18:30. Aparcamiento gratuito en el recinto.",
        fr: "À environ 20 minutes de Costa Adeje et de Playa de las Américas. Les portes ouvrent à 18:30. Parking gratuit sur place.",
        de: "Etwa 20 Minuten von Costa Adeje und Playa de las Américas. Einlass um 18:30. Kostenlose Parkplätze vor Ort." },
      { it: "La cena è di tre portate: zuppa di verdure, filetto di pollo in salsa di funghi e torta gelato. Vino, succo e acqua compresi.",
        en: "Dinner is three courses: vegetable soup, chicken fillet in mushroom sauce and ice cream cake. Wine, juice and water included.",
        es: "La cena es de tres platos: sopa de verduras, filete de pollo en salsa de setas y tarta helada. Vino, zumo y agua incluidos.",
        fr: "Le dîner a trois plats : soupe de légumes, filet de poulet sauce aux champignons et gâteau glacé. Vin, jus et eau compris.",
        de: "Das Essen hat drei Gänge: Gemüsesuppe, Hähnchenfilet in Pilzsauce und Eistorte. Wein, Saft und Wasser inklusive." },
      { it: "La cena si può avere vegetariana o vegana, e per i bambini c'è un menu apposta: si sceglie nella richiesta. Qualsiasi allergia o intolleranza va segnalata lì, così la cucina la sa in anticipo.",
        en: "Dinner can be vegetarian or vegan, and there is a dedicated children's menu: you choose in the request. Any allergy or intolerance should be flagged there, so the kitchen knows in advance.",
        es: "La cena puede ser vegetariana o vegana, y para los niños hay un menú aparte: se elige en la solicitud. Cualquier alergia o intolerancia hay que indicarla ahí, para que la cocina lo sepa con antelación.",
        fr: "Le dîner peut être végétarien ou végan, et il y a un menu enfant dédié : vous choisissez dans la demande. Toute allergie ou intolérance doit être signalée là, pour que la cuisine la connaisse à l'avance.",
        de: "Das Essen kann vegetarisch oder vegan sein, und es gibt ein eigenes Kindermenü: Sie wählen in der Anfrage. Allergien oder Unverträglichkeiten bitte dort angeben, damit die Küche sie vorher kennt." },
      { it: "Lo spettacolo è in inglese: otto cavalieri a cavallo, giostre e duelli di spada.",
        en: "The show is in English: eight knights on horseback, jousting and sword duels.",
        es: "El espectáculo es en inglés: ocho caballeros a caballo, justas y duelos de espada.",
        fr: "Le spectacle est en anglais : huit chevaliers à cheval, joutes et duels à l'épée.",
        de: "Die Show ist auf Englisch: acht Ritter zu Pferd, Lanzenstechen und Schwertkämpfe." }
    ],
    image: "castillo-san-miguel.webp",
    published: true
  },
  {
    id: "flamenco-show",
    title: "¡Olé! Flamenco Show",
    category: "parchi-spettacoli",
    zone: "Costa Adeje",
    // Lo spettacolo vero dura 90 minuti (21:00-22:30, intervallo di 15 minuti
    // compreso): il "≈ 2h" dell'intestazione del fornitore conta dall'apertura
    // delle porte, non dall'inizio.
    duration: { it: "1 ora e 30", en: "1.5 hours", es: "1 hora y media", fr: "1 heure et demie", de: "1,5 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["breve"],
    priceFrom: 51,
    priceAdult: 51,
    priceChild: 25.50,
    // "3-12 anni" e' scritto dal fornitore accanto al prezzo bambini. La fascia
    // adulti non la scrive: 13+ e' l'unico completamento possibile di 3-12.
    // Niente fascia neonati e niente priceInfant: sotto i 3 anni non si entra,
    // che non e' "gratis" (vedi la descrizione).
    ages: { adult: "13+", child: "3-12" },
    family: true,
    days: ["gio"],
    // 20:15 e' l'apertura delle porte, non l'inizio: lo spettacolo comincia
    // alle 21:00. L'intestazione del fornitore ("ogni giovedi' alle 20:15")
    // dava l'una per l'altro, il corpo della pagina lo chiarisce.
    times: ["21:00"],
    // I due prezzi del **modulo di prenotazione** (51 e 61), non i 49 e 59 che
    // il corpo della pagina continua a citare: quello che il cliente paga
    // davvero e' il modulo. Cosi' torna anche il "da 51 €" dell'intestazione,
    // che sembrava incoerente coi prezzi vecchi.
    options: {
      label: { it: "Categoria posto", en: "Seating category", es: "Categoría de asiento", fr: "Catégorie de places", de: "Platzkategorie" },
      choices: [
        {
          label: { it: "Gold", en: "Gold", es: "Gold", fr: "Gold", de: "Gold" },
          priceAdult: 51,
          priceChild: 25.50,
          desc: {
            it: "140 posti, buona vista sul palco.",
            en: "140 seats, good view of the stage.",
            es: "140 asientos, buena vista del escenario.",
            fr: "140 places, bonne vue sur la scène.",
            de: "140 Plätze, gute Sicht auf die Bühne."
          }
        },
        {
          label: { it: "Platinum", en: "Platinum", es: "Platinum", fr: "Platinum", de: "Platinum" },
          priceAdult: 61,
          priceChild: 30.50,
          included: ["drinks", "snack"],
          desc: {
            it: "80 posti vicino al palco; include un bicchiere di vino e snack leggeri.",
            en: "80 seats near the stage; includes a glass of wine and light snacks.",
            es: "80 asientos cerca del escenario; incluye una copa de vino y snacks ligeros.",
            fr: "80 places près de la scène ; comprend un verre de vin et quelques amuse-bouches.",
            de: "80 Plätze nahe der Bühne; mit einem Glas Wein und kleinen Snacks."
          }
        }
      ]
    },
    desc: {
      it: "Spettacolo di flamenco dal vivo, con cante, chitarra e ballo. Sotto i 3 anni non si entra.",
      en: "A live flamenco show, with singing, guitar and dance. Under 3s are not admitted.",
      es: "Espectáculo de flamenco en directo, con cante, guitarra y baile. Menores de 3 años no entran.",
      fr: "Un spectacle de flamenco en direct, avec chant, guitare et danse. Les moins de 3 ans ne sont pas admis.",
      de: "Eine Live-Flamenco-Show mit Gesang, Gitarre und Tanz. Kinder unter 3 sind nicht zugelassen."
    },
    notes: [
      { it: "Apertura porte alle 20:15, lo spettacolo comincia alle 21:00 e finisce alle 22:30, con un intervallo di 15 minuti.",
        en: "Doors open at 20:15, the show starts at 21:00 and ends at 22:30, with a 15-minute interval.",
        es: "Apertura de puertas a las 20:15, el espectáculo empieza a las 21:00 y termina a las 22:30, con un intervalo de 15 minutos.",
        fr: "Les portes ouvrent à 20:15, le spectacle commence à 21:00 et se termine à 22:30, avec un entracte de 15 minutes.",
        de: "Einlass um 20:15, die Show beginnt um 21:00 und endet um 22:30, mit 15 Minuten Pause." },
      { it: "Si tiene nella sala Las Olas dell'hotel GF Victoria: si entra dalla porta sul lato sinistro dell'ingresso principale dell'hotel.",
        en: "Held in the Las Olas showroom of the GF Victoria hotel: use the door on the left-hand side of the hotel's main entrance.",
        es: "Se celebra en la sala Las Olas del hotel GF Victoria: se entra por la puerta del lado izquierdo de la entrada principal del hotel.",
        fr: "Ça se passe dans la salle Las Olas de l'hôtel GF Victoria : prenez la porte à gauche de l'entrée principale de l'hôtel.",
        de: "Im Saal Las Olas des Hotels GF Victoria: Nehmen Sie die Tür links vom Haupteingang des Hotels." },
      { it: "Dress code smart casual (jeans ok): niente abbigliamento sportivo o pantaloncini.",
        en: "Smart casual dress code (jeans OK): no sportswear or shorts.",
        es: "Código de vestimenta smart casual (vaqueros permitidos): nada de ropa deportiva ni pantalones cortos.",
        fr: "Tenue smart casual (jean accepté) : pas de tenue de sport ni de short.",
        de: "Dresscode smart casual (Jeans in Ordnung): keine Sportkleidung, keine kurzen Hosen." },
      { it: "Parcheggio al CC Plaza del Duque, a pochi passi dall'ingresso.",
        en: "Parking at CC Plaza del Duque, a short walk from the entrance.",
        es: "Aparcamiento en el CC Plaza del Duque, a pocos pasos de la entrada.",
        fr: "Parking au CC Plaza del Duque, à quelques pas de l'entrée.",
        de: "Parken im CC Plaza del Duque, ein paar Schritte vom Eingang." }
    ],
    image: "flamenco-show.webp",
    published: true
  },
  {
    id: "scandal-dinner-show",
    title: "Scandal Dinner Show",
    category: "parchi-spettacoli",
    zone: "Costa Adeje",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["mezza"],
    priceFrom: 94,
    priceAdult: 94,
    // Niente priceChild: si entra solo dai 16 anni in su, un prezzo bambini
    // qui non esiste (non e' "non lo sappiamo").
    priceChild: 0,
    ages: { adult: "16+" },
    family: false,
    // Solo il sabato, **confermato dall'ufficio**. La pagina del fornitore si
    // contraddiceva: l'intestazione diceva "ogni sabato" e il corpo "venerdi' e
    // sabato" (due volte, domande frequenti comprese). Era stato tenuto il piu'
    // largo dei due in attesa della conferma; aveva ragione l'intestazione.
    days: ["sab"],
    times: ["20:30"],
    included: ["lunch", "drinks"],
    // I due biglietti del modulo di prenotazione. Il corpo della pagina parla
    // di **tre** livelli (Standard, Gold, Platinum) e ci costruisce sopra una
    // domanda frequente, ma nel modulo lo Standard non si puo' comprare: ci
    // sono solo Oro e Platinum. Vale il modulo, come per il flamenco.
    options: {
      label: { it: "Tipo di biglietto", en: "Ticket type", es: "Tipo de entrada", fr: "Type de billet", de: "Ticketart" },
      choices: [
        {
          label: { it: "Ingresso Oro", en: "Gold entry", es: "Entrada Oro", fr: "Entrée Gold", de: "Gold-Eintritt" },
          priceAdult: 94,
          desc: {
            it: "Posti vicini al palco, a tavoli condivisi con altri ospiti.",
            en: "Seats close to the stage, at tables shared with other guests.",
            es: "Asientos cerca del escenario, en mesas compartidas con otros huéspedes.",
            fr: "Places près de la scène, à des tables partagées avec d'autres clients.",
            de: "Plätze nahe der Bühne, an Tischen, die man mit anderen Gästen teilt."
          }
        },
        {
          label: { it: "Ingresso Platinum", en: "Platinum entry", es: "Entrada Platinum", fr: "Entrée Platinum", de: "Platinum-Eintritt" },
          priceAdult: 114,
          desc: {
            it: "I posti migliori, in prima fila, con tavolo privato da 2 a 8 persone solo per il tuo gruppo. Stesso menu e stesse bevande.",
            en: "The best seats, front row, with a private table for 2 to 8 people just for your group. Same menu and same drinks.",
            es: "Los mejores asientos, en primera fila, con mesa privada de 2 a 8 personas solo para tu grupo. Mismo menú y mismas bebidas.",
            fr: "Les meilleures places, au premier rang, avec une table privée de 2 à 8 personnes rien que pour votre groupe. Même menu et mêmes boissons.",
            de: "Die besten Plätze, in der ersten Reihe, mit einem privaten Tisch für 2 bis 8 Personen nur für Ihre Gruppe. Gleiches Menü und gleiche Getränke."
          }
        }
      ]
    },
    transfer: {
      it: "Trasferimento opzionale da Los Gigantes, Playa Paraíso, Puerto de la Cruz e Caletillas, da richiedere in fase di prenotazione; prezzo su richiesta.",
      en: "Optional transfer from Los Gigantes, Playa Paraíso, Puerto de la Cruz and Caletillas, to request when booking; price on request.",
      es: "Traslado opcional desde Los Gigantes, Playa Paraíso, Puerto de la Cruz y Caletillas, a solicitar al reservar; precio a consultar.",
      fr: "Transfert facultatif depuis Los Gigantes, Playa Paraíso, Puerto de la Cruz et Caletillas, à demander en réservant ; prix sur demande.",
      de: "Optionaler Transfer ab Los Gigantes, Playa Paraíso, Puerto de la Cruz und Caletillas, bei der Buchung anzufragen; Preis auf Anfrage."
    },
    // Il prezzo del transfer si sa solo su richiesta: col transfer spuntato il
    // totale non si fa (proprietario, 19 ottobre 2026). Senza questo campo il
    // sito lo trattava come gratis e mostrava un totale piu' basso del vero.
    transferPriceUnknown: true,
    desc: {
      it: "Cena e cabaret in una serata pensata per adulti: vietata ai minori di 16 anni.",
      en: "Dinner and cabaret in an evening made for adults: no under-16s.",
      es: "Cena y cabaret en una velada pensada para adultos: prohibida a menores de 16 años.",
      fr: "Dîner et cabaret dans une soirée pensée pour les adultes : pas de moins de 16 ans.",
      de: "Dinner und Kabarett an einem Abend für Erwachsene: keine unter 16-Jährigen."
    },
    notes: [
      { it: "Le porte aprono alle 20:00 col drink di benvenuto e chiudono alle 20:30, quando comincia lo spettacolo: chi arriva dopo perde la prima portata. Si finisce verso le 23:30.",
        en: "Doors open at 20:00 with a welcome drink and close at 20:30, when the show starts: anyone arriving later misses the first course. It ends around 23:30.",
        es: "Las puertas abren a las 20:00 con la copa de bienvenida y cierran a las 20:30, cuando empieza el espectáculo: quien llegue después se pierde el primer plato. Termina sobre las 23:30.",
        fr: "Les portes ouvrent à 20:00 avec un verre de bienvenue et ferment à 20:30, quand le spectacle commence : qui arrive plus tard rate le premier plat. Cela se termine vers 23:30.",
        de: "Einlass um 20:00 mit einem Begrüßungsdrink, um 20:30 wird geschlossen, wenn die Show beginnt: Wer später kommt, verpasst den ersten Gang. Ende gegen 23:30." },
      { it: "Le portate arrivano fra un numero e l'altro: si cena e si guarda lo spettacolo insieme, non uno dopo l'altro. Spettacolo in inglese e spagnolo.",
        en: "The courses come between the acts: you have dinner and watch the show at the same time, not one after the other. The show is in English and Spanish.",
        es: "Los platos llegan entre número y número: se cena y se ve el espectáculo a la vez, no uno después del otro. El espectáculo es en inglés y español.",
        fr: "Les plats arrivent entre les numéros : on dîne et on regarde le spectacle en même temps, pas l'un après l'autre. Le spectacle est en anglais et en espagnol.",
        de: "Die Gänge kommen zwischen den Nummern: Man isst und schaut die Show zur gleichen Zeit, nicht nacheinander. Die Show ist auf Englisch und Spanisch." },
      { it: "Menu degustazione di cinque portate, cucina fusion asiatico-mediterranea; cambia di tanto in tanto. Compresi vino della casa, birra, acqua e bibite: superalcolici, cava e champagne si pagano a parte.",
        en: "Five-course tasting menu, Asian-Mediterranean fusion; it changes from time to time. House wine, beer, water and soft drinks are included: spirits, cava and champagne are paid separately.",
        es: "Menú degustación de cinco platos, cocina fusión asiático-mediterránea; cambia de vez en cuando. Incluye vino de la casa, cerveza, agua y refrescos: licores, cava y champán se pagan aparte.",
        fr: "Menu dégustation de cinq plats, fusion asiatique-méditerranéenne ; il change de temps en temps. Vin de la maison, bière, eau et sodas sont compris : alcools forts, cava et champagne se paient à part.",
        de: "Fünf-Gänge-Degustationsmenü, asiatisch-mediterrane Fusion; es wechselt von Zeit zu Zeit. Hauswein, Bier, Wasser und Softdrinks sind inklusive: Spirituosen, Cava und Champagner werden extra bezahlt." },
      { it: "Dress code smart/elegant casual: pantaloni lunghi per uomo, vietati costume da bagno, sandali, infradito e abbigliamento sportivo, controllato all'ingresso.",
        en: "Smart/elegant casual dress code: long trousers for men, no swimwear, sandals, flip-flops or sportswear, checked at the door.",
        es: "Código de vestimenta smart/elegante: pantalón largo para hombres, prohibido bañador, sandalias, chanclas y ropa deportiva, se comprueba en la entrada.",
        fr: "Tenue smart/élégante décontractée : pantalon long pour les hommes, pas de maillot de bain, sandales, tongs ni tenue de sport, contrôle à l'entrée.",
        de: "Dresscode smart/elegant casual: lange Hosen für Herren, keine Badekleidung, Sandalen, Flip-Flops oder Sportkleidung, wird am Eingang kontrolliert." },
      { it: "Menu vegetariano, vegano e senza glutine su richiesta; per allergie avvisare almeno 24 ore prima.",
        en: "Vegetarian, vegan and gluten-free menus on request; notify allergies at least 24 hours in advance.",
        es: "Menú vegetariano, vegano y sin gluten bajo petición; para alergias avisar con al menos 24 horas de antelación.",
        fr: "Menus végétariens, végans et sans gluten sur demande ; signalez les allergies au moins 24 heures à l'avance.",
        de: "Vegetarische, vegane und glutenfreie Menüs auf Anfrage; Allergien mindestens 24 Stunden vorher melden." },
      { it: "Si tiene nella sala Las Olas dell'hotel GF Victoria, a Costa Adeje: l'ingresso allo spettacolo è segnalato dalla hall. Parcheggio pubblico gratuito al CC Plaza del Duque, a circa 5 minuti a piedi; parcheggio sotterraneo dell'hotel a pagamento.",
        en: "Held in the Las Olas showroom of the GF Victoria hotel, in Costa Adeje: the way in to the show is signposted from the lobby. Free public parking at CC Plaza del Duque, about a 5-minute walk; paid underground parking at the hotel.",
        es: "Se celebra en la sala Las Olas del hotel GF Victoria, en Costa Adeje: la entrada al espectáculo está señalizada desde el hall. Aparcamiento público gratuito en el CC Plaza del Duque, a unos 5 minutos a pie; aparcamiento subterráneo del hotel de pago.",
        fr: "Ça se passe dans la salle Las Olas de l'hôtel GF Victoria, à Costa Adeje : l'accès au spectacle est indiqué depuis le hall. Parking public gratuit au CC Plaza del Duque, à environ 5 minutes à pied ; parking souterrain payant à l'hôtel.",
        de: "Im Saal Las Olas des Hotels GF Victoria in Costa Adeje: Der Weg zur Show ist von der Lobby aus ausgeschildert. Kostenloser öffentlicher Parkplatz im CC Plaza del Duque, etwa 5 Minuten zu Fuß; gebührenpflichtige Tiefgarage im Hotel." }
    ],
    image: "scandal-dinner-show.webp",
    published: true
  },
  {
    id: "history-music-show",
    title: "History – The Evolution of Music",
    category: "parchi-spettacoli",
    zone: "Playa de las Américas",
    duration: { it: "2 ore e 15", en: "2 hours 15 minutes", es: "2 horas y 15 minutos", fr: "2 heures 15 minutes", de: "2 Stunden 15 Minuten" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["mezza"],
    priceFrom: 49,
    priceAdult: 49,
    priceChild: 25,
    // Qui `0` vuol dire davvero gratis: il modulo del fornitore ha una terza
    // riga, "Bambino (gratuito)", accanto a quelle da 49 € e 25 €.
    priceInfant: 0,
    // "Bambini 5-15" l'ha detto l'ufficio: il fornitore le fasce non le scrive.
    // Il 16+ e lo 0-4 sono gli unici completamenti che non lasciano buchi
    // fra le tre righe del modulo.
    ages: { adult: "16+", child: "5-15", infant: "0-4" },
    family: true,
    days: ["sab"],
    times: ["21:00"],
    desc: {
      it: "Spettacolo musicale dal vivo con più di trenta artisti, fra musica, danza, teatro e acrobazie: dalla musica classica a Elvis, Beatles, Queen, ABBA e Michael Jackson.",
      en: "A live music show with more than thirty performers, mixing music, dance, theatre and acrobatics: from classical music to Elvis, the Beatles, Queen, ABBA and Michael Jackson.",
      es: "Espectáculo musical en directo con más de treinta artistas, entre música, danza, teatro y acrobacias: desde la música clásica hasta Elvis, los Beatles, Queen, ABBA y Michael Jackson.",
      fr: "Un spectacle de musique en direct avec plus de trente artistes, qui mêle musique, danse, théâtre et acrobaties : de la musique classique à Elvis, aux Beatles, à Queen, à ABBA et à Michael Jackson.",
      de: "Eine Live-Musikshow mit über dreißig Künstlern, die Musik, Tanz, Theater und Akrobatik mischt: von Klassik bis Elvis, die Beatles, Queen, ABBA und Michael Jackson."
    },
    notes: [
      { it: "Si tiene all'Auditorio Pirámide de Arona. Apertura porte alle 20:00, posti non assegnati (ordine di arrivo). Parcheggio sotterraneo al CC Oasis, di fronte alla sede.",
        en: "Held at the Auditorio Pirámide de Arona. Doors open at 20:00, unassigned seating (first come, first served). Underground parking at CC Oasis, opposite the venue.",
        es: "Se celebra en el Auditorio Pirámide de Arona. Apertura de puertas a las 20:00, asientos no numerados (por orden de llegada). Aparcamiento subterráneo en el CC Oasis, enfrente del recinto.",
        fr: "Ça se passe à l'Auditorio Pirámide de Arona. Les portes ouvrent à 20:00, places non numérotées (premiers arrivés, premiers servis). Parking souterrain au CC Oasis, en face de la salle.",
        de: "Im Auditorio Pirámide de Arona. Einlass um 20:00, freie Platzwahl (wer zuerst kommt). Tiefgarage im CC Oasis, gegenüber." },
      { it: "Due ore di spettacolo più un intervallo di 15 minuti. Presentato in inglese.",
        en: "Two hours of show plus a 15-minute interval. Presented in English.",
        es: "Dos horas de espectáculo más un intervalo de 15 minutos. Presentado en inglés.",
        fr: "Deux heures de spectacle plus un entracte de 15 minutes. Présenté en anglais.",
        de: "Zwei Stunden Show plus 15 Minuten Pause. Auf Englisch." },
      { it: "Dress code smart casual (jeans ok): niente abbigliamento sportivo o pantaloncini.",
        en: "Smart casual dress code (jeans OK): no sportswear or shorts.",
        es: "Código de vestimenta smart casual (vaqueros permitidos): nada de ropa deportiva ni pantalones cortos.",
        fr: "Tenue smart casual (jean accepté) : pas de tenue de sport ni de short.",
        de: "Dresscode smart casual (Jeans in Ordnung): keine Sportkleidung, keine kurzen Hosen." }
    ],
    image: "history-music-show.webp",
    published: true
  },

  // ─── TOUR DELL'ISOLA ──────────────────────────────────────────────────────
  {
    id: "la-gomera",
    // Conta sempre come card (proprietario, 11 ottobre 2026: le escursioni
    // di Island Excursions).
    pagamento: "card",
    title: "La Gomera Island Tour",
    // Sul ticket i venditori scrivono solo "Gomera" (proprietario, 8 ottobre 2026).
    nomi: ["Gomera"],
    category: "tour-isola",
    // La zona e' la destinazione, non il punto di ritiro: il ritiro cambia con
    // la variante (sud dell'isola o Puerto de la Cruz) e sta scritto li'.
    zone: { it: "Isola di La Gomera", en: "Island of La Gomera", es: "Isla de La Gomera", fr: "Île de La Gomera", de: "Insel La Gomera" },
    duration: { it: "Circa 10 ore", en: "About 10 hours", es: "Unas 10 horas", fr: "Environ 10 heures", de: "Etwa 10 Stunden" },
    zoneGroups: ["altre-isole"],
    durationGroups: ["intera"],
    // I giorni della scheda sono l'unione delle due partenze: la domenica non
    // si fa mai. Ogni variante poi stringe sui suoi giorni, e la variante
    // vince — dal sud si parte lun mar mer ven sab, dal nord mar gio sab.
    days: ["lun", "mar", "mer", "gio", "ven", "sab"],
    // Le sette lingue mandate dall'ufficio (8 settembre 2026), le stesse di
    // `icod-garachico-orotava`. Scritte per esteso anche qui e **non messe in
    // una costante in comune**, anche se le due liste oggi sono identiche: la
    // regola e' che ogni scheda ha le sue (proprietario, 8 settembre 2026), e
    // una costante condivisa farebbe cambiare l'altra scheda il giorno che un
    // fornitore toglie una lingua.
    languages: ["Español", "English", "Deutsch", "Русский", "Italiano", "Français", "Nederlands"],
    // Le partenze vere non le sappiamo: il ritiro dipende dall'hotel e il
    // fornitore lo comunica con la conferma. Niente campo `times`, cosi'
    // restano le fasce segnaposto piu' "Da concordare".
    priceFrom: 110,
    fixedPrice: true,
    priceAdult: 110,
    priceChild: 75,
    // 15,50 € non e' gratis: i neonati pagano il posto sul traghetto. La cifra
    // e' quella del fornitore per il ritiro dal sud.
    priceInfant: 15.5,
    // Le tre fasce combaciano senza buchi: 0-3, 4-11, 12+.
    ages: { adult: "12+", child: "4-11", infant: "0-3" },
    family: true,
    // Il ritiro in hotel e' compreso in tutte e due le varianti, quindi sta
    // fra le icone; non e' un `transfer` opzionale da spuntare, perche' non
    // esiste un prezzo senza. `ferry` e' la traversata Fred Olsen andata e
    // ritorno, `lunch` il pranzo al Restaurante Las Rosas.
    included: ["transfer", "ferry", "guide", "lunch"],
    desc: {
      it: "Una giornata sull'isola accanto: traghetto Fred Olsen, il Roque de Agando, la foresta di Garajonay e il pranzo gomero.",
      en: "A day on the island next door: the Fred Olsen ferry, Roque de Agando, the Garajonay forest and a Gomeran lunch.",
      es: "Un día en la isla de al lado: ferry Fred Olsen, el Roque de Agando, el bosque de Garajonay y el almuerzo gomero.",
      fr: "Une journée sur l'île voisine : le ferry Fred Olsen, le Roque de Agando, la forêt de Garajonay et un déjeuner gomérien.",
      de: "Ein Tag auf der Nachbarinsel: die Fred-Olsen-Fähre, der Roque de Agando, der Wald von Garajonay und ein gomerisches Mittagessen."
    },
    options: {
      label: { it: "Da dove ti veniamo a prendere", en: "Where we pick you up", es: "Dónde te recogemos", fr: "Où nous passons vous prendre", de: "Wo wir Sie abholen" },
      choices: [
        {
          label: { it: "Tenerife sud", en: "South Tenerife", es: "Tenerife sur", fr: "Sud de Tenerife", de: "Süden von Teneriffa" },
          priceAdult: 110,
          priceChild: 75,
          days: ["lun", "mar", "mer", "ven", "sab"],
          desc: {
            it: "Ritiro negli hotel del sud dell'isola e imbarco a Los Cristianos. Si parte lunedì, martedì, mercoledì, venerdì e sabato.",
            en: "Pick-up at hotels in the south of the island and boarding at Los Cristianos. It runs Monday, Tuesday, Wednesday, Friday and Saturday.",
            es: "Recogida en los hoteles del sur de la isla y embarque en Los Cristianos. Sale lunes, martes, miércoles, viernes y sábado.",
            fr: "Prise en charge aux hôtels du sud de l'île et embarquement à Los Cristianos. Elle a lieu lundi, mardi, mercredi, vendredi et samedi.",
            de: "Abholung an den Hotels im Süden der Insel und Einschiffung in Los Cristianos. Sie findet montags, dienstags, mittwochs, freitags und samstags statt."
          }
        },
        {
          label: { it: "Puerto de la Cruz", en: "Puerto de la Cruz", es: "Puerto de la Cruz", fr: "Puerto de la Cruz", de: "Puerto de la Cruz" },
          // Solo `price`, senza `priceAdult`: 115 € e' il prezzo adulti che il
          // fornitore scrive per il nord, ma per bambini e neonati da li' non
          // ci ha dato niente. Con `priceAdult` il totale si sarebbe fatto
          // lo stesso e avrebbe contato i piccoli col prezzo del sud, cioe'
          // un numero verosimile e falso. Cosi' invece il conto non si fa e
          // il prezzo lo conferma l'ufficio. Da chiedere.
          price: 115,
          days: ["mar", "gio", "sab"],
          desc: {
            it: "Ritiro dal nord, a Puerto de la Cruz: €115 a adulto, martedì, giovedì e sabato. Il prezzo per bambini e neonati da qui te lo confermiamo in ufficio.",
            en: "Pick-up from the north, in Puerto de la Cruz: €115 per adult, on Tuesday, Thursday and Saturday. We confirm the price for children and babies from here with the office.",
            es: "Recogida desde el norte, en Puerto de la Cruz: 115 € por adulto, martes, jueves y sábado. El precio para niños y bebés desde aquí te lo confirmamos en la oficina.",
            fr: "Prise en charge dans le nord, à Puerto de la Cruz : €115 par adulte, mardi, jeudi et samedi. Le prix pour les enfants et les bébés depuis là-bas, nous le confirmons avec le bureau.",
            de: "Abholung im Norden, in Puerto de la Cruz: €115 pro Erwachsenem, dienstags, donnerstags und samstags. Den Preis für Kinder und Babys von dort bestätigen wir mit dem Büro."
          }
        }
      ]
    },
    itinerary: [
      {
        text: {
          it: "Ritiro in hotel e trasferimento al porto di Los Cristianos, dove si prende il traghetto Fred Olsen per San Sebastián de La Gomera.",
          en: "Hotel pick-up and transfer to the port of Los Cristianos, where you board the Fred Olsen ferry to San Sebastián de La Gomera.",
          es: "Recogida en el hotel y traslado al puerto de Los Cristianos, donde se toma el ferry de Fred Olsen hasta San Sebastián de La Gomera.",
          fr: "Prise en charge à l'hôtel et transfert au port de Los Cristianos, où l'on embarque sur le ferry Fred Olsen pour San Sebastián de La Gomera.",
          de: "Abholung am Hotel und Transfer zum Hafen von Los Cristianos, wo Sie an Bord der Fred-Olsen-Fähre nach San Sebastián de La Gomera gehen."
        }
      },
      {
        text: {
          it: "Sbarcati sull'isola si prende la strada del sud, con una sosta ai piedi del Roque de Agando: è il camino di un vulcano rimasto in piedi dopo che il resto si è consumato.",
          en: "Once ashore you take the southern road, with a stop at the foot of Roque de Agando: the plug of a volcano still standing after the rest wore away.",
          es: "Ya en la isla se toma la carretera del sur, con una parada al pie del Roque de Agando: la chimenea de un volcán que quedó en pie después de que el resto se desgastara.",
          fr: "Une fois à terre, on prend la route du sud, avec un arrêt au pied du Roque de Agando : la cheminée d'un volcan encore debout après l'érosion de tout le reste.",
          de: "An Land nimmt man die Südstraße, mit einem Stopp am Fuß des Roque de Agando: dem Schlot eines Vulkans, der stehen geblieben ist, als der Rest abgetragen wurde."
        }
      },
      {
        text: {
          it: "Passeggiata dentro il Parco Nazionale di Garajonay, la foresta di laurisilva che l'UNESCO ha dichiarato patrimonio dell'umanità nel 1986: alberi sempre verdi e nebbia bassa a pochi chilometri dal versante arido dell'isola.",
          en: "A walk inside Garajonay National Park, the laurel forest UNESCO listed as a World Heritage site in 1986: evergreen trees and low mist a few kilometres from the dry side of the island.",
          es: "Paseo por el Parque Nacional de Garajonay, el bosque de laurisilva que la UNESCO declaró Patrimonio de la Humanidad en 1986: árboles siempre verdes y niebla baja a pocos kilómetros de la vertiente árida de la isla.",
          fr: "Une promenade dans le parc national de Garajonay, la forêt de lauriers inscrite au patrimoine mondial de l'UNESCO en 1986 : arbres toujours verts et brume basse à quelques kilomètres du côté sec de l'île.",
          de: "Ein Spaziergang im Nationalpark Garajonay, dem Lorbeerwald, den die UNESCO 1986 zum Welterbe erklärt hat: immergrüne Bäume und tiefer Nebel, ein paar Kilometer von der trockenen Seite der Insel entfernt."
        }
      },
      {
        text: {
          it: "Pranzo al Restaurante Las Rosas, cucina gomera, compreso nel prezzo.",
          en: "Lunch at Restaurante Las Rosas, Gomeran cooking, included in the price.",
          es: "Almuerzo en el Restaurante Las Rosas, cocina gomera, incluido en el precio.",
          fr: "Déjeuner au Restaurante Las Rosas, cuisine gomérienne, compris dans le prix.",
          de: "Mittagessen im Restaurante Las Rosas, gomerische Küche, im Preis inbegriffen."
        }
      },
      {
        text: {
          it: "Dopo mangiato, la dimostrazione del silbo gomero: la lingua fischiata con cui sull'isola ci si parla da una valle all'altra, insegnata di maestro in allievo e ancora usata da più di ventimila persone.",
          en: "After lunch, a demonstration of the silbo gomero: the whistled language islanders use to speak across valleys, passed from master to pupil and still used by more than twenty thousand people.",
          es: "Después de comer, la demostración del silbo gomero: la lengua silbada con la que en la isla se habla de un valle a otro, transmitida de maestro a discípulo y usada todavía por más de veinte mil personas.",
          fr: "Après le déjeuner, une démonstration du silbo gomero : la langue sifflée avec laquelle on se parle d'une vallée à l'autre sur l'île, transmise de maître à élève et encore utilisée par plus de vingt mille personnes.",
          de: "Nach dem Essen eine Vorführung des Silbo Gomero: der Pfeifsprache, mit der man sich auf der Insel von Tal zu Tal verständigt, vom Meister zum Schüler weitergegeben und noch heute von über zwanzigtausend Menschen benutzt."
        }
      },
      {
        text: {
          it: "Sosta ad Agulo, paese del nord affacciato sull'oceano, con le sue strade lastricate e il Teide di fronte, dall'altra parte del mare.",
          en: "A stop in Agulo, a northern village facing the ocean, with its cobbled streets and Teide across the water.",
          es: "Parada en Agulo, pueblo del norte asomado al océano, con sus calles empedradas y el Teide enfrente, al otro lado del mar.",
          fr: "Un arrêt à Agulo, village du nord face à l'océan, avec ses rues pavées et le Teide de l'autre côté de la mer.",
          de: "Ein Stopp in Agulo, einem Dorf im Norden mit Blick aufs Meer, mit Kopfsteinpflaster und dem Teide gegenüber."
        }
      },
      {
        text: {
          it: "Rientro a San Sebastián, la capitale: cinquecento anni di storia in poche strade, la Torre del Conde, la chiesa dell'Asunción e il pozzo della Casa de la Aguada, quello da cui — si racconta — Colombo prese l'acqua prima di partire per le Americhe.",
          en: "Back to San Sebastián, the capital: five hundred years of history in a few streets, the Torre del Conde, the church of la Asunción and the well of the Casa de la Aguada, the one Columbus is said to have drawn water from before sailing for the Americas.",
          es: "Vuelta a San Sebastián, la capital: quinientos años de historia en pocas calles, la Torre del Conde, la iglesia de la Asunción y el pozo de la Casa de la Aguada, aquel del que —se cuenta— Colón tomó el agua antes de partir hacia América.",
          fr: "Retour à San Sebastián, la capitale : cinq cents ans d'histoire en quelques rues, la Torre del Conde, l'église de l'Asunción et le puits de la Casa de la Aguada, celui où Colomb aurait puisé de l'eau avant de partir pour les Amériques.",
          de: "Zurück nach San Sebastián, der Hauptstadt: fünfhundert Jahre Geschichte in ein paar Straßen, die Torre del Conde, die Kirche de la Asunción und der Brunnen der Casa de la Aguada, aus dem Kolumbus Wasser geschöpft haben soll, bevor er nach Amerika aufbrach."
        }
      },
      {
        text: {
          it: "Imbarco per il ritorno a Los Cristianos e rientro in hotel. Nel canale fra le due isole capita spesso di incrociare globicefali e delfini.",
          en: "Boarding for the return to Los Cristianos and back to the hotel. Pilot whales and dolphins are often met in the channel between the two islands.",
          es: "Embarque de vuelta a Los Cristianos y regreso al hotel. En el canal entre las dos islas es frecuente cruzarse con calderones y delfines.",
          fr: "Embarquement pour le retour à Los Cristianos et retour à l'hôtel. Dans le canal entre les deux îles, on croise souvent globicéphales et dauphins.",
          de: "Einschiffung für die Rückfahrt nach Los Cristianos und zurück zum Hotel. Im Kanal zwischen den beiden Inseln trifft man oft Grindwale und Delfine."
        }
      }
    ],
    notes: [
      {
        it: "Serve un documento d'identità valido il giorno dell'escursione — il fornitore chiede il passaporto. Senza, la compagnia non fa salire sul traghetto e la giornata è persa.",
        en: "You need a valid ID document on the day of the trip — the operator asks for a passport. Without it the ferry company will not let you board and the day is lost.",
        es: "Hace falta un documento de identidad válido el día de la excursión: el proveedor pide el pasaporte. Sin él, la naviera no deja embarcar y el día se pierde.",
        fr: "Il faut une pièce d'identité valide le jour de l'excursion — l'opérateur demande le passeport. Sans elle, la compagnie de ferry ne vous laisse pas monter et la journée est perdue.",
        de: "Am Tag des Ausflugs brauchen Sie einen gültigen Ausweis — der Anbieter verlangt einen Reisepass. Ohne ihn lässt die Fährgesellschaft Sie nicht an Bord, und der Tag ist verloren."
      },
      {
        it: "È una giornata intera, circa dieci ore fra ritiro e rientro: il ritiro in hotel è presto la mattina e l'orario esatto te lo confermiamo insieme alla prenotazione.",
        en: "It is a full day, about ten hours from pick-up to drop-off: the hotel pick-up is early in the morning and we confirm the exact time along with the booking.",
        es: "Es un día entero, unas diez horas entre la recogida y la vuelta: la recogida en el hotel es temprano por la mañana y la hora exacta te la confirmamos junto con la reserva.",
        fr: "C'est une journée entière, environ dix heures entre la prise en charge et le retour : la prise en charge à l'hôtel se fait tôt le matin et nous confirmons l'heure exacte avec la réservation.",
        de: "Es ist ein ganzer Tag, etwa zehn Stunden von der Abholung bis zur Rückkehr: Die Abholung am Hotel ist früh am Morgen, und die genaue Uhrzeit bestätigen wir mit der Buchung."
      },
      {
        it: "A Garajonay si sta in quota e spesso c'è nebbia: fa più fresco che sulla costa, porta una giacca leggera e scarpe comode.",
        en: "Garajonay is up in the hills and often misty: it is cooler than on the coast, so bring a light jacket and comfortable shoes.",
        es: "En Garajonay se está en altura y a menudo hay niebla: hace más fresco que en la costa, lleva una chaqueta ligera y calzado cómodo.",
        fr: "Garajonay est en altitude et souvent dans la brume : il fait plus frais que sur la côte, donc apportez une veste légère et des chaussures confortables.",
        de: "Garajonay liegt in der Höhe und ist oft neblig: Es ist kühler als an der Küste, bringen Sie also eine leichte Jacke und bequeme Schuhe mit."
      },
      {
        it: "Balene e delfini durante la traversata si vedono spesso, ma sono animali liberi: nessuno può prometterteli.",
        en: "Whales and dolphins are often seen during the crossing, but they are wild animals: nobody can promise them.",
        es: "Ballenas y delfines se ven a menudo durante la travesía, pero son animales libres: nadie puede prometértelos.",
        fr: "On voit souvent baleines et dauphins pendant la traversée, mais ce sont des animaux sauvages : personne ne peut les promettre.",
        de: "Wale und Delfine sieht man bei der Überfahrt oft, aber es sind wilde Tiere: Niemand kann sie versprechen."
      },
      {
        it: "Se hai un'allergia o un'esigenza alimentare per il pranzo, scrivicelo nella richiesta: lo giriamo al ristorante.",
        en: "If you have an allergy or a dietary requirement for lunch, tell us in your request: we pass it on to the restaurant.",
        es: "Si tienes una alergia o una necesidad alimentaria para el almuerzo, escríbenoslo en la solicitud: se lo pasamos al restaurante.",
        fr: "Si vous avez une allergie ou un régime particulier pour le déjeuner, dites-le-nous dans la demande : nous le transmettons au restaurant.",
        de: "Wenn Sie eine Allergie oder einen besonderen Ernährungswunsch fürs Mittagessen haben, schreiben Sie es in die Anfrage: Wir geben es ans Restaurant weiter."
      },
      // I giorni sono un blocco: la finestra non lascia mandare una richiesta
      // per un giorno in cui non si parte. Questa nota fa il mestiere che il
      // blocco non puo fare — dire che quei giorni non sono incisi nella
      // pietra, perche cambiano con la lingua della guida. Una riga sola: nel
      // riquadro dei consigli una nota lunga si legge come un paragrafo.
      { it: "I giorni possono cambiare secondo la lingua della guida.",
        en: "The days can change depending on the language of the guide.",
        es: "Los días pueden cambiar según el idioma del guía.",
        fr: "Les jours peuvent changer selon la langue du guide.",
        de: "Die Tage können sich je nach Sprache des Guides ändern." }
    ],
    image: "la-gomera.webp",
    published: true
  },
  {
    // L'id resta `santa-cruz-taganana` anche se il titolo non dice piu'
    // Taganana: gli id non si cambiano (stessa regola delle tre categorie
    // rinominate ad agosto), e cambiarlo qui butterebbe via i link gia' salvati
    // e le richieste ferme in localStorage. Il nome del file della foto lo
    // segue: `santa-cruz-taganana.webp` serve anche alla griglia della home.
    id: "santa-cruz-taganana",
    // Conta sempre come card (proprietario, 11 ottobre 2026: le escursioni
    // di Island Excursions).
    pagamento: "card",
    // Il titolo e' quello del fornitore ufficiale, uguale in tutte e cinque le
    // lingue come tutti gli altri.
    title: "Santa Cruz + Anaga + La Laguna",
    // E' tornata in "Tour e visite" per scelta del proprietario (14 settembre
    // 2026), dopo mezza settimana in "Teide e natura" dove l'aveva spostata
    // lui stesso l'8 settembre per via del Parco Rurale di Anaga. Il giro e'
    // fatto di tre paesi — Santa Cruz, La Laguna e le case di Anaga — e in una
    // categoria che si chiama "Teide" chi cerca una giornata di citta' non la
    // guarda nemmeno.
    // E' un ritorno **completo**, non un `alsoIn`: si poteva tenerla in tutte
    // e due, ed e' stato chiesto di no. Una scheda in due categorie ha senso
    // quando ognuna la racconta per intero (Poema del Mar e' un parco ed e'
    // una gita a Gran Canaria); qui la natura e' un pezzo del giro, non il
    // giro. Se un giorno si ricambia idea, la riga da aggiungere e'
    // `alsoIn: ["teide-natura"]`.
    // La foto `santa-cruz-taganana.webp` e' anche il riquadro di "Tour e
    // visite" in home: adesso la categoria del riquadro e la categoria della
    // scheda tornano a essere la stessa.
    category: "tour-isola",
    // Il nord-est e' dove va il pullman, non da dove parte: come sul giro di
    // Icod, quel campo in pagina si legge "Punto di partenza", e la partenza
    // e' una sola, il sud (proprietario, 8 settembre 2026). Santa Cruz, Anaga
    // e La Laguna restano scritte nel titolo e nella descrizione.
    zone: { it: "Tenerife Sud", en: "South Tenerife", es: "Tenerife sur", fr: "Sud de Tenerife", de: "Süden von Teneriffa" },
    duration: { it: "8 ore circa", en: "About 8 hours", es: "8 horas aprox.", fr: "Environ 8 heures", de: "Etwa 8 Stunden" },
    zoneGroups: ["teide-nord"],
    durationGroups: ["intera"],
    // Lunedi' e giovedi' non stavano nei dati ufficiali, erano presi dalla
    // pagina del rivenditore: confermati dal proprietario (8 settembre 2026).
    days: ["lun", "gio"],
    // Le sei lingue le ha date il proprietario (8 settembre 2026). Non e'
    // `LINGUE_TOUR`: quella lista ne ha cinque e qui c'e' anche l'olandese,
    // quindi la lista e' scritta per esteso. Come sempre nella lingua stessa —
    // "Nederlands", non "Olandese" — cosi' un olandese riconosce la sua riga
    // anche guardando il sito in spagnolo. L'ordine e' quello dell'ufficio.
    languages: ["Español", "English", "Deutsch", "Italiano", "Français", "Nederlands"],
    // `times` non c'e': le partenze vere non le sappiamo. L'ora del ritiro
    // dipende dall'hotel e si conferma con la prenotazione (vedi le note),
    // quindi restano le fasce segnaposto piu' "Da concordare".
    // 50 e' il prezzo del fornitore ufficiale, e prende il posto del 48 che
    // c'era prima: alzarlo l'ha confermato il proprietario (8 settembre 2026).
    priceFrom: 50,
    fixedPrice: true,
    priceAdult: 50,
    priceChild: 31.5,
    // Niente `priceInfant`: il fornitore scrive "Bebés (NO PONER)", cioe' la
    // riga dei neonati non si mette. Assente vuol dire "non lo sappiamo", che
    // qui e' la verita': non sappiamo se sotto i 2 anni si sale gratis.
    // Le due fasce combaciano: 2-11 e 12+.
    ages: { adult: "12+", child: "2-11" },
    // Il ritiro in hotel e la guida. La guida era rimasta fuori perche' il
    // fornitore ufficiale non la nominava e "guide multilingue" era testo del
    // rivenditore; il proprietario ha confermato che c'e' (8 settembre 2026).
    included: ["transfer", "guide"],
    itinerary: [
      {
        text: {
          it: "Ritiro alla fermata concordata e salita verso la capitale per l'autostrada del sud",
          en: "Pickup at your agreed stop and the drive up to the capital along the southern motorway",
          es: "Recogida en su parada y subida hacia la capital por la autopista del sur",
          fr: "Prise en charge à l'arrêt convenu et route vers la capitale par l'autoroute du sud",
          de: "Abholung an der vereinbarten Haltestelle und Fahrt in die Hauptstadt über die Südautobahn"
        }
      },
      {
        text: {
          it: "Santa Cruz: tempo libero fra i luoghi simbolo della capitale e i negozi",
          en: "Santa Cruz: free time among the capital's landmarks and its shops",
          es: "Santa Cruz: tiempo libre entre los lugares emblemáticos de la capital y las tiendas",
          fr: "Santa Cruz : temps libre entre les monuments de la capitale et ses boutiques",
          de: "Santa Cruz: freie Zeit zwischen den Sehenswürdigkeiten der Hauptstadt und ihren Läden"
        }
      },
      {
        text: {
          it: "Si prosegue verso Anaga passando davanti alla Playa de las Teresitas, senza sosta",
          en: "On towards Anaga, passing Playa de las Teresitas without stopping",
          es: "Se sigue hacia Anaga pasando por la Playa de las Teresitas, sin parada",
          fr: "On continue vers Anaga, en passant devant la Playa de las Teresitas sans s'arrêter",
          de: "Weiter Richtung Anaga, an der Playa de las Teresitas vorbei ohne Halt"
        }
      },
      {
        text: {
          it: "Cruz del Carmen, dentro il Parco Rurale di Anaga, Riserva della Biosfera: le vedute sul massiccio e la sosta per il pranzo",
          en: "Cruz del Carmen, inside the Anaga Rural Park, a Biosphere Reserve: the views over the massif and the lunch stop",
          es: "Cruz del Carmen, dentro del Parque Rural de Anaga, Reserva de la Biosfera: las vistas del macizo y la parada para almorzar",
          fr: "Cruz del Carmen, dans le parc rural d'Anaga, réserve de biosphère : les vues sur le massif et l'arrêt déjeuner",
          de: "Cruz del Carmen, im Landschaftspark Anaga, einem Biosphärenreservat: Ausblicke über das Gebirge und Mittagspause"
        }
      },
      {
        text: {
          it: "La Laguna, città storica e universitaria, Patrimonio dell'Umanità UNESCO dal 1999",
          en: "La Laguna, the historic university city, a UNESCO World Heritage Site since 1999",
          es: "La Laguna, ciudad histórica y universitaria, Patrimonio de la Humanidad por la UNESCO desde 1999",
          fr: "La Laguna, la ville universitaire historique, inscrite au patrimoine mondial de l'UNESCO depuis 1999",
          de: "La Laguna, die historische Universitätsstadt, seit 1999 UNESCO-Welterbe"
        }
      },
      {
        text: {
          it: "Rientro in hotel",
          en: "Back to the hotel",
          es: "Vuelta al hotel",
          fr: "Retour à l'hôtel",
          de: "Rückfahrt zum Hotel"
        }
      }
    ],
    notes: [
      {
        it: "Il pranzo non è incluso: la sosta per mangiare si fa a Cruz del Carmen.",
        en: "Lunch is not included: the meal stop is at Cruz del Carmen.",
        es: "El almuerzo no está incluido: la parada para comer se hace en Cruz del Carmen.",
        fr: "Le déjeuner n'est pas compris : l'arrêt repas se fait à Cruz del Carmen.",
        de: "Das Mittagessen ist nicht inklusive: Die Essenspause ist in Cruz del Carmen."
      },
      {
        it: "Alla Playa de las Teresitas si passa davanti ma non ci si ferma: non è una tappa del giro.",
        en: "Playa de las Teresitas is only driven past, there is no stop: it is not one of the stages.",
        es: "Por la Playa de las Teresitas solo se pasa, no hay parada: no es una etapa del recorrido.",
        fr: "On passe seulement devant la Playa de las Teresitas, sans s'arrêter : ce n'est pas une étape.",
        de: "An der Playa de las Teresitas fährt man nur vorbei, ohne Halt: Sie ist keine Etappe."
      },
      {
        it: "Ad Anaga si sta in quota e il tempo cambia in fretta, anche quando al sud c'è il sole: porta una felpa o una giacca leggera.",
        en: "Anaga is up in the hills and the weather changes quickly, even when it is sunny in the south: bring a sweatshirt or a light jacket.",
        es: "En Anaga se está en altura y el tiempo cambia rápido, aunque en el sur haga sol: lleva una sudadera o una chaqueta ligera.",
        fr: "Anaga est en altitude et le temps change vite, même quand il fait soleil dans le sud : apportez un sweat ou une veste légère.",
        de: "Anaga liegt in der Höhe und das Wetter ändert sich schnell, auch wenn im Süden die Sonne scheint: Bringen Sie einen Pullover oder eine leichte Jacke mit."
      },
      {
        it: "L'ora del ritiro dipende dall'hotel e si conferma con la prenotazione.",
        en: "The pickup time depends on your hotel and is confirmed with the booking.",
        es: "La hora de recogida depende del hotel y se confirma con la reserva.",
        fr: "L'heure de prise en charge dépend de votre hôtel et est confirmée avec la réservation.",
        de: "Die Abholzeit hängt von Ihrem Hotel ab und wird mit der Buchung bestätigt."
      },
      // I giorni sono un blocco: la finestra non lascia mandare una richiesta
      // per un giorno in cui non si parte. Questa nota fa il mestiere che il
      // blocco non puo fare — dire che quei giorni non sono incisi nella
      // pietra, perche cambiano con la lingua della guida. Una riga sola: nel
      // riquadro dei consigli una nota lunga si legge come un paragrafo.
      { it: "I giorni possono cambiare secondo la lingua della guida.",
        en: "The days can change depending on the language of the guide.",
        es: "Los días pueden cambiar según el idioma del guía.",
        fr: "Les jours peuvent changer selon la langue du guide.",
        de: "Die Tage können sich je nach Sprache des Guides ändern." }
    ],
    family: true,
    desc: {
      it: "La capitale Santa Cruz, il Parco Rurale di Anaga a Cruz del Carmen e La Laguna, Patrimonio UNESCO: il nord-est dell'isola in una giornata, con ritiro alla fermata concordata.",
      en: "The capital Santa Cruz, the Anaga Rural Park at Cruz del Carmen and UNESCO-listed La Laguna: the north-east of the island in a day, with pickup at your agreed stop.",
      es: "La capital, Santa Cruz, el Parque Rural de Anaga en Cruz del Carmen y La Laguna, Patrimonio de la UNESCO: el noreste de la isla en un día, con recogida en su parada.",
      fr: "La capitale Santa Cruz, le parc rural d'Anaga à Cruz del Carmen et La Laguna, classée par l'UNESCO : le nord-est de l'île en une journée, avec prise en charge à l'arrêt convenu.",
      de: "Die Hauptstadt Santa Cruz, der Landschaftspark Anaga bei Cruz del Carmen und das UNESCO-Welterbe La Laguna: der Nordosten der Insel an einem Tag, mit Abholung an der vereinbarten Haltestelle."
    },
    image: "santa-cruz-taganana.webp",
    published: true
  },
  {
    // Non e' una scheda nuova: il segnaposto c'era gia' dal 14 settembre, e da
    // ieri ha anche gli orari del pick-up in `PICKUP_TIMES`. Qui si riempie —
    // prezzi, durata, tappe — con la pagina del fornitore mandata
    // dall'ufficio il 16 settembre 2026 (Nere Izerdie / Island Excursions,
    // Costa Adeje), che la chiama "VUELTA A LA ISLA".
    id: "island-tour-completo",
    // Conta sempre come card (proprietario, 11 ottobre 2026: le escursioni
    // di Island Excursions).
    pagamento: "card",
    // Il titolo resta quello scritto da Admiral, come su `la-palma`: il
    // fornitore la chiama "Vuelta a la Isla", ma il nome sul sito lo cambia
    // solo l'ufficio.
    title: {
      it: "Tour completo dell'isola",
      en: "Full island tour",
      es: "Tour completo de la isla",
      fr: "Tour complet de l'île",
      de: "Komplette Inselrundfahrt"
    },
    category: "tour-isola",
    // Era "Tutta l'isola", e diceva il falso: quel campo in pagina si legge
    // "Punto di partenza". Vale la stessa decisione del proprietario
    // dell'8 settembre 2026 presa su `icod-garachico-orotava` e su
    // `santa-cruz-taganana` — la partenza e' **una sola**, il sud. Dove si va
    // lo dicono il titolo, la descrizione e le tappe.
    zone: { it: "Tenerife Sud", en: "South Tenerife", es: "Tenerife sur", fr: "Sud de Tenerife", de: "Süden von Teneriffa" },
    // "Duración de la excursión: 8 horas aprox" sulla pagina del fornitore.
    // Era "Giornata intera": vero ma vago, come sul giro di Icod.
    duration: { it: "8 ore circa", en: "About 8 hours", es: "8 horas aprox.", fr: "Environ 8 heures", de: "Etwa 8 Stunden" },
    zoneGroups: ["teide-nord"],
    durationGroups: ["intera"],
    // Niente `times`: l'ora non e' una sola, la decide il punto di raccolta
    // del cliente. Sta in PICKUP_TIMES dentro hotel.js (raccolti il 16
    // settembre 2026), e la finestra della richiesta al posto del menu "A che
    // ora" mostra l'ora del suo hotel.
    //
    // **Solo il martedi'**, detto dal proprietario il 16 settembre 2026. Il
    // fornitore in pagina non scrive i giorni, e il campo era rimasto assente —
    // cioe' "tutti i giorni", che era la cosa sbagliata da dire per un giro che
    // parte una volta a settimana. E' la scheda con meno partenze delle tre di
    // questo fornitore (Icod sei su sette, Santa Cruz lunedi' e giovedi').
    // **`mar` e' martedi', `mer` e' mercoledi'.**
    days: ["mar"],
    //
    // Listino del fornitore: 50 € adulti, 31,50 € bambini. E' il prezzo
    // pieno — il "Por: 50€" del riquadro della prenotazione e' il conto di un
    // adulto, non uno sconto.
    priceFrom: 50,
    fixedPrice: true,
    priceAdult: 50,
    priceChild: 31.5,
    // Il fornitore da' solo "Niños (2-11)", quindi gli adulti sono 12+. La
    // riga dei bebe' dice "NO PONER", cioe' non si mette: niente `ages.infant`
    // e niente `priceInfant`. Campo assente = "non lo sappiamo" — non
    // "gratis". Stessa situazione di `icod-garachico-orotava` e
    // `santa-cruz-taganana`.
    ages: { adult: "12+", child: "2-11" },
    // Quattro lingue, mandate dal proprietario il 16 settembre 2026. La
    // tendina "Idioma" del fornitore mostrava il solo spagnolo e il campo era
    // rimasto fuori apposta: una tendina di un rivenditore non e' la lista
    // vera, e infatti sono quattro. Non e' `LINGUE_TOUR`, che ne ha cinque —
    // qui manca il francese, quindi la lista e' scritta per esteso. Come
    // sempre nella lingua stessa ("Deutsch", non "Tedesco"): un tedesco
    // riconosce la sua riga anche guardando il sito in spagnolo. L'ordine e'
    // quello dell'ufficio, che ha cominciato dall'italiano.
    languages: ["Italiano", "Español", "English", "Deutsch"],
    //
    // Il ritiro lo scrive il fornitore ("Le recogeremos en el bus en su
    // parada"). La guida no, ma il proprietario l'8 settembre 2026 ha detto
    // che c'e' su **tutte** queste escursioni: l'ufficio sa cosa vende meglio
    // della pagina del fornitore.
    included: ["transfer", "guide"],
    // Le tappe sono quelle della pagina, in ordine e senza orario: il
    // fornitore non li da', e l'ora del ritiro cambia da fermata a fermata.
    itinerary: [
      { text: { it: "Ritiro alla fermata concordata e viaggio verso gli Acantilados de Los Gigantes",
                en: "Pickup at your agreed stop and the drive to the Los Gigantes cliffs",
                es: "Recogida en su parada y viaje hacia los Acantilados de Los Gigantes",
                fr: "Prise en charge à l'arrêt convenu et route vers les falaises de Los Gigantes",
                de: "Abholung an der vereinbarten Haltestelle und Fahrt zu den Klippen von Los Gigantes" } },
      { text: { it: "Sosta al Mirador de Garachico, affacciato sulla villa e sulla costa nord",
                en: "A stop at the Mirador de Garachico, looking down over the town and the north coast",
                es: "Parada en el Mirador de Garachico, asomado a la villa y a la costa norte",
                fr: "Un arrêt au Mirador de Garachico, qui domine la ville et la côte nord",
                de: "Ein Stopp am Mirador de Garachico, mit Blick hinunter auf die Stadt und die Nordküste" } },
      { text: { it: "Icod de los Vinos, dove c'è il Drago Millenario, l'albero simbolo delle Canarie",
                en: "Icod de los Vinos, home of the thousand-year-old dragon tree, the symbol of the Canaries",
                es: "Icod de los Vinos, donde está el Drago Milenario, el árbol símbolo de Canarias",
                fr: "Icod de los Vinos, où se trouve le dragonnier millénaire, symbole des Canaries",
                de: "Icod de los Vinos, Heimat des tausendjährigen Drachenbaums, des Symbols der Kanaren" } },
      { text: { it: "La Orotava, paese canario tipico, con la famosa Casa de los Balcones",
                en: "La Orotava, a typical Canarian town, with the famous Casa de los Balcones",
                es: "La Orotava, pueblo típico canario, con la famosa Casa de los Balcones",
                fr: "La Orotava, ville canarienne typique, avec la célèbre Casa de los Balcones",
                de: "La Orotava, eine typisch kanarische Stadt, mit der berühmten Casa de los Balcones" } },
      { text: { it: "Puerto de la Cruz: tempo libero per il pranzo, i negozi e una passeggiata",
                en: "Puerto de la Cruz: free time for lunch, the shops and a walk around",
                es: "Puerto de la Cruz: tiempo libre para almorzar, las tiendas y un paseo",
                fr: "Puerto de la Cruz : temps libre pour déjeuner, faire les boutiques et se promener",
                de: "Puerto de la Cruz: freie Zeit für Mittagessen, Läden und einen Spaziergang" } },
      { text: { it: "Ultima sosta a Candelaria, dalla Patrona dell'arcipelago",
                en: "A last stop at Candelaria, at the patron saint of the archipelago",
                es: "Última parada en Candelaria, ante la Patrona del Archipiélago",
                fr: "Un dernier arrêt à Candelaria, chez la patronne de l'archipel",
                de: "Ein letzter Halt in Candelaria, bei der Schutzpatronin des Archipels" } },
      { text: { it: "Rientro in hotel per l'autostrada del sud",
                en: "Back to the hotel along the southern motorway",
                es: "Vuelta al hotel por la autopista del sur",
                fr: "Retour à l'hôtel par l'autoroute du sud",
                de: "Rückfahrt zum Hotel über die Südautobahn" } }
    ],
    notes: [
      { it: "Il pranzo non è incluso: la sosta per mangiare si fa a Puerto de la Cruz.",
        en: "Lunch is not included: the meal stop is in Puerto de la Cruz.",
        es: "El almuerzo no está incluido: la parada para comer se hace en Puerto de la Cruz.",
        fr: "Le déjeuner n'est pas compris : l'arrêt repas se fait à Puerto de la Cruz.",
        de: "Das Mittagessen ist nicht inklusive: Die Essenspause ist in Puerto de la Cruz." },
      { it: "Quasi tutta la giornata si passa al nord, dove fa più fresco e nuvoloso che al sud: porta una felpa o una giacca leggera.",
        en: "Most of the day is spent in the north, which is cooler and cloudier than the south: bring a sweatshirt or a light jacket.",
        es: "Casi todo el día se pasa en el norte, donde hace más fresco y nublado que en el sur: lleva una sudadera o una chaqueta ligera.",
        fr: "La plus grande partie de la journée se passe dans le nord, plus frais et plus nuageux que le sud : apportez un sweat ou une veste légère.",
        de: "Den größten Teil des Tages verbringt man im Norden, der kühler und bewölkter ist als der Süden: Bringen Sie einen Pullover oder eine leichte Jacke mit." }
    ],
    family: true,
    // Riscritta da zero nelle tre lingue sulle tappe vere. Prima era generica
    // ("i punti simbolo di Tenerife"), che e' quello che si scrive quando non
    // si sa ancora dove passa il pullman.
    desc: {
      it: "Il giro dell'isola in una giornata: le scogliere di Los Gigantes, Garachico dal mirador, il Drago Millenario di Icod, La Orotava e la Casa de los Balcones, Puerto de la Cruz e la Patrona di Candelaria, con ritiro alla fermata concordata.",
      en: "The island in a single day: the Los Gigantes cliffs, Garachico from the viewpoint, the thousand-year-old dragon tree of Icod, La Orotava and its Casa de los Balcones, Puerto de la Cruz and the patron saint at Candelaria, with pickup at your agreed stop.",
      es: "La vuelta a la isla en un día: los acantilados de Los Gigantes, Garachico desde el mirador, el Drago Milenario de Icod, La Orotava y la Casa de los Balcones, Puerto de la Cruz y la Patrona de Candelaria, con recogida en su parada.",
      fr: "L'île en une seule journée : les falaises de Los Gigantes, Garachico depuis le belvédère, le dragonnier millénaire d'Icod, La Orotava et sa Casa de los Balcones, Puerto de la Cruz et la patronne à Candelaria, avec prise en charge à l'arrêt convenu.",
      de: "Die Insel an einem einzigen Tag: die Klippen von Los Gigantes, Garachico vom Aussichtspunkt, der tausendjährige Drachenbaum von Icod, La Orotava und die Casa de los Balcones, Puerto de la Cruz und die Schutzpatronin in Candelaria, mit Abholung an der vereinbarten Haltestelle."
    },
    image: "island-tour-completo.webp",
    published: true
  },
  {
    id: "la-palma",
    // Il titolo resta quello scritto da Admiral. Il fornitore la chiama
    // "La Palma Tour Volcán": da cambiare solo se lo dice l'ufficio.
    title: "La Palma",
    category: "tour-isola",
    // Come su La Gomera, la zona e' la destinazione: il punto di ritrovo
    // (porto di Los Cristianos) sta nell'itinerario e nelle note.
    zone: { it: "Isola di La Palma", en: "Island of La Palma", es: "Isla de La Palma", fr: "Île de La Palma", de: "Insel La Palma" },
    duration: { it: "Circa 12 ore", en: "About 12 hours", es: "Unas 12 horas", fr: "Environ 12 heures", de: "Etwa 12 Stunden" },
    zoneGroups: ["altre-isole"],
    durationGroups: ["intera"],
    // Una partenza sola e fissa: il ritrovo delle 07:45 al porto. Scritta
    // qui, "Da concordare" sparisce e il cliente sa a che ora deve esserci.
    times: ["07:45"],
    // `days` non c'e': il fornitore non scrive in che giorni si fa. Da
    // chiedere all'ufficio — un traghetto non va per forza tutti i giorni.
    // Tre lingue sole, mandate dall'ufficio (8 settembre 2026): e' l'elenco
    // piu' corto fra i tour dell'isola, meta' di quello di La Gomera. Sono le
    // stesse tre della gita a Gran Canaria (id `gran-canaria`, titolo "Poema
    // del Mar"), e come sempre restano scritte qui e non in una costante in
    // comune: ogni scheda ha le sue.
    languages: ["English", "Español", "Deutsch"],
    priceFrom: 145,
    fixedPrice: true,
    priceAdult: 145,
    priceChild: 126,
    // 20 € non e' gratis: i neonati pagano il posto sul traghetto.
    priceInfant: 20,
    // Le tre fasce combaciano senza buchi: 0-3, 4-11, 12+.
    ages: { adult: "12+", child: "4-11", infant: "0-3" },
    family: true,
    // Il pranzo ("Incluye: almuerzo en uno de los restaurantes típicos"), la
    // traversata andata e ritorno, e la guida — che il fornitore non nominava
    // ma che il proprietario ha confermato (8 settembre 2026).
    // **Niente `transfer` lo stesso**: questa partenza e' "sin recogida", si va
    // al porto da soli. La guida c'e', il ritiro no: sono due cose diverse e
    // qui la seconda resta fuori.
    included: ["ferry", "lunch", "guide"],
    desc: {
      it: "Una giornata sull'isola del vulcano: traghetto da Los Cristianos, il Mirador de la Concepción sopra il cratere della Caldereta e le colate del Cumbre Vieja, le più giovani di Spagna.",
      en: "A day on the volcano island: the ferry from Los Cristianos, the Mirador de la Concepción above the Caldereta crater and the Cumbre Vieja lava flows, the youngest in Spain.",
      es: "Un día en la isla del volcán: ferry desde Los Cristianos, el Mirador de la Concepción sobre el cráter de la Caldereta y las coladas del Cumbre Vieja, las más jóvenes de España.",
      fr: "Une journée sur l'île des volcans : le ferry depuis Los Cristianos, le Mirador de la Concepción au-dessus du cratère de la Caldereta et les coulées de lave de la Cumbre Vieja, les plus jeunes d'Espagne.",
      de: "Ein Tag auf der Vulkaninsel: die Fähre ab Los Cristianos, der Mirador de la Concepción über dem Krater der Caldereta und die Lavaströme der Cumbre Vieja, die jüngsten Spaniens."
    },
    itinerary: [
      {
        time: "07:45",
        text: {
          it: "Ritrovo al porto di Los Cristianos, davanti all'ufficio Fred Olsen. Al porto ci si arriva da soli: su questa partenza il ritiro in hotel non c'è.",
          en: "Meeting at the port of Los Cristianos, in front of the Fred Olsen office. You make your own way to the port: this departure has no hotel pick-up.",
          es: "Encuentro en el puerto de Los Cristianos, delante de la oficina de Fred Olsen. Al puerto se llega por cuenta propia: esta salida no lleva recogida en el hotel.",
          fr: "Rendez-vous au port de Los Cristianos, devant le bureau Fred Olsen. On se rend au port par ses propres moyens : ce départ n'a pas de prise en charge à l'hôtel.",
          de: "Treffpunkt im Hafen von Los Cristianos, vor dem Büro von Fred Olsen. Zum Hafen kommen Sie selbst: Diese Abfahrt hat keine Abholung am Hotel."
        }
      },
      {
        time: "08:30",
        text: {
          it: "Partenza del traghetto per Santa Cruz de La Palma. La traversata dura circa due ore e un quarto.",
          en: "The ferry leaves for Santa Cruz de La Palma. The crossing takes about two and a quarter hours.",
          es: "Salida del ferry hacia Santa Cruz de La Palma. La travesía dura unas dos horas y cuarto.",
          fr: "Le ferry part pour Santa Cruz de La Palma. La traversée dure environ deux heures et quart.",
          de: "Die Fähre fährt nach Santa Cruz de La Palma. Die Überfahrt dauert etwa zweieinviertel Stunden."
        }
      },
      {
        time: "11:00",
        text: {
          it: "Sbarco nella capitale e tempo libero in centro: il Barco de la Virgen, il Castillo de Santa Catalina e la via dei balconi di legno, fra i più belli rimasti nelle Canarie.",
          en: "Landing in the capital and free time in the centre: the Barco de la Virgen, the Castillo de Santa Catalina and the street of wooden balconies, among the finest left in the Canaries.",
          es: "Desembarque en la capital y tiempo libre por el centro: el Barco de la Virgen, el Castillo de Santa Catalina y la calle de los balcones de madera, de los mejores que se conservan en Canarias.",
          fr: "Débarquement dans la capitale et temps libre dans le centre : le Barco de la Virgen, le Castillo de Santa Catalina et la rue des balcons en bois, parmi les plus beaux qui restent aux Canaries.",
          de: "Ankunft in der Hauptstadt und freie Zeit im Zentrum: das Barco de la Virgen, das Castillo de Santa Catalina und die Straße der Holzbalkone, die zu den schönsten gehören, die es auf den Kanaren noch gibt."
        }
      },
      {
        text: {
          it: "Si sale al Mirador de la Concepción, in cima al vulcano della Caldereta, dichiarato Spazio Naturale: da lassù si vedono insieme il cratere e la capitale.",
          en: "Up to the Mirador de la Concepción, on top of the Caldereta volcano, a protected natural area: from there you see the crater and the capital in one view.",
          es: "Se sube al Mirador de la Concepción, en lo alto del volcán de la Caldereta, declarado Espacio Natural: desde allí se ven a la vez el cráter y la capital.",
          fr: "Montée au Mirador de la Concepción, au sommet du volcan de la Caldereta, espace naturel protégé : de là, on voit le cratère et la capitale d'un seul regard.",
          de: "Hinauf zum Mirador de la Concepción, auf dem Vulkan Caldereta, einem geschützten Naturgebiet: Von dort sieht man Krater und Hauptstadt mit einem Blick."
        }
      },
      {
        text: {
          it: "Si riprende la strada verso il Túnel del Tiempo: attraversando l'isola la vegetazione cambia sotto gli occhi, fino ad arrivare a sud-ovest, nella zona toccata dall'eruzione del Cumbre Vieja.",
          en: "Back on the road towards the Túnel del Tiempo: crossing the island the vegetation changes before your eyes, until you reach the south-west and the area hit by the Cumbre Vieja eruption.",
          es: "Se retoma el camino hacia el Túnel del Tiempo: al cruzar la isla la vegetación cambia a la vista, hasta llegar al suroeste, a la zona afectada por la erupción del Cumbre Vieja.",
          fr: "On reprend la route vers le Túnel del Tiempo : en traversant l'île, la végétation change sous vos yeux, jusqu'à arriver au sud-ouest et à la zone touchée par l'éruption de la Cumbre Vieja.",
          de: "Weiter auf der Straße Richtung Túnel del Tiempo: Beim Durchqueren der Insel ändert sich die Vegetation vor Ihren Augen, bis Sie den Südwesten und das Gebiet erreichen, das der Ausbruch der Cumbre Vieja getroffen hat."
        }
      },
      {
        text: {
          it: "Prima sosta nella zona di esclusione del quartiere di Tacande, con la prima vista sul vulcano. Poi si scende verso Tazacorte, costeggiando le colate laviche più giovani di Spagna.",
          en: "First stop in the exclusion zone of the Tacande district, with the first view of the volcano. Then down towards Tazacorte, alongside the youngest lava flows in Spain.",
          es: "Primera parada en la zona de exclusión del barrio de Tacande, con la primera vista del volcán. Después se baja hacia Tazacorte, bordeando las coladas lávicas más jóvenes de España.",
          fr: "Premier arrêt dans la zone d'exclusion du quartier de Tacande, avec la première vue sur le volcan. Puis descente vers Tazacorte, le long des coulées de lave les plus jeunes d'Espagne.",
          de: "Erster Halt in der Sperrzone des Ortsteils Tacande, mit dem ersten Blick auf den Vulkan. Dann hinunter Richtung Tazacorte, entlang der jüngsten Lavaströme Spaniens."
        }
      },
      {
        text: {
          it: "Pranzo in un ristorante tipico della zona, compreso nel prezzo.",
          en: "Lunch at a local restaurant in the area, included in the price.",
          es: "Almuerzo en un restaurante típico de la zona, incluido en el precio.",
          fr: "Déjeuner dans un restaurant local de la zone, compris dans le prix.",
          de: "Mittagessen in einem örtlichen Restaurant der Gegend, im Preis inbegriffen."
        }
      },
      {
        text: {
          it: "Dopo mangiato si va al porto di Tazacorte a vedere la fajana: il delta di lava che l'eruzione ha costruito entrando in mare.",
          en: "After lunch, on to the port of Tazacorte to see the fajana: the lava delta the eruption built as it reached the sea.",
          es: "Después de comer se va al puerto de Tazacorte a ver la fajana: el delta lávico que la erupción formó al entrar en el mar.",
          fr: "Après le déjeuner, on continue vers le port de Tazacorte pour voir la fajana : le delta de lave que l'éruption a construit en atteignant la mer.",
          de: "Nach dem Essen weiter zum Hafen von Tazacorte, um die Fajana zu sehen: das Lavadelta, das der Ausbruch gebaut hat, als er das Meer erreichte."
        }
      },
      {
        text: {
          it: "Ultima tappa al mirador della chiesa della Sagrada Familia, nel quartiere di Tajuya: l'ultimo vulcano delle Canarie è lì davanti, a circa due chilometri.",
          en: "Last stop at the viewpoint by the church of the Sagrada Familia, in the Tajuya district: the most recent volcano in the Canaries stands right there, about two kilometres away.",
          es: "Última parada en el mirador de la iglesia de la Sagrada Familia, en el barrio de Tajuya: el último volcán de Canarias está justo enfrente, a unos dos kilómetros.",
          fr: "Dernier arrêt au belvédère près de l'église de la Sagrada Familia, dans le quartier de Tajuya : le volcan le plus récent des Canaries est juste là, à environ deux kilomètres.",
          de: "Letzter Halt am Aussichtspunkt bei der Kirche Sagrada Familia im Ortsteil Tajuya: Der jüngste Vulkan der Kanaren steht genau dort, etwa zwei Kilometer entfernt."
        }
      },
      {
        time: "16:30",
        text: {
          it: "Rientro al porto di Santa Cruz de La Palma; il traghetto riparte alle 17:00.",
          en: "Back at the port of Santa Cruz de La Palma; the ferry leaves again at 17:00.",
          es: "Regreso al puerto de Santa Cruz de La Palma; el ferry sale de nuevo a las 17:00.",
          fr: "Retour au port de Santa Cruz de La Palma ; le ferry repart à 17:00.",
          de: "Zurück im Hafen von Santa Cruz de La Palma; die Fähre legt um 17:00 wieder ab."
        }
      },
      {
        time: "19:30",
        text: {
          it: "Arrivo al porto di Los Cristianos.",
          en: "Arrival at the port of Los Cristianos.",
          es: "Llegada al puerto de Los Cristianos.",
          fr: "Arrivée au port de Los Cristianos.",
          de: "Ankunft im Hafen von Los Cristianos."
        }
      }
    ],
    notes: [
      {
        it: "Serve un documento d'identità o il passaporto in corso di validità: la compagnia lo chiede all'imbarco e senza non si sale sul traghetto.",
        en: "You need a valid ID card or passport: the ferry company asks for it at boarding and without it you cannot get on.",
        es: "Hace falta el documento de identidad o el pasaporte en vigor: la naviera lo pide al embarcar y sin él no se sube al ferry.",
        fr: "Il faut une carte d'identité ou un passeport valides : la compagnie de ferry les demande à l'embarquement et sans eux on ne monte pas.",
        de: "Sie brauchen einen gültigen Personalausweis oder Reisepass: Die Fährgesellschaft verlangt ihn beim Einsteigen, und ohne ihn kommt man nicht an Bord."
      },
      {
        it: "Su questa partenza non c'è il ritiro in hotel: il ritrovo è alle 07:45 al porto di Los Cristianos, davanti all'ufficio Fred Olsen. Calcola il tempo per arrivarci.",
        en: "This departure has no hotel pick-up: you meet at 07:45 at the port of Los Cristianos, in front of the Fred Olsen office. Allow time to get there.",
        es: "Esta salida no lleva recogida en el hotel: el encuentro es a las 07:45 en el puerto de Los Cristianos, delante de la oficina de Fred Olsen. Calcula el tiempo para llegar.",
        fr: "Ce départ n'a pas de prise en charge à l'hôtel : rendez-vous à 07:45 au port de Los Cristianos, devant le bureau Fred Olsen. Prévoyez le temps pour y arriver.",
        de: "Diese Abfahrt hat keine Abholung am Hotel: Treffpunkt ist um 07:45 im Hafen von Los Cristianos, vor dem Büro von Fred Olsen. Planen Sie die Zeit für die Anfahrt ein."
      },
      {
        it: "È una giornata intera, circa dodici ore: si torna a Los Cristianos verso le 19:30.",
        en: "It is a full day, about twelve hours: you are back in Los Cristianos around 19:30.",
        es: "Es un día entero, unas doce horas: se vuelve a Los Cristianos sobre las 19:30.",
        fr: "C'est une journée entière, environ douze heures : on est de retour à Los Cristianos vers 19:30.",
        de: "Es ist ein ganzer Tag, etwa zwölf Stunden: Gegen 19:30 sind Sie zurück in Los Cristianos."
      },
      {
        it: "La traversata dura più di due ore per parte. Se soffri il mare, il fornitore consiglia di prendere qualcosa contro il mal di mare prima di imbarcarti.",
        en: "The crossing takes more than two hours each way. If you get seasick, the operator suggests taking something for it before boarding.",
        es: "La travesía dura más de dos horas por trayecto. Si te mareas, el proveedor recomienda tomar algo para el mareo antes de embarcar.",
        fr: "La traversée dure plus de deux heures dans chaque sens. Si vous avez le mal de mer, l'opérateur conseille de prendre quelque chose avant d'embarquer.",
        de: "Die Überfahrt dauert in jede Richtung über zwei Stunden. Wenn Sie leicht seekrank werden, empfiehlt der Anbieter, vor dem Einsteigen etwas dagegen zu nehmen."
      },
      {
        it: "Ai miradores si sta in quota e fa più fresco che sulla costa: porta scarpe comode e qualcosa di caldo.",
        en: "The viewpoints are up in the hills and cooler than the coast: bring comfortable shoes and something warm.",
        es: "Los miradores están en altura y hace más fresco que en la costa: lleva calzado cómodo y algo de abrigo.",
        fr: "Les belvédères sont en altitude et plus frais que la côte : apportez des chaussures confortables et quelque chose de chaud.",
        de: "Die Aussichtspunkte liegen in der Höhe und sind kühler als die Küste: Bringen Sie bequeme Schuhe und etwas Warmes mit."
      },
      {
        it: "L'escursione si svolge in spagnolo.",
        en: "The excursion is run in Spanish.",
        es: "La excursión se realiza en español.",
        fr: "L'excursion se fait en espagnol.",
        de: "Der Ausflug ist auf Spanisch."
      },
      {
        it: "Se hai un'allergia o un'esigenza alimentare per il pranzo, scrivicelo nella richiesta: lo giriamo al ristorante.",
        en: "If you have an allergy or a dietary requirement for lunch, tell us in your request: we pass it on to the restaurant.",
        es: "Si tienes una alergia o una necesidad alimentaria para el almuerzo, escríbenoslo en la solicitud: se lo pasamos al restaurante.",
        fr: "Si vous avez une allergie ou un régime particulier pour le déjeuner, dites-le-nous dans la demande : nous le transmettons au restaurant.",
        de: "Wenn Sie eine Allergie oder einen besonderen Ernährungswunsch fürs Mittagessen haben, schreiben Sie es in die Anfrage: Wir geben es ans Restaurant weiter."
      }
    ],
    image: "la-palma.webp",
    // dove ci si presenta: era gia' scritto nei consigli (15 ottobre 2026)
    ritrovo: { it: "Porto di Los Cristianos, davanti all'ufficio Fred Olsen", en: "Los Cristianos harbour, in front of the Fred Olsen office", es: "Puerto de Los Cristianos, delante de la oficina de Fred Olsen", fr: "Port de Los Cristianos, devant le bureau Fred Olsen", de: "Hafen Los Cristianos, vor dem Fred-Olsen-Büro" },
    published: true
  },
  {
    id: "cantine-vinicole",
    // Riempita il 6 ottobre 2026 dalla pagina del negozio di Admiral ("First
    // Wine Tasting Tour", Tienda/Adventure Tickets). L'id resta quello del
    // segnaposto: i codici interni non si cambiano, si romperebbero i link.
    // Il titolo invece e' quello di Admiral, uguale in tutte le lingue: il
    // vecchio "con sommelier" non lo diceva nessuno, la pagina parla di
    // "esperti" della cantina.
    title: "First Wine Tasting Tour",
    category: "tour-isola",
    // La cantina e' a Vilaflor, ma il campo si legge "Punto di partenza": il
    // pulmino parte da Los Cristianos e Costa Adeje, e passa sotto l'hotel
    // (proprietario, 6 ottobre 2026). Nel filtro sta nelle due zone da cui si
    // parte, come il Twin Ticket sta in tutte e due le sue. Vilaflor e' scritta
    // nella descrizione e nelle tappe.
    zone: { it: "Los Cristianos e Costa Adeje", en: "Los Cristianos and Costa Adeje", es: "Los Cristianos y Costa Adeje", fr: "Los Cristianos et Costa Adeje", de: "Los Cristianos und Costa Adeje" },
    zoneGroups: ["los-cristianos", "costa-adeje"],
    // Ritiro verso le 10:00, rientro verso le 15:00: cinque ore, "circa"
    // perche' il fornitore scrive "approximately" su tutte e due le ore.
    duration: { it: "5 ore circa", en: "About 5 hours", es: "5 horas aprox.", fr: "Environ 5 heures", de: "Etwa 5 Stunden" },
    durationGroups: ["mezza"],
    // Un solo prezzo, 85 € a persona. **I bambini non salgono** (proprietario,
    // 6 ottobre 2026): come sull'Utopia, solo la fascia degli adulti, niente
    // priceChild e niente priceInfant — qui non vogliono dire "non lo
    // sappiamo", vogliono dire "non puo' venire". Con un bambino nella
    // richiesta il totale non si fa. 18+ perche' e' una degustazione di vino:
    // proposto da me, confermato dal proprietario lo stesso giorno.
    // `fixedPrice` c'era gia' sul segnaposto, scelto dal proprietario.
    priceFrom: 85,
    fixedPrice: true,
    priceAdult: 85,
    priceChild: 0,
    ages: { adult: "18+" },
    family: false,
    // "Tuesday, Wednesday Thursday & Fridays only". **mar e' martedi', mer e'
    // mercoledi'.**
    days: ["mar", "mer", "gio", "ven"],
    // L'ora del ritiro "approximately 10.00am": e' l'unica partenza, e la nota
    // qui sotto dice che l'ora esatta dipende dall'hotel e la conferma
    // l'ufficio.
    times: ["10:00"],
    // Il trasporto e' compreso e il pulmino passa sotto l'hotel (proprietario,
    // 6 ottobre 2026): la scheda sta in PICKUP_IN_HOTEL, hotel.js. "Experts showcase the wine making process"
    // e' la guida; le tapas sono `fingerfood`.
    included: ["transfer", "guide", "tasting", "fingerfood"],
    itinerary: [
      { time: "10:00",
        text: { it: "Ritiro in hotel, verso le 10:00",
                en: "Hotel pickup, around 10:00",
                es: "Recogida en el hotel, hacia las 10:00",
                fr: "Prise en charge à l'hôtel, vers 10:00",
                de: "Abholung am Hotel, gegen 10:00" } },
      { text: { it: "Salita a Vilaflor, il paese più alto della Spagna: giro fra le vigne e visita della bodega tradizionale",
                en: "Up to Vilaflor, the highest village in Spain: a walk through the vineyard and a visit to the traditional bodega",
                es: "Subida a Vilaflor, el pueblo más alto de España: paseo por el viñedo y visita a la bodega tradicional",
                fr: "Montée à Vilaflor, le village le plus haut d'Espagne : promenade dans le vignoble et visite de la bodega traditionnelle",
                de: "Hinauf nach Vilaflor, dem höchstgelegenen Dorf Spaniens: ein Spaziergang durch den Weinberg und Besuch der traditionellen Bodega" } },
      { text: { it: "Come nasce il vino, spiegato da chi lo fa, e la degustazione con le tapas",
                en: "How the wine is made, explained by the people who make it, then the tasting with tapas",
                es: "Cómo se hace el vino, contado por quien lo elabora, y la cata con tapas",
                fr: "Comment on fait le vin, expliqué par ceux qui le font, puis la dégustation avec des tapas",
                de: "Wie der Wein gemacht wird, erklärt von denen, die ihn machen, dann die Verkostung mit Tapas" } },
      { time: "15:00",
        text: { it: "Rientro in hotel, verso le 15:00",
                en: "Back at the hotel, around 15:00",
                es: "Regreso al hotel, hacia las 15:00",
                fr: "Retour à l'hôtel, vers 15:00",
                de: "Zurück am Hotel, gegen 15:00" } }
    ],
    notes: [
      { it: "Il pulmino passa verso le 10:00 e si rientra verso le 15:00: l'ora esatta del ritiro dipende dall'hotel e te la confermiamo insieme alla prenotazione.",
        en: "The minibus comes by around 10:00 and you are back around 15:00: the exact pickup time depends on your hotel and we confirm it with your booking.",
        es: "El minibús pasa hacia las 10:00 y se vuelve hacia las 15:00: la hora exacta de recogida depende del hotel y te la confirmamos con la reserva.",
        fr: "Le minibus passe vers 10:00 et vous êtes de retour vers 15:00 : l'heure exacte de prise en charge dépend de votre hôtel et nous la confirmons avec la réservation.",
        de: "Der Minibus kommt gegen 10:00 und Sie sind gegen 15:00 zurück: Die genaue Abholzeit hängt von Ihrem Hotel ab und wir bestätigen sie mit der Buchung." },
      { it: "Gruppi piccoli: al massimo 8 persone per tour.",
        en: "Small groups: no more than 8 people per tour.",
        es: "Grupos pequeños: como máximo 8 personas por tour.",
        fr: "Petits groupes : 8 personnes au maximum par sortie.",
        de: "Kleine Gruppen: höchstens 8 Personen pro Tour." },
      { it: "Solo per adulti: i bambini non partecipano.",
        en: "Adults only: children cannot take part.",
        es: "Solo para adultos: los niños no participan.",
        fr: "Adultes seulement : les enfants ne peuvent pas participer.",
        de: "Nur Erwachsene: Kinder können nicht teilnehmen." }
    ],
    desc: {
      it: "Una giornata in una cantina di Vilaflor, sopra il sud di Tenerife, in gruppo da otto al massimo. Si cammina fra le vigne, si entra nella bodega tradizionale e chi fa il vino racconta come nasce, bicchiere dopo bicchiere, con le tapas in tavola. Il pulmino passa a prenderti in hotel e ti riporta a metà pomeriggio.",
      en: "A day at a winery in Vilaflor, above the south of Tenerife, in a group of eight at most. You walk through the vines, step into the traditional bodega and the winemakers tell you how the wine is made, glass after glass, with tapas on the table. The minibus picks you up at your hotel and brings you back mid-afternoon.",
      es: "Un día en una bodega de Vilaflor, sobre el sur de Tenerife, en grupos de ocho como máximo. Se pasea entre las viñas, se entra en la bodega tradicional y quien hace el vino cuenta cómo nace, copa tras copa, con tapas en la mesa. El minibús te recoge en el hotel y te devuelve a media tarde.",
      fr: "Une journée dans un domaine viticole à Vilaflor, au-dessus du sud de Tenerife, en groupe de huit au maximum. On marche entre les vignes, on entre dans la bodega traditionnelle et les vignerons racontent comment on fait le vin, verre après verre, avec des tapas sur la table. Le minibus passe vous prendre à l'hôtel et vous ramène en milieu d'après-midi.",
      de: "Ein Tag auf einem Weingut in Vilaflor, oberhalb des Südens von Teneriffa, in einer Gruppe von höchstens acht. Man geht durch die Reben, betritt die traditionelle Bodega, und die Winzer erzählen, wie der Wein entsteht, Glas für Glas, mit Tapas auf dem Tisch. Der Minibus holt Sie am Hotel ab und bringt Sie am Nachmittag zurück."
    },
    image: "cantine-vinicole.webp",
    published: true
  },
  {
    // Canaventura, "Agroturismo – Plátanos & Vinos" (sul volantino "Bananas &
    // Wines"), dal volantino e dalla pagina del fornitore mandati il 6 ottobre
    // 2026. Il titolo e' quello inglese del volantino, uguale nelle tre
    // lingue come gli altri nomi dei fornitori: confermato dal proprietario.
    // Non e' un doppione del First Wine Tasting Tour qui sopra, anche se la
    // cantina "a piu' di 1200 m" puo' essere la stessa: qui c'e' la finca di
    // banane e il mirador, si parte alle 8 e solo il martedi', costa 68 € e
    // non 85.
    id: "bananas-wines",
    title: "Bananas & Wines",
    category: "tour-isola",
    // Si parte dal sud e il pulmino passa sotto l'hotel, come sulle camminate
    // di Canaventura: la scheda sta in PICKUP_IN_HOTEL (hotel.js). Nel filtro
    // sta nelle zone da cui si parte, come il First Wine Tasting Tour.
    zone: { it: "Tenerife Sud", en: "South Tenerife", es: "Tenerife sur", fr: "Sud de Tenerife", de: "Süden von Teneriffa" },
    zoneGroups: ["los-cristianos", "costa-adeje"],
    duration: { it: "5 ore", en: "5 hours", es: "5 horas", fr: "5 heures", de: "5 Stunden" },
    durationGroups: ["mezza"],
    // "Días disponibles: martes". **mar e' martedi'.**
    days: ["mar"],
    times: ["08:00"],
    // PVP del fornitore: 68 € adulti, 58 € "niños hasta 11 años". Le fasce
    // sono le stesse del Trekking, che e' dello stesso fornitore e dove il
    // proprietario ha confermato 12+ e 0-11: due fasce sole vogliono dire che
    // sotto i 12 anni si paga il prezzo bambini, neonati compresi. Niente
    // `priceInfant`.
    priceFrom: 68,
    priceAdult: 68,
    priceChild: 58,
    ages: { adult: "12+", child: "0-11" },
    included: ["transfer", "guide", "tasting"],
    itinerary: [
      { time: "08:00",
        text: { it: "Ritiro in hotel",
                en: "Hotel pickup",
                es: "Recogida en el hotel",
                fr: "Prise en charge à l'hôtel",
                de: "Abholung am Hotel" } },
      { text: { it: "Una finca di banane: come si coltivano da sempre, la storia del gofio e come si mangia, e l'assaggio di prodotti fatti con banana, gofio e miele di palma, insieme a diversi frutti tropicali",
                en: "A banana farm: how bananas have always been grown, the story of gofio and how it is eaten, and a taste of products made with banana, gofio and palm honey, along with several tropical fruits",
                es: "Una finca platanera: cómo se ha cultivado siempre el plátano, la historia del gofio y cómo se come, y la degustación de productos hechos con plátano, gofio y miel de palma, junto a varias frutas tropicales",
                fr: "Une plantation de bananes : comment on les cultive depuis toujours, l'histoire du gofio et la façon de le manger, et une dégustation de produits à base de banane, de gofio et de miel de palme, avec plusieurs fruits tropicaux",
                de: "Eine Bananenplantage: wie Bananen seit jeher angebaut werden, die Geschichte des Gofio und wie man ihn isst, und eine Kostprobe von Produkten aus Banane, Gofio und Palmhonig, zusammen mit verschiedenen tropischen Früchten" } },
      { text: { it: "Sosta al Mirador de La Centinela, a San Miguel de Abona: come si sono formati i vulcani di questa parte dell'isola",
                en: "A stop at the Mirador de La Centinela, in San Miguel de Abona: how the volcanoes of this part of the island were formed",
                es: "Parada en el Mirador de La Centinela, en San Miguel de Abona: cómo se formaron los volcanes de esta parte de la isla",
                fr: "Un arrêt au Mirador de La Centinela, à San Miguel de Abona : comment se sont formés les volcans de cette partie de l'île",
                de: "Ein Stopp am Mirador de La Centinela in San Miguel de Abona: wie die Vulkane in diesem Teil der Insel entstanden sind" } },
      { text: { it: "Su, oltre i 1200 metri, fino alla cantina: la visita fra vasche e macchinari, e la degustazione di cinque vini con prodotti locali",
                en: "Up above 1,200 metres to the winery: a tour among the tanks and machinery, then a tasting of five wines with local produce",
                es: "Subida a más de 1200 metros hasta la bodega: la visita entre depósitos y maquinaria, y la cata de cinco vinos con productos locales",
                fr: "Montée au-dessus de 1 200 mètres jusqu'au domaine viticole : visite entre les cuves et les machines, puis dégustation de cinq vins avec des produits locaux",
                de: "Hinauf über 1.200 Meter zum Weingut: ein Rundgang zwischen Tanks und Maschinen, dann eine Verkostung von fünf Weinen mit lokalen Produkten" } },
      { time: "13:00",
        text: { it: "Rientro in hotel",
                en: "Back to the hotel",
                es: "Regreso al hotel",
                fr: "Retour à l'hôtel",
                de: "Rückfahrt zum Hotel" } }
    ],
    family: true,
    desc: {
      it: "Una mattina nell'entroterra del sud, dalla banana al vino. Prima una finca di banane, dove si scopre come si coltivano e si assaggiano gofio, miele di palma e frutta tropicale; poi il belvedere sui vulcani di San Miguel e, oltre i 1200 metri, una cantina con cinque vini da provare. Bus climatizzato e guida, e all'una si è di nuovo in hotel.",
      en: "A morning in the southern hills, from bananas to wine. First a banana farm, where you see how they are grown and taste gofio, palm honey and tropical fruit; then the viewpoint over the volcanoes of San Miguel and, above 1,200 metres, a winery with five wines to try. Air-conditioned bus and guide, and you are back at the hotel by one.",
      es: "Una mañana por las medianías del sur, del plátano al vino. Primero una finca platanera, donde se ve cómo se cultiva y se prueban gofio, miel de palma y fruta tropical; luego el mirador sobre los volcanes de San Miguel y, a más de 1200 metros, una bodega con cinco vinos para catar. Bus climatizado y guía, y a la una de vuelta en el hotel.",
      fr: "Une matinée sur les hauteurs du sud, de la banane au vin. D'abord une plantation de bananes, où l'on voit comment on les cultive et où l'on goûte gofio, miel de palme et fruits tropicaux ; puis le belvédère sur les volcans de San Miguel et, au-dessus de 1 200 mètres, un domaine avec cinq vins à goûter. Bus climatisé et guide, et vous êtes de retour à l'hôtel pour une heure.",
      de: "Ein Vormittag in den Bergen des Südens, von der Banane zum Wein. Zuerst eine Bananenplantage, wo man sieht, wie sie angebaut werden, und Gofio, Palmhonig und tropische Früchte probiert; dann der Aussichtspunkt über die Vulkane von San Miguel und, über 1.200 Metern, ein Weingut mit fünf Weinen zum Probieren. Klimatisierter Bus und Guide, und um eins sind Sie zurück am Hotel."
    },
    // La grafica del volantino ("Bananas & Wines", banane, uva, vendemmia),
    // mandata dal proprietario il 6 ottobre 2026 come foto della scheda. E'
    // l'unica del catalogo con la scritta sopra: e' una scelta sua.
    image: "bananas-wines.webp",
    published: true
  },
  {
    // Finca Tuno Canarias (Ledesma Global SL), Valle San Lorenzo, Arona: dalla
    // pagina del fornitore mandata il 6 ottobre 2026. Il "tuno" e' il fico
    // d'India, e "Higo Tinto" e' il nome registrato della loro varieta' rossa:
    // resta scritto cosi' in tutte le lingue, come un nome proprio. La pagina in
    // italiano dice "fico Tinto", che e' la traduzione automatica di "higo".
    // Non copiati: le recensioni Google, "posti che si riempiono in fretta",
    // il negozio dei souvenir.
    id: "finca-tuno",
    title: "Finca Tuno Canarias",
    category: "tour-isola",
    // A 8 minuti da Los Cristianos, ci si arriva da soli: niente ritiro in
    // hotel, confermato dal proprietario il 6 ottobre 2026. Per questo la
    // scheda sta in PICKUP_NESSUNO (hotel.js) e l'indirizzo e' nelle note.
    zone: "Valle San Lorenzo (Arona)",
    zoneGroups: ["los-cristianos"],
    duration: { it: "1 ora e mezza circa", en: "About 1.5 hours", es: "1 hora y media aprox.", fr: "Environ 1 heure et demie", de: "Etwa 1,5 Stunden" },
    durationGroups: ["breve"],
    // Visite tutti i giorni, quindi niente `days`.
    times: ["09:00", "10:30", "12:30", "14:00", "15:30", "17:00", "18:30"],
    // 18 € adulti; bambini 3-12 "sconto del 50%", cioe' 9 €; 0-2 gratis,
    // scritto dal fornitore. Le fasce combaciano: 0-2, 3-12, 13+.
    priceFrom: 18,
    priceAdult: 18,
    priceChild: 9,
    priceInfant: 0,
    ages: { adult: "13+", child: "3-12", infant: "0-2" },
    // Niente `languages`: la lingua non si sceglie prenotando. La guida parla
    // inglese, spagnolo o francese a seconda del turno, e le cuffie con
    // l'audio tradotto (16 lingue) si chiedono arrivando alla finca: e' nelle
    // note.
    included: ["guide", "tasting"],
    itinerary: [
      { text: { it: "Un breve video sulla storia della finca e della famiglia che la coltiva",
                en: "A short video on the story of the farm and the family who grows it",
                es: "Un vídeo corto sobre la historia de la finca y de la familia que la cultiva",
                fr: "Une courte vidéo sur l'histoire de la ferme et de la famille qui la cultive",
                de: "Ein kurzes Video über die Geschichte der Farm und der Familie, die sie bewirtschaftet" } },
      { text: { it: "Il piccolo museo etnografico, con gli oggetti della vita contadina canaria di una volta",
                en: "The small ethnographic museum, with objects from Canarian farm life of the past",
                es: "El pequeño museo etnográfico, con objetos de la vida campesina canaria de antes",
                fr: "Le petit musée ethnographique, avec des objets de la vie paysanne canarienne d'autrefois",
                de: "Das kleine ethnografische Museum, mit Gegenständen aus dem kanarischen Landleben von früher" } },
      { text: { it: "La passeggiata guidata fra i fichi d'India e il paesaggio vulcanico, con le soste ai belvedere e la raccolta e la sbucciatura a mano come si faceva un tempo",
                en: "The guided walk among the prickly pears and the volcanic landscape, with stops at the viewpoints and a demonstration of the old way of picking and peeling by hand",
                es: "El paseo guiado entre las tuneras y el paisaje volcánico, con paradas en los miradores y la recogida y el pelado a mano como se hacía antes",
                fr: "La promenade guidée entre les figuiers de Barbarie et le paysage volcanique, avec des arrêts aux belvédères et une démonstration de l'ancienne façon de cueillir et d'éplucher à la main",
                de: "Der geführte Spaziergang zwischen den Feigenkakteen und der Vulkanlandschaft, mit Stopps an den Aussichtspunkten und einer Vorführung, wie man früher von Hand pflückte und schälte" } },
      { text: { it: "La degustazione: frutta appena tagliata e i prodotti fatti con l'Higo Tinto, poi un po' di tempo libero nel patio canario",
                en: "The tasting: freshly cut fruit and products made with Higo Tinto, then some free time in the Canarian courtyard",
                es: "La degustación: fruta recién cortada y productos hechos con Higo Tinto, y después un rato libre en el patio canario",
                fr: "La dégustation : fruits fraîchement coupés et produits à base de Higo Tinto, puis un peu de temps libre dans la cour canarienne",
                de: "Die Verkostung: frisch geschnittene Früchte und Produkte aus Higo Tinto, dann etwas freie Zeit im kanarischen Innenhof" } }
    ],
    notes: [
      { it: "La finca è all'incrocio fra Calle Argüamul e Calle Solana, a Valle San Lorenzo (Arona), a circa 8 minuti da Los Cristianos e Las Américas. Il ritiro in hotel non c'è: ci si arriva per conto proprio.",
        en: "The farm is at the corner of Calle Argüamul and Calle Solana, in Valle San Lorenzo (Arona), about 8 minutes from Los Cristianos and Las Américas. There is no hotel pickup: you make your own way there.",
        es: "La finca está en el cruce de Calle Argüamul con Calle Solana, en Valle San Lorenzo (Arona), a unos 8 minutos de Los Cristianos y Las Américas. No hay recogida en el hotel: se llega por cuenta propia.",
        fr: "La ferme est à l'angle de la Calle Argüamul et de la Calle Solana, à Valle San Lorenzo (Arona), à environ 8 minutes de Los Cristianos et de Las Américas. Il n'y a pas de prise en charge à l'hôtel : on s'y rend par ses propres moyens.",
        de: "Die Farm liegt an der Ecke Calle Argüamul und Calle Solana in Valle San Lorenzo (Arona), etwa 8 Minuten von Los Cristianos und Las Américas. Es gibt keine Abholung am Hotel: Man kommt selbst hin." },
      { it: "La guida parla inglese, spagnolo o francese, a seconda del turno. Per seguire la visita in un'altra lingua ci sono le cuffie con l'audio tradotto, anche in italiano: si chiedono arrivando alla finca.",
        en: "The guide speaks English, Spanish or French, depending on the time slot. To follow the visit in another language there are headphones with translated audio: ask for them when you arrive at the farm.",
        es: "El guía habla inglés, español o francés, según el turno. Para seguir la visita en otro idioma hay auriculares con el audio traducido: se piden al llegar a la finca.",
        fr: "Le guide parle anglais, espagnol ou français, selon le créneau. Pour suivre la visite dans une autre langue, il y a des écouteurs avec l'audio traduit : demandez-les en arrivant à la ferme.",
        de: "Der Guide spricht Englisch, Spanisch oder Französisch, je nach Zeitfenster. Um die Führung in einer anderen Sprache zu verfolgen, gibt es Kopfhörer mit übersetztem Audio: Fragen Sie bei Ankunft auf der Farm danach." },
      { it: "Si va in piccoli gruppi.",
        en: "Visits are in small groups.",
        es: "Se va en grupos pequeños.",
        fr: "Les visites se font en petits groupes.",
        de: "Die Führungen sind in kleinen Gruppen." }
    ],
    family: true,
    desc: {
      it: "Un'ora e mezza in una finca di fichi d'India nella valle sopra Los Cristianos. Si cammina fra i cactus e la terra vulcanica con una guida, si vede come si raccolgono e si sbucciano a mano, e alla fine si assaggiano la frutta e i prodotti dell'Higo Tinto, la loro varietà rossa: quella che lascia la lingua colorata. C'è anche un piccolo museo della vita contadina canaria.",
      en: "An hour and a half on a prickly pear farm in the valley above Los Cristianos. You walk among the cactus and the volcanic soil with a guide, see how the fruit is picked and peeled by hand, and at the end taste the fruit and the products of Higo Tinto, their red variety: the one that turns your tongue red. There is also a small museum of Canarian farm life.",
      es: "Una hora y media en una finca de tuneras en el valle sobre Los Cristianos. Se camina entre los cactus y la tierra volcánica con un guía, se ve cómo se recogen y se pelan los tunos a mano, y al final se prueban la fruta y los productos del Higo Tinto, su variedad roja: la que deja la lengua de color. Hay también un pequeño museo de la vida campesina canaria.",
      fr: "Une heure et demie dans une ferme de figues de Barbarie dans la vallée au-dessus de Los Cristianos. On marche entre les cactus et la terre volcanique avec un guide, on voit comment le fruit se cueille et s'épluche à la main, et à la fin on goûte le fruit et les produits de Higo Tinto, leur variété rouge : celle qui vous rougit la langue. Il y a aussi un petit musée de la vie paysanne canarienne.",
      de: "Anderthalb Stunden auf einer Kaktusfeigen-Farm im Tal oberhalb von Los Cristianos. Mit einem Guide geht man zwischen Kakteen und Vulkanerde, sieht, wie die Früchte von Hand gepflückt und geschält werden, und probiert am Ende die Früchte und die Produkte von Higo Tinto, ihrer roten Sorte: die, von der die Zunge rot wird. Es gibt auch ein kleines Museum über das kanarische Landleben."
    },
    // Due foto della finca mandate dal proprietario (6 ottobre 2026), verticali
    // 1536x2048 e ritagliate a 3:2. La principale e' il campo di fichi d'India
    // con la montagna, presa dall'alto per tenere la cima; nella galleria il
    // cartello d'ingresso: il marchio e' quello della finca, cioe' il soggetto.
    // Prima erano arrivate due anteprime da 225x225, scartate.
    image: "finca-tuno.webp",
    gallery: ["finca-tuno-2.webp"],
    published: true
  },
  {
    // Fornitore: Tuk Tuk Sweet Tours S.L. (sweettourstenerife.com), lo stesso
    // operatore della livrea in foto. Fornitore nuovo, quindi la domanda sul
    // ritiro e' stata fatta prima di pubblicare: non passano sotto l'hotel, il
    // ritrovo e' fisso davanti al Wakanda Origen. Per questo la scheda sta in
    // PICKUP_NESSUNO (hotel.js) e il punto e' scritto nelle note. Il loro
    // sistema di prenotazione (FareHarbor) non si usa: le richieste passano
    // dall'ufficio come tutte le altre.
    //
    // Qui ci sono i due giri **in condivisione**, che si pagano a persona. I
    // tre privati si pagano a gruppo e stanno in "tuk-tuk-privato", in fondo al
    // file: due modi di pagare diversi sulla stessa scheda avrebbero messo
    // "da €24" e "da €86 a gruppo" nella stessa riga di prezzo.
    id: "tuk-tuk",
    title: { it: "Tour in tuk tuk", en: "Tuk Tuk Tour", es: "Tour en tuk tuk", fr: "Tuk Tuk Tour", de: "Tuk Tuk Tour" },
    category: "tour-isola",
    zone: "Costa Adeje",
    duration: { it: "1 ora", en: "1 hour", es: "1 hora", fr: "1 heure", de: "1 Stunde" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["breve"],
    // Partenze ogni ora dalle 9 alle 20, uguali per tutti i percorsi in tuk tuk,
    // condivisi e privati (proprietario, 9 ottobre 2026). La pagina del
    // fornitore segna le 9, le 19 e le 20 "Llamar para reservar": vanno bene lo
    // stesso, perche' a chiamare e' l'ufficio quando conferma.
    times: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
    // Il sito del fornitore dice quattro lingue (anche italiano e francese), ma
    // tutte e cinque le pagine di prenotazione ne scrivono due: "Disponible en
    // español, inglés", e fra le cose incluse "Spanish and English guide". Qui
    // si scrive la meno generosa: promettere una guida italiana che quel giorno
    // non c'e' e' peggio che non offrirla. Da confermare con l'ufficio.
    languages: ["Español", "English"],
    // I due percorsi costano uguale, ma il prezzo va scritto **due volte**:
    // sulla scheda e dentro ogni variante. Quando una variante e' scelta — e
    // sulla pagina di dettaglio lo e' sempre, la prima parte gia' premuta — il
    // sito NON ripiega sul prezzo della scheda: e' voluto, se no la cabina VIP
    // di Siam Park mostrerebbe il prezzo del biglietto normale. Senza i numeri
    // dentro le varianti questa scheda diceva "Prezzo: Su richiesta" e il
    // totale non si faceva, con i 24 € scritti due righe piu' su.
    // Quelli qui sotto servono alle richieste che partono senza variante.
    priceFrom: 24,
    priceAdult: 24,
    priceChild: 12,
    // Fasce dalla pagina di prenotazione. Combaciano senza buchi (0-2, 3-10,
    // 11+). Lo zero dei neonati e' scritto dal fornitore ("Gratis"), non
    // dedotto.
    ages: { adult: "11+", child: "3-10", infant: "0-2" },
    priceInfant: 0,
    included: ["guide"],
    notes: [
      {
        it: "Il ritrovo è davanti al ristorante Wakanda Origen, in Avenida de España 10, a Costa Adeje. Il ritiro in hotel non è compreso: al punto di partenza ci si arriva per conto proprio, 10-15 minuti prima della partenza.",
        en: "The meeting point is in front of the Wakanda Origen restaurant, Avenida de España 10, Costa Adeje. Hotel pickup is not included: you reach the departure point on your own, 10-15 minutes before the start.",
        es: "El punto de encuentro es frente al restaurante Wakanda Origen, en Avenida de España 10, Costa Adeje. La recogida en el hotel no está incluida: al punto de salida se llega por cuenta propia, 10-15 minutos antes de la salida.",
        fr: "Le rendez-vous est devant le restaurant Wakanda Origen, Avenida de España 10, Costa Adeje. La prise en charge à l'hôtel n'est pas comprise : on se rend au point de départ par ses propres moyens, 10-15 minutes avant le début.",
        de: "Treffpunkt ist vor dem Restaurant Wakanda Origen, Avenida de España 10, Costa Adeje. Die Abholung am Hotel ist nicht inklusive: Zum Startpunkt kommen Sie selbst, 10-15 Minuten vor Beginn."
      },
      {
        it: "Su ogni tuk tuk salgono al massimo 6 persone, sedute vicine e una di fronte all'altra. I bambini fino a 2 anni non pagano, ma viaggiano in braccio a un adulto con la cintura allacciata: è la regola del fornitore.",
        en: "Each tuk tuk takes up to 6 people, seated close together and facing each other. Children up to 2 years old travel free, but on an adult's lap with the seatbelt fastened: that is the supplier's rule.",
        es: "En cada tuk tuk suben como máximo 6 personas, sentadas juntas y unas frente a otras. Los niños de hasta 2 años no pagan, pero viajan en el regazo de un adulto con el cinturón abrochado: es la norma del proveedor.",
        fr: "Chaque tuk-tuk prend jusqu'à 6 personnes, assises serrées et face à face. Les enfants jusqu'à 2 ans voyagent gratuitement, mais sur les genoux d'un adulte avec la ceinture attachée : c'est la règle du fournisseur.",
        de: "Jedes Tuk-Tuk fasst bis zu 6 Personen, eng sitzend und einander gegenüber. Kinder bis 2 Jahre fahren kostenlos, aber auf dem Schoß eines Erwachsenen mit angelegtem Gurt: So will es der Anbieter."
      },
      {
        it: "Il fornitore consiglia il tuk tuk in privato a chi ha difficoltà a muoversi o ha bisogno di più spazio: i posti restano gli stessi, ma il mezzo è solo del gruppo.",
        en: "The supplier recommends the private tuk tuk for anyone with reduced mobility or who needs more room: the seats are the same, but the vehicle is your group's alone.",
        es: "El proveedor recomienda el tuk tuk en privado a quien tiene dificultades de movilidad o necesita más espacio: las plazas son las mismas, pero el vehículo es solo del grupo.",
        fr: "Le fournisseur conseille le tuk-tuk privé aux personnes à mobilité réduite ou qui ont besoin de plus de place : les sièges sont les mêmes, mais le véhicule est seulement pour votre groupe.",
        de: "Der Anbieter empfiehlt das private Tuk-Tuk für Menschen mit eingeschränkter Mobilität oder wer mehr Platz braucht: Die Sitze sind dieselben, aber das Fahrzeug gehört nur Ihrer Gruppe."
      },
      {
        it: "Porta crema solare e una bottiglia d'acqua.",
        en: "Bring sunscreen and a bottle of water.",
        es: "Lleva crema solar y una botella de agua.",
        fr: "Apportez de la crème solaire et une bouteille d'eau.",
        de: "Bringen Sie Sonnencreme und eine Flasche Wasser mit."
      }
    ],
    // I nomi sono quelli del sito del fornitore e restano uguali nelle tre
    // lingue, come i nomi delle barche: sono quelli che l'ufficio cerca nel
    // sistema quando conferma, e arrivano su WhatsApp scritti cosi'.
    options: {
      label: { it: "Percorso", en: "Route", es: "Ruta", fr: "Parcours", de: "Route" },
      choices: [
        {
          label: "Costa Adeje Tour",
          priceAdult: 24,
          priceChild: 12,
          desc: {
            it: "Il giro dei paesi e delle spiagge del sud: Fañabé, la zona del Duque, la spiaggia della Enramada, La Caleta e Torviscas. Lungo la strada la guida racconta dove si mangia davvero e cosa vale la pena vedere nei giorni che restano.",
            en: "The tour of the southern villages and beaches: Fañabé, the Duque area, La Enramada beach, La Caleta and Torviscas. Along the way the guide tells you where people really eat and what is worth seeing in the days you have left.",
            es: "El recorrido por los pueblos y las playas del sur: Fañabé, la zona del Duque, la playa de La Enramada, La Caleta y Torviscas. Por el camino el guía cuenta dónde se come de verdad y qué merece la pena ver en los días que quedan.",
            fr: "Le tour des villages et des plages du sud : Fañabé, la zone du Duque, la plage de La Enramada, La Caleta et Torviscas. En chemin, le guide vous dit où les gens mangent vraiment et ce qui vaut la peine d'être vu pendant les jours qui vous restent.",
            de: "Die Tour durch die Dörfer und Strände des Südens: Fañabé, das Gebiet um El Duque, der Strand La Enramada, La Caleta und Torviscas. Unterwegs erzählt der Guide, wo die Leute wirklich essen und was sich in den verbleibenden Tagen zu sehen lohnt."
          }
        },
        {
          label: "Secret Volcano Tour",
          priceAdult: 24,
          priceChild: 12,
          desc: {
            it: "Da Puerto Colón si sale alla Caldera del Rey, il monumento naturale sopra Costa Adeje: un vulcano spento, oggi coperto di piantagioni di banane, con La Gomera all'orizzonte. Per strada Torviscas, la marina e Las Américas, e la guida racconta com'è nata l'isola.",
            en: "From Puerto Colón you climb to the Caldera del Rey, the natural monument above Costa Adeje: an extinct volcano, now covered in banana plantations, with La Gomera on the horizon. On the way, Torviscas, the marina and Las Américas, while the guide tells you how the island was born.",
            es: "Desde Puerto Colón se sube a la Caldera del Rey, el monumento natural sobre Costa Adeje: un volcán apagado, hoy cubierto de plataneras, con La Gomera en el horizonte. Por el camino, Torviscas, la marina y Las Américas, mientras el guía cuenta cómo nació la isla.",
            fr: "De Puerto Colón, on monte à la Caldera del Rey, le monument naturel au-dessus de Costa Adeje : un volcan éteint, aujourd'hui couvert de bananeraies, avec La Gomera à l'horizon. En chemin, Torviscas, la marina et Las Américas, pendant que le guide raconte comment l'île est née.",
            de: "Von Puerto Colón geht es hinauf zur Caldera del Rey, dem Naturdenkmal oberhalb von Costa Adeje: ein erloschener Vulkan, heute mit Bananenplantagen bedeckt, mit La Gomera am Horizont. Unterwegs Torviscas, der Jachthafen und Las Américas, während der Guide erzählt, wie die Insel entstanden ist."
          }
        }
      ]
    },
    family: true,
    desc: {
      it: "Un'ora in tuk tuk elettrico sulla costa di Adeje, con una guida che racconta. Due percorsi: quello dei paesi e delle spiagge del sud e quello che sale alla Caldera del Rey, il vulcano spento sopra Costa Adeje. Si va in sei, e c'è anche la versione privata.",
      en: "An hour in an electric tuk tuk along the Adeje coast, with a guide who tells you about it. Two routes: the southern villages and beaches, and the climb to the Caldera del Rey, the extinct volcano above Costa Adeje. Six people go at a time, and there is a private version too.",
      es: "Una hora en tuk tuk eléctrico por la costa de Adeje, con un guía que lo cuenta. Dos recorridos: el de los pueblos y las playas del sur y el que sube a la Caldera del Rey, el volcán apagado sobre Costa Adeje. Se va de seis en seis, y también existe la versión privada.",
      fr: "Une heure en tuk-tuk électrique le long de la côte d'Adeje, avec un guide qui la raconte. Deux parcours : les villages et les plages du sud, et la montée à la Caldera del Rey, le volcan éteint au-dessus de Costa Adeje. On part à six à la fois, et il existe aussi une version privée.",
      de: "Eine Stunde im elektrischen Tuk-Tuk entlang der Küste von Adeje, mit einem Guide, der davon erzählt. Zwei Routen: die Dörfer und Strände des Südens und die Fahrt hinauf zur Caldera del Rey, dem erloschenen Vulkan oberhalb von Costa Adeje. Es fahren sechs auf einmal, und es gibt auch eine private Version."
    },
    // Il rimando alla scheda privata, come sulle barche. Le due frasi sono
    // scritte qui e non prese da i18n.js perche' quelle fisse dicono "vuoi la
    // barca solo per il tuo gruppo?" e "vedi il charter privato": giuste sulle
    // barche, sbagliate su un tuk tuk.
    privateOption: "tuk-tuk-privato",
    privateTitle: {
      it: "Vuoi il tuk tuk solo per il tuo gruppo?",
      en: "Want the tuk tuk just for your group?",
      es: "¿Quieres el tuk tuk solo para tu grupo?",
      fr: "Vous voulez le tuk-tuk rien que pour votre groupe ?",
      de: "Sie möchten das Tuk-Tuk nur für Ihre Gruppe?"
    },
    privateLink: {
      it: "Vedi i giri privati",
      en: "See the private tours",
      es: "Ver los tours privados",
      fr: "Voir les visites privées",
      de: "Die privaten Touren ansehen"
    },
    image: "tuk-tuk.webp",
    // dove ci si presenta: era gia' scritto nei consigli (15 ottobre 2026)
    ritrovo: "Wakanda Origen, Avenida de España 10, Costa Adeje",
    published: true
  },
  {
    id: "trenino-turistico",
    title: { it: "Trenino turistico", en: "Tourist Train", es: "Tren turístico", fr: "Petit train touristique", de: "Touristenbahn" },
    category: "tour-isola",
    zone: "Costa Adeje – Los Cristianos",
    duration: { it: "Tutto il giorno", en: "All day", es: "Todo el día", fr: "Toute la journée", de: "Den ganzen Tag" },
    zoneGroups: ["costa-adeje", "los-cristianos"],
    durationGroups: ["breve"],
    priceFrom: 9,
    fixedPrice: true,
    priceAdult: 9,
    priceChild: 5,
    family: true,
    desc: {
      it: "Trenino su gomma fra Costa Adeje e Los Cristianos: si sale e si scende alle fermate quando si vuole, il biglietto vale tutta la giornata.",
      en: "A road train between Costa Adeje and Los Cristianos: hop on and off at the stops as you like, the ticket lasts all day.",
      es: "Tren sobre ruedas entre Costa Adeje y Los Cristianos: subes y bajas en las paradas cuando quieras, el billete vale todo el día.",
      fr: "Un petit train routier entre Costa Adeje et Los Cristianos : on monte et on descend aux arrêts comme on veut, le billet vaut toute la journée.",
      de: "Eine Straßenbahn zwischen Costa Adeje und Los Cristianos: Ein- und Aussteigen an den Haltestellen nach Belieben, das Ticket gilt den ganzen Tag."
    },
    image: "trenino-turistico.webp",
    // Spento il 12 ottobre 2026 dal proprietario, "al momento". La scheda
    // resta qui, con la foto: per rimetterla basta tornare a true.
    published: false
  },

  // ─── TOUR PRIVATI ─────────────────────────────────────────────────────────
  {
    id: "masca-teide-cabrio-bus",
    title: "Masca + Teide VIP Cabrio Bus",
    category: "tour-privati",
    // Durata dalla pagina del fornitore (Island Excursions), 5 ottobre 2026:
    // "8 horas aprox.". La zona non la scrive: "Tenerife Sud" e il filtro
    // "Teide e nord" come le altre gite al Teide dello stesso fornitore, che
    // raccolgono al sud — e il giro finisce "nel nostro scendere verso sud".
    zone: { it: "Tenerife Sud", en: "South Tenerife", es: "Tenerife sur", fr: "Sud de Tenerife", de: "Süden von Teneriffa" },
    duration: { it: "8 ore circa", en: "About 8 hours", es: "8 horas aprox.", fr: "Environ 8 heures", de: "Etwa 8 Stunden" },
    zoneGroups: ["teide-nord"],
    durationGroups: ["intera"],
    priceFrom: 80,
    fixedPrice: true,
    priceAdult: 80,
    priceChild: 80,
    priceInfant: 0,
    ages: { adult: "14+", child: "3-13", infant: "0-2" },
    itinerary: [
      {
        text: {
          it: "Discesa verso Masca: il borgo in fondo al barranco, fra le palme e le pareti di roccia che scendono fino al mare",
          en: "The road down to Masca: the hamlet at the bottom of the ravine, among the palms and the rock walls that drop to the sea",
          es: "Bajada hacia Masca: el caserío en el fondo del barranco, entre las palmeras y las paredes de roca que caen al mar",
          fr: "La route qui descend à Masca : le hameau au fond du ravin, entre les palmiers et les parois rocheuses qui tombent dans la mer",
          de: "Die Straße hinunter nach Masca: der Weiler am Grund der Schlucht, zwischen Palmen und Felswänden, die ins Meer abfallen"
        }
      },
      {
        text: {
          it: "Parco Nazionale delle Cañadas del Teide, patrimonio Unesco: colate di lava, piante che crescono solo qui e il vulcano più alto della Spagna, 3.718 metri",
          en: "Las Cañadas del Teide National Park, a Unesco site: lava flows, plants that grow nowhere else and the highest volcano in Spain, 3,718 metres",
          es: "Parque Nacional de Las Cañadas del Teide, patrimonio de la Unesco: coladas de lava, plantas que solo crecen aquí y el volcán más alto de España, 3.718 metros",
          fr: "Le parc national de Las Cañadas del Teide, site Unesco : coulées de lave, plantes qui ne poussent nulle part ailleurs et le plus haut volcan d'Espagne, 3 718 mètres",
          de: "Der Nationalpark Las Cañadas del Teide, UNESCO-Stätte: Lavaströme, Pflanzen, die nirgendwo sonst wachsen, und der höchste Vulkan Spaniens, 3.718 Meter"
        }
      },
      {
        text: {
          it: "Nella discesa verso sud, sosta al mirador di Pino Gordo, a Vilaflor, il paese più alto della Spagna",
          en: "On the way back south, a stop at the Pino Gordo viewpoint, in Vilaflor, the highest village in Spain",
          es: "En la bajada hacia el sur, parada en el mirador de Pino Gordo, en Vilaflor, el pueblo más alto de España",
          fr: "Au retour vers le sud, un arrêt au belvédère du Pino Gordo, à Vilaflor, le village le plus haut d'Espagne",
          de: "Auf der Rückfahrt in den Süden ein Stopp am Aussichtspunkt Pino Gordo in Vilaflor, dem höchstgelegenen Dorf Spaniens"
        }
      }
    ],
    notes: [
      {
        it: "La salita in funivia è facoltativa e non è compresa nel prezzo: il biglietto si compra sul posto.",
        en: "Going up by cable car is optional and not included in the price: you buy the ticket there.",
        es: "La subida en teleférico es opcional y no está incluida en el precio: el billete se compra allí.",
        fr: "La montée en téléphérique est facultative et n'est pas comprise dans le prix : le billet s'achète sur place.",
        de: "Die Fahrt mit der Seilbahn ist optional und nicht im Preis inbegriffen: Das Ticket kauft man vor Ort."
      },
      {
        it: "Il pranzo non è compreso nel prezzo.",
        en: "Lunch is not included in the price.",
        es: "La comida no está incluida en el precio.",
        fr: "Le déjeuner n'est pas compris dans le prix.",
        de: "Das Mittagessen ist nicht im Preis inbegriffen."
      },
      {
        it: "Il bus è scoperto e in cima si arriva a oltre 2.000 metri: porta una felpa o una giacca, e cappellino e crema solare per il tratto al sole.",
        en: "The bus is open-top and you get above 2,000 metres up there: bring a sweatshirt or a jacket, plus a hat and sunscreen for the sunny stretch.",
        es: "El bus es descapotable y arriba se pasa de los 2.000 metros: lleva una sudadera o una chaqueta, y gorra y crema solar para el tramo al sol.",
        fr: "Le bus est découvert et là-haut on dépasse les 2 000 mètres : apportez un sweat ou une veste, plus un chapeau et de la crème solaire pour les passages au soleil.",
        de: "Der Bus ist oben offen, und dort oben geht es über 2.000 Meter: Bringen Sie einen Pullover oder eine Jacke mit, dazu Hut und Sonnencreme für die sonnigen Abschnitte."
      }
    ],
    family: true,
    desc: {
      it: "Masca e il Parco Nazionale del Teide a bordo di un bus scoperto: il paesaggio si guarda a 360°, senza un vetro di mezzo.",
      en: "Masca and Teide National Park aboard an open-top bus: you watch the landscape all around you, with no window in the way.",
      es: "Masca y el Parque Nacional del Teide a bordo de un bus descapotable: el paisaje se mira en 360°, sin un cristal de por medio.",
      fr: "Masca et le parc national du Teide à bord d'un bus découvert : vous regardez le paysage tout autour de vous, sans vitre entre les deux.",
      de: "Masca und der Teide-Nationalpark in einem offenen Bus: Sie sehen die Landschaft rundherum, ohne Fensterscheibe dazwischen."
    },
    image: "masca-teide-cabrio-bus.webp",
    published: true
  },
  {
    id: "private-charter",
    title: "Private Charter",
    category: "tour-privati",
    // Dal proprietario, 9 ottobre 2026: sono le stesse barche dei giri
    // condivisi, e partono dagli stessi porti. Quindi il porto dipende dalla
    // barca, e i porti sono quelli delle schede di "Mare e barche".
    zone: {
      it: "Dipende dalla barca: Puerto Colón, Los Cristianos, Los Gigantes o Las Galletas",
      en: "Depends on the boat: Puerto Colón, Los Cristianos, Los Gigantes or Las Galletas",
      es: "Depende del barco: Puerto Colón, Los Cristianos, Los Gigantes o Las Galletas",
      fr: "Selon le bateau : Puerto Colón, Los Cristianos, Los Gigantes ou Las Galletas",
      de: "Je nach Boot: Puerto Colón, Los Cristianos, Los Gigantes oder Las Galletas"
    },
    zoneGroups: ["costa-adeje", "los-cristianos", "los-gigantes"],
    // Dal proprietario, 5 ottobre 2026: 3, 6 o 9 ore. Non sono varianti con un
    // bottone perche' manca il prezzo di ciascuna: priceTiers qui sotto non dice
    // a quale durata si riferisce. Nel filtro: 3 ore e' mezza giornata, 6 e 9
    // giornata intera.
    duration: { it: "3, 6 o 9 ore", en: "3, 6 or 9 hours", es: "3, 6 o 9 horas", fr: "3, 6 ou 9 heures", de: "3, 6 oder 9 Stunden" },
    durationGroups: ["mezza", "intera"],
    priceFrom: 350,
    priceUnit: { it: " a gruppo", en: " per group", es: " por grupo", fr: " par groupe", de: " pro Gruppe" },
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
      es: "Barco reservado solo para tu grupo, con ruta y horarios acordados. El precio es por el barco entero, no por persona.",
      fr: "Un bateau réservé à votre seul groupe, avec le parcours et les horaires convenus avec vous. Le prix est pour tout le bateau, pas par personne.",
      de: "Ein Boot nur für Ihre Gruppe, mit Route und Zeiten nach Absprache. Der Preis gilt für das ganze Boot, nicht pro Person."
    },
    image: "private-charter.webp",
    published: true
  },

  // Schede gemelle delle barche di "Mare e barche" che offrono anche il
  // charter privato: stessa barca, stessa foto, stessi orari, ma prezzo a
  // gruppo "a partire da" invece che a persona. Il prezzo di partenza (350€)
  // e' lo stesso per tutte, anche dove la barca ha gia' un charter a un
  // prezzo diverso (Small Group Catamaran, Opera 60): e' una scelta esplicita
  // del proprietario, il prezzo vero resta sulla scheda della barca.
  {
    id: "whale-dolphin-3h-charter",
    // Galatea (barca piccola, 7 persone al massimo) e Samba sono barche delle
    // 3 ore con un netto del charter tutto loro (proprietario, 29 ottobre
    // 2026): il nome sta qui, cosi' il ticket privato porta la compagnia e
    // prende il suo netto; le altre barche restano col netto del charter
    // "qualunque compagnia".
    nomi: ["Galatea", "Samba"],
    title: { it: "Balene e delfini in barca a vela", en: "Whale & Dolphin Boat Trip", es: "Ballenas y delfines en velero", fr: "Baleines et dauphins en voilier", de: "Wale und Delfine im Segelboot" },
    category: "tour-privati",
    zone: "Puerto Colón",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["mezza"],
    times: ["09:00", "12:00", "15:00", "18:00"],
    priceFrom: 350,
    priceUnit: { it: " a gruppo", en: " per group", es: " por grupo", fr: " par groupe", de: " pro Gruppe" },
    priceAdult: 0,
    priceChild: 0,
    family: true,
    included: ["snorkel", "snack", "drinks", "swimstop"],
    desc: {
      it: "La stessa barca a vela per l'avvistamento di balene e delfini, riservata solo al tuo gruppo, con sosta per lo snorkeling. Il prezzo è per l'intera barca, non a persona.",
      en: "The same sailing boat for whale and dolphin watching, reserved for your group alone, with a snorkelling stop. The price is for the whole boat, not per person.",
      es: "El mismo velero para avistar ballenas y delfines, reservado solo para tu grupo, con parada para hacer snorkel. El precio es por el barco entero, no por persona.",
      fr: "Le même voilier pour l'observation des baleines et des dauphins, réservé à votre seul groupe, avec un arrêt snorkeling. Le prix est pour tout le bateau, pas par personne.",
      de: "Dasselbe Segelboot zur Wal- und Delfinbeobachtung, nur für Ihre Gruppe, mit einem Schnorchelstopp. Der Preis gilt für das ganze Boot, nicht pro Person."
    },
    image: "whale-dolphin-3h.webp",
    published: true
  },
  {
    id: "luxury-catamaran-charter",
    title: { it: "Catamarano di lusso", en: "Luxury Catamaran Experience", es: "Catamarán de lujo", fr: "Catamaran de luxe", de: "Luxus-Katamaran" },
    category: "tour-privati",
    zone: "Puerto Colón",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["mezza"],
    // Stessa barca e stesse partenze della condivisa (proprietario, 9 ottobre 2026).
    times: ["11:00", "14:00", "17:00"],
    priceFrom: 350,
    priceUnit: { it: " a gruppo", en: " per group", es: " por grupo", fr: " par groupe", de: " pro Gruppe" },
    priceAdult: 0,
    priceChild: 0,
    family: true,
    included: ["fingerfood", "drinks", "swimstop"],
    desc: {
      it: "Lo stesso catamarano di categoria superiore, riservato solo al tuo gruppo, con aree lounge e avvistamento di delfini e balene. Il prezzo è per l'intera barca, non a persona.",
      en: "The same upscale catamaran, reserved for your group alone, with lounge areas and dolphin and whale watching. The price is for the whole boat, not per person.",
      es: "El mismo catamarán de categoría superior, reservado solo para tu grupo, con zonas lounge y avistamiento de delfines y ballenas. El precio es por el barco entero, no por persona.",
      fr: "Le même catamaran haut de gamme, réservé à votre seul groupe, avec espaces de détente et observation des dauphins et des baleines. Le prix est pour tout le bateau, pas par personne.",
      de: "Derselbe gehobene Katamaran, nur für Ihre Gruppe, mit Lounge-Bereichen und Delfin- und Walbeobachtung. Der Preis gilt für das ganze Boot, nicht pro Person."
    },
    image: "luxury-catamaran.webp",
    published: true
  },
  {
    id: "small-group-catamaran-charter",
    title: { it: "Catamarano per piccoli gruppi", en: "Small Group Catamaran", es: "Catamarán para grupos pequeños", fr: "Catamaran en petit groupe", de: "Katamaran für kleine Gruppen" },
    category: "tour-privati",
    zone: "Puerto Colón",
    duration: { it: "3 o 6 ore", en: "3 or 6 hours", es: "3 o 6 horas", fr: "3 ou 6 heures", de: "3 oder 6 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["mezza", "intera"],
    // Stesse partenze del giro condiviso (proprietario, 9 ottobre 2026).
    times: ["09:30", "12:30"],
    // Il prezzo vero, come la Luxury Cruiser gemella (proprietario, 17 ottobre
    // 2026): €690 per tre ore, il doppio per sei.
    priceFrom: 690,
    priceUnit: { it: " a gruppo", en: " per group", es: " por grupo", fr: " par groupe", de: " pro Gruppe" },
    priceAdult: 0,
    priceChild: 0,
    family: true,
    // Due varianti come sulla scheda condivisa: tre e sei ore hanno prezzo e
    // netto diversi, e il ticket deve dire quale (17 ottobre 2026).
    options: {
      label: { it: "Durata", en: "Duration", es: "Duración", fr: "Durée", de: "Dauer" },
      choices: [
        {
          label: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
          price: 690,
          duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" }
        },
        {
          label: { it: "6 ore", en: "6 hours", es: "6 horas", fr: "6 heures", de: "6 Stunden" },
          price: 1380,
          duration: { it: "6 ore", en: "6 hours", es: "6 horas", fr: "6 heures", de: "6 Stunden" }
        }
      ]
    },
    included: ["lunch", "drinks", "swimstop", "snorkel", "guide"],
    desc: {
      it: "Lo stesso catamarano fino a 23 persone, tutto per il tuo gruppo, per tre o sei ore lungo la costa con sosta bagno, snorkeling e paella di pollo a bordo. Il prezzo è per l'intera barca, non a persona.",
      en: "The same catamaran that takes up to 23 people, all to yourselves, for three or six hours along the coast with a swim stop, snorkelling and chicken paella on board. The price is for the whole boat, not per person.",
      es: "El mismo catamarán que lleva hasta 23 personas, todo para tu grupo, durante tres o seis horas por la costa con parada de baño, snorkel y paella de pollo a bordo. El precio es por el barco entero, no por persona.",
      fr: "Le même catamaran qui accueille jusqu'à 23 personnes, rien que pour vous, pendant trois ou six heures le long de la côte avec arrêt baignade, snorkeling et paella au poulet à bord. Le prix est pour tout le bateau, pas par personne.",
      de: "Derselbe Katamaran für bis zu 23 Personen, ganz für Sie, drei oder sechs Stunden entlang der Küste mit Badestopp, Schnorcheln und Hähnchen-Paella an Bord. Der Preis gilt für das ganze Boot, nicht pro Person."
    },
    image: "small-group-catamaran.webp",
    published: true
  },
  {
    id: "opera-60-charter",
    // Il nome della barca non sta nel titolo (proprietario, 28 ottobre 2026):
    // il cliente legge che giro e', nella sua lingua. Sta in `nomi`, per i
    // venditori e i ticket.
    title: { it: "Gommone veloce e snorkeling", en: "Speedboat & Snorkel Trip", es: "Lancha rápida y snorkel", fr: "Bateau rapide et snorkeling", de: "Schnellboot- und Schnorcheltour" },
    category: "tour-privati",
    zone: "Puerto Colón",
    duration: { it: "Da 3 a 9 ore", en: "3 to 9 hours", es: "De 3 a 9 horas", fr: "De 3 à 9 heures", de: "3 bis 9 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["mezza", "intera"],
    times: ["10:00", "13:30"],
    priceFrom: 350,
    priceUnit: { it: " a gruppo", en: " per group", es: " por grupo", fr: " par groupe", de: " pro Gruppe" },
    priceAdult: 0,
    priceChild: 0,
    family: true,
    included: ["swimstop", "snorkel", "drinks", "guide"],
    desc: {
      it: "Lo stesso gommone rigido di diciotto metri, riservato al tuo gruppo, da tre a nove ore lungo la costa sud-ovest, con snorkeling, cibo e bevande a bordo. Il prezzo è per l'intera barca, non a persona.",
      en: "The same eighteen-metre rigid inflatable, reserved for your group, from three to nine hours along the south-west coast, with snorkelling, food and drinks on board. The price is for the whole boat, not per person.",
      es: "La misma neumática rígida de dieciocho metros, reservada para tu grupo, de tres a nueve horas por la costa suroeste, con snorkel, comida y bebida a bordo. El precio es por el barco entero, no por persona.",
      fr: "Le même semi-rigide de dix-huit mètres, réservé à votre groupe, de trois à neuf heures le long de la côte sud-ouest, avec snorkeling, nourriture et boissons à bord. Le prix est pour tout le bateau, pas par personne.",
      de: "Dasselbe achtzehn Meter lange Festrumpfschlauchboot, nur für Ihre Gruppe, drei bis neun Stunden entlang der Südwestküste, mit Schnorcheln, Essen und Getränken an Bord. Der Preis gilt für das ganze Boot, nicht pro Person."
    },
    image: "opera-60.webp",
    published: true
  },
  {
    id: "skyline-cruiser-charter",
    // Il nome della barca non sta nel titolo (proprietario, 28 ottobre 2026):
    // il cliente legge che giro e', nella sua lingua. Sta in `nomi`, per i
    // venditori e i ticket.
    title: { it: "Motoryacht con i delfini", en: "Motor Yacht Dolphin Trip", es: "Yate a motor con delfines", fr: "Yacht à moteur à la rencontre des dauphins", de: "Motorjacht-Delfintour" },
    category: "tour-privati",
    zone: "Puerto Colón",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["mezza"],
    times: ["09:45", "13:15", "16:20"],
    priceFrom: 350,
    priceUnit: { it: " a gruppo", en: " per group", es: " por grupo", fr: " par groupe", de: " pro Gruppe" },
    priceAdult: 0,
    priceChild: 0,
    family: true,
    included: ["swimstop", "snorkel", "fingerfood", "drinks", "towels"],
    desc: {
      it: "Lo stesso motoryacht Fairline di quasi 13 metri, riservato al tuo gruppo, con capitano ed equipaggio, snack e bevande comprese. Il prezzo è per l'intera barca, non a persona.",
      en: "The same Fairline motor yacht, just under 13 metres, reserved for your group, with captain and crew, snacks and drinks included. The price is for the whole boat, not per person.",
      es: "El mismo yate a motor Fairline, de casi 13 metros, reservado para tu grupo, con capitán y tripulación, aperitivos y bebidas incluidas. El precio es por el barco entero, no por persona.",
      fr: "Le même yacht à moteur Fairline, d'un peu moins de 13 mètres, réservé à votre groupe, avec capitaine et équipage, en-cas et boissons compris. Le prix est pour tout le bateau, pas par personne.",
      de: "Dieselbe Fairline-Motorjacht, knapp 13 Meter lang, nur für Ihre Gruppe, mit Kapitän und Crew, Snacks und Getränke inklusive. Der Preis gilt für das ganze Boot, nicht pro Person."
    },
    image: "skyline-cruiser.jpg",
    published: true
  },
  {
    id: "luxury-cruiser-charter",
    title: { it: "Yacht di lusso", en: "Luxury Cruiser Experience", es: "Yate de lujo", fr: "Yacht de luxe", de: "Luxusyacht" },
    category: "tour-privati",
    zone: "Las Galletas",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
    zoneGroups: ["los-cristianos"],
    durationGroups: ["mezza"],
    // La barca e' tutta del gruppo: l'ora si concorda, non si sceglie fra le
    // tre partenze del giro in condivisione.
    times: [],
    // Qui il prezzo e' quello vero, non i €350 uguali per tutte le altre schede
    // gemelle: il proprietario ha chiesto apposta di scrivere il prezzo vero,
    // perche' lo sappiamo. Dal 17 ottobre 2026 €550, il ritiro €5 a persona. Un
    // "da €350" letto dal cliente e poi corretto a €450 dall'ufficio sarebbe
    // un prezzo alzato dopo, che e' la cosa da non fare mai.
    priceFrom: 550,
    priceUnit: { it: " a gruppo", en: " per group", es: " por grupo", fr: " par groupe", de: " pro Gruppe" },
    priceAdult: 0,
    priceChild: 0,
    family: true,
    included: ["swimstop", "snack", "drinks", "guide"],
    transfer: {
      it: "Ritiro dagli hotel del sud dell'isola, circa 30 minuti prima della partenza: €5 in più a persona.",
      en: "Pick-up from hotels in the south of the island, about 30 minutes before departure: €5 extra per person.",
      es: "Recogida en los hoteles del sur de la isla, unos 30 minutos antes de la salida: 5 € más por persona.",
      fr: "Prise en charge aux hôtels du sud de l'île, environ 30 minutes avant le départ : €5 de plus par personne.",
      de: "Abholung an den Hotels im Süden der Insel, etwa 30 Minuten vor der Abfahrt: €5 mehr pro Person."
    },
    desc: {
      it: "Lo stesso cruiser a due ponti, riservato solo al tuo gruppo per tre ore sulla costa sud, con sosta bagno, spuntino e bevande a bordo. Il prezzo è per l'intera barca, non a persona.",
      en: "The same two-deck cruiser, reserved for your group alone for three hours on the south coast, with a swim stop, a snack and drinks on board. The price is for the whole boat, not per person.",
      es: "El mismo crucero de dos cubiertas, reservado solo para tu grupo durante tres horas por la costa sur, con parada de baño, tentempié y bebidas a bordo. El precio es por el barco entero, no por persona.",
      fr: "Le même bateau à deux ponts, réservé à votre seul groupe pendant trois heures sur la côte sud, avec arrêt baignade, en-cas et boissons à bord. Le prix est pour tout le bateau, pas par personne.",
      de: "Dasselbe Boot mit zwei Decks, nur für Ihre Gruppe, drei Stunden an der Südküste, mit Badestopp, Snack und Getränken an Bord. Der Preis gilt für das ganze Boot, nicht pro Person."
    },
    image: "luxury-cruiser.webp",
    gallery: ["luxury-cruiser-2.webp", "luxury-cruiser-3.webp", "luxury-cruiser-4.webp"],
    published: true
  },

  // La gemella privata del tuk tuk, come le gemelle delle barche qui sopra:
  // stessa foto, stesso fornitore (Tuk Tuk Sweet Tours), stesso ritrovo, ma il
  // prezzo e' del mezzo e non della persona. Sta su una scheda sua e non fra le
  // varianti di "tuk-tuk" perche' li' convivrebbero due modi di pagare diversi:
  // la riga del prezzo dell'elenco puo' dire "da €24" **oppure** "da €86 a
  // gruppo", non tutti e due, e `priceUnit` vale per la scheda intera.
  {
    id: "tuk-tuk-privato",
    title: { it: "Tuk tuk privato", en: "Private Tuk Tuk Tour", es: "Tuk tuk privado", fr: "Tuk Tuk Tour privé", de: "Private Tuk Tuk Tour" },
    category: "tour-privati",
    zone: "Costa Adeje",
    duration: { it: "1 o 2 ore", en: "1 or 2 hours", es: "1 o 2 horas", fr: "1 ou 2 heures", de: "1 oder 2 Stunden" },
    zoneGroups: ["costa-adeje"],
    durationGroups: ["breve"],
    // Partenze ogni ora dalle 9 alle 20, uguali per tutti i percorsi in tuk tuk,
    // condivisi e privati (proprietario, 9 ottobre 2026). La pagina del
    // fornitore segna le 9, le 19 e le 20 "Llamar para reservar": vanno bene lo
    // stesso, perche' a chiamare e' l'ufficio quando conferma.
    times: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
    languages: ["Español", "English"],
    priceFrom: 86,
    priceUnit: { it: " a gruppo", en: " per group", es: " por grupo", fr: " par groupe", de: " pro Gruppe" },
    // A gruppo, quindi niente prezzi a persona: il totale automatico non si fa,
    // che e' giusto — il prezzo cambia con quanti sono, e moltiplicarlo per le
    // persone darebbe un numero falso (vedi prezziAPersona() in escursioni.js).
    priceAdult: 0,
    priceChild: 0,
    family: true,
    included: ["guide"],
    notes: [
      {
        it: "Il ritrovo è davanti al ristorante Wakanda Origen, in Avenida de España 10, a Costa Adeje. Il ritiro in hotel non è compreso: al punto di partenza ci si arriva per conto proprio, 10-15 minuti prima della partenza.",
        en: "The meeting point is in front of the Wakanda Origen restaurant, Avenida de España 10, Costa Adeje. Hotel pickup is not included: you reach the departure point on your own, 10-15 minutes before the start.",
        es: "El punto de encuentro es frente al restaurante Wakanda Origen, en Avenida de España 10, Costa Adeje. La recogida en el hotel no está incluida: al punto de salida se llega por cuenta propia, 10-15 minutos antes de la salida.",
        fr: "Le rendez-vous est devant le restaurant Wakanda Origen, Avenida de España 10, Costa Adeje. La prise en charge à l'hôtel n'est pas comprise : on se rend au point de départ par ses propres moyens, 10-15 minutes avant le début.",
        de: "Treffpunkt ist vor dem Restaurant Wakanda Origen, Avenida de España 10, Costa Adeje. Die Abholung am Hotel ist nicht inklusive: Zum Startpunkt kommen Sie selbst, 10-15 Minuten vor Beginn."
      },
      {
        it: "Il tuk tuk ha 6 posti, vicini e uno di fronte all'altro: il prezzo vale per tutto il mezzo, fino a 6 persone. I bambini fino a 2 anni viaggiano in braccio a un adulto con la cintura allacciata.",
        en: "The tuk tuk has 6 seats, close together and facing each other: the price is for the whole vehicle, up to 6 people. Children up to 2 years old travel on an adult's lap with the seatbelt fastened.",
        es: "El tuk tuk tiene 6 plazas, juntas y unas frente a otras: el precio es por el vehículo entero, hasta 6 personas. Los niños de hasta 2 años viajan en el regazo de un adulto con el cinturón abrochado.",
        fr: "Le tuk-tuk a 6 places, serrées et face à face : le prix est pour tout le véhicule, jusqu'à 6 personnes. Les enfants jusqu'à 2 ans voyagent sur les genoux d'un adulte avec la ceinture attachée.",
        de: "Das Tuk-Tuk hat 6 Plätze, eng und einander gegenüber: Der Preis gilt für das ganze Fahrzeug, bis zu 6 Personen. Kinder bis 2 Jahre fahren auf dem Schoß eines Erwachsenen mit angelegtem Gurt."
      },
      {
        it: "Porta crema solare e una bottiglia d'acqua.",
        en: "Bring sunscreen and a bottle of water.",
        es: "Lleva crema solar y una botella de agua.",
        fr: "Apportez de la crème solaire et une bouteille d'eau.",
        de: "Bringen Sie Sonnencreme und eine Flasche Wasser mit."
      }
    ],
    // I due scaglioni (fino a 3 e fino a 6 persone) stanno nella descrizione
    // della variante e non in `priceTiers`: quello e' della scheda intera e qui
    // i tre tour hanno scaglioni diversi: scritto sulla scheda, il Double
    // Private mostrerebbe 86 e 128 invece dei suoi 136 e 198. E non diventano
    // sei bottoni (il tour per lo scaglione, come sulla Mustang) perche' quanti
    // sono il cliente lo scrive gia' nella richiesta: un secondo numero,
    // scelto a parte, potrebbe contraddire il primo.
    options: {
      label: { it: "Percorso", en: "Route", es: "Ruta", fr: "Parcours", de: "Route" },
      choices: [
        {
          label: "Costa Adeje Private Tour",
          price: 86,
          duration: { it: "1 ora", en: "1 hour", es: "1 hora", fr: "1 heure", de: "1 Stunde" },
          desc: {
            it: "86 € per un gruppo fino a 3 persone, 128 € fino a 6. Il giro dei paesi e delle spiagge del sud — Fañabé, la zona del Duque, la Enramada, La Caleta, Torviscas — con il tuk tuk solo per voi.",
            en: "€86 for a group of up to 3, €128 up to 6. The tour of the southern villages and beaches — Fañabé, the Duque area, La Enramada, La Caleta, Torviscas — with the tuk tuk to yourselves.",
            es: "86 € para un grupo de hasta 3 personas, 128 € hasta 6. El recorrido por los pueblos y las playas del sur — Fañabé, la zona del Duque, La Enramada, La Caleta, Torviscas — con el tuk tuk solo para vosotros.",
            fr: "€86 pour un groupe jusqu'à 3, €128 jusqu'à 6. Le tour des villages et des plages du sud — Fañabé, la zone du Duque, La Enramada, La Caleta, Torviscas — avec le tuk-tuk rien que pour vous.",
            de: "€86 für eine Gruppe bis 3, €128 bis 6. Die Tour durch die Dörfer und Strände des Südens — Fañabé, das Gebiet um El Duque, La Enramada, La Caleta, Torviscas — mit dem Tuk-Tuk ganz für Sie."
          }
        },
        {
          label: "Secret Volcano Private Tour",
          price: 86,
          duration: { it: "1 ora", en: "1 hour", es: "1 hora", fr: "1 heure", de: "1 Stunde" },
          desc: {
            it: "86 € per un gruppo fino a 3 persone, 128 € fino a 6. La salita alla Caldera del Rey, il vulcano spento coperto di piantagioni di banane sopra Costa Adeje, con il tuk tuk solo per voi.",
            en: "€86 for a group of up to 3, €128 up to 6. The climb to the Caldera del Rey, the extinct volcano covered in banana plantations above Costa Adeje, with the tuk tuk to yourselves.",
            es: "86 € para un grupo de hasta 3 personas, 128 € hasta 6. La subida a la Caldera del Rey, el volcán apagado cubierto de plataneras sobre Costa Adeje, con el tuk tuk solo para vosotros.",
            fr: "€86 pour un groupe jusqu'à 3, €128 jusqu'à 6. La montée à la Caldera del Rey, le volcan éteint couvert de bananeraies au-dessus de Costa Adeje, avec le tuk-tuk rien que pour vous.",
            de: "€86 für eine Gruppe bis 3, €128 bis 6. Die Fahrt hinauf zur Caldera del Rey, dem erloschenen, mit Bananen bedeckten Vulkan oberhalb von Costa Adeje, mit dem Tuk-Tuk ganz für Sie."
          }
        },
        {
          label: "Double Private Tour",
          price: 136,
          duration: { it: "2 ore", en: "2 hours", es: "2 horas", fr: "2 heures", de: "2 Stunden" },
          desc: {
            it: "136 € per un gruppo fino a 3 persone, 198 € fino a 6. Due ore, i due percorsi in uno: prima la salita alla Caldera del Rey, poi tutta la costa fino a La Caleta.",
            en: "€136 for a group of up to 3, €198 up to 6. Two hours, the two routes in one: first the climb to the Caldera del Rey, then the whole coast down to La Caleta.",
            es: "136 € para un grupo de hasta 3 personas, 198 € hasta 6. Dos horas, los dos recorridos en uno: primero la subida a la Caldera del Rey, después toda la costa hasta La Caleta.",
            fr: "€136 pour un groupe jusqu'à 3, €198 jusqu'à 6. Deux heures, les deux parcours en un : d'abord la montée à la Caldera del Rey, puis toute la côte jusqu'à La Caleta.",
            de: "€136 für eine Gruppe bis 3, €198 bis 6. Zwei Stunden, beide Routen in einer: erst hinauf zur Caldera del Rey, dann die ganze Küste bis La Caleta."
          }
        }
      ]
    },
    desc: {
      it: "Il tuk tuk elettrico solo per il tuo gruppo, fino a 6 persone: gli stessi due percorsi del giro in condivisione, oppure i due insieme in due ore. Il prezzo è del mezzo e non a persona, e cambia con quanti siete.",
      en: "The electric tuk tuk for your group alone, up to 6 people: the same two routes as the shared ride, or both together over two hours. The price is for the vehicle and not per person, and it changes with how many you are.",
      es: "El tuk tuk eléctrico solo para tu grupo, hasta 6 personas: los mismos dos recorridos que la salida compartida, o los dos juntos en dos horas. El precio es del vehículo y no por persona, y cambia según cuántos seáis.",
      fr: "Le tuk-tuk électrique pour votre seul groupe, jusqu'à 6 personnes : les deux mêmes parcours que la sortie partagée, ou les deux ensemble en deux heures. Le prix est pour le véhicule et non par personne, et il change selon votre nombre.",
      de: "Das elektrische Tuk-Tuk nur für Ihre Gruppe, bis zu 6 Personen: dieselben zwei Routen wie die geteilte Fahrt, oder beide zusammen in zwei Stunden. Der Preis gilt für das Fahrzeug und nicht pro Person und ändert sich damit, wie viele Sie sind."
    },
    image: "tuk-tuk.webp",
    // dove ci si presenta: era gia' scritto nei consigli (15 ottobre 2026)
    ritrovo: "Wakanda Origen, Avenida de España 10, Costa Adeje",
    published: true
  },
  // ─── I noleggi, solo per i venditori ───────────────────────────────────────
  // Il cliente i noleggi li vede nella pagina Noleggio (noleggio.js), non qui.
  // Queste due voci servono al ticket di carta: il venditore sceglie
  // "Noleggio auto", la compagnia (Alis…) e il ticket prende il suo netto.
  // Non pubblicate, con `venditori: true` (proprietario, 14 ottobre 2026).
  // Il titolo ha tutte le lingue perche' il cliente lo legge in "Le mie
  // prenotazioni", quando cerca il suo ticket.
  {
    id: "noleggio-auto",
    title: { it: "Noleggio auto", en: "Car rental", es: "Alquiler de coches", fr: "Location de voiture", de: "Mietwagen" },
    // Il rent a car come lo scrivono i venditori sul ticket. Roca ("Roca
    // auto") dai fogli dei venditori del 14-18 ottobre 2026.
    // Mateo Bello e' un rent a car anche lui (proprietario, 29 ottobre 2026).
    nomi: ["Alis", "Roca", "Mateo Bello"],
    category: "noleggi",
    venditori: true,
    published: false
  },
  {
    id: "noleggio-moto",
    title: { it: "Noleggio moto e scooter", en: "Motorbike and scooter rental", es: "Alquiler de motos y scooters", fr: "Location de motos et scooters", de: "Motorrad- und Rollervermietung" },
    category: "noleggi",
    venditori: true,
    published: false
  },
  {
    // Gli scooter elettrici di MRB, a parte da moto e scooter a benzina
    // (proprietario, 15 ottobre 2026). Sul ticket "MRB SCOOTER". Rydhere e
    // Sol Mobility vanno qui (proprietario, 19 ottobre 2026).
    id: "noleggio-scooter-elettrico",
    title: { it: "Noleggio scooter elettrico", en: "Electric scooter rental", es: "Alquiler de patinete eléctrico", fr: "Location de trottinette électrique", de: "E-Scooter-Verleih" },
    nomi: ["MRB", "Rydhere", "Sol Mobility"],
    category: "noleggi",
    venditori: true,
    published: false
  },
  {
    // Le bici a noleggio di Fevi (proprietario, 17 ottobre 2026). Isla tiene
    // l'acconto, il resto il cliente lo paga a Fevi: il netto e' il totale
    // meno l'acconto (net_from_deposit su Supabase).
    id: "noleggio-bici",
    title: { it: "Noleggio bici", en: "Bike rental", es: "Alquiler de bicicletas", fr: "Location de vélos", de: "Fahrradverleih" },
    nomi: ["Fevi"],
    category: "noleggi",
    venditori: true,
    published: false
  },
  // ─── La funivia del Teide, solo per i venditori ────────────────────────────
  // Un biglietto che i venditori vendono (sul ticket "CABLE"), ma non una
  // scheda per il cliente: per ora solo nel modulo (proprietario, 15 ottobre
  // 2026). Il netto sta su Supabase, come gli altri.
  {
    id: "funivia-teide",
    title: { it: "Funivia del Teide", en: "Teide Cable Car", es: "Teleférico del Teide", fr: "Téléphérique du Teide", de: "Teide-Seilbahn" },
    category: "teide-natura",
    venditori: true,
    published: false
  },
];

// La data di oggi come "2026-09-07". Si confrontano le stringhe, non due
// oggetti Date: cosi' non c'e' nessun fuso orario di mezzo e "fino al 31"
// vale per tutto il 31. La usa anche escursioni.js.
function dataOggiISO() {
  const d = new Date();
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
}

// QUANDO L'OFFERTA SCADE, IL PREZZO TORNA AL LISTINO
//
// Sta qui, e non nel codice che disegna le pagine, per un motivo preciso: il
// prezzo scontato non e' solo una scritta, entra nel totale della richiesta e
// nel messaggio WhatsApp. Se la scadenza la gestisse solo la grafica, dal 1
// novembre la card direbbe 45 e il preventivo continuerebbe a fare 39: un
// numero falso mandato in ufficio.
//
// Questo file si carica per primo su tutte le pagine, quindi correggere qui il
// catalogo una volta sola sistema tutto quello che viene dopo, senza che
// nessuna delle altre funzioni debba sapere che le offerte esistono.
//
// Tolto `priceList`, la scheda diventa indistinguibile da una senza offerta:
// e' cosi' che il barrato e la pillola spariscono da soli.
(function applicaScadenzaOfferte() {
  const oggi = dataOggiISO();
  ESPLORA_CATALOG.forEach(t => {
    if (typeof t.priceList !== "number" || !t.offerUntil) return;
    if (t.offerUntil >= oggi) return;
    if (t.priceFrom !== null && t.priceFrom !== undefined) t.priceFrom = t.priceList;
    if (t.priceAdult > 0) t.priceAdult = t.priceList;
    delete t.priceList;
    delete t.offerUntil;
  });
})();

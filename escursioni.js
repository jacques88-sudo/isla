// Pagina "Tutte le escursioni": legge ESPLORA_CATALOG e CATEGORIES da
// esplora-catalog.js, filtra per categoria/testo e disegna le schede.
//
// I testi passano da i18n.js: t() per quelli fissi, tf() per i campi del
// catalogo che possono essere scritti nelle cinque lingue.
//
// WHATSAPP_NUMBER sta in esplora-catalog.js: serve anche all'assistente, che
// gira sulla home dove questo file non e' caricato.

// Zona e durata non ancora decise valgono "Da definire": e' un segnaposto per
// noi, non un'informazione per il cliente. Due pillole "Da definire" affiancate
// sulla stessa scheda sembrano un errore del sito, quindi non si mostrano.
// La usa anche tour.js.
function daDefinire(valore) {
  if (!valore) return true;
  if (typeof valore === "string") return false;
  return /Da definire/.test(valore.it || "");
}

// I giorni in cui l'attivita' si fa, come numeri di getDay() (0 = domenica).
// Prima quelli della variante scelta, se ne ha di suoi, poi quelli della
// scheda. Lista vuota vuol dire "nessuna limitazione": si fa tutti i giorni.
// La usa anche tour.js.
function giorniDi(tour, variante) {
  const sigle = (variante && variante.days) || tour.days || [];
  return sigle.map(sigla => GIORNI_SIGLE[sigla])
              .filter(n => n !== undefined);
}

// "Lun · Mer · Ven", nella lingua del sito.
function giorniTesto(numeri) {
  return numeri.map(n => t(GIORNI_CHIAVI[n])).join(" · ");
}

// L'unità di misura del prezzo, già staccata come va staccata: quella che
// inizia con "/" si attacca al numero ("da €100/ora"), le altre vogliono uno
// spazio davanti ("da €190 a barca"). Vuota quando il prezzo è a persona,
// che è il caso normale. La usa anche tour.js.
function priceUnitSuffix(tour) {
  if (!tour.priceUnit) return "";
  const unita = tf(tour.priceUnit);
  return (unita.startsWith("/") ? "" : " ") + unita;
}

// Il testo che l'utente scrive non arriva mai qui, ma le descrizioni le
// scriviamo noi a mano: se una contiene < o & la pagina non deve rompersi.
// La usano anche tour.js e lista.js.
function esc(testo) {
  return String(testo)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// La copia piccola di una foto (larga al massimo 720 px, in assets/piccole/,
// la fa foto-piccole.py): per le foto che in pagina restano larghe al massimo
// 350 px, le schede dell'elenco, le miniature, le "altre esperienze". La foto
// intera pesa due o tre volte tanto e li' non si vedrebbe la differenza.
// La usa anche tour.js.
function fotoPiccola(nome) {
  return "./assets/piccole/" + encodeURIComponent(nome);
}

function tourPrice(tour) {
  if (tour.priceFrom === null) return t("tour.onRequest");
  return t("tour.from", { p: eur(tour.priceFrom) }) + priceUnitSuffix(tour);
}

// "2026-12-31" scritto come lo legge un cliente, nella sua lingua.
function dataLeggibile(iso) {
  const pezzi = String(iso).split("-").map(Number);
  const [anno, mese, giorno] = pezzi;
  if (pezzi.length !== 3 || pezzi.some(n => !n)) return String(iso);
  // new Date(anno, mese - 1, giorno) e non new Date("2026-12-31"): la stringa
  // ISO viene letta come mezzanotte UTC, e per un cliente a ovest di
  // Greenwich diventerebbe il giorno prima. Coi pezzi separati e' locale.
  const d = new Date(anno, mese - 1, giorno);
  const locali = { it: "it-IT", en: "en-GB", es: "es-ES", fr: "fr-FR", de: "de-DE" };
  try {
    return d.toLocaleDateString(locali[getLang()] || "en-GB",
      { day: "numeric", month: "long", year: "numeric" });
  } catch (e) {
    return giorno + "/" + mese + "/" + anno;
  }
}

// L'OFFERTA A TEMPO
//
// `priceList` e' il prezzo di listino, quello barrato; il prezzo che si paga
// resta `priceFrom`/`priceAdult`. Sono due numeri separati apposta: il totale
// della richiesta si fa col prezzo vero, e un'offerta non puo' sbagliare un
// conto.
//
// La SCADENZA non si controlla qui: la applica esplora-catalog.js appena si
// carica, togliendo `priceList` e alzando il prezzo al listino. Quando si
// arriva a questa funzione un'offerta scaduta non esiste piu'. Il controllo
// sulla data resta comunque, perche' costa niente ed e' l'unica rete se un
// giorno qualcuno usasse il catalogo senza quel passaggio.
//
// Due condizioni: il listino c'e', ed e' piu' ALTO del prezzo che si paga (se
// no non e' uno sconto, e mostrarlo sarebbe una bugia al contrario).
function offertaAttiva(tour, prezzoPagato) {
  const pieno = tour.priceList;
  const paga = prezzoPagato === undefined ? tour.priceFrom : prezzoPagato;
  if (typeof pieno !== "number" || typeof paga !== "number") return false;
  if (!(pieno > paga)) return false;
  if (tour.offerUntil && tour.offerUntil < dataOggiISO()) return false;
  return true;
}

// Il prezzo della card, in HTML, col barrato davanti quando l'offerta e'
// viva. Sta separata da tourPrice() perche' quella finisce dentro esc() in
// tre punti (le card "altre esperienze", il rimando alla privata, la lista
// delle richieste): se restituisse dei tag, li' si vedrebbero scritti.
function tourPriceHTML(tour) {
  const testo = esc(tourPrice(tour));
  if (!offertaAttiva(tour)) return testo;
  return '<s class="price-before">€' + esc(eur(tour.priceList)) + "</s> " + testo;
}

function categoryName(id) {
  const cat = CATEGORIES.find(c => c.id === id);
  return cat ? tf(cat.name) : id;
}

// Una data in "2026-10-19", letta **in ora locale**.
//
// `toISOString()` passa per UTC, e a Tenerife d'estate siamo a UTC+1: chi
// apriva la finestra fra mezzanotte e l'una si prendeva la data di ieri, e il
// minimo del campo diventava **oggi** invece di domani — cioè un buco nelle 24
// ore di preavviso, che sono la regola di Isla. Stretto (un'ora al giorno per
// metà dell'anno) ma vero, e in vacanza alle 00:30 si prenota.
//
// È lo stesso inciampo che giornoValido() ha già schivato a modo suo:
// new Date("2026-09-12") lo tratta come UTC e in certi fusi torna indietro di
// un giorno. Qui si leggono i pezzi della data locale e si scrivono a mano.
function dataLocale(d) {
  const mese = String(d.getMonth() + 1).padStart(2, "0");
  const giorno = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + mese + "-" + giorno;
}

// Adesso a Tenerife, come se l'orologio di Tenerife segnasse l'ora UTC: si
// confronta con Date.UTC(anno, mese, giorno, ore, minuti) di una partenza. Le
// partenze sono ore di Tenerife, e chi prenota da casa ha un altro fuso: da New
// York il vecchio conto lasciava passare una partenza con 20 ore di anticipo.
function adessoTenerife() {
  const p = {};
  new Intl.DateTimeFormat("en-US", {
    timeZone: "Atlantic/Canary", hourCycle: "h23", year: "numeric", month: "numeric",
    day: "numeric", hour: "numeric", minute: "numeric", second: "numeric"
  }).formatToParts(new Date()).forEach(x => { p[x.type] = Number(x.value); });
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
}

// Data minima richiedibile: domani a Tenerife, cioè almeno 24 ore di preavviso.
// Restituisce il formato AAAA-MM-GG che <input type="date"> si aspetta.
function minRequestDate() {
  return new Date(adessoTenerife() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// Le 24 ore vere (proprietario, 19 ottobre 2026): una partenza si puo'
// chiedere solo se mancano almeno 24 ore. Prima bastava che fosse domani, e
// alle 22:30 si chiedeva il buggy delle 8:20 del mattino dopo. L'ora e' la
// prima scritta ("08:20", o l'inizio della fascia "09:00 - 10:00"); senza ora
// (charter, "Da concordare") si conta fino alla fine di quel giorno.
function partenzaPossibile(iso, ora) {
  if (!iso) return false;
  const [a, m, g] = iso.split("-").map(Number);
  const hm = /(\d{1,2}):(\d{2})/.exec(ora || "");
  const quando = hm ? Date.UTC(a, m - 1, g, Number(hm[1]), Number(hm[2]))
                    : Date.UTC(a, m - 1, g, 23, 59);
  return quando - adessoTenerife() >= 24 * 60 * 60 * 1000;
}

// Le ore fra cui si sceglie su una scheda (o sulla sua variante): quelle vere,
// le fasce segnaposto se non le sappiamo, nessuna sul charter (`times: []`).
function orariDi(tour, scelta) {
  const veri = (scelta && scelta.times) || (tour && tour.times);
  return veri || (typeof ORARI_PREDEFINITI !== "undefined" ? ORARI_PREDEFINITI : []);
}

// Una partenza che c'e' solo in un periodo dell'anno (`timesSeason`). Senza un
// giorno scelto non si puo' ancora dire, e si lascia. Il periodo puo' scavalcare
// Capodanno: ["12-01", "02-28"].
function orarioInStagione(tour, scelta, ora, iso) {
  const stagioni = (scelta && scelta.timesSeason) || (tour && tour.timesSeason);
  const periodo = stagioni && stagioni[ora];
  if (!periodo || !iso) return true;
  const giorno = iso.slice(5);
  const [da, a] = periodo;
  return da <= a ? giorno >= da && giorno <= a : giorno >= da || giorno <= a;
}

// Un giorno si puo' chiedere se almeno una sua partenza c'e', ed e' fra 24 ore o piu'.
function giornoPossibile(tour, scelta, iso) {
  const orari = orariDi(tour, scelta);
  if (!orari.length) return partenzaPossibile(iso, "");
  return orari.some(ora => orarioInStagione(tour, scelta, ora, iso) && partenzaPossibile(iso, ora));
}

// Oltre un anno avanti è quasi sempre un errore di digitazione
function maxRequestDate() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return dataLocale(d);
}

// "2026-08-23" → "23/08/2026", più leggibile nel messaggio
function formatDate(iso) {
  const [y, m, g] = iso.split("-");
  return g + "/" + m + "/" + y;
}

// "2 adulti e 1 bambino", oppure "2 adulti, 1 bambino e 1 neonato". Con tre
// pezzi l'ultimo si attacca con la "e" e gli altri con la virgola: tre "e" di
// fila non le scrive nessuno.
function peopleText(adults, kids, babies) {
  const parti = [adults + " " + t(adults === 1 ? "wa.adult" : "wa.adults")];
  if (kids > 0) parti.push(kids + " " + t(kids === 1 ? "wa.child" : "wa.children"));
  if (babies > 0) parti.push(babies + " " + t(babies === 1 ? "wa.baby" : "wa.babies"));
  const ultimo = parti.pop();
  return parti.length ? parti.join(", ") + " " + t("wa.and") + " " + ultimo : ultimo;
}

// "Singola × 3 · Doppia × 1": quanti mezzi, di che tipo. Solo dove il prezzo e'
// del mezzo e non della persona (`units`). Il "×" e il punto in mezzo sono gli
// stessi dei menu, e per lo stesso motivo: evitano i plurali, che in cinque lingue
// non si fanno allo stesso modo.
//
// Dalla finestra arrivano i numeri (`units` come elenco), dalla lista il
// riepilogo gia' scritto (`units` come testo), com'e' gia' per la variante e
// per la lingua: quello che il cliente ha scelto allora si riscrive uguale.
function unitaTesto(tour, req) {
  if (typeof req.units === "string") return req.units;
  if (!tour.units || !Array.isArray(req.units)) return "";
  const tipi = Array.isArray(tour.units.types) ? tour.units.types : [];
  // il nome si rilegge dal catalogo per posizione, cosi' una voce salvata in
  // italiano si legge in inglese se il cliente cambia lingua; quello salvato
  // nella voce resta come ripiego
  return req.units
    .map((u, i) => ({ n: u.n, label: tipi[i] ? tf(tipi[i].name) : u.label }))
    .filter(u => u.n > 0)
    .map(u => u.label + " × " + u.n)
    .join(" · ");
}

// I prezzi a testa da usare per il totale, oppure null quando il totale non si
// puo' fare. Moltiplicare per le persone un prezzo che **non e' a persona**
// (a barca, all'ora, a scaglioni di gruppo) darebbe un numero sbagliato, e un
// numero sbagliato scritto nero su bianco e' peggio di nessun numero.
// La variante scelta, come oggetto del catalogo invece che come testo.
function varianteDi(tour, etichetta) {
  if (!etichetta || !tour.options || !Array.isArray(tour.options.choices)) return null;
  return tour.options.choices.find(s => tf(s.label) === etichetta) || null;
}

// La variante di una richiesta, ritrovata nel catalogo. **Per posizione** se
// c'e' (`optionIndex`, che le voci della lista salvano apposta), se no cercando
// l'etichetta. La lista salva anche il testo di allora, ma quel testo e' nella
// lingua di allora: cambiando lingua non lo si ritrova piu' nel catalogo, e con
// la variante sparivano i suoi prezzi — il totale di una moto d'acqua salvata
// in italiano spariva passando all'inglese. La posizione non cambia mai.
function varianteScelta(tour, req) {
  const scelte = tour.options && Array.isArray(tour.options.choices)
    ? tour.options.choices : null;
  if (!scelte) return null;
  if (typeof req.optionIndex === "number" && scelte[req.optionIndex]) {
    return scelte[req.optionIndex];
  }
  return varianteDi(tour, req.option);
}

// Il transfer e il punto di ritrovo della variante scelta, se la variante li
// dice, altrimenti quelli della scheda: come `days` e `times`, la variante
// vince (Freebird: il transfer c'e' sui giri di 3 e 4 ore e mezza, non su
// quello di 2; 15 ottobre 2026). `variante` puo' essere null.
function transferDi(tour, variante) {
  if (!tour) return null;
  return variante && Object.prototype.hasOwnProperty.call(variante, "transfer")
    ? variante.transfer : (tour.transfer || null);
}

function ritrovoDi(tour, variante) {
  if (!tour) return null;
  return variante && Object.prototype.hasOwnProperty.call(variante, "ritrovo")
    ? variante.ritrovo : (tour.ritrovo || null);
}

// Il cliente sara' preso in hotel? Su una scheda di PICKUP_NESSUNO solo se la
// variante ha il transfer e lui l'ha chiesto; su tutte le altre si'.
function conRitiro(tour, variante, transferChiesto) {
  if (!tour) return false;
  const nessuno = typeof PICKUP_NESSUNO !== "undefined" && PICKUP_NESSUNO.indexOf(tour.id) !== -1;
  return !nessuno || !!(transferDi(tour, variante) && transferChiesto);
}

// Solo per adulti: la scheda ha solo la fascia degli adulti e parte da 13 anni
// o piu' ("16+", "18+"), senza nessuna fascia per bambini o neonati. Una scheda
// con "12+" e senza bambini non conta: lì i bambini di solito ci sono e il
// prezzo manca, non e' vietato. Lo legge la finestra della richiesta per
// togliere il campo dei bambini.
// La ricerca: devono esserci tutte le parole, in qualunque ordine e senza
// guardare gli accenti. Prima si cercava la frase intera, e "barca delfini" dava
// zero risultati mentre "barca" ne dava 18.
function cercaParole(testo, ricerca) {
  const senzaAccenti = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const dove = senzaAccenti(testo);
  return senzaAccenti(ricerca).split(/\s+/).filter(Boolean).every(parola => dove.includes(parola));
}

// "Bambini (4-11)": la fascia d'eta' fra parentesi, quando il fornitore l'ha
// detta. tf() perche' "0-3" si scrive uguale dappertutto, "0-11 mesi" no.
function conEta(etichetta, fascia) {
  return fascia ? etichetta + " (" + tf(fascia) + ")" : etichetta;
}

function soloAdulti(tour) {
  const eta = tour && tour.ages;
  if (!eta || eta.child || eta.infant || typeof eta.adult !== "string") return false;
  const m = eta.adult.match(/^(\d+)\+$/);
  return !!m && Number(m[1]) >= 13;
}

// Il cliente ha chiesto un transfer? Il Siam Park ne ha due, da Nord
// (`transfer`) e da Los Gigantes (`transferSiam`), e tutti e due portano il
// pulmino sotto l'hotel (19 ottobre 2026). Vale per una richiesta o una voce
// della lista, che hanno tutte e due i campi.
function transferChiesto(req) {
  return !!(req && (req.transfer || req.transferSiam));
}

// Il punto di ritrovo da mostrare, o null: c'e' solo dove nessuno passa a
// prendere il cliente, cioe' senza transfer o col transfer non spuntato.
function ritrovoDaMostrare(tour, variante, transferChiesto) {
  const r = ritrovoDi(tour, variante);
  if (!r) return null;
  if (transferDi(tour, variante) && transferChiesto) return null;
  if (!transferDi(tour, variante) && conRitiro(tour, variante, false)) return null;
  return r;
}

function prezziAPersona(tour, req) {
  if (tour.priceUnit) return null;
  if (Array.isArray(tour.priceTiers) && tour.priceTiers.length) return null;

  // Il prezzo di partenza: quello della variante scelta se ce l'ha (il giro di
  // 2 ore costa €30 e quello di 4 ore e mezza €62), altrimenti quello della
  // scheda. Conta solo `priceAdult` sulla variante, **non** il suo `price`:
  // `price` e' il numero da scrivere sul bottone e puo' essere il prezzo del
  // mezzo invece che della persona (il jet ski si paga a moto d'acqua, non a
  // testa), e moltiplicarlo per le persone darebbe il doppio. La coppia
  // priceAdult/priceChild invece dice a chiare lettere che quella variante si
  // paga a persona. Bambino a 0 vuol dire "non lo sappiamo ancora" per quella
  // variante (il tutto compreso di Siam Park non ha ancora un prezzo bambini):
  // resta 0 e piu' sotto non gli si somma niente, se no un "non lo sappiamo"
  // diventerebbe un numero verosimile ma falso.
  // Se una variante e' scelta, conta solo il suo prezzo: una variante col
  // `price` ma senza `priceAdult` (una cabina VIP, il jet ski a moto d'acqua)
  // e' apposta non a persona, e cadere sul prezzo della scheda darebbe un
  // totale falso (la cabina VIP di Siam Park mostrerebbe il prezzo del
  // biglietto normale). Il ripiego sulla scheda vale solo senza variante.
  const variante = varianteScelta(tour, req);
  const base = variante
    ? (variante.priceAdult > 0 ? { adulto: variante.priceAdult, bambino: variante.priceChild || 0 } : null)
    : (tour.priceAdult > 0 ? { adulto: tour.priceAdult, bambino: tour.priceChild || 0 } : null);
  if (!base) return null;
  // I neonati stanno solo sulla scheda, non sulla variante: il catalogo non ha
  // un prezzo neonati per variante. `undefined` non e' zero — vuol dire che di
  // quella scheda non sappiamo niente sui neonati, e piu' sotto il totale si
  // rifiuta di farsi invece di contarli gratis.
  base.neonato = tour.priceInfant;

  // Col transfer il listino e' un altro: per il Twin Ticket €78 diventano €99.
  // Il listino in catalogo e' quello **completo** (biglietto+transfer) ma
  // riferito al biglietto base della scheda; qui si ricava il supplemento e lo
  // si somma al prezzo di partenza, cosi' il conto resta giusto anche quando
  // la variante scelta costa piu' (o meno) del biglietto base, come il tutto
  // compreso di Siam Park.
  const supplemento = tp => {
    if (!tp || !(tp.adult > 0)) return null;
    return {
      adulto: tp.adult - (tour.priceAdult || 0),
      bambino: tp.child ? tp.child - (tour.priceChild || 0) : 0
    };
  };
  // Il posto sul pullman per i neonati, quando il fornitore lo fa pagare. A
  // differenza di adulti e bambini `tp.baby` e' gia' il prezzo **completo** del
  // neonato col transfer (senza transfer quel posto non esiste), quindi
  // sostituisce `priceInfant` invece di sommarcisi. La prima scheda che ce
  // l'ha e' Castillo San Miguel (11 €, ottobre 2026).
  const neonatoColTransfer = tp => (tp && tp.baby !== undefined) ? tp.baby : undefined;
  // Il secondo transfer, una seconda zona di partenza: stessa logica, listino
  // diverso. I due checkbox si escludono a vicenda nella finestra, quindi qui
  // non serve gestire il caso in cui sono spuntati tutti e due.
  // Col transfer ma senza il suo prezzo (Scandal: "prezzo su richiesta") il
  // totale non si fa: senza questa riga il transfer risultava gratis e il
  // totale piu' basso del vero.
  if (req.transfer && tour.transferPriceUnknown) return null;
  const tp = req.transfer ? tour.transferPrice
    : req.transferSiam ? tour.transferSiamPrice
    : null;
  const s = supplemento(tp);
  if (!s) return base;
  const baby = neonatoColTransfer(tp);
  return {
    adulto: base.adulto + s.adulto,
    bambino: base.bambino > 0 ? base.bambino + s.bambino : 0,
    neonato: baby !== undefined ? baby : base.neonato
  };
}

// I menu speciali del gruppo, scritti per l'ufficio: "1 Vegetariano · 1 Menu
// standard". Una tendina sola non bastava: in una coppia uno puo' mangiare
// standard e l'altro vegetariano, quindi si conta **quante** persone per ogni
// menu, non quale menu ha scelto la prenotazione.
//
// Chi non chiede niente di speciale non produce nessuna riga. Chi ne chiede,
// si porta dietro anche il resto del gruppo scritto come standard: cosi'
// l'ufficio legge "1 vegetariano e 1 standard" invece di dover sottrarre da
// solo il numero di persone.
function menuTesto(req, tour) {
  // Dalla lista arrivano i numeri di ogni menu (`menuN`, per posizione): i
  // nomi si rileggono dal catalogo nella lingua di adesso, come per i mezzi.
  // Prima la lista salvava solo la frase gia' scritta, e un cliente francese
  // mandava all'ufficio "Menu: Végétarien × 1" in un messaggio in italiano
  // (terza prova da cliente, 19 ottobre 2026).
  let menus = req.menus;
  if (Array.isArray(req.menuN) && tour && Array.isArray(tour.menus)) {
    menus = req.menuN.map((n, i) => ({ label: tf(tour.menus[i] || ""), n: n }));
  } else if (typeof req.menu === "string") {
    // Le voci salvate prima, con la sola frase: senza questa riga la
    // richiesta partita dalla lista perdeva per strada "1 Vegetariano", che
    // nella lista si vedeva. Un vegano che sparisce e' un vegano che l'ufficio
    // non legge.
    return req.menu;
  }
  const scelti = (menus || []).filter(m => m.n > 0);
  if (!scelti.length) return "";
  // "Vegetariano × 2" e non "2 Vegetariano": il "×" e' gia' il modo in cui il
  // sito scrive le quantita' nel totale, e soprattutto evita i plurali. Le
  // etichette dei menu le scrive il catalogo in cinque lingue, e nessuna delle
  // tre fa il plurale allo stesso modo: "2 Vegetariano" sarebbe sbagliato in
  // italiano, e inventare una regola per pluralizzarle sarebbe peggio.
  const parti = scelti.map(m => m.label + " × " + m.n);
  const restanti = (req.adults + req.kids) - scelti.reduce((tot, m) => tot + m.n, 0);
  if (restanti > 0) parti.push(t("req.menuStandard") + " × " + restanti);
  return parti.join(" · ");
}

// "Singola €180 · Doppia €200": i prezzi di **tutti** i tipi di mezzo di una
// variante, non solo del primo. Sul bottone della durata e nella riga "Prezzo"
// c'era il solo `price` della variante, che e' il piu' basso: sul jet ski era
// quello della singola, e chi voleva la doppia doveva aprire la finestra della
// richiesta per scoprire quanto costa. Vuota dove i mezzi non si contano: li'
// il prezzo e' uno solo e lo scrive chi chiama. La usa `tour.js` in tutti e due
// i posti dove quel prezzo si vede, cosi' non possono dire due cose diverse.
function prezziVarianteTesto(tour, variante) {
  const tipi = (tour.units && Array.isArray(tour.units.types)) ? tour.units.types : [];
  const prezzi = (variante && variante.unitPrices) || tour.unitPrices;
  if (!tipi.length || !prezzi) return "";
  return tipi
    .filter(tipo => prezzi[tipo.key])
    .map(tipo => tf(tipo.name) + " €" + eur(prezzi[tipo.key]))
    .join(" · ");
}

// Il conto quando si paga il mezzo e non la persona: tante moto d'acqua per
// il loro prezzo, piu' il ritiro che pure e' a moto. I prezzi dei tipi stanno
// nella variante scelta (`unitPrices`), perche' cambiano con la durata; una
// scheda senza varianti puo' averli su di se'.
//
// Torna null appena un pezzo manca — un tipo contato senza prezzo, o il ritiro
// chiesto senza sapere quanto costa — invece di dare un totale che sembra buono
// e non lo e'. E' la stessa regola dei bambini senza prezzo qui sotto.
function totaleMezzi(tour, req) {
  const mezzi = tour.units;
  if (!mezzi || !Array.isArray(req.units) || !req.units.length) return null;
  const tipi = Array.isArray(mezzi.types) ? mezzi.types : [];
  const variante = varianteScelta(tour, req);
  const prezzi = (variante && variante.unitPrices) || tour.unitPrices;
  if (!prezzi) return null;

  let totale = 0;
  let quanti = 0;
  let manca = false;
  const pezzi = [];
  req.units.forEach((scelto, i) => {
    if (!scelto.n) return;
    const chiave = tipi[i] && tipi[i].key;
    const prezzo = chiave ? prezzi[chiave] : undefined;
    if (!prezzo) { manca = true; return; }
    totale += prezzo * scelto.n;
    quanti += scelto.n;
    // Prima il tipo, poi quanti: "4 posti: 1 × €240". Col numero davanti
    // usciva "1 4 posti × €240", due numeri attaccati (seconda prova da
    // cliente, 19 ottobre 2026), e sulla Mustang "1 Con 1 o 2 persone".
    // Il nome si rilegge dal catalogo per posizione, come in unitaTesto(): una
    // voce entrata nella lista in italiano scrive "4 seats" se il cliente poi
    // passa all'inglese. Quello salvato nella voce resta come ripiego.
    const nome = tipi[i] ? tf(tipi[i].name) : scelto.label;
    pezzi.push(nome + ": " + scelto.n + " × €" + eur(prezzo));
  });
  if (manca || !quanti) return null;

  if (req.transfer) {
    // Tre stati, come `priceInfant`: assente vuol dire che il supplemento non
    // lo sappiamo, e un totale senza sarebbe piu' basso di quello vero; zero
    // vuol dire compreso, ed e' un numero vero, quindi il conto si fa lo stesso
    // e non compare nessuna riga (un "× €0" fa solo chiedere che cos'e').
    if (mezzi.transferPrice === undefined) return null;
    if (mezzi.transferPrice) {
      totale += mezzi.transferPrice * quanti;
      // stesso nome della casella e della riga del messaggio: nel dettaglio del
      // conto "Transfer" accanto a "Ritiro in hotel" sembrerebbero due cose
      pezzi.push((tour.transferLabel ? tf(tour.transferLabel) : t("wa.transfer")) +
        ": " + quanti + " × €" + eur(mezzi.transferPrice));
    }
  }
  return { totale: totale, dettaglio: pezzi.join(" + ") };
}

// Il totale e il conto da cui viene, oppure null quando non si puo' fare.
// Lo usano sia la finestra (che lo mostra) sia il messaggio (che lo scrive):
// un conto solo, cosi' i due numeri non possono diventare diversi.
function calcolaTotale(tour, req) {
  // Dove si contano i mezzi le persone non entrano nel conto: o torna il conto
  // delle moto o non torna niente, senza ripiegare sul prezzo a persona che su
  // queste schede non esiste.
  if (tour.units) return totaleMezzi(tour, req);
  const p = prezziAPersona(tour, req);
  // Bambini senza il loro prezzo: il totale verrebbe fuori come se non
  // pagassero. Meglio niente che un numero falso.
  if (!p || req.adults < 1 || (req.kids > 0 && !p.bambino)) return null;
  // Stessa regola per i neonati: se il cliente ne porta uno ma di quella scheda
  // non sappiamo se e quanto pagano (`priceInfant` assente), il totale non si
  // fa. Zero invece e' un numero vero, vuol dire gratis, e va bene.
  const neonati = req.babies || 0;
  if (neonati > 0 && p.neonato === undefined) return null;

  const pezzi = [req.adults + " " + t(req.adults === 1 ? "wa.adult" : "wa.adults") + " × €" + eur(p.adulto)];
  if (req.kids > 0) {
    pezzi.push(req.kids + " " + t(req.kids === 1 ? "wa.child" : "wa.children") + " × €" + eur(p.bambino));
  }
  // I neonati gratis si contano fra le persone ma non nel dettaglio del conto:
  // "1 neonato × €0" e' una riga che non aggiunge niente al totale e sembra un
  // errore. Che ci siano si legge gia' nella riga delle persone.
  if (neonati > 0 && p.neonato > 0) {
    pezzi.push(neonati + " " + t(neonati === 1 ? "wa.baby" : "wa.babies") + " × €" + eur(p.neonato));
  }
  return {
    totale: req.adults * p.adulto + req.kids * p.bambino + neonati * (p.neonato || 0),
    dettaglio: pezzi.join(" + ")
  };
}

// Le righe che descrivono una richiesta: data, orario, persone, variante,
// transfer, totale, note. Il nome dell'attivita' non c'e': lo scrive chi
// chiama, perche' nel messaggio singolo e' una riga puntata e nella lista e'
// un titolo numerato.
//
// Le usano tutti e due i messaggi, quello per una sola escursione e quello per
// la lista intera: cosi' l'ufficio legge sempre le stesse cose nello stesso
// ordine, invece di due formati da imparare.
// La casella dell'hotel vive dentro la finestra della richiesta, che esiste
// solo su escursioni.html e tour.html: altrove non c'e' e va letta a vuoto
// senza rompere niente.
function hotelInputValue() {
  const el = document.getElementById("reqHotel");
  return el ? el.value.trim() : "";
}

// L'hotel si ricorda, il resto no.
//
// Per tutta la vacanza il cliente sta nello stesso hotel: fra 562 nomi, farglielo
// ribattere a ogni escursione e' l'unica domanda della finestra la cui risposta
// **non cambia mai**. La data cambia, le persone possono cambiare, l'hotel no.
//
// Resta nel browser suo, come la scelta della lingua e come la lista delle
// richieste, e da lì non va da nessuna parte: nel sito non c'e' una sola
// chiamata di rete che mandi qualcosa a qualcuno. Il messaggio parte quando il
// cliente preme il pulsante, e lo scrive lui su WhatsApp.
//
// Il nome della persona **non** si ricorda, e non e' una dimenticanza: l'hotel
// e' un dato della vacanza, il nome e' un dato della persona. Se il telefono
// gira di mano — e in vacanza gira — il secondo e' quello che non deve restare
// scritto in giro.
const HOTEL_KEY = "isla-hotel";

function hotelRicordato() {
  // localStorage puo' non esserci (navigazione in incognito su certi browser):
  // stessa guardia di i18n.js e lista.js, e senza memoria il campo resta vuoto
  // come prima.
  try { return localStorage.getItem(HOTEL_KEY) || ""; } catch (e) { return ""; }
}

function ricordaHotel(nome) {
  // **Il campo vuoto non cancella il ricordo.** Sulle schede senza ritiro
  // mostraPunto() svuota la casella di proposito: se questo salvasse anche il
  // vuoto, aprire una di quelle schede farebbe dimenticare l'hotel scritto
  // mezz'ora prima.
  if (!nome) return;
  try { localStorage.setItem(HOTEL_KEY, nome); } catch (e) { /* modalità privata */ }
}

// "Cleopatra" e "CLEOPATRA" e "cleopatra" devono valere uguale, e "Sueño" si
// deve trovare scrivendo "sueno": chi e' in vacanza non va a cercare la enne
// con lo scarabocchio sulla tastiera del telefono.
function hotelChiave(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// I 433 hotel filtrati mentre il cliente scrive.
//
// **Si cerca solo dall'inizio di una parola.** La lista del browser cercava il
// pezzo di testo ovunque dentro il nome, e scrivendo "cl" proponeva
// "Apartamentos el Ancla": tecnicamente giusto, illeggibile per chi guarda.
// Chi cerca il suo albergo ne scrive l'inizio, non una sillaba di mezzo.
//
// Prima quelli che cominciano col testo scritto ("cle" → Cleopatra), poi
// quelli dove il testo comincia una parola qualsiasi ("mar" → Club la Mar).
function hotelCerca(testo, quanti) {
  const q = hotelChiave(testo.trim());
  if (q.length < 2 || typeof HOTELS === "undefined") return [];
  const primi = [], secondi = [];
  for (const [nome] of HOTELS) {
    const k = hotelChiave(nome);
    if (k.startsWith(q)) primi.push(nome);
    // il confine di parola: uno spazio, una parentesi, un trattino
    else if (new RegExp("[\\s(\\-/]" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(k)) secondi.push(nome);
    if (primi.length >= quanti) break;
  }
  return primi.concat(secondi).slice(0, quanti);
}

// Il punto di raccolta di un hotel, pronto da mostrare.
//
// Tre risposte diverse, e la differenza conta:
//   "hotel"  → si sale davanti al proprio albergo (punto 0, oppure il punto si
//              chiama come l'hotel: RIU Arecas che sale a "RIU Arecas")
//   "punto"  → si va da un'altra parte, e va detto: e' la meta' dei casi, e
//              spesso e' una fermata dell'autobus pubblico a due strade
//   null     → l'hotel non e' nell'elenco, oppure del suo punto non sappiamo il
//              nome (sono quelli del nord). Non si mostra niente: meglio il
//              silenzio di un'indicazione a meta'.
function hotelPunto(nomeHotel, idScheda, conTransfer) {
  if (typeof HOTELS === "undefined" || typeof PICKUP_POINTS === "undefined") return null;
  // Dove il ritiro non esiste non c'e' nessun punto da mostrare: le tabelle
  // sono di un altro fornitore e la fermata che ne uscirebbe manderebbe il
  // cliente ad aspettare dove non passa nessuno (PICKUP_NESSUNO in hotel.js).
  // Sta qui in cima e non solo nella finestra perche' la stessa funzione scrive
  // anche la riga del messaggio WhatsApp, e una richiesta rimasta nella lista
  // da ieri porta ancora scritto l'hotel.
  // `conTransfer`: il cliente ha spuntato "Vuoi il transfer?" su una variante
  // che ce l'ha (Freebird, buggy): li' il pulmino passa sotto l'hotel anche se
  // la scheda sta in PICKUP_NESSUNO.
  const nessuno = idScheda && typeof PICKUP_NESSUNO !== "undefined"
      && PICKUP_NESSUNO.indexOf(idScheda) !== -1;
  if (nessuno && !conTransfer) return null;
  const k = hotelChiave(nomeHotel.trim());
  if (!k) return null;
  const riga = HOTELS.find(h => hotelChiave(h[0]) === k);
  if (!riga) return null;
  // L'ora dipende dall'escursione, il punto no: senza la scheda si mostra il
  // posto e basta, che e' sempre meglio di un orario indovinato.
  const ore = (typeof PICKUP_TIMES !== "undefined" && idScheda) ? PICKUP_TIMES[idScheda] : null;
  // Su certe escursioni il pulmino passa sotto l'hotel qualunque sia il punto
  // della tabella: e' un altro fornitore, che fa un altro giro (PICKUP_IN_HOTEL
  // in hotel.js). Va guardato **prima** del punto, se no il cliente andrebbe a
  // una fermata dove quel giorno non si ferma nessuno. Solo per gli hotel che
  // conosciamo: per questo sta dopo il controllo qui sopra.
  if (nessuno || (idScheda && typeof PICKUP_IN_HOTEL !== "undefined"
      && PICKUP_IN_HOTEL.indexOf(idScheda) !== -1)) {
    return { dove: "hotel", ora: (ore && ore[riga[1]]) || "" };
  }
  if (riga[1] === 0) return { dove: "hotel" };
  // Gruppi di hotel vicinissimi che il fornitore scrive come un punto solo,
  // ma dove il pulmino passa porta per porta (PUNTI_PORTA_A_PORTA in hotel.js):
  // "il tuo hotel", con l'ora del gruppo.
  if (typeof PUNTI_PORTA_A_PORTA !== "undefined"
      && PUNTI_PORTA_A_PORTA.indexOf(riga[1]) !== -1) {
    return { dove: "hotel", ora: (ore && ore[riga[1]]) || "" };
  }
  const punto = PICKUP_POINTS[riga[1]];
  if (!punto) return null;
  // il tipo si traduce, il nome del posto no: e' un nome proprio, e chi lo
  // deve chiedere per strada lo chiede cosi' com'e'
  const tipo = punto[1] ? t("pickup." + punto[1]) : "";
  // L'ora torna a parte e non attaccata al posto: la scrive il campo "A che
  // ora", che su queste schede non e' piu' una domanda ma una risposta.
  const ora = (ore && ore[riga[1]]) || "";
  const nome = punto[0] + (tipo ? ", " + tipo : "");
  // Il punto si chiama come l'hotel, ma **non e' la stessa cosa**: al Granada
  // Park si sale al posteggio dei taxi in fondo alla discesa, al Bahia del
  // Duque alla sbarra. Dire "passiamo in hotel" manderebbe il cliente ad
  // aspettare davanti alla reception. Senza tipo invece e' davvero l'hotel.
  // il punto e' proprio l'hotel, e senza un tipo vuol dire davanti alla porta
  if (hotelChiave(punto[0]) === k && !tipo) return { dove: "hotel", ora: ora };
  return { dove: "punto", nome: nome, ora: ora };
}

// Il campo con i suggerimenti, scritto a mano invece di usare <datalist>.
//
// Il <datalist> lo disegna il browser, e su Android diventa un pannellone
// scuro che copre mezzo schermo, nasconde quello che stai scrivendo e non si
// puo' ne' colorare ne' accorciare. Questa lista sta dentro la finestra, ha i
// colori del sito, e mostra otto nomi per volta invece di cento.
//
// Resta una **casella di testo**, non un menu obbligato: chi sta in un
// appartamento privato che nell'elenco non c'e' scrive lo stesso il suo
// indirizzo, e la riga sotto glielo dice.
const HOTEL_QUANTI = 8;

// La scheda aperta nella finestra. Serve al campo dell'hotel per sapere di
// quale escursione mostrare l'orario, e vive qui fuori perche' initHotelField()
// e initRequestDialog() sono due funzioni separate.
let SCHEDA_APERTA = null;
// La variante premuta sulla pagina quando la finestra si e' aperta: il
// transfer e il punto di ritrovo possono cambiare da una all'altra.
let VARIANTE_APERTA = null;

function initHotelField() {
  const campo = document.querySelector("[data-hotel-field]");
  const input = document.getElementById("reqHotel");
  const lista = document.getElementById("reqHotelList");
  if (!campo || !input || !lista) return;
  // L'etichetta non ha un data-attributo suo: si trova dal `for`, che e'
  // l'unica cosa che le due copie della finestra hanno per forza uguale.
  const etichettaCampo = document.querySelector('label[for="reqHotel"]');

  const puntoEl = document.querySelector("[data-hotel-punto]");
  const oraFissaEl = document.querySelector("[data-request-time-fixed]");
  const timeLabel = document.querySelector("[data-request-time-label]");
  const etichettaEl = document.querySelector("[data-hotel-punto-et]");
  const valoreEl = document.querySelector("[data-hotel-punto-val]");
  const aiutoEl = document.querySelector("[data-hotel-hint]");
  let scelto = -1;

  function chiudi() {
    lista.hidden = true;
    lista.innerHTML = "";
    scelto = -1;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
  }

  function evidenzia(i) {
    const voci = lista.children;
    if (!voci.length) return;
    scelto = (i + voci.length) % voci.length;
    for (let n = 0; n < voci.length; n++) {
      const attivo = n === scelto;
      voci[n].classList.toggle("is-on", attivo);
      voci[n].setAttribute("aria-selected", attivo ? "true" : "false");
    }
    input.setAttribute("aria-activedescendant", voci[scelto].id);
    voci[scelto].scrollIntoView({ block: "nearest" });
  }

  function prendi(nome) {
    input.value = nome;
    // Scelto dall'elenco: e' un hotel vero, non tre lettere a meta'. Si
    // ricorda qui e non a ogni tasto battuto, se no la prossima volta il campo
    // si riapriva con "bah" dentro.
    ricordaHotel(nome);
    chiudi();
    mostraPunto();
    input.focus();
  }

  // Dove passa il pulmino, scritto sotto la casella appena si riconosce
  // l'hotel. Prende il posto della riga di aiuto: sono due cose che dicono la
  // stessa cosa, e una volta che l'hotel c'e' quella generica non serve piu'.
  // Dove non si passa a prendere nessuno la domanda non si fa proprio: "dove
  // alloggi" serve solo a dire dove si sale, e su queste schede si sale in un
  // posto solo, scritto nelle note. Chiederlo lo stesso vorrebbe dire promettere
  // un ritiro che non c'e' — la riga di aiuto dice "dove passiamo a prenderti" —
  // e far scrivere al cliente un dato che nessuno usera'.
  // Su Freebird e buggy la domanda compare solo col transfer spuntato.
  function transferSpuntato() {
    const casella = document.getElementById("reqTransfer");
    const seconda = document.getElementById("reqTransferSiam");
    const spuntato = (casella && casella.checked) ||
      (seconda && seconda.checked && SCHEDA_APERTA && SCHEDA_APERTA.transferSiam);
    return !!(spuntato && transferDi(SCHEDA_APERTA, VARIANTE_APERTA));
  }

  function senzaRitiro() {
    return !!SCHEDA_APERTA && !conRitiro(SCHEDA_APERTA, VARIANTE_APERTA, transferSpuntato());
  }

  function mostraPunto() {
    if (!puntoEl) return;
    const spento = senzaRitiro();
    if (etichettaCampo) etichettaCampo.hidden = spento;
    campo.hidden = spento;
    // Svuotare non e' una finezza: la finestra e' una sola per tutte le
    // attivita', e l'hotel scritto per l'escursione di prima finirebbe nel
    // messaggio di questa, sotto una domanda che qui non e' stata fatta.
    if (spento && input.value) { input.value = ""; chiudi(); }
    const p = spento ? null : hotelPunto(input.value, SCHEDA_APERTA && SCHEDA_APERTA.id, transferSpuntato());
    // Un'etichetta e un posto, niente di piu': il cliente ha appena scritto il
    // nome del suo hotel e vede da solo se il punto e' un altro. Le frasi
    // lunghe che c'erano prima ("non e' il tuo hotel", "l'ora te la
    // confermiamo") le ha bocciate il proprietario, e aveva ragione: la riga
    // sotto dice gia' che si conferma tutto su WhatsApp.
    if (etichettaEl) etichettaEl.textContent = t("req.pickup");
    if (valoreEl) {
      valoreEl.textContent = !p ? ""
        : p.dove === "hotel" ? t("req.pickupHotel")
        : p.nome;
    }
    puntoEl.hidden = !p;
    if (aiutoEl) aiutoEl.hidden = spento || !!p;
    // La riga della privacy dice che l'hotel resta salvato: dove l'hotel non
    // si chiede, quella frase parlava di una domanda che non c'era.
    const privacyEl = document.querySelector("#requestDialog .request-privacy");
    if (privacyEl) {
      const chiave = spento ? "req.privacyNoHotel" : "req.privacy";
      privacyEl.dataset.i18nHtml = chiave;
      privacyEl.innerHTML = t(chiave);
    }
    mostraOraHotel(p);
  }

  // "A che ora" sulle schede col pick-up non e' una domanda ma una risposta:
  // l'etichetta resta, il menu no, e sotto c'e' l'ora dell'hotel scelto.
  // Finche' l'hotel non c'e' non si mostra niente: un'ora vuota sotto
  // un'etichetta e' peggio che nessuna etichetta.
  function mostraOraHotel(p) {
    if (!oraFissaEl) return;
    const daHotel = typeof PICKUP_TIMES !== "undefined" && SCHEDA_APERTA && PICKUP_TIMES[SCHEDA_APERTA.id];
    if (!daHotel) return;   // sulle altre schede il menu c'e' e non si tocca
    const ora = p && p.ora;
    oraFissaEl.textContent = ora || "";
    oraFissaEl.hidden = !ora;
    if (timeLabel) timeLabel.hidden = !ora;
  }

  function apri() {
    const trovati = hotelCerca(input.value, HOTEL_QUANTI);
    // Niente lista quando il cliente ha gia' scritto esattamente un nome: ha
    // finito, e una tendina aperta sopra il campo gli coprirebbe il resto.
    if (!trovati.length || (trovati.length === 1 && trovati[0] === input.value.trim())) {
      chiudi();
      return;
    }
    lista.innerHTML = "";
    trovati.forEach((nome, i) => {
      const li = document.createElement("li");
      li.id = "reqHotelOpt" + i;
      li.className = "hotel-sugg-voce";
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", "false");
      // textContent e non innerHTML: i nomi vengono da un file nostro, ma
      // un'apostrofo o una parentesi non deve poter diventare markup
      li.textContent = nome;
      li.addEventListener("mousedown", e => { e.preventDefault(); prendi(nome); });
      lista.appendChild(li);
    });
    lista.hidden = false;
    scelto = -1;
    input.setAttribute("aria-expanded", "true");
  }

  input.addEventListener("input", () => { apri(); mostraPunto(); });
  // "Vuoi il transfer?" spuntato o tolto: la domanda sull'hotel compare o
  // sparisce. Spuntato, torna l'hotel dell'ultima volta, come all'apertura.
  document.addEventListener("islatransfer", () => {
    const primaNascosto = campo.hidden;
    if (!senzaRitiro() && !input.value) input.value = hotelRicordato();
    mostraPunto();
    // La casella del transfer sta in fondo e la domanda sull'hotel piu' su:
    // comparsa, la si porta in vista, se no il cliente non la vede.
    if (primaNascosto && !campo.hidden) campo.scrollIntoView({ block: "center", behavior: "smooth" });
  });
  // "dove passiamo a prenderti" oppure "dove e a che ora", secondo la scheda
  document.addEventListener("islarequestopen", () => {
    if (aiutoEl) {
      const conOra = typeof PICKUP_TIMES !== "undefined" && SCHEDA_APERTA && PICKUP_TIMES[SCHEDA_APERTA.id];
      const chiave = conOra ? "req.hotelHintTime" : "req.hotelHint";
      aiutoEl.dataset.i18n = chiave;
      aiutoEl.textContent = t(chiave);
    }
    // L'hotel di ieri, se c'e' e se il cliente non ha gia' scritto qualcosa.
    // **Prima** di mostraPunto(), che e' quello che legge il campo e scrive
    // sotto dove passa il pulmino e a che ora: rimettendolo dopo, il punto di
    // raccolta restava vuoto sotto un hotel scritto.
    if (!input.value) input.value = hotelRicordato();
    // fuori dall'if: e' mostraPunto() che fa sparire la casella dove il ritiro
    // non c'e', e non deve dipendere dal fatto che la riga di aiuto esista
    mostraPunto();
  });
  input.addEventListener("focus", apri);
  input.addEventListener("blur", () => setTimeout(chiudi, 120));
  input.addEventListener("keydown", e => {
    if (lista.hidden) {
      if (e.key === "ArrowDown") { apri(); e.preventDefault(); }
      return;
    }
    if (e.key === "ArrowDown") { evidenzia(scelto + 1); e.preventDefault(); }
    else if (e.key === "ArrowUp") { evidenzia(scelto - 1); e.preventDefault(); }
    else if (e.key === "Escape") { chiudi(); }
    else if (e.key === "Enter" && scelto >= 0) {
      prendi(lista.children[scelto].textContent);
      // l'Invio ha scelto un hotel, non ha mandato la richiesta
      e.preventDefault();
    }
  });

  // La finestra si chiude col suggerimento ancora aperto: alla riapertura
  // resterebbe li' sospeso sopra un campo che nel frattempo e' cambiato.
  document.addEventListener("islarequestclose", chiudi);
  // "fermata dell'autobus" deve diventare "bus stop" anche se la riga e' gia'
  // scritta: il cambio lingua non ricarica la pagina
  document.addEventListener("islalang", mostraPunto);
  mostraPunto();
}

function righeRichiesta(tour, req) {
  const righe = ["• " + t("wa.date") + ": " + formatDate(req.date)];
  // Dove e quando passa il pulmino, ricavati dall'hotel. Si calcolano qui in
  // cima perche' l'ora va nella riga dell'orario, insieme alle altre, e non in
  // fondo attaccata al punto.
  const variante = varianteScelta(tour, req);
  const transfer = transferDi(tour, variante);
  const punto = req.hotel ? hotelPunto(req.hotel, tour && tour.id, !!(transfer && transferChiesto(req))) : null;
  // L'orario si scrive solo se il cliente ne ha scelto uno. "Da concordare" e'
  // l'assenza della riga, non una riga che dice "da concordare": all'ufficio
  // non serve leggere che il cliente non ha deciso.
  // Sulle schede col pick-up l'ora non l'ha scelta il cliente: gliel'ha detta
  // il sito leggendo il suo hotel. Nel messaggio resta la stessa riga, cosi'
  // l'ufficio legge sempre le stesse cose nello stesso ordine.
  const ora = req.time || (punto && punto.ora) || "";
  if (ora) righe.push("• " + t("wa.time") + ": " + ora);
  // Come l'orario: si scrive solo se il cliente ha scelto. "Indifferente" e'
  // l'assenza della riga, non una riga che dice "indifferente".
  if (req.lang) righe.push("• " + t("wa.lang") + ": " + req.lang);
  // Dove si contano i mezzi le persone non si chiedono: sul jet ski quattro
  // amici sono "2 singole e 1 doppia", e un "4 adulti" accanto sarebbe un
  // secondo numero da far tornare. Vedi mostraPersone() piu' sotto.
  if (!tour.units) {
    righe.push("• " + t("wa.people") + ": " + peopleText(req.adults, req.kids, req.babies));
  }
  // La variante scelta sta in alto: e' la prima cosa che l'ufficio deve sapere
  // per rispondere col prezzo giusto.
  const etichettaVariante = variante ? tf(variante.label) : req.option;
  if (tour.options && etichettaVariante) {
    righe.push("• " + tf(tour.options.label) + ": " + etichettaVariante);
  }
  // Quanti mezzi e di che tipo, subito sotto la durata: e' la riga con cui
  // l'ufficio fa il prezzo.
  const mezzi = unitaTesto(tour, req);
  if (mezzi) righe.push("• " + tf(tour.units.name) + ": " + mezzi);
  // Come l'orario e la lingua: la riga compare solo se qualcuno del gruppo ha
  // un'esigenza. Un "tutti standard" scritto in chat sarebbe una riga in piu'
  // da leggere che non dice niente; "1 vegetariano e 1 standard" no.
  const menu = menuTesto(req, tour);
  if (menu) righe.push("• " + t("wa.menu") + ": " + menu);
  // La risposta si scrive sempre, anche quando e' "no": cosi' l'ufficio sa che
  // la domanda e' stata fatta, invece di doverla rifare in chat.
  if (transfer) {
    const etichetta = tour.transferLabel ? tf(tour.transferLabel) : t("wa.transfer");
    righe.push("• " + etichetta + ": " + t(req.transfer ? "wa.yes" : "wa.no"));
  }
  // Dove si presenta chi non viene preso in hotel: l'ufficio lo legge e la
  // conferma lo riporta (15 ottobre 2026).
  const ritrovo = ritrovoDaMostrare(tour, variante, transferChiesto(req));
  if (ritrovo) righe.push("• " + t("wa.meetingPoint") + ": " + tf(ritrovo));
  if (tour.transferSiam) {
    const etichetta = tour.transferSiamLabel ? tf(tour.transferSiamLabel) : t("wa.transferSiam");
    righe.push("• " + etichetta + ": " + t(req.transferSiam ? "wa.yes" : "wa.no"));
  }
  // Il totale va anche in chat: l'ufficio vede subito che conto ha fatto il
  // cliente. Non e' una stima: i prezzi del sito sono quelli definitivi
  // (proprietario, 9 ottobre 2026).
  const conto = calcolaTotale(tour, req);
  if (conto) {
    righe.push("• " + t("wa.total") + ": €" + eur(conto.totale) + " (" + conto.dettaglio + ")");
  }
  // Dove alloggia il cliente: l'ufficio ne ha bisogno per dirgli dove e a che
  // ora passa il pulmino. Sta sopra le note perche' e' un dato, non un
  // commento. Come l'orario e la lingua, la riga compare solo se c'e'.
  if (req.hotel) {
    righe.push("• " + t("wa.hotel") + ": " + req.hotel);
    // Il punto si ricava dall'hotel invece di salvarlo: cosi' vale anche per le
    // richieste rimaste nella lista da ieri, e se domani un punto cambia non
    // resta scritto quello vecchio nel browser del cliente.
    if (punto) {
      righe.push("• " + t("wa.pickup") + ": " +
        (punto.dove === "hotel" ? t("wa.pickupHotel") : punto.nome));
    }
  }
  if (req.note) righe.push("• " + t("wa.notes") + ": " + req.note);
  return righe;
}

// Messaggio WhatsApp per una sola escursione, con data e persone già compilate.
// È scritto nella lingua che il cliente sta usando sul sito, salvo
// francese e tedesco, che vanno in italiano (perUfficio in i18n.js).
// Il testo sta a parte dall'indirizzo perche' va anche nel database
// (richieste.js): l'ufficio lo rilegge in venditori.html accanto alla richiesta.
function whatsappTesto(tour, req) {
  return perUfficio(() => t("wa.intro", { name: req.name }) + "\n" +
    "• " + tf(tour.title) + "\n" +
    righeRichiesta(tour, req).join("\n") +
    (req.email ? "\n\n" + t("wa.email", { email: req.email }) : "") +
    // il codice della richiesta salvata nel database (richieste.js), se c'e'
    (req.code ? "\n\n" + t("wa.code", { code: req.code }) : ""));
}

function tourCard(tour) {
  const li = document.createElement("li");
  li.className = "tour-card";

  // encodeURIComponent: se un nome file contiene spazi o accenti,
  // l'indirizzo resta valido invece di rompersi a metà
  const media = tour.image
    ? `<img src="${fotoPiccola(tour.image)}" alt="${tf(tour.title)}" loading="lazy" />`
    : `<span class="tour-media-empty" aria-hidden="true">${t("tour.photoSoon")}</span>`;

  // Foto, titolo e pulsante portano tutti alla pagina di dettaglio.
  const href = `./tour.html?id=${encodeURIComponent(tour.id)}`;

  // Il pulsante non apre piu' la richiesta: da qui il cliente ha visto solo
  // tre righe di descrizione, e mandarlo dritto su WhatsApp gli fa chiedere
  // qualcosa che non conosce. "Richiedi disponibilita'" sta sulla pagina di
  // dettaglio, dopo itinerario, cosa e' incluso e consigli.
  const askBtn = `<a class="btn btn-primary tour-ask" href="${href}">${t("tour.details")}</a>`;

  // Il cuore dei preferiti (preferiti.js), sopra la foto. Fuori dal link:
  // un bottone dentro un <a> non si puo' mettere.
  const cuore = typeof cuorePreferito === "function" ? cuorePreferito(tour.id, "fav-on-photo") : "";

  li.innerHTML = `
    ${cuore}
    <a class="tour-media" href="${href}" tabindex="-1" aria-hidden="true">${media}</a>
    <div class="tour-body">
      <span class="tour-cat">${categoryName(tour.category)}</span>
      <h2 class="tour-title"><a href="${href}">${tf(tour.title)}</a></h2>
      <p class="tour-desc">${tf(tour.desc)}</p>
      <ul class="tour-meta">
        ${daDefinire(tour.zone) ? "" : "<li>" + tf(tour.zone) + "</li>"}
        ${daDefinire(tour.duration) ? "" : "<li>" + tf(tour.duration) + "</li>"}
        ${tour.family ? "<li>" + t("tour.family") + "</li>" : ""}
        ${(tour.transfer || tour.transferSiam) ? "<li>" + t("tour.transfer") + "</li>" : ""}
        ${tour.season ? `<li class="tour-meta-season">${tf(tour.season)}</li>` : ""}
        ${tour.pochiPosti ? `<li class="tour-meta-season">${t("tour.fewSeats")}</li>` : ""}
        ${offertaAttiva(tour) ? `<li class="tour-meta-offer">${t("tour.offer")}</li>` : ""}
      </ul>
      <div class="tour-foot">
        <span class="tour-price">${tourPriceHTML(tour)}</span>
        ${askBtn}
      </div>
    </div>
  `;
  return li;
}

// Le parole con cui un genitore cerca, nelle cinque lingue: si aggiungono al
// testo in cui si cerca solo sulle schede con `family: true`. Senza, "kids" e
// "children" non trovavano niente e "family" una scheda sola (seconda prova da
// cliente, 19 ottobre 2026). Minuscole, come la ricerca.
const PAROLE_FAMIGLIA = [
  "famiglia", "famiglie", "bambini", "bambino", "bimbi", "ragazzi",
  "family", "families", "kids", "children", "child",
  "familia", "familias", "niños", "niño", "ninos",
  "famille", "familles", "enfants", "enfant",
  "familie", "familien", "kinder"
];

function initCatalog() {
  const grid = document.querySelector("[data-grid]");
  const chipRow = document.querySelector("[data-chips]");
  const searchInput = document.querySelector("[data-search]");
  const countEl = document.querySelector("[data-count]");
  const emptyEl = document.querySelector("[data-empty]");
  const heroPhoto = document.querySelector("[data-hero-photo]");
  const titleEl = document.querySelector("[data-catalog-title]");
  const filterToggle = document.querySelector("[data-filter-toggle]");
  const filterPanel = document.querySelector("[data-filter-panel]");
  const filterBadge = document.querySelector("[data-filter-badge]");
  const filterReset = document.querySelector("[data-filter-reset]");
  if (!grid) return;

  const published = ESPLORA_CATALOG.filter(x => x.published);
  const params = new URLSearchParams(location.search);

  // "cat" accetta anche più categorie separate da virgola: l'assistente
  // manda qui combinazioni come "avventura-motori,sport-acquatici".
  // Lista vuota = nessun filtro di categoria.
  //
  // Gli id che non esistono si buttano via invece di filtrarci sopra: un id
  // sconosciuto non toglie una categoria, le toglie **tutte**, e la pagina
  // esce con zero attività e nessuna spiegazione. Succede per davvero, non
  // solo con un indirizzo scritto male: "stelle" era una categoria vera fino
  // a ieri, e chi si è salvato quel link — o Google, che l'ha indicizzato —
  // ci arriva ancora. Meglio l'elenco intero che una pagina vuota.
  const categorieDaLink = (params.get("cat") || "").split(",")
    .filter(id => CATEGORIES.some(c => c.id === id));
  const queryDaLink = (params.get("q") || "").trim();
  // `?sel=food`: una selezione di SELEZIONI (esplora-catalog.js). Una chiave
  // che non esiste vale come se non ci fosse, come le categorie sconosciute.
  const selezioneDaLink = Object.prototype.hasOwnProperty.call(SELEZIONI, params.get("sel"))
    ? params.get("sel") : null;
  // Chi arriva senza scegliere niente (il bottone "Esperienze", "Vedi tutte")
  // trova acceso il primo filtro, "Raccomandate": le schede che spingiamo.
  // Con una categoria nel link, una ricerca dalla barra della home o il
  // filtro famiglia si parte invece da tutto il catalogo: sono domande
  // precise, e rispondere con quattro schede soltanto sarebbe sbagliato.
  // I preferiti (preferiti.js): "?preferiti=1" i miei (dal Menu), "?pref=a,b"
  // quelli che qualcuno mi ha mandato. Gli id che non esistono si buttano via,
  // come per le categorie.
  const conPreferiti = typeof preferiti === "function";
  const condivisiDaLink = conPreferiti && params.get("pref")
    ? params.get("pref").split(",").filter(id => published.some(x => x.id === id)).slice(0, 50)
    : null;
  const preferitiDaLink = conPreferiti && params.get("preferiti") === "1";
  const state = {
    preferiti: preferitiDaLink && !condivisiDaLink,
    condivisi: condivisiDaLink && condivisiDaLink.length ? condivisiDaLink : null,
    categories: categorieDaLink,
    recommended: !categorieDaLink.length && !queryDaLink && !selezioneDaLink && params.get("family") !== "1"
      && !preferitiDaLink && !condivisiDaLink,
    selezione: selezioneDaLink,
    family: params.get("family") === "1",
    query: queryDaLink.toLowerCase(),
    // Il bottone "Filtri": una zona e una durata al massimo, null = tutte.
    zone: null,
    duration: null
  };
  if (searchInput && queryDaLink) searchInput.value = queryDaLink;

  // Solo le categorie che hanno almeno un'attività pubblicata
  const usedCategories = CATEGORIES.filter(c =>
    published.some(x => categorieDi(x).includes(c.id))
  );

  // Raccomandate in testa, "Tutte" in fondo: prima le proposte, poi le
  // categorie, e per ultimo l'elenco intero.
  function buildChips() {
    // "♥ Preferiti (3)" davanti a tutto, solo se ce n'e' almeno uno (o se
    // la vista dei preferiti e' aperta: togliendo l'ultimo non sparisce
    // sotto il dito).
    const quanti = conPreferiti ? preferiti().length : 0;
    const all = (quanti || state.preferiti ? [{ id: "preferiti", name: t("fav.chip", { n: quanti }) }] : [])
      .concat([{ id: "raccomandate", name: t("catalog.recommended") }])
      .concat(usedCategories, [{ id: "tutte", name: t("catalog.all") }]);
    chipRow.innerHTML = "";
    all.forEach(cat => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip" + (cat.id === "preferiti" ? " chip-fav" : "");
      btn.textContent = tf(cat.name);
      btn.dataset.cat = cat.id;
      btn.addEventListener("click", () => {
        state.preferiti = cat.id === "preferiti";
        state.condivisi = null;
        state.recommended = cat.id === "raccomandate";
        state.selezione = null;
        state.categories = state.recommended || state.preferiti || cat.id === "tutte" ? [] : [cat.id];
        render();
      });
      chipRow.appendChild(btn);
    });
  }

  // Zona e durata: pillole dentro il pannello che apre il bottone "Filtri".
  // Una sola per gruppo; toccare quella accesa la spegne. Si mostrano solo i
  // gruppi che hanno almeno una scheda pubblicata, come per le categorie.
  function buildFilters() {
    [["zone", ZONE_FILTRO, "zoneGroups", "[data-filter-zone]"],
     ["duration", DURATE_FILTRO, "durationGroups", "[data-filter-duration]"]]
      .forEach(([chiave, gruppi, campo, dove]) => {
        const riga = document.querySelector(dove);
        if (!riga) return;
        riga.innerHTML = "";
        gruppi.filter(g => published.some(x => (x[campo] || []).includes(g.id)))
          .forEach(g => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "chip";
            btn.textContent = tf(g.name);
            btn.dataset.filter = chiave;
            btn.dataset.value = g.id;
            btn.addEventListener("click", () => {
              state[chiave] = state[chiave] === g.id ? null : g.id;
              // Chi sceglie "Costa Adeje" stando sulle raccomandate vuole le
              // attivita' di Costa Adeje, non le due raccomandate che ci stanno:
              // come per la ricerca, si passa al catalogo intero.
              if (state[chiave] && state.recommended) state.recommended = false;
              render();
            });
            riga.appendChild(btn);
          });
      });
  }

  if (filterToggle && filterPanel) {
    filterToggle.addEventListener("click", () => {
      const apri = filterPanel.hidden;
      filterPanel.hidden = !apri;
      filterToggle.setAttribute("aria-expanded", String(apri));
    });
  }
  if (filterReset) {
    filterReset.addEventListener("click", () => {
      state.zone = null;
      state.duration = null;
      render();
    });
  }
  const seeAll = document.querySelector("[data-see-all]");
  if (seeAll) {
    seeAll.addEventListener("click", () => {
      state.recommended = false;
      render();
      // si riparte dalla prima scheda: la pagina di colpo e' lunga il doppio
      grid.scrollIntoView();
    });
  }

  // La foto in cima e il titolo seguono la categoria scelta: se ne e' scelta
  // una sola sono la sua foto e il suo nome, se no la foto dell'isola e
  // "Tutte le escursioni". Con piu' categorie insieme (l'assistente sa
  // mandarne due) non c'e' una foto giusta, quindi si torna a quella generica.
  function categoriaSola() {
    if (state.categories.length !== 1) return null;
    return usedCategories.find(c => c.id === state.categories[0]) || null;
  }

  function dipingiTestata() {
    const cat = categoriaSola();
    if (heroPhoto) {
      heroPhoto.src = cat && cat.image ? "./assets/" + cat.image : "./assets/hero-tenerife.webp";
    }
    if (titleEl) {
      titleEl.textContent = cat ? tf(cat.name)
        : state.preferiti ? t("fav.title")
        : state.condivisi ? t("fav.sharedTitle")
        : state.selezione ? t(SELEZIONI[state.selezione].title)
        : state.recommended ? t("catalog.recommendedTitle") : t("catalog.title");
    }
  }

  function matches(tour) {
    if (state.preferiti && !preferiti().includes(tour.id)) return false;
    if (state.condivisi && !state.condivisi.includes(tour.id)) return false;
    if (state.recommended && !RACCOMANDATE.includes(tour.id)) return false;
    if (state.selezione && !SELEZIONI[state.selezione].ids.includes(tour.id)) return false;
    // Basta che UNA delle categorie della scheda sia fra quelle scelte: le
    // schede con `alsoIn` stanno in piu' di una, ed escono sotto ognuna.
    if (state.categories.length &&
        !categorieDi(tour).some(id => state.categories.includes(id))) return false;
    if (state.family && !tour.family) return false;
    // Una scheda senza il campo (zona o durata "Da definire") non esce sotto
    // nessun gruppo: meglio che sparisca che finire nella zona sbagliata.
    if (state.zone && !(tour.zoneGroups || []).includes(state.zone)) return false;
    if (state.duration && !(tour.durationGroups || []).includes(state.duration)) return false;
    if (state.query) {
      // Si cerca in tutte e cinque le lingue: chi scrive "boat" trova la
      // stessa attività di chi scrive "barca".
      const haystack = [tour.title, tour.desc, tour.zone]
        .map(campo => typeof campo === "string" ? campo : Object.values(campo).join(" "))
        .concat(categorieDi(tour).map(categoryName))
        .concat(tour.family ? PAROLE_FAMIGLIA : [])
        .join(" ")
        .toLowerCase();
      if (!cercaParole(haystack, state.query)) return false;
    }
    return true;
  }

  // Oltre alla ricerca non c'e' nessun altro filtro acceso: si cerca in tutto.
  function soloRicerca() {
    return state.query && !state.categories.length && !state.zone && !state.duration &&
      !state.selezione && !state.family && !state.recommended;
  }

  function render() {
    const results = published.filter(matches);
    // Le raccomandate escono nell'ordine della lista, non in quello del
    // catalogo: la prima e' quella che si vuole far vedere per prima.
    if (state.recommended) {
      results.sort((a, b) => RACCOMANDATE.indexOf(a.id) - RACCOMANDATE.indexOf(b.id));
    } else if (state.selezione) {
      const ids = SELEZIONI[state.selezione].ids;
      results.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
    } else if (state.preferiti || state.condivisi) {
      // nell'ordine in cui sono stati salvati (o mandati)
      const ids = state.condivisi || preferiti();
      results.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
    }

    dipingiTestata();
    barraPreferiti(results);

    grid.innerHTML = "";
    results.forEach(tour => grid.appendChild(tourCard(tour)));

    // Dopo le quattro consigliate c'era subito il piè di pagina, e il catalogo
    // sembrava tutto li'. La pillola "Tutte" resta l'ultima (proprietario): sta
    // fuori schermo, quindi la strada per le altre passa da qui.
    if (seeAll) {
      seeAll.hidden = !state.recommended;
      seeAll.textContent = t("catalog.seeAll", { n: published.length });
    }

    chipRow.querySelectorAll(".chip").forEach(btn => {
      // Con una selezione aperta non e' acceso nessun filtro della riga: la
      // selezione non e' fra quelli, e "Tutte" direbbe il falso.
      const attivo = state.condivisi ? false
        : state.preferiti ? btn.dataset.cat === "preferiti"
        : state.selezione ? false
        : state.recommended ? btn.dataset.cat === "raccomandate"
        : state.categories.length ? state.categories.includes(btn.dataset.cat)
        : btn.dataset.cat === "tutte";
      btn.classList.toggle("is-active", attivo);
    });

    // Le pillole del pannello, il numerino sul bottone e "Togli i filtri":
    // il pannello chiuso deve dire lo stesso che ci sono filtri accesi, se no
    // chi lo chiude e vede sei schede crede che il catalogo sia tutto li'.
    document.querySelectorAll("[data-filter]").forEach(btn => {
      btn.classList.toggle("is-active", state[btn.dataset.filter] === btn.dataset.value);
    });
    const accesi = (state.zone ? 1 : 0) + (state.duration ? 1 : 0);
    if (filterBadge) {
      filterBadge.hidden = !accesi;
      filterBadge.textContent = accesi || "";
    }
    if (filterToggle) filterToggle.classList.toggle("is-active", accesi > 0);
    if (filterReset) filterReset.hidden = !accesi;

    // Riepilogo in alto
    if (published.length === 0) {
      countEl.textContent = "";
    } else if (results.length === published.length) {
      countEl.textContent = t("catalog.countAll", { n: published.length });
    } else {
      countEl.textContent = t("catalog.countSome", { n: results.length, total: published.length });
    }

    // Stato vuoto: distingue "niente pubblicato" da "filtri troppo stretti"
    if (published.length === 0) {
      emptyEl.hidden = false;
      emptyEl.innerHTML = `
        <h2>${t("catalog.prepTitle")}</h2>
        <p>${t("catalog.prepText")}</p>
      `;
    } else if (results.length === 0 && state.preferiti) {
      emptyEl.hidden = false;
      emptyEl.innerHTML = `
        <h2>${t("fav.emptyTitle")}</h2>
        <p>${t("fav.emptyText")}</p>
      `;
    } else if (results.length === 0) {
      emptyEl.hidden = false;
      emptyEl.innerHTML = `
        <h2>${t("catalog.emptyTitle")}</h2>
        <p>${t(state.zone || state.duration ? "catalog.emptyFilters" : "catalog.emptyText")}</p>
        <div class="catalog-empty-azioni">
          ${state.query ? `<button class="btn btn-primary" type="button" data-empty-search>${esc(t("catalog.clearSearch"))}</button>` : ""}
          ${soloRicerca() ? "" : `<button class="btn ${state.query ? "btn-soft" : "btn-primary"}" type="button" data-empty-all>${esc(t("catalog.all"))}</button>`}
          <button class="btn btn-soft" type="button" data-empty-help>${esc(t("catalog.askHelp"))}</button>
        </div>
      `;
      const togliRicerca = () => {
        state.query = "";
        if (searchInput) searchInput.value = "";
      };
      const azione = (dove, fa) => {
        const bottone = emptyEl.querySelector(dove);
        if (bottone) bottone.addEventListener("click", fa);
      };
      azione("[data-empty-search]", () => { togliRicerca(); render(); });
      azione("[data-empty-all]", () => {
        togliRicerca();
        state.categories = [];
        state.zone = state.duration = state.selezione = null;
        state.family = state.recommended = false;
        render();
      });
      azione("[data-empty-help]", () => {
        const assistente = document.querySelector(".assist-fab");
        if (assistente) assistente.click();
      });
    } else {
      emptyEl.hidden = true;
      emptyEl.innerHTML = "";
    }
  }

  // Sopra le schede, nella vista dei preferiti: "Condividi i preferiti"; in
  // quella dei preferiti mandati da qualcuno: "Salva tutte nei preferiti".
  function barraPreferiti(results) {
    let barra = document.querySelector("[data-fav-bar]");
    const serve = (state.preferiti || state.condivisi) && results.length;
    if (!serve) { if (barra) barra.hidden = true; return; }
    if (!barra) {
      barra = document.createElement("div");
      barra.className = "fav-bar";
      barra.dataset.favBar = "";
      grid.parentNode.insertBefore(barra, grid);
    }
    const ids = results.map(x => x.id);
    const mancano = state.condivisi ? ids.filter(id => !preferiti().includes(id)) : [];
    barra.innerHTML = state.preferiti
      ? `<button class="btn btn-ghost" type="button" data-fav-share>${esc(t("fav.share"))}</button>`
      : mancano.length
      ? `<p>${esc(t("fav.sharedText"))}</p><button class="btn btn-ghost" type="button" data-fav-saveall>${esc(t("fav.saveAll"))}</button>`
      : `<p>${esc(t("fav.allSaved"))}</p>`;
    barra.hidden = false;
    const condividi = barra.querySelector("[data-fav-share]");
    if (condividi) condividi.addEventListener("click", () => condividiPreferiti(condividi, ids));
    const tutte = barra.querySelector("[data-fav-saveall]");
    if (tutte) tutte.addEventListener("click", () => mancano.forEach(id => cambiaPreferito(id)));
  }

  // Un cuore toccato: la pillola cambia numero; nella vista dei preferiti
  // la scheda tolta sparisce; in quella dei condivisi cambia la barra.
  if (conPreferiti) {
    document.addEventListener("islapreferiti", () => {
      buildChips();
      render();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      state.query = searchInput.value.trim().toLowerCase();
      // Chi cerca "barca" stando sulle raccomandate cerca nel catalogo
      // intero: fra quattro schede non la troverebbe, e la pagina vuota
      // direbbe che la barca non ce l'abbiamo.
      if (state.query && state.recommended) state.recommended = false;
      if (state.query && state.selezione) state.selezione = null;
      if (state.query) { state.preferiti = false; state.condivisi = null; }
      render();
    });
  }

  buildChips();
  buildFilters();
  render();

  // Cambio lingua: le schede e i filtri sono disegnati da JavaScript,
  // quindi vanno ricostruiti a mano (applyI18n tocca solo l'HTML fisso).
  document.addEventListener("islalang", () => {
    buildChips();
    buildFilters();
    render();
  });
}

document.addEventListener("DOMContentLoaded", initCatalog);

// Il "meno / più" accanto ai numeri: persone, mezzi, menu.
//
// Contare quante persone sono e' l'unica cosa che nella finestra si fa quasi
// sempre, e con la sola casella erano quattro gesti — tocca, aspetta il
// tastierino, batti, chiudilo — per arrivare da 2 a 3. Adesso e' un tocco.
//
// **La casella resta lei a dire il numero.** I bottoni le scrivono dentro e
// poi sparano un evento `input`: il totale, il controllo dei menu e quello dei
// mezzi stavano gia' ad ascoltarlo e continuano a funzionare senza sapere che
// i bottoni esistono. Niente secondo posto dove il numero e' scritto, che
// sarebbe il modo di ritrovarsi due numeri diversi.
//
// E si puo' ancora battere a mano: per dodici persone scrivere "12" e' piu'
// svelto che premere dieci volte. I bottoni servono al caso normale — "siamo
// due, piu' un bambino".
function applicaStepper(dove) {
  if (!dove) return;
  dove.querySelectorAll('input[type="number"]').forEach(vesti);
}

function vesti(input) {
  // Ridisegnando le righe (cambio lingua) si ripassa di qui: se e' gia'
  // vestita si lascia stare, se no i bottoni si moltiplicano.
  if (input.parentElement && input.parentElement.classList.contains("stepper")) return;

  const guscio = document.createElement("div");
  guscio.className = "stepper";
  input.parentNode.insertBefore(guscio, input);

  const meno = bottone(-1);
  const piu = bottone(1);
  guscio.appendChild(meno);
  guscio.appendChild(input);
  guscio.appendChild(piu);

  function bottone(passo) {
    const b = document.createElement("button");
    // Dentro un <form> un bottone senza `type` e' un bottone d'invio: senza
    // questa riga, toccare "+" mandava la richiesta.
    b.type = "button";
    b.className = "stepper-btn";
    b.textContent = passo < 0 ? "−" : "+";
    // Il segno da solo non si legge ad alta voce: il nome vero sta qui, ed e'
    // tradotto come tutto il resto.
    b.setAttribute("aria-label", t(passo < 0 ? "req.minus" : "req.plus"));
    // Fuori dal giro del tasto Tab: chi gira con la tastiera ha gia' la
    // casella, dove i numeri si battono e le frecce funzionano. Due fermate in
    // piu' per campo sarebbero otto fermate in piu' nella finestra.
    b.tabIndex = -1;
    b.addEventListener("click", () => muovi(passo));
    return b;
  }

  function limiti() {
    return {
      min: input.min === "" ? -Infinity : Number(input.min),
      max: input.max === "" ? Infinity : Number(input.max)
    };
  }

  function muovi(passo) {
    const { min, max } = limiti();
    const ora = parseInt(input.value, 10);
    const partenza = isNaN(ora) ? (min === -Infinity ? 0 : min) : ora;
    const nuovo = Math.min(max, Math.max(min, partenza + passo));
    if (nuovo === ora) return;
    input.value = String(nuovo);
    // `bubbles`: la finestra dei pacchetti ascolta l'evento **sulla finestra**,
    // non sulla casella. Senza, li' il totale non si muoveva.
    input.dispatchEvent(new Event("input", { bubbles: true }));
    aggiorna();
  }

  // I bottoni si spengono ai limiti invece di non fare niente: "adulti" parte
  // da uno, e un meno che resta acceso e non toglie sembra rotto.
  function aggiorna() {
    const { min, max } = limiti();
    const ora = parseInt(input.value, 10);
    meno.disabled = !isNaN(ora) && ora <= min;
    piu.disabled = !isNaN(ora) && ora >= max;
  }

  // Anche battendo a mano: chi scrive "30" deve vedere il piu' spegnersi.
  input.addEventListener("input", aggiorna);
  aggiorna();
}

// La finestra della richiesta: una sola, per escursioni.html e tour.html, che
// hanno al suo posto <div data-finestra-richiesta>. Si scrive subito, mentre il
// file si carica, e non in DOMContentLoaded: le traduzioni (applyI18n, i18n.js) e
// initRequestDialog partono li', e la devono trovare gia' in pagina.
const FINESTRA_RICHIESTA = `  <div class="ticket-dialog request-dialog" id="requestDialog" role="dialog" aria-modal="true" aria-labelledby="requestTitle" hidden>
    <div class="ticket-dialog-head">
      <h2 id="requestTitle" data-i18n="req.title">Richiedi disponibilità</h2>
      <button class="iconbtn" type="button" data-request-close data-i18n-aria-label="common.close" aria-label="Chiudi">✕</button>
    </div>
    <p class="request-activity" data-request-activity></p>
    <p class="request-season" data-request-season hidden></p>
    <form data-request-form>
      <!-- La data non e' piu' un <input type="date">: il calendario del sistema
           non sa spegnere i giorni in cui l'escursione non parte — accetta solo
           un minimo e un massimo — e su una scheda che va mar/gio/sab il
           cliente poteva scegliere il mercoledi' e scoprirlo dopo. Al suo posto
           c'e' un calendario scritto a mano (escursioni.js, calendarioData):
           i giorni buoni si toccano, gli altri sono spenti.
           Il campo resta come nascosto perche' e' sempre lui a dire la data a
           tutto il resto del codice, ed e' l'unico posto dove la data e'
           scritta. **Niente \`required\`**: su un campo che non si vede
           bloccherebbe l'invio senza dire perche', quindi il controllo si fa a
           mano e l'avviso esce qui sotto. -->
      <span class="request-people-label" data-i18n="req.date">Quando vorresti andare</span>
      <input id="reqDate" name="date" type="hidden" />
      <div data-date-field></div>
      <p class="request-day-error" data-request-day-error hidden></p>
      <!-- Le 24 ore vere (partenzaPossibile in escursioni.js): senza questa riga
           chi apriva l'escursione di domani mattina vedeva il giorno spento e
           pensava che fosse pieno. -->
      <p class="hint" data-request-date-hint data-i18n="req.dateHint">Si può chiedere fino a 24 ore prima della partenza.</p>

      <label for="reqHotel"><span data-i18n="req.hotel">Dove alloggi</span> <span class="request-optional" data-i18n="req.hotelWhy">(utile per il pick-up)</span></label>
      <div class="hotel-field" data-hotel-field>
        <input id="reqHotel" name="hotel" type="text" autocomplete="off" role="combobox"
               aria-expanded="false" aria-autocomplete="list" aria-controls="reqHotelList"
               data-i18n-placeholder="req.hotelPlaceholder" placeholder="Scrivi le prime lettere dell'hotel" />
        <ul class="hotel-sugg" id="reqHotelList" role="listbox" hidden></ul>
      </div>
      <p class="hint" data-hotel-hint data-i18n="req.hotelHint">Serve a dirti dove passiamo a prenderti. Se non trovi il tuo, scrivi qui il nome o l'indirizzo.</p>

      <label for="reqTime" data-request-time-label data-i18n="req.time">A che ora</label>
      <select id="reqTime" name="time" data-request-time></select>
      <p class="request-ora-fissa" data-request-time-fixed hidden></p>
      <p class="hotel-punto" data-hotel-punto hidden><span data-hotel-punto-et>Punto di raccolta</span> <strong data-hotel-punto-val></strong></p>
      <p class="hotel-punto" data-request-ritrovo hidden><span data-i18n="req.meetingPoint">Punto di ritrovo</span> <strong data-request-ritrovo-value></strong> <span class="request-ritrovo-da-solo" data-i18n="req.meetingSelf">· ti aspettiamo lì</span></p>

      <label for="reqLang" data-request-lang-label hidden data-i18n="req.lang">In che lingua</label>
      <select id="reqLang" name="lang" data-request-lang hidden></select>

      <span class="request-people-label" data-request-people-label data-i18n="req.people">Quante persone</span>
      <div class="request-people" data-request-people>
        <label for="reqAdults"><span><span data-i18n="req.adults">Adulti</span> <span data-request-age="adult"></span></span>
          <input id="reqAdults" name="adults" type="number" inputmode="numeric" min="1" max="30" value="1" required />
        </label>
        <label for="reqKids"><span><span data-i18n="req.kids">Bambini</span> <span data-request-age="child"></span></span>
          <input id="reqKids" name="kids" type="number" inputmode="numeric" min="0" max="30" value="0" />
        </label>
        <label for="reqBabies" data-request-babies hidden><span><span data-i18n="req.babies">Neonati</span> <span data-request-age="infant"></span></span>
          <input id="reqBabies" name="babies" type="number" inputmode="numeric" min="0" max="30" value="0" />
        </label>
      </div>

      <span class="request-people-label" data-request-units-label hidden>Quante moto d'acqua</span>
      <div class="request-people" data-request-units hidden></div>
      <p class="request-day-error" data-request-units-error hidden></p>


      <span class="request-people-label" data-request-menu-label hidden data-i18n="req.menu">Esigenze sul menu</span>
      <div class="request-people" data-request-menu-rows hidden></div>
      <p class="request-day-error" data-request-menu-error hidden></p>
      <p class="hint" data-request-menu-hint hidden data-i18n="req.menuHint">Allergie o intolleranze: scrivile nelle note qui sotto, così la cucina le sa in anticipo.</p>

      <label class="request-check" data-request-transfer hidden>
        <input id="reqTransfer" name="transfer" type="checkbox" />
        <span>
          <span data-i18n="req.transfer" data-request-transfer-label>Vuoi il transfer?</span>
          <small data-request-transfer-note></small>
        </span>
      </label>

      <label class="request-check" data-request-transfer-siam hidden>
        <input id="reqTransferSiam" name="transferSiam" type="checkbox" />
        <span>
          <span data-i18n="req.transferSiam" data-request-transfer-siam-label>Vuoi il transfer per il Siam Park?</span>
          <small data-request-transfer-siam-note></small>
        </span>
      </label>

      <label for="reqNote"><span data-i18n="req.note">Note</span> <span class="request-optional" data-i18n="req.optional">(facoltativo)</span></label>
      <input id="reqNote" name="note" type="text" autocomplete="off"
             data-i18n-placeholder="req.notePlaceholder" placeholder="Richieste particolari…" />

      <!-- Il nome sta qui in fondo e non in cima, dove stava. E' l'unica
           domanda che non riguarda l'escursione e l'unica a cui si risponde
           battendo a macchina: in cima era la prima cosa che il cliente si
           trovava davanti, prima ancora di "quando vorresti andare". Adesso la
           finestra si apre sulla domanda vera, e il nome si scrive alla fine,
           quando si sta gia' mandando. In modalita' "aggiungi alla lista" la
           riga sparisce lo stesso: il nome si chiede una volta sola, quando si
           manda la lista. -->
      <div data-request-name>
        <label for="reqName" data-i18n="req.name">Il tuo nome</label>
        <input id="reqName" name="name" type="text" autocomplete="name"
               data-i18n-placeholder="req.namePlaceholder" placeholder="Nome e cognome" required />
      </div>

      <!-- Il conto e il pulsante stanno in un piede che resta appiccicato in
           fondo alla finestra mentre il resto scorre. Il modulo e' piu' alto
           di un telefono (1262 px contro 844 sulla scheda piu' semplice, 1563
           dove ci sono i menu): prima il cliente compilava senza vedere ne'
           quanto viene ne' dove si manda, e il totale gli passava davanti a
           meta' strada per poi sparire di sopra.
           Le due righe sotto restano fuori dal piede: se fossero dentro
           occuperebbero lo spazio fisso di tutti, e lette una volta non
           servono piu'. Servono anche a far scorrere qualcosa sotto al piede,
           che e' quello che tiene in piedi il \`position: sticky\`. -->
      <div class="request-foot">
        <p class="request-total" data-request-total hidden></p>
        <button class="btn btn-primary btn-lista btn-block request-submit" type="submit" data-i18n="req.submit">Continua su WhatsApp</button>
      </div>

      <p class="hint" data-i18n-html="req.hint">Le richieste vanno fatte con almeno <strong>24 ore di anticipo</strong>. Entro 24 ore ti diciamo se c'è posto e ti mandiamo il link per pagare.</p>
      <p class="hint request-privacy" data-i18n-html="req.privacy">Quello che scrivi serve solo a gestire la tua richiesta e a risponderti su WhatsApp. L'hotel resta salvato su questo dispositivo, per non riscriverlo ogni volta. <a href="./privacy.html" target="_blank" rel="noopener">Come trattiamo i tuoi dati</a></p>
    </form>
  </div>`;

const postoFinestra = document.querySelector("[data-finestra-richiesta]");
if (postoFinestra) postoFinestra.outerHTML = FINESTRA_RICHIESTA;

// Finestra "Richiedi disponibilità": raccoglie data e persone, poi apre
// WhatsApp col messaggio già compilato.
function initRequestDialog() {
  const dialog = document.getElementById("requestDialog");
  const scrim = document.querySelector("[data-request-scrim]");
  const form = document.querySelector("[data-request-form]");
  const activityEl = document.querySelector("[data-request-activity]");
  const seasonEl = document.querySelector("[data-request-season]");
  initHotelField();

  const transferEl = document.querySelector("[data-request-transfer]");
  const transferLabelEl = document.querySelector("[data-request-transfer-label]");
  const transferNoteEl = document.querySelector("[data-request-transfer-note]");
  const transferInput = document.getElementById("reqTransfer");
  const ritrovoEl = document.querySelector("[data-request-ritrovo]");
  const ritrovoValoreEl = document.querySelector("[data-request-ritrovo-value]");
  const transferSiamEl = document.querySelector("[data-request-transfer-siam]");
  const transferSiamLabelEl = document.querySelector("[data-request-transfer-siam-label]");
  const transferSiamNoteEl = document.querySelector("[data-request-transfer-siam-note]");
  const transferSiamInput = document.getElementById("reqTransferSiam");
  const dateInput = document.getElementById("reqDate");
  const dateField = document.querySelector("[data-date-field]");
  const timeEl = document.querySelector("[data-request-time]");
  const timeLabelEl = document.querySelector("[data-request-time-label]");
  const oraFissaEl2 = document.querySelector("[data-request-time-fixed]");
  const dayErrorEl = document.querySelector("[data-request-day-error]");
  const langEl = document.querySelector("[data-request-lang]");
  const langLabelEl = document.querySelector("[data-request-lang-label]");
  const menuRowsEl = document.querySelector("[data-request-menu-rows]");
  const menuLabelEl = document.querySelector("[data-request-menu-label]");
  const menuHintEl = document.querySelector("[data-request-menu-hint]");
  const menuErrorEl = document.querySelector("[data-request-menu-error]");
  const totalEl = document.querySelector("[data-request-total]");
  const adultsInput = document.getElementById("reqAdults");
  const kidsInput = document.getElementById("reqKids");
  const babiesInput = document.getElementById("reqBabies");
  const babiesBox = document.querySelector("[data-request-babies]");
  const peopleBoxEl = document.querySelector("[data-request-people]");
  const peopleLabelEl = document.querySelector("[data-request-people-label]");
  const unitsRowsEl = document.querySelector("[data-request-units]");
  const unitsLabelEl = document.querySelector("[data-request-units-label]");
  const unitsErrorEl = document.querySelector("[data-request-units-error]");
  const nameBox = document.querySelector("[data-request-name]");
  const nameInput = document.getElementById("reqName");
  if (!dialog || !scrim || !form || !dateInput) return;
  // dopo la guardia: in home la finestra non c'e' e `form` e' null
  const submitBtn = form.querySelector(".request-submit");

  // Le tre caselle delle persone sono nell'HTML e non cambiano mai: si vestono
  // col "meno / piu'" una volta sola, qui. Quelle dei mezzi e dei menu nascono
  // invece a ogni apertura, e si vestono dove nascono.
  applicaStepper(peopleBoxEl);

  // `min` e `max` restano sul campo anche se adesso e' nascosto: non li legge
  // piu' il calendario del sistema, ma li legge `utile()` del nostro, e averli
  // scritti in un posto solo vuol dire che le 24 ore di preavviso e il tetto
  // di un anno non possono divergere fra i due.
  dateInput.min = minRequestDate();
  dateInput.max = maxRequestDate();

  const calendario = calendarioData();

  let current = null;

  // La finestra fa **una cosa sola**: mette l'escursione nella lista.
  //
  // Prima ne faceva due — mandare subito questa, oppure metterla da parte — e
  // la scelta fra le due era il punto in cui la prenotazione si intoppava: due
  // pulsanti uno sopra l'altro, e il cliente doveva decidere prima di aver
  // capito cosa voleva. Adesso si passa tutti dalla lista, e la lista con una
  // voce sola manda esattamente il messaggio che mandava "Richiedi
  // disponibilita'": all'ufficio non cambia niente.
  //
  // Il nome non si chiede qui ma nella finestra della lista, una volta sola.
  // "Punto di ritrovo: Puerto Colón, molo 10 — ci arrivi da solo": dove non
  // passa nessuno, o il cliente il transfer non lo vuole (15 ottobre 2026).
  function aggiornaRitrovo() {
    if (!ritrovoEl) return;
    const r = current ? ritrovoDaMostrare(current, VARIANTE_APERTA,
      !!((transferInput && transferInput.checked) || (transferSiamInput && transferSiamInput.checked))) : null;
    if (ritrovoValoreEl) ritrovoValoreEl.textContent = r ? tf(r) : "";
    ritrovoEl.hidden = !r;
  }

  function open(tour) {
    current = tour;
    SCHEDA_APERTA = tour;
    VARIANTE_APERTA = sceltaCorrente(tour);
    // la casella del transfer riparte da non spuntata **prima** che il campo
    // dell'hotel guardi se deve comparire: e' la stessa finestra per tutte le
    // schede, e la spunta di quella di prima chiederebbe l'hotel anche qui
    if (transferInput) transferInput.checked = false;
    // il campo dell'hotel vive in un'altra funzione e deve sapere che scheda e'
    document.dispatchEvent(new CustomEvent("islarequestopen"));
    // `required` su un campo nascosto blocca l'invio senza dire perche': il
    // browser prova a segnalare un campo che nessuno vede.
    if (nameBox) nameBox.hidden = true;
    if (nameInput) nameInput.required = false;
    if (submitBtn) {
      // anche `data-i18n` e non solo il testo: al cambio lingua applyI18n
      // riscrive il pulsante leggendo l'attributo
      submitBtn.setAttribute("data-i18n", "req.addToList");
      submitBtn.textContent = t("req.addToList");
    }
    aggiornaAttivita(tour);
    // se l'attivita' si fa solo in certi mesi lo si dice qui, prima che il
    // cliente scelga una data in cui non si puo' fare
    if (seasonEl) {
      seasonEl.textContent = tour.season ? tf(tour.season) : "";
      seasonEl.hidden = !tour.season;
    }
    // la domanda sul transfer compare solo dove il transfer esiste davvero, e
    // riparte sempre da non spuntata: la finestra e' la stessa per tutte le
    // attivita' e si riapre com'era rimasta
    // Il transfer della variante, se la variante lo dice (Freebird, buggy).
    const transfer = transferDi(tour, VARIANTE_APERTA);
    if (transferEl) {
      transferEl.hidden = !transfer;
      // il testo per esteso dice i limiti (per il Twin Ticket vale solo per
      // la giornata a Loro Parque) prima che il cliente spunti
      if (transferNoteEl) transferNoteEl.textContent = transfer ? tf(transfer) : "";
      // La domanda e' quella di sempre, a meno che la scheda non ne dia una
      // sua: serve dove "Vuoi il transfer?" da solo non basta a distinguerlo
      // dal secondo transfer (due zone di partenza diverse sulla stessa scheda).
      if (transferLabelEl) transferLabelEl.textContent = tour.transferLabel ? tf(tour.transferLabel) : t("req.transfer");
    }
    // Il secondo transfer, una seconda zona di partenza indipendente dalla
    // prima: riparte anche lui da non spuntato.
    if (transferSiamEl) {
      transferSiamEl.hidden = !tour.transferSiam;
      if (transferSiamInput) transferSiamInput.checked = false;
      if (transferSiamNoteEl) transferSiamNoteEl.textContent = tour.transferSiam ? tf(tour.transferSiam) : "";
      if (transferSiamLabelEl) transferSiamLabelEl.textContent = tour.transferSiamLabel ? tf(tour.transferSiamLabel) : t("req.transferSiam");
    }
    aggiornaRitrovo();
    // Gli orari: la finestra e' una sola per tutte le attivita', quindi si
    // riparte sempre da "Da concordare" invece di tenere la scelta di prima.
    if (timeEl) timeEl.value = "";
    if (langEl) langEl.value = "";
    riempiOrari(tour);
    riempiLingue(tour);
    riempiMenu(tour);
    mostraEta(tour);
    mostraNeonati(tour);
    mostraBambini(tour);
    mostraPersone(tour);
    riempiUnita(tour);
    // La data scelta per un'altra scheda puo' non andare bene per questa: i
    // giorni buoni sono altri. Si butta invece di lasciarla li' con un avviso
    // sotto — ora che i giorni sbagliati non si possono nemmeno toccare,
    // trovarne uno scritto nel campo sarebbe una contraddizione.
    if (dateInput.value && !giornoValido()) dateInput.value = "";
    if (calendario) { calendario.chiudi(); calendario.azzera(); }
    aggiornaGiorno();
    aggiornaTotale();

    dialog.hidden = false;
    scrim.hidden = false;
    requestAnimationFrame(() => {
      dialog.classList.add("is-open");
      scrim.classList.add("is-visible");
    });
    document.body.classList.add("menu-open");
  }

  // Sulla pagina di dettaglio la variante si sceglie con i bottoni, sopra il
  // pulsante: la scelta e' gia' fatta e ripeterla qui sarebbe un passaggio in
  // piu'. Restituisce il testo scelto, oppure "" se quei bottoni non ci sono
  // (dalla pagina catalogo, dove si chiede col menu qui sotto).
  function sceltaDallaPagina() {
    const premuto = document.querySelector(
      '[data-detail-options] .detail-option[aria-pressed="true"]');
    return premuto ? premuto.getAttribute("data-option-value") || "" : "";
  }

  // La variante scelta. Arriva sempre dai bottoni della pagina di dettaglio:
  // sono l'unico posto da cui questa finestra si apre, e il primo bottone e'
  // gia' premuto. Fino a v273 c'era anche un <select> qui dentro come
  // ripiego, che non si e' mai visto una volta.
  function opzioneScelta() {
    return sceltaDallaPagina();
  }

  // La variante premuta sulla pagina di dettaglio, presa dal catalogo **per
  // posizione**. Al cambio lingua i bottoni e questa finestra si ridisegnano
  // ognuno per conto suo, e per un attimo il bottone porta ancora l'etichetta
  // vecchia: cercarla nel catalogo, che intanto e' gia' nella lingua nuova,
  // non trova niente. La posizione invece non cambia mai.
  function varianteDallaPosizione(tour) {
    if (!tour || !tour.options || !Array.isArray(tour.options.choices)) return null;
    const bottoni = [...document.querySelectorAll(
      "[data-detail-options] .detail-option")];
    const i = bottoni.findIndex(b => b.getAttribute("aria-pressed") === "true");
    return i >= 0 ? (tour.options.choices[i] || null) : null;
  }

  // Come sopra, ma come oggetto del catalogo: serve per leggerne gli orari e i
  // prezzi dei mezzi. Il ripiego sull'etichetta serve alla pagina catalogo,
  // dove i bottoni non ci sono e la variante si sceglie col menu qui dentro.
  function sceltaCorrente(tour) {
    return varianteDallaPosizione(tour) || varianteDi(tour, opzioneScelta());
  }

  // L'etichetta della variante scelta coi bottoni, presa dal catalogo per
  // posizione invece che dal bottone. Al cambio lingua i due si ridisegnano
  // ognuno per conto suo e per un attimo il bottone porta ancora l'etichetta
  // vecchia: la posizione invece non cambia mai. Vuota dove i bottoni non ci
  // sono, cioe' dalla pagina catalogo, dove la variante si sceglie col menu
  // qui dentro e riscriverla in cima sarebbe la stessa cosa detta due volte.
  function indiceVariante(tour) {
    const scelte = tour && tour.options && Array.isArray(tour.options.choices)
      ? tour.options.choices : null;
    if (!scelte) return -1;
    return scelte.indexOf(sceltaCorrente(tour));
  }

  function etichettaDallaPagina(tour) {
    const scelta = varianteDallaPosizione(tour);
    return scelta ? tf(scelta.label) : "";
  }

  // "Jet Ski Safari — 2 ore · moto doppia": il nome dell'attivita' in cima
  // alla finestra, con accanto la variante scelta fuori di qui. Senza, il
  // cliente sceglie le 2 ore sulla pagina, apre la richiesta e non trova piu'
  // nessuna traccia della sua scelta, che pero' e' dentro il messaggio.
  function aggiornaAttivita(tour) {
    if (!activityEl || !tour) return;
    const variante = etichettaDallaPagina(tour);
    activityEl.textContent = tf(tour.title) + (variante ? " — " + variante : "");
  }


  // Gli orari fra cui scegliere. "Da concordare" vale stringa vuota e non c'e'
  // sempre: compare solo dove un orario fisso non esiste, cioe' sui charter e
  // sulle attivita' di cui non conosciamo ancora le partenze.
  // Il giorno scelto va bene? Dove l'attivita' non si fa tutti i giorni, il
  // cliente lo deve sapere **appena sceglie la data**, non dopo aver riempito
  // tutto il resto e premuto invia.
  function giornoValido() {
    if (!current || !dateInput.value) return true;
    const giorni = giorniDi(current, sceltaCorrente(current));
    if (!giorni.length) return true;
    // "2026-09-12" letto pezzo per pezzo: new Date("2026-09-12") lo tratta
    // come UTC e in certi fusi orari torna indietro di un giorno.
    const [a, m, g] = dateInput.value.split("-").map(Number);
    return giorni.includes(new Date(a, m - 1, g).getDay());
  }

  // ─── Il calendario della data ──────────────────────────────────────────
  //
  // Scritto a mano, e il motivo e' uno solo: **un <input type="date"> non sa
  // spegnere i giorni in cui l'escursione non parte.** Accetta un minimo e un
  // massimo, niente altro: il calendario che si apre lo disegna il sistema
  // operativo e da fuori non ci si arriva. Su una scheda che va mar/gio/sab il
  // cliente poteva scegliere il mercoledi' e scoprirlo dopo, ed e' esattamente
  // quello che il proprietario ha chiesto di togliere.
  //
  // (C'e' mezzo trucco che non basta: `step="7"` sul campo nativo lascia solo
  // un giorno ogni sette, e per l'Utopia — sabato e basta — funzionerebbe. Ma
  // mar/gio/sab non si scrive con un passo fisso, quindi non e' una strada.)
  //
  // Il campo `#reqDate` resta, nascosto, ed e' sempre lui a dire la data a
  // tutto il resto — il totale, il messaggio, la lista. Stessa scelta dei
  // bottoni "meno / piu'": un posto solo dove il dato e' scritto.
  function calendarioData() {
    if (!dateField) return;

    let mese = null;   // il primo del mese mostrato, come Date locale

    const apri_btn = document.createElement("button");
    apri_btn.type = "button";          // dentro un <form> se no manda la richiesta
    apri_btn.className = "date-open";
    apri_btn.setAttribute("aria-haspopup", "true");
    apri_btn.setAttribute("aria-expanded", "false");

    const pannello = document.createElement("div");
    pannello.className = "date-cal";
    pannello.hidden = true;

    dateField.appendChild(apri_btn);
    dateField.appendChild(pannello);

    // I giorni buoni di **questa** scheda, come numeri di getDay().
    function giorniBuoni() {
      return current ? giorniDi(current, sceltaCorrente(current)) : [];
    }

    // Un giorno si puo' toccare? Tre no: prima di domani (le 24 ore di
    // preavviso), oltre un anno, e i giorni in cui non si parte.
    function utile(iso) {
      if (iso < minRequestDate() || iso > maxRequestDate()) return false;
      // domani si', ma solo se c'e' ancora una partenza fra 24 ore o piu'
      if (current && !giornoPossibile(current, sceltaCorrente(current), iso)) return false;
      const giorni = giorniBuoni();
      if (!giorni.length) return true;       // vuoto = tutti i giorni
      const [a, m, g] = iso.split("-").map(Number);
      return giorni.includes(new Date(a, m - 1, g).getDay());
    }

    // La prima data utile, da domani in avanti. Serve a decidere **su che mese
    // si apre**: un'escursione che riparte a ottobre, aperta su settembre,
    // mostrerebbe una griglia tutta grigia e sembrerebbe rotta.
    // Si guarda un anno, che e' il massimo che il campo accetta.
    function primaUtile() {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      for (let i = 0; i < 366; i++) {
        const iso = dataLocale(d);
        if (utile(iso)) return iso;
        d.setDate(d.getDate() + 1);
      }
      return "";
    }

    function etichetta() {
      apri_btn.textContent = dateInput.value
        ? dataLeggibile(dateInput.value)
        : t("req.datePick");
      apri_btn.classList.toggle("is-empty", !dateInput.value);
    }

    // Il mese di una data, come primo del mese
    function primoDelMese(iso) {
      const [a, m] = iso.split("-").map(Number);
      return new Date(a, m - 1, 1);
    }

    function disegna() {
      const giorni = giorniBuoni();
      const prima = primaUtile();
      if (!prima) {
        // Nessuna data in un anno intero: lo si dice, invece di mostrare una
        // griglia grigia.
        pannello.innerHTML = '<p class="date-cal-vuoto"></p>';
        pannello.querySelector(".date-cal-vuoto").textContent = t("req.dateNone");
        return;
      }
      if (!mese) mese = primoDelMese(dateInput.value || prima);

      const anno = mese.getFullYear();
      const m = mese.getMonth();
      const min = primoDelMese(minRequestDate());
      const max = primoDelMese(maxRequestDate());

      pannello.innerHTML = "";

      // ── la testata: mese, anno e le due frecce
      const testa = document.createElement("div");
      testa.className = "date-cal-head";
      const indietro = freccia(-1, "req.prevMonth", mese > min);
      const titolo = document.createElement("strong");
      // I nomi dei mesi li da' il browser, giusti nelle cinque lingue: dodici nomi
      // per cinque lingue sarebbero sessanta righe di vocabolario per niente.
      const locali = { it: "it-IT", en: "en-GB", es: "es-ES", fr: "fr-FR", de: "de-DE" };
      try {
        titolo.textContent = mese.toLocaleDateString(locali[getLang()] || "en-GB",
          { month: "long", year: "numeric" });
      } catch (e) {
        titolo.textContent = (m + 1) + "/" + anno;
      }
      const avanti = freccia(1, "req.nextMonth", mese < max);
      testa.appendChild(indietro);
      testa.appendChild(titolo);
      testa.appendChild(avanti);
      pannello.appendChild(testa);

      // ── le iniziali dei giorni, **da lunedi'**: in Italia e in Spagna la
      // settimana comincia di lunedi', e il catalogo e' per clienti che stanno
      // qui. Le sigle sono le stesse dell'avviso "si fa solo il...".
      const ordine = [1, 2, 3, 4, 5, 6, 0];
      const riga = document.createElement("div");
      riga.className = "date-cal-dow";
      ordine.forEach(n => {
        const s = document.createElement("span");
        s.textContent = t(GIORNI_CHIAVI[n]);
        // il giorno in cui non si parte e' spento anche in testata: si vede
        // subito che quella colonna non e' grigia per caso
        if (giorni.length && !giorni.includes(n)) s.className = "is-off";
        riga.appendChild(s);
      });
      pannello.appendChild(riga);

      // ── la griglia
      const griglia = document.createElement("div");
      griglia.className = "date-cal-grid";
      // quante caselle vuote davanti al primo: lunedi' = 0
      const salto = (new Date(anno, m, 1).getDay() + 6) % 7;
      for (let i = 0; i < salto; i++) {
        const vuota = document.createElement("span");
        griglia.appendChild(vuota);
      }
      const quanti = new Date(anno, m + 1, 0).getDate();
      for (let g = 1; g <= quanti; g++) {
        const iso = dataLocale(new Date(anno, m, g));
        const b = document.createElement("button");
        b.type = "button";
        b.className = "date-cal-day";
        b.textContent = String(g);
        if (!utile(iso)) {
          b.disabled = true;
        } else {
          b.addEventListener("click", () => scegli(iso));
        }
        if (iso === dateInput.value) {
          b.classList.add("is-on");
          b.setAttribute("aria-current", "date");
        }
        griglia.appendChild(b);
      }
      pannello.appendChild(griglia);
    }

    function freccia(passo, chiave, si_puo) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "date-cal-nav";
      b.textContent = passo < 0 ? "\u2039" : "\u203a";
      b.setAttribute("aria-label", t(chiave));
      b.disabled = !si_puo;
      b.addEventListener("click", () => {
        mese = new Date(mese.getFullYear(), mese.getMonth() + passo, 1);
        disegna();
      });
      return b;
    }

    function scegli(iso) {
      dateInput.value = iso;
      // Chi ascoltava il campo continua a funzionare senza sapere che il
      // calendario esiste: l'avviso del giorno e il totale stanno su `input`.
      dateInput.dispatchEvent(new Event("input", { bubbles: true }));
      etichetta();
      chiudi();
      apri_btn.focus();
    }

    function apri() {
      pannello.hidden = false;
      apri_btn.setAttribute("aria-expanded", "true");
      disegna();
      // aperto in fondo alla finestra resterebbe mezzo fuori
      pannello.scrollIntoView({ block: "nearest" });
    }

    function chiudi() {
      pannello.hidden = true;
      apri_btn.setAttribute("aria-expanded", "false");
    }

    apri_btn.addEventListener("click", () => {
      if (pannello.hidden) apri(); else chiudi();
    });

    // Un tocco fuori chiude, come fa il suggerimento degli hotel.
    //
    // **In fase di cattura**, e non e' un dettaglio: la freccia del mese
    // ridisegna il pannello, quindi si cancella da sola dal documento. Con
    // l'ascoltatore normale questo arrivava dopo, trovava un bottone che non
    // stava piu' nella pagina — `contains()` su un elemento staccato dice
    // sempre "fuori" — e chiudeva il calendario appena si cambiava mese.
    // Sembrava aperto perche' il contenuto restava scritto, ma era chiuso, e
    // da li' in poi non si aggiornava piu'.
    // In cattura la domanda "dentro o fuori" se la fa **prima** che qualcuno
    // possa toccare il documento, quando il bersaglio e' ancora al suo posto.
    document.addEventListener("click", e => {
      if (!pannello.hidden && !dateField.contains(e.target)) chiudi();
    }, true);

    etichetta();

    return {
      aperto: () => !pannello.hidden,
      chiudi,
      // Ridisegna quello che c'e'. Serve al cambio lingua — mese, iniziali dei
      // giorni ed etichetta sono tutti tradotti — e **tiene il mese guardato**:
      // chi sta guardando ottobre e cambia lingua deve restare a ottobre.
      rifai() {
        etichetta();
        if (!pannello.hidden) disegna();
      },
      // A ogni apertura della finestra: la scheda e' un'altra e i giorni buoni
      // sono altri, quindi il mese riparte da quello della prima data utile.
      azzera() {
        mese = null;
        etichetta();
      }
    };
  }

  function aggiornaGiorno() {
    if (!dayErrorEl) return;
    const ok = giornoValido();
    if (!ok && current) {
      dayErrorEl.textContent = t("req.dayError", {
        giorni: giorniTesto(giorniDi(current, sceltaCorrente(current)))
      });
    }
    dayErrorEl.hidden = ok;
  }

  // Le lingue fra cui scegliere. Compare **solo** dove l'attivita' ha il campo
  // `languages`: sulle altre la domanda non ha senso e non si fa. Come per gli
  // orari, la prima voce non impegna a niente.
  function riempiLingue(tour) {
    if (!langEl || !langLabelEl) return;
    const lingue = Array.isArray(tour.languages) ? tour.languages : [];
    langEl.hidden = !lingue.length;
    langLabelEl.hidden = !lingue.length;
    if (!lingue.length) return;

    const scelta = langEl.value;
    langEl.innerHTML = "";
    const qualunque = document.createElement("option");
    qualunque.value = "";
    qualunque.textContent = t("req.langAny");
    langEl.appendChild(qualunque);
    lingue.forEach(lingua => {
      const voce = document.createElement("option");
      voce.value = lingua;
      // le lingue sono gia' scritte nella lingua stessa: non si traducono
      voce.textContent = lingua;
      langEl.appendChild(voce);
    });
    langEl.value = scelta;
  }

  // Le esigenze sul menu, sulle attivita' dove si mangia. Come le lingue,
  // compare **solo** dove l'attivita' ha il campo `menus`.
  //
  // Una casella per ogni menu, col numero di persone: **non** una tendina con
  // una scelta sola. Una coppia in cui uno mangia standard e l'altro
  // vegetariano e' il caso normale, non l'eccezione, e con una tendina sola
  // l'ufficio non poteva saperlo. Chi non ha esigenze lascia tutto a zero.
  //
  // Le allergie non stanno qui: sono troppo diverse una dall'altra per fare
  // una casella ciascuna, e la riga sotto ricorda di scriverle nelle note.
  // Il campo dei neonati compare **solo** dove la scheda dice qualcosa su di
  // loro (`priceInfant` scritto, gratis o a pagamento che sia). Dove il campo
  // manca non sappiamo nemmeno se salgono, quindi chiederne il numero
  // prometterebbe una risposta che non abbiamo. Nascosto, si azzera: se no un
  // "1" lasciato su un'altra scheda resterebbe li' a vista.
  function mostraNeonati(tour) {
    if (!babiesBox || !babiesInput) return;
    const haNeonati = tour && tour.priceInfant !== undefined;
    babiesBox.hidden = !haNeonati;
    if (!haNeonati) babiesInput.value = "0";
  }

  // Il campo dei bambini sparisce sulle schede solo per adulti (proprietario,
  // 19 ottobre 2026): Scandal Dinner Show dai 16 anni accettava "2 adulti e 1
  // bambino", il totale spariva e la richiesta partiva lo stesso. Nascosto, si
  // azzera, come quello dei neonati.
  function mostraBambini(tour) {
    const box = kidsInput && kidsInput.closest("label");
    if (!box) return;
    const spento = soloAdulti(tour);
    box.hidden = spento;
    if (spento) kidsInput.value = "0";
  }

  // Le fasce d'eta' accanto ai numeri: su Royal Delfin un bimbo di 3 anni non
  // paga e uno di 4 si', e prima si leggeva solo nella pagina dietro la finestra.
  function mostraEta(tour) {
    document.querySelectorAll("[data-request-age]").forEach(el => {
      const fascia = tour && tour.ages && tour.ages[el.dataset.requestAge];
      el.textContent = fascia ? "(" + tf(fascia) + ")" : "";
    });
  }

  // Quanti mezzi prenotare, uno per tipo. Compare solo dove la scheda ha
  // `units`, cioe' dove il prezzo e' del mezzo: sul jet ski un gruppo prende
  // quattro moto, magari due doppie e due singole, e sono quattro prezzi.
  // I prezzi accanto ai nomi sono quelli della **variante scelta**, che qui e'
  // la durata: la doppia costa 110 sul giro da 40 minuti e 200 su quello da
  // due ore. Dove di varianti non ce ne sono, i prezzi stanno sulla scheda
  // (`tour.unitPrices`): e' il caso della Mustang, dove a cambiare non e' la
  // durata ma quanti salgono in macchina.
  function riempiUnita(tour) {
    if (!unitsRowsEl || !unitsLabelEl) return;
    const mezzi = tour && tour.units;
    const tipi = mezzi && Array.isArray(mezzi.types) ? mezzi.types : [];
    unitsRowsEl.hidden = !tipi.length;
    unitsLabelEl.hidden = !tipi.length;
    if (unitsErrorEl) unitsErrorEl.hidden = true;
    if (!tipi.length) { unitsRowsEl.innerHTML = ""; return; }

    unitsLabelEl.textContent = tf(mezzi.label);
    const variante = sceltaCorrente(tour);
    // Lo stesso ripiego che fa totaleMezzi(): senza, il totale usava
    // `tour.unitPrices` ma le righe qui restavano senza prezzo accanto, e il
    // cliente vedeva un totale comparire da numeri che non erano scritti da
    // nessuna parte.
    const prezzi = (variante && variante.unitPrices) || tour.unitPrices || {};

    // I numeri gia' messi si tengono: cambiare lingua ridisegna le righe, e
    // ritrovare azzerate le tre moto appena contate sarebbe sgradevole.
    // Stessa cosa che fanno le righe dei menu, e per la stessa ragione.
    const prima = {};
    unitsRowsEl.querySelectorAll("[data-request-unit-n]").forEach(inp => {
      prima[inp.dataset.requestUnitN] = inp.value;
    });

    unitsRowsEl.innerHTML = "";
    tipi.forEach((tipo, i) => {
      const id = "reqUnit" + i;
      const label = document.createElement("label");
      label.setAttribute("for", id);
      const nome = document.createElement("span");
      const prezzo = prezzi[tipo.key];
      nome.textContent = tf(tipo.name) + (prezzo ? " · €" + eur(prezzo) : "");
      const input = document.createElement("input");
      input.id = id;
      input.type = "number";
      input.inputMode = "numeric";
      input.min = "0";
      input.max = "20";
      // la chiave e' la posizione, non il nome: cambiando lingua il nome
      // cambia ma il numero deve restare dov'e'
      input.dataset.requestUnitN = String(i);
      // la prima riga parte da 1 e le altre da 0: chi ne vuole una sola, che
      // e' il caso piu' frequente, non deve toccare niente
      input.value = prima[String(i)] !== undefined ? prima[String(i)] : (i === 0 ? "1" : "0");
      input.addEventListener("input", () => { aggiornaUnita(); aggiornaTotale(); });
      label.appendChild(nome);
      label.appendChild(input);
      unitsRowsEl.appendChild(label);
    });
    applicaStepper(unitsRowsEl);
  }

  function unitaScelte(tour) {
    if (!unitsRowsEl || unitsRowsEl.hidden) return [];
    const tipi = (tour && tour.units && tour.units.types) || [];
    return [...unitsRowsEl.querySelectorAll("[data-request-unit-n]")].map(inp => ({
      label: tf((tipi[Number(inp.dataset.requestUnitN)] || {}).name || ""),
      n: parseInt(inp.value, 10) || 0
    }));
  }

  // Zero mezzi non e' una richiesta: si dice sotto le caselle e non si parte,
  // come per il giorno sbagliato e per i menu di troppo.
  function unitaValide() {
    if (!current || !unitsRowsEl || unitsRowsEl.hidden) return true;
    return unitaScelte(current).reduce((tot, u) => tot + u.n, 0) > 0;
  }

  function aggiornaUnita() {
    if (!unitsErrorEl) return;
    const ok = unitaValide();
    if (!ok) unitsErrorEl.textContent = t("req.unitsError");
    unitsErrorEl.hidden = ok;
  }

  // Dove si contano i mezzi non si contano le persone. Sul jet ski il prezzo
  // e' della moto e un gruppo di quattro puo' essere due doppie, oppure una
  // doppia e due singole: chiedere anche "quanti adulti" fa scrivere due volte
  // la stessa cosa in due modi che non tornano.
  function mostraPersone(tour) {
    if (!peopleBoxEl || !peopleLabelEl) return;
    const aMezzo = !!(tour && tour.units);
    peopleBoxEl.hidden = aMezzo;
    peopleLabelEl.hidden = aMezzo;
  }

  function riempiMenu(tour) {
    if (!menuRowsEl || !menuLabelEl) return;
    const voci = Array.isArray(tour.menus) ? tour.menus : [];
    menuRowsEl.hidden = !voci.length;
    menuLabelEl.hidden = !voci.length;
    if (menuHintEl) menuHintEl.hidden = !voci.length;
    if (menuErrorEl) menuErrorEl.hidden = true;
    if (!voci.length) { menuRowsEl.innerHTML = ""; return; }

    // I numeri gia' messi si tengono, se la voce c'e' ancora: cambiare lingua
    // ridisegna le righe e sarebbe sgradevole ritrovarle azzerate.
    const prima = {};
    menuRowsEl.querySelectorAll("[data-request-menu-n]").forEach(inp => {
      prima[inp.dataset.requestMenuN] = inp.value;
    });

    menuRowsEl.innerHTML = "";
    voci.forEach((voceMenu, i) => {
      const etichetta = tf(voceMenu);
      const id = "reqMenu" + i;
      const label = document.createElement("label");
      label.setAttribute("for", id);
      const nome = document.createElement("span");
      nome.textContent = etichetta;
      const input = document.createElement("input");
      input.id = id;
      input.type = "number";
      input.inputMode = "numeric";
      input.min = "0";
      input.max = "30";
      // la chiave e' l'indice, non l'etichetta: cambiando lingua l'etichetta
      // cambia ma il numero deve restare dov'e'
      input.dataset.requestMenuN = String(i);
      input.value = prima[String(i)] !== undefined ? prima[String(i)] : "0";
      input.addEventListener("input", aggiornaMenu);
      label.appendChild(nome);
      label.appendChild(input);
      menuRowsEl.appendChild(label);
    });
    applicaStepper(menuRowsEl);
  }

  // Quante persone per ogni menu, come le legge il form.
  function menuScelti(tour) {
    if (!menuRowsEl || menuRowsEl.hidden) return [];
    const voci = Array.isArray(tour && tour.menus) ? tour.menus : [];
    return [...menuRowsEl.querySelectorAll("[data-request-menu-n]")].map(inp => ({
      label: tf(voci[Number(inp.dataset.requestMenuN)] || ""),
      n: parseInt(inp.value, 10) || 0
    }));
  }

  // Piu' menu speciali che persone e' sicuramente un errore: si dice subito,
  // sotto le caselle, e la richiesta non parte. Stessa idea del giorno
  // sbagliato sotto la data.
  function menuValido() {
    if (!current || !menuRowsEl || menuRowsEl.hidden) return true;
    const somma = menuScelti(current).reduce((tot, m) => tot + m.n, 0);
    const persone = (parseInt(adultsInput.value, 10) || 0) +
                    (parseInt(kidsInput.value, 10) || 0);
    return somma <= persone;
  }

  function aggiornaMenu() {
    if (!menuErrorEl) return;
    const ok = menuValido();
    if (!ok) menuErrorEl.textContent = t("req.menuError");
    menuErrorEl.hidden = ok;
  }

  function riempiOrari(tour) {
    if (!timeEl) return;
    // Dove il pulmino passa a prendere la gente in hotel, l'ora non si sceglie:
    // la decide dove dormi. Al Cleopatra si parte alle 9:15 e basta. Chiedere
    // "a che ora" e proporre "Da concordare" sarebbe una domanda finta, e
    // peggio: farebbe credere che l'ora si tratti. Il menu sparisce, e l'ora
    // la dice la riga del punto di raccolta sotto il campo dell'hotel.
    const oraDaHotel = typeof PICKUP_TIMES !== "undefined" && tour && PICKUP_TIMES[tour.id];
    // l'etichetta la accende il campo dell'hotel quando sa l'ora: qui si parte
    // sempre spenta, per non lasciarla sospesa su un menu che non c'e' piu'
    if (timeLabelEl) timeLabelEl.hidden = !!oraDaHotel;
    if (oraFissaEl2) oraFissaEl2.hidden = true;
    timeEl.hidden = !!oraDaHotel;
    if (oraDaHotel) {
      // se resta un valore vecchio, il messaggio porterebbe un orario che il
      // cliente non ha scelto e che non c'entra col suo hotel
      timeEl.innerHTML = "";
      timeEl.value = "";
      return;
    }
    const scelto = timeEl.value;
    timeEl.innerHTML = "";
    // Su certe barche l'orario dipende dalla durata scelta: il giro di 2 ore
    // parte alle 11:00 e quello di 3 alle 10:00. Se la variante ha i suoi
    // orari valgono quelli, se no quelli dell'attivita'.
    const scelta = sceltaCorrente(tour);
    const veri = (scelta && scelta.times) || tour.times;
    // Tre casi diversi, e "Da concordare" ne riguarda solo due.
    //   orari veri     → si sceglie fra quelli e basta. Offrire "Da concordare"
    //                    dove la barca parte alle 10:00 e alle 13:00 fa credere
    //                    che l'ora si tratti, e non e' vero.
    //   times: []      → il charter: la barca e' tua e l'ora la concordi davvero.
    //                    Li' "Da concordare" e' l'unica voce onesta.
    //   campo assente  → gli orari veri non li sappiamo ancora. Restano le fasce
    //                    segnaposto, che il cliente legge come preferenza, piu'
    //                    "Da concordare" per chi non ne ha una.
    const orari = veri || ORARI_PREDEFINITI;
    if (!veri || !orari.length) {
      const qualunque = document.createElement("option");
      qualunque.value = "";
      qualunque.textContent = t("req.timeAny");
      timeEl.appendChild(qualunque);
    }
    // Con la data gia' scelta, le partenze a meno di 24 ore si spengono: si
    // vedono, ma non si possono prendere.
    const giorno = dateInput && dateInput.value;
    orari.forEach(ora => {
      // fuori stagione quella partenza non esiste: non si spegne, sparisce
      if (!orarioInStagione(tour, scelta, ora, giorno)) return;
      const voce = document.createElement("option");
      voce.value = ora;
      voce.textContent = ora;
      if (giorno && !partenzaPossibile(giorno, ora)) voce.disabled = true;
      timeEl.appendChild(voce);
    });
    // al cambio lingua si ricostruisce: la scelta del cliente non si perde
    timeEl.value = scelto;
    // Cambiando variante l'orario di prima puo' non esistere piu' (dal charter
    // al giro condiviso), o cambiando giorno puo' essersi spento: si riparte
    // dalla prima voce che si puo' prendere.
    if (timeEl.selectedIndex < 0 || (timeEl.selectedOptions[0] && timeEl.selectedOptions[0].disabled)) {
      const prima = [...timeEl.options].findIndex(o => !o.disabled);
      timeEl.selectedIndex = prima < 0 ? 0 : prima;
    }
  }

  // "2 adulti × €55 + 1 bambino × €30" e sopra, grosso, "Totale €140". Si
  // aggiorna mentre il cliente cambia i numeri, cosi' vede quanto spende prima
  // di aprire WhatsApp invece di doverlo chiedere. Il conto vero e proprio lo
  // fa calcolaTotale() piu' in alto, che serve anche al messaggio.
  function aggiornaTotale() {
    if (!totalEl || !current || !adultsInput || !kidsInput) return;
    const conto = calcolaTotale(current, {
      adults: parseInt(adultsInput.value, 10) || 0,
      kids: parseInt(kidsInput.value, 10) || 0,
      babies: (babiesBox && !babiesBox.hidden && babiesInput)
        ? (parseInt(babiesInput.value, 10) || 0) : 0,
      transfer: !!(transferInput && transferInput.checked),
      transferSiam: !!(transferSiamInput && transferSiamInput.checked),
      // senza la variante il totale userebbe il prezzo sbagliato su tutte le
      // schede dove il prezzo dipende dalla durata
      option: opzioneScelta(),
      units: unitaScelte(current)
    });
    if (!conto) {
      totalEl.hidden = true;
      return;
    }
    totalEl.innerHTML =
      '<strong>' + t("req.total") + ' €' + eur(conto.totale) + '</strong>' +
      '<span>' + conto.dettaglio + '</span>';
    totalEl.hidden = false;
  }

  function close() {
    // il suggerimento dell'hotel vive per conto suo e non sa che la finestra
    // si sta chiudendo: glielo diciamo, se no resta aperto sotto
    document.dispatchEvent(new CustomEvent("islarequestclose"));
    dialog.classList.remove("is-open");
    scrim.classList.remove("is-visible");
    document.body.classList.remove("menu-open");
    setTimeout(() => {
      dialog.hidden = true;
      scrim.hidden = true;
    }, 300);
  }

  // Le schede sono ricreate a ogni filtro, quindi si ascolta sul contenitore
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-request-add]");
    if (!btn) return;
    // La lista ha un tetto: oltre non si aggiunge, e si dice perche' invece di
    // far finta di aver aggiunto. Adesso che la lista e' l'unica strada questo
    // e' un vicolo chiuso, ma il messaggio dice gia' come uscirne — "mandaci
    // questa richiesta e poi ne inizi un'altra".
    if (typeof listaEPiena === "function" && listaEPiena()) {
      listaToast(t("lista.full", { n: LISTA_MAX }));
      return;
    }
    const tour = ESPLORA_CATALOG.find(t => t.id === btn.dataset.requestAdd);
    if (tour) open(tour);
  });

  dateInput.addEventListener("input", aggiornaGiorno);
  dateInput.addEventListener("change", aggiornaGiorno);
  // Scelto il giorno, il menu delle ore si rifa': domani le partenze a meno di
  // 24 ore si spengono (riempiOrari).
  dateInput.addEventListener("input", () => { if (current) riempiOrari(current); });

  // I due transfer si escludono a vicenda: un cliente sta o al nord o al sud,
  // non in tutti e due i posti. Spuntarne uno toglie la spunta all'altro.
  if (transferInput && transferSiamInput) {
    transferInput.addEventListener("change", () => {
      if (transferInput.checked) transferSiamInput.checked = false;
    });
    transferSiamInput.addEventListener("change", () => {
      if (transferSiamInput.checked) transferInput.checked = false;
    });
  }

  // Il transfer spuntato o tolto cambia due cose: la domanda sull'hotel
  // (initHotelField, che ascolta "islatransfer") e il punto di ritrovo, che si
  // mostra solo a chi al porto ci va da solo.
  [transferInput, transferSiamInput].forEach(campo => {
    if (!campo) return;
    campo.addEventListener("change", () => {
      aggiornaRitrovo();
      document.dispatchEvent(new CustomEvent("islatransfer"));
    });
  });

  // Il totale segue i numeri mentre il cliente li cambia, e la spunta dei
  // transfer perche' col transfer il prezzo e' un altro.
  [adultsInput, kidsInput, babiesInput, transferInput, transferSiamInput].forEach(campo => {
    if (!campo) return;
    campo.addEventListener("input", aggiornaTotale);
    campo.addEventListener("change", aggiornaTotale);
  });
  // Il controllo sui menu dipende da quante persone sono: se il cliente toglie
  // una persona dopo aver messo i menu, l'avviso deve accendersi subito.
  [adultsInput, kidsInput].forEach(campo => {
    if (!campo) return;
    campo.addEventListener("input", aggiornaMenu);
    campo.addEventListener("change", aggiornaMenu);
  });

  document.querySelectorAll("[data-request-close]").forEach(b =>
    b.addEventListener("click", close)
  );
  scrim.addEventListener("click", close);
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape" || !dialog.classList.contains("is-open")) return;
    // Col calendario aperto, Escape chiude quello: chiudere tutta la finestra
    // butterebbe via anche quello che il cliente ha gia' scritto.
    if (calendario && calendario.aperto()) { calendario.chiudi(); return; }
    close();
  });

  // Se la lingua cambia mentre la finestra è aperta, cambia anche il nome
  // dell'attività in cima.
  document.addEventListener("islalang", () => {
    if (!current) return;
    aggiornaAttivita(current);
    mostraEta(current);
    if (seasonEl && current.season) seasonEl.textContent = tf(current.season);
    const transfer = transferDi(current, VARIANTE_APERTA);
    if (transferNoteEl && transfer) transferNoteEl.textContent = tf(transfer);
    aggiornaRitrovo();
    if (transferLabelEl) transferLabelEl.textContent = current.transferLabel ? tf(current.transferLabel) : t("req.transfer");
    if (transferSiamNoteEl && current.transferSiam) transferSiamNoteEl.textContent = tf(current.transferSiam);
    if (transferSiamLabelEl) transferSiamLabelEl.textContent = current.transferSiamLabel ? tf(current.transferSiamLabel) : t("req.transferSiam");
    // Il calendario ha dentro il nome del mese, le iniziali dei giorni e
    // l'etichetta del campo: tutti e tre tradotti.
    if (calendario) calendario.rifai();
    // "Da concordare" e "2 adulti × €55" sono tradotti: si rifanno tutti e due
    riempiOrari(current);
    riempiLingue(current);
    riempiMenu(current);
    mostraNeonati(current);
    mostraBambini(current);
    mostraPersone(current);
    riempiUnita(current);
    aggiornaTotale();
    aggiornaGiorno();
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!current) return;

    const req = {
      date: dateInput.value,
      time: timeEl ? timeEl.value : "",
      lang: (langEl && !langEl.hidden) ? langEl.value : "",
      menus: menuScelti(current),
      adults: parseInt(document.getElementById("reqAdults").value, 10) || 1,
      kids: parseInt(document.getElementById("reqKids").value, 10) || 0,
      babies: (babiesBox && !babiesBox.hidden && babiesInput)
        ? (parseInt(babiesInput.value, 10) || 0) : 0,
      units: unitaScelte(current),
      hotel: hotelInputValue(),
      note: document.getElementById("reqNote").value.trim(),
      transfer: !!(transferInput && transferInput.checked),
      transferSiam: !!(transferSiamInput && transferSiamInput.checked),
      option: opzioneScelta()
    };
    // Prima lo diceva `required` col fumetto del browser. Su un campo nascosto
    // non si puo', quindi l'avviso e' il nostro, nel posto dove prima usciva
    // quello del giorno sbagliato.
    if (!req.date) {
      if (dayErrorEl) {
        dayErrorEl.textContent = t("req.dateMissing");
        dayErrorEl.hidden = false;
      }
      if (dateField) dateField.scrollIntoView({ block: "center" });
      return;
    }
    // Anche l'hotel battuto a mano e non scelto dall'elenco: se il cliente
    // manda la richiesta, quello e' il suo hotel. Qui e non prima, perche'
    // prima e' solo roba scritta a meta'.
    ricordaHotel(req.hotel);
    // Il giorno sbagliato ferma la richiesta: il messaggio e' gia' li' sotto
    // la data da quando l'ha scelta.
    //
    // Provato a toglierlo l'8 settembre 2026 e **rimesso lo stesso giorno**,
    // per scelta del proprietario: un'escursione non si prenota nel giorno in
    // cui non c'e', punto. Che i giorni possano cambiare con la lingua si dice
    // al cliente in una nota della scheda, non lasciandogli mandare una
    // richiesta per un giorno in cui non si parte.
    // `dateInput` e' nascosto: metterlo a fuoco non farebbe niente. Il posto
    // dove mandare il cliente e' il pulsante che apre il calendario.
    if (!giornoValido()) {
      aggiornaGiorno();
      const apri = dateField && dateField.querySelector(".date-open");
      if (apri) apri.focus();
      return;
    }
    // Piu' menu speciali che persone: stessa idea, l'avviso e' gia' sotto le
    // caselle da quando ha messo il numero di troppo.
    if (!menuValido()) { aggiornaMenu(); return; }
    if (!unitaValide()) { aggiornaUnita(); return; }

    // Non si va su WhatsApp: la richiesta si mette nella lista e il cliente
    // continua a guardare le altre escursioni. Il messaggio parte dalla
    // finestra della lista, dove il nome si chiede una volta sola.
    if (typeof listaAggiungi !== "function") return;

    // Si salva la scelta, non il prezzo: i prezzi cambiano, e un prezzo
    // salvato ieri nel browser del cliente domani sarebbe sbagliato. Il
    // conto si rifa' ogni volta leggendo il catalogo.
    listaAggiungi({
      id: current.id,
      date: req.date,
      time: req.time,
      lang: req.lang,
      // nella lista si salva il riepilogo gia' scritto ("1 Vegetariano · 1
      // Menu standard"), come si fa gia' per la variante e per la lingua
      menu: menuTesto(req),
      // e i numeri, per riscriverla nella lingua giusta (menuTesto)
      menuN: (req.menus || []).map(m => m.n),
      adults: req.adults,
      kids: req.kids,
      babies: req.babies,
      option: req.option,
      // la posizione oltre al testo: il testo serve a leggerla anche se un
      // domani la variante non c'e' piu', la posizione a ritrovare i prezzi
      optionIndex: indiceVariante(current),
      // qui i **numeri** e non il riepilogo gia' scritto come per i menu: il
      // totale della lista si rifa' ogni volta leggendo i prezzi di adesso,
      // e da un testo non si puo'
      units: req.units,
      transfer: req.transfer,
      transferSiam: req.transferSiam,
      hotel: req.hotel,
      note: req.note
    });
    close();
  });
}

document.addEventListener("DOMContentLoaded", initRequestDialog);

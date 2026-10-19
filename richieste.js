// LE RICHIESTE MANDATE SU WHATSAPP, SALVATE ANCHE NEL DATABASE
//
// Il cliente senza ticket di carta manda la lista delle escursioni su WhatsApp
// (lista.js). Nello stesso momento le stesse escursioni vanno su Supabase come
// "da confermare": l'ufficio le conferma o le annulla da venditori.html, e il
// cliente vede lo stato nella sua pagina (booking.html?richieste=1).
//
// COME IL CLIENTE RITROVA LE SUE RICHIESTE, SENZA LOGIN E SENZA TELEFONO
//   Ogni richiesta ha due cose inventate qui, nel telefono del cliente:
//   - la CHIAVE (token): lunga, impossibile da indovinare. Resta solo qui, in
//     localStorage, e chi ce l'ha legge la richiesta. Non va mai nel messaggio.
//   - il CODICE (6 lettere, "K7PM3Q"): va nel messaggio WhatsApp e serve
//     all'ufficio per trovare la richiesta nell'elenco. Da solo non apre niente.
//   Lo schema e le regole stanno in supabase/modifiche/2026-09-30-richieste-whatsapp.sql.
//
// SE MANCA IL CAMPO
//   La richiesta si salva prima qui, poi si manda. Se l'invio non riesce
//   (niente rete, WhatsApp che si apre e chiude la pagina) resta "da mandare"
//   e si riprova da sola alla prossima pagina aperta. Il database non crea
//   doppioni: la stessa chiave mandata due volte entra una volta sola.
//
// Serve SUPABASE_URL (supabase-config.js). Senza, le richieste si ricordano
// solo nel telefono.

const RICHIESTE_KEY = "isla-richieste";
// Come il tetto del database: oltre, la richiesta piu' vecchia esce dal telefono.
const RICHIESTE_MAX = 50;

function richiesteLeggi() {
  try {
    const r = JSON.parse(localStorage.getItem(RICHIESTE_KEY) || "[]");
    return Array.isArray(r) ? r : [];
  } catch (e) { return []; }
}

function richiesteScrivi(elenco) {
  try {
    localStorage.setItem(RICHIESTE_KEY, JSON.stringify(elenco.slice(-RICHIESTE_MAX)));
  } catch (e) { /* incognito: si va avanti senza ricordare */ }
}

// Niente lettere che si confondono al telefono (0/O, 1/I/L).
function richiestaCodice() {
  const lettere = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const numeri = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(numeri, n => lettere[n % lettere.length]).join("");
}

function richiestaChiave() {
  if (crypto.randomUUID) return crypto.randomUUID();
  // browser vecchi: lo stesso formato, fatto a mano
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, x => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

// Dalle voci della lista a quello che va nel database.
// La variante si salva col nome italiano, come fanno i venditori coi ticket
// di carta (option_label, vedi schema.sql).
// Un pacchetto della lista diventa una riga per ogni sua escursione, tutte
// col giorno d'inizio: i giorni veri li fissa l'ufficio quando conferma.
function richiestaVoci(voci) {
  return voci.reduce((righe, voce) => {
    if (!voce.pack) return righe.concat(richiestaVoce(voce));
    const pack = typeof pacchettoDi === "function" ? pacchettoDi(voce.pack) : null;
    return pack ? righe.concat(pacchettoVociRichiesta(pack, voce).map(richiestaVoce)) : righe;
  }, []);
}

function richiestaVoce(voce) {
  const tour = ESPLORA_CATALOG.find(x => x.id === voce.id);
  const scelta = tour && tour.options && Array.isArray(tour.options.choices)
    ? tour.options.choices[voce.optionIndex] : null;
  const etichetta = scelta ? scelta.label : voce.option;
  const hotel = (voce.hotel || "").trim();
  // hotelPunto e transferDi stanno in escursioni.js, che c'e' su tutte le
  // pagine della lista
  const conTransfer = !!(voce.transfer && typeof transferDi === "function" && transferDi(tour, scelta));
  const punto = hotel && typeof hotelPunto === "function" ? hotelPunto(hotel, voce.id, conTransfer) : null;
  // Chi non viene preso in hotel si presenta al punto di ritrovo della scheda
  // (15 ottobre 2026): va nella stessa colonna, cosi' la conferma dei
  // venditori parte gia' col posto scritto. In italiano, come la variante.
  const ritrovo = !punto && tour && typeof ritrovoDaMostrare === "function"
    ? ritrovoDaMostrare(tour, scelta, voce.transfer) : null;
  return {
    excursion_id: voce.id,
    option_label: (etichetta && typeof etichetta === "object" ? etichetta.it : etichetta) || null,
    date: voce.date,
    wanted_time: voce.time || null,
    adults: voce.adults || 0,
    kids: voce.kids || 0,
    babies: voce.babies || 0,
    // Dal 13 ottobre 2026 (proprietario) anche l'hotel e il punto di raccolta
    // che ne esce, gli stessi del messaggio: in venditori.html il modulo
    // "Conferma" parte gia' riempito. Il cliente non li rilegge.
    hotel: hotel || null,
    // "il tuo hotel" diventa il nome dell'hotel: e' quello che leggera' il
    // cliente sul ticket, accanto all'ora
    pickup_point: punto ? (punto.dove === "hotel" ? hotel : punto.nome)
      : ritrovo ? (typeof ritrovo === "object" ? ritrovo.it : ritrovo) : null,
    pickup_time: (punto && punto.ora) || null,
    // Dove il transfer si puo' scegliere, se il cliente l'ha chiesto: su
    // alcune schede cambia il netto (18 ottobre 2026). Altrove resta
    // undefined, e JSON.stringify non lo manda nemmeno.
    transfer: tour && typeof transferDi === "function" && transferDi(tour, scelta)
      ? !!voce.transfer : undefined
  };
}

// Chiamata diretta invece della libreria di Supabase: la libreria pesa 200 KB
// e servirebbe su ogni pagina solo per questo. `keepalive` fa arrivare la
// richiesta anche se intanto la pagina se ne va verso WhatsApp.
function richiestaManda(r) {
  if (typeof SUPABASE_URL === "undefined" || typeof fetch !== "function") return Promise.resolve(false);
  return fetch(SUPABASE_URL + "/rest/v1/rpc/manda_richiesta", {
    method: "POST",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY
    },
    // nome e messaggio solo se ci sono: una richiesta rimasta nel telefono da
    // prima del 13 ottobre non li ha
    body: JSON.stringify(Object.assign(
      { p_token: r.token, p_code: r.code, p_items: r.items },
      r.name ? { p_name: r.name } : {},
      r.message ? { p_message: r.message } : {},
      // il codice sconto del venditore (lista.js, 19 ottobre 2026): il
      // database lo tiene solo se esiste ed e' acceso
      r.discountCode ? { p_discount_code: r.discountCode } : {}))
  }).then(risposta => {
    if (!risposta.ok) return false;
    const elenco = richiesteLeggi();
    const qui = elenco.find(x => x.token === r.token);
    if (qui) { qui.stored = true; richiesteScrivi(elenco); }
    return true;
  }).catch(() => false);
}

// La lista sta per partire su WhatsApp: si salva la richiesta e si prova a
// mandarla. Restituisce il codice da scrivere nel messaggio.
// `iscrizione` e' l'indirizzo del telefono per gli avvisi (avvisiIscrizione),
// o null se il cliente non li vuole: parte nello stesso momento della
// richiesta, perche' subito dopo la pagina se ne va verso WhatsApp.
// `scriviTesto(codice)` rifa' il messaggio WhatsApp col codice dentro: il
// codice nasce qui, quindi il messaggio si puo' scrivere solo dopo.
// `codiceSconto`: quello del venditore, gia' controllato, o "".
function richiestaNuova(voci, iscrizione, nome, scriviTesto, codiceSconto) {
  const code = richiestaCodice();
  const r = {
    token: richiestaChiave(),
    code: code,
    sentAt: new Date().toISOString(),
    items: richiestaVoci(voci),
    name: nome || "",
    message: typeof scriviTesto === "function" ? scriviTesto(code) : "",
    discountCode: codiceSconto || "",
    stored: false
  };
  if (iscrizione) r.avvisi = "da-mandare";
  const elenco = richiesteLeggi();
  elenco.push(r);
  richiesteScrivi(elenco);
  richiestaManda(r);
  if (iscrizione) avvisiManda(r, iscrizione);
  return r.code;
}

// GLI AVVISI SUL TELEFONO (13 ottobre 2026)
//
// Chi manda la lista puo' chiedere un avviso quando l'ufficio conferma o
// annulla, e un promemoria prima dell'escursione. Li manda la funzione
// supabase/functions/manda-notifiche; qui il telefono si iscrive e basta.
// Le regole stanno in supabase/modifiche/2026-10-13-notifiche.sql.
//
// L'iscrizione e' legata alla CHIAVE della richiesta, come la lettura dello
// stato: niente login, niente telefono. Sull'iPhone gli avvisi esistono solo
// con l'app installata sulla schermata Home (iOS 16.4 e dopo): in Safari
// PushManager non c'e', e la casella non si mostra.

function avvisiPossibili() {
  return typeof VAPID_PUBLIC_KEY !== "undefined" && typeof SUPABASE_URL !== "undefined" &&
    "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

// iPhone o iPad in Safari, senza l'app installata: gli avvisi ci sarebbero,
// ma solo installando. L'iPad nuovo si presenta come un Mac: lo tradisce il
// tocco.
function avvisiSoloConApp() {
  if (avvisiPossibili()) return false;
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const installata = window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
  return ios && !installata;
}

// La chiave pubblica e' scritta in base64 "da indirizzo" (- e _ al posto di
// + e /, senza =); il browser la vuole come byte.
function avvisiChiave() {
  const b64 = VAPID_PUBLIC_KEY.replace(/-/g, "+").replace(/_/g, "/");
  const testo = atob(b64 + "=".repeat((4 - b64.length % 4) % 4));
  return Uint8Array.from(testo, c => c.charCodeAt(0));
}

// I Safari vecchi rispondono alla domanda del permesso con una funzione da
// richiamare invece che con una promessa: questa va bene per tutti e due.
function avvisiPermesso() {
  return new Promise(fatto => {
    const p = Notification.requestPermission(fatto);
    if (p && typeof p.then === "function") p.then(fatto, () => fatto("default"));
  });
}

// L'indirizzo del telefono per gli avvisi, o null. Con `chiedi` il browser
// mostra la sua domanda (solo la prima volta: dopo ricorda la risposta); senza,
// si usa solo un permesso gia' dato, per riprovare in silenzio.
// Il service worker non pronto entro 8 secondi vuol dire niente avvisi: il
// cliente sta aspettando di andare su WhatsApp.
function avvisiIscrizione(chiedi) {
  if (!avvisiPossibili()) return Promise.resolve(null);
  const permesso = Notification.permission === "default" && chiedi
    ? avvisiPermesso() : Promise.resolve(Notification.permission);
  return permesso.then(p => {
    if (p !== "granted") return null;
    const pronto = new Promise((fatto, errore) => {
      navigator.serviceWorker.ready.then(fatto, errore);
      setTimeout(() => errore(new Error("service worker non pronto")), 8000);
    });
    return pronto.then(reg => reg.pushManager.getSubscription().then(sub =>
      sub || (chiedi
        ? reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: avvisiChiave() })
        : null)));
  }).catch(() => null);
}

// I titoli delle escursioni della richiesta, per scriverli nell'avviso: il
// catalogo sta nel sito, la funzione sul server non lo conosce.
function avvisiTitoli(r) {
  const titoli = {};
  r.items.forEach(v => {
    const tour = ESPLORA_CATALOG.find(x => x.id === v.excursion_id);
    if (tour) titoli[v.excursion_id] = tf(tour.title).slice(0, 120);
  });
  return titoli;
}

function avvisiManda(r, iscrizione) {
  const json = iscrizione.toJSON();
  return fetch(SUPABASE_URL + "/rest/v1/rpc/avvisami", {
    method: "POST",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY
    },
    body: JSON.stringify({
      p_token: r.token,
      p_endpoint: json.endpoint,
      p_p256dh: json.keys && json.keys.p256dh,
      p_auth: json.keys && json.keys.auth,
      p_lang: getLang(),
      p_titoli: avvisiTitoli(r)
    })
  }).then(risposta => {
    if (!risposta.ok) return false;
    const elenco = richiesteLeggi();
    const qui = elenco.find(x => x.token === r.token);
    if (qui) { qui.avvisi = "ok"; richiesteScrivi(elenco); }
    return true;
  }).catch(() => false);
}

// Il giorno del calendario qui ("2026-10-16"), spostato di `quanti` giorni.
// Non toISOString(): passa per UTC, e a Tenerife d'estate fra mezzanotte e
// l'una darebbe ancora ieri (vedi minRequestDate in escursioni.js). Qui serve
// la propria copia: booking.html carica questo file senza escursioni.js.
function richiesteGiorno(quanti) {
  const d = new Date();
  d.setDate(d.getDate() + quanti);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Quelle rimaste "da mandare" si riprovano. Restituisce una promessa che si
// chiude quando hanno finito tutte (booking.js la aspetta prima di leggere).
// Una richiesta con le date gia' passate il database la rifiuta: non si
// riprova all'infinito.
// Stessa cosa per gli avvisi chiesti e non arrivati: si riprova in silenzio,
// col permesso gia' dato. Se intanto il cliente l'ha tolto, non si chiede.
function richiesteRiprova() {
  const ieri = richiesteGiorno(-1);
  const vive = richiesteLeggi().filter(r => r.items.some(v => v.date >= ieri));
  const avvisi = vive.filter(r => r.avvisi === "da-mandare");
  return Promise.all(vive.filter(r => !r.stored).map(richiestaManda).concat(
    avvisi.length
      ? avvisiIscrizione(false).then(sub => sub && Promise.all(avvisi.map(r => avvisiManda(r, sub))))
      : []));
}

// Le escursioni salvate qui, divise come le mostra booking.js: "ticket" le
// confermate col numero (l'ufficio da' sempre un ticket), "aperte" quelle in
// attesa, "annullate" le altre. Si guarda l'ultima risposta del database
// (r.last), e senza risposta la richiesta e' ancora da confermare.
function richiesteConta() {
  const conta = { ticket: 0, aperte: 0, annullate: 0 };
  richiesteLeggi().forEach(r => {
    const righe = Array.isArray(r.last) && r.last.length ? r.last : r.items;
    righe.forEach(v => {
      if (v.status === "cancelled") conta.annullate++;
      else if (v.status === "confirmed" && v.ticket_number) conta.ticket++;
      else conta.aperte++;
    });
  });
  return conta;
}

// Chiede al database lo stato di tutte le richieste di questo telefono e lo
// salva in r.last, come fa booking.js. Serve alla finestra "Il mio ticket":
// senza, una richiesta confermata dall'ufficio continuava a contare come
// "richiesta" finche' il cliente non apriva la sua pagina. Senza rete non
// cambia niente. Restituisce una promessa che dice se ha letto.
function richiesteAggiorna() {
  const elenco = richiesteLeggi();
  if (!elenco.length || typeof SUPABASE_URL === "undefined" || typeof fetch !== "function") return Promise.resolve(false);
  return fetch(SUPABASE_URL + "/rest/v1/rpc/le_mie_richieste", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY
    },
    body: JSON.stringify({ p_tokens: elenco.map(r => r.token) })
  }).then(risposta => risposta.ok ? risposta.json() : null).then(rows => {
    if (!Array.isArray(rows)) return false;
    // Rilette adesso: intanto potrebbe esserne partita una nuova.
    const tenute = richiesteLeggi().filter(r => {
      r.last = rows.filter(x => x.request_token === r.token);
      return r.last.length || !r.stored;   // sparita dal database: pulizia mensile
    });
    richiesteScrivi(tenute);
    // il numerino della capsula (app.js) si ricalcola con lo stato nuovo
    document.dispatchEvent(new CustomEvent("islaprenotazioni"));
    return true;
  }).catch(() => false);
}

// Quante escursioni il cliente ha davanti: con la data da oggi in poi, in
// attesa o confermate, non annullate. E' il numerino sul biglietto della
// capsula. Vengono da due posti del telefono:
//   - le richieste mandate su WhatsApp (qui sopra), con l'ultimo stato letto;
//   - l'ultimo ticket cercato con numero e telefono, che booking.js salva in
//     "isla-ticket-risultato" (RISULTATO_KEY: booking.js non c'e' sulle altre
//     pagine, quindi il nome si riscrive qui).
// Una richiesta confermata diventa un ticket e puo' stare in tutti e due:
// numero del ticket + escursione + data la fa contare una volta sola.
function prenotazioniProssime() {
  const oggi = richiesteGiorno(0);
  const viste = new Set();
  const conta = (chiave, data) => {
    if (!data || String(data).slice(0, 10) < oggi || viste.has(chiave)) return;
    viste.add(chiave);
  };
  richiesteLeggi().forEach(r => {
    const righe = Array.isArray(r.last) && r.last.length ? r.last : r.items;
    righe.forEach((v, i) => {
      if (v.status === "cancelled") return;
      const chiave = v.ticket_number
        ? v.ticket_number + "|" + v.excursion_id + "|" + v.date
        : r.token + "|" + i;
      conta(chiave, v.date);
    });
  });
  try {
    const t = JSON.parse(localStorage.getItem("isla-ticket-risultato") || "null");
    if (t && Array.isArray(t.rows)) {
      t.rows.forEach(v => conta(v.ticket_number + "|" + v.excursion_id + "|" + v.date, v.date));
    }
  } catch (e) { /* incognito o dato rovinato: si conta quello che c'e' */ }
  return viste.size;
}

document.addEventListener("DOMContentLoaded", () => {
  // booking.js le riprova da se' e poi legge: qui non serve due volte.
  if (document.getElementById("bookingView")) return;
  // Solo chi ha richieste ancora in attesa chiede lo stato al database: se
  // l'ufficio ne ha annullata una, il numerino della capsula non la deve piu'
  // contare. Prima si riprova a mandare quelle rimaste indietro, poi si legge.
  // Quelle con la data gia' passata no: non contano nel numerino, e una
  // richiesta mai confermata farebbe chiedere al database a ogni pagina.
  const oggi = richiesteGiorno(0);
  const inAttesa = richiesteLeggi().some(r =>
    (Array.isArray(r.last) && r.last.length ? r.last : r.items)
      .some(v => v.date >= oggi && v.status !== "cancelled" && !v.ticket_number));
  richiesteRiprova().then(() => { if (inAttesa) richiesteAggiorna(); });
});

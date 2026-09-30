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

// Dalle voci della lista a quello che va nel database: solo quello che il
// cliente rivedra' nella sua pagina. Niente nome, hotel, note: quelli li
// legge l'ufficio nel messaggio WhatsApp.
// La variante si salva col nome italiano, come fanno i venditori coi ticket
// di carta (option_label, vedi schema.sql).
function richiestaVoci(voci) {
  return voci.map(voce => {
    const tour = ESPLORA_CATALOG.find(x => x.id === voce.id);
    const scelta = tour && tour.options && Array.isArray(tour.options.choices)
      ? tour.options.choices[voce.optionIndex] : null;
    const etichetta = scelta ? scelta.label : voce.option;
    return {
      excursion_id: voce.id,
      option_label: (etichetta && typeof etichetta === "object" ? etichetta.it : etichetta) || null,
      date: voce.date,
      wanted_time: voce.time || null,
      adults: voce.adults || 0,
      kids: voce.kids || 0,
      babies: voce.babies || 0
    };
  });
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
    body: JSON.stringify({ p_token: r.token, p_code: r.code, p_items: r.items })
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
function richiestaNuova(voci) {
  const r = {
    token: richiestaChiave(),
    code: richiestaCodice(),
    sentAt: new Date().toISOString(),
    items: richiestaVoci(voci),
    stored: false
  };
  const elenco = richiesteLeggi();
  elenco.push(r);
  richiesteScrivi(elenco);
  richiestaManda(r);
  return r.code;
}

// Quelle rimaste "da mandare" si riprovano. Restituisce una promessa che si
// chiude quando hanno finito tutte (booking.js la aspetta prima di leggere).
// Una richiesta con le date gia' passate il database la rifiuta: non si
// riprova all'infinito.
function richiesteRiprova() {
  const ieri = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  return Promise.all(richiesteLeggi()
    .filter(r => !r.stored && r.items.some(v => v.date >= ieri))
    .map(richiestaManda));
}

document.addEventListener("DOMContentLoaded", () => {
  // booking.js le riprova da se' e poi legge: qui non serve due volte.
  if (!document.getElementById("bookingView")) richiesteRiprova();
});

// Pagina della prenotazione: il cliente arriva qui dalla finestra del ticket
// (app.js) con il numero nell'indirizzo e il telefono salvato nel telefono.
//
// Due strade:
//   - i codici di prova (MOCK_BOOKINGS, "ISLA-4521"): la vecchia pagina finta,
//     tenuta per scelta del proprietario come segnaposto. Non chiedono telefono.
//   - tutti gli altri: i ticket di carta veri, cercati su Supabase con la
//     funzione le_mie_escursioni(telefono, ticket) — vedi supabase/schema.sql.
//     Un ticket giusto mostra TUTTE le escursioni confermate di quel telefono.
//   - booking.html?richieste=1: le richieste mandate su WhatsApp da chi non ha
//     un ticket di carta, con le chiavi salvate nel telefono (richieste.js) e
//     la funzione le_mie_richieste. Tre stati: da confermare, confermata,
//     annullata.
//
// Anche qui i testi sono nelle cinque lingue: stringa sola = uguale ovunque,
// oggetto { it, en, es } = tradotto. tf() sceglie la lingua giusta.

const MOCK_BOOKINGS = {
  "ISLA-4521": {
    title: {
      it: "Whale & Dolphin Watching in barca a vela",
      en: "Whale & Dolphin Watching by sailing boat",
      es: "Whale & Dolphin Watching en velero",
      fr: "Observation des baleines et des dauphins en voilier",
      de: "Wal- und Delfinbeobachtung mit dem Segelboot"
    },
    date: { it: "Domani, 09:30", en: "Tomorrow, 09:30", es: "Mañana, 09:30", fr: "Demain, 09:30", de: "Morgen, 09:30" },
    meetingPoint: "Puerto Colón, Muelle 3 — Costa Adeje",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
    bring: [
      { it: "Costume da bagno", en: "Swimsuit", es: "Bañador", fr: "Maillot de bain", de: "Badesachen" },
      { it: "Asciugamano", en: "Towel", es: "Toalla", fr: "Serviette", de: "Handtuch" },
      { it: "Crema solare", en: "Sun cream", es: "Crema solar", fr: "Crème solaire", de: "Sonnencreme" },
      { it: "Documento d'identità", en: "ID document", es: "Documento de identidad", fr: "Pièce d'identité", de: "Ausweisdokument" }
    ],
    notes: {
      it: "Presentati 15 minuti prima dell'orario. Cancellazione gratuita fino a 24 ore prima della partenza.",
      en: "Arrive 15 minutes before the departure time. Free cancellation up to 24 hours before departure.",
      es: "Preséntate 15 minutos antes de la hora. Cancelación gratuita hasta 24 horas antes de la salida.",
      fr: "Arrivez 15 minutes avant l'heure de départ. Annulation gratuite jusqu'à 24 heures avant le départ.",
      de: "Seien Sie 15 Minuten vor der Abfahrtszeit da. Kostenlose Stornierung bis 24 Stunden vor der Abfahrt."
    }
  },
  "TEN-7788": {
    title: "Teide Sunset Quad Trip",
    date: { it: "Oggi, 16:00", en: "Today, 16:00", es: "Hoy, 16:00", fr: "Aujourd'hui, 16:00", de: "Heute, 16:00" },
    meetingPoint: "Quad Center, Vilaflor",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas", fr: "3 heures", de: "3 Stunden" },
    bring: [
      { it: "Scarpe chiuse", en: "Closed shoes", es: "Zapato cerrado", fr: "Chaussures fermées", de: "Geschlossene Schuhe" },
      { it: "Giacca leggera (di sera fa fresco)", en: "Light jacket (it gets cool in the evening)", es: "Chaqueta ligera (por la noche refresca)", fr: "Veste légère (il fait frais le soir)", de: "Leichte Jacke (abends wird es kühl)" },
      { it: "Patente di guida", en: "Driving licence", es: "Carné de conducir", fr: "Permis de conduire", de: "Führerschein" }
    ],
    notes: {
      it: "Il tour è vietato alle donne in gravidanza. Età minima 18 anni per guidare il quad.",
      en: "The tour is not suitable for pregnant women. Minimum age to drive the quad is 18.",
      es: "El tour no está permitido a mujeres embarazadas. Edad mínima para conducir el quad: 18 años.",
      fr: "L'excursion ne convient pas aux femmes enceintes. L'âge minimum pour conduire le quad est de 18 ans.",
      de: "Die Tour ist für Schwangere nicht geeignet. Mindestalter zum Fahren des Quads ist 18."
    }
  }
};

const ICONS = {
  clock: '<svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  pin: '<svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  timer: '<svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M9 2h6"/></svg>',
  bag: '<svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></svg>',
  people: '<svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.2A4.5 4.5 0 0 1 21 18.5"/></svg>',
  info: '<svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:14px;height:14px"><path d="M20 6 9 17l-5-5"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:100%;height:100%"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  ticket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:100%;height:100%"><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4V9z"/></svg>'
};

function getCodeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return (params.get("code") || "").trim().toUpperCase();
}

function mapsUrl(place) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(place);
}

function renderBooking(booking, code) {
  document.getElementById("bookingView").innerHTML = `
    <div class="detail-card">
      <div class="detail-status">
        <span>${ICONS.check} ${t("booking.found")}</span>
        <span class="pill">${t("booking.confirmed")}</span>
      </div>
      <div class="detail-body">
        <p class="detail-code">${t("booking.code")}<strong>${code}</strong></p>
        <h1 class="detail-title">${tf(booking.title)}</h1>

        <div class="info-grid">
          <div class="info-field">
            ${ICONS.clock}
            <div>
              <h3>${t("booking.time")}</h3>
              <p>${tf(booking.date)}</p>
            </div>
          </div>
          <div class="info-field">
            ${ICONS.timer}
            <div>
              <h3>${t("booking.duration")}</h3>
              <p>${tf(booking.duration)}</p>
            </div>
          </div>
          <div class="info-field" style="grid-column:1/-1">
            ${ICONS.pin}
            <div>
              <h3>${t("booking.meeting")}</h3>
              <p>${booking.meetingPoint}</p>
              <a class="map-link" href="${mapsUrl(booking.meetingPoint)}" target="_blank" rel="noopener noreferrer">${t("booking.openMap")}</a>
            </div>
          </div>
          <div class="info-field" style="grid-column:1/-1">
            ${ICONS.bag}
            <div>
              <h3>${t("booking.bring")}</h3>
              <ul>${booking.bring.map(item => `<li>${tf(item)}</li>`).join("")}</ul>
            </div>
          </div>
        </div>

        <div class="note-box">
          <h3>${t("booking.notes")}</h3>
          <p>${tf(booking.notes)}</p>
        </div>

        <div class="detail-actions">
          <a class="btn btn-soft" href="./index.html">${t("booking.another")}</a>
          <a class="btn btn-primary" href="mailto:info@islatenerife.com?subject=${encodeURIComponent(t("booking.helpSubject") + " " + code)}">${t("booking.help")}</a>
        </div>
      </div>
    </div>
  `;
}

// ─── Il modulo per cercare (anche qui, per riprovare) ──────────────────────
// Stessi campi della finestra del ticket: app.js lo collega allo stesso modo.
function formRicerca() {
  return `
      <form class="lookup-card" data-lookup-form style="text-align:left">
        <label for="retryCode">${t("ticket.codeLabel")}</label>
        <input class="lookup-input" id="retryCode" name="code" type="text" autocomplete="off" placeholder="${t("ticket.placeholder")}" required />
        <label for="retryPhone">${t("ticket.phoneLabel")}</label>
        <div class="lookup-phone">
          <select name="prefix" data-prefix-select aria-label="${t("ticket.prefix")}"></select>
          <input class="lookup-input" id="retryPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel-national" />
        </div>
        <p class="lookup-error" data-lookup-error role="alert" hidden></p>
        <button class="btn btn-primary btn-block" type="submit">${t("common.search")}</button>
      </form>`;
}

function renderStato(icona, titolo, testo, conModulo) {
  document.getElementById("bookingView").innerHTML = `
    <div class="state">
      <div class="state-icon">${icona}</div>
      <h2>${esc(titolo)}</h2>
      <p>${esc(testo)}</p>
      ${conModulo ? formRicerca() : `<a class="btn btn-primary" href="./index.html">${t("booking.goHome")}</a>`}
    </div>
  `;
  if (conModulo) initLookupForms();
}

function renderNotFound(code) {
  renderStato(ICONS.search, t("booking.notFound"), t("booking.notFoundText", { code }), true);
}

function renderEmpty() {
  renderStato(ICONS.ticket, t("booking.noCode"), t("booking.noCodeText"), true);
}

// Il testo che arriva dal database (meeting point, variante) non si mette mai
// nell'HTML cosi' com'e': lo scrive un venditore, e un "<" lo romperebbe.
function esc(testo) {
  return String(testo === null || testo === undefined ? "" : testo)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ─── I ticket veri ─────────────────────────────────────────────────────────

// L'ultima risposta buona, salvata nel telefono: al porto senza campo il
// cliente vede lo stesso dove presentarsi e a che ora.
const RISULTATO_KEY = "isla-ticket-risultato";

function risultatoSalvato(code, phone) {
  try {
    const r = JSON.parse(localStorage.getItem(RISULTATO_KEY) || "null");
    return r && r.code === code && r.phone === phone ? r.rows : null;
  } catch (e) { return null; }
}

function salvaRisultato(code, phone, rows) {
  try {
    localStorage.setItem(RISULTATO_KEY, JSON.stringify({ code, phone, rows, at: new Date().toISOString() }));
  } catch (e) { /* incognito */ }
}

function oggiISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// "2026-10-01" → "Giovedì 1 ottobre", nella lingua scelta. La data si legge
// come giorno del calendario, non come istante: niente fusi orari di mezzo.
function dataLunga(iso) {
  if (!iso) return "";
  const [a, m, g] = iso.split("-").map(Number);
  const testo = new Intl.DateTimeFormat(getLang(), { weekday: "long", day: "numeric", month: "long" })
    .format(new Date(a, m - 1, g));
  return testo.charAt(0).toUpperCase() + testo.slice(1);
}

// "2026-09-28" → "28 settembre": il giorno in cui e' partita una richiesta.
function dataCorta(iso) {
  if (!iso) return "";
  const [a, m, g] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(getLang(), { day: "numeric", month: "long" }).format(new Date(a, m - 1, g));
}

// La variante sta nel database in italiano, la lingua dell'ufficio ("2 ore"):
// qui la si ritrova nel catalogo e la si scrive nella lingua del cliente
// ("2 Stunden"). Se il catalogo non la conosce piu' (una variante tolta o
// rinominata), resta il testo salvato: meglio in italiano che niente.
function varianteTesto(tour, etichetta) {
  const scelte = (tour && tour.options && tour.options.choices) || [];
  const scelta = scelte.find(c => (typeof c.label === "string" ? c.label : c.label.it) === etichetta);
  return scelta ? tf(scelta.label) : etichetta;
}

function persone(b) {
  const parti = [];
  const conta = (n, uno, tanti) => { if (n > 0) parti.push(n === 1 ? t(uno) : t(tanti, { n })); };
  conta(b.adults || 0, "booking.adult1", "booking.adultN");
  conta(b.kids || 0, "booking.kid1", "booking.kidN");
  conta(b.babies || 0, "booking.baby1", "booking.babyN");
  return parti.join(" · ");
}

function pagamento(b) {
  if (b.rest_to_pay === null || b.rest_to_pay === undefined) return "";
  const resto = Number(b.rest_to_pay);
  return resto === 0 ? t("booking.paid") : t("booking.toPay", { n: eur(resto) });
}

// I tre stati, ognuno col suo colore (classi is-confirmed / is-pending /
// is-cancelled in styles.css). I ticket di carta arrivano senza status: il
// database li restituisce solo confermati.
const STATI = {
  confirmed: { pill: "booking.confirmed", nota: "" },
  pending:   { pill: "booking.pending",   nota: "booking.pendingText" },
  cancelled: { pill: "booking.cancelled", nota: "booking.cancelledText" }
};

// "94 €" come lo scrive la lingua scelta
function soldiTesto(n) {
  const locale = { it: "it-IT", en: "en-GB", es: "es-ES", fr: "fr-FR", de: "de-DE" }[typeof getLang === "function" ? getLang() : "it"] || "it-IT";
  return Number(n).toLocaleString(locale, { style: "currency", currency: "EUR", minimumFractionDigits: n % 1 ? 2 : 0 });
}

function cardTicket(b, passata) {
  const tour = typeof ESPLORA_CATALOG !== "undefined" ? ESPLORA_CATALOG.find(x => x.id === b.excursion_id) : null;
  const titolo = tour ? tf(tour.title) : t("booking.otherExc");
  const status = STATI[b.status] ? b.status : "confirmed";
  const confermata = status === "confirmed";
  const ora = b.time ? b.time.slice(0, 5) : "";
  const luogo = b.meeting_point || "";
  const chi = persone(b);
  const soldi = pagamento(b);

  // "Presentati alle 9:40" + il posto: e' l'ora scritta sul ticket accanto al
  // meeting point, la stessa per tutte le escursioni (proprietario, 29/9/2026).
  // Solo una conferma dice dove e quando presentarsi. Nella richiesta ancora
  // aperta l'ora e' quella che ha chiesto il cliente, non una risposta.
  const ritrovo = !confermata ? "" : (ora || luogo) ? `
          <div class="info-field" style="grid-column:1/-1">
            ${ICONS.pin}
            <div>
              <h3>${ora ? esc(t("booking.meetAt", { time: ora })) : t("booking.meeting")}</h3>
              ${luogo ? `<p>${esc(luogo)}</p>
              <a class="map-link" href="${mapsUrl(luogo + ", Tenerife")}" target="_blank" rel="noopener noreferrer">${t("booking.openMap")}</a>` : ""}
            </div>
          </div>` : "";

  // La striscia con la foto della scheda: fa riconoscere l'escursione a colpo
  // d'occhio, e numero del ticket e "Confermata" ci stanno sopra. Le foto non
  // stanno nella cache del service worker, quindi senza rete non si caricano:
  // in quel caso la foto sparisce e la riga del numero torna quella normale
  // (tolta la classe, il testo bianco non resta sul fondo chiaro).
  // alt vuoto: il titolo e' scritto subito sotto.
  const banner = tour && tour.image
    ? `<img class="ticket-banner" src="./assets/${encodeURIComponent(tour.image)}" alt="" loading="lazy" onerror="this.parentNode.classList.remove('ticket-hero'); this.remove()" />`
    : "";
  // Il ticket di carta ha il suo numero; la richiesta mandata su WhatsApp no,
  // e si riconosce dal giorno in cui e' partita.
  const etichetta = b.ticket_number
    ? t("booking.ticketN", { code: b.ticket_number })
    : t("booking.requestOf", { date: dataCorta(b.sent_on) });
  // L'ufficio ha mandato il link di pagamento (15 ottobre 2026): la richiesta
  // aspetta solo quello, e il cliente lo ritrova qui. Solo un indirizzo https:
  // lo incolla l'ufficio, ma finisce in un link che il cliente tocca.
  const daPagare = status === "pending" && !passata && b.payment_link
    && /^https:\/\/\S+$/.test(b.payment_link) && b.payment_amount > 0;
  const pill = passata ? t("booking.past") : t(daPagare ? "booking.awaitingPay" : STATI[status].pill);
  const stato = `
      <div class="detail-status">
        <span>${esc(etichetta)}</span>
        <span class="pill">${pill}</span>
      </div>`;
  const resto = daPagare && b.payment_total > b.payment_amount ? b.payment_total - b.payment_amount : 0;
  const nota = daPagare ? `
        <div class="ticket-state-note ticket-pay">
          <p>${esc(t("booking.payText", { amount: soldiTesto(b.payment_amount) }))}${resto ? " " + esc(t("booking.payRest", { rest: soldiTesto(resto) })) : ""}</p>
          <a class="btn btn-primary" href="${esc(b.payment_link)}" target="_blank" rel="noopener noreferrer">${t("booking.payNow")}</a>
        </div>`
    : STATI[status].nota && !passata
    ? `<p class="ticket-state-note">${esc(t(STATI[status].nota))}</p>` : "";
  // Cosa portare (portare.js): solo su una conferma ancora davanti. Prima
  // della conferma e' presto, dopo la data non serve piu'.
  const cose = confermata && !passata && tour && typeof coseDaPortare === "function"
    ? coseDaPortare(tour.id) : null;
  const portare = cose ? `
          <div class="info-field" style="grid-column:1/-1">
            ${ICONS.bag}
            <div>
              <h3>${t("booking.bring")}</h3>
              <ul>${cose.map(c => `<li>${esc(tf(c))}</li>`).join("")}</ul>
            </div>
          </div>` : "";
  const desiderata = !confermata && b.wanted_time ? `<div class="info-field">
            ${ICONS.clock}
            <div>
              <h3>${t("booking.wantedTime")}</h3>
              <p>${esc(b.wanted_time)}</p>
            </div>
          </div>` : "";

  return `
    <div class="detail-card is-${status}${passata ? " is-past" : ""}"${b.request_token ? ` data-richiesta="${esc(b.request_token)}" data-scheda="${esc(b.excursion_id || "")}" data-giorno="${esc(b.date || "")}"` : ""}>
      ${banner ? `<div class="ticket-hero">${banner}${stato}</div>` : stato}
      <div class="detail-body">
        <h2 class="detail-title">${esc(titolo)}${b.option_label ? `<span class="ticket-option">${esc(varianteTesto(tour, b.option_label))}</span>` : ""}</h2>
        ${nota}
        <div class="info-grid">
          ${ritrovo}
          <div class="info-field">
            ${ICONS.clock}
            <div>
              <h3>${t("booking.when")}</h3>
              <p>${esc(dataLunga(b.date))}</p>
            </div>
          </div>
          ${desiderata}
          ${chi ? `<div class="info-field">
            ${ICONS.people}
            <div>
              <h3>${t("booking.people")}</h3>
              <p>${esc(chi)}</p>
            </div>
          </div>` : ""}
          ${soldi ? `<div class="info-field">
            ${ICONS.info}
            <div>
              <h3>${t("booking.payment")}</h3>
              <p>${esc(soldi)}</p>
            </div>
          </div>` : ""}
          ${portare}
        </div>
        ${tour ? `<a class="map-link" href="./tour.html?id=${encodeURIComponent(tour.id)}">${t("booking.seeTour")} →</a>` : ""}
      </div>
      ${passata && typeof recensioneRiquadro === "function" ? recensioneRiquadro(b) : ""}
    </div>`;
}

function renderTicketVeri(rows, code, senzaRete) {
  const oggi = oggiISO();
  const prossime = rows.filter(b => !b.date || b.date >= oggi);
  const passate = rows.filter(b => b.date && b.date < oggi).reverse();
  const wa = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(perUfficio(() => t("booking.waText", { code })));

  document.getElementById("bookingView").innerHTML = `
    ${senzaRete ? `<p class="note-box">${t("booking.offlineSaved")}</p>` : ""}
    <div class="booking-list">
      ${prossime.map(b => cardTicket(b, false)).join("")}
      ${passate.length ? `<h2 class="booking-past-title">${t("booking.pastTitle")}</h2>` : ""}
      ${passate.map(b => cardTicket(b, true)).join("")}
    </div>
    <div class="detail-actions">
      <a class="btn btn-primary" href="${wa}" target="_blank" rel="noopener noreferrer">${t("booking.whatsapp")}</a>
    </div>
  `;
  // Niente "Cerca un'altra prenotazione" (proprietario, 29/9/2026): i ticket
  // dello stesso telefono ci sono gia' tutti, e per un altro telefono c'e' la
  // finestra "Il mio ticket" della home, che accetta un numero nuovo.
}

// ─── Le richieste mandate su WhatsApp ─────────────────────────────────────
// Il cliente senza ticket di carta: le chiavi delle sue richieste stanno nel
// telefono (richieste.js), e con quelle si chiede a Supabase lo stato.

// Un istante ("2026-09-28T17:05:00Z") → il giorno del calendario qui.
function giornoDi(istante) {
  const d = new Date(istante);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Le righe da disegnare, richiesta per richiesta: quelle arrivate dal database
// se ci sono, altrimenti quelle salvate qui ("da confermare": se non e' ancora
// arrivata nel database, l'ufficio non l'ha certo confermata).
function righeRichieste(elenco) {
  const righe = [];
  elenco.forEach(r => {
    const dalServer = Array.isArray(r.last) && r.last.length ? r.last : null;
    (dalServer || r.items.map(v => Object.assign({ status: "pending" }, v))).forEach(v => {
      righe.push(Object.assign({}, v, { sent_on: giornoDi(r.sentAt), request_code: r.code, request_token: r.token }));
    });
  });
  return righe;
}

function renderRichieste(elenco, senzaRete) {
  const oggi = oggiISO();
  const righe = righeRichieste(elenco);
  const perData = (a, b) => (a.date || "").localeCompare(b.date || "");
  // Prima le valide, poi le annullate, in fondo le gia' fatte. Una richiesta
  // passata e mai confermata (o annullata) non serve piu' a niente: non esce.
  const prossime = righe.filter(b => b.date >= oggi && b.status !== "cancelled").sort(perData);
  const annullate = righe.filter(b => b.date >= oggi && b.status === "cancelled").sort(perData);
  const passate = righe.filter(b => b.date < oggi && b.status === "confirmed").sort(perData).reverse();
  const codici = elenco.map(r => r.code).join(", ");
  const wa = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(perUfficio(() => t("booking.waRequests", { code: codici })));

  if (!prossime.length && !annullate.length && !passate.length) {
    renderStato(ICONS.ticket, t("booking.noRequests"), t("booking.noRequestsText"), false);
    return;
  }
  // Confermata col numero, una richiesta e' un ticket (l'ufficio da' sempre un
  // ticket, proprietario 2/10/2026): in cima, sotto "I tuoi ticket". Le altre
  // restano richieste, e il titolo "Richieste" serve solo se sopra ci sono ticket.
  const eTicket = b => b.status === "confirmed" && !!b.ticket_number;
  const ticket = prossime.filter(eTicket);
  const aperte = prossime.filter(b => !eTicket(b)).concat(annullate);
  titoloPagina(ticket.length && !aperte.length ? "booking.ticketsH1" : "booking.requestsH1");
  document.getElementById("bookingView").innerHTML = `
    ${senzaRete ? `<p class="note-box">${t("booking.offlineSaved")}</p>` : ""}
    <p class="booking-intro">${t("booking.requestsIntro")}</p>
    <div class="booking-list">
      ${ticket.length ? `<h2 class="booking-past-title">${t("booking.ticketsTitle")}</h2>` : ""}
      ${ticket.map(b => cardTicket(b, false)).join("")}
      ${ticket.length && aperte.length ? `<h2 class="booking-past-title">${t("booking.openRequestsTitle")}</h2>` : ""}
      ${aperte.map(b => cardTicket(b, false)).join("")}
      ${passate.length ? `<h2 class="booking-past-title">${t("booking.pastTitle")}</h2>` : ""}
      ${passate.map(b => cardTicket(b, true)).join("")}
    </div>
    <div class="detail-actions">
      <a class="btn btn-primary" href="${wa}" target="_blank" rel="noopener noreferrer">${t("booking.whatsapp")}</a>
    </div>
  `;
  mostraDallAvviso();
}

// Arrivati toccando un avviso sul telefono (manda-notifiche): l'indirizzo dice
// richiesta, scheda e giorno (booking.html?richieste=1&r=…&e=…&d=…). Quella
// escursione si fa vedere subito, col bordo, invece di lasciare il cliente a
// cercarla nella lista. Se non c'e' (gia' passata, tolta) resta la lista.
function mostraDallAvviso() {
  const q = new URLSearchParams(window.location.search);
  const richiesta = q.get("r");
  if (!richiesta) return;
  const scheda = q.get("e");
  const giorno = q.get("d");
  const carta = Array.from(document.querySelectorAll(".detail-card[data-richiesta]")).find(c =>
    c.dataset.richiesta === richiesta
    && (!scheda || c.dataset.scheda === scheda)
    && (!giorno || c.dataset.giorno === giorno));
  if (!carta) return;
  carta.classList.add("is-avviso");
  carta.scrollIntoView({ block: "start" });
}

// Il titolo in alto: "Le mie richieste", oppure "I miei ticket" quando
// l'ufficio le ha confermate tutte. data-i18n cambia insieme, cosi' al cambio
// di lingua resta quello giusto.
function titoloPagina(chiave) {
  const h1 = document.querySelector("[data-i18n='booking.h1'], [data-i18n='booking.requestsH1'], [data-i18n='booking.ticketsH1']");
  if (h1) { h1.dataset.i18n = chiave; h1.textContent = t(chiave); }
}

// `codice`: il numero di un ticket arrivato col link della risposta WhatsApp
// (booking.html?code=2213, vedi rispostaTesto in venditori.js). Se e' fra le
// richieste di questo telefono si mostrano quelle; se no si chiede il
// telefono, come per un ticket di carta.
async function cercaRichieste(codice) {
  titoloPagina("booking.requestsH1");

  if (!richiesteLeggi().length) {
    renderStato(ICONS.ticket, t("booking.noRequests"), t("booking.noRequestsText"), false);
    return;
  }
  // Subito quello che c'e' nel telefono, poi la risposta nuova. Col codice si
  // aspetta la risposta: le richieste salvate qui il numero non lo sanno.
  if (codice) renderStato(ICONS.ticket, t("booking.loading"), "", false);
  else renderRichieste(richiesteLeggi(), false);

  // Prima si rimandano quelle che non erano arrivate, poi si legge: cosi' una
  // richiesta partita senza campo compare gia' in questa lettura.
  await richiesteRiprova();
  const elenco = richiesteLeggi();
  let rows = null;
  try {
    const { data, error } = await sb.rpc("le_mie_richieste", { p_tokens: elenco.map(r => r.token) });
    if (!error) rows = data;
  } catch (e) { /* rete: si decide sotto */ }

  if (rows === null) {
    if (codice) chiediTelefono(codice);
    else renderRichieste(elenco, true);
    return;
  }

  // Ogni richiesta si tiene la sua risposta, per quando mancera' la rete.
  // Una richiesta arrivata nel database e ora sparita e' stata tolta dalla
  // pulizia mensile: esce anche dal telefono.
  const tenute = elenco.filter(r => {
    r.last = rows.filter(x => x.request_token === r.token);
    return r.last.length || !r.stored;
  });
  richiesteScrivi(tenute);
  if (codice && !rows.some(x => String(x.ticket_number || "").trim().toUpperCase() === codice)) {
    chiediTelefono(codice);
    return;
  }
  renderRichieste(tenute, false);
}

// Il ticket col numero ma senza telefono: si chiede, col numero gia' scritto.
function chiediTelefono(code) {
  titoloPagina("booking.h1");
  renderStato(ICONS.ticket, t("booking.needPhone"), t("booking.needPhoneText", { code }), true);
  const campo = document.getElementById("retryCode");
  if (campo) campo.value = code;
}

async function cercaTicketVero(code, phone) {
  // per la recensione (recensioni.js): il ticket di carta si dimostra cosi'
  if (typeof RECENSIONE_TELEFONO !== "undefined") RECENSIONE_TELEFONO = phone;
  const salvati = risultatoSalvato(code, phone);
  // Quello che c'e' gia' si mostra subito; la risposta nuova lo sostituisce.
  if (salvati) renderTicketVeri(salvati, code, false);
  else renderStato(ICONS.ticket, t("booking.loading"), "", false);

  let rows = null;
  let troppi = false;
  try {
    const { data, error } = await sb.rpc("le_mie_escursioni", { p_phone: phone, p_ticket: code });
    if (!error) rows = data;
    // Dieci ricerche l'ora per telefono (supabase/modifiche/2026-10-16-tentativi-ticket.sql):
    // all'undicesima il database risponde con questo errore.
    else troppi = /troppi tentativi/.test(error.message || "");
  } catch (e) { /* rete: si decide sotto */ }

  if (troppi) {
    // Il ticket gia' salvato su questo telefono resta com'e': e' suo.
    if (!salvati) renderStato(ICONS.info, t("booking.tooMany"), t("booking.tooManyText"), true);
    return;
  }
  if (rows === null) {
    if (salvati) renderTicketVeri(salvati, code, true);
    else renderStato(ICONS.info, t("booking.offline"), t("booking.offlineText"), false);
    return;
  }
  if (!rows.length) {
    try { localStorage.removeItem(RISULTATO_KEY); } catch (e) { /* incognito */ }
    renderNotFound(code);
    return;
  }
  salvaRisultato(code, phone, rows);
  renderTicketVeri(rows, code, false);
}

function renderBookingPage() {
  const salvato = ticketSalvato();
  let code = getCodeFromUrl();

  // booking.html?richieste=1: le richieste mandate su WhatsApp.
  if (new URLSearchParams(window.location.search).has("richieste")) { cercaRichieste(); return; }

  // booking.html senza codice: l'ultimo ticket cercato su questo telefono,
  // oppure, se un ticket non c'e', le richieste.
  if (!code && salvato && salvato.phone) code = salvato.code.trim().toUpperCase();
  if (!code && richiesteLeggi().length) { cercaRichieste(); return; }
  if (!code) { renderEmpty(); return; }

  if (MOCK_BOOKINGS[code]) { renderBooking(MOCK_BOOKINGS[code], code); return; }
  // RICHIESTE era il codice della pagina di prova: porta alle richieste vere.
  if (code === "RICHIESTE") { cercaRichieste(); return; }

  const phone = salvato && salvato.code.trim().toUpperCase() === code ? salvato.phone : null;
  if (!phone) {
    // Il link della conferma su WhatsApp: il telefono che ha mandato la
    // richiesta il ticket lo trova da solo, senza chiedere niente.
    if (richiesteLeggi().length) cercaRichieste(code);
    else chiediTelefono(code);
    return;
  }
  // Il numero si cerca come l'ha scritto il cliente (maiuscole a parte, i
  // ticket sono numeri): "2213".
  cercaTicketVero(salvato.code.trim(), phone);
}

document.addEventListener("DOMContentLoaded", renderBookingPage);
document.addEventListener("islalang", renderBookingPage);

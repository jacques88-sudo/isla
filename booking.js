// Pagina della prenotazione: il cliente arriva qui dalla finestra del ticket
// (app.js) con il numero nell'indirizzo e il telefono salvato nel telefono.
//
// Due strade:
//   - i codici di prova (MOCK_BOOKINGS, "ISLA-4521"): la vecchia pagina finta,
//     tenuta per scelta del proprietario come segnaposto. Non chiedono telefono.
//   - tutti gli altri: i ticket di carta veri, cercati su Supabase con la
//     funzione le_mie_escursioni(telefono, ticket) — vedi supabase/schema.sql.
//     Un ticket giusto mostra TUTTE le escursioni confermate di quel telefono.
//
// Anche qui i testi sono nelle tre lingue: stringa sola = uguale ovunque,
// oggetto { it, en, es } = tradotto. tf() sceglie la lingua giusta.

const MOCK_BOOKINGS = {
  "ISLA-4521": {
    title: {
      it: "Whale & Dolphin Watching in barca a vela",
      en: "Whale & Dolphin Watching by sailing boat",
      es: "Whale & Dolphin Watching en velero"
    },
    date: { it: "Domani, 09:30", en: "Tomorrow, 09:30", es: "Mañana, 09:30" },
    meetingPoint: "Puerto Colón, Muelle 3 — Costa Adeje",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    bring: [
      { it: "Costume da bagno", en: "Swimsuit", es: "Bañador" },
      { it: "Asciugamano", en: "Towel", es: "Toalla" },
      { it: "Crema solare", en: "Sun cream", es: "Crema solar" },
      { it: "Documento d'identità", en: "ID document", es: "Documento de identidad" }
    ],
    notes: {
      it: "Presentati 15 minuti prima dell'orario. Cancellazione gratuita fino a 24 ore prima della partenza.",
      en: "Arrive 15 minutes before the departure time. Free cancellation up to 24 hours before departure.",
      es: "Preséntate 15 minutos antes de la hora. Cancelación gratuita hasta 24 horas antes de la salida."
    }
  },
  "TEN-7788": {
    title: "Teide Sunset Quad Trip",
    date: { it: "Oggi, 16:00", en: "Today, 16:00", es: "Hoy, 16:00" },
    meetingPoint: "Quad Center, Vilaflor",
    duration: { it: "3 ore", en: "3 hours", es: "3 horas" },
    bring: [
      { it: "Scarpe chiuse", en: "Closed shoes", es: "Zapato cerrado" },
      { it: "Giacca leggera (di sera fa fresco)", en: "Light jacket (it gets cool in the evening)", es: "Chaqueta ligera (por la noche refresca)" },
      { it: "Patente di guida", en: "Driving licence", es: "Carné de conducir" }
    ],
    notes: {
      it: "Il tour è vietato alle donne in gravidanza. Età minima 18 anni per guidare il quad.",
      en: "The tour is not suitable for pregnant women. Minimum age to drive the quad is 18.",
      es: "El tour no está permitido a mujeres embarazadas. Edad mínima para conducir el quad: 18 años."
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

function cardTicket(b, passata) {
  const tour = typeof ESPLORA_CATALOG !== "undefined" ? ESPLORA_CATALOG.find(x => x.id === b.excursion_id) : null;
  const titolo = tour ? tf(tour.title) : t("booking.otherExc");
  const ora = b.time ? b.time.slice(0, 5) : "";
  const luogo = b.meeting_point || "";
  const chi = persone(b);
  const soldi = pagamento(b);

  // "Presentati alle 9:40" + il posto: e' l'ora scritta sul ticket accanto al
  // meeting point, la stessa per tutte le escursioni (proprietario, 29/9/2026).
  const ritrovo = (ora || luogo) ? `
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
  const stato = `
      <div class="detail-status">
        <span>${esc(t("booking.ticketN", { code: b.ticket_number }))}</span>
        <span class="pill">${passata ? t("booking.past") : t("booking.confirmed")}</span>
      </div>`;

  return `
    <div class="detail-card${passata ? " is-past" : ""}">
      ${banner ? `<div class="ticket-hero">${banner}${stato}</div>` : stato}
      <div class="detail-body">
        <h2 class="detail-title">${esc(titolo)}${b.option_label ? `<span class="ticket-option">${esc(b.option_label)}</span>` : ""}</h2>
        <div class="info-grid">
          ${ritrovo}
          <div class="info-field">
            ${ICONS.clock}
            <div>
              <h3>${t("booking.when")}</h3>
              <p>${esc(dataLunga(b.date))}</p>
            </div>
          </div>
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
        </div>
        ${tour ? `<a class="map-link" href="./tour.html?id=${encodeURIComponent(tour.id)}">${t("booking.seeTour")} →</a>` : ""}
      </div>
    </div>`;
}

function renderTicketVeri(rows, code, senzaRete) {
  const oggi = oggiISO();
  const prossime = rows.filter(b => !b.date || b.date >= oggi);
  const passate = rows.filter(b => b.date && b.date < oggi).reverse();
  const wa = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(t("booking.waText", { code }));

  document.getElementById("bookingView").innerHTML = `
    ${senzaRete ? `<p class="note-box">${t("booking.offlineSaved")}</p>` : ""}
    <div class="booking-list">
      ${prossime.map(b => cardTicket(b, false)).join("")}
      ${passate.length ? `<h2 class="booking-past-title">${t("booking.pastTitle")}</h2>` : ""}
      ${passate.map(b => cardTicket(b, true)).join("")}
    </div>
    <div class="detail-actions">
      <a class="btn btn-primary" href="${wa}" target="_blank" rel="noopener noreferrer">${t("booking.whatsapp")}</a>
      <button class="btn btn-soft" type="button" data-ticket-forget>${t("booking.another")}</button>
    </div>
  `;
  // "Cerca un'altra prenotazione": il telefono dimentica questo ticket.
  document.querySelector("[data-ticket-forget]").addEventListener("click", () => {
    salvaTicket(null);
    try { localStorage.removeItem(RISULTATO_KEY); } catch (e) { /* incognito */ }
    history.replaceState(null, "", "./booking.html");
    renderEmpty();
  });
}

async function cercaTicketVero(code, phone) {
  const salvati = risultatoSalvato(code, phone);
  // Quello che c'e' gia' si mostra subito; la risposta nuova lo sostituisce.
  if (salvati) renderTicketVeri(salvati, code, false);
  else renderStato(ICONS.ticket, t("booking.loading"), "", false);

  let rows = null;
  try {
    const { data, error } = await sb.rpc("le_mie_escursioni", { p_phone: phone, p_ticket: code });
    if (!error) rows = data;
  } catch (e) { /* rete: si decide sotto */ }

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

  // booking.html senza codice: l'ultimo ticket cercato su questo telefono.
  if (!code && salvato && salvato.phone) code = salvato.code.trim().toUpperCase();
  if (!code) { renderEmpty(); return; }

  if (MOCK_BOOKINGS[code]) { renderBooking(MOCK_BOOKINGS[code], code); return; }

  const phone = salvato && salvato.code.trim().toUpperCase() === code ? salvato.phone : null;
  if (!phone) {
    renderStato(ICONS.ticket, t("booking.needPhone"), t("booking.needPhoneText", { code }), true);
    return;
  }
  // Il numero si cerca come l'ha scritto il cliente (maiuscole a parte, i
  // ticket sono numeri): "2213".
  cercaTicketVero(salvato.code.trim(), phone);
}

document.addEventListener("DOMContentLoaded", renderBookingPage);
document.addEventListener("islalang", renderBookingPage);

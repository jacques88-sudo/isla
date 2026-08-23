// Pagina di dettaglio della prenotazione: cerca un codice nei dati di prova
// e mostra le informazioni del tour.
// TODO: sostituire MOCK_BOOKINGS con una fonte dati vera (foglio/API).
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

function renderNotFound(code) {
  document.getElementById("bookingView").innerHTML = `
    <div class="state">
      <div class="state-icon">${ICONS.search}</div>
      <h2>${t("booking.notFound")}</h2>
      <p>${t("booking.notFoundText", { code })}</p>
      <form class="lookup-card" data-lookup-form style="text-align:left">
        <label for="retryInput">${t("booking.retry")}</label>
        <div class="lookup-row">
          <input id="retryInput" type="text" autocomplete="off" placeholder="${t("ticket.placeholder")}" required />
          <button class="btn btn-primary" type="submit">${t("common.search")}</button>
        </div>
      </form>
    </div>
  `;
  initLookupForms();
}

function renderEmpty() {
  document.getElementById("bookingView").innerHTML = `
    <div class="state">
      <div class="state-icon">${ICONS.ticket}</div>
      <h2>${t("booking.noCode")}</h2>
      <p>${t("booking.noCodeText")}</p>
      <a class="btn btn-primary" href="./index.html">${t("booking.goHome")}</a>
    </div>
  `;
}

function renderBookingPage() {
  const code = getCodeFromUrl();
  if (!code) {
    renderEmpty();
  } else if (MOCK_BOOKINGS[code]) {
    renderBooking(MOCK_BOOKINGS[code], code);
  } else {
    renderNotFound(code);
  }
}

document.addEventListener("DOMContentLoaded", renderBookingPage);
document.addEventListener("islalang", renderBookingPage);

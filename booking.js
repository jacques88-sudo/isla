// Booking detail page: looks up a code in mock data and renders the tour info.
// TODO: replace MOCK_BOOKINGS with a real data source (sheet/API) when available.

const MOCK_BOOKINGS = {
  "ISLA-4521": {
    title: "Whale & Dolphin Watching Yacht Trip",
    date: "Domani, 09:30",
    meetingPoint: "Puerto Colón, Muelle 3 — Costa Adeje",
    duration: "3 ore",
    bring: ["Costume da bagno", "Asciugamano", "Crema solare", "Documento d'identità"],
    notes: "Presentati 15 minuti prima dell'orario. Cancellazione gratuita fino a 24 ore prima della partenza."
  },
  "TEN-7788": {
    title: "Teide Sunset Quad Trip",
    date: "Oggi, 16:00",
    meetingPoint: "Quad Center, Vilaflor",
    duration: "3 ore",
    bring: ["Scarpe chiuse", "Giacca leggera (di sera fa fresco)", "Patente di guida"],
    notes: "Il tour è vietato alle donne in gravidanza. Età minima 18 anni per guidare il quad."
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
        <span>${ICONS.check} Prenotazione trovata</span>
        <span class="pill">Confermata</span>
      </div>
      <div class="detail-body">
        <p class="detail-code">Codice<strong>${code}</strong></p>
        <h1 class="detail-title">${booking.title}</h1>

        <div class="info-grid">
          <div class="info-field">
            ${ICONS.clock}
            <div>
              <h3>Orario</h3>
              <p>${booking.date}</p>
            </div>
          </div>
          <div class="info-field">
            ${ICONS.timer}
            <div>
              <h3>Durata</h3>
              <p>${booking.duration}</p>
            </div>
          </div>
          <div class="info-field" style="grid-column:1/-1">
            ${ICONS.pin}
            <div>
              <h3>Punto d'incontro</h3>
              <p>${booking.meetingPoint}</p>
              <a class="map-link" href="${mapsUrl(booking.meetingPoint)}" target="_blank" rel="noopener noreferrer">Apri in mappa →</a>
            </div>
          </div>
          <div class="info-field" style="grid-column:1/-1">
            ${ICONS.bag}
            <div>
              <h3>Cosa portare</h3>
              <ul>${booking.bring.map(item => `<li>${item}</li>`).join("")}</ul>
            </div>
          </div>
        </div>

        <div class="note-box">
          <h3>Note importanti</h3>
          <p>${booking.notes}</p>
        </div>

        <div class="detail-actions">
          <a class="btn btn-soft" href="./index.html">Cerca un'altra prenotazione</a>
          <a class="btn btn-primary" href="mailto:info@islatenerife.com?subject=Assistenza prenotazione ${code}">Richiedi assistenza</a>
        </div>
      </div>
    </div>
  `;
}

function renderNotFound(code) {
  document.getElementById("bookingView").innerHTML = `
    <div class="state">
      <div class="state-icon">${ICONS.search}</div>
      <h2>Codice non trovato</h2>
      <p>Non troviamo una prenotazione con il codice "${code}". Controlla di averlo copiato correttamente dalla email di conferma.</p>
      <form class="lookup-card" data-lookup-form style="text-align:left">
        <label for="retryInput">Riprova con un altro codice</label>
        <div class="lookup-row">
          <input id="retryInput" type="text" autocomplete="off" placeholder="Es. ISLA-4521" required />
          <button class="btn btn-primary" type="submit">Cerca</button>
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
      <h2>Nessun codice inserito</h2>
      <p>Torna alla home e inserisci il codice della tua prenotazione per vedere i dettagli del tour.</p>
      <a class="btn btn-primary" href="./index.html">Vai alla home</a>
    </div>
  `;
}

const code = getCodeFromUrl();
if (!code) {
  renderEmpty();
} else if (MOCK_BOOKINGS[code]) {
  renderBooking(MOCK_BOOKINGS[code], code);
} else {
  renderNotFound(code);
}

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

function getCodeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return (params.get("code") || "").trim().toUpperCase();
}

function mapsUrl(place) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(place);
}

function renderBooking(booking, code) {
  document.getElementById("bookingView").innerHTML = `
    <h1 class="detail-title">${booking.title}</h1>
    <p class="detail-code">Codice ${code}</p>

    <div class="info-card">
      <span class="info-icon">🕒</span>
      <div>
        <h3>Orario</h3>
        <p>${booking.date}</p>
      </div>
    </div>

    <div class="info-card">
      <span class="info-icon">📍</span>
      <div>
        <h3>Punto d'incontro</h3>
        <p>${booking.meetingPoint}</p>
        <a class="map-link" href="${mapsUrl(booking.meetingPoint)}" target="_blank" rel="noopener noreferrer">Apri in mappa →</a>
      </div>
    </div>

    <div class="info-card">
      <span class="info-icon">⏱</span>
      <div>
        <h3>Durata</h3>
        <p>${booking.duration}</p>
      </div>
    </div>

    <div class="info-card">
      <span class="info-icon">🎒</span>
      <div>
        <h3>Cosa portare</h3>
        <ul>${booking.bring.map(item => `<li>${item}</li>`).join("")}</ul>
      </div>
    </div>

    <div class="info-card note-card">
      <span class="info-icon">ℹ️</span>
      <div>
        <h3>Note importanti</h3>
        <p>${booking.notes}</p>
      </div>
    </div>
  `;
}

function renderNotFound(code) {
  document.getElementById("bookingView").innerHTML = `
    <div class="state">
      <div class="state-icon">🔍</div>
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
      <div class="state-icon">🎫</div>
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

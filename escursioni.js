// Pagina "Tutte le escursioni": legge ESPLORA_CATALOG e CATEGORIES da
// esplora-catalog.js, filtra per categoria/testo e disegna le schede.
//
// Numero WhatsApp su cui arrivano le richieste di disponibilità.
// Formato internazionale senza + e senza spazi. Svuotalo per nascondere
// il pulsante "Richiedi disponibilità" su tutte le schede.
const WHATSAPP_NUMBER = "34662908073";

function tourPrice(tour) {
  return tour.priceFrom === null ? "Su richiesta" : "da €" + tour.priceFrom;
}

function categoryName(id) {
  const cat = CATEGORIES.find(c => c.id === id);
  return cat ? cat.name : id;
}

// Data minima richiedibile: domani, cioè almeno 24 ore di preavviso.
// Restituisce il formato AAAA-MM-GG che <input type="date"> si aspetta.
function minRequestDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

// Oltre un anno avanti è quasi sempre un errore di digitazione
function maxRequestDate() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

// "2026-08-23" → "23/08/2026", più leggibile nel messaggio
function formatDate(iso) {
  const [y, m, g] = iso.split("-");
  return g + "/" + m + "/" + y;
}

function peopleText(adults, kids) {
  const parti = [adults + (adults === 1 ? " adulto" : " adulti")];
  if (kids > 0) parti.push(kids + (kids === 1 ? " bambino" : " bambini"));
  return parti.join(" e ");
}

// Messaggio WhatsApp completo, con data e persone già compilate
function whatsappUrl(tour, req) {
  let testo = "Ciao Isla! Vorrei richiedere disponibilità per:\n" +
    "• " + tour.title + "\n" +
    "• Data: " + formatDate(req.date) + "\n" +
    "• Persone: " + peopleText(req.adults, req.kids);
  if (req.note) testo += "\n• Note: " + req.note;
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(testo);
}

function tourCard(tour) {
  const li = document.createElement("li");
  li.className = "tour-card";

  // encodeURIComponent: se un nome file contiene spazi o accenti,
  // l'indirizzo resta valido invece di rompersi a metà
  const media = tour.image
    ? `<img src="./assets/${encodeURIComponent(tour.image)}" alt="${tour.title}" loading="lazy" />`
    : `<span class="tour-media-empty" aria-hidden="true">Isla</span>`;

  const askBtn = WHATSAPP_NUMBER
    ? `<button class="btn btn-primary tour-ask" type="button" data-request-open="${tour.id}"
               aria-haspopup="dialog" aria-controls="requestDialog">Richiedi disponibilità</button>`
    : "";

  li.innerHTML = `
    <div class="tour-media">${media}</div>
    <div class="tour-body">
      <span class="tour-cat">${categoryName(tour.category)}</span>
      <h2 class="tour-title">${tour.title}</h2>
      <p class="tour-desc">${tour.desc}</p>
      <ul class="tour-meta">
        <li>${tour.zone}</li>
        <li>${tour.duration}</li>
        ${tour.family ? "<li>Adatta ai bambini</li>" : ""}
      </ul>
      <div class="tour-foot">
        <span class="tour-price">${tourPrice(tour)}</span>
        ${askBtn}
      </div>
    </div>
  `;
  return li;
}

function initCatalog() {
  const grid = document.querySelector("[data-grid]");
  const chipRow = document.querySelector("[data-chips]");
  const searchInput = document.querySelector("[data-search]");
  const countEl = document.querySelector("[data-count]");
  const emptyEl = document.querySelector("[data-empty]");
  if (!grid) return;

  const published = ESPLORA_CATALOG.filter(t => t.published);
  const params = new URLSearchParams(location.search);

  const state = {
    category: params.get("cat") || "tutte",
    family: params.get("family") === "1",
    query: ""
  };

  // Solo le categorie che hanno almeno un'attività pubblicata
  const usedCategories = CATEGORIES.filter(c =>
    published.some(t => t.category === c.id)
  );

  function buildChips() {
    const all = [{ id: "tutte", name: "Tutte" }].concat(usedCategories);
    chipRow.innerHTML = "";
    all.forEach(cat => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.textContent = cat.name;
      btn.dataset.cat = cat.id;
      btn.addEventListener("click", () => {
        state.category = cat.id;
        render();
      });
      chipRow.appendChild(btn);
    });
  }

  function matches(tour) {
    if (state.category !== "tutte" && tour.category !== state.category) return false;
    if (state.family && !tour.family) return false;
    if (state.query) {
      const haystack = (
        tour.title + " " + tour.desc + " " + tour.zone + " " + categoryName(tour.category)
      ).toLowerCase();
      if (!haystack.includes(state.query)) return false;
    }
    return true;
  }

  function render() {
    const results = published.filter(matches);

    grid.innerHTML = "";
    results.forEach(t => grid.appendChild(tourCard(t)));

    chipRow.querySelectorAll(".chip").forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.cat === state.category);
    });

    // Riepilogo in alto
    if (published.length === 0) {
      countEl.textContent = "";
    } else if (results.length === published.length) {
      countEl.textContent = published.length + " attività disponibili";
    } else {
      countEl.textContent = results.length + " di " + published.length + " attività";
    }

    // Stato vuoto: distingue "niente pubblicato" da "filtri troppo stretti"
    if (published.length === 0) {
      emptyEl.hidden = false;
      emptyEl.innerHTML = `
        <h2>Catalogo in preparazione</h2>
        <p>Nessuna attività è ancora pubblicata. Per pubblicarne una, apri
        <code>esplora-catalog.js</code> e imposta <code>published: true</code>
        sulla voce, dopo aver verificato prezzo, foto e descrizione.</p>
      `;
    } else if (results.length === 0) {
      emptyEl.hidden = false;
      emptyEl.innerHTML = `
        <h2>Nessun risultato</h2>
        <p>Prova a cambiare categoria o a cercare un'altra parola.</p>
      `;
    } else {
      emptyEl.hidden = true;
      emptyEl.innerHTML = "";
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      state.query = searchInput.value.trim().toLowerCase();
      render();
    });
  }

  buildChips();
  render();
}

document.addEventListener("DOMContentLoaded", initCatalog);

// Finestra "Richiedi disponibilità": raccoglie data e persone, poi apre
// WhatsApp col messaggio già compilato.
function initRequestDialog() {
  const dialog = document.getElementById("requestDialog");
  const scrim = document.querySelector("[data-request-scrim]");
  const form = document.querySelector("[data-request-form]");
  const activityEl = document.querySelector("[data-request-activity]");
  const dateInput = document.getElementById("reqDate");
  if (!dialog || !scrim || !form || !dateInput) return;

  // Blocca le date che non rispettano il preavviso di 24 ore
  dateInput.min = minRequestDate();
  dateInput.max = maxRequestDate();

  let current = null;

  function open(tour) {
    current = tour;
    activityEl.textContent = tour.title;
    dialog.hidden = false;
    scrim.hidden = false;
    requestAnimationFrame(() => {
      dialog.classList.add("is-open");
      scrim.classList.add("is-visible");
    });
    document.body.classList.add("menu-open");
  }

  function close() {
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
    const btn = e.target.closest("[data-request-open]");
    if (!btn) return;
    const tour = ESPLORA_CATALOG.find(t => t.id === btn.dataset.requestOpen);
    if (tour) open(tour);
  });

  document.querySelectorAll("[data-request-close]").forEach(b =>
    b.addEventListener("click", close)
  );
  scrim.addEventListener("click", close);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && dialog.classList.contains("is-open")) close();
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!current) return;

    const req = {
      date: dateInput.value,
      adults: parseInt(document.getElementById("reqAdults").value, 10) || 1,
      kids: parseInt(document.getElementById("reqKids").value, 10) || 0,
      note: document.getElementById("reqNote").value.trim()
    };
    if (!req.date) return;

    close();
    window.location.href = whatsappUrl(current, req);
  });
}

document.addEventListener("DOMContentLoaded", initRequestDialog);

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

// Messaggio già scritto per WhatsApp, con l'attività di cui si chiede la data
function whatsappUrl(tour) {
  const testo =
    "Ciao Isla! Vorrei sapere la disponibilità per: " + tour.title +
    ".\nQuante persone: \nData desiderata: ";
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(testo);
}

function tourCard(tour) {
  const li = document.createElement("li");
  li.className = "tour-card";

  const media = tour.image
    ? `<img src="./assets/${tour.image}" alt="${tour.title}" loading="lazy" />`
    : `<span class="tour-media-empty" aria-hidden="true">Isla</span>`;

  const askBtn = WHATSAPP_NUMBER
    ? `<a class="btn btn-primary tour-ask" href="${whatsappUrl(tour)}" target="_blank" rel="noopener">Richiedi disponibilità</a>`
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

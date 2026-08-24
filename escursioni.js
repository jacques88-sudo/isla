// Pagina "Tutte le escursioni": legge ESPLORA_CATALOG e CATEGORIES da
// esplora-catalog.js, filtra per categoria/testo e disegna le schede.
//
// I testi passano da i18n.js: t() per quelli fissi, tf() per i campi del
// catalogo che possono essere scritti nelle tre lingue.
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

function tourPrice(tour) {
  if (tour.priceFrom === null) return t("tour.onRequest");
  // priceUnit c'è solo sui noleggi a ore: "da €100" diventa "da €100/ora"
  return t("tour.from", { p: tour.priceFrom }) + (tour.priceUnit ? tf(tour.priceUnit) : "");
}

function categoryName(id) {
  const cat = CATEGORIES.find(c => c.id === id);
  return cat ? tf(cat.name) : id;
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
  const parti = [adults + " " + t(adults === 1 ? "wa.adult" : "wa.adults")];
  if (kids > 0) parti.push(kids + " " + t(kids === 1 ? "wa.child" : "wa.children"));
  return parti.join(" " + t("wa.and") + " ");
}

// Messaggio WhatsApp completo, con data e persone già compilate.
// È scritto nella lingua che il cliente sta usando sul sito.
function whatsappUrl(tour, req) {
  let testo = t("wa.intro", { name: req.name }) + "\n" +
    "• " + tf(tour.title) + "\n" +
    "• " + t("wa.date") + ": " + formatDate(req.date) + "\n" +
    "• " + t("wa.people") + ": " + peopleText(req.adults, req.kids);
  if (req.note) testo += "\n• " + t("wa.notes") + ": " + req.note;
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(testo);
}

function tourCard(tour) {
  const li = document.createElement("li");
  li.className = "tour-card";

  // encodeURIComponent: se un nome file contiene spazi o accenti,
  // l'indirizzo resta valido invece di rompersi a metà
  const media = tour.image
    ? `<img src="./assets/${encodeURIComponent(tour.image)}" alt="${tf(tour.title)}" loading="lazy" />`
    : `<span class="tour-media-empty" aria-hidden="true">Isla</span>`;

  const askBtn = WHATSAPP_NUMBER
    ? `<button class="btn btn-primary tour-ask" type="button" data-request-open="${tour.id}"
               aria-haspopup="dialog" aria-controls="requestDialog">${t("tour.ask")}</button>`
    : "";

  // foto e titolo portano alla pagina di dettaglio; il pulsante resta la
  // scorciatoia per chi ha gia' deciso
  const href = `./tour.html?id=${encodeURIComponent(tour.id)}`;

  li.innerHTML = `
    <a class="tour-media" href="${href}" tabindex="-1" aria-hidden="true">${media}</a>
    <div class="tour-body">
      <span class="tour-cat">${categoryName(tour.category)}</span>
      <h2 class="tour-title"><a href="${href}">${tf(tour.title)}</a></h2>
      <p class="tour-desc">${tf(tour.desc)}</p>
      <ul class="tour-meta">
        ${daDefinire(tour.zone) ? "" : "<li>" + tf(tour.zone) + "</li>"}
        ${daDefinire(tour.duration) ? "" : "<li>" + tf(tour.duration) + "</li>"}
        ${tour.family ? "<li>" + t("tour.family") + "</li>" : ""}
        ${tour.season ? `<li class="tour-meta-season">${tf(tour.season)}</li>` : ""}
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

  const published = ESPLORA_CATALOG.filter(x => x.published);
  const params = new URLSearchParams(location.search);

  // "cat" accetta anche più categorie separate da virgola: l'assistente
  // manda qui combinazioni come "avventura-motori,sport-acquatici".
  // Lista vuota = nessun filtro di categoria.
  const state = {
    categories: (params.get("cat") || "").split(",").filter(Boolean),
    family: params.get("family") === "1",
    query: ""
  };

  // Solo le categorie che hanno almeno un'attività pubblicata
  const usedCategories = CATEGORIES.filter(c =>
    published.some(x => x.category === c.id)
  );

  function buildChips() {
    const all = [{ id: "tutte", name: t("catalog.all") }].concat(usedCategories);
    chipRow.innerHTML = "";
    all.forEach(cat => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.textContent = tf(cat.name);
      btn.dataset.cat = cat.id;
      btn.addEventListener("click", () => {
        state.categories = cat.id === "tutte" ? [] : [cat.id];
        render();
      });
      chipRow.appendChild(btn);
    });
  }

  function matches(tour) {
    if (state.categories.length && !state.categories.includes(tour.category)) return false;
    if (state.family && !tour.family) return false;
    if (state.query) {
      // Si cerca in tutte e tre le lingue: chi scrive "boat" trova la
      // stessa attività di chi scrive "barca".
      const haystack = [tour.title, tour.desc, tour.zone]
        .map(campo => typeof campo === "string" ? campo : Object.values(campo).join(" "))
        .concat(categoryName(tour.category))
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(state.query)) return false;
    }
    return true;
  }

  function render() {
    const results = published.filter(matches);

    grid.innerHTML = "";
    results.forEach(tour => grid.appendChild(tourCard(tour)));

    chipRow.querySelectorAll(".chip").forEach(btn => {
      const attivo = state.categories.length
        ? state.categories.includes(btn.dataset.cat)
        : btn.dataset.cat === "tutte";
      btn.classList.toggle("is-active", attivo);
    });

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
    } else if (results.length === 0) {
      emptyEl.hidden = false;
      emptyEl.innerHTML = `
        <h2>${t("catalog.emptyTitle")}</h2>
        <p>${t("catalog.emptyText")}</p>
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

  // Cambio lingua: le schede e i filtri sono disegnati da JavaScript,
  // quindi vanno ricostruiti a mano (applyI18n tocca solo l'HTML fisso).
  document.addEventListener("islalang", () => {
    buildChips();
    render();
  });
}

document.addEventListener("DOMContentLoaded", initCatalog);

// Finestra "Richiedi disponibilità": raccoglie data e persone, poi apre
// WhatsApp col messaggio già compilato.
function initRequestDialog() {
  const dialog = document.getElementById("requestDialog");
  const scrim = document.querySelector("[data-request-scrim]");
  const form = document.querySelector("[data-request-form]");
  const activityEl = document.querySelector("[data-request-activity]");
  const seasonEl = document.querySelector("[data-request-season]");
  const dateInput = document.getElementById("reqDate");
  if (!dialog || !scrim || !form || !dateInput) return;

  // Blocca le date che non rispettano il preavviso di 24 ore
  dateInput.min = minRequestDate();
  dateInput.max = maxRequestDate();

  let current = null;

  function open(tour) {
    current = tour;
    activityEl.textContent = tf(tour.title);
    // se l'attivita' si fa solo in certi mesi lo si dice qui, prima che il
    // cliente scelga una data in cui non si puo' fare
    if (seasonEl) {
      seasonEl.textContent = tour.season ? tf(tour.season) : "";
      seasonEl.hidden = !tour.season;
    }
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

  // Se la lingua cambia mentre la finestra è aperta, cambia anche il nome
  // dell'attività in cima.
  document.addEventListener("islalang", () => {
    if (current) activityEl.textContent = tf(current.title);
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!current) return;

    const req = {
      name: document.getElementById("reqName").value.trim(),
      date: dateInput.value,
      adults: parseInt(document.getElementById("reqAdults").value, 10) || 1,
      kids: parseInt(document.getElementById("reqKids").value, 10) || 0,
      note: document.getElementById("reqNote").value.trim()
    };
    if (!req.name || !req.date) return;

    close();
    window.location.href = whatsappUrl(current, req);
  });
}

document.addEventListener("DOMContentLoaded", initRequestDialog);

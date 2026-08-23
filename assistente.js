// Assistente di ricerca: un pulsante rotondo in basso a destra che apre una
// conversazione guidata. Fa due domande con risposte da toccare e propone le
// attività del catalogo che corrispondono.
//
// Non usa intelligenza artificiale: le risposte sono decise dalle regole qui
// sotto. Serve una chiave segreta per usare un vero modello, e quella non può
// stare nel browser — servirebbe un backend.
//
// Richiede che i18n.js e esplora-catalog.js siano caricati prima di questo file.

// key = la chiave della traduzione in i18n.js, così le risposte compaiono
// nella lingua scelta dal cliente.
const ASSIST_INTERESSI = [
  { key: "assist.int.sea",        cats: ["mare-barche"] },
  { key: "assist.int.nature",     cats: ["teide-natura"] },
  { key: "assist.int.adrenaline", cats: ["avventura-motori", "sport-acquatici"] },
  { key: "assist.int.parks",      cats: ["parchi-spettacoli"] },
  { key: "assist.int.stars",      cats: ["stelle"] },
  { key: "assist.int.island",     cats: ["tour-isola"] },
  { key: "assist.int.unsure",     cats: null }   // null = nessun filtro
];

const ASSIST_MAX_RISULTATI = 5;

function assistPrezzo(tour) {
  return tour.priceFrom === null
    ? t("tour.onRequest")
    : t("tour.from", { p: tour.priceFrom });
}

function assistNomeCategoria(id) {
  const c = CATEGORIES.find(x => x.id === id);
  return c ? tf(c.name) : id;
}

// Indirizzo del catalogo già filtrato come l'utente ha chiesto.
// Più categorie viaggiano separate da virgola: "Adrenalina" ne copre due.
function assistLinkCatalogo(cats, soloFamiglia) {
  const p = new URLSearchParams();
  if (cats && cats.length) p.set("cat", cats.join(","));
  if (soloFamiglia) p.set("family", "1");
  const q = p.toString();
  return "./escursioni.html" + (q ? "?" + q : "");
}

function initAssistente() {
  // Senza catalogo non c'è niente da suggerire
  if (typeof ESPLORA_CATALOG === "undefined") return;

  const fab = document.createElement("button");
  fab.type = "button";
  fab.className = "assist-fab";
  fab.setAttribute("aria-haspopup", "dialog");
  fab.setAttribute("aria-expanded", "false");
  fab.setAttribute("data-i18n-aria-label", "assist.open");
  fab.setAttribute("aria-label", t("assist.open"));
  fab.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.3-.6L3 21l1.8-5a8.2 8.2 0 0 1-.8-3.5 8.4 8.4 0 0 1 8.5-8.4 8.4 8.4 0 0 1 8.5 8.4z"/>
      <path d="M9.2 10.2h5.6M9.2 13.4h3.4"/>
    </svg>`;

  const scrim = document.createElement("div");
  scrim.className = "assist-scrim";
  scrim.hidden = true;

  const panel = document.createElement("aside");
  panel.className = "assist-panel";
  panel.id = "assistPanel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("data-i18n-aria-label", "assist.title");
  panel.setAttribute("aria-label", t("assist.title"));
  panel.hidden = true;
  panel.innerHTML = `
    <div class="assist-head">
      <div>
        <strong data-i18n="assist.title">${t("assist.title")}</strong>
        <span data-i18n="assist.sub">${t("assist.sub")}</span>
      </div>
      <button class="iconbtn" type="button" data-assist-close
              data-i18n-aria-label="common.close" aria-label="${t("common.close")}">✕</button>
    </div>
    <div class="assist-body" data-assist-body></div>
  `;

  document.body.append(fab, scrim, panel);
  const body = panel.querySelector("[data-assist-body]");

  // ── costruzione dei messaggi ──────────────────────────────────────────
  function bolla(testo) {
    const p = document.createElement("p");
    p.className = "assist-msg";
    p.textContent = testo;
    body.appendChild(p);
    return p;
  }

  function opzioni(voci, onScelta) {
    const wrap = document.createElement("div");
    wrap.className = "assist-options";
    voci.forEach(v => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "assist-option";
      b.textContent = t(v.key);
      b.addEventListener("click", () => {
        // la scelta fatta resta a schermo come risposta dell'utente
        wrap.remove();
        const eco = document.createElement("p");
        eco.className = "assist-msg assist-msg-me";
        eco.textContent = t(v.key);
        body.appendChild(eco);
        onScelta(v);
        body.scrollTop = body.scrollHeight;
      });
      wrap.appendChild(b);
    });
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  // ── conversazione ─────────────────────────────────────────────────────
  function avvia() {
    body.innerHTML = "";
    bolla(t("assist.hello"));
    bolla(t("assist.q1"));
    opzioni(ASSIST_INTERESSI, scelta => chiediBambini(scelta.cats));
  }

  function chiediBambini(cats) {
    bolla(t("assist.q2"));
    opzioni(
      [{ key: "assist.yes", family: true }, { key: "assist.no", family: false }],
      scelta => mostraRisultati(cats, scelta.family)
    );
  }

  function mostraRisultati(cats, soloFamiglia) {
    let trovate = ESPLORA_CATALOG.filter(x => x.published);
    if (cats) trovate = trovate.filter(x => cats.includes(x.category));
    if (soloFamiglia) trovate = trovate.filter(x => x.family);

    // prima quelle con un prezzo: sono le schede più complete
    trovate.sort((a, b) => {
      const pa = a.priceFrom === null ? 1 : 0;
      const pb = b.priceFrom === null ? 1 : 0;
      return pa - pb || tf(a.title).localeCompare(tf(b.title));
    });

    if (trovate.length === 0) {
      bolla(t("assist.none"));
    } else if (soloFamiglia) {
      bolla(t("assist.resultsFamily"));
    } else {
      bolla(t("assist.results"));
    }

    const lista = document.createElement("ul");
    lista.className = "assist-results";
    trovate.slice(0, ASSIST_MAX_RISULTATI).forEach(tour => {
      const li = document.createElement("li");
      li.innerHTML = `
        <a href="${assistLinkCatalogo([tour.category], soloFamiglia)}">
          <span class="assist-res-cat">${assistNomeCategoria(tour.category)}</span>
          <span class="assist-res-title">${tf(tour.title)}</span>
          <span class="assist-res-price">${assistPrezzo(tour)}</span>
        </a>`;
      lista.appendChild(li);
    });
    body.appendChild(lista);

    if (trovate.length > ASSIST_MAX_RISULTATI) {
      bolla(t("assist.more", { n: trovate.length - ASSIST_MAX_RISULTATI }));
    }

    const azioni = document.createElement("div");
    azioni.className = "assist-actions";
    azioni.innerHTML = `
      <a class="btn btn-primary btn-block" href="${assistLinkCatalogo(cats, soloFamiglia)}">${t("assist.catalog")}</a>
      <button class="btn btn-soft btn-block" type="button" data-assist-restart>${t("assist.restart")}</button>`;
    body.appendChild(azioni);
    azioni.querySelector("[data-assist-restart]").addEventListener("click", avvia);
    body.scrollTop = body.scrollHeight;
  }

  // ── apertura e chiusura ───────────────────────────────────────────────
  function apri() {
    panel.hidden = false;
    scrim.hidden = false;
    requestAnimationFrame(() => {
      panel.classList.add("is-open");
      scrim.classList.add("is-visible");
    });
    fab.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    if (!body.childElementCount) avvia();
  }

  function chiudi() {
    panel.classList.remove("is-open");
    scrim.classList.remove("is-visible");
    fab.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    setTimeout(() => {
      panel.hidden = true;
      scrim.hidden = true;
    }, 300);
  }

  // Cambio lingua: il pannello è costruito da JavaScript, quindi la
  // conversazione riparte da capo nella lingua nuova.
  document.addEventListener("islalang", () => {
    applyI18n(panel);
    fab.setAttribute("aria-label", t("assist.open"));
    if (body.childElementCount) avvia();
  });

  fab.addEventListener("click", apri);
  panel.querySelector("[data-assist-close]").addEventListener("click", chiudi);
  scrim.addEventListener("click", chiudi);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && panel.classList.contains("is-open")) chiudi();
  });
}

document.addEventListener("DOMContentLoaded", initAssistente);

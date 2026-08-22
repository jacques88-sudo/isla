// Assistente di ricerca: un pulsante rotondo in basso a destra che apre una
// conversazione guidata. Fa due domande con risposte da toccare e propone le
// attività del catalogo che corrispondono.
//
// Non usa intelligenza artificiale: le risposte sono decise dalle regole qui
// sotto. Serve una chiave segreta per usare un vero modello, e quella non può
// stare nel browser — servirebbe un backend.
//
// Richiede che esplora-catalog.js sia caricato prima di questo file.

const ASSIST_INTERESSI = [
  { label: "Mare e barche",     cats: ["mare-barche"] },
  { label: "Teide e natura",    cats: ["teide-natura"] },
  { label: "Adrenalina",        cats: ["avventura-motori", "sport-acquatici"] },
  { label: "Parchi e spettacoli", cats: ["parchi-spettacoli"] },
  { label: "Stelle di notte",   cats: ["stelle"] },
  { label: "Girare l'isola",    cats: ["tour-isola"] },
  { label: "Non lo so ancora",  cats: null }   // null = nessun filtro
];

const ASSIST_MAX_RISULTATI = 5;

function assistPrezzo(tour) {
  return tour.priceFrom === null ? "Su richiesta" : "da €" + tour.priceFrom;
}

function assistNomeCategoria(id) {
  const c = CATEGORIES.find(x => x.id === id);
  return c ? c.name : id;
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
  fab.setAttribute("aria-label", "Apri l'assistente per trovare un'escursione");
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
  panel.setAttribute("aria-label", "Assistente Isla");
  panel.hidden = true;
  panel.innerHTML = `
    <div class="assist-head">
      <div>
        <strong>Assistente Isla</strong>
        <span>Ti aiuto a scegliere</span>
      </div>
      <button class="iconbtn" type="button" data-assist-close aria-label="Chiudi">✕</button>
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
      b.textContent = v.label;
      b.addEventListener("click", () => {
        // la scelta fatta resta a schermo come risposta dell'utente
        wrap.remove();
        const eco = document.createElement("p");
        eco.className = "assist-msg assist-msg-me";
        eco.textContent = v.label;
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
    bolla("Ciao! Ti faccio due domande e ti propongo qualcosa.");
    bolla("Cosa ti piacerebbe fare?");
    opzioni(ASSIST_INTERESSI, scelta => chiediBambini(scelta.cats));
  }

  function chiediBambini(cats) {
    bolla("Ci sono bambini con te?");
    opzioni(
      [{ label: "Sì", family: true }, { label: "No", family: false }],
      scelta => mostraRisultati(cats, scelta.family)
    );
  }

  function mostraRisultati(cats, soloFamiglia) {
    let trovate = ESPLORA_CATALOG.filter(t => t.published);
    if (cats) trovate = trovate.filter(t => cats.includes(t.category));
    if (soloFamiglia) trovate = trovate.filter(t => t.family);

    // prima quelle con un prezzo: sono le schede più complete
    trovate.sort((a, b) => {
      const pa = a.priceFrom === null ? 1 : 0;
      const pb = b.priceFrom === null ? 1 : 0;
      return pa - pb || a.title.localeCompare(b.title);
    });

    if (trovate.length === 0) {
      bolla("Su questa combinazione non ho trovato nulla. Prova a cambiare risposta, oppure guarda tutto il catalogo.");
    } else if (soloFamiglia) {
      bolla("Ecco cosa ti consiglio, tutto adatto ai bambini:");
    } else {
      bolla("Ecco cosa ti consiglio:");
    }

    const lista = document.createElement("ul");
    lista.className = "assist-results";
    trovate.slice(0, ASSIST_MAX_RISULTATI).forEach(t => {
      const li = document.createElement("li");
      li.innerHTML = `
        <a href="${assistLinkCatalogo([t.category], soloFamiglia)}">
          <span class="assist-res-cat">${assistNomeCategoria(t.category)}</span>
          <span class="assist-res-title">${t.title}</span>
          <span class="assist-res-price">${assistPrezzo(t)}</span>
        </a>`;
      lista.appendChild(li);
    });
    body.appendChild(lista);

    if (trovate.length > ASSIST_MAX_RISULTATI) {
      bolla("Ce ne sono altre " + (trovate.length - ASSIST_MAX_RISULTATI) + ".");
    }

    const azioni = document.createElement("div");
    azioni.className = "assist-actions";
    azioni.innerHTML = `
      <a class="btn btn-primary btn-block" href="${assistLinkCatalogo(cats, soloFamiglia)}">Vedi il catalogo</a>
      <button class="btn btn-soft btn-block" type="button" data-assist-restart>Ricomincia</button>`;
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

  fab.addEventListener("click", apri);
  panel.querySelector("[data-assist-close]").addEventListener("click", chiudi);
  scrim.addEventListener("click", chiudi);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && panel.classList.contains("is-open")) chiudi();
  });
}

document.addEventListener("DOMContentLoaded", initAssistente);

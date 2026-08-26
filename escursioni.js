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

// L'unità di misura del prezzo, già staccata come va staccata: quella che
// inizia con "/" si attacca al numero ("da €100/ora"), le altre vogliono uno
// spazio davanti ("da €190 a barca"). Vuota quando il prezzo è a persona,
// che è il caso normale. La usa anche tour.js.
function priceUnitSuffix(tour) {
  if (!tour.priceUnit) return "";
  const unita = tf(tour.priceUnit);
  return (unita.startsWith("/") ? "" : " ") + unita;
}

// Il testo che l'utente scrive non arriva mai qui, ma le descrizioni le
// scriviamo noi a mano: se una contiene < o & la pagina non deve rompersi.
// La usano anche tour.js e lista.js.
function esc(testo) {
  return String(testo)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function tourPrice(tour) {
  if (tour.priceFrom === null) return t("tour.onRequest");
  return t("tour.from", { p: tour.priceFrom }) + priceUnitSuffix(tour);
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

// I prezzi a testa da usare per il totale, oppure null quando il totale non si
// puo' fare. Moltiplicare per le persone un prezzo che **non e' a persona**
// (a barca, all'ora, a scaglioni di gruppo) darebbe un numero sbagliato, e un
// numero sbagliato scritto nero su bianco e' peggio di nessun numero.
function prezziAPersona(tour, conTransfer) {
  if (tour.priceUnit) return null;
  if (Array.isArray(tour.priceTiers) && tour.priceTiers.length) return null;
  // Col transfer il listino e' un altro: per il Twin Ticket €78 diventano €99.
  if (conTransfer && tour.transferPrice && tour.transferPrice.adult > 0) {
    return { adulto: tour.transferPrice.adult, bambino: tour.transferPrice.child || 0 };
  }
  if (!(tour.priceAdult > 0)) return null;
  return { adulto: tour.priceAdult, bambino: tour.priceChild || 0 };
}

// Il totale e il conto da cui viene, oppure null quando non si puo' fare.
// Lo usano sia la finestra (che lo mostra) sia il messaggio (che lo scrive):
// un conto solo, cosi' i due numeri non possono diventare diversi.
function calcolaTotale(tour, req) {
  const p = prezziAPersona(tour, req.transfer);
  // Bambini senza il loro prezzo: il totale verrebbe fuori come se non
  // pagassero. Meglio niente che un numero falso.
  if (!p || req.adults < 1 || (req.kids > 0 && !p.bambino)) return null;
  const pezzi = [req.adults + " " + t(req.adults === 1 ? "wa.adult" : "wa.adults") + " × €" + p.adulto];
  if (req.kids > 0) {
    pezzi.push(req.kids + " " + t(req.kids === 1 ? "wa.child" : "wa.children") + " × €" + p.bambino);
  }
  return {
    totale: req.adults * p.adulto + req.kids * p.bambino,
    dettaglio: pezzi.join(" + ")
  };
}

// Le righe che descrivono una richiesta: data, orario, persone, variante,
// transfer, totale, note. Il nome dell'attivita' non c'e': lo scrive chi
// chiama, perche' nel messaggio singolo e' una riga puntata e nella lista e'
// un titolo numerato.
//
// Le usano tutti e due i messaggi, quello per una sola escursione e quello per
// la lista intera: cosi' l'ufficio legge sempre le stesse cose nello stesso
// ordine, invece di due formati da imparare.
function righeRichiesta(tour, req) {
  const righe = ["• " + t("wa.date") + ": " + formatDate(req.date)];
  // L'orario si scrive solo se il cliente ne ha scelto uno. "Da concordare" e'
  // l'assenza della riga, non una riga che dice "da concordare": all'ufficio
  // non serve leggere che il cliente non ha deciso.
  if (req.time) righe.push("• " + t("wa.time") + ": " + req.time);
  righe.push("• " + t("wa.people") + ": " + peopleText(req.adults, req.kids));
  // La variante scelta sta in alto: e' la prima cosa che l'ufficio deve sapere
  // per rispondere col prezzo giusto.
  if (tour.options && req.option) {
    righe.push("• " + tf(tour.options.label) + ": " + req.option);
  }
  // La risposta si scrive sempre, anche quando e' "no": cosi' l'ufficio sa che
  // la domanda e' stata fatta, invece di doverla rifare in chat.
  if (tour.transfer) {
    righe.push("• " + t("wa.transfer") + ": " + t(req.transfer ? "wa.yes" : "wa.no"));
  }
  // Il totale va anche in chat: l'ufficio vede subito che conto ha fatto il
  // cliente e puo' correggerlo prima di confermare. "Indicativo" ci resta
  // attaccato: il prezzo buono e' quello della conferma, non questo.
  const conto = calcolaTotale(tour, req);
  if (conto) {
    righe.push("• " + t("wa.total") + ": €" + conto.totale + " (" + conto.dettaglio + ")");
  }
  if (req.note) righe.push("• " + t("wa.notes") + ": " + req.note);
  return righe;
}

// Messaggio WhatsApp per una sola escursione, con data e persone già compilate.
// È scritto nella lingua che il cliente sta usando sul sito.
function whatsappUrl(tour, req) {
  const testo = t("wa.intro", { name: req.name }) + "\n" +
    "• " + tf(tour.title) + "\n" +
    righeRichiesta(tour, req).join("\n");
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

  // Foto, titolo e pulsante portano tutti alla pagina di dettaglio.
  const href = `./tour.html?id=${encodeURIComponent(tour.id)}`;

  // Il pulsante non apre piu' la richiesta: da qui il cliente ha visto solo
  // tre righe di descrizione, e mandarlo dritto su WhatsApp gli fa chiedere
  // qualcosa che non conosce. "Richiedi disponibilita'" sta sulla pagina di
  // dettaglio, dopo itinerario, cosa e' incluso e consigli.
  const askBtn = `<a class="btn btn-primary tour-ask" href="${href}">${t("tour.details")}</a>`;

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
        ${tour.transfer ? "<li>" + t("tour.transfer") + "</li>" : ""}
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
  const transferEl = document.querySelector("[data-request-transfer]");
  const transferNoteEl = document.querySelector("[data-request-transfer-note]");
  const transferInput = document.getElementById("reqTransfer");
  const optionEl = document.querySelector("[data-request-option]");
  const optionLabelEl = document.querySelector("[data-request-option-label]");
  const dateInput = document.getElementById("reqDate");
  const timeEl = document.querySelector("[data-request-time]");
  const totalEl = document.querySelector("[data-request-total]");
  const adultsInput = document.getElementById("reqAdults");
  const kidsInput = document.getElementById("reqKids");
  const nameBox = document.querySelector("[data-request-name]");
  const nameInput = document.getElementById("reqName");
  if (!dialog || !scrim || !form || !dateInput) return;
  // dopo la guardia: in home la finestra non c'e' e `form` e' null
  const submitBtn = form.querySelector(".request-submit");

  // Blocca le date che non rispettano il preavviso di 24 ore
  dateInput.min = minRequestDate();
  dateInput.max = maxRequestDate();

  let current = null;
  // La stessa finestra serve a due cose: mandare subito la richiesta di questa
  // escursione ("invia"), oppure metterla nella lista per mandarne tante
  // insieme ("aggiungi"). Cambiano due dettagli soltanto: il nome non si chiede
  // (lo si chiede una volta sola quando si manda la lista) e il pulsante in
  // fondo dice un'altra cosa.
  let modo = "invia";

  function open(tour, comeAggiunta) {
    current = tour;
    modo = comeAggiunta ? "aggiungi" : "invia";
    if (nameBox) nameBox.hidden = comeAggiunta;
    // required su un campo nascosto blocca l'invio senza dire perche': il
    // browser prova a segnalare un campo che nessuno vede.
    if (nameInput) nameInput.required = !comeAggiunta;
    if (submitBtn) {
      const chiave = comeAggiunta ? "req.addToList" : "req.submit";
      // anche data-i18n, non solo il testo: al cambio lingua applyI18n
      // riscrive il pulsante e senza questo tornerebbe "Continua su WhatsApp"
      submitBtn.setAttribute("data-i18n", chiave);
      submitBtn.textContent = t(chiave);
    }
    activityEl.textContent = tf(tour.title);
    // se l'attivita' si fa solo in certi mesi lo si dice qui, prima che il
    // cliente scelga una data in cui non si puo' fare
    if (seasonEl) {
      seasonEl.textContent = tour.season ? tf(tour.season) : "";
      seasonEl.hidden = !tour.season;
    }
    // Il menu delle varianti compare solo dove ci sono. Si ricostruisce a ogni
    // apertura: la finestra e' una sola per tutte le attivita', quindi le voci
    // di quella aperta prima resterebbero li'.
    riempiOpzioni(tour);

    // la domanda sul transfer compare solo dove il transfer esiste davvero, e
    // riparte sempre da non spuntata: la finestra e' la stessa per tutte le
    // attivita' e si riapre com'era rimasta
    if (transferEl) {
      transferEl.hidden = !tour.transfer;
      if (transferInput) transferInput.checked = false;
      // il testo per esteso dice i limiti (per il Twin Ticket vale solo per
      // la giornata a Loro Parque) prima che il cliente spunti
      if (transferNoteEl) transferNoteEl.textContent = tour.transfer ? tf(tour.transfer) : "";
    }
    // Gli orari: la finestra e' una sola per tutte le attivita', quindi si
    // riparte sempre da "Da concordare" invece di tenere la scelta di prima.
    if (timeEl) timeEl.value = "";
    riempiOrari(tour);
    aggiornaTotale();

    dialog.hidden = false;
    scrim.hidden = false;
    requestAnimationFrame(() => {
      dialog.classList.add("is-open");
      scrim.classList.add("is-visible");
    });
    document.body.classList.add("menu-open");
  }

  // Sulla pagina di dettaglio la variante si sceglie con i bottoni, sopra il
  // pulsante: la scelta e' gia' fatta e ripeterla qui sarebbe un passaggio in
  // piu'. Restituisce il testo scelto, oppure "" se quei bottoni non ci sono
  // (dalla pagina catalogo, dove si chiede col menu qui sotto).
  function sceltaDallaPagina() {
    const premuto = document.querySelector(
      '[data-detail-options] .detail-option[aria-pressed="true"]');
    return premuto ? premuto.getAttribute("data-option-value") || "" : "";
  }

  // La variante scelta sulla pagina, come oggetto del catalogo e non come
  // testo: serve per leggerne gli orari.
  function sceltaCorrente(tour) {
    if (!tour.options || !Array.isArray(tour.options.choices)) return null;
    const testo = sceltaDallaPagina();
    if (!testo) return null;
    return tour.options.choices.find(s => tf(s.label) === testo) || null;
  }

  // Le voci portano il prezzo quando lo sappiamo ("2 ore — €180"), cosi' il
  // cliente sceglie sapendo quanto costa invece di doverlo chiedere.
  function riempiOpzioni(tour) {
    if (!optionEl || !optionLabelEl) return;
    const opz = tour.options;
    const ci_sono = !!(opz && Array.isArray(opz.choices) && opz.choices.length)
      && !sceltaDallaPagina();
    optionEl.hidden = !ci_sono;
    optionLabelEl.hidden = !ci_sono;
    optionEl.innerHTML = "";
    if (!ci_sono) return;

    optionLabelEl.textContent = tf(opz.label);
    opz.choices.forEach(scelta => {
      const voce = document.createElement("option");
      // il valore e' il testo stesso: e' quello che finisce su WhatsApp
      voce.value = tf(scelta.label);
      voce.textContent = scelta.price
        ? tf(scelta.label) + " — €" + scelta.price
        : tf(scelta.label);
      optionEl.appendChild(voce);
    });
  }

  // Gli orari fra cui scegliere: quelli dell'attivita' se ci sono, altrimenti
  // le fasce segnaposto. La prima voce e' sempre "Da concordare" e vale stringa
  // vuota, cosi' chi non sa a che ora vuole partire non e' costretto a
  // inventare un orario per poter mandare la richiesta.
  function riempiOrari(tour) {
    if (!timeEl) return;
    const scelto = timeEl.value;
    timeEl.innerHTML = "";
    const qualunque = document.createElement("option");
    qualunque.value = "";
    qualunque.textContent = t("req.timeAny");
    timeEl.appendChild(qualunque);
    // Su certe barche l'orario dipende dalla durata scelta: il giro di 2 ore
    // parte alle 11:00 e quello di 3 alle 10:00. Se la variante ha i suoi
    // orari valgono quelli, se no quelli dell'attivita', se no i segnaposto.
    const scelta = sceltaCorrente(tour);
    const orari = (scelta && scelta.times) || tour.times || ORARI_PREDEFINITI;
    orari.forEach(ora => {
      const voce = document.createElement("option");
      voce.value = ora;
      voce.textContent = ora;
      timeEl.appendChild(voce);
    });
    // al cambio lingua si ricostruisce: la scelta del cliente non si perde
    timeEl.value = scelto;
  }

  // "2 adulti × €55 + 1 bambino × €30" e sopra, grosso, "Totale €140". Si
  // aggiorna mentre il cliente cambia i numeri, cosi' vede quanto spende prima
  // di aprire WhatsApp invece di doverlo chiedere. Il conto vero e proprio lo
  // fa calcolaTotale() piu' in alto, che serve anche al messaggio.
  function aggiornaTotale() {
    if (!totalEl || !current || !adultsInput || !kidsInput) return;
    const conto = calcolaTotale(current, {
      adults: parseInt(adultsInput.value, 10) || 0,
      kids: parseInt(kidsInput.value, 10) || 0,
      transfer: !!(transferInput && transferInput.checked)
    });
    if (!conto) {
      totalEl.hidden = true;
      return;
    }
    totalEl.innerHTML =
      '<strong>' + t("req.total") + ' €' + conto.totale + '</strong>' +
      '<span>' + conto.dettaglio + '</span>' +
      '<small>' + t("req.totalNote") + '</small>';
    totalEl.hidden = false;
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
    const btn = e.target.closest("[data-request-open], [data-request-add]");
    if (!btn) return;
    const comeAggiunta = btn.hasAttribute("data-request-add");
    const id = comeAggiunta ? btn.dataset.requestAdd : btn.dataset.requestOpen;
    // La lista ha un tetto: oltre non si aggiunge, e si dice perche' invece di
    // far finta di aver aggiunto.
    if (comeAggiunta && typeof listaEPiena === "function" && listaEPiena()) {
      listaToast(t("lista.full", { n: LISTA_MAX }));
      return;
    }
    const tour = ESPLORA_CATALOG.find(t => t.id === id);
    if (tour) open(tour, comeAggiunta);
  });

  // Il totale segue i numeri mentre il cliente li cambia, e la spunta del
  // transfer perche' col transfer il prezzo e' un altro.
  [adultsInput, kidsInput, transferInput].forEach(campo => {
    if (!campo) return;
    campo.addEventListener("input", aggiornaTotale);
    campo.addEventListener("change", aggiornaTotale);
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
    if (!current) return;
    activityEl.textContent = tf(current.title);
    if (seasonEl && current.season) seasonEl.textContent = tf(current.season);
    if (transferNoteEl && current.transfer) transferNoteEl.textContent = tf(current.transfer);
    // il menu si ricostruisce tradotto, tenendo la posizione scelta
    if (optionEl && current.options) {
      const scelto = optionEl.selectedIndex;
      riempiOpzioni(current);
      if (scelto >= 0) optionEl.selectedIndex = scelto;
    }
    // "Da concordare" e "2 adulti × €55" sono tradotti: si rifanno tutti e due
    riempiOrari(current);
    aggiornaTotale();
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!current) return;

    const req = {
      name: document.getElementById("reqName").value.trim(),
      date: dateInput.value,
      time: timeEl ? timeEl.value : "",
      adults: parseInt(document.getElementById("reqAdults").value, 10) || 1,
      kids: parseInt(document.getElementById("reqKids").value, 10) || 0,
      note: document.getElementById("reqNote").value.trim(),
      transfer: !!(transferInput && transferInput.checked),
      option: sceltaDallaPagina() ||
        (optionEl && !optionEl.hidden ? optionEl.value : "")
    };
    if (!req.date) return;

    // In modalita' "aggiungi" non si va su WhatsApp: la richiesta si mette da
    // parte e il cliente continua a guardare le altre escursioni.
    if (modo === "aggiungi") {
      if (typeof listaAggiungi !== "function") return;
      // Si salva la scelta, non il prezzo: i prezzi cambiano, e un prezzo
      // salvato ieri nel browser del cliente domani sarebbe sbagliato. Il
      // conto si rifa' ogni volta leggendo il catalogo.
      listaAggiungi({
        id: current.id,
        date: req.date,
        time: req.time,
        adults: req.adults,
        kids: req.kids,
        option: req.option,
        transfer: req.transfer,
        note: req.note
      });
      close();
      return;
    }
    if (!req.name) return;

    close();
    window.location.href = whatsappUrl(current, req);
  });
}

document.addEventListener("DOMContentLoaded", initRequestDialog);

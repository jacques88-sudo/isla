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

// I giorni in cui l'attivita' si fa, come numeri di getDay() (0 = domenica).
// Prima quelli della variante scelta, se ne ha di suoi, poi quelli della
// scheda. Lista vuota vuol dire "nessuna limitazione": si fa tutti i giorni.
// La usa anche tour.js.
function giorniDi(tour, variante) {
  const sigle = (variante && variante.days) || tour.days || [];
  return sigle.map(sigla => GIORNI_SIGLE[sigla])
              .filter(n => n !== undefined);
}

// "Lun · Mer · Ven", nella lingua del sito.
function giorniTesto(numeri) {
  return numeri.map(n => t(GIORNI_CHIAVI[n])).join(" · ");
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
  return t("tour.from", { p: eur(tour.priceFrom) }) + priceUnitSuffix(tour);
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
// La variante scelta, come oggetto del catalogo invece che come testo.
function varianteDi(tour, etichetta) {
  if (!etichetta || !tour.options || !Array.isArray(tour.options.choices)) return null;
  return tour.options.choices.find(s => tf(s.label) === etichetta) || null;
}

function prezziAPersona(tour, req) {
  if (tour.priceUnit) return null;
  if (Array.isArray(tour.priceTiers) && tour.priceTiers.length) return null;

  // Il prezzo di partenza: quello della variante scelta se ce l'ha (il giro di
  // 2 ore costa €30 e quello di 4 ore e mezza €62), altrimenti quello della
  // scheda. Conta solo `priceAdult` sulla variante, **non** il suo `price`:
  // `price` e' il numero da scrivere sul bottone e puo' essere il prezzo del
  // mezzo invece che della persona (il jet ski si paga a moto d'acqua, non a
  // testa), e moltiplicarlo per le persone darebbe il doppio. La coppia
  // priceAdult/priceChild invece dice a chiare lettere che quella variante si
  // paga a persona. Bambino a 0 vuol dire "non lo sappiamo ancora" per quella
  // variante (il tutto compreso di Siam Park non ha ancora un prezzo bambini):
  // resta 0 e piu' sotto non gli si somma niente, se no un "non lo sappiamo"
  // diventerebbe un numero verosimile ma falso.
  // Se una variante e' scelta, conta solo il suo prezzo: una variante col
  // `price` ma senza `priceAdult` (una cabina VIP, il jet ski a moto d'acqua)
  // e' apposta non a persona, e cadere sul prezzo della scheda darebbe un
  // totale falso (la cabina VIP di Siam Park mostrerebbe il prezzo del
  // biglietto normale). Il ripiego sulla scheda vale solo senza variante.
  const variante = varianteDi(tour, req.option);
  const base = variante
    ? (variante.priceAdult > 0 ? { adulto: variante.priceAdult, bambino: variante.priceChild || 0 } : null)
    : (tour.priceAdult > 0 ? { adulto: tour.priceAdult, bambino: tour.priceChild || 0 } : null);
  if (!base) return null;

  // Col transfer il listino e' un altro: per il Twin Ticket €78 diventano €99.
  // Il listino in catalogo e' quello **completo** (biglietto+transfer) ma
  // riferito al biglietto base della scheda; qui si ricava il supplemento e lo
  // si somma al prezzo di partenza, cosi' il conto resta giusto anche quando
  // la variante scelta costa piu' (o meno) del biglietto base, come il tutto
  // compreso di Siam Park.
  const supplemento = tp => {
    if (!tp || !(tp.adult > 0)) return null;
    return {
      adulto: tp.adult - (tour.priceAdult || 0),
      bambino: tp.child ? tp.child - (tour.priceChild || 0) : 0
    };
  };
  // Il secondo transfer, una seconda zona di partenza: stessa logica, listino
  // diverso. I due checkbox si escludono a vicenda nella finestra, quindi qui
  // non serve gestire il caso in cui sono spuntati tutti e due.
  const s = req.transfer ? supplemento(tour.transferPrice)
    : req.transferSiam ? supplemento(tour.transferSiamPrice)
    : null;
  if (!s) return base;
  return {
    adulto: base.adulto + s.adulto,
    bambino: base.bambino > 0 ? base.bambino + s.bambino : 0
  };
}

// Il totale e il conto da cui viene, oppure null quando non si puo' fare.
// Lo usano sia la finestra (che lo mostra) sia il messaggio (che lo scrive):
// un conto solo, cosi' i due numeri non possono diventare diversi.
function calcolaTotale(tour, req) {
  const p = prezziAPersona(tour, req);
  // Bambini senza il loro prezzo: il totale verrebbe fuori come se non
  // pagassero. Meglio niente che un numero falso.
  if (!p || req.adults < 1 || (req.kids > 0 && !p.bambino)) return null;
  const pezzi = [req.adults + " " + t(req.adults === 1 ? "wa.adult" : "wa.adults") + " × €" + eur(p.adulto)];
  if (req.kids > 0) {
    pezzi.push(req.kids + " " + t(req.kids === 1 ? "wa.child" : "wa.children") + " × €" + eur(p.bambino));
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
  // Come l'orario: si scrive solo se il cliente ha scelto. "Indifferente" e'
  // l'assenza della riga, non una riga che dice "indifferente".
  if (req.lang) righe.push("• " + t("wa.lang") + ": " + req.lang);
  righe.push("• " + t("wa.people") + ": " + peopleText(req.adults, req.kids));
  // La variante scelta sta in alto: e' la prima cosa che l'ufficio deve sapere
  // per rispondere col prezzo giusto.
  if (tour.options && req.option) {
    righe.push("• " + tf(tour.options.label) + ": " + req.option);
  }
  // Come l'orario e la lingua: la riga compare solo se il cliente ha scelto
  // qualcosa di diverso dal menu standard. Un "menu standard" scritto in chat
  // sarebbe una riga in piu' da leggere che non dice niente; un "vegano" no.
  if (req.menu) righe.push("• " + t("wa.menu") + ": " + req.menu);
  // La risposta si scrive sempre, anche quando e' "no": cosi' l'ufficio sa che
  // la domanda e' stata fatta, invece di doverla rifare in chat.
  if (tour.transfer) {
    const etichetta = tour.transferLabel ? tf(tour.transferLabel) : t("wa.transfer");
    righe.push("• " + etichetta + ": " + t(req.transfer ? "wa.yes" : "wa.no"));
  }
  if (tour.transferSiam) {
    const etichetta = tour.transferSiamLabel ? tf(tour.transferSiamLabel) : t("wa.transferSiam");
    righe.push("• " + etichetta + ": " + t(req.transferSiam ? "wa.yes" : "wa.no"));
  }
  // Il totale va anche in chat: l'ufficio vede subito che conto ha fatto il
  // cliente e puo' correggerlo prima di confermare. "Indicativo" ci resta
  // attaccato: il prezzo buono e' quello della conferma, non questo.
  const conto = calcolaTotale(tour, req);
  if (conto) {
    righe.push("• " + t("wa.total") + ": €" + eur(conto.totale) + " (" + conto.dettaglio + ")");
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
    : `<span class="tour-media-empty" aria-hidden="true">${t("tour.photoSoon")}</span>`;

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
        ${(tour.transfer || tour.transferSiam) ? "<li>" + t("tour.transfer") + "</li>" : ""}
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
  const transferLabelEl = document.querySelector("[data-request-transfer-label]");
  const transferNoteEl = document.querySelector("[data-request-transfer-note]");
  const transferInput = document.getElementById("reqTransfer");
  const transferSiamEl = document.querySelector("[data-request-transfer-siam]");
  const transferSiamLabelEl = document.querySelector("[data-request-transfer-siam-label]");
  const transferSiamNoteEl = document.querySelector("[data-request-transfer-siam-note]");
  const transferSiamInput = document.getElementById("reqTransferSiam");
  const optionEl = document.querySelector("[data-request-option]");
  const optionLabelEl = document.querySelector("[data-request-option-label]");
  const dateInput = document.getElementById("reqDate");
  const timeEl = document.querySelector("[data-request-time]");
  const dayErrorEl = document.querySelector("[data-request-day-error]");
  const langEl = document.querySelector("[data-request-lang]");
  const langLabelEl = document.querySelector("[data-request-lang-label]");
  const menuEl = document.querySelector("[data-request-menu]");
  const menuLabelEl = document.querySelector("[data-request-menu-label]");
  const menuHintEl = document.querySelector("[data-request-menu-hint]");
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
      // La domanda e' quella di sempre, a meno che la scheda non ne dia una
      // sua: serve dove "Vuoi il transfer?" da solo non basta a distinguerlo
      // dal secondo transfer (due zone di partenza diverse sulla stessa scheda).
      if (transferLabelEl) transferLabelEl.textContent = tour.transferLabel ? tf(tour.transferLabel) : t("req.transfer");
    }
    // Il secondo transfer, una seconda zona di partenza indipendente dalla
    // prima: riparte anche lui da non spuntato.
    if (transferSiamEl) {
      transferSiamEl.hidden = !tour.transferSiam;
      if (transferSiamInput) transferSiamInput.checked = false;
      if (transferSiamNoteEl) transferSiamNoteEl.textContent = tour.transferSiam ? tf(tour.transferSiam) : "";
      if (transferSiamLabelEl) transferSiamLabelEl.textContent = tour.transferSiamLabel ? tf(tour.transferSiamLabel) : t("req.transferSiam");
    }
    // Gli orari: la finestra e' una sola per tutte le attivita', quindi si
    // riparte sempre da "Da concordare" invece di tenere la scelta di prima.
    if (timeEl) timeEl.value = "";
    if (langEl) langEl.value = "";
    riempiOrari(tour);
    riempiLingue(tour);
    riempiMenu(tour);
    aggiornaGiorno();
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

  // La variante scelta, da qualunque parte l'abbia scelta il cliente: coi
  // bottoni sulla pagina di dettaglio o col menu qui dentro.
  function opzioneScelta() {
    return sceltaDallaPagina() ||
      (optionEl && !optionEl.hidden ? optionEl.value : "");
  }

  // Come sopra, ma come oggetto del catalogo: serve per leggerne gli orari.
  function sceltaCorrente(tour) {
    return varianteDi(tour, opzioneScelta());
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
      const prezzo = scelta.price || scelta.priceAdult;
      voce.textContent = prezzo
        ? tf(scelta.label) + " — €" + eur(prezzo)
        : tf(scelta.label);
      optionEl.appendChild(voce);
    });
  }

  // Gli orari fra cui scegliere. "Da concordare" vale stringa vuota e non c'e'
  // sempre: compare solo dove un orario fisso non esiste, cioe' sui charter e
  // sulle attivita' di cui non conosciamo ancora le partenze.
  // Il giorno scelto va bene? Dove l'attivita' non si fa tutti i giorni, il
  // cliente lo deve sapere **appena sceglie la data**, non dopo aver riempito
  // tutto il resto e premuto invia.
  function giornoValido() {
    if (!current || !dateInput.value) return true;
    const giorni = giorniDi(current, sceltaCorrente(current));
    if (!giorni.length) return true;
    // "2026-09-12" letto pezzo per pezzo: new Date("2026-09-12") lo tratta
    // come UTC e in certi fusi orari torna indietro di un giorno.
    const [a, m, g] = dateInput.value.split("-").map(Number);
    return giorni.includes(new Date(a, m - 1, g).getDay());
  }

  function aggiornaGiorno() {
    if (!dayErrorEl) return;
    const ok = giornoValido();
    if (!ok && current) {
      dayErrorEl.textContent = t("req.dayError", {
        giorni: giorniTesto(giorniDi(current, sceltaCorrente(current)))
      });
    }
    dayErrorEl.hidden = ok;
  }

  // Le lingue fra cui scegliere. Compare **solo** dove l'attivita' ha il campo
  // `languages`: sulle altre la domanda non ha senso e non si fa. Come per gli
  // orari, la prima voce non impegna a niente.
  function riempiLingue(tour) {
    if (!langEl || !langLabelEl) return;
    const lingue = Array.isArray(tour.languages) ? tour.languages : [];
    langEl.hidden = !lingue.length;
    langLabelEl.hidden = !lingue.length;
    if (!lingue.length) return;

    const scelta = langEl.value;
    langEl.innerHTML = "";
    const qualunque = document.createElement("option");
    qualunque.value = "";
    qualunque.textContent = t("req.langAny");
    langEl.appendChild(qualunque);
    lingue.forEach(lingua => {
      const voce = document.createElement("option");
      voce.value = lingua;
      // le lingue sono gia' scritte nella lingua stessa: non si traducono
      voce.textContent = lingua;
      langEl.appendChild(voce);
    });
    langEl.value = scelta;
  }

  // Le scelte di menu, sulle attivita' dove si mangia. Come le lingue, compare
  // **solo** dove l'attivita' ha il campo `menus`. La prima voce e' "Menu
  // standard" e vale stringa vuota: chi la lascia li' non fa comparire nessuna
  // riga nel messaggio, perche' all'ufficio interessa solo l'esigenza vera.
  // Le allergie non stanno nell'elenco: la riga sotto ricorda di scriverle
  // nelle note, che e' testo libero.
  function riempiMenu(tour) {
    if (!menuEl || !menuLabelEl) return;
    const voci = Array.isArray(tour.menus) ? tour.menus : [];
    menuEl.hidden = !voci.length;
    menuLabelEl.hidden = !voci.length;
    if (menuHintEl) menuHintEl.hidden = !voci.length;
    if (!voci.length) return;

    const scelta = menuEl.value;
    menuEl.innerHTML = "";
    const standard = document.createElement("option");
    standard.value = "";
    standard.textContent = t("req.menuStandard");
    menuEl.appendChild(standard);
    voci.forEach(voceMenu => {
      const opt = document.createElement("option");
      // il valore e' il testo tradotto: e' quello che finisce su WhatsApp
      opt.value = tf(voceMenu);
      opt.textContent = tf(voceMenu);
      menuEl.appendChild(opt);
    });
    menuEl.value = scelta;
  }

  function riempiOrari(tour) {
    if (!timeEl) return;
    const scelto = timeEl.value;
    timeEl.innerHTML = "";
    // Su certe barche l'orario dipende dalla durata scelta: il giro di 2 ore
    // parte alle 11:00 e quello di 3 alle 10:00. Se la variante ha i suoi
    // orari valgono quelli, se no quelli dell'attivita'.
    const scelta = sceltaCorrente(tour);
    const veri = (scelta && scelta.times) || tour.times;
    // Tre casi diversi, e "Da concordare" ne riguarda solo due.
    //   orari veri     → si sceglie fra quelli e basta. Offrire "Da concordare"
    //                    dove la barca parte alle 10:00 e alle 13:00 fa credere
    //                    che l'ora si tratti, e non e' vero.
    //   times: []      → il charter: la barca e' tua e l'ora la concordi davvero.
    //                    Li' "Da concordare" e' l'unica voce onesta.
    //   campo assente  → gli orari veri non li sappiamo ancora. Restano le fasce
    //                    segnaposto, che il cliente legge come preferenza, piu'
    //                    "Da concordare" per chi non ne ha una.
    const orari = veri || ORARI_PREDEFINITI;
    if (!veri || !orari.length) {
      const qualunque = document.createElement("option");
      qualunque.value = "";
      qualunque.textContent = t("req.timeAny");
      timeEl.appendChild(qualunque);
    }
    orari.forEach(ora => {
      const voce = document.createElement("option");
      voce.value = ora;
      voce.textContent = ora;
      timeEl.appendChild(voce);
    });
    // al cambio lingua si ricostruisce: la scelta del cliente non si perde
    timeEl.value = scelto;
    // Cambiando variante l'orario di prima puo' non esistere piu' (dal charter
    // al giro condiviso): se il ripristino non attacca, il menu resterebbe
    // vuoto. Si riparte dalla prima voce.
    if (timeEl.selectedIndex < 0) timeEl.selectedIndex = 0;
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
      transfer: !!(transferInput && transferInput.checked),
      transferSiam: !!(transferSiamInput && transferSiamInput.checked),
      // senza la variante il totale userebbe il prezzo sbagliato su tutte le
      // schede dove il prezzo dipende dalla durata
      option: opzioneScelta()
    });
    if (!conto) {
      totalEl.hidden = true;
      return;
    }
    totalEl.innerHTML =
      '<strong>' + t("req.total") + ' €' + eur(conto.totale) + '</strong>' +
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

  dateInput.addEventListener("input", aggiornaGiorno);
  dateInput.addEventListener("change", aggiornaGiorno);

  // I due transfer si escludono a vicenda: un cliente sta o al nord o al sud,
  // non in tutti e due i posti. Spuntarne uno toglie la spunta all'altro.
  if (transferInput && transferSiamInput) {
    transferInput.addEventListener("change", () => {
      if (transferInput.checked) transferSiamInput.checked = false;
    });
    transferSiamInput.addEventListener("change", () => {
      if (transferSiamInput.checked) transferInput.checked = false;
    });
  }

  // Il totale segue i numeri mentre il cliente li cambia, e la spunta dei
  // transfer perche' col transfer il prezzo e' un altro.
  [adultsInput, kidsInput, transferInput, transferSiamInput].forEach(campo => {
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
    if (transferLabelEl) transferLabelEl.textContent = current.transferLabel ? tf(current.transferLabel) : t("req.transfer");
    if (transferSiamNoteEl && current.transferSiam) transferSiamNoteEl.textContent = tf(current.transferSiam);
    if (transferSiamLabelEl) transferSiamLabelEl.textContent = current.transferSiamLabel ? tf(current.transferSiamLabel) : t("req.transferSiam");
    // il menu si ricostruisce tradotto, tenendo la posizione scelta
    if (optionEl && current.options) {
      const scelto = optionEl.selectedIndex;
      riempiOpzioni(current);
      if (scelto >= 0) optionEl.selectedIndex = scelto;
    }
    // "Da concordare" e "2 adulti × €55" sono tradotti: si rifanno tutti e due
    riempiOrari(current);
    riempiLingue(current);
    riempiMenu(current);
    aggiornaTotale();
    aggiornaGiorno();
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!current) return;

    const req = {
      name: document.getElementById("reqName").value.trim(),
      date: dateInput.value,
      time: timeEl ? timeEl.value : "",
      lang: (langEl && !langEl.hidden) ? langEl.value : "",
      menu: (menuEl && !menuEl.hidden) ? menuEl.value : "",
      adults: parseInt(document.getElementById("reqAdults").value, 10) || 1,
      kids: parseInt(document.getElementById("reqKids").value, 10) || 0,
      note: document.getElementById("reqNote").value.trim(),
      transfer: !!(transferInput && transferInput.checked),
      transferSiam: !!(transferSiamInput && transferSiamInput.checked),
      option: opzioneScelta()
    };
    if (!req.date) return;
    // Il giorno sbagliato ferma la richiesta: il messaggio e' gia' li' sotto
    // la data da quando l'ha scelta.
    if (!giornoValido()) { aggiornaGiorno(); dateInput.focus(); return; }

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
        lang: req.lang,
        menu: req.menu,
        adults: req.adults,
        kids: req.kids,
        option: req.option,
        transfer: req.transfer,
        transferSiam: req.transferSiam,
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

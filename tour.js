// Pagina di dettaglio di una singola escursione.
//
// L'indirizzo è tour.html?id=<id della voce in esplora-catalog.js>.
// Da qui si arriva toccando una scheda nel catalogo.
//
// Riusa da escursioni.js: tourPrice(), categoryName() e la finestra
// "Richiedi disponibilità" con il messaggio WhatsApp già compilato.
// Richiede i18n.js e esplora-catalog.js caricati prima.

// Quante altre esperienze della stessa categoria mostrare in fondo
const DETAIL_MAX_CORRELATE = 3;

function tourFromUrl() {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return null;
  return ESPLORA_CATALOG.find(t => t.id === id && t.published) || null;
}

function detailMedia(tour) {
  return tour.image
    ? `<img src="./assets/${encodeURIComponent(tour.image)}" alt="${esc(tf(tour.title))}" />`
    : `<span class="tour-media-empty" aria-hidden="true">Isla</span>`;
}

// Le righe "In breve": si saltano i campi ancora da definire, cosi' la
// scheda non si riempie di "Da definire".
function detailRows(tour) {
  // daDefinire() arriva da escursioni.js, caricato prima di questo file
  const righe = [];

  if (!daDefinire(tour.zone)) {
    righe.push([t("detail.departure"), tf(tour.zone)]);
  }
  // Quando le varianti SONO le durate ("1 ora" / "2 ore"), il campo duration
  // ripete la stessa cosa in forma riassunta ("1 o 2 ore") e la pagina direbbe
  // "Durata" due volte di fila. Sulla scheda del catalogo la riassunta serve
  // ancora, qui no.
  const opzioniSonoLaDurata = !!(tour.options &&
    tf(tour.options.label) === t("detail.duration"));
  if (!daDefinire(tour.duration) && !opzioniSonoLaDurata) {
    righe.push([t("detail.duration"), tf(tour.duration)]);
  }
  // prezzi a scaglioni: una riga per fascia al posto della riga "Prezzo"
  if (Array.isArray(tour.priceTiers) && tour.priceTiers.length) {
    tour.priceTiers.forEach(fascia => {
      righe.push([
        t("detail.people", { from: fascia.from, to: fascia.to }),
        "€" + fascia.price
      ]);
    });
  } else if (tour.priceAdult > 0 && tour.priceAdult === tour.priceFrom) {
    // "Prezzo: da €55" e "Adulti: €55" dicono la stessa cosa: si tiene solo
    // la seconda, che e' piu' precisa. La riga generica torna appena i due
    // numeri non coincidono, o quando il prezzo adulto non c'e' ancora.
  } else {
    righe.push([t("detail.price"), tourPrice(tour), "prezzo"]);
  }

  // Prezzi per adulto e per bambino: a 0 vuol dire "non ancora deciso" e la
  // riga resta nascosta. Mostrare "€0" farebbe pensare a gratis o a un errore.
  // "Adulti (12+)": la fascia d'eta' fra parentesi, quando il fornitore l'ha
  // detta. Senza, resta solo "Adulti".
  const eta = tour.ages || {};
  const conEta = (etichetta, fascia) => fascia ? etichetta + " (" + fascia + ")" : etichetta;
  if (tour.priceAdult > 0) righe.push([conEta(t("req.adults"), eta.adult), "€" + tour.priceAdult]);
  if (tour.priceChild > 0) righe.push([conEta(t("req.kids"), eta.child), "€" + tour.priceChild]);
  // Per i neonati lo zero vuol dire davvero gratis, non "da decidere": la
  // riga si mostra solo se il campo c'e', e sparisce se manca.
  if (tour.priceInfant !== undefined) {
    righe.push([conEta(t("detail.infants"), eta.infant),
      tour.priceInfant > 0 ? "€" + tour.priceInfant : t("detail.free")]);
  }
  righe.push([t("detail.suitable"), t(tour.family ? "detail.kidsYes" : "detail.kidsNo")]);
  if (tour.transfer) righe.push([t("detail.transfer"), tf(tour.transfer)]);
  // Col transfer il prezzo cambia: si mostra su una riga sola invece che su
  // tre, altrimenti la tabella diventa un listino. Il posto per i neonati
  // esiste solo qui: e' il sedile sul pullman, senza transfer non si paga.
  if (tour.transferPrice) {
    const tp = tour.transferPrice;
    const parti = [];
    if (tp.adult) parti.push("€" + tp.adult + " " + t("wa.adults"));
    if (tp.child) parti.push("€" + tp.child + " " + t("wa.children"));
    if (tp.baby) parti.push("€" + tp.baby + " " + t("wa.babies") + " (" + t("detail.babySeat") + ")");
    if (parti.length) righe.push([t("detail.withTransfer"), parti.join(" · ")]);
  }
  if (tour.season) righe.push([t("detail.season"), tf(tour.season)]);

  return righe.map(([etichetta, valore, aggancio]) => `
    <div class="detail-row">
      <dt>${esc(etichetta)}</dt>
      <dd${aggancio ? ` data-detail-${aggancio}` : ""}>${esc(valore)}</dd>
    </div>`).join("");
}

// Icone di "Cosa e' incluso". Ognuna e' un disegno a linee su una griglia
// 24x24 che prende il colore del testo intorno. Per aggiungerne una servono
// una voce qui e una riga "inc.<parola>" in i18n.js.
const INCLUDED_ICONS = {
  snorkel:   '<rect x="3.5" y="8" width="13" height="8" rx="3.5"/><path d="M16.5 12H20"/><path d="M20 12V6"/>',
  wetsuit:   '<path d="M8 3h8l2 5-2 1v12H6V9L4 8z"/><path d="M10 3v4h4V3"/>',
  board:     '<path d="M12 2c5 4 7 10 7 14 0 3-3 6-7 6s-7-3-7-6c0-4 2-10 7-14z"/><path d="M12 6v14"/>',
  equipment: '<path d="M8 8V6a4 4 0 0 1 8 0v2"/><rect x="4" y="8" width="16" height="13" rx="3"/><path d="M9 13h6"/>',
  drinks:    '<path d="M6 5h12l-1.2 14a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8z"/><path d="M6.6 11h10.8"/>',
  snack:     '<path d="M4 11a8 5 0 0 1 16 0v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z"/><path d="M4.4 14.5h15.2"/>',
  fingerfood: '<path d="M3 15h18a9 9 0 0 1-18 0z"/><circle cx="8" cy="11" r="1.5"/><circle cx="12" cy="9.4" r="1.5"/><circle cx="16" cy="11" r="1.5"/>',
  swimstop:  '<circle cx="16.5" cy="7.5" r="1.8"/><path d="M5 13l4.5-2.5 3 2 3-1.5"/><path d="M2 18c2 0 2 1.2 4 1.2s2-1.2 4-1.2 2 1.2 4 1.2 2-1.2 4-1.2 2 1.2 4 1.2"/>',
  lunch:     '<path d="M6 3v8a2 2 0 0 0 4 0V3M8 11v10"/><path d="M17 3c-2 0-3 3-3 6s1 3 3 3v9"/>',
  tasting:   '<path d="M7 3h10l-1 6a4 4 0 0 1-8 0z"/><path d="M12 13v6M9 21h6"/>',
  guide:     '<circle cx="12" cy="7" r="3"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7"/>',
  transfer:  '<path d="M3 16V8a2 2 0 0 1 2-2h9l4 4h1a2 2 0 0 1 2 2v4"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
  ferry:     '<path d="M3 17l2-6h14l2 6"/><path d="M12 11V5h5"/><path d="M2 20c2 0 2 1 4 1s2-1 4-1 2 1 4 1 2-1 4-1 2 1 4 1"/>',
  ticket:    '<path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1 0 4 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4 2 2 0 0 1 0-4z"/><path d="M14 6v12"/>',
  photos:    '<path d="M3 8a2 2 0 0 1 2-2h3l1.5-2h5L16 6h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="12" r="3.5"/>',
  // Il salvagente e non il giubbotto: un gilet disegnato a due tratti finisce
  // per somigliare alla muta qui sopra, l'anello no.
  lifejacket: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5"/><path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5"/>',
  // La cassa portatile: woofer grande, tweeter piccolo. Una nota musicale
  // direbbe "musica", non "te la prestiamo noi".
  speaker:   '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><circle cx="12" cy="15" r="3.4"/><circle cx="12" cy="7" r="1.1"/>',
  // La pila di asciugamani piegati. L'asciugamano appeso alla sbarra, provato
  // prima, diventava un bicchiere: la sbarra si confondeva col bordo di sopra.
  towels:    '<rect x="4.5" y="15" width="15" height="5" rx="2"/><rect x="6" y="9.5" width="12" height="5" rx="2"/><rect x="7.5" y="4" width="9" height="5" rx="2"/>',
  // La pompa di benzina. Senza il basamento sotto e il vetro del display
  // sembrava una caraffa col manico.
  fuel:      '<path d="M3.5 20.5V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v15.5"/><path d="M2.5 20.5h11"/><rect x="5.5" y="5.5" width="5" height="4" rx="1"/><path d="M12.5 10.5h3a2 2 0 0 1 2 2v4.75a1.75 1.75 0 0 0 3.5 0V10.5l-2.2-2.2"/>'
};

// L'itinerario: una riga per tappa, con l'orario a sinistra dove c'e'. E'
// quello che vende una gita di una giornata — il cliente vuole sapere a che
// ora parte e dove lo portano, non solo che "e' bello".
function detailItinerary(tour) {
  if (!Array.isArray(tour.itinerary) || !tour.itinerary.length) return "";

  return `
    <section class="detail-itinerary">
      <h2 class="detail-sub">${esc(t("detail.itinerary"))}</h2>
      <ol>
        ${tour.itinerary.map(tappa => `
          <li>
            ${tappa.time ? `<span class="detail-itinerary-time">${esc(tappa.time)}</span>` : ""}
            <span>${esc(tf(tappa.text))}</span>
          </li>`).join("")}
      </ol>
    </section>`;
}

// I consigli: le cose pratiche da sapere prima di partire. Testo libero e non
// parole chiave come `included`, perche' cambiano troppo da attivita' a
// attivita' per stare in un vocabolario.
function detailNotes(tour) {
  if (!Array.isArray(tour.notes) || !tour.notes.length) return "";

  return `
    <section class="detail-notes">
      <h2 class="detail-sub">${esc(t("detail.notes"))}</h2>
      <ul>
        ${tour.notes.map(nota => `<li>${esc(tf(nota))}</li>`).join("")}
      </ul>
    </section>`;
}

// Il riquadro "Cosa e' incluso": una parola chiave sconosciuta viene saltata
// invece di disegnare un buco.
function detailIncluded(tour) {
  if (!Array.isArray(tour.included) || !tour.included.length) return "";
  const voci = tour.included.filter(k => INCLUDED_ICONS[k]);
  if (!voci.length) return "";

  return `
    <section class="detail-included">
      <h2 class="detail-sub">${esc(t("detail.included"))}</h2>
      <ul>
        ${voci.map(k => `
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${INCLUDED_ICONS[k]}</svg>
            <span>${esc(t("inc." + k))}</span>
          </li>`).join("")}
      </ul>
    </section>`;
}

// Le varianti come bottoni, sulla pagina stessa: il cliente sceglie qui e la
// richiesta parte gia' con la scelta dentro, senza chiedergliela di nuovo.
// La prima e' selezionata di partenza, cosi' non si puo' mandare una richiesta
// senza variante.
function detailOptions(tour) {
  const opz = tour.options;
  if (!opz || !Array.isArray(opz.choices) || !opz.choices.length) return "";

  return `
    <div class="detail-options" data-detail-options
         role="group" aria-label="${esc(tf(opz.label))}">
      <span class="detail-options-label">${esc(tf(opz.label))}</span>
      <div class="detail-options-list">
        ${opz.choices.map((scelta, i) => `
          <button type="button" class="detail-option"
                  data-option-value="${esc(tf(scelta.label))}"
                  ${scelta.price ? `data-option-price="${scelta.price}"` : ""}
                  aria-pressed="${i === 0 ? "true" : "false"}">
            <span class="detail-option-name">${esc(tf(scelta.label))}</span>
            ${scelta.price ? `<span class="detail-option-price">€${scelta.price}</span>` : ""}
          </button>`).join("")}
      </div>
    </div>`;
}

function detailRelated(tour) {
  const altre = ESPLORA_CATALOG.filter(x =>
    x.published && x.category === tour.category && x.id !== tour.id
  ).slice(0, DETAIL_MAX_CORRELATE);
  if (!altre.length) return "";

  return `
    <section class="detail-related">
      <h2>${esc(t("detail.related"))}</h2>
      <ul>
        ${altre.map(x => `
          <li>
            <a href="./tour.html?id=${encodeURIComponent(x.id)}">
              <span class="detail-related-media">
                ${x.image
                  ? `<img src="./assets/${encodeURIComponent(x.image)}" alt="" loading="lazy" />`
                  : `<span class="tour-media-empty" aria-hidden="true">Isla</span>`}
              </span>
              <span class="detail-related-body">
                <span class="detail-related-title">${esc(tf(x.title))}</span>
                <span class="detail-related-price">${esc(tourPrice(x))}</span>
              </span>
            </a>
          </li>`).join("")}
      </ul>
    </section>`;
}

// Rimando alla versione privata della stessa uscita, per chi vuole la barca
// riservata al proprio gruppo.
function detailPrivate(tour) {
  if (!tour.privateOption) return "";
  const privata = ESPLORA_CATALOG.find(x => x.id === tour.privateOption && x.published);
  if (!privata) return "";

  return `
    <a class="detail-alt" href="./tour.html?id=${encodeURIComponent(privata.id)}">
      <span class="detail-alt-title">${esc(t("detail.privateTitle"))}</span>
      <span class="detail-alt-name">${esc(tf(privata.title))} · ${esc(tourPrice(privata))}</span>
      <span class="detail-alt-go">${esc(t("detail.privateLink"))} →</span>
    </a>`;
}

function renderTour(tour) {
  const contenitore = document.querySelector("[data-tour]");
  if (!contenitore) return;

  if (!tour) {
    document.title = t("detail.notFound") + " · Isla";
    contenitore.innerHTML = `
      <div class="state">
        <h2>${esc(t("detail.notFound"))}</h2>
        <p>${esc(t("detail.notFoundText"))}</p>
        <a class="btn btn-primary" href="./escursioni.html">${esc(t("detail.seeAll"))}</a>
      </div>`;
    return;
  }

  document.title = tf(tour.title) + " · Isla";

  // Due strade dallo stesso punto: chiedere solo questa, oppure metterla da
  // parte e continuare a guardare. La prima resta il pulsante pieno, perche'
  // e' quella che fa la maggior parte dei clienti.
  const askBtn = WHATSAPP_NUMBER
    ? `<button class="btn btn-primary btn-block" type="button" data-request-open="${esc(tour.id)}"
               aria-haspopup="dialog" aria-controls="requestDialog">${esc(t("tour.ask"))}</button>
       <button class="btn btn-soft btn-block detail-add" type="button" data-request-add="${esc(tour.id)}"
               aria-haspopup="dialog" aria-controls="requestDialog">${esc(t("req.addToList"))}</button>`
    : "";

  contenitore.innerHTML = `
    <article class="detail-tour">
      <div class="detail-hero">${detailMedia(tour)}</div>
      <div class="detail-main">
        <span class="tour-cat">${esc(categoryName(tour.category))}</span>
        <h1 class="detail-h1">${esc(tf(tour.title))}</h1>
        <p class="detail-lead">${esc(tf(tour.desc))}</p>

        <h2 class="detail-sub">${esc(t("detail.summary"))}</h2>
        <dl class="detail-rows">${detailRows(tour)}</dl>

        ${detailItinerary(tour)}
        ${detailIncluded(tour)}
        ${detailNotes(tour)}
        ${detailOptions(tour)}
        ${askBtn}
        <p class="hint" data-i18n-html="req.hint"></p>
        ${detailPrivate(tour)}
      </div>
    </article>
    ${detailRelated(tour)}`;

  // il paragrafo del preavviso contiene <strong>, quindi passa da applyI18n
  applyI18n(contenitore);
  collegaOpzioni(contenitore, tour);
}

// Un bottone solo alla volta resta premuto, e la riga "Prezzo" segue la
// variante scelta: senza, il cliente sceglie le 2 ore e continua a leggere
// "da €150".
function collegaOpzioni(contenitore, tour) {
  const gruppo = contenitore.querySelector("[data-detail-options]");
  if (!gruppo) return;
  const prezzoEl = contenitore.querySelector("[data-detail-prezzo]");

  function aggiornaPrezzo(bottone) {
    if (!prezzoEl) return;
    const p = bottone.getAttribute("data-option-price");
    // "a barca" segue anche il prezzo della variante: "€190" da solo, su una
    // barca che si paga a barca e non a testa, si legge come "€190 a persona".
    prezzoEl.textContent = p ? "€" + p + priceUnitSuffix(tour) : tourPrice(tour);
  }

  gruppo.addEventListener("click", e => {
    const bottone = e.target.closest(".detail-option");
    if (!bottone) return;
    gruppo.querySelectorAll(".detail-option")
      .forEach(b => b.setAttribute("aria-pressed", String(b === bottone)));
    aggiornaPrezzo(bottone);
  });

  const iniziale = gruppo.querySelector('.detail-option[aria-pressed="true"]');
  if (iniziale) aggiornaPrezzo(iniziale);
}

function initTourPage() {
  if (!document.querySelector("[data-tour]")) return;
  const tour = tourFromUrl();
  renderTour(tour);
  // al cambio lingua la scheda va ridisegnata: e' costruita da JavaScript
  document.addEventListener("islalang", () => renderTour(tourFromUrl()));
}

document.addEventListener("DOMContentLoaded", initTourPage);

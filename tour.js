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

// Il testo che l'utente scrive non arriva mai qui, ma le descrizioni le
// scriviamo noi a mano: se una contiene < o & la pagina non deve rompersi.
function esc(testo) {
  return String(testo)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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
  if (!daDefinire(tour.duration)) {
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
  } else {
    righe.push([t("detail.price"), tourPrice(tour)]);
  }

  // Prezzi per adulto e per bambino: a 0 vuol dire "non ancora deciso" e la
  // riga resta nascosta. Mostrare "€0" farebbe pensare a gratis o a un errore.
  if (tour.priceAdult > 0) righe.push([t("req.adults"), "€" + tour.priceAdult]);
  if (tour.priceChild > 0) righe.push([t("req.kids"), "€" + tour.priceChild]);
  righe.push([t("detail.suitable"), t(tour.family ? "detail.kidsYes" : "detail.kidsNo")]);
  if (tour.season) righe.push([t("detail.season"), tf(tour.season)]);

  return righe.map(([etichetta, valore]) => `
    <div class="detail-row">
      <dt>${esc(etichetta)}</dt>
      <dd>${esc(valore)}</dd>
    </div>`).join("");
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

  const askBtn = WHATSAPP_NUMBER
    ? `<button class="btn btn-primary btn-block" type="button" data-request-open="${esc(tour.id)}"
               aria-haspopup="dialog" aria-controls="requestDialog">${esc(t("tour.ask"))}</button>`
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

        ${askBtn}
        <p class="hint" data-i18n-html="req.hint"></p>
        ${detailPrivate(tour)}
      </div>
    </article>
    ${detailRelated(tour)}`;

  // il paragrafo del preavviso contiene <strong>, quindi passa da applyI18n
  applyI18n(contenitore);
}

function initTourPage() {
  if (!document.querySelector("[data-tour]")) return;
  const tour = tourFromUrl();
  renderTour(tour);
  // al cambio lingua la scheda va ridisegnata: e' costruita da JavaScript
  document.addEventListener("islalang", () => renderTour(tourFromUrl()));
}

document.addEventListener("DOMContentLoaded", initTourPage);

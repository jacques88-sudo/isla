// Il meteo (20 ottobre 2026, proprietario), dalle previsioni delle spiagge di
// AEMET. Due posti:
//   - "Le mie prenotazioni" (booking.js): sulle escursioni confermate di oggi,
//     domani e dopodomani, la previsione della spiaggia della zona, della
//     mattina o del pomeriggio;
//   - la mappa (mappa.js): toccando una spiaggia, oggi e domani.
// E sulle escursioni che salgono sul Teide (20 ottobre 2026, proprietario) il
// bollettino di montagna di AEMET: solo le temperature, vedi METEO_TEIDE.
// Solo i dati, nessun giudizio ("buona giornata per la barca" no): se si esce
// lo decide l'operatore. E si scrive sempre che la previsione e' di AEMET.
//
// I dati li prende ogni 3 ore la funzione meteo-aemet e li salva nella tabella
// meteo (supabase/modifiche/2026-10-20-meteo.sql); qui si leggono da
// meteo_prossimi(). Una spiaggia nuova va aggiunta anche in SPIAGGE della
// funzione, se no qui non arriva niente.
//
// La pagina disegna un posto vuoto e nascosto (data-meteo); il meteo arriva
// dopo, dalla rete, e meteoRiempi() lo scrive. Senza rete vale l'ultima
// risposta salvata nel telefono; se non c'e', il posto resta nascosto.
//
// Richiede i18n.js e supabase-config.js.

// Le spiagge di AEMET che usiamo: codice → nome (non si traduce).
const METEO_SPIAGGE = {
  "3800112": "Fañabe",
  "3800603": "Las Vistas",
  "3804004": "La Arena",
  "3801905": "San Juan",
  "3801705": "El Médano",
  "3803806": "Las Teresitas",
  "3802601": "El Bollullo",
  "3802801": "Jardín",
  "3803101": "El Socorro"
};
// La spiaggia di ogni zona del catalogo (zoneGroups). Teide e nord e Altre
// isole non ce l'hanno: per il Teide AEMET non dice niente di utile.
// Las Galletas (Mokkai, White Dream) sta nella zona Los Cristianos: AEMET non
// ha la sua spiaggia, e la scritta dice onestamente "Las Vistas".
const METEO_ZONE = {
  "costa-adeje": "3800112",
  "los-cristianos": "3800603",
  "los-gigantes": "3804004"
};
// IL TEIDE (20 ottobre 2026, proprietario). Le spiagge per il Teide non
// dicono niente, ma AEMET fa un bollettino di montagna apposta (BM_Teide.pdf):
// meteo-aemet lo legge e salva le temperature sotto "teide". Solo i numeri:
// cielo e pioggia AEMET li scrive in spagnolo, e qui si parla cinque lingue.
// La zona "Teide e nord" non basta (ci stanno Loro Parque e Santa Cruz): qui
// le schede che salgono davvero, e dove sale solo qualche variante, quelle
// (l'etichetta italiana, come in option_label).
const METEO_TEIDE = {
  "teide-national-park": true,
  "icod-garachico-orotava": true,
  "island-tour-completo": true,
  "masca-teide-cabrio-bus": true,
  "stargazing-group": true,
  "quad-teide-adventure": true,
  "trekking-bici": ["Teide Light"],
  "bici": ["Mount Teide Challenge West Slope (110/150 €)", "Mount Teide Challenge South Slope (110/120 €)",
    "Teide Downhill", "Izaña – El Poris, Teide Easy Downhill", "Teide South Off-road Downhill"]
};
// I punti del bollettino che si mostrano: la vetta e la base della funivia
// (Las Cañadas, dove arrivano i pullman). Izaña è quasi alla stessa quota.
const METEO_TEIDE_PUNTI = ["Teide", "Teleférico"];
const METEO_GIORNI = 3;   // AEMET dà oggi, domani e dopodomani
const METEO_KEY = "isla-meteo";

let METEO = null;         // le righe di meteo_prossimi(), o null finche' non ci sono

const METEO_ICONA = '<svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg>';

// IL CIELO A ICONE (20 ottobre 2026, proprietario): al posto di "Sereno",
// "Nuvoloso"… un disegno, uguale in tutte le lingue. La scritta resta per chi
// legge con lo screen reader (aria-label) e col dito sopra (title).
// Codici di AEMET per le spiagge (100-140) e di meteo-aemet per il Teide
// (100, 105, 110): "nuboso" e' sempre la nuvola.
const METEO_NUVOLA = "M7 19h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.3 11.2 3.9 3.9 0 0 0 7 19z";
const METEO_DISEGNI = {
  sole: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
  soleNuvola: '<path d="M6.2 10.2a3.6 3.6 0 0 1 5.9-3.4M8.8 2.5v1.8M3 8.2h1.8M4.6 4.4l1.2 1.2M13 4.4l-1.2 1.2"/><path d="M9 20h9a3.5 3.5 0 0 0 .5-6.96A5.2 5.2 0 0 0 8.6 13.1 3.45 3.45 0 0 0 9 20z"/>',
  nuvola: '<path d="' + METEO_NUVOLA + '"/>',
  pioggia: '<path transform="translate(0 -3.5)" d="' + METEO_NUVOLA + '"/><path d="M8.5 18.5l-1 2.5M12.5 18.5l-1 2.5M16.5 18.5l-1 2.5"/>',
  neve: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M10 4.5l2 1.5 2-1.5M10 19.5l2-1.5 2 1.5M4.7 10l2.2-1-.3-2.5M19.3 14l-2.2 1 .3 2.5M4.7 14l2.2 1-.3 2.5M19.3 10l-2.2-1 .3-2.5"/>'
};
const METEO_CIELO = { 100: "sole", 105: "soleNuvola", 110: "nuvola", 120: "nuvola", 130: "pioggia", 140: "pioggia" };

function meteoIcona(disegno, scritta) {
  if (!METEO_DISEGNI[disegno]) return "";
  return `<svg class="meteo-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${meteoEsc(scritta)}"><title>${meteoEsc(scritta)}</title>${METEO_DISEGNI[disegno]}</svg>`;
}

function meteoCielo(codice) {
  return codice ? meteoIcona(METEO_CIELO[codice], t("meteo.c" + codice)) : "";
}

function meteoEsc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Il giorno di oggi qui, "2026-10-20", e quello fra n giorni.
function meteoGiorno(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function meteoRiga(spiaggia, giorno) {
  return (METEO || []).find(r => r.spiaggia === spiaggia && r.giorno === giorno) || null;
}

function meteoNumeri(dati) {
  return [
    dati.tmax != null ? t("meteo.max", { n: dati.tmax }) : "",
    dati.acqua != null ? t("meteo.water", { n: dati.acqua }) : "",
    dati.uv != null ? t("meteo.uv", { n: dati.uv }) : ""
  ].filter(Boolean).join(" · ");
}

// ─── Le prenotazioni ──────────────────────────────────────────────────────

// Conta solo la PRIMA zona della scheda, la principale: la bici ha "Teide e
// nord" e poi "Los Gigantes", e il meteo della spiaggia di La Arena per un giro
// in montagna sarebbe sbagliato. Royal Delfin e Shogun cominciano con Costa
// Adeje, e il meteo ce l'hanno.
function meteoSpiaggiaDi(tour, b) {
  const teide = tour && METEO_TEIDE[tour.id];
  if (teide === true || (teide && b && teide.includes(b.option_label))) return "teide";
  const prima = tour && tour.zoneGroups && tour.zoneGroups[0];
  return (prima && METEO_ZONE[prima]) || null;
}

// Mattina (0) o pomeriggio (1): dall'ora del ritrovo, o da quella chiesta.
// Senza ora, la mattina.
function meteoMetaGiornata(b) {
  const ora = (b.time || b.wanted_time || "").match(/(\d{1,2}):\d{2}/);
  return ora && Number(ora[1]) >= 14 ? 1 : 0;
}

// Il posto vuoto nella card (cardTicket): solo dove ci sarà una previsione.
function meteoSegnaposto(b, tour) {
  const spiaggia = meteoSpiaggiaDi(tour, b);
  if (!spiaggia || !b.date) return "";
  const giorni = Array.from({ length: METEO_GIORNI }, (_, i) => meteoGiorno(i));
  if (!giorni.includes(b.date)) return "";
  return `
          <div class="info-field meteo" style="grid-column:1/-1" data-meteo="card|${spiaggia}|${meteoEsc(b.date)}|${meteoMetaGiornata(b)}" hidden></div>`;
}

// Il Teide: tutto il giorno, una riga per punto. "Teide (3715 m): da -1° a
// 2°, percepita fino a -3°". Il bollettino copre solo il giorno dopo: oggi
// resta quello di ieri, dopodomani di solito non c'è ancora.
// Sopra, le icone: il cielo delle cime, e la pioggia o la neve se AEMET le
// aspetta (anche col sole: piove in basso, sotto le nuvole).
function meteoCardTeide(giorno) {
  const r = meteoRiga("teide", giorno);
  const d = (r && r.dati) || {};
  const punti = (d.punti || [])
    .filter(p => METEO_TEIDE_PUNTI.includes(p.nome) && p.min != null && p.max != null);
  const icone = meteoCielo(d.cielo) +
    (d.pioggia ? meteoIcona("pioggia", t("meteo.rain")) : "") +
    (d.neve ? meteoIcona("neve", t("meteo.snow")) : "");
  if (!punti.length && !icone) return null;
  const righe = punti.map(p => t("meteo.mountain", { posto: p.nome, quota: p.quota, min: p.min, max: p.max }) +
    (p.stMin != null && p.stMin < p.min ? t("meteo.feels", { n: p.stMin }) : ""));
  return `
            ${METEO_ICONA}
            <div>
              <h3>${meteoEsc(t("meteo.title"))}</h3>
              ${icone ? `<p class="meteo-icone">${icone}</p>` : ""}
              ${righe.map(x => `<p>${meteoEsc(x)}</p>`).join("")}
              <p class="meteo-fonte">${meteoEsc(t("meteo.sourceTeide"))}</p>
            </div>`;
}

function meteoCard(spiaggia, giorno, meta) {
  if (spiaggia === "teide") return meteoCardTeide(giorno);
  const r = meteoRiga(spiaggia, giorno);
  const d = r && r.dati;
  const cielo = d && d.cielo && d.cielo[meta];
  if (!cielo) return null;     // senza cielo non si scrive niente
  const vento = d.vento && d.vento[meta];
  const onde = d.onde && d.onde[meta];
  const riga1 = [vento ? t("meteo.v" + vento) : "", onde ? t("meteo.o" + onde) : ""]
    .filter(Boolean).join(" · ");
  const riga2 = meteoNumeri(d);
  return `
            ${METEO_ICONA}
            <div>
              <h3>${meteoEsc(t("meteo.title"))} · ${meteoEsc(t(meta ? "meteo.afternoon" : "meteo.morning"))}</h3>
              <p class="meteo-icone">${meteoCielo(cielo)}${riga1 ? `<span>${meteoEsc(riga1)}</span>` : ""}</p>
              ${riga2 ? `<p>${meteoEsc(riga2)}</p>` : ""}
              <p class="meteo-fonte">${meteoEsc(t("meteo.source", { posto: METEO_SPIAGGE[spiaggia] }))}</p>
            </div>`;
}

// ─── La mappa ─────────────────────────────────────────────────────────────

// Il posto vuoto nel riquadro della spiaggia (mapSheetHtml). p.meteo dice di
// quale spiaggia di AEMET è la previsione, e "km" se è un'altra spiaggia vicina.
function meteoMappaSegnaposto(p) {
  if (!p.meteo || !METEO_SPIAGGE[p.meteo.spiaggia]) return "";
  return `<div class="map-meteo" data-meteo="mappa|${p.meteo.spiaggia}|${p.meteo.km || ""}" hidden></div>`;
}

// Mattina e pomeriggio: il cielo a icone, "nuvola → sole", o una sola se
// uguali (HTML). Vento e onde a parole: il più forte dei due.
function meteoGiornata(d) {
  const due = (campo, prefisso) => {
    const [m, p] = d[campo] || [];
    if (!m && !p) return "";
    return t(prefisso + (!m || !p ? (m || p) : Math.max(m, p)));
  };
  const [cm, cp] = d.cielo || [];
  const cielo = !cm || !cp || METEO_CIELO[cm] === METEO_CIELO[cp]
    ? meteoCielo(cm || cp)
    : meteoCielo(cm) + '<span aria-hidden="true">→</span>' + meteoCielo(cp);
  const resto = [due("vento", "meteo.v"), due("onde", "meteo.o"),
    d.acqua != null ? t("meteo.water", { n: d.acqua }) : "", d.tmax != null ? t("meteo.max", { n: d.tmax }) : ""]
    .filter(Boolean).join(" · ");
  return cielo + (resto ? `<span>${meteoEsc(resto)}</span>` : "");
}

function meteoMappa(spiaggia, km) {
  const righe = [0, 1].map(i => {
    const r = meteoRiga(spiaggia, meteoGiorno(i));
    if (!r || !r.dati || !r.dati.cielo || !(r.dati.cielo[0] || r.dati.cielo[1])) return "";
    return `<p class="meteo-icone"><strong>${meteoEsc(t(i ? "meteo.tomorrow" : "meteo.today"))}</strong> ${meteoGiornata(r.dati)}</p>`;
  }).filter(Boolean);
  if (!righe.length) return null;
  const fonte = km
    ? t("meteo.sourceNear", { posto: METEO_SPIAGGE[spiaggia], km: Number(km).toLocaleString(getLang()) })
    : t("meteo.sourceMap");
  return `<h3>${METEO_ICONA}${meteoEsc(t("meteo.title"))}</h3>${righe.join("")}<p class="meteo-fonte">${meteoEsc(fonte)}</p>`;
}

// ─── Riempire e caricare ──────────────────────────────────────────────────

function meteoRiempi() {
  if (!METEO) return;
  document.querySelectorAll("[data-meteo]").forEach(el => {
    const [dove, spiaggia, a, b] = el.dataset.meteo.split("|");
    const html = dove === "card" ? meteoCard(spiaggia, a, Number(b)) : meteoMappa(spiaggia, a);
    if (!html) { el.hidden = true; return; }
    el.innerHTML = html;
    el.hidden = false;
  });
}

function meteoCarica() {
  // prima l'ultima risposta salvata, se c'e': il meteo si vede subito, anche
  // senza rete (i giorni passati non si cercano: si chiede sempre da oggi)
  try {
    const salvato = JSON.parse(localStorage.getItem(METEO_KEY) || "null");
    if (salvato && Array.isArray(salvato.righe)) METEO = salvato.righe;
  } catch (e) { /* incognito */ }
  if (typeof SUPABASE_URL === "undefined") return;
  fetch(SUPABASE_URL + "/rest/v1/rpc/meteo_prossimi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY
    },
    body: "{}"
  })
    .then(r => r.ok ? r.json() : null)
    .then(righe => {
      if (!Array.isArray(righe)) return;
      METEO = righe;
      try { localStorage.setItem(METEO_KEY, JSON.stringify({ quando: Date.now(), righe })); } catch (e) { /* incognito */ }
      meteoRiempi();
    })
    .catch(() => { /* senza rete resta quello salvato */ });
}

meteoCarica();

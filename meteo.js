// Il meteo sulle escursioni confermate di "Le mie prenotazioni" (20 ottobre
// 2026, proprietario): oggi, domani e dopodomani, la previsione della spiaggia
// della zona. Solo i dati, nessun giudizio ("buona giornata per la barca" no):
// se si esce lo decide l'operatore.
//
// I dati sono di AEMET, e si scrive sempre da dove vengono. Li prende ogni 3
// ore la funzione meteo-aemet e li salva nella tabella meteo
// (supabase/modifiche/2026-10-20-meteo.sql); qui si leggono da
// meteo_prossimi(). Una spiaggia per zona del catalogo (zoneGroups): Teide e
// nord e Altre isole non hanno meteo, e la card non mostra niente.
//
// La card la disegna booking.js (cardTicket) con un posto vuoto e nascosto,
// meteoSegnaposto(); il meteo arriva dopo, dalla rete, e meteoRiempi() lo
// scrive. Senza rete vale l'ultima risposta salvata nel telefono; se non c'e',
// il posto resta nascosto.
//
// Richiede i18n.js, supabase-config.js e booking.js (esc, oggiISO).

// Le zone con la spiaggia di AEMET, e il nome della spiaggia (non si traduce).
const METEO_SPIAGGE = {
  "costa-adeje": "Fañabe",
  "los-cristianos": "Las Vistas",
  "los-gigantes": "La Arena"
};
const METEO_GIORNI = 3;   // AEMET dà oggi, domani e dopodomani
const METEO_KEY = "isla-meteo";

let METEO = null;         // le righe di meteo_prossimi(), o null finche' non ci sono

const METEO_ICONA = '<svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg>';

// Conta solo la PRIMA zona della scheda, la principale: la bici ha "Teide e
// nord" e poi "Los Gigantes", e il meteo della spiaggia di La Arena per un giro
// in montagna sarebbe sbagliato. Royal Delfin e Shogun cominciano con Costa
// Adeje, e il meteo ce l'hanno.
function meteoZona(tour) {
  const prima = tour && tour.zoneGroups && tour.zoneGroups[0];
  return prima && METEO_SPIAGGE[prima] ? prima : null;
}

// Mattina (0) o pomeriggio (1): dall'ora del ritrovo, o da quella chiesta.
// Senza ora, la mattina.
function meteoMetaGiornata(b) {
  const ora = (b.time || b.wanted_time || "").match(/(\d{1,2}):\d{2}/);
  return ora && Number(ora[1]) >= 14 ? 1 : 0;
}

// Il posto vuoto nella card: solo dove ci sarà una previsione da scriverci.
function meteoSegnaposto(b, tour) {
  const zona = meteoZona(tour);
  if (!zona || !b.date) return "";
  const [a, m, g] = b.date.split("-").map(Number);
  const [oa, om, og] = oggiISO().split("-").map(Number);
  const fra = Math.round((new Date(a, m - 1, g) - new Date(oa, om - 1, og)) / 86400000);
  if (fra < 0 || fra >= METEO_GIORNI) return "";
  return `
          <div class="info-field meteo" style="grid-column:1/-1" data-meteo="${esc(zona)}|${esc(b.date)}|${meteoMetaGiornata(b)}" hidden></div>`;
}

function meteoTesto(dati, meta) {
  const cielo = dati.cielo && dati.cielo[meta];
  if (!cielo) return null;     // senza cielo non si scrive niente
  const vento = dati.vento && dati.vento[meta];
  const onde = dati.onde && dati.onde[meta];
  const riga1 = [t("meteo.c" + cielo), vento ? t("meteo.v" + vento) : "", onde ? t("meteo.o" + onde) : ""];
  const riga2 = [
    dati.tmax != null ? t("meteo.max", { n: dati.tmax }) : "",
    dati.acqua != null ? t("meteo.water", { n: dati.acqua }) : "",
    dati.uv != null ? t("meteo.uv", { n: dati.uv }) : ""
  ];
  return [riga1, riga2].map(r => r.filter(Boolean).join(" · "));
}

function meteoRiempi() {
  if (!METEO) return;
  document.querySelectorAll("[data-meteo]").forEach(el => {
    const [zona, giorno, meta] = el.dataset.meteo.split("|");
    const riga = METEO.find(r => r.zona === zona && r.giorno === giorno);
    const testo = riga && riga.dati ? meteoTesto(riga.dati, Number(meta)) : null;
    if (!testo) { el.hidden = true; return; }
    el.innerHTML = `
            ${METEO_ICONA}
            <div>
              <h3>${esc(t("meteo.title"))} · ${esc(t(Number(meta) ? "meteo.afternoon" : "meteo.morning"))}</h3>
              <p>${esc(testo[0])}</p>
              ${testo[1] ? `<p>${esc(testo[1])}</p>` : ""}
              <p class="meteo-fonte">${esc(t("meteo.source", { posto: METEO_SPIAGGE[zona] }))}</p>
            </div>`;
    el.hidden = false;
  });
}

function meteoCarica() {
  // prima l'ultima risposta salvata, se c'e': la card ha subito il meteo, anche
  // senza rete; i giorni passati li toglie meteoSegnaposto (solo da oggi)
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

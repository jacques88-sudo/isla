// Le recensioni dei clienti (20 ottobre 2026, proprietario).
//
// Si recensisce IL SERVIZIO, non la singola barca: nelle recensioni che
// avevamo gia' (Tripadvisor, Facebook) i clienti parlano di noi, dei consigli,
// di Francesca. Quindi UNA per cliente, e si leggono nella home ("Dicono di
// noi"), con in piccolo l'escursione che ha fatto.
//
// La scrive SOLO chi c'e' stato: in "Le mie prenotazioni" (booking.js), se fra
// le escursioni c'e' una confermata gia' passata da non piu' di 30 giorni, in
// cima c'e' un solo "Com'e' andata?". Il database controlla di nuovo tutto
// (lascia_recensione() in supabase/modifiche/2026-10-20-recensioni.sql): la
// scheda e il giorno li prende dal ticket, non da qui, e una seconda
// recensione dello stesso cliente non la accetta.
// Due modi di dimostrare che c'e' stato, gli stessi con cui ritrova i ticket:
//   - ticket di carta: numero + telefono (il telefono lo mette booking.js in
//     RECENSIONE_TELEFONO quando cerca il ticket);
//   - richiesta WhatsApp: la chiave che sta in questo telefono (richieste.js).
// La recensione esce sul sito solo dopo che l'ufficio l'ha letta e approvata.
//
// Lo caricano booking.html (il modulo) e index.html (le recensioni).
// Richiede i18n.js, supabase-config.js e esc() (booking.js o escursioni.js);
// il modulo anche sb e oggiISO (booking.js).

// Dopo quanti giorni non si chiede piu': dopo, il ticket puo' essere gia'
// stato tolto dalla pulizia mensile (lo stesso numero sta nel database).
const RECENSIONE_GIORNI = 30;

// Le escursioni gia' recensite da questo telefono: il pulsante diventa "grazie".
const RECENSIONI_FATTE_KEY = "isla-recensioni-fatte";

let RECENSIONE_TELEFONO = null;

const STELLA_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/></svg>`;

function recensioniFatte() {
  try { return JSON.parse(localStorage.getItem(RECENSIONI_FATTE_KEY) || "[]"); }
  catch (e) { return []; }
}

function segnaRecensita(chiave) {
  try {
    const fatte = recensioniFatte().filter(k => k !== chiave);
    fatte.push(chiave);
    // le piu' vecchie non servono: fra 30 giorni il pulsante sparisce comunque
    localStorage.setItem(RECENSIONI_FATTE_KEY, JSON.stringify(fatte.slice(-50)));
  } catch (e) { /* incognito */ }
}

// Quale escursione: la richiesta si riconosce da chiave + scheda + giorno, il
// ticket di carta dal suo numero.
function recensioneChiave(b) {
  return b.request_token
    ? "r:" + b.request_token + "|" + b.excursion_id + "|" + b.date
    : "t:" + b.ticket_number;
}

// "marco rossi" → "Marco R.", "anna" → "Anna". E' quello che si vedra' sul
// sito: il cliente lo legge sotto il campo mentre scrive.
function nomeDaMostrare(testo) {
  const parole = String(testo || "").trim().split(/\s+/).filter(Boolean);
  if (!parole.length) return "";
  const grande = p => p.charAt(0).toLocaleUpperCase() + p.slice(1).toLocaleLowerCase();
  const nome = grande(parole[0]);
  return (parole.length > 1 ? nome + " " + parole[parole.length - 1].charAt(0).toLocaleUpperCase() + "." : nome).slice(0, 40);
}

function giorniFa(iso) {
  const [a, m, g] = iso.split("-").map(Number);
  const [oa, om, og] = oggiISO().split("-").map(Number);
  return Math.round((new Date(oa, om - 1, og) - new Date(a, m - 1, g)) / 86400000);
}

// Su questa escursione la recensione si puo' lasciare?
function recensionePossibile(b) {
  if (!b.date || !b.excursion_id) return false;
  if (b.status && b.status !== "confirmed") return false;
  if (!b.request_token && !(b.ticket_number && RECENSIONE_TELEFONO)) return false;
  const fa = giorniFa(b.date);
  return fa >= 1 && fa <= RECENSIONE_GIORNI;
}

// Il riquadro in cima a "Le mie prenotazioni": uno solo, per l'escursione
// passata piu' recente. Il
// pulsante, oppure il grazie se da questo telefono la recensione e' partita.
// Vuoto dove la recensione non si puo' lasciare.
function recensioneRiquadro(righe) {
  if (!sb) return "";
  const possibili = righe.filter(recensionePossibile)
    .sort((a, b) => b.date.localeCompare(a.date));
  if (!possibili.length) return "";
  const fatte = recensioniFatte();
  if (possibili.some(b => fatte.includes(recensioneChiave(b)))) {
    return `<div class="recensione"><p class="recensione-grazie">${esc(t("rev.done"))}</p></div>`;
  }
  const b = possibili[0];
  const dati = b.request_token
    ? `data-token="${esc(b.request_token)}" data-scheda="${esc(b.excursion_id)}" data-giorno="${esc(b.date)}"`
    : `data-ticket="${esc(b.ticket_number)}"`;
  return `
    <div class="recensione" data-recensione="${esc(recensioneChiave(b))}" ${dati}>
      <button class="btn btn-ghost recensione-apri" type="button" data-recensione-apri>
        ${STELLA_SVG}<span>${esc(t("rev.ask"))}</span>
      </button>
    </div>`;
}

function recensioneModulo(riquadro) {
  const id = "rev-" + Math.random().toString(36).slice(2, 8);
  const stelle = [1, 2, 3, 4, 5].map(n => `
        <label class="recensione-stella">
          <input type="radio" name="${id}-stelle" value="${n}" />
          ${STELLA_SVG}<span class="visually-hidden">${esc(n === 1 ? t("rev.star1") : t("rev.starN", { n }))}</span>
        </label>`).join("");
  const prima = riquadro.innerHTML;
  riquadro.innerHTML = `
    <form class="recensione-modulo" novalidate>
      <h3>${esc(t("rev.title"))}</h3>
      <fieldset class="recensione-stelle">
        <legend>${esc(t("rev.stars"))}</legend>
        ${stelle}
      </fieldset>
      <label for="${id}-testo">${esc(t("rev.text"))}</label>
      <textarea id="${id}-testo" name="testo" rows="4" maxlength="1000"></textarea>
      <label for="${id}-nome">${esc(t("rev.name"))}</label>
      <input id="${id}-nome" name="nome" type="text" autocomplete="name" maxlength="60" required />
      <p class="hint" data-recensione-anteprima hidden></p>
      <p class="hint">${esc(t("rev.consent"))} <a href="./privacy.html" target="_blank" rel="noopener">${esc(t("footer.privacy"))}</a></p>
      <p class="recensione-errore" data-recensione-errore role="alert" hidden></p>
      <div class="recensione-azioni">
        <button class="btn btn-primary" type="submit">${esc(t("rev.send"))}</button>
        <button class="btn btn-ghost" type="button" data-recensione-chiudi>${esc(t("common.close"))}</button>
      </div>
    </form>`;

  const modulo = riquadro.querySelector("form");
  const nome = modulo.querySelector("[name=nome]");
  const anteprima = modulo.querySelector("[data-recensione-anteprima]");
  const errore = modulo.querySelector("[data-recensione-errore]");
  const scrivi = testo => { errore.textContent = testo; errore.hidden = !testo; };

  // le stelle accese fino a quella scelta
  modulo.querySelectorAll(".recensione-stelle input").forEach(input => {
    input.addEventListener("change", () => {
      modulo.querySelectorAll(".recensione-stella").forEach((l, i) =>
        l.classList.toggle("is-on", i < Number(input.value)));
      scrivi("");
    });
  });
  nome.addEventListener("input", () => {
    const visto = nomeDaMostrare(nome.value);
    anteprima.textContent = visto ? t("rev.nameHint", { nome: visto }) : "";
    anteprima.hidden = !visto;
  });
  modulo.querySelector("[data-recensione-chiudi]").addEventListener("click", () => {
    riquadro.innerHTML = prima;
    riquadro.querySelector("[data-recensione-apri]").focus();
  });
  modulo.addEventListener("submit", e => {
    e.preventDefault();
    recensioneManda(riquadro, modulo, scrivi);
  });
  riquadro.querySelector(".recensione-stella input").focus();
}

async function recensioneManda(riquadro, modulo, scrivi) {
  const scelta = modulo.querySelector(".recensione-stelle input:checked");
  const nome = nomeDaMostrare(modulo.querySelector("[name=nome]").value);
  if (!scelta) { scrivi(t("rev.needStars")); return; }
  if (!nome) { scrivi(t("rev.needName")); modulo.querySelector("[name=nome]").focus(); return; }

  const d = riquadro.dataset;
  const bottone = modulo.querySelector("[type=submit]");
  bottone.disabled = true;
  scrivi("");
  let risposta = null;
  let troppi = false;
  try {
    const { data, error } = await sb.rpc("lascia_recensione", {
      p_phone: d.token ? null : RECENSIONE_TELEFONO,
      p_ticket: d.token ? null : d.ticket,
      p_token: d.token || null,
      p_excursion_id: d.token ? d.scheda : null,
      p_date: d.token ? d.giorno : null,
      p_stelle: Number(scelta.value),
      p_testo: modulo.querySelector("[name=testo]").value.trim().slice(0, 1000),
      p_nome: nome,
      p_lingua: getLang()
    });
    if (!error) risposta = data;
    else troppi = /troppi tentativi/.test(error.message || "");
  } catch (e) { /* rete: si dice sotto */ }
  bottone.disabled = false;

  if (risposta === "ok" || risposta === "gia") {
    segnaRecensita(d.recensione);
    riquadro.innerHTML = `<p class="recensione-grazie">${esc(t(risposta === "ok" ? "rev.thanks" : "rev.done"))}</p>`;
    return;
  }
  scrivi(troppi ? t("booking.tooManyText") : risposta === "no" ? t("rev.notFound") : t("rev.error"));
}

document.addEventListener("click", e => {
  const apri = e.target.closest("[data-recensione-apri]");
  if (apri) recensioneModulo(apri.closest("[data-recensione]"));
});

// ─── "Dicono di noi", nella home ──────────────────────────────────────────
// Le pubblicate, scritte su Isla o copiate dall'ufficio da Tripadvisor e
// Facebook (fonte). Senza rete, o finche' non ce n'e' nessuna, la sezione
// resta nascosta. La home non carica la libreria di Supabase: si chiede con
// fetch, come fa richieste.js.

const RECENSIONI_SUBITO = 6;     // quante si vedono prima di "Mostra altre"
const RECENSIONI_MEDIA_DA = 3;   // la media delle stelle solo da 3 in su
const FONTI = { tripadvisor: "Tripadvisor", facebook: "Facebook", google: "Google" };

let RECENSIONI_HOME = null;
let RECENSIONI_TUTTE = false;

function stelleHTML(n) {
  return `<span class="rev-stelle" role="img" aria-label="${esc(t("rev.starsOf", { n }))}">${
    [1, 2, 3, 4, 5].map(i => `<span class="${i <= n ? "is-on" : ""}">${STELLA_SVG}</span>`).join("")}</span>`;
}

function meseDi(iso) {
  const [a, m] = iso.split("-").map(Number);
  return new Date(a, m - 1, 1).toLocaleDateString(getLang(), { month: "long", year: "numeric" });
}

// "in inglese", solo se e' scritta in una lingua diversa da quella della pagina
function linguaDi(codice) {
  if (!codice || codice === getLang()) return "";
  try { return new Intl.DisplayNames([getLang()], { type: "language" }).of(codice); }
  catch (e) { return codice.toUpperCase(); }
}

function cardRecensione(r) {
  const tour = r.excursion_id ? ESPLORA_CATALOG.find(x => x.id === r.excursion_id) : null;
  const fatta = tour
    ? `<p class="rev-tour">${esc(t("rev.did"))} ${tour.published
        ? `<a href="./tour.html?id=${encodeURIComponent(tour.id)}">${esc(tf(tour.title))}</a>`
        : esc(tf(tour.title))}</p>`
    : "";
  const sotto = [meseDi(r.mese), linguaDi(r.lingua), FONTI[r.fonte] ? t("rev.from", { fonte: FONTI[r.fonte] }) : ""]
    .filter(Boolean).map(esc).join(" · ");
  return `
    <article class="rev-card">
      ${r.stelle ? stelleHTML(r.stelle) : `<span class="rev-consiglia">${esc(t("rev.recommends"))}</span>`}
      ${r.testo ? `<p class="rev-testo"${r.lingua ? ` lang="${esc(r.lingua)}"` : ""}>${esc(r.testo)}</p>` : ""}
      <p class="rev-nome">${esc(r.nome)}</p>
      <p class="rev-sotto">${sotto}</p>
      ${fatta}
    </article>`;
}

function disegnaRecensioniHome() {
  const sezione = document.getElementById("recensioni");
  if (!sezione || !RECENSIONI_HOME || !RECENSIONI_HOME.length) return;
  const voti = RECENSIONI_HOME.filter(r => r.stelle);
  const media = voti.length >= RECENSIONI_MEDIA_DA
    ? voti.reduce((s, r) => s + r.stelle, 0) / voti.length : null;
  const visibili = RECENSIONI_TUTTE ? RECENSIONI_HOME : RECENSIONI_HOME.slice(0, RECENSIONI_SUBITO);
  sezione.querySelector("[data-rev-media]").innerHTML = media === null ? "" : `
    ${STELLA_SVG}
    <strong>${esc(media.toLocaleString(getLang(), { minimumFractionDigits: 1, maximumFractionDigits: 1 }))}</strong>
    <span>${esc(t("rev.average", { n: RECENSIONI_HOME.length }))}</span>`;
  const fiducia = document.querySelector("[data-fiducia]");
  if (fiducia) {
    fiducia.innerHTML = sezione.querySelector("[data-rev-media]").innerHTML;
    fiducia.hidden = media === null;
  }
  sezione.querySelector("[data-rev-lista]").innerHTML = visibili.map(cardRecensione).join("");
  const altre = sezione.querySelector("[data-rev-altre]");
  altre.hidden = RECENSIONI_TUTTE || RECENSIONI_HOME.length <= RECENSIONI_SUBITO;
  sezione.hidden = false;
}

function caricaRecensioniHome() {
  const sezione = document.getElementById("recensioni");
  if (!sezione || typeof SUPABASE_URL === "undefined") return;
  sezione.querySelector("[data-rev-altre]").addEventListener("click", () => {
    RECENSIONI_TUTTE = true;
    disegnaRecensioniHome();
  });
  document.addEventListener("islalang", disegnaRecensioniHome);
  fetch(SUPABASE_URL + "/rest/v1/rpc/recensioni_pubblicate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY
    },
    body: "{}"
  })
    .then(r => r.ok ? r.json() : [])
    .then(righe => {
      RECENSIONI_HOME = Array.isArray(righe) ? righe : [];
      disegnaRecensioniHome();
    })
    .catch(() => { /* senza rete la sezione resta nascosta */ });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", caricaRecensioniHome);
else caricaRecensioniHome();

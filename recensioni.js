// Le recensioni dei clienti (20 ottobre 2026, proprietario).
//
// La scrive SOLO chi c'e' stato: in "Le mie prenotazioni" (booking.js), sotto
// ogni escursione confermata gia' passata da non piu' di 30 giorni, c'e' "Com'e'
// andata?". Il database controlla di nuovo tutto (lascia_recensione() in
// supabase/modifiche/2026-10-20-recensioni.sql): la scheda e il giorno li
// prende dal ticket, non da qui.
// Due modi di dimostrare che c'e' stato, gli stessi con cui ritrova i ticket:
//   - ticket di carta: numero + telefono (il telefono lo mette booking.js in
//     RECENSIONE_TELEFONO quando cerca il ticket);
//   - richiesta WhatsApp: la chiave che sta in questo telefono (richieste.js).
// La recensione esce sul sito solo dopo che l'ufficio l'ha letta e approvata.
// Si vedono il nome con l'iniziale ("Marco R."), le stelle, il testo e il mese.
//
// Richiede i18n.js, supabase-config.js (sb) e booking.js (esc, oggiISO).

// Dopo quanti giorni non si chiede piu': dopo, il ticket puo' essere gia'
// stato tolto dalla pulizia mensile (lo stesso numero sta nel database).
const RECENSIONE_GIORNI = 30;

// Le escursioni gia' recensite da questo telefono: il pulsante diventa "grazie".
const RECENSIONI_FATTE_KEY = "isla-recensioni-fatte";

let RECENSIONE_TELEFONO = null;

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

// Il riquadro sotto una card passata: il pulsante, oppure il grazie.
// Vuoto dove la recensione non si puo' lasciare.
function recensioneRiquadro(b) {
  if (!sb || !b.date || !b.excursion_id) return "";
  if (b.status && b.status !== "confirmed") return "";
  if (!b.request_token && !(b.ticket_number && RECENSIONE_TELEFONO)) return "";
  const fa = giorniFa(b.date);
  if (fa < 1 || fa > RECENSIONE_GIORNI) return "";
  const chiave = recensioneChiave(b);
  if (recensioniFatte().includes(chiave)) {
    return `<div class="recensione"><p class="recensione-grazie">${esc(t("rev.done"))}</p></div>`;
  }
  const dati = b.request_token
    ? `data-token="${esc(b.request_token)}" data-scheda="${esc(b.excursion_id)}" data-giorno="${esc(b.date)}"`
    : `data-ticket="${esc(b.ticket_number)}"`;
  return `
    <div class="recensione" data-recensione="${esc(chiave)}" ${dati}>
      <button class="btn btn-ghost recensione-apri" type="button" data-recensione-apri>
        ${STELLA_SVG}<span>${esc(t("rev.ask"))}</span>
      </button>
    </div>`;
}

const STELLA_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/></svg>`;

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

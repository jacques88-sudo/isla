// I preferiti (20 ottobre 2026, proprietario): il cuore sulle schede, per
// salvarsi le escursioni che piacciono e ritrovarle dopo, senza metterle già
// nella lista delle richieste (che è "le voglio chiedere", non "mi piacciono").
//
// Il cuore sta sulla foto di ogni scheda dell'elenco (tourCard in
// escursioni.js) e accanto a "Condividi" nella pagina dell'escursione
// (tour.js). Si ritrovano in Esperienze, con la pillola "♥ Preferiti" (che
// compare solo se ce n'è almeno uno) e con "I miei preferiti" nel Menu
// (escursioni.html?preferiti=1). "Condividi i preferiti" manda un link
// (escursioni.html?pref=id,id,…): chi lo apre vede quelle escursioni, e col
// cuore le salva nelle sue.
//
// Restano SOLO nel telefono (localStorage): nessun account, niente al
// database. Lo dice anche privacy.html.
//
// Richiede i18n.js.

const PREFERITI_KEY = "isla-preferiti";
const PREFERITI_MAX = 100;

function preferiti() {
  try {
    const l = JSON.parse(localStorage.getItem(PREFERITI_KEY) || "[]");
    return Array.isArray(l) ? l.filter(x => typeof x === "string") : [];
  } catch (e) { return []; }
}

function preferitoSalvato(id) {
  return preferiti().includes(id);
}

// Toglie o aggiunge. Le altre parti della pagina (la pillola, l'elenco dei
// preferiti, gli altri cuori della stessa scheda) ascoltano "islapreferiti".
function cambiaPreferito(id) {
  const l = preferiti();
  const c = l.indexOf(id);
  if (c >= 0) l.splice(c, 1); else l.push(id);
  try { localStorage.setItem(PREFERITI_KEY, JSON.stringify(l.slice(-PREFERITI_MAX))); }
  catch (e) { /* incognito: il cuore si accende lo stesso fino alla prossima pagina */ }
  document.dispatchEvent(new CustomEvent("islapreferiti", { detail: { id, salvato: c < 0 } }));
  return c < 0;
}

const CUORE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3s-7.6-4.6-9.2-9.5C1.7 7.4 3.9 4.2 7.3 4.2c2 0 3.6 1.1 4.7 2.7 1.1-1.6 2.7-2.7 4.7-2.7 3.4 0 5.6 3.2 4.5 6.6-1.6 4.9-9.2 9.5-9.2 9.5z"/></svg>';

// Il bottone. "dove" è una classe in più per la posizione (sulla foto o nella
// riga di Condividi). aria-pressed dice a chi usa il lettore se è salvato.
function cuorePreferito(id, dove) {
  const on = preferitoSalvato(id);
  const nome = t(on ? "fav.remove" : "fav.add");
  return `<button class="fav-btn${dove ? " " + dove : ""}${on ? " is-on" : ""}" type="button" data-preferito="${String(id).replace(/"/g, "")}" aria-pressed="${on}" aria-label="${nome}" title="${nome}">${CUORE_SVG}</button>`;
}

function aggiornaCuori(id) {
  document.querySelectorAll("[data-preferito]").forEach(b => {
    if (id && b.dataset.preferito !== id) return;
    const on = preferitoSalvato(b.dataset.preferito);
    b.classList.toggle("is-on", on);
    b.setAttribute("aria-pressed", String(on));
    b.setAttribute("aria-label", t(on ? "fav.remove" : "fav.add"));
    b.title = t(on ? "fav.remove" : "fav.add");
  });
}

document.addEventListener("click", e => {
  const b = e.target.closest("[data-preferito]");
  if (!b) return;
  // il cuore sta sopra la foto, che è un link alla scheda: non la apre
  e.preventDefault();
  e.stopPropagation();
  cambiaPreferito(b.dataset.preferito);
});
document.addEventListener("islapreferiti", e => aggiornaCuori(e.detail && e.detail.id));
document.addEventListener("islalang", () => aggiornaCuori());

// Il link da mandare: le schede nell'ordine in cui sono state salvate.
function linkPreferiti(ids) {
  return new URL("./escursioni.html?pref=" + ids.map(encodeURIComponent).join(","), location.href).href;
}

// "Condividi i preferiti": come Condividi della scheda (tour.js). Il menu del
// telefono se c'è; se no si copia il link; se no WhatsApp.
async function condividiPreferiti(bottone, ids) {
  const url = linkPreferiti(ids);
  const testo = t("fav.shareText", { n: ids.length });
  if (navigator.share) {
    try { await navigator.share({ title: "Isla", text: testo, url }); return; }
    catch (e) { if (e && e.name === "AbortError") return; }
  }
  try {
    await navigator.clipboard.writeText(url);
    const prima = bottone.textContent;
    bottone.textContent = t("detail.shareCopied");
    setTimeout(() => { bottone.textContent = prima; }, 2000);
    return;
  } catch (e) { /* niente appunti: WhatsApp */ }
  window.open("https://wa.me/?text=" + encodeURIComponent(testo + " " + url), "_blank", "noopener");
}

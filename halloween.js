/* Il tema di Halloween della home (proprietario, 24 ottobre 2026).

   Si accende da solo dal 24 al 31 ottobre e si spegne da solo il 1° novembre:
   nessuno deve ricordarsi di toglierlo. L'anno dopo si riaccende, a meno che
   non si tolgano questo file, halloween.css e le loro due righe in index.html.

   Per vederlo in un altro giorno: index.html?halloween=1 (e ?halloween=0 lo
   spegne anche in quei giorni). Non si salva: vale solo per quella pagina.

   Tutto quello che cambia sta sotto la classe "halloween" su <html>: i colori in
   halloween.css, e le decorazioni che questo file aggiunge alla pagina. Sono
   solo disegni (aria-hidden): lo screen reader non li legge e non cambiano
   niente di quello che si tocca. */
(function () {
  const forza = new URLSearchParams(location.search).get("halloween");
  const oggi = new Date();
  const stagione = oggi.getMonth() === 9 && oggi.getDate() >= 24;
  if (forza === "0" || (forza !== "1" && !stagione)) return;

  document.documentElement.classList.add("halloween");

  // Il pipistrello: ali e corpo in un tratto solo, prende il colore da "fill".
  const PIPISTRELLO =
    '<svg viewBox="0 0 64 32" aria-hidden="true"><path fill="currentColor" d="M32 9c-1.4 0-2.3 1-2.6 2.2L28 9.5l.5 3.3C25 11 21 10.6 17 13c-2.6-4-7-6-12-5 2 1.6 3 3.6 3.3 6.2C5.6 14 3 15 1 17c4 0 7 1.4 9 4 2-1.6 4.4-2 7-1.2 1-2.4 3-3.6 5.6-3.4C24 19.6 27.6 22 32 25c4.4-3 8-5.4 9.4-8.6 2.6-.2 4.6 1 5.6 3.4 2.6-.8 5-.4 7 1.2 2-2.6 5-4 9-4-2-2-4.6-3-7.3-2.8C56 11.6 57 9.6 59 8c-5-1-9.4 1-12 5-4-2.4-8-2-11.5-.2l.5-3.3-1.4 1.7C34.3 10 33.4 9 32 9z"/></svg>';

  // La zucca intagliata: arancio, gambo verde, occhi e bocca scuri.
  const ZUCCA =
    '<svg viewBox="0 0 32 32" aria-hidden="true">' +
    '<path fill="#5d7a2e" d="M15 4c0-1.5 1-2.5 2.5-2.5.5 0 .8.4.6.9-.6 1-1.1 2-1.1 3.6h-2z"/>' +
    '<ellipse cx="10.5" cy="18" rx="7.5" ry="10" fill="#e8741e"/>' +
    '<ellipse cx="21.5" cy="18" rx="7.5" ry="10" fill="#e8741e"/>' +
    '<ellipse cx="16" cy="18" rx="7" ry="11" fill="#f28a2e"/>' +
    '<path fill="#2b1a33" d="M9.5 15l3-3.5 2 3.5zM17.5 15l2-3.5 3 3.5zM9 20.5c2 3.5 12 3.5 14 0l-2.2.6-1.3 1.7-1.6-1.4-1.9 1.6-1.9-1.6-1.6 1.4-1.3-1.7z"/>' +
    '</svg>';

  // La ragnatela nell'angolo della foto, e il ragnetto appeso al suo filo.
  const RAGNATELA =
    '<svg viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round">' +
    '<path d="M0 0L100 6M0 0L88 40M0 0L60 72M0 0L30 92M0 0L4 100"/>' +
    '<path d="M24 1.5Q20 9 21 10Q15 15 16 17Q10 20 7.5 24Q4 24 1 24"/>' +
    '<path d="M48 3Q40 16 42 20Q30 30 32 34Q20 40 15 48Q8 48 2 48"/>' +
    '<path d="M74 4.5Q60 24 64 30Q46 46 47 52Q30 60 23 70Q12 72 3 72"/>' +
    '</svg>';
  const RAGNO =
    '<svg viewBox="0 0 24 40" aria-hidden="true"><path stroke="currentColor" stroke-width=".8" d="M12 0v26"/>' +
    '<g fill="#2b1a33" stroke="#2b1a33" stroke-width="1.2" stroke-linecap="round">' +
    '<path fill="none" d="M9 29l-6-3M9 31l-7 0M9 33l-6 3M9 35l-4 4M15 29l6-3M15 31l7 0M15 33l6 3M15 35l4 4"/>' +
    '<ellipse cx="12" cy="33" rx="4" ry="5"/><circle cx="12" cy="27.5" r="2.6"/></g>' +
    '<circle cx="11" cy="27" r=".6" fill="#f28a2e"/><circle cx="13" cy="27" r=".6" fill="#f28a2e"/></svg>';

  function decora() {
    const hero = document.querySelector(".home-hero");
    if (hero) {
      const cielo = document.createElement("div");
      cielo.className = "hw-cielo";
      cielo.setAttribute("aria-hidden", "true");
      cielo.innerHTML =
        '<span class="hw-ragnatela">' + RAGNATELA + "</span>" +
        '<span class="hw-ragno">' + RAGNO + "</span>" +
        [1, 2, 3, 4].map(n => '<span class="hw-bat hw-bat-' + n + '">' + PIPISTRELLO + "</span>").join("");
      hero.appendChild(cielo);
    }

    // Una zucca per parte accanto a "Isla".
    const nome = document.querySelector(".home-name");
    if (nome) {
      nome.insertAdjacentHTML("afterbegin", '<span class="hw-zucca" aria-hidden="true">' + ZUCCA + "</span>");
      nome.insertAdjacentHTML("beforeend", '<span class="hw-zucca" aria-hidden="true">' + ZUCCA + "</span>");
    }

    // Una fila di zucche sotto il titolo "Inizia la tua avventura con…".
    const intro = document.querySelector(".intro .wrap");
    if (intro) {
      intro.insertAdjacentHTML("beforeend",
        '<div class="hw-fila" aria-hidden="true">' +
        ["hw-piccola", "", "hw-piccola"].map(c => '<span class="hw-zucca ' + c + '">' + ZUCCA + "</span>").join("") +
        "</div>");
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", decora);
  else decora();
})();

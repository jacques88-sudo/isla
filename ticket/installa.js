// Il riquadro "Installa Isla Ticket" (17 ottobre 2026).
//
// Tre casi, perche' su Android il menu di Chrome non sempre c'e':
//   - in Chrome: il bottone "Installa" apre la finestra di Android;
//   - dentro la finestra di Isla gia' installata: Isla si prende tutti i link
//     che cominciano con .../isla/, anche questo, e li' non c'e' menu. Il
//     bottone "Apri in Chrome" porta la pagina nel browser, e da li' si installa;
//   - iPhone: Safari non installa da solo, si scrivono i passi.
// Aperta come app Isla Ticket, il riquadro non compare.

const APP_KEY = "isla-ticket-app";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch(() => {});
  });
}

(function () {
  const box = document.querySelector("[data-installa]");
  if (!box) return;
  const testo = box.querySelector("[data-installa-testo]");
  const bottone = box.querySelector("[data-installa-btn]");

  // L'app parte da "./?app=1" (manifest.json): cosi' si distingue da Isla,
  // che e' anche lei "standalone". Il segno resta per tutta la sessione,
  // anche dopo aver ricaricato la pagina senza "?app=1".
  try {
    if (new URLSearchParams(location.search).has("app")) sessionStorage.setItem(APP_KEY, "1");
  } catch (e) { /* incognito */ }
  let nellApp = false;
  try { nellApp = sessionStorage.getItem(APP_KEY) === "1"; } catch (e) { /* incognito */ }

  const standalone = matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
  const iphone = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const android = /Android/.test(navigator.userAgent);

  function mostra(frase, etichetta, azione) {
    testo.textContent = frase;
    bottone.hidden = !etichetta;
    if (etichetta) {
      bottone.textContent = etichetta;
      bottone.onclick = azione;
    }
    box.hidden = false;
  }

  if (standalone && nellApp) return;           // e' gia' l'app installata

  if (standalone && iphone) return;            // sull'iPhone un'app non apre l'altra: niente da proporre

  if (standalone && android) {
    // Dentro la finestra di Isla. L'indirizzo "intent:" dice ad Android di
    // aprire questa pagina proprio in Chrome, non di nuovo in Isla.
    const qui = location.host + location.pathname;
    mostra("Sei dentro l'app Isla: da qui Isla Ticket non si installa. Aprila in Chrome e poi tocca Installa.",
      "Apri in Chrome",
      () => { location.href = "intent://" + qui + "#Intent;scheme=https;package=com.android.chrome;end"; });
    return;
  }

  if (iphone) {
    mostra("Per averla sul telefono: in Safari tocca Condividi (il quadrato con la freccia), poi «Aggiungi alla schermata Home».");
    return;
  }

  // Chrome (Android o computer): il bottone compare solo quando Chrome dice
  // che si puo' installare.
  let richiesta = null;
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    richiesta = e;
    mostra("Mettila sul telefono come app, con la sua icona.", "Installa", async () => {
      if (!richiesta) return;
      richiesta.prompt();
      await richiesta.userChoice;
      richiesta = null;
      box.hidden = true;
    });
  });
  window.addEventListener("appinstalled", () => { box.hidden = true; });
})();

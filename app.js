// Shared across all pages: service worker, ticket lookup form, sticky banner, hero video.

// Splash loading screen: stays up at least a moment (so it doesn't just
// flash), then fades out once the page has finished loading. A safety
// timeout hides it anyway if loading takes too long.
function initSplash() {
  const splash = document.getElementById("splash");
  if (!splash) return;

  const MIN_VISIBLE_MS = 500;
  const MAX_WAIT_MS = 4000;
  const shownAt = Date.now();
  let hidden = false;

  function hide() {
    if (hidden) return;
    hidden = true;
    splash.classList.add("is-hidden");
    splash.addEventListener("transitionend", () => { splash.hidden = true; }, { once: true });
  }

  function ready() {
    const elapsed = Date.now() - shownAt;
    setTimeout(hide, Math.max(0, MIN_VISIBLE_MS - elapsed));
  }

  if (document.readyState === "complete") {
    ready();
  } else {
    window.addEventListener("load", ready);
  }
  setTimeout(hide, MAX_WAIT_MS);
}

initSplash();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

// ─── Il ticket del cliente: numero + telefono ──────────────────────────────
// Ogni <form data-lookup-form> (la finestra del ticket, e il "riprova" di
// booking.html) porta a booking.html?code=<numero>. Il telefono NON va
// nell'indirizzo, dove resterebbe nella cronologia: si salva nel telefono
// (localStorage) insieme al numero, e booking.js lo legge da li'.
//
// Lo stesso salvataggio fa "ricordare" il ticket: la volta dopo la finestra si
// apre gia' compilata, e booking.html senza codice mostra l'ultimo cercato.
const TICKET_KEY = "isla-ticket";

function ticketSalvato() {
  try {
    const v = JSON.parse(localStorage.getItem(TICKET_KEY) || "null");
    return v && v.code ? v : null;
  } catch (e) { return null; }
}

function salvaTicket(dati) {
  try {
    if (dati) localStorage.setItem(TICKET_KEY, JSON.stringify(dati));
    else localStorage.removeItem(TICKET_KEY);
  } catch (e) { /* incognito: si cerca lo stesso, solo non lo ricorda */ }
}

// Il prefisso proposto quando non c'e' niente di salvato: quello della lingua
// scelta. Chi legge in inglese e' quasi sempre inglese, e cosi' via.
function prefissoDellaLingua() {
  return { it: "39", es: "34", en: "44" }[typeof getLang === "function" ? getLang() : "en"] || "44";
}

function initLookupForms() {
  const salvato = ticketSalvato();

  document.querySelectorAll("[data-lookup-form]").forEach(form => {
    if (form.dataset.pronto) return;          // gia' collegato (booking.js lo richiama)
    form.dataset.pronto = "1";

    const code = form.elements.code;
    const phone = form.elements.phone;
    const prefix = form.querySelector("[data-prefix-select]");
    const errore = form.querySelector("[data-lookup-error]");

    if (prefix && typeof PAESI !== "undefined") {
      PAESI.forEach(p => prefix.append(new Option(`${p.code} +${p.prefix}`, p.prefix)));
      const altro = new Option(t("ticket.otherPrefix"), "");
      prefix.append(altro);
      prefix.value = (salvato && salvato.prefix !== undefined) ? salvato.prefix : prefissoDellaLingua();
    }
    if (salvato) {
      if (code && !code.value) code.value = salvato.code;
      if (phone && !phone.value && salvato.phoneTyped) phone.value = salvato.phoneTyped;
    }

    form.addEventListener("submit", e => {
      e.preventDefault();
      const numero = code.value.trim();
      if (!numero) return;

      const scritto = phone ? phone.value.trim() : "";
      let e164 = null;
      if (scritto) {
        e164 = typeof telefonoE164 === "function" ? telefonoE164(prefix ? prefix.value : "", scritto) : null;
        if (!e164) {
          if (errore) { errore.textContent = t("ticket.phoneInvalid"); errore.hidden = false; }
          phone.focus();
          return;
        }
      }
      salvaTicket({ code: numero, phone: e164, phoneTyped: scritto, prefix: prefix ? prefix.value : "" });
      window.location.href = "./booking.html?code=" + encodeURIComponent(numero);
    });

    if (phone && errore) phone.addEventListener("input", () => { errore.hidden = true; });
  });
}

document.addEventListener("DOMContentLoaded", initLookupForms);

// Ticket lookup dialog: opened from the "Scan ticket" tile and the other
// booking-code entry points, instead of living inline in the home page.
function initTicketDialog() {
  const dialog = document.getElementById("ticketDialog");
  const scrim = document.querySelector("[data-ticket-scrim]");
  const openBtns = document.querySelectorAll("[data-ticket-open]");
  const closeBtns = document.querySelectorAll("[data-ticket-close]");
  if (!dialog || !scrim || !openBtns.length) return;

  const input = dialog.querySelector("input");

  // Chi non ha un ticket di carta ma ha mandato richieste su WhatsApp da
  // questo telefono (richieste.js) trova qui la strada per vederle. Il
  // collegamento si aggiunge da qui e non nell'HTML: la finestra e' scritta
  // uguale in sei pagine, e compare solo a chi le richieste le ha.
  // Sta in CIMA, sopra il modulo del ticket: in fondo la tastiera lo copriva.
  function linkRichieste() {
    const n = typeof richiesteLeggi === "function"
      ? richiesteLeggi().reduce((somma, r) => somma + r.items.length, 0) : 0;
    let link = dialog.querySelector("[data-requests-link]");
    let oppure = dialog.querySelector("[data-requests-or]");
    if (!n) {
      if (link) link.remove();
      if (oppure) oppure.remove();
      return false;
    }
    if (!link) {
      link = document.createElement("a");
      link.className = "ticket-requests-link";
      link.href = "./booking.html?richieste=1";
      link.dataset.requestsLink = "";
      oppure = document.createElement("p");
      oppure.className = "ticket-requests-or";
      oppure.dataset.requestsOr = "";
      const testa = dialog.querySelector(".ticket-dialog-head");
      testa.after(link, oppure);
    }
    link.innerHTML = `<span aria-hidden="true">💬</span>` +
      `<span><strong></strong><small></small></span><span aria-hidden="true">›</span>`;
    link.querySelector("strong").textContent = t("ticket.requestsLink", { n });
    link.querySelector("small").textContent = t("ticket.requestsSub");
    oppure.textContent = t("ticket.requestsOr");
    return true;
  }

  function open() {
    // Con le richieste, niente tastiera subito: coprirebbe mezza finestra, e
    // chi le ha probabilmente cerca quelle, non un ticket di carta.
    const conRichieste = linkRichieste();
    dialog.hidden = false;
    scrim.hidden = false;
    requestAnimationFrame(() => {
      dialog.classList.add("is-open");
      scrim.classList.add("is-visible");
      if (input && !conRichieste) input.focus();
    });
    document.body.classList.add("menu-open");
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

  openBtns.forEach(btn => btn.addEventListener("click", open));
  closeBtns.forEach(btn => btn.addEventListener("click", close));
  scrim.addEventListener("click", close);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && dialog.classList.contains("is-open")) close();
  });
}

document.addEventListener("DOMContentLoaded", initTicketDialog);

// In-app install button: shown only when the browser offers installation
// and the app isn't already running installed.
function initInstallButton() {
  // Piu' di uno: il bottone sta nel menu laterale, e la home puo' averne un
  // secondo piu' in vista. Con querySelector si sarebbe acceso solo il primo.
  const btns = [...document.querySelectorAll("[data-install-btn]")];
  if (!btns.length) return;

  const standalone = matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
  if (standalone) return;

  let deferred = null;

  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferred = e;
    btns.forEach(b => { b.hidden = false; });
  });

  window.addEventListener("appinstalled", () => {
    deferred = null;
    btns.forEach(b => { b.hidden = true; });
  });

  btns.forEach(btn => btn.addEventListener("click", async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    btns.forEach(b => { b.hidden = true; });
  }));
}

document.addEventListener("DOMContentLoaded", initInstallButton);

// Hero video play/pause toggle (home page only)
function initHeroVideo() {
  const video = document.getElementById("heroVideo");
  const toggle = document.getElementById("videoToggle");
  if (!video || !toggle) return;

  const iconPause = document.getElementById("iconPause");
  const iconPlay = document.getElementById("iconPlay");

  function paintLabel() {
    toggle.setAttribute("aria-label", t(video.paused ? "hero.play" : "hero.pause"));
  }

  toggle.addEventListener("click", () => {
    if (video.paused) {
      video.play();
      iconPause.hidden = false;
      iconPlay.hidden = true;
    } else {
      video.pause();
      iconPause.hidden = true;
      iconPlay.hidden = false;
    }
    paintLabel();
  });

  // applyI18n rimette sempre "metti in pausa": qui si corregge se il video
  // in quel momento è fermo.
  document.addEventListener("islalang", paintLabel);
}

document.addEventListener("DOMContentLoaded", initHeroVideo);

// "More" off-canvas menu (home page only)
function initMoreMenu() {
  const panel = document.getElementById("moreMenu");
  const scrim = document.querySelector("[data-menu-scrim]");
  const openBtns = document.querySelectorAll("[data-menu-open]");
  const closeBtns = document.querySelectorAll("[data-menu-close]");
  if (!panel || !scrim || !openBtns.length) return;
  aggiungiAreaVenditori(panel);
  const links = document.querySelectorAll("[data-menu-link]");

  function open() {
    panel.hidden = false;
    scrim.hidden = false;
    requestAnimationFrame(() => {
      panel.classList.add("is-open");
      scrim.classList.add("is-visible");
    });
    document.body.classList.add("menu-open");
    openBtns.forEach(btn => btn.setAttribute("aria-expanded", "true"));
  }

  function close() {
    panel.classList.remove("is-open");
    scrim.classList.remove("is-visible");
    document.body.classList.remove("menu-open");
    openBtns.forEach(btn => btn.setAttribute("aria-expanded", "false"));
    setTimeout(() => {
      panel.hidden = true;
      scrim.hidden = true;
    }, 300);
  }

  openBtns.forEach(btn => btn.addEventListener("click", open));
  closeBtns.forEach(btn => btn.addEventListener("click", close));
  links.forEach(link => link.addEventListener("click", close));
  scrim.addEventListener("click", close);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && panel.classList.contains("is-open")) close();
  });
}

// "Area venditori" in fondo al menu, ma solo sul telefono dove un venditore e'
// gia' entrato almeno una volta: il segno lo lascia venditori.js dopo
// l'entrata, e resta anche dopo "Esci" (la scorciatoia serve proprio per
// rientrare). I clienti non la vedono mai. Non e' una protezione: la pagina
// chiede comunque email e password, e il database risponde solo ai venditori.
// Solo in italiano, come la pagina a cui porta.
const VENDITORE_KEY = "isla-venditore";

function aggiungiAreaVenditori(panel) {
  let venditore = false;
  try { venditore = localStorage.getItem(VENDITORE_KEY) === "1"; } catch (e) { /* incognito */ }
  const nav = panel.querySelector(".more-menu-nav");
  if (!venditore || !nav) return;
  const link = document.createElement("a");
  link.href = "./venditori.html";
  link.textContent = "Area venditori";
  link.className = "more-menu-seller";
  link.setAttribute("data-menu-link", "");
  nav.append(link);
}

document.addEventListener("DOMContentLoaded", initMoreMenu);

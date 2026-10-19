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
  return { it: "39", es: "34", fr: "33", de: "49", en: "44" }[typeof getLang === "function" ? getLang() : "en"] || "44";
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
    // Solo finche' c'e' qualcosa in attesa (proprietario, 2/10/2026): una
    // richiesta confermata e' un ticket, e il ticket si cerca qui sotto con
    // numero e telefono, come quelli di carta. Confermate o annullate tutte,
    // il riquadro sparisce.
    const conta = typeof richiesteConta === "function" ? richiesteConta() : null;
    const n = conta ? conta.aperte : 0;
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
    // Subito quello che il telefono sa, poi lo stato vero dal database.
    if (conRichieste && typeof richiesteAggiorna === "function") {
      richiesteAggiorna().then(letto => { if (letto && !dialog.hidden) linkRichieste(); });
    }
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

  // La scorciatoia "Le mie prenotazioni" del manifest (tenendo premuta l'icona
  // dell'app su Android) arriva con `?ticket=1`: si apre subito la finestra,
  // come se il cliente avesse toccato il biglietto in alto.
  if (new URLSearchParams(location.search).has("ticket")) open();
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

  // iPhone e iPad: Safari non manda mai beforeinstallprompt, e il bottone
  // restava spento. Li' l'app si installa solo a mano dal menu Condividi:
  // il bottone si accende sempre e apre i tre passi da fare.
  if (soloAMano()) {
    btns.forEach(b => {
      b.hidden = false;
      b.addEventListener("click", apriIstruzioniIos);
    });
    // Un secondo e mezzo dopo che la pagina e' caricata, non un tempo fisso
    // dall'apertura: con la rete lenta la schermata del logo (initSplash)
    // resta fino a 4 secondi, e l'avviso le finiva sotto.
    const dopo = () => setTimeout(avvisoInstallaIos, 1500);
    if (document.readyState === "complete") dopo();
    else window.addEventListener("load", dopo, { once: true });
    return;
  }

  btns.forEach(btn => btn.addEventListener("click", async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    btns.forEach(b => { b.hidden = true; });
  }));
}

document.addEventListener("DOMContentLoaded", initInstallButton);

// iPhone o iPad. L'iPad nuovo si presenta come un Mac: lo tradisce il tocco.
function soloAMano() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

// L'avviso in basso che invita a installare, sull'iPhone (proprietario, 16
// ottobre 2026): il bottone nel Menu non lo trova nessuno. Torna **a ogni
// visita** finche' Isla non e' installata (proprietario, 19 ottobre 2026;
// prima, toccata la ✕, non tornava mai piu'). La ✕ o "Come si fa" lo
// chiudono per il resto della visita, non a ogni pagina. La visita finisce
// dopo 30 minuti senza aprire pagine di Isla: su Safari la scheda resta
// aperta per giorni, la sessione del browser non basta a dirlo.
// Senza localStorage (navigazione privata) tornerebbe a ogni pagina: meglio
// non mostrarlo affatto.
const INSTALLA_CHIUSO_KEY = "isla-installa-chiuso";
const INSTALLA_VISITA_MS = 30 * 60 * 1000;

function avvisoInstallaIos() {
  try {
    localStorage.removeItem("isla-installa-visto");   // la vecchia regola del "mai piu'"
    const chiuso = Number(localStorage.getItem(INSTALLA_CHIUSO_KEY)) || 0;
    if (Date.now() - chiuso < INSTALLA_VISITA_MS) {
      // stessa visita: niente avviso, e la visita si allunga
      localStorage.setItem(INSTALLA_CHIUSO_KEY, String(Date.now()));
      return;
    }
    localStorage.removeItem(INSTALLA_CHIUSO_KEY);
  } catch (e) { return; }

  const avviso = document.createElement("div");
  avviso.className = "install-hint";
  avviso.setAttribute("role", "region");
  avviso.innerHTML =
    `<span class="install-hint-ico" aria-hidden="true">${ICONA_AGGIUNGI}</span>` +
    `<span class="install-hint-text"><strong></strong><small></small></span>` +
    `<button class="btn btn-primary install-hint-how" type="button"></button>` +
    `<button class="iconbtn install-hint-close" type="button">✕</button>`;
  const scrivi = () => {
    avviso.setAttribute("aria-label", t("install.hint.title"));
    avviso.querySelector("strong").textContent = t("install.hint.title");
    avviso.querySelector("small").textContent = t("install.hint.text");
    avviso.querySelector(".install-hint-how").textContent = t("install.hint.how");
    avviso.querySelector(".install-hint-close").setAttribute("aria-label", t("menu.close"));
  };
  scrivi();
  document.addEventListener("islalang", scrivi);

  const via = () => {
    try { localStorage.setItem(INSTALLA_CHIUSO_KEY, String(Date.now())); } catch (e) {}
    avviso.classList.remove("is-visible");
    setTimeout(() => avviso.remove(), 300);
  };
  avviso.querySelector(".install-hint-close").addEventListener("click", via);
  avviso.querySelector(".install-hint-how").addEventListener("click", () => {
    via();
    apriIstruzioniIos();
  });

  document.body.append(avviso);
  requestAnimationFrame(() => avviso.classList.add("is-visible"));
}

// Le icone sono quelle che il cliente vede sul suo telefono: il quadrato con
// la freccia di Condividi, i tre puntini (iOS 26 nasconde Condividi li'
// dietro) e il quadrato col + di "Aggiungi alla schermata Home".
const ICONA_CONDIVIDI = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M8 7l4-4 4 4M7 11H5v10h14V11h-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ICONA_PUNTINI = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><circle cx="19" cy="12" r="1.8" fill="currentColor"/></svg>`;
const ICONA_AGGIUNGI = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8.5v7M8.5 12h7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;

// La finestra si costruisce qui e non nell'HTML: il bottone sta in sette
// pagine, e la finestra serve solo sull'iPhone.
function apriIstruzioniIos() {
  // Dentro WhatsApp, Instagram o Facebook la pagina gira nel loro browser,
  // che "Aggiungi alla schermata Home" non ce l'ha: prima va aperta in
  // Safari. Safari, Chrome ed Edge scrivono "Safari" nel nome; quei browser no.
  const dentroApp = !/Safari\//.test(navigator.userAgent);

  let dialog = document.getElementById("iosInstall");
  if (!dialog) {
    const scrim = document.createElement("div");
    scrim.className = "ticket-scrim ios-install-scrim";
    scrim.hidden = true;
    dialog = document.createElement("div");
    dialog.className = "ticket-dialog ios-install";
    dialog.id = "iosInstall";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "iosInstallTitle");
    dialog.hidden = true;
    document.body.append(scrim, dialog);

    const chiudi = () => {
      dialog.classList.remove("is-open");
      scrim.classList.remove("is-visible");
      document.body.classList.remove("menu-open");
      setTimeout(() => { dialog.hidden = true; scrim.hidden = true; }, 300);
    };
    dialog._chiudi = chiudi;
    scrim.addEventListener("click", chiudi);
    dialog.addEventListener("click", e => { if (e.target.closest("[data-ios-close]")) chiudi(); });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && dialog.classList.contains("is-open")) chiudi();
    });
  }

  const passi = [];
  if (dentroApp) passi.push(`<li><span class="ios-install-ico">${ICONA_PUNTINI}</span><span>${t("install.ios.inApp")}</span></li>`);
  passi.push(
    `<li><span class="ios-install-ico">${ICONA_CONDIVIDI}</span><span>${t("install.ios.share")}</span></li>`,
    `<li><span class="ios-install-ico">${ICONA_AGGIUNGI}</span><span>${t("install.ios.add")}</span></li>`,
    `<li><span class="ios-install-ico ios-install-ok">✓</span><span>${t("install.ios.confirm")}</span></li>`
  );
  dialog.innerHTML =
    `<div class="ticket-dialog-head"><h2 id="iosInstallTitle"></h2>` +
    `<button class="iconbtn" type="button" data-ios-close aria-label="${t("menu.close")}">✕</button></div>` +
    `<p class="ios-install-intro"></p><ol class="ios-install-steps">${passi.join("")}</ol>` +
    `<button class="btn btn-primary btn-block" type="button" data-ios-close></button>`;
  dialog.querySelector("h2").textContent = t("install.ios.title");
  dialog.querySelector(".ios-install-intro").textContent = t("install.ios.intro");
  dialog.querySelector(".btn-primary").textContent = t("install.ios.ok");

  // Il bottone sta nel menu laterale: il menu si chiude e fa posto.
  const menuAperto = document.querySelector(".more-menu.is-open [data-menu-close]");
  if (menuAperto) menuAperto.click();

  const scrim = document.querySelector(".ios-install-scrim");
  dialog.hidden = false;
  scrim.hidden = false;
  requestAnimationFrame(() => {
    dialog.classList.add("is-open");
    scrim.classList.add("is-visible");
  });
  document.body.classList.add("menu-open");
}

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

// Il numerino sul biglietto della capsula: quante escursioni il cliente ha
// davanti (prenotazioniProssime, richieste.js). Si ridisegna quando arriva lo
// stato nuovo dal database e quando un'altra scheda del browser cambia il
// telefono (un ticket cercato in booking.html, una richiesta mandata).
function initPrenotazioniCount() {
  const numerini = document.querySelectorAll("[data-prenotazioni-count]");
  if (!numerini.length || typeof prenotazioniProssime !== "function") return;
  function disegna() {
    const quante = prenotazioniProssime();
    numerini.forEach(n => {
      n.hidden = quante === 0;
      n.textContent = quante;
    });
  }
  document.addEventListener("islaprenotazioni", disegna);
  window.addEventListener("storage", e => {
    if (e.key === "isla-richieste" || e.key === "isla-ticket-risultato") disegna();
  });
  // Tornando indietro col browser la pagina puo' arrivare dalla memoria, col
  // numero di prima: si ricalcola.
  window.addEventListener("pageshow", e => { if (e.persisted) disegna(); });
  disegna();
}

document.addEventListener("DOMContentLoaded", initPrenotazioniCount);

// Il menu laterale, aperto dalla voce "Menu" della capsula in alto
function initMoreMenu() {
  const panel = document.getElementById("moreMenu");
  const scrim = document.querySelector("[data-menu-scrim]");
  const openBtns = document.querySelectorAll("[data-menu-open]");
  const closeBtns = document.querySelectorAll("[data-menu-close]");
  if (!panel || !scrim || !openBtns.length) return;
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

  // tieniBloccata: il menu si chiude perche' se ne apre un'altra finestra (il
  // ticket), che ha gia' bloccato lo scorrimento della pagina. Togliere il
  // blocco qui la farebbe scorrere sotto la finestra nuova.
  function close(tieniBloccata) {
    panel.classList.remove("is-open");
    scrim.classList.remove("is-visible");
    if (tieniBloccata !== true) document.body.classList.remove("menu-open");
    openBtns.forEach(btn => btn.setAttribute("aria-expanded", "false"));
    setTimeout(() => {
      panel.hidden = true;
      scrim.hidden = true;
    }, 300);
  }

  openBtns.forEach(btn => btn.addEventListener("click", open));
  closeBtns.forEach(btn => btn.addEventListener("click", close));
  links.forEach(link => link.addEventListener("click", close));
  // "Il mio ticket" sta nel menu da quando la capsula in alto ha il carrello:
  // apre la finestra del ticket (initTicketDialog) e il menu le fa posto.
  panel.querySelectorAll("[data-ticket-open]").forEach(btn =>
    btn.addEventListener("click", () => close(true)));
  scrim.addEventListener("click", close);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && panel.classList.contains("is-open")) close();
  });
}

document.addEventListener("DOMContentLoaded", initMoreMenu);

// La tastiera resta dentro la finestra aperta (quarta prova da cliente,
// proprietario 19 ottobre 2026). Con la richiesta aperta il tasto Tab finiva
// sulla pagina dietro 15 volte su 25, e chiudendo con Esc il cursore non
// tornava sul pulsante da cui si era partiti: chi usa la tastiera o un lettore
// di schermo si perdeva. Le finestre modali sono sette (menu, richiesta,
// ticket, lista, pacchetto, chat, istruzioni per installare), costruite in
// modi diversi: invece di sette pezzi di codice, una regola sola che le
// guarda tutte, cioe' ogni [role=dialog][aria-modal=true] che si vede.
// Per chi usa le dita non cambia niente.
(function () {
  const TOCCABILI = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), ' +
    'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const aperte = [];          // le finestre aperte, l'ultima e' quella in cima
  const daDove = new Map();   // finestra -> l'elemento da cui si e' partiti
  let ultimoFuori = null;     // l'ultimo elemento col fuoco fuori da ogni finestra

  const siVede = el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  const finestre = () => [...document.querySelectorAll('[role="dialog"][aria-modal="true"]')];
  const toccabili = d => [...d.querySelectorAll(TOCCABILI)].filter(siVede);

  document.addEventListener("focusin", e => {
    if (!e.target.closest('[role="dialog"][aria-modal="true"]')) ultimoFuori = e.target;
  });

  function guarda() {
    finestre().forEach(d => {
      const aperta = !d.hidden && siVede(d);
      const i = aperte.indexOf(d);
      if (aperta && i < 0) {
        aperte.push(d);
        daDove.set(d, ultimoFuori);
        // Se il codice della finestra non ha gia' messo il cursore dentro
        // (lo fa solo dove serve, per non aprire la tastiera del telefono),
        // va sul primo elemento: di solito la ✕.
        if (!d.contains(document.activeElement)) {
          const primo = toccabili(d)[0];
          if (primo) primo.focus({ preventScroll: true });
        }
      } else if (!aperta && i >= 0) {
        aperte.splice(i, 1);
        const torna = daDove.get(d);
        daDove.delete(d);
        const perso = !document.activeElement || document.activeElement === document.body || d.contains(document.activeElement);
        if (perso && torna && document.contains(torna) && siVede(torna)) torna.focus({ preventScroll: true });
      }
    });
  }

  new MutationObserver(guarda).observe(document.documentElement, {
    subtree: true, childList: true, attributes: true, attributeFilter: ["hidden", "class", "style"]
  });

  document.addEventListener("keydown", e => {
    if (e.key !== "Tab" || !aperte.length) return;
    const d = aperte[aperte.length - 1];
    const lista = toccabili(d);
    if (!lista.length) { e.preventDefault(); return; }
    const primo = lista[0], ultimo = lista[lista.length - 1];
    const dentro = d.contains(document.activeElement);
    if (e.shiftKey && (!dentro || document.activeElement === primo)) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && (!dentro || document.activeElement === ultimo)) { e.preventDefault(); primo.focus(); }
  });
})();

// LA LISTA DELLE RICHIESTE
//
// A COSA SERVE
//   Il cliente che vuole tre escursioni non deve aprire WhatsApp tre volte.
//   Le mette in una lista mentre gira il sito e alla fine parte **un solo
//   messaggio**, con tutte dentro e il totale sommato.
//
// DOVE STA LA LISTA
//   Nel browser del cliente (localStorage), come la scelta della lingua. Non
//   arriva a nessun server: se il cliente non manda il messaggio, quella lista
//   non la vede nessuno. Resta li' anche se chiude e riapre il sito.
//
// COSA SI SALVA
//   Solo le **scelte** del cliente: quale escursione, che giorno, che ora,
//   quante persone, quale variante, transfer si o no. **Mai il prezzo.**
//   I prezzi cambiano: un prezzo salvato ieri nel browser di qualcuno domani
//   sarebbe sbagliato. Il conto si rifa' ogni volta leggendo il catalogo.
//
// DOVE SI TOCCA
//   Il pulsante "Aggiungi alla lista" e' sulla pagina di dettaglio (tour.js).
//   La finestra che si apre e' la stessa della richiesta singola (escursioni.js),
//   solo in "modalita' aggiungi". Qui dentro c'e' il resto: dove si tiene la
//   lista, il pulsante che galleggia in basso, la finestra che la mostra e il
//   messaggio finale.

const LISTA_KEY = "isla-lista";

// Un tetto serve: dopo una decina di escursioni il messaggio WhatsApp diventa
// illeggibile e la richiesta non e' piu' una richiesta, e' un preventivo.
const LISTA_MAX = 10;

// localStorage puo' non esserci (navigazione in incognito su certi browser, o
// cookie di terze parti bloccati dentro una webview). In quel caso la lista
// semplicemente non si ricorda niente: meglio di una pagina che si rompe.
function listaLeggi() {
  try {
    const grezzo = localStorage.getItem(LISTA_KEY);
    const voci = grezzo ? JSON.parse(grezzo) : [];
    return Array.isArray(voci) ? voci : [];
  } catch (e) {
    return [];
  }
}

function listaScrivi(voci) {
  try {
    localStorage.setItem(LISTA_KEY, JSON.stringify(voci));
  } catch (e) {
    // niente da fare: si va avanti con la lista che c'e' in pagina
  }
  // "islalista": chi disegna qualcosa che dipende dalla lista si aggiorna da
  // solo, senza che chi la modifica debba sapere chi sono.
  document.dispatchEvent(new CustomEvent("islalista"));
}

function listaEPiena() {
  return listaLeggi().length >= LISTA_MAX;
}

function listaAggiungi(voce) {
  const voci = listaLeggi();
  if (voci.length >= LISTA_MAX) return;
  voci.push(voce);
  listaScrivi(voci);
  listaToast(t("lista.added"));
}

function listaTogli(indice) {
  const voci = listaLeggi();
  voci.splice(indice, 1);
  listaScrivi(voci);
}

function listaSvuota() {
  listaScrivi([]);
}

// Un messaggio che compare in basso e sparisce da solo. Serve a dire "fatto"
// quando l'azione non porta da nessuna parte: il cliente aggiunge alla lista e
// resta sulla stessa pagina, quindi senza questo non succederebbe niente di
// visibile a parte un numero che cambia in un angolo.
let listaToastTimer = null;
function listaToast(testo) {
  let el = document.querySelector("[data-lista-toast]");
  if (!el) {
    el = document.createElement("div");
    el.className = "lista-toast";
    el.setAttribute("data-lista-toast", "");
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = testo;
  requestAnimationFrame(() => el.classList.add("is-visible"));
  clearTimeout(listaToastTimer);
  listaToastTimer = setTimeout(() => el.classList.remove("is-visible"), 2600);
}

// Il conto di una voce della lista: l'attivita' dal catalogo e il totale, che
// puo' non esserci (prezzo su richiesta, prezzo a barca, bambini senza prezzo).
function listaVoceConto(voce) {
  const tour = ESPLORA_CATALOG.find(x => x.id === voce.id);
  if (!tour) return null;
  return { tour: tour, conto: calcolaTotale(tour, voce) };
}

// La somma delle voci che un totale ce l'hanno, e quante non ce l'hanno.
// Le due cose vanno insieme: "€280" senza dire che due escursioni non sono
// contate e' un numero che il cliente legge come il prezzo di tutto.
function listaSomma(voci) {
  let somma = 0;
  let senzaPrezzo = 0;
  voci.forEach(voce => {
    const riga = listaVoceConto(voce);
    if (riga && riga.conto) somma += riga.conto.totale;
    else senzaPrezzo += 1;
  });
  return { somma: somma, senzaPrezzo: senzaPrezzo };
}

// Il messaggio con tutte le escursioni della lista. Con una sola voce si usa
// il messaggio normale: un elenco numerato di un elemento solo sarebbe strano
// da leggere, e all'ufficio arriverebbero due formati per la stessa cosa.
function listaWhatsappUrl(nome) {
  const voci = listaLeggi();
  if (!voci.length) return "";
  const primo = listaVoceConto(voci[0]);
  if (voci.length === 1) {
    return primo ? whatsappUrl(primo.tour, Object.assign({ name: nome }, voci[0])) : "";
  }

  const blocchi = [];
  voci.forEach((voce, i) => {
    const riga = listaVoceConto(voce);
    if (!riga) return;
    blocchi.push((i + 1) + ") " + tf(riga.tour.title) + "\n" +
      righeRichiesta(riga.tour, voce).join("\n"));
  });

  const { somma, senzaPrezzo } = listaSomma(voci);
  let testo = t("wa.introList", { name: nome, n: voci.length }) + "\n\n" +
    blocchi.join("\n\n");
  if (somma > 0) {
    testo += "\n\n" + (senzaPrezzo ? t("wa.totalPartial") : t("wa.total")) +
      ": €" + somma;
  }
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(testo);
}

// ─────────────────────────────────────────────────────────────────────────
// La parte che si vede: il pulsante che galleggia e la finestra della lista.
// Sono costruiti qui invece che nell'HTML perche' servono su piu' pagine, e
// tre copie dello stesso pezzo di HTML e' il modo sicuro per ritrovarsele
// diverse fra loro dopo la prossima modifica.
// ─────────────────────────────────────────────────────────────────────────

function initLista() {
  // Serve il catalogo per sapere titoli e prezzi: dove non c'e', niente lista.
  if (typeof ESPLORA_CATALOG === "undefined") return;

  const fab = document.createElement("button");
  fab.type = "button";
  fab.className = "lista-fab";
  fab.setAttribute("data-lista-open", "");
  fab.hidden = true;
  document.body.appendChild(fab);

  const scrim = document.createElement("div");
  scrim.className = "ticket-scrim";
  scrim.hidden = true;
  document.body.appendChild(scrim);

  const dialog = document.createElement("div");
  dialog.className = "ticket-dialog lista-dialog";
  dialog.id = "listaDialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "listaTitle");
  dialog.hidden = true;
  dialog.innerHTML = `
    <div class="ticket-dialog-head">
      <h2 id="listaTitle" data-i18n="lista.title">La tua lista</h2>
      <button class="iconbtn" type="button" data-lista-close
              data-i18n-aria-label="common.close" aria-label="Chiudi">✕</button>
    </div>
    <div data-lista-body></div>`;
  document.body.appendChild(dialog);
  applyI18n(dialog);

  function apri() {
    disegna();
    dialog.hidden = false;
    scrim.hidden = false;
    requestAnimationFrame(() => {
      dialog.classList.add("is-open");
      scrim.classList.add("is-visible");
    });
    document.body.classList.add("menu-open");
  }

  function chiudi() {
    dialog.classList.remove("is-open");
    scrim.classList.remove("is-visible");
    document.body.classList.remove("menu-open");
    setTimeout(() => {
      dialog.hidden = true;
      scrim.hidden = true;
    }, 300);
  }

  // Il pulsante c'e' solo quando c'e' qualcosa dentro: a lista vuota sarebbe
  // un bottone che non fa niente, piantato sopra il contenuto della pagina.
  function aggiornaFab() {
    const quante = listaLeggi().length;
    fab.hidden = quante === 0;
    fab.innerHTML =
      '<span class="lista-fab-count">' + quante + '</span>' +
      '<span>' + t("lista.title") + '</span>';
  }

  function disegna() {
    const voci = listaLeggi();
    const corpo = dialog.querySelector("[data-lista-body]");
    // Il corpo si ridisegna da capo a ogni modifica: se il cliente aveva gia'
    // scritto il nome e poi toglie una voce, senza questo se lo ritroverebbe
    // cancellato.
    const nomeScritto = corpo.querySelector("#listaName");
    const nome = nomeScritto ? nomeScritto.value : "";
    if (!voci.length) {
      corpo.innerHTML = '<p class="lista-empty" data-i18n="lista.empty"></p>';
      applyI18n(corpo);
      return;
    }

    const righe = voci.map((voce, i) => {
      const riga = listaVoceConto(voce);
      if (!riga) return "";
      const dettagli = [formatDate(voce.date)];
      if (voce.time) dettagli.push(voce.time);
      if (voce.lang) dettagli.push(voce.lang);
      dettagli.push(peopleText(voce.adults, voce.kids));
      if (voce.option) dettagli.push(voce.option);
      if (riga.tour.transfer && voce.transfer) dettagli.push(t("wa.transfer"));
      return `
        <li class="lista-voce">
          <div class="lista-voce-testo">
            <strong>${esc(tf(riga.tour.title))}</strong>
            <span>${esc(dettagli.join(" · "))}</span>
          </div>
          <span class="lista-voce-prezzo">${riga.conto ? "€" + riga.conto.totale : esc(tourPrice(riga.tour))}</span>
          <button class="iconbtn lista-voce-togli" type="button" data-lista-remove="${i}"
                  aria-label="${esc(t("lista.remove"))}">✕</button>
        </li>`;
    }).join("");

    const { somma, senzaPrezzo } = listaSomma(voci);
    const totale = somma > 0
      ? `<p class="lista-totale">
           <strong>€${somma}</strong>
           <small>${esc(senzaPrezzo ? t("wa.totalPartial") : t("wa.total"))}</small>
         </p>`
      : "";

    corpo.innerHTML = `
      <ul class="lista-voci">${righe}</ul>
      ${totale}
      <form data-lista-form>
        <label for="listaName" data-i18n="req.name">Il tuo nome</label>
        <input id="listaName" name="name" type="text" autocomplete="name"
               data-i18n-placeholder="req.namePlaceholder" required />
        <button class="btn btn-primary btn-block request-submit" type="submit"
                data-i18n="req.submit">Continua su WhatsApp</button>
        <p class="hint" data-i18n="lista.hint"></p>
        <p class="hint" data-i18n-html="req.hint"></p>
        <button class="lista-svuota" type="button" data-lista-clear
                data-i18n="lista.clear">Svuota la lista</button>
      </form>`;
    applyI18n(corpo);
    if (nome) corpo.querySelector("#listaName").value = nome;
  }

  fab.addEventListener("click", apri);
  scrim.addEventListener("click", chiudi);
  dialog.addEventListener("click", e => {
    if (e.target.closest("[data-lista-close]")) { chiudi(); return; }
    const togli = e.target.closest("[data-lista-remove]");
    if (togli) { listaTogli(parseInt(togli.dataset.listaRemove, 10)); return; }
    if (e.target.closest("[data-lista-clear]")) { listaSvuota(); chiudi(); }
  });
  dialog.addEventListener("submit", e => {
    e.preventDefault();
    const nome = dialog.querySelector("#listaName").value.trim();
    if (!nome) return;
    const url = listaWhatsappUrl(nome);
    if (!url) return;
    // La lista si svuota: la richiesta e' partita, e ritrovarsela ancora li'
    // alla prossima visita farebbe rimandare due volte le stesse escursioni.
    listaSvuota();
    chiudi();
    window.location.href = url;
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && dialog.classList.contains("is-open")) chiudi();
  });

  // La lista e' cambiata (aggiunta, tolta, svuotata) o e' cambiata la lingua:
  // il pulsante e la finestra si ridisegnano da soli.
  document.addEventListener("islalista", () => {
    aggiornaFab();
    if (dialog.classList.contains("is-open")) disegna();
  });
  document.addEventListener("islalang", () => {
    aggiornaFab();
    if (dialog.classList.contains("is-open")) disegna();
  });

  aggiornaFab();
}

document.addEventListener("DOMContentLoaded", initLista);

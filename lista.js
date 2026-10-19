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
// La casella delle offerte per email (16 ottobre 2026) e' pronta ma SPENTA:
// il proprietario l'ha messa in sospeso. Per accenderla, in quest'ordine:
//   1. lanciare supabase/modifiche/2026-10-16-promozioni.sql nel SQL Editor;
//   2. rimettere in privacy.html il testo delle offerte:
//        git diff d516570^ d516570 -- privacy.html | git apply
//   3. qui sotto true, e alzare CACHE_NAME.
// Senza il punto 1 la casella prometterebbe un elenco che non si salva.
const PROMOZIONI_ATTIVE = false;

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

// Quante escursioni vale una voce: una, o quelle dentro il pacchetto. Il
// tetto conta le escursioni e non le voci, perche' nel database ognuna e' una
// riga, e una richiesta ne prende al massimo dieci (manda_richiesta).
function listaPeso(voce) {
  if (!voce.pack) return 1;
  const pack = typeof pacchettoDi === "function" ? pacchettoDi(voce.pack) : null;
  return pack ? pack.voci.length : 1;
}

function listaEscursioni(voci) {
  return voci.reduce((tot, voce) => tot + listaPeso(voce), 0);
}

// `peso`: quante escursioni si vogliono aggiungere (un pacchetto ne porta tre).
function listaEPiena(peso) {
  return listaEscursioni(listaLeggi()) + (peso || 1) > LISTA_MAX;
}

function listaAggiungi(voce) {
  const voci = listaLeggi();
  if (listaEscursioni(voci) + listaPeso(voce) > LISTA_MAX) return;
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

// Una voce rimasta nella lista per giorni puo' avere un giorno che non si puo'
// piu' chiedere: oggi, o gia' passato. Le 24 ore di preavviso valgono anche
// qui, e una data di piu' di un giorno fa il database la rifiuta del tutto
// (manda_richiesta): l'ufficio riceverebbe su WhatsApp un codice che
// nell'elenco non trova. Per un pacchetto conta il giorno d'inizio.
function listaVoceScaduta(voce) {
  // Anche le 24 ore vere: una voce entrata stamattina per domani alle 8:20,
  // stasera non si puo' piu' mandare (partenzaPossibile in escursioni.js).
  return !voce.date || voce.date < minRequestDate() ||
    (typeof partenzaPossibile === "function" && !partenzaPossibile(voce.date, voce.time));
}

// Il conto di una voce della lista: l'attivita' dal catalogo e il totale, che
// puo' non esserci (prezzo su richiesta, prezzo a barca, bambini senza prezzo).
// Un pacchetto torna come { pack, conto }: il suo conto e' quello del
// pacchetto, con lo sconto e i mezzi (pacchettoTotale in pacchetti.js).
function listaVoceConto(voce) {
  if (voce.pack) {
    const pack = typeof pacchettoDi === "function" ? pacchettoDi(voce.pack) : null;
    if (!pack) return null;
    return { pack: pack, conto: pacchettoTotale(pack, voce.adults, voce.kids, voce.mezzi) };
  }
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

// IL CODICE SCONTO DEI VENDITORI (proprietario, 18 ottobre 2026)
//
// Ogni venditore ha il suo codice. Il cliente lo scrive nella finestra della
// lista e il totale scende (5%). Lo sconto si fa sulle escursioni singole, con
// la stessa regola dello sconto dei pacchetti (scontoPossibile in
// pacchetti.js): niente sconto su parchi, spettacoli e schede `fixedPrice`.
// Sui pacchetti nemmeno: hanno gia' il loro sconto.
//
// I codici NON stanno qui: il repository e' pubblico e chiunque li leggerebbe.
// Stanno su Supabase (supabase/modifiche/2026-10-18-codici-sconto.sql), e il
// sito chiede solo "questo codice vale?". La risposta e' la percentuale, o
// niente. Il codice va nel messaggio WhatsApp (e quindi anche nella copia
// salvata nel database), cosi' l'ufficio sa da quale venditore arriva il
// cliente e con che totale fare il link di pagamento.

// Il codice controllato nella finestra aperta: { codice, percento }, o null.
let listaCodice = null;

// IL CODICE NELL'INDIRIZZO (19 ottobre 2026)
// Il QR del venditore porta a un indirizzo con ?codice=MARCO. Il codice si
// ricorda nel telefono (solo il codice, mai lo sconto: quello si richiede a
// Supabase ogni volta) e la finestra della lista lo mette nel campo e lo
// controlla da sola. Il cliente puo' guardare il sito per giorni prima di
// mandare la richiesta, e il venditore deve restare quello del QR.
// Resta anche dopo una richiesta mandata: la seconda arriva dallo stesso
// venditore. Si toglie quando il cliente cancella il codice dal campo, o se
// il codice non esiste (piu').
const CODICE_KEY = "isla-codice";

function codiceRicordato() {
  try { return localStorage.getItem(CODICE_KEY) || ""; } catch (e) { return ""; }
}

function codiceRicorda(codice) {
  try {
    if (codice) localStorage.setItem(CODICE_KEY, codice);
    else localStorage.removeItem(CODICE_KEY);
  } catch (e) { /* incognito: il codice resta solo finche' la pagina e' aperta */ }
}

// ?codice=MARCO nell'indirizzo: si ricorda e si toglie dall'indirizzo, cosi'
// chi lo condivide non si porta dietro il codice di un venditore.
function codiceDallIndirizzo() {
  try {
    const url = new URL(window.location.href);
    const codice = codiceNormale(url.searchParams.get("codice"));
    if (!url.searchParams.has("codice")) return;
    if (codice) codiceRicorda(codice);
    url.searchParams.delete("codice");
    history.replaceState(history.state, "", url.pathname + url.search + url.hash);
  } catch (e) { /* browser vecchio: il codice si scrive a mano */ }
}

// Quello che il cliente scrive: maiuscole, senza spazi. "marco 5" e "MARCO5"
// sono lo stesso codice (la funzione sul database fa lo stesso).
function codiceNormale(testo) {
  return String(testo || "").replace(/\s+/g, "").toUpperCase();
}

// Chiede a Supabase se il codice vale. Torna la percentuale, o null se il
// codice non c'e' o e' spento; la promessa fallisce se non si riesce a chiedere.
function codiceScontoControlla(codice) {
  if (typeof SUPABASE_URL === "undefined" || !SUPABASE_URL) return Promise.reject(new Error("no supabase"));
  return fetch(SUPABASE_URL + "/rest/v1/rpc/codice_sconto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY
    },
    body: JSON.stringify({ p_codice: codice })
  }).then(risposta => {
    if (!risposta.ok) throw new Error("codice_sconto " + risposta.status);
    return risposta.json();
  }).then(n => (typeof n === "number" && n > 0 && n < 100) ? n : null);
}

// Quanto si toglie col codice: la percentuale di ogni escursione singola che
// lo sconto lo permette, arrotondata al centesimo voce per voce. Le voci senza
// prezzo restano fuori, come dal totale.
function listaSconto(voci) {
  if (!listaCodice) return 0;
  let sconto = 0;
  voci.forEach(voce => {
    const riga = listaVoceConto(voce);
    if (!riga || riga.pack || !riga.conto) return;
    if (!scontoPossibile(riga.tour, varianteScelta(riga.tour, voce))) return;
    sconto += Math.round(riga.conto.totale * listaCodice.percento) / 100;
  });
  return Math.round(sconto * 100) / 100;
}

// Le righe del codice in fondo al messaggio. Il codice si scrive anche quando
// sulle escursioni della lista non toglie niente (un parco): l'ufficio deve
// sapere lo stesso da quale venditore arriva il cliente.
function listaScontoTesto(voci) {
  if (!listaCodice) return "";
  let testo = "\n\n" + t("wa.discountCode", { code: listaCodice.codice });
  const sconto = listaSconto(voci);
  if (sconto > 0) {
    const { somma, senzaPrezzo } = listaSomma(voci);
    testo += "\n" + t("wa.discount", { n: listaCodice.percento }) + ": −€" + eur(sconto) +
      "\n" + (senzaPrezzo ? t("wa.totalPartial") : t("wa.total")) + " " +
      t("wa.afterDiscount") + ": €" + eur(somma - sconto);
  }
  return testo;
}

// Il messaggio con tutte le escursioni della lista. Con una sola voce si usa
// il messaggio normale: un elenco numerato di un elemento solo sarebbe strano
// da leggere, e all'ufficio arriverebbero due formati per la stessa cosa.
// `codice`: quello della richiesta salvata nel database (richieste.js), in
// fondo al messaggio. Vuoto = niente riga.
// `email`: molte compagnie (i parchi per primi) mandano il biglietto per
// email, e senza l'ufficio deve riscrivere al cliente per chiederla. Si chiede
// a tutti, obbligatoria (proprietario, 12 ottobre 2026). Non ha una colonna
// sua nel database: ci arriva dentro il messaggio (request_message).
// Il testo sta a parte dall'indirizzo perche' va anche nel database
// (richieste.js, 13 ottobre 2026), e l'ufficio lo rilegge in venditori.html.
function listaWhatsappTesto(nome, codice, email) {
  // in italiano se il cliente legge in francese o tedesco: vedi perUfficio in i18n.js
  return perUfficio(() => listaWhatsappScrivi(nome, codice, email));
}

function listaWhatsappScrivi(nome, codice, email) {
  const voci = listaLeggi();
  if (!voci.length) return "";
  // Il codice sconto, l'email e il codice della richiesta vanno in fondo, in
  // quest'ordine, sia con una voce sola sia con tante: per questo i messaggi
  // della voce sola si scrivono qui senza.
  const coda = listaScontoTesto(voci) +
    (email ? "\n\n" + t("wa.email", { email: email }) : "") +
    (codice ? "\n\n" + t("wa.code", { code: codice }) : "");
  const primo = listaVoceConto(voci[0]);
  if (voci.length === 1) {
    if (!primo) return "";
    return (primo.pack
      ? pacchettoWhatsappTesto(primo.pack, Object.assign({ name: nome }, voci[0]), "")
      : whatsappTesto(primo.tour, Object.assign({ name: nome }, voci[0]))) + coda;
  }

  const blocchi = [];
  voci.forEach((voce, i) => {
    const riga = listaVoceConto(voce);
    if (!riga) return;
    blocchi.push(riga.pack
      ? (i + 1) + ") " + tf(riga.pack.title) + "\n" +
        pacchettoRigheRichiesta(riga.pack, voce).join("\n")
      : (i + 1) + ") " + tf(riga.tour.title) + "\n" +
        righeRichiesta(riga.tour, voce).join("\n"));
  });

  const { somma, senzaPrezzo } = listaSomma(voci);
  // le escursioni vere, contando quelle dentro i pacchetti
  let testo = t("wa.introList", { name: nome, n: listaEscursioni(voci) }) + "\n\n" +
    blocchi.join("\n\n");
  if (somma > 0) {
    testo += "\n\n" + (senzaPrezzo ? t("wa.totalPartial") : t("wa.total")) +
      ": €" + eur(somma);
  }
  return testo + coda;
}

function listaWhatsappUrl(nome, codice, email) {
  const testo = listaWhatsappTesto(nome, codice, email);
  return testo ? "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(testo) : "";
}

// ─────────────────────────────────────────────────────────────────────────
// La parte che si vede: il carrello nella capsula in alto e la finestra della
// lista. Il pulsante che galleggia in basso a sinistra c'e' solo sulle pagine
// senza la capsula.
// Sono costruiti qui invece che nell'HTML perche' servono su piu' pagine, e
// tre copie dello stesso pezzo di HTML e' il modo sicuro per ritrovarsele
// diverse fra loro dopo la prossima modifica.
// ─────────────────────────────────────────────────────────────────────────

function initLista() {
  // Il codice del QR si legge su ogni pagina, prima di tutto il resto.
  codiceDallIndirizzo();
  // Serve il catalogo per sapere titoli e prezzi: dove non c'e', niente lista.
  if (typeof ESPLORA_CATALOG === "undefined") return;

  // Il carrello della capsula (nell'HTML) apre la lista; il suo numerino dice
  // quante escursioni ci sono. Dove la capsula non c'e', torna il pulsante
  // che galleggia in basso, creato qui.
  const carrelli = [...document.querySelectorAll("[data-lista-open]")];
  const numerini = [...document.querySelectorAll("[data-lista-count]")];
  let fab = null;
  if (!carrelli.length) {
    fab = document.createElement("button");
    fab.type = "button";
    fab.className = "lista-fab";
    fab.setAttribute("data-lista-open", "");
    fab.hidden = true;
    document.body.appendChild(fab);
    carrelli.push(fab);
  }

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
      <div class="lista-intestazione">
        <h2 id="listaTitle" data-i18n="lista.title">La tua lista</h2>
        <!-- La scritta stampata sul retro di una cartolina. Due nomi di posto:
             uguali in italiano, inglese e spagnolo, quindi niente da tradurre. -->
        <p class="lista-luogo" aria-hidden="true">Isla · Tenerife</p>
      </div>
      <!-- Francobollo e timbro sono decorazione: niente testo da leggere,
           niente da tradurre, e lo screen reader tira dritto. -->
      <span class="lista-francobollo" aria-hidden="true">
        <img src="./assets/logo-isla.png" alt="" width="44" height="44" loading="lazy" />
        <span class="lista-timbro"></span>
      </span>
      <button class="iconbtn" type="button" data-lista-close
              data-i18n-aria-label="common.close" aria-label="Chiudi">✕</button>
    </div>
    <div data-lista-body></div>`;
  document.body.appendChild(dialog);
  applyI18n(dialog);

  // Il carrello si tocca anche a lista vuota, e "non c'e' piu' niente" detto
  // a chi non ci ha mai messo niente non ha senso: la frase giusta dipende da
  // com'era la lista quando la finestra si e' aperta.
  let vuotaDaSubito = false;
  // Cosa dire sotto il campo del codice sconto: "" (niente), "checking",
  // "ok", "none" (vale, ma non su queste escursioni), "bad", "error".
  let codiceEsito = "";

  function apri() {
    vuotaDaSubito = listaLeggi().length === 0;
    disegna();
    // Il codice del QR (codiceDallIndirizzo) si mette nel campo e si controlla
    // da solo, la prima volta che la finestra si apre con qualcosa dentro.
    const ricordato = codiceRicordato();
    const campo = dialog.querySelector("#listaCodice");
    if (ricordato && campo && !listaCodice && !codiceEsito) {
      campo.value = ricordato;
      applicaCodice();
    }
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

  // Il numerino c'e' solo quando c'e' qualcosa dentro, come il pulsante che
  // galleggia: a lista vuota sarebbe un bottone che non fa niente, piantato
  // sopra il contenuto della pagina. Il carrello invece resta sempre.
  function aggiornaFab() {
    const quante = listaLeggi().length;
    numerini.forEach(n => {
      n.hidden = quante === 0;
      n.textContent = quante;
    });
    if (!fab) return;
    fab.hidden = quante === 0;
    fab.innerHTML =
      '<span class="lista-fab-count">' + quante + '</span>' +
      '<span>' + t("lista.title") + '</span>';
  }

  // Il pacchetto nella lista: una voce sola, che si toglie intera e non si
  // modifica. Sotto il titolo le scelte (dal giorno, persone, mezzi) e cosa
  // c'e' dentro; a destra il totale col suo sconto.
  function vocePacchetto(riga, voce, i) {
    const pack = riga.pack;
    const dettagli = [
      t("wa.fromDay") + " " + formatDate(voce.date),
      peopleText(voce.adults, voce.kids, 0)
    ];
    pacchettoMezziDaContare(pack).forEach(gruppo => {
      const conto = pacchettoContoMezzi(gruppo, (voce.mezzi || {})[gruppo.indice]);
      if (conto) dettagli.push(conto.nome + ": " + conto.righe);
    });
    const risparmio = riga.conto && riga.conto.risparmio > 0
      ? `<span>${esc(t("pack.save", { n: eur(riga.conto.risparmio) }))}</span>` : "";
    return `
        <li class="lista-voce">
          <div class="lista-voce-testo">
            <strong>${esc(tf(pack.title))}</strong>
            <span>${esc(dettagli.join(" · "))}</span>
            <span>${esc(t("pack.inside") + ": " + pacchettoVociTesto(pack))}</span>
            ${risparmio}
            ${listaVoceScaduta(voce) ? `<span class="lista-voce-scaduta">${esc(t("lista.pastDate"))}</span>` : ""}
          </div>
          <span class="lista-voce-prezzo">${riga.conto ? "€" + eur(riga.conto.totale) : "—"}</span>
          <button class="iconbtn lista-voce-togli" type="button" data-lista-remove="${i}"
                  aria-label="${esc(t("lista.remove"))}">✕</button>
        </li>`;
  }

  function disegna() {
    const voci = listaLeggi();
    const corpo = dialog.querySelector("[data-lista-body]");
    // Il corpo si ridisegna da capo a ogni modifica: se il cliente aveva gia'
    // scritto il nome e poi toglie una voce, senza questo se lo ritroverebbe
    // cancellato.
    const nomeScritto = corpo.querySelector("#listaName");
    const nome = nomeScritto ? nomeScritto.value : "";
    const emailScritta = corpo.querySelector("#listaEmail");
    const email = emailScritta ? emailScritta.value : "";
    const avvisiScelti = corpo.querySelector("#listaAvvisi");
    const avvisi = avvisiScelti ? avvisiScelti.checked : true;
    const promoScelta = corpo.querySelector("#listaPromo");
    const promo = promoScelta ? promoScelta.checked : false;
    const codiceScritto = corpo.querySelector("#listaCodice");
    const codiceTesto = codiceScritto ? codiceScritto.value : (listaCodice ? listaCodice.codice : "");
    if (!voci.length) {
      const frase = vuotaDaSubito ? "lista.none" : "lista.empty";
      corpo.innerHTML = '<p class="lista-empty" data-i18n="' + frase + '"></p>';
      applyI18n(corpo);
      return;
    }

    const righe = voci.map((voce, i) => {
      const riga = listaVoceConto(voce);
      if (!riga) return "";
      if (riga.pack) return vocePacchetto(riga, voce, i);
      const dettagli = [formatDate(voce.date)];
      if (voce.time) dettagli.push(voce.time);
      if (voce.lang) dettagli.push(voce.lang);
      // Dove si contano i mezzi le persone non si chiedono, quindi non si
      // scrivono nemmeno qui: sarebbe un "2 adulti" che nessuno ha detto.
      if (!riga.tour.units) {
        dettagli.push(peopleText(voce.adults, voce.kids, voce.babies));
      }
      // l'etichetta della variante si rilegge dal catalogo quando si riesce a
      // ritrovarla: quella salvata e' nella lingua di allora
      const variante = varianteScelta(riga.tour, voce);
      if (variante) dettagli.push(tf(variante.label));
      else if (voce.option) dettagli.push(voce.option);
      const mezzi = unitaTesto(riga.tour, voce);
      if (mezzi) dettagli.push(tf(riga.tour.units.name) + ": " + mezzi);
      const menu = menuTesto(voce, riga.tour);
      if (menu) dettagli.push(menu);
      if (transferDi(riga.tour, variante) && voce.transfer) {
        dettagli.push(riga.tour.transferLabel ? tf(riga.tour.transferLabel) : t("wa.transfer"));
      }
      if (riga.tour.transferSiam && voce.transferSiam) {
        dettagli.push(riga.tour.transferSiamLabel ? tf(riga.tour.transferSiamLabel) : t("wa.transferSiam"));
      }
      return `
        <li class="lista-voce">
          <div class="lista-voce-testo">
            <strong>${esc(tf(riga.tour.title))}</strong>
            <span>${esc(dettagli.join(" · "))}</span>
            ${listaVoceScaduta(voce) ? `<span class="lista-voce-scaduta">${esc(t("lista.pastDate"))}</span>` : ""}
          </div>
          <span class="lista-voce-prezzo">${riga.conto ? "€" + eur(riga.conto.totale) : esc(tourPrice(riga.tour))}</span>
          <button class="iconbtn lista-voce-togli" type="button" data-lista-remove="${i}"
                  aria-label="${esc(t("lista.remove"))}">✕</button>
        </li>`;
    }).join("");

    const { somma, senzaPrezzo } = listaSomma(voci);
    // Con una data scaduta la richiesta non parte: il cliente toglie la voce
    // e la rimette con un altro giorno.
    const scadute = voci.some(listaVoceScaduta);
    // Col codice sconto il totale e' quello gia' scontato, e sopra c'e' la
    // riga di quanto si e' tolto: il cliente vede da dove arriva il numero.
    const sconto = listaSconto(voci);
    const totale = somma > 0
      ? '<div class="lista-conto">' + (sconto > 0
          ? `<p class="lista-sconto">
               <span>${esc(t("wa.discount", { n: listaCodice.percento }) + " · " + listaCodice.codice)}</span>
               <span>−€${eur(sconto)}</span>
             </p>`
          : "") +
        `<p class="lista-totale">
           <strong>€${eur(somma - sconto)}</strong>
           <small>${esc((senzaPrezzo ? t("wa.totalPartial") : t("wa.total")) +
             (sconto > 0 ? " " + t("wa.afterDiscount") : ""))}</small>
         </p></div>`
      : "";
    const esitoCodice = codiceEsito === "ok" && sconto === 0 ? "none" : codiceEsito;

    corpo.innerHTML = `
      <ul class="lista-voci">${righe}</ul>
      ${totale}
      <form data-lista-form>
        <label for="listaName" data-i18n="req.name">Il tuo nome</label>
        <input id="listaName" name="name" type="text" autocomplete="name"
               data-i18n-placeholder="req.namePlaceholder" required />
        <label for="listaEmail" data-i18n="req.email">La tua email</label>
        <input id="listaEmail" name="email" type="email" inputmode="email" autocomplete="email"
               autocapitalize="off" spellcheck="false"
               data-i18n-placeholder="req.emailPlaceholder" required />
        <p class="hint" data-i18n="req.emailHint"></p>
        <label for="listaCodice" data-i18n="lista.code">Codice sconto</label>
        <div class="lista-codice">
          <input id="listaCodice" name="codice" type="text" autocomplete="off"
                 autocapitalize="characters" spellcheck="false" maxlength="30"
                 data-i18n-placeholder="lista.codePlaceholder" />
          <button class="btn btn-soft" type="button" data-lista-codice
                  data-i18n="lista.codeApply"${codiceEsito === "checking" ? " disabled" : ""}>Applica</button>
        </div>
        <p class="hint lista-codice-esito${esitoCodice === "ok" ? " is-ok" : ""}" role="status"
           ${esitoCodice ? 'data-i18n="lista.code' + esitoCodice.charAt(0).toUpperCase() + esitoCodice.slice(1) + '"' : "hidden"}></p>
        <label class="request-check" data-lista-promo${PROMOZIONI_ATTIVE ? "" : " hidden"}>
          <input id="listaPromo" name="promo" type="checkbox" />
          <span>
            <span data-i18n="lista.promo">Voglio ricevere le offerte di Admiral per email</span>
            <small data-i18n="lista.promoNota"></small>
          </span>
        </label>
        <label class="request-check" data-lista-avvisi hidden>
          <input id="listaAvvisi" name="avvisi" type="checkbox" />
          <span>
            <span data-i18n="lista.avvisi">Avvisami sul telefono</span>
            <small data-i18n="lista.avvisiNota"></small>
          </span>
        </label>
        <p class="hint" data-lista-avvisi-ios hidden data-i18n="lista.avvisiIos"></p>
        ${scadute ? '<p class="request-day-error" data-i18n="lista.pastBlock"></p>' : ""}
        <button class="btn btn-primary btn-block request-submit" type="submit"
                data-i18n="req.submit"${scadute ? " disabled" : ""}>Continua su WhatsApp</button>
        <p class="hint" data-i18n="lista.hint"></p>
        <p class="hint" data-i18n-html="req.hint"></p>
        <p class="hint request-privacy" data-i18n-html="req.privacyNoHotel"></p>
        <button class="lista-svuota" type="button" data-lista-clear
                data-i18n="lista.clear">Svuota la lista</button>
      </form>`;
    applyI18n(corpo);
    if (nome) corpo.querySelector("#listaName").value = nome;
    if (email) corpo.querySelector("#listaEmail").value = email;
    corpo.querySelector("#listaCodice").value = codiceTesto;
    corpo.querySelector("#listaPromo").checked = promo;
    // Gli avvisi sul telefono (richieste.js): la casella c'e' solo dove il
    // telefono li sa ricevere e il cliente non li ha gia' rifiutati (il
    // browser non rifa' la domanda). Sull'iPhone senza l'app installata si
    // dice come averli.
    if (typeof avvisiPossibili === "function") {
      const puo = avvisiPossibili() && Notification.permission !== "denied";
      corpo.querySelector("[data-lista-avvisi]").hidden = !puo;
      corpo.querySelector("#listaAvvisi").checked = avvisi;
      corpo.querySelector("[data-lista-avvisi-ios]").hidden = puo || !avvisiSoloConApp();
    }
  }

  carrelli.forEach(c => c.addEventListener("click", apri));
  scrim.addEventListener("click", chiudi);
  dialog.addEventListener("click", e => {
    if (e.target.closest("[data-lista-close]")) { chiudi(); return; }
    const togli = e.target.closest("[data-lista-remove]");
    if (togli) { listaTogli(parseInt(togli.dataset.listaRemove, 10)); return; }
    if (e.target.closest("[data-lista-clear]")) { listaSvuota(); chiudi(); return; }
    if (e.target.closest("[data-lista-codice]")) applicaCodice();
  });

  // Il codice si controlla su Supabase. Un codice cancellato dal campo toglie
  // lo sconto; uno sbagliato toglie anche quello di prima, cosi' quello che si
  // vede scritto e lo sconto applicato sono sempre la stessa cosa.
  // Torna una promessa, che il bottone "Continua" aspetta.
  function applicaCodice() {
    const campo = dialog.querySelector("#listaCodice");
    const codice = codiceNormale(campo ? campo.value : "");
    if (!codice) {
      listaCodice = null;
      codiceEsito = "";
      codiceRicorda("");
      disegna();
      return Promise.resolve();
    }
    listaCodice = null;
    codiceEsito = "checking";
    disegna();
    return codiceScontoControlla(codice).then(percento => {
      listaCodice = percento ? { codice: codice, percento: percento } : null;
      codiceEsito = percento ? "ok" : "bad";
      // il codice buono si ricorda, quello che non esiste si dimentica; se
      // la rete manca non si cambia niente
      codiceRicorda(percento ? codice : "");
    }, () => {
      codiceEsito = "error";
    }).then(() => {
      disegna();
      const c = dialog.querySelector("#listaCodice");
      if (c) c.value = codice;
    });
  }

  // Invio nel campo del codice applica il codice, non manda la richiesta.
  dialog.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target.id === "listaCodice") {
      e.preventDefault();
      applicaCodice();
    }
  });
  // il messaggio d'errore dell'email resta finche' non lo si toglie: appena il
  // cliente corregge, la casella torna buona
  dialog.addEventListener("input", e => {
    if (e.target.id === "listaEmail") e.target.setCustomValidity("");
  });
  dialog.addEventListener("submit", e => {
    e.preventDefault();
    const nome = dialog.querySelector("#listaName").value.trim();
    if (!nome) return;
    // la finestra puo' essere rimasta aperta oltre la mezzanotte
    if (listaLeggi().some(listaVoceScaduta)) { disegna(); return; }
    // Il browser con type="email" accetta anche "mario@gmail" senza ".com":
    // e' l'errore che si fa di piu' col pollice, e un biglietto mandato li'
    // non arriva a nessuno. Il punto dopo la chiocciola lo chiediamo noi.
    const emailEl = dialog.querySelector("#listaEmail");
    const email = emailEl.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
      emailEl.setCustomValidity(t("req.emailInvalid"));
      emailEl.reportValidity();
      return;
    }
    if (!listaWhatsappUrl(nome)) return;
    // Un codice scritto ma non ancora controllato (o cambiato dopo): prima si
    // controlla e si mostra il totale giusto, poi il cliente preme di nuovo.
    // Mandare la richiesta col codice non controllato vorrebbe dire un totale
    // nel messaggio diverso da quello che ha visto.
    const codiceCampo = codiceNormale(dialog.querySelector("#listaCodice").value);
    if (codiceCampo !== (listaCodice ? listaCodice.codice : "")) {
      applicaCodice();
      return;
    }
    // anche un campo svuotato e mai riapplicato: il cliente il codice non lo vuole
    if (!codiceCampo) codiceRicorda("");
    // Le promozioni: solo se il cliente ha spuntato la casella. L'email va
    // nell'elenco "promozioni" e da nessun'altra parte del database.
    if (PROMOZIONI_ATTIVE && dialog.querySelector("#listaPromo").checked) promozioniIscrivi(email);
    // Gli avvisi si chiedono qui, PRIMA di andare su WhatsApp: dopo, la
    // pagina non c'e' piu' e non potrebbe chiedere niente. Il browser mostra
    // la sua domanda solo la prima volta; il pulsante si spegne intanto, se no
    // un secondo tocco manderebbe la richiesta due volte.
    const casella = dialog.querySelector("#listaAvvisi");
    const vuole = casella && !casella.closest("[data-lista-avvisi]").hidden && casella.checked;
    const bottone = dialog.querySelector(".request-submit");
    bottone.disabled = true;
    (vuole ? avvisiIscrizione(true) : Promise.resolve(null)).then(iscrizione => {
      // La richiesta si salva anche nel database (richieste.js), col codice che
      // va nel messaggio: cosi' l'ufficio la ritrova e il cliente ne vede lo
      // stato in "Le mie richieste". Il messaggio si rifa' col codice dentro.
      // Col nome e col messaggio intero: l'ufficio, confermando, li trova gia'
      // li' invece di ricopiarli dalla chat.
      // Il messaggio salvato e' quello SENZA l'email (proprietario, 15 ottobre
      // 2026): l'email va solo su WhatsApp, mai nel database. Per salvarla
      // anche li' basta passare `email` qui al posto di "", e aggiornare la
      // privacy (privacy.html, cinque lingue) e CLAUDE.md.
      const codice = typeof richiestaNuova === "function"
        ? richiestaNuova(listaLeggi(), iscrizione, nome, c => listaWhatsappTesto(nome, c, ""),
            listaCodice ? listaCodice.codice : "") : "";
      const url = listaWhatsappUrl(nome, codice, email);
      // La lista si svuota: la richiesta e' partita, e ritrovarsela ancora li'
      // alla prossima visita farebbe rimandare due volte le stesse escursioni.
      listaCodice = null;
      codiceEsito = "";
      listaSvuota();
      chiudi();
      window.location.href = url;
    });
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

// L'email di chi ha detto si' alle offerte (supabase/modifiche/
// 2026-10-16-promozioni.sql). keepalive: la pagina sta per andare su WhatsApp,
// e senza la richiesta verrebbe interrotta. Se non arriva, pazienza: la
// richiesta su WhatsApp parte lo stesso.
function promozioniIscrivi(email) {
  if (typeof SUPABASE_URL === "undefined" || !SUPABASE_URL) return;
  try {
    fetch(SUPABASE_URL + "/rest/v1/rpc/iscrivi_promozioni", {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: "Bearer " + SUPABASE_KEY
      },
      body: JSON.stringify({ p_email: email, p_lang: getLang(), p_testo: t("lista.promo") })
    }).catch(() => {});
  } catch (e) { /* niente rete: la richiesta parte lo stesso */ }
}

document.addEventListener("DOMContentLoaded", initLista);

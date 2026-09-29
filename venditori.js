// La pagina dei venditori: entrare, inserire un ticket di carta a mano con la
// sua foto, vedere gli ultimi inseriti, cercarne uno e cambiarne data, ora,
// persone e soldi (un'escursione rinviata).
//
// Solo in italiano: la usano Jack e Francesca, non i clienti.
//
// Il database e le sue regole stanno in supabase/schema.sql. Qui non c'e'
// nessun controllo di sicurezza vero: anche se qualcuno cambiasse questo file,
// chi non sta nella tabella `sellers` non legge e non scrive niente. I
// controlli di questa pagina servono a non sbagliare, non a proteggere.

// ─── I paesi e il telefono ───────────────────────────────────────────────────
// PAESI e telefonoE164() stanno in telefono.js: li usa anche la finestra del
// ticket del cliente, e il numero deve uscire uguale da tutte e due le parti.

// "altro" = escursione che nel catalogo non c'e': si salva lo stesso, e cosa
// sia lo si scrive nelle note (il salvataggio lo chiede).
const ESCURSIONE_ALTRO = "altro";

const $ = sel => document.querySelector(sel);

const els = {
  loading: $("[data-vend-loading]"),
  login: $("[data-vend-login]"),
  loginForm: $("[data-login-form]"),
  loginMsg: $("[data-login-msg]"),
  work: $("[data-vend-work]"),
  sellerName: $("[data-seller-name]"),
  logout: $("[data-logout]"),
  form: $("[data-ticket-form]"),
  photo: $("#tPhoto"),
  preview: $("[data-photo-preview]"),
  exc: $("#tExc"),
  optionWrap: $("[data-option-wrap]"),
  optionLabel: $("[data-option-label]"),
  option: $("#tOption"),
  seller: $("#tSeller"),
  nation: $("#tNation"),
  prefix: $("#tPrefix"),
  phone: $("#tPhone"),
  phoneOut: $("[data-phone-out]"),
  phoneOk: $("[data-phone-ok]"),
  total: $("#tTotal"),
  deposit: $("#tDeposit"),
  rest: $("#tRest"),
  moneyWarn: $("[data-money-warn]"),
  moneyInfo: $("[data-money-info]"),
  msg: $("[data-ticket-msg]"),
  save: $("[data-ticket-save]"),
  recent: $("[data-recent]"),
  recentTitle: $("[data-recent-title]"),
  searchForm: $("[data-search-form]"),
  searchReset: $("[data-search-reset]"),
  recentMsg: $("[data-recent-msg]")
};

let venditore = null;      // { name } dalla tabella sellers
let fotoScelta = null;     // il File scelto, prima di rimpicciolirlo
let ricerca = "";          // il numero cercato; vuoto = gli ultimi 20

// ─── Messaggi ───────────────────────────────────────────────────────────────

function mostra(el, testo, tipo) {
  el.textContent = testo;
  el.hidden = !testo;
  el.classList.toggle("is-error", tipo === "errore");
  el.classList.toggle("is-ok", tipo === "ok");
}

// ─── Il catalogo nei menu ───────────────────────────────────────────────────

function titoloDi(tour) {
  return typeof tour.title === "string" ? tour.title : tour.title.it;
}

function schedaDa(id) {
  return ESPLORA_CATALOG.find(t => t.id === id) || null;
}

// "— scegli —", da non poter scegliere. E' anche la scelta di partenza
// (defaultSelected): senza, dopo un salvataggio il modulo ripulito tornerebbe
// sulla prima escursione dell'elenco, e salvarla per sbaglio sarebbe facile.
function segnaposto() {
  const o = new Option("— scegli —", "", true, true);
  o.disabled = true;
  return o;
}

function riempiEscursioni() {
  els.exc.append(segnaposto());

  // Divise per categoria, in ordine alfabetico dentro ognuna: sono 65, e in
  // un elenco unico si cerca male.
  CATEGORIES.forEach(cat => {
    const schede = ESPLORA_CATALOG
      .filter(t => t.published && t.category === cat.id)
      .sort((a, b) => titoloDi(a).localeCompare(titoloDi(b)));
    if (!schede.length) return;
    const gruppo = document.createElement("optgroup");
    gruppo.label = cat.name.it;
    schede.forEach(t => gruppo.append(new Option(titoloDi(t), t.id)));
    els.exc.append(gruppo);
  });
  els.exc.append(new Option("Non è in catalogo (scrivilo nelle note)", ESCURSIONE_ALTRO));
}

// Scelta l'escursione: le sue varianti, se ne ha.
function aggiornaEscursione() {
  const tour = schedaDa(els.exc.value);
  const scelte = tour && tour.options && tour.options.choices;

  els.option.replaceChildren();
  els.optionWrap.hidden = !scelte;
  els.option.required = !!scelte;
  if (scelte) {
    els.optionLabel.textContent = (tour.options.label && tour.options.label.it) || "Variante";
    els.option.append(segnaposto());
    // Il valore salvato e' l'etichetta italiana: le varianti non hanno un id.
    scelte.forEach(c => els.option.append(new Option(c.label.it, c.label.it)));
  }
}

// ─── Paesi e telefono ───────────────────────────────────────────────────────

function riempiPaesi() {
  els.nation.append(new Option("— non scritta —", ""));
  PAESI.forEach(p => els.nation.append(new Option(p.name, p.code)));
  els.nation.append(new Option("Altro", "XX"));

  PAESI.forEach(p => els.prefix.append(new Option(`${p.code} +${p.prefix}`, p.prefix)));
  els.prefix.append(new Option("Altro: scrivi +…", ""));
  els.prefix.value = "34";
}

// Il numero scritto nel modulo, come va salvato (o null).
function telefonoDelModulo() {
  return telefonoE164(els.prefix.value, els.phone.value);
}

function aggiornaTelefono() {
  const numero = telefonoDelModulo();
  els.phoneOut.textContent = numero
    ? `Si salva come ${numero}`
    : (els.phone.value.trim() ? "Numero non valido: controlla prefisso e cifre" : "");
  els.phoneOut.classList.toggle("is-error", !numero && !!els.phone.value.trim());
  // Ogni volta che il numero cambia, la conferma va ridata.
  els.phoneOk.checked = false;
}

// ─── Soldi ──────────────────────────────────────────────────────────────────

function numero(input) {
  if (input.value === "") return null;
  const n = Number(input.value);
  return Number.isFinite(n) ? n : null;
}

let restoScrittoAMano = false;

function aggiornaSoldi(event) {
  if (event && event.target === els.rest) restoScrittoAMano = els.rest.value !== "";

  const totale = numero(els.total);
  const acconto = numero(els.deposit);

  // Il resto si calcola da solo finche' il venditore non lo scrive lui.
  if (!restoScrittoAMano) {
    els.rest.value = totale !== null && acconto !== null && totale >= acconto
      ? (Math.round((totale - acconto) * 100) / 100).toString()
      : "";
  }

  const resto = numero(els.rest);
  const tornano = totale === null || acconto === null || resto === null
    || Math.round(totale * 100) === Math.round(acconto * 100) + Math.round(resto * 100);
  mostra(els.moneyWarn, tornano ? "" : "Attenzione: total ≠ deposit + to pay. Controlla il ticket.");

  els.moneyInfo.textContent = pagatoTutto()
    ? `Pagato tutto: ${totale} €, niente da pagare dopo.`
    : "Deposit e To pay sbarrati sul ticket: lasciali vuoti, vuol dire pagato tutto.";
  els.moneyInfo.classList.toggle("is-ok", pagatoTutto());
}

// Sul ticket, Deposit e To pay sbarrati con "/" vogliono dire che il cliente ha
// pagato tutto il Total (proprietario, 29 settembre 2026). Nel modulo: Total
// scritto, gli altri due vuoti. Si salva rest_to_pay = 0.
function pagatoTutto() {
  return numero(els.total) !== null && numero(els.deposit) === null && numero(els.rest) === null;
}

// ─── Foto ───────────────────────────────────────────────────────────────────

function sceltaFoto() {
  fotoScelta = els.photo.files[0] || null;
  if (els.preview.src) URL.revokeObjectURL(els.preview.src);
  els.preview.hidden = !fotoScelta;
  if (fotoScelta) els.preview.src = URL.createObjectURL(fotoScelta);
}

// Rimpicciolisce la foto prima di mandarla: da 5-10 MB a qualche centinaio di
// KB. 1600 px sul lato lungo bastano a leggere la scrittura a mano, e lo
// spazio gratuito di Supabase (1 GB) dura dieci volte di piu'.
function rimpicciolisci(file) {
  const LATO = 1600;
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scala = Math.min(1, LATO / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.naturalWidth * scala);
      canvas.height = Math.round(img.naturalHeight * scala);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(b => b ? resolve(b) : reject(new Error("foto")), "image/jpeg", 0.72);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("foto")); };
    img.src = url;
  });
}

// ─── Salvataggio ────────────────────────────────────────────────────────────

function valoreOVuoto(nome) {
  const v = els.form.elements[nome].value.trim();
  return v === "" ? null : v;
}

function intero(nome) {
  const v = els.form.elements[nome].value;
  return v === "" ? null : Math.max(0, parseInt(v, 10) || 0);
}

// I controlli prima di salvare. Restituisce il messaggio da mostrare, o "".
function cosaManca(riga) {
  if (!riga.ticket_number) return "Manca il ticket number.";
  if (!riga.excursion_id) return "Scegli l'escursione.";
  if (els.option.required && !riga.option_label) return `Scegli: ${els.optionLabel.textContent}.`;
  if (riga.excursion_id === ESCURSIONE_ALTRO && !riga.notes) return "Escursione fuori catalogo: scrivi quale nelle note.";
  if (!riga.date) return "Manca la data.";
  if (!riga.phone) return "Il telefono non è valido.";
  if (!els.phoneOk.checked) return "Ricontrolla il telefono con il ticket e spunta la casella.";
  return "";
}

async function salva(event) {
  event.preventDefault();
  mostra(els.msg, "");

  const riga = {
    ticket_number: valoreOVuoto("ticket_number"),
    status: "confirmed",
    source: "strada",
    excursion_id: els.exc.value || null,
    option_label: els.optionWrap.hidden ? null : (els.option.value || null),
    date: valoreOVuoto("date"),
    time: valoreOVuoto("time"),
    meeting_point: valoreOVuoto("meeting_point"),
    hotel: valoreOVuoto("hotel"),
    nationality: els.nation.value || null,
    phone: telefonoDelModulo(),
    adults: intero("adults"),
    kids: intero("kids"),
    babies: intero("babies"),
    total: numero(els.total),
    deposit: numero(els.deposit),
    rest_to_pay: pagatoTutto() ? 0 : numero(els.rest),
    reference: valoreOVuoto("reference"),
    seller: valoreOVuoto("seller") || venditore.name,
    notes: valoreOVuoto("notes"),
    confirmed_at: new Date().toISOString()
  };

  const manca = cosaManca(riga);
  if (manca) { mostra(els.msg, manca, "errore"); return; }

  els.save.disabled = true;
  els.save.textContent = "Salvo…";
  try {
    // Prima si guarda se il ticket c'e' gia': cosi' non si carica una foto
    // per niente. Il database lo rifiuterebbe comunque (ticket_number e' unico).
    const { data: esiste, error: errCerca } = await sb
      .from("bookings").select("id").eq("ticket_number", riga.ticket_number).limit(1);
    if (errCerca) throw errCerca;
    if (esiste.length) {
      mostra(els.msg, `Il ticket ${riga.ticket_number} è già stato inserito.`, "errore");
      return;
    }

    if (fotoScelta) {
      const blob = await rimpicciolisci(fotoScelta);
      const percorso = `${riga.ticket_number.replace(/[^\w-]/g, "_")}-${Date.now()}.jpg`;
      const { error: errFoto } = await sb.storage
        .from("ticket-foto").upload(percorso, blob, { contentType: "image/jpeg" });
      if (errFoto) throw errFoto;
      riga.photo_path = percorso;
    }

    const { error } = await sb.from("bookings").insert(riga);
    if (error) {
      if (error.code === "23505") {
        mostra(els.msg, `Il ticket ${riga.ticket_number} è già stato inserito.`, "errore");
        return;
      }
      throw error;
    }

    mostra(els.msg, `Ticket ${riga.ticket_number} salvato.`, "ok");
    pulisciModulo();
    caricaUltimi();
  } catch (err) {
    console.error(err);
    mostra(els.msg, "Non sono riuscito a salvare. Controlla la connessione e riprova: il modulo è rimasto com'era.", "errore");
  } finally {
    els.save.disabled = false;
    els.save.textContent = "Salva ticket";
  }
}

// Dopo il salvataggio: modulo vuoto per il ticket successivo. Il prefisso
// resta quello di prima: spesso i clienti di fila vengono dallo stesso paese.
function pulisciModulo() {
  const prefisso = els.prefix.value;
  els.form.reset();
  els.prefix.value = prefisso;
  fotoScelta = null;
  sceltaFoto();
  aggiornaEscursione();
  restoScrittoAMano = false;
  aggiornaSoldi();
  els.seller.value = venditore.name;
  els.phoneOut.textContent = "";
}

// ─── Ultimi inseriti ────────────────────────────────────────────────────────

function dataBreve(iso) {
  if (!iso) return "";
  const [a, m, g] = iso.split("-");
  return `${g}/${m}/${a}`;
}

async function caricaUltimi() {
  let domanda = sb
    .from("bookings")
    .select("id, ticket_number, reference, excursion_id, option_label, date, time, phone, adults, kids, babies, total, deposit, rest_to_pay, seller, photo_path, status");
  domanda = ricerca
    ? domanda.eq("ticket_number", ricerca)
    : domanda.order("created_at", { ascending: false }).limit(20);
  const { data, error } = await domanda;

  els.recentTitle.textContent = ricerca ? `Ticket ${ricerca}` : "Ultimi inseriti";
  els.searchReset.hidden = !ricerca;
  els.recent.replaceChildren();
  if (error) {
    els.recent.append(Object.assign(document.createElement("li"), { textContent: "Elenco non disponibile." }));
    return;
  }
  if (!data.length) {
    els.recent.append(Object.assign(document.createElement("li"), {
      textContent: ricerca ? `Nessun ticket con il numero ${ricerca}.` : "Ancora nessun ticket."
    }));
    return;
  }

  data.forEach(b => {
    const li = document.createElement("li");
    const tour = schedaDa(b.excursion_id);
    const nome = tour ? titoloDi(tour) : "Fuori catalogo";
    const persone = [b.adults, b.kids, b.babies].map(n => n || 0).join("+");

    const testo = document.createElement("div");
    const titolo = document.createElement("strong");
    titolo.textContent = `#${b.ticket_number} · ${nome}${b.option_label ? " · " + b.option_label : ""}`;
    const sotto = document.createElement("span");
    const soldi = b.rest_to_pay === null ? "" : (Number(b.rest_to_pay) === 0 ? " · pagato" : ` · resto ${b.rest_to_pay} €`);
    sotto.textContent = `${dataBreve(b.date)}${b.time ? " " + b.time.slice(0, 5) : ""} · ${persone}${soldi} · ${b.phone || ""} · ${b.seller || ""}${b.reference ? " · REF " + b.reference : ""}`;
    testo.append(titolo, sotto);
    li.append(testo);

    const bottoni = document.createElement("div");
    bottoni.className = "vend-list-btns";
    if (b.photo_path) {
      const bottone = document.createElement("button");
      bottone.type = "button";
      bottone.className = "btn btn-soft";
      bottone.textContent = "Foto";
      bottone.addEventListener("click", () => apriFoto(b.photo_path));
      bottoni.append(bottone);
    }
    const modifica = document.createElement("button");
    modifica.type = "button";
    modifica.className = "btn btn-soft";
    modifica.textContent = "Modifica";
    modifica.addEventListener("click", () => apriModifica(li, b));
    bottoni.append(modifica);
    li.append(bottoni);
    els.recent.append(li);
  });
}

function cerca(event) {
  event.preventDefault();
  mostra(els.recentMsg, "");
  ricerca = els.searchForm.elements.number.value.trim();
  caricaUltimi();
}

function tornaAgliUltimi() {
  mostra(els.recentMsg, "");
  els.searchForm.reset();
  ricerca = "";
  caricaUltimi();
}

// ─── Modifica: data, ora, persone e soldi ───────────────────────────────────
// Quando un'escursione viene rinviata (proprietario, 29 settembre 2026). Se
// cambiano le persone cambia anche il prezzo, quindi ci sono anche Total,
// Deposit e To pay, con le stesse regole del ticket nuovo. Il resto del
// ticket non si tocca da qui. Il cliente vede la data nuova la
// prossima volta che apre la sua pagina, senza scritte "rinviata": lo avverte
// l'ufficio su WhatsApp.

function apriModifica(li, b) {
  mostra(els.recentMsg, "");
  if (li.querySelector(".vend-edit")) return;   // gia' aperto

  const form = document.createElement("form");
  form.className = "vend-form vend-edit";
  form.noValidate = true;
  const id = "e" + b.id.slice(0, 8);
  form.innerHTML = `
    <div class="vend-row">
      <div>
        <label for="${id}Date">Data</label>
        <input id="${id}Date" name="date" type="date" required />
      </div>
      <div>
        <label for="${id}Time">Ora ritrovo</label>
        <input id="${id}Time" name="time" type="time" />
      </div>
    </div>
    <div class="vend-row vend-row-3">
      <div>
        <label for="${id}Adults">Adulti</label>
        <input id="${id}Adults" name="adults" type="number" inputmode="numeric" min="0" max="99" />
      </div>
      <div>
        <label for="${id}Kids">Bambini</label>
        <input id="${id}Kids" name="kids" type="number" inputmode="numeric" min="0" max="99" />
      </div>
      <div>
        <label for="${id}Babies">Neonati</label>
        <input id="${id}Babies" name="babies" type="number" inputmode="numeric" min="0" max="99" />
      </div>
    </div>
    <div class="vend-row vend-row-3">
      <div>
        <label for="${id}Total">Total €</label>
        <input id="${id}Total" name="total" type="number" inputmode="decimal" min="0" step="0.01" />
      </div>
      <div>
        <label for="${id}Deposit">Deposit €</label>
        <input id="${id}Deposit" name="deposit" type="number" inputmode="decimal" min="0" step="0.01" />
      </div>
      <div>
        <label for="${id}Rest">To pay €</label>
        <input id="${id}Rest" name="rest_to_pay" type="number" inputmode="decimal" min="0" step="0.01" />
      </div>
    </div>
    <p class="vend-warn" data-edit-warn hidden></p>
    <small class="vend-hint" data-edit-info></small>
    <small class="vend-hint">Se cambiano le persone, ricontrolla il prezzo. Avvisa il cliente su WhatsApp.</small>
    <p class="vend-msg" role="alert" hidden></p>
    <div class="vend-row">
      <button class="btn btn-soft" type="button" data-edit-cancel>Annulla</button>
      <button class="btn btn-primary" type="submit">Salva</button>
    </div>`;

  // I valori si mettono qui e non nell'HTML sopra: nessun testo del database
  // passa da innerHTML.
  const f = form.elements;
  f.date.value = b.date || "";
  f.time.value = b.time ? b.time.slice(0, 5) : "";
  f.adults.value = b.adults ?? "";
  f.kids.value = b.kids ?? "";
  f.babies.value = b.babies ?? "";
  f.total.value = b.total ?? "";
  f.deposit.value = b.deposit ?? "";
  // "Pagato tutto" si salva come rest_to_pay 0 senza deposit: nel modulo torna
  // com'era stato scritto, con To pay vuoto.
  const pagatoPrima = b.deposit === null && Number(b.rest_to_pay) === 0;
  f.rest_to_pay.value = pagatoPrima ? "" : (b.rest_to_pay ?? "");

  // Come aggiornaSoldi() del ticket nuovo: To pay si calcola da solo finche'
  // non lo scrive il venditore, e si avvisa se i tre numeri non tornano.
  // Aprendo il modulo il To pay che c'e' vale come "scritto": si ricalcola
  // solo quando si tocca Total o Deposit.
  let restoAMano = f.rest_to_pay.value !== "";
  const warn = form.querySelector("[data-edit-warn]");
  const info = form.querySelector("[data-edit-info]");
  const soldi = event => {
    if (event) restoAMano = event.target === f.rest_to_pay && f.rest_to_pay.value !== "";
    const totale = numero(f.total);
    const acconto = numero(f.deposit);
    if (!restoAMano) {
      f.rest_to_pay.value = totale !== null && acconto !== null && totale >= acconto
        ? (Math.round((totale - acconto) * 100) / 100).toString()
        : "";
    }
    const resto = numero(f.rest_to_pay);
    const tornano = totale === null || acconto === null || resto === null
      || Math.round(totale * 100) === Math.round(acconto * 100) + Math.round(resto * 100);
    mostra(warn, tornano ? "" : "Attenzione: total ≠ deposit + to pay.");
    const pagato = totale !== null && acconto === null && resto === null;
    info.textContent = pagato
      ? `Pagato tutto: ${totale} €, niente da pagare dopo.`
      : "Deposit e To pay vuoti vogliono dire pagato tutto.";
    info.classList.toggle("is-ok", pagato);
  };
  [f.total, f.deposit, f.rest_to_pay].forEach(i => i.addEventListener("input", soldi));
  soldi();

  form.querySelector("[data-edit-cancel]").addEventListener("click", () => form.remove());
  form.addEventListener("submit", event => salvaModifica(event, form, b));
  li.append(form);
  f.date.focus();
}

async function salvaModifica(event, form, b) {
  event.preventDefault();
  const f = form.elements;
  const msg = form.querySelector(".vend-msg");
  const bottone = form.querySelector('[type="submit"]');
  const intero = input => input.value === "" ? null : Math.max(0, parseInt(input.value, 10) || 0);

  const nuovo = {
    date: f.date.value || null,
    time: f.time.value || null,
    adults: intero(f.adults),
    kids: intero(f.kids),
    babies: intero(f.babies),
    total: numero(f.total),
    deposit: numero(f.deposit),
    rest_to_pay: numero(f.rest_to_pay)
  };
  // Stessa regola del ticket nuovo: Total scritto e gli altri due vuoti vuol
  // dire pagato tutto, e si salva rest_to_pay = 0.
  if (nuovo.total !== null && nuovo.deposit === null && nuovo.rest_to_pay === null) nuovo.rest_to_pay = 0;
  if (!nuovo.date) { mostra(msg, "Manca la data.", "errore"); return; }

  bottone.disabled = true;
  bottone.textContent = "Salvo…";
  try {
    // .select() dopo l'update: se le regole del database non lasciano passare
    // la modifica non c'e' errore, torna solo zero righe.
    const { data, error } = await sb.from("bookings").update(nuovo).eq("id", b.id).select("id");
    if (error || !data || !data.length) throw error || new Error("nessuna riga");
    await caricaUltimi();
    mostra(els.recentMsg, `Ticket ${b.ticket_number} modificato.`, "ok");
  } catch (err) {
    console.error(err);
    mostra(msg, "Non sono riuscito a salvare. Controlla la connessione e riprova.", "errore");
    bottone.disabled = false;
    bottone.textContent = "Salva";
  }
}

// Lo spazio delle foto e' privato: per guardarne una si chiede un link che
// vale un minuto.
async function apriFoto(percorso) {
  const finestra = window.open("", "_blank");
  const { data, error } = await sb.storage.from("ticket-foto").createSignedUrl(percorso, 60);
  if (error || !data) {
    if (finestra) finestra.close();
    alert("Foto non disponibile.");
    return;
  }
  if (finestra) finestra.location = data.signedUrl;
  else window.location = data.signedUrl;
}

// ─── Entrata e uscita ───────────────────────────────────────────────────────

async function entra(event) {
  event.preventDefault();
  mostra(els.loginMsg, "");
  const email = els.loginForm.elements.email.value.trim();
  const password = els.loginForm.elements.password.value;
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    mostra(els.loginMsg, "Email o password sbagliate.", "errore");
    return;
  }
  await mostraPagina();
}

async function esci() {
  await sb.auth.signOut();
  venditore = null;
  await mostraPagina();
}

// Decide cosa si vede: l'entrata o il lavoro.
async function mostraPagina() {
  const { data: { session } } = await sb.auth.getSession();
  venditore = null;

  if (session) {
    const { data, error } = await sb.from("sellers").select("name").limit(1);
    if (error) {
      // Quasi sempre e' la rete. Non si esce: l'entrata resta valida, basta
      // riaprire la pagina quando c'e' campo.
      mostra(els.loading, "Niente connessione: riapri la pagina quando c'è campo.", "errore");
      return;
    }
    if (data.length) {
      venditore = data[0];
    } else {
      // Entrato, ma non e' un venditore: il database non gli darebbe niente.
      await sb.auth.signOut();
      mostra(els.loginMsg, "Questo account non è abilitato come venditore.", "errore");
    }
  }

  els.loading.hidden = true;
  els.login.hidden = !!venditore;
  els.work.hidden = !venditore;
  if (venditore) {
    // Il segno per il link "Area venditori" nel menu di Isla (app.js).
    try { localStorage.setItem("isla-venditore", "1"); } catch (e) { /* incognito */ }
    els.sellerName.textContent = venditore.name;
    if (!els.seller.value) els.seller.value = venditore.name;
    caricaUltimi();
  }
}

// ─── Avvio ──────────────────────────────────────────────────────────────────

riempiEscursioni();
riempiPaesi();

els.loginForm.addEventListener("submit", entra);
els.logout.addEventListener("click", esci);
els.form.addEventListener("submit", salva);
els.searchForm.addEventListener("submit", cerca);
els.searchReset.addEventListener("click", tornaAgliUltimi);
// "Ticket … salvato" resta finche' non si comincia il ticket successivo.
els.form.addEventListener("input", () => {
  if (els.msg.classList.contains("is-ok")) mostra(els.msg, "");
});
els.photo.addEventListener("change", sceltaFoto);
els.exc.addEventListener("change", aggiornaEscursione);
els.phone.addEventListener("input", aggiornaTelefono);
els.prefix.addEventListener("change", aggiornaTelefono);
[els.total, els.deposit, els.rest].forEach(i => i.addEventListener("input", aggiornaSoldi));

// Scegliere la nazionalita' propone il prefisso dello stesso paese.
els.nation.addEventListener("change", () => {
  const paese = PAESI.find(p => p.code === els.nation.value);
  if (paese) {
    els.prefix.value = paese.prefix;
    aggiornaTelefono();
  }
});

mostraPagina();

// Isla — il foglio Google dei netti.
//
// Ogni ora chiede a Supabase i ticket col netto e le commissioni gia' calcolati
// (la funzione foglio_ticket, in supabase/modifiche/2026-10-08-pagamento.sql) e:
//   - una scheda per settimana ("Settimana 05-10-2026", dal lunedi', la piu'
//     nuova davanti): aggiunge i ticket nuovi e aggiorna quelli cambiati (un
//     rinvio, una persona in piu', un annullamento). NON CANCELLA MAI una
//     riga: la pulizia mensile di Supabase cancella i ticket vecchi, e qui
//     devono restare. Il foglio e' l'archivio;
//   - rifa' da capo "Per giorno", "Per settimana", "Per venditore" e "Per
//     compagnia", contate dal giorno in cui il ticket e' stato inserito. Nei
//     totali entrano solo i confermati: gli annullati si contano a parte,
//     quelli in attesa no.
//
// Come si installa: foglio-google/LEGGIMI.md.
//
// Qui dentro NON c'e' la parola segreta: sta nelle Proprieta' dello script
// (Impostazioni del progetto → Proprieta' dello script → SEGRETO). La chiave
// qui sotto e' quella pubblica del sito, la stessa di supabase-config.js: da
// sola non apre niente.

const SUPABASE_URL = "https://vjotkgsjtwmtctxtfeqa.supabase.co";
const SUPABASE_KEY = "sb_publishable_Qjmd8qP9J_GH1WjUmBolSw_vBdM5G3L";
// Il catalogo del sito: serve solo a scrivere il nome dell'escursione al
// posto del suo id ("La Gomera Island Tour" invece di "la-gomera").
const CATALOGO_URL = "https://jacques88-sudo.github.io/isla/esplora-catalog.js";

// Le colonne di ogni scheda della settimana, in ordine. Le prime 15 sono quelle che il
// proprietario vuole vedere, nel suo ordine (8 ottobre 2026), e solo quelle.
// Le altre servono al programma e stanno NASCOSTE a destra: l'id riconosce un
// ticket gia' scritto, lo stato barra gli annullati, settimana, venditore e
// compagnia fanno i riepiloghi. Non vanno toccate, e le colonne non vanno
// spostate.
const COLONNE = [
  ["inserito", "Data emissione"],
  ["ticket_number", "Ticket"],
  // Il nome dell'escursione e, se c'e', la variante: "Jet Ski Safari · 1 ora".
  ["escursione", "Escursione"],
  ["data_gita", "Data escursione"],
  ["adults", "Adulti"],
  ["kids", "Bambini"],
  ["total", "Totale €"],
  ["pagato", "Pagato €"],
  ["rest_to_pay", "Da pagare €"],
  // Quanto ha gia' pagato il cliente, nella colonna del suo metodo: la somma
  // della colonna Cash e' il contante da contare.
  ["card", "Card €"],
  ["cash", "Cash €"],
  ["netto", "Netto €"],
  ["al_venditore", "Al venditore €"],
  ["all_ufficio", "All'ufficio €"],
  ["commissione", "Commissioni €"],
  // Nascoste.
  ["stato", "Stato"],
  ["settimana", "Settimana"],
  ["seller", "Venditore"],
  ["company", "Compagnia"],
  ["id", "ID"]
];
const VISIBILI = 15;
const DATE = ["inserito", "settimana", "data_gita"];
const SOLDI = ["total", "pagato", "rest_to_pay", "card", "cash", "netto", "commissione", "al_venditore", "all_ufficio"];
// Testo e non numero: un ticket "0123" diventerebbe 123.
const TESTO = ["ticket_number", "id"];

// ─── Da lanciare una volta ──────────────────────────────────────────────────

// Mette l'aggiornamento ogni ora e lo fa subito una prima volta. Lanciata di
// nuovo non raddoppia niente: toglie il vecchio orario prima di mettere il nuovo.
// Mette anche la scheda "Aggiorna", con la casella da toccare dal telefono.
function installa() {
  ScriptApp.getProjectTriggers()
    .filter(t => ["aggiorna", "quandoCambia"].indexOf(t.getHandlerFunction()) >= 0)
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("aggiorna").timeBased().everyHours(1).create();
  ScriptApp.newTrigger("quandoCambia").forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet()).onEdit().create();
  schedaAggiorna(SpreadsheetApp.getActiveSpreadsheet());
  aggiorna();
}

// ─── La casella "Aggiorna adesso", per il telefono ──────────────────────────
// L'app Fogli del telefono non mostra il menu "Isla" e non sa lanciare il
// programma. Sa pero' cambiare una cella, e una cella cambiata fa partire
// quandoCambia() (un "trigger" messo da installa(), che vale anche dal
// telefono). Si tocca la casella, il foglio si aggiorna, la casella si toglie.
const CASELLA = "A3";
const STATO_AGGIORNA = "A5";

function schedaAggiorna(ss) {
  let s = ss.getSheetByName("Aggiorna");
  if (!s) s = ss.insertSheet("Aggiorna", 0);
  s.getRange("A1").setValue("Per aggiornare il foglio adesso, anche dal telefono: tocca la casella qui sotto.").setFontWeight("bold");
  s.getRange(CASELLA).insertCheckboxes().setValue(false);
  s.getRange("B3").setValue("Aggiorna adesso");
  s.setColumnWidth(1, 60);
  return s;
}

function quandoCambia(e) {
  if (!e || !e.range) return;
  const s = e.range.getSheet();
  if (s.getName() !== "Aggiorna" || e.range.getA1Notation() !== CASELLA) return;
  if (e.range.getValue() !== true) return;
  s.getRange(STATO_AGGIORNA).setValue("Aggiorno… (qualche secondo)");
  try {
    aggiorna();
  } catch (err) {
    s.getRange(STATO_AGGIORNA).setValue("Non sono riuscito ad aggiornare: " + err.message);
  }
  e.range.setValue(false);
}

// Il menu "Isla → Aggiorna adesso" nel foglio, per non aspettare l'ora. Google
// lo mette da solo ogni volta che il foglio si apre.
function onOpen() {
  SpreadsheetApp.getUi().createMenu("Isla")
    .addItem("Aggiorna adesso", "aggiornaDalMenu")
    .addToUi();
}

function aggiornaDalMenu() {
  aggiorna();
  SpreadsheetApp.getActiveSpreadsheet().toast("Aggiornato.", "Isla");
}

// ─── Ogni ora ───────────────────────────────────────────────────────────────

function aggiorna() {
  // Uno alla volta: l'aggiornamento dell'ora e la casella toccata nello stesso
  // momento scriverebbero le stesse righe due volte.
  const lucchetto = LockService.getScriptLock();
  if (!lucchetto.tryLock(120000)) return;
  try {
    aggiornaDavvero();
    const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Aggiorna");
    if (s) s.getRange(STATO_AGGIORNA).setValue("Ultimo aggiornamento: " +
      Utilities.formatDate(new Date(), SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(), "dd/MM/yyyy HH:mm"));
  } finally {
    lucchetto.releaseLock();
  }
}

function aggiornaDavvero() {
  const segreto = PropertiesService.getScriptProperties().getProperty("SEGRETO");
  if (!segreto) {
    throw new Error("Manca la parola segreta: Impostazioni del progetto → Proprietà dello script → SEGRETO.");
  }
  const risposta = UrlFetchApp.fetch(SUPABASE_URL + "/rest/v1/rpc/foglio_ticket", {
    method: "post",
    contentType: "application/json",
    headers: { apikey: SUPABASE_KEY },
    payload: JSON.stringify({ p_segreto: segreto }),
    muteHttpExceptions: true
  });
  if (risposta.getResponseCode() !== 200) {
    throw new Error("Supabase ha risposto " + risposta.getResponseCode() + ": " + risposta.getContentText().slice(0, 300));
  }
  const arrivati = JSON.parse(risposta.getContentText());
  // Zero ticket vuol dire quasi sempre la parola sbagliata (la porta risponde
  // "niente" e non "no", apposta). Il foglio resta com'e'.
  if (!arrivati.length) {
    console.warn("Nessun ticket da Supabase: controlla la parola segreta. Il foglio non è stato toccato.");
    return;
  }

  const titoli = titoliDelCatalogo();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const quando = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "dd-MM HH.mm");

  // La scheda unica "Ticket" delle versioni di prima: da quando c'e' una scheda
  // per settimana (proprietario, 8 ottobre 2026) si mette da parte, una volta.
  const unica = ss.getSheetByName("Ticket");
  if (unica) unica.setName("Ticket (vecchio " + quando + ")");

  // I ticket divisi per settimana: il lunedi' della data di emissione. Le
  // richieste WhatsApp ancora in attesa non sono ticket: entrano quando
  // l'ufficio le conferma.
  const perSettimana = {};
  arrivati.forEach(t => {
    if (t.stato === "in attesa" || !t.settimana) return;
    if (!perSettimana[t.settimana]) perSettimana[t.settimana] = [];
    perSettimana[t.settimana].push(t);
  });
  // Dalla piu' vecchia alla piu' nuova: ogni scheda nuova va davanti, cosi'
  // la settimana in corso e' sempre la prima.
  Object.keys(perSettimana).sort().forEach(lunedi => {
    scriviSettimana(ss, lunedi, perSettimana[lunedi], titoli, quando);
  });

  // I riepiloghi contano tutte le settimane del foglio, anche i ticket che
  // Supabase ha gia' cancellato.
  const tutte = [];
  ss.getSheets().filter(f => NOME_SETTIMANA.test(f.getName())).forEach(f => {
    const n = f.getLastRow() - 1;
    if (n > 0) f.getRange(2, 1, n, COLONNE.length).getValues().forEach(r => tutte.push(r));
  });
  riepiloghi(ss, tutte);
}

// Il nome della scheda di una settimana: "Settimana 05-10-2026", col lunedi'.
// Una scheda messa da parte ("… (vecchio …)") non e' una settimana e non conta.
const NOME_SETTIMANA = /^Settimana \d{2}-\d{2}-\d{4}$/;

// Scrive i ticket di una settimana nella sua scheda, giorno per giorno:
//
//   ticket del giorno, uno per riga
//   Totale del giorno      (cash, al venditore, all'ufficio, commissioni)
//   (riga vuota)
//   ticket del giorno dopo…
//
// Aggiorna i ticket che ci sono gia' (li riconosce dall'id), aggiunge i nuovi
// in fondo al loro giorno, sopra il totale, e non toglie niente. Un ticket non
// cambia mai giorno ne' settimana: la data di emissione e' fissa.
//
// La scheda si rilegge intera, ANCHE le colonne scritte a mano a destra (dalla
// U in poi), e si riscrive: ogni riga si porta dietro le sue celle, cosi' una
// nota scritta accanto a un ticket resta accanto a lui anche quando sopra di
// lui entra un ticket nuovo. Si perde solo quello che si scrive nelle righe
// vuote fra un giorno e l'altro.
function scriviSettimana(ss, lunedi, arrivati, titoli, quando) {
  const [a, m, g] = lunedi.split("-");
  const nome = "Settimana " + g + "-" + m + "-" + a;
  const intestazioni = COLONNE.map(c => c[1]);

  // Colonne cambiate (una versione nuova di questo programma): la scheda
  // vecchia si mette da parte intera e la settimana ricomincia. I ticket che
  // Supabase ha ancora tornano tutti.
  let foglio = ss.getSheetByName(nome);
  if (foglio && foglio.getLastRow() > 0) {
    const ora = foglio.getRange(1, 1, 1, intestazioni.length).getValues()[0];
    if (ora.some((x, k) => x !== intestazioni[k])) {
      foglio.setName(nome + " (vecchio " + quando + ")");
      foglio = null;
    }
  }
  // La settimana nuova va davanti, ma dopo la scheda "Aggiorna" se c'e'.
  if (!foglio) foglio = ss.insertSheet(nome, ss.getSheetByName("Aggiorna") ? 1 : 0);
  foglio.getRange(1, 1, 1, intestazioni.length).setValues([intestazioni]).setFontWeight("bold");
  foglio.setFrozenRows(1);

  const fuso = ss.getSpreadsheetTimeZone();
  const giornoDi = d => (d instanceof Date ? Utilities.formatDate(d, fuso, "yyyy-MM-dd") : String(d || ""));
  const col = chiave => COLONNE.findIndex(c => c[0] === chiave);
  const iId = col("id"), iGiorno = col("inserito"), iStato = col("stato");

  // Quello che c'e' adesso, tutta la larghezza.
  const larghezza = Math.max(COLONNE.length, foglio.getLastColumn());
  const vuota = () => Array(larghezza).fill("");
  const n = foglio.getLastRow() - 1;
  const prima = n > 0 ? foglio.getRange(2, 1, n, larghezza).getValues() : [];

  const giorni = {};    // "2026-10-08" → le righe dei suoi ticket, in ordine
  const totali = {};    // "2026-10-08" → la sua riga del totale
  const dove = {};      // id del ticket → la sua riga
  const aggiungi = (giorno, riga) => {
    if (!giorni[giorno]) giorni[giorno] = [];
    giorni[giorno].push(riga);
  };
  prima.forEach(r => {
    const id = String(r[iId] || "");
    if (!id) return;                                   // una riga vuota
    if (id.indexOf("totale-") === 0) { totali[id.slice(7)] = r; return; }
    dove[id] = r;
    aggiungi(giornoDi(r[iGiorno]), r);
  });

  arrivati.forEach(t => {
    const nuova = COLONNE.map(([chiave]) => valore(t, chiave, titoli));
    const r = dove[t.id];
    // Gia' scritto: si cambiano solo le colonne del programma, non le tue.
    if (r) { nuova.forEach((v, k) => { r[k] = v; }); return; }
    const riga = vuota();
    nuova.forEach((v, k) => { riga[k] = v; });
    dove[t.id] = riga;
    aggiungi(giornoDi(t.inserito), riga);
  });

  // Di nuovo in fila: giorno per giorno, col totale e la riga vuota.
  const righe = [], tipi = [];
  Object.keys(giorni).sort().forEach((giorno, k) => {
    if (k) { righe.push(vuota()); tipi.push("vuota"); }
    giorni[giorno].forEach(r => { righe.push(r); tipi.push(r[iStato] === "annullato" ? "annullato" : "ticket"); });
    const tot = totali[giorno] || vuota();
    COLONNE.forEach(([chiave], j) => { tot[j] = valoreTotale(chiave, giorno, lunedi, giorni[giorno]); });
    righe.push(tot); tipi.push("totale");
  });
  if (!righe.length) return;

  // I formati prima dei valori: il formato testo deve esserci gia' quando
  // arriva il numero del ticket.
  COLONNE.forEach(([chiave], i) => {
    const colonna = foglio.getRange(2, i + 1, righe.length, 1);
    if (DATE.includes(chiave)) colonna.setNumberFormat("dd/mm/yyyy");
    if (SOLDI.includes(chiave)) colonna.setNumberFormat("#,##0.00");
    if (TESTO.includes(chiave)) colonna.setNumberFormat("@");
  });
  foglio.getRange(2, 1, righe.length, larghezza).setValues(righe);
  // Se prima c'erano piu' righe (righe vuote in piu'), quelle in fondo si puliscono.
  if (prima.length > righe.length) {
    foglio.getRange(2 + righe.length, 1, prima.length - righe.length, larghezza).clearContent();
  }

  // Gli annullati barrati e in grigio; il totale in grassetto su fondo sabbia.
  const area = foglio.getRange(2, 1, Math.max(righe.length, prima.length), VISIBILI);
  const tutte = tipi.concat(Array(Math.max(0, prima.length - righe.length)).fill("vuota"));
  const per = f => tutte.map(x => Array(VISIBILI).fill(f(x)));
  area.setFontLines(per(x => (x === "annullato" ? "line-through" : "none")))
      .setFontColors(per(x => (x === "annullato" ? "#999999" : "#000000")))
      .setFontWeights(per(x => (x === "totale" ? "bold" : "normal")))
      .setBackgrounds(per(x => (x === "totale" ? "#f1ece1" : null)));
  foglio.hideColumns(VISIBILI + 1, COLONNE.length - VISIBILI);
}

// Una cella della riga "Totale del giorno". Contano solo i ticket confermati:
// gli annullati restano barrati sopra, ma non si sommano.
function valoreTotale(chiave, giorno, lunedi, righe) {
  if (chiave === "inserito") return giorno;
  if (chiave === "escursione") return "Totale del giorno";
  if (chiave === "settimana") return lunedi;
  if (chiave === "stato") return "totale";
  if (chiave === "id") return "totale-" + giorno;
  if (["cash", "al_venditore", "all_ufficio", "commissione"].indexOf(chiave) < 0) return "";
  const k = COLONNE.findIndex(c => c[0] === chiave);
  const s = COLONNE.findIndex(c => c[0] === "stato");
  const somma = righe.filter(r => r[s] === "confermato")
    .reduce((t, r) => t + (typeof r[k] === "number" ? r[k] : 0), 0);
  return Math.round(somma * 100) / 100;
}

// Il valore di una cella, da una riga di Supabase.
function valore(t, chiave, titoli) {
  // "Agua Safari · Doppia · 1 ora": la compagnia (o, se non c'e', il nome
  // della scheda), i mezzi e la variante (proprietario, 8 ottobre 2026).
  if (chiave === "escursione") {
    const scheda = titoli[t.excursion_id] || { titolo: t.excursion_id || "", tipi: {} };
    const mezzi = t.units ? Object.keys(t.units).map(k => {
      const nome = scheda.tipi[k] || k;
      return t.units[k] > 1 ? nome + " ×" + t.units[k] : nome;
    }).join(", ") : "";
    return [t.company || scheda.titolo, mezzi, t.option_label].filter(Boolean).join(" · ");
  }
  if (chiave === "card" || chiave === "cash") {
    return t.payment_method === chiave && t.pagato !== null && t.pagato !== undefined ? Number(t.pagato) : "";
  }
  const v = t[chiave];
  if (v === null || v === undefined) return "";
  // Le date come testo "2026-10-05": il foglio le fa diventare date da solo,
  // senza ore e quindi senza fusi orari. Un oggetto Date sarebbe la mezzanotte
  // del fuso dello script, e su un foglio con l'ora italiana diventerebbe le
  // 23 del giorno prima.
  if (DATE.includes(chiave)) return String(v);
  if (SOLDI.includes(chiave)) return Number(v);
  return v;
}

// Dal catalogo del sito, scheda per scheda: il nome e i nomi dei tipi di mezzo
// ({ "jet-ski-safari-1-2h": { titolo: "Jet Ski Safari", tipi: { doppia: "Doppia" } } }).
// I tipi si leggono dentro la loro scheda, non in tutto il catalogo: "due" e'
// "2 posti" sui buggy e "Con 1 o 2 persone" sulle Mustang. Se il sito non
// risponde si va avanti con gli id: il riepilogo conta lo stesso.
function titoliDelCatalogo() {
  const schede = {};
  try {
    const testo = UrlFetchApp.fetch(CATALOGO_URL, { muteHttpExceptions: true }).getContentText();
    // id: "…", poi (anche dopo qualche riga di commento) title: "…", oppure
    // title: { it: "…", … } quando il titolo cambia con la lingua: si prende
    // l'italiano.
    const cerca = /\bid:\s*"([^"]+)",\s*(?:\/\/[^\n]*\n\s*)*title:\s*(?:"([^"]+)"|\{\s*it:\s*"([^"]+)")/g;
    const trovate = [];
    let m;
    while ((m = cerca.exec(testo))) trovate.push({ id: m[1], titolo: m[2] || m[3], da: m.index });
    trovate.forEach((x, k) => {
      const pezzo = testo.slice(x.da, k + 1 < trovate.length ? trovate[k + 1].da : testo.length);
      const tipi = {};
      const tipo = /\{\s*key:\s*"([^"]+)",\s*seats:\s*\d+,\s*name:\s*(?:"([^"]+)"|\{\s*it:\s*"([^"]+)")/g;
      let t;
      while ((t = tipo.exec(pezzo))) tipi[t[1]] = t[2] || t[3];
      schede[x.id] = { titolo: x.titolo, tipi: tipi };
    });
  } catch (e) {
    console.warn("Catalogo non raggiungibile: " + e);
  }
  return schede;
}

// Una scheda del foglio, creata se non c'e', con le intestazioni in riga 1.
function scheda(ss, nome, intestazioni) {
  const s = ss.getSheetByName(nome) || ss.insertSheet(nome);
  s.getRange(1, 1, 1, intestazioni.length).setValues([intestazioni]).setFontWeight("bold");
  s.setFrozenRows(1);
  return s;
}

// ─── I riepiloghi ───────────────────────────────────────────────────────────
// Si rifanno da capo a ogni giro, dalle schede delle settimane (anche dalle righe che
// Supabase ha gia' cancellato). "Netto" e "Quota Isla" sommano solo i ticket
// che il netto ce l'hanno; "Senza netto" dice quanti mancano.

function riepiloghi(ss, tabella) {
  const i = {};
  COLONNE.forEach(([chiave], k) => { i[chiave] = k; });
  const num = v => (typeof v === "number" ? v : 0);

  function raggruppa(chiaveDi) {
    const gruppi = {};
    tabella.forEach(r => {
      const chiave = chiaveDi(r);
      const g = gruppi[chiave] || (gruppi[chiave] = {
        ticket: 0, persone: 0, venduto: 0, card: 0, cash: 0, netto: 0, commissione: 0,
        venditore: 0, ufficio: 0, senzaNetto: 0, annullati: 0, r: r
      });
      if (r[i.stato] === "annullato") { g.annullati += 1; return; }
      if (r[i.stato] !== "confermato") return;
      g.ticket += 1;
      g.persone += num(r[i.adults]) + num(r[i.kids]);
      g.venduto += num(r[i.total]);
      g.card += num(r[i.card]);
      g.cash += num(r[i.cash]);
      if (typeof r[i.netto] === "number") {
        g.netto += r[i.netto];
        g.commissione += num(r[i.commissione]);
        g.venditore += num(r[i.al_venditore]);
        g.ufficio += num(r[i.all_ufficio]);
      } else {
        g.senzaNetto += 1;
      }
    });
    // Un gruppo fatto solo di richieste in attesa sarebbe una riga di zeri.
    Object.keys(gruppi).forEach(k => {
      if (!gruppi[k].ticket && !gruppi[k].annullati) delete gruppi[k];
    });
    return gruppi;
  }

  // Una data che torna dal foglio e' un Date nel fuso del foglio; una appena
  // arrivata e' ancora il testo "2026-10-05". Tutte e due diventano il testo.
  const fuso = ss.getSpreadsheetTimeZone();
  const giorno = d => (d instanceof Date ? Utilities.formatDate(d, fuso, "yyyy-MM-dd") : String(d));
  // Lo stesso ordine della scheda Ticket: netto, venditore, ufficio, commissioni.
  const numeri = g => [g.ticket, g.persone, g.venduto, g.card, g.cash, g.netto,
                       g.venditore, g.ufficio, g.commissione, g.senzaNetto, g.annullati];
  const coda = ["Ticket", "Persone", "Venduto €", "Card €", "Cash €", "Netto €",
                "Al venditore €", "All'ufficio €", "Commissioni €", "Senza netto", "Annullati"];

  const perGiorno = raggruppa(r => giorno(r[i.inserito]));
  scrivi(ss, "Per giorno", ["Giorno"].concat(coda),
    Object.keys(perGiorno).sort().reverse().map(k => [perGiorno[k].r[i.inserito]].concat(numeri(perGiorno[k]))), 1);

  const perSettimana = raggruppa(r => giorno(r[i.settimana]));
  scrivi(ss, "Per settimana", ["Settimana (lunedì)"].concat(coda),
    Object.keys(perSettimana).sort().reverse().map(k => [perSettimana[k].r[i.settimana]].concat(numeri(perSettimana[k]))), 1);

  // Per venditore, settimana per settimana: quanto spetta a ciascuno.
  const perVenditore = raggruppa(r => giorno(r[i.settimana]) + "|" + (r[i.seller] || ""));
  scrivi(ss, "Per venditore", ["Settimana (lunedì)", "Venditore"].concat(coda),
    Object.keys(perVenditore).sort((a, b) => {
      const [sa, va] = a.split("|"), [sb, vb] = b.split("|");
      return sa === sb ? va.localeCompare(vb) : (sa < sb ? 1 : -1);
    }).map(k => {
      const g = perVenditore[k];
      return [g.r[i.settimana], g.r[i.seller] || "(non scritto)"].concat(numeri(g));
    }), 2);

  // Per compagnia, settimana per settimana: e' quello che si paga.
  const perCompagnia = raggruppa(r => giorno(r[i.settimana]) + "|" + (r[i.company] || ""));
  scrivi(ss, "Per compagnia", ["Settimana (lunedì)", "Compagnia"].concat(coda),
    Object.keys(perCompagnia).sort((a, b) => {
      const [sa, ca] = a.split("|"), [sb, cb] = b.split("|");
      return sa === sb ? ca.localeCompare(cb) : (sa < sb ? 1 : -1);
    }).map(k => {
      const g = perCompagnia[k];
      return [g.r[i.settimana], g.r[i.company] || "(non scritta)"].concat(numeri(g));
    }), 2);
}

// Riscrive una scheda di riepilogo: intestazioni, righe, formati.
function scrivi(ss, nome, intestazioni, righe, colonneData) {
  const s = scheda(ss, nome, intestazioni);
  if (s.getLastRow() > 1) s.getRange(2, 1, s.getLastRow() - 1, s.getLastColumn()).clearContent();
  const aggiornato = "Aggiornato: " + Utilities.formatDate(new Date(), "Atlantic/Canary", "dd/MM/yyyy HH:mm");
  s.getRange(1, intestazioni.length + 2).setValue(aggiornato);
  if (!righe.length) return;
  s.getRange(2, 1, righe.length, intestazioni.length).setValues(righe);
  s.getRange(2, 1, righe.length, 1).setNumberFormat("dd/mm/yyyy");
  const primoSoldi = colonneData + 3;   // dopo "Ticket" e "Persone"
  s.getRange(2, primoSoldi, righe.length, 7).setNumberFormat("#,##0.00");
}

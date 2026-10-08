// Isla — il foglio Google dei netti.
//
// Ogni ora chiede a Supabase i ticket col netto e le commissioni gia' calcolati
// (la funzione foglio_ticket, in supabase/modifiche/2026-10-08-pagamento.sql) e:
//   - nella scheda "Ticket" aggiunge i ticket nuovi e aggiorna quelli cambiati
//     (un rinvio, una persona in piu', un annullamento). NON CANCELLA MAI una
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
// Il catalogo del sito: serve solo a scrivere il titolo dell'escursione al
// posto del suo id ("La Gomera Island Tour" invece di "la-gomera").
const CATALOGO_URL = "https://jacques88-sudo.github.io/isla/esplora-catalog.js";

// Le colonne della scheda "Ticket", in ordine. L'ultima e' l'id del database:
// e' il modo in cui il programma riconosce un ticket gia' scritto. Non va
// toccata, e le colonne non vanno spostate.
const COLONNE = [
  // Le prime, nell'ordine chiesto dal proprietario (8 ottobre 2026).
  ["inserito", "Inserito"],
  ["ticket_number", "Ticket"],
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
  ["commissione", "Commissione €"],
  ["al_venditore", "Al venditore €"],
  ["all_ufficio", "All'ufficio €"],
  // Poi il resto, che serve ai riepiloghi e a capire una riga.
  ["stato", "Stato"],
  ["escursione", "Escursione"],
  ["option_label", "Variante"],
  ["company", "Compagnia"],
  ["babies", "Neonati"],
  ["mezzi", "Mezzi"],
  ["seller", "Venditore"],
  ["nota", "Nota"],
  ["settimana", "Settimana (lunedì)"],
  ["origine", "Origine"],
  ["id", "ID (non toccare)"]
];
const DATE = ["inserito", "settimana", "data_gita"];
const SOLDI = ["total", "pagato", "rest_to_pay", "card", "cash", "netto", "commissione", "al_venditore", "all_ufficio"];
// Testo e non numero: un ticket "0123" diventerebbe 123.
const TESTO = ["ticket_number", "id"];

// ─── Da lanciare una volta ──────────────────────────────────────────────────

// Mette l'aggiornamento ogni ora e lo fa subito una prima volta. Lanciata di
// nuovo non raddoppia niente: toglie il vecchio orario prima di mettere il nuovo.
function installa() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === "aggiorna")
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("aggiorna").timeBased().everyHours(1).create();
  aggiorna();
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
  // Colonne cambiate (una versione vecchia di questo programma): la scheda
  // vecchia si mette da parte intera e si ricomincia. Non si perde niente:
  // i ticket che Supabase ha ancora tornano, e la vecchia resta li' da guardare.
  const vecchia = ss.getSheetByName("Ticket");
  if (vecchia && vecchia.getLastRow() > 0) {
    const giuste = COLONNE.map(c => c[1]);
    const ora = vecchia.getRange(1, 1, 1, giuste.length).getValues()[0];
    if (ora.some((x, k) => x !== giuste[k])) {
      vecchia.setName("Ticket (vecchio " + Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "dd-MM HH.mm") + ")");
    }
  }
  const foglio = scheda(ss, "Ticket", COLONNE.map(c => c[1]));

  // Le righe gia' scritte, e dove sta ognuna (per id).
  const n = foglio.getLastRow() - 1;
  const tabella = n > 0 ? foglio.getRange(2, 1, n, COLONNE.length).getValues() : [];
  const dove = {};
  tabella.forEach((r, i) => { dove[r[COLONNE.length - 1]] = i; });

  arrivati.forEach(t => {
    const riga = COLONNE.map(([chiave]) => valore(t, chiave, titoli));
    if (t.id in dove) tabella[dove[t.id]] = riga;
    else { dove[t.id] = tabella.length; tabella.push(riga); }
  });

  if (tabella.length) {
    // I formati prima dei valori: il formato testo deve esserci gia' quando
    // arriva il numero del ticket.
    COLONNE.forEach(([chiave], i) => {
      const colonna = foglio.getRange(2, i + 1, tabella.length, 1);
      if (DATE.includes(chiave)) colonna.setNumberFormat("dd/mm/yyyy");
      if (SOLDI.includes(chiave)) colonna.setNumberFormat("#,##0.00");
      if (TESTO.includes(chiave)) colonna.setNumberFormat("@");
    });
    foglio.getRange(2, 1, tabella.length, COLONNE.length).setValues(tabella);
  }

  riepiloghi(ss, tabella);
}

// Il valore di una cella, da una riga di Supabase.
function valore(t, chiave, titoli) {
  if (chiave === "escursione") return titoli[t.excursion_id] || t.excursion_id || "";
  if (chiave === "origine") return { strada: "ticket di carta", whatsapp: "WhatsApp", online: "online" }[t.origine] || t.origine || "";
  if (chiave === "card" || chiave === "cash") {
    return t.payment_method === chiave && t.pagato !== null && t.pagato !== undefined ? Number(t.pagato) : "";
  }
  if (chiave === "mezzi") {
    return t.units ? Object.keys(t.units).map(k => k + " × " + t.units[k]).join(", ") : "";
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

// I titoli delle schede, dal catalogo del sito. Se il sito non risponde si va
// avanti con gli id: il riepilogo conta lo stesso.
function titoliDelCatalogo() {
  const titoli = {};
  try {
    const testo = UrlFetchApp.fetch(CATALOGO_URL, { muteHttpExceptions: true }).getContentText();
    // id: "…", poi (anche dopo qualche riga di commento) title: "…"
    const cerca = /\bid:\s*"([^"]+)",\s*(?:\/\/[^\n]*\n\s*)*title:\s*"([^"]+)"/g;
    let m;
    while ((m = cerca.exec(testo))) titoli[m[1]] = m[2];
  } catch (e) {
    console.warn("Catalogo non raggiungibile: " + e);
  }
  return titoli;
}

// Una scheda del foglio, creata se non c'e', con le intestazioni in riga 1.
function scheda(ss, nome, intestazioni) {
  const s = ss.getSheetByName(nome) || ss.insertSheet(nome);
  s.getRange(1, 1, 1, intestazioni.length).setValues([intestazioni]).setFontWeight("bold");
  s.setFrozenRows(1);
  return s;
}

// ─── I riepiloghi ───────────────────────────────────────────────────────────
// Si rifanno da capo a ogni giro, dalla scheda "Ticket" (anche dalle righe che
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
      g.persone += num(r[i.adults]) + num(r[i.kids]) + num(r[i.babies]);
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
  const numeri = g => [g.ticket, g.persone, g.venduto, g.card, g.cash, g.netto, g.commissione,
                       g.venditore, g.ufficio, g.senzaNetto, g.annullati];
  const coda = ["Ticket", "Persone", "Venduto €", "Card €", "Cash €", "Netto €", "Commissione €",
                "Al venditore €", "All'ufficio €", "Senza netto", "Annullati"];

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

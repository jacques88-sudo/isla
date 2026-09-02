// Controllo del catalogo. Si lancia con:
//
//     node controlla.js
//
// Non serve niente di installato: legge i file del progetto e basta. Esce con
// codice 1 se trova un errore, cosi' puo' essere messo in un hook o in una CI.
//
// A cosa serve. Le regole del catalogo (le fasce d'eta' devono combaciare, una
// parola in `included` deve avere la sua icona, una foto citata deve esistere)
// finora stavano solo in NOTES.md e nella testa di chi scriveva. Le regole in
// testa si dimenticano: il buco d'eta' a 3 anni su Freebird e' passato, ed e'
// stato notato solo rileggendo la pagina. Qui invece si controllano da sole in
// un secondo.
//
// Come aggiungere un controllo: scrivi una funzione che chiama errore() o
// avviso() e aggiungila alla lista CONTROLLI in fondo.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const RADICE = __dirname;
const leggi = f => fs.readFileSync(path.join(RADICE, f), "utf8");

// ─── Caricamento ───────────────────────────────────────────────────────────
// Il catalogo e' un file di `const` pensato per il browser, non un modulo: si
// valuta il testo dopo aver trasformato le `const` in `var`, che e' quello che
// fa anche il browser quando lo carica con <script>.
const sorgenteCatalogo = leggi("esplora-catalog.js").replace(/^const /gm, "var ");
eval(sorgenteCatalogo);

const sorgenteTour = leggi("tour.js");
const sorgenteI18n = leggi("i18n.js");
const sorgenteSw = leggi("sw.js");

// Le icone disponibili, lette da tour.js: sono le chiavi di INCLUDED_ICONS.
const ICONE = new Set(
  sorgenteTour
    .split("const INCLUDED_ICONS = {")[1]
    .split("\n};")[0]
    .split("\n")
    .map(riga => (riga.match(/^\s*([a-zA-Z0-9_]+)\s*:/) || [])[1])
    .filter(Boolean)
);

const FOTO = new Set(fs.readdirSync(path.join(RADICE, "assets")));
const CATEGORIE = new Set(CATEGORIES.map(c => c.id));
const LINGUE = ["it", "en", "es"];

// I file .js/.css/.html che il service worker mette in cache: sono letti da
// ASSETS in sw.js, non riscritti a mano qui. Un elenco duplicato a mano
// rischia di restare indietro (e' successo: "style.css" invece di
// "styles.css", e per giunta commentato) - questo si aggiorna da solo ogni
// volta che ASSETS cambia.
const FILE_IN_CACHE = sorgenteSw
  .split("const ASSETS = [")[1]
  .split("];")[0]
  .match(/"\.\/([^"]+)"/g)
  .map(s => s.slice(3, -1))
  .filter(f => /\.(js|css|html)$/.test(f));

// Esegue un comando git nella cartella del progetto. Torna null se fallisce
// (niente .git, ref assente, git non installato): i controlli che lo usano si
// saltano invece di far cadere tutto controlla.js.
function git(argomenti) {
  try {
    return execFileSync("git", argomenti, { cwd: RADICE, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch (e) {
    return null;
  }
}

// true se il file e' diverso fra il commit `base` e la copia di lavoro
// attuale, comprese le modifiche non ancora committate.
function differisce(base, file) {
  try {
    execFileSync("git", ["diff", "--quiet", base, "--", file], { cwd: RADICE, stdio: "ignore" });
    return false;
  } catch (e) {
    return true;
  }
}

// ─── Raccolta dei problemi ─────────────────────────────────────────────────
const errori = [];
const avvisi = [];
const errore = (dove, testo) => errori.push({ dove, testo });
const avviso = (dove, testo) => avvisi.push({ dove, testo });

// Le varianti di una scheda, o lista vuota.
const varianti = t => (t.options && t.options.choices) || [];

// ─── 1. Le fasce d'eta' devono combaciare ──────────────────────────────────
// "0-2", "3-11", "12+" e' giusto: ogni fascia riparte dove finisce la
// precedente. "0-2" con "4-11" lascia fuori i bambini di 3 anni, e nessuno se
// ne accorge finche' non si presenta al porto uno di 3 anni. "0-3" con "3-11"
// e' l'errore opposto: i 3 anni stanno in due fasce e non si sa quale prezzo
// paghino.
function estremi(fascia) {
  if (typeof fascia !== "string") return null;
  const aperta = fascia.match(/^(\d+)\s*\+$/);          // "12+"
  if (aperta) return { da: +aperta[1], a: Infinity };
  const chiusa = fascia.match(/^(\d+)\s*-\s*(\d+)$/);   // "3-11"
  if (chiusa) return { da: +chiusa[1], a: +chiusa[2] };
  return null;
}

function controllaEta(t) {
  if (!t.ages) return;
  const scritte = ["infant", "child", "adult"]
    .filter(n => t.ages[n] !== undefined)
    .map(n => ({ nome: n, testo: t.ages[n], val: estremi(t.ages[n]) }));

  scritte.forEach(f => {
    if (f.val) return;
    // Una fascia puo' essere scritta a parole invece che in anni: Opera 60 ha
    // i neonati in **mesi** ("0-11 mesi"), che e' il dato vero dell'ufficio.
    // Li' il confronto numerico non si puo' fare: si avvisa e si tira dritto,
    // invece di chiedere di storpiare il dato per far contento il controllo.
    const aParole = typeof f.testo === "object" || /[a-z]/i.test(String(f.testo));
    if (aParole) avviso(t.id, 'la fascia "' + f.nome + '" non e\' in anni: ' +
      "il confronto con le altre non si puo' fare a macchina, controllala a mano.");
    else errore(t.id, 'fascia "' + f.nome + '" illeggibile: "' + f.testo + '"');
  });

  const buone = scritte.filter(f => f.val);
  for (let i = 0; i < buone.length - 1; i++) {
    const bassa = buone[i].val, alta = buone[i + 1].val;
    if (alta.da > bassa.a + 1) {
      // Il buco puo' essere di piu' di un anno: va detto tutto, se no si
      // corregge solo il primo e il controllo riparte a lamentarsi.
      const scoperti = alta.da - bassa.a - 1 === 1
        ? "Chi ha " + (bassa.a + 1) + " anni"
        : "Chi ha da " + (bassa.a + 1) + " a " + (alta.da - 1) + " anni";
      errore(t.id, "buco d'eta': " + buone[i].nome + ' "' + buone[i].testo + '" finisce a ' +
        bassa.a + " e " + buone[i + 1].nome + ' "' + buone[i + 1].testo + '" comincia a ' +
        alta.da + ". " + scoperti + " non sta in nessuna fascia.");
    }
    if (alta.da <= bassa.a) {
      errore(t.id, "fasce sovrapposte: " + buone[i].nome + ' "' + buone[i].testo + '" e ' +
        buone[i + 1].nome + ' "' + buone[i + 1].testo + '" contengono tutte e due i ' +
        alta.da + " anni. Non si sa quale prezzo paghino.");
    }
  }
}

// ─── 2. Prezzi coerenti con le fasce ───────────────────────────────────────
// `priceInfant: 0` vuol dire "i neonati non pagano". Se non c'e' nessun campo,
// vuol dire "non lo sappiamo" oppure "non si sale": due cose diverse dal
// gratis, e per questo il campo non si mette a caso.
// Il totale della richiesta usa solo priceAdult e priceChild: `price` da solo
// puo' essere il prezzo di tutta la barca, non di una persona.
function controllaPrezzi(t) {
  if (t.priceChild > 0 && !(t.priceAdult > 0) && !varianti(t).some(v => v.priceAdult > 0)) {
    errore(t.id, "c'e' il prezzo bambini (€" + t.priceChild + ") ma non quello adulti: " +
      "il totale della richiesta verrebbe sbagliato.");
  }
  if (t.priceInfant !== undefined && !(t.ages && t.ages.infant)) {
    errore(t.id, "ha priceInfant ma nessuna fascia ages.infant: non si sa fino a che eta' vale.");
  }
  if (t.ages && t.ages.infant && t.priceInfant === undefined) {
    avviso(t.id, 'ha la fascia neonati "' + t.ages.infant + '" ma nessun priceInfant: ' +
      "in pagina non compare nessuna riga per loro.");
  }
  if (t.priceAdult > 0 && t.ages && !t.ages.adult) {
    avviso(t.id, "ha il prezzo adulti ma nessuna fascia ages.adult.");
  }
}

// ─── 3. Le sigle dei giorni devono esistere ────────────────────────────────
// `mar` e' martedi' e `mer` e' mercoledi'. Scambiarle e' facilissimo e non se
// ne accorgerebbe nessuno: la scheda direbbe semplicemente il giorno sbagliato.
function controllaGiorni(t) {
  const guarda = (giorni, dove) => {
    if (giorni === undefined) return;
    if (!Array.isArray(giorni)) return errore(t.id, dove + ": `days` non e' una lista.");
    giorni.forEach(g => {
      if (GIORNI_SIGLE[g] === undefined) {
        errore(t.id, dove + ': giorno sconosciuto "' + g + '". Valide: ' +
          Object.keys(GIORNI_SIGLE).join(" "));
      }
    });
    if (giorni.length === 7) {
      avviso(t.id, dove + ": elenca tutti e sette i giorni. Se si fa sempre, " +
        "il campo `days` va tolto, se no la pagina mostra una limitazione che non c'e'.");
    }
    if (giorni.length === 0) {
      errore(t.id, dove + ": `days` vuoto vuol dire che non si fa mai in nessun giorno.");
    }
    const doppi = giorni.filter((g, i) => giorni.indexOf(g) !== i);
    if (doppi.length) errore(t.id, dove + ": giorno ripetuto (" + doppi.join(", ") + ").");
  };
  guarda(t.days, "scheda");
  varianti(t).forEach((v, i) => guarda(v.days, "variante " + (i + 1)));
}

// ─── 4. Gli orari ──────────────────────────────────────────────────────────
// Tre stati con tre significati: pieno = partenze vere, [] = charter (l'ora si
// concorda), assente = non le sappiamo ancora.
function controllaOrari(t) {
  const guarda = (orari, dove) => {
    if (orari === undefined) return;
    if (!Array.isArray(orari)) return errore(t.id, dove + ": `times` non e' una lista.");
    orari.forEach(o => {
      if (typeof o !== "string" || !/^\d{1,2}:\d{2}( *- *\d{1,2}:\d{2})?$/.test(o)) {
        errore(t.id, dove + ': orario scritto male: "' + o + '" (atteso "10:00" o "10:00 - 13:00").');
      }
    });
    const doppi = orari.filter((o, i) => orari.indexOf(o) !== i);
    if (doppi.length) errore(t.id, dove + ": orario ripetuto (" + doppi.join(", ") + ").");
  };
  guarda(t.times, "scheda");
  varianti(t).forEach((v, i) => guarda(v.times, "variante " + (i + 1)));
}

// ─── 5. Ogni parola in `included` deve avere la sua icona ──────────────────
// Una parola sconosciuta non da' errore in pagina: viene saltata in silenzio.
// Quindi senza questo controllo il riquadro perde una voce e nessuno lo sa.
function controllaIncluse(t) {
  const guarda = (parole, dove) => {
    if (parole === undefined) return;
    if (!Array.isArray(parole)) return errore(t.id, dove + ": `included` non e' una lista.");
    parole.forEach(p => {
      if (!ICONE.has(p)) {
        errore(t.id, dove + ': "' + p + '" non ha un\'icona in INCLUDED_ICONS (tour.js), ' +
          "quindi in pagina sparisce senza dire niente.");
      }
    });
    const doppi = parole.filter((p, i) => parole.indexOf(p) !== i);
    if (doppi.length) errore(t.id, dove + ": voce ripetuta (" + doppi.join(", ") + ").");
  };
  guarda(t.included, "scheda");
  varianti(t).forEach((v, i) => guarda(v.included, "variante " + (i + 1)));
}

// ─── 6. Le foto citate devono esistere ─────────────────────────────────────
function controllaFoto(t) {
  if (!t.image) {
    if (t.published) avviso(t.id, "pubblicata senza foto: in elenco esce il riquadro grigio.");
    return;
  }
  if (!FOTO.has(t.image)) {
    errore(t.id, 'la foto "' + t.image + '" non esiste in assets/.');
  }
}

// ─── 7. I testi tradotti devono avere tutte e tre le lingue ────────────────
// Una stringa da sola va bene: vuol dire "uguale in tutte le lingue" (i nomi
// propri). Ma se e' un oggetto, le tre lingue ci devono essere tutte, se no il
// cliente spagnolo si trova una riga vuota.
function controllaTraduzioni(t) {
  const guarda = (valore, dove) => {
    if (valore === undefined || valore === null) return;
    if (typeof valore === "string") return;
    if (Array.isArray(valore)) return valore.forEach((v, i) => guarda(v, dove + "[" + i + "]"));
    if (typeof valore !== "object") return;
    // e' un oggetto tradotto solo se ha almeno una delle tre chiavi
    if (!LINGUE.some(l => l in valore)) return;
    LINGUE.forEach(l => {
      if (!valore[l] || !String(valore[l]).trim()) {
        errore(t.id, dove + ": manca la lingua " + l + ".");
      }
    });
  };
  ["title", "zone", "duration", "desc", "season", "transfer", "transferLabel",
   "transferPriceLabel", "transferSiam", "transferSiamLabel", "transferSiamPriceLabel"]
    .forEach(c => guarda(t[c], c));
  guarda(t.notes, "notes");
  guarda(t.menus, "menus");
  guarda(t.itinerary, "itinerary");
  varianti(t).forEach((v, i) => {
    ["label", "desc"].forEach(c => guarda(v[c], "variante " + (i + 1) + "." + c));
  });
}

// ─── 8. Le cose di base di una scheda pubblicata ───────────────────────────
function controllaBase(t) {
  if (!t.id) return errore("(senza id)", "scheda senza id.");
  if (!t.category) errore(t.id, "senza categoria.");
  else if (!CATEGORIE.has(t.category)) errore(t.id, 'categoria inesistente: "' + t.category + '".');
  if (!t.title) errore(t.id, "senza titolo.");
  if (t.published && !t.desc) avviso(t.id, "pubblicata senza descrizione.");
  if (t.privateOption && !ESPLORA_CATALOG.some(x => x.id === t.privateOption)) {
    errore(t.id, 'privateOption punta a "' + t.privateOption + '", che non esiste.');
  }
}

// ─── 9. Nessun id ripetuto ─────────────────────────────────────────────────
function controllaIdUnici() {
  const visti = new Map();
  ESPLORA_CATALOG.forEach(t => {
    if (visti.has(t.id)) errore(t.id, "id ripetuto: due schede hanno lo stesso id.");
    visti.set(t.id, true);
  });
}

// ─── 10. Le chiavi i18n in tutte e tre le lingue ───────────────────────────
function controllaI18n() {
  // Fino a fine riga, non fino alla prima "}": le chiavi con segnaposto come
  // "da €{p}" chiudono una graffa a meta' valore e troncherebbero il confronto.
  const righe = sorgenteI18n.matchAll(/^\s*"([a-zA-Z0-9._-]+)":\s*\{(.*)$/gm);
  for (const r of righe) {
    LINGUE.forEach(l => {
      if (!new RegExp("\\b" + l + ":").test(r[2])) {
        errore("i18n", 'la chiave "' + r[1] + '" non ha la lingua ' + l + ".");
      }
    });
  }
}

// ─── 11. La cache del service worker ───────────────────────────────────────
// Se non si alza il numero, chi ha gia' visitato il sito continua a vedere la
// versione vecchia: la modifica c'e' ma non la vede nessuno.
//
// Il confronto e' con `origin/main` (o `main`, o il commit precedente se non
// c'e' nessuno dei due): e' il punto in cui questo branch si e' staccato,
// quindi quello che e' cambiato da li' in poi e' cambiato per questa
// consegna. Nessuno stato salvato su disco: in un clone nuovo (ogni sessione
// remota parte cosi') un file del genere non avrebbe memoria di niente e il
// controllo passerebbe sempre al primo colpo. Con git invece la base c'e'
// sempre, anche al primo lancio.
function controllaServiceWorker() {
  const nome = (sorgenteSw.match(/CACHE_NAME = "([^"]+)"/) || [])[1];
  if (!nome) return errore("sw.js", "non trovo CACHE_NAME.");
  console.log("  cache del service worker: " + nome +
    "  (da alzare a ogni modifica di file .js, .css o .html)");

  if (git(["rev-parse", "--is-inside-work-tree"]) !== "true") return;
  const base = git(["merge-base", "HEAD", "origin/main"]) ||
               git(["merge-base", "HEAD", "main"]) ||
               git(["rev-parse", "HEAD~1"]);
  if (!base) return;

  const cambiati = FILE_IN_CACHE.filter(f => differisce(base, f));
  if (!cambiati.length) return;

  const swBase = git(["show", base + ":sw.js"]) || "";
  const nomeBase = (swBase.match(/CACHE_NAME = "([^"]+)"/) || [])[1];
  if (nomeBase && nomeBase === nome) {
    errore("sw.js", "hai modificato " + cambiati.join(", ") + " ma CACHE_NAME e' rimasto \"" +
      nome + "\" (uguale a " + base.slice(0, 7) + "): chi ha gia' visitato il sito " +
      "continuerebbe a vedere la versione vecchia. Alza il numero in sw.js.");
  }
}

// ─── Esecuzione ────────────────────────────────────────────────────────────
const CONTROLLI = [controllaBase, controllaEta, controllaPrezzi, controllaGiorni,
                   controllaOrari, controllaIncluse, controllaFoto, controllaTraduzioni];

console.log("\nControllo del catalogo Isla\n");
ESPLORA_CATALOG.forEach(t => CONTROLLI.forEach(c => c(t)));
controllaIdUnici();
controllaI18n();
controllaServiceWorker();

const pubblicate = ESPLORA_CATALOG.filter(t => t.published).length;
console.log("  schede: " + ESPLORA_CATALOG.length + ", di cui pubblicate " + pubblicate);
console.log("  icone disponibili: " + ICONE.size + ", foto in assets: " + FOTO.size + "\n");

const stampa = (titolo, lista) => {
  if (!lista.length) return;
  console.log(titolo);
  lista.forEach(v => console.log("  " + v.dove + "\n      " + v.testo));
  console.log("");
};

stampa("AVVISI (da guardare, non bloccano):", avvisi);
stampa("ERRORI (da correggere):", errori);

if (!errori.length && !avvisi.length) console.log("Tutto a posto.\n");
else console.log(errori.length + " errori, " + avvisi.length + " avvisi.\n");

process.exit(errori.length ? 1 : 0);

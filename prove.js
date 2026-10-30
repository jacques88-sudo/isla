// Le prove dei calcoli che costano cari se si rompono: totali, sconto, 24 ore,
// pagine offline, dati del trasloco. Si lancia con:
//
//     node prove.js
//
// Non serve niente di installato. Esce con codice 1 se una prova non passa.
// controlla.js guarda i dati del catalogo; qui si guarda il codice che li usa.
// Il sito non carica questo file.

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const leggi = f => fs.readFileSync(path.join(__dirname, f), "utf8");

// I file sono scritti per il browser: quello che chiedono al browser mentre si
// caricano si finge qui, e t(), tf() ed eur() come in controlla.js.
global.document = { addEventListener() {}, getElementById: () => null, querySelector: () => null };
global.window = { addEventListener() {} };
global.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
global.t = chiave => chiave;
global.tf = campo => (typeof campo === "string" ? campo : (campo && campo.it) || "");
global.eur = n => String(n);

const comeVar = f => leggi(f).replace(/^(const|let) /gm, "var ");
eval(comeVar("esplora-catalog.js"));
eval(comeVar("escursioni.js"));
eval(comeVar("pacchetti.js"));
eval(comeVar("lista.js"));

let fallite = 0;
async function prova(nome, f) {
  try {
    await f();
    console.log("  ok   " + nome);
  } catch (e) {
    fallite++;
    console.log("  NO   " + nome + "\n       " + e.message);
  }
}

// La scheda piu' semplice che calcolaTotale capisce.
const barca = (altro) => Object.assign({ priceAdult: 50, priceChild: 25 }, altro);
const richiesta = (altro) => Object.assign({ adults: 2, kids: 0, babies: 0 }, altro);

(async () => {
  console.log("\nProve di Isla\n");

  await prova("il totale conta adulti e bambini", () => {
    assert.strictEqual(calcolaTotale(barca(), richiesta({ kids: 1 })).totale, 125);
  });
  await prova("bambini senza il loro prezzo: niente totale, mai un numero falso", () => {
    assert.strictEqual(calcolaTotale({ priceAdult: 50 }, richiesta({ kids: 1 })), null);
  });
  await prova("priceInfant assente: non lo sappiamo, niente totale", () => {
    assert.strictEqual(calcolaTotale(barca(), richiesta({ babies: 1 })), null);
  });
  await prova("priceInfant 0: i neonati non pagano", () => {
    assert.strictEqual(calcolaTotale(barca({ priceInfant: 0 }), richiesta({ babies: 1 })).totale, 100);
  });
  await prova("price da solo (prezzo della barca) non si moltiplica per le persone", () => {
    assert.strictEqual(calcolaTotale({ price: 500 }, richiesta()), null);
  });

  await prova("lo sconto vale sulle escursioni e non sui parchi", () => {
    const conPrezzo = t => t.published && !t.units && t.priceAdult > 0 && !t.options;
    const singola = ESPLORA_CATALOG.find(t => conPrezzo(t) && scontoPossibile(t, null));
    const parco = ESPLORA_CATALOG.find(t => conPrezzo(t) && !scontoPossibile(t, null));
    assert.ok(singola && parco, "servono una scheda con sconto e una senza");
    listaCodice = { codice: "PROVA", percento: 5 };
    const voce = t => ({ id: t.id, adults: 2, kids: 0, babies: 0 });
    const atteso = Math.round(calcolaTotale(singola, voce(singola)).totale * 5) / 100;
    assert.strictEqual(listaSconto([voce(singola)]), atteso);
    assert.strictEqual(listaSconto([voce(parco)]), 0);
    assert.strictEqual(listaSconto([voce(singola), voce(parco)]), atteso);
    listaCodice = null;
  });

  await prova("ogni pacchetto ha un totale, e due persone costano piu' di una", () => {
    PACCHETTI.forEach(p => {
      const uno = pacchettoTotale(p, 1, 0, null), due = pacchettoTotale(p, 2, 0, null);
      if (!uno || !due) return; // i pacchetti a mezzi vogliono le loro scelte: li guarda controlla.js
      assert.ok(Number.isFinite(uno.totale) && due.totale > uno.totale, p.id);
    });
  });

  // Le 24 ore si contano sull'ora di Tenerife, da qualunque fuso si prenoti.
  const fra = ore => {
    const d = new Date(adessoTenerife() + ore * 60 * 60 * 1000);
    return [d.toISOString().slice(0, 10), d.toISOString().slice(11, 16)];
  };
  for (const fuso of ["Atlantic/Canary", "Europe/Rome", "America/New_York", "Asia/Tokyo"]) {
    process.env.TZ = fuso;
    await prova("24 ore da " + fuso, () => {
      assert.strictEqual(partenzaPossibile(...fra(23)), false, "23 ore prima non si puo'");
      assert.strictEqual(partenzaPossibile(...fra(25)), true, "25 ore prima si puo'");
      assert.strictEqual(minRequestDate(), fra(24)[0]);
    });
  }
  delete process.env.TZ;

  // Le partenze di stagione: le 9:30 di Royal Delfin, primo e ultimo giorno compresi.
  await prova("una partenza fuori stagione non si puo' chiedere", () => {
    const tour = ESPLORA_CATALOG.find(x => x.id === "royal-delfin");
    const lungo = tour.options.choices.find(c => c.timesSeason);
    const c = iso => orarioInStagione(tour, lungo, "09:30", iso);
    assert.deepStrictEqual(["2027-07-10", "2027-07-11", "2027-09-05", "2027-09-06"].map(c), [false, true, true, false]);
    assert.strictEqual(orarioInStagione(tour, lungo, "14:00", "2027-11-12"), true, "le 14:00 ci sono sempre");
    assert.strictEqual(orarioInStagione(tour, lungo, "09:30", ""), true, "senza giorno non si toglie");
    const inverno = { timesSeason: { "10:00": ["12-01", "02-28"] } };
    assert.deepStrictEqual(["2027-12-15", "2027-01-15", "2027-06-15"].map(i => orarioInStagione(inverno, null, "10:00", i)), [true, true, false]);
  });

  // Le pagine col "?" si aprono anche senza rete.
  await prova("offline: ticket e schede si aprono dalla cache", async () => {
    const SITO = "https://islaexcursionstenerife.com/";
    const pagine = ["booking.html", "tour.html", "offline.html"];
    const ascolta = {};
    const finto = {
      self: { addEventListener: (n, f) => { ascolta[n] = f; } }, URL, Promise,
      fetch: () => Promise.reject(new Error("niente rete")),
      caches: { match: async (r, o) => {
        const u = new URL(typeof r === "string" ? r : r.url, SITO);
        const trovata = pagine.find(p => "/" + p === u.pathname);
        return trovata && (o && o.ignoreSearch || !u.search) ? trovata : undefined;
      } }
    };
    vm.runInNewContext(leggi("sw.js"), finto);
    const chiedi = p => new Promise(fatto => ascolta.fetch({
      request: { method: "GET", url: SITO + p, mode: "navigate" }, respondWith: fatto
    }));
    assert.strictEqual(await chiedi("booking.html?code=2213"), "booking.html");
    assert.strictEqual(await chiedi("tour.html?id=royal-delfin&lang=de"), "tour.html");
    assert.strictEqual(await chiedi("altra.html"), "offline.html");
  });

  // Il falso "Paga ora": i dati del trasloco si accettano solo dal vecchio indirizzo.
  const trasloco = referrer => {
    const salvati = {};
    vm.runInNewContext(leggi("trasloco.js"), {
      location: { hostname: "islaexcursionstenerife.com", pathname: "/booking.html", search: "",
                  hash: "#trasloco=" + encodeURIComponent(JSON.stringify({ "isla-richieste": "[]" })) },
      history: { replaceState() {} }, document: { referrer }, JSON, Set, encodeURIComponent, decodeURIComponent,
      localStorage: { getItem: k => (k in salvati ? salvati[k] : null), setItem: (k, v) => { salvati[k] = v; } }
    });
    return salvati;
  };
  await prova("trasloco: un link qualsiasi non scrive nel telefono", () => {
    assert.deepStrictEqual(trasloco(""), {});
    assert.deepStrictEqual(trasloco("https://truffa.example/"), {});
    assert.deepStrictEqual(trasloco("https://jacques88-sudo.github.io.truffa.example/"), {});
  });
  await prova("trasloco: dal vecchio indirizzo i dati passano", () => {
    assert.deepStrictEqual(trasloco("https://jacques88-sudo.github.io/"), { "isla-richieste": "[]" });
  });

  console.log(fallite ? "\n" + fallite + " prove non passate.\n" : "\nTutte passate.\n");
  process.exit(fallite ? 1 : 0);
})();

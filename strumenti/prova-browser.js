// LA PROVA NEL BROWSER VERO: apre ogni pagina di Isla in Chromium, con lo
// schermo di un telefono, e dice dove qualcosa si rompe.
//
//     node strumenti/prova-browser.js          tutte le pagine (meno di due minuti)
//     node strumenti/prova-browser.js tour     solo quelle col nome che contiene "tour"
//
// Esce con 1 se trova un errore. La lancia anche GitHub a ogni PR, insieme a
// controlla.js e prove.js (.github/workflows/controlla.yml). Il sito non la carica.
//
// Perché c'è (6 novembre 2026): `node --check` guarda solo come è scritto il
// codice. Non vede un `null`, una variabile usata prima di esistere, un elemento
// che su quella pagina non c'è, una foto col nome sbagliato. Questi si vedono
// solo aprendo la pagina. Prima questa prova si riscriveva a mano ogni volta.
//
// Cosa guarda, pagina per pagina:
//   - gli errori JavaScript (quelli che in Chrome escono rossi nella console);
//   - i file del sito che non si trovano (script, stili, foto: risposta 404);
//   - le foto caricate che non si vedono (file rotto o non è una foto).
//
// Le pagine le prende da sitemap.xml (una per indirizzo, senza le lingue): una
// scheda o un pacchetto nuovo entra nella prova da solo, dopo
// `node strumenti/sitemap.js`. In più le pagine che Google non vede (booking,
// link, offline) e la home nelle cinque lingue.
//
// Fuori dal sito non si va: Supabase, AEMET, Cloudflare e i caratteri di Google
// vengono bloccati, così la prova dà sempre lo stesso risultato, anche senza
// rete. Le pagine devono reggere lo stesso (come chi ha poca rete in hotel):
// un errore JavaScript per colpa della rete mancante è un errore vero.
//
// Chromium: qui lo prende da Playwright già installato (NODE_PATH=$(npm root -g)
// se non lo trova); su GitHub lo installa il workflow.

const http = require("http");
const fs = require("fs");
const path = require("path");

// Lo script sta in strumenti/: il sito è nella cartella sopra.
const RADICE = path.join(__dirname, "..");

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch (e) {
  console.error("Non trovo Playwright. Lancia così:\n" +
    "  NODE_PATH=$(npm root -g) node strumenti/prova-browser.js");
  process.exit(1);
}

// ─── Un piccolo server per il sito, come GitHub Pages ───────────────────────
const TIPI = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json",
  ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".gif": "image/gif", ".ico": "image/x-icon",
  ".mp4": "video/mp4", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml",
  ".pdf": "application/pdf", ".woff2": "font/woff2",
};

function server() {
  return http.createServer((req, res) => {
    let file = decodeURIComponent(req.url.split("?")[0]);
    if (file.endsWith("/")) file += "index.html";
    const vero = path.join(RADICE, path.normalize(file));
    if (!vero.startsWith(RADICE) || !fs.existsSync(vero) || fs.statSync(vero).isDirectory()) {
      res.writeHead(404); return res.end("non trovato");
    }
    res.writeHead(200, { "Content-Type": TIPI[path.extname(vero).toLowerCase()] || "application/octet-stream" });
    fs.createReadStream(vero).pipe(res);
  });
}

// ─── Le pagine da aprire ────────────────────────────────────────────────────
function pagine() {
  const xml = fs.readFileSync(path.join(RADICE, "sitemap.xml"), "utf8");
  const dalla = [...xml.matchAll(/<loc>https:\/\/islaexcursionstenerife\.com\/([^<]*)<\/loc>/g)]
    .map(m => m[1].replace(/&amp;/g, "&"))
    .filter(u => !/[?&]lang=/.test(u));
  const lingue = ["it", "en", "es", "fr", "de"].map(l => "index.html?lang=" + l);
  const altre = ["booking.html", "booking.html?richieste=1", "link.html", "offline.html"];
  const tutte = [...new Set([...dalla.map(u => u || "index.html"), ...lingue, ...altre])];
  const filtro = process.argv[2];
  return filtro ? tutte.filter(u => u.includes(filtro)) : tutte;
}

// ─── La prova ───────────────────────────────────────────────────────────────
(async () => {
  const srv = server();
  await new Promise(r => srv.listen(0, "127.0.0.1", r));
  const BASE = "http://127.0.0.1:" + srv.address().port + "/";

  const browser = await chromium.launch();
  // Un telefono qualunque, e niente service worker: la prova vuole i file di
  // adesso, non quelli in cache.
  const contesto = await browser.newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    serviceWorkers: "block",
  });
  await contesto.route("**/*", rotta => {
    rotta.request().url().startsWith(BASE) ? rotta.continue() : rotta.abort();
  });

  const elenco = pagine();
  const problemi = [];
  let aperte = 0;

  for (const indirizzo of elenco) {
    const pagina = await contesto.newPage();
    const qui = [];
    pagina.on("pageerror", e => qui.push("errore JavaScript: " + e.message.split("\n")[0]));
    pagina.on("response", r => {
      if (r.url().startsWith(BASE) && r.status() >= 400) {
        qui.push("file che non c'è (" + r.status() + "): " + r.url().slice(BASE.length));
      }
    });
    try {
      await pagina.goto(BASE + indirizzo, { waitUntil: "load", timeout: 30000 });
      // Un attimo per gli script che partono dopo il caricamento (splash, liste).
      await pagina.waitForTimeout(800);
      const rotte = await pagina.evaluate(() =>
        [...document.images]
          .filter(i => i.complete && i.naturalWidth === 0 && i.currentSrc.startsWith(location.origin))
          .map(i => i.currentSrc.slice(location.origin.length + 1)));
      for (const f of rotte) qui.push("foto che non si vede: " + f);
      aperte++;
    } catch (e) {
      qui.push("la pagina non si apre: " + e.message.split("\n")[0]);
    }
    await pagina.close();
    for (const p of [...new Set(qui)]) problemi.push(indirizzo + "\n    " + p);
  }

  await browser.close();
  srv.close();

  console.log("Prova nel browser: " + aperte + " pagine aperte su " + elenco.length + ".");
  if (problemi.length) {
    console.log("\n" + problemi.length + " problemi:\n");
    for (const p of problemi) console.log("  " + p);
    process.exit(1);
  }
  console.log("Nessun errore.");
})().catch(e => { console.error(e); process.exit(1); });

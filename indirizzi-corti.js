// GLI INDIRIZZI CORTI DELLE ESCURSIONI: islaexcursionstenerife.com/freebird
//
// Si rifanno con
//
//     node indirizzi-corti.js
//
// dopo aver aggiunto o cambiato una riga qui sotto. Il sito non carica questo file.
//
// Servono dove l'indirizzo lungo (tour.html?id=freebird-catamaran) non si
// ricorda e non sta bene: nel testo di un post su Facebook, detto a voce in un
// video, mandato su WhatsApp, stampato (proprietario, 26 ottobre 2026).
//
// Ognuno e' una cartella con dentro un index.html che porta subito alla scheda.
// E' una pagina vera e non un rimando del server (GitHub Pages non li fa), cosi'
// puo' portare titolo e foto della scheda: Facebook e WhatsApp, quando si
// incolla l'indirizzo, mostrano l'anteprima con la foto. Ha `noindex` e il
// canonical sulla scheda: per Google la pagina e' la scheda, non questa.
// Le cartelle si scrivono da sole: non si correggono a mano.
//
// Un nome corto: minuscole, numeri e trattini, e non deve essere gia' un file o
// una cartella del sito (assets, ticket…). Lo script lo controlla.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

// nome corto → id della scheda (quello di tour.html?id=…)
const INDIRIZZI_CORTI = {
  freebird: "freebird-catamaran"
};

const SITO = "https://islaexcursionstenerife.com";
// Le cartelle che il sito ha gia': un nome corto uguale le coprirebbe.
const RISERVATI = ["assets", "dati-fornitore", "documenti", "foglio-google", "stampa",
  "supabase", "ticket", "vendor", "node_modules"];
const SEGNO = "<!-- indirizzo corto: lo scrive indirizzi-corti.js -->";

function catalogo() {
  const ctx = { t: k => k, tf: c => (typeof c === "string" ? c : (c && c.it) || ""), eur: String };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "esplora-catalog.js"), "utf8") + ";this.C = ESPLORA_CATALOG;", ctx);
  return { schede: ctx.C, tf: ctx.tf };
}

const attr = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// La prima frase della descrizione in italiano: per l'anteprima basta.
function primaFrase(testo) {
  const m = String(testo || "").match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : String(testo || "")).trim();
}

function pagina(corto, tour, tf) {
  const scheda = "tour.html?id=" + encodeURIComponent(tour.id);
  const titolo = tf(tour.title) + " · Isla Tenerife";
  return `<!doctype html>
${SEGNO}
<html lang="it">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>${attr(titolo)}</title>
  <link rel="canonical" href="${SITO}/${scheda}" />
  <meta property="og:title" content="${attr(titolo)}" />
  <meta property="og:description" content="${attr(primaFrase(tf(tour.desc)))}" />
  <meta property="og:image" content="${SITO}/assets/${encodeURIComponent(tour.image)}" />
  <meta property="og:type" content="website" />
  <meta http-equiv="refresh" content="0; url=../${scheda}" />
  <script>
    // Porta alla scheda tenendo quello che c'e' dopo "?" (per esempio ?lang=de).
    location.replace("../${scheda}" + location.search.replace(/^\\?/, "&"));
  </script>
</head>
<body>
  <p><a href="../${scheda}">${attr(tf(tour.title))}</a></p>
</body>
</html>
`;
}

function main() {
  const { schede, tf } = catalogo();
  let errori = 0;
  const errore = msg => { console.error("ERRORE: " + msg); errori++; };

  for (const [corto, id] of Object.entries(INDIRIZZI_CORTI)) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(corto)) errore(`"${corto}": solo minuscole, numeri e trattini`);
    if (RISERVATI.includes(corto)) errore(`"${corto}" e' gia' una cartella del sito`);
    const tour = schede.find(t => t.id === id);
    if (!tour) errore(`"${corto}": nel catalogo non c'e' la scheda "${id}"`);
    else if (!tour.published) errore(`"${corto}": la scheda "${id}" non e' pubblicata`);
  }
  if (errori) process.exit(1);

  // Toglie le cartelle degli indirizzi corti che non ci sono piu' nell'elenco:
  // solo quelle col segno di questo script, mai un'altra cartella.
  for (const nome of fs.readdirSync(__dirname)) {
    const file = path.join(__dirname, nome, "index.html");
    if (INDIRIZZI_CORTI[nome] || !fs.existsSync(file)) continue;
    if (fs.readFileSync(file, "utf8").includes(SEGNO)) {
      fs.rmSync(path.join(__dirname, nome), { recursive: true });
      console.log("tolto  /" + nome);
    }
  }

  for (const [corto, id] of Object.entries(INDIRIZZI_CORTI)) {
    const tour = schede.find(t => t.id === id);
    const cartella = path.join(__dirname, corto);
    const file = path.join(cartella, "index.html");
    if (fs.existsSync(file) && !fs.readFileSync(file, "utf8").includes(SEGNO)) {
      console.error(`ERRORE: /${corto}/index.html esiste gia' e non e' un indirizzo corto`);
      process.exit(1);
    }
    fs.mkdirSync(cartella, { recursive: true });
    fs.writeFileSync(file, pagina(corto, tour, tf));
    console.log(`${SITO}/${corto}  →  ${tf(tour.title)}`);
  }
}

if (require.main === module) main();
module.exports = { INDIRIZZI_CORTI, SEGNO };

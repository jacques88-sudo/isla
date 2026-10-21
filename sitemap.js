// La mappa del sito per Google: sitemap.xml. Si rifa' con
//
//     node sitemap.js
//
// dopo ogni scheda o pacchetto nuovo (o tolto). Non va scritta a mano: invecchia.
// `node controlla.js` dice se e' rimasta indietro rispetto al catalogo.
//
// Ogni pagina ha sei indirizzi: uno per lingua (`?lang=it` … `?lang=de`, vedi
// I18N_DA_INDIRIZZO in i18n.js) e quello senza lingua, che sceglie da solo la
// lingua del browser (per Google e' "x-default"). Ognuno dice a Google dove
// sono gli altri cinque (hreflang): cosi' a chi cerca in tedesco esce la
// pagina in tedesco.
// Ci sono solo le pagine che un cliente cerca: niente "Le mie prenotazioni"
// (personale), niente pagina offline, niente pacchetti su misura (infiniti).

const fs = require("fs");
const vm = require("vm");

const SITO = "https://islaexcursionstenerife.com";
const LINGUE = ["it", "en", "es", "fr", "de"];

function pagine() {
  const ctx = { t: k => k, tf: c => (typeof c === "string" ? c : (c && c.it) || ""), eur: String };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(__dirname + "/esplora-catalog.js", "utf8") + ";this.C = ESPLORA_CATALOG;", ctx);
  vm.runInContext(fs.readFileSync(__dirname + "/pacchetti.js", "utf8") + ";this.P = PACCHETTI;", ctx);
  return [
    "", "escursioni.html", "pacchetti.html", "pacchetti.html?famiglia=1",
    "pacchetti.html?giorni=3", "pacchetti.html?giorni=5", "pacchetti.html?giorni=7",
    "noleggio.html", "mappa.html", "privacy.html", "termini.html"
  ]
    .concat(ctx.C.filter(t => t.published).map(t => "tour.html?id=" + encodeURIComponent(t.id)))
    .concat(ctx.P.map(p => "pacchetto.html?id=" + encodeURIComponent(p.id)));
}

const conLingua = (pagina, lang) =>
  SITO + "/" + pagina + (lang ? (pagina.includes("?") ? "&" : "?") + "lang=" + lang : "");
const xml = s => s.replace(/&/g, "&amp;");

function sitemapTesto() {
  const righe = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
  ];
  pagine().forEach(pagina => {
    const alternative = LINGUE.map(l =>
      `    <xhtml:link rel="alternate" hreflang="${l}" href="${xml(conLingua(pagina, l))}"/>`)
      .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${xml(conLingua(pagina, ""))}"/>`);
    [""].concat(LINGUE).forEach(l => {
      righe.push("  <url>", `    <loc>${xml(conLingua(pagina, l))}</loc>`, ...alternative, "  </url>");
    });
  });
  righe.push("</urlset>", "");
  return righe.join("\n");
}

module.exports = { sitemapTesto };

if (require.main === module) {
  fs.writeFileSync(__dirname + "/sitemap.xml", sitemapTesto());
  console.log("sitemap.xml: " + pagine().length + " pagine, " + pagine().length * 6 + " indirizzi.");
}

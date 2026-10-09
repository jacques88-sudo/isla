// Quali schede non hanno ancora gli orari di partenza veri.
//
//   node orari-mancanti.js
//
// Non e' un controllo (non esce mai con errore) e il sito non lo carica: e' la
// lista di lavoro per il proprietario, che gli orari li manda una scheda alla
// volta. Si rifa' a ogni lancio leggendo il catalogo, cosi' non invecchia come
// farebbe un elenco scritto a mano.
//
// Una scheda (o una sua variante) e':
//   - con orari    → `times` pieno: il cliente sceglie fra le partenze vere
//   - da concordare → `times: []`: charter o noleggio, l'ora si decide insieme
//   - senza orari  → `times` assente: fasce segnaposto e "Da concordare"
// La variante vince sulla scheda, come in pagina.
// Le schede di PICKUP_TIMES (Island Excursions) non mancano di niente: hanno
// l'ora di ritiro hotel per hotel, in hotel.js.
// I parchi nemmeno: sono biglietti d'ingresso, si entra quando si vuole, e il
// proprietario ha deciso il 9 ottobre 2026 che non hanno bisogno di orari. Sono
// le schede di "parchi-spettacoli" senza `times`; gli spettacoli della stessa
// categoria (cena, flamenco…) hanno l'ora vera e restano contati con gli altri.

const fs = require("fs");
const vm = require("vm");

const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + "/esplora-catalog.js", "utf8") + ";this.C = ESPLORA_CATALOG;", ctx);
vm.runInContext(fs.readFileSync(__dirname + "/hotel.js", "utf8") + ";this.P = PICKUP_TIMES;", ctx);

const it = x => typeof x === "string" ? x : (x && x.it) || "";
const stato = (t, c) => {
  const times = c && c.times !== undefined ? c.times : t.times;
  if (times === undefined) return "senza";
  return times.length ? "con" : "concordare";
};

const senza = [], parziali = [];
let con = 0, concordare = 0, ritiro = 0, parchi = 0;

ctx.C.filter(t => t.published).forEach(t => {
  if (ctx.P[t.id]) { ritiro++; return; }
  if (t.category === "parchi-spettacoli" && t.times === undefined) { parchi++; return; }
  const scelte = (t.options && t.options.choices) || [];
  if (!scelte.length) {
    const s = stato(t);
    if (s === "senza") senza.push(t); else if (s === "con") con++; else concordare++;
    return;
  }
  const mancano = scelte.filter(c => stato(t, c) === "senza");
  if (mancano.length === scelte.length) senza.push(t);
  else if (mancano.length) parziali.push({ t, mancano });
  else if (scelte.some(c => stato(t, c) === "con")) con++;
  else concordare++;
});

const riga = t => `  ${t.category.padEnd(18)} ${it(t.title)}  (${t.id})`;

console.log(`\nOrari di partenza nel catalogo\n`);
console.log(`  con gli orari veri: ${con} · da concordare (charter): ${concordare} · ritiro hotel per hotel: ${ritiro} · parchi (non servono): ${parchi}\n`);

console.log(`SENZA ORARI (${senza.length}) — il cliente vede le fasce e "Da concordare":`);
senza.sort((a, b) => a.category.localeCompare(b.category) || it(a.title).localeCompare(it(b.title)))
  .forEach(t => console.log(riga(t)));

console.log(`\nORARI SOLO SU ALCUNE VARIANTI (${parziali.length}):`);
parziali.forEach(({ t, mancano }) => {
  console.log(riga(t));
  console.log(`      senza: ${mancano.map(c => it(c.label)).join(", ")}`);
});
console.log("");

// LE GRAFICHE DEI SOCIAL: dai modelli HTML alle immagini e al video
//
//     NODE_PATH=$(npm root -g) node social/fai-grafiche.js <cartella-di-uscita> [post]
//
// [post] e' la cartella dei modelli dentro social/ (es. "spiagge-sud"); senza,
// si usano i modelli di social/ stesso (il pacchetto coppia).
// Scrive nella cartella (meglio la scratchpad, non il repository):
//   carosello-N.png  feed di Instagram e Facebook, 4:5 (1080x1350), da carosello.html
//                    (le sezioni #s1, #s2, ... finche' ci sono)
//   verticale-N.png  carosello di foto di TikTok, 9:16 (1080x1920), da verticali.html (#t1...)
//   storia-1..2.png  storie con lo spazio per l'adesivo Link, 9:16, da verticali.html (#s1, #s2)
//   reel.mp4         12 secondi dalle verticali, zoom lento e dissolvenze, senza
//                    audio: la musica si mette nell'app (serve ffmpeg)
// Il sito non lo carica. Come si cambiano testi e foto lo dice LEGGIMI.md.

const { chromium } = require("playwright");
const { execFileSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const DURATA = 12;       // secondi del reel
const DISSOLVENZA = 0.5; // secondi di dissolvenza fra una verticale e l'altra
const FPS = 30;

// Fotografa #<prefisso>1, #<prefisso>2, ... finche' ci sono. Con "classe" mette
// quella classe sul body prima (solo-fondo / solo-testo, per il reel).
async function fotografa(pagina, file, prefisso, nome, uscita, classe, sfondoTrasparente) {
  await pagina.goto("file://" + file, { waitUntil: "networkidle" });
  await pagina.evaluate(() => document.fonts.ready);
  if (classe) await pagina.evaluate(c => document.body.classList.add(c), classe);
  const fatti = [];
  for (let i = 1; await pagina.locator(`#${prefisso}${i}`).count(); i++) {
    const out = path.join(uscita, `${nome}-${i}.png`);
    await pagina.locator(`#${prefisso}${i}`).screenshot({ path: out, omitBackground: !!sfondoTrasparente });
    if (!classe) console.log(path.basename(out));
    fatti.push(out);
  }
  return fatti;
}

// Ogni verticale dura quanto serve perche' il reel venga di DURATA secondi, con
// DISSOLVENZA fra una e l'altra. Lo zoom ha un fotogramma solo in ingresso per
// immagine: con l'immagine ripetuta moltiplicava i fotogrammi e il video usciva
// di 205 secondi.
//
// Se il modello segna il testo (classe "t", vedi spiagge-sud/verticali.html),
// zoom e dissolvenza li fa solo il fondo, e il testo di ogni verticale entra
// quando la dissolvenza e' finita ed esce prima della prossima: due scritte non
// si sovrappongono mai. Senza, si dissolve l'immagine intera (come prima).
// "fisso" (facoltativo) e' la testata che resta ferma sopra lo zoom, fino alla
// prima verticale che non ce l'ha (fissoFino, il suo numero da 0): sparisce
// con la dissolvenza verso quella.
function video(uscita, fondi, testi, fisso, fissoFino) {
  const n = fondi.length;
  const slide = (DURATA + (n - 1) * DISSOLVENZA) / n;
  const frames = Math.round(slide * FPS);
  const ingressi = [];
  let filtri = "";
  fondi.forEach((f, i) => {
    ingressi.push("-i", f);
    filtri += `[${i}:v]scale=2160:3840,zoompan=z='min(zoom+0.0006,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=${FPS},setsar=1,format=yuv420p[v${i}];`;
  });
  let prima = "v0";
  for (let i = 1; i < n; i++) {
    const offset = (i * (slide - DISSOLVENZA)).toFixed(3);
    filtri += `[${prima}][v${i}]xfade=transition=fade:duration=${DISSOLVENZA}:offset=${offset}[a${i}];`;
    prima = `a${i}`;
  }
  if (testi) {
    const entra = 0.3; // il testo compare in 0,3 s
    testi.forEach((f, i) => {
      ingressi.push("-loop", "1", "-t", String(DURATA), "-i", f);
      const k = n + i;
      const inizio = i === 0 ? 0.15 : i * (slide - DISSOLVENZA) + DISSOLVENZA;
      const fine = i === n - 1 ? null : (i + 1) * (slide - DISSOLVENZA) - entra;
      filtri += `[${k}:v]format=rgba,fade=in:st=${inizio.toFixed(3)}:d=${entra}:alpha=1` +
        (fine === null ? "" : `,fade=out:st=${fine.toFixed(3)}:d=${entra}:alpha=1`) + `[x${i}];`;
      filtri += `[${prima}][x${i}]overlay=0:0:format=auto[o${i}];`;
      prima = `o${i}`;
    });
  }
  if (fisso) {
    ingressi.push("-loop", "1", "-t", String(DURATA), "-i", fisso);
    const k = ingressi.filter(x => x === "-i").length - 1;
    const via = fissoFino < n ? `,fade=out:st=${(fissoFino * (slide - DISSOLVENZA)).toFixed(3)}:d=${DISSOLVENZA}:alpha=1` : "";
    filtri += `[${k}:v]format=rgba${via}[fx];[${prima}][fx]overlay=0:0:format=auto[fo];`;
    prima = "fo";
  }
  filtri += `[${prima}]format=yuv420p[out]`;
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...ingressi, "-filter_complex", filtri,
    "-map", "[out]", "-t", String(DURATA), "-c:v", "libx264", "-crf", "20", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", "-r", String(FPS), path.join(uscita, "reel.mp4")]);
  console.log("reel.mp4");
}

(async () => {
  const uscita = path.resolve(process.argv[2] || "");
  if (!process.argv[2]) {
    console.error("Manca la cartella di uscita: node social/fai-grafiche.js <cartella> [post]");
    process.exit(1);
  }
  const modelli = path.join(__dirname, process.argv[3] || "");
  fs.mkdirSync(uscita, { recursive: true });
  const browser = await chromium.launch();
  const pagina = await browser.newPage({ viewport: { width: 1200, height: 2000 } });
  const carosello = path.join(modelli, "carosello.html");
  const verticali = path.join(modelli, "verticali.html");
  await fotografa(pagina, carosello, "s", "carosello", uscita);
  const tutte = await fotografa(pagina, verticali, "t", "verticale", uscita);
  await fotografa(pagina, verticali, "s", "storia", uscita);

  // Il reel: a strati se il modello segna il testo, altrimenti dalle verticali intere.
  await pagina.goto("file://" + verticali, { waitUntil: "networkidle" });
  const aStrati = await pagina.locator(".v .t").count() > 0;
  let fondi = tutte, testi = null;
  if (aStrati) {
    const tmp = fs.mkdtempSync(path.join(uscita, "reel-"));
    fondi = await fotografa(pagina, verticali, "t", "fondo", tmp, "solo-fondo");
    testi = await fotografa(pagina, verticali, "t", "testo", tmp, "solo-testo", true);
    // la testata ferma: si prende dalla prima verticale, se ce l'ha
    const conFisso = await pagina.evaluate(() =>
      [...document.querySelectorAll("section.v[id^=t]")].map(s => !!s.querySelector(".fisso")));
    let fisso = null, fissoFino = conFisso.length;
    if (conFisso[0]) {
      fisso = (await fotografa(pagina, verticali, "t", "fisso", tmp, "solo-fisso", true))[0];
      fissoFino = conFisso.indexOf(false);
      if (fissoFino < 0) fissoFino = conFisso.length;
    }
    video(uscita, fondi, testi, fisso, fissoFino);
    fs.rmSync(tmp, { recursive: true, force: true });
  } else {
    video(uscita, fondi, null);
  }
  await browser.close();
})();

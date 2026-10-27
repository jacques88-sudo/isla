// LE GRAFICHE DEI SOCIAL: dai modelli HTML alle immagini e al video
//
//     NODE_PATH=$(npm root -g) node social/fai-grafiche.js <cartella-di-uscita>
//
// Scrive nella cartella (meglio la scratchpad, non il repository):
//   carosello-1..5.png  feed di Instagram e Facebook, 4:5 (1080x1350), da carosello.html
//   verticale-1..5.png  carosello di foto di TikTok, 9:16 (1080x1920), da verticali.html
//   storia-1..2.png     storie con lo spazio per l'adesivo Link, 9:16, da verticali.html
//   reel.mp4            12 secondi dalle 5 verticali, zoom lento e dissolvenze, senza
//                       audio: la musica si mette nell'app (serve ffmpeg)
// Il sito non lo carica. Come si cambiano testi e foto lo dice LEGGIMI.md.

const { chromium } = require("playwright");
const { execFileSync } = require("child_process");
const path = require("path");
const fs = require("fs");

async function fotografa(pagina, file, sezioni, uscita) {
  await pagina.goto("file://" + path.join(__dirname, file), { waitUntil: "networkidle" });
  await pagina.evaluate(() => document.fonts.ready);
  for (const [id, nome] of sezioni) {
    if (await pagina.locator("#" + id).count()) {
      await pagina.locator("#" + id).screenshot({ path: path.join(uscita, nome) });
      console.log(nome);
    }
  }
}

// Ogni verticale dura 2,8 s (84 fotogrammi a 30 al secondo), con mezzo secondo di
// dissolvenza fra una e l'altra: 5 × 2,8 − 4 × 0,5 = 12 s. Lo zoom ha un fotogramma
// solo in ingresso per immagine: con l'immagine ripetuta moltiplicava i fotogrammi
// e il video usciva di 205 secondi.
function video(uscita) {
  const ingressi = [];
  let filtri = "";
  for (let i = 1; i <= 5; i++) {
    ingressi.push("-i", path.join(uscita, `verticale-${i}.png`));
    filtri += `[${i - 1}:v]scale=2160:3840,zoompan=z='min(zoom+0.0006,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=84:s=1080x1920:fps=30,setsar=1,format=yuv420p[v${i}];`;
  }
  filtri += "[v1][v2]xfade=transition=fade:duration=0.5:offset=2.3[a1];" +
    "[a1][v3]xfade=transition=fade:duration=0.5:offset=4.6[a2];" +
    "[a2][v4]xfade=transition=fade:duration=0.5:offset=6.9[a3];" +
    "[a3][v5]xfade=transition=fade:duration=0.5:offset=9.2[out]";
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...ingressi, "-filter_complex", filtri,
    "-map", "[out]", "-c:v", "libx264", "-crf", "20", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", "-r", "30", path.join(uscita, "reel.mp4")]);
  console.log("reel.mp4");
}

(async () => {
  const uscita = process.argv[2];
  if (!uscita) {
    console.error("Manca la cartella di uscita: node social/fai-grafiche.js <cartella>");
    process.exit(1);
  }
  fs.mkdirSync(uscita, { recursive: true });
  const browser = await chromium.launch();
  const pagina = await browser.newPage({ viewport: { width: 1200, height: 2000 } });
  await fotografa(pagina, "carosello.html",
    [1, 2, 3, 4, 5].map(i => ["s" + i, `carosello-${i}.png`]), uscita);
  await fotografa(pagina, "verticali.html",
    [1, 2, 3, 4, 5].map(i => ["t" + i, `verticale-${i}.png`])
      .concat([1, 2].map(i => ["s" + i, `storia-${i}.png`])), uscita);
  await browser.close();
  video(uscita);
})();

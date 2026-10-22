# Il QR di Isla

`qr-isla.svg` e `qr-isla.png` aprono **https://islaexcursionstenerife.com/**, cioè
la pagina iniziale dell'app (rifatti col dominio nuovo il 22 ottobre 2026). I ticket
già stampati col QR vecchio, che apre `jacques88-sudo.github.io/isla/`, funzionano
lo stesso: GitHub manda il vecchio indirizzo al nuovo. È **uguale per tutti i ticket**: il cliente vede il catalogo e,
da "Il mio ticket", entra con numero del ticket e telefono (deciso dal proprietario, 1°
ottobre 2026).

## Quale file usare

| file | per chi | perché |
|---|---|---|
| `qr-isla.svg` | **tipografia**, ticket, adesivi, cartelli | è disegnato a vettori: resta nitido a qualsiasi misura |
| `qr-isla.png` | WhatsApp, Instagram, prove a schermo | immagine normale, 1200 × 1200 px |

## Come stamparlo perché si legga

- **Almeno 2 × 2 cm** sul ticket. Su un cartello da guardare a un metro di distanza,
  almeno 10 × 10 cm.
- **Nero su bianco**, senza sfondo sotto: niente palme, niente evidenziatore sopra.
- **Il bordo bianco intorno fa parte del QR**: non va tagliato e non va appoggiato a
  scritte o linee.
- Sotto, se c'è posto, una riga per chi non lo sa usare: *"Inquadra con la fotocamera:
  le tue escursioni su Isla"*.

## Prima di stampare tanti ticket

**Un QR stampato non si può più cambiare.** Questo porta al dominio di Isla,
`islaexcursionstenerife.com`: funziona finché il dominio resta pagato (il rinnovo è
automatico, su Cloudflare). Se un giorno il dominio scade, i QR stampati non portano
più da nessuna parte.

## Provato

Il PNG e l'SVG sono stati riletti con un lettore di QR (`jsQR`). L'SVG è stato riletto
anche disegnato a 100, 150 e 300 px: porta sempre all'indirizzo giusto. QR versione 3
(29 × 29 quadretti), correzione d'errore M: si legge anche con un 15% del disegno
rovinato.

## Rifarlo

Con Node, in una cartella qualsiasi:

```bash
npm i qrcode
node -e 'const Q=require("qrcode");const u="https://islaexcursionstenerife.com/";const o={errorCorrectionLevel:"M",margin:4};Q.toString(u,{...o,type:"svg"}).then(s=>require("fs").writeFileSync("qr-isla.svg",s));Q.toFile("qr-isla.png",u,{...o,width:1200})'
```

# Il biglietto da visita

`biglietto-isla.pdf` è il file da dare alla **tipografia**: due pagine, fronte e retro,
**91 × 61 mm**, cioè 85 × 55 (misura europea) **più 3 mm di margine di taglio per lato**:
i fondi escono oltre il taglio, le scritte restano almeno 5 mm dentro. Senza segni di
taglio: se la tipografia li vuole, li mette lei. `biglietto-isla-anteprima.png` è
la prova a schermo, da mandare su WhatsApp.

- **Fronte**: fondo crema, logo, "ISLA" e "so easy so tenerife", l'onda nei due blu del sito.
- **Retro**: fondo scuro, "Francesca & Jack" scritto a mano (Caveat, oro) sotto il
  logo, WhatsApp (+34 657 772 032), email, sito, Admiral, e il QR di
  questa cartella. **Il +34 662 908 073 non c'è**, per scelta del proprietario (22
  ottobre 2026): sul sito resta.

I colori sono quelli di `styles.css`, scritti in esadecimale per la tipografia (in
testa a `biglietto-isla.html`): crema `#F7F1E5`, scuro `#241E1A`, grigio `#70675E`,
oro `#C8A785`, blu `#2D8AB8`, azzurro `#51BCCE`. Caratteri: Cormorant Garamond, Jost,
Caveat (Google Fonts, come il sito).

Il QR sul biglietto è largo circa 19 mm, poco sotto i 2 cm detti sopra: **prima di
stamparne tanti, provarlo col telefono su una copia stampata**.

## Rifarlo

Si cambia `biglietto-isla.html` (prende `../assets/logo-isla.png` e `qr-isla.svg`), poi
si rifanno PDF e anteprima con Playwright, da `stampa/`:

```bash
NODE_PATH=$(npm root -g) node -e '
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const p = await b.newPage({ viewport: { width: 1280, height: 300 }, deviceScaleFactor: 3 });
  const u = "file://" + process.cwd() + "/biglietto-isla.html";
  await p.goto(u); await p.waitForTimeout(2500);
  await p.screenshot({ path: "biglietto-isla-anteprima.png" });   // com'è dopo il taglio
  await p.goto(u + "?taglio=1"); await p.waitForTimeout(2500);    // coi 3 mm in più
  await p.pdf({ path: "biglietto-isla.pdf", width: "91mm", height: "61mm", printBackground: true });
  await b.close();
})();'
```

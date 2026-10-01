# Il QR di Isla

`qr-isla.svg` e `qr-isla.png` aprono **https://jacques88-sudo.github.io/isla/**, cioè
la pagina iniziale dell'app. È **uguale per tutti i ticket**: il cliente vede il catalogo e,
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

**Un QR stampato non si può più cambiare.** Se un giorno Isla passa a un dominio suo
(per esempio `isla-tenerife.com`), questi QR continueranno a portare all'indirizzo di
GitHub. Funzionano finché quell'indirizzo esiste. Se il dominio nuovo è in programma,
conviene deciderlo **prima** della ristampa dei blocchetti.

## Provato

Il PNG e l'SVG sono stati riletti con un lettore di QR (`jsQR`). L'SVG è stato riletto
anche disegnato a 100, 150 e 300 px: porta sempre all'indirizzo giusto. QR versione 3
(29 × 29 quadretti), correzione d'errore M: si legge anche con un 15% del disegno
rovinato.

## Rifarlo

Con Node, in una cartella qualsiasi:

```bash
npm i qrcode
node -e 'const Q=require("qrcode");const u="https://jacques88-sudo.github.io/isla/";const o={errorCorrectionLevel:"M",margin:4};Q.toString(u,{...o,type:"svg"}).then(s=>require("fs").writeFileSync("qr-isla.svg",s));Q.toFile("qr-isla.png",u,{...o,width:1200})'
```

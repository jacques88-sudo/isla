---
name: nuova-scheda
description: Aggiungere o aggiornare una scheda del catalogo Isla partendo dai dati di un fornitore (pagina incollata, foto, prezzi o orari mandati dall'ufficio). Usala quando arrivano dati di un'escursione, di una barca o di un tour da mettere sul sito — anche solo un prezzo, un orario o una fascia d'età da correggere.
---

# Aggiungere una scheda al catalogo Isla

Il lavoro che si ripete più spesso, e quello dove si sbaglia di più. L'ordine conta: i
controlli che vengono prima servono a non buttare via il lavoro fatto dopo.

Le regole generali del progetto stanno in `CLAUDE.md`, il perché di ognuna in `NOTES.md`.
Qui c'è solo la procedura.

---

## 1. Prima di tutto: è davvero una scheda nuova?

**È già successo di duplicare una barca.** Il "Kalima Kat" era il Small Group Catamaran
già in catalogo: stessa capienza, stessa durata, stessa paella, stesso porto. I segnali
c'erano tutti e sono passati.

Prima di scrivere una riga, elenca le schede della stessa categoria e confronta **prezzo,
durata, porto e capienza**:

```bash
node -e '
const fs=require("fs");
eval(fs.readFileSync("esplora-catalog.js","utf8").replace(/^const /gm,"var "));
ESPLORA_CATALOG.filter(t=>t.category==="mare-barche").forEach(t=>{
  const z=typeof t.zone==="string"?t.zone:(t.zone&&t.zone.it);
  const d=typeof t.duration==="string"?t.duration:(t.duration&&t.duration.it);
  console.log(t.id, "€"+(t.priceFrom||"?"), d, z);
});'
```

Se due o più valori coincidono, **fermati e chiedi** invece di creare un doppione.

## 2. Separa i dati dal marketing

Dalla pagina del fornitore si prende **solo quello che è un fatto**: prezzi, orari, età,
porto, durata, capienza, cosa è compreso, come si arriva.

**Non si copiano mai:**

- la loro politica di cancellazione — **le nostre sono 24 ore, sempre**, anche se la
  pagina dice 48 o 72;
- "best price guarantee", "official tickets", "secure payment", "book now and save";
- punteggi e numero di recensioni;
- i prezzi barrati: **sul sito va il prezzo pieno**, lo sconto di un altro non è nostro.

Le descrizioni si **riscrivono da zero** in italiano, inglese e spagnolo. Non si traduce
il testo del fornitore.

## 3. Chiedi quando il dato non c'è, non indovinare

Domande da fare invece di riempire a caso:

- **le fasce d'età devono combaciare.** Se l'ufficio scrive "bambini 3-11" e "bebè 0-3",
  i tre anni stanno in due fasce: chiedi quale vale;
- **sotto l'età minima**: si sale gratis o non si sale? Sono due cose diverse, e
  `priceInfant` vuol dire "gratis". Se non lo sai, **non mettere il campo**;
- **il prezzo adulti**, se ti hanno dato solo quello dei bambini;
- **le date esatte** di una partenza stagionale, se la pagina dice solo "in estate".

Puoi pubblicare il resto e lasciare in sospeso il pezzo mancante: dillo chiaramente invece
di tapparlo con un valore inventato.

## 4. Scrivi la scheda

Il vocabolario completo dei campi è **in testa a `esplora-catalog.js`**: leggilo, non
andare a memoria.

Le tre trappole più frequenti:

- **`included`** tiene solo quello che vale per **tutte** le varianti; il resto va dentro
  la variante. E `swimstop` (la sosta bagno) non è `snorkel` (l'attrezzatura prestata).
- **`times`** ha tre stati: pieno = le partenze vere; `[]` = charter, l'ora si concorda;
  assente = non le sappiamo ancora. Un charter si riconosce dal prezzo — "a gruppo", "a
  barca", "/ora" vuol dire che la barca è tutta del cliente.
- **`days`** si mette solo se **non** si fa tutti i giorni. `mar` è martedì, `mer` è
  mercoledì.

Se una condizione vale solo per una partenza o una variante (il transfer gratis solo alle
12:00, il pranzo solo sul giro lungo), **non metterla fra le icone**: le icone dicono
"vale sempre". Scrivila nella riga `transfer` o in una nota.

## 5. La foto

Le foto barche stanno tutte a **1200×800**, fra 100 e 250 KB:

```bash
python3 -c "
from PIL import Image
im = Image.open('<origine>').convert('RGB').resize((1200, 800), Image.LANCZOS)
im.save('assets/<nome>.jpg', 'JPEG', quality=82, optimize=True, progressive=True)"
```

**Guarda la foto prima di pubblicarla.** Una era stata scartata perché portava il marchio
di un'altra azienda; un'altra è stata confermata solo ingrandendo la scritta sullo scafo.
La livrea della barca stessa va bene: è il soggetto.

### Più foto per la stessa scheda

Quando arrivano più foto della stessa barca (fatto per Ragnarok e per Freebird): una sola
resta `image` (la foto della card e della foto grande in apertura — su una scheda già
pubblicata, quella che c'è già va bene, non cambiarla senza un motivo), le altre vanno nel
campo `gallery`, un elenco di nomi file. Sotto la foto grande esce da sola una striscia di
miniature cliccabili: non serve toccare `tour.js` o `styles.css`, il meccanismo è già
generico da quando è stato costruito.

Stessa regola dello scafo, moltiplicata: **guarda ogni foto una per una**, non l'insieme.
Stesso formato, **1200×800 e 100-250 KB ciascuna**, con lo stesso nome della scheda più un
numero (`ragnarok.jpg`, `ragnarok-2.jpg` … oppure, se `image` tiene già un nome suo come
`catamaran-gigantes-masca.jpg`, la galleria può comunque chiamarsi `freebird-2.jpg` e via
così — l'importante è che i nomi non si scontrino con altri file in `assets/`).

Se una foto arrivata è troppo piccola per arrivare a 1200×800 senza sgranarsi (è successo
con una da 424×280), **scartala** invece di pubblicarla sfocata: meglio una galleria di
tre foto buone che di quattro con una brutta in mezzo. Il ritaglio, quando le proporzioni
non sono già 3:2, si fa dal centro:

```python
from PIL import Image
im = Image.open('<origine>').convert('RGB')
w, h = im.size
target = 1200 / 800
if w / h > target:
    new_w = int(h * target); left = (w - new_w) // 2
    im = im.crop((left, 0, left + new_w, h))
else:
    new_h = int(w / target); top = (h - new_h) // 2
    im = im.crop((0, top, w, top + new_h))
im.resize((1200, 800), Image.LANCZOS).save('assets/<nome>.jpg', 'JPEG', quality=82, optimize=True, progressive=True)
```

## 6. Controlla

```bash
node controlla.js       # fasce d'età, sigle dei giorni, icone, foto, traduzioni
```

Poi **alza `CACHE_NAME` in `sw.js`** e apri la pagina nel browser vero:

```bash
python3 -m http.server 8912
NODE_PATH=$(npm root -g) node prova.js   # executablePath: '/opt/pw-browsers/chromium'
```

Guarda **la pagina resa**, non solo il codice: "Neonati: Gratis" su una variante a barca
intera e una durata che non seguiva la variante sono stati trovati solo così.

Verifica il totale a mano: 2 adulti + 1 bambino deve fare il numero che ti aspetti.

## 7. Chiudi

Aggiorna `NOTES.md` (cosa hai messo, **cosa hai deciso e perché**, cosa resta in sospeso),
committa, apri la PR, squash-merge, riallinea il branch.

Nel riferire al proprietario, dì sempre **cosa hai deciso da solo** e **cosa resta da
confermare**: sono le due cose che gli servono per correggerti in una parola.

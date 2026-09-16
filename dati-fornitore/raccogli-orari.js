// Gli orari del pulmino di UNA escursione, presi dal widget del fornitore.
//
// COME SI USA
//   1. apri la pagina di quell'escursione su islandexcursionstenerife.com
//   2. F12 (oppure Ctrl+Maiusc+J), scheda "Console"
//   3. incolla tutto questo file e premi Invio
//   4. aspetti circa un minuto e mezzo, fino a "FINITO, 104 righe"
//   5. scrivi  copy(window.__out)  e incolli il risultato dove serve
//
// Appena premuto Invio la console scrive `Promise {<pending>}` e non lo cambia
// mai piu'. Non e' bloccato: quella riga Chrome non la aggiorna. I progressi
// si leggono nei numeri sotto, "0 di 104", "20 di 104".
//
// PERCHE' 104 E NON 567
// Il punto di raccolta dipende solo dall'hotel ed e' lo stesso per tutte le
// escursioni (verificato su tre): quello ce l'abbiamo gia' in hotel.js. L'ora
// invece cambia da un'escursione all'altra, ed e' l'unica cosa da rifare. Basta
// quindi un hotel campione per punto: la lista CAMPIONI qui sotto e' esattamente
// quella, un id_hotel per ognuno dei 104 punti, ricavata da hotel.tsv.
//
// COSA ESCE
// Una riga per punto, `id_punto <TAB> ora`. Ora vuota vuol dire che quel punto
// **non e' servito** da quell'escursione, non che il dato manchi.
//
// Il widget avvolge le caselle in TomSelect: cambiare `value` a mano non fa
// partire niente, serve `tomselect.setValue()`. E' l'errore che il primo giorno
// ha fatto tornare 567 righe tutte uguali.
(async () => {
  // 1. la spia: registra le risposte del server, senza toccare la pagina
  if (!window.__spia) {
    window.__spia = [];
    const XO = XMLHttpRequest.prototype.open, XS = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (m, u) { this.__u = u; return XO.apply(this, arguments); };
    XMLHttpRequest.prototype.send = function () {
      this.addEventListener("load", () => {
        if (String(this.__u).includes("hotel_pickup")) window.__spia.push(this.responseText);
      });
      return XS.apply(this, arguments);
    };
    const F = window.fetch;
    window.fetch = async function (...a) {
      const r = await F.apply(this, a);
      if (String(a[0]).includes("hotel_pickup")) r.clone().text().then(t => window.__spia.push(t));
      return r;
    };
  }

  // 2. un hotel per ogni punto di raccolta: 104 richieste invece di 567
  const CAMPIONI = [
  378,1,6,8,9,11,622,15,18,21,27,24,25,33,35,34,49,23,80,97,
  98,102,109,110,128,133,140,143,144,146,153,167,173,179,180,186,192,193,198,650,
  138,254,361,200,383,73,510,481,547,190,548,600,559,601,123,129,557,558,562,585,
  326,567,568,570,561,560,582,607,218,195,194,675,678,680,684,686,687,694,702,716,
  723,730,740,742,743,745,753,754,750,760,380,555,729,14,782,793,693,711,770,785,
  788,565,799,12
  ];

  const H = document.querySelector("#wdgt-hotel");
  if (!H || !H.tomselect) { console.log("NON TROVO LA CASELLA HOTEL - fermati e dimmelo"); return; }

  const righe = [];
  for (let i = 0; i < CAMPIONI.length; i++) {
    const n = window.__spia.length;
    H.tomselect.setValue(String(CAMPIONI[i]));
    for (let k = 0; k < 60 && window.__spia.length === n; k++) await new Promise(r => setTimeout(r, 50));
    let d = {};
    try { d = JSON.parse(window.__spia[window.__spia.length - 1] || "{}"); } catch (e) {}
    righe.push((d.id_punto === undefined ? "?" : d.id_punto) + "\t" + (d.hora || ""));
    if (i % 20 === 0) console.log(i + " di " + CAMPIONI.length);
  }

  window.__out = righe.join("\n");
  console.log("FINITO, " + righe.length + " righe. Ora scrivi:   copy(window.__out)");
})();

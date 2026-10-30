// IL TRASLOCO AL DOMINIO NUOVO (21 ottobre 2026)
//
// Isla passa da jacques88-sudo.github.io/isla/ a islaexcursionstenerife.com.
// Quando su GitHub si mette il dominio (file CNAME), il vecchio indirizzo
// manda al nuovo da solo. Restano fuori due cose:
//   - chi ha gia' aperto Isla ha il service worker, che serve le pagine dalla
//     cache senza chiedere al server: il rimando di GitHub non lo vedrebbe mai;
//   - quello che il cliente ha salvato nel telefono (lista, preferiti, le
//     chiavi delle richieste, la lingua) sta in localStorage, che il browser
//     tiene legato all'indirizzo: dal dominio nuovo non si legge.
// Questo file fa le due cose. Sul vecchio indirizzo guarda se il nuovo e'
// acceso (trasloco.txt) e, se si', ci va portandosi i dati dopo il "#", che
// non viene mandato a nessun server. Sul nuovo li rimette in localStorage e
// toglie il "#" dall'indirizzo.
//
// Va caricato PRIMA di tutti gli altri script: i18n.js legge la lingua e
// lista.js il carrello appena si caricano.
// Il service worker del vecchio indirizzo resta acceso apposta: gli avvisi
// sul telefono delle richieste gia' mandate arrivano a lui, e toccandoli si
// apre il vecchio indirizzo, che passa di qui e porta al nuovo.

const TRASLOCO_VECCHIO = "jacques88-sudo.github.io";
const TRASLOCO_NUOVO = "https://islaexcursionstenerife.com";

// Non si portano: il meteo si riscarica, e il riquadro "Installa l'app" deve
// tornare, perche' sul dominio nuovo l'app non e' installata.
const TRASLOCO_SALTA = ["isla-meteo", "isla-installa-chiuso", "isla-installa-visto"];

// Due elenchi con la stessa chiave si uniscono, senza doppioni: le richieste
// per la loro chiave (token), il resto per com'e' scritto.
function traslocoUnisci(nuovo, vecchio) {
  const visti = new Set();
  return nuovo.concat(vecchio).filter(x => {
    const chiave = x && typeof x === "object" && x.token ? x.token : JSON.stringify(x);
    if (visti.has(chiave)) return false;
    visti.add(chiave);
    return true;
  });
}

(function () {
  try {
    if (location.hostname === TRASLOCO_VECCHIO) {
      fetch(TRASLOCO_NUOVO + "/trasloco.txt", { cache: "no-store" })
        .then(r => r.ok ? r.text() : "")
        .then(testo => {
          if (testo.trim() !== "isla") return;
          const dati = {};
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k.startsWith("isla-") && !TRASLOCO_SALTA.includes(k)) dati[k] = localStorage.getItem(k);
          }
          const pagina = location.pathname.replace(/^\/isla\//, "/");
          const dopo = Object.keys(dati).length ? "#trasloco=" + encodeURIComponent(JSON.stringify(dati)) : location.hash;
          location.replace(TRASLOCO_NUOVO + pagina + location.search + dopo);
        })
        .catch(() => { /* il nuovo non risponde ancora, o si e' senza rete: si resta qui */ });
      return;
    }
    if (!location.hash.startsWith("#trasloco=")) return;
    const grezzo = location.hash.slice("#trasloco=".length);
    history.replaceState(null, "", location.pathname + location.search);
    // Solo chi arriva davvero dal vecchio indirizzo: con un link fatto apposta,
    // chiunque potrebbe mettere qui una richiesta finta con un suo "Paga ora".
    if (!document.referrer.startsWith("https://" + TRASLOCO_VECCHIO + "/")) return;
    const dati = JSON.parse(decodeURIComponent(grezzo));
    Object.keys(dati).forEach(k => {
      if (!k.startsWith("isla-") || typeof dati[k] !== "string") return;
      const qui = localStorage.getItem(k);
      if (qui === null) { localStorage.setItem(k, dati[k]); return; }
      try {
        const a = JSON.parse(qui), b = JSON.parse(dati[k]);
        if (Array.isArray(a) && Array.isArray(b)) localStorage.setItem(k, JSON.stringify(traslocoUnisci(a, b)));
      } catch (e) { /* non e' un elenco: vince quello che c'e' gia' qui */ }
    });
  } catch (e) { /* incognito o dati rovinati: il sito funziona lo stesso, da vuoto */ }
})();

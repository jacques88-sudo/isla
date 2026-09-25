const CACHE_NAME = "isla-v361";
const ASSETS = [
  "./",
  "./index.html",
  "./booking.html",
  "./escursioni.html",
  "./pacchetti.html",
  // La vista "In famiglia" e' la stessa pagina con `?famiglia=1` attaccato, ma
  // per la cache e' un altro indirizzo: `caches.match` guarda anche la parte
  // dopo il "?", quindi senza questa riga il riquadro della home, da offline,
  // finirebbe sulla pagina "sei senza connessione". Stessa cosa per l'elenco
  // delle escursioni per bambini. Il server manda lo stesso file, e' il
  // browser a doverselo ritrovare con l'indirizzo giusto.
  "./pacchetti.html?famiglia=1",
  "./escursioni.html?family=1",
  // Stessa storia per la vetrina degli itinerari: quattro indirizzi, uno per
  // pillola. "tutti" e' quello del riquadro in home, gli altri tre sono quelli
  // che si mandano a un cliente ("ti mando i cinque giorni") ed e' proprio da
  // quelli che si apre l'app la seconda volta.
  "./pacchetti.html?giorni=tutti",
  "./pacchetti.html?giorni=3",
  "./pacchetti.html?giorni=5",
  "./pacchetti.html?giorni=7",
  "./pacchetto.html",
  "./noleggio.html",
  "./tour.html",
  "./offline.html",
  "./styles.css",
  "./i18n.js",
  "./app.js",
  "./booking.js",
  "./escursioni.js",
  "./tour.js",
  "./pacchetti.js",
  "./noleggio.js",
  "./lista.js",
  "./assistente.js",
  "./esplora-catalog.js",
  "./hotel.js",
  "./manifest.json",
  "./assets/logo-isla.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      // "reload" vuol dire: scaricali dalla rete, non dalla cache del browser.
      // Senza, questi file passano dalla cache HTTP di GitHub Pages, che dice
      // al browser di tenerseli per dieci minuti: una versione nuova del
      // service worker poteva mettersi in cache l'index.html vecchio, e da li'
      // non si usciva piu' — la versione era nuova ma il contenuto era quello
      // di prima, e ricaricare non serviva a niente.
      cache.addAll(ASSETS.map(url => new Request(url, { cache: "reload" })))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      // La barra di ricerca della home manda a escursioni.html?q=<parola>:
      // indirizzi infiniti, non si possono mettere in elenco come quelli
      // sopra. Da offline si serve la pagina in cache senza guardare il "?"
      // — la parola la legge poi escursioni.js dall'indirizzo, che e' rimasto.
      return fetch(event.request).catch(() =>
        new URL(event.request.url).pathname.endsWith("/escursioni.html")
          ? caches.match("./escursioni.html", { ignoreSearch: true })
              .then(r => r || caches.match("./offline.html"))
          : caches.match("./offline.html"));
    })
  );
});
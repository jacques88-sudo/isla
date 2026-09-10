const CACHE_NAME = "isla-v277";
const ASSETS = [
  "./",
  "./index.html",
  "./booking.html",
  "./escursioni.html",
  "./tour.html",
  "./offline.html",
  "./styles.css",
  "./i18n.js",
  "./app.js",
  "./booking.js",
  "./escursioni.js",
  "./tour.js",
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
      return fetch(event.request).catch(() => caches.match("./offline.html"));
    })
  );
});
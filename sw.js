const CACHE_NAME = "isla-v88";
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
  "./assistente.js",
  "./esplora-catalog.js",
  "./manifest.json",
  "./assets/logo-isla.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
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
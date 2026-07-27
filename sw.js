const CACHE_NAME = "isla-v4";
const OFFLINE_URL = "./offline.html";

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./offline.html",
  "./logo-isla.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;
  if (request.headers.has("range")) return;

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).catch(() => {
        if (request.mode === "navigate") {
          return caches.match(OFFLINE_URL);
        }

        return new Response("", {
          status: 504,
          statusText: "Offline"
        });
      });
    })
  );
});

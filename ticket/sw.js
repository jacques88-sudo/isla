// Isla Ticket e' andata in un repository suo (isla-ticket, 17 ottobre 2026) e
// questa cartella e' solo un rimando. Il service worker che c'era qui resta nei
// telefoni che l'hanno aperta: questa versione lo toglie da solo.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.registration.unregister());

const CACHE_NAME = "respectury-fix5k-pwa-v1";
const APP_SHELL = ["/", "/manifest.json", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/brain.svg"];
const PDF_CDN = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Root is requested with the current same-origin session cookie; this is the app shell.
    await cache.addAll(APP_SHELL);
    // Best effort: cache the existing PDF library while online for offline PDF creation.
    try {
      const response = await fetch(PDF_CDN, { mode: "no-cors", cache: "reload" });
      if (response && (response.ok || response.type === "opaque")) await cache.put(PDF_CDN, response);
    } catch (_) { /* Online first visit may not reach the CDN; PDF then needs internet. */ }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("respectury-fix5k-") && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET") return;
  // Never fake API success or cache sensitive API responses: KI and login require the server.
  if (url.origin === self.location.origin && url.pathname.startsWith("/api/")) return;
  // The external PDF library is cached best-effort for offline use.
  if (request.url === PDF_CDN) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const saved = await cache.match(PDF_CDN);
      if (saved) return saved;
      try {
        const live = await fetch(request);
        if (live.ok || live.type === "opaque") await cache.put(PDF_CDN, live.clone());
        return live;
      } catch (_) {
        return new Response("PDF-Bibliothek offline nicht verfügbar. RESPECTURY bitte einmal online öffnen.", {status: 503, headers:{"Content-Type":"text/plain; charset=utf-8"}});
      }
    })());
    return;
  }
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    if (request.mode === "navigate") {
      try {
        const live = await fetch(request);
        if (live.ok) await cache.put("/", live.clone());
        return live;
      } catch (_) {
        const saved = await cache.match("/");
        return saved || new Response("RESPECTURY ist offline noch nicht eingerichtet. Bitte einmal online öffnen und anmelden.", {status:503, headers:{"Content-Type":"text/plain; charset=utf-8"}});
      }
    }
    const saved = await cache.match(request);
    if (saved) return saved;
    try {
      const live = await fetch(request);
      if (live.ok) await cache.put(request, live.clone());
      return live;
    } catch (_) {
      return new Response("Diese Datei ist offline nicht verfügbar.", {status:503, headers:{"Content-Type":"text/plain; charset=utf-8"}});
    }
  })());
});

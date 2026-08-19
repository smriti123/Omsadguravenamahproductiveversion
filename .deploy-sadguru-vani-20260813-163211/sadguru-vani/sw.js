const CACHE_NAME = "sadguru-vani-v45";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=32",
  "./app.js?v=30",
  "./manifest.webmanifest?v=5",
  "./data/bhajans.json",
  "../assets/vedant-2-B-oiwEtb.png",
  "../data/satsang-talks.json?v=2",
  "../data/excerpts-playlist-fallback.json",
  "./icons/icon-192.png?v=4",
  "./icons/icon-512.png?v=4",
  "./icons/icon-maskable-512.png?v=4"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("sadguru-vani-") && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match("./index.html")));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fresh = fetch(event.request)
        .then((response) => {
          if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
          return response;
        })
        .catch(() => cached);
      return cached || fresh;
    }),
  );
});

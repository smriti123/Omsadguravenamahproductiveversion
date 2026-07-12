const CACHE_PREFIX = "omsadguravenamah";
const CACHE_VERSION = "2026-07-12-155";
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `${CACHE_PREFIX}-images-${CACHE_VERSION}`;
const isLocalDevelopment =
  self.location.hostname === "localhost" ||
  self.location.hostname === "127.0.0.1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/assets/index-wjuQPPKu.js?v=9",
  "/assets/index-NEP4d6NH.css",
  "/section-banner-overrides.css?v=112",
  "/virah-layout.js?v=3",
  "/virah-first-avatar.js?v=1",
  "/assets/virah-adhyatmananda-avatar.jpg?v=1",
  "/assets/virah-adhyatmananda-full.jpg?v=1",
  "/charitra-special.js?v=42",
  "/assets/anandvardhakaya-1.jpg",
  "/assets/anandvardhakaya-2.jpeg",
  "/assets/anandvardhakaya-3.jpg",
  "/assets/anandvardhakaya-4.jpg",
  "/assets/anandvardhakaya-5.jpg",
  "/assets/anandvardhakaya-6.jpg",
  "/assets/anandvardhakaya-7.jpeg",
  "/assets/anandvardhakaya-8.jpeg",
  "/assets/anandvardhakaya-9.jpeg",
  "/assets/anandvardhakaya-kalash.jpeg",
  "/assets/diw-YaPSf2re.jpg",
  "/assets/arununcle-new.jpeg",
  "/assets/guruparampara.jpeg",
  "/assets/stuti-gangeshananda-new-BC36bOaV.jpg",
  "/assets/stuti-gangeshananda-CKp1HJji.jpg",
  "/assets/subodhananda-stotram-enhanced-color.jpg",
  "/assets/stuti-gangeshananda-BlQ4qr1T.jpg",
  "/satsang-bookmarks.js?v=36",
  "/satsang-search.js?v=3",
  "/data/satsang-talks.json",
  "/excerpts-playlist.js?v=23",
  "/data/excerpts-playlist-fallback.json",
  "/image-loading-optimizations.js?v=1",
  "/home-scroll-button.js?v=1",
  "/hindi-titles.js?v=3",
  "/home-slideshow-overrides.js?v=1",
  "/charan-carousel-polish.js?v=1",
  "/sadguru-smaran-cta.js?v=5",
  "/closing-blessing.js?v=1",
  "/reading-size.js?v=1",
  "/assets/dravinam.jpeg",
  "/assets/saraswatiiji.jpg",
  "/assets/wheelchairnew.jpg",
  "/assets/bhakta-vidya-1.jpg",
  "/assets/bhakta-vidya-2.jpg",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/pwa-192x192.png",
  "/pwa-512x512.png",
  "/pwa-maskable-512x512.png",
  "/assets/shivraj-singh-chouhan-tribute.jpg?v=1",
];

function isImageRequest(request, url) {
  return (
    request.destination === "image" ||
    /\.(avif|webp|png|jpe?g|gif|svg|ico)(\?|#|$)/i.test(url.pathname)
  );
}

async function imageResponse(request) {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request, { cache: "no-store" });
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

async function clearOldAppCaches() {
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter(
        (key) =>
          (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) ||
          key.includes("workbox-precache"),
      )
      .map((key) => caches.delete(key)),
  );
}

if (isLocalDevelopment) {
  self.addEventListener("install", () => self.skipWaiting());

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      Promise.all([
        caches.keys().then((keys) =>
          Promise.all(keys.map((key) => caches.delete(key))),
        ),
        self.registration.unregister(),
        self.clients.claim(),
      ]),
    );
  });
} else {
  self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) =>
        Promise.allSettled(
          APP_SHELL.map((url) =>
            fetch(url, { cache: "no-store" }).then((response) => {
              if (response.ok) return cache.put(url, response);
              return undefined;
            }),
          ),
        ),
      ),
    );
    self.skipWaiting();
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      clearOldAppCaches().then(() => self.clients.claim()),
    );
  });

  self.addEventListener("fetch", (event) => {
    const request = event.request;
    if (request.method !== "GET") return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;
    if (url.pathname.startsWith("/api/")) return;

    if (isImageRequest(request, url)) {
      event.respondWith(imageResponse(request));
      return;
    }

    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);

        try {
          const response = await fetch(request, { cache: "no-store" });
          if (response.ok) {
            await cache.put(request, response.clone());
            if (request.mode === "navigate") {
              await cache.put("/index.html", response.clone());
            }
          }
          return response;
        } catch {
          const cached = await cache.match(request);
          if (cached) return cached;

          if (request.mode === "navigate") {
            const appShell = await cache.match("/index.html");
            if (appShell) return appShell;
          }

          return Response.error();
        }
      })(),
    );
  });
}

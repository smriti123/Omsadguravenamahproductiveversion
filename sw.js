const CACHE_PREFIX = "omsadguravenamah";
const CACHE_VERSION = "2026-08-18-423";
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `${CACHE_PREFIX}-images-${CACHE_VERSION}`;
const isLocalDevelopment =
  self.location.hostname === "localhost" ||
  self.location.hostname === "127.0.0.1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/assets/index-wjuQPPKu.js?v=18",
  "/assets/index-NEP4d6NH.css",
  "/section-banner-overrides.css?v=231",
  "/virah-layout.js?v=10",
  "/virah-first-avatar.js?v=1",
  "/assets/virah-adhyatmananda-avatar.jpg?v=1",
  "/assets/virah-adhyatmananda-full.jpg?v=1",
  "/charitra-special.js?v=182",
  "/stuti-article-reader.js?v=9",
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
  "/assets/anandvardhakaya-boat.jpg",
  "/assets/anandvardhakaya-ganga.jpg",
  "/assets/diw-YaPSf2re.jpg",
  "/assets/arununcle-new.jpeg",
  "/assets/guruparampara.jpeg",
  "/assets/stuti-gangeshananda-new-BC36bOaV.jpg",
  "/assets/stuti-gangeshananda-CKp1HJji.jpg",
  "/assets/subodhananda-stotram-enhanced-color.jpg",
  "/assets/stuti-gangeshananda-BlQ4qr1T.jpg",
  "/satsang-bookmarks.js?v=67",
  "/assets/category-covers/ramcharitmanas.jfif",
  "/assets/category-covers/bhagwatam.webp",
  "/assets/category-covers/bhagavad-geeta.webp",
  "/main-install.css?v=1",
  "/main-install.js?v=2",
  "/satsang-search.js?v=11",
  "/data/satsang-talks.json?v=9",
  "/excerpts-playlist.js?v=34",
  "/data/excerpts-playlist-fallback.json",
  "/image-loading-optimizations.js?v=1",
  "/home-scroll-button.js?v=2",
  "/ios-tap-fix.js?v=1",
  "/timeline-photo-viewer.js?v=6",
  "/assets2/chinmaya-mission-mahasamadhi-homage.jpg?v=1",
  "/bhajan-intro-banner.js?v=6",
  "/assets/mahasamadhi-2.jpg",
  "/hindi-titles.js?v=6",
  "/home-slideshow-overrides.js?v=5",
  "/charan-carousel-polish.js?v=6",
  "/sadguru-smaran-cta.js?v=15",
  "/my-photos.js?v=8",
  "/about-website.js?v=19",
  "/quotes-carousel.js?v=28",
  "/closing-blessing.js?v=1",
  "/reading-size.js?v=2",
  "/assets/dravinam.jpeg",
  "/assets/pair-sakha-tight-CkFwrDQh.jpg",
  "/assets/saraswatiiji.jpg",
  "/assets/wheelchairnew.jpg",
  "/assets/bhakta-vidya-1.jpg",
  "/assets/bhakta-vidya-2-revised.jpg",
  "/assets/shishya-priya-1.jpg",
  "/assets/shishya-priya-2.jpg",
  // assets2/ — newer photos kept out of the big assets/ folder so they can be
  // uploaded on their own (see charitra-special.js extraCategoryPhotos).
  "/assets2/sabhaghar.jpg",
  "/assets2/gurudevagya-1.jpg",
  "/assets2/gurudevagya-2.jpg",
  "/assets2/orga1.jpg",
  "/assets2/orga2.jpg",
  "/assets2/special.jpg",
  "/assets2/shishya-priya-3.jpg",
  "/assets2/adwitiya-shivraj-1.jpg",
  "/assets2/adwitiya-shivraj-2.jpg",
  "/assets2/anandvardhakaya-new-1.jpg",
  "/assets2/anandvardhakaya-new-2.jpg",
  "/assets2/charitra-anandvardhakaya-rammandir-20260807.jpg",
  "/assets2/charitra-sadgurupriyaya-with-gurudev-20260807.jpg",
  "/assets2/vedantvedaya-new-1.jpg",
  "/assets2/vedantvedaya-new-2.jpg",
  "/assets2/smita-ikshan-series-1-mobile.jpg",
  "/assets2/smita-ikshan-series-2-mobile.jpg",
  "/assets2/smita-ikshan-series-3-mobile.jpg",
  "/assets2/smita-ikshan-series-4-mobile.jpg",
  "/assets2/sadguru-priyaye-img1-20260725.jpeg",
  "/assets2/smita-ikshanaya-img2-20260725.jpeg",
  "/assets2/smita-ikshanaya-smilenew-20260807.jpg",
  "/assets2/vedant-andhra-remembrance-20260726.jpg",
  "/assets2/charitra-shishyapriya-amma-20260727.jpg",
  "/assets2/charitra-shishyapriya-gangeshanandaji-20260727.jpeg",
  "/assets2/charitra-shishyapriya-group-20260807.jpeg",
  "/assets2/charitra-adwitaya-anandmath-1-20260727.jpg",
  "/assets2/charitra-adwitaya-anandmath-2-20260727.jpg",
  "/assets2/charitra-adwitaya-bholebaba-20260727.jpg",
  "/assets2/charitra-vedantvedaya-anandmath-20260727.jpg",
  "/assets2/charitra-bhaktavatsala-tvamevabandhu-20260727.jpg",
  "/assets2/charitra-bhaktavatsala-dravinam-20260727.jpg",
  "/assets2/charitra-vedant-text-depth-20260728.jpg",
  "/assets2/charitra-vedantvedaya-20260807-1.jpg",
  "/assets2/charitra-vedantvedaya-20260807-2.jpg",
  "/assets2/vedant-himalayan-dedication-remembrance.jpg?v=1",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/pwa-192x192.png",
  "/pwa-512x512.png",
  "/pwa-maskable-512x512.png",
  "/assets/shivraj-singh-chouhan-tribute.jpg?v=1",
  "/assets/charan-vandan-feet-DRcPUe7y.jpg",
  "/assets/fonts/banner-fonts.css?v=1",
  "/assets/fonts/bf-3.woff2",
  "/assets/fonts/bf-7.woff2",
  "/assets/fonts/bf-8.woff2",
  "/assets/fonts/bf-10.woff2",
  "/assets2/quote-2026-08-08-hi.jpg",
  "/assets2/quote-2026-08-08-en.jpg",
  "/assets2/quote-2026-08-09-hi.jpg",
  "/assets2/quote-2026-08-10-hi.jpg",
  "/assets2/quote-2026-08-11-hi.jpg",
  "/assets2/quote-2026-08-12-hi.jpg",
  "/assets2/quote-2026-08-13-hi.jpg",
  "/assets2/quote-2026-08-14-hi.jpg",
  "/assets2/quote-2026-08-15-hi.jpg",
  "/assets2/quote-2026-08-15-en.jpg",
  "/assets2/quote-2026-08-16-hi.jpg",
  "/assets2/quote-2026-08-17-hi.jpg",
  "/assets2/quote-2026-08-18-hi.jpg",
  "/assets2/quote-2026-08-18-en.jpg",
  "/assets2/quote-2026-08-19-hi.jpg",
  "/assets2/quote-2026-08-20-hi.jpg",
  "/assets2/quote-2026-08-21-hi.jpg",
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

  try {
    const response = await fetch(request, { cache: "no-store" });
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch (error) {
    // Offline: fall back to the app-shell precache (the quote images and other
    // precached pictures live in CACHE_NAME, which this checks across all caches).
    const precached = await caches.match(request);
    if (precached) return precached;
    throw error;
  }
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
    // Sadguru Vani is an independent PWA with its own service worker and cache.
    if (
      url.pathname === "/sadguru-vani" ||
      url.pathname.startsWith("/sadguru-vani/") ||
      url.pathname === "/sadguru-vani-v2" ||
      url.pathname.startsWith("/sadguru-vani-v2/")
    ) return;

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

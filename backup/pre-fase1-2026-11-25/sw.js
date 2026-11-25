/* Forge — service worker para uso offline */
const VERSION = "forge-v3";
const CACHE = VERSION + "-cache";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./css/style.css",
  "./js/data.js",
  "./js/data-linux.js",
  "./js/data-c.js",
  "./js/data-math.js",
  "./js/data-math2.js",
  "./js/data-math-a.js",
  "./js/data-math-discrete.js",
  "./js/data-software.js",
  "./js/data-software-extra.js",
  "./js/data-algorithms.js",
  "./js/data-systems.js",
  "./js/data-networks.js",
  "./js/data-db.js",
  "./js/storage.js",
  "./js/exercises.js",
  "./js/app.js",
  "./js/gamification.js",
  "./js/features.js",
  "./js/focus.js",
  "./js/plan.js",
  "./js/labs-extra.js",
  "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/contrib/auto-render.min.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(APP_SHELL.map(url => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", event => {
  if (event.data === "skipWaiting") self.skipWaiting();
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const isAppOrigin = url.origin === self.location.origin;
  const isKatex = url.hostname === "cdnjs.cloudflare.com" && url.pathname.includes("/KaTeX/");
  if (!isAppOrigin && !isKatex) return;

  // Navegação: rede primeiro, fallback para o shell em cache.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // CDN: cache primeiro, depois rede.
  if (isKatex) {
    event.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }))
    );
    return;
  }

  // Arquivos locais: rede primeiro para refletir edições, fallback offline.
  event.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});

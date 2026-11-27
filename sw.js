/* Forge — service worker para uso offline */
/* FORGE 3.0: versão alinhada à especificação do PWA v6. */
const VERSION = "forge-v6";
const CACHE = VERSION + "-cache";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./manifest.json",
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-192.png",
  "./icon-maskable-512.png",
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
  "./js/data-networks-advanced.js",
  "./js/data-linux-advanced.js",
  "./js/data-security-systems.js",
  "./js/data-math-advanced.js",
  "./js/data-c-advanced.js",
  "./js/data-labs-a.js",
  "./js/data-labs-b.js",
  "./js/data-library-extra.js",
  "./js/data-books.js",
  /* PDF.js é carregado sob demanda pelo ForgePDF. O handler de fetch abaixo
     guarda a resposta na primeira abertura; incluí-los no install compilava
     ~1 MB de JavaScript na thread do service worker e penalizava o TBT. */
  "./js/data-books-meta.js",
  "./js/data-forge3.js",
  "./js/data-trilha10.js",
  "./js/data-trilha11.js",
  "./js/data-trilha12.js",
  "./js/sim-logic.js",
  "./js/sim-cpu.js",
  "./js/sim-ai.js",
  "./js/storage.js",
  "./js/exercises.js",
  "./js/app.js",
  "./js/gamification.js",
  "./js/mastery.js",
  "./js/labs-catalog.js",
  "./js/library-rich.js",
  "./js/books.js",
  "./js/books-store.js",
  "./js/book-questions.js",
  "./js/book-reader.js",
  "./js/study.js",
  "./js/features.js",
  "./js/focus.js",
  "./js/plan.js",
  "./js/labs-extra.js",
  "./vendor/katex/katex.min.css",
  "./vendor/katex/katex.min.js",
  "./vendor/katex/contrib/auto-render.min.js"
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
  // FORGE 3.0 funciona sem serviços externos: apenas arquivos da própria origem.
  if (url.origin !== self.location.origin) return;

  // Navegação: rede primeiro, fallback para o shell em cache.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put("./index.html", copy));
          }
          return res;
        })
        .catch(() => caches.match("./index.html"))
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

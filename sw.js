/* Forge — service worker para uso offline */
/* FORGE 7.0: cache-first + stale-while-revalidate, manifesto completo. */
importScripts("./sw-summaries.js");

const VERSION = "forge-v9";
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
  /* FORGE 7.0 — tema cinematográfico, conteúdo didático e UI aditiva. */
  "./css/forge7.css",
  /* FORGE 8.0 — camada aditiva, glossário, conteúdo e controlador. */
  "./css/forge8.css",
  "./js/data-porque.js",
  "./js/forge7-ui.js",
  "./js/forge8-glossary.js",
  "./js/data-forge8.js",
  "./js/forge8-ui.js",
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
  "./js/utils-math.js",
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
  /* FORGE 4.0 — command center e novos simuladores. */
  "./js/dashboard-widgets.js",
  "./js/sim-oral.js",
  "./js/sim-crypto.js",
  /* ETAPA 4 — acervo de resumos: índice gerado, busca e leitor. */
  "./js/data-summaries-index.js",
  "./js/books-summaries-index.js",
  "./js/summaries-page.js",
  /* KaTeX permanece local e no caminho de precache (zero CDN). */
  "./vendor/katex/katex.min.css",
  "./vendor/katex/katex.min.js",
  "./vendor/katex/contrib/auto-render.min.js"
];

const PRECACHE = APP_SHELL.concat(
  Array.isArray(SUMMARY_MANIFEST) ? SUMMARY_MANIFEST : []
);

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(PRECACHE.map(url => cache.add(url)))
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

/* Cache-first com stale-while-revalidate: a resposta em cache responde
   imediatamente; a rede atualiza o cache em segundo plano. Sempre local,
   sem serviços externos e sem bloquear o primeiro paint. */
function revalidate(req, cached, cacheKey) {
  return fetch(req).then(res => {
    if (res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then(cache => cache.put(cacheKey || req, copy));
    }
    return res;
  }).catch(() => cached);
}

function swr(req, event, cacheKey) {
  return caches.match(cacheKey || req).then(cached => {
    const network = revalidate(req, cached, cacheKey);
    if (event && typeof event.waitUntil === "function") {
      event.waitUntil(network.then(() => undefined).catch(() => undefined));
    }
    return cached || network;
  });
}

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  /* FORGE 4.0 funciona sem serviços externos: apenas arquivos da própria origem. */
  if (url.origin !== self.location.origin) return;

  /* Navegação: cache-first, revalidando o shell em segundo plano. */
  if (req.mode === "navigate") {
    event.respondWith(swr(req, event, "./index.html"));
    return;
  }

  event.respondWith(swr(req, event));
});

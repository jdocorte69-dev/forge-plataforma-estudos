/* ============================================================
   FORGE — books.js
   Página "Livros em PDF": catálogo filtrável de fonte aberta.
   Depende de data-books.js (window.BOOKS). Sem dependências de app.js.
   ============================================================ */

(function (global) {
  "use strict";

  const TRACK_LABELS = {
    linux: "Linux",
    c: "C",
    math: "Matemática",
    mathfund: "Fundamentos",
    software: "Software",
    systems: "Sistemas",
    networks: "Redes",
    databases: "Banco de dados",
    security: "Segurança",
    geral: "Geral"
  };

  const catalog = Array.isArray(global.BOOKS) ? global.BOOKS : [];
  let query = "";
  let activeArea = "Todas";
  let view = null;

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function norm(value) {
    return String(value == null ? "" : value)
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().trim();
  }

  function areas() {
    return Array.from(new Set(catalog.map(b => b.area))).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }

  function matches(book) {
    if (activeArea !== "Todas" && book.area !== activeArea) return false;
    if (!query) return true;
    const haystack = [book.title, book.original, book.author, book.area,
      TRACK_LABELS[book.track] || book.track, book.level, book.license, book.note];
    return haystack.some(x => norm(x).includes(query));
  }

  function cardHTML(book) {
    const label = TRACK_LABELS[book.track] || book.track || "Geral";
    return `
<article class="card book-card">
  <div class="meta">
    <span class="pill info">${esc(book.area)}</span>
    <span class="pill">${esc(label)}</span>
    <span class="pill success">${esc(book.license)}</span>
  </div>
  <h3>${esc(book.title)}</h3>
  ${book.original && book.original !== book.title ? `<p class="muted small">Original: ${esc(book.original)}</p>` : ""}
  <p class="small">${esc(book.note || "")}</p>
  <p class="muted small">${esc(book.author)} · ${esc(book.level)}</p>
  <a class="pdf-link" href="${esc(book.url)}" target="_blank" rel="noopener noreferrer"
     aria-label="Abrir PDF ${esc(book.title)} em nova aba">Abrir PDF ↗</a>
</article>`;
  }

  function paint() {
    if (!view) return;
    const grid = view.querySelector("#booksGrid");
    const count = view.querySelector("#booksCount");
    const filters = view.querySelector("#booksFilters");
    if (!grid || !count || !filters) return;

    const found = catalog.filter(matches);
    count.textContent = `${found.length} de ${catalog.length} PDF${catalog.length === 1 ? "" : "s"}`;
    grid.innerHTML = found.length
      ? found.map(cardHTML).join("")
      : `<p class="muted">Nenhum PDF encontrado. Tente outro termo ou selecione “Todas”.</p>`;

    filters.innerHTML = ["Todas"].concat(areas()).map(area => {
      const selected = activeArea === area;
      return `<button type="button" class="${selected ? "active" : ""}" data-area="${esc(area)}"
        onclick="Books.filter(this)" aria-pressed="${selected}">${esc(area)}</button>`;
    }).join("");
  }

  function renderPage(container) {
    view = container;
    view.innerHTML = `
<div class="eyebrow">Fontes legais e gratuitas</div>
<h1 class="h1">Livros em PDF</h1>
<p class="sub">Obras de domínio público ou com licença aberta, linkadas diretamente à fonte oficial: OpenStax, TLDP, IETF e documentação dos projetos. Regra anti-paralisia: escolha <b>um</b> livro principal por trilha e estude com as aulas e laboratórios do Forge.</p>
<label class="field" style="display:block;margin-bottom:12px">
  <span class="small">Buscar por título, autor, área ou licença</span>
  <input id="booksSearch" class="field" type="search" placeholder="Ex.: cálculo, HTTP, PostgreSQL..." autocomplete="off"
         value="${esc(query)}" oninput="Books.search(this.value)" aria-label="Buscar livros em PDF">
</label>
<div class="tabs" id="booksFilters" role="group" aria-label="Filtrar PDFs por área"></div>
<p class="muted small" id="booksCount" aria-live="polite"></p>
<h2 class="small muted" style="margin:12px 0 6px">Resultados</h2>
<div class="grid3" id="booksGrid"></div>`;
    paint();
  }

  function search(value) {
    query = norm(value);
    paint();
  }

  function filter(button) {
    if (!button || !button.dataset) return;
    const next = button.dataset.area;
    const wasFocused = button === document.activeElement;
    activeArea = next || "Todas";
    paint();
    if (wasFocused && view) {
      const replacement = Array.from(view.querySelectorAll("#booksFilters button"))
        .find(b => b.dataset.area === activeArea);
      if (replacement) replacement.focus();
    }
  }

  global.BooksPage = Object.freeze({ renderPage, count: () => catalog.length });
  global.Books = Object.freeze({ search, filter, render: paint });
})(window);

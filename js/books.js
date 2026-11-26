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

  function cardHTML(book, index) {
    const label = TRACK_LABELS[book.track] || book.track || "Geral";
    const id = typeof BOOKS_META !== "undefined" ? BOOKS_META.idFor(book.title) : String(index);
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
  <p class="small book-card-status" data-book-id="${esc(id)}"><span class="muted">Situação: consultando biblioteca local…</span></p>
  <div class="actions">
    <button type="button" onclick="BookUI.open('${esc(id)}')" aria-label="Abrir detalhes e biblioteca interna de ${esc(book.title)}">Abrir na biblioteca FORGE →</button>
    <button type="button" class="secondary study-book-btn" onclick="Study.startFromBook(${Number(index) || 0})" aria-label="Iniciar sessão de estudo guiado de ${esc(book.title)}">Estudar com o tutor</button>
  </div>
</article>`;
  }

  async function paintStatus() {
    if (!view || typeof BookStore === "undefined") return;
    try {
      const rows = await BookStore.listBooks();
      const map = new Map(rows.map(r => [r.id, r]));
      view.querySelectorAll(".book-card-status").forEach(el => {
        const info = map.get(el.dataset.bookId);
        if (!info) { el.innerHTML = '<span class="muted">Situação: disponível na fonte · não baixado</span>'; return; }
        const parts = [info.downloaded ? "<b>PDF no FORGE</b>" : '<span class="muted">PDF não baixado</span>'];
        if (info.extracted) parts.push(info.scanned ? "sem texto selecionável" : `texto extraído (${info.pagesReady}/${info.totalPages} p.)`);
        if (info.lastPage) parts.push(`p. ${info.lastPage}`);
        if (info.answered) parts.push(`${info.correct}/${info.answered} acertos`);
        el.innerHTML = `Situação: ${parts.join(" · ")}`;
      });
    } catch (_) { /* status é informativo; catálogo continua utilizável */ }
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
      ? found.map(b => cardHTML(b, catalog.indexOf(b))).join("")
      : `<p class="muted">Nenhum PDF encontrado. Tente outro termo ou selecione “Todas”.</p>`;
    paintStatus();

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
<p class="callout small">Abra um livro para baixar/importar o PDF, ler no leitor interno e gerar questões com origem rastreável. A fonte oficial aparece apenas como referência legítima; links externos não substituem o estudo dentro do FORGE.</p>
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
    paintStatus();
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

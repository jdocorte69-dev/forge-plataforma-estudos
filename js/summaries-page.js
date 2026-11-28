/* ============================================================
   FORGE 4.0 — summaries-page.js
   Aba "Livros & Resumos": índice pesquisável dos 233 resumos e
   leitor responsivo (TOC, tipografia, largura, progresso, setas).
   Nenhum HTML do markdown é confiado: tudo é escapado antes de
   aplicar a formatação inline. Expõe window.SummariesPage.
   ============================================================ */

(function () {
  "use strict";

  const ui = {
    query: "",
    book: "",
    theme: "",
    limit: 40,
    fontSize: 17,
    width: "normal",
    currentId: null,
    cleanup: null,
    root: null
  };

  const READER_KEY = "summaryProgress";

  function idx() {
    return (typeof window !== "undefined" && window.BooksSummariesIndex) ? window.BooksSummariesIndex : null;
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function getState() {
    return (typeof Storage !== "undefined" && typeof Storage.get === "function") ? Storage.get() : {};
  }

  function progressMap() {
    const s = getState();
    const forge4 = s.forge4 && typeof s.forge4 === "object" ? s.forge4 : {};
    const raw = forge4[READER_KEY];
    return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  }

  function saveProgress(id, patch) {
    if (typeof Storage === "undefined" || typeof Storage.save !== "function") return;
    const s = Storage.get();
    if (!s.forge4 || typeof s.forge4 !== "object") s.forge4 = {};
    if (!s.forge4[READER_KEY] || typeof s.forge4[READER_KEY] !== "object") s.forge4[READER_KEY] = {};
    s.forge4[READER_KEY][id] = { ...(s.forge4[READER_KEY][id] || {}), ...patch, at: new Date().toISOString() };
    Storage.save();
  }

  /* ---------- Markdown → HTML (subconjunto seguro) ---------- */

  function inline(text) {
    const codes = [];
    let value = esc(text).replace(/`([^`]+)`/g, (_, code) => {
      codes.push(code);
      return "\u0000C" + (codes.length - 1) + "\u0000";
    });
    value = value.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return value.replace(/\u0000C(\d+)\u0000/g, (_, n) => "<code>" + codes[Number(n)] + "</code>");
  }

  function renderMarkdown(markdown) {
    const lines = String(markdown || "").split(/\r?\n/);
    const out = [];
    let paragraph = [];
    let list = null;
    let i = 0;
    const flushParagraph = () => {
      if (paragraph.length) out.push("<p>" + inline(paragraph.join(" ")) + "</p>");
      paragraph = [];
    };
    const flushList = () => {
      if (list) out.push(`<${list.tag}>${list.items.join("")}</${list.tag}>`);
      list = null;
    };
    while (i < lines.length) {
      const line = lines[i];
      if (/^```/.test(line.trim())) {
        flushParagraph(); flushList();
        const lang = line.trim().replace(/^```/, "").trim();
        const code = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i].trim())) code.push(lines[i++]);
        i++;
        out.push(`<pre><code${lang ? ' class="language-' + esc(lang) + '"' : ""}>${esc(code.join("\n"))}</code></pre>`);
        continue;
      }
      if (!line.trim()) { flushParagraph(); flushList(); i++; continue; }
      if (/^---+\s*$/.test(line)) { flushParagraph(); flushList(); out.push("<hr>"); i++; continue; }
      const heading = /^(#{2,4})\s+(.+)$/.exec(line);
      if (heading) {
        flushParagraph(); flushList();
        const level = Math.min(4, heading[1].length);
        const text = idx().normalizeMath(heading[2]);
        const slug = "sec-" + idx().fold(text).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        out.push(`<h${level} id="${esc(slug)}">${inline(text)}</h${level}>`);
        i++; continue;
      }
      const quote = /^>\s?(.*)$/.exec(line);
      if (quote) {
        flushParagraph(); flushList();
        out.push("<blockquote>" + inline(quote[1]) + "</blockquote>");
        i++; continue;
      }
      const task = /^[-*]\s+\[([ xX])\]\s+(.*)$/.exec(line);
      if (task) {
        flushParagraph();
        if (!list || list.tag !== "ul") { flushList(); list = { tag: "ul", items: [] }; }
        list.items.push(`<li class="task"><input type="checkbox" disabled aria-label="Tarefa ${task[1].toLowerCase() === "x" ? "concluída" : "pendente"}" ${task[1].toLowerCase() === "x" ? "checked" : ""}> ${inline(task[2])}</li>`);
        i++; continue;
      }
      const bullet = /^[-*]\s+(.+)$/.exec(line);
      const ordered = /^\d+[.)]\s+(.+)$/.exec(line);
      if (bullet || ordered) {
        flushParagraph();
        const tag = bullet ? "ul" : "ol";
        if (!list || list.tag !== tag) { flushList(); list = { tag, items: [] }; }
        list.items.push("<li>" + inline((bullet || ordered)[1]) + "</li>");
        i++; continue;
      }
      flushList();
      paragraph.push(line.trim());
      i++;
    }
    flushParagraph(); flushList();
    return out.join("\n");
  }

  /* ---------- Lista ---------- */

  function listHTML() {
    const lib = idx();
    if (!lib) return '<p class="muted">Índice de resumos indisponível.</p>';
    const stats = lib.stats();
    const result = lib.search(ui.query, { book: ui.book, theme: ui.theme });
    const shown = result.slice(0, ui.limit);
    const books = lib.books();
    const themes = lib.themes();

    const groups = books.map(book => {
      const items = shown.filter(item => item.bookSlug === book.slug);
      if (!items.length) return "";
      const rows = items.map(item => {
        const done = progressMap()[item.id]?.read ? " ✓" : "";
        return `<li><button type="button" class="summary-link" onclick="SummariesPage.open('${esc(item.id)}')">
          <span class="summary-link__n">${item.n ? String(item.n).padStart(2, "0") : "G"}</span>
          <span class="summary-link__title">${esc(item.title)}${done}</span>
          <span class="small muted">${item.words} palavras · ${esc(item.theme.replace(/_/g, " "))}</span>
        </button></li>`;
      }).join("");
      return `<details class="summary-group" ${ui.query || ui.book || ui.theme ? "open" : ""}>
        <summary><b>${esc(book.title)}</b> <span class="small muted">${esc(book.author)} · ${book.chapters.length} resumos</span></summary>
        <ul class="summary-list">${rows}</ul>
      </details>`;
    }).join("");

    return `
<div class="eyebrow">Acervo local · sem OCR novo</div>
<h1 class="h1">Livros &amp; Resumos</h1>
<p class="sub">${stats.summaries} resumos autorais de ${stats.books} livros, organizados em ${stats.themes} temas. O texto é lido do acervo local, sem serviços externos.</p>
<p class="forge4-metric">${stats.summaries} resumos · ${stats.words.toLocaleString("pt-BR")} palavras indexadas</p>

<section class="card forge4-panel" aria-labelledby="sumSearchTitle">
  <h2 id="sumSearchTitle" style="margin-top:0">Buscar no acervo</h2>
  <div class="summary-filters">
    <div>
      <label for="sumQuery">Título, tema ou livro</label>
      <input id="sumQuery" class="field" type="search" value="${esc(ui.query)}" placeholder="Ex.: logaritmos, combinatória, Iezzi" oninput="SummariesPage.setQuery(this.value)">
    </div>
    <div>
      <label for="sumBook">Livro</label>
      <select id="sumBook" onchange="SummariesPage.setBook(this.value)">
        <option value="">Todos os livros</option>
        ${books.map(b => `<option value="${esc(b.slug)}" ${ui.book === b.slug ? "selected" : ""}>${esc(b.title)}</option>`).join("")}
      </select>
    </div>
    <div>
      <label for="sumTheme">Tema</label>
      <select id="sumTheme" onchange="SummariesPage.setTheme(this.value)">
        <option value="">Todos os temas</option>
        ${themes.map(t => `<option value="${esc(t.theme)}" ${ui.theme === t.theme ? "selected" : ""}>${esc(t.theme.replace(/_/g, " "))} (${t.count})</option>`).join("")}
      </select>
    </div>
  </div>
  <p class="small muted" role="status">${result.length} resultado${result.length === 1 ? "" : "s"}${result.length > shown.length ? ` · exibindo ${shown.length}` : ""}.</p>
</section>

<div class="summary-index" id="summaryIndex">${groups || '<p class="muted">Nenhum resumo corresponde aos filtros.</p>'}</div>
${result.length > shown.length ? '<div class="actions"><button type="button" onclick="SummariesPage.showMore()">Mostrar mais resultados</button></div>' : ""}`;
  }

  /* ---------- Leitor ---------- */

  function readerShell(item) {
    const prev = idx().sibling(item.id, -1);
    const next = idx().sibling(item.id, 1);
    const done = Boolean(progressMap()[item.id]?.read);
    return `
<div class="summary-reader" data-id="${esc(item.id)}">
  <div class="summary-reader__top">
    <button type="button" class="secondary" onclick="SummariesPage.back()">← Voltar ao índice</button>
    <p class="small muted">${esc(item.bookTitle)} · ${esc(item.author)} · ${item.n ? "Capítulo " + item.n : "Visão geral"}</p>
  </div>
  <h1 class="h1" id="summaryReaderTitle">${esc(item.title)}</h1>
  <div class="summary-toolbar" role="group" aria-label="Controles do leitor">
    <button type="button" onclick="SummariesPage.setFontSize(-1)" aria-label="Diminuir fonte">A−</button>
    <button type="button" onclick="SummariesPage.setFontSize(1)" aria-label="Aumentar fonte">A+</button>
    <button type="button" onclick="SummariesPage.setWidth()" aria-label="Alternar largura do texto">↔ Largura</button>
    <button type="button" class="${done ? "" : "secondary"}" onclick="SummariesPage.toggleRead()" aria-pressed="${done}">${done ? "✓ Lido" : "Marcar como lido"}</button>
    <span class="progress-track summary-progress" role="progressbar" aria-label="Progresso da leitura" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i style="width:0%"></i></span>
  </div>
  <div class="summary-reader__grid">
    <nav class="summary-toc" aria-label="Seções deste resumo"><p class="small muted">Carregando índice…</p></nav>
    <article class="summary-reader__body" id="summaryArticle" aria-labelledby="summaryReaderTitle" tabindex="-1">
      <p class="muted">Carregando resumo local…</p>
    </article>
  </div>
  <div class="actions summary-reader__nav">
    ${prev ? `<button type="button" class="secondary" onclick="SummariesPage.open('${esc(prev.id)}')">← ${esc(prev.title.slice(0, 40))}</button>` : "<span></span>"}
    ${next ? `<button type="button" onclick="SummariesPage.open('${esc(next.id)}')">${esc(next.title.slice(0, 40))} →</button>` : "<span></span>"}
  </div>
  <p class="small muted">Use ← e → para trocar de resumo e Esc para voltar ao índice.</p>
</div>`;
  }

  function showReader(item) {
    const view = getView();
    if (!view) return;
    ui.currentId = item.id;
    view.innerHTML = readerShell(item);
    attachKeyboard();
    idx().load(item.id).then(markdown => {
      if (ui.currentId !== item.id) return;
      const article = document.getElementById("summaryArticle");
      if (!article) return;
      article.innerHTML = renderMarkdown(markdown);
      article.style.fontSize = ui.fontSize + "px";
      article.dataset.width = ui.width;
      const toc = view.querySelector(".summary-toc");
      const sections = idx().sections(markdown);
      if (toc) {
        toc.innerHTML = sections.length
          ? `<p class="forge4-kicker">Neste resumo</p><ol>${sections.map((section, i) =>
              `<li><a href="#sec-${esc(idx().fold(section.title).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))}" onclick="event.preventDefault();SummariesPage.goSection('sec-${esc(idx().fold(section.title).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))}')">${String(i + 1).padStart(2, "0")} · ${esc(section.title)}</a></li>`).join("")}</ol>`
          : '<p class="small muted">Sem seções numeradas.</p>';
      }
      attachScroll();
    }).catch(error => {
      const article = document.getElementById("summaryArticle");
      if (article) article.innerHTML = `<p class="muted">Não foi possível abrir o resumo local: ${esc(error.message)}. Verifique se o acervo está disponível neste servidor.</p>`;
    });
  }

  function getView() {
    if (ui.root && typeof ui.root.innerHTML !== "undefined") return ui.root;
    return (typeof document !== "undefined") ? document.getElementById("view") : null;
  }

  function detach() {
    if (ui.cleanup) { ui.cleanup(); ui.cleanup = null; }
  }

  function attachKeyboard() {
    detach();
    if (typeof document === "undefined") return;
    const handler = event => {
      if (!ui.currentId) return;
      const tag = (event.target && event.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (event.key === "Escape") { event.preventDefault(); back(); return; }
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const sibling = idx().sibling(ui.currentId, event.key === "ArrowRight" ? 1 : -1);
      if (sibling) { event.preventDefault(); open(sibling.id); }
    };
    document.addEventListener("keydown", handler);
    ui.cleanup = () => document.removeEventListener("keydown", handler);
  }

  function attachScroll() {
    if (typeof window === "undefined") return;
    let last = 0;
    const handler = () => {
      const now = Date.now();
      if (now - last < 600) return;
      last = now;
      const article = document.getElementById("summaryArticle");
      if (!article || !ui.currentId) return;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.round(window.scrollY / max * 100));
      const bar = document.querySelector(".summary-progress");
      if (bar) {
        bar.setAttribute("aria-valuenow", String(pct));
        const fill = bar.querySelector("i");
        if (fill) fill.style.width = pct + "%";
      }
      if (pct >= 95 && !progressMap()[ui.currentId]?.read) saveProgress(ui.currentId, { read: true, pct });
    };
    window.addEventListener("scroll", handler, { passive: true });
    const previous = ui.cleanup;
    ui.cleanup = () => { if (previous) previous(); window.removeEventListener("scroll", handler); };
  }

  /* ---------- API ---------- */

  function renderPage(view) {
    if (!view || typeof view.innerHTML === "undefined") return;
    detach();
    ui.root = view;
    ui.currentId = null;
    view.innerHTML = listHTML();
  }

  // FORGE 8.0: monta o índice dentro do painel da biblioteca unificada.
  // A API antiga (renderPage) continua intacta para a rota legada.
  function mountInto(root) {
    renderPage(root || getView());
  }

  function refresh() {
    const view = getView();
    if (!view) return;
    if (ui.currentId) showReader(idx().find(ui.currentId));
    else renderPage(view);
  }

  function open(id) {
    const item = idx().find(id);
    if (!item) return;
    saveProgress(id, { opened: true });
    showReader(item);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function back() {
    detach();
    ui.currentId = null;
    const view = getView();
    if (view) renderPage(view);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function setQuery(value) {
    ui.query = String(value || "").slice(0, 120);
    ui.limit = 40;
    const view = getView();
    if (view) view.innerHTML = listHTML();
    const input = document.getElementById("sumQuery");
    if (input) { input.focus(); input.setSelectionRange(ui.query.length, ui.query.length); }
  }

  function setBook(value) { ui.book = String(value || ""); ui.limit = 40; refreshListOnly(); }
  function setTheme(value) { ui.theme = String(value || ""); ui.limit = 40; refreshListOnly(); }
  function showMore() { ui.limit += 40; refreshListOnly(); }

  function refreshListOnly() {
    const view = getView();
    if (!view) return;
    view.innerHTML = listHTML();
  }

  function setFontSize(delta) {
    ui.fontSize = Math.min(22, Math.max(14, ui.fontSize + delta * 1));
    const article = document.getElementById("summaryArticle");
    if (article) article.style.fontSize = ui.fontSize + "px";
  }

  function setWidth() {
    ui.width = ui.width === "normal" ? "wide" : "normal";
    const article = document.getElementById("summaryArticle");
    if (article) article.dataset.width = ui.width;
  }

  function goSection(slug) {
    const target = document.getElementById(slug);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggleRead() {
    if (!ui.currentId) return;
    const done = Boolean(progressMap()[ui.currentId]?.read);
    saveProgress(ui.currentId, { read: !done });
    refresh();
  }

  const api = {
    renderPage, mountInto, refresh, open, back, setQuery, setBook, setTheme, showMore,
    setFontSize, setWidth, goSection, toggleRead,
    state: ui, markdownToHTML: renderMarkdown
  };
  if (typeof window !== "undefined") window.SummariesPage = api;
})();

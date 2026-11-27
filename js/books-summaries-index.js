/* ============================================================
   FORGE 4.0 — books-summaries-index.js
   Índice local de 233 resumos. Metadados vêm de
   js/data-summaries-index.js (gerado sem re-OCR); o corpo markdown
   é buscado apenas quando o leitor abre um capítulo.
   Expõe window.BooksSummariesIndex.
   ============================================================ */

(function () {
  "use strict";

  const cache = new Map();
  const pending = new Map();

  function data() {
    return (typeof window !== "undefined" && window.FORGE_SUMMARIES_INDEX) || null;
  }

  function fold(value) {
    return String(value == null ? "" : value)
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function normalizeMath(value) {
    return String(value == null ? "" : value)
      .replace(/\\mathbb\{([A-Z])\}/g, (_, c) => ({ N: "ℕ", Z: "ℤ", Q: "ℚ", R: "ℝ", C: "ℂ" })[c] || c)
      .replace(/\\times/g, "×").replace(/\\cdot/g, "·").replace(/\\pm/g, "±")
      .replace(/\\Rightarrow/g, "⇒").replace(/\\rightarrow/g, "→")
      .replace(/\\le/g, "≤").replace(/\\ge/g, "≥").replace(/\\ne/g, "≠")
      .replace(/\\sqrt\{([^}]*)\}/g, "√$1")
      .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "$1/$2")
      .replace(/\\([A-Za-z]+)/g, "$1").replace(/\$/g, "");
  }

  function all() {
    const index = data();
    if (!index) return [];
    return index.books.flatMap(book => book.chapters.map(chapter => ({
      ...chapter,
      bookSlug: book.slug,
      bookTitle: book.title,
      author: book.author,
      level: book.level,
      area: book.area,
      bookPages: book.pages
    })));
  }

  function books() {
    const index = data();
    return index ? index.books : [];
  }

  function themes() {
    const counts = new Map();
    all().forEach(item => counts.set(item.theme, (counts.get(item.theme) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "pt-BR"))
      .map(([theme, count]) => ({ theme, count }));
  }

  function find(id) {
    return all().find(item => item.id === id) || null;
  }

  function sibling(id, direction) {
    const item = find(id);
    if (!item) return null;
    const book = books().find(b => b.slug === item.bookSlug);
    if (!book) return null;
    const index = book.chapters.findIndex(c => c.id === id);
    const next = book.chapters[index + direction];
    return next ? { ...next, bookSlug: book.slug, bookTitle: book.title, author: book.author,
      level: book.level, area: book.area, bookPages: book.pages } : null;
  }

  function search(query, options) {
    const opts = options || {};
    const terms = fold(query).split(/\s+/).filter(Boolean);
    const book = opts.book ? String(opts.book) : "";
    const theme = opts.theme ? String(opts.theme) : "";
    const results = all().filter(item => (!book || item.bookSlug === book) && (!theme || item.theme === theme));

    if (!terms.length) return results;
    return results.map(item => {
      const hayTitle = fold(item.title);
      const hayTheme = fold(item.theme);
      const hayBook = fold(item.bookTitle + " " + item.author);
      let score = 0;
      for (const term of terms) {
        if (hayTitle === term) score += 6;
        else if (hayTitle.includes(term)) score += 4;
        if (hayTheme.includes(term)) score += 3;
        if (hayBook.includes(term)) score += 2;
        if (fold(item.id).includes(term)) score += 1;
      }
      return { item, score };
    }).filter(entry => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id, "pt-BR"))
      .map(entry => entry.item);
  }

  function stats() {
    const items = all();
    return {
      books: books().length,
      summaries: items.length,
      words: items.reduce((sum, item) => sum + (Number(item.words) || 0), 0),
      themes: themes().length,
      overviews: items.filter(item => item.kind === "overview").length
    };
  }

  function load(id) {
    if (cache.has(id)) return Promise.resolve(cache.get(id));
    if (pending.has(id)) return pending.get(id);
    const item = find(id);
    if (!item) return Promise.reject(new Error("Resumo não encontrado: " + id));
    if (typeof fetch !== "function") {
      return Promise.reject(new Error("Este navegador não oferece fetch() para ler o resumo local."));
    }
    const task = fetch(encodeURI(item.path))
      .then(response => {
        if (!response.ok) throw new Error("HTTP " + response.status + " ao abrir " + item.path);
        return response.text();
      })
      .then(text => {
        const clean = normalizeMath(text);
        cache.set(id, clean);
        pending.delete(id);
        return clean;
      })
      .catch(error => {
        pending.delete(id);
        throw error;
      });
    pending.set(id, task);
    return task;
  }

  /* Sumários das 8 seções didáticas padrão, sem tocar no corpo do arquivo. */
  function sections(markdown) {
    const out = [];
    String(markdown || "").split(/\r?\n/).forEach((line, index) => {
      const match = /^###\s+(.+?)\s*$/.exec(line);
      if (!match) return;
      const text = normalizeMath(match[1]);
      const slug = fold(text).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "secao-" + index;
      out.push({ title: text, slug, line: index });
    });
    return out;
  }

  const api = { data, all, books, themes, find, sibling, search, stats, load, sections,
    normalizeMath, fold, cache };
  if (typeof window !== "undefined") window.BooksSummariesIndex = api;
})();

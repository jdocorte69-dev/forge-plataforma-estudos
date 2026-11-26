/* ============================================================
   FORGE — data-books-meta.js
   Metadados ADITIVOS do catálogo de PDFs. Não altera data-books.js.
   PageCount só é informado quando conhecido na fonte; nunca inventado.
   ============================================================ */

(function (global) {
  "use strict";

  const AREA_COLORS = {
    "Matemática": "#3b82f6",
    "Ciências": "#10b981",
    "Economia": "#f59e0b",
    "Programação": "#8b5cf6",
    "Linux e sistemas": "#14b8a6",
    "Banco de dados": "#ef4444",
    "Redes": "#6366f1"
  };

  const OVERRIDES = {
    /* Nenhuma página é declarada sem fonte verificável. */
  };

  function norm(value) {
    return String(value == null ? "" : value)
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().trim();
  }

  function idFor(value) {
    return norm(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "sem-titulo";
  }

  function sourceHost(book) {
    try { return new URL(book && book.url || "").hostname.replace(/^www\./, ""); }
    catch (_) { return "fonte externa"; }
  }

  function metaFor(book) {
    const extra = OVERRIDES[book && book.title] || {};
    return {
      id: idFor(book && book.title),
      language: extra.language || "en",
      pages: extra.pages == null ? null : Number(extra.pages),
      format: "PDF",
      source: sourceHost(book),
      cover: extra.cover || AREA_COLORS[book && book.area] || "#64748b"
    };
  }

  global.BOOKS_META = Object.freeze({ idFor, metaFor, sourceHost, AREA_COLORS: Object.freeze(AREA_COLORS) });
})(window);

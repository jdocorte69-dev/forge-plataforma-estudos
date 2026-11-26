/* ============================================================
   FORGE — books-store.js
   Armazenamento local real de PDFs, texto extraído, progresso e
   questões em IndexedDB. Nenhum PDF vai para localStorage e nenhum
   dado é enviado a serviço externo pelo FORGE.
   ============================================================ */

(function (global) {
  "use strict";

  const DB_NAME = "forge-books";
  const DB_VERSION = 1;
  const STORES = ["pdfs", "texts", "progress", "questions"];
  let dbPromise = null;

  function idFor(title) {
    if (global.BOOKS_META && typeof global.BOOKS_META.idFor === "function") return global.BOOKS_META.idFor(title);
    return String(title || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "sem-titulo";
  }

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!global.indexedDB) return reject(new Error("IndexedDB indisponível neste navegador."));
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        STORES.forEach(name => { if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: "id" }); });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error("Falha ao abrir IndexedDB."));
      req.onblocked = () => reject(new Error("Bloqueio de versão do IndexedDB; feche outras abas do FORGE."));
    }).catch(err => { dbPromise = null; throw err; });
    return dbPromise;
  }

  function done(tx) {
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error("Falha na transação IndexedDB."));
      tx.onabort = () => reject(tx.error || new Error("Transação abortada."));
    });
  }

  async function put(store, record) {
    const db = await openDB();
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).put(record);
    await done(tx);
    return record;
  }

  async function get(store, id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(store, "readonly").objectStore(store).get(String(id));
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error || new Error("Falha ao ler IndexedDB."));
    });
  }

  async function remove(store, id) {
    const db = await openDB();
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).delete(String(id));
    await done(tx);
  }

  async function all(store) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(store, "readonly").objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error || new Error("Falha ao listar IndexedDB."));
    });
  }

  /* ---------------- validação de PDF ---------------- */

  function validatePdfBytes(bytes) {
    const b = bytes && bytes.length ? bytes : null;
    if (!b || b.length < 64) return false;
    const head = String.fromCharCode.apply(null, Array.from(b.slice(0, 5)));
    if (head !== "%PDF-") return false;
    const tail = String.fromCharCode.apply(null, Array.from(b.slice(Math.max(0, b.length - 1024))));
    return tail.indexOf("%%EOF") !== -1;
  }

  async function digest(bytes) {
    if (!global.crypto || !crypto.subtle) return null;
    try {
      const hash = await crypto.subtle.digest("SHA-256", bytes.slice(0));
      return Array.from(new Uint8Array(hash)).map(x => x.toString(16).padStart(2, "0")).join("");
    } catch (_) { return null; }
  }

  /* ---------------- PDFs ---------------- */

  async function putPdf(id, info) {
    return put("pdfs", {
      id: String(id),
      blob: info.blob,
      size: info.size || (info.blob && info.blob.size) || 0,
      sha256: info.sha256 || null,
      sourceUrl: info.sourceUrl || "",
      origin: info.origin || "importado",
      fetchedAt: info.fetchedAt || new Date().toISOString()
    });
  }

  function getPdf(id) { return get("pdfs", id); }

  async function listBooks() {
    const [pdfs, texts, progresses] = await Promise.all([all("pdfs"), all("texts"), all("progress")]);
    const map = new Map();
    pdfs.forEach(p => map.set(p.id, { id: p.id, downloaded: true, size: p.size, origin: p.origin, fetchedAt: p.fetchedAt }));
    texts.forEach(t => map.set(t.id, { ...(map.get(t.id) || { id: t.id, downloaded: false }), extracted: true, totalPages: t.totalPages, pagesReady: t.pages.length, scanned: t.scanned }));
    progresses.forEach(p => map.set(p.id, { ...(map.get(p.id) || { id: p.id, downloaded: false }), lastPage: p.lastPage || 1, pagesRead: p.pagesRead || {}, answered: p.answered || 0, correct: p.correct || 0 }));
    return Array.from(map.values());
  }

  async function deleteBook(id) {
    for (const store of STORES) await remove(store, id);
    return true;
  }

  async function downloadPdf(book, onProgress) {
    const report = (obj) => { if (typeof onProgress === "function") onProgress(obj); };
    let response;
    try {
      response = await fetch(book.url, { mode: "cors", credentials: "omit", cache: "no-store" });
    } catch (err) {
      const error = new Error("A fonte não permite download direto pelo navegador (CORS). Use a fonte legítima e importe o arquivo baixado.");
      error.code = "CORS_BLOCKED";
      throw error;
    }
    if (!response.ok) {
      const error = new Error(`Falha no download: HTTP ${response.status}.`);
      error.code = "HTTP_ERROR";
      throw error;
    }
    const total = Number(response.headers.get("content-length")) || 0;
    let chunks = [];
    let received = 0;
    if (response.body && typeof response.body.getReader === "function") {
      const reader = response.body.getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        report({ received, total, percent: total ? Math.min(100, Math.round(received * 100 / total)) : null });
      }
    } else {
      const buf = new Uint8Array(await response.arrayBuffer());
      chunks = [buf];
      received = buf.length;
      report({ received, total: received, percent: 100 });
    }
    const bytes = new Uint8Array(received);
    let offset = 0;
    chunks.forEach(c => { bytes.set(c, offset); offset += c.length; });
    if (!validatePdfBytes(bytes)) {
      const error = new Error("O arquivo recebido não é um PDF válido.");
      error.code = "INVALID_PDF";
      throw error;
    }
    const sha256 = await digest(bytes);
    const id = idFor(book.title);
    const existing = await getPdf(id);
    if (existing && existing.sha256 && sha256 && existing.sha256 === sha256) return existing;
    const blob = new Blob([bytes], { type: "application/pdf" });
    report({ received, total: received, percent: 100, phase: "salvando" });
    return putPdf(id, { blob, size: bytes.length, sha256, sourceUrl: book.url, origin: "download" });
  }

  async function importPdf(file, title) {
    if (!file) throw new Error("Nenhum arquivo selecionado.");
    if (file.size > 250 * 1024 * 1024) {
      const error = new Error("Arquivo acima de 250 MB. Use um PDF menor neste navegador.");
      error.code = "TOO_LARGE";
      throw error;
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!validatePdfBytes(bytes)) {
      const error = new Error("Arquivo inválido: o conteúdo não começa com %PDF- ou está corrompido.");
      error.code = "INVALID_PDF";
      throw error;
    }
    const id = idFor(title);
    const sha256 = await digest(bytes);
    const existing = await getPdf(id);
    if (existing && existing.sha256 && sha256 && existing.sha256 === sha256) return existing;
    const blob = new Blob([bytes], { type: "application/pdf" });
    return putPdf(id, { blob, size: bytes.length, sha256, sourceUrl: "", origin: "importado" });
  }

  /* ---------------- texto extraído ---------------- */

  function getText(id) { return get("texts", id); }
  function putText(id, data) { return put("texts", { id: String(id), ...data }); }

  async function extractText(id, options) {
    const opts = options || {};
    const record = await getPdf(id);
    if (!record) throw new Error("Baixe ou importe o PDF antes de extrair texto.");
    if (!global.pdfjsLib) throw new Error("PDF.js indisponível.");
    if (global.pdfjsLib.GlobalWorkerOptions) global.pdfjsLib.GlobalWorkerOptions.workerSrc = "./vendor/pdfjs/pdf.worker.min.js";
    const bytes = new Uint8Array(await record.blob.arrayBuffer());
    const task = pdfjsLib.getDocument({ data: bytes });
    const pdf = await task.promise;
    const total = pdf.numPages;
    const wanted = Math.max(1, Math.min(total, Number(opts.maxPages) || total));
    const pages = [];
    for (let n = 1; n <= wanted; n++) {
      if (opts.shouldStop && opts.shouldStop()) break;
      const page = await pdf.getPage(n);
      const content = await page.getTextContent();
      const text = (content.items || []).map(item => String(item.str || "")).join(" ")
        .replace(/\s+/g, " ").trim();
      pages.push({ page: n, text });
      if (typeof opts.onProgress === "function") opts.onProgress({ page: n, total: wanted, text });
    }
    let chapters = [];
    if (global.BookQuestions && typeof global.BookQuestions.detectChapters === "function") {
      chapters = global.BookQuestions.detectChapters(pages);
    }
    const scanned = pages.length > 0 && pages.every(p => p.text.length < 40);
    const out = {
      pages, chapters, scanned, totalPages: total,
      coverage: pages.length,
      extractedAt: new Date().toISOString()
    };
    await putText(id, out);
    if (pdf.cleanup) await pdf.cleanup();
    if (task.destroy) task.destroy();
    return out;
  }

  /* ---------------- progresso e questões ---------------- */

  function getProgress(id) { return get("progress", id); }
  async function putProgress(id, patch) {
    const prev = (await get("progress", id)) || { id: String(id), pagesRead: {}, annotations: [], bookmarks: [], attempts: [] };
    return put("progress", { ...prev, ...(patch || {}), id: String(id), updatedAt: new Date().toISOString() });
  }
  function getQuestions(id) { return get("questions", id); }
  function putQuestions(id, data) { return put("questions", { ...(data || {}), id: String(id), savedAt: new Date().toISOString() }); }

  async function estimate() {
    if (!navigator.storage || !navigator.storage.estimate) return null;
    try {
      const e = await navigator.storage.estimate();
      return { usage: e.usage || 0, quota: e.quota || 0 };
    } catch (_) { return null; }
  }

  global.BookStore = Object.freeze({
    idFor, openDB, validatePdfBytes, listBooks, getPdf, putPdf, downloadPdf, importPdf,
    deleteBook, getText, putText, extractText, getProgress, putProgress,
    getQuestions, putQuestions, estimate
  });
})(window);

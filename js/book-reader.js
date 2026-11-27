/* ============================================================
   FORGE — book-reader.js
   Biblioteca integrada: detalhe do livro, download/importação,
   leitor PDF interno (PDF.js), extração e questões locais.
   Nenhuma leitura ou resposta exige sair da plataforma.
   ============================================================ */

(function (global) {
  "use strict";

  const state = {
    bookId: "", pdf: null, page: 1, scale: 1, searchQuery: "", searchResults: [],
    questions: [], results: [], graded: false, onlyErrors: false, token: 0,
    config: { chapterIndex: "", fromPage: "", toPage: "", count: 5, difficulty: "medium", types: ["mc", "tf", "concept"], mode: "estudo" }
  };

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function toast(message) {
    if (typeof global.toast === "function") global.toast(message);
    else console.log(message);
  }

  function books() { return Array.isArray(global.BOOKS) ? global.BOOKS : []; }

  function bookById(id) {
    const key = String(id || state.bookId || "");
    return books().find(b => global.BOOKS_META.idFor(b.title) === key) || null;
  }

  function currentId() {
    if (!state.bookId) {
      try { state.bookId = localStorage.getItem("forge.books.last") || ""; } catch (_) { state.bookId = ""; }
    }
    return state.bookId;
  }

  function setCurrent(id) {
    state.bookId = String(id || "");
    try { localStorage.setItem("forge.books.last", state.bookId); } catch (_) { /* sem persistência de rota */ }
  }

  function go(page, id) {
    if (id) setCurrent(id);
    if (typeof global.goToPage === "function") global.goToPage(page);
    else toast("Navegação interna indisponível.");
  }

  function fresh() { return ++state.token; }

  function isFresh(token) { return token === state.token; }

  function bytes(n) {
    if (!n) return "0 B";
    const u = ["B", "KB", "MB", "GB"];
    let i = 0, v = Number(n);
    while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
    return `${v.toFixed(i ? 1 : 0)} ${u[i]}`;
  }

  function progressPercent(info) {
    const total = Number(info && info.totalPages) || 0;
    const read = info && info.pagesRead ? Object.keys(info.pagesRead).length : 0;
    return total ? Math.min(100, Math.round(read * 100 / total)) : 0;
  }

  /* ---------------- detalhe do livro ---------------- */

  async function renderDetail(container) {
    const token = fresh();
    const id = currentId();
    const book = bookById(id);
    if (!book) {
      container.innerHTML = '<section class="card"><h1>Livro não encontrado</h1><button onclick="goToPage(\'books\')">Voltar à biblioteca</button></section>';
      return;
    }
    const meta = global.BOOKS_META.metaFor(book);
    let info = {}, text = null, progress = null, space = null;
    try {
      const [list, t, p, e] = await Promise.all([
        global.BookStore.listBooks(), global.BookStore.getText(id), global.BookStore.getProgress(id), global.BookStore.estimate()
      ]);
      info = list.find(x => x.id === id) || {};
      text = t; progress = p; space = e;
    } catch (err) { toast("Armazenamento local indisponível: " + err.message); }
    if (!isFresh(token)) return;

    const ready = Boolean(info.downloaded);
    const pct = progressPercent(info);
    container.innerHTML = `
<div class="eyebrow">Biblioteca FORGE · leitura interna</div>
<h1 class="h1">${esc(book.title)}</h1>
<div class="book-detail-grid">
  <div class="book-cover" style="--cover:${esc(meta.cover)}" role="img" aria-label="Capa de ${esc(book.title)}">
    <span class="book-cover-area">${esc(book.area)}</span>
    <strong>${esc(book.title)}</strong>
    <span class="book-cover-author">${esc(book.author)}</span>
  </div>
  <section class="card book-detail">
    <div class="meta"><span class="pill info">${esc(book.area)}</span><span class="pill success">${esc(book.license)}</span>
      <span class="pill">${esc(book.level)}</span><span class="pill">${esc(meta.format)}</span></div>
    <p class="small">${esc(book.note || "")}</p>
    <dl class="book-meta">
      <div><dt>Autor</dt><dd>${esc(book.author)}</dd></div>
      <div><dt>Título original</dt><dd>${esc(book.original || book.title)}</dd></div>
      <div><dt>Idioma do PDF</dt><dd>${esc(meta.language === "en" ? "Inglês" : meta.language)}</dd></div>
      <div><dt>Páginas</dt><dd>${meta.pages ? esc(meta.pages) : "Não informada pela fonte"}</dd></div>
      <div><dt>Fonte legítima</dt><dd>${esc(meta.source)}</dd></div>
      <div><dt>Tamanho local</dt><dd>${ready ? esc(bytes(info.size)) : "Não baixado"}</dd></div>
    </dl>
    <div class="book-status" id="bookStatus">
      <p><b>Download:</b> ${ready ? `concluído (${esc(info.origin === "download" ? "via FORGE" : "importado pelo usuário")})` : "não realizado"}</p>
      <p><b>Leitura:</b> ${text ? `${text.coverage}/${text.totalPages} páginas com texto extraído${text.scanned ? " ·PDF com imagem: sem texto selecionável" : ""}` : "texto ainda não extraído"}</p>
      <p><b>Progresso:</b> ${pct}% · última página ${esc(progress && progress.lastPage || 1)}</p>
      <div class="progress" aria-hidden="true"><div style="width:${pct}%"></div></div>
      <p class="small muted">Espaço usado pelo FORGE neste navegador: ${space ? esc(bytes(space.usage)) + " de " + esc(bytes(space.quota)) : "indisponível"}</p>
    </div>
    <p class="callout small" id="bookDownloadStatus">O PDF é aberto no leitor interno. A fonte externa serve apenas como referência legítima; algumas fontes bloqueiam download direto do navegador (CORS) — nesse caso, baixe na fonte e use “Importar PDF do dispositivo”.</p>
    <div class="actions book-actions">
      <button onclick="BookUI.download()">Baixar PDF</button>
      <button class="secondary" onclick="BookUI.pickFile()">Importar PDF do dispositivo</button>
      <button ${ready ? "" : "disabled"} onclick="BookUI.openReader()">Abrir leitor interno</button>
      <button ${ready ? "" : "disabled"} onclick="BookUI.extract()">Extrair texto</button>
      <button ${text ? "" : "disabled"} onclick="BookUI.openQuestions()">Gerar e responder questões</button>
      <button class="secondary" ${text ? "" : "disabled"} onclick="BookUI.tutor()">Usar no tutor</button>
      ${ready ? '<button class="ghost" onclick="BookUI.remove()">Excluir PDF baixado</button>' : ""}
    </div>
    <input type="file" id="bookImportInput" accept="application/pdf,.pdf" class="hidden" onchange="BookUI.importFile(this)">
    <p class="small"><a href="${esc(book.url)}" target="_blank" rel="noopener noreferrer">Ver fonte oficial do PDF ↗</a> (somente referência; a leitura acontece aqui).</p>
  </section>
</div>
${text && text.chapters && text.chapters.length ? `<section class="card">
  <h2>Capítulos detectados no conteúdo extraído</h2>
  <p class="small muted">Detecção heurística de títulos; confira a paginação no leitor.</p>
  <ul class="study-list">${text.chapters.map(c => `<li><b>${esc(c.title)}</b> · p. ${c.startPage}–${c.endPage}
    <button class="linklike" onclick="BookUI.openReader(${c.startPage})">Ler →</button></li>`).join("")}</ul>
</section>` : ""}`;
  }

  /* ---------------- ações da biblioteca ---------------- */

  async function download() {
    const book = bookById(currentId());
    if (!book) return;
    const status = document.getElementById("bookDownloadStatus");
    const setStatus = html => { if (status) status.innerHTML = html; };
    setStatus('<b>Baixando…</b><div class="progress"><div id="bookDownloadBar" style="width:0%"></div></div>');
    try {
      await global.BookStore.downloadPdf(book, p => {
        const bar = document.getElementById("bookDownloadBar");
        if (bar) bar.style.width = (p.percent == null ? 0 : p.percent) + "%";
        setStatus(`<b>Baixando…</b> ${p.percent == null ? esc(bytes(p.received)) : p.percent + "%"} ${p.phase ? "· " + esc(p.phase) : ""}
          <div class="progress"><div style="width:${p.percent == null ? 0 : p.percent}%"></div></div>`);
      });
      toast("PDF validado e armazenado no FORGE.");
      renderDetail(document.getElementById("view"));
    } catch (err) {
      const cors = err.code === "CORS_BLOCKED";
      setStatus(`${cors ? "<b>Download direto bloqueado pela fonte (CORS).</b> O FORGE não finge download: " : "<b>Falha:</b> "}${esc(err.message)}
        ${cors ? `<br><a href="${esc(book.url)}" target="_blank" rel="noopener noreferrer">Abrir fonte legítima ↗</a> · baixe o arquivo e clique em “Importar PDF do dispositivo”.` : ""}`);
      toast(err.message);
    }
  }

  function pickFile() { const input = document.getElementById("bookImportInput"); if (input) input.click(); }

  async function importFile(input) {
    const file = input && input.files && input.files[0];
    if (!file) return;
    const book = bookById(currentId());
    const status = document.getElementById("bookDownloadStatus");
    if (status) status.textContent = "Validando PDF local…";
    try {
      await global.BookStore.importPdf(file, book.title);
      toast("PDF validado e salvo na biblioteca do FORGE.");
      renderDetail(document.getElementById("view"));
    } catch (err) { toast(err.message); if (status) status.textContent = err.message; }
  }

  async function remove() {
    const book = bookById(currentId());
    if (!book || !confirm(`Excluir o PDF baixado, o texto extraído e o progresso local de “${book.title}”? Esta ação não apaga os dados gerais do FORGE.`)) return;
    try {
      await global.BookStore.deleteBook(global.BOOKS_META.idFor(book.title));
      toast("PDF e dados deste livro removidos deste navegador.");
      renderDetail(document.getElementById("view"));
    } catch (err) { toast(err.message); }
  }

  async function extract() {
    const id = currentId();
    const status = document.getElementById("bookDownloadStatus");
    try {
      const text = await global.BookStore.extractText(id, {
        maxPages: 120,
        onProgress: p => { if (status) status.textContent = `Extraindo texto: página ${p.page} de ${p.total}…`; }
      });
      toast(text.scanned ? "PDF sem texto selecionável (imagem). OCR não está disponível localmente." : `Texto extraído de ${text.coverage} página(s).`);
      renderDetail(document.getElementById("view"));
    } catch (err) { toast(err.message); if (status) status.textContent = err.message; }
  }

  async function tutor() {
    const id = currentId();
    const book = bookById(id);
    const text = await global.BookStore.getText(id);
    if (!text || !text.pages.length) return toast("Extraia o texto antes de usar o tutor.");
    const source = text.pages.slice(0, 25).map(p => `[p. ${p.page}] ${p.text}`).join("\n").slice(0, 60000);
    const key = `${id}::leitura-livro`;
    global.Storage.saveStudySession(key, {
      bookTitle: book.title, track: book.track, section: "Leitura do livro", text: source,
      sectionRef: `páginas 1–${Math.min(25, text.coverage)}`
    });
    go("study");
    setTimeout(() => {
      if (global.Study) {
        global.Study.openSession(key);
        global.Study.setTab("tutor");
        global.Study.useSessionText();
      }
    }, 30);
  }

  /* ---------------- leitor interno ---------------- */

  async function renderReader(container, pageNumber) {
    const token = fresh();
    const id = currentId();
    const book = bookById(id);
    if (!book) { container.innerHTML = '<section class="card"><h1>Livro não encontrado.</h1><button onclick="goToPage(\'books\')">Voltar</button></section>'; return; }
    container.innerHTML = '<section class="card reader-shell"><p>Carregando PDF no leitor interno…</p></section>';
    try {
      if (global.ForgePDF && typeof global.ForgePDF.ensure === "function") await global.ForgePDF.ensure();
      if (!global.pdfjsLib) throw new Error("PDF.js não foi carregado.");
      if (global.pdfjsLib.GlobalWorkerOptions) global.pdfjsLib.GlobalWorkerOptions.workerSrc = "./vendor/pdfjs/pdf.worker.min.js";
      const record = await global.BookStore.getPdf(id);
      if (!record) throw new Error("PDF não armazenado neste navegador.");
      const bytes = new Uint8Array(await record.blob.arrayBuffer());
      const task = pdfjsLib.getDocument({ data: bytes });
      const pdf = await task.promise;
      if (!isFresh(token)) { task.destroy && task.destroy(); return; }
      const progress = (await global.BookStore.getProgress(id)) || { bookmarks: [], annotations: [] };
      state.pdf = pdf;
      state.page = Math.max(1, Math.min(pdf.numPages, Number(pageNumber) || Number(progress.lastPage) || 1));
      renderReaderShell(container, book, pdf, progress);
      await drawPage();
      await savePage();
    } catch (err) {
      if (isFresh(token)) container.innerHTML = `<section class="card"><h1>Não foi possível abrir o PDF</h1><p>${esc(err.message)}</p><button onclick="BookUI.backToDetail()">Voltar ao livro</button></section>`;
    }
  }

  function renderReaderShell(container, book, pdf, progress) {
    container.innerHTML = `
<section class="card reader-shell" id="readerShell">
  <div class="row reader-toolbar">
    <button class="secondary" onclick="BookUI.backToDetail()">← Livro</button>
    <button class="secondary" onclick="BookUI.page(-1)" aria-label="Página anterior">◀</button>
    <label class="small">Página <input id="readerPageInput" type="number" min="1" max="${pdf.numPages}" value="${state.page}" onchange="BookUI.setPage(this.value)" aria-label="Número da página"></label>
    <span class="pill info" id="readerPageCount">${state.page} / ${pdf.numPages}</span>
    <button class="secondary" onclick="BookUI.page(1)" aria-label="Próxima página">▶</button>
    <button class="secondary" onclick="BookUI.zoom(-0.2)" aria-label="Diminuir zoom">−</button>
    <button class="secondary" onclick="BookUI.zoom(0.2)" aria-label="Aumentar zoom">+</button>
    <button class="secondary" onclick="BookUI.fit('width')">Ajustar largura</button>
    <button class="secondary" onclick="BookUI.fit('page')">Ajustar página</button>
    <button class="secondary" onclick="BookUI.fullscreen()">Tela cheia</button>
    <button class="secondary" onclick="BookUI.bookmark()" id="readerBookmarkBtn">${(progress.bookmarks || []).includes(state.page) ? "★ Marcador" : "☆ Marcador"}</button>
    <button onclick="BookUI.openQuestions()">Questões →</button>
  </div>
  <div class="reader-search">
    <input id="readerSearchInput" type="search" placeholder="Pesquisar no texto extraído deste PDF" aria-label="Pesquisar no PDF" oninput="BookUI.search(this.value)">
    <span class="small muted" id="readerSearchInfo"></span>
    <div id="readerSearchResults" class="reader-search-results"></div>
  </div>
  <div class="reader-stage" id="readerStage">
    <div class="reader-page-wrap">
      <canvas id="readerCanvas" aria-label="Página ${state.page} do PDF"></canvas>
      <div id="readerTextLayer" class="reader-text-layer" aria-label="Texto selecionável da página"></div>
    </div>
  </div>
  <aside class="reader-side">
    <h3>Anotações e marcadores</h3>
    <p class="small muted">Selecione um trecho na página (camada de texto) e registre sua anotação. Tudo fica neste navegador.</p>
    <textarea id="readerNoteInput" class="field" rows="3" placeholder="Minha anotação sobre o trecho selecionado"></textarea>
    <div class="actions"><button class="secondary" onclick="BookUI.saveAnnotation()">Salvar trecho + anotação</button></div>
    <div id="readerAnnotations"></div>
    <h3>Marcadores</h3><div id="readerBookmarks"></div>
  </aside>
</section>`;
    renderAnnotations(progress);
  }

  function renderAnnotations(progress) {
    const box = document.getElementById("readerAnnotations");
    const marks = document.getElementById("readerBookmarks");
    if (box) box.innerHTML = (progress.annotations || []).length
      ? `<ul class="study-list">${progress.annotations.slice(-8).reverse().map(a => `<li><b>p. ${a.page}</b> · “${esc(a.quote)}”${a.note ? `<br><span class="small">${esc(a.note)}</span>` : ""}</li>`).join("")}</ul>`
      : '<p class="small muted">Nenhuma anotação registrada.</p>';
    if (marks) marks.innerHTML = (progress.bookmarks || []).length
      ? `<ul class="study-list">${progress.bookmarks.map(p => `<li><button class="linklike" onclick="BookUI.setPage(${p})">Ir para p. ${p}</button></li>`).join("")}</ul>`
      : '<p class="small muted">Nenhum marcador.</p>';
  }

  async function drawPage() {
    if (!state.pdf) return;
    const canvas = document.getElementById("readerCanvas");
    const layer = document.getElementById("readerTextLayer");
    if (!canvas || !layer) return;
    const page = await state.pdf.getPage(state.page);
    const viewport = page.getViewport({ scale: state.scale });
    const dpr = Math.min(2, global.devicePixelRatio || 1);
    canvas.width = Math.floor(viewport.width * dpr);
    canvas.height = Math.floor(viewport.height * dpr);
    canvas.style.width = viewport.width + "px";
    canvas.style.height = viewport.height + "px";
    const ctx = canvas.getContext("2d");
    await page.render({
      canvasContext: ctx, viewport,
      transform: dpr === 1 ? undefined : [dpr, 0, 0, dpr, 0, 0]
    }).promise;
    const content = await page.getTextContent();
    layer.style.width = viewport.width + "px";
    layer.style.height = viewport.height + "px";
    layer.innerHTML = (content.items || []).map(item => {
      const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
      const size = (Math.abs(item.transform[2]) || 12) * state.scale;
      const left = tx[4];
      const top = viewport.height - tx[5] - size;
      const text = esc(item.str || "");
      const hit = state.searchQuery && BookQuestions.norm(item.str).includes(BookQuestions.norm(state.searchQuery));
      return `<span class="${hit ? "reader-hit" : ""}" style="left:${left}px;top:${top}px;font-size:${size}px;transform:scaleX(${Math.abs(item.transform[0]) / (item.transform[0] || 1)})">${text}</span>`;
    }).join("");
    const count = document.getElementById("readerPageCount");
    if (count) count.textContent = `${state.page} / ${state.pdf.numPages}`;
    const input = document.getElementById("readerPageInput");
    if (input) input.value = state.page;
    const btn = document.getElementById("readerBookmarkBtn");
    const p = await global.BookStore.getProgress(currentId());
    if (btn) btn.textContent = (p && (p.bookmarks || []).includes(state.page)) ? "★ Marcador" : "☆ Marcador";
  }

  async function savePage() {
    const id = currentId();
    const progress = (await global.BookStore.getProgress(id)) || {};
    const read = { ...(progress.pagesRead || {}) };
    read[state.page] = new Date().toISOString();
    await global.BookStore.putProgress(id, { lastPage: state.page, pagesRead: read });
  }

  async function setPage(n) {
    if (!state.pdf) return;
    state.page = Math.max(1, Math.min(state.pdf.numPages, Number(n) || 1));
    await drawPage();
    await savePage();
  }

  async function search(value) {
    state.searchQuery = String(value || "").trim();
    const info = document.getElementById("readerSearchInfo");
    const box = document.getElementById("readerSearchResults");
    if (!state.searchQuery) { state.searchResults = []; if (info) info.textContent = ""; if (box) box.innerHTML = ""; await drawPage(); return; }
    const text = await global.BookStore.getText(currentId());
    const needle = BookQuestions.norm(state.searchQuery);
    state.searchResults = text ? text.pages.filter(p => BookQuestions.norm(p.text).includes(needle))
      .map(p => ({ page: p.page, snippet: BookQuestions.clip(p.text, 180) })) : [];
    if (info) info.textContent = `${state.searchResults.length} ocorrência(s) no texto extraído`;
    if (box) box.innerHTML = state.searchResults.slice(0, 12).map(r =>
      `<button class="linklike" onclick="BookUI.setPage(${r.page})">p. ${r.page}</button> <span class="small">${esc(r.snippet)}</span><br>`).join("") || "Nenhuma ocorrência no texto extraído.";
    await drawPage();
  }

  async function saveAnnotation() {
    const sel = global.getSelection ? String(getSelection().toString() || "").trim() : "";
    const note = (document.getElementById("readerNoteInput") || {}).value || "";
    if (!sel) return toast("Selecione um trecho na camada de texto da página antes de anotar.");
    const id = currentId();
    const progress = (await global.BookStore.getProgress(id)) || {};
    const annotations = (progress.annotations || []).concat([{
      page: state.page, quote: sel.slice(0, 800), note: String(note).slice(0, 2000), at: new Date().toISOString()
    }]);
    await global.BookStore.putProgress(id, { annotations });
    renderAnnotations({ ...progress, annotations });
    const input = document.getElementById("readerNoteInput");
    if (input) input.value = "";
    toast("Anotação salva localmente.");
  }

  async function bookmark() {
    const id = currentId();
    const progress = (await global.BookStore.getProgress(id)) || {};
    const marks = new Set(progress.bookmarks || []);
    if (marks.has(state.page)) marks.delete(state.page); else marks.add(state.page);
    await global.BookStore.putProgress(id, { bookmarks: Array.from(marks).sort((a, b) => a - b) });
    renderAnnotations({ ...progress, bookmarks: Array.from(marks).sort((a, b) => a - b) });
    await drawPage();
  }

  async function fit(mode) {
    const stage = document.getElementById("readerStage");
    if (!stage || !state.pdf) return;
    const page = await state.pdf.getPage(state.page);
    const base = page.getViewport({ scale: 1 });
    if (mode === "width") state.scale = Math.max(0.3, (stage.clientWidth - 24) / base.width);
    else state.scale = Math.max(0.2, Math.min((stage.clientWidth - 24) / base.width, (stage.clientHeight - 24) / base.height));
    await drawPage();
  }

  async function zoom(delta) {
    state.scale = Math.max(0.3, Math.min(3, state.scale + Number(delta)));
    await drawPage();
  }

  function fullscreen() {
    const el = document.getElementById("readerShell");
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => toast("Tela cheia não permitida neste navegador."));
    else toast("Tela cheia não suportada neste navegador.");
  }

  /* ---------------- questões integradas ---------------- */

  async function renderQuestions(container) {
    const token = fresh();
    const id = currentId();
    const book = bookById(id);
    if (!book) { container.innerHTML = '<section class="card"><h1>Livro não encontrado.</h1></section>'; return; }
    const [text, stored, progress] = await Promise.all([
      global.BookStore.getText(id), global.BookStore.getQuestions(id), global.BookStore.getProgress(id)
    ]);
    if (!isFresh(token)) return;
    if (!text || !text.pages.length) {
      container.innerHTML = `<section class="card"><h1>Questões do livro</h1><p>Extraia o texto do PDF antes de gerar questões.</p><button onclick="BookUI.backToDetail()">Voltar ao livro</button></section>`;
      return;
    }
    state.questions = stored && stored.questions || [];
    state.results = stored && stored.lastResults || [];
    state.graded = Boolean(stored && stored.graded);
    const chapters = text.chapters || [];
    const c = state.config;
    container.innerHTML = `
<div class="eyebrow">Questões com origem rastreável</div>
<h1 class="h1">Questões · ${esc(book.title)}</h1>
<section class="card">
  <button class="secondary" onclick="BookUI.backToDetail()">← Livro</button>
  <h2>Configurar questões</h2>
  <p class="small muted">As questões são geradas localmente a partir do texto extraído (${text.coverage}/${text.totalPages} páginas). Cada item informa página, capítulo e trecho de origem. Sem IA externa e sem resposta inventada.</p>
  <div class="grid2">
    <label class="field">Capítulo
      <select id="qChapter">${chapters.map((ch, i) => `<option value="${i}" ${Number(c.chapterIndex) === i ? "selected" : ""}>${esc(ch.title)} · p. ${ch.startPage}–${ch.endPage}</option>`).join("")}</select>
    </label>
    <label class="field">Intervalo de páginas
      <span class="row"><input id="qFrom" type="number" min="1" placeholder="de" value="${esc(c.fromPage)}"><input id="qTo" type="number" min="1" placeholder="até" value="${esc(c.toPage)}"></span>
    </label>
    <label class="field">Quantidade <select id="qCount">${[5, 10, 15].map(n => `<option value="${n}" ${Number(c.count) === n ? "selected" : ""}>${n}</option>`).join("")}</select></label>
    <label class="field">Dificuldade <select id="qDifficulty">${[["easy", "Fácil"], ["medium", "Média"], ["hard", "Difícil"]].map(([v, l]) => `<option value="${v}" ${c.difficulty === v ? "selected" : ""}>${l}</option>`).join("")}</select></label>
    <label class="field">Modo <select id="qMode"><option value="estudo" ${c.mode === "estudo" ? "selected" : ""}>Estudo</option><option value="simulado" ${c.mode === "simulado" ? "selected" : ""}>Simulado</option></select></label>
    <fieldset class="field"><legend>Tipos</legend>${[["mc", "Múltipla escolha"], ["tf", "Verdadeiro/Falso"], ["interpretation", "Interpretação"], ["concept", "Conceitual"], ["application", "Aplicação"], ["discursive", "Discursiva"]].map(([v, l]) => `<label class="check"><input type="checkbox" name="qType" value="${v}" ${c.types.includes(v) ? "checked" : ""}> ${l}</label>`).join("")}</fieldset>
  </div>
  <div class="actions"><button onclick="BookUI.generateQuestions()">Gerar questões do conteúdo</button></div>
</section>
<section class="card"><div class="row"><h2>Questões</h2><button class="secondary" onclick="BookUI.showErrors()">${state.onlyErrors ? "Mostrar todas" : "Revisar erros"}</button></div>
  <div id="questionsList">${questionsHTML()}</div>
  <div class="actions"><button onclick="BookUI.gradeQuestions()">Corrigir respostas</button></div>
  <div id="questionsResults">${resultsHTML()}</div>
</section>
<section class="card"><h2>Desempenho</h2><div id="questionsPerformance">${performanceHTML(progress)}</div></section>`;
  }

  function questionsHTML() {
    if (!state.questions.length) return '<p class="small muted">Nenhuma questão gerada ainda. Configure e clique em “Gerar questões do conteúdo”.</p>';
    return state.questions.map((q, i) => {
      const hidden = state.onlyErrors && state.results[i] && state.results[i].correct !== false;
      if (hidden) return "";
      const source = `<p class="small muted">Origem: ${esc(q.source.chapter)} · página ${q.source.page}${q.source.altered ? " · enunciado alterado localmente" : ""} · “${esc(BookQuestions.clip(q.source.quote, 120))}”</p>`;
      let input = "";
      if (q.type === "mc") input = q.options.map((o, j) => `<label class="check"><input type="radio" name="answer${i}" value="${j}"> ${esc(o)}</label>`).join("");
      else if (q.type === "tf") input = '<label class="check"><input type="radio" name="answer' + i + '" value="verdadeiro"> Verdadeiro</label><label class="check"><input type="radio" name="answer' + i + '" value="falso"> Falso</label>';
      else input = `<textarea class="field" rows="4" name="answer${i}" placeholder="Escreva sua resposta com base no trecho"></textarea>`;
      return `<article class="book-question" data-i="${i}">
        <p><b>${i + 1}. [${esc(q.type)} · ${esc(q.difficulty)}]</b> ${esc(q.prompt).replace(/\n/g, "<br>")}</p>
        ${input}${source}</article>`;
    }).join("");
  }

  function resultsHTML() {
    if (!state.graded || !state.results.length) return "";
    return `<h3>Correção</h3>${state.results.map((r, i) => {
      const q = state.questions[i];
      if (state.onlyErrors && r.correct !== false) return "";
      const label = r.correct === true ? '<span class="pill success">certo</span>' : r.correct === false ? '<span class="pill warn">errado</span>' : `<span class="pill info">${esc(r.status)}</span>`;
      return `<div class="book-result"><p><b>${i + 1}.</b> ${label} ${esc(r.reference || "")}</p><p>${esc(r.explanation)}</p>${r.rubric ? `<p class="small"><b>Critérios:</b> ${esc(r.rubric)}</p>` : ""}</div>`;
    }).join("")}`;
  }

  function performanceHTML(progress) {
    const p = progress || {};
    const total = Number(p.answered) || 0;
    const correct = Number(p.correct) || 0;
    const pct = total ? Math.round(correct * 100 / total) : 0;
    const read = Object.keys(p.pagesRead || {}).length;
    return `<p>Questões respondidas: <b>${total}</b> · acertos: <b>${correct}</b> · erros: <b>${total - correct}</b> · aproveitamento: <b>${pct}%</b></p>
      <p>Páginas lidas: <b>${read}</b> · última página: <b>${esc(p.lastPage || 1)}</b></p>
      <p class="small muted">Questões discursivas e de interpretação recebem critérios, não nota automática: o FORGE não finge correção de texto livre.</p>`;
  }

  async function generateQuestions() {
    const text = await global.BookStore.getText(currentId());
    const types = Array.from(document.querySelectorAll('input[name="qType"]:checked')).map(x => x.value);
    state.config = {
      chapterIndex: (document.getElementById("qChapter") || {}).value || "",
      fromPage: (document.getElementById("qFrom") || {}).value || "",
      toPage: (document.getElementById("qTo") || {}).value || "",
      count: (document.getElementById("qCount") || {}).value || 5,
      difficulty: (document.getElementById("qDifficulty") || {}).value || "medium",
      mode: (document.getElementById("qMode") || {}).value || "estudo",
      types: types.length ? types : ["mc"]
    };
    const out = global.BookQuestions.generate({ ...state.config, pages: text.pages, chapters: text.chapters });
    if (!out.questions.length) return toast(out.error || "Não foi possível gerar questões.");
    state.questions = out.questions;
    state.results = [];
    state.graded = false;
    state.onlyErrors = false;
    await global.BookStore.putQuestions(currentId(), { questions: state.questions, lastResults: [], graded: false, attempts: (await global.BookStore.getQuestions(currentId()) || {}).attempts || [] });
    const list = document.getElementById("questionsList");
    if (list) list.innerHTML = questionsHTML();
    const results = document.getElementById("questionsResults");
    if (results) results.innerHTML = "";
    toast(`${state.questions.length} questões geradas a partir de trechos reais.`);
  }

  async function gradeQuestions() {
    if (!state.questions.length) return toast("Gere questões antes de corrigir.");
    const results = state.questions.map((q, i) => {
      const field = document.querySelector(`[name="answer${i}"]:checked`) || document.querySelector(`[name="answer${i}"]`);
      const value = field ? (field.value || "") : "";
      return global.BookQuestions.grade(q, value);
    });
    state.results = results;
    state.graded = true;
    const id = currentId();
    const book = bookById(id);
    const progress = (await global.BookStore.getProgress(id)) || {};
    const answered = (Number(progress.answered) || 0) + results.filter(r => r.status !== "sem-resposta").length;
    const correct = (Number(progress.correct) || 0) + results.filter(r => r.correct === true).length;
    const attempts = (progress.attempts || []).concat([{ at: new Date().toISOString(), count: results.length, correct: results.filter(r => r.correct === true).length }]).slice(-20);
    await global.BookStore.putProgress(id, { answered, correct, attempts });
    const stored = (await global.BookStore.getQuestions(id)) || {};
    await global.BookStore.putQuestions(id, { ...stored, lastResults: results, graded: true });
    results.forEach((r, i) => {
      if (r.correct === false) {
        const q = state.questions[i];
        global.Storage.addMistake(`livro:${id}`, book.track || "geral", `[${book.title}] ${BookQuestions.clip(q.prompt, 160)}`, `p. ${q.source.page}`, "");
      }
    });
    const box = document.getElementById("questionsResults");
    if (box) box.innerHTML = resultsHTML();
    const perf = document.getElementById("questionsPerformance");
    if (perf) perf.innerHTML = performanceHTML({ ...progress, answered, correct, attempts });
    toast("Correção concluída; erros registrados no caderno.");
  }

  function showErrors() {
    state.onlyErrors = !state.onlyErrors;
    const list = document.getElementById("questionsList");
    if (list) list.innerHTML = questionsHTML();
    const results = document.getElementById("questionsResults");
    if (results) results.innerHTML = resultsHTML();
  }

  global.BookUI = Object.freeze({
    open: (id) => go("book", id), backToLibrary: () => go("books"), backToDetail: () => go("book"),
    download, pickFile, importFile, remove, extract, tutor,
    openReader: (page) => renderReader(document.getElementById("view"), page),
    openQuestions: () => go("questions"), renderDetail, renderReader, renderQuestions,
    page: d => setPage(state.page + Number(d)), setPage, zoom, fit, fullscreen, bookmark,
    search, saveAnnotation, generateQuestions, gradeQuestions, showErrors
  });
  global.BookReader = Object.freeze({ renderDetail, renderReader, renderQuestions, state });
})(window);

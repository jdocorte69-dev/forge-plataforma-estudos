/* ============================================================
   FORGE — smoke test da evolução de estudos
   Executa sem dependências externas: node tests/forge-study-smoke.mjs
   Usa um DOM mínimo em memória e os scripts reais do repositório.
   ============================================================ */

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";

const ROOT = path.resolve(process.cwd());
const read = rel => fs.readFileSync(path.join(ROOT, rel), "utf8");
const results = [];

function check(name, fn) {
  try { fn(); results.push(`PASS · ${name}`); }
  catch (err) { results.push(`FAIL · ${name} · ${err.message}`); process.exitCode = 1; }
}

async function checkAsync(name, fn) {
  try { await fn(); results.push(`PASS · ${name}`); }
  catch (err) { results.push(`FAIL · ${name} · ${err.message}`); process.exitCode = 1; }
}

function prepareImportContext(seed) {
  const isolated = buildContext(seed);
  vm.runInContext(read("js/storage.js"), isolated.context, { filename: "js/storage.js" });
  vm.runInContext(`
    function toast(m) { window.__toast = String(m); }
    window.FileReader = class {
      readAsText(file) { this.result = file.content; this.onload(); }
    };
  `, isolated.context, { filename: "import-stubs.js" });
  return isolated;
}

function makeElement(id) {
  const children = new Map();
  return {
    id, value: "", innerHTML: "", checked: false, textContent: "", dataset: {}, style: {},
    classList: { toggle() {}, add() {}, remove() {}, contains() { return false; } },
    setAttribute() {}, removeAttribute() {}, addEventListener() {}, dispatchEvent() {},
    scrollIntoView() {}, focus() {},
    querySelector(selector) {
      if (!children.has(selector)) children.set(selector, makeElement(selector));
      return children.get(selector);
    },
    querySelectorAll() { return []; }
  };
}

function buildContext(seed) {
  const elements = new Map();
  const storage = new Map(Object.entries(seed || {}));
  const getElementById = id => {
    if (!elements.has(id)) elements.set(id, makeElement(id));
    return elements.get(id);
  };
  const localStorage = {
    getItem: k => (storage.has(k) ? storage.get(k) : null),
    setItem: (k, v) => storage.set(k, String(v)),
    removeItem: k => storage.delete(k)
  };
  const document = {
    getElementById,
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => makeElement("temp"),
    addEventListener() {}, removeEventListener() {},
    body: { appendChild() {} },
    documentElement: { dataset: {}, style: {}, classList: { toggle() {} } }
  };
  const sandbox = {
    document, localStorage, console,
    navigator: {}, location: { protocol: "https:" },
    setTimeout, clearTimeout, Date, Math, JSON, Object, Array, String, Number, Boolean,
    Promise, Map, Set, TextEncoder, URL, Event: class {}, FileReader: class {},
    scrollTo() {}
  };
  const context = vm.createContext(sandbox);
  sandbox.window = sandbox; // no navegador, window É o objeto global
  return { context, window: sandbox, elements, getElementById, storage };
}

/* ---------- cenário principal ---------- */

const env = buildContext();
const { context, window, getElementById } = env;
for (const file of ["js/data.js", "js/data-books.js", "js/storage.js", "js/books.js"]) {
  vm.runInContext(read(file), context, { filename: file });
}
vm.runInContext(`
  function toast(m) { window.__toast = String(m); }
  function goToPage(p) { window.__page = String(p); }
  function openLesson(id) { window.__lesson = String(id); }
`, context, { filename: "stubs.js" });
vm.runInContext(read("js/study.js"), context, { filename: "js/study.js" });

check("a página de estudo renderiza o tutorial interativo", () => {
  const view = getElementById("view");
  window.StudyPage.renderPage(view);
  assert.match(view.innerHTML, /Aprenda a estudar/);
  assert.match(view.innerHTML, /Tutorial em 9 etapas/);
  assert.match(view.innerHTML, /Privacidade e limites/);
});

check("o tutor expõe 12 modos com comportamento", () => {
  window.Study.setTab("tutor");
  const html = getElementById("studyPanel").innerHTML;
  for (const label of ["Explique", "Não entendi", "Do zero", "Exemplo", "Me teste", "Exercícios",
    "Analise meu raciocínio", "Feynman", "Resumo de revisão", "Compare", "Aplicação prática", "Leia comigo"]) {
    assert.ok(html.includes(label), `modo ausente: ${label}`);
  }
});

check("iniciar estudo a partir de um livro cria sessão persistida", () => {
  window.Study.startFromBook(0);
  assert.equal(window.__page, "study");
  const state = window.Storage.get();
  const key = state.study.lastSessionKey;
  assert.ok(key.includes("calculo-volume-1"), `chave inesperada: ${key}`);
  assert.ok(state.study.sessions[key].bookTitle.includes("Cálculo"));
});

const SAMPLE = "Cache HTTP reduz latência. Por exemplo, uma resposta pode ser reutilizada. " +
  "Segundo a especificação, Cache-Control define a validação. A latência cai quando há revalidação.";

check("modo Explique cita o trecho e não inventa termos ausentes", () => {
  window.Study.setTab("tutor");
  getElementById("tutorText").value = SAMPLE;
  getElementById("tutorTerm").value = "Cache";
  window.Study.runTutor();
  let out = getElementById("tutorOutput").innerHTML;
  assert.match(out, /\[trecho\]/);
  assert.match(out, /Cache HTTP reduz latência/);
  getElementById("tutorTerm").value = "termoInexistenteXYZ";
  window.Study.runTutor();
  out = getElementById("tutorOutput").innerHTML;
  assert.match(out, /\[não encontrado\]/);
  assert.doesNotMatch(out, /definição do termoInexistenteXYZ/);
});

check("modo Me teste gera perguntas com resposta oculta", () => {
  window.Study.setTutorMode("test");
  getElementById("tutorText").value = SAMPLE;
  window.Study.runTutor();
  const out = getElementById("tutorOutput").innerHTML;
  assert.match(out, /Perguntas de recuperação/);
  assert.match(out, /<details>/);
  assert.match(out, /\[trecho\]/);
});

check("ficha de artigo salva metadados e distingue inferência", () => {
  window.Study.setTab("article");
  getElementById("art_title").value = "Artigo de teste";
  getElementById("art_doi").value = "10.0000/exemplo";
  getElementById("art_evidence").value = "Tabela 1";
  getElementById("art_inference").value = "Minha leitura";
  window.Study.saveArticle();
  const articles = window.Storage.get().study.articles;
  const found = Object.values(articles).find(a => a.title === "Artigo de teste");
  assert.ok(found, "ficha não salva");
  assert.equal(found.evidence, "Tabela 1");
  assert.notEqual(found.evidence, found.inference);
});

check("lacuna manual vira evidência no caderno de erros", () => {
  window.Study.setTab("gaps");
  const before = window.Storage.get().mistakes.length;
  getElementById("gapTrack").value = "c";
  getElementById("gapText").value = "valor x endereço";
  window.Study.addManualGap();
  const state = window.Storage.get();
  assert.equal(state.mistakes.length, before + 1);
  assert.ok(state.study.gaps.some(g => g.text.includes("valor x endereço")));
});

check("sessão guarda texto, explicação e revisão sem apagar sessões anteriores", () => {
  window.Study.setTab("session");
  getElementById("s_section").value = "Cap. 3";
  getElementById("s_text").value = SAMPLE;
  window.Study.sessionSave(1, "read");
  const state = window.Storage.get();
  const firstKey = state.study.lastSessionKey;
  assert.ok(state.study.sessions[firstKey].text.includes("Cache HTTP reduz latência"));
  window.Study.newSession();
  const secondKey = window.Storage.get().study.lastSessionKey;
  assert.notEqual(firstKey, secondKey);
  assert.ok(window.Storage.get().study.sessions[firstKey], "sessão anterior perdida");
});

/* ---------- migração e preservação de dados ---------- */

check("schema v3 preserva dados antigos e cria espaço de estudo", () => {
  const seed = { "forge.study.v2": JSON.stringify({
    version: 2, done: ["c-0-0"], xp: 120, mistakes: [{ lesson: "c-0-0", question: "q" }],
    plan: { goal: "x" }
  }) };
  const isolated = buildContext(seed);
  vm.runInContext(read("js/storage.js"), isolated.context, { filename: "js/storage.js" });
  const state = isolated.window.Storage.get();
  assert.equal(state.version, 3);
  assert.deepEqual(state.done, ["c-0-0"]);
  assert.equal(state.xp, 120);
  assert.equal(state.mistakes.length, 1);
  assert.equal(state.plan.goal, "x");
  assert.ok(state.study && typeof state.study.sessions === "object");
  assert.ok(isolated.storage.has("forge.study.v2.lastBackup"), "backup automático ausente");
});

check("estado de versão futura não é rebaixado", () => {
  const seed = { "forge.study.v2": JSON.stringify({ version: 9, done: ["x"], study: { sessions: { a: { text: "ok" } } } }) };
  const isolated = buildContext(seed);
  vm.runInContext(read("js/storage.js"), isolated.context, { filename: "js/storage.js" });
  const state = isolated.window.Storage.get();
  assert.equal(state.version, 9);
  assert.equal(state.study.sessions.a.text, "ok");
});

check("o catálogo abre a biblioteca interna e mantém filtros, busca e tutor", () => {
  const view = getElementById("view");
  window.BooksPage.renderPage(view);
  assert.match(view.innerHTML, /Abra um livro para baixar\/importar/);
  const grid = view.querySelector("#booksGrid").innerHTML;
  assert.equal((grid.match(/Abrir na biblioteca FORGE/g) || []).length, window.BOOKS.length);
  assert.equal((grid.match(/BookUI\.open\(/g) || []).length, window.BOOKS.length);
  assert.equal((grid.match(/Study\.startFromBook\(/g) || []).length, window.BOOKS.length);
  assert.match(grid, /book-card-status/);
  assert.match(view.innerHTML, /id="booksFilters"/);
  assert.match(view.innerHTML, /id="booksSearch"/);
});

check("o roteador real abre a página de estudo sem quebrar as demais", () => {
  const integration = buildContext();
  const c = integration.context;
  for (const file of ["js/data.js", "js/data-books.js", "js/storage.js", "js/exercises.js", "js/study.js", "js/books.js", "js/app.js"]) {
    vm.runInContext(read(file), c, { filename: file });
  }
  vm.runInContext(`
    window.toast = function () {};
    window.refreshCharts = function () {};
    window.Features = { timerWidget: function () { return ""; }, updateTimerUI: function () {} };
  `, c, { filename: "integration-stubs.js" });
  integration.window.goToPage("study");
  const html = integration.getElementById("view").innerHTML;
  assert.match(html, /Aprenda a estudar/);
  assert.match(html, /Tutorial em 9 etapas/);
  assert.equal(integration.getElementById("pageTitle").textContent, "Aprenda a estudar");
});

/* ---------- integração estática ---------- */

check("nav, script e service worker incluem os módulos de livros", () => {
  const index = read("index.html");
  assert.match(index, /data-page="study"/);
  assert.match(index, /js\/study\.js/);
  for (const file of ["vendor/pdfjs/pdf.min.js", "js/data-books-meta.js", "js/books-store.js",
    "js/book-questions.js", "js/book-reader.js"]) {
    assert.ok(index.includes(file), `script ausente no index: ${file}`);
  }
  assert.ok(index.indexOf("js/data-books-meta.js") < index.indexOf("js/books-store.js"));
  assert.ok(index.indexOf("js/books-store.js") < index.indexOf("js/book-reader.js"));
  const sw = read("sw.js");
  assert.match(sw, /forge-v7/);
  assert.match(sw, /"\.\/js\/study\.js"/);
  for (const file of ["vendor/pdfjs/pdf.min.js", "vendor/pdfjs/pdf.worker.min.js",
    "js/data-books-meta.js", "js/books-store.js", "js/book-questions.js", "js/book-reader.js"]) {
    assert.ok(sw.includes(`"./${file}"`), `asset ausente no service worker: ${file}`);
  }
});

check("as rotas internas de livro, leitor e questões são aceitas pelo roteador", () => {
  const app = read("js/app.js");
  assert.match(app, /book: v =>/);
  assert.match(app, /reader: v =>/);
  assert.match(app, /questions: v =>/);
  assert.match(app, /INTERNAL_PAGES = \["book", "reader", "questions"\]/);
  assert.match(app, /INTERNAL_PAGES\.includes\(requested\)/);
});

check("metadados aditivos preservam o catálogo original", () => {
  const q = buildContext();
  for (const file of ["js/data-books.js", "js/data-books-meta.js"]) {
    vm.runInContext(read(file), q.context, { filename: file });
  }
  const meta = q.window.BOOKS_META.metaFor(q.window.BOOKS[0]);
  assert.equal(meta.id, q.window.BOOKS_META.idFor(q.window.BOOKS[0].title));
  assert.equal(meta.format, "PDF");
  assert.equal(meta.pages, null, "página não conhecida não deve ser inventada");
  assert.match(meta.source, /^[\w.-]+$/);
});

check("validação de PDF rejeita HTML e aceita cabeçalho/rodapé reais", () => {
  const q = buildContext();
  vm.runInContext(read("js/books-store.js"), q.context, { filename: "js/books-store.js" });
  const header = "%PDF-1.7\n";
  const body = "x".repeat(2048);
  const trailer = "\n%%EOF\n";
  assert.equal(q.window.BookStore.validatePdfBytes(new TextEncoder().encode(header + body + trailer)), true);
  assert.equal(q.window.BookStore.validatePdfBytes(new TextEncoder().encode("<html>nao é pdf</html>" + body)), false);
  assert.equal(q.window.BookStore.validatePdfBytes(new TextEncoder().encode(header + body)), false);
});

check("questões locais citam página, capítulo e trecho real", () => {
  const q = buildContext();
  for (const file of ["js/book-questions.js"]) vm.runInContext(read(file), q.context, { filename: file });
  const pages = [
    { page: 1, text: "Cache HTTP reduz latência de resposta. A especificação define revalidação condicional." },
    { page: 2, text: "Índice acelera consultas em banco de dados. O planejador escolhe a melhor estratégia." }
  ];
  const chapters = q.window.BookQuestions.detectChapters(pages);
  const out = q.window.BookQuestions.generate({
    pages, chapters, count: 6, difficulty: "medium", mode: "estudo",
    types: ["mc", "tf", "interpretation", "concept", "application", "discursive"]
  });
  assert.equal(out.questions.length, 6);
  for (const item of out.questions) {
    assert.ok(item.source && item.source.page >= 1, "sem página de origem");
    assert.ok(item.source.chapter, "sem capítulo de origem");
    const normalized = q.window.BookQuestions.norm(item.source.quote);
    assert.ok(pages.some(p => q.window.BookQuestions.norm(p.text).includes(normalized)), "trecho não está no PDF");
  }
  const mc = out.questions.find(x => x.type === "mc");
  assert.equal(mc.options.length, 4);
  assert.ok(mc.answerIndex >= 0 && mc.answerIndex < 4, "índice de resposta inválido");
  const correctOption = q.window.BookQuestions.norm(mc.options[mc.answerIndex]);
  assert.ok(pages.some(p => q.window.BookQuestions.norm(p.text).includes(correctOption)),
    "a opção correta não veio do texto extraído");
  const right = q.window.BookQuestions.grade(mc, mc.answerIndex);
  assert.equal(right.correct, true);
  assert.equal(right.status, "automatica");
  const wrong = q.window.BookQuestions.grade(mc, (mc.answerIndex + 1) % 4);
  assert.equal(wrong.correct, false);
  const discursive = out.questions.find(x => x.type === "discursive");
  const partial = q.window.BookQuestions.grade(discursive, "resposta curta");
  assert.equal(partial.status, "incompleta");
  const full = q.window.BookQuestions.grade(discursive, "Minha explicação retoma o trecho e aponta uma aplicação própria sem inventar dados.");
  assert.equal(full.status, "autoavaliacao");
  assert.match(full.rubric, /dúvida|limitação|distingue/);
});

check("catálogo de livros e roteador integram a sessão guiada", () => {
  assert.match(read("js/books.js"), /Study\.startFromBook/);
  assert.match(read("js/app.js"), /study: v =>/);
  assert.match(read("js/app.js"), /function goToPage/);
});

check("referência de Rohrer (2012) aponta para o DOI válido", () => {
  const data = read("js/data.js");
  assert.ok(data.includes("10.1007/s10648-012-9201-3"), "DOI correto ausente");
  assert.ok(!data.includes("10.1007/s11251-012-9222-1"), "DOI quebrado ainda presente");
});

await checkAsync("importação de versão futura é recusada sem mutar dados nem backup", async () => {
  const seed = { "forge.study.v2": JSON.stringify({ version: 3, done: ["local-1"], xp: 42 }) };
  const isolated = prepareImportContext(seed);
  const before = JSON.stringify(isolated.window.Storage.get());
  const backupBefore = isolated.storage.get("forge.study.v2.lastBackup") || null;
  let rejected = false;
  try {
    await isolated.window.Storage.import({
      content: JSON.stringify({ version: 9, state: { version: 9, done: ["future"], xp: 9999 } })
    });
  } catch (err) {
    rejected = true;
    assert.equal(err.code, "FUTURE_VERSION");
  }
  assert.equal(rejected, true, "importação deveria ter sido recusada");
  assert.equal(JSON.stringify(isolated.window.Storage.get()), before, "estado local foi alterado");
  assert.equal(isolated.storage.get("forge.study.v2.lastBackup") || null, backupBefore, "backup foi sobrescrito");
  assert.match(isolated.window.__toast, /v9/);
  assert.match(isolated.window.__toast, /preservados/);
});

await checkAsync("importação válida v2 continua migrando para v3 com backup", async () => {
  const seed = { "forge.study.v2": JSON.stringify({ version: 3, done: ["local"], xp: 7 }) };
  const isolated = prepareImportContext(seed);
  await isolated.window.Storage.import({
    content: JSON.stringify({ version: 2, state: { version: 2, done: ["imported"], xp: 555, plan: { goal: "meta" } } })
  });
  const imported = isolated.window.Storage.get();
  assert.equal(imported.version, 3);
  assert.deepEqual(imported.done, ["imported"]);
  assert.equal(imported.xp, 555);
  assert.equal(imported.plan.goal, "meta");
  assert.ok(isolated.storage.has("forge.study.v2.lastBackup"), "backup não criado");
  assert.match(isolated.window.__toast, /v2 → v3/);
});

console.log(results.join("\n"));
console.log(`\n${results.filter(r => r.startsWith("PASS")).length}/${results.length} verificações passaram.`);

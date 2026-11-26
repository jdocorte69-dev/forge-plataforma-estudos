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
    Promise, Map, Set, Event: class {}, FileReader: class {},
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

check("o catálogo de livros oferece a ação de estudo mantendo filtros e busca", () => {
  const view = getElementById("view");
  window.BooksPage.renderPage(view);
  assert.match(view.innerHTML, /Estudar este livro/);
  const grid = view.querySelector("#booksGrid").innerHTML;
  assert.equal((grid.match(/Study\.startFromBook\(/g) || []).length, window.BOOKS.length);
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
    window.Features = { timerWidget: function () { return ""; }, updateTimerUI: function () {} };
  `, c, { filename: "integration-stubs.js" });
  integration.window.goToPage("study");
  const html = integration.getElementById("view").innerHTML;
  assert.match(html, /Aprenda a estudar/);
  assert.match(html, /Tutorial em 9 etapas/);
  assert.equal(integration.getElementById("pageTitle").textContent, "Aprenda a estudar");
});

/* ---------- integração estática ---------- */

check("nav, script e service worker incluem o novo módulo", () => {
  const index = read("index.html");
  assert.match(index, /data-page="study"/);
  assert.match(index, /js\/study\.js/);
  const sw = read("sw.js");
  assert.match(sw, /forge-v6/);
  assert.match(sw, /"\.\/js\/study\.js"/);
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

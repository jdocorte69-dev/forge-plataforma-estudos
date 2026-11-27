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

/* O carregamento foi dividido entre index.html e a lista DEFERRED_SCRIPTS de
   app.js; as verificações estáticas precisam considerar as duas fontes. */
function deferredScripts() {
  const block = read("js/app.js").match(/const DEFERRED_SCRIPTS = \[([\s\S]*?)\];/);
  return block ? [...block[1].matchAll(/"([^"]+)"/g)].map(m => m[1]) : [];
}
const scriptRefs = () => read("index.html") + "\n" + deferredScripts().join("\n");

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
    insertAdjacentHTML(position, html) {
      if (position === "beforeend") this.innerHTML += html;
      else if (position === "afterbegin") this.innerHTML = html + this.innerHTML;
      else this.innerHTML = html;
    },
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

check("schema v7 preserva dados antigos e cria espaço de estudo", () => {
  const seed = { "forge.study.v2": JSON.stringify({
    version: 2, done: ["c-0-0"], xp: 120, mistakes: [{ lesson: "c-0-0", question: "q" }],
    plan: { goal: "x" }
  }) };
  const isolated = buildContext(seed);
  vm.runInContext(read("js/storage.js"), isolated.context, { filename: "js/storage.js" });
  const state = isolated.window.Storage.get();
  assert.equal(state.version, 7);
  assert.equal(state.versionString, "7.0.0");
  assert.deepEqual(JSON.parse(JSON.stringify(state.done)), ["c-0-0"]);
  assert.equal(state.xp, 120);
  assert.equal(state.mistakes.length, 1);
  assert.equal(state.plan.goal, "x");
  assert.ok(state.study && typeof state.study.sessions === "object");
  assert.ok(state.forge3 && state.forge3.simulators && Array.isArray(state.simLogs), "espaços v4 ausentes");
  assert.ok(state.forge4 && state.forge4.pwaVersion === 7, "espaços v5 ausentes");
  assert.ok(state.forge7 && state.forge7.pwaVersion === 8, "espaços v7 ausentes");
  assert.equal(state.forge7.schema, "forge.study.v7");
  assert.deepEqual(JSON.parse(JSON.stringify(state.forge7.lc)), { a: 1664525, c: 1013904223, m: 4294967296 });
  assert.deepEqual(JSON.parse(JSON.stringify(state.forge7.masteryInvariant)), { minScore: 8, minFeynmanChars: 30 });
  assert.ok(Array.isArray(state.oral_exam_history) && Array.isArray(state.bug_hunt_history));
  assert.ok(state.progress && typeof state.progress.lessons === "object");
  assert.equal(state.theme, "dark");
  assert.ok(isolated.storage.has("forge.study.v2.lastBackup"), "backup automático ausente");
  assert.ok(isolated.storage.has("forge.study.v5"), "namespace v5 não gravado");
  assert.ok(isolated.storage.has("forge.study.v7"), "namespace v7 não gravado");
  assert.ok(isolated.storage.has("forge.study.v2"), "chave legada foi apagada");
});

check("v4 → v5 → v7: backups versionados, checksum FNV-1a e userId preservados", () => {
  const original = {
    version: 4,
    userId: "usr_fnv1a_8f93a10c",
    done: ["trk_math_m01_l01"],
    mastery: { trk_math_m01_l01: { score: 9, mastered: true, last_reviewed_at: 1709200000000 } },
    cards: { trk_math_m01_l01: { interval: 6, repetition: 2, efactor: 2.5, next_review: 1709718400000 } },
    feynman: { trk_math_m01_l01: "Uma função bijetora possui inversibilidade direta e correspondência única." },
    xp: 777,
    forge3: { trails: { trk_math: { status: "in_progress", mastery_percentage: 42.5 } }, pwaVersion: 6 }
  };
  const isolated = buildContext({ "forge.study.v4": JSON.stringify(original) });
  vm.runInContext(read("js/storage.js"), isolated.context, { filename: "js/storage.js" });
  const state = isolated.window.Storage.get();
  assert.equal(state.version, 7);
  assert.equal(state.userId, "usr_fnv1a_8f93a10c", "userId alterado na migração");
  assert.equal(state.xp, 777);
  assert.ok(state.forge7.sourceVersion === 5 && /^[0-9a-f]{8}$/.test(state.forge7.sourceChecksum));
  assert.ok(state.forge4.sourceVersion === 4 && /^[0-9a-f]{8}$/.test(state.forge4.sourceChecksum));
  assert.equal(state.forge4.userSeed, isolated.window.Storage.userSeed(state.userId));
  assert.ok(state.progress.lessons.trk_math_m01_l01.score === 9);
  assert.equal(state.progress.lessons.trk_math_m01_l01.sm2_card.interval, 6);
  assert.equal(state.progress.tracks.trk_math.mastery_percentage, 42.5);
  assert.equal(isolated.window.Storage.isLessonMastered(9, "x".repeat(30)), true);
  assert.equal(isolated.window.Storage.isLessonMastered(8, "curto"), false);
  assert.equal(isolated.window.Storage.isLessonMastered(7.9, "x".repeat(40)), false);
  const backupKeys = [...isolated.storage.keys()].filter(k => k.startsWith("forge.study.v4.bak_"));
  const backupV7Keys = [...isolated.storage.keys()].filter(k => k.startsWith("forge.study.v5.bak_"));
  assert.equal(backupKeys.length, 1, "backup timestampado da migração v4 ausente");
  assert.equal(backupV7Keys.length, 1, "backup timestampado da migração v5→v7 ausente");
  const backup = JSON.parse(isolated.storage.get(backupKeys[0]));
  assert.equal(backup.from, "forge.study.v4");
  assert.equal(backup.version, 4);
  assert.equal(backup.algorithm, "FNV-1a-32");
  assert.equal(backup.checksum, state.forge4.sourceChecksum);
  assert.equal(backup.state.userId, original.userId);
  const marker = JSON.parse(isolated.storage.get("forge.study.v7.migration"));
  assert.equal(marker.status, "complete");
  assert.equal(marker.to, 7);
  assert.equal(marker.from, 5);
  assert.equal(marker.backupKey, backupV7Keys[0]);
  assert.ok(isolated.storage.has("forge.study.v4"), "payload v4 original apagado");
  assert.ok(isolated.storage.has("forge.study.v5"), "payload v5 intermediário apagado");
  assert.equal(isolated.storage.get("forge.study.v4"), JSON.stringify(original));
});

check("v4 → v5: checksum divergente aborta a migração sem tocar nos dados", () => {
  const original = { version: 4, userId: "u1", done: ["a"], forge4: { sourceChecksum: "00000000" } };
  // v5 válido evita que o loadState inicial tente a migração corrompida; o
  // teste chama a transformação diretamente para isolar a checagem de hash.
  const isolated = buildContext({
    "forge.study.v5": JSON.stringify({ version: 5, done: [], userId: "u1" }),
    "forge.study.v4": JSON.stringify(original)
  });
  vm.runInContext(read("js/storage.js"), isolated.context, { filename: "js/storage.js" });
  let code = null;
  try {
    isolated.window.Storage.migrateV4ToV5(original, JSON.stringify(original));
  } catch (err) { code = err.code; }
  assert.equal(code, "CHECKSUM_MISMATCH");
  assert.equal(isolated.storage.get("forge.study.v4"), JSON.stringify(original));
});

check("v5 → v7: backup timestampado, userId preservado e domínio inalterado", () => {
  const original = {
    version: 5,
    versionString: "5.0.0",
    userId: "usr_v5_estavel",
    done: ["aula-1"],
    xp: 432,
    mastery: { "aula-1": { score: 9, mastered: true } },
    feynman: { "aula-1": "Explicação com mais de trinta caracteres para fins de teste." },
    cards: { "aula-1": { interval: 6, repetition: 2, efactor: 2.5, next_review: 1 } },
    forge4: { pwaVersion: 7, masteryInvariant: { minScore: 8, minFeynmanChars: 30 } }
  };
  const isolated = buildContext({ "forge.study.v5": JSON.stringify(original) });
  vm.runInContext(read("js/storage.js"), isolated.context, { filename: "js/storage.js" });
  const state = isolated.window.Storage.get();
  assert.equal(state.version, 7);
  assert.equal(state.versionString, "7.0.0");
  assert.equal(state.userId, "usr_v5_estavel");
  assert.equal(state.xp, 432);
  assert.deepEqual(JSON.parse(JSON.stringify(state.done)), ["aula-1"]);
  assert.equal(state.forge7.sourceVersion, 5);
  assert.ok(/^[0-9a-f]{8}$/.test(state.forge7.sourceChecksum));
  assert.equal(state.forge7.userSeed, isolated.window.Storage.lcgNext(isolated.window.Storage.userSeed(state.userId)));
  assert.deepEqual(JSON.parse(JSON.stringify(state.forge7.masteryInvariant)), { minScore: 8, minFeynmanChars: 30 });
  assert.equal(state.progress.lessons["aula-1"].score, 9);
  assert.equal(state.progress.lessons["aula-1"].sm2_card.interval, 6);
  assert.equal(isolated.window.Storage.isLessonMastered(9, "x".repeat(30)), true);
  assert.equal(isolated.window.Storage.isLessonMastered(8, "curto"), false);
  const backupKeys = [...isolated.storage.keys()].filter(k => k.startsWith("forge.study.v5.bak_"));
  assert.equal(backupKeys.length, 1, "backup v5 timestampado ausente");
  const backup = JSON.parse(isolated.storage.get(backupKeys[0]));
  assert.equal(backup.from, "forge.study.v5");
  assert.equal(backup.to, "forge.study.v7");
  assert.equal(backup.version, 5);
  assert.equal(backup.algorithm, "FNV-1a-32");
  assert.equal(backup.state.userId, original.userId);
  const marker = JSON.parse(isolated.storage.get("forge.study.v7.migration"));
  assert.equal(marker.status, "complete");
  assert.equal(marker.backupKey, backupKeys[0]);
  assert.equal(marker.checksum, state.forge7.sourceChecksum);
  assert.equal(isolated.storage.get("forge.study.v5"), JSON.stringify(original), "payload v5 original apagado");
  assert.ok(isolated.storage.has("forge.study.v7"));
  assert.ok(!isolated.storage.has("forge.study.v7.tmp"), "staging não foi limpo");
  assert.deepEqual(JSON.parse(JSON.stringify(isolated.window.Storage.validateStateV7(state))), []);
});

check("FORGE 7.0: LCG determinístico (a=1664525, c=1013904223, m=2^32)", () => {
  const { lcgNext, lcgFloat, lcgShuffle, V7_LCG } = window.Storage;
  assert.deepEqual(JSON.parse(JSON.stringify(V7_LCG)), { a: 1664525, c: 1013904223, m: 4294967296 });
  assert.equal(lcgNext(0), 1013904223);
  assert.equal(lcgNext(1), (1664525 + 1013904223) >>> 0);
  assert.ok(lcgFloat(0) > 0 && lcgFloat(0) < 1);
  const items = ["a", "b", "c", "d", "e"];
  assert.equal(JSON.stringify(lcgShuffle(items, 42)), JSON.stringify(lcgShuffle(items, 42)));
  assert.equal(JSON.stringify([...lcgShuffle(items, 42)].sort()), JSON.stringify(items));
});

check("FORGE 7.0: schema rejeita estado inválido e aceita o padrão", () => {
  const valid = window.Storage.defaultState();
  assert.deepEqual(JSON.parse(JSON.stringify(window.Storage.validateStateV7(valid))), []);
  const broken = { ...valid, done: "não é array", theme: "neon" };
  const errors = window.Storage.validateStateV7(broken);
  assert.ok(errors.some(e => e.includes("done")), errors.join("; "));
  assert.ok(errors.some(e => e.includes("theme")), errors.join("; "));
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
  const refs = scriptRefs();
  assert.match(index, /data-page="study"/);
  assert.match(refs, /js\/study\.js/);
  // PDF.js é carregado sob demanda por ForgePDF, não no caminho crítico.
  assert.match(read("js/app.js"), /vendor\/pdfjs\/pdf\.min\.js/);
  for (const file of ["js/data-books-meta.js", "js/books-store.js",
    "js/book-questions.js", "js/book-reader.js"]) {
    assert.ok(refs.includes(file), `script ausente: ${file}`);
  }
  assert.ok(refs.indexOf("js/data-books-meta.js") < refs.indexOf("js/books-store.js"));
  assert.ok(refs.indexOf("js/books-store.js") < refs.indexOf("js/book-reader.js"));
  const sw = read("sw.js");
  // FORGE 7.0 atualiza o cache para forge-v8 (manifesto completo + SWR).
  assert.match(sw, /forge-v8/);
  assert.match(sw, /"\.\/js\/study\.js"/);
  for (const file of ["js/data-books-meta.js", "js/books-store.js",
    "js/book-questions.js", "js/book-reader.js"]) {
    assert.ok(sw.includes(`"./${file}"`), `asset ausente no service worker: ${file}`);
  }
  // Os bundles do PDF.js entram no cache na primeira abertura (o handler de
  // fetch guarda toda resposta local), evitando compilação no install.
  assert.match(sw, /put\(cacheKey \|\| req, copy\)/);
  assert.doesNotMatch(sw, /"\.\/vendor\/pdfjs\/pdf\.worker\.min\.js"/);
});

check("as rotas internas de livro, leitor e questões são aceitas pelo roteador", () => {
  const app = read("js/app.js");
  assert.match(app, /book: v =>/);
  assert.match(app, /reader: v =>/);
  assert.match(app, /questions: v =>/);
  assert.match(app, /INTERNAL_PAGES = \["book", "reader", "questions", "stellar", "tools"\]/);
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

await checkAsync("importação válida v2 continua migrando para v7 com backup", async () => {
  const seed = { "forge.study.v2": JSON.stringify({ version: 3, done: ["local"], xp: 7 }) };
  const isolated = prepareImportContext(seed);
  await isolated.window.Storage.import({
    content: JSON.stringify({ version: 2, state: { version: 2, done: ["imported"], xp: 555, plan: { goal: "meta" } } })
  });
  const imported = isolated.window.Storage.get();
  assert.equal(imported.version, 7);
  assert.deepEqual(imported.done, ["imported"]);
  assert.equal(imported.xp, 555);
  assert.equal(imported.plan.goal, "meta");
  assert.ok(isolated.storage.has("forge.study.v2.lastBackup"), "backup não criado");
  assert.match(isolated.window.__toast, /v2 → v7/);
});

/* ---------- FORGE 3.0 ---------- */

check("FORGE 3.0: 12 trilhas, 92 módulos, 515 aulas e questões suficientes", () => {
  const isolated = buildContext();
  const refs = scriptRefs();
  const files = [...refs.matchAll(/(js\/data[^"'\s]*\.js)/g)].map(m => m[1]);
  const unique = [...new Set(files)];
  assert.ok(unique.length >= 27, "script de dados ausente no carregamento");
  vm.runInContext(
    unique.map(file => read(file)).join("\n") + "\n;globalThis.__cur = CURRICULUM;",
    isolated.context,
    { filename: "data-bundle.js" }
  );
  const cur = isolated.window.__cur;
  assert.equal(Object.keys(cur).length, 12);
  let modules = 0, lessons = 0, questions = 0;
  for (const track of Object.values(cur)) {
    modules += track.modules.length;
    for (const mod of track.modules) {
      lessons += mod.lessons.length;
      for (const lesson of mod.lessons) questions += lesson.exercises.length;
    }
  }
  assert.equal(modules, 92);
  assert.equal(lessons, 515);
  assert.ok(questions >= 4500, `questões insuficientes: ${questions}`);
  const legacy = ["linux", "c", "math", "mathfund", "software", "systems", "networks", "databases", "security"];
  assert.equal(legacy.reduce((sum, key) => sum + cur[key].modules.length, 0), 71, "módulos legados perdidos");
  for (const key of ["arch", "assembly", "ai"]) {
    const trailLessons = cur[key].modules.flatMap(m => m.lessons);
    assert.ok(trailLessons.length > 0, `trilha ${key} vazia`);
    for (const lesson of trailLessons) {
      assert.equal(lesson.genesis.length, 5, `gênese incompleta em ${lesson.title}`);
      assert.equal(lesson.exercises.length, 10, `questões insuficientes em ${lesson.title}`);
    }
  }
});

check("FORGE 3.0: userId estável e logs de simuladores no schema v7", () => {
  const isolated = buildContext();
  vm.runInContext(read("js/storage.js"), isolated.context, { filename: "js/storage.js" });
  isolated.window.Storage.migrate();
  const first = isolated.window.Storage.get();
  assert.ok(first.userId && typeof first.userId === "string", "userId ausente");
  assert.equal(first.forge3.pwaVersion, 6);
  assert.equal(first.forge4.pwaVersion, 7);
  assert.equal(first.forge7.pwaVersion, 8);
  const before = JSON.parse(isolated.storage.get("forge.study.v7")).userId;
  assert.equal(before, first.userId, "userId não foi persistido");
  isolated.window.Storage.logSimulator("logic", "tabela verdade");
  isolated.window.Storage.logSimulator("cpu", "ADD RAX, RBX");
  isolated.window.Storage.logSimulator("ai", "40 passos");
  const after = isolated.window.Storage.get();
  assert.equal(after.forge3.simulators.logic.runs, 1);
  assert.equal(after.forge3.simulators.cpu.runs, 1);
  assert.equal(after.forge3.simulators.ai.runs, 1);
  assert.equal(after.simLogs.length, 3);
  assert.ok(after.simLogs.every(entry => entry.at && entry.simulator));
});

check("FORGE 3.0: embaralhamento FNV-1a + LCG é determinístico por aula e usuário", () => {
  const isolated = buildContext();
  vm.runInContext(read("js/storage.js") + "\n" + read("js/exercises.js"),
    isolated.context, { filename: "exercises-bundle.js" });
  const question = ["Enunciado", "A", "B", "C"];
  const first = isolated.window.Exercises.shuffle(question, "arch-0-0|lesson|0");
  const second = isolated.window.Exercises.shuffle(question, "arch-0-0|lesson|0");
  assert.deepEqual(first, second, " Mesma semente produziu ordens diferentes");
  assert.deepEqual([...first.options].sort(), ["A", "B", "C"]);
  const seeded = isolated.window.hashSeed("u1|arch-0-0|lesson|0");
  const otherUser = isolated.window.hashSeed("u2|arch-0-0|lesson|0");
  assert.notEqual(seeded, otherUser, "ID do usuário não altera a semente");
  assert.match(read("js/exercises.js"), /2166136261/);
  assert.match(read("js/exercises.js"), /1664525/);
  assert.match(read("js/exercises.js"), /shuffleUserSeed/);
});

check("FORGE 4.0: utils-math expõe FNV-1a, LCG e entropia de Shannon", () => {
  const isolated = buildContext();
  vm.runInContext(read("js/utils-math.js") + "\n" + read("js/exercises.js"),
    isolated.context, { filename: "math-bundle.js" });
  const m = isolated.window.ForgeMathUtils;
  assert.ok(m && typeof m.fnv1a32 === "function");
  assert.equal(m.fnv1a32("a"), 0xe40c292c);
  assert.equal(m.fnv1a32("a"), isolated.window.hashSeed("a"), "hash diverge de exercises.js");
  assert.deepEqual(m.lcgSequence(1, 3), [m.lcgNext(1), m.lcgNext(m.lcgNext(1)), m.lcgNext(m.lcgNext(m.lcgNext(1)))]);
  assert.equal(m.lcgNext(0), 1013904223);
  assert.equal(m.shannonEntropy("aaaa"), 0);
  assert.ok(m.shannonEntropy("abab") > 0.99 && m.shannonEntropy("abab") < 1.01);
  assert.ok(scriptRefs().includes("js/utils-math.js"), "utils-math.js ausente no carregamento");
});

check("FORGE 3.0: simuladores, bottom nav e PWA v6 estão integrados", () => {
  const app = read("js/app.js");
  for (const tab of ["logic", "cpu", "ai"]) {
    assert.ok(app.includes(`labTab='${tab}'`), `aba ${tab} ausente`);
    assert.ok(app.includes(`${tab.charAt(0).toUpperCase() + tab.slice(1)}Sim.mount()`), `mount de ${tab} ausente`);
  }
  assert.match(app, /id="logicSimRoot"/);
  assert.match(app, /id="cpuSimRoot"/);
  assert.match(app, /id="aiSimRoot"/);
  const index = read("index.html");
  const refs = scriptRefs();
  for (const file of ["js/data-forge3.js", "js/data-trilha10.js", "js/data-trilha11.js",
    "js/data-trilha12.js", "js/sim-logic.js", "js/sim-cpu.js", "js/sim-ai.js"]) {
    assert.ok(refs.includes(file), `script ausente no carregamento: ${file}`);
    assert.ok(fs.existsSync(path.join(ROOT, file)), `arquivo ausente: ${file}`);
  }
  for (const file of ["js/data-forge3.js", "js/data-trilha10.js", "js/data-trilha11.js",
    "js/data-trilha12.js", "js/sim-logic.js", "js/sim-cpu.js", "js/sim-ai.js"]) {
    assert.ok(read("sw.js").includes(`"./${file}"`), `asset ausente no service worker: ${file}`);
  }
  assert.match(index, /class="bottom-nav"/);
  assert.match(index, /rel="manifest" href="manifest\.json"/);
  const css = read("css/style.css");
  for (const token of ["--accent-math", "--accent-assembly", "--accent-ai",
    "--accent-network", "--accent-arch", "--accent-security", "safe-area-inset-bottom"]) {
    assert.ok(css.includes(token), `token ausente no CSS: ${token}`);
  }
  assert.match(css, /\.bottom-nav/);
  assert.match(css, /\.sim-shell/);
  assert.match(css, /min-height: 48px/);
  const manifest = JSON.parse(read("manifest.json"));
  assert.equal(manifest.display, "standalone");
  assert.ok(manifest.icons.some(icon => icon.purpose === "maskable" && icon.sizes === "512x512"));
  for (const icon of ["icon-192.png", "icon-512.png", "icon-maskable-192.png", "icon-maskable-512.png"]) {
    assert.ok(fs.existsSync(path.join(ROOT, icon)), `ícone ausente: ${icon}`);
  }
});

check("FORGE 7.0: acervo de 233 resumos preservado e 13 resumos mestres aditivos", () => {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(read("js/data-summaries-index.js"), ctx, { filename: "js/data-summaries-index.js" });
  const index = ctx.window.FORGE_SUMMARIES_INDEX;
  assert.equal(index.totalBooks, 13);
  assert.equal(index.totalSummaries, 233);
  const onDisk = [];
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".md")) onDisk.push(full);
    }
  };
  walk(path.join(ROOT, "saida", "02_resumos_por_livro"));
  // 233 capítulos FORGE 4.0 intactos + 13 RESUMAO_MESTRE_*.md FORGE 7.0.
  assert.equal(onDisk.length, 246);
  assert.equal(onDisk.filter(f => path.basename(f).startsWith("RESUMAO_MESTRE_")).length, 13);
  const chapters = index.books.flatMap(book => book.chapters);
  assert.equal(chapters.length, 233);
  for (const chapter of chapters) {
    assert.ok(fs.existsSync(path.join(ROOT, chapter.path)), `arquivo ausente: ${chapter.path}`);
    assert.ok(chapter.theme && chapter.words > 0 && chapter.chars > 0, chapter.id);
    assert.ok(!/[\\$]/.test(chapter.title + chapter.theme), `LaTeX residual em ${chapter.id}`);
  }
  const manifest = JSON.parse(read("saida/00_inventario/manifest.json"));
  assert.equal(manifest.total_pdfs, 13);
  for (const book of index.books) {
    assert.ok(manifest.livros.some(l => l.titulo === book.title), `metadado inventado: ${book.slug}`);
  }
});

check("FORGE 4.0: módulos do acervo registrados e rota ligada", () => {
  const refs = scriptRefs();
  const files = ["js/data-summaries-index.js", "js/books-summaries-index.js", "js/summaries-page.js"];
  for (const file of files) {
    assert.ok(refs.includes(file), `script ausente: ${file}`);
    assert.ok(fs.existsSync(path.join(ROOT, file)), `arquivo ausente: ${file}`);
  }
  assert.ok(refs.indexOf(files[0]) < refs.indexOf(files[1]));
  assert.ok(refs.indexOf(files[1]) < refs.indexOf(files[2]));
  const app = read("js/app.js");
  assert.match(app, /summaries: v =>/);
  assert.match(app, /SummariesPage\.renderPage/);
  assert.match(read("index.html"), /data-page="summaries"/);
  assert.match(read("css/style.css"), /\.summary-reader__grid/);
});

check("FORGE 4.0: leitor escapa HTML e preserva notação Unicode", () => {
  const ctx = {
    window: {
      BooksSummariesIndex: {
        normalizeMath: value => String(value || ""),
        fold: value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      }
    }
  };
  vm.createContext(ctx);
  vm.runInContext(read("js/summaries-page.js"), ctx, { filename: "js/summaries-page.js" });
  const html = ctx.window.SummariesPage.markdownToHTML(
    "### Sessão ℝ\n\n<script>alert(1)</script>\n\n**negrito** `x<y`\n\n- [x] feito\n\n```js\nconst a = 1 < 2;\n```"
  );
  assert.ok(html.includes("&lt;script&gt;"), html);
  assert.ok(!html.includes("<script>"), html);
  assert.match(html, /<strong>negrito<\/strong>/);
  assert.match(html, /<code>x&lt;y<\/code>/);
  assert.match(html, /id="sec-sessao"/);
  assert.match(html, /<pre><code class="language-js">const a = 1 &lt; 2;<\/code><\/pre>/);
});

check("FORGE 7.0: service worker forge-v8 com cache-first, SWR e manifesto completo", () => {
  const sw = read("sw.js");
  assert.match(sw, /const VERSION = "forge-v8"/);
  assert.match(sw, /importScripts\("\.\/sw-summaries\.js"\)/);
  assert.match(sw, /caches\.match\(cacheKey \|\| req\)/);
  assert.match(sw, /function revalidate/);
  assert.ok(sw.indexOf("function revalidate") < sw.indexOf("self.addEventListener(\"fetch\""));
  const assets = ["js/utils-math.js", "js/dashboard-widgets.js", "js/sim-oral.js",
    "js/sim-crypto.js", "js/data-summaries-index.js", "js/books-summaries-index.js",
    "js/summaries-page.js", "vendor/katex/katex.min.css", "vendor/katex/katex.min.js",
    "vendor/katex/contrib/auto-render.min.js", "css/forge7.css", "js/data-porque.js",
    "js/forge7-ui.js"];
  for (const file of assets) {
    assert.ok(sw.includes(`"./${file}"`), `asset ausente no service worker: ${file}`);
  }
  assert.match(sw, /const PRECACHE = APP_SHELL\.concat\(/);
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(read("sw-summaries.js"), ctx, { filename: "sw-summaries.js" });
  const manifest = vm.runInContext("SUMMARY_MANIFEST", ctx);
  assert.equal(manifest.length, 233);
  assert.equal(new Set(manifest).size, 233);
  for (const entry of manifest) {
    assert.ok(fs.existsSync(path.join(ROOT, entry.replace(/^\.\//, ""))), `resumo ausente: ${entry}`);
  }
});

/* ---------- FORGE 7.0: conteúdo didático, UI e cronograma ---------- */

check("FORGE 7.0: 7 passos, 10 autópsias, mapa M1–M6 e cálculo por último", () => {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(read("js/data-porque.js"), ctx, { filename: "js/data-porque.js" });
  const c = ctx.window.FORGE7_CONTENT;
  assert.ok(c, "FORGE7_CONTENT ausente");
  assert.equal(c.didacticSteps.length, 7);
  assert.equal(c.didacticSteps.map(s => s.key).join(","),
    "analogia,genese,construcao,diagrama,exemplo,aprofundamento,feynman");
  // 3 autópsias fundacionais + 10 descobertas históricas = 13 no total.
  assert.equal(c.autopsies.length, 13);
  for (const id of ["peano-half-adder", "hello-world-12", "loop-hardware", "corda-12-nos",
    "triangulo-180", "pitagoras-rearranjo", "eratostenes-terra", "euclides-primos",
    "al-khwarizmi-quadrado", "newton-leibniz-calculo", "napier-logaritmos",
    "boole-shannon", "gauss-euler-modular"]) {
    assert.ok(c.autopsies.some(a => a.id === id), `autópsia ausente: ${id}`);
  }
  // As 10 descobertas históricas vêm depois das 3 autópsias fundacionais.
  assert.equal(c.autopsies.slice(3).length, 10);
  assert.ok(c.autopsies.slice(3).every(a => /^Autópsia 4\./.test(a.title)));
  assert.equal(c.map.length, 6);
  assert.equal(c.map.map(m => m.id).join(","), "M1,M2,M3,M4,M5,M6");
  assert.equal(c.map[5].prereq, "M5");
  assert.equal(c.map[5].title.includes("Cálculo"), true);
  assert.equal(c.computing.length, 6);
  assert.equal(c.computing.map(m => m.id).join(","), "C1,C2,C3,C4,C5,C6");
  assert.equal(c.protocol.length, 5);
  assert.equal(c.learningScience.length, 6);
});

check("FORGE 7.0: UI aditiva, rotas e três camadas no painel", () => {
  const index = read("index.html");
  const app = read("js/app.js");
  const ui = read("js/forge7-ui.js");
  assert.match(index, /href="css\/forge7\.css"/);
  assert.match(index, /id="f7HeroRoot"/);
  assert.match(index, /id="f7MapRoot"/);
  assert.match(index, /id="f7HubRoot"/);
  assert.match(index, /src="js\/data-porque\.js"/);
  assert.match(index, /src="js\/forge7-ui\.js"/);
  assert.ok(scriptRefs().includes("js/forge7-ui.js"));
  for (const route of ["porque", "protocol", "stellar", "tools"]) {
    assert.ok(app.includes(`${route}: v =>`), `rota ausente: ${route}`);
  }
  for (const fn of ["heroHTML", "mapHTML", "toolsHTML", "porquePage", "protocolPage", "mountDashboard"]) {
    assert.ok(ui.includes(fn), `export ausente: ${fn}`);
  }
  assert.match(ui, /data-f7-action="toggle-node"/);
  assert.match(ui, /aria-expanded/);
  assert.match(app, /Forge7UI\.mountDashboard\(v\)/);
});

check("FORGE 7.0: cronograma de 24 semanas com mini-projeto a cada 2 semanas", () => {
  const plan = read("js/plan.js");
  const ctx = { window: {}, Storage: { get: () => ({ plan: {} }), save() {} }, toast() {} };
  vm.createContext(ctx);
  vm.runInContext(plan, ctx, { filename: "js/plan.js" });
  const p = ctx.window.Plan;
  assert.equal(p.blocks.length, 12);
  assert.equal(p.horizons.map(h => h.weeks).join(","), "24,52,78");
  for (const block of p.blocks) assert.ok(block.project.length > 20, block.focus);
  const html = p.scheduleHTML();
  assert.equal((html.match(/<tr class="/g) || []).length, 12);
  assert.match(html, /Mini-projeto obrigatório/);
  assert.match(html, /planHorizon/);
});

check("FORGE 7.0: zero CDN nos novos ativos e estilos sem contenção LEGACY", () => {
  for (const file of ["css/forge7.css", "js/data-porque.js", "js/forge7-ui.js", "js/plan.js"]) {
    const text = read(file);
    assert.ok(!/https?:\/\//.test(text), `URL externa em ${file}`);
  }
  const css = read("css/forge7.css").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.ok(!/contain\s*:\s*layout/.test(css));
  assert.ok(!/content-visibility/.test(css));
  assert.match(css, /backdrop-filter: blur\(16px\)/);
  assert.match(css, /min-height: 48px/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

console.log(results.join("\n"));
console.log(`\n${results.filter(r => r.startsWith("PASS")).length}/${results.length} verificações passaram.`);

/* ============================================================
   FORGE 9.0 — OMEGA / AssaadFlix (controlador aditivo).
   Catálogo em quatro abas, trilhas 13/14 no padrão Universo
   Narrado (12 regras), resumões com exercícios e espelhamento
   do onboarding. Nenhum framework, nenhuma rede, nada removido
   das camadas 7 e 8.
   ============================================================ */

(function () {
  "use strict";

  const T13 = window.FORGE_TRILHA13 || { id: "13", title: "Cálculo Mental", modules: [] };
  const T14 = window.FORGE_TRILHA14 || { id: "14", title: "Literatura, Filosofia e Fé", modules: [] };
  const BOOKS = window.FORGE_BOOK_SUMMARIES || { books: [], categories: [] };
  const FALLBACK_RULES = [
    "Problema real em primeiro lugar",
    "Construção progressiva em camadas",
    "Fundamentação de toda regra",
    "Redução até a camada base",
    "Analogias com limites explícitos",
    "Exemplo concreto antes da generalização",
    "Exposição sugestiva de erros comuns",
    "Tom direto e humano",
    "Blocos com checagem ativa",
    "Explicação alternativa sob demanda",
    "Teste de síntese Feynman",
    "Resumo em 3 frases e elo de conexão"
  ];
  const RULES = (window.Forge8UI && Array.isArray(window.Forge8UI.rules) && window.Forge8UI.rules.length === 12)
    ? window.Forge8UI.rules.slice()
    : FALLBACK_RULES;
  const TABS = ["tecnicos", "classicos", "resumoes", "exercicios"];
  const TAB_LABELS = {
    tecnicos: "Técnicos", classicos: "Clássicos", resumoes: "Resumões", exercicios: "Exercícios"
  };
  const TRACKS = { "13": T13, "14": T14 };
  const answers = Object.create(null);
  let currentBookId = null;
  let lastLesson = null;

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function storage() {
    return window.Storage || null;
  }

  function f9() {
    const s = storage();
    if (!s || typeof s.getForge9State !== "function") return null;
    return s.getForge9State();
  }

  function go(route) {
    if (typeof window.goToPage === "function") window.goToPage(route);
  }

  function toast(message) {
    if (typeof window.toast === "function") window.toast(message);
  }

  function paras(value) {
    return String(value == null ? "" : value)
      .split(/\n\s*\n/).map(part => part.trim()).filter(Boolean)
      .map(part => `<p>${esc(part).replace(/\n/g, "<br>")}</p>`).join("");
  }

  function list(items) {
    if (!Array.isArray(items) || !items.length) return "";
    return `<ul>${items.map(item => `<li>${esc(item)}</li>`).join("")}</ul>`;
  }

  function pre(value) {
    const text = String(value == null ? "" : value).trim();
    return text ? `<pre>${esc(text)}</pre>` : "";
  }

  function block(index, title, body, ruleIndex) {
    return `<section class="f9-block" data-f9-rule="${index + 1}">` +
      `<h2>${index + 1}. ${esc(title)}</h2>${body}` +
      (ruleIndex != null && RULES[ruleIndex]
        ? `<p class="f9-rule-name">Regra ${ruleIndex + 1}: ${esc(RULES[ruleIndex])}</p>` : "") +
      `</section>`;
  }

  /* ---------- Horário nobre: prateleiras do AssaadFlix ---------- */

  function card({ kicker, title, meta, action, wide }) {
    return `<button type="button" class="f9-card${wide ? " f9-card--wide" : ""}" ${action}>` +
      `<p class="f9-card-kicker">${esc(kicker)}</p>` +
      `<h3 class="f9-card-title">${esc(title)}</h3>` +
      `<p class="f9-card-meta">${esc(meta)}</p></button>`;
  }

  function lane(title, subtitle, cards, wide) {
    return `<section class="f9-lane" aria-labelledby="f9-lane-${esc(title).toLowerCase().replace(/\W+/g, "-")}">` +
      `<div class="f9-lane-head"><div>` +
      `<h2 class="f9-lane-title" id="f9-lane-${esc(title).toLowerCase().replace(/\W+/g, "-")}">${esc(title)}</h2>` +
      `<p class="f9-lane-sub">${esc(subtitle)}</p></div></div>` +
      `<div class="f9-shelf"><div class="f9-shelf-track">${cards}</div></div></section>`;
  }

  function mountDashboard(view) {
    if (!view) return false;
    let root = view.querySelector("#f9HomeRoot");
    if (!root) {
      root = document.createElement("div");
      root.id = "f9HomeRoot";
      const map = view.querySelector("#f7MapRoot");
      view.insertBefore(root, map || null);
    }
    const s = storage();
    const state = s && typeof s.get === "function" ? s.get() : {};
    const done = Array.isArray(state.done) ? state.done.length : 0;
    const continueCards = [
      card({ kicker: done ? "Continue" : "Comece aqui", title: "Aula · Universo Narrado", meta: "12 regras, checagens e Feynman.", action: 'data-f9-go="deep-lesson"' }),
      card({ kicker: "Treino de 3 minutos", title: "Academia Mental", meta: "Seis geradores determinísticos.", action: 'data-f9-go="mental"' }),
      card({ kicker: "Evidência", title: "Prova oral", meta: "Rubrica em quatro painéis.", action: 'data-f9-go="oral"' })
    ].join("");
    const track13 = T13.modules.slice(0, 3).map(m =>
      card({ kicker: `Trilha 13 · ${esc(m.id)}`, title: m.title, meta: `${m.duration} · ${m.exercises.length} exercícios`, action: `data-f9-module="13" data-f9-module-id="${esc(m.id)}"` })
    ).join("");
    const track14 = T14.modules.slice(0, 2).map(m =>
      card({ kicker: `Trilha 14 · ${esc(m.id)}`, title: m.title, meta: `${m.duration} · ${m.exercises.length} exercícios`, action: `data-f9-module="14" data-f9-module-id="${esc(m.id)}"` })
    ).join("");
    const shelf = BOOKS.books.slice(0, 4).map(b =>
      card({ kicker: TAB_LABELS[b.category] || b.category, title: b.title, meta: b.author, action: `data-f9-book="${esc(b.id)}"`, wide: true })
    ).join("");
    root.innerHTML = `<div class="f9-shell" data-f9-home>` +
      lane("Continue de onde parou", "Um próximo passo por vez.", continueCards) +
      lane("Trilha 13 · Cálculo Mental", "Da memória ao Doomsday, sem pular pré-requisito.", track13) +
      lane("Trilha 14 · Letras, filosofia e fé", "Textos, argumentos e síntese com as próprias palavras.", track14) +
      lane("Resumões da biblioteca", "Leia, responda e explique — sem PDF externo.", shelf, true) +
      `</div>`;
    return true;
  }

  /* ---------- Catálogo em quatro abas ---------- */

  function activeTab() {
    const current = f9();
    const tab = current && current.catalog && current.catalog.activeTab;
    return TABS.indexOf(tab) >= 0 ? tab : TABS[0];
  }

  function booksFor(tab) {
    return (BOOKS.books || []).filter(book => book.category === tab);
  }

  function catalogHTML(tab) {
    const books = booksFor(tab);
    if (!books.length) {
      return `<p class="f9-muted">Nenhum item nesta seção ainda.</p>`;
    }
    return `<div class="f9-grid">${books.map(book =>
      `<button type="button" class="f9-card" data-f9-book="${esc(book.id)}">` +
      `<p class="f9-card-kicker">${esc(TAB_LABELS[book.category] || book.category)} · ${esc(book.year || "")}</p>` +
      `<h3 class="f9-card-title">${esc(book.title)}</h3>` +
      `<p class="f9-card-meta">${esc(book.author)}</p>` +
      `<p class="f9-card-meta">${(book.tags || []).slice(0, 3).map(esc).join(" · ")}</p>` +
      `</button>`).join("")}</div>`;
  }

  function renderCatalogTab(view, tab) {
    const panel = view && view.querySelector("#f9CatalogPanel");
    if (!panel) return false;
    const name = TAB_LABELS[tab] ? tab : TABS[0];
    panel.id = `f9CatalogPanel`;
    panel.setAttribute("aria-labelledby", `f9-tab-${name}`);
    panel.innerHTML = catalogHTML(name);
    if (storage() && typeof storage().setCatalogTab === "function") storage().setCatalogTab(name);
    view.querySelectorAll("[data-f9-tab]").forEach(button => {
      button.setAttribute("aria-selected", String(button.dataset.f9Tab === name));
      button.setAttribute("tabindex", button.dataset.f9Tab === name ? "0" : "-1");
    });
    return true;
  }

  function renderCatalog(view) {
    if (!view) return false;
    const tab = activeTab();
    view.innerHTML = `<div class="f9-shell" data-f9-catalog>` +
      `<section class="f9-hero" aria-labelledby="f9CatalogTitle">` +
      `<span class="f9-eyebrow">AssaadFlix · FORGE OMEGA</span>` +
      `<h1 id="f9CatalogTitle">Biblioteca em quatro estantes</h1>` +
      `<p>Técnicos, clássicos, resumões e exercícios no mesmo catálogo. Cada item termina em uma síntese Feynman — não em uma lista de leitura.</p>` +
      `</section>` +
      `<div class="f9-tabs" role="tablist" aria-label="Estantes da biblioteca">` +
      TABS.map(name => `<button type="button" role="tab" id="f9-tab-${name}" ` +
        `aria-controls="f9CatalogPanel" aria-selected="${name === tab}" tabindex="${name === tab ? "0" : "-1"}" ` +
        `data-f9-tab="${name}">${TAB_LABELS[name]}</button>`).join("") +
      `</div>` +
      `<div class="f9-tabpanel" id="f9CatalogPanel" role="tabpanel" tabindex="0"></div>` +
      `</div>`;
    renderCatalogTab(view, tab);
    return true;
  }

  function switchTab(view, tab) {
    return renderCatalogTab(view, tab);
  }

  /* ---------- Trilhas 13 e 14 ---------- */

  function scoreHTML(score, passed) {
    return `<p class="f9-metric" data-f9-mastery>` +
      `<span>Nota: <b>${esc(score)}/10</b> · Feynman: ${esc(passed ? "evidência válida" : "pendente")}</span>` +
      `<strong>${score >= 8 && passed ? "Domínio registrado" : "Em progresso"}</strong></p>`;
  }

  function exerciseHTML(scope, exercises) {
    if (!Array.isArray(exercises) || !exercises.length) return "";
    return `<details class="f9-disclosure" data-f9-exercises>` +
      `<summary>Exercícios (${exercises.length}) — abrir para responder</summary>` +
      `<div class="f9-stack">${exercises.map((ex, qi) => {
        const name = `f9q:${scope}:${qi}`;
        return `<fieldset class="f9-exercise" data-f9-exercise="${qi}">` +
          `<legend>${qi + 1}. ${esc(ex.q)}</legend>` +
          (ex.options || []).map((option, oi) =>
            `<label><input type="radio" name="${esc(name)}" value="${oi}">` +
            `<span>${String.fromCharCode(65 + oi)}) ${esc(option)}</span></label>`).join("") +
          `<p class="f9-feedback" data-f9-exercise-feedback="${qi}" role="status"></p>` +
          `</fieldset>`;
      }).join("")}</div>` +
      `<button type="button" class="f9-btn f9-btn--primary" data-f9-grade="${esc(scope)}">Corrigir exercícios</button>` +
      `</details>`;
  }

  function checksHTML(trackId, moduleId, checks) {
    if (!Array.isArray(checks) || !checks.length) return "";
    return checks.map((check, ci) =>
      `<div class="f9-check" data-f9-check="${ci}" data-f9-track="${esc(trackId)}" data-f9-module="${esc(moduleId)}">` +
      `<p><strong>Pergunta ${ci + 1}:</strong> ${esc(check.q)}</p>` +
      `<div role="group" aria-label="Respostas da pergunta ${ci + 1}">` +
      (check.options || []).map((option, oi) =>
        `<button type="button" data-f9-option="${oi}">${String.fromCharCode(65 + oi)}) ${esc(option)}</button>`).join("") +
      `</div>` +
      `<button type="button" class="f9-btn f9-btn--text" data-f9-hint="0">Mostrar pista</button>` +
      `<p class="f9-hint" hidden></p><p class="f9-feedback" role="status"></p></div>`).join("");
  }

  function lessonHTML(trackId, module) {
    const lesson = module.lesson || {};
    const key = `${trackId}.${module.id}`;
    const score = computeScore(key, module.exercises || []);
    const passed = feynmanPassed(key, lesson.feynman || {});
    const blocks = [
      block(0, "O problema real em primeiro lugar", paras(lesson.hook), 0),
      block(1, "Construção em camadas", list(lesson.layers), 1),
      block(2, "Por que a regra funciona", paras(lesson.ruleWhy), 2),
      block(3, "Redução até a camada base", pre(lesson.physical), 3),
      block(4, "Analogia e seu limite", paras(lesson.intuition) +
        `<p class="f9-limit">${esc(lesson.limit || "")}</p>`, 4),
      block(5, "Exemplo concreto", pre(lesson.example), 5),
      block(6, "Onde a gente erra", list(lesson.traps), 6),
      block(7, "O que fazer agora", paras((lesson.summary || [])[0]) +
        `<p>${esc(lesson.connection || "")}</p>`, 7),
      block(8, "Checagem ativa", checksHTML(trackId, module.id, lesson.checks), 8),
      block(9, "Explicação alternativa",
        `<details class="f9-disclosure"><summary>Não entendi — explique de outro jeito</summary>` +
        paras(lesson.alternative && lesson.alternative.intro) +
        paras(lesson.alternative && lesson.alternative.text) +
        pre(lesson.alternative && lesson.alternative.diagram) + `</details>`, 9),
      block(10, "Síntese Feynman", feynmanHTML(key, lesson.feynman || {}), 10),
      block(11, "Resumo em 3 frases e elo de conexão", list(lesson.summary) +
        `<p><strong>${esc(lesson.connection || "")}</strong></p>` +
        exerciseHTML(key, module.exercises || {}), 11)
    ];
    return `<section class="f9-lesson" data-f9-lesson="${esc(key)}">` +
      `<p class="f9-eyebrow">${esc(lesson.kicker || `${trackId}.${module.id}`)}</p>` +
      `<h1>${esc(lesson.title || module.title)}</h1>` +
      `<p class="f9-muted">${esc(module.objective || "")} · ${esc(module.duration || "")}</p>` +
      scoreHTML(score, passed) + blocks.join("") + `</section>`;
  }

  function feynmanHTML(key, fm) {
    const prompt = fm.prompt || "Explique com suas próprias palavras.";
    const min = Number(fm.minChars) || 30;
    const saved = storage() && typeof storage().get === "function"
      ? String((storage().get().feynman || {})[key] || "") : "";
    return `<p>${esc(prompt)}</p>` +
      `<p class="f9-muted">Mínimo de ${min} caracteres; use pelo menos 2 termos-chave: ` +
      `${(fm.keywords || []).map(esc).join(", ")}.</p>` +
      `<label class="sr-only" for="f9Feynman">Sua explicação com suas próprias palavras</label>` +
      `<textarea class="f9-textarea" id="f9Feynman" placeholder="Explique sem olhar a fonte...">${esc(saved)}</textarea>` +
      `<div class="f9-row"><button type="button" class="f9-btn f9-btn--primary" ` +
      `data-f9-feynman="${esc(key)}">Salvar síntese</button>` +
      `<p class="f9-feedback" data-f9-feynman-feedback role="status"></p></div>`;
  }

  function renderTrilha(view, trackId) {
    if (!view) return false;
    const id = TRACKS[trackId] ? trackId : "13";
    const track = TRACKS[id];
    view.innerHTML = `<div class="f9-shell" data-f9-track="${esc(id)}">` +
      `<section class="f9-hero" aria-labelledby="f9TrackTitle">` +
      `<span class="f9-eyebrow">FORGE OMEGA · Trilha ${esc(id)}</span>` +
      `<h1 id="f9TrackTitle">${esc(track.title)}</h1>` +
      `<p>${esc(track.subtitle || "")}</p></section>` +
      `<div class="f9-home-grid">${(track.modules || []).map(module =>
        `<button type="button" class="f9-card" data-f9-module="${esc(id)}" data-f9-module-id="${esc(module.id)}">` +
        `<p class="f9-card-kicker">Módulo ${esc(module.id)} · ${esc(module.duration || "")}</p>` +
        `<h2 class="f9-card-title">${esc(module.title)}</h2>` +
        `<p class="f9-card-meta">${esc(module.objective || "")}</p>` +
        `<p class="f9-card-meta">${(module.exercises || []).length} exercícios · ${(module.keywords || []).length} termos-chave</p>` +
        `</button>`).join("")}</div>` +
      `<div id="f9LessonRoot" aria-live="polite"></div></div>`;
    return true;
  }

  function mountLesson(view, trackId, moduleId) {
    if (!view) return false;
    const track = TRACKS[trackId] || T13;
    const module = (track.modules || []).find(m => m.id === moduleId) || (track.modules || [])[0];
    if (!module) return false;
    lastLesson = { trackId: track.id, moduleId: module.id };
    const root = view.querySelector("#f9LessonRoot");
    if (!root) return renderLessonAsPage(view, track.id, module);
    root.innerHTML = lessonHTML(track.id, module);
    if (typeof root.scrollIntoView === "function") root.scrollIntoView({ block: "start" });
    return true;
  }

  function renderLessonAsPage(view, trackId, module) {
    view.innerHTML = `<div class="f9-shell">${lessonHTML(trackId, module)}</div>`;
    return true;
  }

  /* ---------- Resumões com exercícios ---------- */

  function findBook(id) {
    return (BOOKS.books || []).find(book => book.id === id) || null;
  }

  function computeScore(scope, exercises) {
    let correct = 0;
    (exercises || []).forEach((exercise, qi) => {
      if (answers[`${scope}:${qi}`] === Number(exercise.answer)) correct++;
    });
    const total = (exercises || []).length;
    return total ? Math.round((correct / total) * 10) : 0;
  }

  function normalize(text) {
    return String(text || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function feynmanPassed(scope, fm) {
    const s = storage();
    const text = s && typeof s.get === "function"
      ? String((s.get().feynman || {})[scope] || "") : "";
    const compact = text.replace(/\s+/g, " ").trim();
    const min = Number(fm.minChars) || 30;
    const keywords = (fm.keywords || []).map(normalize).filter(Boolean);
    const covered = keywords.filter(word => normalize(compact).indexOf(word) >= 0).length;
    const need = Math.min(2, keywords.length);
    return compact.length >= min && covered >= need;
  }

  function bookFeynmanHTML(book) {
    const fm = { minChars: 30, keywords: book.keywords || [] };
    const key = `book-${book.id}`;
    const saved = storage() && typeof storage().get === "function"
      ? String((storage().get().feynman || {})[key] || "") : "";
    return `<section class="f9-block" data-f9-rule="11">` +
      `<h2>Síntese Feynman</h2>` +
      `<p>Explique o livro com suas próprias palavras. Mínimo de 30 caracteres e pelo menos 2 termos-chave.</p>` +
      `<label class="sr-only" for="f9BookFeynman">Sua síntese do livro</label>` +
      `<textarea class="f9-textarea" id="f9BookFeynman" placeholder="Explique a ideia central sem consultar o resumo...">${esc(saved)}</textarea>` +
      `<div class="f9-row"><button type="button" class="f9-btn f9-btn--primary" ` +
      `data-f9-book-feynman="${esc(book.id)}">Salvar síntese</button>` +
      `<p class="f9-feedback" data-f9-feynman-feedback role="status"></p></div></section>`;
  }

  function renderBook(view, id) {
    if (!view) return false;
    const book = findBook(id) || null;
    currentBookId = book ? book.id : null;
    if (!book) {
      view.innerHTML = `<div class="f9-shell"><p>Resumo indisponível.</p></div>`;
      return false;
    }
    const key = `book-${book.id}`;
    const score = computeScore(key, book.exercises || []);
    const passed = feynmanPassed(key, { minChars: 30, keywords: book.keywords || [] });
    const current = f9();
    if (current && Array.isArray(current.bookSummaries.seen) && current.bookSummaries.seen.indexOf(book.id) < 0) {
      current.bookSummaries.seen.push(book.id);
      current.bookSummaries.activeBook = book.id;
      if (storage() && typeof storage().save === "function") storage().save();
    }
    view.innerHTML = `<div class="f9-shell" data-f9-book-detail="${esc(book.id)}">` +
      `<section class="f9-hero" aria-labelledby="f9BookTitle">` +
      `<span class="f9-eyebrow">${esc(TAB_LABELS[book.category] || book.category)} · ${esc(book.year || "")}</span>` +
      `<h1 id="f9BookTitle">${esc(book.title)}</h1>` +
      `<p>${esc(book.author)}</p><p>${(book.tags || []).map(esc).join(" · ")}</p></section>` +
      `<section class="f9-section" aria-labelledby="f9BookSummaryTitle">` +
      `<h2 id="f9BookSummaryTitle">Resumo em três movimentos</h2>` +
      (book.summary || []).map(paras).join("") + `</section>` +
      `<section class="f9-section" aria-labelledby="f9BookIdeasTitle">` +
      `<h2 id="f9BookIdeasTitle">Ideias-chave</h2>` + list(book.keyIdeas) + `</section>` +
      scoreHTML(score, passed) +
      exerciseHTML(key, book.exercises || []) +
      bookFeynmanHTML(book) +
      `<p class="f9-muted">${esc(book.source || "")}</p>` +
      `<button type="button" class="f9-btn f9-btn--ghost" data-f9-go="flix">Voltar ao catálogo</button>` +
      `</div>`;
    return true;
  }

  /* ---------- Onboarding: espelha o estado v8 no namespace v9 ---------- */

  function syncOnboarding(action) {
    const s = storage();
    if (!s || typeof s.get !== "function") return false;
    const state = s.get();
    const current = f9();
    if (!current || !current.onboarding) return false;
    const f8 = state.forge8 && state.forge8.onboarding ? state.forge8.onboarding : {};
    const step = Math.max(0, Math.min(2, Number(f8.step) || 0));
    if (action === "next" || action === "prev" || action === "start" || action === "skip") {
      current.onboarding.step = action === "prev" ? Math.max(0, step - 1) : Math.min(2, step + (action === "prev" ? 0 : 1));
    } else {
      current.onboarding.step = step;
    }
    if (action === "start" || action === "skip" || f8.completedAt) {
      current.onboarding.completedAt = current.onboarding.completedAt || new Date().toISOString();
    }
    if (f8.entryPoint) current.onboarding.route = f8.entryPoint;
    if (f8.dailyGoal) current.onboarding.pace = f8.dailyGoal;
    if (typeof s.save === "function") s.save();
    return true;
  }

  /* ---------- Eventos delegados ---------- */

  function feedback(node, message, tone) {
    if (!node) return;
    node.textContent = message;
    if (tone) node.dataset.tone = tone;
  }

  function grade(scope, root) {
    const host = root || document;
    const escaped = (typeof CSS !== "undefined" && CSS.escape) ? CSS.escape(scope) : scope;
    const container = host.querySelector(`[data-f9-grade="${escaped}"]`);
    const scopeRoot = container ? container.closest(".f9-shell") : host;
    let key = scope;
    let exercises = [];
    const book = currentBookId && `book-${currentBookId}` === scope ? findBook(currentBookId) : null;
    if (book) {
      exercises = book.exercises || [];
    } else if (lastLesson) {
      const track = TRACKS[lastLesson.trackId];
      const module = (track && track.modules || []).find(m => m.id === lastLesson.moduleId);
      exercises = module && module.exercises || [];
      key = `${lastLesson.trackId}.${lastLesson.moduleId}`;
    }
    const total = exercises.length;
    let correct = 0;
    exercises.forEach((exercise, qi) => {
      const given = answers[`${scope}:${qi}`];
      const ok = given === Number(exercise.answer);
      if (ok) correct++;
      const slot = scopeRoot.querySelector(`[data-f9-exercise-feedback="${qi}"]`);
      if (slot) feedback(slot, ok ? "Correto." : `Revise: ${exercise.explanation || "tente outro ângulo."}`, ok ? "ok" : "warn");
    });
    const score = total ? Math.round((correct / total) * 10) : 0;
    const passed = feynmanPassed(scope, { minChars: 30, keywords: book ? (book.keywords || []) : [] });
    const panel = scopeRoot.querySelector("[data-f9-mastery]");
    if (panel) {
      panel.innerHTML = `<span>Nota: <b>${score}/10</b> · Feynman: ${passed ? "evidência válida" : "pendente"}</span>` +
        `<strong>${score >= 8 && passed ? "Domínio registrado" : "Em progresso"}</strong>`;
    }
    if (score >= 8 && passed && storage()) {
      if (book && typeof storage().unlockTrilha === "function") {
        if (book.category === "tecnicos" || book.category === "exercicios") storage().unlockTrilha("mental");
        else storage().unlockTrilha("humanas");
      }
      if (!book && lastLesson && typeof storage().unlockTrilha === "function") {
        storage().unlockTrilha(lastLesson.trackId === "13" ? "mental" : "humanas");
      }
    }
    toast(`Nota ${score}/10 · ${correct} de ${total} exercícios corretos.`);
    return score;
  }

  function saveFeynman(button) {
    const s = storage();
    if (!s || typeof s.get !== "function") return false;
    const scope = button.dataset.f9Feynman || (currentBookId ? `book-${currentBookId}` : "");
    const field = document.getElementById(button.dataset.f9BookFeynman ? "f9BookFeynman" : "f9Feynman");
    const text = field ? field.value : "";
    const compact = text.replace(/\s+/g, " ").trim();
    const fm = { minChars: 30, keywords: [] };
    if (button.dataset.f9BookFeynman) {
      const book = findBook(button.dataset.f9BookFeynman);
      if (book) fm.keywords = book.keywords || [];
    } else if (lastLesson) {
      const track = TRACKS[lastLesson.trackId];
      const module = (track && track.modules || []).find(m => m.id === lastLesson.moduleId);
      if (module && module.lesson && module.lesson.feynman) fm.keywords = module.lesson.feynman.keywords || [];
    }
    const min = Number(fm.minChars) || 30;
    const keys = (fm.keywords || []).map(normalize).filter(Boolean);
    const covered = keys.filter(word => normalize(compact).indexOf(word) >= 0).length;
    const need = Math.min(2, keys.length);
    const ok = compact.length >= min && covered >= need;
    const slot = button.parentElement && button.parentElement.querySelector("[data-f9-feynman-feedback]");
    feedback(slot, ok
      ? `Síntese registrada: ${compact.length} caracteres e ${covered} termos-chave.`
      : `Precisa de ao menos ${min} caracteres e ${need} termo(s)-chave: ${(fm.keywords || []).join(", ")}.`,
      ok ? "ok" : "warn");
    if (ok && typeof s.saveFeynman === "function") s.saveFeynman(scope, text);
    if (ok && typeof s.save === "function") {
      const current = f9();
      if (current && current.bookSummaries && button.dataset.f9BookFeynman && current.bookSummaries.seen.indexOf(button.dataset.f9BookFeynman) < 0) {
        current.bookSummaries.seen.push(button.dataset.f9BookFeynman);
        s.save();
      }
    }
    return ok;
  }

  document.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const view = document.getElementById("view");

    const nav = target.closest("[data-f9-go]");
    if (nav) { go(nav.dataset.f9Go); return; }

    const tab = target.closest("[data-f9-tab]");
    if (tab) { switchTab(view, tab.dataset.f9Tab); return; }

    const book = target.closest("[data-f9-book]");
    if (book) { goToBook(book.dataset.f9Book); return; }

    const moduleButton = target.closest("[data-f9-module]");
    if (moduleButton) {
      const trackId = moduleButton.dataset.f9Module;
      const moduleId = moduleButton.dataset.f9ModuleId;
      if (page === "dashboard" || page === "flix") go(`trilha${trackId}`);
      if (view) mountLesson(view, trackId, moduleId);
      return;
    }

    const feynmanButton = target.closest("[data-f9-feynman], [data-f9-book-feynman]");
    if (feynmanButton) { saveFeynman(feynmanButton); return; }

    const gradeButton = target.closest("[data-f9-grade]");
    if (gradeButton) { grade(gradeButton.dataset.f9Grade); return; }

    const option = target.closest("[data-f9-option]");
    if (option) {
      const box = option.closest("[data-f9-check]");
      if (!box) return;
      const track = TRACKS[box.dataset.f9Track];
      const module = (track && track.modules || []).find(m => m.id === box.dataset.f9Module);
      const check = module && module.lesson && (module.lesson.checks || [])[Number(box.dataset.f9Check)];
      if (!check) return;
      const ok = Number(option.dataset.f9Option) === Number(check.correct);
      feedback(box.querySelector(".f9-feedback"),
        ok ? "Correto. Você raciocinou, não decorou." : "Ainda não. Use a pista e tente outro ângulo.",
        ok ? "ok" : "warn");
      const hint = box.querySelector(".f9-hint");
      if (hint) {
        hint.hidden = false;
        hint.textContent = (check.hints || [])[0] || "Releia a camada física da aula.";
      }
      return;
    }

    const hintButton = target.closest("[data-f9-hint]");
    if (hintButton) {
      const box = hintButton.closest("[data-f9-check]");
      if (!box) return;
      const track = TRACKS[box.dataset.f9Track];
      const module = (track && track.modules || []).find(m => m.id === box.dataset.f9Module);
      const check = module && module.lesson && (module.lesson.checks || [])[Number(box.dataset.f9Check)];
      const hints = (check && check.hints) || [];
      const used = Number(hintButton.dataset.f9Hint) || 0;
      const slot = box.querySelector(".f9-hint");
      if (slot) {
        slot.hidden = false;
        slot.textContent = hints[Math.min(used, Math.max(0, hints.length - 1))] || "Releia a camada física da aula.";
      }
      hintButton.dataset.f9Hint = String(Math.min(used + 1, Math.max(0, hints.length - 1)));
      return;
    }

    const onboard = target.closest("[data-f8-onboard]");
    if (onboard) syncOnboarding(onboard.dataset.f8Onboard);
  });

  document.addEventListener("change", event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== "radio") return;
    const name = String(input.name || "");
    if (name.indexOf("f9q:") !== 0) return;
    const parts = name.split(":");
    answers[`${parts[1]}:${parts[2]}`] = Number(input.value);
  });

  document.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const tab = event.target;
    if (!(tab instanceof Element) || !tab.matches("[data-f9-tab]")) return;
    event.preventDefault();
    switchTab(document.getElementById("view"), tab.dataset.f9Tab);
    const next = document.getElementById(`f9-tab-${tab.dataset.f9Tab}`);
    if (next && typeof next.focus === "function") next.focus();
  });

  function goToBook(id) {
    currentBookId = id;
    if (typeof page !== "undefined" && page === "book-summary") {
      renderBook(document.getElementById("view"), id);
    } else {
      go("book-summary");
    }
  }

  syncOnboarding();

  window.Forge9UI = {
    esc,
    rules: RULES,
    tabs: TABS,
    tabLabels: TAB_LABELS,
    tracks: TRACKS,
    books: BOOKS.books || [],
    currentBook() { return findBook(currentBookId); },
    mountDashboard,
    renderCatalog,
    renderCatalogTab,
    switchTab,
    renderTrilha,
    mountLesson,
    renderBook,
    renderLesson(view, trackId, moduleId) { if (view) return mountLesson(view, trackId, moduleId); return false; },
    syncOnboarding,
    grade,
    scoreFor(scope, exercises) { return computeScore(scope, exercises); },
    feynmanOk(scope, fm) { return feynmanPassed(scope, fm); }
  };
})();

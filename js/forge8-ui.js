/* ============================================================
   FORGE 8.0 — controlador aditivo de interface.
   Onboarding em 3 passos, home em 3 blocos, navegação em 6
   grupos, micro-cards contextuais, aula em 12 regras e
   biblioteca unificada em abas. Sem rede e sem apagar o v7.
   ============================================================ */

(function () {
  "use strict";

  const CONTENT = window.FORGE8_LESSONS || { rules: [], lessons: {}, cycle: [] };
  const GLOSSARY = window.FORGE8_GLOSSARY || {};
  const RULES = Array.isArray(CONTENT.rules) ? CONTENT.rules : [];
  const LESSONS = CONTENT.lessons || {};
  const CYCLE = Array.isArray(CONTENT.cycle) ? CONTENT.cycle : [];
  const TABS = ["livros", "pdfs", "resumos", "catalogo"];
  const TAB_LABELS = { livros: "Livros", pdfs: "PDFs", resumos: "Resumos", catalogo: "Catálogo" };
  let tipSeq = 0;

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function state() {
    return window.Storage && typeof window.Storage.get === "function" ? window.Storage.get() : null;
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function dueCount() {
    const s = state() || {};
    let n = 0;
    (s.mistakes || []).forEach(m => {
      if (!m.resolved && String(m.nextReview || m.next_review || "").slice(0, 10) <= today()) n++;
    });
    const now = Date.now();
    Object.values(s.cards || {}).forEach(card => {
      if (Number(card.next_review || card.nextReview || 0) <= now) n++;
    });
    return n;
  }

  function nextLessonKey() {
    const s = state() || {};
    const done = Array.isArray(s.done) ? s.done : [];
    const keys = Object.keys(LESSONS);
    return keys.find(k => done.indexOf(k) < 0) || keys[0] || "";
  }

  /* ---------- Micro-cards contextuais (no máximo duas linhas) ---------- */

  function term(name) {
    const raw = GLOSSARY[name] || (typeof window.forge8Glossary === "function" ? window.forge8Glossary(name) : null);
    if (!raw) return esc(name);
    const definition = String(raw);
    const lines = definition.length > 118 ? definition.slice(0, 115).trimEnd() + "..." : definition;
    const id = "f8-tip-" + (++tipSeq);
    return `<span class="f8-term">${esc(name)}<span class="f8-info-wrap">` +
      `<button type="button" class="f8-info" data-f8-term="${esc(name)}" ` +
      `aria-label="O que significa ${esc(name)}?" aria-expanded="false" aria-controls="${id}">?</button>` +
      `<span class="f8-tip" id="${id}" role="tooltip" hidden><strong>${esc(name)}</strong>${esc(lines)}</span>` +
      `</span></span>`;
  }

  function closeTips(scope) {
    (scope || document).querySelectorAll(".f8-tip:not([hidden])").forEach(tip => {
      tip.hidden = true;
      const button = tip.parentElement.querySelector(".f8-info");
      if (button) button.setAttribute("aria-expanded", "false");
    });
  }

  /* ---------- Home: dois cartões complementares ao herói estático ---------- */

  function homeHTML() {
    const s = state() || {};
    const due = dueCount();
    const minutes = Math.max(2, Math.min(15, due * 2));
    const hours = Number(s.hours) || 0;
    const goal = Number(s.weeklyGoal) || 7;
    const pct = goal > 0 ? Math.min(100, Math.round((hours / goal) * 100)) : 0;
    const streak = Number(s.streak) || 0;
    const done = (s.done || []).length;
    const reveal = done >= 1 || Boolean(s.forge8 && s.forge8.advancedRevealed);
    const advanced = [
      ["oral", "Prova oral", "Explicação em voz alta com rubrica."],
      ["domain", "Mapa de domínio", "Pré-requisitos e evolução."],
      ["crypto", "Lab crypto", "Entropia, cifras e LCG."],
      ["lab", "Simuladores", "Portas, CPU e Tensor AI."]
    ];

    return `<div class="f8-home-grid">` +
      `<section class="f8-mini-card" aria-labelledby="f8ReviewTitle">` +
      `<h2 id="f8ReviewTitle">Revisões de hoje</h2>` +
      `<p><strong>${due}</strong> cartões vencendo. Revisar agora leva cerca de ${minutes} min.</p>` +
      `<div class="f8-actions"><button type="button" class="f8-secondary" data-f8-go="review">Revisar agora (${minutes} min)</button>` +
      `<button type="button" class="f8-textlink" data-f8-go="mistakes">Ver caderno de erros</button></div>` +
      `<p>${term("SM-2")}</p></section>` +
      `<section class="f8-mini-card" aria-labelledby="f8WeekTitle">` +
      `<h2 id="f8WeekTitle">Progresso da semana</h2>` +
      `<p>${hours.toFixed(1)}h de ${goal.toFixed(1)}h (${pct}%)</p>` +
      `<div class="f8-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" ` +
      `aria-valuenow="${pct}" aria-label="Progresso da meta semanal"><span style="width:${pct}%"></span></div>` +
      `<div class="f8-metric"><span>Sequência (streak)</span><strong>${streak} dias</strong></div>` +
      `<div class="f8-metric"><span>Aulas concluídas</span><strong>${done}</strong></div>` +
      `</section></div>` +
      `<details class="f8-advanced" ${reveal ? "open" : ""}>` +
      `<summary>Ferramentas avançadas${reveal ? "" : " (desbloqueiam após a 1ª aula)"}</summary>` +
      `<div class="f8-grid">${advanced.map(([route, label, hint]) =>
        `<button type="button" data-f8-go="${route}"><strong>${esc(label)}</strong><small>${esc(hint)}</small></button>`
      ).join("")}</div></details>`;
  }

  function mountDashboard(view) {
    if (!view) return;
    if (!view.querySelector("#f8HomeRoot")) {
      const root = document.createElement("div");
      root.id = "f8HomeRoot";
      const map = view.querySelector("#f7MapRoot");
      view.insertBefore(root, map || null);
    }
    view.querySelector("#f8HomeRoot").innerHTML = homeHTML();
  }

  /* ---------- Onboarding em 3 passos (sem bloquear a navegação) ---------- */

  function onboardingHTML() {
    const s = state() || {};
    const f8 = (s.forge8 && s.forge8.onboarding) || {};
    const step = Math.max(0, Math.min(2, Number(f8.step) || 0));
    const steps = ["O ciclo", "Ponto de partida", "Meta diária"];
    const entries = [
      ["zero", "Do zero absoluto", "Fundamentos de matemática e lógica."],
      ["placement", "Teste de nivelamento", "Diagnóstico adaptativo de 3 minutos."],
      ["free", "Trilha livre", "Escolha qualquer trilha do catálogo."]
    ];
    const goals = [
      ["leve", "30 min/dia", "Ritmo leve"],
      ["consistente", "1h30/dia", "Recomendado"],
      ["intensivo", "3h+/dia", "Ritmo intensivo"]
    ];

    return `<section class="f8-onboard" id="f8Onboard" aria-labelledby="f8OnboardTitle">` +
      `<div class="f8-steps-rail" aria-label="Etapas do onboarding">` +
      steps.map((label, i) =>
        `<span class="f8-step-pill" data-current="${i === step}">${i + 1}. ${esc(label)}</span>`
      ).join("") + `</div>` +
      `<p class="f8-kicker">Boas-vindas ao FORGE 8.0</p>` +
      `<h1 id="f8OnboardTitle">Comece com um passo claro</h1>` +
      `<section data-f8-onboard-step="0" ${step === 0 ? "" : "hidden"}>` +
      `<p>Você aprende em um ciclo curto e repetível:</p><ol class="f8-flow">` +
      CYCLE.map(c => `<li>${esc(c)}</li>`).join("") + `</ol>` +
      `<p>${term("Feynman")} entra no fim: você explica com as próprias palavras.</p></section>` +
      `<section data-f8-onboard-step="1" ${step === 1 ? "" : "hidden"}>` +
      `<p>Onde você quer começar?</p><div class="f8-choice-grid">` +
      entries.map(([key, title, hint]) =>
        `<button type="button" class="f8-choice" data-f8-entry="${key}" ` +
        `aria-pressed="${f8.entryPoint === key}"><strong>${esc(title)}</strong><small>${esc(hint)}</small></button>`
      ).join("") + `</div></section>` +
      `<section data-f8-onboard-step="2" ${step === 2 ? "" : "hidden"}>` +
      `<p>Quanto tempo você pode estudar por dia?</p><div class="f8-choice-grid">` +
      goals.map(([key, title, hint]) =>
        `<button type="button" class="f8-goal" data-f8-goal="${key}" ` +
        `aria-pressed="${(f8.dailyGoal || "consistente") === key}"><strong>${esc(title)}</strong><small>${esc(hint)}</small></button>`
      ).join("") + `</div></section>` +
      `<div class="f8-onboard-nav">` +
      `<button type="button" class="f8-secondary" data-f8-onboard="prev" ${step === 0 ? "hidden" : ""}>Voltar</button>` +
      (step < 2
        ? `<button type="button" class="f8-primary" data-f8-onboard="next">Próximo passo →</button>`
        : `<button type="button" class="f8-primary" data-f8-onboard="start">Começar minha primeira aula →</button>`) +
      `</div><button type="button" class="f8-textlink" data-f8-onboard="skip">Pular apresentação</button></section>`;
  }

  function mountOnboarding(view) {
    if (!view) return false;
    const s = state() || {};
    if (s.isFirstVisit !== true) return false;
    const panel = view.querySelector("#f8Onboard");
    if (!panel) {
      view.insertAdjacentHTML("afterbegin", onboardingHTML());
      return true;
    }
    // Painel do primeiro paint: o passo 0 já está no HTML. Somente uma
    // visita retomada em outro passo precisa ser redesenada (não é CLS,
    // pois acontece em navigation, com input do usuário).
    panel.hidden = false;
    const step = Number((s.forge8 && s.forge8.onboarding && s.forge8.onboarding.step) || 0);
    if (step !== 0) renderOnboard();
    return true;
  }

  function renderOnboard() {
    const panel = document.getElementById("f8Onboard");
    if (!panel) return;
    const outer = document.createElement("div");
    outer.innerHTML = onboardingHTML();
    panel.replaceWith(outer.firstElementChild);
  }

  function dismissOnboard() {
    if (window.Storage && typeof window.Storage.finishOnboarding === "function") window.Storage.finishOnboarding();
    const panel = document.getElementById("f8Onboard");
    if (panel) panel.remove();
  }

  function advanceOnboard(delta) {
    if (!window.Storage || typeof window.Storage.setOnboardingStep !== "function") return;
    const f8 = window.Storage.getForge8State();
    const current = Math.max(0, Math.min(2, Number(f8.onboarding.step) || 0));
    window.Storage.setOnboardingStep(Math.max(0, Math.min(2, current + delta)));
    renderOnboard();
  }

  function startOnboarding(entry) {
    const choice = entry || (state()?.forge8?.onboarding?.entryPoint || "zero");
    dismissOnboard();
    if (typeof window.goToPage !== "function") return;
    if (choice === "placement") window.goToPage("study");
    else if (choice === "free") window.goToPage("tracks");
    else window.goToPage("deep-lesson");
  }

  /* ---------- Navegação em 6 grupos ---------- */

  const GROUPS = [
    { id: "painel", label: "Painel", sub: "Seu ponto de partida", pages: ["dashboard", "tracks", "focus"] },
    { id: "pratica", label: "Prática guiada", sub: "Aula, exercício e revisão", pages: ["plan", "lab", "review", "mistakes", "feynman", "study"] },
    { id: "metodo", label: "Método FORGE", sub: "Porquê e como estudar", pages: ["porque", "protocol", "domain", "oral", "bugs"] },
    { id: "labs", label: "Laboratórios", sub: "Simulações e desafios", pages: ["crypto", "catalog", "projects"] },
    { id: "referencia", label: "Biblioteca", sub: "Fontes, livros e resumos", pages: ["library", "richlib", "books", "summaries", "glossary"] },
    { id: "dados", label: "Dados", sub: "Progresso e backup", pages: ["settings"] }
  ];

  function navHTML() {
    return GROUPS.map(group =>
      `<div class="f8-nav-group" data-f8-group="${group.id}">` +
      `<button type="button" class="f8-group-head" data-f8-default="${group.pages[0]}" ` +
      `aria-expanded="false" aria-label="${esc(group.label)}: ${esc(group.sub)}">` +
      `<span class="f8-group-label">${esc(group.label)}</span>` +
      `<span class="f8-group-sub">${esc(group.sub)}</span></button>` +
      `<div class="f8-subnav" hidden>` +
      group.pages.map(page => `<button type="button" data-page="${page}">${pageLabel(page)}</button>`).join("") +
      `</div></div>`
    ).join("");
  }

  function pageLabel(page) {
    const labels = {
      dashboard: "▦ Painel geral", tracks: "▤ Trilhas e aulas", focus: "◉ Modo foco",
      plan: "◇ Meu plano", lab: "⌘ Laboratórios", review: "◷ Revisão espaçada",
      mistakes: "✎ Caderno de erros", feynman: "◎ Técnica Feynman", study: "✦ Aprenda a estudar",
      porque: "✧ O Porquê de Tudo", protocol: "◫ Protocolo de estudo", domain: "◈ Mapa de domínio",
      oral: "◉ Prova oral", bugs: "✖ Caça-bugs", crypto: "⚿ Laboratório crypto",
      library: "▣ Biblioteca unificada", richlib: "▤ Biblioteca rica", books: "▤ Livros em PDF",
      summaries: "▤ Livros & Resumos", glossary: "◬ Glossário", projects: "⚒ Projetos integradores",
      catalog: "⌗ Catálogo de labs", settings: "⚙ Progresso e backup"
    };
    return labels[page] || page;
  }

  function syncNav(current, permanent) {
    const nav = document.getElementById("nav");
    if (!nav) return;
    nav.querySelectorAll(".f8-subnav").forEach(sub => { sub.hidden = true; });
    nav.querySelectorAll(".f8-group-head").forEach(head => {
      head.setAttribute("aria-expanded", "false");
      head.removeAttribute("aria-current");
      head.classList.remove("active");
      head.closest(".f8-nav-group")?.setAttribute("data-open", "false");
    });
    const active = nav.querySelector(`.f8-subnav button[data-page="${current}"]`);
    if (active) {
      const group = active.closest(".f8-nav-group");
      const head = group && group.querySelector(".f8-group-head");
      if (permanent !== false) {
        active.closest(".f8-subnav").hidden = false;
        if (head) {
          head.setAttribute("aria-expanded", "true");
          head.setAttribute("aria-current", "page");
          head.classList.add("active");
        }
        if (group) group.setAttribute("data-open", "true");
      }
    }
    const f8 = state() && state().forge8;
    if (f8 && f8.nav) f8.nav.activeGroup = active ? active.closest(".f8-nav-group").dataset.f8Group : "painel";
  }

  /* ---------- Aula no padrão Universo Narrado: 12 blocos ---------- */

  function ruleBlock(index, title, body, ruleIndex) {
    return `<section class="f8-deep-block" data-f8-rule="${index + 1}">` +
      `<h2>${index + 1}. ${esc(title)}</h2>${body}` +
      (ruleIndex != null ? `<p class="f8-rule-name">Regra ${ruleIndex + 1}: ${esc(RULES[ruleIndex] || "")}</p>` : "") +
      `</section>`;
  }

  function deepLessonHTML(key) {
    const lesson = LESSONS[key] || Object.values(LESSONS)[0] || {};
    if (!lesson || !lesson.title) {
      return `<div class="f8-deep"><h1>Aula indisponível</h1><p>Escolha outra aula na trilha.</p></div>`;
    }
    const para = text => `<p>${esc(text).replace(/\n/g, "<br>")}</p>`;
    const list = items => `<ul>${(items || []).map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
    const pre = text => `<pre><code>${esc(text)}</code></pre>`;
    const blocks = [];

    blocks.push(ruleBlock(0, RULES[0] || "Problema real", para(lesson.hook), 0));
    blocks.push(ruleBlock(1, "Intuição com limites explícitos", para(lesson.intuition) +
      `<p class="f8-limit">${esc(lesson.limit)}</p>`, 4));
    blocks.push(ruleBlock(2, "Construção progressiva em camadas",
      `<ol>${(lesson.layers || []).map(x => `<li>${esc(x)}</li>`).join("")}</ol>`, 1));
    blocks.push(ruleBlock(3, "Fundamentação e redução à camada base", para(lesson.ruleWhy) + pre(lesson.physical), 2));
    blocks.push(ruleBlock(4, "Exemplo concreto antes da generalização", pre(lesson.example), 5));
    blocks.push(ruleBlock(5, "Armadilhas e erros comuns", list(lesson.traps) +
      `<p>${term("UAF")} · ${term("Segmentation Fault")}</p>`, 6));
    blocks.push(ruleBlock(6, "Onde aparece no mundo real", list(lesson.realWorld), 7));
    blocks.push(ruleBlock(7, "Blocos com checagem ativa", (lesson.checks || []).map((check, ci) =>
      `<div class="f8-check" data-f8-check="${ci}"><p><strong>Pergunta ${ci + 1}:</strong> ${esc(check.q)}</p>` +
      check.options.map((opt, oi) =>
        `<button type="button" data-f8-option="${oi}">${String.fromCharCode(65 + oi)}) ${esc(opt)}</button>`
      ).join("") +
      `<button type="button" class="f8-textlink" data-f8-hint="0">Mostrar pista</button>` +
      `<p class="f8-hint" hidden></p><p class="f8-feedback" role="status"></p></div>`
    ).join(""), 8));
    blocks.push(ruleBlock(8, "Explicação alternativa sob demanda",
      `<button type="button" class="f8-secondary" data-f8-alternative aria-expanded="false">` +
      `Não entendi — explique de outro jeito</button>` +
      `<div class="f8-alt" hidden><p>${esc(lesson.alternative && lesson.alternative.intro)}</p>` +
      `<p>${esc(lesson.alternative && lesson.alternative.text)}</p>` +
      pre(lesson.alternative && lesson.alternative.diagram) + `</div>`, 9));

    const fm = lesson.feynman || {};
    blocks.push(ruleBlock(9, "Teste de síntese Feynman", para(fm.prompt) +
      `<p>${term("Feynman")} · mínimo ${Number(fm.minChars) || 30} caracteres</p>` +
      `<label class="sr-only" for="f8Feynman">Sua explicação com suas próprias palavras</label>` +
      `<textarea class="f8-textarea" id="f8Feynman" placeholder="Explique com suas próprias palavras..."></textarea>` +
      `<div class="f8-actions"><button type="button" class="f8-primary" data-f8-feynman="${esc(key)}">` +
      `Salvar síntese</button><p class="f8-feedback" data-f8-feynman-feedback role="status"></p></div>`, 10));

    blocks.push(ruleBlock(10, "Resumo em 3 frases",
      `<ol class="f8-three">${(lesson.summary || []).map(x => `<li>${esc(x)}</li>`).join("")}</ol>`, 11));
    blocks.push(ruleBlock(11, "Elo de conexão",
      `<p><strong>${esc(lesson.connection)}</strong></p>` +
      `<p class="f8-metric">Regras aplicadas: ${RULES.length} de 12 · ${term("Peano")} quando aplicável</p>`));

    return `<div class="f8-deep" data-f8-lesson="${esc(key)}">` +
      `<p class="f8-kicker">${esc(lesson.kicker || lesson.track)}</p>` +
      `<h1>${esc(lesson.title)}</h1>${blocks.join("")}</div>`;
  }

  function mountLesson(view, key) {
    if (!view) return;
    view.innerHTML = deepLessonHTML(key || nextLessonKey());
  }

  /* ---------- Biblioteca unificada em abas ---------- */

  function tabsHTML(active) {
    return `<div class="f8-tabs" role="tablist" aria-label="Seções da biblioteca unificada">` +
      TABS.map(tab => `<button type="button" role="tab" id="f8-tab-${tab}" ` +
        `aria-controls="f8-panel-${tab}" aria-selected="${tab === active}" data-f8-tab="${tab}">` +
        `${TAB_LABELS[tab]}</button>`).join("") + `</div>` +
      `<div class="f8-panel" id="f8-panel-${active}" role="tabpanel" ` +
      `aria-labelledby="f8-tab-${active}"></div>`;
  }

  function renderTab(view, name) {
    const panel = view.querySelector(".f8-panel");
    if (!panel) return;
    if (name === "resumos") {
      if (window.SummariesPage && typeof SummariesPage.mountInto === "function") {
        // API aditiva do FORGE 8.0: o índice permanece dentro do tabpanel,
        // inclusive depois de buscar, filtrar, abrir e voltar do leitor.
        SummariesPage.mountInto(panel);
      } else if (window.SummariesPage && typeof SummariesPage.renderPage === "function") {
        SummariesPage.renderPage(panel);
      }
      return;
    }
    if (window.SummariesPage && typeof SummariesPage.detach === "function") SummariesPage.detach();
    if (name === "catalogo") {
      if (window.LibraryRich && typeof LibraryRich.pageHTML === "function") panel.innerHTML = LibraryRich.pageHTML();
      return;
    }
    if (name === "pdfs") {
      if (window.BooksPage && typeof BooksPage.renderPage === "function") BooksPage.renderPage(panel);
      return;
    }
    if (typeof window.libraryPage === "function") window.libraryPage(panel);
  }

  function renderLibrary(view, active) {
    if (!view) return;
    const s = state() || {};
    const current = TAB_LABELS[active] ? active : ((s.forge8 && s.forge8.library.activeTab) || "livros");
    view.innerHTML = tabsHTML(current);
    renderTab(view, current);
  }

  function switchTab(view, tab) {
    const name = TAB_LABELS[tab] ? tab : "livros";
    const f8 = window.Storage && typeof window.Storage.getForge8State === "function" ? window.Storage.getForge8State() : null;
    if (f8) {
      f8.library.activeTab = name;
      if (window.Storage.save) window.Storage.save();
    }
    view.querySelectorAll("[data-f8-tab]").forEach(button =>
      button.setAttribute("aria-selected", String(button.dataset.f8Tab === name)));
    view.querySelectorAll(".f8-panel").forEach(panel => panel.remove());
    const fresh = document.createElement("div");
    fresh.className = "f8-panel";
    fresh.id = "f8-panel-" + name;
    fresh.setAttribute("role", "tabpanel");
    fresh.setAttribute("aria-labelledby", "f8-tab-" + name);
    view.appendChild(fresh);
    renderTab(view, name);
  }

  /* ---------- Eventos delegados ---------- */

  function go(route) {
    if (typeof window.goToPage === "function") window.goToPage(route);
  }

  document.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const info = target.closest(".f8-info");
    if (info) {
      event.preventDefault();
      event.stopPropagation();
      const tip = info.parentElement.querySelector(".f8-tip");
      const shouldOpen = tip && tip.hidden;
      closeTips(document);
      if (shouldOpen) {
        tip.hidden = false;
        info.setAttribute("aria-expanded", "true");
        const f8 = window.Storage && typeof window.Storage.getForge8State === "function" ? window.Storage.getForge8State() : null;
        if (f8 && f8.glossarySeen.indexOf(info.dataset.f8Term) < 0) {
          f8.glossarySeen.push(info.dataset.f8Term);
          if (window.Storage.save) window.Storage.save();
        }
      }
      return;
    }
    if (!target.closest(".f8-tip")) closeTips(document);

    const group = target.closest(".f8-group-head");
    if (group) {
      const wrapper = group.closest(".f8-nav-group");
      const sub = wrapper && wrapper.querySelector(".f8-subnav");
      const willOpen = sub && sub.hidden;
      document.querySelectorAll("#nav .f8-subnav").forEach(s => { s.hidden = true; });
      document.querySelectorAll("#nav .f8-group-head").forEach(h => h.setAttribute("aria-expanded", "false"));
      document.querySelectorAll("#nav .f8-nav-group").forEach(g => g.setAttribute("data-open", "false"));
      if (sub && willOpen) {
        sub.hidden = false;
        group.setAttribute("aria-expanded", "true");
        if (wrapper) wrapper.setAttribute("data-open", "true");
      }
      if (group.dataset.f8Default) go(group.dataset.f8Default);
      return;
    }

    if (target.closest(".f8-subnav button[data-page]")) {
      const sub = target.closest(".f8-subnav");
      if (sub) sub.hidden = true;
    }

    const routeButton = target.closest("[data-f8-go]");
    if (routeButton) {
      go(routeButton.dataset.f8Go);
      return;
    }

    const onboard = target.closest("[data-f8-onboard]");
    if (onboard) {
      const action = onboard.dataset.f8Onboard;
      if (action === "next") advanceOnboard(1);
      else if (action === "prev") advanceOnboard(-1);
      else if (action === "skip") dismissOnboard();
      else if (action === "start") startOnboarding();
      return;
    }

    const entry = target.closest("[data-f8-entry]");
    if (entry && window.Storage && window.Storage.setOnboardingChoice) {
      window.Storage.setOnboardingChoice("entryPoint", entry.dataset.f8Entry);
      document.querySelectorAll("[data-f8-entry]").forEach(b => b.setAttribute("aria-pressed", String(b === entry)));
      return;
    }

    const goal = target.closest("[data-f8-goal]");
    if (goal && window.Storage && window.Storage.setOnboardingChoice) {
      window.Storage.setOnboardingChoice("dailyGoal", goal.dataset.f8Goal);
      document.querySelectorAll("[data-f8-goal]").forEach(b => b.setAttribute("aria-pressed", String(b === goal)));
      return;
    }

    const tab = target.closest("[data-f8-tab]");
    if (tab) {
      const view = document.getElementById("view");
      if (view) switchTab(view, tab.dataset.f8Tab);
      return;
    }

    const option = target.closest("[data-f8-option]");
    if (option) {
      const box = option.closest("[data-f8-check]");
      if (!box) return;
      const lessonKey = box.closest("[data-f8-lesson]")?.dataset.f8Lesson;
      const check = (LESSONS[lessonKey]?.checks || [])[Number(box.dataset.f8Check)] || {};
      const correct = Number(option.dataset.f8Option) === Number(check.correct);
      const feedback = box.querySelector(".f8-feedback");
      if (feedback) {
        feedback.textContent = correct ? "Correto. Você raciocinou, não decorou." : "Ainda não. Use a pista e tente outro ângulo.";
        feedback.dataset.tone = correct ? "ok" : "warn";
      }
      const hint = box.querySelector(".f8-hint");
      if (hint) {
        hint.hidden = false;
        hint.textContent = (check.hints || [])[0] || "Releia a camada física da aula.";
      }
      return;
    }

    const hintButton = target.closest("[data-f8-hint]");
    if (hintButton) {
      const box = hintButton.closest("[data-f8-check]");
      if (!box) return;
      const lessonKey = box.closest("[data-f8-lesson]")?.dataset.f8Lesson;
      const check = (LESSONS[lessonKey]?.checks || [])[Number(box.dataset.f8Check)] || {};
      const used = Number(hintButton.dataset.f8Hint) || 0;
      const hints = check.hints || [];
      const p = box.querySelector(".f8-hint");
      if (p) {
        p.hidden = false;
        p.textContent = hints[Math.min(used, Math.max(0, hints.length - 1))] || "Releia a camada física da aula.";
      }
      hintButton.dataset.f8Hint = String(Math.min(used + 1, Math.max(0, hints.length - 1)));
      return;
    }

    const alternative = target.closest("[data-f8-alternative]");
    if (alternative) {
      const panel = alternative.parentElement.querySelector(".f8-alt");
      if (!panel) return;
      panel.hidden = !panel.hidden;
      alternative.setAttribute("aria-expanded", String(!panel.hidden));
      alternative.textContent = panel.hidden ? "Não entendi — explique de outro jeito" : "Voltar à explicação original";
      return;
    }

    const feynman = target.closest("[data-f8-feynman]");
    if (feynman) {
      const key = feynman.dataset.f8Feynman;
      const lesson = LESSONS[key] || {};
      const fm = lesson.feynman || {};
      const field = document.getElementById("f8Feynman");
      const feedback = document.querySelector("[data-f8-feynman-feedback]");
      const text = String(field ? field.value : "");
      const compact = text.replace(/\s+/g, " ").trim();
      const min = Number(fm.minChars) || 30;
      const missing = (fm.keywords || []).filter(word => compact.toLowerCase().indexOf(String(word).toLowerCase()) < 0);
      const ok = compact.length >= min && missing.length === 0;
      if (feedback) {
        feedback.textContent = ok
          ? `Síntese registrada: ${compact.length} caracteres e termos-chave presentes.`
          : `Precisa de ao menos ${min} caracteres${missing.length ? ` e dos conceitos: ${missing.join(", ")}` : ""}.`;
        feedback.dataset.tone = ok ? "ok" : "warn";
      }
      if (window.Storage && typeof window.Storage.saveFeynman === "function") window.Storage.saveFeynman(key, text);
      if (ok && window.Storage && typeof window.Storage.revealAdvancedTools === "function") window.Storage.revealAdvancedTools();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeTips(document);
  });

  window.Forge8UI = {
    rules: RULES,
    lessons: LESSONS,
    cycle: CYCLE,
    groups: GROUPS,
    esc,
    term,
    closeTips,
    homeHTML,
    mountDashboard,
    onboardingHTML,
    mountOnboarding,
    renderOnboard,
    dismissOnboard,
    advanceOnboard,
    startOnboarding,
    navHTML,
    syncNav,
    deepLessonHTML,
    mountLesson,
    tabsHTML,
    renderLibrary,
    renderTab,
    switchTab
  };
})();

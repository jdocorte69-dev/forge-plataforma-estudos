/* ============================================================
   FORGE — study.js
   Evolução pedagógica (Fases 1–5): estudo guiado de livros/PDFs,
   tutor local sem API externa, ficha de artigo e diagnóstico de
   lacunas. Reutiliza Storage, CURRICULUM, LAB_CATALOG,PROJECTS,
   openLesson() e o roteador goToPage(). Nenhum dado é enviado
   para fora do navegador; nenhum progresso é inventado.
   ============================================================ */

(function (global) {
  "use strict";

  const STEP_LABELS = [
    "Preparação", "Leitura orientada", "Explicação", "Recuperação ativa",
    "Prática", "Síntese própria", "Revisão futura"
  ];
  const TUTOR_MODES = [
    ["explain", "Explique"], ["confused", "Não entendi"], ["zero", "Do zero"],
    ["example", "Exemplo"], ["test", "Me teste"], ["exercises", "Exercícios"],
    ["reasoning", "Analise meu raciocínio"], ["feynman", "Feynman"],
    ["summary", "Resumo de revisão"], ["compare", "Compare"],
    ["application", "Aplicação prática"], ["read", "Leia comigo"]
  ];
  const TUTOR_LABELS = Object.fromEntries(TUTOR_MODES);
  const STOPWORDS = new Set(("a as o os um uma uns umas e em de do da dos das por para com sem " +
    "sobre sob que qual quais quem cujo cuja como quando onde porque pois já mais menos muito " +
    "sua seu seus suas meu minha meus minhas nosso nossa nossos nossas seu esta este estes estas " +
    "esse essa esses essas aquele aquela aqueles aquelas é são era eram será serão foi foram " +
    "no na nos nas ao aos às pelo pela pelos pelas se não sim mas ou nem só também ainda aqui " +
    "ali entre após antes durante desde até contra através segundo conforme cada todo toda todos " +
    "todas outro outra outros outras tal tais qual").split(/\s+/));
  const CHECKLIST = [
    "Expliquei sem copiar a definição da fonte.",
    "Usei uma analogia e indiquei seus limites.",
    "Dei um exemplo concreto e verifiquei cada passo.",
    "Expliquei por que o conceito funciona.",
    "Identifiquei uma dúvida que ainda tenho.",
    "Consegui explicar sem jargão desnecessário."
  ];
  const ARTICLE_FIELDS = [
    ["doi", "DOI ou URL verificada"], ["title", "Título do artigo"],
    ["problem", "Problema"], ["objective", "Objetivo / pergunta central"],
    ["hypothesis", "Hipótese (quando houver)"], ["method", "Método"],
    ["evidence", "Evidências (dados, figuras, tabelas)"],
    ["inference", "Minha inferência (distinta do texto)"],
    ["results", "Resultados"], ["conclusion", "Conclusão dos autores"],
    ["limitations", "Limitações"], ["biases", "Possíveis vieses"],
    ["myExplanation", "Minha explicação"], ["doubts", "Dúvidas"],
    ["application", "Aplicação possível"], ["refs", "Referências consultadas"]
  ];
  const CRITICAL = [
    "Correlação não foi tratada como causalidade.",
    "Amostra e população foram identificadas.",
    "Limitações foram explicitadas pelos autores.",
    "Efeito e significância foram distinguidos, quando pertinentes.",
    "Figuras e tabelas foram lidas com atenção.",
    "Publicação revisada por pares ou preprint foi identificada."
  ];

  let root = null;
  const ui = {
    tab: "tutorial",
    sessionKey: "",
    session: {},
    sessionStep: 0,
    tutorialStep: 0,
    questions: [],
    summary: "",
    tutorMode: "explain",
    tutorText: "",
    tutorForm: {},
    output: "",
    chunkIndex: 0,
    chunkSize: 800,
    articleDraft: {},
    articleKey: ""
  };

  /* ---------------- utilitários ---------------- */

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function norm(value) {
    return String(value == null ? "" : value)
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }

  function slug(value) {
    return norm(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "sem-titulo";
  }

  function val(id) {
    const el = document.getElementById(id);
    return el ? String(el.value || "") : "";
  }

  function checked(id) {
    const el = document.getElementById(id);
    return Boolean(el && el.checked);
  }

  function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function books() {
    return Array.isArray(global.BOOKS) ? global.BOOKS : [];
  }

  function catalog() {
    return Array.isArray(global.LAB_CATALOG) ? global.LAB_CATALOG : [];
  }

  function curriculum() {
    if (typeof CURRICULUM !== "undefined" && CURRICULUM && typeof CURRICULUM === "object") return CURRICULUM;
    return global.CURRICULUM && typeof global.CURRICULUM === "object" ? global.CURRICULUM : {};
  }

  function projects() {
    if (typeof PROJECTS !== "undefined" && Array.isArray(PROJECTS)) return PROJECTS;
    return Array.isArray(global.PROJECTS) ? global.PROJECTS : [];
  }

  function trackName(track) {
    return (curriculum()[track] && curriculum()[track].name) || track || "Geral";
  }

  function lessonsFor(track) {
    const t = curriculum()[track];
    if (!t || !Array.isArray(t.modules)) return [];
    const out = [];
    t.modules.forEach((m, mi) => {
      (m.lessons || []).forEach((l, li) => {
        out.push({
          id: `${track}-${mi}-${li}`,
          title: l.title || l.name || `Aula ${li + 1}`,
          module: m.name || `Módulo ${mi + 1}`,
          count: Array.isArray(l.exercises) ? l.exercises.length : 0
        });
      });
    });
    return out;
  }

  function notify(message) {
    if (typeof global.toast === "function") global.toast(message);
  }

  function daysFromToday(days) {
    const d = new Date();
    d.setDate(d.getDate() + Number(days || 7));
    return d.toISOString().slice(0, 10);
  }

  /* ------- análise de texto estritamente local ------- */

  function sourceSentences(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .replace(/([.!?])\s+/g, "$1\n")
      .split("\n")
      .map(s => s.trim())
      .filter(s => s.length > 12)
      .slice(0, 400);
  }

  function topTerms(text, n) {
    const counts = new Map();
    String(text || "").toLowerCase().match(/[a-zà-ÿ]{4,}/g)?.forEach(word => {
      if (STOPWORDS.has(word)) return;
      counts.set(word, (counts.get(word) || 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, n || 8)
      .map(x => x[0]);
  }

  function bestSentence(sentences, term) {
    if (!term) return "";
    const needle = norm(term);
    return sentences.find(s => norm(s).includes(needle)) || "";
  }

  function makeQuestions(text, n) {
    const sentences = sourceSentences(text);
    return topTerms(text, n || 5).map(term => {
      const evidence = bestSentence(sentences, term);
      return {
        term,
        question: `Sem consultar o texto, explique o que é “${term}” e onde ele aparece na sua leitura.`,
        answer: evidence || "Termo identificado no texto, mas sem frase de contexto disponível.",
        hasEvidence: Boolean(evidence)
      };
    });
  }

  function extractiveSummary(text, n) {
    const sentences = sourceSentences(text);
    if (!sentences.length) return "";
    const terms = topTerms(text, 12);
    const scored = sentences.map((s, i) => {
      const lower = norm(s);
      const score = terms.reduce((sum, t) => sum + (lower.includes(t) ? 1 : 0), 0);
      return { i, s, score };
    });
    return scored.sort((a, b) => b.score - a.score || a.i - b.i)
      .slice(0, Math.min(n || 4, sentences.length))
      .sort((a, b) => a.i - b.i)
      .map(x => x.s)
      .join(" ");
  }

  function exampleSentences(text) {
    return sourceSentences(text)
      .filter(s => /exemplo|por exemplo|por instância|e\.g\.|como:|caso prático|suponha/i.test(s))
      .slice(0, 5);
  }

  function quoteBlock(text) {
    return text ? `<blockquote class="study-quote">[trecho] ${esc(text)}</blockquote>` : "";
  }

  function provenance() {
    return `<div class="study-provenance" role="note">
      <b>Legenda da resposta:</b> <span class="pill info">[trecho]</span> literal do material fornecido ·
      <span class="pill warn">[inferência]</span> dedução heurística, confira na fonte ·
      <span class="pill success">[sugestão]</span> estratégia de estudo, não afirmação sobre o documento ·
      <span class="pill">[não encontrado]</span> ausente no texto recebido.
    </div>`;
  }

  /* ---------------- sessão persistente ---------------- */

  function sessionKeyFor(book, section) {
    return `${slug(book || "geral")}::${slug(section || "sessao-inicial")}`;
  }

  function currentSession() {
    if (!ui.sessionKey) {
      const saved = Storage.getStudyState().lastSessionKey;
      ui.sessionKey = saved || sessionKeyFor("Geral", "sessao-inicial");
    }
    if (!ui.session || !ui.session.__key) {
      ui.session = { ...(Storage.getStudySession(ui.sessionKey) || {}), __key: ui.sessionKey };
    }
    return ui.session;
  }

  function captureSession() {
    if (ui.tab !== "session" && ui.tab !== "tutorial") return;
    const s = currentSession();
    const patch = {};
    const map = {
      objective: "s_objective", prerequisites: "s_prereq", text: "s_text",
      section: "s_section", sectionRef: "s_ref", explain: "s_explain",
      practice: "s_practice", synthesis: "s_synthesis", tutorialTopic: "tut_topic",
      tutorialObjective: "tut_objective", tutorialText: "tut_text",
      tutorialExplanation: "tut_explain", tutorialAnswer: "tut_answer"
    };
    Object.entries(map).forEach(([key, id]) => {
      const el = document.getElementById(id);
      if (el) patch[key] = el.value;
    });
    const checks = {};
    for (let i = 0; i < CHECKLIST.length; i++) checks[`c${i}`] = checked(`sc${i}`);
    if (ui.tab === "session" && document.getElementById("sc0")) patch.checks = checks;
    const cat = document.getElementById("tut_cat");
    if (cat) patch.tutorialCategory = cat.value;
    const interval = document.getElementById("s_days") || document.getElementById("tut_days");
    if (interval) patch.reviewDays = Number(interval.value) || 7;
    ui.session = { ...s, ...patch, __key: ui.sessionKey };
    Storage.saveStudySession(ui.sessionKey, patch);
  }

  function markStep(name, on) {
    const s = currentSession();
    s.steps = { ...(s.steps || {}), [name]: Boolean(on) };
    return Storage.saveStudySession(ui.sessionKey, { steps: s.steps });
  }

  function startFromBook(index) {
    const book = books()[Number(index)];
    if (!book) return notify("Livro não encontrado no catálogo.");
    captureSession();
    ui.sessionKey = sessionKeyFor(book.title, "sessao-inicial");
    const { __key, ...existing } = Storage.getStudySession(ui.sessionKey) || {};
    ui.session = {
      ...existing,
      bookIndex: Number(index), bookTitle: book.title, track: book.track,
      section: existing.section || "Sessão inicial",
      objective: existing.objective || "",
      text: existing.text || "",
      steps: existing.steps || {}
    };
    ui.tab = "session";
    ui.sessionStep = 0;
    ui.questions = [];
    ui.summary = "";
    Storage.saveStudySession(ui.sessionKey, ui.session);
    if (typeof global.goToPage === "function") global.goToPage("study");
    else notify("Sessão criada. Abra Aprenda a estudar para continuar.");
  }

  function newSession() {
    captureSession();
    const key = sessionKeyFor(currentSession().bookTitle || "Geral", `sessao-${Date.now()}`);
    ui.sessionKey = key;
    const { __key, ...previous } = currentSession();
    const nextSession = { ...previous, section: "Nova sessão", steps: {}, text: "", explain: "", synthesis: "" };
    ui.session = { ...nextSession, __key: key };
    ui.questions = [];
    ui.summary = "";
    ui.sessionStep = 0;
    Storage.saveStudySession(key, nextSession);
    paint();
    notify("Nova sessão criada; a anterior foi preservada.");
  }

  function openSession(key) {
    captureSession();
    ui.sessionKey = String(key || "");
    ui.session = { ...(Storage.getStudySession(ui.sessionKey) || {}), __key: ui.sessionKey };
    ui.tab = "session";
    ui.sessionStep = 0;
    ui.questions = [];
    paint();
  }

  function chooseBook(title) {
    if (!title) return;
    const book = books().find(b => b.title === title);
    captureSession();
    ui.sessionKey = sessionKeyFor(title, currentSession().section || "sessao-inicial");
    ui.session = {
      ...(Storage.getStudySession(ui.sessionKey) || {}),
      bookTitle: title,
      bookIndex: book ? books().indexOf(book) : null,
      track: book ? book.track : currentSession().track
    };
    ui.session.__key = ui.sessionKey;
    paint();
  }

  /* ---------------- página e abas ---------------- */

  function renderPage(container) {
    root = container;
    if (!root) return;
    if (document.getElementById("studyPanel")) {
      captureSession();
      if (ui.tab === "article") captureArticle();
      captureTutorText();
      captureTutorForm();
    }
    currentSession();
    root.innerHTML = `
<div class="eyebrow">Aprender a aprender</div>
<h1 class="h1">Aprenda a estudar</h1>
<p class="sub">Uma sequência curta e ativa para transformar leitura passiva em domínio: objetivo, leitura em blocos, explicação própria, recuperação sem consulta, prática, síntese e revisão agendada.</p>
<div class="study-privacy" role="note">
  <b>Privacidade e limites:</b> este tutor é <b>local</b> — usa apenas regras e o texto que você colar ou carregar (.txt/.md/.html).
  Nada é enviado a API externa, nenhuma chave é usada e nenhuma página de PDF é lida automaticamente:
  copie o trecho do leitor de PDF e cole aqui. O tutor não inventa citações, páginas nem trechos.
</div>
<div class="tabs study-tabs" role="tablist" aria-label="Seções de estudo">
  ${[["tutorial", "Aprenda a estudar"], ["session", "Sessão guiada"], ["tutor", "Tutor de documentos"], ["article", "Ficha de artigo"], ["gaps", "Lacunas"]].map(([key, label]) => `
    <button type="button" id="study-tab-${key}" role="tab" aria-selected="${ui.tab === key}"
      class="${ui.tab === key ? "active" : ""}" onclick="Study.setTab('${key}')">${label}</button>`).join("")}
</div>
<div class="study-panel" role="tabpanel" id="studyPanel" aria-labelledby="study-tab-${ui.tab}">${panelHTML()}</div>`;
    if (ui.tab === "tutor") {
      Object.entries(ui.tutorForm || {}).forEach(([id, value]) => {
        const field = document.getElementById(id);
        if (field && value !== undefined) field.value = value;
      });
    }
  }

  function setTab(next) {
    const target = String(next || "tutorial");
    if (target !== ui.tab) {
      ui.questions = [];
      if (target === "session" && ui.sessionStep === 3) ui.questions = makeQuestions(currentSession().text, 5);
    }
    captureSession();
    if (ui.tab === "article") captureArticle();
    captureTutorText();
    ui.tab = target;
    paint();
  }

  function paint() {
    if (!root) return;
    const panel = document.getElementById("studyPanel");
    if (!panel) { renderPage(root); return; }
    panel.setAttribute("aria-labelledby", `study-tab-${ui.tab}`);
    panel.innerHTML = panelHTML();
    if (ui.tab === "tutor") {
      Object.entries(ui.tutorForm || {}).forEach(([id, value]) => {
        const field = document.getElementById(id);
        if (field && value !== undefined) field.value = value;
      });
    }
    document.querySelectorAll(".study-tabs button").forEach(b => {
      const active = b.id === `study-tab-${ui.tab}`;
      b.classList.toggle("active", active);
      b.setAttribute("aria-selected", String(active));
    });
  }

  function panelHTML() {
    if (ui.tab === "tutorial") return tutorialHTML();
    if (ui.tab === "session") return sessionHTML();
    if (ui.tab === "tutor") return tutorHTML();
    if (ui.tab === "article") return articleHTML();
    return gapsHTML();
  }

  /* ---------------- 1. tutorial interativo ---------------- */

  function tutorialHTML() {
    const s = currentSession();
    const step = Number(ui.tutorialStep) || 0;
    const body = [
      () => `
        <p class="muted">Escolha <b>um</b> material principal. Menos fontes, mais profundidade.</p>
        <label class="field" for="tut_book">Livro da biblioteca</label>
        <select class="field" id="tut_book" onchange="Study.tutorialBook(this.value)">
          <option value="">— escolha um livro —</option>
          ${books().map(b => `<option value="${esc(b.title)}" ${s.bookTitle === b.title ? "selected" : ""}>${esc(b.title)}</option>`).join("")}
        </select>
        <label class="field" for="tut_topic" style="display:block;margin-top:10px">Capítulo ou seção escolhida</label>
        <input class="field" id="tut_topic" value="${esc(s.tutorialTopic || "")}" placeholder="Ex.: 3.2 Estruturas de decisão">
        <div class="actions"><button onclick="Study.tutorialSave(0)">Salvar escolha e avançar</button></div>`,
      () => `
        <p class="muted">Objetivo concreto: o que você quer conseguir fazer depois desta leitura?</p>
        <textarea class="field" id="tut_objective" rows="3" placeholder="Ex.: conseguir explicar quando usar while em vez de for, sem consultar.">${esc(s.tutorialObjective || "")}</textarea>
        <div class="actions"><button onclick="Study.tutorialSave(1)">Salvar objetivo e avançar</button></div>`,
      () => `
        <p class="muted">Leia uma seção pequena (10–20 linhas). Cole aqui o trecho ou carregue um arquivo de texto local.</p>
        <input class="field" type="file" accept=".txt,.md,.html,text/plain,text/markdown,text/html"
          onchange="Study.loadTutorialFile(this)" aria-label="Carregar texto local">
        <textarea class="field" id="tut_text" rows="7" placeholder="Cole o trecho lido...">${esc(s.tutorialText || s.text || "")}</textarea>
        <p class="small muted" id="tut_count">${String(s.tutorialText || s.text || "").trim().split(/\s+/).filter(Boolean).length} palavras · o texto fica apenas neste navegador.</p>
        <div class="actions"><button onclick="Study.tutorialSave(2)">Salvar trecho e avançar</button></div>`,
      () => `
        <p class="muted">Feche o material. A memória só se fortalece quando você precisa recuperar a informação sem vê-la.</p>
        <label class="check"><input type="checkbox" id="tut_closed" ${s.tutorialClosed ? "checked" : ""}> Fechei o PDF/livro e vou lembrar sem consultar.</label>
        <div class="actions"><button onclick="Study.tutorialSave(3)">Confirmar e avançar</button></div>`,
      () => `
        <p class="muted">Escreva com suas palavras. Não copie frases do texto; se travar, registre a lacuna.</p>
        <textarea class="field" id="tut_explain" rows="5" placeholder="Explique como se estivesse ensinando alguém que nunca viu isso.">${esc(s.tutorialExplanation || "")}</textarea>
        <div class="actions"><button onclick="Study.tutorialSave(4)">Salvar explicação e avançar</button></div>`,
      () => `
        <p class="muted">Perguntas geradas localmente a partir do trecho que você forneceu.</p>
        <div class="actions"><button class="secondary" onclick="Study.generateTutorialQuestions()">Gerar perguntas do trecho</button></div>
        <div id="tut_questions" class="study-questions">${ui.questions.length ? questionsHTML() : '<p class="small muted">Nenhuma pergunta gerada ainda.</p>'}</div>
        <textarea class="field" id="tut_answer" rows="3" placeholder="Tente responder sem consultar antes de abrir a resposta.">${esc(s.tutorialAnswer || "")}</textarea>
        <div class="actions"><button onclick="Study.tutorialSave(5)">Salvar tentativa e avançar</button></div>`,
      () => `
        <p class="muted">Confira apenas depois da tentativa. Compare a resposta com o trecho, não com a memória do tutor.</p>
        <div class="actions"><button class="secondary" onclick="Study.revealAnswers()">Mostrar conferência</button></div>
        <div id="tut_check">${ui.questions.length ? questionsHTML(true) : '<p class="small muted">Gere as perguntas na etapa anterior.</p>'}</div>
        <div class="actions"><button onclick="Study.tutorialGo(7)">Avancei para registrar lacunas</button></div>`,
      () => `
        <p class="muted">Registrar uma dúvida não é falha: é o ponto de partida da próxima sessão.</p>
        <label class="field" for="tut_gapText">O que ficou incerto?</label>
        <input class="field" id="tut_gapText" placeholder="Ex.: não sei por que a condição de parada é necessária">
        <label class="field" for="tut_cat" style="display:block;margin-top:10px">Categoria</label>
        <select class="field" id="tut_cat">
          <option value="">Sem classificar</option><option value="E1">E1 — Base</option>
          <option value="E2">E2 — Conceito</option><option value="E3">E3 — Execução</option>
          <option value="E4">E4 — Atenção/TDAH</option>
        </select>
        <div class="actions"><button onclick="Study.registerGap()">Registrar lacuna</button></div>`,
      () => `
        <p class="muted">Uma revisão curta no dia certo vale mais do que reler tudo hoje.</p>
        <label class="field" for="tut_days">Revisar depois de</label>
        <select class="field" id="tut_days"><option value="1">1 dia</option><option value="7" selected>7 dias</option><option value="30">30 dias</option></select>
        <div class="actions"><button onclick="Study.scheduleReview('tutorial')">Agendar revisão</button></div>
        ${s.reviewDue ? `<p class="success small">Próxima revisão: ${esc(s.reviewDue)}</p>` : ""}`
    ];
    const titles = [
      "Escolha um capítulo", "Defina o objetivo", "Leia uma seção pequena", "Feche o material",
      "Explique com suas palavras", "Teste sem consulta", "Confira com critério",
      "Registre uma lacuna", "Agende a revisão"
    ];
    return `<section class="card study-card" aria-label="Tutorial interativo de estudo">
      <div class="row"><h2>Tutorial em 9 etapas</h2><span class="pill info">${step + 1}/9</span></div>
      <p class="small muted">Cada etapa exige uma ação pequena. O progresso é salvo neste navegador.</p>
      <ol class="study-steps">
        ${titles.map((title, i) => `
          <li class="study-step ${i === step ? "current" : ""}">
            <button type="button" class="study-step-head" aria-expanded="${i === step}" onclick="Study.tutorialGo(${i})">
              <span class="study-badge">${i + 1}</span><span>${esc(title)}</span>
              ${(s.tutorialDone || {})[i] ? '<span class="pill success">feito</span>' : ""}
            </button>
            ${i === step ? `<div class="study-step-body">${body[i]()}</div>` : ""}
          </li>`).join("")}
      </ol>
      <div class="actions" style="justify-content:space-between">
        <button class="secondary" onclick="Study.tutorialGo(${Math.max(0, step - 1)})" ${step === 0 ? "disabled" : ""}>← Anterior</button>
        <button onclick="Study.tutorialGo(${Math.min(8, step + 1)})" ${step === 8 ? "disabled" : ""}>Próxima →</button>
      </div>
    </section>`;
  }

  function tutorialBook(title) {
    chooseBook(title);
  }

  function tutorialSave(step) {
    captureSession();
    const patch = { tutorialDone: { ...((currentSession().tutorialDone) || {}), [step]: true } };
    ui.session = { ...currentSession(), ...patch };
    Storage.saveStudySession(ui.sessionKey, patch);
    if (step < 8) ui.tutorialStep = step + 1;
    paint();
    notify("Etapa salva.");
  }

  function tutorialGo(step) {
    captureSession();
    ui.tutorialStep = Math.max(0, Math.min(8, Number(step) || 0));
    paint();
  }

  function loadTutorialFile(input) {
    const file = input && input.files && input.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return notify("Arquivo muito grande (limite 2 MB). Use um trecho menor.");
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "").slice(0, 120000);
      const area = document.getElementById("tut_text");
      if (area) { area.value = text; area.dispatchEvent(new Event("input")); }
      const count = document.getElementById("tut_count");
      if (count) count.textContent = `${text.trim().split(/\s+/).filter(Boolean).length} palavras · o texto fica apenas neste navegador.`;
      notify("Texto carregado localmente.");
    };
    reader.onerror = () => notify("Não foi possível ler o arquivo.");
    reader.readAsText(file);
  }

  function questionsHTML(revealed) {
    return ui.questions.map((q, i) => `
      <div class="study-question">
        <p><b>${i + 1}.</b> ${esc(q.question)}</p>
        ${revealed ? `<p class="study-answer">[${q.hasEvidence ? "trecho" : "não encontrado"}] ${esc(q.answer)}</p>` : ""}
      </div>`).join("");
  }

  function generateTutorialQuestions() {
    captureSession();
    ui.questions = makeQuestions(currentSession().tutorialText || currentSession().text, 5);
    setHTML("tut_questions", ui.questions.length ? questionsHTML() : '<p class="small muted">Cole um trecho na etapa 3 para gerar perguntas.</p>');
    notify(ui.questions.length ? `${ui.questions.length} perguntas geradas a partir do trecho.` : "Sem texto suficiente para gerar perguntas.");
  }

  function revealAnswers() {
    if (!ui.questions.length) generateTutorialQuestions();
    setHTML("tut_check", ui.questions.length ? questionsHTML(true) : '<p class="small muted">Sem trecho para conferir.</p>');
  }

  function registerGap() {
    captureSession();
    const s = currentSession();
    const text = val("tut_gapText").trim();
    if (!text) return notify("Descreva a lacuna antes de registrar.");
    const category = val("tut_cat");
    Storage.addStudyGap({ kind: "leitura", source: s.bookTitle || s.section || "", text, category });
    Storage.addMistake("estudo-guiado", s.track || "geral", text, "Lacuna registrada na leitura guiada", category);
    notify("Lacuna registrada no caderno de erros e no painel de lacunas.");
  }

  function scheduleReview(origin) {
    captureSession();
    const id = (origin === "tutorial") ? "tut_days" : "s_days";
    const days = Number(val(id)) || 7;
    Storage.saveStudySession(ui.sessionKey, { reviewDays: days, reviewDue: daysFromToday(days) });
    ui.session.reviewDue = daysFromToday(days);
    ui.session.reviewDays = days;
    paint();
    notify(`Revisão agendada para ${ui.session.reviewDue}.`);
  }

  /* ---------------- 2. sessão guiada ---------------- */

  function sessionHTML() {
    const s = currentSession();
    const step = Number(ui.sessionStep) || 0;
    const done = s.steps || {};
    const body = [
      () => `
        <div class="grid2">
          <div>
            <label class="field" for="s_objective">Objetivo desta sessão</label>
            <textarea class="field" id="s_objective" rows="3" placeholder="O que você quer conseguir explicar ao final?">${esc(s.objective || "")}</textarea>
          </div>
          <div>
            <label class="field" for="s_prereq">Pré-requisitos que preciso revisar</label>
            <textarea class="field" id="s_prereq" rows="3" placeholder="Ex.: depois de ler, percebi que não domino funções.">${esc(s.prerequisites || "")}</textarea>
          </div>
        </div>
        <h3>Pré-requisitos prováveis da trilha: ${esc(trackName(s.track))}</h3>
        <p class="small muted">Sugestão baseada na ordem do currículo; confirme com o índice do livro antes de estudar.</p>
        <ul class="study-list">${prerequisitesHTML(s.track)}</ul>
        <div class="actions"><button onclick="Study.sessionSave(0,'prepare')">Salvar e avançar</button></div>`,
      () => `
        <p class="muted">Leia em blocos. A cada bloco, anote uma ideia com suas palavras antes de avançar.</p>
        <label class="field" for="s_ref">Página, seção ou capítulo de referência (preencha apenas se o material indicar)</label>
        <input class="field" id="s_ref" value="${esc(s.sectionRef || "")}" placeholder="Ex.: cap. 3, seção 3.2 — se não houver, deixe em branco">
        <input class="field" type="file" accept=".txt,.md,.html,text/plain,text/markdown,text/html"
          onchange="Study.loadSessionFile(this)" aria-label="Carregar texto local da sessão">
        <label class="field" for="s_text" style="display:block;margin-top:10px">Trecho lido (copiado do PDF ou digitado)</label>
        <textarea class="field" id="s_text" rows="9" placeholder="Cole aqui o trecho que você leu. Nada é enviado para fora do navegador.">${esc(s.text || "")}</textarea>
        <div class="card study-reader" aria-label="Leia comigo">
          <div class="row"><b>Leia comigo</b>
            <label class="small">Bloco
              <select id="s_chunkSize" onchange="Study.setChunkSize(this.value)">
                ${[400, 800, 1200].map(n => `<option value="${n}" ${ui.chunkSize === n ? "selected" : ""}>${n} caracteres</option>`).join("")}
              </select>
            </label>
          </div>
          <div id="s_chunk" class="study-chunk">${chunkHTML()}</div>
          <div class="actions">
            <button class="secondary" onclick="Study.chunk(-1)">← Bloco anterior</button>
            <button class="secondary" onclick="Study.chunk(1)">Próximo bloco →</button>
          </div>
        </div>
        <div class="actions"><button onclick="Study.sessionSave(1,'read')">Salvar e avançar</button></div>`,
      () => `
        <p class="muted">Explicação própria (mínimo 80 caracteres). Ao salvar, ela também aparece na página <b>Técnica Feynman</b>.</p>
        <textarea class="field" id="s_explain" rows="6" placeholder="Explique o conceito sem olhar o texto.">${esc(s.explain || "")}</textarea>
        <p class="small muted">${String(s.explain || "").trim().length}/80 caracteres</p>
        <h3>Checklist de autoavaliação</h3>
        ${CHECKLIST.map((c, i) => `<label class="check"><input type="checkbox" id="sc${i}" ${(s.checks || {})[`c${i}`] ? "checked" : ""}> ${esc(c)}</label>`).join("")}
        <div class="actions"><button onclick="Study.saveExplanation()">Salvar explicação e avançar</button></div>`,
      () => `
        <p class="muted">Responda antes de abrir a conferência. A resposta mostrada é um trecho literal do material fornecido.</p>
        <div class="actions"><button class="secondary" onclick="Study.generateSessionQuestions()">Gerar perguntas do trecho</button></div>
        <div id="s_questions" class="study-questions">${ui.questions.length ? questionsHTML() : '<p class="small muted">Gere perguntas a partir do trecho lido.</p>'}</div>
        <div id="s_reveal"></div>
        <div class="actions"><button onclick="Study.sessionSave(3,'retrieve')">Salvar tentativa e avançar</button></div>`,
      () => `
        <p class="muted">Use exercícios reais da trilha. Resolva <b>antes</b> de consultar a resposta.</p>
        <ul class="study-list">${practiceLessonsHTML(s.track)}</ul>
        <label class="field" for="s_practice">Registro da prática sem consulta</label>
        <textarea class="field" id="s_practice" rows="4" placeholder="O que resolvi, onde travei e o que vou refazer.">${esc(s.practice || "")}</textarea>
        <div class="actions"><button onclick="Study.sessionSave(4,'practice')">Salvar e avançar</button></div>`,
      () => `
        <p class="muted">Resumo extrativo (frases do texto) + síntese própria. O resumo não substitui a sua explicação.</p>
        <div class="actions"><button class="secondary" onclick="Study.makeSummary()">Gerar resumo extrativo</button></div>
        <div id="s_summary" class="study-quote">${ui.summary ? `[trecho] ${esc(ui.summary)}` : "Nenhum resumo gerado ainda."}</div>
        <label class="field" for="s_synthesis" style="display:block;margin-top:10px">Minha síntese (uma ideia central + uma dúvida)</label>
        <textarea class="field" id="s_synthesis" rows="5">${esc(s.synthesis || "")}</textarea>
        <div class="actions"><button onclick="Study.saveSynthesis()">Salvar síntese e avançar</button></div>`,
      () => `
        <p class="muted">Agende uma revisão curta. Evidência de domínio exige reteste posterior, não apenas conclusão da sessão.</p>
        <label class="field" for="s_days">Intervalo</label>
        <select class="field" id="s_days"><option value="1">1 dia</option><option value="7" ${Number(s.reviewDays || 7) === 7 ? "selected" : ""}>7 dias</option><option value="30" ${Number(s.reviewDays) === 30 ? "selected" : ""}>30 dias</option></select>
        <div class="actions"><button onclick="Study.scheduleReview('session')">Agendar revisão</button></div>
        ${s.reviewDue ? `<p class="success small">Revisão agendada: ${esc(s.reviewDue)}</p>` : '<p class="small muted">Nenhuma revisão agendada nesta sessão.</p>'}
        <h3>Sessões com revisão agendada</h3>
        ${dueSessionsHTML()}`
    ];
    return `<section class="card study-card" aria-label="Sessão de estudo guiado">
      <div class="grid2">
        <div>
          <label class="field" for="s_book">Material principal</label>
          <select class="field" id="s_book" onchange="Study.chooseBook(this.value)">
            <option value="">— escolha —</option>
            ${books().map(b => `<option value="${esc(b.title)}" ${s.bookTitle === b.title ? "selected" : ""}>${esc(b.title)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="field" for="s_section">Seção / capítulo</label>
          <input class="field" id="s_section" value="${esc(s.section || "")}" placeholder="Ex.: cap. 3 — estruturas">
        </div>
      </div>
      <div class="row" style="margin-top:10px"><span class="pill info">${esc(s.bookTitle || "Sem material selecionado")}</span>
        <button class="linklike" onclick="Study.newSession()">Nova sessão (preserva as anteriores)</button></div>
      <div class="tabs study-steps-tabs" role="group" aria-label="Etapas da sessão">
        ${STEP_LABELS.map((label, i) => `
          <button type="button" class="${i === step ? "active" : ""}" aria-pressed="${i === step}"
            onclick="Study.sessionGo(${i})">${done[keyForStep(i)] ? "✓ " : ""}${esc(label)}</button>`).join("")}
      </div>
      <div class="study-step-body">${body[step]()}</div>
      <div class="actions" style="justify-content:space-between">
        <button class="secondary" onclick="Study.sessionGo(${Math.max(0, step - 1)})" ${step === 0 ? "disabled" : ""}>← Anterior</button>
        <button onclick="Study.sessionGo(${Math.min(6, step + 1)})" ${step === 6 ? "disabled" : ""}>Próxima →</button>
      </div>
    </section>`;
  }

  function keyForStep(i) {
    return ["prepare", "read", "explain", "retrieve", "practice", "synthesize", "review"][i];
  }

  function prerequisitesHTML(track) {
    const t = curriculum()[track];
    if (!t || !Array.isArray(t.modules) || !t.modules.length) return '<li class="muted">Pré-requisitos não mapeados; consulte o índice do livro.</li>';
    return t.modules.slice(0, 3).map((m, i) => `<li>${esc(m.name || `Módulo ${i + 1}`)} — ${(m.lessons || []).length} aulas</li>`).join("");
  }

  function practiceLessonsHTML(track) {
    const list = lessonsFor(track).filter(l => l.count > 0).slice(0, 8);
    if (!list.length) return '<li class="muted">Nenhum exercício mapeado para esta trilha. Use Me teste no tutor.</li>';
    return list.map(l => `<li><b>${esc(l.title)}</b> <span class="small muted">${esc(l.module)} · ${l.count} questões</span>
      <button class="linklike" onclick="openLesson('${esc(l.id)}')">Abrir aula →</button></li>`).join("");
  }

  function dueSessionsHTML() {
    const all = Storage.getStudyState().sessions || {};
    const rows = Object.entries(all).filter(([, v]) => v && v.reviewDue)
      .sort((a, b) => String(a[1].reviewDue).localeCompare(String(b[1].reviewDue))).slice(0, 12);
    if (!rows.length) return '<p class="small muted">Nenhuma revisão agendada.</p>';
    return `<ul class="study-list">${rows.map(([key, v]) => `
      <li><b>${esc(v.bookTitle || "Geral")}</b> · ${esc(v.section || "sem seção")} ·
        ${esc(v.reviewDue)} ${v.reviewDue <= new Date().toISOString().slice(0, 10) ? '<span class="pill warn">vencida</span>' : ""}
        <button class="linklike" onclick="Study.openSession('${esc(key)}')">Retomar →</button></li>`).join("")}</ul>`;
  }

  function sessionGo(step) {
    captureSession();
    ui.sessionStep = Math.max(0, Math.min(6, Number(step) || 0));
    ui.questions = ui.sessionStep === 3 ? makeQuestions(currentSession().text, 5) : [];
    paint();
  }

  function sessionSave(step, key) {
    captureSession();
    markStep(key, true);
    if (step < 6) ui.sessionStep = step + 1;
    paint();
    notify("Etapa salva.");
  }

  function saveExplanation() {
    captureSession();
    const s = currentSession();
    const text = String(s.explain || "").trim();
    if (text.length < 80) return notify("Escreva pelo menos 80 caracteres para salvar a explicação.");
    Storage.saveGeneralNote(`Livro · ${s.bookTitle || "Geral"} · ${s.section || "sessão"}`, text);
    markStep("explain", true);
    ui.sessionStep = 3;
    paint();
    notify("Explicação salva também na Técnica Feynman.");
  }

  function saveSynthesis() {
    captureSession();
    Storage.saveGeneralNote(`Síntese · ${currentSession().bookTitle || "Geral"} · ${currentSession().section || "sessão"}`, currentSession().synthesis || "");
    markStep("synthesize", true);
    ui.sessionStep = 6;
    paint();
    notify("Síntese salva no caderno.");
  }

  function loadSessionFile(input) {
    const file = input && input.files && input.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return notify("Arquivo muito grande (limite 2 MB).");
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "").slice(0, 120000);
      const area = document.getElementById("s_text");
      if (area) area.value = text;
      currentSession().text = text;
      ui.chunkIndex = 0;
      setHTML("s_chunk", chunkHTML());
      notify("Texto carregado localmente.");
    };
    reader.onerror = () => notify("Não foi possível ler o arquivo.");
    reader.readAsText(file);
  }

  function chunks(source) {
    const raw = source === undefined ? currentSession().text : source;
    const text = String(raw || "").replace(/\s+/g, " ").trim();
    const size = Math.max(200, Number(ui.chunkSize) || 800);
    if (!text) return [];
    const out = [];
    for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
    return out;
  }

  function chunkHTML() {
    const list = chunks();
    if (!list.length) return '<p class="small muted">Cole um trecho para usar a leitura em blocos.</p>';
    ui.chunkIndex = Math.max(0, Math.min(list.length - 1, ui.chunkIndex));
    return `<p class="small muted">Bloco ${ui.chunkIndex + 1} de ${list.length}</p>
      <p>${esc(list[ui.chunkIndex])}</p>`;
  }

  function chunk(delta) {
    const list = chunks();
    ui.chunkIndex = Math.max(0, Math.min(list.length - 1, ui.chunkIndex + Number(delta)));
    const target = document.getElementById(ui.tab === "tutor" ? "tutorChunk" : "s_chunk");
    if (target) target.innerHTML = ui.tab === "tutor" ? tutorChunkHTML() : chunkHTML();
  }

  function setChunkSize(value) {
    ui.chunkSize = Math.max(200, Number(value) || 800);
    ui.chunkIndex = 0;
    const target = document.getElementById(ui.tab === "tutor" ? "tutorChunk" : "s_chunk");
    if (target) target.innerHTML = ui.tab === "tutor" ? tutorChunkHTML() : chunkHTML();
  }

  function generateSessionQuestions() {
    ui.questions = makeQuestions(currentSession().text, 5);
    setHTML("s_questions", ui.questions.length ? questionsHTML() : '<p class="small muted">Cole um trecho na etapa de leitura.</p>');
    setHTML("s_reveal", '<div class="actions"><button class="secondary" onclick="Study.revealSessionAnswers()">Mostrar conferência</button></div>');
  }

  function revealSessionAnswers() {
    setHTML("s_reveal", ui.questions.length ? `<div class="study-questions">${questionsHTML(true)}</div>
      <p class="small muted">Se não lembrou, registre a lacuna na etapa do tutorial ou no painel Lacunas.</p>`
      : '<p class="small muted">Gere perguntas primeiro.</p>');
  }

  function makeSummary() {
    ui.summary = extractiveSummary(currentSession().text, 4);
    setHTML("s_summary", ui.summary ? `[trecho] ${esc(ui.summary)}` : "Sem texto suficiente para resumir.");
  }

  /* ---------------- 3. tutor local ---------------- */

  function tutorHTML() {
    const s = currentSession();
    const mode = ui.tutorMode;
    const history = Storage.getStudyState().tutor || {};
    const keys = Object.keys(history).slice(-5).reverse();
    return `<section class="card study-card" aria-label="Tutor local de documentos">
      <div class="row"><h2>Tutor de documentos</h2><span class="pill success">100% local</span></div>
      <p class="small muted">O tutor trabalha somente sobre o texto abaixo. Sem API, sem envio de documento, sem páginas inventadas.</p>
      <div class="actions">
        <button class="secondary" onclick="Study.useSessionText()">Usar texto da sessão</button>
        <input class="field" type="file" accept=".txt,.md,.html,text/plain,text/markdown,text/html"
          onchange="Study.loadTutorFile(this)" aria-label="Carregar texto local para o tutor">
      </div>
      <label class="field" for="tutorText" style="display:block;margin-top:10px">Texto de trabalho</label>
      <textarea class="field" id="tutorText" rows="6" placeholder="Cole aqui um trecho do livro, PDF, artigo ou documentação.">${esc(ui.tutorText)}</textarea>
      <div class="tabs study-steps-tabs" role="group" aria-label="Modos do tutor">
        ${TUTOR_MODES.map(([key, label]) => `<button type="button" class="${mode === key ? "active" : ""}"
          aria-pressed="${mode === key}" onclick="Study.setTutorMode('${key}')">${esc(label)}</button>`).join("")}
      </div>
      <div class="study-form">${tutorFormHTML(mode, s)}</div>
      <div class="actions"><button onclick="Study.runTutor()">Executar: ${esc(TUTOR_LABELS[mode] || mode)}</button></div>
      <div id="tutorOutput" class="study-output" aria-live="polite">${ui.output || '<p class="muted">Escolha um modo e execute para ver a resposta com origens explícitas.</p>'}</div>
      ${keys.length ? `<h3>Histórico recente</h3><ul class="study-list">${keys.map(k => `
        <li><span class="small">${esc(new Date(history[k].at || Date.now()).toLocaleString("pt-BR"))} · ${esc(TUTOR_LABELS[history[k].mode] || history[k].mode)}</span>
        <button class="linklike" onclick="Study.showHistory('${esc(k)}')">Ver resposta →</button></li>`).join("")}</ul>` : ""}
    </section>`;
  }

  function tutorFormHTML(mode, s) {
    if (mode === "explain") return `<label class="field" for="tutorTerm">Conceito ou termo</label>
      <input class="field" id="tutorTerm" placeholder="Ex.: ponteiro, derivada, cache">`;
    if (mode === "confused") return `<label class="field" for="tutorIssue">Onde você travou?</label>
      <select class="field" id="tutorIssue"><option value="termo">Vocabulário desconhecido</option>
        <option value="estrutura">Estrutura do argumento</option><option value="exemplo">Exemplo não claro</option>
        <option value="pre">Pré-requisito ausente</option></select>`;
    if (mode === "zero") return `<label class="field" for="tutorTrack">Trilha</label>
      <select class="field" id="tutorTrack">${Object.entries(curriculum()).map(([k, t]) =>
        `<option value="${esc(k)}" ${s.track === k ? "selected" : ""}>${esc(t.name || k)}</option>`).join("")}</select>`;
    if (mode === "reasoning") return `<label class="field" for="tutorReasoning">Sua solução ou raciocínio</label>
      <textarea class="field" id="tutorReasoning" rows="5" placeholder="Escreva como você resolveu e por quê."></textarea>`;
    if (mode === "feynman") return `<label class="field" for="tutorTerm">Conceito</label>
      <input class="field" id="tutorTerm" placeholder="Ex.: porque o cache HTTP reduz latência">
      <label class="field" for="tutorFeynman" style="display:block;margin-top:8px">Sua explicação (mín. 80 caracteres)</label>
      <textarea class="field" id="tutorFeynman" rows="5"></textarea>`;
    if (mode === "compare") return `<div class="grid2">
      <label class="field" for="tutorA">Conceito A</label><input class="field" id="tutorA" placeholder="Ex.: TCP">
      <label class="field" for="tutorB">Conceito B</label><input class="field" id="tutorB" placeholder="Ex.: UDP"></div>`;
    if (mode === "exercises" || mode === "application") return `<label class="field" for="tutorTrack">Trilha</label>
      <select class="field" id="tutorTrack">${Object.entries(curriculum()).map(([k, t]) =>
        `<option value="${esc(k)}" ${s.track === k ? "selected" : ""}>${esc(t.name || k)}</option>`).join("")}</select>`;
    if (mode === "read") return `<label class="field" for="tutorChunkSize">Tamanho do bloco</label>
      <select class="field" id="tutorChunkSize" onchange="Study.setChunkSize(this.value)">
        ${[400, 800, 1200].map(n => `<option value="${n}" ${ui.chunkSize === n ? "selected" : ""}>${n} caracteres</option>`).join("")}
      </select>`;
    return '<p class="small muted">Este modo usa apenas o texto de trabalho; não precisa de outro campo.</p>';
  }

  function captureTutorText() {
    const el = document.getElementById("tutorText");
    if (el) ui.tutorText = el.value;
  }

  function captureTutorForm() {
    ["tutorTerm", "tutorIssue", "tutorTrack", "tutorReasoning", "tutorFeynman", "tutorA", "tutorB"].forEach(id => {
      const el = document.getElementById(id);
      if (el) ui.tutorForm[id] = el.value;
    });
  }

  function setTutorMode(mode) {
    captureTutorText();
    captureTutorForm();
    ui.tutorMode = String(mode || "explain");
    paint();
  }

  function useSessionText() {
    const text = currentSession().text || "";
    ui.tutorText = text;
    const area = document.getElementById("tutorText");
    if (area) area.value = text;
    notify(text ? "Texto da sessão copiado para o tutor." : "A sessão ainda não tem texto.");
  }

  function loadTutorFile(input) {
    const file = input && input.files && input.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return notify("Arquivo muito grande (limite 2 MB).");
    const reader = new FileReader();
    reader.onload = () => {
      ui.tutorText = String(reader.result || "").slice(0, 120000);
      const area = document.getElementById("tutorText");
      if (area) area.value = ui.tutorText;
      notify("Texto carregado localmente.");
    };
    reader.onerror = () => notify("Não foi possível ler o arquivo.");
    reader.readAsText(file);
  }

  function runTutor() {
    captureTutorText();
    captureTutorForm();
    const mode = ui.tutorMode;
    ui.output = tutorOutputHTML(mode);
    setHTML("tutorOutput", ui.output);
    const history = Storage.getStudyState().tutor;
    const key = `${mode}-${Date.now()}`;
    history[key] = { mode, at: new Date().toISOString(), text: ui.output, sourceLength: ui.tutorText.length };
    const all = Object.keys(history);
    if (all.length > 40) all.slice(0, all.length - 40).forEach(k => { delete history[k]; });
    Storage.save();
    notify("Resposta gerada localmente.");
  }

  function showHistory(key) {
    const entry = Storage.getStudyState().tutor[key];
    if (!entry) return;
    const out = document.getElementById("tutorOutput");
    if (out) out.textContent = String(entry.text || "");
    out?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function tutorOutputHTML(mode) {
    const text = ui.tutorText || "";
    const sentences = sourceSentences(text);
    const terms = topTerms(text, 8);
    const head = `${provenance()}<p class="small muted">${sentences.length} frase(s) e ${text.trim().split(/\s+/).filter(Boolean).length} palavra(s) no material fornecido.</p>`;
    if (text.trim().length < 40) {
      return `${head}<div class="callout">[não encontrado] Texto insuficiente. Cole um trecho de pelo menos 40 caracteres para que o tutor possa citar a fonte.</div>`;
    }
    let body = "";
    if (mode === "explain") {
      const term = val("tutorTerm").trim();
      if (!term) return `${head}<div class="callout">[sugestão] Informe o termo que você quer entender.</div>`;
      const found = bestSentence(sentences, term);
      body = found
        ? `<h3>“${esc(term)}” no material</h3>${quoteBlock(found)}
           <p>[inferência] As palavras ao redor indicam o uso do termo neste trecho. Reformule com suas palavras e verifique em outra fonte antes de generalizar.</p>
           <p>[sugestão] Agora feche o texto e responda: em que situação esse conceito é necessário? Qual exemplo do trecho o ilustra?</p>`
        : `<div class="callout">[não encontrado] “${esc(term)}” não aparece no texto fornecido. O tutor não vai inventar uma definição. Verifique a grafia ou cole o trecho onde o termo aparece.</div>`;
    } else if (mode === "confused") {
      const issue = val("tutorIssue");
      const strategy = {
        termo: "Monte um mini-glossário: termo, frase onde aparece, sinônimo em linguagem simples e um exemplo seu.",
        estrutura: "Numere as afirmações do trecho e marque qual frase introduz a ideia, qual explica e qual conclui.",
        exemplo: "Copie a frase do exemplo, sublinhe cada passo e refaça o exemplo com outros valores.",
        pre: "Volte uma aula ou um capítulo anterior do índice; identifique o pré-requisito e teste-o antes de continuar."
      }[issue] || strategyDefault();
      const anchor = terms.length ? quoteBlock(bestSentence(sentences, terms[0])) : "";
      body = `<h3>Diagnóstico da dificuldade</h3><p>[sugestão] ${esc(strategy)}</p>${anchor}
        <p>[inferência] A frase acima é apenas uma âncora do seu texto; ela não prova que esse é o ponto da dúvida.</p>`;
    } else if (mode === "zero") {
      const track = val("tutorTrack");
      body = `<h3>Pré-requisitos em ${esc(trackName(track))}</h3>
        <ol class="study-list">${prerequisitesHTML(track).replace(/^<li|<\/li>$/g, m => m)}</ol>
        <p>[sugestão] Confira no índice do livro quais destes tópicos aparecem antes do seu capítulo. Estude o menor pré-requisito que destrava a leitura.</p>
        ${terms.length ? quoteBlock(bestSentence(sentences, terms[0])) : ""}`;
    } else if (mode === "example") {
      const examples = exampleSentences(text);
      body = examples.length
        ? `<h3>Exemplos presentes no material</h3>${examples.map(quoteBlock).join("")}
           <p>[sugestão] Refaça cada exemplo com valores diferentes e explique por que a mudança não quebra a ideia.</p>`
        : `<div class="callout">[não encontrado] Nenhuma frase de exemplo foi localizada (“exemplo”, “por exemplo”, “e.g.”, “suponha”). Peça um exemplo ao professor ou traga um caso da sua área.</div>`;
    } else if (mode === "test") {
      const qs = makeQuestions(text, 5);
      body = `<h3>Perguntas de recuperação</h3><p class="small muted">Responda em voz alta ou por escrito antes de abrir cada resposta.</p>
        ${qs.map((q, i) => `<div class="study-question"><p><b>${i + 1}.</b> ${esc(q.question)}</p>
          <details><summary>Mostrar trecho de conferência</summary><p class="study-answer">${esc(q.answer)}</p></details></div>`).join("")}`;
    } else if (mode === "exercises") {
      const track = val("tutorTrack");
      body = `<h3>Exercícios reais da trilha ${esc(trackName(track))}</h3>
        <ul class="study-list">${practiceLessonsHTML(track)}</ul>
        <p>[sugestão] Escolha um exercício parecido, mas não idêntico ao exemplo resolvido. Resolva sem consultar e só depois confira.</p>`;
    } else if (mode === "reasoning") {
      const answer = val("tutorReasoning").trim();
      if (answer.length < 20) return `${head}<div class="callout">[sugestão] Escreva sua solução antes de pedir análise.</div>`;
      const lower = norm(answer);
      const checks = [
        ["Afirmação central", /\bporque\b|\bpois\b|\bjá que\b|\bportanto\b|\blogo\b/.test(lower)],
        ["Apelo ao material", /segundo|trecho|conforme|página|seção|\bexemplo\b/.test(lower)],
        ["Encadeamento de etapas", /primeiro|depois|então|finalmente|\b1[.)]\b/.test(lower)],
        ["Explicação própria", answer.length >= 80 && !sentences.some(s => answer.includes(s))],
        ["Limite ou contraexemplo", /exceção|contraexemplo|limitação|porém|mas não|depende/.test(lower)],
        ["Termos do material", terms.some(t => lower.includes(t))]
      ];
      body = `<h3>Análise heurística local do raciocínio</h3><p class="small muted">Isto <b>não</b> é correção automática nem prova de domínio: é um checklist para você revisar.</p>
        <ul class="study-list">${checks.map(([label, ok]) => `<li><span class="pill ${ok ? "success" : "warn"}">${ok ? "presente" : "ausente"}</span> ${esc(label)}</li>`).join("")}</ul>
        <p>[sugestão] ${checks.every(c => c[1]) ? "Peça agora um contraexemplo a si mesmo e refaça sem consulta." : "Escolha um item ausente e reescreva apenas aquela parte."}</p>
        <div class="actions"><button class="secondary" onclick="Study.registerReasoningGap()">Registrar lacuna no caderno</button></div>`;
    } else if (mode === "feynman") {
      const term = val("tutorTerm").trim();
      const answer = val("tutorFeynman").trim();
      if (answer.length < 80) return `${head}<div class="callout">[sugestão] A explicação precisa de pelo menos 80 caracteres para ser salva como evidência de explicação própria.</div>`;
      Storage.saveGeneralNote(`Feynman · ${term || "conceito"} · tutor`, answer);
      body = `<p class="success">Explicação salva no caderno Feynman. [sugestão] Verifique se ela aparece em <b>Técnica Feynman</b> e refaça amanhã sem consultar.</p>
        ${terms.length ? quoteBlock(bestSentence(sentences, terms[0])) : ""}`;
    } else if (mode === "summary") {
      const summary = extractiveSummary(text, 4);
      body = `<h3>Resumo extrativo</h3><p class="small muted">Frases selecionadas do seu texto por frequência de termos; não é uma síntese semântica nem substitui a leitura.</p>
        ${quoteBlock(summary)}<p>[sugestão] Escreva agora uma frase própria com a ideia central e uma dúvida.</p>`;
    } else if (mode === "compare") {
      const a = val("tutorA").trim(), b = val("tutorB").trim();
      if (!a || !b) return `${head}<div class="callout">[sugestão] Informe os dois conceitos para comparar.</div>`;
      const sa = bestSentence(sentences, a), sb = bestSentence(sentences, b);
      body = `<h3>Comparação: ${esc(a)} × ${esc(b)}</h3>
        <table class="study-table"><thead><tr><th>Critério</th><th>${esc(a)}</th><th>${esc(b)}</th></tr></thead><tbody>
        <tr><td>O que o texto diz</td><td>${sa ? esc(sa) : "[não encontrado]"}</td><td>${sb ? esc(sb) : "[não encontrado]"}</td></tr>
        <tr><td>Semelhança (minha hipótese)</td><td colspan="2">[inferência] escreva e confirme nas duas seções.</td></tr>
        <tr><td>Quando usar cada um</td><td>[sugestão] preencha</td><td>[sugestão] preencha</td></tr>
        </tbody></table>
        <p class="small muted">Se um conceito não aparece no trecho, o tutor não força uma resposta: o campo fica “[não encontrado]”.</p>`;
    } else if (mode === "application") {
      const track = val("tutorTrack");
      body = `<h3>Aplicação em laboratórios e projetos</h3>${applicationHTML(track)}
        <p>[sugestão] Escolha uma aplicação, faça o laboratório e volte ao trecho para explicar o que a prática confirmou ou contradisse.</p>`;
    } else if (mode === "read") {
      body = tutorChunkHTML();
    } else {
      body = '<div class="callout">[sugestão] Modo não reconhecido.</div>';
    }
    return `${head}${body}`;
  }

  function strategyDefault() {
    return "Leia o trecho em voz alta e marque cada frase que você não consegue parafrasear.";
  }

  function tutorChunkHTML() {
    const list = chunks(ui.tutorText || "");
    if (!list.length) return '<div class="callout">[não encontrado] Cole um texto antes de usar Leia comigo.</div>';
    ui.chunkIndex = Math.max(0, Math.min(list.length - 1, ui.chunkIndex));
    return `<div class="study-reader"><p class="small muted">Bloco ${ui.chunkIndex + 1} de ${list.length} · ${ui.chunkSize} caracteres</p>
      <p>${esc(list[ui.chunkIndex])}</p><div class="actions">
      <button class="secondary" onclick="Study.chunk(-1)">← Anterior</button>
      <button class="secondary" onclick="Study.chunk(1)">Próximo →</button></div>
      <p class="small muted">[sugestão] A cada bloco, feche o texto e diga em uma frase o que ficou.</p></div>`;
  }

  function registerReasoningGap() {
    const text = val("tutorReasoning").trim();
    if (!text) return;
    Storage.addStudyGap({ kind: "raciocinio", source: ui.tutorText.slice(0, 120), text: text.slice(0, 300), category: "" });
    notify("Lacuna de raciocínio registrada no painel Lacunas.");
  }

  function applicationHTML(track) {
    const label = norm(trackName(track));
    const labs = catalog().filter(l => {
      const hay = norm(`${l.area || ""} ${l.track || ""} ${l.name || l.title || l[0] || ""}`);
      return hay.includes(label) || hay.includes(norm(track));
    }).slice(0, 6);
    const projectList = projects()
      .map((p, i) => ({ p, i }))
      .filter(x => norm(`${x.p[0]} ${x.p[1]}`).includes(label))
      .slice(0, 3);
    if (!labs.length && !projectList.length) {
      return '<p class="small muted">Nenhuma aplicação com correspondência direta foi encontrada no catálogo atual. Escolha um laboratório da trilha em <b>Laboratórios</b>.</p>';
    }
    return `<ul class="study-list">
      ${labs.map((l, i) => `<li><b>${esc(l.name || l.title || l[0] || `Laboratório ${i + 1}`)}</b>
        <button class="linklike" onclick="goToPage('catalog')">Ver catálogo →</button></li>`).join("")}
      ${projectList.map(x => `<li><b>${esc(x.p[0])}</b> <button class="linklike" onclick="goToPage('projects')">Ver projeto →</button></li>`).join("")}
    </ul>`;
  }

  /* ---------------- 4. ficha de artigo ---------------- */

  function captureArticle() {
    ARTICLE_FIELDS.forEach(([key]) => {
      const el = document.getElementById(`art_${key}`);
      if (el) ui.articleDraft[key] = el.value;
    });
    ui.articleDraft.critical = {};
    CRITICAL.forEach((_, i) => { ui.articleDraft.critical[`k${i}`] = checked(`art_c${i}`); });
  }

  function articleHTML() {
    const d = ui.articleDraft;
    const saved = Storage.getStudyState().articles || {};
    const keys = Object.keys(saved).slice(-6).reverse();
    return `<section class="card study-card" aria-label="Ficha de leitura de artigo">
      <div class="row"><h2>Ficha de estudo de artigo</h2><span class="pill info">OBJETIVO → MÉTODO → EVIDÊNCIA → LIMITES</span></div>
      <p class="small muted">Preencha primeiro com suas palavras. As dicas não preenchem o artigo por você e não presumem que ele segue IMRaD.</p>
      <div class="actions">
        <button class="secondary" onclick="Study.articleHints()">Pedir dicas para campos vazios</button>
        <button onclick="Study.saveArticle()">Salvar ficha</button>
      </div>
      <div id="articleHints" aria-live="polite"></div>
      <div class="study-form">${ARTICLE_FIELDS.map(([key, label]) => `
        <label class="field" for="art_${key}">${esc(label)}</label>
        <textarea class="field" id="art_${key}" rows="${key === "myExplanation" ? 4 : 2}"
          placeholder="Escreva antes de pedir ajuda.">${esc(d[key] || "")}</textarea>`).join("")}</div>
      <h3>Alfabetização científica — marque após conferir no artigo</h3>
      ${CRITICAL.map((c, i) => `<label class="check"><input type="checkbox" id="art_c${i}" ${(d.critical || {})[`k${i}`] ? "checked" : ""}> ${esc(c)}</label>`).join("")}
      <p class="small muted">Preprint não é o mesmo que publicação revisada por pares. Significância estatística não é tamanho de efeito nem importância prática.</p>
      ${keys.length ? `<h3>Fichas salvas</h3><ul class="study-list">${keys.map(k => `
        <li><b>${esc(saved[k].title || k)}</b> <span class="small muted">${esc(saved[k].savedAt || "")}</span>
        <button class="linklike" onclick="Study.loadArticle('${esc(k)}')">Carregar →</button></li>`).join("")}</ul>` : ""}
    </section>`;
  }

  function saveArticle() {
    captureArticle();
    const key = slug(ui.articleDraft.title || ui.articleDraft.doi || "sem-titulo");
    Storage.saveStudyArticle(key, ui.articleDraft);
    ui.articleKey = key;
    paint();
    notify("Ficha salva localmente.");
  }

  function loadArticle(key) {
    captureArticle();
    const found = Storage.getStudyState().articles[String(key)];
    if (!found) return;
    ui.articleDraft = { ...found };
    ui.articleKey = String(key);
    paint();
  }

  function articleHints() {
    captureArticle();
    const prompts = {
      doi: "O DOI/URL foi copiado da publicação oficial?",
      problem: "Qual pergunta o artigo tenta responder? Escreva em uma frase.",
      objective: "Objetivo geral e específicos aparecem na introdução?",
      method: "Quem foi estudado, com que dados e com qual procedimento?",
      evidence: "Qual figura/tabela sustenta cada afirmação principal?",
      inference: "O que você concluiu que o texto não diz literalmente?",
      results: "Quais resultados são descritos, sem interpretá-los ainda?",
      conclusion: "O que os autores concluem — e o que você conclui?",
      limitations: "Limitações estão na discussão ou você as inferiu?",
      biases: "Quem financiou? Há conflito de interesse declarado?",
      application: "Onde esse resultado poderia ser aplicado na sua trilha?",
      refs: "Quais referências você abriu efetivamente?"
    };
    const empty = ARTICLE_FIELDS.filter(([key]) => !String(ui.articleDraft[key] || "").trim());
    setHTML("articleHints", empty.length
      ? `<div class="callout"><b>Perguntas para os campos vazios:</b><ul>${empty.map(([key, label]) =>
          `<li>${esc(label)}: ${esc(prompts[key] || "Complete com suas palavras.")}</li>`).join("")}</ul></div>`
      : '<div class="callout">Todos os campos foram preenchidos. Revise as distinções entre evidência, inferência e conclusão.</div>');
  }

  /* ---------------- 5. diagnóstico de lacunas ---------------- */

  function gapsHTML() {
    const s = Storage.get();
    const open = (s.mistakes || []).filter(m => !m.corrected);
    const byTrack = {};
    open.forEach(m => { byTrack[m.track || "geral"] = (byTrack[m.track || "geral"] || 0) + 1; });
    const ranked = Object.entries(byTrack).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const gaps = (Storage.getStudyState().gaps || []).slice(-8).reverse();
    return `<section class="card study-card" aria-label="Diagnóstico de lacunas">
      <div class="row"><h2>Diagnóstico de lacunas e pré-requisitos</h2><span class="pill warn">heurístico</span></div>
      <p class="small muted">Sugestões a partir de erros reais registrados, explicações próprias e revisão espaçada. <b>Uma questão isolada não prova domínio nem lacuna</b>: use várias evidências e confirme com reteste.</p>
      ${ranked.length ? `<h3>Conceitos com mais erros abertos</h3><ul class="study-list">${ranked.map(([track, count]) => `
        <li><b>${esc(trackName(track))}</b> · ${count} erro(s) aberto(s)
          <button class="linklike" onclick="Study.showTrackRecovery('${esc(track)}')">Ver recuperação →</button></li>`).join("")}</ul>` : '<p class="muted">Ainda não há erros abertos. Faça exercícios nas aulas para gerar evidências.</p>'}
      <div id="recoveryBox"></div>
      <h3>Lacunas registradas na leitura</h3>
      ${gaps.length ? `<ul class="study-list">${gaps.map(g => `<li><span class="pill ${["E1", "E2", "E3", "E4"].includes(g.category) ? g.category : ""}">${esc(g.category || "—")}</span>
        ${esc(g.text)} <span class="small muted">${esc(g.source || "")}</span></li>`).join("")}</ul>`
        : '<p class="small muted">Nenhuma lacuna registrada ainda.</p>'}
      <h3>Registrar uma lacuna manualmente</h3>
      <div class="grid2">
        <label class="field" for="gapTrack">Trilha</label>
        <select class="field" id="gapTrack">${Object.entries(curriculum()).map(([k, t]) => `<option value="${esc(k)}">${esc(t.name || k)}</option>`).join("")}</select>
        <label class="field" for="gapText">Conceito frágil</label><input class="field" id="gapText" placeholder="Ex.: diferença entre valor e endereço">
        <label class="field" for="gapCategory">Categoria</label>
        <select class="field" id="gapCategory"><option value="">Sem classificar</option><option value="E1">E1 — Base</option><option value="E2">E2 — Conceito</option><option value="E3">E3 — Execução</option><option value="E4">E4 — Atenção/TDAH</option></select>
      </div>
      <div class="actions"><button onclick="Study.addManualGap()">Registrar e sugerir recuperação</button></div>
      <h3>Próximas revisões espaçadas</h3>
      <p class="small muted">${typeof global.Exercises !== "undefined"
        ? `${global.Exercises.getSpacedCards().length} flashcard(s) pendente(s) no momento.`
        : "Módulo de revisão indisponível."}
        <button class="linklike" onclick="goToPage('review')">Abrir revisão →</button></p>
    </section>`;
  }

  function showTrackRecovery(track) {
    const open = (Storage.get().mistakes || []).filter(m => !m.corrected && (m.track || "geral") === track);
    const terms = topTerms(open.map(m => m.question || "").join(" "), 6);
    const candidates = lessonsFor(track).filter(l => terms.some(t => norm(l.title).includes(t))).slice(0, 4);
    const fallback = lessonsFor(track).slice(0, 3);
    const list = candidates.length ? candidates : fallback;
    setHTML("recoveryBox", `<div class="callout"><b>Recuperação sugerida para ${esc(trackName(track))}:</b>
      <ul>${list.map(l => `<li>${esc(l.title)} <button class="linklike" onclick="openLesson('${esc(l.id)}')">Abrir →</button></li>`).join("")}</ul>
      <p class="small">Motivo: ${candidates.length ? "títulos com termos presentes nos erros registrados" : "primeiras aulas da trilha, sem correspondência forte — confirme manualmente"}.</p></div>`);
  }

  function addManualGap() {
    const text = val("gapText").trim();
    const track = val("gapTrack");
    const category = val("gapCategory");
    if (!text) return notify("Descreva o conceito frágil.");
    Storage.addStudyGap({ kind: "manual", source: trackName(track), text, category });
    Storage.addMistake("estudo-guiado", track, text, "Lacuna registrada manualmente", category);
    paint();
    showTrackRecovery(track);
    notify("Lacuna registrada; recuperação sugerida abaixo.");
  }

  /* ---------------- API pública ---------------- */

  global.Study = Object.freeze({
    render: () => { if (root) paint(); },
    setTab, setTutorMode, setChunkSize,
    startFromBook, newSession, openSession, chooseBook, sessionGo, sessionSave,
    saveExplanation, saveSynthesis, scheduleReview,
    loadSessionFile, generateSessionQuestions, revealSessionAnswers, makeSummary,
    tutorialGo, tutorialSave, tutorialBook, loadTutorialFile,
    generateTutorialQuestions, revealAnswers, registerGap,
    useSessionText, loadTutorFile, runTutor, showHistory,
    registerReasoningGap, chunk,
    saveArticle, loadArticle, articleHints,
    showTrackRecovery, addManualGap
  });

  global.StudyPage = Object.freeze({ renderPage });
})(window);

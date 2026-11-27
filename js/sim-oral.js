/* ============================================================
   FORGE 4.0 — sim-oral.js
   Prova oral local: 3–5 tópicos, cronômetro de 3–5 minutos e
   rubrica em três painéis. Sem áudio, rede ou serviços externos.
   Expõe window.OralSim.
   ============================================================ */

(function () {
  "use strict";

  const RUBRIC = [
    {
      key: "exposicao",
      title: "1. Exposição",
      items: [
        "Define o conceito central com precisão",
        "Apresenta um exemplo concreto e verificável",
        "Relaciona o tema a um pré-requisito"
      ]
    },
    {
      key: "raciocinio",
      title: "2. Raciocínio",
      items: [
        "Justifica cada passo da derivação",
        "Trata um limite ou contraexemplo",
        "Identifica e corrige um erro comum"
      ]
    },
    {
      key: "comunicacao",
      title: "3. Comunicação",
      items: [
        "Usa linguagem acessível sem perder rigor",
        "Mantém notação consistente",
        "Conclui com uma síntese em uma frase"
      ]
    }
  ];

  const FALLBACK_TOPICS = [
    { id: "t1", title: "Complexidade assintótica" },
    { id: "t2", title: "Cache e localidade" },
    { id: "t3", title: "Revisão espaçada" },
    { id: "t4", title: "Integridade referencial" },
    { id: "t5", title: "Protocolo de rede" },
    { id: "t6", title: "Segurança de memória" }
  ];

  const state = {
    stage: "setup",
    topics: [],
    selected: [],
    minutes: 5,
    secondsLeft: 300,
    running: false,
    intervalId: null,
    answer: "",
    checks: {},
    startedAt: null,
    lastResult: null
  };

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function num(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function hash(value) {
    if (typeof window !== "undefined" && window.ForgeMathUtils?.fnv1a32) {
      return window.ForgeMathUtils.fnv1a32(value) >>> 0;
    }
    let h = 2166136261 >>> 0;
    for (const ch of String(value || "")) {
      h ^= ch.charCodeAt(0);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function next(seed) {
    return (Math.imul(seed >>> 0, 1664525) + 1013904223) >>> 0;
  }

  function getState() {
    return (typeof Storage !== "undefined" && typeof Storage.get === "function") ? Storage.get() : {};
  }

  function topicPool() {
    const s = getState();
    const seed = num(s.forge4?.userSeed, hash(`forge-v5|${s.userId || "local"}`));
    let pool = [];
    try {
      if (typeof CURRICULUM !== "undefined" && CURRICULUM && typeof CURRICULUM === "object") {
        pool = Object.values(CURRICULUM).flatMap(t =>
          (t.modules || []).slice(0, 2).map((m, i) => ({
            id: `${Object.keys(CURRICULUM).find(k => CURRICULUM[k] === t) || "trk"}-${i}`,
            title: m.name || "Módulo"
          }))
        );
      }
    } catch (e) { pool = []; }
    if (!pool.length) pool = FALLBACK_TOPICS.slice();
    /* Amostra determinística por usuário: a prova de hoje é reproduzível. */
    const indexed = pool.map((t, i) => ({ ...t, sort: next(seed + i * 7919) }));
    return indexed.sort((a, b) => a.sort - b.sort).slice(0, 5);
  }

  function mmss(seconds) {
    const n = Math.max(0, Math.ceil(num(seconds, 0)));
    return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
  }

  function root() {
    return (typeof document !== "undefined") ? document.getElementById("oralRoot") : null;
  }

  function setupHTML() {
    state.topics = topicPool();
    state.selected = state.topics.slice(0, 3).map(t => t.id);
    const boxes = state.topics.map(t => `
      <label class="check oral-topic"><input type="checkbox" value="${esc(t.id)}" checked onchange="OralSim.toggleTopic('${esc(t.id)}',this.checked)">
      <span>${esc(t.title)}</span></label>`).join("");
    return `
<section class="card forge4-panel" aria-labelledby="oralSetupTitle">
  <p class="forge4-kicker">Recuperação ativa · 7 degraus</p>
  <h2 id="oralSetupTitle" style="margin-top:0">Prova oral em 5 minutes</h2>
  <p class="muted">Escolha de 3 a 5 tópicos. Explique em voz alta sem consultar o texto; a rubrica abaixo guia a autoavaliação.</p>
  <fieldset style="border:0;padding:0;margin:12px 0">
    <legend class="small muted">Tópicos da sessão</legend>
    <div class="grid2">${boxes}</div>
  </fieldset>
  <label for="oralMinutes">Duração</label>
  <select id="oralMinutes" onchange="OralSim.setMinutes(Number(this.value))">
    <option value="3">3 minutos</option>
    <option value="4">4 minutos</option>
    <option value="5" selected>5 minutos</option>
  </select>
  <div class="actions" style="margin-top:14px">
    <button type="button" onclick="OralSim.start()">▶ Iniciar prova</button>
  </div>
  <p class="small muted">Nada é enviado: o cronômetro e a rubrica rodam neste navegador.</p>
</section>`;
  }

  function examHTML() {
    const panels = RUBRIC.map(group => `
      <section class="oral-panel" aria-labelledby="oralPanel-${group.key}">
        <h3 id="oralPanel-${group.key}">${esc(group.title)}</h3>
        <div class="oral-rubric">
          ${group.items.map((item, i) => `
            <label><input type="checkbox" id="oral-${group.key}-${i}" onchange="OralSim.setCheck('${group.key}',${i},this.checked)">
            <span>${esc(item)}</span></label>`).join("")}
        </div>
      </section>`).join("");
    const topics = state.topics.filter(t => state.selected.includes(t.id)).map(t => `<li>${esc(t.title)}</li>`).join("");
    return `
<section class="card forge4-panel oral-shell" aria-labelledby="oralExamTitle">
  <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:12px">
    <div>
      <p class="forge4-kicker">Sessão em andamento</p>
      <h2 id="oralExamTitle" style="margin:0">Explique, justifique, sintetize</h2>
    </div>
    <div>
      <time class="oral-timer" id="oralTimer" datetime="PT${state.minutes}M" aria-label="Tempo restante">${mmss(state.secondsLeft)}</time>
      <p class="small muted" id="oralStatus" role="status">Ao zerar, a prova é finalizada automaticamente.</p>
    </div>
  </div>
  <ul class="small muted">${topics}</ul>
  <label for="oralAnswer">Sua explicação (a rubrica usa este texto como evidência)</label>
  <textarea id="oralAnswer" class="oral-answer" oninput="OralSim.setAnswer(this.value)" placeholder="Comece definindo o conceito, depois dê um exemplo e justifique cada passo…"></textarea>
  <div class="oral-panels">${panels}</div>
  <div class="actions">
    <button type="button" onclick="OralSim.finish(false)">✓ Finalizar e avaliar</button>
    <button type="button" class="secondary" onclick="OralSim.stop()">Abortar</button>
  </div>
</section>`;
  }

  function resultHTML() {
    const r = state.lastResult || {};
    const topics = (r.topics || []).map(t => `<li>${esc(t)}</li>`).join("");
    const checks = RUBRIC.map(g => {
      const done = (r.checks && r.checks[g.key]) || [];
      return `<li><b>${esc(g.title)}</b>: ${done.length}/3 critérios</li>`;
    }).join("");
    return `
<section class="card forge4-panel" aria-labelledby="oralResultTitle">
  <p class="forge4-kicker">Resultado registrado</p>
  <h2 id="oralResultTitle" style="margin-top:0">${r.passed ? "Aprovado na autoavaliação" : "Continue praticando"}</h2>
  <p class="forge4-metric">${esc(r.score)} / 10</p>
  <p class="muted">${r.passed
    ? "Rubrica completa e explicação com evidência textual: o selo de domínio permanece sujeito às demais etapas."
    : "Critério: nota ≥ 8 e explicação com pelo menos 30 caracteres. Revise os painéis e repita."}</p>
  <ul class="small muted">${topics}${checks}</ul>
  <p class="small">Duração: ${esc(r.elapsed)} · Evidência: ${esc(r.answerChars)} caracteres</p>
  <div class="actions">
    <button type="button" onclick="OralSim.restart()">↺ Nova prova</button>
    <button type="button" class="secondary" onclick="goToPage('dashboard')">Voltar ao painel</button>
  </div>
</section>`;
  }

  function refresh() {
    const el = root();
    if (!el) return;
    if (state.stage === "setup") el.innerHTML = setupHTML();
    else if (state.stage === "exam") el.innerHTML = examHTML();
    else el.innerHTML = resultHTML();
  }

  function renderPage(v) {
    if (!v || typeof v.innerHTML === "undefined") return;
    stop();
    state.lastResult = null;
    state.stage = "setup";
    v.innerHTML = `<div class="eyebrow">Avaliação por evidência</div>
      <h1 class="h1">Prova oral</h1>
      <p class="sub">Recupere sem consulta, meça o tempo e avalie com critério explícito.</p>
      <div id="oralRoot" class="oral-shell"></div>`;
    refresh();
  }

  function toggleTopic(id, checked) {
    const set = new Set(state.selected);
    if (checked) {
      if (set.size >= 5) {
        if (typeof toast === "function") toast("Selecione no máximo 5 tópicos.");
        refresh();
        return;
      }
      set.add(id);
    } else set.delete(id);
    if (set.size < 3) {
      if (typeof toast === "function") toast("Selecione pelo menos 3 tópicos.");
      refresh();
      return;
    }
    state.selected = [...set];
  }

  function setMinutes(value) {
    const m = Math.min(5, Math.max(3, Math.round(num(value, 5))));
    state.minutes = m;
    state.secondsLeft = m * 60;
  }

  function setAnswer(value) {
    state.answer = String(value || "").slice(0, 8000);
  }

  function setCheck(key, index, checked) {
    const group = RUBRIC.find(g => g.key === key);
    if (!group || !group.items[index]) return;
    const set = new Set(state.checks[key] || []);
    if (checked) set.add(index); else set.delete(index);
    state.checks[key] = [...set];
  }

  function start() {
    if (state.selected.length < 3) {
      if (typeof toast === "function") toast("Escolha de 3 a 5 tópicos.");
      return false;
    }
    state.stage = "exam";
    state.secondsLeft = state.minutes * 60;
    state.answer = "";
    state.checks = {};
    state.startedAt = Date.now();
    refresh();
    stop();
    state.running = true;
    state.intervalId = setInterval(() => {
      state.secondsLeft = Math.max(0, state.secondsLeft - 1);
      const timer = (typeof document !== "undefined") ? document.getElementById("oralTimer") : null;
      if (timer) {
        timer.textContent = mmss(state.secondsLeft);
        timer.setAttribute("datetime", `PT${state.minutes}M`);
      }
      if (state.secondsLeft === 0) finish(true);
    }, 1000);
    return true;
  }

  function stop() {
    if (state.intervalId !== null && typeof clearInterval === "function") clearInterval(state.intervalId);
    state.intervalId = null;
    state.running = false;
  }

  function finish(auto) {
    if (state.stage !== "exam") return null;
    stop();
    const checked = RUBRIC.reduce((sum, g) => sum + (state.checks[g.key] || []).length, 0);
    const chars = state.answer.trim().length;
    const evidence = chars >= 220 ? 1 : chars >= 120 ? 0.5 : 0;
    const score = Math.round((checked + evidence) * 10) / 10;
    const passed = score >= 8 && chars >= 30;
    const topics = state.topics.filter(t => state.selected.includes(t.id)).map(t => t.title);
    const elapsed = Math.max(1, state.minutes * 60 - state.secondsLeft);
    state.lastResult = {
      score, passed, topics, checks: JSON.parse(JSON.stringify(state.checks)),
      answerChars: chars, elapsedSeconds: elapsed,
      elapsed: mmss(elapsed), auto: Boolean(auto)
    };
    if (typeof Storage !== "undefined" && typeof Storage.recordOralExam === "function") {
      Storage.recordOralExam(state.lastResult);
      if (passed && typeof Storage.awardXP === "function") Storage.awardXP(20, "Prova oral com rubrica completa");
    }
    state.stage = "result";
    refresh();
    if (typeof toast === "function") toast(auto ? "Tempo encerrado. Resultado registrado." : "Prova avaliada e registrada.");
    return state.lastResult;
  }

  function restart() {
    stop();
    state.stage = "setup";
    state.lastResult = null;
    state.answer = "";
    state.checks = {};
    refresh();
  }

  if (typeof window !== "undefined") {
    window.OralSim = {
      RUBRIC, state, renderPage, refresh, toggleTopic, setMinutes, setAnswer,
      setCheck, start, stop, finish, restart, mmss
    };
  }
})();

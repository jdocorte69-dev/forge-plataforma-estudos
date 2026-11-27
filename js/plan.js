/* ============================================================
   FORGE — plan.js
   Meu plano de formação: metas, ritmo, marcos e trilha pessoal
   Carregado depois de app.js; expõe window.Plan.
   ============================================================ */

(function () {
  "use strict";

  const GOALS = [
    { key: "fundamentos", name: "Fundamentos sólidos", desc: "Matemática básica, terminal e primeiros passos em C.", tracks: ["mathfund", "math", "linux", "c"] },
    { key: "dev-c", name: "Desenvolvedor C e sistemas", desc: "C, Linux, sistemas operacionais e banco de dados.", tracks: ["c", "linux", "systems", "databases"] },
    { key: "engenharia", name: "Engenharia de Software", desc: "Processos, arquitetura, testes, SQL e colaboração.", tracks: ["software", "c", "databases", "networks"] },
    { key: "redes", name: "Redes e infraestrutura", desc: "Modelos, protocolos, Linux e sistemas.", tracks: ["networks", "linux", "systems", "databases"] },
    { key: "matematica", name: "Matemática universitária", desc: "Do zero ao cálculo, álgebra linear e discretização.", tracks: ["mathfund", "math"] },
    { key: "livre", name: "Plano livre", desc: "Monte sua trilha adicionando aulas manualmente.", tracks: [] }
  ];

  /* Roadmap em 6 fases: cada fase exige uma evidência verificável nos dados
     locais. Nada é inferido de serviços externos e a marcação manual nunca
     apaga o progresso real das aulas. */
  const PHASES = [
    { key: "diagnostico", name: "Diagnóstico", desc: "Descubra onde você está antes de escolher o ritmo.",
      page: "domain", cta: "Abrir mapa de domínio" },
    { key: "fundamentos", name: "Fundamentos", desc: "Percorra as aulas-base da trilha escolhida.",
      page: "tracks", cta: "Abrir trilhas" },
    { key: "pratica", name: "Prática deliberada", desc: "Exerça com laboratórios e simuladores, com erro explicado.",
      page: "lab", cta: "Abrir laboratórios" },
    { key: "recuperacao", name: "Recuperação espaçada", desc: "Revise no momento certo com cartões SM-2 e caderno de erros.",
      page: "review", cta: "Abrir revisões" },
    { key: "exposicao", name: "Exposição oral", desc: "Explique em voz alta e receba uma rubrica explícita.",
      page: "oral", cta: "Abrir prova oral" },
    { key: "dominio", name: "Domínio e manutenção", desc: "Sustente o nível com notas altas, constância e caça-bugs.",
      page: "bugs", cta: "Abrir caça-bugs" }
  ];

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function planState() {
    const s = Storage.get();
    if (!s.plan || typeof s.plan !== "object") {
      s.plan = { goal: null, weeklyHours: 5, deadline: null, enrolled: [], milestones: {}, custom: [] };
    }
    if (!Array.isArray(s.plan.enrolled)) s.plan.enrolled = [];
    if (!Array.isArray(s.plan.custom)) s.plan.custom = [];
    if (!s.plan.milestones || typeof s.plan.milestones !== "object") s.plan.milestones = {};
    if (!s.plan.phases || typeof s.plan.phases !== "object") s.plan.phases = {};
    return s.plan;
  }

  function goalInfo(key) {
    return GOALS.find(g => g.key === key) || GOALS[0];
  }

  function trackName(k) {
    return (typeof CURRICULUM !== "undefined" && CURRICULUM[k]) ? CURRICULUM[k].name : k;
  }

  function allIds() {
    return (typeof lessons !== "undefined" ? lessons : []).map(l => l.id);
  }

  function buildPath(tracks) {
    const ids = allIds();
    const out = [];
    tracks.forEach(k => {
      ids.filter(id => id.startsWith(k + "-")).forEach(id => out.push(id));
    });
    return Array.from(new Set(out));
  }

  function pathIds() {
    const p = planState();
    return Array.from(new Set(p.enrolled.concat(p.custom).filter(id => allIds().includes(id))));
  }

  function progress() {
    const s = Storage.get();
    const ids = pathIds();
    const done = ids.filter(id => (s.done || []).includes(id)).length;
    return { done, total: ids.length, pct: ids.length ? Math.round(done / ids.length * 100) : 0 };
  }

  function pace() {
    const p = planState();
    const hours = Math.max(1, Number(p.weeklyHours) || 5);
    const perWeek = Math.max(1, Math.round(hours * 2)); // ~30 min por aula
    const total = pathIds().length;
    const weeks = total ? Math.ceil(total / perWeek) : 0;
    let onTrack = true;
    let daysLeft = null;
    if (p.deadline) {
      daysLeft = Math.ceil((new Date(p.deadline + "T23:59:59").getTime() - Date.now()) / 86400000);
      onTrack = daysLeft >= weeks * 7;
    }
    return { hours, perWeek, total, weeks, daysLeft, onTrack };
  }

  function generate() {
    const goalSel = document.getElementById("planGoal");
    const hours = Number(document.getElementById("planHours")?.value);
    const deadline = document.getElementById("planDeadline")?.value || null;
    const p = planState();
    const goal = goalInfo(goalSel ? goalSel.value : p.goal);
    p.goal = goal.key;
    p.weeklyHours = hours >= 1 && hours <= 40 ? hours : 5;
    p.deadline = /^\d{4}-\d{2}-\d{2}$/.test(deadline) ? deadline : null;
    p.enrolled = buildPath(goal.tracks);
    p.custom = [];
    p.milestones = {};
    Storage.save();
    renderPage(document.getElementById("view"));
    toast("Plano gerado: " + goal.name + ".");
  }

  function setHours() {
    const el = document.getElementById("planHours");
    const n = Number(el && el.value);
    if (n >= 1 && n <= 40) {
      planState().weeklyHours = n;
      Storage.save();
      renderPage(document.getElementById("view"));
    } else {
      toast("Informe entre 1 e 40 horas por semana.");
    }
  }

  function setDeadline() {
    const el = document.getElementById("planDeadline");
    const v = el && el.value;
    planState().deadline = /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
    Storage.save();
    renderPage(document.getElementById("view"));
  }

  function toggleMilestone(key) {
    const p = planState();
    p.milestones[key] = !p.milestones[key];
    Storage.save();
    renderPage(document.getElementById("view"));
  }

  function addCustom(id) {
    const p = planState();
    if (!id || !allIds().includes(id)) return;
    if (!p.custom.includes(id)) p.custom.push(id);
    Storage.save();
    renderPage(document.getElementById("view"));
    toast("Aula adicionada ao plano.");
  }

  function removeCustom(id) {
    const p = planState();
    p.custom = p.custom.filter(x => x !== id);
    Storage.save();
    renderPage(document.getElementById("view"));
  }

  function clearPlan() {
    const p = planState();
    p.goal = null;
    p.enrolled = [];
    p.custom = [];
    p.milestones = {};
    Storage.save();
    renderPage(document.getElementById("view"));
    toast("Plano limpo. Seu progresso nas aulas foi preservado.");
  }

  function lessonTitle(id) {
    const l = (typeof lessons !== "undefined" ? lessons : []).find(x => x.id === id);
    return l ? l.title : id;
  }

  function lessonTrack(id) {
    const l = (typeof lessons !== "undefined" ? lessons : []).find(x => x.id === id);
    return l ? l.track : "";
  }

  function milestoneCards() {
    const p = planState();
    const goal = goalInfo(p.goal);
    const tracks = goal.tracks.length ? goal.tracks : Array.from(new Set(pathIds().map(lessonTrack)));
    if (!tracks.length) return '<p class="muted small">Gere um plano para ver os marcos.</p>';
    const s = Storage.get();
    return tracks.map(k => {
      const ids = pathIds().filter(id => lessonTrack(id) === k);
      const done = ids.filter(id => (s.done || []).includes(id)).length;
      const complete = ids.length > 0 && done === ids.length;
      const checked = !!p.milestones["track-" + k];
      return `<div class="plan-milestone ${complete ? "complete" : ""}">
        <label class="check"><input type="checkbox" ${checked ? "checked" : ""} onchange="Plan.toggleMilestone('track-${k}')">
          <b>${esc(trackName(k))}</b></label>
        <div class="bar"><i style="width:${ids.length ? Math.round(done / ids.length * 100) : 0}%"></i></div>
        <span class="small muted">${done}/${ids.length} aulas · ${complete ? "marco concluído" : "em andamento"}</span>
      </div>`;
    }).join("");
  }

  function phaseEvidence() {
    const s = Storage.get();
    const assessments = (s.assessments && typeof s.assessments === "object") ? s.assessments : {};
    const scored = Object.values(assessments).filter(a => Number(a && a.best) > 0).length;
    const mastered = Object.values(assessments).filter(a => Number(a && a.best) >= 8).length;
    const diagnostics = Object.keys(assessments).length
      + (Array.isArray(s.mistakes) ? s.mistakes.length : 0)
      + (Array.isArray(s.assessmentLog) ? s.assessmentLog.length : 0);
    const done = Array.isArray(s.done) ? s.done.length : 0;
    const practice = (Array.isArray(s.simLogs) ? s.simLogs.length : 0)
      + Object.keys(s.labEvidence && typeof s.labEvidence === "object" ? s.labEvidence : {}).length;
    const cards = Object.keys(s.cards && typeof s.cards === "object" ? s.cards : {}).length;
    const oral = (s.forge4 && Array.isArray(s.forge4.oral_exam_history)) ? s.forge4.oral_exam_history.length : 0;
    const feynman = Object.keys(s.feynman && typeof s.feynman === "object" ? s.feynman : {})
      .filter(id => String(s.feynman[id] || "").trim().length >= 30).length;
    const bugs = (s.forge4 && Array.isArray(s.forge4.bug_hunt_history)) ? s.forge4.bug_hunt_history.length : 0;
    return {
      diagnostico: { ok: diagnostics > 0, text: `${diagnostics} avaliação(ões) ou erro(s) registrado(s)` },
      fundamentos: { ok: done >= 5, text: `${done} aula(s) concluída(s)` },
      pratica: { ok: practice > 0, text: `${practice} execução(ões) de laboratório ou simulador` },
      recuperacao: { ok: cards > 0, text: `${cards} cartão(ões) SM-2 agendado(s)` },
      exposicao: { ok: oral + feynman > 0, text: `${oral} prova(s) oral(is) · ${feynman} explicação(ões) Feynman` },
      dominio: { ok: mastered >= 3, text: `${mastered} aula(s) com nota ≥ 8 · ${scored} avaliada(s) · ${bugs} caça-bugs` }
    };
  }

  function phaseCards() {
    const p = planState();
    const evidence = phaseEvidence();
    return PHASES.map((phase, i) => {
      const checked = !!p.phases[phase.key];
      const ev = evidence[phase.key];
      return `<li class="plan-phase ${checked ? "is-done" : ""} ${ev.ok ? "has-evidence" : ""}">
        <div class="plan-phase__head">
          <span class="plan-phase__n" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
          <div class="plan-phase__text">
            <h3>${esc(phase.name)}${checked ? " ✓" : ""}</h3>
            <p class="small muted">${esc(phase.desc)}</p>
          </div>
          <label class="check">
            <input type="checkbox" ${checked ? "checked" : ""} aria-label="Marcar fase ${i + 1}, ${esc(phase.name)}, como concluída" onchange="Plan.togglePhase('${phase.key}', this.checked)">
            <span class="small">Concluída</span>
          </label>
        </div>
        <p class="small">Evidência local: <b class="${ev.ok ? "good" : "muted"}">${esc(ev.text)}</b></p>
        <button type="button" class="ghost tiny" onclick="goToPage('${phase.page}')">${esc(phase.cta)} →</button>
      </li>`;
    }).join("");
  }

  function togglePhase(key, checked) {
    if (!PHASES.some(x => x.key === key)) return;
    const p = planState();
    p.phases[key] = Boolean(checked);
    Storage.save();
    renderPage(document.getElementById("view"));
  }

  function masteryPanel() {
    const s = Storage.get();
    const done = new Set(s.done || []);
    const assessments = (s.assessments && typeof s.assessments === "object") ? s.assessments : {};
    const tracks = Object.keys(CURRICULUM);
    return tracks.map(k => {
      const ids = allIds().filter(id => id.startsWith(k + "-"));
      if (!ids.length) return "";
      const finished = ids.filter(id => done.has(id)).length;
      const scored = ids.map(id => assessments[id]).filter(a => a && Number(a.best) > 0);
      const mastered = scored.filter(a => Number(a.best) >= 8).length;
      const avg = scored.length ? Math.round(scored.reduce((a, x) => a + Number(x.best), 0) / scored.length * 10) / 10 : 0;
      const pct = Math.round(mastered / ids.length * 100);
      const exam = assessments["exam-" + k];
      return `<div class="plan-milestone">
        <div class="row"><b>${esc(trackName(k))}</b><span class="pill">${pct}% domínio</span></div>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <span class="small muted">${finished}/${ids.length} aulas concluídas · ${mastered} com nota ≥ 8 · média ${avg || "—"}/10${exam ? ` · prova: ${Number(exam.best)}/10` : ""}</span>
      </div>`;
    }).join("");
  }

  function renderPage(v) {
    if (!v) return;
    const s = Storage.get();
    const p = planState();
    const goal = goalInfo(p.goal);
    const pr = progress();
    const pc = pace();
    const ids = pathIds();
    const doneSet = new Set(s.done || []);
    const next = ids.filter(id => !doneSet.has(id)).slice(0, 6);
    const completed = ids.filter(id => doneSet.has(id)).slice(-5).reverse();

    const options = allIds().map(id => {
      const l = lessons.find(x => x.id === id);
      return `<option value="${id}">${esc(trackName(l.track))} · ${esc(l.moduleName)} · ${esc(l.title)}</option>`;
    }).join("");

    v.innerHTML = `
<div class="eyebrow">Organize sua jornada</div>
<h1 class="h1">Meu plano de formação</h1>
<p class="sub">Escolha um objetivo, defina seu ritmo semanal e acompanhe marcos por disciplina. O plano é apenas uma sugestão: você pode adicionar aulas e ajustar o ritmo quando quiser.</p>

<div class="card section">
  <h2>Configurar plano</h2>
  <div class="plan-form">
    <label>Objetivo
      <select class="field" id="planGoal">${GOALS.map(g => `<option value="${g.key}" ${g.key === p.goal ? "selected" : ""}>${esc(g.name)}</option>`).join("")}</select>
    </label>
    <label>Horas por semana
      <input class="field" id="planHours" type="number" min="1" max="40" step="1" value="${pc.hours}">
    </label>
    <label>Prazo (opcional)
      <input class="field" id="planDeadline" type="date" value="${p.deadline || ""}">
    </label>
  </div>
  <p class="small muted">${esc(goal.desc)}</p>
  <div class="actions" style="flex-wrap:wrap">
    <button onclick="Plan.generate()">Gerar novo plano</button>
    <button class="secondary" onclick="Plan.setHours()">Atualizar ritmo</button>
    <button class="secondary" onclick="Plan.setDeadline()">Atualizar prazo</button>
    <button class="ghost" onclick="Plan.clearPlan()">Limpar plano</button>
  </div>
</div>

<div class="grid3 section">
  <div class="card"><div class="eyebrow">Progresso do plano</div><div class="plan-big">${pr.pct}<span>%</span></div><div class="bar"><i style="width:${pr.pct}%"></i></div><p class="small muted">${pr.done} de ${pr.total} aulas do plano concluídas.</p></div>
  <div class="card"><div class="eyebrow">Ritmo sugerido</div><div class="plan-big">${pc.perWeek}<span>/sem</span></div><p class="small muted">Com ${pc.hours} h/semana (≈30 min por aula). ${pc.weeks ? `Previsão: ${pc.weeks} ${pc.weeks === 1 ? "semana" : "semanas"}.` : "Gere um plano para ver a previsão."}</p></div>
  <div class="card"><div class="eyebrow">Prazo</div><div class="plan-big">${p.deadline && pc.daysLeft !== null ? Math.max(0, pc.daysLeft) : "—"}<span>${p.deadline ? "dias" : ""}</span></div><p class="small ${pc.onTrack ? "good" : "bad"}">${p.deadline ? (pc.onTrack ? "Ritmo compatível com o prazo." : "Ritmo insuficiente: aumente as horas ou revise o prazo.") : "Defina um prazo para receber este alerta."}</p></div>
</div>

<div class="card section" id="planPhases">
  <div class="row"><h2>Roadmap em 6 fases</h2><span class="pill">${PHASES.filter(x => !!p.phases[x.key]).length}/6 concluídas</span></div>
  <p class="muted">Cada fase mostra uma evidência verificável nos seus dados locais. A marcação manual é opcional e nunca substitui o progresso real das aulas.</p>
  <ol class="plan-phases">${phaseCards()}</ol>
</div>

<div class="grid2 section">
  <div class="card" id="planNext">
    <div class="row"><h3>Próximas aulas</h3><span class="pill">${next.length} na fila</span></div>
    ${next.length ? `<ol class="plan-list">${next.map(id => `<li><button class="linklike" onclick="openLesson('${id}')">${esc(lessonTitle(id))}</button><span class="small muted">${esc(trackName(lessonTrack(id)))}</span><button class="ghost tiny" onclick="Focus.open('${id}','plan')">◉ Foco</button></li>`).join("")}</ol>` : '<p class="muted small">Plano concluído ou vazio. Adicione aulas abaixo para continuar.</p>'}
  </div>
  <div class="card" id="planMilestones">
    <div class="row"><h3>Marcos por disciplina</h3><span class="pill">autoavaliação</span></div>
    <div class="plan-milestones">${milestoneCards()}</div>
  </div>
</div>

<div class="card section">
  <div class="row"><h2>Domínio por assunto</h2><span class="pill">nota ≥ 8 em cada aula</span></div>
  <p class="muted">O domínio combina aulas concluídas e o melhor resultado obtido nos exercícios. Refazer uma aula substitui apenas o melhor resultado — nunca apaga o histórico.</p>
  <div class="grid2">${masteryPanel()}</div>
</div>

<div class="card section">
  <h2>Adicionar aula ao plano</h2>
  <div class="actions" style="flex-wrap:wrap">
    <select class="field grow" id="planAddSelect" aria-label="Adicionar aula ao plano">${options}</select>
    <button onclick="Plan.addCustom(document.getElementById('planAddSelect').value)">Adicionar</button>
  </div>
  ${p.custom.length ? `<h3>Aulas adicionadas manualmente</h3><ul class="plan-list">${p.custom.map(id => `<li><button class="linklike" onclick="openLesson('${id}')">${esc(lessonTitle(id))}</button><button class="ghost tiny" onclick="Plan.removeCustom('${id}')">Remover</button></li>`).join("")}</ul>` : ""}
  ${completed.length ? `<h3>Concluídas recentemente</h3><ul class="plan-list">${completed.map(id => `<li><span class="good">✓</span> ${esc(lessonTitle(id))}</li>`).join("")}</ul>` : ""}
</div>`;
  }

  window.Plan = {
    renderPage, generate, setHours, setDeadline, toggleMilestone,
    addCustom, removeCustom, clearPlan, togglePhase,
    progress, pace, pathIds, phaseEvidence, phases: PHASES, goals: GOALS
  };
})();

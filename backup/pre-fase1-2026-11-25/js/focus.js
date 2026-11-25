/* ============================================================
   FORGE — focus.js
   Modo foco, microaprendizagem, metas, histórico e recompensas
   Carregado depois de app.js/features.js; expõe window.Focus.
   ============================================================ */

(function () {
  "use strict";

  const STEPS = [
    { key: "goal", icon: "◎", label: "O que vou aprender?" },
    { key: "short", icon: "✦", label: "Explicação curta" },
    { key: "visual", icon: "▧", label: "Exemplo visual" },
    { key: "solved", icon: "✓", label: "Exemplo resolvido" },
    { key: "practice", icon: "✎", label: "Pequeno exercício" },
    { key: "check", icon: "◈", label: "Verificação" },
    { key: "summary", icon: "▤", label: "Resumo" },
    { key: "next", icon: "→", label: "Próxima etapa" }
  ];

  const session = {
    lessonId: null,
    returnPage: "tracks",
    step: 0,
    blockMinutes: 25,
    remaining: 25 * 60,
    pausedRemaining: 25 * 60,
    endAt: 0,
    running: false,
    handle: null,
    done: {}
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function focusState() {
    const s = Storage.get();
    if (!s.focus) s.focus = {};
    const f = s.focus;
    if (!Array.isArray(f.sessions)) f.sessions = [];
    if (!f.progress || typeof f.progress !== "object") f.progress = {};
    if (!f.goals) f.goals = { dailyMinutes: 25, weeklyMinutes: 150 };
    if (!Number(f.goals.dailyMinutes)) f.goals.dailyMinutes = 25;
    if (!Number(f.goals.weeklyMinutes)) f.goals.weeklyMinutes = 150;
    return f;
  }

  function lesson() {
    return (typeof lessons !== "undefined" && session.lessonId)
      ? lessons.find(x => x.id === session.lessonId) || null
      : null;
  }

  function persistProgress() {
    const l = lesson();
    if (!l) return;
    const f = focusState();
    f.progress[l.id] = { step: session.step, done: Object.keys(session.done), updatedAt: new Date().toISOString() };
    f.lastSession = {
      lessonId: l.id,
      step: session.step,
      blockMinutes: session.blockMinutes,
      remaining: session.remaining,
      savedAt: new Date().toISOString()
    };
    Storage.save();
  }

  function loadProgress(id) {
    const rec = focusState().progress[id];
    session.done = {};
    if (rec && Array.isArray(rec.done)) rec.done.forEach(k => { session.done[k] = true; });
    session.step = rec && Number.isInteger(rec.step) ? Math.max(0, Math.min(STEPS.length - 1, rec.step)) : 0;
  }

  /* ---------------------- Timer de bloco ---------------------- */

  function remainingSeconds() {
    if (!session.running) return session.pausedRemaining;
    return Math.max(0, Math.ceil((session.endAt - Date.now()) / 1000));
  }

  function fmt(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  function updateTimerUI() {
    const rem = remainingSeconds();
    const total = session.blockMinutes * 60;
    const t = document.getElementById("focusTime");
    if (t) t.textContent = fmt(rem);
    const b = document.getElementById("focusBar");
    if (b) b.style.width = Math.max(0, Math.min(100, (1 - rem / total) * 100)) + "%";
    const btn = document.getElementById("focusToggle");
    if (btn) btn.textContent = session.running ? "❚❚ Pausar" : rem < total ? "▶ Continuar" : "▶ Iniciar bloco";
    document.querySelectorAll("[data-block]").forEach(el => {
      el.classList.toggle("active", Number(el.dataset.block) === session.blockMinutes);
      el.setAttribute("aria-pressed", String(Number(el.dataset.block) === session.blockMinutes));
    });
  }

  function beep() {
    if (!Storage.getSetting("sound")) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 660;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      osc.onended = () => ctx.close();
    } catch (e) {
      /* áudio é opcional; falha silenciosa é intencional */
    }
  }

  function completeBlock() {
    clearInterval(session.handle);
    session.handle = null;
    session.running = false;
    session.remaining = 0;
    session.pausedRemaining = session.blockMinutes * 60;

    const l = lesson();
    const track = l ? l.track : "geral";
    const minutes = session.blockMinutes;
    const f = focusState();
    f.sessions.push({
      date: new Date().toISOString(),
      day: today(),
      minutes,
      lessonId: session.lessonId,
      track,
      steps: Object.keys(session.done).length
    });
    if (f.sessions.length > 300) f.sessions = f.sessions.slice(-300);
    Storage.save();
    Storage.recordTimerSession(minutes, track, "focus");
    Storage.addHours(minutes / 60);
    beep();

    const box = document.getElementById("focusBlockDone");
    if (box) {
      box.innerHTML = '<div class="callout"><b>Bloco concluído!</b> ' + minutes +
        ' minutos registrados no histórico. Faça uma pausa curta e continue quando quiser.</div>';
      box.classList.remove("hidden");
    }
    toast("Bloco de " + minutes + " min concluído. Pausa recomendada.");
    updateTimerUI();
    renderPanels();
  }

  function tick() {
    const rem = remainingSeconds();
    if (rem <= 0) { completeBlock(); return; }
    session.remaining = rem;
    updateTimerUI();
  }

  function startTimer() {
    if (session.running) return;
    if (session.pausedRemaining <= 0) session.pausedRemaining = session.blockMinutes * 60;
    session.endAt = Date.now() + session.pausedRemaining * 1000;
    session.running = true;
    session.handle = setInterval(tick, 250);
    const box = document.getElementById("focusBlockDone");
    if (box) box.classList.add("hidden");
    updateTimerUI();
  }

  function pauseTimer() {
    if (!session.running) return;
    session.pausedRemaining = remainingSeconds();
    session.remaining = session.pausedRemaining;
    session.running = false;
    clearInterval(session.handle);
    session.handle = null;
    updateTimerUI();
    persistProgress();
  }

  function toggleTimer() {
    if (session.running) pauseTimer();
    else startTimer();
  }

  function setBlock(min) {
    const m = [5, 10, 15, 25].includes(Number(min)) ? Number(min) : 25;
    if (session.running) pauseTimer();
    session.blockMinutes = m;
    session.remaining = m * 60;
    session.pausedRemaining = m * 60;
    session.endAt = 0;
    const box = document.getElementById("focusBlockDone");
    if (box) box.classList.add("hidden");
    updateTimerUI();
    persistProgress();
  }

  function resetBlock() {
    if (session.running) pauseTimer();
    session.remaining = session.blockMinutes * 60;
    session.pausedRemaining = session.blockMinutes * 60;
    updateTimerUI();
    toast("Bloco reiniciado sem registrar tempo.");
  }

  /* -------------------- Navegação e sessão -------------------- */

  function open(id, returnPage) {
    const l = (typeof lessons !== "undefined") ? lessons.find(x => x.id === id) : null;
    if (!l) return toast("Aula não encontrada.");
    if (session.running) pauseTimer();
    session.returnPage = returnPage || (typeof page !== "undefined" ? page : "tracks");
    session.lessonId = id;
    const saved = focusState().lastSession;
    const canResume = saved && saved.lessonId === id && saved.remaining > 0;
    if (canResume) {
      session.blockMinutes = [5, 10, 15, 25].includes(saved.blockMinutes) ? saved.blockMinutes : 25;
      session.pausedRemaining = Math.max(1, Math.min(session.blockMinutes * 60, Number(saved.remaining) || session.blockMinutes * 60));
    } else {
      session.blockMinutes = 25;
      session.pausedRemaining = session.blockMinutes * 60;
    }
    session.remaining = session.pausedRemaining;
    loadProgress(id);
    if (typeof page !== "undefined") { page = "focus"; render(); }
  }

  function openPicker() {
    if (session.running) pauseTimer();
    session.lessonId = null;
    if (typeof page !== "undefined") { page = "focus"; render(); }
  }

  function exit() {
    if (session.running) pauseTimer();
    const back = session.returnPage === "lesson" ? "lesson" : "tracks";
    if (typeof page !== "undefined") { page = back; render(); }
  }

  function selectLesson(id) {
    if (session.running) pauseTimer();
    session.lessonId = id;
    session.blockMinutes = 25;
    session.pausedRemaining = 25 * 60;
    session.remaining = 25 * 60;
    loadProgress(id);
    renderPage(document.getElementById("view"));
  }

  function goToStep(n) {
    const next = Math.max(0, Math.min(STEPS.length - 1, Number(n)));
    session.step = next;
    renderStepContent();
    renderRail();
    persistProgress();
    document.getElementById("focusStepCard")?.scrollIntoView({ behavior: Storage.getSetting("animations") ? "smooth" : "auto", block: "start" });
  }

  function markStep(n, on) {
    const key = STEPS[n]?.key;
    if (!key) return;
    if (on) session.done[key] = true;
    else delete session.done[key];
    renderRail();
    renderStepContent();
    persistProgress();
    renderPanels();
  }

  /* -------------------- Conteúdo das etapas -------------------- */

  function nextLesson(l) {
    const idx = lessons.findIndex(x => x.id === l.id);
    return idx >= 0 ? lessons[idx + 1] || null : null;
  }

  function summaryItems(l) {
    const items = [];
    (l.exercises || []).slice(0, 6).forEach(q => {
      const m = String(q[0]).match(/O que significa "(.+?)"\?/);
      if (m) items.push([m[1], q[1]]);
    });
    if (!items.length) {
      items.push(["Ideia central", l.objective]);
      items.push(["Pré-requisito", l.prereq]);
    }
    return items;
  }

  function visualFormula(l) {
    const text = [l.explain || "", ...(l.examples || []).map(e => e[1] || "")].join(" ");
    const m = text.match(/\$[^$\n]{2,120}\$/);
    return m ? m[0] : (l.examples && l.examples[0] ? "$f(x) \\rightarrow \\text{ideia aplicada}$" : "$1 + 1 = 2$");
  }

  function stepContent(l) {
    const idx = session.step;
    const key = STEPS[idx].key;
    const checked = !!session.done[key];
    const nav = `<div class="actions" style="justify-content:space-between;margin-top:20px">
      <button class="ghost" ${idx === 0 ? "disabled" : ""} onclick="Focus.goToStep(${idx - 1})">← Etapa anterior</button>
      <label class="check"><input type="checkbox" ${checked ? "checked" : ""} onchange="Focus.markStep(${idx},this.checked)"> Concluí esta etapa</label>
      ${idx < STEPS.length - 1 ? `<button onclick="Focus.goToStep(${idx + 1})">Próxima etapa →</button>` : `<button onclick="Focus.finishLesson()">Concluir aula ✓</button>`}
    </div>`;

    let body = "";

    if (key === "goal") {
      body = `<div class="eyebrow">Etapa 1 de 8 · começo da sessão</div>
        <h2>${esc(l.title)}</h2>
        <p class="lead">${esc(l.objective)}</p>
        <div class="focus-goals">
          <div><span class="focus-num">1</span><p><b>Entender</b> a ideia central da aula.</p></div>
          <div><span class="focus-num">2</span><p><b>Ver</b> um exemplo concreto resolvido.</p></div>
          <div><span class="focus-num">3</span><p><b>Explicar</b> o conceito com minhas palavras.</p></div>
        </div>
        <div class="callout"><b>Pré-requisito:</b> ${esc(l.prereq)}</div>
        <p class="small muted">Você pode dividir esta aula em blocos de 5, 10, 15 ou 25 minutos no painel acima.</p>`;
    } else if (key === "short") {
      body = `<div class="eyebrow">Etapa 2 de 8 · ideia em poucas linhas</div>
        <h2>Explicação curta</h2>
        <p class="lead">${l.intuition}</p>
        <details class="focus-deep">
          <summary>Quero aprofundar agora</summary>
          <div class="prose">${l.explain}</div>
        </details>
        <p class="small muted">Não precisa abrir o aprofundamento agora. Você pode voltar a ele depois do exercício.</p>`;
    } else if (key === "visual") {
      const ex = (l.examples && l.examples[0]) || ["Exemplo", l.objective];
      body = `<div class="eyebrow">Etapa 3 de 8 · visualizar antes de formalizar</div>
        <h2>Exemplo visual</h2>
        <div class="focus-visual">
          <div class="focus-visual-label">IDEIA CENTRAL</div>
          <div class="focus-formula">${visualFormula(l)}</div>
          <div class="focus-flow"><span>${esc(l.title)}</span><b>→</b><span>${esc(ex[0])}</span><b>→</b><span>Resultado</span></div>
        </div>
        <p>${esc(ex[1])}</p>
        <p class="small muted">Se a fórmula não aparecer formatada, o conteúdo ainda pode ser lido em texto. Isso acontece quando o KaTeX não carrega.</p>`;
    } else if (key === "solved") {
      const exs = l.examples || [];
      body = `<div class="eyebrow">Etapa 4 de 8 · ver o raciocínio completo</div>
        <h2>Exemplo resolvido</h2>
        ${exs.length ? exs.map((e, i) => `<details class="focus-deep" ${i === 0 ? "open" : ""}>
          <summary>Exemplo ${i + 1}: ${esc(e[0])}</summary>
          <div class="callout">${e[1]}</div>
        </details>`).join("") : `<div class="callout">${l.explain}</div>`}
        <h3>Cuidado com estes erros</h3>
        <ul>${(l.errors || []).map(e => `<li>${esc(e)}</li>`).join("") || "<li>Revisar a explicação antes de aplicar.</li>"}</ul>`;
    } else if (key === "practice") {
      const q = (l.exercises || [])[0];
      body = `<div class="eyebrow">Etapa 5 de 8 · praticar agora</div>
        <h2>Pequeno exercício</h2>
        ${q ? `<div class="q" id="microQ">
          <p><b>1.</b> ${q[0]}</p>
          <div class="row" style="justify-content:flex-start;flex-wrap:wrap;gap:8px">
            ${q.slice(1).map((a, j) => `<label class="check"><input type="radio" name="micro0" value="${j}"> ${esc(a)}</label>`).join("")}
          </div>
          <div class="actions"><button onclick="Focus.checkMicro(0)">Verificar resposta</button></div>
          <div class="feedback" id="microFb"></div>
        </div>` : "<p>Esta aula não tem exercício cadastrado. Leia o exemplo resolvido e avance.</p>"}`;
    } else if (key === "check") {
      const q = (l.exercises || [])[1];
      body = `<div class="eyebrow">Etapa 6 de 8 · verificar entendimento</div>
        <h2>Verificação de entendimento</h2>
        ${q ? `<div class="q">
          <p><b>2.</b> ${q[0]}</p>
          <div class="row" style="justify-content:flex-start;flex-wrap:wrap;gap:8px">
            ${q.slice(1).map((a, j) => `<label class="check"><input type="radio" name="micro1" value="${j}"> ${esc(a)}</label>`).join("")}
          </div>
          <div class="actions"><button onclick="Focus.checkMicro(1)">Verificar resposta</button></div>
          <div class="feedback" id="microFb"></div>
        </div>` : "<p>Use a pergunta da etapa anterior para verificar seu entendimento.</p>"}
        <label style="display:block;margin-top:18px" for="microExplain">Explique em uma frase, sem consultar o texto</label>
        <textarea class="field" id="microExplain" placeholder="Ex.: serve paraConverter..." rows="3">${esc((Storage.get().feynman || {})["focus-" + l.id] || "")}</textarea>
        <div class="actions"><button class="secondary" onclick="Focus.saveExplanation()">Salvar explicação</button></div>`;
    } else if (key === "summary") {
      const items = summaryItems(l);
      body = `<div class="eyebrow">Etapa 7 de 8 · fechar o loop</div>
        <h2>Resumo da aula</h2>
        <div class="focus-summary">${items.map(it => `<div class="focus-summary-item"><b>${esc(it[0])}</b><span>${esc(it[1])}</span></div>`).join("")}</div>
        <div class="callout"><b>Referência para consulta:</b> ${l.reference}</div>`;
    } else {
      const nx = nextLesson(l);
      body = `<div class="eyebrow">Etapa 8 de 8 · continuidade</div>
        <h2>Próxima etapa</h2>
        <p>Você percorreu as oito etapas desta aula. Para fixar, faça as 10 questões completas e registre uma explicação própria.</p>
        <div class="actions" style="flex-wrap:wrap">
          <button onclick="Focus.openFullLesson()">Ver aula completa e exercícios</button>
          <button class="secondary" onclick="Focus.goLab()">Abrir laboratório</button>
          ${nx ? `<button onclick="Focus.open('${nx.id}','lesson')">Estudar: ${esc(nx.title)} →</button>` : ""}
        </div>
        <div class="callout" style="margin-top:18px"><b>Revisão:</b> ${esc(reviewCount())} cartões disponíveis. Revisar amanhã é parte do plano.</div>`;
    }

    return `<div class="card focus-step" id="focusStepCard">${body}${nav}</div>`;
  }

  function reviewCount() {
    try { return (typeof Exercises !== "undefined" && Exercises.getSpacedCards) ? Exercises.getSpacedCards().length : 0; }
    catch (e) { return 0; }
  }

  function checkMicro(which) {
    const sel = document.querySelector(`input[name="micro${which}"]:checked`);
    const fb = document.getElementById("microFb");
    if (!fb) return;
    if (!sel) { fb.textContent = "Escolha uma alternativa antes de verificar."; fb.className = "feedback muted"; return; }
    const q = lesson()?.exercises?.[which];
    const ok = Number(sel.value) === 0;
    fb.textContent = ok ? ("Correto. " + q[1]) : ("Ainda não. Resposta esperada: " + q[1] + ". Revise a etapa 4.");
    fb.className = "feedback " + (ok ? "good" : "bad");
    if (!ok && q && typeof Storage.addMistake === "function") {
      Storage.addMistake(session.lessonId, lesson().track, q[0], q[1]);
    }
  }

  function saveExplanation() {
    const el = document.getElementById("microExplain");
    if (!el) return;
    const s = Storage.get();
    if (!s.feynman) s.feynman = {};
    s.feynman["focus-" + session.lessonId] = el.value;
    Storage.save();
    toast("Explicação salva no caderno.");
  }

  function openFullLesson() {
    if (session.lessonId) openLesson(session.lessonId);
  }

  function goLab() {
    if (typeof labTab !== "undefined") {
      const t = lesson()?.track;
      labTab = t === "math" || t === "mathfund" ? "math"
        : t === "c" ? "c"
        : t === "software" ? "eng"
        : t === "networks" ? "net"
        : t === "databases" ? "db"
        : "linux";
    }
    if (typeof page !== "undefined") { page = "lab"; render(); }
  }

  function finishLesson() {
    if (session.lessonId && typeof completeLesson === "function") completeLesson(session.lessonId);
  }

  /* ---------------------- Painéis de apoio -------------------- */

  function minutesIn(days) {
    const f = focusState();
    const since = Date.now() - days * 86400000;
    return f.sessions.filter(x => new Date(x.date).getTime() >= since).reduce((a, x) => a + Number(x.minutes || 0), 0);
  }

  function stats() {
    const s = Storage.get();
    const f = focusState();
    const minutes = f.sessions.reduce((a, x) => a + Number(x.minutes || 0), 0);
    const doneCount = (s.done || []).length;
    const labCount = (s.labDone || []).length;
    const reviews = Object.values(s.cards || {}).reduce((a, c) => a + (Number(c.level) || 0), 0);
    const stepsDone = Object.values(f.progress || {}).reduce((a, p) => a + ((p.done || []).length), 0);
    // XP e nível agora vêm do estado persistente da Seção 11 (uma única pontuação).
    const xp = Number(s.xp) || 0;
    const level = Number(s.level) || Storage.levelFromXP(xp);
    const floorXP = Storage.levelFloor(level);
    const nextXP = Storage.levelFloor(level + 1);
    return { minutes, doneCount, labCount, reviews, stepsDone, xp, level, floorXP, nextXP, streak: s.streak || 0 };
  }

  function badges(st) {
    return [
      { icon: "🌱", name: "Primeira sessão", ok: st.minutes > 0, hint: "Conclua um bloco" },
      { icon: "⏱", name: "100 minutos", ok: st.minutes >= 100, hint: "100 min de foco" },
      { icon: "🔥", name: "Constância", ok: st.streak >= 3, hint: "3 dias seguidos" },
      { icon: "📘", name: "Leitor", ok: st.doneCount >= 10, hint: "10 aulas concluídas" },
      { icon: "🔁", name: "Revisor", ok: st.reviews >= 10, hint: "10 revisões" },
      { icon: "🧪", name: "Prático", ok: st.labCount >= 5, hint: "5 laboratórios" },
      { icon: "🧩", name: "Passo a passo", ok: st.stepsDone >= 32, hint: "32 etapas" },
      { icon: "🏅", name: "Domínio", ok: st.doneCount >= 40, hint: "40 aulas" }
    ];
  }

  function weekBars() {
    const f = focusState();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const v = f.sessions.filter(x => x.day === key).reduce((a, x) => a + Number(x.minutes || 0), 0);
      days.push({ label: d.toLocaleDateString("pt-BR", { weekday: "narrow" }), v, key });
    }
    const max = Math.max(1, ...days.map(d => d.v));
    return `<div class="focus-week">${days.map(d => `<div class="focus-week-day" title="${d.key}: ${d.v} min">
      <div class="focus-week-bar" style="height:${Math.max(3, d.v / max * 100)}%"></div>
      <span>${d.label}</span></div>`).join("")}</div>`;
  }

  function renderPanels() {
    const goalsBox = document.getElementById("focusGoalsBox");
    const rewardBox = document.getElementById("focusRewardBox");
    const histBox = document.getElementById("focusHistoryBox");
    if (!goalsBox && !rewardBox && !histBox) return;
    const f = focusState(), st = stats();
    const todayMin = minutesIn(1), weekMin = minutesIn(7);

    if (goalsBox) {
      goalsBox.innerHTML = `<div class="row"><h3>Metas de concentração</h3><span class="pill">${fmt(todayMin * 60)} hoje</span></div>
        <div class="focus-goal-line"><span>Diária</span><b>${todayMin} / ${f.goals.dailyMinutes} min</b></div>
        <div class="bar"><i style="width:${Math.min(100, todayMin / f.goals.dailyMinutes * 100)}%"></i></div>
        <div class="focus-goal-line"><span>Semanal</span><b>${weekMin} / ${f.goals.weeklyMinutes} min</b></div>
        <div class="bar"><i style="width:${Math.min(100, weekMin / f.goals.weeklyMinutes * 100)}%"></i></div>
        <div class="actions" style="flex-wrap:wrap;margin-top:12px">
          <label class="small muted">Diária (min)<input class="field" id="goalDaily" type="number" min="5" max="480" step="5" value="${f.goals.dailyMinutes}"></label>
          <label class="small muted">Semanal (min)<input class="field" id="goalWeekly" type="number" min="25" max="3000" step="25" value="${f.goals.weeklyMinutes}"></label>
          <button class="secondary" onclick="Focus.saveGoals()">Salvar metas</button>
        </div>
        ${reviewCount() ? `<div class="callout" style="margin-top:12px"><b>Lembrete de revisão:</b> ${reviewCount()} cartões pendentes. <button class="ghost" style="width:auto" onclick="Focus.goReview()">Ir para revisão</button></div>` : ""}`;
    }

    if (rewardBox) {
      rewardBox.innerHTML = `<div class="row"><h3>Evolução</h3><span class="pill">Nível ${st.level}</span></div>
        <div class="row" style="justify-content:flex-start;gap:16px;align-items:center">
          <div class="focus-xp">${st.xp}<span>XP</span></div>
          <div class="grow"><div class="small muted">Progresso até o nível ${st.level + 1}</div>
          <div class="bar"><i style="width:${Math.min(100, (st.xp - st.floorXP) / (st.nextXP - st.floorXP) * 100)}%"></i></div>
          <div class="small muted">${st.xp - st.floorXP} / ${st.nextXP - st.floorXP} XP</div></div>
        </div>
        <h4>Mapa de evolução</h4>
        <div class="focus-levels">${Array.from({ length: 8 }, (_, i) => `<span class="${st.level > i ? "on" : ""}" title="Nível ${i + 1}">${i + 1}</span>`).join("")}</div>
        <h4>Conquistas</h4>
        <div class="focus-badges">${badges(st).map(b => `<span class="focus-badge ${b.ok ? "on" : ""}" title="${b.hint}">${b.icon}<small>${esc(b.name)}</small></span>`).join("")}</div>
        <h4>Últimos 7 dias</h4>${weekBars()}`;
    }

    if (histBox) {
      const recent = focusState().sessions.slice(-6).reverse();
      histBox.innerHTML = `<div class="row"><h3>Histórico de sessões</h3><span class="pill">${f.sessions.length} registros</span></div>
        ${recent.length ? `<ul class="focus-history">${recent.map(x => {
          const l = lessons.find(y => y.id === x.lessonId);
          return `<li><b>${x.minutes} min</b> · ${esc(l ? l.title : "Sessão livre")} <span class="muted small">${new Date(x.date).toLocaleString("pt-BR")}</span></li>`;
        }).join("")}</ul>` : '<p class="muted small">Nenhuma sessão registrada ainda. Inicie um bloco acima.</p>'}
        <div class="small muted">Sequência atual: <b>${st.streak} dias</b>. XP valoriza compreensão, revisão e constância — não velocidade.</div>`;
    }
  }

  function saveGoals() {
    const d = Number(document.getElementById("goalDaily")?.value);
    const w = Number(document.getElementById("goalWeekly")?.value);
    const f = focusState();
    if (d >= 5 && d <= 480) f.goals.dailyMinutes = d;
    if (w >= 25 && w <= 3000) f.goals.weeklyMinutes = w;
    Storage.save();
    renderPanels();
    toast("Metas atualizadas.");
  }

  function goReview() {
    if (typeof page !== "undefined") { page = "review"; render(); }
  }

  /* ------------------------- Página --------------------------- */

  function renderPage(v) {
    if (!v) return;
    const l = lesson();
    if (!l) {
      const opts = lessons.map(x => `<option value="${x.id}">${esc(CURRICULUM[x.track].name)} · ${esc(x.moduleName)} · ${esc(x.title)}</option>`).join("");
      v.innerHTML = `<div class="eyebrow">Estudo sem distrações</div>
        <h1 class="h1">Modo foco</h1>
        <p class="sub">Escolha uma aula para estudar em etapas curtas, com timer de blocos e uma tarefa por vez.</p>
        <div class="card"><label for="focusPick">Aula</label><select class="field" id="focusPick">${opts}</select>
        <div class="actions" style="margin-top:12px"><button onclick="Focus.selectLesson(document.getElementById('focusPick').value)">Começar sessão</button></div></div>`;
      return;
    }

    const saved = focusState().lastSession;
    const resume = saved && saved.lessonId === l.id && saved.remaining > 0 && saved.remaining < session.blockMinutes * 60;
    const due = reviewCount();
    const opts = lessons.map(x => `<option value="${x.id}" ${x.id === l.id ? "selected" : ""}>${esc(CURRICULUM[x.track].name)} · ${esc(x.moduleName)} · ${esc(x.title)}</option>`).join("");

    v.innerHTML = `<div class="focus-shell">
      <div class="focus-head">
        <button class="ghost" onclick="Focus.exit()">← Sair do modo foco</button>
        <label class="grow"><span class="sr-only">Escolher aula</span><select class="field" id="focusLessonSelect" onchange="Focus.selectLesson(this.value)">${opts}</select></label>
        <span class="pill">${esc(CURRICULUM[l.track].name)}</span>
      </div>

      <div class="card focus-timer" id="timerWidget">
        <div class="row"><div><div class="eyebrow">Bloco de concentração</div><h2 style="margin:2px 0">${esc(l.title)}</h2></div>
          <div class="timer-display focus-time" id="focusTime">${fmt(remainingSeconds())}</div></div>
        <div class="bar focus-bar"><i id="focusBar" style="width:0%"></i></div>
        <div class="actions" style="flex-wrap:wrap;justify-content:flex-start">
          <button data-block="5" onclick="Focus.setBlock(5)" aria-pressed="false">5 min</button>
          <button data-block="10" onclick="Focus.setBlock(10)" aria-pressed="false">10 min</button>
          <button data-block="15" onclick="Focus.setBlock(15)" aria-pressed="false">15 min</button>
          <button data-block="25" onclick="Focus.setBlock(25)" aria-pressed="false">25 min</button>
          <button id="focusToggle" onclick="Focus.toggleTimer()">▶ Iniciar bloco</button>
          <button class="secondary" onclick="Focus.resetBlock()">Zerar</button>
          <button class="ghost" onclick="Focus.toggleMotion()">${Storage.getSetting("animations") ? "Reduzir animações" : "Ativar animações"}</button>
          <button class="ghost" onclick="Focus.toggleSound()">${Storage.getSetting("sound") ? "Som: ligado" : "Som: desligado"}</button>
        </div>
        <div id="focusBlockDone" class="hidden"></div>
        ${resume ? '<div class="small muted">Retomamos o tempo e a etapa da sua última sessão nesta aula.</div>' : ""}
      </div>

      <div class="focus-main">
        <nav class="focus-rail" aria-label="Etapas da aula">${STEPS.map((s, i) => `<button class="${i === session.step ? "active" : ""} ${session.done[s.key] ? "done" : ""}" onclick="Focus.goToStep(${i})" aria-current="${i === session.step ? "step" : "false"}"><span>${s.icon}</span><small>${s.label}</small></button>`).join("")}</nav>
        ${stepContent(l)}
      </div>

      <div class="focus-panels grid2">
        <div class="card" id="focusGoalsBox"></div>
        <div class="card" id="focusRewardBox"></div>
      </div>
      <div class="card section" id="focusHistoryBox"></div>
      <div class="small muted" style="margin-top:14px">Dica: use <b>F</b> para entrar no modo foco a partir de qualquer página e <b>Esc</b> para sair.</div>
    </div>`;

    updateTimerUI();
    renderPanels();
  }

  function renderStepContent() {
    const l = lesson();
    const host = document.getElementById("focusStepHost");
    if (!l || !host) {
      const card = document.getElementById("focusStepCard");
      if (card && l) card.outerHTML = stepContent(l);
      return;
    }
    host.innerHTML = stepContent(l);
  }

  function renderRail() {
    document.querySelectorAll(".focus-rail button").forEach((b, i) => {
      b.classList.toggle("active", i === session.step);
      b.classList.toggle("done", !!session.done[STEPS[i]?.key]);
      b.setAttribute("aria-current", i === session.step ? "step" : "false");
    });
  }

  function toggleMotion() {
    const v = !Storage.getSetting("animations");
    Storage.setSetting("animations", v);
    document.body.classList.toggle("reduce-motion", !v);
    renderPage(document.getElementById("view"));
    toast(v ? "Animações ativadas." : "Animações reduzidas.");
  }

  function toggleSound() {
    const v = !Storage.getSetting("sound");
    Storage.setSetting("sound", v);
    renderPage(document.getElementById("view"));
    toast(v ? "Som de conclusão ativado." : "Som desligado.");
  }

  function applyPreferences() {
    document.body.classList.toggle("reduce-motion", !Storage.getSetting("animations"));
  }

  function afterRender() {
    if (typeof page === "undefined") return;
    document.body.classList.toggle("focus-active", page === "focus");
    applyPreferences();
  }

  window.Focus = {
    open, openPicker, exit, selectLesson, goToStep, markStep, setBlock, toggleTimer,
    resetBlock, checkMicro, saveExplanation, saveGoals, goReview,
    openFullLesson, goLab, finishLesson, renderPage, afterRender,
    applyPreferences, steps: STEPS, state: session,
    stats, minutesIn
  };
})();

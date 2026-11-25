/* ============================================================
   FORGE — app.js
   Lógica principal da aplicação
   ============================================================ */

function buildAllLessons() {
  let a = [];
  Object.entries(CURRICULUM).forEach(([track, t]) => {
    t.modules.forEach((m, mi) => {
      m.lessons.forEach((l, li) => {
        a.push({ ...l, track, module: mi, lesson: li, id: `${track}-${mi}-${li}`, moduleName: m.name });
      });
    });
  });
  return a;
}

const lessons = buildAllLessons();

function trackProgress(k) {
  const ids = lessons.filter(x => x.track === k).map(x => x.id);
  const done = ids.filter(id => Storage.get().done.includes(id)).length;
  return ids.length ? Math.round(done / ids.length * 100) : 0;
}

function totalDone() {
  return lessons.filter(x => Storage.get().done.includes(x.id)).length;
}

function escHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function toast(s) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = s;
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 2600);
}

let lastFocusedBeforeModal = null;

function closeModal(overlay) {
  if (!overlay || !overlay.parentNode) return;
  overlay.parentNode.removeChild(overlay);
  document.removeEventListener("keydown", modalKeyHandler);
  if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === "function") {
    lastFocusedBeforeModal.focus();
  }
  lastFocusedBeforeModal = null;
}

function modalKeyHandler(e) {
  const overlay = document.querySelector(".modal-overlay");
  if (!overlay) return;
  if (e.key === "Escape") { e.preventDefault(); closeModal(overlay); return; }
  if (e.key !== "Tab") return;
  const focusable = Array.from(overlay.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )).filter(el => el.offsetParent !== null);
  if (!focusable.length) { e.preventDefault(); return; }
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function openModal(html) {
  document.querySelector(".modal-overlay")?.remove();
  lastFocusedBeforeModal = document.activeElement;
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="Janela de diálogo">${html}<div class="actions" style="justify-content:flex-end"><button class="secondary modal-close" style="width:auto">Fechar</button></div></div>`;
  document.body.appendChild(overlay);
  overlay.querySelector(".modal-close").onclick = () => closeModal(overlay);
  overlay.onclick = e => { if (e.target === overlay) closeModal(overlay); };
  document.addEventListener("keydown", modalKeyHandler);
  const first = overlay.querySelector("button, input, select, textarea, [href]");
  if (first && typeof first.focus === "function") first.focus();
}

window.openModal = openModal;

function renderMath() {
  const el = document.getElementById("view");
  if (!el || typeof renderMathInElement !== "function") return;
  try {
    renderMathInElement(el, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
      throwOnError: false
    });
  } catch (e) {
    console.warn("KaTeX render skipped:", e);
  }
}

function render() {
  const s = Storage.get();
  document.documentElement.dataset.theme = s.theme;
  const todayEl = document.getElementById("today");
  if (todayEl) todayEl.textContent = new Date().toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });

  const titleMap = {
    dashboard: "Painel geral",
    tracks: "Trilhas e aulas",
    lesson: "Aula",
    focus: "Modo foco",
    plan: "Meu plano de formação",
    lab: "Laboratórios",
    review: "Revisão espaçada",
    mistakes: "Caderno de erros",
    feynman: "Técnica Feynman",
    library: "Biblioteca",
    projects: "Projetos integradores",
    settings: "Progresso e backup"
  };

  const pageTitle = document.getElementById("pageTitle");
  if (pageTitle && page) pageTitle.textContent = titleMap[page] || page;

  const navBtns = document.querySelectorAll("#nav button[data-page]");
  navBtns.forEach(b => b.classList.toggle("active", b.dataset.page === page));

  const v = document.getElementById("view");
  if (!v) return;

  const renderers = {
    dashboard: dashboardPage,
    tracks: tracksPage,
    lesson: renderLesson,
    focus: v => { if (typeof Focus !== "undefined") Focus.renderPage(v); },
    plan: v => { if (typeof Plan !== "undefined") Plan.renderPage(v); },
    lab: labPage,
    review: reviewPage,
    mistakes: mistakesPage,
    feynman: feynmanPage,
    library: libraryPage,
    projects: projectsPage,
    settings: settingsPage
  };

  if (renderers[page]) renderers[page](v);
  renderMath();
  if (typeof Gamification !== "undefined") Gamification.afterRender();
  if (typeof Focus !== "undefined") Focus.afterRender();
  if (page === "lab" && labTab === "math" && typeof Features !== "undefined" && typeof mentalGame !== "undefined" && !mentalGame.running) {
    Features.startMentalQuestion();
  }
  if (typeof Features !== "undefined") Features.updateTimerUI();
}

let page = "dashboard";
let currentLesson = null;
let labTab = "linux";
let reviewIndex = 0;

function dashboardPage(v) {
  const s = Storage.get();
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const startStr = weekStart.toISOString().slice(0, 10);
  const wk = Object.entries(s.dayLog || {})
    .filter(([d]) => d >= startStr)
    .reduce((acc, [, h]) => acc + h, 0);

  v.innerHTML = `
<div class="eyebrow">Seu espaço de aprendizagem</div>
<h1 class="h1">Construa domínio, uma sessão por vez.</h1>
<p class="sub">Estude com intenção, pratique, registre erros e revise. O progresso fica salvo neste navegador.</p>

<div class="card section focus-hero">
  <div>
    <div class="eyebrow">Estudar com intenção</div>
    <h2 style="margin:4px 0 6px">Modo foco: uma etapa por vez</h2>
    <p class="muted">Oito passos curtos, timer de blocos, pausa quando precisar e retomada de onde parou. Ideal para sessões de 5 a 25 minutos.</p>
  </div>
  <div class="actions">
    <button onclick="Focus.open(nextLessonId(),'dashboard')">▶ Iniciar modo foco</button>
    <button class="secondary" onclick="Focus.openPicker()">Escolher aula</button>
  </div>
</div>

${typeof Gamification !== "undefined" ? Gamification.dashboardWidgets() : ""}

<div class="actions" style="margin-bottom:16px;flex-wrap:wrap">
  <button onclick="Features.openPlacementTest()">◈ Teste de nivelamento</button>
  <button onclick="Features.openPeriodicExam()">✍ Prova periódica</button>
  <button onclick="Features.openTrackExam()">🎯 Prova por disciplina</button>
  ${s.placementDone ? `<span class="pill">Nivelamento concluído · ${s.placementResult?.percentage ?? 0}%</span>` : ""}
</div>

<div class="grid2">
  ${Features.timerWidget()}
  <div class="card">
    <h2>Seu ritmo</h2>
    <p class="muted">Use o cronômetro para registrar sessões de estudo. O tempo aparece nas estatísticas abaixo.</p>
    <canvas id="hoursChart" role="img" aria-label="Gráfico das horas de estudo dos últimos 14 dias" style="width:100%;height:200px"></canvas>
  </div>
</div>

<div class="grid">
  <div class="card">
    <div class="muted small">Aulas concluídas</div>
    <div class="stat">${totalDone()} <span class="muted small">/ ${lessons.length}</span></div>
    <div class="bar"><i style="width:${totalDone() / lessons.length * 100}%"></i></div>
  </div>
  <div class="card">
    <div class="muted small">Sequência atual</div>
    <div class="stat">${s.streak || 0} <span class="small muted">dias</span></div>
    <div class="small muted">Registre uma sessão por dia.</div>
  </div>
  <div class="card">
    <div class="muted small">Horas registradas</div>
    <div class="stat">${s.hours.toFixed(1)}h</div>
    <div class="small muted">Tempo total de estudo.</div>
  </div>
  <div class="card">
    <div class="muted small">Meta semanal</div>
    <div class="stat">${wk.toFixed(1)}<span class="small muted"> / ${s.weeklyGoal}h</span></div>
    <div class="bar"><i style="width:${Math.min(100, wk / s.weeklyGoal * 100)}%"></i></div>
  </div>
</div>

<div class="section">
  <h2>Progresso por matéria</h2>
  <div class="grid">
    ${Object.entries(CURRICULUM).map(([k, t]) => `
      <div class="card">
        <div class="row">
          <strong>${t.icon} ${t.name}</strong><span class="pill">${trackProgress(k)}%</span>
        </div>
        <div class="bar"><i style="width:${trackProgress(k)}%"></i></div>
        <div class="small muted">${lessons.filter(x => x.track === k && s.done.includes(x.id)).length} de ${lessons.filter(x => x.track === k).length} aulas concluídas</div>
        <button class="secondary" style="margin-top:12px" onclick="openTrack('${k}')">Continuar trilha</button>
      </div>
    `).join("")}
  </div>
</div>

<div class="grid2">
  <div class="card">
    <div class="row"><h2>Próxima aula</h2><span class="pill">Recomendado</span></div>
    ${nextLessonHTML()}
  </div>
  <div class="card">
    <h2>Plano para hoje</h2>
    <p class="muted">Rotina sugerida: 10 min revisão, 25 min teoria, 20 min prática, 5 min registro.</p>
    <label class="small muted" for="hoursInput">Quanto tempo estudou hoje (horas)</label>
    <input class="field" id="hoursInput" type="number" min="0.1" max="12" step="0.1" value="1" aria-label="Horas estudadas hoje">
    <button style="margin-top:9px" onclick="logHours()">Registrar sessão</button>
  </div>
</div>

<div class="card section">
  <h2>Progresso por trilha</h2>
  <canvas id="progressChart" role="img" aria-label="Gráfico de progresso percentual por trilha" style="width:100%;height:260px"></canvas>
</div>`;
  setTimeout(refreshCharts, 0);
}

function nextLessonId() {
  const s = Storage.get();
  const l = lessons.find(x => !s.done.includes(x.id));
  return l ? l.id : (lessons[0] ? lessons[0].id : null);
}

function nextLessonHTML() {
  const s = Storage.get();
  let l = lessons.find(x => !s.done.includes(x.id));
  if (l) {
    return `<p><strong>${CURRICULUM[l.track].name} · ${l.moduleName}</strong></p>
      <p>${l.title}</p>
      <button onclick="openLesson('${l.id}')">Abrir aula</button>`;
  }
  return "<p>Trilhas concluídas! Continue com os projetos integradores.</p>";
}

function logHours() {
  const n = Number(document.getElementById("hoursInput").value);
  if (!(n > 0 && n <= 12)) return toast("Informe entre 0,1 e 12 horas.");
  if (!Storage.addHours(n)) return toast("Não foi possível registrar a sessão.");
  toast("Sessão registrada.");
  render();
}

function openTrack(k) {
  page = "tracks";
  render();
  setTimeout(() => {
    const el = document.getElementById("track-" + k);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, 50);
}

function tracksPage(v) {
  const s = Storage.get();
  v.innerHTML = `
<div class="eyebrow">Currículo progressivo</div>
<h1 class="h1">Trilhas e aulas</h1>
<p class="sub">Aulas numeradas em sequência. A próxima aula fica disponível ao concluir a anterior; você também pode tentar uma prova de avanço.</p>
<div class="actions">
  <input class="field" id="lessonSearch" placeholder="Buscar aula, assunto ou matéria..." oninput="filterLessons(this.value)">
  <button onclick="cumulativeExam()">Prova cumulativa</button>
  <button class="secondary" onclick="Features.openTrackExam()">Prova por disciplina</button>
</div>
<div id="lessonList">
  ${Object.entries(CURRICULUM).map(([k, t]) => `
    <div class="section track-card" id="track-${k}" data-track="${k}">
      <div class="row"><span class="track-icon" aria-hidden="true">${t.icon}</span><h2>${t.name}</h2><span class="pill">${trackProgress(k)}% concluído</span></div>
      <div class="bar"><i style="width:${trackProgress(k)}%"></i></div>
      ${t.modules.map((m, mi) => `
        <h3 class="muted">${mi + 1}. ${m.name}</h3>
        ${m.lessons.map((l, li) => {
          const id = `${k}-${mi}-${li}`;
          const idx = lessons.findIndex(x => x.id === id);
          const prevDone = idx === 0 || lessons[idx - 1].track !== k || s.done.includes(lessons[idx - 1].id);
          const done = s.done.includes(id);
          return `
          <div class="lesson ${!prevDone && !done ? "locked" : ""}" data-search="${(t.name + " " + m.name + " " + l.title).toLowerCase()}">
            <div class="icon">${done ? "✅" : prevDone ? "📘" : "🔒"}</div>
            <div class="grow">
              <h3>${idx + 1}. ${l.title}</h3>
              <p>${l.objective}</p>
              <span class="pill">${done ? "Concluída" : prevDone ? "Disponível" : "Bloqueada"}</span>
            </div>
            <button ${!prevDone && !done ? "disabled" : ""} onclick="openLesson('${id}')">${done ? "Revisar" : "Estudar"}</button>
            <button class="secondary" ${!prevDone && !done ? "disabled" : ""} onclick="Focus.open('${id}','tracks')">◉ Foco</button>
            ${!prevDone && !done ? `<button class="ghost" onclick="proofUnlock('${id}')">Pular com prova</button>` : ""}
          </div>`;
        }).join("")}
      `).join("")}
    </div>
  `).join("")}
</div>`;
}

function filterLessons(q) {
  const qs = q.toLowerCase();
  document.querySelectorAll(".lesson").forEach(el => {
    el.classList.toggle("hidden", !el.dataset.search.includes(qs));
  });
}

function cumulativeExam() {
  return Features.openPeriodicExam();
}

function legacyCumulativeExam() {
  const s = Storage.get();
  const pool = lessons.filter(x => s.done.includes(x.id));
  if (pool.length < 4) {
    toast("Conclua pelo menos 4 aulas para liberar a prova cumulativa.");
    return;
  }

  const qs = [];
  pool.slice(-5).forEach(l => {
    l.exercises.slice(7, 10).forEach(q => {
      qs.push({ q: q[0], a: q[1], opts: q.slice(1), lesson: l.id });
    });
  });

  qs.sort(() => Math.random() - 0.5).slice(0, 5);

  let score = 0;
  for (let i = 0; i < qs.length; i++) {
    const ans = prompt(`Prova cumulativa ${i + 1}/${qs.length}: ${qs[i].q}\nA) ${qs[i].opts[0]}\nB) ${qs[i].opts[1]}\n\nDigite A ou B:`);
    if (ans && ans.trim().toUpperCase() === "A") score++;
  }

  toast(`Prova concluída: ${score}/${qs.length}.`);
  if (score < 4) {
    qs.forEach(q => {
      if (!s.mistakes.some(m => m.question === q.q)) {
        s.mistakes.push({ lesson: q.lesson, track: q.lesson.split("-")[0], question: q.q, answer: q.a, date: new Date().toISOString() });
      }
    });
    Storage.save();
  }
}

function openLesson(id) {
  const l = lessons.find(x => x.id === id);
  if (!l) return;
  currentLesson = l;
  page = "lesson";
  renderLesson();
}

function renderLesson() {
  const l = currentLesson;
  const s = Storage.get();
  const done = s.done.includes(l.id);
  document.getElementById("pageTitle").textContent = "Aula";
  const v = document.getElementById("view");

  v.innerHTML = `
<div class="row" style="justify-content:space-between;gap:10px;flex-wrap:wrap">
  <button class="ghost" onclick="page='tracks';render()">← Voltar às trilhas</button>
  <button onclick="Focus.open('${l.id}','lesson')">◉ Estudar no modo foco</button>
</div>
<div class="eyebrow" style="margin-top:20px">${CURRICULUM[l.track].name} · ${l.moduleName}</div>
<h1 class="h1">${l.title}</h1>
<div class="grid2">
  <div class="card"><b>Objetivo</b><p>${l.objective}</p></div>
  <div class="card"><b>Pré-requisitos</b><p>${l.prereq}</p></div>
</div>

<div class="section card prose">
  <h2>1. Intuição</h2><p>${l.intuition}</p>
  <h2>2. Explicação conceitual</h2><p>${l.explain}</p>
  <h2>3. Exemplos resolvidos</h2>
  ${l.examples.map((e, i) => `<div class="callout"><b>Exemplo ${i + 1}: ${e[0]}</b><p>${e[1]}</p></div>`).join("")}
  <h2>4. Erros comuns</h2>
  <ul>${l.errors.map(e => `<li>${e}</li>`).join("")}</ul>
  <h2>5. Mini-laboratório</h2><div class="callout">${l.lab}</div>
  <h2>6. Referência</h2><p>${l.reference}</p>
</div>

<div class="card section">
  <h2>7. Exercícios — 10 questões</h2>
  <p class="muted small">Responda antes de revelar a solução. Questões erradas entram no caderno de erros.</p>
  <div id="exerciseList">
    ${l.exercises.map((q, i) => `
      <div class="q" id="q-${i}">
        <p><span class="pill">${i < 3 ? "Nível 1 · Fundamentos" : i < 7 ? "Nível 2 · Aplicação" : "Nível 3 · Desafio"}</span> ${i + 1}. ${q[0]}</p>
        <div class="row" style="justify-content:flex-start;flex-wrap:wrap">
          ${q.slice(1).map((a, j) => `<label class="check"><input type="radio" name="q${i}" value="${j}"> ${a}</label>`).join("")}
        </div>
        <div class="feedback" id="fb-${i}"></div>
      </div>
    `).join("")}
  </div>
  <div class="actions">
    <button onclick="gradeLesson()">Corrigir exercícios</button>
    <button class="secondary" onclick="revealAnswers()">Revelar soluções</button>
  </div>
  <div id="scoreBox"></div>
</div>

<div class="card section">
  <h2>8. Técnica Feynman</h2>
  <p class="muted">Explique o conceito principal com suas palavras, como se estivesse ensinando a uma pessoa iniciante.</p>
  <textarea class="field" id="feynmanText" placeholder="Minha explicação...">${(s.feynman[l.id] || "").replace(/</g, "&lt;")}</textarea>
  <div class="actions"><button class="secondary" onclick="saveFeynman('${l.id}')">Salvar explicação</button></div>
</div>

<div class="actions">
  <button onclick="completeLesson('${l.id}')">${done ? "Aula já concluída" : "Marcar aula como concluída"}</button>
  <button class="secondary" onclick="addStudyCards('${l.track}')">Adicionar flashcards da matéria</button>
</div>`;
  renderMath();
}

function gradeLesson() {
  const l = currentLesson;
  const s = Storage.get();
  let score = 0;

  l.exercises.forEach((q, i) => {
    const sel = document.querySelector(`input[name="q${i}"]:checked`);
    const fb = document.getElementById("fb-" + i);
    if (!sel) {
      fb.textContent = "Não respondida. Resposta correta: " + q[1];
      fb.className = "feedback muted";
      return;
    }
    const ok = Number(sel.value) === 0;
    if (ok) {
      score++;
      fb.textContent = "Correto. " + q[1];
      fb.className = "feedback good";
    } else {
      fb.textContent = "Ainda não. Resposta esperada: " + q[1] + ". Revise a explicação.";
      fb.className = "feedback bad";
      Storage.addMistake(l.id, l.track, q[0], q[1]);
    }
  });

  if (!s.assessments || typeof s.assessments !== "object") s.assessments = {};
  const rec = s.assessments[l.id] || { best: 0, attempts: 0, lastAt: null };
  rec.attempts = (Number(rec.attempts) || 0) + 1;
  rec.best = Math.max(Number(rec.best) || 0, score);
  rec.lastAt = new Date().toISOString();
  s.assessments[l.id] = rec;

  document.getElementById("scoreBox").innerHTML = `
    <div class="callout"><b>Resultado: ${score}/10</b><p>${score >= 8 ? "Bom domínio inicial. Explique o raciocínio sem consultar o texto." : "Revise os conceitos e tente novamente."}</p>
    <p class="small muted">Melhor resultado nesta aula: ${rec.best}/10 · ${rec.attempts} ${rec.attempts === 1 ? "tentativa" : "tentativas"} registrada${rec.attempts === 1 ? "" : "s"}.</p></div>`;
  Storage.save();
  const alreadyAwarded = (s.xpLog || []).some(x => String(x.reason).startsWith("Exercícios") || String(x.reason).includes(`sem consulta em ${l.id}`));
  if (score >= 8 && !alreadyAwarded) {
    const result = Storage.awardXP(40, `Exercícios ${score}/10 sem consulta em ${l.id}`);
    toast(result.leveledUp ? `+40 XP · Nível ${result.level} alcançado.` : "+40 XP por domínio ≥ 80%.");
  }
}

function revealAnswers() {
  currentLesson.exercises.forEach((q, i) => {
    const fb = document.getElementById("fb-" + i);
    fb.textContent = "Resposta: " + q[1] + " | Justificativa: " + currentLesson.explain;
    fb.className = "feedback muted";
  });
}

function completeLesson(id) {
  const s = Storage.get();
  if (!s.done.includes(id)) {
    s.done.push(id);
    Storage.save();
    toast("Aula concluída. Próxima aula liberada.");
  }
  page = "tracks";
  render();
}

function proofUnlock(id) {
  const l = lessons.find(x => x.id === id);
  const ans = prompt("Prova de avanço: explique em pelo menos 2 frases o que você já sabe sobre: " + l.title);
  if (ans && ans.trim().length >= 80) {
    const s = Storage.get();
    s.done.push(id);
    Storage.save();
    toast("Prova registrada como autoavaliação.");
    page = "tracks";
    render();
  } else {
    toast("Resposta muito curta. Escreva pelo menos 80 caracteres.");
  }
}

function saveFeynman(id) {
  const s = Storage.get();
  s.feynman[id] = document.getElementById("feynmanText").value;
  Storage.save();
  toast("Explicação salva.");
}

function addStudyCards(k) {
  toast("Flashcards de " + CURRICULUM[k].name + " estão na revisão espaçada.");
  page = "review";
  render();
}

// Navigation handlers
document.getElementById("nav").addEventListener("click", e => {
  const b = e.target.closest("button[data-page]");
  if (!b) return;
  page = b.dataset.page;
  document.getElementById("sidebar").classList.remove("open");
  render();
});

document.getElementById("themeBtn").onclick = () => {
  const s = Storage.get();
  const theme = s.theme === "dark" ? "light" : "dark";
  Storage.setTheme(theme);
  render();
};

document.getElementById("menuBtn").onclick = () => {
  document.getElementById("sidebar").classList.toggle("open");
};

function labPage(v) {
  const s = Storage.get();
  v.innerHTML = `
<div class="eyebrow">Aprender fazendo</div>
<h1 class="h1">Laboratórios</h1>
<p class="sub">Ambientes didáticos locais. O terminal é uma simulação segura; o código C pode ser compilado no seu Linux real.</p>
<div class="tabs">
  <button class="${labTab === "linux" ? "active" : ""}" onclick="labTab='linux';render()">🐧 Linux</button>
  <button class="${labTab === "c" ? "active" : ""}" onclick="labTab='c';render()">Ｃ C</button>
  <button class="${labTab === "math" ? "active" : ""}" onclick="labTab='math';render()">∑ Matemática</button>
  <button class="${labTab === "eng" ? "active" : ""}" onclick="labTab='eng';render()">⚙ Engenharia</button>
  <button class="${labTab === "net" ? "active" : ""}" onclick="labTab='net';render()">🌐 Redes</button>
  <button class="${labTab === "db" ? "active" : ""}" onclick="labTab='db';render()">🗄️ Banco de dados</button>
</div>
${labTab === "linux" ? linuxLab()
  : labTab === "c" ? cLab()
  : labTab === "math" ? mathLab()
  : labTab === "eng" ? engLab()
  : labTab === "net" && typeof ExtraLabs !== "undefined" ? ExtraLabs.networkLab()
  : labTab === "db" && typeof ExtraLabs !== "undefined" ? ExtraLabs.dbLab()
  : engLab()}`;
}

function linuxLab() {
  return `
<div class="grid2">
  <div class="card">
    <h2>Terminal simulado</h2>
    <p class="small muted">Sistema de arquivos falso. Não acessa seu computador.</p>
    <div class="terminal" id="termOut">${terminalOutput.join("\n")}</div>
    <div class="termline"><span>aluno@forge:${terminalCwd}$</span><input id="termInput" placeholder="Digite um comando..." onkeydown="if(event.key==='Enter')runTerm()"></div>
    <div class="actions"><button onclick="runTerm()">Executar</button><button class="secondary" onclick="terminalOutput=[];render()">Limpar</button></div>
  </div>
  <div class="card">
    <h2>Desafio Bandit 0</h2>
    <p>Objetivo: encontrar a mensagem de boas-vindas na pasta pessoal.</p>
    <ol><li>Descubra onde você está.</li><li>Liste os arquivos.</li><li>Leia boas-vindas.txt.</li></ol>
    <p class="small muted">Validação automática: o comando cat /home/aluno/boas-vindas.txt ou a sequência pwd, ls, cat.</p>
    <button onclick="checkLinuxChallenge()">Validar desafio</button>
    <div id="linuxFeedback" class="small"></div>
    <h3>Comandos para praticar</h3>
    <code>pwd · ls -la · cd documentos · cat tarefas.txt · grep Linux linux.txt · wc -l notas.txt</code>
  </div>
</div>`;
}

let terminalCwd = "/home/aluno";
let terminalOutput = ["Forge Linux Lab v1.0", "Ambiente simulado e isolado. Digite help para comandos."];

const fs = {
  "/": { type: "dir", items: ["home", "etc", "var"] },
  "/home": { type: "dir", items: ["aluno"] },
  "/home/aluno": { type: "dir", items: ["documentos", "notas.txt", "boas-vindas.txt", "relatorio.txt"] },
  "/home/aluno/documentos": { type: "dir", items: ["tarefas.txt", "linux.txt"] },
  "/home/aluno/notas.txt": { type: "file", content: "Estudar Linux\nPraticar C\nRevisar matemática\nConstruir software" },
  "/home/aluno/boas-vindas.txt": { type: "file", content: "Bem-vindo ao laboratório Linux!\nUse ls, cd, cat, grep, pwd, mkdir, touch e help." },
  "/home/aluno/relatorio.txt": { type: "file", content: "Status: em andamento\nPrioridade: alta\nAssunto: Linux" },
  "/home/aluno/documentos/tarefas.txt": { type: "file", content: "1. Aprender terminal\n2. Praticar pipes\n3. Revisar permissões" },
  "/home/aluno/documentos/linux.txt": { type: "file", content: "Linux usa kernel, processos, arquivos e permissões." },
  "/etc": { type: "dir", items: ["hostname", "os-release"] },
  "/etc/hostname": { type: "file", content: "forge-lab" },
  "/etc/os-release": { type: "file", content: "NAME=Forge Linux Lab\nVERSION=1.0" },
  "/var": { type: "dir", items: ["log"] },
  "/var/log": { type: "dir", items: ["syslog"] },
  "/var/log/syslog": { type: "file", content: "INFO boot complete\nWARN disk usage normal\nINFO ssh service ready\nERROR sample demonstration only" }
};

function norm(p) {
  if (!p) return terminalCwd;
  let s = p.startsWith("/") ? p : terminalCwd + "/" + p;
  let parts = [];
  s.split("/").forEach(x => {
    if (!x || x === ".") return;
    if (x === "..") parts.pop();
    else parts.push(x);
  });
  return "/" + parts.join("/");
}

function term(cmd) {
  const raw = cmd.trim();
  if (!raw) return "";
  let parts = raw.match(/"[^"]*"|'[^']*'|\S+/g) || [];
  parts = parts.map(x => x.replace(/^["']|["']$/g, ""));
  let [c, ...args] = parts;
  const path = x => norm(x || terminalCwd);
  let out = "";

  if (raw.includes("|")) {
    const ps = raw.split("|").map(x => x.trim());
    let data = "";
    for (let j = 0; j < ps.length; j++) {
      let pp = ps[j].match(/"[^"]*"|'[^']*'|\S+/g) || [];
      pp = pp.map(x => x.replace(/^["']|["']$/g, ""));
      let cc = pp[0], aa = pp.slice(1);
      if (j === 0) {
        if (cc === "cat") {
          let f = fs[path(aa[0])];
          data = f?.type === "file" ? f.content : "cat: arquivo não encontrado";
        } else if (cc === "echo") data = aa.join(" ");
        else data = term(ps[j]);
      } else if (cc === "grep") {
        let pat = aa[0] || "";
        data = data.split("\n").filter(x => x.toLowerCase().includes(pat.toLowerCase())).join("\n");
      } else if (cc === "wc" && aa[0] === "-l") data = String(data ? data.split("\n").length : 0);
      else if (cc === "sort") data = data.split("\n").sort().join("\n");
      else data = "Pipe: filtro não suportado: " + cc;
    }
    return data;
  }

  if (c === "help") out = `Comandos disponíveis no simulador:
  Arquivos: pwd, ls [-la], cd, cat, mkdir, touch, rm, rmdir, cp, mv, chmod, chown, find, stat, file, ln, tee, uniq, rev
  Texto: grep, head, tail, nl, wc, sort, seq
  Processos: ps, top, pgrep, kill, systemctl, journalctl
  Rede: ip, ss, ping, ssh, getent
  Sistema: whoami, id, uname [-a], date, uptime, free, df, du, env, which, man, sudo
  Utilitários: echo, tar, gzip, gunzip, expr, bc, basename, dirname, history, clear, help
  Pipe suportado: cat arquivo | grep termo`;
  else if (c === "pwd") out = terminalCwd;
  else if (c === "clear") { terminalOutput = []; return ""; }
  else if (c === "ls") {
    let p = args.find(x => !x.startsWith("-")) || ".";
    let n = path(p), f = fs[n];
    if (!f || f.type !== "dir") out = "ls: não é um diretório";
    else out = f.items.filter(x => args.includes("-a") || args.includes("-la") || !x.startsWith(".")).join("  ");
  }
  else if (c === "cd") {
    let n = path(args[0] || "/home/aluno");
    if (fs[n]?.type === "dir") terminalCwd = n;
    else out = "cd: diretório não encontrado: " + (args[0] || "");
  }
  else if (c === "cat") {
    let f = fs[path(args[0])];
    out = f?.type === "file" ? f.content : "cat: arquivo não encontrado";
  }
  else if (c === "grep") {
    let pat = args[0] || "", f = fs[path(args[1])];
    out = f?.type === "file" ? f.content.split("\n").filter(x => x.toLowerCase().includes(pat.toLowerCase())).join("\n") : "grep: arquivo não encontrado";
  }
  else if (c === "wc" && args[0] === "-l") {
    let f = fs[path(args[1])];
    out = f?.type === "file" ? String(f.content.split("\n").length) : "wc: arquivo não encontrado";
  }
  else if (c === "mkdir") {
    let n = path(args[0]);
    if (fs[n]) out = "mkdir: já existe";
    else {
      fs[n] = { type: "dir", items: [] };
      let par = fs[n.slice(0, n.lastIndexOf("/")) || "/"];
      if (par?.type === "dir") par.items.push(n.split("/").pop());
      out = "Diretório criado: " + n;
    }
  }
  else if (c === "touch") {
    let n = path(args[0]);
    if (!fs[n]) {
      fs[n] = { type: "file", content: "" };
      let par = fs[n.slice(0, n.lastIndexOf("/")) || "/"];
      if (par?.type === "dir") par.items.push(n.split("/").pop());
    }
    out = "";
  }
  else if (c === "chmod") {
    let n = path(args[1]);
    if (args.length < 2) out = "uso: chmod MODO ARQUIVO";
    else if (!fs[n]) out = "chmod: arquivo não encontrado";
    else { fs[n].mode = args[0]; out = "Permissões simuladas atualizadas: " + args[0] + " " + args[1]; }
  }
  else if (c === "chown") {
    if (args.length < 2) out = "uso: chown USUARIO:GRUPO ARQUIVO";
    else if (!fs[path(args[1])]) out = "chown: arquivo não encontrado";
    else { fs[path(args[1])].owner = args[0]; out = "Proprietário simulado alterado: " + args[0]; }
  }
  else if (c === "whoami") out = "aluno";
  else if (c === "id") out = "uid=1000(aluno) gid=1000(aluno) groups=1000(aluno),27(sudo)";
  else if (c === "uname") out = args.includes("-a") ? "Linux forge-lab 6.1.0-forge #1 SMP x86_64 GNU/Linux" : "Linux";
  else if (c === "date") out = new Date().toLocaleString("pt-BR");
  else if (c === "uptime") out = " 10:32:01 up 2 days,  3:14,  1 user,  load average: 0.12, 0.08, 0.03";
  else if (c === "echo") out = args.join(" ");
  else if (c === "head" || c === "tail") {
    let f = fs[path(args[args.length - 1])];
    if (f?.type !== "file") out = `${c}: arquivo não encontrado`;
    else {
      let lines = f.content.split("\n");
      let n = 10;
      let ni = args.findIndex(x => x === "-n");
      if (ni >= 0) n = Number(args[ni + 1]) || 10;
      out = c === "head" ? lines.slice(0, n).join("\n") : lines.slice(-n).join("\n");
    }
  }
  else if (c === "nl") {
    let f = fs[path(args[0])];
    out = f?.type === "file" ? f.content.split("\n").map((l, i) => `${String(i + 1).padStart(6)}  ${l}`).join("\n") : "nl: arquivo não encontrado";
  }
  else if (c === "wc") {
    let f = fs[path(args[args.length - 1])];
    out = f?.type === "file" ? `${f.content.split("\n").length} ${f.content.split(/\s+/).filter(Boolean).length} ${f.content.length}` : "wc: arquivo não encontrado";
  }
  else if (c === "find") {
    let base = args.find(x => !x.startsWith("-")) || ".";
    let pat = args.find(x => x.startsWith("-name")) ? args[args.indexOf("-name") + 1] : null;
    let root = path(base);
    let found = [];
    const walk = p => {
      const d = fs[p];
      if (!d) return;
      if (d.type === "dir") d.items.forEach(n => walk(p === "/" ? "/" + n : p + "/" + n));
      else if (!pat || n_match(p.split("/").pop(), pat)) found.push(p);
    };
    function n_match(s, p) { const re = new RegExp("^" + p.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$", "i"); return re.test(s); }
    walk(root);
    out = found.join("\n") || "(nenhum resultado)";
  }
  else if (c === "du" || c === "df") {
    out = c === "df"
      ? "Sistema de arquivos  Tamanho  Usado  Disp.  Uso%  Montado em\n/dev/sda1            20G      7,4G   12G   39%   /\ntmpfs                 1,9G     0      1,9G   0%    /dev/shm"
      : "4,0K\t/home/aluno/documentos\n4,0K\t/home/aluno\n8,0K\t/";
  }
  else if (c === "free") out = "              total        used        free      shared  buff/cache   available\nMem:           7,7Gi       1,2Gi       4,1Gi       120Mi       2,4Gi       6,0Gi\nSwap:          2,0Gi          0B       2,0Gi";
  else if (c === "ps") out = "  PID TTY          TIME CMD\n    1 ?        00:00:03 systemd\n  412 pts/0    00:00:00 bash\n  889 pts/0    00:00:00 ps\n 1204 ?        00:01:12 sshd";
  else if (c === "top") out = "top - 10:32:01 up  2:03,  1 user,  load average: 0,12, 0,08, 0,03\nTarefas: 128 total,  1 em execução, 127 dormindo\n%Cpu(s):  2,3 us,  0,7 sy,  0,0 ni, 96,8 id\n  PID USER      PR  NI  %CPU %MEM    TEMPO+ COMANDO\n 1204 root      20   0  0,7  1,2   1:12.44 sshd\n  412 aluno     20   0  0,1  0,4   0:00.21 bash";
  else if (c === "pgrep") out = args[0] === "sshd" ? "1204" : "(nenhum processo encontrado)";
  else if (c === "kill") out = args[0] === "-9" ? "Sinal SIGKILL enviado (simulação)." : "Sinal SIGTERM enviado (simulação).";
  else if (c === "systemctl") {
    if (args[0] === "status") out = `● ${args[1] || "ssh"}.service - Serviço simulado\n   Carregado: loaded (/etc/systemd/system/${args[1] || "ssh"}.service)\n   Ativo: active (running) desde Seg 2026-11-24 08:00:00 UTC\n   PID: 1204`;
    else if (args[0] === "list-units") out = "ssh.service       active running\ncron.service      active running\nnginx.service     inactive dead";
    else out = `systemctl: operação '${args[0] || ""}' simulada para ${args[1] || "serviço"}.`;
  }
  else if (c === "journalctl") out = "nov 24 08:00:01 forge-lab systemd[1]: Iniciando ssh.service.\nnov 24 08:00:02 forge-lab sshd[1204]: Server listening on 0.0.0.0 port 22.\nnov 24 09:14:33 forge-lab cron[330]: (aluno) CMD (/usr/bin/backup.sh)";
  else if (c === "ip") out = args[0] === "addr" ? "2: enp0s3: <BROADCAST,MULTICAST,UP> mtu 1500\n    inet 192.168.1.42/24 brd 192.168.1.255 scope global enp0s3\n    link/ether 08:00:27:aa:bb:cc" : "default via 192.168.1.1 dev enp0s3";
  else if (c === "ss") out = "State    Recv-Q Send-Q  Local Address:Port   Peer Address:Port\nLISTEN   0      128     0.0.0.0:22            0.0.0.0:*\nLISTEN   0      128     127.0.0.1:5432        0.0.0.0:*";
  else if (c === "ping") out = `PING ${args[0] || "8.8.8.8"} (${args[0] || "8.8.8.8"}) 56(84) bytes of data.\n64 bytes from ${args[0] || "8.8.8.8"}: icmp_seq=1 ttl=117 time=18.4 ms\n64 bytes from ${args[0] || "8.8.8.8"}: icmp_seq=2 ttl=117 time=17.9 ms\n--- ${args[0] || "8.8.8.8"} ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss`;
  else if (c === "getent") out = args[0] === "passwd" ? "root:x:0:0:root:/root:/bin/bash\naluno:x:1000:1000:Aluno:/home/aluno:/bin/bash" : "forge-lab";
  else if (c === "ssh") out = `Conectando a ${args[0] || "servidor"}... (simulação)\nAutenticação concluída. Sessão remota simulada.`;
  else if (c === "sudo") out = args.length ? term(args.join(" ")) : "uso: sudo COMANDO";
  else if (c === "tar") out = "Arquivo tar simulado criado/extraído: " + (args[args.length - 1] || "arquivo.tar");
  else if (c === "gzip" || c === "gunzip") out = "Compactação simulada concluída: " + (args[0] || "arquivo");
  else if (c === "env" || c === "printenv") out = "HOME=/home/aluno\nUSER=aluno\nSHELL=/bin/bash\nPATH=/usr/local/bin:/usr/bin:/bin\nPWD=" + terminalCwd;
  else if (c === "which") out = ["pwd","ls","cd","cat","grep","wc","mkdir","touch","chmod","ps","ssh","sudo","tar"].includes(args[0]) ? "/usr/bin/" + args[0] : args[0] + " não encontrado";
  else if (c === "man") out = `Manual simulado: ${args[0] || "comando"}\nNOME\n    ${args[0] || "comando"} - use "help" para a lista de comandos do simulador.`;
  else if (c === "history") out = terminalOutput.filter(x => x.includes("$ ")).map((x, i) => `${i + 1}  ${x.split("$ ")[1]}`).join("\n") || "(histórico vazio)";
  else if (c === "rm" || c === "rmdir") {
    let n = path(args.find(x => !x.startsWith("-")));
    if (!fs[n]) out = `${c}: arquivo não encontrado`;
    else {
      delete fs[n];
      let par = fs[n.slice(0, n.lastIndexOf("/")) || "/"];
      if (par?.items) par.items = par.items.filter(x => x !== n.split("/").pop());
      out = `${c}: removido ${n}`;
    }
  }
  else if (c === "cp" || c === "mv") {
    let src = path(args[0]), dst = path(args[1]);
    if (!fs[src]) out = `${c}: origem não encontrada`;
    else {
      fs[dst] = JSON.parse(JSON.stringify(fs[src]));
      if (c === "mv") { delete fs[src]; let par = fs[src.slice(0, src.lastIndexOf("/")) || "/"]; if (par?.items) par.items = par.items.filter(x => x !== src.split("/").pop()); }
      let dp = fs[dst.slice(0, dst.lastIndexOf("/")) || "/"];
      if (dp?.items && !dp.items.includes(dst.split("/").pop())) dp.items.push(dst.split("/").pop());
      out = `${c}: ${src} -> ${dst}`;
    }
  }
  else if (c === "sort") {
    let f = fs[path(args[args.length - 1])];
    out = f?.type === "file" ? f.content.split("\n").sort().join("\n") : "sort: arquivo não encontrado";
  }
  else if (c === "seq") {
    let a, b = 1, z;
    if (args.length === 1) { a = 1; z = Number(args[0]); }
    else if (args.length === 2) { a = Number(args[0]); z = Number(args[1]); }
    else { a = Number(args[0]); b = Number(args[1]); z = Number(args[2]); }
    if (args.length < 3 && z < a) b = -1;
    let arr = [];
    if (b > 0) for (let i = a; i <= z; i += b) arr.push(i);
    else if (b < 0) for (let i = a; i >= z; i += b) arr.push(i);
    out = arr.join("\n");
  }
  else if (c === "expr" || c === "bc") {
    try { out = String(calcEvaluate(args.join(" "))); } catch (e) { out = "expressão inválida"; }
  }
  else if (c === "basename") out = (args[0] || "").split("/").pop();
  else if (c === "dirname") out = (args[0] || "").slice(0, (args[0] || "").lastIndexOf("/")) || ".";
  else if (c === "stat") { let f = fs[path(args[0])]; out = f ? `  Arquivo: ${args[0]}\n  Tamanho: ${f.content?.length || 0}\n  Tipo: ${f.type}\n  Modo: ${f.mode || "0644"}` : "stat: não encontrado"; }
  else if (c === "file") { let f = fs[path(args[0])]; out = f?.type === "file" ? `${args[0]}: texto ASCII` : `${args[0]}: diretório`; }
  else if (c === "ln") out = "Link simbólico simulado criado: " + args.join(" -> ");
  else if (c === "tee") { let f = fs[path(args[0])]; if (f?.type === "file") f.content = args.slice(1).join(" "); out = args.slice(1).join(" "); }
  else if (c === "uniq") { let f = fs[path(args[0])]; out = f?.type === "file" ? [...new Set(f.content.split("\n"))].join("\n") : "uniq: arquivo não encontrado"; }
  else if (c === "rev") { let f = fs[path(args[0])]; out = f?.type === "file" ? f.content.split("\n").map(l => l.split("").reverse().join("")).join("\n") : "rev: arquivo não encontrado"; }
  else out = "Comando não implementado no simulador: " + c + ". Digite help.";
  return out;
}

function runTerm() {
  let inp = document.getElementById("termInput");
  let cmd = inp.value;
  let out = term(cmd);
  terminalOutput.push("aluno@forge:" + terminalCwd + "$ " + cmd);
  if (out) terminalOutput.push(out);
  if (terminalOutput.length > 80) terminalOutput = terminalOutput.slice(-80);
  document.getElementById("termOut").textContent = terminalOutput.join("\n");
  inp.value = "";
  document.querySelector(".termline span").textContent = "aluno@forge:" + terminalCwd + "$";
}

function checkLinuxChallenge() {
  let ok = terminalOutput.some(x => x.includes("Bem-vindo ao laboratório Linux!"));
  if (ok) {
    Storage.toggleLab("linux-bandit-0", true);
    document.getElementById("linuxFeedback").innerHTML = '<span class="good">Desafio validado!</span>';
  } else {
    document.getElementById("linuxFeedback").innerHTML = '<span class="bad">Ainda não. Leia boas-vindas.txt usando cat.</span>';
  }
}

function cLab() {
  return `
<div class="grid2">
  <div class="card">
    <h2>Editor C — rascunho local</h2>
    <textarea class="field" id="cCode" aria-label="Editor de código C" style="min-height:300px;font-family:monospace">#include <stdio.h>

int main(void) {
    int a = 7;
    int b = 5;
    printf("Soma: %d\\n", a + b);
    return 0;
}</textarea>
    <div class="actions"><button onclick="openGodbolt()">Abrir no Compiler Explorer ↗</button><button class="secondary" onclick="copyCode()">Copiar código</button></div>
    <p class="small muted">Este editor não compila C dentro do HTML. Godbolt executa compiladores no serviço externo; não envie dados secretos.</p>
  </div>
  <div class="card">
    <h2>Compile no Linux</h2>
    <div class="code" tabindex="0" role="region" aria-label="Bloco de código">gcc -std=c17 -Wall -Wextra -Wpedantic -g main.c -o app\n./app\n\n# Depuração\ngdb ./app\n\n# Verificação de memória\nvalgrind --leak-check=full ./app</div>
    <h3>Guias rápidos</h3>
    <ul>
      <li><b>GCC:</b> compilador; warnings ajudam a encontrar problemas.</li>
      <li><b>GDB:</b> depurador; use break, run, next, step, print e backtrace.</li>
      <li><b>Valgrind:</b> detecta acessos inválidos e vazamentos em programas compatíveis.</li>
    </ul>
    <button class="secondary" onclick="window.open('https://gcc.gnu.org/onlinedocs/','_blank')">Manual GCC ↗</button>
    <button class="secondary" onclick="window.open('https://sourceware.org/gdb/documentation/','_blank')">Manual GDB ↗</button>
  </div>
</div>
<div class="card section">
  <h2>Desafio: soma segura</h2>
  <p>Modifique o código para ler dois inteiros, verificar se scanf conseguiu ler ambos e imprimir a soma. Teste entradas válidas e inválidas no seu compilador local.</p>
  <label class="check"><input type="checkbox" onchange="Storage.toggleLab('c-soma',this.checked)" ${Storage.isLabDone("c-soma") ? "checked" : ""}> Concluí o desafio e testei entradas válidas/inválidas.</label>
</div>`;
}

function openGodbolt() {
  let code = document.getElementById("cCode").value;
  let url = "https://godbolt.org/";
  window.open(url, "_blank");
  try {
    navigator.clipboard.writeText(code);
    toast("Código copiado. Cole no editor do Compiler Explorer.");
  } catch (e) {
    toast("Cole seu código no Compiler Explorer.");
  }
}

function copyCode() {
  navigator.clipboard?.writeText(document.getElementById("cCode").value).then(() => toast("Código copiado."), () => toast("Selecione e copie manualmente."));
}

function mathLab() {
  return `
<div class="grid2">
  <div class="card">
    <h2>Fórmula e conceito</h2>
    <p>Regra da potência:</p>
    <div id="formula" style="font-size:22px;margin:20px 0">$\\frac{d}{dx}x^n = n x^{n-1}$</div>
    <p class="muted small">As expressões são renderizadas com KaTeX quando disponível.</p>
    <p><b>Exemplo:</b> se $f(x)=x^3$, então $f'(x)=3x^2$. Em $x=2$, a derivada vale 12.</p>
  </div>
  <div class="card">
    <h2>Desafio de frações</h2>
    <p>Resolva $\\frac{1}{2} + \\frac{1}{3}$. Encontre um denominador comum e explique o procedimento.</p>
    <input class="field" id="fractionAnswer" placeholder="Ex.: 5/6">
    <button style="margin-top:9px" onclick="checkFraction()">Verificar</button>
    <div id="fractionFeedback"></div>
  </div>
</div>
${Features.mentalWidget()}
${Features.calculatorWidget()}`;
}

let mental = { a: 48, b: 25, op: "×", answer: 1200 };

function newMental() {
  let pairs = [[48, 25, "×", 1200], [99, 48, "+", 147], [125, 8, "×", 1000], [360, 9, "÷", 40], [97, 48, "−", 49], [19, 7, "×", 133], [15, 200, "% de", 30], [250, 4, "÷", 62.5]];
  mental = pairs[Math.floor(Math.random() * pairs.length)];
  document.getElementById("mentalQuestion").textContent = mental.a + " " + mental.op + " " + mental.b + " = ?";
  document.getElementById("mentalAnswer").value = "";
  document.getElementById("mentalFeedback").textContent = "";
}

function checkMental() {
  let x = Number(document.getElementById("mentalAnswer").value);
  let el = document.getElementById("mentalFeedback");
  if (x === mental.answer) {
    el.innerHTML = '<p class="good">Correto! Agora explique qual estratégia mental usou.</p>';
  } else {
    el.innerHTML = '<p class="bad">Tente novamente. Uma estimativa ou decomposição pode ajudar.</p>';
  }
}

function checkFraction() {
  let s = document.getElementById("fractionAnswer").value.replace(/\s/g, "");
  document.getElementById("fractionFeedback").innerHTML = ["5/6", "10/12"].includes(s) ? '<p class="good">Correto: 1/2=3/6 e 1/3=2/6; total 5/6.</p>' : '<p class="bad">Dica: MMC de 2 e 3 é 6. Reescreva as duas frações com denominador 6.</p>';
}

function engLab() {
  return `
<div class="grid2">
  <div class="card">
    <h2>Desafio Git</h2>
    <p>Ordene mentalmente o fluxo: iniciar repositório, criar arquivo, verificar estado, preparar, registrar commit.</p>
    <div class="code" tabindex="0" role="region" aria-label="Bloco de código">git init\ngit status\ngit add README.md\ngit commit -m "Adiciona README"\ngit log --oneline</div>
    <label class="check"><input type="checkbox" onchange="Storage.toggleLab('git-flow',this.checked)" ${Storage.isLabDone("git-flow") ? "checked" : ""}> Entendi e executei o fluxo em um repositório de treino.</label>
  </div>
  <div class="card">
    <h2>Quiz de padrões e qualidade</h2>
    <p>Qual princípio recomenda que um módulo tenha uma razão principal para mudar?</p>
    <label class="check"><input type="radio" name="solid" value="a"> Responsabilidade única (SRP)</label>
    <label class="check"><input type="radio" name="solid" value="b"> Substituição de Liskov</label>
    <button onclick="checkSolid()">Responder</button>
    <div id="solidFeedback"></div>
  </div>
</div>
<div class="card section">
  <h2>Checklist de projeto</h2>
  ${["Problema e escopo definidos", "Requisitos funcionais e não funcionais", "Arquitetura e decisões documentadas", "Código versionado com commits coerentes", "Testes automatizados relevantes", "CI executa build e testes", "README explica instalação e uso", "Riscos e limitações registrados"].map((x, i) => `
    <label class="check"><input type="checkbox" onchange="Storage.toggleLab('project-${i}',this.checked)" ${Storage.isLabDone("project-" + i) ? "checked" : ""}> ${x}</label>
  `).join("")}
</div>`;
}

function checkSolid() {
  let val = document.querySelector('input[name="solid"]:checked')?.value;
  document.getElementById("solidFeedback").innerHTML = val === "a" ? '<p class="good">Correto. SRP é o princípio da responsabilidade única.</p>' : '<p class="bad">Revise SRP: responsabilidade única.</p>';
  if (val === "a") Storage.toggleLab("solid-quiz", true);
}

function reviewPage(v) {
  const s = Storage.get();
  const due = Exercises.getSpacedCards();
  let item = due[reviewIndex % due.length];

  v.innerHTML = `
<div class="eyebrow">Memória de longo prazo</div>
<h1 class="h1">Revisão espaçada</h1>
<p class="sub">Os intervalos são 1, 3, 7, 14 e 30 dias. Marque a dificuldade com honestidade; cartões difíceis voltam antes.</p>
<div class="grid">
  <div class="card"><div class="muted small">Cartões disponíveis</div><div class="stat">${Exercises.getCardStats().total}</div></div>
  <div class="card"><div class="muted small">Para revisar agora</div><div class="stat">${due.length}</div></div>
</div>
${item ? `
<div class="card section">
  <div class="row"><span class="pill">${CURRICULUM[item.track].name}</span><span class="muted small">Nível ${item.level}/5</span></div>
  <div class="flash" id="flashCard" role="button" tabindex="0" aria-expanded="false" aria-label="Cartão: ${item.q}. Ative para revelar a resposta." onclick="toggleFlashCard()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleFlashCard()}"><strong>${item.q}</strong><span class="muted small">Clique ou pressione Enter para revelar a resposta</span></div>
  <div id="flashAnswer" class="callout hidden">${item.a}</div>
  <div class="actions">
    <button class="secondary" onclick="rateCard('${item.key}',0)">Difícil</button>
    <button class="secondary" onclick="rateCard('${item.key}',1)">Bom</button>
    <button onclick="rateCard('${item.key}',2)">Fácil</button>
    <button class="ghost" onclick="reviewIndex++;render()">Próximo sem avaliar</button>
  </div>
</div>` : "<div class='card'>Nenhum cartão pendente agora. Volte amanhã para revisar.</div>"}`;
}

function toggleFlashCard() {
  const card = document.getElementById("flashCard");
  const answer = document.getElementById("flashAnswer");
  if (!card || !answer) return;
  const showing = answer.classList.toggle("hidden") === false;
  card.setAttribute("aria-expanded", String(showing));
}

function rateCard(key, r) {
  Exercises.rateCard(key, r);
  reviewIndex++;
  render();
}

const ERROR_TAXONOMY = {
  E1: "E1 — Lacuna de base: voltar um nível e cobrir o pré-requisito.",
  E2: "E2 — Erro conceitual: explicar na Técnica Feynman e criar 2 flashcards.",
  E3: "E3 — Execução: incluir o ponto no checklist de revisão rápida.",
  E4: "E4 — Atenção/TDAH: marcar dados-chave e reduzir o bloco para 15/3."
};

function mistakesPage(v) {
  const s = Storage.get();
  const today = Storage.isoDay();
  const counts = { E1: 0, E2: 0, E3: 0, E4: 0, "": 0 };
  let due = 0;
  s.mistakes.forEach(m => {
    counts[m.category || ""] = (counts[m.category || ""] || 0) + 1;
    if (!m.corrected && m.nextReview && m.nextReview <= today) due++;
  });
  const labels = { "": "Sem classificar", E1: "E1 Base", E2: "E2 Conceito", E3: "E3 Execução", E4: "E4 Atenção/TDAH" };

  v.innerHTML = `
<div class="eyebrow">Aprender com o erro</div>
<h1 class="h1">Caderno de erros</h1>
<p class="sub">Todo erro recebe uma categoria (E1–E4) e uma data de refazer: +7 dias, ou +30 dias após dois acertos sem consulta. Classificar é obrigatório antes de marcar como dominado.</p>

<div class="grid section">
  <div class="card"><div class="muted small">Erros abertos</div><div class="stat">${s.mistakes.filter(m => !m.corrected).length}</div></div>
  <div class="card"><div class="muted small">Revisões vencidas</div><div class="stat">${due}</div><div class="small muted">Data de hoje: ${today}</div></div>
  <div class="card"><div class="muted small">Dominados (2 acertos)</div><div class="stat">${s.mistakes.filter(m => m.corrected).length}</div></div>
  <div class="card"><div class="muted small">Distribuição E1–E4</div><div class="small">${["E1","E2","E3","E4"].map(k => `${k}: ${counts[k] || 0}`).join(" · ")}</div></div>
</div>

<div class="card section">
  <h2>Taxonomia obrigatória</h2>
  <div class="grid2">
    ${Object.entries(ERROR_TAXONOMY).map(([k, text]) => `<p class="small"><span class="pill ${k ? "info" : "warn"}">${k || "—"}</span> ${escHtml(text)}</p>`).join("")}
  </div>
  <p class="small muted">Se mais de 40% dos erros forem E1, recue para os fundamentos. Se mais de 40% forem E4, encurte o Pomodoro e reforce o bloqueio de distrações.</p>
</div>

<div class="actions section" style="flex-wrap:wrap" role="group" aria-label="Filtrar erros por categoria">
  ${Object.keys(labels).map(k => `<button class="secondary" onclick="filterMistakes('${k}',this)" data-mcat="${k}" aria-pressed="${k === "" ? "true" : "false"}">${labels[k]} (${counts[k] || 0})</button>`).join("")}
</div>

<div id="mistakeList">
${s.mistakes.length ? s.mistakes.map((m, i) => {
  const overdue = !m.corrected && m.nextReview && m.nextReview <= today;
  return `
<div class="card section mistake-item" data-mcat="${m.category || ""}">
  <div class="row">
    <b>${escHtml(m.question)}</b>
    <span class="pill ${overdue ? "warn" : ""}">${escHtml(CURRICULUM[m.track]?.name || m.track)}</span>
  </div>
  <p class="muted small">Resposta de referência: ${escHtml(m.answer)}</p>
  <p class="small muted">Registrado em ${escHtml(m.date)} · Refazer em <b>${escHtml(m.nextReview)}</b> · ${m.redoCount || 0} refeito(s) · ${m.corrected ? "Dominado" : "Em revisão"}</p>
  <label class="small" for="mcat-${i}">Categoria do erro</label>
  <select class="field" id="mcat-${i}" onchange="Gamification.setMistakeCategory(${i},this.value)">
    ${Object.keys(labels).map(k => `<option value="${k}" ${m.category === k ? "selected" : ""}>${labels[k]}</option>`).join("")}
  </select>
  ${m.category ? `<p class="small muted">Ação: ${escHtml(ERROR_TAXONOMY[m.category])}</p>` : ""}
  <div class="actions">
    <button class="secondary" onclick="openLesson('${m.lesson}')">Revisar aula</button>
    <button class="secondary" onclick="Gamification.redoMistake(${i},true)">Refazer e acertei</button>
    <button class="ghost" onclick="Gamification.redoMistake(${i},false)">Errei de novo</button>
    <button class="ghost" onclick="removeMistake(${i})">Remover</button>
  </div>
</div>`;
}).join("") : "<div class='card'>Ainda não há erros registrados. Faça exercícios nas aulas; errar é parte do processo.</div>"}
</div>`;
}

function filterMistakes(cat, btn) {
  document.querySelectorAll("#mistakeList .mistake-item").forEach(el => {
    el.classList.toggle("hidden", cat !== "" && el.dataset.mcat !== cat);
  });
  if (btn) {
    document.querySelectorAll("[data-mcat]").forEach(b => {
      if (b !== btn && b.closest("#mistakeList")) return;
      if (b.dataset.mcat !== undefined && b.tagName === "BUTTON") {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      }
    });
  }
}

function removeMistake(i) {
  const s = Storage.get();
  s.mistakes.splice(i, 1);
  Storage.save();
  render();
}

function feynmanPage(v) {
  const s = Storage.get();
  v.innerHTML = `
<div class="eyebrow">Aprendizagem profunda</div>
<h1 class="h1">Técnica Feynman</h1>
<p class="sub">Escolha um conceito e explique como se ensinasse a alguém sem conhecimento prévio.</p>
<div class="card">
  <label>Conceito</label>
  <input class="field" id="fTopic" placeholder="Ex.: ponteiros em C, derivada, pipe Linux">
  <label style="display:block;margin-top:12px">Sua explicação</label>
  <textarea class="field" id="fText" placeholder="Explique com suas palavras, use uma analogia e um exemplo."></textarea>
  <h3>Checklist de autoavaliação</h3>
  ${["Expliquei sem copiar a definição do livro.", "Usei uma analogia correta e indiquei seus limites.", "Dei um exemplo concreto resolvido.", "Expliquei por que o conceito funciona.", "Identifiquei uma dúvida que ainda tenho.", "Consegui explicar sem jargão desnecessário."].map((x, i) => `<label class="check"><input type="checkbox" id="fc${i}"> ${x}</label>`).join("")}
  <button onclick="saveGeneralFeynman()">Salvar no caderno</button>
  <div id="fSaved"></div>
</div>
<div class="card section">
  <h2>Explicações salvas</h2>
  ${Object.entries(s.notes || {}).map(([k, x]) => `<div class="q"><b>${k}</b><p>${x}</p></div>`).join("") || '<p class="muted">Nenhuma ainda.</p>'}
</div>`;
}

function saveGeneralFeynman() {
  let t = document.getElementById("fTopic").value.trim();
  let x = document.getElementById("fText").value.trim();
  if (!t || !x) return toast("Preencha conceito e explicação.");
  Storage.saveGeneralNote(t, x);
  document.getElementById("fSaved").innerHTML = '<p class="good">Explicação salva.</p>';
}

function libraryPage(v) {
  const cats = Array.from(new Set(LIBRARY.map(x => x[0])));
  const levels = Array.from(new Set(LIBRARY.map(x => x[4] || "Todos")));
  v.innerHTML = `
<div class="eyebrow">Fontes confiáveis</div>
<h1 class="h1">Biblioteca universitária</h1>
<p class="sub">Livros, artigos científicos, cursos abertos e documentação oficial com filtro por área e nível. Regra anti-paralisia: no máximo 1 livro principal e 1 fonte prática por trilha de cada vez.</p>
<input class="field" id="libSearch" placeholder="Buscar por título, autor ou assunto..." oninput="filterLibrary()" aria-label="Buscar na biblioteca">
<div class="tabs" id="libCats" role="group" aria-label="Filtrar por área">
  <button class="active" data-cat="all" onclick="filterLibrary(undefined,this)" aria-pressed="true">Todas</button>
  ${cats.map(c => `<button data-cat="${escHtml(c)}" onclick="filterLibrary(undefined,this)" aria-pressed="false">${escHtml(c)}</button>`).join("")}
</div>
<div class="tabs" id="libLevels" role="group" aria-label="Filtrar por nível">
  <button class="active" data-level="all" onclick="filterLibrary(undefined,this)" aria-pressed="true">Todos os níveis</button>
  ${levels.map(l => `<button data-level="${escHtml(l)}" onclick="filterLibrary(undefined,this)" aria-pressed="false">${escHtml(l)}</button>`).join("")}
</div>
<div class="grid2 section" id="libGrid">
  ${LIBRARY.map(x => `
    <div class="card" data-lib="${escHtml((x[0] + " " + x[1] + " " + x[2]).toLowerCase())}" data-cat="${escHtml(x[0])}" data-level="${escHtml(x[4] || "Todos")}">
      <div class="row"><span class="pill">${escHtml(x[0])}</span><span class="pill info">${escHtml(x[4] || "Todos")}</span></div>
      <h3>${escHtml(x[1])}</h3>
      <p class="muted">${escHtml(x[2])}</p>
      <a class="resource-link" href="${escHtml(x[3])}" target="_blank" rel="noopener">Abrir recurso ↗</a>
    </div>
  `).join("")}
</div>
<div class="card section">
  <div class="row"><h2>Rotas de leitura</h2><span class="pill">${READING_ROUTES.length} percursos</span></div>
  <p class="muted">Sequências curtas: comece pelo material introdutório, consulte a referência e só depois avance para a especificação técnica.</p>
  <div class="grid2">
    ${READING_ROUTES.map((r, i) => `
      <div class="card route-card">
        <h3>${r.name}</h3>
        <p class="muted">${r.desc}</p>
        <p class="small">${r.steps.length} etapas · <button class="linklike" onclick="openReadingRoute(${i})">Ver rota →</button></p>
      </div>`).join("")}
  </div>
</div>`;
}

function filterLibrary(cat, btn) {
  const q = (document.getElementById("libSearch")?.value || "").toLowerCase();
  if (btn) {
    const group = btn.closest(".tabs");
    group?.querySelectorAll("button").forEach(b => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-pressed", String(b === btn));
    });
  }
  const activeCat = cat || document.querySelector("#libCats button.active")?.dataset.cat || "all";
  const activeLevel = document.querySelector("#libLevels button.active")?.dataset.level || "all";
  document.querySelectorAll("#libGrid .card").forEach(el => {
    const okCat = activeCat === "all" || el.dataset.cat === activeCat;
    const okLevel = activeLevel === "all" || el.dataset.level === activeLevel;
    const okText = (el.dataset.lib || "").includes(q);
    el.classList.toggle("hidden", !(okCat && okLevel && okText));
  });
}

function openReadingRoute(i) {
  const r = READING_ROUTES[i];
  if (!r) return;
  const html = `<h2>${r.name}</h2><p class="muted">${r.desc}</p>
    <ol class="route-steps">${r.steps.map((s, j) => `<li>
      <span class="pill">${j + 1}. ${s[0]}</span>
      <h3>${s[1]}</h3>
      <p>${s[2]}</p>
    </li>`).join("")}</ol>
    <div class="callout">Leia com uma pergunta em mente. Ao terminar, explique a ideia central sem consultar o texto e registre no caderno Feynman.</div>`;
  openModal(html);
}

function projectsPage(v) {
  const s = Storage.get();
  const tiers = ["Integrador", "Fundamentos", "Intermediário", "Avançado"];
  const card = (p, i) => `
<div class="card section">
  <div class="row"><h2>${i + 1}. ${p[0]}</h2><span class="pill">${p[3] || "Projeto"} · ${p[2].filter((_, j) => s.labDone.includes("proj" + i + "-" + j)).length}/${p[2].length}</span></div>
  <p>${p[1]}</p>
  ${p[2].map((x, j) => `<label class="check"><input type="checkbox" onchange="Storage.toggleLab('proj${i}-${j}',this.checked)" ${s.labDone.includes("proj" + i + "-" + j) ? "checked" : ""}> ${x}</label>`).join("")}
</div>`;
  v.innerHTML = `
<div class="eyebrow">Construir para aprender</div>
<h1 class="h1">Projetos integradores</h1>
<p class="sub">Projetos conectam teoria e prática em três níveis. Comece pelos fundamentos, avance para integrações e termine com decisões de arquitetura. Marque os entregáveis à medida que forem concluídos.</p>
${tiers.map(tier => {
  const items = PROJECTS.map((p, i) => ({ p, i })).filter(x => (x.p[3] || "Intermediário") === tier);
  return items.length ? `<h2 class="section-title">${tier}</h2>${items.map(x => card(x.p, x.i)).join("")}` : "";
}).join("")}`;
}

function settingsPage(v) {
  const s = Storage.get();
  v.innerHTML = `
<div class="eyebrow">Seus dados</div>
<h1 class="h1">Progresso e backup</h1>
<p class="sub">Os dados ficam no localStorage deste navegador e deste dispositivo. Exporte backups regularmente.</p>
<div class="grid2">
  <div class="card">
    <h2>Meta semanal</h2>
    <label class="muted small" for="goal">Horas por semana</label>
    <input class="field" id="goal" type="number" min="1" max="80" value="${s.weeklyGoal}" aria-label="Meta de horas de estudo por semana">
    <button style="margin-top:9px" onclick="Storage.get().weeklyGoal=Number(document.getElementById('goal').value)||7;Storage.save();toast('Meta atualizada.');render()">Salvar meta</button>
  </div>
  <div class="card">
    <h2>Resumo</h2>
    <p>Aulas: <b>${totalDone()}/${lessons.length}</b></p>
    <p>Horas: <b>${s.hours.toFixed(1)}</b></p>
    <p>Erros registrados: <b>${s.mistakes.length}</b></p>
    <p>Desafios concluídos: <b>${s.labDone.length}</b></p>
  </div>
</div>
<div class="card section">
  <h2>Exportar / importar JSON</h2>
  <div class="actions">
    <button onclick="Storage.export()">Exportar progresso</button>
    <label class="secondary" style="padding:10px 14px;border-radius:10px;cursor:pointer">Importar JSON<input type="file" accept="application/json,.json" hidden onchange="Storage.import(event.target.files[0]).then(()=>render())"></label>
  </div>
  <p class="muted small">Importar substitui o progresso atual. Faça exportação antes. Não compartilhe backup se contiver anotações pessoais.</p>
</div>
<div class="card section">
  <h2>Limpar dados</h2>
  <p class="muted">Esta ação apaga o progresso salvo neste navegador.</p>
  <button style="background:var(--bad)" onclick="if(confirm('Tem certeza? Exporte um backup antes.')){Storage.reset();render();}">Apagar todo o progresso</button>
</div>`;
}

/* Atalhos de teclado. Nunca intercepta teclas digitadas em campos. */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    if (typeof page !== "undefined" && page === "focus" && typeof Focus !== "undefined") {
      Focus.exit();
      return;
    }
    const side = document.getElementById("sidebar");
    if (side?.classList.contains("open")) {
      side.classList.remove("open");
      document.getElementById("menuBtn")?.setAttribute("aria-expanded", "false");
    }
    return;
  }

  if (e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
    const pages = [...document.querySelectorAll("#nav button")].map(b => b.dataset.page);
    const i = pages.indexOf(page);
    const next = pages[i + (e.key === "ArrowRight" ? 1 : -1)];
    if (next) {
      e.preventDefault();
      page = next;
      render();
    }
    return;
  }

  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
  if (typing || e.ctrlKey || e.metaKey || document.querySelector(".modal-overlay")) return;

  if ((e.key === "f" || e.key === "F") && page !== "focus" && typeof Focus !== "undefined") {
    e.preventDefault();
    Focus.open(nextLessonId(), page);
    return;
  }

  if (e.key === "?") {
    e.preventDefault();
    openModal(`
      <h2>Atalhos de teclado</h2>
      <ul class="small">
        <li><b>Tab / Shift+Tab</b> — navegar entre controles</li>
        <li><b>Enter / Espaço</b> — ativar botões e cartões</li>
        <li><b>Alt + ← / →</b> — página anterior / próxima</li>
        <li><b>Esc</b> — fechar diálogo ou menu lateral</li>
        <li><b>F</b> — entrar no modo foco na próxima aula</li>
        <li><b>?</b> — abrir esta ajuda</li>
      </ul>`);
  }
});

window.onload = () => {
  Storage.load();
  render();
};

/* Habilita uso offline quando servido por HTTP(S). Em file:// o navegador
   bloqueia service workers, então a aplicação segue funcionando normalmente. */
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js", { scope: "./" }).catch(err => {
      console.info("Service worker indisponível:", err.message);
    });
  });
}
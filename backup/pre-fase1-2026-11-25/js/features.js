/* ============================================================
   FORGE — features.js
   Timer, teste de nivelamento, provas, calculadora e gráficos
   ============================================================ */

/* ---------------------- Timer de estudo ---------------------- */
const studyTimer = { running: false, start: 0, elapsed: 0, handle: null, track: "geral" };

function timerDisplay(ms) {
  const total = Math.floor(ms / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor(total % 3600 / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function updateTimerUI() {
  const el = document.getElementById("timerDisplay");
  if (el) el.textContent = timerDisplay(studyTimer.elapsed + (studyTimer.running ? Date.now() - studyTimer.start : 0));
  const btn = document.getElementById("timerToggle");
  if (btn) btn.textContent = studyTimer.running ? "❚❚ Pausar" : "▶ Iniciar";
}

function toggleTimer() {
  if (studyTimer.running) {
    studyTimer.elapsed += Date.now() - studyTimer.start;
    studyTimer.running = false;
    clearInterval(studyTimer.handle);
  } else {
    studyTimer.start = Date.now();
    studyTimer.running = true;
    studyTimer.handle = setInterval(updateTimerUI, 500);
  }
  updateTimerUI();
}

function resetTimer(save) {
  const ms = studyTimer.elapsed + (studyTimer.running ? Date.now() - studyTimer.start : 0);
  clearInterval(studyTimer.handle);
  studyTimer.running = false;
  studyTimer.elapsed = 0;
  if (save && ms > 30000) {
    Storage.recordTimerSession(Math.round(ms / 60000), studyTimer.track, "timer");
    if (typeof toast === "function") toast(`Sessão de ${Math.round(ms / 60000)} min registrada.`);
  }
  updateTimerUI();
}

function timerWidget() {
  return `<div class="card" id="timerWidget">
    <div class="row"><h2>Cronômetro de estudo</h2><span class="pill" id="timerTrackLabel">${studyTimer.track}</span></div>
    <div class="timer-display" id="timerDisplay">00:00:00</div>
    <div class="actions">
      <button id="timerToggle" onclick="toggleTimer()">▶ Iniciar</button>
      <button class="secondary" onclick="resetTimer(true)">Salvar e zerar</button>
      <button class="ghost" onclick="resetTimer(false)">Zerar</button>
    </div>
    <p class="muted small">Ao salvar, a sessão entra no histórico e nas estatísticas.</p>
  </div>`;
}

/* ------------------ Teste de nivelamento -------------------- */
function trackNames() {
  const names = {};
  if (typeof CURRICULUM !== "undefined") {
    Object.keys(CURRICULUM).forEach(k => { names[k] = CURRICULUM[k].name; });
  }
  return names;
}

function openPlacementTest() {
  const questions = Exercises.generatePlacementTest();
  if (!questions.length) return toast("Não foi possível gerar o teste.");
  const names = trackNames();
  const html = `<h2>Teste de nivelamento</h2>
    <p class="muted">12 questões rápidas. Avalia seu ponto de partida em cada trilha; não afeta seu progresso.</p>
    <form id="placementForm">
    ${questions.map((q, i) => `<div class="q" style="margin-bottom:14px">
      <p><b>${i + 1}.</b> ${q.question} <span class="pill">${names[q.track] || q.track}</span></p>
      ${q.options.map((o, j) => `<label class="check"><input type="radio" name="p${i}" value="${j}"> ${o}</label>`).join("")}
    </div>`).join("")}
    <div class="actions"><button type="button" onclick="submitPlacement()">Ver resultado</button></div>
    </form>
    <div id="placementResult"></div>`;
  openModal(html);
  window._placementQuestions = questions;
}

function submitPlacement() {
  const qs = window._placementQuestions || [];
  const answers = qs.map((_, i) => {
    const el = document.querySelector(`input[name="p${i}"]:checked`);
    return el ? Number(el.value) : undefined;
  });
  const res = Exercises.evaluatePlacement(qs, answers);
  Storage.setPlacementResult(res);
  const names = trackNames();
  const bars = Object.entries(res.trackScores).map(([k, v]) =>
    `<p><b>${names[k] || k}:</b> ${v.correct}/${v.total} · ${v.total ? Math.round(v.correct / v.total * 100) : 0}%</p>`).join("");
  document.getElementById("placementResult").innerHTML = `
    <div class="callout"><b>Resultado: ${res.correct}/${res.total} (${res.percentage}%)</b>
    <p>${res.readyForAdvanced ? "Você já tem base sólida. Pode começar pelos módulos intermediários." : "Recomendamos começar pela trilha com menor pontuação e avançar no seu ritmo."}</p>
    <p><b>Sugestão de início:</b> ${names[res.recommendedStart] || res.recommendedStart}</p></div>
    ${bars}`;
  toast("Resultado salvo no seu progresso.");
}

/* ------------------- Provas periódicas ---------------------- */
function openPeriodicExam() {
  const s = Storage.get();
  const done = lessons.filter(l => s.done.includes(l.id));
  const exam = Exercises.generateCumulativeExam(done, 10);
  if (!exam) return toast("Conclua pelo menos 4 aulas para liberar a prova periódica.");
  window._examQuestions = exam;
  const html = `<h2>Prova periódica</h2>
    <p class="muted">${exam.length} questões das aulas concluídas. Respostas erradas voltam ao caderno de erros.</p>
    <form id="examForm">
    ${exam.map((q, i) => `<div class="q" style="margin-bottom:14px">
      <p><b>${i + 1}.</b> ${q.question}</p>
      ${q.options.map((o, j) => `<label class="check"><input type="radio" name="e${i}" value="${j}"> ${o}</label>`).join("")}
    </div>`).join("")}
    <div class="actions"><button type="button" onclick="submitExam()">Corrigir prova</button></div>
    </form><div id="examResult"></div>`;
  openModal(html);
}

function submitExam() {
  const qs = window._examQuestions || [];
  let score = 0;
  const s = Storage.get();
  qs.forEach((q, i) => {
    const el = document.querySelector(`input[name="e${i}"]:checked`);
    const ans = el ? Number(el.value) : -1;
    if (ans === q.correctIndex) score++;
    else if (!s.mistakes.some(m => m.question === q.question)) {
      s.mistakes.push({ lesson: q.lessonId, track: q.track, question: q.question, answer: q.options[q.correctIndex], date: new Date().toISOString() });
    }
  });
  Storage.save();
  const pct = qs.length ? Math.round(score / qs.length * 100) : 0;
  document.getElementById("examResult").innerHTML = `<div class="callout">
    <b>Nota: ${score}/${qs.length} (${pct}%)</b>
    <p>${pct >= 80 ? "Ótimo! Você consolidou o conteúdo." : pct >= 50 ? "Bom progresso. Revise os erros antes de avançar." : "Volte às aulas e tente novamente em breve."}</p></div>`;
  toast("Prova corrigida.");
}

/* ------------------ Prova por disciplina -------------------- */
function openTrackExam() {
  const s = Storage.get();
  const assessments = (s.assessments && typeof s.assessments === "object") ? s.assessments : {};
  const opts = Object.keys(CURRICULUM).map(k => {
    const t = CURRICULUM[k];
    const ids = [];
    t.modules.forEach((m, mi) => m.lessons.forEach((_, li) => ids.push(`${k}-${mi}-${li}`)));
    const done = ids.filter(id => (s.done || []).includes(id)).length;
    const rec = assessments["exam-" + k];
    return `<option value="${k}">${t.name} — ${done}/${ids.length} aulas${rec ? " · melhor " + Number(rec.best) + "/10" : ""}</option>`;
  }).join("");
  openModal(`<h2>Prova por disciplina</h2>
    <p class="muted">Dez questões de uma única disciplina. A prova prioriza as aulas que você concluiu; se ainda não houver quatro, usa as primeiras aulas da trilha como diagnóstico.</p>
    <label for="examTrackSelect">Disciplina</label>
    <select class="field" id="examTrackSelect">${opts}</select>
    <div class="actions"><button onclick="Features.startTrackExam()">Gerar prova</button></div>
    <div id="trackExamArea"></div>`);
}

function startTrackExam() {
  const k = document.getElementById("examTrackSelect")?.value;
  if (!k || !CURRICULUM[k]) return toast("Escolha uma disciplina.");
  const s = Storage.get();
  const all = lessons.filter(l => l.track === k);
  const done = all.filter(l => (s.done || []).includes(l.id));
  const pool = done.length >= 4 ? done : all.slice(0, Math.max(4, Math.min(5, all.length)));
  const exam = Exercises.generateCumulativeExam(pool, 10);
  if (!exam || !exam.length) return toast("Esta disciplina ainda não tem questões disponíveis.");
  window._trackExamQuestions = exam;
  window._trackExamTrack = k;
  const area = document.getElementById("trackExamArea");
  if (!area) return;
  const name = CURRICULUM[k].name;
  const diagnostic = done.length < 4;
  area.innerHTML = `<div class="callout"><b>${name}</b> · ${exam.length} questões${diagnostic ? " · <span class=\"warn\">modo diagnóstico</span>" : " · aulas concluídas"}</div>
    <form id="trackExamForm">
    ${exam.map((q, i) => `<div class="q" style="margin-bottom:14px">
      <p><b>${i + 1}.</b> ${q.question}</p>
      ${q.options.map((o, j) => `<label class="check"><input type="radio" name="te${i}" value="${j}"> ${o}</label>`).join("")}
    </div>`).join("")}
    <div class="actions"><button type="button" onclick="Features.submitTrackExam()">Corrigir prova</button></div>
    </form><div id="trackExamResult"></div>`;
}

function submitTrackExam() {
  const qs = window._trackExamQuestions || [];
  const k = window._trackExamTrack;
  if (!k || !qs.length) return;
  if (!Array.isArray(Storage.get().mistakes)) Storage.get().mistakes = [];
  const s = Storage.get();
  let score = 0;
  qs.forEach((q, i) => {
    const el = document.querySelector(`input[name="te${i}"]:checked`);
    const ans = el ? Number(el.value) : -1;
    if (ans === q.correctIndex) score++;
    else if (!s.mistakes.some(m => m.question === q.question)) {
      s.mistakes.push({
        lesson: q.lessonId, track: q.track, question: q.question,
        answer: q.options[q.correctIndex], date: new Date().toISOString()
      });
    }
  });
  const key = "exam-" + k;
  if (!s.assessments || typeof s.assessments !== "object") s.assessments = {};
  const rec = s.assessments[key] || { best: 0, attempts: 0, lastAt: null };
  rec.attempts = (Number(rec.attempts) || 0) + 1;
  rec.best = Math.max(Number(rec.best) || 0, score);
  rec.lastAt = new Date().toISOString();
  s.assessments[key] = rec;
  Storage.save();

  const pct = Math.round(score / qs.length * 100);
  const msg = pct >= 80
    ? "Domínio sólido nesta disciplina. Reforce com o modo foco as aulas que ainda não concluiu."
    : pct >= 50
      ? "Base em formação. Revise o caderno de erros e refaça a prova em alguns dias."
      : "Volte às aulas desta disciplina e tente de novo depois de praticar.";
  const result = document.getElementById("trackExamResult");
  if (result) result.innerHTML = `<div class="callout"><b>Nota: ${score}/${qs.length} (${pct}%)</b>
    <p>${msg}</p>
    <p class="small muted">Melhor resultado em ${CURRICULUM[k].name}: ${rec.best}/${qs.length} · ${rec.attempts} ${rec.attempts === 1 ? "tentativa" : "tentativas"}. Erros foram registrados no caderno.</p></div>`;
  toast("Prova corrigida e registrada.");
}

/* ------------- Cálculo mental com timer e níveis ------------- */
let mentalGame = { level: 1, question: null, start: 0, correct: 0, total: 0, running: false, handle: null };

function generateMentalQuestion(level) {
  const ops = level === 1 ? ["+", "−"] : level === 2 ? ["+", "−", "×"] : ["+", "−", "×", "÷", "%"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer, label = op;
  if (op === "+") { a = 10 + Math.floor(Math.random() * 90); b = 10 + Math.floor(Math.random() * 90); answer = a + b; }
  else if (op === "−") { a = 30 + Math.floor(Math.random() * 70); b = 5 + Math.floor(Math.random() * 60); answer = a - b; }
  else if (op === "×") { a = 2 + Math.floor(Math.random() * (level === 3 ? 18 : 12)); b = 2 + Math.floor(Math.random() * 12); answer = a * b; }
  else if (op === "÷") { b = 2 + Math.floor(Math.random() * 12); answer = 2 + Math.floor(Math.random() * 20); a = b * answer; }
  else { a = [10, 20, 25, 50, 200][Math.floor(Math.random() * 5)]; b = [10, 20, 25, 50][Math.floor(Math.random() * 4)]; answer = a * b / 100; label = "% de"; }
  return { a, b, op: label, answer };
}

function mentalWidget() {
  const stats = Storage.getMentalMathStats();
  return `<div class="card section" id="mentalGame">
    <div class="row"><h2>Treino de cálculo mental</h2><span class="pill" id="mentalLevel">Nível ${mentalGame.level}</span></div>
    <p class="muted">Resolva no tempo. A velocidade e a precisão entram no seu histórico.</p>
    <div class="row" style="justify-content:flex-start;gap:10px;flex-wrap:wrap">
      <button class="secondary" onclick="setMentalLevel(1)">Fácil</button>
      <button class="secondary" onclick="setMentalLevel(2)">Médio</button>
      <button class="secondary" onclick="setMentalLevel(3)">Difícil</button>
    </div>
    <div class="timer-display" id="mentalTimer">00:00.0</div>
    <div class="stat" id="mentalQuestion">—</div>
    <input class="field" id="mentalAnswer" placeholder="Sua resposta" onkeydown="if(event.key==='Enter')checkMentalFast()">
    <div class="actions"><button onclick="checkMentalFast()">Responder</button><button class="secondary" onclick="startMentalQuestion()">Próxima</button></div>
    <div id="mentalFeedback"></div>
    <div class="grid" style="margin-top:14px">
      <div><div class="muted small">Acertos</div><div class="stat">${stats.correct}/${stats.total}</div></div>
      <div><div class="muted small">Precisão</div><div class="stat">${stats.accuracy}%</div></div>
      <div><div class="muted small">Tempo médio</div><div class="stat">${(stats.avgTime / 1000).toFixed(1)}s</div></div>
    </div>
  </div>`;
}

function setMentalLevel(n) {
  mentalGame.level = n;
  const el = document.getElementById("mentalLevel");
  if (el) el.textContent = `Nível ${n}`;
  startMentalQuestion();
}

function startMentalQuestion() {
  mentalGame.question = generateMentalQuestion(mentalGame.level);
  mentalGame.start = Date.now();
  mentalGame.running = true;
  clearInterval(mentalGame.handle);
  mentalGame.handle = setInterval(() => {
    const el = document.getElementById("mentalTimer");
    if (el) el.textContent = ((Date.now() - mentalGame.start) / 1000).toFixed(1).padStart(5, "0") + "s";
  }, 100);
  const q = mentalGame.question;
  const qel = document.getElementById("mentalQuestion");
  if (qel) qel.textContent = `${q.a} ${q.op} ${q.b} = ?`;
  const inp = document.getElementById("mentalAnswer");
  if (inp) { inp.value = ""; inp.focus(); }
  const fb = document.getElementById("mentalFeedback");
  if (fb) fb.innerHTML = "";
}

function checkMentalFast() {
  if (!mentalGame.question || !mentalGame.running) return;
  const ms = Date.now() - mentalGame.start;
  const val = Number((document.getElementById("mentalAnswer")?.value || "").replace(",", "."));
  const ok = val === mentalGame.question.answer;
  mentalGame.total++;
  if (ok) mentalGame.correct++;
  Storage.recordMentalMath(ok, ms, mentalGame.level);
  clearInterval(mentalGame.handle);
  mentalGame.running = false;
  const fb = document.getElementById("mentalFeedback");
  if (fb) fb.innerHTML = ok
    ? `<p class="good">Correto em ${(ms / 1000).toFixed(1)}s! ${mentalGame.question.a} ${mentalGame.question.op} ${mentalGame.question.b} = ${mentalGame.question.answer}.</p>`
    : `<p class="bad">Resposta correta: ${mentalGame.question.answer}. Tente decompor mentalmente.</p>`;
  setTimeout(startMentalQuestion, 1200);
}

/* ----------------------- Calculadora ------------------------ */
function calcEvaluate(expr) {
  const s = String(expr).replace(/\s+/g, "").replace(/,/g, ".").replace(/π/g, "pi").replace(/×/g, "*").replace(/÷/g, "/");
  let i = 0;
  const peek = () => s[i] || "";
  function parseExpr() {
    let v = parseTerm();
    while (peek() === "+" || peek() === "-") { const op = s[i++]; const r = parseTerm(); v = op === "+" ? v + r : v - r; }
    return v;
  }
  function parseTerm() {
    let v = parsePower();
    while (peek() === "*" || peek() === "/" || peek() === "%") { const op = s[i++]; const r = parsePower(); v = op === "*" ? v * r : op === "/" ? v / r : v % r; }
    return v;
  }
  function parsePower() { let v = parseUnary(); if (peek() === "^") { i++; v = Math.pow(v, parsePower()); } return v; }
  function parseUnary() { if (peek() === "+") { i++; return parseUnary(); } if (peek() === "-") { i++; return -parseUnary(); } return parsePrimary(); }
  function parsePrimary() {
    if (peek() === "(") { i++; const v = parseExpr(); if (peek() === ")") i++; else throw new Error("Parêntese não fechado"); return v; }
    const m = s.slice(i).match(/^[a-zA-Z]+/);
    if (m) {
      const name = m[0].toLowerCase(); i += name.length;
      if (name === "pi") return Math.PI;
      if (name === "e") return Math.E;
      const fns = { sqrt: Math.sqrt, sin: Math.sin, cos: Math.cos, tan: Math.tan, log: Math.log10, ln: Math.log, abs: Math.abs, exp: Math.exp, round: Math.round, floor: Math.floor, ceil: Math.ceil };
      if (!fns[name]) throw new Error("Função desconhecida: " + name);
      const arg = peek() === "(" ? parsePrimary() : parseUnary();
      return fns[name](arg);
    }
    const n = s.slice(i).match(/^(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/);
    if (n) { i += n[0].length; return parseFloat(n[0]); }
    throw new Error("Expressão inválida");
  }
  const v = parseExpr();
  if (i < s.length) throw new Error("Expressão inválida");
  if (!isFinite(v)) throw new Error("Resultado não finito");
  return v;
}

function calculatorWidget() {
  return `<div class="card section">
    <h2>Calculadora científica</h2>
    <p class="muted">Use + − × ÷ ^ e funções como sqrt, sin, cos, ln, log, abs. Ex.: <code>sqrt(2)^2 + log(100)</code>.</p>
    <input class="field" id="calcInput" placeholder="Expressão" onkeydown="if(event.key==='Enter')runCalc()">
    <div class="actions"><button onclick="runCalc()">Calcular</button><button class="secondary" onclick="document.getElementById('calcInput').value='';document.getElementById('calcResult').textContent=''">Limpar</button></div>
    <div class="stat" id="calcResult">—</div>
    <div class="actions" style="flex-wrap:wrap">
      ${["7","8","9","÷","4","5","6","×","1","2","3","−","0",".","(",")","+","sqrt(","sin(","cos(","ln(","pi","^","/"].map(x => `<button class="secondary" style="width:auto;min-width:44px" onclick="calcInsert('${x}')">${x}</button>`).join("")}
    </div>
  </div>`;
}

function calcInsert(v) {
  const el = document.getElementById("calcInput");
  if (el) { el.value += v; el.focus(); }
}

function runCalc() {
  const input = document.getElementById("calcInput")?.value || "";
  const out = document.getElementById("calcResult");
  if (!out) return;
  try {
    const v = calcEvaluate(input);
    out.textContent = Number.isInteger(v) ? String(v) : String(Math.round(v * 1e10) / 1e10);
    out.className = "stat good";
  } catch (e) {
    out.textContent = "Erro: " + e.message;
    out.className = "stat bad";
  }
}

/* ---------------------- Gráficos ---------------------------- */
function drawProgressChart() {
  const canvas = document.getElementById("progressChart");
  if (!canvas || typeof CURRICULUM === "undefined") return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width = canvas.clientWidth * 2;
  const h = canvas.height = 260 * 2;
  ctx.clearRect(0, 0, w, h);
  const tracks = Object.entries(CURRICULUM);
  const s = Storage.get();
  const data = tracks.map(([k, t]) => {
    const ids = [];
    t.modules.forEach((m, mi) => m.lessons.forEach((_, li) => ids.push(`${k}-${mi}-${li}`)));
    const done = ids.filter(id => s.done.includes(id)).length;
    return { name: t.name, pct: ids.length ? Math.round(done / ids.length * 100) : 0 };
  });
  const pad = 40 * 2, bw = (w - pad * 2) / data.length * 0.55;
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--muted") || "#888";
  ctx.font = `${22}px system-ui`;
  ctx.textAlign = "center";
  data.forEach((d, i) => {
    const x = pad + (i + 0.5) * (w - pad * 2) / data.length;
    const barH = (h - pad * 2) * d.pct / 100;
    ctx.fillStyle = "#4f8cff";
    ctx.fillRect(x - bw / 2, h - pad - barH, bw, barH);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--text") || "#222";
    ctx.fillText(d.pct + "%", x, h - pad - barH - 12);
    const short = d.name.split(" ")[0];
    ctx.fillText(short, x, h - pad + 34);
  });
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--border") || "#ddd";
  ctx.beginPath(); ctx.moveTo(pad, h - pad); ctx.lineTo(w - pad, h - pad); ctx.stroke();
}

function drawHoursChart() {
  const canvas = document.getElementById("hoursChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width = canvas.clientWidth * 2;
  const h = canvas.height = 200 * 2;
  ctx.clearRect(0, 0, w, h);
  const log = Storage.get().dayLog || {};
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ label: `${d.getDate()}/${d.getMonth() + 1}`, v: log[key] || 0 });
  }
  const pad = 36 * 2;
  const max = Math.max(1, ...days.map(d => d.v));
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--border") || "#ddd";
  ctx.beginPath(); ctx.moveTo(pad, h - pad); ctx.lineTo(w - pad, h - pad); ctx.stroke();
  ctx.strokeStyle = "#22a06b";
  ctx.lineWidth = 4;
  ctx.beginPath();
  days.forEach((d, i) => {
    const x = pad + i * (w - pad * 2) / (days.length - 1);
    const y = h - pad - (d.v / max) * (h - pad * 2);
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.stroke();
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--muted") || "#888";
  ctx.font = `${20}px system-ui`;
  ctx.textAlign = "center";
  days.forEach((d, i) => { if (i % 3 === 0) { const x = pad + i * (w - pad * 2) / (days.length - 1); ctx.fillText(d.label, x, h - pad + 30); } });
}

function refreshCharts() { drawProgressChart(); drawHoursChart(); }

window.Features = {
  toggleTimer, resetTimer, timerWidget, updateTimerUI,
  openPlacementTest, submitPlacement, openPeriodicExam, submitExam,
  openTrackExam, startTrackExam, submitTrackExam,
  mentalWidget, startMentalQuestion, checkMentalFast, setMentalLevel,
  calculatorWidget, calcInsert, runCalc, refreshCharts
};

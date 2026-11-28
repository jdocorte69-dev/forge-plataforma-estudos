/* ============================================================
   FORGE 9.0 (OMEGA) — sim-mental.js
   Academia Mental: seis geradores determinísticos (FNV-1a + LCG)
   com passos revelados apenas após a resposta, cronômetro por
   pergunta e estatísticas de sessão. Sem rede ou dependências.
   Expõe window.MentalGym (API pública).
   ============================================================ */

(function () {
  "use strict";

  const WEEKDAYS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  const GENERATORS = [
    { id: "addLR", label: "Soma L→R", hint: "Some da esquerda para a direita, antecipando os vai-uns." },
    { id: "crossMult", label: "Multiplicação cruzada", hint: "Trachtenberg: unidades, cruzado e esquerda." },
    { id: "squares", label: "Quadrados", hint: "Use (a+b)² ou a base 50 para números de 11 a 99." },
    { id: "percent", label: "Porcentagens", hint: "Atalhos para 5, 10, 15, 20, 25, 50 e 75%." },
    { id: "roots", label: "Raízes", hint: "Quadrados perfeitos e aproximações com 1 casa decimal." },
    { id: "doomsday", label: "Dia da semana", hint: "Regra do Doomsday para anos de 1900 a 2099." }
  ];
  const LCG = { a: 1664525, c: 1013904223, m: 4294967296 };
  const CENTURY_ANCHORS = { 1700: 0, 1800: 5, 1900: 3, 2000: 2, 2100: 0 };
  const DOOM_DATES = { 3: 0, 4: 4, 5: 9, 6: 6, 7: 11, 8: 8, 9: 5, 10: 10, 11: 7, 12: 12 };
  const PERCENT_RULES = [
    { p: 10, rule: "divida por 10" },
    { p: 25, rule: "divida por 4" },
    { p: 50, rule: "divida por 2" },
    { p: 75, rule: "multiplique por 3 e divida por 4" },
    { p: 5, rule: "divida por 20 (10% ÷ 2)" },
    { p: 20, rule: "multiplique por 0,2 (10% × 2)" },
    { p: 15, rule: "some 10% + 5%" }
  ];

  const state = {
    mounted: false,
    stage: "menu",
    type: "addLR",
    question: null,
    answerText: "",
    selectedWeekday: "",
    answered: false,
    lastCorrect: false,
    lastGiven: "",
    lastTimeMs: 0,
    counter: 0,
    results: [],
    streak: 0,
    bestStreak: 0,
    questionStart: 0,
    timerId: null,
    rafId: null
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

  function now() {
    return (typeof performance !== "undefined" && performance && typeof performance.now === "function")
      ? performance.now() : Date.now();
  }

  function storage() {
    return (typeof Storage !== "undefined" && Storage && typeof Storage.get === "function") ? Storage : null;
  }

  function storageState() {
    try {
      const s = storage();
      return s ? (s.get() || {}) : {};
    } catch (e) {
      return {};
    }
  }

  function fnv1a32(value) {
    if (typeof window !== "undefined" && window.ForgeMathUtils && typeof window.ForgeMathUtils.fnv1a32 === "function") {
      return window.ForgeMathUtils.fnv1a32(value) >>> 0;
    }
    if (storage() && typeof Storage.fnv1a32 === "function") return Storage.fnv1a32(value) >>> 0;
    let h = 2166136261 >>> 0;
    const str = String(value == null ? "" : value);
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function lcgNext(seed) {
    if (storage() && typeof Storage.lcgNext === "function") return Storage.lcgNext(seed) >>> 0;
    return (Math.imul(seed >>> 0, LCG.a) + LCG.c) >>> 0;
  }

  /* Semente raiz: forge9 → forge8 → Storage.userSeed(userId) → FNV local.
     O contador por pergunta entra na composição em generate(), de modo que
     qualquer par (semente, contador) reproduz exatamente a mesma questão. */
  function baseSeed() {
    const s = storageState();
    const f9 = s.forge9 && s.forge9.userSeed;
    const f8 = s.forge8 && s.forge8.userSeed;
    let seed = f9 || f8;
    if (!seed) {
      const s = storageState();
      if (storage() && typeof Storage.userSeed === "function") seed = Storage.userSeed(s.userId);
      else seed = fnv1a32(`forge-v5|${s.userId || "local"}`);
    }
    return (Number(seed) >>> 0) || 1;
  }

  function makeRng(effectiveSeed) {
    let s = (effectiveSeed >>> 0) || 1;
    return function next() {
      s = lcgNext(s);
      return s / LCG.m;
    };
  }

  function randInt(rnd, min, max) {
    return min + Math.floor(rnd() * (max - min + 1));
  }

  function isLeap(year) {
    const y = Math.floor(num(year, 2000));
    return y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  }

  function daysInMonth(year, month) {
    if (month === 2) return isLeap(year) ? 29 : 28;
    return [4, 6, 9, 11].includes(month) ? 30 : 31;
  }

  function centuryAnchor(year) {
    const century = Math.floor(year / 100) * 100;
    if (Object.prototype.hasOwnProperty.call(CENTURY_ANCHORS, century)) return CENTURY_ANCHORS[century];
    /* Padrão gregoriano para séculos fora da tabela (1700..2100). */
    return ((5 * (Math.floor(year / 100) % 4) + 2) % 7 + 7) % 7;
  }

  /* 0=domingo, 1=segunda, ..., 6=sábado. Âncora do século + yy. */
  function doomsdayWeekday(year) {
    const y = Math.floor(num(year, 2000));
    const yy = ((y % 100) + 100) % 100;
    const r = yy % 12;
    const anchor = centuryAnchor(y);
    return (anchor + Math.floor(yy / 12) + r + Math.floor(r / 4)) % 7;
  }

  function weekdayForDate(year, month, day) {
    const y = Math.floor(num(year, 2000));
    const m = Math.floor(num(month, 1));
    const d = Math.floor(num(day, 1));
    const dd = doomsdayWeekday(y);
    let anchorDay;
    if (m === 1) anchorDay = isLeap(y) ? 4 : 3;       // 1/3 comum, 1/4 bissexto
    else if (m === 2) anchorDay = daysInMonth(y, 2); // 3/0: último dia de fevereiro
    else anchorDay = DOOM_DATES[m];
    if (!Number.isFinite(anchorDay)) return -1;
    const diff = ((d - anchorDay) % 7 + 7) % 7;
    return (dd + diff) % 7;
  }

  /* ---------- Geradores ---------- */

  function makeAddLR(rnd) {
    const lenA = randInt(rnd, 2, 4);
    const lenB = randInt(rnd, 2, 4);
    const digits = len => Array.from({ length: len }, (_, i) => i === 0 ? randInt(rnd, 1, 9) : randInt(rnd, 0, 9));
    const width = Math.max(lenA, lenB);
    const A = digits(lenA);
    const B = digits(lenB);
    while (A.length < width) A.unshift(0);
    while (B.length < width) B.unshift(0);

    const outDigits = new Array(width);
    const carryIn = new Array(width); // vai-um vindo da coluna à direita
    let carry = 0;
    for (let i = width - 1; i >= 0; i--) {
      const total = A[i] + B[i] + carry;
      outDigits[i] = total % 10;
      carryIn[i] = carry;
      carry = total >= 10 ? 1 : 0;
    }
    const sumStr = (carry ? "1" : "") + outDigits.join("");
    const names = ["unidades", "dezenas", "centenas", "milhares"];
    const steps = [];
    let partial = "";
    for (let i = 0; i < width; i++) {
      const total = A[i] + B[i] + carryIn[i];
      partial += String(outDigits[i]);
      const received = carryIn[i] ? ` + ${carryIn[i]} (vai-um recebido)` : "";
      const write = total >= 10 ? `escreva ${total % 10} e vai 1` : `escreva ${total}`;
      steps.push(`${i + 1}) ${names[width - 1 - i] || `coluna ${width - i}`}: ${A[i]} + ${B[i]}${received} = ${total} → ${write} → parcial ${partial}`);
    }
    if (carry) steps.push(`${width + 1}) Vai 1 final: ${sumStr}`);
    steps.push(`Soma final: ${A.join("")} + ${B.join("")} = ${sumStr}.`);
    return {
      prompt: `Some da esquerda para a direita: ${A.join("")} + ${B.join("")} = ?`,
      answer: Number(sumStr),
      tolerance: 0,
      steps,
      meta: { method: "soma L→R com vai-um", a: Number(A.join("")), b: Number(B.join("")) }
    };
  }

  function makeCrossMult(rnd) {
    const aT = randInt(rnd, 1, 9), aU = randInt(rnd, 0, 9);
    const bT = randInt(rnd, 1, 9), bU = randInt(rnd, 0, 9);
    const A = aT * 10 + aU;
    const B = bT * 10 + bU;
    const units = aU * bU;
    const c1 = Math.floor(units / 10);
    const u = units % 10;
    const crossBase = aT * bU + aU * bT;
    const cross = crossBase + c1;
    const c2 = Math.floor(cross / 10);
    const mid = cross % 10;
    const left = aT * bT + c2;
    const answer = A * B;
    const steps = [
      `1) Unidades: ${aU} × ${bU} = ${units} → algarismo ${u}, vai ${c1}.`,
      `2) Cruzado: ${aT} × ${bU} + ${aU} × ${bT} = ${aT * bU} + ${aU * bT} = ${crossBase}; com o vai ${c1}: ${cross} → algarismo ${mid}, vai ${c2}.`,
      `3) Esquerda: ${aT} × ${bT} = ${aT * bT}; com o vai ${c2}: ${left}.`,
      `Resultado: ${left}${mid}${u} = ${answer}.`
    ];
    return {
      prompt: `Multiplique em cruz: ${A} × ${B} = ?`,
      answer,
      tolerance: 0,
      steps,
      meta: { method: "Trachtenberg cruzado", a: A, b: B }
    };
  }

  function makeSquares(rnd) {
    const n = randInt(rnd, 11, 99);
    const a = Math.floor(n / 10) * 10;
    const b = n % 10;
    let steps;
    let method;
    if (n >= 40 && n <= 60) {
      const d = n - 50;
      const head = 25 + d;
      steps = [
        `1) Base 50: ${n} = 50 ${d >= 0 ? "+" : "-"} ${Math.abs(d)} (d = ${d}).`,
        `2) Cabeça: 25 + (${d}) = ${head} → ${head} × 100 = ${head * 100}.`,
        `3) Cauda: (${d})² = ${d * d} (sempre positivo).`,
        `4) Some: ${head * 100} + ${d * d} = ${n * n}.`
      ];
      method = "base 50";
    } else {
      steps = [
        `1) Decomponha: ${n} = ${a} + ${b}.`,
        `2) (${a})² = ${a * a}.`,
        `3) 2 × ${a} × ${b} = ${2 * a * b}.`,
        `4) (${b})² = ${b * b}.`,
        `5) Some: ${a * a} + ${2 * a * b} + ${b * b} = ${n * n}.`
      ];
      method = "(a+b)²";
    }
    return {
      prompt: `Calcule o quadrado de ${n}: ${n}² = ?`,
      answer: n * n,
      tolerance: 0,
      steps,
      meta: { method, n }
    };
  }

  function makePercent(rnd) {
    const rule = PERCENT_RULES[randInt(rnd, 0, PERCENT_RULES.length - 1)];
    const base = randInt(rnd, 2, 40) * 10;
    const p = rule.p;
    const value = Math.round(base * p) / 100;
    const ten = base / 10;
    const five = base / 20;
    let quick;
    if (p === 15) quick = `10% de ${base} = ${ten}; 5% = ${five}; some: ${ten} + ${five} = ${value}.`;
    else if (p === 10) quick = `${base} ÷ 10 = ${value}.`;
    else if (p === 5) quick = `${base} ÷ 20 = ${value}.`;
    else if (p === 20) quick = `${ten} × 2 = ${value}.`;
    else if (p === 25) quick = `${base} ÷ 4 = ${value}.`;
    else if (p === 50) quick = `${base} ÷ 2 = ${value}.`;
    else quick = `${base} ÷ 4 × 3 = ${base / 4} × 3 = ${value}.`;
    const steps = [
      `1) Base = ${base}; percentual = ${p}%.`,
      `2) Regra: ${rule.rule}.`,
      `3) Atalho: ${quick}`,
      `4) Confira: ${base} × ${p}/100 = ${value}.`
    ];
    return {
      prompt: `Quanto é ${p}% de ${base}?`,
      answer: value,
      tolerance: 0,
      steps,
      meta: { method: "atalho de porcentagem", base, p }
    };
  }

  function makeRoots(rnd) {
    const perfect = rnd() < 0.6;
    const k = randInt(rnd, 2, 99);
    const low = k * k;
    const high = (k + 1) * (k + 1);
    let n;
    let answer;
    let steps;
    if (perfect) {
      n = low;
      answer = k;
      steps = [
        `1) ${n} é quadrado perfeito: ${k} × ${k} = ${n}.`,
        `2) Portanto √${n} = ${k}.`,
        `3) Verificação: ${k}² = ${n}.`
      ];
    } else {
      n = low + randInt(rnd, 1, high - low - 1);
      answer = Math.round(Math.sqrt(n) * 10) / 10;
      const approx = k + (n - low) / (2 * k);
      steps = [
        `1) ${k}² = ${low} e ${k + 1}² = ${high}; logo √${n} fica entre ${k} e ${k + 1}.`,
        `2) Distância ao quadrado menor: ${n} - ${low} = ${n - low} (de ${high - low} até o próximo).`,
        `3) Aproximação: ${k} + ${n - low}/(2×${k}) ≈ ${approx.toFixed(2)}.`,
        `4) Arredondando a 1 casa decimal: √${n} ≈ ${answer} (tolerância ±0,15).`
      ];
    }
    return {
      prompt: `Calcule √${n} (arredonde a 1 casa decimal):`,
      answer,
      tolerance: 0.15,
      steps,
      meta: { method: perfect ? "quadrado perfeito" : "interpolação entre quadrados", n, perfect, lower: k }
    };
  }

  function makeDoomsday(rnd) {
    const year = randInt(rnd, 1900, 2099);
    const month = randInt(rnd, 1, 12);
    const day = randInt(rnd, 1, daysInMonth(year, month));
    const anchor = centuryAnchor(year);
    const yy = year % 100;
    const r = yy % 12;
    const q = Math.floor(yy / 12);
    const t = Math.floor(r / 4);
    const dd = doomsdayWeekday(year);
    let anchorLabel;
    if (month === 1) anchorLabel = `1/${isLeap(year) ? 4 : 3}`;
    else if (month === 2) anchorLabel = `${daysInMonth(year, 2)}/2 (3/0)`;
    else anchorLabel = `${month}/${DOOM_DATES[month]}`;
    const anchorDay = month === 1 ? (isLeap(year) ? 4 : 3)
      : month === 2 ? daysInMonth(year, 2) : DOOM_DATES[month];
    const diff = ((day - anchorDay) % 7 + 7) % 7;
    const weekday = WEEKDAYS[weekdayForDate(year, month, day)];
    const steps = [
      `1) Âncora do século ${Math.floor(year / 100) * 100}: ${anchor} (${WEEKDAYS[anchor]}).`,
      `2) yy = ${yy}: ⌊${yy}/12⌋ = ${q}, resto ${r}, ⌊${r}/4⌋ = ${t}.`,
      `3) Doomsday = (${anchor} + ${q} + ${r} + ${t}) mod 7 = ${dd} (${WEEKDAYS[dd]}).`,
      `4) Âncora do mês: ${anchorLabel} também cai em ${WEEKDAYS[dd]}.`,
      `5) De ${anchorLabel} até ${day}/${month} há ${diff} dia(s): ${weekday}.`
    ];
    return {
      prompt: `Que dia da semana é ${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}?`,
      answer: weekday,
      tolerance: 0,
      steps,
      meta: {
        method: "Doomsday gregoriano", year, month, day,
        centuryAnchor: anchor, doomsdayIndex: dd, leap: isLeap(year)
      }
    };
  }

  const BUILDERS = { addLR: makeAddLR, crossMult: makeCrossMult, squares: makeSquares,
    percent: makePercent, roots: makeRoots, doomsday: makeDoomsday };

  /* ---------- Geração determinística ----------
     - generate(type) usa a semente raiz e um contador interno que avança a
       cada pergunta: chamadas repetidas diferem de forma reproduzível.
     - generate(type, seed) com semente explícita é puro (mesmo tipo+semente
       → mesma questão); o contador é fixo em 0.
     - generate(type, { seed, counter }) reproduz qualquer questão já gerada. */
  function generate(type, seed) {
    const kind = Object.prototype.hasOwnProperty.call(BUILDERS, type) ? type : "addLR";
    let base;
    let counter;
    if (seed !== null && typeof seed === "object") {
      base = Number.isFinite(Number(seed.seed)) ? Number(seed.seed) >>> 0 : baseSeed();
      counter = Number.isFinite(Number(seed.counter)) ? Math.max(0, Number(seed.counter)) >>> 0 : 0;
    } else if (seed !== undefined && seed !== null && String(seed).trim() !== "") {
      base = Number.isFinite(Number(seed)) ? Number(seed) >>> 0 : fnv1a32(String(seed)) >>> 0;
      counter = 0;
    } else {
      base = baseSeed();
      counter = state.counter >>> 0;
      state.counter = (state.counter + 1) >>> 0;
    }
    const effectiveSeed = fnv1a32(`${kind}|${base}|${counter}`) >>> 0;
    const rnd = makeRng(effectiveSeed);
    const built = BUILDERS[kind](rnd);
    built.id = `${kind}-${base.toString(36)}-${counter}`;
    built.type = kind;
    built.tolerance = num(built.tolerance, 0);
    built.steps = Array.isArray(built.steps) ? built.steps.map(String) : [];
    built.meta = Object.assign({}, built.meta || {}, { seed: base, counter, effectiveSeed });
    return built;
  }

  /* ---------- Checagem ---------- */

  function normalizeNumber(value) {
    if (typeof value === "number") return Number.isFinite(value) ? value : NaN;
    const raw = String(value == null ? "" : value).trim().replace(/\s+/g, "").replace(",", ".");
    return raw ? Number(raw) : NaN;
  }

  function normalizeWeekday(value) {
    let s = String(value == null ? "" : value).trim().toLowerCase();
    s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    s = s.replace(/-feira$/, "").replace(/\bfeira\b/g, "").replace(/^dia\s+/, "").trim();
    return s;
  }

  function weekdayIndex(value) {
    const s = normalizeWeekday(value);
    const map = { domingo: 0, segunda: 1, seg: 1, terca: 2, quarta: 3, quinta: 4, sexta: 5, sabado: 6 };
    if (Object.prototype.hasOwnProperty.call(map, s)) return map[s];
    const n = Number(s);
    return Number.isInteger(n) && n >= 0 && n <= 6 ? n : -1;
  }

  function check(type, question, answer) {
    if (!question || typeof question !== "object") return false;
    const kind = type || question.type;
    if (kind === "doomsday") {
      const want = weekdayIndex(question.answer);
      return want >= 0 && weekdayIndex(answer) === want;
    }
    const got = normalizeNumber(answer);
    const want = normalizeNumber(question.answer);
    if (!Number.isFinite(got) || !Number.isFinite(want)) {
      return String(answer == null ? "" : answer).trim().toLowerCase()
        === String(question.answer == null ? "" : question.answer).trim().toLowerCase();
    }
    const tol = Math.max(0, num(question.tolerance, 0));
    return Math.abs(got - want) <= (tol || 1e-9) + 1e-9;
  }

  /* ---------- Registro e cronômetro ---------- */

  function logEntry(entry) {
    const s = storage();
    if (!s) return null;
    try {
      if (typeof s.recordMentalGym === "function") return s.recordMentalGym(entry);
      if (typeof s.logSimulator === "function") {
        return s.logSimulator("mental",
          `${entry.type}: ${entry.prompt} → ${entry.answer} (${entry.correct ? "acerto" : "erro"}, ${entry.timeMs} ms)`);
      }
    } catch (e) { /* registro nunca interrompe a sessão */ }
    return null;
  }

  function root() {
    return (typeof document !== "undefined") ? document.getElementById("mentalRoot") : null;
  }

  function clearTimer() {
    if (state.rafId !== null && typeof cancelAnimationFrame === "function") cancelAnimationFrame(state.rafId);
    if (state.timerId !== null && typeof clearInterval === "function") clearInterval(state.timerId);
    state.rafId = null;
    state.timerId = null;
  }

  function startTimer() {
    clearTimer();
    state.questionStart = now();
    const useRaf = typeof requestAnimationFrame === "function";
    const tick = () => {
      const el = (typeof document !== "undefined") ? document.getElementById("mentalTimer") : null;
      if (el) el.textContent = `${Math.max(0, Math.round(now() - state.questionStart))} ms`;
      if (useRaf) state.rafId = requestAnimationFrame(tick);
    };
    if (useRaf) state.rafId = requestAnimationFrame(tick);
    else { tick(); state.timerId = setInterval(tick, 100); }
  }

  function stats() {
    const total = state.results.length;
    const correct = state.results.filter(r => r.correct).length;
    const sumMs = state.results.reduce((s, r) => s + r.timeMs, 0);
    return {
      type: state.type,
      total,
      answered: total,
      correct,
      accuracy: total ? Math.round(correct / total * 1000) / 10 : 0,
      streak: state.streak,
      bestStreak: state.bestStreak,
      avgTimeMs: total ? Math.round(sumMs / total) : 0,
      lastTimeMs: state.lastTimeMs,
      running: state.stage === "playing"
    };
  }

  /* ---------- Markup ---------- */

  function statsHTML() {
    const s = stats();
    return `<div class="f9-gym-stats">
      <span class="f9-metric">Acertos <b>${esc(s.correct)}/${esc(s.total)}</b></span>
      <span class="f9-metric">Precisão <b>${esc(s.accuracy)}%</b></span>
      <span class="f9-metric">Sequência <b>${esc(s.streak)}</b> (máx. ${esc(s.bestStreak)})</span>
      <span class="f9-metric">Tempo médio <b>${esc(s.avgTimeMs)} ms</b></span>
    </div>`;
  }

  function menuHTML() {
    const cards = GENERATORS.map(g => `
      <button type="button" class="f9-btn f9-btn--ghost" style="min-height:48px" onclick="MentalGym.start('${esc(g.id)}')">
        <b>${esc(g.label)}</b><br><small class="f9-muted">${esc(g.hint)}</small>
      </button>`).join("");
    return `<div class="f9-gym">
      <div class="f9-section">
        <span class="f9-pill">Escolha um gerador</span>
        <p class="f9-muted">Sessão nova a cada escolha. O cronômetro mede apenas a pergunta atual; os passos aparecem depois da resposta.</p>
        <div class="f9-grid--2">${cards}</div>
      </div>
      ${statsHTML()}
    </div>`;
  }

  function questionHTML() {
    const q = state.question;
    const gen = GENERATORS.find(g => g.id === state.type) || GENERATORS[0];
    const isWeekday = state.type === "doomsday";
    const answer = isWeekday ? `
      <div class="f9-gym-choices" role="group" aria-label="Dias da semana">
        ${WEEKDAYS.map(w => `<button type="button" data-weekday="${esc(w)}" aria-pressed="${state.selectedWeekday === w}"
          style="min-height:48px" onclick="MentalGym.chooseWeekday('${esc(w)}')">${esc(w)}</button>`).join("")}
      </div>` : `
      <label class="f9-muted" for="mentalInput">Sua resposta</label>
      <input id="mentalInput" class="f9-gym-input" type="text" inputmode="decimal" autocomplete="off"
        style="min-height:48px" placeholder="Digite e pressione Enter" value="${esc(state.answerText)}"
        oninput="MentalGym.setAnswer(this.value)" onkeydown="if(event.key==='Enter'){MentalGym.submit()}">`;
    return `<div class="f9-gym">
      <div class="f9-section">
        <span class="f9-pill">${esc(gen.label)}</span>
        <span class="f9-pill f9-gym-timer" id="mentalTimer">0 ms</span>
        <p class="f9-gym-question">${esc(q.prompt)}</p>
        ${answer}
        <div class="actions">
          <button type="button" class="f9-btn f9-btn--primary" style="min-height:48px" onclick="MentalGym.submit()">Responder</button>
          <button type="button" class="f9-btn f9-btn--ghost" style="min-height:48px" onclick="MentalGym.stop()">Parar</button>
        </div>
      </div>
      ${statsHTML()}
    </div>`;
  }

  function feedbackHTML() {
    const q = state.question;
    const steps = (q.steps || []).map(s => `<li>${esc(s)}</li>`).join("");
    return `<div class="f9-gym">
      <div class="f9-section">
        <span class="f9-pill">${state.lastCorrect ? "✓ Correto" : "✗ Incorreto"}</span>
        <p class="f9-gym-question">${esc(q.prompt)}</p>
        <p class="f9-muted">Resposta correta: <b>${esc(q.answer)}</b> · Você respondeu: <b>${esc(state.lastGiven || "—")}</b> · ${esc(state.lastTimeMs)} ms</p>
        <ol class="f9-gym-steps">${steps}</ol>
        <div class="actions">
          <button type="button" class="f9-btn f9-btn--primary" style="min-height:48px" onclick="MentalGym.next()">Próxima</button>
          <button type="button" class="f9-btn f9-btn--ghost" style="min-height:48px" onclick="MentalGym.stop()">Parar</button>
        </div>
      </div>
      ${statsHTML()}
    </div>`;
  }

  function stoppedHTML() {
    const s = stats();
    return `<div class="f9-gym">
      <div class="f9-section">
        <span class="f9-pill">Sessão encerrada</span>
        <p class="f9-gym-question">${esc(s.total)} pergunta(s) · ${esc(s.correct)} acerto(s) · precisão de ${esc(s.accuracy)}%.</p>
        <p class="f9-muted">Tempo médio por pergunta: ${esc(s.avgTimeMs)} ms. Melhor sequência: ${esc(s.bestStreak)}.</p>
        <div class="actions">
          <button type="button" class="f9-btn f9-btn--primary" style="min-height:48px" onclick="MentalGym.start('${esc(state.type)}')">Recomeçar</button>
          <button type="button" class="f9-btn f9-btn--ghost" style="min-height:48px" onclick="MentalGym.menu()">Escolher gerador</button>
        </div>
      </div>
      ${statsHTML()}
    </div>`;
  }

  function refresh() {
    const el = root();
    if (!el || !state.mounted) return;
    if (state.stage === "menu") el.innerHTML = menuHTML();
    else if (state.stage === "playing") el.innerHTML = questionHTML();
    else if (state.stage === "feedback") el.innerHTML = feedbackHTML();
    else el.innerHTML = stoppedHTML();
  }

  function renderPage(view) {
    if (!view || typeof view.innerHTML === "undefined") return;
    clearTimer();
    state.mounted = true;
    state.stage = "menu";
    state.question = null;
    state.results = [];
    state.streak = 0;
    state.bestStreak = 0;
    state.answerText = "";
    state.selectedWeekday = "";
    view.innerHTML = `<div class="eyebrow">Treinamento mental · seis operações</div>
      <h1 class="h1">Academia Mental</h1>
      <p class="sub">Treine cálculo mental com passos revelados só depois da resposta: soma da esquerda para a direita, multiplicação cruzada, quadrados, porcentagens, raízes e regra do Doomsday.</p>
      <div id="mentalRoot"></div>`;
    refresh();
  }

  /* ---------- Fluxo ---------- */

  function start(type) {
    clearTimer();
    if (type && Object.prototype.hasOwnProperty.call(BUILDERS, type)) state.type = type;
    state.results = [];
    state.streak = 0;
    state.bestStreak = 0;
    state.counter = 0;
    state.answerText = "";
    state.selectedWeekday = "";
    state.answered = false;
    state.lastTimeMs = 0;
    state.question = generate(state.type);
    state.stage = "playing";
    if (state.mounted) { refresh(); startTimer(); }
    return state.question;
  }

  function setType(type) {
    if (!Object.prototype.hasOwnProperty.call(BUILDERS, type)) return false;
    if (state.stage === "playing" || state.stage === "feedback" || state.stage === "stopped") {
      return Boolean(start(type));
    }
    clearTimer();
    state.type = type;
    refresh();
    return true;
  }

  function setAnswer(value) {
    state.answerText = String(value == null ? "" : value).slice(0, 120);
  }

  function chooseWeekday(value) {
    const idx = weekdayIndex(value);
    if (idx < 0) return false;
    state.selectedWeekday = WEEKDAYS[idx];
    if (typeof document !== "undefined" && typeof document.querySelectorAll === "function") {
      const buttons = document.querySelectorAll("#mentalRoot .f9-gym-choices button");
      if (buttons && typeof buttons.forEach === "function") {
        buttons.forEach(b => b.setAttribute("aria-pressed", String(b.getAttribute("data-weekday") === state.selectedWeekday)));
      }
    }
    return true;
  }

  function submit() {
    if (state.stage !== "playing" || !state.question) return false;
    clearTimer();
    const timeMs = Math.max(0, Math.round(now() - state.questionStart));
    const input = (typeof document !== "undefined") ? document.getElementById("mentalInput") : null;
    const given = state.type === "doomsday"
      ? (state.selectedWeekday || (input ? input.value : ""))
      : ((input && input.value !== undefined && input.value !== "") ? input.value : state.answerText);
    const correct = check(state.type, state.question, given);
    state.answered = true;
    state.lastGiven = String(given == null ? "" : given);
    state.lastCorrect = correct;
    state.lastTimeMs = timeMs;
    state.results.push({ correct, timeMs, type: state.type });
    if (correct) {
      state.streak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
    } else state.streak = 0;
    logEntry({
      at: new Date().toISOString(),
      type: state.type,
      prompt: state.question.prompt,
      answer: given,
      correct,
      timeMs,
      seed: state.question.meta.effectiveSeed
    });
    state.stage = "feedback";
    refresh();
    return correct;
  }

  function next() {
    if (state.stage !== "feedback") return false;
    state.answerText = "";
    state.selectedWeekday = "";
    state.answered = false;
    state.question = generate(state.type);
    state.stage = "playing";
    refresh();
    startTimer();
    return true;
  }

  function stop() {
    clearTimer();
    state.stage = "stopped";
    if (state.mounted) refresh();
    return stats();
  }

  function menu() {
    clearTimer();
    state.stage = "menu";
    state.question = null;
    if (state.mounted) refresh();
    return true;
  }

  if (typeof window !== "undefined") {
    window.MentalGym = {
      GENERATORS, WEEKDAYS, state,
      generate, check, start, submit, next, stop, stats, renderPage, setType,
      setAnswer, chooseWeekday, menu, refresh,
      weekdayForDate, doomsdayWeekday, centuryAnchor, isLeap,
      normalizeWeekday, weekdayIndex
    };
  }
})();

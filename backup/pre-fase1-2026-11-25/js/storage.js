/* ============================================================
   FORGE — storage.js
   Gerenciamento de estado, localStorage, export/import
   ============================================================ */

const STORE_KEY = "forge.study.v2";
const CURRENT_VERSION = 2;

function defaultState() {
  return {
    version: CURRENT_VERSION,
    done: [],
    mistakes: [],
    cards: {},
    hours: 0,
    weeklyGoal: 7,
    sessionDate: null,
    streak: 0,
    dayLog: {},
    feynman: {},
    notes: {},
    theme: "light",
    labDone: [],
    lastVisit: new Date().toISOString().slice(0, 10),
    placementDone: false,
    placementResult: null,
    timerSessions: [],
    mentalMathHistory: [],
    focus: {
      sessions: [],
      progress: {},
      goals: { dailyMinutes: 25, weeklyMinutes: 150 },
      lastSession: null
    },
    plan: {
      goal: null,
      weeklyHours: 5,
      deadline: null,
      enrolled: [],
      milestones: {},
      custom: []
    },
    assessments: {},
    // Seção 11 — TDAH e gamificação.
    xp: 0,
    level: 1,
    xpLog: [],
    feynmanAwarded: {},
    shieldUsedWeek: null,
    tmvDoneToday: false,
    tmvDate: null,
    pomodoros: 0,
    pomodoroLog: [],
    redoStreak: 0,
    rewards: { daily: "", weekly: "", monthly: "" },
    settings: {
      animations: true,
      sound: false,
      compactMode: false,
      autoSave: true
    }
  };
}

let state = null;

/* ---------- Utilitários de data (usados por erros, TMV e escudo) ---------- */

function isoDay(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().slice(0, 10);
}

function addDaysISO(iso, days) {
  const d = iso ? new Date(`${String(iso).slice(0, 10)}T12:00:00`) : new Date();
  d.setDate(d.getDate() + days);
  return isoDay(d);
}

// Chave da semana ISO (segunda-feira como início). Usada para o escudo semanal.
function weekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function levelFromXP(xp) {
  const n = Math.max(0, Number(xp) || 0);
  if (n < 300) return 1;
  if (n < 700) return 2;
  if (n < 1200) return 3;
  if (n < 2000) return 4;
  return 5 + Math.floor((n - 2000) / 1000);
}

function levelFloor(level) {
  const n = Math.max(1, Number(level) || 1);
  if (n === 1) return 0;
  if (n === 2) return 300;
  if (n === 3) return 700;
  if (n === 4) return 1200;
  if (n === 5) return 2000;
  return 2000 + (n - 5) * 1000;
}

// Normaliza estados antigos e incompletos sem descartar dados já salvos.
function normalizeState(raw) {
  const fresh = defaultState();
  const out = { ...fresh, ...(raw || {}), version: CURRENT_VERSION };
  out.settings = { ...fresh.settings, ...((raw && raw.settings) || {}) };
  out.focus = { ...fresh.focus, ...((raw && raw.focus) || {}) };
  out.plan = { ...fresh.plan, ...((raw && raw.plan) || {}) };
  out.rewards = { ...fresh.rewards, ...((raw && raw.rewards) || {}) };
  out.xp = Number(out.xp) || 0;
  out.level = levelFromXP(out.xp);
  out.pomodoros = Number(out.pomodoros) || 0;
  out.xpLog = Array.isArray(out.xpLog) ? out.xpLog.slice(-200) : [];
  out.pomodoroLog = Array.isArray(out.pomodoroLog) ? out.pomodoroLog.slice(-200) : [];
  out.feynmanAwarded = out.feynmanAwarded && typeof out.feynmanAwarded === "object" ? out.feynmanAwarded : {};
  out.mistakes = Array.isArray(out.mistakes) ? out.mistakes.map(m => {
    const fixed = { ...m };
    fixed.category = ["E1", "E2", "E3", "E4"].includes(m.category) ? m.category : "";
    fixed.date = m.date || isoDay();
    fixed.nextReview = m.nextReview || addDaysISO(fixed.date, 7);
    fixed.redoCount = Number(m.redoCount) || 0;
    fixed.corrected = Boolean(m.corrected);
    return fixed;
  }) : [];
  if (out.tmvDate !== isoDay()) {
    out.tmvDoneToday = false;
    out.tmvDate = null;
  }
  return out;
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.version !== CURRENT_VERSION) {
        state = migrateState(parsed);
      } else {
        state = normalizeState(parsed);
      }
    } else {
      state = defaultState();
    }
  } catch (e) {
    console.error("Erro ao carregar estado:", e);
    state = defaultState();
  }
  updateStreak();
  return state;
}

function migrateState(oldState) {
  const migrated = normalizeState(oldState);
  if (!Array.isArray(migrated.timerSessions)) migrated.timerSessions = [];
  if (!Array.isArray(migrated.mentalMathHistory)) migrated.mentalMathHistory = [];
  if (!migrated.placementDone) migrated.placementDone = false;
  if (!Array.isArray(migrated.plan.enrolled)) migrated.plan.enrolled = [];
  if (!Array.isArray(migrated.plan.custom)) migrated.plan.custom = [];
  if (!migrated.plan.milestones || typeof migrated.plan.milestones !== "object") migrated.plan.milestones = {};
  if (!migrated.assessments || typeof migrated.assessments !== "object") migrated.assessments = {};
  if (!migrated.focus || typeof migrated.focus !== "object") migrated.focus = defaultState().focus;
  if (!migrated.focus.goals || typeof migrated.focus.goals !== "object") migrated.focus.goals = defaultState().focus.goals;
  saveState(migrated);
  return migrated;
}

function saveState(newState = state) {
  try {
    if (newState) state = newState;
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.error("Erro ao salvar:", e);
    if (typeof toast === "function") {
      toast("Não foi possível salvar. Verifique espaço do navegador.");
    }
    return false;
  }
}

function getState() {
  if (!state) loadState();
  return state;
}

function updateStreak() {
  const today = isoDay();
  const yesterday = addDaysISO(today, -1);
  const twoDaysAgo = addDaysISO(today, -2);
  if (state.tmvDate !== today) {
    state.tmvDoneToday = false;
    state.tmvDate = null;
  }
  if (state.lastVisit !== today) {
    const hadShield = state.shieldUsedWeek === weekKey();
    if (state.lastVisit === yesterday) {
      state.streak = (state.streak || 0) + 1;
    } else if (state.lastVisit === twoDaysAgo && !hadShield) {
      // Um dia perdido não zera a sequência: consome o escudo da semana.
      state.shieldUsedWeek = weekKey();
    } else {
      state.streak = 1;
    }
    state.lastVisit = today;
    saveState();
  }
}

function resetState() {
  state = defaultState();
  saveState();
  return state;
}

function exportData() {
  const data = {
    version: CURRENT_VERSION,
    exportedAt: new Date().toISOString(),
    state: { ...state }
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `forge-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast("Backup exportado com sucesso!");
}

function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const importedState = parsed.state || parsed;
        if (!importedState || !Array.isArray(importedState.done)) {
          throw new Error("Formato inválido");
        }
        const migrated = normalizeState(importedState);
        state = migrated;
        saveState();
        toast("Progresso importado com sucesso!");
        resolve(true);
      } catch (err) {
        console.error("Erro ao importar:", err);
        toast("Arquivo inválido ou incompatível.");
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    reader.readAsText(file);
  });
}

function addHours(hours, date = new Date().toISOString().slice(0, 10)) {
  if (hours <= 0 || hours > 12) return false;
  state.hours = (state.hours || 0) + hours;
  state.dayLog[date] = (state.dayLog[date] || 0) + hours;
  updateStreak();
  saveState();
  return true;
}

function getWeeklyHours() {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const startStr = weekStart.toISOString().slice(0, 10);
  return Object.entries(state.dayLog || {})
    .filter(([d]) => d >= startStr)
    .reduce((sum, [, h]) => sum + h, 0);
}

function markLessonDone(lessonId) {
  if (!state.done.includes(lessonId)) {
    state.done.push(lessonId);
    saveState();
    return true;
  }
  return false;
}

function awardXP(amount, reason) {
  const gain = Math.max(0, Math.round(Number(amount) || 0));
  if (!gain) return { gained: 0, level: state.level || 1, leveledUp: false };
  const before = levelFromXP(state.xp || 0);
  state.xp = (state.xp || 0) + gain;
  state.level = levelFromXP(state.xp);
  state.xpLog.push({ date: new Date().toISOString(), amount: gain, reason: String(reason || "Atividade") });
  if (state.xpLog.length > 200) state.xpLog = state.xpLog.slice(-200);
  saveState();
  const leveledUp = state.level > before;
  if (typeof Gamification !== "undefined" && Gamification.refreshUI) Gamification.refreshUI();
  return { gained: gain, level: state.level, leveledUp };
}

function addMistake(lessonId, track, question, answer, category = "") {
  const key = `${lessonId}|${question}`;
  if (!state.mistakes.some(m => `${m.lesson}|${m.question}` === key)) {
    const date = new Date().toISOString();
    state.mistakes.push({
      lesson: lessonId,
      track,
      question,
      answer,
      date,
      category: ["E1", "E2", "E3", "E4"].includes(category) ? category : "",
      nextReview: addDaysISO(date, 7),
      redoCount: 0,
      corrected: false
    });
    saveState();
  }
}

function setMistakeCategory(index, category) {
  const m = state.mistakes[index];
  if (!m || !["E1", "E2", "E3", "E4", ""].includes(category)) return false;
  m.category = category;
  saveState();
  return true;
}

// Refazer com acerto: +7 dias; após 2 acertos sem consulta, +30 dias e dominado.
function reviewMistake(index, success = true) {
  const m = state.mistakes[index];
  if (!m) return null;
  m.redoCount = Number(m.redoCount) || 0;
  if (success) {
    m.redoCount += 1;
    m.corrected = m.redoCount >= 2;
    m.nextReview = addDaysISO(isoDay(), m.corrected ? 30 : 7);
  } else {
    m.corrected = false;
    m.nextReview = addDaysISO(isoDay(), 1);
  }
  saveState();
  return { corrected: m.corrected, redoCount: m.redoCount, nextReview: m.nextReview };
}

function removeMistake(index) {
  if (index >= 0 && index < state.mistakes.length) {
    state.mistakes.splice(index, 1);
    saveState();
  }
}

function saveFeynman(lessonId, text) {
  const isNew = !state.feynmanAwarded[lessonId] && String(text || "").trim().length >= 80;
  state.feynman[lessonId] = text;
  if (isNew) {
    state.feynmanAwarded[lessonId] = true;
    awardXP(30, "Explicação Feynman completa");
  }
  saveState();
}

function saveGeneralNote(topic, text) {
  state.notes[topic] = text;
  saveState();
}

function toggleLab(id, on) {
  const had = state.labDone.includes(id);
  state.labDone = state.labDone.filter(x => x !== id);
  if (on) state.labDone.push(id);
  saveState();
  if (on && !had) awardXP(60, `Laboratório entregue: ${id}`);
}

function isLabDone(id) {
  return state.labDone.includes(id);
}

function setTheme(theme) {
  state.theme = theme;
  saveState();
  document.documentElement.dataset.theme = theme;
}

function getTheme() {
  return state.theme || "light";
}

function setSetting(key, value) {
  if (!state.settings) state.settings = defaultState().settings;
  state.settings[key] = value;
  saveState();
}

function getSetting(key) {
  return state.settings?.[key] ?? defaultState().settings[key];
}

function recordTimerSession(minutes, track, type = "study") {
  state.timerSessions.push({
    date: new Date().toISOString(),
    duration: minutes,
    track,
    type
  });
  saveState();
}

function recordMentalMath(correct, timeMs, difficulty) {
  state.mentalMathHistory.push({
    date: new Date().toISOString(),
    correct,
    timeMs,
    difficulty
  });
  if (state.mentalMathHistory.length > 500) {
    state.mentalMathHistory = state.mentalMathHistory.slice(-500);
  }
  saveState();
}

function getMentalMathStats() {
  const h = state.mentalMathHistory || [];
  const total = h.length;
  const correct = h.filter(x => x.correct).length;
  const avgTime = total > 0 ? h.reduce((s, x) => s + x.timeMs, 0) / total : 0;
  return { total, correct, accuracy: total ? (correct / total * 100).toFixed(1) : 0, avgTime: Math.round(avgTime) };
}

function setPlacementResult(result) {
  state.placementDone = true;
  state.placementResult = result;
  saveState();
}

function getPlacementResult() {
  return state.placementResult;
}

window.Storage = {
  load: loadState,
  save: saveState,
  updateStreak,
  get: getState,
  reset: resetState,
  export: exportData,
  import: importData,
  addHours,
  getWeeklyHours,
  markLessonDone,
  addMistake,
  setMistakeCategory,
  reviewMistake,
  removeMistake,
  awardXP,
  levelFromXP,
  levelFloor,
  weekKey,
  isoDay,
  addDaysISO,
  saveFeynman,
  saveGeneralNote,
  toggleLab,
  isLabDone,
  setTheme,
  getTheme,
  setSetting,
  getSetting,
  recordTimerSession,
  recordMentalMath,
  getMentalMathStats,
  setPlacementResult,
  getPlacementResult,
  defaultState
};

loadState();
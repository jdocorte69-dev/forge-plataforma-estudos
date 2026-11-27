/* ============================================================
   FORGE — storage.js
   Gerenciamento de estado, localStorage, export/import
   ============================================================ */

// FORGE 7.0 — namespace v7. As chaves v2/v3/v4/v5 continuam legíveis e são
// preservadas (nunca apagadas) para garantir retrocompatibilidade total.
const STORE_KEY_V5 = "forge.study.v5";
const STORE_KEY = "forge.study.v7";
const V4_KEY = "forge.study.v4";
const LEGACY_KEYS = ["forge.study.v2", "forge.study.v3", V4_KEY, STORE_KEY_V5];
const CURRENT_VERSION = 7;
// Cópia de segurança automática antes de qualquer migração/importação.
// A chave antiga é mantida por compatibilidade com backups já existentes;
// cada migração v4→v5 grava forge.study.v4.bak_[TIMESTAMP] e cada migração
// v5→v7 grava forge.study.v5.bak_[TIMESTAMP].
const BACKUP_KEY = "forge.study.v2.lastBackup";
const V4_BACKUP_PREFIX = "forge.study.v4.bak_";
const V5_BACKUP_PREFIX = "forge.study.v5.bak_";
const MIGRATION_KEY = "forge.study.v5.migration";
const V7_MIGRATION_KEY = "forge.study.v7.migration";
const V7_TMP_KEY = "forge.study.v7.tmp";

/* JSON Schema (subconjunto: type/required/properties/items/enum/min/max) usado
   para validar o estado antes de gravar e após a leitura. Nenhuma dependência
   externa: o validador roda no navegador e no Node/vm dos testes. */
const FORGE_V7_SCHEMA = {
  type: "object",
  required: ["version", "userId", "done", "mistakes", "cards", "progress", "settings", "forge4", "forge7"],
  properties: {
    version: { type: "number", minimum: 1 },
    versionString: { type: "string" },
    userId: { type: "string" },
    created_at: { type: "number" },
    updated_at: { type: "number" },
    done: { type: "array", items: { type: "string" } },
    declared: { type: "array", items: { type: "string" } },
    mistakes: { type: "array", items: { type: "object" } },
    cards: { type: "object" },
    assessments: { type: "object" },
    mastery: { type: "object" },
    feynman: { type: "object" },
    notes: { type: "object" },
    hours: { type: "number", minimum: 0 },
    streak: { type: "number", minimum: 0 },
    xp: { type: "number", minimum: 0 },
    level: { type: "number", minimum: 1 },
    theme: { type: "string", enum: ["dark", "light"] },
    progress: { type: "object", required: ["tracks", "lessons"], properties: { tracks: { type: "object" }, lessons: { type: "object" } } },
    settings: { type: "object" },
    plan: { type: "object" },
    focus: { type: "object" },
    study: { type: "object" },
    forge4: { type: "object", required: ["masteryInvariant"], properties: { masteryInvariant: { type: "object" } } },
    forge7: { type: "object", required: ["schema", "masteryInvariant", "lc"], properties: { schema: { type: "string" }, masteryInvariant: { type: "object" }, lc: { type: "object" } } },
    simLogs: { type: "array" }
  }
};

function validateAgainstSchema(value, schema, path = "$", errors = []) {
  if (!schema || typeof schema !== "object") return errors;
  const type = schema.type;
  const ok = type === "array" ? Array.isArray(value)
    : type === "object" ? (value !== null && typeof value === "object" && !Array.isArray(value))
    : type === "null" ? value === null
    : type === "number" ? (typeof value === "number" && Number.isFinite(value))
    : type === "integer" ? Number.isInteger(value)
    : typeof value === type;
  if (type && !ok) {
    errors.push(`${path}: esperado ${type}, recebido ${value === null ? "null" : typeof value}`);
    return errors;
  }
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${path}: valor fora do enum permitido`);
  if (typeof value === "number") {
    if (Number.isFinite(schema.minimum) && value < schema.minimum) errors.push(`${path}: abaixo do mínimo ${schema.minimum}`);
    if (Number.isFinite(schema.maximum) && value > schema.maximum) errors.push(`${path}: acima do máximo ${schema.maximum}`);
  }
  if (Array.isArray(schema.required) && ok) {
    schema.required.forEach(key => {
      if (!(key in value)) errors.push(`${path}.${key}: campo obrigatório ausente`);
    });
  }
  if (schema.properties && ok && value && typeof value === "object") {
    Object.entries(schema.properties).forEach(([key, sub]) => {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        validateAgainstSchema(value[key], sub, `${path}.${key}`, errors);
      }
    });
  }
  if (schema.items && Array.isArray(value)) {
    value.forEach((item, i) => validateAgainstSchema(item, schema.items, `${path}[${i}]`, errors));
  }
  return errors;
}

function validateStateV7(state) {
  return validateAgainstSchema(state, FORGE_V7_SCHEMA);
}

// FNV-1a 32-bit: usa a implementação compartilhada quando disponível e mantém
// uma cópia idêntica como fallback (storage.js também roda isolado em Node/vm).
function fnv1a32(value) {
  if (typeof window !== "undefined" && window.ForgeMathUtils?.fnv1a32) {
    return window.ForgeMathUtils.fnv1a32(value) >>> 0;
  }
  let h = 2166136261 >>> 0;
  const str = String(value == null ? "" : value);
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

// Serialização canônica: o checksum não depende da ordem das chaves do JSON.
function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    const raw = JSON.stringify(value);
    return raw === undefined ? "null" : raw;
  }
  if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
  return "{" + Object.keys(value).sort().map(k =>
    JSON.stringify(k) + ":" + stableStringify(value[k])
  ).join(",") + "}";
}

function checksumState(value) {
  return fnv1a32(stableStringify(value)).toString(16).padStart(8, "0");
}

function backupTimestamp() {
  return new Date().toISOString().replace(/[-:.TZ]/g, "");
}

// Critério invariante de domínio (schema v5): nota ≥ 8.0 e Feynman ≥ 30 chars.
function isLessonMastered(score, feynman) {
  const n = Number(score);
  return Number.isFinite(n) && n >= 8 && String(feynman || "").trim().length >= 30;
}

// Chave determinística do usuário: alimenta os embaralhamentos (FNV-1a + LCG).
// O prefixo v5 é preservado para que embaralhamentos antigos não mudem de ordem.
function userSeed(userId) {
  return fnv1a32(`forge-v5|${String(userId || "")}`) >>> 0;
}

/* FORGE 7.0 — LCG determinístico (a=1664525, c=1013904223, m=2^32).
   Math.imul + >>>0 implementa a aritmética modular de 32 bits sem perda. */
const V7_LCG = { a: 1664525, c: 1013904223, m: 4294967296 };
function lcgNext(seed) {
  return (Math.imul(seed >>> 0, V7_LCG.a) + V7_LCG.c) >>> 0;
}
function lcgFloat(seed) {
  return lcgNext(seed) / V7_LCG.m;
}
function lcgShuffle(items, seed) {
  const out = Array.isArray(items) ? items.slice() : [];
  let s = (seed >>> 0) || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = lcgNext(s);
    const j = s % (i + 1);
    const tmp = out[i]; out[i] = out[j]; out[j] = tmp;
  }
  return out;
}

// Identificador local estável: usado como semente do embaralhamento
// determinístico (FNV-1a + LCG) junto com o ID da aula. Não é dado pessoal
// nem é enviado a qualquer serviço externo.
function makeUserId() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch (e) { /* ambiente sem Web Crypto: usa o fallback abaixo */ }
  return "local-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}

function defaultState() {
  return {
    version: CURRENT_VERSION,
    versionString: "7.0.0",
    userId: makeUserId(),
    created_at: Date.now(),
    updated_at: Date.now(),
    user_profile: {
      name: "Estudante Mestre",
      target_pace: "intensive",
      daily_goal_minutes: 240
    },
    // Projeção didática do schema v5. Os arrays/objetos planos (done, mastery,
    // cards, feynman...) permanecem intactos: progress é espelho aditivo.
    progress: { tracks: {}, lessons: {} },
    oral_exam_history: [],
    bug_hunt_history: [],
    crypto_lab_state: {},
    done: [],
    // Conclusão sem evidência: guardada separadamente, sem selo de domínio.
    declared: [],
    mistakes: [],
    cards: {},
    hours: 0,
    weeklyGoal: 7,
    sessionDate: null,
    streak: 0,
    dayLog: {},
    feynman: {},
    notes: {},
    // Novo padrão FORGE 3.0: OLED escuro. Usuários antigos mantêm o tema salvo.
    theme: "dark",
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
    // Enciclopédia (Fase 1) — domínio, evidências e metadados de recursos.
    mastery: {},
    labEvidence: {},
    resourceMeta: {},
    assessmentLog: [],
    // Evolução — estudo guiado, tutor local, fichas de artigo e diagnóstico de lacunas.
    // Espaço aditivo dentro do schema v3: nenhum dado antigo é sobrescrito.
    study: {
      sessions: {},
      tutor: {},
      articles: {},
      gaps: [],
      lastSessionKey: ""
    },
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
      autoSave: true,
      fontScale: 15,
      highContrast: false
    },
    // FORGE 3.0 — espaços aditivos do schema v4. Nenhum campo antigo é sobrescrito.
    forge3: {
      trails: {},
      simulators: {
        logic: { runs: 0, lastRun: null },
        cpu: { runs: 0, lastRun: null },
        ai: { runs: 0, lastRun: null }
      },
      pwaVersion: 6,
      migratedAt: null
    },
    // FORGE 4.0 — espaços aditivos do schema v5. Nada do v4 é reestruturado.
    forge4: {
      migratedAt: null,
      sourceVersion: null,
      sourceChecksum: null,
      userSeed: null,
      pwaVersion: 7,
      pedagogy: "7-degraus",
      masteryInvariant: { minScore: 8, minFeynmanChars: 30 },
      cryptoVersion: 1,
      booksIndex: null
    },
    // FORGE 7.0 — espaços aditivos do schema v7. Nenhum dado v5 é reestruturado.
    forge7: {
      schema: "forge.study.v7",
      migratedAt: null,
      sourceVersion: 5,
      sourceChecksum: null,
      userSeed: null,
      pwaVersion: 8,
      masteryInvariant: { minScore: 8, minFeynmanChars: 30 },
      lc: { a: 1664525, c: 1013904223, m: 4294967296 },
      pedagogy: {
        didacticSteps: 7,
        historicalAutopsies: 10,
        curriculum: { math: ["M1", "M2", "M3", "M4", "M5", "M6"], computing: ["C1", "C2", "C3", "C4", "C5", "C6"] }
      },
      studyProtocol: { steps: [], activeStep: 0, bookKey: null, errorTaxonomy: ["E1", "E2", "E3", "E4"] },
      learningScience: { retrieval: 0, interleaving: 0, deliberate: 0, cognitiveLoad: 0, sleepHygiene: 0, implementationIntentions: [] },
      radar: { history: [] },
      masterSummaries: {},
      libraryVerified: []
    },
    simLogs: []
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
  // Versões posteriores à atual nunca são rebaixadas: preservamos o número original.
  const future = Number(raw && raw.version) > CURRENT_VERSION;
  const out = { ...fresh, ...(raw || {}), version: future ? Number(raw.version) : CURRENT_VERSION };
  if (typeof out.userId !== "string" || !out.userId) out.userId = fresh.userId;
  // FORGE 4.0: normalização aditiva — nenhum campo v4 é sobrescrito.
  if (!Number.isFinite(Number(out.created_at))) out.created_at = fresh.created_at;
  if (!Number.isFinite(Number(out.updated_at))) out.updated_at = Date.now();
  out.versionString = Number(out.version) >= 7 ? "7.0.0" : "5.0.0";
  const profileRaw = out.user_profile && typeof out.user_profile === "object" && !Array.isArray(out.user_profile) ? out.user_profile : {};
  out.user_profile = { ...fresh.user_profile, ...profileRaw };
  const progressRaw = out.progress && typeof out.progress === "object" && !Array.isArray(out.progress) ? out.progress : {};
  out.progress = { ...fresh.progress, ...progressRaw };
  for (const key of ["tracks", "lessons"]) {
    const bucket = out.progress[key];
    out.progress[key] = bucket && typeof bucket === "object" && !Array.isArray(bucket) ? bucket : {};
  }
  for (const key of ["oral_exam_history", "bug_hunt_history"]) {
    out[key] = Array.isArray(out[key]) ? out[key].slice(-200) : [];
  }
  const cryptoRaw = out.crypto_lab_state && typeof out.crypto_lab_state === "object" && !Array.isArray(out.crypto_lab_state) ? out.crypto_lab_state : {};
  out.crypto_lab_state = cryptoRaw;
  const forge4Raw = out.forge4 && typeof out.forge4 === "object" && !Array.isArray(out.forge4) ? out.forge4 : {};
  out.forge4 = { ...fresh.forge4, ...forge4Raw };
  out.forge4.masteryInvariant = { ...fresh.forge4.masteryInvariant, ...(forge4Raw.masteryInvariant || {}) };
  if (!Number.isFinite(Number(out.forge4.userSeed))) out.forge4.userSeed = userSeed(out.userId);
  // FORGE 7.0: mescla espaços aditivos sem apagar avaliações, radar ou notas já salvas.
  const forge7Raw = out.forge7 && typeof out.forge7 === "object" && !Array.isArray(out.forge7) ? out.forge7 : {};
  out.forge7 = { ...fresh.forge7, ...forge7Raw };
  out.forge7.schema = "forge.study.v7";
  // Invariante de domínio inalterado: nota ≥ 8 e Feynman ≥ 30 caracteres.
  out.forge7.masteryInvariant = { ...fresh.forge7.masteryInvariant };
  out.forge7.lc = { ...fresh.forge7.lc, ...(forge7Raw.lc || {}) };
  out.forge7.pedagogy = {
    ...fresh.forge7.pedagogy,
    ...(forge7Raw.pedagogy || {}),
    curriculum: {
      ...fresh.forge7.pedagogy.curriculum,
      ...((forge7Raw.pedagogy && forge7Raw.pedagogy.curriculum) || {})
    }
  };
  out.forge7.studyProtocol = { ...fresh.forge7.studyProtocol, ...(forge7Raw.studyProtocol || {}) };
  if (!Array.isArray(out.forge7.studyProtocol.steps)) out.forge7.studyProtocol.steps = [];
  out.forge7.learningScience = { ...fresh.forge7.learningScience, ...(forge7Raw.learningScience || {}) };
  if (!Array.isArray(out.forge7.learningScience.implementationIntentions)) out.forge7.learningScience.implementationIntentions = [];
  out.forge7.radar = { ...fresh.forge7.radar, ...(forge7Raw.radar || {}) };
  if (!Array.isArray(out.forge7.radar.history)) out.forge7.radar.history = [];
  for (const key of ["masterSummaries", "libraryVerified"]) {
    const bucket = out.forge7[key];
    out.forge7[key] = bucket && typeof bucket === "object" && !Array.isArray(bucket) ? bucket : (key === "libraryVerified" ? [] : {});
  }
  if (!Number.isFinite(Number(out.forge7.userSeed))) out.forge7.userSeed = lcgNext(userSeed(out.userId));
  out.settings = { ...fresh.settings, ...((raw && raw.settings) || {}) };
  out.focus = { ...fresh.focus, ...((raw && raw.focus) || {}) };
  out.plan = { ...fresh.plan, ...((raw && raw.plan) || {}) };
  out.rewards = { ...fresh.rewards, ...((raw && raw.rewards) || {}) };
  // Espaços da Enciclopédia: objetos por chave, nunca substituídos por arrays/lixo.
  for (const key of ["mastery", "labEvidence", "resourceMeta"]) {
    out[key] = out[key] && typeof out[key] === "object" && !Array.isArray(out[key]) ? out[key] : {};
  }
  // Evolução: normaliza apenas o espaço novo, preservando o que já existir.
  const studyRaw = out.study && typeof out.study === "object" && !Array.isArray(out.study) ? out.study : {};
  out.study = { ...fresh.study, ...studyRaw };
  for (const key of ["sessions", "tutor", "articles"]) {
    const bucket = out.study[key];
    out.study[key] = bucket && typeof bucket === "object" && !Array.isArray(bucket) ? bucket : {};
  }
  out.study.gaps = Array.isArray(out.study.gaps) ? out.study.gaps.slice(-200) : [];
  out.study.lastSessionKey = typeof out.study.lastSessionKey === "string" ? out.study.lastSessionKey : "";
  out.assessmentLog = Array.isArray(out.assessmentLog) ? out.assessmentLog.slice(-300) : [];
  // FORGE 3.0: mescla os espaços aditivos sem descartar progresso de simuladores.
  const forge3Raw = out.forge3 && typeof out.forge3 === "object" && !Array.isArray(out.forge3) ? out.forge3 : {};
  out.forge3 = { ...fresh.forge3, ...forge3Raw };
  out.forge3.trails = forge3Raw.trails && typeof forge3Raw.trails === "object" && !Array.isArray(forge3Raw.trails) ? forge3Raw.trails : {};
  const simsRaw = forge3Raw.simulators && typeof forge3Raw.simulators === "object" && !Array.isArray(forge3Raw.simulators) ? forge3Raw.simulators : {};
  out.forge3.simulators = {};
  for (const key of ["logic", "cpu", "ai"]) {
    const sim = simsRaw[key] && typeof simsRaw[key] === "object" ? simsRaw[key] : {};
    out.forge3.simulators[key] = {
      runs: Number(sim.runs) || 0,
      lastRun: typeof sim.lastRun === "string" ? sim.lastRun : null
    };
  }
  out.simLogs = Array.isArray(out.simLogs) ? out.simLogs.slice(-200) : [];
  for (const key of ["done", "declared", "labDone", "timerSessions", "mentalMathHistory"]) {
    if (!Array.isArray(out[key])) out[key] = [];
  }
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
  let stored = null;
  let storedKey = null;
  try {
    // v5 é a fonte canônica. Se ainda não existir, as chaves v4/v3/v2 são
    // lidas em ordem e migradas — nenhuma delas é apagada.
    stored = localStorage.getItem(STORE_KEY);
    if (stored) storedKey = STORE_KEY;
    if (!stored) {
      for (const legacyKey of LEGACY_KEYS) {
        const legacyRaw = localStorage.getItem(legacyKey);
        if (legacyRaw) {
          stored = legacyRaw;
          storedKey = legacyKey;
          break;
        }
      }
    }
    if (stored) {
      const parsed = JSON.parse(stored);
      const version = Number(parsed.version);
      if (version > CURRENT_VERSION) {
        // Estado de versão futura: usar sem rebaixar nem sobrescrever.
        state = normalizeState(parsed);
      } else if (version !== CURRENT_VERSION) {
        state = migrateState(parsed, false, stored, storedKey);
      } else {
        state = normalizeState(parsed);
      }
    } else {
      state = defaultState();
    }
  } catch (e) {
    console.error("Erro ao carregar estado:", e);
    // Preserva a string corrompida antes de qualquer substituição em memória.
    backupState(stored);
    backupRawSnapshot(stored, storedKey);
    state = defaultState();
  }
  updateStreak();
  return state;
}

// Backup com timestamp por versão de origem (v4→v5 e v5→v7 conforme a especificação).
function backupRawSnapshot(raw, sourceKey = V4_KEY, forcedPrefix = null) {
  if (!raw) return null;
  const version = sourceKey === V4_KEY ? 4
    : sourceKey === STORE_KEY_V5 ? 5
    : sourceKey === STORE_KEY ? CURRENT_VERSION
    : Number(safeParse(raw)?.version) || 4;
  const prefix = forcedPrefix || (version >= 5 ? V5_BACKUP_PREFIX : V4_BACKUP_PREFIX);
  const key = `${prefix}${backupTimestamp()}`;
  const parsed = safeParse(raw);
  try {
    localStorage.setItem(key, JSON.stringify({
      savedAt: new Date().toISOString(),
      from: `forge.study.v${version}`,
      to: STORE_KEY,
      version,
      checksum: checksumState(parsed),
      algorithm: "FNV-1a-32",
      state: typeof parsed === "string" ? raw : parsed
    }));
    return key;
  } catch (e) {
    console.warn("Não foi possível criar backup versionado:", e);
    return null;
  }
}

function safeParse(raw) {
  try { return JSON.parse(raw); } catch (e) { return raw; }
}

// Guarda o estado original antes de qualquer migração. Nunca apaga um backup anterior
// se a gravação falhar, e não tenta salvar novamente durante a importação.
function backupState(raw) {
  if (!raw) return false;
  const isRawText = typeof raw === "string";
  try {
    localStorage.setItem(BACKUP_KEY, JSON.stringify({
      savedAt: new Date().toISOString(),
      version: isRawText ? CURRENT_VERSION : (Number(raw.version) || 1),
      state: raw,
      ...(isRawText ? { corrupted: true } : {})
    }));
    return true;
  } catch (e) {
    console.warn("Não foi possível criar backup automático:", e);
    return false;
  }
}

// v4 → v5: transformação aditiva, com backup antes de qualquer mutação e
// verificação da gravação. Retorna o estado migrado; em caso de falha de
// integridade, o payload original é restaurado e o erro é sinalizado.
function migrateV4ToV5(oldState, rawText = null, skipBackup = false) {
  const sourceVersion = Number(oldState?.version) || 4;
  const raw = rawText || JSON.stringify(oldState);
  const checksum = checksumState(oldState);
  const declared = oldState?.forge4?.sourceChecksum || oldState?.forge4?.migration?.sourceChecksum || null;
  if (declared && declared !== checksum) {
    const err = new Error(`Checksum divergente (${declared} ≠ ${checksum}): migração abortada`);
    err.code = "CHECKSUM_MISMATCH";
    err.declared = declared;
    err.checksum = checksum;
    throw err;
  }
  let backupKey = null;
  if (!skipBackup) {
    backupState(oldState);
    backupKey = backupRawSnapshot(raw, V4_KEY);
  }
  const migrated = normalizeState(oldState);
  if (!migrated.placementDone) migrated.placementDone = false;
  if (!Array.isArray(migrated.plan.enrolled)) migrated.plan.enrolled = [];
  if (!Array.isArray(migrated.plan.custom)) migrated.plan.custom = [];
  if (!migrated.plan.milestones || typeof migrated.plan.milestones !== "object") migrated.plan.milestones = {};
  if (!migrated.assessments || typeof migrated.assessments !== "object") migrated.assessments = {};
  if (!migrated.focus || typeof migrated.focus !== "object") migrated.focus = defaultState().focus;
  if (!migrated.focus.goals || typeof migrated.focus.goals !== "object") migrated.focus.goals = defaultState().focus.goals;
  if (!migrated.forge3.migratedAt) migrated.forge3.migratedAt = new Date().toISOString();

  migrated.version = 5;
  migrated.versionString = "5.0.0";
  migrated.updated_at = Date.now();
  migrated.forge4 = {
    ...migrated.forge4,
    migratedAt: new Date().toISOString(),
    sourceVersion,
    sourceChecksum: checksum,
    userSeed: userSeed(migrated.userId),
    pwaVersion: 7
  };
  rebuildProgress(migrated);

  // Atomicidade: backup já gravado; a escrita v5 só é confirmada após leitura.
  // O namespace v5 continua sendo gravado — a promoção para v7 é feita à parte.
  let written = false;
  try {
    localStorage.setItem(STORE_KEY_V5, JSON.stringify(migrated));
    written = true;
  } catch (e) { console.warn("Não foi possível gravar o namespace v5:", e); }
  let verified = false;
  if (written) {
    try {
      const check = JSON.parse(localStorage.getItem(STORE_KEY_V5) || "null");
      verified = Boolean(check && check.version === 5 && check.userId === migrated.userId &&
        check.forge4?.sourceChecksum === checksum && check.done?.length === (migrated.done || []).length);
    } catch (e) { verified = false; }
  }
  if (!verified) {
    // Rollback: devolve o payload v4 original e mantém o backup intacto.
    try { localStorage.setItem(V4_KEY, raw); } catch (e) { /* sem espaço: backup preservado */ }
    state = normalizeState(safeParse(raw));
    const err = new Error("Falha na verificação pós-gravação da migração v5");
    err.code = "MIGRATION_WRITE_FAILED";
    throw err;
  }
  try {
    localStorage.setItem(MIGRATION_KEY, JSON.stringify({
      at: migrated.forge4.migratedAt,
      from: sourceVersion,
      to: 5,
      backupKey,
      checksum,
      userId: migrated.userId,
      status: "complete"
    }));
  } catch (e) { console.warn("Marcador de migração não gravado:", e); }
  return migrated;
}

// v5 → v7: promoção atômica, validada por JSON Schema e com backup versionado.
// Nenhum dado do v5 é reestruturado; userId e o invariante de domínio são preservados.
function migrateV5ToV7(oldState, rawText = null, skipBackup = false) {
  const sourceVersion = Number(oldState?.version) || 5;
  if (sourceVersion >= CURRENT_VERSION) return normalizeState(oldState);
  const raw = rawText || JSON.stringify(oldState);
  const checksum = checksumState(oldState);
  let backupKey = null;
  if (!skipBackup) {
    backupState(oldState);
    backupKey = backupRawSnapshot(raw, STORE_KEY_V5, V5_BACKUP_PREFIX);
  }
  const migrated = normalizeState(oldState);
  migrated.version = CURRENT_VERSION;
  migrated.versionString = "7.0.0";
  migrated.updated_at = Date.now();
  migrated.forge7 = {
    ...(migrated.forge7 || {}),
    schema: "forge.study.v7",
    migratedAt: new Date().toISOString(),
    sourceVersion,
    sourceChecksum: checksum,
    userSeed: lcgNext(userSeed(migrated.userId)),
    pwaVersion: 8,
    masteryInvariant: { minScore: 8, minFeynmanChars: 30 },
    lc: { ...V7_LCG }
  };
  rebuildProgress(migrated);

  const errors = validateStateV7(migrated);
  if (errors.length) {
    const err = new Error(`Validação de schema v7 falhou: ${errors.slice(0, 3).join("; ")}`);
    err.code = "SCHEMA_VALIDATION_FAILED";
    err.errors = errors;
    throw err;
  }

  // Escrita atômica: grava em temporário, verifica, promove e só então limpa.
  let tmpWritten = false;
  try {
    localStorage.setItem(V7_TMP_KEY, JSON.stringify(migrated));
    tmpWritten = true;
  } catch (e) { console.warn("Não foi possível gravar o staging v7:", e); }
  let verified = false;
  if (tmpWritten) {
    try {
      const staged = JSON.parse(localStorage.getItem(V7_TMP_KEY) || "null");
      verified = Boolean(staged && validateStateV7(staged).length === 0 &&
        staged.version === CURRENT_VERSION && staged.userId === migrated.userId &&
        staged.forge7?.sourceChecksum === checksum &&
        (staged.done || []).length === (migrated.done || []).length &&
        checksumState(staged) === checksumState(migrated));
      if (verified) localStorage.setItem(STORE_KEY, JSON.stringify(staged));
    } catch (e) { verified = false; }
  }
  if (verified) {
    try {
      const finalCheck = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      verified = Boolean(finalCheck && finalCheck.version === CURRENT_VERSION &&
        finalCheck.userId === migrated.userId && checksumState(finalCheck) === checksumState(migrated));
    } catch (e) { verified = false; }
  }
  if (!verified) {
    // Rollback: o payload v5 original volta ao seu namespace; backup permanece.
    try { localStorage.setItem(STORE_KEY_V5, raw); } catch (e) { /* sem espaço */ }
    state = normalizeState(safeParse(raw));
    const err = new Error("Falha na verificação pós-gravação da migração v7");
    err.code = "MIGRATION_WRITE_FAILED";
    throw err;
  }
  try { localStorage.removeItem(V7_TMP_KEY); } catch (e) { /* staging órfão é inofensivo */ }
  try {
    localStorage.setItem(V7_MIGRATION_KEY, JSON.stringify({
      at: migrated.forge7.migratedAt,
      from: sourceVersion,
      to: CURRENT_VERSION,
      backupKey,
      checksum,
      userId: migrated.userId,
      status: "complete"
    }));
  } catch (e) { console.warn("Marcador de migração v7 não gravado:", e); }
  return migrated;
}

// v2/v3 → v5 → v7 e v4 → v5 → v7: cadeia aditiva; nenhum campo antigo é removido.
function migrateState(oldState, skipBackup = false, rawText = null, sourceKey = null) {
  const sourceVersion = Number(oldState?.version) || 1;
  if (sourceVersion >= CURRENT_VERSION) return normalizeState(oldState);
  if (sourceVersion === 5) return migrateV5ToV7(oldState, rawText, skipBackup);
  if (sourceVersion === 4) {
    const v5 = migrateV4ToV5(oldState, rawText, skipBackup);
    return migrateV5ToV7(v5, JSON.stringify(v5), skipBackup);
  }
  if (!skipBackup) {
    backupState(oldState);
    backupRawSnapshot(rawText || JSON.stringify(oldState), sourceKey || `forge.study.v${sourceVersion}`);
  }
  const migrated = normalizeState(oldState);
  if (!migrated.placementDone) migrated.placementDone = false;
  if (!Array.isArray(migrated.plan.enrolled)) migrated.plan.enrolled = [];
  if (!Array.isArray(migrated.plan.custom)) migrated.plan.custom = [];
  if (!migrated.plan.milestones || typeof migrated.plan.milestones !== "object") migrated.plan.milestones = {};
  if (!migrated.assessments || typeof migrated.assessments !== "object") migrated.assessments = {};
  if (!migrated.focus || typeof migrated.focus !== "object") migrated.focus = defaultState().focus;
  if (!migrated.focus.goals || typeof migrated.focus.goals !== "object") migrated.focus.goals = defaultState().focus.goals;
  if (!migrated.forge3.migratedAt) migrated.forge3.migratedAt = new Date().toISOString();
  migrated.version = 5;
  migrated.versionString = "5.0.0";
  migrated.updated_at = Date.now();
  migrated.forge4 = {
    ...migrated.forge4,
    migratedAt: new Date().toISOString(),
    sourceVersion,
    sourceChecksum: checksumState(oldState),
    userSeed: userSeed(migrated.userId),
    pwaVersion: 7
  };
  rebuildProgress(migrated);
  try { localStorage.setItem(STORE_KEY_V5, JSON.stringify(migrated)); } catch (e) { console.warn(e); }
  return migrateV5ToV7(migrated, JSON.stringify(migrated), skipBackup);
}

// Projeta o progresso plano (v4) no formato didático do schema v5 sem apagar
// nenhum dado: mastery/done/cards/feynman continuam sendo a fonte canônica.
function rebuildProgress(target = state) {
  if (!target || typeof target !== "object") return null;
  const tracks = target.progress?.tracks && typeof target.progress.tracks === "object" ? { ...target.progress.tracks } : {};
  const lessons = target.progress?.lessons && typeof target.progress.lessons === "object" ? { ...target.progress.lessons } : {};
  const mastery = target.mastery && typeof target.mastery === "object" ? target.mastery : {};

  for (const [id, raw] of Object.entries(mastery)) {
    const m = raw && typeof raw === "object" ? raw : { mastered: Boolean(raw) };
    const entry = { ...(lessons[id] || {}) };
    const score = Number(m.score ?? m.grade ?? m.nota ?? entry.score);
    const feynman = String(m.feynman_synthesis ?? m.feynman ?? target.feynman?.[id] ?? entry.feynman_synthesis ?? "");
    if (Number.isFinite(score)) entry.score = score;
    if (feynman) entry.feynman_synthesis = feynman;
    if (m.last_reviewed_at) entry.last_reviewed_at = m.last_reviewed_at;
    const card = m.sm2_card || target.cards?.[id] || entry.sm2_card;
    if (card && typeof card === "object") {
      entry.sm2_card = {
        interval: Number(card.interval) || 0,
        repetition: Number(card.repetition) || 0,
        efactor: Number(card.efactor) || 2.5,
        next_review: Number(card.next_review) || 0
      };
    }
    const invariant = Number.isFinite(score) ? isLessonMastered(score, feynman) : false;
    entry.mastered = Boolean(m.mastered || m.dominada || entry.mastered || invariant);
    lessons[id] = entry;
  }

  const ids = new Set([...Object.keys(lessons), ...(Array.isArray(target.done) ? target.done : []), ...Object.keys(target.cards || {})]);
  for (const id of ids) {
    const entry = { ...(lessons[id] || {}) };
    const card = target.cards?.[id];
    if (card && typeof card === "object" && !entry.sm2_card) {
      entry.sm2_card = {
        interval: Number(card.interval) || 0,
        repetition: Number(card.repetition) || 0,
        efactor: Number(card.efactor) || 2.5,
        next_review: Number(card.next_review) || 0
      };
    }
    const feynman = String(target.feynman?.[id] ?? entry.feynman_synthesis ?? "");
    if (feynman && !entry.feynman_synthesis) entry.feynman_synthesis = feynman;
    if (!("mastered" in entry)) entry.mastered = false;
    lessons[id] = entry;
  }

  const trails = target.forge3?.trails && typeof target.forge3.trails === "object" ? target.forge3.trails : {};
  for (const [key, val] of Object.entries(trails)) {
    if (!tracks[key]) {
      tracks[key] = {
        status: (val && val.status) || "in_progress",
        mastery_percentage: Number(val?.mastery_percentage) || 0
      };
    }
  }
  target.progress = { ...(target.progress || {}), tracks, lessons };
  return target.progress;
}

// Idempotente: garante que o namespace v7 exista e esteja normalizado mesmo
// quando o app.js é carregado depois do storage.js. Retorna o estado atual.
function ensureV7() {
  if (!state) return loadState();
  // Verifica o que já estava persistido antes de normalizar: um userId recém
  // gerado precisa ser gravado uma única vez para que a semente seja estável.
  let persistedUserId = null;
  try {
    const raw = localStorage.getItem(STORE_KEY) || localStorage.getItem(STORE_KEY_V5) || localStorage.getItem(V4_KEY);
    if (raw) persistedUserId = JSON.parse(raw).userId;
  } catch (e) { persistedUserId = null; }
  if (Number(state.version) !== CURRENT_VERSION) {
    state = migrateState(state);
  } else {
    state = normalizeState(state);
  }
  if (!state.forge4?.userSeed) state.forge4 = { ...(state.forge4 || {}), userSeed: userSeed(state.userId) };
  if (!state.forge7?.userSeed) state.forge7 = { ...(state.forge7 || {}), userSeed: lcgNext(userSeed(state.userId)) };
  if (!persistedUserId) saveState(state);
  return state;
}

// Aliases históricos: módulos externos que chamavam ensureV4/ensureV5 continuam funcionando.
const ensureV5 = ensureV7;
const ensureV4 = ensureV7;

// Ponto de entrada público usado no topo de app.js (Fase 2).
function migrateStorage() {
  return ensureV7();
}

function getMigrationInfo() {
  try {
    const raw = localStorage.getItem(V7_MIGRATION_KEY) || localStorage.getItem(MIGRATION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function saveState(newState = state) {
  try {
    if (newState) state = newState;
    if (!state) return false;
    // Validação de schema antes de gravar: um estado corrompido em memória nunca
    // substitui um backup íntegro no localStorage.
    const errors = validateStateV7(state);
    if (errors.length && Number(state.version) === CURRENT_VERSION) {
      console.warn("Estado v7 inválido não gravado:", errors.slice(0, 5));
      return false;
    }
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
        const importedVersion = Number(importedState.version || parsed.version || 1);
        if (!Number.isFinite(importedVersion) || importedVersion < 1) {
          throw new Error(`Versão ${importedVersion} inválida (esperado 1 a ${CURRENT_VERSION})`);
        }
        if (importedVersion > CURRENT_VERSION) {
          // Leitura (loadState) preserva versões futuras sem rebaixá-las. Importação,
          // porém, não pode rebaixar campos desconhecidos: aborta ANTES de qualquer
          // backup/mutação, mantendo o estado atual intacto e informando o usuário.
          const err = new Error(`Versão ${importedVersion} incompatível (esperado 1 a ${CURRENT_VERSION})`);
          err.code = "FUTURE_VERSION";
          err.version = importedVersion;
          throw err;
        }
        // Backup do estado atual antes de substituí-lo; logs de erro sem dados sensíveis.
        backupState({ ...(state || {}), version: (state && state.version) || CURRENT_VERSION });
        const migrated = migrateState(importedState, true);
        state = migrated;
        saveState();
        toast(`Progresso importado com sucesso${importedVersion < CURRENT_VERSION ? ` (v${importedVersion} → v${CURRENT_VERSION})` : ""}!`);
        resolve(true);
      } catch (err) {
        if (err && err.code === "FUTURE_VERSION") {
          // Incompatibilidade esperada: não é corrupção, não descarta dados locais.
          console.warn("Importação cancelada:", err.message);
          toast(`Importação cancelada: arquivo v${err.version} é mais novo que este aplicativo (v${CURRENT_VERSION}). Seus dados atuais foram preservados.`);
        } else {
          console.error("Erro ao importar:", err);
          toast("Arquivo inválido ou incompatível.");
        }
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
  return state.theme || "dark";
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

/* ---------- FORGE 4.0 — históricos e estado dos novos módulos ---------- */

function recordOralExam(entry) {
  const s = getState();
  if (!Array.isArray(s.oral_exam_history)) s.oral_exam_history = [];
  const record = { at: new Date().toISOString(), ...(entry || {}) };
  s.oral_exam_history.push(record);
  s.oral_exam_history = s.oral_exam_history.slice(-200);
  s.updated_at = Date.now();
  saveState(s);
  return record;
}

function getOralExamStats() {
  const history = getState().oral_exam_history || [];
  const scored = history.filter(h => Number.isFinite(Number(h.score)));
  const avg = scored.length
    ? scored.reduce((sum, h) => sum + Number(h.score), 0) / scored.length
    : 0;
  return { total: history.length, scored: scored.length, avg: Number(avg.toFixed(2)), consecutivePasses: (() => {
    let n = 0;
    for (let i = scored.length - 1; i >= 0 && Number(scored[i].score) >= 8; i--) n++;
    return n;
  })() };
}

function recordBugHunt(entry) {
  const s = getState();
  if (!Array.isArray(s.bug_hunt_history)) s.bug_hunt_history = [];
  const record = { at: new Date().toISOString(), ...(entry || {}) };
  s.bug_hunt_history.push(record);
  s.bug_hunt_history = s.bug_hunt_history.slice(-200);
  s.updated_at = Date.now();
  saveState(s);
  return record;
}

function updateCryptoLabState(patch) {
  const s = getState();
  s.crypto_lab_state = { ...(s.crypto_lab_state || {}), ...(patch || {}) };
  s.updated_at = Date.now();
  saveState(s);
  return s.crypto_lab_state;
}

function getCryptoLabState() {
  return getState().crypto_lab_state || {};
}

/* ---------- Espaço de estudo guiado (schema v3, aditivo) ---------- */

function getStudyState() {
  const s = getState();
  if (!s.study || typeof s.study !== "object") s.study = defaultState().study;
  return s.study;
}

function getStudySession(key) {
  const k = String(key || "");
  return getStudyState().sessions[k] || null;
}

function saveStudySession(key, patch) {
  const study = getStudyState();
  const k = String(key || "");
  const previous = study.sessions[k] && typeof study.sessions[k] === "object" ? study.sessions[k] : {};
  study.sessions[k] = { ...previous, ...(patch || {}), updatedAt: new Date().toISOString() };
  if (!study.sessions[k].createdAt) study.sessions[k].createdAt = study.sessions[k].updatedAt;
  study.lastSessionKey = k;
  saveState();
  return study.sessions[k];
}

function saveStudyArticle(key, article) {
  const study = getStudyState();
  study.articles[String(key)] = { ...(article || {}), savedAt: new Date().toISOString() };
  saveState();
  return study.articles[String(key)];
}

function addStudyGap(gap) {
  const study = getStudyState();
  study.gaps.push({ ...(gap || {}), date: new Date().toISOString() });
  if (study.gaps.length > 200) study.gaps = study.gaps.slice(-200);
  saveState();
  return study.gaps[study.gaps.length - 1];
}

// FORGE 3.0 — registra uma execução de simulador sem apagar o histórico de
// progresso. O log é limitado a 200 entradas para não inflar o localStorage.
function logSimulator(name, detail) {
  const s = getState();
  const key = ["logic", "cpu", "ai"].includes(name) ? name : "logic";
  if (!s.forge3 || typeof s.forge3 !== "object") s.forge3 = defaultState().forge3;
  if (!s.forge3.simulators || typeof s.forge3.simulators !== "object") s.forge3.simulators = {};
  const rec = s.forge3.simulators[key] || { runs: 0, lastRun: null };
  rec.runs = (Number(rec.runs) || 0) + 1;
  rec.lastRun = new Date().toISOString();
  s.forge3.simulators[key] = rec;
  if (!Array.isArray(s.simLogs)) s.simLogs = [];
  s.simLogs.push({
    at: rec.lastRun,
    simulator: key,
    detail: typeof detail === "string" ? detail.slice(0, 240) : ""
  });
  s.simLogs = s.simLogs.slice(-200);
  saveState(s);
  return rec;
}

/* ---------- FORGE 7.0 — espaços aditivos do schema v7 ---------- */

function getForge7State() {
  const s = getState();
  if (!s.forge7 || typeof s.forge7 !== "object") s.forge7 = defaultState().forge7;
  return s.forge7;
}

// Protocolo de estudo em 5 passos: inspeção estrutural → leitura em blocos →
// reconstrução ativa → exercícios escalonados + caderno de erros → Feynman.
function setStudyProtocolStep(index, patch = {}) {
  const f7 = getForge7State();
  const step = Math.max(0, Math.min(4, Number(index) || 0));
  const entry = { ...(f7.studyProtocol.steps[step] || {}), ...(patch || {}), at: new Date().toISOString() };
  f7.studyProtocol.steps[step] = entry;
  f7.studyProtocol.activeStep = step;
  if (patch && patch.bookKey) f7.studyProtocol.bookKey = String(patch.bookKey);
  saveState();
  return entry;
}

// Radar SM-2: histórico leve de avaliações (nota, domínio, revisões).
function recordRadar(entry) {
  const f7 = getForge7State();
  f7.radar.history.push({ at: new Date().toISOString(), ...(entry || {}) });
  f7.radar.history = f7.radar.history.slice(-200);
  saveState();
  return f7.radar.history[f7.radar.history.length - 1];
}

// Ciência do estudo: contadores de recuperação, intercalação, prática deliberada,
// carga cognitiva, higiene do sono e intenções de implementação.
function recordLearningScience(kind, payload = {}) {
  const f7 = getForge7State();
  const keys = ["retrieval", "interleaving", "deliberate", "cognitiveLoad", "sleepHygiene"];
  if (keys.includes(kind)) {
    f7.learningScience[kind] = (Number(f7.learningScience[kind]) || 0) + 1;
  } else if (kind === "implementationIntentions") {
    const list = f7.learningScience.implementationIntentions;
    list.push({ at: new Date().toISOString(), ...(payload || {}) });
    if (list.length > 100) list.splice(0, list.length - 100);
  }
  saveState();
  return f7.learningScience;
}

function setMasterSummary(bookKey, meta = {}) {
  const f7 = getForge7State();
  f7.masterSummaries[String(bookKey)] = {
    ...(f7.masterSummaries[String(bookKey)] || {}),
    ...(meta || {}),
    updatedAt: new Date().toISOString()
  };
  saveState();
  return f7.masterSummaries[String(bookKey)];
}

function setLibraryVerified(links) {
  const f7 = getForge7State();
  f7.libraryVerified = Array.isArray(links) ? links.slice(0, 200) : [];
  saveState();
  return f7.libraryVerified;
}

window.Storage = {
  load: loadState,
  logSimulator,
  migrate: migrateStorage,
  ensureV4,
  ensureV5,
  ensureV7,
  migrateV4ToV5,
  migrateV5ToV7,
  validateStateV7,
  lcgNext,
  lcgFloat,
  lcgShuffle,
  V7_LCG,
  STORE_KEY,
  STORE_KEY_V5,
  CURRENT_VERSION,
  getForge7State,
  setStudyProtocolStep,
  recordRadar,
  recordLearningScience,
  setMasterSummary,
  setLibraryVerified,
  fnv1a32,
  stableStringify,
  checksumState,
  userSeed,
  isLessonMastered,
  rebuildProgress,
  migrateV4ToV5,
  getMigrationInfo,
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
  recordOralExam,
  getOralExamStats,
  recordBugHunt,
  updateCryptoLabState,
  getCryptoLabState,
  getStudyState,
  getStudySession,
  saveStudySession,
  saveStudyArticle,
  addStudyGap,
  defaultState
};

loadState();
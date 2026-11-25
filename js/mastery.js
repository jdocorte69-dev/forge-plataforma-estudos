/* ============================================================
   FORGE — mastery.js
   Fase 2: domínio por evidência (domínio ≠ XP), rubrica 8/10,
   mapa N0–N4 e calendário de revisão. Carregado depois de
   storage.js, app.js, gamification.js e dados; expõe window.Mastery.
   Nenhuma função aqui concede XP: o selo é apenas domínio.
   ============================================================ */

(function () {
  "use strict";

  const APPROVAL_SCORE = 8;
  const MAX_SCORE = 10;
  const MIN_FEYNMAN = 80;
  const LOG_LIMIT = 300;

  const DIMENSIONS = [
    {
      key: "explicacao",
      label: "Explicação",
      max: 2,
      requirement: "Explicação própria (Feynman) com pelo menos 80 caracteres, sem copiar o texto da aula."
    },
    {
      key: "exercicios",
      label: "Exercícios",
      max: 3,
      requirement: "Melhor nota ≥8/10 sem consulta, registrada em assessments[lessonId].best."
    },
    {
      key: "aplicacao",
      label: "Aplicação",
      max: 2,
      requirement: "Prática aplicada: laboratório vinculado marcado como feito ou registro em mastery[lessonId].application."
    },
    {
      key: "laboratorio",
      label: "Laboratório",
      max: 2,
      requirement: "Evidência de laboratório vinculada à aula: mastery[lessonId].lab ou labEvidence com artefato registrado."
    },
    {
      key: "erros",
      label: "Erros",
      max: 1,
      requirement: "Erro desta aula corrigido em revisão posterior (mistakes.corrected)."
    }
  ];

  const STOP = new Set([
    "aula", "aulas", "conceito", "conceitos", "correspondente", "duvidas", "escreva",
    "explique", "laboratorio", "materia", "observe", "pratique", "registre", "resolva",
    "simulacao", "simulado", "texto", "todos", "determinacao", "compare", "comando",
    "exemplo", "exemplos", "objetivo", "resultado", "simples", "real", "mesma", "cada"
  ]);

  /* --------------------------- utilitários --------------------------- */

  function st() {
    return (typeof Storage !== "undefined" && typeof Storage.get === "function") ? Storage.get() : null;
  }

  function num(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function isObj(v) {
    return Boolean(v) && typeof v === "object" && !Array.isArray(v);
  }

  function esc(v) {
    if (typeof escHtml === "function") return escHtml(v);
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // String segura para dentro de onclick="Mastery.claim('...')".
  function attrJs(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/\r/g, "")
      .replace(/\n/g, "\\n")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isoDay() {
    return (typeof Storage !== "undefined" && typeof Storage.isoDay === "function")
      ? Storage.isoDay()
      : new Date().toISOString().slice(0, 10);
  }

  function addDaysISO(day, count) {
    if (typeof Storage !== "undefined" && typeof Storage.addDaysISO === "function") {
      return Storage.addDaysISO(day, count);
    }
    const d = new Date(`${String(day || isoDay()).slice(0, 10)}T12:00:00`);
    d.setDate(d.getDate() + Number(count));
    return d.toISOString().slice(0, 10);
  }

  function dayFromMs(ms) {
    const n = Number(ms);
    if (!Number.isFinite(n) || n <= 0) return "";
    try { return new Date(n).toISOString().slice(0, 10); } catch (e) { return ""; }
  }

  function tokens(text) {
    const out = new Set();
    String(text || "").toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ").split(/\s+/)
      .forEach(w => { if (w.length >= 4 && !STOP.has(w)) out.add(w); });
    return out;
  }

  function allLessons() {
    if (typeof lessons !== "undefined" && Array.isArray(lessons)) return lessons;
    const out = [];
    if (typeof CURRICULUM === "undefined") return out;
    Object.entries(CURRICULUM).forEach(([track, t]) => {
      (t && Array.isArray(t.modules) ? t.modules : []).forEach((m, mi) => {
        (m && Array.isArray(m.lessons) ? m.lessons : []).forEach((l, li) => {
          out.push({ ...l, track, module: mi, lesson: li, id: `${track}-${mi}-${li}`, moduleName: m.name });
        });
      });
    });
    return out;
  }

  function findLesson(lessonId) {
    const id = String(lessonId || "");
    return allLessons().find(l => l && l.id === id) || null;
  }

  function moduleOf(lesson) {
    if (!lesson || typeof CURRICULUM === "undefined") return null;
    const track = CURRICULUM[lesson.track];
    return track && Array.isArray(track.modules) ? (track.modules[lesson.module] || null) : null;
  }

  function labCatalog() {
    return (typeof window !== "undefined" && Array.isArray(window.LAB_CATALOG)) ? window.LAB_CATALOG : [];
  }

  function masteryOf(s, lessonId) {
    return s && isObj(s.mastery) && isObj(s.mastery[lessonId]) ? s.mastery[lessonId] : null;
  }

  function bestOf(s, lessonId) {
    const rec = s && isObj(s.assessments) ? s.assessments[lessonId] : null;
    return Math.max(0, Math.min(10, num(rec && rec.best)));
  }

  function feynmanChars(s, lessonId) {
    return String((s && isObj(s.feynman) ? s.feynman[lessonId] : "") || "").trim().length;
  }

  // Um registro só conta como evidência se houver artefato (texto, arquivo,
  // captura, código). Apenas "marquei como feito" continua sendo declaração.
  function hasArtifact(value) {
    if (typeof value === "string") return value.trim().length >= 12;
    if (!isObj(value)) return false;
    if (value.verified === false || value.done === false || value.status === "pendente") return false;
    const fields = ["evidence", "artifact", "proof", "file", "files", "note", "notes",
      "result", "output", "report", "answer", "response", "reflection", "code",
      "description", "text", "url", "link", "screenshot"];
    for (const key of fields) {
      const part = value[key];
      if (part === true) return true;
      if (Array.isArray(part) && part.length) return true;
      if (isObj(part) && Object.keys(part).length) return true;
      if (part != null && String(part).trim().length >= 12) return true;
    }
    return false;
  }

  function linkedLabIds(lesson, lessonId, record) {
    const ids = new Set();
    if (record && record.labId) ids.add(String(record.labId));
    if (lesson) {
      if (lesson.labId) ids.add(String(lesson.labId));
      if (Array.isArray(lesson.labIds)) lesson.labIds.forEach(x => ids.add(String(x)));
      const mod = moduleOf(lesson);
      if (mod && mod.labId) ids.add(String(mod.labId));
      const text = String(lesson.lab || (mod && mod.lab) || "");
      const lessonTokens = tokens(text);
      labCatalog().forEach(lab => {
        if (!lab || !lab.id) return;
        const id = String(lab.id);
        const title = String(lab.title || "");
        const hay = text.toLowerCase();
        if (hay.indexOf(id.toLowerCase()) >= 0) ids.add(id);
        if (title.length >= 6 && hay.indexOf(title.toLowerCase()) >= 0) ids.add(id);
        const labTokens = tokens(`${id} ${title} ${lab.objective || ""}`);
        let common = 0;
        labTokens.forEach(w => { if (lessonTokens.has(w)) common++; });
        if (common >= 2) ids.add(id);
      });
    }
    ids.delete("");
    return ids;
  }

  function evidenceForLesson(s, lesson, lessonId, record) {
    const raw = s && isObj(s.labEvidence) ? s.labEvidence : {};
    const ids = linkedLabIds(lesson, lessonId, record);
    const out = [];
    Object.keys(raw).forEach(key => {
      const value = raw[key];
      const obj = isObj(value) ? value : {};
      const refs = [];
      ["lesson", "lessonId", "lessonID", "lesson_id", "aula"].forEach(k => {
        if (obj[k] != null) refs.push(String(obj[k]));
      });
      if (Array.isArray(obj.lessons)) obj.lessons.forEach(x => refs.push(String(x)));
      const labRefs = [];
      ["labId", "lab", "lab_id"].forEach(k => {
        if (obj[k] != null) labRefs.push(String(obj[k]));
      });
      labRefs.push(key);
      const linked = refs.indexOf(String(lessonId)) >= 0 || key === String(lessonId) ||
        labRefs.some(r => ids.has(r));
      if (!linked) return;
      out.push({ key: String(key), value, artifact: hasArtifact(value) });
    });
    return out;
  }

  function labDeclared(s, lessonId, record, evidence, ids) {
    const done = Array.isArray(s && s.labDone) ? s.labDone.map(String) : [];
    if (done.indexOf(String(lessonId)) >= 0) return true;
    if (done.indexOf(`lab-${lessonId}`) >= 0 || done.indexOf(`lab:${lessonId}`) >= 0) return true;
    if (record && record.labDone === true) return true;
    const all = Array.from(ids).concat(evidence.map(e => e.key));
    return all.some(id => done.indexOf(id) >= 0);
  }

  function reviewCheck(s, lessonId, record) {
    const mistakes = Array.isArray(s && s.mistakes) ? s.mistakes : [];
    const corrected = mistakes.filter(m => isObj(m) && m.lesson === lessonId && m.corrected === true);
    if (corrected.length) {
      return { ok: true, detail: `${corrected.length} erro(s) desta aula corrigido(s) em revisão.` };
    }
    if (record && (record.reviewedAt || record.reviewDate || record.review === true || record.revisao === true)) {
      return { ok: true, detail: "Revisão posterior registrada no selo de domínio." };
    }
    const cards = s && isObj(s.cards) ? s.cards : {};
    const cardKey = [lessonId, `${lessonId}-0`, `review-${lessonId}`].find(k => {
      const c = cards[k];
      return isObj(c) && (num(c.level) > 0 || Boolean(c.reviewedAt));
    });
    if (cardKey) return { ok: true, detail: `Flashcard revisado registrado em cards.${cardKey}.` };
    const log = Array.isArray(s && s.assessmentLog) ? s.assessmentLog : [];
    if (log.some(e => isObj(e) && e.lessonId === lessonId &&
        (e.kind === "review" || e.type === "review" || e.review === true))) {
      return { ok: true, detail: "Revisão posterior registrada no histórico de avaliações." };
    }
    return { ok: false, detail: "Sem revisão posterior: refaça um erro ou registre uma revisão da aula." };
  }

  /* ---------------------------- API pública --------------------------- */

  function rubric() {
    return DIMENSIONS.map(d => ({ ...d }));
  }

  function lessonScore(lessonId) {
    const id = String(lessonId || "");
    const s = st() || {};
    const lesson = findLesson(id);
    const record = masteryOf(s, id);
    const best = bestOf(s, id);
    const chars = feynmanChars(s, id);
    const evidence = evidenceForLesson(s, lesson, id, record);
    const ids = linkedLabIds(lesson, id, record);
    const declared = labDeclared(s, id, record, evidence, ids);
    const app = record ? (record.application || record.aplicacao || record.practice) : null;
    const application = declared || app === true ||
      (isObj(app) ? Object.keys(app).length > 0 : String(app || "").trim().length >= 20) ||
      evidence.some(e => e.artifact && isObj(e.value) && Boolean(e.value.application || e.value.aplicacao));
    const labFlag = record ? (record.lab || record.laboratorio) : null;
    const labEvidence = evidence.filter(e => e.artifact);
    const lab = (isObj(labFlag) ? Object.keys(labFlag).length > 0 :
      labFlag === true || String(labFlag || "").trim().length >= 8) || labEvidence.length > 0;
    const review = reviewCheck(s, id, record);

    const exercisePoints = Math.min(3, Math.round((best / 10) * 3));
    const explainPoints = chars >= MIN_FEYNMAN ? 2 : 0;
    const applicationPoints = application ? 2 : 0;
    const labPoints = lab ? 2 : 0;
    const errorPoints = review.ok &&
      ( Array.isArray(s.mistakes) && s.mistakes.some(m => isObj(m) && m.lesson === id && m.corrected === true)
        ? 1 : 0 );

    const breakdown = {
      exercicios: {
        label: "Exercícios", points: exercisePoints, max: 3, ok: exercisePoints === 3,
        detail: `Melhor nota sem consulta: ${best}/10.`
      },
      explicacao: {
        label: "Explicação", points: explainPoints, max: 2, ok: explainPoints === 2,
        detail: `Feynman: ${chars} caracteres (mínimo ${MIN_FEYNMAN}).`
      },
      aplicacao: {
        label: "Aplicação", points: applicationPoints, max: 2, ok: applicationPoints === 2,
        detail: application ? "Prática aplicada registrada." : "Sem prática aplicada registrada."
      },
      laboratorio: {
        label: "Laboratório", points: labPoints, max: 2, ok: labPoints === 2,
        detail: lab ? (labEvidence.length ? "Evidência de laboratório vinculada." : "Laboratório registrado no selo.")
          : "Sem evidência de laboratório vinculada."
      },
      erros: {
        label: "Erros", points: errorPoints, max: 1, ok: errorPoints === 1,
        detail: errorPoints ? "Erro corrigido em revisão." : "Nenhum erro desta aula foi corrigido."
      }
    };

    const dimensions = {
      exercicios: exercisePoints,
      explicacao: explainPoints,
      aplicacao: applicationPoints,
      laboratorio: labPoints,
      erros: errorPoints
    };
    const score = DIMENSIONS.reduce((sum, d) => sum + dimensions[d.key], 0);
    return {
      score, max: MAX_SCORE, breakdown, dimensions, best, feynmanChars: chars,
      review, evidenceCount: evidence.length, labDeclared: declared
    };
  }

  function canClaim(lessonId) {
    const sc = lessonScore(lessonId);
    const criteria = [
      { key: "exercicios", label: "Exercícios ≥8/10 sem consulta", ok: sc.best >= 8,
        detail: `Melhor nota salva: ${sc.best}/10.` },
      { key: "explicacao", label: "Explicação própria com ≥80 caracteres", ok: sc.feynmanChars >= MIN_FEYNMAN,
        detail: `Feynman: ${sc.feynmanChars} caracteres.` },
      { key: "aplicacao", label: "Prática/aplicação registrada", ok: sc.dimensions.aplicacao === 2,
        detail: sc.breakdown.aplicacao.detail },
      { key: "laboratorio", label: "Evidência de laboratório vinculada", ok: sc.dimensions.laboratorio === 2,
        detail: sc.breakdown.laboratorio.detail },
      { key: "revisao", label: "Repetição em revisão posterior", ok: sc.review.ok, detail: sc.review.detail },
      { key: "rubrica", label: "Rubrica ≥8/10", ok: sc.score >= APPROVAL_SCORE,
        detail: `Pontuação obtida: ${sc.score}/${MAX_SCORE}.` }
    ];
    const reasons = criteria.filter(c => !c.ok).map(c => `${c.label}: ${c.detail}`);
    const critical = criteria.filter(c => c.key !== "rubrica" && !c.ok).map(c => c.label);
    return {
      ok: reasons.length === 0,
      reasons,
      score: sc.score,
      breakdown: sc.breakdown,
      dimensions: sc.dimensions,
      criteria,
      critical,
      best: sc.best,
      feynmanChars: sc.feynmanChars
    };
  }

  function claim(lessonId) {
    const id = String(lessonId || "");
    const check = canClaim(id);
    if (!check.ok) {
      if (typeof toast === "function") toast(`Domínio não registrado. ${check.reasons[0]}`);
      return { ok: false, reasons: check.reasons, score: check.score, breakdown: check.breakdown };
    }
    const s = st();
    if (!s) return { ok: false, reasons: ["Estado não disponível."], score: check.score };
    if (!isObj(s.mastery)) s.mastery = {};
    const lesson = findLesson(id);
    const claimedAt = new Date().toISOString();
    const record = {
      score: check.score,
      claimedAt,
      breakdown: check.breakdown,
      dimensions: check.dimensions
    };
    // Preserva evidências já registradas pelo usuário (application, lab, labId...).
    s.mastery[id] = { ...(isObj(s.mastery[id]) ? s.mastery[id] : {}), ...record };
    const entry = {
      type: "domain-seal",
      lessonId: id,
      track: lesson ? String(lesson.track) : "",
      score: check.score,
      dimensions: check.dimensions,
      breakdown: check.breakdown,
      claimedAt,
      xpAwarded: 0
    };
    if (!Array.isArray(s.assessmentLog)) s.assessmentLog = [];
    s.assessmentLog.push(entry);
    if (s.assessmentLog.length > LOG_LIMIT) s.assessmentLog = s.assessmentLog.slice(-LOG_LIMIT);
    const saved = (typeof Storage !== "undefined" && typeof Storage.save === "function")
      ? Storage.save() : false;
    if (typeof toast === "function") {
      toast(saved
        ? `Domínio registrado: ${check.score}/10. Selo de evidência, sem XP.`
        : "Domínio calculado, mas não foi possível salvar o progresso.");
    }
    return { ok: saved, score: check.score, claimedAt, record, reasons: saved ? [] : ["Falha ao salvar."] };
  }

  function isMastered(lessonId) {
    const s = st();
    const rec = masteryOf(s, String(lessonId || ""));
    return Boolean(rec && rec.claimedAt && num(rec.score) >= APPROVAL_SCORE);
  }

  function statusFromPercent(percent) {
    if (percent <= 0) return "N0";
    if (percent < 40) return "N1";
    if (percent < 70) return "N2";
    if (percent < 100) return "N3";
    return "N4";
  }

  function moduleStatus(trackKey, moduleIndex) {
    const track = String(trackKey || "");
    const index = Number(moduleIndex);
    const ids = allLessons()
      .filter(l => l && l.track === track && Number(l.module) === index)
      .map(l => l.id);
    const mastered = ids.filter(id => isMastered(id)).length;
    const percent = ids.length ? Math.round(mastered / ids.length * 100) : 0;
    return { mastered, total: ids.length, percent, status: statusFromPercent(percent) };
  }

  function dueCardsCount() {
    const s = st() || {};
    let due = 0;
    if (typeof Exercises !== "undefined" && typeof Exercises.getSpacedCards === "function") {
      try { due = (Exercises.getSpacedCards() || []).length; } catch (e) { due = 0; }
    } else {
      const cards = isObj(s.cards) ? s.cards : {};
      Object.values(cards).forEach(c => {
        if (!isObj(c)) return;
        if (!c.due || num(c.due) <= Date.now()) due++;
      });
    }
    return due;
  }

  function declaredProjects(s) {
    const done = Array.isArray(s && s.labDone) ? s.labDone.map(String) : [];
    const projects = (typeof PROJECTS !== "undefined" && Array.isArray(PROJECTS)) ? PROJECTS : [];
    let deliverables = 0;
    let complete = 0;
    projects.forEach((p, i) => {
      const items = Array.isArray(p && p[2]) ? p[2] : [];
      const hit = items.filter((_, j) => done.indexOf(`proj${i}-${j}`) >= 0).length;
      deliverables += hit;
      if (items.length && hit === items.length) complete++;
    });
    return { deliverables, complete, total: projects.length };
  }

  function panelIndicators() {
    const s = st() || {};
    const today = isoDay();
    const all = allLessons();
    const mastered = all.filter(l => isMastered(l.id)).length;
    const mistakes = Array.isArray(s.mistakes) ? s.mistakes : [];
    const overdue = mistakes.filter(m => isObj(m) && !m.corrected && m.nextReview &&
      String(m.nextReview).slice(0, 10) <= today).length;
    const pending = mistakes.filter(m => isObj(m) && !m.corrected).length;
    const xp = num(s.xp);
    const level = (typeof Storage !== "undefined" && typeof Storage.levelFromXP === "function")
      ? Storage.levelFromXP(xp) : 1;
    const shield = (typeof Storage !== "undefined" && typeof Storage.weekKey === "function")
      ? (s.shieldUsedWeek === Storage.weekKey() ? "escudo usado" : "escudo disponível") : "escudo local";
    const catalog = labCatalog();
    const catalogIds = new Set(catalog.map(l => String(l && l.id || "")).filter(Boolean));
    const evidence = isObj(s.labEvidence) ? s.labEvidence : {};
    const evidenceKeys = Object.keys(evidence).filter(k => hasArtifact(evidence[k]));
    const labsWithEvidence = catalog.length
      ? evidenceKeys.filter(k => catalogIds.has(k)).length : evidenceKeys.length;
    const outsideCatalog = evidenceKeys.length - labsWithEvidence;
    const declaredLabs = Array.isArray(s.labDone) ? s.labDone.length : 0;
    const projects = declaredProjects(s);
    const tmv = Boolean(s.tmvDoneToday) && s.tmvDate === today;
    let inProgress = 0;
    if (typeof CURRICULUM !== "undefined") {
      Object.keys(CURRICULUM).forEach(track => {
        const modules = CURRICULUM[track] && Array.isArray(CURRICULUM[track].modules)
          ? CURRICULUM[track].modules : [];
        modules.forEach((_, mi) => {
          const stt = moduleStatus(track, mi);
          if (stt.total > 0 && stt.percent > 0 && stt.percent < 100) inProgress++;
        });
      });
    }
    const timerMinutes = Array.isArray(s.timerSessions)
      ? s.timerSessions.reduce((sum, x) => sum + num(x && x.duration), 0) : 0;

    return [
      {
        label: "XP / Nível",
        value: `${Math.round(xp)} XP · Nível ${level}`,
        hint: "Atividade registrada. XP não substitui domínio com evidência."
      },
      {
        label: "Domínio (aulas com selo)",
        value: `${mastered}/${all.length}`,
        hint: `Selo 8/10 por evidência: ${all.length ? Math.round(mastered / all.length * 100) : 0}% das aulas.`
      },
      {
        label: "Revisões vencidas",
        value: String(overdue),
        hint: `Erros com data vencida; ${dueCardsCount()} flashcard(s) devidos agora.`
      },
      {
        label: "Horas registradas",
        value: `${num(s.hours).toFixed(1)} h`,
        hint: `Horas declaradas no diário; sessões de cronômetro: ${timerMinutes} min (não medem presença).`
      },
      {
        label: "Streak",
        value: `${num(s.streak)} dia(s)`,
        hint: `Sequência de dias salvos; ${shield}.`
      },
      {
        label: "Labs com evidência",
        value: `${labsWithEvidence}/${catalog.length}`,
        hint: `Do catálogo (${outsideCatalog} registro(s) fora dele); ${declaredLabs} marcação(ões) de laboratório/projeto declaradas, não verificadas.`
      },
      {
        label: "Projetos",
        value: `${projects.complete}/${projects.total} completos`,
        hint: `${projects.deliverables} entregável(is) marcado(s) em labDone; marcação não é evidência de entrega.`
      },
      {
        label: "Erros a refazer",
        value: String(pending),
        hint: `${overdue} com revisão vencida; apenas erros corrigidos contam no domínio.`
      },
      {
        label: "Meta mínima do dia (TMV)",
        value: tmv ? "Dia salvo" : "Pendente",
        hint: "15 minutos de recuperação: protege o streak, mas não concede selo de domínio."
      },
      {
        label: "Módulos em andamento",
        value: String(inProgress),
        hint: "Módulos com domínio parcial (N1–N3), calculado por aulas seladas."
      }
    ];
  }

  function reviewCalendarHTML(s) {
    const today = isoDay();
    const days = Array.from({ length: 7 }, (_, i) => addDaysISO(today, i));
    const counts = {};
    days.forEach(d => { counts[d] = { mistakes: 0, cards: 0 }; });

    const mistakes = Array.isArray(s.mistakes) ? s.mistakes : [];
    mistakes.forEach(m => {
      if (!isObj(m) || m.corrected || !m.nextReview) return;
      const day = String(m.nextReview).slice(0, 10);
      if (counts[day]) counts[day].mistakes++;
    });

    const cards = isObj(s.cards) ? s.cards : {};
    const dueNow = new Set();
    if (typeof Exercises !== "undefined" && typeof Exercises.getSpacedCards === "function") {
      try {
        (Exercises.getSpacedCards() || []).forEach(c => { if (c) dueNow.add(String(c.key)); });
      } catch (e) { /* calendário continua com as datas salvas */ }
    }
    Object.keys(cards).forEach(key => {
      const rec = cards[key];
      if (!isObj(rec)) return;
      if (!rec.due) {
        if (dueNow.has(key)) counts[today].cards++;
        return;
      }
      const day = dayFromMs(rec.due);
      if (counts[day]) counts[day].cards++;
      else if (dueNow.has(key)) counts[today].cards++;
    });
    dueNow.forEach(key => { if (!cards[key]) counts[today].cards++; });

    const items = days.map(day => {
      const d = new Date(`${day}T12:00:00`);
      const label = day === today ? "Hoje" : d.toLocaleDateString("pt-BR", { weekday: "short" });
      const c = counts[day];
      const text = `${c.mistakes} erro(s) · ${c.cards} flashcard(s)`;
      return `<li><time datetime="${esc(day)}">${esc(label)} · ${esc(day)}</time> — ${esc(text)}</li>`;
    }).join("");
    return `<section class="card section" aria-labelledby="masteryCalendarTitle">
  <div class="row"><h2 id="masteryCalendarTitle">Calendário de revisão</h2><span class="pill info">Próximos 7 dias</span></div>
  <p class="muted small">Contagem planejada a partir de mistakes.nextReview e das datas salvas em cards; flashcards vencidos aparecem em “Hoje”.</p>
  <ol>${items}</ol>
</section>`;
  }

  function panelHTML() {
    const s = st() || {};
    const indicators = panelIndicators();
    const cards = indicators.map(ind => `
    <li class="card">
      <h3>${esc(ind.label)}</h3>
      <p class="stat">${esc(ind.value)}</p>
      <p class="small muted">${esc(ind.hint)}</p>
    </li>`).join("");

    let tracksHTML = "";
    if (typeof CURRICULUM !== "undefined") {
      tracksHTML = Object.entries(CURRICULUM).map(([key, track]) => {
        const modules = track && Array.isArray(track.modules) ? track.modules : [];
        const rows = modules.map((m, mi) => {
          const status = moduleStatus(key, mi);
          const name = m && m.name ? m.name : `Módulo ${mi + 1}`;
          return `<li class="section">
            <div class="row"><b>${esc(name)}</b>
              <span class="pill ${status.status === "N4" ? "success" : status.status === "N0" ? "" : "warn"}"
                    aria-label="Nível de domínio ${esc(status.status)}">${esc(status.status)}</span>
            </div>
            <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                 aria-valuenow="${status.percent}" aria-label="Domínio de ${esc(name)}">
              <i style="width:${status.percent}%"></i>
            </div>
            <p class="small muted">${status.mastered}/${status.total} aula(s) selada(s) · ${status.percent}%</p>
          </li>`;
        }).join("");
        return `<article aria-label="Disciplina ${esc(track && track.name ? track.name : key)}">
          <h3>${esc(track && track.name ? track.name : key)}</h3>
          <ul>${rows || '<li class="small muted">Sem módulos cadastrados.</li>'}</ul>
        </article>`;
      }).join("");
    }

    return `<section class="section" aria-labelledby="masteryIndicatorsTitle">
  <div class="row"><h2 id="masteryIndicatorsTitle">Indicadores honestos</h2><span class="pill info">Domínio ≠ XP</span></div>
  <p class="muted small">Atividade (XP, horas, marcações) aparece separada de domínio com evidência.</p>
  <ul class="grid3">${cards}</ul>
</section>

<section class="card section" aria-labelledby="masteryMapTitle">
  <div class="row"><h2 id="masteryMapTitle">Mapa de domínio</h2><span class="pill">N0–N4</span></div>
  <p class="muted small">N0 = 0% · N1 = 1–39% · N2 = 40–69% · N3 = 70–99% · N4 = 100% de aulas com selo 8/10.</p>
  <div class="grid2">${tracksHTML || '<p class="muted small">Currículo não disponível.</p>'}</div>
</section>

${reviewCalendarHTML(s)}`;
  }

  function criteriaHTML(check, listId) {
    const items = check.criteria.map(c => {
      const tag = c.ok ? "ok" : "pendente";
      return `<li><span class="pill ${c.ok ? "success" : "warn"}">${tag}</span>
        <b>${esc(c.label)}</b> <span class="small muted">${esc(c.detail)}</span></li>`;
    }).join("");
    const reasons = check.ok
      ? '<li class="small muted">Todos os critérios atendidos. Nenhuma falha crítica.</li>'
      : check.reasons.map(r => `<li class="small">${esc(r)}</li>`).join("");
    return `<p><b>Critérios de domínio</b> <span class="pill ${check.ok ? "success" : "warn"}">${check.ok ? "elegível" : "bloqueado"}</span></p>
    <ul id="${esc(listId)}">${items}</ul>
    <p><b>${check.ok ? "Pronto para registrar" : "Pendências (falhas críticas e nota)"}</b></p>
    <ul>${reasons}</ul>`;
  }

  function lessonBlockHTML(lessonId) {
    const id = String(lessonId || "");
    const lesson = findLesson(id);
    if (!lesson) return '<p class="muted small">Aula não encontrada para avaliação de domínio.</p>';
    const check = canClaim(id);
    const listId = `mastery-reasons-${id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
    const rows = DIMENSIONS.map(d => {
      const part = check.breakdown[d.key];
      return `<tr>
        <th scope="row">${esc(d.label)}</th>
        <td>${part.points}/${part.max}</td>
        <td>${esc(part.detail)}</td>
      </tr>`;
    }).join("");
    const state = isMastered(id)
      ? '<span class="pill success">Selo registrado</span>'
      : '<span class="pill warn">Sem selo</span>';
    const disabledAttrs = check.ok ? "" :
      ` aria-disabled="true" title="${esc(check.reasons.join(" · "))}"`;
    return `<section class="card section" aria-labelledby="mastery-block-${esc(id)}">
  <div class="row"><h2 id="mastery-block-${esc(id)}">Domínio: ${esc(lesson.title || id)}</h2>${state}</div>
  <p class="muted small">Selo 8/10 por evidência. Esta ação não concede XP.</p>
  <table>
    <caption class="muted small">Rubrica de domínio desta aula</caption>
    <thead><tr><th scope="col">Dimensão</th><th scope="col">Pontos</th><th scope="col">Evidência</th></tr></thead>
    <tbody>${rows}</tbody>
    <tfoot><tr><th scope="row">Total</th><td>${check.score}/${MAX_SCORE}</td><td>Aprovação a partir de 8/10, sem falha crítica.</td></tr></tfoot>
  </table>
  ${criteriaHTML(check, listId)}
  <div class="actions">
    <button type="button" onclick="Mastery.claim('${attrJs(id)}')"
            aria-describedby="${esc(listId)}"${disabledAttrs}>Registrar domínio (8/10)</button>
    <button type="button" class="secondary" onclick="Mastery.openPractice('${attrJs(id)}')">Registrar prática/revisão</button>
    <button type="button" class="secondary" onclick="Mastery.openRubric('${attrJs(id)}')">Ver rubrica completa</button>
  </div>
</section>`;
  }

  function openRubric(lessonId) {
    const id = String(lessonId || "");
    const lesson = findLesson(id);
    const check = canClaim(id);
    const title = lesson ? (lesson.title || id) : id;
    const dims = DIMENSIONS.map(d => `<li><b>${esc(d.label)} (${d.max})</b> — ${esc(d.requirement)}</li>`).join("");
    if (typeof openModal !== "function") {
      if (typeof toast === "function") toast("Janela de rubrica indisponível.");
      return;
    }
    openModal(`<h2>Rubrica de domínio — ${esc(title)}</h2>
<p class="muted">Domínio é evidência, não XP. Nota mínima: 8/10 em cinco dimensões, sem falha crítica.</p>
<h3>Dimensões e evidências</h3>
<ol>${dims}</ol>
<h3>Status atual: ${check.score}/${MAX_SCORE}</h3>
${criteriaHTML(check, `mastery-modal-reasons-${esc(id)}`)}
<div class="actions">
  <button type="button" onclick="Mastery.claim('${attrJs(id)}')"${check.ok ? "" : ' aria-disabled="true"'}>Registrar domínio (8/10)</button>
</div>`);
  }

  /* Registro explícito de prática/revisão quando a aula não possui um lab
     vinculado no catálogo. A evidência é declarada pelo estudante e fica
     identificada como tal — nunca é apresentada como verificação externa. */
  function openPractice(lessonId) {
    const id = String(lessonId || "");
    const lesson = findLesson(id);
    if (!lesson || typeof openModal !== "function") {
      if (typeof toast === "function") toast("Não foi possível abrir o registro de prática.");
      return;
    }
    openModal(`<h2>Registrar prática — ${esc(lesson.title || id)}</h2>
<p class="muted small">Registro de autoria própria. Descreva o que você fez, onde executou e qual artefato ficou guardado; não é uma verificação automática.</p>
<label class="small" for="mp-evidence">Evidência produzida (mínimo 20 caracteres)</label>
<textarea class="field" id="mp-evidence" rows="5" placeholder="Ex.: implementei a função no WSL2, testei 5 entradas e salvei a saída em /tmp/exemplo.log"></textarea>
<label class="check"><input type="checkbox" id="mp-applied"> Apliquei o conceito sem consultar a aula.</label>
<label class="check"><input type="checkbox" id="mp-reviewed"> Já revisei este conteúdo em data posterior ao primeiro estudo.</label>
<label class="small" for="mp-date">Data da revisão (opcional)</label>
<input class="field" id="mp-date" type="date" value="${esc(isoDay())}">
<div class="actions">
  <button type="button" onclick="Mastery.savePractice('${attrJs(id)}')">Salvar registro</button>
</div>`);
  }

  function savePractice(lessonId) {
    const id = String(lessonId || "");
    const text = String(document.getElementById("mp-evidence")?.value || "").trim();
    const applied = Boolean(document.getElementById("mp-applied")?.checked);
    const reviewed = Boolean(document.getElementById("mp-reviewed")?.checked);
    const date = String(document.getElementById("mp-date")?.value || "").slice(0, 10);
    const errorId = "mp-error";
    let error = document.getElementById(errorId);
    if (!error) {
      error = document.createElement("p");
      error.id = errorId;
      error.className = "bad small";
      document.getElementById("mp-evidence")?.insertAdjacentElement("afterend", error);
    }
    if (text.length < 20) {
      error.textContent = "Descreva a prática com pelo menos 20 caracteres.";
      return;
    }
    if (!applied) {
      error.textContent = "Marque a aplicação sem consulta para registrar este critério.";
      return;
    }
    const s = st();
    if (!s) return;
    if (!isObj(s.labEvidence)) s.labEvidence = {};
    if (!isObj(s.mastery)) s.mastery = {};
    const rec = isObj(s.mastery[id]) ? s.mastery[id] : {};
    s.labEvidence[id] = {
      text,
      at: new Date().toISOString(),
      application: true,
      lab: true,
      source: "declaracao-do-estudante",
      reviewedAt: reviewed ? (date || isoDay()) : ""
    };
    s.mastery[id] = {
      ...rec,
      application: { text, at: new Date().toISOString() },
      lab: "Prática declarada com evidência descritiva",
      ...(reviewed ? { reviewedAt: date || isoDay() } : {})
    };
    if (!Array.isArray(s.assessmentLog)) s.assessmentLog = [];
    s.assessmentLog.push({
      type: "practice-record",
      lessonId: id,
      at: new Date().toISOString(),
      selfDeclared: true
    });
    if (s.assessmentLog.length > LOG_LIMIT) s.assessmentLog = s.assessmentLog.slice(-LOG_LIMIT);
    Storage.save();
    document.querySelector(".modal-overlay")?.remove();
    if (typeof toast === "function") toast("Prática registrada como declaração com evidência descritiva.");
    if (typeof render === "function") render();
  }

  window.Mastery = {
    rubric,
    lessonScore,
    canClaim,
    claim,
    openPractice,
    savePractice,
    isMastered,
    moduleStatus,
    statusFromPercent,
    panelIndicators,
    panelHTML,
    lessonBlockHTML,
    openRubric
  };
})();

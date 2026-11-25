/* ============================================================
   FORGE — gamification.js
   Seção 11: XP/níveis, escudo de streak, TMV, Pomodoro adaptável,
   recompensas e classificação E1–E4 no Caderno de Erros.
   Carregado depois de app.js; expõe window.Gamification.
   ============================================================ */

(function () {
  "use strict";

  const PRESETS = {
    default: { label: "Padrão 25/5", focus: 25, pause: 5 },
    hard: { label: "Dia difícil 15/3", focus: 15, pause: 3 },
    quick: { label: "Início rápido 2 min", focus: 2, pause: 0 }
  };

  const pom = {
    preset: "default",
    phase: "focus",
    endAt: 0,
    remaining: 0,
    running: false,
    handle: null
  };

  function s() {
    return Storage.get();
  }

  function levelInfo() {
    const xp = Number(s().xp) || 0;
    const level = Storage.levelFromXP(xp);
    const floor = Storage.levelFloor(level);
    const next = Storage.levelFloor(level + 1);
    const pct = Math.min(100, Math.max(0, Math.round((xp - floor) / (next - floor) * 100)));
    return { xp, level, floor, next, pct, remaining: Math.max(0, next - xp) };
  }

  function two(n) {
    return String(Math.max(0, Math.floor(n))).padStart(2, "0");
  }

  function clock(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    return `${two(total / 60)}:${two(total % 60)}`;
  }

  function shieldText() {
    const st = s();
    const used = st.shieldUsedWeek === Storage.weekKey();
    return used
      ? `Escudo da semana usado (${st.shieldUsedWeek})`
      : `Escudo disponível nesta semana (${Storage.weekKey()})`;
  }

  function dashboardWidgets() {
    const st = s();
    const li = levelInfo();
    const preset = PRESETS[pom.preset];
    const tmv = Boolean(st.tmvDoneToday) && st.tmvDate === Storage.isoDay();
    const dueMistakes = (st.mistakes || []).filter(m => !m.corrected && m.nextReview && m.nextReview <= Storage.isoDay()).length;

    return `
<div class="grid3 section" aria-label="Gamificação e execução diária">
  <div class="card xp-card">
    <div class="row"><span class="eyebrow">Progresso</span><span class="pill info" id="xpLevel">Nível ${li.level}</span></div>
    <div class="stat" id="xpNow">${li.xp} XP</div>
    <div class="bar"><i id="xpBar" style="width:${li.pct}%"></i></div>
    <p class="small muted" id="xpNext">Faltam ${li.remaining} XP para o nível ${li.level + 1}</p>
    <p class="small muted" id="shieldStatus">${shieldText()}</p>
    <p class="small muted">1 dia perdido não zera a sequência: o escudo semanal cobre a retomada.</p>
  </div>

  <div class="card tmv-card">
    <div class="row"><span class="eyebrow">Anti-paralisia</span><span class="pill ${tmv ? "success" : "warn"}" id="tmvStatus">${tmv ? "Dia salvo" : "Pendente"}</span></div>
    <h2 style="margin:4px 0">Tarefa Mínima Viável de hoje</h2>
    <p class="muted small">15 minutos: 10 flashcards vencidos + 1 exercício curto. Cumpriu? O dia está salvo e o streak não quebra.</p>
    <label class="check"><input type="checkbox" id="tmvCheck" ${tmv ? "checked" : ""} onchange="Gamification.toggleTMV(this.checked)"> Concluí a TMV de hoje (+15 XP)</label>
    <p class="small muted">${dueMistakes ? `${dueMistakes} erro(s) com revisão vencida hoje.` : "Nenhuma revisão de erro vencida."}</p>
  </div>

  <div class="card pomodoro-card">
    <div class="row"><span class="eyebrow">Pomodoro adaptável</span><span class="pill" id="pomCount">${st.pomodoros || 0} blocos</span></div>
    <div class="timer-display" id="pomTime" aria-live="off">${clock(preset.focus * 60000)}</div>
    <p class="small muted" id="pomLabel">${preset.label} · foco</p>
    <div class="tabs" role="group" aria-label="Preset do Pomodoro">
      ${Object.entries(PRESETS).map(([key, p]) => `<button class="${key === pom.preset ? "active" : ""}" data-preset="${key}" aria-pressed="${key === pom.preset}" onclick="Gamification.setPreset('${key}')">${p.label}</button>`).join("")}
    </div>
    <div class="actions">
      <button onclick="Gamification.startPomodoro()">Iniciar</button>
      <button class="secondary" onclick="Gamification.pausePomodoro()">Pausar</button>
      <button class="ghost" onclick="Gamification.resetPomodoro()">Zerar</button>
    </div>
    <div id="pomAlert" class="feedback" role="status" aria-live="polite"></div>
    <p class="small muted">Som suave ao concluir: ative em Progresso e backup → configuração de som. Bônus de +10 XP ao fechar 3 blocos no dia.</p>
  </div>
</div>

<div class="card section">
  <div class="row"><h2>Recompensas combinadas</h2><span class="pill">Configuração local</span></div>
  <p class="muted small">Diária ao bater 80 XP no dia: 30–45 min de lazer sem culpa. Semanal com 500 XP: atividade especial. Mensal com projeto entregue: prêmio maior.</p>
  <div class="grid3">
    <label class="small">Diária<input class="field" id="rewardDaily" value="${escHtml(st.rewards.daily || "")}" placeholder="Ex.: 30 min de jogo"></label>
    <label class="small">Semanal<input class="field" id="rewardWeekly" value="${escHtml(st.rewards.weekly || "")}" placeholder="Ex.: filme no sábado"></label>
    <label class="small">Mensal<input class="field" id="rewardMonthly" value="${escHtml(st.rewards.monthly || "")}" placeholder="Ex.: livro físico novo"></label>
  </div>
  <div class="actions"><button class="secondary" onclick="Gamification.saveRewards()">Salvar recompensas</button></div>
</div>`;
  }

  function refreshUI() {
    if (typeof document === "undefined") return;
    const li = levelInfo();
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el && el.textContent !== text) el.textContent = text;
    };
    setText("xpNow", `${li.xp} XP`);
    setText("xpLevel", `Nível ${li.level}`);
    setText("xpNext", `Faltam ${li.remaining} XP para o nível ${li.level + 1}`);
    setText("shieldStatus", shieldText());
    setText("pomCount", `${s().pomodoros || 0} blocos`);
    const bar = document.getElementById("xpBar");
    if (bar) bar.style.width = li.pct + "%";

    const st = s();
    const tmv = Boolean(st.tmvDoneToday) && st.tmvDate === Storage.isoDay();
    const chk = document.getElementById("tmvCheck");
    if (chk && chk.checked !== tmv) chk.checked = tmv;
    setText("tmvStatus", tmv ? "Dia salvo" : "Pendente");
    const tmvPill = document.getElementById("tmvStatus");
    if (tmvPill) tmvPill.className = "pill " + (tmv ? "success" : "warn");

    const p = PRESETS[pom.preset];
    setText("pomLabel", `${p.label} · ${pom.phase === "focus" ? "foco" : "pausa"}`);
    const remaining = pom.running && pom.endAt ? pom.endAt - Date.now() : pom.remaining || (pom.phase === "focus" ? p.focus * 60000 : p.pause * 60000);
    setText("pomTime", clock(remaining));
    document.querySelectorAll("[data-preset]").forEach(b => {
      const active = b.dataset.preset === pom.preset;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", String(active));
    });
  }

  function afterRender() {
    if (pom.running) startTick();
    refreshUI();
  }

  function beep() {
    if (!s().settings || !Storage.getSetting("sound")) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      [0, 0.16].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = i === 0 ? 660 : 880;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.14);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.16);
      });
      setTimeout(() => ctx.close(), 500);
    } catch (e) {
      // Áudio é opcional: o alerta visual continua funcionando.
    }
  }

  function alertUser(text) {
    const el = document.getElementById("pomAlert");
    if (el) {
      el.textContent = text;
      el.className = "feedback good";
    }
    beep();
    if (typeof toast === "function") toast(text);
  }

  function startTick() {
    if (pom.handle) return;
    pom.handle = setInterval(tickPomodoro, 500);
  }

  function stopTick() {
    if (pom.handle) {
      clearInterval(pom.handle);
      pom.handle = null;
    }
  }

  function setPreset(name) {
    if (!PRESETS[name]) return;
    stopTick();
    pom.preset = name;
    pom.phase = "focus";
    pom.running = false;
    pom.endAt = 0;
    pom.remaining = PRESETS[name].focus * 60000;
    refreshUI();
  }

  function startPomodoro() {
    const p = PRESETS[pom.preset];
    const ms = pom.phase === "focus" ? p.focus * 60000 : p.pause * 60000;
    if (ms <= 0) { completeBreak(); return; }
    pom.endAt = Date.now() + (pom.remaining > 0 && !pom.running ? pom.remaining : ms);
    pom.remaining = 0;
    pom.running = true;
    const el = document.getElementById("pomAlert");
    if (el) { el.textContent = ""; el.className = "feedback"; }
    startTick();
    refreshUI();
  }

  function pausePomodoro() {
    if (!pom.running) return;
    pom.remaining = Math.max(0, pom.endAt - Date.now());
    pom.running = false;
    pom.endAt = 0;
    stopTick();
    refreshUI();
  }

  function resetPomodoro() {
    stopTick();
    pom.running = false;
    pom.endAt = 0;
    pom.phase = "focus";
    pom.remaining = PRESETS[pom.preset].focus * 60000;
    refreshUI();
  }

  function tickPomodoro() {
    if (!pom.running) { stopTick(); return; }
    const left = pom.endAt - Date.now();
    setTextSafe("pomTime", clock(left));
    if (left > 0) return;

    stopTick();
    if (pom.phase === "focus") {
      const st = s();
      st.pomodoros = (Number(st.pomodoros) || 0) + 1;
      st.pomodoroLog.push({ date: new Date().toISOString(), minutes: PRESETS[pom.preset].focus, preset: pom.preset });
      if (st.pomodoroLog.length > 200) st.pomodoroLog = st.pomodoroLog.slice(-200);
      Storage.save();
      const result = Storage.awardXP(20, `Pomodoro ${PRESETS[pom.preset].label}`);
      const todayBlocks = st.pomodoroLog.filter(x => String(x.date).slice(0, 10) === Storage.isoDay()).length;
      if (todayBlocks > 0 && todayBlocks % 3 === 0) Storage.awardXP(10, "Bônus de 3 blocos no dia");
      alertUser(`Bloco concluído: +20 XP${result.leveledUp ? ` · Nível ${result.level}` : ""}.`);
      pom.phase = "break";
      pom.remaining = PRESETS[pom.preset].pause * 60000;
      if (pom.remaining <= 0) { completeBreak(); return; }
      pom.running = true;
      pom.endAt = Date.now() + pom.remaining;
      pom.remaining = 0;
      startTick();
      refreshUI();
    } else {
      completeBreak();
    }
  }

  function completeBreak() {
    stopTick();
    pom.running = false;
    pom.endAt = 0;
    pom.phase = "focus";
    pom.remaining = PRESETS[pom.preset].focus * 60000;
    alertUser("Pausa encerrada. Próximo bloco pronto.");
    refreshUI();
  }

  function setTextSafe(id, text) {
    const el = document.getElementById(id);
    if (el && el.textContent !== text) el.textContent = text;
  }

  function toggleTMV(on) {
    const st = s();
    const today = Storage.isoDay();
    if (on && !(st.tmvDoneToday && st.tmvDate === today)) {
      const alreadyPaid = (st.xpLog || []).some(x =>
        x.reason === "Tarefa Mínima Viável concluída" && String(x.date).slice(0, 10) === today);
      st.tmvDoneToday = true;
      st.tmvDate = today;
      Storage.save();
      const result = alreadyPaid
        ? { gained: 0, level: Storage.levelFromXP(st.xp), leveledUp: false }
        : Storage.awardXP(15, "Tarefa Mínima Viável concluída");
      if (typeof toast === "function") toast(result.leveledUp ? `TMV concluída · Nível ${result.level}.` : "TMV concluída: +15 XP. Dia salvo.");
    } else if (!on) {
      st.tmvDoneToday = false;
      st.tmvDate = null;
      Storage.save();
    }
    refreshUI();
  }

  function setMistakeCategory(index, category) {
    const ok = Storage.setMistakeCategory(Number(index), category);
    if (ok && typeof toast === "function") {
      toast(category ? `Erro classificado como ${category}.` : "Classificação removida.");
    }
  }

  function redoMistake(index, success) {
    const result = Storage.reviewMistake(Number(index), success === true);
    if (!result) return;
    const st = s();
    st.redoStreak = (Number(st.redoStreak) || 0) + (success ? 1 : 0);
    Storage.save();
    if (success) Storage.awardXP(10, "Erro antigo refeito com acerto");
    if (success && st.redoStreak % 5 === 0) Storage.awardXP(50, "5 erros antigos refeitos");
    if (typeof toast === "function") {
      toast(success
        ? `Acerto registrado. Próxima revisão em ${result.nextReview}${result.corrected ? " · Dominado" : ""}.`
        : `Erro registrado. Refazer amanhã (${result.nextReview}).`);
    }
    if (typeof page !== "undefined" && page === "mistakes" && typeof render === "function") render();
  }

  function saveRewards() {
    const st = s();
    st.rewards = {
      daily: document.getElementById("rewardDaily")?.value || "",
      weekly: document.getElementById("rewardWeekly")?.value || "",
      monthly: document.getElementById("rewardMonthly")?.value || ""
    };
    Storage.save();
    if (typeof toast === "function") toast("Recompensas salvas.");
  }

  window.Gamification = {
    PRESETS,
    dashboardWidgets,
    afterRender,
    refreshUI,
    levelInfo,
    setPreset,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    toggleTMV,
    setMistakeCategory,
    redoMistake,
    saveRewards
  };
})();

/* ============================================================
   FORGE 4.0 — dashboard-widgets.js
   Command center: hero de prioridade, radar SM-2, grafo de
   pré-requisitos e heatmap 52×7. Determinístico e 100% local.
   Expõe window.ForgeWidgets4.
   ============================================================ */

(function () {
  "use strict";

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function num(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : (fallback || 0);
  }

  function hash(value) {
    if (typeof window !== "undefined" && window.ForgeMathUtils?.fnv1a32) {
      return window.ForgeMathUtils.fnv1a32(value) >>> 0;
    }
    let h = 2166136261 >>> 0;
    const s = String(value || "");
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function next(seed) {
    return (Math.imul(seed >>> 0, 1664525) + 1013904223) >>> 0;
  }

  function state() {
    return (typeof Storage !== "undefined" && typeof Storage.get === "function") ? Storage.get() : {};
  }

  function userSeed() {
    const s = state();
    return num(s.forge4?.userSeed, hash(`forge-v5|${s.userId || "local"}`)) >>> 0;
  }

  function lessonList() {
    try {
      /* "lessons" é um binding lexical global definido por app.js. */
      if (typeof lessons !== "undefined" && Array.isArray(lessons) && lessons.length) return lessons;
    } catch (e) { /* binding lexical indisponível no contexto de teste */ }
    try {
      if (typeof buildAllLessons === "function") return buildAllLessons();
    } catch (e) { /* currículo não carregado */ }
    return [];
  }

  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function seedFor(key) {
    return hash(`${userSeed()}|${key}`);
  }

  function go(page) {
    if (typeof goToPage === "function") goToPage(page);
    else if (typeof window !== "undefined" && typeof window.goToPage === "function") window.goToPage(page);
  }

  /* ---------- 1. Hero card: uma ação prioritária, sem ambiguidade ---------- */

  function priorityAction(s) {
    s = s || state();
    const now = Date.now();
    const cards = s.cards && typeof s.cards === "object" ? s.cards : {};
    const overdue = Object.entries(cards).filter(([, card]) => {
      const t = num(card?.next_review, 0);
      return t > 0 && t <= now;
    }).length;
    const history = Array.isArray(s.oral_exam_history) ? s.oral_exam_history : [];
    const bugs = Array.isArray(s.bug_hunt_history) ? s.bug_hunt_history : [];
    const bugToday = bugs.some(b => String(b.day || b.at || "").slice(0, 10) === todayISO());
    const oralRecent = history.some(h => (now - new Date(h.at || 0).getTime()) < 7 * 86400000);
    const total = lessonList().length;
    const done = Array.isArray(s.done) ? s.done.length : 0;
    const pct = total ? Math.round(done / total * 100) : 0;

    if (overdue > 0) {
      return {
        kicker: "Revisão espaçada · prioridade 1",
        title: `${overdue} ${overdue === 1 ? "cartão está" : "cartões estão"} pedindo revisão`,
        meta: ["SM-2 determinístico", "Recuperação antes de conteúdo novo"],
        progress: pct,
        label: "Revisar agora",
        page: "review",
        action: null
      };
    }
    if (!bugToday) {
      return {
        kicker: "Caça-bugs · rotina diária",
        title: "Encontre o defeito antes que ele vire hábito",
        meta: ["1 caso por dia", "Modo autópsia ao errar"],
        progress: pct,
        label: "Abrir caça-bugs",
        page: "bugs",
        action: null
      };
    }
    if (!oralRecent) {
      return {
        kicker: "Prova oral · recuperação ativa",
        title: "Explique em voz alta por 5 minutos",
        meta: ["3 a 5 tópicos", "Rubrica em três painéis"],
        progress: pct,
        label: "Iniciar prova oral",
        page: "oral",
        action: null
      };
    }
    return {
      kicker: "Próxima aula · sequência ordenada",
      title: "Continue de onde você parou",
      meta: [`${done} de ${total} aulas concluídas`, "Uma etapa por vez"],
      progress: pct,
      label: "Entrar no modo foco",
      page: "dashboard",
      action: "Focus.open"
    };
  }

  function heroHTML() {
    const a = priorityAction();
    const click = a.action === "Focus.open"
      ? "if(window.Focus)Focus.open(nextLessonId(),'dashboard')"
      : `ForgeWidgets4.go('${a.page}')`;
    return `
<section class="card forge-hero forge4-fade" aria-labelledby="forgeHeroTitle">
  <div>
    <p class="forge4-kicker" id="forgeHeroKicker">${esc(a.kicker)}</p>
    <h2 class="forge-hero__title" id="forgeHeroTitle">${esc(a.title)}</h2>
  </div>
  <div class="forge-hero__meta">
    ${a.meta.map(m => `<span>${esc(m)}</span>`).join("")}
    <span class="progress-track" role="progressbar" aria-label="Progresso geral das aulas" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${a.progress}"><i style="width:${a.progress}%"></i></span>
    <span class="small muted">${a.progress}%</span>
  </div>
  <div class="forge-hero__actions">
    <button type="button" class="btn-primary" onclick="${click}">▶ ${esc(a.label)}</button>
    <button type="button" class="secondary" onclick="ForgeWidgets4.go('tracks')">Ver trilhas</button>
  </div>
</section>`;
  }

  /* ---------- 2. Radar SM-2: efator, estabilidade e atraso ---------- */

  function sm2RadarHTML() {
    const s = state();
    const all = Object.entries(s.cards && typeof s.cards === "object" ? s.cards : {});
    const byId = new Map(lessonList().map(l => [l.id, l]));
    const now = Date.now();
    const tracks = new Map();
    all.forEach(([id, card]) => {
      const track = byId.get(id)?.track || "geral";
      const bucket = tracks.get(track) || { ef: [], interval: [], due: 0, total: 0 };
      bucket.ef.push(num(card?.efactor, 2.5));
      bucket.interval.push(num(card?.interval, 0));
      if (num(card?.next_review, 0) && num(card?.next_review, 0) <= now) bucket.due++;
      bucket.total++;
      tracks.set(track, bucket);
    });

    const names = {
      math: "Matemática", c: "C / sistemas", arch: "Arquitetura", assembly: "Assembly",
      ai: "Inteligência artificial", linux: "Linux", software: "Eng. software",
      systems: "Sistemas", networks: "Redes", databases: "Banco de dados",
      security: "Segurança", geral: "Geral"
    };
    const rows = [...tracks.entries()].sort((a, b) => b[1].total - a[1].total).slice(0, 6).map(([key, b]) => {
      const avg = arr => arr.length ? arr.reduce((x, y) => x + y, 0) / arr.length : 0;
      const ef = avg(b.ef);
      const interval = avg(b.interval);
      const zone = b.due > 0 ? "risk" : (ef < 2.3 || interval < 2 ? "warn" : "safe");
      const zoneLabel = zone === "risk" ? "Revisar" : zone === "warn" ? "Atenção" : "Estável";
      return { key, label: names[key] || key, ef, interval, due: b.due, zone, zoneLabel };
    });

    const bars = rows.length ? rows.map(r => `
      <li class="radar-row">
        <span class="radar-name" title="${esc(r.label)}">${esc(r.label)}</span>
        <span class="radar-fill"><i class="radar-zone-${r.zone}" style="width:${Math.min(100, Math.round((r.ef / 3) * 100))}%"></i></span>
        <span class="radar-value">EF ${r.ef.toFixed(2)} · ${Math.round(r.interval)}d · ${r.due} atrasado</span>
        <span class="radar-tag" data-zone="${r.zone}">${r.zoneLabel}</span>
      </li>`).join("") : `<li class="small muted">Nenhum cartão SM-2 registrado ainda. Conclua uma aula para iniciar o radar.</li>`;

    return `
<section class="card forge4-panel" aria-labelledby="forgeRadarTitle">
  <p class="forge4-kicker">SM-2 · memória espaçada</p>
  <h2 id="forgeRadarTitle" style="margin-top:0">Radar de retenção</h2>
  <p class="small muted">Fator de facilidade, intervalo médio e cartões vencidos por trilha.</p>
  <ul class="radar-list">${bars}</ul>
</section>`;
  }

  /* ---------- 3. Constelação de pré-requisitos (SVG determinístico) ---------- */

  function constellationHTML() {
    const s = state();
    const done = new Set(Array.isArray(s.done) ? s.done : []);
    const all = lessonList();
    const picked = all.filter(l => !done.has(l.id)).slice(0, 5);
    const mastered = all.filter(l => done.has(l.id)).slice(-5);
    const nodes = [...mastered, ...picked].slice(0, 10);
    if (!nodes.length) {
      return `<section class="card forge4-panel constellation" aria-labelledby="forgeGraphTitle">
        <p class="forge4-kicker">Grafo de pré-requisitos</p><h2 id="forgeGraphTitle" style="margin-top:0">Constelação</h2>
        <p class="small muted">O grafo aparece quando o currículo estiver disponível.</p></section>`;
    }

    const positions = nodes.map((lesson, i) => ({
      id: lesson.id,
      title: lesson.title || lesson.id,
      track: lesson.track || "geral",
      done: done.has(lesson.id),
      x: 80 + (i % 5) * 160,
      y: i < 5 ? 105 : 305,
      seed: seedFor(`node|${lesson.id}`)
    }));
    const links = [];
    for (let i = 1; i < positions.length; i++) {
      if (i % 5 !== 0) links.push([positions[i - 1], positions[i]]);
    }
    const linkHTML = links.map(([a, b]) => {
      const ok = a.done && b.done;
      return `<line class="link${ok ? " is-mastered" : ""}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"></line>`;
    }).join("");
    const nodeHTML = positions.map(p => {
      const cls = p.done ? " is-mastered" : "";
      const label = p.title.length > 18 ? p.title.slice(0, 17) + "…" : p.title;
      return `<g role="button" tabindex="0" class="node-group" aria-label="${esc(p.title)}${p.done ? ", concluída" : ", pendente"}"
        onclick="ForgeWidgets4.openLesson('${esc(p.id)}')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();ForgeWidgets4.openLesson('${esc(p.id)}')}">
        <circle class="node${cls}" cx="${p.x}" cy="${p.y}" r="26"></circle>
        <text class="node-label" x="${p.x}" y="${p.y + 4}" text-anchor="middle">${esc(label.slice(0, 10))}</text>
        <title>${esc(p.title)} · ${p.done ? "concluída" : "pendente"}</title>
      </g>`;
    }).join("");

    return `
<section class="card forge4-panel constellation" aria-labelledby="forgeGraphTitle">
  <p class="forge4-kicker">Grafo de pré-requisitos</p>
  <h2 id="forgeGraphTitle" style="margin-top:0">Constelação do currículo</h2>
  <p class="small muted">Nós verdes são pré-requisitos concluídos; os demais bloqueiam a próxima etapa.</p>
  <svg viewBox="0 0 800 410" role="group" aria-label="Grafo com ${positions.length} aulas e ${links.length} pré-requisitos">
    <title>Pré-requisitos entre aulas concluídas e pendentes</title>
    <g aria-hidden="true">${linkHTML}</g>${nodeHTML}
  </svg>
</section>`;
  }

  /* ---------- 4. Heatmap 52×7 a partir do dayLog ---------- */

  function addDays(date, days) {
    const d = new Date(date.getTime());
    d.setDate(d.getDate() + days);
    return d;
  }

  function heatmapHTML() {
    const s = state();
    const log = s.dayLog && typeof s.dayLog === "object" ? s.dayLog : {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const offset = (today.getDay() + 1) % 7; // domingo = 0
    const start = addDays(today, -(51 * 7 + offset));
    const key = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const cells = [];
    let active = 0;
    let hours = 0;
    for (let week = 0; week < 52; week++) {
      for (let day = 0; day < 7; day++) {
        const d = addDays(start, week * 7 + day);
        const h = num(log[key(d)], 0);
        const future = d > today;
        const level = future ? 0 : (h <= 0 ? 0 : h < 0.5 ? 1 : h < 1.5 ? 2 : h < 3 ? 3 : 4);
        if (h > 0 && !future) { active++; hours += h; }
        cells.push(`<rect class="cell" x="${week * 14}" y="${day * 14}" width="12" height="12" rx="2" data-level="${level}" opacity="${future ? 0.25 : 1}"><title>${key(d)}: ${h.toFixed(1)}h</title></rect>`);
      }
    }
    return `
<section class="card forge4-panel heatmap" aria-labelledby="forgeHeatTitle">
  <p class="forge4-kicker">52 semanas · constância</p>
  <h2 id="forgeHeatTitle" style="margin-top:0">Mapa de calor de estudo</h2>
  <p class="small muted">${active} dias ativos · ${hours.toFixed(1)}h no período.</p>
  <svg viewBox="0 0 728 98" role="img" aria-label="Mapa de calor com ${active} dias de estudo nos últimos 52 semanas">${cells.join("")}</svg>
  <p class="small muted" aria-hidden="true">menos <span class="radar-tag">▢</span> <span class="radar-tag" data-zone="safe">■</span> mais</p>
</section>`;
  }

  /* ---------- 5. Caça-bugs diário com autópsia ---------- */

  const BUGS = [
    {
      title: "Soma de inteiros sem sinal",
      lines: ["uint32_t total = 0;", "for (size_t i = 0; i < n; i++) {", "  total += values[i];", "}", "return total;"],
      fault: 3,
      why: "O somatório pode envolpar em uint32_t antes da conversão. Acumule em uint64_t e valide o limite.",
      category: "Overflow"
    },
    {
      title: "Cópia sem limite",
      lines: ["char dest[16];", "strcpy(dest, entrada);", "return strlen(dest);"],
      fault: 2,
      why: "strcpy não conhece a capacidade de dest. Use snprintf ou strncpy com terminação explícita.",
      category: "Memória"
    },
    {
      title: "Comparação de ponto flutuante",
      lines: ["double a = 0.1 + 0.2;", "double b = 0.3;", "if (a == b) return IGUAL;", "return DIFERENTE;"],
      fault: 3,
      why: "0.1 e 0.2 não são exatos em binary64. Compare com tolerância: fabs(a-b) < 1e-9.",
      category: "Precisão"
    },
    {
      title: "Ponteiro após liberação",
      lines: ["no *p = criar();", "free(p);", "if (p->prox) processar(p);", "return 0;"],
      fault: 3,
      why: "O ponteiro continua apontando para memória reutilizável. Atribua NULL após free.",
      category: "Uso após free"
    },
    {
      title: "Índice negativo silencioso",
      lines: ["int idx = tamanho - 1;", "if (idx >= 0) {", "  return vetor[idx];", "}", "return -1;"],
      fault: 3,
      why: "A conversão implícita de idx negativo para size_t o torna enorme. Cheque o tipo antes de indexar.",
      category: "Conversão"
    },
    {
      title: "Chave de cache sem contexto",
      lines: ["chave = usuario;", "valor = calcular(usuario, periodo);", "cache[chave] = valor;", "return cache[chave];"],
      fault: 1,
      why: "A chave ignora o período: um resultado antigo reaparece. Inclua todas as dimensões da entrada.",
      category: "Estado"
    }
  ];

  function dailyBug() {
    const day = todayISO();
    const index = next(seedFor(`bug|${day}`)) % BUGS.length;
    return { ...BUGS[index], index, day };
  }

  function bugHuntHTML() {
    const bug = dailyBug();
    const history = Array.isArray(state().bug_hunt_history) ? state().bug_hunt_history : [];
    const doneToday = history.some(h => String(h.day || h.at || "").slice(0, 10) === bug.day);
    const lines = bug.lines.map((line, i) => `
      <label class="bug-line"><input type="radio" name="bugLine" value="${i + 1}"> <span class="small muted">${String(i + 1).padStart(2, "0")}</span> <code>${esc(line)}</code></label>`).join("");
    return `
<section class="card forge4-panel" id="bugHuntCard" aria-labelledby="bugHuntTitle">
  <p class="forge4-kicker">Caça-bugs · ${esc(bug.day)} · ${esc(bug.category)}</p>
  <h2 id="bugHuntTitle" style="margin-top:0">${esc(bug.title)}</h2>
  <p class="small muted">${doneToday ? "Caso de hoje já registrado. Você pode repetir a autópsia." : "Qual linha contém a falha? Justifique antes de revelar a resposta."}</p>
  <form class="bug-artifact" onsubmit="event.preventDefault();ForgeWidgets4.submitBug()">
    <fieldset style="border:0;padding:0;margin:0">${lines}</fieldset>
    <label for="bugJustify" class="small muted">Hipótese (mínimo 20 caracteres)</label>
    <textarea id="bugJustify" class="oral-answer" minlength="20" style="min-height:80px"></textarea>
    <div class="actions" style="margin-top:10px">
      <button type="submit">Registrar diagnóstico</button>
      <button type="button" class="secondary" onclick="ForgeWidgets4.toggleAutopsy()">Modo autópsia</button>
    </div>
  </form>
  <div id="bugAutopsy" class="bug-autopsy" hidden></div>
</section>`;
  }

  function submitBug() {
    const bug = dailyBug();
    const checked = (typeof document !== "undefined" && document.querySelector) ? document.querySelector('input[name="bugLine"]:checked') : null;
    const justify = typeof document !== "undefined" ? document.getElementById("bugJustify")?.value || "" : "";
    const chosen = checked ? Number(checked.value) : 0;
    if (!chosen || String(justify).trim().length < 20) {
      if (typeof toast === "function") toast("Selecione uma linha e escreva ao menos 20 caracteres.");
      return null;
    }
    const correct = chosen === bug.fault;
    if (typeof Storage !== "undefined" && typeof Storage.recordBugHunt === "function") {
      Storage.recordBugHunt({ day: bug.day, case: bug.title, line: chosen, correct, justify: String(justify).slice(0, 500) });
    }
    revealAutopsy(bug, correct, justify);
    if (typeof toast === "function") toast(correct ? "Diagnóstico correto. Autópsia liberada." : "Diagnóstico incorreto. Estude a autópsia.");
    return { correct, line: chosen, fault: bug.fault };
  }

  function revealAutopsy(bug, correct, justify) {
    const el = typeof document !== "undefined" ? document.getElementById("bugAutopsy") : null;
    if (!el) return;
    const lines = bug.lines.map((line, i) => `<div${i + 1 === bug.fault ? ' data-line="fault"' : ""}><code>${String(i + 1).padStart(2, "0")} ${esc(line)}</code></div>`).join("");
    el.innerHTML = `<h3>Autópsia · ${correct ? "acertou a linha" : "linha correta: " + bug.fault}</h3>
      <p>${esc(bug.why)}</p><div class="bug-autopsy">${lines}</div>
      <p class="small muted">Sua hipótese: ${esc(justify).slice(0, 300)}</p>`;
    el.hidden = false;
  }

  function toggleAutopsy() {
    const el = typeof document !== "undefined" ? document.getElementById("bugAutopsy") : null;
    if (!el) return;
    if (!el.innerHTML) revealAutopsy(dailyBug(), false, "Autópsia solicitada sem diagnóstico prévio.");
    else el.hidden = !el.hidden;
  }

  /* ---------- Montagem idempotente ---------- */

  function mount(v) {
    if (!v || typeof v.insertAdjacentHTML !== "function") return null;
    if (typeof v.querySelector === "function") v.querySelector("#forge4Widgets")?.remove();
    const html = `
<section id="forge4Widgets" class="forge4-grid forge4-grid--wide" aria-label="Painel de comando FORGE 4.0" style="margin-top:16px">
  ${heroHTML()}
  <div class="forge4-grid">
    ${sm2RadarHTML()}
    ${constellationHTML()}
  </div>
  ${heatmapHTML()}
  ${bugHuntHTML()}
</section>`;
    v.insertAdjacentHTML("beforeend", html);
    return html;
  }

  function openLesson(id) {
    if (typeof window === "undefined") return;
    window.currentLesson = null;
    if (typeof window.openLesson === "function") { window.openLesson(id); return; }
    const found = lessonList().find(l => l.id === id);
    if (found && typeof window.openTrack === "function") window.openTrack(found.track);
    else go("tracks");
  }

  const api = {
    mount, go, heroHTML, sm2RadarHTML, constellationHTML, heatmapHTML, bugHuntHTML,
    priorityAction, dailyBug, submitBug, toggleAutopsy, openLesson,
    state: { get seed() { return userSeed(); } }
  };
  if (typeof window !== "undefined") window.ForgeWidgets4 = api;
})();

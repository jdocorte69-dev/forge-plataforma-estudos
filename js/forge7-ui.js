/* ============================================================
   FORGE 7.0 — forge7-ui.js
   Camada de apresentação aditiva: hero → mapa estelar → hub de
   ferramentas, páginas \"O Porquê de Tudo\" e protocolo de estudo.
   Sem rede, sem dependências e sem sobrescrever módulos legados.
   ============================================================ */

(function () {
  "use strict";

  const C = (typeof window.FORGE7_CONTENT === "undefined") ? null : window.FORGE7_CONTENT;

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, Number(n) || 0));
  }

  /* ---------- Baixo nível: progresso e estado ---------- */

  function state() {
    return (typeof window.Storage !== "undefined") ? window.Storage.get() : {};
  }

  function allLessons() {
    return (typeof lessons !== "undefined" && Array.isArray(lessons)) ? lessons : [];
  }

  function doneSet() {
    return new Set(Array.isArray(state().done) ? state().done : []);
  }

  function nodeProgress(node) {
    const items = allLessons().filter(l => (node.tracks || []).includes(l.track));
    if (!items.length) return { pct: 0, done: 0, total: 0 };
    const done = items.filter(l => doneSet().has(l.id)).length;
    return { pct: Math.round(done / items.length * 100), done, total: items.length };
  }

  function nodeStatus(node, index) {
    const p = nodeProgress(node);
    const assessments = state().assessments || {};
    const scored = allLessons()
      .filter(l => (node.tracks || []).includes(l.track) && assessments[l.id])
      .filter(l => Number(assessments[l.id].best) >= 8).length;
    const mastered = p.total > 0 && (p.pct >= 80 || scored >= 3);
    if (mastered) return "mastered";
    if (!node.prereq) return "active";
    const idx = (C ? C.map : []).findIndex(x => x.id === node.prereq);
    if (idx < 0) return "active";
    const before = (C ? C.map : [])[idx];
    const pct = nodeProgress(before).pct;
    return pct >= 30 || index === 1 ? "active" : "locked";
  }

  function heroData() {
    const s = state();
    const ids = allLessons();
    const done = ids.filter(l => (s.done || []).includes(l.id)).length;
    const pct = ids.length ? Math.round(done / ids.length * 100) : 0;
    let moduleId = (s.progress && s.progress.currentModule) || null;
    if (!moduleId && typeof window.Plan !== "undefined" && window.Plan.pathIds) {
      const first = window.Plan.pathIds()[0];
      const match = ids.find(l => l.id === first);
      if (match) {
        const map = (C ? C.map : []).find(n => (n.tracks || []).includes(match.track));
        moduleId = map ? map.id : null;
      }
    }
    if (!moduleId) moduleId = "M1";
    const node = (C ? C.map : []).find(n => n.id === moduleId) || (C ? C.map : [])[0];
    return {
      pct: clamp(pct, 0, 100),
      moduleId: moduleId,
      moduleTitle: node ? node.title : "Sua primeira aula",
      streak: Number(s.streak) || 0,
      xp: Number(s.xp) || 0,
      lessonId: (typeof nextLessonId === "function") ? nextLessonId() : (ids[0] ? ids[0].id : null)
    };
  }

  /* ---------- Destaque de código (sem biblioteca externa) ---------- */

  const TOKEN_RE = /(\/\/[^\n]*|#[^\n]*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b\d+(?:\.\d+)?\b|\b(?:int|return|for|if|else|while|def|from|import|as|assert|print|void|static|const|sizeof|class|new|let|in|not|and|or|True|False|None|include)\b|\b[A-Za-z_]\w*(?=\())/g;

  function highlightLine(raw) {
    return String(raw).replace(TOKEN_RE, token => {
      let cls = "tok-key";
      if (/^(\/\/|#)/.test(token)) cls = "tok-com";
      else if (/^["']/.test(token)) cls = "tok-str";
      else if (/^\d/.test(token)) cls = "tok-num";
      else if (/\($/.test(token)) cls = "tok-fn";
      return `<span class="${cls}">${esc(token)}</span>`;
    });
  }

  function codeHTML(code, lang) {
    const lines = String(code || "").replace(/\r/g, "").split("\n");
    const id = "f7code" + Math.random().toString(36).slice(2, 9);
    const body = lines.map((line, i) =>
      `<span class="f7-code-line"><span class="f7-code-num" aria-hidden="true">${i + 1}</span><span>${highlightLine(line) || "&nbsp;"}</span></span>`
    ).join("");
    return `<div class="f7-code">
      <div class="f7-code-head"><span class="f7-lang">${esc(lang || "c")}</span>
        <button type="button" class="f7-copy" data-f7-action="copy" data-target="${id}" aria-label="Copiar código">Copiar</button>
      </div>
      <pre class="f7-code-body" id="${id}"><code>${body}</code></pre>
    </div>`;
  }

  /* ---------- Componentes das três camadas ---------- */

  function heroHTML() {
    const d = heroData();
    return `<section class="f7-hero" aria-labelledby="f7HeroTitle">
      <div>
        <p class="f7-eyebrow">Sua missão agora · ${esc(d.moduleId)}</p>
        <h2 id="f7HeroTitle">${esc(d.moduleTitle)}</h2>
        <p>Continue de onde parou. Cada aula concluída vira evidência no mapa e revisão no radar SM-2.</p>
        <div class="f7-hero-actions">
          <button type="button" data-f7-action="continue">▶ Continuar estudando</button>
          <button type="button" data-f7-action="goto" data-page="porque">O porquê de tudo</button>
          <span class="f7-flame" aria-label="Sequência de ${d.streak} dias e ${d.xp} pontos de experiência">
            <strong>${d.streak}</strong><small>dias</small><strong>${d.xp}</strong><small>XP</small>
          </span>
        </div>
      </div>
      <div class="f7-hero-ring" data-value="${d.pct}%" style="--f7-progress:${d.pct / 100}" role="img" aria-label="Progresso geral: ${d.pct}%">
        <svg viewBox="0 0 92 92" aria-hidden="true" focusable="false">
          <circle class="f7-ring-track" cx="46" cy="46" r="40"></circle>
          <circle class="f7-ring-value" cx="46" cy="46" r="40"></circle>
        </svg>
      </div>
    </section>`;
  }

  function mapHTML() {
    const nodes = (C ? C.map : []).map((node, i) => {
      const status = nodeStatus(node, i);
      const p = nodeProgress(node);
      const popoverId = "f7pop-" + node.id;
      const badge = status === "mastered" ? "Dominado" : status === "active" ? "Em progresso" : "Bloqueado";
      const tone = status === "mastered" ? ' data-tone="success"' : "";
      return `<article class="f7-node" role="listitem" data-status="${status}" data-node="${esc(node.id)}">
        <button type="button" class="f7-node-toggle" data-f7-action="toggle-node" aria-expanded="false" aria-controls="${popoverId}">
          <span class="f7-eyebrow">${esc(node.id)}</span>
          <h3>${esc(node.title)}</h3>
          <p>${p.total ? `${p.done}/${p.total} aulas · ${p.pct}%` : "Pré-requisito de cálculo e computação"}</p>
          <span class="bar" aria-hidden="true"><i style="width:${p.pct}%"></i></span>
          <span class="f7-badge"${tone}>${badge}</span>
        </button>
        <div class="f7-node-popover" id="${popoverId}" role="group" aria-label="Tópicos de ${esc(node.title)}">
          <strong>${esc(node.title)}</strong>
          <ul>${(node.topics || []).map(t => `<li>${esc(t)}</li>`).join("")}</ul>
          <p class="small muted">Pré-requisito: ${esc(node.prereq || "nenhum")} · ${badge}</p>
          <button type="button" class="ghost tiny" data-f7-action="goto" data-page="porque" data-anchor="${esc(node.id)}">Ver o porquê →</button>
        </div>
      </article>`;
    }).join("");
    return `<section class="section" aria-labelledby="f7MapTitle">
      <h2 class="f7-section-title" id="f7MapTitle">Mapa estelar · Matemática antes do cálculo</h2>
      <div class="f7-map" role="list" tabindex="0" aria-label="Mapa estelar com seis módulos; role para percorrer os nós">${nodes}</div>
      <p class="small muted">Cadeia rígida: M1 aritmética → M2 álgebra → M3 funções → M4 discreta/linear → M5 probabilidade → M6 cálculo. Toque em um nó para ver os tópicos.</p>
    </section>`;
  }

  function toolsHTML() {
    const tools = [
      ["lab", "_logic", "⌘", "Portas e somadores", "Simulador lógico"],
      ["lab", "_cpu", "⚙", "Registradores e flags", "Simulador CPU"],
      ["crypto", "", "⚿", "CSPRNG e entropia", "Laboratório crypto"],
      ["lab", "_ai", "∑", "Gradiente e atenção", "Tensor AI"],
      ["bugs", "", "✖", "Memória, rede e cripto", "Caça-bugs diário"],
      ["oral", "", "◉", "Rubrica 0–10", "Prova oral"],
      ["review", "", "◷", "Radar SM-2", "Revisão espaçada"],
      ["porque", "_mapa", "◇", "Pré-requisitos e gênese", "Grafo de dependências"],
      ["summaries", "", "▤", "Resumos mestres", "Biblioteca aberta"]
    ];
    return `<section class="section" aria-labelledby="f7HubTitle">
      <h2 class="f7-section-title" id="f7HubTitle">Ferramentas vivas</h2>
      <div class="f7-hub">${tools.map(([page, suffix, icon, desc, label]) =>
        `<button type="button" class="f7-tool" data-f7-action="goto" data-page="${page}" data-lab="${suffix}">
          <span aria-hidden="true">${icon}</span><strong>${esc(label)}</strong><small>${esc(desc)}</small>
        </button>`).join("")}</div>
    </section>`;
  }

  /* ---------- Páginas completas ---------- */

  function porquePage(v) {
    if (!v) return;
    const steps = (C && C.didacticSteps) || [];
    const autopsies = (C && C.autopsies) || [];
    v.innerHTML = `<div class="eyebrow">Método FORGE 7.0</div>
      <h1 class="h1">O Porquê de Tudo</h1>
      <p class="sub">Nenhum conteúdo entra como decreto. Todo conceito passa por sete degraus e toda ideia grande é autopsiada: qual problema ela resolveu, o que foi preciso inventar e onde a regra quebra.</p>
      <section class="section" aria-labelledby="f7StepsTitle">
        <h2 class="f7-section-title" id="f7StepsTitle">Os 7 passos didáticos</h2>
        <ol class="f7-steps">${steps.map(s => `<li><strong>${esc(s.title)}</strong><p>${esc(s.desc)}</p><p class="small muted">✓ ${esc(s.check)}</p></li>`).join("")}</ol>
      </section>
      <section class="section" aria-labelledby="f7AutopsiesTitle">
        <h2 class="f7-section-title" id="f7AutopsiesTitle">10 autópsias históricas</h2>
        <div class="f7-autopsies">${autopsies.map(a => `
          <details class="f7-autopsy" id="${esc(a.id)}">
            <summary><strong>${esc(a.title)}</strong><span class="small muted">${esc(a.era)}</span></summary>
            <p><b>Problema:</b> ${esc(a.problem)}</p>
            <p><b>Restrição:</b> ${esc(a.constraint)}</p>
            <p><b>Construção:</b> ${esc(a.construction)}</p>
            <p><b>Prova/verificação:</b> ${esc(a.proof)}</p>
            <p><b>Consequência:</b> ${esc(a.consequence)}</p>
            <p class="f7-formula">${esc(a.formula)}</p>
            <p class="small muted">Camadas: ${(a.layers || []).map(esc).join(" → ")}</p>
            ${codeHTML(a.code, /^def |^from |^import |^primos |^alpha/.test(a.code || "") ? "python" : /^loop:|^  (sub|cmp|jne)/.test(a.code || "") ? "asm" : "c")}
          </details>`).join("")}</div>
      </section>
      ${mapHTML()}
      <section class="section" aria-labelledby="f7ComputingTitle">
        <h2 class="f7-section-title" id="f7ComputingTitle">Cadeia de computação</h2>
        <div class="f7-map" role="list" tabindex="0" aria-label="Cadeia de computação C1 a C6; role para percorrer os nós">${((C && C.computing) || []).map(c => `<article class="f7-node" role="listitem">
          <h3>${esc(c.id)} · ${esc(c.title)}</h3>
          <p>${(c.topics || []).map(esc).join(" · ")}</p>
          <span class="small muted">Pré-requisito: ${esc(c.prereq || "nenhum")}</span>
        </article>`).join("")}</div>
      </section>`;
  }

  function stellarPage(v) {
    if (!v) return;
    v.innerHTML = `<div class="eyebrow">Camada 2 · sequência obrigatória</div>
      <h1 class="h1">Mapa estelar da matemática</h1>
      <p class="sub">A ordem não é estética: cada nó depende do anterior. O cálculo vem por último porque derivadas e integrais pressupõem funções, álgebra linear e probabilidade.</p>
      ${mapHTML()}`;
  }

  function toolsPage(v) {
    if (!v) return;
    v.innerHTML = `<div class="eyebrow">Camada 3 · aplicação imediata</div>
      <h1 class="h1">Hub de ferramentas vivas</h1>
      <p class="sub">Laboratórios, simuladores e avaliação em um só lugar. Cada execução vira evidência local no seu plano.</p>
      ${toolsHTML()}`;
  }

  function protocolPage(v) {
    if (!v) return;
    const steps = (C && C.protocol) || [];
    const pillars = (C && C.learningScience) || [];
    v.innerHTML = `<div class="eyebrow">Como estudar</div>
      <h1 class="h1">Protocolo de estudo em 5 passos</h1>
      <p class="sub">Uma sessão não termina quando o cronômetro para: termina quando você consegue reconstruir o conteúdo sem olhar e ensiná-lo com as próprias palavras.</p>
      <ol class="f7-steps">${steps.map(s => `<li><strong>${s.n}. ${esc(s.title)} · ${s.minutes} min</strong><p>${esc(s.desc)}</p>
        <button type="button" class="ghost tiny" data-f7-action="protocol" data-step="${s.n - 1}">Registrar etapa</button></li>`).join("")}</ol>
      <section class="section" aria-labelledby="f7ScienceTitle">
        <h2 class="f7-section-title" id="f7ScienceTitle">Ciência da aprendizagem</h2>
        <div class="grid">${pillars.map(p => `<div class="card"><h3>${esc(p.name)}</h3>
          <p class="small muted">${esc(p.evidence)}</p><p>${esc(p.practice)}</p>
          <button type="button" class="ghost tiny" data-f7-action="science" data-kind="${esc(p.key)}">Registrar prática</button></div>`).join("")}</div>
      </section>
      <section class="section" aria-labelledby="f7MasterTitle">
        <h2 class="f7-section-title" id="f7MasterTitle">Resumos mestres por livro</h2>
        <p class="muted">Cada resumo contém mapa conceitual, enciclopédia dos porquês, fórmulas e código auditados, guia para ensinar e avaliação mestra com 20 questões comentadas.</p>
        <div class="actions"><button type="button" data-f7-action="goto" data-page="summaries">Abrir biblioteca de resumos →</button></div>
      </section>`;
  }

  /* ---------- Montagem e eventos ---------- */

  function mountDashboard(root) {
    if (!root || !C) return;
    const heroRoot = root.querySelector("#f7HeroRoot");
    if (heroRoot && !heroRoot.children.length) heroRoot.innerHTML = heroHTML();
    const mapRoot = root.querySelector("#f7MapRoot");
    if (mapRoot && !mapRoot.children.length) mapRoot.innerHTML = mapHTML();
    const hubRoot = root.querySelector("#f7HubRoot");
    if (hubRoot && !hubRoot.children.length) hubRoot.innerHTML = toolsHTML();
    updateHero(root);
  }

  function updateHero(root) {
    const scope = root || document;
    const ring = scope.querySelector(".f7-hero-ring[data-value]");
    if (!ring) return;
    const d = heroData();
    ring.dataset.value = d.pct + "%";
    ring.style.setProperty("--f7-progress", String(d.pct / 100));
    ring.setAttribute("aria-label", "Progresso geral: " + d.pct + "%");
  }

  function action(button) {
    const kind = button.dataset.f7Action;
    if (kind === "toggle-node") {
      const node = button.closest(".f7-node");
      const open = node && node.classList.toggle("is-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
      return;
    }
    if (kind === "copy") {
      const target = document.getElementById(button.dataset.target);
      const text = target ? target.innerText : "";
      const done = () => {
        button.dataset.copied = "true";
        button.textContent = "Copiado";
        setTimeout(() => { button.dataset.copied = "false"; button.textContent = "Copiar"; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => toast("Copia manual: selecione o código."));
      } else {
        toast("Copia manual: selecione o código.");
      }
      return;
    }
    if (kind === "continue") {
      const id = heroData().lessonId;
      if (id && typeof openLesson === "function") openLesson(id);
      else if (typeof goToPage === "function") goToPage("tracks");
      return;
    }
    if (kind === "goto") {
      const page = button.dataset.page;
      const lab = button.dataset.lab;
      if (lab && typeof window.ForgeLabTab === "function") window.ForgeLabTab(lab.replace(/^_/, ""));
      if (typeof goToPage === "function") goToPage(page);
      const anchor = button.dataset.anchor;
      if (anchor) {
        setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ block: "start" }), 40);
      }
      return;
    }
    if (kind === "protocol") {
      if (window.Storage && typeof window.Storage.setStudyProtocolStep === "function") {
        window.Storage.setStudyProtocolStep(button.dataset.step, { bookKey: "protocolo" });
        toast("Etapa registrada no protocolo de estudo.");
      }
      return;
    }
    if (kind === "science") {
      if (window.Storage && typeof window.Storage.recordLearningScience === "function") {
        window.Storage.recordLearningScience(button.dataset.kind);
        toast("Prática registrada no radar de aprendizagem.");
      }
    }
  }

  document.addEventListener("click", event => {
    const button = event.target && event.target.closest("[data-f7-action]");
    if (button) action(button);
  });

  window.Forge7UI = {
    heroHTML,
    mapHTML,
    toolsHTML,
    codeHTML,
    mountDashboard,
    updateHero,
    porquePage,
    protocolPage,
    stellarPage,
    toolsPage,
    renderPage(v) {
      const root = document.getElementById("view");
      mountDashboard(root);
      updateHero(root);
      return v;
    }
  };
})();

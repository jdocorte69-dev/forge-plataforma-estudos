/* ============================================================
   FORGE — library-rich.js
   Biblioteca enriquecida, glossário e busca global.
   Classic JS: depende de app.js, data.js e data-library-extra.js.
   ============================================================ */

(function (global) {
  "use strict";

  /* ---------- Utilitários ---------- */

  function esc(value) {
    if (typeof global.escHtml === "function") return global.escHtml(value);
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function norm(value) {
    return String(value == null ? "" : value)
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().trim();
  }

  function slug(value) {
    return norm(value).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "recurso";
  }

  // Chave estável e única derivada do título (sobrevive a recarregamentos).
  function keyFor(title) {
    const n = norm(title);
    let hash = 0;
    for (let i = 0; i < n.length; i++) hash = (hash * 31 + n.charCodeAt(i)) >>> 0;
    return "lr-" + slug(n) + "-" + hash.toString(36);
  }

  function goPage(name) {
    try { page = name; } catch (e) { global.page = name; }
    if (typeof render === "function") render();
  }

  function viewElement(v) {
    return v || document.getElementById("view");
  }

  /* ---------- LibraryRich ---------- */

  const LibraryRich = {};

  function inferLanguage(r) {
    const url = String(r.url || "").toLowerCase();
    const title = String(r.title || "");
    const text = norm(title + " " + r.area);
    if (/\/pt(-br)?(\/|$)/.test(url) || /pt\.khanacademy|\.com\.br|\.org\.br|\.br\//.test(url)) return "pt-BR";
    if (/[À-ÿ]/.test(title)) return "pt-BR";
    if (/portugues|ensino medio|universo narrado|khan academy|matematica do ensino/.test(text)) return "pt-BR";
    if (/matematica|aprendizagem|tdah|fisica|ferramenta/.test(norm(r.area))) return "pt-BR";
    return "en";
  }

  LibraryRich.resources = function resources() {
    const legacy = (typeof LIBRARY !== "undefined" && Array.isArray(LIBRARY) ? LIBRARY : [])
      .filter(x => Array.isArray(x) && x.length >= 4)
      .map(x => ({
        title: String(x[1] || ""),
        author: "",
        type: "referência",
        area: String(x[0] || ""),
        level: String(x[4] || "Todos"),
        language: inferLanguage({ title: x[1], area: x[0], url: x[3] }),
        free: false,
        license: "desconhecida — verificar",
        url: String(x[3] || ""),
        verifiedAt: "",
        note: String(x[2] || ""),
        priority: 2
      }));

    const byTitle = new Map();
    legacy.forEach((r, i) => byTitle.set(norm(r.title), i));

    const extra = Array.isArray(global.LIBRARY_EXTRA) ? global.LIBRARY_EXTRA : [];
    extra.forEach(raw => {
      if (!raw || typeof raw !== "object") return;
      const r = {
        title: String(raw.title || ""),
        author: String(raw.author || ""),
        type: String(raw.type || "referência"),
        area: String(raw.area || ""),
        level: String(raw.level || "Todos"),
        language: String(raw.language || inferLanguage(raw)),
        free: Boolean(raw.free),
        license: String(raw.license || "desconhecida — verificar"),
        url: String(raw.url || ""),
        verifiedAt: String(raw.verifiedAt || ""),
        note: String(raw.note || ""),
        priority: Number(raw.priority) || 2
      };
      const key = norm(r.title);
      if (!key) return;
      const at = byTitle.get(key);
      if (at === undefined) {
        byTitle.set(key, legacy.length);
        legacy.push(r);
      } else {
        legacy[at] = r; // a entrada rica vence a legada.
      }
    });

    return legacy;
  };

  function options(values) {
    return Array.from(new Set(values.filter(Boolean)))
      .sort((a, b) => String(a).localeCompare(String(b), "pt-BR"))
      .map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
  }

  LibraryRich.filtersHTML = function filtersHTML() {
    const rs = LibraryRich.resources();
    return `
<div class="card section" id="lrFilters">
  <div class="row"><h2>Filtros combináveis</h2><span class="pill" id="lrCount">${rs.length} recursos</span></div>
  <div class="lr-filters" style="display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(190px,1fr))">
    <label>Área
      <select class="field" id="lrArea" data-lr-filter="area" aria-label="Filtrar por área">
        <option value="">Todas as áreas</option>${options(rs.map(r => r.area))}
      </select>
    </label>
    <label>Nível
      <select class="field" id="lrLevel" data-lr-filter="level" aria-label="Filtrar por nível">
        <option value="">Todos os níveis</option>${options(rs.map(r => r.level))}
      </select>
    </label>
    <label>Tipo
      <select class="field" id="lrType" data-lr-filter="type" aria-label="Filtrar por tipo">
        <option value="">Todos os tipos</option>${options(rs.map(r => r.type))}
      </select>
    </label>
    <label>Idioma
      <select class="field" id="lrLanguage" data-lr-filter="language" aria-label="Filtrar por idioma">
        <option value="">Todos os idiomas</option>${options(rs.map(r => r.language))}
      </select>
    </label>
    <label>Acesso
      <select class="field" id="lrAccess" data-lr-filter="access" aria-label="Filtrar por acesso">
        <option value="all">Todos</option>
        <option value="free">Gratuito verificado</option>
        <option value="paid">Pago verificado</option>
      </select>
    </label>
    <label>Sequência recomendada
      <select class="field" id="lrSequence" data-lr-filter="sequence" aria-label="Ordenar por sequência recomendada">
        <option value="all">Ordem padrão</option>
        <option value="priority">Prioridade 1 primeiro</option>
      </select>
    </label>
    <label>Texto (título, autor, área, nota)
      <input class="field" id="lrText" data-lr-filter="text" type="search" placeholder="Ex.: ponteiros, RFC, cálculo..." aria-label="Buscar no texto" oninput="LibraryRich.applyFilters()">
    </label>
    <label>Pré-requisito / tema (título ou nota)
      <input class="field" id="lrPrereq" data-lr-filter="prereq" type="search" placeholder="Ex.: funções, TCP, permissões..." aria-label="Buscar pré-requisito" oninput="LibraryRich.applyFilters()">
    </label>
  </div>
  <p class="small">Acesso só é afirmado quando a data de verificação está registrada. Itens sem verificação aparecem como “Acesso não confirmado”.</p>
</div>`;
  };

  function resourceCard(r, order) {
    const key = keyFor(r.title);
    const consulted = Boolean(((Storage.get().resourceMeta || {})[key] || {}).consulted);
    const verified = Boolean(r.verifiedAt);
    // Nunca rotular como "Gratuito" sem data de verificação.
    const access = verified ? (r.free ? "Gratuito" : "Pago") : "Acesso não confirmado";
    const accessClass = !verified ? "warn" : r.free ? "success" : "info";
    const search = norm([r.title, r.author, r.type, r.area, r.level, r.language, r.note].join(" "));
    const prereq = norm(r.title + " " + r.note);
    return `
<div class="card lr-card" data-lr-key="${esc(key)}" data-lr-order="${order}"
     data-lr-area="${esc(r.area)}" data-lr-level="${esc(r.level)}" data-lr-type="${esc(r.type)}"
     data-lr-language="${esc(r.language)}" data-lr-free="${r.free ? "true" : "false"}"
     data-lr-verified="${verified ? "true" : "false"}" data-lr-priority="${Number(r.priority) || 2}"
     data-lr-search="${esc(search)}" data-lr-prereq="${esc(prereq)}">
  <div class="row">
    <span class="pill">${esc(r.area)}</span>
    <span class="pill info">${esc(r.level)}</span>
    <span class="pill">${esc(r.type)}</span>
    <span class="pill">${esc(r.language)}</span>
    <span class="pill ${accessClass}">${esc(access)}</span>
  </div>
  <h3>${esc(r.title)}</h3>
  ${r.author ? `<p class="small">${esc(r.author)}</p>` : ""}
  <p class="muted">${esc(r.note)}</p>
  <p class="small">Licença: ${esc(r.license)} · Verificado em: ${verified ? esc(r.verifiedAt) : "não verificado"}</p>
  ${r.url ? `<a class="resource-link" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Abrir recurso ↗</a>` : `<span class="small">Sem link verificável</span>`}
  <div class="row" style="margin-top:9px">
    <button class="secondary" data-lr-toggle="${esc(key)}" aria-pressed="${consulted ? "true" : "false"}" onclick="LibraryRich.toggleResource('${esc(key)}')">${consulted ? "Consultado ✓" : "Marcar como consultado"}</button>
  </div>
</div>`;
  }

  LibraryRich.pageHTML = function pageHTML() {
    const rs = LibraryRich.resources();
    return `
<div class="eyebrow">Fontes confiáveis e rastreáveis</div>
<h1 class="h1">Biblioteca enriquecida</h1>
<p class="sub">Filtros combináveis por área, nível, tipo, idioma, acesso verificado, texto e pré-requisito. Marque o que consultou: o registro fica salvo neste navegador.</p>
${LibraryRich.filtersHTML()}
<div class="grid2 section" id="lrGrid">
  ${rs.map((r, i) => resourceCard(r, i)).join("")}
</div>`;
  };

  LibraryRich.page = function pageRender(v) {
    const el = viewElement(v);
    if (el) el.innerHTML = LibraryRich.pageHTML();
  };

  LibraryRich.applyFilters = function applyFilters() {
    const grid = document.getElementById("lrGrid");
    if (!grid) return 0;
    const val = name => {
      const el = document.querySelector('[data-lr-filter="' + name + '"]');
      return el ? String(el.value || "") : "";
    };
    const area = norm(val("area"));
    const level = norm(val("level"));
    const type = norm(val("type"));
    const language = norm(val("language"));
    const access = val("access") || "all";
    const sequence = val("sequence") || "all";
    const text = norm(val("text"));
    const prereq = norm(val("prereq"));

    const cards = Array.from(grid.querySelectorAll(".lr-card"));
    let visible = 0;
    cards.forEach(card => {
      const free = card.dataset.lrFree === "true";
      const verified = card.dataset.lrVerified === "true";
      const okArea = !area || norm(card.dataset.lrArea) === area;
      const okLevel = !level || norm(card.dataset.lrLevel) === level;
      const okType = !type || norm(card.dataset.lrType) === type;
      const okLanguage = !language || norm(card.dataset.lrLanguage) === language;
      const okAccess = access === "free" ? (free && verified)
        : access === "paid" ? (!free && verified) : true;
      const okText = !text || (card.dataset.lrSearch || "").includes(text);
      const okPrereq = !prereq || (card.dataset.lrPrereq || "").includes(prereq);
      const show = okArea && okLevel && okType && okLanguage && okAccess && okText && okPrereq;
      card.classList.toggle("hidden", !show);
      if (show) visible++;
    });

    // Reordena sem reconstruir os cartões (os filtros e o estado se preservam).
    if (sequence === "priority") {
      cards.slice().sort((a, b) =>
        (Number(a.dataset.lrPriority) || 2) - (Number(b.dataset.lrPriority) || 2) ||
        Number(a.dataset.lrOrder) - Number(b.dataset.lrOrder)
      ).forEach(card => grid.appendChild(card));
    } else {
      cards.slice().sort((a, b) => Number(a.dataset.lrOrder) - Number(b.dataset.lrOrder))
        .forEach(card => grid.appendChild(card));
    }

    const count = document.getElementById("lrCount");
    if (count) count.textContent = `${visible} de ${cards.length} recursos`;
    return visible;
  };

  LibraryRich.toggleResource = function toggleResource(idKey) {
    const s = Storage.get();
    if (!s.resourceMeta || typeof s.resourceMeta !== "object" || Array.isArray(s.resourceMeta)) s.resourceMeta = {};
    const meta = s.resourceMeta[idKey] = (s.resourceMeta[idKey] && typeof s.resourceMeta[idKey] === "object")
      ? s.resourceMeta[idKey] : {};
    meta.consulted = !meta.consulted;
    meta.updatedAt = new Date().toISOString();
    Storage.save();

    // Re-renderiza apenas o cartão e o contador, preservando os filtros ativos.
    const btn = document.querySelector('[data-lr-toggle="' + idKey + '"]');
    if (btn) {
      btn.textContent = meta.consulted ? "Consultado ✓" : "Marcar como consultado";
      btn.setAttribute("aria-pressed", String(meta.consulted));
    }
    LibraryRich.applyFilters();
    if (typeof toast === "function") toast(meta.consulted ? "Recurso marcado como consultado." : "Marcação removida.");
    return meta.consulted;
  };

  /* ---------- Glossário ---------- */

  const GLOSSARY_TERMS = [
    ["Abstração", "Representar o essencial de um sistema, ignorando detalhes irrelevantes para a tarefa.", "Engenharia"],
    ["Algoritmo", "Sequência finita e definida de passos para resolver um problema.", "Engenharia"],
    ["API", "Interface pela qual componentes de software interagem.", "Engenharia"],
    ["Array", "Sequência de elementos do mesmo tipo em posições contíguas na linguagem C.", "C"],
    ["Assíntota", "Comportamento limite de uma curva em relação a uma reta ou direção.", "Matemática"],
    ["Backtracking", "Exploração de possibilidades com retorno quando uma escolha não funciona.", "Engenharia"],
    ["Bandwidth", "Capacidade de transmissão de um enlace.", "Redes"],
    ["Build", "Processo de transformar fontes e dependências em artefatos executáveis.", "Engenharia"],
    ["CIDR", "Notação de prefixo para endereçamento e roteamento IP.", "Redes"],
    ["CI/CD", "Integração contínua e entrega/implantação contínuas.", "Engenharia"],
    ["Complexidade", "Medida de recursos necessários em função do tamanho da entrada.", "Engenharia"],
    ["Derivada", "Limite que descreve a taxa de variação instantânea.", "Matemática"],
    ["DNS", "Sistema distribuído de nomes para dados como endereços IP.", "Redes"],
    ["EDO", "Equação diferencial ordinária.", "Matemática"],
    ["EDP", "Equação diferencial parcial.", "Matemática"],
    ["Encapsulamento", "Inclusão de dados de uma camada dentro da unidade de dados de outra.", "Engenharia"],
    ["Heap", "Região de memória usada para alocação dinâmica.", "Sistemas"],
    ["Invariante", "Propriedade que deve permanecer verdadeira em determinadas etapas.", "Engenharia"],
    ["Integral", "Operação associada à acumulação e, em condições apropriadas, à área orientada.", "Matemática"],
    ["Kernel", "Núcleo do sistema operacional.", "Sistemas"],
    ["Latência", "Tempo de resposta ou atraso.", "Redes"],
    ["Linker", "Ligador que combina objetos e bibliotecas.", "Sistemas"],
    ["Mutex", "Mecanismo de exclusão mútua.", "Sistemas"],
    ["Ownership", "Regra sobre quem é responsável por liberar ou administrar um recurso.", "C"],
    ["Ponteiro", "Objeto que armazena um endereço de memória ou valor nulo.", "C"],
    ["Protocolo", "Conjunto de regras para comunicação.", "Redes"],
    ["Race condition", "Resultado dependente de uma ordem de execução concorrente não controlada.", "Sistemas"],
    ["Recursão", "Definição ou algoritmo que usa instâncias menores do mesmo problema.", "Engenharia"],
    ["Revisão espaçada", "Prática de recuperar conteúdo em intervalos distribuídos.", "Aprendizagem"],
    ["Socket", "Interface de comunicação entre processos, frequentemente usada em redes.", "Redes"],
    ["Stack", "Estrutura de chamadas e armazenamento automático associada à execução.", "Sistemas"],
    ["Throughput", "Taxa efetiva de transferência.", "Redes"],
    ["Undefined behavior", "Comportamento para o qual o padrão C não impõe requisitos.", "C"],
    ["Vetor", "Objeto matemático com operações e propriedades específicas; em programação, pode designar array, conforme o contexto.", "Matemática"]
  ];

  const Glossary = {};

  Glossary.terms = function terms() {
    return GLOSSARY_TERMS.map(t => ({ term: t[0], definition: t[1], area: t[2] }));
  };

  Glossary.pageHTML = function pageHTML() {
    const sorted = Glossary.terms().slice().sort((a, b) =>
      norm(a.term).localeCompare(norm(b.term), "pt-BR"));
    return `
<div class="eyebrow">Referência rápida</div>
<h1 class="h1">Glossário Forge</h1>
<p class="sub">Definições curtas em português. Busque por termo, área ou parte da definição.</p>
<input class="field" id="glossarySearch" type="search" placeholder="Buscar termo, área ou definição..." aria-label="Buscar no glossário" oninput="Glossary.filter(this.value)">
<p class="small section" id="glossaryCount">${sorted.length} termos</p>
<div class="grid2" id="glossaryList">
  ${sorted.map(t => `
  <div class="card gloss-term" data-gloss="${esc(norm(t.term + " " + t.area + " " + t.definition))}">
    <div class="row"><h3>${esc(t.term)}</h3><span class="pill">${esc(t.area)}</span></div>
    <p class="muted">${esc(t.definition)}</p>
  </div>`).join("")}
</div>`;
  };

  Glossary.page = function pageRender(v) {
    const el = viewElement(v);
    if (el) el.innerHTML = Glossary.pageHTML();
    Glossary.filter("");
  };

  Glossary.filter = function filter(q) {
    const query = norm(q || "");
    const cards = Array.from(document.querySelectorAll("#glossaryList .gloss-term"));
    let visible = 0;
    cards.forEach(card => {
      const show = !query || (card.dataset.gloss || "").includes(query);
      card.classList.toggle("hidden", !show);
      if (show) visible++;
    });
    const count = document.getElementById("glossaryCount");
    if (count) count.textContent = `${visible} de ${cards.length} termos`;
    return visible;
  };

  /* ---------- GlobalSearch ---------- */

  const GlobalSearch = {};
  const GROUPS = [
    ["aulas", "Aulas"],
    ["modulos", "Módulos"],
    ["laboratorios", "Laboratórios"],
    ["projetos", "Projetos"],
    ["biblioteca", "Biblioteca"],
    ["glossario", "Glossário"]
  ];

  GlobalSearch.search = function search(q) {
    const out = { aulas: [], modulos: [], laboratorios: [], projetos: [], biblioteca: [], glossario: [] };
    const query = norm(q || "");
    if (!query) return out;
    const push = (group, item) => { if (out[group].length < 8) out[group].push(item); };

    (typeof lessons !== "undefined" && Array.isArray(lessons) ? lessons : []).forEach(l => {
      const hay = norm([l.title, l.objective, l.moduleName, l.track].join(" "));
      if (hay.includes(query)) push("aulas", {
        kind: "lesson", type: "Aula", title: l.title || l.id,
        subtitle: l.moduleName || l.track || "", id: l.id
      });
    });

    Object.entries(typeof CURRICULUM !== "undefined" ? CURRICULUM : {}).forEach(([id, t]) => {
      const hay = norm([id, t && t.name].join(" "));
      if (hay.includes(query)) push("modulos", {
        kind: "track", type: "Módulo", title: (t && t.name) || id, subtitle: "Trilha", id
      });
    });

    (Array.isArray(global.LAB_CATALOG) ? global.LAB_CATALOG : []).forEach(l => {
      const hay = norm([l.title, l.area, l.objective, (l.prerequisites || []).join(" ")].join(" "));
      if (hay.includes(query)) push("laboratorios", {
        kind: "lab", type: "Lab", title: l.title || l.id || "Laboratório",
        subtitle: l.area || l.level || "", id: l.id || ""
      });
    });

    (typeof PROJECTS !== "undefined" && Array.isArray(PROJECTS) ? PROJECTS : []).forEach((p, id) => {
      const hay = norm([p[0], p[1], p[3]].join(" "));
      if (hay.includes(query)) push("projetos", {
        kind: "project", type: "Projeto", title: p[0], subtitle: p[3] || "Projeto", id
      });
    });

    LibraryRich.resources().forEach(r => {
      const hay = norm([r.title, r.author, r.area, r.note, r.type].join(" "));
      if (hay.includes(query)) push("biblioteca", {
        kind: "resource", type: "Recurso", title: r.title, subtitle: r.area, id: keyFor(r.title)
      });
    });

    Glossary.terms().forEach(t => {
      const hay = norm([t.term, t.definition, t.area].join(" "));
      if (hay.includes(query)) push("glossario", {
        kind: "term", type: "Glossário", title: t.term, subtitle: t.area, id: t.term
      });
    });

    return out;
  };

  function activate(result) {
    const overlay = document.querySelector(".modal-overlay");
    if (overlay && typeof closeModal === "function") closeModal(overlay);
    switch (result.kind) {
      case "lesson":
        if (typeof openLesson === "function") openLesson(result.id);
        else goPage("lesson");
        break;
      case "track":
        if (typeof openTrack === "function") openTrack(result.id);
        else goPage("tracks");
        break;
      case "lab":
        goPage("lab");
        if (typeof toast === "function") toast(`Laboratório “${result.title}”: selecione-o na lista da aba atual.`);
        break;
      case "project":
        goPage("projects");
        break;
      case "resource": {
        goPage("library");
        setTimeout(() => {
          const card = document.querySelector('[data-lr-key="' + result.id + '"]');
          if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 60);
        break;
      }
      case "term": {
        goPage("glossary");
        const input = document.getElementById("glossarySearch");
        if (input) { input.value = result.title; Glossary.filter(result.title); }
        break;
      }
      default:
        break;
    }
  }

  GlobalSearch.open = function open() {
    if (typeof global.openModal !== "function") return;
    global.openModal(`
<h2>Busca global</h2>
<p class="small">Aulas, módulos, laboratórios, projetos, biblioteca e glossário. Use ↑/↓ e Enter.</p>
<input class="field" id="gsInput" type="search" placeholder="O que você procura?" aria-label="Busca global">
<div id="gsResults" class="section" aria-live="polite"></div>`);

    const overlay = document.querySelector(".modal-overlay");
    const input = overlay && overlay.querySelector("#gsInput");
    const results = overlay && overlay.querySelector("#gsResults");
    if (!input || !results) return;
    let active = -1;

    function buttons() {
      return Array.from(results.querySelectorAll("button[data-gs-index]"));
    }

    function setActive(next) {
      const list = buttons();
      if (!list.length) { active = -1; return; }
      active = (next + list.length) % list.length;
      list.forEach((b, i) => {
        b.classList.toggle("active", i === active);
        b.setAttribute("aria-selected", String(i === active));
      });
      list[active].scrollIntoView({ block: "nearest" });
    }

    function paint() {
      const groups = GlobalSearch.search(input.value);
      active = -1;
      let total = 0;
      const html = GROUPS.map(([id, label]) => {
        const items = groups[id] || [];
        total += items.length;
        if (!items.length) return "";
        return `<div class="gs-group section">
          <div class="row"><span class="pill">${esc(label)}</span><span class="small">${items.length}</span></div>
          ${items.map((item, i) => `
            <button type="button" class="gs-result" data-gs-index="${id}:${i}" style="display:block;width:100%;text-align:left;margin-top:6px" aria-selected="false">
              <span class="pill info">${esc(item.type)}</span>
              <strong>${esc(item.title)}</strong>
              ${item.subtitle ? `<span class="small"> · ${esc(item.subtitle)}</span>` : ""}
            </button>`).join("")}
        </div>`;
      }).join("");
      results.innerHTML = total ? html : `<p class="muted">${input.value.trim() ? "Nenhum resultado para este termo." : "Digite para buscar em toda a plataforma."}</p>`;
    }

    input.addEventListener("input", paint);
    results.addEventListener("click", event => {
      const btn = event.target.closest("button[data-gs-index]");
      if (!btn) return;
      const [group, index] = btn.dataset.gsIndex.split(":");
      const item = (GlobalSearch.search(input.value)[group] || [])[Number(index)];
      if (item) activate(item);
    });
    overlay.addEventListener("keydown", event => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const list = buttons();
        if (!list.length) return;
        event.preventDefault();
        setActive(active < 0 ? (event.key === "ArrowDown" ? 0 : list.length - 1) : active + (event.key === "ArrowDown" ? 1 : -1));
      } else if (event.key === "Enter") {
        const list = buttons();
        if (!list.length) return;
        event.preventDefault();
        const btn = list[active < 0 ? 0 : active];
        const [group, index] = btn.dataset.gsIndex.split(":");
        const item = (GlobalSearch.search(input.value)[group] || [])[Number(index)];
        if (item) activate(item);
      }
    });
    paint();
    input.focus();
  };

  // Atalho global Ctrl+K / Cmd+K, sem interceptar digitação em campos.
  let shortcutBound = false;
  function bindShortcut() {
    if (shortcutBound) return;
    shortcutBound = true;
    document.addEventListener("keydown", event => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "k") return;
      const tag = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea" || tag === "select" || (event.target && event.target.isContentEditable)) return;
      event.preventDefault();
      GlobalSearch.open();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindShortcut);
  else bindShortcut();

  /* ---------- Exposição ---------- */

  global.LibraryRich = LibraryRich;
  global.Glossary = Glossary;
  global.GlobalSearch = GlobalSearch;
})(window);

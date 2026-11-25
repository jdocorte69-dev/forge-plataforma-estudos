/* ============================================================
   FORGE — js/labs-catalog.js
   Catálogo unificado de laboratórios.
   Carregado com defer DEPOIS de app.js e de data-labs-a.js / data-labs-b.js.
   Expõe window.LabCatalog. Filtros vivem apenas em memória (não localStorage).
   ============================================================ */
(function () {
  "use strict";

  var TYPES = [
    {
      key: "simulado",
      label: "Simulado",
      desc: "Executado em ambiente virtual/simulado. Não é execução real: o rótulo descreve o que foi feito, não o que se gostaria de ter feito."
    },
    {
      key: "execucao-real",
      label: "Execução real",
      desc: "Executado de fato no ambiente indicado no laboratório, com as regras de segurança observadas."
    },
    {
      key: "analise-captura",
      label: "Análise de captura",
      desc: "Análise de um PCAP de exemplo fornecido pelo material — não é captura de tráfego realizada pelo aluno."
    }
  ];

  var state = { area: "", level: "", type: "", q: "" };

  /* ---------- utilitários de ambiente / escaping ---------- */

  function esc(value) {
    if (typeof escHtml === "function") return escHtml(value);
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Id seguro dentro de string literal JS em atributo onclick com aspas simples.
  function attrId(value) {
    return esc(String(value == null ? "" : value)
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/[\r\n]/g, " "));
  }

  function text(value) {
    if (value == null) return "";
    if (Array.isArray(value)) return value.map(text).filter(Boolean).join(" · ");
    if (typeof value === "object") {
      try { return JSON.stringify(value); } catch (e) { return String(value); }
    }
    return String(value);
  }

  function list(value) {
    if (value == null || value === "") return [];
    if (Array.isArray(value)) return value.map(text).filter(Boolean);
    return [text(value)];
  }

  function inlineList(value) {
    var items = list(value);
    return items.length ? items.map(function (x) { return esc(x); }).join(" · ") : "Nenhum";
  }

  function listMarkup(value, ordered) {
    var items = list(value);
    if (!items.length) return '<p class="muted">Não informado.</p>';
    var tag = ordered ? "ol" : "ul";
    return "<" + tag + ">" + items.map(function (x) {
      return "<li>" + esc(x) + "</li>";
    }).join("") + "</" + tag + ">";
  }

  function norm(value) {
    return text(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function notify(message) {
    if (typeof toast === "function") toast(message);
  }

  function modal(html) {
    if (typeof openModal === "function") openModal(html);
  }

  function rerender() {
    var activeId = "";
    if (typeof document !== "undefined" && document.activeElement) {
      activeId = document.activeElement.id || "";
    }
    if (typeof render === "function") render();
    if (activeId && typeof document !== "undefined") {
      var el = document.getElementById(activeId);
      if (el && typeof el.focus === "function") el.focus();
    }
  }

  function closeTopModal() {
    if (typeof document === "undefined") return;
    var overlays = document.querySelectorAll(".modal-overlay");
    var overlay = overlays[overlays.length - 1];
    if (!overlay) return;
    if (typeof closeModal === "function") { closeModal(overlay); return; }
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }

  /* ---------- dados / estado ---------- */

  function all() {
    var raw = [];
    if (typeof window !== "undefined" && Array.isArray(window.LAB_CATALOG)) {
      raw = window.LAB_CATALOG;
    } else if (typeof LAB_CATALOG !== "undefined" && Array.isArray(LAB_CATALOG)) {
      raw = LAB_CATALOG; // eslint-disable-line no-undef
    }
    return raw.filter(function (lab) {
      return lab && typeof lab === "object" && !Array.isArray(lab);
    });
  }

  function labById(id) {
    var key = text(id);
    var found = all().filter(function (lab) { return text(lab.id) === key; });
    return found.length ? found[0] : null;
  }

  function readState() {
    if (typeof Storage === "undefined" || typeof Storage.get !== "function") return {};
    try {
      return Storage.get() || {};
    } catch (e) {
      return {};
    }
  }

  function evidenceMap(s) {
    var ev = s && s.labEvidence;
    return ev && typeof ev === "object" && !Array.isArray(ev) ? ev : {};
  }

  function typeLabel(type) {
    var key = text(type);
    for (var i = 0; i < TYPES.length; i++) {
      if (TYPES[i].key === key) return TYPES[i].label;
    }
    return key || "Não informado";
  }

  function typePill(type) {
    var key = text(type);
    if (key === "simulado") return "info";
    if (key === "execucao-real") return "success";
    if (key === "analise-captura") return "warn";
    return "";
  }

  function searchText(lab) {
    return norm([
      lab.id, lab.title, lab.area, lab.level, lab.objective, lab.environment,
      lab.safety, lab.expectedResult, lab.evidence, lab.rubric, lab.executionType,
      list(lab.prerequisites).join(" "), list(lab.concepts).join(" "),
      list(lab.steps).join(" "), list(lab.commonErrors).join(" "),
      list(lab.reflection).join(" "), list(lab.extensions).join(" ")
    ].join(" "));
  }

  function matches(lab) {
    if (state.area && norm(lab.area) !== norm(state.area)) return false;
    if (state.level && norm(lab.level) !== norm(state.level)) return false;
    if (state.type && text(lab.executionType) !== state.type) return false;
    if (state.q && searchText(lab).indexOf(norm(state.q)) === -1) return false;
    return true;
  }

  function filtered() {
    return all().filter(matches);
  }

  /* ---------- API pública ---------- */

  function filters() {
    return {
      area: state.area,
      level: state.level,
      type: state.type,
      q: state.q,
      // aliases para chamadas externas
      nivel: state.level,
      executionType: state.type,
      busca: state.q
    };
  }

  function setFilter(key, value) {
    var map = {
      area: "area",
      nivel: "level", level: "level",
      executionType: "type", type: "type", tipo: "type",
      busca: "q", search: "q", query: "q", q: "q", texto: "q"
    };
    var field = map[String(key || "")];
    if (!field) return;
    state[field] = String(value == null ? "" : value).trim();
    rerender();
  }

  function evidenceStatus(id) {
    var ev = evidenceMap(readState());
    var key = text(id);
    return Object.prototype.hasOwnProperty.call(ev, key) ? "com evidência" : "sem evidência";
  }

  function stats() {
    var labs = all();
    var ev = evidenceMap(readState());
    var byArea = {};
    var byType = {};
    var withEvidence = 0;
    labs.forEach(function (lab) {
      var area = text(lab.area) || "Não informado";
      var type = text(lab.executionType) || "Não informado";
      byArea[area] = (byArea[area] || 0) + 1;
      byType[type] = (byType[type] || 0) + 1;
      if (Object.prototype.hasOwnProperty.call(ev, text(lab.id))) withEvidence++;
    });
    return { total: labs.length, withEvidence: withEvidence, byArea: byArea, byType: byType };
  }

  function selectOptions(values, selected, allLabel) {
    var unique = [];
    values.map(text).filter(Boolean).forEach(function (v) {
      if (unique.indexOf(v) === -1) unique.push(v);
    });
    unique.sort(function (a, b) { return a.localeCompare(b, "pt-BR"); });
    return '<option value="">' + esc(allLabel) + "</option>" + unique.map(function (v) {
      return '<option value="' + esc(v) + '"' + (v === selected ? " selected" : "") + ">" + esc(v) + "</option>";
    }).join("");
  }

  function cardHTML(lab) {
    var id = text(lab.id);
    var status = evidenceStatus(id);
    var hasEvidence = status === "com evidência";
    return [
      '<article class="card" tabindex="0" aria-label="Laboratório: ', esc(text(lab.title) || id), '">',
      '<div class="row" style="flex-wrap:wrap;gap:6px">',
        '<span class="pill">', esc(text(lab.area) || "Sem área"), "</span>",
        '<span class="pill info">', esc(text(lab.level) || "Sem nível"), "</span>",
        '<span class="pill ', esc(typePill(lab.executionType)), '">', esc(typeLabel(lab.executionType)), "</span>",
        '<span class="pill ', hasEvidence ? "success" : "warn", '">', esc(status), "</span>",
      "</div>",
      "<h3>", esc(text(lab.title) || id || "Laboratório sem título"), "</h3>",
      '<p class="muted">', esc(text(lab.objective) || "Objetivo não informado."), "</p>",
      '<p class="small"><strong>Pré-requisitos:</strong> ', inlineList(lab.prerequisites), "</p>",
      '<p class="small"><strong>Ambiente:</strong> ', esc(text(lab.environment) || "Não informado."), "</p>",
      '<div class="small" style="border-left:3px solid var(--warn,#e8a817);background:rgba(232,168,23,.12);padding:8px 10px;border-radius:8px;margin:10px 0">',
        "<strong>⚠ Segurança:</strong> ", esc(text(lab.safety) || "Não informado. Confira as regras antes de executar."),
      "</div>",
      '<p class="small"><strong>Evidência exigida:</strong> ', esc(text(lab.evidence) || "Registre um texto/link que comprove a execução."), "</p>",
      '<p class="small muted"><strong>Rubrica:</strong> ', esc(text(lab.rubric) || "Não informada."), "</p>",
      '<div class="actions" style="flex-wrap:wrap;gap:8px;margin-top:12px">',
        '<button type="button" onclick="LabCatalog.openDetails(\'', attrId(id), '\')">Ver detalhes</button>',
        '<button type="button" class="secondary" onclick="LabCatalog.openEvidence(\'', attrId(id), '\')">Registrar evidência</button>',
      "</div>",
      "</article>"
    ].join("");
  }

  function pageHTML() {
    var labs = all();
    var shown = filtered();
    var st = stats();
    var areas = selectOptions(labs.map(function (l) { return l.area; }), state.area, "Todas as áreas");
    var levels = selectOptions(labs.map(function (l) { return l.level; }), state.level, "Todos os níveis");
    var types = '<option value="">Todos os tipos</option>' + TYPES.map(function (t) {
      return '<option value="' + esc(t.key) + '"' + (state.type === t.key ? " selected" : "") + ">" + esc(t.label) + "</option>";
    }).join("");

    var areaPills = Object.keys(st.byArea).map(function (k) {
      return '<span class="pill">' + esc(k) + ": " + st.byArea[k] + "</span>";
    }).join("");
    var typePills = Object.keys(st.byType).map(function (k) {
      return '<span class="pill ', esc(typePill(k)), '">', esc(typeLabel(k)), ": ", st.byType[k], "</span>";
    }).join("");

    return [
      '<div class="eyebrow">Aprender fazendo</div>',
      '<h1 class="h1">Catálogo de laboratórios</h1>',
      '<p class="sub">Todos os laboratórios em um só lugar, com objetivo, segurança, evidência exigida e rubrica explícitos. O tipo de execução é declarado por cada atividade — leia antes de executar e registre sua evidência para concluir.</p>',
      '<section class="card section" role="note" aria-label="Tipos de execução">',
        "<h2>Tipos de execução</h2>",
        "<ul>",
        TYPES.map(function (t) {
          return "<li><strong>" + esc(t.label) + ":</strong> " + esc(t.desc) + "</li>";
        }).join(""),
        "</ul>",
        '<p class="small" style="border-left:3px solid var(--accent,#6658e8);padding:8px 10px;border-radius:8px">',
          "<strong>Regra de honestidade:</strong> simulado ≠ execução real. Um laboratório simulado não vira execução real porque foi bem executado; a análise de captura usa PCAP de exemplo, não tráfego capturado por você. Declare exatamente o que foi feito.",
        "</p>",
      "</section>",
      '<section class="card section" aria-label="Filtros do catálogo">',
        '<div class="grid3" style="align-items:end;gap:12px">',
          '<div><label class="small" for="labFilterArea">Área</label>',
            '<select class="field" id="labFilterArea" onchange="LabCatalog.setFilter(\'area\',this.value)">', areas, "</select></div>",
          '<div><label class="small" for="labFilterLevel">Nível</label>',
            '<select class="field" id="labFilterLevel" onchange="LabCatalog.setFilter(\'level\',this.value)">', levels, "</select></div>",
          '<div><label class="small" for="labFilterType">Tipo de execução</label>',
            '<select class="field" id="labFilterType" onchange="LabCatalog.setFilter(\'type\',this.value)">', types, "</select></div>",
          '<div style="grid-column:1/-1"><label class="small" for="labFilterSearch">Busca textual</label>',
            '<input class="field" type="search" id="labFilterSearch" placeholder="Buscar por título, conceito, objetivo, risco..." value="', esc(state.q),
            '" oninput="LabCatalog.setFilter(\'q\',this.value)" aria-label="Buscar no catálogo de laboratórios"></div>',
        "</div>",
        '<p class="small muted" aria-live="polite" style="margin-top:10px">',
          esc(shown.length + " de " + labs.length + " laboratório(s) · " + st.withEvidence + " com evidência · " + (labs.length - st.withEvidence) + " sem evidência"),
        "</p>",
        '<div class="actions" style="flex-wrap:wrap;gap:6px" role="group" aria-label="Resumo do catálogo">',
          areaPills || '<span class="pill">Sem áreas cadastradas</span>',
          typePills || '<span class="pill">Sem tipos cadastrados</span>',
        "</div>",
      "</section>",
      '<div class="grid3 section" id="labCatalogGrid">',
        shown.length ? shown.map(cardHTML).join("") :
          '<div class="card"><h2>Nenhum laboratório encontrado</h2><p class="muted">Ajuste os filtros ou aguarde a publicação dos laboratórios no catálogo.</p></div>',
      "</div>"
    ].join("");
  }

  // Helper de integração: grava a página no elemento de destino (padrão: #view).
  function page(target) {
    var el = null;
    if (target && typeof target.innerHTML === "string") el = target;
    else if (typeof document !== "undefined") el = document.getElementById("view");
    if (!el) return "";
    el.innerHTML = pageHTML();
    return el.innerHTML;
  }

  function openDetails(id) {
    var lab = labById(id);
    if (!lab) { notify("Laboratório não encontrado."); return; }

    var simple = [
      ["Área", text(lab.area) || "Não informado"],
      ["Nível", text(lab.level) || "Não informado"],
      ["Tipo de execução", typeLabel(lab.executionType)],
      ["Objetivo", text(lab.objective) || "Não informado"],
      ["Ambiente", text(lab.environment) || "Não informado"],
      ["Resultado esperado", text(lab.expectedResult) || "Não informado"],
      ["Evidência exigida", text(lab.evidence) || "Não informado"],
      ["Rubrica", text(lab.rubric) || "Não informada"]
    ];
    var arrays = [
      ["Pré-requisitos", lab.prerequisites, false],
      ["Conceitos", lab.concepts, false],
      ["Passos", lab.steps, true],
      ["Erros comuns", lab.commonErrors, false],
      ["Reflexão", lab.reflection, false],
      ["Extensões", lab.extensions, false]
    ];

    var html = [
      "<h2>", esc(text(lab.title) || text(lab.id)), "</h2>",
      '<p class="small muted">ID: ', esc(text(lab.id) || "—"), " · ", esc(text(lab.area) || "—"), " · ", esc(text(lab.level) || "—"), "</p>",
      '<div class="small" style="border-left:3px solid var(--bad,#d94b61);background:rgba(217,75,97,.12);padding:10px 12px;border-radius:8px;margin:12px 0">',
        "<strong>⚠ Regras de segurança</strong>",
        '<p style="margin:6px 0 0">', esc(text(lab.safety) || "Não informado. Não execute sem definir as regras de segurança."), "</p>",
      "</div>",
      simple.map(function (pair) {
        return '<section class="section"><h3>' + esc(pair[0]) + "</h3><p>" + esc(pair[1]) + "</p></section>";
      }).join(""),
      arrays.map(function (entry) {
        return '<section class="section"><h3>' + esc(entry[0]) + "</h3>" + listMarkup(entry[1], entry[2]) + "</section>";
      }).join(""),
      '<div class="actions" style="justify-content:flex-end">',
        '<button type="button" onclick="LabCatalog.openEvidence(\'', attrId(lab.id), '\')">Registrar evidência</button>',
      "</div>"
    ].join("");
    modal(html);
  }

  function openEvidence(id) {
    var lab = labById(id);
    if (!lab) { notify("Laboratório não encontrado."); return; }

    var ev = evidenceMap(readState());
    var existing = ev[text(id)];
    var previous = "";
    if (existing && typeof existing === "object") previous = text(existing.text);
    else previous = text(existing);

    var html = [
      "<h2>Registrar evidência</h2>",
      '<p class="small muted">', esc(text(lab.title) || text(lab.id)), " · ", esc(typeLabel(lab.executionType)), "</p>",
      '<p class="small"><strong>Evidência exigida:</strong> ', esc(text(lab.evidence) || "Descreva o artefato produzido."), "</p>",
      '<label class="small" for="labEvidenceText">Texto da evidência ou link do artefato (mínimo 20 caracteres)</label>',
      '<textarea class="field" id="labEvidenceText" rows="6" aria-label="Texto da evidência ou link do artefato" placeholder="Descreva o que foi feito e cole o link do artefato, se houver.">', esc(previous), "</textarea>",
      '<label class="check" for="labEvidenceSafety"><input type="checkbox" id="labEvidenceSafety"> Execução conforme as regras de segurança e tipo de execução declarado com honestidade.</label>',
      '<div id="labEvidenceError" class="small" role="alert" style="color:var(--bad,#d94b61);min-height:1.2em"></div>',
      '<div class="actions" style="justify-content:flex-end">',
        '<button type="button" onclick="LabCatalog.saveEvidence(\'', attrId(id), '\')">Salvar evidência</button>',
      "</div>"
    ].join("");
    modal(html);
  }

  function saveEvidence(id) {
    var lab = labById(id);
    if (!lab) { notify("Laboratório não encontrado."); return false; }

    var field = typeof document !== "undefined" ? document.getElementById("labEvidenceText") : null;
    var check = typeof document !== "undefined" ? document.getElementById("labEvidenceSafety") : null;
    var errorEl = typeof document !== "undefined" ? document.getElementById("labEvidenceError") : null;
    var value = field ? String(field.value || "").trim() : "";
    var message = "";

    if (value.length < 20) {
      message = "Descreva a evidência com pelo menos 20 caracteres (texto e/ou link do artefato).";
    } else if (!check || !check.checked) {
      message = "Confirme que a execução seguiu as regras de segurança antes de salvar.";
    }
    if (message) {
      if (errorEl) errorEl.textContent = message;
      if (field && typeof field.focus === "function") field.focus();
      return false;
    }

    var s = readState();
    var ev = evidenceMap(s);
    ev[text(id)] = { text: value, at: new Date().toISOString(), safetyAccepted: true };
    s.labEvidence = ev;

    if (typeof Storage !== "undefined" && typeof Storage.toggleLab === "function") {
      Storage.toggleLab(text(id), true); // concede +60 XP uma única vez
    }
    if (typeof Storage !== "undefined" && typeof Storage.save === "function") {
      Storage.save(s);
    }
    notify("Evidência registrada. Laboratório concluído (+60 XP).");
    closeTopModal();
    rerender();
    return true;
  }

  window.LabCatalog = {
    all: all,
    filters: filters,
    pageHTML: pageHTML,
    page: page,
    setFilter: setFilter,
    filtered: filtered,
    openDetails: openDetails,
    openEvidence: openEvidence,
    saveEvidence: saveEvidence,
    evidenceStatus: evidenceStatus,
    stats: stats
  };
})();

/* ============================================================
   FORGE 7.0 — sim-logic.js
   Simulador didático de portas lógicas, circuitos montados
   (half/full adder, MUX 2:1 e trava D), transistores e mapas de
   Karnaugh. Funciona 100% no navegador, sem rede ou dependências.
   ============================================================ */

(function () {
  "use strict";

  const GATES = {
    AND:  { label: "AND",  symbol: "∧", inverted: false, hint: "Saída 1 somente se todas as entradas são 1.", eval: (a, b) => a & b },
    OR:   { label: "OR",   symbol: "∨", inverted: false, hint: "Saída 1 se pelo menos uma entrada é 1.", eval: (a, b) => a | b },
    NOT:  { label: "NOT",  symbol: "¬", inverted: true,  hint: "Inverte o nível lógico da entrada.", eval: a => 1 - a },
    NAND: { label: "NAND", symbol: "↑", inverted: true,  hint: "Negação do AND: saída 0 apenas com todas as entradas em 1.", eval: (a, b) => 1 - (a & b) },
    NOR:  { label: "NOR",  symbol: "↓", inverted: true,  hint: "Negação do OR: saída 1 apenas com todas as entradas em 0.", eval: (a, b) => 1 - (a | b) },
    XOR:  { label: "XOR",  symbol: "⊕", inverted: false, hint: "Saída 1 quando as entradas são diferentes.", eval: (a, b) => a ^ b },
    XNOR: { label: "XNOR", symbol: "⊙", inverted: true,  hint: "Saída 1 quando as entradas são iguais.", eval: (a, b) => 1 - (a ^ b) }
  };

  /* Circuitos montados: cada presets reusa as mesmas portas do seletor.
     As entradas lógicas continuam em state.a/state.b/state.c (0 ou 1). */
  const CIRCUITS = {
    gate: {
      label: "Porta isolada", inputs: ["A", "B"],
      hint: "Escolha uma porta e alterne A e B para observar a saída em tempo real."
    },
    half: {
      label: "Somador meio (half-adder)", inputs: ["A", "B"],
      hint: "S = A ⊕ B (bit de soma); C = A · B (vai-um). Duas entradas, duas saídas."
    },
    full: {
      label: "Somador completo (full-adder)", inputs: ["A", "B", "Cin"],
      hint: "S = A ⊕ B ⊕ Cin; Cout = (A·B) + (Cin·(A⊕B)). O terceiro fio é o vai-um de entrada."
    },
    mux: {
      label: "Multiplexador 2:1", inputs: ["A", "B", "SEL"],
      hint: "SEL=0 escolhe A; SEL=1 escolhe B. A seção é feita com AND das entradas pelo seletor e seu complemento."
    },
    latch: {
      label: "Trava D (D latch)", inputs: ["D", "EN"],
      hint: "EN=1: Q copia D. EN=0: Q retém o valor anterior — é memória de 1 bit, por isso o estado persiste."
    }
  };

  const state = {
    gate: "NAND", a: 0, b: 1, c: 0, q: 0, circuit: "gate",
    vars: 3, kmap: [], mounted: false
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function bits(value, width) {
    return value.toString(2).padStart(width, "0");
  }

  function grayCode(n) {
    let seq = [0];
    for (let i = 0; i < n; i++) {
      seq = seq.map(x => x << 1).concat(seq.slice().reverse().map(x => (x << 1) | 1));
    }
    return seq;
  }

  function resetKmap(vars) {
    state.vars = vars || state.vars;
    state.kmap = Array(1 << state.vars).fill(0);
  }

  function gateOutput() {
    const g = GATES[state.gate];
    return state.gate === "NOT" ? g.eval(state.a) : g.eval(state.a, state.b);
  }

  /* ---------- Circuitos montados (FORGE 7.0) ---------- */

  function evalPreset(id, a, b, c) {
    if (id === "half") return { S: a ^ b, C: a & b };
    if (id === "full") {
      const t = a ^ b;
      return { S: t ^ c, Cout: (a & b) | (c & t) };
    }
    if (id === "mux") return { Y: c ? b : a };
    if (id === "latch") return { Q: state.q };
    return { Y: state.gate === "NOT" ? GATES.NOT.eval(a) : GATES[state.gate].eval(a, b) };
  }

  function circuitOutputs() {
    return evalPreset(state.circuit, state.a, state.b, state.c);
  }

  function circuitHint() {
    return (CIRCUITS[state.circuit] || CIRCUITS.gate).hint;
  }

  function inputName(index) {
    const names = (CIRCUITS[state.circuit] || CIRCUITS.gate).inputs;
    return names[index] || "—";
  }

  function applyCircuitInputs(quiet) {
    if (state.circuit === "latch" && state.b === 1 && state.q !== state.a) {
      state.q = state.a;
      if (!quiet) log(`Trava D: EN=1 copiou D=${state.a} para Q=${state.q}`);
    }
  }

  function presetTableHTML() {
    const circuit = CIRCUITS[state.circuit] || CIRCUITS.gate;
    const names = circuit.inputs;
    if (state.circuit === "latch") {
      const rows = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([d, en]) => {
        const active = d === state.a && en === state.b;
        return `<tr class="${active ? "sim-active" : ""}"><th scope="row">${d} · ${en}</th><td>${en ? d : "Q anterior"}</td></tr>`;
      }).join("");
      return `<div class="sim-table-wrap" tabindex="0"><table class="sim-table">
        <caption class="sr-only">Tabela característica da trava D</caption>
        <thead><tr><th scope="col">D · EN</th><th scope="col">Próximo Q</th></tr></thead>
        <tbody>${rows}</tbody></table></div>
        <p class="small">Estado atual de Q: <code>${state.q}</code>. ${state.b ? "EN=1: Q acompanha D." : "EN=0: Q retém o valor."}</p>`;
    }
    const n = names.length;
    const outputNames = Object.keys(evalPreset(state.circuit, 0, 0, 0));
    const head = `<tr><th scope="col" class="sim-kmap-corner">${names.map(esc).join(" · ")}</th>${outputNames.map(k => `<th scope="col">${esc(k)}</th>`).join("")}</tr>`;
    const rows = [];
    for (let mask = 0; mask < (1 << n); mask++) {
      const a = (mask >> (n - 1)) & 1;
      const b = n >= 2 ? (mask >> (n - 2)) & 1 : 0;
      const c = n >= 3 ? mask & 1 : 0;
      const out = evalPreset(state.circuit, a, b, c);
      const active = a === state.a && b === state.b && c === state.c;
      rows.push(`<tr class="${active ? "sim-active" : ""}"><th scope="row">${[a, b, c].slice(0, n).join(" · ")}</th>
        ${outputNames.map(k => `<td>${out[k]}</td>`).join("")}</tr>`);
    }
    return `<div class="sim-table-wrap" tabindex="0"><table class="sim-table">
      <caption class="sr-only">Tabela verdade de ${esc(circuit.label)}</caption>
      <thead>${head}</thead><tbody>${rows.join("")}</tbody></table></div>`;
  }

  function svgInput(x, y, label, value) {
    return `<g><rect x="${x}" y="${y}" width="84" height="34" rx="6" class="sim-gate-body" />
      <text x="${x + 10}" y="${y + 22}" class="sim-svg-label">${esc(label)}=${value}</text></g>`;
  }

  function svgGate(x, y, label, detail) {
    return `<g><rect x="${x}" y="${y}" width="150" height="42" rx="6" class="sim-gate-body" />
      <text x="${x + 10}" y="${y + 17}" class="sim-svg-label">${esc(label)}</text>
      <text x="${x + 10}" y="${y + 34}" class="sim-svg-label">${esc(detail)}</text></g>`;
  }

  function svgOutput(x, y, label, value) {
    return `<text x="${x}" y="${y + 22}" class="sim-svg-label">${esc(label)}=${value}</text>`;
  }

  function circuitSVG() {
    const a = state.a, b = state.b, c = state.c;
    const out = circuitOutputs();
    const circuit = CIRCUITS[state.circuit] || CIRCUITS.gate;
    let wires = "", boxes = "", outputs = "";
    const wire = (x1, y1, x2, y2) => { wires += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`; };
    const inputs = circuit.inputs.map((name, i) => ({ name, y: 26 + i * 62, value: [a, b, c][i] }));
    const nodes = inputs.map(inp => svgInput(8, inp.y, inp.name, inp.value)).join("");
    const put = (x, y, label, detail) => { boxes += svgGate(x, y, label, detail); };
    const emit = (x, y, label, value) => { outputs += svgOutput(x, y, label, value); };

    if (state.circuit === "half") {
      put(150, 30, "XOR", `S = ${a}⊕${b} = ${out.S}`);
      put(150, 112, "AND", `C = ${a}·${b} = ${out.C}`);
      wire(92, inputs[0].y + 17, 150, 51); wire(92, inputs[1].y + 17, 150, 133);
      wire(300, 51, 360, 51); wire(300, 133, 360, 133);
      emit(362, 40, "S", out.S); emit(362, 122, "C", out.C);
    } else if (state.circuit === "full") {
      const t = a ^ b;
      put(150, 18, "XOR 1", `t = A⊕B = ${t}`);
      put(150, 80, "XOR 2", `S = t⊕Cin = ${out.S}`);
      put(150, 142, "Cout", `(A·B)+(Cin·t) = ${out.Cout}`);
      wire(92, inputs[0].y + 17, 150, 39); wire(92, inputs[1].y + 17, 150, 101);
      wire(92, inputs[2].y + 17, 150, 163);
      wire(300, 39, 360, 55); wire(300, 163, 360, 137);
      emit(362, 44, "S", out.S); emit(362, 126, "Cout", out.Cout);
    } else if (state.circuit === "mux") {
      const notSel = c ? 0 : 1;
      put(150, 18, "NOT SEL", `¬SEL = ${notSel}`);
      put(150, 80, "AND A", `A·¬SEL = ${a & notSel}`);
      put(150, 142, "AND B", `B·SEL = ${b & c}`);
      wire(92, inputs[0].y + 17, 150, 101);
      wire(92, inputs[1].y + 17, 150, 163);
      wire(92, inputs[2].y + 17, 150, 39);
      wire(300, 101, 360, 111); wire(300, 163, 360, 111);
      emit(362, 100, "Y", out.Y);
    } else {
      put(150, 78, "D latch", `EN=${b} · D=${a}`);
      wire(92, inputs[0].y + 17, 150, 99); wire(92, inputs[1].y + 17, 150, 110);
      wire(300, 99, 360, 99);
      emit(362, 88, "Q", out.Q);
      outputs += `<text x="10" y="222" class="sim-svg-label">EN=0: Q retém ${state.q} (estado de 1 bit).</text>`;
    }
    return `<svg class="sim-svg" viewBox="0 0 500 240" role="img" aria-label="Grafo do circuito ${esc(circuit.label)}; saídas ${esc(idsText(out))}">
      <g class="sim-wire">${wires}</g>${nodes}${boxes}${outputs}
    </svg>`;
  }

  function idsText(outputs) {
    return Object.keys(outputs).map(k => `${k}=${outputs[k]}`).join(", ");
  }

  function truthTableHTML() {
    if (state.circuit !== "gate") return presetTableHTML();
    const rows = [];
    const single = state.gate === "NOT";
    const combos = single ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
    combos.forEach(c => {
      const y = single ? GATES[state.gate].eval(c[0]) : GATES[state.gate].eval(c[0], c[1]);
      const active = single ? c[0] === state.a : c[0] === state.a && c[1] === state.b;
      rows.push(`<tr class="${active ? "sim-active" : ""}">
        <th scope="row">${c[0]}${single ? "" : " · " + c[1]}</th>
        <td>${y}</td>
      </tr>`);
    });
    return `<table class="sim-table">
      <caption class="sr-only">Tabela verdade da porta ${esc(state.gate)}</caption>
      <thead><tr><th scope="col">${single ? "A" : "A · B"}</th><th scope="col">Saída</th></tr></thead>
      <tbody>${rows.join("")}</tbody>
    </table>`;
  }

  function gateSVG() {
    if (state.circuit !== "gate") return circuitSVG();
    const inv = GATES[state.gate].inverted;
    const single = state.gate === "NOT";
    const label = GATES[state.gate].label;
    let shape;
    if (single || label === "AND" || label === "NAND") {
      shape = single
        ? `<path d="M90 42 L90 98 L190 70 Z" />`
        : `<path d="M90 40 H142 A30 30 0 0 1 142 100 H90 Z" />`;
    } else {
      shape = `<path d="M95 40 Q130 70 95 100 Q155 100 190 70 Q155 40 95 40 Z" />`;
      if (label === "XOR" || label === "XNOR") {
        shape += `<path d="M87 40 Q122 70 87 100" fill="none" />`;
      }
    }
    const bubble = inv ? `<circle cx="196" cy="70" r="6" fill="var(--bg-surface-elevated)" />` : "";
    const inB = single ? "" : `<line x1="10" y1="100" x2="90" y2="100" /><text x="12" y="92" class="sim-svg-label">B=${state.b}</text>`;
    return `<svg class="sim-svg" viewBox="0 0 260 140" role="img" aria-label="Diagrama da porta ${esc(label)} com entradas e saída">
      <g class="sim-wire">
        <line x1="10" y1="40" x2="90" y2="40" />
        ${inB}
        <line x1="${inv ? 202 : 190}" y1="70" x2="250" y2="70" />
      </g>
      <g class="sim-gate-body">${shape}${bubble}</g>
      <text x="120" y="75" class="sim-svg-label sim-svg-center">${esc(label)}</text>
      <text x="12" y="32" class="sim-svg-label">A=${state.a}</text>
      <text x="226" y="62" class="sim-svg-label">Y=${gateOutput()}</text>
    </svg>`;
  }

  function transistorSVG() {
    const universal = ["AND", "OR", "NOT", "XOR", "XNOR"].includes(state.gate);
    const isNand = state.gate === "NAND";
    const caption = universal
      ? `Porta ${esc(state.gate)} implementada a partir de ${["NOR", "XOR", "XNOR"].includes(state.gate) ? "NAND/NOR" : "NAND"} — o simulador acima mostra a função lógica equivalente.`
      : isNand
        ? "NAND CMOS: PMOS em paralelo no pull-up; NMOS em série no pull-down."
        : "NOR CMOS: PMOS em série no pull-up; NMOS em paralelo no pull-down.";
    const pTop = isNand
      ? `<line x1="50" y1="30" x2="160" y2="30" /><line x1="70" y1="30" x2="70" y2="60" /><line x1="140" y1="30" x2="140" y2="60" />`
      : `<line x1="50" y1="30" x2="105" y2="30" /><line x1="105" y1="30" x2="105" y2="60" /><line x1="105" y1="60" x2="160" y2="60" />`;
    const nBottom = isNand
      ? `<line x1="50" y1="110" x2="160" y2="110" /><line x1="105" y1="110" x2="105" y2="80" /><line x1="105" y1="80" x2="105" y2="60" />`
      : `<line x1="50" y1="110" x2="160" y2="110" /><line x1="70" y1="110" x2="70" y2="60" /><line x1="140" y1="110" x2="140" y2="60" />`;
    return `<svg class="sim-svg sim-svg-small" viewBox="0 0 210 140" role="img" aria-label="Rede de transistores CMOS explicada no texto abaixo">
      <g class="sim-wire">${pTop}${nBottom}</g>
      <circle cx="70" cy="60" r="9" class="sim-pmos" /><circle cx="140" cy="60" r="9" class="sim-pmos" />
      <circle cx="105" cy="80" r="9" class="sim-nmos" /><circle cx="105" cy="110" r="0" />
      <text x="8" y="26" class="sim-svg-label">VDD</text>
      <text x="8" y="124" class="sim-svg-label">GND</text>
      <text x="168" y="34" class="sim-svg-label">PMOS</text>
      <text x="168" y="84" class="sim-svg-label">NMOS</text>
    </svg>
    <p class="small muted">${caption}</p>`;
  }

  // Cobertura mínima de implicantes primos para até 4 variáveis.
  function kmapSolution() {
    const n = state.vars;
    const total = 1 << n;
    const ones = [], dont = [];
    state.kmap.forEach((v, i) => { if (v === 1) ones.push(i); else if (v === 2) dont.push(i); });
    if (!ones.length) return { terms: [], covered: new Set(), expression: "0" };

    const allowed = new Set(ones.concat(dont));
    const cubes = [];
    for (let mask = 0; mask < total; mask++) {
      for (let val = 0; val < total; val++) {
        if (val & ~mask) continue;
        const covered = [];
        let valid = true;
        for (let i = 0; i < total; i++) {
          if ((i & mask) !== val) continue;
          if (!allowed.has(i)) { valid = false; break; }
          covered.push(i);
        }
        if (valid && covered.some(i => ones.includes(i))) cubes.push({ mask, val, covered });
      }
    }

    // Mantém apenas cubos maximais (implicantes primos).
    const primes = cubes.filter(c => !cubes.some(d =>
      d !== c && (d.mask & c.mask) === c.mask &&
      (d.val & c.mask) === c.val && d.covered.length > c.covered.length
    ));

    // Cobertura gulosa: suficiente para fins didáticos em mapas de até 4 bits.
    const remaining = new Set(ones);
    const chosen = [];
    while (remaining.size && primes.length) {
      let best = null;
      primes.forEach(c => {
        const gain = c.covered.filter(i => remaining.has(i)).length;
        if (gain && (!best || gain > best.gain)) best = { cube: c, gain };
      });
      if (!best) break;
      chosen.push(best.cube);
      best.cube.covered.forEach(i => remaining.delete(i));
    }

    const covered = new Set();
    chosen.forEach(c => c.covered.forEach(i => covered.add(i)));
    const terms = chosen.map(c => cubeExpression(c.mask, c.val, n));
    return { terms, covered, expression: terms.join(" + ") || "0" };
  }

  function countBits(x) {
    let n = 0;
    while (x) { n += x & 1; x >>= 1; }
    return n;
  }

  function cubeExpression(mask, val, n) {
    const parts = [];
    for (let p = 0; p < n; p++) {
      if (!(mask & (1 << p))) continue;
      const name = String.fromCharCode(65 + n - 1 - p);
      parts.push((val & (1 << p)) ? name : "¬" + name);
    }
    return parts.length ? parts.join("·") : "1";
  }

  function kmapHTML() {
    const n = state.vars;
    const rowsBits = n <= 2 ? 1 : 2;
    const colsBits = n - rowsBits;
    const rows = grayCode(rowsBits);
    const cols = grayCode(colsBits);
    const solution = kmapSolution();
    const labels = ["0", "1", "×"];
    const head = `<tr><th scope="col" class="sim-kmap-corner">A\\BC</th>${cols.map(c => `<th scope="col">${bits(c, colsBits)}</th>`).join("")}</tr>`;
    const body = rows.map(r => {
      const cells = cols.map(c => {
        const idx = (r << colsBits) | c;
        const v = state.kmap[idx] || 0;
        const covered = solution.covered.has(idx);
        return `<td><button type="button" class="sim-kmap-cell ${v === 1 ? "is-one" : v === 2 ? "is-dont" : ""} ${covered ? "is-covered" : ""}"
          aria-label="Célula ${bits(r, rowsBits)} ${bits(c, colsBits)}: ${labels[v]}. Clique para alternar."
          onclick="LogicSim.cycleCell(${idx})">${labels[v]}</button></td>`;
      }).join("");
      return `<tr><th scope="row">${bits(r, rowsBits)}</th>${cells}</tr>`;
    }).join("");
    return `<div class="sim-kmap-scroll" tabindex="0"><table class="sim-table sim-kmap"><caption class="sr-only">Mapa de Karnaugh de ${n} variáveis</caption>
      <thead>${head}</thead><tbody>${body}</tbody></table></div>
      <p class="small"><b>Expressão mínima encontrada:</b> <code>${esc(solution.expression)}</code></p>
      <p class="small muted">Clique nas células para alternar entre 0, 1 e “não importa” (×). Células destacadas pertencem à cobertura escolhida.</p>`;
  }

  function refresh() {
    if (!state.mounted) return;
    applyCircuitInputs(true);
    const circuit = CIRCUITS[state.circuit] || CIRCUITS.gate;
    const outputs = circuitOutputs();
    const primary = Object.keys(outputs)[0];
    const select = document.getElementById("logicGateSelect");
    if (select) { select.value = state.gate; select.disabled = state.circuit !== "gate"; }
    const presetSel = document.getElementById("logicCircuitSelect");
    if (presetSel) presetSel.value = state.circuit;
    const varsSel = document.getElementById("logicVarsSelect");
    if (varsSel) varsSel.value = String(state.vars);
    const out = document.getElementById("logicOutput");
    if (out) {
      out.textContent = String(outputs[primary]);
      out.dataset.value = String(outputs[primary]);
    }
    const all = document.getElementById("logicOutputs");
    if (all) all.textContent = Object.keys(outputs).map(k => `${k}=${outputs[k]}`).join("  ·  ");
    const holder = document.getElementById("logicInputs");
    if (holder) {
      const keys = ["a", "b", "c"].slice(0, circuit.inputs.length);
      holder.innerHTML = keys.map((key, i) => {
        const val = state[key];
        const name = esc(inputName(i));
        return `<button type="button" id="logic${key.toUpperCase()}" class="secondary" aria-pressed="${val === 1}"
          aria-label="${name} = ${val}. Clique para alternar." onclick="LogicSim.toggle('${key}')">${name} = ${val}</button>`;
      }).join("");
    }
    const latch = document.getElementById("logicLatchState");
    if (latch) latch.textContent = state.circuit === "latch" ? `Q retido: ${state.q}` : "";
    const latchBtn = document.getElementById("logicResetLatch");
    if (latchBtn) latchBtn.hidden = state.circuit !== "latch";
    const svg = document.getElementById("logicDiagram");
    if (svg) svg.innerHTML = gateSVG();
    const table = document.getElementById("logicTable");
    if (table) table.innerHTML = truthTableHTML();
    const kmap = document.getElementById("logicKmap");
    if (kmap) kmap.innerHTML = kmapHTML();
    const hint = document.getElementById("logicHint");
    if (hint) hint.textContent = circuitHint();
    const count = document.getElementById("logicRunCount");
    if (count && typeof Storage !== "undefined" && Storage.get()) {
      const rec = (Storage.get().forge3?.simulators || {}).logic || { runs: 0 };
      count.textContent = String(rec.runs || 0);
    }
  }

  function log(detail) {
    if (typeof Storage !== "undefined" && typeof Storage.logSimulator === "function") {
      Storage.logSimulator("logic", detail);
    }
  }

  function mount() {
    const root = document.getElementById("logicSimRoot");
    if (!root) { state.mounted = false; return; }
    if (state.mounted && root.childElementCount) { refresh(); return; }
    if (!state.kmap.length) resetKmap(state.vars);
    state.mounted = true;
    root.innerHTML = `
      <div class="sim-shell trail-arch trail-accent">
        <div class="sim-head">
          <div><span class="pill">Trilha 10 · Arquitetura</span><h2>Simulador de Portas Lógicas</h2>
          <p class="muted">Do transistor à simplificação: observação, tabela verdade e mapa de Karnaugh em um só lugar.</p></div>
          <p class="sim-counter">Execuções registradas: <b id="logicRunCount">0</b></p>
        </div>
        <div class="sim-grid">
          <section class="card sim-panel" aria-labelledby="logicControlsTitle">
            <h3 id="logicControlsTitle">1. Escolha a função</h3>
            <label for="logicCircuitSelect">Circuito montado</label>
            <select class="field" id="logicCircuitSelect" onchange="LogicSim.setCircuit(this.value)">
              ${Object.keys(CIRCUITS).map(k => `<option value="${k}" ${k === state.circuit ? "selected" : ""}>${esc(CIRCUITS[k].label)}</option>`).join("")}
            </select>
            <label for="logicGateSelect">Porta lógica (quando o circuito é isolado)</label>
            <select class="field" id="logicGateSelect" onchange="LogicSim.setGate(this.value)">
              ${Object.keys(GATES).map(k => `<option value="${k}" ${k === state.gate ? "selected" : ""}>${k} — ${GATES[k].symbol}</option>`).join("")}
            </select>
            <div id="logicInputs" class="sim-inputs" role="group" aria-label="Entradas do circuito"></div>
            <p class="sim-output">Saída principal <output id="logicOutput" aria-live="polite">1</output></p>
            <p class="small"><b>Todas as saídas:</b> <code id="logicOutputs"></code></p>
            <p class="small muted" id="logicLatchState" aria-live="polite"></p>
            <p class="small muted" id="logicHint"></p>
            <button type="button" class="ghost" onclick="LogicSim.resetInputs()">Zerar entradas</button>
            <button type="button" class="ghost" id="logicResetLatch" hidden onclick="LogicSim.resetLatch()">Limpar memória Q</button>
          </section>

          <section class="card sim-panel" aria-labelledby="logicDiagramTitle">
            <h3 id="logicDiagramTitle">2. Circuito equivalente</h3>
            <div id="logicDiagram" class="sim-diagram" tabindex="0"></div>
            <div class="sim-transistors" tabindex="0">${transistorSVG()}</div>
          </section>

          <section class="card sim-panel" aria-labelledby="logicTableTitle">
            <h3 id="logicTableTitle">3. Tabela verdade</h3>
            <div id="logicTable" class="sim-table-wrap" tabindex="0"></div>
            <p class="small muted">A linha destacada representa o estado atual das entradas.</p>
          </section>

          <section class="card sim-panel sim-kmap-panel" aria-labelledby="logicKmapTitle">
            <h3 id="logicKmapTitle">4. Mapa de Karnaugh</h3>
            <label for="logicVarsSelect">Variáveis</label>
            <select class="field" id="logicVarsSelect" onchange="LogicSim.setVars(Number(this.value))">
              <option value="2" ${state.vars === 2 ? "selected" : ""}>2 variáveis (A, B)</option>
              <option value="3" ${state.vars === 3 ? "selected" : ""}>3 variáveis (A, B, C)</option>
              <option value="4" ${state.vars === 4 ? "selected" : ""}>4 variáveis (A, B, C, D)</option>
            </select>
            <div id="logicKmap"></div>
            <button type="button" class="ghost" onclick="LogicSim.resetKmap()">Limpar mapa</button>
          </section>
        </div>
      </div>`;
    refresh();
  }

  window.LogicSim = {
    mount,
    refresh,
    setGate(gate) {
      if (!GATES[gate]) return;
      state.gate = gate;
      log(`Porta ${gate}; A=${state.a}, B=${state.b}`);
      refresh();
    },
    setCircuit(id) {
      if (!CIRCUITS[id]) return;
      state.circuit = id;
      if (id === "latch") state.q = 0;
      log(`Circuito selecionado: ${CIRCUITS[id].label}`);
      refresh();
    },
    toggle(input) {
      if (input !== "a" && input !== "b" && input !== "c") return;
      state[input] = 1 - state[input];
      applyCircuitInputs(false);
      log(`${input.toUpperCase()}=${state[input]} em ${(CIRCUITS[state.circuit] || CIRCUITS.gate).label}`);
      refresh();
    },
    resetInputs() {
      state.a = 0; state.b = 0; state.c = 0;
      refresh();
    },
    resetLatch() {
      state.q = 0;
      log("Memória da trava D limpa (Q=0)");
      refresh();
    },
    setVars(n) {
      resetKmap([2, 3, 4].includes(n) ? n : 3);
      log(`Mapa de Karnaugh com ${state.vars} variáveis`);
      refresh();
    },
    cycleCell(index) {
      if (!(index >= 0 && index < state.kmap.length)) return;
      state.kmap[index] = (state.kmap[index] + 1) % 3;
      log(`Célula ${index} do mapa definida como ${["0", "1", "×"][state.kmap[index]]}`);
      refresh();
    },
    resetKmap() {
      resetKmap(state.vars);
      refresh();
    }
  };
})();

/* ============================================================
   FORGE — sim-cpu.js
   Simulador visual de CPU: registradores, flags, pilha, memória
   e ciclo de execução para um subconjunto didático de x86-64 e ARM64.
   ============================================================ */

(function () {
  "use strict";

  const MAX64 = (1n << 64n) - 1n;

  const ARCH = {
    x86: {
      label: "x86-64",
      registers: ["RAX", "RBX", "RCX", "RDX", "RSI", "RDI", "RBP", "RSP", "RIP", "RFLAGS"],
      sp: "RSP", pc: "RIP", flags: ["ZF", "SF", "CF", "OF"],
      program: "; Experimente alterar os valores e executar passo a passo\nMOV RAX, 5\nMOV RBX, 7\nADD RAX, RBX\nCMP RAX, 12\nPUSH RAX\nPOP RCX\nSUB RCX, 3"
    },
    arm: {
      label: "ARM64 (AArch64)",
      registers: ["X0", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "X29", "X30", "SP", "PC"],
      sp: "SP", pc: "PC", flags: ["N", "Z", "C", "V"],
      program: "// Registradores X0-X30, pilha crescente para baixo\nMOV X0, #5\nMOV X1, #7\nADD X0, X0, X1\nCMP X0, #12\nPUSH X0\nPOP X2\nSUB X2, X2, #3"
    }
  };

  const state = {
    arch: "x86", regs: {}, flags: {}, memory: {}, stack: [], pc: 0,
    lines: [], labels: {}, trace: [], changed: "", mounted: false, halted: false
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function u64(value) {
    try { return Number(BigInt.asUintN(64, BigInt(Math.trunc(Number(value) || 0)))); }
    catch (e) { return 0; }
  }

  function hex(value) {
    return "0x" + BigInt.asUintN(64, BigInt(u64(value))).toString(16).padStart(16, "0").toUpperCase();
  }

  function current() { return ARCH[state.arch]; }

  function resetMachine(keepProgram) {
    const arch = current();
    state.regs = {};
    arch.registers.forEach(r => { state.regs[r] = 0; });
    state.regs[arch.sp] = 0x7fffffffe000;
    state.flags = {};
    arch.flags.forEach(f => { state.flags[f] = 0; });
    state.memory = {};
    state.stack = [];
    state.pc = 0;
    state.trace = [];
    state.changed = "";
    state.halted = false;
    if (!keepProgram) loadProgram(arch.program);
  }

  function loadProgram(text) {
    state.lines = String(text || "").split(/\r?\n/).map(s => s.trim());
    state.labels = {};
    state.lines.forEach((line, i) => {
      const m = line.match(/^([A-Za-z_][\w]*):$/);
      if (m) state.labels[m[1].toUpperCase()] = i;
    });
    state.pc = 0;
    state.halted = false;
  }

  function parseValue(token) {
    const t = String(token || "").trim().replace(/^#/, "");
    if (!t) return NaN;
    if (t.startsWith("[")) {
      const addr = parseValue(t.slice(1, -1));
      return Number.isNaN(addr) ? NaN : u64(state.memory[addr] || 0);
    }
    const reg = t.toUpperCase();
    if (Object.prototype.hasOwnProperty.call(state.regs, reg)) return state.regs[reg];
    if (/^0x[0-9a-f]+$/i.test(t)) return u64(parseInt(t, 16));
    if (/^-?\d+$/.test(t)) return u64(parseInt(t, 10));
    return NaN;
  }

  function writeDest(token, value) {
    const t = String(token || "").trim();
    const reg = t.toUpperCase();
    if (Object.prototype.hasOwnProperty.call(state.regs, reg)) {
      state.regs[reg] = u64(value);
      state.changed = reg;
      return true;
    }
    if (t.startsWith("[") && t.endsWith("]")) {
      const addr = parseValue(t.slice(1, -1));
      if (!Number.isNaN(addr)) {
        state.memory[addr] = u64(value);
        state.changed = `mem[${addr}]`;
        return true;
      }
    }
    return false;
  }

  function setFlags(result, a, b, op) {
    const f = state.flags;
    const z = result === 0 ? 1 : 0;
    const sign = (BigInt(result) >> 63n) & 1n ? 1 : 0;
    let carry = 0, overflow = 0;
    if (op === "ADD" || op === "ADC") {
      carry = (BigInt(a) + BigInt(b)) > MAX64 ? 1 : 0;
      const sa = ((BigInt(a) >> 63n) & 1n), sb = ((BigInt(b) >> 63n) & 1n), sr = ((BigInt(result) >> 63n) & 1n);
      overflow = (sa === sb && sr !== sa) ? 1 : 0;
    } else if (op === "SUB" || op === "CMP") {
      carry = BigInt(a) < BigInt(b) ? 1 : 0;
      const sa = ((BigInt(a) >> 63n) & 1n), sb = ((BigInt(b) >> 63n) & 1n), sr = ((BigInt(result) >> 63n) & 1n);
      overflow = (sa !== sb && sr !== sa) ? 1 : 0;
    }
    if (current().flags.length === 4 && current().flags[0] === "N") {
      f.N = sign; f.Z = z; f.C = carry; f.V = overflow;
    } else {
      f.ZF = z; f.SF = sign; f.CF = carry; f.OF = overflow;
    }
  }

  function trace(text) {
    state.trace.push(text);
    state.trace = state.trace.slice(-12);
  }

  function executeStep() {
    if (state.halted) return;
    const arch = current();
    state.changed = "";
    let i = state.pc;
    while (i < state.lines.length && (!state.lines[i] || state.lines[i].startsWith(";") || state.lines[i].startsWith("//") || state.lines[i].endsWith(":"))) i++;
    if (i >= state.lines.length) {
      state.halted = true;
      trace("Fim do programa.");
      refresh();
      return;
    }
    const raw = state.lines[i].replace(/;.*$/, "").replace(/\/\/.*$/, "").trim();
    const parts = raw.split(/[\s,]+/).filter(Boolean);
    const op = (parts.shift() || "").toUpperCase();
    const args = parts;
    const description = `${String(i + 1).padStart(2, "0")}: ${raw}`;

    switch (op) {
      case "MOV": {
        const value = parseValue(args[1]);
        if (!Number.isNaN(value)) writeDest(args[0], value);
        trace(`${description} → ${args[0]} = ${hex(value)}`);
        break;
      }
      case "ADD": case "SUB": case "AND": case "OR": case "XOR": case "SHL": case "CMP": {
        // x86 usa 2 operandos (dest também é o primeiro); ARM64 usa 3 operandos.
        // SHL usa o último operando como contagem de deslocamento.
        const three = args.length >= 3;
        const shift = op === "SHL";
        const a = parseValue(three || shift ? args[1] : args[0]);
        const b = parseValue(shift ? args[three ? 2 : 1] : (three ? args[2] : args[1]));
        let result = 0;
        if (op === "ADD") result = u64(BigInt(a) + BigInt(b));
        else if (op === "SUB" || op === "CMP") result = u64(BigInt(a) - BigInt(b));
        else if (op === "AND") result = u64(BigInt(a) & BigInt(b));
        else if (op === "OR") result = u64(BigInt(a) | BigInt(b));
        else if (op === "XOR") result = u64(BigInt(a) ^ BigInt(b));
        else if (op === "SHL") result = u64(BigInt(a) << BigInt(Math.min(63, b)));
        setFlags(result, a, b, op);
        if (op !== "CMP") writeDest(args[0], result);
        trace(`${description} → ${op === "CMP" ? "flags atualizados" : args[0] + " = " + hex(result)}`);
        break;
      }
      case "INC": case "DEC": {
        const a = parseValue(args[0]);
        const result = u64(BigInt(a) + BigInt(op === "INC" ? 1 : -1));
        setFlags(result, a, 1, op === "INC" ? "ADD" : "SUB");
        writeDest(args[0], result);
        trace(`${description} → ${args[0]} = ${hex(result)}`);
        break;
      }
      case "PUSH": {
        const value = parseValue(args[0]);
        const spName = arch.sp;
        state.regs[spName] = u64(BigInt(state.regs[spName]) - 8n);
        const addr = state.regs[spName];
        state.memory[addr] = u64(value);
        state.stack.push({ addr, value: u64(value) });
        state.changed = spName;
        trace(`${description} → [${hex(addr)}] = ${hex(value)}`);
        break;
      }
      case "POP": {
        const spName = arch.sp;
        const addr = state.regs[spName];
        const value = u64(state.memory[addr] || 0);
        if (args.length) writeDest(args[0], value);
        state.regs[spName] = u64(BigInt(addr) + 8n);
        state.stack.pop();
        state.changed = spName;
        trace(`${description} → ${args[0] || "descartado"} = ${hex(value)}`);
        break;
      }
      case "JMP": case "B": {
        const target = state.labels[String(args[0]).toUpperCase()];
        state.pc = Number.isInteger(target) ? target : i + 1;
        trace(`${description} → desvio para linha ${state.pc + 1}`);
        refresh();
        return;
      }
      case "NOP":
        trace(`${description} → sem efeito`);
        break;
      default:
        trace(`${description} → instrução não implementada neste simulador`);
    }
    state.pc = i + 1;
    if (typeof Storage !== "undefined" && typeof Storage.logSimulator === "function") {
      Storage.logSimulator("cpu", `${arch.label}: ${raw}`);
    }
    refresh();
  }

  function registersHTML() {
    const arch = current();
    return `<div class="sim-registers">${arch.registers.map(r => {
      const isPC = r === arch.pc;
      const isSP = r === arch.sp;
      return `<div class="sim-register ${state.changed === r ? "is-changed" : ""} ${isPC ? "is-pc" : ""} ${isSP ? "is-sp" : ""}">
        <span class="sim-reg-name">${r}${isPC ? " · PC" : isSP ? " · SP" : ""}</span>
        <code>${hex(state.regs[r] || 0)}</code>
        <span class="small muted">${state.regs[r] || 0}</span>
      </div>`;
    }).join("")}</div>`;
  }

  function flagsHTML() {
    return `<div class="sim-flags" role="group" aria-label="Flags da CPU">${current().flags.map(f => `
      <span class="sim-flag ${state.flags[f] ? "is-set" : ""}">${f} = ${state.flags[f] ? 1 : 0}</span>`).join("")}</div>`;
  }

  function stackHTML() {
    if (!state.stack.length) return '<p class="small muted">Pilha vazia. Use PUSH para empilhar um valor.</p>';
    return `<ol class="sim-stack" aria-label="Conteúdo da pilha">${state.stack.slice().reverse().map(item => `
      <li><span class="pill">${hex(item.addr)}</span><code>${hex(item.value)}</code></li>`).join("")}</ol>`;
  }

  function memoryHTML() {
    const addrs = Object.keys(state.memory).map(Number).sort((a, b) => a - b);
    if (!addrs.length) return '<p class="small muted">Nenhuma posição de memória escrita até agora.</p>';
    return `<div class="sim-table-wrap" tabindex="0"><table class="sim-table"><caption class="sr-only">Memória RAM simulada</caption>
      <thead><tr><th scope="col">Endereço</th><th scope="col">Conteúdo</th></tr></thead>
      <tbody>${addrs.map(a => `<tr><th scope="row">${hex(a)}</th><td><code>${hex(state.memory[a])}</code></td></tr>`).join("")}</tbody>
    </table></div>`;
  }

  function programHTML() {
    return state.lines.map((line, i) => {
      const active = i === state.pc;
      return `<div class="sim-line ${active ? "is-current" : ""}"><span class="sim-line-no">${String(i + 1).padStart(2, "0")}</span><code>${esc(line) || "&nbsp;"}</code></div>`;
    }).join("");
  }

  function refresh() {
    if (!state.mounted) return;
    const archSel = document.getElementById("cpuArchSelect");
    if (archSel) archSel.value = state.arch;
    const program = document.getElementById("cpuProgram");
    if (program && program.value !== state.lines.join("\n")) program.value = state.lines.join("\n");
    const regs = document.getElementById("cpuRegisters");
    if (regs) regs.innerHTML = registersHTML();
    const flags = document.getElementById("cpuFlags");
    if (flags) flags.innerHTML = flagsHTML();
    const stack = document.getElementById("cpuStack");
    if (stack) stack.innerHTML = stackHTML();
    const memory = document.getElementById("cpuMemory");
    if (memory) memory.innerHTML = memoryHTML();
    const programBox = document.getElementById("cpuProgramLines");
    if (programBox) programBox.innerHTML = programHTML();
    const trace = document.getElementById("cpuTrace");
    if (trace) trace.innerHTML = state.trace.map(t => `<li>${esc(t)}</li>`).join("") || '<li class="small muted">Nenhuma instrução executada.</li>';
    const status = document.getElementById("cpuStatus");
    if (status) status.textContent = state.halted ? "Programa encerrado" : `Próxima instrução: linha ${state.pc + 1}`;
    const stages = document.querySelectorAll("#cpuPipeline .sim-stage");
    const activeStage = state.halted ? -1 : (state.pc + state.trace.length) % 5;
    stages.forEach((el, i) => el.classList.toggle("is-active", i === activeStage));
    const count = document.getElementById("cpuRunCount");
    if (typeof Storage !== "undefined" && Storage.get()) {
      const rec = (Storage.get().forge3?.simulators || {}).cpu || { runs: 0 };
      count.textContent = String(rec.runs || 0);
    }
  }

  function mount() {
    const root = document.getElementById("cpuSimRoot");
    if (!root) { state.mounted = false; return; }
    if (state.mounted && root.childElementCount) { refresh(); return; }
    if (!state.lines.length) resetMachine(false);
    state.mounted = true;
    root.innerHTML = `
      <div class="sim-shell trail-assembly trail-accent">
        <div class="sim-head">
          <div><span class="pill">Trilha 11 · Assembly</span><h2>Simulador Visual de CPU</h2>
          <p class="muted">Registradores, flags, pilha e memória evoluindo instrução por instrução.</p></div>
          <p class="sim-counter">Execuções registradas: <b id="cpuRunCount">0</b></p>
        </div>
        <div class="sim-toolbar">
          <label for="cpuArchSelect">Arquitetura</label>
          <select class="field" id="cpuArchSelect" onchange="CpuSim.setArch(this.value)">
            <option value="x86">x86-64</option><option value="arm">ARM64 (AArch64)</option>
          </select>
          <button type="button" onclick="CpuSim.step()">▷ Próxima instrução</button>
          <button type="button" class="secondary" onclick="CpuSim.runAll()">⏩ Executar programa</button>
          <button type="button" class="ghost" onclick="CpuSim.reset()">↺ Reiniciar</button>
        </div>
        <div class="sim-grid">
          <section class="card sim-panel" aria-labelledby="cpuProgramTitle">
            <h3 id="cpuProgramTitle">1. Programa</h3>
            <label class="sr-only" for="cpuProgram">Código assembly simulado</label>
            <textarea class="field sim-code" id="cpuProgram" rows="9" spellcheck="false" onchange="CpuSim.updateProgram(this.value)"></textarea>
            <p class="small muted">Instruções aceitas: MOV, ADD, SUB, AND, OR, XOR, SHL, CMP, INC, DEC, PUSH, POP, JMP/B, NOP e rótulos.</p>
            <div class="sim-program" tabindex="0" id="cpuProgramLines" aria-label="Programa com a linha atual destacada"></div>
          </section>

          <section class="card sim-panel" aria-labelledby="cpuRegsTitle">
            <h3 id="cpuRegsTitle">2. Registradores e flags</h3>
            <div id="cpuRegisters"></div>
            <h4>Flags</h4>
            <div id="cpuFlags"></div>
            <p class="small" id="cpuStatus" role="status" aria-live="polite"></p>
            <div class="sim-pipeline" id="cpuPipeline" aria-label="Estágios do ciclo de instrução">
              ${["IF", "ID", "EX", "MEM", "WB"].map(s => `<span class="sim-stage">${s}</span>`).join("")}
            </div>
            <p class="small muted">IF: busca · ID: decodificação · EX: execução · MEM: memória · WB: escrita no registrador.</p>
          </section>

          <section class="card sim-panel" aria-labelledby="cpuStackTitle">
            <h3 id="cpuStackTitle">3. Pilha (LIFO)</h3>
            <div id="cpuStack"></div>
            <p class="small muted">O ponteiro de pilha (SP/RSP) aponta para o topo. PUSH decrementa 8 bytes; POP incrementa.</p>
          </section>

          <section class="card sim-panel" aria-labelledby="cpuMemTitle">
            <h3 id="cpuMemTitle">4. Memória e traço</h3>
            <div id="cpuMemory"></div>
            <h4>Traço de execução</h4>
            <ol class="sim-trace" id="cpuTrace" aria-live="polite"></ol>
          </section>
        </div>
      </div>`;
    refresh();
  }

  window.CpuSim = {
    mount,
    refresh,
    setArch(arch) {
      if (!ARCH[arch]) return;
      state.arch = arch;
      resetMachine(false);
      trace(`Arquitetura alterada para ${current().label}.`);
      refresh();
    },
    updateProgram(text) {
      loadProgram(text);
      state.trace = [];
      refresh();
    },
    step: executeStep,
    runAll() {
      let guard = 0;
      while (!state.halted && guard++ < 200) executeStep();
      if (typeof Storage !== "undefined" && typeof Storage.logSimulator === "function") {
        Storage.logSimulator("cpu", `Execução completa: ${guard} instruções em ${current().label}`);
      }
      refresh();
    },
    reset() {
      resetMachine(true);
      trace("Máquina reiniciada; programa preservado.");
      refresh();
    }
  };
})();

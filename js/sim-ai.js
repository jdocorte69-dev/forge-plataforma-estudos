/* ============================================================
   FORGE — sim-ai.js
   Visualizador local de descida de gradiente e self-attention.
   Nenhum serviço externo, nenhuma API paga, apenas matemática no DOM.
   ============================================================ */

(function () {
  "use strict";

  const DATA = [
    { x: 0, y: 1 }, { x: 1, y: 3.1 }, { x: 2, y: 4.9 },
    { x: 3, y: 7.2 }, { x: 4, y: 8.8 }
  ];

  const state = {
    w: 0, b: 0, lr: 0.08, history: [], step: 0,
    tokens: ["gato", "persegue", "rato"], causal: true, temperature: 1,
    mounted: false
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function n(value, digits) {
    const v = Number(value) || 0;
    return v.toFixed(digits == null ? 4 : digits);
  }

  function loss(w, b) {
    return DATA.reduce((sum, p) => sum + Math.pow(w * p.x + b - p.y, 2), 0) / DATA.length;
  }

  function gradients(w, b) {
    let gw = 0, gb = 0;
    DATA.forEach(p => {
      const err = w * p.x + b - p.y;
      gw += 2 * err * p.x;
      gb += 2 * err;
    });
    return { gw: gw / DATA.length, gb: gb / DATA.length };
  }

  function gradientStep() {
    const g = gradients(state.w, state.b);
    state.w -= state.lr * g.gw;
    state.b -= state.lr * g.gb;
    state.step += 1;
    state.history.push({ step: state.step, w: state.w, b: state.b, loss: loss(state.w, state.b), gw: g.gw, gb: g.gb });
    state.history = state.history.slice(-40);
    if (typeof Storage !== "undefined" && typeof Storage.logSimulator === "function") {
      Storage.logSimulator("ai", `Gradiente passo ${state.step}: w=${n(state.w)}, b=${n(state.b)}, perda=${n(loss(state.w, state.b))}`);
    }
  }

  function embedding(token) {
    const vec = Array(8).fill(0);
    let h = 2166136261;
    for (let i = 0; i < token.length; i++) {
      h ^= token.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
      vec[i % 8] += ((h >>> (i % 16)) & 15) / 15 - 0.5;
    }
    const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
    return vec.map(v => v / norm);
  }

  function softmax(scores) {
    const max = Math.max.apply(null, scores.filter(Number.isFinite));
    const exps = scores.map(s => Number.isFinite(s) ? Math.exp(s - max) : 0);
    const sum = exps.reduce((a, b) => a + b, 0) || 1;
    return exps.map(e => e / sum);
  }

  function attentionMatrix() {
    const vectors = state.tokens.map(embedding);
    const d = 8;
    return vectors.map((q, i) => {
      const raw = vectors.map((k, j) => {
        if (state.causal && j > i) return -Infinity;
        const dot = q.reduce((s, v, p) => s + v * k[p], 0);
        return dot / Math.sqrt(d) / Math.max(0.1, state.temperature);
      });
      const probs = softmax(raw);
      return { token: state.tokens[i], probs };
    });
  }

  function plotSVG() {
    const W = 420, H = 240, pad = 34;
    const xMin = -0.5, xMax = 4.5, yMin = -1, yMax = 10;
    const sx = x => pad + (x - xMin) / (xMax - xMin) * (W - 2 * pad);
    const sy = y => H - pad - (y - yMin) / (yMax - yMin) * (H - 2 * pad);
    const line = `M ${sx(xMin)} ${sy(state.w * xMin + state.b)} L ${sx(xMax)} ${sy(state.w * xMax + state.b)}`;
    const points = DATA.map(p => `<circle cx="${n(sx(p.x), 1)}" cy="${n(sy(p.y), 1)}" r="4" class="sim-ai-point" />`).join("");
    const hist = state.history;
    let curve = "";
    if (hist.length > 1) {
      const maxLoss = Math.max.apply(null, hist.map(h => h.loss)) || 1;
      curve = hist.map((h, i) => {
        const px = pad + i / Math.max(1, hist.length - 1) * (W - 2 * pad);
        const py = H - pad - (h.loss / maxLoss) * (H - 2 * pad);
        return `${i ? "L" : "M"} ${n(px, 1)} ${n(py, 1)}`;
      }).join(" ");
    }
    return `<svg class="sim-sim-plot" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfico da reta prevista e dos dados de treino; perda atual ${n(loss(state.w, state.b), 3)}">
      <g class="sim-grid-lines">
        ${[0, 2, 4, 6, 8, 10].map(y => `<line x1="${pad}" y1="${n(sy(y), 1)}" x2="${W - pad}" y2="${n(sy(y), 1)}" />`).join("")}
        ${[0, 1, 2, 3, 4].map(x => `<line x1="${n(sx(x), 1)}" y1="${pad}" x2="${n(sx(x), 1)}" y2="${H - pad}" />`).join("")}
      </g>
      <path d="${line}" class="sim-ai-line" />
      ${points}
      ${curve ? `<path d="${curve}" class="sim-ai-curve" />` : ""}
      <text x="${pad}" y="18" class="sim-svg-label">y = ${n(state.w, 2)}x + ${n(state.b, 2)}</text>
      <text x="${W - pad}" y="${H - 10}" class="sim-svg-label" text-anchor="end">x</text>
    </svg>`;
  }

  function gradientTableHTML() {
    if (!state.history.length) return '<p class="small muted">Execute um passo para ver os gradientes.</p>';
    return `<div class="sim-table-wrap" tabindex="0"><table class="sim-table"><caption class="sr-only">Histórico da descida de gradiente</caption>
      <thead><tr><th scope="col">Passo</th><th scope="col">w</th><th scope="col">b</th><th scope="col">∂L/∂w</th><th scope="col">Perda</th></tr></thead>
      <tbody>${state.history.slice(-8).reverse().map(h => `<tr>
        <th scope="row">${h.step}</th><td>${n(h.w, 3)}</td><td>${n(h.b, 3)}</td>
        <td>${n(h.gw, 3)}</td><td>${n(h.loss, 4)}</td></tr>`).join("")}</tbody>
    </table></div>`;
  }

  function attentionHTML() {
    const rows = attentionMatrix();
    if (!rows.length) return '<p class="small muted">Digite ao menos um token.</p>';
    const head = `<tr><th scope="col" class="sim-kmap-corner">Consulta ↓ / Chave →</th>${state.tokens.map(t => `<th scope="col">${esc(t)}</th>`).join("")}</tr>`;
    const body = rows.map((row, i) => `<tr><th scope="row">${esc(row.token)}</th>${row.probs.map((p, j) => {
      const intensity = Math.round(Math.min(1, p) * 100);
      const masked = state.causal && j > i;
      return `<td><div class="sim-attn-cell ${masked ? "is-masked" : ""}" style="--attn-alpha:${(intensity / 100 * 0.75 + 0.08).toFixed(2)}"
        title="${esc(row.token)} → ${esc(state.tokens[j])}: ${masked ? "mascarado" : n(p, 3)}"
        aria-label="${esc(row.token)}_atende_${esc(state.tokens[j])}: ${masked ? "mascarado" : n(p, 3)}">${masked ? "—" : n(p, 2)}</div></td>`;
    }).join("")}</tr>`).join("");
    return `<div class="sim-kmap-scroll" tabindex="0"><table class="sim-table sim-attn"><caption class="sr-only">Matriz de atenção entre tokens</caption>
      <thead>${head}</thead><tbody>${body}</tbody></table></div>
      <p class="small muted">Cada linha é um softmax: os valores somam 1 entre as chaves não mascaradas. ${state.causal ? "Máscara causal ativa: um token não vê o futuro." : "Sem máscara causal: cada token vê toda a sequência."}</p>`;
  }

  function refresh() {
    if (!state.mounted) return;
    const w = document.getElementById("aiW");
    const b = document.getElementById("aiB");
    const lr = document.getElementById("aiLr");
    if (w) { w.value = n(state.w, 2); document.getElementById("aiWOut").textContent = n(state.w, 2); }
    if (b) { b.value = n(state.b, 2); document.getElementById("aiBOut").textContent = n(state.b, 2); }
    if (lr) { lr.value = String(state.lr); document.getElementById("aiLrOut").textContent = n(state.lr, 3); }
    const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    set("aiLoss", n(loss(state.w, state.b), 5));
    set("aiStep", String(state.step));
    const plot = document.getElementById("aiPlot");
    if (plot) plot.innerHTML = plotSVG();
    const gradTable = document.getElementById("aiGradTable");
    if (gradTable) gradTable.innerHTML = gradientTableHTML();
    const tokensInput = document.getElementById("aiTokens");
    if (tokensInput && tokensInput.value !== state.tokens.join(" ")) tokensInput.value = state.tokens.join(" ");
    const causal = document.getElementById("aiCausal");
    if (causal) causal.checked = state.causal;
    const temp = document.getElementById("aiTemp");
    if (temp) { temp.value = String(state.temperature); set("aiTempOut", n(state.temperature, 1)); }
    const attention = document.getElementById("aiAttention");
    if (attention) attention.innerHTML = attentionHTML();
    const count = document.getElementById("aiRunCount");
    if (typeof Storage !== "undefined" && Storage.get()) {
      const rec = (Storage.get().forge3?.simulators || {}).ai || { runs: 0 };
      count.textContent = String(rec.runs || 0);
    }
  }

  function mount() {
    const root = document.getElementById("aiSimRoot");
    if (!root) { state.mounted = false; return; }
    if (state.mounted && root.childElementCount) { refresh(); return; }
    state.mounted = true;
    root.innerHTML = `
      <div class="sim-shell trail-ai trail-accent">
        <div class="sim-head">
          <div><span class="pill">Trilha 12 · Inteligência Artificial</span><h2>Visualizador de Gradiente e Atenção</h2>
          <p class="muted">Duas ideias centrais em ação: ajustar pesos com descida de gradiente e ponderar tokens com self-attention.</p></div>
          <p class="sim-counter">Execuções registradas: <b id="aiRunCount">0</b></p>
        </div>
        <div class="sim-grid">
          <section class="card sim-panel" aria-labelledby="aiGradientTitle">
            <h3 id="aiGradientTitle">1. Descida de gradiente</h3>
            <p class="small muted">Ajuste w e b para minimizar o erro quadrático médio dos pontos.</p>
            <div class="sim-sliders">
              <label for="aiW">Peso inicial w (<output id="aiWOut">0.00</output>)</label>
              <input type="range" id="aiW" min="-2" max="4" step="0.1" value="0" oninput="AiSim.setParam('w',Number(this.value))">
              <label for="aiB">Viés inicial b (<output id="aiBOut">0.00</output>)</label>
              <input type="range" id="aiB" min="-3" max="5" step="0.1" value="0" oninput="AiSim.setParam('b',Number(this.value))">
              <label for="aiLr">Taxa de aprendizagem α (<output id="aiLrOut">0.080</output>)</label>
              <input type="range" id="aiLr" min="0.01" max="0.5" step="0.01" value="0.08" oninput="AiSim.setParam('lr',Number(this.value))">
            </div>
            <div class="sim-toolbar">
              <button type="button" onclick="AiSim.step()">▷ Um passo</button>
              <button type="button" class="secondary" onclick="AiSim.run(40)">⏩ 40 passos</button>
              <button type="button" class="ghost" onclick="AiSim.reset()">↺ Reiniciar</button>
            </div>
            <p class="sim-metrics"><span>Passo <b id="aiStep">0</b></span><span>Perda <b id="aiLoss">0</b></span></p>
            <div id="aiPlot" class="sim-plot" tabindex="0"></div>
            <div id="aiGradTable"></div>
            <p class="small muted">w ← w − α·(2/N)Σ(eᵢ·xᵢ) · b ← b − α·(2/N)Σ(eᵢ)</p>
          </section>

          <section class="card sim-panel" aria-labelledby="aiAttnTitle">
            <h3 id="aiAttnTitle">2. Self-attention</h3>
            <label for="aiTokens">Tokens (separados por espaço)</label>
            <input class="field" id="aiTokens" value="gato persegue rato" onchange="AiSim.setTokens(this.value)">
            <div class="sim-checks">
              <label class="check"><input type="checkbox" id="aiCausal" checked onchange="AiSim.setCausal(this.checked)"> Máscara causal (não olhar para o futuro)</label>
            </div>
            <label for="aiTemp">Temperatura (<output id="aiTempOut">1.0</output>)</label>
            <input type="range" id="aiTemp" min="0.3" max="2" step="0.1" value="1" oninput="AiSim.setParam('temperature',Number(this.value))">
            <div id="aiAttention"></div>
            <p class="small muted">Atenção = softmax(QKᵀ / (√dₖ · T)). Embeddings determinísticos locais servem apenas para visualizar o mecanismo.</p>
          </section>
        </div>
      </div>`;
    refresh();
  }

  window.AiSim = {
    mount,
    refresh,
    step() { gradientStep(); refresh(); },
    run(count) {
      for (let i = 0; i < Math.min(200, count || 1); i++) gradientStep();
      refresh();
    },
    reset() {
      state.w = 0; state.b = 0; state.step = 0; state.history = [];
      refresh();
    },
    setParam(key, value) {
      if (!Number.isFinite(Number(value))) return;
      if (key === "lr") state.lr = Math.max(0.01, Math.min(0.5, Number(value)));
      else if (key === "temperature") state.temperature = Math.max(0.1, Number(value));
      else if (key === "w" || key === "b") {
        state[key] = Number(value);
        state.step = 0;
        state.history = [];
      }
      refresh();
    },
    setTokens(text) {
      const tokens = String(text || "").trim().split(/\s+/).filter(Boolean).slice(0, 8);
      state.tokens = tokens.length ? tokens : ["..."];
      if (typeof Storage !== "undefined" && typeof Storage.logSimulator === "function") {
        Storage.logSimulator("ai", `Atenção com ${state.tokens.length} tokens: ${state.tokens.join(" ")}`);
      }
      refresh();
    },
    setCausal(value) {
      state.causal = Boolean(value);
      refresh();
    }
  };
})();

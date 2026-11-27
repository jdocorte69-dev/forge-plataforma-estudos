/* ============================================================
   FORGE 7.0 — sim-ai.js
   Visualizador local de descida de gradiente (gráfico 2D e
   superfície isométrica 3D) e self-attention com Q/K/V e matriz
   de scores explícitos. Nenhum serviço externo, nenhuma API paga.
   ============================================================ */

(function () {
  "use strict";

  const DATA = [
    { x: 0, y: 1 }, { x: 1, y: 3.1 }, { x: 2, y: 4.9 },
    { x: 3, y: 7.2 }, { x: 4, y: 8.8 }
  ];

  const state = {
    w: 0, b: 0, lr: 0.08, history: [], step: 0, diverged: false,
    tokens: ["gato", "persegue", "rato"], causal: true, temperature: 1,
    mounted: false
  };

  /* Projeções determinísticas Q/K/V (8 -> 3 dimensões): apenas para
     visualizar o mecanismo, sem pesos treinados nem rede externa. */
  function projection(seed) {
    return Array.from({ length: 8 }, (_, i) => Array.from({ length: 3 }, (_, j) => {
      let h = 2166136261;
      for (const ch of `${seed}|${i}|${j}`) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
      return (h % 2001) / 1000 - 1;
    }));
  }
  const WQ = projection("Q"), WK = projection("K"), WV = projection("V");

  function project(vec, matrix) {
    return matrix.map(row => row.reduce((sum, weight, i) => sum + weight * vec[i], 0));
  }

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
    const nextW = state.w - state.lr * g.gw;
    const nextB = state.b - state.lr * g.gb;
    const nextLoss = Number.isFinite(nextW) && Number.isFinite(nextB) ? loss(nextW, nextB) : NaN;
    if (!Number.isFinite(nextLoss)) { state.diverged = true; return; }
    state.w = nextW;
    state.b = nextB;
    state.step += 1;
    state.diverged = nextLoss > 1e6;
    state.history.push({ step: state.step, w: state.w, b: state.b, loss: nextLoss, gw: g.gw, gb: g.gb });
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

  function attentionParts() {
    const vectors = state.tokens.map(embedding);
    const Q = vectors.map(v => project(v, WQ));
    const K = vectors.map(v => project(v, WK));
    const V = vectors.map(v => project(v, WV));
    const scale = Math.sqrt(3) * Math.max(0.1, state.temperature);
    const scores = Q.map((q, i) => K.map((k, j) =>
      (state.causal && j > i) ? -Infinity : q.reduce((s, v, p) => s + v * k[p], 0) / scale));
    const probs = scores.map(softmax);
    const outputs = probs.map(row => [0, 1, 2].map(d => row.reduce((sum, p, j) => sum + p * V[j][d], 0)));
    return { Q, K, V, scores, probs, outputs };
  }

  function attentionMatrix() {
    const parts = attentionParts();
    return parts.probs.map((probs, i) => ({ token: state.tokens[i], probs }));
  }

  function matrixHTML(title, matrix, rowLabels, colCount) {
    if (!matrix.length) return `<p class="small muted">${esc(title)}: sem dados.</p>`;
    const head = `<tr><th scope="col" class="sim-kmap-corner">${esc(title)}</th>${Array.from({ length: colCount }, (_, i) => `<th scope="col">d${i + 1}</th>`).join("")}</tr>`;
    const body = matrix.map((row, i) => `<tr><th scope="row">${esc(rowLabels[i])}</th>${row.map(v => `<td>${n(v, 3)}</td>`).join("")}</tr>`).join("");
    return `<div class="sim-table-wrap" tabindex="0"><table class="sim-table"><caption class="sr-only">${esc(title)}</caption>
      <thead>${head}</thead><tbody>${body}</tbody></table></div>`;
  }

  function qkvHTML() {
    const parts = attentionParts();
    return `<p class="small muted">Projeções locais determinísticas (d<sub>modelo</sub>=8 → d<sub>k</sub>=3): cada token gera um vetor Q (consulta), K (chave) e V (valor).</p>
      ${matrixHTML("Matriz Q", parts.Q, state.tokens, 3)}
      ${matrixHTML("Matriz K", parts.K, state.tokens, 3)}
      ${matrixHTML("Matriz V", parts.V, state.tokens, 3)}`;
  }

  function scoresHTML() {
    const parts = attentionParts();
    const head = `<tr><th scope="col" class="sim-kmap-corner">Score bruto</th>${state.tokens.map(t => `<th scope="col">${esc(t)}</th>`).join("")}</tr>`;
    const body = parts.scores.map((row, i) => `<tr><th scope="row">${esc(state.tokens[i])}</th>${row.map((score, j) => {
      const masked = state.causal && j > i;
      return `<td><code>${masked ? "—" : n(score, 3)}</code></td>`;
    }).join("")}</tr>`).join("");
    return `<div class="sim-kmap-scroll" tabindex="0"><table class="sim-table sim-attn"><caption class="sr-only">Matriz de scores antes do softmax</caption>
      <thead>${head}</thead><tbody>${body}</tbody></table></div>
      <p class="small muted">Score = Q·Kᵀ / (√dₖ · T). Depois vem o softmax linha a linha, mostrado abaixo; “—” indica máscara causal.</p>`;
  }

  /* Superfície L(w,b) em projeção isométrica: malha + trajetória θ.
     Sem animação: apenas transformação estática, compatível com
     prefers-reduced-motion e sem deslocamento de layout. */
  function surfaceSVG() {
    const W = 460, H = 300;
    const wMin = -4, wMax = 8, bMin = -8, bMax = 12, divisions = 12;
    const height = value => Math.min(12, Math.log10(1 + Math.max(0, Number.isFinite(value) ? value : 1e12)) * 7);
    const project = (w, b, value) => {
      const u = Math.max(0, Math.min(1, (w - wMin) / (wMax - wMin)));
      const v = Math.max(0, Math.min(1, (b - bMin) / (bMax - bMin)));
      return { x: 220 + (u - v) * 135, y: 210 + (u + v) * 42 - height(value) * 11 };
    };
    const rows = [];
    for (let bi = 0; bi <= divisions; bi++) {
      const b = bMin + (bMax - bMin) * bi / divisions;
      const path = [];
      for (let wi = 0; wi <= divisions; wi++) {
        const w = wMin + (wMax - wMin) * wi / divisions;
        const p = project(w, b, loss(w, b));
        path.push(`${wi ? "L" : "M"} ${n(p.x, 1)} ${n(p.y, 1)}`);
      }
      rows.push(`<path d="${path.join(" ")}" class="sim-grid-lines" fill="none" />`);
    }
    const cols = [];
    for (let wi = 0; wi <= divisions; wi++) {
      const w = wMin + (wMax - wMin) * wi / divisions;
      const path = [];
      for (let bi = 0; bi <= divisions; bi++) {
        const b = bMin + (bMax - bMin) * bi / divisions;
        const p = project(w, b, loss(w, b));
        path.push(`${bi ? "L" : "M"} ${n(p.x, 1)} ${n(p.y, 1)}`);
      }
      cols.push(`<path d="${path.join(" ")}" class="sim-grid-lines" fill="none" opacity="0.55" />`);
    }
    const trajectory = state.history.map((h, i) => {
      const p = project(h.w, h.b, h.loss);
      return `${i ? "L" : "M"} ${n(p.x, 1)} ${n(p.y, 1)}`;
    }).join(" ");
    const current = project(state.w, state.b, loss(state.w, state.b));
    const diverged = isDiverged();
    return `<svg class="sim-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Superfície isométrica da perda L(w,b) com a trajetória dos parâmetros; perda atual ${n(loss(state.w, state.b), 3)}">
      <g>${rows.join("")}${cols.join("")}</g>
      ${trajectory ? `<path d="${trajectory}" class="sim-ai-curve" />` : ""}
      <circle cx="${n(current.x, 1)}" cy="${n(current.y, 1)}" r="6" class="sim-ai-point" />
      <text x="12" y="24" class="sim-svg-label">L(w,b) · superfície didática</text>
      <text x="12" y="${H - 8}" class="sim-svg-label">w →</text>
      <text x="${W - 12}" y="${H - 8}" class="sim-svg-label" text-anchor="end">b →</text>
      ${diverged ? `<text x="${W / 2}" y="20" text-anchor="middle" class="sim-svg-label">DIVERGÊNCIA: α alto</text>` : ""}
    </svg>`;
  }

  function isDiverged() {
    const value = loss(state.w, state.b);
    return state.diverged || !Number.isFinite(value) || value > 1e6;
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
    const surface = document.getElementById("aiSurface");
    if (surface) surface.innerHTML = surfaceSVG();
    set("aiDivergence", isDiverged()
      ? "Atenção: α alto — os passos aumentam a perda (divergência). Reduza a taxa e reinicie."
      : "α estável: a trajetória desce na superfície de perda.");
    const gradTable = document.getElementById("aiGradTable");
    if (gradTable) gradTable.innerHTML = gradientTableHTML();
    const tokensInput = document.getElementById("aiTokens");
    if (tokensInput && tokensInput.value !== state.tokens.join(" ")) tokensInput.value = state.tokens.join(" ");
    const causal = document.getElementById("aiCausal");
    if (causal) causal.checked = state.causal;
    const temp = document.getElementById("aiTemp");
    if (temp) { temp.value = String(state.temperature); set("aiTempOut", n(state.temperature, 1)); }
    const qkv = document.getElementById("aiQKV");
    if (qkv) qkv.innerHTML = qkvHTML();
    const scores = document.getElementById("aiScores");
    if (scores) scores.innerHTML = scoresHTML();
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
              <input type="range" id="aiLr" min="0.01" max="1.5" step="0.01" value="0.08" oninput="AiSim.setParam('lr',Number(this.value))">
              <p class="small muted">Valores altos (perto de 1.5) tornam a divergência visível na superfície 3D.</p>
            </div>
            <div class="sim-toolbar">
              <button type="button" onclick="AiSim.step()">▷ Um passo</button>
              <button type="button" class="secondary" onclick="AiSim.run(40)">⏩ 40 passos</button>
              <button type="button" class="ghost" onclick="AiSim.reset()">↺ Reiniciar</button>
            </div>
            <p class="sim-metrics"><span>Passo <b id="aiStep">0</b></span><span>Perda <b id="aiLoss">0</b></span></p>
            <div id="aiPlot" class="sim-plot" tabindex="0"></div>
            <h4>Superfície de perda (vista isométrica)</h4>
            <div id="aiSurface" class="sim-diagram" tabindex="0"></div>
            <p class="small" id="aiDivergence" role="status" aria-live="polite"></p>
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
            <h4>Matrizes Q, K e V</h4>
            <div id="aiQKV"></div>
            <h4>Scores brutos (antes do softmax)</h4>
            <div id="aiScores"></div>
            <h4>Softmax (probabilidades de atenção)</h4>
            <div id="aiAttention"></div>
            <p class="small muted">Atenção = softmax(QKᵀ / (√dₖ · T)). Embeddings e projeções determinísticos locais servem apenas para visualizar o mecanismo.</p>
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
      state.w = 0; state.b = 0; state.step = 0; state.history = []; state.diverged = false;
      refresh();
    },
    setParam(key, value) {
      if (!Number.isFinite(Number(value))) return;
      if (key === "lr") state.lr = Math.max(0.01, Math.min(1.5, Number(value)));
      else if (key === "temperature") state.temperature = Math.max(0.1, Number(value));
      else if (key === "w" || key === "b") {
        state[key] = Number(value);
        state.step = 0;
        state.history = [];
        state.diverged = false;
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
    },
    attentionDetails: attentionParts
  };
})();

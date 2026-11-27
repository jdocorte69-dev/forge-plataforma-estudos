/* ============================================================
   FORGE 7.0 — sim-crypto.js
   Laboratório DIDÁTICO: CSPRNG vs LCG em tela, entropia de
   Shannon, parâmetros Argon2id e layout AEAD com inspeção de
   bytes. Nenhuma operação criptográfica real é executada nem
   dados do usuário são enviados a qualquer lugar.
   Expõe window.CryptoSim (API pública preservada).
   ============================================================ */

(function () {
  "use strict";

  const state = {
    mode: "csprng",
    seed: 20261127,
    memoryKiB: 512,
    iterations: 2,
    parallelism: 1,
    plaintextLen: 64,
    textSample: "",
    bytes: [],
    lastRun: null,
    mounted: false
  };

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function num(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function math() {
    return (typeof window !== "undefined" && window.ForgeMathUtils) ? window.ForgeMathUtils : null;
  }

  function lcgNext(seed) {
    const m = math();
    return m ? m.lcgNext(seed) : (Math.imul(seed >>> 0, 1664525) + 1013904223) >>> 0;
  }

  function entropy(text) {
    const m = math();
    if (m && typeof m.shannonEntropy === "function") return m.shannonEntropy(text);
    const freq = new Map();
    for (const ch of String(text || "")) freq.set(ch, (freq.get(ch) || 0) + 1);
    let h = 0;
    for (const count of freq.values()) {
      const p = count / String(text).length;
      h -= p * Math.log2(p);
    }
    return h;
  }

  function makeBytes() {
    const count = 64;
    const out = new Uint8Array(count);
    let source = "CSPRNG (Web Crypto)";
    if (state.mode === "lcg" || (typeof crypto === "undefined" || !crypto.getRandomValues)) {
      let x = num(state.seed, 1) >>> 0;
      for (let i = 0; i < count; i++) {
        x = lcgNext(x);
        out[i] = x & 0xff;
      }
      source = state.mode === "lcg" ? "LCG determinístico" : "LCG (fallback sem Web Crypto)";
    } else {
      crypto.getRandomValues(out);
    }
    return { bytes: Array.from(out), source };
  }

  function hex(bytes) {
    return bytes.slice(0, 8).map(b => b.toString(16).padStart(2, "0")).join(" ");
  }

  function vaultFields() {
    const len = Math.min(256, Math.max(16, Math.round(num(state.plaintextLen, 64))));
    return [
      { name: "magic", size: 4, note: '"FORG"' },
      { name: "versão", size: 1, note: "0x01" },
      { name: "salt", size: 16, note: "Argon2id" },
      { name: "nonce", size: 12, note: "AEAD" },
      { name: "ciphertext", size: len, note: "payload" },
      { name: "tag", size: 16, note: "autenticação" }
    ];
  }

  function draw(bytes) {
    const canvas = (typeof document !== "undefined") ? document.getElementById("cryptoCanvas") : null;
    if (!canvas || typeof canvas.getContext !== "function") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const side = 8;
    const cell = canvas.width / side;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bytes.slice(0, side * side).forEach((byte, i) => {
      const x = (i % side) * cell;
      const y = Math.floor(i / side) * cell;
      const hue = (byte * 360 / 256) | 0;
      ctx.fillStyle = `hsl(${hue} 62% 42%)`;
      ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
      ctx.fillStyle = "rgba(255,255,255,0.72)";
      ctx.font = "10px ui-monospace, monospace";
      ctx.fillText(byte.toString(16).padStart(2, "0"), x + 5, y + cell / 2 + 3);
    });
  }

  function pageHTML() {
    return `
<section class="card forge4-panel" aria-labelledby="cryptoTitle">
  <p class="forge4-kicker">Laboratório de criptografia · didático</p>
  <h1 class="h1" id="cryptoTitle">Aleatoriedade, entropia e cofre</h1>
  <p class="sub">Compare uma fonte criptográfica com um gerador linear e veja por que previsibilidade importa. Nada aqui protege dados reais.</p>
  <p class="small" role="note"><b>SIMULAÇÃO DIDÁTICA:</b> apenas visualizações locais. Não há derivação de chave, cifragem, decifragem, rede nem envio de dados; bytes mostrados são ilustrativos.</p>
  <div id="cryptoRoot" class="crypto-grid"></div>
</section>`;
  }

  function renderPage(v) {
    if (!v || typeof v.innerHTML === "undefined") return;
    v.innerHTML = pageHTML();
    state.mounted = true;
    refresh();
    run(false);
  }

  function controlsHTML() {
    return `
<section class="card forge4-panel" aria-labelledby="cryptoGenTitle">
  <h2 id="cryptoGenTitle" style="margin-top:0">1. Gerador de 64 bytes</h2>
  <div class="actions" style="margin-bottom:12px">
    <button type="button" class="${state.mode === "csprng" ? "" : "secondary"}" onclick="CryptoSim.setMode('csprng')">CSPRNG</button>
    <button type="button" class="${state.mode === "lcg" ? "" : "secondary"}" onclick="CryptoSim.setMode('lcg')">LCG</button>
    <button type="button" onclick="CryptoSim.run()">↻ Gerar</button>
  </div>
  <label for="cryptoSeed">Semente do LCG (<output id="cryptoSeedOut">${esc(state.seed)}</output>)</label>
  <input class="field" id="cryptoSeed" type="number" min="0" max="4294967295" value="${esc(state.seed)}" onchange="CryptoSim.setParam('seed',Number(this.value))">
  <canvas id="cryptoCanvas" class="crypto-canvas" width="320" height="320" role="img" aria-label="Matriz 8 por 8 de bytes gerados"></canvas>
  <p class="sim-metrics"><span>Fonte <b id="cryptoSource">—</b></span><span>Entropia <b id="cryptoEntropy">0.00</b> bits/símbolo</span><span>Valores distintos <b id="cryptoUnique">0</b>/64</span></p>
  <p class="small muted">Primeiros bytes: <code id="cryptoHex">—</code></p>
  <p class="small muted">LCG exibido: x<sub>n+1</sub> = (1664525·x<sub>n</sub> + 1013904223) mod 2<sup>32</sup> — previsível por construção.</p>
</section>

<section class="card forge4-panel" aria-labelledby="cryptoLiveTitle">
  <h2 id="cryptoLiveTitle" style="margin-top:0">Calculadora de entropia ao vivo</h2>
  <p class="small muted">Digite qualquer sequência: a entropia de Shannon é calculada neste navegador, em bits por símbolo. Nada é salvo ou enviado.</p>
  <label for="cryptoEntropyText">Sequência para análise</label>
  <input class="field" id="cryptoEntropyText" type="text" style="min-height:48px" autocomplete="off"
    placeholder="Ex.: ABABAB" oninput="CryptoSim.entropyOf(this.value)">
  <p class="sim-metrics"><span>Entropia <b id="cryptoLiveEntropy">0.00</b> bits/símbolo</span><span>Símbolos distintos <b id="cryptoLiveUnique">0</b></span></p>
</section>

<section class="card forge4-panel" aria-labelledby="cryptoKdfTitle">
  <h2 id="cryptoKdfTitle" style="margin-top:0">2. Argon2id (simulação de parâmetros)</h2>
  <p class="small muted" role="note">DIDÁTICO: ajuste m (memória KiB), t (iterações) e p (paralelismo) para ler o impacto. Não há derivação real de chave nesta página.</p>
  <label for="cryptoMem">Memória (<output id="cryptoMemOut">${state.memoryKiB}</output> KiB)</label>
  <input class="crypto-slider" id="cryptoMem" type="range" min="64" max="2048" step="64" value="${state.memoryKiB}" oninput="CryptoSim.setParam('memoryKiB',Number(this.value))">
  <label for="cryptoT">Iterações t (<output id="cryptoTOut">${state.iterations}</output>)</label>
  <input class="crypto-slider" id="cryptoT" type="range" min="1" max="6" step="1" value="${state.iterations}" oninput="CryptoSim.setParam('iterations',Number(this.value))">
  <label for="cryptoP">Paralelismo p (<output id="cryptoPOut">${state.parallelism}</output>)</label>
  <input class="crypto-slider" id="cryptoP" type="range" min="1" max="4" step="1" value="${state.parallelism}" oninput="CryptoSim.setParam('parallelism',Number(this.value))">
  <p class="sim-metrics"><span>Custo <b id="cryptoCost">—</b> MiB-passos</span><span>Memória × t <b id="cryptoCostMB">—</b> MiB</span></p>
  <p class="small muted" id="cryptoKdfNote">Use Argon2id real (biblioteca auditada) para proteger segredos.</p>
</section>

<section class="card forge4-panel forge4-grid--wide" aria-labelledby="cryptoVaultTitle">
  <h2 id="cryptoVaultTitle" style="margin-top:0">3. Layout AEAD e inspeção de bytes</h2>
  <p class="small muted" role="note">DIDÁTICO: salt 16 B, nonce 12 B, ciphertext configurável e tag 16 B. Os bytes exibidos são apenas ilustrativos — não houve cifragem nem autenticação real.</p>
  <label for="cryptoLen">Tamanho do payload (<output id="cryptoLenOut">${state.plaintextLen}</output> bytes)</label>
  <input class="crypto-slider" id="cryptoLen" type="range" min="16" max="256" step="16" value="${state.plaintextLen}" oninput="CryptoSim.setParam('plaintextLen',Number(this.value))">
  <div class="crypto-bytes" id="cryptoVault"></div>
  <div id="cryptoByteInspection"></div>
  <p class="small muted" id="cryptoTotal">—</p>
</section>

<section class="card forge4-panel forge4-grid--wide" aria-labelledby="cryptoPitfallsTitle">
  <h2 id="cryptoPitfallsTitle" style="margin-top:0">4. Duas armadilhas clássicas</h2>
  <details>
    <summary>Viés de módulo: por que <code>x % 6</code> não é uniforme</summary>
    <p class="small">Se x é uniforme em [0, 2<sup>32</sup>) e 2<sup>32</sup> não é múltiplo de 6, alguns restos recebem um valor a mais que os outros. O viés é pequeno, mas acumula em simulações e sorteadores. Caminho didático: amostragem por rejeição — descartar valores acima do último bloco completo antes de aplicar o módulo. Nenhum sorteio real é feito aqui.</p>
  </details>
  <details>
    <summary>Reuso de nonce: por que destrói a segurança do AEAD</summary>
    <p class="small">Sob a mesma chave, reutilizar nonce em AEAD (por exemplo, AES-GCM) é fatal: o XOR dos dois ciphertexts revela o XOR dos plaintexts, e a tag de autenticação perde a garantia de originalidade. Nonce não precisa ser secreto, mas precisa ser único por chave. Aqui o nonce é só um campo de 12 bytes desenhado na tela; não há operação criptográfica.</p>
  </details>
  <p class="small muted">Para proteger dados reais, use uma biblioteca auditada e parâmetros avaliados para o seu dispositivo. Este laboratório serve apenas para entender o formato e os riscos.</p>
</section>`;
  }

  function refresh() {
    const el = (typeof document !== "undefined") ? document.getElementById("cryptoRoot") : null;
    if (!el || !state.mounted) return;
    el.innerHTML = controlsHTML();
    draw(state.bytes.length ? state.bytes : []);
    updateMetrics();
    renderLiveEntropy();
    renderVault();
  }

  /* Entropia de uma sequência digitada — apenas cálculo local.
     Mantém o campo na memória para sobreviver a um refresh completo. */
  function entropyOf(text) {
    const sample = String(text == null ? "" : text).slice(0, 2000);
    state.textSample = sample;
    const set = (id, value) => {
      const el = (typeof document !== "undefined") ? document.getElementById(id) : null;
      if (el) el.textContent = value;
    };
    set("cryptoLiveEntropy", entropy(sample).toFixed(2));
    set("cryptoLiveUnique", String(new Set(sample).size));
    return entropy(sample);
  }

  function renderLiveEntropy() {
    if (typeof document === "undefined") return;
    const input = document.getElementById("cryptoEntropyText");
    if (input && input.value !== state.textSample) input.value = state.textSample;
    entropyOf(state.textSample);
  }

  /* Inspeção didática: bytes ilustrativos gerados a partir da amostra já
     exibida no painel — não representam cifragem nem autenticação reais. */
  function renderByteInspection() {
    const el = (typeof document !== "undefined") ? document.getElementById("cryptoByteInspection") : null;
    if (!el) return;
    const source = state.bytes.length ? state.bytes : [0];
    let offset = 0;
    const rows = vaultFields().map(f => {
      const start = offset;
      offset += f.size;
      const preview = Array.from({ length: Math.min(16, f.size) }, (_, i) =>
        source[(start + i) % source.length].toString(16).padStart(2, "0")).join(" ");
      return `<tr><th scope="row">${esc(f.name)}</th><td>${start}..${offset - 1}</td>
        <td>${f.size} B</td><td><code>${preview}${f.size > 16 ? " …" : ""}</code></td></tr>`;
    }).join("");
    el.innerHTML = `<div class="sim-table-wrap" tabindex="0"><table class="sim-table">
      <caption class="sr-only">Inspeção ilustrativa dos bytes do layout AEAD</caption>
      <thead><tr><th scope="col">Campo</th><th scope="col">Offset</th><th scope="col">Tamanho</th><th scope="col">Bytes ilustrativos (hex)</th></tr></thead>
      <tbody>${rows}</tbody></table></div>
      <p class="small muted">Offsets em bytes a partir do início do registro. Os valores hex vêm da amostra visual do gerador e servem apenas para treinar leitura de layout.</p>`;
  }

  function updateMetrics() {
    if (typeof document === "undefined") return;
    const h = entropy(String.fromCharCode(...(state.bytes.length ? state.bytes : [0])));
    const unique = new Set(state.bytes).size;
    const set = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };
    set("cryptoEntropy", h.toFixed(2));
    set("cryptoUnique", String(unique));
    set("cryptoHex", state.bytes.length ? hex(state.bytes) : "—");
    set("cryptoSource", state.lastRun?.source || "—");
    const canvas = document.getElementById("cryptoCanvas");
    if (canvas) canvas.setAttribute("aria-label", `Matriz 8 por 8 de bytes ${state.mode === "lcg" ? "previsíveis" : "aleatórios"}; entropia ${h.toFixed(2)} bits por símbolo`);
    const costMB = state.memoryKiB / 1024 * state.iterations;
    set("cryptoCost", costMB.toFixed(2));
    set("cryptoCostMB", (state.memoryKiB * state.iterations / 1024).toFixed(2));
    const note = document.getElementById("cryptoKdfNote");
    if (note) note.textContent = state.memoryKiB < 256
      ? "Memória baixa: barato para o atacante. Prefira ≥64 MiB em sistemas reais (aqui em KiB didáticos)."
      : "Parâmetros mais altos aumentam custo e latência; escolha conforme o dispositivo.";
  }

  function renderVault() {
    const el = (typeof document !== "undefined") ? document.getElementById("cryptoVault") : null;
    if (!el) return;
    const fields = vaultFields();
    let offset = 0;
    el.innerHTML = fields.map(f => {
      const start = offset;
      offset += f.size;
      return `<div class="crypto-byte"><b>${esc(f.name)}</b>${f.size} B · [${start}..${offset - 1}]<br><span class="small muted">${esc(f.note)}</span></div>`;
    }).join("");
    const total = document.getElementById("cryptoTotal");
    if (total) total.textContent = `Total: ${offset} bytes · campos fixos + payload configurável.`;
    renderByteInspection();
  }

  function setMode(mode) {
    if (mode !== "csprng" && mode !== "lcg") return;
    state.mode = mode;
    refresh();
    run(false);
  }

  function setParam(key, value) {
    const n = num(value, state[key]);
    if (key === "seed") state.seed = Math.max(0, Math.min(4294967295, Math.round(n))) >>> 0;
    else if (key === "memoryKiB") state.memoryKiB = Math.min(2048, Math.max(64, Math.round(n / 64) * 64));
    else if (key === "iterations") state.iterations = Math.min(6, Math.max(1, Math.round(n)));
    else if (key === "parallelism") state.parallelism = Math.min(4, Math.max(1, Math.round(n)));
    else if (key === "plaintextLen") state.plaintextLen = Math.min(256, Math.max(16, Math.round(n / 16) * 16));
    else return;
    /* Não reconstrói o painel aqui: o slider continua sob o ponteiro durante o arraste. */
    const outId = { seed: "cryptoSeedOut", memoryKiB: "cryptoMemOut", iterations: "cryptoTOut",
      parallelism: "cryptoPOut", plaintextLen: "cryptoLenOut" }[key];
    const out = (typeof document !== "undefined") ? document.getElementById(outId) : null;
    if (out) out.textContent = String(state[key]);
    if (key === "plaintextLen") renderVault();
    else run(false);
  }

  function run(record = true) {
    const generated = makeBytes();
    state.bytes = generated.bytes;
    const h = entropy(String.fromCharCode(...state.bytes));
    state.lastRun = {
      at: new Date().toISOString(), mode: state.mode, source: generated.source,
      entropy: Number(h.toFixed(3)), unique: new Set(state.bytes).size,
      memoryKiB: state.memoryKiB, iterations: state.iterations,
      parallelism: state.parallelism, bytes: state.bytes.slice(0, 8)
    };
    if (typeof Storage !== "undefined") {
      if (typeof Storage.updateCryptoLabState === "function") Storage.updateCryptoLabState(state.lastRun);
      if (record && typeof Storage.logSimulator === "function") Storage.logSimulator("crypto", `${generated.source}: H=${h.toFixed(2)} bits/símbolo`);
    }
    draw(state.bytes);
    updateMetrics();
    return state.lastRun;
  }

  if (typeof window !== "undefined") {
    window.CryptoSim = {
      state, pageHTML, renderPage, refresh, setMode, setParam, run,
      vaultFields, entropy, entropyOf, makeBytes, renderByteInspection
    };
  }
})();

/* ============================================================
   FORGE 4.0 — utils-math.js
   Primitivas determinísticas compartilhadas: FNV-1a 32-bit,
   LCG (a=1664525, c=1013904223, m=2³²) e entropia de Shannon.
   Nenhuma dependência externa: funciona em file://, Node (vm) e browser.
   ============================================================ */

(function (root) {
  "use strict";

  const FNV_OFFSET = 2166136261;
  const FNV_PRIME = 16777619;
  const LCG_A = 1664525;
  const LCG_C = 1013904223;
  const TWO_32 = 4294967296;

  /** Hash FNV-1a de 32 bits. Idêntico ao usado por exercises.js. */
  function fnv1a32(value) {
    let h = FNV_OFFSET >>> 0;
    const str = String(value == null ? "" : value);
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, FNV_PRIME) >>> 0;
    }
    return h >>> 0;
  }

  /** Próximo estado do LCG. Aceita qualquer número e devolve uint32. */
  function lcgNext(seed) {
    return (Math.imul(Number(seed) >>> 0, LCG_A) + LCG_C) >>> 0;
  }

  /** Gerador determinístico: mesma semente ⇒ mesma sequência, sempre. */
  function lcgSequence(seed, count) {
    let x = Number(seed) >>> 0;
    const n = Math.max(0, Number(count) || 0);
    const out = new Array(n);
    for (let i = 0; i < n; i++) {
      x = lcgNext(x);
      out[i] = x;
    }
    return out;
  }

  /** Float uniforme em [0,1) derivado do LCG — útil para visualizações. */
  function lcgFloat(seed) {
    return lcgNext(seed) / TWO_32;
  }

  /** Semente estável para um par (userId, identificador de aula/questão). */
  function seedFor(userId, key) {
    return fnv1a32(`${String(userId || "")}|${String(key || "")}`);
  }

  /** Entropia de Shannon em bits por símbolo (base 2). */
  function shannonEntropy(text) {
    const str = String(text || "");
    if (!str.length) return 0;
    const freq = new Map();
    for (const ch of str) freq.set(ch, (freq.get(ch) || 0) + 1);
    let h = 0;
    for (const count of freq.values()) {
      const p = count / str.length;
      h -= p * Math.log2(p);
    }
    return h;
  }

  /** Entropia total aproximada da string (bits por símbolo × comprimento). */
  function passwordEntropy(text) {
    const str = String(text || "");
    return shannonEntropy(str) * str.length;
  }

  const api = {
    FNV_OFFSET, FNV_PRIME, LCG_A, LCG_C, TWO_32,
    fnv1a32, lcgNext, lcgSequence, lcgFloat, seedFor,
    shannonEntropy, passwordEntropy
  };

  root.ForgeMathUtils = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);

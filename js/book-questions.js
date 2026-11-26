/* ============================================================
   FORGE — book-questions.js
   Geração LOCAL e transparente de questões a partir de texto real
   extraído por PDF.js. Sem IA externa, sem API paga, sem inventar
   citações: toda questão guarda página, capítulo e trecho de origem.
   ============================================================ */

(function (global) {
  "use strict";

  const STOP = new Set(("a as o os um uma uns umas e em de do da dos das por para com sem sobre " +
    "sob que qual quais quem cujo cuja como quando onde porque pois já mais menos muito sua seu " +
    "seus suas meu minha meus minhas nosso nossa nossos nossas esta este estes estas esse essa " +
    "esses essas aquele aquela aqueles aquelas é são era eram será serão foi foram no na nos nas " +
    "ao aos às pelo pela pelos pelas se não sim mas ou nem só também ainda aqui ali entre após " +
    "antes durante desde até contra através segundo conforme cada todo toda todos todas outro " +
    "outra outros outras tal tais qual quais　the and for with that this from into their its are").split(/\s+/));

  function norm(value) {
    return String(value == null ? "" : value).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  }

  function clip(text, max) {
    const s = String(text || "").replace(/\s+/g, " ").trim();
    return s.length > (max || 180) ? s.slice(0, max || 180).trim() + "…" : s;
  }

  function sentencesOf(text) {
    return String(text || "").replace(/\s+/g, " ")
      .split(/(?<=[.!?])\s+(?=[A-ZÀ-ÉÍÓÚ0-9])/)
      .map(s => s.trim())
      .filter(s => s.length >= 35);
  }

  function termsOf(text, n) {
    const counts = new Map();
    (String(text || "").toLowerCase().match(/[a-zà-ÿ]{5,}/g) || []).forEach(word => {
      if (STOP.has(word)) return;
      counts.set(word, (counts.get(word) || 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, n || 8).map(x => x[0]);
  }

  /* ---------------- capítulos ---------------- */

  function detectChapters(pages) {
    const list = Array.isArray(pages) ? pages : [];
    const chapters = [];
    const push = (title, page) => {
      const last = chapters[chapters.length - 1];
      if (last) last.endPage = Math.max(last.startPage, page - 1);
      chapters.push({ index: chapters.length, title: clip(title, 90), startPage: page, endPage: page });
    };
    const patterns = [
      /(?:capitulo|capítulo|chapter|secao|seção|section)\s+[\dIVXLC]+[^\n.!?]{0,80}/i,
      /^\d+(?:\.\d+){0,3}\s+[A-Za-zÀ-ÿ][^\n.!?]{3,80}/,
      /\b[A-ZÀ-ÉÍÓÚ][A-ZÀ-ÉÍÓÚ\s]{6,50}\b/
    ];
    list.forEach(entry => {
      const page = Number(entry.page) || 1;
      const text = String(entry.text || "");
      sentencesOf(text).slice(0, 12).forEach(sentence => {
        const head = clip(sentence, 120);
        if (patterns.some(re => re.test(head)) && head.length < 95) push(head, page);
      });
    });
    if (!chapters.length) chapters.push({ index: 0, title: "Conteúdo extraído", startPage: 1, endPage: list.length || 1 });
    else chapters[chapters.length - 1].endPage = list.length ? Number(list[list.length - 1].page) : chapters[chapters.length - 1].startPage;
    return chapters;
  }

  function rangeOf(pages, opts) {
    const o = opts || {};
    let out = (pages || []).filter(p => p && String(p.text || "").trim().length >= 35);
    if (o.chapterIndex != null && o.chapterIndex !== "" && o.chapters && o.chapters[o.chapterIndex]) {
      const c = o.chapters[Number(o.chapterIndex)];
      out = out.filter(p => p.page >= c.startPage && p.page <= c.endPage);
    }
    const from = Number(o.fromPage) || 0;
    const to = Number(o.toPage) || 0;
    if (from) out = out.filter(p => p.page >= from);
    if (to) out = out.filter(p => p.page <= to);
    return out;
  }

  function chapterForPage(chapters, page) {
    const found = (chapters || []).find(c => page >= c.startPage && page <= c.endPage);
    return found ? found.title : "Conteúdo extraído";
  }

  /* ---------------- geração ---------------- */

  const TYPES = ["mc", "tf", "interpretation", "concept", "application", "discursive"];

  function generate(opts) {
    const o = opts || {};
    const pages = rangeOf(o.pages, o);
    const units = [];
    pages.forEach(p => sentencesOf(p.text).forEach(s => units.push({ text: s, page: p.page })));
    if (units.length < 2) return { questions: [], error: "Texto insuficiente: extraia mais páginas com texto selecionável." };

    const wantedTypes = Array.isArray(o.types) && o.types.length ? o.types.filter(t => TYPES.includes(t)) : ["mc", "tf", "concept"];
    const count = Math.max(1, Math.min(20, Number(o.count) || 5));
    const difficulty = ["easy", "medium", "hard"].includes(o.difficulty) ? o.difficulty : "medium";
    const mode = o.mode === "simulado" ? "simulado" : "estudo";
    const allTerms = termsOf(units.map(u => u.text).join(" "), 20);
    const questions = [];

    for (let i = 0; i < count; i++) {
      const unit = units[i % units.length];
      const type = wantedTypes[i % wantedTypes.length];
      const terms = termsOf(unit.text, 6).concat(allTerms.filter(t => !unit.text.toLowerCase().includes(t)));
      const term = terms[i % Math.max(1, terms.length)] || allTerms[0] || "conceito";
      const quote = clip(unit.text, 220);
      const source = { page: unit.page, chapter: chapterForPage(o.chapters, unit.page), quote, altered: false };
      const base = {
        id: `q${Date.now().toString(36)}-${i}`,
        type, difficulty, mode, source,
        prompt: "", options: null, answerIndex: null, answer: null,
        modelAnswer: quote, rubric: "", autoGradable: false
      };

      if (type === "mc") {
        const distractors = units.filter(u => u.page !== unit.page && norm(u.text) !== norm(unit.text))
          .slice(i * 2, i * 2 + 3).map(u => clip(u.text, 150));
        while (distractors.length < 3) distractors.push(clip(units[(i + distractors.length + 1) % units.length].text, 150));
        const correct = clip(unit.text, 150);
        const options = [correct, ...distractors.slice(0, 3)];
        let seed = ((i + 1) * 2654435761) >>> 0;
        const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
        for (let j = options.length - 1; j > 0; j--) {
          const k = Math.floor(rnd() * (j + 1));
          const t = options[j]; options[j] = options[k]; options[k] = t;
        }
        questions.push({
          ...base,
          prompt: `Qual afirmação corresponde ao trecho extraído da página ${unit.page}?`,
          options, answerIndex: options.indexOf(correct), autoGradable: true
        });
      } else if (type === "tf") {
        const makeFalse = i % 2 === 1 || difficulty === "hard";
        const replacement = allTerms[(i + 3) % Math.max(1, allTerms.length)] || term;
        let statement = unit.text;
        let altered = false;
        if (makeFalse && norm(replacement) !== norm(term)) {
          const re = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
          if (re.test(statement)) { statement = statement.replace(re, replacement); altered = true; }
        }
        questions.push({
          ...base,
          prompt: `O enunciado abaixo ${altered ? "foi alterado localmente para testar sua leitura" : "foi extraído do material"}. Ele é Verdadeiro ou Falso?\n\n“${clip(statement, 220)}”`,
          options: ["Verdadeiro", "Falso"], answer: altered ? "falso" : "verdadeiro",
          source: { ...source, altered }, autoGradable: true,
          modelAnswer: quote
        });
      } else if (type === "interpretation") {
        questions.push({ ...base, prompt: `Com base no trecho da página ${unit.page}, o que o autor afirma sobre “${term}”? Responda com suas palavras.`, autoGradable: false });
      } else if (type === "concept") {
        questions.push({ ...base, prompt: `No trecho da página ${unit.page}, como o conceito “${term}” é empregado?`, autoGradable: false });
      } else if (type === "application") {
        questions.push({
          ...base,
          prompt: `O trecho da página ${unit.page} apresenta: “${quote}”. Descreva uma situação prática diferente do livro onde essa ideia se aplicaria.`,
          rubric: "1) usa a ideia do trecho; 2) explica a aplicação em outro contexto; 3) aponta um limite ou condição; 4) não inventa dado ausente na fonte.",
          autoGradable: false
        });
      } else {
        questions.push({
          ...base,
          prompt: `Discorra sobre “${term}” considerando o trecho da página ${unit.page}.`,
          rubric: "1) retoma o trecho citado; 2) distingue o que o texto diz da sua interpretação; 3) apresenta exemplo próprio; 4) registra uma dúvida ou limitação.",
          autoGradable: false
        });
      }
      if (difficulty === "hard" && questions[questions.length - 1].rubric) {
        questions[questions.length - 1].rubric += " 5) justifica por que a resposta não contradiz a fonte.";
      }
    }
    return { questions, error: "" };
  }

  /* ---------------- correção ---------------- */

  function grade(question, userAnswer) {
    const q = question || {};
    const answer = String(userAnswer == null ? "" : userAnswer).trim();
    const reference = `p. ${q.source && q.source.page || "?"} · ${q.source && q.source.chapter || "Conteúdo extraído"}`;
    if (!answer) return { correct: false, status: "sem-resposta", explanation: "Nenhuma resposta registrada.", reference };
    if (q.type === "mc") {
      const idx = Number(answer);
      const correct = idx === Number(q.answerIndex);
      return {
        correct, status: "automatica",
        explanation: correct ? "A opção escolhida reproduz o trecho extraído da fonte." : `A opção correta é a que reproduz o trecho: “${clip(q.modelAnswer, 180)}”.`,
        reference
      };
    }
    if (q.type === "tf") {
      const v = norm(answer);
      const escolha = /verdadeiro|^v$|^true$|^t$/.test(v) ? "verdadeiro" : /falso|^f$|^false$/.test(v) ? "falso" : "";
      if (!escolha) return { correct: false, status: "automatica", explanation: "Escolha Verdadeiro ou Falso.", reference };
      const correct = escolha === q.answer;
      return {
        correct, status: "automatica",
        explanation: correct ? "Classificação correta com base no trecho citado." :
          `A fonte diz: “${clip(q.modelAnswer, 180)}”. ${q.source && q.source.altered ? "O enunciado continha termo substituído localmente." : ""}`,
        reference
      };
    }
    if (answer.length < 20) return { correct: null, status: "incompleta", explanation: "Escreva ao menos 20 caracteres para permitir a autoavaliação.", reference };
    return {
      correct: null, status: "autoavaliacao",
      explanation: `Resposta de referência extraída da fonte: “${clip(q.modelAnswer, 220)}”. Compare com a sua resposta; o FORGE não finge ter corrigido texto livre automaticamente.`,
      rubric: q.rubric || "1) usa o trecho da fonte; 2) distingue citação de interpretação; 3) não inventa informações; 4) registra dúvida.",
      reference
    };
  }

  global.BookQuestions = Object.freeze({
    TYPES: Object.freeze(TYPES.slice()), norm, clip, sentencesOf, termsOf,
    detectChapters, generate, grade
  });
})(window);

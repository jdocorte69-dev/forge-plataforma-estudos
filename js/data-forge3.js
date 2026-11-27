/* ============================================================
   FORGE — data-forge3.js
   Helper pedagógico das 5 Camadas da Gênese (FORGE 3.0).
   Todas as aulas novas usam G5(): problema real → impasse →
   salto de intuição → formalização → teste de Feynman.
   ============================================================ */

function G5(spec) {
  const s = spec || {};
  const layers = [
    ["Problema Real", s.problem || ""],
    ["Impasse", s.impasse || ""],
    ["Salto de Intuição", s.insight || ""],
    ["Formalização", s.formal || ""],
    ["Teste de Feynman", s.feynman || ""]
  ];
  const lesson = L(
    s.title || "Aula FORGE 3.0",
    s.problem || "",
    s.prereq || "Conceitos introdutórios da própria trilha.",
    s.insight || "",
    s.formal || "",
    s.facts || [],
    Object.assign({
      ex: s.examples || [[ "Aplicação imediata", s.feynman || s.insight || "" ]],
      er: s.errors || [],
      lab: s.lab || "Aplique o conceito no simulador desta trilha e registre o que observou.",
      ref: s.ref || "Consulte a biblioteca interna e a documentação oficial do tema.",
      derivation: s.formal || "",
      workedExamples: s.examples || [],
      recallQuestions: s.feynman ? [s.feynman] : [],
      masteryCriteria: [
        "Explica o problema sem jargão e identifica o gargalo da solução ingênua.",
        "Reconhece a ideia central e a representa com símbolos ou código.",
        "Resolve ao menos 8 de 10 questões e escreve uma síntese Feynman ≥ 30 caracteres."
      ],
      tags: s.tags || ["forge3"],
      estimatedEffort: Number(s.effort) || 12
    }, s.opts || {})
  );
  lesson.genesis = layers.map(([label, text], i) => ({
    step: i + 1,
    label,
    text
  }));
  lesson.feynmanPrompt = s.feynman || "";
  lesson.phase3 = true;
  return lesson;
}

// As trilhas 10–12 usam uma forma compacta: cada aula é um array
// [título, problema, impasse, intuição, formalização, Feynman, fatos, opções].
// Normalizamos essa tupla para o mesmo objeto G5 usado pelas aulas detalhadas.
function normalizeG5(spec) {
  if (!Array.isArray(spec)) return spec || {};
  const [title, problem, impasse, insight, formal, feynman, facts, opts] = spec;
  return Object.assign({ title, problem, impasse, insight, formal, feynman, facts }, opts || {});
}

// Constrói um módulo completo a partir de uma lista de especificações G5.
function GM(name, lessons) {
  return { name, lessons: (lessons || []).map(spec => G5(normalizeG5(spec))) };
}

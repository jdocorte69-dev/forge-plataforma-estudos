/* ============================================================
   FORGE 4.0 — build-summaries-index.mjs
   Gera js/data-summaries-index.js a partir dos 233 resumos limpos
   já existentes em saida/02_resumos_por_livro/. Não reprocessa
   PDFs, não faz OCR e não inventa metadados: títulos e autores
   vêm de saida/00_inventario/manifest.json.
   Uso: node scripts/build-summaries-index.mjs
   ============================================================ */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(ROOT, "saida", "02_resumos_por_livro");
const MANIFEST = path.join(ROOT, "saida", "00_inventario", "manifest.json");
const OUT = path.join(ROOT, "js", "data-summaries-index.js");

/* Trajetória declarada em saida/00_inventario/inventario.md. */
const ORDER = [
  "O_Algebrista", "FME_1", "FME_2", "FME_3", "FME_4", "FME_5",
  "FME_7", "FME_9", "FME_10", "FME_11", "TQM_Fundamental",
  "TQM_Medio", "Morgado_Combinatoria"
];

function bookFromManifest(slug, books) {
  if (slug === "O_Algebrista") return books.find(b => /O Algebrista\.pdf$/i.test(b.arquivo));
  if (slug === "TQM_Fundamental") return books.find(b => /TQM \(Ensino Fundamental\)/i.test(b.arquivo));
  if (slug === "TQM_Medio") return books.find(b => /TQM \(Ensino Médio\)/i.test(b.arquivo));
  if (slug === "Morgado_Combinatoria") return books.find(b => /Análise combinatória/i.test(b.arquivo));
  const match = /^FME_(\d+)$/.exec(slug);
  if (match) return books.find(b => new RegExp(`(?:^|/)FME ${match[1]} -`, "i").test(b.arquivo));
  return null;
}

function normalizeMath(value) {
  /* Defensivo: os resumos já usam Unicode. Converte apenas resíduos de LaTeX. */
  return String(value || "")
    .replace(/\\mathbb\{([A-Z])\}/g, (_, c) => ({ N: "ℕ", Z: "ℤ", Q: "ℚ", R: "ℝ", C: "ℂ" })[c] || c)
    .replace(/\\times/g, "×").replace(/\\cdot/g, "·").replace(/\\pm/g, "±")
    .replace(/\\Rightarrow/g, "⇒").replace(/\\Rightarrow/g, "⇒").replace(/\\rightarrow/g, "→")
    .replace(/\\le/g, "≤").replace(/\\ge/g, "≥").replace(/\\ne/g, "≠")
    .replace(/\\sqrt\{([^}]*)\}/g, "√$1").replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "$1/$2")
    .replace(/\\([A-Za-z]+)/g, "$1").replace(/\$/g, "").trim();
}

function parseSummary(text, fallbackTitle) {
  const first = String(text).split(/\r?\n/).find(l => /^#\s+/.test(l)) || "";
  let title = first.replace(/^#\s+/, "").replace(/^Resumo (?:de Domínio|Geral)\s*(?:[-—–:]\s*)?/i, "").trim();
  if (/^Capítulo\s+\d+\s*:/i.test(title)) title = title.replace(/^Capítulo\s+\d+\s*:\s*/i, "");
  title = normalizeMath(title) || fallbackTitle;
  const themeLine = String(text).split(/\r?\n/).find(l => /Tema mapeado:/.test(l)) || "";
  const theme = normalizeMath((themeLine.match(/`([^`]+)`/) || [])[1] || "geral");
  /* Cabeçalhos OCR às vezes viram ruído ("a a O"). Nesse caso, o tema mapeado
     é uma descrição honesta e legível do conteúdo, sem inventar informação. */
  const titleWords = title.split(/\s+/).filter(Boolean);
  if (!titleWords.some(w => w.length >= 3 && /[aeiouáéíóúâêôãõ]/i.test(w))) {
    title = normalizeMath(fallbackTitle) + " — " + theme.replace(/_/g, " ");
  }
  const generated = (String(text).match(/Gerado em:\s*([^\n]+)/) || [])[1] || "";
  const words = (String(text).match(/\S+/g) || []).length;
  return { title: title.slice(0, 140), theme, generated: generated.trim(), words, chars: String(text).length };
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const books = manifest.livros || [];
const output = [];

for (const slug of ORDER) {
  const dir = path.join(SOURCE, slug);
  if (!fs.existsSync(dir)) continue;
  const meta = bookFromManifest(slug, books) || {};
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".md")).sort((a, b) => {
    const na = /^cap(\d+)/.exec(a), nb = /^cap(\d+)/.exec(b);
    if (na && nb) return Number(na[1]) - Number(nb[1]);
    if (na) return -1;
    if (nb) return 1;
    return a.localeCompare(b, "pt-BR");
  });

  const chapters = files.map(file => {
    const text = fs.readFileSync(path.join(dir, file), "utf8");
    const numberMatch = /^cap(\d+)\.md$/.exec(file);
    const n = numberMatch ? Number(numberMatch[1]) : 0;
    const parsed = parseSummary(text, n ? `Capítulo ${n}` : "Visão geral");
    return {
      id: `${slug}/${file.replace(/\.md$/, "")}`,
      n,
      kind: n ? "chapter" : "overview",
      title: parsed.title,
      theme: parsed.theme,
      words: parsed.words,
      chars: parsed.chars,
      generated: parsed.generated,
      path: `saida/02_resumos_por_livro/${slug}/${file}`
    };
  });

  output.push({
    slug,
    title: normalizeMath(meta.titulo || slug),
    author: String(meta.autores || "Autor não informado no inventário"),
    level: String(meta.nivel || "—"),
    area: String(meta.area || "Matemática"),
    pages: Number(meta.paginas) || 0,
    chapters
  });
}

const data = {
  schema: 1,
  generatedAt: new Date().toISOString(),
  source: "saida/02_resumos_por_livro",
  provenance: "saida/00_inventario/manifest.json",
  note: "Metadados indexados; o corpo markdown é carregado sob demanda, sem re-OCR.",
  totalBooks: output.length,
  totalSummaries: output.reduce((sum, b) => sum + b.chapters.length, 0),
  books: output
};

const header = `/* GERADO por scripts/build-summaries-index.mjs — não editar manualmente.
   ${data.totalBooks} livros · ${data.totalSummaries} resumos · fonte local. */
window.FORGE_SUMMARIES_INDEX = `;
/* JSON compacto: este arquivo entra no caminho de carregamento inicial.
   A formatação legível não agrega valor e custa parsing e bytes. */
fs.writeFileSync(OUT, header + JSON.stringify(data) + ";\n", "utf8");

/* O service worker importa este arquivo para precachear os 233 markdowns. */
const SW_OUT = path.join(ROOT, "sw-summaries.js");
const paths = output.flatMap(book => book.chapters.map(chapter => "./" + chapter.path));
fs.writeFileSync(SW_OUT,
  `/* GERADO por scripts/build-summaries-index.mjs — não editar manualmente.\n` +
  `   ${paths.length} resumos locais para precache do service worker. */\n` +
  `const SUMMARY_MANIFEST = ${JSON.stringify(paths, null, 2)};\n`, "utf8");
console.log(`Índice gravado: ${OUT} — ${data.totalBooks} livros, ${data.totalSummaries} resumos, ${(fs.statSync(OUT).size / 1024).toFixed(1)} KiB`);
console.log(`Manifesto SW gravado: ${SW_OUT} — ${paths.length} arquivos, ${(fs.statSync(SW_OUT).size / 1024).toFixed(1)} KiB`);

# FORGE 2.0 — Inventário e progresso da expansão

## Backup

- `D:\João\Desktop\ESTUDOS_BACKUP_v2_20261124_224628` (16 arquivos, estado antes da expansão).

## Inventário do projeto original (auditoria)

| Arquivo | Papel |
|---|---|
| `index.html` | Shell HTML; carregava KaTeX e 10 scripts via `defer` em ordem explícita. |
| `css/style.css` | Temas claro/escuro, layout, responsividade (1024/900/640/560px), acessibilidade, print. |
| `js/data.js` | Helpers `buildQuestions(facts, extra)` e `L(title,obj,prereq,intuition,explain,facts,opts)`; `CURRICULUM`, `LIBRARY`, `PROJECTS`, `FLASHCARDS`. |
| `js/data-linux.js` | `CURRICULUM.linux` — 4 módulos, 14 aulas. |
| `js/data-c.js` | `CURRICULUM.c` — 3 módulos, 12 aulas. |
| `js/data-math.js` / `data-math2.js` | `CURRICULUM.math` — 5 módulos, 27 aulas. |
| `js/data-software.js` | `CURRICULUM.software` — 4 módulos, 13 aulas. |
| `js/storage.js` | `Storage.*`: get/save/load/reset, setTheme, export/import, streak, addHours, timer sessions, mental history. Chave `forge.study.v2`, migração v1→v2. |
| `js/exercises.js` | `Exercises.*`: gradeLesson, SM-2, placement, cumulative exams, search. |
| `js/app.js` | Renderizador das 9 páginas, terminal simulado (30+ comandos), modais, atalhos, KaTeX. |
| `js/features.js` | `Features.*`: timer, placement, provas, cálculo mental, calculadora, gráficos Canvas. |
| `manifest.webmanifest`, `icon.svg`, `sw.js` | PWA instalável e cache offline (18 recursos na versão original). |
| `AUDITORIA.md` | Auditoria anterior: 66 aulas, 660 questões, axe 0 violações, Lighthouse 100/100/100. |

### Estado global atual

`state`: `version, done[], mistakes[], cards{}, hours, weeklyGoal, theme, streak, lastStudyDate, feynman{}, labDone[], timerSessions[], mentalHistory[], plan{}, assessments[], focus{}` (conferir `defaultState()` em `storage.js` antes de estender). Chaves novas têm valor padrão e preservam dados v2 existentes.

### Pontos de extensão

- Novas trilhas: criar `CURRICULUM.<chave>` em novo arquivo `data-*.js` e incluir o script no `index.html` **antes** de `app.js`.
- Novas páginas: adicionar `<button data-page="...">` no `<nav>`, entrada no `titleMap` e renderer em `app.js`.
- Novos recursos: expor objeto global em novo `js/*.js` carregado depois de `app.js` (namespace próprio, ex.: `window.Focus`).

---

## Plano de execução e status

Legenda: `[ ]` pendente · `[~]` em andamento · `[x]` concluído

### Etapa 0 — Auditoria e backup
- [x] Backup integral fora da árvore do projeto
- [x] Inventário de arquivos, globals e formatos de dados
- [x] `PROGRESSO.md` criado

### Etapa 1 — Modo foco e microaprendizagem (prioridade máxima)
- [x] Modo foco com uma única tarefa, timer, pausa/continuar, blocos 5/10/15/25 min
- [x] Aula em 8 etapas curtas, com "aprofundar" expandível
- [x] Checklist de sessão, meta diária/semanal, retomada, histórico
- [x] Preferência "reduzir animações" e sem sons

### Etapa 2 — Motivação
- [x] XP, níveis, conquistas, medalhas, mapa de evolução, estatísticas semanais

### Etapa 3 — Identidade visual
- [x] Cores e capas por disciplina, ícones consistentes
- [x] Transições discretas, skeletons/loading, mensagens de conclusão, notificações

### Etapa 4 — Matemática (A→I)
- [x] Fundamentos — 25 aulas (trilha `mathfund`)
- [x] Pré-álgebra, álgebra, funções e pré-cálculo
- [x] Cálculo I, II e III
- [x] Álgebra linear
- [x] Matemática discreta — 14 aulas
- [x] Probabilidade e estatística

### Etapa 5 — Ciência da Computação e sistemas
- [x] Programação / algoritmos / estruturas — 12 aulas
- [x] Linguagem C avançada
- [x] Sistemas operacionais e arquitetura — 18 aulas
- [x] Banco de dados — 18 aulas

### Etapa 6 — Redes de computadores
- [x] Fundamentos, modelos e protocolos
- [x] Tópicos avançados
- [x] Laboratórios de redes (subnetting, DNS, encapsulamento)

### Etapa 7 — Engenharia de Software (expansão)
- [x] Módulos adicionais de arquitetura, qualidade e entrega

### Etapa 8 — Biblioteca universitária estruturada + rotas de leitura
- [x] 48 recursos, filtro por disciplina, busca e 5 rotas de leitura

### Etapa 9 — Laboratórios interativos adicionais
- [x] IPv4, DNS, encapsulamento, SQL e modelagem relacional

### Etapa 10 — Avaliação e domínio por assunto
- [x] Registro de melhor nota/attempts por aula e prova por disciplina

### Etapa 11 — Projetos integradores progressivos
- [x] 10 projetos em três níveis com entregáveis marcaráveis

### Etapa 12 — "Meu plano de formação"
- [x] Metas, ritmo, prazo, marcos, aulas personalizadas e painel de domínio

### Etapa 13 — Testes e documentação final
- [x] `node --check` em 19 arquivos JS
- [x] Smoke test no navegador (11 páginas, foco, plan, labs, biblioteca, provas)
- [x] axe-core: 0 violações (claro/escuro, 6 labs e modal)
- [x] Lighthouse 100/100/100, 0 erros no console
- [x] Cache PWA verificado (31 URLs, nenhum recurso local ausente)
- [x] `AUDITORIA.md` atualizado

---

## Números finais

29 módulos · 189 aulas · 1.890 questões · 48 recursos na biblioteca · 5 rotas de leitura · 10 projetos · 80 flashcards · 0 violações axe · Lighthouse 100/100/100 · 0 erros no console.

## Regras de qualidade (não negociáveis)

- Nenhuma aula vazia: toda aula gerada com objetivo, pré-requisito, intuição, explicação, exemplos, erros comuns, lab, referência e 10 questões via `L()`/`buildQuestions`.
- Referências bibliográficas apenas com fontes verificáveis (editoras, OpenStax, MIT OCW, man7.org etc.). Nenhuma página/capítulo inventado.
- Simulações sempre identificadas como tal; execução real indicada explicitamente.
- Preservar `localStorage` existente: toda nova chave do estado com valor padrão e migração versionada.
- Acessibilidade WCAG 2.2 AA e 0 erros no console ao final.

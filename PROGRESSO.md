# FORGE 2.0 — Inventário e progresso da expansão

## Backup

- `D:\João\Desktop\ESTUDOS_BACKUP_v2_20261124_224628` (16 arquivos, estado antes da expansão).
- `backup/pre-fase1-2026-11-25` (29 arquivos, estado antes da integração da Enciclopédia Mestra).

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

`state` (v3): `version, done[], mistakes[], cards{}, hours, weeklyGoal, theme, streak, lastStudyDate, feynman{}, labDone[], timerSessions[], mentalHistory[], plan{}, assessments[], mastery{}, labEvidence{}, resourceMeta{}, assessmentLog[], xp, level, xpLog[], feynmanAwarded{}, shieldUsedWeek, tmvDoneToday, tmvDate, pomodoros, pomodoroLog[], redoStreak, rewards{}, settings{}` (conferir `defaultState()` em `storage.js` antes de estender). Chaves novas têm valor padrão; migração v1/v2 → v3 preserva 100% dos dados e grava backup em `forge.study.v2.lastBackup`.

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

### Etapa 11b — Seção 11 da Enciclopédia (gamificação e apoio anti-paralisia)
- [x] Gamificação: XP/nível, escudo semanal, TMV (+15 XP/dia), Pomodoro no painel (+20 XP/bloco, +10 a cada 3 blocos), recompensas por aula/Feynman/lab
- [x] Caderno de erros com taxonomia E1–E4, categoria, `nextReview` (7/30 dias, +1 no erro) e refazimento
- [x] Biblioteca com filtros de área (12) e nível (8); 72 recursos no total
- [x] Diagnóstico de redes (`net-diagnostico`) e 5 labs Wireshark (HTTP, DNS, TCP, IP, ARP)
- [x] `gamification.js` carregado após `app.js` e antes de `features.js`; incluído no APP_SHELL do service worker
- [x] Smoke test: zero erros no console, 189 aulas/29 módulos preservados; Lighthouse 100/100/100

### Etapa 14 — Fase 0 do plano da Enciclopédia Mestra (25/11/2026)
- [x] Plano em 11 fases escrito em `PLANO_IMPLEMENTACAO_ENCICLOPEDIA.md` (D1–D6 aceitos por recomendação)
- [x] Backup integral (`backup/pre-fase1-2026-11-25`, 29 arquivos)
- [x] Smoke test completo da Seção 11 (TMV, Pomodoro, E1–E4, filtros, labs, widgets) — 0 erros no console
- [x] Correção de contraste dos pills `.info`/`.success` (WCAG AA) em claro e escuro
- [x] Lighthouse: acessibilidade 1.0, boas práticas 1.0, SEO 1.0; 0 falhas
- [x] `AUDITORIA.md` e `PROGRESSO.md` atualizados
- [x] Verificação dos 31 links da seção 19 (2 já verificados no documento): 29 com HTTP 200, 1 DOI inexistente corrigido (`10.1177/1529100612453266`), 1 DOI da SAGE confirmado por leitura da citação (anti-bot); `verifiedAt` preenchido em 29 recursos da biblioteca rica; detalhes em `AUDITORIA.md`

### Etapa 15 — Fase 1 do plano: schema de dados e migração v3 (25/11/2026)
- [x] `CURRENT_VERSION = 3` mantendo a chave `forge.study.v2` (zero perda de dados)
- [x] Novos espaços no estado: `mastery{}`, `labEvidence{}`, `resourceMeta{}`, `assessmentLog[]`
- [x] `backupState()` automático antes de migrar/importar (`forge.study.v2.lastBackup`)
- [x] `importData()` valida versão (1–3), rejeita versões futuras e formatos inválidos sem alterar o estado
- [x] `normalizeState()` não rebaixa estados de versão futura e normaliza arrays/objetos legados
- [x] `L()` estendido com `definitions`, `commonMistakes`, `derivation`, `workedExamples`, `recallQuestions`, `masteryCriteria`, `tags`, `estimatedEffort` — 189 aulas intactas
- [x] Teste de migração v2 → v3: done/mistakes/xp/labDone/plan/focus preservados, backup v2 gravado
- [x] `node --check` 21/21, 0 erros no console, Lighthouse 100/100/100

### Etapa 16 — Integração completa da Enciclopédia Mestra (25/11/2026)
- [x] Conteúdo: Matemática M12–M19 adicionados, C C9–C15 + complexidade + lab, Redes R4–R12, seções de Linux 8.6–8.9, trilha `security` (8 módulos) e apêndice de sistemas — total efetivo: 71 módulos / 385 aulas (ver tabela em `AUDITORIA.md`)
- [x] Trilha `security` criada e registrada no currículo (9 trilhas no total)
- [x] 56 labs com esquema de 15 campos em `data-labs-a.js` (29: Matemática/C) e `data-labs-b.js` (27: Redes/Linux/Engenharia)
- [x] Biblioteca rica: 43 recursos adicionais (`data-library-extra.js`) → 110 recursos, 8 filtros, 34 termos de glossário e busca global (`Ctrl+K`/`Esc`)
- [x] `mastery.js`: rubrica 8/10, selo por domínio, 10 indicadores no painel, bloco de domínio na aula e registro em `mastery`/`assessmentLog`
- [x] `labs-catalog.js`: catálogo com 3 tipos de execução, modal de evidência e regras de segurança explícitas
- [x] `library-rich.js`: filtros combináveis, notas/avaliações em `resourceMeta`, glossário e `GlobalSearch`
- [x] `index.html`: 9 tags de script novas, 6 botões de navegação novos, botão de busca no cabeçalho, skip link e `<main tabindex="-1">`
- [x] `sw.js`: `forge-v4`, APP_SHELL com 32 scripts locais (38 URLs), offline verificado com service worker controlando a página
- [x] `app.js`: páginas `domain`, `richlib`, `glossary`, `catalog`, aba do catálogo em labs e portfólio P0–P10 com 5 integradores preservando `labDone`
- [x] `css/style.css`: indicadores, mapa de domínio, calendário, cards de lab, resultados de busca, glossário, `:focus-visible`, skip link e movimento reduzido
- [x] `aria-current="page"` no botão ativo da navegação; 0 controles sem nome nas 15 páginas
- [x] Correção de marcadores `__CONTINUA__` deixados por geradores de conteúdo (C e redes) — `node --check` 32/32
- [x] Smoke test final: 385 aulas, 71 módulos, 9 trilhas, 3.850 questões, 56 labs, 110 recursos, 34 termos, 10 indicadores; **0 erros no console**
- [x] Exportar → importar preserva 14 chaves, incluindo os 4 espaços v3 e toda a gamificação
- [x] axe-core WCAG 2.2 AA: 30 auditorias (15 páginas × claro/escuro), 0 violações
- [x] Lighthouse: acessibilidade 1.0, boas práticas 1.0, SEO 1.0; 0 falhas
- [x] `AUDITORIA.md` e `PROGRESSO.md` atualizados com o estado final

### Etapa 17 — Lacunas do Plano Mestre Unificado v3.0 (25/11/2026)
- [x] Auditoria de lacunas (não reimplementação): o workspace já é o alvo v3 modular descrito pelo plano; a base v2 de 9 aulas não existe aqui
- [x] Embaralhamento determinístico das alternativas (FNV-1a + LCG) em aulas, modo foco, teste de nivelamento, provas periódicas e provas por disciplina — índice correto recalculado na renderização e na correção; 0 questões com resposta fixa em A
- [x] Conclusão com evidência: `completeLesson()` exige nota ≥ 8/10 e síntese Feynman ≥ 30 caracteres; progresso parcial em `declared[]` com selo "Declarada · falta evidência", promoção a `done[]` com "Dominada com Evidência" e limpeza de `declared[]`
- [x] Treino intercalado (Mix): 6 questões de aulas concluídas, correção imediata e erros no caderno
- [x] Conforto de leitura: A−/A/A+ (13–19 px) e alto contraste persistidos em `settings` e aplicados a todos os temas
- [x] `node --check` 32/32; teste funcional no navegador: 6 aulas promovidas com evidência, gate reprovado com nota 5 e sem Feynman, Mix 6/6, distribuição de respostas corretas 18/20/22; **0 erros no console**
- [x] Lighthouse 100/100/100 (acessibilidade, boas práticas, SEO)
- [x] `AUDITORIA.md` atualizado com a tabela de conformidade e a ressalva dos 3 itens sem equivalente executável (grafo de commits, curva de perda, similaridade de cosseno)

### Etapa 12 — "Meu plano de formação"
- [x] Metas, ritmo, prazo, marcos, aulas personalizadas e painel de domínio

### Etapa 13 — Testes e documentação final
- [x] `node --check` em 19 arquivos JS (21 após a Seção 11)
- [x] Smoke test no navegador (11 páginas, foco, plan, labs, biblioteca, provas)
- [x] axe-core: 0 violações (claro/escuro, 6 labs e modal)
- [x] Lighthouse 100/100/100, 0 erros no console
- [x] Cache PWA verificado (31 URLs, nenhum recurso local ausente)
- [x] `AUDITORIA.md` atualizado

---

## Números finais

**71 módulos · 385 aulas · 9 trilhas · 3.850 questões (alternativas embaralhadas) · 56 labs · 110 recursos (8 filtros) · 34 termos de glossário · 5 rotas de leitura · 15 projetos · 80 flashcards · 10 indicadores de domínio · conclusão com evidência + Treino Intercalado · conforto de leitura (fonte e alto contraste) · gamificação e erros E1–E4 (Seção 11) · schema v3 com 4 espaços novos · 0 violações axe em 30 auditorias · Lighthouse 100/100/100 · 0 erros no console · 32 arquivos JS · PWA offline `forge-v4`.**

Etapas 0–17 concluídas, incluindo a verificação dos 31 links da seção 19 do documento-fonte (Etapa 14) e as correções críticas do Plano Mestre v3.0 (Etapa 17); nenhuma pendência registrada. Três itens do plano não têm equivalente executável e não foram reivindicados: grafo de commits Git, curva de perda animada e lab de similaridade de cosseno.

## Regras de qualidade (não negociáveis)

- Nenhuma aula vazia: toda aula gerada com objetivo, pré-requisito, intuição, explicação, exemplos, erros comuns, lab, referência e 10 questões via `L()`/`buildQuestions`.
- Referências bibliográficas apenas com fontes verificáveis (editoras, OpenStax, MIT OCW, man7.org etc.). Nenhuma página/capítulo inventado.
- Simulações sempre identificadas como tal; execução real indicada explicitamente.
- Preservar `localStorage` existente: toda nova chave do estado com valor padrão e migração versionada.
- Acessibilidade WCAG 2.2 AA e 0 erros no console ao final.

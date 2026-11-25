# AUDITORIA FINAL — FORGE Plataforma de Estudos

## 1. Estado final

Aplicação 100% frontal (sem backend), modular, com persistência em `localStorage` (`forge.study.v2`, schema **v3**) e suporte offline via service worker (`forge-v4-cache`). A migração automática v1/v2 → v3 preserva `done`, `mistakes`, `xp`, `labDone`, plano e foco, e grava um backup do estado anterior em `forge.study.v2.lastBackup` antes de migrar ou importar. O ciclo exportar → importar preserva integralmente os quatro espaços novos (`mastery`, `labEvidence`, `resourceMeta`, `assessmentLog`) e os dados de gamificação.

### Conteúdo

| Trilha (`CURRICULUM`) | Módulos | Aulas |
|---|---:|---:|
| `linux` — Linux | 8 | 34 |
| `c` — C (C9–C15 + Algoritmos) | 13 | 74 |
| `math` — Matemática (M0–M19) | 14 | 83 |
| `mathfund` — Matemática — Fundamentos | 3 | 25 |
| `software` — Engenharia de Software | 6 | 29 |
| `systems` — Sistemas e Arquitetura | 6 | 31 |
| `networks` — Redes de Computadores (R0–R12) | 11 | 64 |
| `databases` — Banco de Dados | 2 | 18 |
| `security` — Segurança (nova trilha) | 8 | 27 |
| **Total** | **71** | **385** |

- 10 questões de múltipla escolha por aula = **3.850 questões**, com alternativas embaralhadas deterministicamente por aula/questão (FNV-1a + LCG), índice correto recalculado na renderização e na correção, e correção automática. Nenhuma questão tem a resposta fixa na letra A.
- Toda aula contém objetivo, pré-requisito, intuição, explicação, exemplos, erros comuns, mini-laboratório, referência verificável e 10 questões; as aulas da Enciclopédia acrescentam derivação, exemplos trabalhados, perguntas de recuperação, critérios de domínio, tags e esforço estimado.
- Biblioteca com **110 recursos** e **8 filtros combináveis** (área, nível, tipo, idioma, acesso, sequência, texto e pré-requisito), **5 rotas de leitura** e **34 termos de glossário**; **80 flashcards**; **15 projetos** (10 em três níveis — Fundamentos, Intermediário, Avançado — mais 5 integradores da Seção 11).
- **56 laboratórios** no catálogo (esquema de 15 campos, 3 tipos de execução: simulado, comando real e evidência) distribuídos por Matemática, C, Redes, Linux e Engenharia.
- **Mapa de domínio** com avaliação por rubrica (8/10), selo por domínio e 10 indicadores no painel; buscas global (`Ctrl+K`) em aulas, labs, biblioteca e glossário.
- Fórmulas matemáticas renderizadas com KaTeX + auto-render.

### Funcionalidades

- Painel com progresso, streak, horas, meta semanal e gráficos (Canvas nativo).
- Trilhas com pré-requisitos sequenciais e prova de avanço para desbloqueio. Primeira aula de cada trilha sempre disponível.
- **Modo foco**: aula em 8 etapas curtas, blocos de 5/10/15/25 min, pausa/retomada, metas diária/semanal, XP, níveis, conquistas, histórico e retomada da sessão.
- **Meu plano de formação**: metas, ritmo semanal, prazo, marcos, aulas personalizadas e painel de domínio por disciplina (inclui notas de provas).
- Caderno de erros, técnica Feynman por aula e revisão espaçada (SM-2 simplificado).
- Laboratórios: terminal Linux simulado (30+ comandos), editor C com Godbolt, cálculo mental com níveis/timer/histórico, lab de matemática, checklists de engenharia, calculadora IPv4, simulação DNS/encapsulamento e laboratório SQL/modelagem.
- Teste de nivelamento (12 questões entre trilhas), prova periódica cumulativa, **prova por disciplina** (10 questões com melhor nota registrada), cronômetro de estudo e calculadora científica.
- Temas claro/escuro, preferência por movimento reduzido e sem sons, export/import JSON, reset e PWA instalável (manifest + ícone SVG + service worker).
- **Seção 11 (gamificação antisotirada)**: XP por atividade, níveis (limiares 0/300/700/1200/2000, +1000 por nível), escudo semanal anti-quebra de streak, Tarefa Mínima Viável diária (+15 XP), Pomodoro no painel (presets 25/5, 15/3 e 2/0; +20 XP por bloco e bônus de +10 a cada 3 blocos/dia), recompensas por aula ≥8 (+40 XP, uma vez), Feynman ≥80 caracteres (+30 XP) e entrega de lab (+60 XP).
- **Caderno de erros ampliado**: taxonomia E1 (lacuna de base), E2 (conceito mal compreendido), E3 (erro de execução), E4 (paralisia/estrutura), com categoria, `nextReview`, contagem de refazimento e revisão +7 dias (+30 após 2 acertos; +1 dia no erro).
- **Diagnóstico de redes**: simulador `net-diagnostico` com 4 cenários e 5 labs Wireshark (HTTP, DNS, TCP, IP, ARP) com persistência em `labDone`.
- **Enciclopédia Mestra integrada**: Matemática M0–M19, C C0–C15 com Algoritmos e complexidade, Redes R0–R12, Linux 8.6–8.9, trilha de Segurança e 56 labs — com o esquema rico do `L()`, incluindo derivações, exemplos, critérios de domínio e tags. A tabela de módulos/aulas acima reflete o que está efetivamente carregado em `CURRICULUM`.
- **Catálogo de labs** (`labs-catalog.js`): 56 laboratórios com 15 campos, 3 modos de execução, registro de evidências, regras de segurança explícitas e integração com `labDone`/XP.
- **Biblioteca rica e glossário** (`library-rich.js`): 110 recursos com 8 filtros, notas/avaliações por recurso (`resourceMeta`), 34 termos e busca global com atalho `Ctrl+K`/`Esc`.
- **Mapa de domínio** (`mastery.js`): rubrica de 8/10 por domínio, selo de domínio, prática e revisão registradas em `mastery`/`assessmentLog`, com 10 indicadores no painel e bloco de domínio na aula.
- **Conclusão com evidência** (correção crítica do Plano Mestre v3.0): `completeLesson()` exige nota ≥ 8/10 e síntese Feynman ≥ 30 caracteres. Sem isso, salva `declared[]` com o selo "Declarada · falta evidência", sem marcar domínio; com evidência, move para `done[]`, remove de `declared[]` e exibe "Dominada com Evidência". XP de esforço é mantido em ambos os casos.
- **Treino intercalado (Mix)**: seis questões de aulas já concluídas com sementes distintas, correção imediata e erros enviados ao caderno.
- **Conforto de leitura**: tamanho de fonte A−/A/A+ (13–19 px, persistido em `settings.fontScale`) e alto contraste (`settings.highContrast`) aplicados a todos os temas.

### Conformidade com o Plano Mestre Unificado v3.0

O documento fornecido descreve a evolução de `forge_plataforma_estudos_v2.html` (9 aulas, chave `forge.mastery.v2`). Esse arquivo não existe neste workspace: a base auditada aqui é a implementação modular já resultante dessa evolução — 385 aulas, 71 módulos, 9 trilhas, chave `forge.study.v2` com schema v3 e backup automático equivalente ao `forge.mastery.v2.backup`. Aplicar o plano como se fosse a v2.0 criaria duplicação e quebraria a regra de preservação; por isso foi feita auditoria de lacunas e implementado apenas o que faltava.

| Item do plano | Situação |
|---|---|
| F0-01 — migração reversível | ✅ `forge.study.v2` v3 + `forge.study.v2.lastBackup`; exportar/importar validado |
| F0-02 — embaralhar opções e exigir evidência | ✅ corrigido em 25/11/2026; `node --check` 32/32, 0 erros, Lighthouse 100/100/100 |
| F1-01 — Stepper de aula, busca Ctrl+K, foco | ✅ modo foco em 8 etapas, `GlobalSearch`, foco com timer; página de aula completa permanece linear para não duplicar conteúdo |
| F1-02 — TMV, 15/3, escudo, E1–E4, font size, alto contraste | ✅ todos implementados |
| F2–F5 — M0–M19, C0–C15, redes R0–R12, labs, DB/segurança/IA | ✅ conteúdo e catálogo de labs presentes (ver tabelas acima) |
| F6-01 — biblioteca verificada, glossário, Mix, E1–E4 | ✅ 110 recursos com `verifiedAt`, 34 termos, Mix implantado |

**Não reivindicado como implementado:** visualizador de grafo de commits Git, gráfico animado da curva de perda e laboratório interativo de similaridade de cosseno não têm equivalentes executáveis na plataforma. Nenhum botão decorativo ou título vazio foi criado para eles.

## 2. Estrutura de arquivos

```
ESTUDOS/
├── index.html              # HTML, links PWA, ordem explícita dos scripts (32 locais), skip link e nav com 15 páginas
├── manifest.webmanifest    # Manifest PWA
├── icon.svg                # Ícone da aplicação
├── sw.js                   # Service worker (offline, forge-v4)
├── css/
│   └── style.css           # Temas, identidade por disciplina, layout, responsividade, a11y, print
├── js/
│   ├── data.js             # Helpers (L com campos opcionais da Enciclopédia), CURRICULUM, LIBRARY, PROJECTS, FLASHCARDS
│   ├── data-linux.js       # Trilha Linux
│   ├── data-c.js           # Trilha C
│   ├── data-math.js        # Matemática (parte 1)
│   ├── data-math2.js       # Matemática (parte 2)
│   ├── data-math-a.js      # Matemática — Fundamentos (trilha mathfund)
│   ├── data-math-discrete.js # Matemática discreta
│   ├── data-software.js    # Engenharia de Software
│   ├── data-software-extra.js # Engenharia de Software (expansão)
│   ├── data-algorithms.js  # Algoritmos e estruturas de dados
│   ├── data-systems.js     # Sistemas operacionais e arquitetura
│   ├── data-networks.js    # Redes de computadores
│   ├── data-db.js          # Banco de dados
│   ├── data-math-advanced.js # M12–M19 (Enciclopédia)
│   ├── data-c-advanced.js  # C9–C15, Algoritmos e complexidade, Lab de algoritmos
│   ├── data-networks-advanced.js # R4–R12 (IPv6, roteamento, TCP/UDP, DNS, TLS, Wireshark, sockets, segurança)
│   ├── data-linux-advanced.js # Seções 8.6–8.9 (shell, administração, SO, labs)
│   ├── data-security-systems.js # Trilha security + apêndice de sistemas
│   ├── data-labs-a.js      # 29 labs de Matemática e C
│   ├── data-labs-b.js      # 27 labs de Redes, Linux e Engenharia
│   ├── data-library-extra.js # 43 recursos adicionais da biblioteca rica
│   ├── storage.js          # Estado v3, migração v1/v2→v3 com backup, domínio/evidências, gamificação, erros E1–E4, export/import validado, streak
│   ├── exercises.js        # Correção, SM-2, placement, provas, busca
│   ├── app.js              # Renderização das 15 páginas, terminal, modais, atalhos, KaTeX, filtros e widgets
│   ├── gamification.js     # Seção 11: widgets do painel, TMV, Pomodoro, XP e refazimento (window.Gamification)
│   ├── mastery.js          # Rubrica 8/10, selo por domínio, indicadores e registro de prática (window.Mastery)
│   ├── labs-catalog.js     # 56 labs, 3 execuções, evidências e regras de segurança (window.LabCatalog)
│   ├── library-rich.js     # 110 recursos, 8 filtros, glossário e busca global (window.LibraryRich/Glossary/GlobalSearch)
│   ├── features.js         # Timer, placement, provas (inclui prova por disciplina), cálculo mental, gráficos
│   ├── focus.js            # Modo foco (window.Focus)
│   ├── plan.js             # Plano de formação (window.Plan)
│   └── labs-extra.js       # Labs de redes e banco de dados (window.ExtraLabs)
├── PLANO_IMPLEMENTACAO_ENCICLOPEDIA.md # Plano em 11 fases para integrar a Enciclopédia Mestra
├── PROGRESSO.md            # Inventário, plano de execução e status
├── AUDITORIA.md            # Este documento
└── backup/pre-fase1-2026-11-25/ # Cópia integral anterior à Fase 0 (29 arquivos)
```

Scripts carregados como `defer` clássicos (não ES modules) para funcionar também via servidor local simples. **Todos os 21 arquivos `data-*.js` precedem `app.js`**, pois `lessons` é construído no momento do parse (`buildAllLessons()`). `gamification.js` vem logo após `app.js` e antes de `features.js`; `mastery.js`, `labs-catalog.js` e `library-rich.js` também são carregados após `app.js`; `focus.js`, `plan.js` e `labs-extra.js` fecham a ordem e expõem globals namespaced. Total: 32 scripts locais.

## 3. Verificação executada

### Funcionalidade (teste automatizado no navegador)

- 15 páginas renderizadas sem erro: dashboard, tracks, focus, plan, lab, review, mistakes, feynman, domain, library, richlib, glossary, catalog, projects, settings (o lab inclui 6 abas).
- 385 aulas, 71 módulos, 9 trilhas e 3.850 questões validadas; 0 problemas estruturais (campos obrigatórios e 10 questões por aula).
- Exercícios corrigidos com **10/10** via `gradeLesson()`; prova periódica e prova por disciplina corrigidas e registradas.
- Modo foco: abertura de aula, 8 etapas marcadas, blocos 5/10/15/25 min, iniciar/pausar/reiniciar timer, metas, XP e saída — todos os checks passaram.
- Plano: geração com meta e ritmo semanal, domínio por disciplina.
- Labs extras: subnetting (/24 e divisão em 4), DNS, encapsulamento UDP, consulta SQL e desafio de modelagem 4/4.
- Biblioteca: busca/filtro por disciplina e modais de rotas de leitura.
- 15 projetos (10 em 3 níveis + 5 integradores) com entregáveis preservados (`proj<i>-<j>`, `labDone`).
- Seção 11 testada no navegador: TMV +15 XP, Pomodoro 2:00 com pausa/reinício, erro E2 com revisão em +7 dias e filtro por categoria, diagnóstico de redes e 5 labs Wireshark (+60 XP), widgets do painel atualizados.
- Fases 2–11 testadas: 110 cards na biblioteca rica com 8 filtros, 34 termos de glossário, busca global (`Ctrl+K` abre, `Esc` fecha), 56 labs no catálogo, 10 indicadores de domínio no painel e rubrica 8/10 com selo por domínio.
- Fase 1 testada: estado v2 semeado com `done`, erro E3, `xp: 815`, `labDone`, plano e foco → migração para v3 com **100% dos dados preservados** e backup v2 gravado; importação de v2 migrada com sucesso; versões futuras (v4) e formatos inválidos rejeitados sem alterar o estado atual; `L()` com `definitions`/`commonMistakes` e campos opcionais sem perder as aulas originais.
- **Exportar → importar** com os quatro espaços v3 preenchidos: 14 chaves verificadas (`mastery`, `labEvidence`, `resourceMeta`, `assessmentLog`, XP, Pomodoro, escudo, TMV, erros, `done`/`labDone`) — **100% preservadas**.
- Navegação por teclado: skip link `#main` visível no foco e leva ao conteúdo, `aria-current="page"` no botão ativo, 0 `tabindex` positivo e 0 controles sem nome nas 15 páginas, `Ctrl+K`/`Esc` funcionando.
- Todos os 32 arquivos JS passam em `node --check`; nenhum marcador `__CONTINUA__` pendente.
- **0 erros e 0 avisos no console**.

### Acessibilidade (axe-core, tags WCAG 2.0 A/AA + 2.1 AA + 2.2 AA)

Auditado em **todos os contextos**:

- temas claro e escuro;
- 15 páginas (dashboard, tracks, focus, plan, lab, review, mistakes, feynman, domain, library, richlib, glossary, catalog, projects, settings) — **30 auditorias**;
- 6 abas de laboratório (linux, c, math, eng, net, db);
- modal de prova por disciplina e modal de busca global.

Correções aplicadas nesta expansão: contraste dos rótulos de conquistas do modo foco (removido `opacity` sobre texto pequeno), `aria-label` nos seletores do plano e dos labs extras e sublinhado explícito nos links da biblioteca (distinção sem depender da cor). Na Fase 0 da Enciclopédia, corrigidos os pills novos da Seção 11: variáveis `--pill-info` (`#5546d4` claro / `#b0a7ff` escuro) e `--pill-success` (`#0f6a4a` claro / `#4bd5a4` escuro) substituíram as cores de baixo contraste nos fundos tintados (4,15:1 e 3,84:1 → 5,34:1 e 5,44:1). Na integração final: **skip link** para `#main` (com `tabindex="-1"`), `aria-current="page"` no botão de navegação ativo, `:focus-visible` global e regra de movimento reduzido; nenhum campo ou botão sem nome acessível.

**Resultado: 0 violações em 30 auditorias (15 páginas × 2 temas).**

### Lighthouse

| Categoria | Nota |
|---|---:|
| Acessibilidade | 100 |
| Boas práticas | 100 |
| SEO | 100 |

### PWA

- Service worker ativo e controlando a página.
- Cache `forge-v4-cache` com 38 URLs no APP_SHELL (mais fontes KaTeX adicionadas em runtime): shell completo, **32 scripts locais** (inclui `gamification.js`, `mastery.js`, `labs-catalog.js`, `library-rich.js` e todos os `data-*.js`), CSS, manifest, ícone e 3 recursos KaTeX. Nenhum recurso local ausente no cache.
- Estratégia: rede primeiro para arquivos locais (reflete edições), cache primeiro para KaTeX, fallback para o shell em navegação.

### Verificação de links (seção 19 do documento-fonte)

Checagem em **25/11/2026** por requisição HTTP seguindo redirecionamentos; quando um site bloqueia bots, a citação foi confirmada por leitura da página. **31/31 links verificados**: 29 responderam `200`, um DOI inexistente foi corrigido e um DOI da SAGE foi confirmado apesar do desafio anti-bot. O campo `verifiedAt` da biblioteca rica foi preenchido em **29 recursos com URL** (27 novos + 2 já registrados em 24/11); os 14 recursos sem URL permanecem sem verificação.

| # | Fonte (seção 19) | Resultado |
|---:|---|---|
| 1 | OpenStax Mathematics | 200 |
| 2 | OpenStax Calculus | 200 |
| 3 | MIT OCW Scholar | 200 → `course-lists/scholar-courses` |
| 4 | MIT 18.01SC | 200 (já verificado em 24/11) |
| 5 | MIT 18.02SC | 200 |
| 6 | MIT 18.03SC | 200 |
| 7 | MIT 18.06SC | 200 |
| 8 | MIT Mathematics for CS (PDF) | 200 · `application/pdf` |
| 9 | Beej's Guide to C | 200 |
| 10 | GNU C Manual | 200 |
| 11 | GCC documentation | 200 |
| 12 | GDB documentation | 200 |
| 13 | Valgrind documentation | 200 |
| 14 | Linux man-pages | 200 |
| 15 | Linux kernel documentation | 200 |
| 16 | OSTEP | 200 |
| 17 | The Linux Command Line | 200 |
| 18 | An Introduction to Computer Networks | 200 |
| 19 | Computer Networks: A Systems Approach | 200 |
| 20 | Stanford CS144 | 200 |
| 21 | Beej's Guide to Network Programming | 200 |
| 22 | Wireshark documentation | 200 |
| 23 | Pro Git (pt-BR) | 200 |
| 24 | Software Engineering at Google | 200 |
| 25 | Architecture of Open Source Applications | 200 |
| 26 | OWASP Top 10 | 200 → `owasp.org/projects/top-ten` |
| 27 | GitHub Actions documentation | 200 → `/en/actions` |
| 28 | Dunlosky et al. (2013) | **404: DOI inexistente** → corrigido para `10.1177/1529100612453266` (confirmado no Crossref) |
| 29 | Roediger & Karpicke (2006) | SAGE 403 (anti-bot); citação confirmada na página DOI |
| 30 | Carpenter, Pan & Butler (2022) | 200 (já verificado em 24/11) · Nature |
| 31 | Anki Manual | 200 |

> Correção aplicada em `js/data-library-extra.js`: `https://doi.org/10.1111/j.1539-6053.2013.01011.x` → `https://doi.org/10.1177/1529100612453266`. O DOI antigo retornava `Error: DOI Not Found`; o novo resolve para o artigo correto em *Psychological Science in the Public Interest* 14(1), 4–58.

> As 72 entradas legadas de `LIBRARY_BASE` são tuplas de 5 campos e não possuem `verifiedAt`; na interface aparecem como "Acesso não confirmado" até serem convertidas para o formato rico. Isso não afeta os 31 links da seção 19, que foram todos checados.

## 4. Limitações conhecidas

- O compilador C não roda dentro da página; o editor encaminha para o Compiler Explorer (Godbolt). Aviso explícito na UI sobre não enviar dados secretos.
- Laboratórios de redes (inclui o diagnóstico e os 5 labs Wireshark da Seção 11) e SQL são simulações didáticas, identificadas como tal na interface; nenhuma captura é apresentada como realizada se não foi feita.
- Service workers exigem HTTP(S) ou `localhost`; ao abrir `index.html` via `file://`, a aplicação funciona normalmente, mas sem modo offline.
- Responsividade validada pela revisão das regras CSS em 1024px, 900px, 640px e 560px (grids, sidebar off-canvas, ações empilhadas, modal com margem).

## 5. Como executar

```bash
cd "D:\João\Desktop\ESTUDOS"
python -m http.server 8080
# abrir http://localhost:8080/
```

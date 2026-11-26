# RELATÓRIO COMPLETO — FORGE: painel, plataforma e material didático

**Data:** 26/11/2026  
**Repositório:** https://github.com/jdocorte69-dev/forge-plataforma-estudos  
**Site publicado:** https://jdocorte69-dev.github.io/forge-plataforma-estudos/  
**Branch:** `main`, sincronizada com `origin/main` no commit `f5c19ec`.

Este relatório consolida dois conjuntos de fatos: (1) tudo o que a aplicação mostra e executa, com foco no painel, e (2) tudo o que foi implementado e publicado, incluindo o sistema de geração de capítulos. Números e comportamentos foram confirmados no código e na documentação do repositório; quando algo não tem equivalente executável, está dito explicitamente.

---

## 1. Resumo executivo — os números da plataforma

| Item | Quantidade confirmada | Onde verificar |
|---|---:|---|
| Trilhas | 9 | `AUDITORIA.md:9-19` |
| Módulos | 71 | `AUDITORIA.md:20` |
| Aulas | 385 | `AUDITORIA.md:20` |
| Questões de múltipla escolha | 3.850 (10 por aula) | `AUDITORIA.md:22` |
| Laboratórios no catálogo | 56 | `AUDITORIA.md:25` |
| Recursos da biblioteca | 110, com 8 filtros combináveis | `AUDITORIA.md:24` |
| Termos de glossário | 34 | `AUDITORIA.md:24` |
| Rotas de leitura | 5 | `AUDITORIA.md:24` |
| Projetos integradores | 15 (10 em 3 níveis + 5 integradores) | `AUDITORIA.md:24` |
| Flashcards | 80 | `AUDITORIA.md:24` |
| Indicadores de domínio no painel | 10 | `AUDITORIA.md:26` |
| PDFs de fonte aberta | 24 | `README.md:35`, `PROGRESSO.md:160-166` |
| Páginas na navegação | 16 (a documentação mais antiga diz 15) | `index.html:22-39` |
| Scripts JavaScript locais | 32 | `AUDITORIA.md:114`, `index.html:49-82` |
| Links externos verificados | 31/31 | `AUDITORIA.md:163-201` |
| Auditorias axe WCAG 2.2 AA | 30, com 0 violações | `AUDITORIA.md:136-147` |
| Lighthouse | 100 / 100 / 100 (acessibilidade, boas práticas, SEO) | `AUDITORIA.md:149-155` |
| Erros no console | 0 | `AUDITORIA.md:134` |

**Princípio central:** XP mede atividade; domínio exige evidência. Uma aula só é marcada como concluída com nota ≥ 8/10 **e** síntese Feynman de ≥ 30 caracteres (`README.md:7`, `GUIA_DE_ESTUDO.md:7-13`, `PROMPT_MESTRE.md:817-829`, `js/app.js:572-596`). O **selo** de domínio da rubrica é mais rigoroso: exige ≥ 80 caracteres e mais quatro critérios (`js/mastery.js:12-48`).

---

## 2. Arquitetura, persistência e publicação

- Aplicação **100% frontal**: HTML, CSS e JavaScript puro, sem backend, login, servidor ou build (`README.md:3`, `README.md:77`).
- Persistência em `localStorage`, chave `forge.study.v2`, **schema v3** (`README.md:68`, `AUDITORIA.md:5`).
- Antes de migrar ou importar, o estado anterior é copiado para `forge.study.v2.lastBackup` (`README.md:68`, `PROGRESSO.md:112-115`).
- Quatro espaços novos do schema v3: `mastery`, `labEvidence`, `resourceMeta`, `assessmentLog` (`PROGRESSO.md:113`).
- Exportar → importar preserva 14 chaves verificadas, incluindo XP, Pomodoro, escudo, TMV, erros, `done`, `labDone` e os quatro espaços v3 (`AUDITORIA.md:131`).
- Versões futuras (v4) e formatos inválidos são rejeitados sem alterar o estado atual (`AUDITORIA.md:130`).
- PWA instalável: `manifest.webmanifest`, `icon.svg` e service worker `sw.js` com cache `forge-v5` (`README.md:20`, `PROGRESSO.md:164`).
- Funciona offline depois do primeiro carregamento; via `file://` o service worker é bloqueado pelo navegador, mas a aplicação continua funcional (`README.md:20`, `AUDITORIA.md:209`).
- Deploy: GitHub Pages em modo clássico, branch `main`, raiz do repositório (`README.md:70-77`). Há também `.github/workflows/deploy-pages.yml` como alternativa manual (`README.md:75`).

#### Campos do estado persistido (`js/storage.js:6-73`)

| Grupo | Campos | Linha |
|---|---|---|
| Núcleo | `version`, `done`, `declared`, `mistakes`, `cards`, `hours`, `weeklyGoal`, `sessionDate`, `streak`, `dayLog`, `feynman`, `notes`, `theme`, `labDone`, `lastVisit`, `placementDone`, `placementResult`, `timerSessions`, `mentalMathHistory` | `js/storage.js:13-32` |
| Modo foco e plano | `focus` (sessões, progresso, metas 25 min/dia e 150 min/semana, última sessão), `plan` (objetivo, horas semanais, prazo, inscrição, marcos, aulas personalizadas), `assessments` | `js/storage.js:33-47` |
| Enciclopédia | `mastery`, `labEvidence`, `resourceMeta`, `assessmentLog` | `js/storage.js:48-52` |
| Gamificação | `xp`, `level`, `xpLog`, `feynmanAwarded`, `shieldUsedWeek`, `tmvDoneToday`, `tmvDate`, `pomodoros`, `pomodoroLog`, `redoStreak`, `rewards` | `js/storage.js:53-64` |
| Conforto | `settings`: animações, som, modo compacto, autosave, `fontScale` (padrão 15), alto contraste | `js/storage.js:65-72` |

Ciclo de vida: `loadState()` (`js/storage.js:160-179`), `migrateState()` (`:201`), `saveState()` (`:217`), `exportData()` (`:265-279`) e `importData()` (`:281-300`). Não há backend, analytics nem credenciais (`README.md:68`).

---

## 3. O painel — tudo o que aparece na interface

### 3.1 Navegação (16 páginas)

Extraído de `index.html:20-40`; os 16 botões `data-page` estão em `index.html:22-39`:

| Grupo | Páginas |
|---|---|
| Aprender | Painel geral (`dashboard`), Trilhas e aulas (`tracks`), Modo foco (`focus`), Meu plano (`plan`), Laboratórios (`lab`), Revisão espaçada (`review`), Caderno de erros (`mistakes`), Técnica Feynman (`feynman`), Mapa de domínio (`domain`) |
| Referência | Biblioteca (`library`), Biblioteca rica (`richlib`), Livros em PDF (`books`), Glossário (`glossary`), Projetos integradores (`projects`), Catálogo de labs (`catalog`) |
| Dados | Progresso e backup (`settings`) |

O cabeçalho traz botão de menu móvel (`☰`), data do dia, busca global (`Ctrl+K`) e alternador de tema claro/escuro (`index.html:43`). Há skip link para o conteúdo principal (`index.html:16`) e `<main tabindex="-1">` (`index.html:44`). A documentação mais antiga cita 15 páginas; a contagem direta do `<nav>` é 16 (9 em Aprender, 6 em Referência, 1 em Dados).

### 3.2 Indicadores e widgets do painel

O painel é montado por `dashboardPage()` em `js/app.js:200-305`. Ele combina quatro blocos: saudação e atalho de modo foco (`js/app.js:210-224`), widgets de gamificação (`js/app.js:226` → `js/gamification.js:56-109`), painel de domínio (`js/app.js:228` → `js/mastery.js:605-654`) e estatísticas e gráficos nativos (`js/app.js:238-303`).

#### Bloco 1 — Cabeçalho e modo foco (`js/app.js:210-224`)

| Elemento | Texto / ação | Linha |
|---|---|---|
| Eyebrow | "Seu espaço de aprendizagem" | `js/app.js:210` |
| Título | "Construa domínio, uma sessão por vez." | `js/app.js:211` |
| Subtítulo | Avisa que o progresso fica salvo no navegador | `js/app.js:212` |
| Cartão de destaque | "Modo foco: uma etapa por vez" — 8 passos, timer, pausa e retomada | `js/app.js:214-219` |
| Botão 1 | `▶ Iniciar modo foco` → `Focus.open(nextLessonId(),'dashboard')` | `js/app.js:221` |
| Botão 2 | `Escolher aula` → `Focus.openPicker()` | `js/app.js:222` |

#### Bloco 2 — Gamificação e execução diária (`js/gamification.js:56-109`)

| Cartão | Conteúdo exibido | Linha |
|---|---|---|
| **Progresso** | `XP` atual, `Nível`, barra de progresso, XP restante para o próximo nível, situação do escudo semanal e aviso de que 1 dia perdido não zera a sequência | `js/gamification.js:65-72` |
| **Anti-paralisia (TMV)** | Tarefa Mínima Viável do dia (15 min: 10 flashcards vencidos + 1 exercício curto), selo "Dia salvo"/"Pendente", checkbox `+15 XP` e contagem de erros com revisão vencida | `js/gamification.js:74-80` |
| **Pomodoro adaptável** | Relógio, rótulo da fase, 3 presets (`Padrão 25/5`, `Dia difícil 15/3`, `Início rápido 2 min`), botões Iniciar/Pausar/Zerar, contador de blocos, aviso de som e bônus de +10 XP a cada 3 blocos | `js/gamification.js:82-96`, presets em `js/gamification.js:11-15` |
| **Recompensas combinadas** | Campos editáveis diária (80 XP/dia), semanal (500 XP) e mensal (projeto entregue), com botão "Salvar recompensas" | `js/gamification.js:99-108` |

#### Bloco 3 — Indicadores honestos: os 10 indicadores do painel (`js/mastery.js:466-556`)

O painel separa explicitamente **atividade** de **domínio com evidência** (`js/mastery.js:642-644`). Cada item abaixo mostra `valor` e `dica` exibidos:

| # | Indicador | Valor exibido | Dica exibida | Linha |
|---:|---|---|---|---|
| 1 | XP / Nível | `{xp} XP · Nível {nível}` | "Atividade registrada. XP não substitui domínio com evidência." | `js/mastery.js:505-509` |
| 2 | Domínio (aulas com selo) | `{seladas}/{total}` | Percentual de aulas com selo 8/10 por evidência | `js/mastery.js:510-514` |
| 3 | Revisões vencidas | `{n}` | Erros com data vencida + flashcards devidos agora | `js/mastery.js:515-519` |
| 4 | Horas registradas | `{h} h` | Horas declaradas; sessões de cronômetro em minutos (não medem presença) | `js/mastery.js:520-524` |
| 5 | Streak | `{n} dia(s)` | Sequência de dias salvos; escudo disponível ou usado | `js/mastery.js:525-529` |
| 6 | Labs com evidência | `{com evidência}/{total do catálogo}` | Registros fora do catálogo e marcações declaradas, não verificadas | `js/mastery.js:530-534` |
| 7 | Projetos | `{completos}/{total} completos` | Entregáveis marcados em `labDone`; marcação não é evidência | `js/mastery.js:535-539` |
| 8 | Erros a refazer | `{n}` | Quantos com revisão vencida; só corrigidos contam no domínio | `js/mastery.js:540-544` |
| 9 | Meta mínima do dia (TMV) | `Dia salvo` ou `Pendente` | Protege o streak, mas não concede selo de domínio | `js/mastery.js:545-549` |
| 10 | Módulos em andamento | `{n}` | Módulos com domínio parcial N1–N3 | `js/mastery.js:550-554` |

Complementos do mesmo bloco:

- **Mapa de domínio N0–N4** com uma linha por módulo de cada trilha: selo `N0` (0%), `N1` (1–39%), `N2` (40–69%), `N3` (70–99%) e `N4` (100% de aulas com selo 8/10), barra `aria-valuenow` e contagem `seladas/total` (`js/mastery.js:615-651`).
- **Calendário de revisão** dos próximos 7 dias, contando `mistakes.nextReview` e as datas em `cards`; vencidos aparecem em "Hoje" (`js/mastery.js:558-603`).

#### Bloco 4 — Estatísticas, ações e gráficos (`js/app.js:230-303`)

| Elemento | O que mostra / faz | Linha |
|---|---|---|
| Teste de nivelamento | Abre o teste de 12 questões; exibe pill `Nivelamento concluído · X%` quando feito | `js/app.js:231`, `js/app.js:235` |
| Prova periódica | Abre prova cumulativa de 10 questões | `js/app.js:232` |
| Prova por disciplina | Abre prova com melhor nota registrada | `js/app.js:233` |
| Treino intercalado (Mix) | 6 questões misturadas de aulas concluídas | `js/app.js:234` |
| Cronômetro + gráfico de horas | Widget de timer ao lado de canvas com as horas dos últimos 14 dias (`dayLog`) | `js/app.js:238-245`, `js/features.js:417-448` |
| 4 cartões de número | Aulas concluídas / total; sequência atual em dias; horas registradas; meta semanal (`wk / weeklyGoal`) com barra limitada a 100% | `js/app.js:247-268` |
| Progresso por matéria | Um cartão por trilha com ícone, nome, percentual, barra, contagem de aulas concluídas e botão "Continuar trilha" | `js/app.js:270-284` |
| Próxima aula | Recomenda a primeira aula ainda não concluída, com botão "Abrir aula"; se tudo estiver pronto, orienta seguir para os projetos | `js/app.js:286-290`, `js/app.js:313-322` |
| Plano para hoje | Rotina sugerida (10 min revisão, 25 teoria, 20 prática, 5 registro), campo de horas (0,1–12) e botão "Registrar sessão" | `js/app.js:291-297`, `js/app.js:324-330` |
| Progresso por trilha | Gráfico de barras em Canvas nativo desenhado com `drawProgressChart()` | `js/app.js:300-303`, `js/features.js:384-415` |

**Nota sobre os dois conjuntos de números:** os quatro cartões de `js/app.js:247-268` mostram `done[]`, `streak`, `hours` e meta semanal. Os 10 "Indicadores honestos" de `js/mastery.js` repetem alguns conceitos, mas os recalculam com critério de evidência (selo 8/10, `labEvidence`, entregáveis) e incluem a ressalva de que marcação não é evidência. As duas visões coexistem de propósito: uma mede atividade, a outra mede domínio.

### 3.3 Funcionalidades por página

| Página / recurso | O que faz |
|---|---|
| Painel geral | Progresso, sequência (streak), horas, meta semanal, gráficos em Canvas nativo, Pomodoro, TMV, conquistas e indicadores de domínio (`AUDITORIA.md:31`, `AUDITORIA.md:39`) |
| Trilhas e aulas | Pré-requisitos sequenciais e prova de avanço para desbloqueio; primeira aula de cada trilha sempre disponível (`AUDITORIA.md:32`) |
| Aula completa | Objetivo, pré-requisito, intuição, explicação, exemplos, erros comuns, mini-laboratório, referência verificável e 10 questões (`AUDITORIA.md:23`) |
| Modo foco | 8 etapas curtas, blocos de 5/10/15/25 min, pausa/retomada, metas diária/semanal, XP, histórico e retomada da sessão (`AUDITORIA.md:33`) |
| Meu plano | Metas, ritmo semanal, prazo, marcos, aulas personalizadas e domínio por disciplina, incluindo notas de provas (`AUDITORIA.md:34`) |
| Laboratórios e catálogo | Terminal Linux simulado (30+ comandos), editor C com Godbolt, cálculo mental, lab de matemática, checklists de engenharia, calculadora IPv4, DNS/encapsulamento, SQL/modelagem; 56 labs com 17 chaves de registro (o documento diz 15), 3 modos de execução, evidência e regras de segurança (`AUDITORIA.md:36`, `AUDITORIA.md:43`, `js/labs-catalog.js:159-166`) |
| Revisão espaçada e caderno de erros | SM-2 simplificado, revisão em +7 dias (+30 após 2 acertos; +1 no erro), taxonomia E1–E4, categoria e refazimento (`AUDITORIA.md:35`, `AUDITORIA.md:40`) |
| Técnica Feynman | Síntese por aula; ≥ 30 caracteres conclui a aula, ≥ 80 caracteres entra na rubrica do selo (`GUIA_DE_ESTUDO.md:11-13`, `js/app.js:582`, `js/mastery.js:14`) |
| Mapa de domínio | Rubrica de 8/10, selo por domínio, prática e revisão registradas em `mastery`/`assessmentLog` (`AUDITORIA.md:45`) |
| Biblioteca e Biblioteca rica | 110 recursos, 8 filtros combináveis, notas/avaliações em `resourceMeta`, 5 rotas de leitura e busca global (`AUDITORIA.md:24`, `AUDITORIA.md:44`) |
| Livros em PDF | 24 PDFs legais (OpenStax, TLDP, IETF, documentação oficial) com busca, filtro por área e link direto (`README.md:35`, `PROGRESSO.md:161-162`) |
| Glossário | 34 termos e busca global com `Ctrl+K` / `Esc` (`AUDITORIA.md:44`) |
| Projetos integradores | Portfólio canônico `P0`–`P10` (11 códigos), 10 projetos em três níveis mais 5 integradores, 6 evidências por projeto e entregáveis preservados (`AUDITORIA.md:24`, `js/app.js:1350-1377`; detalhes na seção 5.1) |
| Progresso e backup | Exportar/importar JSON, reset, tema, tamanho de fonte A−/A/A+ (13–19 px), alto contraste e preferência por movimento reduzido (`README.md:39`, `AUDITORIA.md:38`, `AUDITORIA.md:48`) |
| Testes e provas | Teste de nivelamento (12 questões), prova periódica cumulativa (10 questões), prova por disciplina com melhor nota registrada e Treino Intercalado (Mix, 6 questões) (`AUDITORIA.md:37`, `AUDITORIA.md:47`) |

---

## 4. Conteúdo carregado no currículo

### 4.1 Trilhas, módulos e aulas

Tabela de `AUDITORIA.md:9-20`:

| Trilha (`CURRICULUM`) | Módulos | Aulas | Questões |
|---|---:|---:|---:|
| `linux` — Linux | 8 | 34 | 340 |
| `c` — C (C9–C15 + Algoritmos) | 13 | 74 | 740 |
| `math` — Matemática (M0–M19) | 14 | 83 | 830 |
| `mathfund` — Matemática — Fundamentos | 3 | 25 | 250 |
| `software` — Engenharia de Software | 6 | 29 | 290 |
| `systems` — Sistemas e Arquitetura | 6 | 31 | 310 |
| `networks` — Redes de Computadores (R0–R12) | 11 | 64 | 640 |
| `databases` — Banco de Dados | 2 | 18 | 180 |
| `security` — Segurança | 8 | 27 | 270 |
| **Total** | **71** | **385** | **3.850** |

As contagens de módulos e aulas vêm de `AUDITORIA.md:9-20`; as de questões são 10 por aula (`AUDITORIA.md:22`).

### 4.2 Questões, labs, biblioteca e projetos

- Cada uma das 385 aulas tem 10 questões: **3.850 no total**. As alternativas são embaralhadas deterministicamente por aula/questão (FNV-1a + LCG), com índice correto recalculado na renderização e na correção; nenhuma questão tem resposta fixa na letra A (`AUDITORIA.md:22`, `PROGRESSO.md:143`).
- As aulas da Enciclopédia acrescentam derivação, exemplos trabalhados, perguntas de recuperação, critérios de domínio, tags e esforço estimado (`AUDITORIA.md:23`).
- 56 laboratórios distribuídos por Matemática, C, Redes, Linux e Engenharia: 29 em `data-labs-a.js` e 27 em `data-labs-b.js` (`AUDITORIA.md:25`, `AUDITORIA.md:94-95`). Por tipo de execução: **25 simulados**, **29 comando real** e **2 análise de captura**. Por área: Matemática 15, C 14, Redes 9, Linux 10, Engenharia 8. Por nível: Base 15, Intermediário 29, Avançado 12. O registro usa 17 chaves (`js/labs-catalog.js:159-166`); o documento diz "15 campos" (`AUDITORIA.md:25`).
- Diagnóstico de redes: simulador `net-diagnostico` com 4 cenários e 5 labs Wireshark (HTTP, DNS, TCP, IP, ARP) (`AUDITORIA.md:41`).
- Biblioteca rica: 110 recursos, dos quais 43 vieram de `data-library-extra.js`; 29 recursos com URL têm `verifiedAt` preenchido (`AUDITORIA.md:24`, `PROGRESSO.md:125`, `AUDITORIA.md:165`).
- 24 PDFs de fonte aberta em `js/data-books.js`, com links validados na fonte oficial (206/200) (`PROGRESSO.md:161-163`).
- 15 projetos: 10 em três níveis (Fundamentos, Intermediário, Avançado) e 5 integradores da Seção 11 (`AUDITORIA.md:24`).

---

## 5. Regras de estudo, domínio e gamificação

| Mecanismo | Regra |
|---|---|
| Estados de uma aula | **Em estudo** (sem selo) · **Declarada** (clicou em "Concluir" sem evidência; XP de esforço preservado) · **Dominada** (nota ≥ 8/10 **e** Feynman ≥ 30 caracteres) (`GUIA_DE_ESTUDO.md:7-13`, `js/app.js:572-596`) |
| Selo de domínio (rubrica) | É **mais rigoroso** que a conclusão: nota ≥ 8/10 sem consulta, Feynman ≥ 80 caracteres, aplicação prática, laboratório com evidência, erro corrigido e rubrica ≥ 8/10 — todos os critérios de uma vez (`js/mastery.js:12-15`, `:339-367`) |
| Composição da rubrica | Explicação 2 + Exercícios 3 + Aplicação 2 + Laboratório 2 + Erros 1 = 10 pontos (`js/mastery.js:17-48`, `:273-337`) |
| Síntese Feynman | Explicação com analogia e exemplo próprios, como se estivesse ensinando alguém que nunca viu o assunto (`GUIA_DE_ESTUDO.md:13`) |
| Repetição espaçada | Cartões de erro com revisão em +7 dias, +30 dias após 2 acertos e +1 dia no erro (`AUDITORIA.md:40`); flashcards usam intervalos `[1, 3, 7, 14, 30]` dias, "Difícil" zera o nível e agenda +1 dia, "Bom" sobe 1 nível e "Fácil" sobe 2 (`js/exercises.js:100-125`) |
| Taxonomia de erros | E1 lacuna de base, E2 conceito mal compreendido, E3 erro de execução, E4 paralisia/estrutura (`AUDITORIA.md:40`, `js/app.js:1137-1142`) |
| Treino intercalado (Mix) | 6 questões misturadas de aulas concluídas, correção imediata e erros enviados ao caderno (`AUDITORIA.md:47`) |
| XP e níveis | Limiares 0/300/700/1200/2000, +1000 por nível (`AUDITORIA.md:39`) |
| Escudo semanal | Proteção anti-quebra de sequência (`AUDITORIA.md:39`) |
| Tarefa Mínima Viável | +15 XP por dia (`AUDITORIA.md:39`) |
| Pomodoro no painel | Presets 25/5, 15/3 e 2/0; +20 XP por bloco e +10 a cada 3 blocos/dia (`AUDITORIA.md:39`) |
| Recompensas | Aula ≥ 8 (+40 XP, uma vez), Feynman ≥ 80 caracteres (+30 XP), entrega de lab (+60 XP) (`AUDITORIA.md:39`) |
| Promoção entre módulos | ≥ 80% das aulas em `done[]`, prova por disciplina ≥ 80%, pelo menos 1 lab com evidência e explicação em 3 frases sem consultar (`GUIA_DE_ESTUDO.md:68-77`) |
| Rotina de sessão | 45 min: 5 intenção, 20 modo foco, 10 prova prática, 5 Feynman, 5 caderno (`GUIA_DE_ESTUDO.md:15-23`) |
| Planos alternativos | 3 h/semana (4 aulas dominadas), 7 h/semana (rotina completa), 14 h/semana (6 aulas novas) (`GUIA_DE_ESTUDO.md:53-57`) |

### 5.1 Portfólio canônico `P0`–`P10` (`js/app.js:1350-1377`)

São **11 códigos** (`P0` a `P9` mais `P10`) que preservam os índices dos 15 projetos de `PROJECTS`:

| Código | Projeto | Índice | Equivalente |
|---|---|---:|---|
| P0 | Calculadora científica em C | 0 | — |
| P1 | Monitor de processos Linux | 1 | Integrador 2 (índice 11) |
| P2 | Interpretador de expressões | 2 | Integrador 1 (índice 10) |
| P3 | Sistema de biblioteca | 3 | — |
| P4 | Plano financeiro com frações | 4 | — |
| P5 | Planejador de endereçamento IPv4 | 5 | — |
| P6 | Modelo relacional e consultas SQL | 6 | — |
| P7 | Monitor de sistema com observabilidade | 7 | — |
| P8 | Pipeline de qualidade e entrega | 8 | — |
| P9 | Serviço HTTP didático em C | 9 | Integrador 4 (índice 13) |
| P10 | Sistema completo documentado no Git | 14 | Integrador 5 (índice 14) |

As **6 evidências obrigatórias** (`js/app.js:1366-1373`) são: repositório com histórico e commits coerentes; README com instalação, execução e requisitos; testes automatizados com saída registrada; evidência de execução (saída, captura ou relatório); limitações documentadas; retrospectiva com decisões e próximos passos. Cada item é salvo na chave `portfolio-<codigo>-<j>` (`js/app.js:1375-1377`). Esses códigos não se confundem com `MP1`–`MP10`, que são rótulos didáticos do Prompt Mestre (`README.md:55`).

---

## 6. Tudo o que foi implementado — histórico por etapas

Resumo de `PROGRESSO.md:42-185`, com as evidências registradas no próprio arquivo.

| Etapa | Entrega |
|---|---|
| 0 | Backup integral e inventário de arquivos, globals e formatos de dados |
| 1 | Modo foco com uma tarefa, timer, pausa/continuar, blocos 5/10/15/25 min, aula em 8 etapas, metas, retomada e histórico |
| 2 | XP, níveis, conquistas, medalhas, mapa de evolução e estatísticas semanais |
| 3 | Cores e capas por disciplina, ícones, transições discretas e notificações |
| 4 | Matemática: fundamentos (25 aulas), pré-álgebra, álgebra, funções, pré-cálculo, Cálculo I–III, álgebra linear, discreta (14), probabilidade e estatística |
| 5 | Algoritmos/estruturas (12 aulas), C avançado, sistemas operacionais e arquitetura (18), banco de dados (18) |
| 6 | Redes: fundamentos, protocolos, tópicos avançados e labs de subnetting/DNS/encapsulamento |
| 7 | Expansão de Engenharia de Software (arquitetura, qualidade, entrega) |
| 8 | Biblioteca universitária estruturada com rotas de leitura |
| 9 | Labs interativos: IPv4, DNS, encapsulamento, SQL e modelagem relacional |
| 10 | Registro de melhor nota e tentativas por aula; prova por disciplina |
| 11 | 10 projetos em três níveis com entregáveis marcaráveis |
| 11b | Gamificação da Seção 11, erros E1–E4, diagnóstico de redes, 5 labs Wireshark, `gamification.js` no APP_SHELL |
| 12 | "Meu plano de formação": metas, ritmo, prazo, marcos e painel de domínio |
| 13 | Testes e documentação final: `node --check`, smoke test no navegador, axe, Lighthouse, cache PWA |
| 14 | Fase 0 da Enciclopédia: plano em 11 fases, backup, correção de contraste dos pills, verificação dos 31 links, correção de DOI inexistente |
| 15 | Fase 1: schema v3, `mastery`/`labEvidence`/`resourceMeta`/`assessmentLog`, backup automático, importação validada, `L()` estendido |
| 16 | Integração da Enciclopédia: M12–M19, C9–C15, R4–R12, Linux 8.6–8.9, trilha `security`, 56 labs, 110 recursos, 34 termos, 10 indicadores, 32 scripts, `forge-v4`, 0 erros no console |
| 17 | Lacunas do Plano Mestre v3.0: embaralhamento determinístico, conclusão com evidência, Mix, conforto de leitura (A−/A/A+ e alto contraste) |
| 18 | Publicação no GitHub e GitHub Pages, README e Guia de estudo, smoke test na URL pública |
| 19 | Catálogo de 24 livros em PDF de fonte aberta, busca e filtro, service worker `forge-v5`, `node --check` 57/57 |

**Não reivindicados como implementados:** visualizador de grafo de commits Git, gráfico animado da curva de perda e laboratório interativo de similaridade de cosseno — não têm equivalente executável e nenhum botão decorativo foi criado para eles (`AUDITORIA.md:63`, `PROGRESSO.md:185`).

---

## 7. Sistema de geração de material didático (Prompt Mestre)

### 7.1 Estrutura do prompt

`PROMPT_MESTRE.md` tem 19 seções e 906 linhas. Versão atual: **1.5** (`PROMPT_MESTRE.md:897-906`).

| Seções | Conteúdo |
|---|---|
| 1–2 | Identidade e missão; quem é o aluno e como adaptar o ensino |
| 3 | Princípios pedagógicos obrigatórios (analogia antes da definição, porquê, zero pré-requisitos ocultos, 3 exemplos, concreto→abstrato, erros, espiral, conexão entre áreas, aprendizagem ativa) |
| 4 | Estrutura obrigatória do capítulo (12 itens + autoverificação) |
| 5–6 | Formato de saída (Markdown, LaTeX, caixas destacadas) e regras de qualidade |
| 7 | Trilha de Matemática (aritmética → discretas) |
| 8 | Trilha de Linguagem C (binário → segurança) |
| 9 | Trilha de Redes (meio físico → sockets em C e ferramentas) |
| 10 | Trilha de Engenharia de Software (lógica → observabilidade e equipe) |
| 11 | Template de pedido do aluno |
| 12 | Plano de estudos integrado (marcos de domínio) |
| 13 | Rubrica de entrega (portão de qualidade) + Errata pública |
| 14 | Biblioteca de analogias e seus limites |
| 15 | Catálogo de mini-projetos integradores `MP1`–`MP10` |
| 16 | Convenções de notação, unidades e estilo |
| 17 | Protocolo de atendimento do professor |
| 18 | Integração com a plataforma FORGE (gate, 8 campos obrigatórios, conversão de códigos, precedência, portfólio) |
| 19 | Histórico de versões 1.0 → 1.5 |

### 7.2 Separação para contexto

- `PROMPT_MESTRE_NUCLEO.md`: seções 1–11 (`PROMPT_MESTRE.md` até o título `## 12.`).
- `PROMPT_MESTRE_REFERENCIA.md`: seções 12–19, com cabeçalho próprio explicando que o núcleo não é repetido.
- `scripts/sync_prompt.py`: sem argumentos regenera os dois derivados; `--check` falha se estiverem desatualizados. O ponto de divisão é o título `## 12.`, não um número de linha fixo (`README.md:57-64`).

### 7.3 Integração com o FORGE

Os oito campos obrigatórios no fim de cada capítulo (`PROMPT_MESTRE.md:831-846`):

| Campo | Destino na plataforma |
|---|---|
| `objetivo` | Modo foco, campo de intenção |
| `blocos` | Roteiro do modo foco (8 etapas) |
| `questoes` | Prova prática (10 questões, nota de corte 8/10) |
| `sintese_feynman` | Campo de Feynman (mínimo 30 caracteres) |
| `cartoes_erro` | Caderno de erros (revisão em 7 dias) |
| `laboratorio` | Laboratórios e portfólio (simulação × execução real) |
| `indicadores` | Mapa de domínio |
| `projeto` | Portfólio (`MP` didático × `P0`–`P10` canônico) |

Precedência dos critérios: rubrica interna (seção 13) → gate externo de domínio (18.1) → autoverificação (4.13). Se houver conflito, vale o mais rigoroso e a divergência vai para `Errata` (`PROMPT_MESTRE.md:883-889`).

### 7.4 Capítulos modelo (padrões ouro)

| Arquivo | Área / tema | Linhas | Validação |
|---|---|---:|---|
| `CAPITULO_MODELO.md` | C1 — Hello World em C | 595 | Blocos C compilam com `gcc -Wall -Wextra -Werror -pedantic -std=c11`; trecho de erro falha de propósito |
| `CAPITULO_MODELO_M.md` | M1 — Ordem das operações | 628 | Estrutura e contas conferidas |
| `CAPITULO_MODELO_R.md` | R1 — Do clique ao pacote | 735 | Tabela byte a byte conferida; pacote UDP usa porta efêmera `50000` |
| `CAPITULO_MODELO_S.md` | S1 — Primeiro commit Git | 676 | Comandos Git conferidos; ressalva SHA-1/SHA-256 |

Cada um tem 14 seções, 8 campos FORGE, 15 exercícios, 10 questões respondidas, analogia com limites, quadros de erro por seção, espiral, quadro interáreas, pausas ativas, gabarito comentado, mini-projeto e autoverificação.

`scripts/check_chapters.py` valida numeração das 14 seções, presença dos 8 campos, mínimo de 15 exercícios, 10 questões respondidas, equilíbrio de cercas de código e ausência de placeholders. `README.md:64` documenta o comando.

### 7.5 Convenção de códigos — decisão importante

Os códigos didáticos `M1`–`M19`, `C1`–`C14`, `R1`–`R12` e `S1`–`S14` **não** são IDs da aplicação. A conversão está em `PROMPT_MESTRE.md:848-881`. Exemplo crítico: o `R5` didático é UDP/TCP, enquanto o `R5` da aplicação é roteamento — a ambiguidade deve ser perguntada ao aluno, nunca resolvida em silêncio. Os mini-projetos didáticos são `MP1`–`MP10`; o portfólio canônico é `P0`–`P10` (`PROMPT_MESTRE.md:891-893`, `README.md:55`).

---

## 8. Correções e decisões registradas

| Correção | Motivo | Evidência |
|---|---|---|
| Rubrica item 2 aceita "nenhum" como pré-requisito em capítulo introdutório | O capítulo C1 modelo é introdutório e a regra antiga o reprovava | `PROMPT_MESTRE.md:537`, Errata em 13.3 |
| Rubrica item 13 exige 15 exercícios no total (5+/5+/3+) | A redação anterior dizia "5, 5 e 3" (13), contradizendo o mínimo de 15 da seção 4.10 | `PROMPT_MESTRE.md:545`, Errata em 13.3 |
| Sincronizador versionado no repositório | Núcleo e referência eram gerados por script temporário fora do repo, com risco de deriva | `scripts/sync_prompt.py`, `.github/workflows/check-prompt.yml` |
| Capítulos modelo para as quatro áreas | O prompt cobria quatro áreas, mas só havia padrão ouro para C | `CAPITULO_MODELO_{M,R,S}.md` |
| Pacote byte a byte de R1 trocado de UDP/443 para UDP/50000 | `443` é a porta bem conhecida de HTTPS (TCP); usá-la com UDP era pedagogicamente incorreto | Termo "porta efêmera" definido em R1.5.4; bytes `0xC3 0x50` em R1.5.7 |
| Exemplo 2 de R1 esclarece que a porta `80` é HTTP/TCP | Evitar inferir que HTTP usa UDP só porque o exemplo compara tamanhos de cabeçalho | `CAPITULO_MODELO_R.md` (Exemplo 2) |
| Typos corrigidos em M1 e S1 | `Obligam`→`Obrigam`, `substrações`→`subtrações`, `reuniao`→`reunião`, "capítulo S1.5"→"seção S1.5" | Capítulos correspondentes |
| DOI inexistente corrigido | O link antigo retornava "DOI Not Found"; novo DOI confirmado no Crossref | `AUDITORIA.md:196-201` |
| Conclusão com evidência | Antes era possível marcar domínio sem nota e sem Feynman | `AUDITORIA.md:46`, `PROGRESSO.md:144` |

---

## 9. Verificação e qualidade

| Verificação | Resultado |
|---|---|
| `node --check` nos scripts JavaScript | 32/32 (`AUDITORIA.md:81`, `AUDITORIA.md:133`); 57/57 após incluir os livros (`PROGRESSO.md:165`) |
| Teste funcional no navegador | 15 páginas, 385 aulas, 71 módulos, 9 trilhas, 3.850 questões, 0 problemas estruturais (`AUDITORIA.md:118-129`) |
| Correção de exercícios | 10/10 via `gradeLesson()`; provas periódica e por disciplina corrigidas (`AUDITORIA.md:122`) |
| Migração v1/v2 → v3 | 100% dos dados preservados, backup gravado; import de v2 migrado; v4 e formatos inválidos rejeitados (`AUDITORIA.md:130`) |
| Exportar → importar | 14 chaves preservadas (`AUDITORIA.md:131`) |
| axe-core WCAG 2.2 AA | 30 auditorias (15 páginas × claro/escuro), 0 violações (`AUDITORIA.md:136-147`) |
| Lighthouse | Acessibilidade 100, boas práticas 100, SEO 100 (`AUDITORIA.md:149-155`) |
| Links externos | 31/31 verificados em 25/11/2026 (`AUDITORIA.md:163-201`) |
| Console | 0 erros e 0 avisos (`AUDITORIA.md:134`) |
| PWA | Service worker controlando a página; APP_SHELL com 38 URLs e 32 scripts locais (`AUDITORIA.md:157-161`) |
| Código C dos capítulos | 5 blocos compilam sem avisos com `gcc -Wall -Wextra -Werror -pedantic -std=c11`; 1 trecho falha de propósito e está identificado como erro |
| `python scripts/check_chapters.py` | 4/4 capítulos OK |
| `python scripts/sync_prompt.py --check` | Núcleo e referência correspondem ao prompt completo |
| GitHub Actions `check-prompt.yml` | Execução [45740939127](https://github.com/jdocorte69-dev/forge-plataforma-estudos/actions/runs/45740939127): todos os passos com sucesso, incluindo "Verify derived files" e "Verify chapter structure" |

---

## 10. Arquivos, histórico Git e publicação

### 10.1 Commit mais recente

`f5c19ec` — `docs: adiciona relatorio completo do painel e da plataforma` (2 arquivos, 411 inserções). O commit anterior foi `597f263` — capítulos modelo M1, R1 e S1 com validação estrutural (9 arquivos, 2.164 inserções).

### 10.2 Sequência de commits no repositório

| Commit | Descrição |
|---|---|
| `f5c19ec` | Relatório completo do painel e da plataforma + link no README |
| `597f263` | Capítulos modelo M1, R1 e S1 + validador estrutural |
| `1c17275` | Correção da rubrica + sincronizador do Prompt Mestre + workflow de checagem |
| `3e98d80` | Integração do Prompt Mestre à plataforma + capítulo modelo C1 + derivados |
| `907f8f9` | Prompt Mestre: plano, rubrica, analogias, projetos e protocolo (seções 12–17) |
| `cbc8daa` | Prompt Mestre: trilhas de C, Redes, Engenharia e template do aluno (seções 8–11) |
| `2900605` | Catálogo de livros em PDF de fonte aberta |
| `2faae5e` | Registro da publicação no GitHub e GitHub Pages |
| `0db2749` | Ajuste do deploy para Pages clássico da branch `main` |
| `ac07556` | Correção de permissão do deploy e URL pública no README |
| `c0407d3` | README, Guia de estudo, AUDITORIA, PROGRESSO, plano e deploy; 74 arquivos iniciais |

### 10.3 Documentos de referência no repositório

| Arquivo | Função |
|---|---|
| `README.md` | Visão geral, início rápido, mapa de funcionalidades, comandos de validação e publicação |
| `RELATORIO_COMPLETO.md` | Inventário do painel, das funcionalidades implementadas e do material didático, com referências `arquivo:linha` (este documento) |
| `GUIA_DE_ESTUDO.md` | Regra de ouro, rotina de 45 min, plano de 12 semanas, variantes de tempo e promoção |
| `AUDITORIA.md` | Auditoria final: conteúdo, funcionalidades, verificação, acessibilidade, PWA, links e limitações |
| `PROGRESSO.md` | Inventário, plano de execução (Etapas 0–19) e números finais |
| `PLANO_IMPLEMENTACAO_ENCICLOPEDIA.md` | Plano em 11 fases para integrar a Enciclopédia Mestra |
| `PROMPT_MESTRE.md` e derivados | Especificação completa de autoria didática e integração com o FORGE |
| `CAPITULO_MODELO*.md` | Quatro padrões ouro de capítulos |
| `scripts/sync_prompt.py`, `scripts/check_chapters.py` | Sincronização e validação automatizada |
| `.github/workflows/check-prompt.yml` | Checagem automática em pushes e PRs |
| `.github/workflows/deploy-pages.yml` | Alternativa manual de deploy (Pages clássico já configurado) |

---

## 11. Limitações conhecidas

1. O compilador C não roda dentro da página; o editor encaminha para o Compiler Explorer (Godbolt), com aviso para não enviar dados secretos (`AUDITORIA.md:207`).
2. Laboratórios de redes (incluindo diagnóstico e 5 labs Wireshark) e SQL são simulações didáticas, identificadas como tal; nenhuma captura é apresentada como realizada se não foi feita (`AUDITORIA.md:208`).
3. Service workers exigem HTTP(S) ou `localhost`; em `file://` não há modo offline (`AUDITORIA.md:209`).
4. Responsividade validada por revisão das regras CSS em 1024, 900, 640 e 560 px (`AUDITORIA.md:210`).
5. As 72 entradas legadas de `LIBRARY_BASE` não têm `verifiedAt` e aparecem como "Acesso não confirmado" (`AUDITORIA.md:203`).
6. Três itens do plano não têm equivalente executável e não foram reivindicados: grafo de commits Git, curva de perda animada e lab de similaridade de cosseno (`AUDITORIA.md:63`).

### 11.1 Divergências entre código e documentação (conferidas em 26/11/2026)

| Divergência | Código | Documentação |
|---|---|---|
| Concluir aula exige Feynman ≥ 30 caracteres; **selo de domínio** exige ≥ 80 e mais quatro critérios | `js/app.js:582`, `js/mastery.js:14`, `:22`, `:344` | Documentos citam só os 30 (`GUIA_DE_ESTUDO.md:11`, `AUDITORIA.md:46`). São camadas diferentes, não erro de implementação. |
| Cache do service worker é `forge-v5` | `sw.js:2-3` | `AUDITORIA.md:5` ainda registra `forge-v4-cache`. |
| Registro de lab tem 17 chaves | `js/labs-catalog.js:159-166` | `AUDITORIA.md:25` e `AUDITORIA.md:43` dizem "15 campos". |
| Navegação tem 16 botões de página | `index.html:22-39` | Documentação mais antiga fala em 15 páginas. |

---

## 12. Como consultar e reproduzir

```powershell
# Abrir a aplicação
cd 'D:\João\Desktop\ESTUDOS'
python -m http.server 8765
# http://localhost:8765/index.html

# Validar o material didático
python scripts/sync_prompt.py --check
python scripts/check_chapters.py

# Regenerar os derivados do prompt após editar PROMPT_MESTRE.md
python scripts/sync_prompt.py
```

Site: https://jdocorte69-dev.github.io/forge-plataforma-estudos/  
Repositório: https://github.com/jdocorte69-dev/forge-plataforma-estudos

---

**Fim do relatório.** Todo dado aqui é rastreável até o arquivo citado ou até uma execução registrada no repositório; o que não pôde ser confirmado foi deixado de fora ou marcado como limitação.

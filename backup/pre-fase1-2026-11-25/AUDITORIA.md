# AUDITORIA FINAL — FORGE Plataforma de Estudos

## 1. Estado final

Aplicação 100% frontal (sem backend), modular, com persistência em `localStorage` (`forge.study.v2`) e suporte offline via service worker (`forge-v3-cache`).

### Conteúdo

| Trilha (`CURRICULUM`) | Módulos | Aulas |
|---|---:|---:|
| `linux` — Linux | 4 | 14 |
| `c` — C | 4 | 24 |
| `math` — Matemática | 6 | 41 |
| `mathfund` — Matemática — Fundamentos | 3 | 25 |
| `software` — Engenharia de Software | 6 | 29 |
| `systems` — Sistemas e Arquitetura | 2 | 18 |
| `networks` — Redes de Computadores | 2 | 20 |
| `databases` — Banco de Dados | 2 | 18 |
| **Total** | **29** | **189** |

- 10 questões de múltipla escolha por aula = **1.890 questões**, todas com resposta no índice 0, opções únicas e correção automática.
- Toda aula contém objetivo, pré-requisito, intuição, explicação, exemplos, erros comuns, mini-laboratório, referência verificável e 10 questões.
- Biblioteca com **48 recursos** organizados por disciplina e **5 rotas de leitura**; **80 flashcards**; **10 projetos integradores** em três níveis (Fundamentos, Intermediário, Avançado).
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

## 2. Estrutura de arquivos

```
ESTUDOS/
├── index.html              # HTML, links PWA, ordem explícita dos scripts (20 locais)
├── manifest.webmanifest    # Manifest PWA
├── icon.svg                # Ícone da aplicação
├── sw.js                   # Service worker (offline, forge-v3)
├── css/
│   └── style.css           # Temas, identidade por disciplina, layout, responsividade, a11y, print
├── js/
│   ├── data.js             # Helpers, CURRICULUM, LIBRARY, READING_ROUTES, PROJECTS, FLASHCARDS
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
│   ├── storage.js          # Estado, migração v1→v2, plan/assessments, export/import, streak
│   ├── exercises.js        # Correção, SM-2, placement, provas, busca
│   ├── app.js              # Renderização das páginas, terminal, modais, atalhos, KaTeX
│   ├── features.js         # Timer, placement, provas (inclui prova por disciplina), cálculo mental, gráficos
│   ├── focus.js            # Modo foco (window.Focus)
│   ├── plan.js             # Plano de formação (window.Plan)
│   └── labs-extra.js       # Labs de redes e banco de dados (window.ExtraLabs)
├── PROGRESSO.md            # Inventário, plano de execução e status
└── AUDITORIA.md            # Este documento
```

Scripts carregados como `defer` clássicos (não ES modules) para funcionar também via servidor local simples. **Todos os arquivos `data-*.js` precedem `app.js`**, pois `lessons` é construído no momento do parse (`buildAllLessons()`). `focus.js`, `plan.js` e `labs-extra.js` são carregados depois de `app.js` e expõem globals namespaced.

## 3. Verificação executada

### Funcionalidade (teste automatizado no navegador)

- 11 páginas renderizadas sem erro: dashboard, tracks, focus, plan, lab, review, mistakes, feynman, library, projects, settings.
- 189 aulas e 1.890 questões validadas; 0 problemas estruturais (campos obrigatórios e 10 questões por aula).
- Exercícios corrigidos com **10/10** via `gradeLesson()`; prova periódica e prova por disciplina corrigidas e registradas.
- Modo foco: abertura de aula, 8 etapas marcadas, blocos 5/10/15/25 min, iniciar/pausar/reiniciar timer, metas, XP e saída — todos os checks passaram.
- Plano: geração com meta e ritmo semanal, domínio por disciplina.
- Labs extras: subnetting (/24 e divisão em 4), DNS, encapsulamento UDP, consulta SQL e desafio de modelagem 4/4.
- Biblioteca: busca/filtro por disciplina e modais de rotas de leitura.
- 10 projetos em 3 níveis com entregáveis preservados (`proj<i>-<j>`).
- Todos os 19 arquivos JS passam em `node --check`.
- **0 erros e 0 avisos no console**.

### Acessibilidade (axe-core, tags WCAG 2.0 A/AA + 2.1 AA + 2.2 AA)

Auditado em **todos os contextos**:

- temas claro e escuro;
- 11 páginas + aula + modo foco;
- 6 abas de laboratório (linux, c, math, eng, net, db);
- modal de prova por disciplina.

Correções aplicadas nesta expansão: contraste dos rótulos de conquistas do modo foco (removido `opacity` sobre texto pequeno), `aria-label` nos seletores do plano e dos labs extras e sublinhado explícito nos links da biblioteca (distinção sem depender da cor).

**Resultado: 0 violações em todos os contextos auditados.**

### Lighthouse

| Categoria | Nota |
|---|---:|
| Acessibilidade | 100 |
| Boas práticas | 100 |
| SEO | 100 |

### PWA

- Service worker ativo e controlando a página.
- Cache `forge-v3-cache` com 31 URLs: shell completo, 20 scripts locais, CSS, manifest, ícone, service worker e 5 recursos KaTeX (inclui fontes adicionadas em runtime). Nenhum recurso local ausente no cache.
- Estratégia: rede primeiro para arquivos locais (reflete edições), cache primeiro para KaTeX, fallback para o shell em navegação.

## 4. Limitações conhecidas

- O compilador C não roda dentro da página; o editor encaminha para o Compiler Explorer (Godbolt). Aviso explícito na UI sobre não enviar dados secretos.
- Laboratórios de redes e SQL são simulações didáticas, identificadas como tal na interface.
- Service workers exigem HTTP(S) ou `localhost`; ao abrir `index.html` via `file://`, a aplicação funciona normalmente, mas sem modo offline.
- Responsividade validada pela revisão das regras CSS em 1024px, 900px, 640px e 560px (grids, sidebar off-canvas, ações empilhadas, modal com margem).

## 5. Como executar

```bash
cd "D:\João\Desktop\ESTUDOS"
python -m http.server 8080
# abrir http://localhost:8080/
```

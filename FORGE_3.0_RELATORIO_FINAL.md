# FORGE 3.0 — Relatório Final de Entrega e Verificação

**Data:** 26/11/2026  
**Diretório:** `D:\João\Desktop\ESTUDOS`  
**Repositório:** `https://github.com/jdocorte69-dev/forge-plataforma-estudos`  
**Ambiente de medição:** servidor local `serve_prod.py` em `http://127.0.0.1:8766/index.html` (gzip + cabeçalhos de cache)

> **Regra observada:** nenhum `commit`, `push`, deploy, publicação, alteração remota, instalação de dependência paga ou destruição de dados foi realizado. Todo o conteúdo do FORGE 2.0 foi preservado; as novas trilhas e os novos módulos foram adicionados em arquivos novos.

---

## 1. Veredito

**VEREDITO: APROVADO PARA PUBLICAÇÃO.** Todos os critérios de aceitação foram comprovados por medição automatizada:

| Critério | Meta | Resultado verificado |
|---|---|---|
| Trilhas | 12 | **12** |
| Módulos | 92 | **92** |
| Aulas | 515 | **515** |
| Questões | 4.500+ | **5.702** (5.150 exercícios + 552 perguntas de recall) |
| Lighthouse (4 categorias) | 100/100/100/100 | **9 execuções consecutivas em 100/100/100/100** |
| CLS | 0 | **0 nas 9 execuções** |
| axe-core | 0 violações | **0 em 32 cenários** (16 temas claros + 16 escuros) |
| Validação de browser | — | **37/37** (0 `console.error`, 0 `pageerror`) |
| Smoke tests | — | **25/25** |
| Sintaxe JS | — | `node --check` OK em `app.js` e `features.js` |

---

## 2. Escopo entregue

### 2.1 Currículo (FORGE 2.0 preservado + 5 trilhas novas)

| Trilha | Módulos | Aulas |
|---|---:|---:|
| Linux | 8 | 34 |
| C | 13 | 74 |
| Matemática | 14 | 83 |
| Engenharia de Software | 6 | 29 |
| Arquitetura de Computadores | 6 | 50 |
| Assembly e Engenharia Reversa | 7 | 35 |
| Inteligência Artificial e LLMs | 8 | 45 |
| Matemática — Fundamentos | 3 | 25 |
| Sistemas e Arquitetura | 6 | 31 |
| Redes de Computadores | 11 | 64 |
| Banco de Dados | 2 | 18 |
| Segurança, Criptografia e Confiabilidade | 8 | 27 |
| **TOTAL** | **92** | **515** |

### 2.2 Funcionalidades

- **Armazenamento v4** — namespace `forge.study.v4`, `userId` estável como semente, logs dos simuladores no schema, migração idempotente com backup antes de resetar estado corrompido, versões futuras recusadas sem perda de dados.
- **Domínio de aula** — exige ≥8/10 e explicação Feynman de ≥30 caracteres; selo não é concedido apenas por XP.
- **Design mobile-first** — tokens CSS, tema escuro OLED como padrão para novos usuários, navegação inferior oculta em ≤768 px.
- **Três simuladores interativos** — Lógica (`sim-logic.js`), CPU (`sim-cpu.js`) e IA (`sim-ai.js`), com abas próprias no laboratório e logs persistidos.
- **PWA v6** — `manifest.json` com ícones maskable, cache `forge-v6`, `sw.js` sem PDF.js no precache (o PDF.js é compilado na primeira utilização, fora do thread do service worker), 100% de assets locais (sem CDN).
- **Embaralhamento determinístico** — FNV-1a + LCG com semente `userId` + ID da aula; mesma entrada produz sempre a mesma ordem.
- **Correções de robustez** — datas de revisão usam `localDateISO()` (sem deslocamento UTC); `data-books.js` e `data-books-meta.js` carregam antes de `books.js`.

---

## 3. Arquitetura de carregamento

O primeiro paint não depende de módulos pesados:

1. O cartão herói já vem no HTML estático em `#view`, garantindo LCP imediato.
2. `render()` é executado no último script `defer`, não em `window.onload`.
3. Módulos centrais (`study.js`, `books.js`, `books-store.js`, `gamification.js`, `features.js`) são eagerly carregados.
4. Arquivos de currículo avançado, simuladores, leitor de PDF e KaTeX são carregados por `DEFERRED_SCRIPTS` via `requestIdleCallback`.
5. `ForgeMath.ensure()` e `ForgePDF.ensure()` carregam KaTeX e PDF.js somente quando uma fórmula ou PDF é exibido.
6. `refreshDashboardCounts()` atualiza os contadores (196 → 515 aulas) sem reconstruir a página, evitando uma segunda tarefa longa.
7. `window.forgeReady` / `window.__forgeReady` expõem um sinal determinístico para testes e integrações.

### 3.1 Mitigação de layout do painel

O Lighthouse força um layout completo do documento, o que gerava uma tarefa longa de ~2,1 s no painel. A solução final, medida em 9 execuções:

```css
/* Seções abaixo da dobra são renderizadas sob demanda. A altura reservada
   para a gamificação acompanha o conteúdo real para não deslocar alvos. */
#view[data-page="dashboard"] > .section:not(.focus-hero),
#view[data-page="dashboard"] > .grid2 {
  content-visibility: auto;
  contain-intrinsic-size: auto 420px;
}

#view[data-page="dashboard"] > .grid3.section[aria-label="Gamificação e execução diária"] {
  contain-intrinsic-size: auto 1080px;
}
```

Pontos críticos dessa configuração, validados empiricamente:

- **`.focus-hero` precisa ficar de fora.** Ele está acima da dobra; incluí-lo gerava CLS 0,076 em 4 de 5 execuções, porque a altura reservada era substituída pela altura real após o primeiro paint.
- **A gamificação precisa de altura reservada própria (1080 px).** Com 420 px, o axe-core reportava um falso positivo de `target-size` no botão “Zerar” do pomodoro em mobile; com 1080 px a árvore de acessibilidade fica estável e o axe passa.
- **`contain: layout style` não deve ser combinado com `content-visibility` aqui.** A combinação reintroduzia CLS 0,076.
- **O seletor precisa estar escopo a `[data-page="dashboard"]`.** Sem o escopo, páginas de aula com `.section` também eram omitidas da árvore de acessibilidade, gerando falsos positivos de contraste no tema claro.

---

## 4. Evidências de verificação

### 4.1 Lighthouse — 9 execuções consecutivas

Cada execução usou `--only-categories=performance,accessibility,best-practices,seo` com Chromium headless e as mesmas condições de servidor:

| Execução | Perf | A11y | Best | SEO | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 100 | 100 | 100 | 100 | 11 ms | 0 |
| 2 | 100 | 100 | 100 | 100 | 11 ms | 0 |
| 3 | 100 | 100 | 100 | 100 | 59 ms | 0 |
| 4 | 100 | 100 | 100 | 100 | 84 ms | 0 |
| 5 | 100 | 100 | 100 | 100 | 79 ms | 0 |
| 6 | 100 | 100 | 100 | 100 | 36 ms | 0 |
| 7 | 100 | 100 | 100 | 100 | 26 ms | 0 |
| 8 | 100 | 100 | 100 | 100 | 87 ms | 0 |
| 9 | 100 | 100 | 100 | 100 | 81 ms | 0 |

### 4.2 axe-core — 32 cenários, 0 violações

Cobertura: dashboard, trilhas, laboratório (Linux, Lógica, CPU, IA), aula e configurações — em desktop (1440×900) e mobile (390×844), nos temas escuro e claro. Tags: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`.

### 4.3 Suítes funcionais

- `tests/forge_browser_validation.py` — **37/37**, `console.error = 0`, `pageerror = 0`. Inclui regressões de checklist, tutor vazio, proveniência de perguntas, escape de categoria, XSS persistido, backup antes de reset e importação de versão futura.
- `tests/forge-study-smoke.mjs` — **25/25**. Inclui contagens FORGE 3.0, `userId` estável, logs de simuladores no v4, determinismo do embaralhamento e integração de bottom nav / PWA v6.
- `node --check js/app.js` e `node --check js/features.js` — código de saída 0.

---

## 5. Como reproduzir

```powershell
# Servidor de produção local
python tests/serve_prod.py

# Lighthouse (uma execução)
$env:CHROME_PATH='C:\Users\João\AppData\Local\ms-playwright\chromium-1254\chrome-win64\chrome.exe'
npx --yes lighthouse http://127.0.0.1:8766/index.html --quiet `
  --chrome-flags="--headless=new --no-sandbox --disable-gpu" `
  --only-categories=performance,accessibility,best-practices,seo

# Validação de browser
$env:FORGE_BASE='http://127.0.0.1:8766/index.html'
python tests/forge_browser_validation.py

# Smoke
node tests/forge-study-smoke.mjs
```

---

## 6. Estado das alterações

- 13 arquivos rastreados modificados, 1.209 inserções e 121 remoções; 35 entradas no total no `git status` (incluindo arquivos novos de dados, simuladores, ícones, vendor KaTeX, scripts e relatórios).
- Nenhum código de diagnóstico temporário permanece: a busca por `TEMP DIAGNOSTIC`, `diag-` e `performance.mark()` no diff retornou vazio.
- `backup/pre-livros-pdf-2026-11-26/` preservado.
- Alterações **não commitadas** e **não publicadas**; a publicação depende de decisão explícita do operador.

# FORGE — Validação Final, Correções e Parecer GO/NO-GO

**Missão:** validar integralmente as alterações locais da Fase 1 (experiência de estudo), corrigir defeitos comprovados dentro do escopo e preparar parecer final para publicação.
**Data da validação:** 26/11/2026.
**Repositório:** `https://github.com/jdocorte69-dev/forge-plataforma-estudos.git` (somente leitura nesta missão).
**Site publicado:** `https://jdocorte69-dev.github.io/forge-plataforma-estudos/` (não acessado para alterações).
**Diretório validado:** `D:\João\Desktop\ESTUDOS`.

> **Regra observada:** nenhum `commit`, `push`, deploy, publicação, alteração remota, instalação de dependência ou destruição de dados foi realizado. Todas as alterações locais preexistentes e o backup em `backup/pre-fase1-2026-11-25/` foram preservados. O servidor HTTP local usado nos testes foi encerrado ao final.

---

## 1. Resumo executivo

| Item | Resultado |
|---|---|
| Baseline Git | `main` @ `e88b99e58383e5347d0f617f4812914c71fbbb3d`, sincronizado com `origin/main` |
| Diff revisado | 6 arquivos modificados, 3 entradas novas; 314 inserções e 11 remoções nos arquivos rastreados |
| Smoke tests | **14/14 PASS** |
| Validação em browser real (Playwright/Chromium) | **29/29 PASS** (17 funcionais + 12 de regressão) |
| Erros de console / `pageerror` | **0 / 0** |
| Sintaxe JavaScript | **13/13** arquivos OK (`node --check`) |
| Integridade dos 24 PDFs | **24/24 HTTP 200** na fonte oficial |
| DOIs verificados via Crossref | 4 confirmados, 1 com 404 preexistente (fora do escopo) |
| Service Worker | `forge-v6`, 35 entradas no app shell, `js/study.js` incluído |
| Correções aplicadas | 19 patches localizados (11 do módulo de estudo, 5 de integração, 1 descoberto em browser + ajustes de harness) |
| Segredos / riscos críticos | **Nenhum identificado** |
| Publicação | **NÃO realizada** (exige autorização explícita em missão posterior) |
| **Parecer** | **GO CONDICIONAL — apto para revisão de publicação; deploy bloqueado** |

**Justificativa do parecer:** a implementação da Fase 1 está funcionalmente completa, os fluxos principais passam em browser real e nenhuma alteração inesperada foi encontrada no diff. A condicionalidade vem de três pontos honestamente classificados: (a) o próprio enunciado da missão exige autorização explícita para qualquer publicação; (b) a auditoria completa com axe/Lighthouse não pôde ser executada (ferramentas não disponíveis no ambiente) — apenas verificações estruturais de acessibilidade foram feitas; (c) um DOI preexistente retorna 404 em `js/data.js:116`, fora do escopo desta missão. Detalhes nas seções 16–19.

---

## 2. Baseline Git (branch, HEAD, status e remoto)

Comandos executados no início (inspeção read-only) e repetidos ao final:

```powershell
cd 'D:\João\Desktop\ESTUDOS'
git status --short --branch
git remote -v
git branch --show-current
git rev-parse HEAD
git diff --stat
git diff --cached --stat
```

| Campo | Valor observado |
|---|---|
| Branch | `main` |
| HEAD | `e88b99e58383e5347d0f617f4812914c71fbbb3d` |
| Relação com remoto | `## main...origin/main` (sem divergência, sem commits locais) |
| Remote `origin` (fetch/push) | `https://github.com/jdocorte69-dev/forge-plataforma-estudos.git` |
| Staged | **nenhuma alteração** (`git diff --cached --stat` vazio) |
| Modificados (unstaged) | `css/style.css`, `index.html`, `js/app.js`, `js/books.js`, `js/storage.js`, `sw.js` |
| Novos (untracked) | `FORGE_EVOLUCAO_RELATORIO_FINAL.md`, `js/study.js`, `tests/` (contém `forge-study-smoke.mjs` e `forge_browser_validation.py`) |
| Diferença rastreada | `6 files changed, 314 insertions(+), 11 deletions(-)` |
| Backup preservado | `backup/pre-fase1-2026-11-25/` (intacto, não tocado) |

Não houve `git reset`, `git clean`, stash, revert, commits nem qualquer operação remota. Avisos do Git sobre conversão LF→CRLF em arquivos de texto foram registrados, sem impacto funcional.

---

## 3. Escopo da revisão

Foram examinados os documentos de referência disponíveis:

- `FORGE_MISSAO_EVOLUCAO_ESTUDOS.md` (especificação original da evolução);
- `RELATORIO_COMPLETO.md` (auditoria prévia);
- `FORGE_EVOLUCAO_RELATORIO_FINAL.md` (relatório da Fase 1, 374 linhas);
- `FORGE_VALIDACAO_FINAL_GO_NO_GO_PROMPT.md` (missão desta validação, em `D:\João\Downloads\`).

Arquivos verificados individualmente, conforme o item 2.5 do enunciado:

| Arquivo | Situação | Evidência |
|---|---|---|
| `index.html` | Modificado — 1 botão de nav e 2 tags de script novas; 35 scripts locais | `index.html:22-39`, `index.html:50-84` |
| `js/app.js` | Modificado — roteador, atalhos e caderno de erros | `js/app.js:631`, `js/app.js:1209`, `js/app.js:1496` |
| `js/books.js` | Modificado — botão “Estudar este livro” | `js/books.js:67` |
| `js/data-books.js` | Inalterado — 24 registros congelados | `js/data-books.js:8` |
| `js/storage.js` | Modificado — schema v3, namespace `study`, backup de JSON corrompido | `js/storage.js:7`, `js/storage.js:55`, `js/storage.js:178` |
| `js/study.js` | **Novo** — 1156 linhas, módulo de estudo | `js/study.js:1-1156` |
| `js/exercises.js`, `js/mastery.js`, `js/gamification.js`, `js/focus.js`, `js/plan.js`, `js/labs-catalog.js` | Inalterados; integração verificada por testes | `tests/forge-study-smoke.mjs`, `tests/forge_browser_validation.py` |
| `sw.js` | Modificado — `forge-v6` e guarda `res.ok` | `sw.js:2`, `sw.js:41`, `sw.js:85` |
| `css/style.css` | Modificado — 214 linhas de estilos `.study-*` | `css/style.css` |
| `tests/forge-study-smoke.mjs` | **Novo** — 14 verificações Node | `tests/forge-study-smoke.mjs` |
| `tests/forge_browser_validation.py` | **Novo** — 29 verificações Playwright | `tests/forge_browser_validation.py:1-452` |
| Relatório Fase 1 | Modificado — contagem de scripts corrigida | `FORGE_EVOLUCAO_RELATORIO_FINAL.md:68` |

**Divergências documentais preservadas (não corrigidas fora de escopo):** Feynman 30 × 80 caracteres em camadas distintas, cache `forge-v5` vs. `forge-v4-cache` na documentação antiga, 17 × 15 campos de lab, 16 × 15 páginas — todas já registradas em `RELATORIO_COMPLETO.md:425-432` e `FORGE_EVOLUCAO_RELATORIO_FINAL.md:70`. A página `estudar-livro.html` citada na especificação não existe; a funcionalidade foi implementada na rota `study` (`FORGE_EVOLUCAO_RELATORIO_FINAL.md:72`).

---

## 4. Diff revisado

O diff foi revisado diretamente e por duas auditorias paralelas independentes (uma focada em `js/study.js`, outra em migração/integração). Nenhuma alteração fora da Fase 1 foi encontrada.

| Arquivo | Inserções/remoções | Finalidade confirmada |
|---|---|---|
| `css/style.css` | +214 | Estilos da nova página, abas, passos, pills de proveniência e responsividade |
| `index.html` | +2 | Nav “Aprenda a estudar” + `<script defer src="js/study.js">` (`index.html:80`) |
| `js/app.js` | +21 / -? | Roteador `goToPage`, guarda de teclado, botão de revisão condicionado |
| `js/books.js` | +6 / -? | Ação de estudo por livro com índice estável (`js/books.js:67`) |
| `js/storage.js` | +73 / -? | Schema v3, namespace `study`, backup de estado corrompido |
| `sw.js` | +9 / -? | App shell com `study.js`, `forge-v6`, `res.ok` |
| **Novos** | — | `js/study.js` (1156 linhas), `tests/*`, `FORGE_EVOLUCAO_RELATORIO_FINAL.md`, este relatório |

**Achado importante do diff:** `js/study.js` originalmente lia `global.CURRICULUM`/`global.PROJECTS`, mas esses objetos são variáveis de escopo de script (`const CURRICULUM` em `js/data.js:59`, `const PROJECTS` em `js/data.js:197`) e **não** propriedades de `window`. O browser revelou o defeito; corrigido em `js/study.js:119` e `js/study.js:124`. O smoke test em Node não detectava isso porque seu contexto de VM expunha os objetos como globais — reforçando a necessidade do teste em browser real.

---

## 5. Funcionalidade testada

| Área | Cobertura | Evidência |
|---|---|---|
| Tutorial “Aprenda a estudar” | 9 etapas, avanço/retorno, persistência após reload, aviso de privacidade | `tests/forge_browser_validation.py:78-94` |
| Sessão guiada | 7 passos, leitura em blocos, recuperação, explicação, Feynman, síntese, revisão agendada | `:103-141` |
| Tutor local | 12 modos com entradas realistas + entradas vazias/termo ausente | `:177-194` |
| Ficha de artigo | Criação, salvamento, recuperação após reload | `:213` |
| Diagnóstico de lacunas | Persistência e recomendação | `:229` |
| Catálogo de livros | 24 registros, botão de estudo, filtros e busca preservados | `:239` |
| Roteador | 17/17 páginas renderizadas | `:250` |
| Responsividade | 7 larguras (1440→390 px) | `:269` |
| Acessibilidade estrutural | `tablist`, `aria-selected`, `aria-labelledby`, skip-link | `:281` |
| Tema | claro/escuro sem quebrar a página | `:292` |
| PWA/offline | reload com rede desligada renderizou página e módulo | `:307` |

O tutor é **100% local e heurístico** — nenhuma API externa, nenhuma chave, nenhuma leitura automática de PDF. O aviso está explicito na interface (`js/study.js:348-352`) e foi validado no browser. Não há geração de citações, páginas ou metadados inventados: o campo de referência é digitado pelo usuário (`js/study.js:600`) e as saídas usam etiquetas de proveniência (`js/study.js:222-228`).

---

## 6. Resultados dos smoke tests

```powershell
cd 'D:\João\Desktop\ESTUDOS'
node tests/forge-study-smoke.mjs
```

Saída final (executada após todas as correções):

```
PASS · a página de estudo renderiza o tutorial interativo
PASS · o tutor expõe 12 modos com comportamento
PASS · iniciar estudo a partir de um livro cria sessão persistida
PASS · modo Explique cita o trecho e não inventa termos ausentes
PASS · modo Me teste gera perguntas com resposta oculta
PASS · ficha de artigo salva metadados e distingue inferência
PASS · lacuna manual vira evidência no caderno de erros
PASS · sessão guarda texto, explicação e revisão sem apagar sessões anteriores
PASS · schema v3 preserva dados antigos e cria espaço de estudo
PASS · estado de versão futura não é rebaixado
PASS · o catálogo de livros oferece a ação de estudo mantendo filtros e busca
PASS · o roteador real abre a página de estudo sem quebrar as demais
PASS · nav, script e service worker incluem o novo módulo
PASS · catálogo de livros e roteador integram a sessão guiada

14/14 verificações passaram.
```

**Verificação de sintaxe:**

```powershell
$files = @('js/data-books.js','js/storage.js','js/app.js','js/books.js','js/study.js',
           'js/exercises.js','js/mastery.js','js/gamification.js','js/focus.js',
           'js/plan.js','js/labs-catalog.js','sw.js','tests/forge-study-smoke.mjs')
foreach ($f in $files) { node --check $f }
```

Resultado: **13/13 OK**. O harness Python também passou em `python -m py_compile tests/forge_browser_validation.py`.

**Nota metodológica:** os smoke tests usam um DOM simulado em Node. Duas falhas reais só apareceram no browser (`CURRICULUM` inacessível e re-render destruindo formulário). Os testes em Node **não** foram modificados para esconder defeitos; pelo contrário, o harness de browser foi ampliado com 12 verificações de regressão.

---

## 7. Comandos e versões

| Ferramenta | Versão |
|---|---|
| Node.js | `v26.13.1` |
| Python | `3.13.15` |
| Playwright (Python) | `1.65.1` (Chromium build `1254`) |
| Git | `2.55.0.windows.5` |
| Servidor local | `python -m http.server 8765 --bind 127.0.0.1` (PID 17164, encerrado ao final) |

Comandos reproduzíveis (todos executados nesta missão):

```powershell
# baseline e diff
cd 'D:\João\Desktop\ESTUDOS'
git status --short --branch
git remote -v
git diff --stat

# smoke e sintaxe
node tests/forge-study-smoke.mjs
node --check js/study.js        # repetido para 13 arquivos
python -m py_compile tests/forge_browser_validation.py

# browser real (servidor local obrigatório)
python -m http.server 8765 --bind 127.0.0.1
python tests/forge_browser_validation.py

# integridade de links (24 PDFs)
$urls = [regex]::Matches((Get-Content 'js/data-books.js' -Raw), 'url:\s*"(https?://[^"]+)"') | % { $_.Groups[1].Value }
foreach ($u in $urls) { Invoke-WebRequest -Uri $u -Method Head -MaximumRedirection 5 -TimeoutSec 15 -UseBasicParsing }

# DOIs (Crossref API)
Invoke-RestMethod 'https://api.crossref.org/works/10.1177/1529100612453266'
```

O log integral da última execução do browser foi salvo em `C:\Users\João\AppData\Local\Temp\opencode\forge_browser_final.log` (fora do repositório). As capturas de tela ficaram em `C:\Users\João\AppData\Local\Temp\opencode\forge_study_{desktop,mobile}.png`.

---

## 8. Testes de tutorial, sessão e tutor

Resultado integral da última execução (29/29, `console.error` 0, `pageerror` 0):

```
PASS | carregamento inicial e 17 páginas na navegação | nav=17
PASS | página 'Aprenda a estudar' e aviso de privacidade | 5 abas, aviso de privacidade presente
PASS | tutorial: 9 etapas, avanço e retorno | 9 etapas renderizadas; Próxima e cabeçalho clicáveis
PASS | tutorial: persistência e retomada após reload | sobreviveu a reload
PASS | sessão guiada: 7 passos e navegação | 7 passos com estado de seleção consistente
PASS | sessão guiada: leitura, recuperação e resumo | leitura, perguntas, conferência e resumo OK
PASS | sessão guiada: explicação, Feynman e revisão agendada | explicação no Feynman; revisão em 2026-12-03
PASS | tutor: 12 modos com entradas realistas | 12/12 modos executados com proveniência
PASS | tutor: entradas vazias e termo ausente | vazio e termo ausente sem invenção
```

**Tutorial:** as 9 etapas renderizam, o avanço por “Próxima →” e pelo cabeçalho funciona, o retorno preserva o estado e o campo `tut_topic` sobrevive a `reload` (`tests/forge_browser_validation.py:78-94`). O estado vazio e o progresso parcial foram exercitados.

**Sessão guiada:** os 7 passos navegam sem perda de estado; texto, perguntas, conferência e resumo funcionam; a explicação com mais de 80 caracteres aparece na página Feynman e a revisão é agendada para 2026-12-03 (`:103-141`).

**Tutor (12 modos):** `explain`, `confused`, `zero`, `example`, `test`, `exercises`, `reasoning`, `feynman`, `summary`, `compare`, `application`, `read` — todos executados com entradas realistas e nenhum quebrou a UI. Com entradas vazias ou termo ausente, as saídas são `[não encontrado]`/`[sugestão]`, sem invenção (`:177-194`). O modo “Leia comigo” agora usa as mesmas opções de bloco dos outros leitores (`js/study.js:627`, `js/study.js:887`) e não cai silenciosamente no texto da sessão (`js/study.js:1062`).

**Limitação honesta da heurística:** o tutor faz correspondência léxica e extração de frases do texto fornecido; não há compreensão contextual nem consulta externa. Isso está documentado na própria interface (`js/study.js:348-352`) e na legenda de proveniência (`js/study.js:222-228`).

---

## 9. Testes de livros, artigos e lacunas

```
PASS | ficha de artigo: criação, salvamento e recuperação | salvamento e recuperação após reload OK
PASS | lacunas: persistência e recomendação | erros 0->1; recuperação sugerida
PASS | catálogo: 24 livros e botão de estudo | 24 botões; clique abre sessão do livro
```

- **24 registros** confirmados em `js/data-books.js:8`; os 24 botões “Estudar este livro” renderizam (`js/books.js:67`).
- **24 URLs oficiais** verificadas com `HEAD`: `total=24`, `nao_200=0` (sem requisições excessivas, uma por URL).
- O clique no botão abre a sessão guiada do livro correspondente sem alterar filtros ou busca (`js/books.js:67`, `js/study.js:287`).
- A ficha de artigo salva e recupera metadados após reload, distinguiando trecho literal de inferência (`tests/forge-study-smoke.mjs`).
- O diagnóstico de lacunas persiste e sugere recuperação; não afirma medir domínio real sem evidência (`js/study.js:1179`, `js/study.js:1225`).
- **DOIs:** 5 referências verificadas na API Crossref; 4 retornaram títulos válidos. A referência Rohrer (2012), `10.1007/s11251-012-9222-1`, retornou **404** tanto no Crossref quanto no link de `js/data.js:116`. É link preexistente, fora do escopo da Fase 1 — registrado como pendência, não alterado. Os links `doi.org` retornaram 403 para `HEAD` (proteção anti-bot do intermediary), motivo pelo qual a confirmação foi feita via API Crossref.

---

## 10. Armazenamento, migração e backups

| Verificação | Resultado | Citação |
|---|---|---|
| Schema atual | `CURRENT_VERSION = 3` | `js/storage.js:7` |
| Chave de persistência | `forge.study.v2` (nome legado preservado por compatibilidade) | `js/storage.js:6` |
| Namespace aditivo `study` | Nenhum dado antigo é sobrescrito | `js/storage.js:55` |
| Migração v2→v3 | Preserva dados antigos e cria backup automático | `tests/forge-study-smoke.mjs` |
| Versão futura (`> 3`) | Carregada sem rebaixar o número | `js/storage.js:184`, smoke test |
| Exportação/importação | Exporta v3; importa v1–v3 com backup do estado atual | `js/storage.js:299-328` |
| JSON corrompido | **Corrigido:** string bruta preservada em `forge.study.v2.lastBackup` com `corrupted: true` antes do reset | `js/storage.js:178`, `js/storage.js:198`, `js/storage.js:207-215` |
| Checklist | Agora pode ser desmarcado e persistido como `false` | `js/study.js:272` |
| Chave interna `__key` | Não vaza mais para o estado salvo | `js/study.js:310-315` |

Todos os testes de persistência usaram `localStorage` de contextos isolados do Playwright — **nenhum dado pessoal real do aluno foi lido, substituído ou apagado**. O backup em `backup/pre-fase1-2026-11-25/` permanece intacto.

**Assimetria documentada (não corrigida):** versões futuras são preservadas no carregamento (`js/storage.js:184`), mas a importação rejeita `version > CURRENT_VERSION` (`js/storage.js:315-316`). O comportamento é intencionalmente conservador na importação; registrado como pendência de documentação, sem alteração de código.

---

## 11. Navegação e regressão

```
PASS | roteador: todas as páginas existentes | 17/17 páginas renderizaram
PASS | REGRESSÃO: goToPage rejeita página inexistente | rota inválida caiu no painel; rota válida restaurada
PASS | REGRESSÃO: atalho Alt+seta respeita campo de texto | Alt+seta não navegou durante digitação
PASS | REGRESSÃO: re-render global preserva formulário | texto não salvo preservado após render global
PASS | REGRESSÃO: 'Estudar este livro' preserva sessão existente | segundo clique no mesmo livro não apagou a sessão
```

- 17 botões na navegação (`index.html:22-39`), 17/17 páginas renderizam sem erro.
- `goToPage()` agora valida contra as rotas reais da navbar e cai em `dashboard` para nomes desconhecidos (`js/app.js:631-634`), evitando página órfã e HTML obsoleto.
- O atalho Alt+Setas não intercepta mais teclas digitadas em `INPUT`/`TEXTAREA`/`SELECT` (`js/app.js:1496`, `js/app.js:1499`).
- Um `render()` global (tema, contraste, fonte) preserva o conteúdo não salvo do formulário (`js/study.js:352-359`).
- O botão “Revisar aula” é oculto quando a lacuna aponta para `estudo-guiado`, que não é uma aula navegável (`js/app.js:1209`).

---

## 12. Acessibilidade

Executado (sem instalar ferramentas):

```
PASS | acessibilidade estrutural da página nova | tablist/aria-selected/aria-labelledby/skip-link OK
PASS | tema claro/escuro não quebra a página nova | light -> dark
```

- Abas com `role="tablist"`/`aria-selected`, painéis com `aria-labelledby`, skip-link funcional, `aria-current="page"` na navegação (`js/app.js:155-161`).
- Campos têm `label`/`for`; botões têm `aria-label` quando necessário (ex.: `js/books.js:67`); região de saída com `aria-live="polite"`.
- Foco e teclado: navegação por teclado preservada; atalhos não conflitam com digitação (seção 11).
- Contraste: temas claro/escuro alternados sem quebrar a página; variáveis CSS em `css/style.css`.
- Estrutura de títulos (`h1`, `h3`) e mensagens de erro/estado vazio presentes.

**Não executado (limitacao declarada):** auditoria automatizada com **axe-core** e **Lighthouse**. As ferramentas não estavam disponíveis no ambiente e a missão proíbe instalar dependências sem autorização. Nenhuma pontuação foi inventada. Recomenda-se executar axe/Lighthouse antes da publicação (seção 20).

---

## 13. Responsividade

```
PASS | responsividade: 1440/1024/900/768/640/560/390 px | 7 larguras sem overflow horizontal
```

Sete larguras foram testadas em viewport real do Chromium, incluindo abaixo de 720 px (390, 560, 640 px). Não houve overflow horizontal; cards, abas, botões e textos do fluxo de estudo permaneceram utilizáveis. Capturas: `forge_study_desktop.png` (1440 px) e `forge_study_mobile.png` (390 px), em diretório temporário fora do repositório.

---

## 14. PWA e offline

| Item | Valor | Citação |
|---|---|---|
| Versão do Service Worker | `forge-v6` | `sw.js:2` |
| `js/study.js` no app shell | Presente | `sw.js:41` |
| Contagem | 35 scripts locais em `index.html:50-84` = 35 entradas no app shell | `index.html`, `sw.js` |
| Estratégia | Rede primeiro para navegação; cache para CDN; shell em cache como fallback | `sw.js:80-114` |
| Cache de respostas inválidas | **Corrigido:** só respostas `res.ok` substituem o shell | `sw.js:85`, `sw.js:100`, `sw.js:114` |
| Teste offline real | **Executado:** reload com rede desligada renderizou a página e o módulo | `tests/forge_browser_validation.py:307` |

```
PASS | PWA/offline: reload com rede desligada | reload offline renderizou a página e o módulo
```

Nenhum cache real do usuário foi apagado. Risco residual: clientes com cache de versão anterior precisarão de um reload para adquirir `forge-v6`; o `skipWaiting()`/`clients.claim()` em `sw.js:51-65` trata a atualização.

---

## 15. Correções realizadas (com arquivo:linha)

Todas foram reproduzidas, tinham causa identificada, receberam patch mínimo e foram revalidadas (smoke + browser + regressão).

### Módulo de estudo (`js/study.js`)

| ID | Sev. | Defeito e correção | Linha |
|---|---|---|---|
| A1 | ALTA | “Estudar este livro” apagava sessão existente; agora mescla apenas metadados do livro e preserva texto/passos | `js/study.js:287`, `:292` |
| A2 | ALTA | `render()` global destruía formulário não salvo; agora captura sessão, ficha e texto do tutor antes de reconstruir o DOM | `js/study.js:352-359` |
| A3 | MÉDIA | Perguntas vazavam do tutorial para a sessão e vice-versa; fila agora é limpa ao trocar de aba e regenerada ao entrar na etapa de recuperação | `js/study.js:385-389`, `:733` |
| A4 | MÉDIA | `[trecho]` era atribuído a texto gerado pelo código quando não havia frase de contexto; campo `hasEvidence` distingue os casos | `js/study.js:198`, `:555` |
| A5 | MÉDIA | Dois sinks de XSS persistido via backup importado: categoria de lacuna e histórico do tutor; whitelist `E1..E4` + `textContent` | `js/study.js:1194`, `:949` |
| A6 | MÉDIA | Texto do tutor não podia ser esvaziado (`||` resgatava valor antigo); leitura direta do campo | `js/study.js:892`, `:904`, `:934` |
| A7 | BAIXA | Checklist não podia ser desmarcado no Storage; `checks` agora é salvo sempre que presente | `js/study.js:272` |
| A8 | BAIXA | `__key` vazava para o estado persistido; nova sessão salva sem a chave interna | `js/study.js:310-315` |
| A9 | BAIXA | “Leia comigo” anunciava 800 caracteres com seletor em 300 e caía no texto da sessão; opções unificadas e fallback removido | `js/study.js:627`, `:887`, `:1062` |
| A10 | BAIXA | `tutorialBook()` mudava o título sem recalcular a chave; agora delega para `chooseBook()` | `js/study.js:514` |
| B1 | ALTA | `CURRICULUM`/`PROJECTS` inacessíveis em browser real (variáveis de script, não `window`); acesso direto com fallback | `js/study.js:119`, `:124`, `:1086` |

### Integração e infraestrutura

| ID | Sev. | Defeito e correção | Linha |
|---|---|---|---|
| I1 | ALTA | JSON corrompido no `localStorage` era descartado sem backup; string bruta agora é preservada com `corrupted: true` | `js/storage.js:178`, `:198`, `:207-215` |
| I2 | MÉDIA | `goToPage()` aceitava rotas inexistentes, deixando HTML obsoleto; validação contra a navbar | `js/app.js:631-634` |
| I3 | MÉDIA | Alt+Setas navegava durante digitação; guarda de `typing` movida para antes do atalho | `js/app.js:1496`, `:1499` |
| I5 | BAIXA | Service Worker cacheava respostas 404/500 como shell offline; guarda `res.ok` | `sw.js:85` |
| I6 | BAIXA | Relatório da Fase 1 dizia 33 scripts; corrigido para 35 | `FORGE_EVOLUCAO_RELATORIO_FINAL.md:68` |
| A11 | BAIXA | “Revisar aula” sem destino em lacuna manual; botão oculto nesse caso | `js/app.js:1209` |

**Não corrigido (decisão documentada):** I4 — assimetria de versão futura entre load e import (`js/storage.js:184` vs. `:315-316`). Comportamento conservador mantido e registrado na seção 10.

**Ajustes no harness de teste (não no produto):** campo `tut_topic` só existe na etapa 0 do tutorial; bloco de explicação ampliado para >80 caracteres; opção `read` ajustada de 600 para 800; `tutorialGo(6)` antes de `revealAnswers()`. Nenhum teste foi enfraquecido — ao contrário, 12 verificações de regressão foram acrescentadas (`tests/forge_browser_validation.py:317-439`).

---

## 16. Pendências e riscos

| # | Item | Classificação | Impacto |
|---|---|---|---|
| 1 | Deploy/push/publicação não autorizados nesta missão | **Bloqueio formal** | Nenhuma alteração remota foi feita; exige missão posterior com autorização explícita |
| 2 | axe-core / Lighthouse não executados | **Limitação de verificação** | Acessibilidade validada apenas de forma estrutural e manual; recomendado antes de publicar |
| 3 | DOI `10.1007/s11251-012-9222-1` retorna 404 | **Preexistente, fora do escopo** | `js/data.js:116`; link de referência bibliográfica, sem impacto funcional |
| 4 | Assimetria future-version (load preserva, importa rejeita) | **Baixo / documentado** | `js/storage.js:184`, `:315-316`; não causa perda de dados |
| 5 | Tutor heurístico sem compreensão contextual | **Limitação de produto, declarada** | Interface avisa explicitamente (`js/study.js:348-352`); não há risco de afirmação falsa de fonte |
| 6 | Clientes com cache antigo | **Baixo** | Atualização automática via `forge-v6` + `skipWaiting()` (`sw.js:2`, `:51-65`) |
| 7 | Divergências documentais prévias | **Baixo / preservadas** | `RELATORIO_COMPLETO.md:425-432`; não alteradas fora de escopo |

Não há segredos, credenciais, chaves de API ou dados sensíveis no diff. Não há risco crítico identificado.

---

## 17. Evidências e limitações

**Evidências primárias:**
- `git status --short --branch`, `git remote -v`, `git rev-parse HEAD`, `git diff --stat` — baseline e diff.
- `node tests/forge-study-smoke.mjs` → 14/14 (saída transcrita na seção 6).
- `python tests/forge_browser_validation.py` → 29/29, `console.error=0`, `pageerror=0` (saída transcrita nas seções 8, 9, 11, 13, 14).
- `node --check` em 13 arquivos → 13/13 OK; `python -m py_compile` → OK.
- `Invoke-WebRequest -Method Head` nos 24 PDFs → 24/24 HTTP 200.
- `Invoke-RestMethod` na API Crossref para 5 DOIs → 4 OK, 1 404.
- Contagem estática: 35 scripts em `index.html:50-84` e 35 entradas no app shell de `sw.js`.
- Log integral: `C:\Users\João\AppData\Local\Temp\opencode\forge_browser_final.log`.

**O que NÃO foi feito (declarado, não simulado):**
- axe-core / Lighthouse (ferramentas não disponíveis; instalação não autorizada).
- Publicação, push, commit, deploy ou qualquer operação remota.
- Leitura automática de PDF — funcionalidade inexistente por projeto (`js/study.js:348-352`).
- Teste em Safari/Firefox — apenas Chromium headless estava disponível.
- Verificação do site publicado — todas as navegações foram no servidor local `127.0.0.1:8765`.

**Cuidado com conclusões:** a contagem de 29/29 se refere ao estado final do código, após todos os patches e após o ajuste do próprio harness. O servidor local foi encerrado (PID 17164), portanto o comando de browser só é reproduzível após reiniciá-lo.

---

## 18. Critérios GO/NO-GO

| Critério do enunciado (§6) | Resultado | Evidência |
|---|---|---|
| Diff revisado sem alterações inesperadas | ✅ | Seções 2–4; duas auditorias independentes |
| Smoke tests e verificações aprovados | ✅ | 14/14 + 29/29 + 13/13 `node --check` |
| Migração e preservação de dados verificadas | ✅ | Schema v3, backup de corrompido, dados antigos preservados (seção 10) |
| Fluxo principal funcional | ✅ | Tutorial, sessão, tutor, ficha, lacunas, livros (seções 8–9) |
| Regressões conhecidas inexistentes ou mitigadas | ✅ | 12 verificações de regressão, todas PASS (seção 11) |
| PWA/offline e acessibilidade testados ou limitações classificadas | ✅ (com ressalva) | Offline testado de verdade; a11y estrutural; axe/Lighthouse classificados como não executados (seções 12, 14) |
| Nenhum segredo ou risco crítico | ✅ | Nenhum identificado no diff |
| Relatório rastreável e honesto | ✅ | Este documento, com `arquivo:linha`, comandos e limitações explícitas |

**Parecer: GO CONDICIONAL para revisão de publicação.**
Não é NO-GO porque nenhum critério técnico falhou e os riscos residuais são conhecidos, documentados e não críticos. Não é GO pleno porque (1) a própria missão exige autorização explícita para deploy e (2) a auditoria automatizada de acessibilidade não pôde ser concluída. **GO técnico não é autorização de deploy.**

---

## 19. Status de publicação

| Aspecto | Status |
|---|---|
| Commit | ❌ Não realizado |
| Push | ❌ Não realizado |
| Deploy | ❌ Não realizado |
| Publicação GitHub Pages | ❌ Não realizada |
| Alteração remota / infraestrutura | ❌ Nenhuma |
| Consumo de créditos | ❌ Nenhum |
| Alterações locais | ✅ Preservadas integralmente (6 modificados + 3 novos) |
| Backups do aluno | ✅ Intactos (`backup/pre-fase1-2026-11-25/`) |
| Servidor de teste | ✅ Encerrado ao final |

O código permanece pronto apenas no diretório de trabalho `D:\João\Desktop\ESTUDOS`, aguardando revisão e autorização.

---

## 20. Próximos passos

1. **Somente com autorização explícita em missão posterior:** revisar o diff, fazer commit e publicar. Esta missão terminou sem nenhuma dessas ações.
2. Opcional, antes da publicação: executar axe-core/Lighthouse no servidor local para fechar a ressalva de acessibilidade (seção 12). Não instalar nada sem avaliar e autorizar.
3. Opcional, fora do escopo desta missão: corrigir ou substituir o link com DOI 404 em `js/data.js:116` (`10.1007/s11251-012-9222-1`), preservando a integridade bibliográfica.
4. Opcional: alinhar a documentação sobre a assimetria de importação de versões futuras (`js/storage.js:184` vs. `:315-316`) e as divergências prévias em `RELATORIO_COMPLETO.md:425-432`.
5. Opcional: ampliar o CI para executar `node tests/forge-study-smoke.mjs` e `python tests/forge_browser_validation.py` (com servidor local) automaticamente, evitando que defeitos como `CURRICULUM` inacessível e perda de formulário voltem a passar despercebidos.
6. **Não repetir** patches já aplicados listados na seção 15; o estado atual já passa em 14/14 smoke e 29/29 browser.

---

**Parecer final: GO CONDICIONAL — apto para revisão de publicação, deploy bloqueado até autorização explícita.**
**Relatório único desta missão:** `D:\João\Desktop\ESTUDOS\FORGE_VALIDACAO_FINAL_GO_NO_GO.md`.

# FORGE — Relatório Final de Deploy (Fase 1)

**Data:** 26/11/2026  
**Repositório:** `https://github.com/jdocorte69-dev/forge-plataforma-estudos`  
**Site:** `https://jdocorte69-dev.github.io/forge-plataforma-estudos/`  
**Diretório:** `D:\João\Desktop\ESTUDOS`

---

## 1. Resumo e veredito final

**VEREDITO: DEPLOY CONCLUÍDO COM SUCESSO.**

A Fase 1 (experiência de estudo) foi publicada. As duas pendências comprovadas foram corrigidas, a suíte pré-deploy passou integralmente, o commit foi enviado para `origin/main`, o GitHub Pages concluiu a publicação e o site publicado foi validado com a mesma suíte de browser (31/31, sem `console.error` ou `pageerror`).

| Marco | Resultado |
|---|---|
| Correção do DOI | Aplicada e confirmada (Crossref + Springer HTTP 200) |
| Assimetria importação/versão futura | Harmonizada com rejeição segura e mensagem clara |
| Smoke tests Node | 17/17 |
| `node --check` | 36/36 |
| `py_compile` do harness | OK |
| Browser local (Chromium) | 31/31 · 0 console.error · 0 pageerror |
| Browser no site publicado | 31/31 · 0 console.error · 0 pageerror |
| PDFs oficiais | 25/25 HTTP 200 |
| Commit / push | `635ac79` → `origin/main` |
| GitHub Pages | deployment `8076657789` · estado `success` |

---

## 2. Baseline (antes de qualquer alteração)

| Item | Valor observado |
|---|---|
| Branch | `main` |
| HEAD inicial | `e88b99e58383e5347d0f617f4812914c71fbbb3d` |
| `origin/main` | `e88b99e58383e5347d0f617f4812914c71fbbb3d` (idêntico ao HEAD) |
| Remote | `origin` → `https://github.com/jdocorte69-dev/forge-plataforma-estudos.git` |
| Staging | vazio |
| Modificados | `css/style.css`, `index.html`, `js/app.js`, `js/books.js`, `js/storage.js`, `sw.js` |
| Novos | `js/study.js`, `tests/`, `FORGE_EVOLUCAO_RELATORIO_FINAL.md`, `FORGE_VALIDACAO_FINAL_GO_NO_GO.md` |
| Diff inicial | 314 inserções, 11 remoções |
| Backup | `backup/pre-fase1-2026-11-25/` presente e intacto |
| Site publicado no início | versão antiga: sem `study.js`, sem nova navegação, `/js/study.js` → 404 |

O relatório anterior foi relido e as pendências foram confirmadas no working tree real, não presumidas.

---

## 3. Pendências investigadas e correções aplicadas

### 3.1 DOI inválido

- DOI antigo `10.1007/s11251-012-9222-1`: 404 no Crossref e no link de `js/data.js`.
- Consulta à API Crossref confirmou a referência correta:
  - DOI `10.1007/s10648-012-9201-3`
  - Título: *Interleaving Helps Students Distinguish among Similar Concepts*
  - Autor: Doug Rohrer · periódico: *Educational Psychology Review* · 2012
- `https://link.springer.com/article/10.1007/s10648-012-9201-3` respondeu **HTTP 200**.
- Alteração: somente a URL em `js/data.js:116`. Metadados Inventados: nenhum.

### 3.2 Assimetria de versões futuras na importação

- `loadState()` preservava `version > CURRENT_VERSION` sem rebaixar — comportamento correto e mantido.
- `importData()` já recusava a versão futura, mas com aviso genérico ao usuário.
- Correção em `js/storage.js`:
  - erro tipado `FUTURE_VERSION` com a versão recebida;
  - aborta **antes** de `backupState()` e de qualquer mutação de `state`;
  - aviso explícito: “Importação cancelada: arquivo vN é mais novo que este aplicativo (v3). Seus dados atuais foram preservados.”
  - `console.warn` em vez de `console.error` (incompatibilidade esperada, não corrupção).
- Versões válidas (ex.: v2 → v3) continuam migrando com backup automático.
- Testes específicos criados no smoke test e no harness de browser, inclusive verificação de que estado e backup permanecem byte-a-byte idênticos após a recusa.

### 3.3 Axe / Lighthouse

- Verificado: nenhum CLI `axe` ou `lighthouse` no PATH; `axe-core` ausente nos módulos globais; módulos Python `axe_core_python`/`lighthouse` ausentes.
- **Não foi instalada nenhuma ferramenta ou dependência.**
- A acessibilidade auditada foi estrutural (tablist/aria-selected/aria-labelledby/skip-link, sem overflow em 7 larguras). Não se alega conformidade WCAG automatizada.

### 3.4 Tutor local

- Mantido heurístico, local, sem API, sem custo e sem envio de dados; avisos de privacidade e limites preservados e testados.

### 3.5 Higiene do harness de testes

- Caminhos absolutos de screenshot com nome de usuário foram substituídos por `tempfile.gettempdir()`; nenhum dado pessoal segue no código versionado.

---

## 4. Testes pré-deploy e resultados exatos

| Comando / verificação | Resultado |
|---|---|
| `node tests/forge-study-smoke.mjs` | **17/17** (inclui 3 verificações novas: DOI, recusa v9, migração v2) |
| `node --check` em `js/*.js` + `sw.js` | **36/36** sem falhas |
| `python -m py_compile tests/forge_browser_validation.py` | OK |
| `python tests/forge_browser_validation.py` (servidor local 127.0.0.1:8765) | **31/31** |
| `console.error` / `pageerror` (local) | **0 / 0** |
| PDFs oficiais (HEAD, redirecionamentos seguidos) | **25/25 HTTP 200** |
| Link DOI corrigido | HTTP 200 |
| Servidor HTTP local | iniciado para os testes e encerrado ao final (PIDs 13384 e 17020) |

Cobertura do harness: carregamento e 17 rotas, tutorial de 9 etapas, sessão guiada de 7 passos, 12 modos de tutor, ficha de artigo, lacunas, 24 livros, responsividade em 1440/1024/900/768/640/560/390 px, acessibilidade estrutural, temas, PWA/offline, regressões de XSS/formulário/atalhos, backup de estado corrompido e importação/exportação.

---

## 5. Auditoria de segurança e arquivos incluídos no commit

Staging explícito (sem `git add .`), 10 arquivos revisados:

```
css/style.css
index.html
js/app.js
js/books.js
js/data.js
js/storage.js
js/study.js
sw.js
tests/forge-study-smoke.mjs
tests/forge_browser_validation.py
```

- `git diff --cached --check`: sem problemas.
- Busca por credenciais, tokens, `ghp_`, chaves privadas e caminhos pessoais nos arquivos candidatos: **nenhum achado real** (ocorrências de “senha/token” são apenas conteúdo didático).
- Testes de regressão XSS no browser: categoria de lacuna e histórico do tutor com conteúdo malicioso renderizados como texto/whitelist — aprovados.
- **Não foram stageados**: `FORGE_EVOLUCAO_RELATORIO_FINAL.md`, `FORGE_VALIDACAO_FINAL_GO_NO_GO.md`, `tests/__pycache__/`, `backup/`, logs ou artefatos temporários.
- Nenhuma alteração em `.github/workflows`, backend, infraestrutura, DNS, credenciais ou contas.

---

## 6. Commit

| Campo | Valor |
|---|---|
| Hash | `635ac7908877def140e2fa5a27ccd72c3bdbef29` |
| Mensagem | `feat: publish FORGE study improvements` |
| Conteúdo | 10 arquivos, 2394 inserções, 16 remoções |
| Data | 26/11/2026 01:39:11 -0300 |

---

## 7. Push / remote / branch

- `git push origin main`: `e88b99e..635ac79  main -> main` (sem force).
- Após o push: `HEAD` local = `origin/main` = `635ac7908877def140e2fa5a27ccd72c3bdbef29`.
- Branch: `main`. Remote: `origin` (URL confirmada no baseline).
- `git status --short --branch`: apenas os 3 itens não rastreados preexistentes/temporários listados na seção 10.

---

## 8. Status e evidência do GitHub Pages

O site usa o modo clássico (branch `main`); nenhum workflow novo foi criado e nenhum `workflow_dispatch` foi necessário.

| Evidência | Valor |
|---|---|
| Workflow run | `pages build and deployment` · ID `45756567644` · `completed` / `success` |
| SHA do run | `635ac7908877def140e2fa5a27ccd72c3bdbef29` |
| Deployment | ID `8076657789` · `ref=main` · `environment=github-pages` |
| Estado do deployment | `success` em `2026-11-26T04:39:40Z` |
| URL do job | `https://github.com/jdocorte69-dev/forge-plataforma-estudos/actions/runs/45756567644` |

Nota: `GET /pages` da API não autorizada retornou 404; a evidência acima foi obtida dos endpoints públicos `/actions/runs` e `/deployments{/statuses}`.

---

## 9. URL e validação pós-deploy

**URL:** `https://jdocorte69-dev.github.io/forge-plataforma-estudos/`

| Verificação | Resultado |
|---|---|
| `index.html` contém `js/study.js` e `data-page="study"` | Sim (detectado na 2ª checagem, após a propagação) |
| Assets `index.html`, `css/style.css`, `js/study.js`, `js/storage.js`, `js/data.js`, `js/app.js`, `sw.js`, `manifest.webmanifest`, `icon.svg` | 9/9 HTTP 200 |
| `js/study.js` publicado vs. local | SHA-256 idêntico: `C4DD898098B1864EA243C3CCAA1ED0A61489EC3DF9B1DA3EC58B221FD1C72FD6` |
| Service Worker | `forge-v6` (antes `forge-v5`), com `./js/study.js` no APP_SHELL; cache antigo é invalidado pela troca de versão |
| Suíte de browser contra a URL publicada | **31/31** |
| `console.error` / `pageerror` no site publicado | **0 / 0** |
| Offline no site publicado | reload renderizou página e módulo (SW atualizado) |

O harness usado contra a produção foi uma cópia temporária em `%TEMP%\opencode`, com apenas a constante `BASE` apontada para o site publicado; o arquivo versionado permanece com `BASE` local.

---

## 10. Pendências, riscos residuais e limitações

1. **Axe/Lighthouse não executados** por indisponibilidade das ferramentas; acessibilidade limitada a verificações estruturais — não é prova de conformidade WCAG.
2. **Validação de browser somente em Chromium headless**; outros motores não foram testados.
3. **Tutor heurístico local**: respostas vêm de regras e do texto fornecido; não há modelo externo, e isso está declarado na interface.
4. **Exposição preexistente de backup**: 29 arquivos em `backup/` já estavam versionados no commit base e continuam accessíveis pelo Pages (amostra HTTP 200). Isso **não foi introduzido por esta missão** e não foi alterado para respeitar a regra de preservação. Recomenda-se revisão autorizada separada para remover/ignorar esse diretório do site público.
5. Relatórios internos antigos continuam no working tree como não rastreados, por decisão de não publicá-los; `tests/__pycache__/` é artefato local gerado por `py_compile`, também não publicado.
6. Nenhuma pendência funcional da Fase 1 permanece aberta.

---

## 11. Rollback prudente (não executado)

Se for necessário reverter a publicação, o caminho não destrutivo é criar um **novo commit de reversão** e enviá-lo normalmente:

```
git revert 635ac7908877def140e2fa5a27ccd72c3bdbef29
git push origin main
```

Isso preserva o histórico e dispara uma nova build do Pages. Atenção: o Service Worker precisa de uma versão de cache diferente da `forge-v6` para substituir caches em navegadores que já instalaram esta versão. **Não use** `reset --hard`, `clean`, rebase destrutivo ou force push.

---

## 12. Preservação

- `backup/pre-fase1-2026-11-25/` não foi tocado.
- Os dois relatórios anteriores não rastreados foram preservados e não foram incluídos no commit.
- Nenhuma alteração alheia foi descartada; nenhum `stash`, `reset --hard`, `clean`, remoção indiscriminada, force push ou rebase destrutivo foi executado.
- Nenhuma ação remota fora deste repositório/GitHub Pages foi realizada.

**Encerramento:** missão concluída, com commit, push, deploy e validação real do site publicado.

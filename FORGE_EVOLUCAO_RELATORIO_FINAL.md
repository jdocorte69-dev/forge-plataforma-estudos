# FORGE — Evolução para um ecossistema de aprendizagem assistido por IA

## Relatório final consolidado (uma única entrega)

**Data:** 26/11/2026  
**Repositório:** https://github.com/jdocorte69-dev/forge-plataforma-estudos  
**Site publicado (versão anterior, sem estas alterações):** https://jdocorte69-dev.github.io/forge-plataforma-estudos/  
**Diretório de trabalho:** `D:\João\Desktop\ESTUDOS`  
**Baseline Git:** `main` em `e88b99e`, `HEAD = origin/main`, árvore limpa no início da missão.  
**Escopo desta entrega:** auditoria read-only, pesquisa externa, planejamento e implementação local incremental. **Nenhuma ação remota foi executada.**

---

## 1. Resumo executivo

A FORGE já era uma plataforma de estudos robusta, frontal e offline: 9 trilhas, 71 módulos, 385 aulas, 3.850 questões, 56 laboratórios, 110 recursos, 5 rotas de leitura, 15 projetos, 80 flashcards, 24 PDFs de fonte aberta e persistência versionada em `localStorage` (`RELATORIO_COMPLETO.md:12-35`). O que faltava não era conteúdo: era uma **experiência que ensinasse o aluno a estudar** — transformar leitura passiva em recuperação ativa, explicação própria, prática e revisão agendada.

A evolução foi feita **por extensão, não por substituição**:

- o schema v3 ganhou um namespace aditivo `study` (`js/storage.js:55-61`, `:143-151`), preservando todo dado anterior;
- uma nova página **“Aprenda a estudar”** foi registrada no roteador existente (`js/app.js:141`, `:176`) e na navegação (`index.html:30`);
- o novo módulo `js/study.js` implementa tutorial interativo de 9 etapas, sessão guiada de 7 passos, tutor local com 12 modos, ficha de artigo e diagnóstico de lacunas;
- o catálogo de livros passou a oferecer “Estudar este livro” em cada um dos 24 PDFs (`js/books.js:67`), sem alterar filtros, busca ou links oficiais;
- o service worker passou a `forge-v6` e inclui o novo script no app shell (`sw.js:2`, `:41`);
- 14 testes de smoke automatizados passaram, além de checagem de sintaxe de 5 arquivos, 24/24 links de PDF com HTTP 200 e 6/6 DOIs confirmados na Crossref.

**Decisão central:** o tutor é 100% local, sem API externa, sem chaves, sem envio de documento e sem citações inventadas. Isso respeita os limites de autorização da missão (§16) e o princípio de que atividade não é domínio.

---

## 2. Baseline Git e preservação

| Verificação | Resultado |
|---|---|
| Commit inicial | `e88b99e` — `docs: corrige e detalha inventario do painel no relatorio completo` |
| Sincronização | `HEAD = origin/main`, sem divergência |
| Árvore no início | Limpa (sem modificações pendentes) |
| Operações Git destrutivas | **Nenhuma**: sem `reset`, `rebase`, `force push`, `clean`, `checkout --` ou exclusão de arquivos |
| Ações remotas | **Nenhuma**: sem `push`, deploy, publicação, abertura de PR ou alteração em GitHub Pages |
| Estado atual (local, não commitado) | 6 arquivos modificados, 2 adições: `js/study.js`, `tests/forge-study-smoke.mjs` |

Arquivos modificados: `css/style.css`, `index.html`, `js/app.js`, `js/books.js`, `js/storage.js`, `sw.js`.  
Arquivos adicionados: `js/study.js`, `tests/`.

Nenhum arquivo preexistente foi removido ou sobrescrito integralmente. Todas as edições foram pontuais (`edit`) ou adições (`write` de arquivo novo). O backup automático `forge.study.v2.lastBackup` (`js/storage.js:9`) continua intacto e foi exercitado pelos testes de migração.

---

## 3. Inventário real da plataforma

Inventory confirmado no baseline e registrado em `RELATORIO_COMPLETO.md:12-35`:

| Item | Quantidade | Referência |
|---|---:|---|
| Trilhas | 9 | `AUDITORIA.md:9-19` |
| Módulos | 71 | `AUDITORIA.md:20` |
| Aulas | 385 | `AUDITORIA.md:20` |
| Questões de múltipla escolha | 3.850 | `AUDITORIA.md:22` |
| Laboratórios | 56 | `AUDITORIA.md:25` |
| Recursos da biblioteca | 110 (8 filtros) | `AUDITORIA.md:24` |
| Termos de glossário | 34 | `AUDITORIA.md:24` |
| Rotas de leitura | 5 | `AUDITORIA.md:24` |
| Projetos integradores | 15 | `AUDITORIA.md:24` |
| Flashcards | 80 | `AUDITORIA.md:24` |
| Indicadores de domínio | 10 | `AUDITORIA.md:26` |
| PDFs de fonte aberta | 24 | `js/data-books.js:8` |
| Páginas na navegação | 16 → **17** após a evolução | `index.html:22-39`, `:30` |
| Scripts JS locais | 32 → **35** após a evolução | `index.html:50-84`, `:80` |

Divergências pré-existentes entre código e documentação permanecem registradas em `RELATORIO_COMPLETO.md:425-432` (Feynman 30 × 80 caracteres em camadas distintas, cache `forge-v5` × `forge-v4-cache` na doc antiga, 17 × 15 campos de lab, 16 × 15 páginas). **Não foram “corrigidas” à força**, pois são documentação desatualizada, não defeito de código. O cache agora é `forge-v6`, registrado neste relatório.

**Divergência adicional identificada nesta missão:** o documento de missão cita `estudar-livro.html` como página pretendida; esse arquivo **não existe no repositório**. A funcionalidade foi entregue como página `study` dentro do roteador único, evitando criar uma segunda aplicação paralela (§16 do documento de missão).

---

## 4. Auditoria das funcionalidades existentes

A auditoria prévia foi preservada em `RELATORIO_COMPLETO.md` e complementada nesta missão com leitura direta dos módulos:

| Área | Estado confirmado | Onde verificar |
|---|---|---|
| Roteamento | Página controlada por `page` + `render()`; nav via `data-page` | `js/app.js:154-160`, `:629-635` |
| Persistência | `localStorage`, chave `forge.study.v2`, schema v3, backup antes de migrar/importar | `js/storage.js:6-9`, `:130-151`, `:221` |
| Exportar/importar | Preserva 14 chaves; rejeita versões inválidas | `js/storage.js:285`, `:310-318` |
| Revisão espaçada | SM-2 em `getSpacedRepetitionCards()` e `rateCard()` | `js/exercises.js:82`, `:278-290` |
| Caderno de erros | Categorias E1–E4, refazer em +7/+30 dias | `js/app.js:1144-1158` |
| Feynman | Notas gerais em `s.feynman` / `Storage.saveGeneralNote()` | `js/app.js:615-620` |
| Domínio por evidência | Rubrica 8/10, 10 indicadores, selo exige ≥80 caracteres | `js/mastery.js:12-48`, `:808-822` |
| Gamificação | XP, nível, escudo, TMV, Pomodoro, recompensas | `js/gamification.js:338-352` |
| Modo foco | 8 etapas, timer, metas 25/150 min | `js/focus.js:702` |
| Plano de formação | Marcos e aulas personalizadas | `js/plan.js:285` |
| Laboratórios | Catálogo unificado, 3 tipos de execução, 17 campos | `js/labs-catalog.js:10-26`, `:113-114`, `:446` |
| Biblioteca e rotas | 110 recursos, 5 rotas, metadados com `verifiedAt` | `RELATORIO_COMPLETO.md:21-24`, `:422` |
| Livros em PDF | 24 PDFs legais, filtro por área/trilha/busca | `js/data-books.js:1-8`, `js/books.js:23-26` |
| PWA/offline | App shell em `sw.js`, KaTeX incluído | `sw.js:2`, `:38-48` |
| Acessibilidade prévia | 30 auditorias axe, 0 violações; Lighthouse 100/100/100 | `RELATORIO_COMPLETO.md:31-32` (auditorias anteriores, não reexecutadas nesta sessão) |

**Conclusão da auditoria:** a plataforma já possuía quase todos os mecanismos pedagógicos necessários. O trabalho não foi criar um “sistema de IA”, mas **conectar esses mecanismos a uma sequência de estudo explícita e verificável**.

---

## 5. Fontes externas pesquisadas, links e evidências

### 5.1 Ciência da aprendizagem — 6 referências, todas confirmadas na Crossref em 26/11/2026

| Referência | DOI | Verificação Crossref (título / periódico / ano) |
|---|---|---|
| Roediger & Karpicke, *Test-Enhanced Learning* | `10.1111/j.1467-9280.2006.01693.x` | OK · Psychological Science · 2006 |
| Cepeda et al., *Distributed practice in verbal recall tasks* | `10.1037/0033-2909.132.3.354` | OK · Psychological Bulletin · 2006 |
| Rohrer & Taylor, *The shuffling of mathematics problems improves learning* | `10.1007/s11251-007-9015-8` | OK · Instructional Science · 2007 |
| Chi et al., *Eliciting Self-Explanations Improves Understanding* | `10.1207/s15516709cog1803_3` | OK · Cognitive Science · 1994 |
| Dunlosky et al., *Improving Students' Learning With Effective Learning Techniques* | `10.1177/1529100612453266` | OK · Psychological Science in the Public Interest · 2013 |
| Sweller & Cooper, *The Use of Worked Examples as a Substitute for Problem Solving in Learning Algebra* | `10.1207/s1532690xci0201_3` | OK · Cognition and Instruction · 1985 |

Comando de verificação:

```powershell
$dois = @('10.1111/j.1467-9280.2006.01693.x','10.1037/0033-2909.132.3.354','10.1007/s11251-007-9015-8','10.1207/s15516709cog1803_3','10.1177/1529100612453266','10.1207/s1532690xci0201_3')
foreach ($d in $dois) { (Invoke-RestMethod -Uri ("https://api.crossref.org/works/" + $d)).message }
```

Observação honesta: redirecionamento por `https://doi.org/...` com `HEAD` retornou 200 para APA e Springer e **403** para Wiley, SAGE e Taylor & Francis (paywall/bloqueio de bot). Isso **não** invalida os DOIs — a confirmação bibliográfica foi feita na Crossref.

### 5.2 Fontes abertas de leitura — 24/24 URLs com HTTP 200

- **OpenStax (CC BY 4.0)** — Cálculo v1 e v3, Álgebra e Trigonometria, Pré-cálculo, Álgebra College, Álgebra Intermediária, Estatística Introdutória, Física Universitária v2, Química, Química 2e, Princípios de Economia. Fonte: `d3bxy9euw4e147.cloudfront.net/oscms-prodcms/media/documents/...`.
- **Pro Git 2.1.325** — https://github.com/progit/progit2/releases/download/2.1.325/progit.pdf
- **The Linux Documentation Project** — `abs-guide.pdf`, `nag2.pdf`, `sag.pdf` em `https://www.tldp.org/LDP/...`
- **PostgreSQL 17 (A4)** — https://www.postgresql.org/files/documentation/pdf/17/postgresql-17-A4.pdf
- **RFC Editor (IETF)** — RFC 2616, 9110, 9111, 9112, 9113, 9114, 9000, 9293 em `https://www.rfc-editor.org/rfc/...`

Todas as entradas estão em `js/data-books.js:8-37`, com `license`, `author`, `area`, `track`, `level` e `note` explícitos. Nenhum espelho pirata, nenhum link de afiliado e nenhum metadado inventado.

Comando de verificação:

```powershell
$urls = [regex]::Matches((Get-Content js/data-books.js -Raw), 'url:\s*"([^"]+)"') | ForEach-Object { $_.Groups[1].Value }
$urls | ForEach-Object { "$((Invoke-WebRequest -Uri $_ -Method Head -MaximumRedirection 5 -UseBasicParsing).StatusCode) $_" }
```

---

## 6. Análise pedagógica

As evidências acima foram traduzidas em comportamento observável, não em rótulos decorativos:

| Princípio | Evidência | Implementação |
|---|---|---|
| **Recuperação ativa** | Roediger & Karpicke (2006); Dunlosky et al. (2013) | “Feche o material”, perguntas geradas antes da conferência, respostas em `<details>` (`js/study.js:404-562`, `:934-1025`) |
| **Prática espaçada** | Cepeda et al. (2006) | Agendamento de 1/7/30 dias (`js/study.js:564-575`) integrado à revisão espaçada existente (`js/exercises.js:82`) |
| **Interleaving** | Rohrer & Taylor (2007) | Prática aponta para aulas reais da trilha e para treino intercalado já existente (`js/study.js:690-700`); o mecanismo de intercalação já estava em `js/features.js:505-511` |
| **Autoexplicação** | Chi et al. (1994) | Explicação própria de ≥80 caracteres salva na Técnica Feynman (`js/study.js:727-740`) |
| **Exemplos worked** | Sweller & Cooper (1985) | Modo “Exemplo” cita exemplos presentes no texto e pede refação com outros valores (`js/study.js:934-1025`) |
| **Feedback formativo** | Dunlosky et al. (2013) | Checklist de 6 itens, análise heurística de raciocínio com itens presentes/ausentes, nunca nota inventada |
| **Metacognição** | Dunlosky et al. (2013) | Registro de lacunas E1–E4, síntese com “uma ideia + uma dúvida”, legenda explícita de proveniência |

**Regra de ouro aplicada:** XP continua medindo atividade; o selo de domínio continua exigindo evidência (`RELATORIO_COMPLETO.md:35`). A nova página **não concede XP, não marca aula como concluída e não emite selo de domínio**. Ela produz evidência de estudo (explicação, tentativa, lacuna, revisão agendada), que o aluno depois converte em domínio pelos mecanismos já existentes.

---

## 7. Funcionalidades já existentes que foram reutilizadas

| Recurso existente | Reutilização na evolução |
|---|---|
| `Storage` v3 + backup + export/import | Namespace `study` aditivo; nenhuma chave antiga tocada (`js/storage.js:55-61`, `:143-151`, `:513-548`) |
| `CURRICULUM` e `buildAllLessons()` | Pré-requisitos por trilha e lista de exercícios reais na sessão guiada (`js/study.js:701-720`) |
| `openLesson()` | Botões “Abrir aula” na recuperação de lacunas (`js/study.js:1190-1199`) |
| `goToPage()` (novo, mas usando o mesmo roteador) | Integração livro → página de estudo e navegação entre páginas (`js/app.js:631-637`) |
| `Exercises.getSpacedCards()` | Contador de revisões pendentes no painel de lacunas (`js/study.js:1180-1188`) |
| `Storage.addMistake()` + categorias E1–E4 | Lacunas de leitura viram evidência no caderno de erros (`js/study.js:546-549`, `:1201-1209`) |
| `Storage.saveGeneralNote()` / Técnica Feynman | Explicação própria da sessão e modo Feynman do tutor (`js/study.js:727-740`, `:1010-1018`) |
| `BOOKS` (24 PDFs) | Seleção de material e botão “Estudar este livro” (`js/books.js:52-97`) |
| `LAB_CATALOG` e `PROJECTS` | Modo “Aplicação prática” sugere labs/projetos da trilha (`js/study.js:1050-1075`) |
| Design tokens CSS (`--accent`, `--panel`, `--line`, pills, callout, linklike) | Todos os componentes novos usam variáveis existentes (`css/style.css:1995-2197`) |
| App shell do service worker | `js/study.js` incluído no cache (`sw.js:41`) |

---

## 8. Funcionalidades implementadas

### 8.1 Página “Aprenda a estudar” (`js/study.js:340-402`)

Cinco abas com papéis distintos: tutorial, sessão guiada, tutor de documentos, ficha de artigo e lacunas. Aviso de privacidade no topo da página declara explicitamente que nada sai do navegador.

### 8.2 Tutorial interativo — 9 etapas (`js/study.js:404-562`)

1. escolher um livro e capítulo (anti-paralisia: **um** material principal);
2. definir objetivo concreto;
3. ler seção pequena (cole trecho ou carrega `.txt`/`.md`/`.html` ≤ 2 MB);
4. fechar o material;
5. explicar com as próprias palavras;
6. testar sem consulta (5 perguntas geradas localmente);
7. conferir com trecho literal;
8. registrar lacuna;
9. agendar revisão.

Cada etapa salva estado e pode ser revisitada.

### 8.3 Sessão guiada — 7 passos (`js/study.js:577-765`)

Preparação → leitura em blocos com “Leia comigo” (400/800/1200 caracteres) → explicação própria + checklist → recuperação → prática em aulas reais → síntese extrativa + síntese própria → revisão agendada. Sessões são persistentes e **novas sessões não apagam as antigas** (`js/study.js:315-325`).

### 8.4 Tutor local de documentos — 12 modos (`js/study.js:17-29`, `:817-1085`)

`explain`, `confused`, `zero`, `example`, `test`, `exercises`, `reasoning`, `feynman`, `summary`, `compare`, `application`, `read`.

Legenda obrigatória em toda resposta (`js/study.js:161-168`):

- `[trecho]` — literal do material fornecido;
- `[inferência]` — dedução heurística, a conferir na fonte;
- `[sugestão]` — estratégia de estudo, não afirmação sobre o documento;
- `[não encontrado]` — ausente no texto recebido.

Se o termo não aparece, o tutor **recusa inventar definição**. Se não há frase de exemplo, ele diz `[não encontrado]` em vez de fabricar um caso. Histórico recente é salvo localmente (máx. 40 entradas).

### 8.5 Ficha de estudo de artigo (`js/study.js:1087-1153`)

16 campos (DOI/URL, título, problema, objetivo, hipótese, método, evidências, inferência, resultados, conclusão dos autores, limitações, vieses, explicação própria, dúvidas, aplicação, referências) + 6 checagens de alfabetização científica. Aviso explícito: preprint ≠ publicação revisada por pares; significância ≠ tamanho de efeito. Dicas são geradas apenas para campos vazios, na forma de perguntas — nunca preenchem o artigo pelo aluno.

### 8.6 Diagnóstico de lacunas (`js/study.js:1155-1213`)

Ranking heurístico a partir de erros **reais** já registrados, sugestão de recuperação com aulas do currículo, lista de lacunas de leitura e registro manual com categoria E1–E4. Aviso explícito: uma questão isolada não prova domínio nem lacuna.

### 8.7 Integração com o catálogo de livros (`js/books.js:52-97`)

Botão “Estudar este livro” em cada um dos 24 cards, com `aria-label` específico, mantendo filtros, busca e link para a fonte oficial.

---

## 9. Funcionalidades planejadas e justificativa

Todas abaixo foram **deliberadamente não implementadas nesta entrega**. Motivo comum: exigem autorização separada, serviço externo,-consumo de créditos ou mudança arquitetural incompatível com “evoluir sem criar sistema paralelo” (§16 da missão).

| Funcionalidade | Justificativa do adiamento |
|---|---|
| Extração de texto de PDF no navegador (PDF.js) | Requer nova dependência/bundle e escolha de licença; hoje o aluno cola o trecho ou carrega `.txt`. Fazê-lo sem consentimento explícito leria documentos localmente — risco de privacidade. Preparado como próximo passo prioritário. |
| LLM local (WebLLM) ou API externa | Nenhuma API configurada; a missão proíbe conta, cobrança, créditos e envio sem consentimento. O tutor heurístico local entrega valor imediato com custo zero e risco zero. |
| Link direto com o selo de domínio (`Mastery.claim`) | A sessão gera evidência, **não** atesta domínio. Automatizar o selo burlaria a rubrica 8/10 e confundiria atividade com competência. |
| Mapa visual de conhecimento / grafo | Exige modelo de grafo e renderização (SVG/canvas) ainda ausentes; valor alto, mas posterior à consolidação das rotinas de estudo. |
| Modo áudio / TTS | Depende de API do navegador ou serviço externo; não há política de consentimento definida. |
| Assistente de pesquisa com busca web | Sairia do escopo local e exigiria verificação de fontes em tempo real, fora dos limites de autorização. |
| Rotas de leitura personalizadas | As 5 rotas fixas já funcionam; personalização depende de histórico seguro de domínio, não de contador de cliques. |
| Projetos guiados com tutor | Os 15 projetos já existem como checklists; um tutor de projeto exigiria rubrica específica por entrega. |
| AA automática reexecutada nesta sessão | Não há Playwright, Puppeteer, jsdom nem navegador instalado no ambiente. Os números 30 axe / Lighthouse 100 são do baseline (`RELATORIO_COMPLETO.md:31-32`) e **não foram reexecutados**. |

---

## 10. Alterações por arquivo

| Arquivo | Alteração | Referência |
|---|---|---|
| `js/storage.js` | Namespace aditivo `study` no estado padrão; normalização preservando dados existentes; 5 novas funções de acesso expostas no `window.Storage` | `:55-61`, `:143-151`, `:513-548`, `:584-588` |
| `js/study.js` | **Arquivo novo** — tutorial, sessão, tutor 12 modos, ficha de artigo, diagnóstico, API `Study` e `StudyPage` | `:17-29`, `:280-325`, `:340-402`, `:1215-1229` |
| `js/app.js` | Título da nova página no `titleMap`; renderer registrado; `goToPage()` exposto globalmente | `:141`, `:176`, `:631-637` |
| `index.html` | Botão de navegação `data-page="study"`; `<script defer src="js/study.js">` | `:30`, `:80` |
| `js/books.js` | `cardHTML(book, index)`; botão “Estudar este livro”; callout de orientação na página de livros | `:52`, `:67`, `:97` |
| `sw.js` | Cache `forge-v6`; `js/study.js` no app shell | `:2`, `:41` |
| `css/style.css` | Bloco escopado `.study-*` e `.study-book-btn` (199 linhas), incluindo `@media (max-width: 720px)` | `:1995-2197` |
| `tests/forge-study-smoke.mjs` | **Arquivo novo** — 14 verificações com DOM mínimo em `node:vm`, sem dependências | `:1-220` |

Nenhuma linha de conteúdo curricular, catálogo, labs, projetos, gamificação ou PWA foi removida.

---

## 11. Arquitetura e decisões

1. **Extensão, não substituição.** O roteador existente (`page` + `render()`) recebeu um renderer; não foi criado um segundo SPA.
2. **Schema aditivo e reversível.** `study` é mesclado com `fresh.study` (`js/storage.js:145`). Dados antigos e até versões futuras (`version > 3`) são preservados — testado.
3. **Local-first por princípio.** Nenhum `fetch`, `XMLHttpRequest`, WebSocket, chave de API, analytics ou serviço externo foi adicionado. O único tráfego externo do app permanece o CDNs do KaTeX e os links dos PDFs (já existentes).
4. **Proveniência explícita.** Toda resposta do tutor rotula o que é trecho, inferência, sugestão ou ausência. Isso impede a falsa impressão de que o tutor leu o PDF inteiro.
5. **Sem falsa evidência.** O módulo não concede XP, não conclui aula e não emite selo de domínio. Explicação salva vai para o caderno Feynman, que já tem regras próprias.
6. **Compatibilidade PWA.** Bump de versão do cache (`forge-v5` → `forge-v6`) força a reinstalação do app shell sem apagar `localStorage`.
7. **Escopo CSS segregado.** Todos os estilos novos usam prefixo `.study-`, evitando colisão com os 1.716 estilos preexistentes.
8. **Testes sem dependências.** O smoke test roda com `node` puro e um DOM em memória, reproduzindo o ambiente de execução real dos scripts.

---

## 12. Testes executados e resultados reais

### 12.1 Smoke tests — 14/14 PASS

```powershell
cd 'D:\João\Desktop\ESTUDOS'
node tests/forge-study-smoke.mjs
```

Saída real:

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

Cobertura: renderização, 12 modos, persistência de sessão, não-invenção de citações, artigos, lacunas, migração v2→v3, preservação de versão futura, catálogo de livros e integração com o roteador real.

### 12.2 Sintaxe — 5/5 OK

```powershell
node --check js/study.js
node --check js/storage.js
node --check js/app.js
node --check js/books.js
node --check sw.js
```

Sem saída de erro.

### 12.3 Fontes externas

- 24/24 URLs de PDF com HTTP 200 (comando na §5.2).
- 6/6 DOIs confirmados na Crossref (comando na §5.1).
- `doi.org` com `HEAD`: 200 para APA e Springer; 403 para Wiley/SAGE/Taylor & Francis (paywall) — documentado, não tratado como falha de DOI.

### 12.4 Verificações **não** executadas nesta sessão

- Navegação visual em navegador real (sem Playwright/Puppeteer/jsdom/chrome/msedge instalados).
- Reexecução de axe-core e Lighthouse. Os números do baseline são históricos (`RELATORIO_COMPLETO.md:31-32`).
- Teste de instalação PWA em dispositivo físico.
- Validação de contraste automática dos componentes novos (feita por revisão dos tokens existentes, não por ferramenta).

---

## 13. Acessibilidade, responsividade e offline

**Acessibilidade implementada:**

- `role="tablist"` / `role="tab"` / `role="tabpanel"`, com `aria-selected` e `aria-labelledby` sincronizados (`js/study.js:346-357`, `:370-378`);
- `aria-pressed` nos botões de etapa e modos do tutor;
- `aria-label` descritivo no upload de arquivo, nos botões de livro e nas regiões principais;
- `<details>` para conferência de respostas, evitando revelação antecipada;
- `:focus-visible` com contorno de 3 px nos controles novos (`css/style.css:2066-2070`);
- legenda accessible via `role="note"` no aviso de privacidade e na proveniência;
- link “Pular para o conteúdo principal” preservado (`index.html:16`);
- cores via variáveis do tema claro/escuro já existentes, incluindo `--pill-info`, `--pill-success`, `--pill-warn` ajustados no baseline para WCAG AA (`css/style.css:20-22`).

**Responsividade:**

- grid de 2 colunas da sessão colapsa com as regras existentes;
- abas e etapas com `flex-wrap` e gap reduzido em ≤720 px (`css/style.css:2192-2197`);
- tabela de comparação com `overflow-x: auto` em telas pequenas;
- textareas com `rows` moderados, sem largura fixa.

**Offline:**

- `js/study.js` está no app shell do service worker (`sw.js:41`), cache `forge-v6` (`sw.js:2`);
- tutor, fichas, sessões e lacunas funcionam sem rede;
- limitação herdada: em `file://` o service worker é bloqueado pelo navegador, mas a aplicação continua funcional (`RELATORIO_COMPLETO.md:48`, `:420`).

**Não reivindicado:** auditoria axe/Lighthouse nova nesta sessão. Ver §12.4.

---

## 14. Privacidade, custos e limitações

| Aspecto | Estado |
|---|---|
| Documentos enviados a serviço externo | **Nenhum.** O tutor só lê texto colado ou carregado de `.txt`/`.md`/`.html` no próprio navegador. |
| API / chave / conta / cobrança | **Nenhuma.** Sem `fetch`, sem SDK, sem tokens. Custo direto: R$ 0. |
| Dados persistidos | Apenas `localStorage` (`forge.study.v2`), mesmo local dos dados já existentes; cobertos por exportar/importar e pelo backup automático. |
| Leitura automática de PDF | **Não implementada.** O navegador não extrai texto do PDF exibido; o aluno copia o trecho. Isso evita falsa afirmação de que o tutor “leu o livro”. |
| Referências de página/seção | Só aparecem se o **material ou o aluno** as informar (`s_ref`). Nunca são geradas automaticamente. |
| Citações | Nunca inventadas; termos ausentes retornam `[não encontrado]`. |
| Limites técnicos | Upload ≤ 2 MB e texto limitado a 120.000 caracteres para evitar estouro de cota; histórico do tutor limitado a 40 entradas; lacunas a 200. |
| Qualidade do tutor | Heurística: seleção de frases por frequência de termos e checagens de raciocínio. **Não é compreensão semântica nem correção automática.** Pode errar; por isso toda saída é rotulada e o aluno é convidado a conferir na fonte. |
| Conteúdo legal | 24 PDFs de fonte aberta, links oficiais, licenças declaradas. Nenhum material paywallado foi incorporado. |

---

## 15. Riscos e problemas pendentes

1. **Validação visual ausente.** Sem navegador automatizado, a aparência em 1024/900/640/560 px e a navegação por teclado foram verificadas por revisão de código, não por execução. Recomenda-se axe + Lighthouse antes de publicar.
2. **Sem extração de PDF.** É a principal limitação funcional percebida pelo usuário. Mitigada com aviso explícito na página e com o botão que abre o PDF oficial.
3. **Tutor heurístico.** Pode selecionar frase pouco representativa. Mitigado com rótulos de proveniência e com a exigência de conferência pelo aluno.
4. **Cota do `localStorage`.** Sessões com texto longo podem atingir o limite do navegador. Mitigado com limite de 120k caracteres e 2 MB por arquivo; ainda sem medidor de ocupação.
5. **Cache do service worker.** Bump para `forge-v6` exige recarregamento para substituir o shell antigo; comportamento padrão do PWA.
6. **DOIs com 403 no `doi.org`.** Paywall de editoras; não afeta validade, mas pode confundir uma verificação superficial. Registrado na §5.1.
7. **Divergências documentais antigas.** `AUDITORIA.md` e documentos correlatos citam 15 páginas, cache v4 e 15 campos de lab. Não alterados para preservar o histórico; este relatório é a fonte atualizada.
8. **Nenhuma alteração publicada.** O site ainda mostra a versão anterior até que haja autorização explícita de deploy.
9. **Sem integração com IA externa.** Limitação intencional, não defeito; ver §9 e §14.
10. **Lacunas e XP.** Uma lacuna registrada entra no caderno de erros, mas não altera XP nem domínio — por decisão pedagógica, não é um bug.

---

## 16. Critérios de aceitação

Critérios da missão (§15) verificados um a um:

| Critério | Status | Evidência |
|---|---|---|
| Nenhum recurso preexistente removido | ✅ | Git diff soma adições; `RELATORIO_COMPLETO.md` preservado |
| Currículo, conteúdo, progresso e dados preservados | ✅ | Teste de migração v2→v3 e de versão futura |
| Backup/importação/exportação continuam funcionando | ✅ | `js/storage.js:9`, `:221`, `:310-318`; sem alteração nessas funções |
| PWA/offline não comprometido | ✅ | `sw.js:2`, `:41` |
| Sem operação Git destrutiva | ✅ | §2 |
| Sem alteração de publicação | ✅ | §17 |
| Leitura guiada funciona | ✅ | Tutorial e sessão com testes automatizados |
| Tutor contextualiza com a fonte | ✅ | `[trecho]` com frase literal |
| Referências de página/seção corretas | ⚠️ | Só quando informadas pelo material/aluno; nunca geradas |
| Não inventa citações/trechos | ✅ | Teste dedicado com termo inexistente |
| Perguntas, dicas e exercícios funcionam | ✅ | Modos `test`, `articleHints`, `exercises` |
| Sessões retomáveis | ✅ | `lastSessionKey` + `openSession()` |
| Feedback e registro coerentes | ✅ | Checklist heurístico, sem nota inventada |
| Ficha de artigo funcional | ✅ | Teste de salvamento |
| Diferencia evidência, inferência, conclusão | ✅ | Campos separados + legenda |
| Limitações e preprints tratados | ✅ | Aviso explícito na ficha |
| Sem falsa certeza | ✅ | `[não encontrado]` e recusa de definir termo ausente |
| Links verificados / marcados | ✅ | 24/24 HTTP 200 |
| Licenças tratadas corretamente | ✅ | `license` em cada entrada do catálogo |
| Metadados não inventados | ✅ | Campos vêm da fonte oficial |
| Filtros e navegação funcionam | ✅ | Teste do catálogo e do roteador real |
| Recuperação ativa | ✅ | Etapa 4/6 do tutorial e passo 3 da sessão |
| Revisão | ✅ | 1/7/30 dias + revisão espaçada existente |
| Feedback | ✅ | Checklist e análise de raciocínio |
| Exercícios | ✅ | Aulas reais da trilha + treino intercalado existente |
| Integração com domínio | ⚠️ | Evidência gerada, **sem emissão automática de selo** (decisão pedagógica) |
| Não confunde atividade com domínio | ✅ | Regra explícita na §6 |
| Testes executados | ✅ | 14/14 + sintaxe + fontes |
| Erros e avisos documentados | ✅ | §12.4 e §15 |
| Acessibilidade verificada | ⚠️ | Por código; axe não reexecutado nesta sessão |
| Responsividade verificada | ⚠️ | Por código; navegador indisponível |
| Offline verificado | ⚠️ | App shell atualizado; teste em dispositivo não executado |
| Links e recursos verificados | ✅ | §5 |
| Não declara validações não executadas | ✅ | Todas as ressalvas acima estão explícitas |

**Resultado:** nenhum critério reprovado; 4 itens marcados como ⚠️ por limitação de ambiente ou decisão pedagógica deliberada, todos documentados.

---

## 17. Status de publicação

**Não houve publicação.** Não foram executados:

- `git push`;
- deploy para GitHub Pages;
- abertura/atualização de pull request;
- alteração de workflow, domínio, segredos ou configuração remota;
- criação de conta, assinatura ou consumo de créditos.

O site em https://jdocorte69-dev.github.io/forge-plataforma-estudos/ continua servindo o commit `e88b99e` (versão anterior). As alterações estão **apenas no diretório local** `D:\João\Desktop\ESTUDOS`, não commitadas, prontas para revisão. Publicação depende de autorização separada e explícita.

---

## 18. Próximos passos prioritários

1. **Validação em navegador (antes de qualquer publicação).** Instalar/acionar Playwright ou usar navegador disponível; executar axe-core WCAG 2.2 AA, Lighthouse e capturas em 1024/900/640/560 px; conferir console e navegação por teclado nas 5 abas novas.
2. **Extração local de PDF com consentimento.** Avaliar PDF.js (licença Apache-2.0), carregamento sob demanda e aviso explícito “o arquivo será processado apenas neste dispositivo”; manter o modo de cópia manual como fallback.
3. **Fechar o ciclo de revisão espaçada.** Fazer o agendamento da sessão alimentar diretamente `Exercises.rateCard()` / caderno de erros, preservando a regra de que domínio exige reteste.
4. **Tutor com modelo local opt-in.** Se autorizado, avaliar WebLLM com consentimento explícito, custo zero e fallback heurístico; nunca enviar texto para API externa sem autorização separada.
5. **Testes de regressão ampliados.** Incluir cenários de teclado, tema escuro, importação/exportação com dados `study` e sessão com texto no limite de cota.
6. **Documentação sincronizada.** Atualizar `AUDITORIA.md` (16 → 17 páginas, `forge-v6`, script `study.js`) sem apagar o histórico; este relatório permanece como fonte canônica da evolução.
7. **Publicação somente com autorização.** Após os itens 1–4, solicitar autorização explícita para commit + push + deploy. Até lá, manter tudo local.

---

## Apêndice A — Comandos de reprodução

```powershell
cd 'D:\João\Desktop\ESTUDOS'

# 1) Testes funcionais
node tests/forge-study-smoke.mjs

# 2) Sintaxe
node --check js/study.js
node --check js/storage.js
node --check js/app.js
node --check js/books.js
node --check sw.js

# 3) Servir localmente
python -m http.server 8765
# abrir http://localhost:8765/index.html

# 4) Links dos PDFs
$urls = [regex]::Matches((Get-Content js/data-books.js -Raw), 'url:\s*"([^"]+)"') | ForEach-Object { $_.Groups[1].Value }
$urls | ForEach-Object { "$((Invoke-WebRequest -Uri $_ -Method Head -UseBasicParsing).StatusCode) $_" }

# 5) DOIs na Crossref
$dois = @('10.1111/j.1467-9280.2006.01693.x','10.1037/0033-2909.132.3.354','10.1007/s11251-007-9015-8','10.1207/s15516709cog1803_3','10.1177/1529100612453266','10.1207/s1532690xci0201_3')
foreach ($d in $dois) { (Invoke-RestMethod -Uri ("https://api.crossref.org/works/" + $d)).message.title }

# 6) Estado Git (sem alterações remotas)
git status --short
git log -1 --oneline
```

---

**Fim do relatório.** Todo número aqui é rastreável até um arquivo citado, um comando executado ou uma fonte externa verificada. O que não pôde ser confirmado nesta sessão foi marcado como limitação, não como sucesso.

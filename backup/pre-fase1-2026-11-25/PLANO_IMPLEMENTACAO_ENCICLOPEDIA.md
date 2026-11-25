# Plano de Implementação — Enciclopédia Mestra → Plataforma Forge

**Versão:** 1.0 · **Data:** 24/11/2026
**Fonte:** `FORGE_ENCICLOPEDIA_MESTRA_DO_ZERO_AO_AVANCADO.md` (10.992 linhas, 387 KB, v1.0)
**Status:** planejamento aprovado pelo usuário — **nenhum código alterado nesta etapa**

---

## 0. Ponto de partida (medido, não presumido)

### Plataforma Forge hoje

| Dimensão | Estado medido |
|---|---|
| Trilhas | 8: `math`, `mathfund`, `c`, `networks`, `linux`, `systems`, `databases`, `software` |
| Módulos / aulas | **29 módulos / 189 aulas** (math 6/41, mathfund 3/25, c 4/24, networks 2/20, linux 4/14, systems 2/18, databases 2/18, software 6/29) |
| Páginas | 12: painel, trilhas, foco, plano, labs, revisão, erros, Feynman, biblioteca, projetos, backup, (lab) |
| Biblioteca | 72 itens, 5 campos `[área, título, desc, url, nível]`, 3 filtros (texto, área, nível) |
| Projetos | 15 (10 anteriores + 5 integradores adicionados na Seção 11) |
| Laboratórios | 6 abas (linux, c, math, eng, net, db) e ~13 IDs persistidos; diagnóstico de rede e Wireshark já implementados |
| Persistência | `localStorage forge.study.v2`, versão 2, export/import JSON |
| PWA | `sw.js` `forge-v3`, APP_SHELL com 21 arquivos locais + 3 CDN |
| Seção 11 | Gamificação (XP/nível/escudo/TMV/Pomodoro/recompensas), E1–E4, filtros de biblioteca, 5 integradores — **implementada e com `node --check` limpo (21/21); smoke test no navegador ainda pendente** |

### O que a Enciclopédia exige (seção 16)

- Estrutura rica por módulo (13 campos), aula (10 campos) e recurso (12 campos).
- Biblioteca com 8 filtros: área, nível, tipo, idioma, gratuito/pago, texto, pré-requisitos, sequência recomendada.
- Painel com 10 indicadores, separando **XP (atividade)** de **domínio (evidência)**.
- Tema escuro técnico, diagramas, calendário de revisão, animações leves/opcionais, `prefers-reduced-motion`.
- Busca/navegação em conteúdo longo; todos os botões com ação real; migração sem perda de dados.

### Regras não negociáveis (extraídas do documento)

1. **Honestidade:** nunca afirmar execução real quando foi simulação; nunca afirmar captura não feita; conclusão sem evidência é "declarada", não "verificada" (§2.4, §12.5).
2. **Segurança:** não recomendar `chmod 777` como padrão, nem `kill -9` como primeira opção; labs ofensivos só em ambiente próprio/autorizado (§11.4, §12).
3. **Domínio ≠ XP:** critério de domínio exige ≥80% sem consulta, explicação própria, problema misto, erro comentado, prática e repetição em revisão posterior (§2.1).
4. **Rubrica:** 8/10 em 5 dimensões (explicação 2, exercícios 3, aplicação 2, laboratório 2, erros 1), sem falha crítica (§15.2).
5. **Revisão espaçada:** mesmo dia → 1 d → 7 d → 14 d → 30 d, antecipando no erro e ampliando no acerto (§3.2).
6. **Acessibilidade:** WCAG 2.2 AA, teclado, foco visível, contraste, motion opcional (§16.5).

---

## 1. Mapa de lacunas

| # | Dimensão | Enciclopédia pede | Forge hoje | Lacuna | Prio |
|---|---|---|---|---|---|
| 1 | Matemática | M0–M19 (20 módulos) | 9 módulos / 66 aulas | Faltam M12–M19 (Cálculo II/III/IV, Álgebra Linear completa, EDO, Prob/estat/numérico, Avançado) e 19 labs descritos | Alta |
| 2 | Linguagem C | C0–C15 (16 módulos) + 10 projetos | 4 módulos / 24 aulas | Faltam C9–C15 (pré-processador, representação, depuração, estruturas, concorrência, sistemas/rede, segurança) | Alta |
| 3 | Algoritmos | 6.1–6.4 + lab com 7 requisitos | 1 módulo dentro da trilha C | Falta módulo próprio, visualizadores, contadores, prova e testes aleatórios | Média |
| 4 | Redes | R0–R12 (13 módulos), 7 labs Wireshark | 2 módulos / 20 aulas | Faltam R4 (IPv6), R5 (roteamento), R8 (HTTP/TLS), R11 (sockets), R12 (segurança); cálculo CIDR e encapsulamento visuais | Alta |
| 5 | Linux | 8.1–8.8 + 10 labs | 4 módulos / 14 aulas | Faltam 8.6 (shell scripting), 8.7 (admin), 8.8 (SO) e 10 labs formais | Média |
| 6 | Eng. de software | 9.1–9.10 | 6 módulos / 29 aulas | Faltam 9.5–9.9 (observabilidade, CI/CD, distribuídos, segurança no ciclo) e template de docs | Média |
| 7 | Arquitetura | 10.1–10.4 | 2 módulos / 18 aulas (`systems`) | Faltam eletrônica básica, embarcados e o projeto 10.4 | Baixa |
| 8 | Segurança | 11.1–11.4 + lab seguro | Nenhuma trilha dedicada | Nova trilha `security` (ou módulo em `systems`) | Alta |
| 9 | Laboratórios | 56 labs, modelo de 15 campos | ~13 IDs, 6 abas, sem schema formal | Definir schema + catálogo + evidência obrigatória; distinguir simulação de execução real | Alta |
| 10 | Biblioteca | 43 recursos, 12 campos, 8 filtros | 72 itens, 5 campos, 3 filtros | Migração para objeto rico, data de verificação, licença, tipo, idioma, acesso; dedup | Alta |
| 11 | Projetos | P0–P10 (11) com requisitos e portfólio | 15 projetos (10+5) | Mapear e deduplicar; exigir repo/README/testes/evidência/limitações/retrospectiva | Média |
| 12 | Avaliação | Rubrica 8/10 + Definition of Done | 10 MC geradas por aula | Camada de domínio por módulo; bloquear "concluir" sem critérios | Alta |
| 13 | Revisão | 0/1/7/14/30 dias | 1/3/7/14/30 (flashcards) e 7/30 (erros) | Decidir unificação; calendário de revisão no painel | Média |
| 14 | Painel | 10 indicadores | XP, nível, escudo, TMV, Pomodoro, horas, streak, progresso | Faltam mapa de domínio, laboratórios, projetos, erros a refazer (parcial), meta mínima (TMV) | Alta |
| 15 | Busca | Conteúdo longo com busca e navegação | Busca só na biblioteca | Busca global (aulas, labs, projetos, biblioteca, glossário) | Média |
| 16 | Visual/PWA | Tema escuro técnico, diagramas, reduced-motion | Tema claro/escuro simples, barras, sem calendário | Diagramas interativos (ponteiros, encapsulamento, CIDR), calendário, `prefers-reduced-motion`, APP_SHELL atualizado | Média |

---

## 2. Decisões a confirmar antes da Fase 1

| # | Decisão | Recomendação | Por quê |
|---|---|---|---|
| D1 | Como estender o dado da aula? | Manter `L()` e acrescentar campos **opcionais** (`derivation`, `workedExamples`, `recallQuestions`, `masteryCriteria`, `tags`, `estimatedEffort`); `facts` vira `definitions`, `errors` vira `commonMistakes` | Preserva as 189 aulas e o load order; nada precisa ser reescrito de uma vez |
| D2 | Nova trilha para segurança? | Criar `CURRICULUM.security` com 4 módulos (11.1–11.4) | §11 tratava só de "laboratório seguro"; o volume justifica trilha própria |
| D3 | Intervalos de revisão | Adotar **0/1/7/14/30** para flashcards; erros mantêm 7/30 com anti-adiamento | Alinha §3.2 sem perder a regra E1–E4 já implementada |
| D4 | Schema da biblioteca | Migrar para **objeto** com adapter que converte arrays legados; manter 72 itens atuais | Permite os 8 filtros sem quebrar backup antigo |
| D5 | 56 labs com 15 campos cada | Implementar em **ondas por área** (Matemática → Redes → Linux → C → Engenharia), não de uma vez | ~8.400 linhas de conteúdo; priorizar o que a Forge já consegue executar/simular |
| D6 | Projetos P0–P10 vs 5 integradores | **Mesclar**: manter os 15 atuais e marcar os 5 da Seção 11 como equivalentes a P0/P2/P3/P4/P10 | Evita apagar progresso de `labDone`/`proj*-*` já salvo |

---

## 3. Fases de implementação

### Fase 0 — Fundação e verificação (1 sessão) · Pré-requisito de todas
- Fazer backup dos arquivos atuais e do `forge.study.v2`.
- Concluir o smoke test pendente da Seção 11 no navegador (console zero erros, widgets de XP/TMV/Pomodoro, E1–E4, filtros, labs).
- Atualizar `AUDITORIA.md` e `PROGRESSO.md` com o que já foi entregue.
- Checar amostra dos 31 links da seção 19 (2 já verificados pelo agente) e marcar os demais como "pendente de verificação".
- **Aceite:** console limpo, backup gerado, documentação atualizada, nenhuma mudança funcional.

### Fase 1 — Schema de dados e migração v3 (1–2 sessões) · Depende F0
- `storage.js`: `CURRENT_VERSION = 3`, `normalizeState` estendido, `migrateState` v2→v3 sem perda.
- Novos espaços no estado: `mastery` (por módulo), `labEvidence` (por lab), `resourceMeta`, `assessmentLog`.
- `L()` estendido com campos opcionais (D1); `buildQuestions` continua gerando exercícios para aulas sem conteúdo novo.
- `exportData`/`importData` validam versão e fazem backup antes de substituir.
- **Aceite:** 189 aulas e 29 módulos continuam contando; backup v2 importa com 100% dos `done`, `mistakes`, `xp`, `labDone`; `node --check` limpo.

### Fase 2 — Domínio, rubrica e painel (1–2 sessões) · Depende F1
- Implementar rubrica 5 dimensões (8/10) e os 6 critérios de Definition of Done.
- Botão "Concluir aula" passa a exigir: ≥80% sem consulta + explicação Feynman + prática + revisão posterior. **XP continua sendo concedido por atividade, mas o selo "Dominado" vem só da evidência.**
- Painel: mapa de domínio por trilha (N0–N4), revisões vencidas, módulos em andamento, horas reais, labs, projetos, erros a refazer, meta mínima do dia (TMV).
- **Aceite:** não é possível marcar domínio com nota < 8 ou sem evidência; painel mostra os 10 indicadores; XP e domínio aparecem separadamente.

### Fase 3 — Biblioteca rica e busca global (1–2 sessões) · Depende F1
- Adapter de arrays legados → objetos com `title, author, type, area, level, language, free, license, url, verifiedAt, note, priority`.
- 8 filtros (D4) + dedup entre os 72 atuais e os 43 da Enciclopédia.
- Nenhum item marcado "gratuito" sem `verifiedAt`; link sempre para fonte oficial.
- Busca global única (aulas + módulos + labs + projetos + biblioteca + glossário) com navegação por teclado.
- **Aceite:** filtros combináveis; 0 itens "gratuitos" sem verificação; busca encontra uma aula, um lab e um livro com o mesmo termo.

### Fase 4 — Catálogo de laboratórios (2–3 sessões) · Depende F1, F2
- Definir schema de 15 campos (título, área, nível, pré-requisitos, objetivo, conceitos, ambiente, **regras de segurança**, passos, resultado esperado, **evidência exigida**, erros comuns, reflexão, rubrica, extensões).
- Integrar catálogo às 6 abas existentes; cadalab registra `labEvidence` (código, saída, PCAP, relatório, resposta).
- Distinção explícita no UI: **Simulado** vs **Execução real** vs **Análise de captura existente**.
- Onda 1 (prioridade): 15 labs de Matemática (visualizações), 9 de Redes (inclui os 7 Wireshark numerados), 10 de Linux (comandos no WSL2 do usuário).
- **Aceite:** 34 labs da onda 1 com 15 campos; nenhum marcado como "executado" sem evidência; regras de segurança presentes.

### Fase 5 — Currículo Matemática M12–M19 (2–3 sessões) · Depende F1, F2, F4
- Cálculo II (M13), III (M14), IV (M15), Álgebra Linear (M16), EDO (M17), Prob/estat/numérico (M18), Avançado (M19), com aulas no formato de 5 camadas (§1.3).
- Labs: M12 (5), M13 (4), M14 (5), M16 (matrizes em C), M18 (dataset), prova final M19.
- Seguir as diretivas do documento: derivar identidades por distributividade (565), distinguir valor no ponto de limite (881), declarar critério numérico (1122).
- **Aceite:** cada módulo novo com exercícios, lab, critério de domínio e flashcards; total de aulas e módulos recalculado.

### Fase 6 — C C9–C15 + Algoritmos (2–3 sessões) · Depende F1, F2, F4
- Módulos: pré-processador/linker, representação de dados, depuração (ASan/UBSan/GDB/Valgrind), estruturas de dados (12 implementações), concorrência POSIX, C de sistemas/rede, padrões/portabilidade/segurança.
- Visualizador de ponteiros/heap/stack (diretiva 1408) e laboratório de algoritmos com os 7 requisitos (1677).
- Mapear os 10 projetos C obrigatórios (1612–1624) para P0–P10 (D6).
- **Aceite:** C17/C23 distinguido de extensões GCC e POSIX (1297); nenhum `gets`, nenhum `chmod 777`; cada estrutura com invariantes, complexidade, bordas e testes.

### Fase 7 — Redes R4–R12 + Linux 8.6–8.8 (2 sessões) · Depende F4
- Calculadora CIDR passo a passo em binário (1750), animação de encapsulamento (1721), explicação campo a campo e "ping não testa porta TCP" (1839).
- 7 labs Wireshark numerados (R10), sockets em C (R11), segurança de rede (R12) com authorize/escopo.
- Linux: shell scripting, administração, SO + os 10 labs da 8.9.
- **Aceite:** labs ofensivos apenas em ambiente autorizado; toda captura marcada como exemplo ou real.

### Fase 8 — Engenharia 9.5–9.9 + Segurança 11.1–11.4 + Arquitetura 10.1–10.4 (2 sessões)
- Nova trilha `security` (D2), com laboratório seguro registrando autorização/escopo/comandos/limpeza.
- Observabilidade, CI/CD, sistemas distribuídos, segurança no ciclo (SBOM/SAST/DAST).
- Eletrônica, embarcados e projeto 10.4 (sensor → filtro → registro → serial).
- Template obrigatório de documentação de projeto (9.10).
- **Aceite:** nenhum algoritmo criptográfico próprio para uso real (2320); implementações didáticas marcadas como tal.

### Fase 9 — Projetos P0–P10 e portfólio (1–2 sessões) · Depende F1, F2
- Mesclar 15 projetos atuais com P0–P10 (D6), sem apagar `labDone` existente.
- Cada projeto: repositório, README, instruções, testes, evidência, limitações, retrospectiva (§15.4).
- **Aceite:** 11 projetos canônicos com requisitos rastreáveis e evidence link.

### Fase 10 — Visual, acessibilidade e PWA final (1 sessão) · Depende todas
- Tema escuro técnico, hierarquia, cards consistentes, diagramas interativos, calendário de revisão.
- `prefers-reduced-motion` e animações opcionais (já existe chave `settings.animations`).
- Atualizar `sw.js`: `VERSION = forge-v4` e APP_SHELL com novos arquivos.
- Validação final: `node --check` em todo `js/`, console do navegador zero erros, axe WCAG 2.2 AA, Lighthouse, smoke test completo.
- **Aceite:** zero violações AA críticas; PWA instala e funciona offline.

---

## 4. Estimativa e ordem recomendada

| Fase | Esforço (sessões) | Depende | Entrega visível |
|---|---|---|---|
| 0 | 1 | — | Base limpa e documentada |
| 1 | 1–2 | 0 | Migração v3 sem perda |
| 2 | 1–2 | 1 | Domínio separado de XP |
| 3 | 1–2 | 1 | Biblioteca com 8 filtros + busca |
| 4 | 2–3 | 1, 2 | 34 labs com evidência |
| 5 | 2–3 | 1, 2, 4 | M12–M19 no currículo |
| 6 | 2–3 | 1, 2, 4 | C9–C15 + Algoritmos |
| 7 | 2 | 4 | Redes e Linux completos |
| 8 | 2 | 4 | Segurança + Arquitetura |
| 9 | 1–2 | 1, 2 | Portfólio P0–P10 |
| 10 | 1 | todas | PWA e acessibilidade finais |
| **Total** | **16–23 sessões** | | Implementação completa |

**Ordem crítica:** F0 → F1 → (F2 ‖ F3) → F4 → (F5 ‖ F6 ‖ F7 ‖ F8) → F9 → F10.
Fases paralelas só se executadas em arquivos distintos (ex.: F5 em `data-math*.js`, F6 em `data-c.js`/`data-algorithms.js`).

---

## 5. Riscos e mitigação

| Risco | Impacto | Mitigação |
|---|---|---|
| Volume (10.992 linhas) impossibilita cópia literal | Alto | Converter para o formato compacto `L()`; priorizar módulos com exercícios/labs descritos |
| 29 de 31 links da seção 19 sem evidência de checagem no arquivo | Médio | Verificar antes de marcar; registrar `verifiedAt`; marcar pendentes |
| Rodapé do documento diz 25/11/2026 (um dia à frente de hoje) | Baixo | Registrar divergência em `AUDITORIA.md`; não ajustar datas de conteúdo |
| SUMÁRIO diverge do corpo (M1, M2, M19) | Médio | Usar **sempre os cabeçalhos do corpo** como fonte canônica |
| Schema rico pode estourar memória/localStorage | Médio | Campos opcionais e incremental; medir tamanho do `forge.study.v2` após cada fase |
| `L()` compacto não comporta 5 camadas ricas | Médio | D1 (campos opcionais) + conteúdo longo em `notes`/`mastery`, não no objeto da aula |
| Mudar intervalos de revisão pode confundir usuário | Baixo | D3 com migração explícita e aviso no painel |

---

## 6. Próximo passo imediato

1. Confirmar as decisões **D1–D6** da seção 2 (posso assumir as recomendações se você disser "segue o recomendado").
2. Executar a **Fase 0** (smoke test da Seção 11 + backup + documentação).
3. Iniciar a **Fase 1** com a migração v3.

O plano não altera `index.html`, `js/`, `css/` nem `sw.js`. Aguardando sua confirmação para começar a Fase 0.

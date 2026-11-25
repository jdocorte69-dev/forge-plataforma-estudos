# FORGE — Plataforma de Estudos

Uma plataforma **100% frontal** (sem backend, sem login, sem servidor) para estudar com evidência: 9 trilhas, 71 módulos, 385 aulas, 3.850 questões, 56 laboratórios, 110 recursos verificados e 34 termos de glossário. Funciona offline depois do primeiro carregamento.

**🌐 Acessar online:** https://jdocorte69-dev.github.io/forge-plataforma-estudos/

> **Princípio central:** XP mede atividade; domínio exige evidência. Uma aula só é marcada como concluída com nota ≥ 8/10 **e** uma síntese Feynman de ≥ 30 caracteres. Sem isso, o progresso fica registrado como "Declarada · falta evidência".

## Começar agora

**Abrir direto:** dê dois cliques em `index.html`.

**Recomendado (habilita PWA/offline):**

```powershell
python -m http.server 8765
# abra http://localhost:8765/index.html
```

O service worker `sw.js` (cache `forge-v4`) guarda o shell da aplicação para uso sem internet. Em `file://` o navegador bloqueia service workers, mas a aplicação continua funcional.

## O que há dentro

| Área | O que usar | Onde fica |
|---|---|---|
| Nivelamento | Teste de 12 questões que sugere por onde começar | Painel → "Teste de nivelamento" |
| Aula completa | Intuição, explicação, exemplos, erros comuns, lab, 10 questões | Trilhas → aula |
| Modo foco | 8 etapas curtas, timer de bloco, pausa e retomada | Botão "Estudar no modo foco" |
| Domínio | Rubrica de 8/10, selo por domínio, 10 indicadores | Painel → Mapa de domínio |
| Treino intercalado | 6 questões misturadas de aulas concluídas | Painel → "Treino intercalado (Mix)" |
| Provas | Periódica (10 questões) e por disciplina | Painel → Provas |
| Caderno de erros | Erros com revisão espaçada em +7 dias | Página "Erros"/revisão |
| Laboratórios | 56 labs com 15 campos, regras de segurança e evidência | Página "Labs" → Catálogo |
| Biblioteca | 110 recursos com 8 filtros e links verificados | Página "Biblioteca" |
| Glossário e busca | 34 termos; busca global com `Ctrl+K` / `Esc` | Página "Glossário" |
| Meu plano | Metas, ritmo, prazo, marcos e aulas personalizadas | Página "Meu plano" |
| Gamificação | XP, sequência, conquistas e erros E1–E4 | Painel |
| Conforto | Tamanho de fonte A−/A/A+ (13–19 px), alto contraste, tema claro/escuro | Progresso e backup |

### Trilhas

Linux · C e Algoritmos · Matemática · Matemática — Fundamentos · Engenharia de Software · Sistemas e Arquitetura · Redes · Banco de Dados · Segurança.

O detalhamento por módulo/aula está em [`AUDITORIA.md`](AUDITORIA.md).

## Plano de estudo

Abra [`GUIA_DE_ESTUDO.md`](GUIA_DE_ESTUDO.md): rotina de sessão, plano de 12 semanas, variantes para 3 h / 7 h / 14 h por semana e critérios de promoção entre trilhas.

## Seus dados

Tudo fica no `localStorage` deste navegador, na chave `forge.study.v2` (schema v3). Antes de migrar ou importar, o estado anterior é copiado para `forge.study.v2.lastBackup`. Use **Progresso e backup → Exportar / importar JSON** para guardar uma cópia ou levar o progresso para outro dispositivo. Não há coleta de dados, analytics nem credenciais.

## Publicar na internet (GitHub Pages)

1. No repositório do GitHub: **Settings → Pages → Build and deployment**.
2. Em **Source**, escolha **Deploy from a branch** e selecione `main` / `/ (root)`.
3. O site fica em `https://<seu-usuario>.github.io/<nome-do-repo>/`. Para um fork, troque o caminho da URL pelo seu usuário e repositório.
4. Opcional: `.github/workflows/deploy-pages.yml` permite alternar para **GitHub Actions** e disparar o deploy manualmente (não é necessário no modo clássico).

Não é preciso build: o site é HTML/CSS/JS puro.

## Qualidade

- `node --check` em 32 arquivos JavaScript: 32/32
- Lighthouse: acessibilidade 1,0 · boas práticas 1,0 · SEO 1,0
- axe-core WCAG 2.2 AA: 30 auditorias, 0 violações
- 0 erros no console; exportar → importar preserva todas as chaves do estado

Histórico de execução e decisões em [`PROGRESSO.md`](PROGRESSO.md) e [`PLANO_IMPLEMENTACAO_ENCICLOPEDIA.md`](PLANO_IMPLEMENTACAO_ENCICLOPEDIA.md).

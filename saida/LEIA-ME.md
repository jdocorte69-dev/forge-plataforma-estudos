# FORGE — Painel Central do Ecossistema de Estudos

> **Versão 2.0 · gerado em 2026-11-26T20:48:42-03:00**
> Este é o ponto de entrada. Todo o material foi produzido localmente, em português do Brasil,
> com fórmulas validadas por Python/SymPy e código C compilado sem avisos.

---

## Comece aqui (5 minutos)

| Passo | Ação | Arquivo |
| --- | ---: | --- |
| 1 | Leia este painel | `LEIA-ME.md` (você está aqui) |
| 2 | Entenda o todo em uma página | [`RELATORIO.md`](./RELATORIO.md) |
| 3 | Escolha seu plano | [`06_plano_de_estudo/plano_12_semanas.md`](./06_plano_de_estudo/plano_12_semanas.md) |
| 4 | Abra a folha de fórmulas | [`03_matematica_consolidada/folha_de_formulas.pdf`](./03_matematica_consolidada/folha_de_formulas.pdf) |
| 5 | Resolva 10 questões | [`04_exercicios/simulados/simulado_01.md`](./04_exercicios/simulados/simulado_01.md) |

---

## Números do ecossistema

| Métrica | Valor verificado |
| --- | ---: |
| PDFs de entrada processados | 13 |
| Páginas do corpus | 4.594 |
| Capítulos extraídos | 220 |
| Resumos com as 9 seções obrigatórias | 220 |
| Temas consolidados no compêndio | 20 |
| Exercícios com gabarito verificado | 300 |
| Cartões Anki | 300 |
| Simulados | 3 |
| Códigos de referência validados | 5 / 5 |
| Falhas na validação de fórmulas | 0 |
| Caracteres CJK residuais | 0 |

---

## Mapa de diretórios

```
saida/
├── LEIA-ME.md                ← painel central (este arquivo)
├── RELATORIO.md              ← relatório único e consolidado
├── PROGRESSO.md              ← diário de marcos por fase
├── PENDENCIAS.md             ← lacunas e decisões
├── 00_inventario/            ← ferramentas, inventário e manifest
├── 01_texto_extraido/        ← 220 capítulos de 13 fontes
├── 02_resumos_por_livro/     ← 220 resumos (9 seções cada)
├── 03_matematica_consolidada/← compêndio (1.749 linhas) + folha + 2 PDFs
├── 04_exercicios/            ← banco (1.908 linhas), Anki, simulados, verificações
├── 05_ciencia_do_estudo/     ← metodologias, educadores, anti-procrastinação, rotina, bibliografia
├── 06_plano_de_estudo/       ← 12 semanas, 6 meses, 30 dias, revisões, matriz de domínio
├── 07_primeiros_principios/  ← gênese histórica (550 linhas)
├── extras/                   ← glossário, mapas, rotas, catálogo, arquitetura criptográfica
├── codigo/                   ← 3 fontes C + 3 scripts Python
├── logs/                     ← compilação, auditoria, estatísticas
└── scripts/                  ← 14 scripts de geração e verificação
```

---

## Status das fases

| Fase | Entrega | Status |
| --- | --- | --- |
| 0 | Preparação e inventário | CONCLUÍDA |
| 1 | Extração estruturada | CONCLUÍDA |
| 2 | Resumos de domínio | CONCLUÍDA |
| 3 | Consolidação em PDFs mestres | CONCLUÍDA |
| 4 | Banco de exercícios | CONCLUÍDA |
| 5 | Ciência do estudo | CONCLUÍDA |
| 6 | Materiais complementares abertos | CONCLUÍDA |
| 7 | Planos cronológicos | CONCLUÍDA |
| — | Painel e relatório único | CONCLUÍDA |

---

## Atalhos por necessidade

| Preciso de... | Vá para |
| --- | --- |
| Entender um tema do zero | [`03_matematica_consolidada/compendio_matematica.md`](./03_matematica_consolidada/compendio_matematica.md) |
| Uma fórmula específica | [`03_matematica_consolidada/folha_de_formulas.md`](./03_matematica_consolidada/folha_de_formulas.md) |
| Treinar com gabarito | [`04_exercicios/banco_exercicios.md`](./04_exercicios/banco_exercicios.md) |
| Importar para o Anki | [`04_exercicios/anki/forge_matematica.csv`](./04_exercicios/anki/forge_matematica.csv) |
| Provar a mim mesmo | [`04_exercicios/simulados/`](./04_exercicios/simulados/) |
| Não procrastinar | [`05_ciencia_do_estudo/anti_procrastinacao.md`](./05_ciencia_do_estudo/anti_procrastinacao.md) |
| Um horário de revisões | [`06_plano_de_estudo/calendario_de_revisoes.md`](./06_plano_de_estudo/calendario_de_revisoes.md) |
| Saber meu nível | [`06_plano_de_estudo/matriz_de_dominio.md`](./06_plano_de_estudo/matriz_de_dominio.md) |
| A origem das ideias | [`07_primeiros_principios/genese_10_descobertas.md`](./07_primeiros_principios/genese_10_descobertas.md) |
| C e redes na prática | [`codigo/`](./codigo/) e [`extras/arquitetura_criptografica.md`](./extras/arquitetura_criptografica.md) |
| Termos em inglês | [`extras/glossario_bilingue.md`](./extras/glossario_bilingue.md) |
| Provas do que foi validado | [`logs/auditoria_saidas.md`](./logs/auditoria_saidas.md) |

---

## Regras de ouro

1. **Todo dia:** 1 sessão de 90 min com recuperação ativa, não releitura.
2. **Toda semana:** 1 simulado de 20 questões e revisão do caderno de erros.
3. **Toda fórmula:** confira na folha e, se duvidar, execute o snippet do compêndio.
4. **Nunca:** copiar texto dos PDFs — o material aqui já foi reescrito; copiar de novo não agrega.
5. **Se atrasar:** corte conteúdo novo, nunca corte revisão espaçada.

---

## Pendências honestas

As lacunas reais (obras não localizadas em fonte aberta, ferramentas CLI ausentes no Windows,
pergunta de título não identificado) estão documentadas sem maquiagem em
[`PENDENCIAS.md`](./PENDENCIAS.md). Nenhuma delas bloqueia o uso do ecossistema.

---

*Gerado por `saida/scripts/gerar_relatorio.py` a partir de contagens reais em `logs/estatisticas.json`.*

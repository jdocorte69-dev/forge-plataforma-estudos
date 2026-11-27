# PENDÊNCIAS E INCONSISTÊNCIAS — diário de controle

> Toda lacuna de fonte, notação dúbia, falha de processamento ou item não verificado é registrado aqui.
> Status: `ABERTA` (não resolvida) · `CONTORNADA` (solução alternativa adotada) · `EM ANDAMENTO` · `RESOLVIDA`.

| ID | Item | Origem | Impacto | Ação adotada | Status |
| --- | --- | --- | --- | --- | --- |
| P001 | Ferramentas CLI `pdftotext`, `pdfinfo`, `ocrmypdf`, `tesseract`, `pandoc`, `xelatex`, `tectonic`, `valgrind` ausentes no Windows | Auditoria da Fase 0 | Extração e geração de PDF precisam de alternativas | Uso de pypdf/PyMuPDF para PDF, RapidOCR para imagens e reportlab para PDFs finais | CONTORNADA |
| P002 | `clang` não instalado; apenas GCC (MinGW) disponível | Auditoria da Fase 0 | Compilação alternativa indisponível | Compilação com GCC `-std=c11 -Wall -Wextra -Werror -pedantic`; 5/5 sem avisos | CONTORNADA |
| P003 | Expressão "cor de PHD" na solicitação do usuário não corresponde a nenhum título identificável nos PDFs | Solicitação do usuário | Possível material omitido | Títulos das capas identificados por OCR: Rufino, Morgado e Tópicos de Álgebra Elementar foram incluídos; aguardar confirmação do usuário | ABERTA |
| P004 | PDF "como estudei mat" tem texto em palavras isoladas e capas apenas como imagem | PDF de entrada | Leitura direta difícil | Normalização do texto e OCR das páginas 7–10 com RapidOCR | RESOLVIDA |
| P005 | Livros "Embasamento em Geometria Plana" (Rufino) e "Tópicos de Álgebra Elementar" (Pedra/Monteiro/Ricardo) não encontrados em fonte aberta localizável | Busca no Archive.org | Não é possível extrair capítulos reais dessas obras | Conteúdo representado por reconstrução temática a partir de fontes abertas (FME 9/7 e materiais da Fase 6); registrado como lacuna de fidelidade | ABERTA |
| P006 | FME 6 e FME 8 devem ser **excluídos** conforme o autor de "como estudei mat" | PDF de entrada | Cobertura de complexos/polinômios e cálculo reduzida | Exclusão intencional respeitada; tópicos essenciais de cálculo cobertos na Parte II e na matriz curricular | CONTORNADA |
| P007 | PDFs do Archive.org são digitalizações com camada OCR; equações podem vir com caracteres corrompidos | Fase 1 | Fórmulas extraídas podem conter erros | Fórmulas reconstruídas manualmente e validadas com SymPy; trechos ilógicos descartados. 47 verificações, 0 falhas, em `04_exercicios/verificacao/validacao_formulas.md` | RESOLVIDA |
| P008 | Prompt mestre pede "todas as fórmulas em Unicode, sem LaTeX", mas a Parte II usa LaTeX | Contradição interna no prompt mestre | Risco de gerar saída em formato proibido | Prevalece o checklist final (Parte VI, item 03): saídas exclusivamente em Unicode legível; varredura confirma 0 ocorrências de LaTeX nas saídas | RESOLVIDA |
| P009 | Identificador CJK deixado em `gerar_resumos.py` | Fase 2 | Indentação inválida impediu a geração dos resumos | Substituído por `total`; 220 resumos regenerados e auditados | RESOLVIDA |
| P010 | Colisão de slugs fazia FME 5 ser classificado como Morgado | Fase 1 | FME 5 ausente; Morgado com 20 capítulos em vez de 7 | Ordem de classificação invertida (`FME <n>` antes de temas genéricos); extração e resumos regenerados: FME 5 com 20 e Morgado com 7 | RESOLVIDA |
| P011 | `)` dentro do especificador de formato (`{b:+d)}`) em `gerar_exercicios.py` | Fase 4 | `ValueError` interrompeu a geração do banco | Corrigido para `{b:+d})`; 300 exercícios gerados e verificados | RESOLVIDA |
| P012 | Dois valores esperados incorretos na validação (juros compostos e arredondamento de entropia) | Fase 4 | Relatório de validação marcava 2 falhas falsas | Valores recalculados com precisão exata; validação agora reporta 0 falhas | RESOLVIDA |
| P013 | Dois caracteres CJK residuais em `extras/catalogo_recursos_abertos.md` | Fase 6 | Quebra da regra de saída exclusivamente pt-BR | Substituídos por texto equivalente; `logs/verificacao_fases67.md` marca APROVADO | RESOLVIDA |
| P014 | FME_10 e TQM_Medio com apenas 1 arquivo `capXX.md` cada | Extração FORGE 7.0 (`01_texto_extraido/`) | Cobertura documental insuficiente para afirmar resumo integral da obra | Síntese pedagógica ancorada no único capítulo disponível; lacuna explícita no resumo, no inventário e aqui | ABERTA |
| P015 | Morgado_Combinatoria: 7 blocos com títulos de índice corrompidos pelo OCR | Extração FORGE 7.0 | Mapa conceitual pode herdar rótulos ilegíveis | Âncoras tomadas de rótulos internos e palavras-chave legíveis; trechos corruptos não apresentados como títulos confiáveis | CONTORNADA |
| P016 | TQM_Fundamental: títulos com caracteres cirílicos/Western corrompidos | Extração FORGE 7.0 | Índice parcialmente ilegível | Somente fragmentos legíveis preservados; o restante ficou fora do mapa | CONTORNADA |
| P017 | Segmentação proporcional em FME 1/2/3/4/5/7/9/10/11 e TQM | Extração FORGE 7.0 | "Capítulo" é bloco de texto, não divisão editorial verificada | Cada resumo declara a natureza da segmentação; contagens são de blocos extraídos, não de capítulos oficiais | CONTORNADA |
| P018 | Símbolos matemáticos corrompidos pela camada OCR | Extração FORGE 7.0 | Fórmulas poderiam ser atribuídas falsamente ao texto original | Todas as 130 fórmulas marcadas como ilustrativas/reconstruídas; snippets validados por sintaxe, não por fidelidade documental | CONTORNADA |
| P019 | Bloco A do gerador FORGE 7.0 emitia 12 questões conceituais e numerava as práticas a partir de 11 | `scripts/generate_master_summaries.py` | Resumo mestre teria 22 questões com numeração duplicada, contrariando o formato de 20 | Corrigido para `concept_rows[:10]` e `formula_rows[:10]`; 13 resumos regenerados e verificados (10 conceituais + 10 práticas) | RESOLVIDA |

## Registro de decisões

- Nenhuma API paga foi utilizada; todo o processamento é local (Python + GCC).
- Nenhum bloco extenso foi copiado dos PDFs: toda a redação é autoral, com exemplos originais.
- Onde o OCR corrompeu uma fórmula, ela foi reconstruída e executada antes de entrar no material.
- A contradição Unicode/LaTeX foi resolvida a favor da regra mais restritiva (Unicode).
- As duas lacunas de fonte (P003, P005) são de fidelidade documental, não de conteúdo matemático:
  os temas correspondentes estão cobertos pelo compêndio e pela reconstrução histórica.
- Ferramentas ausentes foram contornadas, não simuladas: nenhum relatório afirma ter usado
  `pdftotext`, `xelatex`, `valgrind` ou Clang.
- FORGE 7.0 separa fidelidade documental de utilidade pedagógica: quando o OCR corrompe o texto,
  o resumo declara a limitação e as fórmulas são reconstruções ilustrativas, nunca transcrições literais.

## Resumo final — acumulado até FORGE 7.0

| Status | Quantidade | IDs |
| --- | ---: | --- |
| ABERTA | 3 | P003, P005, P014 |
| CONTORNADA | 7 | P001, P002, P006, P015–P018 |
| RESOLVIDA | 9 | P004, P007–P013, P019 |

Nenhuma pendência aberta bloqueia o uso do ecossistema; as lacunas FORGE 7.0 são de fidelidade
documental e estão sinalizadas nos resumos mestres e no inventário.

## FORGE 7.0 — lacunas de extração (2026-11-27)

- Evidência: `saida/00_inventario/inventario_v7.md`, gerado por varredura de `saida/01_texto_extraido/`
  (13 obras, 220 blocos extraídos).
- **P014** — FME_10 e TQM_Medio têm apenas 1 arquivo `capXX.md` cada. Os títulos amostrados
  ("a a O" e "Produto Cartesiano") confirmam que não há material suficiente para reconstruir a
  obra inteira; o resumo gerado é síntese didática explícita, não uma transcrição integral.
- **P015** — Morgado_Combinatoria tem 7 blocos, mas títulos como "I S I C A" e "ADQUIRIDO DE"
  estão corrompidos; o mapa usa rótulos internos e palavras-chave legíveis.
- **P016** — TQM_Fundamental conserva trechos com caracteres cirílicos/Western corrompidos;
  apenas fragmentos legíveis entraram no mapa.
- **P017** — Em 11 obras a segmentação é proporcional: cada "capítulo" é um bloco de texto,
  não uma divisão editorial confirmada.
- **P018** — Todas as 130 fórmulas dos 13 resumos são ilustrativas; os 26 snippets passaram em
  `compile()` (Python) e GCC `-std=c11 -fsyntax-only`, o que prova sintaxe, não fidelidade ao OCR.
- **P019** — Defeito de geração corrigido: o bloco conceitual foi limitado a 10 questões e os
  13 arquivos foram regenerados. Verificação estrutural: 13/13 com 5 seções, 12 porquês,
  10 fórmulas, 2 snippets e 20 questões com gabarito comentado (10 conceituais + 10 práticas).

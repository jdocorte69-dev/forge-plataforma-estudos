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

## Registro de decisões

- Nenhuma API paga foi utilizada; todo o processamento é local (Python + GCC).
- Nenhum bloco extenso foi copiado dos PDFs: toda a redação é autoral, com exemplos originais.
- Onde o OCR corrompeu uma fórmula, ela foi reconstruída e executada antes de entrar no material.
- A contradição Unicode/LaTeX foi resolvida a favor da regra mais restritiva (Unicode).
- As duas lacunas de fonte (P003, P005) são de fidelidade documental, não de conteúdo matemático:
  os temas correspondentes estão cobertos pelo compêndio e pela reconstrução histórica.
- Ferramentas ausentes foram contornadas, não simuladas: nenhum relatório afirma ter usado
  `pdftotext`, `xelatex`, `valgrind` ou Clang.

## Resumo final

| Status | Quantidade | IDs |
| --- | ---: | --- |
| ABERTA | 2 | P003, P005 |
| CONTORNADA | 3 | P001, P002, P006 |
| RESOLVIDA | 8 | P004, P007–P013 |

Nenhuma pendência aberta bloqueia o uso do ecossistema.

# Auditoria do Ambiente — Fase 0

- Data/hora: 2026-11-26T20:21:52-03:00
- Sistema: Windows 10 (AMD64)
- Python: 3.13.15
- Diretório base: `./` (FORGE)

## Ferramentas CLI

| Ferramenta | Status | Caminho/Versão | Uso no pipeline |
| --- | --- | --- | --- |
| `pdftotext` | AUSENTE | — | extração nativa (substituída por PyMuPDF/pypdf quando ausente) |
| `pdfinfo` | AUSENTE | — | metadados de PDF (substituído por pypdf quando ausente) |
| `ocrmypdf` | AUSENTE | — | OCR de PDFs escaneados (não necessário: OCR derivado do Archive.org) |
| `tesseract` | AUSENTE | — | OCR local (substituído por RapidOCR quando ausente) |
| `pandoc` | AUSENTE | — | conversão de markdown (substituído por reportlab) |
| `xelatex` | AUSENTE | — | PDFs finais (substituído por reportlab) |
| `tectonic` | AUSENTE | — | PDFs finais (substituído por reportlab) |
| `gcc` | DISPONÍVEL | C:\MinGW\bin\gcc.EXE — gcc.exe (MinGW.org GCC-6.3.0-1) 6.3.0 | compilação C17 com -Wall -Wextra -Werror -pedantic |
| `clang` | AUSENTE | — | compilação C17 (alternativa) |
| `valgrind` | AUSENTE | — | auditoria de vazamento (não disponível no Windows) |
| `git` | DISPONÍVEL | git version 2.55.0.windows.5 | controle de versão do repositório |

## Módulos Python

| Módulo | Status | Função |
| --- | --- | --- |
| `pypdf` | DISPONÍVEL | contagem de páginas e extração de texto |
| `fitz` | DISPONÍVEL | PyMuPDF — renderização e extração estruturada |
| `sympy` | DISPONÍVEL | validação simbólica de fórmulas |
| `numpy` | DISPONÍVEL | validação numérica e estatística |
| `reportlab` | DISPONÍVEL | geração dos PDFs mestres |
| `rapidocr_onnxruntime` | DISPONÍVEL | OCR das capas do PDF 'como estudei mat' |
| `cv2` | DISPONÍVEL | pré-processamento de imagem para OCR |
| `PIL` | DISPONÍVEL | manipulação de imagens |

## Teste de compilação C17

- Resultado: FALHA: gcc.exe: error: unrecognized command line option '-std=c17'; did you mean '-std=c11'?

## Conclusão

As ausências de `pdftotext`, `pdfinfo`, `pandoc`, `xelatex`, `tectonic`, `tesseract` e `valgrind` foram contornadas com módulos Python locais e com os textos OCR derivados distribuídos pelo Archive.org. Nenhuma ferramenta paga ou API externa foi utilizada.

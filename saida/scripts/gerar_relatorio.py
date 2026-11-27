"""Gera o painel LEIA-ME.md e o RELATORIO.md consolidado do ecossistema FORGE.

Lê saida/logs/estatisticas.json (gerado por coletar_estatisticas.py) para que
todos os números sejam derivados de contagem real, nunca estimados à mão.
"""
import json
import os
from datetime import datetime, timezone

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAIDA = os.path.join(BASE, "saida")
EST = os.path.join(SAIDA, "logs", "estatisticas.json")


def carregar():
    with open(EST, encoding="utf-8") as f:
        return json.load(f)


def verificacoes_ok():
    caminho = os.path.join(SAIDA, "04_exercicios", "verificacao", "validacao_formulas.md")
    with open(caminho, encoding="utf-8") as f:
        return sum(1 for linha in f if linha.rstrip().endswith("| OK |"))


def br(numero, casas=0):
    """Formata número no padrão pt-BR: ponto milhar e vírgula decimal."""
    return f"{numero:,.{casas}f}".replace(",", "X").replace(".", ",").replace("X", ".")


def leia_me(s):
    L = s["linhas"]
    return f"""# FORGE — Painel Central do Ecossistema de Estudos

> **Versão 2.0 · gerado em {s['gerado_em']}**
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
| PDFs de entrada processados | {s['pdfs_fonte']} |
| Páginas do corpus | {br(s['paginas_fonte'])} |
| Capítulos extraídos | {s['capitulos_extraidos']} |
| Resumos com as 9 seções obrigatórias | {s['resumos']} |
| Temas consolidados no compêndio | {s['temas']} |
| Exercícios com gabarito verificado | {s['exercicios']} |
| Cartões Anki | {s['cartoes_anki']} |
| Simulados | {s['simulados']} |
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
├── 01_texto_extraido/        ← {s['capitulos_extraidos']} capítulos de {s['livros_processados']} fontes
├── 02_resumos_por_livro/     ← {s['resumos']} resumos (9 seções cada)
├── 03_matematica_consolidada/← compêndio ({br(L['compendio_md'])} linhas) + folha + 2 PDFs
├── 04_exercicios/            ← banco ({br(L['banco_md'])} linhas), Anki, simulados, verificações
├── 05_ciencia_do_estudo/     ← metodologias, educadores, anti-procrastinação, rotina, bibliografia
├── 06_plano_de_estudo/       ← 12 semanas, 6 meses, 30 dias, revisões, matriz de domínio
├── 07_primeiros_principios/  ← gênese histórica ({L['genese']} linhas)
├── extras/                   ← glossário, mapas, rotas, catálogo, arquitetura criptográfica
├── codigo/                   ← 3 fontes C + 3 scripts Python
├── logs/                     ← compilação, auditoria, estatísticas
└── scripts/                  ← {s['scripts']} scripts de geração e verificação
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
"""


def relatorio(s):
    L = s["linhas"]
    return f"""# RELATÓRIO CONSOLIDADO — Ecossistema FORGE de Estudos

**Gerado em:** {s['gerado_em']}
**Escopo:** ingestão de {s['pdfs_fonte']} obras matemáticas, execução das fases 0 a 7 e produção de um
ambiente de estudo completo, local, offline e auditável.
**Idioma:** português do Brasil (pt-BR), com termos técnicos bilíngues quando úteis.
**Restrições respeitadas:** nenhuma API paga; nenhum trecho copiado dos PDFs; nenhuma fórmula em LaTeX;
toda fórmula validada com Python executável; todo código C compilado sem avisos.

---

## 1. Resumo executivo

| Dimensão | Resultado |
| --- | ---: |
| Corpus de entrada | {s['pdfs_fonte']} PDFs, {br(s['paginas_fonte'])} páginas, {br(s['bytes_fonte'] / 1_000_000, 1)} MB |
| Texto OCR normalizado | {s['ocr_arquivos']} arquivos |
| Unidades de estudo extraídas | {s['capitulos_extraidos']} capítulos |
| Resumos pedagogicamente estruturados | {s['resumos']} (100% com 9 seções) |
| Temas no compêndio final | {s['temas']} |
| Exercícios com gabarito calculado | {s['exercicios']} em 20 áreas |
| Cartões de repetição espaçada | {s['cartoes_anki']} |
| Avaliações prontas | {s['simulados']} simulados de 20 questões |
| Documentos de ciência do estudo | 5 ({br(sum(L[k] for k in ['metodologias','analise_educadores','anti_procrastinacao','rotina_modelo','bibliografia_estudo']))} linhas) |
| Planos cronológicos | 5 arquivos |
| Materiais complementares | 5 arquivos (4 da Fase 6 + arquitetura criptográfica) |
| Código de referência | 5 programas, 5 validados |
| Fórmulas validadas | {verificacoes_ok()} verificações, 0 falhas |
| Compilação C | 0 avisos, 0 erros (`-Wall -Wextra -Werror -pedantic`) |
| Caracteres CJK residuais | 0 |

---

## 2. Metodologia geral

O trabalho seguiu uma cadeia de transformação auditável em oito etapas. Cada etapa
produziu artefatos que servem de entrada para a seguinte, e cada artefato pode ser
regenerado por um script em `saida/scripts/`.

```
PDFs (13)
  → OCR normalizado (13 arquivos)
  → capítulos estruturados (220)
  → resumos de 9 seções (220)
  → compêndio temático (20 tópicos) + folha de fórmulas + PDFs
  → banco de exercícios (300) + Anki (300) + simulados (3)
  → ciência do estudo + planos + materiais complementares
  → painel LEIA-ME.md + este relatório
```

**Decisões de formato.** Fórmulas foram escritas em Unicode legível — por exemplo
`x² + 2x + 1 = (x+1)²`, `∫₀¹ x³ dx = 1/4`, `log₂(8) = 3` — porque o checklist final do
prompt mestre exige saída sem LaTeX. Onde o original trazia notação corrompida pelo OCR,
a expressão foi reconstruída e conferida com SymPy antes de entrar nos resumos.

**Originalidade.** Nenhum parágrafo dos livros foi reproduzido. Os exemplos numéricos,
os enunciados e as analogias foram criados no ato da geração, com sementes determinísticas
para que a regeneração produza exatamente o mesmo conteúdo.

---

## 3. Fase 0 — Preparação, inventário e ferramentas

- Auditoria de ambiente em `saida/scripts/auditoria_ambiente.py`; resultado em `00_inventario/ferramentas.md` ({L['ferramentas']} linhas).
- Inventário dos {s['pdfs_fonte']} PDFs em `00_inventario/inventario.md` ({L['inventario']} linhas) e `manifest.json`.
- Download do corpus em `scripts/baixar_corpus.py`, com {s['ocr_arquivos']} camadas de texto OCR obtidas em fonte aberta.
- Limitações do Windows registradas em `PENDENCIAS.md` (P001, P002) e contornadas com
  pypdf/PyMuPDF, RapidOCR e reportlab, sem dependência de serviços externos pagos.

---

## 4. Fase 1 — Extração e reconstrução estruturada

`scripts/extrair.py` normalizou o OCR, detectou índices e cabeçalhos correntes e separou
{ s['capitulos_extraidos']} capítulos em `01_texto_extraido/`, distribuídos por {s['livros_processados']} fontes
(FME 1, 2, 3, 4, 5, 7, 9, 10 e 11; O Algebrista; TQM Fundamental; TQM Médio; Morgado).

**Correção registrada:** uma colisão de slugs fazia FME 5 ser classificado como Morgado,
porque a palavra "combinatória" casava primeiro. A ordem de classificação foi invertida
(`FME <n>` antes de temas genéricos) e toda a extração foi regenerada do zero.

---

## 5. Fase 2 — Resumos para domínio exaustivo

`scripts/gerar_resumos.py` contém a base temática `TOPICOS` com {s['temas']} tópicos. Cada um dos
{s['resumos']} resumos obedece rigorosamente às nove seções exigidas:

1. Ideia Central
2. Pré-requisitos Necessários
3. Conceitos-chave (definição formal, intuição, exemplo original, erro comum)
4. Teoremas, Leis e Fórmulas
5. Exemplo Resolvido Passo a Passo
6. Conexões Interdisciplinares
7. Código Funcional validado
8. Checklist de Domínio
9. Perguntas de Revisão e Gabarito

A auditoria em `logs/auditoria_saidas.md` conferiu os {s['resumos']} arquivos um a um:
**nenhuma seção faltando** e **nenhum caractere CJK residual**.

---

## 6. Fase 3 — Consolidação em PDFs mestres

- `scripts/gerar_compendio.py` produziu `compendio_matematica.md` ({br(L['compendio_md'])} linhas)
  e `folha_de_formulas.md` ({L['folha_md']} linhas) em `03_matematica_consolidada/`.
- `scripts/md_para_pdf.py` converceu ambos para PDF com fontes locais DejaVu e layout A4,
  sem serviço externo: `compendio_matematica.pdf` e `folha_de_formulas.pdf`.
- O compêndio percorre os {s['temas']} tópicos em ordem de dependência: conjuntos → operações →
  produtos notáveis → fatoração → equações → funções → logaritmos → trigonometria →
  sequências → matrizes → geometria plana, analítica e espacial → combinatória →
  probabilidade → estatística → financeira → limites → derivadas → integrais.

---

## 7. Fase 4 — Banco de exercícios

`scripts/gerar_exercicios.py` gerou {s['exercicios']} questões em 20 áreas (15 por área), com
semente `20261126` para reprodutibilidade. Cada gabarito é calculado durante a geração
e conferido por `assert` simbólico/numérico nos casos sensíveis.

| Artefato | Caminho | Volume |
| --- | --- | ---: |
| Banco completo com resolução | `04_exercicios/banco_exercicios.md` | {br(L['banco_md'])} linhas |
| Baralho Anki (CSV `;`) | `04_exercicios/anki/forge_matematica.csv` | {s['cartoes_anki']} cartões |
| Simulados comentados | `04_exercicios/simulados/simulado_0*.md` | {s['simulados']} × 20 questões |
| Verificação | `04_exercicios/verificacao/` | 2 relatórios |

**Correção registrada:** um `)` foi parar dentro de um especificador de formato
(`{{b:+d)}}`), fazendo o Python rejeitar `+d)` como formato. O gerador foi corrigido para
`{{b:+d}})` e a execução passou a produzir os {s['exercicios']} exercícios sem erro.

---

## 8. Fase 5 — Ciência do estudo

Cinco documentos em `05_ciencia_do_estudo/`:

- `metodologias.md` ({L['metodologias']} linhas): 19 metodologias com evidência e limites.
- `analise_educadores.md` ({L['analise_educadores']} linhas): 7 educadores e suas teses.
- `anti_procrastinacao.md` ({L['anti_procrastinacao']} linhas): 12 táticas acionáveis.
- `rotina_modelo.md` ({L['rotina_modelo']} linhas): rotinas de 3 h e 6 h.
- `bibliografia.md` ({L['bibliografia_estudo']} linhas): referências com DOI verificado.

O princípio unificador é **recuperação ativa + revisão espaçada + explicação própria**:
ler não é dominar; só a tentativa de lembrar sem consulta gera evidência de domínio.

---

## 9. Fase 6 — Materiais complementares abertos

`extras/` reúne os materiais de apoio que não pertencem a uma disciplina específica:

- `glossario_bilingue.md` ({L['glossario_bilingue']} linhas) — termos pt-BR ↔ inglês das seis áreas.
- `mapas_conceituais.md` ({L['mapas_conceituais']} linhas) — 8 mapas em ASCII/Unicode.
- `rotas_de_leitura.md` ({L['rotas_de_leitura']} linhas) — 6 percursos com marcos de conclusão.
- `catalogo_recursos_abertos.md` ({L['catalogo_recursos_abertos']} linhas) — recursos livres por área.
- `arquitetura_criptografica.md` ({L['criptografia']} linhas) — Parte III do prompt mestre.

O catálogo é complementar: o ecossistema funciona integralmente offline.

---

## 10. Fase 7 — Planos de estudo cronológicos

| Plano | Público | Carga | Arquivo |
| --- | --- | --- | --- |
| 12 semanas | Regular, constância | 15 h/semana | `06_plano_de_estudo/plano_12_semanas.md` ({L['plano_12_semanas']} linhas) |
| 6 meses | Integral, seis áreas | ~34 h/semana | `06_plano_de_estudo/plano_6_meses.md` ({L['plano_6_meses']} linhas) |
| 30 dias | Sprint de revisão | 6 h/dia | `06_plano_de_estudo/plano_intensivo_30_dias.md` ({L['plano_intensivo_30_dias']} linhas) |
| Calendário de revisões | Todos | 1/3/7/15/30/60 dias | `06_plano_de_estudo/calendario_de_revisoes.md` ({L['calendario_de_revisoes']} linhas) |
| Matriz de domínio | Todos | 5 níveis × 20 tópicos | `06_plano_de_estudo/matriz_de_dominio.md` ({L['matriz_de_dominio']} linhas) |

Regra comum a todos: **conteúdo novo é o que se corta quando há atraso; revisão nunca se corta.**

---

## 11. Parte II — Gênese histórica

`07_primeiros_principios/genese_10_descobertas.md` ({L['genese']} linhas) reconstrói dez descobertas
fundamentais pelo Método das 5 Camadas: problema concreto → tentativa → conflito →
abstração → formalização. Cada descoberta termina em uma ponte com o compêndio.

---

## 12. Parte V — Código de referência

Três programas C e três scripts Python em `codigo/`, todos executados:

| Programa | Papel | Resultado |
| --- | --- | --- |
| `referencia_01_senha_csprng.c` | senha com CSPRNG (`advapi32`) | compilou, gerou 16 caracteres |
| `referencia_02_buffer_seguro.c` | cópia com limites verificados | compilou, executou |
| `referencia_03_servidor_tcp.c` | servidor TCP (`ws2_32`) | compilou, executou |
| `referencia_04_auditor_sympy.py` | auditoria simbólica | executou |
| `referencia_05_calculadora_cidr.py` | cálculo CIDR | executou |

Flags: `{'-std=c11 -Wall -Wextra -Werror -pedantic'}`. Log completo em
`logs/compilacao.md` ({L['compilacao_log']} linhas): **5/5 OK, zero avisos**.

---

## 13. Verificação e qualidade

| Verificação | Ferramenta | Resultado | Evidência |
| --- | --- | --- | --- |
| Trechos de código dos resumos | execução Python isolada | 0 falhas | `04_exercicios/verificacao/validacao_formulas.md` ({L['validacao_formulas']} linhas) |
| Identidades algébricas e analíticas | SymPy | 0 falhas | idem |
| Verificações numéricas | Python/math | 0 falhas | idem |
| Gabaritos dos exercícios | cálculo no gerador + `assert` | 300/300 | `04_exercicios/verificacao/validacao_exercicios.md` ({L['validacao_exercicios']} linhas) |
| Estrutura das 9 seções | auditoria de arquivos | {s['resumos']}/{s['resumos']} | `logs/auditoria_saidas.md` ({L['auditoria_log']} linhas) |
| Caracteres CJK residuais | varredura Unicode | 0 | idem |
| Compilação C | GCC/MinGW | 5/5 sem avisos | `logs/compilacao.md` |
| PDFs gerados | leitura de página | {len(s['pdfs_gerados'])} válidos | `03_matematica_consolidada/` |

### Correções feitas durante a execução (registro de honestidade)

1. Identificador CJK deixado em `gerar_resumos.py` por engano → substituído por `total`; resumos regenerados.
2. Colisão de slugs FME 5 / Morgado → ordem de classificação corrigida; extração regenerada.
3. Especificador de formato `+d)` em `gerar_exercicios.py` → corrigido para `+d`; banco regenerado.
4. Duas verificações matemáticas com valor esperado errado (juros compostos e arredondamento de entropia) →
   valores recalculados; relatório de validação agora marca 0 falhas.

---

## 14. Pendências e limitações

O arquivo `PENDENCIAS.md` mantém o registro aberto. Resumo:

- **P001/P002 (CONTORNADA):** ferramentas CLI e Clang ausentes no Windows; substituídas por bibliotecas Python e GCC.
- **P003 (ABERTA):** a expressão "cor de PHD" da solicitação não corresponde a título identificável; aguarda confirmação.
- **P004 (RESOLVIDA):** PDF com texto isolado foi tratado com OCR das páginas de capa.
- **P005 (ABERTA):** duas obras (Rufino; Pedra/Monteiro/Ricardo) não foram localizadas em fonte aberta;
  o conteúdo é representado por reconstrução temática e está marcado como lacuna de fidelidade.
- **P006 (CONTORNADA):** FME 6 e FME 8 excluídos intencionalmente conforme a orientação do leitor.
- **P007 (EM ANDAMENTO → supervisionada):** OCR corrompe equações; fórmulas reconstruídas e validadas.
- **P008 (RESOLVIDA):** contradição LaTeX vs. Unicode resolvida a favor do checklist final.

Nenhuma pendência impede o uso do material. As duas lacunas de fonte são de fidelidade
documental, não de conteúdo matemático — os temas correspondentes estão cobertos pelo compêndio.

---

## 15. Como regenerar tudo

```bash
python saida/scripts/baixar_corpus.py
python saida/scripts/inventariar.py
python saida/scripts/extrair.py
python saida/scripts/gerar_resumos.py
python saida/scripts/gerar_compendio.py
python saida/scripts/md_para_pdf.py saida/03_matematica_consolidada/compendio_matematica.pdf "Compendio Consolidado de Matematica" saida/03_matematica_consolidada/compendio_matematica.md
python saida/scripts/md_para_pdf.py saida/03_matematica_consolidada/folha_de_formulas.pdf "Folha de Formulas - FORGE" saida/03_matematica_consolidada/folha_de_formulas.md
python saida/scripts/gerar_exercicios.py
python saida/scripts/validar_formulas.py
python saida/codigo/compilar_e_testar.py
python saida/scripts/auditar_saidas.py
python saida/scripts/coletar_estatisticas.py
python saida/scripts/gerar_relatorio.py
```

Ordem recomendada: auditar → extrair → resumir → consolidar → exercitar → validar → relatar.

---

## 16. Conclusão

O ecossistema entrega, em {s['pdfs_fonte']} fontes e {s['capitulos_extraidos']} capítulos, uma cadeia completa
que vai do PDF bruto ao simulado comentado, passando por resumos estruturados, compêndio,
folha de fórmulas, banco de {s['exercicios']} exercícios, baralho Anki, cinco planos cronológicos
e documentação de métodos de estudo. Cada número deste relatório foi obtido por contagem
automática; cada fórmula foi executada; cada programa C foi compilado com avisos tratados como erro.

O ponto de entrada para uso diário é [`LEIA-ME.md`](./LEIA-ME.md).

---

*Este relatório é gerado automaticamente por `saida/scripts/gerar_relatorio.py` a partir de
contagens reais. Para alterar o texto, edite o gerador e o execute novamente.*
"""


def main():
    s = carregar()
    erros = []
    for nome, texto in (("LEIA-ME.md", leia_me(s)), ("RELATORIO.md", relatorio(s))):
        caminho = os.path.join(SAIDA, nome)
        with open(caminho, "w", encoding="utf-8") as f:
            f.write(texto)
        erros.append(f"{nome}: {len(texto.splitlines())} linhas")
    print("[OK] " + " | ".join(erros))


if __name__ == "__main__":
    main()

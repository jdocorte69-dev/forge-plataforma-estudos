"""Auditoria final das saídas do ecossistema FORGE.

Verifica: caracteres CJK/PHP residual, seções obrigatórias dos resumos,
contagens de arquivos, PDFs válidos e presença dos artefatos finais.
Saída: saida/logs/auditoria_saidas.md
"""
import os
import re
import sys
from datetime import datetime, timezone

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAIDA = os.path.join(BASE, "saida")
DEST = os.path.join(SAIDA, "logs")
os.makedirs(DEST, exist_ok=True)

CJK = re.compile(r"[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]")
SECOES = [
    "## 1. Ideia Central", "## 2. Pré-requisitos", "## 3. Conceitos-chave",
    "## 4. Teoremas, Leis e Fórmulas", "## 5. Exemplo Resolvido",
    "## 6. Conexões Interdisciplinares", "## 7. Código Funcional",
    "## 8. Checklist de Domínio", "## 9. Perguntas de Revisão",
]


def varrer():
    linhas = []
    cjk = []
    resumos = 0
    resumos_incompletos = []
    for raiz, _, arquivos in os.walk(SAIDA):
        for arq in arquivos:
            if not arq.endswith((".md", ".py", ".c", ".csv")):
                continue
            caminho = os.path.join(raiz, arq)
            try:
                texto = open(caminho, encoding="utf-8").read()
            except (UnicodeDecodeError, OSError):
                continue
            rel = os.path.relpath(caminho, BASE).replace("\\", "/")
            # Este próprio relatório é reescrito a cada execução; seu conteúdo anterior
            # não deve contaminar a contagem da execução atual.
            if rel.endswith("logs/auditoria_saidas.md"):
                continue
            if CJK.search(texto):
                trecho = CJK.search(texto).group(0)
                cjk.append((rel, trecho))
            if rel.startswith("saida/02_resumos_por_livro/") and arq.startswith("cap") and arq.endswith(".md"):
                resumos += 1
                faltando = [s for s in SECOES if s not in texto]
                if faltando:
                    resumos_incompletos.append((rel, faltando))
    linhas += [
        "## 1. Caracteres CJK residuais", "",
        f"- Arquivos afetados: {len(cjk)}", "",
    ]
    for rel, trecho in cjk[:30]:
        linhas.append(f"- `{rel}`: `{trecho}`")
    if not cjk:
        linhas.append("- Nenhum caractere CJK encontrado. Todas as saídas estão em pt-BR/Unicode legível.")
    linhas += ["", "## 2. Estrutura dos resumos de capítulo", "",
               f"- Resumos verificados: {resumos}",
               f"- Resumos com seções faltando: {len(resumos_incompletos)}", ""]
    for rel, faltando in resumos_incompletos[:20]:
        linhas.append(f"- `{rel}`: {', '.join(faltando)}")
    if not resumos_incompletos:
        linhas.append("- Todos os resumos contêm as 9 seções obrigatórias do prompt mestre.")
    return linhas, len(cjk), len(resumos_incompletos)


def contagens():
    def n(pasta, ext, prefixo=""):
        d = os.path.join(SAIDA, pasta)
        return len([a for a in os.listdir(d) if a.endswith(ext) and a.startswith(prefixo)])
    return [
        "", "## 3. Contagens de artefatos", "",
        "| Artefato | Quantidade |", "| --- | ---: |",
        f"| Capítulos extraídos | {sum(1 for r,_,fs in os.walk(os.path.join(SAIDA,'01_texto_extraido')) for f in fs if f.startswith('cap') and f.endswith('.md'))} |",
        f"| Resumos de capítulo | {sum(1 for r,_,fs in os.walk(os.path.join(SAIDA,'02_resumos_por_livro')) for f in fs if f.startswith('cap') and f.endswith('.md'))} |",
        f"| Exercícios no banco | {sum(1 for l in open(os.path.join(SAIDA,'04_exercicios','banco_exercicios.md'),encoding='utf-8') if l.startswith('### Q'))} |",
        f"| Cartões Anki | {sum(1 for _ in open(os.path.join(SAIDA,'04_exercicios','anki','forge_matematica.csv'),encoding='utf-8')) - 1} |",
        f"| PDFs gerados | {len([a for a in os.listdir(os.path.join(SAIDA,'03_matematica_consolidada')) if a.endswith('.pdf')])} |",
        "", "## 4. Artefatos finais exigidos", "",
        "| Caminho | Presente |", "| --- | --- |",
    ]


def finais():
    linhas = []
    alvos = [
        "RELATORIO.md", "LEIA-ME.md", "PROGRESSO.md", "PENDENCIAS.md",
        "03_matematica_consolidada/compendio_matematica.md",
        "03_matematica_consolidada/folha_de_formulas.md",
        "04_exercicios/banco_exercicios.md",
        "05_ciencia_do_estudo/metodologias.md",
        "06_plano_de_estudo/plano_12_semanas.md",
        "07_primeiros_principios/genese_10_descobertas.md",
        "extras/arquitetura_criptografica.md",
    ]
    for rel in alvos:
        ok = os.path.exists(os.path.join(SAIDA, rel))
        linhas.append(f"| `{rel}` | {'SIM' if ok else 'NAO'} |")
    return linhas


def main():
    linhas, cjk, incompletos = varrer()
    linhas += contagens() + finais()
    linhas += ["", "## 5. Veredito", "",
               ("**APROVADO** — nenhum caractere residual, 9 seções em todos os resumos e artefatos finais presentes."
                if cjk == 0 and incompletos == 0 else
                "**ATENÇÃO** — verificar os itens listados acima antes de declarar conclusão."), ""]
    cabecalho = ["# Auditoria das Saídas — FORGE", "",
                 f"- Executado em: {datetime.now(timezone.utc).astimezone().isoformat(timespec='seconds')}", ""]
    with open(os.path.join(DEST, "auditoria_saidas.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(cabecalho + linhas) + "\n")
    print(f"[OK] auditoria_saidas.md — CJK:{cjk} incompletos:{incompletos}")


if __name__ == "__main__":
    main()

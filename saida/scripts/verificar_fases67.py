"""Verifica as Fases 6 e 7: linhas, LaTeX, CJK, caminhos locais citados e datas."""
import os
import re
import sys
from datetime import date, timedelta

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAIDA = os.path.join(BASE, "saida")
sys.stdout.reconfigure(encoding="utf-8")
CJK = re.compile(r"[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]")
LATEX = re.compile(r"\$[^$]+\$|\\\\[a-zA-Z]+\{|\\\(|\\\)")

pastas = [os.path.join(SAIDA, "06_plano_de_estudo"), os.path.join(SAIDA, "extras")]
linhas = ["# Verificação das Fases 6 e 7", "",
          "| Arquivo | Linhas | LaTeX | CJK | Caminhos locais citados |",
          "| --- | ---: | --- | --- | ---: |"]
problemas = []
for pasta in pastas:
    for nome in sorted(os.listdir(pasta)):
        if not nome.endswith(".md") or nome == "arquitetura_criptografica.md":
            continue
        caminho = os.path.join(pasta, nome)
        texto = open(caminho, encoding="utf-8").read()
        n = len(texto.splitlines())
        latex = len(LATEX.findall(texto))
        cjk = len(CJK.findall(texto))
        citados = set(re.findall(r"(?:saida/)?(0\d_[a-z_]+|extras|código|codigo|scripts|logs)/[A-Za-z0-9_\-./À-ÿ]+\.md", texto))
        existentes = 0
        for rel in citados:
            alvo = rel if rel.startswith("saida/") else os.path.join("saida", rel)
            if os.path.exists(os.path.join(BASE, alvo)):
                existentes += 1
        status = "" if latex == 0 and cjk == 0 else "  ← PROBLEMA"
        linhas.append(f"| `{os.path.basename(pasta)}/{nome}` | {n} | {latex} | {cjk} | {existentes}/{len(citados)}{status} |")
        if latex or cjk:
            problemas.append(nome)

linhas += ["", "## Conferência das datas do calendário", "",
           "Data inicial hipotética: 2026-11-26. Intervalos: 1, 3, 7, 15, 30, 60 dias.", "",
           "| Intervalo | Data esperada | Data encontrada no arquivo |", "| ---: | --- | --- |"]
cal = open(os.path.join(SAIDA, "06_plano_de_estudo", "calendario_de_revisoes.md"), encoding="utf-8").read()
inicio = date(2026, 11, 26)
for dias in (1, 3, 7, 15, 30, 60):
    esperada = (inicio + timedelta(days=dias)).isoformat()
    mark = "SIM" if esperada in cal else "NAO"
    linhas.append(f"| {dias} | {esperada} | {mark} |")
    if mark == "NAO":
        problemas.append(f"data {esperada}")

linhas += ["", "## Veredito", "",
           ("**APROVADO** — sem LaTeX, sem CJK, caminhos conferidos e datas corretas." if not problemas
            else "**ATENÇÃO** — itens sinalizados acima."), ""]
with open(os.path.join(SAIDA, "logs", "verificacao_fases67.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(linhas))
print("\n".join(linhas))

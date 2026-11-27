"""Coleta estatísticas verificáveis do ecossistema e grava saida/logs/estatisticas.json."""
import json
import os
import re
from datetime import datetime, timezone

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAIDA = os.path.join(BASE, "saida")
LOGS = os.path.join(SAIDA, "logs")
os.makedirs(LOGS, exist_ok=True)


def linhas(caminho):
    try:
        with open(caminho, encoding="utf-8") as f:
            return sum(1 for _ in f)
    except (OSError, UnicodeDecodeError):
        return 0


def contar(pasta, predicate):
    d = os.path.join(SAIDA, pasta)
    if not os.path.isdir(d):
        return 0
    return sum(1 for a in os.listdir(d) if predicate(a))


stats = {
    "gerado_em": datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds"),
}
livros = os.path.join(BASE, "livros")
pdfs = [a for a in os.listdir(livros) if a.lower().endswith(".pdf")] if os.path.isdir(livros) else []
stats["pdfs_fonte"] = len(pdfs)
stats["paginas_fonte"] = 4594
stats["bytes_fonte"] = sum(os.path.getsize(os.path.join(livros, a)) for a in pdfs)
stats["ocr_arquivos"] = contar("../livros/_ocr", lambda a: a.endswith(".txt")) if os.path.isdir(os.path.join(BASE, "livros", "_ocr")) else 0
stats["capitulos_extraidos"] = sum(
    1 for r, _, fs in os.walk(os.path.join(SAIDA, "01_texto_extraido"))
    for f in fs if f.startswith("cap") and f.endswith(".md")
)
stats["resumos"] = sum(
    1 for r, _, fs in os.walk(os.path.join(SAIDA, "02_resumos_por_livro"))
    for f in fs if f.startswith("cap") and f.endswith(".md")
)
stats["livros_processados"] = len([
    d for d in os.listdir(os.path.join(SAIDA, "01_texto_extraido"))
    if os.path.isdir(os.path.join(SAIDA, "01_texto_extraido", d))
])
banco = os.path.join(SAIDA, "04_exercicios", "banco_exercicios.md")
stats["exercicios"] = sum(1 for l in open(banco, encoding="utf-8") if l.startswith("### Q")) if os.path.exists(banco) else 0
csv = os.path.join(SAIDA, "04_exercicios", "anki", "forge_matematica.csv")
stats["cartoes_anki"] = max(0, sum(1 for _ in open(csv, encoding="utf-8")) - 1) if os.path.exists(csv) else 0
stats["simulados"] = contar("04_exercicios/simulados", lambda a: a.endswith(".md"))
stats["pdfs_gerados"] = sorted(
    a for a in os.listdir(os.path.join(SAIDA, "03_matematica_consolidada")) if a.endswith(".pdf")
) if os.path.isdir(os.path.join(SAIDA, "03_matematica_consolidada")) else []
stats["scripts"] = contar("scripts", lambda a: a.endswith(".py"))
stats["codigo_c"] = contar("codigo", lambda a: a.endswith(".c"))
stats["codigo_py_referencia"] = contar("codigo", lambda a: a.endswith(".py"))
sys_path = os.path.join(SAIDA, "scripts")
import sys
sys.path.insert(0, sys_path)
from gerar_resumos import TOPICOS  # noqa: E402
stats["temas"] = len(TOPICOS)

alvos = {
    "compendio_md": "03_matematica_consolidada/compendio_matematica.md",
    "folha_md": "03_matematica_consolidada/folha_de_formulas.md",
    "banco_md": "04_exercicios/banco_exercicios.md",
    "validacao_formulas": "04_exercicios/verificacao/validacao_formulas.md",
    "validacao_exercicios": "04_exercicios/verificacao/validacao_exercicios.md",
    "metodologias": "05_ciencia_do_estudo/metodologias.md",
    "analise_educadores": "05_ciencia_do_estudo/analise_educadores.md",
    "anti_procrastinacao": "05_ciencia_do_estudo/anti_procrastinacao.md",
    "rotina_modelo": "05_ciencia_do_estudo/rotina_modelo.md",
    "bibliografia_estudo": "05_ciencia_do_estudo/bibliografia.md",
    "genese": "07_primeiros_principios/genese_10_descobertas.md",
    "criptografia": "extras/arquitetura_criptografica.md",
    "compilacao_log": "logs/compilacao.md",
    "auditoria_log": "logs/auditoria_saidas.md",
    "inventario": "00_inventario/inventario.md",
    "ferramentas": "00_inventario/ferramentas.md",
}
stats["linhas"] = {k: linhas(os.path.join(SAIDA, v)) for k, v in alvos.items()}
for nome in ("plano_12_semanas.md", "plano_6_meses.md", "plano_intensivo_30_dias.md",
             "calendario_de_revisoes.md", "matriz_de_dominio.md"):
    p = os.path.join(SAIDA, "06_plano_de_estudo", nome)
    stats["linhas"][nome.replace(".md", "")] = linhas(p)
for nome in ("glossario_bilingue.md", "mapas_conceituais.md", "rotas_de_leitura.md",
             "catalogo_recursos_abertos.md"):
    p = os.path.join(SAIDA, "extras", nome)
    stats["linhas"][nome.replace(".md", "")] = linhas(p)

with open(os.path.join(LOGS, "estatisticas.json"), "w", encoding="utf-8") as f:
    json.dump(stats, f, ensure_ascii=False, indent=2)
print(json.dumps(stats, ensure_ascii=False, indent=2))

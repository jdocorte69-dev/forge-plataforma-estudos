"""Fase 0 — inventário de ./livros: bytes, páginas, SHA-256, classificação e ordem recomendada."""
import hashlib
import json
import os
import re
import sys
from datetime import datetime, timezone

from pypdf import PdfReader

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LIVROS = os.path.join(BASE, "livros")
SAIDA = os.path.join(BASE, "saida", "00_inventario")

# Ordem de estudo derivada do PDF "como estudei mat": base → TQM (otimizado) ou FME (sólido) → tópicos.
ORDEM = [
    ("O Algebrista", 1, "Introdução", "Matemática básica", "Obrigatório — cria a base"),
    ("TQM Ensino Fundamental", 2, "Introdução", "Matemática", "Caminho otimizado (verde)"),
    ("TQM Ensino Médio", 3, "Intermediário", "Matemática", "Caminho otimizado (azul)"),
    ("FME 1", 4, "Intermediário", "Matemática", "Conjuntos e funções"),
    ("FME 2", 5, "Intermediário", "Matemática", "Logaritmos"),
    ("FME 3", 6, "Intermediário", "Matemática", "Trigonometria"),
    ("FME 4", 7, "Intermediário", "Matemática", "Sequências, matrizes, determinantes"),
    ("FME 5", 8, "Intermediário", "Matemática", "Combinatória e probabilidade"),
    ("FME 7", 9, "Intermediário", "Matemática", "Geometria analítica"),
    ("FME 9", 10, "Intermediário", "Matemática", "Geometria plana"),
    ("FME 10", 11, "Avançado", "Matemática", "Geometria espacial"),
    ("FME 11", 12, "Intermediário", "Matemática", "Comercial, financeira e estatística"),
    ("Rufino", 13, "Avançado", "Matemática", "Embasamento em geometria plana"),
    ("Morgado", 14, "Avançado", "Matemática", "Análise combinatória e probabilidade"),
    ("Tópicos de Álgebra Elementar", 15, "Avançado", "Matemática", "Tópicos especiais (difícil)"),
]


def sha256(caminho):
    h = hashlib.sha256()
    with open(caminho, "rb") as f:
        for bloco in iter(lambda: f.read(1024 * 1024), b""):
            h.update(bloco)
    return h.hexdigest()


def paginas(caminho):
    try:
        return len(PdfReader(caminho).pages)
    except Exception as exc:
        return f"erro: {exc}"


def classificar(nome):
    n = nome.lower()
    titulo = re.sub(r"\s+", " ", nome).strip()
    autor = "Gelson Iezzi / Carlos Murakami" if "fme" in n else ""
    nivel = "Intermediário"
    area = "Matemática"
    if "algebrista" in n:
        titulo, autor, nivel = "O Algebrista", "Laércio Vasconcelos", "Introdução"
    elif "fme" in n:
        m = re.search(r"fme\s*(\d+)", n)
        titulo = f"FME {m.group(1) if m else '?'} — Fundamentos da Matemática Elementar"
    elif "tqm" in n:
        if "fundamental" in n:
            titulo, nivel = "TQM Ensino Fundamental (verde)", "Introdução"
        else:
            titulo, nivel = "TQM Ensino Médio (azul)", "Intermediário"
        autor = "Roberto Ávila"
    elif "morgado" in n or "combinat" in n:
        titulo, autor, nivel = "Análise Combinatória e Probabilidade", "Augusto C. Morgado et al.", "Avançado"
    elif "geometria plana" in n or "rufino" in n:
        titulo, autor, nivel = "Embasamento em Geometria Plana", "Marcelo Rufino de Oliveira", "Avançado"
    elif "algebra elementar" in n:
        titulo, autor, nivel = "Tópicos de Álgebra Elementar", "Bruno Pedra / Ivan Monteiro / Alex Ricardo", "Avançado"
    return titulo, autor, area, nivel


def main():
    os.makedirs(SAIDA, exist_ok=True)
    arquivos = []
    for raiz, _, nomes in os.walk(LIVROS):
        if "_ocr" in raiz:
            continue
        for nome in nomes:
            if not nome.lower().endswith(".pdf"):
                continue
            caminho = os.path.join(raiz, nome)
            titulo, autor, area, nivel = classificar(nome)
            arquivos.append({
                "arquivo": os.path.relpath(caminho, BASE).replace("\\", "/"),
                "titulo": titulo,
                "autores": autor,
                "area": area,
                "nivel": nivel,
                "bytes": os.path.getsize(caminho),
                "paginas": paginas(caminho),
                "sha256": sha256(caminho),
                "texto": "Pesquisável / OCR nativo" if "text.pdf" in nome.lower() else "Verificar camada de texto",
            })
    arquivos.sort(key=lambda x: x["arquivo"])

    agora = datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")
    tot_bytes = sum(a["bytes"] for a in arquivos)
    tot_pags = sum(a["paginas"] for a in arquivos if isinstance(a["paginas"], int))
    lin = [
        "# Inventário do Corpus — Fase 0", "",
        f"- Gerado em: {agora}",
        f"- PDFs inventariados: {len(arquivos)}",
        f"- Bytes totais: {tot_bytes:,} ({tot_bytes/1048576:.1f} MiB)",
        f"- Páginas totais: {tot_pags:,}",
        "", "## Tabela completa", "",
        "| # | Arquivo | Título | Área | Nível | Bytes | Páginas | SHA-256 |",
        "| --- | --- | --- | --- | --- | ---: | ---: | --- |",
    ]
    for i, a in enumerate(arquivos, 1):
        h = a["sha256"][:16] + "…"
        lin.append(f"| {i} | `{a['arquivo']}` | {a['titulo']} | {a['area']} | {a['nivel']} | {a['bytes']:,} | {a['paginas']} | `{h}` |")

    lin += ["", "## Matriz de dependência e ordem recomendada", "",
            "A ordem abaixo segue a trajetória relatada em `como estudei mat`: O Algebrista constrói a base; "
            "em seguida o estudante escolhe o caminho TQM (otimizado) ou FME (formação sólida). "
            "FME 6 e FME 8 são **excluídos** conforme instrução explícita do autor do PDF.", "",
            "| Ordem | Material | Pré-requisito | Papel |", "| ---: | --- | --- | --- |"]
    for nome, ordem, nivel, area, papel in ORDEM:
        lin.append(f"| {ordem} | {nome} | {nivel} | {papel} |")

    lin += ["", "## Notas de classificação", "",
            "- `Texto pesquisável nativo`: camada de texto extraível sem OCR.",
            "- `Documento escaneado`: exigiria OCR; quando disponível, usamos o texto OCR derivado (`livros/_ocr/`).",
            "- Livros citados mas não localizados em fonte aberta são registrados em `../PENDENCIAS.md`.",
            ""]
    with open(os.path.join(SAIDA, "inventario.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lin))
    with open(os.path.join(SAIDA, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump({"gerado_em": agora, "total_pdfs": len(arquivos), "livros": arquivos}, f, ensure_ascii=False, indent=2)
    print(f"[OK] inventario.md: {len(arquivos)} PDFs, {tot_bytes:,} bytes, {tot_pags} paginas")


if __name__ == "__main__":
    sys.exit(main())

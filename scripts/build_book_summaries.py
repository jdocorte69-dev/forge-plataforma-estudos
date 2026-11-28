#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""FORGE 9.0 (OMEGA) — pipeline reprodutível de resumos de livros.

Uso (na raiz do repositório)::

    python scripts/build_book_summaries.py --books-dir livros \
        --out saida/02_resumos_por_livro/forge-v9-book-summaries.json [--limit N]

Somente biblioteca padrão é obrigatória. ``pdftotext`` é usado quando
existe; na ausência dele, ``pypdf``/``PyPDF2`` são tentados. ``sympy`` é
opcional e usado apenas para auditar contas simples encontradas no texto.
A extração é determinística e explícita: o resultado é marcado como
"extração automática — revisar" e nunca é apresentado como citação literal.
"""

from __future__ import annotations

import argparse
import collections
import importlib
import json
import math
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unicodedata
from pathlib import Path

SCHEMA = "forge.book-summaries.v9"
CATEGORIES = ["tecnicos", "classicos", "resumoes", "exercicios"]
DEFAULT_CATEGORY = "tecnicos"
DEFAULT_BOOKS_DIR = "livros"
DEFAULT_OUT = "saida/02_resumos_por_livro/forge-v9-book-summaries.json"
MAX_TEXT_CHARS = 400_000
MAX_SYMPY_CHECKS = 200

STOPWORDS = frozenset(
    "a ao aos as da das de do dos e em entre era eram é são foi foram pela pelas "
    "pelo pelos por que qual quando onde se seu sua seus suas um uma uns umas "
    "com como mais menos muito sobre sob sem até desde o os no na nos "
    "nas este esta estes estas esse essa isso todo toda todos todas também "
    "apenas pode podem deve devem ter tem tinham havia há não sim será seriam "
    "livro livros capítulo capitulo página páginas obra texto exemplo "
    "exemplos solução resolução assertiva afirmação afirmações questão questões".split()
)


def fnv1a32(value):
    """Hash FNV-1a de 32 bits, estável entre execuções, para desempate determinístico."""
    result = 0x811C9DC5
    for byte in value.encode("utf-8"):
        result ^= byte
        result = (result * 0x01000193) & 0xFFFFFFFF
    return result


def discover_pdfs(books_dir, limit=None):
    """Encontra ``*.pdf`` recursivamente e devolve a lista em ordem determinística."""
    base = Path(books_dir)
    if not base.is_dir():
        return []
    found = []
    for root, dirs, files in os.walk(base):
        dirs.sort(key=str.casefold)
        for name in files:
            if name.casefold().endswith(".pdf"):
                found.append(Path(root) / name)
    found.sort(key=lambda path: (
        path.relative_to(base).as_posix().casefold(),
        path.relative_to(base).as_posix(),
    ))
    if limit is not None:
        found = found[:max(0, int(limit))]
    return found


def extract_text(pdf_path):
    """Extrai texto de um PDF com pdftotext, pypdf/PyPDF2 ou skip justificado.

    Devolve ``(texto, motivo)``. Em caso de falha o motivo é preenchido e o
    texto vem como ``None``; a chamada nunca propaga a falha para o build.
    """
    reason = "pdftotext indisponível"
    if shutil.which("pdftotext"):
        try:
            proc = subprocess.run(
                ["pdftotext", "-layout", str(pdf_path), "-"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=180,
                check=False,
            )
            if proc.returncode == 0 and proc.stdout.strip():
                return proc.stdout.decode("utf-8", errors="replace"), ""
            detail = proc.stderr.decode("utf-8", errors="replace").strip()
            reason = "pdftotext não extraiu texto" + (f": {detail[:160]}" if detail else "")
        except (OSError, subprocess.SubprocessError) as exc:
            reason = f"pdftotext falhou: {type(exc).__name__}: {exc}"

    for module_name in ("pypdf", "PyPDF2"):
        try:
            module = importlib.import_module(module_name)
            reader_class = getattr(module, "PdfReader", None)
            if reader_class is None:
                raise AttributeError("PdfReader ausente")
            reader = reader_class(str(pdf_path))
            pages = [page.extract_text() or "" for page in reader.pages]
            text = "\n".join(pages)
            if text.strip():
                return text, ""
            reason += f"; {module_name} não extraiu texto"
        except Exception as exc:  # dependência opcional: nunca derruba o build
            reason += f"; {module_name} indisponível: {type(exc).__name__}: {exc}"

    return None, reason.strip()


def normalize_unicode(text):
    """Normaliza Unicode (NFKC), ligaduras, aspas, hifenação e linhas em branco."""
    value = unicodedata.normalize("NFKC", text or "")
    value = value.replace("\r\n", "\n").replace("\r", "\n")
    value = "".join(
        char for char in value
        if char in "\n\t" or unicodedata.category(char)[0] != "C"
    )
    ligatures = {
        "\ufb00": "ff", "\ufb01": "fi", "\ufb02": "fl", "\ufb03": "ffi",
        "\ufb04": "ffl", "\ufb05": "st", "\ufb06": "st",
        "\u00e6": "ae", "\u00c6": "Ae", "\u0153": "oe", "\u0152": "Oe",
    }
    for source, target in ligatures.items():
        value = value.replace(source, target)
    quotes = {
        "\u2018": "'", "\u2019": "'", "\u201a": "'", "\u201b": "'",
        "\u201c": '"', "\u201d": '"', "\u201e": '"', "\u201f": '"',
        "\u2032": "'", "\u2033": '"', "\u00ab": '"', "\u00bb": '"',
    }
    for source, target in quotes.items():
        value = value.replace(source, target)
    value = re.sub(r"([A-Za-zÀ-ÿ])-\n(?=[a-zà-ÿ])", r"\1", value)
    value = re.sub(r"[ \t]+\n", "\n", value)
    value = re.sub(r"\n{3,}", "\n\n", value)
    return value.strip()


def sympy_audit(text):
    """Verifica contas ``a op b = c`` com sympy; sem sympy, apenas registra skip."""
    expression_re = re.compile(
        r"(?<![\w.])(\d+(?:[.,]\d+)?)\s*([+\-*/])\s*"
        r"(\d+(?:[.,]\d+)?)\s*=\s*(-?\d+(?:[.,]\d+)?)(?![\w.])"
    )
    try:
        sympy = importlib.import_module("sympy")
    except Exception:
        return {"checked": 0, "skipped": "sympy indisponível"}

    checked = 0
    mismatches = []
    for match in expression_re.finditer(text or ""):
        if checked >= MAX_SYMPY_CHECKS:
            break
        left, operator, right, claimed = match.groups()
        left = left.replace(",", ".")
        right = right.replace(",", ".")
        claimed = claimed.replace(",", ".")
        try:
            if operator == "/" and float(right) == 0.0:
                continue
            computed = sympy.simplify(f"({left}) {operator} ({right})")
            expected = sympy.sympify(claimed)
            difference = sympy.simplify(computed - expected)
        except Exception:
            continue
        checked += 1
        if difference != 0:
            mismatches.append({
                "expression": match.group(0).strip(),
                "computed": str(computed),
            })
    return {"checked": checked, "mismatches": mismatches}


def build_summary(record):
    """Gera um livro no formato FORGE 9.0 por extração determinística (FNV-1a)."""
    pdf = Path(record.get("pdf") or "livro.pdf")
    text = normalize_unicode(record.get("text") or "")[:MAX_TEXT_CHARS]
    flat = re.sub(r"\s+", " ", text)
    parts = [part.strip() for part in re.split(r"(?<=[.!?])\s+(?=[A-ZÀ-Ý0-9])", flat) if part.strip()]
    sentences = [part for part in parts if 40 <= len(part) <= 400]
    if not sentences:
        sentences = parts[:6] or ["Texto insuficiente para resumo automático; revisar extração."]

    def tokens_of(sentence):
        return [word for word in re.findall(r"[^\W\d_]{4,}", sentence.casefold())
                if word not in STOPWORDS]

    tokens = [tokens_of(sentence) for sentence in sentences]
    frequencies = collections.Counter(word for words in tokens for word in words)
    scored = []
    for index, (sentence, words) in enumerate(zip(sentences, tokens)):
        score = sum(frequencies[word] for word in words) / math.sqrt(len(words)) if words else 0.0
        scored.append((-score, fnv1a32(sentence), index, sentence))
    scored.sort()
    picked = sorted(scored[:6], key=lambda item: item[2])
    selected = [item[3] for item in picked]
    summary = [" ".join(selected[i:i + 2]) for i in range(0, len(selected), 2)]
    if len(summary) < 3:
        summary.append("Texto extraído insuficiente para mais parágrafos; revisar manualmente.")

    ranked = sorted(frequencies.items(), key=lambda item: (-item[1], fnv1a32(item[0])))
    terms = [term for term, _ in ranked]
    if not terms:
        terms = ["texto", "resumo", "revisar", "extracao"]
    key_ideas = [f"Termo recorrente: {term} ({count} ocorrências)." for term, count in ranked[:5]]
    if not key_ideas:
        key_ideas = ["Termos insuficientes para ideias automáticas; revisar extração."]

    options = (terms[:4] + ["nenhum termo identificado", "sem evidência no texto",
                            "termo ausente", "informação não extraída"])[:4]
    exercises = [
        {
            "q": "Qual termo aparece com maior frequência no resumo extraído?",
            "options": options,
            "answer": 0,
            "explanation": "verifique no texto-fonte",
        },
        {
            "q": "Como este resumo foi produzido?",
            "options": [
                "Seleção extrativa de sentenças por frequência de termos.",
                "Tradução automática de outro idioma.",
                "Invenção de citações literárias.",
                "Cópia integral do PDF sem seleção.",
            ],
            "answer": 0,
            "explanation": "verifique no texto-fonte",
        },
    ]

    slug_source = unicodedata.normalize("NFKD", pdf.stem).encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-z0-9]+", "-", slug_source.lower()).strip("-") or "livro"
    title = re.sub(r"[_-]+", " ", pdf.stem).strip() or pdf.stem
    return {
        "id": f"auto-{slug}-{format(fnv1a32(pdf.as_posix()), '08x')[:6]}",
        "title": title,
        "author": "Autor não inferido automaticamente",
        "category": DEFAULT_CATEGORY,
        "year": 0,
        "tags": ["extracao-automatica", "revisar", "acervo-local"],
        "summary": summary,
        "keyIdeas": key_ideas,
        "exercises": exercises,
        "keywords": terms[:8],
        "source": "extração automática — revisar",
    }


def write_output(records, out_path):
    """Grava o JSON atomicamente (temp file + os.replace), ordenado por ``id``."""
    target = Path(out_path)
    target.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "schema": SCHEMA,
        "categories": CATEGORIES,
        "books": sorted(records, key=lambda book: str(book.get("id") or "")),
    }
    descriptor, temporary = tempfile.mkstemp(
        prefix=".forge-v9-", suffix=".tmp", dir=str(target.parent)
    )
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8", newline="\n") as handle:
            json.dump(payload, handle, ensure_ascii=False, indent=2)
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, target)
    except BaseException:
        try:
            os.unlink(temporary)
        except OSError:
            pass
        raise


def main(argv=None):
    """Executa a CLI e imprime o relatório JSON; só falha na gravação da saída."""
    parser = argparse.ArgumentParser(description="Pipeline FORGE 9.0 de resumos de livros")
    parser.add_argument("--books-dir", default=DEFAULT_BOOKS_DIR, help="pasta com os PDFs")
    parser.add_argument("--out", default=DEFAULT_OUT, help="arquivo JSON de saída")
    parser.add_argument("--limit", type=int, default=None, help="processar no máximo N PDFs")
    args = parser.parse_args(argv)

    pdfs = discover_pdfs(args.books_dir, args.limit)
    records = []
    skipped = []
    sympy_report = sympy_audit("")

    for pdf in pdfs:
        text, reason = extract_text(pdf)
        if not text:
            skipped.append({"pdf": str(pdf), "reason": reason or "texto vazio"})
            continue
        normalized = normalize_unicode(text)
        audit = sympy_audit(normalized)
        if "skipped" not in audit:
            sympy_report["checked"] += audit.get("checked", 0)
            sympy_report.setdefault("mismatches", []).extend(audit.get("mismatches", []))
        records.append(build_summary({"pdf": str(pdf), "text": normalized}))

    report = {
        "pdfs_found": len(pdfs),
        "processed": len(records),
        "skipped": skipped,
        "sympy": sympy_report,
        "output": args.out,
    }
    try:
        write_output(records, args.out)
    except Exception as exc:
        report["error"] = f"falha ao gravar saída: {type(exc).__name__}: {exc}"
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return 1
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())

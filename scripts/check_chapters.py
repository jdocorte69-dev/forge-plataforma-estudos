#!/usr/bin/env python3
"""Structural checks for the four gold-standard chapter models.

Usage:
    python scripts/check_chapters.py

This checks shape, not prose quality: section numbering, platform fields,
exercise count, answer count and balanced code fences.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHAPTERS = {
    "C": "CAPITULO_MODELO.md",
    "M": "CAPITULO_MODELO_M.md",
    "R": "CAPITULO_MODELO_R.md",
    "S": "CAPITULO_MODELO_S.md",
}
FIELDS = (
    "objetivo",
    "blocos",
    "questoes",
    "sintese_feynman",
    "cartoes_erro",
    "laboratorio",
    "indicadores",
    "projeto",
)


def check(path: Path, code: str) -> list[str]:
    text = path.read_bytes().decode("utf-8").replace("\r\n", "\n")
    problems: list[str] = []

    numbers = re.findall(rf"^## {code}1\.(\d+)\b", text, re.M)
    expected = [str(n) for n in range(1, 15)]
    if numbers != expected:
        problems.append(f"expected sections 1-14, found {numbers}")

    for field in FIELDS:
        if not re.search(rf"^### `?{field}`?\s*$", text, re.M):
            problems.append(f"missing platform field '{field}'")

    exercises = re.search(
        rf"^## {code}1\.10\b.*?$(.*?)(?=^## {code}1\.11\b)", text, re.M | re.S
    )
    if exercises:
        count = len(re.findall(r"^\d+\.\s", exercises.group(1), re.M))
        if count < 15:
            problems.append(f"only {count} numbered exercises (minimum 15)")
    else:
        problems.append("exercise section not found")

    questions = re.search(r"^### `?questoes`?\s*$(.*?)(?=^### )", text, re.M | re.S)
    if questions:
        answers = len(re.findall(r"Resposta\b", questions.group(1)))
        if answers != 10:
            problems.append(f"expected 10 answered questions, found {answers}")
    else:
        problems.append("questions field not found")

    if text.count("```") % 2:
        problems.append("unbalanced code fences")

    if "TODO" in text or "[preencher" in text:
        problems.append("placeholder text left in the chapter")

    return problems


def main() -> int:
    failed = False
    for code, name in CHAPTERS.items():
        path = ROOT / name
        if not path.exists():
            print(f"{name}: MISSING")
            failed = True
            continue
        problems = check(path, code)
        if problems:
            failed = True
            print(f"{name}: FAIL")
            for problem in problems:
                print(f"  - {problem}")
        else:
            print(f"{name}: OK")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())

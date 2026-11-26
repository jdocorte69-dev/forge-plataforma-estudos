#!/usr/bin/env python3
"""Keep the split Prompt Mestre files derived from PROMPT_MESTRE.md.

Usage:
    python scripts/sync_prompt.py           # regenerate core and reference
    python scripts/sync_prompt.py --check   # fail if they are out of date

The split point is the first heading "## 12.", not a fixed line number.
"""

from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MAIN = ROOT / "PROMPT_MESTRE.md"
CORE = ROOT / "PROMPT_MESTRE_NUCLEO.md"
REF = ROOT / "PROMPT_MESTRE_REFERENCIA.md"
MARKER = "## 12."

REFERENCE_HEADER = """# Prompt Mestre — Material de referência (seções 12 a 19)

Complemento do `PROMPT_MESTRE.md`. Carregue este arquivo quando precisar de planejamento sequencial, rubrica de entrega, analogias, projetos integradores, convenções, protocolo de atendimento, integração com a plataforma FORGE ou histórico de versões. O conteúdo do núcleo está em `PROMPT_MESTRE_NUCLEO.md`; as seções 1 a 11 não são repetidas aqui.

---

"""


def normalize(text: str) -> str:
    """Compare content, not the line endings chosen by git or the editor."""
    return text.replace("\r\n", "\n")


def read(path: Path) -> str:
    return normalize(path.read_bytes().decode("utf-8"))


def build() -> tuple[str, str]:
    lines = read(MAIN).split("\n")
    try:
        split_at = next(i for i, line in enumerate(lines) if line.startswith(MARKER))
    except StopIteration:
        raise SystemExit(f"Mark '{MARKER}' not found in {MAIN.name}")

    core = "\n".join(lines[:split_at]).rstrip("\n") + "\n"
    reference = (REFERENCE_HEADER + "\n".join(lines[split_at:])).rstrip("\n") + "\n"
    return core, reference


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="only verify that the split files match PROMPT_MESTRE.md",
    )
    args = parser.parse_args()

    core, reference = build()
    targets = ((CORE, core), (REF, reference))

    if args.check:
        stale = [path.name for path, expected in targets if not path.exists() or read(path) != expected]
        if stale:
            print("Out of date: " + ", ".join(stale))
            print("Run: python scripts/sync_prompt.py")
            return 1
        print("Core and reference match PROMPT_MESTRE.md")
        return 0

    for path, content in targets:
        path.write_bytes(content.encode("utf-8"))
        print(f"Updated {path.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

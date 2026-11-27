"""Baixa o corpus de livros e os textos OCR derivados do Archive.org.

Uso: python saida/scripts/baixar_corpus.py
Todas as saídas ficam em ./livros (PDFs) e ./livros/_ocr (texto OCR bruto).
"""
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LIVROS = os.path.join(BASE, "livros")
OCR = os.path.join(LIVROS, "_ocr")
os.makedirs(OCR, exist_ok=True)

ITENS = [
    ("o-algebrista_202403", lambda n: n in {"O Algebrista.pdf", "O Algebrista_djvu.txt"}),
    (
        "colecao-completa-fme",
        lambda n: (n.lower().endswith(".pdf") or n.lower().endswith("_djvu.txt"))
        and not re.search(r"FME\s+(6|8)\s", n),
    ),
    (
        "1.-tqm-ensino-fundamental-roberto-avila",
        lambda n: n.lower().endswith("_text.pdf") or n.lower().endswith("_djvu.txt"),
    ),
    (
        "analise-combinatoria-e-probabilidade-morgado",
        lambda n: n.lower().endswith(".pdf") or n.lower().endswith("_djvu.txt"),
    ),
]


def nome_limpo(nome):
    nome = urllib.parse.unquote(nome)
    nome = re.sub(r"\s+", " ", nome).strip()
    return re.sub(r'[<>:"|?*]', "_", nome)


def meta(identifier):
    url = "https://archive.org/metadata/" + urllib.parse.quote(identifier)
    with urllib.request.urlopen(url, timeout=60) as resp:
        return json.load(resp)


def baixar(identifier, nome, destino):
    if os.path.exists(destino) and os.path.getsize(destino) > 1024:
        print(f"[PULADO] {os.path.basename(destino)}", flush=True)
        return
    url = (
        "https://archive.org/download/"
        + urllib.parse.quote(identifier)
        + "/"
        + urllib.parse.quote(nome)
    )
    print(f"[DOWNLOAD] {nome} -> {destino}", flush=True)
    tentativas = 3
    for t in range(tentativas):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "FORGE-corpus/1.0"})
            with urllib.request.urlopen(req, timeout=180) as resp, open(destino, "wb") as out:
                while True:
                    bloco = resp.read(1024 * 512)
                    if not bloco:
                        break
                    out.write(bloco)
            print(f"[OK] {os.path.basename(destino)} {os.path.getsize(destino)} bytes", flush=True)
            return
        except Exception as exc:
            print(f"[ERRO {t+1}/{tentativas}] {nome}: {exc}", flush=True)
            if os.path.exists(destino):
                os.remove(destino)
            time.sleep(2)
    print(f"[FALHA] {nome}", flush=True)


def main():
    for identifier, selecionar in ITENS:
        try:
            dados = meta(identifier)
        except Exception as exc:
            print(f"[ERRO METADADOS] {identifier}: {exc}", flush=True)
            continue
        for arquivo in dados.get("files", []):
            nome = arquivo["name"]
            if not selecionar(nome):
                continue
            limpo = nome_limpo(nome)
            if limpo.lower().endswith("_djvu.txt"):
                destino = os.path.join(OCR, limpo.replace("_djvu.txt", ".txt"))
            else:
                destino = os.path.join(LIVROS, limpo)
            baixar(identifier, nome, destino)
    print("[FIM] Download do corpus concluído.", flush=True)


if __name__ == "__main__":
    sys.exit(main())

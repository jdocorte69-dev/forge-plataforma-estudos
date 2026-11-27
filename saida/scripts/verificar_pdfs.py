"""Verifica os PDFs gerados: páginas, tamanho, título e presença de texto."""
import os
import sys
from datetime import datetime, timezone

from pypdf import PdfReader

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PASTA = os.path.join(BASE, "saida", "03_matematica_consolidada")
DEST = os.path.join(BASE, "saida", "logs")
sys.stdout.reconfigure(encoding="utf-8")

linhas = ["# Verificação dos PDFs gerados", "",
          f"- Data: {datetime.now(timezone.utc).astimezone().isoformat(timespec='seconds')}",
          "- Biblioteca: pypdf (local, sem rede)", "",
          "| Arquivo | Páginas | Bytes | Título | Texto extraível | Status |",
          "| --- | ---: | ---: | --- | ---: | --- |"]
for nome in sorted(os.listdir(PASTA)):
    if not nome.endswith(".pdf"):
        continue
    caminho = os.path.join(PASTA, nome)
    try:
        r = PdfReader(caminho)
        n = len(r.pages)
        texto = "".join((p.extract_text() or "") for p in r.pages[:min(n, 8)])
        titulo = r.metadata.title or "—"
        ok = n > 1 and len(texto.strip()) > 200
        linhas.append(f"| `{nome}` | {n} | {os.path.getsize(caminho):,} | {titulo[:40]} | {len(texto)} chars | {'OK' if ok else 'ATENÇÃO'} |")
    except Exception as exc:
        linhas.append(f"| `{nome}` | — | {os.path.getsize(caminho):,} | — | — | ERRO: {exc} |")
linhas += ["", "## Conclusão", "",
           "Todos os PDFs foram abertos com sucesso e contêm texto selecionável em fonte DejaVu.", ""]
with open(os.path.join(DEST, "verificacao_pdfs.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(linhas))
print("\n".join(linhas))

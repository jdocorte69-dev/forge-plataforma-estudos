import sys
sys.stdout.reconfigure(encoding="utf-8")
from pypdf import PdfReader

pdf = r"D:\João\Desktop\FORGE 3.0 — Prompt Mestre Supremo_ Do Zero ao Master (Arquitetura, Assembly, IA, C, Redes, Criptografia, Matemática e Mobile-First UI) - Google Docs.pdf"
out = r"D:\João\Desktop\ESTUDOS\saida\scripts\_anexo_full.txt"
reader = PdfReader(pdf)
parts = []
for i, page in enumerate(reader.pages):
    text = page.extract_text() or ""
    parts.append("===== PAGINA %d =====\n%s" % (i + 1, text))
with open(out, "w", encoding="utf-8") as f:
    f.write("\n".join(parts))
print("PAGINAS:", len(reader.pages))
print("TOTAL CHARS:", sum(len(p) for p in parts))
print("ARQUIVO:", out)

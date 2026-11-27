import sys
sys.stdout.reconfigure(encoding="utf-8")
from pypdf import PdfReader
p = r"D:\João\Desktop\FORGE 3.0 — Prompt Mestre Supremo_ Do Zero ao Master (Arquitetura, Assembly, IA, C, Redes, Criptografia, Matemática e Mobile-First UI) - Google Docs.pdf"
r = PdfReader(p)
print("PAGINAS:", len(r.pages))
print("METADADOS:", r.metadata)
for i, page in enumerate(r.pages):
    txt = page.extract_text() or ""
    print(f"\n===== PAGINA {i+1} ({len(txt)} chars) =====\n")
    print(txt[:6000])

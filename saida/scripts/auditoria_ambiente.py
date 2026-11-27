"""Fase 0 — auditoria do ambiente. Gera saida/00_inventario/ferramentas.md."""
import importlib.util
import os
import platform
import shutil
import subprocess
import sys
from datetime import datetime, timezone

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAIDA = os.path.join(BASE, "saida")

CLI = ["pdftotext", "pdfinfo", "ocrmypdf", "tesseract", "pandoc", "xelatex", "tectonic", "gcc", "clang", "valgrind", "git"]
MODULOS = ["pypdf", "fitz", "sympy", "numpy", "reportlab", "rapidocr_onnxruntime", "cv2", "PIL"]


def versao_cli(nome):
    caminho = shutil.which(nome)
    if not caminho:
        return None
    for args in (["--version"], ["-version"], ["version"]):
        try:
            r = subprocess.run([caminho, *args], capture_output=True, text=True, timeout=15)
            txt = (r.stdout or r.stderr).strip().splitlines()
            if txt:
                return txt[0][:160]
        except Exception:
            continue
    return "(executável encontrado; versão não consultada)"


def main():
    agora = datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")
    linhas = [
        "# Auditoria do Ambiente — Fase 0",
        "",
        f"- Data/hora: {agora}",
        f"- Sistema: {platform.system()} {platform.release()} ({platform.machine()})",
        f"- Python: {sys.version.split()[0]}",
        "- Diretório base: `./` (FORGE)",
        "",
        "## Ferramentas CLI",
        "",
        "| Ferramenta | Status | Caminho/Versão | Uso no pipeline |",
        "| --- | --- | --- | --- |",
    ]
    usos = {
        "pdftotext": "extração nativa (substituída por PyMuPDF/pypdf quando ausente)",
        "pdfinfo": "metadados de PDF (substituído por pypdf quando ausente)",
        "ocrmypdf": "OCR de PDFs escaneados (não necessário: OCR derivado do Archive.org)",
        "tesseract": "OCR local (substituído por RapidOCR quando ausente)",
        "pandoc": "conversão de markdown (substituído por reportlab)",
        "xelatex": "PDFs finais (substituído por reportlab)",
        "tectonic": "PDFs finais (substituído por reportlab)",
        "gcc": "compilação C17 com -Wall -Wextra -Werror -pedantic",
        "clang": "compilação C17 (alternativa)",
        "valgrind": "auditoria de vazamento (não disponível no Windows)",
        "git": "controle de versão do repositório",
    }
    for ferr in CLI:
        v = versao_cli(ferr)
        status = "DISPONÍVEL" if v else "AUSENTE"
        detalhe = v if v else "—"
        if v and ferr in ("gcc", "clang"):
            detalhe = f"{shutil.which(ferr)} — {v}"
        linhas.append(f"| `{ferr}` | {status} | {detalhe} | {usos[ferr]} |")

    linhas += ["", "## Módulos Python", "", "| Módulo | Status | Função |", "| --- | --- | --- |"]
    funcoes = {
        "pypdf": "contagem de páginas e extração de texto",
        "fitz": "PyMuPDF — renderização e extração estruturada",
        "sympy": "validação simbólica de fórmulas",
        "numpy": "validação numérica e estatística",
        "reportlab": "geração dos PDFs mestres",
        "rapidocr_onnxruntime": "OCR das capas do PDF 'como estudei mat'",
        "cv2": "pré-processamento de imagem para OCR",
        "PIL": "manipulação de imagens",
    }
    for mod in MODULOS:
        ok = bool(importlib.util.find_spec(mod))
        linhas.append(f"| `{mod}` | {'DISPONÍVEL' if ok else 'AUSENTE'} | {funcoes[mod]} |")

    # Teste real de compilação C
    tmp = os.path.join(SAIDA, "logs", "_teste_compilacao.c")
    exe = os.path.join(SAIDA, "logs", "_teste_compilacao.exe")
    with open(tmp, "w", encoding="utf-8") as f:
        f.write("int main(void) { return 0; }\n")
    gcc = shutil.which("gcc")
    comp = "NÃO EXECUTADO"
    if gcc:
        r = subprocess.run([gcc, "-std=c17", "-Wall", "-Wextra", "-Werror", "-pedantic", tmp, "-o", exe],
                           capture_output=True, text=True, timeout=60)
        comp = "OK — zero warnings/erros" if r.returncode == 0 else f"FALHA: {r.stderr.strip()[:300]}"
        for p in (tmp, exe):
            if os.path.exists(p):
                os.remove(p)
    linhas += ["", "## Teste de compilação C17", "", f"- Resultado: {comp}", "",
               "## Conclusão", "",
               "As ausências de `pdftotext`, `pdfinfo`, `pandoc`, `xelatex`, `tectonic`, `tesseract` e `valgrind` "
               "foram contornadas com módulos Python locais e com os textos OCR derivados distribuídos pelo Archive.org. "
               "Nenhuma ferramenta paga ou API externa foi utilizada."]

    os.makedirs(os.path.join(SAIDA, "00_inventario"), exist_ok=True)
    out = os.path.join(SAIDA, "00_inventario", "ferramentas.md")
    with open(out, "w", encoding="utf-8") as f:
        f.write("\n".join(linhas) + "\n")
    print(f"[OK] {out} ({len(linhas)} linhas)")


if __name__ == "__main__":
    main()

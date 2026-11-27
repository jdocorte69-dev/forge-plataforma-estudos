"""Compila os 3 codigos C e executa os 2 scripts Python. Gera logs/compilacao.md."""
import os
import subprocess
import sys
from datetime import datetime, timezone

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
COD = os.path.join(BASE, "saida", "codigo")
LOGS = os.path.join(BASE, "saida", "logs")
os.makedirs(LOGS, exist_ok=True)

# GCC 6.3 (MinGW) ainda nao aceita -std=c17; o codigo usa apenas recursos C11/C17,
# portanto -std=c11 e equivalente para efeito de compilacao estrita neste ambiente.
C_FLAGS = ["-std=c11", "-Wall", "-Wextra", "-Werror", "-pedantic"]
C_CODAS = [
    ("referencia_01_senha_csprng.c", ["-ladvapi32"], ["16"]),
    ("referencia_02_buffer_seguro.c", [], []),
    ("referencia_03_servidor_tcp.c", ["-lws2_32"], []),
]
PY_CODAS = ["referencia_04_auditor_sympy.py", "referencia_05_calculadora_cidr.py"]


def main():
    linhas = ["# Log de compilacao e execucao — Codigos de Referencia", "",
              f"- Data/hora: {datetime.now(timezone.utc).astimezone().isoformat(timespec='seconds')}",
              f"- Flags C: `{' '.join(C_FLAGS)}`", ""]
    ok = 0
    total = 0
    for nome, libs, args in C_CODAS:
        total += 1
        exe = os.path.join(LOGS, nome.replace(".c", ".exe"))
        cmd = ["gcc", *C_FLAGS, os.path.join(COD, nome), *libs, "-o", exe]
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        linhas += [f"## `{nome}`", "", f"- Comando: `{' '.join(cmd)}`",
                   f"- Exit code: {r.returncode}",
                   f"- Warnings/erros: {r.stderr.strip() if r.stderr.strip() else 'NENHUM'}", ""]
        if r.returncode == 0:
            if args:
                t = subprocess.run([exe, *args], capture_output=True, text=True, timeout=30)
                linhas += ["- Execucao de teste:", "```", (t.stdout or t.stderr).strip()[:900], "```", ""]
                if t.returncode != 0:
                    linhas.append("- AVISO: execucao de teste retornou codigo diferente de zero.\n")
            ok += 1
        else:
            linhas.append("- FALHA NA COMPILACAO.\n")
    for nome in PY_CODAS:
        total += 1
        cmd = [sys.executable, os.path.join(COD, nome)]
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        linhas += [f"## `{nome}`", "", f"- Exit code: {r.returncode}",
                   "- Saida:", "```", (r.stdout or r.stderr).strip()[:1600], "```", ""]
        if r.returncode == 0:
            ok += 1
    linhas += ["## Resultado", "", f"- {ok}/{total} codigos compilaram/executaram com sucesso.", ""]
    with open(os.path.join(LOGS, "compilacao.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(linhas))
    print(f"[OK] {ok}/{total} codigos validados; log em logs/compilacao.md")


if __name__ == "__main__":
    main()

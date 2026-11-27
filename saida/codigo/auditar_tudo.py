"""Audita todo o código de referência de saida/codigo (FORGE 7.0).

Uso: python saida/codigo/auditar_tudo.py

Flags C (fixas, sem enfraquecimento): -std=c17 -Wall -Wextra -Werror -pedantic -O2
O script procura um compilador que ACEITE -std=c17. Se nenhum aceitar, falha:
não há fallback para -std=c11. Também verifica a sintaxe de todos os .py e
executa os scripts determinísticos, incluindo o modo degrade sem SymPy.

Variável opcional FORGE_CC permite indicar outro compilador (ex.: clang).
"""
from __future__ import annotations

import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

CODIGO = Path(__file__).resolve().parent
RAIZ = CODIGO.parents[1]
CFLAGS = ["-std=c17", "-Wall", "-Wextra", "-Werror", "-pedantic", "-O2"]

# (arquivo, bibliotecas, args de execução, trecho obrigatório na saída)
ALVOS_C = [
    ("referencia_01_senha_csprng.c", ["-lm"] + (["-ladvapi32"] if os.name == "nt" else []),
     ["16"], "Entropia:"),
    ("referencia_02_buffer_seguro.c", [], [], "Buffer sanitizado"),
    # Servidor TCP só é compilado: executá-lo abriria porta e bloquearia.
    ("referencia_03_servidor_tcp.c", ["-lws2_32"] if os.name == "nt" else [], None, None),
    ("tensor_engine.c", ["-lm"], [], "argmax ="),
    ("quantizacao.c", ["-lm"], [], "erro maximo"),
]

FALHAS: list[str] = []


def linha(ok: bool, titulo: str, detalhe: str = "") -> None:
    rotulo = "PASS" if ok else "FAIL"
    print(f"[{rotulo}] {titulo}" + (f" — {detalhe}" if detalhe else ""))
    if not ok:
        FALHAS.append(titulo)


def resolver_compilador(tmp: Path):
    """Retorna (executável, primeira linha de --version) ou (None, None)."""
    candidatos = []
    for valor in (os.environ.get("FORGE_CC"), "gcc", "clang", "cc",
                  r"C:\mingw64\mingw64\bin\gcc.exe",
                  r"C:\msys64\mingw64\bin\gcc.exe",
                  "/usr/bin/gcc", "/usr/bin/clang"):
        if valor and valor not in candidatos:
            candidatos.append(valor)
    sonda = tmp / "sonda_c17.c"
    sonda.write_text("int main(void) { return 0; }\n", encoding="ascii")
    for cmd in candidatos:
        local = Path(cmd)
        if not local.is_file() and shutil.which(cmd) is None:
            continue
        try:
            proba = subprocess.run([cmd, *CFLAGS, str(sonda), "-o", str(tmp / "sonda")],
                                   capture_output=True, text=True, timeout=60)
        except (OSError, subprocess.SubprocessError):
            continue
        if proba.returncode != 0:
            continue
        versao = subprocess.run([cmd, "--version"], capture_output=True,
                                text=True, timeout=30).stdout.splitlines()
        return cmd, versao[0] if versao else "(sem --version)"
    return None, None


def checar_python(tmp: Path) -> None:
    codigo = ("import py_compile, sys; "
              "py_compile.compile(sys.argv[1], cfile=sys.argv[2], doraise=True)")
    for arquivo in sorted(CODIGO.glob("*.py")):
        try:
            r = subprocess.run(
                [sys.executable, "-c", codigo, str(arquivo),
                 str(tmp / (arquivo.stem + ".pyc"))],
                capture_output=True, text=True, timeout=60)
        except subprocess.SubprocessError as exc:
            linha(False, f"sintaxe Python: {arquivo.name}", str(exc))
            continue
        linha(r.returncode == 0, f"sintaxe Python: {arquivo.name}",
              r.stderr.strip()[:300])

    # Execuções determinísticas.
    execucoes = [
        ("referencia_04_auditor_sympy.py", None, "Todas as verificacoes simbolicas"),
        ("referencia_04_auditor_sympy.py", {"FORGE_SEM_SYMPY": "1"},
         "VERIFICADAS"),
        ("referencia_05_calculadora_cidr.py", None, "4 sub-redes /26"),
    ]
    for nome, extra_env, trecho in execucoes:
        ambiente = os.environ.copy()
        if extra_env:
            ambiente.update(extra_env)
        try:
            r = subprocess.run([sys.executable, str(CODIGO / nome)],
                               capture_output=True, text=True, timeout=120,
                               env=ambiente)
        except subprocess.SubprocessError as exc:
            linha(False, f"execucao Python: {nome}", str(exc))
            continue
        modo = " (sem SymPy simulado)" if extra_env else ""
        ok = r.returncode == 0 and trecho in (r.stdout + r.stderr)
        detalhe = (f"exit={r.returncode}, trecho={'encontrado' if trecho in r.stdout else 'ausente'}"
                   f"{'; ' + r.stderr.strip()[:200] if r.stderr.strip() else ''}")
        linha(ok, f"execucao Python: {nome}{modo}", detalhe)


def main() -> int:
    print("=== AUDITORIA FORGE 7.0 — saida/codigo ===")
    print(f"Flags C: {' '.join(CFLAGS)}")
    print(f"Python: {sys.version.split()[0]} | SO: {sys.platform}")
    with tempfile.TemporaryDirectory(prefix="forge_audit_") as tmpdir:
        tmp = Path(tmpdir)
        compilador, versao = resolver_compilador(tmp)
        if compilador is None:
            linha(False, "compilador com -std=c17",
                  "nenhum disponível; -std=c11 NAO e usado como substituto")
            versao = "(nenhum)"
        else:
            linha(True, "compilador com -std=c17", f"{compilador} | {versao}")

        mapeados = {alvo[0] for alvo in ALVOS_C}
        for arquivo in sorted(CODIGO.glob("*.c")):
            if arquivo.name not in mapeados:
                linha(False, f"arquivo C nao mapeado no auditor: {arquivo.name}")

        for nome, libs, args, trecho in ALVOS_C:
            exe = tmp / (nome[:-2] + (".exe" if os.name == "nt" else ""))
            cmd = [compilador, *CFLAGS, str(CODIGO / nome), *libs, "-o", str(exe)] if compilador else []
            cmdstr = subprocess.list2cmdline(cmd) if cmd else "(sem compilador)"
            print(f"  comando: {cmdstr}")
            if compilador is None:
                linha(False, f"compilacao: {nome}", "sem compilador c17")
                continue
            try:
                r = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
            except subprocess.SubprocessError as exc:
                linha(False, f"compilacao: {nome}", str(exc))
                continue
            avisos = (r.stdout + r.stderr).strip()
            linha(r.returncode == 0 and not avisos, f"compilacao: {nome}",
                  avisos[:500] if avisos else "0 avisos/erros")
            if r.returncode != 0:
                continue
            if args is None:
                print(f"  (execucao nao realizada: {nome} e servidor bloqueante)")
                continue
            try:
                t = subprocess.run([str(exe), *args], capture_output=True,
                                   text=True, timeout=60)
            except subprocess.SubprocessError as exc:
                linha(False, f"execucao: {nome}", str(exc))
                continue
            saida = t.stdout + t.stderr
            ok = t.returncode == 0 and (trecho is None or trecho in saida)
            linha(ok, f"execucao: {nome}", f"exit={t.returncode}")
            if saida.strip():
                print("  saida (recorte): " + " | ".join(saida.strip().splitlines()[:5])[:300])

        checar_python(tmp)

    total = len(FALHAS)
    print(f"\nRESULTADO: {len(FALHAS)} falha(s). " +
          ("TUDO OK." if total == 0 else "Corrigir itens FAIL acima."))
    return 1 if FALHAS else 0


if __name__ == "__main__":
    raise SystemExit(main())

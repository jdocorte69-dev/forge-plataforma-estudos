"""referencia_04_auditor_sympy.py — auditor matemático simbólico (SymPy).

Executa: python saida/codigo/referencia_04_auditor_sympy.py

Com SymPy disponível, valida derivada, integral, sistema linear, inverso
modular e Pequeno Teorema de Fermat. Sem SymPy (ou com FORGE_SEM_SYMPY=1),
degrada gracefully: executa o que é possível com a biblioteca padrão e informa
explicitamente quais verificações ficaram NÃO VERIFICADAS. Não instala nada.
"""
import os
from fractions import Fraction

try:
    import sympy as sp
except ImportError:  # dependência opcional: nunca instalar automaticamente
    sp = None


def verificar_sem_sympy():
    """Verificações que não precisam de SymPy (biblioteca padrão do Python)."""
    print("=== MODO DEGRADE — SYMPY INDISPONIVEL ===")
    print("Derivada e integral simbolicas: NAO VERIFICADAS (sem SymPy).")

    # 1. Inverso modular: pow(a, -1, m) é da biblioteca padrão (Python >= 3.8).
    a_val, m_val = 17, 3120
    inv = pow(a_val, -1, m_val)
    assert (a_val * inv) % m_val == 1, "Inverso modular divergente"
    print(f"1. inverso de {a_val} mod {m_val} = {inv}; (a*inv) mod m = 1 [OK]")

    # 2. Fermat com primalidade conferida por tentativa de divisão.
    p, base = 104729, 12345
    eh_primo = p > 1 and all(p % d != 0 for d in range(2, int(p ** 0.5) + 1))
    assert eh_primo, "104729 deveria ser primo"
    res = pow(base, p - 1, p)
    assert res == 1, "Fermat falhou"
    print(f"2. Fermat: {base}^{p-1} mod {p} = {res} (esperado 1) [OK]")

    # 3. Sistema Ax=b resolvido com eliminação de Gauss-Jordan em Fractions.
    A = [[2, 1, -1], [-3, -1, 2], [-2, 1, 2]]
    b = [8, -11, -3]
    n = len(b)
    mat = [[Fraction(v) for v in linha] + [Fraction(rhs)]
           for linha, rhs in zip(A, b)]
    for col in range(n):
        piv = next(r for r in range(col, n) if mat[r][col] != 0)
        mat[col], mat[piv] = mat[piv], mat[col]
        fator = mat[col][col]
        mat[col] = [v / fator for v in mat[col]]
        for r in range(n):
            if r != col and mat[r][col] != 0:
                g = mat[r][col]
                mat[r] = [v - g * w for v, w in zip(mat[r], mat[col])]
    sol = [mat[i][n] for i in range(n)]
    assert sol == [Fraction(2), Fraction(3), Fraction(-1)], "Sistema divergente"
    residuo = [sum(Fraction(A[i][j]) * sol[j] for j in range(n)) - Fraction(b[i])
               for i in range(n)]
    assert residuo == [0, 0, 0], "Resíduo divergente"
    print(f"3. Sistema Ax=b -> x={sol[0]} y={sol[1]} z={sol[2]}; resíduo {residuo} [OK]")

    print("\n[OK] Verificações disponíveis passaram; 2 itens simbólicos NÃO VERIFICADOS.")
    return 0


def auditoria():
    print("=== AUDITORIA MATEMATICA SIMBOLICA (SYMPY) ===")
    x, y, z = sp.symbols("x y z")

    # 1. Regra da cadeia: f(x) = sen(x²)·e^(3x)
    f = sp.sin(x ** 2) * sp.exp(3 * x)
    derivada = sp.diff(f, x)
    esperado = sp.exp(3 * x) * (2 * x * sp.cos(x ** 2) + 3 * sp.sin(x ** 2))
    print("\n1. f(x) =", f)
    print("   f'(x) =", derivada)
    print("   identidade simplificada =", sp.simplify(derivada - esperado))

    # 2. Integral definida de x²·cos(x) de 0 a pi
    g = x ** 2 * sp.cos(x)
    integral = sp.integrate(g, (x, 0, sp.pi))
    print("\n2. integral de", g, "de 0 a pi =", integral)
    print("   valor numerico =", float(integral))
    print("   forma esperada = -2*pi  ->  diferenca:", sp.simplify(integral + 2 * sp.pi))

    # 3. Sistema linear Ax = b
    A = sp.Matrix([[2, 1, -1], [-3, -1, 2], [-2, 1, 2]])
    b = sp.Matrix([8, -11, -3])
    sol = A.LUsolve(b)
    print("\n3. Sistema Ax=b -> x =", sol[0], "y =", sol[1], "z =", sol[2])
    print("   residuo Ax-b =", list(A * sol - b))

    # 4. Inverso modular de 17 mod 3120
    a_val, m_val = 17, 3120
    inv = sp.mod_inverse(a_val, m_val)
    print("\n4. inverso de", a_val, "mod", m_val, "=", inv)
    print("   verificacao (a*inv) mod m =", (a_val * int(inv)) % m_val)

    # 5. Pequeno Teorema de Fermat com primo 104729
    p, base = 104729, 12345
    res = pow(base, p - 1, p)
    print("\n5. Fermat:", base, "^", p - 1, "mod", p, "=", res, "(esperado 1)")
    assert res == 1, "Fermat falhou"
    assert sp.simplify(derivada - esperado) == 0, "Derivada divergente"
    assert sp.simplify(integral + 2 * sp.pi) == 0, "Integral divergente"
    assert list(A * sol - b) == [0, 0, 0], "Sistema divergente"
    print("\n[OK] Todas as verificacoes simbolicas passaram.")
    return 0


def main():
    # FORGE_SEM_SYMPY=1 simula a ausência da dependência para testar o degrade.
    if sp is None or os.environ.get("FORGE_SEM_SYMPY") == "1":
        return verificar_sem_sympy()
    return auditoria()


if __name__ == "__main__":
    raise SystemExit(main())

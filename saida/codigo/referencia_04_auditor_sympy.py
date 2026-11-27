"""referencia_04_auditor_sympy.py — auditor matemático simbólico (SymPy).

Executa: python saida/codigo/referencia_04_auditor_sympy.py
Valida derivada, integral, sistema linear, inverso modular e Pequeno Teorema de Fermat.
"""
import sympy as sp


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


if __name__ == "__main__":
    auditoria()

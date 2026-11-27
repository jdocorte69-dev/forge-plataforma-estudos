# Validação Computacional de Todas as Fórmulas

- Executado em: 2026-11-26T20:48:18-03:00
- Temas na base: 20
- Verificações: 20 snippets + 20 identidades + 7 numéricas
- Falhas: 0

Este arquivo é a prova executável de que as fórmulas apresentadas nos resumos foram testadas com Python/SymPy, conforme exigido pelo prompt mestre.

## 1. Execução dos trechos de código presentes nos resumos

| Tema | Código executado | Saída real | Status |
| --- | --- | --- | --- |
| `combinatoria` | `import math · print(math.comb(8,3), math.perm(8,3))  # 56 336` | `56 336` | OK |
| `conjuntos_numericos` | `from fractions import Fraction · print(Fraction(12, 99))  # 4/33` | `4/33` | OK |
| `derivadas` | `import sympy as sp · t=sp.symbols('t') · s=t**3-6*t · print(sp.diff(s,t), sp.diff(s,t).subs(t,2))  # 3*t**2 - ` | `3*t**2 - 6 6` | OK |
| `equacoes` | `import sympy as sp · x=sp.symbols('x') · print(sp.solve(x**2-5*x+6,x))  # [2, 3]` | `[2, 3]` | OK |
| `estatistica` | `import statistics as s · print(s.mean([4,7,7,9,20]), s.median([4,7,7,9,20]))  # 9.4 7` | `9.4 7` | OK |
| `fatoracao` | `import sympy as sp · x=sp.symbols('x') · print(sp.factor(2*x**2+11*x+12))  # (x+4)*(2*x+3)` | `(x + 4)*(2*x + 3)` | OK |
| `financeira` | `print(1000*(1+0.02*6), 1000*(1.02)**6)  # 1120.0  1126.1624...` | `1120.0 1126.1624192640002` | OK |
| `funcoes` | `def f(x): return 2*x+1 · def inv(y): return (y-1)/2 · print(f(inv(7)))  # 7.0` | `7.0` | OK |
| `geometria_analitica` | `print(((3-0)**2+(4-0)**2)**0.5)  # 5.0` | `5.0` | OK |
| `geometria_espacial` | `a,b,c=4,5,6 · print(a*b*c, (2*a)*(2*b)*(2*c))  # 120 960` | `120 960` | OK |
| `geometria_plana` | `import math · print(math.sqrt(5**2-3**2))  # 4.0` | `4.0` | OK |
| `integrais` | `import sympy as sp · x=sp.symbols('x') · print(sp.integrate(3*x**2,(x,0,2)))  # 8` | `8` | OK |
| `limites` | `import sympy as sp · x=sp.symbols('x') · print(sp.limit((x**2-4)/(x-2),x,2))  # 4` | `4` | OK |
| `logaritmos` | `import math · print(math.log(50,2), 2**math.log(50,2))  # ~5.6439  ~50.0` | `5.643856189774724 49.999999999999986` | OK |
| `matrizes` | `import sympy as sp · A=sp.Matrix([[2,1],[-3,-1]]) · b=sp.Matrix([8,-11]) · print(A.LUsolve(b))  # Matrix([3, 2` | `Matrix([[3], [2]])` | OK |
| `operacoes_inteiros` | `print(-2**3 + (-2)**2*3)  # 4` | `4` | OK |
| `probabilidade` | `P_M,P_F,P_both=0.6,0.5,0.3 · print(P_M+P_F-P_both)  # 0.8` | `0.8` | OK |
| `produtos_notaveis` | `print((100+3)*(100-3), 100**2-3**2)  # 9991 9991` | `9991 9991` | OK |
| `sequencias` | `a=2 · for _ in range(5): a*=2 · print(a)  # 64` | `64` | OK |
| `trigonometria` | `import math · print(12*math.tan(math.radians(60)))  # ~20.7846` | `20.78460969082652` | OK |

## 2. Identidades algébricas e analíticas (SymPy)

| Verificação | Expressão simbólica | Resultado | Status |
| --- | --- | --- | --- |
| Diferença de quadrados | `0` | `0` | OK |
| Quadrado da soma | `0` | `0` | OK |
| Cubo da soma | `0` | `0` | OK |
| Produtos notáveis numérico | `0` | `0` | OK |
| Fatoração 2x²+11x+12 | `0` | `0` | OK |
| Bháskara x²−5x+6 | `0` | `0` | OK |
| Limite (x²−4)/(x−2) em 2 | `0` | `0` | OK |
| Integral ∫₀² 3x² dx | `0` | `0` | OK |
| Integral ∫₀^π x²cos(x) dx | `0` | `0` | OK |
| Derivada de sen(x²)e^(3x) | `0` | `0` | OK |
| Inversa de f(x)=2x+1 | `0` | `0` | OK |
| Pitágoras 3-4-5 | `0` | `0` | OK |
| Combinação C(8,3) | `0` | `0` | OK |
| Soma PA 2,5,8,11 | `0` | `0` | OK |
| PG a₆ = 2·2⁵ | `0` | `0` | OK |
| Juros compostos 1000(1,02)⁶ | `0` | `0` | OK |
| Log₂(8) = 3 | `0` | `0` | OK |
| sen²(45°)+cos²(45°) | `0` | `0` | OK |
| Distância (0,0)-(3,4) | `0` | `0` | OK |
| Volume caixa 4×5×6 | `0` | `0` | OK |

## 3. Verificações numéricas adicionais

| Item | Cálculo | Valor obtido | Valor esperado | Status |
| --- | --- | --- | --- | --- |
| Entropia senha 20 caracteres, alfabeto 94 | — | 131.09 | 131.09 | OK |
| pow(12345,104728,104729) | — | 1 | 1 | OK |
| mdc(48,18) | — | 6 | 6 | OK |
| mmc(12,18) | — | 36 | 36 | OK |
| 12·tan(60°) | — | 20.78460969082652 | 20.784609690826528 | OK |
| 2^5,6439 ≈ 50 | — | 49.999999999999986 | 50.0 | OK |
| Desvio padrão de 2 e 8 | — | 3.0 | 3.0 | OK |

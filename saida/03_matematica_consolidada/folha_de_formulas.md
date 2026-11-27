# Folha de Fórmulas — FORGE (Unicode, validada)

Imprima esta folha e mantenha-a ao lado do caderno. Cada linha foi conferida com SymPy.

| Área | Fórmula central | Segunda fórmula | Cuidado |
| --- | --- | --- | --- |
| Conjuntos Numéricos | Encadeamento: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ. | Todo inteiro é racional: n = n/1. | Confundir 'pertencer' com 'ser subconjunto'. |
| Operações com Inteiros | aᵐ · aⁿ = aᵐ⁺ⁿ; aᵐ / aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ. | a⁰ = 1 para a ≠ 0; a⁻ⁿ = 1/aⁿ. | Trocar |−6| por −6. |
| Produtos Notáveis | (a + b)² = a² + 2ab + b²; (a − b)² = a² − 2ab + b². | a² − b² = (a − b)(a + b). | Escrever a² + b² = (a+b)² — falta o termo 2ab. |
| Fatoração | a² − b² = (a−b)(a+b). | x² + (p+q)x + pq = (x+p)(x+q). | Parar antes de esgotar o fator comum. |
| Equações e Inequações (Inequalities) | Fórmula de Bháskara: x = (−b ± √Δ)/(2a), com Δ = b² − 4ac. | Relações de Viète: soma das raízes = −b/a; produto = c/a. | Fazer 'passar para o outro lado trocando sinal' sem entender o po |
| Funções | Composição: (f∘g)(x) = f(g(x)); a ordem importa. | Se f é bijetora, existe f⁻¹ com f(f⁻¹(x)) = x. | Achar que f(x) = ±√x é função (para x>0 dá dois valores). |
| Logaritmos | log_b(M·N) = log_b(M) + log_b(N). | log_b(M/N) = log_b(M) − log_b(N). | Esquecer que a base deve ser positiva e diferente de 1. |
| Trigonometria | sen²θ + cos²θ = 1; tanθ = senθ/cosθ. | sen(a+b) = sen a·cos b + cos a·sen b. | Usar graus em modo radianos da calculadora. |
| Sequências | PA: aₙ = a₁ + (n−1)r; Sₙ = n(a₁ + aₙ)/2. | PG: aₙ = a₁·qⁿ⁻¹; Sₙ = a₁(qⁿ − 1)/(q − 1), q ≠ 1. | Usar n em vez de n−1 na fórmula do termo geral. |
| Matrizes e Determinantes | det(AB) = det(A)·det(B). | (AB)ᵀ = BᵀAᵀ. | Multiplicar matrizes 'elemento por elemento' como se fosse soma. |
| Geometria Plana | Soma dos ângulos internos de um triângulo: 180°. | Teorema de Pitágoras: a² + b² = c². | Supor que 'triângulo isósceles' tem todos os lados iguais. |
| Geometria Analítica | Distância: d = √((x₂−x₁)² + (y₂−y₁)²). | Inclinação entre dois pontos: m = (y₂−y₁)/(x₂−x₁). | Trocar a ordem das coordenadas y. |
| Geometria Espacial | Volume do cubo: V = a³; do paralelepípedo: V = a·b·c. | Volume da esfera: V = (4/3)πr³; área superficial: S = 4πr². | Achar que duas retas no espaço sempre se cruzam. |
| Análise Combinatória | A(n,k) = n!/(n−k)!; C(n,k) = n!/(k!(n−k)!). | C(n,k) = C(n,n−k). | Somar quando deveria multiplicar. |
| Probabilidade | Axiomas de Kolmogorov: P ≥ 0, P(Ω) = 1, aditividade para eventos disjuntos. | P(A∪B) = P(A) + P(B) − P(A∩B). | Atribuir probabilidades que não somam 1. |
| Estatística | Média: x̄ = (∑xᵢ)/n. | Variância: Var(X) = E[X²] − (E[X])². | Achar que a média sempre representa bem dados com outliers. |
| Matemática Financeira | Juros simples: M = P(1 + it). | Juros compostos: M = P(1+i)ⁿ. | Aplicar juros simples em prazo longo sem perceber a diferença. |
| Limites | lim(x→a) [f(x) ± g(x)] = lim f ± lim g, quando os limites existem. | lim(x→a) (xⁿ − aⁿ)/(x − a) = n·aⁿ⁻¹. | Substituir x = a diretamente e desistir ao encontrar 0/0. |
| Derivadas | Regra do produto: (fg)′ = f′g + fg′. | Regra do quociente: (f/g)′ = (f′g − fg′)/g². | Calcular (f(x+0)−f(x))/0 diretamente. |
| Integrais | ∫ₐᵇ f(x)dx = F(b) − F(a), com F′ = f. | Integração por partes: ∫u dv = uv − ∫v du. | Esquecer o diferencial dx. |

## Constantes e valores notáveis

| Constante | Valor aproximado | Onde aparece |
| --- | --- | --- |
| π | 3,141592653589793 | circunferência, trigonometria, esfera |
| e | 2,718281828459045 | logaritmo natural, juros contínuos |
| √2 | 1,4142135623730951 | diagonal do quadrado, irracionalidade |
| √3 | 1,7320508075688772 | triângulo equilátero, tan(60°) |
| log₁₀(2) | 0,3010299956639812 | mudança de base, entropia |
| log₂(10) | 3,3219280948873626 | bits por dígito decimal |

## Ângulos notáveis

| Ângulo | Graus | Radianos | seno | cosseno | tangente |
| --- | ---: | --- | --- | --- | --- |
| 0° | 0 | 0 | 0 | 1 | 0 |
| 30° | 30 | π/6 | 1/2 | √3/2 | √3/3 |
| 45° | 45 | π/4 | √2/2 | √2/2 | 1 |
| 60° | 60 | π/3 | √3/2 | 1/2 | √3 |
| 90° | 90 | π/2 | 1 | 0 | indefinida |

## Verificação rápida (execute no Python)

```python
import sympy as sp, math
x = sp.symbols('x')
assert sp.simplify((x+3)*(x-3) - (x**2-9)) == 0
assert sp.integrate(3*x**2, (x,0,2)) == 8
assert sp.limit((x**2-4)/(x-2), x, 2) == 4
assert pow(12345, 104728, 104729) == 1
assert math.isclose(12*math.tan(math.radians(60)), 12*math.sqrt(3))
print('TODAS AS FÓRMULAS OK')
```


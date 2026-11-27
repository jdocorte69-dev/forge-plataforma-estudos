# Compêndio Consolidado de Matemática — FORGE

- Gerado em: 2026-11-26T20:39:38-03:00
- Consolidação autoral dos 220 resumos de capítulo das Fases 1 e 2.
- Todas as fórmulas usei em Unicode legível e validei com Python/SymPy.
- Cada capítulo segue rigorosamente as 9 seções obrigatórias do prompt mestre.

## Índice temático

1. Conjuntos Numéricos — `conjuntos_numericos`
2. Operações com Inteiros — `operacoes_inteiros`
3. Produtos Notáveis — `produtos_notaveis`
4. Fatoração — `fatoracao`
5. Equações e Inequações (Inequalities) — `equacoes`
6. Funções — `funcoes`
7. Logaritmos — `logaritmos`
8. Trigonometria — `trigonometria`
9. Sequências — `sequencias`
10. Matrizes e Determinantes — `matrizes`
11. Geometria Plana — `geometria_plana`
12. Geometria Analítica — `geometria_analitica`
13. Geometria Espacial — `geometria_espacial`
14. Análise Combinatória — `combinatoria`
15. Probabilidade — `probabilidade`
16. Estatística — `estatistica`
17. Matemática Financeira — `financeira`
18. Limites — `limites`
19. Derivadas — `derivadas`
20. Integrais — `integrais`

> Nota pedagógica: para cada tema aqui formalizado, leia também a reconstrução histórica em `07_primeiros_principios/genese_10_descobertas.md` (Método das 5 Camadas).

---

# 01. Conjuntos Numéricos

> Ideia-força: Organizar a paisagem dos números em conjuntos encaixados, do mais restrito ao mais amplo, para saber sempre em qual terreno uma operação é válida.

### 1. Ideia Central

Organizar a paisagem dos números em conjuntos encaixados, do mais restrito ao mais amplo, para saber sempre em qual terreno uma operação é válida.

### 2. Pré-requisitos Necessários

- Noção de quantidade e contagem.
- Noção de igualdade e ordem.

### 3. Conceitos-chave

#### Conjunto numérico

- **Definição formal:** Coleção bem definida de números com uma propriedade comum.
- **Intuição prática:** Pense em gavetas dentro de gavetas: cada gaveta menor cabe na maior.
- **Exemplo original:** O número −3 pertence a ℤ e a ℚ, mas não a ℕ.
- **Erro comum:** Confundir 'pertencer' com 'ser subconjunto'.

#### Número racional

- **Definição formal:** Todo número que pode ser escrito como p/q com p e q inteiros e q ≠ 0.
- **Intuição prática:** É qualquer fração ou decimal que termina ou repete.
- **Exemplo original:** 0,125 = 1/8; 0,333… = 1/3.
- **Erro comum:** Achar que decimal infinito nunca é racional — apenas a repetição importa.

#### Número irracional

- **Definição formal:** Número real que não admite representação como fração de inteiros.
- **Intuição prática:** É aquele decimal infinito e sem padrão repetitivo.
- **Exemplo original:** √2 e π são irracionais.
- **Erro comum:** Usar aproximação 3,14 para π e concluir que ele é racional.

### 4. Teoremas, Leis e Fórmulas

- Encadeamento: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ.
- Todo inteiro é racional: n = n/1.
- Densidade de ℚ: entre dois reais distintos existe sempre um racional.

### 5. Exemplo Resolvido Passo a Passo

1. Classificar −7/4, √9, √10 e 0,121212…
2. 1) −7/4 já é fração de inteiros ⇒ racional.
3. 2) √9 = 3 ⇒ inteiro, logo racional (a raiz engana olhos apressados).
4. 3) √10 não é inteiro nem fração ⇒ irracional.
5. 4) 0,121212… repete o bloco 12 ⇒ racional; escrevendo x = 0,121212…, 100x − x = 12 ⇒ x = 12/99 = 4/33.

### 6. Conexões Interdisciplinares

A classificação dos números sustenta a teoria dos conjuntos, a álgebra abstrata e a representação de ponto flutuante em computadores (ℝ é approximation infinita; a máquina usa finita).

### 7. Código Funcional (validado)

```python
from fractions import Fraction
print(Fraction(12, 99))  # 4/33
```

### 8. Checklist de Domínio

- [ ] Sei explicar a diferença entre ℕ, ℤ, ℚ, ℝ e ℂ sem olhar o caderno.
- [ ] Consigo transformar uma dízima periódica em fração.
- [ ] Sei justificar por que √2 é irracional.
- [ ] Identifico quando uma raiz é na verdade um inteiro disfarçado.
- [ ] Não confundo '∈' com '⊂'.

### 9. Perguntas de Revisão e Gabarito

**P1.** 0,090909… é racional? Justifique.

> **Gabarito (retenção):** Sim. O bloco 09 repete; x = 0,0909…, 100x − x = 9 ⇒ x = 9/99 = 1/11.

**P2.** Todo número racional é real?

> **Gabarito (retenção):** Sim. ℚ ⊂ ℝ, embora a recíproca seja falsa.

**P3.** √4 é irracional?

> **Gabarito (retenção):** Não. √4 = 2, inteiro; a classificação deve usar o valor simplificado.

---

# 02. Operações com Inteiros

> Ideia-força: Dominar as regras de sinal, prioridade e potenciação para que a álgebra deixe de ser um jogo de adivinhação.

### 1. Ideia Central

Dominar as regras de sinal, prioridade e potenciação para que a álgebra deixe de ser um jogo de adivinhação.

### 2. Pré-requisitos Necessários

- Conjuntos numéricos.
- Noção de subtração.

### 3. Conceitos-chave

#### Módulo

- **Definição formal:** Distância de um número até zero, sempre não negativa.
- **Intuição prática:** É o 'quanto o número anda' sem importar a direção.
- **Exemplo original:** |−6| = 6.
- **Erro comum:** Trocar |−6| por −6.

#### Potenciação

- **Definição formal:** Multiplicação repetida de um fator por si mesmo.
- **Intuição prática:** O expoente conta quantas cópias do fator entram no produto.
- **Exemplo original:** 2⁴ = 2·2·2·2 = 16.
- **Erro comum:** Aplicar a regra (aᵐ)ⁿ = aᵐ⁺ⁿ em vez de aᵐⁿ.

#### Prioridade

- **Definição formal:** Ordem convencional: parênteses, potências, multiplicação/divisão, adição/subtração.
- **Intuição prática:** É a 'hierarquia' que evita duas respostas para a mesma conta.
- **Exemplo original:** 3 + 2·4 = 11, não 20.
- **Erro comum:** Calcular da esquerda para a direita sem respeitar a hierarquia.

### 4. Teoremas, Leis e Fórmulas

- aᵐ · aⁿ = aᵐ⁺ⁿ; aᵐ / aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ.
- a⁰ = 1 para a ≠ 0; a⁻ⁿ = 1/aⁿ.
- Lei de sinais na multiplicação: (−)(−) = (+); (−)(+) = (−).

### 5. Exemplo Resolvido Passo a Passo

1. Calcular −2³ + (−2)² · 3.
2. 1) −2³ = −(2³) = −8 (o sinal está fora da potência).
3. 2) (−2)² = 4 (aqui o sinal está dentro dos parênteses).
4. 3) 4 · 3 = 12.
5. 4) −8 + 12 = 4.
6. Conferência: Python calcula -2**3 + (-2)**2*3 = 4.

### 6. Conexões Interdisciplinares

A precedência de operadores é a mesma ideia usada por compiladores C e interpretadores Python na construção da árvore sintática de expressões.

### 7. Código Funcional (validado)

```python
print(-2**3 + (-2)**2*3)  # 4
```

### 8. Checklist de Domínio

- [ ] Diferencio −aⁿ de (−a)ⁿ.
- [ ] Aplico corretamente as leis dos expoentes.
- [ ] Resolvo expressões com parênteses aninhados.
- [ ] Sei o que é 0⁰ (indefinido por convenção elementar).
- [ ] Justifico cada passo, sem pular direto para a resposta.

### 9. Perguntas de Revisão e Gabarito

**P1.** Quanto é −3²?

> **Gabarito (retenção):** −9. O sinal não está elevado ao quadrado; se fosse (−3)², seria 9.

**P2.** Quanto é 2⁰ + 2⁻¹?

> **Gabarito (retenção):** 1 + 1/2 = 3/2.

**P3.** Por que (a²)³ = a⁶?

> **Gabarito (retenção):** Porque potência de potência multiplica expoentes.

---

# 03. Produtos Notáveis

> Ideia-força: Reconhecer padrões de multiplicação que evitam centenas de contas e revelam a estrutura por trás do polinômio.

### 1. Ideia Central

Reconhecer padrões de multiplicação que evitam centenas de contas e revelam a estrutura por trás do polinômio.

### 2. Pré-requisitos Necessários

- Distributividade.
- Potenciação.

### 3. Conceitos-chave

#### Diferença de quadrados

- **Definição formal:** a² − b² = (a − b)(a + b).
- **Intuição prática:** É um quadrado grande com um quadrado menor recortado: sobra duas faixas.
- **Exemplo original:** 49 − 9 = (7−3)(7+3) = 40.
- **Erro comum:** Escrever a² + b² = (a+b)² — falta o termo 2ab.

#### Quadrado da soma

- **Definição formal:** (a + b)² = a² + 2ab + b².
- **Intuição prática:** É o quadrado de um lado (a+b) decomposto em quatro regiões.
- **Exemplo original:** (x+3)² = x² + 6x + 9.
- **Erro comum:** Esquecer o termo do meio 2ab.

#### Cubo da soma

- **Definição formal:** (a + b)³ = a³ + 3a²b + 3ab² + b³.
- **Intuição prática:** É o análogo tridimensional do quadrado da soma.
- **Exemplo original:** (1+2)³ = 1+6+12+8 = 27.
- **Erro comum:** Trocar os coeficientes 3 e 3 por 2 e 2.

### 4. Teoremas, Leis e Fórmulas

- (a + b)² = a² + 2ab + b²; (a − b)² = a² − 2ab + b².
- a² − b² = (a − b)(a + b).
- (a + b)(c + d) = ac + ad + bc + bd (distributividade dupla).

### 5. Exemplo Resolvido Passo a Passo

1. Calcular 103 × 97 sem multiplicação direta.
2. 1) Escreva 103 = 100 + 3 e 97 = 100 − 3.
3. 2) Aplicando (a+b)(a−b) = a² − b² com a = 100 e b = 3.
4. 3) 100² − 3² = 10000 − 9 = 9991.
5. 4) Conferência direta: 103 × 97 = 9991.

### 6. Conexões Interdisciplinares

Produtos notáveis são a base da fatoração, da simplificação de frações algébricas e da aceleração de multiplicações em hardware (algoritmos de Karatsuba).

### 7. Código Funcional (validado)

```python
print((100+3)*(100-3), 100**2-3**2)  # 9991 9991
```

### 8. Checklist de Domínio

- [ ] Reconheço uma diferença de quadrados em meio a uma expressão.
- [ ] Não esqueço o 2ab.
- [ ] Consigo fatorar x² − 16 em segundos.
- [ ] Uso produtos notáveis para cálculo mental.
- [ ] Verifico a identidade com um valor numérico.

### 9. Perguntas de Revisão e Gabarito

**P1.** Fatore x² − 25.

> **Gabarito (retenção):** (x−5)(x+5).

**P2.** Quanto é (a−b)² − (a²+b²)?

> **Gabarito (retenção):** −2ab.

**P3.** Por que 51×49 = 2499?

> **Gabarito (retenção):** Porque (50+1)(50−1) = 2500−1 = 2499.

---

# 04. Fatoração

> Ideia-força: Reescrever uma soma como produto — a operação que transformada equações difíceis em equações triviais.

### 1. Ideia Central

Reescrever uma soma como produto — a operação que transformada equações difíceis em equações triviais.

### 2. Pré-requisitos Necessários

- Produtos notáveis.
- MDC.

### 3. Conceitos-chave

#### Fator comum

- **Definição formal:** Fator que divide todos os termos da expressão.
- **Intuição prática:** É 'tirar o que todos têm' como retirar um saco de cada fileira.
- **Exemplo original:** 6x² + 9x = 3x(2x + 3).
- **Erro comum:** Parar antes de esgotar o fator comum.

#### Fatoração por agrupamento

- **Definição formal:** Agrupar termos para revelar um fator comum escondido.
- **Intuição prática:** É reorganizar peças até que uma mesma peça apareça em dois grupos.
- **Exemplo original:** ax+ay+bx+by = (a+b)(x+y).
- **Erro comum:** Agrupar de forma que não surja fator repetido.

#### Trinômio quadrado perfeito

- **Definição formal:** x² + 2kx + k² = (x+k)².
- **Intuição prática:** É reconhecer o quadrado da soma ao contrário.
- **Exemplo original:** x² + 8x + 16 = (x+4)².
- **Erro comum:** Ignorar o sinal do termo do meio.

### 4. Teoremas, Leis e Fórmulas

- a² − b² = (a−b)(a+b).
- x² + (p+q)x + pq = (x+p)(x+q).
- Um polinômio de grau n tem no máximo n raízes reais distintas.

### 5. Exemplo Resolvido Passo a Passo

1. Fatorar 2x² + 11x + 12.
2. 1) Procuramos p e q com p·q = 2·12 = 24 e p+q = 11.
3. 2) O par (3, 8) serve.
4. 3) Escreva 2x² + 3x + 8x + 12.
5. 4) Agrupe: x(2x+3) + 4(2x+3) = (x+4)(2x+3).
6. 5) Verifique expandindo: 2x²+3x+8x+12.

### 6. Conexões Interdisciplinares

Fatoração é usada em criptografia (fatorar inteiros grandes é difícil — base do RSA) e em simplificação de expressões em engenharia de software simbólico.

### 7. Código Funcional (validado)

```python
import sympy as sp
x=sp.symbols('x')
print(sp.factor(2*x**2+11*x+12))  # (x+4)*(2*x+3)
```

### 8. Checklist de Domínio

- [ ] Sempre verifico a fatoração expandindo de volta.
- [ ] Reconheço trinômios quadrados perfeitos.
- [ ] Sei fatorar por agrupamento.
- [ ] Retiro o fator comum antes de outros métodos.
- [ ] Entendo por que fatorar ajuda a encontrar raízes.

### 9. Perguntas de Revisão e Gabarito

**P1.** Fatore x² + 7x + 12.

> **Gabarito (retenção):** (x+3)(x+4).

**P2.** Fatore 3x² − 12.

> **Gabarito (retenção):** 3(x−2)(x+2).

**P3.** Por que fatorar ajuda a resolver equações?

> **Gabarito (retenção):** Porque produto nulo implica algum fator nulo.

---

# 05. Equações e Inequações (Inequalities)

> Ideia-força: Isolar a incógnita preservando o equilíbrio da igualdade — a ideia da balança que nunca entorta.

### 1. Ideia Central

Isolar a incógnita preservando o equilíbrio da igualdade — a ideia da balança que nunca entorta.

### 2. Pré-requisitos Necessários

- Operações com inteiros.
- Frações.

### 3. Conceitos-chave

#### Equação

- **Definição formal:** Igualdade entre duas expressões que contêm incógnitas.
- **Intuição prática:** É uma balança: o que se faz de um lado, faz-se do outro.
- **Exemplo original:** 2x + 3 = 11 ⇒ x = 4.
- **Erro comum:** Fazer 'passar para o outro lado trocando sinal' sem entender o porquê.

#### Equação do 2º grau

- **Definição formal:** Equação da forma ax² + bx + c = 0 com a ≠ 0.
- **Intuição prática:** Descreve uma parábola; as raízes são onde ela cruza o eixo horizontal.
- **Exemplo original:** x² − 5x + 6 = 0 ⇒ x = 2 ou x = 3.
- **Erro comum:** Esquecer a condição a ≠ 0.

#### Delta

- **Definição formal:** Discriminante Δ = b² − 4ac, que conta quantas raízes reais existem.
- **Intuição prática:** É o 'semáforo' da equação: negativo pare, zero um ponto, positivo dois.
- **Exemplo original:** Em x²−5x+6, Δ = 25−24 = 1 > 0.
- **Erro comum:** Calcular b² como b·2.

### 4. Teoremas, Leis e Fórmulas

- Fórmula de Bháskara: x = (−b ± √Δ)/(2a), com Δ = b² − 4ac.
- Relações de Viète: soma das raízes = −b/a; produto = c/a.
- Teorema do Resto: o resto da divisão de P(x) por (x − r) é P(r).

### 5. Exemplo Resolvido Passo a Passo

1. Resolver x² − 5x + 6 = 0 de duas formas.
2. 1) Fatoração: procuramos dois números cujo produto é 6 e soma é 5: 2 e 3.
3. 2) Logo (x − 2)(x − 3) = 0 ⇒ x = 2 ou x = 3.
4. 3) Via Bháskara: a=1, b=−5, c=6 ⇒ Δ = 25−24 = 1; x = (5 ± 1)/2 ∈ {2, 3}.
5. 4) Verificação: 2²−5·2+6 = 0 e 3²−5·3+6 = 0.

### 6. Conexões Interdisciplinares

Raízes de polinômios aparecem em sistemas de controle, em funções de transferência e na fatoração de matrizes pelo polinômio característico.

### 7. Código Funcional (validado)

```python
import sympy as sp
x=sp.symbols('x')
print(sp.solve(x**2-5*x+6,x))  # [2, 3]
```

### 8. Checklist de Domínio

- [ ] Verifico as raízes substituindo na equação original.
- [ ] Sei interpretar o sinal de Δ geometricamente.
- [ ] Consigo usar as relações de Viète sem resolver a equação.
- [ ] Respeito a restrição a ≠ 0.
- [ ] Transformo problemas de texto em equação.

### 9. Perguntas de Revisão e Gabarito

**P1.** Se Δ = 0, quantas raízes reais existem?

> **Gabarito (retenção):** Uma raiz real dupla: x = −b/(2a).

**P2.** Quais são as raízes de x² + x − 6 = 0?

> **Gabarito (retenção):** x = 2 e x = −3; o produto é −6 e a soma é −1.

**P3.** O que afirma o Teorema do Resto?

> **Gabarito (retenção):** Que P(r) é o resto da divisão de P(x) por (x − r).

---

# 06. Funções

> Ideia-força: Modelar uma dependência: para cada entrada, exatamente uma saída — a máquina que transforma números.

### 1. Ideia Central

Modelar uma dependência: para cada entrada, exatamente uma saída — a máquina que transforma números.

### 2. Pré-requisitos Necessários

- Conjuntos.
- Equações.

### 3. Conceitos-chave

#### Função

- **Definição formal:** Relação que associa a cada elemento do domínio um único elemento do contradomínio.
- **Intuição prática:** É uma máquina de ingresso: uma ficha entra, uma saída sai, nunca duas.
- **Exemplo original:** f(x) = 2x + 1.
- **Erro comum:** Achar que f(x) = ±√x é função (para x>0 dá dois valores).

#### Injetora

- **Definição formal:** Elementos distintos do domínio geram imagens distintas.
- **Intuição prática:** Duas fichas diferentes nunca caem no mesmo destino.
- **Exemplo original:** f(x)=3x+2 é injetora.
- **Erro comum:** Testar injetividade só olhando o gráfico sem critério.

#### Sobrejetora

- **Definição formal:** Todo elemento do contradomínio é atingido por algum elemento do domínio.
- **Intuição prática:** Nenhum destino fica vazio.
- **Exemplo original:** f: ℝ→ℝ, f(x)=x³ é sobrejetora.
- **Erro comum:** Confundir sobrejetora com injetora.

### 4. Teoremas, Leis e Fórmulas

- Composição: (f∘g)(x) = f(g(x)); a ordem importa.
- Se f é bijetora, existe f⁻¹ com f(f⁻¹(x)) = x.
- Gráfico de f⁻¹ é o reflexo do gráfico de f em torno da reta y = x.

### 5. Exemplo Resolvido Passo a Passo

1. Dada f(x) = 2x + 1, encontrar a inversa.
2. 1) Escreva y = 2x + 1.
3. 2) Isole x: x = (y − 1)/2.
4. 3) Troque os papéis: f⁻¹(x) = (x − 1)/2.
5. 4) Verifique: f(f⁻¹(7)) = 2·3 + 1 = 7.

### 6. Conexões Interdisciplinares

Funções são a linguagem natural da programação (função pura em C/Python), de modelos estatísticos e de transformações lineares em álgebra.

### 7. Código Funcional (validado)

```python
def f(x): return 2*x+1
def inv(y): return (y-1)/2
print(f(inv(7)))  # 7.0
```

### 8. Checklist de Domínio

- [ ] Aplico o teste da reta vertical.
- [ ] Diferencio domínio, contradomínio e imagem.
- [ ] Calculo a inversa e verifico a composição.
- [ ] Componho funções na ordem correta.
- [ ] Sei dar exemplo de função que não é injetora.

### 9. Perguntas de Revisão e Gabarito

**P1.** Toda função injetora é bijetora?

> **Gabarito (retenção):** Não; falta ser sobrejetora.

**P2.** Qual o domínio de f(x) = 1/(x−2)?

> **Gabarito (retenção):** ℝ − {2}.

**P3.** Se f(x)=x² em ℝ, ela é injetora?

> **Gabarito (retenção):** Não, pois f(2)=f(−2)=4.

---

# 07. Logaritmos

> Ideia-força: Transformar multiplicação em soma — a 'tradução para o mundo dos expoentes' que salvou astrônomos de meses de conta.

### 1. Ideia Central

Transformar multiplicação em soma — a 'tradução para o mundo dos expoentes' que salvou astrônomos de meses de conta.

### 2. Pré-requisitos Necessários

- Potenciação.
- Funções exponenciais.

### 3. Conceitos-chave

#### Logaritmo

- **Definição formal:** O expoente necessário para transformar a base b no número x.
- **Intuição prática:** É perguntar: 'quantas voltas de multiplicação me levam até aqui?'
- **Exemplo original:** log₂(8) = 3 porque 2³ = 8.
- **Erro comum:** Esquecer que a base deve ser positiva e diferente de 1.

#### Mudança de base

- **Definição formal:** logₐ(x) = log_b(x)/log_b(a) para bases válidas.
- **Intuição prática:** É converter a medida de 'régua' de um expoente para outro.
- **Exemplo original:** log₃(81) = log(81)/log(3) = 4.
- **Erro comum:** Inverter o numerador e o denominador.

#### Escala logarítmica

- **Definição formal:** Escala em que distâncias iguais representam multiplicações iguais.
- **Intuição prática:** É um 'zoom' que comprime números gigantes.
- **Exemplo original:** Terremotos e intensidade sonora usam essa ideia.
- **Erro comum:** Interpretar um aumento de 1 unidade como '+1' em vez de '×10'.

### 4. Teoremas, Leis e Fórmulas

- log_b(M·N) = log_b(M) + log_b(N).
- log_b(M/N) = log_b(M) − log_b(N).
- log_b(Mᵏ) = k·log_b(M); b^(log_b x) = x.

### 5. Exemplo Resolvido Passo a Passo

1. Resolver 2ˣ = 50.
2. 1) Aplique log₂ nos dois lados: x = log₂(50).
3. 2) Use mudança de base: log(50)/log(2).
4. 3) Com log(50) ≈ 1,69897 e log(2) ≈ 0,30103, x ≈ 5,6439.
5. 4) Verificação: 2^5,6439 ≈ 50.

### 6. Conexões Interdisciplinares

Logaritmos medem entropia (H = log₂ Nᴸ), complexidade de algoritmos e decaimento radioativo; são ponte entre álgebra e análise.

### 7. Código Funcional (validado)

```python
import math
print(math.log(50,2), 2**math.log(50,2))  # ~5.6439  ~50.0
```

### 8. Checklist de Domínio

- [ ] Sei converter entre forma exponencial e logarítmica.
- [ ] Aplico as três propriedades sem inventar regras novas.
- [ ] Respeito restrições de domínio.
- [ ] Faço mudança de base corretamente.
- [ ] Interpreto gráficos em escala logarítmica.

### 9. Perguntas de Revisão e Gabarito

**P1.** Quanto é log₅(25)?

> **Gabarito (retenção):** 2, pois 5² = 25.

**P2.** log(2) + log(5) = ?

> **Gabarito (retenção):** log(10) = 1 (base 10).

**P3.** Por que log_b(1) = 0?

> **Gabarito (retenção):** Porque b⁰ = 1 para qualquer base válida.

---

# 08. Trigonometria

> Ideia-força: Medir o que 'gira' relacionando ângulos e razões de triângulos — a ponte entre geometria e movimento.

### 1. Ideia Central

Medir o que 'gira' relacionando ângulos e razões de triângulos — a ponte entre geometria e movimento.

### 2. Pré-requisitos Necessários

- Geometria plana.
- Teorema de Pitágoras.
- Funções.

### 3. Conceitos-chave

#### Seno e cosseno

- **Definição formal:** No círculo unitário, seno é a coordenada vertical e cosseno a horizontal.
- **Intuição prática:** É a sombra de um ponteiro girando dentro de um relógio de raio 1.
- **Exemplo original:** sen(30°) = 1/2; cos(60°) = 1/2.
- **Erro comum:** Usar graus em modo radianos da calculadora.

#### Radianos

- **Definição formal:** Ângulo igual ao comprimento do arco dividido pelo raio.
- **Intuição prática:** É medir giros pelo próprio arco, não por uma divisão arbitrária em 360.
- **Exemplo original:** 180° = π rad; 90° = π/2 rad.
- **Erro comum:** Esquecer de converter antes de derivar função trigonométrica.

#### Identidade fundamental

- **Definição formal:** sen²θ + cos²θ = 1.
- **Intuição prática:** É apenas Pitágoras aplicado ao triângulo dentro do círculo unitário.
- **Exemplo original:** sen²(45°) + cos²(45°) = 1/2+1/2 = 1.
- **Erro comum:** Aplicar a identidade a ângulos em graus inside funções hiperbólicas.

### 4. Teoremas, Leis e Fórmulas

- sen²θ + cos²θ = 1; tanθ = senθ/cosθ.
- sen(a+b) = sen a·cos b + cos a·sen b.
- Lei dos senos: a/sen A = b/sen B = c/sen C = 2R.
- Lei dos cossenos: c² = a² + b² − 2ab·cos C.

### 5. Exemplo Resolvido Passo a Passo

1. Calcular a altura de uma torre cuja sombra mede 12 m quando o Sol está a 60°.
2. 1) Monte o triângulo retângulo: altura h é cateto oposto, sombra 12 m é cateto adjacente.
3. 2) tan(60°) = h/12.
4. 3) h = 12·tan(60°) = 12·√3 ≈ 20,78 m.
5. 4) Verificação numérica com Python.

### 6. Conexões Interdisciplinares

Trigonometria sustenta navegação, processamento de sinal (transformada de Fourier), computação gráfica e corrente alternada em engenharia elétrica.

### 7. Código Funcional (validado)

```python
import math
print(12*math.tan(math.radians(60)))  # ~20.7846
```

### 8. Checklist de Domínio

- [ ] Converto graus ↔ radianos sem errar.
- [ ] Conheço a tabela do círculo unitário nos ângulos notáveis.
- [ ] Sei quando usar lei dos senos ou dos cossenos.
- [ ] Verifico identidades com um ângulo de teste.
- [ ] Entendo o significado de seno e cosseno como projeções.

### 9. Perguntas de Revisão e Gabarito

**P1.** Quanto vale sen(90°)?

> **Gabarito (retenção):** 1.

**P2.** Qual a relação entre radianos e graus?

> **Gabarito (retenção):** 180° = π radianos.

**P3.** Quando usar a lei dos cossenos?

> **Gabarito (retenção):** Quando não se tem um par ângulo-lado oposto conhecido.

---

# 09. Sequências

> Ideia-força: Descrever listas ordenadas por uma regra e prever o termo longeano sem escrever todos os anteriores.

### 1. Ideia Central

Descrever listas ordenadas por uma regra e prever o termo longeano sem escrever todos os anteriores.

### 2. Pré-requisitos Necessários

- Funções.
- Indução.

### 3. Conceitos-chave

#### Progressão aritmética

- **Definição formal:** Sequência em que aₙ = a₁ + (n−1)r.
- **Intuição prática:** É uma caminhada de passo constante r.
- **Exemplo original:** 2, 5, 8, 11, … tem r = 3.
- **Erro comum:** Usar n em vez de n−1 na fórmula do termo geral.

#### Progressão geométrica

- **Definição formal:** Sequência em que aₙ = a₁·qⁿ⁻¹.
- **Intuição prática:** É um crescimento multiplicativo: cada passo é uma multiplicação.
- **Exemplo original:** 3, 6, 12, 24 tem q = 2.
- **Erro comum:** Confundir razão q com diferença r.

#### Soma dos termos

- **Definição formal:** PA: Sₙ = n(a₁+aₙ)/2; PG: Sₙ = a₁(qⁿ−1)/(q−1) para q ≠ 1.
- **Intuição prática:** É 'emparelhar' os termos para somar rápido.
- **Exemplo original:** S₄ de 2,5,8,11 é 26.
- **Erro comum:** Aplicar a fórmula da PG com q = 1.

### 4. Teoremas, Leis e Fórmulas

- PA: aₙ = a₁ + (n−1)r; Sₙ = n(a₁ + aₙ)/2.
- PG: aₙ = a₁·qⁿ⁻¹; Sₙ = a₁(qⁿ − 1)/(q − 1), q ≠ 1.
- Em PA, termos equidistantes têm soma constante.

### 5. Exemplo Resolvido Passo a Passo

1. Um torneio começa com 2 participantes e dobra a cada rodada. Quantos após 6 rodadas?
2. 1) É PG com a₁ = 2 e q = 2.
3. 2) a₆ = 2·2⁵ = 64.
4. 3) Verificação iterativa em Python.
5. 4) Se a₁ fosse 3, teríamos 96.

### 6. Conexões Interdisciplinares

Sequências aparecem em juros compostos, crescimento populacional, análise de algoritmos recursivos e séries de Taylor.

### 7. Código Funcional (validado)

```python
a=2
for _ in range(5): a*=2
print(a)  # 64
```

### 8. Checklist de Domínio

- [ ] Identifico se a sequência é PA ou PG.
- [ ] Aplico a fórmula do termo geral com n−1.
- [ ] Calculo somas sem escrever todos os termos.
- [ ] Trato o caso q = 1 separadamente.
- [ ] Verifico pequenos casos à mão.

### 9. Perguntas de Revisão e Gabarito

**P1.** Qual o 10º termo de 3, 7, 11, …?

> **Gabarito (retenção):** 39.

**P2.** Qual a soma dos 5 primeiros termos de 1, 2, 4, 8, 16?

> **Gabarito (retenção):** 31.

**P3.** O que é r em uma PA?

> **Gabarito (retenção):** A razão, passo constante entre termos.

---

# 10. Matrizes e Determinantes

> Ideia-força: Organizar dados em malhas retangulares e operar sobre eles como um único objeto — álgebra em escala

### 1. Ideia Central

Organizar dados em malhas retangulares e operar sobre eles como um único objeto — álgebra em escala

### 2. Pré-requisitos Necessários

- Sistemas de equações.
- Vetores.

### 3. Conceitos-chave

#### Matriz

- **Definição formal:** Tabela retangular de números com m linhas e n colunas.
- **Intuição prática:** É uma planilha que pode ser somada e multiplicada como um número só.
- **Exemplo original:** A = [[1,2],[3,4]] é 2×2.
- **Erro comum:** Multiplicar matrizes 'elemento por elemento' como se fosse soma.

#### Determinante

- **Definição formal:** Escalar que mede o fator de distortion de área/volume de uma transformação.
- **Intuição prática:** Se o determinante é zero, a transformação 'achata' o espaço e perde informação.
- **Exemplo original:** det([[1,2],[3,4]]) = −2.
- **Erro comum:** Achar que determinante existe para matriz não quadrada.

#### Posto

- **Definição formal:** Número de linhas ou colunas linearmente independentes.
- **Intuição prática:** Conta quantas direções realmente 'sobram' depois da transformação.
- **Exemplo original:** A 2×3 pode ter posto no máximo 2.
- **Erro comum:** Confundir posto com número de linhas.

### 4. Teoremas, Leis e Fórmulas

- det(AB) = det(A)·det(B).
- (AB)ᵀ = BᵀAᵀ.
- Teorema de Rouché–Capelli: sistema consistente ⇔ posto(A) = posto(A|b).
- A é invertível ⇔ det(A) ≠ 0.

### 5. Exemplo Resolvido Passo a Passo

1. Resolver o sistema 2x + y = 8; −3x − y = −11.
2. 1) Matriz ampliada: [[2,1,8],[−3,−1,−11]].
3. 2) Some a primeira linha com a segunda: [−1,0,−3] ⇒ x = 3.
4. 3) Substitua: 2·3 + y = 8 ⇒ y = 2.
5. 4) Conferência por SymPy: A.LUsolve(b) devolve (3, 2).

### 6. Conexões Interdisciplinares

Matrizes são a base de transformações gráficas 3D, redes neurais,compressão de imagem e resolução numérica de EDPs.

### 7. Código Funcional (validado)

```python
import sympy as sp
A=sp.Matrix([[2,1],[-3,-1]])
b=sp.Matrix([8,-11])
print(A.LUsolve(b))  # Matrix([3, 2])
```

### 8. Checklist de Domínio

- [ ] Multiplico matrizes respeitando ordem e dimensões.
- [ ] Calculo determinante 2×2 e 3×3.
- [ ] Aplico Rouché–Capelli para classificar sistemas.
- [ ] Sei quando a inversa existe.
- [ ] Verifico soluções por substituição.

### 9. Perguntas de Revisão e Gabarito

**P1.** Toda matriz quadrada é invertível?

> **Gabarito (retenção):** Não; é preciso det ≠ 0.

**P2.** AB = BA sempre?

> **Gabarito (retenção):** Não, multiplicação matricial não é comutativa.

**P3.** O que significa posto zero?

> **Gabarito (retenção):** Todos os elementos são zero; nenhuma direção sobrevive.

---

# 11. Geometria Plana

> Ideia-força: Descrever o espaço plano com poucos axiomas e converter formas em números — área, comprimento e ângulo.

### 1. Ideia Central

Descrever o espaço plano com poucos axiomas e converter formas em números — área, comprimento e ângulo.

### 2. Pré-requisitos Necessários

- Raciocínio lógico.
- Álgebra elementar.

### 3. Conceitos-chave

#### Triângulo

- **Definição formal:** Polígono de três lados cujos ângulos internos somam 180°.
- **Intuição prática:** É a forma mais rígida: três barras cravam um único formato.
- **Exemplo original:**  Ângulos 50°, 60°, 70° somam 180°.
- **Erro comum:** Supor que 'triângulo isósceles' tem todos os lados iguais.

#### Semelhança

- **Definição formal:** Mesma forma, tamanho diferente; lados proporcionais e ângulos iguais.
- **Intuição prática:** É um 'zoom' de uma figura: a proporção não muda.
- **Exemplo original:** Triângulos 3-4-5 e 6-8-10 são semelhantes.
- **Erro comum:** Confundir semelhança com congruência.

#### Teorema de Pitágoras

- **Definição formal:** Em triângulo retângulo, a² + b² = c².
- **Intuição prática:** É a régua para distância em linha reta quando se conhecem os deslocamentos.
- **Exemplo original:** 3² + 4² = 5².
- **Erro comum:** Aplicar a hipotenusa como se fosse cateto.

### 4. Teoremas, Leis e Fórmulas

- Soma dos ângulos internos de um triângulo: 180°.
- Teorema de Pitágoras: a² + b² = c².
- Área do triângulo: A = (b·h)/2; área do círculo: A = πr².
- Em triângulos semelhantes, a razão de áreas é o quadrado da razão de semelhança.

### 5. Exemplo Resolvido Passo a Passo

1. Uma escada de 5 m apoia a parede a 3 m do chão. A que altura ela chega?
2. 1) A escada é a hipotenusa c = 5; a distância na parede é um cateto a = 3.
3. 2) b² = c² − a² = 25 − 9 = 16.
4. 3) b = 4 m.
5. 4) Verificação: 3² + 4² = 9 + 16 = 25 = 5².

### 6. Conexões Interdisciplinares

Geometria plana é a base da trigonometria, da geometria analítica e da computação gráfica 2D.

### 7. Código Funcional (validado)

```python
import math
print(math.sqrt(5**2-3**2))  # 4.0
```

### 8. Checklist de Domínio

- [ ] Identifico a hipotenusa antes de aplicar Pitágoras.
- [ ] Distingo semelhança de congruência.
- [ ] Calculo áreas de figuras compostas.
- [ ] Uso ângulos alternos internos em retas paralelas.
- [ ] Verifico resultados com medidas plausíveis.

### 9. Perguntas de Revisão e Gabarito

**P1.** Quanto mede o terceiro ângulo de um triângulo com 45° e 65°?

> **Gabarito (retenção):** 70°.

**P2.** Se a razão de semelhança é 3, a razão de áreas é?

> **Gabarito (retenção):** 9.

**P3.** Qual a área de um círculo de raio 2?

> **Gabarito (retenção):** 4π.

---

# 12. Geometria Analítica

> Ideia-força: Traduzir geometria em álgebra: pontos viram coordenadas, retas viram equações, distâncias viram fórmulas.

### 1. Ideia Central

Traduzir geometria em álgebra: pontos viram coordenadas, retas viram equações, distâncias viram fórmulas.

### 2. Pré-requisitos Necessários

- Geometria plana.
- Equações.
- Funções.

### 3. Conceitos-chave

#### Distância entre pontos

- **Definição formal:** d = √((x₂−x₁)² + (y₂−y₁)²).
- **Intuição prática:** É Pitágoras aplicado a um deslocamento horizontal e outro vertical.
- **Exemplo original:** Entre (0,0) e (3,4): d = 5.
- **Erro comum:** Trocar a ordem das coordenadas y.

#### Ponto médio

- **Definição formal:** M = ((x₁+x₂)/2, (y₁+y₂)/2).
- **Intuição prática:** É a média das coordenadas, o 'centro' do segmento.
- **Exemplo original:** M entre (2,4) e (6,10) é (4,7).
- **Erro comum:** Dividir apenas uma coordenada por 2.

#### Equação da reta

- **Definição formal:** y = mx + b, onde m é a inclinação e b é a ordenada na origem.
- **Intuição prática:** m diz o quanto se sobe ao andar uma unidade para a direita.
- **Exemplo original:** y = 2x − 3 tem m = 2 e b = −3.
- **Erro comum:** Confundir m com o ângulo em graus.

### 4. Teoremas, Leis e Fórmulas

- Distância: d = √((x₂−x₁)² + (y₂−y₁)²).
- Inclinação entre dois pontos: m = (y₂−y₁)/(x₂−x₁).
- Retas paralelas: m₁ = m₂; perpendiculares: m₁·m₂ = −1.
- Equação da circunferência: (x−a)² + (y−b)² = r².

### 5. Exemplo Resolvido Passo a Passo

1. Encontrar a equação da reta que passa por (1,5) e (3,9).
2. 1) m = (9−5)/(3−1) = 4/2 = 2.
3. 2) Substitua (1,5): 5 = 2·1 + b ⇒ b = 3.
4. 3) Reta: y = 2x + 3.
5. 4) Verifique o segundo ponto: 2·3+3 = 9.

### 6. Conexões Interdisciplinares

Geometria analítica é usada em visão computacional, robótica e na parametrização de curvas em CG.

### 7. Código Funcional (validado)

```python
print(((3-0)**2+(4-0)**2)**0.5)  # 5.0
```

### 8. Checklist de Domínio

- [ ] Calculo distância e ponto médio sem errar.
- [ ] Encontro a equação da reta a partir de dois pontos.
- [ ] Distingo retas paralelas e perpendiculares.
- [ ] Escrevo a equação da circunferência.
- [ ] Interpreto geometricamente o sinal de m.

### 9. Perguntas de Revisão e Gabarito

**P1.** Qual a inclinação da reta y = −3x + 1?

> **Gabarito (retenção):** −3.

**P2.** Duas retas perpendiculares têm inclinações com que relação?

> **Gabarito (retenção):** Produto igual a −1.

**P3.** Qual a distância entre (1,1) e (4,5)?

> **Gabarito (retenção):** 5.

---

# 13. Geometria Espacial

> Ideia-força: Elevar a geometria ao três eixos, entendendo como retas e planos se cruzam no espaço.

### 1. Ideia Central

Elevar a geometria ao três eixos, entendendo como retas e planos se cruzam no espaço.

### 2. Pré-requisitos Necessários

- Geometria plana.
- Vetores.

### 3. Conceitos-chave

#### Plano

- **Definição formal:** Superfície plana infinita determinada por três pontos não colineares.
- **Intuição prática:** É uma folha sem bordas que corta o espaço.
- **Exemplo original:** Três pontos da mesa determinam o plano da mesa.
- **Erro comum:** Achar que duas retas no espaço sempre se cruzam.

#### Volume

- **Definição formal:** Medida da região ocupada por um sólido.
- **Intuição prática:** É 'quantos cubos de 1 cm cabem dentro'.
- **Exemplo original:** Cubo de aresta 3 tem volume 27.
- **Erro comum:** Usar unidade de área onde seria volume.

#### Posições relativas

- **Definição formal:** Retas podem ser paralelas, concorrentes ou reversas; retas e planos podem ser paralelos, secantes ou contidos.
- **Intuição prática:** É classificar 'como duas coisas se encontram' no espaço.
- **Exemplo original:** Duas retas reversas não estão em um mesmo plano.
- **Erro comum:** Chamar 'paralelas' a retas que apenas não se tocam mas estão em planos diferentes.

### 4. Teoremas, Leis e Fórmulas

- Volume do cubo: V = a³; do paralelepípedo: V = a·b·c.
- Volume da esfera: V = (4/3)πr³; área superficial: S = 4πr².
- Distância de ponto a plano via produto escalar com a normal.

### 5. Exemplo Resolvido Passo a Passo

1. Calcular o volume de uma caixa 4 cm × 5 cm × 6 cm.
2. 1) Paralelepípedo retângulo: V = a·b·c.
3. 2) V = 4·5·6 = 120 cm³.
4. 3) Se dobrássemos todas as medidas, o volume seria 8× maior: 960 cm³.
5. 4) Verificação dimensional: cm·cm·cm = cm³.

### 6. Conexões Interdisciplinares

Geometria espacial aparece em CAD, modelagem 3D, arquitetura e em álgebra linear (produto escalar/vetorial).

### 7. Código Funcional (validado)

```python
a,b,c=4,5,6
print(a*b*c, (2*a)*(2*b)*(2*c))  # 120 960
```

### 8. Checklist de Domínio

- [ ] Classifico corretamente retas e planos no espaço.
- [ ] Calculo volumes e áreas de sólidos comuns.
- [ ] Sei usar o produto escalar para ângulos.
- [ ] Respeito as unidades (cm² vs cm³).
- [ ] Visualizo cortes transversais de sólidos.

### 9. Perguntas de Revisão e Gabarito

**P1.** Qual o volume de uma esfera de raio 3?

> **Gabarito (retenção):** 36π.

**P2.** Retas reversas são paralelas?

> **Gabarito (retenção):** Não; não são coplanares.

**P3.** Quantos pontos determinam um plano?

> **Gabarito (retenção):** Três não colineares.

---

# 14. Análise Combinatória

> Ideia-força: Contar sem listar — transformar 'quantas possibilidades?' em fórmulas confiáveis.

### 1. Ideia Central

Contar sem listar — transformar 'quantas possibilidades?' em fórmulas confiáveis.

### 2. Pré-requisitos Necessários

- Produto cartesiano.
- Fatorial.

### 3. Conceitos-chave

#### Princípio multiplicativo

- **Definição formal:** Se uma tarefa tem a etapas independentes com nᵢ escolhas, o total é o produto dos nᵢ.
- **Intuição prática:** É o 'cardápio': 3 bebidas × 4 pratos = 12 combinações.
- **Exemplo original:** Camisetas em 5 cores e 3 tamanhos ⇒ 15 opções.
- **Erro comum:** Somar quando deveria multiplicar.

#### Permutação com repetição

- **Definição formal:** n!/(n₁!·n₂!·…·nₖ!) quando há elementos iguais.
- **Intuição prática:** É dividir para descontar as cópias que não são distinguishable.
- **Exemplo original:**  PALAVRA tem 7 letras com A repetido 3 vezes.
- **Erro comum:** Esquecer de dividir pelo fatorial das repetições.

#### Combinação

- **Definição formal:** C(n,k) = n!/(k!(n−k)!) — escolher k elementos sem importar a ordem.
- **Intuição prática:** É montar um time: a ordem de escolha não muda o time.
- **Exemplo original:** C(5,2) = 10 duplas.
- **Erro comum:** Usar arranjo quando a ordem não importa.

### 4. Teoremas, Leis e Fórmulas

- A(n,k) = n!/(n−k)!; C(n,k) = n!/(k!(n−k)!).
- C(n,k) = C(n,n−k).
- Binômio de Newton: (a+b)ⁿ = ∑ₖ C(n,k)·aⁿ⁻ᵏ·bᵏ.
- Princípio da Inclusão–Exclusão para união de conjuntos.

### 5. Exemplo Resolvido Passo a Passo

1. Quantos grupos de 3 pessoas podem ser formados entre 8 alunos?
2. 1) A ordem dentro do grupo não importa ⇒ combinação.
3. 2) C(8,3) = 8!/(3!·5!) = (8·7·6)/(3·2·1) = 56.
4. 3) Verificação: Python math.comb(8,3) = 56.
5. 4) Se houvesse presidente, vice e tesoureiro, seria A(8,3) = 336.

### 6. Conexões Interdisciplinares

Combinatória é a espinha dorsal da probabilidade, da teoria dos grafos e da análise de complexidade de algoritmos de busca.

### 7. Código Funcional (validado)

```python
import math
print(math.comb(8,3), math.perm(8,3))  # 56 336
```

### 8. Checklist de Domínio

- [ ] Distingo arranjo de combinação pelo critério da ordem.
- [ ] Sei contar com repetição e sem repetição.
- [ ] Aplico inclusão–exclusão em problemas de 'pelo menos'.
- [ ] Verifico contagens pequenas por listagem.
- [ ] Uso o binômio de Newton com segurança.

### 9. Perguntas de Revisão e Gabarito

**P1.** C(10,8) é igual a quê?

> **Gabarito (retenção):** C(10,2) = 45.

**P2.** Quantas senhas de 3 dígitos distintos existem?

> **Gabarito (retenção):** A(10,3) = 720.

**P3.** Quando dividir por k!?

> **Gabarito (retenção):** Quando a ordem não importa.

---

# 15. Probabilidade

> Ideia-força: Quantificar incerteza com regras claras: contar casos favoráveis e comparar com o espaço amostral.

### 1. Ideia Central

Quantificar incerteza com regras claras: contar casos favoráveis e comparar com o espaço amostral.

### 2. Pré-requisitos Necessários

- Combinatória.
- Conjuntos.

### 3. Conceitos-chave

#### Espaço amostral

- **Definição formal:** Conjunto de todos os resultados possíveis de um experimento.
- **Intuição prática:** É o 'universo' de desfechos antes de qualquer sorteio.
- **Exemplo original:** Moeda: {C, T}; dado: {1,…,6}.
- **Erro comum:** Atribuir probabilidades que não somam 1.

#### Probabilidade condicional

- **Definição formal:** P(A|B) = P(A∩B)/P(B), com P(B) > 0.
- **Intuição prática:** É recalcular o mundo depois de receber uma informação nova.
- **Exemplo original:** P(par | >3) em dado justo = 1/3.
- **Erro comum:** Trocar P(A|B) por P(B|A).

#### Independência

- **Definição formal:** A e B são independentes se P(A∩B) = P(A)·P(B).
- **Intuição prática:** Um resultado não 'lembra' do outro.
- **Exemplo original:** Dois lançamentos de moeda são independentes.
- **Erro comum:** Confundir independência com eventos mutuamente exclusivos.

### 4. Teoremas, Leis e Fórmulas

- Axiomas de Kolmogorov: P ≥ 0, P(Ω) = 1, aditividade para eventos disjuntos.
- P(A∪B) = P(A) + P(B) − P(A∩B).
- Teorema de Bayes: P(A|B) = P(B|A)·P(A)/P(B).

### 5. Exemplo Resolvido Passo a Passo

1. Em uma turma, 60% estudam matemática, 50% estudam física e 30% estudam ambos. Qual a probabilidade de estudar pelo menos uma?
2. 1) P(M∪F) = 0,60 + 0,50 − 0,30 = 0,80.
3. 2) Logo 80% estudam pelo menos uma das duas.
4. 3) P(neither) = 1 − 0,80 = 0,20.
5. 4) Verificação por contagem com 100 alunos: 60+50−30 = 80.

### 6. Conexões Interdisciplinares

Probabilidade alimenta estatística inferencial, machine learning, precificação de risco e criptografia (modelos de aleatoriedade).

### 7. Código Funcional (validado)

```python
P_M,P_F,P_both=0.6,0.5,0.3
print(P_M+P_F-P_both)  # 0.8
```

### 8. Checklist de Domínio

- [ ] Verifico se os eventos são independentes antes de multiplicar.
- [ ] Não confundo 'ou' com 'e'.
- [ ] Aplico Bayes com hierarquia clara.
- [ ] Uso combinatória para contar o espaço amostral.
- [ ] Checo se as probabilidades somam 1.

### 9. Perguntas de Revisão e Gabarito

**P1.** Se P(A)=0,4 e P(B)=0,5 e são independentes, quanto é P(A∩B)?

> **Gabarito (retenção):** 0,20.

**P2.** O que é P(Aᶜ)?

> **Gabarito (retenção):** 1 − P(A).

**P3.** Mutuamente exclusivos são independentes?

> **Gabarito (retenção):** Em geral não (salvo casos degenerados).

---

# 16. Estatística

> Ideia-força: Resumir muitos dados em poucos números e decidir o que eles realmente dizem.

### 1. Ideia Central

Resumir muitos dados em poucos números e decidir o que eles realmente dizem.

### 2. Pré-requisitos Necessários

- Probabilidade.
- Aritmética.

### 3. Conceitos-chave

#### Média

- **Definição formal:** Soma dos valores dividida pela quantidade de observações.
- **Intuição prática:** É o 'ponto de equilíbrio' dos dados.
- **Exemplo original:** Média de 2, 4, 6 é 4.
- **Erro comum:** Achar que a média sempre representa bem dados com outliers.

#### Mediana

- **Definição formal:** Valor central após ordenar os dados.
- **Intuição prática:** É o 'meio da fila', resiste a valores extremos.
- **Exemplo original:** Em 1, 2, 100 a mediana é 2.
- **Erro comum:** Esquecer de ordenar antes de escolher.

#### Desvio padrão

- **Definição formal:** Raiz da variância: measure de dispersão em torno da média.
- **Intuição prática:** É o 'tamanho típico do erro' em relação à média.
- **Exemplo original:** Dados 2 e 8 têm desvio 3.
- **Erro comum:** Confundir variância com desvio padrão.

### 4. Teoremas, Leis e Fórmulas

- Média: x̄ = (∑xᵢ)/n.
- Variância: Var(X) = E[X²] − (E[X])².
- Desvio padrão: σ = √Var(X).
- Teorema Central do Limite: médias amostrais tendem à normal quando n cresce.

### 5. Exemplo Resolvido Passo a Passo

1. Calcular média e mediana de 4, 7, 7, 9, 20.
2. 1) Média = (4+7+7+9+20)/5 = 47/5 = 9,4.
3. 2) Ordenados: 4, 7, 7, 9, 20 ⇒ mediana = 7.
4. 3) O valor 20 puxa a média para cima; a mediana mostra o 'típico'.
5. 4) Conclusão: relatar as duas medidas é mais honesto.

### 6. Conexões Interdisciplinares

Estatística sustenta inferência científica, controle de qualidade, A/B testing e análise de experimentos.

### 7. Código Funcional (validado)

```python
import statistics as s
print(s.mean([4,7,7,9,20]), s.median([4,7,7,9,20]))  # 9.4 7
```

### 8. Checklist de Domínio

- [ ] Escolho a medida de tendência central adequada.
- [ ] Calculo variância e desvio padrão.
- [ ] Identifico outliers e seu efeito.
- [ ] Interpreto o desvio em unidades dos dados.
- [ ] Não confundo amostra com população.

### 9. Perguntas de Revisão e Gabarito

**P1.** Qual a mediana de 1, 3, 3, 9?

> **Gabarito (retenção):** 3 (média dos dois centrais).

**P2.** O que mede o desvio padrão?

> **Gabarito (retenção):** Dispersão em torno da média.

**P3.** A média é sempre melhor que a mediana?

> **Gabarito (retenção):** Não; depende dos outliers.

---

# 17. Matemática Financeira

> Ideia-força: Traduzir dinheiro no tempo em juros, percentuais e séries de pagamentos.

### 1. Ideia Central

Traduzir dinheiro no tempo em juros, percentuais e séries de pagamentos.

### 2. Pré-requisitos Necessários

- Porcentagem.
- Sequências geométricas.

### 3. Conceitos-chave

#### Juros simples

- **Definição formal:** J = P·i·t; montante M = P(1 + i·t).
- **Intuição prática:** O juro incide sempre sobre o capital inicial.
- **Exemplo original:** R$ 1000 a 2% a.m. por 6 meses ⇒ M = 1120.
- **Erro comum:** Aplicar juros simples em prazo longo sem perceber a diferença.

#### Juros compostos

- **Definição formal:** M = P(1 + i)ⁿ.
- **Intuição prática:** O juro do mês seguinte incide sobre o montante anterior: efeito bola de neve.
- **Exemplo original:** R$1000 a 2% a.m. em 6 meses ⇒ ≈1126,16.
- **Erro comum:** Somar juros em vez de multiplicar.

#### Percentual

- **Definição formal:** p% de x = x·p/100.
- **Intuição prática:** É uma fração com denominador escondido 100.
- **Exemplo original:** 15% de 80 = 12.
- **Erro comum:** Aplicar o percentual sobre o valor já aumentado.

### 4. Teoremas, Leis e Fórmulas

- Juros simples: M = P(1 + it).
- Juros compostos: M = P(1+i)ⁿ.
- Taxa equivalente: (1+i) = (1+iₘ)ᵐ.

### 5. Exemplo Resolvido Passo a Passo

1. Comparar R$1000 a 2% a.m. por 6 meses nos dois regimes.
2. 1) Simples: 1000(1 + 0,02·6) = 1120.
3. 2) Composto: 1000(1,02)⁶ ≈ 1126,16.
4. 3) Diferença: ≈ 6,16 a mais no regime composto.
5. 4) Verificação: 1,02⁶ ≈ 1,126162.

### 6. Conexões Interdisciplinares

Matemática financeira conecta PGs, logaritmos e modelagem de risco; é base de engenharia financeira.

### 7. Código Funcional (validado)

```python
print(1000*(1+0.02*6), 1000*(1.02)**6)  # 1120.0  1126.1624...
```

### 8. Checklist de Domínio

- [ ] Distingo juros simples de compostos.
- [ ] Resolvo a fórmula para qualquer variável.
- [ ] Converto taxas de período.
- [ ] Uso logaritmos para descobrir prazo.
- [ ] Arredondo apenas no final.

### 9. Perguntas de Revisão e Gabarito

**P1.** Quanto rende R$500 a 10% a.a. por 2 anos (simples)?

> **Gabarito (retenção):** R$600.

**P2.** Por que compostos rendem mais?

> **Gabarito (retenção):** Porque incidem sobre juros acumulados.

**P3.** Como achar o prazo em juros compostos?

> **Gabarito (retenção):** Com logaritmos: n = log(M/P)/log(1+i).

---

# 18. Limites

> Ideia-força: Perguntar 'para onde a função caminha?' em vez de 'qual é o valor neste ponto?' — a ideia que destrava o cálculo.

### 1. Ideia Central

Perguntar 'para onde a função caminha?' em vez de 'qual é o valor neste ponto?' — a ideia que destrava o cálculo.

### 2. Pré-requisitos Necessários

- Funções.
- Álgebra.

### 3. Conceitos-chave

#### Limite

- **Definição formal:** Valor que f(x) se aproxima quando x se aproxima de a (por um dos lados ou ambos).
- **Intuição prática:** É observar a tendência do ponteiro, não onde ele está parado.
- **Exemplo original:** lim(x→2) (x²−4)/(x−2) = 4.
- **Erro comum:** Substituir x = a diretamente e desistir ao encontrar 0/0.

#### Indeterminação

- **Definição formal:** Formas como 0/0, ∞/∞, ∞−∞ que não permitem conclusão imediata.
- **Intuição prática:** É um 'sinal de pare' que exige manipulação:
- **Exemplo original:** Em (x²−4)/(x−2), fatorar (x−2)(x+2).
- **Erro comum:** Tratar 0/0 como zero.

#### Continuidade

- **Definição formal:** f é contínua em a quando lim(x→a) f(x) = f(a).
- **Intuição prática:** É poder desenhar o gráfico sem levantar a caneta.
- **Exemplo original:** Polinômios são contínuos em todo ponto.
- **Erro comum:** Confundir 'limite existe' com 'função contínua'.

### 4. Teoremas, Leis e Fórmulas

- lim(x→a) [f(x) ± g(x)] = lim f ± lim g, quando os limites existem.
- lim(x→a) (xⁿ − aⁿ)/(x − a) = n·aⁿ⁻¹.
- lim(x→0) sen(x)/x = 1 (em radianos).

### 5. Exemplo Resolvido Passo a Passo

1. Calcular lim(x→2) (x² − 4)/(x − 2).
2. 1) Substituição direta gera 0/0.
3. 2) Fatore o numerador: (x−2)(x+2).
4. 3) Cancele (x−2), restando x + 2 (para x ≠ 2).
5. 4) lim(x→2) x + 2 = 4.
6. 5) Conferência numérica: f(1,999) ≈ 3,999.

### 6. Conexões Interdisciplinares

Limites fundam derivadas, integrais, análise de algoritmos assintótica e modelagem de sistemas físicos.

### 7. Código Funcional (validado)

```python
import sympy as sp
x=sp.symbols('x')
print(sp.limit((x**2-4)/(x-2),x,2))  # 4
```

### 8. Checklist de Domínio

- [ ] Reconheço indeterminações e sei contorná-las.
- [ ] Calculo limites laterais quando necessário.
- [ ] Diferencio limite de valor da função.
- [ ] Uso fatoração e racionalização.
- [ ] Verifico com SymPy e com valores próximos.

### 9. Perguntas de Revisão e Gabarito

**P1.** Quanto é lim(x→0) sen(x)/x?

> **Gabarito (retenção):** 1.

**P2.** Se o limite lateral esquerdo difere do direito, o limite existe?

> **Gabarito (retenção):** Não.

**P3.** Toda função contínua possui limite no ponto?

> **Gabarito (retenção):** Sim, e ele é igual a f(a).

---

# 19. Derivadas

> Ideia-força: Medir a taxa instantânea de variação — a velocidade do velocímetro sem parar o tempo.

### 1. Ideia Central

Medir a taxa instantânea de variação — a velocidade do velocímetro sem parar o tempo.

### 2. Pré-requisitos Necessários

- Limites.
- Funções.

### 3. Conceitos-chave

#### Derivada

- **Definição formal:** f′(x) = lim(Δx→0) [f(x+Δx) − f(x)]/Δx.
- **Intuição prática:** É inclinação da reta tangente quando o intervalo vira um ponto.
- **Exemplo original:** Se s(t)=t², v(t)=2t.
- **Erro comum:** Calcular (f(x+0)−f(x))/0 diretamente.

#### Regra da cadeia

- **Definição formal:** Se y = f(g(x)), então y′ = f′(g(x))·g′(x).
- **Intuição prática:** É multiplicar as velocidades de cada 'engrenagem' da composição.
- **Exemplo original:** d/dx sen(x²) = 2x·cos(x²).
- **Erro comum:** Esquecer o fator interno g′(x).

#### Otimização

- **Definição formal:** Pontos críticos ocorrem onde f′(x)=0 ou não existe.
- **Intuição prática:** É encontrar o topo do morro onde o chão fica horizontal.
- **Exemplo original:** Maximizar área com perímetro fixo.
- **Erro comum:** Assumir que todo ponto crítico é máximo.

### 4. Teoremas, Leis e Fórmulas

- Regra do produto: (fg)′ = f′g + fg′.
- Regra do quociente: (f/g)′ = (f′g − fg′)/g².
- Teorema Fundamental do Cálculo (parte 1): d/dx ∫ₐˣ f(t)dt = f(x).

### 5. Exemplo Resolvido Passo a Passo

1. Encontrar a velocidade de s(t) = t³ − 6t no instante t = 2.
2. 1) v(t) = s′(t) = 3t² − 6.
3. 2) v(2) = 3·4 − 6 = 6 m/s.
4. 3) Aceleração: a(t) = 6t ⇒ a(2) = 12 m/s².
5. 4) Verificação por diferenças: [s(2,001)−s(2)]/0,001 ≈ 6,012.

### 6. Conexões Interdisciplinares

Derivadas comandam otimização em engenharia, backpropagation em redes neurais e equações diferenciais em física.

### 7. Código Funcional (validado)

```python
import sympy as sp
t=sp.symbols('t')
s=t**3-6*t
print(sp.diff(s,t), sp.diff(s,t).subs(t,2))  # 3*t**2 - 6  6
```

### 8. Checklist de Domínio

- [ ] Aplico as regras de derivação em composições.
- [ ] Interpreto a derivada como inclinação e como taxa.
- [ ] Classifico pontos críticos com a 2ª derivada.
- [ ] Resolvo problemas de otimização.
- [ ] Verifico com SymPy.

### 9. Perguntas de Revisão e Gabarito

**P1.** Qual a derivada de x⁵?

> **Gabarito (retenção):** 5x⁴.

**P2.** O que significa f′(a) = 0?

> **Gabarito (retenção):** Reta tangente horizontal em a.

**P3.** Por que a regra da cadeia tem dois fatores?

> **Gabarito (retenção):** Porque a saída depende de duas taxas encadeadas.

---

# 20. Integrais

> Ideia-força: Somar infinitas fatias minúsculas para recuperar um todo — o caminho inverso da derivada.

### 1. Ideia Central

Somar infinitas fatias minúsculas para recuperar um todo — o caminho inverso da derivada.

### 2. Pré-requisitos Necessários

- Derivadas.
- Somas.

### 3. Conceitos-chave

#### Integral definida

- **Definição formal:** ∫ₐᵇ f(x)dx = lim(N→∞) ∑ f(xᵢ)·Δx.
- **Intuição prática:** É somar a área de retângulos cada vez mais finos.
- **Exemplo original:** ∫₀¹ x dx = 1/2.
- **Erro comum:** Esquecer o diferencial dx.

#### Integral indefinida

- **Definição formal:** Conjunto de primitivas F com F′ = f, escrito F(x) + C.
- **Intuição prática:** É 'desfazer' uma derivada, com uma constante livre.
- **Exemplo original:** ∫2x dx = x² + C.
- **Erro comum:** Esquecer a constante C.

#### Teorema Fundamental

- **Definição formal:** ∫ₐᵇ f(x)dx = F(b) − F(a).
- **Intuição prática:** É a ponte que transforma soma infinita em duas substituições.
- **Exemplo original:** ∫₀² 3x² dx = 8.
- **Erro comum:** Aplicar o teorema sem conferir continuidade.

### 4. Teoremas, Leis e Fórmulas

- ∫ₐᵇ f(x)dx = F(b) − F(a), com F′ = f.
- Integração por partes: ∫u dv = uv − ∫v du.
- Substituição: ∫f(g(x))g′(x)dx = ∫f(u)du.

### 5. Exemplo Resolvido Passo a Passo

1. Calcular ∫₀² 3x² dx.
2. 1) Primitiva: F(x) = x³.
3. 2) F(2) − F(0) = 8 − 0 = 8.
4. 3) Interpretação: área sob a parábola y=3x² entre 0 e 2.
5. 4) Conferência por soma de Riemann com 1000 retângulos ≈ 7,99.

### 6. Conexões Interdisciplinares

Integrais calculam áreas, volumes, centros de massa, trabalho físico e probabilidades contínuas.

### 7. Código Funcional (validado)

```python
import sympy as sp
x=sp.symbols('x')
print(sp.integrate(3*x**2,(x,0,2)))  # 8
```

### 8. Checklist de Domínio

- [ ] Diferencio integral definida de indefinida.
- [ ] Lembro a constante C nas primitivas.
- [ ] Aplico substituição e partes.
- [ ] Interpreto o resultado como área assinada.
- [ ] Verifico com SymPy.

### 9. Perguntas de Revisão e Gabarito

**P1.** Quanto é ∫₀¹ x² dx?

> **Gabarito (retenção):** 1/3.

**P2.** Por que aparece +C?

> **Gabarito (retenção):** Porque a derivada de uma constante é zero.

**P3.** O que o Teorema Fundamental conecta?

> **Gabarito (retenção):** Derivada e integral.


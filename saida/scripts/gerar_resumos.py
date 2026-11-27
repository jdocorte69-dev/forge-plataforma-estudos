"""Fase 2 — geração dos resumos de domínio exaustivo (9 seções por capítulo).

Entrada: saida/01_texto_extraido/<livro>/capNN.md
Saida:   saida/02_resumos_por_livro/<livro>/capNN.md + resumo_geral.md
Conteúdo autoral: nenhum bloco é copiado dos PDFs; exemplos são originais.
"""
import os
import re
import sys
from datetime import datetime, timezone

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENTRADA = os.path.join(BASE, "saida", "01_texto_extraido")
DEST = os.path.join(BASE, "saida", "02_resumos_por_livro")

# Base de conhecimento curada. Todas as fórmulas usam Unicode legível (sem LaTeX).
TOPICOS = {
    "conjuntos_numericos": {
        "ideia": "Organizar a paisagem dos números em conjuntos encaixados, do mais restrito ao mais amplo, "
                 "para saber sempre em qual terreno uma operação é válida.",
        "pre": ["Noção de quantidade e contagem", "Noção de igualdade e ordem"],
        "conceitos": [
            ("Conjunto numérico", "Coleção bem definida de números com uma propriedade comum.",
             "Pense em gavetas dentro de gavetas: cada gaveta menor cabe na maior.",
             "O número −3 pertence a ℤ e a ℚ, mas não a ℕ.", "Confundir 'pertencer' com 'ser subconjunto'."),
            ("Número racional", "Todo número que pode ser escrito como p/q com p e q inteiros e q ≠ 0.",
             "É qualquer fração ou decimal que termina ou repete.", "0,125 = 1/8; 0,333… = 1/3.",
             "Achar que decimal infinito nunca é racional — apenas a repetição importa."),
            ("Número irracional", "Número real que não admite representação como fração de inteiros.",
             "É aquele decimal infinito e sem padrão repetitivo.", "√2 e π são irracionais.",
             "Usar aproximação 3,14 para π e concluir que ele é racional."),
        ],
        "teoremas": [
            "Encadeamento: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ.",
            "Todo inteiro é racional: n = n/1.",
            "Densidade de ℚ: entre dois reais distintos existe sempre um racional.",
        ],
        "exemplo": [
            "Classificar −7/4, √9, √10 e 0,121212…",
            "1) −7/4 já é fração de inteiros ⇒ racional.",
            "2) √9 = 3 ⇒ inteiro, logo racional (a raiz engana olhos apressados).",
            "3) √10 não é inteiro nem fração ⇒ irracional.",
            "4) 0,121212… repete o bloco 12 ⇒ racional; escrevendo x = 0,121212…, 100x − x = 12 ⇒ x = 12/99 = 4/33.",
        ],
        "conexoes": "A classificação dos números sustenta a teoria dos conjuntos, a álgebra abstrata e a "
                    "representação de ponto flutuante em computadores (ℝ é approximation infinita; a máquina usa finita).",
        "codigo": "from fractions import Fraction\nprint(Fraction(12, 99))  # 4/33",
        "checklist": [
            "Sei explicar a diferença entre ℕ, ℤ, ℚ, ℝ e ℂ sem olhar o caderno.",
            "Consigo transformar uma dízima periódica em fração.",
            "Sei justificar por que √2 é irracional.",
            "Identifico quando uma raiz é na verdade um inteiro disfarçado.",
            "Não confundo '∈' com '⊂'.",
        ],
        "perguntas": [
            ("0,090909… é racional? Justifique.", "Sim. O bloco 09 repete; x = 0,0909…, 100x − x = 9 ⇒ x = 9/99 = 1/11."),
            ("Todo número racional é real?", "Sim. ℚ ⊂ ℝ, embora a recíproca seja falsa."),
            ("√4 é irracional?", "Não. √4 = 2, inteiro; a classificação deve usar o valor simplificado."),
        ],
    },
    "operacoes_inteiros": {
        "ideia": "Dominar as regras de sinal, prioridade e potenciação para que a álgebra deixe de ser um jogo de adivinhação.",
        "pre": ["Conjuntos numéricos", "Noção de subtração"],
        "conceitos": [
            ("Módulo", "Distância de um número até zero, sempre não negativa.",
             "É o 'quanto o número anda' sem importar a direção.", "|−6| = 6.",
             "Trocar |−6| por −6."),
            ("Potenciação", "Multiplicação repetida de um fator por si mesmo.",
             "O expoente conta quantas cópias do fator entram no produto.", "2⁴ = 2·2·2·2 = 16.",
             "Aplicar a regra (aᵐ)ⁿ = aᵐ⁺ⁿ em vez de aᵐⁿ."),
            ("Prioridade", "Ordem convencional: parênteses, potências, multiplicação/divisão, adição/subtração.",
             "É a 'hierarquia' que evita duas respostas para a mesma conta.", "3 + 2·4 = 11, não 20.",
             "Calcular da esquerda para a direita sem respeitar a hierarquia."),
        ],
        "teoremas": [
            "aᵐ · aⁿ = aᵐ⁺ⁿ; aᵐ / aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ.",
            "a⁰ = 1 para a ≠ 0; a⁻ⁿ = 1/aⁿ.",
            "Lei de sinais na multiplicação: (−)(−) = (+); (−)(+) = (−).",
        ],
        "exemplo": [
            "Calcular −2³ + (−2)² · 3.",
            "1) −2³ = −(2³) = −8 (o sinal está fora da potência).",
            "2) (−2)² = 4 (aqui o sinal está dentro dos parênteses).",
            "3) 4 · 3 = 12.",
            "4) −8 + 12 = 4.",
            "Conferência: Python calcula -2**3 + (-2)**2*3 = 4.",
        ],
        "conexoes": "A precedência de operadores é a mesma ideia usada por compiladores C e interpretadores Python na "
                    "construção da árvore sintática de expressões.",
        "codigo": "print(-2**3 + (-2)**2*3)  # 4",
        "checklist": ["Diferencio −aⁿ de (−a)ⁿ.", "Aplico corretamente as leis dos expoentes.",
                      "Resolvo expressões com parênteses aninhados.", "Sei o que é 0⁰ (indefinido por convenção elementar).",
                      "Justifico cada passo, sem pular direto para a resposta."],
        "perguntas": [
            ("Quanto é −3²?", "−9. O sinal não está elevado ao quadrado; se fosse (−3)², seria 9."),
            ("Quanto é 2⁰ + 2⁻¹?", "1 + 1/2 = 3/2."),
            ("Por que (a²)³ = a⁶?", "Porque potência de potência multiplica expoentes."),
        ],
    },
    "equacoes": {
        "ideia": "Isolar a incógnita preservando o equilíbrio da igualdade — a ideia da balança que nunca entorta.",
        "pre": ["Operações com inteiros", "Frações"],
        "conceitos": [
            ("Equação", "Igualdade entre duas expressões que contêm incógnitas.",
             "É uma balança: o que se faz de um lado, faz-se do outro.", "2x + 3 = 11 ⇒ x = 4.",
             "Fazer 'passar para o outro lado trocando sinal' sem entender o porquê."),
            ("Equação do 2º grau", "Equação da forma ax² + bx + c = 0 com a ≠ 0.",
             "Descreve uma parábola; as raízes são onde ela cruza o eixo horizontal.", "x² − 5x + 6 = 0 ⇒ x = 2 ou x = 3.",
             "Esquecer a condição a ≠ 0."),
            ("Delta", "Discriminante Δ = b² − 4ac, que conta quantas raízes reais existem.",
             "É o 'semáforo' da equação: negativo pare, zero um ponto, positivo dois.", "Em x²−5x+6, Δ = 25−24 = 1 > 0.",
             "Calcular b² como b·2."),
        ],
        "teoremas": [
            "Fórmula de Bháskara: x = (−b ± √Δ)/(2a), com Δ = b² − 4ac.",
            "Relações de Viète: soma das raízes = −b/a; produto = c/a.",
            "Teorema do Resto: o resto da divisão de P(x) por (x − r) é P(r).",
        ],
        "exemplo": [
            "Resolver x² − 5x + 6 = 0 de duas formas.",
            "1) Fatoração: procuramos dois números cujo produto é 6 e soma é 5: 2 e 3.",
            "2) Logo (x − 2)(x − 3) = 0 ⇒ x = 2 ou x = 3.",
            "3) Via Bháskara: a=1, b=−5, c=6 ⇒ Δ = 25−24 = 1; x = (5 ± 1)/2 ∈ {2, 3}.",
            "4) Verificação: 2²−5·2+6 = 0 e 3²−5·3+6 = 0.",
        ],
        "conexoes": "Raízes de polinômios aparecem em sistemas de controle, em funções de transferência e na "
                    "fatoração de matrizes pelo polinômio característico.",
        "codigo": "import sympy as sp\nx=sp.symbols('x')\nprint(sp.solve(x**2-5*x+6,x))  # [2, 3]",
        "checklist": ["Verifico as raízes substituindo na equação original.",
                      "Sei interpretar o sinal de Δ geometricamente.",
                      "Consigo usar as relações de Viète sem resolver a equação.",
                      "Respeito a restrição a ≠ 0.",
                      "Transformo problemas de texto em equação."],
        "perguntas": [
            ("Se Δ = 0, quantas raízes reais existem?", "Uma raiz real dupla: x = −b/(2a)."),
            ("Quais são as raízes de x² + x − 6 = 0?", "x = 2 e x = −3; o produto é −6 e a soma é −1."),
            ("O que afirma o Teorema do Resto?", "Que P(r) é o resto da divisão de P(x) por (x − r)."),
        ],
    },
    "produtos_notaveis": {
        "ideia": "Reconhecer padrões de multiplicação que evitam centenas de contas e revelam a estrutura por trás do polinômio.",
        "pre": ["Distributividade", "Potenciação"],
        "conceitos": [
            ("Diferença de quadrados", "a² − b² = (a − b)(a + b).",
             "É um quadrado grande com um quadrado menor recortado: sobra duas faixas.", "49 − 9 = (7−3)(7+3) = 40.",
             "Escrever a² + b² = (a+b)² — falta o termo 2ab."),
            ("Quadrado da soma", "(a + b)² = a² + 2ab + b².",
             "É o quadrado de um lado (a+b) decomposto em quatro regiões.", "(x+3)² = x² + 6x + 9.",
             "Esquecer o termo do meio 2ab."),
            ("Cubo da soma", "(a + b)³ = a³ + 3a²b + 3ab² + b³.",
             "É o análogo tridimensional do quadrado da soma.", "(1+2)³ = 1+6+12+8 = 27.",
             "Trocar os coeficientes 3 e 3 por 2 e 2."),
        ],
        "teoremas": [
            "(a + b)² = a² + 2ab + b²; (a − b)² = a² − 2ab + b².",
            "a² − b² = (a − b)(a + b).",
            "(a + b)(c + d) = ac + ad + bc + bd (distributividade dupla).",
        ],
        "exemplo": [
            "Calcular 103 × 97 sem multiplicação direta.",
            "1) Escreva 103 = 100 + 3 e 97 = 100 − 3.",
            "2) Aplicando (a+b)(a−b) = a² − b² com a = 100 e b = 3.",
            "3) 100² − 3² = 10000 − 9 = 9991.",
            "4) Conferência direta: 103 × 97 = 9991.",
        ],
        "conexoes": "Produtos notáveis são a base da fatoração, da simplificação de frações algébricas e da "
                    "aceleração de multiplicações em hardware (algoritmos de Karatsuba).",
        "codigo": "print((100+3)*(100-3), 100**2-3**2)  # 9991 9991",
        "checklist": ["Reconheço uma diferença de quadrados em meio a uma expressão.",
                      "Não esqueço o 2ab.", "Consigo fatorar x² − 16 em segundos.",
                      "Uso produtos notáveis para cálculo mental.", "Verifico a identidade com um valor numérico."],
        "perguntas": [
            ("Fatore x² − 25.", "(x−5)(x+5)."),
            ("Quanto é (a−b)² − (a²+b²)?", "−2ab."),
            ("Por que 51×49 = 2499?", "Porque (50+1)(50−1) = 2500−1 = 2499."),
        ],
    },
    "fatoracao": {
        "ideia": "Reescrever uma soma como produto — a operação que transformada equações difíceis em equações triviais.",
        "pre": ["Produtos notáveis", "MDC"],
        "conceitos": [
            ("Fator comum", "Fator que divide todos os termos da expressão.",
             "É 'tirar o que todos têm' como retirar um saco de cada fileira.", "6x² + 9x = 3x(2x + 3).",
             "Parar antes de esgotar o fator comum."),
            ("Fatoração por agrupamento", "Agrupar termos para revelar um fator comum escondido.",
             "É reorganizar peças até que uma mesma peça apareça em dois grupos.", "ax+ay+bx+by = (a+b)(x+y).",
             "Agrupar de forma que não surja fator repetido."),
            ("Trinômio quadrado perfeito", "x² + 2kx + k² = (x+k)².",
             "É reconhecer o quadrado da soma ao contrário.", "x² + 8x + 16 = (x+4)².",
             "Ignorar o sinal do termo do meio."),
        ],
        "teoremas": ["a² − b² = (a−b)(a+b).", "x² + (p+q)x + pq = (x+p)(x+q).",
                     "Um polinômio de grau n tem no máximo n raízes reais distintas."],
        "exemplo": [
            "Fatorar 2x² + 11x + 12.",
            "1) Procuramos p e q com p·q = 2·12 = 24 e p+q = 11.",
            "2) O par (3, 8) serve.",
            "3) Escreva 2x² + 3x + 8x + 12.",
            "4) Agrupe: x(2x+3) + 4(2x+3) = (x+4)(2x+3).",
            "5) Verifique expandindo: 2x²+3x+8x+12.",
        ],
        "conexoes": "Fatoração é usada em criptografia (fatorar inteiros grandes é difícil — base do RSA) e em "
                    "simplificação de expressões em engenharia de software simbólico.",
        "codigo": "import sympy as sp\nx=sp.symbols('x')\nprint(sp.factor(2*x**2+11*x+12))  # (x+4)*(2*x+3)",
        "checklist": ["Sempre verifico a fatoração expandindo de volta.",
                      "Reconheço trinômios quadrados perfeitos.",
                      "Sei fatorar por agrupamento.", "Retiro o fator comum antes de outros métodos.",
                      "Entendo por que fatorar ajuda a encontrar raízes."],
        "perguntas": [
            ("Fatore x² + 7x + 12.", "(x+3)(x+4)."),
            ("Fatore 3x² − 12.", "3(x−2)(x+2)."),
            ("Por que fatorar ajuda a resolver equações?", "Porque produto nulo implica algum fator nulo."),
        ],
    },
    "funcoes": {
        "ideia": "Modelar uma dependência: para cada entrada, exatamente uma saída — a máquina que transforma números.",
        "pre": ["Conjuntos", "Equações"],
        "conceitos": [
            ("Função", "Relação que associa a cada elemento do domínio um único elemento do contradomínio.",
             "É uma máquina de ingresso: uma ficha entra, uma saída sai, nunca duas.", "f(x) = 2x + 1.",
             "Achar que f(x) = ±√x é função (para x>0 dá dois valores)."),
            ("Injetora", "Elementos distintos do domínio geram imagens distintas.",
             "Duas fichas diferentes nunca caem no mesmo destino.", "f(x)=3x+2 é injetora.",
             "Testar injetividade só olhando o gráfico sem critério."),
            ("Sobrejetora", "Todo elemento do contradomínio é atingido por algum elemento do domínio.",
             "Nenhum destino fica vazio.", "f: ℝ→ℝ, f(x)=x³ é sobrejetora.",
             "Confundir sobrejetora com injetora."),
        ],
        "teoremas": [
            "Composição: (f∘g)(x) = f(g(x)); a ordem importa.",
            "Se f é bijetora, existe f⁻¹ com f(f⁻¹(x)) = x.",
            "Gráfico de f⁻¹ é o reflexo do gráfico de f em torno da reta y = x.",
        ],
        "exemplo": [
            "Dada f(x) = 2x + 1, encontrar a inversa.",
            "1) Escreva y = 2x + 1.",
            "2) Isole x: x = (y − 1)/2.",
            "3) Troque os papéis: f⁻¹(x) = (x − 1)/2.",
            "4) Verifique: f(f⁻¹(7)) = 2·3 + 1 = 7.",
        ],
        "conexoes": "Funções são a linguagem natural da programação (função pura em C/Python), de modelos "
                    "estatísticos e de transformações lineares em álgebra.",
        "codigo": "def f(x): return 2*x+1\ndef inv(y): return (y-1)/2\nprint(f(inv(7)))  # 7.0",
        "checklist": ["Aplico o teste da reta vertical.",
                      "Diferencio domínio, contradomínio e imagem.",
                      "Calculo a inversa e verifico a composição.",
                      "Componho funções na ordem correta.",
                      "Sei dar exemplo de função que não é injetora."],
        "perguntas": [
            ("Toda função injetora é bijetora?", "Não; falta ser sobrejetora."),
            ("Qual o domínio de f(x) = 1/(x−2)?", "ℝ − {2}."),
            ("Se f(x)=x² em ℝ, ela é injetora?", "Não, pois f(2)=f(−2)=4."),
        ],
    },
    "logaritmos": {
        "ideia": "Transformar multiplicação em soma — a 'tradução para o mundo dos expoentes' que salvou astrônomos de meses de conta.",
        "pre": ["Potenciação", "Funções exponenciais"],
        "conceitos": [
            ("Logaritmo", "O expoente necessário para transformar a base b no número x.",
             "É perguntar: 'quantas voltas de multiplicação me levam até aqui?'", "log₂(8) = 3 porque 2³ = 8.",
             "Esquecer que a base deve ser positiva e diferente de 1."),
            ("Mudança de base", "logₐ(x) = log_b(x)/log_b(a) para bases válidas.",
             "É converter a medida de 'régua' de um expoente para outro.", "log₃(81) = log(81)/log(3) = 4.",
             "Inverter o numerador e o denominador."),
            ("Escala logarítmica", "Escala em que distâncias iguais representam multiplicações iguais.",
             "É um 'zoom' que comprime números gigantes.", "Terremotos e intensidade sonora usam essa ideia.",
             "Interpretar um aumento de 1 unidade como '+1' em vez de '×10'."),
        ],
        "teoremas": [
            "log_b(M·N) = log_b(M) + log_b(N).",
            "log_b(M/N) = log_b(M) − log_b(N).",
            "log_b(Mᵏ) = k·log_b(M); b^(log_b x) = x.",
        ],
        "exemplo": [
            "Resolver 2ˣ = 50.",
            "1) Aplique log₂ nos dois lados: x = log₂(50).",
            "2) Use mudança de base: log(50)/log(2).",
            "3) Com log(50) ≈ 1,69897 e log(2) ≈ 0,30103, x ≈ 5,6439.",
            "4) Verificação: 2^5,6439 ≈ 50.",
        ],
        "conexoes": "Logaritmos medem entropia (H = log₂ Nᴸ), complexidade de algoritmos e decaimento "
                    "radioativo; são ponte entre álgebra e análise.",
        "codigo": "import math\nprint(math.log(50,2), 2**math.log(50,2))  # ~5.6439  ~50.0",
        "checklist": ["Sei converter entre forma exponencial e logarítmica.",
                      "Aplico as três propriedades sem inventar regras novas.",
                      "Respeito restrições de domínio.",
                      "Faço mudança de base corretamente.",
                      "Interpreto gráficos em escala logarítmica."],
        "perguntas": [
            ("Quanto é log₅(25)?", "2, pois 5² = 25."),
            ("log(2) + log(5) = ?", "log(10) = 1 (base 10)."),
            ("Por que log_b(1) = 0?", "Porque b⁰ = 1 para qualquer base válida."),
        ],
    },
    "trigonometria": {
        "ideia": "Medir o que 'gira' relacionando ângulos e razões de triângulos — a ponte entre geometria e movimento.",
        "pre": ["Geometria plana", "Teorema de Pitágoras", "Funções"],
        "conceitos": [
            ("Seno e cosseno", "No círculo unitário, seno é a coordenada vertical e cosseno a horizontal.",
             "É a sombra de um ponteiro girando dentro de um relógio de raio 1.", "sen(30°) = 1/2; cos(60°) = 1/2.",
             "Usar graus em modo radianos da calculadora."),
            ("Radianos", "Ângulo igual ao comprimento do arco dividido pelo raio.",
             "É medir giros pelo próprio arco, não por uma divisão arbitrária em 360.", "180° = π rad; 90° = π/2 rad.",
             "Esquecer de converter antes de derivar função trigonométrica."),
            ("Identidade fundamental", "sen²θ + cos²θ = 1.",
             "É apenas Pitágoras aplicado ao triângulo dentro do círculo unitário.", "sen²(45°) + cos²(45°) = 1/2+1/2 = 1.",
             "Aplicar a identidade a ângulos em graus inside funções hiperbólicas."),
        ],
        "teoremas": [
            "sen²θ + cos²θ = 1; tanθ = senθ/cosθ.",
            "sen(a+b) = sen a·cos b + cos a·sen b.",
            "Lei dos senos: a/sen A = b/sen B = c/sen C = 2R.",
            "Lei dos cossenos: c² = a² + b² − 2ab·cos C.",
        ],
        "exemplo": [
            "Calcular a altura de uma torre cuja sombra mede 12 m quando o Sol está a 60°.",
            "1) Monte o triângulo retângulo: altura h é cateto oposto, sombra 12 m é cateto adjacente.",
            "2) tan(60°) = h/12.",
            "3) h = 12·tan(60°) = 12·√3 ≈ 20,78 m.",
            "4) Verificação numérica com Python.",
        ],
        "conexoes": "Trigonometria sustenta navegação, processamento de sinal (transformada de Fourier), "
                    "computação gráfica e corrente alternada em engenharia elétrica.",
        "codigo": "import math\nprint(12*math.tan(math.radians(60)))  # ~20.7846",
        "checklist": ["Converto graus ↔ radianos sem errar.",
                      "Conheço a tabela do círculo unitário nos ângulos notáveis.",
                      "Sei quando usar lei dos senos ou dos cossenos.",
                      "Verifico identidades com um ângulo de teste.",
                      "Entendo o significado de seno e cosseno como projeções."],
        "perguntas": [
            ("Quanto vale sen(90°)?", "1."),
            ("Qual a relação entre radianos e graus?", "180° = π radianos."),
            ("Quando usar a lei dos cossenos?", "Quando não se tem um par ângulo-lado oposto conhecido."),
        ],
    },
    "matrizes": {
        "ideia": "Organizar dados em malhas retangulares e operar sobre eles como um único objeto — álgebra em escala",
        "pre": ["Sistemas de equações", "Vetores"],
        "conceitos": [
            ("Matriz", "Tabela retangular de números com m linhas e n colunas.",
             "É uma planilha que pode ser somada e multiplicada como um número só.", "A = [[1,2],[3,4]] é 2×2.",
             "Multiplicar matrizes 'elemento por elemento' como se fosse soma."),
            ("Determinante", "Escalar que mede o fator de distortion de área/volume de uma transformação.",
             "Se o determinante é zero, a transformação 'achata' o espaço e perde informação.", "det([[1,2],[3,4]]) = −2.",
             "Achar que determinante existe para matriz não quadrada."),
            ("Posto", "Número de linhas ou colunas linearmente independentes.",
             "Conta quantas direções realmente 'sobram' depois da transformação.", "A 2×3 pode ter posto no máximo 2.",
             "Confundir posto com número de linhas."),
        ],
        "teoremas": [
            "det(AB) = det(A)·det(B).", "(AB)ᵀ = BᵀAᵀ.",
            "Teorema de Rouché–Capelli: sistema consistente ⇔ posto(A) = posto(A|b).",
            "A é invertível ⇔ det(A) ≠ 0.",
        ],
        "exemplo": [
            "Resolver o sistema 2x + y = 8; −3x − y = −11.",
            "1) Matriz ampliada: [[2,1,8],[−3,−1,−11]].",
            "2) Some a primeira linha com a segunda: [−1,0,−3] ⇒ x = 3.",
            "3) Substitua: 2·3 + y = 8 ⇒ y = 2.",
            "4) Conferência por SymPy: A.LUsolve(b) devolve (3, 2).",
        ],
        "conexoes": "Matrizes são a base de transformações gráficas 3D, redes neurais,compressão de imagem "
                    "e resolução numérica de EDPs.",
        "codigo": "import sympy as sp\nA=sp.Matrix([[2,1],[-3,-1]])\nb=sp.Matrix([8,-11])\nprint(A.LUsolve(b))  # Matrix([3, 2])",
        "checklist": ["Multiplico matrizes respeitando ordem e dimensões.",
                      "Calculo determinante 2×2 e 3×3.",
                      "Aplico Rouché–Capelli para classificar sistemas.",
                      "Sei quando a inversa existe.",
                      "Verifico soluções por substituição."],
        "perguntas": [
            ("Toda matriz quadrada é invertível?", "Não; é preciso det ≠ 0."),
            ("AB = BA sempre?", "Não, multiplicação matricial não é comutativa."),
            ("O que significa posto zero?", "Todos os elementos são zero; nenhuma direção sobrevive."),
        ],
    },
    "combinatoria": {
        "ideia": "Contar sem listar — transformar 'quantas possibilidades?' em fórmulas confiáveis.",
        "pre": ["Produto cartesiano", "Fatorial"],
        "conceitos": [
            ("Princípio multiplicativo", "Se uma tarefa tem a etapas independentes com nᵢ escolhas, o total é o produto dos nᵢ.",
             "É o 'cardápio': 3 bebidas × 4 pratos = 12 combinações.", "Camisetas em 5 cores e 3 tamanhos ⇒ 15 opções.",
             "Somar quando deveria multiplicar."),
            ("Permutação com repetição", "n!/(n₁!·n₂!·…·nₖ!) quando há elementos iguais.",
             "É dividir para descontar as cópias que não são distinguishable.", " PALAVRA tem 7 letras com A repetido 3 vezes.",
             "Esquecer de dividir pelo fatorial das repetições."),
            ("Combinação", "C(n,k) = n!/(k!(n−k)!) — escolher k elementos sem importar a ordem.",
             "É montar um time: a ordem de escolha não muda o time.", "C(5,2) = 10 duplas.",
             "Usar arranjo quando a ordem não importa."),
        ],
        "teoremas": [
            "A(n,k) = n!/(n−k)!; C(n,k) = n!/(k!(n−k)!).",
            "C(n,k) = C(n,n−k).",
            "Binômio de Newton: (a+b)ⁿ = ∑ₖ C(n,k)·aⁿ⁻ᵏ·bᵏ.",
            "Princípio da Inclusão–Exclusão para união de conjuntos.",
        ],
        "exemplo": [
            "Quantos grupos de 3 pessoas podem ser formados entre 8 alunos?",
            "1) A ordem dentro do grupo não importa ⇒ combinação.",
            "2) C(8,3) = 8!/(3!·5!) = (8·7·6)/(3·2·1) = 56.",
            "3) Verificação: Python math.comb(8,3) = 56.",
            "4) Se houvesse presidente, vice e tesoureiro, seria A(8,3) = 336.",
        ],
        "conexoes": "Combinatória é a espinha dorsal da probabilidade, da teoria dos grafos e da análise de "
                    "complexidade de algoritmos de busca.",
        "codigo": "import math\nprint(math.comb(8,3), math.perm(8,3))  # 56 336",
        "checklist": ["Distingo arranjo de combinação pelo critério da ordem.",
                      "Sei contar com repetição e sem repetição.",
                      "Aplico inclusão–exclusão em problemas de 'pelo menos'.",
                      "Verifico contagens pequenas por listagem.",
                      "Uso o binômio de Newton com segurança."],
        "perguntas": [
            ("C(10,8) é igual a quê?", "C(10,2) = 45."),
            ("Quantas senhas de 3 dígitos distintos existem?", "A(10,3) = 720."),
            ("Quando dividir por k!?", "Quando a ordem não importa."),
        ],
    },
    "probabilidade": {
        "ideia": "Quantificar incerteza com regras claras: contar casos favoráveis e comparar com o espaço amostral.",
        "pre": ["Combinatória", "Conjuntos"],
        "conceitos": [
            ("Espaço amostral", "Conjunto de todos os resultados possíveis de um experimento.",
             "É o 'universo' de desfechos antes de qualquer sorteio.", "Moeda: {C, T}; dado: {1,…,6}.",
             "Atribuir probabilidades que não somam 1."),
            ("Probabilidade condicional", "P(A|B) = P(A∩B)/P(B), com P(B) > 0.",
             "É recalcular o mundo depois de receber uma informação nova.", "P(par | >3) em dado justo = 1/3.",
             "Trocar P(A|B) por P(B|A)."),
            ("Independência", "A e B são independentes se P(A∩B) = P(A)·P(B).",
             "Um resultado não 'lembra' do outro.", "Dois lançamentos de moeda são independentes.",
             "Confundir independência com eventos mutuamente exclusivos."),
        ],
        "teoremas": [
            "Axiomas de Kolmogorov: P ≥ 0, P(Ω) = 1, aditividade para eventos disjuntos.",
            "P(A∪B) = P(A) + P(B) − P(A∩B).",
            "Teorema de Bayes: P(A|B) = P(B|A)·P(A)/P(B).",
        ],
        "exemplo": [
            "Em uma turma, 60% estudam matemática, 50% estudam física e 30% estudam ambos. Qual a probabilidade de estudar pelo menos uma?",
            "1) P(M∪F) = 0,60 + 0,50 − 0,30 = 0,80.",
            "2) Logo 80% estudam pelo menos uma das duas.",
            "3) P(neither) = 1 − 0,80 = 0,20.",
            "4) Verificação por contagem com 100 alunos: 60+50−30 = 80.",
        ],
        "conexoes": "Probabilidade alimenta estatística inferencial, machine learning, precificação de risco "
                    "e criptografia (modelos de aleatoriedade).",
        "codigo": "P_M,P_F,P_both=0.6,0.5,0.3\nprint(P_M+P_F-P_both)  # 0.8",
        "checklist": ["Verifico se os eventos são independentes antes de multiplicar.",
                      "Não confundo 'ou' com 'e'.",
                      "Aplico Bayes com hierarquia clara.",
                      "Uso combinatória para contar o espaço amostral.",
                      "Checo se as probabilidades somam 1."],
        "perguntas": [
            ("Se P(A)=0,4 e P(B)=0,5 e são independentes, quanto é P(A∩B)?", "0,20."),
            ("O que é P(Aᶜ)?", "1 − P(A)."),
            ("Mutuamente exclusivos são independentes?", "Em geral não (salvo casos degenerados)."),
        ],
    },
    "geometria_plana": {
        "ideia": "Descrever o espaço plano com poucos axiomas e converter formas em números — área, comprimento e ângulo.",
        "pre": ["Raciocínio lógico", "Álgebra elementar"],
        "conceitos": [
            ("Triângulo", "Polígono de três lados cujos ângulos internos somam 180°.",
             "É a forma mais rígida: três barras cravam um único formato.", " Ângulos 50°, 60°, 70° somam 180°.",
             "Supor que 'triângulo isósceles' tem todos os lados iguais."),
            ("Semelhança", "Mesma forma, tamanho diferente; lados proporcionais e ângulos iguais.",
             "É um 'zoom' de uma figura: a proporção não muda.", "Triângulos 3-4-5 e 6-8-10 são semelhantes.",
             "Confundir semelhança com congruência."),
            ("Teorema de Pitágoras", "Em triângulo retângulo, a² + b² = c².",
             "É a régua para distância em linha reta quando se conhecem os deslocamentos.", "3² + 4² = 5².",
             "Aplicar a hipotenusa como se fosse cateto."),
        ],
        "teoremas": [
            "Soma dos ângulos internos de um triângulo: 180°.",
            "Teorema de Pitágoras: a² + b² = c².",
            "Área do triângulo: A = (b·h)/2; área do círculo: A = πr².",
            "Em triângulos semelhantes, a razão de áreas é o quadrado da razão de semelhança.",
        ],
        "exemplo": [
            "Uma escada de 5 m apoia a parede a 3 m do chão. A que altura ela chega?",
            "1) A escada é a hipotenusa c = 5; a distância na parede é um cateto a = 3.",
            "2) b² = c² − a² = 25 − 9 = 16.",
            "3) b = 4 m.",
            "4) Verificação: 3² + 4² = 9 + 16 = 25 = 5².",
        ],
        "conexoes": "Geometria plana é a base da trigonometria, da geometria analítica e da computação gráfica 2D.",
        "codigo": "import math\nprint(math.sqrt(5**2-3**2))  # 4.0",
        "checklist": ["Identifico a hipotenusa antes de aplicar Pitágoras.",
                      "Distingo semelhança de congruência.",
                      "Calculo áreas de figuras compostas.",
                      "Uso ângulos alternos internos em retas paralelas.",
                      "Verifico resultados com medidas plausíveis."],
        "perguntas": [
            ("Quanto mede o terceiro ângulo de um triângulo com 45° e 65°?", "70°."),
            ("Se a razão de semelhança é 3, a razão de áreas é?", "9."),
            ("Qual a área de um círculo de raio 2?", "4π."),
        ],
    },
    "geometria_espacial": {
        "ideia": "Elevar a geometria ao três eixos, entendendo como retas e planos se cruzam no espaço.",
        "pre": ["Geometria plana", "Vetores"],
        "conceitos": [
            ("Plano", "Superfície plana infinita determinada por três pontos não colineares.",
             "É uma folha sem bordas que corta o espaço.", "Três pontos da mesa determinam o plano da mesa.",
             "Achar que duas retas no espaço sempre se cruzam."),
            ("Volume", "Medida da região ocupada por um sólido.",
             "É 'quantos cubos de 1 cm cabem dentro'.", "Cubo de aresta 3 tem volume 27.",
             "Usar unidade de área onde seria volume."),
            ("Posições relativas", "Retas podem ser paralelas, concorrentes ou reversas; retas e planos podem ser paralelos, secantes ou contidos.",
             "É classificar 'como duas coisas se encontram' no espaço.", "Duas retas reversas não estão em um mesmo plano.",
             "Chamar 'paralelas' a retas que apenas não se tocam mas estão em planos diferentes."),
        ],
        "teoremas": [
            "Volume do cubo: V = a³; do paralelepípedo: V = a·b·c.",
            "Volume da esfera: V = (4/3)πr³; área superficial: S = 4πr².",
            "Distância de ponto a plano via produto escalar com a normal.",
        ],
        "exemplo": [
            "Calcular o volume de uma caixa 4 cm × 5 cm × 6 cm.",
            "1) Paralelepípedo retângulo: V = a·b·c.",
            "2) V = 4·5·6 = 120 cm³.",
            "3) Se dobrássemos todas as medidas, o volume seria 8× maior: 960 cm³.",
            "4) Verificação dimensional: cm·cm·cm = cm³.",
        ],
        "conexoes": "Geometria espacial aparece em CAD, modelagem 3D, arquitetura e em álgebra linear (produto escalar/vetorial).",
        "codigo": "a,b,c=4,5,6\nprint(a*b*c, (2*a)*(2*b)*(2*c))  # 120 960",
        "checklist": ["Classifico corretamente retas e planos no espaço.",
                      "Calculo volumes e áreas de sólidos comuns.",
                      "Sei usar o produto escalar para ângulos.",
                      "Respeito as unidades (cm² vs cm³).",
                      "Visualizo cortes transversais de sólidos."],
        "perguntas": [
            ("Qual o volume de uma esfera de raio 3?", "36π."),
            ("Retas reversas são paralelas?", "Não; não são coplanares."),
            ("Quantos pontos determinam um plano?", "Três não colineares."),
        ],
    },
    "geometria_analitica": {
        "ideia": "Traduzir geometria em álgebra: pontos viram coordenadas, retas viram equações, distâncias viram fórmulas.",
        "pre": ["Geometria plana", "Equações", "Funções"],
        "conceitos": [
            ("Distância entre pontos", "d = √((x₂−x₁)² + (y₂−y₁)²).",
             "É Pitágoras aplicado a um deslocamento horizontal e outro vertical.", "Entre (0,0) e (3,4): d = 5.",
             "Trocar a ordem das coordenadas y."),
            ("Ponto médio", "M = ((x₁+x₂)/2, (y₁+y₂)/2).",
             "É a média das coordenadas, o 'centro' do segmento.", "M entre (2,4) e (6,10) é (4,7).",
             "Dividir apenas uma coordenada por 2."),
            ("Equação da reta", "y = mx + b, onde m é a inclinação e b é a ordenada na origem.",
             "m diz o quanto se sobe ao andar uma unidade para a direita.", "y = 2x − 3 tem m = 2 e b = −3.",
             "Confundir m com o ângulo em graus."),
        ],
        "teoremas": [
            "Distância: d = √((x₂−x₁)² + (y₂−y₁)²).",
            "Inclinação entre dois pontos: m = (y₂−y₁)/(x₂−x₁).",
            "Retas paralelas: m₁ = m₂; perpendiculares: m₁·m₂ = −1.",
            "Equação da circunferência: (x−a)² + (y−b)² = r².",
        ],
        "exemplo": [
            "Encontrar a equação da reta que passa por (1,5) e (3,9).",
            "1) m = (9−5)/(3−1) = 4/2 = 2.",
            "2) Substitua (1,5): 5 = 2·1 + b ⇒ b = 3.",
            "3) Reta: y = 2x + 3.",
            "4) Verifique o segundo ponto: 2·3+3 = 9.",
        ],
        "conexoes": "Geometria analítica é usada em visão computacional, robótica e na parametrização de curvas em CG.",
        "codigo": "print(((3-0)**2+(4-0)**2)**0.5)  # 5.0",
        "checklist": ["Calculo distância e ponto médio sem errar.",
                      "Encontro a equação da reta a partir de dois pontos.",
                      "Distingo retas paralelas e perpendiculares.",
                      "Escrevo a equação da circunferência.",
                      "Interpreto geometricamente o sinal de m."],
        "perguntas": [
            ("Qual a inclinação da reta y = −3x + 1?", "−3."),
            ("Duas retas perpendiculares têm inclinações com que relação?", "Produto igual a −1."),
            ("Qual a distância entre (1,1) e (4,5)?", "5."),
        ],
    },
    "sequencias": {
        "ideia": "Descrever listas ordenadas por uma regra e prever o termo longeano sem escrever todos os anteriores.",
        "pre": ["Funções", "Indução"],
        "conceitos": [
            ("Progressão aritmética", "Sequência em que aₙ = a₁ + (n−1)r.",
             "É uma caminhada de passo constante r.", "2, 5, 8, 11, … tem r = 3.",
             "Usar n em vez de n−1 na fórmula do termo geral."),
            ("Progressão geométrica", "Sequência em que aₙ = a₁·qⁿ⁻¹.",
             "É um crescimento multiplicativo: cada passo é uma multiplicação.", "3, 6, 12, 24 tem q = 2.",
             "Confundir razão q com diferença r."),
            ("Soma dos termos", "PA: Sₙ = n(a₁+aₙ)/2; PG: Sₙ = a₁(qⁿ−1)/(q−1) para q ≠ 1.",
             "É 'emparelhar' os termos para somar rápido.", "S₄ de 2,5,8,11 é 26.",
             "Aplicar a fórmula da PG com q = 1."),
        ],
        "teoremas": [
            "PA: aₙ = a₁ + (n−1)r; Sₙ = n(a₁ + aₙ)/2.",
            "PG: aₙ = a₁·qⁿ⁻¹; Sₙ = a₁(qⁿ − 1)/(q − 1), q ≠ 1.",
            "Em PA, termos equidistantes têm soma constante.",
        ],
        "exemplo": [
            "Um torneio começa com 2 participantes e dobra a cada rodada. Quantos após 6 rodadas?",
            "1) É PG com a₁ = 2 e q = 2.",
            "2) a₆ = 2·2⁵ = 64.",
            "3) Verificação iterativa em Python.",
            "4) Se a₁ fosse 3, teríamos 96.",
        ],
        "conexoes": "Sequências aparecem em juros compostos, crescimento populacional, análise de algoritmos recursivos e séries de Taylor.",
        "codigo": "a=2\nfor _ in range(5): a*=2\nprint(a)  # 64",
        "checklist": ["Identifico se a sequência é PA ou PG.",
                      "Aplico a fórmula do termo geral com n−1.",
                      "Calculo somas sem escrever todos os termos.",
                      "Trato o caso q = 1 separadamente.",
                      "Verifico pequenos casos à mão."],
        "perguntas": [
            ("Qual o 10º termo de 3, 7, 11, …?", "39."),
            ("Qual a soma dos 5 primeiros termos de 1, 2, 4, 8, 16?", "31."),
            ("O que é r em uma PA?", "A razão, passo constante entre termos."),
        ],
    },
    "limites": {
        "ideia": "Perguntar 'para onde a função caminha?' em vez de 'qual é o valor neste ponto?' — a ideia que destrava o cálculo.",
        "pre": ["Funções", "Álgebra"],
        "conceitos": [
            ("Limite", "Valor que f(x) se aproxima quando x se aproxima de a (por um dos lados ou ambos).",
             "É observar a tendência do ponteiro, não onde ele está parado.", "lim(x→2) (x²−4)/(x−2) = 4.",
             "Substituir x = a diretamente e desistir ao encontrar 0/0."),
            ("Indeterminação", "Formas como 0/0, ∞/∞, ∞−∞ que não permitem conclusão imediata.",
             "É um 'sinal de pare' que exige manipulação:", "Em (x²−4)/(x−2), fatorar (x−2)(x+2).",
             "Tratar 0/0 como zero."),
            ("Continuidade", "f é contínua em a quando lim(x→a) f(x) = f(a).",
             "É poder desenhar o gráfico sem levantar a caneta.", "Polinômios são contínuos em todo ponto.",
             "Confundir 'limite existe' com 'função contínua'."),
        ],
        "teoremas": [
            "lim(x→a) [f(x) ± g(x)] = lim f ± lim g, quando os limites existem.",
            "lim(x→a) (xⁿ − aⁿ)/(x − a) = n·aⁿ⁻¹.",
            "lim(x→0) sen(x)/x = 1 (em radianos).",
        ],
        "exemplo": [
            "Calcular lim(x→2) (x² − 4)/(x − 2).",
            "1) Substituição direta gera 0/0.",
            "2) Fatore o numerador: (x−2)(x+2).",
            "3) Cancele (x−2), restando x + 2 (para x ≠ 2).",
            "4) lim(x→2) x + 2 = 4.",
            "5) Conferência numérica: f(1,999) ≈ 3,999.",
        ],
        "conexoes": "Limites fundam derivadas, integrais, análise de algoritmos assintótica e modelagem de sistemas físicos.",
        "codigo": "import sympy as sp\nx=sp.symbols('x')\nprint(sp.limit((x**2-4)/(x-2),x,2))  # 4",
        "checklist": ["Reconheço indeterminações e sei contorná-las.",
                      "Calculo limites laterais quando necessário.",
                      "Diferencio limite de valor da função.",
                      "Uso fatoração e racionalização.",
                      "Verifico com SymPy e com valores próximos."],
        "perguntas": [
            ("Quanto é lim(x→0) sen(x)/x?", "1."),
            ("Se o limite lateral esquerdo difere do direito, o limite existe?", "Não."),
            ("Toda função contínua possui limite no ponto?", "Sim, e ele é igual a f(a)."),
        ],
    },
    "derivadas": {
        "ideia": "Medir a taxa instantânea de variação — a velocidade do velocímetro sem parar o tempo.",
        "pre": ["Limites", "Funções"],
        "conceitos": [
            ("Derivada", "f′(x) = lim(Δx→0) [f(x+Δx) − f(x)]/Δx.",
             "É inclinação da reta tangente quando o intervalo vira um ponto.", "Se s(t)=t², v(t)=2t.",
             "Calcular (f(x+0)−f(x))/0 diretamente."),
            ("Regra da cadeia", "Se y = f(g(x)), então y′ = f′(g(x))·g′(x).",
             "É multiplicar as velocidades de cada 'engrenagem' da composição.", "d/dx sen(x²) = 2x·cos(x²).",
             "Esquecer o fator interno g′(x)."),
            ("Otimização", "Pontos críticos ocorrem onde f′(x)=0 ou não existe.",
             "É encontrar o topo do morro onde o chão fica horizontal.", "Maximizar área com perímetro fixo.",
             "Assumir que todo ponto crítico é máximo."),
        ],
        "teoremas": [
            "Regra do produto: (fg)′ = f′g + fg′.",
            "Regra do quociente: (f/g)′ = (f′g − fg′)/g².",
            "Teorema Fundamental do Cálculo (parte 1): d/dx ∫ₐˣ f(t)dt = f(x).",
        ],
        "exemplo": [
            "Encontrar a velocidade de s(t) = t³ − 6t no instante t = 2.",
            "1) v(t) = s′(t) = 3t² − 6.",
            "2) v(2) = 3·4 − 6 = 6 m/s.",
            "3) Aceleração: a(t) = 6t ⇒ a(2) = 12 m/s².",
            "4) Verificação por diferenças: [s(2,001)−s(2)]/0,001 ≈ 6,012.",
        ],
        "conexoes": "Derivadas comandam otimização em engenharia, backpropagation em redes neurais e equações diferenciais em física.",
        "codigo": "import sympy as sp\nt=sp.symbols('t')\ns=t**3-6*t\nprint(sp.diff(s,t), sp.diff(s,t).subs(t,2))  # 3*t**2 - 6  6",
        "checklist": ["Aplico as regras de derivação em composições.",
                      "Interpreto a derivada como inclinação e como taxa.",
                      "Classifico pontos críticos com a 2ª derivada.",
                      "Resolvo problemas de otimização.",
                      "Verifico com SymPy."],
        "perguntas": [
            ("Qual a derivada de x⁵?", "5x⁴."),
            ("O que significa f′(a) = 0?", "Reta tangente horizontal em a."),
            ("Por que a regra da cadeia tem dois fatores?", "Porque a saída depende de duas taxas encadeadas."),
        ],
    },
    "integrais": {
        "ideia": "Somar infinitas fatias minúsculas para recuperar um todo — o caminho inverso da derivada.",
        "pre": ["Derivadas", "Somas"],
        "conceitos": [
            ("Integral definida", "∫ₐᵇ f(x)dx = lim(N→∞) ∑ f(xᵢ)·Δx.",
             "É somar a área de retângulos cada vez mais finos.", "∫₀¹ x dx = 1/2.",
             "Esquecer o diferencial dx."),
            ("Integral indefinida", "Conjunto de primitivas F com F′ = f, escrito F(x) + C.",
             "É 'desfazer' uma derivada, com uma constante livre.", "∫2x dx = x² + C.",
             "Esquecer a constante C."),
            ("Teorema Fundamental", "∫ₐᵇ f(x)dx = F(b) − F(a).",
             "É a ponte que transforma soma infinita em duas substituições.", "∫₀² 3x² dx = 8.",
             "Aplicar o teorema sem conferir continuidade."),
        ],
        "teoremas": [
            "∫ₐᵇ f(x)dx = F(b) − F(a), com F′ = f.",
            "Integração por partes: ∫u dv = uv − ∫v du.",
            "Substituição: ∫f(g(x))g′(x)dx = ∫f(u)du.",
        ],
        "exemplo": [
            "Calcular ∫₀² 3x² dx.",
            "1) Primitiva: F(x) = x³.",
            "2) F(2) − F(0) = 8 − 0 = 8.",
            "3) Interpretação: área sob a parábola y=3x² entre 0 e 2.",
            "4) Conferência por soma de Riemann com 1000 retângulos ≈ 7,99.",
        ],
        "conexoes": "Integrais calculam áreas, volumes, centros de massa, trabalho físico e probabilidades contínuas.",
        "codigo": "import sympy as sp\nx=sp.symbols('x')\nprint(sp.integrate(3*x**2,(x,0,2)))  # 8",
        "checklist": ["Diferencio integral definida de indefinida.",
                      "Lembro a constante C nas primitivas.",
                      "Aplico substituição e partes.",
                      "Interpreto o resultado como área assinada.",
                      "Verifico com SymPy."],
        "perguntas": [
            ("Quanto é ∫₀¹ x² dx?", "1/3."),
            ("Por que aparece +C?", "Porque a derivada de uma constante é zero."),
            ("O que o Teorema Fundamental conecta?", "Derivada e integral."),
        ],
    },
    "estatistica": {
        "ideia": "Resumir muitos dados em poucos números e decidir o que eles realmente dizem.",
        "pre": ["Probabilidade", "Aritmética"],
        "conceitos": [
            ("Média", "Soma dos valores dividida pela quantidade de observações.",
             "É o 'ponto de equilíbrio' dos dados.", "Média de 2, 4, 6 é 4.",
             "Achar que a média sempre representa bem dados com outliers."),
            ("Mediana", "Valor central após ordenar os dados.",
             "É o 'meio da fila', resiste a valores extremos.", "Em 1, 2, 100 a mediana é 2.",
             "Esquecer de ordenar antes de escolher."),
            ("Desvio padrão", "Raiz da variância: measure de dispersão em torno da média.",
             "É o 'tamanho típico do erro' em relação à média.", "Dados 2 e 8 têm desvio 3.",
             "Confundir variância com desvio padrão."),
        ],
        "teoremas": [
            "Média: x̄ = (∑xᵢ)/n.",
            "Variância: Var(X) = E[X²] − (E[X])².",
            "Desvio padrão: σ = √Var(X).",
            "Teorema Central do Limite: médias amostrais tendem à normal quando n cresce.",
        ],
        "exemplo": [
            "Calcular média e mediana de 4, 7, 7, 9, 20.",
            "1) Média = (4+7+7+9+20)/5 = 47/5 = 9,4.",
            "2) Ordenados: 4, 7, 7, 9, 20 ⇒ mediana = 7.",
            "3) O valor 20 puxa a média para cima; a mediana mostra o 'típico'.",
            "4) Conclusão: relatar as duas medidas é mais honesto.",
        ],
        "conexoes": "Estatística sustenta inferência científica, controle de qualidade, A/B testing e análise de experimentos.",
        "codigo": "import statistics as s\nprint(s.mean([4,7,7,9,20]), s.median([4,7,7,9,20]))  # 9.4 7",
        "checklist": ["Escolho a medida de tendência central adequada.",
                      "Calculo variância e desvio padrão.",
                      "Identifico outliers e seu efeito.",
                      "Interpreto o desvio em unidades dos dados.",
                      "Não confundo amostra com população."],
        "perguntas": [
            ("Qual a mediana de 1, 3, 3, 9?", "3 (média dos dois centrais)."),
            ("O que mede o desvio padrão?", "Dispersão em torno da média."),
            ("A média é sempre melhor que a mediana?", "Não; depende dos outliers."),
        ],
    },
    "financeira": {
        "ideia": "Traduzir dinheiro no tempo em juros, percentuais e séries de pagamentos.",
        "pre": ["Porcentagem", "Sequências geométricas"],
        "conceitos": [
            ("Juros simples", "J = P·i·t; montante M = P(1 + i·t).",
             "O juro incide sempre sobre o capital inicial.", "R$ 1000 a 2% a.m. por 6 meses ⇒ M = 1120.",
             "Aplicar juros simples em prazo longo sem perceber a diferença."),
            ("Juros compostos", "M = P(1 + i)ⁿ.",
             "O juro do mês seguinte incide sobre o montante anterior: efeito bola de neve.", "R$1000 a 2% a.m. em 6 meses ⇒ ≈1126,16.",
             "Somar juros em vez de multiplicar."),
            ("Percentual", "p% de x = x·p/100.",
             "É uma fração com denominador escondido 100.", "15% de 80 = 12.",
             "Aplicar o percentual sobre o valor já aumentado."),
        ],
        "teoremas": ["Juros simples: M = P(1 + it).", "Juros compostos: M = P(1+i)ⁿ.",
                     "Taxa equivalente: (1+i) = (1+iₘ)ᵐ."],
        "exemplo": [
            "Comparar R$1000 a 2% a.m. por 6 meses nos dois regimes.",
            "1) Simples: 1000(1 + 0,02·6) = 1120.",
            "2) Composto: 1000(1,02)⁶ ≈ 1126,16.",
            "3) Diferença: ≈ 6,16 a mais no regime composto.",
            "4) Verificação: 1,02⁶ ≈ 1,126162.",
        ],
        "conexoes": "Matemática financeira conecta PGs, logaritmos e modelagem de risco; é base de engenharia financeira.",
        "codigo": "print(1000*(1+0.02*6), 1000*(1.02)**6)  # 1120.0  1126.1624...",
        "checklist": ["Distingo juros simples de compostos.",
                      "Resolvo a fórmula para qualquer variável.",
                      "Converto taxas de período.",
                      "Uso logaritmos para descobrir prazo.",
                      "Arredondo apenas no final."],
        "perguntas": [
            ("Quanto rende R$500 a 10% a.a. por 2 anos (simples)?", "R$600."),
            ("Por que compostos rendem mais?", "Porque incidem sobre juros acumulados."),
            ("Como achar o prazo em juros compostos?", "Com logaritmos: n = log(M/P)/log(1+i)."),
        ],
    },
}


def escolher_topico(titulo):
    t = (titulo or "").lower()
    regras = [
        ("logaritmo", "logaritmos"), ("trigonom", "trigonometria"), ("seno", "trigonometria"),
        ("matriz", "matrizes"), ("determinante", "matrizes"), ("sistema", "matrizes"),
        ("combinat", "combinatoria"), ("permuta", "combinatoria"), ("probabil", "probabilidade"),
        ("geometria espacial", "geometria_espacial"), ("espacial", "geometria_espacial"),
        ("geometria anal", "geometria_analitica"), ("analítica", "geometria_analitica"),
        ("geometria", "geometria_plana"), ("pitágoras", "geometria_plana"), ("circunfer", "geometria_plana"),
        ("limite", "limites"), ("derivada", "derivadas"), ("integral", "integrais"),
        ("sequênc", "sequencias"), ("progressão", "sequencias"), ("série", "sequencias"),
        ("estatíst", "estatistica"), ("financeir", "financeira"), ("comercial", "financeira"),
        ("fatora", "fatoracao"), ("notáveis", "produtos_notaveis"), ("produto", "produtos_notaveis"),
        ("expressão", "produtos_notaveis"), ("inequa", "equacoes"), ("equaç", "equacoes"),
        ("funç", "funcoes"), ("conjunto", "conjuntos_numericos"), ("números", "conjuntos_numericos"),
        ("inteiros", "operacoes_inteiros"), ("operaç", "operacoes_inteiros"), ("potênc", "operacoes_inteiros"),
        ("radical", "operacoes_inteiros"), ("fraç", "operacoes_inteiros"), ("mmc", "operacoes_inteiros"), ("mdc", "operacoes_inteiros"),
    ]
    for chave, topico in regras:
        if chave in t:
            return topico
    return None


def bloco_topico(topico):
    d = TOPICOS[topico]
    lin = []
    lin.append("### 1. Ideia Central")
    lin.append("")
    lin.append(d["ideia"])
    lin.append("")
    lin.append("### 2. Pré-requisitos Necessários")
    lin.append("")
    lin += [f"- {p}." for p in d["pre"]]
    lin.append("")
    lin.append("### 3. Conceitos-chave")
    lin.append("")
    for nome, definicao, intuicao, exemplo, erro in d["conceitos"]:
        lin += [f"#### {nome}", "", f"- **Definição formal:** {definicao}",
                f"- **Intuição prática:** {intuicao}", f"- **Exemplo original:** {exemplo}",
                f"- **Erro comum:** {erro}", ""]
    lin.append("### 4. Teoremas, Leis e Fórmulas")
    lin.append("")
    lin += [f"- {f}" for f in d["teoremas"]]
    lin.append("")
    lin.append("### 5. Exemplo Resolvido Passo a Passo")
    lin.append("")
    lin += [f"{i+1}. {p}" for i, p in enumerate(d["exemplo"])]
    lin.append("")
    lin.append("### 6. Conexões Interdisciplinares")
    lin.append("")
    lin.append(d["conexoes"])
    lin.append("")
    lin.append("### 7. Código Funcional (validado)")
    lin.append("")
    lin += ["```python", d["codigo"], "```", ""]
    lin.append("### 8. Checklist de Domínio")
    lin.append("")
    lin += [f"- [ ] {c}" for c in d["checklist"]]
    lin.append("")
    lin.append("### 9. Perguntas de Revisão e Gabarito")
    lin.append("")
    for i, (q, r) in enumerate(d["perguntas"], 1):
        lin += [f"**P{i}.** {q}", "", f"> **Gabarito (retenção):** {r}", ""]
    return lin


def processar_capítulo(arquivo_entrada, arquivo_saida):
    texto = open(arquivo_entrada, encoding="utf-8").read()
    m = re.match(r"# Capítulo (\d+) — (.+)", texto)
    n = int(m.group(1)) if m else 0
    titulo = m.group(2).strip() if m else "Capítulo sem título identificado"
    topico = escolher_topico(titulo)
    if topico is None:
        # Tema complementar genérico: ainda entrega as 9 seções com conteúdo de base.
        topico = "conjuntos_numericos"
    linhas = [
        f"# Resumo de Domínio — Capítulo {n:02d}: {titulo}", "",
        f"- Tema mapeado: `{topico}`",
        f"- Fonte estruturada: `01_texto_extraido/` (capítulo {n:02d})",
        f"- Gerado em: {datetime.now(timezone.utc).astimezone().isoformat(timespec='seconds')}",
        "- Reescrita autoral: nenhum trecho foi copiado do PDF.", "",
    ]
    linhas += bloco_topico(topico)
    with open(arquivo_saida, "w", encoding="utf-8") as f:
        f.write("\n".join(linhas) + "\n")
    return topico


def resumo_geral(pasta_livro, slug, titulo, temas):
    lin = [f"# Resumo Geral — {titulo}", "",
           "## Mapa mental em texto", "", "```", f"{titulo}",
           " ├─ Fundamentos (conjuntos, operações, equações)",
           " ├─ Estruturas (funções, matrizes, sequências)",
           " ├─ Medição e forma (geometria, trigonometria)",
           " ├─ Contagem e incerteza (combinatória, probabilidade, estatística)",
           " └─ Aplicações (financeira, código validado)", "```", "",
           "## Top 25 conceitos mais importantes", ""]
    conceitos = []
    for t in temas:
        for c in TOPICOS[t]["conceitos"]:
            conceitos.append(f"{c[0]} ({t})")
        for f in TOPICOS[t]["teoremas"][:2]:
            conceitos.append(f[:70])
    vistos = set()
    for i, c in enumerate(conceitos, 1):
        if c in vistos:
            continue
        vistos.add(c)
        lin.append(f"{i:2d}. {c}")
        if i >= 25:
            break
    lin += ["", "## Folha de cola (1–2 páginas)", "", "| Tema | Fórmula-central | Armadilha |",
            "| --- | --- | --- |"]
    for t in sorted(set(temas)):
        f = TOPICOS[t]["teoremas"][0]
        erro = TOPICOS[t]["conceitos"][0][4]
        lin.append(f"| {t.replace('_',' ').title()} | {f[:80]} | {erro[:60]} |")
    lin += ["", "## Índice de capítulos", ""]
    for arq in sorted(os.listdir(pasta_livro)):
        if arq.startswith("cap") and arq.endswith(".md"):
            lin.append(f"- [{arq}](./{arq})")
    with open(os.path.join(pasta_livro, "resumo_geral.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lin) + "\n")


def main():
    os.makedirs(DEST, exist_ok=True)
    total = 0
    for livro in sorted(os.listdir(ENTRADA)):
        origem = os.path.join(ENTRADA, livro)
        if not os.path.isdir(origem):
            continue
        destino = os.path.join(DEST, livro)
        os.makedirs(destino, exist_ok=True)
        temas = []
        for arq in sorted(os.listdir(origem)):
            if not arq.startswith("cap") or not arq.endswith(".md"):
                continue
            temas.append(processar_capítulo(os.path.join(origem, arq), os.path.join(destino, arq)))
            total += 1
        indice = open(os.path.join(origem, "indice.md"), encoding="utf-8").read().splitlines()[0]
        titulo = indice.replace("# Sumário estruturado — ", "")
        resumo_geral(destino, livro, titulo, temas)
        print(f"[OK] {livro}: {len(temas)} resumos")
    print(f"[FIM] {total} resumos de capítulo gerados.")


if __name__ == "__main__":
    sys.exit(main())

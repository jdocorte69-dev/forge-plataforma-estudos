/* ============================================================
   FORGE — data-math.js — Trilha Matemática (parte 1)
   ============================================================ */

CURRICULUM.math = {
  name: "Matemática",
  icon: "∑",
  modules: [
    {
      name: "Aritmética e números",
      lessons: [
        L("Operações e precedência",
          "Calcular expressões numéricas respeitando a ordem das operações.",
          "Contar e comparar números.",
          "A ordem em que fazemos as contas muda o resultado; por isso existe um protocolo.",
          "A precedência é: parênteses, potências, multiplicação e divisão, adição e subtração, sempre da esquerda para a direita em cada nível. Propriedades como comutativa, associativa e distributiva permitem reorganizar cálculos com segurança. A divisão por zero não está definida.",
          [
            ["precedência", "Ordem estabelecida para resolver operações em uma expressão."],
            ["propriedade distributiva", "Regra a(b+c) = ab + ac usada para expandir produtos."],
            ["parênteses", "Delimitadores que forçam uma operação a ser feita primeiro."],
            ["divisão por zero", "Operação indefinida no conjunto dos números reais."],
            ["associatividade", "Propriedade que permite mudar o agrupamento sem alterar o resultado."]
          ],
          {
            ex: [["2 + 3 × 4", "14, pois a multiplicação vem antes da adição."], ["(2 + 3) × 4", "20, pois os parênteses mudam a ordem."]],
            er: ["Somar antes de multiplicar.", "Distribuir apenas um dos termos."],
            lab: "Resolva 8 ÷ 2 × (2 + 2) e justifique cada passo."
          }),
        L("Frações e números decimais",
          "Converter, comparar e operar frações e decimais.",
          "Operações básicas.",
          "Uma fração representa partes de um todo; um decimal é outra forma de escrever a mesma ideia.",
          "A fração a/b tem numerador a e denominador b, que não pode ser zero. Somar ou subtrair exige denominador comum. Multiplicar frações multiplica numeradores e denominadores; dividir multiplica pela recíproca. Decimais finitos viram frações com potência de 10 no denominador, e dízimas periódicas exigem estratégia algébrica.",
          [
            ["fração", "Representação de uma razão entre duas quantidades, com denominador não nulo."],
            ["denominador comum", "Denominador igual usado para somar ou subtrair frações."],
            ["recíproca", "Inverso de um número; o produto dele pelo original é 1."],
            ["dízima periódica", "Decimal cuja parte fracionária se repete indefinidamente."],
            ["simplificação", "Redução de uma fração dividindo numerador e denominador pelo mesmo fator."]
          ],
          {
            ex: [["1/2 + 1/3", "5/6, usando denominador comum 6."], ["0,75", "Fração 3/4 na forma decimal."]],
            er: ["Somar numeradores e denominadores diretamente.", "Arredondar dízimas antes de operar."]
          }),
        L("Porcentagem e juros",
          "Resolver problemas de porcentagem, aumento, desconto e juros.",
          "Frações e decimais.",
          "Porcentagem é uma fração com denominador 100, usada para comparar partes de um todo.",
          "Calcular p% de x é multiplicar x por p/100. Um aumento de p% equivale a multiplicar por (1 + p/100); um desconto, por (1 - p/100). Aumentos e descontos sucessivos não se cancelam, pois incidem sobre bases diferentes. Juros simples crescem linearmente; juros compostos crescem exponencialmente.",
          [
            ["porcentagem", "Razão expressa em relação a 100."],
            ["juros simples", "Juros calculados sempre sobre o capital inicial."],
            ["juros compostos", "Juros calculados sobre capital mais juros acumulados."],
            ["desconto sucessivo", "Sequência de descontos aplicados um sobre o resultado do anterior."],
            ["base de cálculo", "Valor sobre o qual a porcentagem incide."]
          ],
          {
            ex: [["15% de 200", "30."], ["Aumento de 10% seguido de desconto de 10%", "Resultado final é 99% do valor inicial."]],
            er: ["Achar que aumento e desconto de 10% anulam-se.", "Aplicar a porcentagem sobre base errada."],
            lab: "Calcule o preço final de um produto com dois descontos sucessivos."
          }),
        L("Razão e proporção",
          "Trabalhar com comparações de grandezas e regra de três.",
          "Frações.",
          "Razão compara duas quantidades; proporção iguala duas razões.",
          "Na proporção a/b = c/d, o produto dos extremos iguala o produto dos meios: ad = bc. Grandezas diretamente proporcionais crescem juntas; inversamente proporcionais, uma cresce enquanto a outra diminui. A regra de três é uma aplicação prática dessa ideia, muito usada em escalas e conversões.",
          [
            ["razão", "Comparação entre duas grandezas por quociente."],
            ["proporção", "Igualdade entre duas razões."],
            ["grandezas diretamente proporcionais", "Grandezas cujos quocientes permanecem constantes."],
            ["grandezas inversamente proporcionais", "Grandezas cujo produto permanece constante."],
            ["escala", "Razão entre uma medida no desenho e a medida real."]
          ],
          {
            ex: [["2/3 = x/12", "x = 8."], ["5 operários fazem uma obra em 12 dias; 10 operários?", "6 dias, relação inversa."]],
            er: ["Trocar direta por inversa.", "Não manter a mesma unidade nas grandezas comparadas."]
          }),
        L("Potências e raízes",
          "Manipular potências, radicais e notação científica.",
          "Multiplicação e frações.",
          "Potências são multiplicações repetidas; raízes são a operação inversa.",
          "Para potências de mesma base, somamos expoentes ao multiplicar e subtraímos ao dividir. Elevada a outra potência, multiplicam-se os expoentes. Expoente negativo indica recíproco e expoente fracionário indica raiz. A raiz quadrada de um número negativo não é real. Notação científica escreve números como a × 10ⁿ com 1 ≤ |a| < 10.",
          [
            ["potência", "Produto de um fator por si mesmo várias vezes."],
            ["expoente", "Número que indica quantas vezes a base é multiplicada."],
            ["raiz quadrada", "Número que elevado ao quadrado resulta no radicando."],
            ["expoente negativo", "Expoente que representa o inverso da potência."],
            ["notação científica", "Escrita de números na forma a × 10ⁿ."]
          ],
          {
            ex: [["2³ × 2⁴", "2⁷ = 128."], ["√81", "9."]],
            er: ["Multiplicar expoentes ao multiplicar potências de mesma base.", "Ignorar a restrição do radicando para raízes pares."],
            lab: "Simplifique (3² × 3⁻¹)² e explique cada regra usada."
          })
      ]
    },
    {
      name: "Álgebra",
      lessons: [
        L("Expressões algébricas",
          "Traduzir situações para linguagem algébrica e simplificar expressões.",
          "Aritmética e precedência.",
          "A álgebra permite escrever padrões e relações usando letras no lugar de números.",
          "Variáveis representam valores; termos são produtos de fatores numéricos e literais; coeficiente é o fator numérico. Somar termos semelhantes exige mesma parte literal e mesmo expoente. A tradução de enunciados exige identificar grandezas, escolher símbolos e respeitar a ordem das operações.",
          [
            ["variável", "Símbolo que representa um valor ainda não fixado."],
            ["termo", "Parcela de uma expressão algébrica separada por + ou −."],
            ["coeficiente", "Fator numérico que multiplica a parte literal de um termo."],
            ["termos semelhantes", "Termos com a mesma parte literal e mesmos expoentes."],
            ["tradução algébrica", "Conversão de uma situação em linguagem matemática."]
          ],
          {
            ex: [["3x + 5x", "8x."], ["o dobro de um número mais 7", "2x + 7."]],
            er: ["Somar termos com partes literais diferentes.", "Trocar 'menos que' pela subtração na ordem errada."]
          }),
        L("Equações lineares e quadráticas",
          "Resolver equações do primeiro e segundo grau e interpretar soluções.",
          "Expressões algébricas.",
          "Resolver uma equação é descobrir quais valores tornam a igualdade verdadeira.",
          "Em equações lineares, isolamos a incógnita usando operações inversas nos dois lados. Equações quadráticas $ax^2+bx+c=0$ podem ser resolvidas por fatoração, completando o quadrado ou pela fórmula de Bhaskara $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$. O discriminante $\\Delta=b^2-4ac$ indica a natureza das raízes: duas reais, uma real dupla ou nenhuma real.",
          [
            ["equação", "Igualdade que contém incógnitas."],
            ["raiz", "Valor da incógnita que satisfaz a equação."],
            ["Bhaskara", "Fórmula para resolver equações do segundo grau."],
            ["discriminante", "Valor Δ = b² − 4ac que determina o número de raízes reais."],
            ["equação equivalente", "Equação com o mesmo conjunto solução."]
          ],
          {
            ex: [["2x + 6 = 14", "x = 4."], ["x² − 5x + 6 = 0", "x = 2 ou x = 3."]],
            er: ["Aplicar operação apenas em um lado da equação.", "Esquecer o ± na fórmula de Bhaskara."],
            lab: "Resolva uma equação quadrática e classifique suas raízes pelo discriminante."
          }),
        L("Inequações",
          "Resolver desigualdades e representar conjuntos solução.",
          "Equações lineares.",
          "Inequações assemelham-se a igualdades, mas usam desigualdades: em vez de um valor, esperamos um intervalo.",
          "As regras lembram as de equações, com um detalhe crucial: multiplicar ou dividir ambos os lados por número negativo inverte o sinal. Na reta numérica, usamos círculo aberto para < e >, fechado para ≤ e ≥. Sistemas de inequações pedem a interseção dos conjuntos solução.",
          [
            ["inequação", "Expressão com sinal de desigualdade entre dois lados."],
            ["conjunto solução", "Conjunto de valores que satisfazem a inequação."],
            ["inversão do sinal", "Troca de < por > ao multiplicar por número negativo."],
            ["intervalo", "Conjunto de números entre dois extremos."],
            ["interseção", "Parte comum a dois ou mais conjuntos."]
          ],
          {
            ex: [["−2x > 6", "x < −3, invertendo o sinal."], ["x ≥ 2 e x < 5", "Intervalo [2, 5)."]],
            er: ["Esquecer de inverter o sinal ao dividir por negativo.", "Usar colchete em extremo aberto."]
          }),
        L("Funções e gráficos",
          "Entender a relação de dependência entre grandezas e representá-la graficamente.",
          "Equações e inequações.",
          "Uma função é uma máquina: para cada entrada, produz exatamente uma saída.",
          "O domínio é o conjunto de entradas permitidas; o contradomínio contém as saídas possíveis; a imagem é o conjunto de saídas realmente atingidas. A função afim f(x)=ax+b tem gráfico reta; a quadrática tem gráfico parábola. O teste da linha vertical verifica se uma relação é função.",
          [
            ["função", "Relação que associa a cada elemento do domínio um único elemento do contradomínio."],
            ["domínio", "Conjunto de valores de entrada permitidos."],
            ["imagem", "Conjunto de valores de saída realmente obtidos."],
            ["função afim", "Função da forma f(x) = ax + b, cujo gráfico é uma reta."],
            ["teste da linha vertical", "Critério que verifica se uma curva representa uma função."]
          ],
          {
            ex: [["f(x) = 2x + 3, f(4)", "11."], ["f(x) = x²", "Parábola com vértice na origem."]],
            er: ["Confundir domínio com imagem.", "Achar que toda relação é função."],
            lab: "Construa a tabela de valores de f(x)=x²−1 e esboce o gráfico."
          }),
        L("Polinômios e fatoração",
          "Operar e fatorar polinômios, conectando raízes e divisibilidade.",
          "Expressões algébricas e funções.",
          "Fatorar é escrever um polinômio como produto de fatores mais simples.",
          "O grau é o maior expoente. Produtos notáveis aceleram a fatoração: diferença de quadrados, quadrado da soma e da diferença. O teorema do resto liga a divisão por (x-a) ao valor P(a). Se P(a)=0, então (x-a) é fator. A fatoração é a ponte entre equações e gráficos, pois revela as raízes.",
          [
            ["polinômio", "Soma de termos da forma aₙxⁿ com expoentes inteiros não negativos."],
            ["grau", "Maior expoente com coeficiente não nulo."],
            ["produto notável", "Identidade algébrica de uso frequente."],
            ["teorema do resto", "Resultado que liga o resto da divisão por x−a ao valor P(a)."],
            ["fatoração", "Escrita de um polinômio como produto de fatores."]
          ],
          {
            ex: [["x² − 9", "(x−3)(x+3)."], ["P(x) = x² − 1, P(1)", "0, logo x−1 é fator."]],
            er: ["Achar que x² + 9 é diferença de quadrados reais.", "Parar a fatoração antes do fim."]
          })
      ]
    },
    {
      name: "Geometria e trigonometria",
      lessons: [
        L("Geometria plana",
          "Calcular áreas, perímetros e ângulos de figuras planas.",
          "Aritmética e equações.",
          "A geometria plana mede formas que cabem em uma folha de papel.",
          "Triângulos têm soma de ângulos internos igual a 180°. O teorema de Pitágoras liga os lados de triângulos retângulos: $a^2 + b^2 = c^2$. Áreas de retângulo, triângulo, círculo e trapézio têm fórmulas próprias. Comprimentos de arco e áreas de setor conectam círculos a ângulos.",
          [
            ["teorema de Pitágoras", "Relação a² + b² = c² válida em triângulos retângulos."],
            ["soma dos ângulos internos", "180° para qualquer triângulo no plano euclidiano."],
            ["área", "Medida da região ocupada por uma figura."],
            ["perímetro", "Soma dos comprimentos dos lados de uma figura."],
            ["semelhança", "Relação entre figuras com mesma forma e proporção de lados."]
          ],
          {
            ex: [["Triângulo retângulo com catetos 3 e 4", "Hipotenusa 5."], ["Círculo de raio 2", "Área 4π."]],
            er: ["Aplicar Pitágoras em triângulo não retângulo.", "Confundir raio com diâmetro."],
            lab: "Calcule a área de um terreno retangular com um canteiro circular."
          }),
        L("Geometria espacial",
          "Trabalhar com volumes e áreas de sólidos e com posições de pontos no espaço.",
          "Geometria plana e raízes.",
          "A geometria espacial estende as ideias do plano para três dimensões.",
          "Prisma, pirâmide, cilindro, cone e esfera têm fórmulas de volume e área superficial. O princípio de Cavalieri compara volumes por seções paralelas. Distância entre pontos no espaço generaliza Pitágoras: √(Δx²+Δy²+Δz²). A visualização é mais difícil, então esquemas ajudam muito.",
          [
            ["volume", "Medida do espaço ocupado por um sólido."],
            ["prisma", "Sólido com duas bases paralelas e congruentes."],
            ["pirâmide", "Sólido com uma base poligonal e vértice comum."],
            ["esfera", "Conjunto de pontos a uma distância constante de um centro."],
            ["distância no espaço", "Generalização tridimensional do teorema de Pitágoras."]
          ],
          {
            ex: [["Cubo de aresta 3", "Volume 27."], ["Distância entre (0,0,0) e (1,2,2)", "3."]],
            er: ["Usar área da base em vez de volume.", "Esquecer o fator 1/3 em pirâmides e cones."]
          }),
        L("Trigonometria",
          "Entender seno, cosseno e tangente e aplicá-los em triângulos e ciclo unitário.",
          "Geometria plana e semelhança.",
          "Trigonometria relaciona ângulos e comprimentos, permitindo medir o que não se alcança diretamente.",
          "Em triângulo retângulo, seno é cateto oposto sobre hipotenusa, cosseno é cateto adjacente sobre hipotenusa e tangente é a razão entre eles. No ciclo unitário, essas razões viram coordenadas. A identidade fundamental $\\sin^2\\theta + \\cos^2\\theta = 1$ é a versão trigonométrica de Pitágoras. Ângulos podem ser medidos em graus ou radianos.",
          [
            ["seno", "Razão entre cateto oposto e hipotenusa."],
            ["cosseno", "Razão entre cateto adjacente e hipotenusa."],
            ["tangente", "Razão entre seno e cosseno."],
            ["ciclo unitário", "Círculo de raio 1 usado para definir funções trigonométricas."],
            ["radiano", "Unidade de medida de ângulo baseada no raio do círculo."]
          ],
          {
            ex: [["sen 30°", "1/2."], ["sen²θ + cos²θ", "1."]],
            er: ["Inverter adjacente e oposto.", "Misturar graus e radians na calculadora."],
            lab: "Meça a altura de um objeto usando tangente e uma distância conhecida."
          }),
        L("Vetores no plano e no espaço",
          "Representar e operar vetores, entendendo magnitude e direção.",
          "Geometria espacial e trigonometria.",
          "Vetores descrevem grandezas que têm tamanho e direção, como deslocamento e velocidade.",
          "Um vetor pode ser escrito por componentes. Soma e subtração operam componente a componente; produto por escalar multiplica cada componente. O produto escalar mede alinhamento e é zero quando os vetores são perpendiculares. O produto vetorial no espaço gera um vetor perpendicular ao plano definido por dois vetores.",
          [
            ["vetor", "Grandeza com magnitude e direção."],
            ["componente", "Coordenada de um vetor em um dos eixos."],
            ["módulo", "Comprimento ou magnitude de um vetor."],
            ["produto escalar", "Operação que resulta em um escalar e mede alinhamento."],
            ["vetor unitário", "Vetor de módulo igual a 1."]
          ],
          {
            ex: [["(1,2) + (3,−1)", "(4,1)."], ["Produto escalar de (1,0) e (0,1)", "0, são perpendiculares."]],
            er: ["Confundir vetor com ponto.", "Esquecer de normalizar ao buscar vetor unitário."]
          }),
        L("Geometria analítica",
          "Descrever retas, círculos e distâncias por meio de coordenadas.",
          "Funções e vetores.",
          "A geometria analítica traduz formas em equações, permitindo resolver problemas com álgebra.",
          "A distância entre dois pontos vem de Pitágoras. A equação da reta pode ser explícita y=mx+b, onde m é a inclinação, ou geral Ax+By+C=0. Retas paralelas têm mesma inclinação; perpendiculares têm inclinações cujo produto é −1. O círculo de centro (a,b) e raio r satisfaz (x−a)²+(y−b)²=r².",
          [
            ["inclinação", "Coeficiente angular m da reta, razão entre variações de y e x."],
            ["equação explícita da reta", "Forma y = mx + b."],
            ["distância entre pontos", "Comprimento do segmento ligando dois pontos."],
            ["ponto médio", "Ponto equidistante de dois pontos dados."],
            ["equação do círculo", "Relação (x−a)² + (y−b)² = r²."]
          ],
          {
            ex: [["Reta por (0,1) com inclinação 2", "y = 2x + 1."], ["Distância entre (0,0) e (3,4)", "5."]],
            er: ["Trocar a ordem na fórmula da inclinação.", "Esquecer o sinal do termo independente."]
          })
      ]
    }
  ]
};

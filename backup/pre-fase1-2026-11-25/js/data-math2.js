/* ============================================================
   FORGE — data-math2.js — Trilha Matemática (parte 2)
   ============================================================ */

CURRICULUM.math.modules.push(
  {
    name: "Cálculo diferencial e integral",
    lessons: [
      L("Limites e continuidade",
        "Entender o comportamento de funções ao se aproximar de um ponto.",
        "Funções e polinômios.",
        "O limite pergunta para onde a função caminha, não necessariamente o que acontece no ponto.",
        "O limite de f(x) quando x tende a a é L se f(x) pode ficar tão próxima de L quanto desejarmos, desde que x esteja suficientemente próximo de a. Limites laterais podem diferir; para o limite existir, devem coincidir. Uma função é contínua em a quando o limite existe, a função está definida e ambos coincidem. Indeterminações como 0/0 exigem manipulação algébrica.",
        [
          ["limite", "Valor ao qual os valores da função se aproximam quando a variável se aproxima de um ponto."],
          ["limite lateral", "Limite calculado aproximando-se do ponto apenas pela esquerda ou pela direita."],
          ["continuidade", "Propriedade de uma função cujo gráfico não tem saltos no ponto analisado."],
          ["indeterminação", "Expressão como 0/0 ou ∞/∞ que não revela o valor do limite diretamente."],
          ["assíntota", "Reta à qual o gráfico se aproxima indefinidamente."]
        ],
        {
          ex: [["lim (x²−1)/(x−1) quando x→1", "2, após simplificar para x+1."], ["f(x)=1/x em x=0", "Limite lateral infinito e função descontínua."]],
          er: ["Substituir diretamente e aceitar 0/0 como resposta.", "Ignorar limites laterais em funções com salto."],
          lab: "Avalie o limite de (x²−4)/(x−2) quando x tende a 2 passo a passo."
        }),
      L("Derivadas",
        "Calcular taxas de variação instantâneas usando regras de derivação.",
        "Limites e funções.",
        "A derivada mede o quanto a função muda em um ponto muito pequeno, como a velocidade instantânea.",
        "A derivada é definida como limite da razão incremental. Regras práticas: $\\frac{d}{dx}x^n = n x^{n-1}$; derivadas de seno e cosseno são cosseno e menos seno; derivada de $e^x$ é $e^x$; derivada de $\\ln x$ é $1/x$. As regras do produto, quociente e cadeia permitem derivar funções compostas. A derivada é a inclinação da reta tangente ao gráfico.",
        [
          ["derivada", "Taxa de variação instantânea de uma função em um ponto."],
          ["regra da cadeia", "Regra para derivar funções compostas."],
          ["regra do produto", "Regra para derivar o produto de duas funções."],
          ["reta tangente", "Reta que toca o gráfico em um ponto com a mesma inclinação da curva."],
          ["taxa de variação", "Razão entre a variação de uma grandeza e a variação de outra."]
        ],
        {
          ex: [["d/dx (x³)", "3x²."], ["d/dx sen(2x)", "2cos(2x), pela regra da cadeia."]],
          er: ["Esquecer o fator interno na regra da cadeia.", "Derivar o produto como produto das derivadas."],
          lab: "Derive f(x) = x²·eˣ usando a regra do produto."
        }),
      L("Aplicações das derivadas",
        "Usar derivadas para otimizar grandezas e analisar o comportamento de funções.",
        "Derivadas.",
        "Se a derivada é a inclinação, ela revela onde a função sobe, desce ou achata.",
        "Pontos críticos ocorrem onde a derivada é zero ou não existe. O teste da primeira derivada analisa mudança de sinal para classificar máximos e mínimos; a segunda derivada informa concavidade e pode classificar pontos críticos. Problemas de otimização pedem modelar a grandeza em uma variável, derivar e interpretar o resultado dentro do domínio do problema.",
        [
          ["ponto crítico", "Ponto do domínio onde a derivada é zero ou inexistente."],
          ["máximo local", "Ponto cujo valor é maior que os valores vizinhos."],
          ["mínimo local", "Ponto cujo valor é menor que os valores vizinhos."],
          ["concavidade", "Direção em que a curva se abre, indicada pelo sinal da segunda derivada."],
          ["otimização", "Processo de encontrar o maior ou menor valor de uma grandeza."]
        ],
        {
          ex: [["f'(x) = 0", "Indica ponto crítico candidato a extremo."], ["f''(x) > 0", "Indica concavidade para cima."]],
          er: ["Assumir que todo ponto crítico é extremo.", "Ignorar as bordas do domínio em problemas reais."],
          lab: "Encontre as dimensões de um retângulo de perímetro fixo com área máxima."
        }),
      L("Integrais",
        "Calcular integrais indefinidas e definidas e interpretá-las geometricamente.",
        "Derivadas.",
        "Integrar é o caminho inverso de derivar, somando infinitas contribuições pequenas.",
        "A integral indefinida representa a família de primitivas e inclui a constante C. A integral definida $\\int_a^b f(x)\\,dx$ é o limite de somas de Riemann e, pelo teorema fundamental do cálculo, equivale a $F(b) - F(a)$. Geometricamente, frequentemente representa área assinada sob a curva. Técnicas básicas incluem substituição e integração por partes.",
        [
          ["integral indefinida", "Conjunto de primitivas de uma função, incluindo a constante C."],
          ["integral definida", "Número obtido pela integral entre limites a e b."],
          ["primitiva", "Função cuja derivada é a função dada."],
          ["teorema fundamental do cálculo", "Resultado que liga integração e derivação."],
          ["soma de Riemann", "Aproximação da área por soma de retângulos."]
        ],
        {
          ex: [["∫ 2x dx", "x² + C."], ["∫₀¹ x² dx", "1/3."]],
          er: ["Esquecer a constante C em integrais indefinidas.", "Ignorar áreas negativas em integrais definidas."],
          lab: "Calcule a área sob y = x entre 0 e 3 usando integral definida."
        }),
      L("Aplicações das integrais",
        "Aplicar integração a áreas, volumes e problemas de acumulação.",
        "Integrais.",
        "Integrais permitem somar quantidades que mudam continuamente.",
        "A área entre duas curvas é a integral da diferença das funções no intervalo onde uma está acima da outra. Volumes de sólidos de rotação podem ser calculados por discos ou cascas. Em física, integrar velocidade fornece deslocamento; integrar uma taxa de fluxo fornece o total acumulado. A escolha do elemento de integração simplifica muito o cálculo.",
        [
          ["área entre curvas", "Integral da diferença entre a função superior e a inferior."],
          ["sólido de rotação", "Sólido gerado ao girar uma região em torno de um eixo."],
          ["acumulação", "Soma contínua de uma taxa ao longo do tempo."],
          ["método dos discos", "Técnica de volume que soma discos perpendiculares ao eixo."],
          ["valor médio", "Integral dividida pelo comprimento do intervalo."]
        ],
        {
          ex: [["∫ v(t) dt", "Deslocamento acumulado a partir da velocidade."], ["Área entre y=x e y=x² em [0,1]", "1/6."]],
          er: ["Integrar sem identificar qual curva está acima.", "Esquecer a espessura no elemento de volume."],
          lab: "Calcule o volume gerado ao girar y = x em torno do eixo x de 0 a 2."
        }),
      L("Séries e sequências",
        "Analisar sequências numéricas, séries e convergência.",
        "Limites e integrais.",
        "Séries somam infinitos termos; a questão central é se essa soma se estabiliza.",
        "Uma sequência é uma função dos naturais nos reais; converge se seus termos se aproximam de um limite. Uma série é a soma dos termos de uma sequência e converge se a sequência de somas parciais converge. Testes comuns: teste do termo geral, comparação, razão e integral. Séries de potências representam funções em torno de um ponto e têm raio de convergência.",
        [
          ["sequência", "Lista ordenada de números indexada pelos naturais."],
          ["série", "Soma dos termos de uma sequência."],
          ["soma parcial", "Soma dos primeiros n termos de uma série."],
          ["convergência", "Propriedade de uma sequência ou série que se aproxima de um limite finito."],
          ["série de potências", "Série cujos termos envolvem potências de uma variável."]
        ],
        {
          ex: [["Soma geométrica 1/2 + 1/4 + ...", "1."], ["Teste do termo geral", "Se o termo não tende a zero, a série diverge."]],
          er: ["Achar que termos tendendo a zero garantem convergência.", "Confundir sequência com série."],
          lab: "Classifique a série harmônica quanto à convergência e justifique."
        })
    ]
  },
  {
    name: "Álgebra linear, probabilidade e estatística",
    lessons: [
      L("Matrizes e determinantes",
        "Operar com matrizes e calcular determinantes.",
        "Sistemas de equações e funções.",
        "Matrizes organizam dados em linhas e colunas e permitem transformações lineares compactas.",
        "Uma matriz m×n tem m linhas e n colunas. Soma e subtração exigem mesmas dimensões; multiplicação exige compatibilidade interna. A matriz identidade é o elemento neutro da multiplicação. O determinante é um escalar que indica se a matriz é invertível: determinante não nulo implica inversa existe. Ele também mede fator de escala de área ou volume.",
        [
          ["matriz", "Arranjo retangular de números em linhas e colunas."],
          ["determinante", "Escalar associado a uma matriz quadrada que indica invertibilidade."],
          ["matriz identidade", "Matriz quadrada com 1 na diagonal e 0 fora dela."],
          ["matriz invertível", "Matriz que possui outra matriz cujo produto é a identidade."],
          ["transposta", "Matriz obtida trocando linhas por colunas."]
        ],
        {
          ex: [["det [[a,b],[c,d]]", "ad − bc."], ["det igual a zero", "Matriz singular, sem inversa."]],
          er: ["Multiplicar matrizes trocando a ordem.", "Tentar somar matrizes de dimensões diferentes."],
          lab: "Calcule o determinante de uma matriz 3×3 e interprete o resultado."
        }),
      L("Sistemas lineares",
        "Resolver sistemas de equações lineares e classificar suas soluções.",
        "Matrizes e equações.",
        "Um sistema linear representa várias restrições simultâneas sobre as mesmas incógnitas.",
        "Um sistema pode ter solução única, nenhuma solução ou infinitas soluções. Métodos incluem substituição, eliminação de Gauss e uso da matriz inversa quando ela existe. A forma escalonada revela o posto da matriz e permite classificar o sistema pelo teorema de Rouché–Capelli. Geometricamente, cada equação é uma reta ou plano.",
        [
          ["sistema linear", "Conjunto de equações lineares com variáveis em comum."],
          ["eliminação de Gauss", "Método que transforma o sistema em forma escalonada."],
          ["posto", "Número de linhas ou colunas linearmente independentes de uma matriz."],
          ["sistema inconsistente", "Sistema sem solução."],
          ["sistema indeterminado", "Sistema com infinitas soluções."]
        ],
        {
          ex: [["x + y = 3 e x − y = 1", "x = 2, y = 1."], ["det da matriz de coeficientes ≠ 0", "Solução única."]],
          er: ["Parar a escalonagem antes de analisar a última linha.", "Interpretar linha de zeros como erro."],
          lab: "Resolva um sistema 3×3 por eliminação de Gauss e classifique-o."
        }),
      L("Espaços vetoriais",
        "Entender independência linear, base, dimensão e transformações lineares.",
        "Vetores e matrizes.",
        "Espaços vetoriais generalizam a ideia de vetores: qualquer conjunto fechado sob soma e multiplicação por escalar.",
        "Um conjunto de vetores é linearmente independente se nenhum deles pode ser escrito como combinação dos demais. Uma base é um conjunto independente que gera todo o espaço; o número de vetores da base é a dimensão. Transformações lineares preservam soma e multiplicação por escalar e podem ser representadas por matrizes. Autovetores mudam apenas de escala sob uma transformação.",
        [
          ["independência linear", "Propriedade em que nenhum vetor é combinação linear dos demais."],
          ["base", "Conjunto linearmente independente que gera todo o espaço."],
          ["dimensão", "Número de vetores em uma base do espaço."],
          ["transformação linear", "Função entre espaços vetoriais que preserva soma e escalar."],
          ["autovetor", "Vetor que, sob uma transformação, apenas é multiplicado por um escalar."]
        ],
        {
          ex: [["Base de R²", "{(1,0), (0,1)}."], ["Autovalor λ", "Satisfaz A·v = λ·v para autovetor não nulo."]],
          er: ["Incluir o vetor zero em uma base.", "Confundir gerar com ser independente."]
        }),
      L("Combinatória",
        "Contar possibilidades usando princípios de contagem, permutações e combinações.",
        "Aritmética e produtos.",
        "Combinatória responde 'quantas formas?' sem precisar listar todas.",
        "O princípio multiplicativo conta sequências de escolhas independentes; o aditivo conta casos mutuamente exclusivos. Permutação ordena elementos; combinação seleciona sem ordenar. Fatoriais aparecem nas fórmulas. O princípio da inclusão–exclusão evita contar duas vezes elementos em interseções.",
        [
          ["princípio multiplicativo", "Multiplica o número de formas de cada etapa independente."],
          ["permutação", "Arranjo ordenado de elementos."],
          ["combinação", "Seleção de elementos sem importar a ordem."],
          ["fatorial", "Produto de todos os inteiros positivos até n, denotado n!."],
          ["inclusão-exclusão", "Técnica que corrige contagens duplicadas em uniões de conjuntos."]
        ],
        {
          ex: [["Permutar 4 livros", "4! = 24 formas."], ["Escolher 2 de 5 pessoas", "C(5,2) = 10."]],
          er: ["Ordenar quando a ordem não importa.", "Esquecer de subtrair interseções."],
          lab: "Conte de quantas formas um comitê de 3 pessoas pode sair de 8 candidatos."
        }),
      L("Probabilidade",
        "Calcular probabilidades em espaços amostrais finitos e usar condicionamento.",
        "Combinatória e frações.",
        "Probabilidade mede quanto um evento é provável, variando de 0 a 1.",
        "P(A) = casos favoráveis / casos possíveis quando todos são equiprováveis. Eventos complementares somam 1. Eventos independentes satisfazem P(A∩B)=P(A)P(B). Probabilidade condicional é P(A|B)=P(A∩B)/P(B), e o teorema de Bayes inverte condicionamentos. Árvores e diagramas ajudam a visualizar.",
        [
          ["espaço amostral", "Conjunto de todos os resultados possíveis de um experimento."],
          ["evento", "Subconjunto do espaço amostral."],
          ["eventos independentes", "Eventos cuja ocorrência de um não afeta a probabilidade do outro."],
          ["probabilidade condicional", "Probabilidade de um evento dado que outro já ocorreu."],
          ["teorema de Bayes", "Regra para atualizar probabilidades com nova informação."]
        ],
        {
          ex: [["Dado justo, P(par)", "3/6 = 1/2."], ["P(A|B)", "P(A∩B)/P(B)."]],
          er: ["Somar probabilidades de eventos não mutuamente exclusivos.", "Assumir independência sem verificar."],
          lab: "Calcule a probabilidade de obter pelo menos um cara em duas moedas."
        }),
      L("Estatística descritiva e inferência",
        "Resumir dados e compreender os fundamentos da inferência estatística.",
        "Probabilidade e raízes.",
        "Estatística transforma uma lista de números em informação compreensível e depois generaliza para uma população.",
        "Medidas de tendência central incluem média, mediana e moda; medidas de dispersão incluem variância e desvio padrão. A média é sensível a outliers, a mediana não. A distribuição normal é comum e descrita por média e desvio. Intervalos de confiança e testes de hipótese permitem inferir parâmetros a partir de amostras, sempre com margem de erro.",
        [
          ["média", "Soma dos valores dividida pela quantidade de observações."],
          ["mediana", "Valor central de um conjunto ordenado."],
          ["desvio padrão", "Raiz da variância; mede dispersão em unidades dos dados."],
          ["distribuição normal", "Distribuição simétrica em forma de sino."],
          ["intervalo de confiança", "Faixa de valores plausíveis para um parâmetro populacional."]
        ],
        {
          ex: [["Média de 2, 4, 6", "4."], ["Mediana de 1, 3, 9", "3."]],
          er: ["Usar média quando há outliers extremos.", "Confundir amostra com população."],
          lab: "Calcule média, mediana e desvio padrão de um conjunto de notas."
        })
    ]
  }
);

/* FORGE — Matemática básica */

CURRICULUM.mathfund = { name: "Matemática — Fundamentos", icon: "🧮", modules: [] };
CURRICULUM.mathfund.modules.push(
  {
    name: "Números e operações",
    lessons: [
      L("Números naturais",
        "Contar, comparar e representar quantidades com os números naturais.",
        "Nenhum: comece do absoluto zero.",
        "Natural é o número que aparece quando contamos objetos, um por um.",
        "A sequência $0, 1, 2, 3, \\ldots$ forma o conjunto dos números naturais, denotado por $\\mathbb{N}$. Na maioria dos cursos o zero faz parte desse conjunto; quando queremos excluí-lo, escrevemos $\\mathbb{N}^{*}$ ou $\\mathbb{N}_{+}$ e dizemos naturais não nulos. Essa convenção varia entre livros, então vale sempre conferir a definição adotada.\nCada natural tem um sucessor, obtido somando 1, e um predecessor (exceto o zero, conforme a convenção). O conjunto é fechado para a adição e a multiplicação: somar ou multiplicar naturais dá outro natural. Não é fechado para a subtração nem para a divisão: $3 - 5$ e $3 \\div 2$ já pedem conjuntos maiores. Essa limitação é o que motiva as próximas aulas.\nNa escrita decimal, a posição de cada algarismo define seu valor: em 305 temos $3 \\cdot 100 + 0 \\cdot 10 + 5 \\cdot 1$, e o zero é um marcador de posição indispensável. Para comparar dois naturais, compare primeiro a quantidade de algarismos; se forem iguais, compare da esquerda para a direita, começando pela posição de maior valor.",
        [
          ["conjunto dos naturais", "Conjunto formado por 0, 1, 2, 3 e assim por diante, usado para contar e ordenar quantidades."],
          ["sucessor", "Número natural que vem logo depois de outro, obtido somando uma unidade."],
          ["algarismo", "Símbolo de 0 a 9 usado para escrever os números em base dez."],
          ["valor posicional", "Valor de um algarismo determinado pela posição que ele ocupa no número."],
          ["natural não nulo", "Conjunto dos naturais sem o zero, formado por 1, 2, 3 e assim por diante."]
        ],
        {
          ex: [["Comparar 37 e 73", "37 tem 3 dezenas e 7 unidades; 73 tem 7 dezenas e 3 unidades. Como 7 dezenas superam 3 dezenas, temos $73 > 37$."], ["Decompor 2 048", "Escreva $2 \\cdot 1000 + 0 \\cdot 100 + 4 \\cdot 10 + 8 \\cdot 1$. Sem o zero da posição das centenas, o número seria 248, que é bem menor."]],
          er: ["Escrever 305 como 35, ignorando o zero como marcador de posição.", "Afirmar que $3 - 5$ é natural apenas porque 3 e 5 são naturais.", "Decidir que o conjunto dos naturais começa sempre em 1, sem perceber que a convenção com zero é a mais usada."],
          lab: "Liste os primeiros 20 naturais, circule os pares e verifique que o sucessor de um ímpar é sempre par; escreva uma frase explicando o padrão.",
          ref: "Khan Academy, curso de aritmética — contagem e valor posicional (pt.khanacademy.org)."
        }),
      L("Números inteiros",
        "Representar, ordenar e operar com números positivos, negativos e o zero.",
        "Números naturais e a ideia de sucessor.",
        "Temperatura negativa e dívida mostram que precisamos de números antes do zero.",
        "Ao juntar os naturais aos seus opostos, obtemos $\\mathbb{Z} = \\{\\ldots, -3, -2, -1, 0, 1, 2, 3, \\ldots\\}$. O sinal de menos não é uma ferida no número: ele indica uma posição à esquerda do zero na reta numérica. Assim, $-3$ fica entre $-4$ e $-2$, e quanto mais à esquerda, menor o número.\nA distância de um número até o zero é seu valor absoluto, ou módulo: $|-5| = 5$ e $|5| = 5$. Por isso $-7 < -3$ mesmo sendo $7 > 3$: comparamos as posições na reta, não os módulos. O oposto de $a$ é $-a$, pois $a + (-a) = 0$.\nOs inteiros são fechados para adição, subtração e multiplicação, mas não para divisão: $7 \\div 2$ não é inteiro. Nas operações com sinais, some os módulos e mantenha o sinal quando os sinais são iguais; subtraia os módulos e use o sinal do maior módulo quando são opostos. Subtrair um número é o mesmo que somar seu oposto: $a - b = a + (-b)$.",
        [
          ["conjunto dos inteiros", "Conjunto formado pelos naturais e pelos opostos dos naturais não nulos."],
          ["oposto", "Número que, somado ao original, resulta em zero, como -5 é o oposto de 5."],
          ["valor absoluto", "Distância de um número ao zero na reta numérica, sempre não negativa."],
          ["reta numérica", "Representação gráfica dos números em posições ordenadas, com o zero na origem."],
          ["inteiro negativo", "Inteiro menor que zero, escrito com sinal de menos na sua frente."]
        ],
        {
          ex: [["Localizar e comparar -3 e -7", "Na reta, -7 está mais à esquerda que -3; portanto $-7 < -3$, embora $7 > 3$."], ["Calcular $|-5| + 2$ e $-4 - 7$", "Temos $|-5| = 5$, logo $5 + 2 = 7$. Já $-4 - 7 = -4 + (-7) = -11$, somando módulos e preservando o sinal negativo."]],
          er: ["Afirmar que $-7 > -3$ porque 7 é maior que 3.", "Trocar $|-4|$ por $-4$, confundindo módulo com sinal.", "Dizer que a divisão de dois inteiros sempre resulta em inteiro."],
          lab: "Registre em uma tabela: ganhei 8, gastei 12, ganhei 3. Escreva a soma com sinais, calcule o saldo e interprete o resultado em palavras.",
          ref: "OpenStax, Prealgebra — inteiros, reta numérica e valor absoluto (openstax.org)."
        }),
      L("Números racionais",
        "Reconhecer e comparar números que podem ser escritos como fração.",
        "Inteiros e a ideia de divisão.",
        "Meia pizza, um terço de hora e dois inteiros são todos racionais.",
        "Um número é racional quando pode ser escrito na forma $\\frac{a}{b}$, com $a$ e $b$ inteiros e $b \\neq 0$. Todo inteiro é racional, pois $2 = \\frac{2}{1} = \\frac{6}{3}$. A exigência de denominador não nulo é absoluta: dividir por zero não tem sentido na aritmética, porque nenhum número multiplicado por zero recupera o numerador.\nFrações diferentes podem representar o mesmo racional. Multiplicando numerador e denominador por um mesmo fator não nulo, obtemos uma fração equivalente: $\\frac{2}{3} = \\frac{8}{12} = \\frac{20}{30}$. Simplificar é o caminho inverso: dividimos ambos por um fator comum até chegar à forma irredutível. A comparação pode ser feita com denominador comum ou por produtos cruzados, sempre com denominadores positivos.\nOs racionais são densos: entre quaisquer dois racionais distintos existe outro racional. Por exemplo, a média $\\frac{1}{2}\\left(\\frac{1}{3} + \\frac{1}{2}\\right)$ está entre $\\frac{1}{3}$ e $\\frac{1}{2}$. Decimalmente, todo racional é finito ou periódico; essa será a ponte para a aula sobre conversão.",
        [
          ["número racional", "Número que pode ser escrito como uma fração a/b com a e b inteiros e b diferente de zero."],
          ["fração equivalente", "Frações diferentes que representam o mesmo número, obtidas multiplicando numerador e denominador pelo mesmo fator."],
          ["denominador", "Número abaixo da barra da fração que indica em quantas partes iguais o todo foi dividido."],
          ["densidade", "Propriedade dos racionais pela qual existe outro racional entre dois racionais distintos."],
          ["representação decimal", "Escrita de um racional como decimal finito ou como dízima periódica."]
        ],
        {
          ex: [["Mostrar que 2 é racional", "Escreva $2 = \\frac{2}{1}$ e também $2 = \\frac{6}{3}$. Como há pelo menos uma escrita com denominador inteiro não nulo, 2 é racional."], ["Encontrar um racional entre $\\frac{1}{3}$ e $\\frac{1}{2}$", "Calcule a média: $\\frac{1}{2}\\left(\\frac{1}{3}+\\frac{1}{2}\\right) = \\frac{1}{2}\\cdot\\frac{5}{6} = \\frac{5}{12}$, que fica entre os dois números."]],
          er: ["Aceitar $\\frac{5}{0}$ como fração válida.", "Achar que apenas números escritos com barra de fração são racionais, excluindo os inteiros.", "Simplificar dividindo somente o numerador por um fator comum."],
          lab: "Marque 0, $\\frac{1}{2}$ e 1 em uma régua; encontre três racionais entre $\\frac{1}{2}$ e 1 e justifique a ordem usando denominador comum.",
          ref: "OpenStax, Elementary Algebra — frações e números racionais (openstax.org)."
        }),
      L("Números irracionais",
        "Identificar números que não são razão de inteiros e lidar com aproximações.",
        "Números racionais e raiz quadrada de quadrados perfeitos.",
        "A diagonal de um quadrado de lado 1 não cabe em nenhuma fração exata.",
        "Chamamos de irracional todo número real que não pode ser escrito como $\\frac{a}{b}$ com inteiros $a$ e $b \\neq 0$. O exemplo clássico é $\\sqrt{2}$, a diagonal de um quadrado de lado 1 pelo teorema de Pitágoras. A prova de que ele é irracional é elegante: se $\\sqrt{2} = \\frac{a}{b}$ na forma reduzida, então $a^2 = 2b^2$; daí $a$ é par, logo $a^2$ é múltiplo de 4, o que força $b$ a ser par também, contradizendo a forma reduzida.\nOutros irracionais familiares são $\\pi$, a razão entre circunferência e diâmetro de qualquer círculo, e $e$, base dos logaritmos naturais. Suas escritas decimais são infinitas e não periódicas: não há bloco de algarismos que se repita para sempre. Ao contrário, $\\frac{1}{7} = 0,\\overline{142857}$ é racional justamente porque o período se repete.\nNa prática usamos aproximações como $1,41$ para $\\sqrt{2}$ ou $3,14$ para $\\pi$, mas elas não são valores exatos. Cuidado com generalizações: nem toda raiz é irracional, pois $\\sqrt{9} = 3$ e $\\sqrt{\\frac{4}{25}} = \\frac{2}{5}$ são racionais. A classificação depende do número, não do símbolo usado para representá-lo.",
        [
          ["número irracional", "Número real que não pode ser escrito como razão de dois inteiros."],
          ["raiz quadrada de 2", "Exemplo clássico de irracional, igual à diagonal de um quadrado de lado um."],
          ["dízima não periódica", "Decimal infinito cujas casas não se repetem em bloco fixo."],
          ["número pi", "Razão entre a circunferência e o diâmetro de um círculo, que é irracional."],
          ["aproximação", "Valor decimal simples usado no lugar de um irracional, com erro controlado."]
        ],
        {
          ex: [["Justificar que $\\sqrt{2}$ é irracional", "Suponha $\\sqrt{2}=\\frac{a}{b}$ reduzida. Então $a^2=2b^2$, o que torna $a$ par; escrevendo $a=2k$ vem $b^2=2k^2$, logo $b$ também é par. Contradição: a fração não estava reduzida."], ["Comparar $\\sqrt{2}$ e $1,5$", "Elevando ao quadrado (valores positivos): $(1,5)^2 = 2,25 > 2$, portanto $\\sqrt{2} < 1,5$. A aproximação 1,41 é mais próxima do valor exato."]],
          er: ["Afirmar que toda raiz quadrada é irracional, citando $\\sqrt{9}$ como exemplo.", "Usar 3,14 como se fosse o valor exato de $\\pi$.", "Classificar $0,1010010001\\ldots$ como racional só porque é decimal."],
          lab: "Construa um quadrado de lado 1 em papel milimetrado, meça a diagonal com régua e compare com $\\sqrt{2}$; discuta por que toda medição tem erro.",
          ref: "Khan Academy, álgebra — números irracionais e raízes (pt.khanacademy.org)."
        }),
      L("Números reais",
        "Reunir racionais e irracionais e usar a reta contínua e notação de intervalos.",
        "Números racionais e irracionais.",
        "A reta numérica não tem buracos: cada ponto é um número real.",
        "O conjunto dos reais, $\\mathbb{R}$, é a união dos racionais ($\\mathbb{Q}$) com os irracionais. São conjuntos disjuntos: nenhum número é ao mesmo tempo razão de inteiros e irracional. Juntos preenchem a reta numérica inteira, o que permite medir comprimentos, áreas, tempo e qualquer grandeza contínua.\nA propriedade que distingue os reais dos racionais é a completude: não existem lacunas. Intuitivamente, se dividirmos um conjunto limitado de reais em dois lados, há um número que faz a fronteira. Em linguagem mais precisa, todo conjunto não vazio e limitado superiormente admite um menor limitante superior. É essa propriedade que garante, por exemplo, que $\\sqrt{2}$ exista como ponto da reta.\nAs operações de adição, subtração, multiplicação e divisão (com divisor não nulo) permanecem nos reais. A única ressalva comum é a raiz de expoente par de número negativo: como $x^2 \\geq 0$ para todo real $x$, não há $\\sqrt{-4}$ em $\\mathbb{R}$. Intervalos como $(1,4]$, $[1,4]$ e $(1,4)$ descrevem fatias da reta; o parênteses exclui a extremidade e o colchete a inclui.",
        [
          ["conjunto dos reais", "União dos números racionais e irracionais, representada por todos os pontos da reta numérica."],
          ["completude", "Propriedade dos reais de não terem lacunas, garantindo a existência de limites superiores."],
          ["intervalo", "Conjunto de reais entre dois limites, escrito com parênteses ou colchetes."],
          ["raiz de número negativo", "Operação sem resultado real, pois o quadrado de qualquer real é não negativo."],
          ["menor limitante superior", "Menor número que é maior ou igual a todos os elementos de um conjunto."]
        ],
        {
          ex: [["Classificar $-2$, $\\frac{3}{4}$ e $\\sqrt{3}$", "$-2 = \\frac{-2}{1}$ e $\\frac{3}{4}$ são racionais; $\\sqrt{3}$ é irracional. Os três pertencem a $\\mathbb{R}$."], ["Escrever o intervalo de $1 < x \\leq 4$", "Temos $(1,4]$: aberto em 1, que está excluído, e fechado em 4, que está incluído."]],
          er: ["Procurar o menor real positivo, como se a reta tivesse um primeiro ponto depois do zero.", "Escrever $\\sqrt{-4}$ como se fosse um número real.", "Confundir $(1,4)$ com $[1,4]$ e incluir extremidades que a desigualdade exclui."],
          lab: "Marque na reta $-1$, $0$, $\\frac{1}{2}$, $\\sqrt{2}$ e $2$; depois escreva três intervalos que contenham exatamente dois desses pontos.",
          ref: "OpenStax, Elementary Algebra — números reais e notação de intervalos (openstax.org)."
        }),
      L("Operações básicas e propriedades",
        "Usar propriedades das operações para reorganizar cálculos com segurança.",
        "Conjuntos numéricos e noção de operação.",
        "A ordem das contas pode mudar, mas certas trocas nunca alteram o resultado.",
        "Uma operação é uma regra que associa a dois números um terceiro. A adição e a multiplicação são comutativas: $a+b=b+a$ e $ab=ba$. Também são associativas: $(a+b)+c=a+(b+c)$ e $(ab)c=a(bc)$. Essas propriedades explicam por que podemos reagrupar parcelas ou fatores sem medo de errar, o que é especialmente útil no cálculo mental.\nOs elementos neutros são 0 para a adição ($a+0=a$) e 1 para a multiplicação ($a\\cdot1=a$). Já os elementos inversos são $-a$ na adição, pois $a+(-a)=0$, e $\\frac{1}{a}$ na multiplicação para $a \\neq 0$, pois $a\\cdot\\frac{1}{a}=1$. O zero não tem inverso multiplicativo: não existe número que multiplicado por 0 devolva 1.\nA propriedade distributiva, $a(b+c)=ab+ac$, é a ponte entre multiplicação e adição e aparece desde a tabuada até a álgebra. Atenção: subtração e divisão não são comutativas nem associativas. Em $8-3$ e $3-8$ os resultados diferem; em $12\\div(6\\div2)$ e $(12\\div6)\\div2$ também. Por isso as propriedades devem ser aplicadas apenas onde valem.",
        [
          ["propriedade comutativa", "Propriedade que permite trocar a ordem sem alterar o resultado, válida na adição e na multiplicação."],
          ["propriedade associativa", "Propriedade que permite mudar o agrupamento sem alterar o resultado, válida na adição e na multiplicação."],
          ["elemento neutro", "Número que preserva o outro na operação: zero na adição e um na multiplicação."],
          ["elemento inverso", "Número que compõe com o original e dá o elemento neutro: -a na adição e 1/a na multiplicação."],
          ["propriedade distributiva", "Regra expressa por a(b+c)=ab+ac, que liga multiplicação e adição."]
        ],
        {
          ex: [["Calcular $27+38+73$ com propriedades", "Reagrupe pela associativa e comutativa: $(27+73)+38 = 100+38 = 138$. O resultado é o mesmo, com muito menos esforço."], ["Expandir $4(10+2)$", "Aplique a distributiva nos dois termos: $4\\cdot10 + 4\\cdot2 = 40+8 = 48$."]],
          er: ["Aplicar comutatividade à subtração e afirmar que $8-3 = 3-8$.", "Procurar o inverso multiplicativo de zero.", "Distribuir a multiplicação apenas ao primeiro termo dentro do parênteses."],
          lab: "Reescreva $6\\cdot99$ de dois modos usando propriedades — por exemplo $6(100-1)$ e $(5+1)\\cdot99$ — e compare com a multiplicação direta.",
          ref: "OpenStax, Elementary Algebra — propriedades dos números reais (openstax.org)."
        }),
      L("Adição e subtração",
        "Somar e subtrair com alinhamento correto e regras de sinais.",
        "Valor posicional e inteiros.",
        "Somar é juntar; subtrair é medir a distância ou tirar uma parte.",
        "Na adição, as quantidades somadas chamam-se parcelas e o resultado é a soma. Na subtração, temos minuendo, subtraendo e diferença. Geometricamente, somar é deslocar-se para a direita na reta; subtrair é deslocar-se para a esquerda. A operação de subtrair pode ser reescrita como adição do oposto: $a-b=a+(-b)$, ideia que elimina grande parte da confusão com sinais.\nNo algoritmo tradicional, alinhamos unidades com unidades, dezenas com dezenas, e assim por diante. Quando a soma de uma coluna passa de 9, levamos uma unidade para a coluna seguinte (o chamado vai-um). Na subtração, quando o algarismo de cima é menor, pedimos uma unidade emprestada da coluna à esquerda: é o vaum. O alinhamento pela direita, e não pela esquerda, é o que garante o acerto.\nCom números negativos, some os módulos e preserve o sinal comum quando os sinais são iguais: $-4 + (-7) = -11$. Quando os sinais diferem, subtraia o menor módulo do maior e mantenha o sinal de quem tem maior módulo: $-9 + 4 = -5$. Para conferir uma subtração, some o resultado ao subtraendo: se voltar ao minuendo, a conta está correta.",
        [
          ["adição", "Operação que combina parcelas, representada como deslocamento para a direita na reta."],
          ["subtração", "Operação que calcula uma diferença e equivale a somar o oposto."],
          ["soma", "Resultado da adição das parcelas."],
          ["diferença", "Resultado da subtração entre minuendo e subtraendo."],
          ["vaum", "Transferência de uma unidade entre posições no algoritmo tradicional da subtração."]
        ],
        {
          ex: [["Calcular $486+237$", "Unidades: $6+7=13$, escreva 3 e vaia 1. Dezenas: $8+3+1=12$, escreva 2 e vaia 1. Centenas: $4+2+1=7$. Resultado: 723."], ["Calcular $-4-7$", "Reescreva como $-4+(-7)$. Some os módulos, $4+7=11$, e mantenha o sinal negativo comum: $-11$."]],
          er: ["Somar 486 e 237 sem alinhar unidades com unidades.", "Calcular $5-(-3)$ como 2 em vez de 8, esquecendo que subtrair negativo é somar.", "Esquecer o vaum em $486-237$ e responder 259 em vez de 249."],
          lab: "Resolva $1000-347$ pelo algoritmo do vaum e verifique somando 347 ao resultado; anote cada empréstimo feito.",
          ref: "Khan Academy, aritmética — adição e subtração com carrinho e empréstimo (pt.khanacademy.org)."
        }),
      L("Multiplicação e divisão",
        "Multiplicar e dividir inteiros, interpretando quociente e resto.",
        "Adição repetida e valor posicional.",
        "Multiplicar é somar grupos iguais; dividir é repartir ou medir grupos.",
        "A multiplicação pode ser lida como adição repetida: $4\\cdot3 = 3+3+3+3$. Também tem interpretação geométrica: o produto de dois números é a área de um retângulo com esses lados. Os números multiplicados são fatores e o resultado é o produto. Pela propriedade comutativa, a ordem dos fatores não altera o produto.\nA divisão é a operação inversa da multiplicação. Dividir $D$ por $d$ com $d \\neq 0$ significa encontrar inteiros $q$ (quociente) e $r$ (resto) tais que $D = d\\cdot q + r$ e $0 \\leq r < d$. A condição sobre o resto é obrigatória: se sobrasse $d$ ou mais, ainda caberia mais um grupo inteiro. A divisão por zero é indefinida, pois nenhum número multiplicado por 0 recupera um dividendo não nulo; o caso $0\\div0$ é ainda mais problemático, pois qualquer número serviria.\nPara sinais, vale a mesma regra da multiplicação: sinais iguais produzem resultado positivo e sinais opostos, negativo. Assim $(-6)\\cdot(-4)=24$ e $-24\\div6=-4$. Na divisão longa, trabalhamos da esquerda para a direita, estimando quantas vezes o divisor cabe em cada parte do dividendo e abaixando o próximo algarismo a cada etapa.",
        [
          ["multiplicação", "Operação que soma uma parcela várias vezes, também interpretada como área de um retângulo."],
          ["divisão", "Operação que reparte uma quantidade em partes iguais ou mede quantas vezes um número cabe em outro."],
          ["quociente", "Resultado da divisão inteira que indica o número de partes inteiras."],
          ["resto", "Quantidade que sobra na divisão inteira, sempre menor que o divisor."],
          ["divisão por zero", "Operação indefinida, pois nenhum número multiplicado por zero recupera o dividendo."]
        ],
        {
          ex: [["Dividir 547 por 8", "Como $8\\cdot68=544$, sobram 3 unidades. Então o quociente é 68 e o resto é 3, com $0\\leq3<8$. Verificação: $8\\cdot68+3=547$."], ["Calcular $(-6)\\cdot(-4)$ e $-24\\div6$", "Na multiplicação, os sinais são iguais: o resultado é $24$. Na divisão, os sinais são opostos: o resultado é $-4$."]],
          er: ["Escrever resto 8 ou maior ao dividir por 8.", "Afirmar que $5\\div0$ é infinito ou que $0\\div0$ é zero.", "Trocar quociente e resto na verificação da identidade $D=d\\cdot q+r$."],
          lab: "Divida 1 000 por 7, anote quociente e resto e verifique a identidade da divisão; depois explique por que o resto não pode ser 7.",
          ref: "OpenStax, Prealgebra — multiplicação e divisão de inteiros (openstax.org)."
        }),
      L("Tabuada e Fluência",
        "Construir a tabuada com estratégias e desenvolver fluência nos fatos de multiplicar.",
        "Multiplicação como adição repetida e distributividade.",
        "A tabuada não é só decoreba: é um mapa de padrões que você pode reconstruir.",
        "A tabuada reúne os produtos de pares de fatores, tradicionalmente de 1 a 9 ou de 1 a 10. Ela tem simetria: como a multiplicação é comutativa, a linha 7 coluna 8 repete a linha 8 coluna 7. Isso reduz quase pela metade o número de fatos que precisamos dominar. As linhas de 0, 1, 2, 5 e 10 têm padrões muito simples e funcionam como pontos de partida.\nPara os fatos difíceis, use decomposição. O produto $7\\cdot8$ pode ser visto como $(5+2)\\cdot8 = 40+16 = 56$. O produto $6\\cdot9$ pode ser $6\\cdot10 - 6 = 60-6 = 54$. Essas estratégias não são muletas: são aplicações diretas da propriedade distributiva e sempre funcionam, mesmo quando a memória falha.\nFluência não é apenas rapidez: é precisão, flexibilidade e recuperação eficiente. Estude em sessões curtas e repetidas ao longo de dias, misture fatos já conhecidos com novos e explique em voz alta como chegou a cada resposta. A prática espaçada fixa melhor do que uma única sessão longa de repetição mecânica.",
        [
          ["tabuada", "Tabela com os produtos de pares de fatores, tradicionalmente de 1 a 9 ou de 1 a 10."],
          ["fator", "Número multiplicado por outro para formar um produto."],
          ["produto", "Resultado da multiplicação dos fatores."],
          ["fluência", "Capacidade de recuperar fatos com precisão, rapidez e flexibilidade."],
          ["estratégia de decomposição", "Técnica que quebra um fator em partes para usar fatos já conhecidos."]
        ],
        {
          ex: [["Calcular $7\\cdot8$ sem decorar", "Decomponha 7 em $5+2$: $5\\cdot8=40$ e $2\\cdot8=16$. Somando, obtemos 56."], ["Completar $6\\cdot9$ pela vizinhança", "Calcule $6\\cdot10=60$ e subtraia um grupo de 6, chegando a 54."]],
          er: ["Tratar $6\\cdot7$ e $7\\cdot6$ como dois fatos separados, ignorando a comutatividade.", "Resolver $8\\cdot9$ somando $8+9$.", "Desistir de um fato difícil em vez de decompô-lo em fatos conhecidos."],
          lab: "Monte uma tabuada de 1 a 9 no papel, pinte as posições simétricas com a mesma cor, cronometre 20 fatos e registre quais precisaram de decomposição.",
          ref: "Khan Academy, aritmética — multiplicação de números de um dígito (pt.khanacademy.org)."
        }),
      L("Cálculo mental",
        "Desenvolver estratégias de estimativa, compensação e decomposição para calcular sem papel.",
        "Operações básicas e propriedades.",
        "Antes de fazer a conta exata, dê um palpite: ele funciona como alarme de erro.",
        "Cálculo mental não é decorar resultados: é reconhecer estruturas. A compensação consiste em alterar temporariamente um número para facilitar a conta e corrigir o ajuste depois. Em $99+36$, pensamos $100+36=136$ e subtraímos 1, chegando a 135. Em $1000-398$, subtraímos 400 e devolvemos 2: $600+2=602$.\nA decomposição quebra números em partes convenientes. Para $25\\cdot16$, observe que $25\\cdot4=100$ e que $16=4\\cdot4$; então $100\\cdot4=400$. O uso de números compatíveis é a mesma ideia: escolhemos pares que formam potências de 10, como 25 com 4, 125 com 8 ou 50 com 2. Metade de um número também é uma ferramenta poderosa: $18\\cdot5 = 9\\cdot10 = 90$.\nA estimativa vem antes da conta exata e serve para checar plausibilidade. Se vamos calcular $298\\cdot4$, esperamos algo perto de $300\\cdot4=1200$; um resultado como 800 sinaliza erro imediato. Arredondar é legítimo desde que se registre o quanto foi acrescentado ou retirado. Com prática regular, essas estratégias se tornam automáticas e reduzem drasticamente erros em contas longas.",
        [
          ["compensação", "Ajuste temporário de um número para facilitar a conta, corrigindo depois o excesso ou a falta."],
          ["decomposição", "Separação de um número em partes para calcular por etapas."],
          ["números compatíveis", "Valores escolhidos por formarem contas simples, como 25 e 4."],
          ["estimativa", "Resultado aproximado usado para checar a plausibilidade de uma conta."],
          ["arredondamento", "Substituição de um número por outro próximo e mais simples."]
        ],
        {
          ex: [["Calcular $99+36$", "Arredonde 99 para 100: $100+36=136$. Como acrescentamos 1, subtraia 1: resultado 135."], ["Calcular $25\\cdot16$", "Como $25\\cdot4=100$ e $16=4\\cdot4$, escreva $25\\cdot16=(25\\cdot4)\\cdot4=100\\cdot4=400$."]],
          er: ["Arredondar 99 para 100 e esquecer de descontar a unidade acrescentada.", "Estimar $298\\cdot4$ como 800, sem perceber que o resultado deve ser próximo de 1 200.", "Alterar um fator por compensação na multiplicação sem corrigir o produto final."],
          lab: "Resolva mentalmente $198+47$, $50\\cdot18$ e $1000-398$; antes de cada conta, registre uma estimativa e compare com o resultado exato.",
          ref: "OpenStax, Prealgebra — estratégias de cálculo mental e estimativa (openstax.org)."
        }),
      L("Expressões numéricas",
        "Traduzir descrições em palavras para expressões e avaliá-las corretamente.",
        "Operações básicas e ordem das operações.",
        "Uma expressão é uma receita de cálculo escrita em símbolos.",
        "Uma expressão numérica é uma sequência de números, operações e delimitadores que representa um valor. Ela não contém sinal de igualdade: $3(4+2)-8$ é uma expressão, enquanto $3(4+2)-8=10$ é uma igualdade. As partes somadas ou subtraídas são termos; dentro de um termo, os números multiplicados são fatores.\n Traduzir o português para a linguagem simbólica exige atenção à precedência. 'O dobro de 9 menos 5' é $2\\cdot9-5$, pois o dobro incide sobre 9 antes da subtração; já 'o dobro da diferença entre 9 e 5' é $2(9-5)$. Palavras como 'some', 'produto', 'divida' e 'metade' indicam operações, e os parênteses registram a ordem exigida pela frase.\nPara avaliar, respeite os agrupamentos e a precedência: primeiro parênteses e demais delimitadores, depois potências, multiplicações e divisões, e por fim adições e subtrações. Anote cada etapa em vez de tentar fazer tudo de uma vez; isso permite localizar o ponto exato de um erro. Na dúvida, uma estimativa rápida ajuda a decidir se o resultado encontrado é plausível.",
        [
          ["expressão numérica", "Sequência de números e operações que representa um valor, sem sinal de igualdade."],
          ["termo", "Parte de uma expressão separada por adição ou subtração."],
          ["fator", "Cada uma das quantidades multiplicadas dentro de um termo."],
          ["agrupamento", "Uso de parênteses ou colchetes para indicar quais operações vêm primeiro."],
          ["tradução", "Conversão de uma descrição em palavras para uma expressão simbólica."]
        ],
        {
          ex: [["Traduzir 'o dobro de 9 menos 5'", "Escreva $2\\cdot9-5$. Avaliando: $18-5=13$; o dobro incide somente sobre 9."], ["Avaliar $3(4+2)-8$", "Primeiro o parênteses: $4+2=6$. Depois o produto: $3\\cdot6=18$. Por fim a subtração: $18-8=10$."]],
          er: ["Traduzir 'o dobro de 9 menos 5' como $2(9-5)$.", "Tratar $3(4+2)$ como $3\\cdot4+2$.", "Confundir uma expressão com uma equação e procurar uma incógnita que não existe."],
          lab: "Traduza 'some 12 ao triplo de 7 e divida o resultado por 5', escreva a expressão com parênteses e avalie passo a passo.",
          ref: "Khan Academy, álgebra — escrever e avaliar expressões (pt.khanacademy.org)."
        }),
      L("Ordem das operações",
        "Avaliar expressões numéricas respeitando precedência e associação.",
        "Expressões numéricas e potenciação básica.",
        "Sem um protocolo, a mesma expressão pode gerar respostas diferentes.",
        "A convenção universal prioriza, nesta ordem: parênteses e demais agrupamentos; potências; multiplicação e divisão; adição e subtração. Multiplicação e divisão pertencem ao mesmo nível, assim como adição e subtração. Quando operações de mesmo nível aparecem em sequência, resolvemos da esquerda para a direita. Decorar a sigla ajuda, mas entender os níveis evita o erro clássico de achar que toda multiplicação vem antes de toda divisão.\nA barra de fração e o sinal de raiz funcionam como agrupamentos implícitos: em $\\frac{2+4}{3}$ somamos o numerador antes de dividir por 3. A justaposição $2(3+1)$ também indica multiplicação, mas não cria um nível especial: ela obedece à mesma regra da multiplicação. Por isso expressões como $8\\div2(2+2)$ são ambíguas na escrita informal; com a convenção da esquerda para a direita, o resultado é 16, e escrever $8\\div(2(2+2))$ deixa claro que se quer 1.\nRegistre cada etapa da avaliação em uma linha separada. Esse hábito transforma uma expressão longa em pequenas decisões e torna óbvio quando um parênteses foi esquecido ou uma potência foi calculada fora de tempo.",
        [
          ["precedência", "Critério que define quais operações devem ser executadas primeiro em uma expressão."],
          ["parênteses", "Delimitador que força a operação interna a ser avaliada antes das externas."],
          ["potenciação", "Operação de repetir um fator, com precedência superior à multiplicação."],
          ["associação à esquerda", "Convenção de resolver operações de mesmo nível da esquerda para a direita."],
          ["barra de fração", "Delimitador implícito que agrupa numerador e denominador antes de qualquer divisão externa."]
        ],
        {
          ex: [["Avaliar $8\\div2\\cdot(2+2)$", "Parênteses primeiro: $2+2=4$. Depois divisão e multiplicação da esquerda para a direita: $8\\div2=4$ e $4\\cdot4=16$."], ["Avaliar $2+3^2(7-5)$", "Parênteses: $7-5=2$. Potência: $3^2=9$. Produto: $9\\cdot2=18$. Soma final: $2+18=20$."]],
          er: ["Multiplicar $2(2+2)$ antes da divisão em $8\\div2(2+2)$ por causa da justaposição.", "Calcular $2+3^2$ como $5^2$.", "Resolver a adição antes da multiplicação em $3+4\\cdot5$."],
          lab: "Resolva $6\\div2(1+2)$ e $6\\div(2(1+2))$; compare os resultados e explique qual convenção produz cada um.",
          ref: "OpenStax, Elementary Algebra — ordem das operações (openstax.org)."
        })
    ]
  },
  {
    name: "Frações, decimais e porcentagem",
    lessons: [
      L("Frações",
        "Interpretar, simplificar e comparar frações.",
        "Números racionais e divisores.",
        "Uma fração descreve partes iguais de um todo ou o resultado de uma divisão.",
        "A fração $\\frac{a}{b}$ tem numerador $a$, que conta as partes tomadas, e denominador $b$, que diz em quantas partes iguais o todo foi dividido. Exigem-se $a$ e $b$ inteiros e $b \\neq 0$. Há três leituras úteis: parte-todo (3 fatias de um bolo cortado em 4), quociente ($3\\div4$) e razão (3 para 4). Elas convivem e aparecem em contextos diferentes.\nQuando o numerador é menor que o denominador temos uma fração própria; quando é maior ou igual, uma fração imprópria, que também pode ser escrita como fração mista. Assim, $\\frac{7}{4} = 1\\frac{3}{4}$: uma unidade inteira mais três quartos. O valor da fração não muda se multiplicarmos ou dividirmos numerador e denominador pelo mesmo fator não nulo, pois isso equivale a multiplicar por 1.\nSimplificar é reduzir a fração à sua forma irredutível, dividindo numerador e denominador pelo máximo divisor comum. Em $\\frac{18}{24}$, o MDC é 6 e obtemos $\\frac{3}{4}$. Para comparar frações, use denominador comum ou produtos cruzados: $\\frac{a}{b} > \\frac{c}{d}$ se, com denominadores positivos, $a\\cdot d > c\\cdot b$.",
        [
          ["fração", "Representação de uma ou mais partes iguais de um todo, escrita como a sobre b."],
          ["numerador", "Número acima da barra da fração que indica quantas partes foram tomadas."],
          ["denominador", "Número abaixo da barra da fração que indica em quantas partes iguais o todo foi dividido."],
          ["fração imprópria", "Fração cujo numerador é maior ou igual ao denominador."],
          ["simplificação", "Processo de dividir numerador e denominador por um fator comum para obter uma fração equivalente."]
        ],
        {
          ex: [["Simplificar $\\frac{18}{24}$", "O MDC de 18 e 24 é 6. Dividindo numerador e denominador por 6, temos $\\frac{18\\div6}{24\\div6}=\\frac{3}{4}$."], ["Comparar $\\frac{3}{5}$ e $\\frac{4}{7}$", "Use produtos cruzados: $3\\cdot7=21$ e $4\\cdot5=20$. Como $21>20$, concluímos que $\\frac{3}{5} > \\frac{4}{7}$."]],
          er: ["Somar numeradores e denominadores para comparar duas frações.", "Simplificar dividindo apenas o numerador por um fator comum.", "Aceitar $\\frac{5}{0}$ como fração válida."],
          lab: "Dobre uma folha em quatro partes, pinte três e escreva a fração correspondente; em seguida reparta cada parte ao meio e mostre que a mesma área agora é $\\frac{6}{8}$.",
          ref: "Iezzi, Fundamentos de Matemática Elementar — volume de aritmética (Editora Saraiva)."
        }),
      L("Operações com frações",
        "Somar, subtrair, multiplicar e dividir frações com segurança.",
        "Frações, MMC e MDC.",
        "Cada operação tem uma lógica própria: umas pedem denominador comum, outras não.",
        "Para somar ou subtrair frações precisamos de pedaços do mesmo tamanho, isto é, de denominador comum. Quando os denominadores diferem, usamos o MMC deles como denominador e ajustamos cada numerador pelo fator correspondente. Em $\\frac{2}{3}+\\frac{1}{4}$, o MMC é 12; multiplicamos o primeiro numerador por 4 e o segundo por 3, obtendo $\\frac{8}{12}+\\frac{3}{12}=\\frac{11}{12}$.\nNa multiplicação não há denominador comum: multiplicam-se numeradores entre si e denominadores entre si, $\\frac{a}{b}\\cdot\\frac{c}{d}=\\frac{ac}{bd}$. É vantajoso simplificar fatores comuns antes de multiplicar, para trabalhar com números menores. Na divisão, multiplicamos pela recíproca do divisor: $\\frac{a}{b}\\div\\frac{c}{d}=\\frac{a}{b}\\cdot\\frac{d}{c}$, com $c \\neq 0$. Dividir por uma fração menor que 1 aumenta o resultado, o que é um bom teste de plausibilidade.\nPara frações mistas, converta primeiro em imprópria: $2\\frac{1}{3}=\\frac{7}{3}$. As regras de sinais são as mesmas dos inteiros. Ao final, simplifique sempre e verifique se o resultado faz sentido: uma soma de duas frações próprias pode passar de 1, mas o produto delas é necessariamente menor que cada fator quando ambos são positivos e menores que 1.",
        [
          ["denominador comum", "Denominador igual, geralmente o MMC, usado para somar ou subtrair frações."],
          ["recíproca", "Fração invertida de um número não nulo, cujo produto pelo original é 1."],
          ["mmc dos denominadores", "Menor denominador comum usado para transformar frações antes de somar ou subtrair."],
          ["fração mista", "Escrita que combina parte inteira e fração, como duas unidades e um terço."],
          ["simplificação prévia", "Cancelamento de fatores comuns antes de efetuar a multiplicação de frações."]
        ],
        {
          ex: [["Calcular $\\frac{2}{3}+\\frac{1}{4}$", "O MMC de 3 e 4 é 12. Então $\\frac{2}{3}=\\frac{8}{12}$ e $\\frac{1}{4}=\\frac{3}{12}$. Somando: $\\frac{11}{12}$, já irredutível."], ["Calcular $\\frac{3}{5}\\div\\frac{9}{10}$", "Multiplique pela recíproca: $\\frac{3}{5}\\cdot\\frac{10}{9}=\\frac{30}{45}$. Dividindo por 15, obtemos $\\frac{2}{3}$."]],
          er: ["Somar $\\frac{2}{3}+\\frac{1}{4}$ como $\\frac{3}{7}$.", "Dividir frações dividindo numeradores e denominadores separadamente.", "Esquecer de converter a fração mista em imprópria antes de multiplicar."],
          lab: "Resolva $\\frac{3}{8}+\\frac{1}{6}$, $\\frac{5}{9}\\cdot\\frac{3}{10}$ e $\\frac{7}{4}\\div\\frac{2}{3}$; simplifique cada resposta e justifique a escolha da operação.",
          ref: "OpenStax, Elementary Algebra — operações com frações (openstax.org)."
        }),
      L("Números decimais",
        "Ler, escrever e operar números decimais com vírgula.",
        "Valor posicional e adição com alinhamento.",
        "O decimal é o mesmo número racional, escrito em casas de dez em dez.",
        "A vírgula decimal separa a parte inteira da parte fracionária. À sua direita ficam os décimos, centésimos, milésimos e assim por diante; cada casa vale um décimo da anterior. Assim, 3,408 significa $3 + \\frac{4}{10} + \\frac{0}{100} + \\frac{8}{1000}$. O zero no meio não é dispensável: ele mantém o 8 na casa dos milésimos.\nNa adição e na subtração, alinhamos as vírgulas, acrescentando zeros à direita quando necessário. Em $12,5+3,08$, escrevemos $12,50+3,08=15,58$. O alinhamento por vírgulas é o que garante que décimos se somem a décimos. Na multiplicação, multiplicamos como se fossem inteiros e depois colocamos a vírgula contando o total de casas decimais dos fatores: em $0,4\\cdot0,07$ temos $4\\cdot7=28$ e $1+2=3$ casas, logo $0,028$.\nNa divisão por um decimal, deslocamos a vírgula do divisor até transformá-lo em inteiro e fazemos o mesmo deslocamento no dividendo, pois isso equivale a multiplicar ambos por uma potência de 10. Zeros à direita da última casa significativa não mudam o valor: $2,5=2,50$. Já zeros à esquerda da primeira casa ocupada, como em 0,05, são essenciais para indicar a posição.",
        [
          ["vírgula decimal", "Separador entre a parte inteira e a parte fracionária de um número decimal."],
          ["décimo", "Cada uma das dez partes iguais de uma unidade, na primeira casa após a vírgula."],
          ["centésimo", "Cada uma das cem partes iguais de uma unidade, na segunda casa após a vírgula."],
          ["casa decimal", "Posição ocupada por um algarismo à direita da vírgula."],
          ["zeros à direita", "Zeros finais após a última casa significativa que não alteram o valor do número."]
        ],
        {
          ex: [["Calcular $12,5+3,08$", "Alinhe as vírgulas escrevendo $12,50+3,08$. Some por colunas: $12,50+3,08=15,58$."], ["Calcular $0,4\\cdot0,07$", "Multiplique $4\\cdot7=28$. Os fatores têm $1+2=3$ casas decimais, então o produto é $0,028$."]],
          er: ["Alinhar as últimas casas em vez das vírgulas em $12,5+3,08$.", "Ler 0,07 como sete décimos em vez de sete centésimos.", "Contar mal as casas em $0,4\\cdot0,07$ e responder 0,28."],
          lab: "Meça o comprimento de três objetos em centímetros com duas casas decimais, some os valores alinhando as vírgulas e compare com uma única medição dos objetos em sequência.",
          ref: "Khan Academy, aritmética — decimais e operações (pt.khanacademy.org)."
        }),
      L("Conversão fração-decimal",
        "Converter frações em decimais e decimais em frações, incluindo dízimas.",
        "Frações e números decimais.",
        "Toda fração vira decimal pela divisão; o resultado fecha ou entra em ciclo.",
        "Para converter $\\frac{a}{b}$ em decimal, basta dividir $a$ por $b$. A divisão pode terminar, produzindo um decimal finito, ou continuar para sempre repetindo um bloco, produzindo uma dízima periódica. Escrevemos $0,\\overline{3}$ para indicar que o algarismo 3 se repete e $0,\\overline{09}$ quando o bloco repetido é 09.\nHá um critério para saber de antemão: depois de simplificar a fração, o decimal é finito se e somente se o denominador tiver apenas os fatores primos 2 e 5. Assim, $\\frac{3}{8}$ é finito porque $8=2^3$, enquanto $\\frac{1}{7}$ é periódico porque 7 não é 2 nem 5. O número de casas do decimal finito é o maior expoente entre os fatores 2 e 5.\nPara ir do decimal à fração, escreva o número sem a vírgula sobre $10$, $100$, $1000$ conforme o número de casas e simplifique: $0,25=\\frac{25}{100}=\\frac{1}{4}$. Para dízimas puras, use uma equação: se $x=0,\\overline{3}$, então $10x=3,\\overline{3}$; subtraindo, $9x=3$ e $x=\\frac{1}{3}$. Para períodos que não começam logo após a vírgula, ajuste a potência de 10 de modo a isolar um período inteiro antes de subtrair.",
        [
          ["dízima periódica", "Decimal infinito em que um bloco de algarismos se repete indefinidamente."],
          ["período", "Bloco de algarismos que se repete em uma dízima periódica."],
          ["decimal finito", "Decimal que termina após um número finito de casas."],
          ["potência de dez", "Denominador usado na conversão de decimais em frações, como 10, 100 ou 1000."],
          ["fator 2 ou 5", "Únicos fatores primos que podem aparecer no denominador de uma fração de decimal finito."]
        ],
        {
          ex: [["Converter $\\frac{3}{8}$ em decimal", "Divida 3 por 8: obtém 0,375, que termina. Isso era esperado porque $8=2^3$ só tem fator primo 2."], ["Converter $0,\\overline{3}$ em fração", "Seja $x=0,\\overline{3}$. Então $10x=3,\\overline{3}$ e, subtraindo, $9x=3$. Logo $x=\\frac{3}{9}=\\frac{1}{3}$."]],
          er: ["Achar que $\\frac{1}{7}$ é finito porque 7 é um número pequeno.", "Escrever $0,25=\\frac{25}{10}$ sem corrigir a potência de dez.", "Tratar $0,\\overline{09}$ como se o período fosse apenas o algarismo 0."],
          lab: "Divida 1 por 3, 1 por 6 e 1 por 8; classifique cada resultado como finito ou periódico e explique a classificação pelos fatores do denominador simplificado.",
          ref: "OpenStax, Prealgebra — conversão entre frações e decimais (openstax.org)."
        }),
      L("Porcentagem",
        "Calcular porcentagens, aumentos e descontos identificando a base de cálculo.",
        "Frações e números decimais.",
        "Porcentagem é uma fração com denominador fixo 100.",
        "O símbolo % significa 'por cem'. Portanto $p\\%=\\frac{p}{100}$ e calcular $p\\%$ de um valor $V$ é multiplicar $V\\cdot\\frac{p}{100}$. Por exemplo, $15\\%$ de 240 é $240\\cdot0,15=36$. A conversão entre porcentagem, fração e decimal é direta: $25\\%=\\frac{25}{100}=\\frac{1}{4}=0,25$.\nHá três perguntas típicas. Qual é $p\\%$ de $V$? Multiplique. Qual porcentagem $x$ representa de $V$? Divida $x$ por $V$ e multiplique por 100. Se $p\\%$ de um número é $x$, qual é o número? Resolva $V\\cdot\\frac{p}{100}=x$, ou seja, $V=x\\div\\frac{p}{100}$. Identificar a base — o valor sobre o qual a porcentagem incide — é o passo mais importante.\nUm aumento de $p\\%$ equivale a multiplicar por $1+\\frac{p}{100}$; um desconto equivale a multiplicar por $1-\\frac{p}{100}$. Aumentos e descontos sucessivos não se cancelam, pois incidem sobre bases diferentes: um desconto de 10% seguido de um aumento de 10% deixa $0,9\\cdot1,1=0,99$ do valor inicial. Em compras, arredonde apenas no final para não acumular erros.",
        [
          ["porcentagem", "Razão expressa em relação a cem, indicada pelo símbolo de porcento."],
          ["taxa percentual", "Número p em p por cento, que representa p partes em cada cem."],
          ["base de cálculo", "Valor sobre o qual a porcentagem incide."],
          ["aumento percentual", "Multiplicação do valor pelo fator um mais p sobre cem."],
          ["desconto percentual", "Multiplicação do valor pelo fator um menos p sobre cem."]
        ],
        {
          ex: [["Calcular 15% de 240", "Escreva $240\\cdot\\frac{15}{100}=240\\cdot0,15=36$."], ["Preço de 200 com 10% de desconto e depois 10% de aumento", "Desconto: $200\\cdot0,9=180$. Aumento sobre a nova base: $180\\cdot1,1=198$. O preço final é 198, não 200."]],
          er: ["Somar 10% e 10% e concluir que aumento e desconto se anulam.", "Calcular 20% de 80 como $80\\cdot20$.", "Aplicar a segunda porcentagem sobre o valor original em vez do valor já alterado."],
          lab: "Simule um produto de R$ 120 com 20% de desconto e, sobre o valor final, 8% de juros; calcule sem arredondar etapas intermediárias e compare com a aplicação direta dos fatores.",
          ref: "Khan Academy, aritmética — porcentagens (pt.khanacademy.org)."
        }),
      L("Regra de três",
        "Resolver problemas de proporcionalidade direta e inversa com a regra de três.",
        "Razões, frações e porcentagem.",
        "Quando duas grandezas variam de forma controlada, basta uma linha extra para completar o quadro.",
        "A regra de três organiza quatro valores ligados por proporcionalidade. Montamos uma tabela com duas colunas, uma para cada grandeza, e duas linhas: a situação conhecida e a situação desconhecida. Na proporcionalidade direta, se uma grandeza é multiplicada por um fator, a outra é multiplicada pelo mesmo fator; o produto em cruz então satisfaz $a\\cdot d = b\\cdot c$.\nNa proporcionalidade inversa, o aumento de uma grandeza provoca a diminuição da outra de modo que o produto se mantenha constante: $a\\cdot b = c\\cdot d$. O teste conceitual é perguntar: se eu precisar de mais objetos, vou precisar de mais ou de menos tempo? Mais operários, por exemplo, reduzem o tempo de obra — caso inverso. Mais cadernos custam mais — caso direto.\nO método da unidade é uma alternativa que reduz erros: primeiro descubra o valor de uma unidade e depois multiplique pela quantidade desejada. Em ambos os casos, a regra só se aplica quando a relação é linear, isto é, quando o fator de escala é constante. Preços com descontos por quantidade ou tempos de reação não lineares exigem outro modelo.",
        [
          ["grandeza", "Quantidade que pode ser medida e comparada em um problema."],
          ["proporcionalidade direta", "Relação em que as grandezas variam pelo mesmo fator de escala."],
          ["proporcionalidade inversa", "Relação em que o produto das grandezas se mantém constante."],
          ["regra de três", "Técnica para encontrar um valor desconhecido usando igualdade de razões."],
          ["fator de escala", "Multiplicador que leva uma grandeza da situação conhecida à desconhecida."]
        ],
        {
          ex: [["3 cadernos custam R$ 15; quanto custam 7?", "Preço unitário: $15\\div3=5$. Portanto 7 cadernos custam $7\\cdot5=$ R$ 35."], ["5 operários terminam em 12 dias; e 10 operários?", "É uma relação inversa: $5\\cdot12=10\\cdot d$. Logo $d=60\\div10=6$ dias."]],
          er: ["Aplicar a regra direta em situação inversa e concluir que 10 operários levam 24 dias.", "Multiplicar em cruz sem conferir a ordem das colunas da tabela.", "Usar regra de três quando a relação entre as grandezas não é linear."],
          lab: "Meça o tempo que leva para digitar 50 palavras e estime o tempo para 180 mantendo o mesmo ritmo; registre explicitamente a suposição de proporcionalidade.",
          ref: "Iezzi, Fundamentos de Matemática Elementar — volume de aritmética (Editora Saraiva)."
        }),
      L("Razão e proporção",
        "Comparar grandezas por razão e resolver proporções e escalas.",
        "Frações e regra de três.",
        "Uma razão compara; uma proporção iguala duas comparações.",
        "A razão entre $a$ e $b$, com $b \\neq 0$, é o quociente $\\frac{a}{b}$, também escrito $a:b$. Os números $a$ e $b$ são antecedente e consequente. Razões podem ser simplificadas como frações e devem manter a ordem: a razão de mulheres para homens não é a mesma de homens para mulheres, exceto quando os valores coincidem.\nUma proporção é a igualdade entre duas razões, $\\frac{a}{b}=\\frac{c}{d}$. A característica fundamental é o produto cruzado: $a\\cdot d = b\\cdot c$, desde que $b$ e $d$ sejam não nulos. Dessa relação derivam permutações úteis, como $\\frac{a}{c}=\\frac{b}{d}$ (alternando) e $\\frac{b}{a}=\\frac{d}{c}$ (invertendo), sempre com os denominadores adequadamente definidos.\nMapas, maquetes e desenhos técnicos usam escalas, que são razões entre medida no desenho e medida real. Na escala $1:50\\,000$, 1 cm no papel corresponde a 50 000 cm na realidade, ou 500 m. A porcentagem também é uma razão com consequente 100. Ao resolver problemas, mantenha as unidades consistentes antes de comparar: converter centímetros em quilômetros no momento certo evita erros de fator 100 000.",
        [
          ["razão", "Comparação de duas grandezas por divisão, escrita como a sobre b ou a dois pontos b."],
          ["proporção", "Igualdade entre duas razões."],
          ["antecedente e consequente", "Termos de uma razão, respectivamente o primeiro e o segundo número comparado."],
          ["produto cruzado", "Igualdade entre produtos diagonais que caracteriza uma proporção."],
          ["escala", "Razão entre uma medida no desenho e a medida real correspondente."]
        ],
        {
          ex: [["Verificar se 2:3 e 8:12 formam uma proporção", "Calcule os produtos cruzados: $2\\cdot12=24$ e $3\\cdot8=24$. Como são iguais, as razões são proporcionais."], ["Mapa na escala 1:50 000", "Dois centímetros no mapa valem $2\\cdot50\\,000=100\\,000$ cm, que equivalem a 1 km na realidade."]],
          er: ["Comparar razões somando termos em vez de usar produtos cruzados.", "Trocar antecedente e consequente em apenas uma das razões.", "Interpretar a escala 1:50 000 como 1 cm igual a 50 000 metros."],
          lab: "Meça o comprimento e a largura da sala, desenhe a planta na escala 1:50 e confira se as razões entre medidas reais e desenhadas são iguais nos dois eixos.",
          ref: "OpenStax, Elementary Algebra — razões e proporções (openstax.org)."
        })
    ]
  },
  {
    name: "Potências e divisibilidade",
    lessons: [
      L("Potenciação",
        "Calcular e simplificar potências usando as leis dos expoentes.",
        "Multiplicação repetida e expressões numéricas.",
        "Um expoente é uma instrução compacta para repetir um fator.",
        "Na potência $a^n$, o número $a$ é a base e $n$ é o expoente: ela representa $a$ multiplicado por si mesmo $n$ vezes. Assim, $2^5=2\\cdot2\\cdot2\\cdot2\\cdot2=32$. Casos especiais recebem nomes: $a^2$ é o quadrado de $a$ e $a^3$ é o cubo de $a$. A potência tem precedência superior à multiplicação, então $2\\cdot3^2=18$, não 36.\nAs leis dos expoentes nascem da contagem de fatores. Para base comum, $a^m\\cdot a^n=a^{m+n}$ (juntamos fatores) e $\\frac{a^m}{a^n}=a^{m-n}$ (cancelamos fatores). Elevando uma potência a outra, $(a^m)^n=a^{mn}$; elevando um produto, $(ab)^n=a^n b^n$. Todas essas regras exigem base não nula quando aparecem expoentes negativos ou divisões.\nPor convenção, $a^0=1$ para $a \\neq 0$, o que mantém as leis coerentes: $\\frac{a^3}{a^3}=a^0=1$. Expoentes negativos indicam recíproca: $a^{-n}=\\frac{1}{a^n}$, de modo que $5^{-2}=\\frac{1}{25}$ e nunca $-25$. A expressão $0^0$ fica fora dessa convenção e é tratada como indefinida na maior parte dos cursos de aritmética.",
        [
          ["potência", "Produto de fatores iguais, escrito como a elevado ao expoente n."],
          ["base", "Número que é repetido como fator em uma potência."],
          ["expoente", "Número que indica quantas vezes a base aparece como fator."],
          ["expoente negativo", "Notação que equivale à recíproca da potência de expoente positivo."],
          ["expoente zero", "Convenção pela qual toda base não nula elevada a zero resulta em um."]
        ],
        {
          ex: [["Calcular $2^5$", "Escreva os cinco fatores: $2\\cdot2\\cdot2\\cdot2\\cdot2=32$. O expoente conta fatores, não multiplica a base."], ["Simplificar $\\frac{3^5}{3^2}$", "Com a mesma base, subtraímos os expoentes: $3^{5-2}=3^3=27$."]],
          er: ["Calcular $2^5$ como $2\\cdot5=10$.", "Usar $(a^m)^n=a^{m+n}$ em vez de $a^{mn}$.", "Escrever $5^{-2}=-25$ em vez de $\\frac{1}{25}$."],
          lab: "Dobre uma folha seis vezes, conte as camadas formadas e relacione o resultado com $2^6$; confirme com uma calculadora.",
          ref: "Khan Academy, álgebra — expoentes e propriedades (pt.khanacademy.org)."
        }),
      L("Radiciação",
        "Calcular e simplificar raízes quadradas e de índice maior.",
        "Potenciação e quadrados perfeitos.",
        "A raiz é a pergunta inversa da potência: qual número gerou este resultado?",
        "A raiz n-ésima de $a$, escrita $\\sqrt[n]{a}$, é o número $x$ tal que $x^n=a$. No símbolo radical, $n$ é o índice e $a$ é o radicando. Quando o índice é 2, costumamos omiti-lo: $\\sqrt{a}$ significa raiz quadrada de $a$. Como $x^2 \\geq 0$ para todo real $x$, a raiz quadrada de número negativo não existe em $\\mathbb{R}$.\nChamamos de raiz quadrada principal o valor não negativo $x$ com $x^2=a$. Assim, $\\sqrt{81}=9$, embora as soluções de $x^2=81$ sejam $9$ e $-9$. Essa distinção é essencial. Também vale $\\sqrt{a^2}=|a|$: se $a=-7$, temos $\\sqrt{49}=7$, não $-7$.\nPara simplificar, decomponha o radicando em fatores que sejam potências do índice. Como $50=25\\cdot2$, temos $\\sqrt{50}=\\sqrt{25}\\cdot\\sqrt{2}=5\\sqrt{2}$ para valores positivos. A propriedade $\\sqrt{ab}=\\sqrt{a}\\sqrt{b}$ exige $a$ e $b$ não negativos; aplicá-la a números negativos gera contradições. Para índices ímpares, como $\\sqrt[3]{-27}=-3$, radicandos negativos são permitidos.",
        [
          ["raiz n-ésima", "Número que, elevado ao expoente n, resulta no radicando."],
          ["radicando", "Número colocado sob o sinal de raiz."],
          ["índice", "Número que indica qual potência deve ser invertida pela radiciação."],
          ["raiz quadrada principal", "Raiz quadrada não negativa de um número não negativo."],
          ["radical", "Símbolo usado para indicar a operação de radiciação."]
        ],
        {
          ex: [["Calcular $\\sqrt{81}$", "Como $9^2=81$ e 9 é positivo, a raiz quadrada principal é 9. O valor $-9$ resolve $x^2=81$, mas não é $\\sqrt{81}$."], ["Simplificar $\\sqrt{50}$", "Fatore $50=25\\cdot2$. Então $\\sqrt{50}=\\sqrt{25}\\cdot\\sqrt{2}=5\\sqrt{2}$, que não pode ser simplificado mais."]],
          er: ["Afirmar que $\\sqrt{16}$ vale tanto 4 quanto $-4$.", "Calcular $\\sqrt{9+16}$ como $3+4=7$ em vez de $\\sqrt{25}=5$.", "Procurar uma raiz quadrada real para $-9$."],
          lab: "Liste os quadrados perfeitos de 1 a 15 e use a lista para estimar $\\sqrt{130}$ entre dois inteiros consecutivos, justificando a estimativa.",
          ref: "OpenStax, Elementary Algebra — raízes e radicais (openstax.org)."
        }),
      L("Notação científica",
        "Escrever, comparar e operar números muito grandes ou muito pequenos.",
        "Potências de dez e expoentes negativos.",
        "Números astronômicos e tamanhos microscópicos pedem uma escrita compacta.",
        "Um número está em notação científica quando escrito como $a\\times10^n$, com $1\\leq|a|<10$ e $n$ inteiro. O fator $a$ é a mantissa e $n$ conta quantas casas a vírgula foi deslocada. Para 45 000, deslocamos a vírgula quatro casas para a esquerda e escrevemos $4,5\\times10^4$. Para 0,00045, deslocamos quatro casas para a direita e obtemos $4,5\\times10^{-4}$: expoente negativo indica número menor que 1 em módulo.\nNa multiplicação, multiplicamos as mantissas e somamos os expoentes: $(3\\times10^5)(2\\times10^{-3})=6\\times10^{2}$. Na divisão, dividimos as mantissas e subtraímos os expoentes. Se a mantissa resultante sair da faixa exigida, ajustamos deslocando a vírgula e corrigindo o expoente — por exemplo, $12\\times10^5=1,2\\times10^6$.\nComparar números nessa forma é simples: compare primeiro os expoentes; se forem iguais, compare as mantissas. Calculadoras mostram a notação E, como 3.2E5 para $3,2\\times10^5$. A notação científica também comunica ordem de grandeza e, quando bem usada, indica precisão: 3,0×10² e 3×10² sugerem graus de exatidão diferentes.",
        [
          ["notação científica", "Escrita da forma a vezes dez elevado a n, com a entre um e dez em módulo."],
          ["mantissa", "Fator da notação científica cujo valor fica entre um e dez em módulo."],
          ["expoente decimal", "Inteiro que conta as casas deslocadas na conversão para notação científica."],
          ["ordem de grandeza", "Faixa de magnitude de um número, ligada ao expoente da potência de dez."],
          ["notação E", "Forma compacta de calculadora para a vezes dez elevado a n, como 3.2E5."]
        ],
        {
          ex: [["Escrever 0,00045 em notação científica", "Desloque a vírgula quatro casas para a direita para obter 4,5. Como o número original é menor que 1, o expoente é negativo: $4,5\\times10^{-4}$."], ["Multiplicar $(3\\times10^5)(2\\times10^{-3})$", "Multiplique as mantissas: $3\\cdot2=6$. Some os expoentes: $5+(-3)=2$. Resultado: $6\\times10^2=600$."]],
          er: ["Escrever 45 000 como $45\\times10^3$, com mantissa fora da faixa permitida.", "Trocar o sinal do expoente ao converter 0,003.", "Somar expoentes na divisão em vez de subtrair."],
          lab: "Pesquise quatro medidas reais — uma distância, uma massa, um intervalo de tempo e um tamanho celular — e escreva cada uma em notação científica com a unidade correspondente.",
          ref: "OpenStax, Prealgebra — notação científica e potências de dez (openstax.org)."
        }),
      L("Múltiplos e divisores",
        "Listar divisores e múltiplos e reconhecer números primos e compostos.",
        "Multiplicação e divisão exata.",
        "Dizer que b divide a é o mesmo que dizer que a é um produto de b por um inteiro.",
        "Escrevemos $b\\mid a$ quando existe inteiro $k$ com $a=b\\cdot k$. Nesse caso, $b$ é divisor de $a$ e $a$ é múltiplo de $b$. Nesse sentido, a divisão tem resto zero. Todo inteiro é múltiplo de 1 e de si mesmo, e zero é múltiplo de qualquer inteiro, pois $b\\cdot0=0$.\nOs divisores positivos de um número são finitos e podem ser listados em pares. Para 36 temos $1\\cdot36$, $2\\cdot18$, $3\\cdot12$, $4\\cdot9$ e $6\\cdot6$, o que dá os divisores 1, 2, 3, 4, 6, 9, 12, 18 e 36. Já os múltiplos são infinitos: basta multiplicar por 1, 2, 3 e assim por diante. Parar a lista no próprio número é um erro comum.\nUm natural maior que 1 é primo quando tem exatamente dois divisores positivos, ele mesmo e 1; é composto quando tem mais de dois. O número 1 não é primo nem composto. Para testar se $n$ é primo, basta verificar divisores até $\\sqrt{n}$, pois todo divisor maior que isso tem um companheiro menor que já foi testado.",
        [
          ["divisor", "Inteiro que divide outro sem deixar resto."],
          ["múltiplo", "Produto de um inteiro por outro inteiro."],
          ["divisibilidade", "Relação em que a divisão tem resto zero, escrita como b divide a."],
          ["número primo", "Natural maior que um com exatamente dois divisores positivos."],
          ["número composto", "Natural maior que um com mais de dois divisores positivos."]
        ],
        {
          ex: [["Listar os divisores de 36", "Monte os pares de produto: $1\\cdot36$, $2\\cdot18$, $3\\cdot12$, $4\\cdot9$ e $6\\cdot6$. Os divisores são 1, 2, 3, 4, 6, 9, 12, 18 e 36."], ["Verificar se 7 divide 91", "Como $91=7\\cdot13$ com resto zero, temos $7\\mid91$. Assim, 91 é composto."]],
          er: ["Considerar 1 um número primo.", "Esquecer o próprio número na lista de divisores.", "Afirmar que zero não é múltiplo de nenhum número."],
          lab: "Para 24, 35 e 49, liste os divisores e os múltiplos até 100; classifique cada número como primo ou composto e justifique.",
          ref: "Khan Academy, aritmética — divisores e múltiplos (pt.khanacademy.org)."
        }),
      L("MMC e MDC",
        "Calcular máximo divisor comum e mínimo múltiplo comum por fatoração e por Euclides.",
        "Decomposição em fatores primos e divisibilidade.",
        "MDC pergunta o que é comum por divisão; MMC pergunta onde os múltiplos se encontram.",
        "O mdc de dois naturais é o maior divisor comum e o mmc é o menor múltiplo comum positivo. Na decomposição em fatores primos, escrevemos cada número como produto de potências de primos. Para o mdc, tomamos cada primo com o menor expoente presente; para o mmc, tomamos cada primo com o maior expoente presente. Assim, de $12=2^2\\cdot3$ e $18=2\\cdot3^2$ obtemos $\\mathrm{mdc}=2\\cdot3=6$ e $\\mathrm{mmc}=2^2\\cdot3^2=36$.\nO algoritmo de Euclides calcula o mdc sem fatorar: dividimos o maior pelo menor, trocamos o par pelo divisor e pelo resto e repetimos até o resto ser zero; o último divisor não nulo é o mdc. Para 48 e 18: $48=18\\cdot2+12$, $18=12\\cdot1+6$, $12=6\\cdot2+0$, logo o mdc é 6. Para dois números positivos, vale a relação $\\mathrm{mmc}\\cdot\\mathrm{mdc}=a\\cdot b$.\nAs aplicações são concretas. O mdc simplifica frações e divide uma quantidade em grupos iguais sem sobra; o mmc dá o denominador comum de frações e prevê quando dois eventos periódicos coincidem. Quando o mdc é 1, dizemos que os números são coprimos — isso não significa que sejam primos, apenas que não compartilham fatores.",
        [
          ["mmc", "Menor natural positivo que é múltiplo de todos os números considerados."],
          ["mdc", "Maior natural positivo que divide todos os números considerados."],
          ["decomposição em fatores primos", "Escrita de um número como produto de potências de números primos."],
          ["algoritmo de Euclides", "Método que substitui o par de números pelo divisor e pelo resto até o resto ser zero."],
          ["coprimos", "Números cujo máximo divisor comum é um."]
        ],
        {
          ex: [["Calcular o MMC de 12 e 18", "Fatore: $12=2^2\\cdot3$ e $18=2\\cdot3^2$. Escolha os maiores expoentes: $2^2\\cdot3^2=4\\cdot9=36$."], ["Calcular o MDC de 48 e 18 por Euclides", "Temos $48=18\\cdot2+12$, depois $18=12\\cdot1+6$ e $12=6\\cdot2+0$. O último divisor não nulo é 6."]],
          er: ["Confundir mmc com maior múltiplo comum, que não existe.", "Escolher os menores expoentes ao calcular o mmc.", "Parar o algoritmo de Euclides antes de obter resto zero."],
          lab: "Dois ônibus saem juntos do terminal; um passa a cada 12 minutos e outro a cada 18. Use o mmc para prever a próxima coincidência e verifique por uma tabela de horários.",
          ref: "Iezzi, Fundamentos de Matemática Elementar — volume de aritmética (Editora Saraiva)."
        }),
      L("Critérios de divisibilidade",
        "Aplicar regras práticas para testar divisibilidade sem fazer a divisão completa.",
        "Múltiplos, divisores e valor posicional.",
        "Algumas propriedades dos algarismos denunciam a divisibilidade na hora.",
        "Um critério de divisibilidade responde sim ou não à pergunta sobre o resto, sem calcular o quociente. Para 2, basta o último algarismo ser par. Para 5, o último algarismo deve ser 0 ou 5; para 10, deve ser 0. Para 4, verificamos os dois últimos algarismos; para 8, os três últimos, pois $100$ é divisível por 4 e $1000$ é divisível por 8.\nOs critérios de 3 e 9 usam a soma dos algarismos. Em 7 338, a soma é $7+3+3+8=21$: como 21 é múltiplo de 3, o número é divisível por 3; como 21 não é múltiplo de 9, o número não é divisível por 9. A razão é que $10\\equiv1$ módulo 3 e módulo 9, então cada algarismo contribui pelo seu próprio valor. Para 6, exigimos simultaneamente os critérios de 2 e de 3.\nNo critério de 11, calculamos a diferença entre a soma dos algarismos em posições alternadas; se ela for múltiplo de 11 (inclusive zero), o número é divisível por 11. Essas regras são atalhos, não substitutos da compreensão: cada uma depende de como as potências de 10 se comportam em relação ao divisor. Lembre-se também de que o critério não fornece o quociente, apenas a decisão sobre o resto.",
        [
          ["critério de divisibilidade", "Regra prática que decide se um número é divisível por outro sem efetuar a divisão."],
          ["soma dos algarismos", "Soma usada nos critérios de divisibilidade por três e por nove."],
          ["últimos dois algarismos", "Bloco verificado no critério de divisibilidade por quatro."],
          ["diferença alternada", "Diferença entre somas em posições alternadas, usada no critério de onze."],
          ["resto da divisão", "Valor que sobra após a divisão inteira e que deve ser zero para haver divisibilidade."]
        ],
        {
          ex: [["Testar 7 338 por 3 e por 9", "Some os algarismos: $7+3+3+8=21$. Como 21 é múltiplo de 3, o número é divisível por 3; como 21 não é múltiplo de 9, não é divisível por 9."], ["Testar 1 248 por 8", "Os últimos três algarismos formam 248 e $248\\div8=31$, exato. Portanto 1 248 é divisível por 8."]],
          er: ["Aplicar o critério de 3 somando apenas alguns algarismos do número.", "Usar o critério de 4 verificando somente o último algarismo.", "Achar que o critério fornece o quociente, quando ele responde apenas sim ou não."],
          lab: "Escolha cinco números de quatro algarismos, aplique os critérios de 2, 3, 4, 5, 9 e 10 e confirme um deles com divisão longa completa.",
          ref: "Khan Academy, aritmética — testes de divisibilidade (pt.khanacademy.org)."
        })
    ]
  }
);

/* ============================================================
   FORGE — data-math-discrete.js
   Lógica e matemática discreta (módulo complementar)
   ============================================================ */

CURRICULUM.math.modules.push({
  name: "Lógica e matemática discreta",
  lessons: [
    L("Lógica proposicional",
      "Reconhecer proposições, atribuir valores-verdade e representar afirmações com variáveis.",
      "Leitura de afirmações matemáticas simples e noção de número natural.",
      "Uma frase só entra na lógica quando dá para decidir se ela é verdadeira ou falsa.",
      "A lógica proposicional trabalha com proposições: afirmações declarativas que possuem um valor-verdade determinado, verdadeiro ($V$) ou falso ($F$), nunca os dois ao mesmo tempo. Perguntas, ordens e exclamações não são proposições. Frases dependentes do contexto, como 'hoje está chovendo', só se tornam proposições quando o dia e o lugar estão fixados. Usamos variáveis como $p$, $q$ e $r$ para representar proposições arbitrárias, e o par $\\{V, F\\}$ é o conjunto de todos os valores-verdade possíveis.\n\nO valor-verdade não depende de a afirmação ser útil, popular ou agradável. A frase 'todo número primo é ímpar' é falsa porque $2$ é primo e par, enquanto 'existe um primo maior que $100$' é verdadeira mesmo que não tenhamos escrito qual. Decidir o valor pode exigir cálculo, contraexemplo ou uma prova, mas uma vez fixado ele é objetivo e não varia conforme a opinião de quem lê.\n\nAo combinar proposições com conectivos, o valor da proposição composta depende apenas dos valores das partes. Assim, 'está chovendo e eu saí' e '$2$ é par e $3$ é ímpar' têm a mesma forma lógica $p \\land q$, embora falem de assuntos inteiramente diferentes. Abstrair essa forma é o primeiro passo para construir tabelas-verdade, reconhecer equivalências e escrever provas.",
      [
        ["proposição", "Afirmação declarativa que possui um valor-verdade definido, verdadeiro ou falso."],
        ["valor-verdade", "Um dos dois valores possíveis de uma proposição, verdadeiro ou falso."],
        ["variável proposicional", "Símbolo, como p ou q, usado para representar uma proposição arbitrária."],
        ["proposição simples", "Proposição que não contém outra proposição como parte, isto é, sem conectivos."],
        ["proposição composta", "Proposição formada a partir de outras por meio de conectivos lógicos."]
      ],
      {
        ex: [["Classificar afirmações", "'Qual é a sua idade?' não é proposição; '$7 > 5$' é proposição verdadeira; '$x + 1 = 4$', sem um valor fixado para $x$, não é proposição."], ["Traduzir para variáveis", "Com $p$ = 'o servidor está online' e $q$ = 'o backup rodou', a frase 'o servidor não está online, mas o backup rodou' vira $\\neg p \\land q$."]],
        er: ["Tratar uma pergunta ou um pedido como proposição só porque é uma frase completa.", "Achar que '$x > 2$' é proposição mesmo sem definir o valor de $x$ e o domínio.", "Confundir o valor-verdade de uma proposição com a nossa preferência pessoal sobre ela."],
        lab: "Escreva cinco frases: duas proposições verdadeiras, duas falsas e uma que não seja proposição; justifique cada classificação.",
        ref: "Kenneth H. Rosen, Discrete Mathematics and Its Applications — lógica proposicional (mcgrawhill.com)."
      }),
    L("Conectivos e tabelas-verdade",
      "Construir e ler tabelas-verdade dos principais conectivos lógicos.",
      "Proposições, valores-verdade e variáveis proposicionais.",
      "A tabela-verdade é uma lista completa de todos os cenários possíveis para uma fórmula.",
      "Os conectivos básicos são a negação $\\neg p$, a conjunção $p \\land q$, a disjunção inclusiva $p \\lor q$, a implicação $p \\to q$ e o bicondicional $p \\leftrightarrow q$. A negação inverte o valor; a conjunção só é verdadeira quando ambas as partes são verdadeiras; a disjunção inclusiva é falsa apenas quando as duas partes são falsas, isto é, o 'ou' lógico admite que ambas ocorram. O bicondicional é verdadeiro quando as duas partes recebem o mesmo valor.\n\nA implicação material é a mais sutil: $p \\to q$ é falsa apenas no caso $p = V$ e $q = F$. Quando o antecedente $p$ é falso, a implicação é verdadeira independentemente de $q$; isso não afirma que $q$ seja verdadeiro, apenas que a promessa 'se $p$, então $q$' não foi violada. Por isso $p \\to q$ tem a mesma tabela de $\\neg p \\lor q$, identidade que será explorada nas equivalências.\n\nPara montar a tabela de uma fórmula com $n$ variáveis, liste as $2^n$ combinações de valores, calcule primeiro as subfórmulas entre parênteses e só depois o resultado final. A precedência usual é $\\neg$, depois $\\land$, depois $\\lor$, depois $\\to$ e por fim $\\leftrightarrow$. Organizar as colunas intermediárias evita erros e torna visível a estrutura da fórmula.",
      [
        ["tabela-verdade", "Tabela que lista todas as combinações de valores das variáveis e o valor resultante da fórmula."],
        ["negação", "Conectivo que inverte o valor-verdade da proposição, escrito como não p."],
        ["conjunção", "Conectivo p e q, verdadeiro somente quando ambas as proposições são verdadeiras."],
        ["disjunção inclusiva", "Conectivo p ou q, falso somente quando ambas as proposições são falsas."],
        ["implicação material", "Conectivo se p então q, falso apenas quando p é verdadeiro e q é falso."]
      ],
      {
        ex: [["Montar a tabela de $p \\to q$", "As linhas $(V,V)$, $(V,F)$, $(F,V)$ e $(F,F)$ produzem respectivamente $V$, $F$, $V$ e $V$: a única falsidade ocorre quando o antecedente é verdadeiro e o consequente é falso."], ["Avaliar $(\\neg p \\lor q) \\land p$ com $p = V$ e $q = F$", "Temos $\\neg p = F$, logo $\\neg p \\lor q = F$, e portanto $F \\land V = F$. A fórmula é falsa nessa atribuição."]],
        er: ["Interpretar o 'ou' lógico como exclusivo, descartando o caso em que ambas as partes são verdadeiras.", "Achar que $p \\to q$ é falsa sempre que $p$ é falsa.", "Omitir linhas da tabela ou calcular a fórmula inteira antes das subfórmulas."],
        lab: "Construa a tabela-verdade de $(p \\land q) \\to (p \\lor q)$ com quatro linhas e confira se alguma linha resulta em falso.",
        ref: "Susanna S. Epp, Discrete Mathematics with Applications — conectivos e tabelas-verdade (cengage.com)."
      }),
    L("Equivalências e tautologias",
      "Identificar tautologias e usar leis lógicas para transformar fórmulas.",
      "Conectivos e construção de tabelas-verdade.",
      "Algumas fórmulas são sempre verdadeiras, e duas fórmulas diferentes podem sempre dar o mesmo resultado.",
      "Uma tautologia é uma fórmula cuja última coluna da tabela-verdade contém apenas $V$, como $p \\lor \\neg p$. Uma contradição, ou inconsistência, só produz $F$, como $p \\land \\neg p$. Quando há valores dos dois tipos, a fórmula é uma contingência. Classificar uma fórmula é responder se ela pode falhar em alguma atribuição de valores, e a tabela-verdade decide a questão em tempo finito.\n\nDizemos que $p$ e $q$ são logicamente equivalentes, escrito $p \\equiv q$, quando têm exatamente a mesma tabela-verdade; de modo equivalente, $p \\leftrightarrow q$ é uma tautologia. As leis de De Morgan afirmam que $\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q$ e $\\neg(p \\lor q) \\equiv \\neg p \\land \\neg q$. Também são importantes a contrapositiva $p \\to q \\equiv \\neg q \\to \\neg p$, a equivalência $p \\to q \\equiv \\neg p \\lor q$ e as leis distributivas e de absorção.\n\nO valor prático das equivalências é substituir uma fórmula por outra mais simples sem alterar seu significado lógico. Em uma prova, isso permite trocar a negação de uma implicação por uma conjunção, por exemplo: $\\neg(p \\to q) \\equiv p \\land \\neg q$. A substituição é segura justamente porque as fórmulas trocadas são verdadeiras e falsas exatamente nas mesmas condições.",
      [
        ["tautologia", "Fórmula que é verdadeira para todas as atribuições de valores às suas variáveis."],
        ["contradição", "Fórmula que é falsa para todas as atribuições de valores às suas variáveis."],
        ["contingência", "Fórmula que assume valores verdadeiro e falso conforme a atribuição."],
        ["equivalência lógica", "Relação entre duas fórmulas que possuem a mesma tabela-verdade."],
        ["contrapositiva", "Equivalência que troca p implica q por não q implica não p."]
      ],
      {
        ex: [["Verificar a contraposição", "A fórmula $(p \\to q) \\leftrightarrow (\\neg q \\to \\neg p)$ produz apenas $V$ na tabela; portanto $p \\to q \\equiv \\neg q \\to \\neg p$."], ["Negar uma conjunção", "Aplicando De Morgan, $\\neg(p \\land \\neg q) \\equiv \\neg p \\lor \\neg(\\neg q) \\equiv \\neg p \\lor q$."]],
        er: ["Afirmar que duas fórmulas são equivalentes porque coincidem em uma única linha da tabela.", "Negar $p \\land q$ escrevendo $\\neg p \\land \\neg q$.", "Trocar uma implicação pela sua recíproca $q \\to p$ como se fossem equivalentes."],
        lab: "Use equivalências para simplificar $\\neg(p \\to \\neg q)$ e confirme o resultado com uma tabela-verdade de duas linhas.",
        ref: "MIT OpenCourseWare, 6.042J Mathematics for Computer Science — proposições e equivalências (ocw.mit.edu)."
      }),
    L("Quantificadores",
      "Traduzir e negar afirmações com quantificadores universais e existenciais.",
      "Lógica proposicional, predicados e equivalências.",
      "Em vez de falar de uma frase fixa, passamos a falar de todos os objetos ou de pelo menos um.",
      "Um predicado é uma afirmação com variáveis, como $P(x): x > 3$, que se torna uma proposição quando $x$ recebe um valor ou quando um quantificador fixa sua abrangência. O quantificador universal $\\forall x$ afirma que a propriedade vale para todo elemento do domínio; o existencial $\\exists x$ afirma que vale para ao menos um. O domínio de quantificação precisa sempre ser declarado ou subentendido: $\\forall x \\in \\mathbb{R}, x^2 \\geq 0$ é verdadeiro, mas a mesma afirmação sobre os complexos não faz sentido da mesma forma, pois a ordem $\\geq$ não está definida lá.\n\nA ordem dos quantificadores importa quando há mais de um. A frase $\\forall x \\in \\mathbb{N}\\; \\exists y \\in \\mathbb{N}, y > x$ é verdadeira, pois basta tomar $y = x + 1$. Já $\\exists y \\in \\mathbb{N}\\; \\forall x \\in \\mathbb{N}, y > x$ é falsa, pois nenhum natural fixo é maior que todos os naturais. Variáveis que não estão sob alcance de um quantificador são chamadas livres, e uma expressão com variável livre não é uma proposição completa.\n\nAs regras de negação generalizam De Morgan: $\\neg \\forall x P(x) \\equiv \\exists x \\neg P(x)$ e $\\neg \\exists x P(x) \\equiv \\forall x \\neg P(x)$. Para negar uma frase quantificada, empurre a negação para dentro, trocando o quantificador a cada passo e negando o predicado no final. O quantificador de unicidade $\\exists!$ é uma abreviação de 'existe exatamente um' e pode ser escrito em termos de $\\exists$ e $\\forall$.",
      [
        ["predicado", "Afirmação com variáveis que se torna proposição quando os valores são fixados ou quantificados."],
        ["quantificador universal", "Símbolo para todo, que exige que o predicado valha para todos os elementos do domínio."],
        ["quantificador existencial", "Símbolo existe, que exige pelo menos um elemento do domínio satisfazendo o predicado."],
        ["domínio de quantificação", "Conjunto de valores que as variáveis quantificadas podem assumir."],
        ["negação de quantificadores", "Regra que troca todo por existe e existe por todo ao negar o predicado."]
      ],
      {
        ex: [["Negar uma afirmação universal", "'Todos os alunos estudaram' vira 'existe um aluno que não estudou': $\\neg \\forall x P(x) \\equiv \\exists x \\neg P(x)$."], ["Comparar ordens de quantificadores", "$\\forall x \\in \\mathbb{N}\\; \\exists y \\in \\mathbb{N}, y > x$ é verdadeira com $y=x+1$; $\\exists y \\in \\mathbb{N}\\; \\forall x \\in \\mathbb{N}, y > x$ é falsa."]],
        er: ["Negar $\\forall x P(x)$ como $\\forall x \\neg P(x)$, sem trocar o quantificador.", "Ignorar o domínio e afirmar que $\\forall x, x^2 \\geq 0$ vale para qualquer objeto.", "Trocar a ordem de quantificadores supondo que ela não altera o significado."],
        lab: "Escreva na forma simbólica a frase 'todo inteiro par é sucessor de algum inteiro' e depois negue-a em português.",
        ref: "Daniel J. Velleman, How to Prove It: A Structured Approach — quantificadores (cambridge.org)."
      }),
    L("Conjuntos e operações",
      "Representar conjuntos e calcular uniões, interseções, diferenças e produtos cartesianos.",
      "Noções de elemento, pertencimento e lógica proposicional.",
      "Um conjunto é apenas uma coleção bem definida de objetos, e quase toda matemática começa escolhendo o conjunto de trabalho.",
      "Escrevemos $a \\in A$ para dizer que $a$ é elemento de $A$ e $a \\notin A$ quando não é. O conjunto vazio $\\emptyset$ não tem elementos; um conjunto universal $U$ fixa o contexto para complementos. Dizemos que $A \\subseteq B$ quando todo elemento de $A$ também pertence a $B$, e $A \\subset B$ quando a inclusão é própria, isto é, $A \\subseteq B$ e $A \\neq B$. A igualdade de conjuntos exige inclusão nos dois sentidos: $A = B \\iff A \\subseteq B$ e $B \\subseteq A$.\n\nAs operações básicas espelham os conectivos lógicos. A união $A \\cup B$ reúne os elementos que pertencem a pelo menos um dos conjuntos; a interseção $A \\cap B$ guarda os que pertencem aos dois; a diferença $A \\setminus B$ conserva os elementos de $A$ que não estão em $B$; e o complemento $A^{c} = U \\setminus A$ contém os elementos do universo que não pertencem a $A$. Daí surgem as leis de De Morgan para conjuntos: $(A \\cup B)^{c} = A^{c} \\cap B^{c}$ e $(A \\cap B)^{c} = A^{c} \\cup B^{c}$.\n\nO produto cartesiano $A \\times B$ é o conjunto de todos os pares ordenados $(a,b)$ com $a \\in A$ e $b \\in B$. A ordem importa: $(a,b) \\neq (b,a)$ quando $a \\neq b$, e por isso $|A \\times B| = |A| \\cdot |B|$ para conjuntos finitos. É esse objeto que permite definir relações e funções nas próximas aulas, além de dar significado preciso a planilhas e tabelas de dados.",
      [
        ["conjunto", "Coleção bem definida de objetos, chamados elementos, cuja pertinência pode ser decidida."],
        ["subconjunto", "Conjunto cujos elementos pertencem todos a outro conjunto, admitindo a igualdade."],
        ["união", "Operação que reúne em um único conjunto os elementos presentes em pelo menos um dos conjuntos."],
        ["interseção", "Operação que mantém somente os elementos comuns a todos os conjuntos envolvidos."],
        ["produto cartesiano", "Conjunto de todos os pares ordenados com o primeiro elemento no primeiro conjunto e o segundo no segundo."]
      ],
      {
        ex: [["Operar com conjuntos finitos", "Para $A=\\{1,2,3\\}$ e $B=\\{3,4\\}$: $A \\cup B = \\{1,2,3,4\\}$, $A \\cap B = \\{3\\}$ e $A \\setminus B = \\{1,2\\}$."], ["Calcular cardinalidade de um produto", "Se $|A| = 3$ e $|B| = 2$, então $|A \\times B| = 3 \\cdot 2 = 6$, um par distinto para cada escolha de $a$ e $b$."]],
        er: ["Confundir o conjunto $\\{1\\}$ com o número $1$, tratando um como se fosse o outro.", "Usar o símbolo de subconjunto próprio quando se quer admitir que os conjuntos sejam iguais.", "Achar que $A \\cap B$ contém os elementos que pertencem a pelo menos um dos dois conjuntos."],
        lab: "Com $U=\\{1,2,3,4,5\\}$, $A=\\{1,3\\}$ e $B=\\{3,5\\}$, calcule $A^{c}$, $A \\cup B$ e $(A \\cup B)^{c}$; compare com $A^{c} \\cap B^{c}$.",
        ref: "Oscar Levin, Discrete Mathematics: An Open Introduction — conjuntos (discrete.mathbook.io)."
      }),
    L("Relações e funções",
      "Classificar relações binárias e reconhecer funções injetoras, sobrejetoras e bijetoras.",
      "Produto cartesiano, conjuntos e lógica de quantificadores.",
      "Uma relação é uma tabela de pares permitidos; uma função é uma tabela em que cada entrada tem uma única saída.",
      "Uma relação binária entre $A$ e $B$ é um subconjunto $R \\subseteq A \\times B$. Escrevemos $aRb$ quando $(a,b) \\in R$. Quando $A = B$, podemos perguntar se $R$ é reflexiva, isto é, se $(a,a) \\in R$ para todo $a$; simétrica, se $(a,b) \\in R$ implica $(b,a) \\in R$; e transitiva, se $(a,b) \\in R$ e $(b,c) \\in R$ implicam $(a,c) \\in R$. Uma relação que é reflexiva, simétrica e transitiva é de equivalência e particiona o conjunto em classes disjuntas; uma relação reflexiva, antissimétrica e transitiva é uma ordem parcial.\n\nUma função $f: A \\to B$ é uma relação na qual cada $a \\in A$ aparece em exatamente um par $(a,b)$. O conjunto $A$ é o domínio, $B$ é o codomínio, e a imagem é o subconjunto de $B$ formado pelos valores efetivamente atingidos. A função é injetora quando elementos distintos têm imagens distintas, $f(a_1)=f(a_2) \\Rightarrow a_1=a_2$; sobrejetora quando imagem e codomínio coincidem; bijetora quando ambas as propriedades valem. Somente funções bijetoras admitem inversa $f^{-1}: B \\to A$.\n\nA composição $g \\circ f$ aplica primeiro $f$ e depois $g$, exigindo que a imagem de $f$ esteja contida no domínio de $g$. A composição é associativa, mas em geral não comutativa. Contar funções também é discreto: com $|A|=m$ e $|B|=n$ há $n^m$ funções de $A$ para $B$, pois cada um dos $m$ elementos do domínio escolhe livremente uma entre $n$ imagens.",
      [
        ["relação binária", "Subconjunto de um produto cartesiano, formado por pares ordenados entre elementos de dois conjuntos."],
        ["relação reflexiva", "Relação na qual todo elemento está relacionado a si mesmo."],
        ["relação de equivalência", "Relação reflexiva, simétrica e transitiva, que separa o conjunto em classes disjuntas."],
        ["função", "Relação em que cada elemento do domínio está associado a exatamente um elemento do codomínio."],
        ["função bijetora", "Função que é ao mesmo tempo injetora e sobrejetora, admitindo função inversa."]
      ],
      {
        ex: [["Classificar uma relação", "Em $\\mathbb{Z}$, defina $aRb$ se $a-b$ é par. Ela é reflexiva porque $a-a=0$, simétrica e transitiva; logo é de equivalência, com as classes dos pares e dos ímpares."], ["Analisar uma função", "Para $f: \\mathbb{R} \\to \\mathbb{R}$, $f(x)=x^2$, temos $f(2)=f(-2)$, então não é injetora; além disso $-1$ não é atingido, logo não é sobrejetora."]],
        er: ["Achar que toda relação é uma função, esquecendo que uma entrada pode ter mais de uma saída.", "Confundir codomínio com imagem, afirmando que toda função é sobrejetora por definição.", "Supor que toda função possui inversa, sem verificar a bijetividade."],
        lab: "Liste todos os pares de uma relação $R$ em $\\{1,2,3\\}$ definida por 'a divide b' e verifique quais das três propriedades ela satisfaz.",
        ref: "MIT OpenCourseWare, 6.042J Mathematics for Computer Science — relações e funções (ocw.mit.edu)."
      }),
    L("Indução matemática",
      "Provar afirmações sobre todos os números naturais usando o princípio da indução.",
      "Desigualdades algébricas, somas e lógica de implicação.",
      "Indução é o efeito dominó: derrube a primeira peça e mostre que cada peça derruba a seguinte.",
      "O princípio da indução matemática afirma: se $P(n_0)$ é verdadeira e, para todo $k \\geq n_0$, a verdade de $P(k)$ implica a verdade de $P(k+1)$, então $P(n)$ é verdadeira para todo $n \\geq n_0$. A verificação inicial é o passo base; a suposição de $P(k)$ é a hipótese indutiva; a demonstração de $P(k+1)$ é o passo indutivo. Sem o passo base, a cadeia não começa; sem o passo indutivo, ela não avança.\n\nA indução se apoia no fato de que todo subconjunto não vazio dos naturais possui um menor elemento. Na prática, isso significa que não é preciso verificar infinitos casos: basta um caso inicial e uma regra geral. A hipótese indutiva é um recurso legítimo, desde que seja usada para provar o próximo caso e não o próprio caso atual — do contrário a prova é circular. Em problemas como $\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$, o passo indutivo consiste em escrever a soma até $k+1$ como a soma até $k$ acrescida do termo $k+1$.\n\nExiste também a indução forte, na qual se assume $P(n_0), P(n_0+1), \\ldots, P(k)$ para provar $P(k+1)$. Ela é natural em problemas como a fatoração em primos ou a recorrência de Fibonacci, onde o caso seguinte depende de mais de um caso anterior. As duas formas são equivalentes: o que muda é a quantidade de informação disponível no passo indutivo, não o poder do método.",
      [
        ["indução matemática", "Método de prova que estabelece uma afirmação para todos os naturais a partir de um caso base e de um passo indutivo."],
        ["passo base", "Verificação inicial da afirmação no menor valor considerado, geralmente n igual a zero ou um."],
        ["hipótese indutiva", "Suposição de que a afirmação vale para um natural arbitrário k durante o passo indutivo."],
        ["passo indutivo", "Demonstração de que a validade em k implica a validade em k mais um."],
        ["indução forte", "Variante em que se assumem todos os casos anteriores até k para provar o caso k mais um."]
      ],
      {
        ex: [["Provar a soma dos primeiros naturais", "Base: $1 = 1\\cdot 2/2$. Passo: $\\sum_{i=1}^{k+1} i = \\frac{k(k+1)}{2} + (k+1) = \\frac{(k+1)(k+2)}{2}$, que é a fórmula com $n=k+1$."], ["Provar $2^n > n$ para $n \\geq 1$", "Base: $2^1 = 2 > 1$. Passo: $2^{k+1} = 2 \\cdot 2^k > 2k \\geq k+1$ para $k \\geq 1$, usando a hipótese e $2k \\geq k+1$."]],
        er: ["Pular o passo base e apresentar apenas o raciocínio geral.", "Usar a própria afirmação que se quer provar no lugar da hipótese indutiva.", "Substituir $n$ por $k+1$ em apenas um lado da igualdade durante o passo."],
        lab: "Prove por indução que $1 + 3 + 5 + \\cdots + (2n-1) = n^2$ para $n \\geq 1$, escrevendo explicitamente base e passo.",
        ref: "MIT OpenCourseWare, 6.042J Mathematics for Computer Science — indução e indução forte (ocw.mit.edu)."
      }),
    L("Recorrência",
      "Definir, desdobrar e resolver sequências dadas por relações recorrentes.",
      "Indução matemática e manipulação de potências.",
      "Em vez de dar a fórmula final, uma recorrência dá a receita para obter cada termo a partir dos anteriores.",
      "Uma relação de recorrência expressa $a_n$ em função de termos anteriores, como $a_n = 2a_{n-1} + 1$. Para que a sequência fique determinada é preciso fornecer também as condições iniciais, por exemplo $a_0 = 0$; sem elas, a mesma receita gera infinitas sequências. O número de termos anteriores necessários define a ordem da recorrência: a equação anterior é de primeira ordem, enquanto $F_n = F_{n-1} + F_{n-2}$ é de segunda ordem.\n\nUma forma direta de resolver é desdobrar a recorrência. No exemplo, $a_n = 2a_{n-1}+1 = 2(2a_{n-2}+1)+1 = 4a_{n-2}+3$, e após $n$ passos obtemos $a_n = 2^n a_0 + (2^n-1) = 2^n-1$. A fórmula fechada então pode ser confirmada por indução, fechando o ciclo entre construção e prova. Para recorrências lineares homogêneas de segunda ordem, $a_n = c_1 a_{n-1} + c_2 a_{n-2}$, usa-se a equação característica $r^2 = c_1 r + c_2$: suas raízes determinam a forma dos termos, com ajustes feitos pelas condições iniciais.\n\nRecorrências aparecem naturalmente na análise de algoritmos. A busca binária satisfaz $T(n) = T(n/2) + c$, cuja solução é logarítmica, enquanto uma divisão em duas metades com trabalho linear extra leva a $T(n) = 2T(n/2) + cn$, de ordem $n \\log n$. A recorrência descreve o processo passo a passo; a solução fechada revela o comportamento assintótico de uma só olhada.",
      [
        ["relação de recorrência", "Equação que define cada termo de uma sequência em função de termos anteriores."],
        ["condição inicial", "Valor ou valores dados para os primeiros termos, necessários para determinar a sequência."],
        ["ordem da recorrência", "Quantidade de termos anteriores exigidos para calcular o próximo termo."],
        ["recorrência linear homogênea", "Recorrência em que os termos anteriores aparecem apenas multiplicados por constantes, sem termo independente."],
        ["sequência de Fibonacci", "Sequência com F zero igual a zero, F um igual a um e cada termo seguinte igual à soma dos dois anteriores."]
      ],
      {
        ex: [["Resolver $a_0 = 0$, $a_n = 2a_{n-1}+1$", "Desdobrando, $a_n = 2^n - 1$. Confira: $2(2^{n-1}-1)+1 = 2^n - 1$, e $a_0 = 2^0 - 1 = 0$."], ["Ler a recorrência de Fibonacci", "Com $F_0=0$, $F_1=1$ e $F_n=F_{n-1}+F_{n-2}$, obtemos $0, 1, 1, 2, 3, 5, 8, 13$."]],
        er: ["Apresentar a recorrência sem fornecer as condições iniciais que determinam a sequência.", "Achar que desdobrar alguns termos já constitui uma prova da fórmula fechada.", "Aplicar uma equação característica de primeira ordem a uma recorrência de segunda ordem."],
        lab: "Desdobra a recorrência $a_0 = 1$, $a_n = 3a_{n-1}$ até encontrar uma fórmula fechada e valide-a para $n=3$.",
        ref: "Ronald L. Graham, Donald E. Knuth e Oren Patashnik, Concrete Mathematics — recorrências (addison-wesley.com)."
      }),
    L("Princípio da casa dos pombos",
      "Aplicar o princípio da casa dos pombos em argumentos de existência e contagem.",
      "Contagem elementar, funções e conjuntos finitos.",
      "Se há mais objetos do que lugares, algum lugar obrigatoriamente recebe mais de um objeto.",
      "O princípio da casa dos pombos afirma que, se $n$ objetos são distribuídos em $k$ caixas com $n > k$, então alguma caixa contém pelo menos dois objetos. A justificativa é direta: se cada caixa recebesse no máximo um objeto, o total seria no máximo $k$, contrariando $n > k$. Essa é uma prova por contradição e, ao mesmo tempo, um caso particular do fato de que uma função de um conjunto maior para um conjunto menor não pode ser injetora.\n\nA forma generalizada é mais poderosa: ao distribuir $n$ objetos em $k$ caixas, pelo menos uma caixa contém $\\lceil n/k \\rceil$ objetos, em que $\\lceil x \\rceil$ denota o menor inteiro maior ou igual a $x$. De fato, se todas as caixas tivessem menos que $\\lceil n/k \\rceil$ objetos, o total ficaria abaixo de $n$. Assim, 13 pessoas entre 12 meses garantem pelo menos duas com o mesmo mês de nascimento, e 367 pessoas garantem pelo menos duas com a mesma data, mesmo considerando 29 de fevereiro.\n\nO princípio tem um caráter existencial: ele assegura que alguma caixa está ocupada além do limite, mas não diz qual nem quais objetos a ocupam. Essa distinção é essencial em provas de existência, nas quais frequentemente só queremos demonstrar que um objeto com certa propriedade existe, sem construí-lo explicitamente. Para aplicar o princípio corretamente, devemos nomear os pombos, nomear as caixas e verificar qual das duas quantidades é maior.",
      [
        ["princípio da casa dos pombos", "Resultado que garante uma caixa com pelo menos dois objetos quando o número de objetos excede o número de caixas."],
        ["forma generalizada", "Versão que garante pelo menos uma caixa com ceiling de n dividido por k objetos."],
        ["argumento de existência", "Raciocínio que prova a existência de um objeto sem necessariamente construí-lo."],
        ["prova por contradição", "Estratégia que supõe o oposto do que se quer provar e deriva uma impossibilidade."],
        ["distribuição de objetos", "Associação que coloca cada objeto em exatamente uma caixa, modelada por uma função."]
      ],
      {
        ex: [["Pessoas e meses", "Com $n=13$ pessoas e $k=12$ meses, como $13>12$, pelo menos duas pessoas nasceram no mesmo mês; a forma generalizada dá $\\lceil 13/12 \\rceil = 2$."], ["Garantindo um par de meias", "Com duas cores disponíveis, retirar $3$ meias garante um par da mesma cor, pois $\\lceil 3/2 \\rceil = 2$."]],
        er: ["Achar que o princípio identifica quais objetos compartilham a mesma caixa.", "Usar a condição $n \\geq k$ no lugar de $n>k$ na forma básica do princípio.", "Aplicar o princípio sem definir claramente quais são os objetos e quais são as caixas."],
        lab: "Numa turma de 32 alunos, identifique pombos e caixas para provar que pelo menos dois nasceram no mesmo dia do mês; use a forma generalizada.",
        ref: "MIT OpenCourseWare, 6.042J Mathematics for Computer Science — princípio da casa dos pombos (ocw.mit.edu)."
      }),
    L("Combinatória: princípios de contagem",
      "Contar resultados usando as regras do produto, da soma, da inclusão-exclusão e do complemento.",
      "Conjuntos finitos, união, interseção e cardinalidade.",
      "Contar bem é escolher a pergunta certa: quantas escolhas independentes, quantos casos disjuntos ou quantos casos excluir.",
      "A regra do produto vale para escolhas sequenciais independentes: se há $m$ maneiras de fazer a primeira escolha e $n$ maneiras de fazer a segunda para cada primeira, há $m \\cdot n$ resultados. A regra da soma vale para casos disjuntos: se um resultado pode ocorrer da primeira forma de $m$ modos ou da segunda forma de $n$ modos, e os dois conjuntos não se sobrepõem, há $m+n$ modos. O ponto crítico está em reconhecer quando somar e quando multiplicar, o que costuma ser decidido pelas palavras 'ou' e 'e' da descrição.\n\nQuando os casos se sobrepõem, a regra da soma ingênua conta duas vezes os elementos comuns. O princípio da inclusão-exclusão corrige isso: $|A \\cup B| = |A| + |B| - |A \\cap B|$. Para três conjuntos, subtraímos as interseções de dois e acrescentamos a interseção dos três. Essa alternância de sinais é a versão combinatória da ideia de compensar a dupla contagem.\n\nMuitas vezes é mais fácil contar o complemento. Para saber quantas senhas de quatro caracteres, usando letras minúsculas e dígitos, contêm pelo menos um dígito, contamos todas as senhas, $36^4$, e subtraímos as que só têm letras, $26^4$, obtendo $36^4 - 26^4$. O mesmo raciocínio resolve 'pelo menos um' e 'no máximo um'. Diagramas de árvore e a identificação clara do espaço amostral tornam esses cálculos confiáveis.",
      [
        ["regra do produto", "Princípio que multiplica o número de escolhas em etapas sequenciais independentes."],
        ["regra da soma", "Princípio que soma o número de possibilidades de casos mutuamente exclusivos."],
        ["princípio da inclusão-exclusão", "Fórmula que corrige a dupla contagem somando cardinalidades e subtraindo interseções."],
        ["contagem pelo complemento", "Técnica que calcula o total subtraindo do espaço amostral os casos indesejados."],
        ["dupla contagem", "Erro ou técnica em que um mesmo resultado é contado mais de uma vez."]
      ],
      {
        ex: [["Senhas com pelo menos um dígito", "Usando 26 letras e 10 dígitos, há $36^4$ senhas de 4 caracteres; as que não têm dígito são $26^4$; logo a resposta é $36^4 - 26^4$."], ["Números de três algarismos distintos", "A primeira posição tem $9$ opções (de 1 a 9), a segunda tem $9$ (inclui o zero, exceto o já usado) e a terceira tem $8$: $9 \\cdot 9 \\cdot 8 = 648$."]],
        er: ["Somar números de etapas sequenciais em vez de multiplicá-los.", "Aplicar a regra da soma a conjuntos que se sobrepõem sem descontar a interseção.", "Permitir zero na primeira posição ao contar números de três algarismos."],
        lab: "Conte de duas formas diferentes quantos números de 4 algarismos têm pelo menos um algarismo 7: pelo complemento e por inclusão-exclusão.",
        ref: "Susanna S. Epp, Discrete Mathematics with Applications — técnicas de contagem (cengage.com)."
      }),
    L("Permutações e combinações",
      "Diferenciar ordenação de escolha e calcular permutações, combinações e coeficientes binomiais.",
      "Fatoriais, regras de contagem e princípio da inclusão-exclusão.",
      "Quando a ordem importa falamos em permutação; quando só importa quem foi escolhido, falamos em combinação.",
      "O fatorial $n! = 1 \\cdot 2 \\cdot \\ldots \\cdot n$, com $0! = 1$, conta as maneiras de ordenar $n$ objetos distintos. Quando ordenamos apenas $k$ entre $n$ objetos, temos a permutação simples $P(n,k) = \\frac{n!}{(n-k)!}$: são $n$ opções para o primeiro lugar, $n-1$ para o segundo e assim por diante. Já a combinação simples $\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$ conta seleções de $k$ elementos entre $n$, sem levar em conta a ordem; o denominador $k!$ remove justamente as $k!$ ordenações do mesmo grupo.\n\nOs coeficientes binomiais satisfazem a simetria $\\binom{n}{k} = \\binom{n}{n-k}$ e a identidade de Pascal $\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$, que gera o triângulo de Pascal. No teorema binomial, $(x+y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^{n-k} y^{k}$, cada coeficiente conta quantas maneiras de escolher $k$ fatores $y$ entre $n$. Quando repetições são permitidas, o número de seleções de $k$ elementos entre $n$ tipos é $\\binom{n+k-1}{k}$, fórmula diferente da combinação sem repetição.\n\nPara decidir qual fórmula usar, faça duas perguntas: a ordem importa e a repetição é permitida? Quatro categorias surgem das respostas, e confundi-las é a principal fonte de erro em contagem. Uma dica prática é testar com números pequenos e listar manualmente os resultados: a lista revela se duas ordens do mesmo grupo estão sendo contadas como uma coisa só ou como duas.",
      [
        ["fatorial", "Produto de todos os inteiros positivos até n, com zero fatorial definido como um."],
        ["permutação simples", "Número de maneiras de ordenar k elementos distintos escolhidos entre n."],
        ["combinação simples", "Número de maneiras de escolher k elementos entre n sem considerar a ordem."],
        ["coeficiente binomial", "Número que conta seleções de k elementos entre n e aparece no teorema binomial."],
        ["teorema binomial", "Fórmula que expande a potência de uma soma usando coeficientes binomiais."]
      ],
      {
        ex: [["Ordenar livros", "Escolher e ordenar $3$ entre $5$ livros dá $P(5,3) = \\frac{5!}{2!} = 5 \\cdot 4 \\cdot 3 = 60$ arranjos."], ["Formar um comitê", "Escolher $3$ pessoas entre $10$, sem cargos distintos, dá $\\binom{10}{3} = \\frac{10!}{3!\\,7!} = 120$ comitês."]],
        er: ["Usar permutação quando apenas a escolha importa, contando o mesmo grupo várias vezes.", "Achar que $\\binom{n}{k}$ e $\\binom{n}{n-k}$ são valores diferentes.", "Aplicar $n^k$ quando a repetição dos elementos é proibida."],
        lab: "Calcule de duas maneiras o número de maneiras de escolher 2 representantes entre 5 pessoas: primeiro com combinação e depois com permutação dividida por 2!.",
        ref: "OpenStax, College Algebra — princípios de contagem e teorema binomial (openstax.org)."
      }),
    L("Grafos: definições e representação",
      "Definir grafos, calcular graus e escolher uma representação adequada.",
      "Conjuntos, pares ordenados e contagem de subconjuntos.",
      "Um grafo é uma rede de pontos ligados por linhas; a forma de guardar essa rede muda o custo de cada consulta.",
      "Um grafo é um par $G = (V,E)$, em que $V$ é o conjunto de vértices e $E$ é o conjunto de arestas. Em um grafo não dirigido, uma aresta $\\{u,v\\}$ liga $u$ e $v$ sem orientação; em um grafo dirigido, a aresta $(u,v)$ tem direção, saindo de $u$ e chegando a $v$. Arestas que ligam um vértice a si mesmo são laços, e grafos com arestas repetidas são multigrafos. O grau $\\deg(v)$ conta quantas arestas incidem em $v$; em grafos dirigidos separamos o grau de entrada do grau de saída.\n\nO lema do aperto de mãos afirma que $\\sum_{v \\in V} \\deg(v) = 2|E|$ em um grafo não dirigido, pois cada aresta contribui com uma unidade para cada uma de suas extremidades. Consequência imediata: o número de vértices de grau ímpar é sempre par. No grafo completo $K_n$, toda dupla de vértices está ligada, logo $|E| = \\binom{n}{2} = \\frac{n(n-1)}{2}$.\n\nAs duas representações mais usadas são a lista de adjacência e a matriz de adjacência. A lista guarda, para cada vértice, seus vizinhos, usando espaço proporcional a $|V| + |E|$ e permitindo percorrer rapidamente as arestas de um vértice. A matriz de adjacência é uma matriz $n \\times n$ com entrada $1$ na posição $(i,j)$ se há aresta entre $i$ e $j$ e $0$ caso contrário; ela ocupa espaço $n^2$ e responde em tempo constante se dois vértices são adjacentes. Grafos dirigidos usam matrizes possivelmente assimétricas, e grafos com pesos guardam o peso na entrada da matriz.",
      [
        ["grafo", "Estrutura formada por um conjunto de vértices e um conjunto de arestas que ligam pares de vértices."],
        ["vértice", "Objeto básico de um grafo, também chamado de nó ou ponto."],
        ["aresta", "Ligação entre dois vértices, podendo ter direção em grafos dirigidos."],
        ["grau de um vértice", "Quantidade de arestas incidentes em um vértice, contando um laço duas vezes."],
        ["matriz de adjacência", "Matriz quadrada que registra com zeros e uns quais pares de vértices são ligados por arestas."]
      ],
      {
        ex: [["Aplicar o lema do aperto de mãos", "Em um grafo com $6$ vértices e $7$ arestas, a soma dos graus vale $2 \\cdot 7 = 14$, independentemente de como as arestas estejam distribuídas."], ["Descrever $K_4$", "O grafo completo com $4$ vértices tem $\\binom{4}{2} = 6$ arestas; sua matriz de adjacência tem zeros na diagonal e uns em todas as outras posições."]],
        er: ["Afirmar que o número de arestas é igual à soma dos graus, esquecendo de dividir por dois.", "Trocar a matriz de adjacência pela matriz de incidência sem perceber que têm dimensões diferentes.", "Supor que, em um grafo dirigido, grau de entrada e grau de saída coincidem em cada vértice."],
        lab: "Desenhe um grafo com 5 vértices e 6 arestas, calcule a soma dos graus e escreva sua lista de adjacência e sua matriz de adjacência.",
        ref: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest e Clifford Stein, Introduction to Algorithms — representações de grafos (mitpress.mit.edu)."
      }),
    L("Caminhos e conectividade",
      "Distinguir passeios, caminhos e ciclos e analisar a conectividade de grafos.",
      "Definições de grafo, graus e listas de adjacência.",
      "Caminhar por uma rede permite perguntar se dois pontos se conectam, qual é o menor trajeto e se dá para percorrer tudo sem repetir.",
      "Um passeio é uma sequência de vértices e arestas em que cada aresta liga o vértice atual ao seguinte. Quando nenhuma aresta se repete, temos uma trilha; quando nenhum vértice se repete, temos um caminho. Um ciclo é um caminho que começa e termina no mesmo vértice, com pelo menos uma aresta. Essas distinções importam porque propriedades como 'há um caminho entre dois vértices' são diferentes de 'há um passeio que usa todas as arestas'.\n\nUm grafo é conexo quando existe caminho entre quaisquer dois vértices; caso contrário, seus pedaços conexos máximos são as componentes conexas. Em grafos dirigidos, falamos em conexidade forte quando há caminho dirigido de qualquer vértice a qualquer outro, e em conexidade fraca quando isso vale ignorando as direções. A distância $d(u,v)$ entre dois vértices é o menor número de arestas de um caminho entre eles; a busca em largura encontra essas distâncias em grafos não ponderados, enquanto a busca em profundidade explora uma componente até o fim antes de voltar.\n\nDois problemas clássicos ilustram a diferença entre vértices e arestas. Um circuito euleriano percorre cada aresta exatamente uma vez e retorna ao início; em um grafo conexo não dirigido, ele existe se e somente se todos os vértices têm grau par. Um ciclo hamiltoniano visita cada vértice exatamente uma vez, e decidir se ele existe é um problema computacionalmente difícil. Saber qual dos dois está em jogo evita aplicar o critério de paridade das arestas a uma pergunta sobre vértices.",
      [
        ["passeio", "Sequência alternada de vértices e arestas em que cada aresta liga dois vértices consecutivos."],
        ["caminho", "Passeio no qual nenhum vértice se repete."],
        ["ciclo", "Caminho que começa e termina no mesmo vértice."],
        ["grafo conexo", "Grafo no qual existe caminho entre quaisquer dois vértices."],
        ["componente conexa", "Subgrafo conexo maximal de um grafo, que não pode ser ampliado sem perder a conexidade."]
      ],
      {
        ex: [["Classificar trajetos", "No grafo com vértices $A,B,C$ e arestas $AB$, $BC$ e $AC$, a sequência $A-B-C$ é um caminho e $A-B-C-A$ é um ciclo."], ["Verificar uma condição de Euler", "Se um grafo conexo tem todos os graus pares, como um triângulo $K_3$, então possui circuito que percorre cada aresta uma única vez."]],
        er: ["Chamar de caminho uma sequência que repete vértices, confundindo-o com passeio.", "Achar que todo grafo conexo admite circuito euleriano.", "Usar busca em largura para obter caminhos de menor custo em grafos com pesos diferentes."],
        lab: "Para o grafo com vértices A, B, C, D e arestas AB, AC, BD, CD, liste as componentes conexas e encontre um ciclo.",
        ref: "MIT OpenCourseWare, 6.006 Introduction to Algorithms — busca em largura e busca em profundidade (ocw.mit.edu)."
      }),
    L("Árvores",
      "Reconhecer árvores, usar suas propriedades de contagem e compreender árvores geradoras.",
      "Grafos conexos, caminhos e ciclos.",
      "Uma árvore é a rede mais enxuta possível que ainda mantém todos os pontos conectados.",
      "Uma árvore é um grafo não dirigido que é conexo e não contém ciclos. Uma floresta é um grafo acíclico, isto é, cada uma de suas componentes é uma árvore. Em uma árvore com $n$ vértices há exatamente $n-1$ arestas; mais do que isso cria algum ciclo, e menos do que isso deixa o grafo desconexo. Várias afirmações são equivalentes para um grafo com $n$ vértices: ser uma árvore, ter $n-1$ arestas e ser conexo, e ter entre quaisquer dois vértices exatamente um caminho.\n\nA unicidade do caminho é a propriedade mais útil na prática. Se duas rotas distintas ligassem os mesmos vértices, sua união conteria um ciclo; por outro lado, se retirarmos uma aresta qualquer de uma árvore, o grafo se separa em duas componentes. Ao escolher um vértice como raiz, obtemos uma árvore enraizada: cada vértice passa a ter pai, filhos, profundidade e altura. Folhas são os vértices sem filhos, e uma árvore binária é aquela em que cada vértice tem no máximo dois filhos.\n\nTodo grafo conexo possui uma árvore geradora, obtida removendo arestas até eliminar todos os ciclos sem desconectar o grafo. Árvores geradoras de menor custo aparecem em projetos de redes elétricas e de comunicação. O número de árvores rotuladas diferentes com $n$ vértices é dado pela fórmula de Cayley, $n^{n-2}$, e a sequência de Prüfer estabelece uma correspondência explícita entre essas árvores e sequências de comprimento $n-2$. Esses resultados mostram como contagem e estrutura se encontram no estudo das árvores.",
      [
        ["árvore", "Grafo não dirigido conexo e sem ciclos, no qual há caminho único entre quaisquer dois vértices."],
        ["floresta", "Grafo acíclico cujas componentes conexas são árvores."],
        ["árvore enraizada", "Árvore com um vértice escolhido como raiz, que define relações de pai, filho e nível."],
        ["folha", "Vértice de uma árvore enraizada que não possui filhos, isto é, grau um na árvore não enraizada."],
        ["árvore geradora", "Subgrafo de um grafo conexo que contém todos os vértices e é uma árvore."]
      ],
      {
        ex: [["Contar arestas", "Uma árvore com $10$ vértices tem exatamente $10 - 1 = 9$ arestas, qualquer que seja sua forma."], ["Usar a unicidade do caminho", "Se dois vértices de uma árvore já são ligados por uma aresta, acrescentar outro caminho entre eles fecharia um ciclo; por isso toda aresta nova em uma árvore cria um ciclo."]],
        er: ["Supor que um grafo conexo com ciclos ainda é uma árvore desde que tenha poucas arestas.", "Contar os filhos de um vértice em uma árvore enraizada como se a raiz fosse escolhida de outra forma.", "Afirmar que toda floresta é conexa."],
        lab: "Desenhe um grafo conexo com 6 vértices e 8 arestas, remova arestas até obter uma árvore geradora e verifique que sobraram 5 arestas.",
        ref: "Kenneth H. Rosen, Discrete Mathematics and Its Applications — árvores (mcgrawhill.com)."
      })
  ]
});

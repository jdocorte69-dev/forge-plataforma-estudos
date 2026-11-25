/* ============================================================
   FORGE — data-math-advanced.js
   Continuação da trilha de Matemática (M12–M19 da Enciclopédia Mestra).
   Arquivo clássico, sem módulos: carregado com defer depois de data.js
   e dos demais arquivos data-math*.js, que definem L e CURRICULUM.math.
   ============================================================ */

CURRICULUM.math.modules.push({
  name: "Cálculo I — reforço: limites, derivadas e integrais (M12)",
  lessons: [
    L("Por que surgiu o cálculo?",
      "Relacionar o problema da reta tangente e o da área de uma região curva à ideia de limite.",
      "Funções, gráficos e álgebra elementar.",
      "Duas perguntas antigas — qual é a inclinação no ponto e qual é a área sob a curva — exigem o mesmo truque: dividir em pedaços cada vez menores.",
      `O cálculo diferencial formaliza a taxa de variação instantânea; o cálculo integral formaliza a acumulação e a área orientada. As duas construções começam com aproximações: a inclinação de uma reta secante entre dois pontos e a soma de retângulos sob uma curva. Quando a distância entre os pontos tende a zero e quando a malha da partição se refina, essas aproximações tendem, se o limite existir, à derivada e à integral definida. Importa registrar que nem todo limite existe: as condições de existência fazem parte da definição, não são detalhes acessórios.`,
      [
        ["derivada", "Limite das inclinações das retas secantes quando o intervalo tende a zero, quando esse limite existe."],
        ["integral definida", "Limite de somas de Riemann sobre partições cada vez mais finas, quando o limite existe."],
        ["reta secante", "Reta que passa por dois pontos distintos do gráfico; sua inclinação aproxima a da tangente."],
        ["soma de Riemann", "Soma de áreas de retângulos construídos sobre uma partição do intervalo."],
        ["taxa instantânea", "Valor-limite de uma razão entre variações quando o intervalo de variação tende a zero."]
      ],
      {
        derivation: `Inclinação secante entre x e x+h: m(h) = [f(x+h) − f(x)]/h, com h ≠ 0. A inclinação da tangente é lim(h→0) m(h), se existir. Para a área, particione [a,b] em n intervalos de largura Δx e some f(x_i*)·Δx; a área orientada é o limite dessa soma quando a maior largura da partição tende a zero.`,
        ex: [
          ["Interpretação geométrica", "Para f(x)=x², a secante entre 1 e 1+h tem inclinação 2+h; o limite quando h→0 é 2, que é a inclinação da tangente em x=1."],
          ["Interpretação física", "Se s(t) é a posição, [s(t+h)−s(t)]/h é a velocidade média no intervalo; o limite é a velocidade instantânea em t."]
        ],
        er: ["Tratar a aproximação por diferenças finitas como se fosse a derivada exata.", "Supor que toda soma de retângulos já é a área exata, sem passar ao limite."],
        tags: ["cálculo I", "limite", "motivação"],
        estimatedEffort: 20
      }),
    L("Limites: valor no ponto versus aproximação",
      "Distinguir f(a) de lim(x→a) f(x), calcular limites laterais e aplicar a definição epsilon-delta.",
      "Operações algébricas, função e noção de gráfico.",
      "O limite pergunta para onde a função caminha; o valor no ponto pergunta onde ela está. São perguntas diferentes e podem ter respostas diferentes.",
      `Por definição, lim(x→a) f(x)=L significa: para todo ε>0 existe δ>0 tal que 0<|x−a|<δ implica |f(x)−L|<ε. A desigualdade 0<|x−a| exclui o próprio ponto a, então o valor f(a) é irrelevante para o limite: ele pode não existir ou pode ser diferente de L. Exemplo: f(x)=(x²−1)/(x−1) para x≠1 e f(1)=7 tem lim(x→1) f(x)=2, pois a expressão se simplifica para x+1 fora de 1, mas f(1)=7. O limite existe somente quando os limites lateral esquerdo e lateral direito existem e coincidem; limite esquerdo diferente do direito implica limite inexistente. Indeterminações como 0/0 e ∞/∞ pedem manipulação algébrica ou trigonométrica antes de qualquer conclusão. Limites no infinito e limites infinitos descrevem, respectivamente, comportamento assintótico e crescimento sem limite; assíntotas são retas que descrevem esse comportamento.`,
      [
        ["limite", "Valor L ao qual f(x) se aproxima quando x se aproxima de a com x diferente de a, se tal valor existir."],
        ["limite lateral", "Limite calculado aproximando-se de a somente pela esquerda ou somente pela direita."],
        ["valor no ponto", "Número f(a), definido pela regra da função em a; não determina o limite, nem precisa existir."],
        ["definição epsilon-delta", "Definição formal de limite: para todo ε>0 existe δ>0 tal que 0<|x−a|<δ implica |f(x)−L|<ε."],
        ["assíntota", "Reta à qual o gráfico se aproxima quando x ou f(x) tende ao infinito."]
      ],
      {
        derivation: `Prova de lim(x→2) (3x+1)=7: dado ε>0, escolha δ=ε/3. Se 0<|x−2|<δ, então |(3x+1)−7| = 3|x−2| < 3δ = ε. A escolha de δ depende de ε e a restrição 0<|x−2| mostra que o ponto x=2 não é usado na prova.`,
        ex: [
          ["Valor no ponto diferente do limite", "f(x)=(x²−1)/(x−1) para x≠1, f(1)=7: lim(x→1) f(x)=2 e f(1)=7; a função é descontínua em 1."],
          ["Fatoração antes de substituir", "lim(x→2) (x²−4)/(x−2) = lim(x→2) (x+2) = 4; substituir diretamente daria 0/0, que não é resposta."]
        ],
        er: [
          "Substituir x=a e aceitar 0/0 como se fosse o valor do limite.",
          "Achar que f(a) e lim(x→a) f(x) são sempre iguais.",
          "Ignorar um dos limites laterais em funções com salto."
        ],
        lab: `Laboratório de aproximação numérica: implemente uma aproximação de limite por diferenças finitas. Avalie f em a−h e a+h para h=10⁻¹, 10⁻², ..., 10⁻⁶ e compare os resultados com o valor exato calculado algebraicamente. Registre explicitamente que cada resultado é uma aproximação numérica, que o ponto a não é avaliado e que h muito pequeno pode trazer cancelamento de ponto flutuante.`,
        masteryCriteria: [
          "2 pts — calcula corretamente o limite e o valor no ponto e afirma quando são distintos.",
          "2 pts — calcula e compara os dois limites laterais com a condição de existência.",
          "2 pts — apresenta uma justificativa epsilon-delta correta, com escolha explícita de δ.",
          "2 pts — simplifica indeterminações com álgebra válida e indica as restrições de domínio.",
          "2 pts — interpreta a saída do laboratório como aproximação e explica o papel de h."
        ],
        ref: "James Stewart, Cálculo — limites e definição formal (cengage.com).",
        tags: ["cálculo I", "limite", "epsilon-delta"],
        estimatedEffort: 45
      }),
    L("Continuidade, descontinuidades e critérios de domínio",
      "Caracterizar a continuidade em um ponto, classificar descontinuidades e aplicar o teorema do valor intermediário.",
      "Limites laterais e definição de função.",
      "Uma função contínua não tem furo, salto nem explosão no ponto: limite, valor e aproximação se encaixam.",
      `f é contínua em a quando três condições valem: f(a) está definida, lim(x→a) f(x) existe e os dois valores coincidem. Se o limite existe mas f(a) está ausente ou é diferente, a descontinuidade é removível; se os limites laterais existem e são diferentes, há salto; se um dos laterais diverge para infinito, há descontinuidade infinita. O teorema do valor intermediário afirma que, para f contínua em [a,b], todo valor entre f(a) e f(b) é atingido em algum c do intervalo; uma consequência prática é que f(a)·f(b)<0 garante raiz em (a,b). Critério de domínio: continuidade só é discutida em pontos do domínio que sejam pontos de acumulação do domínio; em extremos de intervalo usa-se continuidade lateral. Fora do domínio não faz sentido falar em continuidade da função naquele ponto.`,
      [
        ["continuidade", "Propriedade pela qual f(a) existe, o limite em a existe e os dois valores coincidem."],
        ["descontinuidade removível", "Descontinuidade em que o limite existe, mas o valor da função está ausente ou é diferente."],
        ["descontinuidade de salto", "Descontinuidade em que os limites laterais existem, mas são diferentes."],
        ["teorema do valor intermediário", "Resultado que garante que uma função contínua em [a,b] atinge todos os valores entre f(a) e f(b)."],
        ["continuidade lateral", "Continuidade verificada por um dos lados, usada nas extremidades do domínio."]
      ],
      {
        ex: [
          ["Descontinuidade removível", "(x²−1)/(x−1) com f(1)=7: limite 2, valor 7; redefinindo f(1)=2 a função se torna contínua em 1."],
          ["Salto", "f(x)=−1 para x<0 e f(x)=1 para x≥0: limites laterais −1 e 1, logo o limite em 0 não existe."],
          ["Descontinuidade infinita", "f(x)=1/x² em 0: ambos os limites laterais tendem a +∞, então não há limite finito e o ponto não está no domínio."]
        ],
        er: ["Classificar como removível um ponto em que os limites laterais são diferentes.", "Aplicar o teorema do valor intermediário a uma função descontínua no intervalo."],
        tags: ["cálculo I", "continuidade", "domínio"],
        estimatedEffort: 30
      }),
    L("Derivada como inclinação e taxa de variação",
      "Obter a regra da potência a partir do limite, aplicar as regras de derivação e interpretar o resultado.",
      "Limites e simplificação algébrica.",
      "Derivar é medir a sensibilidade de uma saída a uma pequena variação da entrada.",
      `A derivada de f em x é f'(x)=lim(h→0) [f(x+h)−f(x)]/h, quando o limite existe; em um ponto específico ela é um número, e como função de x é uma nova função. Geometricamente é a inclinação da reta tangente; fisicamente é velocidade instantânea quando a função é posição. As regras operacionais — soma, produto, quociente, cadeia — vêm de propriedades do limite e permitem derivar funções trigonométricas, exponenciais e logarítmicas. Derivação implícita trata y como função de x e deriva ambos os lados; derivadas de ordem superior são derivadas da derivada. Critério de existência: derivabilidade em um ponto exige limite da razão incremental finito; cantos, saltos e tangentes verticais são pontos em que a derivada pode não existir.`,
      [
        ["derivada", "Limite da razão incremental em um ponto, quando existe; interpreta-se como inclinação da tangente."],
        ["regra da cadeia", "Regra para derivar f(g(x)): f'(g(x))·g'(x), com as derivabilidades necessárias."],
        ["derivação implícita", "Técnica que deriva os dois lados de uma relação F(x,y)=0 tratando y como função de x."],
        ["taxa instantânea", "Derivada interpretada como variação por unidade de entrada em um instante."],
        ["derivada de ordem superior", "Derivada tomada repetidamente, como f'' e f'''. "]
      ],
      {
        derivation: `Para n natural, (d/dx) xⁿ = lim(h→0) [(x+h)ⁿ − xⁿ]/h. Pelo binômio, (x+h)ⁿ − xⁿ = n xⁿ⁻¹ h + C(n,2) xⁿ⁻² h² + ... + hⁿ. Dividindo por h e tomando h→0, todos os termos com fator h positivo desaparecem, restando n xⁿ⁻¹. A extensão a expoentes reais arbitrários exige ferramentas adicionais e domínio x>0 quando o expoente não é inteiro.`,
        ex: [
          ["Regra do produto", "d/dx [x²·eˣ] = 2x·eˣ + x²·eˣ = eˣ(2x + x²)."],
          ["Regra da cadeia", "d/dx sen(2x) = 2 cos(2x); o fator 2 vem da derivada do argumento."],
          ["Derivação implícita", "De x²+y²=25, derivando: 2x+2y y'=0, logo y' = −x/y para y≠0."]
        ],
        er: ["Derivar um produto como produto das derivadas.", "Esquecer o fator interno na regra da cadeia.", "Ignorar pontos do domínio em que a derivada não existe."],
        lab: `Laboratório de derivadas: compare a derivada simbólica de f(x)=x²·eˣ com uma aproximação por diferenças centradas [f(x+h)−f(x−h)]/(2h) para h=10⁻², 10⁻⁴, 10⁻⁶; rotule os valores numéricos como aproximações e discuta erro de truncamento e cancelamento. Em seguida use a derivada para otimizar uma função de custo simples C(q)=q²−8q+20 e verifique o ponto crítico dentro do domínio q≥0.`,
        tags: ["cálculo I", "derivada", "taxa"],
        estimatedEffort: 40
      }),
    L("Somas de Riemann e Teorema Fundamental do Cálculo",
      "Calcular uma integral definida a partir da soma de Riemann e enunciar o teorema que liga integração e derivação.",
      "Somas, limites e noção de derivada.",
      "Integrar é somar contribuições pequenas; o teorema fundamental diz que essa soma pode ser feita com uma primitiva.",
      `A integral indefinida é a família de primitivas F+C; a integral definida ∫ₐᵇ f(x) dx é um número, o limite das somas de Riemann quando a partição se refina, e frequentemente representa área assinada. O Teorema Fundamental do Cálculo afirma que, se F'=f em um intervalo que contém a e b e f é contínua, então ∫ₐᵇ f(x) dx = F(b)−F(a): a constante C se cancela. Área geométrica exige |f| quando a curva fica abaixo do eixo; o valor médio de f em [a,b] é (1/(b−a))∫ₐᵇ f(x) dx. Critério de domínio: a integral imprópria ou com singularidade interna deve ser tratada como limite, não como substituição direta nos extremos.`,
      [
        ["integral definida", "Número obtido como limite de somas de Riemann entre os limites a e b."],
        ["primitiva", "Função F tal que F'=f em um intervalo; a integral indefinida é F+C."],
        ["teorema fundamental do cálculo", "Resultado que calcula ∫ₐᵇ f por F(b)−F(a) quando F'=f e f é contínua."],
        ["área assinada", "Integral de f, com contribuições negativas onde f<0; distinta da área geométrica."],
        ["valor médio", "Integral dividida pelo comprimento do intervalo, com a dimensão da função."]
      ],
      {
        derivation: `Calcule ∫₀¹ x² dx por somas de Riemann. Divida [0,1] em n partes de largura Δx=1/n e use os extremos direitos x_i=i/n. Então S_n = Σ_{i=1}^n (i/n)²·(1/n) = [n(n+1)(2n+1)/6]/n³ = (2n³+3n²+n)/(6n³). O limite n→∞ é 1/3. Cada S_n com n finito é uma aproximação; apenas o limite é o valor exato da integral.`,
        ex: [
          ["Primitiva e constante", "∫ 2x dx = x²+C; em ∫₀¹ 2x dx a constante cancela e o resultado é 1."],
          ["Área assinada", "∫₋₁¹ x dx = 0, mas a área geométrica entre a curva e o eixo é 1."],
          ["Aplicação física", "Se v(t) é velocidade, ∫₀ᵀ v(t) dt é o deslocamento líquido em [0,T]."]
        ],
        er: ["Esquecer a constante C em integrais indefinidas.", "Confundir área assinada com área geométrica.", "Aplicar o teorema fundamental sem verificar continuidade ou sem tratar singularidades."],
        lab: `Laboratório de integração: implemente somas de Riemann com retângulos para ∫₀¹ x² dx e compare com o valor exato 1/3. Repita com a regra dos trapézios e com Simpson para n=10, 100 e 1000; todos os resultados numéricos são aproximações, e o relatório deve registrar o erro absoluto para cada método.`,
        masteryCriteria: [
          "2 pts — deriva a soma S_n e calcula o limite corretamente.",
          "2 pts — distingue integral indefinida, integral definida e área geométrica.",
          "2 pts — enuncia o teorema fundamental com suas hipóteses.",
          "2 pts — executa o laboratório e reporta erros como aproximações.",
          "2 pts — identifica restrições de domínio e singularidades antes de integrar."
        ],
        ref: "James Stewart, Cálculo — integrais e teorema fundamental (cengage.com).",
        tags: ["cálculo I", "integral", "Riemann"],
        estimatedEffort: 45
      })
  ]
});

CURRICULUM.math.modules.push({
  name: "Cálculo II — integração, séries e EDO introdutória (M13)",
  lessons: [
    L("Técnicas de integração e critérios de aplicação",
      "Selecionar e aplicar substituição, partes, trigonometria, frações parciais e integrais impróprias.",
      "Primitivas e Teorema Fundamental do Cálculo.",
      "Não existe uma receita única: cada técnica explode uma estrutura diferente do integrando, e a escolha depende do que está presente.",
      `A substituição desfaz a regra da cadeia quando aparece f(g(x))·g'(x); em integrais definidas é obrigatório converter também os limites. Integração por partes desfaz a regra do produto e é útil quando um fator deriva para algo mais simples. Integrais trigonométricas usam identidades; substituições trigonométricas são adequadas a expressões como √(a²−x²), √(a²+x²) e √(x²−a²), com ressalvas de domínio e de sinal ao tirar a raiz. Frações parciais exigem função racional própria e fatoração do denominador. Integrais impróprias são limites: ∫ₐ^∞ f(x) dx = lim(b→∞) ∫ₐᵇ f(x) dx e, se há singularidade em c, os dois lados são tratados separadamente; convergência significa limite finito. Critérios de domínio: ln|x| exige argumento não nulo, substituições invertíveis exigem escolha de intervalo e frações parciais não se aplicam a denominador não fatorado no conjunto considerado.`,
      [
        ["integração por partes", "Técnica baseada em (uv)'=u'v+uv', escrita como ∫u dv = uv − ∫v du."],
        ["substituição", "Técnica que troca a variável usando u=g(x) e du=g'(x)dx, convertendo também os limites na integral definida."],
        ["frações parciais", "Decomposição de uma função racional própria em soma de termos simples com denominadores fatorados."],
        ["integral imprópria", "Integral com extremo infinito ou singularidade interna, definida por limite."],
        ["convergência de integral imprópria", "Condição de que o limite que define a integral imprópria existe e é finito."]
      ],
      {
        derivation: `Integração por partes vem da regra do produto: (uv)'=u'v+uv', logo uv'= (uv)−u'v. Integrando ambos os lados, ∫u dv = uv − ∫v du. A substituição vem da regra da cadeia: se F'=f, então (F(g(x)))'=f(g(x))g'(x), portanto ∫f(g(x))g'(x) dx = F(g(x))+C = ∫f(u) du com u=g(x).`,
        ex: [
          ["Partes", "∫ x eˣ dx: tome u=x, dv=eˣdx; resultado x eˣ − eˣ + C."],
          ["Frações parciais", "1/(x²−1) = 1/2·[1/(x−1) − 1/(x+1)], válido para x≠±1; a integral é (1/2)ln|(x−1)/(x+1)|+C."],
          ["Imprópria", "∫₁^∞ 1/x² dx = lim(b→∞)(1−1/b)=1: converge; ∫₁^∞ 1/x dx diverge, pois ln b→∞."]
        ],
        er: ["Esquecer de converter os limites em uma substituição de integral definida.", "Tratar uma integral imprópria como substituição direta do infinito.", "Aplicar frações parciais a denominador irredutível sobre o conjunto considerado."],
        tags: ["cálculo II", "integração", "técnicas"],
        estimatedEffort: 45
      }),
    L("Aplicações de integração: volumes, arco, trabalho e pressão",
      "Montar integrais para volumes de rotação, comprimento de arco, área de superfície, trabalho, pressão, centro de massa e valor médio.",
      "Integral definida e técnicas de integração.",
      "A habilidade central não é integrar, é escolher o elemento infinitesimal correto.",
      `Volumes por discos somam área π[R(x)]² ao longo do eixo; anéis (arruelas) subtraem o raio interno: π[R(x)²−r(x)²]. Cascas cilíndricas somam 2π·raio·altura·espessura e são vantajosas quando o eixo é paralelo à variável de integração. Comprimento de arco de y=f(x) em [a,b] é ∫ₐᵇ √(1+[f'(x)]²) dx, exigindo derivabilidade e integral existente; área de superfície de rotação é ∫ₐᵇ 2π f(x)√(1+[f'(x)]²) dx quando f(x)≥0. Trabalho é ∫ F(x) dx; pressão sobre uma placa vertical é ∫ ρg·profundidade·largura dy; centro de massa usa momentos divididos pela massa total; valor médio é (1/(b−a))∫ₐᵇ f(x) dx. Critérios de domínio: raios e densidades devem ser não negativos, a região deve ser descrita dentro do intervalo onde as fórmulas valem e a densidade integrável não pode ter massa total zero.`,
      [
        ["método dos discos", "Volume de rotação somando discos perpendiculares ao eixo, com área πR²."],
        ["método das cascas", "Volume de rotação somando cilindros finos, com volume 2π·raio·altura·espessura."],
        ["comprimento de arco", "Integral de √(1+(f')²) ao longo do intervalo, quando a derivada existe."],
        ["trabalho", "Integral de uma força ao longo do deslocamento, com unidades coerentes."],
        ["centro de massa", "Ponto dado por momentos divididos pela massa total de uma distribuição."]
      ],
      {
        derivation: `Para o método dos discos, particione o eixo em fatias de espessura Δx: cada fatia tem volume aproximado πR(x_i)²Δx; o limite da soma quando Δx→0 é ∫πR(x)² dx. Para cascas, uma faixa vertical de altura h(x), raio r(x) e espessura Δx tem volume aproximado 2π r(x) h(x) Δx; a soma limite é ∫2π r(x) h(x) dx.`,
        ex: [
          ["Disco", "Rotacionar y=x em torno do eixo x de 0 a 2: V=∫₀² πx² dx = 8π/3."],
          ["Comprimento de arco", "Para y=x em [0,1], comprimento = ∫₀¹ √2 dx = √2."],
          ["Trabalho", "Uma mola com força F(x)=kx de 0 a L requer trabalho ∫₀ᴸ kx dx = kL²/2."]
        ],
        er: ["Esquecer a espessura ou o fator 2π no elemento de volume.", "Usar f(x) negativo como raio sem corrigir o sinal.", "Montar a integral sem verificar qual fatia é descrita pela função."],
        tags: ["cálculo II", "aplicações", "geometria"],
        estimatedEffort: 40
      }),
    L("Sequências e séries: testes de convergência",
      "Classificar sequências e séries quanto à convergência escolhendo o teste adequado e verificando suas hipóteses.",
      "Limites de sequências e noção de soma parcial.",
      "Somar infinitos termos é uma pergunta sobre o limite das somas parciais, não sobre a intuição de 'somar muito'.",
      `Uma sequência converge quando seus termos se aproximam de um limite finito; uma série converge quando a sequência das somas parciais converge. O teste do termo geral só serve para divergência: se aₙ não tende a zero, a série diverge; se tende a zero, nada conclui. Série geométrica Σ a rⁿ converge para a/(1−r) quando |r|<1. O teste da integral exige f positiva, contínua e decrescente em [N,∞) e compara Σ f(n) com ∫_N^∞ f(x) dx. Testes de comparação e comparação por limite exigem termos positivos eventualmente. O teste da razão usa L=lim|aₙ₊₁/aₙ|: L<1 implica convergência absoluta, L>1 divergência, L=1 não decide; o teste da raiz é análogo com lim |aₙ|^(1/n). Séries alternadas com |aₙ| decrescente a zero convergem (teste de Leibniz). Convergência absoluta implica convergência; convergência condicional ocorre quando a série converge, mas a dos valores absolutos diverge, como a série harmônica alternada.`,
      [
        ["soma parcial", "Soma dos primeiros n termos de uma série; a série converge se essa sequência converge."],
        ["teste da razão", "Teste baseado em lim|aₙ₊₁/aₙ|, concludente quando o limite é menor ou maior que 1."],
        ["teste da integral", "Teste que compara a série com uma integral, exigindo função positiva, contínua e decrescente."],
        ["convergência absoluta", "Convergência da série dos valores absolutos dos termos."],
        ["convergência condicional", "Situação em que a série converge, mas não converge absolutamente."]
      ],
      {
        derivation: `Soma geométrica: S_n = a + ar + ... + ar^{n−1}. Multiplicando por r, rS_n = ar + ... + ar^n; subtraindo, S_n(1−r)=a(1−rⁿ), logo S_n=a(1−rⁿ)/(1−r) para r≠1. Como rⁿ→0 quando |r|<1, a série converge para a/(1−r). Para |r|>1 os termos não tendem a zero e a série diverge; para r=1 os termos são constantes e também divergem, salvo o caso trivial a=0.`,
        ex: [
          ["Geométrica", "1/2 + 1/4 + 1/8 + ... = (1/2)/(1−1/2) = 1."],
          ["Teste do termo geral", "Σ n/(n+1) diverge, pois o termo tende a 1, não a zero."],
          ["Condicional", "Σ (−1)ⁿ⁺¹/n converge por Leibniz, mas Σ 1/n diverge: convergência condicional."]
        ],
        er: ["Achar que termo tendendo a zero garante convergência.", "Aplicar o teste da integral sem verificar monotonicidade e positividade.", "Usar o teste da razão quando o limite é 1 como se fosse conclusivo."],
        lab: `Laboratório de séries: visualize a convergência de Σ 1/n² e da série harmônica Σ 1/n plotando somas parciais para n até 10⁴ e comparando com o limite conhecido π²/6 no primeiro caso. Rotule os gráficos como aproximações por soma parcial e registre o comportamento lento da série harmônica.`,
        tags: ["cálculo II", "séries", "convergência"],
        estimatedEffort: 45
      }),
    L("Séries de potências, Taylor e erro de truncamento",
      "Determinar raio e intervalo de convergência e construir aproximações de Taylor com estimativa de erro.",
      "Testes de razão e raiz e derivadas de ordem superior.",
      "Uma série de potências é um polinômio infinito que só representa a função dentro do seu conjunto de convergência.",
      `Uma série de potências em torno de a tem a forma Σ cₙ(x−a)ⁿ; o raio R é tal que converge para |x−a|<R e diverge para |x−a|>R, enquanto as extremidades x=a±R devem ser testadas separadamente. A série de Taylor de f em a é Σ f⁽ⁿ⁾(a)(x−a)ⁿ/n!, e os coeficientes são forçados pela exigência de que as derivadas da série coincidam com as de f em a. O polinômio de Taylor de grau n fornece uma aproximação local; o resto de Lagrange é Rₙ(x)=f⁽ⁿ⁺¹⁾(ξ)(x−a)ⁿ⁺¹/(n+1)! para algum ξ entre a e x, desde que a derivada de ordem n+1 exista no intervalo. Exemplos padrão: eˣ=Σ xⁿ/n! para todo x real e 1/(1−x)=Σ xⁿ apenas para |x|<1. Fora do intervalo de convergência a série não representa a função, mesmo que alguns termos pareçam razoáveis.`,
      [
        ["série de potências", "Série da forma Σ cₙ(x−a)ⁿ, com convergência dependente de x."],
        ["raio de convergência", "Valor R tal que a série converge para |x−a|<R e diverge para |x−a|>R."],
        ["polinômio de Taylor", "Soma dos primeiros termos da série de Taylor, usada como aproximação local."],
        ["resto de Lagrange", "Expressão para o erro de truncamento de Taylor com derivada de ordem n+1 em ponto intermediário."],
        ["série de Maclaurin", "Série de Taylor centrada em a=0."]
      ],
      {
        derivation: `Para obter os coeficientes, procure P(x)=c₀+c₁(x−a)+c₂(x−a)²+... com P(a)=f(a), P'(a)=f'(a) e assim por diante. Derivando termo a termo, P⁽ⁿ⁾(a)=n!·cₙ, logo cₙ=f⁽ⁿ⁾(a)/n!. A fórmula do resto de Lagrange segue do teorema do valor médio generalizado aplicado repetidamente à diferença f−Pₙ.`,
        ex: [
          ["Taylor de eˣ em 0", "1 + x + x²/2 + x³/6 + ...; para x=0,1 a aproximação de grau 3 é 1,666..., enquanto e≈2,71828."],
          ["Raio", "Para Σ xⁿ, o teste da razão dá |x|<1; em x=1 a série diverge e em x=−1 também, logo o intervalo é (−1,1)."],
          ["Erro", "Para eˣ com grau 3 em torno de 0 e x∈[0,1], |R₃|≤e/4! < 0,12."]
        ],
        er: ["Esquecer de testar as extremidades do intervalo de convergência.", "Tratar o polinômio de Taylor como igualdade global fora do raio.", "Omitir a estimativa do erro ao chamar o resultado de aproximação."],
        tags: ["cálculo II", "Taylor", "aproximação"],
        estimatedEffort: 40
      }),
    L("Equações diferenciais introdutórias: separáveis e campos de direção",
      "Resolver EDOs separáveis com condição inicial, modelar crescimento e resfriamento e interpretar campos de direção.",
      "Integração e noção de derivada.",
      "Uma EDO descreve uma taxa; resolver significa recuperar a função a partir da taxa, com uma condição inicial fixando a solução.",
      `Uma equação diferencial ordinária (EDO) envolve uma incógnita e suas derivadas; a ordem é a da maior derivada presente. Na forma separável y'=g(x)h(y), integrate ∫ dy/h(y)=∫ g(x) dx, com C determinado pela condição inicial; soluções constantes onde h(y)=0 devem ser verificadas à parte, pois a divisão por h as perde. Crescimento e decaimento seguem P'=kP, com P=P₀e^{kt}; o resfriamento de Newton segue T'=−k(T−Tₘ), com T=Tₘ+(T₀−Tₘ)e^{−kt}. Um campo de direções desenha em cada ponto a inclinação dada por f(x,y), permitindo visualizar famílias de soluções antes de resolvê-las. O método de Euler produz uma aproximação numérica y_{n+1}=y_n+h f(x_n,y_n); o passo h controla o erro e deve ser pequeno, mas h muito pequeno aumenta o número de passos e pode agravar erros de arredondamento.`,
      [
        ["EDO separável", "Equação y'=g(x)h(y) que permite integrar cada variável em um lado."],
        ["problema de valor inicial", "EDO acompanhada de uma condição y(x₀)=y₀ que fixa a constante de integração."],
        ["campo de direções", "Desenho das inclinações f(x,y) em pontos do plano, usado para visualizar soluções."],
        ["resfriamento de Newton", "Modelo T'=−k(T−Tₘ), em que a taxa de variação é proporcional à diferença para o meio."],
        ["método de Euler", "Esquema numérico de primeiro ordem que avança pela tangente; fornece aproximações."]
      ],
      {
        derivation: `De y'=g(x)h(y), escreva dy/dx=g(x)h(y). Em intervalos onde h(y)≠0, divida: dy/h(y)=g(x)dx. Integrando, H(y)=G(x)+C, com H'=1/h e G'=g; a condição inicial determina C. Para o modelo exponencial P'=kP: dP/P=k dt, logo ln|P|=kt+C₁ e P=±e^{C₁}e^{kt}=P₀e^{kt}. Euler vem da expansão de Taylor y(x+h)≈y(x)+h y'(x)=y(x)+h f(x,y).`,
        workedExamples: [
          "Comparar métodos numéricos de integração: trapézios e Simpson aplicados a uma integral conhecida, com erros rotulados como aproximações.",
          "Visualizar convergência de séries: plotar somas parciais de Σ 1/n² e Σ 1/n.",
          "Simular crescimento exponencial: esta é uma simulação, não um dado observado; variar k e comparar com P₀e^{kt}.",
          "Resolver uma EDO simples por Euler e comparar com a solução analítica: y'=y, y(0)=1, passo h, contra e^t."
        ],
        ex: [
          ["PVI", "y'=2y, y(0)=3: separando, ln|y|=2x+C e C=ln 3; solução y=3e^{2x}."],
          ["Resfriamento", "Tₘ=20, T₀=80, k=0,1: T(t)=20+60e^{−0,1t}, que tende a 20 quando t cresce."],
          ["Euler", "Para y'=y, y(0)=1 e h=0,1: y₁≈1,1; o valor exato é e^{0,1}≈1,10517, logo 1,1 é aproximação."]
        ],
        er: ["Dividir por h(y) sem verificar soluções constantes perdidas.", "Achar que o campo de direções fornece uma única solução sem condição inicial.", "Apresentar o resultado de Euler como valor exato."],
        lab: `Laboratório M13 (quatro atividades condensadas): compare métodos numéricos de integração com um valor exato conhecido; visualize a convergência de séries por somas parciais; simule crescimento exponencial, identificando a simulação como tal; resolva y'=y por Euler e compare cada valor aproximado com a solução analítica e^t. Entregue uma tabela com passo h, valor aproximado, valor exato e erro absoluto.`,
        masteryCriteria: [
          "2 pts — separa variáveis corretamente e recupera a constante pela condição inicial.",
          "2 pts — verifica soluções constantes e restrições de domínio da separação.",
          "2 pts — interpreta um campo de direções e relaciona-o a soluções." ,
          "2 pts — implementa Euler com passo h e rotula os valores como aproximações.",
          "2 pts — compara aproximações numéricas com a solução analítica e quantifica o erro."
        ],
        ref: "James Stewart, Cálculo — equações diferenciais separáveis (cengage.com).",
        tags: ["cálculo II", "EDO", "modelagem"],
        estimatedEffort: 50
      })
  ]
});

CURRICULUM.math.modules.push({
  name: "Cálculo III — multivariável e vetorial (M14)",
  lessons: [
    L("Vetores e geometria no espaço",
      "Operar com vetores em ℝ² e ℝ³, descrever retas e planos e usar coordenadas cilíndricas e esféricas.",
      "Geometria analítica e trigonometria.",
      "Vetores combinam direção e magnitude; produtos escalar e vetorial respondem perguntas diferentes sobre dois vetores.",
      `O produto escalar u·v=|u||v|cosθ mede alinhamento e é zero quando os vetores são perpendiculares; o produto vetorial u×v tem direção normal ao plano de u e v e magnitude |u||v|senθ, igual à área do paralelogramo. Uma reta é r(t)=p+t v e um plano é n·(x−p)=0, onde n é normal; a distância de um ponto q ao plano é |n·(q−p)|/|n|. Superfícies quádricas são zeros de polinômios quadrados em x, y, z, como esferas, elipsoides, cones e paraboloides. Coordenadas cilíndricas usam (r,θ,z) com x=r cosθ, y=r sinθ; coordenadas esféricas usam (ρ,θ,φ) com z=ρ cosφ e raio cilíndrico r=ρ senφ. Critérios de domínio: r≥0, ρ≥0, θ em um intervalo de comprimento 2π e φ em [0,π] evitam dupla contagem; a convenção dos ângulos deve ser explicitada.`,
      [
        ["produto escalar", "Número u·v=|u||v|cosθ que mede alinhamento e serve para testar ortogonalidade."],
        ["produto vetorial", "Vetor perpendicular a u e v com magnitude igual à área do paralelogramo por eles formado."],
        ["equação do plano", "Relação n·(x−p)=0, em que n é um vetor normal ao plano."],
        ["superfície quádrica", "Conjunto de pontos que satisfaz uma equação polinomial de segundo grau em três variáveis."],
        ["coordenadas esféricas", "Sistema (ρ,θ,φ) que especifica ponto por distância à origem e dois ângulos."]
      ],
      {
        derivation: `A magnitude do produto vetorial pode ser obtida da área do paralelogramo: A=|u||v|senθ, e |u×v|²=|u|²|v|²−(u·v)², usando sen²θ=1−cos²θ e u·v=|u||v|cosθ. A distância ponto-plano vem de projetar q−p sobre a normal unitária n/|n|:distância = |(q−p)·n|/|n|.`,
        ex: [
          ["Ortogonalidade", "u=(1,2,0) e v=(−2,1,0): u·v=0, logo são perpendiculares."],
          ["Plano", "Plano normal n=(1,1,1) por p=(1,0,0): (x−1)+y+z=0."],
          ["Conversão", "Esférico ρ=2, θ=π/2, φ=π/3: z=1, r=√3, e com x=r cosθ=0, y=r senθ=√3."]
        ],
        er: ["Confundir produto escalar e vetorial.", "Usar ângulos fora das convenções e contar pontos duas vezes.", "Tomar um vetor qualquer do plano como se fosse normal."],
        lab: `Laboratório M14 (atividade 2): desenhe as superfícies z=x²+y², x²+y²=4 e uma esfera em um visualizador; identifique seções e compare com as equações. Rotule as imagens como representações geradas por software, não como prova analítica.`,
        tags: ["cálculo III", "vetores", "geometria"],
        estimatedEffort: 35
      }),
    L("Funções de várias variáveis: domínio, limites e continuidade",
      "Determinar domínios e curvas de nível e decidir se um limite multivariável existe.",
      "Funções de uma variável, limites e vetores.",
      "Em duas variáveis, aproximar-se de um ponto pode ser feito por infinitos caminhos; isso muda a forma de testar um limite.",
      `Para f(x,y), o domínio é o conjunto de pares para os quais a expressão é definida: denominadores não podem ser zero, radicais pares exigem radicando ≥0 e logaritmos exigem argumento >0. Exemplo: f=ln(y−x²) exige y−x²>0, região acima da parábola y=x²; f=1/√(4−x²−y²) exige x²+y²<4. Curvas de nível são conjuntos f(x,y)=c. O limite de f em (a,b) existe somente se todos os caminhos que se aproximam do ponto produzem o mesmo valor; encontrar dois caminhos com resultados diferentes prova que o limite não existe. Como em uma variável, o limite não depende de f(a,b): o valor no ponto pode estar ausente ou ser diferente. Continuidade em (a,b) exige que (a,b) pertença ao domínio, que o limite exista e que coincida com f(a,b); em bordas do domínio a aproximação é feita dentro dele.`,
      [
        ["domínio de função de duas variáveis", "Conjunto de pares (x,y) nos quais a expressão é definida segundo restrições algébricas e analíticas."],
        ["curva de nível", "Conjunto de pontos do domínio em que f assume um mesmo valor constante."],
        ["limite por caminhos", "Teste de que caminhos diferentes podem dar valores diferentes, implicando limite inexistente."],
        ["continuidade multivariável", "Condição de que o limite em (a,b) existe e coincide com f(a,b), com o ponto no domínio."],
        ["ponto de acumulação", "Ponto cuja vizinhança contém pontos do domínio diferentes dele, necessário para falar em limite."]
      ],
      {
        derivation: `Considere f(x,y)=(x²−y²)/(x²+y²) em (0,0), fora da origem. Pelo caminho y=0: f(x,0)=x²/x²=1, logo o limite ao longo desse caminho é 1. Pelo caminho x=0: f(0,y)=−y²/y²=−1. Como os dois caminhos dão valores diferentes, o limite em (0,0) não existe, ainda que cada caminho individual tenha limite.`,
        ex: [
          ["Critério de domínio", "f(x,y)=√(x−y)/(x+y): exige x−y≥0 e x+y≠0; a intersecção das condições define o domínio."],
          ["Valor no ponto versus limite", "Defina g(x,y)=(x²+y²) para (x,y)≠(0,0) e g(0,0)=5: o limite na origem é 0, mas o valor no ponto é 5."],
          ["Curva de nível", "Para f(x,y)=x²+y², a curva f=4 é o círculo de raio 2."]
        ],
        er: ["Concluir que o limite existe depois de verificar apenas dois caminhos.", "Ignorar restrições de domínio de logaritmos e radicais.", "Confundir o valor atribuído no ponto com o limite."],
        tags: ["cálculo III", "limites", "domínio"],
        estimatedEffort: 35
      }),
    L("Derivadas parciais, gradiente e multiplicadores de Lagrange",
      "Calcular derivadas parciais e direcionais, construir o plano tangente e resolver problemas de extremo com restrição.",
      "Derivadas, vetores e domínio de funções de várias variáveis.",
      "O gradiente reúne as taxas parciais e aponta a direção de maior crescimento local.",
      `A derivada parcial ∂f/∂x é calculada mantendo as demais variáveis fixas. Se f é diferenciável em (a,b), a variação linear é f(a+h,b+k)≈f(a,b)+fₓ(a,b)h+fᵧ(a,b)k; daí vem o plano tangente z=f(a,b)+fₓ(a,b)(x−a)+fᵧ(a,b)(y−b) e a derivada direcional D_u f=∇f·u para u unitário. O gradiente ∇f=(fₓ,fᵧ) tem direção de máximo crescimento e magnitude igual à maior taxa. Pontos críticos internos satisfazem ∇f=0; a segunda derivada é classificada pelo determinante do Hessiano D=fₓₓ fᵧᵧ−(fₓᵧ)², com D>0 e fₓₓ>0 indicando mínimo local. Com restrição g(x,y)=c e ∇g≠0, o método dos multiplicadores impõe ∇f=λ∇g: no extremo, as curvas de nível de f e g são tangentes. Critério de domínio: pontos de fronteira devem ser examinados separadamente e o método de Lagrange exige que a restrição seja regular no ponto.`,
      [
        ["derivada parcial", "Derivada em relação a uma variável mantendo as outras constantes."],
        ["gradiente", "Vetor das derivadas parciais, que aponta a direção de maior crescimento local."],
        ["derivada direcional", "Taxa de variação de f ao longo de uma direção unitária, igual a ∇f·u quando f é diferenciável."],
        ["plano tangente", "Aproximação linear de f em um ponto, obtida com as derivadas parciais."],
        ["multiplicador de Lagrange", "Escalar λ usado na condição ∇f=λ∇g para extremos com restrição."]
      ],
      {
        derivation: `Da diferenciabilidade em (a,b): Δf ≈ fₓΔx+fᵧΔy = ∇f·(Δx,Δy). Escolhendo (Δx,Δy)=h u com |u|=1, a taxa Δf/h tende a ∇f·u, que é a derivada direcional. O valor máximo de ∇f·u ocorre quando u tem a mesma direção de ∇f, pois ∇f·u=|∇f||u|cosθ e |u|=1; o máximo é |∇f|. Para a restrição g=c, um extremo de f ao longo da curva exige que a derivada direcional de f na direção tangente à curva seja zero; como ∇g é normal à curva, isso equivale a ∇f paralelo a ∇g.`,
        ex: [
          ["Plano tangente", "Para f=x²+y² em (1,2): fₓ=2, fᵧ=4, f=5; plano z=5+2(x−1)+4(y−2)."],
          ["Direcional", "Para f=x²+y² em (1,2) e u=(1/√2,1/√2): D_u f=2/√2+4/√2=6/√2≈4,24."],
          ["Lagrange", "Maximizar xy com x+y=10: ∇f=(y,x), ∇g=(1,1); y=λ, x=λ, logo x=y=5."]
        ],
        er: ["Calcular derivadas parciais variando mais de uma variável por vez.", "Usar um vetor não unitário na fórmula da derivada direcional.", "Aplicar Lagrange sem verificar ∇g≠0 e sem examinar a fronteira."],
        lab: `Laboratório M14 (atividade 1): visualize o gradiente de f(x,y)=x²+2y² como vetores em uma malha e verifique, por passos numéricos ao longo de várias direções, que a direção do gradiente é a de maior crescimento. Os passos numéricos são aproximações; compare com a expressão analítica ∇f=(2x,4y).`,
        tags: ["cálculo III", "derivadas", "gradiente"],
        estimatedEffort: 45
      }),
    L("Integração múltipla, jacobianos e mudança de variáveis",
      "Calcular integrais duplas e triplas e trocar variáveis usando polares, cilíndricas e esféricas.",
      "Integral definida e geometria no espaço.",
      "Integrar em várias variáveis é somar sobre uma região; o jacobiano corrige o tamanho das células quando o sistema de coordenadas muda.",
      `A integral dupla ∬_R f dA é o limite de somas sobre uma partição da região; wartości finitas da malha são aproximações. Em regiões do tipo x simples ou y simples, o teorema de Fubini permite integrar iteradamente quando f é contínua na região. Na mudança para polares, x=r cosθ, y=r senθ e dA=r dr dθ. Em cilíndricas, dV=r dr dθ dz; em esféricas com φ medido do eixo z, dV=ρ² senφ dρ dθ dφ. O fator r ou ρ²senφ é o valor absoluto do determinante jacobiano da transformação, que mede a dilatação local de área ou volume. Aplicações típicas incluem massa ∫∫∫ρ dV, volume ∫∫∫1 dV e probabilidade sobre densidades conjuntas. Critérios de domínio: a transformação deve ser bijetiva exceto em conjuntos de medida zero, o jacobiano não pode ser nulo no interior e os limites da região devem ser descritos no novo sistema.`,
      [
        ["integral dupla", "Limite de somas de f sobre uma partição de uma região plana."],
        ["jacobiano", "Determinante da matriz das derivadas parciais da mudança de variáveis; mede a dilatação local."],
        ["coordenadas polares", "Sistema (r,θ) no plano em que o elemento de área é r dr dθ."],
        ["integral tripla", "Integral sobre um volume, frequentemente usada para massa e volume."],
        ["teorema de Fubini", "Resultado que permite trocar a ordem de integração sob hipóteses de continuidade ou integrabilidade."]
      ],
      {
        derivation: `Em polares, uma célula entre r e r+Δr e entre θ e θ+Δθ tem área aproximadamente igual à de um setor: ΔA≈(r+Δr)²Δθ/2−r²Δθ/2≈r Δr Δθ quando Δr é pequeno. Logo dA=r dr dθ, que é o determinante da matriz [∂(x,y)/∂(r,θ)] = [cosθ, −r senθ; senθ, r cosθ], igual a r. Em esféricas, os fatores de escala são 1, ρ e ρ senφ, cujo produto dá ρ² senφ.`,
        ex: [
          ["Polares", "Área do círculo de raio a: ∫₀^{2π}∫₀ᵃ r dr dθ = 2π·a²/2 = πa²."],
          ["Gaussiana", "∫₋∞^∞ e^{−x²} dx = √π, obtida elevando ao quadrado e passando a polares."],
          ["Massa", "Densidade ρ=1 sobre o disco de raio a dá massa πa²."]
        ],
        er: ["Esquecer o fator r ou ρ²senφ na mudança de variáveis.", "Não converter os limites da região para o novo sistema.", "Trocar a ordem de integração sem descrever a nova região."],
        lab: `Laboratório M14 (atividade 3): aproxime ∬_R (x²+y²) dA sobre o disco unitário usando malhas retangulares com n=10, 50 e 200 células e compare com o valor exato π/2. Cada soma é uma aproximação numérica; reporte o erro em função de n.`,
        tags: ["cálculo III", "integrais múltiplas", "jacobiano"],
        estimatedEffort: 45
      }),
    L("Cálculo vetorial e teoremas integrais com suas hipóteses",
      "Calcular integrais de linha e de superfície e aplicar Green, Stokes e divergência verificando as hipóteses.",
      "Derivadas parciais, integração múltipla e vetores.",
      "Os grandes teoremas do cálculo vetorial transformam um integral na fronteira em um integral no interior, mas só sob condições precisas.",
      `Campos vetoriais atribuem um vetor a cada ponto. A integral de linha ∫_C F·dr mede acumulação ao longo de uma curva orientada; a integral de superfície ∬_S F·n dS mede fluxo através de uma superfície orientada. O divergente ∇·F mede expansão local e o rotacional ∇×F mede rotação local. O teorema de Green afirma ∮_C P dx+Q dy = ∬_R (∂Q/∂x−∂P/∂y)dA para curva simples fechada, orientada positivamente, com P e Q continuamente diferenciáveis em região que contém R. Stokes generaliza: ∮_C F·dr = ∬_S (∇×F)·n dS, com S orientada e fronteira C. O teorema da divergência afirma ∬_S F·n dS = ∭_V ∇·F dV para superfície fechada com normal exterior. Em domínio simplesmente conexo, F conservativo equivale a F=∇φ e a integrais de linha independentes do caminho. Critérios de domínio e hipóteses: orientação, suavidade, fechamento da curva ou superfície e ausência de singularidades no interior são parte do enunciado, não detalhes opcionais.`,
      [
        ["integral de linha", "Integral de F·dr ao longo de uma curva orientada."],
        ["fluxo", "Integral de superfície do campo através de uma normal orientada, que mede passagem através da superfície."],
        ["divergente", "Operador ∇·F que mede a taxa de expansão local de um campo."],
        ["rotacional", "Operador ∇×F que mede a tendência local de rotação do campo."],
        ["teorema de Stokes", "Relação entre a circulação na fronteira e o fluxo do rotacional pela superfície."]
      ],
      {
        derivation: `Esboço do teorema de Green: para um retângulo [x₁,x₂]×[y₁,y₂], ∬_R (−∂P/∂y) dA = ∫_{x₁}^{x₂}[P(x,y₁)−P(x,y₂)]dx, pelo teorema fundamental aplicado em y. Da mesma forma, ∬_R ∂Q/∂x dA = ∫_{y₁}^{y₂}[Q(x₂,y)−Q(x₁,y)]dy. Somando, obtêm-se as contribuições das quatro arestas com orientação positiva. Regiões gerais são tratadas por decomposição em retângulos, desde que as hipóteses de suavidade e orientação valham.`,
        ex: [
          ["Green", "∮_C (x dy − y dx) sobre o círculo unitário = ∬_R 2 dA = 2π."],
          ["Divergência", "Para F=(x,y,z) na esfera unitária, fluxo = ∭_V 3 dV = 3·(4π/3)=4π."],
          ["Conservativo", "F=(2x,2y) é ∇(x²+y²); a integral de linha depende apenas dos extremos em domínio simplesmente conexo."]
        ],
        er: ["Aplicar Stokes ou divergência sem verificar orientação e suavidade.", "Ignorar singularidades internas ao campo.", "Trocar fluxo por circulação ou divergente por rotacional."],
        lab: `Laboratório M14 (atividades 4 e 5): simule um campo vetorial, por exemplo F=(−y,x), em uma malha e compare o fluxo numérico calculado na fronteira de uma região com a interpretação geométrica dada pelo teorema correspondente. Identifique a visualização como simulação e os cálculos de malha como aproximações.`,
        masteryCriteria: [
          "2 pts — calcula integral de linha e fluxo com orientação correta.",
          "2 pts — calcula divergente e rotacional sem confundir as operações.",
          "2 pts — enuncia Green, Stokes e divergência com suas hipóteses.",
          "2 pts — aplica um teorema a um problema concreto com domínio verificado.",
          "2 pts — interpreta a simulação e as aproximações numéricas com cautela."
        ],
        ref: "James Stewart, Cálculo — cálculo vetorial e teoremas integrais (cengage.com).",
        tags: ["cálculo III", "campos", "teoremas integrais"],
        estimatedEffort: 50
      })
  ]
});

CURRICULUM.math.modules.push({
  name: "Cálculo IV / tópicos avançados (M15)",
  lessons: [
    L("EDOs avançadas: sistemas, estabilidade e transformada de Laplace",
      "Resolver sistemas lineares de EDOs, analisar estabilidade e usar a transformada de Laplace em problemas de valor inicial.",
      "EDOs de segunda ordem, autovalores e integrais impróprias.",
      "Sistemas acoplados viram um problema de autovalores; a transformada de Laplace troca derivação por álgebra.",
      `Para x'=Ax com A constante, soluções da forma x(t)=e^{λt}v existem quando Av=λv; a matriz fundamental combina autovalores e autovetores, e casos com autovalores repetidos podem exigir vetores generalizados. A estabilidade assintótica do sistema linear exige que todas as partes reais dos autovalores sejam negativas. EDOs lineares de ordem superior com coeficientes constantes são tratadas pelo polinômio característico. A transformada de Laplace é F(s)=∫₀^∞ e^{−st}f(t)dt, definida apenas quando a integral converge em uma região do plano complexo; ela converte derivadas em multiplicação por s, com o termo inicial, e é útil para entradas descontínuas. Solução por séries procura y=Σ aₙ(x−x₀)ⁿ em torno de um ponto ordinário, igualando coeficientes para obter uma recorrência. Problemas de contorno impõem condições em dois pontos e podem não ter solução ou ter infinitas, ao contrário de problemas de valor inicial bem postos. "Cálculo IV" não denota uma ementa universal: estes temas são os que costumam aparecer depois de Cálculo I–III.`,
      [
        ["sistema linear de EDOs", "Conjunto de equações diferenciais acopladas escrito como x'=Ax."],
        ["estabilidade assintótica", "Propriedade pela qual as soluções tendem ao equilíbrio quando t cresce."],
        ["transformada de Laplace", "Integral ∫₀^∞ e^{−st}f(t)dt, definida na região de convergência, que transforma derivação em álgebra."],
        ["ponto ordinário", "Ponto em que os coeficientes de uma EDO linear são analíticos, permitindo solução por séries."],
        ["problema de contorno", "EDO com condições impostas em mais de um ponto, distinto de um problema de valor inicial."]
      ],
      {
        derivation: `Se Av=λv e x(t)=e^{λt}v, então x'=λe^{λt}v e Ax=e^{λt}Av=λe^{λt}v, logo a equação x'=Ax é satisfeita. Para a transformada, integrando por partes: L{f'}=∫₀^∞ e^{−st}f'(t)dt = [e^{−st}f(t)]₀^∞ + s∫₀^∞ e^{−st}f(t)dt = sF(s)−f(0), supondo que e^{−st}f(t) tenda a zero no infinito. Essa hipótese de decaimento é essencial.`,
        ex: [
          ["Sistema", "x' = [[0,1],[-2,-3]]x tem autovalores −1 e −2, todos com parte real negativa: origem assintoticamente estável."],
          ["Laplace", "Para y'+2y=0, y(0)=3: sY−3+2Y=0, logo Y=3/(s+2) e y(t)=3e^{−2t}."],
          ["Séries", "Para y''+y=0 em torno de 0, a recorrência (n+2)(n+1)a_{n+2}=−aₙ gera as séries de seno e cosseno."]
        ],
        er: ["Aplicar a transformada de Laplace sem verificar a região de convergência.", "Concluir estabilidade a partir de um único autovalor.", "Tratar um problema de contorno como se a condição inicial bastasse."],
        ref: "Consulte um texto de equações diferenciais da biblioteca da plataforma para as hipóteses completas.",
        tags: ["EDO", "sistemas", "Laplace"],
        estimatedEffort: 50
      }),
    L("EDPs fundamentais: calor, onda e Laplace",
      "Separar variáveis em equações diferenciais parciais clássicas e impor condições iniciais e de contorno.",
      "EDOs de segunda ordem, séries de Fourier e derivadas parciais.",
      "Separar variáveis transforma uma EDP em um conjunto de EDOs, mas só faz sentido se as condições de contorno selecionarem os modos certos.",
      `A equação do calor u_t=αu_xx modela difusão; a equação da onda u_tt=c²u_xx modela propagação oscilatória; a equação de Laplace ∇²u=0 descreve estados estacionários. Na separação u(x,t)=X(x)T(t), razões como T'/(αT)=X''/X devem ser constantes iguais a −λ, pois dependem de variáveis independentes. Condições de contorno de Dirichlet fixam o valor da função na fronteira; condições de Neumann fixam a derivada normal. Para Dirichlet homogêneo em [0,L], os autovalores são λₙ=(nπ/L)² e os modos espaciais sen(nπx/L); a solução é uma soma de modos com coeficientes determinados pela condição inicial via série de Fourier. A existência de solução clássica depende da compatibilidade entre condições iniciais e de contorno e da suavidade dos dados.`,
      [
        ["equação do calor", "EDP u_t=αu_xx que modela difusão de temperatura ou concentração."],
        ["equação da onda", "EDP u_tt=c²u_xx que modela propagação de perturbações oscilatórias."],
        ["equação de Laplace", "EDP ∇²u=0 para problemas estacionários."],
        ["condição de Dirichlet", "Condição de contorno que prescreve o valor da incógnita na fronteira."],
        ["autovalor", "Valor λ selecionado pelas condições de contorno ao separar variáveis."]
      ],
      {
        derivation: `Para u_t=αu_xx com u(0,t)=u(L,t)=0, tome u=XT. Então XT'=αX''T e T'/(αT)=X''/X=−λ. A equação espacial X''+λX=0 com X(0)=X(L)=0 só tem solução não trivial se λ=(nπ/L)², n=1,2,..., com Xₙ=sen(nπx/L). A equação temporal T'=−αλT dá Tₙ=e^{−αλₙt}. A soma u=Σ bₙ sen(nπx/L)e^{−αλₙt} satisfaz a EDP e as condições de contorno; os bₙ vêm da condição inicial u(x,0)=f(x).`,
        ex: [
          ["Calor", "Com L=π, α=1 e u(x,0)=sen x, a solução é u=sen(x)e^{−t}: um único modo."],
          ["Onda", "Separando u_tt=c²u_xx com extremos fixos, a parte temporal satisfaz T''+c²λT=0, com senos e cossenos no tempo."],
          ["Laplace", "Em um retângulo com Dirichlet nulo em três lados e dado no quarto, os modos são produtos de senos hiperbólicos e senos."]
        ],
        er: ["Separar variáveis sem verificar se as condições de contorno são compatíveis.", "Ignorar o caso λ=0 e os modos que as condições eliminam.", "Achar que a série obtida sempre converge uniformemente sem examinar os dados."],
        tags: ["EDP", "separação de variáveis", "contorno"],
        estimatedEffort: 55
      }),
    L("Análise vetorial avançada: formas diferenciais e hipóteses dos teoremas",
      "Interpretar os operadores vetoriais por meio de formas diferenciais e explicitar as hipóteses dos teoremas integrais.",
      "Cálculo vetorial e integração múltipla.",
      "Green, Stokes e divergência são casos de uma mesma ideia: integral na fronteira equivale a integral de uma derivada no interior.",
      `Uma 0-forma é uma função; uma 1-forma no plano é expressa como ω=P dx+Q dy; a derivada exterior dá dω=(∂Q/∂x−∂P/∂y)dx∧dy, que reproduz o integrando de Green. Em ℝ³, a correspondência entre campos e formas liga gradiente, rotacional e divergente, e o teorema geral ∫_∂M ω=∫_M dω reduz a Green, Stokes e divergência conforme a dimensão e o tipo de forma. Cada enunciado exige hipóteses: orientação consistente da fronteira, suavidade suficiente do campo, superfície ou curva fechada e ausência de singularidades no interior. Aplicações em fluidos usam circulação e fluxo para descrever vórtices e aporte de massa; em eletromagnetismo, leis integrais como a de Gauss e a de Faraday relacionam fluxos e circulações a cargas e variações de fluxo.`,
      [
        ["forma diferencial", "Objeto algébrico que pode ser integrado sobre curvas, superfícies ou volumes."],
        ["derivada exterior", "Operador d que generaliza gradiente, rotacional e divergente."],
        ["orientação", "Escolha consistente de normal e sentido da fronteira em um teorema integral."],
        ["circulação", "Integral de linha de um campo ao longo de uma curva fechada."],
        ["hipótese do teorema", "Condição necessária para que a conclusão de um teorema seja válida."]
      ],
      {
        derivation: `Para ω=P dx+Q dy, aplicamos d: d(P dx)=∂P/∂y dy∧dx=−∂P/∂y dx∧dy e d(Q dy)=∂Q/∂x dx∧dy. Somando, dω=(∂Q/∂x−∂P/∂y)dx∧dy. Integrando dω sobre a região R e aplicando o teorema geral, obtemos ∮_∂R P dx+Q dy=∬_R(∂Q/∂x−∂P/∂y)dA, o teorema de Green.`,
        ex: [
          ["Fluidos", "Circulação ∮_C F·dr ao redor de um vórtice mede a rotação agregada do campo ao longo da curva."],
          ["Gauss", "A lei integral de Gauss relaciona ∮_S E·dA à carga contida; a forma diferencial exige densidade de carga suave."],
          ["Exemplo de hipótese", "Se o campo tem singularidade na origem, um contorno que envolve a origem pode violar a conclusão do teorema."]
        ],
        er: ["Aplicar o teorema geral sem escolher orientação compatível.", "Ignorar singularidades ao trocar integral de fronteira por integral de interior.", "Confundir os três operadores clássicos com a derivada exterior em dimensão errada."],
        tags: ["análise vetorial", "formas", "hipóteses"],
        estimatedEffort: 40
      }),
    L("Análise de Fourier: séries, transformada e convolução",
      "Calcular coeficientes de Fourier, interpretar frequências e usar a convolução em sistemas lineares.",
      "Integração de funções trigonométricas e noção de limite de somas parciais.",
      "Um sinal pode ser descrito por amplitudes de frequências; a pergunta central é em que sentido a soma dessas frequências reconstrói o sinal.",
      `Em [−L,L], a série de Fourier de f é a₀/2+Σ[aₙ cos(nπx/L)+bₙ sen(nπx/L)], com coeficientes obtidos pela ortogonalidade de senos e cossenos. Sob as condições de Dirichlet — f piecewise suave — a série converge para f nos pontos de continuidade e para a média dos limites laterais em saltos; convergência pontual não garante convergência uniforme. A transformada de Fourier, na convenção F(ω)=∫ f(t)e^{−iωt}dt, passa o sinal para o domínio da frequência; a inversa correspondente usa fator 1/(2π). A convolução (f*g)(t)=∫ f(τ)g(t−τ)dτ satisfaz F(f*g)=F(f)F(g) sob hipóteses de integrabilidade; em sistemas lineares invariantes pelo tempo, a saída é a convolução da entrada com a resposta ao impulso. Parseval liga a energia no tempo e na frequência.`,
      [
        ["série de Fourier", "Representação de uma função por soma de senos e cossenos com coeficientes calculados por integrais."],
        ["transformada de Fourier", "Integral F(ω)=∫ f(t)e^{−iωt}dt que representa o sinal no domínio da frequência."],
        ["frequência", "Parâmetro ω que indica a taxa de oscilação de um componente do sinal."],
        ["convolução", "Operação (f*g)(t)=∫ f(τ)g(t−τ)dτ cuja transformada é o produto das transformadas."],
        ["condições de Dirichlet", "Hipóteses de suavidade por partes que garantem a convergência pontual da série de Fourier."]
      ],
      {
        derivation: `Para obter aₙ, multiplique a série por cos(mπx/L) e integre em [−L,L]. A ortogonalidade elimina todos os termos, exceto m=n: ∫_{−L}^{L} cos²(nπx/L)dx=L para n≥1, logo aₙ=(1/L)∫_{−L}^{L}f(x)cos(nπx/L)dx. O mesmo raciocínio com seno dá bₙ e, integrando a série diretamente, a₀=(1/L)∫_{−L}^{L}f(x)dx.`,
        ex: [
          ["Onda quadrada", "Em [−π,π], a série da função sinal contém apenas senos ímpares: (4/π)Σ sen((2k+1)x)/(2k+1)."],
          ["Transformada", "Para f(t)=e^{−a|t|} com a>0, F(ω)=2a/(a²+ω²) na convenção adotada."],
          ["Convolução", "Filtrar um sinal com resposta ao impulso h equivale a calcular (f*h)(t); no domínio da frequência isso é F(ω)H(ω)."]
        ],
        er: ["Trocar a convenção da transformada e omitir o fator 1/(2π) na inversa.", "Achar que convergência da série implica convergência uniforme sem verificar hipóteses.", "Aplicar o teorema da convolução sem integrabilidade adequada."],
        tags: ["Fourier", "sinais", "frequência"],
        estimatedEffort: 50
      }),
    L("Análise complexa introdutória: derivabilidade, Cauchy e resíduos",
      "Testar a derivabilidade complexa, aplicar teoremas de contorno e calcular integrais por resíduos.",
      "Números complexos, integrais de linha e séries.",
      "Exigir que o limite da razão incremental exista em qualquer direção do plano torna a derivabilidade complexa muito mais rígida.",
      `Escreva z=x+iy e f=u+iv. Se f é complexamente diferenciável em um ponto, as equações de Cauchy–Riemann uₓ=vᵧ e uᵧ=−vₓ são necessárias; são suficientes quando as derivadas parciais de u e v são contínuas em uma vizinhança. Uma função holomorfa é diferenciável em cada ponto de um domínio aberto. O teorema integral de Cauchy afirma que ∮_C f dz=0 se f é holomorfa em domínio simplesmente conexo que contém C; a fórmula integral de Cauchy dá f(a)=(1/2πi)∮_C f(z)/(z−a)dz para C simples fechada, orientada positivamente, com f holomorfa dentro e sobre C. Séries de Laurent representam funções em anéis e permitem classificar singularidades removíveis, polos e essenciais pelo termo (z−a)⁻¹. O teorema dos resíduos afirma ∮_C f dz=2πi·Σ Res(f,aₖ) para singularidades isoladas no interior. Critérios de domínio: o contorno não pode passar por singularidades e o anel de convergência da Laurent deve ser explicitado.`,
      [
        ["função holomorfa", "Função complexa diferenciável em todos os pontos de um domínio aberto."],
        ["equações de Cauchy–Riemann", "Condições necessárias uₓ=vᵧ e uᵧ=−vₓ para derivabilidade complexa."],
        ["teorema integral de Cauchy", "Resultado que anula a integral em contorno fechado de função holomorfa em domínio simplesmente conexo."],
        ["série de Laurent", "Expansão em potências positivas e negativas válida em um anel em torno do ponto."],
        ["resíduo", "Coeficiente de (z−a)⁻¹ na série de Laurent; determina a integral pelo teorema dos resíduos."]
      ],
      {
        derivation: `Compare o limite de [f(z₀+h)−f(z₀)]/h tomando h real e h=ik real: no primeiro caso o limite é uₓ+ivₓ; no segundo, (u(z₀+ik)−u(z₀)+i(v(z₀+ik)−v(z₀)))/(ik) = vᵧ−iuᵧ. Igualando partes reais e imaginárias, uₓ=vᵧ e vₓ=−uᵧ, as equações de Cauchy–Riemann.`,
        ex: [
          ["Teste", "Para f(z)=z², u=x²−y² e v=2xy: uₓ=2x=vᵧ e uᵧ=−2y=−vₓ; é holomorfa em todo ℂ."],
          ["Não derivável", "Para f(z)=conj(z), u=x e v=−y: uₓ=1, vᵧ=−1; falha Cauchy–Riemann em todo ponto."],
          ["Resíduo", "Para f(z)=1/(z²+1), polos em ±i; um contorno que envolve apenas i dá 2πi·Res(i)=π."]
        ],
        er: ["Usar Cauchy–Riemann como critério suficiente sem continuidade das parciais.", "Integrar em contorno que passa por uma singularidade.", "Confundir o domínio de validade de uma série de Taylor e de uma série de Laurent."],
        tags: ["complexa", "Cauchy", "resíduos"],
        estimatedEffort: 55
      }),
    L("Métodos numéricos avançados com análise de erro",
      "Implementar um método numérico para EDO ou EDP e analisar erro, estabilidade e condicionamento.",
      "EDOs, EDPs, ponto flutuante e noção de convergência.",
      "Um esquema numérico pode convergir para a equação errada se a estabilidade falhar; erro e estabilidade devem ser medidos, não supostos.",
      `Em aritmética de ponto flutuante, cada operação introduz erro de arredondamento; erro absoluto e relativo, cancelamento e propagação devem ser distinguidos do erro de truncamento do método. Condicionamento é propriedade do problema — para sistemas lineares, κ(A)=‖A‖‖A⁻¹‖ — enquanto estabilidade é propriedade do algoritmo. Diferenças finitas aproximam derivadas por quocientes e EDPs por malhas; no esquema explícito FTCS para o calor em uma dimensão, r=αΔt/Δx² deve satisfazer r≤1/2 para estabilidade. Elementos finitos introduzem uma formulação fraca e particionam o domínio, com convergência ligada ao refinamento da malha. Critérios de domínio: passos e malhas devem respeitar as hipóteses do esquema, e toda saída numérica deve ser rotulada como aproximação com ordem de erro declarada.`,
      [
        ["erro de truncamento", "Erro cometido ao substituir um limite ou operação exata por uma aproximação finita."],
        ["estabilidade", "Propriedade do algoritmo pela qual erros não crescem descontroladamente durante a iteração."],
        ["condicionamento", "Sensibilidade intrínseca do problema a perturbações nos dados, medida por número de condição."],
        ["diferenças finitas", "Aproximação de derivadas por quocientes em pontos da malha."],
        ["elementos finitos", "Método que formula o problema de forma fraca e resolve em malhas, com erro controlado pelo refinamento."]
      ],
      {
        derivation: `Expandindo em Taylor: f(x+h)=f(x)+h f'(x)+(h²/2)f''(ξ). Portanto f'(x)=[f(x+h)−f(x)]/h − (h/2)f''(ξ): a diferença forward tem erro de truncamento de primeira ordem em h. Para o esquema FTCS, a análise de Fourier da malha mostra que o fator de amplificação satisfaz |G|≤1 se e somente se r=αΔt/Δx²≤1/2 em uma dimensão.`,
        ex: [
          ["Derivada aproximada", "Para f(x)=sen x em x=1 e h=0,01, o quociente forward difere de cos(1) em aproximadamente 0,0042: valor aproximado, não exato."],
          ["Estabilidade", "Com α=1 e Δx=0,1, o limite FTCS é Δt≤0,005; passos maiores podem produzir oscilações crescentes."],
          ["Condicionamento", "Matriz de Hilbert de ordem 10 tem número de condição muito grande: pequenos erros de entrada geram grandes erros na solução."]
        ],
        er: ["Confundir estabilidade do algoritmo com condicionamento do problema.", "Escolher passo de tempo sem verificar a condição de estabilidade.", "Reportar valores numéricos como exatos e omitir a ordem do erro."],
        lab: `Laboratório M15: implemente um esquema de diferenças finitas para a equação do calor em [0,1] com condições de contorno fixadas e compare a solução numérica com uma solução analítica conhecida para um modo senoidal. Apresente tabela de Δx, Δt, erro máximo e ordem observada; cada valor é uma aproximação e a condição r≤1/2 deve ser verificada antes da execução.`,
        masteryCriteria: [
          "2 pts — implementa corretamente um método numérico e verifica suas hipóteses.",
          "2 pts — mede erro absoluto e relativo contra referência exata ou malha mais fina.",
          "2 pts — analisa estabilidade com o parâmetro adequado, como r≤1/2 no FTCS.",
          "2 pts — distingue condicionamento do problema de estabilidade do algoritmo.",
          "2 pts — rotula resultados como aproximações e discute a ordem de convergência observada."
        ],
        tags: ["numérico", "erro", "EDP"],
        estimatedEffort: 55
      })
  ]
});

CURRICULUM.math.modules.push({
  name: "Álgebra linear completa — de vetores a SVD (M16)",
  lessons: [
    L("Vetores, espaços vetoriais e subespaços",
      "Verificar axiomas de espaço vetorial e reconhecer subespaços e combinações lineares.",
      "Álgebra de vetores no plano e no espaço.",
      "Um espaço vetorial é um conjunto onde somar e escalar continuam dentro do conjunto e obedecem a regras previsíveis.",
      `Um espaço vetorial sobre ℝ é um conjunto V com adição e multiplicação por escalar que satisfaz os oito axiomas: associatividade e comutatividade da soma, elemento neutro e opostos, associatividade do produto por escalar, distribuição em duas formas e 1·v=v. Exemplos incluem ℝⁿ, matrizes m×n, polinômios de grau ≤n e funções contínuas em um intervalo. Um subespaço W⊆V deve conter o vetor zero e ser fechado sob soma e multiplicação por escalar; basta verificar essas três condições. O conjunto gerado por vetores v₁,...,vₖ, chamado span, é o conjunto de todas as combinações lineares c₁v₁+...+cₖvₖ. Critério de domínio estrutural: uma reta ou plano que não passa pela origem é conjunto afim, não subespaço, pois não contém o zero.`,
      [
        ["espaço vetorial", "Conjunto com adição e multiplicação por escalar que satisfaz os oito axiomas."],
        ["subespaço", "Subconjunto que contém o zero e é fechado sob soma e produto por escalar."],
        ["combinação linear", "Soma c₁v₁+...+cₖvₖ de vetores multiplicados por escalares."],
        ["span (gerado)", "Conjunto de todas as combinações lineares de um conjunto de vetores."],
        ["vetor zero", "Elemento neutro da adição, obrigatório em todo subespaço."]
      ],
      {
        ex: [
          ["Subespaço", "Em ℝ³, o plano x+y+z=0 passa pela origem e é fechado sob soma e escalar: é subespaço."],
          ["Não subespaço", "O plano x+y+z=1 não contém o zero, logo não é subespaço."],
          ["Span", "span{(1,0),(0,1)} = ℝ², pois qualquer (a,b)=a(1,0)+b(0,1)."]
        ],
        er: ["Verificar apenas o fechamento sob soma e esquecer o vetor zero.", "Achar que uma reta arbitrária do plano é subespaço de ℝ².", "Confundir combinação linear com soma de vetores sem escalares."],
        tags: ["álgebra linear", "espaços", "subespaços"],
        estimatedEffort: 30
      }),
    L("Independência linear, base e dimensão",
      "Testar independência linear, encontrar bases e calcular dimensão e posto.",
      "Subespaços e combinações lineares.",
      "Uma base é um conjunto econômico de vetores que gera tudo sem redundância.",
      `Vetores v₁,...,vₖ são linearmente independentes quando a única solução de c₁v₁+...+cₖvₖ=0 é c₁=...=cₖ=0; se existe solução não trivial, são dependentes. Em ℝⁿ, n vetores são independentes se e somente se o determinante da matriz que os tem por colunas é não nulo, equivalente a posto n. Uma base gera o espaço e é independente; todos os conjuntos-base de um mesmo espaço têm o mesmo número de elementos, definido como a dimensão. O posto de uma matriz é a dimensão do espaço das colunas e coincide com o número de pivôs na forma escalonada. A mudança de base é feita por uma matriz invertível, pois coordenadas diferentes devem representar o mesmo vetor de forma única.`,
      [
        ["independência linear", "Condição pela qual apenas a combinação com todos os coeficientes nulos resulta no vetor zero."],
        ["base", "Conjunto de vetores linearmente independentes que gera o espaço vetorial."],
        ["dimensão", "Número de vetores em qualquer base do espaço."],
        ["posto", "Dimensão do espaço gerado pelas colunas de uma matriz."],
        ["dependência linear", "Existência de coeficientes não todos nulos que produzem o vetor zero."]
      ],
      {
        derivation: `Em ℝ³, forme A=[v₁ v₂ v₃]. A equação c₁v₁+c₂v₂+c₃v₃=0 é Ac=0. Como A é quadrada, Ac=0 tem apenas a solução c=0 se e somente se det(A)≠0, o que equivale a A invertível e posto 3. Se det(A)=0 existe c≠0 no núcleo, produzindo dependência linear.`,
        ex: [
          ["Teste", "v₁=(1,0,0), v₂=(0,1,0), v₃=(1,1,0) são dependentes, pois v₃=v₁+v₂."],
          ["Base padrão", "{(1,0,0),(0,1,0),(0,0,1)} é base de ℝ³, que tem dimensão 3."],
          ["Posto", "A matriz [[1,2],[2,4]] tem posto 1, pois a segunda linha é o dobro da primeira."]
        ],
        er: ["Concluir independência pela inspeção de poucas combinações.", "Usar determinante para conjuntos com número diferente de vetores da dimensão.", "Confundir posto de linhas e de colunas sem justificativa."],
        tags: ["álgebra linear", "base", "posto"],
        estimatedEffort: 35
      }),
    L("Matrizes, sistemas lineares e eliminação de Gauss",
      "Operar com matrizes, resolver sistemas por eliminação e decidir consistência pelo posto.",
      "Independência linear e manipulação de sistemas.",
      "A eliminação de Gauss organiza a eliminação de variáveis em um procedimento mecânico sobre as linhas da matriz.",
      `Uma matriz m×n tem m linhas e n colunas; soma exige mesmas dimensões e multiplicação AB exige que o número de colunas de A seja igual ao de linhas de B. A multiplicação não é comutativa, mas é associativa e distributiva. Um sistema Ax=b é representado pela matriz aumentada [A|b]; as operações elementares por linha — trocar linhas, multiplicar por escalar não nulo e somar múltiplo de uma linha a outra — preservam o conjunto solução porque são reversíveis. Na forma escalonada, pivôs identificam variáveis básicas; variáveis sem pivô são livres e geram infinitas soluções quando o sistema é consistente. Critério de consistência: posto(A)=posto([A|b]); se forem diferentes, o sistema não tem solução. Para A quadrada invertível, [A|I]→[I|A⁻¹] por Gauss–Jordan.`,
      [
        ["matriz aumentada", "Matriz [A|b] que representa um sistema linear Ax=b."],
        ["pivô", "Primeiro elemento não nulo de uma linha na forma escalonada, usado para eliminar entradas abaixo ou acima."],
        ["operação elementar por linha", "Troca, escala não nula ou soma de múltiplo de linha, que preserva as soluções do sistema."],
        ["variável livre", "Variável sem pivô, que pode assumir valores arbitrários quando o sistema é consistente."],
        ["posto da matriz aumentada", "Posto de [A|b], comparado ao posto de A para decidir consistência."]
      ],
      {
        derivation: `Cada operação elementar por linha corresponde a multiplicar [A|b] por uma matriz elementar invertível E: o sistema transformado é EAx=Eb. Como E⁻¹ existe, Ax=b e EAx=Eb têm exatamente as mesmas soluções. Por isso escalonar não altera o conjunto solução, apenas o torna visível.`,
        ex: [
          ["Sistema", "x+y=3 e x−y=1: [A|b] escalonada dá 2y=2, logo y=1 e x=2."],
          ["Inconsistência", "x+y=1 e x+y=3 gera linha 0=2: posto(A)=1 e posto([A|b])=2, sistema sem solução."],
          ["Infinitas soluções", "x+y=2 gera y livre; soluções (2−t,t) para t real."]
        ],
        er: ["Multiplicar uma linha por zero durante a eliminação.", "Achar que toda matriz quadrada tem inversa.", "Ignorar variáveis livres e apresentar apenas uma solução."],
        lab: `Laboratório M16: implemente em C operações matriciais e a eliminação de Gauss com escalonamento parcial, resolva um sistema 4×4 e compare a solução com a obtida por uma biblioteca numérica confiável. Registre as diferenças como aproximações devidas a arredondamento e verifique o posto antes de concluir sobre consistência.`,
        masteryCriteria: [
          "2 pts — implementa multiplicação e transposição com dimensões corretas.",
          "2 pts — executa Gauss com pivoteamento e identifica pivôs e variáveis livres.",
          "2 pts — aplica corretamente o critério de consistência por posto.",
          "2 pts — compara o resultado com biblioteca confiável e interpreta diferenças como aproximações.",
          "2 pts — justifica por que as operações por linha preservam o conjunto solução."
        ],
        tags: ["álgebra linear", "Gauss", "sistemas"],
        estimatedEffort: 50
      }),
    L("Determinantes e sua interpretação geométrica",
      "Calcular determinantes, usar suas propriedades e aplicar a regra de Cramer quando cabível.",
      "Matrizes e eliminação de Gauss.",
      "O determinante é um único número que resume se uma transformação achata o espaço e quanto ela dilata volumes.",
      `Para matriz 2×2, det[[a,b],[c,d]]=ad−bc; para 3×3 usa-se expansão por cofatores ou a regra de Sarrus. Propriedades: trocar duas linhas multiplica o determinante por −1; multiplicar uma linha por k multiplica o determinante por k; somar múltiplo de uma linha a outra não altera o valor; det(AB)=det(A)det(B); matriz triangular tem determinante igual ao produto da diagonal; det(A)=0 se e somente se A é singular. Geometricamente, |det(A)| é o fator de escala de áreas no plano e de volumes em ℝ³, enquanto o sinal indica reversão de orientação. A regra de Cramer resolve Ax=b com A invertível substituindo colunas, mas é computacionalmente custosa para matrizes grandes. Critério de domínio: Cramer exige det(A)≠0; a interpretação de volume usa a matriz como transformação linear em dimensão igual à ordem.`,
      [
        ["determinante", "Escalar associado a uma matriz quadrada que indica invertibilidade e fator de dilatação."],
        ["matriz singular", "Matriz cujo determinante é zero e que, portanto, não tem inversa."],
        ["expansão por cofatores", "Método de cálculo do determinante por menores com sinais alternados."],
        ["orientação", "Sentido preservado ou invertido por uma transformação, sinalizado pelo sinal do determinante."],
        ["regra de Cramer", "Fórmula para cada componente da solução de Ax=b, válida quando det(A)≠0."]
      ],
      {
        derivation: `A expansão por cofatores decorre de duas propriedades básicas: o determinante é multilinear nas linhas e alternado. Escrevendo uma linha como soma de termos dos elementos daquela linha e usando a alternabilidade para anular termos com colunas repetidas, resta Σⱼ (−1)^{i+j} a_{ij} M_{ij}, onde M_{ij} é o menor correspondente.`,
        ex: [
          ["2×2", "det[[2,1],[1,3]] = 6−1 = 5, logo a matriz é invertível."],
          ["Singular", "det[[1,2],[2,4]] = 4−4 = 0: as colunas são dependentes."],
          ["Volume", "A matriz diagonal diag(2,3,1) tem determinante 6: transforma o cubo unitário em um paralelepípedo de volume 6."]
        ],
        er: ["Calcular determinante de matriz não quadrada.", "Esquecer a troca de sinal em operações de linha.", "Aplicar Cramer a matriz singular."],
        tags: ["álgebra linear", "determinante", "geometria"],
        estimatedEffort: 35
      }),
    L("Transformações lineares, núcleo, imagem e posto–nulidade",
      "Representar transformações lineares por matrizes e calcular núcleo e imagem.",
      "Bases, dimensão e multiplicação de matrizes.",
      "Uma transformação linear é uma função que respeita soma e escalar; matrizes são apenas sua descrição em bases escolhidas.",
      `T:V→W é linear quando T(u+v)=T(u)+T(v) e T(cv)=cT(v). Fixando bases de V e W, T é representada por uma matriz A cujas colunas são as imagens dos vetores da base de V escritas na base de W; a composição de transformações corresponde ao produto das matrizes, na ordem inversa à aplicação. O núcleo ker(T)={v:T(v)=0} é subespaço de V; a imagem im(T)={T(v)} é subespaço de W. O teorema posto–nulidade afirma dim ker(T)+dim im(T)=dim V. T é injetora se e somente se ker(T)={0} e sobrejetora se e somente se im(T)=W; para V=W finito, uma destas propriedades implica a outra. Critério de domínio: a matriz que representa T depende das bases, mas posto e nulidade são invariantes.`,
      [
        ["transformação linear", "Função entre espaços vetoriais que preserva soma e multiplicação por escalar."],
        ["núcleo", "Conjunto dos vetores enviados ao vetor zero por T."],
        ["imagem", "Conjunto dos valores assumidos por T."],
        ["posto–nulidade", "Relação dim ker + dim im = dimensão do domínio."],
        ["matriz de mudança de base", "Matriz invertível que converte coordenadas entre duas bases."]
      ],
      {
        derivation: `Para provar posto–nulidade, escolha uma base {u₁,...,uₖ} do núcleo e complete-a com {v₁,...,vᵣ} até formar base de V. As imagens T(v₁),...,T(vᵣ) geram a imagem e são linearmente independentes: se Σ cᵢT(vᵢ)=0, então T(Σ cᵢvᵢ)=0, logo Σ cᵢvᵢ pertence ao núcleo, o que força todos os cᵢ=0 pela independência do conjunto completo. Portanto dim im=r e dim ker=k, com k+r=dim V.`,
        ex: [
          ["Núcleo", "T(x,y)=(x−y,0): ker é a reta x=y, logo T não é injetora."],
          ["Imagem", "A mesma T tem imagem o eixo x, subespaço de ℝ² de dimensão 1."],
          ["Posto–nulidade", "Para T:ℝ³→ℝ² com posto 2, nulidade é 3−2=1."]
        ],
        er: ["Confundir núcleo com conjunto de vetores não nulos mapeados em zero.", "Atribuir à matriz um significado independente das bases escolhidas.", "Aplicar posto–nulidade a transformações entre espaços de dimensão infinita sem cuidado."],
        tags: ["álgebra linear", "transformações", "núcleo"],
        estimatedEffort: 40
      }),
    L("Autovalores, ortogonalidade, mínimos quadrados, QR e SVD",
      "Diagonalizar matrizes, projetar vetores e interpretar as decomposições QR e SVD.",
      "Determinantes, transformações lineares e produto escalar.",
      "Autovalores revelam direções que a transformação apenas estica; SVD generaliza essa ideia mesmo quando a matriz não é diagonalizável.",
      `Um autovalor λ satisfaz Av=λv para algum v≠0, equivalente a det(A−λI)=0; o polinômio característico fornece os autovalores, eventuais repetições e multiplicidades. A matriz é diagonalizável quando possui n autovetores linearmente independentes, isto é, A=PDP⁻¹. Matrizes simétricas reais são ortogonalmente diagonalizáveis pelo teorema espectral. A projeção de v sobre u é (v·u/u·u)u e o processo de Gram–Schmidt produz bases ortonormais; dele vem A=QR com Q ortogonal e R triangular superior. Mínimos quadrados minimizam ‖Ax−b‖² e levam às equações normais AᵀAx=Aᵀb, cuja solução é única se A tem colunas independentes. A SVD escreve A=UΣVᵀ com U e V ortogonais e Σ diagonal de valores singulares não negativos, iguais às raízes dos autovalores de AᵀA; existe para qualquer matriz. Aplicações incluem compressão, redução de dimensionalidade, visão computacional e aprendizado de máquina.`,
      [
        ["autovalor", "Escalar λ tal que Av=λv para algum vetor não nulo v."],
        ["diagonalização", "Escrita A=PDP⁻¹ com D diagonal, possível quando há base de autovetores."],
        ["projeção ortogonal", "Componente de um vetor na direção de outro, dada por (v·u/u·u)u."],
        ["mínimos quadrados", "Critério que minimiza a soma dos quadrados dos resíduos ‖Ax−b‖²."],
        ["SVD", "Decomposição A=UΣVᵀ com matrizes ortogonais e valores singulares não negativos."]
      ],
      {
        derivation: `Para mínimos quadrados, minimize E(x)=‖Ax−b‖²=(Ax−b)ᵀ(Ax−b). Derivando em relação a x: ∇E=2Aᵀ(Ax−b). Igualando a zero obtemos as equações normais AᵀAx=Aᵀb; a matriz AᵀA é invertível se as colunas de A forem independentes. Para a SVD, note que AᵀA é simétrica semidefinida positiva, logo tem autovalores λᵢ≥0 e base ortonormada V; defina σᵢ=√λᵢ e uᵢ=Avᵢ/σᵢ para σᵢ>0, completando a base de U.`,
        ex: [
          ["Autovalores", "Para A=[[2,0],[0,3]], autovalores 2 e 3 com autovetores e₁ e e₂; A=PDP⁻¹ com P=I."],
          ["Projeção", "Projetar v=(1,2) sobre u=(1,1): (3/2)(1,1)=(1,5, 1,5)."],
          ["Compressão", "Em SVD, manter apenas os maiores valores singulares fornece a melhor aproximação de posto baixo no sentido de Frobenius."]
        ],
        er: ["Considerar que toda matriz quadrada é diagonalizável.", "Aplicar equações normais sem verificar independência das colunas.", "Confundir autovalores de A com valores singulares de A."],
        lab: `Laboratório M16 (continuação): aplique Gram–Schmidt e QR a uma matriz 3×3, resolva um problema de mínimos quadrados por AᵀAx=Aᵀb e compare com uma biblioteca numérica confiável. Calcule também a SVD e verifique quanta energia dos valores singulares é necessária para uma aproximação de posto 1; rotule a reconstrução como aproximação.`,
        tags: ["álgebra linear", "SVD", "dados"],
        estimatedEffort: 55
      })
  ]
});

CURRICULUM.math.modules.push({
  name: "Equações diferenciais e projetos (M17)",
  lessons: [
    L("Modelagem por taxa de variação e EDOs separáveis",
      "Modelar situações por taxas, resolver EDOs separáveis e ler campos de direção.",
      "Derivadas e integração.",
      "Modelar por EDO é traduzir uma frase sobre variação em uma equação para a taxa de variação.",
      `Uma equação diferencial ordinária relaciona uma função desconhecida a suas derivadas; a ordem é a maior derivada presente. O problema de valor inicial acrescenta y(x₀)=y₀, que normalmente fixa uma única solução. Em y'=g(x)h(y), separamos dy/h(y)=g(x)dx em regiões onde h(y)≠0 e integramos; soluções com h(y)=0 devem ser acrescentadas separadamente. Um campo de direções mostra a inclinação f(x,y) em vários pontos, permitindo esboçar soluções sem resolução analítica. Condição de existência e unicidade: se f e ∂f/∂y são contínuas em uma vizinhança de (x₀,y₀), existe uma única solução local passando por esse ponto; fora dessas hipóteses a unicidade pode falhar. Critério de domínio: a separação é válida apenas em intervalos onde h não se anula e onde as integrais existem.`,
      [
        ["equação diferencial ordinária", "Equação que envolve uma função desconhecida de uma variável e suas derivadas."],
        ["problema de valor inicial", "EDO com condição y(x₀)=y₀ que seleciona uma solução da família."],
        ["separação de variáveis", "Método que isola cada variável em um lado da equação antes de integrar."],
        ["campo de direções", "Representação das inclinações f(x,y) no plano, usada para esboçar soluções."],
        ["existência e unicidade", "Garantia de uma solução local única sob hipóteses de continuidade de f e ∂f/∂y."]
      ],
      {
        derivation: `Da equação dy/dx=g(x)h(y), multiplicando por dx e dividindo por h(y) em uma região onde h(y)≠0: dy/h(y)=g(x)dx. Definindo H com H'=1/h e G com G'=g, obtemos H(y(x))=G(x)+C. Derivando essa identidade, H'(y)y'=G'(x), ou y'/h(y)=g(x), que recupera a EDO; a condição inicial fixa C=H(y₀)−G(x₀).`,
        ex: [
          ["Crescimento", "dP/dt=0,03P com P(0)=1000: P(t)=1000e^{0,03t}."],
          ["Separação com restrição", "y'=y²: −1/y=x+C; a solução y=0 é perdida na divisão e deve ser incluída à parte."],
          ["Campo", "Para y'=−y, as inclinações são negativas acima do eixo e positivas abaixo, apontando para y=0."]
        ],
        er: ["Dividir por h(y) sem checar soluções constantes.", "Achar que campo de direções determina uma solução única sem condição inicial.", "Ignorar a hipótese de continuidade de ∂f/∂y ao afirmar unicidade."],
        tags: ["EDO", "modelagem", "separação"],
        estimatedEffort: 35
      }),
    L("EDOs lineares de primeira ordem e equações exatas",
      "Resolver equações lineares por fator integrante e reconhecer equações exatas.",
      "Separação de variáveis e derivadas parciais.",
      "Um fator integrante transforma a equação em uma derivada de produto; exatidão significa que a equação já vem de uma função potencial.",
      `A forma linear de primeira ordem é y'+p(x)y=q(x), com p e q contínuas em um intervalo. Multiplicando por μ(x)=e^{∫p(x)dx}, o lado esquerdo vira (μy)', e a solução é y=(1/μ)∫μ q dx. A forma diferencial M(x,y)dx+N(x,y)dy=0 é exata em uma região simplesmente conexa se Mᵧ=Nₓ; nesse caso existe Ψ com Ψₓ=M e Ψᵧ=N e as soluções satisfazem Ψ(x,y)=C. Para determinar Ψ, integre M em x tratando y como constante e acrescente uma função de y, determinada pela condição Ψᵧ=N. Critérios de domínio: o fator integrante exige p contínua no intervalo e μ≠0; a exatidão exige a igualdade das derivadas cruzadas e região sem buracos para que o potencial seja global.`,
      [
        ["fator integrante", "Função μ(x)=e^{∫p dx} que transforma y'+py=q em uma derivada de produto."],
        ["equação exata", "Equação M dx+N dy=0 com Mᵧ=Nₓ, proveniente de um potencial Ψ."],
        ["função potencial", "Função Ψ tal que Ψₓ=M e Ψᵧ=N, cujas curvas de nível são as soluções."],
        ["derivadas cruzadas", "Condição Mᵧ=Nₓ que caracteriza a exatidão local."],
        ["intervalo de validade", "Intervalo onde os coeficientes são contínuos e a solução é definida."]
      ],
      {
        derivation: `Queremos μ y'+μ p y=(μ y)'. Pela regra do produto, (μ y)'=μ' y+μ y'; comparando, precisamos μ'=pμ. Separando, dμ/μ=p dx, logo μ=e^{∫p dx}. Para a forma exata, se Ψ existe então Ψₓᵧ=Mᵧ e Ψᵧₓ=Nₓ; pela igualdade das derivadas mistas de Ψ, Mᵧ=Nₓ é condição necessária e, em região simplesmente conexa, também suficiente.`,
        ex: [
          ["Linear", "y'+2y=eˣ: μ=e^{2x}; (e^{2x}y)'=e^{3x}, logo y=eˣ/3+C e^{−2x}."],
          ["Exata", "(2xy)dx+(x²+1)dy=0: Mᵧ=2x=Nₓ; Ψ=x²y+y, solução y(x²+1)=C."],
          ["Não exata", "(y)dx+(x²)dy=0 tem Mᵧ=1 e Nₓ=2x: não é exata fora da reta x=1/2."]
        ],
        er: ["Esquecer a constante ao integrar o fator integrante antes de exponenciar.", "Verificar exatidão sem calcular as duas derivadas cruzadas.", "Ignorar a região simplesmente conexa ao afirmar existência global do potencial."],
        tags: ["EDO", "fator integrante", "exatas"],
        estimatedEffort: 40
      }),
    L("EDOs de segunda ordem, sistemas e estabilidade",
      "Resolver EDOs lineares de segunda ordem com coeficientes constantes e analisar sistemas pelo espectro.",
      "Autovalores e EDOs de primeira ordem.",
      "Para coeficientes constantes, tentar uma exponencial transforma a EDO em um polinômio.",
      `Em a y''+b y'+c y=0 com a≠0, a substituição y=e^{rt} gera o polinômio característico ar²+br+c=0. Se as raízes r₁≠r₂ são reais, y=C₁e^{r₁t}+C₂e^{r₂t}; se r é dupla, y=(C₁+C₂t)e^{rt}; se r=α±iβ, y=e^{αt}(C₁ cos βt+C₂ sen βt). Para a equação não homogênea, soma-se uma solução particular, obtida por coeficientes indeterminados ou variação de parâmetros, com cuidado quando a força coincide com um modo homogêneo. Sistemas x'=Ax são resolvidos por autovalores e autovetores; a origem é assintoticamente estável quando todas as partes reais dos autovalores são negativas, instável quando alguma é positiva. Critério de domínio: a forma com coeficientes constantes não cobre coeficientes variáveis, e a classificação por autovalores vale para sistemas lineares autônomos.`,
      [
        ["polinômio característico", "Polinômio ar²+br+c obtido substituindo y=e^{rt} na EDO de coeficientes constantes."],
        ["raiz dupla", "Caso em que o polinômio característico tem uma raiz repetida, gerando fator t na solução."],
        ["solução particular", "Solução de uma equação não homogênea que se soma à solução homogênea."],
        ["sistema autônomo", "Sistema x'=Ax em que a matriz A não depende do tempo."],
        ["estabilidade", "Comportamento das soluções em relação a um equilíbrio quando o tempo cresce."]
      ],
      {
        derivation: `Substituindo y=e^{rt}: y'=re^{rt} e y''=r²e^{rt}. Como e^{rt}≠0, a equação vira (ar²+br+c)e^{rt}=0, logo ar²+br+c=0. Cada raiz fornece uma solução; a equação sendo linear e de segunda ordem, a combinacão linear de duas soluções independentes é a solução geral. Para sistemas, x=e^{λt}v com Av=λv dá x'=λe^{λt}v=Ax.`,
        ex: [
          ["Raízes reais", "y''−3y'+2y=0: r=1,2, logo y=C₁e^t+C₂e^{2t}."],
          ["Raízes complexas", "y''+4y=0: r=±2i, logo y=C₁cos2t+C₂sen2t, oscilação sem amortecimento."],
          ["Sistema", "x'=[[−1,0],[0,−3]]x tem ambas as componentes decaindo: equilíbrio assintoticamente estável."]
        ],
        er: ["Repetir a mesma exponencial para raiz dupla sem o fator t.", "Somar solução particular sem verificar ressonância com a homogênea.", "Classificar estabilidade de sistema não linear apenas pelos autovalores locais sem ressalvas."],
        tags: ["EDO", "estabilidade", "sistemas"],
        estimatedEffort: 45
      }),
    L("Soluções numéricas de EDOs: Euler, Heun e Runge–Kutta",
      "Implementar esquemas numéricos para EDOs e comparar aproximações com soluções analíticas.",
      "EDOs de primeira ordem e expansão de Taylor.",
      "Quando não há solução fechada, avançamos passo a passo usando a taxa de variação; o resultado é sempre uma aproximação.",
      `Para y'=f(t,y) com y(t₀)=y₀, o método de Euler usa y_{n+1}=y_n+h f(t_n,y_n), obtido truncando Taylor no primeiro termo; seu erro local é da ordem de h² e o global da ordem de h. Heun (RK2) usa uma predição e uma correção: k₁=f(t_n,y_n), k₂=f(t_n+h,y_n+h k₁), y_{n+1}=y_n+(h/2)(k₁+k₂). RK4 combina quatro inclinações com pesos 1/6, 1/3, 1/3, 1/6 e tem erro local da ordem de h⁵. Passos menores reduzem o erro de truncamento, mas aumentam o número de operações e podem acumular erro de arredondamento; equações rígidas exigem métodos implícitos. Critérios de domínio: f deve ser avaliável nos pontos da malha e a estabilidade do esquema restringe h em problemas rígidos.`,
      [
        ["método de Euler", "Esquema y_{n+1}=y_n+h f(t_n,y_n), de primeira ordem, que fornece aproximações."],
        ["erro local", "Erro cometido em um único passo, medido em potências de h."],
        ["erro global", "Erro acumulado até um tempo fixo após vários passos."],
        ["Runge–Kutta", "Família de esquemas que combinam inclinações avaliadas em pontos intermediários."],
        ["rigidez", "Situação em que a estabilidade impõe passos muito menores do que a precisão exigiria."]
      ],
      {
        derivation: `Taylor: y(t+h)=y(t)+h y'(t)+(h²/2)y''(ξ). Substituindo y' por f e descartando o termo quadrático, obtemos Euler com erro local −(h²/2)y''(ξ). RK4 é obtido integrando f ao longo do passo por uma regra de Simpson com avaliações em quatro pontos, daí os pesos 1/6, 1/3, 1/3, 1/6.`,
        ex: [
          ["Euler", "y'=y, y(0)=1, h=0,1: y₁=1,1; valor exato e^{0,1}≈1,10517, erro absoluto≈0,00517."],
          ["Heun", "Mesmo problema: k₁=1, k₂=1,1, y₁≈1,105; melhora a aproximação."],
          ["RK4", "Mesmo problema com h=0,1 fornece aproximação com erro da ordem de 10⁻⁶."]
        ],
        er: ["Apresentar a malha numérica como solução exata.", "Usar o erro local como se fosse o erro global.", "Escolher h sem verificar estabilidade em problema rígido."],
        lab: `Laboratório: resolva y'=y, y(0)=1 em [0,2] com Euler, Heun e RK4 para h=0,2; 0,1 e 0,05. Compare cada valor com e^t, construa tabela de erro máximo em função de h e estime a ordem observada. Todos os resultados numéricos são aproximações.`,
        masteryCriteria: [
          "2 pts — implementa corretamente os três esquemas.",
          "2 pts — calcula erros absolutos contra a solução analítica.",
          "2 pts — estima a ordem de convergência a partir das malhas.",
          "2 pts — distingue erro local de erro global.",
          "2 pts — rotula todos os resultados como aproximações e discute limitações."
        ],
        tags: ["EDO", "numérico", "RK4"],
        estimatedEffort: 45
      }),
    L("Projetos de equações diferenciais",
      "Integrar modelagem, análise e simulação em cinco projetos de EDOs.",
      "Separação de variáveis, sistemas e soluções numéricas.",
      "Projetos revelam o que uma EDO consegue e o que o modelo simplifica: os parâmetros e as hipóteses importam tanto quanto a solução.",
      `Cada projeto parte de uma pergunta sobre uma taxa, formula a EDO, identifica parâmetros e unidades, impõe condições iniciais ou de contorno, resolve analiticamente quando possível e complementa com simulação rotulada como tal. A validação compara a solução com o comportamento esperado e discute limitações: crescimento ilimitado, ausência de saturação, coeficientes constantes e ignorar perdas são simplificações frequentes. A apresentação deve separar claramente resultado analítico, resultado numérico aproximado e interpretação física. Critério de domínio: cada modelo vale apenas no intervalo de validade de seus parâmetros.`,
      [
        ["modelo de taxa", "Equação que descreve a variação de uma grandeza em função do estado atual."],
        ["parâmetro", "Constante do modelo que deve ser estimada ou fixada com unidade definida."],
        ["simulação", "Execução computacional de um modelo, explicitamente distinto de observação empírica."],
        ["validação", "Comparação entre as previsões do modelo e referências analíticas ou dados."],
        ["limitação do modelo", "Condição simplificadora que restringe a validade das conclusões."]
      ],
      {
        workedExamples: [
          "Simulador de crescimento populacional: dP/dt=rP(1−P/K), comparar com o modelo exponencial e discutir capacidade de suporte K.",
          "Resfriamento de um corpo: dT/dt=−k(T−Tₘ), estimar k a partir de duas medidas e prever o tempo até uma temperatura alvo.",
          "Oscilador massa-mola: m x''+b x'+k x=0, classificar amortecimento pelos autovalores e simular a trajetória.",
          "Circuito RC: R dq/dt+q/C=V, resolver com condição inicial q(0)=0 e comparar com a carga assintótica CV.",
          "Propagação simplificada de calor: discretizar u_t=αu_xx em uma barra, verificar a condição de estabilidade do passo e interpretar o perfil de temperatura."
        ],
        ex: [
          ["Circuito RC", "Com R=1000 Ω, C=10⁻⁶ F e V=5 V, a constante de tempo é RC=0,001 s e q(t)=CV(1−e^{−t/RC})."],
          ["Massa-mola", "Com m=1, b=0 e k=4, a solução é oscilatória com frequência angular 2 rad/s."],
          ["População", "Com r=0,2 e K=1000, P=100 cresce primeiro quase exponencialmente e depois desacelera."]
        ],
        er: ["Achar que uma simulação substitui a validação com solução analítica ou dados.", "Usar parâmetros sem unidade e sem justificativa.", "Estender as conclusões do modelo fora do intervalo de validade."],
        lab: `Escolha um dos cinco projetos, formule a EDO com unidades, resolva analiticamente quando possível, implemente uma simulação com passo h e compare os resultados numéricos com a solução exata ou com um refinamento de malha. O relatório deve conter hipóteses, parâmetros, gráficos rotulados como simulação, erro aproximado e uma seção de limitações do modelo.`,
        masteryCriteria: [
          "2 pts — formula a EDO e justifica unidades e parâmetros.",
          "2 pts — impõe condições iniciais ou de contorno coerentes com o problema.",
          "2 pts — resolve analiticamente ou justifica a necessidade de método numérico.",
          "2 pts — implementa simulação rotulada e quantifica o erro da aproximação.",
          "2 pts — discute limitações e validade do modelo com clareza."
        ],
        tags: ["EDO", "projetos", "modelagem"],
        estimatedEffort: 60
      })
  ]
});

CURRICULUM.math.modules.push({
  name: "Probabilidade, estatística e métodos numéricos (M18)",
  lessons: [
    L("Probabilidade: axiomas, probabilidade condicional e Bayes",
      "Calcular probabilidades em espaços amostrais finitos e aplicar condicionalidade, independência e Bayes.",
      "Conjuntos e razões.",
      "Probabilidade é uma medida sobre eventos; condicionar é reduzir o espaço amostral às situações em que o evento dado ocorreu.",
      `Um experimento aleatório tem espaço amostral Ω e eventos são subconjuntos de Ω. Os axiomas de Kolmogorov exigem P(Ω)=1, P(A)≥0 e aditividade para eventos disjuntos; daí vem P(A∪B)=P(A)+P(B)−P(A∩B). A probabilidade condicional é P(A|B)=P(A∩B)/P(B), definida apenas quando P(B)>0. Independência significa P(A∩B)=P(A)P(B), condição diferente de eventos mutuamente exclusivos. A fórmula de Bayes, P(A|B)=P(B|A)P(A)/P(B), segue de duas escritas da probabilidade conjunta; P(B) pode ser calculado pela lei da probabilidade total ao particionar Ω. Critério de domínio: denominadores nulos invalidam a condicional e a igualdade de independência não pode ser presumida apenas pela aparência dos eventos.`,
      [
        ["espaço amostral", "Conjunto de todos os resultados possíveis de um experimento aleatório."],
        ["probabilidade condicional", "Probabilidade de A dado B, definida como P(A∩B)/P(B) com P(B)>0."],
        ["independência", "Condição P(A∩B)=P(A)P(B), distinta de exclusividade mútua."],
        ["teorema de Bayes", "Fórmula que inverte uma probabilidade condicional usando a probabilidade prévia."],
        ["probabilidade total", "Decomposição de P(B) em somas sobre uma partição do espaço amostral."]
      ],
      {
        derivation: `P(A|B)=P(A∩B)/P(B) e P(B|A)=P(A∩B)/P(A). Multiplicando a segunda igualdade por P(A), obtemos P(A∩B)=P(B|A)P(A). Substituindo na primeira: P(A|B)=P(B|A)P(A)/P(B), que é Bayes. Se B₁,...,Bₙ particionam Ω com probabilidades positivas, a lei da probabilidade total dá P(A)=Σ P(A|Bᵢ)P(Bᵢ) quando A é decomposto pelas fatias Bᵢ.`,
        ex: [
          ["Condicional", "Em dois lançamentos de moeda justa, os resultados com pelo menos uma cara são CC, CT e TC; P(primeira cara | pelo menos uma cara)=2/3."],
          ["Independência", "Para dados independentes, P(cara e cara)=1/4; para eventos mutuamente exclusivos a interseção é vazia."],
          ["Bayes", "Teste com sensibilidade 0,99 e especificidade 0,95 em população com prevalência 0,01: P(doente|positivo)≈0,167, não 0,99."]
        ],
        er: ["Confundir P(A|B) com P(B|A).", "Achar que mutuamente exclusivos significa independentes.", "Aplicar Bayes sem especificar a probabilidade prévia e P(B)>0."],
        tags: ["probabilidade", "Bayes", "condicional"],
        estimatedEffort: 35
      }),
    L("Variáveis aleatórias, esperança e distribuições",
      "Calcular esperança e variância e reconhecer distribuições discretas e contínuas usuais.",
      "Probabilidade condicional e integração.",
      "Uma variável aleatória resume um resultado numérico do experimento; esperança e variância descrevem centro e dispersão.",
      `Uma variável aleatória discreta tem função de massa p(x)=P(X=x) com soma 1; uma contínua tem densidade f≥0 com ∫f=1, e P(a≤X≤b)=∫ₐᵇ f(x)dx. A função de distribuição acumulada é F(x)=P(X≤x). A esperança é E[X]=Σ x p(x) ou ∫x f(x)dx quando existe; a variância é Var(X)=E[(X−μ)²]=E[X²]−μ², com μ=E[X]. A esperança é linear mesmo sem independência, mas Var(X+Y)=Var(X)+Var(Y) exige independência; em geral entra a covariância. Distribuições usuais: Bernoulli(p), Binomial(n,p), Poisson(λ), Uniforme(a,b), Normal(μ,σ²) e Exponencial(λ). Critérios de domínio: p∈[0,1], n natural, λ>0, σ>0 e a<b; a densidade deve integrar 1 no domínio declarado.`,
      [
        ["variável aleatória", "Função que associa um número a cada resultado do espaço amostral."],
        ["esperança", "Média ponderada dos valores possíveis, calculada com massas ou densidade."],
        ["variância", "Esperança do quadrado do desvio em relação à média."],
        ["função de densidade", "Função não negativa cuja integral sobre o domínio é 1."],
        ["distribuição binomial", "Distribuição do número de sucessos em n ensaios independentes de probabilidade p."]
      ],
      {
        derivation: `Para X binomial(n,p), escreva X=I₁+...+Iₙ com indicadores independentes de ensaios de Bernoulli. Pela linearidade, E[X]=ΣE[Iᵢ]=np. Pela independência, Var(X)=ΣVar(Iᵢ)=n p(1−p). Para a variância geral, E[(X−μ)²]=E[X²−2μX+μ²]=E[X²]−2μ²+μ²=E[X²]−μ².`,
        ex: [
          ["Binomial", "Em 10 lançamentos de moeda justa, E[X]=5 e Var(X)=2,5."],
          ["Exponencial", "Para λ=2, E[X]=1/2 e P(X>1)=e^{−2}≈0,1353."],
          ["Normal padronizada", "Para Z~N(0,1), P(−1≤Z≤1)≈0,6827."]
        ],
        er: ["Somar variâncias sem independência.", "Usar densidade negativa ou que não integra 1.", "Esquecer que a esperança pode não existir em distribuições de cauda pesada."],
        tags: ["probabilidade", "distribuições", "esperança"],
        estimatedEffort: 40
      }),
    L("Estatística descritiva, correlação e amostragem",
      "Calcular medidas de posição e dispersão, ajustar uma reta e reconhecer vieses de amostragem.",
      "Variáveis aleatórias e noção de média.",
      "Descrever dados é diferente de explicar por que eles acontecem.",
      `Para uma amostra x₁,...,xₙ, a média é x̄=(1/n)Σxᵢ, a mediana é o valor central ordenado e a moda é o valor mais frequente. A variância amostral unbiased usa 1/(n−1), pois x̄ consome um grau de liberdade; o desvio padrão é a raiz. Quantis e o intervalo interquartil descrevem a dispersão de forma robusta a outliers. A correlação de Pearson é Cov(X,Y)/(σₓσᵧ), definida somente quando ambos os desvios são positivos, e mede associação linear, não causalidade. A reta de mínimos quadrados y=a+bx tem b=Cov(X,Y)/Var(X) e passa por (x̄,ȳ). Amostragem aleatória simples, estratificada e por conglomerado têm finalidades distintas; amostragem conveniência e não resposta introduzem viés. Critérios de domínio: Var(X)>0 para correlação e regressão, unidades compatíveis e n>1 para variância amostral.`,
      [
        ["média amostral", "Soma das observações dividida pelo número de observações."],
        ["variância amostral", "Medida de dispersão com denominador n−1 para evitar viés na estimação da variância populacional."],
        ["correlação", "Medida padronizada da associação linear entre duas variáveis."],
        ["regressão linear", "Ajuste de uma reta minimizando a soma dos quadrados dos resíduos."],
        ["viés de amostragem", "Distema sistemático entre a amostra e a população, causado pelo processo de seleção."]
      ],
      {
        derivation: `Minimizando S(a,b)=Σ(yᵢ−a−b xᵢ)², derivamos em relação a a e b e igualamos a zero. A primeira equação dá a=ȳ−b x̄; substituindo na segunda, b=Σ(xᵢ−x̄)(yᵢ−ȳ)/Σ(xᵢ−x̄)²=Cov(X,Y)/Var(X). O denominador deve ser positivo: se todos os xᵢ são iguais, a reta não é identificável.`,
        ex: [
          ["Desvio padrão", "Amostra 2, 4, 4, 6 tem média 4 e variância amostral (4+0+0+4)/3=8/3."],
          ["Correlação", "Correlação próxima de 1 indica associação linear forte; não prova que X causa Y."],
          ["Regressão", "Com x̄=3, ȳ=5 e b=2, a reta ajustada é y=5+2(x−3)=2x−1."]
        ],
        er: ["Usar denominador n e chamar o resultado de estimativa não viesada da variância.", "Interpretar correlação alta como causalidade.", "Calcular correlação quando uma variável é constante."],
        tags: ["estatística", "dados", "amostragem"],
        estimatedEffort: 40
      }),
    L("Inferência: intervalos de confiança, testes e interpretação",
      "Construir intervalos de confiança, realizar testes de hipótese e interpretar p-valor, erro e tamanho de efeito.",
      "Distribuições amostráveis e variância amostral.",
      "Inferência quantifica incerteza, mas não transforma uma amostra em certeza sobre a população.",
      `O teorema do limite central afirma que, para variáveis independentes e identicamente distribuídas com variância finita, a média amostral é aproximadamente normal para n grande. Sob normalidade ou n grande com desvio populacional σ conhecido, um intervalo de confiança de nível 1−α para a média é x̄±z_{α/2}σ/√n; com σ desconhecido usa-se a distribuição t de Student com n−1 graus de liberdade. Em um teste, formulam-se H₀ e H₁, escolhe-se α, calcula-se a estatística e o p-valor: a probabilidade, sob H₀, de observar resultado tão ou mais extremo que o obtido. Rejeitar H₀ quando p<α controla a taxa de erro do tipo I; o erro do tipo II e o poder dependem do tamanho de efeito e de n. Tamanho de efeito quantifica a magnitude, distinta de significância estatística. Critérios de domínio: os intervalos exigem amostragem adequada e hipóteses de distribuição; testes múltiplos inflam a taxa de falsos positivos e exigem ajuste.`,
      [
        ["intervalo de confiança", "Intervalo calculado pela amostra que contém o parâmetro em uma fração 1−α dos repetições sob as hipóteses."],
        ["p-valor", "Probabilidade, sob a hipótese nula, de um resultado tão ou mais extremo que o observado."],
        ["erro do tipo I", "Rejeitar a hipótese nula quando ela é verdadeira."],
        ["poder do teste", "Probabilidade de rejeitar corretamente a hipótese nula quando a alternativa é verdadeira."],
        ["tamanho de efeito", "Medida da magnitude de uma diferença ou associação, independente do tamanho amostral."]
      ],
      {
        derivation: `Se X̄ tem distribuição aproximadamente normal com média μ e desvio σ/√n, então P(−z_{α/2} ≤ (X̄−μ)/(σ/√n) ≤ z_{α/2}) = 1−α. Isolando μ, obtemos o intervalo x̄±z_{α/2}σ/√n. A interpretação correta é frequentista: em repetições do procedimento, 1−α dos intervalos captura o parâmetro fixo.`,
        ex: [
          ["Intervalo", "Com x̄=50, σ=10, n=100 e α=0,05: 50±1,96, ou seja, [48,04;51,96]."],
          ["p-valor", "p=0,03 não significa 3% de chance de H₀ ser verdadeira; é probabilidade calculada assumindo H₀."],
          ["Efeito", "Com n muito grande, uma diferença pequena pode ser estatisticamente significativa e ainda assim irrelevantemente pequena."]
        ],
        er: ["Interpretar o nível de confiança como probabilidade de o parâmetro estar no intervalo calculado.", "Confundir p-valor com probabilidade de H₀.", "Ignorar testes múltiplos e viés de amostragem."],
        tags: ["estatística", "inferência", "p-valor"],
        estimatedEffort: 45
      }),
    L("Métodos numéricos e laboratório de análise de dados",
      "Implementar métodos de raiz, integração e sistemas e produzir um relatório de dados com conclusões cautelosas.",
      "Cálculo, álgebra linear e estatística descritiva.",
      "Cálculo numérico lida com o que a aritmética exata não entrega; estatística lida com o que uma amostra não consegue provar.",
      `Números de ponto flutuante têm precisão finita: erro absoluto é |x̃−x|, erro relativo é |x̃−x|/|x| para x≠0, e subtração de grandezas próximas causa cancelamento catastrófico. A bissecção converge para uma raiz em [a,b] com f(a)f(b)<0 e erro no intervalo limitado por (b−a)/2ⁿ; Newton usa x_{n+1}=x_n−f(x_n)/f'(x_n) e tem convergência quadrática perto de raiz simples com f'≠0, mas pode falhar se a derivada for nula. Interpolação polinomial passa pelos pontos, mas pode oscilar nas bordas. Trapézios e Simpson aproximam integrais; eliminação com pivoteamento resolve sistemas e o número de condição mede sensibilidade. O laboratório de dados deve formular hipótese, visualizar distribuições, calcular medidas e distinguir correlação de causalidade. Critérios de domínio: todo valor numérico é aproximação, e conclusões causais exigem desenho de estudo adequado, não apenas associação.`,
      [
        ["erro relativo", "Erro absoluto dividido pelo valor exato, definido quando esse valor é não nulo."],
        ["cancelamento catastrófico", "Perda de dígitos significativos ao subtrair números muito próximos."],
        ["método da bissecção", "Método de raiz que reduz o intervalo pela metade a cada iteração."],
        ["número de condição", "Medida de quanto a solução de um problema pode mudar com pequenas perturbações nos dados."],
        ["causalidade", "Relação de causa e efeito, que não decorre apenas de correlação observacional."]
      ],
      {
        derivation: `Newton vem da reta tangente: 0≈f(x_n)+f'(x_n)(x_{n+1}−x_n), logo x_{n+1}=x_n−f(x_n)/f'(x_n). Na bissecção, após n iterações o intervalo tem comprimento (b−a)/2ⁿ, então o ponto médio dista no máximo metade disso da raiz. Para Simpson, integra-se um polinômio quadrático interpolando os pontos x₀, x₀+h, x₀+2h, resultando em (h/3)[f(x₀)+4f(x₀+h)+f(x₀+2h)] como aproximação.`,
        workedExamples: [
          "Analisar um conjunto de dados: descrever origem, variáveis e unidades, e formular uma hipótese testável antes de calcular qualquer medida.",
          "Visualizar distribuição: histograma e boxplot, identificando assimetria, outliers e limites da amostra.",
          "Calcular medidas: média, mediana, desvio padrão, quartis e correlação com as hipóteses de cada medida explícitas.",
          "Escrever relatório: separar associação observada de explicação causal, listando variáveis de confusão plausíveis."
        ],
        ex: [
          ["Bissecção", "Para f(x)=x²−2 em [1,2], após 10 iterações o erro no intervalo é no máximo 1/1024."],
          ["Newton", "Para x²−2 com x₀=1,5: x₁≈1,4167 e x₂≈1,4142, aproximações de √2."],
          ["Condicionamento", "Sistema com matriz mal condicionada pode mudar bastante a solução com variação pequena nos dados."]
        ],
        er: ["Relatar valores numéricos sem estimativa de erro.", "Confundir ajuste de reta com evidência de causalidade.", "Usar correlação quando uma das variáveis é constante."],
        lab: `Laboratório M18 (atividade única condensada): analise um conjunto de dados fornecido, formule uma hipótese, visualize a distribuição com histograma e boxplot, calcule medidas de posição, dispersão e correlação e escreva um relatório que diferencie explicitamente correlação de causalidade. A seção final deve listar vieses, variáveis de confusão e limitações da amostra.`,
        masteryCriteria: [
          "2 pts — formula hipótese testável e descreve origem e limites dos dados.",
          "2 pts — produz visualizações adequadas e calcula medidas com domínio verificado.",
          "2 pts — implementa método numérico com estimativa de erro e rotula aproximações.",
          "2 pts — distingue correlação de causalidade e aponta variáveis de confusão.",
          "2 pts — escreve relatório claro, com conclusões proporcionais à evidência."
        ],
        tags: ["numérico", "dados", "causalidade"],
        estimatedEffort: 60
      })
  ]
});

CURRICULUM.math.modules.push({
  name: "Matemática avançada — análise real, álgebra, topologia e otimização (M19)",
  lessons: [
    L("Análise real: completude, sequências e convergência uniforme",
      "Trabalhar com completude de ℝ, limites rigorosos e convergência de funções.",
      "Limites, séries e noção de prova.",
      "A análise real torna rigorosas as intuições do cálculo: o que antes era 'chegar perto' vira quantificadores e desigualdades.",
      `O conjunto ℝ é completo: todo subconjunto não vazio e limitado superiormente tem supremo. Dessa propriedade decorrem o teorema da convergência monótona, o teorema de Bolzano–Weierstrass e o critério de Cauchy para convergência de sequências. A topologia da reta usa vizinhanças, conjuntos abertos e fechados para formular limites e continuidade; a continuidade em um ponto equivale à condição ε−δ. Diferenciabilidade e integração são definidas por limites, e séries de funções exigem cuidado adicional. A convergência pontual de fₙ para f significa que, para cada x, fₙ(x)→f(x); a convergência uniforme exige que sup|fₙ−f|→0 no domínio. O limite uniforme de funções contínuas é contínuo; o limite pontual pode não ser, como mostram as potências xⁿ em [0,1]. Critério de domínio: o conjunto onde a convergência é verificada faz parte da afirmação.`,
      [
        ["completude", "Propriedade de ℝ pela qual todo conjunto não vazio e limitado tem supremo."],
        ["sequência de Cauchy", "Sequência cujos termos ficam arbitrariamente próximos uns dos outros; em ℝ, converge se e somente se é de Cauchy."],
        ["convergência pontual", "Convergência avaliada separadamente em cada ponto do domínio."],
        ["convergência uniforme", "Convergência em que o erro máximo no domínio tende a zero."],
        ["teorema de Bolzano–Weierstrass", "Resultado que garante uma subsequência convergente para toda sequência limitada em ℝ."]
      ],
      {
        derivation: `Se fₙ são contínuas e fₙ→f uniformemente em D, para provar a continuidade de f em x₀ use a desigualdade |f(x)−f(x₀)| ≤ |f(x)−fₙ(x)|+|fₙ(x)−fₙ(x₀)|+|fₙ(x₀)−f(x₀)|. Dado ε>0, escolha n com sup|fₙ−f|<ε/3 e, pela continuidade de fₙ, δ tal que |x−x₀|<δ implica |fₙ(x)−fₙ(x₀)|<ε/3. A soma fica menor que ε. Esse argumento ε/3 falha para convergência apenas pontual.`,
        ex: [
          ["Ponto versus uniforme", "fₙ(x)=xⁿ em [0,1] converge pontualmente para 0 em [0,1) e para 1 em x=1; o limite é descontínuo, logo a convergência não é uniforme em [0,1]."],
          ["Uniforme", "fₙ(x)=x/n em [0,1] converge uniformemente para 0, pois sup|x/n|=1/n→0."],
          ["Completude", "A sequência de aproximações decimais de √2 é de Cauchy e converge em ℝ, mas não convergiria em ℚ."]
        ],
        er: ["Achar que convergência pontual preserva continuidade.", "Usar supremo de conjunto vazio ou ilimitado como se existisse.", "Omitir o domínio ao afirmar convergência uniforme."],
        tags: ["análise real", "convergência", "prova"],
        estimatedEffort: 50
      }),
    L("Álgebra abstrata: grupos, anéis, corpos e aritmética modular",
      "Verificar estruturas algébricas e trabalhar com homomorfismos e polinômios.",
      "Conjuntos, operações e aritmética modular.",
      "A álgebra abstrata pergunta quais leis uma operação satisfaz, independentemente da natureza dos elementos.",
      `Um grupo é um conjunto G com uma operação fechada, associativa, com elemento neutro e inversos; é abeliano quando a operação é comutativa. Exemplos: (ℤ,+) e (ℝ*,×) são grupos; (ℤ,×) não é, pois 2 não tem inverso inteiro. Um subespaço análogo, o subgrupo, é subconjunto fechado sob a operação e inversos. Um homomorfismo φ:G→H preserva a operação: φ(ab)=φ(a)φ(b); seu núcleo é um subgrupo normal e a imagem é um subgrupo. Um anel tem duas operações, com adição de grupo abeliano e multiplicação associativa distributiva sobre a soma; um corpo é um anel em que todo elemento não nulo tem inverso multiplicativo. Polinômios sobre um corpo formam um anel, e ℤ/nℤ é um corpo quando n é primo. Para grupo finito, o teorema de Lagrange afirma que a ordem de um subgrupo divide a ordem do grupo.`,
      [
        ["grupo", "Conjunto com operação fechada, associativa, elemento neutro e inversos."],
        ["grupo abeliano", "Grupo cuja operação é comutativa."],
        ["homomorfismo", "Função entre estruturas que preserva as operações."],
        ["anel", "Estrutura com duas operações, adição em grupo abeliano e multiplicação distributiva."],
        ["corpo", "Anel em que todo elemento não nulo possui inverso multiplicativo."]
      ],
      {
        derivation: `Para verificar que ℤ/nℤ é corpo quando n é primo, tome uma classe [a]≠[0]. Como n é primo, gcd(a,n)=1 e o algoritmo euclidiano fornece inteiros u,v com au+nv=1. Então [a][u]=[1], logo [u] é o inverso de [a]. Se n não é primo, um divisor próprio de n não tem inverso, e a estrutura não é corpo.`,
        ex: [
          ["Grupo", "S₃, o grupo das permutações de três elementos, tem 6 elementos e não é abeliano."],
          ["Homomorfismo", "φ:ℤ→ℤ/nℤ, φ(k)=[k], é homomorfismo aditivo com núcleo nℤ."],
          ["Corpo", "ℤ/5ℤ é corpo: [2]⁻¹=[3], pois 2·3=6≡1 (mod 5)."]
        ],
        er: ["Chamar uma estrutura de grupo sem verificar o elemento neutro e os inversos.", "Achar que todo anel é corpo.", "Usar o teorema de Lagrange para grupos infinitos."],
        tags: ["álgebra abstrata", "grupos", "corpos"],
        estimatedEffort: 45
      }),
    L("Topologia introdutória: métricas, abertos, compacidade e conexidade",
      "Definir espaços métricos e conjuntos abertos e fechados e interpretar continuidade, compacidade e conexidade.",
      "Conjuntos, funções e noção de distância.",
      "Topologia generaliza a ideia de vizinhança: o que importa é quais conjuntos podem servir de 'arredondamento'.",
      `Um espaço métrico é um conjunto X com função distância d que satisfaz d(x,y)≥0, d(x,y)=0 se e somente se x=y, simetria e desigualdade triangular. A bola aberta B(a,r)={x:d(x,a)<r} define a topologia: um conjunto é aberto se contém uma bola em torno de cada um de seus pontos, e fechado se seu complementar é aberto. Em um espaço métrico, f é contínua se e somente se a pré-imagem de todo aberto é aberta; essa formulação equivale à definição ε−δ. Compacidade significa que toda cobertura por abertos admite subcobertura finita; em ℝⁿ, o teorema de Heine–Borel identifica compactos com conjuntos fechados e limitados. Um espaço é conexo quando não pode ser separado em dois abertos não vazios e disjuntos. Critérios de domínio: conceitos como 'fechado' dependem do espaço ambiente e da métrica escolhida.`,
      [
        ["espaço métrico", "Conjunto munido de uma função distância com os axiomas de não negatividade, identidade, simetria e triângulo."],
        ["conjunto aberto", "Conjunto que contém uma bola centrada em cada um de seus pontos."],
        ["continuidade topológica", "Propriedade pela qual a pré-imagem de todo conjunto aberto é aberta."],
        ["compacidade", "Propriedade de que toda cobertura aberta possui subcobertura finita."],
        ["conexidade", "Propriedade de um espaço que não se separa em dois abertos não vazios e disjuntos."]
      ],
      {
        derivation: `Para mostrar a equivalência entre continuidade ε−δ e continuidade topológica em espaços métricos, suponha primeiro ε−δ. Seja V aberto e x∈f⁻¹(V); existe ε>0 com B(f(x),ε)⊂V. Escolha δ com d(x,y)<δ implicando d(f(x),f(y))<ε; então B(x,δ)⊂f⁻¹(V), que é aberto. Reciprocamente, tome V=B(f(x),ε): sua pré-imagem é aberta e contém x, logo contém B(x,δ), que é a condição ε−δ.`,
        ex: [
          ["Abertos", "Em ℝ com distância usual, (0,1) é aberto e [0,1] é fechado; [0,1) não é nem um nem outro em ℝ."],
          ["Compacidade", "[0,1] é compacto em ℝ por Heine–Borel; (0,1) é limitado, mas não fechado, logo não compacto."],
          ["Conexidade", "[0,1] é conexo; {0}∪{1} com a métrica herdada é desconexo."]
        ],
        er: ["Achar que todo conjunto limitado é compacto em qualquer espaço métrico.", "Definir 'fechado' como 'que contém todos os seus pontos limites' sem fixar o espaço ambiente.", "Confundir continuidade de f com abertura de f(A) para conjuntos abertos A."],
        tags: ["topologia", "métricas", "compacidade"],
        estimatedEffort: 45
      }),
    L("Otimização: convexidade, condições de otimalidade e restrições",
      "Aplicar condições de primeira e segunda ordem, multiplicadores e noções de otimização numérica.",
      "Gradiente, matrizes e cálculo diferencial.",
      "Em problemas convexos, a condição local é global; em problemas gerais, o gradiente nulo é apenas candidato.",
      `Um conjunto C é convexo quando o segmento entre quaisquer dois pontos está em C; uma função f é convexa em C se f(tx+(1−t)y)≤t f(x)+(1−t)f(y). Para f diferenciável em ponto interior irrestrito, ∇f(x*)=0 é condição necessária; se ∇²f(x*) é semidefinida positiva, é condição necessária de mínimo local, e se ∇f=0 com Hessiana definida positiva, x* é mínimo local estrito. Para funções convexas, ∇f=0 é suficiente para mínimo global. Com igualdades gᵢ(x)=0 e desigualdades hⱼ(x)≤0, as condições KKT incluem estacionária ∇f+Σλᵢ∇gᵢ+Σμⱼ∇hⱼ=0, viabilidade primal e dual, μⱼ≥0 e complementaridade μⱼhⱼ(x)=0, sob qualificação de restrições. Gradiente descendente atualiza x_{k+1}=x_k−α∇f(x_k); o passo α afeta convergência. Programação linear otimiza função linear sobre poliedro, com solução em vértice quando existe e é limitada. Critérios de domínio: KKT exige qualificação de restrições, e métodos numéricos exigem passo e tolerância escolhidos.`,
      [
        ["função convexa", "Função cujo gráfico fica abaixo das cordas, com desigualdade de Jensen."],
        ["condição de primeira ordem", "Exigência ∇f(x*)=0 para extremo interior de função diferenciável."],
        ["condições KKT", "Sistema de condições necessárias para otimalidade com restrições sob qualificação."],
        ["complementaridade", "Condição μⱼhⱼ(x)=0 nas KKT, que exige multiplicador nulo ou restrição ativa."],
        ["programação linear", "Problema de otimizar função linear sujeita a restrições lineares."]
      ],
      {
        derivation: `Se x* é mínimo local interior e f é diferenciável, para qualquer direção v a função g(t)=f(x*+tv) tem mínimo em t=0, logo g'(0)=∇f(x*)·v=0 para todo v; escolhendo cada vetor da base, ∇f(x*)=0. Para KKT, a estacionária resulta de exigir que a direção de descida de f seja incompatível com as direções viáveis no ponto ótimo; isso gera a combinação linear dos gradientes das restrições com multiplicadores de sinal adequado.`,
        ex: [
          ["Convexo", "f(x)=x² em ℝ tem ∇f=2x; x=0 é mínimo global."],
          ["Restrição", "Minimizar x²+y² com x+y=1: ∇f=(2x,2y)=−λ(1,1), logo x=y=1/2."],
          ["Não convexo", "f(x)=x⁴−2x² tem ∇f=0 em −1, 0 e 1; o ponto 0 é máximo local, não mínimo."]
        ],
        er: ["Tratar ponto com gradiente nulo como mínimo sem verificar segunda ordem ou convexidade.", "Aplicar KKT sem qualificação de restrições.", "Achar que desigualdade ativa pode ter multiplicador negativo nas KKT na convenção h≤0."],
        lab: `Laboratório de otimização: implemente gradiente descendente em f(x,y)=x²+3y² a partir de (3,2), teste α=0,01; 0,1; 0,4 e registre o número de iterações até a tolerância 10⁻⁶. Compare com o mínimo analítico (0,0), classifique os passos como aproximações e discuta divergência quando o passo é grande demais.`,
        tags: ["otimização", "convexidade", "KKT"],
        estimatedEffort: 50
      }),
    L("Prova final integrada: teorema, hipóteses e aplicação",
      "Produzir uma demonstração completa com definições, hipóteses, exemplo, contraexemplo e aplicação computacional.",
      "Todos os módulos anteriores de matemática avançada.",
      "Uma prova convincente não é só um cálculo: ela declara o que assume, mostra a cadeia lógica e testa os limites do resultado.",
      `A prova final pede a escolha de um teorema ou método e a apresentação de seis elementos: definições dos termos, enunciado preciso com hipóteses, demonstração ou derivação, exemplo em que o resultado vale, contraexemplo mostrando por que uma hipótese é necessária e aplicação computacional. As hipóteses devem aparecer antes da conclusão, e cada uso delas na demonstração deve ser identificável. O exemplo verifica o teorema em um caso concreto; o contraexemplo移除 uma hipótese e mostra que a conclusão falha. A aplicação computacional pode ser uma simulação ou um cálculo numérico, explicitamente rotulado como aproximação quando for o caso. Critério de domínio: a validade da conclusão restringe-se ao domínio das hipóteses verificadas.`,
      [
        ["teorema", "Afirmação demonstrada a partir de definições e hipóteses explícitas."],
        ["hipótese", "Condição que deve ser verificada para que a conclusão do teorema valha."],
        ["demonstração", "Cadeia lógica que deriva a conclusão a partir das hipóteses."],
        ["contraexemplo", "Caso que satisfaz todas as hipóteses menos uma e viola a conclusão."],
        ["aplicação computacional", "Uso computacional do resultado, com aproximações e limitações declaradas."]
      ],
      {
        derivation: `Modelo de estrutura para a prova: (1) definir os objetos; (2) enunciar: 'se H₁ e H₂ valem, então C'; (3) demonstrar C usando H₁ no passo k e H₂ no passo m; (4) exemplo concreto com H₁ e H₂ verificadas; (5) contraexemplo com H₂ removida e C falso; (6) aplicação computacional com parâmetros, código ou procedimento e erro declarado. A ausência de qualquer um dos seis itens enfraquece a avaliação.`,
        workedExamples: [
          "Definições: comece com os termos que aparecem no enunciado, sem usar informalmente conceitos ainda não definidos.",
          "Hipóteses: escreva 'se ... então ...' e sublinhe onde cada hipótese é usada na demonstração.",
          "Demonstração ou derivação: encadeie afirmações justificadas; não pule o passo que liga a hipótese à conclusão.",
          "Exemplo: escolha um caso numérico simples e verifique explicitamente cada hipótese antes de aplicar o resultado.",
          "Contraexemplo: retire uma hipótese e mostre, com cálculo ou construção, que a conclusão deixa de valer.",
          "Aplicação computacional: implemente o método, rotule a saída como aproximação quando numérica e descreva a validação."
        ],
        ex: [
          ["Exemplo de contraexemplo", "Para o teorema 'se f é contínua em [a,b], então atinge máximo', remover compacidade: f(x)=x em [0,∞) não atinge máximo."],
          ["Exemplo de hipótese", "No teorema do valor intermediário, a continuidade é usada para garantir que o conjunto {x:f(x)≤y} seja fechado e não deixe um salto."],
          ["Aplicação", "Validar numericamente um teorema de convergência com malhas sucessivas e estimar a ordem do erro observado."]
        ],
        er: ["Enunciar a conclusão sem declarar as hipóteses.", "Apresentar exemplos como se fossem prova geral.", "Dar contraexemplo que ainda satisfaz todas as hipóteses."],
        lab: `Prova final: escolha um teorema ou método visto no módulo, escreva definições, enunciado com hipóteses, demonstração ou derivação completa, um exemplo, um contraexemplo que mostre a necessidade de uma hipótese e uma aplicação computacional. Se a aplicação for numérica, rotule-a como aproximação e informe o erro ou a tolerância usada.`,
        masteryCriteria: [
          "2 pts — apresenta definições corretas e enunciado com hipóteses explícitas.",
          "2 pts — produz demonstração ou derivação lógica, identificando o uso das hipóteses.",
          "2 pts — fornece exemplo que verifica as hipóteses e um contraexemplo válido.",
          "2 pts — implementa aplicação computacional com validação e aproximações rotuladas.",
          "2 pts — organiza o texto com clareza, notação consistente e conclusão proporcional ao que foi provado."
        ],
        tags: ["prova", "síntese", "avaliação"],
        estimatedEffort: 70
      })
  ]
});


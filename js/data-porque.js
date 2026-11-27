/* ============================================================
   FORGE 7.0 — data-porque.js
   Conteúdo didático de "O Porquê de Tudo", protocolo de estudo,
   mapa estelar M1–M6 e cadeia de computação C1–C6.
   100% local, sem dependências e sem rede.
   ============================================================ */

(function () {
  "use strict";

  const DIDACTIC_STEPS = [
    {
      key: "analogia",
      title: "1. Analogia do Mundo Real",
      desc: "Comece com um fenômeno concreto que o estudante já tenha sentido: uma corda esticada, um relógio de areia, uma fila no banco. A analogia não substitui a definição — ela dá um lugar mental para o conceito.",
      check: "Consigo explicar o conceito usando um objeto que o estudante pode tocar ou imaginar?"
    },
    {
      key: "genese",
      title: "2. Gênese Histórica",
      desc: "Mostre o problema original que forçou a invenção: medir terras após a cheia do Nilo, cobrar juros, prever eclipses, compressar sinais. O conceito nasce como resposta a uma escassez, não como decreto.",
      check: "Consigo nomear a dificuldade concreta que existia antes da ideia?"
    },
    {
      key: "construcao",
      title: "3. Construção Passo a Passo",
      desc: "Derive sem pular etapas. Cada linha deve ser justificada por uma definição, axioma ou resultado anterior. Se uma linha aparece sem causa, volte e reconstrua.",
      check: "Cada transição tem uma razão explícita ou é uma definição já apresentada?"
    },
    {
      key: "diagrama",
      title: "4. Diagrama Visual ASCII/SVG",
      desc: "Desenhe a estrutura: retas, conjuntos, portas lógicas, fluxo de bits, grafos de dependência. O desenho deve ser legível em texto simples, para funcionar offline e em leitores de tela com descrição.",
      check: "O diagrama mostra a relação causal e tem um texto alternativo?"
    },
    {
      key: "exemplo",
      title: "5. Exemplo Guiado + Autópsia do Erro",
      desc: "Resolva um caso típico e, em seguida, um contraexemplo ou erro real: divisão por zero, overflow, premissa trocada, nonce repetido. A autópsia do erro fixa a fronteira do conceito.",
      check: "Mostrei onde a regra deixa de valer e por quê?"
    },
    {
      key: "aprofundamento",
      title: "6. Aprofundamento Universitário/Mestre",
      desc: "Conecte à formulação formal: teorema, prova, generalização, notação padrão, complexidade, condições de contorno. Aqui o vocabulário técnico entra — depois da intuição.",
      check: "Apresentei a versão formal e as hipóteses que ela exige?"
    },
    {
      key: "feynman",
      title: "7. Teste de Feynman",
      desc: "Explique em voz alta, em linguagem simples, para alguém sem o vocabulário. Onde travar, volta ao degrau correspondente. Domínio exige nota ≥ 8/10 e síntese escrita com ≥ 30 caracteres.",
      check: "A explicação sobrevive sem jargão e sem olhar a fonte?"
    }
  ];

  const AUTOPSIES = [
    {
      id: "peano-half-adder",
      title: "Autópsia 1 — Por que 1 + 1 = 2 (Peano e o meio-somador)",
      era: "Aritmética → lógica → silício",
      problem: "Contar dois grupos com uma regra que não dependa de intuição nem de dedos.",
      constraint: "É preciso definir número, sucessor e adição sem circularidade.",
      construction: "Peano define 0 e o sucessor S(n); 1 = S(0), 2 = S(S(0)). Adição é recursão: a + 0 = a e a + S(b) = S(a + b). Logo 1 + 1 = 1 + S(0) = S(1 + 0) = S(1) = 2.",
      proof: "Em paralelo, o meio-somador recebe bits A e B: S = A ⊕ B e C = A ∧ B. Com A = B = 1, S = 0 e C = 1, que é a escrita binária de 2 (10₂).",
      consequence: "A mesma operação aparece como recursão na aritmética e como porta lógica no hardware; a igualdade não é dogma, é construção.",
      formula: "1 + 1 = S(S(0)) = 2 · S = A ⊕ B, C = A ∧ B",
      layers: ["Contar objetos com dedos", "Necessidade de contabilidade e medição", "Definir sucessor e recursão", "S(A,B) e C(A,B) em tabela verdade", "Aplicação em registradores e carries"],
      code: "int half_adder(int a, int b) {\n  int sum = a ^ b;   // bit de soma\n  int carry = a & b; // vai-um\n  return (carry << 1) | sum;\n}"
    },
    {
      id: "hello-world-12",
      title: "Autópsia 2 — 'Hello World': 12 passos invisíveis",
      era: "Sistemas operacionais e compiladores",
      problem: "Uma linha de código aparentemente trivial precisa tornar-se luz num pixel.",
      constraint: "Nenhuma camada pode confiar na interpretação da camada superior.",
      construction: "1) código-fonte UTF-8; 2) pré-processamento; 3) análise léxica; 4) parsing; 5) AST; 6) código intermediário; 7) otimização; 8) assembly; 9) objeto relocável; 10) linker com libc; 11) loader e paginação; 12) syscall write + terminal renderiza glifos.",
      proof: "Cada seta é verificável: `-E`, `-S`, `-c`, `nm`, `objdump`, `strace`. O que some entre a fonte e o binário é trabalho das camadas.",
      consequence: "Depurar exige saber em qual camada o defeito mora; 'não compila' e 'não aparece' são doenças diferentes.",
      formula: "fonte → AST → IR → assembly → objeto → executável → syscall",
      layers: ["Texto digitado", "Ferramentas debuild por causa de portabilidade", "Pipeline do compilador", "Diagrama de camadas com setas", "strace mostrando write(1, ...)"],
      code: "#include <stdio.h>\nint main(void) {\n  fputs(\"Hello, world\\n\", stdout);\n  return 0;\n}"
    },
    {
      id: "loop-hardware",
      title: "Autópsia 3 — O laço que o hardware não conhece",
      era: "Arquitetura de computadores",
      problem: "Repetir uma ação mil vezes sem escrever mil linhas.",
      constraint: "A CPU só executa uma instrução por vez; não existe 'repeat' na silícia.",
      construction: "Um laço é composto por atualização, comparação e desvio condicional. O compilador transforma `for` em `add`, `cmp`, `jne`; a flag ZF registra se a subtração produziu zero.",
      proof: "Com RAX = 3: decrementar e comparar gera ZF=1 apenas quando o contador chega a zero; o desvio volta ao início enquanto ZF=0.",
      consequence: "Laços infinitos são falsas premissas sobre a condição de parada; entender as flags é entender o controle de fluxo.",
      formula: "for(i=n;i>0;i--) ≡ LOOP: dec i; cmp i,0; jne LOOP",
      layers: ["Repetir tarefas domésticas", "Programas longos e caros", "Converter repetição em desvio", "Ciclo busca–decodifica–executa", "Depurar loops com step-by-step no sim-cpu"],
      code: "loop:\n  sub rax, 1\n  cmp rax, 0\n  jne loop"
    },
    {
      id: "corda-12-nos",
      title: "Autópsia 4.1 — A corda de 12 nós e o ângulo de 90°",
      era: "Egito Antigo · agrimensura",
      problem: "Refazer os limites dos campos depois que o Nilo alagava a terra.",
      constraint: "Sem teodolito: só corda, nós e estacas.",
      construction: "12 nós igualmente espaçados formam segmentos 3, 4 e 5. Como 3² + 4² = 5², o triângulo é retângulo pelo recíproco de Pitágoras.",
      proof: "O ângulo entre os lados 3 e 4 é reto porque o lado oposto satisfaz a igualdade de Pitágoras; a recíproca é verificável por construção.",
      consequence: "Geometria nasce como tecnologia de medição; a prova vem depois da necessidade prática.",
      formula: "3² + 4² = 9 + 16 = 25 = 5²",
      layers: ["Esticar uma corda", "Demarcar terras após cheia", "Dividir em 12 intervalos e fechar 3-4-5", "Triângulo com lado 5 como hipotenusa", "Teorema de Pitágoras e sua recíproca"],
      code: "# Verificação numérica da corda 3-4-5\na, b, c = 3, 4, 5\nassert a*a + b*b == c*c\nprint('ângulo reto garantido')"
    },
    {
      id: "triangulo-180",
      title: "Autópsia 4.2 — Por que os ângulos de um triângulo somam 180°",
      era: "Euclides · geometria plana",
      problem: "Prever o ângulo restante sem medir todos os lados.",
      constraint: "A demonstração só pode usar postulados e teoremas já provados.",
      construction: "Trace uma reta paralela à base pelo vértice oposto. Os ângulos alternos internos reproduzem os ângulos da base na reta superior; os três ângulos formam um ângulo raso.",
      proof: "Paralelismo garante igualdade dos ângulos alternos; um ângulo raso mede 180° por definição.",
      consequence: "Em geometria esférica a soma passa de 180°: o resultado depende do postulado das paralelas, não do desenho.",
      formula: "α + β + γ = 180° (plano euclidiano)",
      layers: ["Medir um triângulo de papel", "Precisar prever sem medir", "Traçar paralela pelo vértice", "Reta com α, β, γ adjacentes", "Generalizar para geometrias não euclidianas"],
      code: "alpha, beta = 50, 60\ngamma = 180 - alpha - beta\nassert alpha + beta + gamma == 180"
    },
    {
      id: "pitagoras-rearranjo",
      title: "Autópsia 4.3 — Pitágoras por reorganização de áreas",
      era: "Zhoubi Suanjing · Bhaskara",
      problem: "Justificar a relação entre os lados de um triângulo retângulo sem medir ângulos.",
      constraint: "Usar apenas conservação de área e congruência.",
      construction: "Coloque quatro cópias do triângulo dentro de um quadrado de lado (a + b). O buraco central tem lado c; rearrangedo as mesmas peças, o buraco vira dois quadrados a² e b².",
      proof: "A área total não muda ao rearranjar. Logo (a+b)² − 4·ab/2 = c² = a² + b².",
      consequence: "Uma prova visual é uma prova: a invariância da área é mais forte que a aparência do desenho.",
      formula: "(a + b)² − 2ab = a² + b² = c²",
      layers: ["Montar quatro triângulos com papel", "Comparar áreas de figuras", "Dispor peças em dois arranjos", "Quadrado c² vs quadrados a² + b²", "Distância euclidiana e normas em vetores"],
      code: "a, b = 3, 4\nc2 = (a + b)**2 - 2*a*b\nassert c2 == a*a + b*b"
    },
    {
      id: "eratostenes-terra",
      title: "Autópsia 4.4 — Eratóstenes mede a Terra",
      era: "Alexandria e Siena · solstício",
      problem: "Medir uma esfera enorme sem viajar ao redor dela.",
      constraint: "Um único instrumento: a sombra de um gnomon ao meio-dia do solstício.",
      construction: "Em Siena o Sol incide verticalmente; em Alexandria a sombra marca 7,2°, ou 1/50 de um círculo. A distância entre as cidades era conhecida por medição de caravanas.",
      proof: "Raios solares são paralelos; o ângulo central entre as cidades é o mesmo ângulo da sombra. Circunferência = 50 × distância.",
      consequence: "A astronomia virou geodesia: uma sombra local revelou uma grandeza global.",
      formula: "C ≈ 50 × d ≈ 50 × 5.000 estádios",
      layers: ["Observar sombras no meio-dia", "Medir terras e rotas comerciais", "Relacionar ângulo e arco", "Dois gnomons e raios paralelos", "Trigonometria e erro de medição"],
      code: "angulo_graus = 7.2\ndistancia_km = 800\ncircunferencia = 360 / angulo_graus * distancia_km\nprint(round(circunferencia), 'km')"
    },
    {
      id: "euclides-primos",
      title: "Autópsia 4.5 — Euclides e a infinitude dos primos",
      era: "Elementos · Livro IX",
      problem: "Decidir se a lista de números primos termina.",
      constraint: "Só são permitidos divisibilidade e contradição lógica.",
      construction: "Suponha uma lista completa p₁…pₙ. Construa N = p₁p₂…pₙ + 1. Nenhum pᵢ divide N, pois divide o produto e deixaria resto 1.",
      proof: "Todo inteiro > 1 tem um divisor primo. Esse primo não está na lista: contradição. Logo a lista é infinita.",
      consequence: "O argumento não dá o próximo primo, mas garante que sempre existe um — e inspirou criptografia de chave pública.",
      formula: "N = ∏pᵢ + 1 ⇒ ∃ primo q ∉ {pᵢ}",
      layers: ["Fatorar números pequenos", "Perguntar se a lista acaba", "Multiplicar todos e somar 1", "Contradição por divisibilidade", "RSA e dificuldade da fatoração"],
      code: "primos = [2, 3, 5, 7]\nproduto = 1\nfor p in primos:\n    produto *= p\nN = produto + 1  # 211, primo e ausente da lista\nprint(N)"
    },
    {
      id: "al-khwarizmi-quadrado",
      title: "Autópsia 4.6 — Al-Khwarizmi completa o quadrado",
      era: "Bagdá · álgebra",
      problem: "Resolver equações quadráticas com um método geral, não casos isolados.",
      constraint: "Geometricamente, áreas precisam fechar um quadrado perfeito.",
      construction: "De x² + bx = c, some (b/2)² aos dois lados: (x + b/2)² = c + (b/2)². A raiz surge da área completa.",
      proof: "A identidade (x + b/2)² = x² + bx + b²/4 é verificável por expansão; a igualdade preserva as soluções.",
      consequence: "O algoritmo virou disciplina; a palavra 'álgebra' vem do título do tratado, e 'algoritmo' do nome do autor.",
      formula: "x = −b/2 ± √(c + b²/4) para x² + bx = c",
      layers: ["Dividir uma herança ou terra", "Equações diferentes pediam um método", "Acrescentar o quadrado faltante", "Figura geométrica com área c + (b/2)²", "Fórmula geral e discriminante"],
      code: "from math import sqrt\nb, c = 6.0, 16.0\nx1 = -b/2 + sqrt(c + (b/2)**2)\nx2 = -b/2 - sqrt(c + (b/2)**2)\nprint(x1, x2)  # 2.0 e -8.0"
    },
    {
      id: "newton-leibniz-calculo",
      title: "Autópsia 4.7 — Newton e Leibniz: o cálculo como linguagem do infinito",
      era: "Século XVII · física e notação",
      problem: "Calcular velocidade instantânea e área sob curvas arbitrárias.",
      constraint: "O infinito não podia ser tratado como número comum.",
      construction: "A derivada é o limite das razões incrementais; a integral é o limite de somas de retângulos. O teorema fundamental liga as duas operações.",
      proof: "Se F(x) = ∫ₐˣ f(t)dt e f é contínua, então F′(x) = f(x); a área acumulada muda exatamente pela altura da função.",
      consequence: "A notação de Leibniz sobreviveu porque torna a cadeia de derivação visível; o cálculo é a linguagem da mudança.",
      formula: "f′(x) = limₕ→0 [f(x+h) − f(x)]/h · ∫ₐᵇ f = F(b) − F(a)",
      layers: ["Medir velocidade de um carro em um instante", "Trajetórias planetárias e áreas", "Limites de razões e somas", "Reta tangente e retângulos sob a curva", "ε–δ, TFC e integrais múltiplas"],
      code: "def derivada(f, x, h=1e-5):\n    return (f(x + h) - f(x)) / h\n\nprint(derivada(lambda t: t*t, 3))  # ≈ 6"
    },
    {
      id: "napier-logaritmos",
      title: "Autópsia 4.8 — Napier transforma multiplicação em soma",
      era: "Escócia · cálculo astronômico",
      problem: "Multiplicar números enormes em navegação e astronomia com precisão manual.",
      constraint: "Tabelas e lápis; sem calculadora.",
      construction: "Defina log como uma função que converte produto em soma: log(ab) = log a + log b. A base fixa a escala.",
      proof: "Se a = bˣ e c = bʸ, então ac = bˣ⁺ʸ; aplicando log dos dois lados obtemos a propriedade.",
      consequence: "A régua de cálculo e as tabelas dominaram por séculos; hoje a mesma identidade aparece em entropia e complexidade.",
      formula: "log_b(ac) = log_b a + log_b c · log_b(aⁿ) = n log_b a",
      layers: ["Multiplicar tabelas astronômicas", "Erro humano em contas longas", "Mapear produto para soma", "Tabela de logaritmos e régua", "Entropia de Shannon: −Σ p log p"],
      code: "from math import log\nprint(log(8, 2) + log(4, 2) == log(32, 2))"
    },
    {
      id: "boole-shannon",
      title: "Autópsia 4.9 — Boole e Shannon: a álgebra do pensamento virou circuito",
      era: "Século XIX/XX · lógica e telefonia",
      problem: "Representar raciocínio com símbolos e, depois, com relés elétricos.",
      constraint: "Afirmações só podem ser verdadeiras ou falsas.",
      construction: "Variáveis binárias e operadores AND/OR/NOT formam uma álgebra; Shannon mostrou que relés implementam essas operações com corrente ligada/desligada.",
      proof: "As tabelas verdade da álgebra coincidem com o comportamento dos relés; a correspondência é estrutural, não analógica.",
      consequence: "Todo processador moderno é uma álgebra de Boole executada em silício — de donde vem o meio-somador da Autópsia 1.",
      formula: "A ∧ (B ∨ C) = (A ∧ B) ∨ (A ∧ C) · ¬(A ∧ B) = ¬A ∨ ¬B",
      layers: ["Decisões sim/não no dia a dia", "Formalizar silogismos", "Leis de De Morgan e distributividade", "Portas lógicas com relés/transistores", "Síntese de circuitos e verificadores"],
      code: "A, B = 1, 0\nprint((A and not B) == (not (not A or B)))  # De Morgan"
    },
    {
      id: "gauss-euler-modular",
      title: "Autópsia 4.10 — Gauss, Euler e a aritmética modular que protege a internet",
      era: "Disquisitions Arithmeticae → RSA/TLS",
      problem: "Prever padrões de divisibilidade e construir operações fáceis de fazer, difíceis de inverter.",
      constraint: "Congruências devem respeitar a estrutura de anel dos inteiros módulo n.",
      construction: "a ≡ b (mod n) quando n | (a−b). As operações herdam a estrutura; o teorema de Euler diz a^φ(n) ≡ 1 (mod n) se gcd(a,n)=1.",
      proof: "A congruência é uma relação de equivalência compatível com + e ×; daí o teorema de Euler e o caso particular de Fermat.",
      consequence: "RSA escolhe expoentes públicos e privados inversos módulo φ(n); a segurança depende da fatoração difícil, não de segredo no algoritmo.",
      formula: "a^φ(n) ≡ 1 (mod n) · c = m^e mod n · m = c^d mod n",
      layers: ["Relógio e dias da semana", "Códigos e cifras antigas", "Anel Z/nZ e inverso modular", "Congruências com relógio circular", "RSA, assinaturas e TLS 1.3"],
      code: "def inv_mod(a, m):\n    return pow(a, -1, m)  # Python 3.8+\n\ne, phi = 65537, 3120\nd = inv_mod(e, phi)\nprint(e * d % phi)  # 1"
    }
  ];

  const MAP = [
    { id: "M1", title: "Peano e Aritmética", tracks: ["mathfund"], topics: ["Sucessor e indução", "Adição e multiplicação recursivas", "Primos e divisibilidade"], prereq: null },
    { id: "M2", title: "Álgebra e Geometria", tracks: ["math"], topics: ["Equações e desigualdades", "Geometria plana", "Áreas e Pitágoras"], prereq: "M1" },
    { id: "M3", title: "Funções e Trigonometria", tracks: ["math"], topics: ["Domínio, imagem e composição", "Ciclo unitário", "Logaritmos e exponenciais"], prereq: "M2" },
    { id: "M4", title: "Discreta e Álgebra Linear", tracks: ["math"], topics: ["Indução finita e combinatória", "Matrizes e determinantes", "Autovalores"], prereq: "M3" },
    { id: "M5", title: "Probabilidade", tracks: ["math"], topics: ["Espaço amostral", "Probabilidade condicional e Bayes", "Variáveis aleatórias"], prereq: "M4" },
    { id: "M6", title: "Cálculo (por último)", tracks: ["math"], topics: ["Limites ε–δ", "Derivadas e aplicações", "Integrais e TFC"], prereq: "M5" }
  ];

  const COMPUTING = [
    { id: "C1", title: "Linux e C básico", topics: ["Shell, processos e arquivos", "Tipos, controle de fluxo e funções", "Compilação e depuração"], prereq: null },
    { id: "C2", title: "Memória e ponteiros", topics: ["Modelo de memória", "Ponteiros, arrays e strings", "Alocação e UAF"], prereq: "C1" },
    { id: "C3", title: "Estruturas e algoritmos", topics: ["Listas, árvores e hash", "Ordenação e busca", "Complexidade"], prereq: "C2" },
    { id: "C4", title: "Arquitetura e Assembly", topics: ["Portas lógicas e MOSFETs", "x86-64, ARM64 e RISC-V", "Syscalls e IEEE 754"], prereq: "C3" },
    { id: "C5", title: "Redes e cripto", topics: ["TCP/IP e sockets POSIX", "CIDR e VLSM", "CSPRNG, Argon2id, AEAD, TLS"], prereq: "C4" },
    { id: "C6", title: "Engenharia de software e IA", topics: ["SOLID, testes e ACID", "Modelos e inferência", "Tensor Engine em C17"], prereq: "C5" }
  ];

  const PROTOCOL = [
    { n: 1, title: "Inspeção estrutural", minutes: 10, desc: "Título, sumário, teoremas, notação e pré-requisitos. Não leia o corpo ainda: monte o mapa." },
    { n: 2, title: "Leitura em blocos", minutes: 25, desc: "Blocos de 15–25 min com livro fechado ao fim; reconstrua a ideia antes de virar a página." },
    { n: 3, title: "Reconstrução ativa", minutes: 25, desc: "Reescreva a prova ou o código sem olhar. Compare depois e marque a lacuna exata." },
    { n: 4, title: "Exercícios escalonados + caderno de erros", minutes: 30, desc: "E1 conceito, E2 procedimento, E3 transferência, E4 diagnóstico. Todo erro vira carta SM-2." },
    { n: 5, title: "Teste de Feynman", minutes: 15, desc: "Ensine em voz alta; nota ≥ 8/10 e síntese com ≥ 30 caracteres fecham o ciclo." }
  ];

  const LEARNING_SCIENCE = [
    { key: "retrieval", name: "Prática de recuperação", evidence: "Dunlosky et al. (2013); Bjork & Bjork (2011)", practice: "Fechar o livro e reconstruir antes de reler; perguntas antes de respostas." },
    { key: "interleaving", name: "Intercalação", evidence: "Rohrer & Taylor (2007)", practice: "Misturar problemas de tópicos diferentes na mesma sessão." },
    { key: "deliberate", name: "Prática deliberada", evidence: "Ericsson et al. (1993)", practice: "Trabalhar exatamente no ponto de falha, com feedback imediato." },
    { key: "cognitiveLoad", name: "Carga cognitiva", evidence: "Sweller (1988)", practice: "Exemplo worked antes do problema; diagrams antes da notação densa." },
    { key: "sleepHygiene", name: "Sono e consolidação", evidence: "Walker & van der Helm (2009)", practice: "Revisar antes de dormir; não substituir sono por horas extras." },
    { key: "implementationIntentions", name: "Anti-procrastinação", evidence: "Gollwitzer (1999)", practice: "Plano 'se–então': se forem 19h, então abro a aula e estudo 25 min." }
  ];

  window.FORGE7_CONTENT = {
    didacticSteps: DIDACTIC_STEPS,
    autopsies: AUTOPSIES,
    map: MAP,
    computing: COMPUTING,
    protocol: PROTOCOL,
    learningScience: LEARNING_SCIENCE
  };
})();

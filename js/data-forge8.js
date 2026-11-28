/* ============================================================
   FORGE 8.0 — conteúdo didático no padrão "Universo Narrado".
   12 regras obrigatórias por aula. Nada é carregado da rede.
   ============================================================ */

(function () {
  "use strict";

  const RULES = [
    "Problema real em primeiro lugar",
    "Construção progressiva em camadas",
    "Fundamentação de toda regra",
    "Redução até a camada base",
    "Analogias com limites explícitos",
    "Exemplo concreto antes da generalização",
    "Exposição sugestiva de erros comuns",
    "Tom direto e humano",
    "Blocos com checagem ativa",
    "Explicação alternativa sob demanda",
    "Teste de síntese Feynman",
    "Resumo em 3 frases e elo de conexão"
  ];

  const LESSONS = {
    "pointers": {
      id: "pointers",
      track: "Ciência da Computação",
      module: "Memória & Ponteiros",
      title: "Por que ponteiros existem e como a CPU lê a RAM",
      kicker: "Ciência da Computação · Módulo 2 · Aula 1",
      hook: "Imagine que você precisa passar um livro de 1.000 páginas para um colega ler uma única frase na página 450. O que é mais eficiente: tirar xerox de todas as páginas e entregar o calhamaço, ou dar um papel dizendo «Abra o livro da prateleira na página 450»?\n\nNa memória do computador acontece o mesmo. Se você passa uma estrutura grande para uma função sem ponteiro, a CPU copia byte por byte de toda a informação. Milhões de cópias por segundo travam o sistema.",
      intuition: "Um ponteiro é esse pedaço de papel: guarda o endereço onde o dado real está, não o dado. Assim você entrega uma referência curta em vez de uma cópia gigante.",
      limit: "Esta analogia é útil para entender referência, mas falha em Y porque Z: o papel físico pode ser rasgado sem alterar o livro; na RAM, mudar o valor no endereço apontado muda o dado original na hora, porque ponteiro e variável acessam o mesmo circuito físico.",
      layers: [
        "A RAM é uma sequência de gavetas numeradas; o número da gaveta é o endereço.",
        "Se a gaveta 0x7FF guarda 42, dizemos que o valor no endereço 0x7FF é 42.",
        "Uma variável comum guarda o valor. Uma variável ponteiro guarda o número da gaveta."
      ],
      ruleWhy: "Sem endereço, toda chamada de função precisaria copiar os dados. A cópia custa tempo e memória; pior, uma alteração na cópia não apareceria no original. O ponteiro existe para preservar uma única fonte da verdade.",
      physical: "Quando a CPU executa MOV EAX, [EBX], acontece o seguinte:\n\n  +---------------+   Barramento de endereço (bits de voltagem)   +---------------+\n  |               | ===========================================> |               |\n  |  Processador  |                                              |   Memória RAM |\n  |     (CPU)     | <=========================================== |   (pente RAM) |\n  +---------------+   Barramento de dados (bits lidos)           +---------------+\n\n1. A CPU coloca o valor de EBX (o endereço) nos pinos do barramento de endereço.\n2. Os pinos aplicam pulsos de voltagem (1,2 V para 1; 0 V para 0) aos multiplexadores.\n3. Os transistores da RAM ativam linha e coluna e liberam a carga dos microcapacitores.\n4. Essa carga volta pelo barramento de dados e é gravada em EAX.",
      example: "#include <stdio.h>\n\nint main(void) {\n    int valor = 42;\n    int *ponteiro = &valor;  // & pega o ENDEREÇO da gaveta\n\n    printf(\"Valor original: %d\\n\", valor);\n    printf(\"Endereco na RAM: %p\\n\", (void *)ponteiro);\n\n    *ponteiro = 99;          // desreferenciação: vai até o endereço\n    printf(\"Novo valor: %d\\n\", valor);  // imprime 99\n    return 0;\n}",
      traps: [
        "Confundir * na declaração com * no uso: em int *p o asterisco diz «esta variável guarda um endereço»; em *p = 10 ele diz «vá até o endereço e mude o conteúdo».",
        "Ponteiro selvagem (UAF): apontar para memória já liberada. A CPU tenta ler um circuito que agora pertence a outro programa e o sistema responde com Segmentation Fault.",
        "Acha que mudar p muda valor: p guarda o endereço; *p acessa o conteúdo. Sonhar com o mapa não é mudar a cidade."
      ],
      realWorld: [
        "Sistemas operacionais: o kernel do Linux usa ponteiros para gerenciar dispositivos e processos sem duplicar dados na RAM.",
        "Motores de jogos: quadros a 60 FPS exigem manipulação direta da memória de vídeo (VRAM) via DirectX ou Vulkan.",
        "Bancos de dados: índices apontam para registros, evitando varreduras completas."
      ],
      checks: [
        {
          q: "Se x ocupa o endereço 0x1000 e contém 5, o que acontece ao executar int *p = &x; e depois *p = *p + 2;?",
          options: [
            "O endereço 0x1000 passa a ser 0x1002.",
            "A variável x passa a conter o valor 7.",
            "O ponteiro p passa a apontar para o endereço 7."
          ],
          correct: 1,
          hints: [
            "Pense na diferença entre o número da gaveta e o valor dentro dela.",
            "*p lê o valor dentro da gaveta; a soma muda o valor, não o endereço.",
            "5 + 2 = 7, gravado na mesma gaveta 0x1000."
          ]
        },
        {
          q: "Por que a leitura de um ponteiro inválido causa Segmentation Fault?",
          options: [
            "Porque o compilador apaga o ponteiro após o primeiro uso.",
            "Porque o sistema operacional protege páginas de memória e barra acesso que não pertence ao processo.",
            "Porque a CPU converte o endereço em zero automaticamente."
          ],
          correct: 1,
          hints: [
            "A memória não é um espaço sem dono: ela é dividida em páginas.",
            "Cada processo recebe páginas autorizadas; o hardware verifica isso.",
            "A MMU barra acessos fora das páginas do processo."
          ]
        }
      ],
      alternative: {
        intro: "Não entendi — explique de outro jeito: pense no controle remoto da televisão.",
        text: "A TV é a memória: ela guarda o filme. O controle remoto é o ponteiro: ele não contém o filme, apenas o endereço (o canal) que a TV deve sintonizar. Apertar um botão no controle muda o que a TV mostra, do mesmo modo que escrever via *p muda o valor na RAM. Diferença importante: o controle sem pilha não funciona, e um ponteiro sem endereço válido também não.",
        diagram: "controle (p) --endereço--> [ TV / RAM ] --conteúdo--> o que aparece na tela"
      },
      feynman: {
        prompt: "Explique com suas próprias palavras: qual é a diferença entre modificar o valor de uma variável diretamente e modificá-la usando um ponteiro?",
        keywords: ["endereço", "valor", "ponteiro", "memória"],
        minChars: 30
      },
      summary: [
        "Ponteiros são variáveis que guardam o endereço de outros dados na RAM.",
        "Usar ponteiros evita cópias desnecessárias e permite alterar o dado original.",
        "Dominar essa referência é o que torna possíveis estruturas de dados e gerenciamento de memória."
      ],
      connection: "Próximo tema → Alocação dinâmica de memória (malloc e free): quem decide em qual gaveta o dado vai morar?"
    },
    "one-plus-one": {
      id: "one-plus-one",
      track: "Matemática Básica",
      module: "Lógica & Peano",
      title: "Por que 1 + 1 = 2 e como contamos",
      kicker: "Matemática Básica · Módulo 1 · Aula 1",
      hook: "Você já usou «dois» a vida inteira. Mas como ter certeza de que 1 + 1 não é uma convenção escolhida à sorte? Para contar sem dedos e sem intuição, precisamos construir os números a partir de uma regra verificável.",
      intuition: "Comece com o zero e um mecanismo chamado sucessor: toda vez que você aplica o sucessor, avança uma posição. O número é o quanto você avançou.",
      limit: "Esta analogia é útil para entender contagem, mas falha em Y porque Z: uma fila de pessoas acaba; os números nunca acabam, pois o sucessor sempre pode ser aplicado mais uma vez.",
      layers: [
        "Peano define 0 e a operação S(n), o sucessor de n.",
        "Definimos 1 = S(0) e 2 = S(S(0)).",
        "A adição é recursão: a + 0 = a e a + S(b) = S(a + b)."
      ],
      ruleWhy: "Sem a regra da recursão, a adição dependeria de enumerar todos os casos possíveis — infinitos. A recursão reduz qualquer soma a passos já definidos.",
      physical: "No hardware, o meio-somador recebe os bits A e B. A soma é S = A ⊕ B (OU exclusivo) e o vai-um é C = A ∧ B (E lógico). Com A = 1 e B = 1, S = 0 e C = 1: o resultado é 10₂, que é dois em binário.\n\n  A ──┬──[ XOR ]── S\n  B ──┘\n  A ──┬──[ AND ]── C\n  B ──┘",
      example: "a = 1 = S(0)\nb = 1 = S(0)\n1 + 1 = 1 + S(0) = S(1 + 0) = S(1) = S(S(0)) = 2\n\nEm C:\nint half_adder(int a, int b) {\n  int sum = a ^ b;\n  int carry = a & b;\n  return (carry << 1) | sum;\n}",
      traps: [
        "Achar que 1 + 1 é definição: é consequência da definição de sucessor e de adição.",
        "Confundir o símbolo 2 com a quantidade: o símbolo é o nome; a quantidade é S(S(0)).",
        "Esquecer o vai-um no hardware: 1 ⊕ 1 é 0, mas o carry 1 é o que completa o dois."
      ],
      realWorld: [
        "Contabilidade: somar quantias exige um sistema fechado e verificável.",
        "Eletrônica digital: cada soma vira portas lógicas e transistores.",
        "Criptografia: operações modulares herdadas dessa aritmética protegem a internet."
      ],
      checks: [
        {
          q: "Por que 1 + S(0) = S(1 + 0)?",
          options: [
            "Porque a adição foi definida recursivamente no segundo argumento.",
            "Porque S(0) é o mesmo que 0.",
            "Porque a ordem dos números pode ser escolhida livremente."
          ],
          correct: 0,
          hints: ["Olhe a segunda regra da adição.", "a + S(b) = S(a + b).", "Aqui a = 1 e b = 0."]
        },
        {
          q: "No meio-somador, o que acontece com A = B = 1?",
          options: ["S = 1 e C = 0", "S = 0 e C = 1", "S = 0 e C = 0"],
          correct: 1,
          hints: ["Aplica XOR e AND.", "1 XOR 1 = 0; 1 AND 1 = 1.", "O vai-um é o bit à esquerda: 10₂."]
        }
      ],
      alternative: {
        intro: "Não entendi — explique de outro jeito: use degraus de uma escada.",
        text: "O zero é o chão. Cada degrau é o sucessor. O número um é o primeiro degrau; o número dois é o segundo. Somar um é dar um passo para cima. Começando no primeiro degrau e dando um passo, você chega ao segundo — por isso 1 + 1 = 2.",
        diagram: "chão(0) → degrau(1) → degrau(2) → degrau(3) → ..."
      },
      feynman: {
        prompt: "Explique com suas próprias palavras por que 1 + 1 = 2 sem usar dedos nem exemplos com maçãs.",
        keywords: ["sucessor", "zero", "recursão", "dois"],
        minChars: 30
      },
      summary: [
        "Os números naturais são construídos a partir do zero e do sucessor.",
        "A adição é uma recursão: somar um é aplicar o sucessor.",
        "No hardware, a mesma ideia aparece como soma e vai-um do meio-somador."
      ],
      connection: "Próximo tema → Por que a multiplicação é repetição de somas e onde isso aparece no código."
    }
  };

  window.FORGE8_LESSONS = {
    rules: RULES,
    lessons: LESSONS,
    cycle: ["Estudar aula", "Praticar em lab/quiz", "Registrar erros", "Revisar no momento exato"]
  };
})();

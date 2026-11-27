/* ============================================================
   FORGE — data-trilha10.js
   Trilha 10: Arquitetura de Computadores e Hardware
   do Silício ao Multicore — 6 módulos, 50 aulas G5.
   ============================================================ */

const T10 = ([title, problem, impasse, insight, formal, feynman, facts, opts]) =>
  G5({ title, problem, impasse, insight, formal, feynman, facts, ...(opts || {}) });

CURRICULUM.arch = {
  name: "Arquitetura de Computadores",
  icon: "🏗️",
  modules: [
    GM("Eletrônica Digital e Portas Lógicas", [
      [
        "O Semicondutor MOSFET e a Lógica Booleana",
        "Como representar 0 e 1 com voltagens reais, sem peças que se desgastam?",
        "Relés mecânicos e válvulas termiônicas aquecem, gastam energia e queimam; uma chave física por bit não escala para bilhões de transistores.",
        "Um transistor é uma chave controlada por tensão: a voltagem no gate liga ou desliga um canal de silício, sem movimento mecânico.",
        "NMOS conduz quando V_GS > V_th; PMOS conduz quando V_GS < V_th. No inversor CMOS, NMOS e PMOS são complementares: V_out = ¬V_in. A corrente estática é quase zero, pois só um deles conduz por vez.",
        "Explique, sem usar folha, por que o par complementar NMOS/PMOS gasta energia principalmente durante a transição e não quando estabiliza.",
        [["MOSFET", "Transistor de efeito de campo cuja condutividade é controlada pela tensão no gate."], ["V_th", "Tensão limiar acima da qual o canal do transistor começa a conduzir."], ["NMOS", "Transistor que conduz entre dreno e fonte quando o gate está em nível alto."], ["PMOS", "Transistor que conduz quando o gate está em nível baixo, complementando o NMOS."], ["CMOS", "Tecnologia que usa pares NMOS/PMOS complementares para implementar portas lógicas com baixo consumo estático."]],
        { tags: ["hardware", "silício"], lab: "No simulador de portas lógicas, monte um inversor e observe a tabela verdade." }
      ],
      [
        "Portas NAND e NOR como Blocos Universais",
        "Como fabricar chips baratos se cada função lógica exigisse um tipo diferente de porta?",
        "Manter linhas de produção para AND, OR, NOT, XOR e NOR separadas multiplica custo, área e estoque.",
        "Uma única porta NAND (ou NOR) pode imitar qualquer outra função booleana: basta conectá-la de formas diferentes.",
        "NOT(a) = NAND(a,a); AND(a,b) = NOT(NAND(a,b)); OR(a,b) = NAND(NOT(a),NOT(b)). Pela lei de De Morgan, NAND e NOR são funcionalmente completos.",
        "Construa uma porta AND usando apenas NAND e justifique cada passo com De Morgan.",
        [["Porta universal", "Porta lógica capaz de implementar qualquer função booleana sem usar outros tipos de porta."], ["NAND", "Porta que produz 0 apenas quando todas as entradas são 1."], ["NOR", "Porta que produz 1 apenas quando todas as entradas são 0."], ["De Morgan", "Lei que transforma ¬(A∧B) em ¬A∨¬B e ¬(A∨B) em ¬A∧¬B."], ["Completude funcional", "Propriedade de um conjunto de portas que permite expressar toda função booleana."]],
        { tags: ["hardware", "boolean" ] }
      ],
      [
        "Simplificação Booleana e Mapas de Karnaugh",
        "Como reduzir o número de portas de um circuito especificado por uma tabela verdade?",
        "A álgebra booleana pura depende de intuition e produção manual de identidades; expressions longas geram erros e silício desperdiçado.",
        "Desenhar a tabela verdade numa grade em código Gray faz com que células vizinhas difiram por um único bit, revelando agrupamentos visuais.",
        "Agrupe células 1 em blocos de tamanho 2^k (1,2,4,8...), incluindo agrupamentos na borda (wrap-around). Cada grupo gera um termo com as variáveis constantes; 'don't care' pode ser usado para ampliar grupos.",
        "Por que um grupo de 3 células não gera um termo válido no mapa de Karnaugh?",
        [["Mapa de Karnaugh", "Grade bidimensional da tabela verdade ordenada em código Gray para simplificação visual."], ["Código Gray", "Sequência binária em que elementos consecutivos diferem em exatamente um bit."], ["Implicante", "Termo booleano que cobre um conjunto de mintermos da função."], ["Don't care", "Combinação de entradas que nunca ocorre e pode ser escolhida para facilitar a simplificação."], ["Wrap-around", "Vizinhança entre a primeira e a última linha ou coluna do mapa de Karnaugh."]],
        { tags: ["hardware", "boolean"] }
      ],
      [
        "Somadores: Meio-Somador e Somador Completo",
        "Como fazer um circuito somar dois bits binários como a CPU faz?",
        "Somar 1+1 em binário produz 0 com transporte (carry); uma única porta não consegue gerar os dois resultados.",
        "Separar a função em 'soma local' (XOR) e 'transporte' (AND) permite cascatear bits e propagar o carry.",
        "Meio-somador: S = A ⊕ B, C = A·B. Somador completo: S = A ⊕ B ⊕ C_in, C_out = A·B + C_in·(A ⊕ B). Encadear 32 somadores forma um ripple-carry adder.",
        "Explique por que o atraso de um somador em cascata cresce linearmente com o número de bits.",
        [["Meio-somador", "Circuito que soma dois bits e produz soma e carry, sem entrada de transporte."], ["Somador completo", "Circuito que soma dois bits mais um carry de entrada e gera soma e carry de saída."], ["Carry", "Transporte gerado quando a soma de bits excede o valor representável em uma posição."], ["Ripple-carry", "Encadeamento de somadores completos onde o carry de um alimenta o próximo."], ["XOR", "Porta cuja saída é 1 quando as entradas diferem; usada como soma local."]],
        { tags: ["hardware", "arithmetic"] }
      ],
      [
        "Multiplexadores e Decodificadores",
        "Como rotear dinamicamente um entre vários barramentos de dados para a ULA?",
        "Ligar várias saídas elétricas no mesmo fio gera curto-circuito e valores ambíguos.",
        "Linhas de controle binárias escolhem qual fonte é conectada, usando portas de três estados ou uma árvore de seleção.",
        "Para 2^n entradas, um MUX usa n linhas de seleção: Y = Σ D_i·s_i. Um decodificador n→2^n ativa exatamente uma saída, funcionando como seletor de endereço.",
        "Descreva como um MUX de 8 entradas implementa uma função booleana de 3 variáveis.",
        [["Multiplexador", "Circuito que seleciona uma entre várias entradas usando linhas de controle."], ["Decodificador", "Circuito que converte um código de n bits em uma among 2^n saídas ativadas."], ["Linha de seleção", "Sinal de controle que escolhe qual entrada do MUX chega à saída."], ["Três estados", "Saída que pode ser 0, 1 ou alta impedância, permitindo compartilhar barramento."], ["Demultiplexador", "Circuito que envia uma entrada para uma de várias saídas selecionadas."]],
        { tags: ["hardware", "barramento"] }
      ],
      [
        "Elementos de Memória: Flip-Flops SR, D, JK e T",
        "Como um circuito combinacional pode guardar um bit entre dois ciclos?",
        "Realimentar diretamente a saída de portas lógicas gera oscilação ou estado instável.",
        "Introduzir um relógio (clock) e capturar o valor apenas na borda congela o estado por um ciclo inteiro.",
        "Flip-flop D copia D na borda do clock; SR tem entradas set/reset; JK elimina o estado proibido do SR; T inverte o estado quando T=1. Setup time e hold time definem a janela válida em torno da borda.",
        "O que é metastabilidade e por que violar o tempo de setup pode causá-la?",
        [["Flip-flop", "Elemento de memória de 1 bit que muda de estado apenas em uma borda de clock."], ["Latch", "Elemento de memória sensível a nível, não a borda do clock."], ["Borda de clock", "Transição de 0→1 ou 1→0 que dispara a captura do dado."], ["Setup time", "Tempo mínimo que o dado deve estar estável antes da borda do clock."], ["Hold time", "Tempo mínimo que o dado deve permanecer estável após a borda do clock."]],
        { tags: ["hardware", "memória"] }
      ],
      [
        "Distribuição de Clock e Clock Skew",
        "Por que dois registradores que recebem o mesmo sinal de clock podem capturar dados em instantes diferentes?",
        "O fio de clock tem resistência e capacitância; caminhos mais longos atrasam a borda em relação aos demais.",
        "Árvores de clock balanceadas e buffers compensam atrasos para que todos os registradores vejam a borda quase simultaneamente.",
        "Clock skew = t_clock(destino) − t_clock(origem). Skew positivo ajuda o caminho de setup, mas reduz a margem de hold: t_hold ≤ t_clk−Q + t_comb − skew.",
        "Explique por que aumentar o skew pode melhorar setup e ao mesmo tempo quebrar hold.",
        [["Clock skew", "Diferença de chegada da borda de clock entre registradores."], ["Árvore de clock", "Rede de distribuição com caminhos balanceados para minimizar atrasos."], ["Setup slack", "Margem entre o tempo de chegada do dado e o limite de setup."], ["Hold slack", "Margem entre a mudança do dado e a exigência de hold."], ["Buffer de clock", "Circuito que reforça o sinal de clock para reduzir atraso e inclinação."]],
        { tags: ["hardware", "timing"] }
      ],
      [
        "Reset Síncrono versus Reset Assíncrono",
        "Como colocar um processador em estado conhecido após ligar a energia?",
        "Sem reset, registradores iniciam com valores aleatórios e o firmware não sabe em que ponto do código está.",
        "Um sinal de reset dedicado força todos os flip-flops a um valor inicial antes da primeira instrução útil.",
        "Reset assíncrono atua imediatamente, independente do clock; reset síncrono só é capturado na borda. Síncrono evita problemas de reconversão (recovery/removal), mas exige que o clock esteja estável.",
        "Por que um reset assíncrono liberado perto da borda do clock pode deixar o circuito metastável?",
        [["Reset", "Sinal que leva registradores a um estado inicial conhecido."], ["Reset assíncrono", "Reset que atua independentemente do sinal de clock."], ["Reset síncrono", "Reset avaliado apenas na borda ativa do clock."], ["Recovery time", "Tempo mínimo entre a liberação do reset e a próxima borda de clock."], ["Metastabilidade", "Estado intermediário instável de um flip-flop quando requisitos de tempo são violados."]],
        { tags: ["hardware", "timing"] }
      ],
      [
        "Máquinas de Estado Finito: Moore e Mealy",
        "Como descrever um controlador que reage a eventos em sequência?",
        "Portas lógicas isoladas não guardam histórico, mas um protocolo como 'detectei três uns seguidos' depende do passado.",
        "Modelar o comportamento como estados com transições transforma sequência em lógica implementável com flip-flops.",
        "Em Moore, a saída depende só do estado atual: S = f(Q). Em Mealy, depende de estado e entrada: S = f(Q,X). O estado seguinte é Q⁺ = δ(Q,X).",
        "Dê um exemplo em que uma FSM Mealy responde um ciclo antes da versão Moore equivalente.",
        [["FSM", "Modelo computacional com estados finitos e transições controladas por entradas."], ["Moore", "FSM cuja saída depende apenas do estado atual."], ["Mealy", "FSM cuja saída depende do estado e da entrada atual."], ["Estado seguinte", "Função δ que determina o estado após a transição."], ["Codificação de estado", "Atribuição de padrões binários aos estados lógicos da máquina."]],
        { tags: ["hardware", "controle"] }
      ]
    ]),
    GM("Representação de Dados e Aritmética", [
      [
        "Sistemas de Numeração: Binário, Octal e Hexadecimal",
        "Como ler e escrever cadeias longas de bits sem cometer erros?",
        "Binário de 32 ou 64 bits é ilegal para humanos; converter direto para decimal exige muitas multiplicações.",
        "Agrupar bits em potências de 2 (3 para octal, 4 para hexadecimal) cria uma notação compacta e reversível.",
        "Um número em base b é Σ d_i·b^i. Como 8=2³ e 16=2⁴, cada dígito octal substitui 3 bits e cada hexadecimal substitui 4 bits.",
        "Converta 0xD6 para binário e explique por que a conversão é uma substituição direta de grupos de 4 bits.",
        [["Base 2", "Sistema posicional que usa os dígitos 0 e 1."], ["Base 16", "Sistema posicional com dezesseis símbolos, 0-9 e A-F."], ["Nibble", "Grupo de 4 bits, equivalente a um dígito hexadecimal."], ["Peso posicional", "Valor b^i associado à posição i de um algarismo."], ["Byte", "Grupo de 8 bits, representado por dois dígitos hexadecimais."]],
        { tags: ["dados", "bases"] }
      ],
      [
        "Inteiros Negativos: Complemento de 2",
        "Como representar um saldo negativo usando apenas bits?",
        "Sinal-e-magnitude gera dois zeros (+0 e −0) e exige circuitos diferentes para somar e subtrair.",
        "Definir o bit mais significativo com peso negativo (−2^(n−1)) faz com que a mesma soma binária funcione para positivos e negativos.",
        "Para n bits, valor = −b_{n−1}·2^(n−1) + Σ_{i=0}^{n−2} b_i·2^i. O negado de x é ¬x + 1; a faixa vai de −2^(n−1) a 2^(n−1)−1.",
        "Demonstre por que, em 8 bits, 5 + (−5) resulta em 0 com carry descartado.",
        [["Complemento de 2", "Representação de inteiros com bit de sinal de peso negativo."], ["Bit de sinal", "Bit mais significativo que indica o sinal do número."], ["Faixa de representação", "Intervalo de valores que uma largura fixa de bits consegue representar."], ["Negação binária", "Operação ¬x + 1 que troca o sinal em complemento de 2."], ["Overflow", "Condição em que o resultado excede a faixa representável."]],
        { tags: ["dados", "arithmetic"] }
      ],
      [
        "Condições de Overflow em Aritmética Inteira",
        "Como detectar que uma soma estourou a capacidade do registrador?",
        "Ignorar o estouro corrompe silenciosamente saldos, índices e contadores.",
        "Comparar os sinais dos operandos e do resultado revela a inconsistência que caracteriza o overflow.",
        "Para soma: overflow ocorre se operandos têm o mesmo sinal e o resultado tem sinal diferente. Em bitwise: C_in ⊕ C_out no bit mais significativo.",
        "Em 8 bits com sinal, some 120 + 20 e explique por que o resultado vira −116.",
        [["Overflow", "Resultado fora da faixa representável pelo tipo."], ["Carry", "Transporte gerado na soma de uma posição binária."], ["Flag de overflow", "Bit de status que sinaliza estouro aritmético."], ["Flag de carry", "Bit de status que sinaliza transporte sem sinal."], ["Saturação", "Política que limita o resultado ao menor ou maior valor representável."]],
        { tags: ["dados", "arithmetic"] }
      ],
      [
        "Ponto Flutuante IEEE 754",
        "Como representar simultaneamente números gigantes e frações muito pequenas?",
        "Ponto fixo tem alcance dinâmico limitado: ou perde precisão nas casas decimais, ou estoura em valores grandes.",
        "Usar notação científica binária com expoente móvel separa precisão (mantissa) de alcance (expoente).",
        "x = (−1)^s × (1.f) × 2^(E−bias). Em binary32: 1 bit de sinal, 8 de expoente, 23 de fração, bias=127. Em binary64: 11 e 52, bias=1023.",
        "Decomponha os 32 bits de 0x40490FDB e mostre de onde vem o valor aproximado de π.",
        [["IEEE 754", "Padrão para aritmética de ponto flutuante."], ["Mantissa", "Parte do número que guarda os bits de precisão."], ["Expoente", "Parte que define a escala do número."], ["Bias", "Valor adicionado ao expoente para representar expoentes negativos."], ["Subnormal", "Número com expoente zero e fração não nula, sem o bit implícito."]],
        { tags: ["dados", "float"] }
      ],
      [
        "Imprecisão Decimal em Binário: 0,1 + 0,2",
        "Por que um programa que soma 0,1 e 0,2 pode imprimir 0,30000000000000004?",
        "Frações decimais como 1/10 não têm representação finita em base 2, então são arredondadas.",
        "Entender que o erro vem da conversão de base evita tratar o resultado como bug da CPU.",
        "0,1₁₀ = 0,0001100110011…₂. Cada arredondamento para 53 bits de mantissa introduz um erro da ordem de 1 ULP; a soma propaga esse erro.",
        "Explique por que 0,5 é exato em binário, mas 0,1 não é.",
        [["ULP", "Menor diferença representável entre dois números de ponto flutuante."], ["Erro de arredondamento", "Diferença entre o valor real e sua representação aproximada."], ["Dízima binária", "Expansão binária periódica de uma fração decimal."], ["Épsilon de máquina", "Menor número que, somado a 1, altera o resultado."], ["Comparação tolerante", "Técnica que compara floats com margem em vez de igualdade exata."]],
        { tags: ["dados", "float"] }
      ],
      [
        "Ponto Fixo e Escala Inteira",
        "Como obter aritmética decimal previsível sem ponto flutuante?",
        "Ponto flutuante tem erro variável conforme a magnitude, o que é problemático em finanças.",
        "Multiplicar valores por uma potência de 10 e trabalhar com inteiros torna o erro determinístico.",
        "Com escala 10^k, um valor decimal d vira inteiro round(d·10^k). Somas são exatas; multiplicações exigem reajuste da escala.",
        "Mostre como representar R$ 19,99 com escala 100 e por que a soma de dois valores é exata.",
        [["Ponto fixo", "Representação com número fixo de casas após a vírgula."], ["Escala", "Fator multiplicativo usado para converter decimais em inteiros."], ["Precisão decimal", "Quantidade de casas decimais preservadas pela escala."], ["Arredondamento", "Ajuste do valor para o número de casas definido pela escala."], ["Inteiro de moeda", "Centavos armazenados como inteiros para evitar erros de float."]],
        { tags: ["dados", "finanças"] }
      ],
      [
        "Endianness: Ordem dos Bytes na Memória",
        "Por que o mesmo número pode aparecer trocado ao trocar de computador?",
        "A memória é endereçada por byte, mas registradores têm vários bytes; a ordem de armazenamento é uma escolha da arquitetura.",
        "Definir uma convenção (little ou big endian) padroniza a leitura, e conversões explícitas resolvem trocas entre sistemas.",
        "Little endian guarda o byte menos significativo no menor endereço. Big endian faz o contrário. Network byte order é big endian.",
        "Escreva os bytes de 0x12345678 em memória little endian e diga o que acontece se lido como big endian.",
        [["Endianness", "Ordem em que os bytes de uma palavra são armazenados."], ["Little endian", "Byte menos significativo no menor endereço."], ["Big endian", "Byte mais significativo no menor endereço."], ["Network byte order", "Convenção big endian usada por protocolos de rede."], ["Palavra", "Conjunto de bytes tratado como unidade pelo processador."]],
        { tags: ["dados", "memória"] }
      ],
      [
        "Erro Absoluto, Relativo e Épsilon",
        "Como comparar resultados numéricos de forma honesta?",
        "Igualdade exata entre floats falha mesmo quando o cálculo está correto dentro da precisão disponível.",
        "Medir o erro em relação à magnitude do número permite definir critérios de aceitação realistas.",
        "Erro absoluto = |x̂ − x|; erro relativo = |x̂ − x|/|x|. Comparações usam |a−b| ≤ tol·max(1,|a|,|b|).",
        "Justifique por que erro relativo é mais adequado que absoluto para valores muito grandes.",
        [["Erro absoluto", "Diferença simples entre o valor aproximado e o real."], ["Erro relativo", "Erro absoluto dividido pela magnitude do valor real."], ["Épsilon de máquina", "Limite superior do erro relativo de arredondamento."], ["Tolerância", "Limiar aceitável para comparar aproximações."], ["Propagação de erro", "Acúmulo de erros de arredondamento ao longo de operações."]],
        { tags: ["dados", "numérico"] }
      ]
    ]),
    GM("Arquitetura da CPU e Ciclo de Instrução", [
      [
        "Von Neumann versus Harvard",
        "Onde o computador guarda as instruções que vai executar?",
        "Separar programa e dados em memórias distintas evita colisões, mas torna impossível um programa modificar a si mesmo.",
        "Armazenar instruções e dados na mesma memória simplifica o hardware e permite compiladores, sistemas operacionais e código dinâmico.",
        "Von Neumann: um espaço endereçável único, barramento compartilhado. Harvard: memórias e barramentos separados. Arquiteturas modernas usam Harvard modificado nos caches e Von Neumann na visão do software.",
        "Explique por que um cache de instruções separado de um cache de dados não contradiz o modelo de Von Neumann.",
        [["Von Neumann", "Modelo com instruções e dados na mesma memória."], ["Harvard", "Modelo com memórias separadas para código e dados."], ["Harvard modificado", "Caches separados com memória unificada visível ao software."], ["Barramento", "Conjunto de linhas que transporta dados, endereços e controle."], ["Código auto-modificável", "Programa que altera suas próprias instruções em memória."]],
        { tags: ["arquitetura", "modelo"] }
      ],
      [
        "Componentes Internos: ULA, UC e Registradores",
        "Quais são as peças que transformam bits em cálculo e decisão?",
        "Sem uma divisão clara de papéis, cada instrução exigiria uma máquina física diferente.",
        "Separar cálculo (ULA), controle (UC) e armazenamento temporário (registradores) permite reutilizar o mesmo hardware para qualquer programa.",
        "ULA executa operações aritméticas e lógicas; UC decodifica instruções e gera sinais de controle; registradores são memória interna de altíssima velocidade. RFLAGS guarda condições da última operação.",
        "Descreva o papel de cada bloco ao executar 'some RAX, RBX'.",
        [["ULA", "Unidade lógico-aritmética que realiza cálculos e operações bit a bit."], ["UC", "Unidade de controle que decodifica instruções e emite sinais."], ["Registrador", "Pequena memória interna do processador."], ["RFLAGS", "Registrador de status com bits de zero, sinal, carry e overflow."], ["Barramento interno", "Caminho de dados entre ULA, UC e banco de registradores."]],
        { tags: ["arquitetura", "cpu"] }
      ],
      [
        "O Ciclo Fetch-Decode-Execute",
        "Como o processador transforma um byte de memória em uma ação?",
        "Um programa é só uma sequência de bytes; sem um ritmo repetitivo, não há como garantir progresso ordenado.",
        "O ciclo de instrução repete três etapas: buscar, decodificar e executar, avançando o ponteiro de instrução.",
        "PC → buscador → IR; decodificador gera sinais; ULA/memória executa; PC avança ou recebe alvo de salto. O clock sincroniza cada etapa.",
        "Percorra o ciclo de uma instrução de salto condicional e diga quando o PC é alterado.",
        [["Fetch", "Busca da instrução apontada pelo PC na memória."], ["Decode", "Tradução dos bits da instrução em sinais de controle."], ["Execute", "Execução da operação pela ULA ou unidade de memória."], ["PC", "Registrador que aponta a próxima instrução."], ["IR", "Registrador que guarda a instrução atual em decodificação."]],
        { tags: ["arquitetura", "ciclo"] }
      ],
      [
        "CISC versus RISC",
        "Por que algumas CPUs têm milhares de instruções e outras apenas algumas centenas?",
        "Instruções complexas economizam memória, mas exigem decodificação elaborada; instruções simples exigem mais linhas de código.",
        "O compromisso entre simplicidade de hardware e densidade de código levou a duas filosofias que hoje convergiram internamente.",
        "CISC (x86): instruções variáveis, multi-ciclo, modos de endereçamento ricos. RISC (ARM, RISC-V): instruções fixas, carga-armazenamento, many registers. CPUs CISC modernas decodificam para micro-operações RISC-like.",
        "Explique por que 'RISC' não significa necessariamente 'mais rápido' em CPUs atuais.",
        [["CISC", "Conjunto de instruções complexas com instruções variáveis."], ["RISC", "Conjunto de instruções reduzidas e regulares."], ["Micro-operação", "Instrução interna simples gerada pela decodificação de uma instrução CISC."], ["Load-store", "Modelo em que só load/store acessam memória."], ["Densidade de código", "Quantidade de bytes necessários para expressar um programa."]],
        { tags: ["arquitetura", "isa"] }
      ],
      [
        "Conjunto de Instruções e Tamanho de Palavra",
        "O que define a interface entresoftware e hardware?",
        "Compiladores precisam de um contrato estável sobre registradores, instruções e largura de dados.",
        "A ISA é esse contrato;Sized de palavra define quantos bits a CPU processa por operação e quantos endereços pode representar.",
        "ISA inclui registradores visíveis, formatos de instrução, modos de endereçamento e semântica. Palavra de 64 bits permite registradores de 64 bits e espaço virtual de endereçamento muito maior que 32 bits.",
        "Diferencie ISA de microarquitetura usando x86-64 como exemplo.",
        [["ISA", "Contrato entre software e hardware que define instruções e registradores visíveis."], ["Microarquitetura", "Forma concreta de implementar uma ISA em hardware."], ["Palavra", "Unidade natural de dados processada pela CPU."], ["Formato de instrução", "Layout de bits de opcode, operandos e modificadores."], ["Compatibilidade binária", "Capacidade de executar o mesmo código em implementações diferentes."]],
        { tags: ["arquitetura", "isa"] }
      ],
      [
        "Modos de Endereçamento",
        "Como uma instrução diz onde está o dado que deve usar?",
        "Codificar apenas endereços absolitos tornaria programas enormes e impossíveis de relocar.",
        "Modos de endereçamento descrevem como calcular o endereço efetivo a partir de registradores e constantes.",
        "Imediato: dado no próprio código. Direto: endereço explícito. Indireto via registrador: [R]. Deslocamento: [R+disp]. Indexado: [base + índice·escala + disp].",
        "Calcule o endereço efetivo de [RBX + RSI*4 + 8] com RBX=0x1000 e RSI=3.",
        [["Endereço efetivo", "Endereço final de memória calculado pelo modo de endereçamento."], ["Imediato", "Operando codificado na própria instrução."], ["Deslocamento", "Constante somada ao conteúdo de um registrador."], ["Indexado", "Endereço formado por base, índice escalado e deslocamento."], ["Indireto", "Endereço obtido do conteúdo de um registrador ou memória."]],
        { tags: ["arquitetura", "isa"] }
      ],
      [
        "Interrupções e DMA",
        "Como a CPU atende um disco sem passar o tempo todo perguntando se ele terminou?",
        "Consultar dispositivos em loop (polling) desperdiça ciclos e aumenta latência.",
        "Interrupções avisam a CPU quando algo acontece; DMA transfere blocos diretos entre dispositivo e memória.",
        "Dispositivo levanta uma linha de IRQ; CPU salva contexto, executa o handler e retorna. DMA usa um controlador que copia dados sem participação da CPU, gerando uma interrupção ao concluir.",
        "Compare polling, interrupção e DMA em termos de latência e uso de CPU.",
        [["Interrupção", "Sinal assíncrono que desvia a CPU para um tratador."], ["IRQ", "Linha de solicitação de interrupção."], ["DMA", "Transferência direta entre dispositivo e memória pelo controlador."], ["Polling", "Consulta repetida ao estado de um dispositivo."], ["Tratador", "Rotina executada em resposta a uma interrupção."]],
        { tags: ["arquitetura", "sistema"] }
      ],
      [
        "Boot, Firmware e Primeira Instrução",
        "Quem define o que o processador executa imediatamente após a energia?",
        "Na energização, a memória é vazia e não há sistema operacional carregado.",
        "O hardware executa firmware gravado em memória não volátil a partir de um endereço fixo de reset.",
        "Reset vector aponta para o firmware (BIOS/UEFI), que inicializa hardware, enumera dispositivos e carrega o bootloader; este carrega o kernel.",
        "Descreva a cadeia reset vector → firmware → bootloader → kernel.",
        [["Reset vector", "Endereço fixo executado após o reset."], ["Firmware", "Software gravado em memória não volátil do hardware."], ["UEFI", "Firmware moderno que substitui a BIOS tradicional."], ["Bootloader", "Programa que carrega o sistema operacional."], ["Memória não volátil", "Memória que preserva dados sem energia."]],
        { tags: ["arquitetura", "boot"] }
      ]
    ]),
    GM("Pipeline, Hazards e Paralelismo em Nível de Instrução", [
      [
        "Pipeline Clássico de 5 Estágios",
        "Como aumentar a taxa de instruções sem deixar uma instrução esperar a anterior terminar?",
        "Executar uma instrução por vez deixa a ULA ociosa durante busca e decodificação.",
        "Dividir a execução em estágios independentes permite que várias instruções ocupem o processador ao mesmo tempo, como numa linha de montagem.",
        "Estágios IF (busca), ID (decodificação/leitura de registradores), EX (cálculo), MEM (acesso à memória), WB (escrita de volta). O throughput ideal é 1 instrução por ciclo após o enchimento.",
        "Explique por que o pipeline não reduz a latência de uma única instrução, mas aumenta o throughput.",
        [["Pipeline", "Técnica que sobrepõe a execução de várias instruções em estágios."], ["IF", "Estágio de busca da instrução."], ["ID", "Estágio de decodificação e leitura de operandos."], ["EX", "Estágio de execução aritmética ou cálculo de endereço."], ["WB", "Estágio de escrita do resultado no banco de registradores."]],
        { tags: ["pipeline", "desempenho"] }
      ],
      [
        "Data Hazards e Encaminhamento (Forwarding)",
        "O que acontece quando a próxima instrução precisa de um resultado que ainda não foi escrito?",
        "Ler o registrador antes do estágio WB devolve o valor antigo, causando cálculo errado.",
        "O resultado já existe no final do estágio EX; basta encaminhá-lo diretamente para a entrada da instrução seguinte.",
        "Dependência RAW: instrução I2 lê registrador escrito por I1. Forwarding usa o valor de EX/MEM ou MEM/WB. Quando I1 é load, é necessário um bubble (stall) de um ciclo.",
        "Por que um load-use hazard exige um ciclo de espera mesmo com forwarding?",
        [["Data hazard", "Dependência de dados que impede a execução ordenada no pipeline."], ["RAW", "Dependência de leitura após escrita."], ["Forwarding", "Encaminhamento direto do resultado para a próxima instrução."], ["Bubble", "Ciclo vazio inserido para resolver um hazard."], ["Load-use hazard", "Dependência em que a instrução seguinte usa o dado carregado da memória."]],
        { tags: ["pipeline", "hazards"] }
      ],
      [
        "Control Hazards e Predição de Desvio",
        "Como o pipeline continua buscando instruções se não sabe para onde o salto vai?",
        "Um desvio condicional só resolve no estágio EX; até lá, o processador já buscou instruções do caminho errado.",
        "Prever o resultado do desvio permite continuar buscando; se a previsão errar, descarta-se o trabalho especulativo.",
        "Preditor estático (sempre pega / nunca pega) ou dinâmico (histórico de 1 ou 2 bits, BTB). Penalidade = ciclos desperdiçados × taxa de erro.",
        "Explique por que um preditor de 2 bits é estável em loops, enquanto um de 1 bit troca de previsão a cada iteração.",
        [["Control hazard", "Incerteza sobre a próxima instrução causada por desvios."], ["Predição", "Chute do resultado de um desvio para manter o pipeline cheio."], ["BTB", "Tabela que guarda alvos de desvios já vistos."], ["Preditor de 2 bits", "Preditor que muda de estado após duas previsões erradas."], ["Flush", "Descarta de instruções buscadas especulativamente."]],
        { tags: ["pipeline", "branches"] }
      ],
      [
        "Execução Fora de Ordem e Tomasulo",
        "Como manter a ULA ocupada quando a instrução mais antiga está esperando a memória?",
        "Execução rigorosamente em ordem trava o pipeline diante de uma única dependência longa.",
        "Renomear registradores e emitir instruções prontas em ordem diferente permite esconder latências.",
        "Tomasulo usa Reservation Stations, renomeação via tags de ROB e broadcasting por Common Data Bus; o commit em ordem preserva a semântica do programa.",
        "Diferencie emissão (issue), execução e commit em uma máquina out-of-order.",
        [["Out-of-order", "Execução de instruções em ordem diferente da do programa, com commit ordenado."], ["ROB", "Reorder buffer que garante commit em ordem."], ["Renomeação", "Técnica que elimina dependências falsas (WAR/WAW)."], ["Reservation station", "Fila que guarda instruções esperando operandos."], ["Common Data Bus", "Barramento que distribui resultados prontos para todas as estações."]],
        { tags: ["pipeline", "ooo"] }
      ],
      [
        "Structural Hazards e Recursos Compartilhados",
        "O que acontece quando duas instruções querem o mesmo bloco físico no mesmo ciclo?",
        "Um único barramento de memória ou uma única porta de escrita no banco de registradores não atende duas instruções simultaneamente.",
        "Replicar recursos ou escalonar o uso elimina a contenção sem alterar o resultado do programa.",
        "Structural hazard ocorre quando o hardware não suporta a combinação de instruções no mesmo ciclo. Soluções: memórias separadas para instruções e dados, portas duplas ou stalls.",
        "Dê um exemplo de structural hazard em um pipeline que usa uma única memória para código e dados.",
        [["Structural hazard", "Conflito por recurso físico compartilhado."], ["Porta de leitura", "Acesso simultâneo permitido a um registrador."], ["Barramento único", "Caminho compartilhado que só atende uma transferência por ciclo."], ["Stall", "Interrupção temporária do fluxo do pipeline."], ["Replicação de recurso", "Duplicação de hardware para evitar contenção."]],
        { tags: ["pipeline", "hazards"] }
      ],
      [
        "Execução Especulativa e Recuperação",
        "É seguro executar código antes de saber se o desvio vai acontecer?",
        "Executar o caminho errado poderia alterar registradores e memória de forma visível.",
        "Execução especulativa é permitida se os efeitos só forem tornados visíveis após a confirmação do desvio.",
        "Instruções especulativas escrevem em buffers temporários; se a predição estiver certa, fazem commit; se errada, o ROB descarta os resultados e o estado é restaurado.",
        "Explique por que especulação melhora desempenho sem mudar o resultado observável do programa.",
        [["Especulação", "Execução antecipada de instruções cuja necessidade ainda não foi confirmada."], ["Commit", "Tornar o resultado de uma instrução permanentemente visível."], ["Rollback", "Desfazer efeitos de instruções especulativas."], ["Reorder buffer", "Estrutura que mantém resultados até a confirmação."], ["Precisão de exceção", "Garantia de que exceções aparecem como em execução em ordem."]],
        { tags: ["pipeline", "speculation"] }
      ],
      [
        "Superscalar e Paralelismo Múltiplo",
        "Como executar mais de uma instrução por ciclo sem mudar o código?",
        "Um pipeline simples limita o throughput a uma instrução por ciclo.",
        "Adicionar várias unidades funcionais e lógica de despacho permite emitir duas, quatro ou mais instruções por ciclo.",
        "Superscalar = largura de despacho w > 1. O ganho real depende de ILP (parallelismo em nível de instrução), disponibilidade de registradores e predição de desvios.",
        "Por que dobrar a largura de despacho não dobra necessariamente o desempenho?",
        [["Superscalar", "Processador capaz de emitir múltiplas instruções por ciclo."], ["ILP", "Paralelismo disponível entre instruções independentes."], ["Largura de despacho", "Número máximo de instruções emitidas por ciclo."], ["Unidade funcional", "Bloco de hardware que executa um tipo de operação."], ["Gargalo de front-end", "Limitação na busca e decodificação de instruções."]],
        { tags: ["pipeline", "desempenho"] }
      ],
      [
        "Ordenação de Memória e Barreiras",
        "Por que dois núcleos podem ver escritas na memória em ordens diferentes?",
        "Buffers de escrita, caches e especulação reordenam operações para ganhar desempenho.",
        "Barreiras de memória impõem pontos de ordenação explícitos entre operações de diferentes threads.",
        "Modelos de consistência (sequential, relaxed) definem o que é observável. mfence/lfence/sfence no x86 e dmb no ARM restringem reordenação e garantem visibilidade.",
        "Explique por que um lock sem barreira pode falhar mesmo em um processador single-core com out-of-order.",
        [["Consistência de memória", "Regras sobre a ordem em que escritas se tornam visíveis."], ["Barreira de memória", "Instrução que impede reordenação across de operações de memória."], ["Buffer de escrita", "Fila temporária de escritas aguardando conclusão."], ["Fence", "Sinônimo de barreira em arquiteturas como x86 e ARM."], ["Modelo relaxado", "Modelo que permite mais reordenação que a consistência sequencial."]],
        { tags: ["pipeline", "concorrência"] }
      ]
    ]),
    GM("Hierarquia de Memória, Caches e Memória Virtual", [
      [
        "Princípio da Localidade e Hierarquia de Memória",
        "Como oferecer memória rápida, grande e barata ao mesmo tempo?",
        "Memória rápida é cara e pequena; memória barata é lenta. Um único tipo nunca satisfaz os três requisitos.",
        "Programas acessam dados próximos no tempo e no espaço, então uma pequena memória rápida guarda o que é mais usado.",
        "Localidade temporal: o mesmo endereço tende a ser reacessado. Localidade espacial: endereços vizinhos tendem a ser acessados. Hierarquia: registradores → L1 → L2 → L3 → RAM → disco.",
        "Justifique por que percorrer um array em ordem é mais rápido que percorrer uma lista ligada aleatória.",
        [["Localidade temporal", "Tendência de reacessar o mesmo endereço em breve."], ["Localidade espacial", "Tendência de acessar endereços próximos."], ["Hierarquia de memória", "Camadas de memória com velocidade, tamanho e custo diferentes."], ["Hit rate", "Fração de acessos atendidos por uma camada."], ["Miss penalty", "Custo extra de um acesso que não foi atendido pela camada."]],
        { tags: ["memória", "cache"] }
      ],
      [
        "Mapeamento de Cache: Direto versus Associativo por Conjunto",
        "Como decidir em qual linha da cache um endereço de memória deve ser guardado?",
        "Mapeamento totalmente associativo é perfeito, mas exigiria comparar todas as linhas a cada acesso.",
        "Indexar por partes do endereço reduz o hardware; associatividade limitada permite algumas alternativas sem custo proibitivo.",
        "Endereço = tag | índice | offset. Direto: 1 linha por conjunto. Associativo por conjunto de vias k: k linhas por conjunto. Totalmente associativo: um único conjunto.",
        "Compare conflitos de cache em mapeamento direto e 2-way para dois endereços com o mesmo índice.",
        [["Cache", "Memória pequena e rápida que guarda cópias de dados frequentemente usados."], ["Mapeamento direto", "Cada endereço tem exatamente uma linha de destino."], ["Associatividade", "Número de linhas possíveis por conjunto."], ["Tag", "Parte do endereço comparada para identificar a linha."], ["Conflict miss", "Falha causada por disputa entre endereços no mesmo conjunto."]],
        { tags: ["memória", "cache"] }
      ],
      [
        "Políticas LRU e Write-Back",
        "O que fazer quando a cache está cheia e qual linha substituir?",
        "Escolher a linha errada derruba o hit rate; escrever sempre na RAM gasta largura de banda.",
        "Substituir a linha menos usada recentemente e adiar escritas para a RAM aproveita localidade temporal.",
        "LRU aproximado usa bits de referência; write-back marca a linha como dirty e só a grava ao ser substituída; write-through grava imediatamente.",
        "Explique por que write-back reduz tráfego de memória, mas complica coerência entre núcleos.",
        [["LRU", "Política que substitui a linha usada há mais tempo."], ["Write-back", "Política que grava na memória principal apenas na substituição."], ["Write-through", "Política que replica cada escrita imediatamente na memória principal."], ["Dirty bit", "Sinalizador indicando que a linha foi modificada."], ["Victim", "Linha escolhida para substituição."]],
        { tags: ["memória", "cache"] }
      ],
      [
        "False Sharing entre Núcleos",
        "Por que dois threads que mexem em variáveis diferentes podem ficar lentos?",
        "Cada núcleo mantém sua própria cache; se duas variáveis estão na mesma linha, uma escrita invalida a cópia do outro núcleo.",
        "O problema não é compartilhar dados, mas compartilhar a linha física de cache que os contém.",
        "Linhas de cache têm tipicamente 64 bytes. Separar variáveis mutáveis por padding ou alinhamento evita invalidações cruzadas.",
        "Diga como alinhar dois contadores de threads diferentes para eliminar false sharing.",
        [["False sharing", "Invalidação de cache causada por variáveis independentes na mesma linha."], ["Cache line", "Bloco mínimo de dados transferido entre cache e memória."], ["Invalidação", "Mensagem que marca uma cópia remota como inválida."], ["Padding", "Bytes extras inseridos para separar dados em linhas distintas."], ["Alinhamento", "Posicionamento de dados em endereços múltiplos do tamanho da linha."]],
        { tags: ["memória", "concorrência"] }
      ],
      [
        "Memória Virtual e Paginação",
        "Como cada programa pode acreditar que tem toda a memória para si?",
        "Alocar memória física contígua por processo gera fragmentação e insegurança entre programas.",
        "Traduzir endereços virtuais em físicos por páginas permite isolamento, proteção e uso eficiente da RAM.",
        "Endereço virtual = VPN | offset; page table mapeia VPN → PFN. Páginas típicas de 4 KiB. Páginas ausentes geram page fault e são trazidas do disco.",
        "Explique por que a paginação elimina fragmentação externa, mas pode causar fragmentação interna.",
        [["Memória virtual", "Abstração que dá a cada processo um espaço de endereçamento próprio."], ["Page table", "Estrutura que traduz endereços virtuais em físicos."], ["VPN", "Número da página virtual, parte alta do endereço."], ["PFN", "Número do frame físico correspondente."], ["Page fault", "Interrupção gerada quando a página não está na RAM."]],
        { tags: ["memória", "virtual"] }
      ],
      [
        "Translation Lookaside Buffer (TLB)",
        "Se toda acesso à memória passa pela page table, por que isso não é lentíssimo?",
        "Uma page table multinível exige vários acessos extras à RAM para traduzir um único endereço.",
        "Guardar as traduções mais recentes em uma cache especial (TLB) torna a maioria das traduções instantânea.",
        "TLB é uma cache associativa de entradas VPN→PFN. TLB hit evita a page table; TLB miss exige caminhada pela page table e possivelmente um Page Fault.",
        "Justifique por que mudar o contexto de um processo pode exigir TLB flush ou use de ASIDs.",
        [["TLB", "Cache de traduções de endereços virtuais."], ["TLB hit", "Tradução encontrada na cache de páginas."], ["TLB miss", "Necessidade de consultar a page table."], ["Page walk", "Sequência de acessos para percorrer a page table multinível."], ["ASID", "Identificador que permite manter traduções de vários processos no TLB."]],
        { tags: ["memória", "virtual"] }
      ],
      [
        "Write Allocate e No-Write Allocate",
        "Ao escrever em um endereço ausente da cache, o bloco deve ser trazido?",
        "Buscar a linha antes de escrever custa tempo, mas evitar a busca pode quebrar coerência parcial.",
        "A escolha depende do padrão de acesso: escritas com reuso favorecem write allocate; streams de escrita favorecem no-write allocate.",
        "Write-allocate faz load da linha e depois atualiza; write-around/no-write-allocate grava direto na memória. Combinam-se com write-back ou write-through.",
        "Escolha a política mais adequada para copiar um arquivo grande e justifique.",
        [["Write allocate", "Política que carrega a linha para a cache antes da escrita."], ["No-write allocate", "Política que escreve direto na memória sem carregar a linha."], ["Write-around", "Escrita que bypassa a cache."], ["Reuso", "Probabilidade de o dado ser acessado novamente em breve."], ["Largura de banda", "Taxa de dados transferidos entre memória e cache."]],
        { tags: ["memória", "cache"] }
      ],
      [
        "Cache Line e Prefetching",
        "Como esconder a latência da memória principal antes de o programa pedir o dado?",
        "A CPU é muito mais rápida que a RAM; esperar dado por dado deixa o pipeline vazio.",
        "Buscar blocos maiores e antecipar padrões de acesso transforma espera em trabalho sobreposto.",
        "Cache lines de 64 bytes exploram localidade espacial; prefetchers detectam stride e carregam linhas futuras. Prefetch excessivo pode poluir a cache.",
        "Explique por que percorrer um array com stride 64 pode acionar o prefetcher de strides.",
        [["Cache line", "Bloco de 64 bytes típico transferido por vez."], ["Prefetch", "Carga antecipada de dados antes do uso efetivo."], ["Stride", "Passo constante entre endereços acessados."], ["Cache pollution", "Ocupação de cache com dados que não serão usados."], ["Hit under miss", "Acesso que acerta a cache enquanto outra falha está sendo atendida."]],
        { tags: ["memória", "desempenho"] }
      ],
      [
        "NUMA e Localidade de Nó",
        "Em servidores com vários soquetes, por que a memória não é igualmente rápida para todos os núcleos?",
        "Cada soquete tem memória ligada diretamente a si; acessar memória remota cruza um link inter-soquete.",
        "Alocar threads perto da memória que usam reduz latência e aumenta largura de banda.",
        "NUMA (Non-Uniform Memory Access): tempo de acesso depende da distância entre núcleo e controlador de memória. Ferramentas como numactl fixam threads e alocações por nó.",
        "Descreva um sintoma de má configuração NUMA em um banco de dados multithread.",
        [["NUMA", "Arquitetura em que o tempo de acesso depende do nó de memória."], ["Nó NUMA", "Conjunto de CPUs e memória local a um soquete."], ["Memória remota", "Memória acessada por outro nó, com latência maior."], ["Afinidade", "Fixação de threads em CPUs específicas."], ["Interconnect", "Link que conecta soquetes em sistemas multiprocessador."]],
        { tags: ["memória", "servidores"] }
      ],
      [
        "Proteção de Memória e Bits de Permissão",
        "Como impedir que um programa leia ou altere a memória de outro?",
        "Sem controle de acesso, qualquer processo poderia ler senhas ou corromper o kernel.",
        "A tradução por páginas permite anexar permissões à página e verificar cada acesso no hardware.",
        "Page tables carregam bits de read/write/user/supervisor/execute. Violação gera page fault de proteção; W^X impede que uma página seja gravável e executável ao mesmo tempo.",
        "Explique como W^X dificulta a exploração de um buffer overflow que injeta shellcode.",
        [["Proteção de memória", "Mecanismo hardware que restringe acessos por página."], ["Bit de usuário", "Permissão que marca uma página como acessível em modo usuário."], ["Bit de escrita", "Permissão que autoriza modificações na página."], ["W^X", "Política que proíbe uma página de ser simultaneamente gravável e executável."], ["Page fault de proteção", "Exceção gerada por acesso não autorizado."]],
        { tags: ["memória", "segurança"] }
      ]
    ]),
    GM("Arquiteturas Paralelas, SIMD, GPUs e Multicore", [
      [
        "Vetorização e Instruções SIMD",
        "Como somar mil números sem executar mil instruções separadas?",
        "Operar escalarmente por elemento desperdiça largura dos registradores e ciclos de clock.",
        "Uma única instrução pode aplicar a mesma operação a vários elementos em paralelo dentro de um registrador vetorial.",
        "SIMD usa registradores de 128, 256 ou 512 bits (SSE, AVX2, AVX-512). Um addps de 256 bits soma 8 floats de 32 bits por ciclo.",
        "Calcule quantos inteiros de 32 bits cabem em um registrador AVX2 de 256 bits.",
        [["SIMD", "Paralelismo que aplica uma instrução a vários dados."], ["Registrador vetorial", "Registrador largo que guarda vários elementos."], ["Lane", "Posição de um elemento dentro do vetor."], ["AVX2", "Extensão x86 com registradores de 256 bits para inteiros e floats."], ["Vetorização", "Transformação de código escalar em operações vetoriais."]],
        { tags: ["paralelo", "simd"] }
      ],
      [
        "SIMT e o Paradigma de Computação em GPU",
        "Por que uma GPU tem milhares de threads enquanto uma CPU tem poucas dezenas?",
        "Problemos gráficos e de matrix têm milhões de operações independentes e toleram latência alta com muita sobreposição.",
        "SIMT agrupa threads em warps que executam a mesma instrução em dados diferentes, trocando flexibilidade por throughput massivo.",
        "CUDA organiza threads em blocks e grids. Cada warp (32 threads) executa em lockstep; divergência de desvio serializa os caminhos do warp.",
        "Explique por que um if com poucos threads divergentes pode custar caro em uma GPU.",
        [["SIMT", "Modelo em que threads executam a mesma instrução em dados distintos."], ["Warp", "Grupo de 32 threads executando em sincronia."], ["Block", "Grupo de warps que compartilha memória compartilhada."], ["Divergência", "Situação em que threads de um warp seguem caminhos diferentes."], ["Throughput", "Quantidade de trabalho concluído por unidade de tempo."]],
        { tags: ["paralelo", "gpu"] }
      ],
      [
        "CUDA Cores e Tensor Cores",
        "Por que multiplicar matrizes é muito mais rápido em Tensor Cores do que em CUDA Cores?",
        "CUDA Cores são unidades gerais de ponto flutuante; redes neurais exigem bilhões de multiplicações e acumulações com precisão reduzida.",
        "Tensor Cores executam uma pequena multiplicação de matrizes por ciclo com precisão mista, explorando o padrão exato da IA.",
        "Um Tensor Core calcula D = A×B + C em blocos 4×4 ou 16×16 por ciclo, com entradas FP16/BF16/INT8 e acumulação FP32.",
        "Justifique por que FP16 pode ser suficiente para inferência, mas arriscado para treinamento sem ajustes.",
        [["CUDA Core", "Unidade de execução geral de uma GPU NVIDIA."], ["Tensor Core", "Unidade especializada em multiplicação de matrizes."], ["GEMM", "Multiplicação de matrizes generalizada."], ["Precisão mista", "Uso de formatos diferentes para entrada e acumulação."], ["FLOPs", "Operações de ponto flutuante por segundo."]],
        { tags: ["paralelo", "gpu"] }
      ],
      [
        "Coerência de Cache: Protocolo MESI",
        "Como garantir que dois núcleos não vejam valores diferentes para o mesmo endereço?",
        "Cada núcleo tem sua própria cache; uma escrita local deixaria as outras cópias obsoletas.",
        "Um protocolo de coerência rastreia o estado de cada linha e invalida ou atualiza cópias remotas quando necessário.",
        "MESI: Modified (suja, exclusiva), Exclusive (limpa, exclusiva), Shared (limpa, replicada), Invalid. Escrita em Shared exige invalidar os outros núcleos via snoop ou diretório.",
        "Percorra a transição de uma linha Shared para Modified quando um núcleo escreve.",
        [["Coerência", "Garantia de que todas as cópias de um dado convergem para o mesmo valor."], ["MESI", "Protocolo de coerência com quatro estados."], ["Snoop", "Observação de transações de barramento para manter coerência."], ["Diretório", "Estrutura que registra quais caches possuem cada linha."], ["Invalidação", "Ação que marca uma cópia remota como Inválida."]],
        { tags: ["paralelo", "cache"] }
      ],
      [
        "PCIe, DMA e Acesso Direto à Memória",
        "Como uma GPU recebe gigabytes de dados sem ocupar a CPU copiando byte por byte?",
        "Transferências programadas pela CPU consomem ciclos e largura de banda limitada.",
        "O barramento PCIe permite que o dispositivo acesse a memória diretamente com DMA, liberando a CPU.",
        "PCIe usa links seriais point-to-point com larguras x1, x4, x8, x16. DMA mappings traduzem endereços virtuais do processo para endereços físicos acessíveis pelo dispositivo (IOMMU).",
        "Explique por que IOMMU é necessário para DMA seguro em ambientes virtualizados.",
        [["PCIe", "Barramento serial de alta velocidade para dispositivos."], ["DMA", "Transferência direta entre dispositivo e memória."], ["IOMMU", "Unidade que traduz e protege acessos de dispositivos à memória."], ["Lane", "Par de linhas seriais que compõe um link PCIe."], ["MSI", "Interrupção por mensagem enviada pelo dispositivo ao processador."]],
        { tags: ["paralelo", "barramento"] }
      ],
      [
        "Hierarquia de Memória da GPU",
        "Por que milhares de threads precisam de vários tipos de memória?",
        "Memória global é grande, mas lenta; registros são rápidos, mas escassos.",
        "Expor níveis explícitos permite ao programador colocar dados quentes perto dos threads.",
        "GPU: registradores por thread, memória compartilhada por block, cache L1/L2, memória global (VRAM). Acesso coalescido agrupa leituras de threads adjacentes em poucas transações.",
        "Diferencie coalescing de cache hit em uma GPU.",
        [["Memória global", "VRAM acessível por todos os threads."], ["Memória compartilhada", "Memória rápida visível apenas ao block."], ["Coalescing", "Agrupamento de acessos de threads em uma transação de memória."], ["Banco de memória", "Divisão da memória compartilhada para acessos paralelos."], ["Ocupação", "Número de warps ativos por multiprocessador."]],
        { tags: ["paralelo", "gpu"] }
      ],
      [
        "Lei de Amdahl e Limites do Paralelismo",
        "Por que adicionar núcleos não deixa qualquer programa arbitrariamente rápido?",
        "A parte serial do código não se beneficia de mais núcleos e domina o tempo total.",
        "A lei de Amdahl quantifica o ganho máximo antes de investir em mais hardware.",
        "Speedup = 1 / (S + (1−S)/N), onde S é a fração serial e N o número de núcleos. Com S=10%, o limite teórico é 10× mesmo com N→∞.",
        "Calcule o speedup máximo de um programa com 20% serial em 8 núcleos.",
        [["Lei de Amdahl", "Lei que limita o ganho de paralelismo pela fração serial."], ["Fração serial", "Parte do tempo que não pode ser paralelizada."], ["Speedup", "Razão entre tempo sequencial e tempo paralelo."], ["Lei de Gustafson", "Modelo que considera crescimento do problema com mais núcleos."], ["Eficiência", "Speedup dividido pelo número de núcleos."]],
        { tags: ["paralelo", "desempenho"] }
      ]
    ])
  ]
};

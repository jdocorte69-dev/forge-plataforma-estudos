/* ============================================================
   FORGE — data-trilha11.js
   Trilha 11: Assembly & Engenharia Reversa — 7 módulos,
   35 aulas G5, com x86-64, ARM64, RISC-V e análise defensiva.
   ============================================================ */

const T11 = ([title, problem, impasse, insight, formal, feynman, facts, opts]) =>
  G5({ title, problem, impasse, insight, formal, feynman, facts, ...(opts || {}) });

CURRICULUM.assembly = {
  name: "Assembly e Engenharia Reversa",
  icon: "⚙️",
  modules: [
    GM("Anatomia da CPU x86-64 e Registradores", [
      [
        "Registradores de Propósito Geral em 64 bits",
        "Como o processador guarda os valores que está usando agora mesmo?",
        "Buscar cada operando na RAM a cada instrução seria centenas de vezes mais lento que usar memória interna.",
        "Registradores são o topo da hierarquia: pequenos bancos de memória dentro da CPU, endereçáveis por nome na ISA.",
        "x86-64 define 16 registradores GPR de 64 bits: RAX, RBX, RCX, RDX, RSI, RDI, RBP, RSP e R8–R15. Escrever em EAX (32 bits) zera os 32 bits superiores de RAX.",
        "Ao mover 0xFFFFFFFF para EAX depois de carregar 0x0000000012345678 em RAX, qual é o valor final e por quê?",
        [["RAX", "Registrador acumulador de 64 bits, também usado para retornos de função."], ["RSP", "Ponteiro do topo da pilha."], ["RBP", "Ponteiro de base do frame da pilha."], ["R8-R15", "Registradores de propósito geral adicionados pelo x86-64."], ["Zero-extension", "Zeragem dos 32 bits altos ao escrever em um sub-registrador de 32 bits."]],
        { tags: ["x86-64", "registradores"], lab: "No simulador de CPU, escreva em EAX e observe RAX completo." }
      ],
      [
        "O Registrador de Flags (RFLAGS)",
        "Como guardar o resultado secundário de uma comparação para decidir um desvio depois?",
        "Gravar o status da CPU na memória após cada operação seria lento e ocuparia espaço precioso.",
        "Um registrador dedicado acumula bits de condição que as instruções de salto leem diretamente.",
        "RFLAGS contém ZF (zero), SF (sinal), CF (carry), OF (overflow), PF (paridade) e AF. CMP é um SUB descartado que só atualiza flags; JE lê ZF, JG lê SF/OF/ZF.",
        "Explique por que CMP RAX, RBX seguido de JE testa igualdade sem alterar os registradores.",
        [["RFLAGS", "Registrador de status da CPU em x86-64."], ["ZF", "Flag de zero, ligado quando o resultado é zero."], ["CF", "Flag de carry, ligado quando há transporte sem sinal."], ["OF", "Flag de overflow, ligado quando há estouro com sinal."], ["CMP", "Instrução que subtrai e descarta o resultado, preservando apenas flags."]],
        { tags: ["x86-64", "flags"] }
      ],
      [
        "Hierarquia de Sub-Registradores: RAX, EAX, AX, AL, AH",
        "Por que o mesmo registrador tem vários nomes diferentes?",
        "Código de 16 e 32 bits precisou continuar funcionando em processadores de 64 bits.",
        "A compatibilidade é conseguida tornando os registradores antigos 'janelas' sobre os novos.",
        "RAX=64 bits, EAX=bits 0–31, AX=0–15, AL=0–7, AH=8–15. Escrever em AL/AH/AX preserva os bits superiores; escrever em EAX zera bits 32–63.",
        "Diga o valor de RAX após escrever 0x12 em AH e 0x34 em AL partindo de RAX=0.",
        [["Sub-registrador", "Janela de bits menor dentro de um registrador maior."], ["EAX", "Porção de 32 bits de RAX."], ["AL", "Byte menos significativo de RAX."], ["AH", "Segundo byte menos significativo de RAX."], ["Compatibilidade binária", "Capacidade de executar código antigo em hardware novo."]],
        { tags: ["x86-64", "compatibilidade"] }
      ],
      [
        "Registradores de Controle: RIP, RSP e RBP",
        "Quem diz ao processador qual instrução vem depois e onde fica o topo da pilha?",
        "Sem registradores de controle, saltos, chamadas de função e retornos não teriam estado para consultar.",
        "Três registradores dedicados carregam o fluxo de execução e a estrutura da pilha.",
        "RIP aponta a próxima instrução; RSP aponta o topo da pilha e muda com PUSH/POP; RBP é o ponteiro de base estável do frame atual.",
        "Descreva o que acontece com RIP e RSP durante CALL e RET.",
        [["RIP", "Instruction pointer: endereço da próxima instrução."], ["RSP", "Stack pointer: endereço do topo da pilha."], ["RBP", "Base pointer: referência estável para o frame atual."], ["PUSH", "Instrução que decrementa RSP e grava um valor."], ["RET", "Instrução que recupera o endereço de retorno da pilha para RIP."]],
        { tags: ["x86-64", "controle"] }
      ],
      [
        "Efeito das Instruções nas Flags",
        "Por que AND e XOR zeram CF e OF, mas ADD não?",
        "Nem toda operação produz carry ou overflow com o mesmo significado aritmético.",
        "A ISA define explicitamente quais flags cada instrução afeta para evitar ambiguidade em código de baixo nível.",
        "ADD/SUB atualizam ZF, SF, CF, OF, AF, PF. AND/OR/XOR/TEST zeram CF e OF e atualizam ZF/SF/PF. INC/DEC preservam CF, mas alteram OF.",
        "Explique por que TEST RAX, RAX é a forma idiomática de verificar se RAX é zero.",
        [["TEST", "AND lógico sem gravar o resultado, usado para testar bits."], ["Flag", "Bit de status individual do registrador RFLAGS."], ["Preservação de CF", "Comportamento de instruções que não modificam o carry."], ["Condição de salto", "Combinação de flags lida por Jcc."], ["Setcc", "Família de instruções que escreve 0 ou 1 conforme uma condição."]],
        { tags: ["x86-64", "flags"] }
      ]
    ]),
    GM("Modos de Endereçamento e Sintaxe", [
      [
        "Sintaxe Intel versus Sintaxe AT&T",
        "Por que o mesmo código assembly parece invertido entre documentações?",
        "Duas convenções históricas disputam a ordem dos operandos e o uso de registradores literais.",
        "Reconhecer a convenção evita erros silenciosos ao ler listagens de compiladores diferentes.",
        "Intel: `mov rax, rbx` significa rax ← rbx (destino primeiro). AT&T: `movq %rbx, %rax` (origem primeiro), com % em registradores e $ em imediatos.",
        "Traduza `addq $1, %rax` (AT&T) para a sintaxe Intel.",
        [["Sintaxe Intel", "Convenção com destino primeiro, usada por NASM e documentação Intel."], ["Sintaxe AT&T", "Convenção com origem primeiro, usada por GAS e objdump padrão."], ["Imediato", "Valor constante embutido na instrução."], ["Registrador literal", "Nome do registrador precedido por % na sintaxe AT&T."], ["Mnemônico", "Nome simbólico da instrução, como mov ou add."]],
        { tags: ["x86-64", "sintaxe"] }
      ],
      [
        "LEA: Endereço Efetivo sem Acessar Memória",
        "Como calcular um endereço complexo sem fazer uma leitura desnecessária?",
        "MOV com um endereço indexado realiza acesso à memória mesmo quando só interessa o resultado do cálculo.",
        "LEA executa a aritmética de endereçamento e escreve o número no registrador, sem tocar na memória.",
        "LEA RAX, [RBX + RSI*4 + 8] calcula RBX + 4·RSI + 8 e grava em RAX. Não altera flags e pode ser usado como substituto barato de multiplicações por potências de 2.",
        "Por que `lea rax, [rax*8]` pode ser mais rápido que `imul rax, 8`?",
        [["LEA", "Load Effective Address: calcula endereço sem acessar memória."], ["Endereçamento indexado", "Cálculo base + índice·escala + deslocamento."], ["Escala", "Multiplicador 1, 2, 4 ou 8 aplicado ao registrador índice."], ["Sem acesso à memória", "Característica que distingue LEA de MOV com colchetes."], ["Aritmética de endereço", "Cálulo realizado pela unidade de geração de endereço."]],
        { tags: ["x86-64", "instruções"] }
      ],
      [
        "PUSH, POP e Endianness na Pilha",
        "Como uma função guarda e recupera valores temporários sem perder a ordem?",
        "Registradores são poucos; valores precisam sobreviver a chamadas e interrupções.",
        "A pilha cresce para endereços menores e opera em LIFO: o último valor guardado é o primeiro recuperado.",
        "PUSH x: RSP ← RSP−8; [RSP] ← x. POP y: y ← [RSP]; RSP ← RSP+8. Em little endian, o byte menos significativo fica no menor endereço.",
        "Mostre os bytes de 0x11223344 após PUSH em uma máquina little endian.",
        [["Pilha", "Região de memória gerenciada por RSP em modo LIFO."], ["PUSH", "Instrução que empilha um valor decrementando RSP."], ["POP", "Instrução que retira o valor do topo incrementando RSP."], ["LIFO", "Ordem em que o último elemento entra é o primeiro a sair."], ["Little endian", "Ordem em que o byte menos significativo vem primeiro."]],
        { tags: ["x86-64", "pilha"] }
      ],
      [
        "Modos de Endereçamento na Prática",
        "De quantas formas uma instrução pode dizer onde está seu operando?",
        "Limitar-se a endereços absolutos tornaria código posicional e loops impossíveis de escrever de forma compacta.",
        "A x86-64 oferece um conjunto rico de modos que combinam registradores, escala e deslocamento.",
        "Modos: imediato ($5), registrador (rax), direto ([0x1000]), indireto ([rbx]), deslocamento ([rbx+8]), indexado ([rbx+rcx*4+8]) e RIP-relativo ([rip+off]).",
        "Escolha o modo adequado para acessar o elemento i de um array de inteiros de 4 bytes cuja base está em RDI.",
        [["Modo de endereçamento", "Regra para calcular o endereço efetivo de um operando."], ["Direto", "Endereço constante embutido na instrução."], ["Indireto", "Endereço armazenado em registrador."], ["Indexado", "Base + índice·escala + deslocamento."], ["Deslocamento", "Constante somada à base."]],
        { tags: ["x86-64", "endereçamento"] }
      ],
      [
        "Endereçamento RIP-Relativo e Código PIC",
        "Como acessar dados globais sem saber onde o programa será carregado na memória?",
        "Endereços absolutos quebram quando o carregador escolhe outra base (ASLR).",
        "Calcular o endereço como deslocamento a partir do próprio RIP torna o código independente de posição.",
        "`mov rax, [rip+offset]` usa o endereço da próxima instrução mais um deslocamento de 32 bits com sinal, permitindo alcance de ±2 GiB.",
        "Explique por que PIC é obrigatório para bibliotecas compartilhadas em Linux.",
        [["RIP-relativo", "Endereço calculado em relação ao instruction pointer."], ["PIC", "Position Independent Code, executável em qualquer endereço."], ["ASLR", "Randomização de endereços de memória pelo sistema operacional."], ["Deslocamento com sinal", "Valor relativo que pode ser positivo ou negativo."], ["PLT/GOT", "Tabelas usadas por código PIC para resolver símbolos."]],
        { tags: ["x86-64", "pic"] }
      ],
      [
        "Tamanho de Operando e Prefixos de Instrução",
        "Como a CPU sabe se `mov` deve mover 8, 16, 32 ou 64 bits?",
        "O mnemônico sozinho é ambíguo; o registrador ou um prefixo define a largura.",
        "A largura é inferida pelo registrador usado ou forçada por prefixos e sufixos.",
        "`mov al, 1` move 1 byte; `mov eax, 1` move 4 e zera a parte alta; `mov rax, 1` move 8. Em AT&T, sufixos b/w/l/q tornam a largura explícita.",
        "O que acontece ao escrever `mov ax, 0xFFFF` em um registrador cujo valor anterior era 0x12345678?",
        [["Largura de operando", "Quantidade de bits movimentados ou operados."], ["Prefixo REX", "Prefixo x86-64 que habilita registradores e largura de 64 bits."], ["Sufixo AT&T", "Letra b/w/l/q que indica 8/16/32/64 bits."], ["Movzx", "Movimento com extensão de zero."], ["Movsx", "Movimento com extensão de sinal."]],
        { tags: ["x86-64", "instruções"] }
      ]
    ]),
    GM("Aritmética, Lógica Bitwise e Controle de Fluxo", [
      [
        "Instruções Aritméticas e Manipulação Bitwise",
        "Como implementar expressões C diretamente em registradores?",
        "Compiladores traduzem expressões em sequências curtas de instruções; entender essa tradução permite depurar código otimizado.",
        "Aritmética e bitwise usam as mesmas portas da ULA, com flags como efeito colateral útil.",
        "ADD/SUB/IMUL/DIV para aritmética; AND/OR/XOR/NOT/NOT/SHL/SHR/SAR para bits. AND com máscara limpa bits; OR liga bits; XOR alterna bits.",
        "Diga qual máscara usar para transformar o bit 3 de AL em 1 sem alterar os demais.",
        [["AND", "Operação bit a bit que preserva bits onde a máscara é 1."], ["OR", "Operação bit a bit que liga bits onde a máscara é 1."], ["XOR", "Operação bit a bit que inverte bits onde a máscara é 1."], ["SHL", "Deslocamento à esquerda, equivalente a multiplicar por potência de 2."], ["SAR", "Deslocamento aritmético à direita, preservando o sinal."]],
        { tags: ["x86-64", "bitwise"] }
      ],
      [
        "Comparações e Saltos Condicionais",
        "Como transformar `if (a < b)` em decisão de hardware?",
        "A CPU não entende expressões de alto nível; ela só lê flags e altera RIP.",
        "CMP produz flags e Jcc escolhe se altera RIP com base nelas.",
        "`cmp rax, rbx` calcula RAX−RBX. Para inteiros sem sinal: JA/JB/JE usam CF/ZF. Para inteiros com sinal: JG/JL/JE usam SF/OF/ZF. JMP é incondicional.",
        "Explique por que `cmp` seguido de `jl` interpreta os operandos como sinalizados.",
        [["Jcc", "Família de saltos condicionais lidos de RFLAGS."], ["CMP", "Subtração usada apenas para gerar flags."], ["Salto com sinal", "Condição que interpreta operandos em complemento de 2."], ["Salto sem sinal", "Condição que usa carry em vez de sinal."], ["Alvo de salto", "Endereço carregado em RIP quando a condição é satisfeita."]],
        { tags: ["x86-64", "controle"] }
      ],
      [
        "Deslocamentos e Rotações",
        "Como mover bits para posições diferentes sem perder informação?",
        "Deslocamentos comuns descartam bits nas bordas; certos algoritmos precisam reciclá-los.",
        "Rotações reinserem o bit que saiu na outra extremidade, preservando o conjunto de bits.",
        "SHL/SHR preenchem com zeros; SAR preenchem com o bit de sinal; ROL/ROR circulam bits. A contagem é mascarada a 5 bits (0–31) em operações de 32 bits.",
        "Rotacione 0b10000000 uma posição à esquerda em 8 bits e compare com SHL.",
        [["Deslocamento lógico", "Movimento de bits com preenchimento por zero."], ["Deslocamento aritmético", "Movimento de bits preservando o bit de sinal."], ["Rotação", "Movimento circular de bits entre as extremidades."], ["Máscara de contagem", "Limite aplicado ao número de posições deslocadas."], ["Carry de deslocamento", "Último bit removido, copiado para CF."]],
        { tags: ["x86-64", "bitwise"] }
      ],
      [
        "SETcc e CMOV: Eliminando Saltos",
        "Como escrever um `if` curto sem quebrar o pipeline com desvios?",
        "Saltos condicionais podem causar penalidade de predição errada em código pequeno.",
        "Instruções que produzem valor ou movem condicionalmente evitam alterar o fluxo de controle.",
        "SETcc escreve 0 ou 1 em um byte conforme flags; CMOVcc move apenas se a condição valer, sem desvio. Ambos são frequentemente gerados por compiladores otimizadores.",
        "Traduza `x = (a < b) ? a : b` usando CMP e CMOV.",
        [["SETcc", "Instrução que escreve um byte 0/1 conforme condição."], ["CMOVcc", "Movimento condicional que não altera RIP."], ["Branchless", "Código sem saltos condicionais explícitos."], ["Predição", "Mecanismo que evita stalls em desvios."], ["Compilador otimizador", "Ferramenta que transforma código para reduzir custo."]],
        { tags: ["x86-64", "otimização"] }
      ],
      [
        "Padrões de Loop em Assembly",
        "Como percorrer um array sem escrever código repetitivo?",
        "Repetir instruções manualmente para cada elemento gera código gigante e difícil de manter.",
        "Um registrador índice mais um salto condicional implementa qualquer loop.",
        "Padrão: XOR i,i; loop: carrega [base+i*escala]; processa; ADD i,1; CMP i,n; JL loop. O compilador pode usar LOOP, mas ADD/CMP/Jcc é mais rápido em CPUs modernas.",
        "Escreva o esqueleto assembly de um loop que soma um array de inteiros de 4 bytes.",
        [["Registrador índice", "Registrador que percorre posições de um array."], ["Loop", "Bloco de código repetido até uma condição de saída."], ["Indução", "Atualização sistemática da variável de controle do loop."], ["LOOP", "Instrução x86 que decrementa RCX e salta se não for zero."], ["Unrolling", "Duplicação do corpo do loop para reduzir saltos."]],
        { tags: ["x86-64", "loops"] }
      ]
    ]),
    GM("Funções, Stack Frames e Calling Convention", [
      [
        "System V AMD64 ABI",
        "Como dois módulos compilados separadamente concordam sobre onde passar argumentos?",
        "Sem convenção, o chamador e o chamado poderiam usar registradores diferentes para o mesmo parâmetro.",
        "A ABI define papéis fixos para registradores, pilha, alinhamento e responsabilidade por salvar estado.",
        "Argumentos inteiros em RDI, RSI, RDX, RCX, R8, R9; float em XMM0–XMM7; retorno em RAX/XMM0. RBX, RBP e R12–R15 são callee-saved; RAX, RCX, RDX, RSI, RDI, R8–R11 são caller-saved.",
        "Explique por que RBX precisa ser salvo pelo chamado, mas RAX não.",
        [["ABI", "Contrato de baixo nível entre módulos compilados."], ["Caller-saved", "Registrador que o chamado pode livremente sobrescrever."], ["Callee-saved", "Registrador que o chamado deve restaurar antes de retornar."], ["System V AMD64", "ABI usada por Linux e macOS em x86-64."], ["Alinhamento de pilha", "Exigência de que RSP esteja alinhado a 16 bytes antes de CALL."]],
        { tags: ["x86-64", "abi"] }
      ],
      [
        "Construção e Desconstrução do Stack Frame",
        "Como uma função cria espaço para variáveis locais e o libera corretamente?",
        "Variáveis locais não cabem todas em registradores, e chamadas aninhadas precisam não sobrescrever umas às outras.",
        "O prólogo reserva espaço no topo da pilha; o epílogo devolve o espaço antes do retorno.",
        "Prólogo: `push rbp; mov rbp, rsp; sub rsp, N`. Epílogo: `mov rsp, rbp; pop rbp; ret`. Acesso a locais via `[rbp−k]` e argumentos via `[rbp+16]` após um CALL.",
        "Mostre o estado de RSP e RBP depois de `push rbp; mov rbp,rsp; sub rsp,32`.",
        [["Stack frame", "Região da pilha reservada para uma chamada de função."], ["Prólogo", "Sequência inicial que prepara o frame."], ["Epílogo", "Sequência final que desfaz o frame e retorna."], ["Frame pointer", "Registrador de referência estável dentro do frame."], ["Variável local", "Dado armazenado no frame da função atual."]],
        { tags: ["x86-64", "pilha"] }
      ],
      [
        "Red Zone e Alinhamento de 16 Bytes",
        "Por que uma função folha pode usar 128 bytes abaixo de RSP sem reservar espaço?",
        "Ajustar RSP para cada pequena função custa instruções e ciclos.",
        "A ABI reserva uma região abaixo de RSP que interrupções e sinais não sobrescrevem.",
        "Red zone = 128 bytes abaixo de RSP, utilizável por funções folha sem `sub rsp`. Antes de qualquer CALL, RSP deve estar alinhado a 16 bytes para que SSE funcione corretamente.",
        "Quando o uso da red zone é inseguro?",
        [["Red zone", "Área de 128 bytes abaixo de RSP protegida de interrupções."], ["Função folha", "Função que não chama outras funções."], ["Alinhamento", "Condição de endereço múltiplo de 16 bytes."], ["SSE", "Extensão SIMD que exige operandos alinhados em certas instruções."], ["Sinal", "Interrupção de software que usa a pilha do processo."]],
        { tags: ["x86-64", "abi"] }
      ],
      [
        "Argumentos Variádicos e Passagem por Pilha",
        "Como uma função como printf aceita número variável de argumentos?",
        "Só seis registradores inteiros estão disponíveis; chamadas com mais argumentos precisam de outro caminho.",
        "A ABI define que argumentos excedentes são empilhados na ordem inversa, permitindo acesso por índice.",
        "Após os seis registradores, argumentos são empurrados da direita para a esquerda. A função variádica usa RBX/RAX como contadores de vetor e lê `[rbp+16+8*i]` para os extras.",
        "Explique por que a ordem inversa de PUSH simplifica o acesso aos argumentos pelo frame pointer.",
        [["Variádico", "Função com número variável de argumentos."], ["Argumento de pilha", "Parâmetro passado em memória por exceder os registradores."], ["Ordem inversa", "Empilhamento da direita para a esquerda."], ["Frame pointer", "Base usada para localizar argumentos no frame."], ["Registro de contagem", "Mecanismo da ABI para indicar quantos argumentos SIMD foram passados."]],
        { tags: ["x86-64", "abi"] }
      ],
      [
        "Omissão do Frame Pointer",
        "Por que compiladores com otimização parecem não usar RBP?",
        "Manter RBP dedicated consome um registrador que poderia guardar uma variável.",
        "Com um mapa de offsets do depurador (DWARF), RBP pode ser liberado e usado como GPR.",
        "`-fomit-frame-pointer` permite `push rbp` ser eliminado; endereços de locais passam a ser relativos a RSP. Depuração depende de `.eh_frame`/DWARF para reconstruir a pilha.",
        "Quais são as consequências de desativar o frame pointer em build de depuração?",
        [["Frame pointer omission", "Otimização que libera RBP como registrador geral."], ["DWARF", "Formato de informações de depuração."], ["Unwind", "Reconstrução da cadeia de frames a partir de metadados."], ["RSP relativo", "Acesso a locais calculado a partir do stack pointer atual."], ["Backtrace", "Lista de chamadas reconstruída durante depuração."]],
        { tags: ["x86-64", "depuração"] }
      ]
    ]),
    GM("Syscalls Diretas no Linux e Inline Assembly", [
      [
        "Chamadas de Sistema via Instrução SYSCALL",
        "Como um programa pede um serviço ao kernel sem chamar a biblioteca C?",
        "libc esconde a transição, mas às vezes é preciso evitar dependências ou reduzir overlay.",
        "A instrução SYSCALL troca o modo de execução e entrega os parâmetros em registradores definidos pela ABI do kernel.",
        "Número da syscall em RAX; argumentos em RDI, RSI, RDX, R10, R8, R9; retorno em RAX; RCX e R11 são clobberizados. `syscall` de `write(1, msg, len)` usa RAX=1.",
        "Por que o quarto argumento de syscall está em R10, e não em RCX?",
        [["Syscall", "Serviço do kernel invocado por transição controlada."], ["SYSCALL", "Instrução x86-64 que entra no modo kernel."], ["Número de syscall", "Valor em RAX que identifica o serviço requisitado."], ["Clobber", "Registrador modificado pela transição e não preservado."], ["Errno", "Convenção da libc para códigos de erro negativos retornados pelo kernel."]],
        { tags: ["linux", "syscall"], lab: "No simulador de CPU, carregue RAX=1 e simule uma syscall de escrita." }
      ],
      [
        "Interoperabilidade e Inline Assembly no GCC",
        "Como misturar C e assembly em uma mesma função sem corromper variáveis?",
        "O compilador não conhece efeitos colaterais de instruções escritas à mão.",
        "Constraints explícitos descrevem entradas, saídas e registradores destruídos para que o compilador coordenе o uso.",
        "Sintaxe estendida: `asm volatile(\"instr\" : : \"r\"(x) : \"rcx\", \"memory\")`. `volatile` evita remoção; `\"memory\"` é uma barreira de compilador.",
        "Por que esquecer o clobber `\"memory\"` pode gerar código errado com otimização ligada?",
        [["Inline assembly", "Código assembly embutido em código C."], ["Constraint", "Especificação de onde o compilador deve colocar operandos."], ["Clobber", "Registrador ou memória que a instrução modifica."], ["Volatile", "Marcação que impede o compilador de remover a instrução."], ["Barreira de compilador", "Restrição que impede reordenação de acessos à memória."]],
        { tags: ["linux", "gcc"] }
      ],
      [
        "Syscall direto versus wrapper da libc",
        "Quando vale a pena chamar o kernel diretamente?",
        "Wrappers da libc são portáteis e lidam com detalhes como errno e cancelamento de threads.",
        "Chamada direta reduz overhead e dependências, mas abre mão de portabilidade e semântica familiar.",
        "libc converte retorno negativo do kernel em −1 e preenche errno; syscall direto devolve o código negativo bruto. Em arquiteturas diferentes, os números de syscall mudam.",
        "Descreva um cenário em que syscall direto é justificável e outro em que não é.",
        [["Wrapper", "Função de biblioteca que encapsula uma syscall."], ["Portabilidade", "Capacidade de compilar para várias arquiteturas."], ["Overhead", "Custo extra de uma camada de software."], ["Código de erro", "Valor numérico que descreve a falha de uma operação."], ["Tabela de syscalls", "Lista oficial de números de syscall por arquitetura."]],
        { tags: ["linux", "syscall"] }
      ],
      [
        "Convenção de Retorno e Errno em Assembly",
        "Como o código assembly sinaliza erro para o chamador C?",
        "O kernel retorna valores negativos; a libc transforma isso em −1 com errno separado.",
        "Entender a conversão permite integrar assembly com código C sem perder diagnósticos.",
        "Em syscall direta, RAX contém −errno. Na libc, uma falha típica retorna −1 em RAX e grava o código em errno (acessível via `__errno_location`).",
        "Explique por que `open` direto retorna −2 para 'arquivo não encontrado', enquanto a libc retorna −1.",
        [["Errno", "Variável thread-local com o código do último erro."], ["Retorno negativo", "Convenção do kernel para indicar falha."], ["__errno_location", "Função interna da libc que devolve o endereço de errno."], ["Thread-local", "Dado com uma cópia independente por thread."], ["Diagnóstico", "Informação que explica a causa de uma falha."]],
        { tags: ["linux", "erros"] }
      ],
      [
        "Segmentos de Memória no ELF e Permissões",
        "Por que um binário tem seções .text, .rodata, .data e .bss separadas?",
        "Misturar código, constantes e variáveis numa única área impediria proteção de memória eficiente.",
        "Cada seção recebe permissões alinhadas ao seu papel: código executável, dados graváveis.",
        ".text é RX (read+execute), .rodata é R, .data contém inicializados graváveis, .bss é reservado e zerado pelo loader. W^X impede escrever e executar na mesma página.",
        "Por que shells algorithms de exploração injetam código em .data ou na pilha e falham em sistemas com W^X?",
        [["ELF", "Formato de executável e biblioteca em Linux."], [".text", "Seção que contém o código executável."], [".rodata", "Seção com constantes somente leitura."], [".bss", "Seção de dados não inicializados, zerada no carregamento."], ["W^X", "Política que impede uma página de ser gravável e executável simultaneamente."]],
        { tags: ["linux", "elf"] }
      ]
    ]),
    GM("Arquiteturas ARM64 e RISC-V", [
      [
        "Anatomia da Arquitetura ARM64 (AArch64)",
        "Como uma arquitetura RISC organiza registradores e instruções de forma regular?",
        "ISA x86 acumulou exceções históricas que complicam decodificação e compilação.",
        "AArch64 usa registradores largos uniformes e formato fixo de 32 bits, simplificando o front-end.",
        "31 registradores X0–X30 de 64 bits (W0–W30 para 32 bits), SP separado, X30 como link register, NZCV como flags. Instruções de 32 bits com registrador destino primeiro.",
        "Compare o uso de X30 com o par CALL/RET do x86-64.",
        [["AArch64", "Execução de 64 bits da arquitetura ARM."], ["X0-X30", "Registradores gerais de 64 bits."], ["W registradores", "Visão de 32 bits dos registradores X."], ["Link register", "Registrador que guarda o endereço de retorno."], ["NZCV", "Registrador de condições: negative, zero, carry, overflow."]],
        { tags: ["arm64", "isa"] }
      ],
      [
        "Fundamentos da Arquitetura Aberta RISC-V (RV64I)",
        "O que torna uma ISA verificável e extensível por qualquer pessoa?",
        "ISAs proprietárias não permitem auditoria independente nem extensões livremente documentadas.",
        "RISC-V define uma base mínima estável e extensões opcionais com especificação aberta.",
        "RV64I tem 32 registradores inteiros (x0 fixo em zero), formatos R/I/S/B/U/J e extensões M (multiplicação), A (atomics), F/D (float), C (comprimidas).",
        "Por que x0 ser fixo em zero simplifica a codificação de instruções?",
        [["RISC-V", "ISA aberta com conjunto básico e extensões modulares."], ["RV64I", "Base inteira de 64 bits."], ["x0", "Registrador rígido que sempre contém zero."], ["Formato de instrução", "Layout fixo de campos opcode, rs1, rs2, rd e funct."], ["Extensão", "Conjunto opcional de instruções adicionado à base."]],
        { tags: ["riscv", "isa"] }
      ],
      [
        "Registradores e Condições ARM64",
        "Como expressar comparação e salto em uma ISA sem Flags separadas por operação?",
        "Cada arquitetura escolhe um conjunto de condições e forma de atualizá-las.",
        "ARM64 usa registrador NZCV explícito e sufixos de condição nas instruções.",
        "`cmp x0, x1` é um SUB com escrita em NZCV; `b.eq` salta quando Z=1; `csel x2, x3, x4, eq` seleciona sem desvio.",
        "Diferencie `b.eq` de `csel` em termos de fluxo de controle.",
        [["NZCV", "Registrador de flags da ARM64."], ["CMP", "Subtração que atualiza condições."], ["B.cond", "Salto condicional baseado em NZCV."], ["CSEL", "Seleção condicional sem alterar RIP."], ["Sufixo de condição", "Marca na instrução que define quando ela executa."]],
        { tags: ["arm64", "controle"] }
      ],
      [
        "Convenção de Chamada RISC-V e ARM64",
        "Como garantir que funções compiladas por compiladores diferentes se entendam?",
        "Sem convenção comum, argumentos e valores de retorno poderiam ser trocados silenciosamente.",
        "Cada ISA publica uma ABI com registradores de argumento e regras de preservação.",
        "ARM64 (AAPCS64): argumentos em X0–X7, retorno em X0, X19–X28 callee-saved. RISC-V: argumentos em a0–a7 (x10–x17), retorno em a0/a1, s0–s11 callee-saved.",
        "Compare as convenções de chamada de ARM64 e System V AMD64 quanto ao número de argumentos em registradores.",
        [["AAPCS64", "Convenção de chamada da ARM64."], ["Registradores de argumento", "Registradores usados para passar parâmetros."], ["Callee-saved", "Registradores que o chamado deve preservar."], ["Link register", "Registrador com o endereço de retorno."], ["Stack alignment", "Alinhamento exigido para o topo da pilha."]],
        { tags: ["arm64", "riscv", "abi"] }
      ],
      [
        "NEON e Extensões Vetoriais",
        "Como fazer SIMD em ARM e comparar com AVX do x86?",
        "Cada arquitetura oferece registradores e instruções vetoriais com convenções próprias.",
        "Entender as semelhanças permite portar código de processamento de mídia entre plataformas.",
        "NEON usa 32 registradores de 128 bits (V0–V31) com visões de 8/16/32/64 bits por lane. Instruções como `add v0.4s, v1.4s, v2.4s` somam quatro floats de 32 bits.",
        "Traduza a ideia de `addps` AVX de 256 bits para o equivalente conceitual em NEON.",
        [["NEON", "Extensão SIMD da ARM."], ["Registrador vetorial", "Registrador que contém vários elementos."], ["Lane", "Elemento individual dentro do vetor."], ["AdvSIMD", "Nome técnico da extensão vetorial AArch64."], ["Portabilidade", "Facilidade de adaptar código entre arquiteturas."]],
        { tags: ["arm64", "simd"] }
      ]
    ]),
    GM("Engenharia Reversa Defensiva e Análise", [
      [
        "Descompilação e Reconhecimento de Estruturas",
        "Como entender um binário sem ter o código-fonte?",
        "O compilador descarta nomes, tipos e comentários, deixando apenas instruções e dados.",
        "Padrões recorrentes de instruções e dados permitem reconstruir a intenção original.",
        "Prólogos/epílogos revelam funções; sequências de CMP+Jcc revelam if/switch; chamadas a malloc/free indicam alocação; strings e constantes ajudam a nomear blocos.",
        "Por que um `switch` otimizado pode virar uma tabela de saltos em vez de vários CMP?",
        [["Descompilação", "Processo de reconstruir código de alto nível a partir de binário."], ["Padrão de prólogo", "Sequência de instruções que identifica o início de uma função."], ["Tabela de saltos", "Estrutura que mapeia índice a endereço de destino."], ["Símbolos", "Nomes de funções e variáveis embutidos no binário."], ["Listagem", "Saída desmontada de um executável."]],
        { tags: ["reversa", "defensiva"] }
      ],
      [
        "Análise de Stack Buffer Overflow e Proteções",
        "Como um overflow de pilha pode sequestrar o fluxo de execução e como impedir isso?",
        "Escrever além do buffer local pode sobrescrever o endereço de retorno guardado no frame.",
        "Defesas em camadas transformam uma falha em erro controlado, em vez de execução arbitrária.",
        "Canários de pilha detectam sobrescrita; DEP/NX marca a pilha como não executável; ASLR randomiza endereços; CFI valida alvos de saltos indiretos; RELRO protege tabelas de resolução.",
        "Explique por que NX sozinho não impede ret2libc e como ASLR dificulta essa técnica.",
        [["Stack canary", "Valor sentinela colocado antes do endereço de retorno."], ["DEP/NX", "Política que impede execução de código em páginas de dados."], ["ASLR", "Randomização de endereços de memória."], ["Ret2libc", "Técnica que redireciona execução para funções já presentes na biblioteca."], ["CFI", "Integridade de fluxo de controle, validando alvos de salto."]],
        { tags: ["reversa", "segurança"] }
      ],
      [
        "Binários Stripped e Símbolos",
        "Por que a listagem de um binário de produção tem tão poucos nomes?",
        "Símbolos ajudam depuradores, mas aumentam o tamanho e expõem estrutura interna.",
        "Remover símbolos reduz o arquivo; mantê-los em arquivo separado preserva depuração sem expor o binário.",
        "`strip` remove a tabela de símbolos; `objcopy --only-keep-debug` gera arquivo de debug separado; `file` e `readelf -S` ajudam a inspecionar seções restantes.",
        "Descreva o trade-off entre distribuir símbolos e manter rastreabilidade de crashes.",
        [["Stripped binary", "Executável sem tabela de símbolos."], ["Tabela de símbolos", "Estrutura que associa endereços a nomes."], ["Arquivo de debug separado", "Arquivo com símbolos fora do binário distribuído."], ["Introspection", "Capacidade de inspecionar estrutura interna do binário."], ["Build ID", "Identificador que liga o binário ao seu arquivo de depuração."]],
        { tags: ["reversa", "elf"] }
      ],
      [
        "Sanitizers e Instrumentação Defensiva",
        "Como encontrar erros de memória antes que o usuário os explore?",
        "Testes funcionais não detectam leituras fora do limite que parecem funcionar por sorte.",
        "Instrumentação adiciona verificações em tempo de execução ao redor de cada acesso sensível.",
        "AddressSanitizer usa redzones e shadow memory para detectar overflow/use-after-free; UBSan detecta comportamento undefined; `-fstack-protector-strong` adiciona canários.",
        "Explique por que um bug detectado pelo ASan pode não aparecer em build de release sem instrumentação.",
        [["Sanitizer", "Ferramenta que instrumenta código para detectar erros em tempo de execução."], ["Redzone", "Área protegida ao redor de alocações."], ["Shadow memory", "Memória auxiliar que marca bytes válidos."], ["Undefined behavior", "Construção cujo efeito não é definido pela linguagem."], ["Instrumentação", "Inserção automática de verificações no código."]],
        { tags: ["reversa", "qualidade"] }
      ]
    ])
  ]
};

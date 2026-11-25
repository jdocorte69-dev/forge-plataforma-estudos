/* ============================================================
   FORGE — data-c-advanced.js
   Trilha C — módulos C9 a C15 e Algoritmos e complexidade.
   Carregado com defer após data.js e data-c.js e antes de app.js.
   ============================================================ */

CURRICULUM.c.modules.push({
  name: "C9 — Pré-processador e organização de projeto",
  lessons: [
    L("#include e cabeçalhos",
      "Entender o papel dos cabeçalhos e a diferença entre declaração e definição.",
      "Funções, protótipos e arquivos .c da trilha inicial.",
      "O cabeçalho é o cartão de visitas de um módulo: informa o que existe sem revelar como foi implementado.",
      "A diretiva #include insere o conteúdo de outro arquivo antes da compilação. A forma #include <stdio.h> procura em caminhos de sistema definidos pela implementação; #include \"meu.h\" procura primeiro em relação ao arquivo que contém a diretiva e depois nos caminhos de sistema. O detalhe exato da busca depende do compilador, mas a intenção é estável: <...> para bibliotecas, \"...\" para arquivos do projeto.\n\nUm cabeçalho deve conter declarações: protótipos, typedef, enum, macros e objetos extern. A definição da função fica no arquivo .c. Incluir um arquivo .c em vários módulos gera definições duplicadas. Cabeçalhos grandes aumentam o tempo de compilação de todos os arquivos que os incluem, por isso convém expor apenas o necessário.\n\nCabeçalhos da ISO C (stdio.h, stdlib.h, stdint.h, stddef.h) fazem parte do padrão C17. Cabeçalhos como unistd.h, pthread.h e sys/socket.h pertencem a POSIX/Linux e não existem em uma implementação C estritamente conformante. Manter essa fronteira explícita é o que permite portar código.",
      [
        ["cabeçalho", "Arquivo com declarações destinado a ser incluído por unidades de tradução."],
        ["#include", "Diretiva do pré-processador que insere o conteúdo de outro arquivo."],
        ["declaração", "Descrição de uma entidade sem alocar definição, como um protótipo de função."],
        ["definição", "Implementação efetiva de uma função ou objeto, que deve existir uma única vez."],
        ["cabeçalho POSIX", "Cabeçalho de API POSIX, como unistd.h, fora do padrão ISO C."]
      ],
      {
        ex: [["#include <stdint.h>", "Traz tipos de largura fixa definidos pela ISO C."], ["#include \"lista.h\"", "Inclui o cabeçalho do próprio projeto."]],
        er: ["Incluir arquivos .c dentro de outros arquivos .c.", "Achar que pthread.h faz parte da ISO C."],
        lab: "Crie modulo.h com o protótipo de uma função e modulo.c com a definição; compile os dois arquivos juntos.",
        ref: "ISO/IEC 9899:2018 (C17), cláusula de pré-processamento; documentação do compilador sobre caminhos de include.",
        derivation: "Antes da compilação, o pré-processador substitui a linha #include pelo conteúdo integral do arquivo apontado. O compilador vê uma única unidade de tradução já expandida.",
        workedExamples: [
          ["Expor uma API mínima", "Em pilha.h, declare apenas typedef Pilha, funções de criar/destruir/empilhar/desempilhar e os códigos de erro. O array interno e a capacidade ficam em pilha.c."],
          ["Separar padrão e sistema", "Use stdint.h para uint32_t (ISO C) e unistd.h para close (POSIX). Documente no cabeçalho do projeto quais funções dependem de POSIX."]
        ],
        recallQuestions: [
          "O que #include faz com o arquivo incluído? Resposta: insere seu conteúdo textual na unidade de tradução.",
          "Por que protótipos ficam no cabeçalho e implementações no .c? Resposta: para declarar a interface sem duplicar definições.",
          "unistd.h é padrão ISO C? Resposta: não; é cabeçalho POSIX."
        ],
        masteryCriteria: [
          "Distingue declaração de definição e justifica a divisão .h/.c.",
          "Explica por que incluir .c quebra a compilação separada.",
          "Identifica quando um cabeçalho é extensão POSIX ou ISO C."
        ],
        tags: ["C9", "pré-processador", "cabeçalhos", "padrão-vs-POSIX"],
        estimatedEffort: 25
      }),
    L("Macros com segurança",
      "Escrever macros que não quebram precedência nem avaliam argumentos duas vezes.",
      "Diretiva #include e expressões com operadores.",
      "Macro é substituição de texto, não chamada de função: o compilador nunca verifica tipos nela.",
      "Macros de objeto substituem um identificador por uma sequência de tokens; macros com parâmetros substituem também os argumentos. A substituição ocorre no pré-processamento, antes da análise sintática. Por isso #define QUAD(x) ((x)*(x)) precisa de parênteses em torno do parâmetro e da expressão inteira: sem eles, QUAD(1+2) é avaliado como 1+2*1+2.\n\nOutro risco é a avaliação múltipla. Em QUAD(i++), o argumento é substituído duas vezes e i é incrementado duas vezes, algo que não aconteceria com uma função. Quando os argumentos precisam ser avaliados uma única vez, com tipo verificado, prefira static inline em C17. A palavra-chave inline é dica para o compilador; static dá ligação interna, evitando conflito entre arquivos.\n\nMacros de várias instruções usam do { ... } while (0) para se comportarem como uma única instrução, inclusive dentro de if sem chaves. Use #undef para encerrar o escopo de uma macro temporária, nomes maiúsculos para identificá-las e evite extensões como statement expressions do GCC/Clang se a meta é portabilidade.",
      [
        ["macro de objeto", "Macro sem parâmetros, usada como constante simbólica de texto."],
        ["macro com parâmetros", "Macro cujos argumentos são substituídos textualmente no corpo."],
        ["precedência", "Regra que define a ordem de avaliação dos operadores em uma expressão."],
        ["avaliação múltipla", "Efeito de um argumento de macro ser avaliado mais de uma vez."],
        ["static inline", "Função com ligação interna e dica de inlining, tipada pelo compilador."],
        ["do-while (0)", "Padrão que agrupa várias instruções de uma macro em uma única instrução."]
      ],
      {
        ex: [["#define QUAD(x) ((x)*(x))", "Substituição com parênteses protege a precedência."], ["static inline int quad(int x) { return x*x; }", "Alternativa tipada, sem avaliação duplicada."]],
        er: ["Chamar uma macro com i++ quando o argumento aparece mais de uma vez no corpo.", "Definir macro de várias instruções sem o agrupamento do-while (0)."],
        lab: "Compare a expansão de QUAD(1+2) com e sem parênteses; depois troque a macro por static inline e-meça o resultado de QUAD(i++).",
        ref: "ISO/IEC 9899:2018 (C17), cláusula de substituição de macros; GCC online docs, seção de macros (extensões identificadas como tal).",
        derivation: "QUAD(1+2) sem parênteses vira 1+2*1+2 = 5; com ((x)*(x)) vira ((1+2)*(1+2)) = 9. A diferença vem apenas da substituição textual.",
        workedExamples: [
          ["Macro de máximo", "#define MAX(a,b) ((a) > (b) ? (a) : (b)) está correto na precedência, mas avalia o argumento vencedor duas vezes. Com MAX(i++, j), i pode ser incrementado duas vezes."],
          ["Macro de log", "#define LOG(m) do { fprintf(stderr, \"%s\\n\", (m)); } while (0) permite escrever if (erro) LOG(\"falha\"); sem que o else se ligue erradamente."]
        ],
        recallQuestions: [
          "Por que o argumento de uma macro precisa de parênteses? Resposta: a substituição textual ignora a precedência original da expressão.",
          "O que acontece com QUAD(i++) se i aparecer duas vezes? Resposta: i é incrementado duas vezes.",
          "Qual alternativa C17 dá tipo e avaliação única? Resposta: static inline."
        ],
        masteryCriteria: [
          "Expande corretamente macros com expressões compostas.",
          "Reconhece avaliação múltipla e propõe static inline.",
          "Escreve macros de várias instruções com do-while (0)."
        ],
        tags: ["C9", "macros", "pré-processador", "armadilhas"],
        estimatedEffort: 30
      }),
    L("Include guards e compilação condicional",
      "Evitar inclusões repetidas e usar #if de forma previsível.",
      "Macros e cabeçalhos.",
      "Um cabeçalho incluído duas vezes é como ler a mesma página duas vezes: as definições se repetem.",
      "O padrão clássico é #ifndef NOME_DO_PROJETO_ARQUIVO_H, seguido de #define com o mesmo nome e #endif no fim. Na primeira inclusão a macro não existe e o conteúdo é processado; nas seguintes a condição falha e nada é repetido. O nome deve ser único no projeto, normalmente derivado do caminho e do nome do arquivo, para que dois cabeçalhos de bibliotecas diferentes não colidam.\n\n#pragma once resolve o mesmo problema com uma diretiva não padrão, aceita por GCC, Clang e MSVC. É conveniente, mas não pertence à ISO C: em compiladores que não a reconhecem, o comportamento depende da implementação. Para código portátil, use o guarda clássico.\n\nAs diretivas #ifdef, #ifndef, #if defined(...), #elif, #else e #endif permitem seleção condicional de trechos. São úteis para detectar versão do padrão, sistema operacional ou presença de biblioteca; __STDC_VERSION__ indica a versão da ISO C (C17 expõe 201710L). Cuidado: compilação condicional muda a interface e a ABI conforme as macros, portanto a mesma configuração deve ser usada ao compilar todos os arquivos de um projeto.",
      [
        ["include guard", "Padrão com #ifndef, #define e #endif que impede reprocessamento de um cabeçalho."],
        ["#pragma once", "Diretiva não padrão, comum em compiladores modernos, que inclusão única do arquivo."],
        ["compilação condicional", "Seleção de trechos de código por diretivas do pré-processador."],
        ["#if defined", "Teste que verifica se uma macro foi definida."],
        ["__STDC_VERSION__", "Macro definida pela implementação que identifica a versão do padrão C."],
        ["ABI", "Contrato binário entre módulos compilados; pode mudar com macros de configuração."]
      ],
      {
        ex: [["#ifndef FORGE_PILHA_H", "Início do guarda de um cabeçalho chamado pilha.h no projeto Forge."], ["#if defined(__linux__)", "Trecho específico de Linux; __linux__ é macro de compilador, não da ISO C."]],
        er: ["Usar nome de guarda genérico como _H, repetido em vários arquivos.", "Compilar alguns arquivos com uma macro de configuração e outros sem ela."],
        lab: "Crie dois cabeçalhos que se incluem mutuamente e verifique que os guardas evitam recursão e redefinição.",
        ref: "ISO/IEC 9899:2018 (C17), diretivas de inclusão condicional; documentação de GCC/Clang sobre #pragma once.",
        derivation: "Sem guarda, incluir a.h duas vezes produz duas declarações de tipo idênticas e pode gerar redefinição de macro ou erro. Com guarda, a segunda passagem encontra a macro definida e pula todo o conteúdo.",
        workedExamples: [
          ["Guarda completo", "#ifndef FORGE_CONFIG_H / #define FORGE_CONFIG_H / typedef struct { int debug; } Config; / #endif. O typedef aparece exatamente uma vez por unidade de tradução."],
          ["Detecção de versão", "#if __STDC_VERSION__ >= 201710L habilita código C17; em compiladores mais antigos, o trecho é ignorado em vez de falhar na compilação."]
        ],
        recallQuestions: [
          "Quais três diretivas formam o guarda clássico? Resposta: #ifndef, #define e #endif.",
          "#pragma once é ISO C? Resposta: não; é diretiva comum, mas não padrão.",
          "Por que a configuração deve ser igual em todos os arquivos? Resposta: macros alteram tipos e layout, mudando a ABI."
        ],
        masteryCriteria: [
          "Escreve guards com nomes únicos e fecha corretamente o #endif.",
          "Explica a diferença entre guarda padrão e #pragma once.",
          "Usa compilação condicional sem quebrar a compatibilidade entre módulos."
        ],
        tags: ["C9", "include guard", "#if", "portabilidade"],
        estimatedEffort: 25
      }),
    L("Compilação separada e arquivos objeto",
      "Entender unidades de tradução, símbolos e o papel dos arquivos .o.",
      "Cabeçalhos, funções e noção de ligação.",
      "Cada arquivo .c é compilado isoladamente e depois costurado com os demais pelo ligador.",
      "Um arquivo .c, depois do pré-processamento, é uma unidade de tradução. O comando gcc -std=c17 -Wall -Wextra -c modulo.c -o modulo.o produz um arquivo objeto: código de máquina mais uma tabela de símbolos. Símbolos podem ser definidos naquele arquivo ou ficar como referências não resolvidas, que serão completadas na ligação.\n\nA interface vai no cabeçalho; a implementação, no .c. Funções e variáveis declaradas com static têm ligação interna: são visíveis somente naquela unidade de tradução e não aparecem para o ligador. Variáveis e funções com ligação externa devem ter uma única definição em todo o programa; o extern serve para declarar sem definir.\n\nAssinaturas divergentes entre cabeçalho e definição são perigosas: o compilador de cada arquivo confia no que vê e o ligador, em geral, confere apenas nomes, não tipos. Por isso o cabeçalho é a fonte da verdade da interface. A compilação separada permite recompilar apenas o arquivo alterado e construir bibliotecas reutilizáveis.",
      [
        ["unidade de tradução", "Arquivo .c após o pré-processamento, submetido ao compilador como um todo."],
        ["arquivo objeto", "Resultado da compilação de uma unidade de tradução, com código e símbolos."],
        ["ligação externa", "Propriedade do símbolo visível para outras unidades de tradução."],
        ["ligação interna", "Propriedade do símbolo visível apenas dentro da sua unidade de tradução, obtida com static."],
        ["extern", "Especificador que declara um objeto ou função definido em outra unidade de tradução."],
        ["símbolo", "Nome registrado na tabela do arquivo objeto para função ou variável."]
      ],
      {
        ex: [["gcc -std=c17 -c util.c -o util.o", "Gera apenas o arquivo objeto, sem ligar o executável."], ["static int contador;", "Variável com ligação interna: cada .c tem a sua própria."]],
        er: ["Definir a mesma função global em dois arquivos .c.", "Alterar a assinatura no .c sem atualizar o cabeçalho."],
        lab: "Separe um programa em main.c, util.c e util.h; compile cada .c com -c e depois ligue os objetos.",
        ref: "ISO/IEC 9899:2018 (C17), cláusulas de ligação e unidades de tradução; manual do GCC sobre a opção -c.",
        derivation: "Compilar main.c e util.c separadamente cria dois objetos. main.o contém uma referência não resolvida para util; util.o contém a definição. O ligador encontra a correspondência pelo nome do símbolo e monta o executável.",
        workedExamples: [
          ["Divisão correta", "util.h declara int soma(int, int); util.c define a função; main.c inclui util.h e chama soma. Cada .c compila sem conhecer o corpo da função."],
          ["Escopo interno", "Um static int cache em util.c não é visível em main.c. Dois arquivos podem ter, cada um, o seu cache sem conflito."]
        ],
        recallQuestions: [
          "O que contém um arquivo .o? Resposta: código de máquina e tabela de símbolos com referências resolvidas e pendentes.",
          "O que faz static em uma variável de arquivo? Resposta: limita a visibilidade à unidade de tradução.",
          "Por que declarações divergentes são perigosas? Resposta: o ligador checa nomes, não tipos."
        ],
        masteryCriteria: [
          "Compila arquivos separadamente com -c e liga os objetos.",
          "Distingue ligação interna de ligação externa.",
          "Mantém cabeçalho e definição consistentes."
        ],
        tags: ["C9", "compilação separada", ".o", "símbolos"],
        estimatedEffort: 30
      }),
    L("Ligador, bibliotecas estáticas e compartilhadas",
      "Compreender a ligação de símbolos e as diferenças entre bibliotecas .a e .so.",
      "Compilação separada e arquivos objeto.",
      "O ligador é o costureiro que liga referências pendentes às suas definições.",
      "Depois de compilar cada unidade de tradução, o ligador percorre os objetos, resolve referências não definidas, escolhe endereços e gera o executável. Dois erros aparecem com frequência: undefined reference, quando nenhum objeto ou biblioteca fornece a definição de um símbolo usado, e multiple definition, quando a mesma função ou variável global é definida mais de uma vez.\n\nUma biblioteca estática é um arquivo morto de objetos, criado por exemplo com ar rcs libutil.a util.o. Na ligação, o ligador extrai somente os objetos necessários e copia seu código para o executável. Uma biblioteca compartilhada (.so em Linux) é carregada em tempo de execução; o executável guarda a referência ao símbolo e ao nome da biblioteca. Em Linux, gcc main.o -L. -lutil -o app procura libutil.a ou libutil.so; -Wl,-rpath controla a busca em tempo de execução e LD_LIBRARY_PATH é variável de ambiente, não parte da ISO C.\n\nNada disso é definido pelo padrão C: a ISO C especifica o comportamento do programa, não formatos de arquivo ou ferramentas de ligação. ELF é o formato comum em Linux, PE no Windows e Mach-O no macOS. Código que depende de formato, caminho ou opção de ligador é específico da plataforma e deve ser documentado como tal.",
      [
        ["ligador", "Ferramenta que resolve símbolos entre arquivos objeto e bibliotecas para gerar um executável."],
        ["undefined reference", "Erro de ligação indicando que um símbolo usado não tem definição disponível."],
        ["multiple definition", "Erro de ligação causado por mais de uma definição do mesmo símbolo global."],
        ["biblioteca estática", "Arquivo com objetos cujo código é incorporado ao executável na ligação."],
        ["biblioteca compartilhada", "Biblioteca carregada em tempo de execução e compartilhada por processos."],
        ["ELF", "Formato de arquivo executável e objeto comum em sistemas Linux, não definido pela ISO C."]
      ],
      {
        ex: [["gcc main.o -L. -lutil -o app", "Liga o programa com uma biblioteca util do diretório atual."], ["nm -u util.o", "Lista símbolos não definidos do objeto; ferramenta típica de Linux."]],
        er: ["Definir uma variável global em um cabeçalho incluído por vários .c.", "Esperar que -l encontre uma biblioteca fora dos caminhos de busca sem -L ou configuração equivalente."],
        lab: "Construa libutil.a a partir de util.o, ligue um main.o e compare o tamanho do executável com a versão ligada dinamicamente.",
        ref: "Manual do GNU ld e do GCC sobre opções -L, -l e -Wl; páginas de manual de ar e nm em sistemas Linux.",
        derivation: "Se main.o referencia f e nenhum objeto define f, a tabela de símbolos permanece com entrada não resolvida e o ligador falha. Incluir util.o ou libutil.a fornece a definição e a entrada é resolvida.",
        workedExamples: [
          ["Erro típico", "Chamar sqrt sem ligar a biblioteca de matemática em Linux pode gerar undefined reference. A correção é incluir o cabeçalho e acrescentar a opção de ligação da biblioteca correspondente."],
          ["Definição duplicada", "Colocar `int total;` em config.h incluído por dois .c gera duas definições externas. Use `extern int total;` no cabeçalho e uma única definição em config.c."]
        ],
        recallQuestions: [
          "O que significa undefined reference? Resposta: um símbolo usado não possui definição disponível na ligação.",
          "Quando o código de uma biblioteca estática entra no executável? Resposta: durante a ligação, para os objetos necessários.",
          "ELF faz parte da ISO C? Resposta: não; é formato de sistema, comum em Linux."
        ],
        masteryCriteria: [
          "Diagnostica undefined reference e multiple definition pelo modelo de símbolos.",
          "Constrói e liga uma biblioteca estática simples.",
          "Explica a diferença entre ligação estática e compartilhada."
        ],
        tags: ["C9", "linker", "bibliotecas", "símbolos"],
        estimatedEffort: 35
      }),
    L("Makefile e organização de projeto",
      "Escrever um Makefile incremental e organizar um projeto C em diretórios claros.",
      "Compilação separada e ligação.",
      "Um Makefile descreve o que depende de quê, para reconstruir só o que mudou.",
      "Uma regra de make tem alvo, pré-requisitos e receita: alvo: pre1 pre2 seguida de linhas começando com tabulação. Se algum pré-requisito for mais recente que o alvo, a receita é executada. Isso permite reconstruir apenas os objetos afetados por uma alteração.\n\nVariáveis como CC, CFLAGS e CPPFLAGS centralizam compilador e opções. Um conjunto inicial sensato é -std=c17 -Wall -Wextra -Wpedantic -g -O2; use -O0 -g quando depurando. Variáveis automáticas $@ (alvo), $< (primeiro pré-requisito) e $^ (todos) evitam repetir nomes. .PHONY declara alvos que não são arquivos, como all, test e clean.\n\nUma organização comum separa src/, include/, build/ e tests/. O alvo clean deve remover somente arquivos gerados pelo próprio projeto, com caminhos explícitos, nunca apagar diretórios arbitrários. Permissões devem ser mínimas: arquivos de código legíveis e graváveis pelo dono; não use permissão universal de escrita como solução de problema de acesso. Make não faz parte da ISO C: é uma ferramenta de automação, e sintaxes diferentes existem em outras ferramentas de build.",
      [
        ["Makefile", "Arquivo de descrição de regras de construção usado pela ferramenta make."],
        ["alvo", "Arquivo ou nome lógico que a regra pretende produzir."],
        ["pré-requisito", "Arquivo ou alvo que deve existir e estar atualizado antes da receita."],
        ["receita", "Comando executado para produzir o alvo, indentado com tabulação."],
        [".PHONY", "Declaração de que um alvo não corresponde a um arquivo real."],
        ["variável automática", "Variável preenchida por make com dados da regra, como $@ e $^."]
      ],
      {
        ex: [["CFLAGS = -std=c17 -Wall -Wextra -Wpedantic -g -O2", "Centraliza avisos e opções de depuração."], [".PHONY: all clean test", "Evita conflito entre alvos lógicos e arquivos de mesmo nome."]],
        er: ["Usar espaços no lugar da tabulação no início da receita.", "Fazer clean apagar caminhos fora do diretório do projeto."],
        lab: "Escreva um Makefile com alvos all, build/%.o, test e clean; altere um .c e confirme que só ele é recompilado.",
        ref: "Manual do GNU Make, capítulos sobre regras, variáveis automáticas e alvos .PHONY.",
        derivation: "Se main.o depende de main.c e main.h, alterar main.h torna main.o desatualizado. make reconstrói main.o e, por consequência, o executável; os demais objetos permanecem intactos.",
        workedExamples: [
          ["Regra de padrão", "`build/%.o: src/%.c include/%.h` com receita `$(CC) $(CFLAGS) -c $< -o $@` compila qualquer módulo sem repetir comandos."],
          ["Alvo de teste", "`test: app` executa a suíte de testes depois de garantir que o executável está atualizado; marque test como .PHONY."]
        ],
        recallQuestions: [
          "Qual caractere inicia uma receita no Makefile? Resposta: tabulação.",
          "O que faz .PHONY? Resposta: declara que o alvo não é um arquivo e deve sempre ser executado.",
          "O que significa $^? Resposta: todos os pré-requisitos da regra."
        ],
        masteryCriteria: [
          "Escreve regras com alvo, pré-requisitos e receita corretos.",
          "Usa variáveis automáticas e .PHONY adequadamente.",
          "Mantém clean limitado a artefatos do projeto."
        ],
        tags: ["C9", "Makefile", "build", "organização"],
        estimatedEffort: 35
      })
  ]
});
CURRICULUM.c.modules.push({
  name: "C10 — Representação de dados e máquina",
  lessons: [
    L("Binário, hexadecimal e operações bit a bit",
      "Interpretar dados em base 2 e 16 e usar máscaras e deslocamentos com segurança.",
      "Tipos inteiros e operadores da trilha inicial.",
      "Computadores guardam bits; hexadecimal é apenas uma forma compacta de escrever grupos de quatro bits.",
      "Um bit é 0 ou 1. Um byte é a menor unidade endereçável; na maioria das máquinas tem 8 bits, mas a ISO C define CHAR_BIT em limits.h e não exige o valor 8. Quatro bits formam um nibble, representado por um dígito hexadecimal de 0 a F. Por isso 0x2A equivale a 0010 1010 em binário e 42 em decimal.\n\nInteiros sem sinal usam representação binária pura: o valor é a soma de bit_i × 2^i. As operações bit a bit &, |, ^ e ~ tratam cada bit separadamente. Uma máscara como 0x0F isola os quatro bits menos significativos; x & 0x0F mantém apenas esses bits. Deslocamentos são multiplicações ou divisões por potências de dois quando não há perda de bits: 1u << 10 é 1024.\n\nLimites merecem cuidado: deslocar uma quantidade maior ou igual à largura do tipo é comportamento indefinido; deslocar um valor com sinal negativo tem regras próprias e merece evitar. Para largura fixa, use uint32_t de stdint.h e mascaras explícitas. Ferramentas como Compiler Explorer ajudam a ver o código gerado, mas o modelo de bits deve ser entendido antes da otimização.",
      [
        ["bit", "Unidade mínima de informação, com valores 0 ou 1."],
        ["CHAR_BIT", "Macro de limits.h que dá o número de bits em um byte na implementação."],
        ["hexadecimal", "Base 16, escrita com prefixo 0x, em que cada dígito representa quatro bits."],
        ["máscara", "Padrão de bits usado com &, | ou ^ para selecionar ou alterar posições."],
        ["deslocamento", "Operação << ou >> que move bits para a esquerda ou direita."],
        ["tipo de largura fixa", "Tipo como uint32_t, definido em stdint.h, com exatamente 32 bits quando disponível."]
      ],
      {
        ex: [["0x2A", "Equivale a 00101010 em binário e 42 em decimal."], ["x & 0x0F", "Mantém somente os quatro bits menos significativos de x."]],
        er: ["Deslocar um inteiro por 32 posições em um tipo de 32 bits.", "Assumir que todo byte tem exatamente 8 bits sem consultar CHAR_BIT."],
        lab: "Escreva funções para converter um byte em oito caracteres 0/1 e para extrair cada nibble de um uint8_t.",
        ref: "ISO/IEC 9899:2018 (C17), representação de tipos inteiros e limits.h/stdint.h; Compiler Explorer (godbolt.org) como apoio visual.",
        derivation: "Para o inteiro sem sinal de n bits, valor = soma(i de 0 a n-1) de bit_i × 2^i. Em 0x2A os bits ligados nas posições 1, 3 e 5 valem 2 + 8 + 32 = 42.",
        workedExamples: [
          ["Isolar um campo", "Em um registrador de 32 bits, o campo de interesse ocupa os bits 8 a 11. Use mascara = 0xF << 8 e campo = (reg & mascara) >> 8."],
          ["Largura garantida", "Para trocar bytes de um protocolo, prefira uint8_t e uint32_t a unsigned int, cuja largura varia entre plataformas."]
        ],
        recallQuestions: [
          "Quantos bits representa um dígito hexadecimal? Resposta: quatro.",
          "Por que CHAR_BIT existe? Resposta: porque a ISO C não fixa o número de bits do byte em 8.",
          "O que acontece ao deslocar por mais posições que a largura? Resposta: comportamento indefinido."
        ],
        masteryCriteria: [
          "Converte entre binário, hexadecimal e decimal sem erro.",
          "Usa máscaras e deslocamentos com tipos de largura conhecida.",
          "Evita deslocamentos fora da faixa válida."
        ],
        tags: ["C10", "binário", "hexadecimal", "bits"],
        estimatedEffort: 30
      }),
    L("Complemento de dois",
      "Entender a representação de inteiros com sinal e suas armadilhas.",
      "Binário, hexadecimal e largura de tipos.",
      "Complemento de dois permite somar números positivos e negativos com o mesmo circuito.",
      "Com n bits, o complemento de dois representa inteiros de -2^(n-1) a 2^(n-1)-1. O bit mais significativo funciona como sinal: com 8 bits, 00000101 é 5 e 11111011 é -5. Para obter o oposto de um valor, inverta todos os bits e some 1: ~5 + 1 é -5. A representação tem um único zero, ao contrário de esquemas históricos com zero positivo e negativo.\n\nA conversão de um unsigned para signed de mesma largura, quando o valor cabe, preserva os bits; quando não cabe, o resultado é definido pela implementação ou sinaliza implementação. Já a conversão de signed para unsigned é definida como redução módulo 2^n, o que explica por que -1 vira 0xFFFFFFFF em uint32_t.\n\nA ISO C17 permite mais de uma representação para inteiros com sinal; a ISO C23 passa a exigir complemento de dois. Na prática, compiladores modernos usam complemento de dois, mas código portátil não deve depender de detalhes como o valor de INT_MIN. Negar INT_MIN transborda e é comportamento indefinido; verifique limites com limits.h antes de operar.",
      [
        ["complemento de dois", "Representação de inteiros com sinal em que -x é obtido invertendo os bits de x e somando 1."],
        ["bit de sinal", "Bit mais significativo que indica o sinal na representação com sinal."],
        ["faixa de representação", "Intervalo de valores que um tipo consegue representar, como -128 a 127 em 8 bits."],
        ["INT_MIN", "Menor valor de int, cuja negação pode transbordar."],
        ["conversão para unsigned", "Conversão definida pela redução do valor módulo 2 elevado à largura do tipo."],
        ["C23", "Versão da ISO C que passa a exigir representação em complemento de dois."]
      ],
      {
        ex: [["11111011 (8 bits)", "Representa -5: inverta os bits para obter 00000100, some 1 e chegue a 5 como magnitude."], ["(uint32_t)-1", "Resulta em 4294967295, pois a conversão é módulo 2^32."]],
        er: ["Negar INT_MIN sem verificar o limite.", "Achar que a ISO C17 garante uma única representação para inteiros com sinal."],
        lab: "Em um programa, imprima em hexadecimal um int8_t com valor -5 e confirme os bits 11111011; depois teste o que ocorre ao converter -1 para uint8_t.",
        ref: "ISO/IEC 9899:2018 (C17) e ISO/IEC 9899:2024 (C23), representação de inteiros; limits.h e stdint.h.",
        derivation: "Em 8 bits, 2^8 = 256. O padrão 11111011 vale 251 como unsigned. Como representa negativo, seu valor é 251 - 256 = -5. De forma geral, um padrão com bit de sinal ligado vale p - 2^n.",
        workedExamples: [
          ["Soma com sinal", "5 + (-5) em 8 bits: 00000101 + 11111011 = 100000000. O nono bit é descartado e resta 00000000, o zero."],
          ["Faixa de int8_t", "Com 8 bits, o maior valor é 01111111 = 127 e o menor é 10000000 = -128. Tentar guardar 128 exige tipo maior."]
        ],
        recallQuestions: [
          "Como obter o oposto de um valor em complemento de dois? Resposta: inverter os bits e somar 1.",
          "Qual é a faixa de um inteiro com sinal de n bits? Resposta: de -2^(n-1) a 2^(n-1)-1.",
          "Por que -INT_MIN é perigoso? Resposta: INT_MIN não tem oposto representável e a negação transborda."
        ],
        masteryCriteria: [
          "Converte valores entre representações com e sem sinal.",
          "Explica a faixa assimétrica do complemento de dois.",
          "Evita negação e conversão fora da faixa."
        ],
        tags: ["C10", "complemento de dois", "inteiros", "C17/C23"],
        estimatedEffort: 30
      }),
    L("Endianness e serialização",
      "Entender a ordem dos bytes e por que despejar estruturas não é protocolo.",
      "Binário e complemento de dois.",
      "A ordem dos bytes não muda o valor, mas muda a leitura feita por outra máquina.",
      "Endianness descreve a ordem em que os bytes de um valor multibyte são armazenados. Em little-endian, o byte menos significativo vem primeiro; em big-endian, o mais significativo vem primeiro. O valor 0x12345678 ocupa, do menor endereço ao maior, 78 56 34 12 em little-endian e 12 34 56 78 em big-endian. A ISO C não especifica essa ordem.\n\nO problema aparece quando bytes são trocados entre sistemas ou interpretados como outro tipo. Protocolos de rede historicamente usam big-endian, chamada ordem de rede; POSIX oferece htons, htonl, ntohs e ntohl para conversão em arquiteturas com ordem diferente. APIs de sockets podem exigir essas funções para portas e endereços.\n\nA forma mais portátil de serializar é explícita: escreva cada byte com deslocamentos e máscaras sobre um tipo sem sinal de largura fixa, e reconstrua o valor no receptor. Não despeje a memória de uma struct: há padding, alinhamento, ordem de bytes e tamanhos diferentes entre compiladores. Converter um char* arbitrário em uint32_t* para ler quatro bytes também é problemático, pois pode violar alinhamento e regras de aliasing. Acesso byte a byte por unsigned char é permitido para inspecionar a representação de qualquer objeto.",
      [
        ["endianness", "Ordem em que os bytes de um valor multibyte são armazenados na memória."],
        ["little-endian", "Ordem em que o byte menos significativo fica no menor endereço."],
        ["big-endian", "Ordem em que o byte mais significativo fica no menor endereço."],
        ["ordem de rede", "Convenção big-endian usada por protocolos de rede; POSIX fornece funções de conversão."],
        ["serialização explícita", "Codificação determinística de valores em bytes por deslocamentos e máscaras."],
        ["padding", "Bytes de preenchimento inseridos pelo compilador entre campos de uma struct."]
      ],
      {
        ex: [["0x12345678 em little-endian", "Bytes 78 56 34 12 do menor para o maior endereço."], ["htons(80)", "Converte a porta 80 da ordem local para a ordem de rede em sockets POSIX."]],
        er: ["Transmitir uma struct diretamente com fwrite e assumir que o receptor lê igual.", "Converter um buffer de bytes em ponteiro para uint32_t sem garantir alinhamento."],
        lab: "Escreva encode_u32 e decode_u32 usando uint8_t e deslocamentos; teste com 0x12345678 e verifique o mesmo valor em qualquer arquitetura.",
        ref: "ISO/IEC 9899:2018 (C17), representação de objetos; POSIX.1-2017, funções htons/htonl/ntohs/ntohl; páginas de manual de sockets.",
        derivation: "Para codificar v em big-endian, o byte i é (v >> (8*(3-i))) & 0xFF, com i de 0 a 3. A decodificação reconstrói v somando byte_i << (8*(3-i)). Nenhuma suposição sobre a ordem local é necessária.",
        workedExamples: [
          ["Codificação manual", "v = 0x12345678: bytes 0x12, 0x34, 0x56, 0x78. Receptor monta 0x12<<24 | 0x34<<16 | 0x56<<8 | 0x78."],
          ["Inspeção de representação", "Com unsigned char *p = (unsigned char *)&valor; é permitido ler os bytes individuais de valor e descobrir a ordem local."]
        ],
        recallQuestions: [
          "A ISO C define a endianness? Resposta: não.",
          "O que faz htons? Resposta: converte um inteiro curto da ordem local para a ordem de rede.",
          "Por que não transmitir structs cruas? Resposta: padding, alinhamento e ordem de bytes variam."
        ],
        masteryCriteria: [
          "Explica a diferença entre little-endian e big-endian.",
          "Codifica e decodifica inteiros de forma determinística.",
          "Identifica problemas de aliasing e alinhamento em leitura de buffers."
        ],
        tags: ["C10", "endianness", "serialização", "rede"],
        estimatedEffort: 35
      }),
    L("Ponto flutuante IEEE 754",
      "Entender precisão, arredondamento e comparação de números em ponto flutuante.",
      "Binário e conversões numéricas.",
      "Float não é decimal exato: 0,1 não cabe em binário finito, assim como 1/3 não cabe em decimal finito.",
      "A norma IEEE 754 define formatos binários usados por compiladores modernos. binary32 (float) tem 1 bit de sinal, 8 de expoente e 23 de fração; binary64 (double) tem 1, 11 e 52. Para números normais, o valor é (-1)^s × (1 + fração) × 2^(expoente - viés), com viés 127 em binary32 e 1023 em binary64. O bit implícito inicial 1 não é armazenado.\n\nExpoentes extremos reservam padrões especiais: infinito, NaN (not a number) e números subnormais, que preenchem a faixa entre zero e o menor normal. A operação arredonda ao representar o resultado; por padrão, o arredondamento é para o mais próximo, com regras para empate. A conformidade da implementação C com IEC 60559 é opcional, e long double tem formato dependente da plataforma.\n\nConsequências práticas: 0,1 + 0,2 pode não ser exatamente 0,3; compare com tolerância quando o domínio permitir, e nunca use float para valores monetários — use inteiros em centavos ou decimal. Inteiros são exatos até 2^24 em float e 2^53 em double. Atenção também às conversões: int muito grande em float perde bits de baixa ordem, e NaN quebra comparações de igualdade.",
      [
        ["IEEE 754", "Norma de aritmética em ponto flutuante com formatos, arredondamento e valores especiais."],
        ["significando", "Parte do número que contém os bits de precisão, também chamada mantissa."],
        ["expoente e viés", "Campos que codificam a potência de dois; o viés permite expoentes negativos."],
        ["subnormal", "Número muito próximo de zero sem o bit implícito inicial."],
        ["NaN", "Valor especial usado para resultado indefinido, como 0/0 em ponto flutuante."],
        ["precisão", "Quantidade de bits significativos disponíveis, cerca de 24 em float e 53 em double."]
      ],
      {
        ex: [["0,1 + 0,2", "Em binary64 o resultado impresso com muitos dígitos difere de 0,3; use tolerância ou formato decimal."], ["2^24 + 1 em float", "Não é representável: o campo de 24 bits significativos já foi usado, e o valor é arredondado."]],
        er: ["Comparar dois doubles com == após cálculos encadeados.", "Usar float para somar dinheiro."],
        lab: "Some 0,1 dez vezes em float e em double, imprima com 17 casas e compare com 1,0; registre a diferença.",
        ref: "IEEE 754-2019; ISO/IEC 9899:2018 (C17), float.h e anexo sobre aritmética IEC 60559; artigo clássico de David Goldberg sobre ponto flutuante.",
        derivation: "O valor normal é (-1)^s × (1.f) × 2^(E-bias). Em binary32, E = 127 representa 2^0; E = 0 com fração não nula indica subnormal. O bit inicial 1 é implícito porque todo normal o possui.",
        workedExamples: [
          ["Representar 6,5", "6,5 = 1,625 × 2^2; em binary32, expoente armazenado é 127 + 2 = 129 e a fração codifica 0,625 = 0,101 em binário."],
          ["Tolerância relativa", "Para comparar a e b, use |a-b| <= eps × max(|a|, |b|) com eps adequado ao domínio; escolha do limite faz parte do contrato."]
        ],
        recallQuestions: [
          "Quantos bits de significado tem binary64? Resposta: 53, dos quais 52 são armazenados.",
          "O que é um subnormal? Resposta: número sem o bit implícito, usado para valores muito próximos de zero.",
          "Por que evitar float para dinheiro? Resposta: decimais como 0,1 não são exatos em binário."
        ],
        masteryCriteria: [
          "Descreve os campos sinal, expoente e fração.",
          "Explica por que comparações exatas falham após cálculos.",
          "Escolhe entre ponto flutuante, decimal e inteiro conforme o domínio."
        ],
        tags: ["C10", "IEEE 754", "float", "precisão"],
        estimatedEffort: 35
      }),
    L("Overflow e conversões",
      "Prever e evitar transbordos em operações inteiras e conversões.",
      "Complemento de dois e ponto flutuante.",
      "Unsigned envolve; signed transborda e o padrão não define o resultado.",
      "Aritmética com unsigned é definida módulo 2^n: em uint8_t, 255 + 1 é 0. Isso é útil para hashing e aritmética de índices, mas catastrófico se usado como erro de entrada. Aritmética com signed que excede a faixa é comportamento indefinido: o compilador pode otimizar com base na suposição de que isso nunca acontece. Dividir por zero e calcular INT_MIN / -1 também são indefinidos.\n\nAs regras de conversão surpreendem. Tipos menores que int são promovidos a int em expressões; em uma operação mista signed/unsigned de mesma categoria, o operand signed é convertido para unsigned. Assim, -1 < 1u é falso em muitas plataformas, porque -1 vira um unsigned grande. size_t é sem sinal e, se usado como contador decrescente, pode envolver para um valor enorme quando chega a zero.\n\nA defesa é checar antes de operar. Para soma, teste se b > SIZE_MAX - a; para multiplicação, teste se a != 0 && b > SIZE_MAX / a. Converta entradas com strtol e verifique errno e o ponteiro de fim; valide intervalos antes de converter para tipos menores. A opção -Wconversion do GCC e do Clang ajuda a encontrar conversões estreitas, e sanitizers detectam alguns transbordos em tempo de execução.",
      [
        ["overflow", "Situação em que o resultado de uma operação excede a faixa representável do tipo."],
        ["wraparound", "Comportamento definido de aritmética unsigned que reduz o resultado módulo 2^n."],
        ["promoção inteira", "Conversão automática de tipos pequenos para int ou unsigned int em expressões."],
        ["conversões usuais", "Regras que transformam os operandos de uma operação em um tipo comum."],
        ["size_t", "Tipo sem sinal usado para tamanhos e índices, definido em stddef.h."],
        ["checagem antes da operação", "Validação que impede o transbordo em vez de tentar detectá-lo depois."]
      ],
      {
        ex: [["255u + 1u em uint8_t", "Resultado 0 por wraparound, definido pela ISO C."], ["if (b > SIZE_MAX - a)", "Teste seguro antes de somar dois size_t."]],
        er: ["Usar size_t como contador que decrementa até abaixo de zero.", "Confiar que signed overflow vai envolver como unsigned."],
        lab: "Escreva funções seguras soma_size e mult_size que retornam 0 em caso de transbordo; teste com SIZE_MAX e valores próximos.",
        ref: "ISO/IEC 9899:2018 (C17), conversões e limits.h/stdint.h; documentação do GCC sobre -Wconversion e -fsanitize=undefined.",
        derivation: "Se a + b > SIZE_MAX, então b > SIZE_MAX - a. Como o lado direito é calculado sem transbordo, o teste é seguro. Para multiplicação, se a > 0 e b > SIZE_MAX / a, então a*b excede o limite.",
        workedExamples: [
          ["Comparação mista", "int x = -1; if (x < 1u) toma o ramo falso em implementações usuais, pois x é convertido a unsigned antes da comparação."],
          ["Alocação segura", "Antes de malloc(n * sizeof *p), verifique se n > SIZE_MAX / sizeof *p; use o padrão de realloc com ponteiro temporário ao redimensionar."]
        ],
        recallQuestions: [
          "O que acontece no overflow de unsigned? Resposta: o resultado é reduzido módulo 2^n.",
          "E no overflow de signed? Resposta: é comportamento indefinido.",
          "Como checar multiplicação antes de executá-la? Resposta: compare um fator com o limite dividido pelo outro."
        ],
        masteryCriteria: [
          "Distingue wraparound definido de overflow indefinido.",
          "Prevê o resultado de operações mistas signed/unsigned.",
          "Implementa checagens de limites antes de somar e multiplicar."
        ],
        tags: ["C10", "overflow", "conversões", "size_t"],
        estimatedEffort: 35
      }),
    L("ABI, registradores e stack frame",
      "Relacionar código C ao que acontece na chamada de função em nível de máquina.",
      "Binário, endianness e modelo de memória da trilha inicial.",
      "A ABI é o contrato silencioso que permite a um arquivo objeto chamar código compilado por outro.",
      "ABI (application binary interface) define como argumentos são passados, onde o resultado volta, quais registradores o chamador deve preservar, como a pilha é alinhada e como a memória é organizada. Isso não é especificado pela ISO C; cada combinação de arquitetura e sistema operacional tem a sua. Em System V AMD64, comum em Linux x86-64, os primeiros argumentos inteiros ou de ponteiro usam rdi, rsi, rdx, rcx, r8 e r9; o resultado inteiro volta em rax. Windows x86-64 usa outra convenção, com rcx, rdx, r8 e r9 nos primeiros argumentos.\n\nA pilha cresce para endereços menores na maioria das arquiteturas. A instrução call empilha o endereço de retorno; a função chamada pode executar um prólogo como push rbp seguido de mov rbp, rsp, reservar espaço para variáveis locais e restaurar tudo no epilogue antes de ret. Esse bloco é o stack frame. Registradores chamados caller-saved podem ser destruídos pela chamada; os callee-saved devem ser restaurados pela função chamada.\n\nCompiladores com otimização podem eliminar o frame pointer, o que dificulta backtraces; -fno-omit-frame-pointer ajuda ferramentas de depuração e perfilhamento. Recursão profunda ou arrays locais grandes esgotam a pilha. Tamanhos de int e double, alinhamento e o layout de struct também pertencem à ABI: para tipos com largura garantida, use stdint.h em vez de suposições sobre registradores.",
      [
        ["ABI", "Conjunto de regras binárias de chamada, layout e alinhamento entre módulos compilados."],
        ["convenção de chamada", "Regra que define onde argumentos e resultados são colocados em uma chamada."],
        ["registrador", "Pequena memória interna do processador usada pelo código gerado."],
        ["stack frame", "Região da pilha reservada para uma chamada, com retorno, parâmetros e locais."],
        ["prólogo e epílogo", "Sequências de instruções que preparam e desmontam o stack frame."],
        ["caller-saved e callee-saved", "Classificação de registradores quanto a quem deve preservar seu valor na chamada."]
      ],
      {
        ex: [["System V AMD64", "Argumentos inteiros em rdi, rsi, rdx, rcx, r8, r9; retorno em rax."], ["-fno-omit-frame-pointer", "Opção que preserva o registrador de frame para facilitar depuração e profiling."]],
        er: ["Assumir os mesmos registradores do Linux x86-64 no Windows ou no ARM.", "Achar que int sempre tem 32 bits por causa da ABI."],
        lab: "Compile uma função simples em Compiler Explorer com -O0 e -O2; identifique prólogo, acesso a parâmetros e retorno nos dois casos.",
        ref: "System V AMD64 ABI (documentação oficial de arquitetura); manual do GCC sobre opções de otimização e frame pointer; ISO/IEC 9899:2018 (C17) para o que é e não é padrão.",
        derivation: "Se a função usa callee-saved rbx, ela deve salvar o valor anterior no prólogo e restaurá-lo no epilogue; caso contrário, o chamador verá seu próprio estado corrompido após o retorno. Essa obrigação é parte da ABI, não da linguagem C.",
        workedExamples: [
          ["Chamada com seis argumentos", "Em System V AMD64, os seis primeiros inteiros cabem nos registradores listados; o sétimo vai na pilha, conforme a ABI."],
          ["Variáveis locais", "Um array local grande é alocado no frame da pilha; estourar esse espaço é falha de pilha, não erro de sintaxe C."]
        ],
        recallQuestions: [
          "A ABI é definida pela ISO C? Resposta: não; é específica de plataforma.",
          "Para que serve o prólogo da função? Resposta: prepara o frame e salva registradores que devem ser preservados.",
          "Qual opção ajuda a manter backtraces legíveis? Resposta: -fno-omit-frame-pointer, com -g."
        ],
        masteryCriteria: [
          "Distingue regras da linguagem de regras da ABI.",
          "Descreve prólogo, epílogo e direção de crescimento da pilha.",
          "Explica por que tamanhos de tipos e registradores variam entre plataformas."
        ],
        tags: ["C10", "ABI", "stack frame", "registradores"],
        estimatedEffort: 40
      })
  ]
});
CURRICULUM.c.modules.push({
  name: "C11 — Depuração e qualidade",
  lessons: [
    L("Avisos do compilador como primeira defesa",
      "Usar opções de aviso para detectar erros antes da execução.",
      "Compilação com GCC ou Clang e leitura de mensagens de erro.",
      "O compilador é o primeiro revisor de código: ele lê cada linha com mais atenção do que nós.",
      "Uma linha de compilação recomendada para desenvolvimento é gcc -std=c17 -Wall -Wextra -Wpedantic -Wconversion -Wshadow -g -O0 main.c -o app. -Wall e -Wextra ativam conjuntos amplos de avisos; -Wpedantic sinaliza o uso de extensões fora da ISO C quando se pede um modo padrão; -Wconversion aponta conversões que podem perder dados; -Wshadow avisa quando uma variável local esconde outra de escopo maior.\n\nAs opções -g e -O0 não produzem avisos: elas inserem informação de depuração e desativam otimizações para que a execução acompanhe o código-fonte. Em build de release, -O2 é comum; para depurar, recompile com -O0. -Werror transforma avisos em erros, o que é útil em integração contínua, mas pode quebrar a compilação quando uma versão nova do compilador introduz avisos adicionais.\n\nA regra prática é entender e corrigir a causa de cada aviso, em vez de silenciá-lo. GCC e Clang têm conjuntos parecidos, mas não idênticos, e os avisos não substituem análise estática, testes ou revisão. Avisos sobre conversões e sombreamento costumam revelar bugs reais em código C.",
      [
        ["-Wall/-Wextra", "Opções de GCC e Clang que habilitam conjuntos amplos de avisos de compilação."],
        ["-Wpedantic", "Opção que examina a conformidade com o padrão e aponta extensões não padrão."],
        ["-Wconversion", "Opção que avisa sobre conversões implícitas potencialmente perigosas."],
        ["-Wshadow", "Opção que avisa quando um identificador local esconde outro visível."],
        ["-g", "Opção que inclui informações de depuração no executável."],
        ["-Werror", "Opção que trata avisos como erros e interrompe a compilação."]
      ],
      {
        ex: [["gcc -std=c17 -Wall -Wextra -Wpedantic -Wconversion -Wshadow -g -O0 main.c -o app", "Compilação típica para desenvolvimento e depuração."], ["int x; double y = x;", "Expressão que -Wconversion pode sinalizar quando há perda ou mudança de precisão."]],
        er: ["Ignorar avisos sistematicamente porque o programa ainda executa.", "Usar -Werror sem acompanhar mudanças de versão do compilador no CI."],
        lab: "Compile um programa com a linha recomendada, corrija todos os avisos e registre a causa de cada um.",
        ref: "Manual do GCC, capítulo de opções de aviso; documentação do Clang sobre diagnósticos; ISO/IEC 9899:2018 para distinguir padrão de extensão.",
        derivation: "-Wpedantic não muda o código gerado: ele apenas torna visível o uso de construções que o modo -std=c17 não define. Assim, a mesma fonte pode compilar com GCC e falhar em compilador estritamente conformante.",
        workedExamples: [
          [" Variável sombreada", "Se uma função tem parâmetro tam e declara int tam dentro de um bloco, -Wshadow avisa. O corpo passa a usar o valor interno, não o parâmetro, e o bug é silencioso sem o aviso."],
          ["Extensão detectada", "Declaração aninhada de função ou certo uso de statement expressions é aceita como extensão por GCC, mas -Wpedantic a sinaliza em modo padrão."]
        ],
        recallQuestions: [
          "O que -Wpedantic detecta? Resposta: uso de construções fora do padrão solicitado.",
          "O que -g faz? Resposta: inclui informação de depuração, sem alterar a lógica do programa.",
          "-Werror é obrigatório? Resposta: não; é uma política estrita, útil em CI, mas sensível a versões do compilador."
        ],
        masteryCriteria: [
          "Monta uma linha de compilação com avisos amplos e símbolos de depuração.",
          "Corrige a causa dos avisos em vez de suprimi-los.",
          "Distingue aviso de extensão de aviso de erro lógico."
        ],
        tags: ["C11", "warnings", "gcc", "clang"],
        estimatedEffort: 25
      }),
    L("Sanitizers ASan e UBSan",
      "Detectar erros de memória e comportamento indefinido em tempo de execução.",
      "Compilação com símbolos e avisos.",
      "Sanitizers instrumentam o programa para perguntar ao computador se cada acesso é válido.",
      "Quando o compilador oferece suporte, use gcc -std=c17 -g -O1 -fsanitize=address,undefined -fno-omit-frame-pointer main.c -o app. O AddressSanitizer (ASan) insere verificações e regiões de proteção ao redor de alocações, detectando acessos fora dos limites, uso após liberação e liberação duplicada. O UndefinedBehaviorSanitizer (UBSan) instrumenta operações como overflow de signed, deslocamentos inválidos, desalinhamento e certas conversões.\n\nEssas ferramentas exigem biblioteca de runtime e não estão disponíveis em todas as plataformas ou compiladores. Podem mudar o layout de memória e o tempo de execução, por isso um bug dependente de concorrência pode desaparecer. O nível -O1 é um compromisso entre otimização e rastreabilidade; -fno-omit-frame-pointer melhora os relatórios.\n\nSanitizers não provam ausência de bugs: apenas os problemas encontrados na execução instrumentada são reportados. Devem rodar sobre a suíte de testes, com entradas variadas, e complementam Valgrind e análise estática. Em geral não são usados em binários de produção, mas podem fazer parte do pipeline de integração contínua.",
      [
        ["sanitizer", "Ferramenta que instrumenta o código para detectar classes de erros em execução."],
        ["ASan", "AddressSanitizer, voltado a erros de memória como acesso inválido e uso após free."],
        ["UBSan", "UndefinedBehaviorSanitizer, voltado a operações com comportamento indefinido."],
        ["redzone", "Região de proteção inserida ao redor de alocações para detectar acessos além dos limites."],
        ["instrumentação", "Inserção de verificações no código pelo compilador."],
        ["complementaridade", "Ideia de que nenhuma ferramenta sozinha cobre todos os defeitos."]
      ],
      {
        ex: [["gcc -std=c17 -g -O1 -fsanitize=address,undefined -fno-omit-frame-pointer main.c -o app", "Compila com os dois sanitizers mais usados."], ["Acesso a v[10] em um vetor de 10 elementos", "ASan aponta leitura fora dos limites com a linha do acesso."]],
        er: ["Achar que executar sem relatório prova que não há bugs.", "Usar sanitizers apenas em uma única entrada feliz."],
        lab: "Compile um programa de teste com um acesso fora dos limites em laboratório isolado, execute sob ASan e anote o relatório produzido.",
        ref: "Documentação oficial do GCC e do Clang sobre -fsanitize=address e -fsanitize=undefined; projeto AddressSanitizer (github.com/google/sanitizers).",
        derivation: "A instrumentação acrescenta verificações antes de cada acesso e mantém metadados sobre alocações. Quando o endereço cai em redzone ou em bloco já liberado, a runtime exibe o erro e encerra o processo.",
        workedExamples: [
          ["Erro de memória", "Um vetor malloc(10 * sizeof(int)) acessado na posição 10 é detectado por ASan como heap-buffer-overflow, com linha e tipo de acesso."],
          ["Overflow de signed", "int a = INT_MAX; a = a + 1; compilado com UBSan reporta signed integer overflow na linha da soma."]
        ],
        recallQuestions: [
          "O que ASan detecta? Resposta: acessos inválidos e erros de gerenciamento de memória.",
          "O que UBSan detecta? Resposta: operações com comportamento indefinido instrumentadas.",
          "Sanitizers provam ausência de bugs? Resposta: não; detectam apenas o que ocorre na execução testada."
        ],
        masteryCriteria: [
          "Compila e executa um programa com ASan e UBSan.",
          "Interpreta relatórios básicos de erro apontados pela ferramenta.",
          "Explica limitações e complementaridade com outras ferramentas."
        ],
        tags: ["C11", "ASan", "UBSan", "depuração"],
        estimatedEffort: 35
      }),
    L("GDB: comandos essenciais",
      "Controlar a execução e inspecionar estado com o depurador GDB.",
      "Compilação com -g e -O0.",
      "GDB permite congelar o programa, olhar variáveis e avançar passo a passo.",
      "Depure com um executável compilado com -g e preferencialmente -O0; sem símbolos, nomes de variáveis e linhas podem estar ausentes. Inicie com gdb ./app. Os comandos fundamentais são break main (define ponto de parada), run (inicia o programa), next (avança uma linha sem entrar em funções), step (entra na função chamada), print variavel (mostra valor), backtrace (pilha de chamadas), watch variavel (para quando o valor muda), continue (retoma até o próximo ponto de parada) e quit.\n\nPontos de parada também podem ser definidos por arquivo e linha, ou com condição, como break util.c:20 if n > 10. Um watchpoint depende de recursos de hardware e pode ser limitado pela arquitetura. backtrace é a primeira ferramenta a usar diante de falha: mostra quem chamou quem. As variáveis podem ser alteradas em tempo de depuração com print nome = valor, mas isso muda apenas a execução atual.\n\nGDB é uma ferramenta externa, não parte da ISO C. Otimizações agressivas podem reordenar ou eliminar variáveis, tornando next e print confusos; por isso a reconstrução com -O0 é comum. O modo em lote, gdb -batch -ex run -ex bt ./app, permite integrar o depurador a scripts.",
      [
        ["ponto de parada", "Posição no código onde a execução é interrompida pelo depurador."],
        ["next e step", "Comandos para avançar uma linha, entrando ou não nas funções chamadas."],
        ["watchpoint", "Ponto de parada ativado quando uma expressão ou variável muda."],
        ["backtrace", "Lista de chamadas ativas que mostra o caminho até a falha."],
        ["símbolos de depuração", "Informação gerada com -g que associa código de máquina a nomes e linhas do fonte."],
        ["modo em lote", "Execução não interativa do GDB por meio de comandos -ex."]
      ],
      {
        ex: [["break main", "Cria ponto de parada no início da função main."], ["backtrace", "Mostra a pilha de chamadas no momento da parada."]],
        er: ["Depurar sem -g e esperar ver nomes de variáveis.", "Usar next quando o interesse é entrar na função chamada; nesse caso o comando é step."],
        lab: "Compile com -g -O0, coloque break main, use next, step, print e backtrace em uma função com erro simples.",
        ref: "Manual do GNU Debugger (sourceware.org/gdb/documentation), capítulos sobre breakpoints, stepping e backtrace.",
        derivation: "O depurador usa a tabela de símbolos para mapear endereços de máquina a linhas do fonte. Sem -g, ele consegue parar por endereço, mas não consegue mostrar o nome da variável nem a linha correspondente.",
        workedExamples: [
          ["Localizar falha", "Ao parar por sinal de falha de segmentação, backtrace mostra main chamando processar, que chamou uma função com ponteiro inválido."],
          ["Condição útil", "Em um laço de mil iterações, break arquivo.c:42 if i == 999 evita parar novecentas e noventa e nove vezes."]
        ],
        recallQuestions: [
          "Qual comando entra na função chamada? Resposta: step.",
          "O que mostra backtrace? Resposta: a pilha de chamadas até o ponto atual.",
          "Por que compilar com -O0 para depurar? Resposta: evita que otimizações reordenem ou eliminem variáveis."
        ],
        masteryCriteria: [
          "Define e usa pontos de parada simples e condicionais.",
          "Distingue next de step e interpreta backtrace.",
          "Explica a importância de -g e -O0."
        ],
        tags: ["C11", "GDB", "depuração", "backtrace"],
        estimatedEffort: 35
      }),
    L("Valgrind e Memcheck",
      "Usar Valgrind para encontrar acessos inválidos e vazamentos em Linux.",
      "Compilação com -g e noção de heap.",
      "Valgrind observa o programa por fora, como um fiscal que verifica cada movimentação de memória.",
      "O comando típico em Linux é valgrind --leak-check=full --track-origins=yes ./app. O tool Memcheck, padrão do Valgrind, detecta leituras e escritas em posições inválidas, uso de valores não inicializados e vazamentos de memória. --leak-check=full detalha os blocos não liberados; --track-origins=yes tenta mostrar onde um valor não inicializado foi criado.\n\nO relatório de vazamentos separa categorias como definitely lost, indirectly lost, possibly lost e still reachable. Nem toda memória ainda alcançável é erro: bibliotecas podem manter caches até o fim do processo. O importante é entender cada categoria antes de agir. Valgrind executa o programa em uma máquina virtual, portanto é bem mais lento que a execução normal e pode não funcionar em todas as arquiteturas.\n\nMemcheck não detecta condições de corrida entre threads; para isso existem outras ferramentas, como Helgrind e ThreadSanitizer. Sanitizers e Valgrind são complementares: um instrumenta dentro do binário, outro observa por fora, com cobertura e custos diferentes. Nenhum dos dois prova que o programa está livre de todos os defeitos. Compile com -g para que os endereços apareçam com nomes de funções e linhas.",
      [
        ["Valgrind", "Framework de ferramentas de depuração e perfilhamento, comum em Linux."],
        ["Memcheck", "Ferramenta do Valgrind voltada a erros de memória e vazamentos."],
        ["vazamento", "Memória alocada que não é liberada nem permanece alcançável de forma útil."],
        ["valor não inicializado", "Conteúdo lido de memória que nunca recebeu valor definido."],
        ["track-origins", "Opção que rastreia a origem provável de valores não inicializados."],
        ["still reachable", "Categoria de memória não liberada, mas ainda referenciada ao final da execução."]
      ],
      {
        ex: [["valgrind --leak-check=full --track-origins=yes ./app", "Executa o programa com relatório completo de vazamentos e origens."], ["Leitura de v[5] em vetor de cinco elementos", "Memcheck informa invalid read fora da região alocada."]],
        er: ["Tratar todo still reachable como vazamento obrigatório sem entender o contexto.", "Rodar Valgrind com binário sem -g e esperar nomes de funções no relatório."],
        lab: "Em laboratório isolado, execute um programa com um bloco alocado e não liberado sob Valgrind; leia o relatório e corrija o código.",
        ref: "Documentação oficial do Valgrind (valgrind.org/docs), manual do Memcheck; páginas de manual de sistemas Linux.",
        derivation: "Memcheck mantém metadados de validade por byte. Se uma instrução lê bytes marcados como indefinidos ou fora de blocos alocados, a ferramenta emite diagnóstico com pilha de chamadas obtida dos símbolos de depuração.",
        workedExamples: [
          ["Vazamento simples", "malloc(64) sem free correspondente aparece como definitely lost, com a linha da alocação quando o binário tem -g."],
          ["Origem do dado", "Uma variável local usada antes de receber valor gera Conditional jump depends on uninitialised value; --track-origins aponta a declaração."]
        ],
        recallQuestions: [
          "O que --leak-check=full faz? Resposta: detalha blocos de memória não liberados ao final.",
          "Memcheck detecta races entre threads? Resposta: não; use ferramenta específica para concorrência.",
          "Por que Valgrind é lento? Resposta: executa o programa em máquina virtual com instrumentação externa."
        ],
        masteryCriteria: [
          "Executa Valgrind com opções básicas e lê o relatório.",
          "Distingue categorias de vazamento e acessos inválidos.",
          "Explica limites e complementaridade com sanitizers."
        ],
        tags: ["C11", "Valgrind", "vazamentos", "Linux"],
        estimatedEffort: 35
      }),
    L("Metodologia de depuração",
      "Transformar um comportamento misterioso em um problema reproduzível e corrigido.",
      "Avisos, sanitizers, GDB e Valgrind.",
      "Depurar é investigar: primeiro reproduzir, depois reduzir, só então mexer no código.",
      "O primeiro passo é reproduzir a falha de forma determinística: mesma entrada, mesma compilação, mesmo ambiente. Sem reprodução, qualquer mudança é palpite. Em seguida, reduza a entrada ao menor caso que ainda falha; um programa com três linhas revela mais do que um com três mil.\n\nFormule hipóteses explícitas e teste uma por vez. Observe com ferramentas: backtrace no GDB, relatório de ASan/UBSan, Valgrind, logs com contexto e verificação de retornos de função e errno. Mude uma única variável por experimento. Quando encontrar a causa, escreva um teste de regressão que falhava antes e passa depois; sem ele, o bug volta.\n\nNem todo problema está no código: pode estar no build, na configuração, em permissões ou em dependência de plataforma. Documente a versão do compilador, as flags e o sistema. Para processo travado, tente primeiro solicitar encerramento gracioso, por exemplo sinal SIGTERM, e reserve o sinal de encerramento forçado como último recurso após preservar evidência. Concluir que 'agora funciona' sem causa identificada não é correção.",
      [
        ["reprodução", "Capacidade de fazer a falha ocorrer de forma repetível e controlada."],
        ["minimização", "Redução da entrada ou do código ao menor caso que ainda apresenta o defeito."],
        ["hipótese", "Explicação provisória que pode ser confirmada ou refutada por experimento."],
        ["teste de regressão", "Teste que captura um bug corrigido e impede seu retorno."],
        ["evidência", "Dados observáveis, como logs, relatórios e saídas, que sustentam o diagnóstico."],
        ["encerramento gracioso", "Terminação que permite ao processo salvar estado e liberar recursos antes de sair."]
      ],
      {
        ex: [["Falha apenas em produção", "Compare flags de build, bibliotecas e entradas; erro dependente de otimização pode desaparecer com -O0."], ["Bug intermitente", "Registre semente aleatória e ordem de execução para tornar o caso reproduzível."]],
        er: ["Alterar várias coisas ao mesmo tempo e atribuir a melhora a uma delas.", "Encerrar processo com sinal forçado antes de tentar terminação graciosa e coletar evidência."],
        lab: "Documente uma sessão de depuração com: entrada mínima, hipótese, comando usado, evidência e teste de regressão final.",
        ref: "Práticas de depuração descritas em manuais de GDB e em texto clássico de Kernighan & Ritchie sobre depuração de programas C.",
        derivation: "Se a entrada mínima ainda reproduz a falha, o espaço de causas foi reduzido. Cada experimento que refuta uma hipótese remove uma classe de explicações, até restar a causa observável.",
        workedExamples: [
          ["Divisão ao meio", "Com um arquivo de entrada grande, teste metades sucessivas até isolar a linha que dispara o erro."],
          ["Regressão", "Bug de índice negativo em vetor: corrija o limite e adicione caso de teste com índice -1."]
        ],
        recallQuestions: [
          "Qual é o primeiro passo de uma boa depuração? Resposta: reproduzir a falha de forma controlada.",
          "Por que escrever teste de regressão? Resposta: para impedir que o mesmo bug volte.",
          "Qual sinal usar primeiro para encerrar um processo preso? Resposta: SIGTERM, deixando o forçado como último recurso."
        ],
        masteryCriteria: [
          "Produz casos mínimos de reprodução.",
          "Testa hipóteses isoladas e registra evidência.",
          "Cria teste de regressão após a correção."
        ],
        tags: ["C11", "metodologia", "regressão", "evidência"],
        estimatedEffort: 30
      }),
    L("Contratos, assert e testes de regressão",
      "Documentar premissas e transformar comportamento esperado em testes executáveis.",
      "Funções, ponteiros e metodologia de depuração.",
      "Um contrato diz o que a função exige antes e garante depois; assert verifica o que é interno.",
      "Pré-condição é o que o chamador deve garantir; pós-condição é o que a função garante ao terminar. Documentar ambas evita ambiguidade sobre ponteiro nulo, intervalo válido e ownership do resultado. O macro assert, de assert.h, interrompe o programa se a expressão for falsa e serve para invariantes internos. Compilar com NDEBUG remove as verificações, portanto assert não deve validar entrada do usuário nem substituir tratamento de erro.\n\nUm teste de regressão pequeno e determinístico é a forma mais confiável de preservar uma correção. Uma suíte mínima cobre caso típico, entrada vazia, um elemento, limites, valor inválido e falha de alocação quando aplicável. Em C, um harness simples pode chamar funções e comparar resultados com valores esperados; frameworks e scripts de build apenas automatizam isso.\n\nIntegração contínua costuma executar compilação com avisos, testes e uma passagem com sanitizers. Cobertura de código mostra quais linhas foram executadas, mas não prova que as asserções dos testes são corretas. O contrato escrito, os testes e a documentação de interface devem evoluir juntos.",
      [
        ["pré-condição", "Condição que o chamador deve satisfazer antes de chamar uma função."],
        ["pós-condição", "Condição que a função garante ao concluir, inclusive em caso de erro documentado."],
        ["assert", "Macro de assert.h que verifica uma expressão e aborta se ela for falsa."],
        ["NDEBUG", "Macro que desativa as verificações de assert em compilação de release."],
        ["teste de regressão", "Teste criado a partir de um bug conhecido para impedir que ele reapareça."],
        ["cobertura", "Medida de quais partes do código foram executadas pelos testes."]
      ],
      {
        ex: [["assert(v != NULL && n > 0);", "Verifica premissa interna antes de percorrer um vetor."], ["Casos de teste", "Vetor vazio, um elemento, ordenado, invertido e com valores repetidos."]],
        er: ["Usar assert para validar dados vindos de arquivo ou rede.", "Confiar que alta cobertura implica ausência de bugs."],
        lab: "Escreva contrato, três asserts internos e cinco testes de regressão para uma função que remove elemento de vetor.",
        ref: "ISO/IEC 9899:2018 (C17), assert.h; documentação de frameworks de teste C e práticas de integração contínua.",
        derivation: "Se a pré-condição P é falsa, a função não promete nada sobre o resultado. Assim, falhas observadas quando P não vale não são bugs da função, e sim violação de contrato; registrar P por escrito torna a discussão objetiva.",
        workedExamples: [
          ["Contrato de busca", "Entrada: vetor ordenado e n >= 0. Saída: índice do alvo ou -1. Violar a ordenação invalida a busca binária."],
          ["Ownership", "Função criar() retorna ponteiro que pertence ao chamador; documentar quem chama free evita vazamento e liberação duplicada."]
        ],
        recallQuestions: [
          "O que NDEBUG faz com assert? Resposta: remove as verificações.",
          "Por que assert não serve para entrada externa? Resposta: pode ser desativado e não fornece tratamento de erro.",
          "O que um teste de regressão captura? Resposta: um bug já corrigido, evitando seu retorno."
        ],
        masteryCriteria: [
          "Escreve pré e pós-condições objetivas para uma função.",
          "Usa assert apenas para invariantes internos.",
          "Cria casos de teste para limites e entradas inválidas."
        ],
        tags: ["C11", "contratos", "assert", "testes"],
        estimatedEffort: 30
      })
  ]
});
CURRICULUM.c.modules.push({
  name: "C12 — Estruturas de dados do zero",
  lessons: [
    L("Vetor dinâmico e lista simplesmente ligada",
      "Implementar e testar as duas formas básicas de armazenar sequências.",
      "Ponteiros, malloc/free e structs.",
      "Vetor é um bloco contínuo com índice calculado; lista é uma corrente de nós ligados por ponteiros.",
      "Vetor dinâmico: invariantes — 0 <= tamanho <= capacidade, elementos [0, tamanho) inicializados e dados nulos se capacidade é zero. Operações — acesso por índice O(1), inserção no fim O(1) amortizada com dobra de capacidade, remoção no meio O(n), busca O(n). Casos de borda: capacidade zero, falha de realloc (preserve o ponteiro antigo), transbordo em n × sizeof e remoção do último elemento. Ownership: a estrutura possui o bloco; quando guarda ponteiros, documente se os objetos apontados são emprestados ou de sua responsabilidade. Testes: sequência de inserções com verificação de tamanho, capacidade e valores após redimensionamento.\n\nLista simplesmente ligada: invariantes — cabeça aponta para o primeiro nó ou é nula, cada next aponta para nó válido ou nulo e não há ciclos. Operações — inserir na cabeça O(1), buscar O(n), remover depois de nó conhecido O(1), remover o próprio cabeça exige atualizar a referência. Casos de borda: lista vazia, um único nó, liberar nó guardando antes o próximo. Ownership: a lista possui os nós; o campo de dado pode copiar o valor ou apenas guardar ponteiro emprestado, e isso deve estar no cabeçalho. Testes: inserir, percorrer, remover_head e liberar tudo sob sanitizer.",
      [
        ["vetor dinâmico", "Sequência contígua com capacidade redimensionável e tamanho corrente."],
        ["capacidade", "Quantidade de elementos que o bloco alocado comporta antes de redimensionar."],
        ["amortizado", "Custo médio por operação em uma sequência, sem assumir distribuição de entradas."],
        ["lista simplesmente ligada", "Sequência de nós em que cada nó aponta apenas para o seguinte."],
        ["cabeça da lista", "Ponteiro para o primeiro nó, que deve ser atualizado ao remover esse nó."],
        ["ownership", "Responsabilidade documentada pela liberação de um recurso."]
      ],
      {
        ex: [["push_back", "Insere no fim; se tamanho == capacidade, dobre a capacidade antes de escrever."], ["remover_head", "Guarda prox = cabeca->prox, libera a cabeça antiga e atualiza cabeca."]],
        er: ["Chamar realloc sobrescrevendo o ponteiro original e perder o bloco em caso de falha.", "Liberar um nó da lista antes de salvar o ponteiro para o próximo."],
        lab: "Implemente as duas estruturas para int e execute a mesma sequência de operações, contando comparações em cada uma.",
        ref: "CLRS — Introduction to Algorithms, cap. 10 (MIT Press, https://mitpress.mit.edu/); ISO/IEC 9899:2018 (C17) para malloc e realloc.",
        derivation: "Com dobra de capacidade, n inserções custam no máximo n + (1 + 2 + 4 + ... + n/2) cópias, aproximadamente 3n. Logo o custo amortizado por inserção é constante, embora uma inserção isolada possa custar O(n).",
        workedExamples: [
          ["Sequência de vetor", "Capacidade 1: inserir 1, 2, 3, 4 produz cópias ao passar para 2 e para 4; o custo total cresce linearmente."],
          ["Lista vazia", "Inserir na cabeça de lista nula cria nó com prox = NULL e cabeca = novo; remover em seguida deve deixar cabeca = NULL."]
        ],
        recallQuestions: [
          "Qual é o custo de acesso por índice no vetor? Resposta: O(1).",
          "Por que remover a cabeça da lista é caso especial? Resposta: exige atualizar a referência externa à cabeça.",
          "O que fazer se realloc falhar? Resposta: manter o ponteiro antigo e sinalizar erro ao chamador."
        ],
        masteryCriteria: [
          "Implementa as duas estruturas com invariantes explícitos.",
          "Testa capacidade zero, lista vazia e falha de alocação.",
          "Documenta ownership dos elementos armazenados."
        ],
        tags: ["C12", "vetor dinâmico", "lista ligada", "ownership"],
        estimatedEffort: 45
      }),
    L("Lista duplamente ligada e pilha",
      "Dominar ponteiros anteriores e a disciplina LIFO.",
      "Lista simplesmente ligada e funções recursivas.",
      "A lista dupla permite voltar; a pilha permite desfazer.",
      "Lista duplamente ligada: invariantes — para todo nó, no->prox->ant == no quando prox existe, e no->ant->prox == no quando ant existe; cabeça e cauda consistentes. Operações — inserir e remover em qualquer extremidade O(1) quando se tem o ponteiro do nó, remover nó conhecido O(1), busca O(n). Casos de borda: lista vazia, um nó, atualizar cauda ao remover o último, nós sentinela alocados na pilha não devem ser liberados como nós comuns. Ownership: a lista possui os nós de dados; ponteiros sentinela são apenas marcadores. Testes: verificar as duas igualdades de ponteiro após cada operação.\n\nPilha: invariantes — o topo aponta para o elemento mais recente e os demais formam a sequência de inserção invertida. Operações — push e pop no topo O(1), consultar topo O(1), busca O(n). Casos de borda: pop em pilha vazia deve ser recusado, capacidade fixa pode estourar, e em pilha dinâmica toda alocação precisa de liberação. Ownership: após pop, a responsabilidade pelo elemento passa ao chamador; documente isso. Usos típicos: desfazer ações, avaliar expressões pós-fixas, percurso em profundidade e chamadas recursivas.",
      [
        ["lista duplamente ligada", "Lista cujos nós guardam ponteiros para o anterior e o seguinte."],
        ["sentinela", "Nó fictício que simplifica casos de borda e não contém dado do usuário."],
        ["invariante de ponteiro", "Relação entre ponteiros que deve valer após toda operação."],
        ["pilha", "Estrutura em que inserção e remoção ocorrem no topo."],
        ["LIFO", "Política último a entrar, primeiro a sair."],
        ["topo", "Posição da pilha onde push e pop atuam."]
      ],
      {
        ex: [["Inserir depois de p", "Ajuste novo->ant = p, novo->prox = p->prox, p->prox->ant = novo e p->prox = novo, nessa ordem."], ["Avaliar 3 4 2 * +", "Empilhe 3, 4, 2; * gera 8; + gera 11, resultado final."]],
        er: ["Esquecer de atualizar o ponteiro ant do nó seguinte ao inserir.", "Chamar pop em pilha vazia sem checar e ler memória inválida."],
        lab: "Implemente uma pilha de inteiros com lista duplamente ligada e um_history de desfazer; teste sequências com remoções no meio.",
        ref: "CLRS — Introduction to Algorithms, cap. 10 (MIT Press, https://mitpress.mit.edu/).",
        derivation: "Em uma lista dupla com sentinela cabeça, inserir antes do sentinela é o mesmo caso de inserir no meio: não há testes especiais para lista vazia, pois o sentinela sempre existe.",
        workedExamples: [
          ["Remover nó do meio", "Ligue ant->prox = no->prox e no->prox->ant = no->ant antes de liberar no; as duas ligações restauram o invariante."],
          ["Desfazer", "Cada ação empilha um registro com os dados para revertê-la; desfazer executa pop e aplica a reversão na ordem inversa."]
        ],
        recallQuestions: [
          "Que relação deve valer entre ponteiros de uma lista dupla? Resposta: no->prox->ant == no e no->ant->prox == no.",
          "O que significa LIFO? Resposta: último a entrar, primeiro a sair.",
          "A sentinela contém dado do usuário? Resposta: não; é apenas marcador estrutural."
        ],
        masteryCriteria: [
          "Mantém os ponteiros anteriores e seguintes consistentes.",
          "Implementa pilha com casos de borda explícitos.",
          "Documenta transferência de ownership no pop."
        ],
        tags: ["C12", "lista dupla", "pilha", "LIFO"],
        estimatedEffort: 45
      }),
    L("Fila e deque",
      "Implementar FIFO e estruturas de duas extremidades sem deslocar elementos.",
      "Arrays, vetor dinâmico e lista duplamente ligada.",
      "Fila é ordem de chegada; deque permite entrar e sair pelos dois lados.",
      "Fila: invariantes — frente aponta para o próximo elemento a sair, trás para a próxima posição de inserção, e contador distingue vazia de cheia. Operações — enqueue e dequeue O(1) com buffer circular, consultar frente O(1), busca O(n). Casos de borda: buffer com uma posição reservada ou contador explícito, índices que voltam ao zero por módulo, fila vazia e fila cheia. Ownership: a fila possui o armazenamento; ao guardar ponteiros, defina quem libera cada objeto. Testes: sequência alternada de enqueue/dequeue que cruza o fim do vetor.\n\nDeque: invariantes — frente e trás delimitam uma faixa circular de elementos, com espaço livre entre trás e frente quando cheio. Operações — inserir e remover em cada extremidade O(1), acesso por índice O(1) no vetor circular. Casos de borda: um único elemento, frente e trás na mesma posição, desenfileirar de um lado após encher pelo outro. Ownership: igual ao da fila; com lista dupla, cada nó é possuído pelo deque. Usos: buffers de E/S, BFS para fila, work stealing e janelas deslizantes para deque.",
      [
        ["fila", "Estrutura em que inserções acontecem no fim e remoções no início."],
        ["FIFO", "Política primeiro a entrar, primeiro a sair."],
        ["buffer circular", "Vetor cujos índices retornam ao início por aritmética modular."],
        ["deque", "Fila de duas extremidades que permite inserção e remoção nos dois lados."],
        ["frente e trás", "Índices que marcam as extremidades lógicas da estrutura."],
        ["capacidade reservada", "Espaço deixado livre para distinguir estrutura cheia de vazia."]
      ],
      {
        ex: [["enqueue com módulo", "tras = (tras + 1) % capacidade; vetor[tras] = valor; atualize o contador."], ["Janela deslizante", "Deque mantém índices de candidatos; remove da frente os que saíram da janela e do trás os dominados."]],
        er: ["Confundir fila vazia com fila cheia quando frente e trás coincidem.", "Deslocar todos os elementos a cada dequeue em vez de usar índices circulares."],
        lab: "Implemente fila e deque com vetor circular de capacidade 8 e execute operações que forcem dez voltas ao início.",
        ref: "CLRS — Introduction to Algorithms, cap. 10 (MIT Press, https://mitpress.mit.edu/).",
        derivation: "Com índice módulo capacidade, a posição após a última é a primeira. Manter contador separado resolve a ambiguidade de frente == trás: contador zero significa vazia e contador igual à capacidade significa cheia.",
        workedExamples: [
          ["Fila de impressão", "A, B, C entram nessa ordem; a saída é A, B, C. Inserir D antes do primeiro dequeue não altera a ordem dos três primeiros."],
          ["Deque de extremidades", "push_back(1), push_front(0), pop_back devolve 1 e pop_front devolve 0."]
        ],
        recallQuestions: [
          "O que diferencia fila de deque? Resposta: deque opera nas duas extremidades.",
          "Por que usar buffer circular? Resposta: para evitar deslocamento de elementos nas remoções.",
          "Como distinguir fila vazia de cheia com mesmo índice? Resposta: com contador ou uma posição reservada."
        ],
        masteryCriteria: [
          "Implementa enqueue e dequeue em tempo constante.",
          "Testa wraparound de índices e estrutura com um elemento.",
          "Documenta ownership quando a fila guarda ponteiros."
        ],
        tags: ["C12", "fila", "deque", "buffer circular"],
        estimatedEffort: 45
      }),
    L("Tabela hash e árvore binária de busca",
      "Comparar busca por chave com busca por ordem e entender colisões e balanceamento.",
      "Listas ligadas, vetores e funções de comparação.",
      "Hash transforma chave em posição; BST mantém as chaves ordenadas para guiar a busca.",
      "Tabela hash: invariantes — cada elemento é alcançável a partir do balde escolhido pela função de hash ou da sequência de sondagem; o fator de carga alfa = n/m é mantido sob controle por redimensionamento. Operações — inserção, busca e remoção O(1 + alfa) em média com encadeamento e hash uniforme, pior caso O(n). Casos de borda: tabela vazia, chaves duplicadas conforme política, colisões deliberadas, remoção em endereçamento aberto que exige marcador de posição apagada. Ownership: a tabela possui os nós e, opcionalmente, cópias das chaves; se guarda ponteiros emprestados, o tempo de vida externo deve ser documentado. Testes: inserir chaves que colidem e verificar recuperação e remoção.\n\nÁrvore binária de busca: invariante — para cada nó, chaves da subárvore esquerda são menores e da direita maiores, segundo comparador definido. Operações — busca, inserção e remoção O(h), com h a altura: O(log n) se balanceada e O(n) no pior caso. Casos de borda: política para duplicatas, remoção de nó com dois filhos (sucessor in-order), recorrência excessiva em árvore degenerada. Ownership: a árvore possui os nós; a liberação deve ser pós-ordem. Testes: percurso in-order deve produzir sequência ordenada após todas as operações.",
      [
        ["função de hash", "Função que converte uma chave em índice da tabela."],
        ["colisão", "Situação em que chaves distintas recebem o mesmo índice."],
        ["fator de carga", "Razão entre número de elementos e número de posições da tabela."],
        ["encadeamento", "Resolução de colisões mantendo uma lista em cada posição."],
        ["árvore binária de busca", "Árvore em que a subárvore esquerda contém menores e a direita, maiores."],
        ["sucessor in-order", "Menor nó da subárvore direita, usado na remoção de nó com dois filhos."]
      ],
      {
        ex: [["h(k) = k mod 7", "Chaves 10, 17 e 24 colidem no mesmo balde; encadeamento mantém as três."], ["Remoção na BST", "Para remover nó com dois filhos, substitua sua chave pelo sucessor in-order e remova esse sucessor."]],
        er: ["Afirmar que busca em tabela hash é sempre O(1) sem citar distribuição e fator de carga.", "Assumir que a BST está balanceada sem mecanismo que garanta a altura."],
        lab: "Implemente as duas estruturas para chaves inteiras e conte comparações em dez mil inserções com chaves sequenciais e aleatórias.",
        ref: "CLRS — Introduction to Algorithms, caps. 11 e 12 (MIT Press, https://mitpress.mit.edu/).",
        derivation: "Com encadeamento, o custo esperado de uma busca é o tamanho médio da lista, igual a alfa. Redimensionar quando alfa ultrapassa um limite mantém alfa constante, logo o custo médio permanece O(1). Na BST, o custo é a altura h; sem balanceamento, inserir chaves ordenadas produz h = n.",
        workedExamples: [
          ["Colisões", "Com m = 5, chaves 7 e 12 recebem índice 2. Encadeamento guarda as duas no mesmo balde; a busca por 12 percorre dois nós."],
          ["Ordem da BST", "Inserir 5, 2, 8, 1, 3 e percorrer in-order produz 1, 2, 3, 5, 8, independentemente da ordem de inserção."]
        ],
        recallQuestions: [
          "O que é fator de carga? Resposta: alfa = n/m, a razão entre elementos e posições.",
          "Qual é o pior caso de busca em tabela hash? Resposta: O(n), quando todas as chaves colidem.",
          "O que garante o invariante de uma BST? Resposta: esquerda menor, direita maior, segundo um comparador."
        ],
        masteryCriteria: [
          "Implementa hashing com estratégia de colisão e redimensionamento.",
          "Implementa BST com remoção correta de nó com dois filhos.",
          "Analisa custo esperado e pior caso com premissas explícitas."
        ],
        tags: ["C12", "hash", "BST", "colisões"],
        estimatedEffort: 50
      }),
    L("Heap e trie",
      "Construir fila de prioridade com heap e busca de prefixos com trie.",
      "Vetores, árvores e strings.",
      "Heap é árvore completa em vetor; trie é árvore de prefixos compartilhados.",
      "Heap binário: invariantes — é uma árvore completa armazenada em vetor e cada pai satisfaz a relação de ordem com os filhos (mínimo ou máximo). Para índice i, filhos em 2i+1 e 2i+2 e pai em (i-1)/2. Operações — inserir e extrair raiz O(log n), consultar extremo O(1), construir heap a partir de vetor O(n) com heapify. Casos de borda: heap vazio, um elemento, duplicatas e comparador que não define ordem total. Ownership: o heap possui o vetor; pop transfere o elemento ao chamador. Testes: verificar propriedade de heap após cada operação.\n\nTrie: invariantes — cada nó representa um prefixo, cada filho corresponde a um símbolo seguinte e uma marca indica fim de palavra. Operações — inserir, buscar palavra exata e buscar prefixo em O(L), com L o comprimento da chave. Casos de borda: chave vazia, inserção repetida, nós sem filhos que podem ser podados na remoção. Ownership: cada nó possui sua tabela de filhos e, se aplicável, cópia da chave terminal; o custo de memória cresce com o número de prefixos. Testes: conferir que palavras inseridas são encontradas e que prefixos inexistentes retornam falso.",
      [
        ["heap", "Árvore completa em vetor que mantém a extremidade de maior ou menor prioridade na raiz."],
        ["heapify", "Procedimento que reorganiza um vetor em heap em tempo linear."],
        ["fila de prioridade", "Estrutura que sempre remove o elemento de maior prioridade."],
        ["trie", "Árvore em que cada caminho da raiz representa um prefixo."],
        ["nó terminal", "Nó que marca o fim de uma palavra inserida."],
        ["poda", "Remoção de nós sem filhos após excluir uma palavra."]
      ],
      {
        ex: [["Heap de mínimo", "Inserir 5, 3, 8, 1 deixa 1 na raiz; extrair retorna 1 e recompõe o heap."], ["Trie de car", "Inserir carro, carta e carregamento compartilha o prefixo car e distingue os finais."]],
        er: ["Usar índice de pai (i-1)/2 em heap indexado a partir de 1 sem ajustar a fórmula.", "Confundir busca por prefixo com busca de palavra exata e ignorar a marca terminal."],
        lab: "Implemente heap e trie; para o heap, valide a propriedade após cada inserção; para a trie, teste chave vazia e remoção com poda.",
        ref: "CLRS — Introduction to Algorithms, caps. 6 e 12 (MIT Press, https://mitpress.mit.edu/).",
        derivation: "Em heap de vetor 0-indexado, os filhos de i são 2i+1 e 2i+2. A árvore completa tem altura log2(n), logo subir ou descer um elemento custa O(log n). Heapify custa O(n) porque o custo somado dos nós é proporcional a n, não a n log n.",
        workedExamples: [
          ["Ordenação por heap", "Construa heap de máximo e extraia a raiz n vezes; o resultado é ordenado em O(n log n) e in-place."],
          ["Autocomplete", "Caminhe até o prefixo digitado e colete palavras terminadas na subárvore; limite a quantidade para controlar custo."]
        ],
        recallQuestions: [
          "Onde fica a extremidade de um heap? Resposta: na raiz, índice zero no vetor 0-indexado.",
          "Qual o custo de construir heap por heapify? Resposta: O(n).",
          "O que distingue um nó terminal em trie? Resposta: a marca de fim de palavra."
        ],
        masteryCriteria: [
          "Implementa inserção e extração em heap com validação da propriedade.",
          "Implementa trie com marca terminal e poda.",
          "Documenta custo de memória e ownership dos nós."
        ],
        tags: ["C12", "heap", "trie", "prefixos"],
        estimatedEffort: 50
      }),
    L("Grafo e union-find",
      "Representar relacionamentos e manejar conjuntos disjuntos com eficiência.",
      "Listas, vetores e funções de comparação.",
      "Grafo descreve quem se liga a quem; union-find responde rapidamente se dois vértices já estão no mesmo grupo.",
      "Grafo: invariantes — vértices indexados de 0 a V-1, toda aresta tem extremidades válidas e a representação registra se o grafo é dirigido; política explícita para arestas paralelas e laços. Operações — lista de adjacência usa O(V + E) de memória e permite BFS/DFS em O(V + E); matriz usa O(V^2) e consulta aresta em O(1). Casos de borda: vértices isolados, grafo desconexo, ciclos, autoarestas e índices fora da faixa. Ownership: o grafo possui a lista de adjacência; os vértices podem ser apenas identificadores inteiros, sem alocação separada. Testes: contar vértices alcançáveis e verificar grau de cada vértice.\n\nUnion-find: invariantes — o pai de cada elemento forma floresta, a raiz representa o conjunto e rank ou tamanho limita a altura. Operações — find com compressão de caminho e union por tamanho custam quase O(1) amortizado, mais precisamente O(alfa(n)), a função inversa de Ackermann. Casos de borda: unir elemento consigo mesmo, unir conjuntos já iguais, índice inválido, necessidade de reinicializar a estrutura. Ownership: a estrutura possui os arrays pai e rank; nenhum ponteiro externo é retido. Usos: componentes conexos, detecção de ciclo e algoritmo de Kruskal.",
      [
        ["grafo", "Conjunto de vértices ligados por arestas, dirigidas ou não."],
        ["lista de adjacência", "Representação que guarda, para cada vértice, a lista de seus vizinhos."],
        ["matriz de adjacência", "Representação em matriz V por V indicando presença de aresta."],
        ["componente conexo", "Subconjunto de vértices mutuamente alcançáveis."],
        ["union-find", "Estrutura que mantém partições com find e union eficientes."],
        ["compressão de caminho", "Técnica que liga diretamente à raiz os nós visitados durante find."]
      ],
      {
        ex: [["BFS em O(V + E)", "Cada vértice entra na fila uma vez e cada aresta é examinada uma vez."], ["Detecção de ciclo", "Ao processar aresta (u, v), se find(u) == find(v), há ciclo."]],
        er: ["Acessar grafo desconexo assumindo que uma única travessia alcança todos os vértices.", "Unir por rank sem compressão de caminho e esperar custo amortizado quase constante."],
        lab: "Implemente grafo com lista de adjacência e union-find; conte componentes conexos em um grafo com vinte vértices e uma aresta repetida.",
        ref: "CLRS — Introduction to Algorithms, caps. 21 e 22 (MIT Press, https://mitpress.mit.edu/).",
        derivation: "Com união por tamanho, a altura da árvore cresce no máximo com log n. Com compressão de caminho, o custo amortizado de uma sequência de operações cai para O(alfa(n)), valores menores que 5 para tamanhos praticamente quaisquer.",
        workedExamples: [
          ["Kruskal", "Ordene arestas por peso; para cada uma, use find para testar ciclo e union para aceitá-la na árvore geradora."],
          ["Componentes", "Com V = 6 e arestas (0,1), (1,2), (4,5), existem três componentes: {0,1,2}, {3} e {4,5}."]
        ],
        recallQuestions: [
          "Qual é o custo de BFS com lista de adjacência? Resposta: O(V + E).",
          "Quando union-find detecta ciclo? Resposta: quando os extremos da aresta já pertencem ao mesmo conjunto.",
          "O que faz a compressão de caminho? Resposta: reconecta nós visitados diretamente à raiz."
        ],
        masteryCriteria: [
          "Implementa as duas representações de grafo e justifica a escolha.",
          "Implementa find e union com compressão e união por tamanho.",
          "Cobre vértices isolados, ciclos e arestas repetidas nos testes."
        ],
        tags: ["C12", "grafo", "union-find", "componentes"],
        estimatedEffort: 55
      })
  ]
});
CURRICULUM.c.modules.push({
  name: "C13 — Concorrência e programação POSIX",
  lessons: [
    L("Processos: fork, exec e waitpid",
      "Criar processos, substituir a imagem executável e aguardar o término com segurança.",
      "Arquivos, descritores e noção de memória virtual.",
      "fork copia o processo; exec troca o programa; waitpid coleta o resultado.",
      "fork, exec e waitpid são APIs POSIX, descritas em unistd.h e sys/wait.h, não parte da ISO C. fork retorna 0 no processo filho, o PID do filho no pai e -1 em caso de erro. O filho começa com uma cópia do espaço de endereço e dos descritores abertos; mudanças posteriores não são compartilhadas, a menos que memória compartilhada explícita tenha sido criada. Por isso o filho deve usar _exit em caminhos de erro para não executar acidentalmente o restante do código do pai.\n\nexec substitui a imagem do processo atual por outro programa; se bem-sucedida, a chamada não retorna. A família execve permite passar argumentos e ambiente. waitpid(pid, &status, opcoes) suspende o chamador até que o filho termine; macros como WIFEXITED, WEXITSTATUS e WIFSIGNALED interpretam o status. WNOHANG permite verificar sem bloquear.\n\nUm filho que termina e não é aguardado permanece como zombie: sua entrada na tabela de processos consome recurso até que o pai colete o status. Processos órfãos são adotados pelo init do sistema. Cuidados práticos: verificar retornos, fechar descritores desnecessários no filho e definir quem possui cada recurso após a divisão.",
      [
        ["fork", "Chamada POSIX que cria um novo processo com espaço de endereço copiado."],
        ["exec", "Família de chamadas que substitui a imagem executável do processo atual."],
        ["waitpid", "Chamada POSIX que aguarda término de processo filho e devolve seu status."],
        ["PID", "Identificador inteiro de processo no sistema operacional."],
        ["processo zombie", "Processo terminado cujo status ainda não foi coletado pelo pai."],
        ["_exit", "Função POSIX para encerrar o filho sem executar rotinas de limpeza do processo pai."]
      ],
      {
        ex: [["pid_t pid = fork();", "No filho pid é 0; no pai é o identificador do filho."], ["waitpid(pid, &st, 0)", "Aguarda o filho e grava o status em st."]],
        er: ["Deixar o filho continuar executando o código do pai após fork sem ramificar explicitamente.", "Nunca aguardar filhos terminados e acumular zombies."],
        lab: "Escreva um mini-shell que usa fork para um comando externo, exec para substituir a imagem e waitpid para coletar o status; execute em ambiente de laboratório.",
        ref: "POSIX.1-2017, interfaces fork, execve e waitpid; páginas de manual do Linux (man7.org).",
        derivation: "Após fork, o valor de retorno é a única forma confiável de saber qual processo está executando. O mesmo ponto do código roda em dois contextos com memórias separadas; ramificar por pid evita que ambos façam a mesma ação.",
        workedExamples: [
          ["Filho que falha", "Se exec não encontra o programa, o filho deve reportar o erro e chamar _exit, não return, para não continuar a lógica do pai."],
          ["Status de saída", "Com WIFEXITED(st) verdadeiro, WEXITSTATUS(st) fornece o código de saída; se WIFSIGNALED(st) for verdadeiro, o filho terminou por sinal."]
        ],
        recallQuestions: [
          "O que fork retorna no filho? Resposta: zero.",
          "O que acontece com um filho não aguardado após terminar? Resposta: torna-se zombie até o status ser coletado.",
          "Por que usar _exit no filho após falha de exec? Resposta: para não executar o restante do código do pai."
        ],
        masteryCriteria: [
          "Distingue corretamente os caminhos de pai e filho após fork.",
          "Interpreta status de waitpid com as macros POSIX.",
          "Evita zombies e duplicação de descritores."
        ],
        tags: ["C13", "POSIX", "fork", "processos"],
        estimatedEffort: 40
      }),
    L("Threads e pthread",
      "Criar e sincronizar threads com a biblioteca POSIX pthread.",
      "Funções, ponteiros e noção de pilha.",
      "Threads compartilham o espaço de endereço; processos criados por fork não compartilham por padrão.",
      "pthread_create(&t, NULL, funcao, arg) inicia uma thread que executa funcao com um argumento; pthread_join(t, &resultado) espera seu término e recebe o valor devolvido pela função. pthread_t é o identificador da thread. Ao contrário de fork, não há cópia de memória: variáveis globais e heap são compartilhadas, enquanto cada thread tem sua própria pilha e registradores.\n\nA função de thread recebe void * e retorna void *. Para passar mais dados, use uma struct alocada cuja vida seja maior que a da thread; ponteiro para variável local da função criadora é erro clássico se a criadora retornar antes da join. pthread_join também libera recursos internos da thread; alternativamente, pthread_detach indica que ninguém vai aguardá-la.\n\nErros de pthread são devolvidos como código de retorno, não em errno. A ISO C11/C17 define threads.h como recurso opcional; pthread é a API POSIX predominante em Linux e não faz parte da ISO C. Compilar em Linux normalmente exige a opção de ligação da biblioteca de threads. Cada thread compartilhada exige atenção especial a dados mutáveis: é aqui que surgem as condições de corrida.",
      [
        ["thread", "Unidade de execução dentro de um processo que compartilha memória com as demais."],
        ["pthread_create", "Função POSIX que inicia uma nova thread."],
        ["pthread_join", "Função POSIX que aguarda uma thread e coleta seu resultado."],
        ["pthread_detach", "Função que libera recursos da thread sem necessidade de join."],
        ["pilha por thread", "Região de pilha independente pertencente a cada thread."],
        ["threads.h", "Cabeçalho opcional da ISO C11/C17 para threads, distinto de pthread."]
      ],
      {
        ex: [["pthread_create(&t, NULL, trabalhar, &dados)", "Inicia thread com argumento apontando para dados."], ["pthread_join(t, NULL)", "Aguarda a thread sem coletar valor de retorno."]],
        er: ["Passar endereço de variável local que morre antes da thread terminar.", "Tratar pthread como padrão ISO C ou esquecer a opção de ligação da biblioteca de threads."],
        lab: "Crie quatro threads que somam fatias de um vetor em posições distintas; junte todas e compare com a soma sequencial.",
        ref: "POSIX.1-2017, interfaces pthread_create, pthread_join e pthread_detach; páginas de manual pthread(3) em Linux.",
        derivation: "Se duas threads escrevem no mesmo elemento sem sincronização, o resultado depende da ordem de agendamento. Dividir o vetor em fatias disjuntas elimina a disputa e torna o programa correto sem mutex.",
        workedExamples: [
          ["Argumento estável", "Aloque uma struct com os parâmetros da thread, passe seu endereço e libere-a somente após pthread_join."],
          ["Resultado por thread", "A função retorna (void *)(intptr_t)soma; pthread_join recebe esse valor, que é convertido de volta com cuidado."]
        ],
        recallQuestions: [
          "O que pthread_join faz além de esperar? Resposta: coleta o resultado e libera recursos da thread.",
          "Threads compartilham pilha? Resposta: não; cada uma tem sua própria pilha, mas compartilham memória global e heap.",
          "pthread pertence à ISO C? Resposta: não; é POSIX. A ISO C tem threads.h opcional."
        ],
        masteryCriteria: [
          "Cria e junta threads com retorno e argumentos corretos.",
          "Garante que dados passados à thread continuem válidos.",
          "Distingue pthread de threads.h e de processos."
        ],
        tags: ["C13", "pthread", "threads", "POSIX"],
        estimatedEffort: 40
      }),
    L("Mutex e regiões críticas",
      "Proteger dados compartilhados com mutex e evitar esquecimento de unlock.",
      "Threads pthread e memória compartilhada.",
      "Mutex é a chave de um banheiro: só uma thread entra por vez.",
      "Um mutex é um objeto de sincronização com dois estados, desbloqueado e bloqueado por uma thread. pthread_mutex_lock espera até conseguir possuí-lo; pthread_mutex_unlock libera. As regiões entre lock e unlock formam a seção crítica, onde o dado protegido pode ser lido e escrito sem interleave com outra thread usando o mesmo mutex.\n\nInicialização pode ser estática, com PTHREAD_MUTEX_INITIALIZER, ou dinâmica com pthread_mutex_init; pthread_mutex_destroy libera recursos. Todo caminho que adquire o mutex precisa chegar ao unlock, inclusive rotas de erro. Padrões comuns são concentrar a saída em um único ponto da função ou usar uma variável de status e liberar antes de retornar. Esquecer unlock gera bloqueio permanente; desbloquear sem possuir ou destruir mutex em uso é erro.\n\nMutex não é uma solução automática: protege apenas dados cujos acessos usam o mesmo mutex. Excesso de mutex reduz paralelismo e pode criar contenção; mutex insuficiente deixa corridas. A ordem de aquisição precisa ser consistente quando mais de um mutex é envolvido, sob pena de deadlock. Um mutex não deve ser copiado por valor, pois sua identidade está ligada ao endereço da memória.",
      [
        ["mutex", "Objeto de exclusão mútua que permite a posse por uma thread por vez."],
        ["seção crítica", "Trecho de código que acessa dado compartilhado sob proteção de mutex."],
        ["PTHREAD_MUTEX_INITIALIZER", "Inicializador estático de mutex POSIX."],
        ["pthread_mutex_lock", "Função que adquire o mutex, bloqueando até obtê-lo."],
        ["pthread_mutex_unlock", "Função que libera o mutex possuído pela thread."],
        ["ordem de aquisição", "Sequência fixa de lock de vários mutexes para evitar ciclos."]
      ],
      {
        ex: [["pthread_mutex_lock(&m); total += v[i]; pthread_mutex_unlock(&m);", "Protege uma única atualização de variável compartilhada."], ["PTHREAD_MUTEX_INITIALIZER", "Inicializa mutex global sem chamada explícita."]],
        er: ["Retornar da função dentro da seção crítica sem desbloquear.", "Proteger parte dos acessos ao dado e deixar outra leitura sem mutex."],
        lab: "Implemente um contador compartilhado com e sem mutex, lance oito threads e compare o resultado com o valor esperado.",
        ref: "POSIX.1-2017, pthread_mutex_lock, pthread_mutex_unlock, pthread_mutex_init e pthread_mutex_destroy.",
        derivation: "Sem mutex, a instrução total += 1 envolve leitura, soma e escrita; duas threads podem ler o mesmo valor e ambas escrever o mesmo resultado, perdendo um incremento. Com mutex, as três etapas são atômicas entre si para as threads que usam a mesma chave.",
        workedExamples: [
          ["Caminho de erro", "Após lock, se validação falhar, armazene código de erro, desbloqueie e só então retorne. Um único ponto de saída reduz esquecimento."],
          ["Contenção", "Em vez de proteger cada elemento com um mutex global, divida os dados em fatias e use um mutex por fatia para reduzir espera."]
        ],
        recallQuestions: [
          "O que acontece se uma thread morre sem unlock? Resposta: o mutex permanece bloqueado e outras threads esperam indefinidamente.",
          "Todo acesso ao dado precisa do mesmo mutex? Resposta: sim, caso contrário a proteção é incompleta.",
          "Por que copiar mutex é errado? Resposta: sua identidade e estado estão ligados ao endereço original."
        ],
        masteryCriteria: [
          "Protege todas as leituras e escritas de um dado compartilhado.",
          "Garante unlock em todos os caminhos de retorno.",
          "Justifica a ordem de lock quando há mais de um mutex."
        ],
        tags: ["C13", "mutex", "seção crítica", "pthread"],
        estimatedEffort: 40
      }),
    L("Corrida, deadlock, starvation e sincronização avançada",
      "Reconhecer falhas de concorrência e usar condições e semáforos corretamente.",
      "Mutex e threads.",
      "Corrida é resultado dependente da ordem; deadlock é ninguém conseguir avançar; starvation é alguém nunca ser atendido.",
      "Uma data race ocorre quando duas threads acessam a mesma memória, pelo menos uma escreve, e não há sincronização que ordene os acessos. No modelo de memória da ISO C, isso é comportamento indefinido, não apenas resultado imprevisível. Variáveis atômicas de stdatomic.h ou mutex bem usado estabelecem a sincronização necessária. A atomicidade de uma operação não garante, sozinha, a correção de uma sequência de operações.\n\nDeadlock clássico envolve quatro condições: exclusão mútua, posse e espera, não preemptividade e espera circular. Na prática, a defesa mais simples é uma ordem global de aquisição de mutexes e evitar esperar enquanto se mantém outro recurso. Starvation acontece quando uma thread nunca obtém o recurso por política de agendamento injusta; filas, limites de tempo e backoff ajudam.\n\nVariável de condição pthread_cond_t permite esperar por um estado, não apenas por uma chave. O padrão correto é: lock, enquanto o predicado for falso chame pthread_cond_wait(&cond, &m), e depois unlock. O while é obrigatório por acordos espúrios e mudanças entre notificação e retomada. pthread_cond_signal acorda uma thread; pthread_cond_broadcast acorda todas. Semáforos POSIX (sem_init, sem_wait, sem_post) contam permissões e são úteis para limitar acesso a um pool de recursos.",
      [
        ["data race", "Acesso concorrente a mesma memória com escrita e sem sincronização, comportamento indefinido em C."],
        ["deadlock", "Estado em que threads se bloqueiam mutuamente e nenhuma consegue progredir."],
        ["starvation", "Situação em que uma thread é persistentemente preterida no acesso a um recurso."],
        ["variável de condição", "Mecanismo para esperar que um predicado sobre estado compartilhado se torne verdadeiro."],
        ["despertar espúrio", "Retorno de pthread_cond_wait sem que o predicado tenha mudado."],
        ["semáforo", "Contador sincronizado usado para controlar número de acessos concorrentes."]
      ],
      {
        ex: [["while (!pronto)", "Laço correto ao redor de pthread_cond_wait, inclusive após acordos espúrios."], ["Ordem de lock", "Sempre adquira mutex A antes de B; nunca o contrário, em nenhuma thread."]],
        er: ["Usar if em vez de while ao esperar uma condição.", "Manter mutex A preso enquanto esperaMutex B em outra ordem."],
        lab: "Implemente produtor-consumidor com fila limitada, variável de condição e dois predicados: não vazia e não cheia.",
        ref: "POSIX.1-2017, pthread_cond_wait, pthread_cond_signal e semáforos; ISO/IEC 9899:2018 (C17), stdatomic.h e modelo de memória.",
        derivation: "pthread_cond_wait libera o mutex e adormece; ao acordar, volta a adquiri-lo antes de retornar. Sem o laço while, a thread pode prosseguir com o predicado falso, seja por despertares espúrios seja porque outra thread consumiu o estado.",
        workedExamples: [
          ["Fila limitada", "Consumidor lock, while (vazia) cond_wait, retira item, sinaliza produtor e unlock."],
          ["Deadlock de dois mutexes", "Thread 1 faz lock A e espera B; thread 2 faz lock B e espera A. Ordem global A antes de B elimina o ciclo."]
        ],
        recallQuestions: [
          "O que é data race em C? Resposta: comportamento indefinido por acesso concorrente sem sincronização com escrita.",
          "Por que while e não if na espera condicional? Resposta: acordos espúrios e mudança de estado após a notificação.",
          "Como evitar espera circular? Resposta: definindo ordem global de aquisição dos mutexes."
        ],
        masteryCriteria: [
          "Explica data race pelo modelo de memória C.",
          "Implementa espera condicional com predicado em while.",
          "Identifica condições para deadlock e aplica ordem de lock."
        ],
        tags: ["C13", "race", "deadlock", "condição"],
        estimatedEffort: 50
      }),
    L("Sinais e terminação controlada",
      "Tratar sinais POSIX com handlers curtos e encerramento previsível.",
      "Processos, fork e waitpid.",
      "Sinal é um aviso assíncrono: o handler deve ser mínimo e previsível.",
      "Sinais são mecanismo POSIX, não da ISO C. sigaction é a forma recomendada de instalar um handler; signal existe, mas tem semântica menos uniforme. Quando o sinal chega, o fluxo normal é interrompido e uma função registrada é executada. Nela, só são seguras as operações explicitamente assíncrono-seguras: por exemplo, gravar em volatile sig_atomic_t e chamar write. printf, malloc e acesso a estruturas complexas não são seguros nesse contexto.\n\nPadrão comum é o handler apenas ajustar uma flag e ações que podem ser interrompidas verificarem errno EINTR e repetir chamadas como read, write, waitpid e sleep. SIGTERM pede término gracioso: o processo pode salvar estado, fechar arquivos e liberar recursos. SIGKILL não pode ser capturado nem ignorado e deve ser último recurso, após tentar o término gracioso e preservar evidência. SIGCHLD avisa que um filho terminou; seu handler pode ser simples ou a aplicação pode usar waitpid com WNOHANG no laço principal.\n\nMáscaras de sinal permitem bloquear temporariamente a entrega em seções sensíveis. Como sinais são assíncronos, qualquer suposição sobre 'quando' o handler roda é perigosa; mantenha-o curto e teste com os sinais que a aplicação realmente usa.",
      [
        ["sinal", "Aviso assíncrono enviado a um processo pelo sistema ou por outro processo."],
        ["sigaction", "API POSIX para instalar e configurar handlers de sinal."],
        ["handler", "Função executada quando o sinal é entregue ao processo."],
        ["async-signal-safe", "Propriedade de uma função que pode ser chamada com segurança dentro de handler."],
        ["volatile sig_atomic_t", "Tipo C adequado para flags modificadas entre handler e fluxo normal."],
        ["EINTR", "Erro indicando que uma chamada foi interrompida por sinal e pode ser repetida."]
      ],
      {
        ex: [["SIGTERM", "Sinal de pedido de encerramento que o processo pode tratar e finalizar de forma ordenada."], ["while (read(...) < 0 && errno == EINTR)", "Padrão para repetir chamada interrompida por sinal."]],
        er: ["Chamar printf dentro de handler de sinal.", "Recorrer a término forçado antes de tentar SIGTERM e coletar evidência."],
        lab: "Instale handler para SIGTERM que apenas ajusta uma flag; no laço principal, ao detectar a flag, feche recursos e saia com status zero.",
        ref: "POSIX.1-2017, sigaction, sigprocmask e lista de funções assíncrono-seguras; páginas de manual signal-safety(7) em Linux.",
        derivation: "O handler pode ser executado no meio de qualquer instrução, inclusive dentro de malloc. Chamar malloc novamente pode corromper estado interno da biblioteca; por isso a ISO C limita o que é seguro e POSIX publica a lista de funções assíncrono-seguras.",
        workedExamples: [
          ["Flag simples", "static volatile sig_atomic_t quer_sair; o handler atribui 1 e o laço principal verifica periodicamente."],
          ["Filho terminado", "Handler de SIGCHLD apenas sinaliza presença de filhos concluídos; a coleta real acontece com waitpid(WNOHANG) no laço."]
        ],
        recallQuestions: [
          "O que pode ser feito com segurança no handler? Resposta: operações assíncrono-seguras, como atribuir volatile sig_atomic_t e write.",
          "Qual sinal tentar primeiro para encerrar processo? Resposta: SIGTERM; SIGKILL é último recurso.",
          "O que fazer quando read retorna EINTR? Resposta: repetir a chamada, se fizer sentido para a aplicação."
        ],
        masteryCriteria: [
          "Instala handler com sigaction e mantém-no mínimo.",
          "Trata EINTR em chamadas interrompíveis.",
          "Distingue término gracioso de término forçado."
        ],
        tags: ["C13", "sinais", "sigaction", "EINTR"],
        estimatedEffort: 45
      }),
    L("Pipes, redirecionamento, mmap e multiplexação",
      "Conectar processos e esperar vários descritores sem bloquear em apenas um.",
      "Descritores de arquivo e processos POSIX.",
      "pipe liga processos; mmap liga arquivos à memória; select/poll/epoll perguntam qual descritor está pronto.",
      "pipe(int fd[2]) cria um canal: fd[0] lê e fd[1] escreve. Após fork, cada processo fecha a ponta que não usa; read no fim retorna zero quando todas as pontas de escrita são fechadas. dup2(oldfd, newfd) redireciona descritores e é a base de pipelines em shells. Essas chamadas são POSIX.\n\nmmap(NULL, tamanho, PROT_READ, MAP_PRIVATE, fd, 0) mapeia bytes de arquivo no espaço de endereço; o uso terminado exige munmap. MAP_PRIVATE com escrita cria cópia privada; MAP_SHARED reflete alterações no arquivo, sujeito a regras de sincronização. Um arquivo mapeado não substitui checagem de tamanho nem tratamento de erro.\n\nPara esperar vários descritores, select usa conjuntos de bits com limite de quantidade, poll usa vetor de estruturas e epoll é mecanismo específico do Linux, com epoll_create1, epoll_ctl e epoll_wait. select e poll são POSIX; epoll não é. Todas podem retornar EINTR e devem ser repetidas. Um servidor com muitos clientes escolhe entre threads/processos por conexão e laço de eventos conforme necessidade de escala e complexidade.",
      [
        ["pipe", "Canal POSIX unidirecional com duas extremidades, leitura e escrita."],
        ["dup2", "Chamada POSIX que redireciona um descritor para outro."],
        ["mmap", "Chamada POSIX que mapeia arquivo ou dispositivo no espaço de endereço."],
        ["munmap", "Chamada que desfaz um mapeamento feito por mmap."],
        ["select e poll", "Chamadas POSIX para aguardar prontidão de múltiplos descritores."],
        ["epoll", "Mecanismo de multiplexação específico do Linux, não POSIX."]
      ],
      {
        ex: [["pipe(fd)", "fd[0] é leitura e fd[1] é escrita; feche a ponta não usada em cada processo."], ["poll(fds, n, 1000)", "Espera até mil milissegundos por atividade em qualquer descritor do vetor."]],
        er: ["Esquecer de fechar a ponta de escrita no leitor e nunca receber fim de arquivo.", "Chamar epoll em código que deve rodar em qualquer sistema POSIX."],
        lab: "Escreva um programa que usa pipe entre pai e filho e outro que usa poll para alternar entre entrada padrão e um pipe, ambos em laboratório local.",
        ref: "POSIX.1-2017, pipe, dup2, mmap, select e poll; páginas de manual do Linux sobre epoll(7).",
        derivation: "Se o leitor mantém sua ponta de escrita aberta, read nunca vê todas as pontas de escrita fechadas e bloqueia esperando mais dados. Fechar descritores não usados é parte do protocolo, não detalhe opcional.",
        workedExamples: [
          ["Pipeline de shell", "Crie pipe, faça fork e use dup2 para ligar a saída do primeiro processo à entrada do segundo."],
          ["Mapear arquivo", "Abra arquivo, consulte tamanho com fstat, mapeie com PROT_READ, processe bytes e chame munmap antes de close."]
        ],
        recallQuestions: [
          "Qual extremidade do pipe lê? Resposta: fd[0].",
          "select e poll são POSIX? Resposta: sim; epoll é específico de Linux.",
          "Por que chamar munmap? Resposta: para liberar o mapeamento e evitar vazamento de recursos."
        ],
        masteryCriteria: [
          "Constrói pipe entre processos e fecha pontas corretamente.",
          "Usa poll com timeout e trata EINTR.",
          "Distingue APIs POSIX de extensões Linux."
        ],
        tags: ["C13", "pipes", "mmap", "poll"],
        estimatedEffort: 50
      })
  ]
});
CURRICULUM.c.modules.push({
  name: "C14 — C de sistemas e rede",
  lessons: [
    L("Descritores de arquivo e E/S POSIX",
      "Abrir, ler, gravar e fechar arquivos com tratamento correto de erros e leituras parciais.",
      "Arquivos com FILE e noção de bytes.",
      "Descritor é um número pequeno que o kernel usa para representar um recurso aberto.",
      "open, read, write e close são chamadas POSIX declaradas em fcntl.h e unistd.h, diferentes de fopen/fread da ISO C. open(path, O_RDONLY) devolve um inteiro chamado descritor de arquivo, ou -1 com errno preenchido. Os descritores 0, 1 e 2 correspondem, por convenção, à entrada, saída e erro padrão.\n\nssize_t n = read(fd, buf, sizeof buf) pode devolver n > 0 bytes lidos, n == 0 em fim de arquivo ou n < 0 em erro. EINTR indica interrupção por sinal e a chamada pode ser repetida. write também pode gravar apenas parte do buffer; um loop é necessário para escrever todos os bytes, atualizando o ponteiro e o restante. Fechar o descritor em todos os caminhos é obrigatório: vazamento de descritores é tão real quanto vazamento de memória.\n\nO modo binário não existe como distinção separada em POSIX; a tradução de fim de linha é uma característica de streams C no Windows. Para arquivos mapeados, permissões e redirecionamento, o modelo de descritores é a base comum. Use O_CLOEXEC quando disponível para evitar que filhos herdem descritores desnecessários após exec.",
      [
        ["descritor de arquivo", "Inteiro que identifica um recurso aberto na tabela de descritores do processo."],
        ["open", "Chamada POSIX que abre arquivo e devolve descritor ou -1 com errno."],
        ["read", "Chamada POSIX que lê até determinada quantidade de bytes e devolve contagem ou erro."],
        ["write", "Chamada POSIX que grava bytes e pode realizar gravação parcial."],
        ["EINTR", "Erro de chamada interrompida por sinal, que pode ser repetida."],
        ["O_CLOEXEC", "Flag POSIX que marca descritor para ser fechado automaticamente após exec."]
      ],
      {
        ex: [["int fd = open(\"dados.bin\", O_RDONLY);", "Abre arquivo; verifique fd < 0 antes de usar."], ["while (restante > 0) { n = write(fd, p, restante); ... }", "Loop que trata escrita parcial e EINTR."]],
        er: ["Assumir que write grava todo o buffer de uma vez.", "Esquecer close em caminho de erro."],
        lab: "Escreva uma função escreve_tudo que lida com escrita parcial e EINTR; teste com um arquivo temporário no laboratório local.",
        ref: "POSIX.1-2017, open, read, write, close e errno; páginas de manual do Linux open(2) e read(2).",
        derivation: "Se read solicita 4096 bytes e obtém 1200, isso não é erro: o kernel devolveu o que estava disponível. Considerar essa leitura como arquivo completo geraria perda de dados; o chamador deve repetir até n == 0 ou até ter a quantidade necessária.",
        workedExamples: [
          ["Cópia segura", "Leia em bloco de 4096 bytes, escreva todos os bytes lidos com loop e feche os dois descritores."],
          ["Erro de abertura", "Se open falha com ENOENT, o arquivo não existe; com EACCES, faltou permissão. As mensagens vêm de strerror(errno)."]
        ],
        recallQuestions: [
          "O que indica read == 0? Resposta: fim de arquivo.",
          "Por que write precisa de loop? Resposta: pode gravar menos bytes que o solicitado.",
          "O que significa EINTR? Resposta: chamada interrompida por sinal; repetição costuma ser correta."
        ],
        masteryCriteria: [
          "Trata open, read e write com verificação de erro.",
          "Implementa loop de escrita parcial e repetição em EINTR.",
          "Garante fechamento de descritores em todos os caminhos."
        ],
        tags: ["C14", "POSIX", "file descriptor", "E/S"],
        estimatedEffort: 40
      }),
    L("stat, diretórios e permissões",
      "Inspecionar metadados de arquivos e percorrer diretórios com princípio de menor privilégio.",
      "Descritores de arquivo e E/S POSIX.",
      "stat responde o que o arquivo é; permissões decidem quem pode fazer o quê.",
      "stat(path, &st), fstat(fd, &st) e lstat(path, &st) preenchem struct stat com tipo, tamanho, dono e permissões. Macros como S_ISREG e S_ISDIR interpretam st_mode; lstat não segue links simbólicos. Para listar diretórios, use opendir, readdir e closedir, ignorando as entradas '.' e '..' quando apropriado.\n\nPermissões POSIX são separadas para dono, grupo e outros, com bits de leitura, escrita e execução. Para arquivos de dados privados, o padrão é conceder o mínimo: por exemplo, permissão de leitura e escrita apenas para o dono. Conceder escrita universal é quase sempre erro de segurança e não deve ser usado como atalho para resolver falha de acesso. Ajuste proprietário e grupo com as ferramentas adequadas, e entenda o efeito da umask na criação de arquivos.\n\nEm sistemas com links simbólicos, operações sobre caminhos podem ser redirecionadas; lstat e flags como O_NOFOLLOW, quando disponíveis, ajudam em código sensível. Um programa robusto verifica retornos e não confia apenas na extensão do nome para determinar tipo de arquivo.",
      [
        ["stat", "Família de chamadas POSIX que obtém metadados de arquivo por caminho ou descritor."],
        ["struct stat", "Estrutura com tipo, tamanho, dono, grupo, horários e permissões do arquivo."],
        ["lstat", "Variante de stat que não segue o link simbólico final."],
        ["opendir/readdir", "Chamadas POSIX para abrir e percorrer entradas de diretório."],
        ["permissão mínima", "Princípio de conceder apenas os direitos necessários à tarefa."],
        ["umask", "Máscara do processo que remove bits de permissão em arquivos recém-criados."]
      ],
      {
        ex: [["S_ISREG(st.st_mode)", "Testa se o caminho corresponde a arquivo regular."], ["opendir(\".\")", "Abre o diretório atual para leitura de entradas."]],
        er: ["Conceder permissão universal de escrita para contornar erro de acesso.", "Decidir que um arquivo é texto apenas pela extensão."],
        lab: "Liste entradas de um diretório temporário, use stat para classificar cada uma e registre tipo e tamanho; crie arquivo com permissão restrita.",
        ref: "POSIX.1-2017, stat, lstat, opendir e readdir; páginas de manual Linux stat(2), inode(7) e chmod(1).",
        derivation: "O campo st_mode codifica tipo e bits de permissão em uma única máscara. Macros como S_ISREG isolam bits de tipo, enquanto S_IRUSR e S_IWUSR isolam bits de dono; testar diretamente o inteiro sem máscaras é frágil.",
        workedExamples: [
          ["Arquivo ou diretório", "Com S_ISDIR(st.st_mode) verdadeiro, use opendir; com S_ISREG, use open/read; com links, decida explicitamente se segue ou não."],
          ["Permissão privada", "Para um arquivo de credenciais de laboratório, crie com modo 0600 e mantenha-o fora de diretórios publicamente graváveis."]
        ],
        recallQuestions: [
          "Qual a diferença entre stat e lstat? Resposta: lstat não segue o link simbólico final.",
          "O que S_ISREG verifica? Resposta: se o arquivo é regular.",
          "Qual princípio usar ao definir permissões? Resposta: conceder o mínimo necessário."
        ],
        masteryCriteria: [
          "Classifica entradas com macros de st_mode.",
          "Percorre diretório com opendir/readdir/closedir.",
          "Aplica permissões mínimas e trata links com critério."
        ],
        tags: ["C14", "stat", "permissões", "diretórios"],
        estimatedEffort: 35
      }),
    L("Sockets e getaddrinfo",
      "Criar pontos de comunicação com endereços independentes de família.",
      "Descritores de arquivo e noção de rede.",
      "Socket é descritor que fala rede; getaddrinfo traduz nome e serviço em endereços utilizáveis.",
      "Sockets são API POSIX/BSD, não ISO C. getaddrinfo(node, service, &hints, &res) preenche uma lista ligada struct addrinfo com possíveis endereços; node pode ser nome DNS ou endereço numérico, e service pode ser nome ou porta. hints define family, socktype e flags como AI_PASSIVE para servidor. O resultado deve ser liberado com freeaddrinfo, e erros interpretados com gai_strerror.\n\nPara servidor, o fluxo típico é socket, bind, listen e accept. Para cliente, socket e connect. Cada chamada devolve descritor ou -1; escolher o primeiro endereço da lista nem sempre funciona, por isso um laço sobre res tenta cada candidato até obter sucesso. Usar AF_UNSPEC com getaddrinfo permite tratar IPv4 e IPv6 sem duplicar código.\n\nAo criar servidor, configure SO_REUSEADDR antes de bind quando apropriado e feche o descritor de escuta ao terminar. Portas escolhidas pelo sistema são úteis em laboratório: getsockname recupera a porta atribuída. Nada nesta API é padrão C; em Windows há Winsock, com inicialização própria e tipos diferentes.",
      [
        ["socket", "Descritor POSIX que representa um ponto de comunicação de rede."],
        ["getaddrinfo", "Função POSIX que converte nome de host e serviço em lista de endereços."],
        ["struct addrinfo", "Estrutura que descreve família, tipo de socket e endereço candidato."],
        ["AI_PASSIVE", "Flag que indica endereço adequado para escuta no servidor."],
        ["bind/listen/accept", "Sequência POSIX para registrar endereço, escutar e aceitar conexões."],
        ["freeaddrinfo", "Função que libera a lista retornada por getaddrinfo."]
      ],
      {
        ex: [["getaddrinfo(NULL, \"8080\", &hints, &res)", "Prepara endereço de escuta em todas as interfaces locais com AI_PASSIVE."], ["socket(res->ai_family, res->ai_socktype, res->ai_protocol)", "Cria socket compatível com o endereço candidato."]],
        er: ["Esquecer freeaddrinfo e vazar a lista de endereços.", "Assumir que o primeiro candidato sempre conecta e não iterar a lista."],
        lab: "Em ambiente local autorizado, crie socket de escuta em porta efêmera, descubra a porta com getsockname e conecte um cliente simples.",
        ref: "POSIX.1-2017, getaddrinfo, socket, bind, listen e accept; RFC 3493 (sockets IPv6) e páginas de manual Linux getaddrinfo(3).",
        derivation: "Um nome pode resolver para vários endereços, inclusive IPv4 e IPv6. Tentar apenas o primeiro pode falhar se aquele protocolo estiver indisponível; percorrer a lista e tentar cada ai_addr com seu ai_family torna o cliente robusto.",
        workedExamples: [
          ["Servidor local", "Com AI_PASSIVE e node nulo, bind usa endereço curinga; a porta pode ser zero e recuperada por getsockname."],
          ["Cliente", "getaddrinfo(\"localhost\", \"http\", ...) fornece candidatos; a conexão bem-sucedida encerra o laço e a lista é liberada."]
        ],
        recallQuestions: [
          "O que AI_PASSIVE indica? Resposta: endereço adequado para servidor que escuta conexões.",
          "Por que percorrer todos os resultados de getaddrinfo? Resposta: podem existir vários endereços e famílias.",
          "Quem libera struct addrinfo? Resposta: o chamador, com freeaddrinfo."
        ],
        masteryCriteria: [
          "Usa getaddrinfo com hints e trata erros.",
          "Implementa fluxo socket/bind/listen/accept ou socket/connect.",
          "Libera recursos e percorre candidatos de endereço."
        ],
        tags: ["C14", "sockets", "getaddrinfo", "POSIX"],
        estimatedEffort: 45
      }),
    L("TCP e UDP: diferenças que afetam o código",
      "Escolher entre stream e datagrama e implementar envio e recepção corretos.",
      "Sockets, getaddrinfo e noção de pacotes.",
      "TCP entrega um fluxo ordenado; UDP entrega mensagens isoladas sem garantias.",
      "TCP (SOCK_STREAM) estabelece conexão, preserva ordem dos bytes e retransmite dados perdidos. Para o programa, porém, não há fronteira de mensagem: uma chamada recv pode devolver parte do que o outro lado enviou ou vários envios de uma vez. Por isso a aplicação define um protocolo: prefixo de tamanho, delimitador por linha ou outro enquadramento.\n\nUDP (SOCK_DGRAM) preserva a fronteira de cada datagrama, mas não garante entrega, ordem nem ausência de duplicatas. Um recvfrom devolve um datagrama por vez; mensagens maiores que o buffer são truncadas, e isso precisa ser detectado. UDP cabe em cenários com tolerância a perda e necessidade de baixa latência, enquanto TCP é a escolha padrão quando integridade e ordem importam.\n\nEm TCP, as funções send e recv também podem ser parciais e retornar -1; EOF é recv retornando zero quando o par fecha a conexão. Em UDP, um datagrama pode chegar de qualquer endereço e recvfrom devolve o remetente. A escolha afeta teste, depuração e até projeto de log, pois a unidade de trabalho observável é diferente.",
      [
        ["TCP", "Protocolo de transporte orientado a conexão que fornece fluxo de bytes ordenado e confiável."],
        ["UDP", "Protocolo de transporte sem conexão que preserva limites de datagrama, sem garantia de entrega."],
        ["enquadramento", "Regra da aplicação para delimitar mensagens dentro de um fluxo de bytes."],
        ["recv parcial", "Retorno de recv com menos bytes que o solicitado, normal em TCP."],
        ["datagrama", "Unidade de mensagem enviada por UDP."],
        ["EOF", "Condição indicada por recv igual a zero, Meaning o par encerrou a escrita."]
      ],
      {
        ex: [["Prefixo de tamanho", "Quatro bytes com o comprimento, em ordem de rede, seguidos dos dados; o leitor sabe quantos bytes esperar."], ["recvfrom", "Recebe um datagrama e o endereço de origem em UDP."]],
        er: ["Achar que uma chamada recv em TCP corresponde a um envio do par.", "Usar UDP esperando retransmissão automática e ordem garantida."],
        lab: "Implemente cliente e servidor TCP locais com mensagens delimitadas por nova linha; envie uma mensagem em duas partes e confirme a recomposição correta.",
        ref: "POSIX.1-2017, recv, send, recvfrom e sendto; RFC 9293 (TCP) e RFC 768 (UDP).",
        derivation: "TCP é um fluxo: bytes podem ser divididos ou agrupados em segmentos pelo sistema. Sem enquadramento, o receptor não consegue saber onde uma mensagem termina; um cabeçalho de tamanho resolve a ambiguidade de forma inequívoca.",
        workedExamples: [
          ["Mensagem dividida", "Servidor envia 'OLA' e 'MUNDO' em dois send; cliente pode receber 'OLAMU' e depois 'NDO'. O delimitador permite reconstruir as duas mensagens."],
          ["Datagrama truncado", "Se o buffer tem 64 bytes e chega datagrama de 100, os 36 bytes restantes são descartados; a aplicação deve tratar isso como erro."]
        ],
        recallQuestions: [
          "TCP preserva fronteiras de mensagem? Resposta: não; é fluxo de bytes.",
          "UDP garante entrega? Resposta: não; pode perder, duplicar e reordenar datagramas.",
          "O que significa recv retornar zero em TCP? Resposta: fim de arquivo, o par encerrou a escrita."
        ],
        masteryCriteria: [
          "Explica diferenças observáveis entre TCP e UDP.",
          "Implementa enquadramento para mensagens em TCP.",
          "Trata leitura parcial, datagrama truncado e EOF."
        ],
        tags: ["C14", "TCP", "UDP", "enquadramento"],
        estimatedEffort: 45
      }),
    L("Servidor concorrente e protocolo de aplicação",
      "Projetar um servidor que atenda vários clientes com protocolo simples e recursos controlados.",
      "Sockets, TCP e processos ou threads.",
      "Um servidor concorrente é um protocolo bem definido mais uma estratégia para dividir atenção entre clientes.",
      "Três arquiteturas comuns são: fork ou thread por conexão, pool de threads com fila de tarefas e laço de eventos com poll/epoll. A primeira é simples e isola falhas, mas consome recursos por cliente; a segunda limita concorrência; a terceira escala bem em muitas conexões ociosas, mas exige código não bloqueante. Em todos os casos, cada descritor precisa de dono claro e fechamento em todos os caminhos.\n\nO protocolo de aplicação deve especificar enquadramento, campos, codificação de números, tratamento de versão e respostas de erro. Prefira prefixo de tamanho em ordem de rede ou linhas terminadas por delimitador, com limite máximo de mensagem para impedir consumo ilimitado de memória. Trate as entradas do cliente como dados, nunca como comandos de shell: passar texto não confiável para uma função que interpreta comando é falha grave.\n\nUm servidor de laboratório deve escutar apenas onde necessário, autenticar quando aplicável e registrar eventos úteis sem gravar segredos. Defina desligamento gracioso: pare de aceitar, conclua ou cancele conexões de forma documentada, libere recursos e saia com status claro.",
      [
        ["servidor concorrente", "Servidor capaz de atender múltiplos clientes usando processos, threads ou eventos."],
        ["pool de threads", "Conjunto limitado de threads que consomem tarefas de uma fila."],
        ["laço de eventos", "Estrutura que espera prontidão de vários descritores e reage a eventos."],
        ["protocolo de aplicação", "Conjunto de regras que define mensagens, codificação, erros e versão."],
        ["limite de mensagem", "Tamanho máximo aceito, usado para evitar alocação descontrolada."],
        ["dados não confiáveis", "Entrada externa que nunca deve ser interpretada como comando."]
      ],
      {
        ex: [["Thread por conexão", "Aceita descritor, cria thread para atendê-lo e faz join ou detach conforme política."], ["Resposta de erro", "Código numérico curto e mensagem legível, ambos documentados no protocolo."]],
        er: ["Passar conteúdo recebido do cliente para interpretação de comando do sistema.", "Aceitar mensagens sem limite de tamanho e alocar conforme valor recebido."],
        lab: "Implemente servidor local com pool de quatro threads, protocolo de prefixo de tamanho e limite de 4 KiB; teste com dois clientes simultâneos.",
        ref: "POSIX.1-2017, accept, pthread e poll; RFC 9293 para comportamento de TCP.",
        derivation: "Com pool limitado, o número de threads é constante mesmo com muitos clientes. Se todas estão ocupadas, conexões ficam na fila de escuta; isso troca consumo ilimitado de recursos por latência controlada.",
        workedExamples: [
          ["Mensagem com cabeçalho", "Leia exatamente 4 bytes de tamanho, converta com ntohl, rejeite valores acima do limite e só então aloque o corpo."],
          ["Desligamento", "Ao receber pedido de término, feche o descritor de escuta, sinalize workers e aguarde as tarefas em andamento."]
        ],
        recallQuestions: [
          "Quais arquiteturas de servidor foram apresentadas? Resposta: fork/thread por conexão, pool de threads e laço de eventos.",
          "Por que limitar tamanho de mensagem? Resposta: para evitar alocação descontrolada e negação de serviço.",
          "Entrada do cliente deve virar comando de shell? Resposta: não; trate sempre como dado."
        ],
        masteryCriteria: [
          "Implementa servidor concorrente com estratégia documentada.",
          "Define protocolo com enquadramento, limite e erros.",
          "Garante fechamento de descritores e desligamento ordenado."
        ],
        tags: ["C14", "servidor", "protocolo", "concorrência"],
        estimatedEffort: 55
      }),
    L("Timeouts, desconexões e logs",
      "Evitar bloqueios indefinidos e registrar falhas sem expor dados sensíveis.",
      "Sockets, TCP e multiplexação.",
      "Rede falha: tempo limite, fim de conexão e erro precisam fazer parte do desenho.",
      "Chamadas bloqueantes podem travar para sempre se o par não responde. Defina timeout com poll e prazo em milissegundos, com SO_RCVTIMEO e SO_SNDTIMEO quando disponíveis, ou com sockets não bloqueantes que retornam EAGAIN ou EWOULDBLOCK. Em qualquer estratégia, trate EINTR e recalcule o prazo restante após interrupções.\n\nDesconexão em TCP é observada como recv igual a zero quando o par fecha a escrita; send pode falhar com erro de pipe quebrado. Em programas que usam sinal de pipe quebrado, escolha uma política explícita, como ignorá-lo e tratar o erro da chamada, ou usar opção de envio específica da plataforma. Feche o descritor e retire-o do conjunto de monitoramento quando a conexão terminar.\n\nLogs devem registrar o que ajuda a diagnosticar: horário, identificador de conexão, operação, código de erro e contexto mínimo. Não registre senhas, tokens ou conteúdo privado de mensagens. Use strerror(errno) ou equivalente, com indicação do local da falha. Nível de severidade e destino do log fazem parte da configuração; erro grave não deve ser silenciado.",
      [
        ["timeout", "Limite de tempo para aguardar uma operação antes de abandoná-la."],
        ["não bloqueante", "Modo em que chamadas retornam imediatamente quando não há dados."],
        ["EAGAIN/EWOULDBLOCK", "Erros que indicam ausência temporária de dados ou capacidade em descritor não bloqueante."],
        ["pipe quebrado", "Erro de enviar dados para conexão cujo leitor já fechou."],
        ["log estruturado", "Registro com campos consistentes, horário e contexto de diagnóstico."],
        ["redação de segredos", "Prática de não incluir credenciais ou dados sensíveis em logs."]
      ],
      {
        ex: [["poll(fds, 1, 2000)", "Espera no máximo dois segundos por atividade no descritor."], ["recv == 0", "Indica que o par encerrou a escrita; encerre a sessão e libere recursos."]],
        er: ["Confiar em chamada bloqueante sem timeout e deixar o servidor parar.", "Registrar corpo de mensagens que contêm credenciais."],
        lab: "Configure um cliente com timeout de dois segundos contra servidor que nunca responde, registre o erro e confirme que o processo termina.",
        ref: "POSIX.1-2017, poll, SO_RCVTIMEO, fcntl e errno; páginas de manual Linux socket(7) e signal(7).",
        derivation: "Após EINTR, o tempo já decorrido não volta: um timeout robusto calcula novamente o prazo restante antes de repetir poll. Isso evita espera infinita quando sinais chegam continuamente.",
        workedExamples: [
          ["Timeout com poll", "Chame poll com 2000 ms; se retornar zero, trate como expiração; se retornar -1 com EINTR, recalcule prazo e repita."],
          ["Log útil", "Registre `aceitar: conexao 7 de endereço local, falha em recv: Connection reset by peer`, sem incluir payload."]
        ],
        recallQuestions: [
          "O que significa recv == 0? Resposta: fim da conexão do lado do par.",
          "O que fazer com EAGAIN em socket não bloqueante? Resposta: aguardar prontidão com poll ou tentar mais tarde.",
          "O que nunca registrar em logs? Resposta: segredos e dados privados."
        ],
        masteryCriteria: [
          "Implementa timeout com poll ou opções de socket.",
          "Trata EOF, EINTR e erros de envio.",
          "Produz logs diagnósticos sem vazar segredos."
        ],
        tags: ["C14", "timeout", "logs", "desconexão"],
        estimatedEffort: 40
      })
  ]
});
CURRICULUM.c.modules.push({
  name: "C15 — Padrões, portabilidade e segurança",
  lessons: [
    L("C17, panorama de C23 e extensões",
      "Separar o que é ISO C do que é extensão de compilador ou API de sistema.",
      "Compilação com -std e -Wpedantic.",
      "C padrão, GCC/Clang e POSIX são três conjuntos diferentes, não sinônimos.",
      "A ISO C define a linguagem e a biblioteca padrão. C17 (ISO/IEC 9899:2018) é a versão amplamente usada; C23 (ISO/IEC 9899:2024) acrescenta recursos como nullptr, typeof, _BitInt, constexpr, #embed e palavras-chave bool, true e false, além de remover declarações de função no estilo antigo. O suporte varia por compilador, então verifique a documentação da versão instalada antes de adotar um recurso novo.\n\nExtensões GCC e Clang incluem coisas como statement expressions, certos atributos e blocos aninhados; são úteis, mas não são padrão. Compilar com -std=c17 -Wpedantic ajuda a identificá-las. APIs POSIX/Linux — pthread, unistd.h, sockets, mmap, epoll — pertencem ao sistema operacional, não à linguagem. Um programa pode usar todas as três camadas, desde que cada uma esteja identificada.\n\nPortabilidade não significa escrever o menor denominador comum de tudo: significa saber o que depende de quê. Tipo de largura fixa vem de stdint.h; tamanhos e alinhamento de tipos básicos dependem da implementação. Documentar o padrão exigido, as APIs de sistema e as extensões usadas é parte do contrato do projeto.",
      [
        ["ISO C", "Padrão que define sintaxe, semântica e biblioteca da linguagem C."],
        ["C17", "Versão da ISO C publicada como ISO/IEC 9899:2018."],
        ["C23", "Versão mais recente da ISO C, publicada como ISO/IEC 9899:2024, com suporte ainda variável."],
        ["extensão de compilador", "Recurso aceito por GCC ou Clang fora do padrão ISO C."],
        ["API POSIX", "Interface de sistema operacional, como pthread e unistd.h, fora da ISO C."],
        ["portabilidade", "Capacidade de adaptar código a outra plataforma com mudanças conhecidas."]
      ],
      {
        ex: [["gcc -std=c17 -Wpedantic", "Modo que sinaliza extensões fora do padrão solicitado."], ["uint32_t", "Tipo de largura fixa da ISO C, disponível quando a implementação o oferece."]],
        er: ["Achar que código POSIX compila em qualquer implementação C estritamente conformante.", "Usar recurso de C23 sem verificar suporte do compilador alvo."],
        lab: "Compile o mesmo arquivo com -std=c17 -Wpedantic e com o modo padrão do compilador; liste as diferenças diagnosticadas.",
        ref: "ISO/IEC 9899:2018 e ISO/IEC 9899:2024; documentação de GCC e Clang sobre modos de linguagem e extensões; POSIX.1-2017.",
        derivation: "Se um recurso não está na ISO C, um compilador em modo estrito pode recusá-lo ou avisar. O mesmo código pode compilar com GCC em modo GNU, portanto 'compilou aqui' não prova conformidade com o padrão.",
        workedExamples: [
          ["Três camadas", "printf vem da ISO C; pthread_create vem de POSIX; __attribute__ é extensão de GCC/Clang. Cada uma exige uma documentação diferente."],
          ["Escolha de tipo", "Para contar bytes use size_t; para protocolo com 32 bits use uint32_t; evite supor que int tem quatro bytes."]
        ],
        recallQuestions: [
          "pthread faz parte da ISO C? Resposta: não; é POSIX.",
          "O que -Wpedantic ajuda a detectar? Resposta: uso de extensões fora do padrão escolhido.",
          "C23 é suportado por todos os compiladores? Resposta: não; verifique a documentação da versão instalada."
        ],
        masteryCriteria: [
          "Classifica uma API como ISO C, POSIX ou extensão.",
          "Compila em modo padrão com avisos de pedantismo.",
          "Documenta requisitos de padrão e plataforma de um projeto."
        ],
        tags: ["C15", "C17", "C23", "portabilidade"],
        estimatedEffort: 30
      }),
    L("Comportamento definido, não especificado e indefinido",
      "Classificar expressões C por garantia e evitar construções que o padrão não define.",
      "Expressões, operadores e modelo de memória.",
      "Nem toda expressão que compila tem comportamento garantido pela ISO C.",
      "Comportamento definido é aquele que o padrão determina: por exemplo, aritmética unsigned reduz módulo 2^n. Comportamento implementation-defined é permitido variar, mas a implementação deve documentar a escolha, como o tamanho de int. Comportamento unspecified permite mais de uma alternativa sem exigir documentação, como a ordem de avaliação dos argumentos de uma função. Comportamento indefinido (UB) não impõe exigência alguma: o compilador pode otimizar como se a situação nunca ocorresse.\n\nExemplos claros: deslocar mais posições que a largura do tipo é UB; estourar signed int é UB; acessar fora de um array é UB; ler memória não inicializada costuma ser UB. A expressão i = i++ modifica i duas vezes sem sequenciamento e é UB. Já a ordem de avaliação de f(i++, i++) é não especificada, e esse código também deve ser evitado por ser confuso.\n\nA prática segura é escrever código sem UB verificável, usar avisos do compilador, sanitizers e análise estática, e definir contratos para entradas. UB não é 'vai dar erro na minha máquina': é perda de garantia. Uma expressão pode funcionar hoje e mudar de comportamento com outra versão do compilador ou nível de otimização.",
      [
        ["comportamento definido", "Comportamento que a ISO C exige de toda implementação conformante."],
        ["implementation-defined", "Comportamento variável que a implementação deve documentar."],
        ["não especificado", "Comportamento com mais de uma alternativa permitida, sem obrigação de documentar a escolha."],
        ["comportamento indefinido", "Situação sem qualquer exigência do padrão, que pode gerar otimizações surpreendentes."],
        ["sequenciamento", "Relação de ordem entre avaliações que determina quando um efeito colateral é observável."],
        ["sanitizer", "Ferramenta que detecta algumas ocorrências de UB em execução instrumentada."]
      ],
      {
        ex: [["i = i++;", "UB: duas modificações de i sem sequenciamento entre elas."], ["uint8_t x = 255; x + 1;", "Definido: resultado módulo 256."]],
        er: ["Achar que UB é apenas resultado imprevisível em tempo de execução.", "Confiar na ordem de avaliação de argumentos de função."],
        lab: "Classifique dez expressões como definida, implementation-defined, não especificada ou UB; justifique cada classificação com uma regra do padrão.",
        ref: "ISO/IEC 9899:2018 (C17), cláusulas de conceitos e expressões; documentação de GCC e Clang sobre comportamento indefinido.",
        derivation: "O compilador assume que UB nunca acontece. Se signed overflow é UB, ele pode inferir que x + 1 > x é sempre verdadeiro para signed x e remover checagens posteriores, o que explica otimizações surpreendentes.",
        workedExamples: [
          ["Argumentos", "Em f(i++, i++), o padrão não fixa a ordem e as modificações não são sequenciadas entre si: evite esse padrão."],
          ["Turno inválido", "1 << 32 em um tipo de 32 bits é UB. Use largura conhecida e limite o deslocamento."]
        ],
        recallQuestions: [
          "O que é implementation-defined? Resposta: comportamento variável que deve ser documentado pela implementação.",
          "Por que i = i++ é UB? Resposta: duas modificações sem sequenciamento.",
          "UB é equivalente a erro de execução? Resposta: não; o padrão não exige nada, inclusive pode otimizar."
        ],
        masteryCriteria: [
          "Classifica expressões nas quatro categorias.",
          "Evita dupla modificação sem sequenciamento.",
          "Explica por que UB permite otimizações surpreendentes."
        ],
        tags: ["C15", "UB", "sequenciamento", "padrão"],
        estimatedEffort: 35
      }),
    L("Aliasing e alinhamento",
      "Evitar violações da regra de tipo efetivo e acessos desalinhados.",
      "Ponteiros, structs e representação de objetos.",
      "Um ponteiro não autoriza reinterpretar a memória como qualquer tipo.",
      "A regra de aliasing da ISO C determina por qual tipo um objeto pode ser acessado. converter um ponteiro para float * e ler seus bytes como int viola a regra e é UB. Acessar a representação byte a byte com unsigned char é permitido, e memcpy entre objetos de tipos diferentes é a forma mais portátil de copiar bits. União é alternativa comum em código C, mas exige cuidado e documentação; memcpy costuma ser o caminho mais simples.\n\nAliasing também afeta otimização: se o compilador sabe que dois ponteiros de tipos distintos não podem apontar para o mesmo objeto, ele pode reordenar leituras e escritas. Código que depende de sobreposição não prevista pode mudar de comportamento com -O2.\n\nAlinhamento é outra exigência: objetos de certos tipos precisam estar em endereços múltiplos de determinado valor. _Alignof informa a exigência e _Alignas pode solicitar alinhamento. Acessar um objeto desalinhado por ponteiro de tipo com requisito maior é UB em muitas implementações. Structs podem conter padding entre campos; serializações devem usar codificação explícita, não cópia direta da struct. Extensões como atributos packed são específicas de compilador e podem gerar acessos desalinhados.",
      [
        ["aliasing", "Acesso ao mesmo objeto por mais de um ponteiro ou tipo."],
        ["tipo efetivo", "Tipo pelo qual um objeto deve ser acessado conforme a ISO C."],
        ["unsigned char", "Tipo que pode examinar a representação de bytes de qualquer objeto."],
        ["alinhamento", "Restrição de endereço que um tipo impõe para acesso válido."],
        ["_Alignof", "Operador da ISO C que informa o alinhamento exigido por um tipo."],
        ["padding", "Bytes de preenchimento inseridos entre campos para atender alinhamento."]
      ],
      {
        ex: [["memcpy(&i, &f, sizeof i)", "Copia bits de float para int sem violar aliasing, desde que os tamanhos sejam válidos."], ["_Alignof(double)", "Informa o alinhamento exigido por double na implementação."]],
        er: ["Ler um float por ponteiro int * para 'ver seus bits'.", "Desserializar struct por cópia direta de buffer sem checar alinhamento e padding."],
        lab: "Implemente uma função que reinterpreta bytes de um uint32_t usando memcpy e compare com acesso por ponteiro indevido sob UBSan em laboratório isolado.",
        ref: "ISO/IEC 9899:2018 (C17), regras de aliasing, _Alignof e representação de objetos; documentação de GCC sobre -fstrict-aliasing.",
        derivation: "Se o compilador assume que float * e int * nunca designam o mesmo objeto, ele pode manter um valor em registrador e não observar escrita feita pelo outro ponteiro. A violação da regra de aliasing destrói essa suposição e o comportamento deixa de ser garantido.",
        workedExamples: [
          ["Copiar bits", "Para inspecionar 32 bits de um float, memcpy para uint32_t e depois imprima em hexadecimal; evite cast direto."],
          ["Buffer de rede", "Construa valores com deslocamentos sobre uint8_t em vez de usar ponteiro uint32_t sobre o buffer recebido."]
        ],
        recallQuestions: [
          "Qual tipo pode inspecionar bytes de qualquer objeto? Resposta: unsigned char.",
          "O que _Alignof informa? Resposta: alinhamento exigido pelo tipo.",
          "Por que memcpy é portátil para cópia de bits? Resposta: evita acesso por tipo incompatível e problemas de alinhamento."
        ],
        masteryCriteria: [
          "Explica a regra de tipo efetivo com exemplo concreto.",
          "Usa memcpy em vez de cast de tipo incompatível.",
          "Trata alinhamento e padding em serialização."
        ],
        tags: ["C15", "aliasing", "alinhamento", "memcpy"],
        estimatedEffort: 40
      }),
    L("Overflow e validação de entrada",
      "Validar limites e converter dados externos sem criar transbordos.",
      "Comportamento indefinido, conversões e size_t.",
      "Entrada externa é dado hostil até prova em contrário.",
      "Toda leitura de arquivo, rede ou terminal deve passar por validação explícita. Antes de alocar n elementos, verifique se n excede SIZE_MAX dividido pelo tamanho do elemento; antes de somar índices, verifique se há espaço; antes de converter para tipo menor, confirme que o valor cabe. strtol e strtoul permitem converter texto com verificação de errno e do ponteiro de fim, que indica caracteres inválidos.\n\nPara texto, use leitura com tamanho máximo conhecido e sempre reserve espaço para o terminador. snprintf trunca com segurança quando o destino é pequeno, mas o chamador precisa entender o valor de retorno: ele informa quantos bytes seriam escritos. Funções da biblioteca que não recebem tamanho do destino não devem ser usadas com entrada arbitrária.\n\nSinais de alerta incluem subtração de size_t sem checar zero, conversão implícita entre signed e unsigned, confiar em tamanho informado pelo próprio protocolo sem limite e usar índice antes de verificar faixa. Em laboratório isolado, é legítimo reproduzir um estouro de buffer com dados sintéticos para observar ferramentas de detecção; nunca faça isso em sistema real ou com dados de terceiros.",
      [
        ["validação de entrada", "Verificação explícita de formato, intervalo e tamanho de dados externos."],
        ["SIZE_MAX", "Maior valor representável por size_t, definido em stdint.h ou stdint correspondente."],
        ["strtol", "Função de conversão de texto para long com relatório de erro e posição final."],
        ["buffer com terminador", "Área que precisa incluir espaço para o caractere nulo final de uma string C."],
        ["truncamento", "Redução controlada da saída ao tamanho do destino."],
        ["ambiente isolado", "Laboratório sem dados reais, usado para experimentos com falhas."]
      ],
      {
        ex: [["if (n > SIZE_MAX / sizeof *p)", "Teste antes de calcular n * sizeof *p para alocação."], ["errno = 0; long v = strtol(s, &fim, 10);", "Converte texto e permite verificar erro e caracteres restantes."]],
        lab: "Escreva um parser de inteiros que rejeita entrada vazia, sinais inválidos, valores fora da faixa e caracteres após o número.",
        ref: "ISO/IEC 9899:2018 (C17), stdlib.h, stdint.h e limites numéricos; documentação de Valgrind e sanitizers para experimentos isolados.",
        derivation: "Para evitar transbordo em n * k com k > 0, basta garantir n <= SIZE_MAX / k. A divisão não transborda e o teste é válido para todo n sem sinal.",
        workedExamples: [
          ["Leitura limitada", "Use fgets com tamanho do buffer; depois retire o caractere de nova linha se presente e confirme que a linha não foi truncada."],
          ["Tamanho do protocolo", "Se o cabeçalho diz 1000000 bytes mas o limite local é 4096, rejeite a mensagem antes de alocar."]
        ],
        recallQuestions: [
          "Por que checar SIZE_MAX / sizeof antes de alocar? Resposta: para evitar transbordo no cálculo do tamanho.",
          "O que o ponteiro final de strtol indica? Resposta: onde a conversão parou, permitindo detectar caracteres inválidos.",
          "Onde reproduzir estouro de buffer didático? Resposta: somente em laboratório isolado com dados sintéticos."
        ],
        er: ["Confiar em tamanho recebido da rede sem impor limite máximo.", "Ler texto com função que ignora o tamanho do destino."],
        masteryCriteria: [
          "Valida entrada com limites e verificação de erro.",
          "Evita transbordos em alocação e conversão.",
          "Mantém experimentos de falha restritos a ambiente isolado."
        ],
        tags: ["C15", "validação", "overflow", "strtol"],
        estimatedEffort: 40
      }),
    L("APIs seguras por contrato e documentação de interface",
      "Projetar funções com premissas claras, erros explícitos e ownership documentado.",
      "Contratos, ponteiros e assert da trilha de qualidade.",
      "Segurança vem de contratos verificáveis, não de nomes de função supostamente seguros.",
      "Uma API segura por contrato define pré-condições, pós-condições, domínio de parâmetros, códigos de erro e ownership. Prefira funções que recebem o tamanho do destino, retornam status explícito e não escondem alocação surpreendente. Documente se ponteiros podem ser nulos, se a memória é emprestada ou transferida e quem chama free.\n\nCuidado com falsa sensação de segurança: uma função com sufixo que sugere segurança pode truncar, exigir inicialização prévia ou não garantir terminação em todos os casos. Leia a especificação. strncpy, por exemplo, não garante string terminada se o destino ficar cheio. A chamada deve ser acompanhada da checagem apropriada. Recursos opcionais de biblioteca com versões 'seguras' não são universalmente disponíveis e não substituem contrato claro.\n\nDocumentação de interface deve acompanhar o código: arquivo de cabeçalho com comentários precisos, README com exemplos e testes que exercitam o contrato. Constantes de erro nomeadas são melhores que números mágicos. Em código criptográfico didático, identifique explicitamente que a implementação serve para estudo e não deve ser usada para proteger dados reais.",
      [
        ["contrato de API", "Conjunto documentado de pré-condições, pós-condições, erros e ownership de uma função."],
        ["ownership", "Responsabilidade pela liberação de recursos retornados ou recebidos."],
        ["emprestimo de ponteiro", "Uso temporário de ponteiro cuja posse permanece com outro componente."],
        ["código de erro", "Valor nomeado que permite ao chamador distinguir falhas."],
        ["terminação de string", "Garantia de que existe caractere nulo ao final de uma string C."],
        ["implementação didática", "Código escrito para estudo, não adequado para uso real sem revisão especializada."]
      ],
      {
        ex: [["int copiar(char *dst, size_t cap, const char *src)", "Contrato explícito: cap é a capacidade, dst não é nulo, retorno indica sucesso ou truncamento."], ["enum { OK = 0, ERR_ARG = 1, ERR_MEM = 2 };", "Códigos nomeados claros para o chamador."]],
        er: ["Assumir que qualquer função com nome 'seguro' garante terminação e ausência de erro.", "Deixar implícito quem libera ponteiro retornado por uma função."],
        lab: "Escreva uma pequena biblioteca de strings com cabeçalho documentando contrato, códigos de erro e ownership; cubra cada cláusula com teste.",
        ref: "ISO/IEC 9899:2018 (C17), especificações de string.h e stdio.h; práticas de documentação de interfaces em projetos C maduros.",
        derivation: "Se uma função promete terminar a string, ela precisa reservar um byte para o caractere nulo. Sem capacidade explícita, a promessa não pode ser cumprida para entradas arbitrárias; portanto o contrato deve incluir o tamanho do destino.",
        workedExamples: [
          ["Cópia com limite", "Copie no máximo cap - 1 caracteres e escreva o nulo na última posição; retorne erro se a fonte não couber."],
          ["Ownership explícito", "Funcao criar_retorna_bloco aloca e o chamador deve chamar destruir; funcao consulta apenas empresta ponteiro."]
        ],
        recallQuestions: [
          "O que uma API segura por contrato deve documentar? Resposta: pré e pós-condições, erros e ownership.",
          "strncpy sempre termina a string? Resposta: não, se o destino ficar cheio.",
          "Como sinalizar código criptográfico didático? Resposta: documentando claramente que não serve para uso real."
        ],
        masteryCriteria: [
          "Escreve contrato com parâmetros, erros e ownership.",
          "Verifica cada promessa com teste executável.",
          "Interpreta corretamente limites de funções de biblioteca."
        ],
        tags: ["C15", "API", "contratos", "documentação"],
        estimatedEffort: 45
      }),
    L("Análise estática, fuzzing e revisão de código",
      "Combinar ferramentas automáticas e revisão humana para reduzir defeitos.",
      "Avisos, sanitizers e validação de entrada.",
      "Cada técnica encontra um tipo de problema; nenhuma substitui as outras.",
      "Análise estática examina código sem executá-lo. O compilador com -Wall -Wextra -Wpedantic já faz parte dela; ferramentas como GCC -fanalyzer, clang static analyzer, clang-tidy e cppcheck encontram caminhos de erro, vazamentos e uso de valores não inicializados. A taxa de falsos positivos exige critério: priorize achados com evidência e mantenha regras configuradas para o projeto.\n\nFuzzing executa a função com muitas entradas geradas ou mutadas, buscando falhas. Uma suíte com corpus inicial pequeno, limite de tempo e registro de sementes que causaram falha é mais útil do que execução aleatória sem critério. Ferramentas como libFuzzer e AFL++ exigem compilação instrumentada. Experimentos com estouro de buffer e entradas malformadas devem ficar em laboratório isolado, com dados sintéticos e sem exposição a sistemas reais. Criptografia escrita para estudo deve ser rotulada como didática, nunca usada para proteger dados reais.\n\nRevisão de código complementa as ferramentas: verifique contrato, tratamento de erros, alinhamento com o padrão declarado, ownership, complexidade e testes. Um checklist curto e consistente funciona melhor do que revisão informal. Cobertura e número de bugs encontrados ajudam a medir o processo, mas a meta é código correto e mantível.",
      [
        ["análise estática", "Exame de código sem execução, feito por compilador ou ferramenta dedicada."],
        ["fuzzing", "Execução com grande número de entradas geradas para encontrar falhas."],
        ["corpus", "Conjunto de entradas iniciais usadas como sementes pelo fuzzer."],
        ["falso positivo", "Alerta que não corresponde a um defeito real."],
        ["checklist de revisão", "Lista fixa de pontos verificados em toda revisão de código."],
        ["evidência", "Saída, relatório ou teste que sustenta um achado."]
      ],
      {
        ex: [["gcc -fanalyzer", "Análise estática integrada ao GCC para detectar certos problemas de fluxo."], ["Corpus de sementes", "Arquivos pequenos com casos típicos e limites para orientar o fuzzer."]],
        er: ["Aceitar todos os alertas de uma ferramenta sem avaliar contexto.", "Rodar fuzzing com dados reais ou fora de ambiente controlado."],
        lab: "Em laboratório isolado, instrumente uma função de parsing com sanitizer, forneça dez sementes, execute fuzzing por tempo limitado e documente uma falha encontrada.",
        ref: "Documentação do GCC (-fanalyzer), Clang Static Analyzer, libFuzzer e AFL++; práticas de revisão de código documentadas em projetos de software livre.",
        derivation: "A análise estática cobre caminhos representáveis no grafo do programa; o fuzzing cobre entradas efetivamente executadas; a revisão cobre intenção e contrato. A interseção delas é menor que cada conjunto isolado, por isso são complementares.",
        workedExamples: [
          ["Pipe de ferramentas", "Compile com avisos, rode análise estática, execute testes sob ASan/UBSan e depois fuzz a função de parsing."],
          ["Revisão objetiva", "Checklist: contrato, limites, erros, ownership, padrão usado, teste de regressão e ausência de segredos no código."]
        ],
        recallQuestions: [
          "O que análise estática faz? Resposta: examina código sem executá-lo.",
          "Para que serve corpus no fuzzing? Resposta: fornece sementes iniciais e direções de exploração.",
          "Por que revisão humana ainda é necessária? Resposta: avalia intenção, contrato e contexto que ferramentas não conhecem."
        ],
        masteryCriteria: [
          "Executa ao menos uma ferramenta de análise estática.",
          "Configura fuzzing limitado em ambiente isolado.",
          "Aplica checklist de revisão com evidências."
        ],
        tags: ["C15", "análise estática", "fuzzing", "revisão"],
        estimatedEffort: 50
      })
  ]
});

CURRICULUM.c.modules.push({
  name: "Algoritmos e complexidade",
  lessons: [
    L("Especificação, invariantes e corretude",
      "Descrever um problema com pré e pós-condições e provar um laço com invariantes.",
      "Funções, laços e recursão da trilha C; noções de lógica proposicional.",
      "Um algoritmo correto não é o que parece funcionar: é o que mantém uma promessa a cada passo.",
      "A especificação descreve a entrada admitida e a saída esperada, sem prescrever como obtê-la. A pré-condição é o que se assume verdadeiro antes da execução; a pós-condição é o que se garante ao final. Se a pré-condição for falsa, o contrato não cobre o comportamento: isso é uso fora do contrato, não uma falha misteriosa do código.\n\nO pseudocódigo é uma descrição legível e independente de linguagem, feita de sequência, seleção, repetição e chamada de função. Ele permite discutir a ideia antes de se perder em detalhes de sintaxe.\n\nA corretude de um laço costuma ser provada com um invariante: propriedade verdadeira antes da primeira iteração (inicialização), preservada por cada iteração (manutenção) e que, junto com a condição de saída, implica a pós-condição (terminação). Para provar que o laço termina, usa-se uma função de terminação: valor inteiro não negativo que diminui a cada iteração.\n\nCorretude e eficiência são eixos distintos. Um algoritmo pode estar correto e ser caro, ou rápido e errado. A análise de custo vem depois da prova, nunca no lugar dela.",
      [
        ["especificação", "Descrição da entrada admitida e da saída esperada, sem prescrever a implementação."],
        ["pré-condição", "Afirmação que deve ser verdadeira antes da execução para que o contrato valha."],
        ["pós-condição", "Afirmação garantida ao final, desde que a pré-condição tenha sido satisfeita."],
        ["invariante de laço", "Propriedade verdadeira no início e preservada a cada iteração."],
        ["função de terminação", "Medida não negativa que diminui a cada iteração e prova que o laço termina."],
        ["pseudocódigo", "Descrição independente de linguagem com sequência, seleção e repetição."],
        ["corretude", "Propriedade de produzir a saída especificada para toda entrada válida."]
      ],
      {
        ex: [["Busca linear", "Invariante: se x ocorre em A[0..i-1], alguma posição menor que i já foi encontrada; ao final i = n e a busca foi exaustiva."], ["Soma de vetor", "Pré: n > 0. Pós: soma é igual à soma de A[0] até A[n-1]."]],
        er: ["Trocar a pós-condição pela descrição do código: 'incrementar i' não é uma especificação.", "Declarar o invariante no fim sem provar a manutenção a cada iteração."],
        lab: "Escreva pseudocódigo para encontrar o maior elemento de um vetor, enuncie pré e pós-condições e prove o invariante nas três etapas: inicialização, manutenção e terminação.",
        ref: "CLRS — Introduction to Algorithms, capítulos sobre prova de corretude; MIT OCW 6.042J (Mathematics for Computer Science), notas sobre invariantes.",
        derivation: "Se P vale antes do laço e cada iteração preserva P, então P vale após qualquer número de iterações, por indução. Ao sair, a condição de parada junto com P implica a pós-condição. A função de terminação impede execuções infinitas: um inteiro não negativo que sempre diminui não pode diminuir para sempre.",
        workedExamples: [
          ["Invariante da busca linear", "Antes de examinar A[i], nenhuma posição de 0 a i-1 contém x. Ao examinar A[i], se for x retornamos i; se não for, o invariante passa a valer até i. Quando i = n, concluímos que x não está no vetor."],
          ["Terminação da busca binária", "O intervalo [esq, dir] tem tamanho dir - esq + 1. A cada passo esse tamanho cai pelo menos pela metade: é a função de terminação. Logo o laço termina em no máximo log2(n+1) arredondado para cima iterações."]
        ],
        recallQuestions: [
          "O que distingue pré-condição de pós-condição? Resposta: a pré é assumida no início; a pós é garantida no fim.",
          "Quais são as três etapas da prova por invariante? Resposta: inicialização, manutenção e terminação.",
          "Para que serve a função de terminação? Resposta: provar que o laço não executa para sempre."
        ],
        masteryCriteria: [
          "Escreve especificações com pré e pós-condições verificáveis.",
          "Identifica e prova um invariante de laço nas três etapas.",
          "Justifica a terminação com uma medida que diminui."
        ],
        tags: ["Algoritmos", "especificação", "invariante", "corretude"],
        estimatedEffort: 45
      }),
    L("Análise de custo e notações assintóticas",
      "Contar operações dominantes e classificar o crescimento com O, Ω, Θ e amortização.",
      "Somatórios simples, função logaritmo e a aula de especificação e invariantes.",
      "Contar instruções exatas é frágil; contar como o custo cresce com n é o que permite comparar ideias.",
      "O modelo mais usado na análise elementar atribui custo constante a operações básicas (comparação, atribuição, acesso a posição) e mede o custo em função do tamanho n da entrada. Conta-se a operação dominante, cuja repetição determina o termo de maior crescimento; constantes multiplicativas e termos de baixa ordem são descartados na notação assintótica.\n\nDizemos que f(n) é O(g(n)) quando f cresce no máximo como g, a menos de uma constante, para n suficientemente grande. É Ω(g(n)) quando cresce pelo menos como g, e Θ(g(n)) quando vale ambas. O melhor caso considera a entrada mais favorável de tamanho n; o pior caso, a mais desfavorável; o caso médio exige declarar uma distribuição de probabilidade sobre as entradas.\n\nO custo amortizado é diferente do caso médio: ele garante que o total de uma sequência de operações dividido pelo número de operações é limitado, mesmo que uma operação isolada seja cara. O exemplo clássico é um vetor que dobra de capacidade: uma inserção pode copiar n elementos, mas n inserções custam no total menos que 3n cópias, resultando em O(1) amortizado por inserção.",
      [
        ["análise de algoritmo", "Contagem do crescimento do número de operações em função do tamanho da entrada."],
        ["operação dominante", "Operação cuja repetição determina o termo de maior crescimento do custo."],
        ["notação O", "Cota superior assintótica: f cresce no máximo como g, a menos de constante."],
        ["notação Ω", "Cota inferior assintótica: f cresce pelo menos como g, a menos de constante."],
        ["notação Θ", "Cota superior e inferior: f cresce da mesma ordem que g."],
        ["pior caso", "Maior custo entre todas as entradas de tamanho n."],
        ["caso médio", "Custo esperado sob uma distribuição de entradas declarada."],
        ["custo amortizado", "Custo por operação de uma sequência, com garantia sobre o total."]
      ],
      {
        ex: [["n² + 3n + 7", "É Θ(n²): o termo quadrático domina quando n cresce."], ["Vetor dinâmico", "Inserção é O(1) amortizado, embora uma expansão isolada custe O(n)."]],
        er: ["Afirmar que O(1) é sempre mais rápido que O(n) sem considerar constantes e tamanho da entrada.", "Confundir custo amortizado com caso médio: um é garantia sobre sequência, outro depende de distribuição."],
        lab: "Instrumente busca linear e busca binária, conte comparações para n = 10, 100 e 1000 e compare os resultados com n e com log2(n).",
        ref: "CLRS — Introduction to Algorithms, capítulo sobre crescimento de funções e análise assintótica; MIT OCW 6.042J.",
        derivation: "f(n) é O(g(n)) se existem constantes c > 0 e n0 com 0 ≤ f(n) ≤ c·g(n) para todo n ≥ n0. A notação Ω inverte a desigualdade e Θ exige as duas condições. Para laços aninhados, some o custo das iterações; para funções recursivas, escreva a recorrência e resolva por substituição, árvore de recursão ou teorema mestre.",
        workedExamples: [
          ["Selection sort", "O laço externo executa n-1 vezes e o interno faz (n-1) + (n-2) + ... + 1 = n(n-1)/2 comparações. Portanto o custo é Θ(n²) em todos os casos."],
          ["Vetor que dobra", "Após n inserções, as cópias totais são 1 + 2 + 4 + ... + n/2, menos que n. Somadas às n inserções, o total fica abaixo de 3n, logo o custo amortizado por inserção é constante."]
        ],
        recallQuestions: [
          "O que significa f(n) ser O(g(n))? Resposta: f cresce no máximo como g a menos de constante, para n grande.",
          "Por que o caso médio exige uma distribuição? Resposta: sem declarar quais entradas são prováveis não há como calcular uma esperança.",
          "Amortizado é o mesmo que caso médio? Resposta: não; amortizado é garantia sobre o total de uma sequência."
        ],
        masteryCriteria: [
          "Identifica a operação dominante e escreve a soma que a conta.",
          "Classifica corretamente um algoritmo simples com O, Ω ou Θ.",
          "Explica amortização com o exemplo do vetor dinâmico."
        ],
        tags: ["Algoritmos", "complexidade", "assintótica", "amortização"],
        estimatedEffort: 50
      }),
    L("Busca e ordenação clássicas",
      "Analisar busca linear, busca binária, seleção, inserção e bolha com contagem de comparações.",
      "Vetores, laços aninhados e a aula de análise de custo.",
      "Ordenar é transformar bagunça em estrutura; o modo como você descarta possibilidades define o custo.",
      "A busca linear examina elementos até encontrar o alvo ou acabar o vetor: não exige ordem prévia e custa Θ(n) no pior caso, mas Ω(1) quando o alvo está na primeira posição.\n\nA busca binária exige vetor ordenado. Compara o alvo com o elemento central e descarta metade do intervalo. Por isso seu custo é Θ(log n) no pior caso. Ao calcular o meio, use esq + (dir - esq) / 2 para evitar estouro de inteiro com índices grandes.\n\nA ordenação por seleção escolhe o menor elemento do trecho restante e o troca para a frente: sempre executa n(n-1)/2 comparações, logo Θ(n²), com apenas n-1 trocas. A ordenação por inserção mantém um prefixo ordenado e desloca elementos para abrir espaço: é Θ(n²) no pior caso, mas Θ(n) quando o vetor já está quase ordenado, e é estável. A ordenação por bolha compara vizinhos e troca os fora de ordem; é Θ(n²) e serve para análise didática, não como escolha prática. Com saída antecipada quando não há trocas, o caso já ordenado cai para Θ(n).\n\nUma ordenação é estável quando elementos com chaves iguais mantêm a ordem relativa original. Essa propriedade importa quando se ordena por uma chave e se quer preservar uma ordem secundária.",
      [
        ["busca linear", "Percorrer o vetor da frente para trás até encontrar o alvo ou esgotá-lo."],
        ["busca binária", "Comparar com o meio de um intervalo ordenado e descartar metade a cada passo."],
        ["selection sort", "Selecionar repetidamente o menor elemento restante e colocá-lo na frente."],
        ["insertion sort", "Inserir cada elemento na posição correta de um prefixo já ordenado."],
        ["ordenação por bolha", "Comparar pares adjacentes e trocar os que estão fora de ordem; uso didático."],
        ["estabilidade", "Propriedade de manter a ordem relativa de elementos com chaves iguais."],
        ["pré-condição da busca binária", "O intervalo consultado precisa estar ordenado para que o descarte seja válido."]
      ],
      {
        ex: [["Busca binária em 16 elementos", "O intervalo cai 16 → 8 → 4 → 2 → 1: no máximo 5 comparações, incluindo a verificação final."], ["Inserção quase ordenada", "Com poucos deslocamentos, insertion sort se aproxima de Θ(n) e costuma ser mais simples que algoritmos mais sofisticados em vetores pequenos."]],
        er: ["Aplicar busca binária em vetor não ordenado e acreditar no resultado.", "Calcular o meio como (esq + dir) / 2 com índices que podem estourar o intervalo do inteiro."],
        lab: "Implemente busca linear e busca binária com contador de comparações e meça os valores em vetores ordenados de 8, 64 e 1024 elementos.",
        ref: "CLRS — Introduction to Algorithms, capítulos sobre busca e ordenação em arrays; K. N. King, C Programming: A Modern Approach, capítulo de arrays.",
        derivation: "Busca binária satisfaz T(n) = T(n/2) + 1, logo T(n) = Θ(log n). A seleção faz (n-1) + (n-2) + ... + 1 = n(n-1)/2 comparações. A inserção, no pior caso, desloca 1 + 2 + ... + (n-1) posições; no melhor, compara uma vez por elemento. A bolha executa o mesmo somatório da seleção em comparações, com trocas adicionais.",
        workedExamples: [
          ["Contagem na busca binária", "Com n = 16 e alvo ausente, o intervalo é dividido até ficar vazio. Cada nível custa uma comparação, resultando em no máximo 5 comparações."],
          ["Quando insertion sort vence", "Em um vetor já ordenado, cada inserção faz uma comparação e nenhum deslocamento: Θ(n). Na ordem inversa, cada nova chave desloca todas as anteriores: Θ(n²)."]
        ],
        recallQuestions: [
          "Qual pré-condição a busca binária exige? Resposta: o intervalo consultado deve estar ordenado.",
          "Por que selection sort é Θ(n²) mesmo no melhor caso? Resposta: ele sempre varre todo o trecho restante para escolher o menor.",
          "O que significa ordenação estável? Resposta: elementos de chave igual preservam a ordem relativa original."
        ],
        masteryCriteria: [
          "Conta comparações de busca linear e binária em vetores concretos.",
          "Explica por que insertion sort degrada com a ordem inversa e melhora com ordem quase perfeita.",
          "Escolhe entre busca linear e binária conforme a pré-condição do vetor."
        ],
        tags: ["Algoritmos", "busca", "ordenação", "comparações"],
        estimatedEffort: 50
      }),
    L("Ordenação eficiente e não comparativa",
      "Comparar merge sort, quicksort, heapsort, counting sort e radix sort quanto a tempo, espaço e estabilidade.",
      "Recorrências, vetores, pilha e fila de prioridade; aula anterior de ordenação clássica.",
      "Não existe uma ordenação universalmente melhor: o limite depende do modelo de comparação e do tipo de chave.",
      "O merge sort divide o vetor ao meio, ordena cada metade e intercala as duas: Θ(n log n) de tempo, Θ(n) de espaço extra e estável.\n\nO quicksort particiona o vetor em torno de um pivô e ordena as duas partes. Com pivôs equilibrados o custo médio é Θ(n log n); com pivôs sempre extremos ele degrada para Θ(n²). Usa pouco espaço extra e não é estável na implementação típica. Pivô aleatório ou mediana de três reduzem a chance do pior caso, mas não o eliminam por garantia determinística.\n\nO heapsort usa uma fila de prioridade em forma de heap: Θ(n log n) em todos os casos, espaço constante e não estável. É a escolha quando se quer limite de pior caso sem memória adicional.\n\nO counting sort conta frequências de chaves inteiras em um intervalo pequeno e custa Θ(n + k), onde k é a amplitude das chaves. O radix sort aplica ordenação estável dígito a dígito e custa Θ(d(n + k)), com d dígitos. Ambos burlam o limite inferior de Ω(n log n) das ordenações por comparação justamente por não comparar chaves diretamente — mas exigem chaves discretas e intervalo controlado.",
      [
        ["merge sort", "Divisão e conquista com intercalação final; Θ(n log n) e espaço linear."],
        ["quicksort", "Particionamento em torno de um pivô; médio Θ(n log n), pior Θ(n²)."],
        ["heapsort", "Ordenação via heap; Θ(n log n) garantido e espaço constante."],
        ["counting sort", "Contagem de frequências de chaves em intervalo limitado; Θ(n + k)."],
        ["radix sort", "Ordenação estável por dígitos sucessivos; Θ(d(n + k))."],
        ["limite inferior por comparação", "Toda ordenação baseada apenas em comparações custa Ω(n log n) no pior caso."],
        ["particionamento", "Reorganizar o vetor deixando menores que o pivô à esquerda e maiores à direita."]
      ],
      {
        ex: [["Merge sort", "Θ(n log n) de tempo, Θ(n) de espaço extra e estável: bom quando estabilidade importa."], ["Counting sort", "Com chaves entre 0 e 99 e n = 100000, o custo é Θ(n + 100), desde que o intervalo seja conhecido."]],
        er: ["Escolher counting sort para chaves arbitrárias ou com intervalo gigante.", "Achar que quicksort é sempre Θ(n log n), ignorando o pior caso com pivô extremo."],
        lab: "Implemente merge sort e quicksort com contadores de comparações e de cópias; compare em vetores aleatórios, já ordenados e em ordem inversa.",
        ref: "CLRS — Introduction to Algorithms, capítulos de divisão e conquista, heap e ordenação linear; MIT OCW 6.042J, notas sobre recorrências.",
        derivation: "Merge sort: T(n) = 2T(n/2) + Θ(n), que o teorema mestre resolve como Θ(n log n). Quicksort: T(n) = T(k) + T(n-k-1) + Θ(n); com k ≈ n/2 dá Θ(n log n), com k = 0 dá Θ(n²). A árvore de decisão de uma ordenação por comparação tem n! folhas, logo altura Ω(log(n!)) = Ω(n log n). Counting e radix sort não comparam diretamente e por isso escapam desse limite.",
        workedExamples: [
          ["Escolha informada", "Para uso geral com memória restrita, heapsort garante Θ(n log n) sem espaço extra. Para desempenho médio em bibliotecas, quicksort com pivô aleatório. Para chaves pequenas e limitadas, counting sort."],
          ["Counting sort passo a passo", "Conte a frequência de cada chave, transforme contagens em posições acumuladas, percorra o vetor original de trás para frente e escreva cada elemento na posição calculada: estável e linear em n + k."]
        ],
        recallQuestions: [
          "Por que merge sort usa espaço linear? Resposta: a intercalação precisa de um vetor auxiliar para as duas metades.",
          "Quando quicksort degrada para Θ(n²)? Resposta: quando o pivô é sempre extremo, deixando um lado vazio.",
          "Como counting sort escapa do limite Ω(n log n)? Resposta: ele não ordena por comparação entre chaves,usa contagem de frequências."
        ],
        masteryCriteria: [
          "Resolve a recorrência de merge sort e do quicksort equilibrado.",
          "Indica tempo, espaço e estabilidade de cada algoritmo visto.",
          "Justifica quando uma ordenação não comparativa é aplicável."
        ],
        tags: ["Algoritmos", "ordenação", "recorrência", "counting sort"],
        estimatedEffort: 55
      }),
    L("Estratégias de projeto: recursão, backtracking, dinâmica e gulosos",
      "Distinguir divisão e conquista, backtracking, programação dinâmica e algoritmos gulosos.",
      "Recursão, funções, vetores e as aulas de análise de custo e ordenação eficiente.",
      "A estratégia é a forma de dividir o trabalho; escolher a errada transforma uma ideia simples em exponential.",
      "A recursão resolve um caso diretamente (caso base) e chama a si mesma em instâncias menores. Sem caso base, ou sem progresso rumo a ele, a pilha estoura. Recursão pura pode repetir trabalho: Fibonacci recursivo recalcula os mesmos subproblemas muitas vezes.\n\nDivisão e conquista tem três passos: dividir, resolver recursivamente e combinar. Merge sort e busca binária são exemplos.\n\nBacktracking constrói uma solução por decisões sucessivas e volta atrás quando uma decisão leva a um estado impossível. A poda descarta ramos que não podem dar solução, reduzindo a busca sem mudar o que é aceito. O problema das N-rainhas é o exemplo clássico.\n\nProgramação dinâmica aplica-se quando há subproblemas sobrepostos e estrutura ótima: guarda-se o resultado de cada subproblema por memoização (de cima para baixo) ou tabulação (de baixo para cima). Fibonacci com memoização cai de tempo exponencial para Θ(n).\n\nAlgoritmos gulosos fazem a escolha local que parece melhor e nunca voltam atrás. Isso só é correto quando a escolha local é segura, isto é, quando existe uma solução ótima que a inclui. Com moedas de valores 1, 3 e 4, o guloso para 6 escolhe 4+1+1 (três moedas), mas o ótimo é 3+3 (duas): sem prova da propriedade de escolha segura, o guloso é apenas uma heurística.",
      [
        ["recursão", "Função que resolve o problema chamando a si mesma em instâncias menores."],
        ["caso base", "Condição que encerra a recursão sem nova chamada."],
        ["divisão e conquista", "Estratégia de dividir, resolver partes e combinar os resultados."],
        ["backtracking", "Busca por decisões sucessivas que desfaz a última decisão quando ela falha."],
        ["poda", "Descarte de ramos da busca que não podem conter solução válida."],
        ["programação dinâmica", "Reutilização de soluções de subproblemas sobrepostos."],
        ["memoização", "Armazenamento de resultados de subproblemas durante a recursão."],
        ["tabulação", "Preenchimento iterativo de uma tabela de subproblemas, do menor para o maior."],
        ["algoritmo guloso", "Escolha local ótima sem reconsideração, correta apenas com escolha segura."]
      ],
      {
        ex: [["Fibonacci", "Recursão pura faz trabalho exponencial; memoização ou tabulação reduzem para Θ(n)."], ["Troco com moedas 1, 3 e 4", "Para o valor 6, o guloso dá 4+1+1 (três moedas), mas o ótimo é 3+3 (duas)."]],
        er: ["Esquecer o caso base e estourar a pilha de chamadas.", "Aplicar estratégia gulosa sem provar que a escolha local é segura."],
        lab: "Implemente Fibonacci das três formas (recursiva, memoizada e tabulada), conte as chamadas e implemente backtracking para N-rainhas com N = 8.",
        ref: "CLRS — Introduction to Algorithms, capítulos sobre programação dinâmica e algoritmos gulosos; MIT OCW 6.042J, notas sobre indução e recursão.",
        derivation: "A recursão pura de Fibonacci satisfaz T(n) = T(n-1) + T(n-2) + Θ(1), solução Θ(φ^n). Com memoização, cada um dos n subproblemas é calculado uma única vez: Θ(n). O backtracking enumera uma árvore de decisões; a poda remove ramos inviáveis. Programação dinâmica exige subproblemas sobrepostos; gulosos exigem propriedade de escolha segura e estrutura ótima.",
        workedExamples: [
          ["De recursivo para memoizado", "Guarde fib(k) em um vetor na primeira vez que for calculado e consulte o valor nas chamadas seguintes. O número de chamadas cai de exponencial para linear."],
          ["N-rainhas com poda", "Posicione uma rainha por coluna; antes de fixar, verifique linha e diagonais já ocupadas. Se houver conflito, tente a próxima linha; se não houver, avance para a coluna seguinte."]
        ],
        recallQuestions: [
          "Quando a programação dinâmica é aplicável? Resposta: quando há subproblemas sobrepostos e estrutura ótima.",
          "O que a poda faz no backtracking? Resposta: descarta ramos que não podem levar a uma solução válida.",
          "Por que o guloso falha com moedas 1, 3 e 4 no valor 6? Resposta: a escolha local de 4 não é segura; o ótimo usa 3+3."
        ],
        masteryCriteria: [
          "Identifica caso base e progresso em uma recursão.",
          "Escolhe entre memoização e tabulação com justificativa.",
          "Reconhece quando uma estratégia gulosa carece de prova."
        ],
        tags: ["Algoritmos", "recursão", "backtracking", "programação dinâmica", "guloso"],
        estimatedEffort: 60
      }),
    L("Grafos: representação, BFS, DFS e ordenação topológica",
      "Representar grafos e usar buscas para componentes conexos e ordenação de dependências.",
      "Vetores, filas, pilhas e recursão; noções de grafo da matemática discreta.",
      "Um grafo é só vértices e ligações; quase tudo que se faz com ele começa em percorrer essas ligações sem repetir trabalho.",
      "Um grafo é um par G = (V, E), com vértices e arestas. As arestas podem ser direcionadas ou não, e podem ter pesos. A lista de adjacência guarda, para cada vértice, a lista de vizinhos: ocupa Θ(V + E) e é eficiente em grafos esparsos. A matriz de adjacência ocupa Θ(V²), mas responde rápido se uma aresta específica existe; é adequada a grafos densos.\n\nA busca em largura (BFS) usa uma fila e descobre vértices por camadas. Em grafo não ponderado, a camada em que um vértice é descoberto dá o menor número de arestas até ele. Custa Θ(V + E).\n\nA busca em profundidade (DFS) usa pilha ou recursão e registra tempo de descoberta e de término. Também custa Θ(V + E) e é a base para detecção de ciclos e ordenação topológica.\n\nPara encontrar componentes conexos em grafo não direcionado, varra os vértices: ao encontrar um ainda não visitado, rode uma busca a partir dele e conte o alcançado; repetir até cobrir todos os vértices.\n\nUm grafo direcionado acíclico (DAG) admite ordenação topológica: uma sequência em que toda aresta u → v coloca u antes de v. Duas formas usuais são DFS com términos em ordem decrescente e o algoritmo de Kahn, que começa pelos vértices com grau de entrada zero. Se sobrar vértice sem ser processado, o grafo tem ciclo e não existe ordenação topológica.",
      [
        ["grafo", "Estrutura formada por vértices e arestas, direcionadas ou não."],
        ["lista de adjacência", "Representação que guarda os vizinhos de cada vértice; Θ(V + E) de espaço."],
        ["matriz de adjacência", "Representação em matriz V por V; Θ(V²) de espaço e consulta direta de aresta."],
        ["BFS", "Busca em largura com fila; descobre vértices por camadas."],
        ["DFS", "Busca em profundidade com pilha ou recursão; registra descoberta e término."],
        ["componente conexo", "Conjunto máximo de vértices mutuamente alcançáveis em grafo não direcionado."],
        ["DAG", "Grafo direcionado sem ciclos."],
        ["ordenação topológica", "Sequência dos vértices em que cada aresta aponta para frente."],
        ["tempo de término", "Instante em que o DFS termina de explorar um vértice."]
      ],
      {
        ex: [["BFS", "Em grafo não ponderado, o menor caminho em número de arestas é dado pelo nível em que o vértice foi descoberto."], ["Topológica", "Se a tarefa A depende de B, B deve aparecer antes de A na sequência."]],
        er: ["Tentar ordenação topológica em grafo que contém ciclo.", "Trocar a fila do BFS por pilha e ainda esperar menores caminhos em número de arestas."],
        lab: "Implemente lista de adjacência, BFS e DFS com contador de visitas e gere a ordem topológica de um grafo de dependências com 10 tarefas.",
        ref: "CLRS — Introduction to Algorithms, capítulos sobre estruturas e algoritmos para grafos; MIT OCW 6.042J, notas sobre grafos.",
        derivation: "No BFS cada vértice entra na fila uma vez e cada aresta é examinada uma vez, ou duas em grafo não direcionado: Θ(V + E). No DFS cada vértice é descoberto e terminado uma vez. Em um DAG, se existe aresta u → v, o término de v precede o de u; portanto ordenar por término decrescente satisfaz a condição topológica.",
        workedExamples: [
          ["Contando componentes", "Varra os vértices em ordem; ao achar um não visitado, rode BFS e anote o tamanho daquele componente. A soma dos tamanhos é V."],
          ["Algoritmo de Kahn", "Enfileire os vértices com grau de entrada zero; a cada remoção, decremente o grau dos vizinhos. Se ainda sobrarem vértices, há ciclo."]
        ],
        recallQuestions: [
          "Qual representação convém para grafo esparsos? Resposta: lista de adjacência, por ocupar Θ(V + E).",
          "O que o BFS garante em grafo não ponderado? Resposta: menor número de arestas até cada vértice alcançável.",
          "Por que a ordem topológica falha em grafo com ciclo? Resposta: uma dependência circular não pode ser satisfeita por uma sequência linear."
        ],
        masteryCriteria: [
          "Implementa lista de adjacência e percorre o grafo com BFS e DFS.",
          "Conta componentes conexos com buscas sucessivas.",
          "Produz e verifica uma ordenação topológica de um DAG pequeno."
        ],
        tags: ["Algoritmos", "grafos", "BFS", "DFS", "topológica"],
        estimatedEffort: 55
      }),
    L("Grafos ponderados: caminhos mínimos, árvores geradoras e fluxo",
      "Escolher e justificar algoritmos para caminhos mínimos, árvores geradoras mínimas e fluxo máximo.",
      "BFS, DFS, fila de prioridade, programação dinâmica e algoritmos gulosos.",
      "A aresta tem preço: a pergunta certa muda completamente o algoritmo certo.",
      "O problema do caminho mínimo de uma fonte a todos os vértices tem duas respostas usuais. Dijkstra usa fila de prioridade e é Θ((V + E) log V) com heap binário, mas exige pesos não negativos: com aresta negativa sua suposição de que o próximo vértice já tem distância definitiva deixa de valer. Bellman-Ford relaxa todas as arestas V-1 vezes, custa Θ(VE), aceita pesos negativos e detecta ciclos negativos com uma rodada extra. Para todos os pares, Floyd-Warshall usa programação dinâmica com um vértice intermediário k e custa Θ(V³) tempo e Θ(V²) memória.\n\nUma árvore geradora mínima liga todos os vértices de um grafo não direcionado conexo com menor soma de pesos e sem ciclos. Kruskal ordena as arestas e as aceita se não formam ciclo, usando união-encontro: Θ(E log E). Prim cresce uma única árvore escolhendo a aresta mais barata que cruza o corte, com fila de prioridade: Θ((V + E) log V). Ambos são gulosos corretos por causa da propriedade do corte.\n\nFluxo máximo, em versão introdutória, procura enviar o maior volume possível da fonte ao sumidouro respeitando capacidades. O método de caminhos aumentantes de Ford-Fulkerson melhora o fluxo enquanto existe caminho com capacidade residual; Edmonds-Karp escolhe esse caminho por BFS e é polinomial. O teorema max-flow min-cut afirma que o maior fluxo iguala a menor capacidade de um corte que separa fonte e sumidouro.",
      [
        ["Dijkstra", "Caminho mínimo de uma fonte com pesos não negativos, usando fila de prioridade."],
        ["Bellman-Ford", "Relaxamento de todas as arestas V-1 vezes; aceita pesos negativos e detecta ciclos negativos."],
        ["Floyd-Warshall", "Programação dinâmica para caminhos mínimos entre todos os pares; Θ(V³)."],
        ["relaxamento de aresta", "Teste que substitui a distância conhecida por uma menor passando pela aresta."],
        ["ciclo negativo", "Ciclo cuja soma de pesos é negativa, que torna o caminho mínimo mal definido."],
        ["árvore geradora mínima", "Árvore que liga todos os vértices com a menor soma de pesos de arestas."],
        ["Kruskal", "Algoritmo guloso que ordena arestas e evita ciclos com união-encontro."],
        ["Prim", "Algoritmo guloso que cresce a árvore pela aresta mais barata que cruza o corte."],
        ["fluxo máximo", "Maior volume enviável da fonte ao sumidouro respeitando capacidades."],
        ["teorema max-flow min-cut", "O valor do fluxo máximo é igual à capacidade do corte mínimo."]
      ],
      {
        ex: [["Escolha do algoritmo", "Há aresta negativa? Bellman-Ford. Precisa de todos os pares? Floyd-Warshall. Quer ligar todos os vértices com menor peso total? Kruskal ou Prim."], ["Dijkstra com heap", "Cada vértice é extraído uma vez e cada aresta é relaxada: Θ((V + E) log V) com heap binário."]],
        er: ["Usar Dijkstra em grafo com aresta de peso negativo.", "Aplicar Kruskal em grafo direcionado esperando obter uma árvore geradora mínima."],
        lab: "Implemente Dijkstra com heap e Bellman-Ford; compare em grafo com e sem aresta negativa; implemente Kruskal com união-encontro para um grafo de 8 vértices.",
        ref: "CLRS — Introduction to Algorithms, capítulos sobre caminhos mínimos, árvores geradora mínimas e fluxo máximo; MIT OCW 6.042J, notas sobre grafos.",
        derivation: "Dijkstra é correto com pesos não negativos porque, ao extrair o vértice de menor distância provisória, nenhum caminho futuro pode melhorá-lo. Bellman-Ford executa V-1 rodadas porque um caminho simples tem no máximo V-1 arestas; uma melhoria na rodada V indica ciclo negativo. Floyd-Warshall aplica d[k][i][j] = mínimo entre d[k-1][i][j] e d[k-1][i][k] + d[k-1][k][j]. A propriedade do corte justifica a escolha gulosa em Kruskal e Prim.",
        workedExamples: [
          ["Comparação de custos", "Grafo esparso com pesos positivos: Dijkstra com lista de adjacência. Grafo com arestas negativas e poucos vértices: Bellman-Ford. Matriz pequena e todos os pares: Floyd-Warshall."],
          ["Detectando ciclo negativo", "Depois das V-1 rodadas de Bellman-Ford, faça uma rodada extra: se alguma distância ainda diminui, existe ciclo de peso negativo alcançável a partir da fonte."]
        ],
        recallQuestions: [
          "Por que Dijkstra exige pesos não negativos? Resposta: a extração do menor valor provisório deixa de ser definitiva com arestas negativas.",
          "O que Bellman-Ford faz além de calcular distâncias? Resposta: detecta ciclo negativo com uma rodada extra de relaxamento.",
          "O que afirma o teorema max-flow min-cut? Resposta: fluxo máximo iguala a capacidade do corte mínimo."
        ],
        masteryCriteria: [
          "Escolhe o algoritmo de caminho mínimo conforme sinal dos pesos e conjunto de pares desejado.",
          "Explica a propriedade do corte por trás de Kruskal e Prim.",
          "Descreve caminhos aumentantes e o teorema max-flow min-cut."
        ],
        tags: ["Algoritmos", "grafos", "Dijkstra", "MST", "fluxo"],
        estimatedEffort: 60
      })
  ]
});

CURRICULUM.c.modules.push({
  name: "Laboratório de algoritmos",
  lessons: [
    L("Laboratório de algoritmos",
      "Aplicar um protocolo de sete entregáveis para estudar qualquer algoritmo na prática.",
      "Pelo menos um algoritmo implementado; noções de contagem de operações e prova por invariante.",
      "Um algoritmo só é de fato entendido quando você vê cada passo, conta cada decisão e defende por que ele acerta.",
      "Este laboratório transforma o estudo de um algoritmo em sete artefatos concretos.\n\n(1) Visualizador de passos: mostre o estado a cada iteração — o vetor e os índices em uma ordenação, o intervalo esq/meio/dir em uma busca, a fila do BFS ou o vértice atual do Dijkstra. O objetivo é tornar o invariante visível.\n\n(2) Contador de comparações: incremente em cada decisão que compara chaves. (3) Contador de operações: conte o que o modelo de custo destaca — trocas, deslocamentos, relaxamentos, inserções na fila. Os contadores são instrumentação: não podem mudar o comportamento do algoritmo nem ser confundidos com tempo de parede.\n\n(4) Casos de entrada: registre vetor vazio, um elemento, já ordenado, em ordem inversa, com valores repetidos, aleatório e um caso construído para provocar o pior caso. Para cada um, anote n e os contadores.\n\n(5) Análise de complexidade: derive melhor, médio e pior caso e compare a forma de crescimento prevista com os contadores medidos. A medição amostra pontos; a análise explica a tendência.\n\n(6) Prova ou argumento de corretude: enuncie a pré e a pós-condição, o invariante do laço com suas três etapas e uma medida de terminação. Relacione o argumento ao que o visualizador mostra.\n\n(7) Testes aleatórios e casos extremos: compare a saída com uma implementação de referência confiável em centenas de entradas geradas com semente registrada. Uma falha com semente anotada é reproduzível; uma falha sem semente é quase impossível de investigar. Testes com entrada malformada ou estouro devem rodar em ambiente isolado, com dados sintéticos e sanitizers do compilador.",
      [
        ["visualizador de passos", "Representação do estado do algoritmo a cada iteração, tornando o invariante observável."],
        ["contador de comparações", "Instrumentação que conta decisões baseadas em comparação de chaves."],
        ["contador de operações", "Instrumentação que conta a operação dominante definida no modelo de custo."],
        ["casos de entrada", "Conjunto planejado de entradas típicas, adversariais e limites."],
        ["análise de complexidade", "Derivação do crescimento do custo que explica os contadores observados."],
        ["argumento de corretude", "Justificativa formal ou semiformal de que o algoritmo satisfaz a especificação."],
        ["teste aleatório", "Bateria de entradas geradas por processo reprodutível com semente registrada."],
        ["caso extremo", "Entrada no limite do contrato, como vetor vazio, um elemento ou valores repetidos."],
        ["semente reproduzível", "Valor inicial do gerador aleatório que permite repetir exatamente a bateria de testes."]
      ],
      {
        ex: [["Instrumentação de insertion sort", "Conte comparações no while e deslocamentos no corpo, e mostre i e j a cada volta do laço externo."], ["Teste diferencial", "Compare a saída com qsort em 1000 vetores aleatórios e cinco casos extremos, registrando a semente usada."]],
        er: ["Medir tempo de parede uma vez e chamar isso de análise de complexidade.", "Colocar a impressão do visualizador dentro da contagem, alterando o custo que se quer medir."],
        lab: "Escolha um algoritmo da trilha e entregue os sete artefatos: visualizador, contador de comparações, contador de operações, cinco entradas documentadas, análise de complexidade justificada, prova por invariante e bateria de 500 testes aleatórios com semente registrada.",
        ref: "CLRS — Introduction to Algorithms, capítulos de análise e prova de corretude; MIT OCW 6.042J, notas sobre invariantes; documentação do compilador sobre ASan e UBSan para testes instrumentados.",
        derivation: "A medição isolada não prova complexidade porque amostra apenas pontos. A prova assintótica explica a tendência, e os contadores ligam a teoria à execução. O teste aleatório amplia a cobertura de entradas e a semente garante reprodução. O argumento de corretude cobre o que nenhuma bateria de testes consegue: todas as entradas válidas do contrato.",
        workedExamples: [
          ["Protocolo para busca binária", "Visualize esq, meio e dir; conte comparações; teste vetor vazio, de um elemento, alvo ausente, na primeira e na última posição; prove o invariante do intervalo; rode 500 vetores ordenados comparando com busca linear."],
          ["Relatório de laboratório", "Tabela com n, comparações observadas, previsão assintótica, operações de escrita e resultado do teste diferencial, acompanhada da semente e do argumento de invariante."]
        ],
        recallQuestions: [
          "Quais são os sete entregáveis do laboratório? Resposta: visualizador, contador de comparações, contador de operações, casos de entrada, análise de complexidade, argumento de corretude e testes aleatórios com extremos.",
          "Por que registrar a semente dos testes? Resposta: para reproduzir exatamente a entrada que causou uma falha.",
          "Por que separar comparações de operações? Resposta: porque o modelo de custo pode destacar operações diferentes da decisão de comparação."
        ],
        masteryCriteria: [
          "Entrega um visualizador de passos legível para o algoritmo escolhido.",
          "Conta comparações sem alterar o algoritmo instrumentado.",
          "Conta a operação dominante definida no modelo de custo.",
          "Documenta entradas típicas, adversariais e extremas com seus contadores.",
          "Apresenta análise de complexidade justificada e compatível com as medições.",
          "Apresenta prova ou argumento de corretude com invariante e terminação.",
          "Executa testes aleatórios reprodutíveis com semente registrada."
        ],
        tags: ["Algoritmos", "laboratório", "instrumentação", "testes", "corretude"],
        estimatedEffort: 90
      })
  ]
});

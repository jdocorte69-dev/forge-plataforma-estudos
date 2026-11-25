/* ============================================================
   FORGE — data-c.js — Trilha C
   ============================================================ */

CURRICULUM.c = {
  name: "C",
  icon: "Ｃ",
  modules: [
    {
      name: "Fundamentos da linguagem C",
      lessons: [
        L("Tipos, variáveis e operadores",
          "Declarar dados corretamente e entender como o compilador os representa.",
          "Nenhum. Noções de lógica ajudam.",
          "Variáveis são caixas nomeadas na memória; o tipo define o tamanho da caixa e o que se pode guardar nela.",
          "C é uma linguagem de tipagem estática: todo dado tem um tipo conhecido em tempo de compilação. int, char, float e double ocupam quantidades diferentes de memória. A declaração reserva espaço; a inicialização coloca um valor. Operadores aritméticos, relacionais e lógicos formam expressões, e conversões implícitas entre tipos podem gerar resultados surpreendentes.",
          [
            ["tipo", "Classificação de um dado que define tamanho e operações permitidas."],
            ["declaração", "Comando que reserva espaço para uma variável com determinado tipo."],
            ["inicialização", "Atribuição de um valor inicial no momento da declaração."],
            ["operador aritmético", "Símbolo como +, -, * e / que realiza cálculo."],
            ["conversão implícita", "Transformação automática de um tipo em outro feita pelo compilador."]
          ],
          {
            ex: [["int idade = 20;", "Declara e inicializa uma variável inteira."], ["double media = (a + b) / 2.0;", "Evita divisão inteira usando 2.0."]],
            er: ["Usar %d para imprimir double.", "Esperar que 5/2 resulte em 2.5 sem conversão para ponto flutuante."],
            lab: "No editor C, declare variáveis de tipos diferentes e observe os avisos do compilador."
          }),
        L("Controle de fluxo",
          "Controlar a ordem de execução com condicionais e repetições.",
          "Operadores relacionais e lógicos.",
          "Programas raramente são retas: eles decidem e repetem.",
          "if e switch implementam decisões; while, do-while e for implementam repetição. A condição é uma expressão que vira verdadeiro ou falso. Atenção ao uso de = no lugar de ==, erro clássico que atribui em vez de comparar. break interrompe o laço; continue pula para a próxima iteração.",
          [
            ["condicional", "Estrutura que executa um bloco apenas se uma condição for verdadeira."],
            ["switch", "Estrutura que seleciona um caso entre várias opções."],
            ["laço for", "Repetição com inicialização, condição e atualização em uma linha."],
            ["break", "Comando que interrompe imediatamente o laço ou switch atual."],
            ["== vs =", "Comparação de igualdade versus atribuição de valor."]
          ],
          {
            ex: [["if (x == 10)", "Testa se x é igual a 10."], ["for (int i = 0; i < 10; i++)", "Repete dez vezes com i de 0 a 9."]],
            er: ["Escrever if (x = 5) por engano.", "Laços sem condição de parada clara."],
            lab: "Escreva um programa que some os números de 1 a 100 com um laço for."
          }),
        L("Funções e escopo",
          "Dividir programas em funções reutilizáveis e entender visibilidade de variáveis.",
          "Declaração de variáveis e controle de fluxo.",
          "Funções são blocos nomeados que recebem entrada, fazem um trabalho e devolvem um resultado.",
          "Uma função tem nome, tipo de retorno, parâmetros e corpo. Protótipos avisam o compilador antes do uso. Variáveis locais existem apenas dentro da função; variáveis globais são visíveis em todo o arquivo, mas dificultam o raciocínio. Passagem por valor copia o argumento, então a função não altera a variável original.",
          [
            ["função", "Bloco de código reutilizável com nome, parâmetros e retorno."],
            ["protótipo", "Declaração prévia da assinatura de uma função."],
            ["parâmetro", "Variável declarada na definição da função para receber argumentos."],
            ["escopo", "Região do programa onde um identificador é visível."],
            ["passagem por valor", "Mecanismo que copia o valor do argumento para o parâmetro."]
          ],
          {
            ex: [["int soma(int a, int b) { return a+b; }", "Define uma função que retorna a soma de dois inteiros."], ["void imprimir(void)", "Função sem parâmetros e sem valor de retorno."]],
            er: ["Esperar alterar o argumento original em passagem por valor.", "Usar funções antes de declarar ou definir o protótipo."]
          }),
        L("Arrays e strings",
          "Trabalhar com sequências de valores e texto em C.",
          "Laços e funções.",
          "Arrays agrupam elementos do mesmo tipo em posições consecutivas de memória.",
          "O índice começa em zero e não é verificado automaticamente: acessar fora dos limites causa comportamento indefinido. Strings C são arrays de char terminados pelo caractere nulo '\\0'. Funções como strcpy e gets são perigosas por não conhecerem o tamanho do destino; prefira fgets e snprintf.",
          [
            ["array", "Sequência de elementos do mesmo tipo armazenados consecutivamente."],
            ["índice", "Posição de um elemento no array, começando em zero."],
            ["string C", "Array de caracteres terminado pelo caractere nulo."],
            ["caractere nulo", "Valor '\\0' que marca o fim de uma string em C."],
            ["comportamento indefinido", "Situação em que o padrão C não impõe comportamento, podendo falhar de qualquer forma."]
          ],
          {
            ex: [["int v[5] = {1,2,3,4,5};", "Declara um array de cinco inteiros."], ["char nome[50]; fgets(nome, 50, stdin);", "Lê uma linha com limite de tamanho."]],
            er: ["Usar gets.", "Esquecer espaço para o '\\0' ao dimensionar um array de char."],
            lab: "Escreva uma função que conte caracteres de uma string sem usar strlen."
          })
      ]
    },
    {
      name: "Ponteiros e memória",
      lessons: [
        L("Ponteiros e indireção",
          "Entender endereços de memória e acesso indireto a valores.",
          "Variáveis e tipos.",
          "Um ponteiro guarda o endereço de outro objeto, como um cartão com o endereço de uma casa.",
          "O operador & obtém o endereço de uma variável; o operador * acessa o valor apontado. int *p declara p como ponteiro para int. Ponteiros permitem passar argumentos por referência, percorrer arrays e construir estruturas dinâmicas. Um ponteiro não inicializado aponta para um endereço aleatório e nunca deve ser usado.",
          [
            ["ponteiro", "Variável que armazena o endereço de memória de outro objeto."],
            ["operador &", "Operador unário que retorna o endereço de uma variável."],
            ["operador *", "Operador unário que acessa o valor no endereço apontado."],
            ["indireção", "Acesso a um valor por meio de um ponteiro."],
            ["ponteiro nulo", "Ponteiro que não aponta para nenhum objeto válido."]
          ],
          {
            ex: [["int x = 5; int *p = &x;", "p guarda o endereço de x."], ["*p = 10;", "Altera o valor de x por meio do ponteiro."]],
            er: ["Desreferenciar ponteiro não inicializado.", "Confundir o endereço do ponteiro com o endereço apontado."],
            lab: "No simulador, declare uma variável, seu endereço e altere o valor via ponteiro."
          }),
        L("Alocação dinâmica",
          "Reservar e liberar memória em tempo de execução com segurança.",
          "Ponteiros.",
          "Às vezes não sabemos quantos elementos precisaremos até o programa estar rodando.",
          "malloc reserva um bloco de memória no heap e retorna um ponteiro genérico, ou NULL se falhar. calloc além de alocar zera o bloco; realloc redimensiona. Toda alocação bem-sucedida deve ser liberada com free. Esquecer free causa vazamento; usar memória após free causa uso inválido. Verificar o retorno é obrigatório.",
          [
            ["heap", "Região de memória usada para alocação dinâmica em tempo de execução."],
            ["malloc", "Função que aloca um bloco de memória e retorna seu endereço."],
            ["calloc", "Função que aloca e inicializa todos os bytes com zero."],
            ["realloc", "Função que altera o tamanho de uma alocação existente."],
            ["free", "Função que devolve ao sistema uma memória previamente alocada."]
          ],
          {
            ex: [["int *v = malloc(n * sizeof(int));", "Aloca espaço para n inteiros."], ["if (!v) return 1;", "Verifica se a alocação falhou."]],
            er: ["Não verificar retorno de malloc.", "Chamar free duas vezes no mesmo ponteiro."],
            lab: "Aloque um array de 10 inteiros, preencha, libere e explique cada linha."
          }),
        L("Structs, typedef e enum",
          "Modelar dados compostos e criar tipos com nomes significativos.",
          "Ponteiros e arrays.",
          "Tipos básicos não bastam para representar conceitos do mundo real como um aluno ou um ponto.",
          "struct agrupa campos de tipos diferentes em um único tipo. typedef cria um apelido para um tipo, melhorando a legibilidade. enum define um conjunto de constantes nomeadas, útil para estados e categorias. O acesso aos campos usa o ponto para estruturas e a seta -> para ponteiros para estruturas.",
          [
            ["struct", "Tipo composto que agrupa campos de diferentes tipos."],
            ["typedef", "Palavra-chave que cria um nome alternativo para um tipo."],
            ["enum", "Tipo que define um conjunto de constantes inteiras nomeadas."],
            ["campo", "Componente nomeado de uma estrutura."],
            ["operador ->", "Acesso a um campo por meio de um ponteiro para estrutura."]
          ],
          {
            ex: [["typedef struct { int x; int y; } Ponto;", "Cria o tipo Ponto com duas coordenadas."], ["Ponto p; p.x = 3;", "Acessa um campo da estrutura."]],
            er: ["Esquecer de alocar a estrutura quando se usa ponteiro.", "Confiar no alinhamento dos campos sem entender o tamanho final."]
          }),
        L("Pré-processador e compilação",
          "Entender as etapas de construção de um programa C e usar diretivas com segurança.",
          "Noção de arquivos e funções.",
          "Antes de compilar de fato, o código passa por um pré-processador que faz substituições de texto.",
          "As etapas são pré-processamento, compilação, montagem e ligação. #include insere o conteúdo de cabeçalhos; #define cria macros, que são substituições textuais sem verificação de tipo. Macros com parâmetros precisam de parênteses para evitar erros de precedência. Compilar com -Wall -Wextra -Werror ajuda a encontrar problemas cedo.",
          [
            ["pré-processador", "Etapa que processa diretivas antes da compilação."],
            ["macro", "Substituição de texto definida por #define."],
            ["#include", "Diretiva que insere o conteúdo de outro arquivo."],
            ["ligação", "Etapa final que resolve referências entre arquivos objetos e bibliotecas."],
            ["-Wall", "Opção do compilador que habilita avisos úteis."]
          ],
          {
            ex: [["#define QUAD(x) ((x)*(x))", "Macro com parênteses para preservar precedência."], ["gcc -Wall -Wextra -o app app.c", "Compila com avisos ampliados."]],
            er: ["Usar macros com efeitos colaterais nos argumentos.", "Ignorar avisos do compilador sistematicamente."],
            lab: "Compile um programa com -Wall e corrija todos os avisos."
          })
      ]
    },
    {
      name: "E/S, estruturas e algoritmos",
      lessons: [
        L("Arquivos e streams",
          "Ler e gravar arquivos de texto e binário usando a biblioteca padrão.",
          "Ponteiros e alocação dinâmica.",
          "Um arquivo é vista como um fluxo de bytes, o que unifica leitura de teclado, arquivo e rede.",
          "FILE* representa um fluxo aberto. fopen recebe o caminho e o modo: r leitura, w escrita, a acréscimo. fgets lê linhas com limite; fscanf lê campos formatados; fprintf escreve formatado. Todo fopen exige fclose. Modos binários evitam traduções de fim de linha no Windows. Erros de E/S devem ser verificados.",
          [
            ["stream", "Fluxo abstrato de dados de entrada ou saída."],
            ["FILE*", "Ponteiro opaco que representa um arquivo aberto."],
            ["modo de abertura", "Sequência como r, w ou a que define operações permitidas."],
            ["fgets", "Função que lê uma linha com limite de caracteres."],
            ["fclose", "Função que fecha um fluxo e libera recursos."]
          ],
          {
            ex: [["FILE *f = fopen(\"dados.txt\", \"r\");", "Abre um arquivo para leitura."], ["while (fgets(linha, 100, f))", "Lê o arquivo linha a linha até o fim."]],
            er: ["Não verificar se fopen retornou NULL.", "Esquecer fclose e esgotar descritores de arquivo."]
          }),
        L("Listas encadeadas",
          "Implementar estruturas dinâmicas com nós ligados por ponteiros.",
          "Structs, ponteiros e alocação dinâmica.",
          "Diferente de arrays, uma lista encadeada cresce conforme necessário, cada elemento apontando para o próximo.",
          "Cada nó contém dado e ponteiro para o próximo. A lista é representada por um ponteiro para o primeiro nó. Inserir no início é constante; buscar é linear. A vantagem está em inserções e remoções sem realocação de bloco contíguo. Atenção especial ao atualizar a cabeça e ao liberar todos os nós.",
          [
            ["nó", "Elemento de uma lista que contém dado e ponteiro para o próximo."],
            ["cabeça da lista", "Ponteiro para o primeiro nó da estrutura."],
            ["inserção", "Operação que adiciona um novo nó à lista."],
            ["percurso", "Visita sequencial a todos os nós da lista."],
            ["lista duplamente encadeada", "Lista cujos nós apontam para o anterior e o próximo."]
          ],
          {
            ex: [["novo->prox = *cabeca; *cabeca = novo;", "Insere um nó no início da lista."], ["while (atual) { atual = atual->prox; }", "Percorre todos os nós."]],
            er: ["Perder a referência da cabeça da lista.", "Liberar um nó antes de guardar o ponteiro para o próximo."]
          }),
        L("Árvores e grafos",
          "Compreender estruturas hierárquicas e de relacionamentos.",
          "Listas encadeadas e recursividade.",
          "Árvores organizam dados em níveis; grafos generalizam isso permitindo conexões arbitrárias.",
          "Uma árvore binária tem cada nó com até dois filhos. Árvores binárias de busca mantêm a ordem: valores menores à esquerda, maiores à direita, permitindo busca eficiente. Grafos têm vértices e arestas, podendo ser dirigidos ou não. Perfis comuns de travessia são profundidade e largura. Recursividade simplifica muito a implementação dessas estruturas.",
          [
            ["árvore", "Estrutura hierárquica com raiz, nós internos e folhas."],
            ["árvore binária de busca", "Árvore em que cada nó tem até dois filhos e mantém ordem de valores."],
            ["grafo", "Conjunto de vértices ligados por arestas."],
            ["aresta", "Conexão entre dois vértices de um grafo."],
            ["travessia", "Visita sistemática a todos os nós ou vértices."]
          ],
          {
            ex: [["busca em profundidade", "Explora um caminho até o fim antes de voltar."], ["busca em largura", "Explora todos os vizinhos antes de avançar de nível."]],
            er: ["Esquecer caso base em funções recursivas sobre árvores.", "Assumir que uma árvore está balanceada."]
          }),
        L("Ordenação, busca e complexidade",
          "Escolher algoritmos adequados e avaliar seu custo.",
          "Arrays, laços e funções.",
          "Existem várias formas de ordenar; a escolha depende do tamanho dos dados e dos recursos disponíveis.",
          "Bubble sort é simples e quadrático; insertion sort vai bem em arrays pequenos; quicksort e mergesort são da ordem de n log n. Busca linear testa cada elemento; busca binária exige dados ordenados e é logarítmica. A notação Big-O descreve o crescimento do tempo ou memória com o tamanho da entrada, ignorando constantes.",
          [
            ["notação Big-O", "Forma de descrever o crescimento assintótico de um algoritmo."],
            ["busca binária", "Busca que divide repetidamente o intervalo ordenado ao meio."],
            ["quicksort", "Algoritmo de ordenação baseado em particionamento recursivo."],
            ["complexidade de tempo", "Estimativa de quantas operações um algoritmo executa conforme a entrada cresce."],
            ["estabilidade", "Propriedade de manter a ordem relativa de elementos iguais."]
          ],
          {
            ex: [["O(n log n)", "Crescimento típico de algoritmos eficientes de ordenação."], ["busca linear", "Percorre elementos um a um até encontrar o alvo."]],
            er: ["Usar busca binária em array não ordenado.", "Confundir pior caso com caso médio."],
            lab: "Implemente busca linear e binária e compare o número de comparações."
          })
      ]
    }
  ]
};

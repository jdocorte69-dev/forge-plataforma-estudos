/* ============================================================
   FORGE — data-algorithms.js
   Algoritmos e estruturas de dados (módulo complementar da trilha C)
   ============================================================ */

CURRICULUM.c.modules.push({
  name: "Algoritmos e estruturas de dados",
  lessons: [
    L("O que é algoritmo e pseudocódigo",
      "Definir algoritmo com precisão e traduzir uma ideia em pseudocódigo legível.",
      "Nenhum. Lógica de decisão e repetição ajuda.",
      "Um algoritmo é como uma receita: passos finitos, inequívocos, que transformam uma entrada em saída.",
      "Um algoritmo é uma sequência finita de passos bem definidos que recebe entradas, executa operações e produz uma saída. As propriedades clássicas são finitude (termina), definitude (cada passo é descrito sem ambiguidade), entrada, saída e eficácia (cada passo é executável). Um procedimento que nunca para não é algoritmo, mesmo que seja um programa válido em algumas linguagens.\n\nPseudocódigo é uma linguagem de projeto, não de execução. Usamos construções como `se`, `senão`, `para`, `enquanto` e `retorne` para comunicar a ideia sem prender a sintaxe de C, Python ou Java. Um exemplo para encontrar o maior valor é: `melhor = v[0]; para i de 1 até n-1 faça se v[i] > melhor então melhor = v[i]; retorne melhor`. O leitor consegue verificar a ideia antes de lidar com índices e tipos.\n\nCorreção e eficiência são perguntas distintas. Primeiro estabelecemos o que o algoritmo deve fazer e por que termina; depois medimos quantas operações ele realiza. Escrever pseudocódigo primeiro reduz o custo de revisar a lógica, porque mudar uma linha de texto é mais barato que depurar código compilado.",
      [
        ["algoritmo", "Sequência finita de passos bem definidos que transforma entrada em saída."],
        ["pseudocódigo", "Notação legível para descrever um algoritmo sem sintaxe de linguagem concreta."],
        ["finitude", "Propriedade de um algoritmo que garante terminação após número finito de passos."],
        ["definitude", "Propriedade de cada passo ser descrito de forma precisa e sem ambiguidade."],
        ["eficácia", "Propriedade de cada passo ser executável na prática com recursos disponíveis."]
      ],
      {
        ex: [["Maior valor com pseudocódigo", "Para `[3, 1, 7, 2]`, percorremos quatro elementos e retornamos `7` após três comparações."], ["Contar pares", "`para cada x em v faça se x % 2 == 0 então cont++; retorne cont`. Para `[2, 3, 4]` o resultado é `2`."]],
        er: ["Escrever passos vagos como 'trate o valor adequadamente', que quebram a definitude.", "Criar um laço sem condição de parada e chamar isso de algoritmo.", "Achar que pseudocódigo precisa compilar em alguma linguagem específica."],
        lab: "Escreva em pseudocódigo um algoritmo que conte pares em uma lista e teste com `[2, 3, 4]`.",
        ref: "CLRS — Introduction to Algorithms, cap. 1 (MIT Press, https://mitpress.mit.edu/)."
      }),

    L("Análise de complexidade: notação O",
      "Estimar o crescimento do custo de um algoritmo com o tamanho da entrada.",
      "Noção de laços e funções; leitura de pseudocódigo.",
      "Não importa quanto tempo exatamente leva; importa como o tempo cresce quando a entrada dobra.",
      "A análise assintótica descreve o comportamento quando o tamanho da entrada $n$ cresce. A notação $O(g(n))$ é um limite superior assintótico: dizemos que $f(n)$ é $O(g(n))$ quando existem constantes positivas $c$ e $n_0$ com $f(n) \\leq c \\cdot g(n)$ para todo $n \\geq n_0$. Na prática, contamos operações elementares — comparações, atribuições, acessos — em vez de segundos, pois o hardware muda.\n\nPara obter a classe, ignore constantes multiplicativas e termos de menor ordem: $3n^2 + 10n + 5$ é $O(n^2)$. Busca linear em vetor não ordenado é $O(n)$; dois laços aninhados sobre $n$ elementos são $O(n^2)$; acessar `v[10]` é $O(1)$. A notação fala de crescimento, não de velocidade absoluta: um algoritmo $O(n)$ pode ser mais lento que um $O(n^2)$ para $n$ pequeno.\n\nO limite superior não é o único ponto de vista. Também usamos $Ω$ para limite inferior e $Θ$ quando os dois coincidem. Ao analisar, defina o que é $n$, escolha o caso que interessa e conte as operações dominantes. A análise guia decisões reais: trocar busca linear por busca binária muda o custo de $O(n)$ para $O(log n)$, mas exige dados ordenados.",
      [
        ["análise assintótica", "Estudo do crescimento do custo de um algoritmo quando o tamanho da entrada tende ao infinito."],
        ["notação O", "Limite superior assintótico do custo, desconsiderando constantes e termos menores."],
        ["operação elementar", "Operação básica, como comparação ou atribuição, contada na análise de custo."],
        ["tamanho da entrada", "Variável n que mede a quantidade de dados processados pelo algoritmo."],
        ["termo dominante", "Parcela da expressão de custo que determina a classe assintótica."]
      ],
      {
        ex: [["Busca linear", "Procurar `9` em `[1, 3, 5, 7, 9]` leva cinco comparações no pior caso; para $n$ elementos, $O(n)$."], ["Laços aninhados", "Imprimir todas as duplas de $n = 1000$ itens gera cerca de $1000^2 = 1{,}000{,}000$ iterações, classe $O(n^2)$."]],
        er: ["Interpretar $O(n)$ como 'leva n segundos'.", "Contar linhas de código em vez de operações executadas.", "Manter constantes na classe, dizendo que `2n` é $O(2n)$ em vez de $O(n)$."],
        lab: "Conte comparações da busca linear para $n = 8, 16, 32$ e verifique o crescimento em relação a $n$.",
        ref: "CLRS — Introduction to Algorithms, cap. 3 (Growth of Functions, MIT Press, https://mitpress.mit.edu/)."
      }),

    L("Complexidade amortizada e casos médio e pior",
      "Diferenciar amortizado, caso médio e pior caso, e aplicar o método agregado.",
      "Notação O e vetores.",
      "Uma operação cara pode ser rara: o custo total de uma sequência é o que importa.",
      "O pior caso é o maior custo de uma única operação, qualquer que seja a entrada. O caso médio é o custo esperado sob alguma distribuição de entradas; muda a distribuição e o número muda. A análise amortizada calcula o custo médio por operação em uma sequência, sem probabilisticidade: mesmo que uma operação seja cara, ela não pode acontecer com frequência.\n\nO exemplo clássico é o vetor dinâmico: quando a capacidade acaba, alocamos o dobro e copiamos todos os elementos. A inserção que redimensiona custa $O(n)$, mas entre duas duplicações ocorrem muitas inserções baratas. Pelo método agregado, $n$ inserções custam no máximo cerca de $3n$ operações, logo o custo amortizado é $O(1)$, embora o pior caso isolado seja $O(n)$.\n\nConfundir as três noções gera conclusões erradas. 'Hash tem acesso $O(1)$' é afirmação sobre caso médio com boa distribuição; o pior caso é $O(n)$. Já 'inserir no vetor dinâmico é $O(1)$ amortizado' vale para qualquer sequência de entradas. Em sistemas, o pior caso importa quando há limite de latência; o amortizado importa quando o custo total de longo prazo domina.",
      [
        ["análise amortizada", "Custo médio por operação em uma sequência, calculado sem assumir distribuição probabilística."],
        ["caso médio", "Custo esperado das entradas sob uma distribuição assumida."],
        ["pior caso", "Maior custo possível de uma operação sobre todas as entradas de dado tamanho."],
        ["vetor dinâmico", "Array que redimensiona sua capacidade, normalmente dobrando-a, quando fica cheio."],
        ["método agregado", "Técnica que divide o custo total de $n$ operações por $n$ para obter o custo amortizado."]
      ],
      {
        ex: [["Vetor dinâmico", "Partindo da capacidade `1`, oito inserções custam `8` escritas mais `1 + 2 + 4 = 7` cópias, total `15 < 2 · 8`; amortizado $O(1)$."], ["Tabela hash", "Com distribuição uniforme a busca é $O(1)$ em média; com todas as chaves na mesma lista, o pior caso é $O(n)$."]],
        er: ["Achar que caso médio e amortizado são sinônimos.", "Dizer que análise amortizada depende de sorte ou probabilidade.", "Usar o caso médio para garantir um limite de latência rígido."],
        lab: "Simulação: registre as cópias ao dobrar a capacidade de um vetor de 1 a 16 inserções e some os custos.",
        ref: "CLRS — Introduction to Algorithms, cap. 17 (Amortized Analysis, MIT Press, https://mitpress.mit.edu/)."
      }),

    L("Arrays e listas encadeadas",
      "Comparar representações contíguas e encadeadas quanto a acesso, inserção e memória.",
      "Ponteiros e alocação dinâmica em C.",
      "Array é um bloco contínuo com endereço calculado; lista encadeada são nós espalhados ligados por ponteiros.",
      "Em um array, os elementos ocupam posições consecutivas e o endereço do índice $i$ é calculado como `base + i * tamanho`. Isso dá acesso aleatório em $O(1)$. Inserir ou remover no meio exige deslocar elementos, custando $O(n)$. O tamanho é fixo quando se usa alocação estática; com alocação dinâmica, o redimensionamento copia tudo.\n\nNa lista encadeada, cada nó guarda valor e ponteiro para o próximo (ou para o anterior, na lista duplamente encadeada). Acessar o índice $i$ exige percorrer $i$ nós, logo $O(n)$. Inserir depois de ter o ponteiro do nó anterior é $O(1)$, mas encontrar essa posição também é $O(n)$. Há overhead de ponteiros por nó e alocação separada.\n\nA escolha depende do padrão de uso. Arrays favorecem leitura sequencial e por índice, aproveitando cache e localidade de referência. Listas favorecem inserções frequentes no início ou quando o tamanho muda muito. Em sistemas reais, vetores costumam ganhar por cache mesmo com inserções mais caras; meça antes de decidir.",
      [
        ["array", "Sequência contígua de elementos do mesmo tipo acessível por índice calculado."],
        ["lista encadeada", "Estrutura de nós com valores e ponteiros que ligam um nó ao seguinte."],
        ["acesso aleatório", "Capacidade de acessar qualquer posição em tempo constante."],
        ["nó", "Unidade de uma lista encadeada que contém valor e referência para outro nó."],
        ["localidade de referência", "Tendência de dados próximos na memória serem acessados juntos, favorecendo cache."]
      ],
      {
        ex: [["Acessar a posição 500", "Em array, um cálculo de endereço; em lista, quinhentos ponteiros percorridos a partir da cabeça."], ["Inserir no início", "Array desloca $n$ elementos; lista com ponteiro para a cabeça ajusta o novo `next` e a cabeça em duas atribuições."]],
        er: ["Afirmar que lista encadeada acessa índice em $O(1)$ por saber onde está o primeiro nó.", "Esquecer que inserir no meio da lista exige percorrer até a posição.", "Considerar arrays sempre superiores e ignorar o custo de redimensionamento."],
        lab: "Implemente inserção no início nas duas estruturas e compare o tempo em mil operações.",
        ref: "CLRS — Introduction to Algorithms, cap. 10 (Elementary Data Structures, MIT Press, https://mitpress.mit.edu/)."
      }),

    L("Pilhas e filas",
      "Usar corretamente estruturas LIFO e FIFO e reconhecer suas aplicações.",
      "Arrays, listas encadeadas e funções.",
      "Pilha é como uma pilha de pratos; fila é como uma fila de atendimento.",
      "A pilha oferece `push` (colocar no topo) e `pop` (retirar do topo). Seu comportamento é LIFO: o último elemento entrado é o primeiro a sair. Serve para desfazer operações, avaliar expressões pós-fixas, percorrer grafos em profundidade e controlar chamadas recursivas. Com vetor e ponteiro para o topo, ambas as operações são $O(1)$.\n\nA fila oferece `enqueue` (entrar no fim) e `dequeue` (sair do início). Seu comportamento é FIFO: o primeiro a entrar é o primeiro a sair. É usada em buffers, impressão, processamento de tarefas e BFS. Implementada com vetor simples, `dequeue` desloca elementos e custa $O(n)$; um buffer circular com índices de início e fim mantém as duas operações em $O(1)$.\n\nAs duas estruturas podem ser implementadas com array ou lista encadeada. O critério não é desempenho bruto, e sim a ordem exigida pelo problema. Se a ordem de chegada deve ser preservada, use fila; se o trabalho mais recente deve ser tratado primeiro, use pilha. Em uma fila de prioridade, a ordem muda: o maior (ou menor) valor sai primeiro, o que pede um heap.",
      [
        ["pilha", "Estrutura em que inserções e remoções ocorrem no topo."],
        ["fila", "Estrutura em que inserções ocorrem no fim e remoções no início."],
        ["LIFO", "Política último a entrar, primeiro a sair."],
        ["FIFO", "Política primeiro a entrar, primeiro a sair."],
        ["buffer circular", "Vetor com índices que voltam ao início para implementar fila sem deslocamentos."]
      ],
      {
        ex: [["Expressão pós-fixa", "Para `3 4 2 * +`: empilhe `3, 4, 2`; `*` gera `8`; `+` gera `11`, resultado final."], ["Fila de impressão", "Documentos `A, B, C` entram nessa ordem e saem como `A, B, C`; nunca `C` primeiro."]],
        er: ["Usar pilha quando o requisito é atender na ordem de chegada.", "Implementar fila deslocando todo o vetor a cada remoção.", "Confundir topo da pilha com fundo da fila ao escrever os índices."],
        lab: "Simulação: processe `push 1`, `push 2`, `pop`, `push 3`, `pop` e registre a sequência de saída.",
        ref: "CLRS — Introduction to Algorithms, cap. 10 (Elementary Data Structures, MIT Press, https://mitpress.mit.edu/)."
      }),

    L("Tabelas hash",
      "Entender funções de hash, colisões e o custo das operações em tabelas hash.",
      "Arrays, listas encadeadas e aritmética modular.",
      "Uma tabela hash transforma uma chave em índice, como guardar livros pelo número da estante calculado a partir do título.",
      "Uma função de hash $h(k)$ mapeia a chave $k$ para uma posição da tabela de tamanho $m$. Se o espaço de chaves for maior que $m$, colisões são inevitáveis pelo princípio da casa dos pombos. Duas estratégias comuns são encadeamento, em que cada posição guarda uma lista de elementos, e endereçamento aberto, em que a colisão é resolvida por sondagem linear, quadrática ou dupla hash.\n\nO fator de carga $α = n/m$ mede a ocupação: $n$ é o número de elementos e $m$, o de posições. Com encadeamento e hash uniforme, busca, inserção e remoção custam $O(1 + α)$ em média; se mantemos $α$ constante redimensionando a tabela, o custo esperado é $O(1)$. No pior caso, todas as chaves colidem e a busca cai para $O(n)$. Redimensionar exige reaplicar a função de hash a todas as chaves.\n\nA qualidade da função de hash é decisiva. Usar $h(k) = k \\bmod m$ com $m$ uma potência de dois preserva apenas os bits baixos e pode concentrar chaves com padrão. Em contextos adversariais, funções com semente aleatória ou criptográficas reduzem o risco de colisões deliberadas. Tabelas hash são ótimas para busca exata por chave, mas não preservam ordem nem respondem bem a consultas por faixa.",
      [
        ["função de hash", "Função que converte uma chave em índice da tabela."],
        ["colisão", "Situação em que chaves distintas recebem o mesmo índice."],
        ["encadeamento", "Resolução de colisões mantendo uma lista de elementos em cada posição."],
        ["endereçamento aberto", "Resolução de colisões procurando outra posição livre na própria tabela."],
        ["fator de carga", "Razão $α = n/m$ entre número de elementos e tamanho da tabela."]
      ],
      {
        ex: [["Tabela com $m = 5$", "Com $h(k) = k \\bmod 5$, as chaves `7`, `12` e `3` dão índices `2`, `2`, `3`: `7` e `12` colidem e são encadeadas."], ["Fator de carga", "Com $n = 40$ e $m = 50$, $α = 0{,}8$; vale redimensionar antes que a lista crescente degrade as buscas."]],
        er: ["Escolher $m$ como potência de dois sem analisar o padrão das chaves.", "Afirmar que busca em tabela hash é sempre $O(1)$, sem citar premissas.", "Esquecer de reaplicar a função de hash ao redimensionar a tabela."],
        lab: "Simulação: com $m = 7$ e $h(k) = k \\bmod 7$, insira `10`, `17` e `24` e desenhe as colisões.",
        ref: "CLRS — Introduction to Algorithms, cap. 11 (Hash Tables, MIT Press, https://mitpress.mit.edu/)."
      }),

    L("Árvores binárias de busca",
      "Construir, percorrer e analisar uma árvore binária de busca.",
      "Recursividade e ponteiros.",
      "Cada nó decide para onde ir: menor à esquerda, maior à direita, como uma busca por capítulos de um dicionário.",
      "Uma árvore binária de busca (BST) satisfaz a propriedade: para cada nó, todas as chaves da subárvore esquerda são menores e todas as da direita são maiores. A busca compara a chave desejada com o nó atual e descai um nível por passo, custando $O(h)$, em que $h$ é a altura. A inserção segue o mesmo caminho e cria uma folha; a remoção tem três casos: nó folha, nó com um filho e nó com dois filhos, este último resolvido pelo sucessor in-order.\n\nA altura depende da ordem de inserção. Com chaves aleatórias, a altura esperada é da ordem de $log n$; com chaves já ordenadas, a árvore vira uma lista inclinada de altura $n$ e a busca cai para $O(n)$. O percurso em ordem (esquerda, nó, direita) produz as chaves em sequência crescente, propriedade explorada para ordenar e para encontrar sucessores.\n\nComparada a uma tabela hash, a BST mantém ordem e permite consultas por faixa e por predecessor/sucessor. Em compensação, seu desempenho depende do balanceamento. A implementação deve definir como trata chaves repetidas: ignorar, contar ocorrências ou escolher um lado consistente. Sem essa regra, a propriedade da árvore pode ser violada.",
      [
        ["árvore binária de busca", "Árvore em que cada nó tem no máximo dois filhos e ordena chaves menores à esquerda e maiores à direita."],
        ["altura", "Número de arestas no maior caminho da raiz até uma folha."],
        ["percurso em ordem", "Visita esquerda, nó e direita, produzindo as chaves em ordem crescente."],
        ["sucessor", "Menor chave estritamente maior que a chave dada."],
        ["raiz", "Nó superior da árvore, sem pai."]
      ],
      {
        ex: [["Inserir `5, 3, 7, 4`", "`3` à esquerda de `5`, `7` à direita, `4` à direita de `3`; percurso em ordem dá `3, 4, 5, 7`."], ["Buscar `6`", "Caminho `5 → 7 →` esquerda vazia: não encontrado após três comparações."]],
        er: ["Inserir chave repetida sem regra definida e quebrar a propriedade da árvore.", "Assumir $O(log n)$ mesmo quando as chaves chegam ordenadas.", "Esquecer que o percurso em ordem produz sequência crescente."],
        lab: "Construa no papel uma BST com `8, 3, 10, 1, 6, 14` e escreva o percurso em ordem.",
        ref: "CLRS — Introduction to Algorithms, cap. 12 (Binary Search Trees, MIT Press, https://mitpress.mit.edu/)."
      }),

    L("Árvores balanceadas: visão geral",
      "Conhecer os mecanismos que mantêm árvores de busca com altura logarítmica.",
      "Árvores binárias de busca e rotações.",
      "Balancear é evitar que a árvore vire fila: alguns ponteiros são girados para distribuir os nós.",
      "Árvores balanceadas impõem uma restrição extra à BST para garantir altura $O(log n)$. A rotação é a operação local que muda ponteiros sem alterar a ordem das chaves: numa rotação à esquerda, o filho direito sobe e a antiga raiz desce para a esquerda. A rotação é $O(1)$ e preserva a propriedade de busca.\n\nA árvore AVL exige que as alturas das subárvores de cada nó difiram no máximo por um; após inserção ou remoção, rotações simples ou duplas restauram a condição. Sua altura é limitada por cerca de $1{,}44 log n$, favorecendo buscas. A árvore rubro-negra usa cores e regras locais, com altura no máximo $2 log(n + 1)$; atualizações exigem menos rotações, por isso é comum em estruturas de mapas de bibliotecas padrão.\n\nPara dados em disco, a árvore B agrupa muitas chaves por nó e reduz o número de acessos a páginas; é a base de índices de bancos. A árvore splay movimenta o nó acessado para a raiz e tem garantia amortizada. Não há uma melhor opção absoluta: Avaliamos frequência de leitura, escrita, tamanho da chave e onde os dados residem.",
      [
        ["árvore balanceada", "Árvore de busca que impõe regras para manter a altura logarítmica."],
        ["rotação", "Operação local que gira ponteiros preservando a ordem das chaves."],
        ["árvore AVL", "BST que limita a diferença de altura entre subárvores a no máximo um."],
        ["árvore rubro-negra", "BST com nós coloridos e regras locais que limitam a altura."],
        ["árvore B", "Árvore com várias chaves por nó, projetada para reduzir acessos a disco."]
      ],
      {
        ex: [["Rotação em AVL", "Raiz `10`, filho direito `20`, novo nó `30`: fator `-2`; rotação à esquerda em `10` torna `20` a nova raiz."], ["Altura rubro-negra", "Para $n = 1000$, a altura é no máximo $2 \\cdot log_2(1001) \\approx 20$, contra até $1000$ numa BST degenerada."]],
        er: ["Reconstruir a árvore inteira a cada inserção em vez de usar rotações locais.", "Achar que AVL e rubro-negra têm exatamente o mesmo custo de atualização.", "Usar árvore B para pequenos conjuntos em memória e ignorar a simplicidade da BST."],
        lab: "Simulação: insira `10, 20, 30` em uma AVL no papel e aplique a rotação necessária.",
        ref: "CLRS — Introduction to Algorithms, cap. 13 (Balanced Search Trees, MIT Press, https://mitpress.mit.edu/)."
      }),

    L("Heap e fila de prioridade",
      "Representar heaps binários e implementar uma fila de prioridade eficiente.",
      "Arrays e árvores binárias.",
      "Um heap é uma árvore quase completa que garante apenas que o pai respeita a ordem em relação aos filhos.",
      "O heap binário é uma árvore quase completa representada em vetor: para o índice $i$, o pai está em `⌊(i-1)/2⌋` e os filhos em `2i+1` e `2i+2`. Num min-heap, cada pai é menor ou igual aos filhos; num max-heap, maior. A propriedade não ordena o vetor inteiro — apenas impõe a relação ao longo dos caminhos.\n\nA construção por heapify custa $O(n)$; inserir e extrair a raiz custam $O(log n)$ por subir ou afundar um elemento, e consultar o topo é $O(1)$. A fila de prioridade usa essas operações para atender sempre o item de maior prioridade, independentemente da ordem de chegada. É a estrutura por trás de escalonadores, do algoritmo de Dijkstra e da ordenação heapsort.\n\nUma confusão comum é esperar varredura ordenada do heap: isso não existe sem extrair todos os elementos, o que custa $O(n log n)$. Outra é usar busca linear para encontrar o mínimo, desperdiçando a estrutura. Ao extrair, é preciso trocar a raiz pelo último elemento, reduzir o tamanho lógico e afundar o novo valor; esquecer o tamanho lógico faz o elemento removido reaparecer.",
      [
        ["heap binário", "Árvore quase completa representada em vetor com ordem entre pais e filhos."],
        ["propriedade de heap", "Regra pela qual o pai é menor ou igual aos filhos no min-heap, ou maior no max-heap."],
        ["heapify", "Procedimento que reorganiza um vetor para satisfazer a propriedade de heap."],
        ["fila de prioridade", "Estrutura que remove sempre o elemento de maior prioridade, não o mais antigo."],
        ["índice do pai", "Posição `⌊(i-1)/2⌋` correspondente ao pai do elemento no índice i."]
      ],
      {
        ex: [["Construir min-heap", "De `[4, 10, 3, 5, 1]`, heapify troca `10↔1` e depois `4↔1`, resultando em `[1, 4, 3, 5, 10]`."], ["Extrair mínimo", "De `[1, 4, 3, 5, 10]`, troque `1` com `10`, reduza o tamanho e afunde `10`: resulta `[3, 4, 10, 5]`."]],
        er: ["Esperar que o vetor do heap esteja ordenado crescentemente.", "Procurar o mínimo com busca linear a cada extração.", "Esquecer de atualizar o tamanho lógico após remover a raiz."],
        lab: "Construa um min-heap com `[5, 2, 8, 1]` no papel e extraia o mínimo passo a passo.",
        ref: "CLRS — Introduction to Algorithms, cap. 6 (Heaps and Heapsort, MIT Press, https://mitpress.mit.edu/)."
      }),

    L("Ordenação: comparação e estabilidade",
      "Escolher algoritmos de ordenação considerando custo, estabilidade e memória.",
      "Análise de complexidade e vetores.",
      "Ordenar é separar o que o algoritmo compara do que ele promete preservar: a ordem original de iguais.",
      "Algoritmos de ordenação por comparação só acessam os elementos por comparações entre chaves. O modelo de árvore de decisão mostra que qualquer algoritmo desse tipo precisa de $Ω(n log n)$ comparações no pior caso. Mergesort atinge $O(n log n)$ com $O(n)$ memória extra e é estável; heapsort atinge $O(n log n)$ com memória constante e não é estável; quicksort é $O(n log n)$ em média, $O(n^2)$ no pior caso se o pivô for ruim, e costuma ser rápido na prática. Counting e radix sort fogem do modelo e podem ser $O(n + k)$ quando as chaves têm faixa limitada.\n\nEstabilidade significa que registros com a mesma chave mantêm a ordem relativa que tinham na entrada. Ordenar uma lista de alunos por turma e depois por nome só funciona como esperado se a segunda ordenação for estável. Insertion sort e mergesort são estáveis; selection sort, heapsort e quicksort clássico não são. A estabilidade é propriedade da implementação, não apenas do nome do algoritmo.\n\nA escolha combina restrições. Se há memória escassa, evite mergesort; se chaves repetidas carregam significado, exija estabilidade; se o pior caso precisa ser garantido, prefira mergesort ou introsort. Ordenações híbridas usadas em bibliotecas combinam insertion sort para fatias pequenas e quicksort com heapsort como fallback contra o pior caso.",
      [
        ["ordenação por comparação", "Ordenação que só determina a ordem comparando chaves dos elementos."],
        ["limite inferior", "Mínimo de comparações necessárias, $Ω(n log n)$, para ordenação por comparação."],
        ["estabilidade", "Propriedade de preservar a ordem relativa de elementos com chaves iguais."],
        ["quicksort", "Ordenação por particionamento em torno de um pivô, rápida em média e instável."],
        ["mergesort", "Ordenação por divisão, mesclagem e combinação, estável e com custo $O(n log n)$."]
      ],
      {
        ex: [["Estabilidade", "Registros `(A,2), (B,1), (C,2)` ordenados pela idade ficam `B, A, C` se estável; `A` permanece antes de `C`."], ["Escolha de algoritmo", "Um milhão de registros com chaves repetidas e ordem significativa pede mergesort; se a memória é crítica, um quicksort com garantia de pior caso."]],
        er: ["Aplicar o limite $Ω(n log n)$ a counting sort, que não compara chaves.", "Achar que quicksort é sempre $O(n log n)$, inclusive no pior caso.", "Ignorar estabilidade quando a ordem anterior carrega informação."],
        lab: "Ordene `[(A,2), (B,1), (C,2)]` em papel com insertion e selection e compare a posição de `A` e `C`.",
        ref: "CLRS — Introduction to Algorithms, caps. 7 e 8 (Quicksort e Sorting in Linear Time, MIT Press, https://mitpress.mit.edu/)."
      }),

    L("Busca binária e variantes",
      "Implementar busca binária correta e adaptá-la a limites inferiores, superiores e arranjos rotacionados.",
      "Vetores ordenados e análise de complexidade.",
      "Em vez de percorrer a lista, descarte metade a cada comparação, desde que ela esteja ordenada.",
      "A busca binária mantém um intervalo `[esq, dir]` que pode conter o valor alvo. A cada passo, calcula o meio e compara: se o valor do meio é menor, descarta a metade esquerda; se maior, descarta a direita. O custo é $O(log n)$, pois o intervalo é dividido por dois a cada iteração. Pré-requisito absoluto: o vetor deve estar ordenado segundo o mesmo critério da comparação.\n\nO meio pode ser calculado como `esq + (dir - esq) / 2` para evitar estouro em linguagens com inteiros limitados. Variantes respondem perguntas diferentes: `lower_bound` devolve a primeira posição com valor $≥ x$; `upper_bound`, a primeira com valor $> x$; combinadas, dão o intervalo de ocorrências de $x$. Em arranjo rotacionado, decidir qual metade está ordenada permite manter $O(log n)$.\n\nA principal fonte de erro é o intervalo: usar `dir = meio` em vez de `dir = meio - 1` pode looping infinito, enquanto usar `meio + 1` pode pular a resposta. Manter um invariante explícito — a resposta, se existir, sempre está dentro do intervalo atual — torna a prova e a depuração muito mais simples. A versão iterativa evita pilha de recursão e é preferível em código de produção.",
      [
        ["busca binária", "Algoritmo que localiza uma chave em vetor ordenado dividindo o intervalo ao meio."],
        ["invariante", "Propriedade que permanece verdadeira a cada iteração e garante a correção do laço."],
        ["limite inferior", "Primeira posição cujo valor é maior ou igual ao alvo."],
        ["limite superior", "Primeira posição cujo valor é estritamente maior que o alvo."],
        ["arranjo rotacionado", "Vetor ordenado que foi girado, com a menor parte movida para o fim."]
      ],
      {
        ex: [["Buscar `9`", "Em `[1, 3, 5, 7, 9, 11]`, meio `5` descarta a esquerda; novo meio é `9` no índice `4`: duas comparações."], ["Limites", "Em `[1, 2, 2, 2, 4]`, `lower_bound(2) = 1` e `upper_bound(2) = 4`; as ocorrências ocupam `[1, 4)`."]],
        er: ["Aplicar busca binária em vetor não ordenado e aceitar respostas aleatórias.", "Calcular o meio com `(esq + dir) / 2` em linguagem com risco de estouro.", "Atualizar os limites de forma a nunca fechar o intervalo, causando laço infinito."],
        lab: "Implemente busca binária iterativa em `[2, 4, 4, 6]` para as chaves `4` e `5`.",
        ref: "CLRS — Introduction to Algorithms, §2.3 e cap. 12 (MIT Press, https://mitpress.mit.edu/)."
      }),

    L("Grafos: BFS e DFS",
      "Percorrer grafos com BFS e DFS e reconhecer para que cada percurso serve.",
      "Filas, pilhas e recursividade.",
      "BFS espalha ondas a partir da origem; DFS segue um caminho até o fim antes de voltar.",
      "Um grafo é um conjunto de vértices e arestas, direcionadas ou não. A representação mais comum é a lista de adjacência, eficiente em grafos esparsos: o espaço é $O(V + E)$. A matriz de adjacência ocupa $O(V^2)$ e favorece consultas rápidas entre um par de vértices, mas é cara quando $E \\ll V^2$.\n\nA BFS usa uma fila: começa na origem, marca cada visitado e explora por camadas. Em grafo não ponderado, o primeiro caminho encontrado até um vértice tem o menor número de arestas, e as distâncias são calculadas em $O(V + E)$. A DFS usa pilha ou recursão: aprofunda cada caminho até não poder mais e registra tempos de descoberta e término. Serve para detectar ciclos, ordenar topologicamente e encontrar componentes conexas, também em $O(V + E)$.\n\nMarcar vértices visitados é indispensável nas duas buscas: sem isso, ciclos causam repetição infinita. A ordem da lista de adjacência muda a sequência de visita da DFS, mas não os resultados estruturais, como componentes. Em grafos ponderados, BFS não encontra o caminho de menor custo: para isso são necessários Dijkstra ou Bellman-Ford.",
      [
        ["grafo", "Estrutura formada por vértices conectados por arestas, que podem ser direcionadas."],
        ["lista de adjacência", "Representação que lista, para cada vértice, seus vizinhos."],
        ["BFS", "Busca em largura que explora por camadas usando uma fila."],
        ["DFS", "Busca em profundidade que aprofunda cada caminho usando pilha ou recursão."],
        ["tempo de descoberta", "Instante em que um vértice é visitado pela primeira vez na DFS."]
      ],
      {
        ex: [["BFS com distâncias", "Grafo `A→B`, `A→C`, `B→D`: ordem `A, B, C, D`, com distâncias `0, 1, 1, 2` a partir de `A`."], ["DFS com adjacência ordenada", "Mesmo grafo, vizinhos na ordem alfabética: visita `A, B, D, C`; tempos de descoberta `1, 2, 3, 4`."]],
        er: ["Esquecer de marcar visitados e entrar em ciclo infinito.", "Usar BFS em grafo com pesos esperando menor custo total.", "Escolher matriz de adjacência para milhões de vértices com poucas arestas."],
        lab: "Desenhe o grafo `A-B`, `A-C`, `B-D` e anote a ordem de visita nas buscas BFS e DFS.",
        ref: "CLRS — Introduction to Algorithms, cap. 22 (Elementary Graph Algorithms, MIT Press, https://mitpress.mit.edu/)."
      })
  ]
});

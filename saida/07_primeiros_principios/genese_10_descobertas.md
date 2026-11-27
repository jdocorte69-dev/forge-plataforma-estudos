# Gênese de 10 descobertas — dos primeiros princípios à fórmula

## Introdução — por que gênese antes de fórmula

Uma fórmula é o fim de uma conversa, não o começo dela. Quando encontramos "a² + b² = c²" impressa no quadro, temos a resposta pronta, mas perdemos o problema que a gerou: o chão alagado, a cerca torta, a sombra na praça, o navio sem rota. Os primeiros princípios (first principles) exigem o caminho inverso — reconstruir a dificuldade concreta antes de aceitar a notação. É por isso que toda explicação deste caderno obedece ao método das cinco camadas: problema real, impasse, salto de intuição, formalização e teste de Feynman. A ordem não é enfeite didático; ela impede que a mente decore um símbolo sem saber o que ele conserta no mundo.

Na prática, leia cada descoberta como se fosse uma cena. Primeiro você entra na cena (Camada 1), depois percebe que as ferramentas da época não dão conta (Camada 2), depois vê a ideia que destrava o nó (Camada 3), só então escreve as contas (Camada 4) e, por fim, testa se consegue explicar tudo a alguém que nunca estudou o assunto, em menos de dois minutos, sem jargão (Camada 5). Se a Camada 5 falhar, a Camada 4 ainda não foi entendida — volte uma casa. Os exemplos cotidianos abaixo são inéditos: quintal, marceneiro, feira, elevador, cadeado de bicicleta e portão de escola aparecem no lugar dos exemplos clássicos dos livros.

## Tabela-resumo das 10 descobertas

| Id | Descoberta | Impasse original | Salto de intuição | Fórmula-síntese |
|---|---|---|---|---|
| A | Ângulo reto e corda de 12 nós | Não havia transferidor para refundar lotes após a cheia | Medir comprimentos em vez de medir ângulos | 3² + 4² = 5² ⇒ canto reto |
| B | Soma dos ângulos do triângulo | Cada corte exigia uma nova medição com transferidor | Juntar os três cantos de papel formam uma reta | θ1 + θ2 + θ3 = 180 graus |
| C | Pitágoras por rearranjo | A diagonal não é soma nem produto dos lados | Mover quatro triângulos dentro de um quadrado | c² = a² + b² |
| D | Circunferência da Terra (Eratóstenes) | Impossível dar a volta no planeta | Raios paralelos + sombra = ângulo central | C = D × 360/θ |
| E | Primos infinitos e MDC (Euclides) | A lista de primos parece nunca terminar | Multiplique todos e some 1; divida por restos | N = produto + 1; MDC(a,b) = MDC(b, resto) |
| F | Álgebra (Al-Khwarizmi) | Incógnita ao quadrado só por frases longas | Desenhe o desconhecido e complete o quadrado | (x + b/2)² = c + b²/4 |
| G | Cálculo (Newton e Leibniz) | 0/0 travava a velocidade instantânea | Aproximar por fatias cada vez mais finas | ∫ de a até b = F(b) - F(a) |
| H | Logaritmos (Napier) | Multiplicar números de 15 dígitos à mão | Traduzir produto em soma de expoentes | log(M × N) = log M + log N |
| I | Lógica booleana a circuitos (Boole e Shannon) | Frases qualitativas não comandam relés | Verdadeiro/Falso viram 1/0 e relés viram portas | Y = A × B (E), Y = A + B (OU) |
| J | Aritmética modular e Fermat | Números crescem e estouram a máquina | Fazer a conta "dar a volta" como um relógio | a elevado a (p - 1) ≡ 1 (módulo p) |

## A. A geometria do ângulo reto e a corda de 12 nós no Egito

### Camada 1 — O Problema Real

Todos os anos o Nilo subia e apagava as marcas que separavam as propriedades. Passada a cheia, o agrimensor (surveyor) voltava ao mesmo ponto com estacas e uma corda e precisava refazer as divisas exatamente como antes.

O problema não era "medir um ângulo" — isso nem existia como ferramenta — era recompor a esquina de um lote. Se o canto ficasse fechado demais ou aberto demais, o lote vizinho ganhava uma faixa de terra e o imposto sobre a colheita saía injusto.

Exemplo inédito: no sítio do tio, um quintal de 9 m por 12 m precisa de uma diagonal de 15 m para conferir se a cerca fechou em esquina. A corda de 12 nós dá os trechos 3, 4 e 5; para o quintal maior, o estirador apenas triplica cada trecho.

### Camada 2 — O Impasse

Não havia transferidor, esquadro de metal nem o conceito de grau. O olho é enganoso: um canto que "parece" reto pode desviar alguns centímetros e, em 12 m de divisa, esse desvio vira uma discussão entre dois vizinhos.

Além disso, medir ângulo exigiria um padrão de referência que ninguém tinha. A única coisa confiável à mão era a própria corda — ela sabia contar comprimentos, não graus.

Sem um critério objetivo, cada agrimensor decidiria de um jeito. A mesma terra receberia dois donos diferentes dependendo de quem esticava a corda. Era preciso transformar "reto" em algo que a corda conseguisse verificar.

### Camada 3 — O Salto de Intuição

A ideia foi inverter a pergunta: em vez de medir o ângulo, meça os lados e deixe que eles determinem o ângulo. Com nós igualmente espaçados, a corda de 12 intervalos se divide em três trechos de 3, 4 e 5 unidades.

Ao esticar as três pontas, o triângulo fecha sozinho — e o canto entre os trechos 3 e 4 encosta como a esquina de uma mesa. Nenhum grau foi medido; apenas contaram-se nós.

O segredo é a proporção, não o tamanho: 3, 4, 5 funciona; 9, 12, 15 também; qualquer múltiplo serve. A corda virou um esquadro portátil, feito de comprimento em vez de metal.

### Camada 4 — A Formalização

Os trechos 3, 4 e 5 satisfazem 3² + 4² = 25 e 5² = 25. A verificação com SymPy devolveu 25, 25 e √25 = 5 — ou seja, o maior lado é exatamente a hipotenusa.

Generalizando para lados a, b e c (com c o maior): a² + b² = c² ⇒ o ângulo entre a e b é de 90 graus. É o que mais tarde se chamou recíproca do Teorema de Pitágoras.

No quintal de 9 m e 12 m: 9² + 12² = 81 + 144 = 225 = 15². A área do triângulo marcado pela corda é (9 × 12)/2 = 54 m²; com a corda pequena, (3 × 4)/2 = 6 unidades quadradas.

O contraste importa: um triângulo 2, 5, 5 dá 2² + 5² = 29 ≠ 25 = 5². Ele fecha, mas não tem canto reto. A igualdade dos quadrados é o filtro, não a aparência.

### Camada 5 — O Teste de Feynman

"Pegue três barbantes com 3, 4 e 5 palmos e dê um nó nas pontas. Puxe as três pontas para fora: o canto entre os dois barbantes menores fica certinho igual à esquina da mesa. Você não precisa de aparelho nenhum — a própria corda já carrega o esquadro dentro dela. Se quiser um quintal maior, é só triplicar os três barbantes: 9, 12 e 15 palmos."

## B. A soma dos ângulos internos do triângulo = 180 graus

### Camada 1 — O Problema Real

Um marceneiro corta o tampo triangular de uma cadeira. Duas pontas já estão cortadas; falta saber como cortar a terceira para que a peça encoste na moldura sem deixar fenda.

Na costura de uma bandeira triangular, a costureira mede dois ângulos com um transferidor de plástico e precisa do terceiro sem desmontar o trabalho.

Exemplo inédito: numa prancheta, desenhe o triângulo com pontas em (0,0), (6,0) e (2,4). Os ângulos medidos são 63,435 graus, 45 graus e 71,565 graus; o marceneiro só precisa da regra que os liga.

### Camada 2 — O Impasse

Medir os três ângulos com transferidor de plástico é lento e impreciso: o plástico entorta, a linha tem espessura e o erro se acumula a cada corte.

Pior: sem uma relação entre os ângulos, cada nova peça exigiria uma nova medição completa. Não havia uma "lei de conservação" dos cantos que permitisse deduzir o terceiro a partir dos outros dois.

Os gregos já tinham o esquadro e a régua, mas precisavam de uma proposição que transformasse três números independentes em uma única conta.

### Camada 3 — O Salto de Intuição

Duas ideias se somam. A primeira: recorte os três cantos de um triângulo de papel e encoste-os lado a lado — eles sempre formam uma linha reta. Uma reta é meia volta: 180 graus.

A segunda: ao prolongar um lado, o ângulo de fora (externo) é exatamente a soma dos dois ângulos de dentro que ficam longe dele. É como se o canto externo "ouvisse" os dois outros.

Com isso, um único ângulo conhecido e uma reta já bastam. O triângulo deixa de ser três medições e passa a ser um orçamento fechado de 180 graus.

### Camada 4 — A Formalização

Para qualquer triângulo no plano, θ1 + θ2 + θ3 = 180 graus. Pela proposição do ângulo externo: θ externo = θ1 + θ2 = 180 graus - θ3.

No exemplo da prancheta, o SymPy calculou os ângulos por lei dos cossenos: 63,435 graus, 45 graus e 71,565 graus. A soma deu exatamente 180,000 graus, e o externo deu 108,435 graus = 63,435 + 45.

A fórmula vale para ∀ triângulo desenhado numa folha plana. Vale ressalvar: sobre uma superfície curva, como uma bola, a soma passa de 180 graus — a geometria muda com o terreno.

### Camada 5 — O Teste de Feynman

"Recorte um triângulo de papel e pinte cada ponta de uma cor. Agora arraste as três pontas pintadas até encostarem umas nas outras: elas sempre formam uma linha reta, igual à borda da mesa. É meia volta. Por isso, se você já sabe dois cantos, o terceiro é só o que falta para completar essa meia volta."

## C. O Teorema de Pitágoras por rearranjo visual

### Camada 1 — O Problema Real

Um construtor quer saber a diagonal de um quintal retangular de 8 por 15 palmos para encomendar a madeira da cerca em diagonal. Ele tem régua para os lados, mas não quer esticar a fita sobre a terra irregular.

A pergunta é concreta: qual o comprimento da linha reta que liga duas esquinas opostas de um retângulo conhecido?

Exemplo inédito: uma caixa de azulejos com 8 palmos de largura e 15 de comprimento. A diagonal tem de caber na tábua de apoio; errar o corte desperdiça material caro.

### Camada 2 — O Impasse

A diagonal não é a soma dos lados (8 + 15 = 23) nem o produto (8 × 15 = 120). Ela é um número novo que fica entre os dois.

Medir diretamente com fita é possível, mas a fita acompanha as ondulações do chão e dá um valor maior que a reta. Calcular à mão parecia exigir trigonometria, que ainda não existia.

Era preciso um argumento que usasse apenas áreas — grandeza que se pode recortar, empilhar e comparar sem medir ângulo algum.

### Camada 3 — O Salto de Intuição

Pegue quatro cópias do triângulo retido pelos lados a, b e hipotenusa c. Coloque-as dentro de um quadrado de lado (a + b) de dois modos diferentes.

No primeiro modo, as quatro peças deixam um buraco grande no meio: um quadrado de lado c. No segundo modo, as mesmas quatro peças se agrupam em duas duplas e deixam dois buracos: um de lado a e outro de lado b.

O quadrado externo é o mesmo e as quatro peças são as mesmas. Logo, o espaço vazio não pode mudar de tamanho — só de lugar. Daí c² = a² + b².

### Camada 4 — A Formalização

A identidade algébrica (a + b)² = a² + 2ab + b² foi confirmada simbolicamente pelo SymPy (diferença igual a 0).

Arranjo 1: área total = 4 × (a × b)/2 + c² = 2ab + c².
Arranjo 2: área total = 4 × (a × b)/2 + a² + b² = 2ab + a² + b².
Igualando e cancelando o termo comum 2ab ⇒ c² = a² + b².

Com a = 8 e b = 15: (8 + 15)² = 529; 4 × (8 × 15)/2 + 17² = 240 + 289 = 529; e 240 + 8² + 15² = 240 + 64 + 225 = 529. O SymPy confirmou 8² + 15² = 289 = 17².

### Camada 5 — O Teste de Feynman

"Pense em quatro triángulos de papel dentro de uma caixa quadrada. Num desenho, eles deixam um buraco grande no centro. No outro desenho, com as mesmas quatro peças, o buraco aparece dividido em dois menores. Como nada foi jogado fora, o buraco grande tem a mesma área dos dois buracos juntos. É só trocar as peças de lugar."

## D. A medição da circunferência da Terra por Eratóstenes

### Camada 1 — O Problema Real

Eratóstenes queria responder a uma pergunta que ninguém conseguia testar: quantos quilômetros dá a volta no mundo? Não havia satélite, avião nem mapa global.

A cena cotidiana é simples: duas varas fincadas no mesmo instante, uma em cada extremidade de uma estrada norte-sul. Em uma delas o Sol bate a pique e não faz sombra; na outra, aparece uma sombra curtinha.

Exemplo inédito: imagine duas praças alinhadas norte-sul separadas por 600 km. Numa não há sombra; na outra o Sol inclina 6 graus. Com esses dois dados, o tamanho do planeta vira conta de escola.

### Camada 2 — O Impasse

Dar a volta a pé ou a cavalo era impossível: a viagem levaria anos e ninguém sabia manter uma direção rigorosamente contínua.

Mesmo que se caminhasse, como saber onde "termina" a volta? Não havia referência externa, nem pontos de chegada conhecidos.

O que existia era uma distância local entre duas cidades e a luz do Sol. O desafio era transformar um pedacinho medido no planeta inteiro sem sair do lugar.

### Camada 3 — O Salto de Intuição

Os raios solares chegam praticamente paralelos porque o Sol está muito distante. Se a Terra fosse plana, duas varas verticais sob raios paralelos fariam sombras iguais.

Como as sombras diferem, o chão entre elas é curvo. O ângulo da sombra na segunda praça é exatamente o ângulo aberto no centro da Terra pelas duas praças — basta traçar as retas paralelas cortadas por uma transversal.

Aí está a virada: medir um ângulo no chão dá o mesmo número do ângulo no centro do planeta. E um ângulo é uma fração de volta completa: 1/50 de volta significa 50 vezes a distância percorrida.

### Camada 4 — A Formalização

No dado histórico, a sombra em Alexandria media 7,2 graus no mesmo instante em que o Sol iluminava o fundo de um poço em Siena. Como 360/7,2 = 50, a volta completa é 50 vezes a distância entre as cidades.

Com D ≈ 5000 estádios: C = D × 360/θ = 5000 × 360/7,2 = 250000 estádios. Convertendo com 157,5 m por estádio: 250000 × 157,5/1000 = 39375 km.

O valor moderno da circunferência é aproximadamente 40075 km; o erro foi de apenas 1,747%, segundo o cálculo do SymPy. Um resultado notável com estaca, poço e sombra.

No exemplo inédito das praças: 600 × 360/6 = 36000 km. A regra é a mesma; muda só a escala.

### Camada 5 — O Teste de Feynman

"Plante duas varas no mesmo horário. Se uma não faz sombra e a outra faz um pouquinho, é porque o chão entre elas é curvo. O tamanho dessa sombra diz que fração de volta você andou. Se a sombra indicar 1/50 de volta, é só multiplicar por 50 a distância entre as varas — e você acabou de medir a Terra inteira sem sair do lugar."

## E. A infinitude dos primos e o Algoritmo de Euclides

### Camada 1 — O Problema Real

Um feirante recebeu 1957 reais de um cliente e 323 reais de outro e quer embrulhar cada quantia em envelopes iguais, sem sobrar moeda e sem misturar os dois clientes. Qual é o maior valor possível por envelope?

Ao mesmo tempo, alguém afirma ter encontrado "a lista completa de números indivisíveis" — os primos. Como verificar uma afirmação dessas sem testar números infinitos?

Exemplo inédito: a lista modesta {2, 3, 5, 7, 11, 13} parece suficiente para explicar muita coisa. Será que dá para fechar a lista nela?

### Camada 2 — O Impasse

Os primos ficam mais raros quanto mais alto você conta. Testar cada número novo um por um até o infinito é uma tarefa sem fim — e, justamente por isso, não prova nada.

Para os envelopes, dividir 1957 por 323 e tentar valores candidatos um a um é trabalhoso. Era preciso um procedimento que encurtasse a conta sozinho.

As duas perguntas parecem distintas, mas compartilham o mesmo tema: o que acontece com os restos da divisão.

### Camada 3 — O Salto de Intuição

Euclides atacou a lista por contradição: suponha que ela esteja completa. Multiplique todos os primos dela e some 1. Qualquer primo da lista divide o produto, mas deixa resto 1 ao dividir o produto mais 1. Portanto, ou esse número novo é primo, ou ele esconde um primo que não estava na lista. A lista nunca fecha.

Para o máximo divisor comum (MDC), o salto foi parecido: se um número divide a e b, então divide também a diferença entre eles. Trocar o par (a, b) pelo par (b, resto da divisão de a por b) encurta o problema sem perder o divisor.

Repetir a troca até o resto ser zero transforma uma conta impossível numa sequência curtinha de divisões. É o algoritmo de Euclides (Euclidean algorithm).

### Camada 4 — A Formalização

Infinitude: seja P = {2, 3, 5, 7, 11, 13} e N = 2 × 3 × 5 × 7 × 11 × 13 + 1 = 30031. O SymPy fatorou 30031 = 59 × 509. Ambos os fatores são primos e nenhum pertence a P, então a hipótese de P ser completa cai.

Em símbolos: para todo primo p ∈ P, N ÷ p deixa resto 1 ⇒ ∃ primo fora de P. A conclusão vale para qualquer lista finita, não só para essa.

MDC: MDC(a, b) = MDC(b, resto de a ÷ b), com MDC(a, 0) = a. No exemplo da feira, MDC(1957, 323) = 19, e a verificação deu 1957 ÷ 19 = 103 envelopes e 323 ÷ 19 = 17 envelopes, ambos com resto 0.

Como checagem adicional, o SymPy devolveu MDC(1071, 462) = 21. O procedimento é o mesmo: dividir, pegar o resto, repetir.

### Camada 5 — O Teste de Feynman

"Se alguém disser que tem todos os primos do mundo numa sacola, multiplique tudo que está dentro e coloque mais um grão. Nenhum primo da sacola consegue dividir esse monte sem deixar um grão sobrando. Logo, sempre existe um primo novo — a sacola nunca tem tampa. E para dividir dinheiro em envelopes iguais, faça como quem sobra: divida, guarde o resto, divida de novo até não sobrar nada."

## F. A invenção da álgebra por Al-Khwarizmi

### Camada 1 — O Problema Real

Um jardineiro desenha um canteiro quadrado de lado x metros e recebe uma faixa extra de grama cuja área total é 10x metros quadrados. Somando o quadrado e a faixa, ele tem 39 m² de grama para cobrir. Quanto mede o lado do canteiro?

Na época de Al-Khwarizmi, o mesmo tipo de pergunta aparecia em partilhas de herança e medições de terra: um valor desconhecido aparecia multiplicado por si mesmo e ninguém tinha um símbolo para ele.

Exemplo inédito: troque o canteiro por um tanque quadrado de lado x com uma borda extra de 8x metros; a área total é 209 m². O raciocínio deve funcionar para os dois casos.

### Camada 2 — O Impasse

Sem um símbolo para o desconhecido, cada problema era descrito em frases longas: "o quadrado de uma coisa mais dez vezes essa coisa equivale a trinta e nove". Difícil de manipular e fácil de trocar um termo.

Não havia uma receita geral para "desfazer" o quadrado. Resolver x² exigia um truque geométrico redesenhado do zero a cada vez.

A palavra al-jabr, que deu origem a "álgebra", significa recompor: a ideia nasce justamente da necessidade de reconstruir uma figura quebrada.

### Camada 3 — O Salto de Intuição

Al-Khwarizmi desenhou o problema. O termo x² virou um quadrado de areia de lado x. O termo 10x virou quatro retângulos de largura 10/4 = 2,5 e comprimento x, colados nos quatro lados do quadrado.

A cruz ficou incompleta: faltavam os quatro cantos. Cada canto é um quadradinho de 2,5 × 2,5 = 6,25. Somando os quatro, 4 × 6,25 = 25.

O que se acrescenta de um lado da conta, acrescenta-se do outro. A figura torta virou um quadrado perfeito — e um quadrado perfeito tem lado fácil de medir. É o completar o quadrado (completing the square).

### Camada 4 — A Formalização

Equação: x² + 10x = 39. Some 25 aos dois lados: x² + 10x + 25 = 39 + 25 = 64.

O lado esquerdo é (x + 5)² porque 5 = 10/2. Então (x + 5)² = 64 ⇒ √64 = 8 ⇒ x + 5 = 8 ⇒ x = 3. O SymPy devolveu a solução [3] e confirmou (3 + 5)² = 64.

Regra geral: x² + bx = c ⇒ (x + b/2)² = c + b²/4. No exemplo inédito, x² + 8x = 209 ⇒ (x + 4)² = 209 + 16 = 225 ⇒ x + 4 = 15 ⇒ x = 11, também confirmado pelo SymPy.

Note que a raiz negativa existe na álgebra moderna, mas o jardineiro descarta: comprimento não pode ser negativo. A geometria de Al-Khwarizmi já escolhia naturalmente a raiz positiva.

### Camada 5 — O Teste de Feynman

"Desenhe um quadrado no chão e cole quatro faixas iguais nas laterais. Faltam só os quatro cantinhos para fechar um quadrado maior. Coloque os cantinhos dos dois lados da conta: agora o quadrado grande mede 64 de área, então o lado mede 8. Tirando a sobra de 5, o canteiro tem 3 metros. A álgebra é só isso: rearranjar a figura até o lado aparecer."

## G. A invenção do cálculo por Newton e Leibniz

### Camada 1 — O Problema Real

Um elevador sobe numa obra e sua posição, em metros, é s(t) = t² + 2t depois de t segundos. O fiscal quer duas coisas: a velocidade exata no terceiro segundo (o que marcaria um velocímetro) e a distância total entre o primeiro e o quarto segundo.

A velocidade média é fácil: distância dividida pelo tempo. A dificuldade está no "exato naquele instante" — um número que muda a cada fração de segundo.

Exemplo inédito: s(t) = t² + 2t dá 8 m/s aos 3 s e 36 m de deslocamento entre 1 s e 4 s. Veremos de onde saem esses números.

### Camada 2 — O Impasse

Velocidade é distância ÷ tempo. Para obter a velocidade "em" um instante, o intervalo de tempo teria que ser zero — e aí a conta vira 0 ÷ 0, uma divisão indefinida que paralisa a aritmética.

Do outro lado, calcular a área sob uma curva somando retângulos largos dá um valor aproximado. Quanto mais finas as fatias, melhor - mas nunca se chega ao valor exato só com somas finitas.

Era preciso domar o infinito sem cair no zero proibido. Os dois problemas pareciam opostos: um dividia por zero, o outro somava infinitas fatias.

### Camada 3 — O Salto de Intuição

Newton e Leibniz não dividiram por zero: olharam a tendência. Em vez de Δt = 0, consideraram Δt → 0. A razão (s(t + Δt) - s(t))/Δt se estabiliza num número — esse número é a derivada (derivative).

Para áreas, fatiaram a curva em retângulos de largura Δx e somaram com ∑; quando Δx → 0, o número de fatias tende a ∞ e a soma tende à integral definida (definite integral).

O golpe final foi perceber que as duas operações são inversas: derivar a função que acumula área devolve a curva original. É o teorema fundamental do cálculo (fundamental theorem of calculus).

### Camada 4 — A Formalização

Derivada por limite: para f(t) = t², a razão (f(3 + Δt) - f(3))/Δt tende a 6 quando Δt → 0. O SymPy calculou o limite e devolveu 6; a integral de 0 até 3 de t² devolveu 9.

Teorema fundamental: ∫ de a até b de f(x) dx = F(b) - F(a), com F'(x) = f(x). Para f(t) = t², F(t) = t³/3 e F(3) - F(0) = 9 — igual à integral.

No elevador: s'(t) = 2t + 2 ⇒ s'(3) = 8 m/s. A integral da velocidade de 1 até 4 deu 36 m, exatamente s(4) - s(1).

A definição de integral como soma de fatias é ∫ de a até b de f(x) dx = limite, quando N → ∞, da soma ∑ de f(xi) × Δx. A notação ∫ é um S alongado: lembra "soma".

### Camada 5 — O Teste de Feynman

"Olhe o velocímetro do carro descendo a serra: ele não mostra a média da viagem, mostra o instante. Para acertar esse número, você mede um intervalo curtíssimo, onde a estrada parece reta — e aí a divisão funciona. Para saber o caminho total, some fatias fininhas como fatias de pão. Uma operação desfaz a outra: somar as velocidades devolve a distância."

## H. A invenção dos logaritmos por John Napier

### Camada 1 — O Problema Real

Um astrônomo precisa multiplicar dois números de 15 algarismos para calcular uma órbita; um navegador faz o mesmo para uma rota marítima. Cada multiplicação manual consome horas.

Na feira, o problema aparece em miniatura: um comerciante quer saber rapidamente quantas são 1000 caixas multiplicadas por 100 caixas, sem fazer a conta longa.

Exemplo inédito: uma fábrica de suco dobra o número de garrafas a cada hora. Depois de 10 dobraduras, quantas garrafas há? A resposta é 1024, e o logaritmo (logarithm) a encontra sem multiplicar dez vezes.

### Camada 2 — O Impasse

Multiplicar números gigantes à mão é lento e traiçoeiro: um algarismo trocado no meio da conta estraga a órbita inteira.

As tabelas de multiplicação tradicionais só crescem: para cada novo produto é preciso recomeçar do zero. Não existe atalho que reaproveite trabalho anterior.

A operação difícil (multiplicar) precisava ser trocada por uma fácil (somar). Era esse o busílis.

### Camada 3 — O Salto de Intuição

Napier montou duas filas paralelas. Embaixo, uma progressão geométrica: 1, 2, 4, 8, 16... Em cima, uma progressão aritmética: 0, 1, 2, 3, 4...

Andar uma casa na fila de cima equivale a dobrar na fila de baixo. Então somar posições na fila de cima substitui multiplicar valores na fila de baixo.

A "posição" de um número na fila é o seu logaritmo. Multiplicar virou somar — e somar é muito mais barato, rápido e seguro.

### Camada 4 — A Formalização

Definição: se b elevado a y é igual a x, então y é o logaritmo de x na base b. Escrevemos: log na base b de x = y.

Propriedade que mudou o mundo: log(M × N) = log M + log N, e log(M ÷ N) = log M - log N.

No exemplo da feira: log na base 10 de 1000 = 3, log na base 10 de 100 = 2, logo log na base 10 de (1000 × 100) = 5. O SymPy confirmou 1000 × 100 = 100000 e log na base 10 de 100000 = 5.

Na fábrica de suco: 2 elevado à décima = 1024, então log na base 2 de 1024 = 10 — dez horas de dobradura. Os dois sentidos da tabela foram verificados.

### Camada 5 — O Teste de Feynman

"Em vez de multiplicar dois números enormes, traduza cada um para 'quantas vezes o 10 teve de se multiplicar'. O 1000 vira 3, o 100 vira 2. Some 3 + 2 = 5 e traduza de volta: 100000. Somar é fácil; multiplicar gigantes é difícil. O logaritmo é esse tradutor de peso."

## I. Da lógica booleana aos circuitos digitais: Boole e Shannon

### Camada 1 — O Problema Real

O portão da escola só deve abrir se o crachá do aluno E o sensor da catraca estiverem ativos. Já a campainha da casa deve tocar se alguém apertar o botão da porta OU o botão do portão.

Como fazer uma máquina obedecer a "E" e a "OU" sem um funcionário decidindo dentro dela?

Exemplo inédito: um alarme de bicicleta que dispara quando o sensor de movimento OU o sensor de abertura acusa algo — mas não dispara se nenhum dos dois acusar.

### Camada 2 — O Impasse

A lógica filosófica grega vinha em frases: "se tal coisa é verdadeira e tal outra é falsa...". Frases não ligam fio, não fecham relé e não podem ser montadas numa placa.

Na época de Boole, álgebra era coisa de número; lógica era coisa de palavra. Os dois mundos não se conversavam.

Mesmo depois de Boole, faltava alguém perceber que um relé (relay) — uma chave que liga e desliga — é exatamente a física daquela álgebra.

### Camada 3 — O Salto de Intuição

Boole (1847) reduziu toda proposição a dois estados: Verdadeiro = 1 e Falso = 0. Com isso, E, OU e NÃO passaram a obedecer a regras matemáticas rigorosas: a álgebra booleana (Boolean algebra).

Shannon (1937) deu a cartada decisiva: um relé fechado deixa passar corrente (1); aberto, não deixa (0). Relés em série são E; relés em paralelo são OU.

Uma frase lógica virou desenho de fio. Milhões de relés minúsculos passaram a "pensar" — e nasceram os circuitos digitais (digital circuits).

### Camada 4 — A Formalização

Porta E (AND gate): Y = A × B. Só passa corrente se A = 1 e B = 1; com A, B ∈ {0, 1}.

Porta OU (OR gate): Y = A + B. Passa se A = 1 ou B = 1 (inclusive: passa também se ambos estiverem ativos).

Porta NÃO (NOT gate): Y = não A. Inverte o estado — o relé abre quando é energizado.

Lei de simplificação verificada: (A E B) OU (A E não B) ≡ A. O SymPy simplificou a expressão e devolveu A. Outra: (não A) OU (A E B) ≡ B OU (não A).

Tabela do "OU exclusivo" calculada com valores lógicos: (0,0) → 0; (0,1) → 1; (1,0) → 1; (1,1) → 0. É o alarme da bicicleta: dispara se exatamente um sensor acusar.

### Camada 5 — O Teste de Feynman

"Pense no portão da escola. Dois interruptores em série: só passa corrente se os dois fecharem — é o 'E'. Agora coloque os interruptores em paralelo na campainha da casa: passa se qualquer um fechar — é o 'OU'. Um relé que inverte a chave é o 'NÃO'. Com milhares dessas chaves, a eletricidade toma a decisão sozinha, sem ninguém dentro da caixa."

## J. Aritmética modular e o Pequeno Teorema de Fermat

### Camada 1 — O Problema Real

O cadeado da bicicleta tem 17 posições marcadas. Se você gira 7 posições, 16 vezes seguidas, onde o disco para? Precisamos de uma conta que "dê a volta" em vez de crescer para sempre.

No relógio de parede, a mesma ideia aparece todo dia: 14 horas aponta o mesmo lugar que 2 horas. Ninguém diz "14 horas de manhã" — o ponteiro reiniciou.

Exemplo inédito: um aplicativo de banco precisa guardar um número gigante em poucos bytes e ainda assim conseguir conferir a assinatura. A aritmética modular (modular arithmetic) é o relógio que permite isso.

### Camada 2 — O Impasse

Na aritmética comum, exponenciar cresce sem limite: poucos passos já geram números com centenas de algarismos. Num computador isso causa estouro de memória (overflow).

A criptografia precisa de um universo fechado e cíclico, onde as contas sempre caibam no mesmo espaço. Além disso, precisa de uma operação fácil de fazer e difícil de desfazer sem um segredo — uma função unidirecional (one-way function).

O Pequeno Teorema de Fermat (Fermat's little theorem) fornece justamente o ciclo previsível que sustenta a criptografia de chave pública (public-key cryptography).

### Camada 3 — O Salto de Intuição

A ideia é contar até m - 1 e voltar a zero. Escrevemos a ≡ b (módulo m) quando a e b deixam o mesmo resto ao serem divididos por m — uma congruência (congruence).

Fermat percebeu que, escolhendo um módulo primo p, todo número a não múltiplo de p obedece a um ritmo fixo: depois de p - 1 multiplicações por a, o resultado volta a 1.

Assim, expoentes gigantes podem ser reduzidos ao "número de voltas completas". O segredo pode ficar no expoente: fácil de aplicar, difícil de adivinhar.

### Camada 4 — A Formalização

Definição: a ≡ b (módulo m) se e somente se m divide (a - b). No relógio, 14 ≡ 2 (módulo 12), pois 12 divide 14 - 2 = 12.

Teorema: se p é primo e o máximo divisor comum de a e p é 1, então a elevado a (p - 1) ≡ 1 (módulo p). No cadeado com p = 17 e a = 7: 7 elevado à décima sexta ≡ 1 (módulo 17), confirmado pelo SymPy.

O inverso modular de 7 módulo 17 é 5, pois 7 × 5 = 35 ≡ 1 (módulo 17). Esse inverso é a ferramenta que "desfaz" a volta quando se conhece o segredo.

Teste de estresse: com o primo 104729 e a base 12345, o comando pow(12345, 104728, 104729) devolveu 1. Mesmo com números enormes, a conta fecha em tempo instantâneo e sem estouro.

### Camada 5 — O Teste de Feynman

"É a matemática do relógio: 14 horas é a mesma posição das 2 horas porque o ponteiro deu uma volta. No cadeado de 17 posições, girar 7 posições 16 vezes termina exatamente no começo de novo. Essa volta certinha permite embaralhar um número com um cadeado matemático — e só quem sabe quantas voltas dar consegue desfazer."

## Síntese para o caderno

- A. Corda de 12 nós: contar comprimentos substitui medir ângulos; 3² + 4² = 5² ⇒ esquina reta.
- B. Recortar os três cantos e juntá-los dá uma reta: θ1 + θ2 + θ3 = 180 graus.
- C. Mover quatro triângulos dentro de um quadrado prova c² = a² + b² por área igual.
- D. Sombra diferente sob raios paralelos mede o arco: C = D × 360/θ.
- E. Produto de todos os primos mais 1 sempre acha outro primo; MDC(caixa, resto) encurta a divisão.
- F. Desenhar o desconhecido e completar os cantos transforma x² + 10x = 39 em (x + 5)² = 64 ⇒ x = 3.
- G. Tendência com Δt → 0 dá a derivada; soma de fatias dá a integral; uma desfaz a outra.
- H. Logaritmo traduz multiplicação em soma: log(M × N) = log M + log N.
- I. Verdadeiro/Falso viram 1/0; relé em série é E, em paralelo é OU, e a máquina decide.
- J. Contar como relógio evita estouro; a elevado a (p - 1) ≡ 1 (módulo p) sustenta a criptografia.

## Verificação computacional

Ambiente: Python 3 com SymPy 1.14.0. A primeira tentativa de envio falhou apenas por aspas no PowerShell (`SyntaxError: '(' was never closed`); o comando foi reenviado com aspas simples internas e executou normalmente. Os comandos abaixo são os que realmente rodaram, e os resultados são os impressos na saída.

### Lote 1 — todas as descobertas

```python
import sympy as sp
from sympy import symbols, sqrt, acos, pi, Rational, integrate, limit, log, simplify, simplify_logic, isprime, gcd
a,b,t,h,x = symbols('a b t h x', positive=True)
A,B = symbols('A B')

print('A pitagoras 3-4-5:', 3**2+4**2, 5**2, sp.sqrt(3**2+4**2))
s = (3+4+5)/2
print('A area heron:', sp.sqrt(s*(s-3)*(s-4)*(s-5)))
print('A nao-retangulo 2-5-5:', 2**2+5**2, 5**2)

cos1 = 2/sqrt(20)
cos2 = 4/sqrt(32)
cos3 = 8/(sqrt(20)*sqrt(32))
ang = [acos(cos1), acos(cos2), acos(cos3)]
print('B angulos graus:', [sp.N(v*180/pi, 6) for v in ang], 'soma:', sp.N(sum(ang)*180/pi, 6))
print('B exterior:', sp.N((pi-ang[2])*180/pi,6), sp.N((ang[0]+ang[1])*180/pi,6))

print('C areas arranjo1/arranjo2:', 4*(5*12/2)+13**2, 4*(5*12/2)+5**2+12**2, (5+12)**2)
print('C identidade:', sp.simplify((a+b)**2-(a**2+b**2+2*a*b)))

Circ = 5000*360/7.2
km = Circ*157.5/1000
print('D circunferencia estadios:', Circ, 'km:', km, 'erro %:', sp.N(100*(40075-km)/40075,4))

N = 2*3*5*7*11*13+1
print('E N e fatoracao:', N, sp.factorint(N))
print('E MDC(1957,323):', gcd(1957,323), 'MDC(1071,462):', gcd(1071,462))

sol = sp.solve(sp.Eq(x**2+10*x,39),x)
print('F x^2+10x=39:', sol, '(x+5)^2:', (sol[0]+5)**2, 'cantos:', 4*Rational(25,4))
print('F novo exemplo x^2+8x=209:', sp.solve(sp.Eq(x**2+8*x,209),x))

f = t**2
print('G derivada em 3:', limit((f.subs(t,3+h)-f.subs(t,3))/h,h,0), 'integral 0..3:', integrate(f,(t,0,3)), 'F(3)-F(0):', Rational(1,3)*3**3)
f2 = t**2+2*t
print('G2 derivada em 3:', sp.diff(f2,t).subs(t,3), 'integral 1..4:', integrate(f2,(t,1,4)))

print('H logs:', sp.log(1000*100,10), sp.log(1000,10)+sp.log(100,10), 2**10, sp.log(1024,2), sp.N(sp.log(8*10**12,10),6))

print('I booleana:', simplify_logic((A & B) | (A & ~B)), simplify_logic(~A | (A & B)))
print('I XOR verdade-tabela:', [(p,q,(p or q) and not (p and q)) for p,q in [(False,False),(False,True),(True,False),(True,True)]])

print('J:', isprime(104729), pow(12345,104728,104729), pow(7,16,17), 14%12, pow(7,-1,17))
```

Saída real:

```text
A pitagoras 3-4-5: 25 25 5
A area heron: 6.00000000000000
A nao-retangulo 2-5-5: 29 25
B angulos graus: [63.4350, 45.0000, 71.5650] soma: 180.000
B exterior: 108.435 108.435
C areas arranjo1/arranjo2: 289.0 289.0 289
C identidade: 0
D circunferencia estadios: 250000.0 km: 39375.0 erro %: 1.747
E N e fatoracao: 30031 {59: 1, 509: 1}
E MDC(1957,323): 19 MDC(1071,462): 21
F x^2+10x=39: [3] (x+5)^2: 64 cantos: 25
F novo exemplo x^2+8x=209: [11]
G derivada em 3: 6 integral 0..3: 9 F(3)-F(0): 9
G2 derivada em 3: 8 integral 1..4: 36
H logs: 5 5 1024 10 12.9031
I booleana: A B | ~A
I XOR verdade-tabela: [(False, False, False), (False, True, True), (True, False, True), (True, True, False)]
J: True 1 1 2 5
```

### Lote 2 — exemplos inéditos brasileiros

```python
import sympy as sp
from sympy import sqrt, Rational, symbols, simplify, integrate
print('A2 corda 9-12-15:', 9**2+12**2, 15**2, 'area:', Rational(9*12,2))
print('C2 arranjos 8-15-17:', (8+15)**2, 4*(8*15/2)+17**2, 4*(8*15/2)+8**2+15**2, 8**2+15**2)
print('D2 exemplo brasileiro 600 km e 6 graus:', 600*360/6)
print('E2 envelopes 1957 e 323:', 1957//19, 323//19, 1957%19, 323%19)
t = symbols('t')
print('G3 s(t)=t**2+2*t: v(3)=', sp.diff(t**2+2*t,t).subs(t,3), 'deslocamento 1..4=', integrate(t**2+2*t,(t,1,4)))
print('H2 1000*100=', 1000*100, 'log10(100000)=', sp.log(100000,10))
```

Saída real:

```text
A2 corda 9-12-15: 225 225 area: 54
C2 arranjos 8-15-17: 529 529.0 529.0 289
D2 exemplo brasileiro 600 km e 6 graus: 36000.0
E2 envelopes 1957 e 323: 103 17 0 0
G3 s(t)=t**2+2*t: v(3)= 8 deslocamento 1..4= 36
H2 1000*100= 100000 log10(100000)= 5
```

### Leitura dos resultados

- A: 3² + 4² = 25 = 5²; área 6; o triângulo 2, 5, 5 dá 29 ≠ 25.
- A2: 9² + 12² = 225 = 15²; área 54 m² no quintal.
- B: 63,435 + 45 + 71,565 = 180,000 graus; externo 108,435 = 63,435 + 45.
- C: (5 + 12)² = 289 = 120 + 169 = 120 + 25 + 144; identidade simbólica zerada.
- C2: (8 + 15)² = 529 = 240 + 289 = 240 + 64 + 225; 8² + 15² = 289 = 17².
- D: 5000 × 360/7,2 = 250000 estádios ⇒ 39375 km; erro 1,747% frente a 40075 km; exemplo alternativo 600 × 360/6 = 36000 km.
- E: 2 × 3 × 5 × 7 × 11 × 13 + 1 = 30031 = 59 × 509; MDC(1957, 323) = 19 ⇒ 103 e 17 envelopes sem resto.
- F: x² + 10x = 39 ⇒ x = 3; (x + 5)² = 64; 4 × 6,25 = 25; exemplo novo x² + 8x = 209 ⇒ x = 11.
- G: limite = 6; ∫ de 0 até 3 de t² dt = 9 = F(3) - F(0); no elevador, v(3) = 8 m/s e deslocamento de 1 a 4 s = 36 m.
- H: log na base 10 de 100000 = 5 = 3 + 2; 2 elevado à décima = 1024 ⇒ log na base 2 de 1024 = 10.
- I: (A E B) OU (A E não B) ≡ A; (não A) OU (A E B) ≡ B OU não A; tabela do OU exclusivo confere.
- J: 104729 é primo; pow(12345, 104728, 104729) = 1; 7 elevado à décima sexta ≡ 1 (módulo 17); 14 ≡ 2 (módulo 12); inverso de 7 módulo 17 é 5.

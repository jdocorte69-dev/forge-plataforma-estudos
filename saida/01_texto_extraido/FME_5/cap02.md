# Capítulo 02 — SAMUEL HAZZAN

## Metadados

- Livro: FME 5 — Fundamentos da Matemática Elementar
- Capítulo: 02
- Trecho OCR: caracteres 23,195–37,526
- Origem: texto OCR derivado do Archive.org (pós-processamento local)

## Sumário da estrutura

- 35. Duas pessoas, Antônio e Benedito, praticam um jogo no qual em cada partida há
- 36. Uma urna tem 10 bolinhas numeradas 1, 2, 3, ..., 10. Três bolinhas são extraídas
- 37. Uma moto tem combustível suficiente para somente três voltas num circuito. Pe-
- 38. Suponha que no início de um jogo você tenha R$ 2000,00 e que só possa jo-
- 39. Um homem tem oportunidade de jogar no máximo 5 vezes na roleta. Em cada
- 40. Em um baile há r rapazes e m moças. Um rapaz dança com 5 moças, um segundo
- 14. Seja M um conjunto com m elementos, isto é, M = (a,, a,, ..., a). Chamamos
- 15. Exemplo:
- 16. Fórmula do número de arranjos com repetição
- 18. Exemplo:
- 19. Fórmula do número de arranjos
- 20. Exemplo:

## Texto reconstruído

```text
e usarmos os números 0, 1,2,3, 
4,5e6? 

Quantas peças diferentes podem ser formadas num jogo de dominó se usarmos os 
números 0, 1,2,3,...,n? 

Ae Bsão conjuntos tais que HA = ne 4B = r. Quantas funções f: A > B existem? 

Em um baralho de 52 cartas, cinco cartas são escolhidas sucessivamente. Quan- 
tas são as sequências de resultados possíveis: 

a) se a escolha for feita com reposição? 
b) se a escolha for feita sem reposição? 

5 | Fundamentos de Matemática Elementar 

ANÁLISE COMBINATÓRIA 

Solução 
a) Seja Ao conjunto das cartas do baralho. Temos A = 52. 
Cada escolha consta de uma sequência do tipo 

(a,, A, As, Ap As) 

emquea, EA a,€E A a,€EA a, E A,a, E A (pois a escolha foi feita com 
reposição). Logo, pelo princípio fundamental da contagem (parte A), o núme- 
ro de sequências é: 

52:52:52-52-52 = 52º = 380204032 
"Sta 
5 vezes 

b) Se a escolha é feita sem reposição, então cada sequência (a,, a, As, Ay 
as) é tal que cada elemento pertence a A e são todos elementos distintos. 
Logo, pelo princípio fundamental da contagem (parte B), o número de se- 
quências é: 

52-51-50-49-48 = 311875200 

E) 
5 fatores 

35. Duas pessoas, Antônio e Benedito, praticam um jogo no qual em cada partida há 
um único vencedor. O jogo é praticado até que um deles ganhe 2 partidas consecu- 
tivas ou 4 partidas tenham sido jogadas, o que ocorrer primeiro. Quais as sequên- 
cias possíveis de ganhadores? 

(Sugestão: Construa o diagrama de árvore.) 

36. Uma urna tem 10 bolinhas numeradas 1, 2, 3, ..., 10. Três bolinhas são extraídas 
sucessivamente, sem reposição. De quantas formas os números das bolinhas for- 
mam uma PA. na ordem em que foram extraídas? 

(Sugestão: Construa o diagrama de árvore.) 

37. Uma moto tem combustível suficiente para somente três voltas num circuito. Pe- 
dro, Manoel e Antônio disputam, por meio do lançamento de uma moeda, a opor- 
tunidade de dar cada volta, do seguinte modo: 

|. o lançamento da moeda é efetuado antes de cada volta; 

Il. se coroa, a vez é de Manoel; 

III. se cara, a vez é de Pedro; 

IV. se a mesma face ocorrer consecutivamente, a vez é de Antônio. 

Se a primeira volta for dada por Pedro, quantas voltas poderá dar Antônio? 

Fundamentos de Matemática Elementar | 5 

ANÁLISE COMBINATÓRIA 

38. Suponha que no início de um jogo você tenha R$ 2000,00 e que só possa jo- 
gar enquanto tiver dinheiro. Supondo que em cada jogada você perde ou ganha 
R$ 1000,00, quais são os possíveis resultados ao final de três jogadas? 

39. Um homem tem oportunidade de jogar no máximo 5 vezes na roleta. Em cada 
jogada, ele ganha ou perde R$ 1000,00. Começará com R$ 1000,00 e pa- 
rará de jogar antes de cinco vezes, se perder todo seu dinheiro ou se ganhar 
R$ 3000, 00, isto é, se tiver R$ 4000,00. De quantas maneiras o jogo poderá 
se desenrolar? 

40. Em um baile há r rapazes e m moças. Um rapaz dança com 5 moças, um segundo 
rapaz dança com 6 moças, e assim sucessivamente. O último rapaz dança com 
todas as moças. Qual é a relação entrem e 1? 

III. Consequências do princípio fundamental 
da contagem 

O princípio fundamental da contagem nos fornece o instrumento básico para 
a Análise Combinatória; entretanto, sua aplicação direta na resolução de problemas 
pode às vezes tornar-se trabalhosa. Iremos então definir os vários modos de formar 
agrupamentos e, usando símbolos simplificativos, deduzir fórmulas que permitam a 
contagem dos mesmos, em cada caso particular a ser estudado. 

IV. Arranjos com repetição 

14. Seja M um conjunto com m elementos, isto é, M = (a,, a,, ..., a). Chamamos 
arranjo com repetição dos m elementos, tomados r a r, toda r-upla ordenada (sequência 
de tamanho r) formada com elementos de M não necessariamente distintos. 

15. Exemplo: 
Uma urna contém uma bola vermelha (V), uma branca (B) e uma azul (A). Uma 

bola é extraída, observada sua cor e reposta na urna. Em seguida outra bola é extraída e 
observada sua cor. Quantas são as possíveis sequências de cores observadas? 

5 | Fundamentos de Matemática Elementar 

ANÁLISE COMBINATÓRIA 

Temos: 
Cada sequência é um par ordenado de cores (x,y) em que x, y E M = (V, B, A). 
Logo, pelo princípio fundamental da contagem (parte A), o número de pares é: 

3:39 

16. Fórmula do número de arranjos com repetição 

Seja M = (a, a,, .... a,) e indiquemos por (AR), , o número de arranjos com 
repetição de m elementos tomados r a r. 

Cada arranjo com repetição é uma sequência de r elementos, em que cada 
elemento pertence a M. 

(ES) 

r elementos 

Pelo princípio fundamental da contagem (parte A), o número de arranjos (AR)m,r 
será: 

(CAR) RP O OR 

rvezes 

Observemos que, se r = 1, (AR)m, j> mea fórmula acima continua válida 
Vre NX. 
V. Arranjos 

Sli Seja M um conjunto com m elementos, isto é, M = (a, a, -.., a,). Chamamos de 
arranjo dos m elementos tomados rar (1 <= r = m) a qualquer r-upla (sequência de r 
elementos) formada com elementos de M, todos distintos. 

18. Exemplo: 
M=(a,b,c,d) 

Os arranjos dos quatro elementos de M, tomados dois a dois, são os pares 
ordenados (x, y) formados com elementos distintos de M. 

Fundamentos de Matemática Elementar | 5 

ANÁLISE COMBINATÓRIA 

Pelo princípio fundamental da contagem (parte B), o número de pares 
ordenados é: 

19. Fórmula do número de arranjos 

Seja M = (a,, as, ..., ay) e indiquemos por Aa , O número de arranjos dos m 
elementos tomados r a r. 

Cada arranjo é uma sequência de r elementos, em que cada elemento pertence a 
M, e são todos distintos. 

(=; =uap=) 

1 
r elementos 

Pelo princípio fundamental da contagem (parte B), o número de arranjos 
Am, Será: 

= (ne (im = 4) eo (fim 4) 

DG 
r fatores 

Em particular, se r = 1, é fácil perceber que A, , =m. 

Notemos ainda que, de acordo com a definição que demos de arranjo, temos 
necessariamente 1 <r=<m. 

20. Exemplo: 

De um baralho de 52 cartas, 3 cartas são retiradas sucessivamente e sem 
reposição. Quantas sequências de cartas é possível obter? 

Notemos que cada resultado é uma tripla ordenada de cartas (x, y, Z), em que x é 
a 1º carta extraída, ya 22: e z a 32. Observemos que x, y, Z são todas distintas, visto que 
a extração é feita sem reposição. 

Logo, o número que queremos é A 

co 3 Isto É: 

Ao 3 =52:51:50 = 132600 
iá ll 
3 fatores 

5 | Fundamentos de Matemática Elementar 

ANÁLISE COMBINATÓRIA 

VI. Permutações 

21. Seja M um conjunto com m elementos, isto é, M = (a,, as, -.., a,)). Chamamos de 
permutação dos m elementos a todo arranjo em que r = m. 

22. Exemplo: 

Seja M = (a, b, c). 

As permutações dos elementos de M são todos os arranjos constituídos de 3 
elementos. 
São eles: 

(a,b,c)(b,a,c)(c,a,b)(a,c, b) (b,c,a) (c, b, a) 

23. Fórmula do número de permutações 

Seja M o conjunto M = (a,, a,, ..., a) e indiquemos por P, o número de 
permutações dos m elementos de M. 

Temos: 
Fa = Aim 

logo: P. = m(m=-1)-(m=-2)-..-[m=(m= 1)] 

Em particular, se m = 1, é fácil perceber que P, = 1. 

24. Exemplo: 

De quantas formas podem 5 pessoas ficar em fila indiana? 

Notemos que cada forma de ficar em fila indiana é uma permutação das 5 
pessoas. O número de permutações (modos de ficar em fila indiana) será: 

P,=5:4:3:2:1=120 

Fundamentos de Matemática Elementar | 5 

ANÁLISE COMBINATÓRIA 

VII. Fatorial 

25. Afim de simplificar as fórmulas do número de arranjos e do número de permuta- 
ções, bem como outras que iremos estudar, vamos definir o símbolo fatorial. 

Seja m um número inteiro não negativo (m E N). Definimos fatorial de m (e 
indicamos por m!) por meio da relação: 
mi=m-(m-1)-(m-2)-..:3-2-1param=2 
11=1 
0!=1 
As definições 1! e O! serão justificadas posteriormente. 

26. Exemplo: 
31=3:2:1=6 
41=4-3:2:1=24 
51I=5:4:3:2-1=120 

27. O cálculo de m!, diretamente, torna-se trabalhoso à medida que aumenta. 
(10! = 3628800) 

Entretanto, muitos cálculos podem ser simplificados se notarmos que: 

N+M=(nN+Mn-(n=1):..:3:2:1=(n+4+9):n! 

n! 

28. Exemplos: 

1º) Calcular 

Temos: = = ua = 10 
2º) Calcular E 

Temos: a = 98 A = 90 

5 | Fundamentos de Matemática Elementar 

ANÁLISE COMBINATÓRIA 

x 121 
3º) Calcular Sar 

RD 12:11:10: — Bd O as 
SM anar — E “apa * 

29. As fórmulas do número de arranjos e do número de permutações também podem 
ser simplificadas com a notação fatorial. 

De fato: 
Pa=m(m-1):..:3:2:1=m! 
Mar meln= Dm =" + = 

E meim= Aos + 4 eb inte doe 

menino 

w| w 
N|N 
PlE 

m! 

Am mn 

E ticul ns 
m particular i=A, 

ea fórmula P, = ml! é válida Ym E N* 

e ainda: 
Am4=MmYme N* 

em particular | 
ET = mVYme Nx, 

, mb 
eafórmula A, ,= amar é válida VYmeN*,YvreN*comr<m. 

(m=1) 

EXERCÍCIOS 

41. Usando o diagrama de árvore, obtenha todos os arranjos dos elementos de 
M = (a, b, c, dj) tomados dois a dois. 

42. Calcule: 
a) Ass b) Ao O) Asa d) Ao 

Fundamentos de Matemática Elementar | 5 

43. 

44. 

45. 

46. 

47. 

48. 

49. 

50. 

51. 

ANÁLISE COMBINATÓRIA 

Em um campeonato de futebol, participam 20 times. Quantos resultados são pos- 
síveis para os três primeiros lugares? 

Dispomos de seis cores diferentes. Cada face de um cubo será pintada com uma 
cor diferente, de forma que as seis cores sejam utilizadas. De quantas maneiras 
diferentes isso pode ser feito, se uma maneira é considerada idêntica a outra, des- 
de que possa ser obtida a partir desta por rotação do cubo? 

Em um torneio (de dois turnos) do qual participam seis times, quantos jogos são 
disputados? 

Dispomos de 8 cores e queremos pintar uma bandeira de 5 listras, cada listra com 
uma cor. De quantas formas isso pode ser feito? 

Solução 

Cada maneira de pintar a bandeira consiste de uma sequência de cinco cores 
distintas (sequência, porque as listras da bandeira estão numa ordem) esco- 
lhidas entre as oito existentes. Logo, o número de sequências procurado é: 

Ao SEG SA oro 

n fatores 

Uma bandeira é formada de 7 listras, que devem ser pintadas de 3 cores diferen- 
tes. De quantas maneiras distintas será possível pintá-la de modo que duas listras 
adjacentes nunca estejam pintadas da mesma cor? 

Uma linha ferroviária tem 16 estações. Quantos tipos de bilhetes devem ser im- 
pressos, se cada tipo deve assinalar a estação de partida e de chegada, respecti- 
vamente? 

Designando-se seis cidades por A, B, C, D, E e F, determine o número de maneiras 
que permitem a ida de A até F, passando por todas as demais cidades. 

As 5 finalistas do concurso para Miss Universo são: Miss Japão, Miss Brasil, Miss 
Finlândia, Miss Argentina e Miss Noruega. De quantas formas os juízes poderão 
escolher o primeiro, o segundo e o terceiro lugares nesse concurso? 

Um cofre possui um disco marcado com os dígitos O, 1, 2, ..., 9. O segredo do cofre 
é formado por uma sequência de 3 dígitos. Se uma pessoa tentar abrir o cofre, 
quantas tentativas deverá fazer (no máximo) para conseguir abri-lo? (Suponha que 
a pessoa sabe que o segredo é formado por dígitos distintos.) 

Fundamentos de Matemática Elementar 

ANÁLISE COMBINATÓRIA 

52. 

53. 

54. 

55. 

De quantas maneiras um técnico de futebol pode formar um quadro de 11 jogado- 
res, escolhidos entre 22, dos quais 3 são goleiros e só o goleiro tem posição fixa? 

No jogo de loto, de uma urna contendo 90 pedras numeradas de 1 a 90, quatro 
pedras são retiradas sucessivamente; qual é o número de extrações possíveis, tal 
que a terceira pedra seja 80? 

Existem 10 cadeiras numeradas de 1 a 10. De quantas formas duas pessoas po- 
dem se sentar, devendo haver ao menos uma cadeira entre elas? 

Solução 
Inicialmente notemos que cada maneira de elas se sentarem corresponde a 
um par ordenado de números distintos escolhidos entre 1, 2, ..., 10. 

a pessoa À se senta na cadeira 2 
Exemplo: (2, 6) a pessoa B se senta na cadeira 6 
a pessoa A se senta na cadeira 6 

(6, 2) É pessoa B se senta na cadeira 2 
a pessoa A se senta na cadeira 3 
(3, 4) a pessoa B se senta na cadeira 4 

Inicialmente, calculemos o total de pares ordenados, que é igual a 

an de= 

Agora temos que excluir os pares ordenados cujos elementos sejam números 
consecutivos. São eles: 

(1, 2) (2,3) (3, 4)... (9, 10): 9 pares 

(2,1) (3,2) (4,3)... (10,9): 9 pares 

Ao todo, devemos excluir 9 + 9 = 18 pares. 

Logo, o número de maneiras de as pessoas se sentarem, havendo ao menos 
uma cadeira entre elas, é 90 — 18 = 72. 

E bastante importante o leitor notar a razão pela qual cada maneira é um par 
ordenado. 

( o] 

ti li 
senta-se senta-se 
A B 

Uma urna contém m bolas numeradas de 1 até m; r(r = m) bolas são extraídas suces- 
sivamente. Qual o número de sequências de resultados possíveis se a extração for: 

a) com reposição de cada bola após a extração? 
b) sem reposição de cada bola após a extração? 

Fundamentos de Matemática Elementar | 5 

56. 

57. 

58. 

59. 

60. 

ANÁLISE COMBINATÓRIA 

Uma urna | contém 5 bolas numeradas de 1 a 5. Outra urna Il contém 3 bolas nu- 
meradas de 1 a 3. Qual o número de sequências numéricas que podemos obter se 
extrairmos, sem reposição, 3 bolas da urna | e, em seguida, 2 bolas da urna Il. 

Existem duas urnas. A 1º com 4 bolas numeradas de 1 a 4e a 2º com 3 bolas 
numeradas de 7 a 9. Duas bolas são extraídas da 1º urna, sucessivamente e sem 
reposição, e em seguida 2 bolas são extraídas da 2º urna, sucessivamente e sem re- 
posição. Quantos números (de 4 algarismos) é possível formar nessas condições? 

Se Ae Bsão conjuntose *A = ne 4B = r, quantas funções f: A > B, injetoras, 
existem? (1 =<n=<r) 

Solução 
A=f(a,as,..,a 

Sejam | Ba Bá nd 
E = (030 1955 axo [8)]) 

Notemos que, se f é injetora, então f(a) f(a,) para todo a, + a; 

Por outro lado, cada função vai ser definida por uma ênupla de imagens, 
em que todos os elementos da ênupla devem ser distintos, pois a função é 
injetora. 

Por exemplo, uma das funções é definida pela ênupla de imagens. 
(ON RED) 

to 1 tt ti 
f(a,) f(a)) fla) fla, , 5) fla) 

Outra função é definida pela ênupla: 

(DE Rba O qua uh Rb e PDD 
fo 7 o 
fla) fa) Ha ta da) fla) 

Logo, o número de funções é o número de arranjos dos r elementos de B, 

tomados nan, istoé,A = E 
bi (rn) 

Qual é o número de funções injetoras definidas em A = (1, 2, 3) com valores em 
B=(0,1,2,3,4? 

Sejam A um conjunto finito com m elementos e |, = (1, 2, ..., n). Qual é o número 
de todas as funções definidas em |, com valores em A? 

5 | Fundamentos de Matemática Elementar 

ANÁLIS
```

## Termos recorrentes

número · elementos · quantas · arranjos · reposição · fundamentos · matemática · elementar · análise · combinatória · sequência · bolas

## Notas de reconstrução

- Removidas 3,486 marcas de digitalização e pontilhações de índice.
- Acentuação reparada onde o OCR substituiu caracteres por '?'.
- Expoentes reconstruídos em padrões algébricos simples (ex.: x2 → x²).
- Fórmulas complexas são refeitas e validadas na Fase 2 e na Fase 4.

# Capítulo 05 — ANÁLISE COMBINATÓRIA

## Metadados

- Livro: FME 5 — Fundamentos da Matemática Elementar
- Capítulo: 05
- Trecho OCR: caracteres 66,188–80,519
- Origem: texto OCR derivado do Archive.org (pós-processamento local)

## Sumário da estrutura

- 195. Considere as combinações de p elementos tomados m a m. Qual é a razão entre o
- 196. Calcule o número de combinações de 8 elementos, 3 a 3, que contêm um determi-
- 197. Qual é o número de combinações de n elementos p a p que contêm k elementos
- 36. Consideremos a palavra ANA e procuremos seus anagramas. Vamos indicar por
- 37. Vamos calcular o número de permutações que podemos formar quando alguns
- 38. Exemplos:
- 39. Caso geral
- 198. De quantas formas 8 sinais “+” e 4 sinais
- 199. Quantos números de 6 algarismos podemos formar permutando os algarismos 2,
- 200. Sobre uma mesa são colocadas em linha 6 moedas. Quantos são os modos possí-
- 201. Quantos anagramas existem da palavra AMARILIS?
- 203. Uma moeda é lançada 20 vezes. Quantas sequências de caras e coroas existem,

## Texto reconstruído

```text
sféricas existem, cada uma passando por 4 dos 20 
pontos dados? 

São dados 12 pontos em um plano, dos quais 5 e somente 5 estão alinhados. 
Quantos triângulos distintos podem ser formados com vértices em 3 quaisquer dos 
12 pontos? 

Fundamentos de Matemática Elementar | 5 

189. 

190. 

191. 

192. 

193. 

194. 

ANÁLISE COMBINATÓRIA 

Solução 
Cada combinação de 3 pontos, entre os 12 existentes, dá origem a um triân- 

gulo, com exceção das combinações de 3 pontos, tomados entre os 5 alinha- 
dos; logo, o número de triângulos que podem ser formados é: 

sngj-no 

São dadas 2 retas paralelas. Marcam-se 10 pontos distintos sobre uma e 8 pontos 
distintos sobre a outra. Quantos triângulos podemos formar ligando 3 quaisquer 
desses 18 pontos? 

Seja P o conjunto dos pontos de p retas (p = 2), duas a duas paralelas, de um 
plano. Seja Q o conjunto dos pontos de a(q = 2) retas, duas a duas paralelas do 
mesmo plano, concorrentes com as p primeiras. Calcule o número total de para- 
lelogramos de vértices pertencentes ao conjunto PM Q e de lados contidos no 
conjunto P U Q. 

Com as letrasa, e, i, 0, b, c, d, f, g, quantas palavras (com ou sem sentido) de 6 
letras distintas podem ser formadas, usando-se 3 vogais e 3 consoantes? 

De quantas maneiras diferentes podemos colocar os 4 cavalos de um jogo de xa- 
drez (2 brancos iguais e 2 pretos iguais) no tabuleiro do mesmo jogo (64 casas)? 

Obtenha o número de maneiras que nove algarismos O e seis algarismos 1 podem ser 
colocados em sequência de modo que dois algarismos 1 não apareçam juntos. 

Solução 

—0-0-0-0-0-0-0-0-0— 

Dispostos os nove zeros, existem 10 posições que os algarismos 1 podem 
ocupar (ver esquema acima). 

Como existem 6 algarismos 1, precisamos escolher 6 lugares entre os 10 
existentes. 

Isso pode ser feito de [E] = 210 modos. 

De quantas formas podemos alinhar em sequência p sinais “+” e q sinais “—” de 

un 

modo que 2 sinais “—” nunca fiquem juntos? 
(Observação: É dado que p + 1=q.) 

5 | Fundamentos de Matemática Elementar 

ANÁLISE COMBINATÓRIA 

195. Considere as combinações de p elementos tomados m a m. Qual é a razão entre o 
número de combinações em que figura um certo elemento e o número de combi- 
nações em que esse elemento não figura? 

196. Calcule o número de combinações de 8 elementos, 3 a 3, que contêm um determi- 
nado elemento. 

197. Qual é o número de combinações de n elementos p a p que contêm k elementos 
determinados? 

IX. Permutações com elementos repetidos 

36. Consideremos a palavra ANA e procuremos seus anagramas. Vamos indicar por 
A* o segundo A. Teremos, então: 

ANA*, AA*N, NAA*, NA*A, A*NA, A*AN 
(DD) (2) (3) (49) (5) (6) 
Notemos que as permutações: 
(1) e (5) são iguais; 
(2) e (6) são iguais; 
(3) e (4) são iguais. 
Na verdade, não temos 3! = 6 permutações distintas, mas apenas 3, que são: 

ANA, AAN, NAA. 

Essa diminuição do número de permutações decorreu do fato de termos duas 
letras iguais, Ae A, no conjunto das letras a serem permutadas. É intuitivo perceber que 
o fato de existirem letras repetidas para serem permutadas acarreta uma diminuição do 
número de permutações, em relação ao número que teríamos, se todas fossem distintas. 

37. Vamos calcular o número de permutações que podemos formar quando alguns 
elementos a serem permutados são iguais. 

1º caso: 

Consideremos n elementos, dos quais n, são iguais a a, e os restantes são todos 
distintos entre si e distintos de a,. 

Indigquemos por PA: o número de permutações nessas condições e calculemos 
esse número. 

Fundamentos de Matemática Elementar | 5 

ANÁLISE COMBINATÓRIA 

Cada permutação dos n elementos é uma ênupla ordenada de elementos em que 
devem figurar n, elementos iguais a a, e os restantes n — n, elementos distintos 

(= = = as). 

n elementos 

Façamos o seguinte raciocínio: das n posições que existem na permutação, vamos 
escolher n — n, posições, para colocar os elementos todos distintos de a,. 

n da 
Existem HE modos de escolher essas posições. 

1 
Para cada escolha de (n — n,) posições, existem (n — n,)! modos em que os (n — n,) 
elementos podem ser permutados. Logo, existem ao todo 

n mx” 
(nn) Oomt= cr 

formas de dispormos os elementos distintos de a,, na permutação. 
Uma vez colocados esses elementos distintos, a posição dos elementos repetidos 

a, fica determinada (de uma só forma) pelos lugares restantes. 

: n! n . j ; 
Logo, existem Ei permutações com n, elementos iguais a a,. Isto é: 
4! 

Exemplo: 
Quantos anagramas existem da palavra PARAGUAI? 

A, A > elementos repetidos 
Temos 

A, 
|» 
R 
G 
U 

8! 
n=8en,=3,logo:P;=5,=8:7:6:5:4=6720 

5 | Fundamentos de Matemática Elementar 

ANÁLISE COMBINATÓRIA 

2º caso: 
Consideremos n elementos, dos quais n, são iguais a a;: a, a, .., à, ; 
AS ue é lol 
n, são iguais a a,: à,, a,, ..., A, n, 
O 

n 
2 
e os restantes são todos distintos entre si e distintos de a, e de a,. Indiquemos por Ph N² 
o número de permutações, nessas condições. 

Cada permutação dos n elementos é uma ênupla ordenada de elementos em 
que devem figurar n, elementos iguais a a,, n, elementos iguais a a, e osn—n, —n, 
elementos restantes. 

Façamos o seguinte raciocínio: das n posições que existem na permutação, vamos 

escolher n — n, lugares para colocar todos os elementos, com exceção dos iguais a a,. 

: n 

Existem = modos de escolher esses lugares. Para cada uma dessas escolhas, 
2 

existirão PP: | modos em que os n— n, elementos podem ser permutados (lembremos 
à 
que, dos elementos a serem permutados agora, existem n, iguais a a,). Ao todo 

existirão 

e (n=n5bn; no! nn! 
formas de arranjar na permutação todos os elementos, com exceção de a,. 

Uma vez arranjados esses elementos na permutação, as posições dos elementos 
repetidos a, ficam determinadas (de uma única forma) pelos lugares restantes. Logo, 
ne n! E E ; : : 
existirão NA permutações com n, elementos iguais a a, e n, elementos iguais a a,. 
A. 

. 1º 
Isto é: 

38. Exemplos: 

1º) Quantos anagramas existem da palavra ANALÍTICA? 

Fundamentos de Matemática Elementar | 5 

ANÁLISE COMBINATÓRIA 

A,A, A > elementos repetidos 
|, 1 —> elementos repetidos 

Temos 

n=9,n,=3,n,=2 
Logo: 

32 — 
P5 

“32 — 30240 

2º) Existem 6 bandeiras (de mesmo formato), sendo 3 vermelhas e 3 brancas. 
Dispondo-as ordenadamente num mastro, quantos sinais diferentes podem ser emitidos 
com elas? 

Temos: 

Cada sinal emitido consta de uma permutação de 6 bandeiras, sendo 3 iguais a V 
(vermelhas) e 3 iguais a B (brancas). 

Istoé; n=6,n,=3,n; = 3. 

Portanto, existem: 

P$3 = = 20 sinais. 

6! 
313! 

39. Caso geral 

Consideremos n elementos, dos quais: 

mM sao Iguais aa, 
n, São iguais a a, 

n, Sao iguais a a, 

Usando raciocínio análogo ao do 1º e do 2º caso, poderemos calcular o número de 
permutações nessas condições (indicado por Ppt "2 ==») através da fórmula: 

5 | Fundamentos de Matemática Elementar 

ANÁLISE COMBINATÓRIA 

É fácil ver que no caso particular de n, = n, =... = n, = 1 obteremos: 

que é o número de permutações de n elementos distintos. 

EXERCÍCIOS 

un 

198. De quantas formas 8 sinais “+” e 4 sinais 
sequência? 

podem ser colocados em uma 

199. Quantos números de 6 algarismos podemos formar permutando os algarismos 2, 
2,3, 9/9,0? 

200. Sobre uma mesa são colocadas em linha 6 moedas. Quantos são os modos possí- 
veis de colocar 2 caras e 4 coroas voltadas para cima? 

201. Quantos anagramas existem da palavra AMARILIS? 

202.Se uma pessoa gasta exatamente um minuto para escrever cada anagrama da 
palavra ESTATÍSTICA, quanto tempo levará para escrever todos, se não deve parar 
nenhum instante para descansar? 

203. Uma moeda é lançada 20 vezes. Quantas sequências de caras e coroas existem, 
com 10 caras e 10 coroas? 

204. Quantos números de 7 algarismos existem nos quais comparecem uma só vez os 
algarismos 83, 4, 5 e quatro vezes o algarismo 9? 

205. Uma urna contém 3 bolas vermelhas e 2 amarelas. Elas são extraídas uma a uma 
sem reposição. Quantas sequências de cores podemos observar? 

206. Um homem encontra-se na origem de um sistema cartesiano ortogonal. Ele só 
pode dar um passo de cada vez, para norte (N) ou para leste (L). Quantas trajetó- 
rias (caminhos) existem da origem ao ponto P(7, 5)? 

Solução 
Notemos inicialmente que o homem terá que dar, ao todo, 7 + 5 = 12 passos 
(7 para leste e 5 para norte). 

Cada trajetória possível é, então, uma sequência de 12 elementos, sendo 
TLebBN. 

Fundamentos de Matemática Elementar | 5 

207. 

208. 

209. 

210. 

X. 

A trajetória da figura é: 

(IL, INI (5), 1; (LL, (9), E, (N), [Mo (LS, (E) 

Se quisermos o número de trajetórias, te- 
remos que calcular então o número de per- 
mutações com repetição de 12 elementos, 
sendo 7 Le 5 N. Portanto, o número de 
trajetórias é: 

Pp” Du á 

Uma cidade é formada por 16 quarteirões dispos- 
tos segundo a figura ao lado. Uma pessoa sai do 
ponto P e dirige-se para o ponto Q pelo caminho 
mais curto, isto é, movendo-se da esquerda para a 
direita, ou de baixo para cima. Nessas condições, 
quantos caminhos diferentes ela poderá fazer? 

ANÁLISE COMBINATÓRIA 

234 56 

AFAPAR 

Um homem encontra-se na origem de um sistema cartesiano ortogonal. Ele só 
pode dar um passo de cada vez, para norte (N) ou para leste (L). Partindo da 
origem e passando pelo ponto A(3, 1), quantas trajetórias existem até o ponto 

B(5, 4)? 

Com os dígitos 1, 2,3,4,5,6, 7, de quantas formas podemos permutá-los de modo 
que os números ímpares fiquem sempre em ordem crescente? 

Uma classe tem a meninas e b meninos. De quantas formas eles podem ficar em 
fila, se as meninas devem ficar em ordem crescente de peso, e os meninos tam- 
bém? (Suponha que 2 pessoas quaisquer não tenham o mesmo peso.) 

Complementos 

Partições ordenadas 

40. Consideremos um conjunto A e K subconjuntos de A não vazios A,, As, ..., A, tais 

que: 
a) ANA =D (para i + )) 
b) AUAU..UA=SA 
5 | Fundamentos de Matemática Elementar 

ANÁLISE COMBINATÓRIA 

Chamaremos de partição ordenada do conjunto A a sequência de conjuntos: 

(A AE aos A) 

41. Exemplos: 

Seja A = (1,2,3,4, 5, 6) e consideremos as sequências de conjuntos 

1) (11, 2); 13, 43; (9, 6)) 
2) ((1,2,3, 4); (5); (0)) 
3) (2510, 2, 3,4); 15, 6)) 
4) ((1,2, 3); (3,4, 5); (6)) 
5) ((1, 2); (3,4, 5). 

Nos exemplos (1) e (2) temos partições ordenadas de A, ao passo que em (3) não 
temos, pois 2 faz parte da sequência. Em (4) não temos uma partição ordenada, pois 
(1,2,3])N (3,4,5) + Ze finalmente, em (5),(1,2)U (3,4,5]) £ A. 

Observemos que a partição ordenada ((1, 2); (3, 4); (5, 6)) é diferente da partição 
ordenada ((5, 6); (3, 4); (1, 2)), pois cada partição, sendo uma sequência de conjuntos, 
depende da ordem deles. 

42. Podemos resolver alguns problemas combinatórios com auxílio do conceito de 
partição ordenada. 

Exemplo: 

De quantas maneiras podemos colocar 10 pessoas em três salas, A, Be C, de 
modo que em A fiquem 4 pessoas, em B fiquem 3 pessoas e em C também 3 pessoas? 

Notemos que cada modo de distribuir as 10 pessoas corresponde a uma partição 
ordenada do tipo: 

pessoas na pessoas na | pessoas na 
sala A sala B sala € 

Para calcularmos o número de partições ordenadas, façamos o seguinte 
raciocínio: 

Escolhemos 4 entre 10 pessoas para ficarem em A. Isto pode ser feito de E 
maneiras. 

Fundamentos de Matemática Elementar | 5 

ANÁLISE COMBINATÓRIA 

Em seguida, entre as 6 pessoas restantes, escolhemos 3, para ficarem em B. Isto 
pode ser feito de o maneiras. 

As 3 pessoas restantes podem ser escolhidas de E = 1 maneira (isto é, as 
pessoas da sala C ficam determinadas). 

Ora, cada combinação de pessoas em A gera (5) maneiras de dispor 3 pessoas 
em B. 
Logo, o número total de partições é: 

10) (6) 401 6 10! 
(4) (a)- 2161 "3131 — araiap — 4200 

Isto é, existem 4200 modos de dispormos as 10 pessoas nas 3 salas. 

Partições não ordenadas 

43. Consideremos um conjunto A e K subconjuntos de A não vazios A,, A,, ..., A, tais 
que: 

a) ANA, = 9 (para i + )) 
PEA UAU UA SA 

Chamaremos de partição não ordenada de A a família: 

(Ap Ass ve. A) 
44. Exemplo: 
Seja o conjunto: A = (1,2,3,4,5, 6) e consideremos as famílias: 
1) ((1,2,3),(4,5,60)) é uma partição. 
2) (1,2), (3,4,5,6) é uma partição. 
3) (1, 2); (3) não é uma partição. 
4) ((1,2,3, 4);(3,4,5,6)) não é uma partição. 

45. Alguns problemas combinatórios podem ser resolvidos com este conceito. 

Exemplo: 

De quantos modos 12 pessoas podem ser distribuídas em 3 grupos, tendo cada 
grupo 4 pessoas? 

Consideremos, para fixar ideias, 3 grupos, A,, A, e A,. 

5 | Fundamentos de Matemática Elementar 

ANÁLISE COMBINATÓRIA 

Notemos que a ordem em que figuram pode ser qualquer uma que teremos a 
mesma distribuição em 3 grupos. Estamos então interessados no número de partições 
não ordenadas do tipo: 

a 

grupo A, grupo A, grupo A, 

Para calcularmos o número de partições não ordenadas, façamos o seguinte 
raciocínio: 
1º) Calculemos o número de partições ordenadas 

(+, PART Ap — -, TE — +, 9 >) 

que, com o raciocínio do exemplo anterior, sabemos ser: 

12 8 Mo 
(a) (a) (a) = as0s0 
2º) Cada grupo de 3! = 6 partições ordenadas dá origem à mesma partição não 
ordenada. 

3º) Logo, o número de partições não ordenadas será: 

34650 

a ONA ÉS) 

Soluções inteiras não negativas de uma equação linear 

46. Consideremos a equação linear x + y = 7 e encontremos seu número de soluções 
inteiras não negativas. 

Por tentativas, encontramos: 
(0, 7); (1, 6); (2, 5); (3, 4); (4, 3); (9, 2); (6, 1); (7,0) 

Ao todo temos 8 soluções inteiras não negativas. 

41. Agora, se tivermos a equação x + y + Zz = 7, resolvendo por tentativas, o trabalho 
será muito grande, e corremos o risco de “esquecer” alguma solução. 

Um raciocínio alternativo seria o seguinte: 

Temos que dividir 7 unidades em 3 partes ordenadas, de modo que fique em cada 
parte um número maior ou igual a zero. 

Fundamentos de Matemática Elementar | 5 

ANÁLISE COMBINATÓRIA 

Indiquemos cada unidade por um ponto. Então, elas serão representadas por: 

Como queremos dividir as 7 unidades em 3 partes, vamos usar duas barras para 
fazer a separação. 

Cada modo de dispormos os pontos e as barras dará origem a uma solução. Por 
exemplo: 

e º e e º e º 
3 2 2 
. . . . . . . 
1 4 2 
. . . . . . . 
2 0 5 
. . . . . . . 
3 4 0 
7o 

Ora, co
```

## Termos recorrentes

elementos · número · iguais · existem · pessoas · podem · partição · distintos · permutações · pontos · quantos · fundamentos

## Notas de reconstrução

- Removidas 3,486 marcas de digitalização e pontilhações de índice.
- Acentuação reparada onde o OCR substituiu caracteres por '?'.
- Expoentes reconstruídos em padrões algébricos simples (ex.: x2 → x²).
- Fórmulas complexas são refeitas e validadas na Fase 2 e na Fase 4.

# Capítulo 06 — SEQUÊNCIAS

## Metadados

- Livro: FME 4 — Fundamentos da Matemática Elementar
- Capítulo: 06
- Trecho OCR: caracteres 88,386–104,117
- Origem: texto OCR derivado do Archive.org (pós-processamento local)

## Sumário da estrutura

- 61. 1º) Se M é de ordem n = 1, então det M é o único elemento de M.
- 62. 2º) Se M é de ordem n = 2, então det M é o produto dos elementos da diago-
- 63. 3º) Se M é de ordem n = 3, isto é,
- Pri Sa
- 252. Calcule os determinantes:
- 260. Calcule os determinantes pela regra de Sarrus:
- 2641. Calcule o valor do determinante D = | 3 logs 125 log; 25
- 262. Se somarmos 4 a todos os elementos da matriz A = |4 4 m|» cujo determi
- 263. Determine x tal que:
- 264. Determine x tal que:
- 265. Determine o conjunto solução da equação |0 3º 2]=
- 266. Se 0 <x< 27, determine o menor valor de x tal que: O —senx cotgx |=0.

## Texto reconstruído

```text
grandes expoentes da “álgebra 

MP/LEEMAGE/AFP 

Arthur Cayley (1821-1895). 

britânica” do século XIX, com quem estabeleceu sólida amizade, consolidada 
até por áreas de pesquisa comuns, como a teoria dos invariantes. Em 1863 
aceita convite para ocupar uma nova cadeira de matemática pura criada em 
Cambridge, à testa da qual ficou até a morte (salvo um semestre de 1882, em 
que deu cursos nos Estados Unidos). 

Em volume de produção matemática, em todos os tempos, Cayley tal- 
vez só seja superado por Euler e Cauchy. E, embora sua obra seja bastante 
diversificada, foi no campo da Álgebra, com a grande facilidade que tinha para 
formulações abstratas, que mais se sobressaiu. Assim, por exemplo, deve-se 
a ele, num artigo de 1854, a noção de grupo abstrato. (Galois, que introdu- 
zira o termo grupo em 1830, com o sentido atual, só considerara grupos de 
permutações.) Outra contribuição importante de Cayley, iniciada em 1843, é a 
geometria analítica n-dimensional, em cuja elaboração utiliza determinantes e 
coordenadas homogêneas como instrumentos essenciais. 

O início da teoria das matrizes remonta a um artigo de Cayley de 1855. 
Diga-se de passagem, porém, que o termo matriz já fora usado, com o mesmo 
sentido, cinco anos antes por Sylvester. Nesse artigo, Cayley fez questão de 
salientar que, embora logicamente a ideia de matriz preceda a de determinan- 
te, historicamente ocorreu o contrário: de fato, os determinantes já eram usa- 
dos há muito na resolução de sistemas lineares. Quanto às matrizes, Cayley 
introduziu-as para simplificar a notação de uma transformação linear. Assim, 
em lugar de 

b 

x =ax+b Ea a 
| à escrevia (x,y) | ] (x,y). 

y'=c+dy 

A observação do efeito de duas transformações sucessivas sugeriu-lhe 
a definição de produto de matrizes. Daí chegou à ideia de inversa de uma 
matriz, o que obviamente pressupõe a de elemento neutro (no caso, a matriz 
idêntica). Curiosamente, foi só num outro artigo, três anos depois, que Cayley 
introduziu o conceito de adição de matrizes e o de multiplicação de matrizes 
por escalares, cnamando inclusive a atenção para as propriedades algébricas 

dessas operações. 

Ao desenvolver a teoria das matrizes, como outros assuntos, a grande 
preocupação de Cayley era com a forma e a estrutura em Algebra. O século XX 
se encarregaria de encontrar inúmeras aplicações para suas matrizes. 

Determinantes 

I. Introdução 

A teoria dos determinantes teve origem em meados do século XVII, quando 
eram estudados processos para resolução de sistemas lineares de equações. 
Hoje em dia, embora não sejam um instrumento prático para resolução de siste- 
mas, os determinantes são utilizados, por exemplo, para sintetizar certas expres- 
sões matemáticas complicadas. 

II. Definição de determinante (n <= 3) 

Consideremos o conjunto das matrizes quadradas de elementos reais. Seja 
M uma matriz de ordem n desse conjunto. Chamamos determinante da matriz M (e 
indicamos por det M) o número que podemos obter operando com os elementos de 
M da seguinte forma: 
61. 1º) Se M é de ordem n = 1, então det M é o único elemento de M. 

M = [341] > det M = am 

Exemplo: 
M = [6] > det M = 6. 

Podemos também indicar o determinante de M pelo símbolo |a,,|, isto é, colo- 
cando uma barra vertical de cada lado de M. 

Fundamentos de Matemática Elementar | 4 

DETERMINANTES 

62. 2º) Se M é de ordem n = 2, então det M é o produto dos elementos da diago- 
nal principal menos o produto dos elementos da diagonal secundária. 

à al 

M= 11 12 > det M = Eee Bi= ad,» 429» 

ad dy Así As 

ek o 
Exemplos: 
3 sd 
=3-2-4(—1)=10 

4 2 

cos x senx 
=Cos x'Ccos y-—sen x:sen y=cos (x+y) 

sen y COsy 

63. 3º) Se M é de ordem n = 3, isto é, 

a... |, definimos: 
23 

detM —- ama: azz+as'azz' az tag: az azo— Ag Ao" Ag — AM" 
“dos * à32 — do" do * das 

Podemos memorizar esta definição da seguinte forma: 

a) Repetimos, ao lado da matriz, as duas primeiras colunas. 

b) Os termos precedidos pelo sinal (6) são obtidos multiplicando-se os 
elementos segundo as flechas situadas na direção da diagonal principal: 

dq * do² * à33, dy² * dos * d34, dya * dos * Ago. 

c) Os termos precedidos pelo sinal (O) são obtidos multiplicando-se os 
elementos segundo as flechas situadas na direção da diagonal secundária: 

—dia * do2* d34, TA * doz* da2; —A4o * dos * das. 

4 | Fundamentos de Matemática Elementar 

DETERMINANTES 

a a Ass) “Aga 

31 32 a 

Este dispositivo prático é conhecido como regra de Sarrus para o cálculo de 
determinantes de ordem 3. 

Exemplo: 
13 4 
5 2-3|=4-9+80-8+12-30=49 
14 2 
134 “3 
es 
5 As 52 
14 2/1. 4 

Ss 
Pri Sa 

=8 12:30 4-9 80 

Uma outra forma de memorizar a 
definição é a indicada ao lado. 

Os termos precedidos pelos sinal 
(&) são obtidos multiplicando-se os ele- 
mentos segundo as trajetórias indica- 
das. 

Os termos precedidos pelo sinal 
O) são obtidos multiplicando-se os ele- 
mentos segundo as trajetórias indicadas. 

252. Calcule os determinantes: 

: o. = 2 13 7 a 3 1 
2 À 11 5 5 2 
2 

Fundamentos de Matemática Elementar | 4 

2583. 

254. 

255. 

256. 

257. 

258. 

259. 

DETERMINANTES 

Calcule os determinantes: 
SB A = BO * o) 2-senx 3-cos x 
sen y cos y 1-2-cosx 3:senx+2 
b) sen x -— cos x 
cos x sen x 
Calcule os determinantes: 
loga logb 
a) : i b) 2m? 2m! -m 
= — m mê 
2 4 

Sendo A = (ai) uma matriz quadrada de ordem 2 e aj =) — i², qual é o determi- 
nante da matriz A? 

Determine x tal que: 
a) 2x 3x+2 Si 
1 x 

b 2x KZ = 
4x+Db 3x—1 
Determine o número de raízes reais distintas da equação: 
2-4 
E =0 
—-1 x 

Sendo x e y, respectivamente, os determinantes das matrizes não singulares 

a b —2a 2c y 
e , Calcule 2. 
c d —3b 3d x 

Calcule os determinantes pela regra de Sarrus: 
110 13 2 —3 1 7 
Mio 10 b)|-1 0-2 | 21-3 
014 2 5 d 54 2 

4 | Fundamentos de Matemática Elementar 

DETERMINANTES 

260. Calcule os determinantes pela regra de Sarrus: 

9 741 O a c 2. =. 0 
a) |>2 443 bD) |-c O b O) im na 
5 3 6 a b O 3 5 4 

2 log; 5 logs O 
2641. Calcule o valor do determinante D = | 3 logs 125 log; 25 
8 log, 27 log, 243 

1253 
262. Se somarmos 4 a todos os elementos da matriz A = |4 4 m|» cujo determi 
1 4/4 
nante é D, qual é o determinante da nova matriz? 
263. Determine x tal que: 
1 Xx x 1 x 1 1 x 2 
a) |2 2x 1|-=0 lg. =& siso 6% j=so se =ale 
3 x+1 1 1 —-x 1 1-3 —x 
264. Determine x tal que: 
x—1 2 x e a 
0 dl. muda ' x 
3x x+1 2x e 
o 3 1 
265. Determine o conjunto solução da equação |0 3º 2]= 
4 3º 3 
— senx —8 = 
266. Se 0 <x< 27, determine o menor valor de x tal que: O —senx cotgx |=0. 
(0) (0) Cos x 

267. Qual o valor do determinante associado à matriz 

sen? x  sen'x (o) 
= 2 
A=|cos?x cos y seny|” 

ré (0) rê 

E Fundamentos de Matemática Elementar | 4 

DETERMINANTES 

268. Chama-se traço de uma matriz quadrada a soma dos elementos da diagonal 
principal. Sabendo que o traço vale 9 e o determinante 15, calcule os elemen- 
tos x ey da matriz: 

1 253 
O x z 
O O y 

III. Menor complementar e complemento 
algébrico 

64. Definição 
Consideremos uma matriz M de ordem n = 2; seja aj um elemento de M. 

Definimos menor complementar do elemento a;, e indicamos por Di, como sendo o 
determinante da matriz que se obtém suprimindo a linha i e a coluna j de M. 

65. Exemplos: 

4 
1º) SejaM=|5 e calculemos Di4, D54, Das. 
e 

[90 0 ne 0 6) 
ND o Bs 

Temos: 

0-3 —4 

e 4 então Du = [1 dj= oa 
2 
5 Bd 
4 3 4 
1— 5 | então Do, = se = -—6 
3 2 
3 3 2 
4 3 4 
| a -|3 4] 
, então Da, = =11 
2º 2º 5 x | 
3—2 

5 6 

2º) SejaM = 
71 8 

| e calculemos D45, Doo. 

4 | Fundamentos de Matemática Elementar 

DETERMINANTES 

Temos: [O] eso = |7]=7 
Ff 8 

É d)| então O =/5]-5 

O! 22 

66. Definição 

Consideremos uma matriz de ordem n = 2; seja aj um elemento de M. Defini- 
mos complemento algébrico do elemento a; (ou cofator de a;) e indicamos por A, 
o número (—1)' *1 - Dj. 

Exemplo: 
2 3-2 
SejaM = |4 4 g|ecalculemos As, Aso, Ass. 
753 
Temos: 
gs 
1 a glenãoa,=(-a1|2 8|=-28 
o 5 3 
2—O—2 
1 4º glentãoa,=(-af+2|1 E = 53. 
| 73 
7 5 3 
> pa 
1 a Blenãoas=(-1ts|1 E = 23, 
| 75 
7 5 3 

IV. Definição de determinante por recorrência 
(caso geral) 
Já vimos no tópico Il a definição de determinante para matrizes de ordem 1,2 

e 3. Vamos agora, com o auxílio do conceito de cofator (complemento algébrico), dar 
a definição de determinante, válida para matrizes de ordem n qualquer. 

Fundamentos de Matemática Elementar | 4 

DETERMINANTES 

Seja M uma matriz de ordem n. Definimos determinante da matriz M e indica- 
mos por det M, da seguinte forma: 

1º) Se M é de ordem 1, então M = [a,;;j]e det M = ay. 

2º) Se M é de ordem n = 2, então 

de Co sap 
M=| à à» -. ale definimos det M = = 
am Ano Am 

= 94": Am + as * As + as * Así +... + ant 

Isto é, o determinante de uma matriz de ordem n = 2 é a soma dos produtos 
dos elementos da 1º coluna pelos respectivos cofatores. 

67. Exemplos: 

G[T8 Auto Ay ma (-1F-]a|ro (1% -|b]=ad-te 
Cc 

que coincide com a definição particular dada em ll. 

a| b c 
2) |dle f|l-a-A,+d-A,+-Ay = 
g) hi 

2 Chega 

= a(ei — hf) — d(bi — ch) + g(bf — ce) = aei + dhc + gbf — gce — dbi — ahf, que 
coincide com a definição dada no tópico II (ver regra de Sarrus). 

4 | Fundamentos de Matemática Elementar E 

DETERMINANTES 

312-2 
0/20 4 
3) lola 4 9[73AutO An +O As +O: Ag = 
(o) (o) (o) 
13 3 
20 4 
=3-:A, = 3-(-12-|4 1-2]=3-62=186 
13 B 
211 
2114 3 
4) do o [144 +2An+3:A,+4- Ay = 
43 2-5 
ias Bia A pd d Ha q 
-|/00 2|-2-.|00 2|+3-[1 4 3|=-4-|[1 4 3|- 
3 2-5 3 2-5 3 2-5 0-0. 

= 20-2-2)+3-(-48)-4-(14)= 176 

68. Observação 

Notemos que, no exemplo 4º, quando a 1º coluna não possui zeros, o cálculo 
do determinante torna-se trabalhoso. Isso pode ser atenuado, de certo modo, com o 
teorema que veremos a seguir. 

269. Seja 
24 3 
M= 52 1 ; calcule D54, Dos, Dos. 
=3. 1. =1 

[SO ) Fundamentos de Matemática Elementar | 4 

270. Encontre o cofator de 3 na matriz 

M= 
=, rá 2 4 
Oo 3 -1 -10 
271. Seja 
1=1 0 0 
0 2-2 14 
M= a q ; calcule D43, Dog, Da5, Das. 
4 5 76 
272. Seja 
1 0 2 0 
ida O O |. calcule D Dis, Das: D 
5 2-1 2] 11, Do², Dag, Dag 
—-2 2 0 3 

DETERMINANTES 

2 1.3 
273. Determine o cofator do elemento ass damatrizA = |1 2 1. 
012 

274. Calcule os determinantes das matrizes abaixo, usando a definição: 

BO NH 
SR NO 
QOHOoON 
Oo ore 

BN EN 

oO wo B 

V. Teorema fundamental (de Laplace) 

O determinante de uma matriz M, de ordem n = 2, é a soma dos produtos dos 
elementos de uma fila qualquer (linha ou coluna) pelos respectivos cofatores. 

4 | Fundamentos de Matemática Elementar 

DETERMINANTES 

Isto é, 
a) Se escolhermos a coluna j da matriz M 

Então: det M = dj 2 Aj + do % Ao; Re dE An Ê Anie 

b) Se escolhermos a linha i da matriz M 

dq do « da 
dm do, 2n 
dq dp din 
a a a 

Então: det M = am : Au + ao * Ajp EO E a din * Ain 

Portanto, para calcularmos um determinante, não precisamos necessariamen- 
te dos elementos da 1º coluna e seus cofatores; qualquer outra coluna (ou linha) e 
seus cofatores permitem o cálculo. 

Para calcularmos o determinante: 

121 1 
2 1 4/3 
Ss O O 2 
4 3 2/5 

Se escolhermos a 3º linha para seu cálculo, obteremos: 

det M=3:A, +0- A +0- A +2:A=3: Ay +2: As e só teremos que cal 
(o) (o) 
cular dois cofatores, em vez de quatro se usássemos a definição. 
Concluímos então que, quanto mais zeros houver em uma fila, mais fácil será 

o cálculo do determinante se usarmos essa fila. Em particular, se a matriz tiver uma 
fila de zeros, seu determinante será zero. 

Fundamentos de Matemática Elementar | 4 

DETERMINANTES 

= EXERCÍCIOS 

275. Calcule os determinantes das matrizes abaixo utilizando o teorema de Laplace. 

1 2 3 4/5 

Eae oo O a-1 3 1 
PM o 4 | dg M=|0 0 b 2/3 
o E O o 0Oocgr 
Oo o 0Oo 0d 
x 0 O O OO 
O a b 1 a y Oo 0o0o 
o 1 0 0 | 
b) M= erimi=) PES O O 
aa Ob mn p x O O 
1 bao b cc d ey O 
b cc d ez 
4d 3. 2% O 
qm=|* + O 2 
2301 
0213 

276. Desenvolva o determinante abaixo, pelos elementos da 2º coluna. 

O a 1 0 
1 = 

D= b-1 41 

2. € Q=4 

O d 1 0 
1 2 3 4 2 
(0) 1 (0) Oo 0 
271.Calcule o valor do determinante | O 4 (0) 2 Í 
O —5 5 1 4 
(0) 1 O -—-1 2 

4 | Fundamentos de Matemática Elementar 

DETERMINANTES 

a (0) (o) (0) x 
c 0) d x e 
278. Determine o valor de x para que |f O x O 0O|<-32 
g x h i j 
x (0) (0) (0) (0) 

VI. Propriedades dos determinantes 
A definição de determinante e o teorema de Laplace permitem-nos o cálculo de 

qualquer determinante; contudo, é possível simplificar o cálculo com o emprego de 
certas propriedades. Vejamos quais são elas. 

69. (P,) Matriz transposta 
Se M é a matriz de ordem n e M! sua transposta, então det Mt = det M. 

Demonstração: 
Vamos usar o princípio da indução finita. 

12 parte 
Paran = 1,a propriedade é imediata. 

22 parte 
Suponhamos a propriedade válida para matrizes de ordem (n — 1) e provemos 
que ela também será válida para determinantes de ordem n. Temos: 

dq do dg d4n Da Di Dis Din 
dy do dog on Db Doo Dos 2n 
t — 
M dg dg das aan M 31 Da Das Dan 
am ano àn3 am by Dro Dna Di 

em que D; =aj viela, 2, seis nh evijefi, 2, aj lia 
detM = a, A ta, A tas Ag +... tag Am (pela 1º coluna) 

detMt= Db, Ay +Dyo Ao +bya Aa +... + Di, AL, (pela 45 linha) 

Fundamentos de Matemática Elementar | 4 

DETERMINANTES 

Mas, por definição de matriz transposta, temos: 
dq =D, 924 =Di², 334 =Di³, -.., Ag =D, 

e pela hipótese da indução temos: 
Ag = AGA = Ao Ag = Ag co A = An 

Logo det Mt = det M. 
Portanto, a propriedade é válida para matrizes de ordem n, Yn = 1. 

Exemplos: 

5 sl=|á = -3 

2 5 4 5 

1 0 2 1 3. 4 

3 1 3)=1/0 1 5|=9 
4 5 2 232 

A importância dessa propriedade reside no fato de que toda propriedade válida 
para as linhas de uma matriz também é válida para as colunas e vice-versa. 

70. (P,) Fila nula 

Se os elementos de uma fila qualquer (linha ou coluna) de uma matriz M de 
ordem n forem todos nulos, então det M = O. 

Demonstração: 

Suponhamos que a jésima coluna de M tenha todos os elementos nulos, isto é: 

dy; 

As; as Ani 0 

Desenvolvendo o determinante por esta fila, temos: 

detM=0-A, +O-A, +... +O-A, =0 

Exemplos: 
1 5 x O 
Doreo [Ps 
4 2 z 0 
e 23 1t0 

4 | Fundamentos de Matemática Elementar 

DETERMINANTES 

11. (P;) Multiplicação de uma fila por uma constante 

Se multiplicarmos uma fila qualquer de uma matriz M de ordem n por número 
K, o determinante da nova matriz M' obtida será o produto de K pelo determinante 
de M, isto é, detM' = K- det M. 

Demonstração: 
Seja 
dq dy din am d42 din 
à à on am ds aon 
RE [een a ijifis | SS ssa 
ag aj din au K dj K a; 
am ano am am an> am 

Notemos que os cofatores dos elementos da i-ésima linha de M são os mes- 
mos que os da i-ésima linha de M'. 
Desenvolvendo det M e det M' pela i-ésima linha, temos: 

detM = ay 'A, tap As +t...taç' An ( 
detM' =K-a, Ay +Kas Ap +... +K a, An (1) 

De (Il) e (Il) concluímos que det M' = K- det M. 
A demonstração seria análoga se tomássemos uma coluna de M. 

Exemplos: 
7. 14 49 1 2 7 
1º) e 5 2/=7:|3 5 2 
(0) 2 7 O 2 7 
) 7 2 1 Y 2 
2º) 10 28 8|=5-:|2 28 8|= 
45) 7 16 3 u 16 

[ 96) Fundamentos de Matemática Elementar | 4 

DETERMINANTES 

1 1 2 1 1 il. 
3 1 |16 3 1 8 
1 1 1 1 1 1 
=5.7:2-2:|1 2 2) =140-|1 2 92 
3 1 3 8 
1 2 3 A 2K IR 1 2 I3K 
39) K:I|4 5 6! = |4 5 6|=|4 5 I6K 
7 8 5; 7 8 5 71 8 IBK 

4º) SeA é matriz de ordem n, então: 
det(a- A)=o”- deta, 

12. (P,) Troca de filas paralelas 

Seja M uma matriz de ordem n = 2. Se trocarmos de posição duas filas 
paralelas (duas linhas ou duas colunas), obteremos uma nova matriz M' tal que 
det M' = —detM. 

Demonstração: 

Vamos usar o princípio da indução finita. 

1º parte 
Provemos que a propriedade vale para n = 2. 

dm dy 

Seja M = - | det M = a id do² = a12 e do4- 

21 22 

Trocando de posiç
```

## Termos recorrentes

matriz · determinantes · determinante · ordem · matemática · matrizes · definição · elementos · fundamentos · elementar · então · calcule

## Notas de reconstrução

- Removidas 4,338 marcas de digitalização e pontilhações de índice.
- Acentuação reparada onde o OCR substituiu caracteres por '?'.
- Expoentes reconstruídos em padrões algébricos simples (ex.: x2 → x²).
- Fórmulas complexas são refeitas e validadas na Fase 2 e na Fase 4.

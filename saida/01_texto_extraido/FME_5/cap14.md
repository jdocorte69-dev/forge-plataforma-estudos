# Capítulo 14 — ANÁLISE COMBINATÓRIA

## Metadados

- Livro: FME 5 — Fundamentos da Matemática Elementar
- Capítulo: 14
- Trecho OCR: caracteres 195,167–209,498
- Origem: texto OCR derivado do Archive.org (pós-processamento local)

## Sumário da estrutura

- 127. Distribuição binomial
- 128. Exemplo 1:
- 129. Exemplo 2:
- 130. observação:
- 481. Um casal planeja ter 5 filhos. Admitindo que sejam igualmente prováveis os resul-
- 97. 480
- 98. 720 maneiras diferentes
- 99. 672 números
- 118. [(m + 9IP

## Texto reconstruído

```text
nto que nos interessa é: 

A, MA,MASNAÇN AE que é((K, K, C,C, CO) 
Logo, 
PANA NANANA=5"5'5'5'555 

É fácil perceber neste exemplo que a probabilidade de qualquer quíntupla 

ordenada de caras e coroas é 5 pois em qualquer quíntupla ordenada (>, =, =, —, —) 
a probabilidade P ((., =, =, —, -)) será: 

RA OR O 1 

Suponhamos, agora, o evento sair exatamente uma cara. Isto é: 
((K, C,C,€,C), (C,K,C,C,C), (C,C,K, C,C), (€C,C,C, K,C), (€,C,C,C, K) 
Portanto, a probabilidade deste evento é: 

1 1 q. 1 1.5 

q "mg a 
Se quisermos a probabilidade de o evento revelar exatamente duas caras, teremos 
que calcular o número de quíntuplas ordenadas em que existem duas caras (K) e três 
coroas (C). Ora, a Análise Combinatória nos ensina que este número é o número de 
permutações de 5 elementos, com dois repetidos (iguais a K) e três repetidos (iguais a 
C), isto é: 
5! 

2,3 — 

P$º = 

ET 

Logo, a probabilidade desejada é ar 

5 | Fundamentos de Matemática Elementar 141 

PROBABILIDADE 

127. Distribuição binomial 

Os exemplos anteriores podem ser generalizados, segundo o que se conhece por 
distribuição binomial. 

Consideremos então uma sequência de n ensaios de Bernoulli. Seja p a 
probabilidade de sucesso em cada ensaio e q a probabilidade de fracasso. 

Queremos calcular a probabilidade P,, da ocorrência de exatamente K sucessos, 
nos n ensaios. É evidente que K E (0, 1, 2,..., n). 

Sejam os eventos: 
A, : ocorre sucesso no i-ésimo ensaio, P(A) = p. 
AS: ocorre fracasso no i-ésimo ensaio, P(AS) =q. 

O evento “ocorrem exatamente K sucessos nos n ensaios” é formado por todas as 
ênuplas ordenadas em que existem K sucessos (S) e n - K fracassos (F). O número 
de ênuplas ordenadas nessas condições é: 

Kn-K n! =(n 
Pm “—“K(n-K! («) 

A probabilidade de cada ênupla ordenada de K sucessos (S) e (n - K) fracassos 
(F) é dada por: 

pepe..cp . q: q:..:ag = pf. qr 
E, ii, 
K vezes (n — K) vezes 

pois qualquer ênupla ordenada deste tipo é a interseção de K eventos do tipo A, e 
(n - K) eventos do tipo A£, e, como esses eventos são independentes, a probabilidade 
da interseção dos mesmos é o produto das probabilidades de cada um, isto é, p* - qn-K, 
Por exemplo, a ênupla (S,S,sS,...,S, F, F,..., F) é igual à interseção 

K n-K 

ANA o MNA MAL ag us MÃE 

cuja probabilidade é p* - qn-K. 
Logo, se cada ênupla ordenada com exatamente K sucessos tem probabilidade 

n 

p“. qr-Ke existem (x 

Jenuptas desse tipo, a probabilidade P, de exatamente K sucessos 

nos n ensaios será: 

142 Fundamentos de Matemática Elementar | 5 

PROBABILIDADE 

128. Exemplo 1: 

Uma urna tem 4 bolas vermelhas (V) e 6 brancas (B). Uma bola é extraída, observada 
sua cor e reposta na urna. O experimento é repetido 5 vezes. Qual a probabilidade de 
observarmos exatamente 3 vezes bola vermelha? 

Em cada ensaio, consideremos como sucesso o resultado “bola vermelha”, e 
fracasso “bola branca”. Então: 

4 2 6 

3 
Foo nico qe 

Estamos interessados na probabilidade P,. Temos: 
p-DP(3Y. 5 8 9720 
3 3 5) 5) 3121 125 25 3125 

129. Exemplo 2: 

Numa cidade, 10% das pessoas possuem carro de marca A. Se 30 pessoas são 
selecionadas ao acaso, com reposição, qual a probabilidade de exatamente 5 pessoas 
possuírem carro da marca A? 

Em cada escolha de uma pessoa, consideremos os resultados: 

Sucesso: a pessoa tem carro marca A. 
Fracasso: a pessoa não tem carro marca A. 

Então: p — 0,1, q = 0,9, n = 30. Estamos interessados em P,. Temos: 

Pp; = (5) (0,1) - (0,9) = 0,102 
130. observação: 
O problema de obter K sucessos em n ensaios de Bernoulli pode ser encarado 

como um problema cujo espaço amostral é O = (0,1, 2,..., n), isto é, cada elemento de 
92 é o número de sucessos em n ensaios de Bernoulli e a distribuição de probabilidade 

é dada por: 
n 
Pa = (x) E pK á qr-k 

Tal distribuição é chamada binomial, pois cada probabilidade Px é dada pelo 
termo geral do binômio de Newton (p + q)”. 

5 | Fundamentos de Matemática Elementar 143 

PROBABILIDADE 

466. 

467. 

468. 

469. 

470. 

471. 

472. 

473. 

474. 

EXERCÍCIOS 

Considere uma distribuição binomial com n = 10 e p = 0,4. Calcule: 
a) Po b) Pá o) Po d) Pa 
Uma moeda é lançada 6 vezes. Qual a probabilidade de observarmos exatamente 

duas caras? 

Um dado é lançado 5 vezes. Qual a probabilidade de que o “4” apareça exatamen- 
te 3 vezes? 

Um estudante tem probabilidade p = 0,8 de acertar cada problema que tenta 
resolver. Numa prova de 8 problemas, qual a probabilidade de que ele acerte exa- 
tamente 6? 

Uma pessoa tem probabilidade 0,2 de acertar num alvo toda vez que atira. Supon- 
do que as vezes que ela atira são ensaios independentes, qual a probabilidade de 
ela acertar no alvo exatamente 4 vezes, se ela dá 8 tiros? 

A probabilidade de que um homem de 45 anos sobreviva mais 20 anos é 0,6. De 
um grupo de 5 homens com 45 anos, qual a probabilidade de que exatamente 4 
cheguem aos 65 anos? 

Um exame consta de 20 questões tipo certo ou errado. Se o aluno “chutar” todas 
as respostas, qual a probabilidade de ele acertar exatamente 10 questões? (Indi- 
que somente os cálculos.) 

Uma moeda é lançada 2n vezes. Qual a probabilidade de observarmos n caras e 
n coroas? 

Uma moeda é lançada 6 vezes. Qual a probabilidade de observarmos ao menos 
uma cara? 

Solução 
1 1 

Temosin=6,p=54=5 

Estamos interessados em calcular: P, + P, +P, + P, + P; + Ps 
Como: 

Eae Ras to SR, ate PR 

poe sp pis Casei po am ndo o pisado [EE 

Fundamentos de Matemática Elementar | 5 

475. 

476. 

477. 

478. 

479. 

480. 

5 | 

PROBABILIDADE 

logo, basta calcularmos Pp. 

Temos: 

(= 
Fo 2 64 

Logo, a probabilidade desejada é: 1 - es 

64" 64 

Uma moeda é lançada 10 vezes. Qual a probabilidade de observarmos pelo menos 
8 caras? 

Um time de futebol tem probabilidade p = de vencer todas as vezes que joga. Se 
disputar 5 partidas, qual a probabilidade de que vença ao menos uma? 

Uma moeda é lançada 9 vezes. Qual a probabilidade de observarmos no máximo 3 
caras? 

Solução 
áL 1 

Temosin=9,p=54=5 

Estamos interessados em calcular: P, + P, + P, + Pa. Então: 

o a 

p-(MAP(LP So. 
Lts) o 2) — EB 
p (MAPA 36 
acto) 2 2) 512 
p (O (Ar(A BA 
9 la) BZ > 512 
130 
Logo, Po + Py + Po + Pa = io — 0,254, 

Em 4 ensaios de Bernoulli, a probabilidade de sucesso em cada um é p = 0,4. Qual 
a probabilidade de observarmos no mínimo 3 sucessos? 

Um teste tipo certo ou errado consta de 6 questões. Se um aluno “chutar” as res- 
postas ao acaso, qual a probabilidade de que ele acerte mais do que 2 testes? 

Numa cidade, 30% da população é favorável ao candidato A. Se 10 eleitores forem 
selecionados ao acaso, com reposição, qual a probabilidade de que mais da meta- 
de deles seja favorável ao candidato A? (Indique os cálculos.) 

Fundamentos de Matemática Elementar 145 

PROBABILIDADE 

481. Um casal planeja ter 5 filhos. Admitindo que sejam igualmente prováveis os resul- 
tados: filho do sexo masculino e filho do sexo feminino, qual a probabilidade de o 

casal ter: 

a) 5 filhos do sexo masculino? 
b) 

c) no máximo um filho do sexo masculino? 
d) 

exatamente 3 filhos do sexo masculino? 

o 5º filho do sexo masculino, dado que os outros 4 são do sexo feminino? 

LEITURA 

Laplace: a teoria das probabilidades 
chega ao firmamento 

Hygino H. Domingues 

"É notável que uma ciência que começou com considerações sobre jogos 
de azar pudesse ter se elevado ao nível dos mais importantes assuntos do co- 
nhecimento." Com efeito, foi isso o que efetivamente ocorreu com a teoria das 
probabilidades, inserida na citação. Mas, deve-se acrescentar a bem da verda- 
de, como consequência do gênio e do esforço de grandes matemáticos que se 
dedicaram ao assunto, entre os quais o próprio autor da frase: Pierre-Simon de 
Laplace (1749-1827). 

Laplace nasceu de uma família de humil- 
des camponeses da Normandia, na França. A 
inteligência brilhante de que era dotado foi o ins- 
trumento que propiciou a ele ir rompendo, des- 
de cedo e a passos largos, com os vínculos de 
sua origem. Assim é que aos 16 anos de idade 
já estava na Universidade de Caen, onde deve- 
ria cursar teologia. Mas logo se inclinou para a 
matemática, sua verdadeira vocação. Formado, 
dirige-se a Paris com cartas de apresentação a 
Jean D'Alembert (1717-1783), o mais eminente 

e = e: á 
matemático francês da época. Como estas não | Pierre-Simon Laplace (1749-1827). 

146 

SPL/LATINSTOCK 

funcionassem, resolveu apresentar-se à sua maneira: enviou a D'Alembert um 
substancioso artigo de sua autoria sobre os princípios gerais da mecânica. La- 
place não apenas foi recebido por D'Alembert mas, também, graças à influência 
deste, em 1769 era indicado professor da Escola Militar de Paris e em 1773, com 
24 anos de idade apenas, para a seleta Academia Real de Ciências. 

Assim, foi já como matemático de valor reconhecido e com a carreira cientí- 
fica em plena ascensão que Laplace viveu o período mais tumultuado da história 
de seu país: a revolução francesa, o período napoleônico e a restauração monár- 
quica. Poderia alguém em sua posição, ainda mais com ambições pessoais como 
tinha, deixar de se envolver com as paixões que agitaram aqueles dias? A crítica 
que se faz a Laplace quanto a seu comportamento nesse período diz respeito à 
sua volubilidade política: em nenhuma das fases (embora antagônicas) deixou de 
colher honrarias ou posições. Menos mal para a matemática e a mecânica, nas 
quais pôde trabalhar sem maiores contratempos. 

A obra-prima de Laplace é o Traité de mecanique celeste, publicada ao 
longo de 26 anos (1799-1825), em cinco volumes que totalizam 2000 páginas. 
Reunindo as grandes descobertas até então realizadas no campo da mecânica 
celeste com sua enorme contribuição ao assunto, Laplace completou o trabalho 
de Newton no sentido de mostrar que todos os movimentos dos corpos do siste- 
ma solar são dedutíveis da lei da gravitação. 

Newton não conseguira provar a estabilidade do sistema solar, o que o 
levou a cogitar da intervenção divina de tempos em tempos para mantê-lo em 
ordem. Laplace provou essa estabilidade. Daí por que, talvez, certa feita, a uma 
observação de Napoleão sobre a ausência de menções a Deus em sua obra, teria 
respondido não precisar dessa hipótese. 

A mecânica celeste contribuiu fortemente para que a teoria das probabi- 
lidades viesse a ser uma das preocupações científicas de Laplace. Afinal, era 
preciso, entre outras coisas, determinar a probabilidade de erros em dados de 
observações experimentais. Mas outros tópicos, como por exemplo a demografia, 
também o levaram para esse campo. Assim, de um conjunto de memórias ligadas 
ao tema, a primeira de 1774, resulta em 1812 o clássico Théorie analytique des 
probabilités. 

Esta obra, além de reunir e sistematizar boa parte do que era previamente 
conhecido sobre o assunto, traz contribuições próprias de Laplace, muitas das 
quais serviram de fonte até para avanços em outros campos da matemática, 
como a ideia de função geradora e a de transformada de Laplace. Um dos pontos 
altos do livro é a aplicação da probabilidade ao método dos quadrados mínimos, 
justificando a conveniência de seu uso. 

Como astrônomo, a teoria das probabilidades não era um fim para Laplace, 
mas apenas um meio. Mesmo assim ele é, sem dúvida, um dos grandes nomes 
desse campo que com tanto talento ajudou a criar. 

147 

125 números 

40 refeições 200 

30 formas possíveis 10 

30 posições 46656 resultados possíveis 
7200 8100000 

56 possibilidades a) 8 letras b) 510 letras 
132 possibilidades 160 percursos diferentes 

600 formas de se vestir 256 caminhos 

42 alternativas de compra 64 maneiras 

1048576 formas ar+U(b+1(c+1(d+ 1) 
Aproximadamente 1000000. 28 peças 

4294967296 palavras (n+1)-(n+2) 

1023 possibilidades m o 

no possiniidedes (AA, ABB, ABAA, ABAB, BB, BAA, BABB, 

31 possibilidades BABA) 
308915776 anagramas. Sim. 40 formas 
243 votos possíveis No máximo duas voltas. 

Fundamentos de Matemática Elementar | 5 

38. 

39. 

40. 

41. 

42. 

43. 

6) 

.3:A 

«a m b) 

R$ 1000,00; R$ 3000,00 ou R$ 5000,00 
11 possibilidades de jogo 
m=r+4 

)» (b, a), (b, c) (b, d), (c, a), 

(a, b), (a, c),( (b 
b) )» (d, b), (d, o) 

a,c),(a,d 
(c, b), (c, d), (d, a 

a) 120 
b) 5040 

c) 20 
d) 132 

6 840 

- 30 maneiras 

«30 

FS po 

« 240 

. 24 

- 60 

«. 120 

19, 10 

- Ago 3 — 681384 

- 360 possibilidades 
«12 

« 60 

soaf 

. n! funções bijetoras 
. 504 

- 202 

. 480 placas 

. 280 

Fundamentos de Matemática Elementar 

. a) 17280 

RESPOSTAS DOS EXERCÍCIOS 

. 125 

. 3537 

. 18 

RR 6? 

« 60 

. 180 

. 16 

« 60 

. 96 

. 198 números 
. 48 

. 58º posição 
. 13 -3!8 

- 5040 

«(n=1+ 1)-Aç “A 

r m=k,n-r 

. 480 anagramas 

« 64 números inteiros 
2 (ND? 

. 10! e 7! anagramas 
. 288 

. 120 anagramas 
.8! 

- 5040 

b) 5760 

« 28800 
«72 

« 144 possibilidades 

149 

RESPOSTAS DOS EXERCÍCIOS 

97. 480 

98. 720 maneiras diferentes 
99. 672 números 

101.11! 

102.3 colares 

103.(m — 1)! m! possibilidades 

106.6 
107.12 
108.8 = (7) 
109.m = 7 
110.5 = (12) 
111.n=5 

112.Demonstração 

113.Demonstração 

(2n)! 
2". n! 

115.a) b) (n!)2 

116.K!- K² 
417.(n-n)(n-r+ 1) 
118. [(m + 9IP 
119.(m + 1)!-1 
120.n! 
121.Demonstração 
122.Demonstração 
123.Demonstração 

124.a) 15 b) 15 c) 1 

125.(7,8), (7,9), (7,0), (8, 9), (8, O), (9, 0) 

126.001! + 
24 -(n-4) 

150 

127.10 

128.p = 1 
129.p=-00up=1 
130.504 
131.n=8 

132.x = 5 
133.n=4 

134.m =7 
135.f(a) = 109 
136.m = 9 

137.p = 5 

138.5 = ((13, 2)) 
139.Demonstração 
141.C,, q = 270725 
142.10 

143.C, , = 10 
144.848 
145.1023 

146.91 

148.C,, C59=7 

149.C, , = 126 
150.C, q = 56 
151.n=7 
152.15 
153.140 

Fundamentos de Matemática Elementar | 5 

15 15 
154.3) E o) 5 Ê 
15 20) [15 
ms) elo) 
155.112 

156.3 136 comissões 

157.55 

8 8). 
158.(4) AF (3) = 98 
159.112 

161.a) 165 comissões b) 60 comissões 

50 10 ada 
162 ç] (a | possibilidades 

163.(2) . u = 350 possibilidades 

164.4512 subconjuntos 

165.a) 3 possibilidades 
b) 10 possibilidades 
c) 15 possibilidades 

166.2080 modos 
167.140 possibilidades 
168.700 comissões 
169.267960 

170.280 comissões 

171.630 
300 300 300 
172 3 d+ > bl 1 Jromes 
173.1680 
174.840 

175.10 retas 

RESPOSTAS DOS EXERCÍCIOS 

176.C,3=4 
I 
177.C, = E 
n3 3(n-3) 
11 
1r(7)=5s 

179.176 retas 
180.a) 28 cordas 
b) 5
```

## Termos recorrentes

probabilidade · vezes · possibilidades · exatamente · laplace · matemática · sucessos · fundamentos · elementar · ensaios · caras · observarmos

## Notas de reconstrução

- Removidas 3,486 marcas de digitalização e pontilhações de índice.
- Acentuação reparada onde o OCR substituiu caracteres por '?'.
- Expoentes reconstruídos em padrões algébricos simples (ex.: x2 → x²).
- Fórmulas complexas são refeitas e validadas na Fase 2 e na Fase 4.

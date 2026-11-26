# Capítulo modelo — Matemática

**Código didático:** M1 · **Tema:** Ordem das operações: por que $2 + 3 \times 4$ não é 20 · **Nível:** Zero · **Área:** Matemática

**Na plataforma FORGE:** este tema aparece como "Aritmética e números" ou "Números e operações". O código M1 é uma **etiqueta didática** deste Prompt Mestre, não um identificador da aplicação (seção 18.3 do `PROMPT_MESTRE.md`).

Este arquivo é o padrão ouro da trilha de Matemática do Prompt Mestre. Ele mostra na prática como aplicar as seções 3, 4, 6, 13 e 18 do `PROMPT_MESTRE.md`: analogia antes da definição, porquê de cada regra, exemplos resolvidos, visualização, erros, exercícios com gabarito e campos finais para a plataforma. Para gerar outro capítulo de Matemática, copie esta estrutura, nunca o texto; escreva tudo com as suas próprias palavras e confira cada conta.

**Validação executada:** todas as contas dos exemplos, dos exercícios, do gabarito e das questões foram refeitas em uma segunda ordem; as três saídas da atividade de execução real foram conferidas.

---

## M1.1 Objetivos de aprendizagem

Ao final deste capítulo você será capaz de:

1. Calcular expressões numéricas com adição, subtração, multiplicação e divisão respeitando a ordem das operações.
2. Explicar, com as próprias palavras, por que $2 + 3 \times 4$ vale 14 e não 20.
3. Identificar a função dos parênteses e usá-los para alterar o valor de uma expressão.
4. Aplicar a regra da esquerda para a direita quando multiplicação e divisão aparecem juntas.
5. Reconhecer erros de ordem em contas prontas e corrigi-los.
6. Verificar um resultado por um segundo caminho de cálculo.
7. Escrever uma expressão numérica a partir de uma situação do cotidiano.

## M1.2 Pré-requisitos

**Nenhum.** Este é um capítulo introdutório do módulo didático M1, que na plataforma aparece como "Aritmética e números" ou "Números e operações". Você precisa apenas saber ler em português e contar até 20. Toda palavra nova é definida antes de ser usada.

Duas definições para começar: um **número** é a ideia usada para contar ou medir quantidades; os símbolos $0, 1, 2, 3, \ldots$ que escrevemos são **numerais**. Uma **operação** é uma ação feita com números: a **adição** junta quantidades, a **subtração** retira uma quantidade, a **multiplicação** soma várias vezes o mesmo valor e a **divisão** reparte uma quantidade em partes iguais.

### Miniteste de prontidão

Responda antes de continuar. As respostas estão logo abaixo.

1. Quanto é $3 + 2$?
2. Quanto é $3 \times 2$? Explique como soma repetida.
3. O que significa $6 \div 2$?

<details>
<summary>Respostas do miniteste</summary>

1. $3 + 2 = 5$: juntamos três unidades e duas unidades.
2. $3 \times 2 = 2 + 2 + 2 = 6$: três grupos de dois.
3. Repartir seis unidades em dois grupos iguais; cada grupo tem três unidades, então $6 \div 2 = 3$.

Se você acertou as três, pode seguir. Se errou alguma, leia as duas definições acima mais uma vez. Nenhum conteúdo deste capítulo exige mais do que isso.

</details>

**Erros comuns nesta seção:**

| Erro | Correção rápida |
|---|---|
| Confundir número com numeral | O número é a ideia da quantidade; o numeral é o símbolo escrito, como $3$ |
| Ler $3 \times 2$ como $3 + 2$ | $3 \times 2$ é $2 + 2 + 2$, isto é, três grupos de dois |

## M1.3 Motivação: por que isso existe?

Imagine que duas pessoas recebem o mesmo bilhete: `2 + 3 × 4`. A primeira lê da esquerda para a direita e soma primeiro: $2 + 3 = 5$, depois $5 \times 4 = 20$. A segunda multiplica primeiro: $3 \times 4 = 12$, depois $2 + 12 = 14$. As duas leram os mesmos símbolos, chegaram a valores diferentes e nenhuma errou a conta: o problema está na **leitura**.

Entre os séculos XVI e XVII, com o avanço da álgebra escrita em símbolos, passou-se a registrar contas longas em uma única linha. Para que um mesmo desenho de símbolos tivesse sempre o mesmo significado, foi necessário combinar uma regra de leitura. Dessa necessidade nasceu a **ordem das operações**: um acordo sobre qual conta fazer primeiro. Ele não é uma lei da natureza; é uma convenção, como dirigir sempre do mesmo lado da pista. O acordo se espalhou pelas escolas, pelas calculadoras científicas e pelas linguagens de programação, e é por isso que um mesmo cálculo dá o mesmo resultado em lugares diferentes.

Vale uma observação honesta: algumas calculadoras muito simples executam as contas na ordem em que você aperta as teclas e podem mostrar 20 para `2 + 3 × 4`. Calculadoras científicas e programas seguem a convenção deste capítulo e mostram 14. Isso não contradiz a regra; mostra que notação e execução são coisas distintas.

**Pausa de aprendizagem ativa.** Antes de continuar, preveja: se uma calculadora simples mostra 20 e uma científica mostra 14 para a mesma sequência de teclas, qual das duas está seguindo a convenção deste capítulo? Anote a sua resposta.

A calculadora científica. Ela espera a expressão completa ser digitada e aplica a prioridade das operações; a calculadora simples executa cada conta no instante em que a tecla é apertada.

> 🌍 **No mundo real:** uma planilha que soma o preço de dois lápis avulsos ao custo de três pacotes com quatro lápis precisa dar um único total. Se cada pessoa lesse `2 + 3 × 4` do seu jeito, o mesmo carrinho teria dois valores diferentes, e ninguém conseguiria conferir a conta.

**Erros comuns nesta seção:**

| Erro | Correção rápida |
|---|---|
| Decidir a ordem pela posição dos sinais na linha | Procurar primeiro os parênteses e depois $\times$ e $\div$ |
| Achar que a calculadora dispensa a convenção | Conferir sempre se o aparelho respeita a precedência antes de aceitar o resultado |

## M1.4 Explicação "para 5 anos"

Coloque no bolso 2 lápis soltos. Ao lado, deixe 3 caixas, cada uma com 4 lápis dentro. Pergunta: quantos lápis você tem ao todo?

Você não soma os lápis soltos com o número de caixas. Você abre as caixas: cada uma tem 4 lápis, então são $4 + 4 + 4 = 12$ lápis embalados. Só depois você junta os 2 lápis soltos: $12 + 2 = 14$. A conta que descreve isso é $2 + 3 \times 4$: o $3 \times 4$ é um pacote de três grupos de quatro, e o pacote é resolvido antes de entrar na soma.

Agora mude a história. Suponha que você queira multiplicar por 4 o total de lápis, inclusive os 2 soltos. Escreva $(2 + 3) \times 4$: primeiro você coloca os 2 lápis dentro da mesma caixa dos outros 3 grupos, chega a 5 lápis por grupo e multiplica por 4, obtendo 20. Os parênteses funcionam como uma caixa maior: o que está dentro vira uma só coisa antes de o resto da conta continuar.

**Pausa de aprendizagem ativa.** Antes de ler o próximo parágrafo, responda: se os 2 lápis soltos entrassem dentro das caixas, a conta continuaria sendo $2 + 3 \times 4$? Anote a sua resposta.

Não. Passaria a ser $(2 + 3) \times 4$, porque os 2 lápis teriam virado parte de cada grupo multiplicado por 4. Mudar a história exige mudar a notação.

> 💡 **Intuição:** multiplicar é arrumar grupos iguais. Os grupos precisam ser fechados antes de você juntar o que ficou solto por fora. Os parênteses são a ordem de "feche este grupo primeiro".

**Onde a analogia funciona:** ela mostra por que $2 + 3 \times 4$ e $(2 + 3) \times 4$ descrevem situações diferentes. Em um caso, os 2 lápis ficam fora dos grupos; no outro, entram dentro. A diferença entre 14 e 20 deixa de ser mistério.

**Onde a analogia quebra:** se as unidades não combinam, como "2 lápis e 3 caixas de maçãs", a imagem dos lápis não ajuda. Se aparecerem dívidas ou temperaturas abaixo de zero, será preciso o módulo M2, dos números com sinal. Por fim, a analogia pode sugerir que a ordem é "natural", mas ela é um acordo: outra ordem funcionaria se todos concordassem com ela.

**Erros comuns nesta seção:**

| Erro | Correção rápida |
|---|---|
| Contar as caixas como se fossem lápis | Contar os lápis dentro de cada caixa: $4 + 4 + 4 = 12$ |
| Abrir as caixas só depois de juntar os lápis soltos | Fechar o bloco $3 \times 4$ antes de somar o $2$ |

## M1.5 Explicação aprofundada

### M1.5.1 As palavras da conta

Uma **expressão numérica** é uma sequência de números ligados por sinais de operação que pede um cálculo. A sequência $2 + 3 \times 4$ é uma expressão numérica. O **valor** da expressão é o número obtido quando todas as contas pedidas foram feitas. A **notação** é o conjunto de símbolos usados para escrever a conta, e uma **convenção** é um acordo compartilhado por quem escreve e por quem lê essa notação.

Os sinais $+$ e $-$ indicam, respectivamente, adição e subtração. Os sinais $\times$ e $\div$ indicam multiplicação e divisão. Os **parênteses**, escritos como $($ e $)$, são sinais de agrupamento: tudo o que está entre eles deve ser calculado antes do que está fora. Quando há mais de um par, começamos pelos **parênteses internos**, isto é, os que estão mais dentro da expressão.

> 🔁 **Revisão rápida:** Lembra do capítulo M1? Aqui ele aparece de novo: multiplicar é somar o mesmo valor várias vezes. Assim, $3 \times 4 = 4 + 4 + 4 = 12$. Essa ideia, vista no começo deste módulo, é a que usaremos para conferir os resultados do capítulo.

#### Contar e por que $1 + 1 = 2$

Antes da prioridade das operações, vale entender o ato de contar. Contar é associar, um a um, os objetos de uma coleção aos numerais $1, 2, 3, \ldots$: o primeiro objeto recebe o numeral 1, o segundo recebe o 2, o terceiro recebe o 3, e cada objeto seguinte recebe o numeral imediatamente posterior. Essa associação chama-se **correspondência um a um**. O último numeral usado indica a quantidade de objetos.

O número 2 não é um nome escolhido ao acaso: ele é o **sucessor** do 1, isto é, o número que vem logo depois de 1 na contagem. Somar 1 a um número é avançar um passo nessa contagem. Portanto, $1 + 1$ significa "avance um passo a partir do 1", e esse passo chega exatamente ao 2.

Se você quiser ir mais fundo, essa ideia foi organizada no final do século XIX nos **axiomas de Peano**, regras básicas que constroem os **números naturais** (os números $0, 1, 2, \ldots$ usados para contar) a partir do zero e da noção de sucessor. Escrevendo $S(n)$ para o sucessor de $n$, temos $1 = S(0)$ e $2 = S(1)$. A adição é definida por duas regras: $n + 0 = n$ e $n + S(m) = S(n + m)$. Aplicando à nossa conta:

$$1 + 1 = 1 + S(0) = S(1 + 0) = S(1) = 2.$$

> 🧠 **Por quê?** Por que definir a adição assim? Porque "somar 1" passa a coincidir com "avançar um passo na contagem". Se a definição fosse diferente, a conta escrita deixaria de combinar com o ato de contar que você aprendeu antes de saber escrever números.

Isto é uma simplificação: a construção formal dos números naturais é mais detalhada, mas a ideia central, sucessor e um passo adiante, é exatamente essa.

### M1.5.2 A fila de prioridade

A regra pode ser escrita como três degraus. O degrau 1 é o mais urgente; o degrau 3 é o último.

| Degrau | O que fazer | Sinais | Exemplo |
|---|---|---|---|
| 1 | Calcular o que está dentro dos parênteses | $($ e $)$ | $(5 + 2) \times 3 = 7 \times 3 = 21$ |
| 2 | Multiplicar e dividir, da esquerda para a direita | $\times$ e $\div$ | $18 \div 3 \times 2 = 6 \times 2 = 12$ |
| 3 | Somar e subtrair, da esquerda para a direita | $+$ e $-$ | $12 - 5 + 2 = 7 + 2 = 9$ |

A expressão **precedência** significa prioridade entre operações: qual delas é feita primeiro. No degrau 2, multiplicação e divisão têm a mesma precedência. No degrau 3, adição e subtração também têm a mesma precedência.

A expressão **associatividade** descreve o agrupamento das contas. Dizemos que uma operação é associativa quando mudar o agrupamento não altera o resultado. A adição é associativa: $(2 + 3) + 4 = 5 + 4 = 9$ e $2 + (3 + 4) = 2 + 7 = 9$. A subtração não é: $12 - 5 - 2 = 7 - 2 = 5$, mas $12 - (5 - 2) = 12 - 3 = 9$. A divisão também não é: $24 \div 6 \div 2 = 4 \div 2 = 2$, mas $24 \div (6 \div 2) = 24 \div 3 = 8$.

> 🧠 **Por quê?** Por que os parênteses vêm primeiro? Porque foram criados justamente para dizer "este grupo é uma só coisa". Se a regra ignorasse os parênteses, eles não teriam servidão nenhuma e não poderiam mudar o valor de uma expressão.

> 🧠 **Por quê?** Por que "da esquerda para a direita" dentro do mesmo degrau? Porque é um critério único para desempatar operações de igual prioridade. Sem ele, $12 - 5 + 2$ poderia valer $9$ ou $5$, dependendo de quem lesse. Com o critério, há um só valor: $12 - 5 = 7$, depois $7 + 2 = 9$.

> ⚠️ **Cuidado:** a frase "multiplicação vem antes de adição" não quer dizer "multiplicação vem antes de tudo". Em $18 \div 3 \times 2$, quem vem primeiro é a divisão, porque ela está mais à esquerda. Se as duas operações do degrau 2 estivessem trocadas, em $18 \times 2 \div 3$, primeiro viria a multiplicação.

> 🔁 **Revisão rápida:** Lembra do capítulo C1? Aqui ele aparece de novo. Lá, um programa segue instruções em uma ordem definida; aqui, as contas também seguem uma ordem definida, só que decidida pelo tipo de sinal, e não pelo lugar onde o sinal aparece na linha.

### M1.5.3 O motivo da regra

A **propriedade distributiva** da multiplicação sobre a adição afirma que, para quaisquer números $a$, $b$ e $c$,

$$a \times (b + c) = a \times b + a \times c.$$

Antes de usar a fórmula, veja um caso concreto. Tome $a = 3$, $b = 2$ e $c = 4$. Do lado esquerdo, $3 \times (2 + 4) = 3 \times 6 = 18$. Do lado direito, $3 \times 2 + 3 \times 4 = 6 + 12 = 18$. Os dois lados dão 18. Em palavras: multiplicar uma soma por 3 dá o mesmo que multiplicar cada parte por 3 e somar os resultados.

**Pausa de aprendizagem ativa.** Antes de ler o próximo parágrafo, calcule mentalmente $3 \times (2 + 4)$ e $3 \times 2 + 3 \times 4$ e anote os dois valores.

Os dois valores são 18. O primeiro vem de $3 \times 6 = 18$; o segundo, de $6 + 12 = 18$. Se você encontrou valores diferentes, refaça as duas contas antes de continuar.

Agora voltamos ao bilhete do começo. Ao escrever $2 + 3 \times 4$, o autor da conta quer dizer "2 mais três grupos de 4". O 2 fica de fora dos grupos; a multiplicação já está fechada antes da soma. Se lêssemos $(2 + 3) \times 4$, estaríamos dizendo "quatro grupos de 5", em que o 2 também foi multiplicado por 4. Pela distributividade, $(2 + 3) \times 4 = 2 \times 4 + 3 \times 4 = 8 + 12 = 20$. São duas histórias diferentes, escritas com dois desenhos diferentes de símbolos.

> 🧠 **Por quê?** Por que adotar um acordo em vez de deixar cada pessoa escolher? Porque a notação serve para comunicar. Se o leitor não souber qual conta vem primeiro, a expressão não transmite uma ideia única. A convenção existe para que o autor e o leitor cheguem ao mesmo valor sem precisar conversar.

> 🧠 **Por quê?** Por que os parênteses podem mudar tanto o resultado? Porque eles alteram o que é multiplicado. Em $10 - (2 + 3)$, a soma $2 + 3$ vira um bloco e o resultado é $10 - 5 = 5$. Sem parênteses, $10 - 2 + 3 = 8 + 3 = 11$. O número 5 do fim é subtraído de 10 em um caso e somado em outro.

### M1.5.4 Um método seguro para resolver

Antes de continuar, pare e calcule mentalmente $2 + 3 \times 4$. Anote o seu chute. A confirmação vem agora.

O método dos blocos tem três passos:

1. Procure parênteses e resolva o que está dentro deles.
2. Circule mentalmente as multiplicações e divisões; faça-as da esquerda para a direita.
3. Circule as adições e subtrações restantes; faça-as da esquerda para a direita.

Aplicando ao bilhete:

$$2 + 3 \times 4 = 2 + 12 = 14.$$

Bloco A: $3 \times 4 = 12$, pelo degrau 2. Bloco B: $2 + 12 = 14$, pelo degrau 3. Não há parênteses, então o degrau 1 não aparece.

**Verificação por outro caminho:** $3 \times 4$ é $4 + 4 + 4$, que dá 12; somar 2 a 12 dá 14. Os dois caminhos concordam.

> ⚠️ **Cuidado:** não acrescente parênteses "para ajudar". Escrever $(2 + 3) \times 4$ quando a conta original é $2 + 3 \times 4$ muda a pergunta. Se quiser registrar a sua leitura sem mudar o valor, escreva $2 + (3 \times 4)$: aí os parênteses apenas tornam explícito o bloco que já era prioridade.

### M1.5.5 Uma nota sobre potências

Neste capítulo não aparecem potências. Uma **potência** é uma multiplicação repetida, como $3 \times 3$, escrita de forma abreviada. Na fila de prioridade, a potência costuma entrar antes da multiplicação; ela será definida e estudada em detalhes mais adiante neste mesmo módulo. Nenhum exemplo, exercício ou questão deste capítulo depende dela.

> 🎯 **Resumo do trecho:** parênteses primeiro; multiplicação e divisão depois, da esquerda para a direita; adição e subtração por fim, também da esquerda para a direita.

**Erros comuns nesta seção:**

| Erro | Correção rápida |
|---|---|
| Achar que adição é associativa como a multiplicação | A subtração não é: $12 - 5 - 2 = 5$, enquanto $12 - (5 - 2) = 9$ |
| Aplicar a distributividade esquecendo um dos produtos | $3 \times (2 + 4)$ vira $3 \times 2 + 3 \times 4$, com os dois produtos presentes |
| Escrever $2 + (3 \times 4)$ e dizer que mudou o valor de $2 + 3 \times 4$ | Os parênteses apenas explicitam o bloco prioritário; o valor continua 14 |

## M1.6 Exemplos resolvidos passo a passo

### Exemplo 1 — Trivial: a pergunta do título

**Enunciado.** Calcule $2 + 3 \times 4$ e explique por que o valor 20 está errado.

**Raciocínio.** A expressão tem adição e multiplicação e não tem parênteses. Pela fila de prioridade, a multiplicação é feita antes da adição.

**Resolução.**

1. Degrau 2: $3 \times 4 = 12$.
2. Degrau 3: $2 + 12 = 14$.

Portanto,

$$2 + 3 \times 4 = 14.$$

O valor 20 viria de $(2 + 3) \times 4 = 5 \times 4 = 20$, que é outra expressão: ela contém parênteses que a conta original não tem.

**Verificação.** Pela soma repetida, $3 \times 4 = 4 + 4 + 4 = 12$. Juntando os 2 restantes, $12 + 2 = 14$. O resultado confere.

**O que este exemplo ensina.** A ausência de parênteses também é informação: ela diz que o $2$ fica fora da multiplicação.

### Exemplo 2 — Médio: parênteses e uma cadeia de divisão

**Enunciado.** Calcule $18 \div 3 \times 2 + (5 - 1)$.

**Raciocínio.** Há parênteses, divisão, multiplicação e adição. Primeiro resolvemos os parênteses; depois a divisão e a multiplicação, da esquerda para a direita; por fim, a adição.

**Pausa de aprendizagem ativa.** Antes de ler os passos, preveja o valor de $18 \div 3 \times 2 + (5 - 1)$ e anote.

**Resolução.**

1. Degrau 1: $(5 - 1) = 4$. A expressão vira $18 \div 3 \times 2 + 4$.
2. Degrau 2, primeira operação da esquerda: $18 \div 3 = 6$, porque $6 \times 3 = 18$.
3. Degrau 2, segunda operação: $6 \times 2 = 12$.
4. Degrau 3: $12 + 4 = 16$.

Portanto,

$$18 \div 3 \times 2 + (5 - 1) = 6 \times 2 + 4 = 12 + 4 = 16.$$

**Verificação.** Ordem de grandeza: $18 \div 3$ é 6; dobrar 6 dá 12; somar 4 dá 16. Conferindo a divisão na mão, $3 + 3 + 3 + 3 + 3 + 3 = 18$, então $18 \div 3 = 6$. As duas verificações concordam com 16. Quem previu 16 acertou; quem previu 3 deve refazer o degrau 2.

**O que este exemplo ensina.** Divisão e multiplicação empatam na fila. Quando aparecem juntas, quem decide é a posição: a que está à esquerda vai primeiro.

### Exemplo 3 — Desafiador: vários blocos e uma armadilha

**Enunciado.** Calcule $24 \div (2 + 4) \times 3 - 5 \times 2$.

**Raciocínio.** A expressão tem um par de parênteses, uma cadeia com divisão e multiplicação e, depois do sinal de subtração, outra multiplicação. Os parênteses mudam o divisor: ele é $2 + 4$, não apenas 2.

**Pausa de aprendizagem ativa.** Antes dos passos, preveja o valor final da expressão. Depois confira: a resposta é 2.

**Resolução.**

1. Degrau 1: $(2 + 4) = 6$. A expressão vira $24 \div 6 \times 3 - 5 \times 2$.
2. Degrau 2, mais à esquerda: $24 \div 6 = 4$, porque $4 \times 6 = 24$.
3. Degrau 2, ainda da esquerda: $4 \times 3 = 12$.
4. Degrau 2, após o sinal de subtração: $5 \times 2 = 10$.
5. Degrau 3: $12 - 10 = 2$.

Portanto,

$$24 \div (2 + 4) \times 3 - 5 \times 2 = 24 \div 6 \times 3 - 10 = 4 \times 3 - 10 = 12 - 10 = 2.$$

**Verificação.** Agrupemos os dois lados da subtração. O primeiro bloco, $24 \div 6 \times 3$, vale $4 \times 3 = 12$. O segundo bloco, $5 \times 2$, vale 10. A diferença $12 - 10$ é 2. O resultado confere.

**O que este exemplo ensina.** Os parênteses agem somente onde foram escritos: eles transformaram o divisor em 6, mas não recolheram o $5 \times 2$ para dentro do primeiro bloco.

> ⚠️ **Cuidado:** sem os parênteses, a expressão $24 \div 2 + 4 \times 3 - 5 \times 2$ valeria $12 + 12 - 10 = 14$, e não 2. Um único par de sinais muda toda a leitura da conta.

**Erros comuns nesta seção:**

| Erro | Correção rápida |
|---|---|
| No Exemplo 1, escrever $(2 + 3) \times 4$ para representar a conta original | A conta original não tem parênteses; o valor é 14 |
| No Exemplo 2, calcular $3 \times 2$ antes da divisão | A divisão está mais à esquerda e vem primeiro: $18 \div 3 = 6$ |
| No Exemplo 3, trazer o $5 \times 2$ para dentro dos parênteses | Os parênteses só envolvem $2 + 4$; o produto $5 \times 2$ fica fora |

## M1.7 Visualização

A figura abaixo mostra a fila de prioridade. Ela é uma escada: o degrau de cima é o mais urgente.

```text
 +----------------------------------+
 | 1º   ( ... )   parênteses        |  mais urgente
 +----------------------------------+
 | 2º   ×  e  ÷   da esquerda       |
 +----------------------------------+
 | 3º   +  e  −   da esquerda       |  menos urgente
 +----------------------------------+
```

**Descrição textual da figura:** são três caixas empilhadas. A caixa de cima contém os parênteses e é a primeira a ser resolvida. A caixa do meio contém multiplicação e divisão, com a orientação de seguir da esquerda para a direita. A caixa de baixo contém adição e subtração, também da esquerda para a direita. A ordem de leitura vai de cima para baixo.

A figura seguinte acompanha a conta $2 + 3 \times 4$ até o valor final.

```text
  2   +   3   ×   4
          \_____/
          bloco A: 3 × 4 = 12
             |
             v
  2   +   12
  \________/
  bloco B: 2 + 12 = 14
```

**Descrição textual da figura:** na primeira linha está a expressão original. Um traço liga o 3, o sinal de multiplicação e o 4, formando o bloco A, que é calculado primeiro e vale 12. Na terceira linha, o 12 ocupa o lugar do bloco A; um traço liga o 2, o sinal de mais e o 12, formando o bloco B, que vale 14.

Para expressões maiores, uma tabela de etapas evita saltos: veja o caminho do Exemplo 3:

| Etapa | Conta feita | Resultado parcial | Expressão que sobra |
|---|---|---|---|
| 1 | $(2 + 4)$ | 6 | $24 \div 6 \times 3 - 5 \times 2$ |
| 2 | $24 \div 6$ | 4 | $4 \times 3 - 5 \times 2$ |
| 3 | $4 \times 3$ | 12 | $12 - 5 \times 2$ |
| 4 | $5 \times 2$ | 10 | $12 - 10$ |
| 5 | $12 - 10$ | 2 | 2 |

**Onde isso aparece no mundo real:**

| Área | Onde a ideia aparece | Se a ordem for ignorada |
|---|---|---|
| Matemática | em expressões numéricas e na distributividade $a \times (b + c)$ | $2 + 3 \times 4$ passa a admitir dois valores, 14 e 20 |
| Linguagem C | em C3, uma expressão como `2 + 3 * 4` obedece à mesma prioridade, com `*` como sinal de multiplicação; em C1, as instruções seguem uma ordem definida | o programa calcula um valor diferente do previsto |
| Redes de Computadores | em R3, a conversão entre bases e as contas sobre endereços seguem uma sequência definida de operações | trocar a sequência gera um resultado diferente |
| Engenharia de Software | em S4, um teste (verificação automática de uma entrada conhecida) registra entrada e saída esperada sem ambiguidade | o teste deixa de ser uma especificação confiável |

**Erros comuns nesta seção:**

| Erro | Correção rápida |
|---|---|
| Ler a escada de baixo para cima | A leitura vai do degrau 1, dos parênteses, para o degrau 3 |
| Confundir resultado parcial com valor final na tabela | Só a última linha da tabela contém o valor da expressão inteira |

## M1.8 Erros comuns e armadilhas

Além dos quadros curtos no fim de cada seção importante, este é o quadro consolidado do capítulo, com a causa e a correção de cada erro.

| Erro | Por que acontece | Como evitar |
|---|---|---|
| Calcular $2 + 3 \times 4 = 20$ | Ler só da esquerda para a direita, sem notar a prioridade da multiplicação | Antes de calcular, procurar $\times$ e $\div$ e resolvê-los primeiro |
| Inventar parênteses que a conta não tem | Transformar "2 mais três vezes 4" em "2 mais 3, vezes 4" | Só escrever parênteses quando o enunciado os trouxer ou quando quiser apenas explicitar um bloco já prioritário |
| Fazer $18 \div 3 \times 2 = 18 \div 6 = 3$ | Achar que a multiplicação sempre vem antes, mesmo quando aparece depois da divisão | Empatou na fila: executar da esquerda para a direita, que dá $6 \times 2 = 12$ |
| Fazer $12 - 5 + 2 = 5$ | Agrupar mentalmente o $5 + 2$ por causa do sinal de mais | Seguir da esquerda: $12 - 5 = 7$, depois $7 + 2 = 9$ |
| Fazer $(5 + 2) \times 3 = 11$ | Esquecer os parênteses e calcular $2 \times 3$ primeiro | Resolver o degrau 1 antes do degrau 2: $7 \times 3 = 21$ |
| Achar que parênteses sempre aumentam o valor | Comparar só $(2 + 3) \times 4 = 20$ com $2 + 3 \times 4 = 14$ | Comparar também $10 - (2 + 3) = 5$ com $10 - 2 + 3 = 11$: aqui os parênteses diminuem o valor |
| Aplicar a regra a números com sinal antes de estudá-los | Ver um número como $-3$ e supor que as mesmas contas valem sem definição | Neste capítulo, usar apenas números sem sinal; o módulo M2 trata das dívidas e temperaturas negativas |
| Confiar em qualquer calculadora | Algumas calculadoras simples executam na ordem das teclas | Comparar o resultado da calculadora com a fila de prioridade e com uma calculadora científica |

> ⚠️ **Cuidado:** a regra não altera os números nem inventa valores. Ela apenas fixa a leitura da expressão. Se duas pessoas chegam a valores diferentes, uma delas leu uma conta que não estava escrita.

## M1.9 Resumo do capítulo

- Um número conta ou mede; uma operação age sobre números; uma expressão numérica pede um cálculo.
- O valor de uma expressão é o número obtido depois de todas as contas.
- Parênteses vêm primeiro: o que está dentro deles vira um bloco único.
- Multiplicação e divisão vêm depois, da esquerda para a direita.
- Adição e subtração vêm por fim, da esquerda para a direita.
- Por isso $2 + 3 \times 4 = 14$, enquanto $(2 + 3) \times 4 = 20$.
- A ordem é uma convenção de leitura, não uma descoberta sobre os números; ela permite que todos cheguem ao mesmo valor.
- Verifique sempre por um segundo caminho, como a soma repetida ou uma ordem de grandeza.

**Cola rápida:**

| O que você vê | Como ler | Valor |
|---|---|---|
| $2 + 3 \times 4$ | multiplicar antes de somar | 14 |
| $(2 + 3) \times 4$ | somar dentro dos parênteses antes de multiplicar | 20 |
| $18 \div 3 \times 2$ | dividir e multiplicar da esquerda para a direita | 12 |
| $12 - 5 + 2$ | subtrair e somar da esquerda para a direita | 9 |
| $20 - 4 \times (3 + 2)$ | parênteses, multiplicação, subtração | 0 |

## M1.10 Exercícios

Não olhe o gabarito antes de tentar. Escreva as contas em papel e indique a etapa de cada resultado.

### Fixação

1. Calcule $2 + 3 \times 4$.
2. Calcule $5 \times 2 + 1$.
3. Calcule $(5 + 2) \times 3$.
4. Calcule $12 \div 4 + 2$.
5. Calcule $10 - 2 \times 3$.

### Aplicação

6. Calcule $18 \div 3 \times 2$.
7. Calcule $20 - 4 \times (3 + 2)$.
8. Calcule $7 + 3 \times (10 - 8) - 6 \div 2$.
9. Escreva uma expressão com parênteses para a frase "some 2 e 3 e multiplique o resultado por 4". Depois compare o valor dela com o de $2 + 3 \times 4$.
10. Calcule $16 \div 2 \times 2$ e $16 \div (2 \times 2)$. Em uma frase, diga o que os parênteses mudaram.

### Desafio

11. Calcule $24 \div (2 + 4) \times 3 - 5 \times 2$.
12. Calcule $3 \times (8 - 2) - 12 \div 4 + 1$.
13. Acrescente um par de parênteses em $6 + 4 \times 2 - 1$ para que a expressão valha 19.
14. Ana calculou $30 - 12 \div 3$ fazendo $30 - (12 \div 3)$. Bia calculou a mesma expressão fazendo $(30 - 12) \div 3$. Quem seguiu a convenção deste capítulo? Quanto vale a expressão original?
15. Um colega escreveu $2 + 3 \times 4 = 20$. Sem trocar números nem sinais, acrescente um par de parênteses para que a conta dele fique correta. Depois explique por que a conta sem parênteses vale 14.

## M1.11 Gabarito comentado

### Fixação

1. $2 + 3 \times 4 = 2 + 12 = 14$. **Raciocínio:** a multiplicação vem antes da adição, e não há parênteses. **Onde a maioria erra:** soma $2 + 3 = 5$ e multiplica por 4, chegando a 20; isso exige parênteses que a conta não tem.

2. $5 \times 2 + 1 = 10 + 1 = 11$. **Raciocínio:** primeiro o produto de 5 por 2, depois a soma com 1. **Onde a maioria erra:** lê "5 mais 2, vezes 1" e calcula $7 \times 1 = 7$.

3. $(5 + 2) \times 3 = 7 \times 3 = 21$. **Raciocínio:** os parênteses obrigam a soma a vir primeiro. **Onde a maioria erra:** calcula $2 \times 3 = 6$ e soma 5, obtendo 11, como se os parênteses não existissem.

4. $12 \div 4 + 2 = 3 + 2 = 5$. **Raciocínio:** dividir 12 em quatro partes iguais dá 3; depois somamos 2. **Onde a maioria erra:** soma $4 + 2 = 6$ primeiro e divide $12 \div 6 = 2$.

5. $10 - 2 \times 3 = 10 - 6 = 4$. **Raciocínio:** o produto $2 \times 3$ é feito antes da subtração. **Onde a maioria erra:** calcula $10 - 2 = 8$ e depois $8 \times 3 = 24$.

### Aplicação

6. $18 \div 3 \times 2 = 6 \times 2 = 12$. **Raciocínio:** divisão e multiplicação empatam na fila, então seguimos da esquerda para a direita. **Onde a maioria erra:** faz $3 \times 2 = 6$ antes da divisão e obtém $18 \div 6 = 3$.

7. $20 - 4 \times (3 + 2) = 20 - 4 \times 5 = 20 - 20 = 0$. **Raciocínio:** primeiro os parênteses, depois a multiplicação, por fim a subtração. **Onde a maioria erra:** subtrai $20 - 4 = 16$ antes de multiplicar e chega a $16 \times 5 = 80$.

8. $7 + 3 \times (10 - 8) - 6 \div 2 = 7 + 3 \times 2 - 3 = 7 + 6 - 3 = 13 - 3 = 10$. **Raciocínio:** parênteses primeiro; depois a multiplicação e a divisão; por fim adição e subtração da esquerda para a direita. **Onde a maioria erra:** agrupa $6 - 3$ por causa do sinal de menos no fim e escreve $13 - (6 \div 2)$ com valor 7; a divisão $6 \div 2$ já valia 3 e deve ser subtraída de 13.

9. A frase pede $(2 + 3) \times 4 = 5 \times 4 = 20$. A conta $2 + 3 \times 4$ vale 14. **Raciocínio:** "some 2 e 3" exige parênteses para que a soma seja o bloco multiplicado por 4. **Onde a maioria erra:** escreve $2 + 3 \times 4$ para a frase e depois se surpreende com o valor 14.

10. $16 \div 2 \times 2 = 8 \times 2 = 16$ e $16 \div (2 \times 2) = 16 \div 4 = 4$. **Raciocínio:** sem parênteses, a divisão vem primeiro; com parênteses, o divisor passa a ser o produto 4. **Onde a maioria erra:** afirma que os parênteses "não mudam nada" porque a multiplicação já viria antes da divisão; aqui eles trocam o divisor de 2 por 4.

### Desafio

11. $24 \div (2 + 4) \times 3 - 5 \times 2 = 24 \div 6 \times 3 - 10 = 4 \times 3 - 10 = 12 - 10 = 2$. **Raciocínio:** os parênteses dão o divisor 6; a cadeia $24 \div 6 \times 3$ é resolvida da esquerda para a direita; o produto $5 \times 2$ é calculado antes da subtração. **Onde a maioria erra:** calcula $24 \div 2 = 12$ e só depois soma 4, ignorando os parênteses.

12. $3 \times (8 - 2) - 12 \div 4 + 1 = 3 \times 6 - 3 + 1 = 18 - 3 + 1 = 15 + 1 = 16$. **Raciocínio:** parênteses, depois a multiplicação e a divisão, depois subtração e adição da esquerda para a direita. **Onde a maioria erra:** agrupa $- 3 + 1$ como se fosse um bloco com sinal próprio e escreve $18 - 4 = 14$.

13. $(6 + 4) \times 2 - 1 = 10 \times 2 - 1 = 20 - 1 = 19$. **Raciocínio:** os parênteses forçam a soma $6 + 4$ antes da multiplicação por 2; a subtração de 1 vem por fim. **Onde a maioria erra:** escreve $6 + 4 \times (2 - 1) = 6 + 4 \times 1 = 10$, que não chega a 19.

14. Ana seguiu a convenção. A ordem correta dá $30 - (12 \div 3) = 30 - 4 = 26$. O cálculo de Bia, $(30 - 12) \div 3 = 18 \div 3 = 6$, introduz parênteses que não estavam na expressão. **Raciocínio:** a divisão tem prioridade sobre a subtração. **Onde a maioria erra:** escolhe Bia por causa da ideia de que "a conta dentro dos parênteses sempre vem primeiro"; os parênteses de Bia não existiam na pergunta original.

15. A conta correta do colega é $(2 + 3) \times 4 = 5 \times 4 = 20$. Sem parênteses, a expressão $2 + 3 \times 4$ vale $2 + 12 = 14$, porque a multiplicação é feita antes da adição. **Raciocínio:** os parênteses incluem o 2 no grupo multiplicado por 4. **Onde a maioria erra:** acrescenta parênteses em $2 + (3 \times 4)$ e acha que corrigiu o 20; esse par de parênteses apenas explicita a prioridade e mantém o valor 14.

## M1.12 Mini-projeto prático

**Cartão das duas leituras.** Monte uma folha de bolso com quatro pares de expressões. Em cada par, as duas contas usam exatamente os mesmos números e sinais; a única diferença é um par de parênteses que muda o valor.

**Objetivo.** Mostrar, com evidência numérica, que a posição dos parênteses altera a leitura de uma expressão e que a convenção da fila de prioridade evita ambiguidade.

**Requisitos.**

1. Escrever quatro pares, com um par de parênteses em apenas uma conta de cada par.
2. Calcular o valor das oito expressões e registrar todas as etapas em uma tabela.
3. Escolher pelo menos dois pares em que os valores sejam diferentes.
4. Acrescentar um parágrafo explicando por que os parênteses mudaram o resultado, usando as palavras "bloco" e "prioridade".
5. Conferir quatro valores em uma calculadora científica ou em um interpretador de linguagem de programação e anotar o que foi obtido.

**Dicas progressivas.** Comece com um par simples, como $2 + 3 \times 4$ e $(2 + 3) \times 4$. Depois troque a multiplicação por divisão, mantendo números que dividam exatamente. Se uma conta der número com vírgula, escolha outros números antes de seguir: divisões exatas tornam a conferência mais clara. Por fim, monte um par em que os parênteses diminuam o valor, como $10 - (2 + 3)$ e $10 - 2 + 3$.

**Critério de correção.** Outra pessoa calcula as oito expressões apenas com a fila de prioridade deste capítulo e encontra exatamente os valores da sua folha; os quatro valores conferidos na ferramenta coincidem com os da tabela; o parágrafo final cita o papel dos parênteses como bloco calculado antes do restante.

## M1.13 Para ir além

- **Próximos passos da trilha:** M1 continua com valor posicional e com os algoritmos escritos da adição e da subtração. Quando você estudar C3, em Linguagem C, encontrará a mesma precedência em expressões de código; o sinal de multiplicação muda de $\times$ para `*`, mas a ideia do bloco continua sendo a mesma.
- **Leituras recomendadas:** *O Homem que Calculava*, de Malba Tahan, para ver aritmética apresentada como narrativa; *How to Solve It* (publicado em português como *Como resolver problemas*), de George Pólya, para aprender a organizar raciocínio; *Basic Mathematics*, de Serge Lang, como referência de fundamentos. Use-as como complemento, não como substituto dos exercícios deste capítulo.
- **Documentação oficial:** a referência da linguagem Python, na seção de precedência de operadores, em `docs.python.org/3/reference/expressions.html`; a documentação MDN Web Docs, na página sobre precedência de operadores, em `developer.mozilla.org`. Confira sempre a versão atual da documentação, porque linguagens podem mudar.
- **Pergunta aberta:** se a ordem das operações é um acordo entre pessoas, por que algumas calculadoras simples mostram 20 para `2 + 3 × 4`? O que esse comportamento ensina sobre a diferença entre escrever uma expressão e executar uma sequência de teclas?

## M1.14 Autoverificação final

Antes de entregar, fiz a pergunta da seção 4.13 do `PROMPT_MESTRE.md`: "Um aluno que leu apenas este capítulo conseguiria resolver todos os exercícios propostos?" **Sim.** A fila de prioridade, as definições e o método dos blocos estão todos no texto, e as contas de todos os exercícios usam apenas números cujas divisões são exatas.

- [x] A analogia aparece antes da definição formal, com "onde funciona" e "onde quebra"? Sim, em M1.4.
- [x] Toda regra nova tem um "porquê"? Sim, em M1.5.2 e M1.5.3, com a distributividade justificando a prioridade da multiplicação.
- [x] Nenhum pré-requisito ficou oculto? Sim: M1.2 declara "nenhum", define número, numeral e operação, e traz miniteste de três perguntas respondido.
- [x] Há três exemplos resolvidos em dificuldade crescente? Sim, em M1.6: trivial, médio e desafiador.
- [x] Todos os exemplos têm raciocínio, resolução, verificação e observação final? Sim.
- [x] A ordem vai do concreto para o abstrato? Sim: lápis e caixas em M1.4, escada e tabela em M1.7, definições formais e distributividade em M1.5.
- [x] Há visualização em ASCII com descrição textual? Sim, em M1.7.
- [x] Há quadro de erros com causa e correção? Sim, em M1.8, com oito linhas.
- [x] O resumo tem entre 5 e 10 linhas e traz cola rápida? Sim, oito linhas e tabela em M1.9.
- [x] Há exatamente 15 exercícios em três grupos de 5? Sim, em M1.10.
- [x] O gabarito comentado fica em seção separada, com raciocínio e "onde a maioria erra"? Sim, em M1.11.
- [x] O mini-projeto tem objetivo, requisitos, dicas progressivas e critério de correção? Sim, em M1.12.
- [x] As leituras são obras reais e a documentação é oficial? Sim, em M1.13.
- [x] Há quadros curtos de erros ao fim das seções importantes, além do quadro consolidado? Sim, em M1.2, M1.3, M1.4, M1.5, M1.6 e M1.7; o quadro consolidado fica em M1.8.
- [x] A progressão em espiral foi sinalizada com a frase "Lembra do capítulo X? Aqui ele aparece de novo."? Sim, em M1.5.1 e M1.5.2.
- [x] Há quadro "Onde isso aparece no mundo real" ligando Matemática, C, Redes e Engenharia de Software? Sim, em M1.7.
- [x] Há pausas de aprendizagem ativa com previsão antes da resposta? Sim, em M1.3, M1.4, M1.5.3, M1.5.4 e M1.6.
- [x] A contagem e $1 + 1$ foram explicadas até o nível do exemplo de Peano da seção 3.3? Sim, em M1.5.1, com sucessor e a relação $1 + S(0) = S(1 + 0)$.
- [x] Toda conta foi conferida por um segundo caminho? Sim, nos exemplos e nas questões.
- [x] Nenhum termo técnico foi usado antes de ser definido? Sim: expressão, valor, notação, convenção, parênteses, precedência, associatividade, distributividade e potência são definidos no ponto de uso.
- [x] Nenhuma resolução passo a passo omitiu contas intermediárias? Sim.
- [x] Caixas de destaque usam apenas os seis ícones da seção 5? Sim: 💡, 🧠, ⚠️, 🔁, 🌍 e 🎯.
- [x] LaTeX e blocos de código estão corretos? Sim, com `$...$`, `$$...$$` e linguagem indicada.
- [x] Os campos para a plataforma FORGE estão preenchidos? Sim, abaixo.

---

## Campos para a plataforma FORGE

### objetivo

Calcular expressões numéricas com adição, subtração, multiplicação, divisão e parênteses, explicando por que $2 + 3 \times 4$ vale 14 e não 20.

### blocos

1. **Objetivo:** ler a pergunta do título e anotar um chute para $2 + 3 \times 4$.
2. **Explicação curta:** parênteses primeiro; × e ÷ depois, da esquerda para a direita; + e − por fim, da esquerda para a direita.
3. **Exemplo visual:** a escada de três degraus, o diagrama dos blocos e o quadro "Onde isso aparece no mundo real" em M1.7.
4. **Exemplo resolvido:** Exemplo 1 de M1.6, com a comparação entre 14 e 20.
5. **Pequeno exercício:** questões 1, 2, 3, 5 e 7 de M1.10.
6. **Verificação:** conferir cada valor pela soma repetida ou por uma calculadora científica.
7. **Resumo:** cola rápida de M1.9.
8. **Próxima etapa:** continuação do módulo M1, com valor posicional; mais adiante, C3 retoma a precedência em código.

### questoes

1. Quanto vale $2 + 3 \times 4$?
   - A) 20
   - B) 14
   - C) 10
   - D) 24
   - **Resposta: B.** Primeiro $3 \times 4 = 12$; depois $2 + 12 = 14$.

2. Qual operação deve ser feita primeiro em $5 + 2 \times 3$?
   - A) A adição, por estar à esquerda.
   - B) A multiplicação, por ter prioridade.
   - C) A que tiver o maior número ao lado.
   - D) A que estiver mais à direita.
   - **Resposta: B.** Multiplicação vem antes de adição, e não há parênteses.

3. Quanto vale $(5 + 2) \times 3$?
   - A) 11
   - B) 21
   - C) 17
   - D) 13
   - **Resposta: B.** Os parênteses dão $5 + 2 = 7$; depois $7 \times 3 = 21$.

4. Em $18 \div 3 \times 2$, o que se calcula primeiro?
   - A) $3 \times 2$, porque a multiplicação vem antes.
   - B) $18 \div 3$, porque as duas empatam e a divisão está à esquerda.
   - C) $18 \div 6$, porque os parênteses estão implícitos.
   - D) Nada, porque a expressão não tem valor.
   - **Resposta: B.** O resultado é $6 \times 2 = 12$.

5. Quanto vale $12 - 5 + 2$?
   - A) 5
   - B) 9
   - C) 15
   - D) 6
   - **Resposta: B.** Subtração e adição empatam: $12 - 5 = 7$, depois $7 + 2 = 9$.

6. Quanto vale $20 - 4 \times (3 + 2)$?
   - A) 0
   - B) 16
   - C) 96
   - D) 20
   - **Resposta: A.** Os parênteses dão 5; $4 \times 5 = 20$; $20 - 20 = 0$.

7. Por que $2 + 3 \times 4$ não é 20?
   - A) Porque a multiplicação é feita antes da adição.
   - B) Porque a adição sempre vem primeiro.
   - C) Porque o 4 é maior que os outros números.
   - D) Porque há parênteses escondidos na expressão.
   - **Resposta: A.** O 20 exigiria os parênteses de $(2 + 3) \times 4$.

8. Quanto vale $24 \div (2 + 4) \times 3 - 5 \times 2$?
   - A) 2
   - B) 12
   - C) 7
   - D) 22
   - **Resposta: A.** $(2 + 4) = 6$; $24 \div 6 = 4$; $4 \times 3 = 12$; $5 \times 2 = 10$; $12 - 10 = 2$.

9. O que fazem os parênteses em uma expressão numérica?
   - A) Obrigam o que está dentro a ser calculado antes do restante.
   - B) Substituem o sinal de multiplicação.
   - C) Representam um número acrescentado à conta.
   - D) Garantem que o resultado seja sempre maior.
   - **Resposta: A.** Eles criam um bloco prioritário; em subtrações, podem até diminuir o valor.

10. Em qual das contas o valor é 14?
    - A) $(2 + 3) \times 4$
    - B) $2 + 3 \times 4$
    - C) $2 \times 3 + 4$
    - D) $2 + 3 + 4$
    - **Resposta: B.** A alternativa A vale 20, a C vale 10 e a D vale 9.

### sintese_feynman

Explique com as suas palavras, em pelo menos 30 caracteres, por que $2 + 3 \times 4$ vale 14 e não 20, como se estivesse ensinando alguém que nunca viu o assunto. Crie uma analogia sua, diferente da caixa de lápis deste capítulo, e invente um exemplo numérico seu com parênteses. Não copie frases do texto. A resposta precisa dizer o que acontece com o bloco da multiplicação e o que muda quando os parênteses são acrescentados.

### cartoes_erro

1. Por que $2 + 3 \times 4 = 20$ está errado? Qual é o valor correto?
2. O que muda entre $18 \div 3 \times 2$ e $18 \div (3 \times 2)$?
3. Por que $12 - 5 + 2$ não pode ser resolvido agrupando $5 + 2$?
4. Em que situação os parênteses diminuem o valor de uma expressão?
5. Por que uma calculadora simples pode mostrar um valor diferente de uma calculadora científica para a mesma sequência de teclas?

### laboratorio

- **Simulação:** desenhe em papel a escada de três degraus de M1.7. Em seguida, escreva em cartões separados os números e os sinais de $24 \div (2 + 4) \times 3 - 5 \times 2$. Agrupe fisicamente os cartões de cada bloco na ordem da escada e anote o valor parcial depois de cada agrupamento. Ao final, confira com a tabela de etapas de M1.7. Registre o desenho como evidência; nenhuma ferramenta eletrônica é usada nesta etapa.
- **Execução real:** em um interpretador Python, digite as três linhas abaixo. No Python, o sinal `*` significa multiplicação e a função `print` escreve o valor na tela. Anote a saída e compare com os valores 14, 20 e 0 calculados no papel.

```python
print(2 + 3 * 4)
print((2 + 3) * 4)
print(20 - 4 * (3 + 2))
```

Saída esperada:

```text
14
20
0
```

### indicadores

- **Domínio:** aula marcada como dominada somente com nota mínima de 8 em 10 e síntese Feynman válida, com pelo menos 30 caracteres.
- **Revisões vencidas:** cartões de erro cujo retorno agendado passou do prazo.
- **Erros a refazer:** questões erradas da prova prática que precisam de nova tentativa.
- **Labs com evidência:** atividades de laboratório com desenho, saída ou registro anexado; a simulação não é contada como execução real.
- **Módulos em andamento:** módulos da plataforma com progresso iniciado, incluindo "Aritmética e números" ou "Números e operações" quando este capítulo for usado.

### projeto

Nenhum projeto `MP` do catálogo didático é iniciado neste capítulo. O mini-projeto "Cartão das duas leituras", em M1.12, é uma atividade local de fixação, sem código `MP`. O `MP1` do catálogo é a calculadora de frações e depende do módulo M2; não deve ser confundido com este capítulo. Os códigos `P0` a `P10` pertencem ao portfólio canônico da aplicação FORGE e não são reutilizados aqui. Da mesma forma, M1 é apenas a etiqueta didática usada neste Prompt Mestre; a plataforma nomeia este conteúdo como "Aritmética e números" ou "Números e operações" (seção 18.3).

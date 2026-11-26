# Capítulo modelo — Linguagem C

**Código didático:** C1 · **Tema:** Olá, mundo: o que acontece quando você compila e executa? · **Nível:** Zero · **Área:** Linguagem C

Este arquivo é o padrão ouro do Prompt Mestre. Ele mostra na prática como aplicar as seções 3, 4, 6 e 18 do `PROMPT_MESTRE.md`. Quando for gerar outro capítulo, use esta estrutura como referência de completude, mas escreva sempre com as suas próprias palavras.

**Validação executada:** os cinco blocos de código C válidos compilam com `gcc -Wall -Wextra -Werror -pedantic -std=c11` sem avisos; o trecho de C1.8 falha de propósito e está identificado como erro.

---

## C1.1 Objetivos de aprendizagem

Ao final deste capítulo você será capaz de:

1. Escrever um programa C completo que imprime uma mensagem na tela.
2. Explicar a diferença entre arquivo-fonte, compilador e executável.
3. Reconhecer a função de cada parte de `int main(void)` e de `return 0;`.
4. Compilar um programa com `gcc -Wall -Wextra -Werror -pedantic -std=c11` sem avisos.
5. Prever a saída de um `printf` que contém quebras de linha.
6. Identificar quatro erros comuns de quem escreve o primeiro programa em C.
7. Verificar o código de saída de um programa no seu terminal.

## C1.2 Pré-requisitos

**Nenhum conhecimento prévio de programação é necessário.** Você precisa apenas saber ler e escrever texto e abrir um arquivo no seu computador. Todo termo novo é definido quando aparece.

Se você nunca usou um terminal, aqui vai o mínimo: o **terminal** é uma janela onde você digita comandos e recebe respostas em texto. O **prompt** é o sinal que indica que o terminal está esperando seu comando. O **compilador** é um programa que lê seu arquivo de texto e produz outro arquivo que o computador consegue executar.

### Miniteste de prontidão

Responda antes de continuar. As respostas estão logo abaixo.

1. O que é um arquivo de texto?
2. O que significa "salvar" um arquivo?
3. O que você espera que aconteça quando dá um comando no terminal?

<details>
<summary>Respostas do miniteste</summary>

1. Um arquivo que guarda caracteres legíveis, como letras, números e espaços.
2. Guardar o conteúdo atual no disco, para que ele continue existindo depois que você fecha o editor.
3. O computador executa o comando e mostra uma resposta, uma mensagem de erro ou nada.

Se você acertou as três, pode seguir. Se errou alguma, leia o parágrafo anterior mais uma vez; nenhum conteúdo deste capítulo depende de mais do que isso.

</details>

## C1.3 Motivação: por que isso existe?

Imagine que você precisa dar uma instrução para um colega que nunca viu o seu quarto. Você não pode apontar nem fazer gestos: precisa escrever tudo com palavras precisas. Se escrever "coloque ali", ele não sabe onde é "ali". Programar é parecido, mas o destinatário é o computador, que não interpreta intenção — ele segue o que está escrito.

Nos primeiros tempos da computação, as instruções eram escritas em forma muito próxima da máquina, em papel ou em cartões perfurados. Era lento e qualquer erro obrigava a refazer o material. A ideia de escrever em uma linguagem mais legível e depois traduzir automaticamente resolveu isso. O programa que faz a tradução chama-se **compilador**.

> 🌍 **No mundo real:** quando você abre um aplicativo, ele já foi traduzido desse jeito. O que você recebeu foi o executável; o código-fonte ficou com quem escreveu o aplicativo.

## C1.4 Explicação "para 5 anos"

Pense em uma receita de bolo. Você escreve os passos em papel. O papel é o seu **código-fonte**: ele tem as instruções, mas não é bolo. Você entrega a receita para um cozinheiro muito literal, que nunca improvisa. Ele lê cada linha, faz exatamente o que está escrito e entrega o bolo. Esse cozinheiro é o **compilador**. O bolo pronto é o **executável**.

Se a receita disser "coloque sal" e faltar o ponto final, o cozinheiro para e reclama. Em C, o ponto e vírgula tem esse papel: ele diz onde uma instrução termina.

> 💡 **Intuição**: escrever o código é descrever a receita. Compilar é traduzir a receita para a língua da máquina. Executar é o cozinheiro realmente seguindo os passos.

**Onde a analogia funciona:** mostra por que o texto não é o resultado e por que a ordem e os sinais de pontuação importam.

**Onde a analogia quebra:** um cozinheiro entende frases ambíguas e decide; o compilador também decide em alguns casos, mas nem sempre avisa, e algumas ambiguidades geram comportamento indefinido. Além disso, o compilador não "cozinha": ele só traduz. A tradução vem antes da execução, não durante.

## C1.5 Explicação aprofundada

### C1.5.1 As três coisas que você vai manusear

| Coisa | Nome técnico | O que é | Como se parece |
|---|---|---|---|
| O texto que você escreve | **código-fonte** | Instruções em linguagem C salvas em arquivo | `ola.c` |
| O tradutor | **compilador** | Programa que lê o fonte e gera um executável | `gcc` |
| O programa que roda | **executável** | Arquivo que o sistema operacional consegue iniciar | `ola` ou `ola.exe` |

O sufixo `.c` é uma convenção: ele avisa que o conteúdo é C. O compilador não exige o sufixo, mas as pessoas e as ferramentas esperam por ele.

### C1.5.2 O menor programa completo

```c
#include <stdio.h>

int main(void)
{
    printf("Ola, mundo!\n");
    return 0;
}
```

Vamos ler linha por linha. Nenhuma delas é decorativa.

1. `#include <stdio.h>` — pede ao pré-processador para incluir as declarações da biblioteca padrão de entrada e saída. A sigla `stdio` vem de *standard input/output*. A função `printf` está declarada ali. Sem essa linha, o compilador não sabe o que é `printf`.
2. Linha em branco — separa a inclusão do restante. Não muda o programa; melhora a leitura.
3. `int main(void)` — define a **função principal**. `main` é o nome que o sistema operacional procura ao iniciar o programa. `int` diz que ela devolve um número inteiro ao terminar. `void` diz que ela não recebe parâmetros.
4. `{` — abre o bloco da função. Tudo que está entre chaves pertence a ela.
5. `printf("Ola, mundo!\n");` — chama a função que escreve texto na saída padrão, normalmente a tela. O texto entre aspas é uma **string**. A sequência `\n` é uma **escape sequence**: dois caracteres no fonte que viram uma quebra de linha na saída. O `;` encerra a instrução.
6. `return 0;` — encerra `main` devolvendo zero. Por convenção, zero significa sucesso.
7. `}` — fecha o bloco da função.

> 🧠 **Por quê?** Por que `main` devolve `int`? Porque o sistema operacional precisa saber se o programa terminou bem. Em C, `return 0;` em `main` significa conclusão bem-sucedida. Outros valores indicam falha ou um código escolhido por quem escreveu o programa.

> 🧠 **Por quê?** Por que as aspas são retas (`"`) e não curvas (`“ ”`)? Porque o compilador espera o caractere ASCII aspas duplas. Aspas curvas, produzidas por editores de texto formatado, são outros caracteres e geram erro. Escreva código sempre em um editor de texto simples, não em um processador de documentos.

Neste capítulo usamos `Ola, mundo!` sem acento de propósito: assim o exemplo funciona em qualquer terminal, independentemente da codificação. Quando você estudar codificação de caracteres, poderá usar `Olá` com segurança.

### C1.5.3 O que o compilador faz por dentro

A transformação do fonte em executável passa por quatro etapas:

1. **Pré-processamento:** o `#include` é substituído pelo conteúdo do cabeçalho, e macros são expandidas.
2. **Compilação:** o texto C é traduzido para **linguagem de montagem**, uma notação ainda legível mas já ligada ao processador.
3. **Montagem:** a linguagem de montagem vira **código-objeto**, um arquivo com instruções binárias que ainda não sabe onde estão as funções de biblioteca.
4. **Ligação:** o código-objeto é ligado às funções da biblioteca, como `printf`, gerando o executável final.

Você pode ver cada etapa com o mesmo `gcc`:

```text
gcc -E ola.c -o ola.i     # etapa 1: pré-processamento
gcc -S ola.c -o ola.s     # etapas 1 e 2: gera montagem
gcc -c ola.c -o ola.o     # etapas 1, 2 e 3: gera objeto
gcc ola.o -o ola          # etapa 4: ligação, gera executável
```

Na prática, um único comando faz as quatro etapas:

```text
gcc -Wall -Wextra -Werror -pedantic -std=c11 ola.c -o ola
```

As opções significam: `-Wall` ativa avisos importantes; `-Wextra` ativa mais avisos; `-Werror` transforma aviso em erro; `-pedantic` exige conformidade com o padrão; `-std=c11` escolhe a versão C11; `-o ola` nomeia o executável. No Windows, o arquivo gerado aparece como `ola.exe`.

Para executar:

```powershell
.\ola.exe
```

Saída esperada:

```text
Ola, mundo!
```

> ⚠️ **Cuidado:** se você usar `gcc ola.c` sem `-o`, o executável recebe um nome padrão (`a.out` em sistemas Unix, `a.exe` em vários ambientes Windows). Especificar o nome evita confusão.

## C1.6 Exemplos resolvidos passo a passo

### Exemplo 1 — Trivial: uma linha na tela

**Enunciado.** Escreva, compile e execute um programa que imprima `Ola, mundo!`.

**Raciocínio.** Precisamos de: inclusão do cabeçalho que declara `printf`, uma função `main`, uma chamada de `printf` com a mensagem e um retorno indicando sucesso.

**Resolução.** Use o código da seção C1.5.2. Em seguida:

```text
gcc -Wall -Wextra -Werror -pedantic -std=c11 ola.c -o ola
.\ola.exe
```

**Verificação.** A tela mostra exatamente:

```text
Ola, mundo!
```

**O que este exemplo ensina.** Todo programa C completo tem uma `main`, e `printf` precisa do cabeçalho `stdio.h`.

### Exemplo 2 — Médio: duas linhas e uma linha em branco

**Enunciado.** Faça o programa imprimir `Primeira linha`, depois `Segunda linha` e deixar uma linha em branco depois disso.

**Raciocínio.** Cada `\n` termina uma linha. Duas quebras seguidas produzem uma linha em branco entre o texto e o próximo caractere.

**Resolução.**

```c
#include <stdio.h>

int main(void)
{
    printf("Primeira linha\n");
    printf("Segunda linha\n\n");
    return 0;
}
```

Compile com o mesmo comando do exemplo anterior.

**Verificação.** Saída esperada, com a terceira linha vazia:

```text
Primeira linha
Segunda linha

```

**O que este exemplo ensina.** Uma chamada de `printf` não precisa imprimir tudo; várias chamadas escrevem na mesma saída, na ordem em que aparecem.

### Exemplo 3 — Desafiador: mudando o código de saída

**Enunciado.** Altere o programa para devolver `7` ao terminal. Observe o que muda na tela e o que muda no código de saída.

**Raciocínio.** A mensagem impressa continua a mesma, porque `printf` não foi alterado. O número devolvido por `main` é capturado pelo terminal, não pela tela.

**Resolução.**

```c
#include <stdio.h>

int main(void)
{
    printf("Programa terminou.\n");
    return 7;
}
```

Compile e execute. Em seguida consulte o código de saída:

```powershell
.\ola.exe
$LASTEXITCODE
```

Saída:

```text
Programa terminou.
7
```

Em `cmd`, o comando é `echo %ERRORLEVEL%`. Em um terminal Unix, é `echo $?`.

**Verificação.** O texto impresso é idêntico ao do exemplo 1, mas o código de saída passou de `0` para `7`. Isso prova que retorno e saída na tela são coisas diferentes.

**O que este exemplo ensina.** O programa comunica duas informações ao mundo: o que escreve e como terminou. Confundir as duas é um dos erros mais comuns.

## C1.7 Visualização

O caminho do seu texto até a tela:

```text
  [ ola.c ]  arquivo de texto
      |
      |  pré-processamento: #include é expandido
      v
  [ ola.i ]  fonte expandido
      |
      |  compilação
      v
  [ ola.s ]  linguagem de montagem
      |
      |  montagem
      v
  [ ola.o ]  código-objeto
      |
      |  ligação com a biblioteca (printf)
      v
  [ ola.exe ] executável
      |
      |  execução
      v
  "Ola, mundo!" na tela
```

O comando único `gcc ... ola.c -o ola` percorre esse caminho inteiro e guarda apenas o resultado final. Os arquivos intermediários existem durante o processo, mas normalmente não ficam no disco.

Partes de um comando no terminal:

```text
gcc    -Wall -Wextra -Werror -pedantic -std=c11   ola.c   -o   ola
 ^       ^                                         ^      ^     ^
 |       |                                         |      |     |
 |       opções do compilador                      |     saída nome do
 |                                                 |     escolhida executável
 programa que faz a tradução            arquivo de entrada
```

## C1.8 Erros comuns e armadilhas

| Erro | Por que acontece | Como evitar |
|---|---|---|
| Esquecer o `;` depois de `printf(...)` | A intuição de que a quebra de linha já encerra a instrução | Leia o fim de cada instrução em voz alta: "ponto e vírgula" |
| Esquecer `#include <stdio.h>` | Parece que `printf` é "palavra da linguagem", mas é função de biblioteca | Comece todo programa que imprime com o cabeçalho |
| Escrever `Main` com letra maiúscula | Costume com outras linguagens | Em C, `main` é minúsculo; nomes são sensíveis a caixa |
| Usar aspas curvas copiadas de um documento | Processadores de texto trocam aspas automaticamente | Digite o código em editor de texto simples |
| Executar sem recompilar depois de salvar | O executável antigo continua no disco | Recompile após toda alteração no fonte |
| Esperar acentos sem tratar codificação | O terminal pode usar outra codificação | Use texto ASCII nos primeiros exercícios |
| Ignorar avisos do compilador | O aviso parece "só um alerta" | Use `-Werror` desde o primeiro dia |

Este trecho **não compila**:

```c
#include <stdio.h>

int main(void)
{
    printf("Ola, mundo!\n")
    return 0;
}
```

Falta o ponto e vírgula depois de `printf("Ola, mundo!\n")`. O compilador aponta a linha de `return`, porque só percebe que a instrução anterior não terminou quando encontra a próxima. Esse é um padrão comum: o erro aparece uma linha depois da causa.

## C1.9 Resumo do capítulo

- Código-fonte é texto; executável é o resultado da tradução feita pelo compilador.
- `gcc` com `-Wall -Wextra -Werror -pedantic -std=c11` pega problemas cedo.
- `#include <stdio.h>` traz a declaração de `printf`.
- `int main(void)` é a função principal: devolve `int` e não recebe parâmetros.
- `printf` escreve texto; `\n` quebra linha; `;` encerra a instrução.
- `return 0;` comunica sucesso ao sistema operacional.
- Recompile depois de alterar o fonte.
- Aspas retas, nunca curvas.

**Cola rápida:**

| O que você quer | Escreva |
|---|---|
| Incluir entrada e saída | `#include <stdio.h>` |
| Definir a função principal | `int main(void)` |
| Imprimir uma linha | `printf("texto\n");` |
| Terminar com sucesso | `return 0;` |
| Compilar com rigor | `gcc -Wall -Wextra -Werror -pedantic -std=c11 ola.c -o ola` |

## C1.10 Exercícios

Não olhe o gabarito antes de tentar.

### Fixação

1. O que faz `#include <stdio.h>`?
2. Para que serve o `;` depois de `printf(...)`?
3. O que significa `return 0;` no final de `main`?
4. Escreva o comando que compila `ola.c` com avisos como erro e gera `ola`.
5. O que `\n` produz na saída?

### Aplicação

6. Escreva um programa que imprima `Estudo` e, na linha seguinte, `C`.
7. Preveja a saída exata de `printf("a\nb\n\n");`.
8. O que acontece se você remover `#include <stdio.h>` e compilar com `-Werror`?
9. Você alterou `ola.c`, salvou, mas a tela mostra a mensagem antiga. Qual é a causa provável?
10. Em uma frase, explique a diferença entre arquivo-fonte e executável.

### Desafio

11. Escreva um programa que imprima três linhas, sendo a terceira vazia. Mostre a saída esperada.
12. Mude `return 0;` para `return 7;`, execute e consulte o código de saída no seu terminal. Explique o que mudou e o que ficou igual.
13. Encontre os dois erros deste trecho sem compilar: `int main(void) { printf("Oi\n") return 0; }`.
14. Por que um `printf` sem `\n` pode deixar o próximo prompt do terminal na mesma linha da mensagem?
15. Como você escreveria `printf` para imprimir exatamente `C:\estudos\ola.c`?

## C1.11 Gabarito comentado

### Fixação

1. Traz para o programa as declarações da biblioteca padrão de entrada e saída, incluindo a de `printf`. **Onde a maioria erra:** acha que a diretiva "imprime" alguma coisa. Ela apenas inclui declarações.
2. Encerra a instrução. **Onde a maioria erra:** confunde com o `;` de separador de campos em planilhas.
3. Devolve zero ao sistema operacional, indicando sucesso. **Onde a maioria erra:** acha que imprime o número zero na tela.
4. `gcc -Wall -Wextra -Werror -pedantic -std=c11 ola.c -o ola`. **Onde a maioria erra:** esquece `-o` e depois não encontra o executável.
5. Uma quebra de linha. **Onde a maioria erra:** lê como as letras "barra" e "ene" na saída.

### Aplicação

6.

```c
#include <stdio.h>

int main(void)
{
    printf("Estudo\n");
    printf("C\n");
    return 0;
}
```

**Onde a maioria erra:** escreve `Estudo C` em uma única `printf` com espaço, em vez de usar duas linhas.

7. Saída com três linhas: `a`, `b` e uma linha vazia. **Onde a maioria erra:** prevê apenas duas linhas e esquece que `\n\n` cria a terceira.

8. O compilador avisa que `printf` foi declarada implicitamente; com `-Werror`, o aviso vira erro e não gera executável. **Onde a maioria erra:** acha que o programa roda normalmente porque `printf` "já é conhecida".

9. O executável não foi recompilado, então o arquivo antigo continua sendo executado. **Onde a maioria erra:** procura o erro no código em vez de no processo de build.

10. O fonte é o texto escrito em C; o executável é o resultado binário que o sistema operacional roda. **Onde a maioria erra:** chama os dois de "programa" sem distinguir o estágio.

### Desafio

11.

```c
#include <stdio.h>

int main(void)
{
    printf("Linha um\n");
    printf("Linha dois\n");
    printf("\n");
    return 0;
}
```

Saída:

```text
Linha um
Linha dois

```

**Onde a maioria erra:** tenta imprimir "linha vazia" com texto em vez de usar apenas `\n`.

12. O texto na tela continua `Programa terminou.`; o valor lido pelo terminal passa a ser `7`. **Onde a maioria erra:** acha que `return` altera a saída de `printf`.

13. Faltam o `;` depois de `printf("Oi\n")` e o cabeçalho `#include <stdio.h>`. **Onde a maioria erra:** encontra apenas a falta do ponto e vírgula e esquece a declaração de `printf`.

14. Sem `\n`, a saída não termina com quebra de linha, então o prompt do terminal aparece logo depois da mensagem. **Onde a maioria erra:** atribui o comportamento a um erro do compilador.

15. `printf("C:\\estudos\\ola.c\n");` — cada barra invertida precisa ser duplicada, porque `\` inicia uma sequência de escape. **Onde a maioria erra:** escreve `C:\estudos\ola.c` direto e recebe escapes inesperados.

## C1.12 Mini-projeto prático

**Cartão de boas-vindas do terminal.** Crie um programa que imprima três linhas: um título, uma frase sua e uma borda feita de hífens.

**Requisitos.**

1. Arquivo chamado `boasvindas.c`.
2. Pelo menos três chamadas de `printf`.
3. Compilação sem avisos com as opções do capítulo.
4. Saída esperada escrita em um bloco no README do projeto.

**Dicas progressivas.** Comece com uma linha só. Depois acrescente a segunda e a terceira. Se a borda ficar torta, conte os hífens em papel antes de mexer no código.

**Critério de correção.** Outra pessoa compila o arquivo, executa e confere a saída com o bloco do README, sem precisar perguntar nada.

## C1.13 Para ir além

- **Próximo capítulo:** C2 — tipos, variáveis, entrada e saída. Lá você vai guardar valores em vez de apenas imprimir textos fixos.
- **Leituras recomendadas:** *The C Programming Language*, de Brian W. Kernighan e Dennis M. Ritchie; *C Programming: A Modern Approach*, de K. N. King. Use como referência de linguagem, não como substituto dos exercícios deste capítulo.
- **Documentação oficial:** documentação do GCC em `gcc.gnu.org/onlinedocs/` e referência de C em `cppreference.com`.
- **Pergunta aberta:** por que um programa precisa de um ponto de entrada chamado `main`? O que aconteceria se houvesse duas funções com esse nome?

## C1.14 Autoverificação final

- [x] A analogia aparece antes da definição formal, com limites declarados? Sim, em C1.4.
- [x] Cada regra nova tem um "porquê"? Sim, para `main`, `int`, aspas e ponto e vírgula.
- [x] Há três exemplos resolvidos em dificuldade crescente? Sim, em C1.6.
- [x] Todos os exemplos têm verificação? Sim.
- [x] Há visualização em ASCII? Sim, em C1.7.
- [x] Há quadro de erros com causa e correção? Sim, em C1.8, incluindo código que não compila.
- [x] O resumo tem entre 5 e 10 linhas e uma cola? Sim, em C1.9.
- [x] Há pelo menos 15 exercícios divididos em 5, 5 e 5? Sim, em C1.10.
- [x] O gabarito comentado fica em seção separada e aponta onde a maioria erra? Sim, em C1.11.
- [x] O código compila com `gcc -Wall -Wextra -Werror -pedantic -std=c11`? Sim.
- [x] Nenhum termo técnico foi usado antes de ser definido? Sim.
- [x] Um aluno que leu apenas este capítulo consegue resolver os exercícios? Sim.

---

## Campos para a plataforma FORGE

### `objetivo`

Entender o caminho completo entre um arquivo de texto C e a mensagem impressa na tela, escrevendo e executando o primeiro programa.

### `blocos`

1. **Objetivo:** ler o enunciado do mini-projeto do capítulo.
2. **Explicação curta:** fonte é texto, compilador traduz, executável roda.
3. **Exemplo visual:** diagrama de quatro etapas em C1.7.
4. **Exemplo resolvido:** Exemplo 1 de C1.6.
5. **Pequeno exercício:** questões 1, 2, 3 e 5 de C1.10.
6. **Verificação:** comparar a saída obtida com o bloco de saída esperada.
7. **Resumo:** cola rápida de C1.9.
8. **Próxima etapa:** capítulo C2, tipos e variáveis.

### `questoes`

1. O que é um arquivo-fonte?
   - A) Um arquivo que só contém imagens.
   - B) Um arquivo de texto com instruções escritas na linguagem C.
   - C) O resultado final que o computador executa.
   - D) Um arquivo que guarda senhas.
   - **Resposta: B.** O fonte é o texto que você escreve; o executável é o resultado.

2. O que faz o compilador?
   - A) Executa o programa diretamente.
   - B) Formata o disco.
   - C) Traduz o código-fonte para um programa executável.
   - D) Escreve o código por você.
   - **Resposta: C.** A tradução vem antes da execução.

3. Para que serve `#include <stdio.h>`?
   - A) Traz para o programa as declarações de funções como `printf`.
   - B) Imprime "stdio.h" na tela.
   - C) Encerra o programa.
   - D) Cria uma variável chamada stdio.
   - **Resposta: A.** A diretiva inclui declarações, não imprime nada.

4. O que significa `int main(void)`?
   - A) Uma variável chamada main.
   - B) Uma biblioteca de entrada e saída.
   - C) Um comentário explicativo.
   - D) A função principal, que retorna um número inteiro e não recebe parâmetros.
   - **Resposta: D.** `main` é o ponto de entrada.

5. O que faz `printf("Ola\n")`?
   - A) Lê um número do teclado.
   - B) Escreve "Ola" seguido de quebra de linha na saída padrão.
   - C) Libera memória.
   - D) Abre um arquivo.
   - **Resposta: B.** `printf` escreve; a leitura vem em outro capítulo.

6. O que representa `\n` dentro de uma string?
   - A) O caractere "n" em destaque.
   - B) Uma tabulação.
   - C) Uma quebra de linha.
   - D) O fim do programa.
   - **Resposta: C.** É uma sequência de escape.

7. O que indica `return 0;` no final de `main`?
   - A) Que o programa terminou com sucesso.
   - B) Que o programa deve imprimir o número zero.
   - C) Que o programa deve ser reiniciado.
   - D) Que houve erro.
   - **Resposta: A.** O número volta ao terminal, não à tela.

8. Qual comando compila com avisos tratados como erro e padrão C11?
   - A) `gcc ola.txt`
   - B) `gcc -E ola.c`
   - C) `gcc ola.c -o ola -Wall`
   - D) `gcc -Wall -Wextra -Werror -pedantic -std=c11 ola.c -o ola`
   - **Resposta: D.** As quatro opções aparecem juntas.

9. O que acontece na etapa de ligação?
   - A) O texto é salvo em disco pela primeira vez.
   - B) O código-objeto é ligado às funções de biblioteca necessárias, gerando o executável.
   - C) O programa pede dados ao usuário.
   - D) O compilador é instalado.
   - **Resposta: B.** É nela que `printf` é resolvida.

10. Por que usar aspas retas no código?
    - A) Aspas curvas são mais rápidas.
    - B) Aspas curvas mudam a cor do texto.
    - C) O compilador espera aspas retas do ASCII; aspas curvas são caracteres diferentes e geram erro.
    - D) Aspas curvas evitam avisos.
    - **Resposta: C.** É um problema de caractere, não de estilo.

### `sintese_feynman`

Explique com as suas palavras, em pelo menos 30 caracteres, o que acontece entre o arquivo `ola.c` e a mensagem na tela. Use uma analogia criada por você, diferente da receita deste capítulo, e um exemplo que você inventou. Não copie frases do texto.

### `cartoes_erro`

1. Por que `printf` sem `#include <stdio.h>` é um problema?
2. O que acontece se faltar `;` depois de `printf(...)`?
3. Por que é preciso compilar de novo depois de salvar o fonte?
4. O que significa `return 0;` e onde esse número aparece?
5. Por que `gcc -E ola.c` não gera um executável?

### `laboratorio`

- **Simulação:** desenhe em papel as quatro etapas da compilação e escreva, ao lado de cada caixa, qual arquivo existe naquele ponto.
- **Execução real:** crie `ola.c`, compile com as opções completas, execute, rode `gcc -E` e compare o início do arquivo expandido com o fonte original. Registre a saída como evidência.

### `indicadores`

Domínio (aulas com selo), Revisões vencidas, Erros a refazer, Labs com evidência, Módulos em andamento, Horas registradas.

### `projeto`

Nenhum neste capítulo. Este capítulo prepara o projeto MP1 da seção 15 do Prompt Mestre; não o inicie antes do capítulo C3.

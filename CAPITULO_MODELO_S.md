# Capítulo modelo — Engenharia de Software

**Código didático:** S1 · **Tema:** Git: registrar uma mudança com commit · **Nível:** Zero · **Área:** Engenharia de Software

**Metadados da plataforma:** na plataforma FORGE, este tema aparece em "Fundamentos do desenvolvimento". O código `S1` é uma etiqueta didática deste Prompt Mestre; não é um ID da aplicação (seção 18.3 do `PROMPT_MESTRE.md`).

Este arquivo é o padrão ouro do Prompt Mestre para a trilha de Engenharia de Software. Ele mostra na prática como aplicar as seções 3, 4, 6, 10 e 18 do `PROMPT_MESTRE.md`. Quando for gerar outro capítulo, use esta estrutura como referência de completude, mas escreva sempre com as suas próprias palavras.

**Fonte dos exemplos:** todos os comandos apresentados são comandos reais do Git. As respostas dos comandos são descritas com palavras próprias ou marcadas como ilustração explícita, porque variam com a versão e o idioma do programa. Nenhum comando Git foi executado neste repositório durante a escrita deste capítulo.

---

## S1.1 Objetivos de aprendizagem

Ao final deste capítulo você será capaz de:

1. Explicar, com as suas palavras, a diferença entre diretório de trabalho, área de preparação e repositório.
2. Inicializar um repositório local com `git init` e definir autor com `git config user.name` e `git config user.email`.
3. Usar `git status` para dizer se um arquivo está ainda sem controle, preparado ou já registrado.
4. Preparar uma mudança com `git add` e criar um commit com `git commit -m`, usando mensagem curta no imperativo.
5. Consultar o histórico com `git log --oneline` e explicar o identificador hexadecimal de um commit.
6. Usar `git diff` para comparar o que mudou e ainda não foi preparado.
7. Decidir se uma alteração deve ou não entrar no próximo commit, justificando a escolha.
8. Diagnosticar e corrigir os erros comuns de quem faz o primeiro commit, com apoio de `git status`.

## S1.2 Pré-requisitos

**Nenhum módulo prévio é necessário.** Na plataforma, este é o ponto de partida de "Fundamentos do desenvolvimento". Você precisa apenas saber ler e escrever texto e criar uma pasta no seu computador. Todo termo novo é definido quando aparece.

Chamamos de **terminal** a janela onde você digita comandos e recebe respostas em texto. O **prompt** é o sinal que mostra que o terminal está esperando o seu comando. Um **arquivo** é um lugar no disco onde guardamos texto, e uma **pasta** é um lugar que agrupa arquivos. Um **repositório** é uma pasta com um histórico de mudanças registradas pelo Git. Um **commit** é um registro salvo nesse histórico: ele guarda o conteúdo daquele momento, quem o criou e uma mensagem que explica a mudança.

### Miniteste de prontidão

Responda antes de continuar. As respostas estão logo abaixo.

1. O que é um terminal?
2. O que é um arquivo?
3. O que é um commit, em uma frase?

<details>
<summary>Respostas do miniteste</summary>

1. Uma janela onde você digita comandos e lê as respostas em texto.
2. Um lugar no disco onde guardamos informação, neste capítulo informação em texto.
3. Um registro no histórico do repositório, com conteúdo, autor e mensagem.

Se você acertou as três, pode seguir. Se errou alguma, leia o parágrafo anterior mais uma vez; nenhum conteúdo deste capítulo depende de mais do que isso.

</details>

## S1.3 Motivação: por que isso existe?

Imagine que você escreveu um texto de estudo. No dia seguinte, mudou uma frase. Na semana seguinte, mudou outra. Se você guarda só a versão mais recente, não consegue responder a perguntas simples: qual frase estava lá antes, quando a mudança aconteceu e por quê. A saída comum é criar pastas com nomes como `estudo_final`, `estudo_final_2` e `estudo_final_agora_sim`. Isso funciona por pouco tempo e depois vira confusão: ninguém sabe qual pasta é a correta.

O Git resolve esse problema registrando cada mudança importante como um commit. Ele não depende de nomes criados à mão: cada registro entra em uma sequência e recebe um identificador próprio. Assim você pode perguntar ao histórico o que aconteceu, em vez de tentar lembrar.

O Git foi criado em 2005 por Linus Torvalds no contexto do desenvolvimento do kernel Linux. A necessidade era coordenar contribuições vindas de muitas pessoas sem exigir que todas trabalhassem sobre uma única cópia compartilhada. O desenho do Git permite que cada máquina tenha seu próprio histórico completo.

> 🌍 **No mundo real:** quando uma equipe publica uma correção e depois precisa saber exatamente o que mudou, ela consulta os commits. Um texto bem escrito no commit é a resposta que a pessoa de plantão encontra primeiro.

**Onde isso aparece no mundo real**

| Área | O que aparece | Ligação com o commit |
|---|---|---|
| Matemática | O identificador do commit vem de uma função de resumo chamada de **hash**, que transforma conteúdo em número; a forma completa tem 40 caracteres hexadecimal, como você verá em S1.5.4. | O número aponta para uma versão exata do histórico sem depender de um nome escolhido por pessoa. |
| Linguagem C | O código-fonte de um programa, por exemplo `programa.c`, editado no editor e preparado com `git add programa.c`. Lembra do capítulo C1? Aqui ele aparece de novo: o arquivo de texto que você escreveu no começo dos estudos. | O commit guarda a versão do código que você decidiu registrar naquele momento. |
| Redes | O envio de commits locais para um repositório remoto, operação chamada de **push**; repositório remoto é uma cópia do histórico em outro computador ou servidor. O assunto volta em S2. | O commit é a unidade compartilhada entre máquinas. Neste capítulo nada é enviado a servidor. |
| Engenharia de Software | A revisão da mudança por outra pessoa e a execução de testes antes de registrar. | A mensagem do commit conta o que foi revisado e testado, para que a próxima pessoa entenda a decisão. |

## S1.4 Explicação "para 5 anos"

Pense em uma bancada de trabalho. Você escreve e rabisca folhas direto na bancada. Ao lado, há uma bandeja. Quando uma folha está boa, você a coloca na bandeja. Só quando a bandeja está como você quer, você fecha aquelas folhas dentro de uma caixa, escreve na etiqueta o que há dentro e guarda a caixa em um arquivo. A caixa ganha um número de série.

A bancada é o **diretório de trabalho**: é onde você mexe livremente. A bandeja é a **área de preparação**: é onde você separa o que vai entrar. A caixa etiquetada é o **commit**: é o registro fechado no **repositório**. O número de série é o identificador do commit.

> 💡 **Intuição**: `git add` é o gesto de colocar a folha na bandeja. `git commit -m` é o gesto de fechar a caixa, escrever a etiqueta e guardá-la. `git status` é você olhando para os três lugares antes de decidir o próximo passo.

**Onde a analogia funciona:** ela mostra por que existe uma etapa entre "editei" e "registrei". Você pode mexer em várias folhas e escolher quais vão para a caixa. Também explica por que cada caixa tem número próprio: duas caixas com conteúdo diferente não podem ser a mesma caixa.

**Onde a analogia quebra:** uma caixa de papelão pode ser aberta e alterada; um commit, no fluxo que você vai aprender aqui, não é editado. Se o conteúdo desejado é outro, você cria um novo commit. Além disso, a bancada continua com rabiscos depois de a caixa ser fechada: registrar uma mudança não apaga o que ainda está em edição.

**Erros comuns nesta seção**

| Erro | Causa | Correção |
|---|---|---|
| Confundir a bandeja com o repositório | Acha que `git add` já guardou o registro | A bandeja é escolha; `git commit -m` é o registro |
| Achar que fechar a caixa limpa a bancada | Interpreta "guardar" como "apagar o que ficou pendente" | Edição pendente continua pendente e aparece em `git status` |

## S1.5 Explicação aprofundada

### S1.5.1 As três áreas

| Área | Nome técnico | O que guarda | Como você a observa |
|---|---|---|---|
| Bancada | **diretório de trabalho** | Os arquivos que você abre, escreve e salva | Editando o arquivo normalmente |
| Bandeja | **área de preparação**, também chamada de **index** ou **staging** | As mudanças que você escolheu para o próximo commit | `git status` |
| Arquivo | **repositório** | A sequência de commits já registrados | `git log --oneline` |

Uma linguagem precisa importa aqui. Dizer que um arquivo está "salvo" não diz muito: salvar no editor apenas grava no disco, ou seja, no diretório de trabalho. O arquivo só entra no histórico quando passa pela área de preparação e depois vira commit.

> 🧠 **Por quê?** Por que não registrar tudo automaticamente? Porque nem toda alteração está pronta. Você pode estar no meio de uma correção e não querer guardar um trecho incompleto. A área de preparação dá a você o direito de escolher o que entra em cada registro.

### S1.5.2 Palavras que aparecem antes do primeiro comando

Antes de digitar qualquer coisa, conheça os nomes que o Git usa:

- **Repositório local:** o histórico completo guardado na própria pasta, sem depender de servidor ou de conexão. Tudo o que faremos neste capítulo é local.
- **Branch:** uma linha de trabalho nomeada dentro do repositório. O Git cria uma branch ao inicializar o repositório. O nome padrão pode ser `main` ou `master`, conforme a configuração da máquina ou do Git instalado. Aqui usaremos a palavra "branch" apenas para ler o que `git status` mostra.
- **Arquivo ainda sem controle (não rastreado):** arquivo que existe na pasta, mas que o Git ainda não acompanha. Ele aparece em `git status` e não aparece em `git diff`.
- **Mudança preparada:** alteração que já foi para a área de preparação com `git add`.
- **Mensagem de commit:** texto curto que descreve a mudança, escrito no imperativo, como uma ordem dada ao leitor: "Adiciona notas de estudo", e não "Adicionei notas de estudo" nem "notas".

> 🔁 **Revisão rápida:** Lembra do capítulo C1? Aqui ele aparece de novo: o "Olá, mundo" com primeiro commit do marco F0 do plano integrado. Agora você vê a parte do commit separada do código C, sem precisar de compilador.

### S1.5.3 O primeiro repositório, passo a passo

Use uma pasta temporária só para este estudo. Crie-a com o gerenciador de arquivos do seu sistema e abra um terminal dentro dela. O comando que transforma essa pasta em repositório é:

```text
git init
```

O Git responde que inicializou um repositório vazio na pasta atual. Não decore essa resposta: ela muda com a versão e com o idioma. Antes de criar o primeiro commit, diga ao Git quem será o autor:

```text
git config user.name "Seu Nome"
git config user.email "seu@email"
```

Substitua `Seu Nome` e `seu@email` pelos seus dados. Use um endereço de exemplo se estiver apenas praticando; nada é publicado neste capítulo.

Crie, no editor de texto, um arquivo chamado `notas.txt` com uma linha:

```text
Git registra o que mudou.
```

Agora pergunte ao estado atual:

```text
git status
```

**Pausa de aprendizagem ativa.** Antes de ler a resposta, preveja o que `git status` dirá sobre `notas.txt`: você espera vê-lo como preparado ou como ainda sem controle? Escreva sua previsão em papel.

<details>
<summary>Resposta da pausa</summary>

O Git informa em qual branch você está, diz que não há commits ainda e lista `notas.txt` entre os arquivos ainda sem controle. Esse é o diretório de trabalho: o arquivo existe, mas o Git ainda não o acompanha.

</details>

Coloque o arquivo na área de preparação:

```text
git add notas.txt
```

**Pausa de aprendizagem ativa.** Preveja agora o que mudará no próximo `git status`: o arquivo continuará na mesma condição ou passará para a área de preparação? Justifique a previsão em uma frase antes de abrir a resposta.

<details>
<summary>Resposta da pausa</summary>

Se você repetir `git status`, o arquivo aparecerá como mudança preparada, pronta para virar commit. O comando `git add` recebe o caminho do arquivo; ele não escreve o registro no histórico.

</details>

Fecha a caixa:

```text
git commit -m "Adiciona notas de estudo"
```

A mensagem entre aspas é a etiqueta do commit. Ela está no imperativo, começa com verbo e diz o que foi feito. Por fim, consulte o histórico:

```text
git log --oneline
```

A resposta traz uma linha por commit: um trecho do identificador seguido da mensagem. Veja um modelo ilustrativo:

```text
0123456 Adiciona notas de estudo
```

Os caracteres `0123456` são ilustração; no seu terminal aparecerá outro trecho hexadecimal. O Git pode mostrar mais caracteres quando precisar distinguir um commit de outro.

> 🧠 **Por quê?** Por que `git config user.name` e `git config user.email` vêm antes do commit? Porque cada commit registra autor. Sem essas informações, o Git avisa que não consegue determinar quem está fazendo a mudança e não cria o registro.

> 🧠 **Por quê?** Por que conferir `git status` antes e depois de `git add`? Porque é assim que você prova que a mudança saiu da bancada e foi para a bandeja. Sem essa conferência, é comum achar que `git add` já salvou o commit.

> 🧠 **Por quê?** Por que a mensagem usa o imperativo? Porque ela é lida como uma instrução para quem consulta o histórico: "Adiciona notas de estudo" responde à pergunta "o que este commit faz?". Uma frase no passado descreve quem escreveu, não a mudança em si.

### S1.5.4 O que é um commit, afinal

Um **commit** é um registro imutável no fluxo que estamos usando. Ele contém o conteúdo dos arquivos naquele momento, o autor configurado, a mensagem e um identificador. Esse identificador é um número escrito em **hexadecimal**, base que usa os dígitos de `0` a `9` e as letras de `a` a `f`. O Git emprega o algoritmo **SHA-1** para calculá-lo, e a forma completa tem **40 caracteres hexadecimal**. Veja um modelo sintético, criado apenas para mostrar o tamanho:

```text
0123456789012345678901234567890123456789
```

Esse valor é ilustração, não veio de nenhum repositório real. Na prática, você nunca precisa digitar os 40 caracteres: `git log --oneline` mostra uma forma abreviada para leitura.

> 🧠 **Por quê?** Por que o commit tem identificador? Porque ele permite apontar para uma versão exata do histórico sem depender de nomes escolhidos por pessoas. Se o conteúdo desejado for outro, o identificador será outro; é assim que o Git distingue um registro do seguinte.

> ⚠️ **Cuidado:** a abreviagem mostrada por `git log --oneline` não tem tamanho fixo garantido para sempre. O Git pode alongá-la quando precisar evitar que dois commits recebam a mesma abreviagem. Em repositórios SHA-1, que são o padrão hoje, a forma completa continua com 40 caracteres; um repositório configurado com SHA-256 usa 64.

**Mensagem de commit: código ruim (antes) e código bom (depois).**

Antes, evite esta forma:

```text
git commit -m "mudei umas coisas"
```

Depois, prefira esta:

```text
git commit -m "Corrige data da reunião"
```

A versão ruim usa o passado, não nomeia a mudança e obriga quem lê o histórico a abrir o arquivo para descobrir o que aconteceu. A versão boa começa com verbo no imperativo, diz qual parte do arquivo mudou e cabe em uma linha curta. Os dois comandos são sintaticamente reais: o primeiro aparece apenas como contraexemplo didático.

### S1.5.5 `git diff`: comparar antes de registrar

Depois do primeiro commit, altere `notas.txt` no editor, acrescentando uma segunda linha:

```text
Git registra o que mudou.
Também mostra o que mudou antes de registrar.
```

Execute:

```text
git diff
```

O Git mostra o nome do arquivo e as linhas comparadas: o conteúdo anterior aparece marcado com `-` e o conteúdo novo com `+`. Por padrão, `git diff` compara o diretório de trabalho com a área de preparação. Ele responde à pergunta "o que eu mudei e ainda não preparei?".

> 🧠 **Por quê?** Por que olhar `git diff` antes de `git add`? Porque você pode descobrir uma alteração acidental. Uma linha apagada por engano aparece ali e pode ser corrigida antes de entrar no commit.

> ⚠️ **Cuidado:** `git diff` não lista arquivos recém-criados e ainda sem controle. Para encontrar esses arquivos, use `git status`.

### S1.5.6 Um detalhe sobre o nome do branch

O `git status` informa o nome da branch atual. Dependendo da configuração, o nome padrão será `main` ou `master`. Isso não muda nenhum comando deste capítulo: `git init`, `git add`, `git commit -m`, `git status`, `git diff` e `git log --oneline` funcionam da mesma forma nos dois casos. A única diferença é o texto exibido na resposta.

> 🎯 **Resumo do trecho:** diretório de trabalho é onde você edita; área de preparação é onde você escolhe; repositório é onde o histórico fica. O nome do branch é informação de leitura, não um obstáculo.

**Erros comuns nesta seção**

| Erro | Causa | Correção |
|---|---|---|
| Rodar `git commit -m` antes de `git add` | Confundir arquivo salvo com mudança preparada | Confira `git status`: a mudança precisa aparecer como preparada |
| Usar mensagem no passado ou vaga | Descrever quem escreveu, em vez do que mudou | Escreva no imperativo, como `Corrige data da reunião` |
| Achar que `git diff` lista arquivos novos | Supor que toda diferença entra na comparação | Use `git status` para localizar arquivos ainda sem controle |

## S1.6 Exemplos resolvidos passo a passo

### Exemplo 1 — Trivial: o primeiro commit de um arquivo

**Enunciado.** Em uma pasta temporária, crie `ideia.txt` com o conteúdo `Estudar Git hoje.` e registre esse arquivo em um único commit com a mensagem `Adiciona ideia de estudo`.

**Raciocínio.** Precisamos transformar a pasta em repositório, definir autor, conferir o estado, preparar o arquivo, criar o commit e consultar o histórico. Cada passo tem uma pergunta que o comando responde.

**Resolução.**

```text
git init
git config user.name "Seu Nome"
git config user.email "seu@email"
git status
git add ideia.txt
git status
git commit -m "Adiciona ideia de estudo"
git log --oneline
```

O arquivo `ideia.txt` é criado no editor com uma linha:

```text
Estudar Git hoje.
```

**Pausa de aprendizagem ativa.** Antes de conferir, preveja o estado que o segundo `git status` mostrará para `ideia.txt` e o que `git log --oneline` mostrará se o commit tiver funcionado. Anote as duas previsões.

<details>
<summary>Resposta da pausa</summary>

O segundo `git status` mostra `ideia.txt` como preparado. Se o commit funcionou, `git log --oneline` mostra uma linha com a mensagem `Adiciona ideia de estudo`.

</details>

**Verificação.** O último `git status` antes do commit mostra `ideia.txt` como preparado. Depois do commit, `git log --oneline` mostra uma linha cuja mensagem é `Adiciona ideia de estudo`. Se o histórico estiver vazio, o commit não foi criado.

**O que este exemplo ensina.** A sequência inicial tem duas partes: preparar o ambiente (`git init` e `git config`) e registrar a mudança (`git add` e `git commit -m`). A palavra "commit" sozinha não descreve o processo inteiro.

### Exemplo 2 — Médio: uma mudança depois do primeiro commit

**Enunciado.** Partindo do exemplo 1, troque o conteúdo de `ideia.txt` para `Estudar Git hoje e amanhã.` e registre a nova versão com a mensagem `Atualiza plano de estudo`.

**Raciocínio.** O arquivo já é acompanhado pelo Git. A alteração acontece no diretório de trabalho; `git diff` permite conferi-la antes de preparar. Lembra da seção S1.5? Aqui ela aparece de novo: a comparação entre diretório de trabalho e área de preparação. Depois de `git add`, o commit guarda a nova versão. O histórico passa a ter duas linhas, uma para cada versão registrada.

**Resolução.**

```text
git status
git diff
git add ideia.txt
git status
git commit -m "Atualiza plano de estudo"
git log --oneline
```

Conteúdo do arquivo depois da edição:

```text
Estudar Git hoje e amanhã.
```

**Verificação.** `git diff` mostra a linha antiga com `-` e a nova com `+`. Após o commit, `git log --oneline` mostra duas linhas: a mensagem `Atualiza plano de estudo` aparece na mais recente e `Adiciona ideia de estudo` na anterior. As duas linhas têm trechos iniciais de identificador diferentes.

**O que este exemplo ensina.** Um commit não apaga o anterior. Ele acrescenta um registro. Por isso a mensagem precisa dizer o que mudou em relação ao estado anterior.

### Exemplo 3 — Desafiador: separar o que entra no commit

**Enunciado.** Você tem dois arquivos novos na pasta do exemplo 2: `resumo.txt` e `rascunho.txt`. Quer registrar apenas `resumo.txt` agora e deixar o rascunho fora do commit. Escreva os comandos e diga o que aparece depois.

**Raciocínio.** O critério de escolha é a área de preparação, não a pasta inteira. Se apenas `resumo.txt` receber `git add`, o commit conterá somente ele. O rascunho continua no diretório de trabalho como arquivo ainda sem controle.

**Resolução.**

```text
git status
git add resumo.txt
git status
git commit -m "Adiciona resumo de estudo"
git status
git log --oneline
```

Conteúdo de `resumo.txt`:

```text
Git separa o que vai para cada commit.
```

Conteúdo de `rascunho.txt`:

```text
Ideia ainda sem revisão.
```

**Pausa de aprendizagem ativa.** Antes de ler a verificação, preveja o que o último `git status` dirá sobre `rascunho.txt` depois do commit. O arquivo desaparecerá da resposta ou continuará listado? Explique o motivo da sua previsão.

<details>
<summary>Resposta da pausa</summary>

`rascunho.txt` continua listado como ainda sem controle, porque nunca foi para a área de preparação. O commit registrou apenas `resumo.txt`.

</details>

**Verificação.** O `git status` logo após `git add` mostra `resumo.txt` como preparado e `rascunho.txt` como ainda sem controle. Depois do commit, `git status` continua mostrando `rascunho.txt`, provando que ele não entrou no registro. `git log --oneline` mostra uma linha nova com `Adiciona resumo de estudo` e não mostra menção ao rascunho. Além disso, `git diff` não exibe `rascunho.txt`, porque arquivos ainda sem controle não aparecem nessa comparação.

**O que este exemplo ensina.** A decisão sobre o conteúdo de um commit acontece no `git add`. Saber dizer "este arquivo entra, aquele fica de fora" é uma parte central de registrar mudanças com cuidado.

**Erros comuns nesta seção**

| Erro | Causa | Correção |
|---|---|---|
| Preparar os dois arquivos quando se queria registrar só um | Usar a pasta inteira como critério de escolha | Escolha o arquivo no `git add` e confirme com `git status` |
| Concluir que o commit falhou porque `git diff` ficou vazio | Esperar que a comparação mostre arquivos ainda sem controle | Consulte `git status` e `git log --oneline` |

## S1.7 Visualização

O caminho de uma alteração até o histórico:

```text
 +-----------------------+   git add   +------------------------+
 | diretório de trabalho | ----------> | área de preparação     |
 | arquivos que você edita|             | (index / staging)      |
 +-----------------------+             +------------------------+
                                                |
                                                | git commit -m "..."
                                                v
                                       +------------------------+
                                       | repositório            |
                                       | sequência de commits   |
                                       +------------------------+

 git status        -> mostra o estado das três áreas
 git diff          -> compara diretório de trabalho com área de preparação
 git log --oneline -> lê o repositório e mostra o histórico
```

**Descrição do diagrama:** a primeira caixa representa os arquivos que você edita. A seta marcada com `git add` leva à segunda caixa, que representa as mudanças escolhidas. A seta seguinte, marcada com `git commit -m`, leva à terceira caixa, que representa o histórico. As três linhas abaixo indicam para onde olhar: `git status` informa o estado das áreas, `git diff` compara as duas primeiras e `git log --oneline` consulta a terceira.

Uma sequência de commits vista pelo `git log --oneline`:

```text
[ido mais recente ] <trecho hexadecimal> Atualiza plano de estudo
[                 ] <trecho hexadecimal> Adiciona ideia de estudo
[mais antigo      ]
```

**Descrição do segundo desenho:** as linhas são lidas de cima para baixo, do commit mais recente para o mais antigo. Cada linha traz um trecho do identificador e a mensagem. Os trechos entre colchetes explicam a ordem; eles não fazem parte da resposta do comando.

**Erros comuns nesta seção**

| Erro | Causa | Correção |
|---|---|---|
| Ler o histórico de baixo para cima | Achar que a primeira linha exibida é a mais antiga | Em `git log --oneline`, a primeira linha é a mais recente |
| Supor que `git status` consulta uma única área | Ver apenas a seta entre as caixas do diagrama | A descrição do diagrama diz que `git status` informa as três áreas |

## S1.8 Erros comuns e armadilhas

| Erro | Por que acontece | Como evitar |
|---|---|---|
| Rodar `git commit -m` sem antes usar `git add` | A intuição de que salvar o arquivo já basta | Rode `git status` e confirme que a mudança está preparada |
| Achar que `git add` já registrou o commit | As duas ações parecem "salvar" | Confira com `git log --oneline`: sem commit novo, o histórico continua igual |
| Escrever mensagem no passado, como "mudei o arquivo" | Costume de descrever o que a pessoa fez | Escreva no imperativo: "Corrige data da reunião" |
| Escrever mensagem vaga, como "mudanças" | Pressa em fechar a etapa | Diga o que mudou em poucas palavras |
| Esquecer `git config user.name` e `git config user.email` | Parece configuração opcional | Defina autor antes do primeiro commit; o Git avisa quando falta |
| Esperar que `git diff` mostre um arquivo recém-criado | Acha que toda diferença aparece na comparação | Use `git status` para arquivos ainda sem controle |
| Rodar `git init` em uma pasta que já tinha outros arquivos | Não conferiu onde o terminal estava | Crie uma pasta temporária exclusiva para o estudo |
| Editar o arquivo depois do commit e achar que o commit mudou | Confunde arquivo salvo com registro no histórico | Veja a nova alteração com `git diff` e registre-a com `git add` e `git commit -m` |

> ⚠️ **Cuidado:** os trechos de identificador e os valores de hash mostrados neste capítulo são ilustrações didáticas. Use sempre os valores que aparecerem no seu próprio terminal.

## S1.9 Resumo do capítulo

- Repositório é a pasta com histórico; diretório de trabalho é onde você edita.
- A área de preparação é a etapa de escolha entre editar e registrar.
- `git init` cria o repositório; `git config` define nome e e-mail do autor.
- `git status` diz o que está ainda sem controle, preparado ou já registrado.
- `git diff` mostra o que mudou e ainda não foi preparado.
- `git add` prepara; `git commit -m` cria o registro com mensagem imperativa e curta.
- `git log --oneline` mostra o histórico com trecho do identificador e mensagem.
- O identificador completo tem 40 caracteres hexadecimal calculados com SHA-1.
- O branch inicial pode se chamar `main` ou `master`; os comandos não mudam.

**Cola rápida:**

| O que você quer | Escreva |
|---|---|
| Criar o repositório local | `git init` |
| Definir o autor | `git config user.name "Seu Nome"` e `git config user.email "seu@email"` |
| Saber o estado atual | `git status` |
| Preparar um arquivo | `git add notas.txt` |
| Criar o commit | `git commit -m "Adiciona notas de estudo"` |
| Ver o histórico resumido | `git log --oneline` |
| Comparar o que não foi preparado | `git diff` |

## S1.10 Exercícios

Não olhe o gabarito antes de tentar.

### Fixação

1. O que é o diretório de trabalho?
2. O que faz `git add notas.txt`?
3. Para que serve `git status`?
4. Escreva o comando que cria um commit com a mensagem `Adiciona notas de estudo`.
5. O que mostra `git log --oneline`?

### Aplicação

6. Você criou `novo.txt` e ainda não rodou `git add`. O que `git status` dirá sobre ele?
7. Depois de `git add resumo.txt`, você edita `resumo.txt` outra vez antes do commit. O que acontece com essas duas versões?
8. Por que `git diff` não mostra um arquivo recém-criado e ainda sem controle?
9. Escreva a sequência de comandos para registrar uma alteração em `notas.txt` com a mensagem `Corrige data da reunião` e confirmar o resultado.
10. Em uma frase, explique a diferença entre `git add` e `git commit -m`.

### Desafio

11. Você tem `a.txt` e `b.txt` como arquivos novos e quer um commit contendo apenas `a.txt`. Escreva os comandos e diga o que `git status` mostrará depois.
12. Uma pessoa diz: "meu commit desapareceu porque o `git diff` não mostra nada". Explique o erro usando `git status` e `git log --oneline`.
13. Por que `Corrigido o erro` é uma mensagem pior que `Corrige calculo de data`?
14. O identificador completo de um commit tem 40 caracteres hexadecimal. O que essa informação permite dizer sobre dois commits diferentes?
15. O branch inicial pode se chamar `main` ou `master`. O que muda no seu fluxo de primeiro commit?

## S1.11 Gabarito comentado

### Fixação

1. É a pasta onde os arquivos são editados e salvos antes de qualquer preparação. **Onde a maioria erra:** responde "é o lugar onde o Git guarda o histórico", trocando diretório de trabalho por repositório.
2. Coloca a versão atual daquele arquivo na área de preparação. **Onde a maioria erra:** acha que o comando cria o commit sozinho.
3. Informa o estado das áreas, o nome da branch e quais arquivos estão ainda sem controle ou preparados. **Onde a maioria erra:** reduz a resposta a "mostra os arquivos", esquecendo a área de preparação.
4. `git commit -m "Adiciona notas de estudo"`. **Onde a maioria erra:** escreve `git commit "Adiciona notas de estudo"` e esquece a opção `-m`.
5. Uma linha por commit, com trecho do identificador e a mensagem. **Onde a maioria erra:** espera ver os 40 caracteres completos nesse comando.
6. O arquivo aparece como ainda sem controle. **Onde a maioria erra:** acha que ele é ignorado pelo Git e não aparece em lugar nenhum.
7. A versão preparada fica na área de preparação e a edição mais recente fica no diretório de trabalho; `git status` mostra as duas situações para o mesmo arquivo. **Onde a maioria erra:** supõe que a segunda edição substitui automaticamente o que foi preparado.
8. Porque `git diff` compara arquivos que o Git já acompanha; um arquivo ainda sem controle precisa ser localizado com `git status`. **Onde a maioria erra:** acha que a comparação sempre inclui qualquer arquivo da pasta.
9. `git status`, `git diff`, `git add notas.txt`, `git status`, `git commit -m "Corrige data da reunião"`, `git log --oneline`. **Onde a maioria erra:** pula a conferência com `git status` e não percebe que a alteração ficou de fora do commit.
10. `git add` escolhe o que entra; `git commit -m` registra a escolha no histórico. **Onde a maioria erra:** usa as duas expressões como sinônimo de "salvar".

### Desafio

11. `git status`, `git add a.txt`, `git status`, `git commit -m "Adiciona arquivo a"`, `git status`. Depois do commit, `b.txt` continua aparecendo como arquivo ainda sem controle. **Onde a maioria erra:** prepara os dois arquivos e depois tenta "tirar" um deles do commit, quando o correto era nunca tê-lo preparado.
12. `git diff` mostra apenas o que não foi preparado; saber se existe commit é papel de `git log --oneline`, e `git status` informa o que ficou pendente. **Onde a maioria erra:** conclui que o histórico está vazio a partir de uma ferramenta que não consulta o histórico.
13. `Corrigido o erro` está no passado, não diz o que mudou e não segue a forma de ordem usada para mensagens; `Corrige calculo de data` começa com verbo no imperativo e nomeia a mudança. **Onde a maioria erra:** avalia apenas o tamanho e acha que qualquer frase curta serve.
14. Commits diferentes são reconhecidos por identificadores diferentes; a abreviagem exibida no histórico serve para leitura e pode ser estendida quando necessário. **Onde a maioria erra:** confunde o número do commit com o número de linhas do arquivo ou com a quantidade de commits.
15. Nada nos comandos: a diferença aparece apenas no nome da branch informado por `git status`. **Onde a maioria erra:** tenta usar o nome da branch como se fosse parte obrigatória de `git commit -m`.

> 🎯 **Resumo do gabarito:** a maioria dos erros vem de pular `git status`. Ele é a ferramenta que permite provar em qual área a mudança está antes de registrar.

## S1.12 Mini-projeto prático

**Objetivo.** Construir, em uma pasta temporária local, um histórico com dois commits: um para criar um arquivo e outro para alterá-lo. Nada deve ser publicado.

**Requisitos.**

1. Criar uma pasta exclusiva para o projeto e abrir o terminal nela.
2. Executar `git init`, `git config user.name` e `git config user.email`.
3. Criar `plano.txt` com uma meta de estudo e registrar com mensagem no imperativo.
4. Alterar `plano.txt`, usar `git diff`, preparar e registrar a nova versão com outra mensagem no imperativo.
5. Terminar com `git log --oneline` mostrando duas linhas e `git status` sem mudanças pendentes.

**Dicas progressivas.** Lembra do capítulo S1.4? Aqui ele aparece de novo: a bandeja da analogia é o lugar que você confere antes de fechar a caixa. Comece com um commit de cada vez e confira `git status` depois de cada comando. Se `git log --oneline` mostrar uma linha só, você esqueceu o segundo `git add` ou o segundo `git commit -m`. Se `git status` continuar mostrando alteração, há edição posterior ao último commit.

**Critério de correção.** Outra pessoa abre a mesma pasta, executa `git log --oneline`, lê duas mensagens diferentes e confirma com `git status` que não sobrou mudança pendente. O registro das respostas desses comandos em um arquivo texto serve como evidência.

## S1.13 Para ir além

- **Próximo capítulo:** S2 — versionamento com Git: o restante do fluxo de trabalho, incluindo branch, fusão e revisão de código. Nenhum desses assuntos é necessário para este capítulo.
- **Leituras recomendadas:** *Pro Git*, de Scott Chacon e Ben Straub, disponível na documentação oficial do Git; use como referência de aprofundamento, não como substituto dos exercícios daqui.
- **Documentação oficial:** a documentação do Git em `git-scm.com/doc` é a fonte para conferir comandos e opções em versões mais recentes.
- **Pergunta aberta:** se duas pessoas editam o mesmo arquivo em máquinas diferentes, o que o histórico de cada uma consegue dizer sobre a ordem das mudanças?
- **Pergunta de fechamento:** se uma nova pessoa chegar amanhã, ela consegue mudar este código sem medo?

## S1.14 Autoverificação final

A pergunta central da seção 4.13 é: "Um aluno que leu apenas este capítulo conseguiria resolver todos os exercícios propostos?". **Sim.** Os itens abaixo registram a evidência.

- [x] Há de 4 a 8 objetivos observáveis? Sim, oito em S1.1.
- [x] Há pré-requisito adequado ao nível Zero e miniteste de três perguntas respondido? Sim, em S1.2.
- [x] A motivação traz problema real e contexto histórico? Sim, em S1.3.
- [x] A analogia vem antes da definição formal e declara limites? Sim, em S1.4, com "onde funciona" e "onde quebra".
- [x] Cada regra nova tem justificativa em caixa `🧠 Por quê?`? Sim, em S1.5.3, S1.5.4 e S1.5.5.
- [x] A ordem vai do concreto para o abstrato? Sim: situação em S1.3, desenho em S1.7, comandos em S1.5.3, definição em S1.5.4.
- [x] Há três exemplos resolvidos, verificados e em dificuldade crescente? Sim, em S1.6.
- [x] Há visualização em ASCII e descrição textual? Sim, em S1.7.
- [x] Há quadro consolidado de erros com causa e correção? Sim, em S1.8.
- [x] Há quadro curto de "Erros comuns" ao final de cada seção importante? Sim, ao fim de S1.4, S1.5, S1.6 e S1.7.
- [x] A progressão em espiral usa a frase "Lembra do capítulo X? Aqui ele aparece de novo."? Sim, em S1.3, S1.5.2, S1.6 e S1.12.
- [x] Há quadro "Onde isso aparece no mundo real" ligando o commit às quatro áreas? Sim, em S1.3: hash na Matemática, código em C, push em Redes e revisão com testes em Engenharia.
- [x] Há pausas de aprendizagem ativa com previsão do `git status` antes da resposta? Sim, em S1.5.3 e nos exemplos 1 e 3 de S1.6.
- [x] Há o par explícito "código ruim (antes)" e "código bom (depois)" para a mensagem de commit? Sim, em S1.5.4.
- [x] O resumo tem de 5 a 10 linhas e traz cola rápida? Sim, oito linhas em S1.9.
- [x] Há exatamente 15 exercícios em grupos de cinco? Sim, em S1.10.
- [x] O gabarito comentado fica em seção separada e aponta onde a maioria erra? Sim, em S1.11.
- [x] Há mini-projeto com objetivo, requisitos, dicas e critério de correção? Sim, em S1.12.
- [x] As leituras recomendadas são reais? Sim, *Pro Git* e a documentação oficial do Git em S1.13.
- [x] Nenhum termo técnico foi usado antes da definição? Sim; autor, branch, hexadecimal e arquivo sem controle são definidos em S1.2 e S1.5 antes dos exercícios.
- [x] Nenhuma resolução usa "etc."? Sim; as resoluções de S1.6 e S1.11 mostram todos os passos.
- [x] Nenhum dado, comando ou opção foi inventado? Sim; apenas os comandos reais listados neste capítulo aparecem, e todo valor de identificador está marcado como ilustração.
- [x] Nenhum comando Git foi executado neste repositório durante a escrita? Sim; o texto foi apenas escrito no arquivo.
- [x] A pergunta final da trilha foi feita? Sim, em S1.13.

---

## Campos para a plataforma FORGE

### objetivo

Aprender a registrar uma mudança com commit em um repositório Git local, desde a inicialização até a leitura do histórico.

### blocos

1. **Objetivo:** ler o enunciado do mini-projeto em S1.12.
2. **Explicação curta:** diretório de trabalho é onde você edita; área de preparação é onde escolhe; repositório é onde o histórico fica.
3. **Exemplo visual:** diagrama das três áreas em S1.7.
4. **Exemplo resolvido:** Exemplo 1 de S1.6.
5. **Pequeno exercício:** questões 1, 2, 3 e 5 de S1.10.
6. **Verificação:** comparar o que aparece em `git status`, `git diff` e `git log --oneline` com o esperado em S1.6.
7. **Resumo:** cola rápida de S1.9.
8. **Próxima etapa:** capítulo S2, o restante do fluxo de trabalho com Git.

### questoes

1. O que é o diretório de trabalho?
   - A) O histórico completo de commits.
   - B) A pasta onde você edita e salva arquivos antes de prepará-los.
   - C) A área onde ficam as mudanças escolhidas para o próximo commit.
   - D) Um servidor que guarda o código da equipe.
   - **Resposta: B.** O diretório de trabalho é o lugar da edição; o histórico fica no repositório.

2. O que faz `git init` em uma pasta?
   - A) Apaga os arquivos da pasta.
   - B) Cria um commit automaticamente.
   - C) Cria um repositório Git local na pasta atual.
   - D) Publica o conteúdo da pasta em um servidor.
   - **Resposta: C.** A pasta passa a ter histórico local; nenhum commit é criado nesse comando.

3. Para que servem `git config user.name` e `git config user.email`?
   - A) Para definir o autor que será registrado nos commits.
   - B) Para mudar o nome da branch.
   - C) Para apagar o histórico.
   - D) Para escrever o conteúdo dos arquivos.
   - **Resposta: A.** O autor faz parte das informações guardadas em cada commit.

4. O que `git status` informa?
   - A) Somente o conteúdo do último commit.
   - B) A versão instalada do Git.
   - C) O nome de todos os arquivos apagados.
   - D) O estado do diretório de trabalho e da área de preparação, além da branch atual.
   - **Resposta: D.** Ele é a conferência usada antes e depois de `git add`.

5. O que acontece quando você executa `git add notas.txt`?
   - A) O arquivo é publicado.
   - B) A alteração desse arquivo vai para a área de preparação.
   - C) O commit é criado com mensagem automática.
   - D) O arquivo é renomeado.
   - **Resposta: B.** `git add` escolhe o que entrará no próximo commit; ele não cria o registro.

6. Em uma situação com apenas um arquivo ainda sem controle, o que acontece ao rodar `git commit -m` sem ter usado `git add`?
   - A) O Git cria um commit vazio.
   - B) O Git publica o arquivo.
   - C) O Git avisa que não há mudanças preparadas para commit.
   - D) O Git renomeia o arquivo automaticamente.
   - **Resposta: C.** Sem preparação, não há conteúdo escolhido para o registro.

7. Qual mensagem segue a orientação deste capítulo?
   - A) `mudei o arquivo`
   - B) `Corrige data da reunião`
   - C) `Corrigido o erro`
   - D) `coisas varias atualizadas`
   - **Resposta: B.** Ela é curta, começa com verbo no imperativo e diz o que mudou.

8. O que `git diff` mostra por padrão?
   - A) Alterações no diretório de trabalho que ainda não foram preparadas.
   - B) Todas as mensagens do histórico.
   - C) A configuração de autor.
   - D) O nome da branch.
   - **Resposta: A.** A comparação é entre diretório de trabalho e área de preparação; arquivos ainda sem controle não aparecem nela.

9. Como é o identificador completo de um commit no Git?
   - A) Oito dígitos decimais.
   - B) Dez caracteres binários.
   - C) Quarenta caracteres hexadecimal calculados com SHA-1.
   - D) O nome da branch seguido da data.
   - **Resposta: C.** `git log --oneline` mostra uma abreviagem para leitura; a forma completa tem 40 caracteres.

10. Por que o nome do branch inicial pode ser `main` ou `master`?
    - A) Porque o Git escolhe conforme a configuração.
    - B) Porque o nome muda a cada commit.
    - C) Porque `git add` define esse nome.
    - D) Porque o commit não pode ser criado sem `main`.
    - **Resposta: A.** A diferença aparece no estado exibido; os comandos do capítulo continuam os mesmos.

### sintese_feynman

Explique com as suas palavras, em pelo menos 30 caracteres, como um arquivo editado vira um registro no histórico. Crie uma analogia sua, diferente da bancada e da caixa deste capítulo — por exemplo, compare o commit a uma ficha de biblioteca carimbada com número de série — e invente um exemplo próprio, como guardar a primeira linha de um poema em `poema.txt`. Use `git status` na sua explicação para dizer em qual etapa o arquivo está. Não copie frases do texto.

### cartoes_erro

1. Por que `git add` não é a mesma coisa que `git commit -m`?
2. O que aparece quando você roda `git commit -m` sem preparar nenhuma mudança?
3. Por que uma mensagem como `mudei o arquivo` é ruim para o histórico?
4. O que `git status` mostra sobre um arquivo recém-criado que ainda não foi preparado?
5. Por que `git diff` não serve para localizar arquivos ainda sem controle?

### laboratorio

- **Simulação:** desenhe em papel as três áreas do diagrama de S1.7. Ao lado de cada seta, escreva o comando correspondente. Em seguida, escreva em cada caixa o que você espera ver quando usar `git status`.
- **Execução real:** crie uma pasta temporária local, abra o terminal nela e execute, em ordem: `git init`, `git config user.name "Seu Nome"`, `git config user.email "seu@email"`. Crie `notas.txt` no editor, execute `git status`, `git add notas.txt`, `git status`, `git commit -m "Adiciona notas de estudo"` e `git log --oneline`. Depois altere o arquivo e execute `git diff`. Tudo acontece apenas no seu computador: nenhum comando de publicação é usado e nada é enviado a servidor.
- **Evidência:** anote em um arquivo texto as respostas obtidas em cada etapa e compare com as descrições de S1.5.3 e S1.6. Os trechos de identificador serão diferentes dos exemplos, e isso é esperado.

### indicadores

Domínio (aulas com selo), Revisões vencidas, Erros a refazer, Labs com evidência, Módulos em andamento, Horas registradas.

### projeto

Nenhum neste capítulo. O mini-projeto de S1.12 é um exercício local de fixação, não um projeto de portfólio. Os códigos `MP1` a `MP10` pertencem ao catálogo didático do Prompt Mestre e os códigos `P0` a `P10` pertencem ao portfólio canônico da aplicação FORGE; este capítulo não atribui nenhum dos dois conjuntos.

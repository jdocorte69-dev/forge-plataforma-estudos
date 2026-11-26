# Capítulo modelo — Redes de Computadores

**Código didático:** R1 · **Tema na plataforma:** Fundamentos e modelos · **Tema específico:** Do clique ao pacote: camadas, endereço IP e porta · **Nível:** Zero · **Área:** Redes de Computadores

Aqui, `R1` é uma **etiqueta didática** deste Prompt Mestre, não um identificador oficial da aplicação FORGE. Na plataforma, este tema aparece como **"Fundamentos e modelos"**. A aplicação pode usar códigos próprios que não coincidem com os nossos: um `R1` visto na aplicação **não é necessariamente este tema**. Antes de responder, confirme o título da aula e diga qual dos dois sistemas você está usando, conforme a seção 18.3 do `PROMPT_MESTRE.md`.

Este arquivo é o padrão ouro de Redes do Prompt Mestre. Ele mostra na prática como aplicar as seções 3, 4, 6, 9 e 18. Quando for gerar outro capítulo de redes, use esta estrutura como referência de completude, mas escreva sempre com as suas próprias palavras.

**Validação do autor:** as conversões numéricas e as saídas dos trechos em Python 3 foram conferidas; portas, tamanhos de cabeçalho e a faixa de loopback são fatos verificáveis indicados em R1.13. O pacote byte a byte de R1.5.7 é uma construção didática, não uma captura de rede. Nenhum pacote foi enviado a endereço externo.

---

## R1.1 Objetivos de aprendizagem

Ao final deste capítulo você será capaz de:

1. Descrever, em ordem, as quatro camadas do modelo TCP/IP e o que cada uma acrescenta a uma mensagem.
2. Comparar as quatro camadas do TCP/IP com as sete camadas da OSI, explicando por que a correspondência é aproximada.
3. Converter um endereço IPv4 escrito em decimal pontuado em quatro octetos e contar seus 32 bits.
4. Diferenciar endereço IP e porta, usando `127.0.0.1` e as portas `22`, `53`, `80` e `443` em exemplos.
5. Explicar o papel do loopback e por que `127.0.0.1` permite testar no próprio computador.
6. Comparar UDP e TCP quanto ao tamanho do cabeçalho e quanto à garantia de entrega.
7. Identificar e corrigir erros comuns na leitura de endereços, portas e cabeçalhos.

## R1.2 Pré-requisitos

**Nenhum módulo da plataforma é pré-requisito.** Este é um capítulo de nível Zero: todo termo novo é definido no momento em que aparece. Você só precisa saber ler e escrever texto e abrir um arquivo no seu computador.

Se você nunca usou um **terminal**, aqui vai o mínimo: o terminal é uma janela onde você digita comandos e recebe respostas em texto. O **prompt** é o sinal que mostra que o terminal está esperando o seu comando. Um **programa** é uma lista de instruções que o computador segue. Um **processo** é um programa em execução: o mesmo programa pode gerar dois processos diferentes ao mesmo tempo.

Duas palavras que aparecem desde cedo:

- **bit:** um dígito binário, que vale `0` ou `1`.
- **byte:** um grupo de oito bits, convenção adotada em todo este material.
- **octeto:** outro nome para um grupo de oito bits. Aqui, um octeto tem o mesmo tamanho de um byte.

### Miniteste de prontidão

Responda antes de continuar. As respostas estão logo abaixo.

1. O que é um bit?
2. Quantos bits há em um byte neste material?
3. O que é um processo?

<details>
<summary>Respostas do miniteste</summary>

1. Um dígito que pode valer `0` ou `1`.
2. Oito.
3. Um programa em execução.

Se você acertou as três, pode seguir. Se errou alguma, leia o parágrafo anterior mais uma vez; nenhuma parte deste capítulo exige mais do que isso.

</details>

## R1.3 Motivação: por que isso existe?

Imagine dois programas que querem conversar. Um escreveu um texto; o outro recebeu uma sequência de bits. Se eles não combinarem antes como interpretar esses bits, o receptor não sabe se olhou o dado certo. Agora junte mais duas dificuldades: como o emissor diz **qual computador** deve receber, e, dentro desse computador, **qual programa** deve abrir a mensagem? Sem respostas para essas perguntas, a conversa não começa.

Foi esse tipo de problema que levou à ideia de regras comuns. Em 1974, Vint Cerf e Bob Kahn publicaram o artigo *A Protocol for Packet Network Intercommunication*, descrevendo como redes diferentes poderiam trocar mensagens usando um formato compartilhado. Em 1º de janeiro de 1983, a ARPANET passou a usar TCP/IP. A escolha não foi estética: sem um conjunto único de regras, cada rede nova precisaria de uma tradução própria para conversar com cada rede antiga.

> 🌍 **No mundo real:** quando você abre uma página ou usa um acesso remoto, as mesmas três perguntas voltam: como embrulhar a mensagem, para qual máquina enviá-la e qual programa deve recebê-la. As respostas estão nas camadas, no endereço IP e na porta.

## R1.4 Explicação "para 5 anos"

Pense em um bilhete para um colega que mora em um prédio. Você escreve `oi` no papel. Coloca o papel em um envelope pequeno e escreve nele o número do apartamento: é a **porta**, que diz qual pessoa dentro do prédio deve receber. Depois coloca esse envelope dentro de outro, maior, e escreve o endereço do prédio: é o **endereço IP**, que diz onde o prédio fica. O carteiro olha o endereço do envelope grande; o porteiro olha o número do apartamento no envelope pequeno. O colega abre e lê o bilhete.

Repare que ninguém precisou abrir os dois envelopes ao mesmo tempo: cada pessoa olha apenas a etiqueta que lhe compete. Fazer uma pergunta por vez é o que chamamos de Dividir em **camadas**.

> 💡 **Intuição:** embrulhar a mensagem é acrescentar etiquetas. Uma etiqueta responde "para onde vai o prédio" (IP); outra responde "para quem dentro dele" (porta). O dado original continua no meio dos envelopes.

**Onde a analogia funciona:** mostra que existem dois endereços diferentes, um para a máquina e outro para o programa, e que cada etapa só precisa ler a sua própria etiqueta.

**Onde a analogia quebra:** envelopes de papel não se dividem em pedaços, não são reenviados quando se perdem e não têm um campo de tamanho. Em redes, o cabeçalho é um pedaço real de dados com bytes contados, e uma mensagem pode ser enviada de novo. A analogia ensina a ideia das etiquetas, não o comportamento completo do protocolo.

**Erros comuns desta seção**

| Intuição errada | Correção |
|---|---|
| "O carteiro escolhe o apartamento." | O endereço do prédio e o número do apartamento são informações separadas; cada camada lê a sua. |
| "O envelope é a mensagem." | O envelope é a etiqueta; a mensagem é o dado que está dentro dele. |

## R1.5 Explicação aprofundada

### R1.5.1 Situação concreta: um bilhete que fica em casa

Uma **rede** é um conjunto de aparelhos que conseguem trocar mensagens. A **mensagem** é o dado que um programa quer enviar; **dado** aqui significa informação escrita em bits. Um **pacote** é uma unidade de dados que a rede transporta e que carrega etiquetas de controle. Essas etiquetas têm nome: **cabeçalho** é a parte que uma camada acrescenta ao dado para dizer quem enviou, quem recebe e outras informações de controle.

Vamos usar o menor laboratório possível. O programa A escreve `oi` e quer que o programa B, no **mesmo computador**, receba. Nada precisa sair da máquina: esse caminho se chama **loopback**, uma comunicação que começa e termina no próprio computador.

1. O programa A cria os dados: as letras `oi`.
2. A camada de **Transporte** acrescenta um cabeçalho com o número da **porta** de destino, que identifica o programa receptor.
3. A camada de **Internet** acrescenta um cabeçalho com o **endereço IP** de destino. Para o teste local, usamos `127.0.0.1`.
4. A camada de **Acesso à Rede** entrega o pacote. Como o destino é o próprio computador, o pacote volta para dentro dele.
5. O programa B lê a porta no cabeçalho de Transporte e recebe `oi`.

> 🧠 **Por quê?** Por que dividir em camadas? Porque cada camada resolve uma pergunta e não precisa saber a resposta das outras. Se um dia a forma de ligar o aparelho mudar, apenas a camada de Acesso à Rede muda; as que estão acima continuam usando a mesma ideia de endereço e porta.

**Erros comuns desta seção**

| Intuição errada | Correção |
|---|---|
| "Loopback significa mandar para outro computador próximo." | Loopback começa e termina no mesmo computador. |
| "O dado e o cabeçalho são a mesma coisa." | O dado é a mensagem; o cabeçalho é a etiqueta acrescentada. |

### R1.5.2 Modelo TCP/IP e a referência OSI

Um **modelo** é uma descrição em partes de algo complexo. Uma **camada** é uma dessas partes: um grupo de funções com regras próprias. Um **protocolo** é o conjunto de regras que as duas pontas da conversa aceitam seguir. O modelo TCP/IP usado neste capítulo tem quatro camadas; o modelo OSI tem sete camadas e serve como vocabulário de referência.

| Modelo TCP/IP (4 camadas) | Pergunta que ela responde | OSI (7 camadas) — equivalência aproximada |
|---|---|---|
| Aplicação | O que os programas querem trocar? | Aplicação, Apresentação, Sessão |
| Transporte | Qual programa recebe, e como a conversa é conduzida? | Transporte |
| Internet | Qual aparelho recebe, mesmo em outra rede? | Rede |
| Acesso à Rede | Como o pacote sai e entra no aparelho? | Enlace de Dados, Física |

> ⚠️ **Cuidado:** a correspondência da tabela é aproximada, não um mapa um a um. A OSI separa funções que o TCP/IP agrupa na camada de Aplicação. Use os nomes da OSI para entender conversas técnicas, mas não suponha que todo protocolo real tenha sete camadas distintas.

> 🧠 **Por quê?** Por que existem dois modelos? Porque eles organizam a mesma conversa com granularidades diferentes. O TCP/IP descreve a pilha usada na prática; a OSI oferece termos mais finos para discutir cada função. Nenhum dos dois é o pacote em si: ambos são formas de descrever quem faz o quê.

**Erros comuns desta seção**

| Intuição errada | Correção |
|---|---|
| "TCP/IP tem sete camadas." | Sete é o número da OSI; o TCP/IP discutido aqui tem quatro. |
| "Cada camada TCP/IP corresponde a exatamente uma camada OSI." | A correspondência é aproximada; a Aplicação do TCP/IP equivale a três camadas da OSI. |

### R1.5.3 Endereço IPv4: 32 bits em quatro octetos

Um **endereço IP** é um número que identifica para qual aparelho uma mensagem vai. Neste capítulo tratamos apenas do **IPv4**, escrito em **decimal pontuado**: quatro números decimais separados por pontos, como `127.0.0.1`. Cada número é um octeto, e cada octeto vai de $0$ a $255$.

> 🔁 **Revisão rápida:** Lembra do capítulo M1? Aqui ele aparece de novo. Potências servem para contar valores possíveis: $2^{8} = 256$ valores, numerados de $0$ a $255$.

Como são quatro octetos de oito bits, o endereço inteiro tem:

$$4 \times 8 = 32 \text{ bits}, \qquad 2^{8} = 256 \text{ valores por octeto }(0 \text{ a } 255).$$

**Pausa de aprendizagem ativa.** Antes de continuar, pegue um papel e tente escrever o octeto `127` em binário de oito bits. Não olhe a resposta antes de tentar.

<details>
<summary>Resposta da pausa</summary>

$127 = 64 + 32 + 16 + 8 + 4 + 2 + 1$, então os sete bits finais ficam ligados e o primeiro fica desligado: `01111111`. Oito caracteres binários, como prometido.

</details>

Assim, `127.0.0.1` fica `01111111.00000000.00000000.00000001` em binário. Os pontos não fazem parte dos bits: eles apenas separam os quatro octetos para facilitar a leitura humana.

O nome **localhost** designa o próprio computador. O endereço `127.0.0.1` é o endereço de loopback mais usado, e a faixa inteira `127.0.0.0/8` é reservada para loopback. O `/8` significa que os primeiros $8$ bits são fixos em `127`; os outros $24$ bits podem variar dentro da faixa.

> 🧠 **Por quê?** Por que reservar uma faixa só para o loopback? Para que um programador consiga testar um programa sem depender de nenhum outro aparelho e sem enviar dados para fora do próprio computador. É um laboratório seguro por construção.

> ⚠️ **Cuidado:** `127.0.0.1` não é um endereço para alcançar outra pessoa pela Internet. E `127.0.0.256` não é um IPv4 válido, porque um octeto não passa de `255`.

Este programa apenas verifica octetos e mostra a conversão; ele não abre conexão nem envia dados:

```python
def descrever_ipv4(endereco):
    partes = endereco.split(".")          # separa nos tres pontos
    if len(partes) != 4:                  # IPv4 exige quatro octetos
        raise ValueError("quatro octetos sao obrigatorios")
    octetos = []
    for parte in partes:
        if not parte.isdigit():           # cada parte precisa ser numerica
            raise ValueError("octeto nao numerico")
        valor = int(parte)
        if valor < 0 or valor > 255:      # um octeto vai de 0 a 255
            raise ValueError("octeto fora de 0..255")
        octetos.append(valor)
    print("endereco:", endereco)
    print("octetos:", octetos)
    print("bits:", len(octetos) * 8)      # quatro octetos de oito bits
    for indice, valor in enumerate(octetos, start=1):
        print(f"octeto {indice}: {valor:3d} = {valor:08b}")  # decimal e binario

descrever_ipv4("127.0.0.1")
```

Saída esperada:

```text
endereco: 127.0.0.1
octetos: [127, 0, 0, 1]
bits: 32
octeto 1: 127 = 01111111
octeto 2:   0 = 00000000
octeto 3:   0 = 00000000
octeto 4:   1 = 00000001
```

**Erros comuns desta seção**

| Intuição errada | Correção |
|---|---|
| "Os pontos ocupam bits no endereço." | Os pontos só separam os quatro octetos; quem conta é oito bits por octeto. |
| "`127.0.0.256` está certo porque 256 é decimal." | Cada octeto aceita apenas de $0$ a $255$. |

### R1.5.4 Porta: qual programa recebe

O endereço IP responde "qual aparelho?". Falta responder "qual programa dentro dele?". A **porta** é o número usado para identificar o processo ou o serviço que deve receber a mensagem. Um **serviço** é um programa que atende pedidos de outros programas. Dizemos que uma porta é **bem conhecida** quando uma convenção pública a reservou para um serviço.

| Serviço | O que faz | Porta bem conhecida |
|---|---|---|
| SSH | acesso remoto a um computador, com criptografia | `22` |
| DNS | serviço que consulta nomes para obter endereços | `53` |
| HTTP | protocolo usado para páginas web | `80` |
| HTTPS | HTTP com proteção por criptografia | `443` |

Além das portas bem conhecidas, há as **portas efêmeras**: números escolhidos apenas para uma conversa ou um teste temporário, sem serviço fixo associado. No pacote byte a byte mais adiante, usaremos a porta `50000` como porta efêmera de destino.

**Pausa de aprendizagem ativa.** Dois programas no mesmo computador usam o IP `127.0.0.1`. Antes de ler a resposta, tente prever o que impede que a mensagem vá para o programa errado.

<details>
<summary>Resposta da pausa</summary>

O que distingue os dois processos é a **porta de destino**, escrita no cabeçalho de Transporte. O IP é igual porque os dois estão no mesmo aparelho.

</details>

> 🧠 **Por quê?** Por que são necessárias duas informações? Porque o endereço IP escolhe o computador e a porta escolhe o processo dentro dele. Um único número não consegue dizer as duas coisas sem ambiguidade neste modelo simples.

O programa abaixo apenas imprime a convenção; não contacta nenhum serviço:

```python
PORTAS_BEM_CONHECIDAS = {
    "SSH": 22,     # acesso remoto com criptografia
    "DNS": 53,     # consulta de nomes
    "HTTP": 80,    # paginas web
    "HTTPS": 443,  # paginas web com protecao
}

for servico, porta in PORTAS_BEM_CONHECIDAS.items():
    print(f"{servico}: {porta}")
```

Saída esperada:

```text
SSH: 22
DNS: 53
HTTP: 80
HTTPS: 443
```

**Erros comuns desta seção**

| Intuição errada | Correção |
|---|---|
| "Porta é um segundo endereço IP." | A porta identifica o processo; o IP identifica o aparelho. |
| "HTTP usa 443 porque é mais seguro." | HTTP usa `80`; HTTPS usa `443`. |

### R1.5.5 Cabeçalhos: o que cada camada acrescenta

Um **cabeçalho** é uma parte acrescentada ao dado por uma camada. Ele ocupa bytes reais. Neste capítulo você precisa saber três tamanhos e duas ideias:

| Protocolo | Camada | Tamanho do cabeçalho | Ideia central |
|---|---|---|---|
| IPv4 | Internet | $20$ a $60$ bytes | leva os endereços de origem e destino, com quatro bytes para cada um; cresce até $60$ bytes quando há opções |
| UDP | Transporte | $8$ bytes | não estabelece uma conversa combinada antes de enviar e não garante a entrega |
| TCP | Transporte | $20$ a $60$ bytes | orientado a conexão: as duas pontas guardam informação sobre a conversa antes de trocar dados |

O cabeçalho UDP tem exatamente quatro campos de dois bytes, organizados assim:

```text
byte:   0          1          2          3
        +----------+----------+----------+----------+
UDP     | origem   | destino  | tamanho  | soma     |
        +----------+----------+----------+----------+
          porta       porta     do UDP    de verificação
```
Descrição textual do desenho: a linha de cima numera os bytes de `0` a `3`; a caixa `origem` guarda a porta de quem enviou; `destino` guarda a porta de quem recebe; `tamanho` guarda o comprimento do cabeçalho mais os dados; `soma de verificação`, chamada *checksum*, é um campo usado para detectar alterações nos dados. Em UDP sobre IPv4 esse campo é opcional. Quatro campos de dois bytes somam $4 \times 2 = 8$ bytes.

**Pausa de aprendizagem ativa.** Sem olhar a tabela, preveja qual cabeçalho de Transporte é menor e por quanto. Depois confira na resposta.

<details>
<summary>Resposta da pausa</summary>

UDP: $8$ bytes. TCP: no mínimo $20$ bytes e no máximo $60$. O mínimo do TCP é $20 - 8 = 12$ bytes maior que o UDP.

</details>

> 🧠 **Por quê?** Por que o cabeçalho UDP é menor? Porque ele não carrega os campos de controle que uma conversa orientada a conexão precisa, como números que identificam pedaços e confirmações. Cada campo custa bytes: menos controle, menos bytes.

> 🧠 **Por quê?** Por que o cabeçalho IPv4 pode chegar a $60$ bytes? Porque o mínimo é $20$ bytes e podem existir campos de **opção** — informações adicionais acrescentadas por quem monta o pacote. $60 - 20 = 40$ bytes é o espaço máximo ocupado por essas opções.

> ⚠️ **Cuidado:** não afirme que TCP "nunca falha" nem que UDP "sempre falha". As afirmações seguras deste capítulo são: UDP tem $8$ bytes, não estabelece conexão e não promete entrega; TCP tem $20$ a $60$ bytes e é orientado a conexão.

**Erros comuns desta seção**

| Intuição errada | Correção |
|---|---|
| "Todo cabeçalho IPv4 mede 20 bytes." | $20$ é o mínimo; opções podem levar até $60$. |
| "UDP e TCP têm o mesmo cabeçalho, só muda o nome." | UDP tem $8$ bytes e não promete entrega; TCP tem $20$ a $60$ e é orientado a conexão. |

### R1.5.6 Do exemplo à definição formal

Agora que você já viu o bilhete, o desenho e os números, vale escrever o padrão com símbolos. A cadeia de embrulho é:

$$ \text{dados} \longrightarrow \text{Aplicação} \longrightarrow \text{Transporte (porta)} \longrightarrow \text{Internet (IP)} \longrightarrow \text{Acesso à Rede}. $$

Um endereço IPv4 pode ser escrito como uma quádrupla:

$$ \text{IPv4} = (o_1, o_2, o_3, o_4), \qquad o_i \in \{0,1,\ldots,255\}, \qquad 4 \times 8 = 32 \text{ bits}, $$

em que $o_i$ é o $i$-ésimo octeto e $i$ vai de $1$ a $4$. A escrita decimal pontuada é só uma forma de mostrar essa quádrupla: trocamos cada $o_i$ por um número decimal e separamos os valores com pontos.

> 🎯 **Resumo:** rede é troca de mensagens; camada é uma parte com uma pergunta própria; pacote é dado com cabeçalhos; IP escolhe o aparelho; porta escolhe o processo; loopback mantém o teste em casa.

### R1.5.7 Um pacote concreto, byte a byte

A tabela abaixo mostra um pacote IPv4 com UDP construído para o teste local. Ele **não** é uma captura de rede: é uma construção didática cujos números vêm de conversões feitas neste capítulo ou de convenções públicas. Campos que dependem de quem envia aparecem como "definido pelo emissor", jamais com um valor inventado. Usamos notação hexadecimal, em que `0x` indica a base 16: `0x1E` vale $30$.

Cenário: origem e destino `127.0.0.1`, porta UDP de destino `50000` (porta efêmera escolhida para o teste), dados `oi` (dois bytes). O cabeçalho IPv4 mede $20$ bytes; o UDP, $8$; o total é $20 + 8 + 2 = 30$ bytes, ou `0x001E`. Na linha `0x45`, o `4` é a versão do IPv4 e o `5` conta o cabeçalho em blocos de quatro bytes: $5 \times 4 = 20$.

| Byte | Campo | Valor | Por que esse valor |
|---|---|---|---|
| 0 | versão e tamanho do cabeçalho IPv4 | `0x45` | versão 4; $5$ blocos de $4$ bytes dão $20$ bytes |
| 1 | campo de serviço | definido pelo emissor | depende de quem monta o pacote |
| 2 | comprimento total, byte alto | `0x00` | $30$ em hexadecimal é `0x001E` |
| 3 | comprimento total, byte baixo | `0x1E` | `0x1E` = $30$ bytes no total |
| 4 | identificação, byte alto | definido pelo emissor | valor escolhido por quem envia |
| 5 | identificação, byte baixo | definido pelo emissor | valor escolhido por quem envia |
| 6 | sinalizadores e deslocamento, byte alto | definido pelo emissor | não fixado neste exemplo |
| 7 | sinalizadores e deslocamento, byte baixo | definido pelo emissor | não fixado neste exemplo |
| 8 | tempo de vida | definido pelo emissor | valor depende do sistema |
| 9 | protocolo | `0x11` | número atribuído ao UDP é $17$, que é `0x11` |
| 10 | soma de verificação IPv4, byte alto | não fixado aqui | calculada por quem envia |
| 11 | soma de verificação IPv4, byte baixo | não fixado aqui | calculada por quem envia |
| 12 | IP de origem, octeto 1 | `0x7F` | $127$ em hexadecimal |
| 13 | IP de origem, octeto 2 | `0x00` | $0$ |
| 14 | IP de origem, octeto 3 | `0x00` | $0$ |
| 15 | IP de origem, octeto 4 | `0x01` | $1$ |
| 16 | IP de destino, octeto 1 | `0x7F` | $127$ |
| 17 | IP de destino, octeto 2 | `0x00` | $0$ |
| 18 | IP de destino, octeto 3 | `0x00` | $0$ |
| 19 | IP de destino, octeto 4 | `0x01` | $1$ |
| 20 | porta UDP de origem, byte alto | definido pelo emissor | escolhida pelo programa que envia |
| 21 | porta UDP de origem, byte baixo | definido pelo emissor | escolhida pelo programa que envia |
| 22 | porta UDP de destino, byte alto | `0xC3` | $50000 = 195 \times 256 + 80$; `0xC3` = $195$ |
| 23 | porta UDP de destino, byte baixo | `0x50` | `0x50` = $80$; $195 \times 256 + 80 = 50000$ |
| 24 | comprimento UDP, byte alto | `0x00` | $8 + 2 = 10$, escrito `0x000A` |
| 25 | comprimento UDP, byte baixo | `0x0A` | `0x0A` = $10$ bytes |
| 26 | soma de verificação UDP, byte alto | não fixado aqui | em IPv4, o campo é opcional |
| 27 | soma de verificação UDP, byte baixo | não fixado aqui | valor não inventado |
| 28 | dado `o` | `0x6F` | ASCII: letra `o` |
| 29 | dado `i` | `0x69` | ASCII: letra `i` |

**ASCII** é a tabela que associa caracteres a números; nela, `o` vale `0x6F` e `i` vale `0x69`. Os bytes `0` a `19` formam o cabeçalho IPv4, os bytes `20` a `27` formam o cabeçalho UDP e os bytes `28` e `29` são os dados.

> 🔁 **Revisão rápida:** Lembra do capítulo C7? Aqui ele aparece de novo. Um cabeçalho é uma sequência de bytes na memória, com posições contadas a partir do início.

**Onde isso aparece no mundo real**

| Área | Conceito retomado | Onde aparece neste capítulo |
|---|---|---|
| Matemática (M1 e M7) | Potências de $2$ e lógica. Uma **máscara** é um número usado para selecionar bits | $2^8 = 256$, $4 \times 8 = 32$; o byte `0x45` separa versão e tamanho |
| Linguagem C (C7) | Bytes e posições na memória; uma `struct` agrupa campos nomeados | A tabela byte a byte de R1.5.7 |
| Redes (R1) | Camadas, IP, porta e pacote | O caminho do dado em R1.5.1 e o embrulho em R1.5.6 |
| Engenharia de Software (S4) | Testes e depuração com entradas conhecidas | Loopback permite reproduzir e verificar sem depender de terceiros |

> 🔁 **Revisão rápida:** Lembra do capítulo M7? Aqui ele aparece de novo. Selecionar bits com uma máscara é o mesmo tipo de operação lógica que você estudou em lógica.

## R1.6 Exemplos resolvidos passo a passo

### Exemplo 1 — Trivial: lendo `127.0.0.1`

**Enunciado.** Quantos octetos e quantos bits tem `127.0.0.1`? O que esse endereço representa?

**Raciocínio.**

1. Contar os grupos separados por pontos.
2. Converter cada grupo para binário de oito bits.
3. Multiplicar a quantidade de grupos por oito bits.
4. Interpretar o endereço com a definição de loopback.

**Resolução.** Os grupos são `127`, `0`, `0` e `1`: quatro octetos. O primeiro vira `01111111`, porque $127 = 64 + 32 + 16 + 8 + 4 + 2 + 1$. O segundo e o terceiro viram `00000000`. O quarto vira `00000001`, porque $1 = 2^{0}$. Cada octeto tem $8$ bits, então $4 \times 8 = 32$ bits. Como o endereço começa com `127`, ele pertence à faixa `127.0.0.0/8`, reservada ao loopback: aponta para o próprio computador.

**Verificação.** Escreva `01111111.00000000.00000000.00000001` e conte os caracteres binários de cada grupo: $8 + 8 + 8 + 8 = 32$. A leitura decimal dos grupos devolve `127.0.0.1`.

**O que este exemplo ensina.** Um endereço IPv4 é uma quádrupla de octetos, e `127.0.0.1` não indica outro aparelho: indica a própria máquina.

### Exemplo 2 — Médio: embrulhando a mensagem `oi`

**Enunciado.** Um programa local envia `oi` para a porta `80` em `127.0.0.1`. Indique a ordem das camadas, o que cada uma acrescenta e quanto mede o cabeçalho de Transporte se usado UDP. Repita a medida no caso de TCP.

**Raciocínio.**

1. A mensagem nasce na camada de Aplicação.
2. A porta aparece no cabeçalho de Transporte.
3. O endereço IP aparece no cabeçalho da camada de Internet.
4. A Acesso à Rede entrega o pacote no próprio computador.
5. Consultamos os tamanhos de cabeçalho já definidos.

**Resolução.**

| Etapa | Camada | O que é acrescentado ou feito |
|---|---|---|
| 1 | Aplicação | dados `oi` |
| 2 | Transporte | porta de destino `80` e cabeçalho UDP de $8$ bytes ou cabeçalho TCP de $20$ a $60$ bytes |
| 3 | Internet | endereço `127.0.0.1` e cabeçalho IPv4 de $20$ a $60$ bytes |
| 4 | Acesso à Rede | entrega dentro do próprio computador, por loopback |

**Verificação.** A porta `80` corresponde a HTTP, que normalmente usa TCP; ela aparece aqui apenas para ligar porta a serviço, enquanto a comparação dos cabeçalhos é independente do serviço escolhido. O endereço `127.0.0.1` é loopback; $8 < 20$, então o cabeçalho UDP é menor que o mínimo do TCP. Se o cabeçalho IPv4 estiver no mínimo e o UDP for usado, o total de cabeçalhos é $20 + 8 = 28$ bytes, antes dos dois bytes de `oi`.

**O que este exemplo ensina.** A ordem do embrulho é Transporte antes de Internet, e cada camada lê só a sua etiqueta.

### Exemplo 3 — Desafiador: o mesmo IP, dois programas diferentes

**Enunciado.** No mesmo computador, um programa atende SSH na porta `22` usando TCP, e outro faz uma consulta DNS na porta `53` usando UDP. Os dois recebem mensagens com destino `127.0.0.1`. Explique como cada mensagem chega ao programa certo e compare os cabeçalhos de Transporte.

**Raciocínio.**

1. Separar o que é igual nas duas mensagens.
2. Separar o que é diferente nas duas mensagens.
3. Relacionar cada diferença à camada que a interpreta.
4. Conferir os tamanhos de cabeçalho e as afirmações permitidas.

**Resolução.**

| Mensagem | IP de destino | Porta | Transporte | Cabeçalho de Transporte |
|---|---|---|---|---|
| SSH | `127.0.0.1` | `22` | TCP | $20$ a $60$ bytes; orientado a conexão |
| DNS | `127.0.0.1` | `53` | UDP | $8$ bytes; sem garantia de entrega |

O IP é igual porque as duas mensagens param no mesmo aparelho. A camada de Internet lê `127.0.0.1` e entrega as duas ali. A camada de Transporte lê a porta: `22` encaminha ao programa SSH e `53` ao programa de consulta DNS. O cabeçalho de cada uma traz a sua porta, por isso o destino não se confunde neste exemplo. Quanto ao tamanho, UDP usa $8$ bytes e TCP usa de $20$ a $60$ bytes: a diferença mínima é $20 - 8 = 12$ bytes. Não afirmamos qual das duas opções é "melhor" sem um critério: aqui apenas comparamos fatos verificáveis.

**Verificação.** Confira na tabela de portas: SSH é `22`, DNS é `53`, HTTP é `80` e HTTPS é `443`. Confira os tamanhos: `0x0A` = $10$ na tabela byte a byte, e $8 < 20$. Confira a regra das camadas: IP identifica o aparelho, porta identifica o processo.

**O que este exemplo ensina.** Endereçamento é uma decisão em duas partes: primeiro a máquina, depois o programa. O tratamento completo de portas e conexões fica para o módulo didático R5.

## R1.7 Visualização

O caminho do dado no teste local:

```text
  [ Programa A ]   dados: "oi"
         |  camada Aplicação: cria os dados
         v
  [ Transporte ]   acrescenta a porta de destino (80, por exemplo)
         |  cabeçalho UDP: 8 bytes   OU   cabeçalho TCP: 20 a 60 bytes
         v
  [ Internet ]     acrescenta o IP de destino 127.0.0.1
         |  cabeçalho IPv4: 20 a 60 bytes, com 4 octetos por endereço
         v
  [ Acesso à Rede ] entrega dentro do próprio computador (loopback)
         |
         v
  [ Programa B ]   lê a porta no cabeçalho de Transporte e recebe "oi"
```

Descrição textual do diagrama: a primeira caixa é o programa que escreve `oi`; a seta seguinte leva à caixa `Transporte`, onde entra o número da porta; a terceira caixa é `Internet`, onde entra o endereço `127.0.0.1`; a quarta caixa é `Acesso à Rede`, que entrega o pacote sem sair da máquina; a última caixa é o programa receptor. Cada seta representa o acréscimo de uma etiqueta, e os números ao lado das setas são os tamanhos em bytes.

Para comparar os dois formatos de transporte lado a lado:

```text
UDP (8 bytes)        [origem:2][destino:2][tamanho:2][soma:2]
TCP (20 a 60 bytes)  [origem:2][destino:2][sequência:4][confirmação:4]
                     [controle:2][janela:2][soma:2][urgente:2][opções:0 a 40]
```

Descrição textual: em UDP, os quatro blocos de $2$ bytes somam $8$. Em TCP, os oito primeiros blocos somam $20$ bytes e o bloco de opções pode acrescentar até $40$, chegando a $60$. Os nomes `origem` e `destino` são portas; `soma` é a soma de verificação; `janela` informa quanto dado o receptor pode aceitar; `opções` são campos adicionais acrescentados por quem monta o pacote.

**Erros comuns desta seção**

| Intuição errada | Correção |
|---|---|
| "O IP entra antes da porta." | A porta entra na camada de Transporte; o IP entra na camada de Internet. |
| "As opções do TCP não ocupam bytes." | Elas podem ocupar até $40$ bytes, levando o cabeçalho a $60$. |

## R1.8 Erros comuns e armadilhas

| Erro | Por que acontece | Como evitar |
|---|---|---|
| Confundir endereço IP com porta | São dois números escritos juntos em exemplos | IP escolhe o aparelho; porta escolhe o processo |
| Achar que `127.0.0.1` chega a outro computador | O nome localhost soa como "outro lugar" | Decorar a regra: faixa `127.0.0.0/8` é loopback |
| Escrever `127.0.0.256` | Achar que qualquer decimal serve | Um octeto vai de $0$ a $255$ |
| Trocar HTTP e HTTPS | Os dois aparecem em páginas web | HTTP é `80`; HTTPS é `443` |
| Achar que SSH é `53` | Confundir com DNS | SSH é `22`; DNS é `53` |
| Dizer que o cabeçalho IPv4 mede sempre $20$ bytes | Esquecer as opções | $20$ é o mínimo; o máximo é $60$ |
| Dizer que UDP tem cabeçalho de $20$ bytes | Copiar o mínimo do TCP | UDP tem exatamente $8$ bytes |
| Dizer que TCP e OSI têm o mesmo número de camadas | Misturar os dois modelos | TCP/IP tem $4$; OSI tem $7$, com equivalência aproximada |
| Afirmar que UDP promete entrega | Transferir a ideia do TCP ao UDP | UDP não estabelece conexão e não garante entrega |

## R1.9 Resumo do capítulo

- Uma rede troca mensagens; um pacote é o dado com cabeçalhos acrescentados.
- O modelo TCP/IP tem quatro camadas; a OSI tem sete e a correspondência é aproximada.
- A ordem do embrulho é Aplicação, Transporte, Internet e Acesso à Rede.
- Um IPv4 tem $32$ bits, escritos como quatro octetos de $0$ a $255$.
- `127.0.0.1` é loopback: a comunicação fica no próprio computador.
- A faixa `127.0.0.0/8` é reservada ao loopback; o `/8` fixa os primeiros oito bits.
- IP escolhe o aparelho; porta escolhe o processo. SSH usa `22`, DNS `53`, HTTP `80` e HTTPS `443`.
- Cabeçalhos: IPv4 de $20$ a $60$ bytes; UDP de $8$ bytes sem garantia de entrega; TCP de $20$ a $60$ bytes, orientado a conexão.

**Cola rápida:**

| O que você quer | Valor ou regra |
|---|---|
| Número de camadas do TCP/IP | $4$ |
| Número de camadas da OSI | $7$ (equivalência aproximada) |
| Tamanho de um IPv4 | $32$ bits $= 4 \times 8$ |
| Octeto válido | de $0$ a $255$ |
| Endereço de loopback | `127.0.0.1` |
| Faixa de loopback | `127.0.0.0/8` |
| Porta de SSH | `22` |
| Porta de DNS | `53` |
| Porta de HTTP | `80` |
| Porta de HTTPS | `443` |
| Cabeçalho IPv4 | $20$ a $60$ bytes |
| Cabeçalho UDP | $8$ bytes, sem garantia de entrega |
| Cabeçalho TCP | $20$ a $60$ bytes, orientado a conexão |

## R1.10 Exercícios

Não olhe o gabarito antes de tentar.

### Fixação

1. Quantas camadas tem o modelo TCP/IP estudado neste capítulo?
2. Quantos bits há em um octeto?
3. Escreva os quatro octetos de `127.0.0.1`.
4. Qual serviço usa a porta `443`?
5. Quantos bytes mede o cabeçalho UDP?

### Aplicação

6. Converta `192.168.0.10` em quatro octetos e diga quantos bits o endereço tem no total.
7. Escreva em binário de oito bits o octeto `127`.
8. Explique, em uma frase, por que `127.0.0.1` e a porta `80` são informações diferentes.
9. Um colega afirma que a porta `80` é de HTTPS. Corrija a afirmação.
10. Corrija esta frase: "o cabeçalho IPv4 mede sempre $20$ bytes".

### Desafio

11. Duas mensagens chegam ao mesmo `127.0.0.1`: uma na porta `22` e outra na porta `53`. Como o receptor sabe qual programa atender?
12. Compare UDP e TCP usando apenas afirmações que este capítulo garante.
13. Por que `127.0.0.256` não é um endereço IPv4 válido?
14. Por que testar em `127.0.0.1` é uma prática defensiva? O que esse teste não prova?
15. Descreva a sequência de camadas para a mensagem UDP destinada à porta `50000` em `127.0.0.1`, indicando o que cada camada acrescenta.

## R1.11 Gabarito comentado

### Fixação

1. Quatro: Aplicação, Transporte, Internet e Acesso à Rede. **Onde a maioria erra:** responde sete, lembrando da OSI; sete é o número do modelo de referência, não do TCP/IP deste capítulo.
2. Oito bits, pois adotamos a convenção de um byte com oito bits. **Onde a maioria erra:** responde $32$, que é o total dos quatro octetos de um endereço IPv4.
3. `127`, `0`, `0` e `1`. **Onde a maioria erra:** escreve `127.0.0.1` como um número único ou conta os pontos como se fossem octetos.
4. HTTPS. **Onde a maioria erra:** troca por HTTP, que usa a porta `80`.
5. $8$ bytes: quatro campos de dois bytes. **Onde a maioria erra:** responde $20$, copiando o mínimo do cabeçalho TCP.

### Aplicação

6. Os octetos são `192`, `168`, `0` e `10`. Como são quatro grupos de oito bits, o total é $4 \times 8 = 32$ bits. **Onde a maioria erra:** conta os três pontos como bits e chega a $35$.
7. $127 = 64 + 32 + 16 + 8 + 4 + 2 + 1$, então o binário de oito bits é `01111111`. **Onde a maioria erra:** escreve `1111111`, com sete caracteres, e esquece o zero inicial.
8. O IP identifica o computador de destino; a porta identifica qual processo dentro dele deve receber a mensagem. **Onde a maioria erra:** chama a porta de "um segundo IP".
9. A porta `80` é de HTTP; HTTPS usa a porta `443`. **Onde a maioria erra:** acha que HTTPS é o mesmo serviço de HTTP e deve usar a mesma porta.
10. O cabeçalho IPv4 mede de $20$ a $60$ bytes. O valor $20$ é o mínimo; campos de opção podem aumentá-lo até $60$. **Onde a maioria erra:** acha que opções não ocupam espaço no cabeçalho.

### Desafio

11. A camada de Transporte lê a porta de destino: `22` encaminha ao programa SSH e `53` ao programa de consulta DNS. O IP é o mesmo porque os dois processos estão no mesmo computador. **Onde a maioria erra:** tenta distinguir as mensagens pelo endereço IP, que é igual nas duas.
12. Afirmações seguras: UDP tem cabeçalho de $8$ bytes, não estabelece conexão e não promete entrega; TCP tem cabeçalho de $20$ a $60$ bytes e é orientado a conexão. **Onde a maioria erra:** inventa uma regra de "melhor para jogos" ou afirma que TCP nunca falha.
13. Cada octeto aceita apenas valores de $0$ a $255$; $256$ está fora desse intervalo. **Onde a maioria erra:** acha que qualquer número decimal é aceito porque "é decimal".
14. Porque a comunicação começa e termina no próprio computador: o teste não depende de rede externa e não envia dados a terceiros. Ele não prova que um cabo, uma rede externa ou um servidor remoto funciona. **Onde a maioria erra:** conclui que a Internet inteira está funcionando a partir de um teste local.
15. Aplicação cria os dados `oi`; Transporte acrescenta as portas e o cabeçalho UDP de $8$ bytes, com destino `50000`; Internet acrescenta o IP `127.0.0.1` e o cabeçalho IPv4 de $20$ bytes; Acesso à Rede entrega no loopback. **Onde a maioria erra:** coloca o endereço IP antes da porta, inverte a ordem das camadas ou troca o cabeçalho UDP de $8$ bytes pelo cabeçalho TCP.

## R1.12 Mini-projeto prático

**Mapa do clique ao pacote — versão local.** Crie um pequeno relatório e um programa que, ao receber um endereço e uma porta bem conhecida, mostre o caminho do dado pelas quatro camadas e os tamanhos de cabeçalho envolvidos. Todo o teste deve usar somente `127.0.0.1`.

**Requisitos.**

1. Programa completo em Python 3, com saída esperada em bloco separado.
2. Validar quatro octetos no intervalo de $0$ a $255$, como no exemplo de R1.5.3.
3. Aceitar como destino somente `127.0.0.1` e explicar no código por que essa restrição é uma escolha defensiva.
4. Imprimir as quatro camadas na ordem e a porta informada, usando apenas as portas `22`, `53`, `80` e `443`.
5. Imprimir os tamanhos: cabeçalho IPv4 de $20$ a $60$ bytes, UDP de $8$ bytes e TCP de $20$ a $60$ bytes.
6. README com a saída esperada e um parágrafo "O que este projeto provou que eu sei fazer".

**Dicas progressivas.** Comece validando o endereço. Depois acrescente a conversão para binário. Em seguida escreva as quatro linhas das camadas. Por fim, inclua os tamanhos de cabeçalho e a restrição de loopback. Se a saída divergir, compare linha a linha com o bloco esperado antes de mexer no código.

**Critério de correção.** Outra pessoa executa o programa com `127.0.0.1` e a porta `443`, confere a saída com o README, verifica que `127.0.0.256` é rejeitado e confirma que não aparece nenhum endereço externo no código nem na saída.

## R1.13 Para ir além

- **Próximos passos na trilha didática:** R2 (meio físico e Ethernet), R3 (endereçamento IP e sub-redes) e R5 (UDP e TCP). Aqui você recebeu o vocabulário mínimo para circular entre os temas; o tratamento completo fica nesses módulos. Na aplicação, os temas seguintes aparecem principalmente sob "Protocolos e aplicações".
- **Leituras recomendadas:** *Computer Networks*, de Andrew S. Tanenbaum e David J. Wetherall; *Computer Networking: A Top-Down Approach*, de James F. Kurose e Keith W. Ross. São obras reais, usadas como referência de currículo, não como substituto dos exercícios deste capítulo.
- **Documentação oficial:** RFC Editor (`rfc-editor.org`) para a RFC 791, *Internet Protocol* (IPv4), a RFC 768, *User Datagram Protocol* (UDP), e a RFC 9293, *Transmission Control Protocol (TCP)*, que substitui a RFC 793. O registro público de portas fica no IANA (`iana.org/assignments/service-names-port-numbers/`). Para os trechos em Python 3, veja `docs.python.org`.
- **Pergunta aberta:** se o endereço IP identifica a máquina e a porta identifica o processo, o que deve acontecer quando dois processos no mesmo computador querem usar a mesma porta ao mesmo tempo?

## R1.14 Autoverificação final

- [x] Há de $4$ a $8$ objetivos com verbos observáveis? Sim, sete em R1.1.
- [x] O pré-requisito é "nenhum" e o miniteste tem três perguntas respondidas? Sim, em R1.2.
- [x] A motivação traz problema real e contexto histórico verificável? Sim, em R1.3.
- [x] A analogia vem antes da definição formal, com limites declarados? Sim, em R1.4.
- [x] Cada regra nova tem um "porquê"? Sim, em R1.5.1, R1.5.2, R1.5.3, R1.5.4 e R1.5.5.
- [x] Há quadros curtos de erros ao final das seções importantes, além do quadro consolidado? Sim, em R1.4, R1.5.1 a R1.5.5 e R1.7, com o quadro completo em R1.8.
- [x] A progressão em espiral usa a frase "Lembra do capítulo X? Aqui ele aparece de novo."? Sim, para M1, C7 e M7.
- [x] Existe um quadro "Onde isso aparece no mundo real" ligando Matemática, C, Redes e Engenharia de Software? Sim, em R1.5.7.
- [x] Há pausas de aprendizagem ativa com a resposta escondida? Sim, em R1.5.3, R1.5.4 e R1.5.5.
- [x] Um pacote é mostrado byte a byte com valores verificáveis e campos não inventados marcados como não fixados? Sim, em R1.5.7.
- [x] Há três exemplos resolvidos em dificuldade crescente, todos verificados? Sim, em R1.6.
- [x] A ordem vai do concreto ao abstrato? Sim, de R1.5.1 a R1.5.6.
- [x] Há visualização em ASCII com descrição textual? Sim, em R1.7.
- [x] O resumo tem entre $5$ e $10$ linhas e uma cola rápida? Sim, em R1.9.
- [x] Há exatamente $15$ exercícios em grupos de $5$, $5$ e $5$? Sim, em R1.10.
- [x] O gabarito comentado fica em seção separada e aponta onde a maioria erra? Sim, em R1.11.
- [x] O mini-projeto tem objetivo, requisitos, dicas progressivas e critério de correção? Sim, em R1.12.
- [x] As leituras são reais e a documentação é oficial? Sim, em R1.13.
- [x] Nenhum dado foi inventado; portas, cabeçalhos e faixa de loopback são verificáveis? Sim.
- [x] O laboratório usa apenas loopback e não ensina ataque a terceiros? Sim, em R1.12 e nos campos FORGE.
- [x] Todo termo técnico foi definido antes do uso? Sim.
- [x] Nenhuma resolução passo a passo usa abreviação proibida? Sim.
- [x] O código em Python 3 tem saída esperada e não abre conexão? Sim, em R1.5.3 e R1.5.4.
- [x] A ambiguidade de `R1` foi declarada e o tema da plataforma foi nomeado? Sim, nos metadados.
- [x] Os campos FORGE estão preenchidos? Sim, abaixo.
- [x] Um aluno que leu apenas este capítulo consegue resolver os exercícios? Sim.

---

## Campos para a plataforma FORGE

### objetivo

Entender como uma mensagem recebe etiquetas de camada, endereço IP e porta até virar um pacote, usando somente o loopback local.

### blocos

1. **Objetivo:** ler a meta da sessão e o tema "Fundamentos e modelos" nos metadados.
2. **Explicação curta:** quatro camadas; IP escolhe o aparelho; porta escolhe o processo; cabeçalho é a etiqueta.
3. **Exemplo visual:** diagrama do caminho do dado em R1.7 e tabela byte a byte de R1.5.7.
4. **Exemplo resolvido:** Exemplo 2 de R1.6, com `oi`, porta `80` e `127.0.0.1`.
5. **Pequeno exercício:** questões 1, 3, 4, 5 e 8 de R1.10.
6. **Verificação:** conferir a saída esperada do trecho Python de R1.5.3 e suas conversões de octetos.
7. **Resumo:** cola rápida de R1.9.
8. **Próxima etapa:** módulos didáticos R2, R3 e R5; na aplicação, "Protocolos e aplicações".

### questoes

1. Quantas camadas tem o modelo TCP/IP estudado neste capítulo?
   - A) Três.
   - B) Quatro.
   - C) Sete.
   - D) Oito.
   - **Resposta: B.** Aplicação, Transporte, Internet e Acesso à Rede. Sete é o número da OSI.

2. Qual afirmação sobre a relação entre TCP/IP e OSI é correta?
   - A) As camadas coincidem exatamente, uma a uma.
   - B) A camada de Aplicação do TCP/IP corresponde aproximadamente a Aplicação, Apresentação e Sessão da OSI.
   - C) A camada de Internet corresponde exatamente à camada Física da OSI.
   - D) A OSI tem quatro camadas e o TCP/IP tem sete.
   - **Resposta: B.** A correspondência é aproximada; a OSI tem sete camadas e agrupa funções de forma diferente.

3. Como é um endereço IPv4?
   - A) Quatro octetos, com $32$ bits no total.
   - B) Oito octetos, com $64$ bits no total.
   - C) Quatro bits escritos com pontos.
   - D) Dois octetos, com $16$ bits no total.
   - **Resposta: A.** Cada octeto tem oito bits e vai de $0$ a $255$.

4. Qual é o octeto `127` em binário de oito bits?
   - A) `01111111`.
   - B) `11111111`.
   - C) `10000000`.
   - D) `01111110`.
   - **Resposta: A.** $127 = 64 + 32 + 16 + 8 + 4 + 2 + 1$.

5. O que representa `127.0.0.1`?
   - A) Um computador remoto qualquer.
   - B) O próprio computador, por loopback.
   - C) A porta do serviço SSH.
   - D) O cabeçalho de um pacote UDP.
   - **Resposta: B.** O nome localhost designa a própria máquina.

6. O que significa a notação `127.0.0.0/8`?
   - A) É a faixa reservada ao loopback, com os primeiros oito bits fixos.
   - B) É o tamanho do cabeçalho UDP.
   - C) É a porta bem conhecida do DNS.
   - D) É o número de camadas do modelo OSI.
   - **Resposta: A.** Os outros $24$ bits podem variar dentro da faixa.

7. Qual par serviço e porta está correto?
   - A) HTTP na porta `443`.
   - B) HTTPS na porta `80`.
   - C) SSH na porta `22`.
   - D) DNS na porta `80`.
   - **Resposta: C.** SSH usa `22`; DNS usa `53`; HTTP usa `80`; HTTPS usa `443`.

8. Quantos bytes mede o cabeçalho UDP?
   - A) Quatro.
   - B) Oito.
   - C) Vinte.
   - D) Sessenta.
   - **Resposta: B.** São quatro campos de dois bytes; o UDP não estabelece conexão e não garante entrega.

9. O que é correto afirmar sobre o TCP?
   - A) Tem cabeçalho de $8$ bytes e não estabelece conexão.
   - B) Tem cabeçalho de $20$ a $60$ bytes e é orientado a conexão.
   - C) Tem cabeçalho de exatamente $60$ bytes e não usa portas.
   - D) Tem cabeçalho de $20$ bytes e é igual ao UDP.
   - **Resposta: B.** O tamanho varia com opções e a conversa é orientada a conexão.

10. Qual é o tamanho do cabeçalho IPv4?
    - A) Sempre $20$ bytes.
    - B) Sempre $60$ bytes.
    - C) De $20$ a $60$ bytes.
    - D) Exatamente $8$ bytes.
    - **Resposta: C.** $20$ é o mínimo; as opções podem ampliá-lo até $60$.

### sintese_feynman

Explique com as suas palavras, em pelo menos 30 caracteres, como uma mensagem sai de um programa e chega a outro no mesmo computador. Use uma analogia original, diferente do bilhete e do carteiro deste capítulo: por exemplo, compare o endereço IP e a porta a um número de telefone com ramal, em que o número principal identifica o prédio e o ramal identifica a pessoa. Crie também um exemplo seu, como enviar a palavra `ok` de `127.0.0.1` para a porta `80`. Diga onde a analogia funciona e onde ela quebra. Não copie frases do texto.

### cartoes_erro

1. Por que `127.0.0.1` não é um endereço para alcançar outro computador?
2. O que acontece se você escrever `127.0.0.256` como IPv4?
3. Por que a porta `80` e o IP `127.0.0.1` não são a mesma informação?
4. O cabeçalho IPv4 mede sempre $20$ bytes?
5. O UDP garante a entrega da mesma forma que o TCP?

### laboratorio

- **Simulação:** desenhe em papel quatro caixas rotuladas Aplicação, Transporte, Internet e Acesso à Rede. Escreva `oi` na primeira, a porta `80` na segunda, `127.0.0.1` na terceira e "loopback" na quarta. Ao lado, anote os tamanhos de cabeçalho: IPv4 de $20$ a $60$ bytes, UDP de $8$ bytes, TCP de $20$ a $60$ bytes. Nenhum pacote é enviado.
- **Execução real:** em computador próprio e autorizado, execute o trecho Python de R1.5.3 e compare a saída com o bloco esperado. Se quiser confirmar o loopback com uma ferramenta do sistema, use apenas `ping 127.0.0.1` (`ping 127.0.0.1` no PowerShell do Windows). Registre a saída como evidência. Não use outro endereço, não varrede redes e não altere configuração de aparelho de terceiros.

### indicadores

Domínio (aulas com selo "Dominada com Evidência", nota mínima de $8$ em $10$ e síntese Feynman de pelo menos 30 caracteres), Revisões vencidas, Erros a refazer, Labs com evidência, Módulos em andamento, Horas registradas.

### projeto

Nenhum neste capítulo. O mini-projeto local de R1.12 não é MP5 nem MP6: MP5 (cliente e servidor eco TCP) pressupõe os módulos didáticos R5 e R10, e MP6 (analisador de log HTTP) pressupõe R7. Os códigos `MP1` a `MP10` pertencem ao catálogo didático da seção 15 do `PROMPT_MESTRE.md`; não os confunda com o portfólio canônico `P0` a `P10` da aplicação.


# Mapas conceituais do FORGE

Oito mapas em texto puro, desenhados com caixas, setas e caracteres Unicode. Eles servem para ver a estrutura de uma ideia antes de abrir os arquivos longos do ecossistema. Não há imagens, nem notação LaTeX, nem diagramas em sintaxe especial.

Como ler: comece pela caixa superior, siga as setas para baixo e depois responda às três perguntas-ponte. A legenda nomeia os nós com as palavras que você deve conseguir evocar sem olhar.

Cada pergunta-ponte liga o mapa a outra área do FORGE. Responda em voz alta, com exemplo próprio, antes de consultar os arquivos citados.

---

## Mapa 1 — Álgebra → Funções → Cálculo

```
┌──────────────────────────────┐
│ Álgebra                      │
│ x, equação, fatoração        │
└──────────────┬───────────────┘
               │ generaliza a relação
               v
┌──────────────────────────────┐
│ Função (function)            │
│ domínio → imagem             │
└──────────────┬───────────────┘
               │ variação contínua
               v
┌──────────────────────────────┐
│ Limite → Derivada            │
│ taxa instantânea             │
└──────────────┬───────────────┘
               │ acumulação de fatias
               v
┌──────────────────────────────┐
│ Integral (integral)          │
│ ∫ f(x) dx                    │
└──────────────────────────────┘
```

Legenda dos nós:

- **Álgebra:** manipula a incógnita; a equação é uma restrição sobre x.
- **Função:** troca a pergunta "qual x?" por "como a saída muda com a entrada?".
- **Limite:** ferramenta que contorna a indeterminação 0/0 sem substituir diretamente.
- **Derivada:** inclinação local; nasce do limite da razão entre variações.
- **Integral:** soma de fatias; o Teorema Fundamental liga derivada e integral.

Perguntas-ponte:

1. Como a composição de funções explica a regra da cadeia em uma derivada?
2. De que modo um ponteiro em C é como uma variável x que guarda uma referência, não um valor?
3. Por que uma taxa de juros compostos (compound interest) se comporta como uma exponencial, e não como uma reta?

---

## Mapa 2 — Geometria plana → espacial → analítica

```
┌──────────────────────────────┐
│ Geometria plana              │
│ triângulo, círculo, ângulo   │
└──────────────┬───────────────┘
               │ acrescenta a terceira dimensão
               v
┌──────────────────────────────┐
│ Geometria espacial           │
│ volume → área superficial    │
└──────────────┬───────────────┘
               │ coordenação por eixos
               v
┌──────────────────────────────┐
│ Geometria analítica          │
│ (x, y, z), distância, reta   │
└──────────────┬───────────────┘
               │ traduz forma em álgebra
               v
┌──────────────────────────────┐
│ Vetores e matrizes           │
│ rotação → transformação      │
└──────────────────────────────┘
```

Legenda dos nós:

- **Geometria plana:** relações em duas dimensões; Pitágoras é o nó central.
- **Geometria espacial:** prismas, pirâmides e esferas; volume mede ocupação.
- **Geometria analítica:** pontos viram pares ou ternos ordenados; distância usa √.
- **Vetores:** deslocamento com direção e sentido; somam-se componente a componente.
- **Matrizes:** operadores que transformam vetores, como girar no plano.

Perguntas-ponte:

1. Por que a distância entre dois pontos repete Pitágoras com coordenadas?
2. Como um vetor de rede (endereço IP) difere de um vetor geométrico?
3. Onde a noção de volume ajuda a entender consumo de memória em um buffer?

---

## Mapa 3 — Combinatória → Probabilidade → Estatística

```
┌──────────────────────────────┐
│ Combinatória                 │
│ soma → produto → C(n,k)      │
└──────────────┬───────────────┘
               │ conta o espaço amostral
               v
┌──────────────────────────────┐
│ Probabilidade                │
│ evento → P(A) ∈ [0, 1]       │
└──────────────┬───────────────┘
               │ observa muitas repetições
               v
┌──────────────────────────────┐
│ Estatística                  │
│ média → variância → amostra  │
└──────────────┬───────────────┘
               │ estima e decide
               v
┌──────────────────────────────┐
│ Inferência e erro            │
│ Δ amostra → conclusão        │
└──────────────────────────────┘
```

Legenda dos nós:

- **Combinatória:** contar antes de medir; soma para casos disjuntos, produto para etapas.
- **Probabilidade:** razão entre casos favoráveis e possíveis quando o modelo é uniforme.
- **Evento:** subconjunto do espaço amostral; união e interseção seguem regras próprias.
- **Estatística:** descreve dados observados com média, mediana e desvio padrão.
- **Inferência:** generaliza da amostra para a população com incerteza explícita.

Perguntas-ponte:

1. Contar senhas possíveis com 94 símbolos usa combinação ou permutação? Por quê?
2. Como a variância de uma medição aparece na precisão de um float em C?
3. De que forma a entropia de uma fonte muda o espaço amostral de um ataque?

---

## Mapa 4 — Inteiros → Ponto flutuante → Segurança em C

```
┌──────────────────────────────┐
│ Inteiros (integer)           │
│ faixa limitada → estouro     │
└──────────────┬───────────────┘
               │ necessidade de fração
               v
┌──────────────────────────────┐
│ Ponto flutuante (float)      │
│ mantissa → expoente → erro   │
└──────────────┬───────────────┘
               │ conversão descuidada
               v
┌──────────────────────────────┐
│ Limites de conversão         │
│ int ↔ size_t → negativo      │
└──────────────┬───────────────┘
               │ tamanho mal calculado
               v
┌──────────────────────────────┐
│ Segurança em C               │
│ overflow → ponteiro → AEAD   │
└──────────────────────────────┘
```

Legenda dos nós:

- **Inteiros:** intervalo finito; soma além do máximo gera comportamento indefinido em C com sinal.
- **Ponto flutuante:** aproximação binária; 0,1 não é exatamente representável.
- **Conversão:** size_t é sem sinal; um int negativo pode virar um valor enorme.
- **Overflow:** escrita além da capacidade do buffer alocado.
- **Sanitização:** limpeza de memória e checagem de limites antes de usar o dado.

Perguntas-ponte:

1. Por que `size_t` é mais seguro que `int` para índices, mas ainda exige checagem?
2. Como o erro de arredondamento influencia uma estimativa de entropia em bits?
3. De que modo um estouro de buffer pode virar uma falha de autenticação?

---

## Mapa 5 — Camadas OSI e TCP/IP

```
┌──────────────────────────────┐
│ Aplicação                    │
│ DNS → HTTP → TOTP            │
└──────────────┬───────────────┘
               │ entrega ao transporte
               v
┌──────────────────────────────┐
│ Transporte                   │
│ TCP confiável | UDP rápido   │
└──────────────┬───────────────┘
               │ endereça máquinas
               v
┌──────────────────────────────┐
│ Rede (IP)                    │
│ pacote → rota → TTL          │
└──────────────┬───────────────┘
               │ entrega na rede local
               v
┌──────────────────────────────┐
│ Enlace → Físico              │
│ quadro → MAC → sinal         │
└──────────────────────────────┘
```

Legenda dos nós:

- **Aplicação:** protocolos que o usuário reconhece, como DNS e HTTP.
- **Transporte:** TCP entrega ordenada com handshake; UDP entrega sem promessa.
- **Rede:** IP encaminha pacotes entre redes usando rota e TTL.
- **Enlace:** quadros Ethernet com endereços MAC na rede local.
- **Físico:** sinal elétrico, óptico ou rádio; onde a latência começa.

Perguntas-ponte:

1. Onde o TLS 1.3 se encaixa entre a aplicação e o transporte?
2. Por que um nonce repetido em GCM é grave mesmo com TCP correto?
3. Como a latência de uma camada afeta a janela de aceitação do TOTP?

---

## Mapa 6 — Subnetting → Roteamento → DNS

```
┌──────────────────────────────┐
│ Bloco IPv4                   │
│ 192.168.1.0/24               │
└──────────────┬───────────────┘
               │ divide por máscara
               v
┌──────────────────────────────┐
│ Sub-redes e VLSM             │
│ rede → hosts → broadcast     │
└──────────────┬───────────────┘
               │ próximo salto
               v
┌──────────────────────────────┐
│ Roteamento                   │
│ rota → gateway → TTL         │
└──────────────┬───────────────┘
               │ nome para endereço
               v
┌──────────────────────────────┐
│ DNS                          │
│ studies.local → IP → TTL     │
└──────────────────────────────┘
```

Legenda dos nós:

- **CIDR:** escreve o prefixo, como /24, no lugar de uma máscara longa.
- **VLSM:** sub-redes de tamanhos diferentes dentro de um mesmo bloco.
- **Rota:** regra que aponta o caminho para uma rede destino.
- **Gateway:** saída da rede local para as demais.
- **DNS:** resolve nome em endereço; TTL define por quanto tempo a resposta vale.

Perguntas-ponte:

1. Por que o broadcast de uma sub-rede não é um endereço atribuível a host?
2. Como a calculadora CIDR ajuda a evitar sobreposição de blocos?
3. De que forma a fixação de certificado protege a resolução de studies.local?

---

## Mapa 7 — Requisitos → Arquitetura → Testes → Deploy

```
┌──────────────────────────────┐
│ Requisitos                   │
│ necessidade → critério       │
└──────────────┬───────────────┘
               │ traduz em decisões
               v
┌──────────────────────────────┐
│ Arquitetura                  │
│ módulos → interfaces → AAD   │
└──────────────┬───────────────┘
               │ implementa e verifica
               v
┌──────────────────────────────┐
│ Testes                       │
│ unitário → integração → log  │
└──────────────┬───────────────┘
               │ gate observável
               v
┌──────────────────────────────┐
│ Deploy → Rollback            │
│ versão → monitorar → voltar  │
└──────────────────────────────┘
```

Legenda dos nós:

- **Requisito:** frase verificável, não desejo vago.
- **Arquitetura:** define fronteiras; no cofre, cabeçalho e AAD são parte do contrato.
- **Interface:** forma de comunicação entre módulos, estável mesmo quando o interior muda.
- **Teste:** prova executável de que o comportamento continua correto.
- **Rollback:** volta planejada quando o monitoramento acusa regressão.

Perguntas-ponte:

1. Como transformar "nunca repetir nonce" em critério de conclusão de um teste?
2. Por que alterar a versão do cofre sem autenticá-la é uma regressão de segurança?
3. O que a dívida técnica tem a ver com a velocidade do deploy?

---

## Mapa 8 — Métodos de estudo → Recuperação espaçada → Metacognição

```
┌──────────────────────────────┐
│ Métodos de estudo            │
│ resumo → mapa → exercício    │
└──────────────┬───────────────┘
               │ escolhe o que evocar
               v
┌──────────────────────────────┐
│ Recuperação espaçada         │
│ dia 1 → 3 → 7 → 16 → 35      │
└──────────────┬───────────────┘
               │ mede o resultado
               v
┌──────────────────────────────┐
│ Metacognição                 │
│ previsão → acerto → ajuste   │
└──────────────┬───────────────┘
               │ realimenta o plano
               v
┌──────────────────────────────┐
│ Rotina revisada              │
│ intercalar → dormir → repetir│
└──────────────────────────────┘
```

Legenda dos nós:

- **Métodos:** resumir, mapear e praticar são ações diferentes, com papéis distintos.
- **Recuperação:** evocar antes de consultar; o esforço é o mecanismo.
- **Espaçamento:** intervalos crescentes reduzem o esquecimento.
- **Metacognição:** comparar previsão e desempenho para corrigir a estratégia.
- **Rotina:** plano simples o bastante para ser executado em dias de trabalho.

Perguntas-ponte:

1. Por que reler o compêndio não substitui resolver questões do banco?
2. Como a ilusão de competência aparece quando se estuda apenas glossários?
3. De que forma um caderno de erros melhora a recuperação espaçada em C?

---

## Sugestão de uso combinado

1. Escolha um mapa por sessão e cubra o diagrama com uma folha.
2. Reconstrua as caixas de memória e compare com o original.
3. Responda as três perguntas-ponte sem consultar os arquivos.
4. Abra apenas o arquivo citado na pergunta mais difícil.
5. Registre no caderno de erros qual seta você esqueceu.
6. Revise o mesmo mapa nos dias 1, 3, 7, 16 e 35, nessa ordem.

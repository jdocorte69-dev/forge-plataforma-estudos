# Plano de 6 meses — FORGE

Versão: 2026-11-26. Idioma: português do Brasil. Notação: Unicode legível; sem LaTeX.

Este é o plano de fundação ampla. Ele complementa o plano de 12 semanas: onde aquele afunda os 20 temas de matemática, este distribui o tempo entre Matemática, linguagem C, Redes, Engenharia de Software, Ciência do Estudo e Criptografia. Nenhum serviço pago é necessário; o registro é manual, em markdown.

## 1. Carga semanal e composição das horas

A meta declarada é de aproximadamente 34 horas por semana. A composição é explícita para evitar confusão entre "estudo dirigido" e "carga de suporte":

- Segunda a sexta: 2 horas por dia de estudo dirigido ⇒ 5 × 2 = 10 horas.
- Sábado e domingo: 6 horas por dia de estudo dirigido ⇒ 2 × 6 = 12 horas.
- Estudo dirigido por semana: 10 + 12 = 22 horas.
- Carga de suporte distribuída ao longo da semana: 12 horas, divididas entre revisão espaçada (5 h), caderno de erros (3 h), leitura de resumos (2 h) e registro manual de horas, XP e decisões (2 h).
- Total: 22 + 12 = 34 horas por semana.

As 12 horas de suporte não são "tempo livre": são atividades com produto observável. Cartões respondidos, erros reclassificados, resumos anotados e linhas escritas no caderno contam. Assistir vídeo sem produzir nada não conta.

Para efeito de planejamento, considere 4,33 semanas por mês. Então 34 h × 4,33 = 147,22 h, arredondado para 147 horas por mês. Em seis meses: 6 × 147 = 882 horas.

## 2. Arquivos de apoio

| Área | Caminho real em `saida/` |
|---|---|
| Matemática | `03_matematica_consolidada/compendio_matematica.md` e `folha_de_formulas.md` |
| Banco e simulados | `04_exercicios/banco_exercicios.md`, `04_exercicios/simulados/`, `04_exercicios/anki/forge_matematica.csv` |
| Resumos | `02_resumos_por_livro/` |
| Ciência do estudo | `05_ciencia_do_estudo/metodologias.md`, `rotina_modelo.md`, `anti_procrastinacao.md`, `analise_educadores.md` |
| Primeiros princípios | `07_primeiros_principios/genese_10_descobertas.md` |
| C | `codigo/referencia_01_senha_csprng.c`, `referencia_02_buffer_seguro.c`, `referencia_03_servidor_tcp.c`, `compilar_e_testar.py` |
| Redes | `codigo/referencia_03_servidor_tcp.c`, `referencia_05_calculadora_cidr.py` |
| Engenharia de Software | `codigo/compilar_e_testar.py`, `extras/arquitetura_criptografica.md` seção 7 |
| Criptografia | `extras/arquitetura_criptografica.md`, `codigo/referencia_01_senha_csprng.c`, gênese I e J |

## 3. Blocos de dois meses

### Bloco 1 — Meses 1 e 2: alicerces e ferramentas

**Objetivo geral:** criar o vocabulário comum e a rotina. Matemática cobre os temas 01 a 08; C cobre tipos, ponteiros e memória; Redes entra só com o vocabulário de endereçamento; Engenharia de Software entra com compilação e testes; Ciência do Estudo fornece as regras de recuperação ativa (active recall) e repetição espaçada (spaced repetition); Criptografia começa por entropia e aleatoriedade.

**Dependências:** nenhuma externa. Internamente, a gênese dos primeiros princípios vem antes da folha de fórmulas, e a rotina de 3 horas vem antes de qualquer aumento de carga.

**Atividades obrigatórias:**
- 40 horas de matemática por mês, com 20 questões do banco por semana.
- 40 horas de C por mês, com um arquivo compilado por semana.
- Preencher a matriz de domínio com os 20 temas no mês 2.
- Registrar diariamente horas, XP e uma linha de erro no caderno.

**Marco do bloco 1 (fim do mês 2):** 20 questões sorteadas entre os temas 01 a 08 com ≥ 85% de acerto; dois programas C compilados sem erro; rotina cumprida em pelo menos 80% dos dias previstos.

### Bloco 2 — Meses 3 e 4: aplicação e conexão

**Objetivo geral:** transformar vocabulário em uso. Matemática avança para temas 09 a 16; C passa a strings, arquivos e servidor TCP; Redes ganha CIDR, sockets e modelo em camadas; Engenharia de Software entra com revisão de código e casos de teste; Criptografia liga resumos rápidos a derivação de chave; Ciência do Estudo passa a intercalação (interleaving) e prática deliberada (deliberate practice).

**Dependências:** exige o marco do bloco 1. Se o aluno não consegue explicar ponteiros com as próprias palavras, o bloco 2 de C começa com uma semana de recuperação antes de qualquer servidor.

**Atividades obrigatórias:**
- Intercalar duas áreas diferentes em pelo menos uma sessão por semana.
- Um simulado completo por mês, cronometrado, de `04_exercicios/simulados/`.
- Um laboratório de rede por mês com `referencia_05_calculadora_cidr.py`.
- Revisar o caderno de erros uma vez por semana, reagendando os cartões.

**Marco do bloco 2 (fim do mês 4):** 20 questões sorteadas dos temas 01 a 16 com ≥ 85%; um servidor TCP executado e uma conexão local estabelecida; 10 casos de teste escritos e executados; 3 simulados corrigidos no total.

### Bloco 3 — Meses 5 e 6: integração e domínio demonstrado

**Objetivo geral:** fechar as áreas e produzir evidência. Matemática cobre temas 17 a 20 e revisa os 20; C revisa os cinco códigos de referência; Redes fecha TLS e infraestrutura de chaves públicas; Engenharia de Software fecha auditoria e relatório; Criptografia cobre cofre, autenticação e ameaças; Ciência do Estudovira ferramenta de avaliação do próprio plano.

**Dependências:** exige o marco do bloco 2. A integração pressupõe que o aluno já consiga alternar entre áreas sem trocar de caderno a cada bloco.

**Atividades obrigatórias:**
- Um projeto integrador pequeno: um script que leia parâmetros, calcule algo, valide entrada e registre o resultado em arquivo markdown.
- Três simulados finais, um por semana nas semanas 9 a 11 do bloco.
- Revisão completa dos 20 temas com a folha de fórmulas coberta.
- Uma página de síntese por área, com o que mudou desde o mês 1.

**Marco do bloco 3 (fim do mês 6):** três simulados com ≥ 85%; 18 dos 20 temas em nível 3 ou 4 na matriz de domínio; cinco códigos de referência executados com saída anotada; relatório final de 2 páginas com horas, XP, erros e decisões.

## 4. Matriz mês × área — horas por mês

Cada linha soma 147 horas. A última coluna é o total por área em seis meses.

| Mês | Matemática | C | Redes | Eng. de Software | Ciência do Estudo | Criptografia | Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| 1 | 60 | 40 | 8 | 8 | 21 | 10 | 147 |
| 2 | 55 | 45 | 10 | 10 | 17 | 10 | 147 |
| 3 | 45 | 40 | 20 | 18 | 14 | 10 | 147 |
| 4 | 40 | 35 | 25 | 22 | 13 | 12 | 147 |
| 5 | 35 | 30 | 25 | 25 | 12 | 20 | 147 |
| 6 | 30 | 25 | 22 | 25 | 12 | 33 | 147 |
| **Total** | **265** | **215** | **110** | **108** | **89** | **95** | **882** |

Conferência das somas: 60+55+45+40+35+30 = 265; 40+45+40+35+30+25 = 215; 8+10+20+25+25+22 = 110; 8+10+18+22+25+25 = 108; 21+17+14+13+12+12 = 89; 10+10+10+12+20+33 = 95. Soma final: 265+215+110+108+89+95 = 882 = 6 × 147.

A distribuição é intencional: Matemática e C começam altas porque sustentam as demais; Redes e Engenharia de Software crescem quando o vocabulário já existe; Criptografia fica concentrada no fim porque depende de logaritmos, módulo, C e redes ao mesmo tempo.

## 5. Regras de promoção entre blocos

A promoção não é automática por calendário. Ela depende de evidência.

1. Toda promoção exige o marco do bloco anterior com número escrito no caderno: percentual, data e lista de erros.
2. Se o marco falhar uma vez, repita apenas as atividades das áreas abaixo do critério; as demais continuam.
3. Se o marco falhar duas vezes seguidas, reduza a carga de estudo dirigido de 22 para 16 horas por semana por duas semanas, mantendo as 12 horas de suporte. Volte a 22 quando houver dois registros semanais seguidos com ≥ 80% de cumprimento.
4. Nenhuma promoção pode acontecer com revisões espaçadas em atraso. Cartões pendentes são feitos antes de conteúdo novo.
5. Promoção com pendência em aberto só é permitida se a pendência estiver agendada no calendário com data explícita.
6. A decisão é registrada em uma linha: "promovido em 2027-01-31; evidência: marco 1 com 18/20; pendência: tema 10 agendado para 2027-02-05".

## 6. Domínio demonstrado por área

"Domínio demonstrado" significa produto observável, não sensação de familiaridade. Os critérios abaixo são os usados nos marcos.

| Área | Critério de domínio demonstrado | Evidência aceita |
|---|---|---|
| Matemática | 8 de 10 questões sem consulta, com justificativa da técnica escolhida antes da conta | Folha de respostas com data; simulado cronometrado |
| C | Escrever, compilar e explicar um programa com ponteiros e verificação de NULL | Arquivo `.c` com saída anotada no caderno |
| Redes | Calcular rede, broadcast e hosts de um CIDR e explicar o papel da máscara | Saída de `referencia_05_calculadora_cidr.py` mais esquema desenhado |
| Engenharia de Software | Escrever 10 casos de teste e identificar pelo menos 3 falhas antes da correção | Lista de casos com entrada, saída esperada e saída obtida |
| Ciência do Estudo | Explicar recuperação ativa, repetição espaçada e intercalação com exemplos diferentes | Três parágrafos de 5 linhas, um por técnica |
| Criptografia | Calcular entropia de uma senha e justificar por que um PRNG comum é inaceitável | Conta de H = L × log₂(N) e texto com a propriedade de previsibilidade |

Nível superior ao de "domínio demonstrado" é "ensinar": explicar o tema em 2 minutos, sem jargão, a alguém que nunca estudou o assunto. Isso corresponde ao nível 4 da matriz de domínio.

## 7. Integração com a plataforma FORGE

A plataforma FORGE, neste plano, é o próprio conjunto de arquivos markdown. Não há comando de XP, painel automático ou sincronização inventada. O registro é manual e acontece no caderno de estudo.

### 7.1 Registro de horas

Ao fim de cada bloco, escreva uma linha no caderno:

`2026-11-26 | Bloco A | Matemática | 90 min | temas 01-02 | 12 questões | 9 acertos`

As colunas são fixas: data, bloco, área, minutos, tema, quantidade feita, quantidade correta. Some as linhas no fim da semana e compare com a meta de 34 horas. A diferença é dado, não punição.

### 7.2 Registro de XP

XP é uma convenção local de registro, não uma moeda externa. A regra usada aqui:

- 1 XP por bloco de 90 minutos cumprido.
- 1 XP por 10 questões resolvidas sem consulta.
- 2 XP por simulado cronometrado e corrigido.
- 2 XP por código compilado com saída anotada.
- 3 XP por síntese Feynman escrita com analogia própria.

Não há limite, não há ranking e não há gasto. XP serve apenas para tornar visível a sequência de dias. Um dia com 0 XP é registrado como 0 — nunca apagado.

### 7.3 Caderno de erros

O caderno de erros é um arquivo markdown seu, fora das pastas de entrega deste plano. Cada erro recebe quatro campos:

- enunciado ou trecho do código que falhou;
- categoria: conceito, cálculo, leitura ou implementação;
- causa em uma frase, sem autojulgamento;
- data da próxima revisão, calculada com `06_plano_de_estudo/calendario_de_revisoes.md`.

Erro de conceito volta ao intervalo de 1 dia. Erro de cálculo volta a 3 dias. Erro de leitura volta a 1 dia com o hábito de circundar os dados do enunciado antes de resolver.

### 7.4 Baralho Anki

O arquivo `04_exercicios/anki/forge_matematica.csv` já contém cartões separados por ponto e vírgula, com colunas Frente, Verso e Tags. Importe-o como baralho separado por `;`. Não edite o CSV original: crie uma cópia pessoal se quiser acrescentar cartões de C, redes ou criptografia.

## 8. Rotina semanal recomendada

| Dia | Dirigido | Suporte | Produto da semana |
|---|---|---|---|
| Segunda | 2 h: matemática + C | 30 min de cartões | 10 questões e 1 arquivo C iniciado |
| Terça | 2 h: matemática | 30 min de caderno de erros | 10 questões e erros reagendados |
| Quarta | 2 h: C + redes | 30 min de cartões | 1 função compilada e 1 cálculo de CIDR |
| Quinta | 2 h: matemática + eng. de software | 30 min de resumos | 10 questões e 2 casos de teste |
| Sexta | 2 h: criptografia + ciência do estudo | 30 min de registro | 1 conta de entropia e 1 parágrafo de técnica |
| Sábado | 6 h: manhã matemática, tarde integração | 1 h de revisão espaçada | simulado ou laboratório |
| Domingo | 6 h: manhã C/redes, tarde projeto | 1 h de fechamento | síntese da semana com horas e XP |

A ordem interna de cada bloco é a mesma do plano de 12 semanas: intenção, recuperação, foco, prova prática, síntese e caderno de erros.

## 9. Regras de rebalanceamento

- Corte conteúdo novo antes de cortar revisão. Sempre.
- Se uma semana fechar abaixo de 80% da carga, a semana seguinte não acrescenta novo conteúdo até que as revisões pendentes estejam em dia.
- Se duas semanas seguidas fecharem abaixo de 70%, reduza a meta dirigida de 22 para 16 horas por duas semanas e reavalie o horário, não a disciplina.
- Fim de semana perdido não é recuperado com maratona na segunda. Ele vira uma pendência agendada.
- Férias ou doença são reajuste de prioridade, não procrastinação: registre, reagende e siga em frente.

## 10. Relatório final de seis meses

O relatório é uma página ou duas, em markdown, com estas seções: horas totais por área (copiar da matriz), XP acumulado por mês, marcos com data e percentual, cinco erros que mais repetiram, três decisões de rebalanceamento e a lista de temas que ainda exigem ensino. Não inclua opiniões sobre inteligência ou talento; inclua apenas evidência.

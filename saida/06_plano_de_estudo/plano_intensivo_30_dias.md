# Plano intensivo de 30 dias — FORGE

Versão: 2026-11-26. Idioma: português do Brasil. Notação: Unicode legível; sem LaTeX.

## Aviso inicial

Este é um plano de sprint. Ele comprime em 30 dias as 180 horas do plano de 12 semanas (6 h/dia × 30 dias = 180 h). Ele não substitui `06_plano_de_estudo/plano_12_semanas.md`: a sequência espaçada completa precisa de meses, não de semanas. Use este plano apenas em janela curta e deliberada, com data de início e de fim definidas, e retorne ao plano de 12 semanas ao terminar.

Não há API paga. Todos os caminhos citados existem em `saida/`.

## 1. Arquitetura do dia

Cada dia de 6 horas é dividido em duas janelas de 3 horas, com almoço real entre elas. O almoço não entra na conta.

|Janela|Horário sugerido|Blocos internos|
|---|---|---|
|Manhã|08:00–11:00|Intenção 5 min, revisão 15 min, foco 90 min, pausa 15 min, foco 45 min, prova prática 25 min, síntese 15 min, caderno 10 min|
|Tarde|13:00–16:00|Revisão 10 min, foco 90 min, pausa 15 min, foco 60 min, prova prática 25 min, síntese 15 min, caderno 15 min|

Pausas curtas de 5 minutos aparecem entre os focos. Revisão espaçada (spaced repetition) vem sempre antes do conteúdo novo. Recuperação ativa (active recall) vem sempre antes de reler.

### 1.1 Minuta da janela da manhã

| Minuto | Ação | Produto |
|---:|---|---|
| 00–05 | Escrever a intenção em uma frase | Frase no topo da folha |
| 05–20 | Cartões do dia e erros antigos | Cartões marcados como erro, esforço ou fácil |
| 20–30 | Pausa curta com água e olhar distante | Nenhum registro |
| 30–120 | Foco: reconstruir a ideia e resolver as primeiras questões | Questões numeradas |
| 120–135 | Pausa longa, sair da cadeira | Nenhum registro |
| 135–180 | Prova prática cronometrada, síntese e caderno | Acertos, erros classificados, próxima data |

### 1.2 Minuta da janela da tarde

| Minuto | Ação | Produto |
|---:|---|---|
| 00–10 | Revisão dos cartões vencidos | Cartões atualizados |
| 10–100 | Foco: continuar o tema ou executar o laboratório do dia | Código executado ou questões resolvidas |
| 100–115 | Pausa longa | Nenhum registro |
| 115–140 | Foco final: intercalação com tema vizinho | Quatro questões mistas |
| 140–165 | Prova prática e correção | Percentual do dia |
| 165–180 | Síntese Feynman e agendamento | Parágrafo de 5 linhas e data da próxima revisão |

A minuta não é obrigatória minuto a minuto. O que é obrigatório é a ordem: recuperar, produzir, verificar, explicar, agendar. Se o dia encurtar, corte o foco final e a intercalação; nunca corte a prova prática, a síntese e o caderno.

## 2. Quatro fases

- Fase 1 — Fundamentos (D01 a D07): construir o esqueleto dos temas 01 a 08 e a rotina.
- Fase 2 — Prática (D08 a D16): volume de questões, intercalação (interleaving) e código executado.
- Fase 3 — Integração (D17 a D24): temas 09 a 20 ligados a código, redes e criptografia.
- Fase 4 — Simulado (D25 a D30): três simulados cronometrados, correção e matriz de domínio fechada.

### 2.1 Objetivo e gate de cada fase

| Fase | Dias | Objetivo | Gate para sair |
|---|---|---|---|
| Fundamentos | D01–D07 | Reconhecer os oito primeiros temas e reconstruir as ideias centrais sem consulta | 12 de 15 questões sorteadas dos temas 01 a 08, sem consulta |
| Prática | D08–D16 | Resolver em volume e escolher a técnica antes de calcular | 14 de 20 questões intercaladas, com no máximo 3 erros de método |
| Integração | D17–D24 | Ligar cálculo, código, redes e criptografia num mesmo raciocínio | 3 laboratórios executados com saída anotada e 12 de 16 questões mistas |
| Simulado | D25–D30 | Medir desempenho e fechar a matriz com evidência | Três simulados com ≥ 85% e 18 de 20 temas em nível ≥ 3 |

Se o gate falhar, o dia seguinte da fase é usado para recuperação do critério, não para iniciar a fase posterior. O cronograma é deslocado, mas a sequência das fases não é quebrada.

### 2.2 Distribuição das 180 horas por fase

| Fase | Dias | Horas por dia | Total |
|---|---:|---:|---:|
| Fundamentos | 7 | 6 | 42 h |
| Prática | 9 | 6 | 54 h |
| Integração | 8 | 6 | 48 h |
| Simulado | 6 | 6 | 36 h |
| **Total** | **30** | **6** | **180 h** |

Conferência: 42 + 54 + 48 + 36 = 180. Esse total é igual ao do plano de 12 semanas (15 h × 12 = 180 h), mas obtido em um quarto do tempo. A diferença não é eficiência: é densidade, com menos tempo para a consolidação que o espaçamento longo permite.

## 3. Cronograma dia a dia

| Dia | Tema | Material | Exercícios | Revisão | Entrega |
|---|---|---|---|---|---|
| D01 | Números e encadeamento | Compêndio 01; folha linha 7 | 10 do banco, tema "Conjuntos numéricos" | Cartões do dia 1 | Encadeamento ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ desenhado |
| D02 | Potências e inteiros | Compêndio 02; folha linha 8 | 10 do banco, tema "Operações com inteiros" | D01 + dia 1 | 8 contas com expoente negativo |
| D03 | Produtos notáveis | Compêndio 03; gênese C | 12 do banco | D01, D02 | (a+b)² derivado por área |
| D04 | Fatoração e MDC | Compêndio 04; gênese E | 12 do banco | D02, D03 | 10 fatorações verificadas por multiplicação |
| D05 | Equações | Compêndio 05; folha linha 11 | 12 do banco | D03, D04 | Bháskara derivada por completo do quadrado |
| D06 | Funções e inversa | Compêndio 06; folha linha 12 | 12 do banco | D04, D05 | 6 funções com domínio, imagem e inversa |
| D07 | Logaritmos | Compêndio 07; gênese H | 12 do banco + simulado 01 Q7 | D05, D06 + dia 7 | Tabela de potências ligada a somas de log |
| D08 | Trigonometria | Compêndio 08; folha "Ângulos notáveis" | 15 do banco + simulado 01 Q8 | D06, D07 | Círculo unitário preenchido sem consulta |
| D09 | Sequências | Compêndio 09; folha linha 15 | 15 do banco | D07, D08 + dia 3 | Tabela PA/PG com a₈ calculado |
| D10 | Matrizes | Compêndio 10; folha linha 16 | 15 do banco + simulado 02 matrizes | D08, D09 | 8 determinantes e det(AB) conferido |
| D11 | Geometria plana | Compêndio 11; gênese A, B e C | 15 do banco | D09, D10 | Duas demonstrações com papel recortado |
| D12 | Geometria analítica | Compêndio 12; folha linha 18 | 15 do banco | D10, D11 | Distância desenhada como Pitágoras |
| D13 | Geometria espacial | Compêndio 13; folha linha 19 | 15 do banco | D11, D12 + dia 7 | 6 volumes com unidade explícita |
| D14 | Combinatória | Compêndio 14; folha linha 20 | 15 do banco | D12, D13 | 10 contagens com "ordem importa?" respondido |
| D15 | Probabilidade | Compêndio 15; folha linha 21 | 15 do banco + simulado 02 Q12 | D13, D14 | 6 verificações de P(A∪B) |
| D16 | Estatística | Compêndio 16; folha linha 22 | 15 do banco + simulado 02 completo | D14, D15 + dia 3 | Dois conjuntos com mesma média e variâncias distintas |
| D17 | Finanças | Compêndio 17; folha linha 23 | 12 do banco | D15, D16 | Comparação juros simples × compostos em 20 períodos |
| D18 | Limites | Compêndio 18; gênese G | 12 do banco + simulado 03 Q17–Q18 | D16, D17 | 8 limites com técnica escrita antes da conta |
| D19 | Derivadas | Compêndio 19; folha linha 25 | 12 do banco + simulado 03 Q19 | D17, D18 + dia 7 | Regras do produto e do quociente com exemplos |
| D20 | Integrais | Compêndio 20; folha linha 26 | 12 do banco + simulado 03 Q20 | D18, D19 | 10 integrais com F′ = f anotado |
| D21 | C — ponteiros e memória | `codigo/referencia_02_buffer_seguro.c` | 1 laboratório de compilação | D19, D20 | Função compilada com verificação de NULL |
| D22 | Redes — CIDR e TCP | `codigo/referencia_05_calculadora_cidr.py`, `referencia_03_servidor_tcp.c` | 1 laboratório de rede | D20, D21 | Saída de 192.168.1.0/24 com rede, broadcast e hosts |
| D23 | Criptografia — entropia | `extras/arquitetura_criptografica.md` seções 1–3 | 1 cálculo de H = L × log₂(N) | D21, D22 + dia 7 | H ≈ 131,1 bits justificado para L = 20, N = 94 |
| D24 | Criptografia — PRNG e ameaças | Arquitetura seções 2 e 7; gênese I e J | 12 questões mistas do banco | D22, D23 | Texto com o motivo pelo qual rand() é inaceitável |
| D25 | Simulado 01 | `04_exercicios/simulados/simulado_01.md` | 20 questões em 50 min | D23, D24 | Gabarito preenchido e erros classificados |
| D26 | Correção 01 + temas fracos | Banco e folha de fórmulas | 10 questões dos erros | D24, D25 + dia 3 | Lista dos 5 temas mais fracos |
| D27 | Simulado 02 | `04_exercicios/simulados/simulado_02.md` | 20 questões em 50 min | D25, D26 | Segundo gabarito com percentual |
| D28 | Correção 02 + intercalação | Banco, 4 temas sorteados | 16 questões intercaladas | D26, D27 | Escolha da técnica escrita antes de cada conta |
| D29 | Simulado 03 | `04_exercicios/simulados/simulado_03.md` | 20 questões em 50 min | D27, D28 + dia 7 | Terceiro gabarito com percentual |
| D30 | Fechamento | `06_plano_de_estudo/matriz_de_dominio.md`, `calendario_de_revisoes.md` | 20 questões sorteadas finais | Todas as pendências | Matriz com 20 níveis e 5 cartões agendados |

A coluna "Revisão" indica os dias cujos cartões voltam naquele dia, além dos intervalos fixos de 1, 3, 7, 15, 30 e 60 dias calculados em `calendario_de_revisoes.md`.

## 4. Regras de sono e carga

1. Dormir entre 7 e 8 horas. O sprint não autoriza noites de 5 horas: a recuperação noturna é parte do plano, não detalhe.
2. Nunca ultrapassar 6 horas de estudo dirigido em um dia. Excesso vira dívida de sono e derruba o dia seguinte.
3. Pausa longa de 15 minutos a cada 90 minutos de foco, com saída da cadeira, água e olhar distante. Sem rolagem de tela.
4. Duas janelas de distração de 15 minutos por dia, uma após o almoço e outra no fim. Fora delas, celular em outro cômodo.
5. Sinais de sobrecarga: erro de leitura repetido em questões fáceis, irritação ao abrir o caderno, sonolência na primeira janela, esquecimento do que foi lido há 20 minutos.
6. Ao aparecer um sinal de sobrecarga, reduza a janela da tarde de 3 para 1,5 horas e mantenha a manhã intacta. Dois sinais no mesmo dia encerram o estudo às 14h30.
7. Três dias seguidos com sinais de sobrecarga suspendem o sprint por 48 horas. Volte com 3 horas diárias por dois dias antes de retomar as 6.
8. Não use cafeína para cobrir sono acumulado. Se o cansaço persistir, o ajuste é de carga, não de estimulante.
9. Domingo e sábado do sprint não viram "dia de recuperar atraso": a carga é a mesma dos demais dias.
10. Ao final de cada janela, escreva a primeira ação da janela seguinte. Isso reduz o custo de retomada.

## 5. Plano de recuperação para 3 dias perdidos

Quando três dias consecutivos não acontecerem, use este protocolo. Ele não inclui maratona de compensação.

**Dia de retorno 1 — 3 horas**
- Manhã: 10 cartões do dia 1 e do dia 3; 3 questões do tema mais fraco; 1 síntese curta.
- Tarde: 1 laboratório de código ou 1 simulado parcial de 10 questões.
- Caderno: registrar os três dias perdidos com datas e gatilho provável, sem rótulo.

**Dia de retorno 2 — 4 horas**
- Manhã: retomar o tema exatamente onde parou; 8 questões sem consulta.
- Tarde: 8 questões de um tema diferente (intercalação) e 1 síntese Feynman.
- Caderno: reagendar todos os cartões vencidos para os intervalos 1, 3 e 7.

**Dia de retorno 3 — 6 horas**
- Grade completa das duas janelas, com prova prática cronometrada.
- Verificar se o percentual de acertos voltou ao patamar anterior aos dias perdidos.
- Se não voltou, repetir o tema uma quarta vez antes de avançar o cronograma.

**Regras do reagendamento**
- O cronograma de 30 dias é deslocado para frente em 3 dias; nenhum dia é duplicado.
- A fase corrente não avança até que o dia de retorno 3 esteja completo.
- Revisões vencidas são feitas antes de conteúdo novo, mesmo que isso atrase a fase.
- Se os três dias perdidos vieram de exaustão, reduza a meta diária para 4,5 horas pelo resto do sprint e aceite um total de 135 horas em vez de 180.

## 6. Critérios de saída do sprint

- Três simulados com pelo menos 85% de acerto cada.
- Matriz de domínio com pelo menos 18 dos 20 temas em nível 3 ou 4.
- Cinco códigos de referência executados, com saída anotada.
- Caderno de erros com todas as revisões agendadas para 1, 3, 7, 15, 30 e 60 dias a partir do último dia.
- Uma página final com horas realmente cumpridas e os três ajustes de carga feitos durante o sprint.

Se algum critério faltar, o retorno ao plano de 12 semanas é obrigatório. O sprint não se estende indefinidamente: ele termina no D30 com decisão escrita.

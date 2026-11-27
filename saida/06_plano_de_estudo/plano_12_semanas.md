# Plano de 12 semanas — FORGE

Versão: 2026-11-26. Idioma: português do Brasil. Notação: apenas Unicode legível; sem LaTeX.

Este plano é o caminho padrão do ecossistema FORGE. Ele presume 3 horas por dia, 5 dias por semana, durante 12 semanas: 15 horas por semana e 180 horas no total. Não há API paga, nem ferramenta externa obrigatória: todo o material é markdown local.

## 1. Contrato de carga e convenção das sessões

A carga diária de 3 horas é cumprida em dois blocos de 90 minutos. Ao longo de uma semana são 10 blocos de 90 minutos, pois 10 × 90 min = 900 min = 15 h.

Os blocos recebem três papéis, chamados A, B e C:

- Sessão A — recuperação e construção: abrir o caderno, revisar cartões, reconstruir a ideia sem consultar.
- Sessão B — prática e verificação: resolver questões novas, cronometrar, corrigir e classificar erros.
- Sessão C — integração e Feynman: ligar o tema aos outros, escrever a síntese com analogia própria e atualizar a matriz de domínio.

Grade semanal fixa: segunda A+B, terça A+B, quarta A+B, quinta A+B, sexta A+C. Assim a semana tem cinco sessões A, quatro sessões B e uma sessão C — 10 blocos de 90 minutos, exatamente 15 horas. A sessão C substitui a sessão B de sexta-feira; ela não se soma à carga, apenas troca de papel.

Cada bloco de 90 minutos segue a sequência do FORGE: intenção (5 min), revisão espaçada (10 min), foco (45 min), prova prática (15 min), síntese de Feynman (10 min) e caderno de erros (5 min). Pausas de 5 minutos ficam entre os blocos e não entram na conta das 3 horas.

## 2. Arquivos que sustentam o plano

Todos os caminhos abaixo existem em `saida/`. Use-os como fonte; não é necessário abrir os PDFs de `livros/`.

| Função | Caminho real |
|---|---|
| Resumos por livro e capítulo | `02_resumos_por_livro/` |
| Consolidação dos 20 temas | `03_matematica_consolidada/compendio_matematica.md` |
| Fórmulas em Unicode | `03_matematica_consolidada/folha_de_formulas.md` |
| Banco com 300 questões | `04_exercicios/banco_exercicios.md` |
| Simulados de 20 questões | `04_exercicios/simulados/` |
| Baralho para Anki | `04_exercicios/anki/forge_matematica.csv` |
| Ciência do estudo | `05_ciencia_do_estudo/` |
| Gênese dos primeiros princípios | `07_primeiros_principios/genese_10_descobertas.md` |
| Criptografia aplicada | `extras/arquitetura_criptografica.md` |
| Códigos de referência | `codigo/` |

Regra de ouro: leitura nunca conta como entrega. Contam questões resolvidas sem consulta, código executado, síntese escrita e simulado cronometrado.

## 3. Visão geral das 12 semanas

| Semana | Foco | Arquivos/seções a estudar | Exercícios | Revisões espaçadas | Entrega observável |
|---|---|---|---|---|---|
| 01 | Números e operações | Compêndio 01 e 02; folha, linhas 7–8; resumos `FME_1/cap01.md` a `cap04.md` | 30 do banco (15 por tema) + 10 cartões do CSV | Dias 1 e 3 dos temas 01–02 | 1 página de síntese com 5 classificações de números e 4 contas de potências |
| 02 | Álgebra elementar | Compêndio 03 e 04; folha, linhas 9–10; gênese F | 30 do banco + 8 questões do simulado 01 | Dias 1, 3 e 7 da semana 01 | 12 fatorações sem consulta, com verificação por multiplicação |
| 03 | Equações e funções | Compêndio 05 e 06; folha, linhas 11–12 | 30 do banco + 10 questões do simulado 01 | Dias 1, 3 e 7 da semana 02 | Mapa de 6 tipos de função com domínio, imagem e inversa |
| 04 | Logaritmos e trigonometria | Compêndio 07 e 08; folha, linhas 13–14; gênese H | 30 do banco + simulado 01 completo | Dias 1, 3, 7 e 15 acumulados | **Marco 1:** 20 questões sorteadas, meta ≥ 85% |
| 05 | Sequências e matrizes | Compêndio 09 e 10; folha, linhas 15–16 | 30 do banco + 10 do simulado 02 | Dias 1, 3 e 7 da semana 04 | Tabela PA/PG preenchida e 8 determinantes calculados |
| 06 | Geometria plana e analítica | Compêndio 11 e 12; folha, linhas 17–18; gênese A, B e C | 30 do banco + 10 do simulado 02 | Dias 1, 3 e 7 da semana 05 | Demonstração visual de Pitágoras reescrita sem olhar |
| 07 | Geometria espacial e combinatória | Compêndio 13 e 14; folha, linhas 19–20 | 30 do banco + 10 do simulado 02 | Dias 1, 3 e 7 da semana 06 | 10 volumes e 10 contagens com justificativa da escolha |
| 08 | Probabilidade e estatística | Compêndio 15 e 16; folha, linhas 21–22 | 30 do banco + simulado 02 completo | Dias 1, 3, 7 e 15 acumulados | **Marco 2:** 20 questões sorteadas, meta ≥ 85% |
| 09 | Finanças e limites | Compêndio 17 e 18; folha, linhas 23–24; gênese G | 30 do banco + 10 do simulado 03 | Dias 1, 3 e 7 da semana 08 | 8 limites com fatoração ou racionalização, sem substituição direta |
| 10 | Derivadas e integrais | Compêndio 19 e 20; folha, linhas 25–26 | 30 do banco + 10 do simulado 03 | Dias 1, 3 e 7 da semana 09 | 10 derivadas e 10 integrais com o diferencial escrito |
| 11 | Código, redes e criptografia | `codigo/`; `extras/arquitetura_criptografica.md`, seções 1–3; gênese I e J | 3 laboratórios de código + 12 questões mistas | Dias 1, 3 e 7 da semana 10 | 3 scripts executados com saída anotada no caderno |
| 12 | Integração final e simulados | Compêndio inteiro; folha inteira; os 3 simulados; matriz de domínio | 60 questões sorteadas + 3 simulados | Dias 1, 3, 7, 15 e 30 acumulados | **Marco 3:** 3 simulados ≥ 85% e matriz com 18 de 20 temas em nível ≥ 3 |

## 4. Blocos detalhados por semana

### Semana 01 — Números e operações

**Sessão A (90 min)**
- Objetivo: classificar √4, √10 e dízimas periódicas sem olhar a folha de fórmulas.
- Material: `03_matematica_consolidada/compendio_matematica.md` seções 01 e 02; `03_matematica_consolidada/folha_de_formulas.md` linhas 7–8.
- Método: leitura ativa de 20 minutos, fechar o arquivo, reconstruir o encadeamento ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ em papel, converter três dízimas por conta própria.
- Produto de aprendizagem: uma página com o encadeamento desenhado e 5 classificações justificadas.

**Sessão B (90 min)**
- Objetivo: acertar 13 de 15 questões de conjuntos numéricos do banco.
- Material: `04_exercicios/banco_exercicios.md`, bloco "Conjuntos numéricos" (Q001–Q015).
- Método: resolver cronometrado, corrigir só depois, separar erros em conceito, cálculo e leitura.
- Produto de aprendizagem: 15 respostas com 3 erros classificados e agendados no caderno.

**Sessão C (90 min)**
- Objetivo: explicar por que a raiz pode esconder um inteiro.
- Material: `07_primeiros_principios/genese_10_descobertas.md`, descoberta E, e o caderno de erros.
- Método: síntese Feynman de 2 minutos em voz alta, escrita depois com analogia própria.
- Produto de aprendizagem: parágrafo de 6 linhas com o exemplo √9 = 3 explicado a um colega imaginário.

### Semana 02 — Álgebra elementar

**Sessão A (90 min)**
- Objetivo: derivar (a + b)² sem copiar a identidade.
- Material: compêndio seções 03 e 04; gênese C; folha linhas 9–10.
- Método: rearranjar quatro triângulos de papel dentro de um quadrado e igualar as áreas dos dois arranjos.
- Produto de aprendizagem: desenho dos dois arranjos com a igualdade a² + 2ab + b² = a² + b² + 2ab escrita à mão.

**Sessão B (90 min)**
- Objetivo: fatorar 12 polinômios sem consultar.
- Material: banco, blocos "Produtos notáveis" e "Fatoração" (30 questões).
- Método: intercalar os dois tipos em ordem sorteada; antes de calcular, escrever qual padrão será usado.
- Produto de aprendizagem: 30 resoluções, das quais 24 corretas, com o padrão anotado antes de cada conta.

**Sessão C (90 min)**
- Objetivo: ligar fatoração a MDC e a primos.
- Material: gênese E; resumos `02_resumos_por_livro/O_Algebrista/cap01.md`.
- Método: explicar o algoritmo de Euclides com restos sucessivos e inventar um exemplo novo.
- Produto de aprendizagem: texto de 8 linhas com MDC(48, 18) resolvido por restos.

### Semana 03 — Equações e funções

**Sessão A (90 min)**
- Objetivo: reconstruir a fórmula de Bháskara completando o quadrado.
- Material: compêndio seções 05 e 06; folha linhas 11–12; gênese F.
- Método: começar de ax² + bx + c = 0, dividir por a, completar o quadrado e só então nomear o discriminante.
- Produto de aprendizagem: derivação em 7 linhas com Δ = b² − 4ac escrita no fim, não no começo.

**Sessão B (90 min)**
- Objetivo: distinguir função de relação que devolve dois valores.
- Material: banco, blocos "Equações" e "Funções" (30 questões); simulado 01, questões 5 e 6.
- Método: para cada questão, escrever domínio e imagem antes de responder; testar a inverse compondo f(f⁻¹(x)).
- Produto de aprendizagem: mapa de 6 funções com domínio, imagem e inversa preenchidos.

**Sessão C (90 min)**
- Objetivo: ensinar composição com ordem invertida.
- Material: folha linha 12; caderno de erros da semana.
- Método: criar f e g simples, calcular (f∘g)(x) e (g∘f)(x), mostrar que diferem.
- Produto de aprendizagem: contraexemplo com dois resultados distintos, escrito em 5 linhas.

### Semana 04 — Logaritmos e trigonometria — marco

**Sessão A (90 min)**
- Objetivo: traduzir produto em soma de expoentes.
- Material: compêndio seções 07 e 08; folha linhas 13–14; gênese H.
- Método: reconstruir a ideia de Napier a partir de uma tabela de potências de 2, depois escrever log_b(M·N) = log_b(M) + log_b(N).
- Produto de aprendizagem: tabela de 6 linhas ligando potências, produtos e somas de logaritmos.

**Sessão B (90 min)**
- Objetivo: estabilizar os ângulos notáveis sem calculadora.
- Material: folha "Ângulos notáveis"; banco, blocos "Logaritmos" e "Trigonometria"; simulado 01, questões 7 e 8.
- Método: desenhar o círculo unitário e preencher seno, cosseno e tangente de 0°, 30°, 45°, 60° e 90° antes de conferir.
- Produto de aprendizagem: círculo unitário anotado, com √2/2 e √3/2 posicionados corretamente.

**Sessão C (90 min)**
- Objetivo: passar no marco 1 com evidência.
- Material: banco inteiro; simulado 01; cronômetro.
- Método: sortear 20 questões, resolver em 50 minutos sem consulta, corrigir com gabarito comentado.
- Produto de aprendizagem: registro do marco com acertos, erros por categoria e decisão de avanço.

### Semana 05 — Sequências e matrizes

**Sessão A (90 min)**
- Objetivo: diferenciar n de n−1 no termo geral.
- Material: compêndio seções 09 e 10; folha linhas 15–16.
- Método: escrever a PA e a PG lado a lado, calcular a₈ nas duas e verificar pela soma dos termos.
- Produto de aprendizagem: tabela comparativa com aₙ = a₁ + (n−1)r e aₙ = a₁·qⁿ⁻¹.

**Sessão B (90 min)**
- Objetivo: calcular determinantes sem multiplicar elemento por elemento.
- Material: banco, blocos "Sequências" e "Matrizes"; simulado 02, questões sobre matriz.
- Método: resolver 8 determinantes 2×2 e 4 produtos, conferindo det(AB) = det(A)·det(B).
- Produto de aprendizagem: 12 contas com a propriedade do determinante verificada em cada uma.

**Sessão C (90 min)**
- Objetivo: explicar por que (AB)ᵀ = BᵀAᵀ inverte a ordem.
- Material: folha linha 16; caderno de erros.
- Método: transpor um produto de matrizes 2×2 num exemplo numérico e comparar com a transposição separada.
- Produto de aprendizagem: parágrafo com o exemplo numérico e a regra escrita em palavras.

### Semana 06 — Geometria plana e analítica

**Sessão A (90 min)**
- Objetivo: reconstruir Pitágoras por rearranjo e a soma dos 180°.
- Material: compêndio seções 11 e 12; gênese A, B e C; folha linhas 17–18.
- Método: recortar cantos de papel para os 180° e rearranjar triângulos para c² = a² + b².
- Produto de aprendizagem: dois desenhos com a explicação em linguagem simples, sem símbolos até a última linha.

**Sessão B (90 min)**
- Objetivo: resolver distância e inclinação sem trocar as coordenadas.
- Material: banco, blocos "Geometria plana" e "Geometria analítica"; simulado 02, questão do ponto médio.
- Método: marcar os pontos no papel antes de aplicar d = √((x₂−x₁)² + (y₂−y₁)²).
- Produto de aprendizagem: 10 cálculos com o desenho prévio anexado.

**Sessão C (90 min)**
- Objetivo: conectar Pitágoras à distância entre pontos.
- Material: compêndio seções 11 e 12; gênese C.
- Método: mostrar que a fórmula da distância é Pitágoras com as diferenças de coordenadas como catetos.
- Produto de aprendizagem: esquema com o triângulo invisível desenhado entre dois pontos.

### Semana 07 — Geometria espacial e combinatória

**Sessão A (90 min)**
- Objetivo: separar volume de área superficial na esfera.
- Material: compêndio seções 13 e 14; folha linhas 19–20.
- Método: escrever V = (4/3)πr³ e S = 4πr² lado a lado, trocar r por 3 em ambos e comparar unidades.
- Produto de aprendizagem: 6 cálculos com unidade explícita (cm³ ou cm²).

**Sessão B (90 min)**
- Objetivo: decidir entre arranjo e combinação antes de calcular.
- Material: banco, blocos "Geometria espacial" e "Combinatória"; simulado 02.
- Método: para cada enunciado, respondar "a ordem importa?" antes de escolher A(n,k) ou C(n,k).
- Produto de aprendizagem: 20 questões com a pergunta da ordem respondida por escrito.

**Sessão C (90 min)**
- Objetivo: ensinar C(n,k) = C(n,n−k) com uma história de cadeados.
- Material: folha linha 20; gênese J.
- Método: escolher 2 de 5 chaves e depois escolher as 3 que ficam de fora, mostrando que as contagens coincidem.
- Produto de aprendizagem: texto de 7 linhas com os dois cálculos numéricos.

### Semana 08 — Probabilidade e estatística — marco

**Sessão A (90 min)**
- Objetivo: verificar os axiomas antes de somar probabilidades.
- Material: compêndio seções 15 e 16; folha linhas 21–22.
- Método: calcular P(A∪B) = P(A) + P(B) − P(A∩B) em três exemplos e conferir se o resultado fica entre 0 e 1.
- Produto de aprendizagem: 6 verificações com o teste de intervalo escrito.

**Sessão B (90 min)**
- Objetivo: perceber quando a média esconde outliers.
- Material: banco, blocos "Probabilidade" e "Estatística"; simulado 02 completo.
- Método: montar dois conjuntos com a mesma média e variâncias diferentes; calcular x̄ = (∑xᵢ)/n à mão.
- Produto de aprendizagem: tabela com os dois conjuntos e a conclusão sobre a média.

**Sessão C (90 min)**
- Objetivo: passar no marco 2.
- Material: banco; simulado 02; cronômetro.
- Método: sortear 20 questões em 50 minutos, sem consulta, e corrigir pelo gabarito.
- Produto de aprendizagem: registro do marco 2 com percentual e lista de temas a reforçar na semana 09.

### Semana 09 — Finanças e limites

**Sessão A (90 min)**
- Objetivo: distinguir juros simples de compostos em prazo longo.
- Material: compêndio seções 17 e 18; folha linhas 23–24; gênese G.
- Método: aplicar M = P(1 + it) e M = P(1+i)ⁿ a P = 1000, i = 0,05 e n = 20, comparar os resultados.
- Produto de aprendizagem: gráfico de barras desenhado à mão com os dois montantes.

**Sessão B (90 min)**
- Objetivo: destravar 0/0 por fatoração.
- Material: banco, blocos "Limites" e "Matemática financeira"; simulado 03.
- Método: para cada limite, tentar substituição, registrar 0/0 e só então fatorar ou racionalizar.
- Produto de aprendizagem: 10 limites com o motivo da técnica escrito antes da conta.

**Sessão C (90 min)**
- Objetivo: explicar limite como fatia cada vez mais fina.
- Material: gênese G; caderno de erros.
- Método: contar a história da velocidade instantânea sem usar a palavra "derivada" até o final.
- Produto de aprendizagem: parágrafo de 8 linhas com a analogia do elevador.

### Semana 10 — Derivadas e integrais

**Sessão A (90 min)**
- Objetivo: derivar regra do produto e do quociente.
- Material: compêndio seções 19 e 20; folha linhas 25–26.
- Método: começar da definição por incremento, aplicar a (fg)′ = f′g + fg′, depois deduzir o quociente.
- Produto de aprendizagem: as duas regras escritas com um exemplo numérico cada.

**Sessão B (90 min)**
- Objetivo: não esquecer o diferencial dx.
- Material: banco, blocos "Derivadas" e "Integrais"; simulado 03.
- Método: resolver 20 questões intercaladas; antes de cada integral, escrever F′ = f ao lado.
- Produto de aprendizagem: 20 resoluções com ∫ₐᵇ f(x)dx = F(b) − F(a) aplicada explicitamente.

**Sessão C (90 min)**
- Objetivo: ligar derivada e integral pelo Teorema Fundamental.
- Material: gênese G; folha linha 26.
- Método: derivar F(x) = x³/3 e integrar 3x² de 0 a 2, comparando os resultados.
- Produto de aprendizagem: duas contas que terminam no mesmo número, com a seta ⇒ entre elas.

### Semana 11 — Código, redes e criptografia

**Sessão A (90 min)**
- Objetivo: executar os códigos de referência e prever a saída antes da execução.
- Material: `codigo/compilar_e_testar.py`; `codigo/referencia_01_senha_csprng.c`; `codigo/referencia_03_servidor_tcp.c`; `codigo/referencia_05_calculadora_cidr.py`.
- Método: ler o código, escrever a saída esperada no papel, compilar/executar e comparar.
- Produto de aprendizagem: três previsões com o resultado real anotado abaixo.

**Sessão B (90 min)**
- Objetivo: calcular entropia e entender por que rand() não serve.
- Material: `extras/arquitetura_criptografica.md` seções 1–3; gênese I e J.
- Método: calcular H = L × log₂(N) para L = 20 e N = 94, depois explicar a diferença entre PRNG e CSPRNG.
- Produto de aprendizagem: parágrafo com H ≈ 131,1 bits e a regra "saídas passadas não reconstróem futuras".

**Sessão C (90 min)**
- Objetivo: montar um mini-mapaa de rede com CIDR.
- Material: `codigo/referencia_05_calculadora_cidr.py`; `extras/arquitetura_criptografica.md` seção 5.
- Método: executar a calculadora para 192.168.1.0/24, anotar rede, broadcast e hosts utilizáveis.
- Produto de aprendizagem: esquema de rede com os três valores e uma frase sobre máscara.

### Semana 12 — Integração final — marco

**Sessão A (90 min)**
- Objetivo: reconstruir o índice dos 20 temas sem olhar o compêndio.
- Material: `03_matematica_consolidada/compendio_matematica.md` índice temático (linhas 8–30).
- Método: escrever os 20 nomes em ordem, conferir, circular os três que faltaram.
- Produto de aprendizagem: lista dos 20 temas com os três buracos preenchidos em cor diferente.

**Sessão B (90 min)**
- Objetivo: corrigir os três simulados em regime cronometrado.
- Material: `04_exercicios/simulados/simulado_01.md`, `simulado_02.md`, `simulado_03.md`.
- Método: 50 minutos por simulado, correção imediata pelo gabarito, classificação dos erros.
- Produto de aprendizagem: três planilhas de 20 linhas com acerto/erro e categoria.

**Sessão C (90 min)**
- Objetivo: fechar a matriz de domínio e consolidar o marco 3.
- Material: `06_plano_de_estudo/matriz_de_dominio.md`; `06_plano_de_estudo/calendario_de_revisoes.md`.
- Método: atualizar os 20 níveis com evidência, transferir os temas fracos para o calendário de revisões.
- Produto de aprendizagem: matriz com 18 temas em nível ≥ 3 e 5 cartões novos agendados.

## 5. Marcos e critérios de passagem

### Marco 1 — fim da semana 04

- Sortear 20 questões do `banco_exercicios.md` entre os temas 01 a 08.
- Tempo: 50 minutos, sem consulta.
- Passagem: ≥ 85% de acerto, isto é, pelo menos 17 de 20.
- Evidência: folha assinada com data, acertos por tema e os erros classificados.
- Se não passar: repetir a semana 04 com as sessões A e B trocadas — revisão primeiro — e novo sorteio em 7 dias. Não avançar o conteúdo novo da semana 05 até passar.

### Marco 2 — fim da semana 08

- Sortear 20 questões dos temas 01 a 16, com pelo menos 4 de probabilidade/estatística.
- Tempo: 50 minutos, sem consulta.
- Passagem: ≥ 85% de acerto e no máximo 2 erros classificados como "escolha errada de método".
- Evidência: simulado 02 corrigido mais a folha de sorteio.
- Se não passar: aplicar três dias de versão mínima (45 minutos: 10 questões + caderno de erros) e repetir o sorteio.

### Marco 3 — fim da semana 12

- Aplicar os três simulados de `04_exercicios/simulados/`, um por dia, 50 minutos cada.
- Passagem: nota ≥ 85% em cada simulado e ≥ 18 de 20 temas em nível 3 ou 4 na matriz de domínio.
- Evidência: três gabaritos preenchidos, matriz atualizada e uma síntese final de uma página com os 5 temas mais fracos.
- Se não passar: não reiniciar o plano do zero. Repetir apenas as semanas dos temas com nível ≤ 2 e manter as revisões espaçadas dos demais.

## 6. O que fazer quando atrasar

A regra é cortar conteúdo novo primeiro, nunca revisão. A sequência abaixo é aplicada nesta ordem, sem pular etapas.

1. Atraso de 1 dia: no dia seguinte, faça a sessão A normalmente e reduza a sessão B de 15 para 8 questões. Registre o motivo em uma linha, sem adjetivo.
2. Atraso de 2 dias: mantenha A e C; em B, resolva apenas 5 questões e leia os gabaritos das demais. Conteúdo novo da semana fica suspenso por um dia.
3. Atraso de 3 dias: cancele toda a sessão B da semana corrente; mantenha A e C com 90 minutos cheios. As questões não feitas voltam para a semana seguinte como "pendência", não como "prova atrasada".
4. Atraso de 4 dias ou mais: entre em regime de versão mínima por três dias — 45 minutos diários com 10 cartões e 3 questões. Depois, retome a grade A/B/C na semana seguinte, sem maratona de compensação.
5. Marco não atingido: adie o avanço de conteúdo, não a revisão. Refaça o sorteio 7 dias depois, com o mesmo critério de ≥ 85%.
6. Nunca compensar com 6 horas em um único dia. O ciclo atraso → culpa → excesso → exaustão é o modo mais rápido de perder a sequência.
7. Se o atraso vier acompanhado de sono ruim e evitação do caderno por mais de uma semana, mude o tamanho da tarefa e procure conversa com colega ou professor antes de aumentar a carga.

Para decidir o que cortar, use esta prioridade: revisão espaçada (sempre) > caderno de erros (sempre) > síntese Feynman (sempre) > questões novas (reduzível) > leitura de resumos (reduzível) > organização de arquivos (primeira a cortar).

## 7. Fechamento de semana

Todo sexta-feira, depois da sessão C, preencha seis linhas no caderno:

- horas cumpridas versus horas previstas (15 h);
- questões resolvidas sem consulta;
- acertos no total e por tema;
- erro dominante da semana (conceito, cálculo ou leitura);
- data da próxima revisação de cada tema novo;
- primeira ação escrita para a sessão A da semana seguinte.

Sem essas seis linhas, a semana não está fechada — mesmo que todas as questões tenham sido feitas.

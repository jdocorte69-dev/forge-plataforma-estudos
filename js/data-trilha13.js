/* ============================================================
   FORGE — data-trilha13.js
   Trilha 13: Cálculo Mental.
   6 módulos no padrão "Universo Narrado" (12 regras por aula).
   Dados estáticos, sem rede, sem dependências. Nenhum arquivo
   existente é alterado por este módulo.
   ============================================================ */

(function () {
  "use strict";

  window.FORGE_TRILHA13 = {
    id: "13",
    title: "Trilha 13 — Cálculo Mental",
    subtitle: "Memória treinável, aritmética da esquerda para a direita, produtos cruzados, quadrados, divisão e calendário na cabeça.",
    modules: [
      {
        id: "13.1",
        title: "Ciência da memória e o treino deliberado",
        objective: "Entender o que a pesquisa sobre memória de trabalho e prática de recuperação permite afirmar — e o que não permite — antes de treinar cálculo mental.",
        duration: "35 min",
        lesson: {
          kicker: "Trilha 13 · Módulo 1 · Aula 1",
          track: "Cálculo Mental",
          title: "Ciência da memória e o treino deliberado",
          hook: "Você leu uma lista de doze números três vezes e, meia hora depois, não consegue reconstruir nem a metade. Conclui que tem «memória ruim». Antes desse veredito, faça a pergunta certa: você passou o tempo relendo ou tentou lembrar sem olhar?\n\nA diferença entre essas duas atividades é o assunto desta aula. E ela decide se as próximas cinco aulas da trilha vão virar habilidade ou apenas entretenimento.",
          intuition: "Memória de trabalho é um balcão pequeno, não um armazém. Você consegue manusear poucos itens ao mesmo tempo, mas pode reagrupá-los: «1 4 9 2» são quatro pedaços; «1492» é um ano, um único pedaço. Recodificar pedaços é o chunking. O truque não aumenta o balcão: ele diminui o número de coisas que cabem nele.",
          limit: "Esta analogia é útil para entender carga mental, mas falha em Y porque Z: o balcão não tem tamanho fixo e universal. Miller (1956) descreveu o famoso 7 ± 2 em tarefas de span imediato; trabalhos posteriores, como os de Nelson Cowan, estimam cerca de 4 itens atendidos quando distrações e tarefas simultâneas são controladas. Além disso, chunking depende de conhecimento prévio: quem não sabe que 1492 é uma data não ganha o mesmo atalho.",
          layers: [
            "Camada 1: a memória de trabalho mantém e manipula poucos itens por um curto intervalo; ela não é um disco rígido.",
            "Camada 2: chunking recodifica vários itens em um bloco significativo, reduzindo o que precisa ser retido ao mesmo tempo.",
            "Camada 3: recuperar sem olhar (prática de recuperação, ou testing effect) fortalece mais a retenção do que reler passivamente.",
            "Camada 4: espalhar as recuperações em intervalos crescentes (repetição espaçada) produz retenção melhor do que massificar tudo no mesmo dia.",
            "Camada 5: sono favorável e prática deliberada — tarefa ligeiramente acima da competência atual, com feedback imediato — fecham o ciclo."
          ],
          ruleWhy: "Recuperar é um esforço produtivo: ao tentar lembrar sem pistas, você reconstrói a representação e corrige o que está fraco. Reler dá sensação de fluência, mas fluência não é retenção. A prática deliberada acrescenta o ingrediente que repetir sem critério não tem: um alvo específico, um limite logo além do que você já faz bem e uma resposta sobre o erro. A chamada regra das 10.000 horas, popularizada a partir de Ericsson, é uma simplificação de pesquisa observacional — não é um número mágico nem uma promessa de competência.",
          physical: "O que acontece no cérebro e no seu caderno:\n\n  estudar regra → tentar lembrar sem olhar → comparar com a resposta\n       ↑                                             ↓\n       └──────── dormir + rever no intervalo ← registrar o erro\n\nHipocampo e redes corticais participam da consolidação da memória declarativa; durante o sono, padrões de atividade são reativados e reorganizados. Nada disso é gravação perfeita: memória é reconstrutiva, sujeita a interferência e a viés. Por isso a checagem externa (resposta, colega, caderno de erros) não é detalhe burocrático — ela é parte do mecanismo.",
          example: "Exemplo concreto com o cálculo desta trilha:\n\n1. Hoje: leia 47 × 53 = (50 − 3)(50 + 3) = 2500 − 9 = 2491.\n2. Feche o papel. Escreva 2491 de memória. Se errar, anote exatamente onde errou.\n3. Amanhã: tente de novo antes de reler. Depois, 3 dias, 7 dias, 14 dias.\n4. No FORGE, cada avaliação alimenta um cartão SM-2 com intervalo, repetição, fator de facilidade (efator inicial 2.5) e próxima revisão; o radar mostra os cartões vencidos. A interface também descreve uma escada de 1, 3, 7, 14 e 30 dias — uma implementação simplificada, inspirada em SM-2, não uma reprodução literal do algoritmo original.\n5. Critério de prática deliberada: você não está treinando se já acerta 47 × 53 sem esforço. Troque para 48 × 52 ou para uma raiz aproximada.",
          traps: [
            "Reler cinco vezes e chamar isso de estudo: fluência na leitura não é capacidade de recuperação.",
            "Decorar um truque sem entender a regra que o sustenta: a transferência para números novos desaparece.",
            "Acreditar que técnicas de memorização demonstram inteligência geral: desempenho em uma tarefa treinada é específico daquela tarefa.",
            "Tratar sono como opcional ou converter «prática deliberada» em castigo: fadiga e ansiedade degradam a recuperação.",
            "Usar a citação de 7 ± 2 como capacidade fixa do cérebro, ignorando a ressalva moderna de cerca de 4 itens atendidos."
          ],
          realWorld: [
            "Escolas e cursos usam quizzes curtos e repetidos ao longo do semestre porque recuperar melhora a retenção.",
            "Pilotos e profissionais de saúde treinam em simuladores com feedback imediato — prática deliberada com consequências controladas.",
            "Aplicativos de cartões espaçados agendam revisões; o FORGE faz o mesmo com seu cartão SM-2 e seu caderno de erros."
          ],
          checks: [
            {
              q: "Qual rotina dá mais retenção para uma regra de cálculo mental?",
              options: [
                "Reler a regra cinco vezes seguidas no mesmo dia.",
                "Tentar lembrar sem olhar, checar a resposta e repetir em dias diferentes.",
                "Copiar a regra de forma bonita uma única vez eguardar o caderno."
              ],
              correct: 1,
              hints: [
                "Pense na diferença entre sentir fluência e conseguir lembrar.",
                "A recuperação ativa é o esforço que fortalece o traço de memória.",
                "Espaçar as tentativas adiciona dificuldade útil e reduz o esquecimento."
              ]
            },
            {
              q: "O que significa chunking na prática?",
              options: [
                "Aumentar fisicamente a capacidade da memória de trabalho.",
                "Agrupar varios algarismos em uma unidade significativa, como 1492.",
                "Decorar a mesma lista em ordem aleatória."
              ],
              correct: 1,
              hints: [
                "Não é o balcão que cresce: é o número de pedaços que diminui.",
                "O agrupamento depende de significado já conhecido.",
                "Quatro algarismos viram um ano: quatro itens viram um."
              ]
            },
            {
              q: "O que o FORGE registra em um cartão SM-2?",
              options: [
                "A cor da interface e o nome do tema.",
                "Intervalo, repetição, fator de facilidade e data da próxima revisão.",
                "Apenas a nota da última prova, sem histórico."
              ],
              correct: 1,
              hints: [
                "Abra o radar SM-2: ele mostra efator, intervalo e cartões vencidos.",
                "O estado interno do cartão tem quatro campos numéricos.",
                "São interval, repetition, efactor e next_review."
              ]
            }
          ],
          alternative: {
            intro: "Não entendi — explique de outro jeito: pense em treino de chute de gol.",
            text: "Você não melhora chutando com os olhos na bola o tempo todo. Melhora quando o goleiro esconde a bola, você chuta, ouve o resultado e ajusta. Estudar é o mesmo: esconder a resposta é o goleiro; checar o gabarito é o resultado; dormir e voltar amanhã é o próximo treino.Chunking é mudar o tamanho da bola: um bloco conhecido é mais fácil de segurar do que quatro pedaços soltos.",
            diagram: "esconder resposta → chutar (lembrar) → ouvir o resultado → ajustar → voltar amanhã"
          },
          feynman: {
            prompt: "Explique com suas próprias palavras por que tentar lembrar sem olhar funciona melhor do que reler, e onde o sono entra nesse processo.",
            minChars: 30,
            keywords: ["recuperação", "espaçamento", "chunking", "sono"]
          },
          summary: [
            "Memória de trabalho lida com poucos itens; chunking reduz a carga ao recodificar informação.",
            "Recuperação ativa, espaçamento, feedback e sono fazem mais pela retenção do que releitura passiva.",
            "O FORGE aplica esse princípio no cartão SM-2 e no caderno de erros; prática deliberada exige dificuldade e honestidade."
          ],
          connection: "Próximo módulo → 13.2: com menos carga na memória, você pode somar e subtrair da esquerda para a direita sem perder o vai-um."
        },
        exercises: [
          { q: "Por que «1492» exige menos memória de trabalho do que «1 4 9 2»?", options: ["Porque os algarismos mudam de valor.", "Porque quatro algarismos viram um bloco significativo, um chunk.", "Porque a memória de trabalho ignora números grandes."], answer: 1, explanation: "O chunking recodifica quatro itens em um; o limite de itens atendidos não muda, mas a quantidade de pedaços cai." },
          { q: "Qual afirmação sobre o limite de 7 ± 2 é mais correta?", options: ["É a capacidade exata e fixa da memória humana.", "Vem de Miller (1956) e deve ser lida com a ressalva de estimativas modernas próximas de 4 itens atendidos.", "Foi refutada e hoje ninguém a menciona."], answer: 1, explanation: "Miller descreveu span imediato com técnica específica; pesquisas posteriores refinam o número para cerca de 4 itens quando se controla atenção e distração." },
          { q: "Você acerta 47 × 53 sem esforço. O que caracteriza prática deliberada agora?", options: ["Repetir 47 × 53 mais cinquenta vezes.", "Escolher uma conta ligeiramente mais difícil, com erro registrado e feedback.", "Ler a explicação novamente."], answer: 1, explanation: "Prática deliberada exige alvo logo além da competência atual e informação sobre o erro; repetir o que já é automático não produz o mesmo ganho." },
          { q: "Em que situação um mnemônico é honestamente apresentado?", options: ["Quando promete aumentar a inteligência geral.", "Quando é descrito como estratégia específica para lembrar certa sequência, com limites declarados.", "Quando dispensa compreensão da regra."], answer: 1, explanation: "Técnicas mnêmicas são ferramentas de tarefa específica; atribuir a elas ganho geral de inteligência é extrapolação sem evidência." },
          { q: "Qual campo NÃO faz parte do cartão SM-2 citado no FORGE?", options: ["efactor", "next_review", "título da trilha"], answer: 2, explanation: "O cartão guarda interval, repetition, efactor e next_review; o título da trilha é metadado de conteúdo, não estado de revisão." },
          { q: "Por que dormir depois de estudar ajuda?", options: ["Porque o cérebro desliga e não consome energia.", "Porque a consolidação reordena traços de memória, embora não seja gravação perfeita.", "Porque apaga todos os erros automaticamente."], answer: 1, explanation: "A consolidação com sono reorganiza memórias; erros não desaparecem sozinhos — precisam ser checados e corrigidos." }
        ],
        keywords: ["memória de trabalho", "chunking", "Miller", "Cowan", "prática de recuperação", "repetição espaçada", "prática deliberada", "consolidação", "SM-2"]
      },

      {
        id: "13.2",
        title: "Soma e subtração da esquerda para a direita (L→R)",
        objective: "Calcular somas e subtrações mentalmente começando pela casa mais alta, controlando o vai-um e usando complementos para arredondar.",
        duration: "40 min",
        lesson: {
          kicker: "Trilha 13 · Módulo 2 · Aula 2",
          track: "Cálculo Mental",
          title: "Soma e subtração da esquerda para a direita (L→R)",
          hook: "Alguém diz depressa: «soma 8.376 e 1.495». Você começa pelas unidades, faz 6 + 5, guarda o vai-um, vai para as dezenas... e percebe que já esqueceu se o vai-um era 1 ou 2. No papel o método tradicional funciona; na cabeça ele guarda informação demais antes de entregar qualquer resultado.",
          intuition: "Comece pelo que tem mais peso: milhares, depois centenas, dezenas, unidades. A cada passo você já tem uma resposta parcial que faz sentido — «está perto de 9.800» — e só precisa acrescentar o próximo pedaço. É como construir uma parede da esquerda para a direita: você vê a forma antes de acertar o último tijolo.",
          limit: "Esta analogia é útil para entender carga mental, mas falha em Y porque Z: a ordem não muda o resultado. Soma é associativa e comutativa; L→R não é uma aritmética nova, é uma estratégia de baixo custo para memória de trabalho. Com números muito longos ou cadeias de vai-uns, anotar ainda é mais seguro — e honesto.",
          layers: [
            "Camada 1: decomponga cada parcela por valor posicional: 467 = 400 + 60 + 7.",
            "Camada 2: some as casas da esquerda para a direita, mantendo um total corrente.",
            "Camada 3: o «vai-um» é acrescentado à próxima casa à esquerda, não descartado.",
            "Camada 4: para subtrair, ou subtraia em pedaços (523 − 200 + 13) ou complemente até uma referência redonda (1000 − 467).",
            "Camada 5: estime antes e confira depois; uma estimativa é detector de erro barato."
          ],
          ruleWhy: "No papel, o algoritmo tradicional mantém cada casa alinhada e você pode olhar de novo. Na cabeça, cada vai-um pendente ocupa um dos poucos espaços da memória de trabalho. L→R libera esse espaço porque produz uma saída a cada passo: o total parcial. Na subtração por complemento, você troca uma subtração complicada por uma soma até uma referência conhecida, que é mais fácil de verificar.",
          physical: "Soma L→R de 467 + 328:\n\n  milhares/centenas: 400 + 300 = 700   → total 700\n  dezenas:            60 +  20 =  80   → total 780\n  unidades:            7 +   8 =  15   → total 795\n\n  8376 + 1495:\n  8000 + 1000 = 9000\n   300 +  400 =  700 → 9700\n    70 +   90 =  160 → 9860\n     6 +    5 =   11 → 9871\n\nComplementos:\n  1000 − 467 = (999 − 467) + 1 = 532 + 1 = 533\n  4000 − 1738 = (3999 − 1738) + 1 = 2261 + 1 = 2262\n\nO «+1» aparece porque 999 (ou 3999) é um a menos que a referência redonda.",
          example: "Exemplo de subtração em pedaços: 523 − 187.\n\nArredonde 187 para 200: 523 − 200 = 323. Você subtraiu 13 a mais do que devia, então devolve 13: 323 + 13 = 336.\n\nConferência L→R: 336 + 187 = 336 + 100 + 80 + 7 = 436 + 80 + 7 = 516 + 7 = 523. Confere.\n\nExemplo com complemento: 4000 − 1738. Pense 3999 − 1738 = 2261 e some 1: 2262. Conferência: 2262 + 1738 = 4000.",
          traps: [
            "Esquecer o vai-um: ao somar 70 + 90 = 160, os 100 já entraram no total 9860.",
            "Arredondar e não corrigir: 523 − 200 sem devolver os 13 dá 323, que está errado.",
            "Esquecer o +1 no complemento: 999 − 467 = 532, mas 1000 − 467 = 533.",
            "Achar que L→R só serve para contas pequenas: a estratégia escala, mas exige prática e conferência.",
            "Pular a estimativa: sem «deve dar perto de 9.800», um erro de casa fica invisível."
          ],
          realWorld: [
            "No supermercado, somar preços aproximados da esquerda para a direita avisa se o total da máquina está plausível.",
            "Para dar troco, complementar até 100 ou 1000 é mais rápido do que subtrair com empréstimos.",
            "Conferir uma fatura: some os valores grandes primeiro e depois os centavos, comparando com o total impresso."
          ],
          checks: [
            {
              q: "Qual é o resultado de 467 + 328 pela estratégia L→R?",
              options: ["785", "795", "805"],
              correct: 1,
              hints: [
                "Comece por 400 + 300.",
                "Some 60 + 20 ao total parcial e depois 7 + 8.",
                "700 + 80 + 15 = 795."
              ]
            },
            {
              q: "Quanto é 1000 − 467 usando complemento?",
              options: ["533", "532", "543"],
              correct: 0,
              hints: [
                "Calcule 999 − 467 primeiro.",
                "999 − 467 = 532; depois some 1 porque 1000 é um a mais.",
                "O resultado é 533."
              ]
            },
            {
              q: "Por que L→R reduz a carga mental em relação ao algoritmo da direita para a esquerda?",
              options: [
                "Porque muda a associatividade da soma.",
                "Porque entrega um total parcial a cada passo, em vez de guardar vais-uns pendentes.",
                "Porque elimina a necessidade de estimar."
              ],
              correct: 1,
              hints: [
                "O resultado é o mesmo; o que muda é o caminho.",
                "Cada passo produz uma saída útil: 700, 780, 795.",
                "Menos informação pendente cabe melhor na memória de trabalho."
              ]
            }
          ],
          alternative: {
            intro: "Não entendi — explique de outro jeito: pense em ler um número como se lê uma frase.",
            text: "Você lê «8376» começando pelo 8, não pelo 6. Somar da esquerda para a direita é o mesmo: você diz a parte importante primeiro — 8000 + 1000 = 9000 — e depois acrescenta os detalhes. O vai-um é como uma palavra que você repete em voz baixa até encaixá-la na próxima parte da frase. Na subtração, complementar é perguntar «quanto falta para chegar ao número redondo?».",
            diagram: "8376 + 1495 → 9000 → 9700 → 9860 → 9871 (casa por casa, da esquerda)"
          },
          feynman: {
            prompt: "Explique com suas próprias palavras como somar dois números de quatro algarismos da esquerda para a direita e como usar complemento para subtrair de 1000.",
            minChars: 30,
            keywords: ["esquerda", "parcial", "vai-um", "complemento"]
          },
          summary: [
            "Somar da esquerda para a direita produz um total parcial a cada casa e reduz o que precisa ficar na cabeça.",
            "O vai-um entra na próxima casa; na subtração, arredondar exige devolver a diferença ou somar 1 ao complemento.",
            "Estime antes e confira depois: a ordem muda o custo mental, não o resultado."
          ],
          connection: "Próximo módulo → 13.3: a mesma economia de memória aparece na multiplicação cruzada e nas regras de Trachtenberg."
        },
        exercises: [
          { q: "Quanto é 8376 + 1495?", options: ["9771", "9871", "9971"], answer: 1, explanation: "9000 + 700 = 9700; +160 = 9860; +11 = 9871." },
          { q: "Calcule 523 − 187 arredondando 187 para 200.", options: ["336", "323", "349"], answer: 0, explanation: "523 − 200 = 323; como subtraiu 13 a mais, some 13: 336." },
          { q: "Quanto é 4000 − 1738 pelo método do complemento?", options: ["2261", "2262", "2362"], answer: 1, explanation: "3999 − 1738 = 2261 e mais 1 dá 2262." },
          { q: "Em 467 + 328, o que representa o 15 da última etapa?", options: ["O vai-um das centenas.", "60 + 20.", "7 + 8, que se soma ao total 780 para chegar a 795."], answer: 2, explanation: "As unidades 7 + 8 = 15 são acrescentadas ao total parcial 780." },
          { q: "Por que estimar antes de somar?", options: ["Porque substitui o cálculo.", "Porque cria uma referência que delata erro de casa ou de vai-um.", "Porque a soma L→R não tem conferência."], answer: 1, explanation: "A estimativa é uma checagem barata: 8376 + 1495 deve ficar perto de 9800." },
          { q: "Qual afirmação é falsa sobre L→R?", options: ["O resultado final é o mesmo da direita para a esquerda.", "A ordem da soma é alterada pela associatividade.", "O método reduz informação pendente na memória de trabalho."], answer: 1, explanation: "A associatividade permite a estratégia; ela não é alterada por ela. O que muda é a carga mental." }
        ],
        keywords: ["esquerda para a direita", "somas parciais", "vai-um", "valor posicional", "complemento", "arredondamento", "estimativa"]
      },

      {
        id: "13.3",
        title: "Multiplicação cruzada: Benjamin e Trachtenberg",
        objective: "Multiplicar mentalmente com produtos cruzados e com as regras digitais de Trachtenberg, atribuindo cada método corretamente.",
        duration: "50 min",
        lesson: {
          kicker: "Trilha 13 · Módulo 3 · Aula 3",
          track: "Cálculo Mental",
          title: "Multiplicação cruzada: Benjamin e Trachtenberg",
          hook: "Você ouve «23 × 14» e começa a desenhar a multiplicação armada na cabeça: 23 × 4, 23 × 10, Some. Dois produtos, um alinhamento e um vai-um para guardar. Existe um caminho mais curto: unidades, cruz, dezenas — três passos, cada um com uma só saída.",
          intuition: "O produto cruzado é o mesmo algoritmo armado, lido de trás para frente: primeiro as unidades, depois a soma dos «x» (dezena de um vezes unidade do outro, e vice-versa), depois as dezenas. Regras digitais como as de Trachtenberg fazem o mesmo com um único multiplicador: cada algarismo da resposta sai de uma receita local usando o algarismo atual, o vizinho da direita e um eventual vai-um.",
          limit: "Esta analogia é útil para entender o mecanismo, mas falha em Y porque Z: as receitas digitais não eliminam a álgebra por trás delas — são atalhos que dependem de posição decimal e de carries. Velocidade extrema em demonstrações não é evidência de que qualquer pessoa alcançará o mesmo desempenho sem treino longo e estruturado. Aqui não se atribuem números de página a nenhum livro: a atribuição é por obra e método.",
          layers: [
            "Camada 1: produto cruzado para 2 dígitos × 2 dígitos: unidades, soma cruzada, dezenas, com vai-um entre etapas.",
            "Camada 2: fatoração e dobro/meia: 48 × 25 = 12 × 100; 16 × 35 = 8 × 70 = 560.",
            "Camada 3: regra do ×11 de Trachtenberg: copie o último algarismo, some cada algarismo ao vizinho da direita, mantenha o primeiro.",
            "Camada 4: regra do ×5: metade do vizinho, mais 5 se o algarismo atual for ímpar; despreze frações.",
            "Camada 5: as demais regras (×2 a ×12) combinam dobro, complemento até 9 ou 10, metade e vizinho."
          ],
          ruleWhy: "Cada atalho é uma identidade disfarçada. O cruzamento funciona porque (10a + b)(10c + d) = 100ac + 10(ad + bc) + bd. A regra do ×11 funciona porque 11 = 10 + 1: cada algarismo contribui consigo mesmo e com o vizinho. A regra do ×5 funciona porque 5 = 10/2: deslocar uma casa e dividir por 2 gera a metade do vizinho mais a correção de 5 para algarismos ímpares. Entender a identidade permite reconstruir a regra quando a memória falha.",
          physical: "23 × 14 pelo cruzado:\n\n  unidades:  3 × 4 = 12            → escreva 2, vai 1\n  cruz:      2 × 4 + 3 × 1 = 11    → 11 + 1 = 12, escreva 2, vai 1\n  dezenas:   2 × 1 = 2             → 2 + 1 = 3\n  resultado: 322\n\n4127 × 11 pela regra de Trachtenberg (vizinho = algarismo à direita):\n\n  copie 7                     → 7\n  2 + 7 = 9                   → 97\n  1 + 2 = 3                   → 397\n  4 + 1 = 5                   → 5397\n  mantém-se o 4 inicial       → 45397\n  conferência: 4127 × 10 + 4127 = 41270 + 4127 = 45397\n\n4137 × 5 pela regra do ×5 (metade inteira do vizinho; +5 se ímpar):\n\n  algarismo 7: sem vizinho, 7 é ímpar → 5, vai 0   → 5\n  algarismo 3: metade de 7 é 3; 3 ímpar → 3 + 5 = 8 → 85\n  algarismo 1: metade de 3 é 1; 1 ímpar → 1 + 5 = 6 → 685\n  algarismo 4: metade de 1 é 0; 4 par    → 0        → 0685\n  zero à frente: metade de 4 é 2        → 20685\n  conferência: 4137 × 5 = 20685",
          example: "Resumo das regras básicas do sistema Trachtenberg (o «número» é o algarismo sobre a posição que está sendo calculada; o «vizinho» é o algarismo imediatamente à direita; «metade» significa descartar a fração; carries são somados na etapa seguinte):\n\n  ×1: copie o número.\n  ×2: dobre cada algarismo, sem usar o vizinho.\n  ×3: 1º = (10 − algarismo) × 2, +5 se ímpar; meio = (9 − algarismo) × 2 + 5 se ímpar + metade do vizinho; último = metade do algarismo da esquerda − 2.\n  ×4: 1º = 10 − algarismo, +5 se ímpar; meio = 9 − algarismo + metade do vizinho, +5 se ímpar; último = metade do algarismo da esquerda − 1.\n  ×5: metade do vizinho, +5 se o algarismo for ímpar.\n  ×6: algarismo + 5 se ímpar + metade do vizinho.\n  ×7: dobre o algarismo, +5 se ímpar, + metade do vizinho.\n  ×8: 1º = (10 − algarismo) × 2; meio = (9 − algarismo) × 2 + vizinho; último = algarismo da esquerda − 2.\n  ×9: 1º = 10 − algarismo; meio = 9 − algarismo + vizinho; último = algarismo da esquerda − 1.\n  ×10: acrescente um zero (consequência posicional).\n  ×11: some o vizinho ao algarismo.\n  ×12: dobre o algarismo e some o vizinho.\n\nExemplo adicional de fatoração (método de decomposição popularizado por Benjamin): 48 × 25 = 48 × 100 / 4 = 4800 / 4 = 1200. Ou 24 × 15 = 12 × 30 = 360.",
          traps: [
            "Esquecer o vai-um no produto cruzado: em 23 × 14 ele aparece duas vezes.",
            "Aplicar a regra do ×11 sem o algarismo inicial: 4127 × 11 não é 5397, é 45397.",
            "Usar metade exata de algarismo ímpar no ×5: a regra descarta a fração e compensa com o +5.",
            "Atribuir todas as regras a Benjamin: as regras digitais listadas pertencem ao sistema de Trachtenberg; Benjamin é associado à decomposição e a métodos de cálculo e memorização divulgados em Secrets of Mental Math (2006), escrito com Michael Shermer.",
            "Tratar o sistema de Trachtenberg como mágica sem base: ele foi desenvolvido por Jakow Trachtenberg e divulgado em livro traduzido e adaptado por Ann Cutler e Rudolph McShane (1960)."
          ],
          realWorld: [
            "Conferir rapidamente o valor de um pedido: 23 itens a 14 reais cada dá 322 reais.",
            "Calcular descontos e proporções com dobro/meia: metade de 25% e dobra de quantidades.",
            "Verificar uma conta feita por calculadora usando ×11 ou ×9 como checagem independente."
          ],
          checks: [
            {
              q: "Qual é o resultado de 23 × 14 pelo método cruzado?",
              options: ["312", "322", "332"],
              correct: 1,
              hints: [
                "3 × 4 = 12: escreva 2 e vai 1.",
                "A soma cruzada é 2 × 4 + 3 × 1 = 11; com o vai 1, dá 12.",
                "As dezenas: 2 × 1 + 1 = 3. Resultado 322."
              ]
            },
            {
              q: "Pela regra de Trachtenberg, quanto é 4127 × 11?",
              options: ["45397", "5397", "45407"],
              correct: 0,
              hints: [
                "Copie o 7 e some cada algarismo ao vizinho da direita.",
                "7; 2+7=9; 1+2=3; 4+1=5; mantém-se o 4 inicial.",
                "Confira: 41270 + 4127 = 45397."
              ]
            },
            {
              q: "O que a regra do ×5 de Trachtenberg exige para um algarismo ímpar?",
              options: ["Ignorar o algarismo atual.", "Somar 5 à metade inteira do vizinho.", "Multiplicar o vizinho por 10."],
              correct: 1,
              hints: [
                "A regra usa o vizinho da direita, não o algarismo atual sozinho.",
                "Metade de ímpar descarta a fração; o +5 corrige a paridade.",
                "Em 4137 × 5, o algarismo 3 ímpar gera 3 + 5 = 8."
              ]
            }
          ],
          alternative: {
            intro: "Não entendi — explique de outro jeito: pense no cruzado como um elevador de dois andares.",
            text: "No andar das unidades, 3 × 4 dá 12: você deixa o 2 no andar e manda o 1 subir. No corredor cruzado, 2 × 4 e 3 × 1 se encontram: soma 11, mais o 1 que subiu, dá 12 — deixa 2 e manda 1 subir de novo. No andar de cima, 2 × 1 mais o visitante dá 3. A regra do ×11 é o mesmo elevador sem tabuleiro: cada algarismo conversa com o vizinho da direita, e o primeiro fica no topo.",
            diagram: "unidades → cruz (dois produtos) → dezenas | ×11: copiar → somar vizinho → manter o primeiro"
          },
          feynman: {
            prompt: "Explique com suas próprias palavras por que o produto cruzado funciona e como as regras do ×11 e do ×5 de Trachtenberg reduzem a memória necessária.",
            minChars: 30,
            keywords: ["cruzado", "vizinho", "vai-um", "Trachtenberg"]
          },
          summary: [
            "O produto cruzado lê o algoritmo armado de trás para frente: unidades, cruz, dezenas.",
            "As regras de Trachtenberg usam algarismo, vizinho da direita e metade inteira, com carries curtos.",
            "Atribuição honesta: regras digitais a Trachtenberg (1960); decomposição e conferências a Benjamin (2006)."
          ],
          connection: "Próximo módulo → 13.4: o mesmo crossed thinking aparece em (a+b)(a−b) e nas identidades para elevar ao quadrado."
        },
        exercises: [
          { q: "Quanto é 312 × 21 pelo cruzado?", options: ["6252", "6552", "6652"], answer: 1, explanation: "2×1=2; 1×1+2×2=5; 3×1+1×2=5; 3×2=6 → 6552." },
          { q: "Calcule 633 × 11 pela regra de Trachtenberg.", options: ["6963", "6936", "6993"], answer: 0, explanation: "3; 3+3=6; 6+3=9; mantém 6 → 6963." },
          { q: "Quanto é 426 × 5 pela regra do ×5?", options: ["2130", "2120", "2140"], answer: 0, explanation: "Metade do vizinho: 6→0; 2 com metade de 6 → 30; 4 com metade de 2 → 130; zero com metade de 4 → 2130." },
          { q: "Qual identidade justifica o produto cruzado?", options: ["(10a+b)(10c+d) = 100ac + 10(ad+bc) + bd", "a² − b² = (a−b)(a+b)", "a + b = b + a"], answer: 0, explanation: "Expandindo a multiplicação por valor posicional obtêm-se exatamente as três etapas do cruzado." },
          { q: "Quanto é 48 × 25 usando fatoração?", options: ["1200", "1250", "1100"], answer: 0, explanation: "48 × 25 = 48 × 100 / 4 = 4800 / 4 = 1200." },
          { q: "Quem desenvolveu o sistema de regras digitais citado nesta aula?", options: ["Arthur Benjamin, em 2006.", "Jakow Trachtenberg, divulgado em 1960 com tradução de Ann Cutler e Rudolph McShane.", "Nelson Cowan, em 2001."], answer: 1, explanation: "As regras digitais são de Trachtenberg; Benjamin popularizou decomposição e técnicas em Secrets of Mental Math (2006)." }
        ],
        keywords: ["produto cruzado", "Trachtenberg", "Benjamin", "regra do 11", "regra do 5", "vizinho", "dobro e meia", "fatoração"]
      },

      {
        id: "13.4",
        title: "Quadrados, diferença de quadrados e raízes",
        objective: "Elevar ao quadrado com referências próximas, fatorar produtos pela diferença de quadrados e aproximar raízes com uma ou duas iterações de Newton, com limite de erro.",
        duration: "45 min",
        lesson: {
          kicker: "Trilha 13 · Módulo 4 · Aula 4",
          track: "Cálculo Mental",
          title: "Quadrados, diferença de quadrados e raízes",
          hook: "Alguém pede 47² e 47 × 53 em sequência. Você começa a multiplicar 47 por 47 algarismo a algarismo e sente a memória encher. Os dois problemas têm a mesma referência escondida: 50. Reconhecê-la transforma duas contas longas em duas subtrações curtas.",
          intuition: "Números próximos de uma referência redonda são como pontos perto de uma âncora: o quadrado de 50 ± d é 2500 ± 100d + d². E 47 × 53 é (50 − 3)(50 + 3) = 50² − 3². Para raiz, você não precisa de um algoritmo longo: um palpite razoável mais a correção de Newton costuma bastar.",
          limit: "Esta analogia é útil para escolher a referência, mas falha em Y porque Z: a fórmula não adivinha qual referência é conveniente — você precisa reconhecer 50, 100 ou 1000 por julgamento. Newton também não é infinito na cabeça: cada iteração melhora muito, mas a aproximação ainda precisa de uma checagem por quadrado ou por intervalo. A taxa de erro mencionada abaixo vale quando o palpite já é maior que a raiz.",
          layers: [
            "Camada 1: (a + b)² = a² + 2ab + b² e (a − b)² = a² − 2ab + b².",
            "Camada 2: diferença de quadrados: (a − b)(a + b) = a² − b².",
            "Camada 3: quadrados perto de 50, 100 e 1000: 47², 103², 996².",
            "Camada 4: raiz por Newton/Babilônia: x(n+1) = (x(n) + S/x(n))/2, ou x(n) + (S − x(n)²)/(2x(n)).",
            "Camada 5: limite de erro: para x(n) ≥ √S, o novo erro é e(n)²/(2x(n)), menor que e(n)²/(2√S); a convergência é quadrática."
          ],
          ruleWhy: "As identidades não são truques arbitrários: vêm da distributividade. Escolher uma referência próxima minimiza o termo 2ab e mantém d² pequeno, que é fácil de calcular. Newton funciona porque a reta tangente à parábola y = x² − S em x(n) cruza o eixo em uma estimativa melhor; por isso o erro é proporcional ao quadrado do erro anterior quando se está perto.",
          physical: "47² = (50 − 3)² = 2500 − 300 + 9 = 2209.\n\n103² = (100 + 3)² = 10000 + 600 + 9 = 10609.\n\n996² = (1000 − 4)² = 1000000 − 8000 + 16 = 992016.\n\n47 × 53 = (50 − 3)(50 + 3) = 2500 − 9 = 2491.\n\nRaiz de 50 pelo método de Newton (palpite acima da raiz, para usar o limite de erro):\n\nComo 7² = 49 e 8² = 64, a raiz está entre 7 e 8; tome x0 = 8.\nx1 = 8 + (50 − 64)/(2 × 8) = 8 − 14/16 = 7,125\nErro exato: x1 − √50 ≈ 0,05393. A relação é e(n+1) = e(n)²/(2x(n)); como x0 ≥ √50, e1 ≤ e0²/(2√50) ≈ 0,0655.\nx2 = 7,125 + (50 − 50,765625)/(2 × 7,125) ≈ 7,071272\nErro de x2 ≈ 0,000204, já menor que 0,0003.\n\nEnquadramento por quadrados: 7,07² = 49,9849 e 7,08² = 50,1264. Logo √50 está entre 7,07 e 7,08 — duas casas decimais seguras.",
          example: "Outro exemplo: √123.\n\nPalpite x0 = 11, pois 11² = 121 e 12² = 144. Aqui o palpite está abaixo da raiz: a iteração ainda converge, mas o limite de erro escrito na camada 5 presume x ≥ √S.\nx1 = 11 + (123 − 121)/(2 × 11) = 11 + 2/22 ≈ 11,0909.\nConferência: 11,09² = 122,9881 e 11,10² = 123,21. A raiz está entre 11,09 e 11,10; 11,0909 é coerente.\n\nDiferença de quadrados aplicada: 193² = (200 − 7)² = 40000 − 2800 + 49 = 37249. Também pode ser visto como (193 + 7)(193 − 7) + 7² = 200 × 186 + 49 = 37249.",
          traps: [
            "Esquecer o termo 2ab: (50 − 3)² não é 2500 − 9.",
            "Trocar o sinal do termo do meio em (a − b)².",
            "Aplicar diferença de quadrados a uma soma que não é da forma (a−b)(a+b) sem conferir.",
            "Usar a fórmula de erro quando o palpite é menor que a raiz: a desigualdade apresentada presume x(n) ≥ √S.",
            "Anunciar many casas decimais sem checar por quadrado: a aproximação de Newton precisa de verificação."
          ],
          realWorld: [
            "Comparar áreas: um terreno 47 m × 53 m tem a mesma área de um quadrado de 50 m menos 3 m × 3 m.",
            "Estimar velocidade ou escala a partir de uma raiz, como converter área em lado de um quadrado equivalente.",
            "Conferir uma conta de quadrado em planilha usando a identidade (a+b)² como checagem independente."
          ],
          checks: [
            {
              q: "Quanto é 47² usando a referência 50?",
              options: ["2491", "2209", "2809"],
              correct: 1,
              hints: [
                "Escreva (50 − 3)².",
                "2500 − 2 × 50 × 3 + 9.",
                "2500 − 300 + 9 = 2209."
              ]
            },
            {
              q: "Quanto é 47 × 53 pela diferença de quadrados?",
              options: ["2491", "2509", "2209"],
              correct: 0,
              hints: [
                "É (50 − 3)(50 + 3).",
                "Aplica a² − b² = 2500 − 9.",
                "O resultado é 2491."
              ]
            },
            {
              q: "Após x0 = 8 para √50, o que é x1 pela iteração de Newton?",
              options: ["7,125", "7,875", "7,07143"],
              correct: 0,
              hints: [
                "Use x1 = x0 + (S − x0²)/(2x0).",
                "A correção é −14/16 = −0,875.",
                "8 − 0,875 = 7,125."
              ]
            }
          ],
          alternative: {
            intro: "Não entendi — explique de outro jeito: pense em um quadrado de papel cortado.",
            text: "Um quadrado de lado 50 tem 2500 de área. Para virar um quadrado de lado 47, você tira uma faixa de 3 de cima e outra de 3 do lado: tira 300, mas a esquininha 3 × 3 foi contada duas vezes, então devolve 9. Resultado 2209. Já 47 × 53 é um retângulo: o que você tira de um lado, ganha do outro, sobrando só a esquinha de 3 × 3 a menos que o quadrado 50 × 50.",
            diagram: "50×50 − faixas(2×50×3) + esquina(3×3) = 47² | (50−3)(50+3) = 50² − 3²"
          },
          feynman: {
            prompt: "Explique com suas próprias palavras como calcular 47² e 47 × 53 usando a referência 50, e como uma iteração de Newton melhora um palpite para √50.",
            minChars: 30,
            keywords: ["quadrado", "diferença", "referência", "Newton"]
          },
          summary: [
            "(a ± b)² = a² ± 2ab + b²; (a − b)(a + b) = a² − b² explicam os atalhos com referências 50, 100 e 1000.",
            "A iteração x ← x + (S − x²)/(2x) converges rapidamente quando o palpite é próximo e maior que a raiz.",
            "Sempre enquadre a raiz entre dois quadrados: é a checagem que transforma uma aproximação em resultado confiável."
          ],
          connection: "Próximo módulo → 13.5: a mesma busca por estrutura aparece nos testes de divisibilidade e na simplificação de frações."
        },
        exercises: [
          { q: "Quanto é 103²?", options: ["10609", "10690", "10409"], answer: 0, explanation: "10000 + 2×100×3 + 9 = 10609." },
          { q: "Quanto é 996²?", options: ["992016", "9920160", "99201600"], answer: 0, explanation: "(1000 − 4)² = 1000000 − 8000 + 16 = 992016." },
          { q: "Quanto é 193²?", options: ["38249", "37249", "36249"], answer: 1, explanation: "(200 − 7)² = 40000 − 2800 + 49 = 37249. Também dá 200 × 186 + 49." },
          { q: "Qual é o limite superior do erro após uma iteração de Newton quando x ≥ √S?", options: ["e²/(2x)", "2e", "e/2"], answer: 0, explanation: "Para x ≥ √S, o novo erro é e²/(2x) ≤ e²/(2√S): convergência quadrática." },
          { q: "Uma iteração para √123 a partir de 11 dá aproximadamente:", options: ["11,0909", "11,5", "11,25"], answer: 0, explanation: "11 + 2/22 ≈ 11,0909; 11,09² = 122,9881 e 11,10² = 123,21." },
          { q: "Qual identidade calcula 47 × 53?", options: ["(50−3)(50+3) = 2500 − 9", "(50−3)² = 2500 − 300 + 9", "50 × 53 − 3 × 53"], answer: 0, explanation: "Diferença de quadrados: 2500 − 9 = 2491." }
        ],
        keywords: ["quadrado perfeito", "diferença de quadrados", "identidade algébrica", "Newton", "Babilônia", "erro quadrático", "enquadramento"]
      },

      {
        id: "13.5",
        title: "Divisão mental e frações",
        objective: "Testar divisibilidade, dividir em etapas curtas, converter entre fração, decimal e porcentagem e simplificar fatores antes de multiplicar.",
        duration: "45 min",
        lesson: {
          kicker: "Trilha 13 · Módulo 5 · Aula 5",
          track: "Cálculo Mental",
          title: "Divisão mental e frações",
          hook: "Você precisa saber se 8.492 cabe inteiro em partes de 11 e, logo depois, quanto é 14/15 de 45/28. Fazer a divisão armada e multiplicar os numeradores gigantes funciona, mas gasta tempo e esconde a estrutura. Existem testes curtos e cancelamentos que respondem antes da calculadora.",
          intuition: "Divisibilidade é uma pergunta sobre forma, não sobre quociente: olhar os algarismos já decide. Fração é uma divisão pendente; simplificar antes de multiplicar é cancelar a divisão que você ainda não fez. Porcentagem é só uma fração com denominador 100 escrita de outro jeito.",
          limit: "Esta analogia é útil para organizar a conta, mas falha em Y porque Z: um teste de divisibilidade responde «é divisível?», não «quanto é?». O teste do 11 usa soma alternada; se o resultado é 0 ou múltiplo de 11, há divisibilidade — mas você ainda precisa dividir para obter o quociente. E decimal de 1/6 não termina: converter nem sempre dá uma escrita curta.",
          layers: [
            "Camada 1: testes de 2, 3, 4, 5, 6, 8, 9 e 11 a partir dos algarismos.",
            "Camada 2: divisão curta: divida casa por casa da esquerda, carregando o resto para a próxima.",
            "Camada 3: decomposição do dividendo em partes divisíveis: 847 = 700 + 147 = 700 + 140 + 7.",
            "Camada 4: fração ↔ decimal ↔ porcentagem: 3/8 = 0,375 = 37,5%.",
            "Camada 5: simplificar fatores comuns antes de multiplicar frações."
          ],
          ruleWhy: "Os testes funcionam porque o valor posicional decimal tem relações simples com o divisor: 10 é par, 100 é múltiplo de 4, 1000 é múltiplo de 8; 10 ≡ 1 (mod 3 e 9), então a soma dos algarismos conserva o resto; 10 ≡ −1 (mod 11), daí a soma alternada. Cancelar antes de multiplicar usa a mesma ideia: a ordem das operações não altera o produto, mas muda o tamanho dos números que você precisa segurar na cabeça.",
          physical: "Testes (n = número inteiro):\n\n  2  → último algarismo par.\n  3  → soma dos algarismos múltipla de 3.\n  4  → últimos dois algarismos formam múltiplo de 4.\n  5  → termina em 0 ou 5.\n  6  → passa nos testes de 2 e de 3.\n  8  → últimos três algarismos formam múltiplo de 8.\n  9  → soma dos algarismos múltipla de 9.\n  11 → soma alternada dos algarismos dá 0 ou múltiplo de 11.\n\nExemplo do 11: 8492 → 8 − 4 + 9 − 2 = 11, logo é divisível; 8492 / 11 = 772.\nOutro: 1331 → 1 − 3 + 3 − 1 = 0; é 11³.\n\nDivisão curta: 847 / 7.\n  8 / 7 = 1, resto 1 → próximo número é 14\n  14 / 7 = 2, resto 0 → próximo número é 7\n  7 / 7 = 1 → quociente 121.\n\nFrações e porcentagens:\n  1/8 = 0,125 → 3/8 = 0,375 = 37,5%\n  1/6 = 0,1666... (dízima periódica)\n  (14/15) × (45/28): 14 com 28 → 1/2; 45 com 15 → 3/1; resultado 3/2.",
          example: "Exemplo combinado: calcular 18% de 250 sem calculadora.\n\n18% = 0,18 = 18/100 = 9/50. Então 9/50 × 250 = 9 × 5 = 45. Ou: 10% de 250 é 25; 8% é 20; 25 + 20 = 45.\n\nExemplo de simplificação antes de multiplicar: (14/15) × (45/28). Cancele 14 com 28 (fica 1/2) e 45 com 15 (fica 3/1). Resultado 3/2 = 1,5. Conferência direta: 14 × 45 = 630; 15 × 28 = 420; 630/420 = 3/2.",
          traps: [
            "Usar a soma dos algarismos para testar 4 ou 8: esses testes olham os últimos dois ou três algarismos.",
            "Achar que o teste do 11 dá o quociente: ele só decide a divisibilidade.",
            "Esquecer o resto na divisão curta: em 847 / 7, o resto 1 de 8 / 7 forma 14.",
            "Multiplicar numeradores e denominadores sem cancelar: o resultado é o mesmo, mas os números ficam grandes.",
            "Prometer decimal curto para toda fração: 1/6 e 1/7 são periódicos."
          ],
          realWorld: [
            "Checar se uma quantidade de itens pode ser dividida igualmente entre 3, 4, 8 ou 11 pessoas.",
            "Converter descontos: 25% é 1/4; 12,5% é 1/8; 37,5% é 3/8.",
            "Ajustar receitas: multiplicar frações de ingredientes com cancelamento prévio evita erros de escala."
          ],
          checks: [
            {
              q: "Qual teste decide rapidamente se 8492 é divisível por 11?",
              options: [
                "Somar todos os algarismos e verificar se dá 11.",
                "Fazer a soma alternada 8 − 4 + 9 − 2 e verificar se o resultado é 0 ou múltiplo de 11.",
                "Olhar apenas o último algarismo."
              ],
              correct: 1,
              hints: [
                "O teste do 11 é alternado, não uma soma simples.",
                "8 − 4 + 9 − 2 = 11.",
                "Como deu 11, o número é divisível: 8492 / 11 = 772."
              ]
            },
            {
              q: "Quanto é (14/15) × (45/28) após simplificar?",
              options: ["3/2", "630/420 sem simplificar", "7/4"],
              correct: 0,
              hints: [
                "Cancele 14 com 28 e 45 com 15.",
                "Fica (1/2) × (3/1).",
                "O resultado é 3/2."
              ]
            },
            {
              q: "Qual conversão está correta?",
              options: ["3/8 = 0,375 = 37,5%", "3/8 = 0,38 = 38%", "1/6 = 0,16 exato"],
              correct: 0,
              hints: [
                "1/8 = 0,125; multiplique por 3.",
                "0,375 × 100 = 37,5%.",
                "Já 1/6 é dízima periódica, não 0,16 exato."
              ]
            }
          ],
          alternative: {
            intro: "Não entendi — explique de outro jeito: pense em divisor como uma peneira.",
            text: "Cada teste é uma peneira com buracos de tamanho diferente. A peneira do 2 olha só o último algarismo; a do 4 olha os dois últimos; a do 3 olha a soma de todos; a do 11 olha os algarismos em zigue-zague. Se o número passa na peneira do 2 e na do 3, passa na do 6. Já a fração é como dividir uma pizza antes de assar: cancelar fatores comuns é tirar fatias que aparecem em cima e embaixo antes de contar.",
            diagram: "n → [peneira 2] [peneira 3] [peneira 4] ... → sim/não | fração → cancelar → multiplicar"
          },
          feynman: {
            prompt: "Explique com suas próprias palavras por que a soma dos algarismos testa divisibilidade por 3 e por 9, mas não por 4, e como simplificar antes de multiplicar frações.",
            minChars: 30,
            keywords: ["divisibilidade", "algarismos", "fração", "cancelar"]
          },
          summary: [
            "Testes de divisibilidade leem a forma do número: 2, 3, 4, 5, 6, 8, 9 e 11 têm regras curtas e distintas.",
            "Divisão curta carrega restos da esquerda para a direita; o teste responde sim/não, não o quociente.",
            "Fração, decimal e porcentagem são a mesma relação escrita de três formas; cancele fatores antes de multiplicar."
          ],
          connection: "Próximo módulo → 13.6: depois de dominar restos e módulos, você tem a ferramenta certa para o calendário."
        },
        exercises: [
          { q: "Qual número é divisível por 8?", options: ["1234", "1232", "1236"], answer: 1, explanation: "Olhe os três últimos algarismos: 232 = 29 × 8; 234 e 236 não são múltiplos de 8." },
          { q: "Quanto é 847 / 7?", options: ["112", "121", "131"], answer: 1, explanation: "8/7 = 1 resto 1; 14/7 = 2; 7/7 = 1 → 121." },
          { q: "Qual é 37,5% em fração simplificada?", options: ["3/8", "1/3", "5/8"], answer: 0, explanation: "37,5% = 0,375 = 375/1000 = 3/8." },
          { q: "18% de 250 é:", options: ["45", "40", "50"], answer: 0, explanation: "10% = 25 e 8% = 20; 25 + 20 = 45. Ou 9/50 × 250 = 45." },
          { q: "Qual número NÃO é divisível por 3?", options: ["123", "456", "1258"], answer: 2, explanation: "1+2+5+8 = 16, não múltiplo de 3; 1+2+3=6 e 4+5+6=15 são." },
          { q: "Por que 10 ≡ 1 (mod 9) ajuda no teste do 9?", options: ["Porque 10 é múltiplo de 9.", "Porque cada potência de 10 deixa resto 1, então o número e a soma de seus algarismos têm o mesmo resto.", "Porque o último algarismo decide o resto."], answer: 1, explanation: "Como 10^k ≡ 1 (mod 9), todos os algarismos contam pelo seu valor simples na soma." }
        ],
        keywords: ["divisibilidade", "soma alternada", "divisão curta", "resto", "fração", "porcentagem", "cancelamento", "dízima periódica"]
      },

      {
        id: "13.6",
        title: "Doomsday: o dia da semana na cabeça",
        objective: "Calcular o dia da semana de uma data gregoriana usando âncoras de século, datas de Doomsday e a regra do ano bissexto.",
        duration: "45 min",
        lesson: {
          kicker: "Trilha 13 · Módulo 6 · Aula 6",
          track: "Cálculo Mental",
          title: "Doomsday: o dia da semana na cabeça",
          hook: "Alguém pergunta: «que dia da semana era 28 de novembro de 2026?» Você não tem calendário e não quer usar o celular. Existe um método que transforma a pergunta em três contas pequenas: descubra o dia «coringa» do ano, some dias a partir de uma data âncora e chegue à data pedida.",
          intuition: "Todo ano tem um conjunto de datas que caem no mesmo dia da semana: 4/4, 6/6, 8/8, 10/10, 12/12, 9/5, 5/9, 7/11, 11/7 e o último dia de fevereiro (3/0). Esse dia é o Doomsday do ano. Se você souber qual é, qualquer outra data está a poucos passos de uma dessas âncoras.",
          limit: "Esta analogia é útil como mapa, mas falha em Y porque Z: o calendário gregoriano não existiu sempre — cada país o adotou em uma época diferente. Para datas anteriores à adoção local, a resposta depende de se você usa o calendário gregoriano proléptico ou o juliano. Aqui todas as contas são gregorianas e prolépticas, e os dias da semana foram conferidos com datas conhecidas.",
          layers: [
            "Camada 1: regra do bissexto — divisível por 4, exceto se divisível por 100, a menos que também seja divisível por 400.",
            "Camada 2: âncora do século gregoriano: 1700 domingo, 1800 sexta, 1900 quarta, 2000 terça, 2100 domingo; o ciclo de 400 anos se repete.",
            "Camada 3: para o ano yy dentro do século, some âncora + q + r + floor(r/4), onde yy = 12q + r; o resultado é o Doomsday (0 = domingo, ..., 6 = sábado).",
            "Camada 4: memorize as datas coringa: 1/3 (ou 1/4 no bissexto), 3/0, 4/4, 5/9, 6/6, 7/11, 8/8, 9/5, 10/10, 11/7, 12/12; 3/7 também é coringa.",
            "Camada 5: some ou subtraia dias múltiplos de 7 até chegar à data desejada."
          ],
          ruleWhy: "O método funciona porque o calendário é aritmética modular disfarçada. Um ano comum tem 365 = 52 × 7 + 1 dias, então o dia da semana avança 1; um bissexto avança 2. Em 12 anos há 3 bissextos, logo o avanço é 12 + 3 = 15 ≡ 1 (mod 7) — daí dividir yy por 12. As datas coringa ficam no mesmo dia porque a distância entre elas é sempre múltiplo de 7.",
          physical: "Âncoras de século (Doomsday do ano que termina em 00):\n\n  1600 terça (2) · 1700 domingo (0) · 1800 sexta (5) · 1900 quarta (3) · 2000 terça (2) · 2100 domingo (0)\n\nConferência: 1/1/2000 foi sábado; 4/1/2000 (coringa do bissexto) foi terça. 3/1/1900 foi quarta; 3/1/1700 foi domingo.\n\nExemplo 1 — 28/11/2026:\n\n  século 2000 → âncora terça = 2\n  yy = 26 = 12 × 2 + 2 → q = 2, r = 2, floor(r/4) = 0\n  Doomsday = 2 + 2 + 2 + 0 = 6 → sábado\n  11/7 é coringa → 7/11/2026 foi sábado\n  28 − 7 = 21 = 3 × 7 → 28/11/2026 também foi sábado\n\nExemplo 2 — 15/08/1947:\n\n  século 1900 → âncora quarta = 3\n  yy = 47 = 12 × 3 + 11 → q = 3, r = 11, floor(r/4) = 2\n  Doomsday = 3 + 3 + 11 + 2 = 19 ≡ 5 (mod 7) → sexta\n  8/8 é coringa → 8/8/1947 foi sexta\n  15 − 8 = 7 → 15/08/1947 foi sexta\n\nConferências feitas contra datas conhecidas: 28/11/2026 é sábado; 15/08/1947 foi sexta.",
          example: "Exemplo rápido para ano bissexto: 29/02/2024.\n\n2024 é bissexto (divisível por 4, não por 100). Âncora 2000 = 2; yy = 24 = 12 × 2 + 0 → q = 2, r = 0, floor(0/4) = 0; Doomsday = 2 + 2 = 4 → quinta. O último dia de fevereiro é coringa: 29/02/2024 foi quinta-feira. O 1º de março (3/0 + 1) foi sexta.\n\nAtenção ao século: 1900 NÃO foi bissexto (divisível por 100 e não por 400); 2000 FOI bissexto (divisível por 400).",
          traps: [
            "Aplicar «divisível por 4» sem a exceção do século: 1900 não é bissexto; 2000 é.",
            "Esquecer que a âncora muda de século: 1900 é quarta, 2000 é terça.",
            "Usar 2/0 como coringa: a convenção é 3/0, o último dia de fevereiro.",
            "Somar 1 para ano bissexto na hora errada: a correção já está no termo floor(r/4) da fórmula do ano.",
            "Aplicar o método a datas anteriores à adoção do gregoriano sem declarar qual calendário está sendo usado."
          ],
          realWorld: [
            " conferir a data de um documento antigo ou uma celebração recorrente sem abrir o celular.",
            "Agendar reuniões e entender porque certa data cai sempre no mesmo dia dentro do ano.",
            "Conferir a saída de uma biblioteca Date ou de uma planilha com um cálculo independente."
          ],
          checks: [
            {
              q: "Qual era o dia da semana de 28/11/2026?",
              options: ["Sexta", "Sábado", "Domingo"],
              correct: 1,
              hints: [
                "O Doomsday de 2026 é sábado.",
                "11/7 é coringa e caiu no sábado.",
                "28 − 7 = 21, múltiplo de 7: sábado."
              ]
            },
            {
              q: "Qual é a âncora do século 2000 no método Doomsday?",
              options: ["Domingo", "Quarta", "Terça"],
              correct: 2,
              hints: [
                "A sequência é 1700 domingo, 1800 sexta, 1900 quarta...",
                "Depois de 1900 vem 2000.",
                "2000 = terça."
              ]
            },
            {
              q: "Qual ano é bissexto segundo a regra gregoriana?",
              options: ["1900", "2000", "2100"],
              correct: 1,
              hints: [
                "A regra é: divisível por 4, exceto por 100, a menos que por 400.",
                "1900 e 2100 são divisíveis por 100, mas não por 400.",
                "2000 é divisível por 400."
              ]
            }
          ],
          alternative: {
            intro: "Não entendi — explique de outro jeito: pense no ano como um relógio com dia coringa.",
            text: "Em cada ano, certas datas funcionam como ponteiros que apontam para o mesmo dia da semana: 4/4, 6/6, 8/8, 10/10, 12/12 e companhia. Primeiro você descobre para onde o ponteiro aponta neste ano fazendo a conta do século mais a conta do ano. Depois é só caminhar a partir da data coringa mais próxima: se 11/7 é sábado, 14/7 é terça e 28/11 também é sábado porque 21 dias depois não muda o dia da semana.",
            diagram: "século → âncora → + ano (q + r + r/4) → Doomsday → data coringa → ± múltiplos de 7"
          },
          feynman: {
            prompt: "Explique com suas próprias palavras como encontrar o dia da semana de uma data usando as âncoras de século e as datas coringa, e por que a regra do bissexto importa.",
            minChars: 30,
            keywords: ["Doomsday", "século", "bissexto", "coringa"]
          },
          summary: [
            "O calendário gregoriano é aritmética modular: ano comum avança 1 dia, bissexto avança 2.",
            "Âncoras de século mais a fórmula do ano dão o Doomsday; as datas coringa espalham esse dia pelo calendário.",
            "A regra do bissexto (÷4, exceto ÷100, salvo ÷400) e a escolha do calendário são pré-condições do método."
          ],
          connection: "Fecho da trilha → escolha uma data real, calcule o dia da semana e registre o resultado como cartão de revisão: o mesmo SM-2 da aula 13.1 agora sustenta o cálculo mental."
        },
        exercises: [
          { q: "Quanto é o Doomsday de 2026?", options: ["Sábado", "Sexta", "Segunda"], answer: 0, explanation: "Âncora 2000 = 2; 26 = 12×2+2 → 2+2+2+0 = 6 = sábado." },
          { q: "Quanto é o Doomsday de 1947?", options: ["Quinta", "Sexta", "Terça"], answer: 1, explanation: "Âncora 1900 = 3; 47 = 12×3+11 → 3+3+11+2 = 19 ≡ 5 = sexta." },
          { q: "Qual data é coringa em qualquer ano (com ajuste no bissexto)?", options: ["1/1", "4/4", "2/14"], answer: 1, explanation: "4/4, 6/6, 8/8, 10/10 e 12/12 são coringas fixos." },
          { q: "Que dia da semana foi 15/08/1947?", options: ["Sexta", "Sábado", "Quarta"], answer: 0, explanation: "Doomsday de 1947 = sexta; 8/8 é coringa; 15 − 8 = 7, então 15/08 também foi sexta." },
          { q: "Qual século tem âncora domingo?", options: ["1700", "1800", "1900"], answer: 0, explanation: "1700 = domingo; 1800 = sexta; 1900 = quarta; 2000 = terça." },
          { q: "Por que 21 dias não mudam o dia da semana?", options: ["Porque 21 é múltiplo de 7.", "Porque todo mês tem 21 dias.", "Porque o calendário reinicia a cada semana no dia 21."], answer: 0, explanation: "21 = 3 × 7; qualquer múltiplo de 7 preserva o dia da semana." }
        ],
        keywords: ["Doomsday", "calendário gregoriano", "âncora de século", "ano bissexto", "datas coringa", "aritmética modular", "proléptico"]
      }
    ]
  };
})();

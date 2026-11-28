/* ============================================================
   FORGE — data-trilha14.js
   Trilha 14: Literatura, Filosofia e Fé.
   4 módulos no padrão "Universo Narrado" (12 regras por aula).
   Arquivo aditivo: não altera trilhas anteriores nem carrega
   recursos externos. Citações são apresentadas com cautela:
   quando não há conferência literal, o texto diz "paráfrase".
   ============================================================ */

(function () {
  "use strict";

  window.FORGE_TRILHA14 = {
    id: "14",
    title: "Trilha 14 — Literatura, Filosofia e Fé",
    subtitle: "Quatro módulos para treinar juízo, linguagem e honestidade intelectual sem abandonar o rigor técnico.",
    modules: [
      {
        id: "14.1",
        title: "O papel das humanidades na formação técnica",
        objective: "Compreender como literatura, filosofia e fé ajudam o engenheiro e o mentor a formular fins, imaginar afetados e comunicar valores — sem substituir método, teste ou evidência.",
        duration: "55 min",
        lesson: {
          kicker: "Trilha 14 · Módulo 14.1 · Humanidades e método",
          track: "Literatura, Filosofia e Fé",
          title: "O papel das humanidades na formação técnica",
          hook: "Um sistema pode compilar, passar em todos os testes e ainda causar dano a quem o usa.\n\nA pergunta que a engenharia, sozinha, não responde é: «bom para quem, e com que custo?» Um painel de performance mede o que você escolheu medir; ele não decide o que deveria ter sido medido. É aqui que leitura, filosofia e tradição de fé entram — não como enfeite cultural, mas como treino de juízo sobre os fins.",
          intuition: "Uma narrativa é um laboratório barato de consequências. Você entra na cabeça de outra pessoa, vê o que ela sabia, o que temia e o que escolheu, e ensaia um julgamento sem precisar causar o dano primeiro. A ficção não dá a resposta: ela melhora a pergunta.",
          limit: "Esta analogia é útil para entender a simulação moral, mas falha em Y porque Z: um romance não tem mensuração, revisão por pares nem consequências rastreáveis. Ler sobre um erro não substitui teste, auditoria, métrica e responsabilidade técnica. As humanidades treinam o juízo sobre fins; não corrigem um algoritmo nem garantem que o deploy esteja seguro.",
          layers: [
            "Camada 1 — meios e fins: a engenharia responde como fazer; a filosofia pergunta por que fazer e o que conta como bom.",
            "Camada 2 — imaginação: a literatura coloca você numa situação com informação incompleta, parecida com um incidente real de produção.",
            "Camada 3 — linguagem: palavras como «seguro», «justo» e «arriscado» precisam de definição antes de virarem requisito testável.",
            "Camada 4 — comunidade: fé e tradição oferecem uma gramática moral, que também precisa ser examinada quando se transforma em política pública."
          ],
          ruleWhy: "Decisões técnicas são decisões humanas disfarçadas de números. Sem vocabulário para valores, a equipe discute apenas desempenho e chama isso de neutralidade; essa suposta neutralidade costuma herdar, sem exame, o viés do estado atual das coisas.",
          physical: "Mecanismo operacional (não é medição cerebral; é descrição do que a prática faz):\n\n  texto -> leitura demorada -> simulação de intenções alheias\n        -> desconforto moral -> pergunta sobre fins\n        -> conversa com o time -> requisito revisado\n\nO caminho técnico correspondente é:\n  requisito -> risco -> teste/auditoria -> evidência -> decisão\n\nAs duas trilhas se encontram no ponto «decisão». Se uma faltar, a outra fica cega: os meios sem fins aceleram o erro, e os fins sem meios viram boa intenção sem efeito.",
          example: "Cena: uma equipe discute um sistema de recomendação que aumentou 12% do tempo de tela.\n\nEngenheiro: «O modelo funciona; a perda caiu.»\nMentor: «Funciona para qual objetivo? Esse aumento é bem-estar ou vício? Quem pode ser prejudicado e não está nesta sala?»\nEngenheiro: «Não tenho como medir isso.»\nMentor: «Então não finja que mediu. Registre como valor em discussão, busque dado e não transforme silêncio em consentimento.»\n\nO mentor não substitui o teste: ele impede que o teste responda uma pergunta que nunca foi feita.",
          traps: [
            "Achar que humanidades dão «ética automática»: ler um clássico não isenta ninguém de revisar código nem de ouvir usuários.",
            "Usar citação famosa como argumento: autoridade não é evidência; pergunte qual é a premissa e qual é a conclusão.",
            "Confundir empatia com decisão: sentir pela pessoa afetada não define orçamento, prazo ou limite de privacidade.",
            "Tratar fé como substituto de método: convicção pessoal não torna um bug menos real."
          ],
          realWorld: [
            "Revisão de código: perguntar «quem vai ler isso daqui a dois anos?» é imaginação moral aplicada à manutenção.",
            "Produto: equipes que nomeiam valores (privacidade, acessibilidade, segurança) conseguem cobrar requisitos que um dashboard de performance não mostra.",
            "Formação de mentores: a narrativa permite ensinar um erro grave sem humilhar quem o cometeu — o caso vira exemplo, não caça às bruxas."
          ],
          checks: [
            {
              q: "Numa discussão de produto, qual é a contribuição correta das humanidades?",
              options: [
                "Eliminar testes, pois juízo moral substitui verificação.",
                "Fornecer vocabulário para fins e ampliar a imaginação sobre quem será afetado.",
                "Substituir métricas por opinião pessoal do time.",
                "Provar cientificamente qual valor é verdadeiro."
              ],
              correct: 1,
              hints: [
                "Pense na diferença entre meios e fins.",
                "Humanidades ajudam a formular a pergunta; não produzem a evidência.",
                "A opção B amplia a pergunta sem fingir que mediu algo."
              ]
            },
            {
              q: "Qual afirmação respeita o limite das humanidades?",
              options: [
                "Um romance bem lido dispensa auditoria de segurança.",
                "Filosofia resolve bug de concorrência melhor que um debugger.",
                "Humanidades ajudam a formular perguntas, mas a verificação continua técnica.",
                "Fé elimina a incerteza de uma decisão de engenharia."
              ],
              correct: 2,
              hints: [
                "Procure a opção que mantém as duas trilhas sem confundi-las.",
                "Leitura não substitui teste; teste não substitui juízo.",
                "A alternativa C diz exatamente isso."
              ]
            },
            {
              q: "Onde o teste Feynman se encaixa no ciclo FORGE?",
              options: [
                "É a etapa de explicar com as próprias palavras, revelando o que você ainda não entendeu.",
                "É um plugin externo instalado pela internet.",
                "É uma forma de substituir a prática em laboratório.",
                "Só serve para matemática, não para humanidades."
              ],
              correct: 0,
              hints: [
                "O ciclo termina com síntese, não com decoração.",
                "Explicar sem o jargão mostra onde a lacuna está.",
                "A opção A descreve essa afirmação."
              ]
            }
          ],
          alternative: {
            intro: "Não entendi — pense num duo de navegação: um lê o mapa, outro dirige.",
            text: "A engenharia dirige: verifica motor, pneus e combustível. As humanidades leem o mapa e perguntam se o destino é o certo e se alguém ficou fora do carro. Nenhum dos dois faz o trabalho do outro. Quem diz «o mapa não serve para nada» não ganhou velocidade: só perdeu a direção. Quem inventa que o carro anda sozinho trocou cuidado por fantasia.",
            diagram: "mapa (fins) + direção (meios) -> destino verificável\nmapa sozinho -> intenção sem execução\ndireção sozinha -> velocidade sem destino"
          },
          feynman: {
            prompt: "Explique, com um exemplo concreto, por que ler ficção pode ajudar um engenheiro e por que isso não substitui testes. Use as palavras fim, meio e imaginação.",
            minChars: 30,
            keywords: ["fim", "meio", "imaginação", "teste"]
          },
          summary: [
            "Humanidades treinam a pergunta sobre fins; engenharia verifica os meios.",
            "Narrativa é uma simulação ética barata, mas não substitui evidência, teste ou responsabilidade.",
            "No ciclo FORGE, o Feynman fecha o loop: explicar revela o que ainda ficou no jargão."
          ],
          connection: "Próximo módulo → 14.2: quatro autores que transformam esse dilema em cena, personagem e argumento."
        },
        exercises: [
          {
            q: "Qual é a melhor descrição do papel das humanidades na formação de um mentor técnico?",
            options: [
              "Elas substituem a revisão de código por sensibilidade literária.",
              "Elas ampliam o vocabulário sobre fins e ajudam a imaginar quem será afetado.",
              "Elas garantem que toda decisão técnica seja moralmente correta.",
              "Elas eliminam a necessidade de discutir requisitos."
            ],
            answer: 1,
            explanation: "O ponto não é substituir procedimentos, e sim ampliar a pergunta. Um mentor com vocabulário moral consegue nomear riscos que um painel de métricas não mostra, sem fingir que os mediu."
          },
          {
            q: "Um colega diz: «Terminei de ler um clássico, então já sei julgar este sistema». Qual é a resposta mais honesta?",
            options: [
              "Concordo: leitura é conhecimento suficiente.",
              "Discordo: leitura só é útil quando acompanhada de dados e escuta.",
              "Concordo, desde que o livro seja famoso.",
              "Discordo: leitura nunca tem relação com decisão técnica."
            ],
            answer: 1,
            explanation: "A leitura ajuda a formular perguntas, mas julgar um sistema exige evidência, contexto e escuta das pessoas afetadas. Nem a celebração do livro nem sua rejeição total é útil."
          },
          {
            q: "O que a aula chama de «simulação ética»?",
            options: [
              "Um algoritmo que calcula o valor moral de cada ação.",
              "Um debate sem conclusão prática.",
              "O ensaio de julgamento proporcionado por uma narrativa, com consequências simuladas.",
              "Uma auditoria automatizada de segurança."
            ],
            answer: 2,
            explanation: "A narrativa permite ensaiar escolhas e consequências sem causar dano real. Ela é um treino de imaginação, não um cálculo moral nem uma auditoria."
          },
          {
            q: "No ciclo FORGE, o que o teste Feynman revela com mais clareza?",
            options: [
              "Quantos bugs o código tem.",
              "Qual é a tradução correta de um livro.",
              "Quanto tempo de estudo você acumulou na semana.",
              "Onde a explicação depende de jargão e ainda não foi compreendida."
            ],
            answer: 3,
            explanation: "Ao explicar sem termos prontos, você percebe onde a compreensão é frágil. O mesmo vale para conceitos humanísticos: «respeito» ou «justiça» precisam poder ser ditos com palavras próprias."
          },
          {
            q: "Qual alternativa mistura indevidamente fé e método?",
            options: [
              "Registrar um valor discutido em requisito e pedir dado sobre ele.",
              "Dizer que, por convicção religiosa, um bug não precisa ser corrigido.",
              "Explicar que um autor influenciou sua visão de profissão.",
              "Separar o que foi medido do que ainda é escolha de valor."
            ],
            answer: 1,
            explanation: "Convicção pode motivar a pessoa, mas não muda o comportamento do sistema. A opção B transforma fé em substituto de verificação — exatamente o erro que a aula pede evitar."
          }
        ],
        keywords: ["humanidades", "imaginação moral", "fins", "meios", "mentoria", "Feynman", "simulação ética"]
      },

      {
        id: "14.2",
        title: "Dostoiévski, Dante, Tolstói, Chesterton",
        objective: "Ler quatro autores com precisão: separar o que o texto diz, o que um personagem diz e o que circula como resumo; praticar a prova de leitura citação/paráfrase/atribuição.",
        duration: "70 min",
        lesson: {
          kicker: "Trilha 14 · Módulo 14.2 · Prova de leitura",
          track: "Literatura, Filosofia e Fé",
          title: "Dostoiévski, Dante, Tolstói, Chesterton",
          hook: "Quatro obras, quatro maneiras de testar uma convicção. Num romance, a ideia vem com rosto e conflito; num poema, vem com estrutura e imagem; num épico, vem com multidão; num ensaio, vem com paradoxo.\n\nO problema é que frases famosas viajam sem o texto. Chega um resumo, depois outro, e a ideia vira slogan. A pergunta deste módulo é: como saber se você está citando, parafraseando ou apenas repetindo um boato culto?",
          intuition: "Uma prova de leitura não é decorar frases: é conseguir dizer três coisas separadamente — (1) o que o texto afirma, (2) o que o personagem afirma, (3) o que outras pessoas disseram sobre o texto. Quem mistura os três níveis discute uma frase que talvez nunca tenha existido.",
          limit: "Esta analogia é útil para organizar a leitura, mas falha em Y porque Z: separar camadas não substitui a leitura do original. Sem o texto (ou uma edição confiável), classificar algo como «paráfrase» continua sendo uma hipótese prudente, não uma prova filológica. Aqui rotulamos com cuidado; não fingimos conferência que não fizemos.",
          layers: [
            "Dostoiévski — Irmãos Karamázov: liberdade e responsabilidade. A fórmula «se Deus não existe, tudo é permitido» circula como resumo da posição de Ivan; no romance, a discussão liga imortalidade, virtude e escolha. Trate como paráfrase atribuída, não como citação literal do autor.",
            "Dante — Divina Comédia: estrutura trilógica (Inferno, Purgatório, Paraíso) e alegoria de uma jornada. A selva escura da abertura é imagem de extravio, não relato geográfico.",
            "Tolstói — Guerra e Paz: história como soma de vidas miúdas, não apenas feitos de generais. A não-violência aparece com mais nitidez em escritos posteriores do autor; não a projete como tese literal do romance.",
            "Chesterton — O Homem Eterno: cristianismo defendido com imaginação e paradoxo. Paradoxo, aqui, é uma verdade apresentada de modo a desarmar o leitor (paráfrase da ideia correntemente atribuída a ele, não definição técnica)."
          ],
          ruleWhy: "A distinção entre citação, paráfrase e atribuição existe porque uma frase errada muda o argumento. Citar alguém com palavras que a pessoa não escreveu é trocar uma ideia por um slogan — e, em contexto acadêmico ou profissional, é uma forma de desonestidade mesmo sem intenção.",
          physical: "Prova de leitura em três passos (procedimento, não inspiração):\n\n  1. Quem fala? autor, narrador ou personagem?\n  2. Qual o grau? CITEI (fonte conferida) | PARAFRASEEI (sentido, outras palavras) | CIRCULA (sem conferência).\n  3. O que mudou? tom, escopo, exceções.\n\n  texto lido -> pergunta -> classe -> justificativa\n\nSe o passo 3 não aparece, você decorou em vez de ler.",
          example: "Aluno A: «Dostoiévski escreveu literalmente: tudo é permitido.»\nAluno B: «O romance discute a ideia de que, sem imortalidade, a virtude perde fundamento. Isso é paráfrase; a frase exata exigiria conferência na edição que estou usando.»\n\nO Aluno B não é mais cético: é mais preciso. Ele diz o que sabe e o que não sabe.\n\nOutro caso: «Dante começa contando que estava no meio da vida, numa floresta escura.» — paráfrase razoável da abertura; apresentar isso como tradução literal seria erro.",
          traps: [
            "Transformar fala de personagem em opinião do autor: Ivan Karamazov não é Dostoiévski.",
            "Atribuir a Guerra e Paz uma tese pacifista explícita que pertence a escritos posteriores de Tolstói.",
            "Repetir paradoxos de Chesterton como definições técnicas; ele brinca com a forma para revelar conteúdo.",
            "Usar «citação famosa» sem conferir edição, tradução e contexto."
          ],
          realWorld: [
            "Engenharia de requisitos: um stakeholder diz «é só confiança» e você precisa separar o valor dele da meta mensurável do sistema.",
            "Mentoria: atribuir uma frase a um autor é como atribuir um bug a um módulo — sem localização, o diagnóstico é chute.",
            "Inteligência artificial: modelos inventam aspas com facilidade; a prova de leitura é o mesmo hábito de verificar procedência antes de aceitar uma resposta."
          ],
          checks: [
            {
              q: "Um colega afirma: «Dostoiévski disse, literalmente, que se Deus não existe tudo é permitido». Como classificar?",
              options: [
                "Citação literal confirmada, desde que seja famosa.",
                "Dado biográfico do autor, verificável em arquivo.",
                "Paráfrase do tema discutido no romance; a frase exata exigiria conferência do texto.",
                "Tradução oficial da primeira edição."
              ],
              correct: 2,
              hints: [
                "Pergunte quem fala: autor, narrador ou personagem?",
                "A fórmula é conhecida, mas circular como resumo não é conferência.",
                "A alternativa C nomeia o grau de segurança sem fingir mais do que sabe."
              ]
            },
            {
              q: "Qual é a sequência correta da Divina Comédia?",
              options: [
                "Paraíso, Inferno, Purgatório.",
                "Inferno, Purgatório, Paraíso.",
                "Purgatório, Paraíso, Inferno.",
                "Inferno, Paraíso, Purgatório."
              ],
              correct: 1,
              hints: [
                "A jornada vai da condenação à purificação e depois à luz.",
                "Pense numa subida em três etapas.",
                "A ordem é Inferno, Purgatório, Paraíso."
              ]
            },
            {
              q: "Como descrever com cuidado a relação entre Guerra e Paz e a não-violência de Tolstói?",
              options: [
                "O romance é um tratado pacifista com citações estatísticas.",
                "A não-violência é tese central do romance, dita literalmente pelo narrador.",
                "O romance mostra história coletiva; a não-violência fica mais explícita em escritos posteriores.",
                "Tolstói nunca escreveu sobre não-violência."
              ],
              correct: 2,
              hints: [
                "Separe obra literária de ensaios posteriores.",
                "Uma coisa é o tema do romance; outra é a posição desenvolvida depois.",
                "A alternativa C faz essa distinção."
              ]
            }
          ],
          alternative: {
            intro: "Não entendi — pense num detetive que trabalha com três etiquetas.",
            text: "Etiqueta 1: CITEI — tenho a frase e a fonte conferida. Etiqueta 2: PARAFRASEEI — guardei o sentido e troquei as palavras. Etiqueta 3: CIRCULA — ouvi dizer, mas não conferi. Na dúvida, use a etiqueta 2 ou 3 e diga o que falta para subir para a 1. É o mesmo rigor que você usa ao dizer «testei localmente» em vez de «está provado em produção».",
            diagram: "CITEI (fonte) > PARAFRASEEI (sentido) > CIRCULA (sem fonte)\nsubir de nível exige conferir; descer é sempre permitido"
          },
          feynman: {
            prompt: "Explique a diferença entre citar, parafrasear e atribuir, usando um exemplo de um dos quatro autores desta aula.",
            minChars: 30,
            keywords: ["citação", "paráfrase", "personagem", "atribuição"]
          },
          summary: [
            "Cada autor trabalha uma pergunta diferente: liberdade, alegoria, história coletiva e paradoxo.",
            "Prova de leitura é separar autor, narrador e personagem — e rotular o grau de certeza da frase.",
            "Sem conferência, diga «paráfrase» ou «atribuição incerta»: honestidade é parte da leitura."
          ],
          connection: "Próximo módulo → 14.3: as mesmas perguntas em forma filosófica, com Platão, Aristóteles, Marco Aurélio e Boécio."
        },
        exercises: [
          {
            q: "Prova de leitura — Dostoiévski: «O autor escreveu textualmente: sem Deus, todo ato é moralmente indiferente.» Como classificar?",
            options: [
              "Citação literal confirmada.",
              "Paráfrase da discussão sobre liberdade e responsabilidade; a frase exata precisa ser conferida.",
              "Citação de uma carta do autor.",
              "Dado histórico sobre a vida de Dostoiévski."
            ],
            answer: 1,
            explanation: "O romance discute liberdade, imortalidade e virtude, mas a fórmula popularizada circula em resumos e traduções. Classifique como paráfrase e diga o que foi simplificado: a diferença entre a posição de um personagem e a do autor."
          },
          {
            q: "Prova de leitura — Dante: «No meio do caminho da vida, encontrei uma floresta escura.» O que é correto dizer?",
            options: [
              "É a tradução literal e oficial da abertura da Divina Comédia.",
              "É uma paráfrase da abertura; a palavra exata depende da tradução conferida.",
              "É uma citação de Santo Agostinho.",
              "É um dado geográfico sobre a viagem de Dante."
            ],
            answer: 1,
            explanation: "O sentido é reconhecível, mas a forma em português varia conforme a tradução. Sem conferir a edição, rotule como paráfrase — e não confunda a imagem da selva com um local mapeado."
          },
          {
            q: "Prova de leitura — Tolstói: «Guerra e Paz afirma literalmente que a não-violência sempre vence.» Qual é a classificação correta?",
            options: [
              "Citação literal do narrador.",
              "Paráfrase imprecisa: a não-violência é mais explícita em escritos posteriores; o romance enfatiza história coletiva.",
              "Citação de um discurso político do autor.",
              "Afirmação empírica verificável por estatística."
            ],
            answer: 1,
            explanation: "A posição sobre a violência é importante na vida de Tolstói, mas projetar a posição posterior como frase literal do romance é erro de leitura. Diga o que cada obra trata."
          },
          {
            q: "Prova de leitura — Chesterton: «Chesterton definiu o paradoxo como uma verdade de cabeça para baixo.» Como tratar?",
            options: [
              "Como definição técnica citada literalmente.",
              "Como paráfrase corrente de uma ideia de Chesterton; a redação exata varia nas fontes.",
              "Como resultado de uma pesquisa empírica.",
              "Como citação de O Homem Eterno com página conhecida."
            ],
            answer: 1,
            explanation: "A imagem é caracteristicamente chestertoniana, mas a redação circula em várias versões. Sem fonte conferida, paráfrase. Inventar número de página seria pior do que admitir a dúvida."
          },
          {
            q: "Qual alternativa descreve melhor o uso de alegoria na Divina Comédia?",
            options: [
              "Um código secreto para prever o futuro.",
              "Um relato de viagem com coordenadas verificáveis.",
              "Uma estrutura em que a viagem também representa um percurso moral e espiritual.",
              "Um problema matemático disfarçado de poema."
            ],
            answer: 2,
            explanation: "A alegoria funciona em duas camadas: a cena narrada e o sentido que ela carrega. O Inferno, o Purgatório e o Paraíso organizam a jornada, mas não devem ser lidos como um mapa físico."
          },
          {
            q: "Por que não devemos tratar Ivan Karamazov como porta-voz automático de Dostoiévski?",
            options: [
              "Porque personagens nunca dizem nada interessante.",
              "Porque o autor não tinha opinião sobre liberdade.",
              "Porque a obra é ficção: as posições dos personagens fazem parte de uma arquitetura dialógica.",
              "Porque Ivan não aparece no romance."
            ],
            answer: 2,
            explanation: "Romances constroem conflito entre vozes. Identificar personagem e autor achata o texto e costuma gerar citações falsas. A prova de leitura existe exatamente para evitar esse atalho."
          }
        ],
        keywords: ["Dostoiévski", "Dante", "Tolstói", "Chesterton", "paráfrase", "citação", "atribuição", "alegoria"]
      },

      {
        id: "14.3",
        title: "Platão, Aristóteles, Marco Aurélio, Boécio",
        objective: "Usar quatro ferramentas filosóficas em dilemas concretos de estudo e engenharia: aparência versus realidade, persuasão versus evidência, controle versus responsabilidade, plano versus acaso.",
        duration: "65 min",
        lesson: {
          kicker: "Trilha 14 · Módulo 14.3 · Filosofia aplicada com limite",
          track: "Literatura, Filosofia e Fé",
          title: "Platão, Aristóteles, Marco Aurélio, Boécio",
          hook: "Antes de abrir o editor, quatro perguntas insistentes: o que é real, o que é bom, o que depende de mim, o que veio do plano e o que veio do acaso?\n\nElas não são ornamentos. Aparecem quando um dashboard contradiz o usuário, quando uma reunião é convencida pelo tom de voz, quando um deploy falha no fim de semana e quando um teste falha «de vez em quando». Cada pensador desta aula afia uma dessas perguntas.",
          intuition: "Trate cada filósofo como uma lente de depuração. Platão separa sombra e coisa; Aristóteles separa modo de convencer e qualidade do hábito; Marco Aurélio separa o que está em suas mãos do que não está; Boécio separa a ordem do plano da irrupção do imprevisto.",
          limit: "Esta analogia é útil para usar a filosofia como ferramenta, mas falha em Y porque Z: nenhum sistema filosófico é um patch de software. Aplicar uma máxima antiga a um incidente moderno exige mediação, e a simplicidade da lente esconde séculos de debate. Use-a para perguntar melhor, nunca para encerrar a discussão.",
          layers: [
            "Platão — ideias e alegoria da caverna, com Sócrates perguntando se vemos as coisas ou sombras delas. Dilema moderno: tomar logs e gráficos como o próprio sistema, esquecendo o que foi escolhido não medir.",
            "Aristóteles — substância, ethos/pathos/logos e virtude como hábito. Dilema: um code review convence pelo caráter de quem fala (ethos), pelo medo (pathos) ou pela evidência (logos)? Competência vem de prática repetida, não de decorar um manual.",
            "Marco Aurélio — estoicismo nas Meditações e a dicotomia do controle. Dilema: ansiedade com falha em produção; separe o que depende de você (revisar, monitorar, corrigir, avisar) do que não depende (pico de tráfego, humor do cliente).",
            "Boécio — Consolação da Filosofia, escrita na prisão: providência e destino. Dilema: teste determinístico com semente fixa e falha aleatória; distinguir plano, execução e acaso ajuda a pensar sem cair em fatalismo."
          ],
          ruleWhy: "Nomear o erro é pré-requisito para corrigi-lo. Sem vocabulário, repetimos o mesmo erro com palavras diferentes: chamamos de «sorte» o que era falta de controle e de «opinião» o que era apenas retórica.",
          physical: "Do incidente à decisão (camada operacional):\n\n  observação -> interpretação -> crença -> hábito -> ação -> consequência\n       |            |             |          |\n     Platão     Aristóteles   Marco Aurélio  Boécio\n\nPlatão ataca a interpretação precipitada; Aristóteles examina como convencemos e o que repetimos; Marco Aurélio recorta a ação controlável; Boécio pergunta se o resultado estava no plano ou no acaso.\n\nQuatro perguntas, um mesmo post-mortem.",
          example: "Cena: deploy falha às 2h da manhã.\n\nPlatão: «O painel mostra o que você escolheu medir. Confira o sistema, não só o painel.»\nAristóteles: «Explique com logos: qual evidência? E não transforme o incidente em show de ethos.»\nMarco Aurélio: «Você controla o rollback e o aviso; não controla o pico de tráfego.»\nBoécio: «Havia plano para isso? Se sim, foi destino cumprido; se não, foi acaso encontrando despreparo.»\n\nNenhuma das quatro vozes substitui o post-mortem: elas impedem que ele comece errado.",
          traps: [
            "Ler a alegoria da caverna como teoria de computação gráfica; é uma imagem sobre educação e aparência.",
            "Usar ethos/pathos/logos como «três tipos de verdade»; são modos de persuasão, não critérios de validade.",
            "Achar que estoicismo é frieza: dicotomia do controle não é negação de cuidado com os outros.",
            "Transformar Boécio em fatalismo: providência e destino são distinções conceituais, não desculpa para não testar."
          ],
          realWorld: [
            "Depuração: perguntar se o erro está no dado, na interpretação ou no modelo mental.",
            "Comunicação técnica: convencer pela autoridade, pelo medo ou pela evidência muda o resultado de uma reunião.",
            "Rotina de estudo: virtude como hábito explica por que vinte minutos diários vencem uma maratona ocasional."
          ],
          checks: [
            {
              q: "Na alegoria da caverna, o que representam as sombras?",
              options: [
                "Dados falsos inseridos por um atacante.",
                "Aparências tomadas por realidade por causa da nossa posição.",
                "Imagens geradas por um processador gráfico.",
                "As ideias perfeitas que o prisioneiro já conhece."
              ],
              correct: 1,
              hints: [
                "Pense na diferença entre ver algo e reconstruir o que o produziu.",
                "O problema é a posição do observador, não um erro de hardware.",
                "A alternativa B descreve a função da imagem."
              ]
            },
            {
              q: "Numa reunião, um colega convence pelo medo do prazo. Segundo Aristóteles, qual modo de persuasão ele usou?",
              options: [
                "Logos.",
                "Ethos.",
                "Pathos.",
                "Substância."
              ],
              correct: 2,
              hints: [
                "Um dos termos diz respeito ao caráter; outro, à emoção.",
                "Medo é emoção.",
                "A resposta é pathos."
              ]
            },
            {
              q: "Qual uso da dicotomia do controle é coerente com Marco Aurélio?",
              options: [
                "Ignorar o resultado porque só o resultado importa.",
                "Culpar o acaso por tudo que deu errado.",
                "Concentrar esforço na preparação e na resposta, reconhecendo o que não depende de nós.",
                "Evitar sentir qualquer coisa pelos colegas."
              ],
              correct: 2,
              hints: [
                "A distinção é sobre onde incide nossa ação, não sobre frieza.",
                "Preparação e resposta são nossas; tráfego e reação alheia, não.",
                "A alternativa C mantém responsabilidade sem onipotência."
              ]
            }
          ],
          alternative: {
            intro: "Não entendi — pense em quatro lentes de inspeção.",
            text: "A lente de Platão mostra o que você está tomando por realidade. A de Aristóteles mostra como você está convencendo alguém e se o hábito sustenta a competência. A de Marco Aurélio recorta o que é seu. A de Boécio separa o que veio do plano do que veio do acaso. Use uma de cada vez; usar todas ao mesmo tempo só embaralha a imagem.",
            diagram: "realidade? -> persuasão? -> controle? -> plano ou acaso?\n(Platão)     (Aristóteles)  (Marco Aurélio)  (Boécio)"
          },
          feynman: {
            prompt: "Escolha um dilema de estudo ou engenharia e explique como pelo menos dois destes pensadores ajudariam a pensá-lo. Use as palavras controle e hábito.",
            minChars: 30,
            keywords: ["controle", "hábito", "aparência", "evidência"]
          },
          summary: [
            "Platão e Aristóteles ajudam a separar aparência, persuasão e evidência.",
            "Marco Aurélio e Boécio ajudam a separar o que depende de nós do que veio do acaso ou do plano.",
            "Filosofia aqui é lente de depuração: melhora a pergunta, mas não substitui teste ou post-mortem."
          ],
          connection: "Próximo módulo → 14.4: quando a pergunta muda de natureza, entra a relação entre fé, razão e evidência."
        },
        exercises: [
          {
            q: "Um gráfico mostra latência média baixa, mas usuários relatam lentidão. Qual pergunta platônica ajuda?",
            options: [
              "O gráfico é falso por definição.",
              "A média é uma sombra: quais percentis e quais experiências não foram medidas?",
              "O usuário está mentindo.",
              "Platão não tem relação com métricas."
            ],
            answer: 1,
            explanation: "A lição da caverna aqui é perguntar o que a representação esconde. A média pode ser correta e ainda esconder a cauda lenta; o problema é tomar a imagem pelo sistema."
          },
          {
            q: "Em uma apresentação, o orador fala com autoridade, mas não mostra dados. Que modo de persuasão predomina?",
            options: [
              "Logos.",
              "Pathos.",
              "Ethos.",
              "Nenhum."
            ],
            answer: 2,
            explanation: "Ethos é o apelo ao caráter e à credibilidade de quem fala. Não é pecado usá-lo, mas confundi-lo com evidência é o erro que a aula destaca."
          },
          {
            q: "Por que a virtude como hábito é útil para quem estuda?",
            options: [
              "Porque uma maratona de doze horas é sempre melhor.",
              "Porque a competência se constrói por repetição estável, não por decisão isolada.",
              "Porque só pessoas virtuosas conseguem estudar.",
              "Porque hábito elimina a necessidade de revisão."
            ],
            answer: 1,
            explanation: "Aristóteles descreve virtude como disposição formada na prática repetida. Em estudo, isso vira rotina: sessões curtas e contínuas sustentam mais do que um esforço heroico único."
          },
          {
            q: "Durante uma falha em produção, qual atitude combina com Marco Aurélio?",
            options: [
              "Atribuir tudo ao destino e não agir.",
              "Exigir que o tráfego externo pare.",
              "Focar no rollback, na comunicação e na causa que está ao alcance, sem negar o imprevisto.",
              "Ignorar a equipe e trabalhar sozinho."
            ],
            answer: 2,
            explanation: "A dicotomia do controle recorta a ação possível: preparação, resposta e aviso. Ela não nega a existência do imprevisto nem transforma estoicismo em isolamento."
          },
          {
            q: "Como Boécio distinguiria plano e acaso num teste que falha apenas às vezes?",
            options: [
              "Dizendo que não existe acaso, só providência.",
              "Dizendo que o teste é sempre inútil.",
              "Perguntando se havia procedimento previsto para aquele cenário e separando falha aleatória de falta de preparo.",
              "Atribuindo a falha à vontade dos usuários."
            ],
            answer: 2,
            explanation: "Providência e destino, na discussão de Boécio, dizem respeito à ordem e à execução. Aplicados com cautela ao teste, ajudam a distinguir risco previsto de imprevisto — sem virar fatalismo."
          },
          {
            q: "Qual combinação está correta?",
            options: [
              "Platão — hábito; Aristóteles — caverna; Marco Aurélio — cinco vias.",
              "Platão — aparência; Aristóteles — persuasão e hábito; Marco Aurélio — controle; Boécio — plano e acaso.",
              "Aristóteles — controle; Boécio — alegoria da caverna; Platão — paradoxo.",
              "Marco Aurélio — aposta; Boécio — não-violência; Platão — histórico."
            ],
            answer: 1,
            explanation: "Cada lente tem uma função diferente. Misturar os rótulos é o tipo de erro que a prova de leitura deste módulo visa corrigir."
          }
        ],
        keywords: ["Platão", "Aristóteles", "Marco Aurélio", "Boécio", "caverna", "dicotomia do controle", "virtude", "providência"]
      },

      {
        id: "14.4",
        title: "Agostinho, Aquino, Pascal, Lewis + cientistas de fé",
        objective: "Diferenciar afirmações históricas, científicas, filosóficas e de fé, usando Agostinho, Aquino, Pascal, C. S. Lewis e biografias de cientistas sem hagiografia nem frases fabricadas.",
        duration: "75 min",
        lesson: {
          kicker: "Trilha 14 · Módulo 14.4 · Fé, razão e tipo de afirmação",
          track: "Literatura, Filosofia e Fé",
          title: "Agostinho, Aquino, Pascal, Lewis + cientistas de fé",
          hook: "Faraday e Maxwell tinham vida religiosa; Kelvin era um anglicano convicto; Lemaître era padre e cosmólogo. Isso é um fato biográfico interessante.\n\nNão é, porém, um atestado de que uma equação seja verdadeira por causa da fé de quem a escreveu — nem de que a fé fique menor porque uma estimativa foi corrigida. A pergunta deste módulo é: que tipo de afirmação estou fazendo agora?",
          intuition: "A honestidade intelectual aqui é uma triagem. Toda frase carrega um tipo: histórica (aconteceu?), empírica (pode ser testada?), filosófica (que argumento a sustenta?) ou de fé (que sentido ela tem numa comunidade?). Cada tipo tem regra de validação diferente. Rotular antes de concordar evita tanto a apologética ingênua quanto a crítica preguiçosa.",
          limit: "Esta analogia é útil para separar tipos de afirmação, mas falha em Y porque Z: uma pessoa pode viver fé e ciência de modo integrado, sem qualquer sensação de compartimento. Separar os tipos é ferramenta de análise, não tese sobre a vida interior de ninguém.",
          layers: [
            "Agostinho — Confissões: memória e tempo como experiência humana; graça como dom, não como conquista técnica. O ponto filosófico é que o tempo parece medido em nós, o que dificulta defini-lo.",
            "Aquino — Suma Teológica: as cinco vias são argumentos filosóficos a partir de observações (movimento, causalidade, contingência, gradação, ordem). São debatidos; não são medida de laboratório nem «prova absoluta».",
            "Pascal — Pensamentos: a aposta é um argumento prático sobre risco e benefício, não uma demonstração da existência de Deus. A frase «o coração tem razões que a razão não conhece» é atribuída a ele na tradução corrente; aqui vai sem número de fragmento, porque não foi conferida.",
            "C. S. Lewis — Cronistas de Nárnia: mundo alternativo como imaginação a serviço da apologética; defesa razoada da fé, não relatório empírico.",
            "Cientistas de fé — Faraday (ambiente metodista/sandemaniano), Maxwell (formação religiosa e prática de fé), Kelvin (anglicano convicto; a estimativa da idade da Terra foi corrigida depois), Lemaître (padre e proponente da hipótese do átomo primitivo). Contexto biográfico, não selo de garantia."
          ],
          ruleWhy: "Sem separar os tipos de afirmação, cometemos dois erros simétricos: transformar fé em «prova científica» e transformar ciência em «ameaça à fé». Ambos empobrecem a conversa e, na prática, produzem más decisões públicas.",
          physical: "Três trilhas de validação (não se somam como se fossem a mesma moeda):\n\n  ciência: pergunta observável -> hipótese -> teste -> resultado revisável\n  fé: experiência e tradição -> interpretação -> discernimento na comunidade\n  história: documento -> contexto -> corroboração\n\nErro típico: cruzar as setas e anunciar que uma provou a outra.\n\nA ciência pode descrever como o cosmos evoluiu; por si só, não diz o que isso significa para a vida moral. A interpretação é outra camada — e deve dizer que é interpretação.",
          example: "Classifique antes de concordar:\n\n1. «Lemaître era sacerdote católico e cosmólogo.» -> fato histórico, verificável.\n2. «A expansão do universo é descrita por modelos cosmológicos.» -> afirmação científica, revisável.\n3. «O Big Bang prova o Gênesis.» -> salto de camada: interpretação teológica apresentada como resultado de laboratório.\n4. «A aposta de Pascal mostra que crer é sempre vantajoso.» -> argumento filosófico, com premissas e críticas conhecidas.\n\nO ponto não é escolher um lado; é rotular a moeda antes de gastá-la.",
          traps: [
            "Hagiografia: «era religioso, logo estava certo». Kelvin errou a idade da Terra; isso é parte da história, não detalhe a esconder.",
            "Quote mining: atribuir frases a cientistas sem fonte; uma frase bonita não vira dado.",
            "Deus das lacunas: usar o que a ciência ainda não explica como prova imediata de Deus; a lacuna pode fechar.",
            "Tratar as cinco vias como experimento ou a aposta como demonstração matemática da existência divina.",
            "Apresentar uma frase de Pascal ou Lewis com número de página inventado: pior do que dizer «não conferi»."
          ],
          realWorld: [
            "Comunicação pública: dizer «a ciência provou minha fé» desacredita a ciência e a fé quando o dado muda.",
            "Política de tecnologia: valores religiosos podem motivar uma pessoa; uma norma pública precisa de razões que outros cidadãos possam examinar.",
            "Estudo: manter um caderno de «tipo de afirmação» evita citar um artigo como texto sagrado — ou o contrário."
          ],
          checks: [
            {
              q: "«Lemaître era padre e cosmólogo». Que tipo de afirmação é essa?",
              options: [
                "Afirmação científica sobre o Big Bang.",
                "Afirmação histórica, verificável por documento biográfico.",
                "Afirmação de fé sobre a criação.",
                "Demonstração matemática."
              ],
              correct: 1,
              hints: [
                "Pergunte o que seria necessário para conferir.",
                "Aqui basta um registro biográfico confiável.",
                "Não é uma frase sobre o modelo cosmológico em si."
              ]
            },
            {
              q: "Como as cinco vias de Aquino devem ser apresentadas com cuidado?",
              options: [
                "Como cinco experimentos de laboratório.",
                "Como provas absolutas que ninguém pode questionar.",
                "Como argumentos filosóficos a partir de observações, sujeitos a debate.",
                "Como citações literárias de O Homem Eterno."
              ],
              correct: 2,
              hints: [
                "A palavra-chave é «argumento», não «medição».",
                "Argumento tem premissas e pode ser criticado.",
                "A alternativa C respeita o estatuto filosófico."
              ]
            },
            {
              q: "Qual afirmação comete um erro de categoria?",
              options: [
                "Modelos cosmológicos descrevem a expansão do universo.",
                "Lemaître era sacerdote e publicou trabalho cosmológico.",
                "A aposta de Pascal é um argumento prático, não uma medida.",
                "O Big Bang prova cientificamente o relato do Gênesis."
              ],
              correct: 3,
              hints: [
                "Procure a frase que troca resultado de teste por interpretação teológica.",
                "Uma coisa é descrever a evolução do cosmos; outra é extrair sentido religioso dela.",
                "A alternativa D anuncia como prova o que é interpretação."
              ]
            }
          ],
          alternative: {
            intro: "Não entendi — pense em três selos carimbados em cada frase.",
            text: "Selo azul: é histórico — alguém pode ir ao arquivo conferir. Selo verde: é científico — há método, teste e possibilidade de revisão. Selo dourado: é fé ou interpretação — pertence a uma comunidade de sentido e não se mede com régua. Uma frase pode ter mais de um selo, mas precisa dizer qual está usando naquele momento. O erro clássico é carimbar de verde uma frase dourada porque ela soa bem num laboratório.",
            diagram: "[AZUL] arquivo   [VERDE] método+teste   [DOURADO] fé+sentido\nmesmo autor pode usar os três — nunca no mesmo argumento sem aviso"
          },
          feynman: {
            prompt: "Explique por que o fato de Lemaître ser padre não torna a hipótese do átomo primitivo uma questão de fé, e por que isso também não diminui sua fé. Use as palavras evidência e interpretação.",
            minChars: 30,
            keywords: ["evidência", "interpretação", "fé", "histórico"]
          },
          summary: [
            "Agostinho, Aquino, Pascal e Lewis trabalham memória, argumento, aposta e imaginação apologética — cada um com seu estatuto.",
            "Biografias religiosas de cientistas são contexto histórico, não prova científica nem garantia de acerto.",
            "Separar tipos de afirmação evita tanto o «a ciência provou minha fé» quanto o «a fé invalida o dado»."
          ],
          connection: "Fim da Trilha 14 → volte ao ciclo FORGE: estudar, praticar, registrar erros e revisar no momento exato. Aqui, «erro» também pode ser uma frase atribuída a quem nunca a disse."
        },
        exercises: [
          {
            q: "«Lemaître era sacerdote católico e cosmólogo». Como classificar essa afirmação?",
            options: [
              "Como resultado de um experimento.",
              "Como fato histórico verificável.",
              "Como expressão de fé pessoal do leitor.",
              "Como prova de que o Big Bang é verdadeiro."
            ],
            answer: 1,
            explanation: "É um dado biográfico: pode ser conferido em fontes históricas. Não é, por si, nem evidência cosmológica nem interpretação teológica — é importante dizer qual camada se está usando."
          },
          {
            q: "As cinco vias de Aquino devem ser entendidas como:",
            options: [
              "Medições repetidas em laboratório.",
              "Argumentos filosóficos debatíveis a partir de observações.",
              "Profecias sobre o fim do universo.",
              "Citações literárias sem pretensão de argumento."
            ],
            answer: 1,
            explanation: "As vias partem de observações comuns (movimento, causa, contingência, gradação, ordem) e argumentam a partir delas. Apresentá-las como «prova absoluta» é exagerar o estatuto que a própria Suma lhes dá."
          },
          {
            q: "A aposta de Pascal é, corretamente, um argumento:",
            options: [
              "Empírico, com dados medidos.",
              "Matemático que demonstra a existência de Deus.",
              "Prático, sobre risco e benefício, com premissas discutíveis.",
              "Histórico sobre a vida de Pascal."
            ],
            answer: 2,
            explanation: "Pascal apresenta uma razão prudente para crer, não uma prova. Críticas clássicas apontam que a formulação depende de premissas sobre qual crença seria recompensada — por isso é argumento, não demonstração."
          },
          {
            q: "Qual afirmação separa indevidamente o que é ciência e o que é fé?",
            options: [
              "Lemaître era padre e formulou uma hipótese cosmológica.",
              "Modelos do Big Bang são revisáveis como qualquer modelo científico.",
              "O Big Bang prova cientificamente o relato do Gênesis.",
              "Agostinho escreveu sobre memória e tempo nas Confissões."
            ],
            answer: 2,
            explanation: "A opção C apresenta uma interpretação teológica como se fosse resultado de laboratório. É o erro de categoria que este módulo pede identificar — nos dois sentidos da crítica."
          },
          {
            q: "Por que a correção da estimativa de Kelvin sobre a idade da Terra é um exemplo útil?",
            options: [
              "Porque mostra que religiosidade imuniza contra erro.",
              "Porque mostra que religiosidade é incompatível com ciência.",
              "Porque mostra que convicção pessoal não protege uma estimativa de ser corrigida por novos dados.",
              "Porque prova que a Terra tem exatamente a idade que Kelvin calculou."
            ],
            answer: 2,
            explanation: "Kelvin era homem de fé e errou por não conter certos processos então desconhecidos; a correção veio com a radioatividade. O caso é um antídoto contra hagiografia e também contra a ideia de que fé e ciência precisam brigar."
          },
          {
            q: "Como descrever C. S. Lewis e Nárnia com precisão?",
            options: [
              "Um relatório de observação de outro mundo.",
              "Um mundo alternativo construído pela imaginação, usado como apologética.",
              "Um tratado de física disfarçado de ficção.",
              "Uma biografia autorizada da vida de Lewis."
            ],
            answer: 1,
            explanation: "Nárnia é mundo inventado; sua função é literária e apologética. Chamá-la de observação empírica é trocar gênero — o mesmo tipo de erro que a prova de leitura do módulo 14.2 corrige."
          }
        ],
        keywords: ["Agostinho", "Aquino", "Pascal", "C. S. Lewis", "Lemaître", "aposta", "cinco vias", "apologética", "evidência"]
      }
    ]
  };
})();

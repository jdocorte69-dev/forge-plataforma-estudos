# Metodologias de aprendizagem com respaldo em pesquisa

Este arquivo é a base teórica da Fase 5 e a fonte única para a geração posterior do guia em PDF. Ele não substitui a leitura dos artigos citados: cada síntese aqui é uma tradução didática, com exemplos criados para este projeto.

## Como ler cada entrada

Todas as metodologias seguem a mesma ordem: definição, evidência, aplicação em matemática e linguagem C, erro comum e sinal de que a técnica está funcionando. A seção "Evidência" distingue três níveis de segurança, sem transformar metáfora em dado:

- **Alta:** revisões sistemáticas ou metanálises com replicação parcial em contextos diferentes.
- **Média:** efeitos experimentais robustos, mas com variação conforme conteúdo, idade e duração.
- **Em discussão:** achados promissores, com dependência forte de contexto ou divergência entre estudos.

Números aparecem apenas de forma aproximada e sempre com a fonte indicada. Quando uma afirmação é uma recomendação prática deste projeto — e não um resultado de pesquisa — ela é apresentada como tal.

A estudante fictícia usada nos exemplos é Marina, que prepara ENEM e ITA enquanto trabalha. Ela estuda funções, matrizes e ponteiros em C; seu caderno de erros e suas revisões nos dias 1, 3, 7, 16 e 35 servem de fio condutor.

---

## 1. Prática de Recuperação (Retrieval Practice)

**O que é.** Abrir a mente e tentar reconstruir uma informação sem consultar a fonte. Não é "reler com atenção": é produzir a resposta antes de ver o gabarito. O esforço de evocação é o mecanismo, não o resultado final.

**Evidência.** Roediger e Karpicke (2006) mostraram que testes sem nota aumentaram a retenção em prova posterior em comparação com releitura; Karpicke e Roediger (2008) reforçaram que a recuperação, e não apenas a exposição repetida, é o que altera a retenção. Dunlosky e colaboradores (2013) classificaram a prática de testes como uma das técnicas com maior utilidade prática entre as dez avaliadas. Nível: alta.

**Como aplicar em matemática/C.**
- Feche o livro e derive a fórmula da área do trapézio a partir de dois triângulos; só depois confira a expressão.
- Em C, escreva em papel o corpo de `malloc` + verificação de `NULL` + `free`, de memória, antes de abrir o editor.
- Marina usa cartões de memória (flashcards) com perguntas do tipo "por que `int *p` e `*p` não são a mesma coisa?", nunca com frases para completar passivamente.

**Erro comum.** Transformar o cartão em reconhecimento: "eu sei que essa resposta está certa quando a vejo". Reconhecer não é recuperar. Outro erro é consultar a resposta após dois segundos de dúvida, cortando justamente o esforço útil.

**Indicador de que está funcionando.** Marina erra mais cartões do que esperava na primeira passagem e acerta os mesmos cartões com menos hesitação nas passagens seguintes. A queda temporária da nota no treino é compatível com ganho de retenção; a subida na prova sem consulta é o sinal decisivo.

---

## 2. Repetição Espaçada (Spaced Repetition)

**O que é.** Distribuir as revisões ao longo do tempo em vez de concentrá-las em uma noite. A ideia é revisar quando o traço de memória já enfraqueceu o suficiente para tornar a recuperação custosa, mas antes do esquecimento completo.

**Evidência.** Ebbinghaus (1885) descreveu a curva do esquecimento; Cepeda e colaboradores (2006), em revisão quantitativa, encontraram vantagem da prática distribuída sobre a massificada na maior parte dos estudos analisados. Dunlosky e colaboradores (2013) também ranquearam a prática distribuída entre as técnicas mais úteis. Nível: alta para retenção de fatos; média para habilidades complexas.

**Como aplicar em matemática/C.**
- Sequência adotada por Marina: dia 1 (aprendiz), 3, 7, 16 e 35. Em cada retorno ela resolve um problema novo do mesmo tipo, não o antigo decorado.
- Em C, o cartão "diferença entre pilha (stack) e monte (heap)" volta em 1, 3, 7, 16 e 35 dias; a cada retorno ela escreve um exemplo de código diferente.
- A escala é uma convenção do projeto, não uma lei: se o conteúdo é mais difícil, encurte o primeiro intervalo; se é fácil, alongue o quarto.

**Erro comum.** Revisar tudo todos os dias e chamar isso de repetição espaçada. Revisão diária de tudo é massificação com outro nome. Também é erro adiar a primeira revisão por uma semana quando o aluno ainda não fluente no pré-requisito.

**Indicador de que está funcionando.** A porcentagem de acertos no retorno do dia 7 é menor que a do dia 3, mas a do dia 16 se recupera sem releitura prévia. O custo por cartão cai com o tempo, enquanto o número de cartões pendentes permanece estável.

---

## 3. Intercalação (Interleaving)

**O que é.** Misturar tipos diferentes de problemas dentro de uma mesma sessão, em vez de resolver uma longa fileira do mesmo tipo. O contraste entre casos obriga o cérebro a escolher o método, e essa escolha é parte do aprendizado.

**Evidência.** Rohrer e Taylor (2007) encontraram melhora na aprendizagem de matemática quando os problemas eram embaralhados, embora o desempenho imediato durante o treino fosse pior. Dunlosky e colaboradores (2013) tratam a intercalação como promissora, com ressalvas de contexto. Nível: média-alta.

**Como aplicar em matemática/C.**
- Marina monta um bloco com problemas de limites, matrizes e probabilidade em ordem sorteada; antes de resolver, ela escreve qual técnicas usará e por quê.
- Em C, intercale exercícios de ponteiros, alocação dinâmica e manipulação de strings em vez de fazer 20 seguidos de `malloc`.
- A regra prática: intercale *categorias* dentro do mesmo tema amplo. Misturar C com literatura no mesmo bloco só aumenta a troca de contexto.

**Erro comum.** Achar que a aula está "pior" porque o aluno erra mais durante a prática intercalada. O desempenho imediato é esperado; a vantagem aparece no teste posterior. Outro erro é intercalar antes de o aluno ter um esqueleto de solução para cada categoria.

**Indicador de que está funcionando.** Marina começa a justificar a escolha da técnica antes de calcular e para de depender do título da lista para saber o que fazer. Num simulado com questões mistas, o número de erros por "escolha errada de método" cai.

---

## 4. Prática Deliberada (Deliberate Practice)

**O que é.** Treino com objetivo estreito, feedback imediato e repetição ajustada à borda da competência atual. Não é contar horas: é atacar repetidamente o submódulo que ainda falha.

**Evidência.** Ericsson, Krampe e Tesch-Römer (1993) associaram a qualidade do treino deliberado ao desempenho em domínios estruturados como música e xadrez. Ericsson e colaboradores (2006) sistematizaram a ideia. Nível: média-alta em domínios com feedback confiável; a tradução para sala de aula é debatida.

**Como aplicar em matemática/C.**
- Marina separa "erro de conceito", "erro de cálculo" e "erro de leitura" no caderno. O treino de hoje ataca só a maior categoria da semana.
- Em C, quando o erro é sempre esquecer `free`, ela não faz mais dez exercícios novos: escreve cinco funções curtas e verifica cada uma com um sanitizador de memória (memory sanitizer).
- Cada sessão termina com uma micro-meta observável: "hoje quero acertar 8 de 10 questões de indução sem olhar a hipótese".

**Erro comum.** Confundir repetição com prática deliberada: resolver apenas o que já sai bem produz sensação de produtividade e zero ajuste. Também é erro treinar sem feedback, repetindo o mesmo procedimento errado.

**Indicador de que está funcionando.** O tipo de erro dominante muda de uma semana para outra. Marina passa de "erro de sinal na derivada" para "erro de interpretação do enunciado": a borda da competência avançou.

---

## 5. Ilusão de Competência (Illusion of Competence)

**O que é.** A diferença entre sentir que se sabe e conseguir demonstrar que se sabe. Releitura, sublinhado e assistir a videoaulas geram fluência momentânea, que o cérebro interpreta como domínio.

**Evidência.** Dunlosky e colaboradores (2013) mostraram que técnicas populares como reler e sublinhar têm baixa utilidade comparadas a testes e espaçamento. Koriat e colaboradores, em trabalhos sobre julgamento de aprendizagem, descrevem como pistas de fluência influenciam a confiança. Nível: alta para a direção do efeito; a magnitude varia.

**Como aplicar em matemática/C.**
- Marina aplica o "teste antes da aula": tenta resolver três questões do capítulo antes de assistir à explicação e registra o que não sabia. Depois compara com o que imaginava saber.
- Em C, antes de compilar, ela tenta prever a saída de um programa com ponteiros. A previsão escrita é o antídoto contra a leitura confortável do código.
- Ao terminar uma videoaula, ela fecha a aba e escreve três perguntas que o vídeo respondia. Se não consegue formular as perguntas, a fluência era do vídeo, não dela.

**Erro comum.** Usar o rearranjo de anotações como prova de estudo. Copiar a fórmula bonito não é recuperação. Também é erro medir progresso por horas de tela em vez de erros corrigidos.

**Indicador de que está funcionando.** A confiança de Marina fica temporariamente abaixo do desempenho real: ela diz "achei que sabia menos do que sei". Essa assimetria é mais saudável que o inverso.

---

## 6. Dificuldades Desejáveis (Desirable Difficulties)

**O que é.** Introduzir, de propósito, obstáculos moderados que reduzem o desempenho imediato mas aumentam a retenção e a transferência. Espaçamento, intercalação e recuperação são instâncias dessa ideia.

**Evidência.** Bjork (1994) descreveu a distinção entre condições que melhoram o desempenho durante o treino e condições que melhoram a aprendizagem duradoura; Bjork e Bjork (2011) retomaram o tema. Nível: média-alta como princípio; a dificuldade útil tem limite e pode virar sobrecarga.

**Como aplicar em matemática/C.**
- Marina troca o enunciado rotineiro por uma versão com dado irrelevante e precisa decidir o que descartar.
- Em C, ela resolve um exercício com restrição extra: "sem usar biblioteca pronta para inverter a string". A restrição força reconstruir o algoritmo.
- A dosagem é gradual: aumente a dificuldade apenas quando a taxa de acerto no treino estiver confortável, nunca no dia da primeira exposição.

**Erro comum.** Aplicar dificuldade antes de o aluno ter esqueleto conceitual. Dificuldade sem estrutura é frustração, não aprendizado. Também é erro manter o obstáculo depois que a competência já se estabilizou.

**Indicador de que está funcionando.** Durante o treino Marina erra e reclama um pouco; dois dias depois ela resolve a versão original com mais rapidez e sem consultar. O desconforto aparece no treino, a recompensa aparece na transferência.

---

## 7. Autoexplicação (Self-Explanation)

**O que é.** Explicar a própria cadeia de raciocínio enquanto se estuda um exemplo, conectando cada passo a um princípio já conhecido. É diferente de copiar a solução: exige dizer *por que* cada linha é válida.

**Evidência.** Chi e colaboradores (1989) observaram que alunos que geravam autoexplicações ao estudar exemplos resolviam melhor problemas novos; a revisão de Dunlosky e colaboradores (2013) também cita a autoexplicação como técnica promissora. Nível: média-alta.

**Como aplicar em matemática/C.**
- Ao ler uma demonstração, Marina escreve no marginálio: "aqui usamos continuidade porque..."; "este passo não usaria o mesmo argumento se o intervalo fosse aberto".
- Em C, depois de compilar, ela anota linha por linha o estado das variáveis em um ponto de parada do depurador (debugger).
- Regra de ouro: explicar a transição entre passos, não descrever o passo. "Somei 2" é descrição; "somei 2 para completar o quadrado" é explicação.

**Erro comum.** Explicar em voz alta lendo o texto em voz alta. Se a explicação depende de olhar o gabarito, ela é paráfrase, não autoexplicação.

**Indicador de que está funcionando.** Marina consegue apontar qual hipótese do teorema sustenta cada linha. Quando uma hipótese é removida pelo professor, ela prevê qual passo quebra.

---

## 8. Efeito Feynman (Feynman Effect / Learning by Teaching)

**O que é.** Explicar o conteúdo com linguagem simples, como se ensinasse alguém sem o vocabulário técnico. A simplificação força a revelar lacunas que o jargão escondia.

**Evidência.** A atribuição a Richard Feynman é popularizada por relatos biográficos, mas o respaldo empírico mais direto vem de pesquisas sobre ensinar para aprender e sobre explicações ao outro. Nível: em discussão como "efeito" específico; alta como prática de recuperação + autoexplicação combinadas.

**Como aplicar em matemática/C.**
- Marina explica derivada usando o velocímetro de uma bicicleta e depois explica ponteiro usando oendereço de uma gaveteiro comum.
- A síntese em FORGE exige uma analogia e um exemplo criados por ela, com no mínimo 30 caracteres, sem copiar frases da fonte.
- Teste prático: se a explicação dura mais de dois minutos e ainda precisa de uma sigla não definida, ela não está pronta.

**Erro comum.** Decorar uma explicação pronta e recitá-la. Isso é performance, não ensino. Outro erro é explicar só o caso fácil e fugir do contraexemplo.

**Indicador de que está funcionando.** Marina para no meio da explicação e volta ao livro para entender um detalhe que até então parecia óbvio. Essa interrupção é o ganho.

---

## 9. Metacognição (Metacognition)

**O que é.** Monitorar e regular o próprio aprendizado: planejar, acompanhar e ajustar. Em termos operacionais, é responder "o que eu sei, o que não sei e qual estratégia uso agora?".

**Evidência.** Flavell introduziu o termo; Koriat e colaboradores mostraram que julgamentos de confiança são imperfeitos e sensíveis a pistas de fluência; Bjork (1994) discutiu a dificuldade de regular a aprendizagem quando o desempenho imediato engana. Nível: alta para a existência do efeito; média para treinos que melhoram a precisão do julgamento.

**Como aplicar em matemática/C.**
- Marina preenche, antes da prova prática, uma previsão de nota por tópico. Depois compara previsão e resultado; a diferença é o dado mais valioso da sessão.
- Ela mantém uma coluna "certeza" de 0 a 3 em cada cartão. Cartões com certeza 3 e resposta errada ganham prioridade máxima na revisão.
- Ao fim da semana, escolhe o próximo bloco com base no erro dominante, não no que "dá vontade".

**Erro comum.** Confundir tempo estudado com aprendizado e usar essa métrica para autorizar a pausa. Outro erro é só avaliar depois da prova, quando já não há como ajustar.

**Indicador de que está funcionando.** A previsão de nota se aproxima da nota real em duas ou três sessões. Marina passa a dizer "sei resolver, mas não sei explicar quando cai", um diagnóstico fino que antes não existia.

---

## 10. Teoria da Carga Cognitiva (Cognitive Load Theory)

**O que é.** Modelo de Sweller segundo o qual a memória de trabalho tem capacidade limitada. A instrução deve economizar esse recurso: reduzir o esforço gasto com o formato, carga irrelevante (extraneous load), e reservar o recurso para o conteúdo, carga intrínseca (intrinsic load) e carga germânica (germane load).

**Evidência.** Sweller (1988) formulou a ideia a partir de problemas de resolução de problemas; Baddeley (1992) descreveu o modelo de memória de trabalho que a sustenta; Miller (1956) é antecedente clássico sobre limites de processamento. Sweller, Ayres e Kalyuga (2011) consolidaram a teoria. Nível: alta como arcabouço; a separação exata entre os tipos de carga é debatida.

**Como aplicar em matemática/C.**
- Marina estuda um teorema por vez, com os pré-requisitos já automatizados: tentar indução sem dominar álgebra é pagar duas contas ao mesmo tempo.
- Em C, ela usa um rascunho de papel com o estado das variáveis antes de depurar no computador. O papel libera memória de trabalho para a lógica.
- Em textos, ela evita diagramas decorativos e prefere um único esquema com setas e legenda curta.

**Erro comum.** "Simplificar demais": retirar o esforço necessário e transformar o material entretenimento. Carga reduzida não é ausência de desafio; é desafio dirigido ao conceito.

**Indicador de que está funcionando.** Marina consegue acompanhar a mesma demonstração sem precisar reler o começo. Quando trava, ela aponta a etapa exata em que o pré-requisito faltou. O diagnóstico fica registrado no caderno de erros.

---

## 11. Sono e Consolidação da Memória (Sleep and Memory Consolidation)

**O que é.** Processos de estabilização e reorganização de traços de memória que ocorrem durante o sono, especialmente em estágios de sono profundo e sono REM (rapid eye movement).

**Evidência.** Walker e Stickgold (2006) revisaram a relação entre sono, memória e plasticidade. Estudos clássicos de reposição de sono mostram prejuízo em tarefas de atenção e memória; a tradução para "dormir depois de estudar melhora nota" depende do tipo de conteúdo. Nível: média-alta para consolidação; em discussão para efeitos grandes e imediatos em provas.

**Como aplicar em matemática/C.**
- Marina estuda o bloco mais difícil no fim da tarde e faz uma recuperação curta de 5 minutos antes de dormir, sem abrir o material depois disso.
- Ela evita decidir a ordem da prova no mesmo dia em que dormiu menos de seis horas: prioriza tarefas mecânicas nesses dias.
- O ciclo dia 1 → sono → dia 3 é parte da sequência de revisões deste projeto, não um slogan motivacional.

**Erro comum.** "Maratonar" a noite anterior à prova. A perda de sono e a ausência de recuperação espalhada competem com o ganho de horas extras.

**Indicador de que está funcionando.** Depois de uma noite regular, Marina recupera com mais facilidade o que estudou no dia anterior e comete menos erros de atenção em questões longas.

---

## 12. Exercício Físico e Aprendizagem (Physical Exercise and Learning)

**O que é.** Efeitos da atividade física aguda e crônica sobre função executiva, atenção, humor e plasticidade cerebral.

**Evidência.** Erickson e colaboradores (2011) relataram aumento de volume hipocampal e melhora de memória após treino aeróbico em adultos; revisões posteriores sugerem efeitos modestos e heterogêneos. Nível: média; o efeito sobre cognição é real, mas não substitui prática de recuperação.

**Como aplicar em matemática/C.**
- Marina caminha 20 minutos antes do bloco de resolução de problemas, não depois da maratona, e usa esse tempo para decidir a meta da sessão.
- Em dias de simulado, ela intercala 5 minutos de movimento leve na pausa longa, em vez de rolar o celular.
- Caminhada com "pergunta pendente" funciona como pausa ativa: ela leva uma dúvida específica e volta com uma hipótese.

**Erro comum.** Tratar exercício como "pausa produtiva obrigatória" e transformá-lo em mais uma meta a cumprir. Também é erro esperar que ele compense sono insuficiente.

**Indicador de que está funcionando.** A sessão seguinte à caminhada começa com menos resistência e menor contagem de distrações registradas. O efeito aparece no início do bloco, não no total de horas.

---

## 13. Procrastinação (Procrastination)

**O que é.** Adiar uma ação pretendida apesar de prever consequências ruins, geralmente para regular o humor no curto prazo. Não é preguiça nem falta de informação sobre o que fazer.

**Evidência.** Steel (2007) revisou a literatura e caracterizou a procrastinação como falha de autorregulação; Sirois e Pychyl (2013) argumentaram que a prioridade é o alívio emocional imediato. Nível: alta para o modelo emocional; a intensidade varia muito entre pessoas.

**Como aplicar em matemática/C.**
- Marina não escreve "estudar cálculo". Escreve "resolver a questão 4 de limites e anotar o erro". A ação específica reduz o custo emocional de começar.
- Quando abre o editor de C e trava, ela começa pelo comentário descrevendo o que a função deve fazer; escrever o contrato vem antes de escrever o código.
- O caderno de erros fica aberto na mesa: começar pela correção de um erro antigo é mais fácil que começar um capítulo novo.

**Erro comum.** Esperar "estar com vontade" para começar. A motivação costuma aparecer depois do início, não antes. Outro erro é combater o adiamento com culpa, que aumenta o custo emocional da tarefa.

**Indicador de que está funcionando.** O intervalo entre "hora de começar" e "primeira linha escrita" cai de dezenas de minutos para poucos minutos, mesmo em dias em que a vontade não aparece.

---

## 14. Intenções de Implementação (Implementation Intentions)

**O que é.** Planos condicionais do tipo "se acontecer X, então faço Y". Em vez de depender de decisão no momento, o comportamento é disparado pelo contexto.

**Evidência.** Gollwitzer (1999) propôs o conceito; Gollwitzer e Sheeran (2006) sintetizaram efeitos em metanálise sobre alcance de metas. Nível: alta para metas simples e específicas; menor quando a situação é ambígua ou a tarefa é muito complexa.

**Como aplicar em matemática/C.**
- "Se eu fechar o almoço, então abro o caderno de erros e corrijo um cartão antes de qualquer mensagem."
- "Se o compilador acusar erro de segmentação, então escrevo o estado dos ponteiros no papel antes de mexer no código."
- Marina escreve no máximo quatro planos por semana. Muitos planos concorrentes viram lista de desejos.

**Erro comum.** Planos vagos ("se eu tiver tempo, estudo"). A condição precisa ser observável e o comportamento, executável em menos de dois minutos.

**Indicador de que está funcionando.** Marina percebe que iniciou a rotina sem negociar internamente. Quando o plano falha, ela consegue nomear qual gatilho não aconteceu e ajusta o plano, não a si mesma.

---

## 15. Técnica Pomodoro (Pomodoro Technique)

**O que é.** Organizar o trabalho em blocos curtos e fixos, com pausas curtas entre eles e pausa maior após um grupo de blocos. A convenção popular usa aproximadamente 25 minutos de trabalho e 5 de pausa.

**Evidência.** O método é difundido por Cirillo e não foi desenvolvido como protocolo experimental. A literatura sobre pausas e recuperação da atenção apoia a ideia geral de alternância; a duração exata de 25 minutos não tem respaldo especial. Nível: em discussão como protocolo; alta para o princípio de limitar sessões e fazer pausas.

**Como aplicar em matemática/C.**
- Marina usa 25/5 para questões e 50/10 para leitura densa de demonstração; o timer serve para iniciar, não para interromper uma linha de raciocínio no meio.
- Pausa curta é levantar, olhar longe e caminhar. Não é abrir feed de notícias.
- A cada quatro blocos, pausa longa e registro de uma frase: "o que ficou resolvido hoje?".

**Erro comum.** Transformar o timer em meta e parar no apito mesmo com a prova em andamento. Outro erro é usar Pomodoro para tarefas que exigem imersão longa e contínua, como depurar uma falha de concorrência.

**Indicador de que está funcionando.** Marina inicia blocos com menos atrito e encerra com um registro escrito. O número de blocos é estável; o que cresce é a quantidade de erros corrigidos por bloco.

---

## 16. Limites da Multitarefa (Limits of Multitasking)

**O que é.** A troca rápida entre tarefas cobra um custo de reconfiguração da atenção. O cérebro não processa duas tarefas exigentes ao mesmo tempo; ele alterna, e cada alternância deixa resíduo atencional.

**Evidência.** Ophir, Nass e Wagner (2009) encontraram diferenças de controle atencional em pessoas que relatam muita multitarefa com mídia; estudos de troca de tarefas documentam custos de alternância. Nível: média-alta para o custo de alternância; a causalidade em estudos observacionais é mais frágil.

**Como aplicar em matemática/C.**
- Marina mantém uma única aba de código e um único caderno abertos. Notificações ficam fora do ambiente durante o bloco.
- Ela agrupa tarefas administrativas (responder mensagens, atualizar planilha) em um bloco separado, no fim da rotina.
- Quando uma dúvida de outra disciplina aparece, ela anota em "parque de ideias" e volta depois, em vez de mudar de assunto na hora.

**Erro comum.** Declarar que é "multitarefa nativa" e usar isso como justificativa para checar o celular a cada minuto. O erro oposto também existe: proibir qualquer pausa e sacrificar a recuperação.

**Indicador de que está funcionando.** Marina termina o bloco com a sensação de ter percorrido um caminho único. O parque de ideias cresce, mas não interrompe a sequência de trabalho.

---

## 17. Mentalidade de Crescimento (Growth Mindset)

**O que é.** Crença de que a competência pode ser desenvolvida por esforço estratégico, feedback e tempo. O oposto é a crença em habilidade fixa, que incentiva evitar desafios que ameacem a autoimagem.

**Evidência.** Dweck e Leggett (1988) formularam a distinção entre metas de desempenho e metas de aprendizagem; Dweck (2006) popularizou o conceito. Intervenções breves têm resultados mistos e pequenos em replicações amplas. Nível: média para efeitos gerais; em discussão para programas rápidos de uma única palestra.

**Como aplicar em matemática/C.**
- Marina troca a meta "tirar 90" por "explicar por que errei estes três tipos de questão". A primeira é meta de desempenho (performance goal); a segunda é meta de aprendizagem (learning goal).
- Depois de um simulado ruim, ela escreve uma frase sobre a estratégia que vai mudar, não sobre sua capacidade.
- Em C, o compilador é tratado como feedback, não como veredito.

**Erro comum.** Usar o rótulo "growth mindset" como elogio vazio ("você é tão resiliente"). Elogiar esforço sem apontar estratégia incentiva repetir o método que falhou.

**Indicador de que está funcionando.** Marina escolhe uma questão difícil no início do bloco, quando poderia começar pela fácil. Seu caderno registra mudanças de estratégia, não apenas notas.

---

## 18. Didática da Matemática (Mathematics Education)

**O que é.** Estudo de como conceitos matemáticos são compreendidos e comunicados. Dois aportes clássicos aqui: a distinção entre compreensão relacional e instrumental, de Skemp, e a noção de imagem conceitual (concept image), de Tall e Vinner.

**Evidência.** Skemp (1976) descreveu a diferença entre saber aplicar um procedimento e entender a rede de relações que o justifica. Tall e Vinner (1981) mostraram que o que o aluno entende por "limite" pode divergir da definição formal que ele consegue recitar. Nível: alta como descrição de fenômeno didático; tradução direta em ganho de nota depende da intervenção. A tradução em FORGE passa pelo campo de síntese e pelo caderno de erros.

**Como aplicar em matemática/C.**
- Marina sempre pede duas representações: uma algébrica e uma visual ou narrativa. Para matriz, escreve a matriz e desenha a transformação do quadrado unitário.
- Antes de usar uma definição, ela lista um exemplo que cabe e um contraexemplo que não cabe.
- Em C, ela conecta a ideia de função matemática à função que retorna valor, e discute onde a analogia quebra (efeitos colaterais).

**Erro comum.** Ensinar a regra antes do problema que a torna necessária. O aluno decora o procedimento e não consegue reconhecê-lo disfarçado em outro enunciado.

**Indicador de que está funcionando.** Marina resolve um problema com dados invertidos e explica a ideia sem usar a palavra que o professor usou. A definição formal passa a ser o último passo, não o primeiro.

---

## 19. Didática da Computação (Computing Education)

**O que é.** Estudo de como se aprende programação e pensamento computacional (computational thinking). A contribuição clássica de Wing (2006) formula o pensamento computacional como conjunto de conceitos e práticas de abstração, decomposição e reconhecimento de padrões.

**Evidência.** Wing (2006) difundiu o termo; Papert (1980) argumentou que construir artefatos computacionais muda a compreensão do conceito. Trabalhos sobre erros de programação mostram que modelos mentais incorretos sobre memória e execução são persistentes. Nível: média-alta para a importância de abstração e depuração; mais fraco para receitas de ensino específicas.

**Como aplicar em matemática/C.**
- Marina programa antes de "entender tudo": escreve uma versão pequena, roda, observa e corrige. O erro é material de estudo.
- Ela usa o depurador para tornar visível o invisível: pilha de chamadas, valor de ponteiros, fim de vida de uma variável local.
- Cada laboratório em FORGE é marcado como simulação ou execução real. Só o segundo tipo entra no portfólio como evidência.

**Erro comum.** Copiar código que "funciona" e ajustar por tentativa até o teste passar. Isso produz programa sem modelo mental e colapsa no primeiro enunciado diferente.

**Indicador de que está funcionando.** Marina prevê a saída antes de executar e justifica o erro quando a previsão falha. Ela consegue explicar a diferença entre "o compilador aceitou" e "o programa está correto".

---

## Síntese cruzada

As dezenove entradas não são uma lista de tarefas adicionais. Elas se encaixam em três movimentos:

1. **Antes do bloco:** intenção de implementação, meta específica e baixa carga irrelevante.
2. **Durante o bloco:** recuperação, intercalação, autoexplicação e dificuldade moderada, com timer como apoio.
3. **Depois do bloco:** caderno de erros, síntese Feynman, previsão versus resultado e agendamento nos dias 3, 7, 16 e 35.

A combinação importa mais que a pureza de cada técnica. Recuperação sem espaçamento desaparece; espaçamento sem recuperação vira reler; dificuldade sem feedback vira frustração.

## Nota para a geração do PDF

O guia `guia_de_estudo_baseado_em_evidencias.pdf` será produzido a partir deste arquivo. Ao converter, preserve a ordem das seções, os exemplos da Marina e as advertências de evidência. Não transforme recomendações práticas em números de pesquisa, e mantenha as referências do arquivo `bibliografia.md` como apêndice.

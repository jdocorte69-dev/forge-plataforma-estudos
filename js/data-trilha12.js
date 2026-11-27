/* ============================================================
   FORGE — data-trilha12.js
   Trilha 12: Inteligência Artificial, Machine Learning e LLMs.
   8 módulos, 45 aulas G5 (16 detalhadas da especificação +
   aulas complementares aditivas, sem remover nada do legado).
   ============================================================ */

const T12 = ([title, problem, impasse, insight, formal, feynman, facts, opts]) =>
  G5({ title, problem, impasse, insight, formal, feynman, facts, ...(opts || {}) });

CURRICULUM.ai = {
  name: "Inteligência Artificial e LLMs",
  icon: "🧠",
  modules: [
    GM("Fundamentos Matemáticos da IA", [
      [
        "Tensores, Operações Matriciais e Produto Escalar",
        "Como representar milhares de features e suas relações em um único objeto computacional?",
        "Escalares e listas isoladas não capturam estrutura multidimensional e tornam as contas impossíveis de organizar.",
        "Um tensor generaliza vetores e matrizes; multiplicações de matrizes expressam transformações lineares inteiras de uma vez.",
        "Tensor de ordem n tem forma (d1,...,dn). Produto escalar: a·b = Σ a_i b_i. Multiplicação matricial: C_ij = Σ_k A_ik B_kj, exigindo colunas de A = linhas de B.",
        "Explique por que `A @ B` não é o mesmo que multiplicar elemento por elemento.",
        [["Tensor", "Estrutura multidimensional com forma definida."], ["Forma", "Tupla que indica o tamanho de cada dimensão do tensor."], ["Produto escalar", "Soma dos produtos de componentes correspondentes."], ["Multiplicação matricial", "Operação bilinear com soma ao longo de índices compartilhados."], ["Transposição", "Troca de linhas e colunas de uma matriz."]],
        { tags: ["matemática", "tensores"], lab: "No simulador de IA, observe uma multiplicação matricial passo a passo." }
      ],
      [
        "Cálculo Multivariado: Gradiente e Regra da Cadeia",
        "Como saber em que direção ajustar milhões de parâmetros de um modelo?",
        "Testar todas as direções possíveis é impossível; derivadas parciais fornecem a inclinação local.",
        "O gradiente reúne todas as derivadas parciais e aponta a direção de maior crescimento da perda.",
        "∇f = (∂f/∂x1,...,∂f/∂xn). Regra da cadeia: ∂L/∂x = Σ_j (∂L/∂y_j)(∂y_j/∂x). Redes profundas são composições, então o gradiente é um produto de Jacobianos.",
        "Por que o gradiente negativo é usado para descer, e não para subir?",
        [["Gradiente", "Vetor de derivadas parciais de uma função escalar."], ["Derivada parcial", "Derivada em relação a uma variável, mantendo as demais fixas."], ["Regra da cadeia", "Regra para derivar composições de funções."], ["Jacobiano", "Matriz de todas as derivadas parciais de uma função vetorial."], ["Direção de descida", "Direção oposta ao gradiente, onde a função diminui localmente."]],
        { tags: ["matemática", "cálculo"] }
      ],
      [
        "Produto Escalar e Similaridade Cosseno",
        "Como medir o quanto dois textos são parecidos depois de virarem vetores?",
        "Distância euclidiana é sensível ao tamanho do vetor, não apenas à direção.",
        "Normalizar os vetores e medir o cosseno do ângulo entre eles separa direção de magnitude.",
        "cos(θ) = (a·b)/(‖a‖‖b‖). Valor 1 indica mesma direção, 0 orthogonalidade, −1 direção oposta. Embeddings usam essa métrica para busca semântica.",
        "Por que two embeddings de textos com tamanhos diferentes podem ter cosseno próximo de 1?",
        [["Similaridade cosseno", "Medida de parecença baseada no ângulo entre vetores."], ["Norma", "Tamanho de um vetor."], ["Normalização", "Escala de um vetor para norma unitária."], ["Embedding", "Representação vetorial densa de um item."], ["Busca semântica", "Recuperação por significado, não por correspondência exata de palavras."]],
        { tags: ["matemática", "embeddings"] }
      ],
      [
        "Broadcasting e Formas de Tensor",
        "Como somar um vetor de biases a uma matriz de mil linhas sem repetir dados?",
        "Copiar o vetor mil vezes desperdiça memória e largura de banda.",
        "Regras de broadcasting estendem dimensões virtualmente, sem alocar cópias.",
        "Dimensões são comparadas da direita para a esquerda; tamanhos iguais ou 1 são compatíveis, e 1 é esticado. (m,n) + (n,) funciona; (m,n) + (m,) não.",
        "Explique por que (32,1) + (1,64) resulta em (32,64).",
        [["Broadcasting", "Extensão automática de dimensões para operações entre tensores."], ["Forma compatível", "Formas que seguem as regras de extensão de broadcasting."], ["Dimensão singleton", "Dimensão de tamanho 1 que pode ser esticada."], ["Eixo", "Índice de uma dimensão do tensor."], ["View", " Nova forma sobre o mesmo armazenamento de dados."]],
        { tags: ["matemática", "tensores"] }
      ],
      [
        "Média, Variância e Normalização",
        "Por que features com escalas diferentesatrapalham o treinamento?",
        "Um feature em milhares domina o gradiente sobre outro em frações de unidade.",
        "Padronizar colocando tudo em escala comparável torna a superfície de perda bem condicionada.",
        "Média μ = (1/n)Σx_i; variância σ² = (1/n)Σ(x_i−μ)². Padronização: z = (x−μ)/σ. Em redes, BatchNorm usa μ e σ estimados por mini-batch.",
        "Demonstre o que acontece com a média e a variância após z = (x−μ)/σ.",
        [["Média", "Valor central de um conjunto de observações."], ["Variância", "Medida da dispersão em torno da média."], ["Desvio padrão", "Raiz quadrada da variância."], ["Padronização", "Transformação para média zero e desvio um."], ["BatchNorm", "Normalização das ativações usando estatísticas do mini-batch."]],
        { tags: ["matemática", "estatística"] }
      ]
    ]),
    GM("Machine Learning Clássico do Zero", [
      [
        "Regressão Linear e Gradiente Descendente",
        "Como prever um valor contínuo ajustando uma reta aos dados?",
        "Escolher a reta 'a olho' não é reprodutível nem ótimo.",
        "Definir uma perda quadrática e descer o gradiente encontra systematicamente os melhores coeficientes.",
        "Modelo ŷ = w·x + b; perda J = (1/2n)Σ(ŷ_i−y_i)². Atualização: w ← w − η∂J/∂w, b ← b − η∂J/∂b.",
        "Derive ∂J/∂w para regressão linear e mostre de onde vem o fator x_i.",
        [["Regressão linear", "Modelo que combina features linearmente para prever um número."], ["Função de perda", "Medida do erro entre previsão e valor real."], ["MSE", "Erro quadrático médio."], ["Gradiente descendente", "Otimização iterativa no sentido oposto ao gradiente."], ["Taxa de aprendizado", "Fator η que controla o tamanho do passo."]],
        { tags: ["ml", "regressão"] }
      ],
      [
        "Regressão Logística, Sigmoid e Cross-Entropy",
        "Como prever uma probabilidade em vez de um número qualquer?",
        "Uma reta pode produzir valores negativos ou maiores que 1, que não são probabilidades.",
        "Comprimir a saída com sigmoid e usar entropia cruzada alinha o modelo à natureza binomial do problema.",
        "σ(z) = 1/(1+e^(−z)). Cross-entropy: L = −[y·log(ŷ) + (1−y)·log(1−ŷ)]. O gradiente ∂L/∂z = ŷ − y é surpreendentemente simples.",
        "Explique por que MSE é pior que cross-entropy para classificação binária.",
        [["Sigmoid", "Função que comprime a entrada para o intervalo (0,1)."], ["Cross-entropy", "Perda que penaliza previsões de probabilidade confiantes e erradas."], ["Logit", "Entrada não transformada da sigmoid."], ["Probabilidade calibrada", "Previsão cujo valor reflete a frequência real do evento."], ["Classificação binária", "Problema com exatamente duas classes possíveis."]],
        { tags: ["ml", "classificação"] }
      ],
      [
        "Regularização L1, L2 e o Compromisso Bias-Variância",
        "Como evitar que um modelo decore o conjunto de treino?",
        "Modelos complexos com poucos dados ajustam ruído e falham em dados novos.",
        "Penalizar coeficientes grandes força soluções mais simples e generalizes melhor.",
        "L2 (Ridge): J + λΣw², encolhe pesos suavemente. L1 (Lasso): J + λΣ|w|, pode zerar pesos e fazer seleção de features. λ controla o compromisso.",
        "Diga quando L1 é preferível a L2 em um problema com muitas features irrelevantes.",
        [["Regularização", "Penalidade adicionada à perda para restringir o modelo."], ["L1/Lasso", "Regularização com valor absoluto que produz esparsidade."], ["L2/Ridge", "Regularização quadrada que encolhe pesos."], ["Bias", "Erro sistemático por modelo simples demais."], ["Variância", "Sensibilidade do modelo a flutuações do treino."]],
        { tags: ["ml", "regularização"] }
      ],
      [
        "MSE, MAE e Escolha da Função de Perda",
        "Nem todo erro deve ser penalizado da mesma forma — como escolher?",
        "MSE amplifica outliers; MAE ignora a magnitude relativa dos erros.",
        "A perda codifica o que o problema considera aceitável antes de qualquer otimização.",
        "MSE = (1/n)Σ(y−ŷ)², diferenciável e sensível a outliers. MAE = (1/n)Σ|y−ŷ|, robusta, mas com gradiente descontínuo em zero. Huber combina as duas.",
        "Escolha a perda adequada para prever preços com poucos valores absurdos e justifique.",
        [["MSE", "Erro quadrático médio, penaliza grandes erros com intensidade."], ["MAE", "Erro absoluto médio, linear e robusto a outliers."], ["Huber", "Perda quadrática perto de zero e linear longe dele."], ["Outlier", "Observação atípica em relação ao restante."], ["Robustez", "Resistência a dados atípicos."]],
        { tags: ["ml", "perdas"] }
      ],
      [
        "Batch, Mini-Batch e SGD",
        "Como treinar com milhões de exemplos sem esperar uma época inteira para cada ajuste?",
        "Calcular o gradiente sobre tudo é preciso, mas caro; um exemplo por vez é ruidoso.",
        "Mini-batches equilibram estabilidade do gradiente e velocidade de atualização.",
        "Batch GD usa todos os n exemplos; SGD usa um; mini-batch usa B (32–512). O estimador de gradiente é ruidoso, mas converge mais rápido em termos de tempo.",
        "Explique por que ruído no gradiente pode ajudar a escapar de mínimos locais rasos.",
        [["SGD", "Gradiente descendente estocástico com um ou poucos exemplos."], ["Mini-batch", "Conjunto pequeno de exemplos usado por atualização."], ["Época", "Passagem completa pelo conjunto de treino."], ["Estimador ruidoso", "Aproximação do gradiente com variância."], ["Convergência", "Aproação progressiva ao ótimo."]],
        { tags: ["ml", "otimização"] }
      ],
      [
        "Taxa de Aprendizado e Schedules",
        "Por que um passo grande demais impede o treinamento de convergir?",
        "O gradiente é uma aproximação local; passos enormes saltam por cima do mínimo.",
        "Agendar a taxa permite começar rápido e refinar com passos menores perto do ótimo.",
        "Estratégias: step decay, cosine annealing, warmup + decay. η_t controla o tamanho da atualização; muito baixo estagna, muito alto diverge.",
        "Descreva o comportamento da perda para η pequeno, ideal e grande demais.",
        [["Taxa de aprendizado", "Hiperparâmetro que escala o passo de atualização."], ["Warmup", "Aumento gradual da taxa no início do treino."], ["Decay", "Redução programada da taxa ao longo do treino."], ["Cosine annealing", "Agendamento em forma de cosseno."], ["Divergência", "Crescimento descontrolado da perda."]],
        { tags: ["ml", "otimização"] }
      ],
      [
        "Overfitting, Underfitting e Validação",
        "Como saber se o modelo aprendeu ou apenas memorizou?",
        "A perda no treino sempre melhora com mais parâmetros, mesmo quando a generalização piora.",
        "Separar um conjunto de validação nunca visto revela o verdadeiro desempenho.",
        "Underfitting: erro alto em treino e validação. Overfitting: erro baixo no treino e alto na validação. Early stopping escolhe a época com menor perda de validação.",
        "Por que o conjunto de teste não deve ser usado para escolher hiperparâmetros?",
        [["Overfitting", "Modelo memoriza o treino e falha em dados novos."], ["Underfitting", "Modelo simples demais para capturar o padrão."], ["Conjunto de validação", "Dados separados para ajustar hiperparâmetros."], ["Conjunto de teste", "Dados reservados para avaliação final imparcial."], ["Early stopping", "Interrupção do treino quando a validação para de melhorar."]],
        { tags: ["ml", "avaliação"] }
      ]
    ]),
    GM("Redes Neurais Artificiais e Backpropagation", [
      [
        "Perceptron Multi-Camadas e Ativações",
        "Como empilhar camadas para aprender padrões que uma reta não consegue separar?",
        "Uma única camada linear só produz fronteiras lineares, mesmo com muitos neurônios.",
        "Intercalar linearidades com funções não lineares permite approximar funções arbitrariamente complexas.",
        "h = φ(W1x + b1), ŷ = W2h + b2. ReLU(z)=max(0,z) é padrão em camadas ocultas; sigmoid/tanh em saídas específicas; softmax para multiclasse.",
        "Por que removing a não linearidade colapsa uma MLP de várias camadas em uma única transformação linear?",
        [["MLP", "Rede com camadas totalmente conectadas e ativações não lineares."], ["Ativação", "Função não linear aplicada à saída de um neurônio."], ["ReLU", "Ativação que zera valores negativos e preserva positivos."], ["Camada oculta", "Camada intermediária entre entrada e saída."], ["Aproximador universal", "Propriedade de MLPs com uma camada oculta suficiente."]],
        { tags: ["deep learning", "redes"] }
      ],
      [
        "Backpropagation Deduzido Passo a Passo",
        "Como calcular o gradiente de milhões de pesos sem repetir o cálculo para cada um?",
        "Derivar cada peso separadamente exigiria uma passagem completa por parâmetro.",
        "A regra da cadeia aplicada camada por camada reaproveita gradientes já computados, de trás para frente.",
        "Para δ^L = ∂L/∂z^L e δ^l = (W^{l+1})ᵀ δ^{l+1} ⊙ φ'(z^l), temos ∂L/∂W^l = δ^l (a^{l−1})ᵀ. Custo é proporcional ao da passagem para frente.",
        "Explique por que backprop é essencialmente regra da cadeia com memoização.",
        [["Backpropagation", "Algoritmo de cálculo eficiente de gradientes em redes."], ["Gradiente local", "Derivada da perda em relação à entrada de uma camada."], ["Delta", "Gradiente da perda em relação à ativação prévia da camada."], ["Memoização", "Reaproveitamento de resultados intermediários."], ["Complexidade", "Custo computacional proporcional ao forward pass."]],
        { tags: ["deep learning", "gradientes"] }
      ],
      [
        "Inicialização de Pesos e Otimizadores",
        "Por que inicializar todos os pesos com zero quebra o treinamento?",
        "Neurônios simétricos recebem os mesmos gradientes e evoluem identicamente para sempre.",
        "Pequena aleatoriedade quebra a simetria; escala correta evita saturação ou explosão.",
        "Xavier/Glorot: var = 1/n_in; He: var = 2/n_in para ReLU. SGD com momentum acumula velocidade; Adam usa médias móveis de primeiro e segundo momentos com correção de viés.",
        "Compare SGD com momentum e Adam quanto a adaptação por parâmetro.",
        [["Inicialização Xavier", "Escala que preserva variância através de camadas com tanh/sigmoid."], ["Inicialização He", "Escala voltada a redes com ReLU."], ["Momentum", "Acumulação de atualizações passadas para acelerar convergência."], ["Adam", "Otimizador com momentos de primeiro e segundo ordem."], ["Correção de viés", "Ajuste que neutraliza a inicialização zero dos momentos."]],
        { tags: ["deep learning", "otimização"] }
      ],
      [
        "Dropout e Normalização em Treinamento",
        "Como impedir que a rede dependa excessivamente de neurônios específicos?",
        "Sem regularização, algumas conexões dominam e o modelo perde robustez.",
        "Desligar unidades aleatoriamente força representações redundantes; normalizar estabiliza as distribuições intermediárias.",
        "Dropout zera ativações com probabilidade p no treino e escala as restantes por 1/(1−p) (inverted dropout). LayerNorm normaliza por特征的 canal, independente do batch.",
        "Explique por que dropout é desligado durante inferência.",
        [["Dropout", "Regularização que desliga unidades aleatoriamente no treino."], ["Inverted dropout", "Escala das ativações restantes para manter a média."], ["LayerNorm", "Normalização por amostra, usada em Transformers."], ["Regularização", "Técnica para reduzir overfitting."], ["Inferência", "Fase de uso do modelo treinado, sem atualizações."]],
        { tags: ["deep learning", "regularização"] }
      ],
      [
        "Gradientes que Desaparecem ou Explodem",
        "Por que redes muito profundasparam de aprender nas primeiras camadas?",
        "Multiplicar many Jacobians com valores menores que 1 faz o gradiente tenda a zero.",
        "Ativações adequadas, inicialização correta e conexões de atalho preservam o sinal do gradiente.",
        "Se |∂y/∂x| < 1 em muitas camadas, o gradiente decai exponencialmente; se > 1, explode. ReLU, residual connections e gradient clipping mitigam os casos.",
        "Explique como skip connections ajudam o gradiente a chegar às camadas iniciais.",
        [["Vanishing gradient", "Gradiente que tende a zero em camadas profundas."], ["Exploding gradient", "Gradiente que cresce descontroladamente."], ["Gradient clipping", "Limitação da norma do gradiente."], ["Conexão residual", "Atalho que soma a entrada à saída de um bloco."], ["Profundidade efetiva", "Número de camadas que realmente contribuem para o gradiente."]],
        { tags: ["deep learning", "treinamento"] }
      ],
      [
        "Softmax e Classificação Multiclasse",
        "Como transformar escores brutos em probabilidades que somam 1?",
        "Scores podem ser negativos ou não normalizados e não podem ser lidos como probabilidades.",
        "Exponenciar e normalizar produz uma distribuição estável e diferenciável.",
        "softmax(z)_i = e^(z_i−max z)/Σ_j e^(z_j−max z). Cross-entropy multiclasse: L = −Σ y_i log(ŷ_i). Subtrair o máximo evita overflow numérico.",
        "Por que a subtração do máximo não altera o resultado da softmax?",
        [["Softmax", "Função que converte logits em probabilidades."], ["Logit", "Score bruto antes da softmax."], ["Cross-entropy multiclasse", "Perda para classificação com mais de duas classes."], ["Estabilidade numérica", "Técnica para evitar overflow/underflow."], ["One-hot", "Representação de classe com um 1 e demais zeros."]],
        { tags: ["deep learning", "classificação"] }
      ],
      [
        "Weight Decay e Regularização em Otimizadores",
        "Por que penalizar pesos dentro do otimizador é diferente de adicionar L2 à perda?",
        "Em SGD puro as duas formas coincidem; com Adam adaptativo, não coincidem.",
        "AdamW separa explicitamente a penalidade da atualização adaptativa, corrigindo o efeito dos momentos.",
        "L2 na perda adiciona λw ao gradiente; Adam escala esse termo por parâmetro. AdamW aplica w ← (1−ηλ)w antes do passo adaptativo.",
        "Explique por que AdamW costuma generalizar melhor que Adam com L2 na perda.",
        [["Weight decay", "Encolhimento multiplicativo dos pesos a cada passo."], ["L2 na perda", "Penalidade quadrada adicionada ao objetivo."], ["AdamW", "Adam com decoupled weight decay."], ["Generalização", "Desempenho em dados não vistos."], ["Hiperparâmetro λ", "Intensidade da penalidade."]],
        { tags: ["deep learning", "otimização"] }
      ]
    ]),
    GM("Visão Computacional e Redes Convolucionais", [
      [
        "Convolução 2D, Kernels e Stride",
        "Como detectar bordas em uma imagem sem inspecionar cada pixel isoladamente?",
        "Uma rede totalmente conectada para imagens teria milhões de parâmetros e ignoraria a estrutura espacial.",
        "Aplicar o mesmo pequeno filtro em toda a imagem explora invariância à translação e compartilha pesos.",
        "S(i,j) = Σ_m Σ_n X(i+m,j+n)·K(m,n). Kernel 3×3, stride s desloca o filtro de s pixels; padding 'same' preserva dimensão.",
        "Calcule o tamanho da saída de uma convolução 3×3 com stride 2 sobre uma entrada 32×32 sem padding.",
        [["Convolução", "Operação de filtragem que combina vizinhos com pesos compartilhados."], ["Kernel", "Pequena matriz de pesos aplicada à imagem."], ["Stride", "Passo de deslocamento do kernel."], ["Padding", "Bordas adicionadas para controlar o tamanho da saída."], ["Feature map", "Saída de uma convolução."]],
        { tags: ["cv", "cnn"] }
      ],
      [
        "ResNet e Conexões de Atalho",
        "Como treinar redes com mais de 100 camadas sem degradar o erro?",
        "Empilhar camadas deveria ajudar, mas na prática o erro de treino aumentava em redes muito profundas.",
        "Conexões residualis permitem que a camada aprenda apenas o ajuste, não a transformação completa.",
        "Bloco residual: y = F(x) + x. A identidade dá um caminho direto para o gradiente, estabilizando o treino de centenas de camadas.",
        "Explique por que F(x) = 0 torna o bloco residual uma identidade perfeita.",
        [["ResNet", "Arquitetura baseada em blocos residuais."], ["Skip connection", "Atalho que soma a entrada à saída do bloco."], ["Bloco residual", "Conjunto de camadas com conexão de identidade."], ["Degradação", "Piora do erro ao aumentar profundidade."], ["Identidade", "Transformação que mantém a entrada inalterada."]],
        { tags: ["cv", "arquitetura"] }
      ],
      [
        "Pooling e Redução Dimensional",
        "Como reduzir o tamanho dos mapas de características sem perder informação essencial?",
        "Feature maps grandes multiplicam custo computacional nas camadas seguintes.",
        "Agregar vizinhanças com max/min/média preserva padrões predominantes e reduz resolução.",
        "Max pooling 2×2 stride 2 pega o maior valor de cada janela, reduzindo dimensões pela metade e trazendo invariância a pequenas translações.",
        "Compare max pooling e average pooling quanto à preservação de bordas.",
        [["Pooling", "Agregação de valores em janelas para reduzir dimensionalidade."], ["Max pooling", "Pooling que mantém o maior valor da janela."], ["Average pooling", "Pooling que calcula a média da janela."], ["Invariância", "Estabilidade da resposta a pequenas mudanças de posição."], ["Resolução espacial", "Dimensão do mapa de características."]],
        { tags: ["cv", "cnn"] }
      ],
      [
        "Data Augmentation e Transfer Learning",
        "Como treinar bem com poucas imagens rotuladas?",
        "Modelos grandes precisam de muitos dados; pequenos conjuntos levam a overfitting rápido.",
        "Transformar as imagens existentes e reaproveitar pesos de modelos pré-treinados amplia o conjunto efetivo.",
        "Augmentation: rotação, crop, flip, jitter de cor. Transfer learning congela camadas iniciais e treina apenas a cabeça específica da tarefa.",
        "Por que as primeiras camadas de uma CNN pré-treinada são mais reutilizáveis que as últimas?",
        [["Data augmentation", "Geração de variações sintéticas dos dados de treino."], ["Transfer learning", "Reaproveitamento de pesos de outro modelo ou tarefa."], ["Fine-tuning", "Ajuste fino de pesos pré-treinados."], ["Congelamento", "Manutenção de camadas sem atualização."], ["Cabeça da rede", "Camadas finais específicas da tarefa."]],
        { tags: ["cv", "treinamento"] }
      ],
      [
        "LeNet, AlexNet e VGG",
        "Como a arquitetura das CNNs evoluiu de dígitos para imagens complexas?",
        "Cada geração precisava lidar com mais classes, resolução e dados disponíveis.",
        "A progressão mostra que profundidade, ReLU e convoluções pequenas substituíram kernels grandes e sigmoid.",
        "LeNet (1998): conv 5×5 + pooling para MNIST. AlexNet (2012): ReLU, dropout, GPU, kernels 11×5×3. VGG (2014): pilhas de conv 3×3, profundidade 16–19.",
        "Por que VGG usa duas convoluções 3×3 em vez de uma 5×5?",
        [["LeNet", "CNN clássica para reconhecimento de dígitos."], ["AlexNet", "CNN que popularizou deep learning em visão."], ["VGG", "Arquitetura com blocos uniformes de convoluções 3×3."], ["Campo receptivo", "Região da entrada que influencia uma ativação."], ["Parâmetro", "Peso aprendido pelo modelo."]],
        { tags: ["cv", "história"] }
      ]
    ]),
    GM("NLP, Tokenização, Embeddings e Atenção", [
      [
        "Tokenização BPE e Espaços de Embeddings",
        "Como transformar texto arbitrário em números que a rede consegue processar?",
        "Palavras inteiras geram vocabulários enormes e muitos tokens desconhecidos.",
        "Dividir texto em subpalavras frequentes equilibra vocabulário e flexibilidade.",
        "BPE começa com caracteres e funde pares mais frequentes até atingir o tamanho desejado. Cada token vira um vetor denso via tabela de embeddings de dimensão d.",
        "Explique como BPE lida com uma palavra nunca vista antes.",
        [["Token", "Unidade mínima processada pelo modelo de linguagem."], ["BPE", "Byte Pair Encoding, algoritmo de subpalavras."], ["Vocabulário", "Conjunto fixo de tokens conhecidos."], ["Embedding", "Vetor denso associado a um token."], ["OOV", "Token fora do vocabulário."]],
        { tags: ["nlp", "tokens"] }
      ],
      [
        "Scaled Dot-Product Attention e Multi-Head",
        "Como um modelo decide quais palavras da frase são relevantes para cada posição?",
        "Ler cada posição isoladamente perde relações como 'ela' referindo-se a uma palavra anterior.",
        "Atenção compara cada token com todos os outros e pondera seus valores por similaridade.",
        "Attention(Q,K,V) = softmax(QKᵀ/√d_k)V. Multi-head usa várias projeções diferentes em paralelo, cada uma capturando uma relação distinta.",
        "Por que dividir por √d_k antes da softmax?",
        [["Atenção", "Mecanismo de ponderação de informações por relevância."], ["Query", "Vetor que representa o que se procura."], ["Key", "Vetor que representa o conteúdo oferecido."], ["Value", "Vetor com a informação a ser agregada."], ["Multi-head", "Uso de várias cabeças de atenção independentes."]],
        { tags: ["nlp", "transformer"], lab: "No simulador de IA, ajuste os pesos de atenção e observe o mapa de calor." }
      ],
      [
        "Codificação Posicional e Arquitetura Transformer",
        "Se a atenção ignora ordem, como o modelo sabe a posição das palavras?",
        "A mesma frase com palavras trocadas geraria representações idênticas sem informação de posição.",
        "Adicionar um vetor posicional distinto a cada token injeta ordem sem mudar o mecanismo de atenção.",
        "Transformer: encoder/decoder com atenção, LayerNorm,残差 connections e FFN. Codificação senoidal (pe_{2i}=sin(pos/10000^{2i/d})) ou embeddings posicionais aprendidos são somados aos embeddings de token.",
        "Explique por que a codificação senoidal permite extrapolar para sequências mais longas que as vistas no treino.",
        [["Codificação posicional", "Vetor que representa a posição de um token."], ["Transformer", "Arquitetura baseada em atenção, sem recorrência."], ["Self-attention", "Atenção dos tokens de uma sequência entre si."], ["Feed-forward", "Rede pequena aplicada posição por posição."], ["残差 connection", "Atalho que soma entrada e saída de um subbloco."]],
        { tags: ["nlp", "transformer"] }
      ],
      [
        "Vocabulário, Subpalavras e id_speciais",
        "Como representar início de sequência, fim e tokens ausentes?",
        "O modelo precisa de sinais explícitos para delimitar frases e tratar entradas inválidas.",
        "Tokens especiais reservados no vocabulário funcionam como marcadores estruturais.",
        "[BOS], [EOS], [PAD], [UNK], [CLS], [SEP] têm embeddings próprios e não derivam de texto comum. A escolha afeta máscaras de atenção e comprimento efetivo.",
        "Por que [PAD] precisa ser mascarado na atenção?",
        [["Token especial", "Token reservado com significado estrutural."], ["BOS/EOS", "Marcadores de início e fim de sequência."], ["PAD", "Token usado para preencher lotes até o mesmo comprimento."], ["Máscara de atenção", "Mecanismo que impede atenção a posições inválidas."], ["Comprimento efetivo", "Número de tokens reais, ignorando padding."]],
        { tags: ["nlp", "tokens"] }
      ],
      [
        "Atenção Causal e Geração Autorregressiva",
        "Como impedir que o modelo 'veja' palavras futuras ao gerar texto?",
        "Se a atenção acessasse o futuro, o treino vazaria a resposta e a geração não seria incremental.",
        "Mascarar posições posteriores transforma a atenção em causal, compatível com previsão do próximo token.",
        "M_ij = 0 para j > i (ou −∞ antes da softmax). Assim, a posição i só atende a si mesma e às anteriores; a geração repete o processo tokens por vez.",
        "Explique por que a máscara causal é necessária no treino, mas a atenção já é causal na inferência passo a passo.",
        [["Atenção causal", "Atenção que proíbe olhar para frente na sequência."], ["Máscara", "Matriz que bloqueia posições específicas."], ["Autorregressão", "Geração em que cada token depende dos anteriores."], ["Vazamento de futuro", "Uso indevido de informação posterior no treino."], ["Próximo token", "Objetivo de previsão de modelos de linguagem."]],
        { tags: ["nlp", "llm"] }
      ],
      [
        "LayerNorm e Residual Stream",
        "Como manter estáveis dezenas de camadas empilhadas em um Transformer?",
        "Sem normalização, distribuições de ativação mudam a cada bloco e o treino oscila.",
        "Normalizar por token e somar o valor original cria um 'rio residual' estável para o gradiente.",
        "LayerNorm(x) = γ·(x−μ)/√(σ²+ε) + β, com μ e σ calculados por token. Cada subcamada faz x ← x + Sublayer(LN(x)).",
        "Por que LayerNorm é preferida a BatchNorm em modelos de linguagem?",
        [["LayerNorm", "Normalização por amostra e canal, independente do batch."], ["Residual stream", "Fluxo de informações acumuladas pelas somas de atalho."], ["γ e β", "Parâmetros aprendidos de escala e deslocamento."], ["Estabilidade", "Manutenção de distribuições controladas no treino."], ["Subcamada", "Bloco de atenção ou FFN dentro do Transformer."]],
        { tags: ["nlp", "transformer"] }
      ],
      [
        "KV Cache e Inferência Eficiente",
        "Por que gerar o token 1000 é mais caro que o token 1?",
        "Recomputar atenção sobre todo o histórico a cada passo custa quadrático no comprimento.",
        "Armazenar chaves e valores já calculados evita recomputar o passado.",
        "KV cache guarda K e V de cada camada e posição; a cada novo token, calcula apenas Q e as novas K/V. Memória cresce com camadas × tokens × heads × d_k.",
        "Explique por que KV cache troca memória por velocidade e o que acontece em contextos muito longos.",
        [["KV cache", "Cache de chaves e valores da atenção."], ["Autorregressão", "Geração token a token."], ["Complexidade", "Crescimento do custo com o tamanho da entrada."], ["Contexto", "Quantidade de tokens históricos disponíveis ao modelo."], ["Prefill", "Fase inicial que processa o prompt e prepara o cache."]],
        { tags: ["nlp", "inferência"] }
      ],
      [
        "RoPE e Embeddings Rotacionais",
        "Como codificar posições relativas em atenção de forma compatível com contextos longos?",
        "Embeddings absolutos aprendidos não generalizam bem além do comprimento treinado.",
        "Rotacionar vetores de query e key por um ângulo proporcional à posição codifica distância relativa no produto escalar.",
        "RoPE aplica rotações 2D em pares de dimensões: ⟨R_m q, R_n k⟩ depende apenas de m−n. É o padrão em modelos como Llama e Mistral.",
        "Por que a dependência de m−n é útil para extrapolação de contexto?",
        [["RoPE", "Rotary Position Embedding, codificação posicional por rotação."], ["Posição relativa", "Distância entre tokens, em vez de índice absoluto."], ["Rotação 2D", "Transformação em pares de coordenadas."], ["Extrapolação", "Comportamento além do comprimento de treino."], ["Produto escalar rotacionado", "Forma de preservar informação de distância."]],
        { tags: ["nlp", "posição"] }
      ]
    ]),
    GM("Treinamento, Quantização e Inferência de Modelos", [
      [
        "Pré-Treinamento, Fine-Tuning, LoRA e QLoRA",
        "Como adaptar um modelo de bilhões de parâmetros sem treinar tudo de novo?",
        "Ajustar todos os pesos exige memória e computação proibitivas para a maioria das equipes.",
        "Manter a base congelada e treinar matrizes de baixo posto reduz drasticamente o custo.",
        "LoRA congela W e aprende ΔW = BA com rank r ≪ d. QLoRA combina LoRA com quantização da base em 4 bits (NF4) e double quantization.",
        "Estime a redução de parâmetros treináveis ao usar rank 8 em uma matriz 4096×4096.",
        [["Pré-treinamento", "Treinamento inicial em corpus amplo e geral."], ["Fine-tuning", "Ajuste do modelo para uma tarefa específica."], ["LoRA", "Adaptação de baixo posto com matrizes pequenas treináveis."], ["QLoRA", "LoRA sobre modelo quantizado em 4 bits."], ["Rank", "Dimensão interna das matrizes de adaptação."]],
        { tags: ["llm", "treinamento"] }
      ],
      [
        "Quantização INT8, INT4 e Formato GGUF",
        "Como executar um modelo grande em hardware modesto?",
        "Pesos em FP32 consomem 4 bytes cada; um modelo de 8 bilhões ocupa 32 GB só em pesos.",
        "Representar pesos com menos bits reduz memória e largura de banda, com perda controlada de precisão.",
        "INT8 usa escala e zero-point: q = round(x/s)+z. INT4 (NF4, GPTQ, AWQ) comprime mais; GGUF empacota tensores, metadados e quantização para execução local (llama.cpp).",
        "Explique por que quantização pós-treinamento pode degradar mais que quantização aware training.",
        [["Quantização", "Redução da precisão numérica dos pesos."], ["INT8", "Pesos representados com 8 bits inteiros."], ["INT4", "Pesos representados com 4 bits inteiros."], ["Escala", "Fator que converte valores reais em inteiros."], ["GGUF", "Formato de arquivo para modelos quantizados executados localmente."]],
        { tags: ["llm", "inferência"] }
      ],
      [
        "Precisão Mista FP16 e BF16",
        "Por que treinar em FP32 é caro, mas FP16 puro é instável?",
        "FP16 tem alcance limitado e gradients pequenos podem virar zero.",
        "BF16 mantém o expoente de FP32 com menos mantissa, oferecendo alcance e velocidade.",
        "AMP (Automatic Mixed Precision) executa operações pesadas em FP16/BF16 e mantém acumulações e pesos mestres em FP32. GradScaler evita underflow em FP16.",
        "Compare FP16 e BF16 quanto a alcance e precisão.",
        [["FP16", "Ponto flutuante de 16 bits com 5 bits de expoente."], ["BF16", "Ponto flutuante de 16 bits com 8 bits de expoente."], ["AMP", "Técnica que alterna precisão automaticamente."], ["GradScaler", "Escala de gradientes para evitar underflow."], ["Underflow", "Valor tão pequeno que vira zero na representação."]],
        { tags: ["llm", "treinamento"] }
      ],
      [
        "Pruning e Destilação de Modelos",
        "Como reduzir um modelo sem perder comportamento?",
        "Muitos pesos contribuem pouco; outros podem ser substituídos por um modelo menor treinado para imitá-los.",
        "Remover conexões irrelevantes ou transferir a 'knowledge' de um professor compacta o modelo.",
        "Pruning zera pesos abaixo de um limiar, com ou sem re-treinamento. Distillation treina um aluno com as distribuições de probabilidade do professor (temperatura T > 1).",
        "Por que soft labels do professor ensinam mais que rótulos one-hot?",
        [["Pruning", "Remoção de pesos ou conexões pouco importantes."], ["Esparsidade", "Proporção de pesos zerados."], ["Destilação", "Treinamento de modelo menor para imitar outro."], ["Soft label", "Distribuição de probabilidade em vez de classe única."], ["Temperatura", "Parâmetro que suaviza a distribuição do professor."]],
        { tags: ["llm", "compressão"] }
      ],
      [
        "Batching, Latência e Serving",
        "Por que agrupar requisições aumenta o throughput, mas piora a latência individual?",
        "Lote maior aproveita melhor GPU, porém cada requisição espera o lote ficar pronto.",
        "Levantamento contínuo (continuous batching) equilibra ocupação e tempo de resposta.",
        "Throughput = tokens/s do sistema; latency = tempo até o primeiro token (TTFT) e por token (TPOT). PagedAttention gere KV cache em blocos, reduzindo fragmentação.",
        "Diga quando otimizar TTFT é mais importante que otimizar TPOT.",
        [["Batching", "Agrupamento de requisições para processamento conjunto."], ["TTFT", "Tempo até o primeiro token gerado."], ["TPOT", "Tempo médio por token de saída."], ["PagedAttention", "Gerenciamento de KV cache em páginas."], ["Continuous batching", "Inclusão dinâmica de requisições em lotes em andamento."]],
        { tags: ["llm", "serving"] }
      ],
      [
        "Avaliação de Modelos e Perplexidade",
        "Como comparar modelos de linguagem sem depender só de impressões subjetivas?",
        "Respostas fluentes podem estar erradas; é preciso medir probabilidade e tarefas concretas.",
        "Perplexidade mede a surpresa média do modelo; benchmarks medem desempenho em tarefas.",
        "PPL(W) = exp(−(1/N)Σ log p(w_i | contexto)). Quanto menor, melhor a previsão. Avaliações humanas e conjuntos como MMLU complementam a métrica.",
        "Por que perplexidade baixa não garante que o modelo é factualmente correto?",
        [["Perplexidade", "Medida de quão 'surpreso' o modelo está com uma sequência."], ["Entropia", "Medida de incerteza da distribuição."], ["Benchmark", "Conjunto padronizado de tarefas de avaliação."], ["Alucinação", "Resposta plausível, mas falsa."], ["Avaliação humana", "Julgamento de qualidade por pessoas."]],
        { tags: ["llm", "avaliação"] }
      ]
    ]),
    GM("Implementação de Tensor Engine em C", [
      [
        "Autograd Engine Minimalista e Biblioteca de Tensores",
        "Como construir um motor de diferenciação automática sem dependências?",
        "Bibliotecas prontas escondem o mecanismo; entender a fita de operações exige implementá-la.",
        "Registrar cada operação com seus pais e construir um grafo permite calcular gradientes por reverse-mode.",
        "Cada Tensor guarda data, shape, requires_grad, grad e ponteiro para uma classe de operação com forward() e backward(). O backward acumula gradientes em ordem topológica reversa.",
        "Descreva o que acontece no grafo ao chamar backward() em uma loss escalar.",
        [["Autograd", "Diferenciação automática por grafo de operações."], ["Grafo computacional", "Estrutura de nós (operações) e arestas (tensores)."], ["Reverse mode", "Diferenciação de trás para frente, eficiente para muitas entradas e uma saída."], ["Gradiente acumulado", "Soma de contribuições de múltiplos caminhos."], ["Ordem topológica reversa", "Ordem que garante processar dependentes antes de seus pais."]],
        { tags: ["c", "autograd"] }
      ],
      [
        "Estrutura de Tensor e Strides",
        "Como representar uma matriz 2D em memória linear?",
        "A memória RAM é linear, mas tensores têm várias dimensões lógicas.",
        "Strides mapeiam índices lógicos para offsets físicos sem copiar dados.",
        "offset = Σ_i idx_i · stride_i. Para shape (R,C) row-major: stride = (C,1). Transpor pode trocar strides em vez de mover bytes.",
        "Calcule o offset do elemento [2][3] em um tensor (4,5) com strides (5,1).",
        [["Stride", "Passo em elementos para avançar uma posição em cada dimensão."], ["Row-major", "Layout que armazena linhas consecutivamente."], ["Offset", "Deslocamento em elementos até o dado desejado."], ["View", "Tensor que compartilha armazenamento com outro."], ["Contiguidade", "Propriedade de dados armazenados sem buracos."]],
        { tags: ["c", "memória"] }
      ],
      [
        "Backward Pass em C com Lista de Operações",
        "Como percorrer o grafo sem recursão e sem depender de bibliotecas externas?",
        "Recursão pode estourar a pilha em grafos profundos de milhares de operações.",
        "Uma fita linear de operações, gravada no forward, pode ser percorrida de trás para frente.",
        "Ops são armazenadas em array dinâmico com ponteiros para entrada/saída; o loop de backward chama op->backward(grad_output) e acumula em op->grads. Ordem inversa já é topológica.",
        "Explique por que a fita linear funciona para grafos acíclicos mesmo com ramificações.",
        [["Fita", "Lista ordenada de operações registradas no forward."], ["Grafo acíclico", "Grafo sem ciclos, como o de uma rede neural."], ["Ramificação", "Tensor usado por mais de uma operação."], ["Acumulação", "Soma de gradientes de múltiplos consumidores."], ["Percurso reverso", "Iteração da última para a primeira operação."]],
        { tags: ["c", "autograd"] }
      ],
      [
        "Arena de Memória e Alocação de Tensores",
        "Como evitar milhares de malloc/free durante o treinamento?",
        "Alocação dinâmica frequente fragmenta a memória e consome tempo.",
        "Uma arena reserva um bloco grande e distribui sub-blocos com um ponteiro corrente.",
        "Bump allocator: ptr += bytes, com realinhamento. Para treino, uma arena por iteração é liberada de uma vez, reduzindo overhead e melhorando localidade de cache.",
        "Quando uma arena é pior que malloc/free convencional?",
        [["Arena", "Bloco grande de memória dividido em várias alocações."], ["Bump allocator", "Alocador que apenas avança um ponteiro."], ["Alinhamento", "Ajuste de endereço para requisitos do hardware."], ["Fragmentação", "Espaço desperdiçado por buracos entre alocações."], ["Localidade", "Proximidade de dados acessados em sequência."]],
        { tags: ["c", "desempenho"] }
      ]
    ]),
    GM("Fundamentos Transversais, Ética e Uso Responsável", [
      [
        "Viés, Justiça e Dados de Treino",
        "Como um modelo pode ser preciso em média e ainda injusto com grupos específicos?",
        "Dados históricos carregam desigualdades que o modelo aprende como padrão.",
        "Avaliar por subgrupos e escolher métricas de fairness revela o que a média esconde.",
        "Demographic parity, equalized odds e calibration são critérios diferentes e, em geral, incompatíveis entre si. Mitigações incluem reamostragem, reweighting e treino adversarial.",
        "Por que não existe uma única métrica de justiça universal?",
        [["Viés", "Desvio sistemático do modelo em relação a certos grupos."], ["Fairness", "Conjunto de critérios de equidade."], ["Subgrupo", "Partição da população com característica comum."], ["Calibração", "Coerência entre probabilidade prevista e frequência real."], ["Mitigação", "Técnica para reduzir viés."]],
        { tags: ["ética", "ia"] }
      ],
      [
        "Privacidade, Memorização e Vazamento",
        "Um modelo pode 'lembrar' frases inteiras do treino?",
        "Modelos grandes têm capacidade suficiente para memorizar exemplos raros.",
        "Testes de extração e técnicas de privacidade diferencial medem e limitam esse risco.",
        "Privacy-preserving training usa differential privacy com ruído e clipping de gradientes; memorização é mais provável em dados duplicados e exemplos únicos.",
        "Explique por que duplicatas no corpus aumentam o risco de memorização.",
        [["Memorização", "Reprodução de exemplos específicos do treino."], ["Privacidade diferencial", "Técnica que limita a influência de um indivíduo no modelo."], ["Ruído", "Aleatoriedade adicionada para proteger dados."], ["Clipping", "Limitação da norma do gradiente."], ["Extração", "Tentativa de recuperar dados de treino do modelo."]],
        { tags: ["ética", "privacidade"] }
      ],
      [
        "Alinhamento, Segurança e Avaliação Humana",
        "Como garantir que um modelo poderoso faça o que as pessoas realmente querem?",
        "Otimizar apenas probabilidade de próximo token não incorpora valores humanos.",
        "Feedback humano, regras explícitas e testes adversariais orientam o comportamento desejado.",
        "RLHF usa recompensas aprendidas de preferências humanas; DPO otimiza diretamente pares escolhido/rejeitado; red teaming busca falhas antes do lançamento.",
        "Por que red teaming é necessário mesmo após alinhamento com preferências humanas?",
        [["Alinhamento", "Ajuste do comportamento do modelo a objetivos humanos."], ["RLHF", "Aprendizado por reforço com feedback humano."], ["DPO", "Otimização direta de preferências."], ["Red teaming", "Teste adversarial estruturado."], ["Recusa segura", "Comportamento de não atender pedidos prejudiciais."]],
        { tags: ["ética", "segurança"] }
      ]
    ])
  ]
};

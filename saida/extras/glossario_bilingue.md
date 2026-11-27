# Glossário técnico bilíngue do FORGE (pt-BR ↔ English)

Material autoral de apoio ao ecossistema FORGE. Todo o conteúdo está em português do Brasil; o termo em inglês aparece entre parênteses na primeira ocorrência de cada entrada. As definições são curtas e escritas para revisão rápida, não para substituir um dicionário técnico.

Regras de leitura adotadas aqui:

- Fórmulas aparecem apenas em Unicode legível: √, ², ≤, ⇒, ∈, ∑, Δ. Não há notação LaTeX neste arquivo nem nos demais materiais da Fase 6.
- "Definição curta" captura o sentido operacional do termo dentro do FORGE.
- "Uso típico" aponta o arquivo ou a situação onde o termo costuma aparecer.
- Quando a tradução é traiçoeira, a entrada vai para a seção final de falsos amigos.

O glossário cobre seis áreas: Matemática, Linguagem C, Redes, Engenharia de Software, Ciência do Estudo e Criptografia. Ao todo são 177 termos organizados em tabelas, mais 24 armadilhas de tradução.

---

## 1. Matemática (Mathematics)

| Português (pt-BR) | English | Definição curta (pt-BR) | Uso típico |
| --- | --- | --- | --- |
| conjunto (set) | set | Coleção bem definida de elementos; a pertença se escreve x ∈ A. | Compêndio, capítulo de conjuntos |
| elemento (element) | element | Objeto que pertence a um conjunto. | Demonstrações de pertencer e não pertencer |
| pertencer (belong to) | belong to | Relação entre um objeto e um conjunto, denotada por ∈. | Exercícios de conjuntos numéricos |
| subconjunto (subset) | subset | Conjunto cujos elementos estão todos em outro, denotado por ⊆. | Comparação entre ℕ, ℤ, ℚ, ℝ |
| inteiro (integer) | integer | Número sem parte fracionária, positivo, negativo ou zero. | Aritmética em C e aritmética modular |
| racional (rational number) | rational number | Número que pode ser escrito como razão de dois inteiros com denominador não nulo. | Classificação de conjuntos numéricos |
| irracional (irrational number) | irrational number | Real que não é quociente de inteiros, como √2 e π. | Densidade dos reais |
| número real (real number) | real number | Conjunto que reúne racionais e irracionais. | Funções e cálculo |
| função (function) | function | Regra que associa a cada elemento do domínio um único elemento da imagem. | Compêndio, capítulo de funções |
| domínio (domain) | domain | Conjunto de entradas permitidas de uma função. | Cálculo do domínio de logaritmos |
| contradomínio (codomain) | codomain | Conjunto onde as saídas da função estão contidas, não necessariamente esgotadas. | Distinção entre imagem e contradomínio |
| imagem (range, image) | range, image | Conjunto efetivo dos valores de saída de uma função. | Gráficos e inversão de funções |
| inversa (inverse function) | inverse function | Função que desfaz outra; existe quando a original é bijetora. | Logaritmo como inversa da exponencial |
| injetora (injective) | injective | Função em que entradas distintas produzem saídas distintas. | Critérios de invertibilidade |
| sobrejetora (surjective) | surjective | Função cuja imagem coincide com o contradomínio. | Classificação de funções |
| bijetora (bijective) | bijective | Função ao mesmo tempo injetora e sobrejetora. | Existência de função inversa |
| composição (composition) | composition | Operação que aplica uma função após outra, (f ∘ g)(x) = f(g(x)). | Regra da cadeia em cálculo |
| limite (limit) | limit | Valor que uma função se aproxima quando a variável se aproxima de um ponto. | Introdução ao cálculo diferencial |
| derivada (derivative) | derivative | Taxa instantânea de variação; inclinação da reta tangente. | Otimização e velocidade |
| integral (integral) | integral | Soma contínua de fatias; área sob uma curva quando a função é positiva. | Teorema Fundamental do Cálculo |
| diferencial (differential) | differential | Pequena variação simbólica usada em integração e derivação, como dx. | Integração por substituição |
| matriz (matrix) | matrix | Tabela retangular de números usada para sistemas e transformações. | Sistemas lineares e determinantes |
| determinante (determinant) | determinant | Número associado a uma matriz quadrada que indica invertibilidade. | Inversão de matrizes |
| combinação (combination) | combination | Seleção de k elementos sem importar a ordem, C(n,k). | Contagem e probabilidade |
| permutação (permutation) | permutation | Organização de elementos em que a ordem importa, A(n,k). | Contagem de senhas e arranjos |
| probabilidade (probability) | probability | Medida da chance de um evento, entre 0 e 1. | Axiomas e espaço amostral |
| evento (event) | event | Subconjunto do espaço amostral; ocorre quando o resultado pertence a ele. | União e interseção de eventos |
| variável aleatória (random variable) | random variable | Função que associa números a resultados do espaço amostral. | Distribuições e esperança |
| esperança (expected value) | expected value | Média ponderada dos valores de uma variável aleatória. | Jogos e decisão |
| variância (variance) | variance | Medida da dispersão em torno da média, E[(X − μ)²]. | Comparação de conjuntos de dados |
| desvio padrão (standard deviation) | standard deviation | Raiz quadrada da variância, na mesma unidade dos dados. | Interpretação de dispersão |
| juros compostos (compound interest) | compound interest | Capitalização em que a cada período incide sobre o montante anterior, M = P(1 + i)ⁿ. | Matemática financeira |
| taxa (rate) | rate | Razão entre grandezas por unidade de tempo ou de capital. | Juros simples e compostos |
| congruência (congruence) | congruence | Relação de igualdade de restos em aritmética modular, a ≡ b (mod m). | Fermat e inverso modular |

---

## 2. Linguagem C (C programming language)

| Português (pt-BR) | English | Definição curta (pt-BR) | Uso típico |
| --- | --- | --- | --- |
| variável (variable) | variable | Nome ligado a um espaço de memória cujo valor pode mudar. | Primeiros programas em C |
| tipo (type) | type | Descrição do conjunto de valores e operações permitidas, como int e float. | Declarações e conversões |
| literal (literal) | literal | Valor escrito diretamente no código, como 42 ou 'a'. | Inicialização de variáveis |
| constante (constant) | constant | Valor que não deve mudar durante a execução. | Tamanhos de buffer e limites |
| ponteiro (pointer) | pointer | Variável que guarda um endereço de memória. | referencia_02_buffer_seguro.c |
| endereço (address) | address | Posição identificável na memória do processo. | Operador & em C |
| desreferenciação (dereference) | dereference | Acesso ao valor apontado por um ponteiro, feito com o operador *. | Leitura e escrita via ponteiro |
| aritmética de ponteiros (pointer arithmetic) | pointer arithmetic | Soma e subtração que avançam de acordo com o tamanho do tipo apontado. | Percorrer arrays |
| array (array) | array | Sequência contígua de elementos do mesmo tipo. | Vetores e matrizes em C |
| string (string) | string | Sequência de caracteres terminada pelo byte nulo. | Leitura de entrada e cópias |
| struct (structure) | structure | Tipo composto que agrupa campos com nomes. | registros do servidor TCP |
| enum (enumeration) | enumeration | Tipo cujos valores são constantes nomeadas. | Estados de um protocolo |
| escopo (scope) | scope | Região do programa onde um nome é visível. | Variáveis locais e globais |
| tempo de vida (lifetime) | lifetime | Intervalo durante o qual um objeto existe na memória. | variáveis automáticas e estáticas |
| pilha (stack) | stack | Área de memória de alocação automática, ligada à chamada de funções. | Chamadas recursivas |
| heap (heap) | heap | Área de memória para alocação dinâmica explícita. | malloc, calloc, realloc, free |
| alocação dinâmica (dynamic allocation) | dynamic allocation | Reserva de memória em tempo de execução. | Buffer seguro do FORGE |
| vazamento de memória (memory leak) | memory leak | Memória alocada que não é liberada e fica indisponível. | Revisão de malloc e free |
| use after free (use after free) | use-after-free | Uso de ponteiro após a liberação do bloco apontado. | Erros de segurança em C |
| estouro de buffer (buffer overflow) | buffer overflow | Escrita além da capacidade alocada de um buffer. | Verificação de limites |
| comportamento indefinido (undefined behavior) | undefined behavior | Situação em que a linguagem não garante resultado algum. | Índices negativos e estouro de inteiro |
| compilador (compiler) | compiler | Programa que traduz código-fonte para código de máquina ou intermediário. | gcc do MinGW |
| ligador (linker) | linker | Etapa que resolve símbolos e monta o executável final. | Erros de referência externa |
| aviso (warning) | warning | Diagnóstico do compilador que não impede a compilação, mas sinaliza risco. | -Wall -Wextra -Werror |
| conversão de tipo (type cast) | type cast | Conversão explícita de um valor para outro tipo. | int para size_t e vice-versa |
| recursão (recursion) | recursion | Chamada de uma função a si mesma com caso base. | Fatoração e travessia |
| entrada e saída (input/output, I/O) | input/output | Leitura e escrita de dados entre o programa e o exterior. | printf, fgets, send, recv |
| higienização (sanitization) | sanitization | Limpeza ou validação de dados antes do uso. | Limpeza de buffers com segredos |

---

## 3. Redes (Networks)

| Português (pt-BR) | English | Definição curta (pt-BR) | Uso típico |
| --- | --- | --- | --- |
| protocolo (protocol) | protocol | Conjunto de regras que define formato, ordem e tratamento de mensagens. | TCP, IP, DNS, HTTP |
| camada (layer) | layer | Nível funcional com responsabilidades próprias em uma arquitetura de redes. | Modelos OSI e TCP/IP |
| pacote (packet) | packet | Unidade de dados na camada de rede, com cabeçalho IP. | Encapsulamento |
| quadro (frame) | frame | Unidade de dados na camada de enlace, com cabeçalho de MAC. | Ethernet |
| datagrama (datagram) | datagram | Unidade independente de UDP, sem garantia de entrega. | Consultas DNS |
| segmento (segment) | segment | Unidade de dados da camada de transporte em TCP. | Números de sequência |
| socket (socket) | socket | Interface de programação para comunicação em rede. | referencia_03_servidor_tcp.c |
| porta (port) | port | Número de 16 bits que identifica um serviço ou processo na máquina. | Porta 8080 do servidor FORGE |
| endereço IP (IP address) | IP address | Identificador lógico de uma interface em uma rede IP. | IPv4 e IPv6 |
| máscara de rede (network mask) | network mask | Padrão de bits que separa parte de rede e parte de host. | Cálculo de sub-redes |
| CIDR (CIDR) | CIDR | Notação que escreve endereço e tamanho do prefixo, como 192.168.1.0/24. | calculadora_cidr.py |
| sub-rede (subnet) | subnet | Bloco de endereços obtido pela divisão de uma rede maior. | VLSM e roteamento |
| roteador (router) | router | Dispositivo que encaminha pacotes entre redes diferentes. | Tabela de rotas |
| rota (route) | route | Entrada que associa um destino a um próximo salto. | Rota padrão |
| gateway (gateway) | gateway | Dispositivo usado para sair da rede local. | Configuração de host |
| DNS (DNS) | DNS | Sistema distribuído que traduz nomes em endereços IP. | Resolução de estudios.local |
| resolvedor (resolver) | resolver | Cliente que consulta servidores DNS e interpreta respostas. | Consultas recursivas |
| TTL (time to live) | time to live | Campo que limita saltos de um pacote ou validade de uma resposta DNS. | Diagnóstico de rotas |
| handshake (handshake) | handshake | Troca inicial de mensagens para estabelecer parâmetros de comunicação. | TCP de três vias e TLS 1.3 |
| latência (latency) | latency | Tempo decorrido entre o envio e a chegada do dado. | Medição com ping |
| largura de banda (bandwidth) | bandwidth | Capacidade máxima de transferência de um enlace. | Dimensionamento de enlace |
| vazão (throughput) | throughput | Taxa efetiva de dados transferidos em um intervalo. | Comparação com largura de banda |
| jitter (jitter) | jitter | Variação da latência entre pacotes. | Voz e vídeo em tempo real |
| MTU (maximum transmission unit) | maximum transmission unit | Tamanho máximo de payload de uma camada. | Fragmentação de pacotes |
| NAT (network address translation) | network address translation | Tradução de endereços privados para públicos. | Saída de rede doméstica |
| firewall (firewall) | firewall | Mecanismo de filtragem de tráfego segundo regras. | Bloqueio de portas |
| ARP (address resolution protocol) | address resolution protocol | Protocolo que resolve endereço IP para endereço MAC na rede local. | Tabela ARP |
| ICMP (internet control message protocol) | internet control message protocol | Protocolo de mensagens de controle e diagnóstico. | ping e traceroute |

---

## 4. Engenharia de Software (Software Engineering)

| Português (pt-BR) | English | Definição curta (pt-BR) | Uso típico |
| --- | --- | --- | --- |
| requisito (requirement) | requirement | Necessidade observável que o produto deve atender. | Lista de requisitos do FORGE |
| caso de uso (use case) | use case | Descrição de uma interação entre ator e sistema para atingir um objetivo. | Elicitação de escopo |
| arquitetura (architecture) | architecture | Decisões estruturais de alto nível sobre componentes e comunicação. | extras/arquitetura_criptografica.md |
| módulo (module) | module | Unidade de código com fronteira e responsabilidade definidas. | scripts do FORGE |
| acoplamento (coupling) | coupling | Grau de dependência entre módulos. | Migração e manutenção |
| coesão (cohesion) | cohesion | Grau em que os elementos de um módulo pertencem juntos. | Revisão de design |
| encapsulamento (encapsulation) | encapsulation | Ocultação de detalhes internos atrás de uma interface. | Structs opacas em C |
| interface (interface) | interface | Contrato de entradas, saídas e comportamento esperado. | API do cofre fictício |
| API (application programming interface) | application programming interface | Conjunto de chamadas e formatos que um componente expõe. | Integração entre scripts |
| contrato (contract) | contract | Acordo explícito sobre formatos e garantias entre produtor e consumidor. | Validação de exercícios |
| teste unitário (unit test) | unit test | Verificação automatizada de uma menor unidade de comportamento. | validacao_formulas.md |
| teste de integração (integration test) | integration test | Verificação da cooperação entre vários componentes. | compilar_e_testar.py |
| mock (mock) | mock | Objeto falso que simula dependência e registra chamadas. | Teste de KDF sem Argon2 local |
| stub (stub) | stub | Implementação mínima que devolve resposta fixa. | Isolamento de rede |
| integração contínua (continuous integration) | continuous integration | Prática de integrar e verificar mudanças com frequência. | Pipeline do repositório |
| deploy (deployment) | deployment | Colocação de uma versão em execução no ambiente de destino. | Publicação de relatórios |
| rollback (rollback) | rollback | Volta controlada a uma versão anterior após falha. | Plano de recuperação |
| controle de versão (version control) | version control | Registro histórico de mudanças em arquivos. | git no repositório FORGE |
| commit (commit) | commit | Registro atômico de um conjunto de mudanças. | Histórico do projeto |
| branch (branch) | branch | Linha de desenvolvimento independente dentro do repositório. | Trabalho isolado de fases |
| merge (merge) | merge | Integração de histórias de duas branches. | Fechamento de fase |
| bug (bug) | bug | Comportamento observado diferente do especificado. | Caderno de erros |
| regressão (regression) | regression | Falha nova em comportamento que antes funcionava. | Suite de validação |
| dívida técnica (technical debt) | technical debt | Custo futuro criado por soluções provisórias. | Pendências registradas |
| log (log) | log | Registro cronológico de eventos de execução. | logs/compilacao.md |
| observabilidade (observability) | observability | Capacidade de inferir o estado interno a partir de sinais externos. | Logs, métricas e traços |
| domínio (domain) | domain | Área de conhecimento e regras que o software modela. | Fórmulas e entropia como domínios |

---

## 5. Ciência do Estudo (Learning Science)

| Português (pt-BR) | English | Definição curta (pt-BR) | Uso típico |
| --- | --- | --- | --- |
| prática de recuperação (retrieval practice) | retrieval practice | Tentativa de evocar informação sem consultar a fonte. | metodologias.md |
| repetição espaçada (spaced repetition) | spaced repetition | Revisão distribuída em intervalos crescentes. | Dias 1, 3, 7, 16 e 35 |
| recuperação espaçada (spaced retrieval) | spaced retrieval | Recuperação da memória em momentos separados no tempo. | Cartões do Anki do FORGE |
| intercalação (interleaving) | interleaving | Mistura de tópicos diferentes em uma mesma sessão. | Derivadas e integrais alternadas |
| prática distribuída (distributed practice) | distributed practice | Estudo repartido em várias sessões em vez de uma só. | Rotina de 3 horas |
| efeito de teste (testing effect) | testing effect | Melhora de retenção quando o teste faz parte do estudo. | Simulados sem nota |
| curva do esquecimento (forgetting curve) | forgetting curve | Descrição da queda de retenção ao longo do tempo sem revisão. | Justificativa das revisões |
| cartão de memória (flashcard) | flashcard | Pergunta curta com resposta oculta usada para recuperação. | forge_matematica.csv |
| caderno de erros (error log) | error log | Registro pessoal de erros com causa e correção. | Bloco E da rotina |
| metacognição (metacognition) | metacognition | Observação e ajuste da própria forma de estudar. | Julgamento de aprendizagem |
| julgamento de aprendizagem (judgment of learning) | judgment of learning | Estimativa que o estudante faz do próprio domínio. | Ilusão de competência |
| ilusão de competência (illusion of competence) | illusion of competence | Sensação de saber causada por fluência na leitura. | Releitura sem teste |
| fluência (fluency) | fluency | Facilidade de processar um texto ou procedimento. | Diferença entre ler e resolver |
| carga cognitiva (cognitive load) | cognitive load | Quantidade de esforço mental exigida por uma tarefa. | Divisão de blocos de estudo |
| esquema (schema) | schema | Estrutura mental que organiza conhecimento prévio. | Mapas conceituais |
| transferência (transfer) | transfer | Uso de aprendizado anterior em situação nova. | Álgebra aplicada a C |
| analogia (analogy) | analogy | Comparação entre estruturas para apoiar compreensão. | Síntese Feynman |
| técnica Feynman (Feynman technique) | Feynman technique | Explicação simples em voz alta ou por escrito para revelar lacunas. | Gate de domínio do FORGE |
| prática deliberada (deliberate practice) | deliberate practice | Treino focado no ponto mais fraco com feedback. | Erros de matrizes |
| intenção de implementação (implementation intention) | implementation intention | Plano condicional do tipo "se... então..." com gatilho concreto. | anti_procrastinacao.md |
| procrastinação (procrastination) | procrastination | Adiamento voluntário de tarefa importante com consequência ruim. | Diagnóstico de quatro raízes |
| motivação intrínseca (intrinsic motivation) | intrinsic motivation | Interesse pela atividade em si, não por recompensa externa. | Escolha de projetos |
| mentalidade de crescimento (growth mindset) | growth mindset | Crença de que a competência pode ser desenvolvida com esforço e estratégia. | Interpretação de erros |
| simulado (mock exam) | mock exam | Prova cronometrada usada como prática e diagnóstico. | simulado_01.md a 03 |
| sono (sleep) | sleep | Estado de repouso ligado à consolidação da memória. | Higiene da rotina |
| eficiência de aprendizado (learning efficiency) | learning efficiency | Resultado obtido por unidade de tempo de estudo. | Comparação de métodos |
| reforço (reinforcement) | reinforcement | Estímulo que aumenta a probabilidade de repetir um comportamento. | Recompensas de rotina |

---

## 6. Criptografia (Cryptography)

| Português (pt-BR) | English | Definição curta (pt-BR) | Uso típico |
| --- | --- | --- | --- |
| entropia (entropy) | entropy | Incerteza média de uma fonte, medida em bits. | arquitetura_criptografica.md, seção 1 |
| texto claro (plaintext) | plaintext | Dado antes da cifragem. | Fluxo do cofre CofraForge |
| cifrotexto (ciphertext) | ciphertext | Dado depois da cifragem, sem sentido legível. | Corpo do arquivo do cofre |
| cifragem (encryption) | encryption | Transformação reversível do texto claro em cifrotexto sob uma chave. | AEAD do cofre |
| decifragem (decryption) | decryption | Transformação inversa, feita com a chave correta. | Abertura do cofre |
| chave (key) | key | Segredo que parametriza uma operação criptográfica. | Chave mestra e chave do cofre |
| gerador pseudoaleatório (PRNG) | pseudorandom number generator | Algoritmo determinístico que expande uma semente em sequência de números. | Comparação com CSPRNG |
| gerador criptográfico (CSPRNG) | cryptographically secure pseudorandom number generator | Gerador resistente à previsão e à retrospecção, alimentado pelo sistema operacional. | referencia_01_senha_csprng.c |
| semente (seed) | seed | Valor inicial que determina a sequência de um gerador determinístico. | Erro de srand(time(NULL)) |
| viés de módulo (modulo bias) | modulo bias | Distribuição não uniforme criada ao reduzir valores com operação de módulo. | Rejeição com limite L |
| sal (salt) | salt | Valor público e único por registro que impede tabelas arco-íris. | Cabeçalho do cofre |
| nonce (nonce) | nonce | Valor usado uma única vez sob uma mesma chave. | GCM e XChaCha20 |
| número usado uma vez (number used once) | number used once | Leitura explícita da sigla nonce em documentação. | Revisão de parâmetros |
| resumo criptográfico (hash function) | hash function | Função rápida que produz impressão digital de tamanho fixo do dado. | SHA-256 de integridade |
| colisão (collision) | collision | Duas entradas distintas com o mesmo resumo. | Proibição de MD5 e SHA-1 |
| função de derivação de chave (KDF) | key derivation function | Função deliberadamente custosa que transforma senha em chave. | Argon2id, scrypt, PBKDF2 |
| autenticação com dados associados (AEAD) | authenticated encryption with associated data | Cifragem que também verifica integridade e inclui dados autenticados. | AES-256-GCM |
| etiqueta de autenticação (authentication tag) | authentication tag | Valor curto que comprova integridade do cifrotexto e do AAD. | Falha de verificação genérica |
| dados associados adicionais (AAD) | additional authenticated data | Dados autenticados mas não cifrados, como versão e sal. | Defesa contra downgrade |
| código de autenticação de mensagem (MAC) | message authentication code | Etiqueta calculada com chave secreta para verificar integridade. | HMAC em TOTP |
| assinatura digital (digital signature) | digital signature | Prova de autoria e integridade feita com chave privada. | CertificateVerify do TLS |
| infraestrutura de chaves públicas (PKI) | public key infrastructure | Conjunto de autoridades e procedimentos que ligam identidades a chaves públicas. | Cadeia X.509 |
| certificado (certificate) | certificate | Documento digital que associa uma chave pública a uma identidade. | estudos.local fictício |
| sigilo perfeito para frente (PFS) | perfect forward secrecy | Propriedade pela qual uma chave antiga comprometida não decifra sessões passadas. | ECDHE com X25519 |
| homem-no-meio (man-in-the-middle) | man-in-the-middle | Ataque em que o adversário se interpõe nas duas pontas da comunicação. | Certificado fraudulento |
| ficha de acesso (token) | token | Portador de estado ou permissões usado em autenticação. | JWT e PASETO |
| prova de chave para troca de código (PKCE) | proof key for code exchange | Mecanismo que vincula o código de autorização ao cliente que o iniciou. | OAuth 2.0 |
| autenticação web (WebAuthn) | WebAuthn | Padrão de autenticação com credenciais de chave pública ligadas à origem. | Substituição de TOTP |
| senha de uso único baseada em tempo (TOTP) | time-based one-time password | Código curto derivado de chave compartilhada e do tempo. | Passo de 30 segundos |
| força bruta (brute force) | brute force | Tentativa exaustiva de combinações até acertar a chave ou senha. | Estimativa de varredura |
| tabela arco-íris (rainbow table) | rainbow table | Tabela pré-computada de resumos para acelerar quebra de senhas. | Defesa com sal único |

---

## Falsos amigos e armadilhas de tradução

Armadilhas que aparecem com frequência quando se estuda matemática e programação em material bilíngue. A coluna da direita mostra o sentido correto no contexto do FORGE.

| Termo em inglês | Tradução ingênua a evitar | Interpretação correta (pt-BR) | Exemplo de uso |
| --- | --- | --- | --- |
| event | "acontecimento" solto | evento é conjunto de resultados do espaço amostral | P(A ∪ B) combina dois eventos |
| integral | "integral" como sinônimo de inteiro | integral é a operação de soma contínua; inteiro é integer | ∫ f(x) dx é uma integral, não um inteiro |
| integer | "integral" | integer é número sem parte fracionária | int em C guarda um integer |
| buffer | "cache" | buffer é área temporária de dados em trânsito; cache é cópia para acesso rápido | buffer de recebimento do servidor TCP |
| cache | "buffer" | cache guarda cópia para reutilização, não dados em trânsito | cache de respostas DNS |
| assert | "afirmar" em texto | assert é verificação que aborta quando a condição é falsa | assert(tamanho <= capacidade) |
| eventually | "eventualmente" no sentido de talvez | em inglês técnico significa ao final, depois de algum tempo | o loop converge eventually |
| current | "atual" confundido com actual | current é atual; actual é real, de fato | versão atual, resultado real |
| data | "data" do calendário | data em inglês é dado; date é data | data packet = pacote de dados |
| argument | "argumento" retórico | argumento é o valor efetivo passado na chamada | f(3): 3 é argumento |
| parameter | "parâmetro" da chamada | parameter é o nome formal na declaração | int f(int x): x é parameter |
| accuracy | "precisão" | accuracy é exatidão, proximidade do valor verdadeiro; precision é precisão, repetibilidade | medida exata, mas imprecisa |
| precision | "exatidão" | precision é repetibilidade ou número de dígitos significativos | ponto flutuante de precisão simples |
| library | "livraria" | biblioteca de código reutilizável | standard library de C |
| overflow | "transbordamento" de líquido | estouro: valor ou escrita além do limite | stack overflow = estouro de pilha |
| claim | "reivindicação" jurídica | alegação dentro de um token, como iss e exp | payload com claims |
| record | "recorde" esportivo | registro de dados, linha de tabela ou estrutura | registro de credencial |
| sanitize | "sanitizar" no sentido médico | higienizar, validar e limpar entrada ou memória | sanitize input antes de copiar |
| performance | "performance" artística | desempenho de um sistema | latência e desempenho |
| rate | "taxa" em todos os casos | rate é razão por tempo, tarifa ou parâmetro de aprendizado; contexto decide | learning rate = taxa de aprendizagem |
| random | "muito aleatório" com intensificador | random descreve origem imprevisível; não implica distribuição uniforme | random, mas enviesado |
| token | "ficha" de teatro | ficha de acesso ou unidade léxica, conforme o contexto | access token |
| key | "chave" de fechadura sempre | chave pode ser segredo criptográfico ou campo de identificação | chave primária, chave privada |
| nonce | "sem sentido" em gíria | número usado uma vez sob a mesma chave | nonce de 12 bytes no GCM |

---

## Como usar este glossário na revisão espaçada

1. **Transforme linha em pergunta.** Em vez de reler a tabela, cubra a coluna "English" e tente evocar o equivalente; só depois confira. O esforço de recuperação é o que fixa o termo.
2. **Agende em intervalos crescentes.** Revise um bloco de 20 termos nos dias 1, 3, 7, 16 e 35, repetindo a mesma ordem de perguntas para comparar desempenho.
3. **Misture áreas no mesmo dia.** Coloque cinco termos de Matemática, cinco de C, cinco de Redes e cinco de Criptografia em uma única sessão; a intercalação evita que a resposta venha apenas da posição na tabela.
4. **Exija uso, não definição decorada.** Para cada termo, escreva uma frase curta com o arquivo do FORGE onde ele aparece, como chave (key) em `saida/extras/arquitetura_criptografica.md`.
5. **Marque falsos amigos com prioridade.** As entradas da seção de armadilhas merecem revisão mais frequente, porque um erro de tradução muda o significado técnico sem soar estranho.
6. **Feche o ciclo com metacognição.** Antes de cada revisão, anote quantos termos você acha que acerta; depois compare com o resultado real e ajuste o tamanho do próximo bloco.

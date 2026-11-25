window.LAB_CATALOG = (window.LAB_CATALOG || []).concat([
  {
    id: 'net-encapsulamento',
    title: 'Encapsulamento camada a camada',
    area: 'Redes',
    level: 'Base',
    prerequisites: ['Noções de bits, bytes e hexadecimal', 'Ideia de protocolo em camadas'],
    objective: 'Representar em simulador como os dados da aplicação recebem cabeçalhos de transporte, rede e enlace, e como ocorre a reversão no receptor.',
    concepts: ['Modelo TCP-IP', 'PDU', 'cabeçalho', 'payload', 'MTU', 'desencapsulamento'],
    environment: 'Simulador de encapsulamento da Forge, executado localmente, sem tráfego real.',
    safety: 'Exercício integralmente simulado: nenhum quadro é enviado à rede. Usar payloads fictícios; não inserir credenciais, tokens ou dados pessoais reais nos campos.',
    steps: [
      'Definir uma mensagem curta de texto como payload da aplicação.',
      'Escolher TCP ou UDP e acrescentar o cabeçalho de transporte correspondente.',
      'Acrescentar o cabeçalho IP com origem, destino e TTL simulados.',
      'Acrescentar o cabeçalho de enlace e verificar o tamanho total contra a MTU escolhida.',
      'Reproduzir o caminho inverso no receptor e conferir se o payload original é recuperado.'
    ],
    expectedResult: 'Quadro com quatro camadas, tamanhos de cabeçalho coerentes, total dentro da MTU e payload final idêntico ao inicial.',
    evidence: 'Arquivo `encapsulamento-camadas.md` com a tabela de PDUs, os tamanhos e a captura de tela do simulador.',
    commonErrors: ['Somar o cabeçalho duas vezes', 'Trocar a ordem das camadas', 'Ignorar o limite da MTU', 'Confundir PDU de redes com quadro de enlace'],
    reflection: [
      'Por que o receptor consegue remover cabeçalhos sem conhecer a aplicação?',
      'O que muda se o payload ultrapassar a MTU?',
      'Qual camada seria responsável por entregar a mensagem ao processo correto?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Repetir com IPv6', 'Comparar encapsulamento TCP e UDP', 'Simular fragmentação por MTU menor'],
    executionType: 'simulado'
  },
  {
    id: 'net-cidr-passo-a-passo',
    title: 'CIDR passo a passo',
    area: 'Redes',
    level: 'Base',
    prerequisites: ['Representação binária de números', 'Noção de endereço IPv4'],
    objective: 'Calcular redes, máscaras, broadcast e intervalos de hosts a partir de prefixos CIDR, usando conversão binária explícita.',
    concepts: ['CIDR', 'máscara de rede', 'prefixo', 'endereço de rede', 'broadcast', 'blocos de endereços'],
    environment: 'Planilha ou simulador de sub-redes da Forge; papel e lápis como apoio.',
    safety: 'Exercício apenas com endereços de documentação e simulação; não aplicar os cálculos a roteadores, firewalls ou redes reais sem autorização formal e revisão.',
    steps: [
      'Converter o prefixo escolhido em máscara decimal e binária.',
      'Converter o endereço IP para binário e aplicar a operação E lógica com a máscara.',
      'Anotar o endereço de rede e calcular o broadcast pelo preenchimento dos bits de host.',
      'Listar o primeiro e o último host utilizáveis e a quantidade total de hosts.',
      'Validar o resultado no simulador e corrigir divergências.'
    ],
    expectedResult: 'Bloco corretamente delimitado, com máscara, rede, broadcast e intervalo de hosts coerentes entre si.',
    evidence: 'Planilha `cidr-calculos.xlsx` com as conversões binárias e os resultados validados.',
    commonErrors: ['Confundir número de bits de rede e de host', 'Off-by-one no primeiro ou último host', 'Esquecer o endereço de broadcast', 'Usar máscara invertida'],
    reflection: [
      'Por que o endereço de rede não pode ser atribuído a um host?',
      'Como o prefixo /30 difere de /24 em quantidade de hosts?',
      'Quando um bloco CIDR não pode ser agregado em outro maior?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Praticar agregação de rotas', 'Converter o exercício para IPv6', 'Resolver um caso de sub-redes de tamanhos diferentes (VLSM)'],
    executionType: 'simulado'
  },
  {
    id: 'net-roteamento',
    title: 'Roteamento em topologia simulada',
    area: 'Redes',
    level: 'Intermediário',
    prerequisites: ['CIDR', 'Noção de tabela de roteamento', 'Encapsulamento'],
    objective: 'Montar uma topologia de três roteadores simulados e explicar a escolha da próxima parada para diferentes destinos.',
    concepts: ['Tabela de roteamento', 'next hop', 'rota direta', 'rota estática', 'TTL', 'melhor caminho'],
    environment: 'Simulador de redes da Forge com três roteadores e quatro redes lógicas.',
    safety: 'Nenhuma alteração em equipamentos reais: o escopo é restrito ao simulador. Não reproduzir as rotas em produção sem autorização e janela de mudança aprovadas.',
    steps: [
      'Desenhar a topologia e atribuir redes ponto a ponto entre roteadores.',
      'Preencher as rotas diretas na tabela de cada roteador.',
      'Acrescentar rotas estáticas para as redes remotas.',
      'Simular o envio de pacotes entre hosts de redes diferentes e observar o next hop.',
      'Retirar uma rota e registrar o comportamento de fallback.'
    ],
    expectedResult: 'Pacotes chegam ao destino em todos os cenários previstos; a tabela mostra apenas rotas válidas e o TTL diminui a cada salto.',
    evidence: 'Diagrama `topologia-roteamento.png` e arquivo `tabelas-roteamento.md` com as rotas e os traçados simulados.',
    commonErrors: ['Next hop apontando para a própria interface', 'Máscara diferente da usada na topologia', 'Esquecer rota de retorno', 'Interpretar TTL como métrica de custo'],
    reflection: [
      'O que acontece quando duas rotas para o mesmo destino têm máscaras diferentes?',
      'Por que a rota de retorno é necessária?',
      'Como uma rota estática errada se manifesta no traçado?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Introduzir rota padrão', 'Comparar com roteamento dinâmico simulado', 'Criar um cenário de loop e explicar a detecção'],
    executionType: 'simulado'
  },
  {
    id: 'net-dns',
    title: 'Resolução DNS no laboratório',
    area: 'Redes',
    level: 'Base',
    prerequisites: ['Conceito de nome e endereço IP', 'Noção de cliente e servidor', 'Uso básico de terminal'],
    objective: 'Observar uma consulta DNS real em ambiente controlado e relacionar os registros obtidos com a cadeia de resolução.',
    concepts: ['DNS', 'resolutor', 'registros A, AAAA e CNAME', 'cache DNS', 'TTL', 'recursividade'],
    environment: 'Máquina virtual isolada do laboratório, resolutor autorizado internamente e ferramenta de consulta em linha de comando.',
    safety: 'Consultar somente o resolutor autorizado do laboratório e os nomes definidos no escopo do exercício. Não realizar varredura de servidores DNS externos nem consultas em massa; registrar o escopo autorizado no relatório.',
    steps: [
      'Confirmar qual resolutor está configurado na máquina e documentar o escopo autorizado.',
      'Consultar um nome de domínio de teste e anotar o tipo de registro obtido.',
      'Repetir a consulta e comparar o TTL entre as respostas.',
      'Consultar um registro CNAME e seguir a cadeia até o nome canônico.',
      'Limpar o cache local do resolutor do laboratório e repetir uma consulta.'
    ],
    expectedResult: 'Respostas com registros coerentes, TTL decrescente entre consultas e cadeia CNAME explicitada.',
    evidence: 'Relatório `dns-resolucao.md` com comandos, saídas, TTLs observados e data/hora das consultas.',
    commonErrors: ['Confundir CNAME com registro A', 'Ignorar a influência do cache', 'Consultar domínio fora do escopo', 'Trocar resolutor autorizado por público sem registrar'],
    reflection: [
      'Por que o TTL muda entre consultas?',
      'Qual a diferença entre resolução recursiva e iterativa?',
      'O que acontece se o resolutor do laboratório ficar indisponível?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Comparar IPv4 e IPv6', 'Testar uma consulta negativa', 'Representar a cadeia de resolução em diagrama'],
    executionType: 'execucao-real'
  },
  {
    id: 'net-tcp-handshake',
    title: 'Handshake TCP em simulador',
    area: 'Redes',
    level: 'Base',
    prerequisites: ['Encapsulamento', 'Noção de porta e socket'],
    objective: 'Reconstruir a abertura e o fechamento de uma conexão TCP, identificando flags e números de sequência.',
    concepts: ['TCP', 'SYN', 'SYN-ACK', 'ACK', 'FIN', 'número de sequência', 'estados da conexão'],
    environment: 'Simulador de fluxo TCP da Forge com cronograma de eventos editável.',
    safety: 'Simulação sem conexões reais: nenhum pacote é gerado contra hosts externos. Não usar endereços ou portas de sistemas de produção nos cenários.',
    steps: [
      'Posicionar o cliente e o servidor na linha do tempo e escolher portas fictícias.',
      'Gerar SYN do cliente e conferir o número de sequência inicial.',
      'Gerar SYN-ACK do servidor e observar a relação entre os números de sequência.',
      'Completar com ACK e verificar a transição para o estado estabelecido.',
      'Simular o fechamento com FIN e ACK e anotar os estados finais.'
    ],
    expectedResult: 'Diagrama de sequência com três passos de abertura, quatro de fechamento e sequências coerentes entre os lados.',
    evidence: 'Arquivo `handshake-tcp.png` com o diagrama de sequência e a legenda das flags.',
    commonErrors: ['Trocar SYN por ACK no primeiro pacote', 'Usar o mesmo número de sequência nos dois lados', 'Esquecer o ACK final', 'Confundir FIN com RST'],
    reflection: [
      'Por que o handshake possui três passos?',
      'O que indica uma conexão reiniciada abruptamente?',
      'Como o número de sequência ajuda a detectar perda?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Simular falha no SYN-ACK', 'Comparar com UDP', 'Representar o estado TIME_WAIT'],
    executionType: 'simulado'
  },
  {
    id: 'net-janela-tcp',
    title: 'Janela TCP e controle de fluxo',
    area: 'Redes',
    level: 'Intermediário',
    prerequisites: ['Handshake TCP', 'Conceito de buffer e recepção'],
    objective: 'Simular o controle de fluxo por janela deslizante e observar o efeito de janelas pequenas, perdas e acknowledgments.',
    concepts: ['Janela deslizante', 'ACK cumulativo', 'receive window', 'congestionamento', 'RTT', 'vazão'],
    environment: 'Simulador de janela TCP da Forge com parâmetros ajustáveis de RTT, perda e tamanho de janela.',
    safety: 'Atividade exclusivamente simulada; não gerar tráfego sintético contra servidores externos e não alterar parâmetros de redes reais. Manter o escopo no simulador.',
    steps: [
      'Configurar RTT fixo e janela inicial e observar a quantidade de segmentos em voo.',
      'Reduzir a janela anunciada pelo receptor e explicar a queda de vazão.',
      'Introduzir perda de um segmento e identificar o ACK duplicado.',
      'Aumentar a janela progressivamente e registrar a evolução da vazão.',
      'Comparar os gráficos das execuções e justificar as diferenças.'
    ],
    expectedResult: 'Gráficos mostrando janela, segmentos em voo e vazão coerentes com os parâmetros configurados, incluindo a queda na perda.',
    evidence: 'Relatório `janela-tcp.md` com os gráficos exportados e a tabela de parâmetros de cada execução.',
    commonErrors: ['Confundir janela de recepção com janela de congestionamento', 'Interpretar ACK duplicado como confirmação extra', 'Ignorar o RTT na análise da vazão', 'Achar que janela maior sempre aumenta a vazão'],
    reflection: [
      'Como a janela limita o uso do enlace?',
      'Por que a perda de segmento reduz drasticamente a vazão?',
      'Qual a relação entre RTT e o tempo de recuperação?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Comparar Reno e Cubic', 'Simular fluxos concorrentes', 'Calcular o produto delay-largura de banda'],
    executionType: 'simulado'
  },
  {
    id: 'net-analise-pcap-exemplo',
    title: 'Análise de PCAP de exemplo',
    area: 'Redes',
    level: 'Intermediário',
    prerequisites: ['Leitura de cabeçalhos', 'TCP e DNS básicos', 'Uso de visualizador de capturas'],
    objective: 'Interpretar uma captura de exemplo pronta, identificando conversas, fluxos e anomalias sem gerar tráfego adicional.',
    concepts: ['PCAP', 'fluxo TCP', 'conversa', 'campos de cabeçalho', 'timestamps', 'análise forense básica'],
    environment: 'Arquivo de captura fornecido pelo instrutor e visualizador de pacotes offline.',
    safety: 'Usar apenas a captura de exemplo fornecida e autorizada para a aula. Não capturar rede alheia, não republicar o arquivo fora do escopo e anonimizar endereços sensíveis antes de compartilhar anotações.',
    steps: [
      'Abrir a captura offline e listar as conversas visíveis, sem gerar novos pacotes.',
      'Identificar a consulta DNS e associá-la à conexão TCP posterior.',
      'Localizar o handshake TCP e conferir portas e flags.',
      'Examinar a conexão TLS e distinguir ClientHello dos registros cifrados.',
      'Comparar uma requisição HTTP com uma sessão HTTPS e justificar a diferença observável.',
      'Procurar retransmissões e registrar seus números de sequência.',
      'Investigar indícios de MTU e fragmentação, e observar o ARP da captura.'
    ],
    expectedResult: 'Relatório com as sete observações respondidas, timestamps citados e conclusões sustentadas por campos do pacote.',
    evidence: 'Arquivo `analise-pcap-exemplo.md` com as sete respostas e capturas de tela dos pacotes analisados.',
    commonErrors: ['Achar que TLS revela o conteúdo HTTP', 'Confundir retransmissão com duplicata legítima', 'Ignorar o carimbo de tempo', 'Atribuir a uma Conversa dados de outra'],
    reflection: [
      'Quais informações permanecem visíveis mesmo com ciframento?',
      'Como diferenciar perda de pacote de reordenação?',
      'O que a captura não consegue provar sozinha?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Exportar um fluxo TCP para leitura', 'Contar retransmissões por conversa', 'Criar um resumo estatístico da captura'],
    executionType: 'analise-captura'
  },
  {
    id: 'net-filtros-wireshark',
    title: 'Filtros Wireshark em sete cenários',
    area: 'Redes',
    level: 'Intermediário',
    prerequisites: ['Captura de exemplo disponível', 'DNS, TCP e HTTP básicos', 'Noção de expressões de filtro'],
    objective: 'Aplicar filtros de exibição para responder sete perguntas específicas sobre uma captura autorizada de laboratório.',
    concepts: ['Filtro de exibição', 'filtro de captura', 'dns', 'tcp.handshake', 'tls', 'http', 'tcp.analysis.retransmission', 'arp'],
    environment: 'Captura de exemplo fornecida pelo instrutor e Wireshark em modo offline.',
    safety: 'Somente analisar capturas obtidas com autorização explícita e dentro do escopo da aula. Não ativar modo promíscuo em redes de terceiros; não capturar credenciais nem tráfego de usuários reais; manter o arquivo no ambiente do laboratório.',
    steps: [
      'Cenário 1 — DNS: filtrar consultas e respostas e identificar o nome consultado e o endereço devolvido.',
      'Cenário 2 — Handshake TCP: isolar SYN, SYN-ACK e ACK de uma conversa e anotar portas e sequências.',
      'Cenário 3 — TLS: filtrar ClientHello e ServerHello e distinguir a negociação dos registros cifrados.',
      'Cenário 4 — HTTP versus HTTPS: comparar uma requisição em texto claro com uma sessão protegida na mesma captura.',
      'Cenário 5 — Retransmissões: aplicar filtro de retransmissão e relacionar cada pacote ao original.',
      'Cenário 6 — MTU: procurar fragmentação e pacotes grandes, inferindo o limite negociado.',
      'Cenário 7 — ARP: isolar requisições e respostas ARP e associá-las aos endereços IP envolvidos.'
    ],
    expectedResult: 'Sete expressões de filtro documentadas, cada uma com o pacote de evidência correspondente e uma conclusão curta.',
    evidence: 'Arquivo `filtros-wireshark.md` com as sete expressões, os resultados observados e capturas de tela da lista filtrada.',
    commonErrors: ['Usar sintaxe de filtro de captura onde cabe filtro de exibição', 'Filtrar por IP e perder o fluxo relacionado', 'Considerar todo pacote grande como fragmentado', 'Confundir ARP com DNS'],
    reflection: [
      'Por que um filtro pode esconder justamente o pacote que explica o problema?',
      'Como confirmar que uma retransmissão é real e não reordenação?',
      'Qual cenário exigiu combinar mais de uma condição e por quê?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Salvar os sete filtros como expressões nomeadas', 'Repetir a análise em captura com TLS 1.3', 'Criar um mapa de conversas a partir dos filtros'],
    executionType: 'analise-captura'
  },
  {
    id: 'net-cliente-servidor-local',
    title: 'Cliente e servidor local',
    area: 'Redes',
    level: 'Intermediário',
    prerequisites: ['Sockets ou ferramentas de rede básicas', 'TCP e portas', 'Terminal'],
    objective: 'Estabelecer uma comunicação cliente-servidor restrita ao loopback e observar a troca de mensagens e o fechamento da conexão.',
    concepts: ['loopback', 'porta', 'bind', 'listen', 'accept', 'request e response', 'encerramento gracefully'],
    environment: 'Duas sessões de terminal na mesma máquina virtual isolada, usando apenas 127.0.0.1.',
    safety: 'Escopo restrito a 127.0.0.1 e à máquina do laboratório; não vincular o serviço a 0.0.0.0 e não liberar portas em firewall. Encerrar o processo de forma cooperativa com SIGTERM, sem recorrer a sinais forçados; nunca usar mensagens com dados reais.',
    steps: [
      'Iniciar o servidor de eco vinculado a 127.0.0.1 em porta alta definida pelo instrutor.',
      'Conectar um cliente local e enviar uma mensagem curta de teste.',
      'Verificar a resposta recebida e conferir a porta de origem do cliente.',
      'Abrir um segundo cliente simultâneo e observar como o servidor lida com a conexão.',
      'Encerrar o cliente e o servidor de forma ordenada e registrar a saída.'
    ],
    expectedResult: 'Mensagens enviadas são devolvidas integralmente, as duas conexões são identificadas e o encerramento ocorre sem erro.',
    evidence: 'Arquivo `cliente-servidor-local.md` com os comandos, as saídas dos dois lados e o log de encerramento.',
    commonErrors: ['Vincular o servidor a todas as interfaces', 'Usar porta já ocupada', 'Esquecer de fechar o socket do cliente', 'Trocar ordem entre listen e accept'],
    reflection: [
      'Por que usar loopback neste exercício?',
      'O que mudaria se o servidor escutasse em todas as interfaces?',
      'Como o servidor distingue dois clientes simultâneos?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Trocar TCP por UDP', 'Adicionar múltiplos clientes', 'Registrar a troca com captura autorizada em loopback'],
    executionType: 'execucao-real'
  },
  {
    id: 'linux-terminal-interativo',
    title: 'Terminal interativo e usuário de laboratório',
    area: 'Linux',
    level: 'Base',
    prerequisites: ['Noção de linha de comando', 'Acesso a máquina virtual isolada'],
    objective: 'Navegar pelo terminal, interpretar o prompt e criar um usuário e um grupo exclusivos para o laboratório.',
    concepts: ['shell', 'prompt', 'cwd', 'usuário', 'grupo', 'id', 'whoami'],
    environment: 'Máquina virtual Linux isolada, sessão com privilégios administrativos apenas para a criação inicial.',
    safety: 'Operar somente na máquina de laboratório e no usuário criado para o exercício. Usar privilégios administrativos apenas no comando necessário; nunca em toda a sessão. Confirmar nome e UID antes de criar a conta.',
    steps: [
      'Abrir o terminal e registrar whoami, hostname e diretório atual.',
      'Navegar entre diretórios usando caminhos absolutos e relativos.',
      'Criar o grupo de laboratório e o usuário associado a ele.',
      'Verificar id e grupos do novo usuário.',
      'Entrar na conta criada e confirmar que o prompt e o diretório inicial são os esperados.'
    ],
    expectedResult: 'Usuário e grupo corretos, sessão iniciada na conta de laboratório e histórico de comandos registrado.',
    evidence: 'Arquivo `terminal-usuario.md` com a saída de whoami, id e o histórico comentado dos comandos.',
    commonErrors: ['Confundir usuário e grupo', 'Esquecer de verificar o UID', 'Operar como root durante toda a prática', 'Usar caminhos relativos sem conferir o diretório atual'],
    reflection: [
      'O que o prompt revela sobre a sessão atual?',
      'Por que criar um usuário específico para o laboratório?',
      'Qual a diferença entre caminho absoluto e relativo?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Personalizar o prompt', 'Comparar shell login e não login', 'Listar variáveis de ambiente relevantes'],
    executionType: 'execucao-real'
  },
  {
    id: 'linux-permissoes',
    title: 'Permissões mínimas em arquivos e diretórios',
    area: 'Linux',
    level: 'Base',
    prerequisites: ['Terminal interativo', 'Usuário e grupo de laboratório'],
    objective: 'Configurar permissões suficientes para um cenário de trabalho, aplicando o princípio do menor privilégio.',
    concepts: ['usuário', 'grupo', 'outros', 'rwx', 'umask', 'chown', 'chmod', 'sticky bit'],
    environment: 'Diretório de testes dentro da área do usuário de laboratório, em máquina virtual isolada.',
    safety: 'Nunca ampliar permissões de forma global: escolher o menor conjunto que permita a tarefa e justificar cada bit. Não alterar permissões de arquivos de sistema, binários ou diretórios fora do escopo do laboratório.',
    steps: [
      'Criar um diretório de projeto e arquivos de teste pertencentes ao usuário do laboratório.',
      'Listar permissões iniciais e registrar o efeito da umask.',
      'Conceder leitura e escrita apenas ao proprietário e leitura ao grupo de laboratório.',
      'Testar o acesso com o usuário do laboratório e com outro usuário sem permissão.',
      'Ajustar o grupo proprietário e verificar o resultado final.'
    ],
    expectedResult: 'Arquivos legíveis pelo grupo autorizado, inacessíveis aos demais e com dono correto; nenhuma permissão global concedida.',
    evidence: 'Arquivo `permissoes-minimas.md` com a saída de ls antes e depois e a justificativa de cada bit.',
    commonErrors: ['Conceder permissão a todos para resolver um erro rapidamente', 'Esquecer a permissão de execução em diretório', 'Confundir dono e grupo', 'Aplicar permissão recursiva sem inspecionar o conteúdo'],
    reflection: [
      'Por que a permissão de execução em diretório é diferente de arquivo?',
      'Como a umask afeta arquivos recém-criados?',
      'Qual risco existe em conceder escrita a todos?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Testar sticky bit em diretório compartilhado', 'Exercitar ACLs', 'Comparar permissões simbólicas e octais'],
    executionType: 'execucao-real'
  },
  {
    id: 'linux-pipes',
    title: 'Pipes e composição de comandos',
    area: 'Linux',
    level: 'Base',
    prerequisites: ['Terminal interativo', 'Conceito de stdout e stderr'],
    objective: 'Compor comandos simples com pipes e redirecionamentos para transformar texto de forma previsível.',
    concepts: ['stdin', 'stdout', 'stderr', 'pipe', 'redirecionamento', 'filtragem'],
    environment: 'Shell interativo na máquina de laboratório com arquivos de texto fictícios.',
    safety: 'Ler e gravar somente dentro do diretório do laboratório. Conferir o destino antes de redirecionar saída para evitar sobrescrever arquivos de sistema; não usar pipes para ocultar erros de comandos mal sucedidos.',
    steps: [
      'Criar arquivo de texto de exemplo com entradas repetidas.',
      'Encadear comandos para filtrar linhas e contar ocorrências.',
      'Redirecionar stderr para arquivo separado e observar a diferença.',
      'Ordenar e eliminar duplicatas com saída intermediária.',
      'Comparar o resultado final com uma contagem manual.'
    ],
    expectedResult: 'Saída filtrada e contagem correta, com erros registrados separadamente e arquivo final gravado no diretório previsto.',
    evidence: 'Arquivo `pipes-comandos.md` com os comandos usados, as saídas e a contagem de referência.',
    commonErrors: ['Redirecionar para o arquivo de entrada', 'Ignorar stderr', 'Ordenar depois de contar sem necessidade', 'Achar que pipe sempre preserva a ordem original'],
    reflection: [
      'Qual comando do pipe poderia ser substituído por uma opção do próprio programa?',
      'Por que separar stderr do stdout?',
      'Como você validaria o resultado sem reler o arquivo inteiro?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Medir tempo de execução de duas composições', 'Usar tee para registrar etapas intermediárias', 'Tratar codificação de caracteres'],
    executionType: 'execucao-real'
  },
  {
    id: 'linux-processos',
    title: 'Observação de processos e consumo de recursos',
    area: 'Linux',
    level: 'Intermediário',
    prerequisites: ['Terminal interativo', 'Noção de processo e PID'],
    objective: 'Observar processos em execução, sua árvore e seu consumo de CPU e memória, relacionando estado e recursos.',
    concepts: ['PID', 'PPID', 'estado do processo', 'CPU', 'memória', 'nice', '/proc'],
    environment: 'Máquina virtual de laboratório com processo de teste controlado pelo próprio aluno.',
    safety: 'Inspecionar apenas processos da própria sessão e processos de sistema sem modificá-los. Não encerrar processos que não foram criados neste exercício e não alterar prioridades de serviços reais.',
    steps: [
      'Iniciar um processo de teste de curta duração pertencente ao usuário do laboratório.',
      'Listar processos e identificar PID, PPID e estado.',
      'Medir CPU e memória do processo de teste em dois momentos.',
      'Observar a árvore de processos e o consumo de um processo filho.',
      'Encerrar o processo de teste de forma ordenada e confirmar que desapareceu.'
    ],
    expectedResult: 'Tabela com PID, PPID, estado e medidas de CPU e memória, além da confirmação de encerramento do processo criado.',
    evidence: 'Arquivo `processos-recursos.md` com as saídas das listagens e as medidas coletadas.',
    commonErrors: ['Confundir thread e processo', 'Comparar percentual de CPU entre janelas diferentes', 'Encerrar processo errado por PID reutilizado', 'Ignorar o estado do processo'],
    reflection: [
      'Por que o percentual de CPU pode variar entre amostras?',
      'O que a árvore de processos revela sobre origem de um processo?',
      'Como saber se um processo é filho da sua sessão?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Repetir a medição com processo de carga controlada', 'Comparar nice e prioridade', 'Relacionar um processo a entradas de /proc'],
    executionType: 'execucao-real'
  },
  {
    id: 'linux-sinais',
    title: 'Sinais e encerramento controlado',
    area: 'Linux',
    level: 'Intermediário',
    prerequisites: ['Processos', 'Uso de PID'],
    objective: 'Enviar sinais a processos criados no laboratório e comparar o efeito de sinais tratáveis e de terminação.',
    concepts: ['sinal', 'SIGTERM', 'SIGINT', 'SIGKILL', 'trap', 'handler', 'PID'],
    environment: 'Máquina virtual isolada com script de teste escrito pelo aluno.',
    safety: 'Enviar sinais somente a PIDs criados neste exercício e conferir o PID imediatamente antes. Começar sempre com terminação cooperativa (SIGTERM ou SIGINT); usar sinais forçados apenas após diagnóstico e com registro da justificativa. Nunca sinalizar processos de sistema ou de outros usuários.',
    steps: [
      'Criar script de teste que trap SIGTERM e registre uma mensagem antes de sair.',
      'Iniciar o script em segundo plano e anotar o PID.',
      'Enviar SIGTERM e verificar a mensagem de despedida no log.',
      'Repetir com SIGINT e comparar o comportamento.',
      'Registrar em qual situação um sinal forçado seria considerado e por que não foi necessário.'
    ],
    expectedResult: 'Log com as mensagens dos tratadores, processos encerrados de forma controlada e registro claro da decisão sobre sinais.',
    evidence: 'Arquivo `sinais-processo.md` com o script, a saída do log e a lista de PIDs usados.',
    commonErrors: ['Enviar sinal ao PID errado', 'Esquecer que trap deve ser definido antes do loop', 'Recorrer a sinal forçado como primeira ação', 'Comparar sinais sem reiniciar o processo'],
    reflection: [
      'Por que o tratamento de SIGTERM é preferível à interrupção abrupta?',
      'Quais sinais não podem ser tratados?',
      'Como um processo pode impedir seu próprio encerramento cooperativo?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Testar SIGHUP', 'Implementar recarga de configuração via sinal', 'Observar sinais com strace'],
    executionType: 'execucao-real'
  },
  {
    id: 'linux-filesystem',
    title: 'Filesystem, /proc e imagem de disco de teste',
    area: 'Linux',
    level: 'Intermediário',
    prerequisites: ['Terminal interativo', 'Permissões', 'Conceito de dispositivo de bloco'],
    objective: 'Inspecionar a hierarquia de diretórios e /proc, além de montar e desmontar uma imagem de disco criada apenas para teste.',
    concepts: ['hierarquia de diretórios', 'inode', 'montagem', 'loop device', '/proc', 'df', 'du'],
    environment: 'Máquina virtual isolada, diretório de trabalho do aluno e arquivo de imagem de disco criado no exercício.',
    safety: 'Montar somente a imagem criada neste laboratório e apenas em ponto de montagem dentro da área do usuário. Nunca montar dispositivos de sistema ou discos de outros usuários; desmontar ao final e conferir que o ponto de montagem ficou vazio. Não alterar /proc.',
    steps: [
      'Mapear a hierarquia de diretórios principais e registrar o uso de espaço com du.',
      'Inspecionar entradas somente leitura de /proc para o próprio processo.',
      'Criar uma imagem de disco de teste pequena dentro do diretório do laboratório.',
      'Montar a imagem em ponto de montagem temporário e gravar um arquivo de exemplo.',
      'Desmontar a imagem e verificar que o conteúdo persiste ao remontar.'
    ],
    expectedResult: 'Mapa da hierarquia, leitura de /proc sem alterações e imagem montada, gravada, desmontada e remontada com sucesso.',
    evidence: 'Arquivo `filesystem-montagem.md` com comandos, saídas de df e a verificação final da imagem.',
    commonErrors: ['Esquecer de desmontar ao final', 'Escolher ponto de montagem fora do escopo', 'Confundir du e df', 'Tentar gravar em /proc'],
    reflection: [
      'Por que /proc não é um sistema de arquivos comum?',
      'O que acontece se uma imagem for desmontada com arquivo aberto?',
      'Como df e du podem dar números diferentes?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Criar sistema de arquivos com outro tipo', 'Comparar inodes e blocos', 'Inspecionar montagens ativas'],
    executionType: 'execucao-real'
  },
  {
    id: 'linux-shell-scripting',
    title: 'Script de backup com validação',
    area: 'Linux',
    level: 'Intermediário',
    prerequisites: ['Pipes', 'Permissões', 'Noção de variáveis de shell'],
    objective: 'Escrever um script de backup para o diretório do laboratório com parâmetros, validação de argumentos e registro de execução.',
    concepts: ['shell script', 'variáveis', 'parâmetros posicionais', 'test', 'código de saída', 'log', 'cron'],
    environment: 'Máquina virtual isolada, diretório de origem e destino criados pelo aluno.',
    safety: 'O script deve atuar apenas nos caminhos definidos no laboratório e validar argumentos antes de gravar. Não agendar execução automática sem autorização e não apagar arquivos fora do destino controlado. Usar cópia com verificação antes de qualquer remoção.',
    steps: [
      'Definir origem e destino como parâmetros e validar a quantidade de argumentos.',
      'Verificar se a origem existe e se o destino está dentro da área permitida.',
      'Copiar os arquivos para diretório com carimbo de tempo.',
      'Registrar início, fim e código de saída em arquivo de log.',
      'Executar uma vez com argumento inválido e conferir a falha controlada.'
    ],
    expectedResult: 'Backup criado com integridade verificada, log completo e falha controlada quando os parâmetros são inválidos.',
    evidence: 'Arquivos `backup-lab.sh`, `backup-execucao.log` e a lista de arquivos copiados.',
    commonErrors: ['Não validar caminho vazio', 'Usar variáveis sem aspas', 'Ignorar código de saída', 'Gravar log no mesmo diretório de origem sem necessidade'],
    reflection: [
      'O que acontece se o destino estiver cheio?',
      'Por que validar argumentos antes de copiar?',
      'Como tornar a execução repetível sem duplicar dados?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Adicionar retenção de backups', 'Testar execução com `sh -n`', 'Comparar com rsync em modo simulado'],
    executionType: 'execucao-real'
  },
  {
    id: 'linux-logs',
    title: 'Pipeline de logs no laboratório',
    area: 'Linux',
    level: 'Intermediário',
    prerequisites: ['Pipes', 'Filesystem', 'Script de backup'],
    objective: 'Construir um pipeline que coleta, filtra e resume linhas de log geradas localmente, com rotação simples.',
    concepts: ['log', 'severidade', 'timestamp', 'rotação', 'grep', 'awk', 'redirect'],
    environment: 'Máquina virtual isolada com arquivo de log sintético criado pelo aluno.',
    safety: 'Processar apenas logs fictícios gerados neste exercício. Não coletar logs de sistemas de produção nem incluir dados pessoais; armazenar os arquivos no diretório autorizado e proteger o acesso conforme as permissões mínimas.',
    steps: [
      'Gerar arquivo de log sintético com diferentes níveis de severidade.',
      'Filtrar apenas mensagens de erro e aviso com expressões explícitas.',
      'Produzir resumo por nível e por janela de tempo.',
      'Gravar a saída em arquivo separado e registrar o horário da execução.',
      'Simular rotação e confirmar que o arquivo ativo continua gravável.'
    ],
    expectedResult: 'Resumo coerente com o arquivo de entrada, saída filtrada sem ruído e rotação executada sem perda das linhas recentes.',
    evidence: 'Arquivos `log-sintetico.log`, `resumo-logs.txt` e `pipeline-logs.md` com o comando usado.',
    commonErrors: ['Filtrar por texto que aparece no meio da mensagem', 'Perder a última linha ao rotacionar', 'Misturando horários de fusos diferentes', 'Sobrescrever o log original'],
    reflection: [
      'Por que um resumo por nível pode esconder um incidente?',
      'Qual o risco de filtrar apenas a palavra erro?',
      'Como a rotação evita crescimento indefinido?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Analisar padrão horário de erros', 'Criar alerta simples para pico de avisos', 'Comparar formato estruturado e texto livre'],
    executionType: 'execucao-real'
  },
  {
    id: 'linux-systemd',
    title: 'Serviço de usuário local com documentação',
    area: 'Linux',
    level: 'Avançado',
    prerequisites: ['Processos e sinais', 'Logs', 'Noção de unidades systemd'],
    objective: 'Criar um serviço de usuário no escopo da sessão, documentar sua unidade e verificar inicialização, logs e encerramento.',
    concepts: ['systemd --user', 'unit file', 'service', 'journal', 'restart', 'enable', 'status'],
    environment: 'Máquina virtual isolada com sessão de usuário capaz de executar serviços no escopo do usuário.',
    safety: 'Criar e habilitar apenas unidades na área do usuário do laboratório; não modificar unidades do sistema nem serviços de outros usuários. Documentar o escopo e desabilitar o serviço ao final. Usar encerramento cooperativo e registrar qualquer exceção.',
    steps: [
      'Criar script simples de serviço que registre mensagens periódicas no journal.',
      'Escrever unidade de usuário com descrição, comando de execução e reinício controlado.',
      'Recarregar o gerenciador de usuário e iniciar a unidade.',
      'Verificar status e ler entradas do journal da unidade.',
      'Parar e desabilitar a unidade, confirmando que não restou processo ativo.'
    ],
    expectedResult: 'Unidade ativa durante o teste, mensagens presentes no journal e estado final parado e desabilitado, com documentação anexada.',
    evidence: 'Arquivos `lab-service.service`, `systemd-lab.md` com status, trecho do journal e registro de desativação.',
    commonErrors: ['Editar unidades de sistema por engano', 'Caminho absoluto ausente no ExecStart', 'Esquecer recarregar o gerenciador', 'Deixar o serviço habilitado ao final'],
    reflection: [
      'Por que usar serviço de usuário neste laboratório?',
      'O que acontece se o comando de execução terminar com falha?',
      'Como o journal ajuda a diagnosticar uma unidade que não inicia?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Adicionar dependência de tempo', 'Criar unidade de temporizador', 'Comparar serviço de usuário e de sistema'],
    executionType: 'execucao-real'
  },
  {
    id: 'linux-syscalls',
    title: 'Chamadas de sistema open, read e write',
    area: 'Linux',
    level: 'Avançado',
    prerequisites: ['Filesystem', 'Permissões', 'Noções de C'],
    objective: 'Compilar e executar um programa C que utiliza open, read e write em arquivo de teste, observando códigos de retorno e erros.',
    concepts: ['chamada de sistema', 'file descriptor', 'open', 'read', 'write', 'close', 'errno'],
    environment: 'Máquina virtual isolada com compilador C e diretório de arquivos temporários do laboratório.',
    safety: 'O programa deve operar somente em arquivos criados dentro do diretório do laboratório e validar caminhos e retornos. Não executar código com privilégios elevados, não usar syscalls para inspecionar processos de outros usuários e não depositar arquivos em diretórios de sistema.',
    steps: [
      'Escrever programa C que abra arquivo de teste, leia um bloco e escreva uma cópia.',
      'Compilar com avisos habilitados e corrigir todos os avisos relevantes.',
      'Executar com arquivo válido e registrar descritores e quantidades lidas.',
      'Executar com caminho inexistente e interpretar errno.',
      'Acrescentar verificação de close e conferir o arquivo resultante.'
    ],
    expectedResult: 'Cópia idêntica ao arquivo de origem, saída com contagens de bytes e tratamento explícito do erro de caminho inválido.',
    evidence: 'Arquivos `syscalls-lab.c`, `syscalls-saida.txt` e a comparação byte a byte dos arquivos.',
    commonErrors: ['Ignorar retorno de read', 'Não fechar descritor', 'Usar tamanho de buffer sem verificar limite', 'Tratar errno sem limpar estado entre chamadas'],
    reflection: [
      'Por que open pode falhar mesmo com o arquivo existente?',
      'O que acontece se read retornar menos bytes que o solicitado?',
      'Qual a diferença entre chamada de sistema e função de biblioteca?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Testar leitura de dispositivo virtual', 'Comparar buffered e unbuffered I/O', 'Instrumentar chamadas com strace'],
    executionType: 'execucao-real'
  },
  {
    id: 'eng-git-visual',
    title: 'Git visual: branches e merge',
    area: 'Engenharia',
    level: 'Base',
    prerequisites: ['Noção de repositório e commit', 'Uso básico de interface gráfica'],
    objective: 'Visualizar o grafo de commits e praticar criação de branch, merge e resolução de conflito em repositório de exemplo.',
    concepts: ['commit', 'branch', 'merge', 'conflito', 'HEAD', 'grafo de commits', 'rebase'],
    environment: 'Repositório de exemplo local na Forge, com histórico pré-definido e sem conexão com repositório remoto real.',
    safety: 'Trabalhar somente no repositório de exemplo e não reescrever histórico compartilhado. Não inserir segredos ou dados reais nas mensagens de commit; manter o escopo das alterações visível no grafo.',
    steps: [
      'Inspecionar o grafo inicial e identificar branch principal e HEAD.',
      'Criar branch de trabalho e registrar um commit pequeno.',
      'Alternar para a branch principal e criar outro commit no mesmo arquivo.',
      'Realizar merge e resolver o conflito guiado pela interface.',
      'Comparar o grafo antes e depois e descrever o que mudou.'
    ],
    expectedResult: 'Grafo com duas linhas convergentes, conflito resolvido de forma explícita e histórico final coerente.',
    evidence: 'Arquivo `git-visual.md` com capturas do grafo, mensagens de commit e descrição da resolução.',
    commonErrors: ['Confundir merge com rebase', 'Resolver conflito apagando uma das mudanças sem registrar', 'Commitar arquivos não relacionados', 'Não verificar em qual branch está'],
    reflection: [
      'Por que o conflito surgiu justamente naquele arquivo?',
      'O que mudaria se fosse usado rebase?',
      'Como o grafo ajuda a reconstruir a sequência de trabalho?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Praticar rebase interativo', 'Criar tag de versão', 'Comparar estratégias de resolução'],
    executionType: 'simulado'
  },
  {
    id: 'eng-modelagem-requisitos',
    title: 'Modelagem de requisitos com cenários',
    area: 'Engenharia',
    level: 'Intermediário',
    prerequisites: ['Noção de stakeholder', 'Leitura de problema curto'],
    objective: 'Transformar uma narrativa de problema em requisitos funcionais e não funcionais rastreáveis, com critérios de aceite.',
    concepts: ['stakeholder', 'requisito funcional', 'requisito não funcional', 'user story', 'critério de aceite', 'rastreabilidade'],
    environment: 'Editor de diagramas e editor de texto da Forge; estudo de caso fictício fornecido pelo instrutor.',
    safety: 'Trabalhar apenas com o estudo de caso fictício; não usar dados reais de clientes, usuários ou processos internos. Marcar hipóteses explicitamente para não transformar suposição em requisito aprovado.',
    steps: [
      'Listar stakeholders e seus objetivos declarados no enunciado.',
      'Extrair requisitos funcionais e numerá-los.',
      'Extrair requisitos não funcionais com métricas verificáveis.',
      'Escrever critérios de aceite para três requisitos prioritários.',
      'Montar matriz de rastreabilidade requisito x critério x fonte.'
    ],
    expectedResult: 'Documento com requisitos claros, critérios testáveis e matriz relacionando cada item à sua origem no enunciado.',
    evidence: 'Arquivo `requisitos-modelagem.md` com a lista numerada, os critérios de aceite e a matriz.',
    commonErrors: ['Escrever solução no lugar de requisito', 'Usar adjetivos vagos como rápido e seguro sem métrica', 'Perder a fonte do requisito', 'Misturar restrição com preferência'],
    reflection: [
      'Qual requisito ficou ambíguo e como você resolveria?',
      'Como um critério de aceite reduz discussão posterior?',
      'Qual stakeholder não foi consultado e o que isso pode causar?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Priorizar requisitos por valor e risco', 'Criar diagrama de casos de uso', 'Revisar o documento com outro aluno'],
    executionType: 'simulado'
  },
  {
    id: 'eng-desenho-arquitetura',
    title: 'Desenho de arquitetura com decisões explícitas',
    area: 'Engenharia',
    level: 'Avançado',
    prerequisites: ['Requisitos funcionais e não funcionais', 'Noção de componentes e interface'],
    objective: 'Produzir um desenho de arquitetura para o estudo de caso, identificando componentes, interfaces, fluxos e decisões com trade-offs.',
    concepts: ['arquitetura', 'componente', 'interface', 'dependência', 'fluxo de dados', 'trade-off', 'ADR'],
    environment: 'Editor de diagramas da Forge e documento de requisitos do laboratório anterior.',
    safety: 'Desenhar apenas para o sistema fictício do exercício; não representar infraestrutura real de produção, IPs internos ou credenciais. Registrar suposições e marcá-las como pendentes de validação.',
    steps: [
      'Selecionar os requisitos não funcionais que mais influenciam o desenho.',
      'Identificar componentes e responsabilidades de cada um.',
      'Definir interfaces e formatos de troca entre componentes.',
      'Desenhar o fluxo principal e um fluxo de falha.',
      'Listar duas decisões estruturais com alternativas e justificativas.'
    ],
    expectedResult: 'Diagrama legível com componentes, interfaces e fluxos, acompanhado de decisões justificadas e suposições marcadas.',
    evidence: 'Arquivo `arquitetura-lab.png` mais `decisoes-arquitetura.md` com as alternativas consideradas.',
    commonErrors: ['Desenhar caixas sem responsabilidades', 'Omitir fluxo de falha', 'Codificar detalhes de implementação como arquitetura', 'Deixar dependências implícitas'],
    reflection: [
      'Qual decisão seria mais difícil de revertê-la depois?',
      'Como o desenho atende ao requisito de disponibilidade?',
      'Qual alternativa foi descartada e por quê?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Criar visão de implantação', 'Mapear requisitos para componentes', 'Simular mudança de requisito e revisar o desenho'],
    executionType: 'simulado'
  },
  {
    id: 'eng-testes',
    title: 'Testes automatizados com caso de falha',
    area: 'Engenharia',
    level: 'Intermediário',
    prerequisites: ['Leitura de código simples', 'Noção de função e entrada/saída', 'Ambiente de execução configurado'],
    objective: 'Escrever testes para uma função de exemplo, incluindo caso feliz, borda e falha, e verificar a causa de uma falha proposital.',
    concepts: ['teste unitário', 'caso limite', 'assertiva', 'cobertura', 'fake', 'regressão'],
    environment: 'Repositório de exemplo local com framework de testes já instalado.',
    safety: 'Executar testes somente no repositório de exemplo e com dados fictícios. Não apontar testes para bancos ou serviços reais; isolar dependências externas com dublês e não desativar verificações para esconder falhas.',
    steps: [
      'Ler a função alvo e listar seus comportamentos observáveis.',
      'Escrever teste para o caminho principal com saída esperada explícita.',
      'Acrescentar teste de borda e teste de entrada inválida.',
      'Executar a suíte e registrar falha proposital introduzida pelo instrutor.',
      'Corrigir a implementação e confirmar que a suíte volta ao verde.'
    ],
    expectedResult: 'Suíte verde após a correção, com os três tipos de caso presentes e a falha anterior documentada.',
    evidence: 'Arquivos `testes-exemplo.js` e `relatorio-testes.md` com saídas antes e depois da correção.',
    commonErrors: ['Testar a implementação em vez do comportamento', 'Usar apenas entradas válidas', 'Assertiva genérica demais', 'Não isolar dependência externa'],
    reflection: [
      'Qual bug a suíte não teria detectado?',
      'Por que incluir um teste que falha antes da correção?',
      'O que uma cobertura alta não garante?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Adicionar teste de regressão', 'Medir cobertura', 'Introduzir dublê para dependência externa'],
    executionType: 'execucao-real'
  },
  {
    id: 'eng-pipeline',
    title: 'Pipeline de CI com etapas verificáveis',
    area: 'Engenharia',
    level: 'Intermediário',
    prerequisites: ['Testes automatizados', 'Noção de repositório e commit'],
    objective: 'Configurar um pipeline local de integração contínua que execute lint, testes e verificação de segurança em um repositório de exemplo.',
    concepts: ['CI', 'job', 'etapa', 'artefato', 'cache', 'gate', 'status de saída'],
    environment: 'Repositório de exemplo com pipeline simulado em execução local, sem publicação remota.',
    safety: 'Não publicar segredos ou tokens no arquivo de configuração; usar variáveis de ambiente fictícias. Não disparar deployments reais e limitar o pipeline ao repositório de exemplo, com permissões mínimas.',
    steps: [
      'Declarar as etapas do pipeline e a ordem de execução.',
      'Configurar lint com falha explícita em violações.',
      'Executar a suíte de testes como gate obrigatório.',
      'Adicionar verificação de dependências com dados de exemplo.',
      'Simular uma falha em uma etapa e confirmar que as seguintes são bloqueadas.'
    ],
    expectedResult: 'Pipeline verde no cenário correto e vermelho com bloqueio na etapa seguinte quando uma falha é introduzida.',
    evidence: 'Arquivo `pipeline-config.yml` e `pipeline-execucoes.md` com os dois resultados e os logs das etapas.',
    commonErrors: ['Usar segredos literais no arquivo', 'Permitir que etapa posterior rode após falha', 'Cache desatualizado escondendo erro', 'Não versionar a configuração do pipeline'],
    reflection: [
      'Qual etapa deveria ser executada primeiro e por quê?',
      'Como o pipeline impede uma mudança quebrada?',
      'O que acontece se a verificação de dependências falhar?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Adicionar etapa de cobertura mínima', 'Gerar artefato de relatório', 'Paralelizar etapas independentes'],
    executionType: 'execucao-real'
  },
  {
    id: 'eng-revisao-codigo',
    title: 'Revisão de código com achados priorizados',
    area: 'Engenharia',
    level: 'Intermediário',
    prerequisites: ['Leitura de código', 'Noção de diff', 'Testes automatizados'],
    objective: 'Revisar um diff de exemplo e produzir comentários acionáveis, classificando achados por severidade e verificando cada afirmação.',
    concepts: ['diff', 'review', 'severidade', 'comentário acionável', 'contexto', 'verificação por execução'],
    environment: 'Repositório de exemplo local com diff preparado pelo instrutor e testes disponíveis.',
    safety: 'Revisar apenas o diff autorizado do laboratório; não publicar comentários em repositórios reais e não incluir dados sensíveis nos exemplos citados. Toda suspeita de segurança deve ser confirmada por execução controlada antes de ser classificada.',
    steps: [
      'Ler a descrição da mudança e delimitar o escopo do diff.',
      'Executar os testes antes de comentar e registrar o estado inicial.',
      'Anotar achados com arquivo, linha e sugestão concreta.',
      'Classificar cada achado por severidade e justificar a classificação.',
      'Reexecutar os testes após uma correção simulada e atualizar os comentários.'
    ],
    expectedResult: 'Lista de achados com localização exata, severidade justificada e evidência de execução; nenhum comentário vago.',
    evidence: 'Arquivo `revisao-codigo.md` com os comentários, os trechos citados e as saídas dos testes.',
    commonErrors: ['Comentar estilo pessoal como bloqueante', 'Afirmar bug sem reproduzir', 'Ignorar contexto do diff', 'Deixar de revisar arquivos de teste'],
    reflection: [
      'Qual achado mudaria de severidade com mais contexto?',
      'Como transformar um comentário vago em ação concreta?',
      'O que os testes não mostraram sobre a mudança?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Revisar sem ver a descrição da mudança', 'Comparar duas revisões independentes', 'Criar checklist de revisão'],
    executionType: 'execucao-real'
  },
  {
    id: 'eng-analise-incidentes',
    title: 'Análise de incidente com linha do tempo',
    area: 'Engenharia',
    level: 'Avançado',
    prerequisites: ['Logs', 'Noção de serviço e dependência', 'Leitura de diagrama simples'],
    objective: 'Reconstruir um incidente fictício a partir de artefatos fornecidos, distinguindo fatos, hipóteses e ações de contenção.',
    concepts: ['incidente', 'linha do tempo', 'hipótese', 'causa raiz', 'contenção', 'postmortem sem culpa', 'detecção'],
    environment: 'Pacote de artefatos fictícios da Forge: trechos de log, captura de tela de métricas e descrição de sintomas.',
    safety: 'Analisar somente artefatos fictícios e autorizados; não acessar sistemas reais durante a investigação. Não executar comandos de contenção em ambiente alheio e rotular claramente hipóteses não confirmadas para evitar acusações infundadas.',
    steps: [
      'Organizar os artefatos por timestamp em uma linha do tempo única.',
      'Separar observação direta de inferência em colunas distintas.',
      'Formular três hipóteses e indicar qual evidência confirma ou refuta cada uma.',
      'Propor ações de contenção com efeito esperado e risco.',
      'Escrever causa raiz provável e ações preventivas com responsáveis e prazos.'
    ],
    expectedResult: 'Linha do tempo consistente, hipóteses avaliadas com evidência e plano de contenção e prevenção com itens verificáveis.',
    evidence: 'Arquivo `postmortem-incidente.md` com a linha do tempo, a tabela de hipóteses e as ações.',
    commonErrors: ['Confundir correlação com causalidade', 'Escrever causa raiz antes de reunir evidência', 'Ignorar falha de detecção', 'Propor contenção sem avaliar risco'],
    reflection: [
      'Qual evidência faria você descartar a hipótese principal?',
      'Por que uma postmortem sem culpa melhora a análise?',
      'Qual sinal de detecção faltou e como você o adicionaria?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Simular segunda onda do incidente', 'Calcular tempo de detecção e recuperação', 'Revisar o postmortem com outro aluno'],
    executionType: 'execucao-real'
  },
  {
    id: 'eng-adr',
    title: 'Registro de decisão de arquitetura (ADR)',
    area: 'Engenharia',
    level: 'Intermediário',
    prerequisites: ['Arquitetura básica', 'Leitura de requisitos', 'Noção de trade-off'],
    objective: 'Escrever um ADR completo para uma decisão do estudo de caso, com contexto, alternativas, consequências e plano de revisão.',
    concepts: ['ADR', 'contexto', 'decisão', 'alternativas', 'consequências', 'estado', 'revisão periódica'],
    environment: 'Repositório de documentação local da Forge com diretório de ADRs de exemplo.',
    safety: 'Registrar apenas decisões relativas ao sistema fictício; não citar decisões reais da empresa nem personas identificáveis. Marcar dados de desempenho como estimativas quando não houver medição.',
    steps: [
      'Escolher uma decisão estrutural pendente no estudo de caso.',
      'Escrever o contexto com requisitos e restrições que influenciam a escolha.',
      'Listar ao menos duas alternativas com prós e contras.',
      'Registrar a decisão, o estado e as consequências positivas e negativas.',
      'Definir critério e prazo de revisão da decisão.'
    ],
    expectedResult: 'ADR numerado com contexto verificável, alternativas comparadas, consequências explícitas e data de revisão.',
    evidence: 'Arquivo `docs/adr/0001-decisao-exemplo.md` devidamente preenchido.',
    commonErrors: ['Escrever a decisão antes do contexto', 'Listar apenas uma alternativa', 'Omitir consequências negativas', 'Não registrar data de revisão'],
    reflection: [
      'Qual contexto mudaria a decisão?',
      'Por que registrar alternativas rejeitadas?',
      'Como o ADR ajuda uma pessoa que entra no projeto depois?'
    ],
    rubric: 'Cinco dimensões (correção, completude, evidência, clareza, reflexão) avaliadas de 0 a 2 cada, total 10; aprovação a partir de 8/10.',
    extensions: ['Encadear ADRs dependentes', 'Superseder um ADR de exemplo', 'Indexar os ADRs em README'],
    executionType: 'execucao-real'
  }
]);

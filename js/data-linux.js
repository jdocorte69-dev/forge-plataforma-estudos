/* ============================================================
   FORGE — data-linux.js — Trilha Linux
   ============================================================ */

CURRICULUM.linux = {
  name: "Linux",
  icon: "🐧",
  modules: [
    {
      name: "Fundamentos do terminal",
      lessons: [
        L("O terminal e o shell",
          "Entender o que acontece entre digitar um comando e ver a resposta.",
          "Nenhum. Basta um terminal disponível.",
          "O terminal é uma janela de texto para conversar com o computador. O shell é o intérprete que lê o que você digita e chama os programas certos.",
          "Ao pressionar Enter, o shell divide a linha em comando e argumentos, procura o executável no PATH e o executa como um novo processo. O resultado volta pela saída padrão (stdout); mensagens de erro vão para stderr. O prompt mostra usuário, máquina e diretório atual. Saber ler o prompt e distinguir stdout de stderr evita muita confusão.",
          [
            ["shell", "Intérprete de comandos que lê a linha digitada e executa programas."],
            ["PATH", "Lista de diretórios onde o shell procura executáveis."],
            ["stdout", "Saída padrão, onde o programa escreve resultados normais."],
            ["stderr", "Saída de erro padrão, usada para mensagens de falha."],
            ["prompt", "Indicador que mostra usuário, máquina e diretório antes do comando."]
          ],
          {
            ex: [["ls -l", "Lista arquivos com detalhes como dono, tamanho e data."], ["echo $PATH", "Mostra os diretórios procurados ao executar um comando."]],
            er: ["Confundir o terminal com o shell: o terminal é o emulador; o shell é o intérprete.", "Ignorar mensagens de erro por não separar stderr do stdout."],
            lab: "No simulador, digite pwd, echo $PATH e ls -l. Observe quais saídas mudam.",
            ref: "The Linux Command Line, capítulo 1; man bash."
          }),
        L("Navegação e manipulação de arquivos",
          "Navegar pelo sistema de arquivos e criar, copiar, mover e remover arquivos com segurança.",
          "Conceito de diretório e arquivo.",
          "O sistema de arquivos é uma árvore. Cada comando de navegação muda onde você está ou o que você vê.",
          "pwd mostra o diretório atual; cd muda de diretório; ls lista conteúdo. Caminhos absolutos começam em / e relativos partem do diretório atual. Os atalhos . e .. significam diretório atual e pai. cp copia, mv move ou renomeia, mkdir cria diretório, rm remove. Cuidado: rm é irreversível por padrão.",
          [
            ["pwd", "Imprime o caminho absoluto do diretório atual."],
            ["caminho absoluto", "Caminho que começa na raiz / e identifica um local sem ambiguidade."],
            ["cd ..", "Sobe para o diretório pai."],
            ["cp -r", "Copia diretórios e todo o seu conteúdo recursivamente."],
            ["mv", "Move ou renomeia arquivos e diretórios."]
          ],
          {
            ex: [["cd /var/log", "Vai para o diretório de logs do sistema."], ["cp -r projeto projeto.bak", "Cria uma cópia completa do diretório projeto."]],
            er: ["Usar rm sem conferir o caminho.", "Esquecer -r ao copiar ou remover diretórios."],
            lab: "Crie uma pasta com mkdir, entre nela, crie um arquivo com touch e copie-o com cp."
          }),
        L("Permissões e propriedade",
          "Interpretar e alterar permissões de leitura, escrita e execução.",
          "Listagem de arquivos com ls -l.",
          "Cada arquivo tem dono, grupo e três permissões para cada um: ler, escrever e executar.",
          "A string drwxr-xr-x indica tipo, permissões do dono, do grupo e dos outros. Em octal, r=4, w=2, x=1. chmod altera permissões; chown altera dono e grupo. Para diretórios, o bit de execução permite entrar e acessar metadados. Permissões excessivas são uma das causas mais comuns de falhas de segurança.",
          [
            ["rwx", "Leitura, escrita e execução, representadas por 4, 2 e 1."],
            ["chmod", "Comando que altera permissões de arquivos e diretórios."],
            ["chown", "Comando que altera o dono e, opcionalmente, o grupo de um arquivo."],
            ["dono", "Usuário proprietário do arquivo, com permissões próprias."],
            ["bit de execução", "Permissão que permite executar um arquivo ou entrar em um diretório."]
          ],
          {
            ex: [["chmod 755 script.sh", "Dá leitura, escrita e execução ao dono; leitura e execução aos demais."], ["ls -l arquivo", "Mostra dono, grupo e permissões do arquivo."]],
            er: ["Dar 777 a arquivos por preguiça.", "Confundir permissão de leitura com permissão de execução em diretórios."],
            lab: "Crie um arquivo, teste chmod 600, chmod 755 e observe a saída de ls -l."
          }),
        L("Redirecionamento e pipes",
          "Combinar comandos e controlar para onde vai a entrada e a saída de dados.",
          "Conceito de stdin, stdout e stderr.",
          "Em vez de digitar tudo manualmente, você pode ligar a saída de um comando à entrada de outro.",
          "O operador > redireciona stdout sobrescrevendo um arquivo; >> acrescenta ao final. O pipe | conecta stdout de um processo a stdin do seguinte. O redirecionamento 2> captura erros. Combinar grep, sort, head e wc em pipes é a forma mais produtiva de explorar logs e arquivos grandes.",
          [
            ["redirecionamento", "Direcionamento da saída ou entrada padrão para um arquivo."],
            ["pipe", "Operador | que liga a saída de um comando à entrada de outro."],
            ["append", "Operador >> que acrescenta dados ao final de um arquivo."],
            ["stdin", "Fluxo de entrada padrão, normalmente o teclado."],
            ["grep", "Filtro que seleciona linhas que correspondem a um padrão."]
          ],
          {
            ex: [["cat log.txt | grep erro | wc -l", "Conta quantas linhas de log contêm a palavra erro."], ["echo novo >> notas.txt", "Acrescenta uma linha ao final do arquivo."]],
            er: ["Usar > quando queria preservar o conteúdo anterior.", "Esperar que pipes funcionem com dados binários sem cuidado."],
            lab: "Encadeie ls -l, grep e wc no simulador e explique cada etapa."
          })
      ]
    },
    {
      name: "Processos e serviços",
      lessons: [
        L("Processos e sinais",
          "Listar processos, interpretar seu estado e encerrá-los de forma controlada.",
          "Noção de programa em execução.",
          "Um processo é um programa em execução, com memória, identificador e estado próprios.",
          "Cada processo tem um PID. ps mostra uma foto instantânea; top e htop mostram atualização contínua. O pai pode criar filhos com fork. Sinais são mensagens assíncronas: SIGTERM pede encerramento gracefully, SIGKILL força. Use kill com o PID e prefira SIGTERM antes de recorrer ao SIGKILL.",
          [
            ["PID", "Identificador numérico único de um processo."],
            ["ps", "Comando que lista processos em um instante."],
            ["SIGTERM", "Sinal que solicita encerramento permitindo limpeza."],
            ["SIGKILL", "Sinal que mata o processo imediatamente, sem limpeza."],
            ["fork", "Chamada de sistema que cria um novo processo filho."]
          ],
          {
            ex: [["ps aux", "Lista todos os processos com detalhes de uso de CPU e memória."], ["kill -TERM 1234", "Solicita encerramento organizado ao processo 1234."]],
            er: ["Matar processos do sistema sem entender a função deles.", "Usar kill -9 como primeira opção."],
            lab: "No simulador, liste processos, identifique um PID e envie um sinal de término."
          }),
        L("systemd e gerenciamento de serviços",
          "Controlar serviços do sistema com systemctl e entender unidades.",
          "Conceito de processo em segundo plano.",
          "Serviços são processos que rodam em segundo plano e podem ser iniciados automaticamente.",
          "O systemd é o init moderno da maioria das distribuições. Unidades .service descrevem como iniciar um daemon. systemctl start, stop, restart e status controlam o estado atual; enable e disable definem se inicia no boot. O journal registra mensagens de saída do serviço.",
          [
            ["systemd", "Sistema de inicialização e gerenciamento de serviços."],
            ["unit", "Arquivo de configuração que descreve um recurso gerenciado pelo systemd."],
            ["systemctl", "Ferramenta para controlar unidades do systemd."],
            ["enable", "Configura uma unidade para iniciar automaticamente no boot."],
            ["daemon", "Processo de longa duração que presta serviço em segundo plano."]
          ],
          {
            ex: [["systemctl status ssh", "Mostra o estado atual do serviço SSH."], ["systemctl enable nginx", "Faz o nginx iniciar automaticamente a cada boot."]],
            er: ["Confundir start com enable.", "Editar arquivos em /etc/systemd/system sem recarregar o daemon."],
            lab: "Consulte o status de um serviço no simulador e interprete as colunas exibidas."
          }),
        L("Logs e journalctl",
          "Localizar e interpretar mensagens de log para diagnosticar falhas.",
          "Conceito de serviço e de saída padrão.",
          "Logs são o histórico do que aconteceu. Saber filtrá-los transforma adivinhação em diagnóstico.",
          "Arquivos em /var/log e o journal do systemd registram eventos. journalctl mostra o journal; -u filtra por unidade, -f acompanha em tempo real, --since limita por data. Níveis de severidade ajudam a priorizar: err e crit merecem atenção antes de info. Correlacione horários entre serviços.",
          [
            ["journalctl", "Comando para consultar os logs do systemd."],
            ["severidade", "Nível de importância de uma mensagem de log, como info, warning ou err."],
            ["-f", "Opção que acompanha novas mensagens em tempo real."],
            ["/var/log", "Diretório tradicional de arquivos de log."],
            ["rotação", "Mecanismo que compacta e limita o tamanho dos logs."]
          ],
          {
            ex: [["journalctl -u ssh --since today", "Mostra mensagens do serviço SSH a partir de hoje."], ["journalctl -f", "Acompanha o journal em tempo real."]],
            er: ["Ler apenas a última linha sem contextualizar o horário.", "Deixar logs crescerem sem rotação."]
          }),
        L("Agendamento com cron",
          "Automatizar tarefas repetitivas em horários definidos.",
          "Conceito de processo em segundo plano.",
          "O cron é um agente que executa comandos em horários programados.",
          "Cada linha do crontab tem cinco campos: minuto, hora, dia do mês, mês e dia da semana, seguidos do comando. Expressões como */5 significam a cada cinco unidades. O crontab de usuário fica em /var/spool/cron; o do sistema em /etc/crontab. Variáveis de ambiente no cron são limitadas, então use caminhos absolutos.",
          [
            ["cron", "Serviço que executa comandos agendados periodicamente."],
            ["crontab", "Arquivo que contém a tabela de tarefas agendadas."],
            ["campo de minuto", "Primeiro campo do cron, de 0 a 59."],
            ["curinga", "Asterisco que representa todos os valores possíveis de um campo."],
            ["caminho absoluto", "Caminho completo a partir da raiz, seguro em ambientes com PATH limitado."]
          ],
          {
            ex: [["0 3 * * * /usr/bin/backup.sh", "Executa o backup todos os dias às 3h."], ["*/15 * * * * uptime", "Executa uptime a cada 15 minutos."]],
            er: ["Esquecer que o cron tem PATH reduzido.", "Usar cinco campos para tarefas que precisam de segundos sem ferramenta adequada."],
            lab: "Monte uma expressão cron para rodar um comando às segundas-feiras às 8h."
          })
      ]
    },
    {
      name: "Redes e segurança",
      lessons: [
        L("Fundamentos de redes TCP/IP",
          "Entender endereçamento IP, portas e o modelo cliente-servidor.",
          "Conceito de computador conectado em rede.",
          "A rede é um conjunto de máquinas que trocam mensagens usando regras comuns.",
          "IPv4 usa endereços de 32 bits divididos em rede e host; a máscara define essa divisão. Portas identificam serviços dentro de uma máquina: 22 SSH, 80 HTTP, 443 HTTPS. O modelo TCP/IP organiza a comunicação em camadas: aplicação, transporte, internet e acesso à rede. TCP é confiável e orientado a conexão; UDP é mais leve e sem garantia de entrega.",
          [
            ["IPv4", "Endereço de 32 bits escrito em quatro blocos decimais."],
            ["máscara de rede", "Valor que separa a parte de rede da parte de host de um endereço IP."],
            ["porta", "Número que identifica um serviço ou conexão dentro do host."],
            ["TCP", "Protocolo de transporte confiável e orientado a conexão."],
            ["UDP", "Protocolo de transporte sem conexão e sem garantia de entrega."]
          ],
          {
            ex: [["ip addr", "Mostra interfaces e endereços IP da máquina."], ["ss -tuln", "Lista portas TCP e UDP em escuta."]],
            er: ["Confundir IP público e privado.", "Achar que firewall e porta aberta são a mesma coisa."],
            lab: "Use ip addr e ss no simulador para identificar seu IP e portas em escuta."
          }),
        L("SSH, firewall e acesso remoto",
          "Conectar-se remotamente com segurança e proteger portas de entrada.",
          "Conceito de porta e cliente-servidor.",
          "SSH permite administrar uma máquina à distância sem enviar senha em texto claro.",
          "O SSH usa criptografia e autenticação por senha ou chave. Chaves assimétricas são preferíveis: a pública vai no servidor, a privada fica com o cliente. Um firewall filtra tráfego por porta, protocolo e origem. ufw simplifica iptables em distribuições comuns. Restrinja o acesso ao mínimo necessário e desabilite login root direto.",
          [
            ["SSH", "Protocolo para login e execução de comandos remotos de forma criptografada."],
            ["chave pública", "Parte da chave que pode ser distribuída e colocada no servidor."],
            ["firewall", "Mecanismo que controla quais conexões de rede são permitidas."],
            ["ufw", "Interface simplificada para configurar firewalls no Linux."],
            ["porta 22", "Porta padrão do serviço SSH."]
          ],
          {
            ex: [["ssh -i chave.pem user@host", "Conecta via SSH usando uma chave privada."], ["ufw allow 22/tcp", "Permite conexões TCP na porta 22."]],
            er: ["Compartilhar chave privada.", "Abrir todas as portas para facilitar testes."],
            lab: "No simulador, simule uma conexão SSH e uma regra de firewall."
          }),
        L("Usuários, grupos e sudo",
          "Gerenciar identidades e conceder privilégios de forma controlada.",
          "Conceito de permissão e propriedade.",
          "Contas separadas permitem rastrear ações e limitar danos.",
          "Usuários são identificados por UID; grupos por GID. /etc/passwd, /etc/shadow e /etc/group armazenam conta, senha criptografada e associação de grupos. sudo executa comandos como outro usuário, normalmente root, com registro em log. O arquivo sudoers define quem pode executar o quê. O princípio do menor privilégio orienta boas políticas.",
          [
            ["UID", "Identificador numérico de um usuário."],
            ["grupo", "Conjunto de usuários que compartilham permissões."],
            ["sudo", "Comando que executa outro comando com privilégios elevados."],
            ["sudoers", "Arquivo que define as regras de uso do sudo."],
            ["menor privilégio", "Princípio de conceder apenas as permissões necessárias à tarefa."]
          ],
          {
            ex: [["sudo -l", "Lista o que o usuário atual pode executar com sudo."], ["usermod -aG sudo nome", "Adiciona um usuário ao grupo sudo."]],
            er: ["Trabalhar sempre como root.", "Editar sudoers com editor comum em vez de visudo."]
          })
      ]
    },
    {
      name: "Administração avançada",
      lessons: [
        L("Armazenamento, partições e LVM",
          "Compreender discos, sistemas de arquivos e volumes lógicos.",
          "Conceito de arquivo e diretório.",
          "O armazenamento é organizado em camadas: disco, partição, sistema de arquivos e montagem.",
          "lsblk mostra dispositivos de bloco. fdisk ou parted criam partições; mkfs cria o sistema de arquivos; mount o torna acessível em um ponto de montagem. O /etc/fstab define montagens automáticas. LVM adiciona uma camada flexível com volumes físicos, grupos de volumes e volumes lógicos, permitindo redimensionar sem reparticionar discos.",
          [
            ["partição", "Divisão lógica de um disco rígido."],
            ["sistema de arquivos", "Estrutura que organiza como dados são gravados e recuperados."],
            ["ponto de montagem", "Diretório onde um sistema de arquivos é anexado à árvore."],
            ["LVM", "Gerenciador de volumes lógicos que permite flexibilidade no armazenamento."],
            ["fstab", "Arquivo que declara montagens automáticas no boot."]
          ],
          {
            ex: [["lsblk", "Lista dispositivos de bloco e suas partições."], ["df -h", "Mostra espaço usado e livre nos sistemas de arquivos montados."]],
            er: ["Formatar a partição errada.", "Esquecer de atualizar fstab após trocar um disco."],
            lab: "Interprete a saída de lsblk e df -h no simulador."
          }),
        L("Shell scripting",
          "Escrever scripts Bash para automatizar tarefas com variáveis, condicionais e loops.",
          "Redirecionamento, pipes e permissões.",
          "Um script é apenas uma sequência de comandos salva em arquivo e executada de uma vez.",
          "A primeira linha, o shebang, indica o interpretador. Variáveis guardam valores; $1 e $@ recebem argumentos. if, for e while permitem lógica. Cuidar de aspas evita expansões indesejadas, e set -e interrompe o script em caso de erro. Tornar o arquivo executável com chmod +x é necessário para rodá-lo diretamente.",
          [
            ["shebang", "Primeira linha do script que indica qual interpretador usar."],
            ["variável", "Nome que armazena um valor reutilizável no script."],
            ["argumento posicional", "Valor passado ao script, acessível como $1, $2 e assim por diante."],
            ["loop for", "Estrutura que repete comandos para cada item de uma lista."],
            ["set -e", "Opção que aborta o script quando um comando falha."]
          ],
          {
            ex: [["#!/bin/bash", "Shebang que seleciona o interpretador Bash."], ["for f in *.txt; do echo $f; done", "Imprime o nome de cada arquivo .txt do diretório."]],
            er: ["Esquecer aspas em variáveis com espaços.", "Não testar o script com arquivos de nomes estranhos."],
            lab: "Escreva um script que liste arquivos .log e conte quantos existem."
          }),
        L("Backup e recuperação",
          "Planejar e executar cópias de segurança confiáveis.",
          "Arquivamento com tar e agendamento com cron.",
          "Backup só existe de verdade quando você já testou a restauração.",
          "Defina o que é crítico, onde guardar e por quanto tempo. tar agrupa arquivos; gzip compacta; rsync sincroniza de forma incremental, transferindo apenas diferenças. A regra 3-2-1 recomenda três cópias, em dois meios diferentes, com uma fora do local. Restaure periodicamente em ambiente de teste e documente o procedimento.",
          [
            ["backup completo", "Cópia de todos os dados selecionados em uma execução."],
            ["backup incremental", "Cópia apenas das alterações desde o backup anterior."],
            ["rsync", "Ferramenta que sincroniza arquivos transferindo apenas diferenças."],
            ["regra 3-2-1", "Três cópias, dois meios distintos e uma fora do local."],
            ["restauração", "Processo de recuperar dados a partir de um backup."]
          ],
          {
            ex: [["tar -czf backup.tar.gz /etc", "Cria um arquivo compactado com o diretório /etc."], ["rsync -a origem/ destino/", "Sincroniza conteúdos preservando atributos."]],
            er: ["Nunca testar a restauração.", "Guardar o único backup no mesmo disco dos dados originais."]
          })
      ]
    }
  ]
};

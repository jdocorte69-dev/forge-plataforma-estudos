/* ============================================================
   FORGE — data-systems.js
   Sistemas operacionais e arquitetura de computadores
   ============================================================ */

CURRICULUM.systems = {
  name: "Sistemas e Arquitetura",
  icon: "🖥️",
  modules: [
    {
      name: "Sistemas operacionais",
      lessons: [
        L("Papel do SO e chamadas de sistema",
          "Entender por que um programa precisa pedir serviços ao kernel e como esse pedido cruza a fronteira entre modo usuário e modo kernel.",
          "Noções de programa, arquivo e terminal; trilha Linux inicial.",
          "O SO é o árbitro dos recursos e também uma biblioteca de serviços. A aplicação não conversa diretamente com o disco ou a placa de rede: ela faz uma chamada controlada.",
          "O kernel executa em modo privilegiado e administra CPU, memória e dispositivos. Processos comuns rodam em modo usuário, onde acessar hardware ou alterar tabelas de página seria perigoso. A syscall é a porta oficial: o programa coloca o número da chamada e os argumentos em registradores, transfere o controle ao kernel e volta com um resultado. Assim, open, read, write, fork e exit são serviços com uma interface estável, mesmo quando o hardware muda.\n\nNem toda função de biblioteca é uma syscall. strlen roda inteira no espaço do usuário; printf formata dados e, só quando precisa escrever, chega a write. O kernel valida ponteiros e permissões antes de agir e sinaliza falha devolvendo um valor especial e preenchendo errno. A biblioteca C é o embrulho conveniente; a syscall é o mecanismo real.\n\nVale separar mecanismo de política. O mecanismo é a troca de modo, a validação e a devolução segura; a política é decidir quais direitos aquele usuário tem. Um mesmo mecanismo atende a políticas diferentes, o que explica por que Linux, macOS e Windows expõem ideias parecidas com detalhes distintos.",
          [
            ["syscall", "Ponto de entrada controlado pelo qual um processo pede um serviço ao kernel."],
            ["modo usuário", "Modo de execução sem privilégios, onde programas comuns não acessam hardware diretamente."],
            ["modo kernel", "Modo privilegiado em que o kernel executa e manipula memória e dispositivos."],
            ["errno", "Variável thread-local que guarda o código da última falha relatada por uma chamada."],
            ["biblioteca C", "Camada de funções que prepara argumentos e invoca syscalls de forma portátil."]
          ],
          {
            ex: [
              ["strace -e trace=openat,write ls", "Mostra as syscalls reais usadas para listar um diretório e escrever a saída."],
              ["Um printf sem saída visível", "Pode não chamar write se a saída estiver totalmente em buffer; formatação e syscall são etapas distintas."]
            ],
            er: [
              "Achar que printf é uma syscall: ela é da biblioteca e só eventualmente chama write.",
              "Tratar errno como texto explicativo; ele é um código numérico que deve ser interpretado com strerror.",
              "Confundir shell com kernel: o shell é apenas outro processo que usa syscalls."
            ],
            lab: "Comando real: strace -e trace=openat,read,write cat /etc/hostname. Anote quantas transições para o kernel aparecem; se strace não existir, desenhe a sequência esperada.",
            ref: "OSTEP, cap. 'Introduction'; man 2 syscall; man 3 errno; man7.org."
          }),
        L("Processos e estados",
          "Acompanhar o ciclo de vida de um processo e interpretar os estados mostrados por ferramentas do sistema.",
          "Chamadas de sistema e a ideia de execução isolada.",
          "Programa é receita; processo é a receita sendo executada, com memória própria, descritores e um lugar na fila da CPU.",
          "Cada processo tem um PCB, estrutura em que o kernel guarda PID, estado, registradores salvos, prioridade e ponteiros para memoria virtual e arquivos abertos. fork cria um novo processo com uma cópia lógica do endereçamento; na prática, o kernel usa copy-on-write e só copia páginas quando alguém escreve. exec substitui a imagem do processo por outro programa, mantendo o mesmo PID.\n\nOs estados essenciais são pronto, executando e bloqueado. Há também o zumbi: o processo já terminou, mas o pai ainda não chamou wait para coletar seu código de saída. Um órfão é adotado pelo init, enquanto um zumbi permanece ocupando uma entrada na tabela de processos. Em sistemas com threads, a unidade escalonada é a thread, mas o PCB continua sendo o recipiente dos recursos.\n\nA troca de contexto salva registradores da tarefa que sai e restaura os da que entra. Ela é necessária para compartilhar a CPU, mas consome tempo sem avançar o trabalho do usuário. Por isso, criar muitos processos para tarefas curtas pode ser pior do que reutilizar um pool.",
          [
            ["processo", "Instância de um programa em execução, com endereçamento e recursos próprios."],
            ["PCB", "Bloco de controle do processo, onde o kernel guarda estado, PID e contexto de execução."],
            ["estado pronto", "Estado de quem pode executar e aguarda apenas a escolha do escalonador."],
            ["estado bloqueado", "Estado de quem espera um evento, como leitura de disco ou chegada de sinal."],
            ["processo zumbi", "Processo terminado cujo pai ainda não recolheu o status com wait."]
          ],
          {
            ex: [
              ["fork() no pai e no filho", "A chamada devolve o PID do filho no pai e zero no filho; o código continua nos dois."],
              ["ps -o pid,stat,cmd", "Colunas mostram estados como R, S e Z; Z sinaliza zumbi."]
            ],
            er: [
              "Confundir programa em disco com processo em memória.",
              "Achar que fork copia toda a memória na hora; copy-on-write adia a cópia.",
              "Esquecer wait e deixar zumbis acumularem."
            ],
            lab: "Comando real: sleep 10 &; ps -o pid,stat,cmd | grep sleep; wait. Observe o estado S e a remoção após o término.",
            ref: "OSTEP, cap. 'Processes'; man 2 fork; man 2 wait; man 5 proc; man 1 ps."
          }),
        L("Threads e concorrência",
          "Distinguir concorrência de paralelismo e reconhecer quando acessos compartilhados produzem resultados imprevisíveis.",
          "Processos, estados e noção de registradores salvos.",
          "Threads são várias linhas de execução dentro da mesma casa. Elas dividem os móveis, mas cada uma tem seu próprio caderno de anotações.",
          "Uma thread possui pilha, registradores e armazenamento local próprios, mas compartilha com as irmãs o código, o heap, a tabela de arquivos abertos e os descritores. Isso torna a comunicação barata e perigosa: um dado alterado por uma é visto pelas outras sem qualquer aviso. Criar thread costuma ser mais leve que criar processo, justamente porque não é preciso montar um novo espaço de endereçamento.\n\nConcorrência significa que várias linhas progridem em intervalos entrelaçados; paralelismo significa que elas avançam ao mesmo tempo em unidades diferentes. Em uma máquina com um núcleo, há concorrência sem paralelismo. Em multicore, as duas coisas coexistem, e os efeitos de ordem ficam ainda mais visíveis. A condição de corrida aparece quando o resultado depende de qual acesso chega primeiro.\n\nA operação x++ não é atômica: ela lê, soma e grava. Duas threads podem ler o mesmo valor e gravar o mesmo resultado, perdendo um incremento. A região que não pode ser interrompida é a seção crítica; protegê-la com lock, semáforo ou operações atômicas é o caminho usual. A precisão aqui é mais importante que a velocidade aparente.",
          [
            ["thread", "Unidade de execução dentro de um processo, com pilha e registradores próprios."],
            ["concorrência", "Interleaving de várias linhas de execução em um período de tempo."],
            ["paralelismo", "Execução simultânea em mais de uma unidade de processamento."],
            ["condição de corrida", "Resultado dependente da ordem não controlada de acessos compartilhados."],
            ["seção crítica", "Trecho de código que acessa recurso compartilhado e exige exclusão mútua."]
          ],
          {
            ex: [
              ["Duas threads somando x++ um milhão de vezes", "O total final pode ficar abaixo de dois milhões porque leituras e gravações se sobrepõem."],
              ["nproc", "Mostra o número de CPUs lógicas; ele limita o paralelismo real, não o número de threads criadas."]
            ],
            er: [
              "Supor que x++ é atômico.",
              "Compartilhar estrutura mutável sem lock e confiar na sorte da escala.",
              "Achar que mais threads sempre deixam o programa mais rápido."
            ],
            lab: "Comando real: gcc -pthread conc.c -o conc && ./conc, comparando 1 e 4 threads. Sem compilador, simulação: duas pessoas incrementam um número no papel intercalando leitura e escrita.",
            ref: "OSTEP, cap. 'Threads'; man 7 pthreads; CS:APP, cap. 'Concurrent Programming'."
          }),
        L("Escalonamento",
          "Comparar critérios de escalonamento e prever espera e tempo de conclusão em cenários simples.",
          "Processos, estados e threads ou noção de troca de contexto.",
          "A CPU é uma única cadeira: escalonar é decidir quem senta, por quanto tempo e com que prioridade.",
          "O escalonador escolhe uma tarefa pronta para executar. Seus objetivos competem: maximizar vazão, reduzir latência, manter equidade e evitar fome. FCFS atende por chegada e é simples, mas sofre do efeito comboio: um processo longo atrasa todos os curtos. SJF minimiza a espera quando a duração é conhecida, o que raramente acontece de verdade.\n\nRound Robin dá a cada tarefa um quantum $q$; quando ele expira, a tarefa volta ao fim da fila. Quantum muito grande se comporta como FCFS; muito pequeno gasta tempo excessivo em troca de contexto. Filas multinível por prioridade aproximam SJF sem conhecer o futuro, e o envelhecimento aumenta a prioridade de quem espera muito para impedir fome.\n\nLinux usa CFS, que escolhe a tarefa com menor vruntime, uma medida de tempo de CPU ponderada por prioridade. Não é uma fila circular fixa: é uma árvore ordenada por tempo consumido. Em sistemas interativos, latência de resposta importa mais que vazão bruta; em servidores de lote, a relação pode se inverter.",
          [
            ["escalonador", "Parte do kernel que escolhe qual tarefa pronta executará a seguir."],
            ["FCFS", "Política first-come, first-served, que atende na ordem de chegada."],
            ["Round Robin", "Política que concede a cada tarefa um quantum e a recoloca na fila ao expirar."],
            ["quantum", "Intervalo máximo de CPU concedido a uma tarefa antes da próxima decisão."],
            ["envelhecimento (aging)", "Mecanismo que aumenta prioridade de tarefas esperando há muito tempo."]
          ],
          {
            ex: [
              ["FCFS com A(5), B(1), C(1)", "Esperas 0, 5 e 6; média $11/3 \\approx 3{,}67$ unidades de tempo."],
              ["Round Robin com q=2 para A(5), B(1), C(1)", "Ordem A, B, C, A, A; A termina em 7, enquanto FCFS terminaria em 5."]
            ],
            er: [
              "Achar que Round Robin reduz a espera média em relação a SJF.",
              "Usar prioridades fixas sem envelhecimento e provocar fome.",
              "Confundir vazão com latência: um pode melhorar enquanto o outro piora."
            ],
            lab: "Comando real: nice -n 10 yes > /dev/null &; ps -o pid,ni,pri,comm; top -o %CPU; kill %1. Compare prioridade e uso de CPU.",
            ref: "OSTEP, cap. 'CPU Scheduling'; man 7 sched; man 1 nice; man 1 ps."
          }),
        L("Sincronização e semáforos",
          "Proteger dados compartilhados e coordenar produtores e consumidores com primitivas corretas.",
          "Threads, condição de corrida e seção crítica.",
          "Um lock é a chave da sala; um semáforo é o controle de fichas que diz quantas pessoas podem entrar.",
          "Mutex garante exclusão mútua: só uma thread mantém o lock por vez. Ele tem dono, o que permite evitar liberação por outra thread e, em algumas implementações, detectar tentativas de relock pelo mesmo dono. Variáveis de condição permitem esperar por um estado, sempre com um predicado verificado em laço, porque acordos podem ser perdidos ou espúrios.\n\nSemáforo é um contador inteiro com duas operações atômicas: P, ou wait, decrementa e pode bloquear; V, ou post, incrementa e pode acordar alguém. Um semáforo binário com valor inicial 1 funciona como tranca; um contador com valor N controla N vagas. No produtor-consumidor, use empty=N, full=0 e mutex=1: o produtor faz P(empty), P(mutex), insere, V(mutex), V(full); o consumidor faz o caminho inverso.\n\nA ordem das operações é parte do contrato. Inverter P(mutex) e P(empty) pode prender todos se o buffer estiver cheio. Já a ordem dos V costuma ser menos crítica, mas ainda afeta o despertar. Espera ocupada consome CPU; espera bloqueante aciona o escalonador. A escolha depende de quanto se espera e de quantos núcleos estão livres.",
          [
            ["seção crítica", "Região que exige exclusão mútua para preservar invariantes de dados compartilhados."],
            ["mutex", "Lock com posse bem definida, usado para garantir exclusão mútua."],
            ["semáforo", "Contador protegido com operações atômicas de espera e sinalização."],
            ["operação P", "Decremento atômico do semáforo que bloqueia se o valor chegar a zero."],
            ["operação V", "Incremento atômico do semáforo que pode despertar uma thread em espera."]
          ],
          {
            ex: [
              ["Buffer de 4 posições", "Produtor começa com P(empty) quatro vezes possíveis; após inserir, V(full) libera uma consumação."],
              ["Contador protegido", "pthread_mutex_lock(&c); c++; pthread_mutex_unlock(&c); mantém o incremento indivisível."]
            ],
            er: [
              "Fazer P e esquecer o V correspondente, travando todas as threads.",
              "Chamar wait de variável de condição com if em vez de while.",
              "Usar semáforo sem definir o valor inicial e a ordem das operações."
            ],
            lab: "Comando real: compile um produtor-consumidor com pthread_mutex e sem_init; rode com 1 e 4 consumidores. Sem ambiente POSIX, simulação: use fichas para representar empty e full.",
            ref: "OSTEP, caps. 'Locks', 'Condition Variables' e 'Semaphores'; man 3 pthread_mutex_lock; man 3 sem_init."
          }),
        L("Deadlock",
          "Identificar as condições necessárias ao travamento e escolher uma estratégia de prevenção, evitação ou recuperação.",
          "Mutex, semáforos e espera bloqueante.",
          "Deadlock é o impasse: cada participante segura algo que o outro precisa e ninguém abre mão.",
          "Quatro condições são necessárias para um deadlock clássico: exclusão mútua, manutenção e espera, ausência de preemptação e espera circular. Retirar qualquer uma quebra o impasse. Exigir que todos os recursos sejam pedidos de uma vez elimina a manutenção e espera, mas reduz utilização. Permitir preemptação funciona bem para CPUs e memória, mal para impressoras ou transações já iniciadas.\n\nEvitação é diferente de prevenção. O algoritmo do banqueiro aceita uma solicitação apenas se o estado permanecer seguro, isto é, se ainda existir uma ordem em que todos terminam com os recursos disponíveis. Ele calcula Need = Max - Allocation e testa essa ordem antes de conceder. O custo é conhecer de antemão as necessidades máximas e executar a checagem a cada pedido.\n\nNa prática, muitos sistemas detectam e recuperam: matam uma vítima, revertem transação ou liberam recursos com timeout. Outros simplesmente ignoram o problema, aposta comum quando travamentos são raros e o custo de prevenção é alto. Um grafo de alocação com ciclo é a forma mais clara de documentar o incidente; ordem global de aquisição costuma ser a correção mais barata.",
          [
            ["deadlock", "Impasse em que tarefas bloqueadas esperam recursos umas das outras."],
            ["exclusão mútua", "Condição na qual apenas uma tarefa pode usar um recurso por vez."],
            ["espera circular", "Ciclo no grafo de alocação em que cada tarefa espera recurso da próxima."],
            ["estado seguro", "Estado no qual existe uma ordem de execução em que todas as tarefas conseguem terminar."],
            ["algoritmo do banqueiro", "Política de evitação que só concede pedidos se o estado resultante for seguro."]
          ],
          {
            ex: [
              ["T1 travou A e quer B; T2 travou B e quer A", "Há espera circular: T1→B→T2→A→T1, e nenhuma avança."],
              ["Ordem global A antes de B", "As duas threads pedem A primeiro; o ciclo desaparece e umadelas termina."]
            ],
            er: [
              "Confundir deadlock com starvation: na fome, alguém avança, mas nunca é escolhido.",
              "Achar que mutex sozinho previne impasse; ele é justamente uma das condições necessárias.",
              "Usar timeout sem liberar os recursos já adquiridos."
            ],
            lab: "Simulação: desenhe o grafo T1→B e T2→A, identifique o ciclo e reescreva a ordem de aquisição para eliminá-lo. Depois repita com três mutexes.",
            ref: "OSTEP, cap. 'Deadlock'; man 3 pthread_mutex_trylock; man 3 pthread_mutex_timedlock."
          }),
        L("Memória virtual e paginação",
          "Traduzir endereços virtuais em físicos e explicar o que acontece quando uma página não está residente.",
          "Representação binária, noção de endereço e registradores.",
          "Cada programa vive em um mundo de endereços próprio; o MMU é o tradutor que esconde a memória física real.",
          "Memória virtual separa o endereço que o programa usa do endereço na RAM. O espaço é dividido em páginas de tamanho fixo, normalmente 4 KiB; um endereço é composto por VPN e deslocamento. Com páginas de 4096 bytes, $VPN = \\lfloor A / 4096 \\rfloor$ e o deslocamento são os 12 bits baixos. A tabela de páginas guarda o número do frame físico e bits de proteção, presença e sujeira.\n\nA MMU faz a tradução a cada acesso. Como percorrer a tabela seria caro, a TLB guarda traduções recentes. Um acerto na TLB é barato; um erro pode exigir leitura da tabela. Se o bit de presença estiver desligado, ocorre page fault: o kernel verifica se o endereço é válido, escolhe uma vítima, possivelmente grava em swap, traz a página e atualiza a tabela antes de retomar a instrução.\n\nPaginação sob demanda evita carregar o programa inteiro, e copy-on-write permite que fork seja rápido. O preço é a imprevisibilidade de um page fault e a fragmentação interna na última página. Proteção por página também é a base para isolar processos: um ponteiro inválido gera falha em vez de corromper outro programa.",
          [
            ["memória virtual", "Abstração que dá a cada processo um espaço de endereços independente."],
            ["página", "Bloco de tamanho fixo usado como unidade de tradução e proteção."],
            ["tabela de páginas", "Estrutura que mapeia páginas virtuais a frames físicos com bits de controle."],
            ["TLB", "Cache pequena e rápida das traduções de endereço mais recentes."],
            ["page fault", "Exceção gerada quando a página acessada não está disponível ou não é permitida."]
          ],
          {
            ex: [
              ["Endereço 0x1234 com páginas de 4 KiB", "VPN = 0x1 e deslocamento = 0x234; a MMU troca o VPN pelo frame na tabela."],
              ["Primeira escrita após fork", "Page fault de copy-on-write: o kernel copia a página e marca as duas como privadas."]
            ],
            er: [
              "Confundir endereço virtual com endereço físico; o programa só vê o primeiro.",
              "Achar que a TLB guarda dados de memória; ela guarda traduções.",
              "Ignorar que um page fault pode custar milhares de ciclos."
            ],
            lab: "Comando real: getconf PAGESIZE; head -20 /proc/self/maps. Identifique regiões, permissões e o tamanho de página da sua máquina.",
            ref: "OSTEP, caps. 'Address Translation', 'Paging' e 'TLB'; CS:APP, cap. 9; man 5 proc."
          }),
        L("Sistema de arquivos",
          "Relacionar nomes, inodes, blocos e descritores para explicar leitura, escrita e inconsistência após queda de energia.",
          "Bytes, permissões e chamadas open/read/write.",
          "O nome do arquivo é um rótulo; o inode é a identidade; o descritor é o ticket que seu processo recebe ao abrir.",
          "Diretórios são tabelas que associam nomes a inodes. O inode guarda tipo, dono, permissões, tamanho, horários e ponteiros para os blocos de dados, com níveis indiretos para arquivos grandes. Um nome não é o arquivo: vários nomes podem apontar para o mesmo inode, e é o número de links que decide quando os blocos voltam ao pool livre.\n\nopen valida o caminho, verifica permissões e devolve um descritor. A posição de leitura fica na descrição de arquivo aberta, por isso dois processos que abrem o mesmo arquivo podem ter offsets independentes. Um link simbólico armazena outro caminho; se o destino desaparece, ele fica quebrado. Um hard link apenas acrescenta outro nome para o mesmo inode e não pode atravessar certos limites de sistema de arquivos.\n\nQueda de energia no meio de uma atualização pode deixar metadados e dados divergentes. Journaling registra a intenção antes de aplicar a mudança; copy-on-write grava em blocos novos e troca o ponteiro no fim. Nenhuma das técnicas torna o disco infinitamente confiável: backups continuam sendo a única defesa contra falha humana, roubo ou destruição física.",
          [
            ["inode", "Estrutura de metadados que identifica um arquivo e aponta para seus blocos."],
            ["diretório", "Estrutura que mapeia nomes legíveis para números de inode."],
            ["descritor de arquivo", "Inteiro devolvido por open que representa um arquivo aberto no processo."],
            ["journaling", "Técnica que registra transações antes de aplicá-las para acelerar a recuperação."],
            ["link simbólico", "Arquivo especial que armazena o caminho de outro arquivo."]
          ],
          {
            ex: [
              ["ls -li", "Mostra o número do inode; dois hard links exibem o mesmo número."],
              ["ln -s alvo atalho; rm alvo", "O atalho permanece, mas passa a apontar para um caminho inexistente."]
            ],
            er: [
              "Achar que remover um dos hard links apaga os dados se outro nome ainda existe.",
              "Tratar link simbólico como cópia do conteúdo do arquivo.",
              "Abrir arquivos em laço longo sem fechar e esgotar descritores."
            ],
            lab: "Comando real: touch f; ln f g; ln -s f s; ls -li f g s; rm f; cat g; cat s. Explique por que g funciona e s falha.",
            ref: "OSTEP, caps. 'File System', 'File System Implementation' e 'Crash Consistency'; man 7 inode; man 2 open; man 2 link."
          }),
        L("Entrada/saída e interrupções",
          "Comparar polling e interrupções e entender como DMA e tratadores permitem ao CPU continuar trabalhando durante uma transferência.",
          "Syscalls, dispositivos e noção de exceção.",
          "Perguntar o tempo todo se o dado chegou gasta energia; ser avisado quando chega é bem mais eficiente.",
          "Em polling, a CPU consulta repetidamente um registrador de estado do dispositivo. O custo é $T_{poll} = N \\times t_{check}$, em que $N$ cresce com o tempo de espera. Com interrupção, o dispositivo sinaliza ao controlador, que prioriza e mascara linhas conforme a configuração. A CPU termina a instrução atual, salva contexto mínimo e chama o handler.\n\nUm bom handler reconhece o dispositivo, copia o dado essencial e agenda o resto para execução posterior. Fazer trabalho longo dentro dele aumenta latência de outras interrupções e pode perder eventos. DMA vai além: o controlador transfere blocos diretamente entre dispositivo e memória, e só ao final gera a interrupção. A CPU não deixa de ser avisada; ela deixa de copiar byte por byte.\n\nSistemas distinguem dispositivos de bloco, como SSD, e de caractere, como terminal. Buffering e cache suavizam diferenças de velocidade, mas também criam a ilusão de que uma escrita já foi persistida. fsync e barreiras existem justamente para transformar essa ilusão em garantia, com custo de desempenho.",
          [
            ["polling", "Consulta repetida ao estado de um dispositivo pela CPU."],
            ["interrupção", "Sinal assíncrono do hardware que desvia a CPU para um tratador."],
            ["DMA", "Transferência direta entre dispositivo e memória sem cópia byte a byte pela CPU."],
            ["handler de interrupção", "Rotina que atende o evento sinalizado e agenda o trabalho restante."],
            ["controlador de interrupções", "Hardware que prioriza, mascara e encaminha sinais dos dispositivos."]
          ],
          {
            ex: [
              ["Leitura de SSD com DMA", "A CPU programa endereço e tamanho, segue executando e recebe uma única IRQ ao concluir."],
              ["Teclado", "Cada tecla gera interrupção; o tratador lê o byte e acorda o processo em espera."]
            ],
            er: [
              "Fazer processamento pesado dentro do handler.",
              "Esquecer de reconhecer a interrupção no dispositivo e gerar repetição infinita.",
              "Achar que DMA significa ausência total de interrupção."
            ],
            lab: "Comando real: cat /proc/interrupts; pressione teclas e rode cat /proc/interrupts novamente; compare os contadores.",
            ref: "CS:APP, cap. 8; man 7 signal; man 2 read; Linux /proc/interrupts; OSTEP, seções sobre dispositivos."
          }),
        L("Segurança e permissões",
          "Distinguir identidade, autorização e privilégio e aplicar o menor privilégio sem quebrar o sistema.",
          "Usuários, grupos, arquivos e shell.",
          "Login responde quem você é; permissões respondem o que você pode fazer. São perguntas diferentes.",
          "Autenticação estabelece identidade; autorização decide se aquela identidade pode ler, escrever ou executar. No modelo Unix, cada arquivo tem uid e gid donos e três triplas rwx para usuário, grupo e outros. Em octal, $r+w+x = 4+2+1 = 7$, então 750 significa dono com tudo, grupo com leitura e execução, e nada para os demais. O umask remove bits de arquivos recém-criados.\n\nO uid efetivo é usado nas checagens. O bit setuid permite que um executável rode com o uid do dono, o que viabiliza ferramentas como passwd, mas amplia muito a superfície de ataque. Capabilities dividem os poderes de root em partes menores, e sudo registra quem assumiu qual privilégio. DAC é o modelo discricionário; SELinux e AppArmor acrescentam controle obrigatório com políticas do administrador.\n\nMenor privilégio não é desconfiança excessiva: é limitar o dano de um erro. Arquivos de configuração com senha, diretórios com chaves e logs com dados pessoais devem ter dono e modo explícitos. Auditar permissões amplas é mais produtivo do que depender de senhas fortes para compensar má configuração.",
          [
            ["autenticação", "Processo de confirmar a identidade de um usuário ou serviço."],
            ["autorização", "Decisão sobre quais ações uma identidade já autenticada pode realizar."],
            ["UID", "Identificador numérico de usuário usado nas verificações de propriedade."],
            ["setuid", "Bit que faz o executável rodar com o uid do seu dono."],
            ["umask", "Máscara que remove permissões de arquivos e diretórios recém-criados."]
          ],
          {
            ex: [
              ["chmod 750 app", "Dono com leitura, escrita e execução; grupo com leitura e execução; outros sem acesso."],
              ["find / -perm -4000 -type f 2>/dev/null", "Lista executáveis setuid para auditoria; cada resultado merece justificativa."]
            ],
            er: [
              "Dar chmod 777 para resolver um erro de acesso sem diagnosticar a causa.",
              "Confundir autenticação com autorização.",
              "Criar arquivo sensível com umask permissivo."
            ],
            lab: "Comando real: umask 077; touch secreto; ls -l secreto; chmod 640 secreto; ls -l secreto. Compare os modos antes e depois.",
            ref: "OSTEP, cap. 'Protection'; man 2 chmod; man 2 setuid; man 2 umask; man 1 find."
          })
      ]
    },
    {
      name: "Arquitetura de computadores",
      lessons: [
        L("Representação de números e ponto flutuante (IEEE 754)",
          "Calcular intervalos em inteiros e interpretar bits de um número em ponto flutuante, incluindo casos especiais.",
          "Conversão entre bases e álgebra binária.",
          "Inteiros são exatos até estourar; floats são aproximados até mesmo para números que parecem simples.",
          "Com n bits, um inteiro sem sinal vai de $0$ a $2^n-1$. Em complemento de dois, o intervalo é $-2^{n-1}$ a $2^{n-1}-1$, e a mesma palavra de bits tem leitura diferente conforme o tipo. Em C, overflow de unsigned envelopa; overflow de signed é comportamento indefinido. Misturar os dois em uma expressão é fonte clássica de bug silencioso.\n\nA IEEE 754 organiza um float em sinal, expoente com viés e fração. Para binary64, o viés é 1023; para binary32, é 127. Um número normalizado tem valor $(-1)^s \\times (1{,}f)_2 \\times 2^{e-bias}$. O bit implícito 1 não é armazenado, o que ganha um bit de precisão. Exponentes extremos codificam zero, subnormais, infinito e NaN.\n\nComo 0,1 não tem representação exata em binário, 0,1 + 0,2 pode não ser igual a 0,3. A diferença é de uma ULP, a menor distância entre floats adjacentes naquele ponto da reta. Arredondamento padrão é para o mais próximo, com empate para par. Compare floats com tolerância, não com igualdade, e escolha inteiros ou decimal fixo quando exatidão financeira importa.",
          [
            ["complemento de dois", "Codificação de inteiros com sinal em que a negação é inversão de bits mais um."],
            ["IEEE 754", "Padrão para aritmética em ponto flutuante binária e decimal."],
            ["viés do expoente", "Valor adicionado ao expoente real para que ele possa ser armazenado como inteiro não negativo."],
            ["NaN", "Valor especial usado para resultado indefinido, como 0/0."],
            ["ULP", "Distância entre dois números em ponto flutuante adjacentes."]
          ],
          {
            ex: [
              ["uint8_t 255 + 1", "O resultado envelopa para 0; com int8_t, 127 + 1 é overflow de signed em C."],
              ["0,1 + 0,2 em binary64", "Impresso com 17 casas, o resultado não é exatamente 0,3; use uma tolerância."]
            ],
            er: [
              "Comparar dois floats com ==.",
              "Achar que o expoente armazenado é o expoente matemático, sem subtrair o viés.",
              "Misturar unsigned e signed em comparações C."
            ],
            lab: "Comando real: python3 -c 'print(format(0.1+0.2, \".17f\"))'. Compare com format(0.3, '.17f') e explique a diferença.",
            ref: "IEEE 754-2019; CS:APP, cap. 2; IEEE Standards Association, ieee754.org."
          }),
        L("Organização da CPU e registradores",
          "Descrever o ciclo de instrução e relacionar registradores, convenção de chamada e tempo de CPU.",
          "Bits, bytes e noção de endereço de memória.",
          "A CPU repete um ritmo simples: buscar a instrução, decodificar, executar e avançar para a próxima.",
          "O PC aponta a próxima instrução; a unidade de busca traz o opcode, o decodificador interpreta os operandos e a ALU realiza a conta. Registradores são a memória mais rápida e mais escassa: incluem uso geral, ponteiro de pilha, registrador de flags e o próprio PC. x86-64 usa rax, rsp, rip entre outros; AArch64 usa x0 a x30, sp e pc. A convenção de chamada define quais registradores passam argumentos e quais devem ser preservados.\n\nUma instrução pode ler memória, mas em arquiteturas load/store apenas ldr/str ou mov equivalentes fazem esse transporte. A memória abstrai o que a CPU não consegue guardar em registradores. Quando uma chamada acontece, o endereço de retorno e os registradores callee-saved são salvos na pilha, formando o frame que aparece em backtraces.\n\nO tempo de CPU resume três fatores: $T_{CPU} = IC \\times CPI \\times T_{clock}$. Reduzir instruções, reduzir ciclos por instrução ou encurtar o ciclo de clock melhora desempenho, mas as otimizações interferem entre si. Compilar com -O0 e medir não diz quase nada sobre o código que será realmente executado em produção.",
          [
            ["registrador", "Memória pequena e muito rápida dentro da CPU, endereçada pelo formato da instrução."],
            ["PC", "Registrador que contém o endereço da próxima instrução a buscar."],
            ["ALU", "Unidade lógico-aritmética que realiza operações inteiras e comparações."],
            ["ciclo de busca e execução", "Sequência fetch, decode, execute, access memory e write back."],
            ["CPI", "Número médio de ciclos de clock gastos por instrução executada."]
          ],
          {
            ex: [
              ["add eax, 1 em sintaxe Intel", "Soma um ao registrador eax; a ALU produz o resultado e atualiza flags."],
              ["IC=10^9, CPI=1,5, clock=3 GHz", "Tempo = 10^9 × 1,5 / 3×10^9 = 0,5 s."]
            ],
            er: [
              "Achar que o PC sempre aponta para a instrução seguinte mesmo após um desvio.",
              "Ignorar registradores que a convenção exige preservar.",
              "Confundir registrador com posição de memória principal."
            ],
            lab: "Comando real: gcc -O0 -S -masm=intel ex.c -o ex.s. Localize mov, add, ret e o uso de rsp/rax no prólogo da função.",
            ref: "Intel 64 and IA-32 Architectures Software Developer's Manual, Vol. 1; ARM Architecture Reference Manual (ARMv8-A), seção de registradores; CS:APP, caps. 3 e 4."
          }),
        L("Barramentos e hierarquia de memória",
          "Explicar a ordem da hierarquia de memória e calcular tempo médio de acesso com base em acertos e erros.",
          "Registradores, endereçamento e representação binária.",
          "Memória rápida é pequena e cara; memória grande é lenta. A hierarquia tenta dar a ilusão de que tudo é rápido e grande.",
          "Barramentos levam endereço, dados e sinais de controle entre CPU, memória e dispositivos. Um barramento compartilhado é simples, mas vira gargalo quando vários mestres disputam largura de banda. Interconexões point-to-point, como PCIe, reduziram essa disputa; caches múltiplas introduziram o problema de coerência, resolvido por protocolos de invalidação e estados como MESI.\n\nA hierarquia vai de registradores a L1, L2, L3, DRAM, SSD e disco. Cada nível abaixo é maior e mais lento; a transferência acontece em blocos para explorar localidade. Números de latência variam muito entre máquinas, então a forma correta de raciocinar é relativa: um acesso a cache é uma ordem de grandeza mais barato que DRAM, que por sua vez é muito mais barato que SSD.\n\nO tempo médio é $AMAT = T_{hit} + m \\times P_{miss}$, em que m é a taxa de erro e P a penalidade. A formulação mostra por que uma pequena taxa de erro pode dominar o tempo: penalidade grande multiplica o erro. Em multiprocessadores, ainda é preciso contar o custo de manter as cópias coerentes, o que explica por que falsos compartilhamentos são tão caros.",
          [
            ["barramento", "Conjunto de linhas que transporta endereço, dados e controle entre componentes."],
            ["hierarquia de memória", "Organização em níveis de capacidade crescente e latência crescente."],
            ["DRAM", "Memória principal volátil e densa, mais lenta que caches SRAM."],
            ["AMAT", "Tempo médio de acesso ponderado por acertos e erros de um nível."],
            ["coerência de cache", "Garantia de que leituras veem a versão correta de dados replicados em várias caches."]
          ],
          {
            ex: [
              ["L1 com 1 ns, 5% de erro e penalidade 100 ns", "AMAT = 1 + 0,05 × 100 = 6 ns."],
              ["Duas threads em duas variáveis da mesma linha", "Mesmo sem compartilhar dados, a linha inteira disputa posse; isso é falso compartilhamento."]
            ],
            er: [
              "Confundir DRAM com SRAM das caches.",
              "Somar latências sem ponderar pela taxa de acerto.",
              "Ignorar coerência ao raciocinar sobre desempenho multicore."
            ],
            lab: "Comando real: lscpu | grep -E 'Cache|Socket|CPU\\(s\\)'; lspci | head -10. Relacione os níveis de cache com a topologia mostrada.",
            ref: "CS:APP, cap. 6; Intel SDM Vol. 1, seção de hierarquia de memória; ARM Architecture Reference Manual, seção de memória."
          }),
        L("Cache e localidade",
          "Explicar por que padrões de acesso importam e como parâmetros da cache afetam acerto, erro e tempo.",
          "Hierarquia de memória e AMAT.",
          "Programas não acessam memória ao acaso: eles voltam ao mesmo lugar e passeiam por vizinhos.",
          "Localidade temporal é voltar ao mesmo endereço em breve; localidade espacial é acessar endereços próximos em seguida. A cache explora as duas trazendo uma linha inteira, tipicamente 64 bytes, em vez de um byte isolado. Percorrer uma matriz por linhas costuma ser muito mais rápido do que percorrer por colunas, mesmo com a mesma quantidade de operações.\n\nUma cache mapeia blocos para conjuntos usando bits de índice extraídos do endereço; os bits altos formam a tag e os baixos escolhem o byte na linha. No mapeamento direto, cada bloco tem um único lugar: é simples, mas sofre conflito. Com 8 vias, cada conjunto comporta oito blocos e a decisão de substituição fica mais flexível. Escrita pode ser write-through, que atualiza o nível abaixo de imediato, ou write-back, que marca o bit sujo e só escreve ao despejar a linha.\n\nMais associatividade reduz certos erros, mas pode aumentar o tempo de acerto e o consumo de área. A linha maior melhora localidade espacial, porém agrava o desperdício de banda e o falso compartilhamento. Medir contadores de erro é melhor que supor: perf e eventos de hardware mostram efeitos que o código-fonte sozinho não revela.",
          [
            ["localidade temporal", "Tendência de acessar novamente o mesmo dado em um futuro próximo."],
            ["localidade espacial", "Tendência de acessar endereços próximos aos usados recentemente."],
            ["linha de cache", "Unidade mínima de transferência entre dois níveis da hierarquia."],
            ["mapeamento direto", "Organização em que cada bloco pode ocupar apenas uma posição da cache."],
            ["write-back", "Política que adia a escrita ao nível inferior até a linha ser substituída."]
          ],
          {
            ex: [
              ["Cache de 32 KiB, 8 vias, linha de 64 B", "Número de conjuntos = 32768/(64×8) = 64; índice usa 6 bits e deslocamento outros 6."],
              ["Soma por linhas vs por colunas", "A versão por linhas aproveita a linha carregada; a por colunas paga mais erros."]
            ],
            er: [
              "Supor que mais associatividade sempre reduz o tempo total.",
              "Esquecer o bit sujo em write-back e perder dados ao substituir linha.",
              "Confundir capacidade total da cache com tamanho da linha."
            ],
            lab: "Comando real: perf stat -e cache-references,cache-misses ./programa, se perf estiver disponível; compare duas ordens de acesso a matriz.",
            ref: "CS:APP, cap. 6; Intel SDM Vol. 1, seção sobre caches; ARM Architecture Reference Manual, seção sobre caches."
          }),
        L("Pipeline e paralelismo",
          "Analisar estágios de pipeline, riscos e limites teóricos do ganho com mais núcleos.",
          "Ciclo de busca e execução e CPI.",
          "Pipeline é linha de montagem: cada estágio faz uma parte, e várias instruções avançam ao mesmo tempo em estágios diferentes.",
          "Um pipeline clássico tem IF, ID, EX, MEM e WB. Após o enchimento, uma instrução pode terminar por ciclo, mas apenas se não houver riscos. Hazard de dados aparece quando uma instrução precisa de resultado ainda não escrito; hazard de controle vem de desvios; hazard estrutural ocorre quando dois estágios disputam o mesmo recurso. Encaminhamento evita algumas esperas, e predição de desvio reduce outras, nenhuma elimina tudo.\n\nSuperscalar é executar mais de uma instrução por ciclo; out-of-order reordena internamente para aproveitar unidades livres. SIMD aplica a mesma operação a vários dados com uma instrução, enquanto multicore distribui threads entre núcleos. São mecanismos diferentes: um aumento de largura, outro de quantidade de unidades. Cada um cobra em área, energia e complexidade de verificação.\n\nA lei de Amdahl limita o entusiasmo: $S = \\frac{1}{(1-p) + p/n}$, em que p é a fração paralelizável e n o número de unidades. Com 90% paralelizável e 10 núcleos, o ganho máximo é cerca de 5,26, não 10. A lei de Gustafson oferece outra perspectiva ao considerar que problemas maiores podem ser resolvidos no mesmo tempo com mais recursos.",
          [
            ["pipeline", "Técnica que divide a execução em estágios para sobrepor instruções."],
            ["hazard", "Situação que impede a próxima instrução de avançar no ciclo esperado."],
            ["encaminhamento", "Encaminhar resultado recém-calculado diretamente ao estágio que precisa dele."],
            ["superscalar", "Capacidade de emitir mais de uma instrução por ciclo de clock."],
            ["lei de Amdahl", "Relação que limita o speedup pela parte do programa que permanece sequencial."]
          ],
          {
            ex: [
              ["Pipeline de 5 estágios sem stalls", "Após 4 ciclos de enchimento, uma instrução conclui a cada ciclo."],
              ["Amdahl com p=0,9 e n=10", "S = 1/(0,1 + 0,9/10) = 1/0,19 ≈ 5,26."]
            ],
            er: [
              "Supor speedup linear com número de núcleos.",
              "Achar que predição de desvio elimina penalidade de desvio.",
              "Ignorar dependências de dados entre instruções vizinhas."
            ],
            lab: "Comando real: lscpu | grep -E 'CPU|Thread|Core|Socket'; execute uma versão sequencial e uma paralela do mesmo loop com o mesmo -O2 e compare tempos.",
            ref: "CS:APP, caps. 4 e 5; Intel SDM Vol. 1, seção sobre pipeline; ARM Architecture Reference Manual, seção sobre execução especulativa."
          }),
        L("RISC vs CISC",
          "Comparar filosofias de conjunto de instruções sem cair em generalizações simplistas sobre desempenho.",
          "Pipeline, CPI e noção de decodificação.",
          "Uma ideia é dar instruções poderosas; a outra é dar instruções simples e deixar a repetição rápida fazer o trabalho.",
          "CISC, como x86, tem instruções de tamanho variável que podem operar diretamente em memória. Isso reduz tamanho de código e aproxima a linguagem de máquina de certas operações de alto nível. O custo é um decodificador mais complexo; processadores x86 modernos quebram instruções em microoperações e executam essas µops em um núcleo com características RISC.\n\nRISC, como ARM A64 e RISC-V na base, prefere comprimento fixo e operações load/store: só ler e escrever memória exige instruções dedicadas, enquanto ALU trabalha com registradores. Muitos registradores e codificação regular simplificam decodificação e facilitam pipeline. Por outro lado, um programa pode precisar de mais instruções, e extensões como NEON, SVE e RISC-V vetorial ampliam bastante a variedade disponível.\n\nA comparação honesta usa $IC \\times CPI \\times T_{clock}$ e o mesmo compilador, a mesma entrada e a mesma meta. Nenhuma arquitetura é universalmente mais rápida: um loop de inteiros, uma compressão vetorial e uma consulta de banco de dados estressam partes diferentes. O que se pode afirmar com segurança é que RISC e CISC hoje são rótulos de projeto, não sinônimos diretos de número de instruções ou velocidade.",
          [
            ["CISC", "Filosofia com instruções complexas, tamanho variável e operandos possíveis em memória."],
            ["RISC", "Filosofia com instruções simples, codificação regular e operação predominantemente em registradores."],
            ["microoperação", "Instrução interna simples produzida pela decodificação de uma instrução complexa."],
            ["arquitetura load/store", "Modelo em que apenas instruções específicas transferem dados entre memória e registradores."],
            ["conjunto de instruções", "Contrato visível ao software entre a linguagem de máquina e a implementação."]
          ],
          {
            ex: [
              ["x86 add dword ptr [rax], 1", "Uma instrução lê memória, soma e escreve de volta; internamente pode virar várias µops."],
              ["A64 ldr x0, [x1]; add x0, x0, x2", "Carregamento e soma ficam separados, com endereços e registradores explícitos."]
            ],
            er: [
              "Achar que RISC sempre gera menos instruções no programa.",
              "Supor que CISC não usa pipeline moderno.",
              "Comparar arquiteturas ignorando extensões vetoriais e sinalizadores do compilador."
            ],
            lab: "Comando real: gcc -O2 -S -masm=intel ex.c -o ex.s e conte as instruções. Com cross-compiler ARM, repita; sem ele, simulação: discuta o viés da comparação.",
            ref: "Intel SDM Vol. 1 e Vol. 2; ARM Architecture Reference Manual (ARMv8-A); CS:APP, cap. 3."
          }),
        L("Instruções e montador",
          "Ler assembly com segurança e explicar o que o montador e o ligador fazem com rótulos e referências externas.",
          "Registradores, endianness e formato de arquivo executável.",
          "Mnemônicos são nomes legíveis; o montador transforma esses nomes em bits e o ligador costura os pedaços.",
          "O montador converte mnemônicos em opcode e operandos codificados, resolve rótulos internos para deslocamentos e registra relocações para símbolos que ainda não têm endereço. Ele não decide onde a biblioteca vai parar: isso é trabalho do ligador. O resultado é um arquivo objeto com seções como .text, .data e .bss, que o ligador combina em um executável.\n\nEm little-endian, o byte menos significativo vem primeiro na memória; em big-endian, o mais significativo vem primeiro. O mesmo valor inteiro ocupa bytes em ordens opostas. A convenção de chamada complementa a instrução: argumentos em certos registradores, retorno em outro, pilha alinhada e uma lista de registradores preservados.\n\nDesmontar é reconstruir uma leitura possível dos bits, não recuperar o código-fonte. Nomes de variáveis locais e comentários normalmente desaparecem, e otimizações podem tornar a sequência contraintuitiva. Ainda assim, objdump e gdb são instrumentos decisivos para entender crashes, ABI e diferenças entre o que foi escrito e o que realmente chegou à CPU.",
          [
            ["montador", "Ferramenta que traduz assembly em código de máquina e gera relocações."],
            ["mnemônico", "Nome simbólico legível de uma instrução de máquina."],
            ["rótulo", "Nome dado a uma posição no código ou nos dados para cálculo de deslocamentos."],
            ["ligador", "Ferramenta que combina objetos, resolve símbolos externos e produz o executável."],
            ["desmontador", "Ferramenta que converte bytes executáveis de volta em mnemônicos."]
          ],
          {
            ex: [
              ["mov eax, 1", "Mnemônico mov com registrador e imediato; o montador escolhe a codificação adequada."],
              ["objdump -d ./prog", "Mostra a sequência de instruções do binário já ligado."]
            ],
            er: [
              "Achar que o montador resolve chamadas a bibliotecas externas.",
              "Tratar rótulo como variável mutável em tempo de execução.",
              "Ler desmontagem como se fosse o fonte original."
            ],
            lab: "Comando real: gcc -O0 -g -c ex.c -o ex.o; objdump -dr ex.o | head -40. Localize relocações e a seção .text.",
            ref: "CS:APP, caps. 3 e 7; man 1 as; man 1 ld; man 1 objdump; Intel SDM Vol. 2."
          }),
        L("Desempenho e benchmarks honestos",
          "Medir tempo e vazão de forma reproduzível, com aquecimento, repetições e distribuição de resultados.",
          "Pipeline, CPI, cache e compilação com otimização.",
          "Uma medição isolada é uma anedota; um benchmark honesto é um experimento com condições declaradas.",
          "A equação $T_{CPU} = IC \\times CPI \\times T_{clock}$ explica de onde vem o tempo, mas não substitui medição: caches, escalonador e frequência dinâmica mudam o CPI efetivo. Defina a pergunta antes de medir. Latência é o tempo de uma operação; vazão é quantas operações concluem por segundo. Um servidor pode melhorar uma sem melhorar a outra.\n\nRepita a execução, descarte a fase de aquecimento, informe mediana e p95, e guarde a distribuição, não só a média. Aquecimento envolve caches, page faults iniciais e compilação JIT. Isole ruído: poucos processos em segundo plano, mesma frequência, mesma entrada, mesma versão de compilador e mesmos sinalizadores. Onde houver suporte, taskset fixa a CPU e reduz migração.\n\nComparações enganosas são fáceis: medir -O0 contra -O2 sem dizer, escolher a melhor de dez execuções, mudar o tamanho de entrada entre versões ou reportar apenas média com outliers escondidos. Um bom relatório traz comando, ambiente, número de repetições, unidade e intervalo de confiança quando possível. Reproduzibilidade vale mais que o número bonito.",
          [
            ["benchmark", "Experimento controlado para medir desempenho de uma carga de trabalho definida."],
            ["vazão", "Quantidade de trabalho concluída por unidade de tempo."],
            ["latência", "Tempo decorrido entre o início e o fim de uma operação."],
            ["aquecimento", "Execuções iniciais descartadas para estabilizar caches e estado do sistema."],
            ["p95", "Percentil em que 95% das observações ficam abaixo do valor informado."]
          ],
          {
            ex: [
              ["1000 iterações com 100 de aquecimento", "Registre a mediana das 900 restantes e o p95; descreva o comando usado."],
              ["Comparar -O0 e -O2", "É válido se ambas as flags forem explícitas; inválido se apenas a versão otimizada for apresentada como padrão."]
            ],
            er: [
              "Usar a média sem examinar valores atípicos.",
              "Rodar uma única vez e generalizar.",
              "Alterar sinalizadores do compilador entre versões sem declarar."
            ],
            lab: "Comando real: /usr/bin/time -f '%e s' ./prog, repetido 10 vezes; anote mediana e p95. Se disponível, taskset -c 0 ./prog para fixar a CPU.",
            ref: "CS:APP, caps. 5 e 6; man 1 time; man 1 taskset; man 1 perf."
          })
      ]
    }
  ]
};

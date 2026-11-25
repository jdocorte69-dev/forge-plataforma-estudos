/* ============================================================
   FORGE — data-linux-advanced.js
   Complemento avançado de Linux: 8.6 a 8.9 da Enciclopédia Mestra.
   Exige data.js (helper L e CURRICULUM) e data-linux.js.
   ============================================================ */

CURRICULUM.linux.modules.push(
  {
    name: "8.6 — Shell scripting avançado",
    lessons: [
      L("Aspas, expansão e variáveis no Bash",
        "Controlar a ordem da expansão do Bash para que variáveis, globs e substituições não alterem o comando pretendido.",
        "Redirecionamento, pipes e noção de variável em shell.",
        "Aspas não são enfeite: elas decidem se um valor vira uma palavra, várias palavras ou nenhuma expansão.",
        "O Bash processa a linha de comando em etapas: expansão de chaves, til, parâmetros, substituição de comandos, aritmética, divisão em palavras (word splitting), expansão de caminhos (globbing) e, por fim, remoção de aspas. Entender essa ordem evita o erro mais comum em scripts: um valor com espaço que se transforma em dois argumentos.\n\nAspas simples inibem toda expansão; aspas duplas permitem parâmetros, substituição de comandos e aritmética, mas protegem contra word splitting e globbing. Por isso \"$@\" preserva cada argumento separado, enquanto \"$*\" junta todos usando o primeiro caractere de IFS. A forma $(comando) substitui a sintaxe antiga com crases e permite aninhamento. Modificadores como ${var:-padrao}, ${var:?mensagem} e ${var#padrao} permitem default, falha explícita e remoção de prefixo.\n\nVariáveis de shell e variáveis de ambiente são diferentes: apenas as exportadas são herdadas por processos filhos. Dentro de funções, use local para não sobrescrever variáveis globais. Para imprimir dados arbitrários com segurança, prefira printf '%s\\n' a echo, pois echo interpreta opções e escapes de forma inconsistente entre implementações.",
        [
          ["expansão", "Processo pelo qual o shell substitui variáveis, comandos e padrões antes de executar o comando."],
          ["word splitting", "Divisão do resultado de uma expansão em várias palavras, controlada por IFS."],
          ["globbing", "Expansão de padrões como *.log em nomes de arquivos antes da execução."],
          ["\"$@\"", "Forma de expandir todos os argumentos preservando cada um como uma palavra separada."],
          ["export", "Comando que torna uma variável de shell disponível para processos filhos."]
        ],
        {
          ex: [["Argumentos com espaço", "Com arquivo 'meu relatorio.txt', for f in $* separa em duas palavras; for f in \"$@\" mantém o nome inteiro."], ["Default seguro", "destino=${1:?informe o destino} encerra o script com mensagem quando o argumento falta."]],
          er: ["Escrever $var sem aspas e supor que um nome com espaço continua inteiro.", "Usar crases em código novo em vez de $(...).", "Confundir variável de shell com variável exportada para o filho."],
          lab: "Simulação: escreva um script que receba três nomes com espaço, imprima cada um com printf '%s\\n' e mostre a diferença entre $* e \"$@\".",
          ref: "man7.org: bash(1), seções Parameter Expansion e Quoting; The Linux Command Line, cap. 7; Bash Reference Manual.",
          workedExamples: ["x='a  b'; printf '<%s>\\n' $x imprime <a> e <b>; printf '<%s>\\n' \"$x\" imprime <a  b>.", "nome=$(basename \"$1\") captura a saída sem crases e funciona aninhado."],
          recallQuestions: ["O que aspas duplas permitem e o que elas protegem?", "Por que \"$@\" é preferido a $*?", "O que export muda?"],
          masteryCriteria: ["Explica a ordem das expansões.", "Cita um erro real causado por word splitting.", "Usa default e falha explícita em parâmetros."],
          tags: ["bash", "expansão", "aspas"],
          estimatedEffort: 30
        }),
      L("Parâmetros, códigos de saída e condicionais",
        "Usar $?, exit e estruturas if/case para tomar decisões corretas a partir de resultados de comandos.",
        "Expansão, aspas e comparações básicas.",
        "Em shell, toda decisão nasce de um código de saída: zero é sucesso, qualquer outro valor é falha.",
        "O código $? guarda o status do último comando. Por convenção, 0 significa sucesso e 1 a 125 indicam falhas gerais; valores acima de 128 costumam representar encerramento por sinal. exit N encerra o script com o código escolhido, o que permite a quem o chama reagir sem ler a tela.\n\nO teste if usa comandos, não expressões arbitrárias: if [ -f \"$arquivo\" ]; then ...; fi funciona porque [ é um comando. A forma [[ ]] é um builtin do Bash com comparação de padrões, =~ para regex e menos surpresas com aspas. Operadores como -e, -f, -d, -z, -n, -eq e -ne têm significados distintos: usar -eq em texto gera erro. case é preferido quando há vários valores exatos, por exemplo para interpretar $1.\n\nset -e interrompe o script em falhas, mas não em comandos usados como condição de if, enquanto || e &&, nem sempre em pipelines sem pipefail. set -u trata variáveis não definidas como erro e set -o pipefail considera falha qualquer comando do pipeline, não só o último. A combinação set -euo pipefail é comum, porém exige conhecimento das exceções para não encerrar cedo de forma surpreendente.",
        [
          ["código de saída", "Número de 0 a 255 devolvido por um comando ao terminar."],
          ["$?", "Variável que contém o código de saída do último comando executado."],
          ["[[ ]]", "Construto do Bash para testes com regex, padrões e tratamento mais seguro de aspas."],
          ["case", "Estrutura que seleciona um bloco conforme o valor de uma expressão."],
          ["pipefail", "Opção que faz o pipeline falhar quando qualquer comando dele falha."]
        ],
        {
          ex: [["Decisão por arquivo", "if [[ -f $1 && -r $1 ]]; then processar \"$1\"; else echo 'arquivo ausente' >&2; exit 2; fi"], ["Vários valores", "case $1 in start|restart) systemctl restart lab;; stop) systemctl stop lab;; *) echo uso >&2; exit 64;; esac"]],
          er: ["Usar -eq para comparar strings.", "Achar que set -e captura falhas dentro de if ou de pipeline sem pipefail.", "Ignorar $? após um comando crítico."],
          lab: "Simulação: escreva um script que aceite start, stop ou status, use case, valide arquivos com [[ ]] e termine com código diferente para uso inválido.",
          ref: "man7.org: bash(1), seções Conditional Constructs e Set Builtin; The Linux Command Line, cap. 7.",
          workedExamples: ["grep -q erro log.txt && echo 'encontrou'; o código de grep decide o ramo.", "set -o pipefail faz grep ausente em 'cat log | grep x' gerar falha, ao contrário do comportamento padrão."],
          recallQuestions: ["O que significa $? igual a zero?", "Por que [[ ]] difere de [ ]?", "O que pipefail muda?"],
          masteryCriteria: ["Interpreta códigos de saída em decisões.", "Escolhe if ou case conforme o caso.", "Conhece as exceções de set -e."],
          tags: ["bash", "controle de fluxo", "exit"],
          estimatedEffort: 30
        }),
      L("Loops, funções e arrays",
        "Estruturar repetição e reutilização em Bash com for, while read, funções e arrays.",
        "Condicionais e códigos de saída.",
        "Um loop bem escrito trata linhas como dados, não como código; uma função bem escrita não vaza variáveis.",
        "for item in \"${lista[@]}\"; do ...; done percorre uma lista preservando itens com espaço. for ((i=0; i<n; i++)) é a forma aritmética do Bash. while IFS= read -r linha; do ...; done < arquivo lê linha por linha sem comer barras invertidas e sem executar o loop em um subshell, diferença importante em relação a cat arquivo | while read. break e continue controlam iterações.\n\nArrays indexados usam indíces começando em zero e arrays associativos usam chaves com declare -A. A expansão \"${arr[@]}\" preserva elementos, enquanto ${#arr[@]} conta elementos. Funções têm a forma nome() { comandos; } e devolvem o código do último comando ou o valor de return. Variáveis declaradas com local ficam restritas à função; sem isso, um loop ou função pode sobrescrever variáveis usadas em outra parte do script.\n\nRepetir comando em loop não substitui ferramentas próprias: para processar arquivos, find -print0 combinado com while IFS= read -r -d '' lida com nomes que contêm newline. Em scripts longos, funções com nomes claros e parâmetros validados reduzem duplicação e tornam os testes possíveis; recursão em Bash é possível, mas custosa e propensa a erros de pilha.",
        [
          ["array indexado", "Coleção acessada por índice inteiro começando em zero."],
          ["array associativo", "Coleção acessada por chave textual, declarada com declare -A."],
          ["while read", "Loop que lê uma linha por vez da entrada padrão."],
          ["local", "Palavra-chave que limita uma variável ao escopo da função."],
          ["return", "Comando que encerra uma função com determinado código de saída."]
        ],
        {
          ex: [["Leitura segura", "while IFS= read -r linha || [[ -n $linha ]]; do printf '%s\\n' \"$linha\"; done < arquivo.txt"], ["Contagem por chave", "declare -A total; total[erro]=$(( ${total[erro]:-0} + 1 ))"]],
          er: ["Usar cat arquivo | while read e esperar que variáveis alteradas sobrevivam ao pipeline.", "Ler nomes de arquivos com for f in $(find .) quando há espaços.", "Esquecer local e alterar variáveis globais dentro de funções."],
          lab: "Simulação: escreva um script com uma função que conte extensões de arquivos em um diretório usando array associativo e imprima o resultado ordenado.",
          ref: "man7.org: bash(1), seções Arrays, Functions e Compound Commands; Bash Reference Manual.",
          workedExamples: ["for f in \"$@\"; do ...; done preserva nomes com espaço que chegaram como argumentos.", "find . -type f -print0 | while IFS= read -r -d '' f; do ...; done lida com nomes exóticos."],
          recallQuestions: ["Por que IFS= read -r é a forma segura de ler linhas?", "Quando usar array associativo?", "O que local evita?"],
          masteryCriteria: ["Escreve loop que preserva espaços.", "Usa funções com escopo limpo.", "Escolhe estrutura de repetição adequada à entrada."],
          tags: ["bash", "arrays", "funções"],
          estimatedEffort: 35
        }),
      L("Validação de entrada e getopts",
        "Validar argumentos e opções antes de agir, falhando cedo com mensagens úteis.",
        "Parâmetros posicionais, condicionais e loops.",
        "Um script que aceita qualquer entrada vai descobrir o erro no pior momento: depois de ter alterado algo.",
        "A validação começa cedo: verificar quantidade de argumentos, se arquivos existem e são legíveis, se o destino é gravável e se valores numéricos estão no intervalo esperado. Em Bash, [[ $x =~ ^[0-9]+$ ]] testa regex; -z detecta string vazia; [ -w \"$dir\" ] testa permissão efetiva. Mensagens de erro devem ir para stderr com >&2 e o script deve terminar com código não zero.\n\ngetopts processa opções curtas: enquanto getopts \"ab:c:\" opt; do ...; done, em que b: e c: exigem argumento, disponível em OPTARG; OPTIND avança para o próximo índice. Depois das opções, shift $((OPTIND - 1)) deixa apenas os argumentos posicionais. O tratamento de opção desconhecida deve cair em um caso que exibe uso e termina com falha. Para opções longas, getopts não basta; use uma biblioteca ou parser explícito.\n\nSempre documente o formato esperado em uma função usage. Aceitar -- como fim das opções evita que um nome de arquivo começando com hifem seja interpretado como flag. Validar antes de escrever é especialmente importante em scripts de administração: um destino vazio ou uma variável não definida pode transformar um rsync em uma operação destrutiva. A validação é parte do protocolo do script, não detalhe cosmético.",
        [
          ["getopts", "Builtin do Bash que analisa opções curtas e seus argumentos."],
          ["OPTARG", "Variável com o argumento da opção atual no getopts."],
          ["OPTIND", "Índice do próximo argumento a ser processado pelo getopts."],
          ["usage", "Texto que documenta a forma correta de chamar o script."],
          ["fail fast", "Estratégia de interromper na primeira condição inválida, antes de efeitos colaterais."]
        ],
        {
          ex: [["Opção com valor", "while getopts 'd:n:' opt; do case $opt in d) dir=$OPTARG;; n) nome=$OPTARG;; *) usage; exit 64;; esac; done"], ["Validação numérica", "[[ $n =~ ^[0-9]+$ ]] && (( n > 0 )) || { echo 'n inválido' >&2; exit 64; }"]],
          er: ["Começar a escrever arquivos antes de validar o destino.", "Esquecer shift $((OPTIND - 1)) e confundir opções com argumentos.", "Achar que getopts também trata opções longas automaticamente."],
          lab: "Simulação: crie um script com -d diretorio e -n nome, valide ambos, exiba usage quando faltar argumento e só então crie um arquivo de texto.",
          ref: "man7.org: bash(1), seção Bourne Shell Builtins (getopts); The Linux Command Line, cap. 12.",
          workedExamples: ["./script.sh -- -arquivo.txt impede que o nome seja lido como opção.", "usage() { printf 'uso: %s -d dir -n nome\\n' \"${0##*/}\" >&2; }"],
          recallQuestions: ["O que OPTARG contém?", "Por que validar antes de agir?", "Como tratar nome que começa com hifem?"],
          masteryCriteria: ["Valida argumentos antes de efeitos colaterais.", "Usa getopts com argumentos obrigatórios.", "Exibe uso e código de falha em entrada inválida."],
          tags: ["bash", "validação", "getopts"],
          estimatedEffort: 35
        }),
      L("Traps, logs e scripts idempotentes",
        "Tornar scripts seguros contra interrupção e repetíveis sem duplicar efeitos.",
        "Validação, funções e códigos de saída.",
        "Idempotente é poder rodar de novo: o resultado final é o mesmo, mesmo que a execução anterior tenha falhado no meio.",
        "trap permite registrar ações para sinais e eventos: trap 'limpeza' EXIT executa ao sair, trap '' INT ignora Ctrl+C e trap 'echo interrompido' TERM reage a término. A limpeza costuma remover diretórios temporários criados com mktemp -d. Armadilhas ERR exigem cuidado com set -e e com funções; prefira registrar o código real de saída em EXIT quando precisar de diagnóstico.\n\nLogging transforma um script opaco em algo auditável. logger -t nome envia mensagens ao journal; printf com timestamp e nível funciona quando não há journal. Registre início, decisões importantes, falhas e fim, sem incluir senhas ou tokens. Redirecionar saída para arquivo de log deve preservar stderr para o operador quando apropriado.\n\nIdempotência se constrói com operações que toleram repetição: mkdir -p, install -d, rsync -a --checksum com destino controlado, grep -q antes de acrescentar linha em arquivo, e verificação do estado atual antes de mudar. Evite rsync --delete sem ter certeza absoluta do destino. flock -n arquivo.trava impede duas execuções concorrentes do mesmo script. Um modo de simulação com echo ou --dry-run permite conferir o plano antes de aplicar mudanças. Em automação, repetibilidade é mais valiosa que esperteza.",
        [
          ["trap", "Mecanismo do shell para executar comandos ao receber sinais ou eventos como EXIT."],
          ["mktemp", "Comando que cria arquivo ou diretório temporário com nome único."],
          ["logger", "Comando que envia mensagens para o sistema de log."],
          ["idempotência", "Propriedade de uma operação que pode ser repetida sem alterar o resultado final."],
          ["flock", "Ferramenta que usa travamento de arquivo para evitar execuções concorrentes."]
        ],
        {
          ex: [["Limpeza garantida", "tmp=$(mktemp -d); trap 'rm -rf -- \"$tmp\"' EXIT INT TERM"], ["Log estruturado", "logger -t forge-backup \"iniciado destino=$destino\"; ao falhar, logger -p err -t forge-backup \"falha codigo=$?\""]],
          er: ["Esquecer aspas na limpeza e apagar caminho inesperado.", "Registrar segredos no log.", "Usar --delete sem validar o destino."],
          lab: "Simulação: escreva um script com trap de limpeza, logger, trava por flock e verificação que evita duplicar uma linha em arquivo de configuração.",
          ref: "man7.org: bash(1) (trap), mktemp(1), logger(1), flock(1); The Linux Command Line, cap. 14.",
          workedExamples: ["Rodar o script duas vezes com mkdir -p e grep -q resulta no mesmo estado final.", "flock -n /run/lock/forge.lock ./script.sh || echo 'já em execução' evita duas cópias simultâneas."],
          recallQuestions: ["O que trap EXIT garante?", "Como logger ajuda na auditoria?", "O que define idempotência?"],
          masteryCriteria: ["Limpa recursos temporários em todas as saídas.", "Evita duplicação ao repetir execução.", "Registra eventos sem vazar segredos."],
          tags: ["bash", "trap", "idempotência"],
          estimatedEffort: 40
        })
    ]
  },
  {
    name: "8.7 — Administração avançada",
    lessons: [
      L("Pacotes e atualizações controladas",
        "Instalar, atualizar e manter pacotes de forma previsível e reversível.",
        "Uso básico de terminal e noção de root/sudo.",
        "Atualizar não é só baixar versões novas: é mudar o estado de um sistema que alguém precisa continuar usando.",
        "Cada distribuição tem seu gerenciador: apt em Debian e Ubuntu, dnf ou yum em Fedora e RHEL, pacman em Arch. apt update atualiza índices, apt install instala, apt upgrade atualiza pacotes e apt full-upgrade pode remover ou adicionar pacotes para resolver dependências. dnf update e pacman -Syu têm papéis semelhantes. Assinaturas e repositórios configurados definem a confiança do que é instalado; adicionar repositório de terceiros amplia a superfície de ataque.\n\nEm produção, atualizações seguem ordem: inventário do que está instalado, teste em ambiente semelhante, janela de manutenção, aplicação e verificação. Bloquear versões com apt-mark hold ou dnf versionlock evita que uma atualização automática mude comportamento crítico. Arquivos de lock e listas de pacotes tornam o ambiente reproduzível; registrar versões ajuda a reconstruir uma máquina.\n\nDepois de atualizar bibliotecas compartilhadas, processos em execução podem continuar usando a versão antiga até reiniciar: verifique serviços que precisam de restart. Mudanças no kernel exigem reboot para entrar em vigor. Atualizações de segurança merecem prioridade, mas ainda precisam de plano de rollback, por exemplo snapshot da VM ou pacote anterior disponível. Nunca aplique updates em massa em máquina de produção sem janela e critério de parada definidos.",
        [
          ["repositório", "Fonte configurada da qual o gerenciador obtém pacotes."],
          ["dependência", "Pacote ou biblioteca exigido por outro pacote para funcionar."],
          ["full-upgrade", "Atualização que pode adicionar ou remover pacotes para resolver dependências."],
          ["version lock", "Mecanismo que fixa uma versão de pacote para impedir atualização automática."],
          ["rollback", "Procedimento de voltar ao estado anterior após uma mudança."]
        ],
        {
          ex: [["Sequência apt", "sudo apt update && sudo apt install -y htop; depois sudo apt list --upgradable para conferir o que ficou pendente."], ["Fixar versão", "sudo apt-mark hold nginx impede que uma atualização automatizada troque a versão do servidor web."]],
          er: ["Rodar full-upgrade sem ler a lista de remoções.", "Adicionar repositório desconhecido para obter um pacote isolado.", "Achar que a atualização terminou sem reiniciar serviços afetados."],
          lab: "Simulação: planeje a atualização de um serviço hipotético listando versão atual, dependências, janela, comandos, verificação e rollback.",
          ref: "man7.org: apt(8), apt-get(8), dnf(8), pacman(8); documentação oficial de cada distribuição.",
          workedExamples: ["apt-get -s upgrade simula a operação e mostra o que seria alterado antes de executar.", "Após atualizar openssl, reiniciar o serviço é necessário para carregar a nova biblioteca."],
          recallQuestions: ["Qual a diferença entre update e upgrade no apt?", "Por que fixar versões?", "O que é rollback?"],
          masteryCriteria: ["Descreve sequência segura de atualização.", "Identifica necessidade de restart ou reboot.", "Prevê rollback antes de aplicar."],
          tags: ["pacotes", "atualização", "produção"],
          estimatedEffort: 30
        }),
      L("systemd, journal e rotação de logs",
        "Interpretar unidades de serviço, consultar o journal e manter logs utilizáveis ao longo do tempo.",
        "Processos em segundo plano e noção de serviço.",
        "Service é estado, enable é inicialização no boot; confundir os dois é a causa clássica de 'reiniciou e não subiu'.",
        "Uma unidade .service de usuário tem seções [Unit], [Service] e [Install]. [Unit] traz descrição e dependências como After=network.target; [Service] define ExecStart, WorkingDirectory, Restart e o usuário; [Install] define WantedBy para habilitar no boot. systemctl start, stop e restart alteram o estado imediato; enable e disable alteram o que acontece no próximo boot. Após editar arquivos em /etc/systemd/system, é necessário systemctl daemon-reload.\n\njournalctl consulta o journal estruturado do systemd. -u nome filtra uma unidade, -f acompanha em tempo real, --since e --until limitam o intervalo, -p err filtra por prioridade e -o short-iso muda o formato. Prioridades vão de emerg (0) a debug (7); err e crit merecem atenção antes de info. /var/log continua importante para aplicações que escrevem arquivos próprios, e logrotate controla rotação, compressão e retenção.\n\nCorrelacionar horários entre serviços é parte do diagnóstico: um erro de banco pode explicar uma falha de aplicação minutos depois. Use logger para gerar mensagens de teste e verifique fuso horário e sincronização de relógio, pois logs de máquinas diferentes só comparam bem quando os relógios estão alinhados. Logs muito longos sem rotação consomem disco; logs muito curtos impedem investigação. Política de retenção é decisão de projeto.",
        [
          ["unit", "Arquivo de configuração que descreve um recurso gerenciado pelo systemd."],
          ["enable", "Configuração para iniciar uma unidade automaticamente no boot."],
          ["journalctl", "Comando para consultar os logs estruturados do systemd."],
          ["prioridade", "Nível de severidade de uma mensagem de log, como err, warning ou info."],
          ["rotação", "Política que limita tamanho e idade dos arquivos de log."]
        ],
        {
          ex: [["Diagnóstico de serviço", "systemctl status lab.service; journalctl -u lab.service --since '10 min ago' -p warning"], ["Acompanhar falha", "journalctl -u lab.service -f -o short-iso mostra novas mensagens com timestamp legível."]],
          er: ["Usar start achando que habilitou no boot.", "Editar unidade e esquecer daemon-reload.", "Filtrar só a última linha sem contextualizar o horário."],
          lab: "Simulação: crie uma unidade de serviço de usuário, inicie-a, envie logger -t lab teste e interprete a saída de journalctl --user -u lab.",
          ref: "man7.org: systemd.unit(5), systemd.service(5), systemctl(1), journalctl(1), logrotate(8).",
          workedExamples: ["systemctl is-enabled lab.service responde enabled mesmo que o serviço esteja parado agora.", "journalctl -p err --since today reduz ruído em máquina com muitos avisos info."],
          recallQuestions: ["O que muda entre start e enable?", "O que -f faz em journalctl?", "Por que configurar rotação?"],
          masteryCriteria: ["Distingue estado atual e habilitação no boot.", "Filtra logs por unidade, tempo e prioridade.", "Explica retenção e rotação."],
          tags: ["systemd", "logs", "journalctl"],
          estimatedEffort: 30
        }),
      L("Usuários, sudo e SSH com menor privilégio",
        "Criar contas, delegar privilégios e configurar acesso remoto sem expor credenciais.",
        "Permissões de arquivo e noção de rede.",
        "Conta separada não é burocracia: é o que permite saber quem fez o quê e limitar o dano de um erro.",
        "useradd -m -s /bin/bash nome cria conta com diretório home e shell; usermod -aG grupo nome acrescenta a grupo sem remover os outros; passwd -l bloqueia senha. /etc/passwd, /etc/shadow e /etc/group guardam respectivamente dados da conta, senha hash e associação de grupos. sudo executa como outro usuário e registra a ação; visudo edita sudoers com validação de sintaxe. Conceder NOPASSWD amplo remove rastreabilidade e deve ser evitado.\n\nNo SSH, ssh-keygen cria par de chaves: a privada fica protegida no cliente, a pública vai para ~/.ssh/authorized_keys no servidor. PermitRootLogin no e PasswordAuthentication no, quando viáveis, reduzem força bruta. O firewall deve permitir apenas a porta necessária e, se possível, restringir origem. known_hosts protege contra servidor falso; mensagens de mudança de chave merecem investigação, não clique automático.\n\nQualquer teste de força bruta, varredura ou verificação de credenciais só deve ser feito em máquina própria, ambiente intencionalmente vulnerável ou plataforma com autorização explícita. Em rede de terceiros isso é dano, não laboratório. Para uso legítimo, prefira chaves com passphrase e agente SSH, rotação periódica e revogação imediata de chaves de ex-funcionários. Auditoria de contas e sudoers deve ser periódica: acesso obsoleto é privilégio esquecido.",
        [
          ["UID", "Identificador numérico de um usuário."],
          ["sudoers", "Arquivo que define quem pode executar o quê com sudo."],
          ["visudo", "Editor seguro para sudoers que valida a sintaxe antes de salvar."],
          ["chave pública", "Parte da chave SSH que pode ser instalada no servidor."],
          ["known_hosts", "Arquivo que registra chaves de hosts já vistos para detectar troca suspeita."]
        ],
        {
          ex: [["Conta de laboratório", "sudo useradd -m -s /bin/bash labuser && sudo usermod -aG labs labuser; id labuser confirma UID e grupos."], ["Endurecimento SSH", "PermitRootLogin no e PasswordAuthentication no em /etc/ssh/sshd_config, recarregando o serviço após testar nova conexão."]],
          er: ["Compartilhar chave privada ou deixá-la sem passphrase em máquina compartilhada.", "Testar credenciais em rede alheia 'para aprender'.", "Editar sudoers com editor comum sem visudo."],
          lab: "Simulação: em VM própria, crie usuário e grupo, configure sudo limitado a um comando, gere chave SSH e documente como revogar o acesso.",
          ref: "man7.org: useradd(8), usermod(8), visudo(8), sudoers(5), ssh(1), sshd_config(5); CIS Controls v8.",
          workedExamples: ["sudo -l -U labuser mostra exatamente o que a conta pode executar.", "ssh -i chave labuser@servidor usa chave privada sem digitar senha do usuário."],
          recallQuestions: ["Por que usar visudo?", "O que PermitRootLogin no muda?", "Quando um teste de acesso é legítimo?"],
          masteryCriteria: ["Aplica menor privilégio em contas e sudoers.", "Configura SSH por chave com passphrase.", "Restringe testes a sistemas autorizados."],
          tags: ["usuários", "sudo", "SSH"],
          estimatedEffort: 35
        }),
      L("Discos, montagem e backup restaurável",
        "Montar sistemas de arquivos com segurança e manter cópias cuja restauração foi realmente testada.",
        "Noção de arquivo, diretório e permissões.",
        "Backup não é arquivo bonito em disco: é capacidade comprovada de voltar a funcionar depois do desastre.",
        "lsblk lista dispositivos de bloco, blkid mostra UUID e tipo de sistema de arquivos, e df -h exibe uso. mount anexa um sistema de arquivos a um diretório; umount libera. O /etc/fstab declara montagens automáticas, e usar UUID em vez de /dev/sdb1 evita confusão quando a ordem dos discos muda. Opções como nofail impedem que uma montagem ausente trave o boot. Antes de formatar, confirme duas vezes o dispositivo: mkfs destrói dados sem perguntar.\n\nPara backup, tar -czf agrupa e compacta; rsync -a sincroniza preservando atributos e transfere apenas diferenças. A regra 3-2-1 recomenda três cópias, em dois meios diferentes, com uma fora do local. Backup incremental economiza espaço, mas depende da cadeia anterior; um teste de restauração valida a cadeia inteira. Criptografia e permissões no destino evitam que o backup vire uma cópia vazada dos dados.\n\nMonitoramento de saúde inclui SMART para discos, espaço livre e crescimento de snapshots. Cuidado com rsync --delete: ele apaga no destino o que não existe na origem, e um destino errado transforma backup em destruição. Documente o procedimento de restauração com comandos, destino, senhas necessárias e tempo estimado, e execute um simulacro periódico em ambiente isolado. Um backup nunca restaurado é uma hipótese, não um plano.",
        [
          ["UUID", "Identificador estável de um sistema de arquivos usado em montagens."],
          ["ponto de montagem", "Diretório onde o sistema de arquivos passa a aparecer na árvore."],
          ["fstab", "Arquivo que declara montagens automáticas no boot."],
          ["rsync", "Ferramenta de sincronização que transfere apenas diferenças."],
          ["regra 3-2-1", "Três cópias, dois meios distintos e uma fora do local."]
        ],
        {
          ex: [["Montagem segura", "sudo mount /dev/disk/by-uuid/abcd /mnt/backup; conferir com findmnt /mnt/backup"], ["Restauração de teste", "rsync -a /mnt/backup/ /mnt/restaurado/ e depois comparar arquivos com diff -r"]],
          er: ["Formatar /dev/sdb sem conferir se é o disco certo.", "Confiar em backup guardado apenas no mesmo disco dos dados.", "Nunca testar a restauração."],
          lab: "Simulação: crie uma imagem de disco de teste, monte-a em /mnt, copie arquivos, desmonte e descreva o passo a passo de restauração.",
          ref: "man7.org: lsblk(8), blkid(8), mount(8), fstab(5), rsync(1), tar(1), smartctl(8).",
          workedExamples: ["findmnt -t ext4 mostra quais sistemas ext4 estão montados e onde.", "Um simulacro mensal revela senha expirada antes do desastre real."],
          recallQuestions: ["Por que usar UUID no fstab?", "O que faz rsync --delete?", "O que valida um backup?"],
          masteryCriteria: ["Confere dispositivo antes de formatar.", "Aplica regra 3-2-1.", "Executa e documenta restauração de teste."],
          tags: ["disco", "montagem", "backup"],
          estimatedEffort: 35
        }),
      L("Firewall, monitoramento e a ilusão do ping",
        "Controlar tráfego de entrada e interpretar sinais de saúde sem confundir alcance de rede com porta aberta.",
        "Conceito de IP, porta e serviço em escuta.",
        "Ping responde não quer dizer serviço aberto; ping não responde não quer dizer máquina desligada.",
        "Firewalls filtram pacotes por endereço, protocolo, porta e estado da conexão. ufw simplifica regras em distribuições comuns; nftables é a base moderna no Linux. Uma política segura começa com negação padrão de entrada, liberando apenas o necessário e mantendo conexões estabelecidas e relacionadas. Regras amplas demais abrem superfície; regras restritas demais quebram serviço legítimo, por isso mudanças em firewall precisam de janela, plano de rollback e caminho de acesso alternativo.\n\nPara saber o que a máquina realmente expõe, use ss -tulpen no próprio host: mostra TCP e UDP em escuta, endereço local, estado e processo. 0.0.0.0:443 significa todas as interfaces, 127.0.0.1:8080 restringe ao loopback. Para testar uma porta a partir de outro host, use nc -vz host porta ou curl -v; ping usa ICMP e não TCP, portanto nunca prova que uma porta TCP está aberta. Um host pode responder ping com 443 fechada e outro pode bloquear ICMP com 443 aberta.\n\nMonitoramento complementa o controle: top e htop mostram processos, vmstat 1 revela filas e swapping, iostat detalha I/O de disco e sar permite consultar histórico. Alertas só são úteis quando têm limiar claro e resposta prevista; caso contrário viram ruído e são ignorados. Correlacione firewall, logs e métricas antes de concluir a causa. Em ambiente de produção, observe primeiro, mude depois e registre o que foi observado para comparação futura.",
        [
          ["nftables", "Framework de filtragem de pacotes do kernel Linux."],
          ["política padrão", "Decisão aplicada ao tráfego que não casa com nenhuma regra explícita."],
          ["ss -tulpen", "Comando que lista sockets em escuta TCP e UDP com processo e números."],
          ["ICMP", "Protocolo usado por ping, distinto de TCP e UDP."],
          ["limiar", "Valor que dispara um alerta em monitoramento."]
        ],
        {
          ex: [["Regra mínima", "ufw default deny incoming && ufw allow 22/tcp && ufw enable; antes de habilitar, confirme acesso alternativo."], ["Teste correto de porta", "ping servidor responde, mas nc -vz servidor 443 falha: host alcançável, sem listener TCP nessa porta."]],
          er: ["Usar ping para concluir que uma porta TCP está aberta.", "Abrir todas as portas e depois prometer restringir.", "Criar alerta sem limiar e sem resposta definida."],
          lab: "Simulação: em VM local, liste sockets com ss, escreva regras de firewall para permitir apenas uma porta e explique por que ping não valida essa porta.",
          ref: "man7.org: nft(8), ufw(8), ss(8), nc(1), ping(8), vmstat(8), iostat(8); RFC 792.",
          workedExamples: ["ss -tulpen | grep ':443 ' confirma listener local; nc -vz confirma alcance da porta Remoto.", "vmstat 1 com coluna si/so alta indica pressão de memória e swapping."],
          recallQuestions: ["O que ping testa afinal?", "Como confirmar uma porta TCP?", "Por que política padrão importa?"],
          masteryCriteria: ["Distingue ICMP de TCP.", "Configura política de negação padrão com exceções explícitas.", "Interpreta métricas com limiares claros."],
          tags: ["firewall", "monitoramento", "ping"],
          estimatedEffort: 35
        })
    ]
  },
  {
    name: "8.8 — Sistemas operacionais",
    lessons: [
      L("Processos, threads e o /proc",
        "Diferenciar processo de thread, interpretar estados e usar /proc para observar o sistema.",
        "Noção de programa em execução e de arquivo.",
        "Processo é unidade de recursos; thread é unidade de execução dentro desses recursos.",
        "fork() cria um processo filho com memória copiada sob write; exec() substitui a imagem do processo por outro programa. Cada processo tem PID, PPID, descritor de arquivos, memória virtual e estado. Os estados comuns incluem R (executando ou pronto), S (dormindo interrompível), D (dormindo ininterrompível, geralmente I/O), T (parado) e Z (zumbino, já terminado mas ainda não recolhido por waitpid pelo pai). Zumbis não consomem CPU, mas consomem entrada na tabela de processos.\n\nThreads pertencem ao mesmo processo e compartilham espaço de endereço e descritores, embora tenham pilha e registradores próprios. No Linux, tanto processos quanto threads são criados por variantes de clone(), e ps -eLf ou top -H permitem vê-las. A troca de contexto salva e restaura registradores e estruturas do escalonador; é necessária para multiprogramação, mas tem custo.\n\nO /proc é uma interface de arquivos que expõe estruturas do kernel. /proc/PID/status traz estado, UID e limites; cmdline mostra os argumentos; fd lista descritores abertos; maps descreve regiões de memória; stat contém contadores. Esses arquivos não são armazenados em disco: são gerados pelo kernel quando lidos. Por isso mudam entre leituras e exigem interpretação cuidadosa. Ferramentas como ps, top e pgrep leem basicamente essas mesmas fontes.",
        [
          ["processo", "Instância de um programa em execução com recursos próprios."],
          ["thread", "Unidade de execução dentro de um processo que compartilha seu espaço de endereço."],
          ["zumbi", "Processo terminado cuja entrada permanece até o pai recolher o status."],
          ["troca de contexto", "Operação de salvar um contexto de execução e carregar outro."],
          ["/proc", "Sistema de arquivos virtual que expõe informações do kernel e dos processos."]
        ],
        {
          ex: [["Árvore de processos", "pstree -p mostra init -> shell -> comando, revelando quem é pai de quem."], ["Descritores", "ls -l /proc/$$/fd mostra os arquivos abertos pelo shell atual, incluindo 0, 1 e 2."]],
          er: ["Achar que thread tem memória separada como processo.", "Confundir processo zumbi com processo preso em D.", "Tratar arquivos de /proc como dados gravados em disco."],
          lab: "Simulação: crie um processo sleep, identifique PID e PPID, leia /proc/PID/status e envie SIGTERM, observando o estado antes e depois.",
          ref: "man7.org: fork(2), execve(2), clone(2), proc(5), ps(1), top(1); OSTEP, cap. 4.",
          workedExamples: ["ps -o pid,ppid,stat,cmd -p $$ mostra estado e pai do shell atual.", "Um processo em D não responde a SIGTERM até a operação de I/O terminar."],
          recallQuestions: ["O que fork cria?", "O que threads compartilham?", "O que /proc/PID/status revela?"],
          masteryCriteria: ["Distingue PID, PPID e thread.", "Interpreta estados R, S, D, T e Z.", "Usa /proc para observar processo real."],
          tags: ["processos", "threads", "/proc"],
          estimatedEffort: 35
        }),
      L("Escalonamento e concorrência",
        "Entender como o kernel escolhe o próximo processo e por que concorrência cria erros difíceis de reproduzir.",
        "Estados de processo e noção de troca de contexto.",
        "Vários processos 'ao mesmo tempo' são, na maioria das máquinas, uma sequência rápida de fatias de CPU.",
        "O escalonador decide qual tarefa usa a CPU. No Linux, o CFS (Completely Fair Scheduler) procura distribuir tempo de CPU proporcionalmente a pesos, usando uma noção de vruntime: quem recebeu menos tempo relativo é escolhido primeiro. nice vai de -20 (maior prioridade) a 19 (menor), e nice afina o peso sem garantir execução imediata. Processos ligados a CPU e processos ligados a I/O têm padrões diferentes: os segundos normalmente dormem com frequência e não consomem a fatia inteira.\n\nA fatia de tempo e a preempção permitem que uma tarefa interrompa outra. Cada troca de contexto tem custo direto de registradores e indireto de cache e TLB; por isso excesso de threads pode reduzir desempenho. Em sistemas multicore, tarefas rodam de verdade em paralelo em núcleos diferentes, e a concorrência deixa de ser apenas ilusão.\n\nQuando dois fluxos acessam dado compartilhado sem coordenação, o resultado depende da ordem das operações: surge a race condition. A região que não pode ser interrompida é a seção crítica. Operações aparentemente simples como contador++ são sequências de leitura, soma e escrita, e podem perder atualizações. Escalonamento justo e correção são objetivos distintos: um escalonador perfeito não protege dado compartilhado; isso cabe a sincronização e desenho do programa.",
        [
          ["CFS", "Escalonador do Linux baseado em distribuir tempo de CPU de forma proporcional."],
          ["nice", "Valor que ajusta o peso de escalonamento de um processo."],
          ["preempção", "Interrupção de uma tarefa em execução para dar CPU a outra."],
          ["race condition", "Resultado dependente da ordem não controlada de acessos concorrentes."],
          ["seção crítica", "Trecho de código que acessa recurso compartilhado e não deve ser executado simultaneamente."]
        ],
        {
          ex: [["Prioridade", "nice -n 10 ./tarefa pesada roda com menor peso; renice -n -5 -p PID aumenta a prioridade se permitido."], ["Perda de atualização", "Dois threads leem contador=10, somam 1 e escrevem 11; uma das incrementações desaparece."]],
          er: ["Achar que nice garante CPU exclusiva.", "Supor que corrida só acontece em multiprocessador.", "Confundir concorrência com paralelismo."],
          lab: "Simulação: execute duas contagens concorrentes sobre o mesmo arquivo sem travamento, observe divergência e repita com flock para comparar.",
          ref: "man7.org: sched(7), nice(1), renice(1), sched_setscheduler(2); OSTEP, cap. 7 e 8.",
          workedExamples: ["top -H mostra threads separadamente e permite ver qual consome CPU.", "Em uma máquina de um núcleo, alternância rápida simula paralelismo, mas não elimina race conditions."],
          recallQuestions: ["Como CFS escolhe a próxima tarefa?", "O que nice muda?", "O que é race condition?"],
          masteryCriteria: ["Explica escalonamento e preempção.", "Distingue concorrência e paralelismo.", "Reconhece seção crítica."],
          tags: ["escalonamento", "concorrência", "CFS"],
          estimatedEffort: 35
        }),
      L("Sincronização e deadlocks",
        "Usar primitivas de sincronização e reconhecer as condições que levam ao impasse.",
        "Concorrência, seção crítica e race conditions.",
        "Travar tudo resolve a corrida e cria outro problema: ninguém mais avança.",
        "Mutex é trava de posse exclusiva: quem tranca deve destrancar. Semáforo conta recursos disponíveis e pode ser usado para limitar acesso a um pool. Variável de condição permite esperar até que um predicado mude, normalmente com mutex associado. Rwlock permite vários leitores ou um escritor. No Linux, futex é a primitiva usada por bibliotecas para implementar essas estruturas com operações rápidas no caminho comum e chamadas ao kernel apenas quando há contenção.\n\nEspera ativa consome CPU; dormir e ser acordado evita desperdício, mas exige protocolo correto para não perder sinalização. Problemas típicos incluem condições que mudam entre o teste e a espera, inversão de prioridade e esquecimento de liberar trava em caminho de erro.\n\nDeadlock ocorre quando quatro condições se mantêm ao mesmo tempo: exclusão mútua, posse e espera, ausência de preempção e espera circular. Prevenção ataca uma delas, por exemplo exigindo que todas as travas sejam adquiridas em ordem global fixa. Evitação, como o algoritmo do banqueiro, verifica se o estado é seguro antes de conceder recurso; detecção procura ciclos e recupera abortando uma tarefa. Na prática, ordem de travamento, timeouts e seções críticas menores são as defesas mais usadas. Menos estado compartilhado significa menos oportunidades de impasse.",
        [
          ["mutex", "Primitiva de exclusão mútua que só permite um possuidor por vez."],
          ["semáforo", "Contador que controla quantas tarefas acessam um recurso."],
          ["variável de condição", "Mecanismo para esperar que uma condição seja satisfeita."],
          ["futex", "Primitiva do kernel usada para implementar travas eficientes no Linux."],
          ["deadlock", "Estado em que tarefas bloqueadas esperam umas pelas outras indefinidamente."]
        ],
        {
          ex: [["Ordem de travamento", "Se duas tarefas sempre pegam mutex A antes de B, não há ciclo de espera entre elas."], ["Timeout", "pthread_mutex_timedlock falha após prazo, permitindo registrar e tentar outra estratégia."]],
          er: ["Esperar sem verificarpredicado em loop, confiando em acordar uma vez.", "Pegar travas em ordens diferentes em funções distintas.", "Manter trava enquanto faz I/O longa."],
          lab: "Simulação: escreva duas rotinas que travam recursos em ordens opostas, observe o impasse e depois imponha ordem global para removê-lo.",
          ref: "man7.org: pthread_mutex_lock(3), pthread_cond_wait(3), futex(2), flock(2); OSTEP, cap. 28 a 30.",
          workedExamples: ["while (condicao_falsa) pthread_cond_wait(&cond, &mutex) protege contra acordos espúrios.", "flock -n evita espera indefinida em scripts concorrentes."],
          recallQuestions: ["Quatro condições do deadlock?", "O que futex otimiza?", "Como ordem de travamento ajuda?"],
          masteryCriteria: ["Escolhe primitiva adequada.", "Identifica as quatro condições de impasse.", "Aplica prevenção por ordem ou timeout."],
          tags: ["sincronização", "deadlock", "futex"],
          estimatedEffort: 40
        }),
      L("Memória virtual, paginação e TLB",
        "Relacionar endereços virtuais a físicos e interpretar page faults, swap e pressão de memória.",
        "Processos, espaço de endereço e noção de byte.",
        "Nenhum processo enxerga a memória física diretamente: todos recebem um mapa privado que o kernel traduz.",
        "A MMU traduz endereços virtuais em físicos usando page tables. A memória é dividida em páginas, tipicamente de 4 KiB. Cada processo tem sua própria tabela, o que isola espaços de endereço e permite que o mesmo endereço virtual aponte para páginas físicas diferentes em processos distintos. A TLB é um cache de traduções recentes: sem ela, cada acesso exigiria caminhar pela page table.\n\nDemand paging carrega páginas sob demanda. Page fault minor ocorre quando a página já está em memória, mas ainda não mapeada; major exige leitura do disco. Copy-on-write permite que fork compartilhe páginas até que um dos lados escreva, momento em que a página é copiada. Swap move páginas pouco usadas para disco, reduzindo memória disponível em troca de latência muito maior. O OOM killer encerra processos quando o sistema não consegue atender a demanda de memória.\n\nEm Linux, free -h mostra total, usado, livre, buff/cache e available; available é a melhor estimativa do que pode ser alocado sem pressão. /proc/meminfo detalha cache, swap e dirty pages. smaps ou pmap mostram mapas de um processo. Alto uso de cache não é desperdício: páginas em cache podem ser recuperadas. Já swapping sustentado e crescimento de fila de E/S indicam que o sistema está sob pressão, não apenas 'usando memória'.",
        [
          ["MMU", "Unidade de hardware que traduz endereços virtuais em físicos."],
          ["page table", "Estrutura que mapeia páginas virtuais para páginas físicas."],
          ["TLB", "Cache de traduções de endereços recentes."],
          ["page fault", "Interrupção gerada quando uma página virtual não está pronta para uso."],
          ["swap", "Mecanismo que move páginas para disco para liberar memória física."]
        ],
        {
          ex: [["Leitura de free", "Memória used alta com available alta pode ser só cache; available baixa com si/so altos indica pressão real."], ["Copy-on-write", "Após fork, alterar uma variável no filho gera cópia da página, sem copiar todo o espaço de endereço."]],
          er: ["Achar que free baixo sempre significa problema.", "Confundir page fault minor com leitura de disco.", "Tratar swap como solução gratuita de memória."],
          lab: "Simulação: observe free -h e vmstat 1, abra um processo que aloca memória crescente e registre quando swapping e OOM começam a aparecer.",
          ref: "man7.org: proc(5), free(1), vmstat(1), pmap(1), mmap(2); OSTEP, cap. 12 a 20.",
          workedExamples: ["pmap -x PID mostra RSS e páginas sujas por região do processo.", "Um page fault major é caro porque envolve E/S de disco."],
          recallQuestions: ["O que a TLB acelera?", "O que é copy-on-write?", "Como saber se há pressão de memória?"],
          masteryCriteria: ["Explica tradução virtual para físico.", "Distingue page faults e swap.", "Interpreta available em free -h."],
          tags: ["memória virtual", "paginação", "TLB"],
          estimatedEffort: 40
        }),
      L("Sistemas de arquivos, I/O e isolamento",
        "Conectar arquivos, dispositivos, chamadas de sistema, containers e máquinas virtuais em uma visão coerente.",
        "Memória virtual, processos e permissões de arquivo.",
        "Arquivo é uma abstração: por baixo há inodes, blocos, cache e dispositivos que o kernel media.",
        "Um sistema de arquivos organiza dados em inodes e blocos. O inode guarda metadados como tipo, tamanho, dono, permissões e ponteiros para blocos; o nome é uma entrada de diretório que aponta para o inode. A VFS é uma camada comum que permite que ext4, XFS e outros sistemas coexistam. Journaling registra intenções antes de aplicar mudanças, reduzindo a necessidade de verificações longas após queda de energia. O page cache mantém blocos lidos em memória para acelerar acessos futuros.\n\nAplicativos acessam arquivos por chamadas de sistema como open(), read(), write(), lseek() e close(). O kernel valida permissões e traduz a operação em blocos, passando pela camada de bloco e pelo driver do dispositivo. I/O bufferizado usa o cache do kernel; I/O direto evita esse cache quando o aplicativo gerencia o seu próprio. Arquivos de dispositivo em /dev expõem hardware e pseudodispositivos como interface de arquivo.\n\nisolamento vem em camadas. Containers usam namespaces para separar PID, rede, montagens e usuários, e cgroups para limitar CPU, memória e I/O; compartilham o kernel do host. Máquinas virtuais adicionam um hipervisor e um kernel convidado, com limites mais fortes e custo maior. Nem container nem VM substitui permissões corretas e atualizações: isolamento é uma ferramenta, não desculpa para abrir serviço desnecessário. Entender essa cadeia ajuda a explicar por que um arquivo visível em um container pode não existir no host da mesma forma.",
        [
          ["inode", "Estrutura que guarda metadados e localização dos blocos de um arquivo."],
          ["VFS", "Camada do kernel que unifica diferentes sistemas de arquivos."],
          ["journaling", "Técnica que registra mudanças antes de aplicá-las para acelerar recuperação."],
          ["namespace", "Mecanismo do kernel que isola a visão de recursos para um processo."],
          ["cgroup", "Mecanismo que limita e contabiliza recursos de um grupo de processos."]
        ],
        {
          ex: [["Metadados", "ls -li mostra número do inode; dois nomes com mesmo inode são links duros para os mesmos dados."], ["Isolamento", "docker run --memory=512m usa cgroups para limitar memória, enquanto namespaces escondem processos do host."]],
          er: ["Achar que container tem kernel próprio.", "Supor que page cache é desperdício de memória.", "Trocar permissões corretas por confiança cega no isolamento."],
          lab: "Simulação: escreva em C um programa que use open, write, read e close, compile com gcc -Wall -Wextra e relacione cada chamada à camada do kernel envolvida.",
          ref: "man7.org: open(2), read(2), write(2), close(2), proc(5), cgroups(7), namespaces(7), mount(8); OSTEP, cap. 39 a 42.",
          workedExamples: ["stat arquivo mostra inode, links duros e blocos usados.", "Um container com namespace de rede vê interfaces diferentes do host, mas compartilha o mesmo kernel."],
          recallQuestions: ["O que inode guarda?", "O que VFS padroniza?", "Como container difere de VM?"],
          masteryCriteria: ["Explica inode e journaling.", "Descreve papel das chamadas de sistema.", "Distingue namespaces e hipervisor."],
          tags: ["filesystem", "I/O", "containers"],
          estimatedEffort: 40
        })
    ]
  },
  {
    name: "8.9 — Laboratórios Linux",
    lessons: [
      L("Laboratórios 1 e 2 — usuário, grupo e permissões mínimas",
        "Criar conta isolada e conceder exatamente o acesso necessário, verificando o resultado.",
        "Usuários, grupos e modo de permissões.",
        "Permissão mínima é a que permite a tarefa e nada além; o excesso é dano esperando um erro.",
        "Laboratório 1 — criar usuário e grupo. Em VM própria, execute sudo groupadd labs e sudo useradd -m -s /bin/bash labuser, depois sudo usermod -aG labs labuser. Confira com id labuser e com getent group labs. Guarde os comandos em um bloco de notas do laboratório e registre o objetivo de cada conta. Se precisar bloquear acesso temporariamente, use sudo passwd -l labuser e documente como desfazer.\n\nLaboratório 2 — permissões mínimas. Crie /srv/labs com sudo install -d -o root -g labs -m 2750 /srv/labs: o bit setgid faz novos arquivos herdarem o grupo. Coloque um arquivo de leitura com chmod 640 e um diretório de escrita separado com chmod 770. Teste como labuser quais operações funcionam e quais falham, usando sudo -u labuser. Verifique com ls -l, namei -l e findmnt. Um erro de permissão esperado é parte do resultado, não falha do laboratório.\n\nCritérios de conclusão: explicar UID, GID e grupos suplementares; justificar cada bit de permissão; demonstrar que a conta não consegue ler arquivo fora do escopo; registrar comandos e Observações. Todos os passos ocorrem em máquina própria ou ambiente isolado; nunca altere contas em sistema compartilhado sem autorização.",
        [
          ["grupo suplementar", "Grupo adicional ao qual um usuário pertence além do grupo primário."],
          ["setgid em diretório", "Bit que faz novos arquivos herdarem o grupo do diretório."],
          ["umask", "Máscara que remove permissões de arquivos recém-criados."],
          ["namei -l", "Comando que mostra permissões de todos os componentes de um caminho."],
          ["menor privilégio", "Princípio de conceder apenas o acesso necessário à tarefa."]
        ],
        {
          ex: [["Verificação", "id labuser mostra uid, gid e groups; sudo -u labuser teste -r /srv/labs/arquivo && echo 'pode ler'"], ["Diagnóstico de caminho", "namei -l /srv/labs/arquivo revela qual diretório no caminho bloqueia o acesso."]],
          er: ["Dar chmod 777 para 'resolver' permissão.", "Alterar contas do sistema host sem autorização.", "Não registrar os comandos usados no laboratório."],
          lab: "Execução guiada: realize os dois laboratórios em VM local, capture a saída de id, ls -l e namei -l e escreva um parágrafo justificando cada permissão escolhida.",
          ref: "man7.org: useradd(8), usermod(8), install(1), chmod(1), namei(1), sudo(8).",
          workedExamples: ["install -d -m 2750 cria diretório com setgid e sem acesso para outros.", "Se /srv não permite execução para outros, permissão no arquivo final não adianta."],
          recallQuestions: ["O que setgid faz no diretório?", "Como verificar grupos de um usuário?", "Por que 777 é inadequado?"],
          masteryCriteria: ["Cria conta e grupo com comandos corretos.", "Justifica cada permissão.", "Verifica acesso efetivo como o usuário criado."],
          tags: ["laboratório", "permissões", "usuários"],
          estimatedEffort: 35
        }),
      L("Laboratórios 3 e 4 — backup em script e sinais",
        "Automatizar cópia de segurança de forma repetível e observar processos e sinais em segurança.",
        "Shell scripting, traps e noção de processo.",
        "Um script de backup que falha silenciosamente é pior que nenhum backup: ele transmite falsa confiança.",
        "Laboratório 3 — script de backup. Em diretório próprio, escreva backup.sh com set -euo pipefail, validação do destino, mktemp -d para staging, trap de limpeza, rsync -a para o destino e logger -t forge-backup para início e fim. Inclua --dry-run como opção de teste. Execute duas vezes e confirme que o resultado é idêntico. Em seguida, faça uma restauração de teste em pasta separada e compare com diff -r. Registre código de saída e mensagens de log.\n\nLaboratório 4 — processos e sinais. Inicie sleep 300 &, liste com jobs e ps -o pid,ppid,stat,cmd, envie SIGTERM com kill -TERM PID e observe o encerramento. Repita com um processo que ignore TERM e use SIGKILL apenas como último recurso, registrando por que a escala TERM antes de KILL importa. Use wait para recolher o status do filho e evite zumbis. Não envie sinais a processos que você não criou.\n\nCritérios de conclusão: o script roda duas vezes sem duplicar efeitos; a restauração é comparada; a diferença entre SIGTERM e SIGKILL é explicada com base em limpeza; nenhum sinal foi enviado fora do escopo. Os exemplos da Forge são simulações quando exibem saídas prontas; a execução real só acontece em máquina própria, com os comandos que você digitou e a saída que você coletou.",
        [
          ["staging", "Diretório temporário onde o resultado é montado antes de ser publicado."],
          ["SIGTERM", "Sinal que pede encerramento e permite limpeza."],
          ["SIGKILL", "Sinal que encerra imediatamente, sem possibilidade de limpeza."],
          ["wait", "Comando que aguarda processo filho e recolhe seu código de saída."],
          ["dry-run", "Modo que mostra o que seria feito sem aplicar mudanças."]
        ],
        {
          ex: [["Execução repetida", "./backup.sh --dry-run mostra o plano; ./backup.sh executa; segunda execução não duplica arquivos."], ["Sinal correto", "kill -TERM 4321 encerra o sleep criado; kill -KILL só se TERM falhar."]],
          er: ["Usar kill -9 como primeira reação.", "Enviar sinais a PID obtido de ps sem confirmar autoria.", "Declarar backup concluído sem restaurar."],
          lab: "Execução guiada: implemente o script, execute duas vezes, restaure em pasta separada e registre a sequência de sinais enviados ao processo de teste.",
          ref: "man7.org: bash(1), rsync(1), logger(1), mktemp(1), kill(1), wait(1), signal(7).",
          workedExamples: ["trap 'rm -rf -- \"$tmp\"' EXIT remove staging mesmo se rsync falhar.", "ps -o stat -p PID mudando de S para Z sinaliza filho terminado aguardando wait."],
          recallQuestions: ["O que dry-run valida?", "Por que TERM antes de KILL?", "O que prova que backup funcionou?"],
          masteryCriteria: ["Script é idempotente e registrado.", "Restauração é testada e comparada.", "Sinais restritos a processos próprios."],
          tags: ["laboratório", "backup", "sinais"],
          estimatedEffort: 40
        }),
      L("Laboratórios 5 e 6 — pipeline de logs e inspeção do /proc",
        "Extrair informação de logs com pipelines e ler estruturas vivas do kernel em /proc.",
        "journalctl, pipes, expressões regulares e /proc.",
        "Log é texto com contexto; pipeline bom reduz ruído sem apagar a evidência que você precisa explicar.",
        "Laboratório 5 — pipeline de logs. Em máquina própria, use journalctl --user -u lab --since today -o short-iso para listar mensagens, filtre com grep -i 'falha|erro' e conte com wc -l. Em seguida, extraia campos com awk e ordene com sort | uniq -c. Com set -o pipefail ativo no script, uma falha em qualquer etapa do pipeline aparece. Registre o comando completo, o intervalo de tempo e o que cada filtro removeu. Não colete logs de usuários alheios.\n\nLaboratório 6 — inspeção de /proc. Leia /proc/self/status, /proc/self/cmdline (com tr '\\0' ' '), /proc/self/fd e /proc/self/maps. Compare com ps -o pid,rss,vsz -p $$ e com pmap -x $$. Observe que arquivos de /proc são gerados pelo kernel no momento da leitura: duas leituras podem diferir, e números de arquivo ou descritores mudam entre processos. Anote o significado de VmRSS, VmSize e Threads.\n\nCritérios de conclusão: explicar o efeito de cada etapa do pipeline; mostrar que pipefail muda o código de saída; associar pelo menos três campos de /proc a conceitos de memória e processos; separar claramente saída simulada da Forge e saída real obtida no seu terminal. Se o material didático mostrar uma captura pronta, trate-a como exemplo de leitura, nunca como evidência de que você executou o laboratório.",
        [
          ["pipefail", "Opção que faz o pipeline falhar quando qualquer etapa falha."],
          ["uniq -c", "Comando que conta ocorrências de linhas iguais consecutivas."],
          ["VmRSS", "Campo de /proc com memória física residente do processo."],
          ["VmSize", "Campo de /proc com tamanho virtual do espaço de endereço."],
          ["/proc/self", "Atalho que aponta para o diretório do processo que está lendo."]
        ],
        {
          ex: [["Contagem de erros", "journalctl --user -u lab --since today | grep -i erro | sort | uniq -c | sort -nr"], ["Leitura segura", "tr '\\0' ' ' < /proc/self/cmdline; echo; cat /proc/self/status | grep -E 'VmRSS|VmSize|Threads'"]],
          er: ["Usar grep sem registrar qual filtro foi aplicado.", "Achar que /proc é armazenado em disco.", "Apresentar saída simulada como se fosse execução real."],
          lab: "Execução guiada: monte um pipeline com journalctl, grep, awk e uniq -c, leia /proc/self e escreva a interpretação de três campos com a saída real copiada do terminal.",
          ref: "man7.org: journalctl(1), grep(1), awk(1), sort(1), uniq(1), proc(5), pmap(1).",
          workedExamples: ["grep -c 'falha' log.txt | xargs echo 'falhas:' transforma contagem em relatório simples.", "VmSize pode ser muito maior que VmRSS porque inclui memória virtual mapeada, não necessariamente residente."],
          recallQuestions: ["O que pipefail detecta?", "O que VmRSS mede?", "Por que /proc muda entre leituras?"],
          masteryCriteria: ["Explica cada etapa do pipeline.", "Interpreta campos de /proc.", "Distingue simulação de execução real."],
          tags: ["laboratório", "logs", "/proc"],
          estimatedEffort: 35
        }),
      L("Laboratórios 7 e 8 — imagem de disco e chamadas de sistema em C",
        "Montar imagem de disco de teste e escrever programa C que usa open, read e write com checagem de erro.",
        "Montagem, permissões e noção de chamada de sistema.",
        "Antes de formatar ou montar, confirme o caminho: nenhuma mensagem de erro vai devolver dados apagados.",
        "Laboratório 7 — imagem de disco. Em diretório próprio, crie imagem com truncate -s 64M lab.img, formate com mkfs.ext4 -F lab.img e monte com sudo mkdir -p /mnt/lab && sudo mount -o loop lab.img /mnt/lab. Crie arquivos de teste, verifique com findmnt /mnt/lab e desmonte com sudo umount /mnt/lab. Nunca aponte mkfs ou mount para dispositivo de sistema: o alvo deve ser a imagem criada por você. Registre UUID, tipo de sistema de arquivos e mensagens de erro.\n\nLaboratório 8 — C com open/read/write. Escreva programa que abra arquivo com open(..., O_CREAT|O_WRONLY|O_TRUNC, 0644), escreva com write(), feche, reabra com O_RDONLY, leia com read() em loop e verifique cada retorno. Trate -1 com perror, -1 com EINTR repetindo a chamada, e 0 de read como fim de arquivo. Compile com gcc -Wall -Wextra -Werror -o lab lab.c e execute em diretório temporário. A união dos dois laboratórios mostra a cadeia: syscall -> VFS -> sistema de arquivos -> bloco -> dispositivo, mesmo quando o dispositivo é uma imagem em arquivo.\n\nCritérios de conclusão: montar e desmontar sem tocar em discos reais; explicar o papel de O_TRUNC e do modo 0644; justificar a checagem de retorno de cada syscall; descrever o que muda se a imagem estiver em disco SSD real. Se a plataforma exibir capturas simuladas para estes laboratórios, use-as para treinar leitura; a execução real depende dos comandos rodados na sua máquina.",
        [
          ["loop device", "Dispositivo de bloco que mapeia um arquivo como se fosse disco."],
          ["O_TRUNC", "Flag de open que zera o arquivo existente ao abri-lo para escrita."],
          ["EINTR", "Erro indicando que chamada foi interrompida por sinal e deve ser repetida."],
          ["perror", "Função que imprime mensagem de erro associada a errno."],
          ["findmnt", "Comando que confirma onde um sistema de arquivos está montado."]
        ],
        {
          ex: [["Montagem", "truncate -s 64M lab.img && mkfs.ext4 -F lab.img && sudo mount -o loop lab.img /mnt/lab"], ["Leitura completa", "while ((n = read(fd, buf, sizeof buf)) > 0) { ssize_t w = write(STDOUT_FILENO, buf, n); if (w < 0) perror(\"write\"); }"]],
          er: ["Rodar mkfs contra /dev/sda por engano.", "Ignorar retorno negativo de read ou write.", "Desmontar imagem com arquivo ainda aberto sem conferir."],
          lab: "Execução guiada: crie imagem, monte, escreva e leia arquivo pelo programa C, desmonte e documente cada syscall com seu retorno observado.",
          ref: "man7.org: losetup(8), mount(8), mkfs.ext4(8), open(2), read(2), write(2), errno(3); The Linux Programming Interface, cap. 4.",
          workedExamples: ["O_TRUNC em arquivo existente apaga o conteúdo anterior antes da escrita.", "read retornando 0 não é erro: é fim de arquivo; -1 com EINTR pede repetição."],
          recallQuestions: ["O que loop device permite?", "Por que checar errno?", "Qual a diferença entre read==0 e read==-1?"],
          masteryCriteria: ["Usa apenas imagem própria como alvo.", "Trata erros e EINTR nas syscalls.", "Relaciona syscall a camadas do sistema de arquivos."],
          tags: ["laboratório", "disco", "C"],
          estimatedEffort: 45
        }),
      L("Laboratórios 9 e 10 — medir uso e serviço documentado",
        "Medir CPU e memória de forma interpretável e entregar serviço de usuário com documentação e critérios de aceite.",
        "Processos, systemd de usuário e ferramentas de medição.",
        "Número de monitoramento sem contexto é só decimal bonito: meça, interprete e registre o que mudou.",
        "Laboratório 9 — medir consumo. Use /usr/bin/time -v ./carga para ver tempo decorrido, tempo de CPU e memória máxima; top -p PID para acompanhar uso instantâneo; ps -o pid,pcpu,rss,vsz,cmd -p PID para foto; vmstat 1 para fila de execução e swapping. Repita a medição três vezes e registre variação. Compare CPU-bound e I/O-bound: o primeiro consome fatia inteira, o segundo dorme esperando I/O. Não conclua gargalo a partir de uma única amostra.\n\nLaboratório 10 — serviço de usuário. Crie ~/.config/systemd/user/lab.service com [Service] ExecStart apontando para script próprio, Restart=on-failure e [Install] WantedBy=default.target. Execute systemctl --user daemon-reload, systemctl --user enable --now lab.service e journalctl --user -u lab.service -f. Teste falha proposital e observe Restart. Documente objetivo, comandos de instalação, variáveis, portas ou arquivos usados, como verificar funcionamento, como parar e como reverter, além de critérios de aceite mensuráveis.\n\nCritérios de conclusão: três medições com interpretação; serviço ativo após enable e visível no journal; documentação permitindo que outra pessoa reproduza e desfaça a mudança. Nenhum teste ofensivo faz parte destes laboratórios: varreduras, exploração ou verificação de credenciais só em máquinas próprias, ambientes intencionalmente vulneráveis ou plataformas com autorização explícita. Apresentar simulação como execução real invalida a evidência do laboratório.",
        [
          ["/usr/bin/time", "Comando que mede tempo e recursos de outro programa."],
          ["RSS", "Memória física residente de um processo."],
          ["Restart=on-failure", "Política do systemd que reinicia serviço após falha."],
          ["systemctl --user", "Comando que controla serviços no escopo do usuário."],
          ["critério de aceite", "Condição observável que prova que a entrega funciona."]
        ],
        {
          ex: [["Medição", "/usr/bin/time -v ./carga 2> tempo.txt; grep -E 'Elapsed|Maximum resident' tempo.txt"], ["Serviço", "systemctl --user status lab.service e journalctl --user -u lab.service --since '5 min ago'"]],
          er: ["Concluir gargalo com uma única amostra.", "Esquecer daemon-reload após editar unidade.", "Rodar testes ofensivos em rede não autorizada."],
          lab: "Execução guiada: meça duas cargas diferentes três vezes cada, crie serviço de usuário documentado e escreva critérios de aceite verificáveis.",
          ref: "man7.org: time(1), top(1), ps(1), vmstat(1), systemd.unit(5), systemctl(1), journalctl(1).",
          workedExamples: ["VmRSS alto e estável pode ser cache de bibliotecas; crescente sem limite sugere vazamento.", "Restart=on-failure com script que sai 1 gera reinícios visíveis no journal."],
          recallQuestions: ["O que RSS representa?", "O que enable --now faz?", "Por que documentar rollback?"],
          masteryCriteria: ["Faz medições repetidas e interpretadas.", "Entrega serviço funcional e auditável.", "Restringe testes a escopo autorizado."],
          tags: ["laboratório", "monitoramento", "systemd"],
          estimatedEffort: 40
        })
    ]
  }
);

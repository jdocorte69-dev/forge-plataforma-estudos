/* ============================================================
   FORGE — data-networks-advanced.js
   Complemento avançado de Redes: R4 a R12 da Enciclopédia Mestra.
   Exige data.js (helper L e CURRICULUM) e data-networks.js.
   ============================================================ */

CURRICULUM.networks.modules.push(
  {
    name: "R4 — IPv6",
    lessons: [
      L("IPv6: representação hexadecimal e compressão",
        "Ler, escrever e comprimir endereços IPv6 sem alterar o valor do endereço.",
        "Notação binária, octetos e prefixo CIDR em IPv4.",
        "Um endereço IPv6 é um número de 128 bits escrito em hexadecimal; comprimir significa apenas abreviar zeros.",
        "O IPv6 (RFC 8200) usa $128$ bits, ou $16$ bytes, escritos como oito grupos de quatro algarismos hexadecimais chamados hextets: 2001:0db8:0000:0000:0000:ff00:0042:8329. Cada algarismo hexadecimal vale $4$ bits, logo cada grupo vale $16$ bits e o endereço completo vale $8 \\times 16 = 128$ bits. O espaço é $2^{128}$, contra $2^{32}$ do IPv4.\n\nHá duas regras de abreviação. Zeros à esquerda de cada grupo podem ser omitidos: 0db8 vira db8 e 0042 vira 42. Depois, uma sequência contígua de grupos inteiramente zero pode virar ::, uma única vez por endereço, para não criar ambiguidade. Assim, 2001:0db8:0000:0000:0000:ff00:0042:8329 vira 2001:db8::ff00:42:8329, em que :: representa três grupos zero. Se houver mais de uma sequência de zeros, comprime-se a maior.\n\nO bloco 2001:db8::/32 é reservado para documentação: usá-lo nos exemplos não aponta para máquina real da Internet. Endereços especiais incluem :: (não especificado) e ::1 (loopback). Prefixos funcionam como no IPv4, mas a LAN típica é /64: $64$ bits de rede e $64$ bits de identificador de interface.",
        [
          ["hextet", "Grupo de quatro algarismos hexadecimais, equivalente a 16 bits, de um endereço IPv6."],
          ["compressão com ::", "Substituição de uma sequência contígua de grupos zero por dois dois-pontos, permitida uma vez por endereço."],
          ["2001:db8::/32", "Prefixo reservado para documentação e exemplos, sem roteamento na Internet pública."],
          ["::1", "Endereço de loopback IPv6, equivalente a 127.0.0.1 em IPv4."],
          ["prefixo /64", "Tamanho usual de uma LAN IPv6, com 64 bits para a rede e 64 para o identificador de interface."]
        ],
        {
          ex: [["Comprima um endereço", "2001:0db8:0000:0000:0000:0000:0000:0001 tem cinco grupos zero seguidos; a forma comprimida é 2001:db8::1."], ["Expanda um endereço", "fe80::2 tem os grupos fe80:0000:0000:0000:0000:0000:0000:0002; falta o índice de interface, por exemplo fe80::2%eth0, para identificar o enlace."]],
          er: ["Usar :: duas vezes no mesmo endereço, criando ambiguidade.", "Achar que a compressão altera o valor numérico do endereço.", "Esquecer que 2001:db8::/32 é apenas documento, não rede roteável."],
          lab: "Simulação: converta em papel 2001:0db8:0000:0000:0000:ff00:0042:8329 para a forma comprimida e depois expanda 2001:db8::1.",
          ref: "RFC 8200; RFC 4291; RFC 3849 (prefixo de documentação).",
          derivation: "Compressão passo a passo de 2001:0db8:0000:0000:0000:ff00:0042:8329:\n1) Escreva os oito grupos: 2001 | 0db8 | 0000 | 0000 | 0000 | ff00 | 0042 | 8329.\n2) Retire zeros à esquerda de cada grupo: 2001 | db8 | 0 | 0 | 0 | ff00 | 42 | 8329.\n3) Localize a maior sequência de grupos zero: os grupos 3, 4 e 5.\n4) Substitua essa sequência por :: uma única vez: 2001:db8::ff00:42:8329.\n5) Conferência: há 5 grupos explícitos mais 3 grupos representados por ::, totalizando 8 grupos, ou 128 bits.",
          workedExamples: ["2001:0db8:0000:0000:0000:0000:0000:0001 -> 2001:db8::1.", "::ffff:192.0.2.1 é um endereço IPv4-mapeado em IPv6, usado em pilhas duplas."],
          recallQuestions: ["Quantos bits tem um hextet?", "Por que :: só pode aparecer uma vez no endereço?", "O que significa o prefixo 2001:db8::/32?"],
          masteryCriteria: ["Comprime e expande endereços sem perder grupos.", "Justifica a contagem de 8 grupos após a compressão.", "Reconhece o prefixo de documentação."],
          tags: ["IPv6", "endereçamento", "hexadecimal"],
          estimatedEffort: 25
        }),

      L("Escopos IPv6: unicast, multicast e link-local",
        "Classificar endereços IPv6 por escopo e explicar por que não há broadcast.",
        "Representação hexadecimal e noção de prefixo.",
        "O escopo indica onde o endereço é válido: no enlace, em uma rede local ou na Internet.",
        "O IPv6 define unicast global (2000::/3), equivalente ao IPv4 público, e unique local (fc00::/7), usado em redes privadas e não roteável na Internet pública. O endereço link-local começa por fe80::/10 e só é válido naquele enlace; como a mesma prefixo pode existir em várias interfaces, o Linux exige um índice de interface, escrito fe80::1%eth0, para desambiguar. O loopback é ::1 e o endereço :: é o não especificado.\n\nO multicast ocupa ff00::/8 e substitui o broadcast. Endereços como ff02::1 (todos os nós do enlace) e ff02::2 (todos os roteadores) alcançam grupos; ff02::1:ffXX:XXXX é o multicast de nó solicitado usado na descoberta de vizinhos. O anycast é um endereço unicast atribuído a várias interfaces: o roteamento entrega ao nó mais próximo, muito usado em servidores DNS raiz.\n\nNão existe broadcast em IPv6. O que antes exigia ff:ff:ff:ff:ff:ff passa a usar multicast, o que reduz o impacto nas interfaces que não participam do grupo. O cabeçalho de um pacote com destino multicast traz o grupo como destino e a interface de saída é escolhida pela tabela de rotas e pelo escopo.",
        [
          ["unicast global", "Endereço roteável na Internet, pertencente ao bloco 2000::/3."],
          ["link-local IPv6", "Endereço fe80::/10 válido somente no enlace, acompanhado do índice da interface."],
          ["multicast IPv6", "Endereço ff00::/8 que entrega dados a um grupo de interfaces."],
          ["anycast", "Endereço unicast compartilhado por vários nós, entregue ao mais próximo pela métrica de roteamento."],
          ["solicited-node", "Grupo multicast ff02::1:ffXX:XXXX usado para resolver vizinhos em IPv6."]
        ],
        {
          ex: [["Escolha o escopo", "fe80::1%eth0 identifica o roteador no enlace eth0; 2001:db8::1 é global dentro do bloco de documentação; ff02::1 fala com todos os nós locais."], ["Sem broadcast", "Para anunciar um prefixo à rede local, o roteador envia Router Advertisement ao multicast ff02::1, não a um broadcast."]],
          er: ["Tentar rotear um endereço fe80:: entre enlaces sem especificar a interface.", "Procurar um endereço de broadcast IPv6.", "Confundir multicast com anycast: o primeiro entrega a um grupo, o segundo ao membro mais próximo."],
          lab: "Simulação: classifique ::1, fe80::1%wlan0, 2001:db8::1, ff02::2 e fc00::1 em loopback, link-local, global, multicast ou unique local.",
          ref: "RFC 4291; RFC 4007 (escopos); RFC 3849.",
          workedExamples: ["ff02::1:ff0a:1234 é o grupo solicited-node derivado dos últimos 24 bits de um endereço de interface.", "Um serviço anycast pode usar o mesmo IP em vários datacenters e o BGP escolhe o caminho mais curto."],
          recallQuestions: ["Qual prefixo identifica link-local?", "Por que fe80::1 precisa de %eth0?", "Qual endereço multicast alcança todos os roteadores do enlace?"],
          masteryCriteria: ["Diferencia unicast, anycast e multicast.", "Identifica o escopo pelo prefixo.", "Explica a ausência de broadcast."],
          tags: ["IPv6", "escopo", "multicast"],
          estimatedEffort: 25
        }),

      L("SLAAC, Neighbor Discovery e DHCPv6",
        "Explicar como um host IPv6 configura endereço e descobre vizinhos e roteadores.",
        "Escopos IPv6, conceito de prefixo e ARP em IPv4.",
        "No IPv6 o roteador anuncia a rede e o host monta seu próprio endereço; o NDP substitui o ARP.",
        "O SLAAC (Stateless Address Autoconfiguration, RFC 4862) começa com o host enviando Router Solicitation ao grupo ff02::2. O roteador responde com Router Advertisement a ff02::1, informando o prefixo /64, o gateway e flags como M (use DHCPv6 stateful) e O (obtenha outros parâmetros via DHCPv6). O host combina o prefixo recebido com um identificador de interface de 64 bits, gerado historicamente por EUI-64 a partir do MAC, ou, mais comum hoje, por endereços temporários aleatórios de privacidade (RFC 4941).\n\nAntes de usar o endereço, o host executa Duplicate Address Detection: envia Neighbor Solicitation para o endereço candidato e só o adota se ninguém responder com Neighbor Advertisement. O Neighbor Discovery Protocol (NDP, RFC 4861) também substitui o ARP: NS pergunta quem tem determinado IPv6 e NA responde com o MAC. Há ainda Redirect, para informar um melhor next-hop, e detecção de vizinho inalcançável.\n\nO DHCPv6 não é obrigatório para atribuir o endereço no SLAAC; ele é usado quando a rede quer distribuir DNS, domínio de busca, opções de boot ou controle centralizado de endereços. Mensagens NDP exigem hop limit 255, o que impede que um anúncio atravesse roteadores. Ataques como RA spoofing mostram por que a autenticidade dessas mensagens importa em redes não confiáveis.",
        [
          ["SLAAC", "Autoconfiguração sem estado em que o host deriva seu endereço a partir do prefixo anunciado pelo roteador."],
          ["Router Advertisement", "Mensagem ICMPv6 do roteador que anuncia prefixo, gateway e flags para a rede local."],
          ["EUI-64", "Método que deriva um identificador de interface de 64 bits a partir do endereço MAC."],
          ["Duplicate Address Detection", "Procedimento que verifica se um endereço candidato já está em uso antes de adotá-lo."],
          ["NDP", "Conjunto de mensagens ICMPv6 para descobrir vizinhos, roteadores e redirecionamentos."]
        ],
        {
          ex: [["Host chega à rede", "Recebe RA com 2001:db8:1:1::/64, gera o IID, testa duplicidade com NS/NA e passa a usar 2001:db8:1:1:<iid>."], ["NDP no lugar do ARP", "Para encapsular um pacote para o gateway, o host envia Neighbor Solicitation ao nó solicitado e recebe Neighbor Advertisement com o MAC do roteador."]],
          er: ["Achar que SLAAC precisa obrigatoriamente de DHCPv6.", "Usar um endereço link-local sem índice de interface.", "Tratar Router Advertisement como mensagem autenticada por padrão."],
          lab: "Simulação: desenhe a sequência RS -> RA -> DAD -> comunicação e indique quais mensagens usam multicast.",
          ref: "RFC 4861; RFC 4862; RFC 4941; man7.org: ip-neighbor(8).",
          workedExamples: ["Flag M=1 indica DHCPv6 stateful; M=0 com O=1 indica SLAAC mais DHCPv6 somente para outras opções.", "Endereços temporários de privacidade mudam com o tempo e dificultam rastreamento por IID derivado do MAC."],
          recallQuestions: ["O que o Router Advertisement informa?", "Como o DAD evita endereços duplicados?", "Qual protocolo IPv6 substitui o ARP?"],
          masteryCriteria: ["Sequencia corretamente RS, RA e DAD.", "Distingue SLAAC de DHCPv6.", "Explica o papel do NDP."],
          tags: ["IPv6", "SLAAC", "NDP"],
          estimatedEffort: 30
        }),

      L("Cabeçalho IPv6 e cabeçalhos de extensão",
        "Interpretar os campos do cabeçalho IPv6 e entender fragmentação e opções.",
        "Representação hexadecimal e noção de cabeçalho IPv4.",
        "O cabeçalho IPv6 é fixo e curto; opções ficam em blocos encadeados pelo campo Next Header.",
        "O cabeçalho básico do IPv6 tem $40$ bytes. Campos: Version (6), Traffic Class (DSCP/ECN), Flow Label (rotula fluxos para tratamento diferenciado), Payload Length (tamanho da carga, sem contar os 40 bytes), Next Header (protocolo ou cabeçalho de extensão seguinte), Hop Limit (equivalente ao TTL), Source Address e Destination Address, cada um com 128 bits.\n\nDiferente do IPv4, não há checksum no cabeçalho: a integridade é verificada por protocolos superiores, com pseudo-cabeçalho que inclui os endereços IP. Também não há campo de fragmentação no cabeçalho básico; roteadores nunca fragmentam IPv6. Se o pacote excede o MTU do enlace, o roteador descarta e envia ICMPv6 Packet Too Big à origem, que recalcula o tamanho e reenvia: é a Path MTU Discovery (PMTUD).\n\nQuando necessárias, opções são transportadas em cabeçalhos de extensão ligados por Next Header: Hop-by-Hop, Routing, Destination Options, Fragment, Authentication Header (AH) e Encapsulating Security Payload (ESP). A cadeia é percorrida pelo receptor até chegar ao protocolo de transporte, por exemplo TCP (Next Header 6) ou UDP (17). Cabeçalhos de extensão aumentam o processamento e podem ser filtrados por segurança, então o uso comum é mínimo.",
        [
          ["Next Header", "Campo de 8 bits que indica o protocolo ou o próximo cabeçalho de extensão."],
          ["Hop Limit", "Contador de saltos do IPv6, decrementado por cada roteador."],
          ["Flow Label", "Campo de 20 bits para marcar pacotes de um mesmo fluxo."],
          ["Packet Too Big", "Mensagem ICMPv6 que informa à origem o MTU do enlace que causou o descarte."],
          ["cabeçalho de extensão", "Bloco opcional entre o cabeçalho IPv6 e o transporte, ligado por Next Header."]
        ],
        {
          ex: [["Leia um cabeçalho", "Version=6, Payload Length=1180, Next Header=6, Hop Limit=64: há 1180 bytes após os 40 do cabeçalho e o carga é um segmento TCP."], ["PMTUD", "Um pacote de 1500 bytes encontra um túnel com MTU 1400; o roteador devolve Packet Too Big com 1400 e a origem reenvia em pedaços menores."]],
          er: ["Esperar que um roteador fragmente IPv6 como faz em IPv4.", "Contar os 40 bytes do cabeçalho dentro do Payload Length.", "Confundir Hop Limit com o campo TTL do IPv4 em todos os aspectos, inclusive tamanho."],
          lab: "Simulação: desenhe o cabeçalho de 40 bytes rotulando cada campo e acrescente uma cadeia Next Header = 6 -> TCP.",
          ref: "RFC 8200; RFC 4443 (ICMPv6); man7.org: ipv6(7).",
          derivation: "Payload total de um pacote = 40 bytes do cabeçalho básico + Payload Length + eventuais opções já contadas nesse payload. Se o MTU do caminho é 1280 bytes, o maior payload IPv6 possível é 1280 - 40 = 1240 bytes antes de considerar o cabeçalho de transporte; para TCP sem opções, restam 1240 - 20 = 1220 bytes de dados.",
          workedExamples: ["Next Header=17 indica UDP; Next Header=58 indica ICMPv6; Next Header=44 indica o cabeçalho de fragmentação criado pela origem.", "Hop Limit=1 permite responder a uma consulta somente na rede local."],
          recallQuestions: ["Qual é o tamanho fixo do cabeçalho IPv6?", "Quem fragmenta pacotes IPv6?", "Para que serve o Flow Label?"],
          masteryCriteria: ["Nomeia os oito campos do cabeçalho básico.", "Explica PMTUD sem roteadores fragmentando.", "Descreve a cadeia de cabeçalhos de extensão."],
          tags: ["IPv6", "cabeçalho", "PMTUD"],
          estimatedEffort: 30
        }),

      L("Transição e coexistência IPv4/IPv6",
        "Comparar estratégias para executar IPv4 e IPv6 durante a migração.",
        "IPv4, CIDR, NAT e fundamentos de IPv6.",
        "A transição não é um interruptor: as duas pilhas coexistem e cada técnica resolve um tipo de limite.",
        "Dual-stack é a estratégia mais direta: hosts e redes executam IPv4 e IPv6 ao mesmo tempo e escolhem o protocolo conforme o destino. O resolvedor devolve registros A e AAAA; algoritmos como Happy Eyeballs tentam as duas famílias e ficam com a que responde primeiro, evitando que um AAAA quebrado trave a aplicação.\n\nQuando só há IPv4 no caminho, usa-se túnel: o pacote IPv6 é encapsulado dentro de IPv4 (6in4, GRE) e desencapsulado no outro extremo. Técnicas antigas como 6to4 e Teredo existiram para atravessar NAT, mas têm uso limitado e não devem ser consideradas solução universal.\n\nQuando só há IPv6 no caminho, NAT64 traduz endereços IPv6 para IPv4 e DNS64 sintetiza registros AAAA a partir de registros A. A combinação 464XLAT amplia a compatibilidade com aplicações que só entendem IPv4 literal. O NAT-PT foi obsoletado (RFC 4966). Endereços IPv4-mapeados, como ::ffff:192.0.2.1, aparecem em pilhas duplas e não devem ser confundidos com endereços globais IPv6.",
        [
          ["dual-stack", "Configuração na qual hosts e roteadores executam IPv4 e IPv6 simultaneamente."],
          ["túnel 6in4", "Encapsulamento de um pacote IPv6 dentro de um pacote IPv4 para atravessar rede IPv4."],
          ["NAT64", "Tradução entre IPv6 e IPv4 que permite hosts IPv6 alcançarem servidores IPv4."],
          ["DNS64", "Síntese de registros AAAA a partir de registros A para uso com NAT64."],
          ["Happy Eyeballs", "Algoritmo que tenta IPv6 e IPv4 em paralelo ou em sequência curta para escolher o caminho que funciona."]
        ],
        {
          ex: [["Dual-stack", "O navegador consulta A e AAAA de example.com, tenta IPv6 e, se não responde rápido, tenta IPv4 sem esperar vários minutos."], ["NAT64/DNS64", "O cliente IPv6 pede AAAA; o DNS64 devolve um endereço sintético que o NAT64 converte em IPv4 no limite da rede."]],
          er: ["Achar que ativar IPv6 desliga automaticamente o IPv4.", "Considerar que todo AAAA publicado é alcançável na prática.", "Tratar túneis como substituto permanente de conectividade nativa sem medir MTU e latência."],
          lab: "Simulação: desenhe três cenários — dual-stack, túnel sobre IPv4 e NAT64/DNS64 — e indique em qual deles o cliente precisa de AAAA sintético.",
          ref: "RFC 4213 (transição); RFC 6146 (NAT64); RFC 6147 (DNS64); RFC 4966 (obsolescência do NAT-PT).",
          workedExamples: ["Em 464XLAT, o host usa CLAT local para converter IPv4 em IPv6 e o PLAT da operadora converte de volta para IPv4.", "Um túnel reduz o MTU efetivo; PMTUD é necessário para evitar pacotes descartados."],
          recallQuestions: ["O que faz o DNS64?", "Por que o NAT-PT foi abandonado?", "O que é Happy Eyeballs?"],
          masteryCriteria: ["Distingue dual-stack, túnel e tradução.", "Explica a parceria NAT64/DNS64.", "Reconhece limites de MTU em túneis."],
          tags: ["IPv6", "migração", "NAT64"],
          estimatedEffort: 30
        })
    ]
  },
  {
    name: "R5 — Roteamento",
    lessons: [
      L("Tabela de rotas e gateway padrão",
        "Ler uma tabela de rotas e explicar o papel do próximo salto e da rota padrão.",
        "IPv4, máscaras, encapsulamento e noção de camada 3.",
        "A tabela de rotas é um mapa: para cada destino ela diz por qual saída o pacote deve começar a viagem.",
        "Uma entrada de rota traz prefixo de destino e máscara, gateway ou next-hop, interface de saída (dev), endereço de origem preferido, métrica, protocolo que instalou a rota, escopo e tabela de roteamento. No Linux, ip route mostra essas colunas. Rotas connected surgem de interfaces ativas; estáticas são configuradas pelo administrador; dinâmicas são aprendidas por OSPF, BGP, RIP ou IS-IS.\n\nPara um destino na mesma rede, o next-hop é o próprio destino e o host resolve seu MAC com ARP (IPv4) ou NDP (IPv6). Para fora da rede, o next-hop é o gateway padrão: 0.0.0.0/0 em IPv4 ou ::/0 em IPv6. Se nenhuma rota casa e não existe padrão, o pacote é descartado e o host pode gerar ICMP Destination Unreachable.\n\nAntes de encaminhar, o roteador diminui TTL ou Hop Limit, recalcula o checksum do cabeçalho IPv4 e constrói um novo frame de enlace com o MAC do próximo salto. O endereço IP de origem e destino permanece o mesmo de ponta a ponta, salvo NAT; o MAC muda em cada enlace. Linux também suporta policy routing com ip rule e tabelas adicionais, permitindo decisões por origem, porta ou marca de firewall.",
        [
          ["tabela de rotas", "Conjunto de entradas com destino, next-hop, interface e métrica usado para encaminhar pacotes."],
          ["next-hop", "Roteador seguinte no caminho até a rede de destino."],
          ["rota padrão", "Entrada 0.0.0.0/0 ou ::/0 usada quando nenhuma rota mais específica corresponde."],
          ["rota conectada", "Rota instalada automaticamente para a rede diretamente ligada a uma interface."],
          ["policy routing", "Mecanismo que escolhe a tabela de rotas por critérios como endereço de origem."]
        ],
        {
          ex: [["Leia ip route", "default via 192.168.1.1 dev eth0 proto dhcp metric 100; 192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.20. O padrão sai pelo gateway; a rede local não precisa de gateway."], ["Duas saídas", "Com duas operadoras, duas rotas padrão podem coexistir com métricas diferentes; a menor métrica vence quando os demais critérios empatam."]],
          er: ["Escolher a rota pela menor métrica antes de aplicar o prefixo mais longo.", "Fazer ARP do destino final quando ele está fora da rede local.", "Achar que rota padrão é sinônimo de gateway configured, ignorando a máscara /0."],
          lab: "Simulação: monte uma tabela com rota conectada, estática e padrão e indique a saída para três destinos.",
          ref: "man7.org: ip-route(8), ip-rule(8); Kurose & Ross, cap. 4; RFC 791.",
          workedExamples: ["Rota 10.0.0.0/8 via 172.16.0.1 e rota 10.1.0.0/16 via 172.16.0.2: o /16 vence para 10.1.5.7.", "Uma rota com dev, mas sem gateway, é usada quando o destino está diretamente conectado."],
          recallQuestions: ["O que dev significa em uma rota?", "Quando a rota padrão é usada?", "O que muda no frame ao passar por um roteador?"],
          masteryCriteria: ["Lê os campos principais de ip route.", "Explica a resolução do next-hop.", "Distingue rota conectada, estática e dinâmica."],
          tags: ["roteamento", "tabela de rotas", "gateway"],
          estimatedEffort: 25
        }),

      L("Longest-prefix match: cada passo em binário",
        "Aplicar a regra do prefixo mais longo com cálculo binário explícito, inclusive em IPv6.",
        "Máscara CIDR, conversão decimal-binária e tabela de rotas.",
        "Entre várias rotas que casam, vence a mais específica; a calculadora da Forge deve mostrar cada bit do AND, não só o resultado.",
        "O encaminhamento IP compara o destino com cada prefixo da tabela usando AND bit a bit entre o endereço e a máscara. Se o resultado equivale ao prefixo da rota, ela casa. Quando várias casam, o roteador escolhe o maior número de bits de rede, isto é, o prefixo mais longo; só depois considera distância administrativa e métrica para desempatar rotas de mesmo comprimento.\n\nEm /n há n bits de rede e 32-n bits de host em IPv4. A máscara de /26 é 11111111.11111111.11111111.11000000, ou 255.255.255.192; o incremento entre blocos é $2^{32-26}=64$. Em IPv6 o raciocínio é idêntico, mas a máscara /64 é ffff:ffff:ffff:ffff:: e a comparação é feita em hexadecimal.\n\nA calculadora CIDR da Forge precisa exibir o endereço em binário, a máscara em binário, o resultado do AND e a faixa de hosts em cada etapa. Mostrar apenas 'rede 192.168.20.64/26' esconde justamente o raciocínio que o aluno precisa transferir para outros prefixos.",
        [
          ["longest prefix match", "Critério que escolhe, entre as rotas que casam com o destino, a de maior número de bits no prefixo."],
          ["AND bit a bit", "Operação que compara cada bit do endereço com o da máscara; só resulta em 1 quando ambos são 1."],
          ["máscara /26", "Máscara 255.255.255.192, com 26 bits de rede e blocos de 64 endereços."],
          ["incremento de bloco", "Passo entre redes consecutivas, igual a $2^h$, em que h é o número de bits de host."],
          ["ordem de decisão", "Sequência prefixo mais longo, distância administrativa e depois métrica."]
        ],
        {
          ex: [["Três rotas possíveis", "Para 192.168.20.70, a tabela tem 0.0.0.0/0 via .1, 192.168.20.0/24 via .2 e 192.168.20.64/26 via .3. As três casam; /26 vence e o pacote sai via .3."], ["Em IPv6", "O destino 2001:db8:1:2::45 casa com ::/0, 2001:db8::/32 e 2001:db8:1:2::/64; o /64 é o mais específico."]],
          er: ["Comparar máscaras como decimais comuns e achar que 255.255.255.192 é maior que /24 por ter valor decimal maior.", "Escolher a métrica antes do comprimento do prefixo.", "Esquecer de converter o octeto que cruza a fronteira do prefixo."],
          lab: "Simulação: usando a calculadora em modo passo a passo, determine a rota escolhida para 192.168.20.70 e anote cada linha do AND binário.",
          ref: "RFC 791; RFC 4632; Cisco, documentação de longest prefix match (docs.cisco.com).",
          derivation: "Destino 192.168.20.70; tabela: 0.0.0.0/0 via .1, 192.168.20.0/24 via .2, 192.168.20.64/26 via .3.\nPasso 1 — converta o último octeto do destino: 70 = 64 + 4 + 2, logo 70 em binário é 01000110.\nPasso 2 — escreva a máscara /26: 26 = 24 + 2 bits de rede; o quarto octeto da máscara é 11000000 (255.255.255.192).\nPasso 3 — faça o AND no quarto octeto: 01000110 AND 11000000 = 01000000, que em decimal é 64. A rede é 192.168.20.64/26.\nPasso 4 — para /24, a máscara é 255.255.255.0: 01000110 AND 00000000 = 00000000, rede 192.168.20.0/24. Para /0, todo bit é máscara zero e a rede é 0.0.0.0/0.\nPasso 5 — compare os comprimentos: 26 > 24 > 0. Escolha a rota /26 via 192.168.20.3. Faixa do bloco: rede .64, primeiro host .65, último host .126, broadcast .127.\nPasso 6 — em IPv6, repita com 2001:db8:1:2::45 e máscara ffff:ffff:ffff:ffff::; o AND preserva os quatro primeiros grupos e zera os demais, identificando /64.",
          workedExamples: ["192.168.20.127 também casa com /26, mas é o broadcast desse bloco e não deve ser atribuído a host.", "192.168.21.1 não casa com /24 nem com /26: cai na rota padrão."],
          recallQuestions: ["Quantos bits de host restam em /26?", "Qual é o resultado de 01000110 AND 11000000?", "O que acontece se duas rotas de mesmo prefixo casam?"],
          masteryCriteria: ["Mostra a máscara em binário antes do AND.", "Conta os bits para justificar o vencedor.", "Aplica o mesmo critério a IPv6."],
          tags: ["CIDR", "longest prefix", "binário"],
          estimatedEffort: 40
        }),

      L("Roteamento estático, OSPF e BGP",
        "Diferenciar rotas configuradas de rotas aprendidas e descrever OSPF e BGP em nível introdutório.",
        "Tabela de rotas e longest-prefix match.",
        "Estático é escrito à mão; dinâmico é negociado: OSPF decide dentro da organização, BGP entre organizações.",
        "Rotas estáticas são explícitas e previsíveis, úteis em topologias pequenas ou como fallback. Rotas dinâmicas são anunciadas por protocolos que recalculam o caminho quando a topologia muda. Quando dois protocolos anunciam o mesmo prefixo, a distância administrativa decide a confiança: valores típicos em Cisco são connected 0, static 1, eBGP 20, OSPF 110, RIP 120 e iBGP 200; a métrica só entra quando a distância empata.\n\nOSPF (RFC 2328) é link-state e funciona dentro de um sistema autônomo. Vizinhos formam adjacência com Hello, elegem DR e BDR em redes multiacesso, inundam LSAs e constroem a mesma LSDB. Cada roteador executa Dijkstra para calcular o caminho mais curto até as redes, usando custo baseado em largura de banda. Áreas reduzem o tamanho da base e melhoram a convergência.\n\nBGP (RFC 4271) é path-vector e conecta sistemas autônomos. Cada anúncio carrega AS_PATH, NEXT_HOP e atributos como LOCAL_PREF e MED; a decisão é fortemente policy-based, não apenas 'menor custo'. eBGP roda entre AS diferentes; iBGP distribui a informação dentro do mesmo AS e exige malha completa ou route reflectors. A convergência do BGP pode ser mais lenta que a do OSPF, e filtros de prefixo protegem contra anúncios indevidos.",
        [
          ["rota estática", "Rota configurada explicitamente, sem negociação com outros roteadores."],
          ["distância administrativa", "Medida de confiança de uma fonte de rota, usada quando prefixos de mesmo tamanho competem."],
          ["OSPF", "Protocolo link-state intra-domínio que usa LSDB e algoritmo de Dijkstra."],
          ["LSDB", "Banco de dados de estados de enlace sincronizado entre roteadores da mesma área."],
          ["BGP", "Protocolo path-vector entre sistemas autônomos, com decisões baseadas em atributos e política."]
        ],
        {
          ex: [["OSPF convergindo", "Um enlace cai; os roteadores da área inundam novo LSA, recalculam a árvore de menor caminho e instalam a nova rota no lugar da antiga."], ["BGP com dois provedores", "O mesmo prefixo chega por dois AS; LOCAL_PREF define a saída preferida e AS_PATH ajuda a evitar loops."]],
          er: ["Escolher rotas apenas pelo valor de métrica, ignorando o comprimento do prefixo e a distância administrativa.", "Achar que OSPF e BGP fazem o mesmo trabalho.", "Anunciar prefixos sem filtros e aceitar rotas de origem desconhecida."],
          lab: "Simulação: monte três roteadores em papel, escreva as LSAs e indique por que a área reduz o tamanho da LSDB.",
          ref: "RFC 2328; RFC 4271; man7.org: ip-route(8); Cisco, documentação de OSPF e BGP (docs.cisco.com).",
          workedExamples: ["Com connected 0 e static 1 para o mesmo /24, a rota conectada vence pela menor distância administrativa.", "Um anúncio BGP com AS_PATH contendo o próprio AS é descartado para evitar loop."],
          recallQuestions: ["O que é LSDB?", "Qual protocolo atua entre sistemas autônomos?", "Quando a métrica é considerada?"],
          masteryCriteria: ["Distingue estático de dinâmico.", "Descreve Hello, LSA e Dijkstra no OSPF.", "Explica AS_PATH e política no BGP."],
          tags: ["OSPF", "BGP", "roteamento dinâmico"],
          estimatedEffort: 35
        }),

      L("ICMP e traceroute",
        "Usar mensagens ICMP para explicar ping, traceroute e falhas de encaminhamento.",
        "Cabeçalho IP, TTL e tabela de rotas.",
        "O IP não avisa falhas sozinho: o ICMP é o mensageiro que devolve a notícia ao remetente.",
        "O ICMP (RFC 792 para IPv4; RFC 4443 para ICMPv6) carrega Type, Code e Checksum. No IPv4, Echo Request é type 8 e Echo Reply é type 0; Time Exceeded é type 11, code 0 quando o TTL expira; Destination Unreachable é type 3, com códigos como 3 para porta inalcançável e 4 para fragmentação necessária com DF ligado. No IPv6, Echo Request/Reply são types 128/129 e Packet Too Big é type 2.\n\nO ping envia Echo Request e mede o intervalo até o Echo Reply, informando sequência, TTL recebido e tempo de ida e volta. Ele testa alcance ICMP, não porta TCP: um servidor com a porta 443 fechada pode responder ping normalmente, e um servidor com ping bloqueado pode aceitar TCP na porta 443. Para testar porta, use uma ferramenta TCP como nc -vz ou curl -v.\n\nO traceroute envia pacotes com TTL 1, 2, 3 e assim por diante. O primeiro roteador decrementa para 0, descarta e devolve Time Exceeded, revelando seu endereço; o processo se repete até o destino responder. A variante UDP costuma usar portas altas e o host final responde ICMP port unreachable; a variante ICMP espera Echo Reply. Asteriscos indicam silêncio ou filtragem de ICMP, não necessariamente ausência de caminho.",
        [
          ["ICMP", "Protocolo de diagnóstico e sinalização que acompanha o IP."],
          ["Echo Request/Reply", "Par de mensagens ICMP usado pelo ping para medir alcance e latência."],
          ["Time Exceeded", "Mensagem enviada quando TTL ou Hop Limit chega a zero."],
          ["Destination Unreachable", "Família de mensagens que indica rede, host, protocolo ou porta inalcançável."],
          ["traceroute", "Ferramenta que incremental o TTL para listar os roteadores do caminho."]
        ],
        {
          ex: [["Leia ping -c 4", "64 bytes from 1.1.1.1: icmp_seq=1 ttl=57 time=18.4 ms mostra que o reply chegou, com TTL restante 57 e RTT de 18,4 ms; ao final, 4 packets transmitted, 4 received, 0% packet loss."], ["Interprete asteriscos", "Linhas com * * * no traceroute podem significar roteador que não responde ICMP por política; as linhas seguintes ainda podem mostrar o caminho."]],
          er: ["Afirmar que ping testa uma porta TCP.", "Concluir que um host está desligado só porque ping é bloqueado.", "Achar que traceroute mostra todos os roteadores mesmo quando ICMP é filtrado."],
          lab: "Simulação: escreva a sequência de TTL 1, 2 e 3 e as mensagens ICMP correspondentes, indicando o que o host final responde na variante UDP.",
          ref: "RFC 792; RFC 4443; man7.org: ping(8), traceroute(8); Stevens, TCP/IP Illustrated, cap. 7.",
          workedExamples: ["ping 127.0.0.1 testa a pilha local; ping ao gateway testa a rede local; ping a 1.1.1.1 testa rota padrão e operadora.", "ICMP Destination Unreachable code 3 surge quando um UDP chega a uma porta sem listener no destino."],
          recallQuestions: ["Qual type ICMP corresponde a Echo Reply em IPv4?", "Como o traceroute descobre cada salto?", "Por que ping não prova que a porta 443 está aberta?"],
          masteryCriteria: ["Diferencia Time Exceeded de Destination Unreachable.", "Explica o algoritmo de TTL crescente.", "Enuncia explicitamente a limitação do ping."],
          tags: ["ICMP", "ping", "traceroute"],
          estimatedEffort: 25
        }),

      L("Encapsulamento em movimento: dado, segmento, pacote, frame",
        "Acompanhar uma mensagem da aplicação até os sinais do enlace e de volta no receptor.",
        "Modelo TCP/IP, portas, IP, ARP e Ethernet.",
        "A cada camada a mensagem ganha um envelope novo; a animação da Forge deve mostrar essa sequência na ordem certa.",
        "A aplicação produz dados, por exemplo uma requisição HTTP. O transporte acrescenta um cabeçalho TCP com portas, sequência e ACK, formando um segmento; com UDP, o resultado é um datagrama UDP. A camada de rede acrescenta o cabeçalho IP com origem, destino, TTL e protocolo, formando o pacote ou datagrama IP. A camada de enlace acrescenta MAC de origem e destino, EtherType e FCS, formando o frame Ethernet, que a camada física converte em sinais.\n\nNo receptor, o caminho é invertido: o frame é validado pelo FCS, o cabeçalho de enlace é removido, o IP é entregue ao protocolo indicado e o segmento é entregue à porta da aplicação. Em cada roteador, o frame é desfeito até a camada 3, o TTL é decrementado e um novo frame é montado para o próximo enlace. O cabeçalho IP sobrevive; o cabeçalho Ethernet não.\n\nA animação da Forge deve percorrer exatamente dados de aplicação -> segmento -> pacote -> frame -> sinais, com os campos de cada etiqueta visíveis. Os quadros exibidos são ilustrações simuladas para ensino, não uma captura real de tráfego; para observar pacotes verdadeiros é preciso captura em interface própria ou autorizada.",
        [
          ["segmento", "Unidade da camada de transporte com cabeçalho TCP e dados da aplicação."],
          ["datagrama IP", "Unidade da camada de rede com cabeçalho IP e carga de transporte."],
          ["frame", "Unidade da camada de enlace com MACs, EtherType, carga e FCS."],
          ["EtherType", "Campo do frame que identifica o protocolo encapsulado, como 0x0800 para IPv4."],
          ["desencapsulamento", "Processo inverso ao encapsulamento, executado no receptor e parcialmente nos roteadores."]
        ],
        {
          ex: [["Uma requisição", "Dados HTTP viram segmento TCP com porta de origem 49152 e destino 80; o IP acrescenta 203.0.113.10 -> 198.51.100.7; a Ethernet acrescenta o MAC do gateway e FCS."], ["No roteador", "O frame de entrada é descartado, o TTL cai de 64 para 63 e um novo frame com o MAC do próximo salto é gerado para a saída."]],
          er: ["Achar que o MAC de destino permanece o mesmo de ponta a ponta.", "Supor que o roteador desencapsula até a aplicação para encaminhar.", "Tratar a animação da Forge como prova de uma captura real."],
          lab: "Simulação: na animação da Forge, pause em cada etapa e registre quais campos apareceram e quais foram descartados.",
          ref: "Kurose & Ross, cap. 4; RFC 791; RFC 793; IEEE 802.3; Wireshark, guia de encapsulamento (wireshark.org/docs).",
          workedExamples: ["Em IPv6, o EtherType do frame é 0x86DD e o Next Header do IP indica TCP ou UDP.", "Quando há NAT, o endereço IP de origem também muda no limite da rede, além do MAC."],
          recallQuestions: ["Qual unidade corresponde à camada de transporte?", "O que muda no roteador: MAC ou IP?", "A animação da Forge é captura real?"],
          masteryCriteria: ["Ordena corretamente as quatro unidades.", "Explica o que cada cabeçalho acrescenta.", "Distingue simulado de capturado."],
          tags: ["encapsulamento", "camadas", "animação"],
          estimatedEffort: 25
        })
    ]
  },
  {
    name: "R6 — UDP e TCP",
    lessons: [
      L("UDP: datagramas, portas e cabeçalho de 8 bytes",
        "Explicar o serviço UDP, seus campos e onde ele é usado.",
        "Modelo TCP/IP, portas e encapsulamento.",
        "UDP é um envelope simples: entrega a mensagem se der, sem prometer ordem, entrega ou repetição.",
        "O UDP (RFC 768) tem cabeçalho fixo de $8$ bytes com quatro campos de $16$ bits: portas de origem e destino, Length (cabeçalho mais dados) e Checksum. O checksum é opcional em IPv4 e obrigatório em IPv6 e calcula também um pseudo-cabeçalho com endereços IP, protocolo e comprimento, detectando erros e entrega ao destino errado.\n\nCada mensagem de aplicação vira um datagrama independente. Não há handshake, número de sequência, confirmação, retransmissão, controle de fluxo nem de congestionamento. O receptor pode receber duplicatas, perdas e mensagens fora de ordem; a ordenação, quando necessária, precisa ser implementada pela aplicação. Portas continuam identificando processos: UDP/53 para DNS na maioria das consultas, UDP/67 e 68 para DHCP, UDP/123 para NTP, e QUIC também é transportado sobre UDP.\n\nEssa simplicidade tem vantagens: baixa latência, sem espera de conexão e suporte natural a multicast e broadcast. Por isso é escolhido quando a aplicação prefere dados recentes a dados perfeitos, como voz, vídeo em tempo real e descoberta de serviços. Quando a confiabilidade importa, implementá-la sobre UDP é trabalho considerável e normalmente deve-se usar TCP ou QUIC.",
        [
          ["datagrama UDP", "Mensagem independente com cabeçalho de 8 bytes, sem estado de conexão."],
          ["Length", "Campo UDP que informa o tamanho total do datagrama, incluindo cabeçalho e dados."],
          ["pseudo-cabeçalho", "Bloco usado no cálculo do checksum que inclui endereços IP e protocolo."],
          ["entrega best-effort", "Serviço que tenta entregar, mas não garante chegada, ordem nem unicidade."],
          ["QUIC", "Protocolo de transporte moderno construído sobre UDP, com TLS integrado e recuperação de perdas própria."]
        ],
        {
          ex: [["Consulta DNS", "O cliente envia um datagrama UDP/53 com a pergunta; o servidor responde em outro datagrama. Se a resposta for pequena, não há handshake de transporte."], ["Voz em tempo real", "Um pacote de áudio perdido é descartado: retransmiti-lo depois do prazo não ajudaria a conversa e atrasaria os seguintes."]],
          er: ["Achar que UDP corrompe dados silenciosamente: o checksum detecta erros, mas não retransmite.", "Supor que UDP garante ordem porque a rede é confiável.", "Usar UDP 'porque é mais rápido' sem tratar perdas na aplicação."],
          lab: "Simulação: desenhe o cabeçalho UDP com seus quatro campos e explique por que não há campo de sequência.",
          ref: "RFC 768; RFC 8200 (checksum UDP em IPv6); Kurose & Ross, cap. 3.",
          workedExamples: ["Um datagrama com 512 bytes de dados tem Length = 8 + 512 = 520.", "Duas mensagens da mesma aplicação podem chegar na ordem inversa e o UDP não tem como corrigir isso."],
          recallQuestions: ["Quantos bytes tem o cabeçalho UDP?", "O que o pseudo-cabeçalho protege?", "Por que voz pode preferir UDP?"],
          masteryCriteria: ["Nomeia os quatro campos do cabeçalho.", "Lista o que UDP não garante.", "Cita aplicações típicas."],
          tags: ["UDP", "transporte", "portas"],
          estimatedEffort: 20
        }),

      L("TCP: campos do cabeçalho e números de sequência",
        "Interpretar campo por campo o cabeçalho TCP e contar sequência por byte, não por pacote.",
        "Encapsulamento, portas e diferença entre TCP e UDP.",
        "O cabeçalho TCP carrega o estado da conversação: quem falou, até onde chegou e quanto o parceiro pode enviar.",
        "O segmento TCP começa com portas de origem e destino (16 bits cada), sequence number ($32$ bits) e acknowledgment number ($32$ bits). Data Offset indica o tamanho do cabeçalho em palavras de 32 bits; vem a área de flags (CWR, ECE, URG, ACK, PSH, RST, SYN, FIN), a janela de recepção (16 bits), checksum, urgent pointer e opções como MSS, Window Scale, SACK Permitted e timestamps. O cabeçalho mínimo tem $20$ bytes e pode crescer com opções.\n\nO número de sequência identifica o primeiro byte de dados daquele segmento, não o número do segmento. Se o cliente envia $1000$ bytes começando em seq=5001, o próximo dado começa em 6001; o ACK do servidor será 6001, confirmando todos os bytes até 6000. ACK é cumulativo: confirmar 6001 significa 'recebi tudo até 6000'.\n\nO MSS (Maximum Segment Size) anunciado no handshake é o maior bloco de dados TCP aceito, normalmente MTU menos cabeçalhos IP e TCP: 1460 bytes em IPv4 com MTU 1500 e sem opções, ou 1440 em IPv6. Window Scale permite janelas maiores que o campo de 16 bits original, necessárias em links de alta velocidade e latência. Timestamps ajudam a medir RTT e a evitar confusão com sequências antigas.",
        [
          ["sequence number", "Número do primeiro byte de dados do segmento, usado para ordenação e recuperação."],
          ["acknowledgment number", "Próximo byte esperado pelo receptor; confirma cumulativamente todos os anteriores."],
          ["Data Offset", "Campo que informa o tamanho do cabeçalho TCP em unidades de 32 bits."],
          ["MSS", "Maior quantidade de dados TCP que o peer aceita em um segmento, anunciada no handshake."],
          ["Window Scale", "Opção que multiplica a janela anunciada para permitir janelas maiores."]
        ],
        {
          ex: [["Sequência por byte", "Segmento com seq=1001 e 500 bytes de dados cobre os bytes 1001 a 1500; o ACK correspondente é 1501."], ["Leia as flags", "SYN=1 inicia a conexão; ACK=1 torna o campo de acknowledgment válido; FIN=1 pede encerramento; RST=1 aborta imediatamente."]],
          er: ["Contar sequência por segmento em vez de por byte.", "Achar que ACK=6001 confirma o byte 6001.", "Confundir janela TCP com MSS: uma limita dados em voo, a outra define tamanho máximo de segmento."],
          lab: "Simulação: preencha um cabeçalho TCP para seq=4001, 800 bytes de dados e ACK=9001, indicando quais flags estariam ligadas em um segmento de dados.",
          ref: "RFC 793; RFC 7323 (Window Scale e timestamps); RFC 9293 (TCP moderno); man7.org: tcp(7).",
          derivation: "Dados de 800 bytes começando em seq=4001 ocupam os bytes 4001 a 4800 (4001 + 800 - 1). O próximo byte esperado é 4001 + 800 = 4801, que é o valor do ACK do receptor. Se o MTU é 1500 e o cabeçalho IPv4 é 20 e o TCP sem opções é 20, o MSS é 1500 - 20 - 20 = 1460 bytes de dados por segmento.",
          workedExamples: ["Com Window Scale=4 e campo window=1000, a janela efetiva é 1000 x 2^4 = 16000 bytes.", "SYN consome um número de sequência: se ISN=x, o primeiro byte de dados do cliente começa em x+1."],
          recallQuestions: ["O que conta o sequence number?", "O que significa ACK=1501?", "Como o MSS é derivado do MTU?"],
          masteryCriteria: ["Calcula o próximo número de sequência.", "Interpreta as principais flags.", "Diferencia janela de MSS."],
          tags: ["TCP", "cabeçalho", "sequência"],
          estimatedEffort: 30
        }),

      L("Handshake, encerramento e TIME_WAIT",
        "Descrever abertura e fechamento de conexão TCP e justificar o estado TIME_WAIT.",
        "Campos do cabeçalho TCP e números de sequência.",
        "TCP começa com três mensagens e termina com quatro: a cortesia da confirmação evita ambiguidade.",
        "No three-way handshake, o cliente envia SYN com ISN aleatório e opções como MSS e Window Scale; o servidor responde SYN-ACK com seu próprio ISN e ACK=x+1; o cliente envia ACK=y+1. A conexão entra em ESTABLISHED. ISNs aleatórios evitam que segmentos de uma conexão antiga sejam confundidos com os de uma nova.\n\nO encerramento costuma usar quatro mensagens: o lado que fecha envia FIN, o outro confirma com ACK, envia seu próprio FIN e recebe o ACK final. shutdown(SHUT_WR) permite meio-fechamento: o lado ainda pode receber dados. Um RST aborta a conexão imediatamente, por exemplo quando chega dados a um socket já fechado.\n\nQuem envia o primeiro FIN entra em TIME_WAIT e permanece cerca de $2$ MSL (Maximum Segment Lifetime, tipicamente dezenas de segundos). Dois motivos justificam a espera: permitir que o ACK final perdido seja retransmitido e recebido, e garantir que segmentos velhos da conexão expirem antes que a mesma tupla de portas seja reutilizada. TIME_WAIT é estado normal, não vazamento; em servidores com muitas conexões curtas, portas efêmeras esgotadas e SO_REUSEADDR merecem atenção.",
        [
          ["three-way handshake", "Sequência SYN, SYN-ACK, ACK que estabelece uma conexão TCP."],
          ["ISN", "Initial Sequence Number, escolhido aleatoriamente no início de cada direção da conexão."],
          ["FIN", "Flag que solicita encerramento ordenado da transmissão de dados de um lado."],
          ["RST", "Flag que aborta a conexão imediatamente, sem encerramento gracioso."],
          ["TIME_WAIT", "Estado do lado que iniciou o fechamento, mantido cerca de 2 MSL."]
        ],
        {
          ex: [["Handshake em campos", "cliente: SYN seq=1000, MSS=1460; servidor: SYN seq=5000, ACK=1001, MSS=1460; cliente: ACK=5001. Depois disso, o primeiro dado do cliente começa em seq=1001."], ["Meio-fechamento", "Um cliente chama shutdown(SHUT_WR) após enviar o pedido: o servidor termina de responder e envia seu FIN quando pronto."]],
          er: ["Contar o handshake como quatro mensagens.", "Tratar TIME_WAIT como erro que precisa ser eliminado a qualquer custo.", "Achar que close() sempre espera o peer receber todos os dados."],
          lab: "Simulação: escreva as três mensagens do handshake com seq e ack, depois as quatro do fechamento e marque quem entra em TIME_WAIT.",
          ref: "RFC 793; RFC 9293; Stevens, TCP/IP Illustrated, cap. 18; man7.org: tcp(7).",
          workedExamples: ["Semana de conexões curtas para o mesmo destino pode acumular TIME_WAIT na máquina que fecha primeiro; usar SO_REUSEADDR ajuda no reinício do serviço.", "Se o ACK final se perde, o peer reenvia FIN e o lado em TIME_WAIT responde novamente com ACK."],
          recallQuestions: ["Quais são as três mensagens do handshake?", "O que o ACK do SYN confirma?", "Por que existe TIME_WAIT?"],
          masteryCriteria: ["Escreve seq e ack corretos no handshake.", "Distingue FIN, RST e shutdown.", "Justifica os dois motivos do TIME_WAIT."],
          tags: ["TCP", "handshake", "TIME_WAIT"],
          estimatedEffort: 30
        }),

      L("Retransmissão, ACK e controle de fluxo",
        "Explicar recuperação de perdas e como o receptor protege seu buffer.",
        "Sequência, ACK e janela do TCP.",
        "TCP retransmite o que não foi confirmado e limita o envio ao que o receptor consegue armazenar.",
        "O remetente mantém uma janela de dados não confirmados e calcula o RTO (Retransmission Timeout) a partir de estimativas do RTT. Se o ACK não chega antes do RTO, o segmento é reenviado; após novas falhas, o timeout costuma crescer exponencialmente. Três ACKs duplicados indicam provável perda de um segmento isolado e disparam fast retransmit, geralmente seguidos de fast recovery. SACK permite informar blocos recebidos fora de ordem e evita retransmitir o que já chegou.\n\nO ACK é cumulativo: confirmar 6001 cobre todos os bytes anteriores. O campo Window anuncia quantos bytes de dados o receptor aceita naquele momento; o remetente não deve ter mais que rwnd bytes em voo. Se o buffer do aplicativo enche, o receptor anuncia janela zero. Nesse caso o remetente envia janelas de sondagem para descobrir quando há espaço; um receptor ingênuo que anuncia janelas pequenas repetidamente provoca silly window syndrome.\n\nO controle de fluxo é diferente do controle de congestionamento: o primeiro protege o receptor; o segundo protege a rede. Em um link rápido para um receptor lento, a janela do receptor domina; em um caminho congestionado, a janela de congestionamento domina. A janela efetiva é o menor entre as duas.",
        [
          ["RTO", "Tempo de espera antes de retransmitir um segmento não confirmado, derivado do RTT."],
          ["ACK duplicado", "Confirmação repetida do mesmo próximo byte esperado, sinal de possível perda."],
          ["SACK", "Opção TCP que informa blocos específicos recebidos fora de ordem."],
          ["rwnd", "Janela anunciada pelo receptor, limitando os dados em voo."],
          ["silly window syndrome", "Padrão ineficiente de anúncios de janela muito pequenos."]
        ],
        {
          ex: [["Perda recuperada", "Segmentos 1001-2000, 2001-3000 e 3001-4000 são enviados; o segundo se perde. O receptor confirma 2001 três vezes; o remetente reenvia 2001-3000 sem esperar o RTO."], ["Janela zero", "O servidor está ocupado e anuncia window=0; o cliente para de enviar dados e envia sondas periódicas até receber window=4096."]],
          er: ["Achar que um ACK confirma apenas o último segmento recebido.", "Confundir controle de fluxo com controle de congestionamento.", "Ignorar ACKs duplicados e esperar sempre o RTO."],
          lab: "Simulação: num diagrama de sequência, mostre três ACKs duplicados e a retransmissão rápida do segmento perdido.",
          ref: "RFC 793; RFC 2018 (SACK); RFC 6298 (RTO); Kurose & Ross, cap. 3.",
          workedExamples: ["RTT de 40 ms com variação alta gera RTO maior que 40 ms; estimativas agressivas causam retransmissões desnecessárias.", "Com rwnd=8000 e cwnd=2000, o remetente pode ter no máximo 2000 bytes em voo."],
          recallQuestions: ["O que três ACKs duplicados sugerem?", "O que é rwnd?", "Qual a diferença entre fluxo e congestionamento?"],
          masteryCriteria: ["Explica ACK cumulativo.", "Distingue RTO de fast retransmit.", "Justifica a janela zero e as sondas."],
          tags: ["TCP", "retransmissão", "fluxo"],
          estimatedEffort: 35
        }),

      L("Controle de congestionamento",
        "Entender como o TCP ajusta a taxa de envio para não sobrecarregar a rede.",
        "Janela, retransmissão e RTT.",
        "O TCP sonda a rede com cuidado: aumenta a taxa quando há sucesso e recua quando há perda.",
        "A janela de congestionamento (cwnd) limita quantos bytes podem estar em voo além do limite do receptor. No slow start, cwnd começa pequena e dobra a cada RTT enquanto estiver abaixo de ssthresh: o crescimento é exponencial, apesar do nome. Ao atingir ssthresh, entra congestion avoidance, com crescimento aditivo, aproximadamente um MSS por RTT. A perda é interpretada como sinal de congestionamento em redes tradicionais.\n\nNa perda por três ACKs duplicados, TCP Reno reduz ssthresh, retransmite o segmento e entra em fast recovery, sem voltar ao início. Na expiração do RTO, a redução é mais drástica e o slow start recomeça. A combinação de crescimento aditivo e redução multiplicativa é chamada AIMD e favorece a convergência e a fairness entre fluxos. Variantes modernas como Cubic e BBR usam sinais diferentes; BBR estima largura de banda e atraso em vez de tratar toda perda como congestionamento.\n\nECN (Explicit Congestion Notification) permite que roteadores marquem pacotes com CE em vez de descartá-los; o receptor avisa o remetente via bits ECE no TCP e o remetente reduz a janela. A taxa real de envio depende de cwnd, rwnd, RTT e perdas: aumentar a banda do enlace não ajuda se a janela for pequena para o atraso do caminho.",
        [
          ["cwnd", "Janela de congestionamento que limita os dados não confirmados por estimativa da capacidade da rede."],
          ["slow start", "Fase inicial em que cwnd dobra a cada RTT até ssthresh."],
          ["congestion avoidance", "Fase de crescimento aditivo e cauteloso da janela."],
          ["fast recovery", "Mecanismo de recuperação após ACKs duplicados sem reiniciar do zero."],
          ["ECN", "Mecanismo que sinaliza congestionamento por marcação de pacotes em vez de descarte."]
        ],
        {
          ex: [["Evolução da janela", "Com cwnd inicial 2 MSS e ssthresh 16 MSS: 2, 4, 8, 16 MSS em RTTs sucessivos; depois cresce cerca de 1 MSS por RTT."], ["Perda", "Três ACKs duplicados com cwnd=16 reduzem ssthresh para 8 e ativam fast recovery; um RTO zerado reinicia com janela pequena."]],
          er: ["Achar que slow start é lento: ele cresce exponencialmente por RTT.", "Tratar toda perda como congestionamento sem considerar erros de enlace ou políticas modernas.", "Ignorar rwnd e supor que cwnd sozinha define a taxa."],
          lab: "Simulação: plote em papel a evolução de cwnd para 5 RTTs com ssthresh=8 MSS e marque o ponto de fast retransmit.",
          ref: "RFC 5681; RFC 3168 (ECN); RFC 8311; Kurose & Ross, cap. 3.",
          workedExamples: ["Em um caminho com RTT=100 ms e janela=6250 bytes, a vazão máxima aproximada é 6250 bytes / 0,1 s = 62500 bytes/s, ou 500 kbit/s.", "Com ECN ativo, um pacote marcado viaja até o destino e o campo ECE do TCP avisa o remetente sem perda de segmento."],
          recallQuestions: ["Como cwnd cresce no slow start?", "O que acontece após três ACKs duplicados?", "O que ECN evita?"],
          masteryCriteria: ["Distingue slow start de congestion avoidance.", "Explica AIMD.", "Relaciona janela, RTT e vazão."],
          tags: ["TCP", "congestionamento", "cwnd"],
          estimatedEffort: 35
        })
    ]
  },
  {
    name: "R7 — DNS",
    lessons: [
      L("Hierarquia DNS e resolução recursiva",
        "Percorrer a cadeia raiz, TLD e autoritativo e explicar quem faz cada pergunta.",
        "Modelo cliente-servidor, portas e noção de cache.",
        "Nenhum servidor sabe tudo: a resposta vem de uma cadeia de delegações, começando na raiz.",
        "O namespace DNS é uma árvore invertida. A raiz é representada por um ponto; abaixo dela ficam domínios de topo (TLDs) como .com, .br e .org, e abaixo destes os domínios autoritativos, como example.com. Cada zona é delegada a servidores NS; um servidor autoritativo responde pelo que está na sua zona, mas não conhece todas as zonas do mundo.\n\nO resolvedor stub do sistema operacional recebe a pergunta da aplicação e repassa a um resolvedor recursivo, normalmente do provedor, da rede local ou de um serviço público. O resolvedor recursivo faz a consulta iterativa: pergunta à raiz, recebe os NS do TLD, pergunta ao TLD, recebe os NS do domínio e finalmente obtém o registro no autoritativo. A recursão é o trabalho feito pelo resolvedor em nome do cliente; a iteração é o cliente (o resolvedor) recebendo referências e repetindo a consulta.\n\nO resolvedor guarda a resposta em cache pelo TTL informado e também guarda delegas. Por isso a maioria das consultas diárias para em poucos passos. Consultas usualmente usam UDP/53 com mensagens pequenas; TCP/53 aparece em respostas grandes, truncamento TC=1 e transferência de zona (AXFR). A hierarquia separa responsabilidade: mudar o IP de example.com exige alterar apenas a zona autoritativa.",
        [
          ["raiz DNS", "Topo da hierarquia, representado por ., que delega os domínios de topo."],
          ["TLD", "Domínio de topo como .com ou .br, responsável por delegar domínios sob ele."],
          ["servidor autoritativo", "Servidor que responde com autoridade pelos registros de uma zona."],
          ["resolvedor recursivo", "Servidor que percorre a hierarquia em nome do cliente até obter a resposta final."],
          ["consulta iterativa", "Consulta na qual o respondedor devolve uma referência para o próximo servidor."]
        ],
        {
          ex: [["Resolva www.example.com", "O stub pergunta ao resolvedor; este consulta a raiz, recebe os NS de .com, consulta .com, recebe os NS de example.com e obtém o A no autoritativo."], ["Depois do cache", "Se o registro A ainda está no cache com TTL 120, uma nova consulta termina no resolvedor sem tocar na raiz."]],
          er: ["Achar que a raiz conhece o IP de todos os sites.", "Confundir consulta recursiva do cliente com iteração do resolvedor.", "Supor que o autoritativo pergunta ao TLD antes de responder."],
          lab: "Simulação: desenhe a árvore . -> .com -> example.com -> www e marque em qual nó a resposta final é encontrada.",
          ref: "RFC 1034; RFC 1035; Cloudflare Learning Center, artigos sobre DNS (cloudflare.com/learning/dns).",
          workedExamples: ["O comando dig +trace mostra visualmente as etapas raiz -> TLD -> autoritativo.", "Se o autoritativo estiver fora, o resolvedor pode devolver SERVFAIL mesmo com a rede funcionando."],
          recallQuestions: ["O que é um TLD?", "Quem percorre a hierarquia?", "O que uma referência NS significa?"],
          masteryCriteria: ["Ordena raiz, TLD e autoritativo.", "Distingue recursivo de iterativo.", "Explica o papel do cache."],
          tags: ["DNS", "hierarquia", "resolução"],
          estimatedEffort: 25
        }),

      L("Registros DNS e formato das mensagens",
        "Interpretar A, AAAA, CNAME, MX, NS, TXT, PTR e os campos de uma mensagem DNS.",
        "Hierarquia DNS e conceito de porta 53.",
        "Cada registro é uma linha com nome, tipo, classe, TTL e dados; a mensagem DNS organiza essas linhas em seções.",
        "Uma mensagem DNS tem Header com ID (correlaciona pergunta e resposta), flags QR, Opcode, AA (autoritativa), TC (truncada), RD (recursão desejada), RA (recursão disponível) e RCODE (NOERROR, NXDOMAIN, SERVFAIL), além dos contadores QDCOUNT, ANCOUNT, NSCOUNT e ARCOUNT. Seguem as seções Question, Answer, Authority e Additional.\n\nCada resource record contém Name, Type, Class, TTL, RDLENGTH e RDATA. Os tipos mais comuns: A devolve IPv4; AAAA devolve IPv6; CNAME é apelido para outro nome e não pode conviver com outros dados no mesmo nome; MX indica servidor de e-mail com preference; NS delega zona; SOA guarda parâmetros da zona, como serial e TTL negativo; TXT transporta texto usado em verificação de domínio e SPF; PTR mapeia endereço para nome, em in-addr.arpa para IPv4 e ip6.arpa para IPv6.\n\nO campo Additional frequentemente traz glue records: endereços IP dos servidores NS quando eles estão dentro da própria zona delegada. Sem glue, resolver .com exigiria consultar um servidor cujo endereço só a própria zona saberia informar, criando dependência circular.",
        [
          ["resource record", "Registro DNS com nome, tipo, classe, TTL e dados."],
          ["CNAME", "Registro de apelido que aponta um nome para outro nome canônico."],
          ["MX", "Registro que indica servidor de e-mail e sua prioridade."],
          ["PTR", "Registro de apontamento reverso de endereço IP para nome."],
          ["glue record", "Endereço IP de um servidor NS incluído na seção Additional para quebrar dependência circular."]
        ],
        {
          ex: [["Leia uma resposta", "QUESTION www.example.com IN A; ANSWER www.example.com 300 IN A 203.0.113.10; AA=0 porque o resolvedor não é autoritativo pelo domínio."], ["Registros típicos", "example.com A 203.0.113.10; example.com MX 10 mail.example.com; www.example.com CNAME example.com; 10.113.0.203.in-addr.arpa PTR mail.example.com."]],
          er: ["Colocar CNAME junto com A no mesmo nome.", "Esperar que MX aponte diretamente para um endereço IP.", "Confundir RCODE NXDOMAIN com SERVFAIL: um diz que o nome não existe, o outro que o servidor falhou."],
          lab: "Simulação: classifique em papel sete registros por tipo e escreva o que cada RDATA representa.",
          ref: "RFC 1035; RFC 1912 (práticas comuns); RFC 3596 (AAAA); man7.org: dig(1).",
          workedExamples: ["TTL=300 na resposta significa que o resolvedor pode reutilizar o registro por até 5 minutos.", "RD=1 na pergunta e RA=1 na resposta indicam que o cliente pediu recursão e o servidor a oferece."],
          recallQuestions: ["Qual registro fornece IPv6?", "O que é um glue record?", "O que significa NXDOMAIN?"],
          masteryCriteria: ["Reconhece os sete registros pedidos.", "Lê os flags principais do Header.", "Explica a função do Additional."],
          tags: ["DNS", "registros", "mensagem"],
          estimatedEffort: 30
        }),

      L("TTL, cache e consultas negativas",
        "Prever por quanto tempo uma resposta DNS pode ser reutilizada e quais efeitos o cache produz.",
        "Registros DNS e hierarquia de resolução.",
        "TTL é um prazo de validade: ele acelera consultas, mas atrasa mudanças.",
        "Cada resposta traz um TTL em segundos. O resolvedor decrementa o tempo restante e serve o registro do cache enquanto ele não expira; quando chega a zero, uma nova consulta é feita. Por isso alterar um A record pode demorar o TTL antigo mais o tempo de propagação de caches intermediários para ser visto por todos. Reduzir o TTL antes de uma migração facilita a troca; aumentá-lo depois reduz carga nos autoritativos.\n\nRespostas negativas também são cacheadas. Se um nome não existe, o resolvedor guarda NXDOMAIN pelo tempo definido no campo Minimum ou SOA Negative TTL, limitado por RFC 2308. Isso evita repetir consultas inúteis, mas significa que criar o registro logo após um erro pode não aparecer imediatamente.\n\nO cache é uma superfície de ataque: respostas falsificadas inseridas no cache desviam usuários para endereços maliciosos. Medidas clássicas incluem ports randomization, IDs de transação aleatórios, checagem de bailiwick (só aceitar dados relacionados à zona consultada) e DNSSEC, que assina as respostas. O cache do sistema operacional também existe e pode ser inspecionado com ferramentas locais; ele é distinto do cache do navegador.",
        [
          ["TTL", "Tempo de vida de um registro em cache, definido pelo administrador da zona."],
          ["cache negativo", "Armazenamento temporário da resposta de que um nome não existe."],
          ["SOA Minimum", "Campo da zona usado como TTL negativo em respostas NXDOMAIN."],
          ["DNS cache poisoning", "Inserção de resposta falsa no cache do resolvedor para desviar consultas futuras."],
          ["bailiwick", "Regra que limita quais dados um servidor pode ser considerado autorizado a fornecer."]
        ],
        {
          ex: [["Migração", "Com TTL=86400, mudar o A agora pode levar até um dia para ser visto por quem consultou antes; baixe para 300 um dia antes da mudança."], ["NXDOMAIN preso", "Um nome consultado por engano fica em cache negativo por 600 segundos; criá-lo agora não garante visibilidade imediata."]],
          er: ["Achar que DNS é sempre instantâneo.", "Ignorar o cache do navegador ao testar uma mudança.", "Acreditar que TTL longo melhora segurança automaticamente."],
          lab: "Simulação: simule uma consulta com TTL 60, uma segunda após 30 s e uma terceira após 70 s, indicando quando há nova ida ao autoritativo.",
          ref: "RFC 1035; RFC 2308; Cloudflare Learning Center, artigos sobre TTL (cloudflare.com/learning/dns).",
          workedExamples: ["Se 1000 usuários consultam por minuto e o TTL é 300, o autoritativo recebe cerca de 3 consultas por minuto por nome, não 1000.", "dig mostra o TTL restante no cabeçalho de cada registro da seção Answer."],
          recallQuestions: ["O que acontece quando o TTL chega a zero?", "O que é cache negativo?", "Como o TTL afeta uma migração?"],
          masteryCriteria: ["Calcula reutilização de cache pelo TTL.", "Explica NXDOMAIN cacheado.", "Cita pelo menos uma defesa contra envenenamento."],
          tags: ["DNS", "TTL", "cache"],
          estimatedEffort: 25
        }),

      L("DNS sobre TLS e HTTPS",
        "Comparar DNS clássico, DoT, DoH e DoQ e explicar o que cada um protege.",
        "Portas UDP/TCP, TLS conceitual e cache DNS.",
        "Criptografar a consulta esconde o conteúdo do DNS, mas não resolve todas as formas de rastreamento.",
        "O DNS clássico envia perguntas e respostas em texto claro na porta 53, normalmente sobre UDP. Isso permite que observadores da rede leiam quais domínios um host consulta e até alterem respostas. O DNS sobre TLS (DoT, RFC 7858) usa TLS na porta 853, com uma conexão separada e facilmente identificável pelo número de porta. O DNS sobre HTTPS (DoH, RFC 8484) transporta mensagens DNS dentro de requisições HTTP sobre TLS na porta 443, misturando-as com o tráfego web comum. Há ainda DoQ (RFC 9250), que usa QUIC sobre UDP.\n\nTodos continuam usando o mesmo formato de mensagem DNS; muda apenas o transporte. DoT e DoH protegem a confidencialidade e a integridade entre cliente e resolvedor, desde que o certificado seja validado. Não criptografam o tráfego para o autoritativo quando o resolvedor repassa a consulta em claro, nem escondem todos os metadados: endereço IP do resolvedor, tempo e tamanho das consultas ainda podem ser observados.\n\nDoH é debatido porque desloca a visibilidade e o controle do administrador da rede para o cliente e o provedor do resolvedor; políticas empresariais costumam bloquear DoH não autorizado. DNSSEC é independente: ele assina os dados da zona e permite verificar autenticidade e integridade da resposta, mas não a torna confidencial. Criptografia de transporte e assinatura de dados resolvem problemas diferentes.",
        [
          ["DoT", "DNS sobre TLS, normalmente na porta 853, com conexão TLS dedicada ao resolvedor."],
          ["DoH", "DNS sobre HTTPS, encapsulando mensagens DNS em requisições HTTP/TLS na porta 443."],
          ["DoQ", "DNS sobre QUIC, usando UDP e TLS 1.3 com multiplexação de fluxos."],
          ["DNSSEC", "Mecanismo de assinaturas que autentica a origem e a integridade dos dados DNS."],
          ["metadado de rede", "Informação observável além do conteúdo, como IP do resolvedor, horário e volume de consultas."]
        ],
        {
          ex: [["Escolha de transporte", "Um roteador doméstico pode usar DoT com um resolvedor público; um navegador pode usar DoH e ignorar o DNS configured pelo sistema."], ["Dois problemas distintos", "DoH esconde a pergunta do observador local; DNSSEC permite provar que a resposta não foi forjada. Um não substitui o outro."]],
          er: ["Achar que DoH torna a navegação anônima.", "Supor que DNSSEC criptografa consultas.", "Acreditar que a porta 853 é a única forma de fazer DNS criptografado."],
          lab: "Simulação: compare em papel quatro colunas — DNS clássico, DoT, DoH e DoQ — com porta, transporte e o que um observador local consegue ver.",
          ref: "RFC 7858; RFC 8484; RFC 9250; RFC 9077; Cloudflare Learning Center, artigos sobre DoH (cloudflare.com/learning/dns/dns-over-https).",
          workedExamples: ["Uma rede corporativa pode exigir que todo DNS passe pelo seu resolvedor e bloquear conexões DoH diretas para manter políticas de filtro.", "Com DoT, um firewall consegue reconhecer a porta 853 mesmo sem ler o conteúdo das mensagens."],
          recallQuestions: ["Qual porta o DoT usa normalmente?", "O que o DNSSEC garante?", "O que DoH não esconde?"],
          masteryCriteria: ["Distingue DoT, DoH e DoQ.", "Explica limites de privacidade.", "Separa criptografia de transporte e autenticidade de dados."],
          tags: ["DNS", "DoH", "DoT", "privacidade"],
          estimatedEffort: 30
        })
    ]
  },
  {
    name: "R8 — HTTP e TLS",
    lessons: [
      L("Anatomia de uma requisição e resposta HTTP",
        "Ler linha inicial, headers e corpo de mensagens HTTP/1.1.",
        "TCP, portas 80/443 e modelo cliente-servidor.",
        "HTTP é uma conversa em texto estruturado: uma pergunta com cabeçalhos e, às vezes, corpo; uma resposta com status e corpo.",
        "Uma requisição HTTP/1.1 começa com Method, target e versão, por exemplo GET /aula?id=3 HTTP/1.1. Seguem headers linha a linha, uma linha vazia e o corpo, quando presente. A resposta começa com a versão, código de status e reason phrase, por exemplo HTTP/1.1 200 OK, depois headers e corpo. O header Host é obrigatório em HTTP/1.1 porque um mesmo endereço IP pode servir vários domínios.\n\nContent-Length informa o tamanho exato do corpo em bytes; Transfer-Encoding: chunked permite enviar pedaços quando o tamanho final ainda não é conhecido. Content-Type descreve o formato, como text/html; charset=utf-8 ou application/json. Connection: keep-alive reaproveita a conexão TCP para várias requisições, evitando um handshake por recurso.\n\nUma mensagem não é o mesmo que uma conexão: várias requisições e respostas podem trafegar na mesma conexão, e, com HTTP/2 ou 3, a correspondência passa a ser por fluxo, não por ordem de texto. O corpo pode ser binário; a presença de caracteres legíveis depende do Content-Type e, em HTTPS, todos os bytes da mensagem são criptografados no fio.",
        [
          ["request line", "Primeira linha da requisição, com método, alvo e versão do protocolo."],
          ["status line", "Primeira linha da resposta, com versão, código numérico e frase explicativa."],
          ["Host", "Header obrigatório em HTTP/1.1 que identifica o domínio atendido pelo servidor."],
          ["Content-Length", "Header que informa o número exato de bytes do corpo."],
          ["chunked", "Codificação de transferência que envia o corpo em blocos com tamanho explícito."]
        ],
        {
          ex: [["Requisição simples", "GET /index.html HTTP/1.1, Host: example.com, Accept: text/html, Connection: keep-alive; sem corpo."], ["Resposta com corpo", "HTTP/1.1 200 OK, Content-Type: text/html; charset=utf-8, Content-Length: 1234, seguido de 1234 bytes de HTML."]],
          er: ["Achar que Host é opcional em HTTP/1.1.", "Confundir Content-Length com o tamanho total da resposta incluindo headers.", "Esperar ler corpo HTTP em claro em uma conexão HTTPS."],
          lab: "Simulação: escreva uma requisição GET e uma resposta 200 com quatro headers cada, separando a linha vazia do corpo.",
          ref: "RFC 9110 (semântica HTTP); RFC 9112 (HTTP/1.1); MDN Web Docs, artigos sobre HTTP (developer.mozilla.org).",
          workedExamples: ["Uma requisição POST com Content-Length: 27 deve enviar exatamente 27 bytes de corpo; menos que isso deixa a conexão inconsistente.", "Transfer-Encoding: chunked usa linhas de tamanho em hexadecimal seguidas dos dados e termina com um bloco de tamanho zero."],
          recallQuestions: ["Quais são as três partes da request line?", "Por que Host é obrigatório?", "O que indica o fim dos headers?"],
          masteryCriteria: ["Monta uma requisição válida.", "Diferencia corpo de cabeçalhos.", "Explica keep-alive."],
          tags: ["HTTP", "requisição", "headers"],
          estimatedEffort: 20
        }),

      L("Métodos e códigos de status",
        "Escolher métodos HTTP adequados e interpretar as famílias de status.",
        "Anatomia de requisição e resposta.",
        "Método diz o que se quer fazer; status diz o que o servidor decidiu fazer.",
        "GET recupera um recurso e não deve ter efeito colateral significativo; HEAD pede os mesmos headers sem corpo; POST cria ou processa dados; PUT substitui o recurso no URI informado; PATCH aplica alteração parcial; DELETE remove; OPTIONS descreve métodos permitidos. GET, HEAD, OPTIONS e PUT são considerados seguros ou idempotentes em graus diferentes: idempotente significa que repetir a mesma operação produz o mesmo estado final, não necessariamente a mesma resposta.\n\nOs status se agrupam em cinco famílias: 1xx informacional (100 Continue, 101 Switching Protocols); 2xx sucesso (200 OK, 201 Created, 204 No Content); 3xx redirecionamento (301 permanente, 302 temporário, 304 Not Modified); 4xx erro do cliente (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 405 Method Not Allowed, 429 Too Many Requests); 5xx erro do servidor (500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout).\n\n401 e 403 são frequentemente confundidos: 401 significa que a autenticação está ausente ou inválida e deve vir com WWW-Authenticate; 403 significa que a identidade é conhecida, mas não tem permissão. Um 304 não traz corpo e instrui o cliente a usar a cópia em cache. Redirecionamentos alteram o método em alguns casos históricos, por isso 303 e 307/308 existem para tornar a intenção explícita.",
        [
          ["método idempotente", "Método cuja repetição não altera o estado final do servidor além da primeira execução."],
          ["401 Unauthorized", "Status que indica autenticação necessária ou falhada."],
          ["403 Forbidden", "Status que indica acesso negado apesar da identidade conhecida."],
          ["304 Not Modified", "Status de cache que dispensa o corpo e autoriza reuso da cópia local."],
          ["5xx", "Família de status que atribui a falha ao servidor ou a um gateway intermediário."]
        ],
        {
          ex: [["Envio de formulário", "POST /login processa credenciais e cria sessão; um segundo POST pode criar outra ação, por isso não é idempotente."], ["Cache condicional", "O cliente envia If-None-Match; o servidor responde 304 sem corpo e o navegador reusa o HTML armazenado."]],
          er: ["Usar GET para operações que alteram estado.", "Achar que 404 é erro do servidor.", "Confundir 401 com 403."],
          lab: "Simulação: classifique doze status em 2xx, 3xx, 4xx e 5xx e escreva o que cada um recomenda ao cliente.",
          ref: "RFC 9110; MDN Web Docs, lista de métodos e status HTTP (developer.mozilla.org).",
          workedExamples: ["PUT /usuario/42 com o mesmo corpo repetido deve deixar o recurso idêntico; POST /pedidos repetido pode gerar dois pedidos.", "503 com Retry-After: 120 informa ao cliente quando tentar novamente."],
          recallQuestions: ["Quais métodos são idempotentes?", "O que significa 304?", "Como diferenciar 401 e 403?"],
          masteryCriteria: ["Associa método e uso típico.", "Classifica as cinco famílias de status.", "Interpreta 304 corretamente."],
          tags: ["HTTP", "métodos", "status"],
          estimatedEffort: 20
        }),

      L("Headers, cookies e cache HTTP",
        "Explicar cabeçalhos importantes, sessões por cookie e validação de cache.",
        "Mensagem HTTP e códigos de status.",
        "O HTTP é sem estado: cookies e cache são mecanismos para reconstruir contexto e evitar trabalho repetido.",
        "Set-Cookie cria um cookie no cliente com atributos Name=Value, Domain, Path, Expires ou Max-Age, Secure (somente HTTPS), HttpOnly (inacessível a JavaScript) e SameSite (Lax, Strict ou None; None exige Secure). O navegador devolve o cookie em Cookie nas requisições seguintes. Cookies de sessão expiram ao fechar o navegador; persistentes têm validade definida. O servidor costuma guardar o estado real da sessão no servidor e enviar apenas um identificador.\n\nO cache reduz latência e carga. Cache-Control: max-age=600 define frescor por 600 segundos; no-cache exige revalidação antes do uso; no-store proíbe armazenamento; private limita ao navegador e public permite caches compartilhados, como proxies. Vary indica quais headers de requisição participam da chave do cache, por exemplo Vary: Accept-Encoding. Quando o conteúdo fica obsoleto, o cliente usa If-None-Match com ETag ou If-Modified-Since com Last-Modified; o servidor responde 304 se nada mudou.\n\nHeaders de segurança complementam a troca: Content-Security-Policy restringe fontes de scripts, X-Content-Type-Options: nosniff inibe sniffing de MIME e Strict-Transport-Security exige HTTPS por um período. Authorization transporta credenciais, por isso nunca deve aparecer em logs ou URLs. Cookies e cache são decisões de projeto com implicações de privacidade e segurança.",
        [
          ["cookie", "Pequeno dado enviado pelo servidor e devolvido pelo navegador para manter estado entre requisições."],
          ["HttpOnly", "Atributo que impede JavaScript de ler o cookie, reduzindo danos de XSS."],
          ["SameSite", "Atributo que controla o envio do cookie em requisições entre sites."],
          ["ETag", "Identificador de versão do recurso usado em revalidação condicional."],
          ["Vary", "Header que lista quais headers da requisição distinguem variantes do conteúdo em cache."]
        ],
        {
          ex: [["Cookie de sessão", "Set-Cookie: sid=abc123; Path=/; HttpOnly; Secure; SameSite=Lax. O navegador reenvia sid=abc123 em requisições HTTPS dentro do caminho /."], ["Revalidação", "O cliente guardou ETag 'a1b2'; depois de expirar, envia If-None-Match: 'a1b2' e recebe 304 sem corpo."]],
          er: ["Guardar tokens em cookie sem Secure e HttpOnly.", " Usar cache compartilhado para respostas personalizadas sem private ou Vary: Cookie.", "Achar que no-cache significa 'nunca armazenar'."],
          lab: "Simulação: escreva um Set-Cookie seguro e uma resposta com max-age=60, ETag e Vary: Accept-Encoding.",
          ref: "RFC 6265bis (cookies); RFC 9111 (cache HTTP); MDN Web Docs, guias de cookies e cache (developer.mozilla.org).",
          workedExamples: ["SameSite=None sem Secure é rejeitado por navegadores modernos em contexto de terceiros.", "Uma resposta com Content-Encoding: gzip deve variar por Accept-Encoding, ou um cliente sem gzip pode receber bytes comprimidos."],
          recallQuestions: ["O que faz HttpOnly?", "O que significa max-age=0?", "Para que serve ETag?"],
          masteryCriteria: ["Configura cookie com atributos seguros.", "Distingue no-cache de no-store.", "Explica revalidação 304."],
          tags: ["HTTP", "cookies", "cache"],
          estimatedEffort: 30
        }),

      L("HTTP/1.1, HTTP/2 e HTTP/3",
        "Comparar versões do HTTP e explicar os problemas de desempenho que cada uma resolve.",
        "TCP, TLS e mensagens HTTP.",
        "As versões mudam como mensagens são transportadas, mas preservam a semântica de métodos, status e headers.",
        "HTTP/1.1 usa texto sobre TCP e conexões persistentes. Várias requisições podem ser enviadas em sequência, mas cada resposta precisa chegar na ordem: em uma página com muitos recursos, uma requisição lenta bloqueia as seguintes, o chamado head-of-line blocking da camada de aplicação. Pipelining existe, porém é pouco usado.\n\nHTTP/2 (RFC 9113) mantém TCP e TLS, mas troca texto por framing binário. Mensagens são divididas em frames pertencentes a streams identificadas por número, permitindo multiplexação: várias requisições e respostas progridem na mesma conexão sem esperar a ordem. HPACK comprime headers e evita repetir valores longos. A priorização ajuda a entregar primeiro o que a página mais precisa. Server Push foi definido e depois amplamente descontinuado na prática. Ainda existe head-of-line blocking do TCP: se um segmento se perde, todos os streams da conexão esperam a recuperação.\n\nHTTP/3 (RFC 9114) usa QUIC sobre UDP, com TLS 1.3 integrado. Cada stream é independente no transporte: a perda em um stream não bloqueia os outros. QPACK substitui HPACK para comprimir headers com multiplexação. Handshakes e retomadas podem ser mais rápidos, inclusive com 0-RTT, que tem ressalvas de repetição de requisições não idempotentes. A semântica HTTP permanece a mesma; o que muda é o mecanismo de transporte.",
        [
          ["HTTP/1.1", "Versão textual sobre TCP, com conexões persistentes e respostas ordenadas."],
          ["HTTP/2", "Versão binária sobre TCP, com streams multiplexadas e compressão HPACK."],
          ["HTTP/3", "Versão sobre QUIC/UDP, com streams independentes no transporte e compressão QPACK."],
          ["head-of-line blocking", "Bloqueio em que uma mensagem lenta impede o progresso das seguintes."],
          ["ALPN", "Extensão TLS que negocia qual protocolo de aplicação será usado, como h2 ou http/1.1."]
        ],
        {
          ex: [["Página com muitos recursos", "Em HTTP/1.1, uma imagem grande pode atrasar scripts seguintes; em HTTP/2, esses recursos trafegam em streams diferentes da mesma conexão."], ["Perda de pacote", "Em HTTP/2 sobre TCP, todos os streams esperam a retransmissão do segmento perdido; em HTTP/3, apenas o stream afetado sofre."]],
          er: ["Achar que HTTP/2 mudou métodos e códigos de status.", "Supor que HTTP/3 roda diretamente sobre TCP.", "Considerar que 0-RTT é seguro para qualquer requisição sem análise de replay."],
          lab: "Simulação: desenhe três conexões: HTTP/1.1 fila única, HTTP/2 vários streams em TCP e HTTP/3 vários streams em QUIC.",
          ref: "RFC 9113 (HTTP/2); RFC 9114 (HTTP/3); RFC 9000 (QUIC); Cloudflare Learning Center, artigos sobre HTTP/3.",
          workedExamples: ["curl -v --http2 mostra ALPN: offers h2, http/1.1 e depois a negociação escolhida pelo servidor.", "Em HTTP/3, o campo :authority desempenha papel semelhante ao Host do HTTP/1.1."],
          recallQuestions: ["O que HTTP/2 acrescenta sobre HTTP/1.1?", "Qual transporte o HTTP/3 usa?", "O que ALPN negocia?"],
          masteryCriteria: ["Compara as três versões.", "Explica os dois tipos de head-of-line blocking.", "Distingue HPACK de QPACK."],
          tags: ["HTTP", "HTTP/2", "HTTP/3", "QUIC"],
          estimatedEffort: 35
        }),

      L("TLS e cadeia de confiança",
        "Descrever o handshake TLS conceitualmente e explicar a validação de certificados.",
        "TCP, criptografia assimétrica e simétrica em visão geral.",
        "O certificado responde 'quem é você'; o handshake combina essa prova com uma chave secreta para a conversa.",
        "No TLS 1.3 (RFC 8446), o cliente envia ClientHello com versão, valor aleatório, suítes de cifras e extensões como SNI e ALPN. O servidor responde ServerHello escolhendo parâmetros e envia seu certificado, prova de posse da chave privada e parâmetros de key share com ECDHE. O segredo de sessão é derivado do Diffie-Hellman efêmero, garantindo forward secrecy: comprometer a chave privada depois não revela sessões passadas. Mensagens são autenticadas e o registro protege os dados com cifra simétrica AEAD.\n\nA cadeia de confiança normalmente tem certificado folha (servidor), um ou mais intermediários e uma autoridade certificadora raiz armazenada no cliente. O cliente verifica assinaturas, validade temporal, nome ou SAN (Subject Alternative Name) e revogação, quando aplicável. Certificados autoassinados exigem confiança explícita; não são automaticamente confiáveis só por existirem.\n\nO handshake de TLS 1.2 tem mais idas e vindas e permite suítes legadas inseguras; o 1.3 simplifica o processo e remove algoritmos obsoletos. A retomada de sessão pode usar tickets ou PSK e reduzir latência. TLS protege a comunicação até o ponto de terminação: em um balanceador que faz TLS termination, o trecho entre balanceador e aplicação pode estar em claro na rede interna a menos que também seja protegido.",
        [
          ["certificado folha", "Certificado apresentado pelo servidor, contendo chave pública e identidade do site."],
          ["cadeia de confiança", "Sequência de certificados assinados que liga a folha a uma autoridade raiz confiável."],
          ["SAN", "Extensão do certificado que lista os nomes de host para os quais ele é válido."],
          ["forward secrecy", "Propriedade pela qual o comprometimento da chave privada não expõe sessões anteriores."],
          ["ALPN", "Extensão TLS usada para negociar o protocolo de aplicação durante o handshake."]
        ],
        {
          ex: [["Validação", "O cliente recebe folha de example.com, intermediário da CA e raiz já instalada; verifica assinaturas, SAN e data e só então envia dados HTTP."], ["Erro comum", "Certificado válido para www.example.com, mas o usuário abre example.com: a verificação de SAN falha mesmo com a cadeia correta."]],
          er: ["Achar que certificado HTTPS prova que o site é confiável em todos os sentidos.", "Aceitar certificado autoassinado sem entender a consequência.", "Supor que TLS protege todos os saltos até a aplicação final."],
          lab: "Simulação: desenhe folha -> intermediário -> raiz e marque quais verificações o cliente faz antes de aceitar a conexão.",
          ref: "RFC 8446; RFC 5280; Cloudflare Learning Center, artigos sobre TLS (cloudflare.com/learning/ssl).",
          workedExamples: ["curl -v https://example.com mostra a lista de certificados, o emissor, o ALPN e o resultado da verificação da CA.", "HSTS instrui o navegador a usar HTTPS por um período, reduzindo o risco de downgrade via redirects."],
          recallQuestions: ["O que a cadeia de certificados prova?", "O que SAN verifica?", "Por que ECDHE dá forward secrecy?"],
          masteryCriteria: ["Descreve ClientHello e ServerHello em termos gerais.", "Explica a cadeia e o SAN.", "Distingue TLS de autorização de aplicação."],
          tags: ["TLS", "certificados", "HTTPS"],
          estimatedEffort: 40
        })
    ]
  },
  {
    name: "R9 — Ferramentas Linux para redes",
    lessons: [
      L("ip addr, ip route e ip neigh: campo por campo",
        "Ler a saída das ferramentas ip e relacionar cada campo ao que ele representa.",
        "IPv4/IPv6, máscaras, roteamento e ARP/NDP.",
        "Antes de culpar a aplicação, descubra o que a própria máquina sabe sobre interfaces, rotas e vizinhos.",
        "ip addr mostra cada interface com índice e nome, estado administrativo e operacional (UP/DOWN, LOWER_UP), MTU, qdisc, endereço MAC (link/ether), endereços inet e inet6 com prefixo, escopo (global, link, host), valid_lft e preferred_lft para DHCPv6. O loopback lo merece atenção: tráfego para 127.0.0.1 nunca sai da máquina.\n\nip route lista destino, via (gateway), dev (interface), src (origem preferida), proto (kernel, dhcp, static, ospf...), metric e, em tabelas adicionais, table. 'default' significa 0.0.0.0/0 ou ::/0. ip neigh mostra o cache de vizinhos: endereço IP, MAC (lladdr), dev e estado REACHABLE, STALE, DELAY, PROBE, FAILED ou PERMANENT; em IPv6 a mesma tabela reflete o NDP.\n\nUma leitura ordenada evita erros: primeiro confirme se a interface existe e está UP; depois se o endereço e a máscara estão corretos; em seguida se há rota para o destino; por fim se o next-hop tem entrada de vizinho válida. Falta de vizinho em rede local costuma apontar para cabo, VLAN, filtro ou ARP/NDP bloqueado; falha para fora pode ser rota padrão ausente.",
        [
          ["ip addr", "Comando que mostra interfaces, endereços, MTU e estado administrativo e operacional."],
          ["ip route", "Comando que exibe a tabela de rotas com gateway, interface e métrica."],
          ["ip neigh", "Comando que mostra o cache de resolução de endereços de camada 2."],
          ["lladdr", "Campo de ip neigh com o endereço de enlace, normalmente o MAC."],
          ["valid_lft", "Tempo restante de validade de um endereço IPv6 obtido por DHCPv6."]
        ],
        {
          ex: [["Leia uma interface", "2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 ... link/ether 00:11:22:33:44:55; inet 192.168.1.20/24 brd 192.168.1.255 scope global dynamic eth0."], ["Leia um vizinho", "192.168.1.1 dev eth0 lladdr aa:bb:cc:dd:ee:ff REACHABLE indica que o gateway tem MAC conhecido e foi visto recentemente."]],
          er: ["Confundir estado administrativo UP com LOWER_UP, que indica sinal físico presente.", "Achar que ip neigh mostra portas TCP.", "Ignorar o prefixo /24 e olhar apenas o endereço IP."],
          lab: "No simulador da Forge, leia uma saída de ip addr/ip route/ip neigh e anote o significado de cada coluna antes de responder ao quiz.",
          ref: "man7.org: ip(8), ip-address(8), ip-route(8), ip-neighbor(8); Linux Network Administrators Guide.",
          workedExamples: ["Uma interface com estado UP, mas sem LOWER_UP, normalmente indica cabo desconectado ou link sem negociação.", "Uma rota default via 10.0.0.1 dev eth0 depende de ip neigh resolver 10.0.0.1 para um MAC válido."],
          recallQuestions: ["O que indica LOWER_UP?", "O que significa dev em ip route?", "Qual estado de vizinho sinaliza MAC confirmado recentemente?"],
          masteryCriteria: ["Interpreta endereço, prefixo, escopo e MTU.", "Explica cada coluna de ip route.", "Relaciona ip neigh a ARP/NDP."],
          tags: ["ip", "diagnóstico", "Linux"],
          estimatedEffort: 25
        }),

      L("ss -tulpen: sockets, portas e processos",
        "Listar sockets em escuta e conexões estabelecidas, interpretando todas as colunas.",
        "Portas, TCP/UDP e estado de conexão.",
        "ss responde 'quem está ouvindo e quem está conectado'; ping não faz essa pergunta.",
        "ss -tulpen combina -t (TCP), -u (UDP), -l (somente escuta), -p (processo), -e (informação estendida) e -n (sem resolver nomes). Colunas típicas: Netid, State, Recv-Q e Send-Q, Local Address:Port, Peer Address:Port e Process. Em TCP, State pode ser LISTEN, ESTAB, SYN-SENT, TIME-WAIT, CLOSE-WAIT ou outros estados da máquina de estados; em UDP, costuma ser UNCONN.\n\nRecv-Q e Send-Q mostram bytes na fila: em LISTEN, Recv-Q pode indicar conexões aceitas pelo kernel e ainda não retiradas pela aplicação; em ESTAB, mostram dados não lidos ou não enviados. Filas grandes podem indicar aplicação lenta. Endereços 0.0.0.0:443 ou *:443 significam todas as interfaces locais; 127.0.0.1:8080 restringe ao loopback; [::]:443 mostra IPv6, frequentemente com v6only desligado.\n\nPonto essencial: ping usa ICMP e não TCP, portanto nunca prova que uma porta TCP está aberta. Um host pode responder ping com 443 fechada, e outro pode bloquear ICMP com 443 aberta. Para testar porta TCP, use nc -vz host 443, curl -v https://host ou uma conexão real; ss no servidor confirma se há listener.",
        [
          ["ss", "Ferramenta Linux que lista sockets TCP, UDP, UNIX e seus estados."],
          ["LISTEN", "Estado de um socket TCP aguardando conexões entrantes."],
          ["Recv-Q", "Fila de dados recebidos pelo kernel ainda não lidos pela aplicação."],
          ["0.0.0.0", "Endereço curinga que associa o socket a todas as interfaces IPv4 locais."],
          ["ICMP versus TCP", "Distinção entre teste de alcance por ping e teste de porta por conexão TCP."]
        ],
        {
          ex: [["Leia uma linha", "tcp LISTEN 0 4096 0.0.0.0:443 0.0.0.0:* users:(('nginx',pid=812,fd=6)) mostra nginx ouvendo 443 em todas as interfaces."], ["Teste correto", "ping servidor responde, mas nc -vz servidor 443 falha: o host está alcançável, porém não há listener TCP nessa porta."]],
          er: ["Usar ping para afirmar que uma porta está aberta.", "Interpretar *:443 como endereço remoto concreto.", "Ignorar Recv-Q e Send-Q ao investigar lentidão."],
          lab: "No simulador da Forge, identifique em uma saída de ss qual processo escuta a porta 80, qual endereço está vinculado e se há conexões ESTAB.",
          ref: "man7.org: ss(8), netstat(8), nc(1); RFC 792; man7.org: ping(8).",
          workedExamples: ["ss -tulpen | grep ':22' localiza o serviço SSH e seu PID.", "Uma conexão em TIME-WAIT não é vazamento: é o lado que fechou primeiro aguardando o tempo de segurança."],
          recallQuestions: ["O que -n muda na saída?", "O que significa 0.0.0.0:443?", "Por que ping não testa porta TCP?"],
          masteryCriteria: ["Explica todas as colunas principais.", "Diferencia LISTEN de ESTAB.", "Afirma explicitamente a limitação do ping."],
          tags: ["ss", "portas", "ping"],
          estimatedEffort: 25
        }),

      L("ping e traceroute: interpretando saída e limites",
        "Medir perda e latência com ping e ler saltos com traceroute sem extrapolar o resultado.",
        "ICMP, TTL e ss para portas.",
        "ping responde 'o IP respondeu?' e traceroute responde 'por quais roteadores passou?'; nenhum dos dois responde 'a porta X está aberta?'",
        "ping -c 4 1.1.1.1 envia quatro Echo Requests. A saída traz tamanho, endereço de origem do reply, icmp_seq (sequência), ttl recebido e time (RTT daquele pacote). O resumo mostra packets transmitted, received, percentual de perda e estatísticas min/avg/max/mdev do RTT. Perda pode indicar congestionamento, filtragem de ICMP ou rota instável; ttl menor que o inicial revela quantos saltos o pacote atravessou, mas o valor inicial varia por sistema operacional.\n\ntraceroute example.com imprime número do salto, nome e IP do roteador e três tempos. Com a variante UDP padrão, cada salto responde ICMP Time Exceeded e o destino final costuma responder ICMP Destination Unreachable porta inalcançável. Com -I usa Echo; com -T usa SYN e pode atravessar firewalls que bloqueiam os outros métodos. '*' significa que não houve resposta ICMP naquele timeout, frequentemente por filtragem.\n\nNenhuma das duas ferramentas testa porta TCP de aplicação. ping opera em ICMP e traceroute usa ICMP, UDP ou SYN apenas como sonda de caminho. Para porta, use nc -vz, curl -v ou ss no servidor. Além disso, respostas de ping podem ser bloqueadas por política: ausência de reply não prova que o host está desligado.",
        [
          ["icmp_seq", "Número de sequência da mensagem Echo usada para associar pedido e resposta."],
          ["RTT", "Tempo de ida e volta medido pelo ping para um pacote."],
          ["mdev", "Desvio padrão das medidas de RTT, indicador de variação da latência."],
          ["Time Exceeded", "Mensagem ICMP devolvida por roteador quando TTL chega a zero."],
          ["limitação do ping", "Fato de que ping testa ICMP, não disponibilidade de porta TCP."]
        ],
        {
          ex: [["Resumo de ping", "4 packets transmitted, 3 received, 25% packet loss, rtt min/avg/max/mdev = 12.1/15.4/20.2/3.1 ms: um pacote foi perdido e a latência variou."], ["Três sondas por salto", "1 192.168.1.1 1.2 ms 1.0 ms 1.1 ms; 2 * * *; 3 203.0.113.9 12.4 ms 13.0 ms 12.7 ms. O salto 2 não respondeu ICMP, mas o caminho continuou."]],
          er: ["Dizer que ping confirma porta TCP aberta.", "Interpretar '*' como necessariamente roteador fora do ar.", "Comparar TTL inicial de sistemas diferentes sem considerar o valor de partida."],
          lab: "No simulador da Forge, leia uma saída de ping -c 4 e uma de traceroute e responda: houve perda? qual salto não respondeu? a porta 443 foi testada?",
          ref: "man7.org: ping(8), traceroute(8), nc(1); RFC 792; RFC 4443.",
          workedExamples: ["ping -c 4 127.0.0.1 valida a pilha TCP/IP local, sem envolver placa de rede ou roteador.", "curl -v https://host:443 é o teste adequado quando a pergunta é sobre a porta 443 e o handshake TLS."],
          recallQuestions: ["O que mede o campo time do ping?", "O que produz a mensagem Time Exceeded?", "Qual ferramenta testa uma porta TCP?"],
          masteryCriteria: ["Lê perda, RTT e TTL.", "Interpreta corretamente '*'.", "Nunca apresenta ping como teste de porta."],
          tags: ["ping", "traceroute", "ICMP"],
          estimatedEffort: 25
        }),

      L("dig e curl -v: DNS e HTTP campo por campo",
        "Interpretar a saída detalhada de consultas DNS e requisições HTTP.",
        "Registros DNS, mensagem HTTP e TLS.",
        "dig mostra o que o DNS respondeu; curl -v mostra o que o cliente negociou e recebeu.",
        "dig example.com separa a saída em HEADER, QUESTION, ANSWER, AUTHORITY e ADDITIONAL. O HEADER traz opcode, status (NOERROR, NXDOMAIN, SERVFAIL), id, flags como rd, ra, qr e aa e contadores. Cada linha de ANSWER traz nome, TTL, classe, tipo e valor; Query time, SERVER e WHEN indicam quem respondeu e quanto tempo levou. dig +short reduz a saída; dig +trace percorre a hierarquia; dig MX ou AAAA consulta tipos específicos.\n\ncurl -v marca negociações com '*', dados enviados com '>' e recebidos com '<'. A saída inclui tentativa de conexão TCP, resolução de nomes, ClientHello com ALPN e SNI, detalhes do certificado e da CA, resultado da verificação TLS, headers de requisição e headers de resposta. Com -I, curl pede HEAD; com -L, segue redirecionamentos; com --http2 ou --http3, escolhe a versão quando disponível.\n\nÉ importante separar camadas: uma resposta DNS correta não garante TCP alcançável; uma conexão TCP estabelecida não garante TLS válido; TLS válido não garante status HTTP 2xx. A leitura campo por campo transforma essas camadas em evidências distintas. Em ambiente HTTPS, curl -v não mostra o corpo criptografado em claro, apenas cabeçalhos HTTP já descriptografados pelo cliente.",
        [
          ["dig HEADER", "Bloco inicial da resposta dig com flags, status e contadores de seções."],
          ["NOERROR", "RCODE que indica que a consulta foi processada sem erro."],
          ["ALPN", "Extensão TLS que aparece em curl -v e mostra a negociação de h2 ou http/1.1."],
          ["marcadores curl", "Convenção de saída: * para metadados, > para envio e < para recebimento."],
          ["Query time", "Campo do dig que informa quantos milissegundos o resolvedor levou."]
        ],
        {
          ex: [["Leia dig", "ANSWER SECTION: example.com. 300 IN A 203.0.113.10; status NOERROR; Query time: 18 msec; SERVER: 1.1.1.1#53."], ["Leia curl -v", "Connected to example.com port 443; ALPN, server accepted to use h2; SSL certificate verify ok; > GET / HTTP/2; < HTTP/2 200."]],
          er: ["Achar que status NOERROR significa que o site está no ar.", "Confundir headers HTTP com headers TLS.", "Esperar ver o corpo descriptografado na saída de uma captura HTTPS."],
          lab: "No simulador da Forge, anote em uma resposta dig o ttl, o tipo e o servidor; em uma saída curl -v, marque ALPN, verificação TLS e status HTTP.",
          ref: "man7.org: dig(1), curl(1); RFC 1035; RFC 8446; curl.se/docs/manpage.html.",
          workedExamples: ["dig +short example.com mostra apenas os valores, útil em scripts; dig example.com mostra todos os campos, útil no ensino.", "curl -v http://example.com não negocia TLS, portanto não mostra ALPN nem cadeia de certificados."],
          recallQuestions: ["Quais seções aparecem no dig?", "O que o sinal '<' indica no curl -v?", "ALPN negocia o quê?"],
          masteryCriteria: ["Lê HEADER e ANSWER do dig.", "Interpreta marcadores do curl -v.", "Separa DNS, TCP, TLS e HTTP."],
          tags: ["dig", "curl", "diagnóstico"],
          estimatedEffort: 30
        }),

      L("tcpdump: captura, filtros e interpretação de linhas",
        "Capturar e ler pacotes com tcpdump, distinguindo filtro de captura de filtro de exibição.",
        "Encapsulamento, cabeçalhos IP/TCP/UDP/ICMP e autorização de captura.",
        "tcpdump mostra o que realmente chegou à interface, não o que a aplicação acha que enviou.",
        "tcpdump -i any -nn captura em todas as interfaces sem resolver nomes. -c limita a quantidade, -w salva em arquivo pcap e -r relê. Filtros de captura usam a sintaxe BPF, por exemplo 'tcp port 443', 'host 1.1.1.1' ou 'icmp'; são aplicados pelo kernel antes da leitura e reduzem volume. Filtros de exibição são recursos de ferramentas como o Wireshark, aplicados depois da captura.\n\nUma linha TCP típica traz timestamp, origem.porta > destino.porta, flags, seq, ack, win, options e length. Flags podem ser S (SYN), S. (SYN-ACK), . (ACK), P (PSH), F (FIN) e R (RST). Em UDP aparecem origem.porta > destino.porta, UDP, length; em ICMP, echo request/reply ou time exceeded; em ARP, request/reply com MACs e IPs. O campo length informa bytes de dados, não o tamanho do cabeçalho.\n\nCapturar exige privilégio ou capacidades adequadas e, do ponto de vista legal e ético, só deve ser feito na própria máquina, em redes próprias ou com autorização explícita. Os exemplos da Forge são linhas simuladas para treino de leitura; não são captura real. Em ambiente real, bytes de aplicação podem conter dados sensíveis e devem ser manuseados com cuidado.",
        [
          ["tcpdump", "Ferramenta de linha de comando que captura e interpreta pacotes de rede."],
          ["filtro BPF", "Expressão aplicada na captura para selecionar pacotes antes de gravá-los."],
          ["pcap", "Formato de arquivo que armazena capturas de pacotes com carimbos de tempo."],
          ["flags TCP", "Letras na saída do tcpdump que representam SYN, ACK, FIN, RST e PSH."],
          ["captura autorizada", "Regra de que somente se captura tráfego de machines próprias ou com permissão explícita."]
        ],
        {
          ex: [["Handshake em uma linha", "12:30:01.123 IP 192.168.1.20.49152 > 93.184.216.34.80: Flags [S], seq 1000, win 64240, options [mss 1460], length 0."], ["Filtrando", "tcpdump -i any -nn -c 10 'tcp port 443' captura apenas dez pacotes TCP na porta 443."]],
          er: ["Confundir filtro de captura com filtro de exibição.", "Interpretar length=0 como 'pacote vazio': ele tem cabeçalhos, apenas sem dados de aplicação.", "Capturar tráfego de terceiros sem autorização."],
          lab: "No simulador da Forge, classifique cinco linhas simuladas como SYN, SYN-ACK, ACK, DNS UDP e ICMP Echo, explicando cada campo visível.",
          ref: "man7.org: tcpdump(1), pcap-filter(7); Wireshark, documentação de filtros (wireshark.org/docs); Stevens, TCP/IP Illustrated.",
          workedExamples: ["Flags [F.] indicam FIN com ACK: o lado está encerrando a transmissão e confirmando o recebimento anterior.", "tcpdump -w captura.pcap permite revisar a captura depois com Wireshark; arquivos pcap podem conter segredos."],
          recallQuestions: ["O que -nn faz?", "O que significa length=0?", "Quando um filtro BPF é aplicado?"],
          masteryCriteria: ["Escreve filtros BPF simples.", "Interpreta flags, seq, ack e win.", "Respeita o limite de captura autorizada."],
          tags: ["tcpdump", "captura", "filtros"],
          estimatedEffort: 35
        })
    ]
  },
  {
    name: "R10 — Wireshark",
    lessons: [
      L("Interface, captura e filtros no Wireshark",
        "Navegar pela interface do Wireshark e usar filtros de captura e exibição.",
        "Encapsulamento e leitura de cabeçalhos.",
        "Capturar é escolher o que entra no arquivo; filtrar é escolher o que aparece na tela.",
        "A janela principal do Wireshark tem lista de pacotes, árvore de protocolos em detalhes e painel de bytes brutos (hex dump). A captura pode ser iniciada em uma interface específica; no Linux, permissões ou capacidades são necessárias. Filtros de captura usam BPF, como 'port 53' ou 'host 10.0.0.1', e são aplicados antes de gravar. Filtros de exibição usam linguagem própria, como dns, tcp.flags.syn == 1, ip.addr == 10.0.0.1 ou http.request.method == 'GET', e podem ser alterados sem recapturar.\n\nFiltros de exibição permitem combinações com &&, || e !; expressões como tcp.port == 443 casam origem ou destino. Coloring rules ajudam a destacar erros e retransmissões, e Analyze -> Follow -> TCP Stream reconstrói a conversação a partir dos segmentos. Statistics -> Conversations e Protocol Hierarchy resumem o volume por conversa e protocolo.\n\nA distinção entre o que é simulado e o que é real é essencial nesta trilha. As capturas e quadros apresentados pela Forge são dados didáticos simulados, criados para treinar leitura de campos. Para obtê-los de verdade, é preciso capturar em ambiente controlado, com máquina própria ou autorização explícita, e tratar o arquivo como conteúdo potencialmente sensível.",
        [
          ["filtro de captura", "Expressão BPF aplicada antes da gravação, limitando quais pacotes entram no arquivo."],
          ["filtro de exibição", "Expressão do Wireshark aplicada após a captura para escolher quais pacotes aparecem."],
          ["packet details", "Painel que mostra os campos decodificados de cada camada do pacote."],
          ["hex dump", "Visão dos bytes brutos do pacote em hexadecimal e ASCII."],
          ["Follow TCP Stream", "Recurso que reúne os segmentos de uma conexão TCP em uma visão de conversação."]
        ],
        {
          ex: [["Escolha o filtro", "Para estudar DNS sem ruído, use 'port 53' como filtro de captura e 'dns' como filtro de exibição; trocar o último por 'dns.flags.rcode == 3' mostra só NXDOMAIN."], ["Leia as camadas", "No painel de detalhes, Frame mostra timestamp e tamanho; Ethernet mostra MACs; IPv4 mostra TTL e endereços; TCP mostra portas, flags e sequência."]],
          er: ["Usar sintaxe de filtro de exibição como filtro de captura.", "Achar que Follow TCP Stream descriptografa HTTPS.", "Tratar as capturas simuladas da Forge como evidência de tráfego real."],
          lab: "No simulador da Forge, aplique primeiro 'tcp' e depois 'tcp.flags.syn == 1' e compare quantos pacotes aparecem.",
          ref: "Wireshark User's Guide — https://www.wireshark.org/docs/wsug_html_chunked/; Wireshark Display Filter Reference — https://www.wireshark.org/docs/dfref/.",
          workedExamples: ["ip.addr == 192.168.1.20 && tcp.port == 443 mostra pacotes TCP daquela máquina na porta 443.", "Um arquivo pcap gravado com -w preserve todos os pacotes capturados, inclusive dados de aplicação."],
          recallQuestions: ["Qual filtro é aplicado antes da captura?", "O que o painel de bytes mostra?", "Follow TCP Stream descriptografa TLS?"],
          masteryCriteria: ["Distingue os dois tipos de filtro.", "Navega pelos três painéis.", "Afirma a natureza simulada dos exemplos."],
          tags: ["Wireshark", "filtros", "captura"],
          estimatedEffort: 30
        }),

      L("Laboratórios 1 e 2: consulta DNS e handshake TCP",
        "Executar os laboratórios 1 e 2 observando DNS e a abertura de uma conexão TCP.",
        "Filtros do Wireshark, DNS e handshake TCP.",
        "Os dois primeiros laboratórios mostram uma pergunta de nome e o diálogo que abre uma conversação confiável.",
        "Laboratório 1 — capturar consulta DNS. Em ambiente controlado, limpe o cache DNS do sistema, inicie a captura com filtro 'udp.port == 53 || tcp.port == 53' e acesse um nome de domínio. Identifique a Question com o nome consultado, o ID da transação, flags RD/RA e a Answer com tipo, TTL e endereço. Compare o endereço devolvido com o usado na conexão seguinte. Dados simulados da Forge servem para treinar a leitura; não são captura real.\n\nLaboratório 2 — observar handshake TCP. Filtre por tcp.flags.syn == 1 || tcp.flags.reset == 1 ou use a conversa com o endereço descoberto no lab anterior. Localize SYN com ISN e MSS, SYN-ACK com ISN do servidor e ACK final. Confira seq e ack de cada mensagem, o campo window e o fato de que o handshake consome um número de sequência de cada lado. Follow TCP Stream mostra os dados depois do handshake, não o handshake em si.\n\nCritérios de conclusão: nomear cada campo observado, explicar a relação entre DNS e TCP e reconstruir a ordem das três mensagens. Nenhum laboratório nesta trilha deve ser executado contra rede de terceiros sem autorização.",
        [
          ["lab 1 DNS", "Laboratório de captura e interpretação de uma consulta e resposta DNS."],
          ["lab 2 handshake", "Laboratório de observação de SYN, SYN-ACK e ACK no Wireshark."],
          ["Question DNS", "Seção da mensagem DNS que contém o nome consultado, tipo e classe."],
          ["ISN", "Número de sequência inicial escolhido por cada lado no handshake."],
          ["MSS", "Opção TCP anunciada no SYN que limita o tamanho dos dados por segmento."]
        ],
        {
          ex: [["Lab 1", "Question: www.example.com, tipo A; Answer: www.example.com, TTL 300, A 203.0.113.10; RD=1 e RA=1 indicam recursão pedida e oferecida."], ["Lab 2", "SYN seq=1000 MSS=1460; SYN-ACK seq=5000 ack=1001 MSS=1460; ACK ack=5001. O primeiro byte de dados do cliente virá em seq=1001."]],
          er: ["Procurar o handshake dentro de Follow TCP Stream, que mostra dados de aplicação.", "Ignorar o TTL da resposta DNS.", "Executar captura em rede compartilhada sem autorização."],
          lab: "Simulação: na captura didática da Forge, marque a resposta DNS e as três mensagens do handshake, preenchendo seq e ack de cada uma.",
          ref: "Kurose & Ross, Wireshark Labs: DNS e TCP (https://www-net.cs.umass.edu/kurose_ross/wireshark.htm); Wireshark User's Guide.",
          workedExamples: ["Se o cache DNS já tem o registro, o laboratório 1 não mostra a consulta: limpe o cache ou use um nome novo.", "Um SYN retransmitido aparece com o mesmo ISN e intervalo crescente."],
          recallQuestions: ["Quais campos da Answer DNS você observou?", "Qual opção aparece no SYN?", "Por que o ACK do SYN é x+1?"],
          masteryCriteria: ["Identifica Question e Answer.", "Reconstroi SYN, SYN-ACK e ACK.", "Explica a relação entre os labs."],
          tags: ["Wireshark", "DNS", "handshake"],
          estimatedEffort: 40
        }),

      L("Laboratórios 3 e 4: TLS e HTTP versus HTTPS",
        "Analisar uma conexão TLS e comparar o que é visível em HTTP e HTTPS.",
        "Handshake TCP, TLS conceitual e cabeçalhos HTTP.",
        "O mesmo navegador pode gerar tráfego muito diferente no Wireshark, dependendo de TLS estar ativo.",
        "Laboratório 3 — analisar conexão TLS. Filtre TCP pelo port 443 e localize ClientHello e ServerHello. Observe versão TLS, cipher suites oferecidas e escolhida, extensões como SNI e ALPN e a cadeia de certificados enviada pelo servidor. Em TLS 1.3, boa parte das mensagens após o key share aparece criptografada; o analista vê registros TLS Application Data, não headers HTTP em claro. Isso é esperado, não falha da captura.\n\nLaboratório 4 — comparar HTTP e HTTPS em ambiente controlado. Acesse uma página HTTP e outra HTTPS em servidores de teste próprios ou autorizados. No caso HTTP, o Wireshark decodifica request line, Host, cookies e corpo; no caso HTTPS, decodifica apenas TCP e TLS, enquanto os bytes HTTP ficam dentro de Application Data. A forma correta de ver headers em HTTPS é exportar a chave de sessão do navegador, quando o ambiente permite, ou usar a saída do curl -v no cliente; não é 'ativar um filtro mágico'.\n\nNos dois labs, os exemplos da Forge são capturas simuladas. Em captura real, cookies e tokens aparecem em claro no HTTP e devem ser tratados como segredos. A comparação ensina uma lição de segurança: criptografia de transporte muda radicalmente o que um observador da rede consegue ler.",
        [
          ["lab 3 TLS", "Laboratório de leitura de ClientHello, ServerHello e certificados no Wireshark."],
          ["lab 4 HTTP/HTTPS", "Laboratório comparativo do que é visível com e sem TLS."],
          ["ClientHello", "Primeira mensagem TLS do cliente com versão, suites e extensões."],
          ["Application Data", "Registro TLS que transporta dados criptografados de aplicação."],
          ["SNI", "Extensão TLS que informa o nome de host desejado antes da criptografia completa."]
        ],
        {
          ex: [["Lab 3", "ClientHello oferece TLS 1.3 e ALPN h2; ServerHello escolhe h2; a seguir aparecem Certificate e depois Application Data criptografado."], ["Lab 4", "HTTP mostra 'GET / HTTP/1.1' e 'Host: teste.local'; HTTPS mostra apenas registros Application Data dentro da conexão TCP/443."]],
          er: ["Achar que o Wireshark consegue ler headers HTTPS sem chaves ou exportação de segredo.", "Confundir SNI com o conteúdo da requisição HTTP.", "Capturar sites de terceiros achando que é apenas 'estudo'."],
          lab: "Simulação: compare duas capturas didáticas da Forge e liste quais campos aparecem em HTTP claro que desaparecem em HTTPS.",
          ref: "Wireshark User's Guide, seção de TLS — https://www.wireshark.org/docs/wsug_html_chunked/; RFC 8446; Kurose & Ross, Wireshark Labs.",
          workedExamples: ["Em TLS 1.2, mais mensagens do handshake são visíveis do que em TLS 1.3; em ambos, o corpo HTTP permanece protegido.", "Exportar SSLKEYLOGFILE do navegador permite ao Wireshark descriptografar capturas feitas no próprio cliente."],
          recallQuestions: ["O que ClientHello anuncia?", "Por que HTTP aparece legível e HTTPS não?", "O que SNI revela?"],
          masteryCriteria: ["Identifica ClientHello e certificados.", "Explica Application Data.", "Diferencia o que é visível nos dois casos."],
          tags: ["Wireshark", "TLS", "HTTPS"],
          estimatedEffort: 45
        }),

      L("Laboratório 5: identificar retransmissões",
        "Reconhecer retransmissões por RTO e por ACKs duplicados em uma captura.",
        "Sequência, ACK e recuperação de perdas no TCP.",
        "O Wireshark mostra o sintoma: o mesmo número de sequência voltando a aparecer.",
        "Laboratório 5 — identificar retransmissões. Em uma captura didática, filtre tcp e procure pacotes com o mesmo sequence number e mesmo payload enviados mais de uma vez. O Wireshark costuma rotular 'TCP Retransmission' quando o intervalo excede o RTO estimado e 'TCP Fast Retransmission' quando há ACKs duplicados suficientes. Também aparecem 'Dup ACK' e, quando ativados, blocos SACK.\n\nA interpretação começa pela ordem: se o segmento 2001-3000 reaparece após três ACKs com ack=2001, a causa provável é perda daquele segmento e recuperação rápida. Se reaparece após um intervalo maior, sem ACKs duplicados, o remetente provavelmente esperou o RTO. Retransmissões podem indicar perda real, congestionamento, rota assimétrica que derruba respostas, ou até captura feita em ponto que não vê todos os pacotes.\n\nO painel Expert Information resume eventos por severidade; Statistics -> TCP Stream Graphs mostra sequência no tempo e ajuda a visualizar saltos e retransmissões. Não presuma que toda retransmissão é culpa da aplicação: ela é mecanismo normal de recuperação. Para investigar, cruze o horário com mudanças de rota, filas no ss e sinais de congestionamento.",
        [
          ["lab 5 retransmissões", "Laboratório de identificação de reenvios e ACKs duplicados em captura."],
          ["Retransmission", "Rótulo do Wireshark para segmento reenviado após timeout ou suspeita de perda."],
          ["Dup ACK", "Confirmação repetida do mesmo próximo byte esperado."],
          ["Expert Information", "Painel do Wireshark que agrupa eventos e avisos da captura."],
          ["sequência repetida", "Sinal característico de retransmissão: mesmo seq e dados aparecendo outra vez."]
        ],
        {
          ex: [["Retransmissão rápida", "Segmento seq=2001 aparece, três ACKs com ack=2001 chegam, e o mesmo segmento reaparece 12 ms depois com rótulo fast retransmission."], ["RTO", "Segmento seq=5001 enviado às 10:00:00.100 reaparece às 10:00:00.400, sem ACKs duplicados: espera de timeout."]],
          er: ["Achar que retransmissão sempre indica bug da aplicação.", "Ignorar ACKs duplicados ao classificar a causa.", "Supor que a captura mutilada mostra todos os pacotes da rede."],
          lab: "Simulação: na captura didática da Forge, marque uma retransmissão e classifique como RTO ou fast retransmission justificando com os ACKs.",
          ref: "Wireshark User's Guide, seção TCP — https://www.wireshark.org/docs/wsug_html_chunked/; RFC 5681; RFC 6298.",
          workedExamples: ["SACK permite ao receptor dizer 'recebi 2001-3000 e 4001-5000, falta 3001-4000', evitando reenviar blocos já presentes.", "Uma captura feita no servidor pode não mostrar o pacote perdido antes do roteador, mas mostra a retransmissão chegando."],
          recallQuestions: ["O que identifica uma retransmissão?", "O que três ACKs duplicados sugerem?", "O que Expert Information oferece?"],
          masteryCriteria: ["Localiza sequência repetida.", "Distingue RTO de fast retransmit.", "Cita causas possíveis sem culpabilidade automática."],
          tags: ["Wireshark", "TCP", "retransmissão"],
          estimatedEffort: 35
        }),

      L("Laboratórios 6 e 7: MTU e ARP",
        "Investigar MTU com mensagens ICMP e observar ARP em uma captura.",
        "Encapsulamento, Ethernet, ICMP e tabela de vizinhos.",
        "Um laboratório explica por que pacotes grandes morrem; o outro mostra como o IP encontra o MAC.",
        "Laboratório 6 — investigar MTU. Em ambiente controlado, envie pacotes com tamanhos crescentes e DF (Don't Fragment) ligado, por exemplo ping -M do -s 1472 destino em IPv4 com MTU 1500: 1472 bytes de dados + 8 ICMP + 20 IP = 1500. Se um enlace no caminho tiver MTU menor, o roteador devolve ICMP Destination Unreachable com code 4 (fragmentation needed) e informa o MTU. No Wireshark, procure essas mensagens e compare o tamanho do frame com o MTU esperado. A origem então reduz o tamanho: é a PMTUD. Em túneis, o overhead reduz o MTU efetivo.\n\nLaboratório 7 — observar ARP. Com filtro 'arp' em rede local, identifique ARP Request em broadcast ff:ff:ff:ff:ff:ff perguntando 'who has 192.168.1.1? tell 192.168.1.20' e ARP Reply unicast com '192.168.1.1 is at aa:bb:cc:dd:ee:ff'. Confira com ip neigh no Linux. Em IPv6, o equivalente é NDP: NS e NA usando ICMPv6 e multicast solicited-node; não procure ARP lá. Respostas ARP não autenticadas explicam ataques de spoofing.\n\nAmbos usam dados simulados na Forge. A captura real deve ocorrer apenas em rede própria ou autorizada, e o laboratório de MTU não deve ser usado para testar aleatoriamente hosts de terceiros.",
        [
          ["lab 6 MTU", "Laboratório que usa DF e ICMP para descobrir o maior pacote que atravessa o caminho."],
          ["lab 7 ARP", "Laboratório de observação de request em broadcast e reply unicast."],
          ["DF", "Flag IPv4 que proíbe fragmentação e provoca ICMP fragmentation needed."],
          ["ARP Request", "Mensagem em broadcast que pergunta qual MAC possui determinado IPv4."],
          ["PMTUD", "Descoberta da MTU do caminho pela origem, usando mensagens ICMP de pacote grande."]
        ],
        {
          ex: [["Lab 6", "ping -M do -s 1472 funciona em MTU 1500; com -s 1500 e DF, o roteador devolve fragmentation needed e o Ping falha — o problema é tamanho, não host fora."], ["Lab 7", "ARP Request: who has 192.168.1.1? tell 192.168.1.20; Reply: 192.168.1.1 is at aa:bb:cc:dd:ee:ff; ip neigh passa a mostrar REACHABLE."]],
          er: ["Esquecer que ICMP e cabeçalhos contam no cálculo do tamanho do pacote.", "Fazer ARP de um endereço fora da sub-rede local.", "Procurar ARP em captura IPv6."],
          lab: "Simulação: na captura didática da Forge, associe cada mensagem ICMP fragmentation needed ao tamanho que a origem deve usar depois.",
          ref: "RFC 792; RFC 1191 (PMTUD IPv4); RFC 8201 (PMTUD IPv6); RFC 826; RFC 4861; man7.org: ping(8).",
          workedExamples: ["Em um túnel que adiciona 24 bytes de cabeçalho, um pacote IPv4 de 1500 bytes precisa ser reduzido para 1476 para caber no enlace físico de 1500.", "Gratuitous ARP anuncia o próprio IP para detectar conflitos ou atualizar caches de vizinhos."],
          recallQuestions: ["Qual flag do IPv4 proíbe fragmentação?", "Qual mensagem informa MTU insuficiente?", "Como o ARP descobre o MAC do gateway?"],
          masteryCriteria: ["Calcula tamanho com cabeçalhos.", "Interpreta ICMP fragmentation needed.", "Distingue ARP de NDP."],
          tags: ["Wireshark", "MTU", "ARP"],
          estimatedEffort: 45
        })
    ]
  },
  {
    name: "R11 — Sockets em C",
    lessons: [
      L("Servidor TCP: socket, setsockopt, bind, listen, accept",
        "Montar a sequência de chamadas de um servidor TCP em C e tratar erros basicamente.",
        "C, ponteiros, descritores de arquivo e modelo cliente-servidor.",
        "O servidor abre uma porta, anuncia disponibilidade e aceita conexões uma a uma ou com concorrência.",
        "A sequência é socket() -> setsockopt() quando apropriado -> bind() -> listen() -> accept() -> recv()/read() -> send()/write() -> shutdown() -> close(). socket(AF_INET, SOCK_STREAM, 0) cria um descritor TCP IPv4; AF_INET6 e sockaddr_in6 fazem o equivalente em IPv6. SO_REUSEADDR antes do bind permite reabrir a porta rapidamente após reinício, sem confundir com compartilhamento mágico de listeners.\n\nbind() associa endereço local e porta. INADDR_ANY (0.0.0.0) escuta todas as interfaces; 127.0.0.1 apenas loopback. htons() converte a porta para network byte order. listen() transforma o socket em passivo e recebe um backlog: o limite de conexões pendentes aceitas pelo kernel, não o número máximo de clientes simultâneos.\n\naccept() bloqueia até que uma conexão seja estabelecida e devolve um novo descritor para aquele cliente; o socket de escuta continua ativo. Cada chamada que pode falhar deve ser verificada: socket retorna -1, bind pode falhar com EADDRINUSE, accept com EINTR. O código precisa tratar errno e fechar descritores em todos os caminhos de saída, inclusive nos de erro.",
        [
          ["socket", "Chamada que cria um ponto de comunicação e devolve um descritor."],
          ["bind", "Chamada que associa o socket a um endereço e porta locais."],
          ["listen", "Chamada que coloca o socket TCP em modo de escuta com fila de pendentes."],
          ["accept", "Chamada que retira uma conexão da fila e devolve um descritor por cliente."],
          ["backlog", "Limite de conexões pendentes mantidas pelo kernel antes de accept."]
        ],
        {
          ex: [["Ordem correta", "int s = socket(AF_INET, SOCK_STREAM, 0); setsockopt(s, SOL_SOCKET, SO_REUSEADDR, &sim, sizeof sim); bind(s, ...); listen(s, 16); int c = accept(s, ...);"], ["Erro típico", "bind falha com EADDRINUSE quando outro processo já escuta a mesma combinação de endereço e porta."]],
          er: ["Chamar listen antes do bind.", "Achar que backlog limita o número total de clientes conectados.", "Ignorar o valor de retorno de accept e continuar com descritor inválido."],
          lab: "Simulação: escreva em papel a sequência de chamadas do servidor e ao lado o que acontece se cada uma falhar.",
          ref: "Beej's Guide to Network Programming — https://beej.us/guide/bgnet/; man7.org: socket(2), bind(2), listen(2), accept(2); The Linux Programming Interface, cap. 56.",
          workedExamples: ["SO_REUSEADDR ajuda após um reinício rápido porque evita que portas em TIME_WAIT bloqueiem o bind, mas não permite dois listeners idênticos simultâneos.", "accept preenche sockaddr_in com o IP e a porta efêmera do cliente quando se passa um ponteiro válido."],
          recallQuestions: ["Qual chamada cria o socket?", "O que backlog controla?", "O que accept devolve?"],
          masteryCriteria: ["Ordena corretamente as chamadas.", "Explica bind, listen e accept.", "Verifica erros e fecha descritores."],
          tags: ["C", "sockets", "servidor TCP"],
          estimatedEffort: 40
        }),

      L("Cliente TCP: getaddrinfo, socket, connect, send, recv, close",
        "Implementar um cliente TCP independente de IPv4 ou IPv6 usando getaddrinfo.",
        "Servidor TCP e noção de endereço de rede.",
        "O cliente não deve assumir que o nome resolve para IPv4: getaddrinfo entrega uma lista de candidatos.",
        "getaddrinfo(host, porta, &hints, &res) preenche uma lista ligada de addrinfo. Em hints, ai_family pode ser AF_UNSPEC, ai_socktype SOCK_STREAM e ai_flags AI_ADDRCONFIG; percorrer a lista permite tentar IPv6 e IPv4 conforme a disponibilidade. Para cada candidato, chama-se socket(res->ai_family, res->ai_socktype, res->ai_protocol) e connect() com res->ai_addr e res->ai_addrlen. Se connect falha, tenta o próximo candidato.\n\nDepois de conectado, send() e recv() operam sobre o descritor. Em TCP, o limite de uma chamada não é uma mensagem da aplicação: send pode aceitar menos bytes do que o pedido e recv pode devolver menos do que o enviado pelo peer. close() encerra o descritor; shutdown(SHUT_WR) permite meio-fechamento quando o protocolo pede aviso de fim de envio.\n\nA porta local normalmente é escolhida pelo kernel como porta efêmera. O tratamento de erros é parte do protocolo: ECONNREFUSED indica ninguém escutando, ETIMEDOUT pode indicar filtro descartando, ENETUNREACH problemas de rota e EAI_* erros de resolução. freeaddrinfo() libera a lista ao final.",
        [
          ["getaddrinfo", "Função que converte nome e serviço em uma lista de endereços prontos para socket."],
          ["addrinfo", "Estrutura com família, tipo, protocolo, endereço e comprimento de um candidato."],
          ["connect", "Chamada que estabelece a conexão TCP com o endereço escolhido."],
          ["porta efêmera", "Porta temporária escolhida pelo kernel para o lado cliente."],
          ["freeaddrinfo", "Função que libera a memória alocada por getaddrinfo."]
        ],
        {
          ex: [["Loop de candidatos", "getaddrinfo retorna primeiro um AAAA e depois um A; connect no AAAA falha com ENETUNREACH, então o código tenta o A."], ["Erro interpretado", "connect retorna -1 e errno ECONNREFUSED: o endereço foi alcançado, mas não havia listener na porta."]],
          er: ["Assumir que getaddrinfo devolve sempre um único IPv4.", "Esquecer freeaddrinfo.", "Achar que send devolveu todos os bytes só porque não houve erro."],
          lab: "Simulação: escreva o fluxo do cliente com dois candidatos de endereço e indique onde a tentativa seguinte é feita.",
          ref: "man7.org: getaddrinfo(3), socket(2), connect(2), send(2), recv(2), close(2); Beej's Guide to Network Programming.",
          workedExamples: ["hints.ai_family = AF_UNSPEC permite tanto AF_INET quanto AF_INET6; AI_ADDRCONFIG evita candidatos de famílias sem configuração local.", "Após connect com sucesso, getpeername() permite descobrir qual endereço foi efetivamente usado."],
          recallQuestions: ["O que getaddrinfo devolve?", "O que connect faz?", "Por que verificar o retorno de send?"],
          masteryCriteria: ["Percorre a lista de addrinfo.", "Trata erros de connect.", "Libera recursos corretamente."],
          tags: ["C", "cliente TCP", "getaddrinfo"],
          estimatedEffort: 40
        }),

      L("Retorno parcial, EINTR, timeouts e desconexão",
        " Escrever loops corretos de leitura e escrita e reagir a interrupções e timeouts.",
        "send, recv e estados TCP.",
        "Uma chamada bem-sucedida não significa que a mensagem inteira foi transferida.",
        "recv() devolve o número de bytes lidos, 0 quando o peer encerrou de forma ordenada e -1 em erro. send() devolve quantos bytes foram aceitos no buffer do kernel, podendo ser menor que o pedido. Por isso um envio confiável usa um loop que avança o ponteiro e decrementa o restante até zero; uma leitura exata semelhante precisa repetir recv até completar o tamanho desejado ou detectar fim de conexão.\n\nChamadas bloqueantes podem ser interrompidas por sinal: retornam -1 com errno EINTR. A atitude correta é repetir a chamada, não tratá-la como falha de rede. Para não bloquear indefinidamente, use SO_RCVTIMEO e SO_SNDTIMEO (que retornam EAGAIN/EWOULDBLOCK), ou select()/poll()/epoll com prazo explícito. Em modo não bloqueante, EAGAIN significa 'tente depois'.\n\nEscrever em um socket cujo peer fechou pode gerar SIGPIPE e EPIPE; aplicações servidoras costumam ignorar SIGPIPE e tratar EPIPE como erro de conexão. A detecção de desconexão é recv==0, enquanto RST costuma aparecer como ECONNRESET. Timeouts e meio-fechamento fazem parte do protocolo da aplicação: documente quem fecha primeiro e o que acontece se o peer morrer no meio de uma mensagem.",
        [
          ["retorno parcial", "Situação em que send ou recv transferem menos bytes do que os solicitados."],
          ["EINTR", "Erro-indicador de que uma chamada foi interrompida por sinal e deve ser repetida."],
          ["EAGAIN", "Erro que indica ausência temporária de dados ou espaço em socket não bloqueante ou com timeout."],
          ["SIGPIPE", "Sinal enviado ao processo que escreve em um socket sem leitor, frequentemente ignorado."],
          ["recv igual a zero", "Indicação de encerramento ordenado pelo peer, não de erro."]
        ],
        {
          ex: [["Loop de envio", "Enviar 1000 bytes com send retornando 400, 350 e 250: o ponteiro avança a cada vez até restante=0; não basta uma chamada."], ["EINTR", "recv retorna -1 com errno EINTR porque SIGCHLD chegou: repita recv; não feche a conexão."]],
          er: ["Tratar recv==0 como erro em vez de fim de conexão.", "Abortar a operação ao ver EINTR.", "Achar que SO_RCVTIMEO torna o socket não bloqueante: ele apenas impõe prazo."],
          lab: "Simulação: complete um loop de envio para 1000 bytes com retornos parciais 400, 350 e 250 e indique o valor final do ponteiro.",
          ref: "man7.org: recv(2), send(2), errno(3), signal(7), socket(7), poll(2); The Linux Programming Interface, cap. 63.",
          workedExamples: ["Com SO_RCVTIMEO de 5 segundos, recv sem dados retorna -1 e errno EAGAIN após o prazo.", "Ignorar SIGPIPE com signal(SIGPIPE, SIG_IGN) permite tratar EPIPE como qualquer outro erro de escrita."],
          recallQuestions: ["O que significa recv==0?", "O que fazer com EINTR?", "Como impor prazo em recv?"],
          masteryCriteria: ["Implementa loop de envio parcial.", "Repete chamadas interrompidas.", "Distingue EOF, timeout e reset."],
          tags: ["C", "sockets", "EINTR"],
          estimatedEffort: 45
        }),

      L("Framing, protocolo e limites de buffer",
        "Definir onde uma mensagem termina e proteger o parser contra entradas malformadas.",
        "Retorno parcial e conceito de protocolo de aplicação.",
        "TCP é um fluxo de bytes: sem framing, duas mensagens colam ou uma mensagem chega pela metade.",
        "Framing é a regra que delimita mensagens. Opções comuns: prefixo de comprimento fixo, por exemplo 4 bytes big-endian com o tamanho do payload; delimitador como nova linha, desde que escapado quando aparecer dentro dos dados; ou mensagens de tamanho fixo. O receptor precisa manter um buffer acumulado, pois uma chamada recv pode trazer metade de uma mensagem, uma mensagem inteira ou várias. O parser consome quadros completos e preserva o resto para a próxima leitura.\n\nO formato deve ser explícito: use htonl()/ntohl() para o prefixo de comprimento, defina codificação de caracteres e documente a versão do protocolo. Limites são obrigatórios: recusar quadros maiores que um tamanho máximo evita alocação descontrolada por entrada maliciosa. Campos de comprimento precisam ser validados antes de malloc e antes de copiar; nunca confie que o peer enviou valores razoáveis.\n\nEm UDP, cada datagrama já é uma unidade, mas ainda há limite prático de tamanho e necessidade de ordenação se ela importar. Em TCP, a aplicação também precisa definir o que acontece com mensagens desconhecidas, timeouts de protocolo e desconexão no meio de um quadro. Um protocolo bem especificado reduz ambiguidade e torna os testes possíveis.",
        [
          ["framing", "Regra que define os limites de cada mensagem em um fluxo de bytes."],
          ["prefixo de comprimento", "Campo no início do quadro que informa quantos bytes de payload se seguem."],
          ["htonl", "Função que converte inteiro de 32 bits da ordem local para a ordem de rede."],
          ["buffer acumulado", "Área que guarda bytes recebidos ainda não processados pelo parser."],
          ["limite de quadro", "Tamanho máximo aceito para uma mensagem, usado para evitar abuso de memória."]
        ],
        {
          ex: [["Duas mensagens em uma leitura", "recv devolve 4 bytes de comprimento, 5 bytes da mensagem A e mais 4+7 de B; o parser extrai A, extrai B e deixa zero bytes pendentes."], ["Mensagem dividida", "A primeira recv traz apenas 2 dos 4 bytes do prefixo: o código espera mais dados antes de interpretar o comprimento."]],
          er: ["Assumir que uma recv corresponde a uma mensagem lógica.", "Alocar memória usando comprimento informado pelo peer sem limite.", "Esquecer conversão de byte order em protocolos multiplataforma."],
          lab: "Simulação: dado um stream com quadros [len=3][abc][len=2][ok], indique quantos quadros completos uma leitura de 6 bytes permite extrair.",
          ref: "Beej's Guide to Network Programming; man7.org: htonl(3), recv(2); The Linux Programming Interface, cap. 63.",
          workedExamples: ["Com max_frame=4096 e comprimento recebido 1000000, o servidor deve fechar a conexão ou descartar o quadro antes de alocar.", "Delimitador '\\n' exige escapar quebras de linha dentro do payload ou codificá-lo em base64."],
          recallQuestions: ["Por que TCP precisa de framing?", "O que faz htonl?", "Qual risco um comprimento não validado representa?"],
          masteryCriteria: ["Extrai quadros de buffer parcial.", "Valida comprimento antes de alocar.", "Justifica a ordem de rede."],
          tags: ["C", "framing", "protocolo"],
          estimatedEffort: 45
        }),

      L("shutdown, close, erros e concorrência",
        "Encerrar conexões corretamente e escolher um modelo de concorrência para o servidor.",
        "Estados TCP, accept e loops de E/S.",
        "Fechar bem é parte do protocolo; atender vários clientes exige uma estratégia explícita.",
        "shutdown(fd, SHUT_WR) envia FIN e permite continuar lendo a resposta do peer; SHUT_RD desativa a leitura local, e SHUT_RDWR combina os dois. close() libera o descritor, mas pode não enviar FIN imediatamente se ainda houver referências ao descritor, como após fork ou dup. Encerrar com dados não lidos no buffer pode gerar RST em vez de FIN, surpreendendo o peer.\n\nCada syscall tem erros que fazem parte do desenho: EADDRINUSE no bind, EMFILE quando o processo esgota descritores, ECONNRESET quando o peer aborta, ETIMEDOUT após falha de prazo. Registrar errno com contexto facilita diagnóstico. Um servidor robusto fecha o descritor do cliente em todos os ramos e usa SIGCHLD com waitpid ou um loop de eventos para evitar processos zumbis.\n\nModelos comuns: fork por conexão, simples e isolado, porém caro; thread por conexão, com memória compartilhada e necessidade de sincronização; pool de threads com fila de tarefas; e event loop com poll/epoll para muitos sockets não bloqueantes. A escolha depende do número de conexões, da CPU e da complexidade do estado compartilhado. Laboratórios de sockets devem usar loopback ou máquinas próprias; testes em redes alheias exigem autorização.",
        [
          ["shutdown", "Chamada que encerra uma direção da comunicação sem necessariamente fechar o descritor."],
          ["close", "Chamada que libera o descritor do processo."],
          ["ECONNRESET", "Erro indicando que o peer abortou a conexão com RST."],
          ["epoll", "Mecanismo do Linux para monitorar muitos descritores com escalabilidade."],
          ["processo zumbi", "Processo filho terminado cujo pai ainda não coletou o status com wait."]
        ],
        {
          ex: [["Meio-fechamento", "O cliente envia o pedido, chama shutdown(SHUT_WR), lê a resposta inteira e só depois close: o servidor recebe FIN e ainda pode responder."], ["Muitos clientes", "Com epoll, um único thread registra os sockets e processa apenas os que ficaram prontos, evitando um thread por conexão."]],
          er: ["Supor que close sempre equivale a FIN gracefully.", "Esquecer waitpid e acumular zumbis.", "Compartilhar estado entre threads sem sincronização."],
          lab: "Simulação: num diagrama, mostre um cliente que chama shutdown(SHUT_WR), recebe a resposta e só depois fecha o descritor.",
          ref: "man7.org: shutdown(2), close(2), waitpid(2), epoll(7), errno(3); Beej's Guide to Network Programming.",
          workedExamples: ["Após fork, ambos os processos têm o descritor; o FIN é enviado quando a última referência é fechada.", "Se o servidor fecha com dados ainda não lidos, o peer pode ver ECONNRESET em vez de EOF limpo."],
          recallQuestions: ["O que SHUT_WR faz?", "O que ECONNRESET indica?", "Quando usar epoll?"],
          masteryCriteria: ["Distingue shutdown de close.", "Trata erros com contexto.", "Compara modelos de concorrência."],
          tags: ["C", "sockets", "concorrência"],
          estimatedEffort: 40
        })
    ]
  },
  {
    name: "R12 — Segurança de rede",
    lessons: [
      L("Superfície de ataque, ameaças e propriedades de segurança",
        "Modelar ameaças e relacioná-las com autenticação, autorização, confidencialidade, integridade e disponibilidade.",
        "Protocolos das camadas 2 a 7 e noção de firewall.",
        "Segurança não é um produto único: é a escolha de quais bens proteger, contra quem e com que custo.",
        "Superfície de ataque é o conjunto de pontos pelos quais um agente não autorizado pode interagir com o sistema: portas abertas, APIs, formulários, credenciais, dependências e configurações. Ameaças comuns incluem sniffing, spoofing, interceptação no meio do caminho, força bruta, injeção, negação de serviço e abuso de permissões excessivas.\n\nAs propriedades clássicas são confidencialidade (informação não vazia para quem não deve ler), integridade (dados não são alterados sem autorização) e disponibilidade (o serviço continua acessível quando necessário). Autenticação responde 'quem é você?'; autorização responde 'o que você pode fazer?'. Responder a pergunta errada gera falhas mesmo com criptografia forte: um certificado válido não autoriza um usuário a apagar dados de outro.\n\nUm modelo de ameaças lista ativos, fronteiras, agentes e canais de ataque antes de escolher controles. Nem toda ameaça merece o mesmo investimento: probabilidade, impacto e custo do controle orientam a decisão. O princípio do menor privilégio limita o dano de uma conta ou token comprometido, e a defesa em profundidade evita que uma única barreira seja o ponto único de falha.",
        [
          ["superfície de ataque", "Conjunto de interfaces e pontos de entrada pelos quais o sistema pode ser atacado."],
          ["autenticação", "Verificação da identidade de um usuário, host ou serviço."],
          ["autorização", "Decisão sobre quais ações uma identidade autenticada pode executar."],
          ["CIA", "Tríade confidencialidade, integridade e disponibilidade."],
          ["menor privilégio", "Princípio de conceder apenas as permissões necessárias, pelo menor tempo possível."]
        ],
        {
          ex: [["Serviço web", "Superfície: porta 443, formulário de login, API e painel administrativo. Ameaças: credential stuffing, XSS e DDoS; controles: MFA, sanitização, rate limit e WAF."], ["Erro conceitual", "Um atacante autenticado como usuário comum consegue ler relatórios de outro usuário: autenticação funcionou, autorização falhou."]],
          er: ["Achar que criptografia resolve autorização.", "Proteger apenas a borda externa e confiar em toda a rede interna.", "Começar a comprar ferramentas sem listar ativos e ameaças."],
          lab: "Simulação: liste cinco ativos de um servidor de aulas, seus canais de acesso e uma ameaça para cada um.",
          ref: "RFC 3552 (considerações de segurança em RFCs); OWASP Top 10 — https://owasp.org/www-project-top-ten/; NIST SP 800-30 (guia de avaliação de riscos).",
          workedExamples: ["STRIDE categoriza ameaças em spoofing, tampering, repudiation, information disclosure, denial of service e elevation of privilege.", "Um token de API com escopo somente de leitura reduz impacto se vazar."],
          recallQuestions: ["O que distingue autenticação de autorização?", "O que é superfície de ataque?", "O que significa integridade?"],
          masteryCriteria: ["Lista ameaças por ativo.", "Distingue as propriedades CIA.", "Aplica menor privilégio a um exemplo."],
          tags: ["segurança", "ameaças", "CIA"],
          estimatedEffort: 25
        }),

      L("Firewall e segmentação de rede",
        "Projetar filtragem de tráfego e separação de redes para reduzir movimento lateral.",
        "Portas, protocolos, tabelas de rotas e VLANs.",
        "Firewall decide o que atravessa; segmentação decide até onde um invasor consegue chegar depois de entrar.",
        "Um firewall pode ser packet filtering, quando avalia endereços, portas e protocolos, ou stateful, quando acompanha o estado da conexão e permite respostas a fluxos iniciados internamente. No Linux, nftables é a interface moderna; iptables e ufw ainda aparecem em muitos sistemas. A postura recomendada é negar por padrão e liberar explicitamente o necessário, com regras documentadas e testes de validação.\n\nSegmentação separa redes com VLANs, sub-redes, VRFs ou zonas de firewall. Um padrão comum é DMZ para serviços públicos, rede de servidores internos e rede de usuários, com regras que limitam o tráfego entre elas. Assim, comprometer um host de convidados não dá acesso direto ao banco de dados. A segmentação também reduz broadcast e facilita aplicar políticas diferentes por zona.\n\nFirewalls não substituem controle de aplicação: portas 80 e 443 precisam estar abertas para o serviço público, e ataques chegam dentro desse tráfego permitido. IDS/IPS complementam a detecção, e logs de regras ajudam a entender tentativas. Toda mudança de firewall deve ser planejada com janela de manutenção, rollback e verificação a partir de hosts autorizados.",
        [
          ["firewall stateful", "Firewall que controla pacotes segundo o estado da conexão, não apenas regras estáticas."],
          ["nftables", "Subsistema de filtragem de pacotes do Linux que substitui iptables na maioria das distribuições atuais."],
          ["DMZ", "Rede separada para serviços expostos ao público, isolada da rede interna."],
          ["movimento lateral", "Progresso de um atacante de um host comprometido para outros sistemas internos."],
          ["default deny", "Política que bloqueia todo tráfego não explicitamente permitido."]
        ],
        {
          ex: [["Regra mínima", "Permitir TCP/443 de qualquer origem para o servidor web e negar todo o resto reduz superfície, mas não protege contra vulnerabilidade na aplicação web."], ["Segmentação", "VLAN de convidados não alcança a VLAN de servidores; apenas o proxy reverso na DMZ conversa com a aplicação."]],
          er: ["Abrir portas 'temporariamente' e nunca removê-las.", "Achar que firewall substitui autenticação e patches.", "Aplicar mudanças em firewall remoto sem caminho de recuperação."],
          lab: "Simulação: desenhe três zonas e escreva uma matriz de permissões indicando qual zona pode iniciar conexão para qual outra.",
          ref: "man7.org: nft(8), iptables(8), ufw(8); RFC 2977; NIST SP 800-41 (firewalls).",
          workedExamples: ["Regra stateful permite que a resposta de uma conexão iniciada internamente entre sem uma regra explícita de retorno.", "Um host na DMZ comprometido não deve conseguir iniciar conexões administrativas para a rede interna."],
          recallQuestions: ["O que significa default deny?", "Como a segmentação limita dano?", "Por que firewall não basta?"],
          masteryCriteria: ["Explica filtragem stateful.", "Desenha zonas com regras claras.", "Reconhece limites do firewall."],
          tags: ["firewall", "segmentação", "DMZ"],
          estimatedEffort: 30
        }),

      L("TLS, DNSSEC e VPN",
        "Comparar mecanismos de proteção de transporte, autenticidade de DNS e túneis privados.",
        "DNS, TLS e encapsulamento.",
        "Cada mecanismo protege um trecho diferente: aplicação, dados DNS ou conexão entre redes.",
        "TLS protege a comunicação entre cliente e ponto de terminação, oferecendo confidencialidade, integridade e autenticação do servidor via certificados. mTLS acrescenta autenticação do cliente, comum entre serviços. A proteção vale até onde a criptografia é encerrada: em proxies ou balanceadores, o trecho seguinte pode precisar de TLS próprio.\n\nDNSSEC assina resource records com chaves da zona e permite ao resolvedor verificar origem e integridade, incluindo provas criptográficas de inexistência. Não fornece confidencialidade: as consultas continuam legíveis, a menos que se use DoT ou DoH. A cadeia de confiança começa em uma chave raiz e passa por delegações assinadas (DS/DNSKEY); falhas de validação podem resultar em SERVFAIL.\n\nVPN cria um túnel criptografado sobre rede não confiável. Remote access VPN conecta um usuário à rede corporativa; site-to-site conecta redes inteiras. WireGuard é simples e moderno, IPsec é comum em equipamentos e OpenVPN é maduro e flexível. VPN protege o túnel, não automaticamente o endpoint: host infectado, credenciais fracas e roteamento mal configurado continuam sendo riscos. Combinação correta é TLS para aplicações, DNSSEC para autenticidade de DNS e VPN para conectividade de rede confiável.",
        [
          ["mTLS", "TLS com autenticação mútua, no qual cliente e servidor apresentam certificados."],
          ["DNSSEC", "Conjunto de assinaturas que autenticam a origem e a integridade dos dados DNS."],
          ["DS", "Registro DNSSEC que contém o digest da chave da zona filha, usado na cadeia de confiança."],
          ["VPN", "Túnel criptografado que estende uma rede privada sobre uma rede pública."],
          ["TLS termination", "Ponto onde a criptografia TLS é encerrada e o tráfego volta a ser processado em claro."]
        ],
        {
          ex: [["Camadas de proteção", "Um usuário usa VPN até a rede corporativa, TLS até a aplicação e o resolvedor valida DNSSEC: três controles complementares."], ["Falha de validação", "Assinatura DNSSEC inválida faz o resolvedor devolver SERVFAIL, não um endereço possivelmente forjado."]],
          er: ["Achar que DNSSEC esconde consultas.", "Supor que VPN elimina necessidade de firewall e autenticação.", "Terminar TLS no balanceador e deixar o resto da rede interna sem proteção."],
          lab: "Simulação: desenhe cliente, VPN, balanceador e aplicação e marque onde cada mecanismo de proteção começa e termina.",
          ref: "RFC 8446; RFC 4033, RFC 4034 e RFC 4035 (DNSSEC); RFC 8740 (WireGuard); man7.org: wg(8), strongswan(8).",
          workedExamples: ["Em mTLS, o servidor rejeita conexões mesmo com TLS válido se o certificado do cliente não estiver na CA autorizada.", "DoH esconde a consulta do observador local, enquanto DNSSEC prova que a resposta não foi adulterada."],
          recallQuestions: ["O que DNSSEC não fornece?", "O que mTLS acrescenta?", "O que VPN protege?"],
          masteryCriteria: ["Separa TLS, DNSSEC e VPN.", "Explica cadeia de confiança DNSSEC.", "Reconhece limites de cada controle."],
          tags: ["TLS", "DNSSEC", "VPN"],
          estimatedEffort: 35
        }),

      L("Logging, monitoramento e menor privilégio",
        "Registrar eventos úteis sem vazar segredos e limitar o impacto de comprometimentos.",
        "Conceitos de autenticação, autorização e serviços.",
        "Log bom responde perguntas em incidente; log ruim cria outro problema de segurança.",
        "Logs de segurança devem registrar quem, quando, de onde, o que foi tentado e o resultado, com carimbo de tempo sincronizado. Devem incluir falhas de autenticação, mudanças de permissão, conexões administrativas e decisões de firewall. Nunca registre senhas, tokens, cookies de sessão nem dados pessoais desnecessários: o log passa a ser um novo ativo sensível.\n\nMonitoramento transforma eventos em sinais acionáveis. Alertas devem ter limiar claro e uma resposta prevista; caso contrário viram ruído. Retenção, rotação e controle de acesso fazem parte do projeto: logs muito curtos impedem investigação, logs muito longos aumentam risco e custo. Correlacionar fontes — sistema, firewall, aplicação e proxy — permite reconstruir a sequência de um incidente.\n\nMenor privilégio se aplica a usuários, grupos, sudoers, chaves SSH, tokens de API, capacidades do processo e permissões de arquivos. Contas de serviço não precisam de shell interativo nem de root. Separação de funções reduz fraude e erro: quem deploya não precisa aprovar própria mudança. Revisões periódicas removem acessos obsoletos, e listagem de privilégios ajuda a provar o que foi concedido.",
        [
          ["log estruturado", "Registro com campos consistentes e consultáveis, em vez de texto livre ambíguo."],
          ["carimbo de tempo", "Marcação temporal de eventos, preferencialmente sincronizada por NTP."],
          ["retenção", "Política que define por quanto tempo os logs são mantidos."],
          ["conta de serviço", "Identidade usada por um daemon, com permissões limitadas ao necessário."],
          ["segregação de funções", "Princípio de dividir responsabilidades para reduzir abuso e erro."]
        ],
        {
          ex: [["Log útil", "2026-11-25T10:12:03Z user=alice src=203.0.113.8 action=sudo cmd=/usr/bin/systemctl result=denied permite entender o evento sem expor segredo."], ["Log ruim", "Registrar 'login falhou para alice senha=...' cria vazamento de credencial no arquivo de log."]],
          er: ["Registrar tokens e cookies em logs de depuração.", "Criar alertas sem ação definida.", "Dar root ao serviço 'só para facilitar'."],
          lab: "Simulação: escreva três linhas de log estruturado para Login OK, Login falhado e mudança de firewall, sem dados sensíveis.",
          ref: "NIST SP 800-92 (log management); CIS Controls v8, controles 8 e 5; man7.org: journalctl(1), sudoers(5).",
          workedExamples: ["journalctl -u ssh --since today ajuda a correlacionar tentativas de login com mudanças de firewall.", "Uma conta de serviço pode ter AllowUsers restrito no sshd e sudo sem shell para uma única operação."],
          recallQuestions: ["O que nunca deve entrar em logs?", "O que define uma boa retenção?", "O que aplica menor privilégio a tokens?"],
          masteryCriteria: ["Registra eventos com contexto sem segredos.", "Define alertas acionáveis.", "Reduz privilégios de contas de serviço."],
          tags: ["logs", "monitoramento", "menor privilégio"],
          estimatedEffort: 30
        }),

      L("Laboratórios ofensivos com autorização",
        "Definir limites éticos, legais e operacionais para prática de segurança ofensiva.",
        "Todos os módulos anteriores de redes e segurança.",
        "Praticar ataque é legítimo apenas dentro de escopo autorizado; fora dele é dano, não laboratório.",
        "Regra da Forge: laboratórios ofensivos apenas em máquinas próprias, ambientes intencionalmente vulneráveis ou plataformas com autorização explícita. Isso inclui VMs isoladas que você criou, rangos de teste fornecidos por um curso e alvos em plataformas como Hack The Box ou TryHackMe. Não escaneie, teste credenciais nem explore serviços de redes de terceiros 'para aprender'.\n\nAntes de começar, registre escopo por escrito: hosts e intervalos permitidos, janelas de tempo, técnicas autorizadas, dados que podem ser coletados, critérios de parada e contato do responsável. Use rede isolada ou implementações locais, snapshots para restaurar e credenciais descartáveis. Limite a ferramenta ao objetivo: uma varredura ampla pode derrubar serviço e ultrapassar o escopo mesmo sem intenção.\n\nA prática defensiva complementa a ofensiva: analisar capturas simuladas, escrever regras de firewall, revisar logs e corrigir configurações inseguras desenvolve julgamento sem risco externo. Ao documentar, separe o que foi simulado da Forge, o que foi executado em VM local e o que exige autorização formal. Segurança profissional é medida por responsabilidade e comunicação, não apenas por ferramentas.",
        [
          ["escopo autorizado", "Conjunto documentado de sistemas, técnicas e horários nos quais um teste pode ser executado."],
          ["ambiente intencionalmente vulnerável", "VM ou plataforma criada para prática de segurança, com permissão clara de uso."],
          ["regra da Forge", "Laboratórios ofensivos somente em máquinas próprias, ambientes vulneráveis designados ou plataformas autorizadas."],
          ["critério de parada", "Condição combinada que encerra o teste, como dano inesperado ou saída do escopo."],
          ["simulação versus real", "Distinção entre dados didáticos criados pela Forge e evidência de sistema real."]
        ],
        {
          ex: [["Escopo válido", "VM local 10.0.0.10 em rede isolada, janela das 19h às 21h, varredura de portas permitida, sem exploração de outros hosts."], ["Escopo inválido", 'Escanear a rede do Wi-Fi de um café para "ver o que aparece", mesmo sem causar dano.']],
          er: ["Testar alvo fora do escopo porque 'é só um ping'.", "Coletar dados reais de usuários durante prática.", "Descrever captura simulada como se fosse pentest real."],
          lab: "Simulação: preencha um formulário de escopo com alvo, horário, técnicas permitidas e critério de parada antes de qualquer exercício ofensivo.",
          ref: "Regra de laboratórios da Enciclopédia Forge, seção 7 R12; NIST SP 800-115 (testes de segurança); OWASP — https://owasp.org/.",
          workedExamples: ["Uma captura didática do Wireshark pode ensinar retransmissão e ARP sem gerar tráfego em rede alguma.", "Em VM local, snapshots permitem voltar ao estado original após cada exercício."],
          recallQuestions: ["O que a regra da Forge exige?", "O que deve constar no escopo?", "Simulação equivale a pentest real?"],
          masteryCriteria: ["Declara explicitamente a regra de autorização.", "Define escopo e critério de parada.", "Separa simulação de execução real."],
          tags: ["segurança", "ética", "autorização"],
          estimatedEffort: 25
        })
    ]
  }
);

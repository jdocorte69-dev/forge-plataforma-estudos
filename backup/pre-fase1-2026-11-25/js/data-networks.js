/* ============================================================
   FORGE — data-networks.js
   Redes de computadores: fundamentos, modelos e protocolos
   ============================================================ */

CURRICULUM.networks = {
  name: "Redes de Computadores",
  icon: "🌐",
  modules: [
    {
      name: "Fundamentos e modelos",
      lessons: [
        L("O que é uma rede de computadores",
          "Definir rede, distinguir LAN, MAN e WAN e entender como dados e recursos são compartilhados.",
          "Nenhum. Basta a noção de computador e arquivo.",
          "Uma rede é um conjunto de dispositivos que trocam dados por um meio comum, como fios, fibra ou rádio, seguindo regras compartilhadas.",
          "Uma rede é um conjunto de dispositivos — hosts, switches, roteadores, impressoras — ligados por enlaces de cobre, fibra ou rádio e governados por regras comuns chamadas protocolos. O objetivo é compartilhar dados e recursos: um host origina dados, o enlace transporta sinais e os dispositivos intermediários encaminham o tráfego até o destino.\n\nClassificamos a rede pela extensão: LAN cobre uma sala ou edifício, MAN uma cidade e WAN interliga regiões distantes, geralmente por meio de operadoras. A Internet é uma rede pública formada por muitas redes interconectadas; um datacenter e uma casa com Wi-Fi também são redes, apenas com escalas diferentes.\n\nPara viajar, o dado é dividido em pacotes. Cada camada encapsula a unidade recebida e adiciona seu próprio cabeçalho; no destino, o processo inverso entrega os dados à aplicação. Duas métricas ajudam a avaliar o resultado: vazão (taxa de bits entregues por segundo) e latência (tempo para o primeiro bit chegar). Em um enlace de $100$ Mbit/s, um arquivo de $50$ MB (= $400$ Mbit) leva no mínimo $400/100 = 4$ s, mesmo antes de descontar o overhead.",
          [
            ["host", "Dispositivo conectado à rede que origina, recebe ou encaminha dados."],
            ["enlace", "Caminho físico ou sem fio que liga dois dispositivos da rede."],
            ["LAN", "Rede local que cobre uma área pequena, como uma sala ou um edifício."],
            ["WAN", "Rede de longa distância que interliga redes locais por meio de operadoras."],
            ["pacote", "Unidade de dados dividida para transmissão, com cabeçalho e carga útil."]
          ],
          {
            ex: [["Rede em um escritório", "Dez computadores e duas impressoras ligados a um switch formam uma LAN; o roteador dessa LAN liga-se à Internet por uma WAN contratada."], ["Estimando a transferência", "Com enlace de $100$ Mbit/s, $50$ MB equivalem a $400$ Mbit e o tempo mínimo é $400/100 = 4$ s; na prática o resultado é maior por causa de cabeçalhos e retransmissões."]],
            er: ["Confundir largura de banda com latência: um enlace rápido pode ter alta latência.", "Achar que os pacotes de uma mesma mensagem sempre viajam pelo mesmo caminho.", "Tratar LAN e Internet como sinônimos."],
            lab: "Simulação: desenhe em papel três hosts, um switch e um roteador e indique quais enlaces são LAN e qual representa a WAN.",
            ref: "Kurose & Ross, Computer Networking: A Top-Down Approach, cap. 1; Cisco, artigos sobre redes (docs.cisco.com)."
          }),
        L("Modelo OSI",
          "Associar as sete camadas do OSI às suas funções e usar o modelo para localizar falhas.",
          "Noção de pacote, enlace e dispositivos de rede.",
          "O OSI é um mapa em sete andares: cada camada presta serviço à de cima e usa a de baixo, sem precisar saber como ela funciona.",
          "O modelo OSI (ISO/IEC 7498-1) tem sete camadas: Física, Enlace, Rede, Transporte, Sessão, Apresentação e Aplicação, de baixo para cima. Cada camada oferece serviços à superior e usa os serviços da inferior, como em uma empresa na qual o setor de logística não precisa saber como o veículo foi fabricado.\n\nAs unidades de dados mudam de nome conforme a camada: bits na Física, frames na Enlace, pacotes ou datagramas na Rede, segmentos no Transporte e simplesmente dados nas camadas altas. Quando um host envia algo, ocorre encapsulamento descendo pelas camadas; quando o receptor recebe, ocorre desencapsulamento subindo. Um roteador atua até a camada 3, um switch até a camada 2 e um hub apenas na camada 1.\n\nNa prática, Sessão e Apresentação foram absorvidas pela camada de aplicação do modelo TCP/IP. O valor do OSI está na linguagem comum para projetar e diagnosticar: 'problema de camada 1' indica cabo, energia ou sinal; 'camada 3' indica IP ou rota; 'camada 7' indica a aplicação, como HTTP ou autenticação. O modelo organiza o pensamento, mas não é um protocolo obrigatório.",
          [
            ["camada física", "Camada que transforma bits em sinais elétricos, ópticos ou de rádio."],
            ["camada de enlace", "Camada que endereça frames entre dispositivos no mesmo enlace."],
            ["camada de rede", "Camada que encaminha datagramas entre redes usando endereços IP."],
            ["camada de transporte", "Camada que entrega dados entre processos, com TCP ou UDP."],
            ["camada de aplicação", "Camada onde os programas de usuário acessam os serviços da rede."]
          ],
          {
            ex: [["Encapsulamento de uma mensagem", "Os dados de um chat viram segmento TCP, depois datagrama IP, depois frame Ethernet e, por fim, sinais no cabo; o receptor desfaz o caminho na ordem inversa."], ["Diagnóstico por camada", "Sem link Wi-Fi é camada 1 ou 2; falha de ping para o gateway é camada 3; página que carrega, mas exibe erro de login, é camada 7."]],
            er: ["Achar que cada camada conversa diretamente com a camada correspondente no outro host; apenas a camada física faz isso.", "Colocar HTTP na camada de transporte.", "Tratar o OSI como uma pilha de protocolos que precisa ser implementada exatamente assim."],
            lab: "Simulação: classifique em papel cinco falhas — cabo rompido, MAC duplicado, rota ausente, porta TCP fechada e senha inválida — nas camadas 1 a 7.",
            ref: "ISO/IEC 7498-1; Kurose & Ross, cap. 1; Cisco, artigo 'The OSI Model' (docs.cisco.com)."
          }),
        L("Modelo TCP/IP",
          "Comparar as camadas do TCP/IP com o OSI e identificar protocolos de cada camada.",
          "Modelo OSI e noção de encapsulamento.",
          "O TCP/IP é o modelo que a Internet realmente usa: quatro camadas, com a rede na base e a aplicação no topo.",
          "O modelo TCP/IP é a arquitetura real da Internet, resumida em quatro camadas: interface de rede, internet, transporte e aplicação. Foi descrito em documentos como o RFC 1122 e, ao contrário do OSI, nasceu junto com os protocolos que ainda usamos: Ethernet na base, IP no meio, TCP e UDP acima e HTTP, DNS e SMTP no topo.\n\nA ideia central é o 'pescoço de garrafa' (narrow waist): o IP é o ponto estreito que praticamente tudo usa. Por ser comum a todos, permite que a mesma aplicação funcione sobre fibra, Wi-Fi ou 4G, já que todas encapsulam datagramas IP. O custo é que o IP sozinho não garante entrega confiável; essa responsabilidade fica com o TCP, quando necessária.\n\nO fluxo é: dados da aplicação viram segmento TCP ou datagrama UDP, depois datagrama IP e, por fim, frame da interface. Em cada roteador, o frame é desencapsulado até a camada 3 e um novo frame é construído para o próximo enlace, preservando o datagrama original. Saber o que muda (MAC) e o que permanece (IP de origem e destino, salvo NAT) evita confusão ao ler capturas.",
          [
            ["modelo TCP/IP", "Arquitetura de quatro camadas na qual a Internet e seus protocolos se baseiam."],
            ["camada de internet", "Camada cujo protocolo principal é o IP e que encaminha datagramas entre redes."],
            ["camada de transporte", "Camada que fornece comunicação entre processos por TCP ou UDP."],
            ["narrow waist", "Papel central do IP, usado por todas as aplicações e por todas as tecnologias de acesso."],
            ["RFC 1122", "Documento que descreve os requisitos de comunicação da suíte de protocolos TCP/IP."]
          ],
          {
            ex: [["Da URL ao frame", "O navegador gera dados HTTP; o TCP os transforma em segmentos; o IP os encapsula em datagramas; a Ethernet os coloca em frames endereçados ao gateway."], ["Comparação com o OSI", "As camadas Sessão e Apresentação do OSI não existem separadamente no TCP/IP: suas funções ficam na camada de aplicação, junto de HTTP, DNS e TLS."]],
            er: ["Achar que o TCP/IP tem sete camadas como o OSI.", "Colocar o DNS na camada de rede só porque ele informa endereços IP.", "Supor que toda aplicação usa TCP."],
            lab: "Simulação: monte em papel uma tabela com quatro camadas e escreva um protocolo ou unidade de dados em cada uma, do frame ao navegador.",
            ref: "RFC 1122; RFC 791; Kurose & Ross, cap. 1."
          }),
        L("Endereçamento IPv4 e máscaras",
          "Ler endereços IPv4 e usar a máscara para separar a parte de rede da parte de host.",
          "Conceito de bit, byte e camada de rede.",
          "Um IPv4 é como um endereço de 32 bits escrito em quatro grupos; a máscara diz qual parte identifica a rua e qual identifica a casa.",
          "Um endereço IPv4 tem $32$ bits, escritos como quatro octetos decimais separados por pontos, de $0$ a $255$ em cada grupo: $192.168.10.33$, por exemplo. Isso dá $2^{32}$ endereços possíveis, número insuficiente para o crescimento da Internet — daí o IPv6 e o uso de NAT e intervalos privados.\n\nA máscara de rede é uma sequência contígua de bits 1 seguida de bits 0. Aplicando AND bit a bit entre o IP e a máscara obtemos o endereço de rede; combinando a máscara invertida com o IP obtemos a parte de host. A notação CIDR resume a máscara pelo número de bits 1: /24 equivale a 255.255.255.0, /16 a 255.255.0.0 e /8 a 255.0.0.0.\n\nEm toda sub-rede, o primeiro endereço identifica a rede e o último é o broadcast; os demais podem ser atribuídos a hosts. O RFC 1918 reserva 10.0.0.0/8, 172.16.0.0/12 e 192.168.0.0/16 para uso privado, e 127.0.0.0/8 é loopback. Endereço privado não é roteável na Internet pública: ele precisa de NAT para sair.",
          [
            ["IPv4", "Protocolo de rede que usa endereços de 32 bits em notação decimal pontuada."],
            ["máscara de rede", "Sequência de bits que distingue a parte de rede da parte de host de um endereço."],
            ["notação CIDR", "Forma compacta de escrever a máscara como uma barra seguida do número de bits 1."],
            ["endereço de broadcast", "Último endereço da sub-rede, usado para alcançar todos os hosts nela."],
            ["espaço privado RFC 1918", "Intervalos de IPv4 reservados para redes internas e não roteáveis na Internet pública."]
          ],
          {
            ex: [["Separe rede e host", "Para 192.168.10.33/24, a máscara é 255.255.255.0. O AND binário resulta em 192.168.10.0; o broadcast é 192.168.10.255 e os hosts utilizáveis vão de 192.168.10.1 a 192.168.10.254."], ["Leia um prefixo /8", "Em 10.0.0.1/8 a máscara é 255.0.0.0, a rede é 10.0.0.0, o broadcast é 10.255.255.255 e restam $2^{24}$ endereços no bloco."]],
            er: ["Escrever um octeto maior que 255, como 192.168.300.1.", "Achar que /24 significa 24 hosts disponíveis.", "Atribuir o endereço de broadcast a uma interface de host."],
            lab: "Simulação: converta 172.16.5.9/16 em máscara decimal, rede e broadcast usando papel ou planilha.",
            ref: "RFC 791; RFC 1918; Cisco, documentação de endereçamento IP (docs.cisco.com)."
          }),
        L("Subnetting e CIDR",
          "Calcular sub-redes com máscara, blocos, broadcast e agregação de prefixos.",
          "Endereçamento IPv4 e máscaras.",
          "Subnetizar é dividir um bloco grande em blocos menores: cada bit emprestado do host dobra o número de sub-redes e corta o tamanho de cada uma pela metade.",
          "Subnetizar é dividir um bloco maior em blocos menores e independentes. Com prefixo /n, restam $h = 32 - n$ bits de host; o bloco tem $2^h$ endereços e, normalmente, $2^h - 2$ hosts utilizáveis, porque o primeiro é a rede e o último o broadcast. Cada bit emprestado da parte de host para a rede dobra o número de sub-redes e reduz pela metade o tamanho de cada uma.\n\nO incremento entre sub-redes é o tamanho do bloco: em /26 ele é $2^6 = 64$, em /25 é $128$ e em /27 é $32$. A máscara de /26 é 255.255.255.192, a de /27 é 255.255.255.224 e a de /25 é 255.255.255.128. Quando a divisão cruza um octeto, como em /18, o incremento passa a $2^{14} = 16384$ endereços, ou 64 no terceiro octeto.\n\nCIDR também permite o caminho inverso: agregar vários prefixos contíguos em uma rota só, reduzindo as tabelas de roteamento. VLSM é o uso de máscaras diferentes dentro da mesma rede, combinando blocos grandes para servidores e pequenos para enlaces ponto a ponto (/31 ou /30). A rota padrão 0.0.0.0/0 é o bloco que casa qualquer destino quando não há rota mais específica.",
          [
            ["prefixo CIDR", "Número após a barra que indica quantos bits da máscara são 1."],
            ["bits de host", "Bits restantes do endereço após o prefixo, usados para numerar hosts."],
            ["tamanho de bloco", "Quantidade de endereços de uma sub-rede, igual a $2^h$."],
            ["broadcast de sub-rede", "Último endereço do bloco, logo antes do início da próxima sub-rede."],
            ["agregação de rotas", "Fusão de prefixos contíguos em um prefixo mais curto e menos específico."]
          ],
          {
            ex: [["Divida 192.168.20.0/24 em sub-redes /26", "Emprestamos 2 bits: $h = 32 - 26 = 6$, bloco de $2^6 = 64$ endereços e $64 - 2 = 62$ hosts por sub-rede. A máscara é 255.255.255.192. As sub-redes são 192.168.20.0/26 (broadcast .63), 192.168.20.64/26 (broadcast .127), 192.168.20.128/26 (broadcast .191) e 192.168.20.192/26 (broadcast .255). O host 192.168.20.70 pertence ao bloco .64/26, cujo primeiro host é .65 e cujo broadcast é .127."], ["Agrege quatro rotas", "Os prefixos 192.168.20.0/24 a 192.168.23.0/24 são contíguos e viram 192.168.20.0/22, com máscara 255.255.252.0, reduzindo quatro entradas a uma."]],
            er: ["Somar 1 ao broadcast para encontrar o próximo host utilizável.", "Esquecer de subtrair 2 para rede e broadcast ao contar hosts.", "Confundir /26 com a máscara 255.255.255.26."],
            lab: "Simulação: em papel, divida 10.10.0.0/16 em quatro blocos /18 e anote rede, broadcast e primeiro host de cada um.",
            ref: "RFC 4632; RFC 1878; Cisco, documentação de subnetting (docs.cisco.com)."
          }),
        L("IPv6",
          "Ler endereços IPv6 comprimidos e reconhecer os principais escopos e tipos de endereço.",
          "Endereçamento IPv4 e notação CIDR.",
          "O IPv6 aumenta o endereço de 32 para 128 bits: há espaço para praticamente tudo ter um endereço próprio, sem depender de NAT.",
          "O IPv6 usa $128$ bits, escritos como oito grupos de quatro dígitos hexadecimais separados por dois-pontos. Para encurtar, zeros à esquerda de cada grupo podem ser omitidos e uma sequência contígua de grupos zero pode virar ::, uma única vez por endereço, para não criar ambiguidade. O RFC 8200 define o protocolo e o RFC 4291, a arquitetura de endereçamento.\n\nOs escopos mais comuns são: global (2000::/3), equivalente ao IPv4 público; link-local (fe80::/10), válido apenas no enlace e geralmente acompanhado de um índice de interface como %eth0; loopback ::1; e multicast ff00::/8. Não existe broadcast em IPv6: o que antes era broadcast passa a ser multicast, como ff02::1 para todos os nós da rede local.\n\nUm prefixo /64 é a recomendação usual para uma LAN porque a metade baixa dos bits acomoda o identificador de interface, gerado por EUI-64 ou por SLAAC (RFC 4862) com anúncios de roteador. O DHCPv6 existe para distribuir opções extras. O cabeçalho IPv6 é mais simples que o do IPv4, não tem checksum e não é fragmentado por roteadores; a origem faz a descoberta de MTU.",
          [
            ["IPv6", "Protocolo de rede com endereços de 128 bits escritos em hexadecimal."],
            ["link-local", "Endereço válido apenas dentro de um único enlace, iniciado por fe80."],
            ["SLAAC", "Mecanismo de autoconfiguração no qual o host deriva seu endereço a partir de anúncios de roteador."],
            ["prefixo /64", "Tamanho recomendado de uma LAN IPv6, com 64 bits de rede e 64 de interface."],
            ["multicast IPv6", "Endereço do tipo ff00::/8 usado para entregar dados a um grupo de interfaces."]
          ],
          {
            ex: [["Comprima um endereço", "2001:0db8:0000:0000:0000:ff00:0042:8329 vira 2001:db8::ff00:42:8329: retiram-se os zeros à esquerda de cada grupo e a maior sequência de grupos zero é substituída por ::."], ["Identifique o escopo", "fe80::1%eth0 é link-local e só faz sentido naquela interface; 2001:db8::1 pertence ao bloco de documentação; ff02::1 é multicast para todos os nós locais."]],
            er: ["Usar :: duas vezes no mesmo endereço, tornando a compressão ambígua.", "Achar que IPv6 é apenas IPv4 escrito em mais algarismos decimais.", "Procurar um endereço de broadcast em IPv6, quando o mecanismo é multicast."],
            lab: "Simulação: escreva no papel a forma comprimida de 2001:0db8:0000:0000:0000:0000:0000:0001 e classifique fe80::1 e ff02::1.",
            ref: "RFC 8200; RFC 4291; RFC 4862."
          }),
        L("Camada de enlace e Ethernet",
          "Explicar endereços MAC, a estrutura do frame Ethernet e os domínios de colisão e broadcast.",
          "Camada física e camada de rede.",
          "A camada de enlace move o datagrama dentro da mesma rede local: ela o coloca em um frame com endereços MAC e o entrega ao próximo salto.",
          "A camada de enlace leva o datagrama IP dentro de um único enlace, do host ao próximo salto. No modelo de referência ela se divide em MAC (controle de acesso ao meio) e LLC; na prática, as tecnologias mais vistas são Ethernet (IEEE 802.3) e Wi-Fi (IEEE 802.11). Cada interface tem um endereço MAC de $48$ bits, escrito em seis pares hexadecimais, com os primeiros três bytes identificando o fabricante (OUI).\n\nUm frame Ethernet começa com preâmbulo, traz MAC de destino e de origem, um campo EtherType (0x0800 para IPv4, 0x86DD para IPv6, 0x0806 para ARP), o payload e o FCS com CRC para detectar corrupção. O payload típico vai de 46 a 1500 bytes; esse limite de 1500 é o MTU da interface. Se o pacote IP for maior, ele precisa ser fragmentado antes de virar frame.\n\nHá dois domínios importantes. O domínio de colisão, associado a hubs e half-duplex, praticamente desapareceu com switches full-duplex; o domínio de broadcast inclui todos os hosts que recebem ff:ff:ff:ff:ff:ff e normalmente coincide com a VLAN. O switch inspeciona a origem dos frames para aprender MACs e o destino para encaminhar; o roteador vai além e usa o IP para atravessar redes diferentes.",
          [
            ["endereço MAC", "Identificador de 48 bits gravado na interface de rede e usado dentro do enlace."],
            ["frame Ethernet", "Unidade da camada de enlace que encapsula o pacote IP com MACs de origem e destino."],
            ["MTU", "Tamanho máximo da carga útil que um enlace aceita em um frame, tipicamente 1500 bytes."],
            ["FCS", "Campo de verificação de integridade do frame, calculado com CRC."],
            ["domínio de broadcast", "Conjunto de hosts que recebem frames enviados ao endereço de broadcast."]
          ],
          {
            ex: [["Monte um frame", "Destino aa:bb:cc:dd:ee:ff, origem 00:11:22:33:44:55, EtherType 0x0800, payload com o datagrama IP e FCS gerado pelo CRC; o datagrama IP cabe porque seu tamanho é no máximo o MTU de 1500 bytes."], ["Leia o EtherType", "Um frame com EtherType 0x0806 carrega ARP, não IPv4; um com 0x86DD carrega um pacote IPv6."]],
            er: ["Achar que o MAC de destino permanece o mesmo de ponta a ponta; ele é refeito a cada enlace.", "Confundir MTU com o tamanho total do frame incluindo cabeçalhos.", "Tentar usar endereço MAC para encaminhar dados entre redes diferentes."],
            lab: "Simulação: desenhe um frame Ethernet em papel com destino, origem, EtherType 0x0800, payload e FCS e indique o campo que identifica o protocolo encapsulado.",
            ref: "IEEE 802.3; RFC 894; Kurose & Ross, cap. 4; Cisco, documentação de Ethernet (docs.cisco.com)."
          }),
        L("Switching e VLANs",
          "Descrever o aprendizado de MAC em switches e a segmentação lógica com VLANs e trunk 802.1Q.",
          "Camada de enlace e endereços MAC.",
          "O switch aprende onde cada MAC está olhando a origem dos frames; as VLANs criam redes lógicas separadas dentro do mesmo equipamento físico.",
          "Um switch de camada 2 constrói sua tabela MAC observando a origem dos frames que chegam em cada porta: se o MAC aa:bb aparece na porta 3, ele registra aa:bb -> porta 3. Quando o destino é conhecido, o frame sai apenas pela porta correspondente; quando é desconhecido ou broadcast, ele é inundado (flooding) nas demais portas da mesma VLAN. A tabela é temporária e expira após tempo de inatividade.\n\nComo o flooding repete frames, ligar dois switches em loop sem mecanismo de controle cria tempestade de broadcast e frames duplicados. O STP (IEEE 802.1D, hoje RSTP 802.1w) bloqueia um dos caminhos e o reabre se o principal falhar. Assim, a topologia física pode ter redundância sem que a lógica de camada 2 entre em loop.\n\nVLANs segmentam logicamente o switch: portas na VLAN 10 não veem o tráfego da VLAN 20, mesmo no mesmo aparelho. Entre switches usa-se um trunk 802.1Q, que insere no frame uma tag com VLAN ID de 12 bits (até 4094 valores); a VLAN nativa costuma trafegar sem tag. Para hosts de VLANs diferentes conversarem é preciso roteamento inter-VLAN, por exemplo com uma subinterface de router-on-a-stick ou uma SVI em switch de camada 3.",
          [
            ["switch", "Dispositivo de camada 2 que encaminha frames usando a tabela de endereços MAC."],
            ["tabela MAC", "Estrutura temporária que associa cada endereço MAC aprendido a uma porta."],
            ["flooding", "Encaminhamento do frame para todas as portas aplicáveis quando o destino é desconhecido."],
            ["VLAN", "Rede lógica independente criada sobre a mesma infraestrutura física de switch."],
            ["802.1Q", "Padrão de tagging que insere o identificador da VLAN no frame Ethernet."]
          ],
          {
            ex: [["Aprendizado da tabela", "Um frame com origem aa:bb entra pela porta 1 e destino cc:dd, ainda desconhecido: o switch registra aa:bb -> 1 e inunda as outras portas. Quando cc:dd responde pela porta 4, ele registra cc:dd -> 4 e dali em diante envia apenas para essa porta."], ["Trunk entre switches", "Um frame da VLAN 10 recebe tag 802.1Q com ID 10 antes de sair pelo trunk; no switch receptor, a tag é lida e removida antes da entrega na porta de acesso."]],
            er: ["Achar que o switch 'roteia' usando endereços IP.", "Manter um loop de camada 2 sem STP ou RSTP ativo.", "Esquecer de configurar o trunk entre switches e depois estranhar o isolamento das VLANs."],
            lab: "Simulação: em uma tabela de papel, registre MAC -> porta após três frames e marque quais portas recebem um broadcast.",
            ref: "IEEE 802.1D; IEEE 802.1Q; Cisco, documentação de VLANs e trunking (docs.cisco.com)."
          }),
        L("Roteamento e tabelas",
          "Explicar como o roteador escolhe a interface de saída usando o prefixo mais longo e a rota padrão.",
          "IPv4, máscaras e camada de rede.",
          "A tabela de rotas é um mapa de bairros: para cada destino, o roteador escolhe o caminho mais específico que casa ou a rota padrão.",
          "Um roteador conecta redes de camada 3 e decide, para cada datagrama, qual interface ou próximo salto (next-hop) usar. A tabela de rotas contém o prefixo de destino, a máscara, o next-hop, a interface de saída, a métrica e a distância administrativa. Rotas conectadas surgem das interfaces ativas; rotas estáticas são escritas pelo administrador; rotas dinâmicas são aprendidas por protocolos como OSPF (RFC 2328) dentro de um sistema autônomo e BGP (RFC 4271) entre sistemas autônomos.\n\nA regra de decisão é o longest prefix match: entre todas as rotas que casam com o IP de destino, o roteador escolhe a mais específica, isto é, a que tem o maior número de bits no prefixo. Só depois disso ele usa métrica e distância administrativa para desempatar. Se nenhuma rota casa, ele aplica a rota padrão 0.0.0.0/0; se não houver nem essa, descarta o pacote e avisa a origem com ICMP.\n\nAntes de encaminhar, o roteador decrementa o TTL e recalcula o checksum do cabeçalho IP. Em seguida reencapsula o datagrama em um novo frame com o MAC do next-hop: por isso o MAC de destino muda a cada enlace, enquanto o IP de origem e destino permanece o mesmo de ponta a ponta, salvo NAT. Essa diferença separa comutação (camada 2) de roteamento (camada 3).",
          [
            ["roteador", "Dispositivo de camada 3 que encaminha datagramas entre redes distintas."],
            ["tabela de rotas", "Conjunto de entradas com prefixo, next-hop, interface e métrica usado para decidir o encaminhamento."],
            ["next-hop", "Endereço do roteador seguinte no caminho até o destino."],
            ["longest prefix match", "Critério que escolhe a rota com o prefixo mais específico entre as que casam com o destino."],
            ["rota padrão", "Entrada 0.0.0.0/0 usada quando nenhuma rota específica corresponde ao destino."]
          ],
          {
            ex: [["Escolha da rota", "Para o destino 192.168.20.70, a tabela tem 0.0.0.0/0 via .1, 192.168.20.0/24 via .2 e 192.168.20.64/26 via .3. As três casam, mas /26 é a mais específica: o pacote sai via .3."], ["TTL no salto", "Um pacote com $TTL = 64$ chega ao quinto roteador com 60; se um roteador o recebe com 1, decrementa para 0, descarta e devolve ICMP Time Exceeded à origem."]],
            er: ["Escolher a rota de menor métrica antes de verificar o prefixo mais longo.", "Achar que o roteador mantém o MAC de destino original no próximo enlace.", "Esquecer a rota padrão e descartar destinos externos conhecidos apenas pelo gateway."],
            lab: "Simulação: monte uma tabela com quatro rotas no papel e escolha a saída para três destinos, incluindo um que caia na rota padrão.",
            ref: "RFC 791; RFC 2328; RFC 4271; Cisco, documentação de roteamento (docs.cisco.com)."
          }),
        L("DNS",
          "Descrever a resolução hierárquica de nomes, o papel do cache e os registros mais comuns.",
          "Modelo TCP/IP, IP e portas.",
          "O DNS é a agenda da Internet: você pergunta um nome e ela devolve o endereço, consultando a cadeia de servidores até encontrar a resposta.",
          "O DNS é um sistema distribuído e hierárquico que associa nomes legíveis a endereços IP. O namespace começa na raiz (.), continua nos domínios de topo (.com, .br, .org) e chega aos domínios autoritativos (example.com). Nenhum servidor guarda a Internet inteira: cada um conhece apenas sua zona e quem é responsável pelas zonas abaixo dela.\n\nQuando um navegador precisa de um nome, ele chama um resolvedor recursivo, normalmente fornecido pelo sistema operacional, pelo provedor ou por um serviço público como 1.1.1.1. O resolvedor pergunta à raiz, recebe os servidores do domínio de topo, pergunta a estes, recebe os servidores autoritativos do domínio e finalmente obtém o registro. Cada resposta traz um TTL e fica em cache pelo tempo indicado, o que evita repetir a cadeia a cada acesso.\n\nOs registros mais usados são A (IPv4), AAAA (IPv6), CNAME (apelido para outro nome), MX (servidor de e-mail), NS (servidor autoritativo), SOA (dados da zona) e TXT (texto, hoje comum em verificações). Consultas usualmente usam UDP na porta 53 e recorrem ao TCP para respostas grandes ou transferência de zona; DNSSEC pode assinar as respostas. O DNS apenas fornece o endereço: quem estabelece a conexão e pede a página é o navegador, via TCP e HTTP.",
          [
            ["DNS", "Sistema distribuído que traduz nomes de domínio em endereços IP."],
            ["resolver recursivo", "Servidor que recebe a pergunta do cliente e percorre a hierarquia até obter a resposta."],
            ["servidor autoritativo", "Servidor responsável pela zona onde o nome consultado está definido."],
            ["registro A", "Registro DNS que associa um nome a um endereço IPv4."],
            ["TTL de DNS", "Tempo de vida de uma resposta em cache, definido em segundos."]
          ],
          {
            ex: [["Resolva www.example.com", "O resolvedor consulta a raiz, que indica os servidores de .com; estes indicam os servidores autoritativos de example.com; o autoritativo devolve o registro A. Cada resposta é guardada pelo TTL informado, encurtando consultas futuras."], ["Leia registros", "A devolve IPv4, AAAA devolve IPv6, CNAME aponta para outro nome, MX indica o servidor de e-mail e TXT carrega texto usado, entre outras coisas, em verificações de propriedade."]],
            er: ["Achar que o DNS traduz também números de porta.", "Supor que o resolvedor pergunte à raiz a cada acesso, ignorando o cache.", "Confundir CNAME com AAAA."],
            lab: "Simulação: desenhe em papel a cadeia raiz -> dominio de topo -> autoritativo para um domínio e indique onde o cache encurta o caminho.",
            ref: "RFC 1034; RFC 1035; Cloudflare Learning, artigos sobre DNS (cloudflare.com/learning/dns)."
          })
      ]
    },
    {
      name: "Protocolos e aplicações",
      lessons: [
        L("ARP e resolução de endereços",
          "Explicar como um host descobre o endereço MAC do próximo salto a partir de um IPv4 na mesma rede.",
          "Camada de enlace, Ethernet e IPv4.",
          "O IP diz para onde vai o pacote; o ARP responde quem, na rede local, deve receber o frame.",
          "Para encapsular um datagrama IP em um frame Ethernet é preciso saber o endereço MAC do próximo salto na mesma rede. O ARP (RFC 826) faz isso: o host envia uma requisição em broadcast para ff:ff:ff:ff:ff:ff perguntando quem tem determinado IPv4, e o dono do endereço responde unicast com seu MAC.\n\nA resposta fica em uma tabela temporária chamada cache ARP; no Linux, ip neigh mostra essa tabela. Se o destino estiver em outra sub-rede, o host não faz ARP do destino final, e sim do gateway padrão, porque é o gateway que receberá o frame na rede local. Depois de alguns minutos a entrada expira e a pergunta se repete.\n\nEm IPv6, o ARP foi substituído pelo NDP (Neighbor Discovery Protocol, RFC 4861), que usa ICMPv6 e multicast. Como o ARP confia em respostas não autenticadas, ele é vulnerável a spoofing: um atacante pode anunciar seu MAC como se fosse o gateway e desviar o tráfego. Defesas incluem DHCP snooping, dynamic ARP inspection e autenticação 802.1X.",
          [
            ["ARP", "Protocolo que resolve um endereço IPv4 da rede local em um endereço MAC."],
            ["ARP request", "Mensagem em broadcast que pergunta qual interface possui determinado IPv4."],
            ["ARP reply", "Resposta unicast que informa o endereço MAC associado ao IPv4 consultado."],
            ["cache ARP", "Tabela temporária que guarda associações recentes entre IPv4 e MAC."],
            ["NDP", "Protocolo de descoberta de vizinhos do IPv6 que substitui o ARP."]
          ],
          {
            ex: [["Host A quer 192.168.1.1", "A envia ARP request em broadcast; o dono do IP responde unicast com seu MAC aa:bb:...; A guarda a associação no cache e passa a enviar frames Ethernet com esse MAC de destino."], ["Destino remoto", "Para alcançar 203.0.113.5 fora da sub-rede local, A faz ARP do gateway 192.168.1.1, não do destino final, e o gateway encaminha o datagrama."]],
            er: ["Fazer ARP para um IP que está fora da própria sub-rede.", "Esperar que ARP funcione em redes IPv6.", "Confundir ARP com DNS: um resolve MAC, o outro resolve endereço IP."],
            lab: "Simulação: escreva em papel o diálogo ARP entre dois hosts e indique o destino Ethernet de cada mensagem.",
            ref: "RFC 826; RFC 4861; man7.org: arp(7) e ip-neigh(8)."
          }),
        L("IP e TTL",
          "Interpretar o cabeçalho IPv4, o campo TTL e o comportamento da fragmentação.",
          "IPv4, máscaras e roteamento.",
          "O TTL é um contador de vida: cada roteador diminui um; quando acaba, o pacote morre para não ficar circulando para sempre.",
          "O cabeçalho IPv4 tem pelo menos 20 bytes e carrega versão, tamanho, identificação, flags de fragmentação, TTL, protocolo, checksum e os endereços de origem e destino. O campo protocolo indica quem vem depois: 1 para ICMP, 6 para TCP e 17 para UDP. O checksum cobre apenas o cabeçalho, não a carga útil.\n\nO TTL (Time to Live) tem 8 bits e começa em valores como 64 (Linux e macOS) ou 128 (Windows). Cada roteador que encaminha o datagrama subtrai 1; se o valor chega a zero, o pacote é descartado e o roteador envia ICMP Time Exceeded à origem. Isso impede que pacotes órfãos circulem indefinidamente em loops e é a base do traceroute, que envia pacotes com TTL 1, 2, 3 e anota quem responde a cada vez.\n\nComo o TTL muda em cada salto, o checksum precisa ser recalculado em todos eles. A fragmentação aparece quando o pacote excede o MTU de um enlace: as flags e o offset, em blocos de 8 bytes, permitem remontar os pedaços no destino; com a flag DF ligada, o roteador descarta e avisa via ICMP. No IPv6 o campo se chama Hop Limit e os roteadores não fragmentam — a origem faz a descoberta de MTU.",
          [
            ["TTL", "Campo de 8 bits do cabeçalho IP decrementado a cada roteador e que limita o tempo de vida do pacote."],
            ["ICMP Time Exceeded", "Mensagem de erro enviada quando o TTL chega a zero ou um fragmento não chega a tempo."],
            ["fragmentação IP", "Divisão de um datagrama em pedaços menores que caibam no MTU do enlace."],
            ["MTU", "Maior tamanho de carga útil aceito por um enlace sem fragmentação."],
            ["checksum IPv4", "Campo que detecta alterações no cabeçalho IP e é recalculado a cada salto."]
          ],
          {
            ex: [["Acompanhe o TTL", "Um pacote com $TTL = 64$ passa por três roteadores e chega com 61; se o quarto o recebe com 1, decrementa para 0, descarta e envia ICMP Time Exceeded de volta à origem."], ["Fragmentos", "Um datagrama de 4000 bytes com MTU 1500 e DF desligado é dividido em fragmentos cujos offsets são múltiplos de 8; o destino reúne os pedaços antes de entregar os dados ao TCP."]],
            er: ["Achar que TTL mede tempo em segundos.", "Achar que o checksum IPv4 protege também a carga útil da camada de transporte.", "Esperar que roteadores IPv6 fragmentem pacotes em trânsito."],
            lab: "Simulação: acompanhe em papel um pacote com TTL igual a 8 por quatro saltos e descreva o que acontece se um quinto roteador receber o pacote com TTL igual a 1.",
            ref: "RFC 791; RFC 792; RFC 1191; man7.org: ip(7) e traceroute(8)."
          }),
        L("TCP — handshake, janela e retransmissão",
          "Explicar a conexão confiável do TCP: handshake, números de sequência, janela deslizante e retransmissão.",
          "Modelo TCP/IP e IP.",
          "TCP é uma conversa com número de pedido em cada frase: o receptor confirma o que chegou e o emissor reenvia o que não foi confirmado.",
          "TCP (RFC 9293) oferece um fluxo de bytes confiável e ordenado, com controle de congestionamento. Antes de enviar dados, cliente e servidor fazem o three-way handshake: o cliente envia SYN com número de sequência inicial x, o servidor responde SYN-ACK com sequência y e acknowledge x+1, e o cliente confirma com ACK y+1. Os números de sequência contam bytes, não mensagens.\n\nO ACK confirma o próximo byte esperado. O emissor mantém uma janela deslizante de bytes ainda não confirmados e retransmite o que não foi reconhecido, seja por expiração do RTO (estimado a partir do RTT) seja por três ACKs duplicados (fast retransmit). A janela informada pelo receptor controla o fluxo (rwnd); a janela de congestionamento (cwnd) controla quanto a rede suporta, crescendo em slow start e sendo reduzida quando há perda.\n\nO tamanho máximo de segmento depende do MTU: em Ethernet, $MSS = 1500 - 20 - 20 = 1460$ bytes, descontando os cabeçalhos IP e TCP. O encerramento usa FIN e passa por estados como TIME_WAIT. TCP é adequado para páginas, arquivos e e-mail, mas não promete prazo: confiabilidade não é o mesmo que baixa latência.",
          [
            ["TCP", "Protocolo de transporte confiável, orientado a conexão e baseado em fluxo de bytes."],
            ["three-way handshake", "Troca SYN, SYN-ACK e ACK que estabelece uma conexão TCP."],
            ["número de sequência", "Contador de bytes enviados que ordena os dados e permite confirmá-los."],
            ["janela deslizante", "Intervalo de bytes que o emissor pode enviar sem receber confirmação."],
            ["retransmissão", "Reenvio de dados não confirmados por timeout ou por ACKs duplicados."]
          ],
          {
            ex: [["Handshake passo a passo", "Cliente envia SYN seq=x; servidor responde SYN-ACK seq=y, ack=x+1; cliente envia ACK ack=y+1. Só depois disso o primeiro dado HTTP é enviado."], ["Calcule o MSS", "Com MTU Ethernet de 1500 bytes e cabeçalhos IP e TCP de 20 bytes cada, $MSS = 1500 - 20 - 20 = 1460$ bytes por segmento."]],
            er: ["Achar que o ACK confirma pacotes inteiros e não o próximo byte esperado.", "Confundir controle de fluxo (janela do receptor) com controle de congestionamento (janela da rede).", "Supor que TCP garanta entrega em prazo fixo."],
            lab: "Simulação: desenhe o handshake em três setas com seq e ack e marque o que acontece se o SYN-ACK se perder.",
            ref: "RFC 9293; RFC 5681; man7.org: tcp(7)."
          }),
        L("UDP",
          "Caracterizar o UDP e decidir quando ele é preferível ao TCP.",
          "IP e noções de TCP.",
          "UDP é um envelope simples: você envia o datagrama sem conversa prévia nem confirmação.",
          "UDP (RFC 768) é o transporte mínimo: um cabeçalho de 8 bytes com porta de origem, porta de destino, comprimento e checksum. Não há handshake, número de sequência, confirmação, retransmissão, controle de fluxo ou de congestionamento. Se o datagrama se perder, a aplicação decide se tenta novamente.\n\nEssa simplicidade traz vantagens: menos bytes de cabeçalho, latência menor para mensagens curtas e possibilidade de multicast e broadcast. Por isso UDP aparece em DNS, DHCP, SNMP, streaming ao vivo, jogos e VoIP. Em IPv4 o checksum é opcional; em IPv6 é obrigatório. Vale lembrar que QUIC (RFC 9000), base do HTTP/3, usa UDP mas implementa confiabilidade e criptografia na camada de aplicação.\n\nEscolher UDP não significa abrir mão de segurança por princípio: significa assumir onde a confiabilidade é necessária. Um aplicativo pode numerar seus próprios pacotes e retransmitir apenas os dados críticos, deixando o áudio seguir com perdas leves. O trade-off é consciente: entrega mais rápida versus entrega garantida.",
          [
            ["UDP", "Protocolo de transporte sem conexão que entrega datagramas sem garantia de recebimento."],
            ["datagrama UDP", "Unidade de dados do UDP formada por cabeçalho de 8 bytes e carga útil."],
            ["checksum UDP", "Campo opcional em IPv4 e obrigatório em IPv6 que verifica o datagrama."],
            ["sem conexão", "Característica de quem envia dados sem estabelecer sessão prévia."],
            ["QUIC", "Protocolo sobre UDP que traz confiabilidade, multiplexação e TLS próprios."]
          ],
          {
            ex: [["Consulta DNS", "O cliente envia um datagrama UDP à porta 53 e espera a resposta; se ela não vier, a própria aplicação decide se reenvia a pergunta."], ["Compare os cabeçalhos", "O cabeçalho UDP ocupa 8 bytes: origem 2, destino 2, comprimento 2 e checksum 2; um payload de 100 bytes gera um datagrama de 108 bytes antes do encapsulamento IP."]],
            er: ["Achar que UDP é inseguro por definição, quando a segurança depende de TLS ou QUIC.", "Esperar ordem de entrega dos datagramas UDP.", "Usar UDP apenas por ser 'mais rápido', sem avaliar o impacto das perdas."],
            lab: "Simulação: compare em papel o cabeçalho mínimo do TCP (20 bytes) com o do UDP (8 bytes) e calcule o overhead extra de dez mensagens curtas.",
            ref: "RFC 768; RFC 9000; man7.org: udp(7)."
          }),
        L("Portas e sockets",
          "Entender como portas identificam processos e como uma tupla identifica uma conexão.",
          "TCP e UDP.",
          "O IP entrega o pacote ao computador; a porta entrega ao programa certo, como o número de apartamento dentro do prédio.",
          "Portas são números de 16 bits, de $0$ a $65535$, que identificam processos dentro de um host. As bem conhecidas (0-1023) incluem 22 (SSH), 53 (DNS), 80 (HTTP), 443 (HTTPS) e 25 (SMTP); as registradas vão de 1024 a 49151; as efêmeras, de 49152 a 65535, são escolhidas pelo sistema operacional para o lado cliente. A lista oficial é mantida pela IANA.\n\nUm socket é um ponto final de comunicação identificado por endereço IP, porta e protocolo. Uma conexão TCP é identificada pela tupla (IP origem, porta origem, IP destino, porta destino, protocolo), o que permite várias conexões simultâneas usarem a mesma porta de destino no servidor sem confusão. No servidor, o fluxo típico é socket(), bind(), listen(), accept(); no cliente, socket() e connect().\n\nEm sistemas Unix, um socket é um descritor de arquivo e aparece em /proc; ferramentas como ss mostram LISTEN, ESTAB e as tuplas ativas. Duas aplicações não podem escutar na mesma combinação IP, porta e protocolo sem uma opção especial como SO_REUSEPORT. Portas também são usadas pelo NAPT para distinguir hosts internos e são o alvo de regras de firewall.",
          [
            ["porta", "Número de 16 bits que identifica um processo ou serviço dentro do host."],
            ["socket", "Ponto final de comunicação definido por IP, porta e protocolo."],
            ["porta efêmera", "Porta temporária escolhida pelo sistema operacional para a ponta cliente."],
            ["bind", "Operação que associa um socket a um endereço IP e uma porta locais."],
            ["tupla de conexão", "Conjunto IP origem, porta origem, IP destino, porta destino e protocolo que identifica a conexão."]
          ],
          {
            ex: [["Cliente web", "O cliente 192.168.1.10:52344 conecta-se a 203.0.113.10:443 via TCP, usando um endereço de documentação RFC 5737; a tupla completa distingue essa conexão de qualquer outra."], ["Servidor escutando", "O servidor chama socket(), bind na porta 80, listen e accept; cada cliente aceito gera um novo socket com a tupla formada pelo par de endereços e portas."]],
            er: ["Achar que duas aplicações podem escutar na mesma porta e protocolo sem opção especial.", "Confundir número de porta com PID de processo.", "Supor que uma conexão TCP seja identificada apenas pela porta de destino."],
            lab: "Simulação: escreva no papel a tupla de duas conexões do mesmo cliente para o mesmo servidor e mostre por que elas não colidem.",
            ref: "RFC 9293; registro de portas da IANA; man7.org: socket(7) e ss(8)."
          }),
        L("HTTP e HTTPS",
          "Interpretar requisições e respostas HTTP e distinguir HTTP de HTTPS.",
          "TCP, DNS e portas.",
          "HTTP é um pedido em texto: 'me dê esta página'; HTTPS é o mesmo pedido dentro de um envelope criptografado.",
          "HTTP é um protocolo cliente-servidor baseado em texto (RFC 9110 e RFC 9112). O cliente envia uma linha de requisição como GET /aula HTTP/1.1, acompanhada de cabeçalhos como Host, User-Agent e Accept; o servidor responde com uma linha de status, cabeçalhos como Content-Type e Content-Length e o corpo. Os métodos comuns são GET, POST, PUT, DELETE e HEAD.\n\nA resposta é classificada por códigos: 2xx indica sucesso (200 OK), 3xx redirecionamento (301 movido permanentemente, 304 não modificado), 4xx erro do cliente (404 não encontrado, 403 proibido) e 5xx erro do servidor (500, 503). O HTTP é stateless: cada requisição é independente, e estados de login ou carrinho são mantidos por cookies, sessões ou tokens. HTTP/1.1 reaproveita conexões; HTTP/2 multiplexa várias requisições em uma conexão e comprime cabeçalhos com HPACK.\n\nHTTPS não é um protocolo diferente na sintaxe: é HTTP transportado sobre TLS, normalmente na porta TCP 443, enquanto o HTTP puro usa a porta 80. A URL começa com https:// e o cadeado do navegador reflete a validação do certificado. O servidor pode ainda controlar cache com Cache-Control e ETag e enviar o corpo em pedaços quando seu tamanho não é conhecido de antemão.",
          [
            ["HTTP", "Protocolo de aplicação no qual o cliente solicita recursos e o servidor devolve respostas."],
            ["HTTPS", "HTTP transportado sobre TLS, com autenticação do servidor e comunicação criptografada."],
            ["código de status", "Número de três dígitos na resposta HTTP que indica sucesso, redirecionamento ou erro."],
            ["método GET", "Método HTTP que solicita uma representação de um recurso sem alterá-lo."],
            ["cabeçalho Host", "Cabeçalho obrigatório no HTTP/1.1 que informa o domínio e a porta desejados."]
          ],
          {
            ex: [["Leia uma requisição", "O cliente envia 'GET /aula HTTP/1.1' com Host: forge.example; o servidor responde '200 OK', Content-Type: text/html e o corpo com a página."], ["Interprete 301 e 404", "301 é redirecionamento permanente e vem com o cabeçalho Location apontando a nova URL; 404 significa que o recurso não foi encontrado, um erro do cliente e não do servidor."]],
            er: ["Achar que HTTPS muda a sintaxe das requisições HTTP.", "Usar GET para operações que alteram estado no servidor.", "Classificar o código 301 como erro do servidor."],
            lab: "Simulação: escreva em papel uma requisição GET e uma resposta 200 com dois cabeçalhos e depois transforme a resposta em 404.",
            ref: "RFC 9110; RFC 9112; Cloudflare Learning, artigos sobre HTTP (cloudflare.com/learning)."
          }),
        L("TLS no nível conceitual",
          "Explicar o que o TLS garante e como o handshake estabelece uma sessão segura.",
          "HTTP e HTTPS, TCP e noção de chaves públicas.",
          "TLS é um cofre: qualquer um vê que existe uma conversa, mas só as pontas leem o conteúdo e verificam a identidade.",
          "TLS (Transport Layer Security) protege a comunicação entre cliente e servidor oferecendo confidencialidade, integridade e autenticação da identidade do servidor por certificado X.509. A versão atual, TLS 1.3, é definida pelo RFC 8446; SSL é o predecessor obsoleto, embora o nome ainda apareça em configurações antigas.\n\nNo handshake típico do TLS 1.3, o cliente envia ClientHello com versões, suítes ciphers e um compartilhamento de chave efêmera; o servidor responde com ServerHello, certificado e seu próprio valor efêmero. A partir do segredo compartilhado, ambos derivam as chaves simétricas da sessão e trocam mensagens 'finished' que confirmam que a negociação não foi adulterada. O uso de chaves efêmeras, como ECDHE, dá perfect forward secrecy: vazar a chave privada do servidor não descriptografa sessões passadas.\n\nA cifra simétrica costuma ser AES-GCM ou ChaCha20-Poly1305, modos autenticados que já incluem verificação de integridade (AEAD). O TLS atua acima do TCP e abaixo da aplicação, então protege corpo e cabeçalhos HTTP, mas não esconde tudo: endereço IP, horário e, sem ECH, o nome do host no SNI podem ser observados. Ele também não protege um dispositivo comprometido nem substitui autorização na aplicação.",
          [
            ["TLS", "Protocolo de segurança da camada de transporte que fornece confidencialidade, integridade e autenticação."],
            ["certificado digital", "Documento X.509 que associa uma chave pública a uma identidade e é assinado por uma autoridade."],
            ["AEAD", "Modo de cifragem autenticada que protege confidencialidade e integridade ao mesmo tempo."],
            ["perfect forward secrecy", "Propriedade na qual a exposição de uma chave de longo prazo não revela sessões anteriores."],
            ["TLS 1.3", "Versão atual do TLS, definida no RFC 8446, com handshake mais curto."]
          ],
          {
            ex: [["Handshake resumido", "Cliente envia ClientHello com suítes e chave efêmera; servidor responde com certificado e sua chave; ambos derivam as chaves da sessão e trocam mensagens 'finished' autenticadas antes do primeiro dado HTTP."], ["O que é protegido", "Com HTTPS, o conteúdo da requisição viaja cifrado, mas a rede ainda vê IP, horário e volume de dados; sem ECH, o nome do host também aparece no SNI."]],
            er: ["Achar que o certificado criptografa os dados por si só: ele autentica, enquanto a cifra simétrica dá confidencialidade.", "Supor que TLS esconda todos os metadados da conexão.", "Tratar SSL como sinônimo atual de TLS sem ressalvar que SSL está obsoleto."],
            lab: "Simulação: desenhe em papel as duas idas e vindas do handshake TLS 1.3 e anote quais informações cada lado possui ao final.",
            ref: "RFC 8446; RFC 5280; Cloudflare Learning, seção SSL/TLS (cloudflare.com/learning/ssl)."
          }),
        L("DHCP",
          "Descrever como um cliente obtém IP, máscara, gateway e DNS automaticamente.",
          "IPv4, UDP e portas.",
          "DHCP é o porteiro que empresta um endereço IP por um tempo e cobra a renovação quando o prazo acaba.",
          "DHCP (RFC 2131) automatiza a configuração de rede. Um host recém-conectado ainda não tem IP próprio e usa 0.0.0.0 como origem e 255.255.255.255 como destino para enviar um Discover em broadcast pela UDP porta 67; o servidor responde com Offer contendo um endereço e opções. O cliente escolhe uma oferta, envia Request em broadcast e recebe o ACK confirmando o lease.\n\nEssa sequência é conhecida como DORA (Discover, Offer, Request, ACK). Além do IP e da máscara, o servidor entrega o gateway (opção 3), os servidores DNS (opção 6), o sufixo de domínio e o tempo de concessão. O cliente renova aos 50% do lease (T1) com uma requisição unicast ao servidor original e, se não obtiver resposta, tenta broadcast em T2, por volta de 87,5%.\n\nEm redes com vários segmentos, um agente relay (giaddr) encaminha as mensagens ao servidor central; reservas por endereço MAC dão IP fixo a impressoras e servidores, e um servidor falsificado é um risco real, mitigado por DHCP snooping. Para IPv6 há o DHCPv6 e, sobretudo, o SLAAC baseado em anúncios de roteador; o DNS pode chegar por RA, DHCPv6 ou configuração manual.",
          [
            ["DHCP", "Protocolo que distribui automaticamente endereços IP e opções de configuração aos clientes."],
            ["DORA", "Sequência Discover, Offer, Request, ACK usada para obter e confirmar um lease."],
            ["lease", "Concessão temporária de um endereço IP com prazo de validade definido."],
            ["DHCP relay", "Agente que encaminha mensagens DHCP entre redes quando o servidor não está na mesma LAN."],
            ["opção 3", "Opção DHCP que informa o endereço do roteador padrão da rede."]
          ],
          {
            ex: [["DORA passo a passo", "O cliente faz Discover; o servidor oferece 192.168.1.50/24; o cliente envia Request; o servidor responde ACK com lease de 3600 s, gateway 192.168.1.1 e DNS 1.1.1.1."], ["Renovação", "Após 1800 s, metade do lease, o cliente envia Request unicast ao servidor original; sem resposta, em cerca de 3150 s ele tenta broadcast para qualquer servidor."]],
            er: ["Achar que DHCP utilize TCP.", "Supor que o endereço obtido seja permanente e nunca precise de renovação.", "Confundir DHCP com DNS."],
            lab: "Simulação: escreva as quatro mensagens DORA no papel com as portas 67 e 68 e as opções recebidas pelo cliente.",
            ref: "RFC 2131; RFC 2132; man7.org: dhclient(8)."
          }),
        L("NAT",
          "Explicar a tradução de endereços e portas e suas consequências para conexões entrantes.",
          "IPv4 privado, portas e TCP/UDP.",
          "NAT é um porteiro com um único número externo que distribui ramais internos e lembra quem ligou para cada ramal.",
          "NAT (Network Address Translation) permite que hosts com endereços privados RFC 1918 — 10.0.0.0/8, 172.16.0.0/12 e 192.168.0.0/16 — acessem a Internet usando um ou poucos endereços públicos. O caso comum é o NAPT ou PAT (RFC 3022), que traduz IP e porta: o roteador reescreve a origem de 192.168.1.20:5000 para 203.0.113.1:62001 e registra o mapeamento em uma tabela de tradução.\n\nQuando a resposta volta, o roteador consulta a tabela pelo IP e porta externos e reescreve o destino para o host interno correto. Como a tradução usa a porta, dois hosts internos podem empregar a mesma porta local ao mesmo tempo sem colidir. Para admitir conexões iniciadas de fora é necessário port forwarding, DMZ ou mecanismos como UPnP; aplicações peer-to-peer recorrem a STUN e TURN quando não há mapeamento direto.\n\nNAT não é sinônimo de firewall e não impede que um host interno inicie conexões indesejadas, mas reduz a exposição direta dos hosts. Ele quebra a ideia de comunicação ponta a ponta e complica protocolos que carregam endereços dentro do payload. Em IPv6 ele tende a desaparecer; quando é preciso interligar IPv6 e IPv4, usa-se NAT64 (RFC 6146) com DNS64.",
          [
            ["NAT", "Tradução de endereços de rede que converte endereços internos em externos e vice-versa."],
            ["NAPT/PAT", "Forma de NAT que traduz também números de porta, permitindo vários hosts compartilharem um IP público."],
            ["tabela de tradução", "Registro temporário que associa endereço e porta internos a endereço e porta externos."],
            ["port forwarding", "Regra que encaminha conexões externas em uma porta para um host e uma porta internos."],
            ["RFC 1918", "Documento que reserva os intervalos de endereços IPv4 para uso privado."]
          ],
          {
            ex: [["Saída à Internet", "O host 192.168.1.20:5000 acessa 203.0.113.5:443; o roteador reescreve a origem para 203.0.113.1:62001, guarda o mapeamento e, no retorno, devolve os dados ao host interno."], ["Servidor interno", "Para publicar um servidor web que escuta na porta 8080 interna, configure port forwarding do externo 80 para 192.168.1.30:8080."]],
            er: ["Achar que NAT substitui o firewall e bloqueia qualquer ameaça.", "Esperar que um host externo inicie conexão com um interno sem mapeamento prévio.", "Confundir NAT com proxy de aplicação."],
            lab: "Simulação: preencha em papel uma tabela NAT para dois hosts internos usando a mesma porta 5000 e mostre como o roteador distingue as respostas.",
            ref: "RFC 3022; RFC 1918; RFC 6146; Cisco, documentação de NAT (docs.cisco.com)."
          }),
        L("Diagnóstico e noções de segurança",
          "Usar ping, traceroute e ss para investigar conectividade e aplicar firewall e menor privilégio com critério.",
          "ICMP e TTL, portas, TCP/UDP e DNS.",
          "Diagnosticar rede é fazer perguntas em ordem: há IP? há rota? a porta escuta? o firewall deixa passar?",
          "O diagnóstico funciona melhor em ordem, da camada 1 para a 7. Primeiro verifique endereço e rota com ip addr e ip route; depois teste o gateway com ping, que usa ICMP Echo (RFC 792), e um endereço público como 1.1.1.1. Se os IPs respondem mas o nome não, o problema é DNS; se nem o gateway responde, investigue ARP, VLAN, rota ou firewall local. Lembre-se de que ping pode ser bloqueado por política mesmo com o host online.\n\nO traceroute revela o caminho ao enviar pacotes com TTL crescente e coletar os ICMP Time Exceeded de cada roteador; asteriscos indicam perda ou filtragem, não necessariamente falha. No servidor, ss -tulpn mostra portas em LISTEN e ss -tnp mostra conexões estabelecidas; curl -v expõe a negociação TLS e os cabeçalhos HTTP. Em último caso, tcpdump captura pacotes para confirmar o que de fato chegou.\n\nFirewalls filtram tráfego por endereço, porta, protocolo e estado da conexão; a postura segura é negar por padrão e liberar apenas o necessário. O princípio do menor privilégio se aplica a contas, chaves SSH, capacidades de processo e escopo de tokens: dê apenas o acesso exigido pela tarefa e por tempo limitado. Diagnósticos devem ser feitos apenas em redes e hosts que você administra ou com autorização explícita.",
          [
            ["ping", "Ferramenta que envia ICMP Echo para testar alcance e medir perda e latência."],
            ["traceroute", "Ferramenta que usa TTL crescente para listar os roteadores no caminho até um destino."],
            ["ss", "Ferramenta Linux que lista sockets, portas em escuta e conexões estabelecidas."],
            ["firewall", "Mecanismo de filtragem de tráfego segundo regras de endereço, porta, protocolo e estado."],
            ["princípio do menor privilégio", "Prática de conceder apenas as permissões necessárias, pelo menor tempo possível."]
          ],
          {
            ex: [["Roteiro de falha", "Sem endereço em ip addr: investigue DHCP ou cabo. Ping no gateway falha: veja ARP, rota e VLAN. Gateway responde, mas 1.1.1.1 não: veja rota padrão, NAT ou firewall. IP responde, mas o nome não: o problema é DNS."], ["Porta fechada", "ss -tulpn não mostra :443 no servidor e curl -v recebe connection refused; após iniciar o serviço, ss mostra LISTEN e a conexão é estabelecida."]],
            er: ["Considerar que ping bloqueado significa host fora do ar.", "Abrir todas as portas para 'resolver' o problema de conectividade.", "Executar diagnósticos em redes de terceiros sem autorização."],
            lab: "Simulação: escreva em papel o roteiro ip route -> ping gateway -> ping 1.1.1.1 -> nome -> ss -tulpn e indique qual camada cada passo testa.",
            ref: "man7.org: ping(8), traceroute(8), ss(8) e ip(8); RFC 792; Cloudflare Learning, artigos sobre firewall (cloudflare.com/learning)."
          })
      ]
    }
  ]
};

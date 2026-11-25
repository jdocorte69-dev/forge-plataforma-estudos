/* ============================================================
   FORGE — data-security-systems.js
   Segurança, criptografia e confiabilidade (seções 11 e 9.5–9.9)
   Extensões de arquitetura, eletrônica e embarcados (seção 10)
   Fonte: Enciclopédia Mestre do Zero ao Avançado
   Carregar depois de data.js e data-systems.js, antes de app.js.
   ============================================================ */

CURRICULUM.security = {
  name: "Segurança, Criptografia e Confiabilidade",
  icon: "🔒",
  modules: [
    {
      name: "Fundamentos de segurança (11.1)",
      lessons: [
        L("Confidencialidade, integridade e disponibilidade",
          "Usar o triângulo CIA para classificar requisitos e consequências de uma falha.",
          "Noção de sistema, dados e processo.",
          "Segurança não é só esconder informação: é manter a promessa certa no momento certo.",
          "Confidencialidade impede leitura não autorizada; integridade impede alteração não autorizada ou não detectada; disponibilidade garante uso legítimo do serviço. Um mesmo incidente pode ferir mais de um eixo: apagar um banco ataca integridade e disponibilidade, enquanto vazar um token ataca confidencialidade.\n\nAntes de escolher controles, pergunte qual propriedade importa. Em um prontuário, integridade pode pesar mais que disponibilidade; em um site de vendas, a indisponibilidade tem custo imediato. Essa priorização orienta arquitetura, monitoramento e resposta a incidentes.\n\nOs três eixos também ajudam a escrever requisitos verificáveis. Em vez de 'o sistema deve ser seguro', escreva 'somente o dono do registro pode lê-lo' ou 'o serviço deve responder em 99,9% dos minutos'. Requisito mensurável permite teste e evolução.",
          [
            ["confidencialidade", "Propriedade de manter a informação acessível apenas a quem tem autorização."],
            ["integridade", "Propriedade de preservar a correção e a completude dos dados contra alterações não autorizadas."],
            ["disponibilidade", "Propriedade de manter o serviço utilizável por usuários legítimos quando necessário."],
            ["triângulo CIA", "Modelo clássico que organiza requisitos de segurança em confidencialidade, integridade e disponibilidade."],
            ["requisito verificável", "Afirmação sobre o sistema com condição e medida que permitem teste objetivo."]
          ],
          {
            ex: [
              ["Vazamento de token de sessão", "Confidencialidade comprometida: terceiro passa a agir como o usuário."],
              ["Rotação de log apagada", "Integridade e disponibilidade afetadas: perde-se a trilha e o serviço de auditoria falha."]
            ],
            er: [
              "Tratar segurança como sinônimo apenas de sigilo.",
              "Escrever requisitos como 'ser seguro' sem condição observável.",
              "Ignorar que um controle para um eixo pode prejudicar outro, como backups que protegem integridade mas exigem tempo de restauração."
            ],
            lab: "Liste cinco ativos de um sistema de estudos e classifique o eixo CIA mais crítico de cada um; justifique com uma frase.",
            ref: "OWASP Application Security Verification Standard — https://owasp.org/www-project-application-security-verification-standard/.",
            qs: [["Qual eixo é mais afetado quando um usuário altera o nome de outro no banco?", "integridade", "disponibilidade", "confidencialidade"]],
            derivation: "Para cada incidente, pergunte: houve leitura indevida, alteração indevida ou interrupção? A resposta aponta o eixo e o controle adequado.",
            workedExamples: [["Sensor de temperatura", "Confidencialidade baixa, integridade alta: uma leitura falsa pode acionar uma decisão errada."], ["Portal de matrícula", "Disponibilidade alta no período de inscrição; integridade alta no registro final."]],
            recallQuestions: ["O que distingue integridade de disponibilidade?", "Por que um requisito de segurança deve ser mensurável?"],
            masteryCriteria: ["Classifica corretamente incidentes nos três eixos.", "Reescreve uma frase vaga como requisito verificável."],
            tags: ["segurança", "CIA", "fundamentos", "requisitos"],
            estimatedEffort: 35
          }),
        L("Ativo, ameaça, vulnerabilidade, risco e controle",
          "Diferenciar os elementos de uma análise de risco e estimar prioridades sem confundir causa com consequência.",
          "Triângulo CIA e noção de requisito verificável.",
          "Pense em um cofre: o ativo é o que vale, a ameaça é quem quer abrir, a vulnerabilidade é a fechadura frouxa, o risco é a chance de prejuízo e o controle é o alarme.",
          "Ativo é qualquer coisa que tem valor para o negócio: dados, código, credenciais, reputação ou tempo de serviço. Ameaça é a circunstância ou agente que pode causar dano; vulnerability é uma fraqueza que a ameaça pode explorar. Sem ativo não há risco; sem vulnerabilidade, uma ameaça pode não converter em incidente.\n\nRisco é uma estimativa de probabilidade combinada com impacto. Modelos simples usam risco ≈ probabilidade × impacto; matrizes qualitativas (baixo, médio, alto) são aceitáveis quando não há dados. A estimativa serve para priorizar, não para fingir precisão. Controle é a medida que reduz probabilidade, impacto ou ambos: criptografia, permissão, teste, monitoramento, treinamento.\n\nUma análise útil registra a relação entre esses elementos em uma frase: 'Para o ativo X, a ameaça Y explora a vulnerabilidade Z, causando impacto W; o controle C reduz essa exposição'. Essa forma impede que a equipe trate ferramentas como fim e ajuda a justificar decisões.",
          [
            ["ativo", "Recurso com valor para a organização cuja proteção importa."],
            ["ameaça", "Agente ou circunstância com potencial para causar dano a um ativo."],
            ["vulnerabilidade", "Fraqueza em sistema, processo ou pessoa que pode ser explorada por uma ameaça."],
            ["risco", "Estimativa da probabilidade de um evento adverso combinada com seu impacto."],
            ["controle", "Medida técnica ou administrativa que reduz probabilidade ou impacto de um risco."]
          ],
          {
            ex: [
              ["Credencial em repositório", "Ativo: acesso ao serviço; ameaça: leitura por terceiros; vulnerabilidade: segredo versionado; controle: rotação e varredura de segredos."],
              ["Serviço sem backup", "Ameaça: falha de disco; impacto: perda de dados; controle: backup testado e restaurável."]
            ],
            er: [
              "Chamar qualquer bug de 'vulnerabilidade' sem indicar o ativo afetado.",
              "Confundir ameaça com vulnerabilidade: o agente não é a fraqueza.",
              "Achar que controle instalado elimina risco zero; controles reduzem exposição."
            ],
            lab: "Escreva três frases no formato ativo–ameaça–vulnerabilidade–impacto–controle para um projeto seu e ordene-as por risco estimado.",
            ref: "OWASP Threat Modeling Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html.",
            qs: [["Qual item é uma vulnerabilidade?", "Validação de entrada ausente", "Usuário curioso", "Servidor de banco"]],
            derivation: "Risco ≈ P(ameaça encontra vulnerabilidade) × impacto. Se o impacto for crítico, mesmo probabilidade baixa pode merecer tratamento prioritário.",
            workedExamples: [["Aplicação com SQL sem parâmetros", "Ativo: banco; ameaça: entrada maliciosa; vulnerabilidade: concatenação de SQL; controle: consulta parametrizada."], ["Laptop perdido", "Ativo: documentos; ameaça: leitura por terceiro; impacto: vazamento; controle: criptografia de disco e bloqueio remoto."]],
            recallQuestions: ["Por que um ativo é ponto de partida da análise?", "Como a estimativa de impacto muda a prioridade?"],
            masteryCriteria: ["Diferencia os cinco conceitos em exemplos novos.", "Produz uma matriz simples com justificativa de prioridade."],
            tags: ["risco", "ameaça", "vulnerabilidade", "controle"],
            estimatedEffort: 45
          }),
        L("Superfície de ataque e menor privilégio",
          "Reduzir pontos de entrada e limitar o que cada componente pode fazer mesmo após uma falha.",
          "Ativo, ameaça, vulnerabilidade e controle.",
          "Cada porta aberta é uma pergunta que o sistema precisa responder; cada permissão a mais é uma chave que pode ser perdida.",
          "Superfície de ataque é o conjunto de pontos pelos quais um agente pode interagir com o sistema: entradas de formulário, endpoints, arquivos, dependências, portas de rede e contas. Reduzi-la significa desativar o que não é usado, simplificar interfaces e validar o que entra. Nem toda redução é visível ao usuário, mas efeitos colaterais aparecem quando um recurso 'inofensivo' era usado por outro processo.\n\nMenor privilégio é conceder apenas as permissões necessárias, pelo menor tempo possível. Um processo que só lê um arquivo de configuração não precisa de acesso de escrita; um token de CI que publica documentação não precisa de acesso administrativo ao repositório. Contas de serviço devem ser separadas por função, e privilégios temporários devem expirar.\n\nA combinação das duas ideias limita o dano. Se uma entrada é explorada, o atingente encontra menos caminhos e, mesmo avançando, esbarra em permissões insuficientes. Isso é diferente de confiar que a entrada nunca será maliciosa: a suposição correta é que qualquer fronteira pode falhar.",
          [
            ["superfície de ataque", "Conjunto de pontos de interação por onde uma ameaça pode alcançar o sistema."],
            ["menor privilégio", "Princípio de conceder somente as permissões necessárias para a tarefa, pelo tempo necessário."],
            ["privilégio acumulado", "Situação em que um usuário ou serviço guarda permissões que não usa mais."],
            ["fronteira de confiança", "Limite onde dados ou código passam de um contexto de confiança para outro."],
            ["default deny", "Política que nega o acesso por padrão e libera apenas casos explicitamente autorizados."]
          ],
          {
            ex: [
              ["Serviço de relatórios", "Roda com usuário dedicado, sem senha de login e com leitura restrita ao diretório de dados."],
              ["Token de pipeline", "Escopo limitado a um repositório e validade curta, em vez de token global permanente."]
            ],
            er: [
              "Dar acesso administrativo 'só para facilitar' e nunca revogar.",
              "Achar que esconder uma porta resolve o risco sem autenticação ou validação.",
              "Reutilizar a mesma conta de serviço em produção e homologação."
            ],
            lab: "Em uma VM local autorizada, crie um usuário comum, execute id e tente ler um arquivo protegido; registre a negativa e remova o usuário ao final.",
            ref: "OWASP Secure Coding Practices Quick Reference Guide — https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/.",
            qs: [["O que significa menor privilégio?", "Conceder só o necessário por pouco tempo", "Dar acesso total a administradores", "Desativar todos os logs"]],
            derivation: "Dano potencial ≈ caminhos acessíveis × permissões efetivas. Reduzir um dos fatores reduz o dano mesmo que a exploração ocorra.",
            workedExamples: [["API de notas", "Expõe apenas GET e POST necessários; rota de administração não publicada e exigindo outro papel."], ["Container", "Executa como usuário não root, sistema de arquivos somente leitura e sem capacidades extras."]],
            recallQuestions: ["Como menor privilégio limita dano após uma falha?", "O que é uma fronteira de confiança?"],
            masteryCriteria: ["Enumera a superfície de ataque de um serviço simples.", "Reescreve permissões amplas em uma política default deny."],
            tags: ["menor privilégio", "superfície", "controle", "fundamentos"],
            estimatedEffort: 40
          }),
        L("Defesa em profundidade e segurança por padrão",
          "Combinar camadas de controle e escolher padrões seguros para reduzir a chance de uma única falha virar incidente.",
          "Superfície de ataque, menor privilégio e noção de controle.",
          "Não dependa de uma única tranca: use porta, alarme, câmera e vizinho atento, com a porta já fechada quando ninguém configura nada.",
          "Defesa em profundidade coloca várias barreiras independentes: validação no cliente e no servidor, autenticação, autorização, criptografia em trânsito e em repouso, logs e monitoramento. Se uma camada falha, outra ainda impede ou detecta o dano. Camadas não devem ser cópias da mesma checagem; diversidade de mecanismos é o que evita ponto único de falha.\n\nSegurança por padrão significa que a configuração inicial já é a segura: acesso negado até autorização explícita, TLS ativo, cookies com atributos protetores, dependências com versões corrigidas e mensagens de erro sem detalhes internos. O usuário precisa fazer um esforço consciente para enfraquecer a proteção, não para obtê-la.\n\nHá um custo: mais camadas exigem mais manutenção e podem criar falsa sensação de segurança se ninguém as testa. Cada controle deve ter um dono, um teste e uma métrica. O objetivo não é acumular ferramentas, mas garantir que uma falha humana ou de software encontre resistência antes de virar consequência.",
          [
            ["defesa em profundidade", "Estratégia de várias camadas de controle independentes para proteger um ativo."],
            ["segurança por padrão", "Princípio de entregar a configuração inicial já no estado mais seguro."],
            ["ponto único de falha", "Elemento cuja falha compromete todo o mecanismo de proteção."],
            ["falha segura", "Comportamento de negar acesso ou parar em estado protegido quando ocorre erro."],
            ["diversidade de controles", "Uso de mecanismos diferentes para que a mesma causa não derrube todas as barreiras."]
          ],
          {
            ex: [
              ["Formulário de login", "Validação no navegador melhora usabilidade; validação no servidor é a que protege."],
              ["Arquivo de configuração novo", "Já vem com acesso negado e TLS obrigatório; liberar uma exceção exige decisão registrada."]
            ],
            er: [
              "Confiar apenas na validação do navegador.",
              "Repetir a mesma checagem em duas camadas e chamar isso de defesa em profundidade.",
              "Deixar a configuração segura como tarefa manual do usuário final."
            ],
            lab: "Revise um formulário seu: liste a barreira no cliente, no servidor, no banco e no log. Indique qual falha cada uma cobre.",
            ref: "OWASP Cheat Sheet Series — https://cheatsheetseries.owasp.org/.",
            qs: [["O que caracteriza segurança por padrão?", "Configuração inicial já segura", "Usuário ativa proteção depois", "Apenas uma camada de controle"]],
            derivation: "Probabilidade de incidente cai quando eventos independentes precisam falhar ao mesmo tempo; se as camadas falham juntas, o ganho é pequeno.",
            workedExamples: [["Upload de arquivo", "Tipo permitido, tamanho limite, armazenamento fora da web, nome gerado e log sem conteúdo sensível."], ["Erro no serviço", "Falha fecha a conexão e registra código interno, sem expor stack trace ao cliente."]],
            recallQuestions: ["Por que camadas precisam ser independentes?", "O que muda quando o padrão é seguro?"],
            masteryCriteria: ["Identifica ponto único de falha em um desenho de controle.", "Propõe configuração inicial segura para um serviço novo."],
            tags: ["defesa em profundidade", "default", "fail-safe", "arquitetura"],
            estimatedEffort: 40
          })
      ]
    },
    {
      name: "Criptografia aplicada (11.2)",
      lessons: [
        L("Cifra simétrica e cifra assimétrica",
          "Escolher entre cifragem simétrica e assimétrica e explicar o problema da distribuição de chaves.",
          "Confidencialidade e integridade; noção de chave como segredo.",
          "Simétrica é um cofre com a mesma chave para trancar e abrir; assimétrica é uma caixa com fenda pública e chave privada que só o dono guarda.",
          "Na cifra simétrica, a mesma chave cifra e decifra. É rápida e adequada para grandes volumes; AES-GCM e ChaCha20-Poly1305 são modos autenticados que protegem confidencialidade e integridade juntos. O desafio é fazer a chave chegar às duas pontas sem ser copiada. Cifra assimétrica usa par de chaves: a pública pode ser distribuída, a privada permanece secreta. RSA e curvas elípticas resolvem a distribuição, mas são mais lentas e exigem parâmetros corretos.\n\nSistemas reais combinam as duas: a assimétrica autentica ou estabelece uma chave de sessão, e a simétrica protege o fluxo de dados. Isso aparece em TLS, mensageria e armazenamento. Usar apenas uma das famílias de forma ingênua deixa lacunas: chave simétrica reutilizada sem nonce único destrói a garantia do modo autenticado; chave privada vazada invalida a assimetria.\n\nNonce ou IV é valor único por operação com a mesma chave. Ele não precisa ser secreto, mas não pode repetir. Modos autenticados também produzem uma tag: se o ciphertext for alterado, a verificação falha. Criptografia sem autenticação pode ser modificada sem que o receptor perceba, mesmo que o atacante não leia o conteúdo.\n\nRegra absoluta: não implementar algoritmo criptográfico próprio para uso real. Qualquer código didático deve estar marcado explicitamente como educativo e nunca ser reaproveitado em produção.",
          [
            ["cifra simétrica", "Cifra que usa a mesma chave secreta para cifrar e decifrar."],
            ["cifra assimétrica", "Cifra que usa par de chaves: pública para cifrar ou verificar e privada para decifrar ou assinar."],
            ["AEAD", "Modo autenticado que fornece confidencialidade e integridade simultaneamente."],
            ["nonce", "Valor único usado uma vez com uma chave para tornar a cifragem segura."],
            ["tag de autenticação", "Valor curto calculado sobre os dados que permite detectar alteração no ciphertext."]
          ],
          {
            ex: [
              ["TLS em uma requisição HTTPS", "Assimétrica autentica o servidor e estabelece chave; simétrica protege os bytes da sessão."],
              ["Mesmo nonce repetido", "Em AES-GCM, repetir nonce com a mesma chave quebra a segurança do modo; gere nonce por mensagem."]
            ],
            er: [
              "Cifrar sem autenticar e supor que o receptor perceberá alterações.",
              "Reutilizar nonce com a mesma chave por preguiça de gerenciar estado.",
              "Escrever algoritmo próprio para uso real em vez de usar biblioteca revisada."
            ],
            lab: "Com uma biblioteca instalada, cifre e decifre uma frase com AES-GCM usando nonce aleatório; tente alterar um byte do ciphertext e observe a falha de autenticação.",
            ref: "OWASP Cryptographic Storage Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html; RFC 8446 (TLS 1.3) — https://www.rfc-editor.org/rfc/rfc8446.",
            qs: [["Qual modo protege confidencialidade e integridade juntos?", "AES-GCM", "AES-ECB sem tag", "Base64"]],
            derivation: "Custo de distribuição de chaves cresce com o número de pares em simétrica; a assimétrica troca esse custo por operações matemáticas mais caras e gestão de chave privada.",
            workedExamples: [["Mensagem curta", "Use biblioteca com AEAD e nonce único; MPHF embutido no ciphertext."], ["Arquivo grande", "Cifre o arquivo com chave de dados aleatória e proteja essa chave com uma chave mestra."]],
            recallQuestions: ["Por que modos autenticados são preferidos?", "O que acontece se o nonce repetir?"],
            masteryCriteria: ["Explica por que sistemas reais misturam os dois tipos de cifra.", "Reconhece nonce e tag em uma descrição de modo autenticado."],
            tags: ["criptografia", "AES", "AEAD", "chaves", "educativo"],
            estimatedEffort: 55
          }),
        L("Hash criptográfico, HMAC e assinatura digital",
          "Distinguir funções de hash, código de autenticação e assinatura, escolhendo cada uma para a finalidade correta.",
          "Cifra simétrica e assimétrica; noção de integridade.",
          "Hash é impressão digital; HMAC é impressão digital com segredo compartilhado; assinatura é impressão digital com chave privada que qualquer pessoa pode conferir.",
          "Hash criptográfico transforma dados de qualquer tamanho em valor de tamanho fixo. SHA-256 e SHA-3 são funções usadas para detectar alterações e como componente de outras primitivas. Um hash sozinho não autentica:qualquer pessoa pode recalcular o valor depois de modificar o arquivo. Para detectar alteração com segredo compartilhado, use HMAC, que combina a mensagem com uma chave secreta de forma rigorosa.\n\nAssinatura digital usa chave privada sobre o hash da mensagem; qualquer possessor da chave pública consegue verificar. Ela fornece autenticidade de origem, integridade e não repúdio prático, desde que a chave privada permaneça secreta. Não confunda com cifragem: assinar não esconde a mensagem.\n\nAlgumas funções antigas, como MD5 e SHA-1, sofrem com colisões práticas e não devem ser escolhidas para segurança nova. Também não se deve construir HMAC improvisado como hash(segredo || mensagem), pois há armadilhas como extensão de comprimento. Use a primitiva fornecida pela biblioteca e.compare resultados de forma constant-time quando o valor depender de segredo.",
          [
            ["hash criptográfico", "Função que gera resumo de tamanho fixo, resistente a colisão e pré-imagem."],
            ["HMAC", "Código de autenticação de mensagem baseado em hash e chave secreta compartilhada."],
            ["assinatura digital", "Valor gerado com chave privada que permite verificar origem e integridade com a chave pública."],
            ["verificação", "Procedimento que confirma assinatura ou HMAC usando a chave adequada."],
            ["colisão", "Situação em que duas mensagens diferentes produzem o mesmo resumo de hash."]
          ],
          {
            ex: [
              ["Download de instalador", "Assinatura com chave do mantenedor permite conferir origem sem compartilhar segredo."],
              ["Webhook", "HMAC do corpo com segredo compartilhado permite ao receptor confirmar que o evento veio do emissor."]
            ],
            er: [
              "Usar hash puro para autenticar mensagem.",
              "Escolher MD5 ou SHA-1 em projeto novo.",
              "Comparar HMAC com == em linguagem que vaza tempo de execução."
            ],
            lab: "Gere o hash de um arquivo, altere um byte e compare; depois gere um HMAC com chave local e repita. Registre qual dos dois detecta alteração sem revelar a chave.",
            ref: "OWASP Cryptographic Storage Cheat Sheet; RFC 2104 (HMAC) — https://www.rfc-editor.org/rfc/rfc2104; FIPS 180-4 (SHA) — https://csrc.nist.gov/pubs/fips/180-4/upd1/final.",
            qs: [["Qual primitiva usa chave privada para gerar e pública para verificar?", "assinatura digital", "HMAC", "hash simples"]],
            derivation: "Segurança de HMAC depende da chave secreta; segurança da assinatura depende da chave privada. Em ambos, o hash comprime a mensagem, mas não é a garantia por si só.",
            workedExamples: [["Token de API", "HMAC com segredo do servidor e comparação constant-time; token expira."], ["Release assinado", "Assinatura verificada antes da instalação; chave pública distribuída por canal confiável."]],
            recallQuestions: ["O que um hash sozinho não consegue provar?", "Por que HMAC e assinatura não são intercambiáveis?"],
            masteryCriteria: ["Escolhe corretamente entre hash, HMAC e assinatura para um cenário.", "Justifica a rejeição de MD5 e SHA-1."],
            tags: ["hash", "HMAC", "assinatura", "integridade"],
            estimatedEffort: 50
          }),
        L("Troca de chaves, certificados, PKI e TLS",
          "Entender como duas pontas que nunca se encontram estabelecem chave e identidade sem confiar cegamente na rede.",
          "Cifra assimétrica e assinatura digital; noção de rede cliente-servidor.",
          "A troca de chaves combina dois problemas: criar um segredo compartilhado e ter certeza de que o interlocutor é quem diz ser.",
          "Diffie-Hellman e sua variante em curvas elípticas permitem que duas partes cheguem a um segredo comum mesmo com a conversa observada. Sozinho, o protocolo não autentica: um intermediário pode conversar separadamente com cada ponta. Por isso a troca é autenticada, por exemplo com assinaturas ou certificados. ECDHE gera chave efêmera por sessão, o que dá sigilo perfeito para frente: vazar a chave privada de longo prazo não revela sessões passadas.\n\nCertificado X.509 liga uma chave pública a uma identidade e é assinado por uma autoridade certificadora. PKI é o conjunto de autoridades, cadeias de confiança, listas de revogação e regras de emissão. O cliente verifica a cadeia até uma âncora confiável, o domínio no certificado e a validade temporal. Falhar qualquer verificação deve encerrar a conexão.\n\nTLS 1.3 faz handshake autenticado e negocia suítes modernas, removendo algoritmos antigos. HSTS reduz rebaixamento para HTTP em navegadores. Certificados não provam que o site é honesto; provam apenas que a chave pública foi vinculada a um nome segundo as regras da cadeia. Ainda assim, sem essa verificação, cifrar não impediria interceptação.",
          [
            ["troca de chaves", "Protocolo que permite estabelecer chave compartilhada sem transmiti-la diretamente."],
            ["sigilo perfeito para frente", "Propriedade de sessões passadas permanecerem seguras mesmo após comprometimento de chave de longo prazo."],
            ["certificado X.509", "Documento digital que associa identidade a chave pública e é assinado por autoridade."],
            ["PKI", "Infraestrutura de chaves públicas que emite, distribui e revoga certificados."],
            ["TLS", "Protocolo de transporte seguro que autentica pontas e protege a comunicação."]
          ],
          {
            ex: [
              ["Navegador e site", "O cliente valida cadeia, nome e validade antes de enviar qualquer dado sensível."],
              ["Serviço interno", "Certificado de cliente faz autenticação mútua; não basta confiar na rede privada."]
            ],
            er: [
              "Aceitar certificado inválido para 'resolver' erro temporário.",
              "Confundir cifragem com autenticação da outra ponta.",
              "Reutilizar chave privada de longo prazo como chave de sessão."
            ],
            lab: "No navegador, abra um site HTTPS Autorizado e inspecione a cadeia de certificados: titular, emissor, validade e nome. Tente acessar com nome diferente e observe o aviso.",
            ref: "RFC 8446 — TLS 1.3, https://www.rfc-editor.org/rfc/rfc8446; RFC 5280 — PKIX, https://www.rfc-editor.org/rfc/rfc5280.",
            qs: [["O que um certificado X.509 vincula?", "Identidade a chave pública", "Senha a usuário", "IP a port"]],
            derivation: "Sem autenticação, troca de chaves é vulnerável a intermediário; com assinatura e cadeia de certificados, a chave obtida é vinculada a uma identidade verificável.",
            workedExamples: [["ECDHE_RSA", "Chave efêmera por sessão e autenticação por assinatura RSA."], ["Certificado expirado", "Falha de validade: o cliente deve recusar a conexão, não apenas avisar."]],
            recallQuestions: ["Por que ECDHE dá sigilo perfeito para frente?", "Quais verificações o cliente faz no certificado?"],
            masteryCriteria: ["Descreve o handshake sem confundir troca e autenticação.", "Interpreta uma cadeia de certificados básica."],
            tags: ["TLS", "PKI", "certificado", "rede", "diffie-hellman"],
            estimatedEffort: 60
          }),
        L("Aleatoriedade criptográfica e armazenamento de senhas",
          "Usar fontes de aleatoriedade adequadas e armazenar senhas com funções desenhadas para esse fim.",
          "Hash e HMAC; noção de segredo e autenticação.",
          "Senha não é para ser descriptografada: é para ser verificada contra um valor derivado com custo deliberado e sal único.",
          "CSPRNG é gerador de bits imprevisível, alimentado por entropia do sistema operacional. Math.random e equivalentes simples são rápidos, mas previsíveis e inadequados para chaves, nonces, tokens ou senhas. Em aplicações, use a API criptográfica da linguagem ou do sistema e deixe que ela colete entropia; não tente 'melhorar' com hora atual ou PID.\n\nArmazenar o hash simples da senha não é suficiente: ataques com tabelas arco-íris e GPUs exploram funções rápidas. Use KDF de senha com custo ajustável e memória, como Argon2id, scrypt ou bcrypt, com salt aleatório único por usuário. O salt não é segredo; ele impede que o mesmo valor derivado sirva para vários usuários. O parâmetro de custo deve ser calibrado para que o login seja aceitável, mas o ataque caro.\n\nCompare o resultado com operação de tempo constante, limite tentativas e ofereça MFA. Nunca registre senha em log, mensagem de erro ou telemetria. Se houver suspeita de vazamento, force redefinição e rotacione segredos relacionados; não tente 'consertar' o hash antigo.",
          [
            ["CSPRNG", "Gerador de números aleatórios criptograficamente seguro, imprevisível mesmo com observação parcial."],
            ["salt", "Valor aleatório único por senha, combinado antes da derivação para separar resultados iguais."],
            ["KDF de senha", "Função de derivação com custo ajustável, projetada para tornar ataques de força bruta caros."],
            ["Argon2id", "Função de derivação de senha resistente a ataques em CPU e GPU, com parâmetros de memória e tempo."],
            ["comparação constant-time", "Comparação cujo tempo não depende de onde os valores diferem."]
          ],
          {
            ex: [
              ["Cadastro novo", "Gere salt com CSPRNG, derive com Argon2id e armazene parâmetros, salt e resultado."],
              ["Login", "Repita a derivação com os parâmetros armazenados e compare em tempo constante."]
            ],
            er: [
              "Gerar token de redefinição com Math.random.",
              "Usar o mesmo salt para todos os usuários.",
              "Trocar KDF de senha por SHA-256 por ser 'mais rápido'."
            ],
            lab: "Em ambiente local, crie dois usuários com a mesma senha e salts diferentes; confirme que os valores armazenados diferem. Não use dados reais.",
            ref: "OWASP Password Storage Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html; RFC 9106 (Argon2) — https://www.rfc-editor.org/rfc/rfc9106.",
            qs: [["Por que usar salt único por usuário?", "Para impedir reuso do mesmo derivado", "Para esconder o algoritmo", "Para acelerar o login"]],
            derivation: "Custo de ataque ≈ custo por derivação × número de tentativas. KDF com memória e tempo aumenta o primeiro fator; salt impede amortizar trabalho entre contas.",
            workedExamples: [["Parâmetros", "Argon2id com memória e iterações calibradas; registre os parâmetros junto do hash para migração futura."], ["Token", "32 bytes do CSPRNG do sistema, enviados por canal seguro e com expiração curta."]],
            recallQuestions: ["Por que Math.random não serve para segurança?", "O que o salt resolve e o que não resolve?"],
            masteryCriteria: ["Escolhe CSPRNG para segredos e nonces.", "Descreve o fluxo de cadastro e login com KDF, salt e comparação segura."],
            tags: ["senha", "CSPRNG", "Argon2id", "salt", "autenticação"],
            estimatedEffort: 55
          }),
        L("Regras de ouro e implementações didáticas",
          "Fixar a fronteira entre estudo de criptografia e uso real, evitando código próprio em produção.",
          "Cifra simétrica, hash, TLS e armazenamento de senhas.",
          "Desmontar um motor na aula é ótimo; dirigir com o motor desmontado é imprudente.",
          "A regra central da Enciclopédia é explícita: não implementar algoritmo criptográfico próprio para uso real. Implementações didáticas são permitidas como exercício, mas devem ser marcadas de forma visível como educativas e inseguras. O rótulo faz parte do código, do README e da resposta escrita, para que ninguém reaproveite o experimento sem perceber.\n\nUso real significa bibliotecas mantidas, versões fixadas, parâmetros revisados e integração testada. Mesmo assim, erros de uso são comuns: nonce repetido, chave em repositório, modo sem autenticação, parâmetros fracos de KDF e confiança em timestamp local. Criptografia bem implementada falha sobretudo por interfaces mal usadas, não por matemática quebrada.\n\nGestão de chaves merece atenção equivalente: onde a chave nasce, quem pode lê-la, como rotacionar, como revogar e como descartar. Rotação sem plano pode tornar dados antigos ilegíveis; ausência de rotação transforma um vazamento em crise prolongada. Registre decisões e teste recuperação antes de precisar delas.\n\nEm resumo: use primitivas consolidadas, mantenha segredos fora do código, autentique sempre que possível, documente parâmetros e peça revisão de quem entende do assunto. Curiosidade didática é bem-vinda; heroísmo criptográfico não.",
          [
            ["implementação didática", "Código criado para aprender mecanismos, explicitamente marcado como inseguro e impróprio para produção."],
            ["biblioteca criptográfica", "Pacote mantido e revisado que fornece primitivas e modos seguros por padrão."],
            ["gestão de chaves", "Conjunto de decisões sobre geração, armazenamento, uso, rotação e descarte de chaves."],
            ["rotação de chaves", "Substituição planejada de chave com compatibilidade controlada para dados antigos."],
            ["revisão de segurança", "Exame por outra pessoa focado em uso correto de primitivas e tratamento de segredos."]
          ],
          {
            ex: [
              ["Cifra de César no caderno", "Exercício educativo: rotule 'educativo — inseguro' e nunca use fora da aula."],
              ["AES-GCM de biblioteca", "Uso real: chave do cofre, nonce único e tag verificada antes de confiar no dado."]
            ],
            er: [
              "Reaproveitar código de aula em serviço real.",
              "Guardar chave no mesmo repositório do código.",
              "Achar que escolher algoritmo famoso dispensa revisão de parâmetros e integração."
            ],
            lab: "Implemente uma cifra de substituição simples apenas como exercício educativo, marque o arquivo como inseguro e escreva três linhas explicando por que a versão real usa biblioteca.",
            ref: "OWASP Cryptographic Storage Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html; OWASP Cheat Sheet Series — https://cheatsheetseries.owasp.org/.",
            qs: [["O que o currículo determina sobre algoritmo criptográfico próprio?", "Não usar em uso real; marcar código didático como educativo", "Usar sempre que for simples", "Usar apenas em produção"]],
            derivation: "Risco de código próprio = bugs de implementação + erros de protocolo + ausência de revisão. Biblioteca consolidada reduz o primeiro termo, mas não elimina responsabilidade sobre os outros.",
            workedExamples: [["Arquivo de estudo", "Cabeçalho: 'Educativo. Não usar em produção. Inseguro por projeto.'"], ["Serviço real", "Dependência fixada, chave em cofre, nonce por mensagem e teste de falha de tag."]],
            recallQuestions: ["O que deve conter a marcação de uma implementação didática?", "Quais decisões fazem parte da gestão de chaves?"],
            masteryCriteria: ["Nunca propõe algoritmo próprio para uso real.", "Reconhece erro de uso mesmo quando algoritmo é correto."],
            tags: ["regras", "educativo", "chaves", "bibliotecas", "produção"],
            estimatedEffort: 40
          })
      ]
    },
    {
      name: "Segurança de software (11.3)",
      lessons: [
        L("Overflow de buffer, overflow de inteiro e use-after-free",
          "Reconhecer defeitos de memória e de aritmética que transformam dados do usuário em controle do processo.",
          "Noção de ponteiro, pilha, heap e tipos inteiros; noção de vulnerabilidade.",
          "Memória é um terreno com cercas: escrever além da cerca ou usar um terreno devolvido bagunça o vizinho.",
          "Overflow de buffer ocorre quando um programa escreve mais bytes do que o espaço reservado. Em C, funções sem limite como strcpy e gets são clássicas; o resultado pode corromper variáveis adjacentes, endereços de retorno e metadados do alocador. Overflow de inteiro acontece quando uma operação excede o intervalo do tipo: somar dois uint32_t pode girar para um valor pequeno, e um tamanho negativo pode virar gigante ao converter para unsigned.\n\nUse-after-free é o acesso a memória já liberada. O ponteiro continua apontando para o endereço, mas o alocador pode ter reutilizado a região para outro objeto. O comportamento é imprevisível e dependente de versão. Double free e dangling pointer são parentes próximos. Em linguagens com coleta de lixo, esses erros são menos diretos, mas ainda existem em código nativo, FFI e bibliotecas.\n\nA defesa combina escolhas de linguagem, limites explícitos e ferramentas: usar funções com tamanho, checar overflow antes de converter ou alocar, inicializar ponteiros a NULL após free, sanitizers em testes e fuzzing nas entradas. Corrigir o sintoma sem achar a causa costuma deslocar o bug para outro ponto.",
          [
            ["buffer overflow", "Escrita ou leitura fora dos limites de um bloco de memória alocado."],
            ["integer overflow", "Resultado aritmético que excede a faixa representável do tipo e é reduzido ou girado."],
            ["use-after-free", "Uso de ponteiro para memória que já foi liberada."],
            ["dangling pointer", "Ponteiro que aponta para objeto que não existe mais ou foi realocado."],
            ["sanitizer", "Instrumentação que detecta erros de memória e aritmética durante a execução."]
          ],
          {
            ex: [
              ["Tamanho girado", "Se n é negativo e vira unsigned antes de malloc, a alocação pode ser enorme e a cópia posterior estoura o destino."],
              ["Ponteiro devolvido", "Uma lista libera o nó e outro trecho ainda lê node->next; o valor agora pode pertencer a outro objeto."]
            ],
            er: [
              "Confiar que o compilador sempre avisa sobre overflow de inteiro.",
              "Achar que linguagem com GC elimina todos os problemas de memória do sistema.",
              "Corrigir um crash apenas aumentando o tamanho do buffer sem entender o limite real."
            ],
            lab: "Em um arquivo C isolado e autorizado, compile com -fsanitize=address,undefined um programa com cópia sem limite e observe o diagnóstico; corrija usando tamanho explícito.",
            ref: "CS:APP — Computer Systems: A Programmer's Perspective, Bryant & O'Hallaron; OWASP Input Validation Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html.",
            qs: [["O que é use-after-free?", "Acesso a memória já liberada", "Leitura de arquivo protegido", "Senha fraca"]],
            derivation: "Se índice ou tamanho controlado pelo usuário é usado sem checar limites, o programa escreve onde o atacante escolheu; se o tamanho gira, o limite deixou de existir.",
            workedExamples: [["strcpy para buffer fixo", "Substitua por cópia com tamanho conhecido e teste com Entrada maior que o destino."], ["Soma de tamanhos", "Verifique se a+b estoura antes de alocar; use tipo maior ou checagem explícita."]],
            recallQuestions: ["Como integer overflow pode virar overflow de buffer?", "Por que use-after-free é dependente de alocador?"],
            masteryCriteria: ["Explica a cadeia tamanho inválido → alocação errada → cópia fora do limite.", "Usa sanitizers em um teste de memória."],
            tags: ["memória", "C", "overflow", "use-after-free", "sanitizer"],
            estimatedEffort: 60
          }),
        L("Injeção e path traversal",
          "Impedir que dados de entrada sejam interpretados como código ou como caminho de arquivo não autorizado.",
          "Validação de entrada e noção de consulta ou comando interpretado.",
          "O erro é trocar mensagem por ordem: o usuário escreve um texto e o sistema obedece como se fosse comando.",
          "Injeção acontece quando dados são concatenados em uma linguagem interpretada. SQL é o caso clássico: uma aspas no campo de busca fecha a string e o restante vira cláusula. O mesmo vale para comandos de shell, consultas NoSQL, LDAP, headers e expressões. A correção não é 'escapar tudo' de forma improvisada, e sim separar código de dados usando consultas parametrizadas, prepared statements e APIs que aceitam argumentos estruturados.\n\nPath traversal ocorre quando entrada do usuário participa de um caminho de arquivo e '../' ou codificações equivalentes saem do diretório permitido. A defesa é resolver o caminho canônico e conferir se ele continua dentro da raiz autorizada, além de usar allowlist de nomes quando possível. Não basta remover a string '../' uma vez: codificações e caminhos alternativos podem burlar filtros ingênuos.\n\nValidação de entrada complementa, mas não substitui a separação. Whitelist de formatos, comprimento e caracteres reduz o espaço de entrada; ainda assim, o ponto onde o dado é interpretado precisa usar a primitiva segura. Mensagens de erro devem ser genéricas para o usuário e detalhadas apenas em logs internos, sem devolver consulta ou caminho completo.",
          [
            ["injeção", "Interpretação de dados de entrada como código ou comando pelo sistema."],
            ["SQL parametrizada", "Consulta em que valores são enviados separadamente da estrutura SQL."],
            ["path traversal", "Manipulação de caminho para acessar arquivo fora do diretório autorizado."],
            ["canonicalização", "Resolução do caminho à sua forma única e absoluta antes da checagem."],
            ["allowlist", "Lista explícita de valores aceitos; tudo o mais é recusado."]
          ],
          {
            ex: [
              ["Busca de produto", "Consulta parametrizada mantém a aspas como dado, não como fim de string SQL."],
              ["Download de anexo", "O nome do arquivo é validado e o caminho resolvido é conferido dentro da pasta de anexos."]
            ],
            er: [
              "Escapar aspas manualmente em vez de usar parâmetros.",
              "Remover '../' uma única vez e considerar o problema resolvido.",
              "Devolver a consulta SQL completa na mensagem de erro."
            ],
            lab: "Em aplicação deliberadamente vulnerável e isolada, compare uma consulta concatenada com a versão parametrizada; registre apenas a diferença de resultado, sem atacar sistemas externos.",
            ref: "OWASP SQL Injection Prevention Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html; OWASP Path Traversal — https://owasp.org/www-community/attacks/Path_Traversal.",
            qs: [["Qual defesa é correta contra injeção SQL?", "Consulta parametrizada", "Remover espaços da entrada", "Esconder o código fonte"]],
            derivation: "Se código e dado viajam no mesmo canal textual, o interpretador decide onde um termina; parâmetros criam canais separados e eliminam essa ambiguidade.",
            workedExamples: [["Nome de arquivo", "Aceite apenas [A-Za-z0-9_-] e rejeite barras; depois confira o caminho resolvido."], ["Filtro de status", "Use enum permitido em vez de aceitar texto livre e montar cláusula."]],
            recallQuestions: ["Por que escaping manual é frágil?", "Como canonicalização ajuda contra path traversal?"],
            masteryCriteria: ["Reescreve uma consulta concatenada em parametrizada.", "Valida um caminho dentro da raiz autorizada."],
            tags: ["injeção", "SQL", "path traversal", "validação", "entrada"],
            estimatedEffort: 50
          }),
        L("Autenticação fraca e autorização incorreta",
          "Separar provar identidade de decidir permissões e reconhecer falhas comuns em ambas.",
          "Hash e senhas; noção de sessão e papel.",
          "Autenticação responde 'quem é você'; autorização responde 'você pode fazer isso'. Uma resposta certa não garante a outra.",
          "Autenticação fraca inclui senhas previsíveis, ausência de MFA, tokens previsíveis, sessões que não expiram e fixation, em que o identificador de sessão é fixado antes do login. Após autenticar, é preciso regenerar o identificador. Credenciais devem ser verificadas com KDF de senha e comparação segura; tentativas repetidas merecem limite e backoff.\n\nAutorização incorreta aparece quando o sistema confia em parâmetro do cliente, como id de outro usuário na URL, sem conferir permissão no servidor. Isso é IDOR. RBAC associa papéis a permissões; ABAC considera atributos; em ambos, a decisão precisa ser centralizada e negada por padrão. Esconder botão na interface não é controle de acesso.\n\nA distinção prática é: um atacante pode estar autenticado como usuário comum e ainda tentar acessar recurso de administrador. Log de decisões de acesso ajuda a investigar. Testes devem cobrir usuário sem permissão, usuário com permissão parcial e token expirado, não apenas o fluxo feliz.",
          [
            ["autenticação", "Processo de verificar a identidade declarada por um usuário ou serviço."],
            ["autorização", "Processo de decidir se uma identidade autenticada pode executar uma ação."],
            ["IDOR", "Falha em que identificador de objeto do cliente é aceito sem verificação de permissão."],
            ["session fixation", "Ataque em que identificador de sessão é imposto antes da autenticação."],
            ["RBAC", "Modelo de controle de acesso baseado em papéis atribuídos a identidades."]
          ],
          {
            ex: [
              ["Troca de id na URL", "Mudar /notas/12 para /notas/13 não deve revelar nota de outra pessoa."],
              ["Após login", "O servidor gera novo identificador de sessão e marca o antigo como inválido."]
            ],
            er: [
              "Confiar em campo hidden ou em papel enviado pelo navegador.",
              "Usar contador sequencial como identificador de sessão.",
              "Implementar autorização somente na interface."
            ],
            lab: "Em ambiente isolado e autorizado, crie dois usuários e confirme que cada um lê apenas seus registros; tente alterar o id na requisição e verifique a recusa no servidor.",
            ref: "OWASP Authentication Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html; OWASP Authorization Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html.",
            qs: [["O que é IDOR?", "Objeto acessado sem checagem de permissão no servidor", "Senha curta", "Certificado expirado"]],
            derivation: "Permissão efetiva = identidade verificada ∩ política do recurso. Se um dos lados falta, a ação deve ser negada.",
            workedExamples: [["Papel de professor", "Pode ver notas da turma, mas não notas de outras turmas; a checagem usa turma do registro."], ["Token expirado", "Mesmo com assinatura válida, expiração impede o acesso."]],
            recallQuestions: ["Por que regenerar sessão após login?", "O que difere autenticação de autorização?"],
            masteryCriteria: ["Classifica falhas de autenticação e autorização em cenários novos.", "Escreve teste que tenta acesso entre usuários."],
            tags: ["autenticação", "autorização", "IDOR", "sessão", "MFA"],
            estimatedEffort: 50
          }),
        L("Segredos, dependências e validação de entrada",
          "Evitar exposição de credenciais, controlar dependências vulneráveis e tratar entrada como dado não confiável.",
          "Superfície de ataque e noção de build.",
          "Um segredo no repositório é como escrever a combinação do cofre na porta; uma dependência antiga é uma peça vencida dentro dele.",
          "Segredos incluem senhas, tokens, chaves privadas e strings de conexão. Não devem aparecer em código, histórico do Git, logs, mensagens de erro ou telemetria. Use variáveis de ambiente ou cofre, rotação e permissão restrita. Se um segredo vazou, rotacione-o; apagar o commit não basta porque o histórico e forks podem guardar o valor.\n\nDependências vulneráveis entram pelo lockfile, por bibliotecas transitivas e por imagens de container. Fixe versões, mantenha lockfile, acompanhe advisories, gere SBOM e atualize com critério de risco. A atualização automática sem testes pode quebrar comportamento; ignorar atualizações por anos é pior. Ferramentas de varredura ajudam, mas exigem triagem de falsos positivos.\n\nValidação de entrada deve acontecer na fronteira: tipo, faixa, comprimento e formato com allowlist. Normalize antes de validar quando houver codificações, e rejeite o que não é esperado em vez de tentar limpar. Validação não substitui parametrização nem autorização; ela reduz a superfície e torna erros mais cedo detectáveis. Trate também arquivos, cabeçalhos, parâmetros de query e dados vindos de filas.",
          [
            ["segredo", "Valor confidencial usado para autenticar ou assinar, como token, senha ou chave privada."],
            ["rotação de segredo", "Substituição controlada de credencial vazada ou antiga por nova."],
            ["dependência transitiva", "Biblioteca indireta trazida por outra dependência."],
            ["lockfile", "Arquivo que fixa versões exatas da árvore de dependências."],
            ["validação de entrada", "Verificação sistemática de tipo, formato e faixa de dados recebidos."]
          ],
          {
            ex: [
              ["Token versionado", "Chave de API em variável de ambiente do servidor, nunca em constantes do front-end."],
              ["Biblioteca antiga", "Varredura aponta CVE; equipe atualiza versão, roda testes e registra decisão."]
            ],
            er: [
              "Colocar chave de API em arquivo do navegador 'porque é só teste'.",
              "Achar que lockfile elimina necessidade de acompanhar advisories.",
              "Aceitar qualquer formato e tentar corrigir depois no banco."
            ],
            lab: "Em repositório local de estudo, execute uma ferramenta de varredura de segredos e de dependências disponível; registre achados e remova qualquer valor real antes de continuar.",
            ref: "OWASP Secrets Management Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html; OWASP Dependency-Check — https://owasp.org/www-project-dependency-check/.",
            qs: [["O que fazer após vazar um token?", "Rotacioná-lo", "Apenas apagar o commit", "Mudar o nome da variável"]],
            derivation: "Exposição de segredo = presença em código/histórico/log × tempo até rotação. Reduzir o primeiro sem o segundo deixa janela aberta.",
            workedExamples: [["Formulário", "Aceite somente e-mail com formato válido e no máximo 254 caracteres; rejeite o resto."], ["Lockfile", "Versão exata registrada, atualização revisada por diff e testes."]],
            recallQuestions: ["Por que apagar o commit não resolve vazamento?", "O que uma allowlist faz com entrada inesperada?"],
            masteryCriteria: ["Move segredo de código para mecanismo apropriado e rotaciona.", "Explica o papel do lockfile e da SBOM."],
            tags: ["segredos", "dependências", "SBOM", "validação", "entrada"],
            estimatedEffort: 50
          }),
        L("Tratamento de erros e falhas seguras",
          "Falhar sem vazar informação nem abrir acesso, mantendo diagnóstico útil para a equipe.",
          "Validação de entrada e noção de log.",
          "Erro bem tratado é como porta que tranca quando o alarme quebra: o usuário vê uma mensagem simples, a equipe recebe o detalhe.",
          "Mensagens destinadas ao usuário devem ser genéricas e acionáveis, sem stack trace, consulta SQL, caminho interno ou nome de usuário confirmado. Detalhes pertencem a log interno com nível, timestamp, ID de correlação e contexto suficiente, mas sem senhas ou tokens. Erros diferentes podem usar códigos estáveis para operação e suporte.\n\nFail-open é a decisão de permitir acesso quando uma checagem falha; fail-safe é negar ou parar em estado protegido. Autenticação e autorização devem falhar fechadas. Já alguns sistemas de disponibilidade preferem degradar funcionalidade, e essa escolha precisa ser explícita e documentada, não acidental.\n\nExceções não verificadas podem atravessar camadas e deixar recurso sem limpeza; use finally ou gerenciamento automático. Em uma exceção, não desfaça uma transação de forma parcial a ponto de deixar estado inválido. Repetir a mesma mensagem de erro para 'usuário inexistente' e 'senha errada' evita enumeração, embora isso deva ser combinado com limite de tentativas.",
          [
            ["fail-safe", "Comportamento de negar acesso ou parar em estado protegido quando ocorre falha."],
            ["fail-open", "Comportamento de permitir operação apesar da falha em um controle."],
            ["enumeração de usuários", "Descoberta de contas válidas por diferenças em mensagens ou tempo de resposta."],
            ["ID de correlação", "Identificador que liga eventos de diferentes componentes à mesma operação."],
            ["sanitização de log", "Remoção ou mascaramento de dados sensíveis antes de registrar eventos."]
          ],
          {
            ex: [
              ["Login inválido", "Usuário vê 'credenciais inválidas'; log registra código e ID, sem senha."],
              ["Falha no serviço de permissões", "Acesso negado e alerta interno, em vez de liberar tudo por padrão."]
            ],
            er: [
              "Exibir stack trace em produção.",
              "Permitir acesso quando a checagem de autorização lança exceção.",
              "Registrar corpo de requisição com token ou senha."
            ],
            lab: "Em uma função sua, provoque um erro e confirme que a resposta é genérica enquanto o log interno recebe código e ID de correlação sem dados sensíveis.",
            ref: "OWASP Error Handling Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html; OWASP Logging Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html.",
            qs: [["O que significa falhar seguro?", "Negar acesso quando a checagem falha", "Liberar acesso para não incomodar", "Exibir detalhes internos"]],
            derivation: "Risco de vazamento = detalhes internos expostos × probabilidade de erro. Risco de acesso indevido = decisão fail-open × probabilidade de falha do controle.",
            workedExamples: [["Mensagem única", "Mesmo texto para usuário inexistente e senha errada, com backoff nas tentativas."], ["Transação", "Validação falha: rollback completo e evento de log; nenhuma escrita parcial."]],
            recallQuestions: ["Por que não revelar qual parte da credencial estava errada?", "O que deve e o que não deve entrar no log?"],
            masteryCriteria: ["Separa mensagem pública de detalhe interno.", "Justifica escolha fail-safe em autenticação e autorização."],
            tags: ["erros", "fail-safe", "logs", "enumeração", "sanitização"],
            estimatedEffort: 45
          })
      ]
    },
    {
      name: "Laboratório seguro e responsável (11.4)",
      lessons: [
        L("Ambiente isolado e regras de engajamento",
          "Montar um laboratório que não afeta sistemas de terceiros e definir limites antes de qualquer prática.",
          "Fundamentos de risco, vulnerabilidade e controle.",
          "Laboratório é uma ilha: o que acontece nela fica nela, e só se entra com autorização escrita.",
          "Use máquinas virtuais, containers isolados, aplicações deliberadamente vulneráveis e redes privadas. O objetivo é aprender com artefatos feitos para isso, como OWASP Juice Shop, OWASP WebGoat ou DVWA, em ambiente sob seu controle. Modo host apenas quando necessário e compreendido; prefira redes internas ou bridge isolada. Nunca pratique contra sites, servidores ou contas de outras pessoas.\n\nAntes de executar, escreva as regras de engajamento: quem autorizou, qual é o escopo exato de hosts e serviços, qual é o objetivo de aprendizagem, quais ações são permitidas, quais são proibidas, janela de tempo e critério de parada. Autorização de um dono de sistema não autoriza saltar para redes conectadas. Em dúvida, pare e pergunte.\n\nIsolamento não é sinônimo de permissão irrestrita: containers podem compartilhar kernel e VM podem ter acesso à rede do host. Verifique portas publicadas, montagens de volume, credenciais do host em snapshot ou cópias de estado. Mesmo no laboratório, trate dados fictícios como dados reais para treinar disciplina de manuseio.\n\nA regra mais importante desta seção é simples: nenhuma ação ofensiva sem autorização explícita e escopo documentado. Se a atividade não cabe nessa frase, ela não faz parte do currículo.",
          [
            ["laboratório isolado", "Ambiente controlado, separado de sistemas de produção e de terceiros, usado para prática segura."],
            ["aplicação deliberadamente vulnerável", "Software criado com falhas conhecidas para treinamento autorizado."],
            ["rede privada", "Rede sem exposição pública, reservada ao ambiente de prática."],
            ["regras de engajamento", "Documento que define autorização, escopo, objetivo, ações permitidas e critério de parada."],
            ["autorização", "Permissão explícita do responsável legal pelo sistema para a atividade planejada."]
          ],
          {
            ex: [
              ["VM de estudo", "Rede interna apenas, sem portas publicadas no roteador e sem credenciais reais."],
              ["Serviço próprio", "Você é dono do ambiente, ainda assim registra objetivo e janela antes de testar."]
            ],
            er: [
              "Testar comando aprendido contra site público 'só para ver'.",
              "Publicar porta de laboratório na rede sem necessidade.",
              "Considerar autorização verbal vaga como escopo ilimitado."
            ],
            lab: "Escreva um plano de uma página antes da prática: autorização, escopo, objetivo, ações permitidas, proibidas, janela e critério de parada. Só execute depois que estiver completo.",
            ref: "OWASP WebGoat — https://owasp.org/www-project-webgoat/; OWASP Juice Shop — https://owasp.org/www-project-juice-shop/.",
            qs: [["Qual é a regra básica antes de qualquer ação ofensiva?", "Autorização explícita e escopo documentado", "Usar ferramenta famosa", "Fazer em rede pública"]],
            derivation: "Risco de dano colateral = superfície alcançável × ausência de limites. Isolar a rede reduz o primeiro fator; regras escritas reduzem o segundo.",
            workedExamples: [["Escopo", "Apenas a VM 192.168.56.10 e o serviço local na porta 8080; nada fora dessa lista."], ["Critério de parada", "Se qualquer erro afetar o host, encerrar a sessão e restaurar o snapshot."]],
            recallQuestions: ["O que deve conter um plano de engajamento?", "Por que uma VM ainda pode afetar o host?"],
            masteryCriteria: ["Produz plano com autorização, escopo, objetivo e parada antes de executar.", "Nunca propõe ação contra sistema sem autorização."],
            tags: ["laboratório", "autorização", "VM", "escopo", "isolamento"],
            estimatedEffort: 40
          }),
        L("Registro, execução e limpeza do laboratório",
          "Documentar comandos e evidências durante a prática e restaurar o ambiente ao final.",
          "Ambiente isolado e regras de engajamento.",
          "O laboratório termina quando o último comando foi registrado e o ambiente voltou ao estado limpo.",
          "Durante a sessão, mantenha um diário com data, autorização, escopo, objetivo, comandos executados, resultados observados e decisões. Registre o comando antes de executar quando possível; isso evita repetição acidental e facilita explicar cada passo. Evite colar comandos que você não entende: se não consegue prever o efeito, pare e pesquise.\n\nEvidências devem ser mínimas e fictícias: capturas sem dados reais, tokens de teste e nomes genéricos. Nunca copie segredo de ambiente real para dentro do laboratório nem traga artefato do laboratório para produção. Ao final, remova arquivos temporários, descarte snapshots contaminados, pare serviços, apague contas criadas e restaure a rede. Confira portas e processos antes de encerrar.\n\nO relatório de aprendizagem responde a quatro perguntas: o que se pretendia demonstrar, o que foi executado, o que foi observado e o que se faria diferente. Essa forma transforma prática em evidência de competência e evita que o laboratório vire coleta de comandos sem compreensão. Se algo saiu do escopo, interrompa, documente o ocorrido e comunique o responsável.",
          [
            ["trilha de auditoria", "Registro ordenado de ações, comandos e resultados que permite reconstruir a sessão."],
            ["escopo", "Conjunto explícito de sistemas e ações autorizados em uma atividade."],
            ["evidência mínima", "Registro suficiente para demonstrar o resultado sem expor dados desnecessários."],
            ["limpeza", "Remoção de artefatos, contas e configurações criados durante a prática."],
            ["critério de parada", "Condição acordada que interrompe a atividade imediatamente."]
          ],
          {
            ex: [
              ["Diário curto", "Objetivo: entender validação; comando: executar Suíte local; resultado: falha esperada; decisão: corrigir validação."],
              ["Fim de sessão", "Serviço parado, usuário temporário removido e snapshot descartado."]
            ],
            er: [
              "Executar sequência longa sem registrar cada comando.",
              "Guardar print com token real de outro ambiente.",
              "Deixar container rodando e esquecer volume criado."
            ],
            lab: "Conduza uma sessão curta no ambiente autorizado e entregue um relatório com seis campos: autorização, escopo, objetivo, comandos, resultados e limpeza.",
            ref: "OWASP Cheat Sheet Series — https://cheatsheetseries.owasp.org/; NIST SP 800-61 Rev. 2 — incident response (documento oficial NIST).",
            qs: [["O que deve aparecer no relatório final?", "Comandos, resultados e limpeza", "Apenas a senha usada", "Somente a ferramenta escolhida"]],
            derivation: "Rastreabilidade = registro completo de ações + estado final conhecido. Sem um dos dois, não é possível provar que a prática ficou contida.",
            workedExamples: [["Campo de comando", "Registre 'docker compose up -d' e a hora; evite anexar segredos do arquivo de ambiente."], ["Campo de limpeza", "docker compose down -v e verificação de portas; descreva o que ainda permaneceu."]],
            recallQuestions: ["Quatro perguntas do relatório de aprendizagem?", "Por que a limpeza é parte da competência?"],
            masteryCriteria: ["Entrega diário completo com autorização, escopo, objetivo, comandos e limpeza.", "Para imediatamente ao sair do escopo."],
            tags: ["laboratório", "diário", "limpeza", "evidência", "relatório"],
            estimatedEffort: 45
          })
      ]
    },
    {
      name: "Segurança no ciclo de desenvolvimento (9.9)",
      lessons: [
        L("Modelagem de ameaças com STRIDE",
          "Construir um diagrama simples e enumerar ameasças antes de escrever os controles.",
          "Ativo, ameaça, vulnerabilidade e risco; noção de fluxo de dados.",
          "Desenhe as setas primeiro: é nelas que os dados cruzam fronteiras e é ali que a ameaça aparece.",
          "Modelagem de ameaças é uma análise estruturada feita cedo, quando mudar o desenho ainda é barato. Comece com ativos, fronteiras de confiança e fluxo de dados. STRIDE organiza as perguntas: Spoofing (falsificar identidade), Tampering (alterar dados), Repudiation (negar autoria sem evidência), Information disclosure (expor informação), Denial of service (interromper serviço) e Elevation of privilege (ganhar permissão).\n\nPara cada fluxo, pergunte quais categorias se aplicam e registre a ameaça em uma frase. Depois associe controle e teste. Um diagrama simples com ator, processo, armazenamento e setas já é suficiente; não é necessário notação pesada para obter valor. O importante é que a equipe compartilhe o mesmo modelo.\n\nModelos envelhecem. Sempre que uma nova integração, fila ou permissão é adicionada, revisite o diagrama. A modelagem não substitui testes nem revisão de código: ela define o que testar e por quê. Sem ela, a equipe tende a proteger o que é visível e esquece caminhos indiretos, como reprocessamento de mensagens ou restauração de backup.",
          [
            ["modelagem de ameaças", "Análise sistemática de ativos, fluxos e ameaças para orientar decisões de segurança."],
            ["STRIDE", "Mnemônica com seis categorias: falsificação, adulteração, repúdio, exposição, negação de serviço e elevação de privilégio."],
            ["fronteira de confiança", "Limite entre componentes com diferentes níveis de confiança."],
            ["diagrama de fluxo de dados", "Representação de atores, processos, armazenamentos e caminhos da informação."],
            ["controle mitigador", "Medida adotada para reduzir uma ameaça identificada."]
          ],
          {
            ex: [
              ["Login", "Spoofing: credencial previsível; mitigação: MFA e KDF de senha."],
              ["Fila de eventos", "Tampering: mensagem alterada entre serviços; mitigação: assinatura e verificação no consumidor."]
            ],
            er: [
              "Fazer modelagem apenas depois do incidente.",
              "Listar ameaças sem associar controle e teste.",
              "Ignorar fronteiras entre serviços internos por achar que rede privada basta."
            ],
            lab: "Desenhe em papel um fluxo de login e marque uma ameaça STRIDE para cada etapa, com controle e teste correspondentes.",
            ref: "OWASP Threat Modeling Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html.",
            qs: [["Qual categoria STRIDE cobre exposição de informação?", "Information disclosure", "Spoofing", "Denial of service"]],
            derivation: "Cobertura = ameaças identificadas / fronteiras analisadas. Aumentar o número de fronteiras examinadas tende a revelar caminhos que o fluxo feliz não mostra.",
            workedExamples: [["Armazenamento", "Information disclosure: backups sem criptografia; controle: criptografia e controle de acesso."], ["Administração", "Elevação: parâmetro de papel vindo do cliente; controle: autorização centralizada."]],
            recallQuestions: ["O que STRIDE significa?", "Por que modelar cedo no ciclo?"],
            masteryCriteria: ["Produz diagrama com fronteiras e lista STRIDE ligada a controles.", "Atualiza o modelo ao introduzir nova integração."],
            tags: ["STRIDE", "ameaças", "DFD", "design", "SDLC"],
            estimatedEffort: 55
          }),
        L("SBOM e cadeia de suprimentos de software",
          "Inventariar componentes e entender como versões, assinaturas e procedência afetam a segurança.",
          "Dependências e lockfile; noção de build.",
          "Você não protege só o código que escreve: protege também tudo o que ele importa.",
          "SBOM é uma lista estruturada dos componentes que formam um software, com nomes, versões, identificadores e relações. Formatos comuns incluem CycloneDX e SPDX. Ela permite responder rapidamente 'usamos essa biblioteca vulnerável?' quando um advisory é publicado, em vez de procurar manualmente em vários repositórios.\n\nCadeia de suprimentos inclui dependências diretas e transitivas, imagens base, ferramentas de build e pipelines. Riscos típicos são versão sem fixação, pacote substituído, typo-squatting e artefato modificado entre build e deploy. Mitigações incluem lockfile, checksums, assinatura de artefatos, reprodução do build, restrição de registros e revisão de atualizações.\n\nSBOM não é relatório parado: precisa ser gerada a cada release e armazenada junto do artefato. Também não elimina triagem: advisories podem não se aplicar ao uso que você faz da biblioteca. O valor está na combinação de inventário, fixação de versões e processo de atualização com testes.",
          [
            ["SBOM", "Inventário estruturado dos componentes de software presentes em um artefato."],
            ["CycloneDX", "Formato padrão de SBOM voltado à segurança da cadeia de suprimentos."],
            ["SPDX", "Formato padrão para troca de informações de licenças e componentes."],
            ["proveniência", "Registro verificável de onde e como um artefato foi produzido."],
            ["typo-squatting", "Publicação de pacote com nome parecido com outro para induzir instalação enganosa."]
          ],
          {
            ex: [
              ["Advisory novo", "SBOM da última release mostra qual serviço contém a versão afetada."],
              ["Atualização", "Dependência transitiva muda de versão no lockfile; revisão mostra diff e testes passam."]
            ],
            er: [
              "Gerar SBOM uma vez e nunca atualizar.",
              "Instalar pacote com nome parecido sem verificar editor e downloads.",
              "Achar que lockfile protege contra pacote malicioso publicado com nome válido."
            ],
            lab: "Em projeto local de estudo, gere uma SBOM no formato disponível na ferramenta do ecossistema e identifique uma dependência transitiva; registre versão e origem.",
            ref: "CycloneDX — https://cyclonedx.org/; SPDX — https://spdx.dev/; OWASP Dependency-Check — https://owasp.org/www-project-dependency-check/.",
            qs: [["Para que serve uma SBOM?", "Inventariar componentes e versões", "Criptografar senhas", "Medir latência"]],
            derivation: "Tempo de resposta a advisory ≈ tempo para localizar componente + tempo para atualizar + tempo para validar. SBOM reduz o primeiro termo.",
            workedExamples: [["Release", "Artefato, SBOM e assinatura publicados juntos com o mesmo identificador de versão."], ["Pacote suspeito", "Conferir grafia, mantenedor, idade e diff antes de adicionar à dependência."]],
            recallQuestions: ["Quais formatos comuns de SBOM?", "O que proveniência acrescenta ao artefato?"],
            masteryCriteria: ["Gera e interpreta uma SBOM simples.", "Descreve pelo menos três riscos da cadeia de suprimentos."],
            tags: ["SBOM", "dependências", "suprimento", "CycloneDX", "SPDX"],
            estimatedEffort: 50
          }),
        L("SAST, DAST e revisão de código",
          "Combinar análise estática, análise dinâmica e olhar humano com expectativas realistas.",
          "Validação de entrada, injeção e tratamento de erros.",
          "SAST lê o código sem executar; DAST observa o sistema em execução; revisão entende a intenção.",
          "SAST examina código-fonte ou bytecode em busca de padrões de risco, sem precisar rodar a aplicação. Encontra cedo problemas como uso de função insegura e falta de validação, mas produz falsos positivos e pode perder falhas que dependem do contexto de execução. DAST testa a aplicação em execução, normalmente enviando entradas e observando respostas; vê o sistema montado, mas não mostra a linha de código e pode não cobrir caminhos internos.\n\nIAST e testes de segurança automatizados ocupam posições intermediárias. Nenhuma ferramenta substitui revisão: um revisor percebe que determinado parâmetro é confiável por contrato, ou que uma aparente vulnerabilidade está protegida por outra camada. Por outro lado, revisão cansa e não escala bem sozinha. O arranjo produtivo usa ferramentas como fila de suspeitos e revisores para decidir.\n\nAchados precisam de severidade, localização, explicação de impacto e critério de aceite. Corrigir apenas o alerta mais barato pode deixar o risco principal intacto. Integre os resultados ao fluxo de trabalho: bloqueie apenas o que tem critério claro, registre exceções com prazo e dono, e meça se a mesma classe de defeito reaparece.",
          [
            ["SAST", "Análise estática de segurança que examina código sem executá-lo."],
            ["DAST", "Análise dinâmica de segurança que testa a aplicação em execução."],
            ["falso positivo", "Alerta que indica problema onde não há risco real."],
            ["falso negativo", "Falha real que a ferramenta não detectou."],
            ["triage", "Processo de classificar achados por validade, severidade e prioridade."]
          ],
          {
            ex: [
              ["SAST cedo", "Pipeline sinaliza uso de função de consulta sem parâmetros antes do merge."],
              ["DAST em homologação", "Teste automatizado envia entrada suspeita e verifica que a resposta não revela detalhes internos."]
            ],
            er: [
              "Tratar todos os alertas de SAST como confirmados.",
              "Rodar DAST apenas em produção sem critério de parada.",
              "Desativar ferramenta porque havia falsos positivos, em vez de ajustar regras."
            ],
            lab: "Em aplicação didática e isolada, rode uma ferramenta de análise disponível, classifique um achado como verdadeiro ou falso positivo e registre a justificativa.",
            ref: "OWASP Source Code Analysis Tools — https://owasp.org/www-community/Source_Code_Analysis_Tools; OWASP Web Security Testing Guide — https://owasp.org/www-project-web-security-testing-guide/.",
            qs: [["Qual técnica analisa código sem executá-lo?", "SAST", "DAST", "Monitoramento"]],
            derivation: "Cobertura de detecção ≈ união de SAST, DAST e revisão. Cada técnica vê um recorte; sobreposição controlada reduz falsos negativos.",
            workedExamples: [["Alerta confirmado", "Concatenação de SQL parametrizável: alta severidade, correção com parâmetros e teste de regressão."], ["Alerta descartado", "String marcada pelo SAST é constante definida em código; registrar motivo do descarte."]],
            recallQuestions: ["Qual a diferença entre SAST e DAST?", "Por que revisão ainda é necessária?"],
            masteryCriteria: ["Escolhe SAST ou DAST conforme a pergunta.", "Faz triagem com impacto, evidência e critério de aceite."],
            tags: ["SAST", "DAST", "revisão", "testes", "triage"],
            estimatedEffort: 55
          }),
        L("Segredos de CI e resposta a incidentes",
          "Proteger o pipeline e preparar a equipe para detectar, conter e aprender com incidentes.",
          "Segredos e dependências; noção de pipeline e logs.",
          "CI é uma porta dos fundos com permissão de publicar: merece chave própria, curta e vigiada.",
          "Pipeline seguro usa identidade de trabalho com escopo mínimo, credenciais de curta duração quando possível e segredos em cofre do provedor, nunca em arquivos versionados. Logs de CI devem mascarar variáveis sensíveis. Pull requests de forks recebem permissões reduzidas; segredos não devem estar disponíveis para código não revisado. Artefatos são assinados ou verificados por checksum antes do deploy.\n\nResposta a incidentes segue ciclo: preparação, detecção e análise, contenção, erradicação, recuperação e lições aprendidas. Preparação inclui inventário, contatos, runbooks, relógio sincronizado e logs com retenção suficiente. Detecção depende de alertas acionáveis e de correlação entre sinais. Contenção pode isolar instância ou revogar token; erradicação remove causa; recuperação valida integridade antes de voltar.\n\nComunicação importa tanto quanto técnica: registre linha do tempo com horários, decisões e responsáveis. Preserve evidências antes de apagar o ambiente. Depois, converta lições em tarefas com dono e prazo: novo teste, alerta, permissão removida ou documento atualizado. Um incidente sem aprendizado tende a se repetir.",
          [
            ["pipeline seguro", "Sequência automatizada de build e validação com permissões mínimas e segredos protegidos."],
            ["credencial de curta duração", "Credencial emitida para uso imediato e com expiração automática."],
            ["resposta a incidentes", "Processo coordenado para detectar, conter, eliminar e aprender após um evento de segurança."],
            ["contenção", "Ação imediata para limitar o dano antes de remover a causa."],
            ["lições aprendidas", "Etapa final que transforma o incidente em mudanças verificáveis."]
          ],
          {
            ex: [
              ["Token em PR de fork", "Secreto não é exposto; job roda com permissão somente leitura."],
              ["Alerta de vazamento", "Token revogado, chave substituída e logs preservados para linha do tempo."]
            ],
            er: [
              "Expor segredos de produção a qualquer job de pull request.",
              "Apagar evidências antes de entender o alcance.",
              "Encerrar o incidente sem tarefa de melhoria com dono."
            ],
            lab: "Revise um workflow local: liste segredos usados, permissões do job e o que acontece se um PR externo disparar o pipeline; proponha três ajustes.",
            ref: "OWASP CI/CD Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Cheat_Sheet.html; NIST SP 800-61 Rev. 2 — Computer Security Incident Handling Guide.",
            qs: [["Primeira ação após detectar token vazado?", "Revogar e rotacionar com registro", "Ignorar até o próximo deploy", "Apagar todos os logs"]],
            derivation: "Dano de incidente ≈ tempo de detecção + tempo de contenção + alcance das credenciais. Reduzir cada termo requer preparação, não improviso.",
            workedExamples: [["Linha do tempo", "10h12 alerta; 10h18 contenção; 11h05 revogação; 13h00 recuperação validada."], ["Lição", "Adicionar varredura de segredos no pre-commit e restringir permissão do job."]],
            recallQuestions: ["Quais fases da resposta a incidentes?", "Por que segredos não devem ir para PR de fork?"],
            masteryCriteria: ["Configura permissões mínimas em pipeline de exemplo.", "Escreve plano de resposta com contenção, evidências e lições."],
            tags: ["CI", "segredos", "incidente", "runbook", "pipeline"],
            estimatedEffort: 60
          })
      ]
    },
    {
      name: "Observabilidade e depuração (9.5)",
      lessons: [
        L("Logs estruturados, métricas, traces e correlação",
          "Escolher o sinal certo para responder perguntas sobre comportamento em produção.",
          "Noção de requisição, serviço e erro tratado.",
          "Monitorar diz que algo está errado; observar permite perguntar por quê.",
          "Logs são eventos com tempo e contexto. Logs estruturados usam campos consistentes, como timestamp, nível, serviço e ID de correlação, permitindo consulta por campo. Métricas são medidas numéricas ao longo do tempo: contadores, gauges e histogramas. Traços distribuídos ligam as etapas de uma requisição entre componentes por meio do mesmo identificador, mostrando onde o tempo foi gasto.\n\nA média esconde a cauda: um serviço com média de 80 ms pode ter p99 de 2 s. Para objetivos de nível de serviço, use indicadores como proporção de sucesso e percentis de latência. Alertas devem ser acionáveis: se não há ação prevista, viram ruído e treinam a equipe a ignorá-los. Correlação é o que transforma três sinais separados em uma história única.\n\nObservabilidade exige disciplina de privacidade. Nunca registre senhas, tokens, corpo sensível ou dados pessoais desnecessários. Defina níveis de log e retenção, mascare campos e teste o que aparece no painel. Em aplicação client-side, telemetria coletada deve ser agregada, com consentimento quando aplicável e sem identificadores estáveis que não sejam necessários.",
          [
            ["observabilidade", "Capacidade de inferir o estado interno de um sistema a partir de sinais externos."],
            ["log estruturado", "Evento registrado em formato consistente, com campos consultáveis."],
            ["métrica", "Medida numérica agregada ao longo do tempo, como contador ou histograma."],
            ["traço distribuído", "Registro encadeado das etapas de uma requisição entre componentes."],
            ["SLO", "Objetivo mensurável de nível de serviço para um indicador de comportamento."]
          ],
          {
            ex: [
              ["Investigação", "ID de correlação no log do cliente liga falha a etapa lenta do serviço."],
              ["Percentil", "Média de 120 ms parece saudável enquanto p95 de 800 ms estoura o SLO."]
            ],
            er: [
              "Registrar token ou senha para 'facilitar depuração'.",
              "Usar apenas média de latência.",
              "Criar alerta sem limite claro nem ação definida."
            ],
            lab: "Instrumente uma função com log estruturado contendo timestamp, nível, operação e ID de correlação; confirme que nenhum segredo aparece.",
            ref: "Google SRE Book, cap. 6 — https://sre.google/sre-book/table-of-contents/; OpenTelemetry — https://opentelemetry.io/docs/.",
            qs: [["Qual sinal liga etapas de uma requisição entre serviços?", "traço distribuído", "log unstructured", "média simples"]],
            derivation: "Tempo de investigação cai quando os sinais compartilham chave comum; sem correlação, a equipe reconstrói o caminho manualmente.",
            workedExamples: [["Campo mascarado", "token=*** em vez do valor real; manter apenas os últimos quatro caracteres quando necessário."], ["Alerta", "p95 acima de 500 ms por 10 minutos aciona verificação de fila e rollback."]],
            recallQuestions: ["Quais são os três sinais clássicos?", "Por que percentis importam mais que média?"],
            masteryCriteria: ["Escolhe log, métrica ou traço conforme a pergunta.", "Produz log estruturado sem dados sensíveis."],
            tags: ["observabilidade", "logs", "métricas", "traces", "SLO"],
            estimatedEffort: 50
          }),
        L("Reprodução mínima, hipótese e causa raiz",
          "Conduzir depuração como experimento controlado em vez de tentativas aleatórias.",
          "Logs estruturados e noção de hipótese.",
          "Depurar é reduzir o sistema até que o bug caiba na palma da mão.",
          "Comece pelo menor caso que reproduz o sintoma: uma entrada, uma configuração, um usuário fictício. Reduzir o caso remove variáveis e torna a hipótese testável. Registre o comportamento esperado e o observado; se não há diferença explícita, o problema ainda não foi definido. Uma reprodução mínima também serve como teste de regressão depois da correção.\n\nFormule hipóteses em ordem de plausibilidade e custo: 'o cache devolve valor antigo' pode ser testado antes de 'o hardware está com falha'. Cada experimento altera uma variável e prevê o resultado. Se a previsão falha, a hipótese é descartada e o experimento vira evidência. Mudanças várias de uma vez impedem saber qual causal agiu.\n\nCausa raiz é diferente de sintoma. Reiniciar serviço pode restaurar disponibilidade, mas não explica o vazamento de memória. Análise de causa raiz pergunta quais condições permitiram o defeito existir e por que os controles não o detectaram. Em sistemas distribuídos, relógios e ordem de eventos complicam a narrativa; correlação e carimbos temporais confiáveis ajudam. Feche com teste, monitoramento ou alteração de processo que impeça repetição.",
          [
            ["reprodução mínima", "Menor configuração e entrada que ainda apresentam o problema."],
            ["hipótese", "Explicação provisória que gera previsão testável."],
            ["experimento controlado", "Teste que altera uma variável por vez para avaliar uma hipótese."],
            ["causa raiz", "Condição fundamental que permitiu o problema, distinta do sintoma observado."],
            ["teste de regressão", "Teste adicionado para garantir que um defeito corrigido não reapareça."]
          ],
          {
            ex: [
              ["Bug intermitente", "Reduza de mil requisições para uma sequência de três chamadas com estado conhecido."],
              ["Reinício que 'resolve'", "Sintoma tratado; falta explicar por que a memória crescia e por que o alerta não disparou."]
            ],
            er: [
              "Alterar várias configurações ao mesmo tempo e atribuir o resultado ao chute certo.",
              "Encerrar após reiniciar o serviço.",
              "Usar dados reais de produção no caso mínimo quando dados fictícios bastam."
            ],
            lab: "Escolha um defeito simples, escreva caso mínimo, formule duas hipóteses e registre o experimento que descartou cada uma; transforme a correção em teste.",
            ref: "Google SRE Book, cap. 12 — https://sre.google/sre-book/table-of-contents/; OSTEP — https://ostep.org/.",
            qs: [["O que é reprodução mínima?", "Menor caso que ainda mostra o problema", "Maior log possível", "Reinício do serviço"]],
            derivation: "Número de causas candidatas cai ao remover variáveis; cada experimento com previsão explícita elimina uma parte do espaço de busca.",
            workedExamples: [["Cache", "Hipótese: chave antiga; experimento: limpar chave e repetir; previsão: dado atual aparece."], ["Concorrência", "Hipótese: corrida; experimento: executar com uma thread; previsão: bug desaparece."]],
            recallQuestions: ["Por que mudar uma variável por vez?", "Como distinguir sintoma de causa raiz?"],
            masteryCriteria: ["Entrega reprodução mínima executável.", "Documenta hipótese, previsão e resultado de cada experimento."],
            tags: ["depuração", "causa raiz", "experimento", "regressão", "logs"],
            estimatedEffort: 45
          })
      ]
    },
    {
      name: "CI/CD e entrega segura (9.6)",
      lessons: [
        L("Pipeline de build, testes e artefatos imutáveis",
          "Montar uma sequência automatizada que falha cedo e produz um artefato rastreável.",
          "Git, build e noção de ambientes.",
          "O artefato testado deve ser o mesmo artefato implantado; recompilar no deploy é criar outro objeto com o mesmo nome.",
          "Integração contínua significa integrar mudanças frequentemente ao tronco comum e disparar build e testes a cada alteração. Um pipeline típico executa instalação de dependências, lint, análise estática, testes unitários, testes de integração, build e publicação do artefato. Etapas baratas e rápidas vêm primeiro para dar feedback cedo. O resultado precisa ser auditável: logs, status por etapa e identificador da execução.\n\nArtefato imutável é o pacote versionado gerado uma vez e promovido entre ambientes. Se homologação e produção recompilam o código, diferenças de dependência ou sinalizador podem invalidar o que foi testado. A promoção usa o mesmo arquivo e registra hash, versão e proveniência. Feature flags separam deploy de ativação de funcionalidade.\n\nPipeline seguro complementa: permissões mínimas, segredos do cofre, mascaramento em logs e verificação de dependências. Falha em etapa de segurança deve ser tratada como falha de build, com exceções registradas e prazo. Velocidade sem critério de qualidade apenas entrega defeitos mais rápido; o objetivo é feedback confiável e reproduzível.",
          [
            ["integração contínua", "Prática de integrar mudanças frequentemente com build e testes automáticos."],
            ["artefato imutável", "Pacote versionado gerado uma vez e reaproveitado em todos os ambientes."],
            ["promoção", "Ação de mover o mesmo artefato para o próximo ambiente sem reconstruí-lo."],
            ["feature flag", "Interruptor de configuração que ativa ou desativa funcionalidade sem novo deploy."],
            ["feedback rápido", "Intervalo curto entre a mudança e o resultado dos checks automáticos."]
          ],
          {
            ex: [
              ["Push que quebra teste", "Pipeline fica vermelho e bloqueia merge enquanto o contexto da mudança está fresco."],
              ["Mesmo pacote", "Homologação e produção recebem o mesmo hash de artefato; apenas configuração muda."]
            ],
            er: [
              "Recompilar em cada ambiente 'para pegar a versão mais recente'.",
              "Manter pipeline que só compila.",
              "Publicar artefato sem versão nem hash registrado."
            ],
            lab: "Descreva um pipeline para um projeto seu com cinco etapas ordenadas por custo, indicando qual artefato é promovido e onde o hash é registrado.",
            ref: "GitHub Actions — https://docs.github.com/actions; Google SRE Book, cap. 8 — https://sre.google/sre-book/table-of-contents/.",
            qs: [["O que é artefato imutável?", "Mesmo pacote promovido entre ambientes", "Código recompilado no deploy", "Log de execução"]],
            derivation: "Confiabilidade da entrega cresce quando a variação entre ambientes cai; promover o mesmo artefato elimina variação de build.",
            workedExamples: [["Ordem das etapas", "lint → unidade → análise estática → integração → build → publicação."], ["Flag", "Código já implantado, função liberada só para um grupo após validação."]],
            recallQuestions: ["Por que falhar cedo é valioso?", "O que muda quando se promove artefato em vez de recompilar?"],
            masteryCriteria: ["Desenha pipeline com etapas ordenadas e artefato rastreável.", "Explica separação entre deploy e ativação."],
            tags: ["CI", "CD", "artefato", "build", "feature flag"],
            estimatedEffort: 45
          }),
        L("Ambientes, deploy e rollback",
          "Planejar mudanças com caminho de volta e critérios explícitos de sucesso.",
          "Pipeline de build e noção de configuração.",
          "Deploy é uma mudança controlada, não um ato de fé: sempre existe critério para continuar e critério para voltar.",
          "Ambientes típicos são desenvolvimento, homologação e produção, com dados e permissões proporcionais. Usar dados reais de produção em homologação aumenta risco de vazamento; mascaramento ou dados sintéticos são preferíveis. Configuração difere de código: variáveis, segredos e endpoints mudam por ambiente e devem ser rastreáveis sem versionar valores sensíveis.\n\nEstratégias de deploy incluem recreação simples, blue-green e canário. Blue-green mantém duas versões e alterna o tráfego; canário expõe a mudança a uma fração de usuários e amplia gradualmente. As duas reduzem blast radius, mas exigem observabilidade para comparar erro e latência entre versões. Feature flags permitem desativar comportamento sem novo build.\n\nRollback é voltar a versão anterior quando os critérios falham. Ele precisa ser testado antes de ser necessário: migrações de banco incompatíveis podem impedir voltar o código. Por isso, mudanças de esquema costumam seguir padrão expandir e contrair, com compatibilidade temporária entre versões. Defina limiar de erro, latência e janela de observação antes do deploy; durante a mudança, a decisão deve ser quase automática.",
          [
            ["ambiente", "Contexto isolado com configuração e dados próprios para uma etapa do ciclo."],
            ["deploy blue-green", "Estratégia com duas versões paralelas e alternância controlada de tráfego."],
            ["deploy canário", "Estratégia que expõe a nova versão a uma pequena fração antes da ampliação."],
            ["blast radius", "Extensão do impacto de uma mudança ou falha."],
            ["rollback", "Procedimento de retorno a uma versão anterior quando critérios não são atendidos."]
          ],
          {
            ex: [
              ["Canário", "5% do tráfego na versão nova; se p95 piorar, tráfego volta antes de ampliar."],
              ["Migração", "Adicionar coluna nova antes do deploy; remover coluna antiga apenas após todas as versões migrarem."]
            ],
            er: [
              "Usar dump real de produção em homologação sem mascaramento.",
              "Achar que rollback de código resolve mudança incompatível de banco.",
              "Fazer deploy sem limiar de erro definido."
            ],
            lab: "Escreva um plano de deploy com critérios de sucesso, limiar de abort e passo de rollback; inclua o que é feito com dados de produção.",
            ref: "Google SRE Book, cap. 8 — https://sre.google/sre-book/table-of-contents/; Martin Fowler — Feature Toggles, https://martinfowler.com/articles/feature-toggles.html.",
            qs: [["O que um deploy canário reduz?", "raio de impacto", "Tamanho do repositório", "Número de testes"]],
            derivation: "Impacto ≈ fração exposta × severidade do defeito. Canário reduz a fração; monitoramento reduz o tempo até detectar severidade.",
            workedExamples: [["Critério", "Taxa de erro acima de 1% por 5 minutos aborta a promoção."], ["Configuração", "Mesmo artefato, variáveis por ambiente e segredos injetados pelo cofre."]],
            recallQuestions: ["Como blue-green e canário diferem?", "Por que rollback pode falhar após migração de banco?"],
            masteryCriteria: ["Produz plano com critério de abort e rollback testado.", "Explica compatibilidade em mudanças de esquema."],
            tags: ["deploy", "rollback", "canário", "ambientes", "configuração"],
            estimatedEffort: 50
          })
      ]
    },
    {
      name: "Sistemas distribuídos e confiabilidade (9.8)",
      lessons: [
        L("Falhas parciais, latência e relógios",
          "Raciocinar sobre sistemas nos quais uma parte falha enquanto o resto continua funcionando.",
          "Redes, noção de requisição e observabilidade.",
          "Em sistema distribuído, 'o serviço está fora' é apenas um dos casos: mais comum é estar lento, dividido ou incerto.",
          "Falhas parciais surgem quando um componente responde, outro não responde e ninguém tem visão completa. Uma requisição pode ter chegado ao servidor e a resposta ter se perdido; o cliente não sabe se a ação ocorreu. Latência é uma forma de falha: tempo limite curto gera repetições, tempo longo prende recursos. A incerteza é a regra, não exceção.\n\nRelógios locais não concordam exatamente. Relógio de parede pode saltar por NTP; relógio monotônico avança sem voltar e serve para medir duração. Ordenar eventos apenas por timestamp é perigoso. Relógios lógicos e vetores capturam precedência parcial; consenso resolve ordem quando é necessário, com custo de coordenação.\n\nConfiabilidade começa com premissas explícitas: o que acontece se a mensagem duplicar, atrasar ou chegar fora de ordem? Timeouts, circuit breakers e carga com backoff evitam que uma lentidão local vire avalanche. Observe p95 e p99, não média. Projete para degradar: se um serviço auxiliar falha, a função principal pode continuar com valor em cache, desde que isso seja aceitável e declarado.",
          [
            ["falha parcial", "Situação em que some componentes falham ou ficam lentos enquanto outros continuam."],
            ["latência", "Tempo decorrido entre o início e o fim de uma operação."],
            ["relógio monotônico", "Relógio que avança regularmente e nunca retrocede, usado para medir intervalos."],
            ["timeout", "Limite de espera após o qual a operação é considerada falha ou incerta."],
            ["circuit breaker", "Mecanismo que interrompe chamadas repetidas a um dependente falhando."]
          ],
          {
            ex: [
              ["Resposta perdida", "Servidor gravou Pedido, mas cliente recebeu timeout; repetir pode duplicar sem idempotência."],
              ["NTP ajustando hora", "Timeout medido com relógio de parede pode ficar negativo; use relógio monotônico."]
            ],
            er: [
              "Confiar que ordem de chegada é ordem de ocorrência.",
              "Usar média de latência para definir timeout.",
              "Retentar imediatamente sem backoff quando o dependente está sobrecarregado."
            ],
            lab: "Desenhe três cenários de falha parcial para um serviço de notas e escreva o comportamento esperado do cliente em cada um.",
            ref: "Google SRE Book, cap. 22 — https://sre.google/sre-book/table-of-contents/; OSTEP — https://ostep.org/.",
            qs: [["Qual relógio serve para medir duração?", "Monotônico", "De parede com ajuste NTP", "Timestamp de arquivo"]],
            derivation: "Incerteza ≈ (perda de resposta + atraso) × ausência de identificador de operação. Idempotência e timeout bem escolhido reduzem o efeito.",
            workedExamples: [["Timeout", "p95 de 200 ms e limite de 500 ms; acima disso, aborta e aplica backoff."], ["Circuit breaker", "Após 5 falhas consecutivas, abre por 30 s e tenta uma chamada de sondagem."]],
            recallQuestions: ["Por que timeout não prova que a ação não aconteceu?", "O que mede um relógio monotônico?"],
            masteryCriteria: ["Lista falhas parciais em um fluxo simples.", "Escolhe relógio e timeout adequados para medição."],
            tags: ["distribuído", "latência", "timeout", "relógios", "confiabilidade"],
            estimatedEffort: 55
          }),
        L("Replicação, consenso e consistência",
          "Entender o Trade-off entre disponibilidade, durabilidade e concordância entre réplicas.",
          "Falhas parciais e noção de armazenamento.",
          "Copiar dados resolve perda, mas cria uma nova pergunta: qual cópia está certa agora?",
          "Replicação aumenta durabilidade e disponibilidade, mas introduz sincronização. Replicação síncrona espera confirmação das réplicas antes de responder; é mais segura contra perda, porém mais lenta e sensível a falha de uma parte. Assíncrona responde rápido e pode perder escritas recentes se o primário falhar. Quórum pondera leitura e escrita para equilibrar esses efeitos.\n\nConsenso é o mecanismo pelo qual vários nós concordam sobre um valor ou ordem, tolerando falhas. Visão introdutória basta: líder eleito, maioria e log replicado. Sem maioria, o sistema para de aceitar escritas em vez de aceitar valores divergentes. Entender isso explica por que 'adicionar um nó' pode reduzir disponibilidade se a maioria se perde.\n\nConsistência eventual afirma que, sem novas atualizações, as réplicas tendem a convergir. Antes disso, leituras podem ver valores diferentes. Modelos mais fortes, como linearizabilidade, tornam o sistema parecer uma única cópia, com custo de coordenação. Escolha depende do requisito: saldo bancário e carrinho de compras não toleram a mesma coisa. Documente a garantia oferecida e teste-a com falhas simuladas em ambiente autorizado.",
          [
            ["replicação", "Manutenção de múltiplas cópias de dados em nós diferentes."],
            ["consenso", "Protocolo pelo qual nós chegam a acordo sobre valor ou ordem apesar de falhas."],
            ["quórum", "Número mínimo de réplicas que participa de uma operação para mantê-la válida."],
            ["consistência eventual", "Garantia de que réplicas convergem na ausência de novas atualizações."],
            ["linearizabilidade", "Modelo no qual operações parecem ocorrer instantaneamente em uma única cópia."]
          ],
          {
            ex: [
              ["Escrita com quórum", "Primário grava em maioria antes de confirmar; se não há maioria, recusa."],
              ["Feed", "Consistência eventual aceitável: novo comentário aparece com atraso, mas não some."]
            ],
            er: [
              "Achar que replicação assíncrona garante durabilidade imediata.",
              "Prometer consistência forte sem pagar custo de coordenação.",
              "Adicionar nós sem recalcular quórum e tolerância a falha."
            ],
            lab: "Simule em papel três réplicas com uma indisponível: diga quantas escritas ainda são possíveis sob maioria e o que acontece com leituras.",
            ref: "Google SRE Book, cap. 22 — https://sre.google/sre-book/table-of-contents/; OSTEP, capítulos sobre distribuição — https://ostep.org/.",
            qs: [["O que exige maioria em consenso?", "Acordo sobre valor ou ordem", "Criptografia de senha", "Compilação"]],
            derivation: "Tolerância a falhas em sistema de maioria: com 2f+1 nós, ainda há maioria se até f falharem. Mais nós aumentam custo de escrita e podem reduzir disponibilidade se mal configurados.",
            workedExamples: [["Três nós", "Dois formam maioria; um pode falhar sem parar escritas."], ["Eventual", "Atualização propagada por fila; leitura imediata pode ver valor antigo."]],
            recallQuestions: ["Qual diferença entre replicação síncrona e assíncrona?", "O que garante consistência eventual?"],
            masteryCriteria: ["Calcula quórum simples e tolerância a falha.", "Escolhe modelo de consistência com justificativa de requisito."],
            tags: ["replicação", "consenso", "quórum", "consistência", "distribuído"],
            estimatedEffort: 60
          }),
        L("Idempotência, retries, backoff e filas",
          "Projetar operações repetidas por segurança e evitar que recuperação vire sobrecarga.",
          "Falhas parciais e noção de fila.",
          "Se o botão pode ser apertado duas vezes, o sistema precisa tratar a segunda como a primeira.",
          "Operação idempotente produz o mesmo efeito quando executada mais de uma vez. Chave de idempotência enviada pelo cliente permite ao servidor reconhecer repetição e devolver resultado anterior. PUT de recurso com estado completo costuma ser idempotente; POST de criação não é, salvo com chave explícita. Sem isso, timeout seguido de retry duplica cobrança ou mensagem.\n\nRetry deve ter limite, jitter e backoff exponencial. Repetir imediatamente em sincronia com muitos clientes cria thundering herd: todos voltam no mesmo instante e derrubam o dependente novamente. Backoff aumenta o intervalo; jitter aleatoriza para espalhar tentativas. Circuit breaker complementa ao parar chamadas enquanto o serviço está claramente sobrecarregado.\n\nFilas desacoplam produtor e consumidor e absorvem picos, mas exigem entrega pelo menos uma vez ou no máximo uma vez. Na prática, entrega pelo menos uma vez é comum, então o consumidor precisa ser idempotente. Mensagens podem ficar em dead-letter queue após falhas repetidas. Monitore profundidade da fila e idade da mensagem mais antiga: são sinais de saúde mais honestos que contador de publicações.",
          [
            ["idempotência", "Propriedade de produzir mesmo efeito após execuções repetidas da mesma operação."],
            ["chave de idempotência", "Identificador enviado com a requisição para deduplicar tentativas."],
            ["backoff exponencial", "Estratégia que aumenta o intervalo entre tentativas após falhas."],
            ["jitter", "Aleatoriedade adicionada ao intervalo de retry para evitar sincronização."],
            ["dead-letter queue", "Fila para mensagens que falharam repetidamente e exigem tratamento separado."]
          ],
          {
            ex: [
              ["Pagamento", "Mesma chave de idempotência em duas tentativas gera uma única cobrança."],
              ["Fila", "Consumidor aplica efeito uma vez e registra ID da mensagem; repetição é ignorada."]
            ],
            er: [
              "Retentar POST de criação sem chave deduplicadora.",
              "Usar backoff fixo e sem jitter em milhares de clientes.",
              "Descartar mensagem com falha sem registro nem dead-letter."
            ],
            lab: "Escreva o pseudo-código de um handler idempotente com chave de requisição e explique o que acontece se a resposta for perdida após gravar.",
            ref: "Google SRE Book, cap. 22 — https://sre.google/sre-book/table-of-contents/; OWASP Cheat Sheet Series — https://cheatsheetseries.owasp.org/.",
            qs: [["Por que usar jitter no retry?", "Para espalhar tentativas no tempo", "Para esconder erro", "Para aumentar créditos"]],
            derivation: "Tentativas efetivas ≈ tentativas configuradas × clientes sincronizados. Jitter reduz o segundo fator; idempotência torna duplicatas inofensivas.",
            workedExamples: [["Retry", "Até 5 tentativas, intervalo 2^n segundos com jitter; circuit breaker abre após falhas contínuas."], ["Consumidor", "Verifica ID recebido, aplica efeito e grava ID na mesma transação."]],
            recallQuestions: ["Quando POST precisa de chave de idempotência?", "O que monitorar em uma fila?"],
            masteryCriteria: ["Desenha retry com limite, backoff e jitter.", "Garante deduplicação em consumidor de fila."],
            tags: ["idempotência", "retry", "backoff", "filas", "distribuído"],
            estimatedEffort: 55
          })
      ]
    }
  ]
};

CURRICULUM.systems.modules.push(
  {
    name: "Arquitetura de computadores (10.1)",
    lessons: [
      L("Lógica digital, portas e circuitos sequenciais",
        "Interpretar portas lógicas e expressões booleanas e distinguir circuitos combinacionais de sequenciais.",
        "Representação binária e noção de sinal elétrico.",
        "Combinacional é como uma calculadora: a resposta depende só das entradas atuais; sequencial tem memória do que aconteceu antes.",
        "Portas AND, OR, NOT, NAND, NOR e XOR implementam funções booleanas. NAND e NOR são universais: com uma delas é possível construir qualquer função. Álgebra booleana permite simplificar expressões e reduzir portas, por meio de leis como distributividade e teoremas de De Morgan. Circuitos combinacionais não guardam estado: a saída é função das entradas, com atraso de propagação.\n\nCircuitos sequenciais incluem estado. Flip-flops guardam um bit e só mudam em borda de clock ou nível habilitado, conforme o tipo. Registradores são conjuntos de flip-flops; máquinas de estado finito combinam lógica combinacional e registradores para produzir saída e próximo estado. Sem controle de tempo, mudanças simultâneas podem causar corridas e glitches.\n\nA abstração por hardware descritivo permite descrever estrutura e comportamento, mas a síntese depende de restrições de tempo, área e consumo. Verificar em simulação não garante que o circuito funcionará na frequência desejada; análise estática de tempo é necessária. Entenda a verdadeira tabela antes de confiar no símbolo da porta.",
          [
            ["porta lógica", "Circuito elementar que implementa uma operação booleana sobre sinais digitais."],
            ["álgebra booleana", "Sistema algébrico de valores lógicos usado para simplificar circuitos."],
            ["circuito combinacional", "Circuito cuja saída depende apenas das entradas atuais."],
            ["flip-flop", "Elemento de memória de um bit com comportamento controlado por relógio."],
            ["registrador", "Conjunto de flip-flops usado para armazenar uma palavra de dados."]
          ],
          {
            ex: [
              ["Somador", "Soma dois bits com carry; combinação de XOR e AND implementa a função."],
              ["Contador", "Flip-flops guardam a contagem e avançam a cada borda de clock."]
            ],
            er: [
              "Supor que a saída de circuito combinacional muda instantaneamente.",
              "Esquecer que entrada flutuante pode gerar valor indefinido.",
              "Confundir registrador com memória de massa."
            ],
            lab: "Em simulador disponível ou no papel, construa uma porta XOR com NAND e verifique a tabela-verdade completa.",
            ref: "Harris & Harris — Digital Design and Computer Architecture; CS:APP, cap. 3.",
            qs: [["Qual circuito guarda estado?", "flip-flop", "porta AND", "decodificador"]],
            derivation: "De Morgan: ¬(A ∧ B) = ¬A ∨ ¬B e ¬(A ∨ B) = ¬A ∧ ¬B. Essas equivalências permitem trocar portas mantendo a função.",
            workedExamples: [["Simplificação", "A ∧ (A ∨ B) = A; reduzir expressão reduz portas e consumo."], ["Máquina de estados", "Estados PARADO e ANDANDO com transição condicionada por botão."]],
            recallQuestions: ["O que distingue combinacional de sequencial?", "Por que clock importa em flip-flops?"],
            masteryCriteria: ["Simplifica expressão booleana pequena.", "Desenha registrador com flip-flops e explica o papel do clock."],
            tags: ["lógica", "portas", "flip-flop", "clock", "arquitetura"],
            estimatedEffort: 55
          }),
        L("ALU, memória e barramentos",
          "Entender como dados são processados, armazenados e transportados dentro do computador.",
          "Registradores e lógica combinacional.",
          "A ALU faz a conta, a memória guarda o resultado e o barramento é a estrada entre eles.",
          "A ALU realiza operações aritméticas e lógicas, como soma, subtração, AND, OR e comparações. Ela recebe operandos de registradores e produz resultado e sinais de condição, como zero, carry, overflow e negativo. Um barramento é conjunto de linhas que transporta dados, endereços e controle; largura e arbitragem limitam vazão. Múltiplos dispositivos não podem dirigir o mesmo barramento ao mesmo tempo.\n\nMemória é organizada hierarquicamente: registradores, caches, RAM e armazenamento persistente. Memória volátil perde conteúdo sem energia; ROM e flash retêm dados. Endereçamento define como o processador escolhe posições, e alinhamento afeta desempenho e, em algumas arquiteturas, validade do acesso. Mapa de memória reserva faixas para RAM, periféricos e firmware.\n\nO ciclo de instrução repete busca, decodificação, execução, acesso à memória e escrita de resultado. A ISA define o que o software pode pedir; a microarquitetura define como isso é implementado. Duas implementações da mesma ISA podem ter pipeline, cache e ALUs diferentes e ainda executar o mesmo programa. Essa separação explica compatibilidade entre gerações de processadores.",
          [
            ["ALU", "Unidade lógica e aritmética que executa operações sobre operandos da CPU."],
            ["barramento", "Conjunto de linhas de comunicação para dados, endereços e sinais de controle."],
            ["hierarquia de memória", "Organização de memórias por capacidade, velocidade e custo."],
            ["mapa de memória", "Distribuição de faixas de endereços entre memória e dispositivos."],
            ["ciclo de instrução", "Sequência busca, decodifica, executa, acessa memória e escreve resultado."]
          ],
          {
            ex: [
              ["Sinal de zero", "Após subtração de valores iguais, bit de condição indica resultado zero para desvio."],
              ["Periférico mapeado", "Registrador de UART em endereço reservado; acessar esse endereço configura o dispositivo."]
            ],
            er: [
              "Confundir endereço de memória com conteúdo armazenado.",
              "Supor que barramento mais largo sempre elimina gargalos.",
              "Achar que sinal de overflow é o mesmo que carry em toda operação."
            ],
            lab: "Desenhe o caminho de uma instrução ADD com dois operandos em registradores até a escrita do resultado, indicando barramentos usados.",
            ref: "CS:APP, caps. 3 e 6; Harris & Harris — Digital Design and Computer Architecture.",
            qs: [["O que a ALU produz além do resultado?", "Sinais de condição", "Certificado digital", "Arquivo de log"]],
            derivation: "Largura de barramento × frequência limita taxa teórica de transferência; latência de memória e arbitragem reduzem a taxa efetiva.",
            workedExamples: [["Comparação", "CMP subtrai internamente e atualiza flags sem gravar destino."], ["Endereço", "Com 32 bits de endereço há 2^32 posições endereçáveis, dependendo da organização."]],
            recallQuestions: ["Quais sinais de condição a ALU costuma gerar?", "O que separa ISA de microarquitetura?"],
            masteryCriteria: ["Descreve ciclo de instrução com ALU e memória.", "Interpreta mapa de memória simples."],
            tags: ["ALU", "barramento", "memória", "ISA", "CPU"],
            estimatedEffort: 55
          }),
        L("ISA, assembly e convenção de chamada",
          "Ler assembly básico e explicar o contrato entre código de máquina e software.",
          "Ciclo de instrução, registradores e endereçamento.",
          "ISA é o contrato visível ao programa; microarquitetura é o segredo de como o contrato é cumprido.",
          "Conjunto de instruções define operações, registradores, modos de endereçamento e formatos. CISC tende a instruções complexas que fazem várias coisas; RISC adota instruções simples e carga e armazenamento explícitos. A distinção histórica não prediz desempenho sozinha, pois implementações modernas usam decodificação em microoperações e pipeline profundo.\n\nAssembly é representação legível de instruções. O montador traduz mnemônicos, resolve rótulos e gera relocações; o ligador combina objetos e resolve símbolos externos. Desmontar reconstrói uma leitura possível dos bits, não recupera nomes e comentários originais. Otimizações tornam a sequência contraintuitiva.\n\nA convenção de chamada especifica onde passar argumentos, onde devolver resultado, quais registradores o chamado deve preservar e como a pilha é alinhada. Ela é parte da ABI. Ignorá-la gera falhas sutis em código misto. Em chamadas com ponteiro para função ou syscalls, a mesma disciplina de registradores e pilha aparece com convenções específicas.",
          [
            ["ISA", "Contrato entre software e hardware que define instruções, registradores e endereçamento."],
            ["CISC", "Filosofia de instruções complexas, com operações que podem incluir acesso à memória."],
            ["RISC", "Filosofia de instruções simples, tipicamente com operações sobre registradores."],
            ["montador", "Ferramenta que traduz assembly a código de máquina e emite relocações."],
            ["convenção de chamada", "Regras para passar argumentos, retornar valores e preservar registradores."]
          ],
          {
            ex: [
              ["add dword ptr [rax], 1", "Instrução CISC lê memória, soma e escreve de volta; internamente pode virar microoperações."],
              ["A64 ldr e add", "Modelo load/store: carregar, operar em registrador e armazenar separadamente."]
            ],
            er: [
              "Achar que RISC sempre produz programa menor.",
              "Supor que o montador resolve bibliotecas externas.",
              "Ler desmontagem como se fosse o código-fonte original."
            ],
            lab: "Com um compilador disponível, gere assembly de uma função simples com -O0 e -O2 e compare número e forma das instruções.",
            ref: "CS:APP, caps. 3 e 7; Intel 64 and IA-32 Architectures SDM; Arm Architecture Reference Manual.",
            qs: [["O que o montador gera para símbolo ainda sem endereço?", "Relocação", "Certificado", "Thread"]],
            derivation: "Desempenho não segue apenas contagem de instruções: CPI, frequência e acesso à memória participam da equação T = IC × CPI × T_clock.",
            workedExamples: [["Rótulo", "Montador calcula deslocamento relativo; ligador ajusta quando o objeto é colocado no executável."], ["Chamada", "Argumentos em registradores definidos pela ABI; registradores callee-saved preservados."]],
            recallQuestions: ["O que é ABI?", "Por que desmontar não recupera o fonte?"],
            masteryCriteria: ["Interpreta pequeno trecho de assembly com registradores e memória.", "Explica papel de montador e ligador."],
            tags: ["ISA", "assembly", "ABI", "RISC", "CISC"],
            estimatedEffort: 55
          }),
        L("Pipeline, cache e hierarquia de memória",
          "Explicar por que paralelismo interno e caches melhoram vazão e onde aparecem penalidades.",
          "Ciclo de instrução e barramentos.",
          "Pipeline é linha de montagem; cache é o caderno na mesa, muito menor que o arquivo mas muito mais rápido.",
          "Pipeline divide execução em estágios, como busca, decodificação, execução, memória e escrita. Várias instruções ficam em estágios diferentes ao mesmo tempo, aumentando vazão sem reduzir latência de uma instrução individual. Hazard é qualquer situação que impede o próximo estágio: dependência de dado, decisão de desvio não resolvida ou recurso ocupado. Soluções incluem encaminhamento, previsão e bolhas.\n\nCache explora localidade temporal e espacial. Dados usados agora tendem a ser usados de novo; bytes vizinhos tendem a ser acessados juntos. Blocos chamados linhas são transferidos entre níveis. Um acerto evita ir à memória mais lenta; um erro custa dezenas ou centenas de ciclos. Políticas de escrita e substituição afetam comportamento, e coerência é necessária quando há caches por núcleo.\n\nHierarquia equilibra capacidade e velocidade: registradores, L1, L2, L3, RAM, SSD. O programador não controla diretamente todo o movimento, mas padrões de acesso importam muito. Percorrer matriz por linha costuma ser mais rápido que por coluna em linguagens com armazenamento row-major. Medir com benchmarks controlados é preferível a supor qual padrão vence.",
          [
            ["pipeline", "Técnica que sobrepõe estágios de execução de várias instruções."],
            ["hazard", "Condição que impede o avanço normal do pipeline."],
            ["cache", "Memória pequena e rápida que guarda cópia de dados frequentemente usados."],
            ["localidade", "Tendência de acessos recentes a se repetirem ou a ficarem próximos no endereço."],
            ["coerência de cache", "Garantia de que cópias em caches diferentes representam valores consistentes."]
          ],
          {
            ex: [
              ["Dependência", "add depois de load precisa do valor; encaminhamento evita espera, bolha é alternativa."],
              ["Matriz", "Percorrer por linha aproveita linha de cache; por coluna gera mais faltas."]
            ],
            er: [
              "Achar que pipeline reduz latência de cada instrução.",
              "Ignorar custo de erro de cache em código sensível a desempenho.",
              "Supor que mais níveis de cache eliminam necessidade de medir."
            ],
            lab: "Meça em linguagem disponível o tempo de soma de matriz percorrida por linha e por coluna; mantenha mesma entrada e repita para reduzir ruído.",
            ref: "CS:APP, caps. 5 e 6; Harris & Harris — Digital Design and Computer Architecture.",
            qs: [["O que pipeline aumenta predominantemente?", "Vazão", "Capacidade do disco", "Tamanho da instrução"]],
            derivation: "T_CPU = IC × CPI × T_clock. Pipeline tende a reduzir CPI efetivo; cache reduz tempo de acesso médio, mas erros aumentam penalidade.",
            workedExamples: [["Acerto", "Dado em L1 em poucos ciclos; mesma posição em RAM custa muito mais."], ["Desvio", "Previsão correta mantém pipeline cheio; erro descarta instruções especulativas."]],
            recallQuestions: ["Qual diferença entre vazão e latência no pipeline?", "O que causa falta de cache?"],
            masteryCriteria: ["Explica hazard e uma solução.", "Justifica padrão de acesso com base em localidade."],
            tags: ["pipeline", "cache", "hazard", "memória", "desempenho"],
            estimatedEffort: 60
          }),
        L("Interrupções, DMA e multicore",
          "Entender como CPU reage a eventos externos e como transferências e núcleos afetam o sistema.",
          "Pipeline, barramentos e noção de periférico.",
          "Interrupção é o aviso; DMA é o carregador que trabalha sem ocupar o gerente; multicore são vários gerentes no mesmo prédio.",
          "Interrupção sinaliza evento assíncrono: chegou byte na UART, temporizador expirou ou usuário pressionou tecla. A CPU termina a instrução, salva contexto, consulta tabela de vetores e chama handler. Interrupções podem ser mascaráveis ou não mascaráveis e têm prioridade. Handler curto e rápido é regra prática; trabalho longo é diferido para thread ou fila.\n\nDMA permite que periférico transfira blocos entre memória e dispositivo sem que a CPU copie cada byte. O controlador recebe origem, destino e tamanho, e ao fim gera interrupção. Isso reduz uso de CPU, mas exige coerência de cache e controle de acesso à memória, pois o dispositivo pode ler ou escrever regiões indevidas se mal configurado.\n\nMulticore coloca várias unidades de execução no mesmo chip. Elas compartilham memória e, em geral, alguns níveis de cache, o que exige sincronização e coerência. Aumentar núcleos não dobra desempenho: a parte serial do programa limita ganho, e contenção de memória aparece. Em tempo real, interrupções e lock podem gerar jitter; em servidores, paralelismo é ferramenta central. Escolher modelo exige medir.",
          [
            ["interrupção", "Sinal assíncrono que desvia a CPU para tratar um evento."],
            ["handler", "Rotina executada em resposta a uma interrupção."],
            ["DMA", "Transferência de dados por controlador dedicado, sem participação byte a byte da CPU."],
            ["coerência", "Consistência entre cópias de dados em caches de núcleos diferentes."],
            ["jitter", "Variação indesejada no tempo de resposta de uma tarefa."]
          ],
          {
            ex: [
              ["UART", "Byte recebido gera interrupção; handler coloca byte em buffer circular e sinaliza tarefa."],
              ["DMA de ADC", "Amostras são gravadas em array pelo controlador; interrupção avisa quando termina."]
            ],
            er: [
              "Fazer processamento pesado dentro do handler.",
              "Configurar DMA sem verificar limites de memória.",
              "Achar que dois núcleos sempre executam duas vezes mais rápido."
            ],
            lab: "Em placa disponível ou simulação, descreva o caminho de um byte da UART até buffer: periférico, interrupção, handler e tarefa.",
            ref: "CS:APP, cap. 6; OSTEP, capítulos sobre concorrência — https://ostep.org/; Arm Cortex-M Generic User Guide.",
            qs: [["Quem copia cada byte em uma transferência DMA?", "Controlador DMA", "CPU instrução por instrução", "Compilador"]],
            derivation: "Tempo de CPU com DMA ≈ configuração + tratamento de fim; sem DMA ≈ configuração + cópia de cada byte. Ganho cresce com tamanho do bloco.",
            workedExamples: [["Prioridade", "Temporizador de controle precede interrupção de teclado."], ["Coerência", "Região de DMA marcada não cacheável ou invalidada antes da leitura."]],
            recallQuestions: ["Por que handler deve ser curto?", "Que risco DMA introduz?"],
            masteryCriteria: ["Descreve ciclo de atendimento de interrupção com salvamento de contexto.", "Explica ganho e risco de DMA."],
            tags: ["interrupção", "DMA", "multicore", "coerência", "eventos"],
            estimatedEffort: 55
          })
      ]
  },
  {
    name: "Eletrônica básica (10.2)",
    lessons: [
      L("Tensão, corrente, resistência e Lei de Ohm",
        "Calcular tensões, correntes e potência em circuitos série e paralelo simples.",
        "Noção de carga, elétrons e medidas com multímetro.",
        "Tensão é empurrão, corrente é fluxo, resistência é atrito e potência é o trabalho por segundo.",
        "Tensão V é diferença de potencial entre dois pontos, medida em volts. Corrente I é fluxo de carga, em amperes. Resistência R opõe-se ao fluxo, em ohms. Lei de Ohm relaciona V = R·I para componente resistivo em condições constantes. Potência P = V·I = R·I² = V²/R, em watts; dimensionar resistor pela potência evita aquecimento e falha.\n\nEm série, a corrente é a mesma em todos os elementos e as tensões se somam: R_eq = R1 + R2. Em paralelo, a tensão é a mesma e as correntes se somam: 1/R_eq = 1/R1 + 1/R2. Divisor de tensão é caso série muito usado para adaptar nível de sinal, mas ele é alterado pela carga conectada; por isso a impedância de entrada importa.\n\nConvenção de sinal e ponto de referência (ground) são parte da medição. Medir tensão é sempre entre dois pontos; medir corrente exige inserir o instrumento no caminho. Multímetro com configuração errada pode curto-circuitar o circuito. Antes de ligar, confira polaridade, faixa e limites do componente.",
        [
          ["tensão", "Diferença de potencial elétrico entre dois pontos, medida em volts."],
          ["corrente", "Fluxo de carga elétrica por unidade de tempo, medido em amperes."],
          ["resistência", "Oposição ao fluxo de corrente, medida em ohms."],
          ["Lei de Ohm", "Relação V = R·I entre tensão, corrente e resistência em componente ôhmico."],
          ["potência elétrica", "Taxa de conversão ou dissipação de energia, P = V·I."]
        ],
        {
          ex: [
            ["LED com resistor", "Fonte 5 V, LED com queda de 2 V e corrente desejada de 10 mA: R ≈ (5−2)/0,010 = 300 Ω."],
            ["Resistores em paralelo", "Dois resistores de 100 Ω em paralelo equivalem a 50 Ω e dividem a corrente."]
          ],
          er: [
            "Medir corrente colocando multímetro em paralelo com a fonte.",
            "Calcular resistor sem conferir potência dissipada.",
            "Achar que divisor de tensão mantém a mesma saída com qualquer carga."
          ],
          lab: "Monte em simulador ou bancada autorizada um divisor com dois resistores iguais; meça a tensão no meio e depois conecte uma carga para observar a mudança.",
          ref: "Horowitz & Hill — The Art of Electronics; Agarwal & Lang — Foundations of Analog and Digital Electronic Circuits.",
          qs: [["Em série, o que é igual em todos os resistores?", "A corrente", "A tensão", "A potência"]],
          derivation: "P = V·I e V = R·I ⇒ P = R·I². Para o LED: resistor absorve a diferença entre alimentação e queda do LED à corrente desejada.",
          workedExamples: [["Potência", "Com 10 mA em 300 Ω, P ≈ 0,03 W; resistor de 1/4 W é suficiente."], ["Paralelo", "Cada resistor de 100 Ω com 5 V conduz 50 mA; total 100 mA."]],
          recallQuestions: ["O que é igual em série e em paralelo?", "Como escolher a potência nominal do resistor?"],
          masteryCriteria: ["Calcula V, I, R e P em circuito simples.", "Explica efeito da carga em divisor de tensão."],
          tags: ["Ohm", "série", "paralelo", "potência", "multímetro"],
          estimatedEffort: 50
        }),
      L("Capacitores, indutores, diodos e transistores",
        "Reconhecer o comportamento básico de componentes que guardam energia ou controlam corrente.",
        "Lei de Ohm e noção de sinal analógico.",
        "Capacitor resiste a mudança de tensão; indutor resiste a mudança de corrente; diodo é válvula; transistor é chave controlada.",
        "Capacitor armazena carga em campo elétrico. Sua corrente é i = C·dv/dt: com tensão constante, corrente tende a zero; em transição, pode fornecer ou absorver corrente. Por isso suaviza ripple e filtra ruído, mas também atrasa bordas. Indutor armazena energia em campo magnético e obedece a v = L·di/dt; resiste a variação de corrente e é comum em filtros e fontes.\n\nDiodo conduz preferencialmente em um sentido e bloqueia no outro. LED é diodo que emite luz e exige resistor limitador. Diodo de proteção limita tensão inversa ou impede retorno de corrente. Transistor bipolar é controlado por corrente de base; MOSFET é controlado por tensão na gate e é base da lógica CMOS. Em chaveamento, o dispositivo deve respeitar limites de corrente, tensão e dissipação.\n\nTTL e CMOS são famílias lógicas com níveis e correntes diferentes. Níveis de entrada e saída não são exatamente 0 V e Vcc; margem de ruído é a diferença entre o que a família garante e o que exige. Entradas soltas são problema em CMOS moderno. Conferir datasheet é parte do projeto, não detalhe opcional.",
        [
          ["capacitor", "Componente que armazena energia em campo elétrico e resiste a mudanças rápidas de tensão."],
          ["indutor", "Componente que armazena energia em campo magnético e resiste a mudanças de corrente."],
          ["diodo", "Componente que conduz predominantemente em um sentido e bloqueia no outro."],
          ["transistor", "Dispositivo de três terminais usado como chave ou amplificador."],
          ["margem de ruído", "Diferença entre nível garantido na saída e nível exigido na entrada de uma família lógica."]
        ],
        {
          ex: [
            ["Debounce por RC", "Capacitor com resistor suaviza bounce mecânico antes da entrada digital."],
            ["LED", "Resistor em série limita corrente; polaridade invertida impede emissão."]
          ],
          er: [
            "Ligar LED diretamente à fonte sem limitação de corrente.",
            "Deixar entrada CMOS flutuante.",
            "Supor que nível lógico alto é exatamente igual à tensão de alimentação."
          ],
          lab: "Em simulador, observe a forma de onda de um capacitor carregando por resistor; compare com a corrente prevista e registre o efeito do aumento de C.",
          ref: "Horowitz & Hill — The Art of Electronics; Agarwal & Lang — Foundations of Analog and Digital Electronic Circuits.",
          qs: [["O que um capacitor resiste mudar?", "Tensão", "Corrente", "Frequência da rede"]],
          derivation: "i = C·dv/dt e v = L·di/dt. Quanto maior a derivada, maior a corrente no capacitor ou a tensão no indutor; daí o comportamento em transientes.",
          workedExamples: [["Filtragem", "Capacitor em paralelo com a carga reduz ripple de fonte retificada."], ["Chave CMOS", "Gate com alto mantém corrente quase nula exceto em transição."]],
          recallQuestions: ["Como capacitor e indutor diferem?", "Por que entrada solta é problema?"],
          masteryCriteria: ["Prevê comportamento de RC simples.", "Explica papel de diodo e transistor em circuito de chaveamento."],
          tags: ["capacitor", "indutor", "diodo", "transistor", "CMOS"],
          estimatedEffort: 60
        }),
      L("Sinais analógicos, digitais, ADC e DAC",
        "Relacionar o mundo contínuo dos sensores aos valores discretos processados pelo software.",
        "Lei de Ohm e componentes passivos.",
        "ADC transforma uma tensão contínua em número; DAC faz o caminho inverso, sempre com limites de resolução e ruído.",
        "Sinal analógico varia de forma contínua no tempo e na amplitude; sinal digital é discreto em amplitude e frequentemente amostrado no tempo. Um sistema embarcado costuma viver nos dois mundos: sensor analógico, condicionamento, conversão e processamento digital. A amostragem deve respeitar o limite de Nyquist: para representar um sinal com componente até f, a taxa de amostragem precisa ser maior que 2f, na prática com margem.\n\nADC converte tensão em código inteiro. Resolução de N bits produz 2^N níveis; com referência Vref, passo ≈ Vref/2^N. Erros incluem offset, ganho, não linearidade e ruído. Sobreamostragem e média reduzem ruído aleatório, mas não corrigem erro sistemático. Impedância de fonte e tempo de aquisição importam: ADC com capacitor de amostragem precisa de tempo para carregar.\n\nDAC transforma código em tensão ou corrente; é usado em áudio, controle analógico e geradores de sinal. Saída tem resolução, erro de ganho e filtragem de reconstrução. Em ambos os conversores, a referência é parte da precisão: usar a alimentação como referência repete seus erros no resultado. Documente faixa, resolução, taxa e incerteza.",
        [
          ["sinal analógico", "Sinal que varia continuamente em amplitude e tempo."],
          ["sinal digital", "Sinal representado por níveis discretos, normalmente correspondentes a bits."],
          ["ADC", "Conversor analógico-digital que transforma grandeza contínua em valor numérico."],
          ["DAC", "Conversor digital-analógico que transforma código em grandeza contínua."],
          ["resolução", "Menor variação representável, determinada pelo número de bits e pela referência."]
        ],
        {
          ex: [
            ["ADC de 10 bits", "Com Vref = 3,3 V, passo ≈ 3,3/1024 ≈ 3,2 mV por contagem."],
            ["Amostragem", "Sensor de 50 Hz exige taxa bem acima de 100 Hz; 1 kHz dá margem para filtro."]
          ],
          er: [
            "Achar que mais bits eliminam ruído e erro de calibração.",
            "Amostrar abaixo de 2f e esperar reconstruir o sinal.",
            "Usar referência instável e atribuir erro ao sensor."
          ],
          lab: "Em simulador ou placa autorizada, leia um potenciômetro pelo ADC, faça média de 16 amostras e compare a variação antes e depois.",
          ref: "Horowitz & Hill — The Art of Electronics; Agarwal & Lang — Foundations of Analog and Digital Electronic Circuits.",
          qs: [["Quantos níveis tem ADC de 8 bits?", "256", "8", "1024"]],
          derivation: "Passo = Vref / 2^N. Com N=10 e Vref=3,3 V, 2^N=1024 e passo ≈ 0,00322 V.",
          workedExamples: [["Leitura", "Código 512 em ADC de 10 bits corresponde aproximadamente à metade da referência."], ["DAC", "Para gerar 1,65 V com DAC de 10 bits e Vref 3,3 V, use código próximo de 512."]],
          recallQuestions: ["O que é limite de Nyquist?", "Por que Vref importa tanto?"],
          masteryCriteria: ["Calcula passo e código de conversores simples.", "Escolhe taxa de amostragem com margem."],
          tags: ["ADC", "DAC", "amostragem", "analógico", "digital"],
          estimatedEffort: 55
        })
    ]
  },
  {
    name: "Sistemas embarcados (10.3)",
    lessons: [
      L("Microcontroladores, GPIO, timers e PWM",
        "Configurar pinos digitais e gerar sinais de tempo com timer e modulação por largura de pulso.",
        "Lógica digital, noção de registrador e lei de Ohm.",
        "GPIO é a interface entre código e fio; timer é o relógio interno; PWM é uma chave que liga e desliga muito rápido.",
        "Microcontrolador integra CPU, memória e periféricos em um chip. GPIO pode operar como entrada ou saída digital, com configuração de direção, pull-up ou pull-down e limites de corrente. Conectar LED exige resistor; entrada flutuante é fonte de leitura instável. Registradores de configuração são mapeados em endereços específicos e a biblioteca da placa costuma esconder esses detalhes.\n\nTimer é contador de hardware alimentado por clock. Serve para medir intervalos, gerar interrupções periódicas e capturar/eventos. Pré-divisor reduz a frequência e permite períodos maiores; compare match dispara ação quando o contador atinge valor definido. PWM mantém frequência fixa e varia duty cycle, a fração do período em que sinal fica alto. LED parece mais fraco e motor gira mais devagar porque a média do sinal muda.\n\nResolução do PWM depende do contador: com 8 bits há 256 níveis de duty. Frequência muito baixa causa cintilação em LED e zumbido audível em motor; muito alta pode encontrar limites do driver. A interrupção periódica é útil para tarefas de tempo, mas não deve acumular trabalho pesado; melhor marcar flag e tratar no loop principal.",
          [
            ["microcontrolador", "Computador completo em um chip, com CPU, memória e periféricos."],
            ["GPIO", "Pino de entrada ou saída digital de uso geral."],
            ["timer", "Periférico que conta ciclos de clock para medir tempo ou gerar eventos."],
            ["PWM", "Modulação por largura de pulso, com frequência fixa e duty cycle variável."],
            ["duty cycle", "Fração do período em que o sinal digital permanece em nível alto."]
          ],
          {
            ex: [
              ["LED com PWM", "Duty de 25% com resistor adequado resulta em brilho médio menor."],
              ["Timer de 1 ms", "Com clock de 16 MHz e pré-divisor 8, contador de 2000 ciclos marca 1 ms."]
            ],
            er: [
              "Alimentar LED diretamente do pino sem resistor.",
              "Deixar entrada digital sem pull-up ou pull-down.",
              "Confundir frequência de PWM com duty cycle."
            ],
            lab: "Em placa disponível ou simulador, varie o duty cycle de um LED em 0%, 25%, 50% e 100% e registre o brilho observado e o valor do registrador.",
            ref: "Michael Barr — Programming Embedded Systems in C and C++; documentação oficial da placa utilizada.",
            qs: [["O que muda no PWM quando duty cycle aumenta?", "Tempo em nível alto", "Frequência do clock", "Resistência do LED"]],
            derivation: "Período do timer = (pré-divisor × contagem) / f_clock. Para 1 ms com 16 MHz e pré-divisor 8: contagem = 16 MHz / 8 × 0,001 = 2000.",
            workedExamples: [["Pull-up", "Botão liga pino ao ground; resistor interno mantém nível alto quando solto."], ["Servo", "Precisa de período fixo e pulso de largura específica; trocar frequência pode não funcionar."]],
            recallQuestions: ["O que configura a direção de um GPIO?", "Qual a diferença entre frequência e duty cycle?"],
            masteryCriteria: ["Configura GPIO com resistor e pull adequados.", "Calcula contagem de timer para intervalo simples."],
            tags: ["GPIO", "timer", "PWM", "microcontrolador", "hardware"],
            estimatedEffort: 60
          }),
        L("UART, SPI e I²C",
          "Escolher e descrever protocolos seriais simples com base em velocidade, número de fios e endereçamento.",
          "Noção de bits, clock e GPIO.",
          "UART é conversa com velocidade combinada; SPI é conversa com relógio e chip select; I²C é conversa com endereço e dois fios.",
          "UART envia bits de forma assíncrona: não há linha de clock, então ambos precisam concordar em baud rate, bits de dados, paridade e stop bits. É simples e comum para console serial. Como não há endereço na ligação básica, normalmente conecta duas pontas. Erros de configuração geram caracteres corrompidos, não falha de conexão.\n\nSPI é síncrono e usa clock, MOSI, MISO e chip select. O mestre controla o clock e escolhe o escravo ativo. É rápido e simples, mas consome mais pinos e não define endereçamento nem reconhecimento padronizado. Modos de clock (CPOL e CPHA) precisam coincidir entre os dispositivos.\n\nI²C usa apenas SDA e SCL, com endereço de 7 ou 10 bits e reconhecimento por bit de ACK. Vários dispositivos compartilham o barramento; resistores de pull-up são necessários e velocidade é limitada por capacitância. Conflito de endereço é problema comum. Em todos os casos, níveis lógicos devem ser compatíveis: 3,3 V e 5 V podem exigir conversão. Documente fios, velocidade, endereço e formato de quadro.",
          [
            ["UART", "Protocolo serial assíncrono que usa linhas de TX e RX e taxa combinada."],
            ["baud rate", "Taxa de símbolos por segundo em comunicação serial."],
            ["SPI", "Protocolo serial síncrono com clock separado e seleção por chip select."],
            ["I²C", "Protocolo serial síncrono de dois fios com endereçamento de dispositivos."],
            ["ACK", "Bit de reconhecimento enviado pelo receptor para confirmar recepção."]
          ],
          {
            ex: [
              ["Console serial", "UART a 115200 8N1 para imprimir logs de inicialização."],
              ["Sensor I²C", "Endereço 0x48 no barramento compartilhado; resistor de pull-up em SDA e SCL."]
            ],
            er: [
              "Conectar TX a TX e RX a RX sem cruzar as linhas.",
              "Usar SPI com modos de clock diferentes entre mestre e escravo.",
              "Esquecer pull-ups no I²C."
            ],
            lab: "Com um sensor didático disponível, leia um registrador via I²C e via SPI (se aplicável); compare fios usados, velocidade e falhas observadas.",
            ref: "Documentação oficial do fabricante do microcontrolador e do sensor; Horowitz & Hill — The Art of Electronics.",
            qs: [["Qual protocolo usa endereço de dispositivo?", "I²C", "UART básico", "SPI sem endereçamento"]],
            derivation: "Custo de pinos e velocidade são fatores opostos: UART usa poucos fios e sem clock; SPI usa mais fios e alta velocidade; I²C economiza fios com endereçamento e ACK.",
            workedExamples: [["8N1", "8 bits de dados, sem paridade e 1 stop bit; ambos os lados devem usar a mesma configuração."], ["Chip select", "Nível ativo baixo habilita apenas o periférico escolhido."]],
            recallQuestions: ["Por que UART exige mesma baud rate?", "Qual problema comum no I²C?"],
            masteryCriteria: ["Compara UART, SPI e I²C por fios, clock e endereçamento.", "Interpreta configuração 8N1 e endereço de sensor."],
            tags: ["UART", "SPI", "I2C", "serial", "comunicação"],
            estimatedEffort: 55
          }),
        L("Debouncing, interrupções, consumo e RTOS introdutório",
          "Lidar com tempo, eventos e recursos limitados em firmware pequeno.",
          "GPIO, timers e noção de interrupção da arquitetura.",
          "Botão mecânico não troca de estado uma vez: ele quica; o firmware precisa decidir o que conta como evento.",
          "Debouncing remove transições espúrias de contatos mecânicos. Pode ser feito por RC, com filtro digital por amostragem ou com timer que só aceita nova mudança após intervalo estável. Solução puramente por delay bloqueante é simples, mas impede outras tarefas. Interrupções externas avisam mudança de pino; o handler deve ser curto e registrar evento para processamento posterior.\n\nConsumo de energia importa em dispositivos alimentados por bateria. Modos de baixo consumo desligam periféricos e clocks; a corrente em sleep pode ser ordens de grandeza menor que em execução. Wake-up por interrupção combina economia e reatividade. Cada periférico ativo consome energia, e frequência mais alta aumenta consumo dinâmico; medir com instrumento adequado é melhor que estimar.\n\nRTOS introduz tarefas, prioridades, filas e semáforos para organizar trabalho concorrente em microcontrolador. Não é obrigatório: um loop cooperativo bem estruturado atende muitos projetos. RTOS ajuda quando há prazos múltiplos e bloqueios, mas acrescenta complexidade, consumo de memória e necessidade de compreender prioridade e inversão. Depuração com hardware inclui SWD/JTAG, logic analyzer e serial; cada ferramenta responde uma pergunta diferente.",
          [
            ["debouncing", "Remoção de transições espúrias geradas por contato mecânico instável."],
            ["interrupção externa", "Evento de hardware que desvia a CPU para tratar mudança em pino."],
            ["modo de baixo consumo", "Estado de baixo consumo com partes do chip desligadas."],
            ["RTOS", "Sistema operacional de tempo real com tarefas, prioridades e primitivas de sincronização."],
            ["logic analyzer", "Instrumento que captura sinais digitais ao longo do tempo."]
          ],
          {
            ex: [
              ["Botão", "Ao detectar borda, timer de 20 ms reavalia o nível; só confirma se permanecer estável."],
              ["RTOS", "Tarefa de leitura a 100 Hz, tarefa de log em prioridade menor e fila entre elas."]
            ],
            er: [
              "Usar delay longo dentro de handler de interrupção.",
              "Confiar em uma única leitura de botão sem debounce.",
              "Adotar RTOS sem analisar memória disponível e prazos reais."
            ],
            lab: "Em placa autorizada, implemente debounce por amostragem com timer e meça quantas transições são registradas com e sem filtro.",
            ref: "Michael Barr — Programming Embedded Systems in C and C++; Elecia White — Making Embedded Systems; documentação oficial da placa.",
            qs: [["O que debounce resolve?", "Transições espúrias de botão", "Falta de resistor no LED", "Erro de ADC"]],
            derivation: "Janelas de amostragem mais longas filtram mais quique, mas aumentam latência de resposta; o valor é escolhido conforme o mecanismo do botão.",
            workedExamples: [["Filtro digital", "Amostra a cada 1 ms; confirma mudança após 20 leituras iguais."], ["Sleep", "Microcontrolador dorme e acorda por interrupção de botão."]],
            recallQuestions: ["Por que handler deve ser curto?", "Quando RTOS é útil?"],
            masteryCriteria: ["Implementa debounce sem bloquear o loop principal.", "Explica custo e benefício de RTOS em projeto pequeno."],
            tags: ["debounce", "interrupção", "energia", "RTOS", "depuração"],
            estimatedEffort: 60
          })
      ]
  },
  {
    name: "Projeto embarcado (10.4)",
    lessons: [
      L("Projeto: sensor → filtro → log → serial",
        "Integrar leitura de sensor, filtragem de ruído, registro de dados e comunicação serial em um fluxo verificável.",
        "ADC, GPIO, timers, comunicação serial e depuração básica.",
        "O valor bruto do sensor é só o começo: filtrar, registrar e explicar transformam leitura em evidência.",
        "O projeto solicitado pela Enciclopédia lê um sensor, filtra ruído, registra dados e comunica resultados por serial. Um fluxo simples é: condicionar o sinal, amostrar com ADC ou protocolo digital, aplicar filtro, formar registro com timestamp e enviar linha legível pela UART. Cada etapa precisa de limite explícito: faixa do sensor, taxa de amostragem, tamanho do buffer e formato da linha.\n\nFiltro de média móvel reduz ruído aleatório, mas atrasa mudanças reais. Filtro passa-baixo em RC também suaviza, porém altera resposta no tempo. Escolher parâmetro é troca entre estabilidade e latência; registre a escolha. Um outlier pode ser ruído ou evento verdadeiro: descartá-lo sem critério destrói informação. Média, mediana e limiar têm implicações diferentes.\n\nLog serial deve ser previsível: campos separados, unidades declaradas e identificador de amostra. Evite imprimir em altíssima frequência, pois a UART pode bloquear ou distorcer tempo. Faça testes com entrada conhecida, como potenciômetro em posição extrema ou sensor simulado, e compare com instrumento independente. Guarde o código de calibração e as condições do ensaio junto do projeto.",
        [
          ["pipeline de dados", "Sequência de etapas que transforma leitura bruta em informação utilizável."],
          ["filtro de média móvel", "Filtro que substitui amostra pela média das últimas leituras."],
          ["amostragem", "Seleção de leituras em intervalos regulares ou definidos por evento."],
          ["calibração", "Determinação da relação entre valor lido e grandeza física real."],
          ["registro serial", "Linha de dados enviada por UART com formato e unidades conhecidos."]
        ],
        {
          ex: [
            ["Linha de log", "t=1234ms;temp=25,6C;filtro=media8;amostra=42"],
            ["Ensaio", "Potenciômetro em 0% e 100% confirme mínimo e máximo antes de usar sensor real."]
          ],
          er: [
            "Imprimir todas as amostras sem controle e depois culpar o sensor pela lentidão.",
            "Achar que filtrar elimina erro sistemático de calibração.",
            "Mudar taxa de amostragem e manter o mesmo parâmetro de filtro sem reavaliar."
          ],
          lab: "Implemente o fluxo com sensor disponível ou dados simulados; registre configuração, taxa, filtro, formato da linha e uma comparação com valor de referência.",
          ref: "Michael Barr — Programming Embedded Systems in C and C++; Elecia White — Making Embedded Systems; documentação oficial da placa e do sensor.",
          qs: [["O que média móvel reduz?", "Ruído aleatório", "Erro sistemático de escala", "Falta de resistor"]],
          derivation: "Com N amostras independentes de desvio σ, a média tem desvio aproximado σ/√N; o custo é atraso proporcional à janela.",
          workedExamples: [["Média de 8", "Janela de 8 amostras a 100 Hz cobre 80 ms; uma mudança brusca leva esse tempo a aparecer cheia."], ["Formato", "Incluir unidade no cabeçalho evita confundir mV com °C na análise."]],
          recallQuestions: ["Qual custo da média móvel?", "Por que calibrar separadamente do filtro?"],
          masteryCriteria: ["Implementa fluxo completo sensor → filtro → log → serial.", "Apresenta ensaio reproduzível com parâmetros declarados."],
          tags: ["projeto", "sensor", "filtro", "log", "serial"],
          estimatedEffort: 90
        }),
      L("Documentação de limitações elétricas e de segurança",
        "Registrar fronteiras do projeto para que outra pessoa possa reproduzi-lo sem danificar hardware ou expor segredos.",
        "Projeto anterior; Lei de Ohm e fundamentos de segurança.",
        "Um protótipo sem limites documentados funciona até alguém ligar a tensão errada ou publicar o log.",
        "O relatório do projeto deve declarar limitações elétricas: tensão de alimentação, corrente máxima por pino, potência dos resistores, níveis lógicos, faixa do sensor, resolução do ADC e erros esperados. Inclua o que foi medido e o que foi assumido. Uma frase como 'funcionou com 5 V' não diz se o pino de 3,3 V foi respeitado.\n\nLimitações de segurança também pertencem ao documento. Mesmo um projeto pequeno pode expor token Wi-Fi no firmware, log com identificador pessoal, porta de depuração aberta ou atualização sem verificação. Declare onde estão credenciais, como são rotacionadas, que dados são coletados e por quanto tempo, e se o dispositivo aceita comandos externos. Se não há autenticação, diga isso explicitamente.\n\nBoa documentação traz diagrama simples, lista de peças, esquema, pinout, comandos de build e gravação, procedimento de teste e resultados. Registre decisões com alternativas e consequências, como se fosse um ADR curto. Limitações conhecidas não são falha do projeto: são informação que evita uso indevido. O que é inaceitável é escondê-las ou deixar que o protótipo seja interpretado como produto pronto.",
        [
          ["limitação elétrica", "Restrição de tensão, corrente, potência ou faixa que o hardware respeita."],
          ["pinout", "Mapa que associa pinos físicos às suas funções no projeto."],
          ["credencial embarcada", "Segredo armazenado no dispositivo, que exige controle de acesso e rotação."],
          ["superfície de atualização", "Caminho pelo qual firmware ou configuração pode ser alterado."],
          ["decisão registrada", "Descrição curta de escolha, contexto, alternativas e consequências."]
        ],
        {
          ex: [
            ["Aviso de pino", "Entrada analógica aceita no máximo 3,3 V; acima disso, use divisor ou condicionador."],
            ["Aviso de firmware", "Token de rede fictício em projeto de estudo; em uso real, armazenar em cofre e rotacionar."]
          ],
          er: [
            "Publicar foto com fios e credenciais reais sem revisão.",
            "Dizer que o projeto é seguro apenas porque roda em rede local.",
            "Documentar apenas o sucesso final e omitir ensaios que falharam."
          ],
          lab: "Escreva uma página de limitações do seu projeto com quatro seções: elétrica, dados, segurança e reprodução; inclua ao menos um 'não faça' por seção.",
          ref: "Michael Barr — Programming Embedded Systems in C and C++; OWASP Cheat Sheet Series — https://cheatsheetseries.owasp.org/; documentação oficial dos componentes usados.",
          qs: [["O que uma limitação elétrica deve declarar?", "Tensão e corrente máximas", "Nome do autor", "Cor da placa"]],
          derivation: "Segurança de uso ≈ clareza dos limites × probabilidade de outra pessoa seguir o documento. Limite oculto transforma busca em dano.",
          workedExamples: [["Registro", "Ensaio com 2,5 V e 3,0 V; acima de 3,3 V não testado e portanto não garantido."], ["Decisão", "Escolha de média de 8 amostras: menos ruído, 80 ms de atraso; alternativa: mediana."]],
          recallQuestions: ["Quatro seções recomendadas do relatório?", "Por que declarar ausência de autenticação?"],
          masteryCriteria: ["Documenta limites elétricos com valores medidos ou assumidos.", "Lista riscos de segurança e não os esconde."],
          tags: ["documentação", "limitações", "segurança", "elétrica", "projeto"],
          estimatedEffort: 60
        })
    ]
  }
);

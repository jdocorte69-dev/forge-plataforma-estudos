/* ============================================================
   FORGE — data-software-extra.js
   Engenharia de Software: arquitetura, qualidade e entrega
   ============================================================ */

CURRICULUM.software.modules.push(
  {
    name: "Arquitetura e decisões",
    lessons: [
      L("Arquitetura e requisitos arquiteturais",
        "Entender o que a arquitetura decide e como requisitos de qualidade a orientam.",
        "Requisitos funcionais e não funcionais.",
        "Arquitetura são as decisões estruturais que são caras de mudar depois que o sistema está em produção.",
        "A arquitetura de software descreve componentes, responsabilidades e interações: quais partes existem, como se comunicam e por quê. Ela responde a requisitos funcionais, mas é sobretudo moldada por requisitos arquiteturais, isto é, atributos de qualidade como desempenho, disponibilidade, segurança, manutenibilidade e portabilidade. Sommerville destaca que a mesma funcionalidade pode ser organizada de várias formas, e a escolha depende das qualidades priorizadas.\n\nUm atributo de qualidade só é útil quando expresso de forma verificável. Cenários de qualidade descrevem fonte do estímulo, estímulo, ambiente, artefato afetado, resposta esperada e medida. 'A página deve ser rápida' não é verificável; 'sob 1000 usuários simultâneos, o p95 de carregamento é menor que 500 ms' é. A medida permite comparar alternativas arquiteturais com evidência.\n\nRestrições também moldam a arquitetura: plataforma client-side, orçamento, equipe, prazos e conformidade. Ignorá-las produz projetos elegantes e inviáveis. A arquitetura não é um diagrama único nem um documento congelado: é um conjunto de decisões que evolui com o sistema e precisa ser revisado quando os requisitos de qualidade mudam.",
        [
          ["arquitetura de software", "Conjunto de decisões estruturais sobre componentes, responsabilidades e comunicação de um sistema."],
          ["requisito arquitetural", "Requisito de qualidade ou restrição que influencia a estrutura do sistema."],
          ["atributo de qualidade", "Característica mensurável do sistema, como desempenho, segurança ou manutenibilidade."],
          ["cenário de qualidade", "Descrição verificável de estímulo, ambiente, resposta e medida de um atributo de qualidade."],
          ["restrição de projeto", "Limitação externa, técnica ou organizacional que restringe as decisões possíveis."]
        ],
        {
          ex: [["Cenário de latência", "Fonte: aluno; estímulo: abrir uma aula; ambiente: 1000 usuários simultâneos; resposta: p95 menor que 500 ms."], ["Restrição client-side", "A aplicação roda no navegador e usa armazenamento local: isso limita opções de persistência e sincronização."]],
          er: ["Reduzir arquitetura a um único diagrama de caixas sem decisões registradas.", "Escrever atributos de qualidade sem medida verificável.", "Escolher tecnologias antes de entender as restrições e prioridades."],
          lab: "Escreva um cenário de qualidade para o carregamento da plataforma com fonte, estímulo e medida.",
          ref: "Sommerville — Software Engineering, capítulos sobre requisitos não funcionais e arquitetura (Pearson)."
        }),

      L("Estilos arquiteturais: camadas, pipes e eventos",
        "Comparar estilos arquiteturais comuns e escolher com base no problema.",
        "Arquitetura e requisitos arquiteturais.",
        "Estilo arquitetural é um padrão de organização: ele define formatos de comunicação e limita o que cada parte pode fazer.",
        "Em camadas, o sistema é dividido em níveis com responsabilidades distintas, como apresentação, domínio e infraestrutura. Cada camada usa serviços da imediatamente inferior, o que facilita substituir a persistência sem alterar a interface. O risco é o acoplamento acidental quando regras de negócio vazam para a camada de apresentação.\n\nEm pipes e filtros, cada componente lê um fluxo de dados, transforma-o e passa adiante, como em um compilador que encadeia lexer, parser e gerador. O estilo favorece reutilização e processamento em fluxo, mas exige formatos bem definidos entre etapas e não serve bem a interações complexas de estado. A arquitetura orientada a eventos conecta produtores e consumidores por meio de eventos, com baixo acoplamento e boa escalabilidade; o custo é rastreabilidade e depuração mais difíceis quando o fluxo se espalha.\n\nNenhum estilo é universal. Sistemas reais combinam estilos: uma aplicação pode ter camadas no front-end e eventos na integração. O critério de escolha é o conjunto de atributos de qualidade priorizados. Microserviços e arquitetura hexagonal aparecem como variações do mesmo problema: controlar acoplamento e preservar o domínio das mudanças tecnológicas.",
        [
          ["estilo arquitetural", "Padrão recorrente de organização de componentes e de suas interações."],
          ["arquitetura em camadas", "Estilo que separa responsabilidades em níveis, com dependências dirigidas para baixo."],
          ["pipes e filtros", "Estilo em que componentes transformam fluxos de dados e os repassam."],
          ["arquitetura orientada a eventos", "Estilo em que produtores publicam eventos e consumidores reagem a eles."],
          ["acoplamento", "Grau de dependência entre componentes; quanto menor, mais localizada é uma mudança."]
        ],
        {
          ex: [["Compilador em pipes", "Código-fonte entra no lexer, vira tokens, passa pelo parser e chega ao gerador; trocar o gerador não altera o lexer."], ["Aplicação em camadas", "A tela pede dados ao domínio, que usa um repositório; trocar o mecanismo de persistência não muda a tela."]],
          er: ["Colocar regras de negócio diretamente na camada de apresentação.", "Adotar eventos para toda comunicação e perder a trilha de uma operação.", "Conectar filtros sem definir o formato do fluxo entre eles."],
          lab: "Desenhe em papel as camadas de uma funcionalidade de login e indique quem pode chamar quem.",
          ref: "Sommerville — Software Engineering (Pearson); Fowler — Patterns of Enterprise Application Architecture (Addison-Wesley)."
        }),

      L("ADR e decisões rastreáveis",
        "Registrar decisões arquiteturais com contexto, alternativas e consequências.",
        "Arquitetura e requisitos arquiteturais.",
        "Código mostra o que foi feito; um ADR explica por que foi feito e o que se abriu mão.",
        "Um ADR (Architecture Decision Record) é um documento curto e imutável que registra uma decisão importante. O formato popularizado por Michael Nygard inclui título, status, contexto, decisão, consequências e alternativas consideradas. Contexto explica a força que motivou a escolha; consequências incluem tanto efeitos positivos quanto novas restrições e dívidas assumidas.\n\nDecisões rastreáveis são ligadas a requisitos, issues e código. Quando uma decisão deixa de valer, escreve-se um novo ADR que marca o anterior como superado, em vez de apagar o histórico. Assim, é possível reconstruir por que o sistema chegou ao estado atual e evitar repetir discussões antigas. A rastreabilidade também ajuda a avaliar o impacto de mudanças: saber quais requisitos dependeram de uma decisão indica o que precisa ser revisado.\n\nADRs não devem virar relatórios longos. Um texto de meia página, escrito no momento da decisão e revisado por pares, costuma ser mais útil que um documento perfeito escrito meses depois. O hábito é mais importante que o modelo: registrar cedo preserva o racional enquanto as alternativas ainda estão frescas na memória da equipe.",
        [
          ["ADR", "Registro curto e imutável de uma decisão arquitetural com contexto e consequências."],
          ["contexto da decisão", "Descrição das forças, requisitos e restrições que motivaram a escolha."],
          ["alternativas", "Opções consideradas e descartadas antes da decisão."],
          ["consequências", "Efeitos positivos e negativos que a decisão traz para o sistema."],
          ["superação de ADR", "Situação em que um ADR novo substitui um anterior sem apagar o histórico."]
        ],
        {
          ex: [["ADR de persistência", "Contexto: a aplicação precisa funcionar sem rede; decisão: usar armazenamento local no navegador; consequência: sem sincronização automática entre dispositivos."], ["Decisão superada", "O ADR-007 marca o ADR-003 como superado ao adotar sincronização, mantendo o registro original disponível."]],
          er: ["Escrever o ADR meses depois, quando ninguém lembra mais as alternativas.", "Registrar apenas a decisão final, sem contexto nem consequências.", "Editar um ADR aceito apagando o racional original."],
          lab: "Escreva um ADR curto sobre a escolha de persistência local deste projeto.",
          ref: "Michael Nygard — Documenting Architecture Decisions, https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions."
        }),

      L("Modelo de domínio e limites",
        "Modelar conceitos de negócio e definir fronteiras entre contextos.",
        "Engenharia de requisitos e arquitetura em camadas.",
        "O domínio é o vocabulário do negócio; limites definem onde cada significado é válido.",
        "O modelo de domínio representa os conceitos centrais do negócio e suas relações. Na abordagem de Domain-Driven Design, entidades têm identidade, objetos de valor são definidos por seus atributos, e agregados agrupam objetos que devem permanecer consistentes. A invariante do agregado é validada nele, não espalhada por formulários ou funções auxiliares.\n\nUm contexto limitado define onde um modelo e sua linguagem se aplicam. O mesmo termo, como produto, pode significar algo diferente no catálogo e no faturamento; forçar um único modelo para ambos gera confusão e acoplamento. O mapa de contextos registra como esses limites se relacionam e que tipo de integração existe entre eles.\n\nO modelo de domínio não deve espelhar tabelas do banco nem ser uma camada anêmica de getters e setters. Quando a regra de negócio vive no domínio, mudanças na interface ou no armazenamento não a alteram. Isso exige esforço de modelagem com especialistas do negócio e revisão periódica à medida que o vocabulário evolui.",
        [
          ["modelo de domínio", "Representação dos conceitos e regras centrais do negócio no software."],
          ["contexto limitado", "Fronteira explícita dentro da qual um modelo e seus termos têm significado próprio."],
          ["entidade", "Objeto do domínio com identidade estável ao longo do tempo."],
          ["objeto de valor", "Objeto definido por seus atributos, sem identidade independente."],
          ["agregado", "Conjunto de entidades e objetos de valor tratado como unidade de consistência."]
        ],
        {
          ex: [["Pedido como agregado", "Pedido e seus itens formam um agregado; a invariante 'total é a soma dos itens' é validada dentro dele."], ["Dois significados", "No catálogo, produto tem descrição e imagem; no faturamento, produto tem código tributário. São contextos distintos."]],
          er: ["Copiar tabelas do banco para as classes do domínio sem modelar regras.", "Distribuir regras de negócio por helpers desconectados do modelo.", "Impor um único modelo de produto a todos os contextos."],
          lab: "Liste entidades e objetos de valor de 'matrícula em curso' e escreva duas invariantes.",
          ref: "Eric Evans — Domain-Driven Design (Addison-Wesley); Fowler — Domain Model, https://martinfowler.com/eaaCatalog/domainModel.html."
        }),

      L("APIs e contratos",
        "Especificar interfaces entre componentes e evitar mudanças incompatíveis.",
        "Modelo de domínio e noção de clientes e servidores.",
        "Uma API é um contrato: se as duas pontas discordam sobre o formato, o sistema quebra mesmo com código correto.",
        "Uma API define operações, entradas, saídas e erros que um componente oferece a outros. Especificações formais como OpenAPI para HTTP e AsyncAPI para eventos descrevem esse contrato de máquina legível, permitindo gerar documentação, validação e tipos de cliente. JSON Schema complementa a descrição dos dados. Um contrato claro reduz a necessidade de combinações informais entre equipes.\n\nA compatibilidade é a propriedade central. Adicionar um campo opcional costuma ser compatível, pois clientes antigos o ignoram. Renomear um campo, mudar seu tipo ou remove-lo é uma mudança incompatível: exige nova versão, adaptação ou período de convivência. Testes de contrato, como os feitos com Pact, verificam que o provedor continua atendendo ao que o consumidor espera, executando mais cedo do que uma integração manual.\n\nBoas APIs tratam erros de forma previsível, com códigos e formatos documentados, e definem idempotência para operações que podem ser repetidas. Versionamento explícito no caminho ou no cabeçalho dá tempo aos consumidores para migrar. O contrato não pertence apenas ao servidor: consumidores são parte da negociação e devem ter voz nas mudanças.",
        [
          ["contrato de API", "Acordo formal sobre operações, formatos de entrada, saída e erros entre componentes."],
          ["OpenAPI", "Especificação padrão para descrever APIs HTTP de forma legível por máquina."],
          ["compatibilidade retroativa", "Propriedade de uma mudança que continua atendendo aos clientes existentes."],
          ["mudança incompatível", "Alteração no contrato que quebra consumidores atuais e exige versão ou migração."],
          ["teste de contrato", "Teste que verifica se o provedor atende às expectativas registradas pelo consumidor."]
        ],
        {
          ex: [["Mudança compatível", "Adicionar `emailOpcional` a uma resposta JSON: clientes antigos leem os campos de sempre e ignoram o novo."], ["Mudança incompatível", "Trocar `id` de número para texto quebra consumidores tipados; publique `/v2` e mantenha `/v1` até a migração."]],
          er: ["Documentar a API apenas em texto livre, sem esquema verificável.", "Alterar o tipo de um campo existente sem versionar.", "Considerar que contrato é responsabilidade somente do servidor."],
          lab: "Escreva um pequeno esquema OpenAPI para `GET /aulas` com respostas `200` e `404`.",
          ref: "OpenAPI Specification — https://spec.openapis.org/oas/latest.html; Pact — https://docs.pact.io/."
        }),

      L("Integração contínua",
        "Montar um pipeline que integre e valide mudanças a cada push.",
        "Git e noção de build.",
        "Integrar com frequência reduz o tamanho e o risco de cada conflito.",
        "Integração contínua (CI) é a prática de mesclar mudanças ao tronco comum várias vezes ao dia, disparando automaticamente build e testes a cada push. O objetivo é feedback rápido: se algo quebrou, o autor descobre enquanto o contexto ainda está fresco. Branch-based development com Integração Contínua deve manter branches de curta duração; branches longas acumulam divergência e tornam a integração dolorosa.\n\nUm pipeline típico executa instalação de dependências, análise estática, testes unitários, testes de integração, build e publicação de artefato. Etapas caras vêm depois das baratas para falhar cedo. O resultado deve ser auditável: histórico de execuções, logs e status de cada etapa. O artefato gerado é imutável e reaproveitado nos ambientes seguintes, evitando que o deploy recompile algo diferente do que foi testado.\n\nCI não é a mesma coisa que entrega contínua: a primeira garante que o código está sempre integrável; a segunda garante que ele pode ser colocado em produção. Um pipeline sem testes automatizados é apenas um mecanismo de build. Ferramentas como GitHub Actions e GitLab CI descrevem o processo em arquivo versionado, tornando-o revisável junto com o código.",
        [
          ["integração contínua", "Prática de mesclar mudanças frequentemente com build e testes automáticos a cada integração."],
          ["pipeline de CI", "Sequência automatizada de etapas que validam e preparam uma mudança."],
          ["build", "Processo que transforma código-fonte em artefato executável ou distribuível."],
          ["artefato", "Resultado imutável do build, usado pelos ambientes seguintes."],
          ["feedback rápido", "Tempo curto entre a mudança do desenvolvedor e o resultado dos checks automáticos."]
        ],
        {
          ex: [["Push com falha", "Um commit que quebra um teste unitário deixa o pipeline vermelho e bloqueia o merge até a correção."], ["Artefato único", "O build gera um pacote versionado; homologação e produção usam exatamente o mesmo arquivo."]],
          er: ["Integrar apenas ao final do sprint, acumulando conflitos.", "Manter pipeline que só compila, sem testes automatizados.", "Rodar os checks apenas na máquina local e nunca no servidor de CI."],
          lab: "Configure um workflow que rode `node --check` e os testes a cada push usando GitHub Actions.",
          ref: "GitHub Actions — https://docs.github.com/actions; Pro Git — https://git-scm.com/book/pt-br/v2."
        }),

      L("Observabilidade: logs, métricas e traces",
        "Instrumentar o sistema para responder perguntas sobre comportamento em produção.",
        "Arquitetura e decisões; noção de requisições e serviços.",
        "Monitorar diz que algo está errado; observar permite perguntar por quê.",
        "Observabilidade é a capacidade de inferir o estado interno de um sistema a partir de seus sinais externos. Os três pilares clássicos são logs, métricas e traces. Logs são eventos com carimbo de tempo e contexto; logs estruturados, em JSON, permitem consultas por campo. Métricas são medidas numéricas ao longo do tempo, como contadores, gauges e histogramas de latência. Traços distribuídos ligam as etapas de uma requisição entre componentes por meio de um identificador de correlação.\n\nA média esconde a cauda: um serviço com média de 80 ms pode ter p99 de 2 s. Por isso, histogramas e percentis são mais informativos para definir SLOs, objetivos de nível de serviço. Um SLI é o indicador medido, como proporção de requisições bem-sucedidas; o SLO é a meta, e o erro orçamento é quanto se pode violá-la. Alertas devem ser acionáveis: sem uma resposta prevista, viram ruído.\n\nInstrumentar bem exige cuidado com privacidade. Nunca registre senhas, tokens ou dados sensíveis em logs. Em uma aplicação client-side, mensagens de erro e tempos de operação podem ser coletados com consentimento e sem identificar o usuário. As mesmas convenções usadas em desenvolvimento ajudam na investigação de incidentes.",
        [
          ["observabilidade", "Capacidade de entender o estado de um sistema a partir de logs, métricas e traços."],
          ["log estruturado", "Evento registrado em formato consistente, com campos consultáveis."],
          ["métrica", "Medida numérica agregada ao longo do tempo, como contador ou histograma."],
          ["traço distribuído", "Registro encadeado das etapas de uma requisição entre serviços."],
          ["SLO", "Objetivo de nível de serviço expresso como meta mensurável para um indicador."]
        ],
        {
          ex: [["Investigação", "Um ID de correlação no log do navegador liga a falha ao trecho do serviço que levou 2 s para responder."], ["Percentil", "Com p95 de 800 ms e SLO de 500 ms, o erro de orçamento acende antes que a média de 120 ms mostre problema."]],
          er: ["Registrar tokens e dados pessoais em logs.", "Usar apenas a média de latência e ignorar p95 e p99.", "Criar alertas sem limite claro nem ação definida."],
          lab: "Instrumente uma função com log estruturado contendo timestamp, nível e ID de correlação.",
          ref: "Google SRE Book, cap. 6 (Monitoring Distributed Systems) — https://sre.google/sre-book/table-of-contents/; OpenTelemetry — https://opentelemetry.io/docs/."
        }),

      L("Dívida técnica e refatoração",
        "Identificar dívida técnica e planejar refatoração com segurança.",
        "Testes automatizados e revisão de código.",
        "Dívida técnica é o atalho de hoje que cobra juros em cada mudança futura.",
        "O termo dívida técnica, cunhado por Ward Cunningham, compara atalhos de implementação a dívidas: pagamos com trabalho extra sempre que precisamos alterar a área afetada. Pode ser deliberada, quando assumimos o atalho para cumprir um prazo com plano de pagamento, ou acidental, quando nasce de ignorância ou negligência. Nem todo código feio é dívida; o critério é o custo extra de manutenção que ele impõe.\n\nRefatorar é melhorar a estrutura sem mudar o comportamento observável, como definido por Martin Fowler. Pequenas transformações verificadas — extrair função, renomear, eliminar duplicação — são mais seguras que reescritas amplas. Testes automatizados funcionam como rede de segurança; sem eles, a refatoração se transforma em alteração de comportamento não percebida. Em sistemas legados, o padrão estrangulamento substitui partes aos poucos, mantendo o sistema funcionando durante a migração.\n\nGerenciar dívida é priorização, não limpeza indiscriminada. Registre o item com custo atual, risco e critério de conclusão; compare com o valor das funcionalidades competidoras. Áreas com alta frequência de mudança e poucos testes merecem atenção antes de módulos estáveis que ninguém toca.",
        [
          ["dívida técnica", "Atalho ou deficiência de implementação que aumenta o custo de mudanças futuras."],
          ["juros da dívida", "Trabalho adicional exigido em cada alteração por causa da dívida acumulada."],
          ["dívida deliberada", "Atalho assumido conscientemente com plano posterior de correção."],
          ["refatoração", "Mudança estrutural que melhora o código sem alterar comportamento."],
          ["estrangulamento", "Estratégia de migrar um sistema legado substituindo partes gradativamente."]
        ],
        {
          ex: [["Módulo sem testes", "Cada alteração exige dois dias de verificação manual; adicionar testes reduz os juros e acelera mudanças seguras."], ["Renomear com segurança", "Renomear conceito e atualizar referências é refatoração desde que o comportamento continue idêntico e os testes passem."]],
          er: ["Parar toda a entrega para limpar dívidas sem priorizar impacto.", "Refatorar sem testes e sem verificar comportamento.", "Chamar qualquer bug de dívida técnica, sem distinguir defeito de atalho estrutural."],
          lab: "Registre no backlog um item de dívida com custo atual, risco e critério de conclusão.",
          ref: "Fowler — Refactoring (Addison-Wesley, https://refactoring.com/); Martin — Clean Code (Prentice Hall)."
        })
    ]
  },
  {
    name: "Qualidade e entrega",
    lessons: [
      L("Plano de testes e pirâmide",
        "Planejar níveis de teste equilibrando custo, velocidade e risco.",
        "Ciclo de vida e requisitos.",
        "A pirâmide de testes diz que a base deve ter muitos testes rápidos e o topo, poucos testes caros.",
        "Um plano de testes define escopo, riscos, níveis, técnicas, responsabilidades, ambiente e critérios de saída. Ele responde ao que testar e ao quando considerar que a qualidade é suficiente para entregar. O plano emerge dos requisitos: áreas com maior risco de falha ou maior impacto recebem mais atenção, enquanto funcionalidades de baixo risco recebem verificação mais leve.\n\nA pirâmide de testes organiza os níveis por custo e velocidade. Na base ficam muitos testes unitários rápidos e determinísticos; acima, testes de integração que exercitam a cooperação entre componentes; no topo, poucos testes de interface ou end-to-end, que são lentos e mais propensos a instabilidade. O modelo inverso, com muitos testes de interface, gera feedback demorado e difícil diagnóstico. A forma é uma metáfora: o importante é a proporção entre rapidez, estabilidade e cobertura de risco.\n\nCritérios de saída tornam o plano verificável: todos os testes obrigatórios passam, nenhum defeito de severidade alta permanece aberto, e os cenários de aceitação combinados com o cliente foram executados. Cobertura de código é um sinal útil para encontrar lacunas, não uma meta isolada: 100% de cobertura não prova que as asserções são corretas.",
        [
          ["plano de testes", "Documento que define escopo, níveis, responsabilidades e critérios de saída dos testes."],
          ["pirâmide de testes", "Modelo com muitos testes unitários, menos de integração e poucos testes de interface."],
          ["teste de unidade", "Teste rápido que verifica uma pequena unidade de código isoladamente."],
          ["teste end-to-end", "Teste que exercita o fluxo completo pela interface, como um usuário."],
          ["critério de saída", "Condição verificável que autoriza o encerramento da fase de testes."]
        ],
        {
          ex: [["Distribuição", "Cem testes unitários, vinte de integração e cinco end-to-end: falhas comuns aparecem em segundos, e os caros validam o fluxo principal."], ["Risco", "A área de pagamento recebe cenários adicionais e severidade máxima para defeitos, com critério de saída explícito."]],
          er: ["Testar tudo apenas pela interface gráfica.", "Transformar porcentagem de cobertura na única meta de qualidade.", "Encerrar a fase de testes sem critérios definidos."],
          lab: "Escreva um plano de testes com três níveis e critérios de saída para uma funcionalidade da plataforma.",
          ref: "Fowler — TestPyramid, https://martinfowler.com/bliki/TestPyramid.html; Sommerville — Software Engineering (Pearson)."
        }),

      L("Testes unitários e mock",
        "Escrever testes unitários determinísticos e usar dublês de dependência com critério.",
        "Funções e plano de testes.",
        "Um bom teste unitário é pequeno, independente e falha por uma razão clara.",
        "Teste unitário verifica uma unidade de código isolada, normalmente uma função ou classe. A estrutura Arrange-Act-Assert separa preparação, execução e verificação. Um teste deve ser determinístico, rápido e independente dos outros, sem depender de ordem de execução, rede ou relógio. Nomes descritivos documentam o comportamento esperado.\n\nQuando a unidade depende de algo externo, usamos dublês. Um stub devolve valores pré-definidos; um fake é uma implementação simplificada e funcional, como um repositório em memória; um spy registra chamadas; um mock também verifica expectativas de interação. Cada tipo resolve uma necessidade. Mockar uma função pura não agrega valor e torna o teste refém de detalhes internos.\n\nO excesso de mocks é uma armadilha: se tudo é substituído, o teste pode passar enquanto a integração real está quebrada. Teste comportamento observável, não detalhes internos. Quando a interação com uma dependência é a própria regra, como enviar um evento, verificar a chamada é legítimo; quando o importante é o resultado, prefira um fake e asserte o resultado.",
        [
          ["teste unitário", "Teste que verifica uma pequena unidade de código isolada de suas dependências."],
          ["mock", "Dublê que substitui uma dependência e verifica expectativas de chamada."],
          ["stub", "Dublê que devolve respostas pré-definidas sem verificar interações."],
          ["fake", "Implementação simplificada e utilizável de uma dependência, como repositório em memória."],
          ["Arrange-Act-Assert", "Estrutura de teste que separa preparação, execução e verificação."]
        ],
        {
          ex: [["Função soma", "Preparar entradas `2` e `3`, executar `soma(2, 3)`, afirmar resultado `5`; nenhuma dependência externa."], ["Repositório falso", "Fake em memória devolve um registro fixo; o teste valida a regra de negócio sem tocar disco ou rede."]],
          er: ["Testar detalhes privados da implementação em vez do comportamento.", "Mockar funções puras e todas as dependências por hábito.", "Deixar um teste depender do estado criado pelo teste anterior."],
          lab: "Escreva três testes unitários para uma função que valida e-mail, incluindo um caso inválido.",
          ref: "Martin — Clean Code (Prentice Hall); documentação oficial do framework escolhido, por exemplo https://vitest.dev/guide/."
        }),

      L("Testes de integração e contrato",
        "Verificar a cooperação entre componentes e a conformidade com contratos.",
        "Testes unitários e APIs e contratos.",
        "Testes unitários provam que cada peça funciona; testes de integração provam que as peças funcionam juntas.",
        "Testes de integração exercitam a interação real entre módulos, banco de dados, filas ou serviços. Eles revelam problemas que mocks escondem: consultas incorretas, formatação divergente, transações mal gerenciadas. Para serem repetíveis, usam bancos efêmeros ou ambientes isolados, com limpeza explícita entre cenários. São mais lentos que testes unitários e devem ser seletivos.\n\nTestes de contrato verificam o acordo entre produtor e consumidor de uma API. Na abordagem consumer-driven, o consumidor publica expectativas — campos, tipos, formatos — e o produtor as valida em seu pipeline. Assim, uma mudança incompatível é detectada antes do deploy, sem exigir que todos os serviços subam juntos. A especificação OpenAPI também pode ser usada como fonte de validação de requisições e respostas.\n\nFerramentas como Testcontainers permitem subir dependências reais em contêineres descartáveis. Isso aumenta a fidelidade do teste, mas exige disciplina: nada de apontar para banco de produção, nada de reutilizar dados de um cenário no seguinte. Quando a integração é instável, investigue a causa em vez de repetir a execução até passar.",
        [
          ["teste de integração", "Teste que verifica a interação entre dois ou mais componentes reais."],
          ["teste de contrato", "Teste que valida se um provedor atende às expectativas registradas por seus consumidores."],
          ["consumer-driven contract", "Abordagem em que as expectativas do consumidor orientam a validação do provedor."],
          ["ambiente de teste", "Configuração isolada e repetível onde os testes de integração são executados."],
          ["dependência externa", "Recurso fora da unidade testada, como banco, fila ou serviço remoto."]
        ],
        {
          ex: [["Integração com banco", "Subir banco temporário, gravar um registro e consultá-lo na mesma transação; confirmar que a leitura retorna os dados gravados."], ["Contrato", "O consumidor espera `id` numérico; quando o provedor passa a devolver texto, o teste de contrato falha no CI do provedor."]],
          er: ["Apontar testes de integração para banco de produção.", "Substituir todas as integrações por mocks e nunca testar o adaptador real.", "Permitir que dados de um cenário influenciem o próximo."],
          lab: "Escreva um teste de integração que grave e leia um registro em banco temporário.",
          ref: "Pact — https://docs.pact.io/; Testcontainers — https://www.testcontainers.org/."
        }),

      L("TDD e design",
        "Aplicar o ciclo vermelho-verde-refatoração como ferramenta de projeto.",
        "Testes unitários.",
        "Escrever o teste antes do código força a decidir como a funcionalidade será usada.",
        "TDD, ou desenvolvimento orientado a testes, é o ciclo de escrever um teste que falha, implementar o mínimo para passar e refatorar mantendo os testes verdes. A etapa vermelha confirma que o teste realmente detecta a ausência da funcionalidade; a etapa verde limita o código ao necessário; a refatoração remove duplicação e melhora nomes. O ciclo costuma ser curto, com várias repetições por hora.\n\nO teste primeiro funciona como especificação executável e influencia o design. Ao escrever o teste, definimos a interface da unidade antes da implementação. Quando a dependência é difícil de simular, surge a necessidade de extrair uma abstração — o design emerge de uma tensão concreta. Há duas entradas possíveis: outside-in, começando por um teste de aceitação e descendo às unidades, e inside-out, começando pelas unidades e subindo.\n\nTDD não substitui testes de integração nem exploração inicial. Em protótipos ou problemas cuja solução ainda é desconhecida, pode ser mais produtivo experimentar antes de fixar testes. O valor aparece em código com requisitos claros e manutenção contínua. O maior risco é pular a refatoração e acumular código que apenas satisfaz asserções estreitas.",
        [
          ["TDD", "Desenvolvimento orientado a testes, com teste escrito antes da implementação."],
          ["ciclo vermelho-verde-refatoração", "Sequência de teste falhando, implementação mínima e melhoria sem mudar comportamento."],
          ["design emergente", "Projeto que surge gradualmente das necessidades reveladas pelos testes."],
          ["teste de aceitação", "Teste de alto nível que expressa o comportamento esperado por um requisito."],
          ["especificação executável", "Teste que descreve o comportamento desejado e pode ser executado automaticamente."]
        ],
        {
          ex: [["Ciclo completo", "Escrever `soma(2, 3) === 5`, ver falhar, retornar `a + b`, depois renomear variáveis com testes verdes."], ["Design", "A dificuldade de simular o repositório levou a extrair uma interface, reduzindo o acoplamento da regra à persistência."]],
          er: ["Escrever o teste depois do código e chamar isso de TDD.", "Acumular duplicação e pular a etapa de refatoração.", "Achar que TDD elimina a necessidade de testes de integração."],
          lab: "Aplique TDD em uma função de desconto: teste falhando, código mínimo e refatoração.",
          ref: "Kent Beck — Test-Driven Development: By Example (Addison-Wesley); Fowler — Refactoring, https://refactoring.com/."
        }),

      L("Análise estática e lint",
        "Usar ferramentas que detectam problemas antes da execução do código.",
        "Edição e Git; noção de compilação.",
        "Analisar sem executar é o jeito mais barato de encontrar certos erros.",
        "Análise estática examina código-fonte sem executá-lo. Linters aplicam regras de estilo e de erro comum, como variáveis não usadas ou condições suspeitas. Formatadores padronizam layout e terminam discussões subjetivas sobre espaçamento. Analisadores de tipos detectam acessos a campos inexistentes e argumentos incompatíveis antes de rodar o programa. Ferramentas de SAST procuram padrões de vulnerabilidade, como concatenação de entrada do usuário em consultas.\n\nO valor está na repetição automática: as mesmas regras valem para todos os desenvolvedores e são aplicadas no editor e no pipeline. Um check de CI que falha impede que código com problemas óbvios avance. A configuração faz parte do repositório e deve ser revisada como qualquer outro código.\n\nHá limites. Formatar não corrige lógica; lint não substitui testes; analisadores produzem falsos positivos. Silenciar uma regra é legítimo quando há justificativa no local e preferência por soluções estruturais. Desativar regras em massa apenas para o pipeline passar troca um problema visível por um invisível.",
        [
          ["análise estática", "Exame do código-fonte sem execução, buscando erros, estilo e riscos."],
          ["lint", "Aplicação automatizada de regras de estilo e probabilidade de erro."],
          ["formatador", "Ferramenta que reescreve o código para um padrão consistente de formatação."],
          ["analisador de tipos", "Ferramenta que verifica tipos e assinaturas antes da execução."],
          ["SAST", "Análise estática de segurança voltada a padrões de vulnerabilidade no código."]
        ],
        {
          ex: [["ESLint", "A regra `no-unused-vars` aponta uma variável órfã antes do commit."], ["TypeScript", "O compilador avisa que o campo `titulo` não existe no tipo da aula, evitando erro em tempo de execução."]],
          er: ["Desativar grupos de regras inteiros só para fazer o pipeline passar.", "Confundir formatação automática com correção de lógica.", "Rodar lint apenas localmente e nunca no CI."],
          lab: "Execute um linter no projeto e corrija três avisos sem alterar comportamento.",
          ref: "ESLint — https://eslint.org/docs/latest/; TypeScript — https://www.typescriptlang.org/docs/; OWASP — https://owasp.org/www-community/Source_Code_Analysis_Tools."
        }),

      L("Revisão de código",
        "Conduzir revisões que encontrem defeitos e compartilhem conhecimento.",
        "Git e testes automatizados.",
        "Revisão é uma conversa sobre o código, não um julgamento sobre a pessoa que o escreveu.",
        "A revisão de código tem três objetivos: detectar defeitos, garantir consistência e disseminar conhecimento pela equipe. Pull requests pequenos e com descrição clara recebem comentários melhores do que mudanças enormes. Checks automáticos devem passar antes da revisão humana, para que o tempo da equipe seja gasto em lógica, legibilidade e risco.\n\nUm checklist útil cobre correção do comportamento, presença de testes, tratamento de erros, segurança, nomes e aderência ao estilo do projeto. Comentários devem ser específicos e acionáveis: apontar o problema e sugerir uma saída. A distinção entre comentário opcional e bloqueante evita ambiguidade sobre o que precisa mudar antes do merge. O autor responde ou corrige, e o revisor reavalia.\n\nRevisar é também uma responsabilidade de quem escreve: explicar o contexto, dividir a mudança e indicar onde testar. Aprovar sem ler para destravar o time anula o benefício da prática. Misturar refatoração extensa com correção de bug dificulta a leitura e esconde regressões.",
        [
          ["revisão de código", "Exame sistemático de uma mudança por outra pessoa antes de sua integração."],
          ["pull request", "Proposta de mudança com histórico, descrição e espaço para discussão e revisão."],
          ["checklist de revisão", "Lista de pontos a verificar, como correção, testes, segurança e legibilidade."],
          ["aprovação", "Declaração do revisor de que a mudança pode ser integrada."],
          ["comentário bloqueante", "Comentário que impede o merge até ser resolvido."]
        ],
        {
          ex: [["PR pequeno", "Uma mudança de oitenta linhas com testes recebe comentários precisos em poucos minutos."], ["Achado útil", "O revisor nota que a validação não cobre vetor vazio; o autor adiciona o caso e o teste correspondente."]],
          er: ["Aprovar sem ler apenas para destravar o merge.", "Misturar refatoração ampla com correção de bug em um mesmo PR.", "Escrever comentários sobre a pessoa em vez de comentar o código."],
          lab: "Revise um PR de colega com um checklist de quatro itens e deixe um comentário acionável.",
          ref: "Pro Git, cap. 6 — https://git-scm.com/book/pt-br/v2; Google — Code Review Developer Guide, https://google.github.io/eng-practices/review/."
        }),

      L("Segurança no ciclo de vida",
        "Incorporar práticas de segurança desde os requisitos até a operação.",
        "Arquitetura, revisão e análise estática.",
        "Segurança não é uma camada final: é um conjunto de decisões distribuídas por todo o ciclo.",
        "Abordagens de shift-left security antecipam a consideração de ameaças para as fases iniciais. A modelagem de ameaças pergunta o que pode ser atacado, por quem e com que consequência, antes da implementação. Requisitos de segurança viram critérios de aceitação, assim como qualquer outro requisito. No código, validação de entrada, princípio do menor privilégio e padrões seguros reduzem a superfície de ataque.\n\nDurante a integração,	varredura de dependências identifica componentes com vulnerabilidades conhecidas, enquanto SAST e revisão apontam padrões arriscados. Segredos ficam fora do repositório, em variáveis de ambiente ou cofres, e nunca aparecem em logs. Em produção, monitoramento e resposta a incidentes fecham o ciclo: detectar, conter, corrigir e aprender. A cadeia de suprimentos de software também importa, pois uma dependência comprometida afeta todos os consumidores.\n\nA referência OWASP Top 10 organiza os riscos mais comuns em aplicações web, como injeção, falhas de autenticação e exposição de dados. Listas são ponto de partida, não checklist único: o contexto do sistema define quais ameaças são prioritárias. Tratar segurança como etapa posterior ao deploy deixa pouco tempo e poucas opções para corrigir problemas estruturais.",
        [
          ["segurança no ciclo de vida", "Integração de práticas de segurança em requisitos, projeto, código, testes e operação."],
          ["modelagem de ameaças", "Análise sistemática de ativos, ataques possíveis e consequências."],
          ["varredura de dependências", "Verificação automática de bibliotecas por vulnerabilidades conhecidas."],
          ["gerenciamento de segredos", "Armazenamento e uso controlados de credenciais, fora do código-fonte."],
          ["OWASP Top 10", "Lista reconhecida dos riscos de segurança mais comuns em aplicações web."]
        ],
        {
          ex: [["Dependência vulnerável", "A varredura aponta uma biblioteca com CVE; a equipe atualiza para a versão corrigida antes do merge."], ["Segredo fora do código", "O token sai do arquivo e vai para variável de ambiente; o log de erro nunca o imprime."]],
          er: ["Commitar chaves de API no repositório.", "Confiar apenas em firewall e negligenciar validação de entrada.", "Deixar a revisão de segurança para depois do deploy."],
          lab: "Rode uma varredura de dependências e classifique os achados por severidade e prazo de correção.",
          ref: "OWASP Top 10 — https://owasp.org/www-project-top-ten/; GitHub Dependabot — https://docs.github.com/code-security/dependabot."
        }),

      L("Entrega contínua e rollback",
        "Planejar deploys frequentes, seguros e reversíveis.",
        "Integração contínua e observabilidade.",
        "Entregar bem não é só publicar: é conseguir voltar rápido quando o ambiente real discorda dos testes.",
        "Entrega contínua significa que toda mudança aprovada está pronta para produção e pode ser publicada automaticamente. Isso exige pipeline confiável, artefatos imutáveis e configuração separada do código. A publicação pode usar estratégias como blue-green, com duas versões prontas e troca de tráfego, ou canário, com exposição gradual a uma fração dos usuários. Feature flags permitem liberar código desligado e ativá-lo depois, separando deploy de lançamento.\n\nRollback é a volta a uma versão anterior quando há problema. Ele só funciona se o caminho de volta foi preservado: mudanças de esquema de banco devem seguir o padrão expand-contract, primeiro adicionando estrutura compatível e removendo a antiga apenas depois da migração completa. Antes de publicar, defina critérios de aborto com base em métricas, como taxa de erro e latência. Depois, observe o resultado por tempo suficiente.\n\nUm deploy manual sem registro dificulta auditoria e repetição. Automatizar a publicação torna o processo previsível e permite que qualquer pessoa autorizada execute os mesmos passos. Rollforward — avançar para uma correção — pode ser preferível quando o rollback é caro ou inseguro. A decisão depende do tipo de mudança e do tempo disponível para recuperar o serviço.",
        [
          ["entrega contínua", "Prática de manter toda mudança aprovada pronta e apta a ser publicada automaticamente."],
          ["deploy canário", "Publicação gradual para uma fração dos usuários antes de liberar para todos."],
          ["blue-green", "Estratégia com duas versões prontas e alternância de tráfego entre elas."],
          ["rollback", "Procedimento de voltar a uma versão anterior após falha na publicação."],
          ["feature flag", "Chave de configuração que permite ativar ou desativar uma funcionalidade sem novo deploy."]
        ],
        {
          ex: [["Canário", "Cinco por cento do tráfego vai para a versão 2; se a taxa de erro subir, o roteamento volta para a versão 1."], ["Migração segura", "Adicionar coluna nova sem remover a antiga permite rollback; removê-la no mesmo deploy impede a volta."]],
          er: ["Publicar manualmente sem registro do que foi executado.", "Achar que rollback sempre funciona, inclusive após mudança incompatível de esquema.", "Não acompanhar métricas e logs após o deploy."],
          lab: "Descreva um plano de deploy com canário, critério de aborto e passos de rollback.",
          ref: "Humble & Farley — Continuous Delivery (Addison-Wesley); Google SRE Book, cap. 8 (Release Engineering) — https://sre.google/sre-book/table-of-contents/."
        })
    ]
  }
);

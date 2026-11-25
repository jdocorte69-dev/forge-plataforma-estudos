/* ============================================================
   FORGE — data-software.js — Trilha Engenharia de Software
   ============================================================ */

CURRICULUM.software = {
  name: "Engenharia de Software",
  icon: "⚙",
  modules: [
    {
      name: "Fundamentos do desenvolvimento",
      lessons: [
        L("Ciclo de vida e processos",
          "Conhecer as fases de um projeto de software e comparar modelos de processo.",
          "Nenhum. Lógica básica é suficiente.",
          "Construir software é um processo, não um evento: as necessidades mudam e a equipe precisa de um ritmo.",
          "O ciclo de vida inclui levantamento, projeto, implementação, testes, entrega e manutenção. Modelos preditivos como cascata funcionam bem quando o escopo é estável; modelos iterativos e incrementais entregam valor em fatias. Scrum e Kanban são frameworks ágeis populares. A escolha depende de risco, incerteza e tamanho do time.",
        [
          ["ciclo de vida", "Conjunto de fases pelas quais um software passa do conceito à manutenção."],
          ["modelo cascata", "Abordagem sequencial em que cada fase termina antes da próxima."],
          ["iteração", "Ciclo curto que produz uma versão utilizável do produto."],
          ["Scrum", "Framework ágil com sprints, papéis e eventos definidos."],
          ["manutenção", "Fase de correções, adaptações e melhorias após a entrega."]
        ],
        {
          ex: [["Scrum", "Entregas em sprints com revisão e retrospectiva."], ["Cascata", "Fases lineares com marcos bem definidos."]],
          er: ["Achar que ágil significa ausência de planejamento.", "Seguir um modelo por moda, sem considerar o contexto."],
          lab: "Mapeie as fases de um projeto seu e classifique-o como preditivo ou adaptativo."
        }),
        L("Engenharia de requisitos",
          "Elicitar, documentar e validar requisitos funcionais e não funcionais.",
          "Ciclo de vida de software.",
          "Requisitos são a ponte entre o que o cliente quer e o que a equipe vai construir.",
          "Requisitos funcionais descrevem comportamentos; não funcionais descrevem qualidades como desempenho, segurança e usabilidade. Devem ser claros, verificáveis e priorizados. Histórias de usuário seguem o formato 'como papel, quero ação, para benefício'. Critérios de aceitação tornam o requisito testável. Requisitos mudam: rastreabilidade ajuda a gerenciar impacto.",
        [
          ["requisito funcional", "Comportamento ou capacidade que o sistema deve oferecer."],
          ["requisito não funcional", "Atributo de qualidade ou restrição sobre o sistema."],
          ["história de usuário", "Descrição curta de uma funcionalidade sob a perspectiva de um papel."],
          ["critério de aceitação", "Condição verificável que confirma que um requisito foi atendido."],
          ["rastreabilidade", "Capacidade de ligar requisitos a código, testes e decisões."]
        ],
        {
          ex: [["RNF de desempenho", "A página deve carregar em menos de 2 segundos."], ["História", "Como aluno, quero ver meu progresso, para acompanhar meus estudos."]],
          er: ["Escrever requisitos vagos como 'deve ser rápido'.", "Pular a validação com o cliente."]
        }),
        L("Arquitetura e decisões",
          "Entender estilos arquiteturais e registrar decisões importantes.",
          "Requisitos e noção de sistemas.",
          "Arquitetura são as decisões estruturais difíceis de mudar depois.",
          "A arquitetura define componentes, responsabilidades e comunicação. Camadas, hexagonal e microserviços são estilos comuns, cada um com custos e benefícios. ADRs registram contexto, opções consideradas, decisão e consequências. Um bom projeto equilibra coesão alta e acoplamento baixo, permitindo mudanças localizadas.",
        [
          ["arquitetura", "Conjunto de decisões estruturais sobre a organização de um sistema."],
          ["camadas", "Estilo que separa apresentação, domínio e infraestrutura."],
          ["ADR", "Registro de uma decisão arquitetural com contexto e consequências."],
          ["coesão", "Grau em que os elementos de um módulo pertencem juntos."],
          ["acoplamento", "Grau de dependência entre módulos."]
        ],
        {
          ex: [["ADR", "Contexto, alternativas, decisão e consequências."], ["Baixo acoplamento", "Mudança em um módulo não exige mudanças em muitos outros."]],
          er: ["Escolher microserviços sem necessidade.", "Tomar decisões arquiteturais sem registrá-las."],
          lab: "Escreva um ADR sobre a escolha de armazenamento local deste projeto."
        }),
        L("Git e versionamento",
          "Usar Git para registrar histórico, criar branches e colaborar.",
          "Uso de terminal.",
          "Git é um sistema de controle de versão distribuído: cada clone contém o histórico completo.",
          "Commits são snapshots com mensagem e identificador. O índice (staging) separa o que será incluído. Branches permitem linhas de trabalho independentes; merge e rebase integram mudanças. Convenções como Conventional Commits melhoram a leitura do histórico. Resolução de conflitos exige entender as duas versões antes de escolher.",
        [
          ["commit", "Snapshot registrado no histórico com autoria e mensagem."],
          ["branch", "Ponteiro móvel para uma linha de desenvolvimento."],
          ["staging area", "Área onde mudanças são preparadas antes do commit."],
          ["merge", "Operação que integra o histórico de um branch em outro."],
          ["conflito", "Situação em que Git não consegue combinar alterações automaticamente."]
        ],
        {
          ex: [["git add . && git commit -m 'fix: corrige login'", "Prepara e registra as mudanças."], ["git switch -c feature/relatorio", "Cria e muda para um novo branch."]],
          er: ["Fazer commits gigantes e sem mensagem clara.", "Rebase de commits já publicados sem coordenação."],
          lab: "Crie um repositório local, faça dois commits e visualize o log."
        })
      ]
    },
    {
      name: "Qualidade e testes",
      lessons: [
        L("Testes unitários e TDD",
          "Escrever testes automatizados e aplicar o ciclo vermelho-verde-refatoração.",
          "Funções e Git.",
          "Testes automatizados são uma rede de segurança que permite mudar código com confiança.",
          "Testes unitários verificam pequenas unidades isoladamente, com dependências controladas por mocks ou fakes. O ciclo TDD começa com um teste que falha, segue da implementação mínima para passar e termina com refatoração. Nomenclatura clara e independência entre testes são essenciais. Cobertura alta não garante qualidade, mas baixa cobertura esconde riscos.",
        [
          ["teste unitário", "Teste que verifica uma pequena unidade de código isoladamente."],
          ["TDD", "Desenvolvimento guiado por testes, com ciclo falhar-passar-refatorar."],
          ["mock", "Objeto que simula uma dependência para isolar o código testado."],
          ["assertiva", "Verificação que compara resultado obtido com resultado esperado."],
          ["cobertura", "Percentual do código exercitado pelos testes."]
        ],
        {
          ex: [["Teste de soma", "Entrada 2 e 3 deve retornar 5."], ["Ciclo TDD", "Vermelho → verde → refatoração."]],
          er: ["Testar a implementação em vez do comportamento.", "Testes que dependem de ordem de execução."]
        }),
        L("Refatoração e revisão de código",
          "Melhorar a estrutura do código sem alterar comportamento e revisar mudanças.",
          "Testes unitários.",
          "Refatorar é limpar a casa sem trocar os moradores: o comportamento continua o mesmo.",
          "Refatorações comuns incluem extrair método, renomear, substituir condicionais e eliminar duplicação. Testes verdes antes e depois dão segurança. Code review verifica correção, clareza, aderência a padrões e riscos. Comentários devem ser específicos e construtivos. Diffs pequenos facilitam revisões boas.",
        [
          ["refatoração", "Mudança estrutural que preserva o comportamento observável."],
          ["code smell", "Sinal de possível problema estrutural no código."],
          ["code review", "Revisão sistemática de uma mudança por outras pessoas."],
          ["extrair método", "Refatoração que move um bloco para uma função nomeada."],
          ["diff", "Diferença entre versões de um arquivo."]
        ],
        {
          ex: [["Método com 200 linhas", "Candidato a extração de métodos menores."], ["Diff pequeno", "Mais fácil de revisar com atenção."]],
          er: ["Refatorar sem testes de apoio.", "Misturar refatoração e mudança de comportamento no mesmo commit."]
        }),
        L("Integração e entrega contínuas",
          "Automatizar build, testes e entrega com pipelines de CI/CD.",
          "Git e testes.",
          "CI/CD transforma um processo manual e frágil em um fluxo repetível e auditável.",
          "Integração contínua integra mudanças frequentemente e roda testes automaticamente a cada push. Entrega contínua mantém o software sempre pronto para publicar; deploy contínuo publica automaticamente. Pipelines definem etapas como instalar, testar, analisar e empacotar. Falhas rápidas e feedback visível são o coração da prática.",
        [
          ["CI", "Prática de integrar mudanças com frequência e validar automaticamente."],
          ["CD", "Automação da entrega ou do deploy após a validação."],
          ["pipeline", "Sequência automatizada de etapas de build, teste e entrega."],
          ["build", "Processo de transformar código fonte em artefato executável."],
          ["artefato", "Resultado versionado de um build, pronto para ser implantado."]
        ],
        {
          ex: [["Pipeline", "install → lint → test → build → deploy."], ["Gate de qualidade", "Falha o pipeline se os testes não passam."]],
          er: ["Pipeline sem testes automatizados.", "Negligenciar avisos de segurança no build."]
        })
      ]
    },
    {
      name: "Dados e APIs",
      lessons: [
        L("Banco de dados relacional e SQL",
          "Modelar dados relacionais e consultá-los com SQL.",
          "Conceito de persistência.",
          "Bancos relacionais guardam dados em tabelas com relações bem definidas.",
          "Modelagem normalizada reduz redundância usando chaves primárias e estrangeiras. SQL divide-se em DDL, DML e DCL. SELECT filtra com WHERE, agrupa com GROUP BY e ordena com ORDER BY. JOIN combina tabelas relacionadas. Transações garantem atomicidade, consistência, isolamento e durabilidade — as propriedades ACID.",
        [
          ["tabela", "Conjunto de linhas e colunas que representa uma entidade."],
          ["chave primária", "Coluna ou conjunto que identifica cada linha unicamente."],
          ["chave estrangeira", "Coluna que referencia a chave primária de outra tabela."],
          ["JOIN", "Operação SQL que combina linhas de tabelas relacionadas."],
          ["transação", "Sequência de operações tratadas como uma unidade atômica."]
        ],
        {
          ex: [["SELECT nome FROM alunos WHERE media >= 7;", "Filtra alunos aprovados."], ["INNER JOIN", "Retorna apenas linhas com correspondência nas duas tabelas."]],
          er: ["Esquecer o ON em um JOIN.", "Usar SELECT * em produção sem necessidade."],
          lab: "Escreva uma consulta que conte alunos por turma."
        }),
        L("NoSQL e modelagem de dados",
          "Conhecer tipos de bancos NoSQL e quando usá-los.",
          "Banco relacional.",
          "Nem todo dado se encaixa bem em tabelas rígidas; NoSQL oferece outros modelos.",
          "Bancos de documentos guardam objetos parecidos com JSON; de colunas ampliam famílias de colunas; chave-valor são simples e rápidos; grafos enfatizam relações. Modelagem orientada a consulta é mais importante que normalização nesses bancos. Trocas envolvem consistência eventual, esquema flexível e escalabilidade horizontal.",
        [
          ["NoSQL", "Categoria de bancos que não usam o modelo relacional tradicional."],
          ["banco de documentos", "Banco que armazena documentos autocontidos, frequentemente JSON."],
          ["chave-valor", "Modelo simples que associa uma chave a um valor."],
          ["escalabilidade horizontal", "Capacidade de distribuir carga entre várias máquinas."],
          ["consistência eventual", "Modelo em que réplicas convergem com o tempo, não instantaneamente."]
        ],
        {
          ex: [["MongoDB", "Exemplo de banco de documentos."], ["Redis", "Exemplo de banco chave-valor."]],
          er: ["Escolher NoSQL apenas por moda.", "Ignorar padrões de consulta na modelagem."]
        }),
        L("HTTP e APIs REST",
          "Entender requisições, respostas e desenhar APIs REST coerentes.",
          "Conceito de cliente-servidor e redes.",
          "HTTP é o protocolo que sustenta a web; REST é um estilo de organizar recursos sobre ele.",
          "Uma requisição tem método, URL, cabeçalhos e corpo. Métodos comuns: GET, POST, PUT, PATCH e DELETE. Códigos de status agrupam sucesso (2xx), redirecionamento (3xx), erro do cliente (4xx) e erro do servidor (5xx). REST trata recursos com URLs nomeadas e usa o método para expressar a operação. Idempotência e statelessness simplificam escalabilidade.",
        [
          ["HTTP", "Protocolo de aplicação para troca de mensagens entre cliente e servidor."],
          ["REST", "Estilo arquitetural baseado em recursos e operações HTTP."],
          ["método HTTP", "Verbo que indica a ação desejada, como GET ou POST."],
          ["código de status", "Número que indica o resultado da requisição."],
          ["idempotência", "Propriedade de uma operação que pode ser repetida sem efeitos adicionais."]
        ],
        {
          ex: [["GET /alunos/42", "Recupera o aluno com id 42."], ["404", "Recurso não encontrado."]],
          er: ["Usar GET para criar registros.", "Retornar 200 para erros."],
          lab: "Liste cinco endpoints de uma API de biblioteca com métodos e status esperados."
        }),
        L("Autenticação e autorização",
          "Diferenciar identidade de permissões e aplicar práticas seguras.",
          "HTTP e noção de segurança.",
          "Autenticação responde 'quem é você?'; autorização responde 'o que você pode fazer?'.",
          "Sessões mantêm estado no servidor com um cookie; tokens como JWT carregam informações assinadas no cliente. OAuth 2.0 delega acesso; OpenID Connect acrescenta identidade. Senhas devem ser armazenadas com hash salgado e lento, nunca em texto claro. Autorização pode ser baseada em papéis ou em atributos, e deve ser aplicada também no servidor.",
        [
          ["autenticação", "Processo de verificar a identidade de um usuário ou serviço."],
          ["autorização", "Processo de conceder ou negar acesso a um recurso."],
          ["JWT", "Token assinado que transporta informações de forma verificável."],
          ["hash salgado", "Técnica que adiciona dado aleatório antes de gerar o hash da senha."],
          ["OAuth", "Protocolo de delegação de acesso entre serviços."]
        ],
        {
          ex: [["401", "Não autenticado."], ["403", "Autenticado, mas sem permissão."]],
          er: ["Confiar apenas na validação do frontend.", "Guardar tokens sensíveis em localStorage sem precaução."]
        })
      ]
    },
    {
      name: "Operações e projetos",
      lessons: [
        L("Docker e containers",
          "Entender containers, imagens e como reproduzir ambientes.",
          "Linux e linha de comando.",
          "Container é um processo isolado com seu próprio sistema de arquivos, não uma máquina virtual completa.",
          "Uma imagem é um modelo imutável construído em camadas; um container é uma instância em execução. Dockerfiles descrevem a construção. Namespaces e cgroups do kernel Linux fornecem isolamento e limites de recursos. Volumes persistem dados além do ciclo de vida do container.Builds em múltiplos estágios reduzem o tamanho final da imagem.",
        [
          ["container", "Processo isolado com ambiente próprio executado sobre o mesmo kernel."],
          ["imagem", "Modelo imutável usado para criar containers."],
          ["Dockerfile", "Arquivo com instruções para construir uma imagem."],
          ["volume", "Mecanismo que persiste dados fora do sistema de arquivos do container."],
          ["camada", "Parte de uma imagem resultante de uma instrução do Dockerfile."]
        ],
        {
          ex: [["docker build -t app .", "Constrói uma imagem chamada app."], ["docker run -p 8080:80 app", "Executa o container expondo a porta."]],
          er: ["Rodar containers como root sem necessidade.", "Guardar dados importantes apenas dentro do container."],
          lab: "Escreva um Dockerfile simples e explique cada instrução."
        }),
        L("Observabilidade e monitoramento",
          "Coletar métricas, logs e traces para entender sistemas em produção.",
          "Logs e redes Linux.",
          "Observabilidade é a capacidade de responder perguntas sobre o sistema sem precisar adivinhar.",
          "Os três pilares são logs, métricas e traces. Logs registram eventos; métricas são medidas numéricas ao longo do tempo; traces seguem uma requisição entre serviços. SLOs definem níveis de serviço esperados e orçamentos de erro ajudam a equilibrar inovação e estabilidade. Alertas devem ser acionáveis, e dashboards devem responder perguntas reais.",
        [
          ["observabilidade", "Capacidade de inferir o estado interno de um sistema a partir de sinais externos."],
          ["métrica", "Medida numérica coletada ao longo do tempo."],
          ["trace", "Registro do caminho de uma requisição através de serviços."],
          ["SLO", "Objetivo de nível de serviço acordado para um sistema."],
          ["alerta acionável", "Alerta que exige e permite uma ação clara."]
        ],
        {
          ex: [["Latência p95", "Medida que mostra o pior tempo experimentado por 5% das requisições."], ["Trace distribuído", "Permite seguir uma requisição entre microsserviços."]],
          er: ["Criar alertas para tudo e gerar fadiga.", "Dashboards com gráficos que ninguém consulta."],
          lab: "Defina três métricas úteis para acompanhar este aplicativo de estudos."
        })
      ]
    }
  ]
};

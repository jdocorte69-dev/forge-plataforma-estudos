/* ============================================================
   FORGE — data-db.js
   Banco de dados: modelagem, SQL e transações
   ============================================================ */

CURRICULUM.databases = {
  name: "Banco de Dados",
  icon: "🗄️",
  modules: [
    {
      name: "Modelagem e SQL",
      lessons: [
        L("O que é um SGBD",
          "Diferenciar dados, banco de dados e SGBD, e reconhecer os serviços oferecidos por um SGBD.",
          "Nenhum. Noção de arquivo e de programa já basta.",
          "Pense em um bibliotecário: ele guarda os livros, decide quem pode retirar cada um e reconstrói o catálogo se algo der errado.",
          "Um banco de dados é uma coleção organizada de dados; um SGBD (sistema de gerenciamento de banco de dados) é o software que cria, mantém e consulta essa coleção. Em um SGBD relacional, a linguagem SQL serve tanto para definir estruturas quanto para consultar e alterar dados. A aplicação não abre os arquivos diretamente: ela envia comandos ao servidor do banco.\n\nOs serviços vão além de gravar bytes. O SGBD oferece integridade por meio de restrições como `NOT NULL`, acesso concorrente com transações, recuperação após falha usando log, controle de acesso por usuário e um otimizador que escolhe o caminho de leitura de cada consulta. Assim, `CREATE TABLE aluno (id INTEGER PRIMARY KEY, nome TEXT NOT NULL);` cria uma promessa sobre o formato dos dados, não apenas um arquivo.\n\nO modelo clássico é cliente-servidor: a aplicação envia SQL, o servidor valida, planeja, executa e devolve o resultado. O custo é operacional — é preciso instalar, configurar, monitorar, fazer backup e atualizar o software. Separar SGBD (software), esquema (descrição dos dados) e instância (dados em determinado instante) evita confusão quando alguém fala simplesmente em 'banco'.",
          [
            ["SGBD", "Software que cria, organiza, consulta e protege um banco de dados."],
            ["SQL", "Linguagem para definir, consultar e modificar dados em bancos relacionais."],
            ["DDL", "Parte da SQL que define estruturas, como CREATE, ALTER e DROP."],
            ["DML", "Parte da SQL que manipula dados, como INSERT, UPDATE e DELETE."],
            ["integridade de dados", "Conjunto de regras que impedem valores inválidos ou inconsistentes no banco."]
          ],
          {
            ex: [
              ["CREATE TABLE aluno (id INTEGER PRIMARY KEY, nome TEXT NOT NULL);", "Cria a tabela com chave primária e nome obrigatório; o SGBD passa a rejeitar linhas inválidas."],
              ["INSERT INTO aluno (id, nome) VALUES (1, 'Ana');", "Grava uma linha válida; um INSERT com nome nulo seria recusado pela restrição NOT NULL."]
            ],
            er: [
              "Tratar o SGBD como sinônimo de arquivo de dados: o software é que gerencia os arquivos.",
              "Achar que SQL é apenas SELECT; DDL e DML também fazem parte da linguagem.",
              "Ignorar backup e monitoramento por supor que o SGBD nunca falha."
            ],
            lab: "Simulação: escreva um CREATE TABLE para 'aluno' e um INSERT inválido; anote qual restrição o SGBD deveria acusar.",
            ref: "PostgreSQL Documentation — '1.1. About PostgreSQL' (postgresql.org/docs/current/intro.html); Date, An Introduction to Database Systems, capítulo introdutório."
          }),
        L("Modelo relacional",
          "Entender tabelas como relações e ler a notação básica do modelo proposto por Codd.",
          "O que é um SGBD.",
          "Uma tabela é mais do que uma grade: é um conjunto de fatos com o mesmo formato, descrito por nomes e tipos de colunas.",
          "No modelo relacional, proposto por E. F. Codd, uma relação é um conjunto de tuplas com a mesma estrutura. Cada tupla é uma linha, cada coluna é um atributo e os valores de uma coluna pertencem a um domínio. Escrevemos, por exemplo, $Aluno(id, nome, turma)$ para descrever o esquema. A ordem das linhas e das colunas não faz parte do significado da relação.\n\nHá uma diferença entre teoria e produto. No modelo matemático, uma relação é um conjunto, sem duplicatas. SQL trabalha com multiconjuntos: `SELECT turma FROM aluno;` pode repetir valores, e `SELECT DISTINCT turma FROM aluno;` remove as repetições. Da mesma forma, sem `ORDER BY` a ordem das linhas devolvidas não é garantida, por mais estável que pareça na prática.\n\nO esquema relacional concentra a descrição das tabelas, seus tipos e suas restrições. Isso permite separar o que é verdadeiro sobre os dados da forma como eles são armazenados em disco: índices, paginação e compressão são decisões físicas; tabelas, colunas e chaves são decisões lógicas. Essa separação é a base da independência de dados.",
          [
            ["relação (tabela)", "Conjunto de tuplas com a mesma estrutura de atributos."],
            ["tupla", "Uma linha da tabela, com um valor para cada atributo."],
            ["atributo", "Coluna da relação, identificada por um nome e um domínio."],
            ["domínio", "Conjunto de valores permitidos para um atributo."],
            ["esquema relacional", "Descrição dos nomes de atributos e domínios de uma tabela."]
          ],
          {
            ex: [
              ["CREATE TABLE turma (codigo TEXT PRIMARY KEY, ano INTEGER CHECK (ano > 2000));", "Declara o esquema: duas colunas, domínios TEXT e INTEGER e uma restrição sobre o ano."],
              ["SELECT DISTINCT turma FROM aluno ORDER BY turma;", "Remove duplicatas e ordena o resultado; sem ORDER BY a ordem seria indefinida."]
            ],
            er: [
              "Supor que a ordem das linhas retornadas por SELECT é estável sem ORDER BY.",
              "Confundir domínio com tipo de armazenamento: domínio é o conjunto de valores válidos do atributo.",
              "Achar que SQL elimina duplicatas automaticamente por seguir o modelo relacional."
            ],
            lab: "Simulação: anote o esquema $Aluno(id, nome, turma)$ em uma tabela de papel e escreva uma tupla válida e uma inválida para o domínio do ano.",
            ref: "Elmasri & Navathe, Fundamentals of Database Systems, capítulo sobre o modelo relacional; PostgreSQL Documentation — 'Chapter 5. Data Definition' (postgresql.org/docs/current/ddl.html)."
          }),
        L("Entidades e relacionamentos",
          "Modelar um domínio com entidades, atributos, relacionamentos e cardinalidades, e traduzir o modelo para tabelas.",
          "Modelo relacional e noção de conjunto.",
          "Antes de escrever CREATE TABLE, desenhe quem participa dos fatos e como esses participantes se ligam.",
          "O modelo entidade-relacionamento (ER) descreve o mundo em termos de entidades, atributos e relacionamentos. Uma entidade é um objeto identificável, como aluno ou disciplina; um atributo é uma característica, como nome ou carga horária. Um relacionamento é uma associação, como 'aluno cursa disciplina'. A cardinalidade limita quantas associações cada lado pode ter: $1:N$, $1:1$ ou $N:M$.\n\nA tradução para o modelo relacional é mecânica. Cada entidade vira uma tabela, com a chave primária identificando cada ocorrência. Um relacionamento $1:N$ vira uma chave estrangeira na tabela do lado N. Um relacionamento $1:1$ vira uma chave estrangeira com `UNIQUE`. Um relacionamento $N:M$ vira uma terceira tabela, chamada tabela de junção, cuja chave primária é composta pelas duas chaves estrangeiras.\n\nA qualidade do modelo ER se mede pela clareza das regras de negócio que ele representa. Perguntas como 'um aluno pode cursar a mesma disciplina duas vezes?' ou 'o que acontece se a disciplina for removida?' devem ter resposta antes da implementação. Diagramas são ferramentas de comunicação; o valor está nas decisões que eles forçam a explicitar.",
          [
            ["entidade", "Objeto identificável do domínio sobre o qual se guardam dados."],
            ["atributo de entidade", "Característica descritiva de uma entidade, como nome ou data de nascimento."],
            ["relacionamento", "Associação entre entidades, representada por chaves ou por tabela de junção."],
            ["cardinalidade", "Número máximo de associações permitidas em cada lado de um relacionamento."],
            ["tabela de junção", "Tabela que resolve um relacionamento N:M com duas chaves estrangeiras."]
          ],
          {
            ex: [
              ["CREATE TABLE matricula (aluno_id INTEGER REFERENCES aluno(id), disciplina_id INTEGER REFERENCES disciplina(id), PRIMARY KEY (aluno_id, disciplina_id));", "Transforma o relacionamento N:M entre aluno e disciplina em uma tabela de junção."],
              ["Aluno cursa Disciplina com cardinalidade N:M", "Cada aluno cursa várias disciplinas e cada disciplina tem vários alunos; surge a tabela matricula."]
            ],
            er: [
              "Representar N:M apenas com uma coluna na tabela de alunos, perdendo várias disciplinas por aluno.",
              "Esquecer de definir a chave da tabela de junção e permitir matrículas repetidas.",
              "Confundir atributo com entidade e transformar cada característica em uma tabela separada."
            ],
            lab: "Simulação: desenhe em papel as entidades 'aluno' e 'disciplina', marque a cardinalidade N:M e escreva a tabela de junção correspondente.",
            ref: "Elmasri & Navathe, Fundamentals of Database Systems, capítulos sobre modelagem ER e seu mapeamento para tabelas; PostgreSQL Documentation — 'Chapter 5. Data Definition' (postgresql.org/docs/current/ddl.html)."
          }),
        L("Chaves primárias e estrangeiras",
          "Definir identificadores e referências entre tabelas com PRIMARY KEY, UNIQUE e FOREIGN KEY.",
          "Entidades e relacionamentos.",
          "Chave é o que permite dizer 'esta linha é aquela' e 'esta linha pertence àquela outra'.",
          "A chave primária identifica cada linha da tabela: é única e não pode ser nula. Naturalmente, uma coluna como CPF poderia servir, mas chaves artificiais (um inteiro incremental ou UUID) são comuns porque não mudam quando o dado real é corrigido. Uma chave candidata é qualquer conjunto de colunas que poderia ser primário; as demais podem receber `UNIQUE`.\n\nA chave estrangeira é uma coluna cujo valor referencia a chave primária de outra tabela. Ela transforma uma relação em uma ligação verificável: `cliente_id INTEGER REFERENCES cliente(id)` impede que um pedido aponte para um cliente inexistente. Em relacionamentos N:M, a chave primária da tabela de junção é composta pelas duas chaves estrangeiras, o que garante que o par não se repita.\n\nEscolher chaves é uma decisão de longo prazo. Trocar a chave primária de uma tabela muito referenciada exige migrar todas as tabelas dependentes. Por isso vale preferir identificadores estáveis, curtos e sem significado de negócio. Em bancos SQL, `UNIQUE` permite valores nulos; `PRIMARY KEY` não permite. Essa diferença aparece em discussões de modelo e deve ser explícita no esquema.",
          [
            ["chave primária", "Coluna ou conjunto de colunas que identifica cada linha de forma única e não nula."],
            ["chave estrangeira", "Coluna que referencia a chave primária de outra tabela."],
            ["chave candidata", "Conjunto de colunas único que poderia servir como chave primária."],
            ["restrição UNIQUE", "Garante que valores não se repetem, admitindo NULL em bancos SQL."],
            ["PRIMARY KEY composta", "Chave primária formada por mais de uma coluna."]
          ],
          {
            ex: [
              ["CREATE TABLE pedido (id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL REFERENCES cliente(id), total NUMERIC(10,2) NOT NULL);", "Cria pedidos com chave própria e ligação obrigatória a um cliente existente."],
              ["PRIMARY KEY (aluno_id, disciplina_id) na tabela matricula", "Impede que o mesmo par aluno-disciplina apareça mais de uma vez."]
            ],
            er: [
              "Usar um campo de negócio mutável, como e-mail, como chave primária de clientes.",
              "Esquecer o NOT NULL na chave estrangeira e aceitar pedidos sem cliente quando isso é obrigatório.",
              "Achar que UNIQUE e PRIMARY KEY são idênticos: a segunda proíbe nulos."
            ],
            lab: "Simulação: escreva o CREATE TABLE de 'pedido' e depois tente, no papel, um INSERT com cliente_id inexistente; descreva a reação esperada do SGBD.",
            ref: "SQLite Documentation — 'Foreign Key Support' (sqlite.org/foreignkeys.html); PostgreSQL Documentation — 'Chapter 5. Data Definition' (postgresql.org/docs/current/ddl.html)."
          }),
        L("Normalização 1FN/2FN/3FN",
          "Aplicar as três primeiras formas normais para reduzir repetição e anomalias.",
          "Chaves e dependências entre colunas.",
          "Normalizar é dividir a informação até que cada fato seja guardado uma vez só.",
          "A primeira forma normal (1FN) exige atributos atômicos: uma coluna 'telefones' com vários números separados por vírgula viola a 1FN. A solução é uma tabela de telefones com uma linha por número. A dependência funcional $X \\to Y$ significa que, conhecendo $X$, há um único valor de $Y$; é ela que sustenta as formas seguintes.\n\nA segunda forma normal (2FN) aplica-se a tabelas com chave composta e proíbe dependência parcial: se 'nome_produto' depende apenas de 'produto_id', mas a chave é `(pedido_id, produto_id)`, esse nome deve ficar na tabela de produtos. A terceira forma normal (3FN) proíbe dependência transitiva entre atributos não chave: se 'cidade' depende de 'cep' e 'cep' depende de 'cliente_id', cidade não deve ficar repetida em cliente.\n\nO objetivo é evitar anomalias de inserção, atualização e exclusão. Se o nome do cliente aparece em todos os pedidos, corrigir um erro exige atualizar muitas linhas, e excluir o último pedido pode apagar o único registro do cliente. Normalizar não é dogma: projetos analíticos podem repetir dados deliberadamente. O importante é saber qual anomalia se aceita e por quê.",
          [
            ["1FN", "Forma normal que exige atributos atômicos, com valores repetidos em linhas separadas."],
            ["dependência funcional", "Relação em que o valor de X determina um único valor de Y, escrita $X \\to Y$."],
            ["2FN", "1FN sem dependências parciais em relação a uma chave composta."],
            ["3FN", "2FN sem dependências transitivas entre atributos que não são chave."],
            ["anomalia de atualização", "Inconsistência causada pela repetição do mesmo fato em várias linhas."]
          ],
          {
            ex: [
              ["CREATE TABLE telefone_cliente (cliente_id INTEGER REFERENCES cliente(id), numero TEXT, PRIMARY KEY (cliente_id, numero));", "Tira a lista de telefones da tabela cliente e atende à 1FN com uma linha por número."],
              ["Pedido(pedido_id, produto_id, nome_produto) com chave (pedido_id, produto_id)", "Viola a 2FN: nome_produto depende apenas de produto_id e deve ir para a tabela produto."]
            ],
            er: [
              "Guardar listas separadas por vírgula em uma coluna e depois tentar filtrar por um elemento.",
              "Aplicar a 3FN sem identificar as dependências funcionais primeiro.",
              "Normalizar tudo sem considerar o custo de JOINs em consultas frequentes."
            ],
            lab: "Simulação: transforme em papel a tabela Cliente(id, nome, telefones) em duas tabelas que atendam à 1FN e escreva o CREATE TABLE de cada uma.",
            ref: "Date, An Introduction to Database Systems, capítulos sobre normalização; Elmasri & Navathe, Fundamentals of Database Systems, capítulo sobre formas normais."
          }),
        L("Integridade referencial",
          "Controlar o que acontece quando a linha referenciada por uma chave estrangeira é alterada ou excluída.",
          "Chaves primárias e estrangeiras.",
          "Apagar um cliente não pode deixar pedidos órfãos: o banco precisa de uma regra explícita para esse caso.",
          "Integridade referencial é a garantia de que toda chave estrangeira aponta para uma linha existente ou é nula quando permitido. A restrição é verificada em INSERT, UPDATE e DELETE. Sem ela, uma aplicação com bug poderia gravar `cliente_id = 99` sem que exista o cliente 99, e consultas passariam a devolver resultados incompreensíveis.\n\nQuando a linha de origem é excluída ou sua chave é alterada, o SGBD segue uma ação declarada na chave estrangeira. `RESTRICT` impede a operação enquanto existirem dependentes. `CASCADE` apaga ou atualiza os dependentes automaticamente. `SET NULL` troca a referência por nulo. `SET DEFAULT` usa um valor padrão. A escolha é uma regra de negócio: excluir um produto com pedidos antigos raramente deve apagar o histórico de vendas.\n\nTambém é possível adiar a verificação até o `COMMIT`, útil quando duas linhas se referenciam circularmente. Em bancos que permitem desativar chaves estrangeiras, essa permissão deve ser usada apenas em cargas controladas, com validação ao final. Uma consulta de checagem com `LEFT JOIN ... IS NULL` ajuda a encontrar órfãos em bases legadas.",
          [
            ["integridade referencial", "Regra que exige que toda chave estrangeira aponte para uma linha existente."],
            ["ON DELETE RESTRICT", "Ação que impede excluir a linha referenciada enquanto houver dependentes."],
            ["ON DELETE CASCADE", "Ação que exclui automaticamente as linhas dependentes."],
            ["ON DELETE SET NULL", "Ação que troca a chave dependente por NULL quando a origem é excluída."],
            ["linha órfã", "Linha cuja chave estrangeira não encontra registro correspondente."]
          ],
          {
            ex: [
              ["cliente_id INTEGER NOT NULL REFERENCES cliente(id) ON DELETE RESTRICT", "Impede apagar um cliente que ainda possui pedidos; a aplicação recebe um erro."],
              ["SELECT p.id FROM pedido p LEFT JOIN cliente c ON c.id = p.cliente_id WHERE c.id IS NULL;", "Lista pedidos órfãos, útil para auditar uma base sem restrições ativas."]
            ],
            er: [
              "Usar CASCADE por conveniência em tabelas de histórico, apagando registros que deveriam ser preservados.",
              "Criar a tabela sem a restrição e confiar apenas na validação da aplicação.",
              "Esperar que SET NULL funcione em uma coluna declarada NOT NULL."
            ],
            lab: "Simulação: escreva em papel duas ações possíveis para excluir um cliente com pedidos e justifique qual você escolheria em um sistema de vendas.",
            ref: "SQLite Documentation — 'Foreign Key Support' (sqlite.org/foreignkeys.html); PostgreSQL Documentation — '5.3. Constraints' (postgresql.org/docs/current/ddl-constraints.html)."
          }),
        L("SELECT e filtros",
          "Escrever consultas com projeção, filtro, ordenação e limite de linhas.",
          "Modelo relacional e operadores básicos.",
          "SELECT responde a perguntas: quais colunas eu quero, quais linhas interessam e em que ordem.",
          "A forma essencial é `SELECT colunas FROM tabela WHERE condicao ORDER BY coluna LIMIT n;`. `SELECT` escolhe as colunas, `FROM` define a origem e `WHERE` filtra linhas antes de qualquer agrupamento. Expressões usam operadores como `=`, `<>`, `>`, `BETWEEN`, `IN` e `LIKE`, combinados por `AND`, `OR` e `NOT`.\n\nO valor `NULL` significa 'desconhecido', não zero nem string vazia. Por isso `coluna = NULL` nunca é verdadeiro: use `IS NULL` ou `IS NOT NULL`. A lógica SQL é de três valores (verdadeiro, falso, desconhecido), e `NOT` de um desconhecido continua desconhecido. `DISTINCT` elimina linhas repetidas no resultado. `ORDER BY` ordena, opcionalmente com `ASC` ou `DESC`, e `LIMIT` restringe a quantidade devolvida.\n\nAliases com `AS` tornam a consulta legível e são necessários quando a mesma coluna aparece com nomes diferentes em agregações. Cuidado com `WHERE` sobre colunas calculadas: a expressão precisa ser repetida ou calculada em uma subconsulta. Entender a ordem lógica de avaliação — `FROM`, `WHERE`, `SELECT`, `ORDER BY`, `LIMIT` — explica por que um alias definido no `SELECT` não pode ser usado no `WHERE`.",
          [
            ["SELECT ... FROM", "Cláusulas que definem quais colunas e quais tabelas participam da consulta."],
            ["cláusula WHERE", "Filtro aplicado às linhas antes de agregação e ordenação."],
            ["NULL", "Valor que representa ausência ou desconhecimento, comparado com IS NULL."],
            ["DISTINCT", "Palavra que remove duplicatas das linhas retornadas."],
            ["cláusula ORDER BY", "Definição da ordem do resultado, ascendente ou descendente."]
          ],
          {
            ex: [
              ["SELECT titulo, ano FROM livro WHERE ano >= 2010 AND ano <= 2020 ORDER BY ano DESC LIMIT 10;", "Retorna os dez livros mais recentes da década, já ordenados."],
              ["SELECT nome FROM aluno WHERE email IS NULL;", "Seleciona alunos sem e-mail cadastrado; usar email = NULL não funcionaria."]
            ],
            er: [
              "Escrever coluna = NULL em vez de coluna IS NULL.",
              "Contar com a ordem natural da tabela e esquecer ORDER BY.",
              "Usar um alias do SELECT dentro da cláusula WHERE."
            ],
            lab: "Simulação: escreva uma consulta que liste livros publicados entre 2010 e 2020, ordenada por ano, e explique o papel de cada cláusula.",
            ref: "PostgreSQL Documentation — '3.6. Selecting Data' (postgresql.org/docs/current/tutorial-select.html)."
          }),
        L("JOIN",
          "Combinar linhas de várias tabelas com INNER JOIN e LEFT JOIN, interpretando nulos no resultado.",
          "SELECT e filtros; chaves estrangeiras.",
          "JOIN é a operação que reconstrói uma frase a partir de partes guardadas em tabelas diferentes.",
          "O `INNER JOIN` devolve apenas as combinações em que a condição do `ON` é verdadeira nas duas tabelas. O `LEFT JOIN` preserva todas as linhas da tabela da esquerda mesmo quando não há correspondência, preenchendo as colunas da direita com `NULL`. Existem ainda `RIGHT JOIN`, que preserva a direita, e `FULL JOIN`, que preserva ambos os lados. Na prática, o LEFT JOIN é o mais usado para auditoria de dados faltantes.\n\nA condição de junção costuma ligar uma chave estrangeira à chave primária correspondente, mas nada impede outros critérios. Um `CROSS JOIN` produz o produto cartesiano, util para gerar combinações e perigoso se esquecido. Um `self join` usa aliases para comparar linhas da mesma tabela, como alunos que moram na mesma cidade.\n\nErros de JOIN raramente geram mensagem de erro: eles geram números plausíveis e errados. Um INNER JOIN onde deveria ser LEFT pode fazer clientes sem pedidos desaparecerem de um relatório. Uma chave de junção de baixa seletividade pode multiplicar linhas. Conferir contagens antes e depois da junção é um hábito simples e eficaz.",
          [
            ["JOIN", "Operação que combina linhas de duas tabelas segundo uma condição de correspondência."],
            ["INNER JOIN", "JOIN que devolve apenas pares com correspondência nas duas tabelas."],
            ["LEFT JOIN", "JOIN que preserva as linhas da esquerda e preenche NULL à direita."],
            ["cláusula ON", "Condição que define quais linhas se correspondem em um JOIN."],
            ["auto junção", "JOIN de uma tabela com ela mesma, usando aliases para distinguir papéis."]
          ],
          {
            ex: [
              ["SELECT c.nome, p.id FROM cliente c INNER JOIN pedido p ON p.cliente_id = c.id;", "Mostra apenas clientes que possuem pelo menos um pedido."],
              ["SELECT c.nome, p.id FROM cliente c LEFT JOIN pedido p ON p.cliente_id = c.id WHERE p.id IS NULL;", "Encontra clientes sem nenhum pedido usando NULL como sinal de ausência."]
            ],
            er: [
              "Usar INNER JOIN quando a pergunta exige preservar linhas sem correspondência.",
              "Esquecer a condição ON e produzir um produto cartesiano acidental.",
              "Filtrar a tabela da direita no WHERE de um LEFT JOIN, transformando-o em INNER JOIN."
            ],
            lab: "Simulação: escreva em papel as linhas resultantes de um LEFT JOIN entre cliente e pedido, incluindo um cliente sem pedidos.",
            ref: "PostgreSQL Documentation — '3.7. Joining Tables' (postgresql.org/docs/current/tutorial-join.html)."
          }),
        L("Agregação e GROUP BY",
          "Resumir grupos de linhas com funções de agregação e filtrar grupos com HAVING.",
          "SELECT e JOIN.",
          "Agregar é trocar muitas linhas por poucos números que as descrevem.",
          "As funções `COUNT`, `SUM`, `AVG`, `MIN` e `MAX` resumem várias linhas em um valor. Sem `GROUP BY`, a agregação produz uma única linha para toda a consulta. Com `GROUP BY`, o SGBD separa as linhas em grupos e aplica a função a cada grupo. Toda coluna do `SELECT` que não está dentro de uma função de agregação deve aparecer no `GROUP BY`.\n\n`WHERE` filtra linhas antes da agregação; `HAVING` filtra grupos depois dela. Essa diferença explica por que `WHERE total > 100` não pode substituir `HAVING SUM(valor) > 100`. `COUNT(*)` conta linhas, incluindo as que têm nulos; `COUNT(coluna)` ignora nulos. `AVG`, `SUM`, `MIN` e `MAX` também ignoram nulos, o que pode distorcer médias se a ausência de valor tiver significado.\n\nAgregações são a base de relatórios e painéis. Para que sejam rápidas, é comum preparar índices sobre as colunas de filtro e de agrupamento ou manter tabelas de resumo atualizadas por processo. Antes de otimizar, porém, confirme que o grupo está correto: um JOIN que multiplica linhas altera `SUM` e `AVG` mesmo que a contagem de clientes pareça razoável.",
          [
            ["função de agregação", "Função que resume várias linhas em um valor, como COUNT ou SUM."],
            ["GROUP BY", "Cláusula que separa linhas em grupos antes de aplicar agregações."],
            ["HAVING", "Cláusula que filtra grupos depois da agregação."],
            ["COUNT(*)", "Conta as linhas do grupo, incluindo aquelas com valores nulos."],
            ["AVG", "Média dos valores não nulos de um grupo."]
          ],
          {
            ex: [
              ["SELECT cliente_id, COUNT(*) AS pedidos, SUM(valor) AS total FROM pedido WHERE status = 'pago' GROUP BY cliente_id HAVING COUNT(*) > 2 ORDER BY total DESC;", "Conta e soma apenas pedidos pagos, mantendo clientes com mais de dois pedidos."],
              ["SELECT COUNT(*) AS linhas, COUNT(email) AS com_email FROM aluno;", "Mostra a diferença entre contar linhas e contar valores não nulos."]
            ],
            er: [
              "Colocar uma condição sobre SUM no WHERE em vez de HAVING.",
              "Incluir uma coluna no SELECT sem colocá-la no GROUP BY nem agregá-la.",
              "Achar que AVG inclui valores nulos no cálculo."
            ],
            lab: "Simulação: escreva uma consulta que conte pedidos por cliente e mantenha apenas clientes com mais de dois pedidos.",
            ref: "PostgreSQL Documentation — '3.8. Aggregate Functions' (postgresql.org/docs/current/tutorial-agg.html)."
          }),
        L("Índices e planos de consulta (conceitual)",
          "Entender como índices afetam o plano de consulta e como ler EXPLAIN sem executar suposições.",
          "SELECT, WHERE e JOIN.",
          "Um índice é como o índice remissivo de um livro: consultar direto o capítulo certo é mais barato do que ler o livro inteiro.",
          "Um índice é uma estrutura auxiliar que associa valores de colunas à localização das linhas. O tipo mais comum é a B-tree, balanceada, eficiente para igualdade e intervalos; ela mantém o custo de busca próximo de $O(\\log n)$. Outros tipos atendem a buscas por texto, geografia ou arrays.Índices aceleram leituras, mas ocupam espaço e tornam INSERT, UPDATE e DELETE mais caros, pois cada escrita precisa atualizar também o índice.\n\nO otimizador decide entre varredura sequencial e varredura por índice usando estatísticas como número de linhas e distribuição de valores. Um filtro com alta seletividade — que retorna poucas linhas — favorece o índice. Se a consulta vai ler metade da tabela, a varredura sequencial costuma ganhar porque evita acessos aleatórios. `EXPLAIN` mostra o plano escolhido; `EXPLAIN ANALYZE` executa a consulta e compara estimativa com tempo real.\n\nAo ler um plano, comece pelos nós folha e siga para a raiz, observando estimativas de linhas, custo e operações como `Seq Scan`, `Index Scan`, `Hash Join` e `Nested Loop`. Uma estimativa muito distante da realidade geralmente indica estatísticas desatualizadas. Antes de criar índices, meça: índices duplicados ou nunca usados só adicionam custo de escrita.",
          [
            ["índice", "Estrutura auxiliar que mapeia valores de colunas para as localizações das linhas."],
            ["B-tree", "Índice em árvore balanceada, eficiente para igualdade e consultas por intervalo."],
            ["EXPLAIN", "Comando que mostra o plano escolhido pelo otimizador para uma consulta."],
            ["varredura sequencial", "Leitura completa da tabela, vantajosa quando muitas linhas serão usadas."],
            ["seletividade", "Fração de linhas que um filtro retorna; quanto menor, mais útil tende a ser o índice."]
          ],
          {
            ex: [
              ["CREATE INDEX idx_pedido_cliente ON pedido (cliente_id);", "Cria um índice B-tree para acelerar buscas e junções por cliente_id."],
              ["EXPLAIN ANALYZE SELECT * FROM pedido WHERE cliente_id = 42;", "Mostra se o otimizador usou o índice, o tempo estimado e o tempo real de execução."]
            ],
            er: [
              "Criar índices em todas as colunas sem medir consultas e custo de escrita.",
              "Confiar em EXPLAIN sem ANALYZE quando as estimativas parecem suspeitas.",
              "Achar que a presença de um índice garante que ele será usado."
            ],
            lab: "Simulação: desenhe em papel um índice remissivo para a coluna 'ano' de uma lista de livros e descreva quando a varredura completa ainda seria melhor.",
            ref: "PostgreSQL Documentation — 'Using EXPLAIN' (postgresql.org/docs/current/tutorial-explain.html); SQLite Documentation — 'Query Planning' (sqlite.org/queryplanner.html)."
          })
      ]
    },
    {
      name: "Transações e projeto",
      lessons: [
        L("Transações e ACID",
          "Entender BEGIN, COMMIT e ROLLBACK e as quatro propriedades que tornam transações confiáveis.",
          "Modelo relacional e noção de integridade.",
          "Uma transferência entre contas deve acontecer inteira ou não acontecer: metade dela nunca é aceitável.",
          "Uma transação é uma sequência de operações tratadas como uma única unidade. O comando `BEGIN` inicia, `COMMIT` confirma todas as alterações e `ROLLBACK` desfaz o que foi feito desde o início. Em muitos SGBDs, uma única instrução UPDATE já roda dentro de uma transação implícita, mas agrupar várias instruções explicitamente é o que permite raciocinar sobre casos intermediários.\n\nO acrônimo ACID reúne Atomicidade, Consistência, Isolamento e Durabilidade. Atomicidade significa 'tudo ou nada'. Consistência significa que as restrições declaradas continuam válidas no fim. Isolamento impede que outra sessão observe um estado parcial. Durabilidade garante que uma transação confirmada sobreviva a uma queda de energia, normalmente com apoio de log de escrita antecipada.\n\nACID não é automático em qualquer configuração: depende do motor de armazenamento, do nível de isolamento e de uma rotina de backup funcional. Transações longas também têm custo: mantêm bloqueios, impedem limpeza de versões antigas e aumentam a chance de conflito. A prática recomendada é manter a transação curta, fazer o trabalho de validação antes de abri-la e decidir explicitamente o que acontece em caso de erro.",
          [
            ["transação", "Sequência de operações tratada como uma unidade indivisível."],
            ["atomicidade", "Propriedade que faz a transação terminar inteira ou não ter efeito algum."],
            ["consistência", "Propriedade que mantém o banco de um estado válido para outro."],
            ["isolamento", "Propriedade que esconde efeitos parciais de transações concorrentes."],
            ["durabilidade", "Propriedade que preserva transações confirmadas após uma falha."]
          ],
          {
            ex: [
              ["BEGIN; UPDATE conta SET saldo = saldo - 100 WHERE id = 1; UPDATE conta SET saldo = saldo + 100 WHERE id = 2; COMMIT;", "Transferência atômica: se a segunda UPDATE falhar, um ROLLBACK desfaz a primeira."],
              ["BEGIN; UPDATE conta SET saldo = saldo - 100 WHERE id = 1; ROLLBACK;", "O débito é descartado; ao final o saldo permanece como antes do BEGIN."]
            ],
            er: [
              "Executar duas UPDATEs relacionadas sem transação explícita.",
              "Deixar uma transação aberta enquanto espera entrada do usuário.",
              "Achar que COMMIT dispensa backup por causa da durabilidade."
            ],
            lab: "Simulação: escreva em papel a sequência BEGIN, duas UPDATEs e COMMIT de uma transferência, depois reescreva com ROLLBACK para o caso de erro.",
            ref: "PostgreSQL Documentation — '13.1. Introduction' (postgresql.org/docs/current/transaction.html) e 'BEGIN' (postgresql.org/docs/current/sql-begin.html)."
          }),
        L("Isolamento e anomalias",
          "Comparar níveis de isolamento e reconhecer leitura suja, leitura não repetível, fantasmas e perda de atualização.",
          "Transações e ACID.",
          "Isolar transações é decidir o quanto cada uma enxerga do trabalho das outras enquanto elas estão em andamento.",
          "Quando várias transações rodam ao mesmo tempo, surgem anomalias. Leitura suja ocorre quando uma sessão lê dados escritos por outra ainda não confirmada. Leitura não repetível acontece quando a mesma linha muda entre duas leituras da mesma transação. Leitura fantasma aparece quando uma consulta repetida traz linhas novas inseridas por outra transação. Atualização perdida ocorre quando duas sessões leem o mesmo valor e escrevem baseadas nele, sobrescrevendo uma das mudanças.\n\nA SQL define níveis: `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ` e `SERIALIZABLE`. Níveis mais fortes eliminam mais anomalias, mas aumentam abortos e espera. O padrão do PostgreSQL é `READ COMMITTED`, que já proíbe leitura suja; `SERIALIZABLE` faz transações se comportarem como se fossem executadas em sequência e pode exigir repetição quando há conflito.\n\nEscolher o nível é negociar correção e concorrência. Um relatório financeiro pode exigir `REPEATABLE READ`; um contador de visitas tolera atualizações perdidas se o número for aproximado. Para proteger uma leitura seguida de escrita, uma alternativa ao nível mais forte é `SELECT ... FOR UPDATE`, que bloqueia as linhas lidas. Erros de serialização devem ser tratados com repetição controlada da transação, não engolidos.",
          [
            ["leitura suja", "Leitura de dados escritos por uma transação ainda não confirmada."],
            ["leitura não repetível", "Mesma consulta retorna valores diferentes após outra transação confirmar uma alteração."],
            ["leitura fantasma", "Consulta repetida retorna linhas novas inseridas por outra transação."],
            ["atualização perdida", "Duas transações sobrescrevem a mesma linha e um dos efeitos se perde."],
            ["SERIALIZABLE", "Nível de isolamento que se comporta como execução sequencial das transações."]
          ],
          {
            ex: [
              ["SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; BEGIN; SELECT SUM(saldo) FROM conta; COMMIT;", "Força o nível mais forte para um relatório que não pode observar mudanças parciais."],
              ["T1: BEGIN; UPDATE conta SET saldo = 900 WHERE id = 1;  T2: SELECT saldo FROM conta WHERE id = 1;", "Em READ COMMITTED, T2 vê 1000 até T1 confirmar; em READ UNCOMMITTED poderia ver 900."]
            ],
            er: [
              "Elevar tudo para SERIALIZABLE sem tratar erros de serialização e repetir a transação.",
              "Supor que READ COMMITTED garante que uma linha não mude entre duas consultas.",
              "Implementar 'ler saldo, calcular, escrever saldo' sem bloqueio nem Update atômico."
            ],
            lab: "Simulação: com duas folhas de papel representando T1 e T2, simule uma leitura não repetível e anote o que cada sessão vê em cada instante.",
            ref: "PostgreSQL Documentation — '13.2. Transaction Isolation' (postgresql.org/docs/current/transaction-iso.html)."
          }),
        L("Bloqueios e MVCC conceitual",
          "Entender bloqueios, deadlocks e a ideia de versões múltiplas de linhas usada por bancos modernos.",
          "Transações e isolamento.",
          "Em vez de fazer todos esperarem na fila, o banco pode guardar a versão antiga da linha para quem chegou antes.",
          "Um bloqueio exclusivo impede que outras transações leiam ou gravem o recurso protegido; um bloqueio compartilhado permite leituras simultâneas, mas bloqueia escritas. `SELECT ... FOR UPDATE` transforma as linhas lidas em recursos bloqueados até o fim da transação. Quando duas transações mantêm bloqueios que a outra precisa, forma-se um deadlock, e o SGBD aborta uma delas para desfazer o ciclo. Manter uma ordem consistente ao atualizar várias tabelas reduz esse risco.\n\nMVCC (controle de concorrência por versões múltiplas) evita muitos bloqueios de leitura. Cada alteração cria uma nova versão da tupla, com metadados que indicam em que transação ela começou e terminou. Um leitor enxerga a versão visível para o seu instante de transação, enquanto um escritor cria outra versão. Assim, leitura e escrita podem acontecer ao mesmo tempo sem que uma veja dado pela metade.\n\nO custo do MVCC é manutenção: versões antigas precisam ser removidas quando nenhuma transação ativa mais as exige. Transações muito longas impedem essa limpeza e fazem o banco crescer. Em PostgreSQL, colunas internas como `xmin` e `xmax` registram os limites de visibilidade; elas não devem ser usadas como regra de negócio, mas ajudam a entender diagnósticos de inchaço de tabela.",
          [
            ["bloqueio exclusivo", "Bloqueio que impede outras transações de lerem ou gravarem o recurso."],
            ["bloqueio compartilhado", "Bloqueio que permite leituras simultâneas, mas bloqueia escritas."],
            ["deadlock", "Situação em que transações esperam umas pelas outras em um ciclo."],
            ["MVCC", "Controle de concorrência que mantém versões das linhas para leitores antigos."],
            ["FOR UPDATE", "Cláusula que bloqueia as linhas selecionadas contra alterações concorrentes."]
          ],
          {
            ex: [
              ["SELECT saldo FROM conta WHERE id = 1 FOR UPDATE;", "Bloqueia a linha até o COMMIT, evitando que outra transação altere o saldo no meio do cálculo."],
              ["T1 bloqueia A e pede B; T2 bloqueia B e pede A", "Deadlock: o SGBD detecta o ciclo e aborta uma das transações, exigindo repetição."]
            ],
            er: [
              "Usar FOR UPDATE sem perceber que o bloqueio dura até o fim da transação.",
              "Atualizar tabelas em ordens diferentes em rotinas distintas, criando deadlocks.",
              "Manter transações de leitura abertas por horas e impedir a limpeza de versões antigas."
            ],
            lab: "Simulação: desenhe duas transações que bloqueiam recursos em ordens opostas e indique qual aborto quebraria o deadlock.",
            ref: "PostgreSQL Documentation — '13.3. Explicit Locking' (postgresql.org/docs/current/explicit-locking.html) e 'MVCC' (postgresql.org/docs/current/mvcc.html)."
          }),
        L("Backup e recuperação",
          "Diferenciar backup lógico e físico e planejar restauração com WAL e recuperação pontual.",
          "Transações e durabilidade.",
          "Um backup só existe de verdade depois que você já restaurou ele pelo menos uma vez.",
          "Backup lógico exporta esquema e dados em comandos SQL, como `pg_dump`, produzindo um arquivo portátil e fácil de inspecionar. Backup físico copia os arquivos do banco, normalmente com `pg_basebackup`, e preserva o estado interno do sistema. O primeiro é cómodo para bancos pequenos e migrações; o segundo costuma ser mais rápido para bancos grandes e permite recuperação pontual.\n\nO WAL (Write-Ahead Log) registra cada mudança antes de ela ser aplicada às páginas de dados. Com um backup de base mais os registros de WAL, é possível restaurar o banco até um instante específico, chamado PITR (Point-In-Time Recovery). O log também é o que garante durabilidade após uma queda: transações confirmadas podem ser reaplicadas na inicialização.\n\nUm plano de recuperação define RPO (perda máxima aceitável) e RTO (tempo máximo fora do ar). Esses números determinam a frequência dos backups, a retenção dos logs e se é preciso ter uma réplica quente. Faça testes periódicos em ambiente separado, verifique o resultado com contagens e restrições e proteja os arquivos de backup com criptografia e controle de acesso — um backup com a mesma permissão do banco não protege contra um ataque que apaga os dois.",
          [
            ["backup lógico", "Cópia que exporta esquema e dados em comandos SQL."],
            ["backup físico", "Cópia dos arquivos do banco, normalmente consistente com o WAL."],
            ["WAL", "Log que registra mudanças antes de aplicá-las aos arquivos de dados."],
            ["PITR", "Recuperação pontual que combina backup de base e logs até um instante escolhido."],
            ["RPO", "Perda máxima de dados aceitável, medida em tempo."]
          ],
          {
            ex: [
              ["pg_dump -Fc -f backup.dump meu_banco", "Gera um backup lógico compactado do banco meu_banco para restauração com pg_restore."],
              ["SELECT COUNT(*) FROM pedido;", "Após restaurar em ambiente de teste, confirma que a quantidade de linhas corresponde ao esperado."]
            ],
            er: [
              "Nunca testar a restauração e descobrir falhas apenas em uma emergência.",
              "Guardar backup e WAL no mesmo disco e sob as mesmas credenciais do servidor principal.",
              "Confundir RPO com RTO: um mede dados perdidos, o outro mede tempo de indisponibilidade."
            ],
            lab: "Simulação: escreva em papel uma linha do tempo com backup diário, WAL a cada minuto e um incidente às 15h10; indique até onde seria possível recuperar.",
            ref: "PostgreSQL Documentation — 'Chapter 26. Backup and Restore' (postgresql.org/docs/current/backup.html), incluindo 'Point-in-Time Recovery'."
          }),
        L("Modelo NoSQL (visão geral e quando usar)",
          "Comparar famílias NoSQL e decidir quando o modelo relacional ou outro modelo atende melhor.",
          "Modelo relacional, JOIN e normalização.",
          "Nem todo dado é uma tabela: às vezes ele é um documento inteiro, um par chave-valor ou uma rede de conexões.",
          "Bancos documentais guardam documentos autocontidos, geralmente JSON; bancos chave-valor recuperam um valor por uma chave; bancos colunares agrupam colunas e são eficientes em leituras analíticas de muitas linhas; bancos de grafos representam entidades como vértices e relações como arestas. Cada família otimiza um padrão de acesso. Um grafo facilita perguntas sobre caminhos e vizinhança; um documento evita JOINs quando a agregação é sempre lida por completo.\n\nA discussão 'SQL ou NoSQL' costuma ser falsa. Muitos bancos relacionais aceitam JSON nativamente, e muitos bancos NoSQL oferecem transações e consultas declarativas. O teorema CAP descreve um limite sob partição de rede — não é um rótulo de qualidade entre produtos. Consistência eventual significa que réplicas convergem com o tempo; isso pode ser adequado para curtidas e inadequado para saldos.\n\nA decisão deve partir das perguntas que o sistema fará, da necessidade de restrições e da forma de escalar. Dados com relacionamentos complexos e exigência de integridade favorecem o relacional. Catálogos com estrutura variável e leitura por identificador favorecem documentos. Agregações sobre bilhões de linhas favorecem colunas. Denormalizar em qualquer modelo é permitido, mas aumenta o custo de manter cópias coerentes.",
          [
            ["banco documental", "Banco que armazena documentos autocontidos, normalmente em JSON."],
            ["banco chave-valor", "Banco que recupera valores por uma chave, com modelo mínimo."],
            ["banco colunar", "Banco que armazena colunas agrupadas, eficiente para leituras analíticas."],
            ["banco de grafos", "Banco que representa entidades como vértices e relações como arestas."],
            ["consistência eventual", "Modelo em que réplicas convergem com o tempo, permitindo leituras desatualizadas."]
          ],
          {
            ex: [
              ["SELECT dados->>'titulo' AS titulo FROM documento WHERE dados->>'autor' = 'Ana';", "Mostra que um SGBD relacional pode consultar campos de documentos JSON armazenados em uma coluna."],
              ["{\"id\": 7, \"titulo\": \"Modelagem\", \"autor\": \"Ana\"}", "Documento autocontido: a leitura por id devolve o objeto inteiro sem JOIN."]
            ],
            er: [
              "Escolher NoSQL apenas por moda, sem listar as consultas que o sistema fará.",
              "Achar que CAP classifica bancos como bons ou ruins em absoluto.",
              "Aceitar consistência eventual em operações financeiras sem discutir o impacto."
            ],
            lab: "Simulação: classifique em papel três necessidades — sessão de usuário, extrato bancário e recomendação de amigos — entre chave-valor, relacional e grafo.",
            ref: "PostgreSQL Documentation — '8.14. JSON Types' (postgresql.org/docs/current/datatype-json.html); Date, An Introduction to Database Systems, capítulos sobre modelos alternativos."
          }),
        L("Projeto de esquema e decisões",
          "Transformar requisitos em tabelas, tipos, restrições e índices, registrando decisões e migrações.",
          "Modelagem ER, normalização e chaves.",
          "Um esquema é um contrato: mudar uma coluna usada por dez consultas é uma mudança de contrato.",
          "O projeto começa no modelo conceitual, com entidades e relacionamentos derivados dos requisitos. O modelo lógico transforma isso em tabelas, colunas, chaves e restrições. O modelo físico define tipos concretos, índices, particionamento e armazenamento. Nomear tabelas no singular ou no plural é menos importante do que ser consistente; nomes claros e previsíveis reduzem erros em consultas futuras.\n\nA escolha de tipos é parte da integridade. Use `INTEGER` para contadores, `NUMERIC` para valores monetários — evitando arredondamento de ponto flutuante — e `TIMESTAMP WITH TIME ZONE` quando instantes precisam ser comparados entre regiões. Restrições `CHECK` e `NOT NULL` expressam regras no banco, onde não podem ser ignoradas por uma aplicação nova.\n\nToda decisão tem troca. Denormalizar um nome de cliente na tabela de pedidos pode evitar um JOIN em um relatório, mas cria uma copia que precisa ser atualizada. Um índice extra acelera uma tela e atrasa escritas. Registre essas decisões em um ADR ou documento curto, com contexto e consequências. Aplique mudanças por migrações versionadas, precedidas de cópia de segurança e acompanhadas de uma forma de voltar atrás.",
          [
            ["modelo conceitual", "Descrição de entidades, atributos e relacionamentos independente de SGBD."],
            ["modelo lógico", "Tradução do modelo conceitual em tabelas, chaves e restrições."],
            ["migração de esquema", "Mudança versionada e reversível na estrutura do banco."],
            ["desnormalização", "Repetição deliberada de dados para otimizar consultas, com custo de manutenção."],
            ["tipo de dado", "Domínio escolhido para uma coluna, como INTEGER, TEXT ou TIMESTAMP."]
          ],
          {
            ex: [
              ["CREATE TABLE pedido (id INTEGER PRIMARY KEY, valor NUMERIC(12,2) NOT NULL CHECK (valor >= 0), criado_em TIMESTAMP NOT NULL);", "Escolhe NUMERIC para dinheiro e CHECK para impedir valores negativos."],
              ["CREATE INDEX idx_pedido_criado ON pedido (criado_em);", "Otimiza consultas por período; o custo aparece em cada INSERT no pedido."]
            ],
            er: [
              "Usar REAL para valores monetários e descobrir diferenças de centavos em somas.",
              "Fazer ALTER direto em produção sem migração versionada nem plano de reversão.",
              "Denormalizar sem definir quem mantém as cópias atualizadas."
            ],
            lab: "Simulação: escreva um ADR de quatro linhas sobre NUMERIC versus REAL para preços, incluindo contexto, decisão e consequência.",
            ref: "Elmasri & Navathe, Fundamentals of Database Systems, capítulos sobre projeto de bancos relacionais; PostgreSQL Documentation — 'Chapter 5. Data Definition' (postgresql.org/docs/current/ddl.html)."
          }),
        L("Segurança e injeção SQL",
          "Evitar injeção SQL com consultas parametrizadas e aplicar menor privilégio com GRANT e REVOKE.",
          "SELECT e noção de transação.",
          "Nunca cole o que o usuário digitou dentro do código SQL: separe o comando dos dados.",
          "Injeção SQL ocorre quando uma entrada do usuário é concatenada ao texto da consulta. Um campo que deveria conter 'Ana' pode receber `' OR 1=1 --` e transformar a condição, devolvendo todas as linhas ou apagando uma tabela. O problema não é caractere especial: é tratar dado como código. A defesa é usar consultas parametrizadas, também chamadas prepared statements, nas quais o driver envia o SQL e os valores separadamente.\n\nAlém da parametrização, aplique o princípio de menor privilégio. A conta usada pela aplicação deve ter `SELECT`, `INSERT` e `UPDATE` apenas nas tabelas necessárias; rotinas administrativas usam outra conta. `GRANT` concede e `REVOKE` retira permissões. Senhas nunca devem ser gravadas em texto puro: armazene um hash com salt, usando uma função própria para senhas, não um hash rápido de propósito geral.\n\nValidação de entrada é útil para regras de negócio, mas não substitui parametrização. Escapar aspas manualmente é frágil e depende do banco. Logs também merecem cuidado: não registre valores sensíveis como senhas ou tokens. Por fim, mantenha o SGBD atualizado e revise permissões quando uma pessoa ou serviço sai do projeto.",
          [
            ["injeção SQL", "Exploração que insere comandos SQL por meio de entrada do usuário."],
            ["prepared statement", "Consulta parametrizada em que valores são enviados separadamente do código SQL."],
            ["menor privilégio", "Princípio de conceder a cada conta apenas as permissões necessárias."],
            ["GRANT", "Comando SQL que concede permissões específicas a um usuário ou papel."],
            ["hash de senha", "Transformação com salt usada para armazenar senhas sem guardar o texto original."]
          ],
          {
            ex: [
              ["SELECT * FROM usuario WHERE email = $1;", "Consulta parametrizada: o valor de email viaja como dado, não como parte do comando."],
              ["GRANT SELECT, INSERT ON pedido TO app_usuario;", "Dá à conta da aplicação apenas as permissões necessárias na tabela pedido."]
            ],
            er: [
              "Concatenar entrada do usuário diretamente em uma string SQL.",
              "Confiar em validação de formulário como única defesa contra injeção.",
              "Usar a conta administrativa do banco para rodar a aplicação."
            ],
            lab: "Simulação: escreva em papel uma consulta insegura com concatenação e a versão parametrizada equivalente, marcando o que muda.",
            ref: "OWASP Cheat Sheet Series — 'SQL Injection Prevention Cheat Sheet' (cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html); PostgreSQL Documentation — 'GRANT' (postgresql.org/docs/current/sql-grant.html)."
          }),
        L("Observabilidade e métricas de banco",
          "Acompanhar saúde do banco com latências, estatísticas de consultas, conexões e alertas úteis.",
          "Índices, planos de consulta e transações.",
          "Um banco pode estar no ar e ainda assim ficar cada vez mais lento: métricas revelam essa degradação antes do usuário.",
          "Comece pelo que o usuário sente: latência mediana e p95 das requisições, taxa de erro e vazão. No banco, observe consultas lentas, número de conexões, bloqueios, uso de CPU, disco e cache. A latência p95 é o tempo abaixo do qual 95 por cento das operações terminam; médias escondem picos que afetam uma minoria relevante de usuários.\n\nO PostgreSQL expõe visões como `pg_stat_activity`, que mostra sessões e consultas em execução, e o módulo `pg_stat_statements`, que agrupa estatísticas por consulta normalizada — por exemplo, separando apenas os valores dos parâmetros. Com esses dados é possível encontrar consultas que consomem mais tempo total, mesmo quando cada execução individual parece rápida. A taxa de acerto de cache do sistema operacional e do banco ajuda a distinguir problemas de consulta de problemas de memória.\n\nMétricas sem ação não servem: defina limites que disparem investigação, registre o plano das consultas problemáticas com `EXPLAIN ANALYZE` e meça o efeito de cada mudança. Picos de conexão frequentemente indicam vazamento em um pool mal configurado; espera por bloqueio pode apontar transações longas. Correlacione a observabilidade da aplicação com a do banco para identificar se a lentidão nasce no código, no plano de consulta ou no armazenamento.",
          [
            ["latência p95", "Tempo abaixo do qual 95 por cento das requisições terminam."],
            ["taxa de acerto de cache", "Proporção de leituras atendidas sem acesso ao disco."],
            ["pg_stat_statements", "Extensão do PostgreSQL que agrupa estatísticas por consulta normalizada."],
            ["consulta lenta", "Consulta acima de um limite definido, candidata a investigação."],
            ["pool de conexões", "Conjunto de conexões reaproveitadas para evitar o custo de abrir uma por requisição."]
          ],
          {
            ex: [
              ["SELECT pid, state, wait_event_type, query FROM pg_stat_activity WHERE state <> 'idle';", "Lista sessões ativas e o evento pelo qual cada uma está esperando."],
              ["SELECT query, calls, total_exec_time FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;", "Mostra as dez consultas que mais consumiram tempo acumulado."]
            ],
            er: [
              "Monitorar apenas a média de latência e ignorar a cauda das requisições.",
              "Coletar métricas sem definir limites e responsáveis por investigar alertas.",
              "Abrir uma conexão nova por requisição em vez de reaproveitar um pool."
            ],
            lab: "Simulação: monte em papel um painel com quatro indicadores — p95, conexões ativas, consultas lentas e taxa de acerto de cache — e escreva o que cada um sugeriria investigar.",
            ref: "PostgreSQL Documentation — '27.2. The Statistics Collector' (postgresql.org/docs/current/monitoring-stats.html) e 'pg_stat_statements' (postgresql.org/docs/current/pgstatstatements.html)."
          })
      ]
    }
  ]
};

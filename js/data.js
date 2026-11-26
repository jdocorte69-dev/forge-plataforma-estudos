/* ============================================================
   FORGE — data.js
   Currículo, flashcards, biblioteca, projetos
   ============================================================ */

/* --- Helpers de construção do currículo ------------------- */

// Gera até 10 questões de múltipla escolha a partir dos fatos-chave da aula.
// Formato: [enunciado, respostaCorreta, distrator1, distrator2]
function buildQuestions(facts, extra) {
  const qs = (extra || []).slice();
  const defs = facts.map(f => f[1]);

  facts.forEach((f, i) => {
    const others = defs.filter((_, j) => j !== i);
    qs.push([`O que significa "${f[0]}"?`, f[1], others[0], others[1]]);
  });

  facts.forEach((f, i) => {
    const others = facts.filter((_, j) => j !== i);
    qs.push([`Qual conceito corresponde a: "${f[1]}"?`, f[0], others[0][0], others[1][0]]);
  });

  return qs.slice(0, 10);
}

// Cria uma aula completa a partir de uma descrição compacta.
// Campos opcionais (Enciclopédia, Fase 1) permitem conteúdo rico sem reescrever
// as 189 aulas existentes: derivation, workedExamples, recallQuestions,
// masteryCriteria, tags e estimatedEffort. `definitions`/`commonMistakes` são
// aliases legíveis de `facts`/`errors` para o novo schema.
function L(title, objective, prereq, intuition, explain, facts, opts) {
  const o = opts || {};
  const definitions = Array.isArray(facts) ? facts : [];
  const commonMistakes = o.er || [];
  return {
    title,
    objective,
    prereq,
    intuition,
    explain,
    definitions,
    commonMistakes,
    derivation: o.derivation || "",
    workedExamples: Array.isArray(o.workedExamples) ? o.workedExamples : [],
    recallQuestions: Array.isArray(o.recallQuestions) ? o.recallQuestions : [],
    masteryCriteria: Array.isArray(o.masteryCriteria) ? o.masteryCriteria : [],
    tags: Array.isArray(o.tags) ? o.tags : [],
    estimatedEffort: Number(o.estimatedEffort) || 0,
    // Campos legados — preservados para não quebrar renderizadores existentes.
    examples: o.ex || [],
    errors: commonMistakes,
    lab: o.lab || "Pratique os conceitos desta aula no laboratório correspondente e registre suas dúvidas.",
    reference: o.ref || "Consulte a biblioteca da plataforma e a documentação oficial do tema.",
    exercises: buildQuestions(definitions, o.qs)
  };
}

const CURRICULUM = {};

// Cada item: [área, recurso, como usar, URL, nível]. Itens legados recebem "Todos".
const LIBRARY_BASE = [
  ["Matemática","Fundamentos de Matemática Elementar — Gelson Iezzi","Base de aritmética, álgebra, funções e trigonometria.","https://www.editorasaraiva.com.br/"],
  ["Matemática","Cálculo — James Stewart","Cálculo diferencial e integral com aplicações.","https://www.cengage.com/"],
  ["Matemática","Cálculo — Guidorizzi","Tratamento universitário de cálculo em português.","https://www.grupogen.com.br/"],
  ["Matemática","Introduction to Linear Algebra — Gilbert Strang","Álgebra linear com foco conceitual e aplicações.","https://math.mit.edu/~gs/linearalgebra/"],
  ["Matemática","Discrete Mathematics and Its Applications — Rosen","Lógica, conjuntos, grafos e combinatória.","https://www.mheducation.com/"],
  ["Matemática","Khan Academy","Prática guiada de aritmética, álgebra e cálculo.","https://pt.khanacademy.org/math"],
  ["Matemática","3Blue1Brown","Intuições visuais de álgebra linear e cálculo.","https://www.3blue1brown.com/"],
  ["Matemática","Universo Narrado","Aulas e aprofundamento em matemática e física.","https://www.youtube.com/@UniversoNarrado"],
  ["C","The C Programming Language — Kernighan & Ritchie","Clássico conciso; complemente com C moderno.","https://www.pearson.com/"],
  ["C","C Programming: A Modern Approach — K. N. King","Curso-texto didático e abrangente de C.","https://knking.com/books/c2/"],
  ["C","CS:APP — Bryant & O'Hallaron","Conecta C, máquina, memória, assembly e sistemas.","https://csapp.cs.cmu.edu/"],
  ["C","Exercism C Track","Exercícios práticos e feedback de código.","https://exercism.org/tracks/c"],
  ["C","Compiler Explorer","Explora como compiladores traduzem código.","https://godbolt.org/"],
  ["Linux","The Linux Command Line — William Shotts","Livro gratuito sobre shell e linha de comando.","https://linuxcommand.org/tlcl.php"],
  ["Linux","How Linux Works — Brian Ward","Explica processos, boot, dispositivos e rede.","https://nostarch.com/howlinuxworks3"],
  ["Linux","The Linux Programming Interface — Michael Kerrisk","Referência profunda de APIs e programação Linux.","https://man7.org/tlpi/"],
  ["Linux","OverTheWire Bandit","Desafios progressivos de terminal e segurança básica.","https://overthewire.org/wargames/bandit/"],
  ["Linux","OSTEP","Livro gratuito sobre sistemas operacionais: virtualização, concorrência e persistência.","https://ostep.org/"],
  ["Linux","GNU Bash Manual","Referência oficial da linguagem Bash.","https://www.gnu.org/software/bash/manual/"],
  ["Engenharia","Software Engineering — Ian Sommerville","Processos, requisitos, arquitetura e validação.","https://www.pearson.com/"],
  ["Engenharia","Pro Git","Livro gratuito sobre Git e fluxos de trabalho.","https://git-scm.com/book/pt-br/v2"],
  ["Engenharia","CLRS — Introduction to Algorithms","Algoritmos, estruturas e análise formal.","https://mitpress.mit.edu/"],
  ["Engenharia","CS50","Introdução prática à ciência da computação.","https://cs50.harvard.edu/x/"],
  ["Engenharia","Refactoring — Martin Fowler","Técnicas para melhorar estrutura sem mudar comportamento.","https://refactoring.com/"],
  ["Engenharia","Google Engineering Practices","Guia público de revisão de código e práticas de engenharia.","https://google.github.io/eng-practices/"],
  ["Engenharia","The Pragmatic Programmer — Hunt & Thomas","Hábitos práticos de desenvolvimento e manutenção.","https://www.pragprog.com/titles/tpp20/"],
  ["Engenharia","SwEBOK — IEEE Computer Society","Corpo de conhecimento em Engenharia de Software.","https://www.computer.org/education/bodies-of-knowledge/software-engineering"],
  ["Matemática","OpenStax — Algebra and Trigonometry","Livro aberto revisado por pares, com exercícios.","https://openstax.org/details/books/algebra-and-trigonometry"],
  ["Matemática","OpenStax — Calculus Volume 1","Cálculo diferencial em texto aberto e gratuito.","https://openstax.org/details/books/calculus-volume-1"],
  ["Matemática","MIT OCW — 18.06 Linear Algebra","Curso de álgebra linear do MIT com aulas e exercícios.","https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"],
  ["Matemática","MIT OCW — 6.042J Mathematics for CS","Lógica, provas, grafos e probabilidade para computação.","https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/"],
  ["Matemática","LibreTexts — Probability and Statistics","Material aberto de probabilidade e estatística.","https://stats.libretexts.org/"],
  ["C","C FAQ — Steve Summit","Respostas clássicas sobre armadilhas e comportamento de C.","http://www.c-faq.com/"],
  ["C","cppreference — C","Referência legível da biblioteca e da linguagem C.","https://en.cppreference.com/w/c.html"],
  ["Linux","Linux Kernel Documentation","Documentação oficial do kernel Linux.","https://docs.kernel.org/"],
  ["Linux","ShellCheck","Análise estática para scripts shell.","https://www.shellcheck.net/"],
  ["Sistemas","Operating Systems: Three Easy Pieces — Remzi & Andrea Arpaci-Dusseau","Livro aberto sobre virtualização, concorrência e persistência.","https://ostep.org/"],
  ["Sistemas","Modern Operating Systems — Andrew Tanenbaum","Referência clássica de projetos e mecanismos de SO.","https://www.pearson.com/"],
  ["Sistemas","Intel 64 and IA-32 Architectures SDM","Manual oficial de arquitetura e conjuntos de instruções.","https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html"],
  ["Sistemas","Arm Architecture Reference Manual","Referência oficial da arquitetura Arm.","https://developer.arm.com/documentation/ddi0487/latest/"],
  ["Redes","RFC 791 — Internet Protocol","Especificação oficial do IPv4.","https://www.rfc-editor.org/rfc/rfc791"],
  ["Redes","RFC 793 — Transmission Control Protocol","Especificação oficial do TCP.","https://www.rfc-editor.org/rfc/rfc793"],
  ["Redes","Computer Networking: A Top-Down Approach — Kurose & Ross","Abordagem didática baseada em aplicações e protocolos.","https://www.pearson.com/"],
  ["Redes","Cloudflare Learning Center","Explicações confiáveis de DNS, TLS, HTTP e rede.","https://www.cloudflare.com/learning/"],
  ["Banco de dados","PostgreSQL Documentation","Documentação oficial: SQL, índices, transações e administração.","https://www.postgresql.org/docs/"],
  ["Banco de dados","SQLite Documentation","Documentação oficial de um SGBD embarcado amplamente usado.","https://www.sqlite.org/docs.html"],
  ["Banco de dados","Use The Index, Luke!","Guia prático e gratuito de índices e desempenho SQL.","https://use-the-index-luke.com/"],
  ["Banco de dados","Database System Concepts — Silberschatz, Korth & Sudarshan","Referência universitária de modelagem, SQL e transações.","https://www.mheducation.com/"],

  /* Seção 6 do Prompt Mestre — recursos verificados com nível de uso. */
  ["Aprendizagem","Dunlosky et al. (2013) — Improving Students' Learning With Effective Learning Techniques","Guia científico das técnicas de alto e baixo impacto; base das decisões desta plataforma.","https://www.sciencedirect.com/science/article/pii/S2352154613000140","Base"],
  ["Aprendizagem","Roediger & Karpicke (2006) — Test-Enhanced Learning; Karpicke & Blunt (2011)","Evidência empírica do active recall: recuperar supera reler e mapas conceituais.","https://pubmed.ncbi.nlm.nih.gov/16519526/","Base"],
  ["Aprendizagem","Cepeda et al. (2006) — Distributed Practice Meta-Analysis","Fundamenta os intervalos 24h → 7d → 30d da revisão espaçada.","https://psycnet.apa.org/record/2006-06549-003","Base"],
  ["Aprendizagem","Rohrer (2012) — Interleaving Helps Students Distinguish among Similar Concepts","Por que listas misturadas superam blocos repetitivos do mesmo tipo.","https://link.springer.com/article/10.1007/s10648-012-9201-3","Base"],
  ["Aprendizagem","Bjork & Bjork — Introducing Desirable Difficulties","Diferencia desempenho imediato de aprendizado retido e transferível.","https://www.frontiersin.org/articles/10.3389/fpsyg.2011.00128/full","Base"],
  ["Aprendizagem","Fiorella & Mayer — Learning by Teaching","Base científica da Técnica Feynman e das explicações próprias.","https://link.springer.com/article/10.1007/s10648-013-9244-0","Base"],
  ["Aprendizagem","Ericsson et al. (1993) — Deliberate Practice (revisão PMC)","Prática focada nas fraquezas com feedback corretivo imediato.","https://pmc.ncbi.nlm.nih.gov/articles/PMC3848038/","Base"],
  ["TDAH","CHADD — Executive Function Skills","Estrutura externa para funções executivas: iniciação, memória de trabalho e tempo.","https://chadd.org/attention-adhd/executive-functions/","Base"],
  ["TDAH","Cleveland Clinic — Body Doubling for ADHD","Pomodoro + presença externa como andaime para começar e sustentar.","https://my.clevelandclinic.org/health/articles/25180-adhd-body-doubling","Base"],
  ["Ferramenta","Anki + documentação FSRS","Repetição espaçada automatizada com algoritmo moderno; sincronize com a Forge.","https://docs.ankiweb.net/deck-options.html#fsrs","Todos"],
  ["C","Beej's Guide to C Programming","Referência direta, moderna e gratuita para consultas rápidas de C.","https://beej.us/guide/bgc/","0→2"],
  ["C","Effective C (2ª ed., C23) — Robert C. Seacord","Programação profissional, segurança de memória e padrão C23.","https://www.pearson.com/","2→3"],
  ["C","Modern C (3ª ed., C23) — Jens Gustedt","Aprofundamento rigoroso em C moderno e código portável.","https://modernc.gforge.inria.fr/","2→3"],
  ["C","Manual oficial do Valgrind","Memcheck, Helgrind e diagnóstico de vazamentos com --track-origins=yes.","https://valgrind.org/docs/manual/manual.html","0→2"],
  ["Redes","Computer Networks: A Systems Approach — Peterson & Davie","Livro aberto sobre decisões de projeto de protocolos.","https://book.systemsapproach.org/","1→3"],
  ["Redes","Beej's Guide to Network Programming","Manual prático de POSIX sockets TCP/UDP em C.","https://beej.us/guide/bgnet/","2→3"],
  ["Redes","Stanford CS 144 — Introduction to Computer Networking","Curso universitário com laboratórios de implementação de protocolos.","https://cs144.github.io/","2→3"],
  ["Redes","Kurose & Ross — Wireshark Labs oficiais","Capturas guiadas de HTTP, DNS, TCP, IP e Ethernet/ARP.","https://www-net.cs.umass.edu/kurose_ross/wireshark.htm","0→2"],
  ["Engenharia","Code Complete (2ª ed.) — Steve McConnell","Construção limpa, modularidade, testes e depuração.","https://www.stevemcconnell.com/cc.htm","1→3"],
  ["Engenharia","Software Engineering at Google — Titus Winters et al.","Testes, revisão de código, documentação, CI e manutenção em escala.","https://abseil.io/resources/swe-book","2→3"],
  ["Engenharia","Designing Data-Intensive Applications — Martin Kleppmann","Modelos de dados, índices, transações, replicação e consiliência.","https://dataintensive.net/","3"],
  ["Matemática","A Matemática do Ensino Médio (SBM) — Lima, Carvalho, Wagner e Morgado","Rigor conceitual para base sólida e preparação nível ITA.","https://www.sbm.org.br/","1→2"],
  ["Matemática","Concrete Mathematics — Graham, Knuth & Patashnik","Ponte entre Matemática Discreta e Ciência da Computação.","https://www-cs-faculty.stanford.edu/~knuth/gkp.html","2→3"],
  ["Física/ITA","Curso de Física Básica (Vol. 1–4) — H. Moysés Nussenzveig","Aprofundamento físico-matemático para nível ITA.","https://www.editora.ufrj.br/","2→3"]
];

const LIBRARY = LIBRARY_BASE.map(x => x.length >= 5 ? x : [...x, "Todos"]);

// Rotas de leitura: sequências curtas e verificáveis de recursos da biblioteca.
const READING_ROUTES = [
  {
    name: "Matemática do zero ao cálculo",
    desc: "Aritmética → álgebra → funções → diferençiação, com intuição antes da formalização.",
    steps: [
      ["Base", "Khan Academy", "Preenche lacunas de aritmética com prática imediata."],
      ["Álgebra", "OpenStax — Algebra and Trigonometry", "Liga operações a variáveis, funções e trigonometria."],
      ["Cálculo", "OpenStax — Calculus Volume 1", "Limites e derivadas com exemplos e exercícios."],
      ["Aprofundamento", "3Blue1Brown", "Intuições visuais para consolidar o que foi calculado."]
    ]
  },
  {
    name: "Programação em C com Linux",
    desc: "Da compilação ao sistema: leia o código como o compilador e o sistema o veem.",
    steps: [
      ["Linguagem", "C Programming: A Modern Approach — K. N. King", "Curso-texto progressivo de C padrão."],
      ["Referência", "cppreference — C", "Consulte biblioteca e detalhes de comportamento."],
      ["Armadilhas", "C FAQ — Steve Summit", "Evita erros clássicos de ponteiros e comportamento indefinido."],
      ["Sistema", "CS:APP — Bryant & O'Hallaron", "Conecta C, memória, assembly e chamadas de sistema."]
    ]
  },
  {
    name: "Sistemas, redes e infraestrutura",
    desc: "Entenda o que acontece entre um comando, um pacote e uma resposta HTTP.",
    steps: [
      ["SO", "Operating Systems: Three Easy Pieces", "Processos, concorrência e persistência sem mistério."],
      ["Rede", "Computer Networking: A Top-Down Approach", "Protocolos explicados a partir das aplicações."],
      ["Referência", "RFC 793 — TCP", "Leia a especificação primária depois do curso."],
      ["Operação", "Cloudflare Learning Center", "DNS, TLS e HTTP no cotidiano de produção."]
    ]
  },
  {
    name: "Engenharia de Software aplicada",
    desc: "Requisitos → projeto → revisão → entrega, com decisões registradas.",
    steps: [
      ["Fundamento", "Software Engineering — Ian Sommerville", "Visão completa de processos e qualidade."],
      ["Colaboração", "Pro Git", "Fluxos de trabalho e histórico confiável."],
      ["Revisão", "Google Engineering Practices", "Padrões concretos de revisão de código."],
      ["Evolução", "Refactoring — Martin Fowler", "Catálogo de melhorias com comportamento preservado."]
    ]
  },
  {
    name: "Dados relacionais bem modelados",
    desc: "Modele, consulte e interprete transações e índices.",
    steps: [
      ["Modelo", "Database System Concepts", "Álgebra relacional, normalização e transações."],
      ["Prática", "PostgreSQL Documentation", "SQL real, tipos, índices e planos de consulta."],
      ["Desempenho", "Use The Index, Luke!", "Diagnóstico de consultas lentas com índices."],
      ["Operação", "SQLite Documentation", "Entenda um SGBD embarcado e seu modelo de transação."]
    ]
  }
];

// Cada projeto: [título, descrição, entregáveis, nível]. A ordem do array é estável:
// os índices compõem as chaves `proj<i>-<j>` salvas em labDone.
const PROJECTS = [
  ["Calculadora científica em C","Implemente operações, validação de entrada, funções e testes. Integre aritmética, decomposição e compilação Linux.",["Requisitos documentados","Operações básicas e precedência","Tratamento de divisão por zero","Testes de unidade","README com compilação e uso"],"Fundamentos"],
  ["Monitor de processos Linux","Crie uma ferramenta que leia informações de processos e apresente PID, nome e estado. Estude /proc e permissões.",["Escopo e requisitos definidos","Leitura segura de /proc","Tratamento de processos que desaparecem","Testes e tratamento de erro","Documentação de limitações"],"Intermediário"],
  ["Interpretador de expressões","Construa parser simples para expressões aritméticas. Integre matemática discreta, pilhas/árvores e C.",["Gramática documentada","Tokenização","Parser com precedência","Avaliação e erros sintáticos","Testes de expressões"],"Intermediário"],
  ["Sistema de biblioteca","Modele livros, usuários e empréstimos. Produza requisitos, arquitetura, testes e documentação.",["Requisitos funcionais e não funcionais","Modelo de domínio","Arquitetura documentada","Plano de testes","CI e instruções de execução"],"Avançado"],
  ["Plano financeiro com frações e porcentagem","Use um conjunto real de despesas para aplicar frações, porcentagem, arredondamento e proporção. Explique cada decisão com números e linguagem simples.",["Coleta de dados fictícios ou reais anonimizados","Cálculo de frações e percentuais","Arredondamento justificado","Verificação com cálculo mental","Relatório com conclusões"],"Fundamentos"],
  ["Planejador de endereçamento IPv4","Dimensione sub-redes para três escritórios com números diferentes de hosts. Use o laboratório de redes para conferir rede, broadcast e primeiro/último host.",["Levantamento de hosts por escritório","Escolha de prefixos e máscaras","Tabela de redes e broadcasts","Verificação de sobreposição","Diagrama e justificativa"],"Intermediário"],
  ["Modelo relacional e consultas SQL","Modele um domínio com entidades, chaves e relacionamentos. Escreva consultas com filtro, JOIN, GROUP BY e explique o papel dos índices.",["Diagrama entidade-relacionamento","Chaves primárias e estrangeiras","Normalização até a 3FN","Consultas com JOIN e agregação","Análise de índices e plano de consulta"],"Intermediário"],
  ["Monitor de sistema com observabilidade","Evolua o monitor de processos: amostre CPU e memória, registre logs estruturados e apresente métricas com limites claros de interpretação.",["Definição de métricas e limites","Amostragem periódica segura","Logs com contexto e nível","Benchmark honesto com condições documentadas","README com limitações conhecidas"],"Avançado"],
  ["Pipeline de qualidade e entrega","Configure um fluxo de integração contínua para um pequeno projeto: análise estática, testes em camadas e plano de reversão.",["Pipeline documentado","Lint e análise estática","Testes unitários e de contrato","Gate de qualidade com critérios explícitos","Plano de rollback ensaiado"],"Avançado"],
  ["Serviço HTTP didático em C","Implemente um servidor mínimo com sockets TCP, analise uma requisição HTTP e responda de forma previsível. Documente cada syscall usada.",["Modelo cliente-servidor descrito","Socket, bind, listen e accept","Leitura e parsing de requisição","Encerramento gracioso e tratamento de erro","Testes com cliente real e ADR curto"],"Avançado"],

  /* Seção 11 — 5 projetos integradores (índices 10 a 14; não reordene os anteriores). */
  ["Integrador 1 — Calculadora científica e parser de expressões em C","Analisador de expressões com precedência, funções e pilha de erros. Compile com -Wall -Wextra -Wpedantic -Werror e prove ausência de vazamentos.",["Gramática e precedência documentadas","Tokenização e parser com pilha","Avaliação, funções e tratamento de erro","Testes unitários com assert em make test","Valgrind --leak-check=full com 0 bytes vazados"],"Integrador"],
  ["Integrador 2 — Monitor de processos Linux lendo /proc em C","Leia /proc/<pid>/status e /proc/<pid>/stat com tratamento de processos que desaparecem durante a leitura.",["Leitura segura de /proc com PATH_MAX","Campos PID, estado, RSS e tempo","Tratamento de ENOENT, EACCES e parsing parcial","Saída previsível em formato de tabela","Testes com processos reais e README de limitações"],"Integrador"],
  ["Integrador 3 — Mini-shell Unix em C","Implemente loop de leitura, fork, execvp, waitpid, pipes e redirecionamento com códigos de saída corretos.",["Prompt e leitura com fgets","fork + execvp + waitpid","Pipes entre comandos","Redirecionamento de stdin/stdout/stderr","Testes manuais documentados e tratamento de SIGINT"],"Integrador"],
  ["Integrador 4 — Servidor HTTP/1.1 mínimo em C","Servidor com getaddrinfo, poll, respostas com Content-Length e Content-Type, logs estruturados e captura analisada no Wireshark.",["getaddrinfo, setsockopt, bind, listen","Loop de eventos com poll","Parsing de GET / e resposta HTTP/1.1 válida","Logs estruturados e Makefile com sanitizers","Captura no Wireshark com handshake TCP e ADR curto"],"Integrador"],
  ["Integrador 5 — Sistema completo documentado no Git","Entrega final que integra um dos projetos anteriores com requisitos mensuráveis, decisões registradas e verificação automatizada.",["5 requisitos funcionais e 3 RNFs mensuráveis","2 ADRs no padrão Contexto/Decisão/Alternativas/Consequências","Suíte automatizada com casos de borda","Pipeline de verificação com gate explícito","Histórico com commits atômicos e README reprodutível"],"Integrador"]
];

const FLASHCARDS = {
  linux: [["O que pwd mostra?","Diretório atual."],["O que ls -la inclui?","Arquivos ocultos e detalhes."],["O que .. representa?","Diretório pai."],["Diferença entre > e >>?","\u003e sobrescreve; \u003e\u003e acrescenta."],["O que um pipe faz?","Conecta saída de um comando à entrada de outro."],["rwx em octal?","4 + 2 + 1 = 7."],["O que é PID?","Identificador de processo."],["O que SIGTERM faz?","Solicita encerramento do processo."],["O que é syscall?","Interface para solicitar serviço ao kernel."],["O que são stdin/stdout/stderr?","Descritores padrão 0, 1 e 2."]],
  c: [["O que é pré-processamento?","Etapa que trata diretivas como #include e macros."],["Para que serve -Wall?","Ativa um conjunto útil de avisos do compilador."],["O que int *p declara?","Ponteiro para int."],["O que &x produz?","Endereço do objeto x."],["O que *p faz?","Acessa o objeto apontado."],["O que termina uma string C?","Caractere nulo \\0."],["Qual índice inicial de array?","Zero."],["O que malloc retorna?","Ponteiro para memória ou NULL."],["O que free faz?","Libera alocação dinâmica."],["O que é comportamento indefinido?","Execução para a qual o padrão C não impõe requisitos."]],
  math: [["Quanto é 25% em decimal?","0,25."],["Como somar frações?","Use denominador comum."],["Como calcular 99+36 mentalmente?","100+36−1=135."],["O que é variável?","Símbolo que representa um valor no contexto algébrico."],["O que é função?","Associação que dá uma única saída para cada entrada do domínio."],["Fórmula da derivada de x^n?","n·x^(n−1), em seu domínio."],["O que derivada representa?","Taxa de variação instantânea/inclinação."],["O que integral definida representa?","Acumulação líquida, frequentemente área assinada."],["O que é limite?","Valor ao qual a função se aproxima."],["O que é vetor?","Elemento de um espaço vetorial, com operações definidas."]],
  software: [["O que é requisito funcional?","Comportamento/capacidade que o sistema deve oferecer."],["O que é RNF?","Atributo de qualidade ou restrição, idealmente mensurável."],["O que git init faz?","Inicializa repositório Git."],["O que git add faz?","Prepara alterações no índice."],["O que git commit faz?","Registra um snapshot no histórico."],["O que é teste unitário?","Verifica uma unidade pequena isoladamente."],["O que significa coesão?","Quanto os elementos de um módulo pertencem juntos."],["O que é acoplamento?","Grau de dependência entre módulos."],["O que é ADR?","Registro de decisão arquitetural."],["O que SOLID reúne?","Cinco princípios de projeto orientado a objetos."]],
  mathfund: [["O que é um natural?","Número usado para contar; a convenção sobre o zero varia."],["Como converter 25% em fração?","25/100 = 1/4."],["O que é MMC?","Menor múltiplo comum de dois ou mais números."],["Como comparar 0,5 e 1/2?","São iguais: 1/2 = 0,5."],["O que significa a^b com b natural?","a multiplicado por si mesmo b vezes."],["O que é divisor de n?","Número que divide n sem resto."],["Como arredondar 3,14159 com duas casas?","3,14 (terceira casa é 1)."],["O que é proporção?","Igualdade entre duas razões."],["Qual a regra dos sinais na multiplicação?","Ignais dão positivo; opostos dão negativo."],["O que é ordem das operações?","Parênteses, potências, multiplicação/divisão, adição/subtração."]],
  systems: [["O que é uma chamada de sistema?","Interface controlada para pedir serviços ao kernel."],["O que é um processo?","Programa em execução com estado e contexto próprios."],["Qual a diferença entre processo e thread?","Threads compartilham o espaço de endereço do processo."],["O que é escalonamento?","Decisão do kernel sobre qual tarefa executa e por quanto tempo."],["O que é deadlock?","Conjunto de processos bloqueados esperando recursos uns dos outros."],["O que é memória virtual?","Abstração que dá a cada processo um espaço de endereço próprio."],["O que é paginação?","Divisão da memória em blocos fixos chamados páginas."],["O que faz um cache?","Guarda cópias de dados para acesso futuro mais rápido."],["O que é interrupção?","Sinal de hardware ou software que redireciona a CPU."],["O que é localidade temporal?","Tendência de acessar novamente dados usados pouco antes."]],
  networks: [["O que o modelo OSI organiza?","Funções de comunicação em sete camadas."],["Quantas camadas tem o modelo TCP/IP?","Quatro, na visão clássica."],["O que uma máscara de rede define?","Qual parte do endereço IP identifica a rede."],["O que é CIDR?","Notação de endereço com prefixo, como 192.168.0.0/24."],["O que o DNS resolve?","Nomes de domínio em endereços IP."],["O que o ARP faz?","Mapeia IPv4 para endereço MAC na rede local."],["O que TCP garante?","Entrega ordenada e confiável, com controle de fluxo."],["Qual a diferença entre TCP e UDP?","TCP é orientado a conexão; UDP é datagrama sem garantias."],["O que uma porta identifica?","Um serviço/processo dentro do host."],["O que traceroute ajuda a diagnosticar?","O caminho de roteadores até um destino."]],
  databases: [["O que é um SGBD?","Software que gerencia dados, acesso e integridade."],["O que é chave primária?","Identificador único de uma tupla."],["O que é chave estrangeira?","Campo que referencia a chave primária de outra tabela."],["O que 3FN exige?","Estar em 2FN e não ter atributos não-chave dependentes de outros não-chave."],["O que JOIN faz?","Combina linhas de tabelas segundo uma condição."],["O que GROUP BY faz?","Agrupa linhas para agregação."],["O que ACID significa?","Atomicidade, Consistência, Isolamento e Durabilidade."],["O que é um índice?","Estrutura que acelera buscas, com custo de escrita."],["O que é injecao SQL?","Inserção de comandos maliciosos em uma consulta."],["O que é MVCC?","Controle de concorrência por múltiplas versões de linhas."]]
};

# Rotas de leitura progressivas do FORGE

Seis percursos que conectam arquivos já presentes em `saida/`. Todos os caminhos são relativos à raiz do repositório e foram conferidos na listagem do diretório antes da escrita deste arquivo.

Cada rota tem público-alvo, duração estimada, pré-requisitos, passos numerados e um critério de conclusão observável. A duração é uma referência para sessões de 3 horas; o que importa é a ordem dos passos e o que você extrai de cada um.

Regra comum a todas as rotas: não pule o passo de verificação. O FORGE não trata leitura como progresso; tratamento de erro, teste e síntese Feynman fecham cada percurso.

| Rota | Nível | Tema | Duração estimada |
| --- | --- | --- | --- |
| 1 | Iniciante | Rotina e primeira questão | 3 a 4 horas |
| 2 | Iniciante | Álgebra desde os primeiros princípios | 5 a 6 horas |
| 3 | Intermediário | Funções, cálculo e SymPy | 7 a 9 horas |
| 4 | Intermediário | Contagem, incerteza e finanças | 6 a 8 horas |
| 5 | Intermediário | C, redes e ambiente local | 8 a 10 horas |
| 6 | Avançado | Criptografia aplicada | 10 a 14 horas |

---

## Rota 1 — Rotina e primeira questão (iniciante)

**Público-alvo:** quem está entrando no FORGE e ainda não sabe por onde começar.

**Duração estimada:** 3 a 4 horas, distribuídas em duas sessões.

**Pré-requisitos:** leitura basicamente em português; nenhum conhecimento prévio de C ou cálculo.

1. `saida/05_ciencia_do_estudo/metodologias.md`
   Extrair: o que é prática de recuperação (retrieval practice) e por que testar difere de reler. Anote a frase que define o mecanismo.
2. `saida/05_ciencia_do_estudo/rotina_modelo.md`
   Extrair: o significado das letras I, R, F, P, T, S e E e a regra de nunca eliminar T, S e E.
3. `saida/05_ciencia_do_estudo/anti_procrastinacao.md`
   Extrair: as quatro raízes do adiamento e qual delas mais aparece na sua semana.
4. `saida/02_resumos_por_livro/TQM_Fundamental/resumo_geral.md`
   Extrair: o mapa mental em texto e os cinco eixos temáticos usados nos resumos.
5. `saida/02_resumos_por_livro/TQM_Fundamental/cap01.md`
   Extrair: um exemplo concreto de apresentação do conteúdo; escreva sua própria versão em duas frases.
6. `saida/03_matematica_consolidada/folha_de_formulas.md`
   Extrair: apenas as duas primeiras linhas da tabela, conjuntos numéricos e operações com inteiros.
7. `saida/04_exercicios/banco_exercicios.md`
   Extrair: resolver 5 questões de conjuntos numéricos sem consultar a folha; só depois conferir o gabarito.
8. `saida/04_exercicios/simulados/simulado_01.md`
   Extrair: aplicar a rotina cronometrada em um bloco curto e registrar o acerto em fração de 10.

**Critério de conclusão:** você acerta pelo menos 4 das 5 questões de conjuntos e escreve uma síntese Feynman de no mínimo 30 caracteres explicando por que recuperação é diferente de releitura.

---

## Rota 2 — Álgebra desde os primeiros princípios (iniciante)

**Público-alvo:** estudante que decorou fórmulas e quer entender de onde elas vêm.

**Duração estimada:** 5 a 6 horas.

**Pré-requisitos:** operações básicas com inteiros e noção de fração.

1. `saida/07_primeiros_principios/genese_10_descobertas.md`
   Extrair: a descoberta F, do problema real ao teste de Feynman; copie as cinco camadas para o caderno.
2. `saida/02_resumos_por_livro/O_Algebrista/resumo_geral.md`
   Extrair: o mapa mental e a divisão em eixos do livro.
3. `saida/02_resumos_por_livro/O_Algebrista/cap01.md`
   Extrair: a primeira ideia de linguagem algébrica e um exemplo recriado com suas próprias palavras.
4. `saida/02_resumos_por_livro/O_Algebrista/cap02.md`
   Extrair: como a incógnita passa a operar nas expressões; escreva um exemplo diferente do arquivo.
5. `saida/03_matematica_consolidada/compendio_matematica.md`
   Extrair: os capítulos de produtos notáveis, fatoração, equações e inequações; compare com a gênese da completação do quadrado.
6. `saida/03_matematica_consolidada/folha_de_formulas.md`
   Extrair: as linhas de produtos notáveis, fatoração e Bháskara, incluindo a coluna de cuidados.
7. `saida/04_exercicios/banco_exercicios.md`
   Extrair: 10 questões de fatoração e 5 de equações, com gabarito conferido só ao final do bloco.
8. `saida/04_exercicios/verificacao/validacao_formulas.md`
   Extrair: como o projeto validou as fórmulas simbolicamente e o que foi considerado erro de digitação.

**Critério de conclusão:** você deriva a identidade de completeção do quadrado sem consultar e resolve 13 das 15 questões selecionadas, registrando as duas erradas no caderno de erros.

---

## Rota 3 — Funções, cálculo e verificação simbólica (intermediário)

**Público-alvo:** quem já domina equações e quer ligar álgebra a cálculo com checagem computacional.

**Duração estimada:** 7 a 9 horas.

**Pré-requisitos:** Rota 2 completa ou equivalência em fatoração e equações.

1. `saida/07_primeiros_principios/genese_10_descobertas.md`
   Extrair: a descoberta G, que mostra o impasse do 0/0 e o salto das fatias cada vez mais finas.
2. `saida/02_resumos_por_livro/O_Algebrista/resumo_geral.md`
   Extrair: onde funções aparecem no encadeamento do livro.
3. `saida/03_matematica_consolidada/compendio_matematica.md`
   Extrair: os capítulos de funções, logaritmos, limites, derivadas e integrais, nessa ordem.
4. `saida/03_matematica_consolidada/folha_de_formulas.md`
   Extrair: as linhas de composição, inversa, regra do produto, regra do quociente e integral definida.
5. `saida/04_exercicios/banco_exercicios.md`
   Extrair: 15 questões de funções, 10 de derivadas e 10 de integrais, separadas por bloco.
6. `saida/codigo/referencia_04_auditor_sympy.py`
   Extrair: quais verificações simbólicas o script executa e como a regra da cadeia aparece no código.
7. `saida/04_exercicios/verificacao/validacao_formulas.md`
   Extrair: o procedimento de validação e os critérios usados para aceitar uma fórmula.
8. `saida/04_exercicios/simulados/simulado_02.md`
   Extrair: desempenho cronometrado em cálculo, com correção e classificação dos erros.
9. `saida/05_ciencia_do_estudo/rotina_modelo.md`
   Extrair: como agendar a revisão espaçada dos erros desse simulado nos dias 1, 3, 7, 16 e 35.

**Critério de conclusão:** você executa o auditor SymPy sem erro, explica a regra da cadeia em 2 minutos sem jargão e acerta pelo menos 80% das questões de derivadas do simulado.

---

## Rota 4 — Contagem, incerteza e finanças (intermediário)

**Público-alvo:** quem quer entender probabilidade sem pular a contagem que a sustenta.

**Duração estimada:** 6 a 8 horas.

**Pré-requisitos:** noção de função e de exponenciação.

1. `saida/02_resumos_por_livro/Morgado_Combinatoria/resumo_geral.md`
   Extrair: o eixo de contagem e incerteza no mapa mental do livro.
2. `saida/02_resumos_por_livro/Morgado_Combinatoria/cap01.md`
   Extrair: a distinção entre somar casos disjuntos e multiplicar etapas independentes.
3. `saida/02_resumos_por_livro/Morgado_Combinatoria/cap02.md`
   Extrair: permutações e combinações com um exemplo reinventado de sua autoria.
4. `saida/02_resumos_por_livro/FME_1/resumo_geral.md`
   Extrair: como o mesmo livro organiza contagem, probabilidade e estatística em sequência.
5. `saida/03_matematica_consolidada/compendio_matematica.md`
   Extrair: os capítulos de análise combinatória, probabilidade, estatística e matemática financeira.
6. `saida/03_matematica_consolidada/folha_de_formulas.md`
   Extrair: as fórmulas de A(n,k), C(n,k), união de eventos, variância e juros compostos (compound interest).
7. `saida/04_exercicios/banco_exercicios.md`
   Extrair: 15 questões de combinatória, 15 de probabilidade e 10 de estatística.
8. `saida/04_exercicios/simulados/simulado_03.md`
   Extrair: resultado cronometrado e separação entre erro de contagem e erro de modelo.
9. `saida/04_exercicios/verificacao/validacao_exercicios.md`
   Extrair: como o banco garante que gabaritos e enunciados permanecem coerentes.

**Critério de conclusão:** você classifica 20 situações entre permutação, combinação e probabilidade condicional com pelo menos 18 acertos e justifica a escolha da fórmula de juros compostos em uma frase.

---

## Rota 5 — C, redes e ambiente local (intermediário)

**Público-alvo:** estudante de matemática que quer ver o código e a rede por trás das ferramentas.

**Duração estimada:** 8 a 10 horas.

**Pré-requisitos:** noção de variável e de função; não é preciso experiência prévia com C.

1. `saida/00_inventario/ferramentas.md`
   Extrair: o que está disponível no ambiente, a versão do Python e o caminho do gcc do MinGW.
2. `saida/extras/glossario_bilingue.md`
   Extrair: 20 termos das áreas de Linguagem C e Redes, com a coluna de uso típico.
3. `saida/codigo/referencia_02_buffer_seguro.c`
   Extrair: checagem de capacidade, realocação e sanitização da memória antes de liberar.
4. `saida/codigo/compilar_e_testar.py`
   Extrair: as flags usadas na compilação e por que o ambiente usa C11 no lugar de C17.
5. `saida/logs/compilacao.md`
   Extrair: resultado real da compilação e dos testes, com as mensagens do compilador.
6. `saida/codigo/referencia_03_servidor_tcp.c`
   Extrair: criação de socket, aceitação de conexão e diferença entre Winsock e POSIX.
7. `saida/codigo/referencia_05_calculadora_cidr.py`
   Extrair: como uma máscara CIDR vira rede, broadcast e quantidade de hosts.
8. `saida/extras/mapas_conceituais.md`
   Extrair: os mapas 4, 5 e 6 e as setas que ligam inteiros, camadas e sub-redes.
9. `saida/codigo/referencia_01_senha_csprng.c`
   Extrair: geração com fonte criptográfica e eliminação do viés de módulo (modulo bias).

**Critério de conclusão:** você explica o aviso de compilação registrado no log, calcula hosts de um /26 sem ajuda e aponta a linha do código C onde um estouro de buffer seria evitado.

---

## Rota 6 — Criptografia aplicada (avançado)

**Público-alvo:** quem quer ligar entropia (entropy), derivação de chave (key derivation) e protocolos em uma única leitura.

**Duração estimada:** 10 a 14 horas.

**Pré-requisitos:** Rota 5 completa, logaritmos e aritmética modular vistos no compêndio.

1. `saida/extras/arquitetura_criptografica.md`
   Extrair: seções 1 e 2, entropia, alfabetos e rejeição de viés de módulo.
2. `saida/03_matematica_consolidada/compendio_matematica.md`
   Extrair: os capítulos de logaritmos e sequências para reinterpretar log₂(N) e juros.
3. `saida/07_primeiros_principios/genese_10_descobertas.md`
   Extrair: a descoberta J, aritmética modular e o Pequeno Teorema de Fermat.
4. `saida/codigo/referencia_01_senha_csprng.c`
   Extrair: a origem dos bytes aleatórios e o limite de aceitação usado na rejeição.
5. `saida/extras/arquitetura_criptografica.md`
   Extrair: seção 3, comparação entre resumo rápido e KDF, com os parâmetros do Argon2id.
6. `saida/extras/arquitetura_criptografica.md`
   Extrair: seção 4, formato do cofre, duas camadas de chave, AEAD e AAD.
7. `saida/extras/arquitetura_criptografica.md`
   Extrair: seções 5 e 6, tokens, PKCE, TLS 1.3, sigilo perfeito para frente (PFS) e X.509.
8. `saida/extras/arquitetura_criptografica.md`
   Extrair: seções 7 e 8, matriz de ameaças e o que foi ou não verificado localmente.
9. `saida/codigo/referencia_04_auditor_sympy.py`
   Extrair: a verificação do inverso modular e do Fermat executada no próprio repositório.
10. `saida/extras/glossario_bilingue.md`
    Extrair: a seção de falsos amigos e os 32 termos de criptografia como revisão final.

**Critério de conclusão:** você calcula a entropia de uma senha de 20 símbolos entre 94 opções, explica por que sal e nonce não são segredos e transforma três linhas da matriz de ameaças em testes observáveis.

---

## Como adaptar as rotas

1. Se o dia encurtar, reduza o passo de exercícios, nunca o de verificação.
2. Se um passo parecer fácil, transforme a leitura em pergunta e responda sem olhar.
3. Se um passo parecer difícil, procure a seta correspondente nos mapas conceituais antes de voltar ao texto longo.
4. Registre cada rota concluída no caderno de erros com data, acerto e próxima revisão.

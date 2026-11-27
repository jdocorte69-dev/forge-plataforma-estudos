# Arquitetura Criptográfica Aplicada: entropia, aleatoriedade, cofres e protocolos

Documento de estudo autônomo, escrito em português do Brasil. Todo exemplo usa artefatos fictícios: o cofre **CofraForge** e o domínio **estudos.local**. Nenhuma frase foi transcrita do prompt de origem; os números foram recalculados com Python e aparecem na seção 8. Convenções de escrita: notação matemática apenas em Unicode (sem LaTeX); termos técnicos apresentados como "português (inglês)" na primeira ocorrência; incertezas explícitas marcadas com **ponto a confirmar**, para alimentar o diário de pendências do projeto.

## Índice

1. Fundamentos de entropia e da Teoria da Informação
2. Aleatoriedade: geradores comuns e criptográficos, eliminação do viés
3. Resumos rápidos versus funções de derivação de chave
4. Arquitetura de um cofre Conhecimento Zero: o CofraForge
5. Autenticação web: sessões, fichas de acesso, códigos temporários e credenciais de chave pública
6. TLS 1.3, sigilo perfeito para frente e infraestrutura de chaves públicas
7. Ameaças e contra-medidas (matriz)
8. Verificação computacional e pendências

---

## 1. Fundamentos de entropia e da Teoria da Informação

### 1.1 A medida da incerteza

A Teoria da Informação (Information Theory) trata uma senha como o resultado de uma fonte que escolhe símbolos. A Entropia (Entropy) H conta os bits de incerteza dessa fonte. Para uma fonte com N símbolos equiprováveis, a incerteza por símbolo é log₂(N); para L símbolos independentes, a relação clássica é:

H = log₂(N^L) = L × log₂(N)

Na forma geral, quando as probabilidades pᵢ não são iguais, a expressão de Shannon é H = −∑ pᵢ × log₂(pᵢ). A forma L × log₂(N) é o caso ótimo, atingido apenas quando a escolha é uniforme. Se o gerador favorece alguns caracteres, a entropia real fica abaixo do valor nominal — um detalhe que torna a qualidade do gerador tão importante quanto o comprimento da senha.

Dois cuidados conceituais. Primeiro, entropia não é contagem de caracteres: "aaaaaaaa" tem 8 caracteres, mas nenhuma incerteza se o atacante souber como foi gerado. Segundo, H mede o tamanho do espaço de busca, não o tempo de quebra: o tempo depende também do custo de cada tentativa, assunto das seções 3 e 4.

A unidade bit surge naturalmente porque log₂(2) = 1: uma escolha entre 2 opções equivale a 1 bit. Uma escolha entre 94 opções fornece log₂(94) ≈ 6,554589 bits, valor que será reutilizado nos exemplos seguintes.

Aplicação no CofraForge: o cofre não deve "sugerir" senhas a partir de palavras digitadas pelo usuário, pois a preferência humana introduz viés estatístico. A política do produto é gerar cada símbolo com uma fonte criptográfica (seção 2) e informar H ao usuário como ferramenta educativa.

### 1.2 Alfabetos e entropia por símbolo

A tabela abaixo foi calculada diretamente com math.log2. Os valores são bits por símbolo (ou por palavra, na última linha) e estão arredondados na sexta casa decimal.

| Conjunto de escolha | N | log₂(N) | Comentário prático |
| --- | --- | --- | --- |
| Dígitos decimais (0-9) | 10 | 3,321928 | PIN de 6 dígitos ≈ 19,9 bits: insuficiente sozinho |
| Hexadecimal (0-9, a-f) | 16 | 4,000000 | Conveniente para representarbytes, não para aumentar H |
| Letras minúsculas (a-z) | 26 | 4,700440 | Espaço pequeno; senhas humanas são piores ainda |
| Alfanumérico (a-z, A-Z, 0-9) | 62 | 5,954196 | Padrão comum de geradores |
| ASCII imprimível | 94 | 6,554589 | Inclui pontuação; exige cuidado com escapamento em arquivos |
| Lista Diceware (Diceware word list) | 7776 | 12,924813 | 7776 = 6⁵; cinco lançamentos de dado por palavra |

Exemplo inédito: uma senha de L = 20 caracteres retirada do alfabeto de N = 94 símbolos possui H = 20 × log₂(94) = 131,091777 bits, isto é, aproximadamente 131,1 bits. Esse número será confrontado com a capacidade de ataque mais adiante.

A linha Diceware merece atenção: a entropia não vem da palavra em si, mas do processo de sortear 5 dados (1 a 6) para escolher uma entrada da lista. Uma frase escolhida "porque me lembro dela" não herda os 12,924813 bits por palavra; ela herda apenas a imprevisibilidade do processo que a gerou.

### 1.3 Custo de busca com aceleradores de hardware

Considere um adversário com um cluster capaz de 10¹² tentativas por segundo contra um oráculo de resumo rápido. Para H bits, o espaço é 2^H; varrê-lo integralmente consome 2^H ÷ 10¹² segundos (a espera média é metade disso). Os valores abaixo foram obtidos por Python:

| Entropia H | Combinações aproximadas | Varredura completa a 10¹²/s |
| --- | --- | --- |
| 40 bits | 1,10 × 10¹² | 1,10 s |
| ≈ 51,7 bits (4 palavras Diceware) | 3,66 × 10¹⁵ | 3,66 × 10³ s ≈ 1,0 hora |
| ≈ 77,5 bits (6 palavras Diceware) | 2,21 × 10²³ | 2,21 × 10¹¹ s ≈ 7,0 × 10³ anos |
| ≈ 131,1 bits (L = 20, N = 94) | 2,90 × 10³⁹ | 2,90 × 10²⁷ s ≈ 9,2 × 10¹⁹ anos |

Essas estimativas são deliberadamente generosas com o atacante: elas assumem resumo rápido, sem sal, sem KDF e sem limite de tentativas. Na prática, um cofre bem projetado substitui o oráculo rápido por Argon2id (seção 3), derrubando a taxa de tentativas por várias ordens de magnitude.

Para Diceware especificamente: 4 palavras dão 4 × log₂(7776) = 51,699250 ≈ 51,7 bits; 6 palavras dão 6 × log₂(7776) = 77,548875 ≈ 77,5 bits. A diferença de duas palavras não é incremental — ela multiplica o espaço de busca por 7776.

A lição de projeto: 40 bits é confortável para um ataque online com bloqueio por tentativa, mas desastroso para um arquivo roubado e testado offline. A defesa offline exige entropia alta **e** KDF caro; uma das duas sem a outra deixa o cofre vulnerável.

### 1.4 Como comunicar entropia ao usuário

Mostrar "131,1 bits" é mais honesto que mostrar uma barra de "força" com cores, pois o número é derivado de uma hipótese explícita (L símbolos uniformes). O CofraForge deve exibir também a hipótese: "esta estimativa presume gerador uniforme e símbolos independentes".

É preciso ainda separar dois casos: senha escolhida pelo usuário (entropia efetiva desconhecida, provavelmente baixa) e senha gerada pelo cofre (entropia calculável). Misturá-los na mesma métrica cria falsa segurança.

Por fim, a entropia da senha mestra limita a segurança de todo o cofre, mas não precisa limitar a rotação da chave de dados: a arquitetura de duas camadas da seção 4 permite trocar a senha mestra sem reencriptar o banco.

---

## 2. Aleatoriedade: geradores comuns, criptográficos e eliminação do viés

### 2.1 Por que um Gerador Linear Congruencial não serve

Um Gerador de Números Pseudoaleatórios Comum (PRNG, Pseudorandom Number Generator) típico em bibliotecas de C é o Gerador Linear Congruencial (LCG, Linear Congruential Generator):

Xₙ₊₁ ≡ (a × Xₙ + c) mod m

O estado é pequeno (frequentemente 32 bits) e a transição é linear. Quem observa algumas saídas consegue reconstruir a semente (seed) por álgebra modular; quando a semente vem de time(NULL), o atacante precisa testar apenas uma janela de tempo curta. O resultado é previsibilidade total, não apenas viés estatístico.

Mesmo um LCG com estado maior não oferece a propriedade que a criptografia exige: saídas passadas não devem permitir reconstruir saídas futuras nem passadas. A previsibilidade é uma falha categórica, não um detalhe de implementação.

Consequência direta no CofraForge: nenhum sal, nonce, code_verifier ou chave pode vir de rand(), srand(), Math.random() ou equivalente. A revisão de código deve tratar essas chamadas como proibidas em caminhos de segurança.

### 2.2 O que um CSPRNG garante e onde obtê-lo

O Gerador de Números Pseudoaleatórios Criptográfico (CSPRNG, Cryptographically Secure Pseudorandom Number Generator) mistura ruído coletado pelo sistema operacional — interrupções, tempos de entrada, jitter de relógio — em um pool de entropia (entropy pool) e expande esse material com uma função criptográfica. As propriedades esperadas são indistinguibilidade em relação ao acaso uniforme e resistência a retrospecção: comprometer o estado atual não revela o que já saiu.

| Sistema | Interface recomendada | Observação |
| --- | --- | --- |
| Linux | getrandom(2) | Chamada de sistema (system call) direta; /dev/urandom é a alternativa clássica |
| BSD e macOS | arc4random_buf() | Já devolve bytes em buffer, sem inicialização manual de semente |
| Windows | BCryptGenRandom() | Parte da CNG; usar o provedor preferido do sistema |

Preferir a interface de sistema ao invés de implementar o próprio gerador evita o erro mais comum: reutilizar semente, branching por plataforma ou usar relógio como fonte. O CofraForge deve abortar a operação se a leitura de entropia falhar, em vez de seguir com um fallback determinístico.

Detalhes de disponibilidade e semântica de bloqueio de getrandom(2) e arc4random_buf() em versões específicas de kernel/glibc são **ponto a confirmar** antes de fixar a matriz mínima de suporte do produto.

### 2.3 Viés de módulo (modulo bias) e amostragem por rejeição

Reduzir um byte aleatório R ∈ [0, 2ᴮ − 1] a um índice em [0, N − 1] com R mod N só é uniforme se N dividir 2ᴮ exatamente. Caso contrário, os primeiros índices recebem uma amostra extra. A correção padrão é a amostragem por rejeição (rejection sampling):

1. Calcular o limite L = 2ᴮ − (2ᴮ mod N).
2. Sortear R fresco da fonte criptográfica.
3. Se R ≥ L, descartar R e sortear novamente.
4. Caso contrário, devolver R mod N, que agora é uniforme.

Exemplo com B = 8 e N = 94: 2ᴮ = 256, 256 mod 94 = 68, logo L = 188. A taxa de aceitação é 188 ÷ 256 = 0,734375. Sem a correção, os índices 0 a 67 teriam probabilidade 3/256 ≈ 0,011719 e os demais 2/256 ≈ 0,007812 — razão de 1,5 entre eles. O viés é pequeno, mas sistemático e explorável em escala.

Segundo exemplo, mais próximo do gerador Diceware: B = 16 e N = 7776 dão L = 62208 e aceitação de 0,94921875, com apenas 3328 valores descartados de cada 65536. O custo da correção é, portanto, modesto.

A implementação deve pedir bytes novos a cada rejeição (não reaproveitar o mesmo R), usar inteiros sem sinal largos o bastante e nunca converter o resultado por float. O CofraForge aplica a mesma rotina a senhas, sais, nonce e geradores de code_verifier.

### 2.4 Testes e limites dos testes

Testes estatísticos de aleatoriedade detectam defeitos óbvios, mas não provam segurança: um LCG bem parametrizado pode passar em baterias e continuar previsível. A garantia vem da construção e da fonte, não do histograma.

Registre em log apenas metadados (número de rejeições, falhas de leitura), nunca os bytes sorteados. Um log de depuração que imprime o nonce já compromete a confidencialidade do cofre.

---

## 3. Resumos rápidos versus Funções de Derivação de Chave

### 3.1 Duas ferramentas com objetivos opostos

Uma Função de Resumo Criptográfico (hash function) como SHA-256 é projetada para vazão máxima: auditoria de integridade de arquivos e construção de outras primitivas. Justamente por ser rápida, é péssima para guardar senhas: um circuito integrado de aplicação específica (ASIC) ou unidade de processamento gráfico (GPU, Graphics Processing Unit) avalia bilhões de candidatos por segundo.

Uma Função de Derivação de Chave (KDF, Key Derivation Function) para senhas faz o inverso: consome tempo, memória e largura de banda de forma ajustável para que cada tentativa do atacante seja cara. Tabela arco-íris (rainbow table) e força bruta (brute force) perdem eficiência quando há sal único e custo por tentativa elevado.

| Critério | Resumo rápido | KDF lento/difícil em memória |
| --- | --- | --- |
| Exemplos | SHA-256, SHA-3, BLAKE3, MD5, SHA-1 | Argon2id, scrypt, bcrypt, PBKDF2 |
| Objetivo de projeto | Vazão e integridade | Aumentar o custo por tentativa |
| Paralelismo em GPU | Altíssimo | Limitado (exceto PBKDF2/bcrypt) |
| Consumo de RAM | Desprezível | Centenas de MiB ou mais (Argon2id, scrypt) |
| Uso adequado | Verificar arquivo, derivar material público | Derivar chave a partir de senha mestra |

MD5 e SHA-1 têm colisões (collision) conhecidas e não devem aparecer em nenhum caminho novo de autenticação ou assinatura.

### 3.2 Argon2id segundo o RFC 9106

Argon2id é a variante principal descrita no RFC 9106 e combina duas estratégias. Na primeira passagem, os dois primeiros segmentos dos quatro usam indexação independente dos dados (como Argon2i), o que dificulta ataques de canal lateral (side-channel); o restante usa indexação dependente dos dados (como Argon2d), o que encarece ataques de troca tempo-memória (time-memory trade-off).

O RFC 9106 registra duas opções "recomendadas": a primeira com t = 1, p = 4 e m = 2 GiB; a segunda, voltada a ambientes com menos memória, com t = 3, p = 4, m = 2¹⁶ KiB = 64 MiB, sal de 16 bytes (128 bits) e etiqueta de 32 bytes (256 bits). É a segunda que o CofraForge adota como padrão de estudo: m = 64 MiB, t = 3, p = 4.

O sal (salt) deve ser único por cofre, gerado por CSPRNG, e armazenado em texto claro no cabeçalho — ele não é segredo. O parâmetro de paralelismo p = 4 indica faixas (lanes) independentes; m é contado em kibibytes e internamente arredondado para múltiplos de 4 × p.

Mudar m, t ou p exige migrar o cofre: os parâmetros precisam ser gravados no cabeçalho junto do salt, ou versões antigas deixarão de abrir. O campo de versão da seção 4 resolve isso.

O módulo Argon2 não estava instalado no ambiente de verificação; portanto, os parâmetros foram conferidos no texto do RFC 9106, mas nenhum vetor de tag foi executado localmente. Essa ausência é **ponto a confirmar** antes de publicar uma implementação de referência.

### 3.3 bcrypt, scrypt e PBKDF2

O bcrypt deriva do Blowfish e introduz um fator de custo exponencial. Sua limitação conhecida é o teto de 72 bytes na entrada da senha; entradas maiores podem ser truncadas ou rejeitadas conforme a biblioteca. Para uma senha mestra longa, esse teto é uma restrição real de projeto. Comportamento exato entre implementações: **ponto a confirmar** na biblioteca escolhida.

O scrypt constrói um problema de memória (ROMix) que desestimula ASICs: o atacante precisa manter um grande bloco acessível, não apenas registrar portas lógicas. Seus parâmetros usuais são N (custo de CPU/memória), r (tamanho de bloco) e p (paralelismo).

O PBKDF2 aplica HMAC repetidamente e é citado na NIST SP 800-132. A desvantagem é ser apenas "lento", não difícil em memória: GPUs paralelizam bem as iterações. Ainda assim, é uma escolha legítima quando a plataforma não oferece Argon2id, desde que o número de iterações seja alto e registrado junto do hash.

O número mínimo de iterações e a redação exata das recomendações da NIST SP 800-132 não foram consultados na fonte primária nesta sessão: **ponto a confirmar**.

### 3.4 Critérios de escolha

Para o CofraForge a ordem de preferência é Argon2id, scrypt, PBKDF2, com bcrypt reservado a sistemas legados. O critério não é moda: é o custo imposto a um atacante que já possui o arquivo cifrado e pode trabalhar offline sem limites de taxa.

A escolha também precisa considerar o dispositivo mais fraco suportado: m = 64 MiB por abertura pode ser inviável em hardware modesto. A mitigação correta é calibrar m por dispositivo e gravar o valor escolhido no cabeçalho, nunca reduzir o custo silenciosamente.

---

## 4. Arquitetura de um cofre Conhecimento Zero: o CofraForge

### 4.1 O formato binário do arquivo

A arquitetura Conhecimento Zero (Zero-Knowledge) significa que o serviço que sincroniza o arquivo nunca recebe a senha mestra nem as senhas guardadas: ele armazena apenas bytes opacos. O formato do CofraForge é um contêiner com cabeçalho fixo e corpo cifrado.

```
+----------------------+----------------------+----------------------+
| bytes mágicos (4 B)  | versão (2 B)         | sal da KDF (16 B)    |
| "CFVL"               | 0x0002               | CSPRNG, público      |
+----------------------+----------------------+----------------------+
| nonce (12 B GCM      | ciphertext (tamanho  | etiqueta (16 B)      |
| ou 24 B XChaCha20)   | variável)            | Poly1305 ou GCM      |
+----------------------+----------------------+----------------------+
 \__________________ dados associados adicionais (AAD) _____________/
                       \________ saída autenticada ________/
```

Bytes mágicos (magic bytes) identificam o formato e impedem que um arquivo aleatório seja interpretado como cofre. O campo de versão (version) permite migrar parâmetros sem quebrar cofres antigos. Sal e nonce são públicos por definição; o segredo está apenas na chave.

O número usado uma vez (nonce) de 12 bytes é o tamanho usual no modo GCM; a variante IETF do XChaCha20-Poly1305 emprega 24 bytes. Em ambos os casos, a regra é absoluta: nunca repetir nonce sob a mesma chave. Na reutilização sob GCM, a autenticação pode ser forjada por quem observa duas mensagens.

O limite máximo de bytes cifrados por nonce no GCM com IV de 12 bytes e o limite exato da variante XChaCha20 adotada pela biblioteca são **ponto a confirmar** na documentação da implementação escolhida.

### 4.2 Derivação, encapsulamento e Criptografia Autenticada

O fluxo de abertura e gravação tem duas camadas:

```
senha mestra --+--> Argon2id(m=64 MiB, t=3, p=4, sal 16 B) --> Chave Mestra (32 B)
               |                                                     |
               +-- não é usada diretamente nos dados                 +--> desembrulha
                                                                          Chave do Cofre (32 B, aleatória)
                                                                                  |
banco de credenciais + cabeçalho como AAD + nonce --> AEAD <-------------+
                                                        |
                                                        v
                                           ciphertext || etiqueta (16 B)
```

A Chave Mestra (Master Key) protege apenas a Chave do Cofre (Vault Key), que é aleatória e de 32 bytes. Essa indireção permite trocar a senha mestra reencriptando só a pequena chave encapsulada, sem reprocessar todo o banco de credenciais.

A Criptografia Autenticada com Dados Associados (AEAD, Authenticated Encryption with Associated Data) é obrigatória: cifrar sem autenticar deixa o arquivo aberto a modificação de bits. Duas opções adequadas são AES-256-GCM e XChaCha20-Poly1305. A etiqueta (authentication tag) de 128 bits (16 bytes) detecta qualquer alteração no ciphertext ou nos dados associados.

Incluir bytes mágicos, versão, sal e nonce como dados associados adicionais (AAD, Additional Authenticated Data) impede que um atacante troque a versão para uma mais fraca ou substitua o sal sem ser detectado. A verificação da etiqueta deve preceder qualquer analisador do conteúdo.

Se a etiqueta falhar, o cofre deve encerrar a operação com erro genérico, sem revelar se o problema foi senha errada, cabeçalho alterado ou arquivo corrompido. Mensagens distintas viram oráculo para o atacante.

### 4.3 Higiene de memória e vazamentos

Mesmo com criptografia correta, segredos podem escapar pela memória. O bloqueio de páginas (mlock()) no Linux e o VirtualLock() no Windows reduzem a chance de que páginas contendo chaves sejam enviadas para paginação (swap). O bloqueio pode exigir privilégio ou cotas de memória travada; falhar deve gerar aviso explícito, não silêncio.

A limpeza segura usa explicit_bzero() em sistemas POSIX ou sodium_memzero() via libsodium — funções que o compilador não remove por otimização. memset() comum pode ser eliminado quando o otimizador percebe que o buffer não é mais lido.

Outras precauções do CofraForge: desativar despejos de núcleo (core dumps) no processo, nunca incluir segredos em exceções ou telemetry, zerar buffers antes de liberar, e evitar cópias intermediárias em strings imutáveis de linguagens de alto nível.

mlock() e VirtualLock() não cobrem todos os cenários (hibernação, captura de memória por processo privilegiado, cópias do compilador/JIT). A proteção é em camadas, não uma garantia absoluta; detalhes de cada sistema operacional são **ponto a confirmar** na documentação de plataforma.

### 4.4 Operação segura do ciclo de vida

Na criação, gera-se sal, nonce, Chave do Cofre e parâmetros; na abertura, deriva-se a Chave Mestra, desembrulha-se a Chave do Cofre e só então se autentica o corpo. A ordem importa: autenticar antes de interpretar evita exploração de analisadores com dados attacker-controlled.

A sincronização com estudos.local envia somente o blob cifrado. O servidor pode guardar metadados de transporte (tamanho, carimbo de tempo), mas não deve receber títulos de entradas ou domínios de sites se o objetivo for Conhecimento Zero real.

---

## 5. Autenticação web: sessões com estado, fichas sem estado e credenciais

### 5.1 Estado no servidor ou no cliente

Uma sessão com estado (stateful session) mantém o registro no servidor, normalmente em Redis ou banco de dados, e entrega ao navegador apenas um identificador guardado em pequeno arquivo de sessão (cookie), com atributos HttpOnly, Secure e SameSite. Uma ficha de acesso sem estado (stateless token) carrega as permissões dentro de si; o servidor apenas verifica a assinatura.

| Característica | Sessão com estado | Ficha sem estado |
| --- | --- | --- |
| Onde está o estado | Servidor (Redis/BD) | No próprio token (auto-contido) |
| Escalabilidade horizontal | Exige armazenamento compartilhado | Simples de replicar |
| Revogação imediata | Natural: apaga o registro | Difícil: exige lista de revogação ou TTL curto |
| Risco principal | Falsificação de requisição entre sites (CSRF) | Script entre sites (XSS) se guardado em LocalStorage |
| Adequação | Aplicações com logout imediato e baixa latência interna | APIs distribuídas com tokens de vida curta |

A escolha não é binária: é comum usar sessão com estado para o navegador e tokens de curta duração para serviços machine-to-machine. O que não é aceitável é misturar os dois sem uma política clara de revogação.

### 5.2 Anatomia e falhas do JWT

O JSON Web Token (JWT) é uma sequência cabeçalho.carga.assinatura, com cada parte em codificação Base64URL (Base64URL encoding). A carga útil (payload) contém alegações (claims) como iss, aud, exp e sub. Codificar em Base64URL não é cifrar: qualquer portador consegue ler o conteúdo com uma simples decodificação.

Três falhas históricas merecem atenção:

1. Ataque alg:none: o atacante troca o cabeçalho para indicar "sem assinatura" e remove a terceira parte. Implementações que aceitam o algoritmo escolhido pelo token validam nada.
2. Confusão de algoritmo (RS256 → HS256): o cabeçalho passa a pedir HMAC com SHA-256 (HS256), e o atacante assina usando como segredo a chave pública do servidor, que é dado público. A correção é fixar o algoritmo esperado no código, nunca no token.
3. Vazamento da carga: inserir senha, CPF ou dado sensível no token expõe esse dado a logs, proxies e ao próprio cliente.

A verificação correta inclui: lista de algoritmos permitidos, assinatura em tempo constante, validade de exp e nbf, correspondência exata de iss e aud, e chaves com identificadores (kid) resolve de forma segura.

### 5.3 Tokens Independentes de Plataforma como alternativa de versão fixa

Tokens Independentes de Plataforma (PASETO, Platform-Agnostic Security Tokens) eliminam a negociação de algoritmo no cabeçalho: o token declara a versão, e a versão fixa as primitivas. Na especificação da versão 4, v4.local usa XChaCha20 com chave derivada por BLAKE2b com chave (Ek de 32 bytes e nonce derivado n2 de 24 bytes) e BLAKE2b-MAC de 32 bytes sobre a codificação de autenticação prévia (PAE); v4.public usa Ed25519 sobre a mesma PAE.

A construção v4.local gera 32 bytes aleatórios n, separa chave de cifragem e chave de autenticação com constantes de domínio distintas ("paseto-encryption-key" e "paseto-auth-key-for-aead"), cifra a mensagem e autentica cabeçalho, n, ciphertext, rodapé (footer) e afirmação implícita. A comparação da etiqueta deve ser em tempo constante.

Isso resolve a confusão RS256→HS256 por construção: não existe campo "alg" para o atacante alterar, e chaves locais e assimétricas têm domínios separados. A troca é adotar uma biblioteca madura, pois a implementação manual de PAE e derivação é propensa a erro.

### 5.4 OAuth 2.0 com PKCE e o fluxo de código

A Prova de Chave para Troca de Código (PKCE, Proof Key for Code Exchange) protege aplicações públicas e móveis contra a interceptação do código de autorização. O cliente cria um verificador de código (code_verifier) aleatório de 43 a 128 caracteres do conjunto não reservado, calcula o desafio de código (code_challenge) = Base64URL(SHA256(ASCII(code_verifier))) no método S256 e envia apenas o desafio no início.

```
 Cliente em estudos.local                 Servidor de Autorização
 +------------------------+               +------------------------+
 | gerar code_verifier    |               |                        |
 | challenge = B64URL(    |               |                        |
 |   SHA256(verifier))    |               |                        |
 | gerar state aleatório  |               |                        |
 |---- /authorize --------+-------------->| validar redirect_uri   |
 |   challenge + state    |               | armazenar challenge    |
 |<--- 302 /callback -----+---------------+                        |
 |   code + state         |               |                        |
 | conferir state         |               |                        |
 |---- POST /token -------+-------------->| recalcular SHA256      |
 |   code + verifier      |               | do verifier recebido   |
 |<--- access_token ------+---------------+ emitir token           |
 +------------------------+               +------------------------+
```

O parâmetro state protege contra falsificação de requisição; o PKCE protege contra codes roubados por redirecionamento malicioso ou por outro aplicativo no dispositivo. O verificador viaja apenas ao endpoint de token, por TLS; um interceptador que tenha só o código não consegue trocá-lo.

O RFC 7636 define o mecanismo. A boa prática atual, registrada no RFC 9700, recomenda PKCE também para clientes confidenciais; o uso do método "plain" deve ser evitado. Detalhes de perfil por provedor de identidade são **ponto a confirmar** antes da integração.

### 5.5 TOTP e WebAuthn

A Senha de Uso Único Baseada em Tempo (TOTP, Time-Based One-Time Password) do RFC 6238 deriva da HOTP (HMAC-Based One-Time Password). O contador de passo é T = ⌊(UnixTime − T₀) ÷ X⌋, com T₀ = 0 e X = 30 segundos por padrão. O valor T é codificado em 8 bytes big-endian e usado como mensagem do HMAC-SHA1 com a chave compartilhada K.

O truncamento dinâmico (dynamic truncation) extrai o deslocamento dos 4 bits menos significativos do último byte do HMAC, lê 4 bytes a partir dali, zera o bit mais significativo e converte para inteiro de 31 bits; o código de 6 dígitos é esse inteiro mod 10⁶. A janela de aceitação costuma admitir ±1 passo para compensar relógios desalinhados.

TOTP é resistente a replay após expirar, mas não resiste a phishing em tempo real: um site falso pode repassar o código digitado. O servidor deve limitar tentativas e nunca aceitar o mesmo passo duas vezes para a mesma conta. O comprimento mínimo recomendado da chave compartilhada no RFC 6238 é **ponto a confirmar** na fonte primária.

A Autenticação Web (WebAuthn) e as passkeys (passkeys) dentro do FIDO2 invertem o modelo: o servidor guarda apenas a chave pública da credencial. No registro, o autenticador gera o par de chaves em hardware protegido (TPM, Secure Enclave, biometria) e assina a resposta; na autenticação, o servidor envia um desafio (challenge) e verifica a assinatura sobre authenticatorData concatenado com SHA-256(clientDataJSON).

A verificação precisa checar origem (origin) e RP ID, o desafio recebido, as flags de presença e verificação do usuário, e o contador de assinaturas quando disponível. Como a assinatura está ligada à origem legítima, um site de phishing não consegue reaproveitá-la — propriedade que TOTP e SMS não possuem.

A equivalência exata entre passkeys sincronizadas e credenciais ligadas a hardware, bem como a semântica de verificação do usuário entre provedores, é **ponto a confirmar** nas especificações e políticas atuais de cada plataforma.

---

## 6. TLS 1.3, Segredo Perfeito para Frente e Infraestrutura de Chaves Públicas

### 6.1 O aperto de mão de 1-RTT

O Transport Layer Security 1.3 (TLS 1.3, RFC 8446) compactou a negociação: o cliente já envia seu compartilhamento de chave (key share) no ClientHello, e o servidor responde com o dele no ServerHello. Depois disso, o resto do aperto de mão (handshake) trafega cifrado com chaves derivadas por HKDF (Função de Derivação de Chave baseada em HMAC).

```
   CLIENTE (estudos.local)                    SERVIDOR (estudos.local)
   +---------------------+                    +---------------------+
   | ClientHello         |                    |                     |
   |  versões, suítes    |                    |                     |
   |  key_share X25519   | -----------------> | escolhe parâmetros  |
   |                     |                    | key_share X25519    |
   |                     | <----------------- | ServerHello         |
   |   [cifrado a partir daqui]               |                     |
   |                     | <----------------- | EncryptedExtensions |
   |                     |                    | Certificate         |
   |  valida cadeia      |                    | CertificateVerify   |
   |  deriva tráfego     |                    | Finished            |
   | Finished            | -----------------> |                     |
   | Dados HTTP          | <----------------> | Dados HTTP          |
   +---------------------+                    +---------------------+
```

O servidor autentica-se com CertificateVerify (assinatura sobre o transcript do handshake) e Finished (MAC sobre o transcript); o cliente envia seu Finished por último. A autenticação mútua é opcional e acrescenta Certificate e CertificateVerify do cliente.

A versão 1.3 removeu modos antigos como CBC, RC4 e a troca de chaves RSA estática. A lista completa de algoritmos proibidos e as condições de negociação devem ser conferidas no RFC 8446: **ponto a confirmar** para a matriz de compatibilidade final.

### 6.2 ECDHE, X25519 e Sigilo Perfeito para Frente

A Troca de Chaves Diffie-Hellman Efêmera em Curva Elíptica (ECDHE, Elliptic Curve Diffie-Hellman Ephemeral) com X25519 gera um segredo compartilhado a partir de pares temporários descartados ao fim da sessão. O Sigilo Perfeito para Frente (PFS, Perfect Forward Secrecy) decorre disso: gravar o tráfego hoje e obter a chave privada do certificado anos depois não permite decifrar a gravação.

O material do ECDHE passa por HKDF-Extract e HKDF-Expand para produzir segredos distintos de handshake e de aplicação, nos dois sentidos da conexão. Essa separação evita que uma chave usada para proteger o próprio handshake seja reutilizada nos dados.

A retomada de sessão (resumption) com PSK reduz uma nova conexão a 1-RTT, e o modo 0-RTT envia dados antecipados. O dado 0-RTT não herda PFS e é reproduzível (replay) por quem captura a mensagem; aplicações só devem usá-lo para requisições idempotentes e com defesa de replay.

### 6.3 Cadeia X.509 e validação de confiança

Uma Infraestrutura de Chaves Públicas (PKI, Public Key Infrastructure) liga uma identidade a uma chave pública por meio de certificados X.509. A confiança é ancorada em uma autoridade raiz (Root CA) presente no repositório do sistema, que assina uma intermediária (Intermediate CA), que por sua vez assina o certificado folha (leaf) do servidor.

```
   [Root CA no trust store]
             | assina
             v
   [Intermediate CA]  --(pode ser revogada; mantém a raiz offline)
             | assina
             v
   [Leaf: estudios.local] -- chave pública + validade + SAN + usos
```

O cliente constrói o caminho, verifica cada assinatura, a validade temporal, o nome no SAN (Subject Alternative Name), restrições de uso de chave e a revogação por Lista de Revogação de Certificados (CRL) ou Protocolo de Estado Online de Certificados (OCSP), frequentemente com grampeamento (stapling).

Registros públicos de Transparência de Certificados (Certificate Transparency) ajudam a detectar emissão indevida, pois uma autoridade que emite para estudos.local deixa rastro auditável. Isso complementa, mas não substitui, a validação local da cadeia.

### 6.4 Fixação de chave e ataques homem-no-meio

A fixação de certificado (Certificate Pinning) grava no cliente o hash SHA-256 da chave pública — tecnicamente da estrutura SubjectPublicKeyInfo em DER — e recusa qualquer conexão cuja chave não coincida. Mesmo que uma autoridade válida seja comprometida e emita um certificado falso para estudos.local, o atacante não consegue o handshake sem a chave privada fixada.

Um ataque homem-no-meio (MitM, Man-in-the-Middle) bem-sucedido sem fixação normalmente envolve certificado emitido por CA confundida, proxy corporativo com raiz instalada ou falha de validação no cliente. A fixação deve manter pelo menos uma chave reserva, ou uma renew de certificado que troque a chave deixará o aplicativo inutilizável até atualização.

A fixação resolve o problema de confiança excessiva na cadeia, mas cria outro risco: se o atacante tiver acesso ao binário, pode substituir o pin. Por isso ela é defesa em profundidade, não substituto da validação X.509.

O status de depreciação da Fixação de Chave Pública HTTP (HPKP, HTTP Public Key Pinning) em navegadores e a política atual de cada loja de aplicativos são **ponto a confirmar** antes de recomendar fixação em uma plataforma específica.

---

## 7. Ameaças e contra-medidas (matriz)

### 7.1 Ataques ao material de senha

O primeiro grupo explora a fronteira entre a entropia gerada e o custo de testá-la offline. Força bruta, tabelas arco-íris e viés de módulo agem em escalas diferentes: o primeiro depende do espaço de busca, o segundo de sal reutilizado, o terceiro da qualidade do gerador. Nenhum deles é mitigado por ofuscação de código.

Resumos antigos agravam o quadro porque colisões conhecidas permitem substituir um arquivo por outro com o mesmo resumo. Já a reutilização de nonce não exige senha alguma: basta observar duas mensagens cifradas sob a mesma chave para comprometer a autenticação do modo GCM.

### 7.2 Ataques a tokens e fluxos de autorização

O segundo grupo ataca a confiança colocada em metadados. Um cabeçalho controlado pelo atacante muda o algoritmo esperado; uma carga em Base64URL é lida como se fosse cifrada; um código de autorização é interceptado antes da troca por token. Em todos os casos, a defesa vem de fixar previamente os parâmetros no verificador e de vincular cada etapa a um segredo efêmero.

TOTP e SMS falham de forma diferente: o código é curto e pode ser repassado em tempo real. WebAuthn reduz esse risco ao exigir que a assinatura esteja associada à origem legítima e a um desafio recente.

### 7.3 Ataques de rede e de execução

O terceiro grupo atua fora da aplicação: certificado fraudulento, proxy não autorizado, captura de dados 0-RTT e vazamento de segredos pela memória do processo. A defesa combina validação de cadeia, fixação de chave, recusa de early data não idempotente e higiene explícita de buffers.

A matriz a seguir reúne os quinze vetores e aponta a seção onde cada contra-medida foi detalhada. Ela deve ser lida como um mapa de cobertura, não como uma lista de tarefas concluídas.

| # | Ameaça | Vetor típico | Contra-medida principal | Onde tratar |
| --- | --- | --- | --- | --- |
| 1 | Força bruta offline | Arquivo de cofre roubado e testado em GPU | Entropia alta + Argon2id com sal único | Seções 1 e 3 |
| 2 | Viés de módulo | rand() % N com N que não divide 2ᴮ | L = 2ᴮ − (2ᴮ mod N) e rejeição | Seção 2 |
| 3 | Previsibilidade da semente | srand(time(NULL)) | CSPRNG do sistema operacional | Seção 2 |
| 4 | Colisão em resumo antigo | MD5/SHA-1 em assinatura | Proibir ambos em código novo | Seção 3 |
| 5 | Tabela arco-íris | Senhas com sal ausente ou reutilizado | Sal aleatório de 16 bytes por cofre | Seções 3 e 4 |
| 6 | Modificação de bits | ciphertext sem autenticação | AEAD com etiqueta de 16 bytes e AAD | Seção 4 |
| 7 | Reutilização de nonce | Duas mensagens sob mesma chave e nonce | Gerar nonce fresco; nunca reutilizar | Seção 4 |
| 8 | Vazamento de chave em RAM | swap, core dump, log de depuração | mlock/VirtualLock + sodium_memzero | Seção 4 |
| 9 | alg:none e confusão RS256→HS256 | Cabeçalho controlado pelo atacante | Fixar algoritmo no verificador; PASETO | Seção 5 |
| 10 | Leitura de dados sensíveis no token | Base64URL confundido com cifragem | Não colocar segredos na carga | Seção 5 |
| 11 | Roubo de código de autorização | Redirect URI malicioso em app público | PKCE S256 + state + URI exata | Seção 5 |
| 12 | Phishing de código TOTP | Site falso repassando o código | WebAuthn com verificação de origem | Seção 5 |
| 13 | Certificado fraudulento | CA comprometida ou proxy não autorizado | Cadeia X.509 + fixação SPKI | Seção 6 |
| 14 | Replay de dados 0-RTT | Captura e repetição do early data | Usar apenas requisições idempotentes | Seção 6 |
| 15 | Downgrade de versão do cofre | Alteração do campo de versão | Versão incluída no AAD da AEAD | Seção 4 |

### 7.4 Da matriz ao teste automatizado

A matriz não substitui testes: cada linha deve virar um caso de teste automatizado no CofraForge, especialmente as linhas 6, 7, 9 e 15, que falham silenciosamente quando a implementação está errada.

Para as linhas 6 e 15, o teste consiste em alterar um byte do cabeçalho ou da versão e confirmar que a AEAD rejeita o arquivo. Para a linha 7, basta forçar dois nonce iguais em um ambiente de teste e verificar que a biblioteca recusa a operação ou que o projeto detecta a colisão antes de cifrar.

Nos testes de tokens, inclua um cabeçalho com alg:none, outro com HS256 assinado pela chave pública e uma carga com dado sensível; todos devem ser recusados. O objetivo é transformar cada contra-medida em comportamento observável, não em comentário de código.

---

## 8. Verificação computacional e pendências

### 8.1 Código executado

Os resultados abaixo vieram de Python 3.13, com math, hashlib, hmac, struct, base64, datetime e sympy. O script foi executado em memória, sem gravar arquivos auxiliares. O núcleo das verificações:

```
import math, hashlib, hmac, struct, base64, datetime
import sympy as sp

for n in (10, 16, 26, 62, 94, 7776):
    print(n, math.log2(n))

def hotp(key, counter, digits=6):
    mac = hmac.new(key, struct.pack(">Q", counter), hashlib.sha1).digest()
    o = mac[-1] & 0x0f
    b = (mac[o] & 0x7f) << 24 | mac[o+1] << 16 | mac[o+2] << 8 | mac[o+3]
    return b % (10 ** digits), b, o, mac.hex()
```

### 8.2 Resultados reais obtidos

Entropias (bits por símbolo, exceto Diceware, bits por palavra):

- N = 10 → 3,321928; N = 16 → 4,000000; N = 26 → 4,700440
- N = 62 → 5,954196; N = 94 → 6,554589; N = 7776 → 12,924813
- L = 20, N = 94 → H = 131,091777 bits ≈ 131,1 bits
- Diceware com 4 palavras → 51,699250 bits ≈ 51,7 bits
- Diceware com 6 palavras → 77,548875 bits ≈ 77,5 bits

Busca a 10¹² tentativas/s (varredura completa; a espera média é a metade):

- 40 bits → 1,0995 × 10¹² combinações → 1,0995 s
- 51,699 bits → 3,6562 × 10¹⁵ combinações → 3,6562 × 10³ s
- 77,549 bits → 2,2107 × 10²³ combinações → 2,2107 × 10¹¹ s ≈ 7005,4 anos
- 131,092 bits → 2,9011 × 10³⁹ combinações → 2,9011 × 10²⁷ s ≈ 9,1929 × 10¹⁹ anos

Viés de módulo:

- B = 8, N = 94: 256 mod 94 = 68; L = 188; aceitação = 0,734375
- sem correção: índices 0 a 67 com 0,011719 e 68 a 93 com 0,007812; razão 1,5000
- B = 16, N = 7776: L = 62208; aceitação = 0,94921875; 3328 valores descartados

Aritmética modular (Pequeno Teorema de Fermat):

- p = 1000003, verificado primo por sympy.isprime → True
- a = 424242; pow(a, p − 1, p) = 1
- inverso modular: 17⁻¹ mod 4127 = 3156; (17 × 3156) mod 4127 = 1

TOTP HMAC-SHA1 com semente conhecida (ASCII "12345678901234567890", vetor do RFC 6238):

- UnixTime 59 → T = 1 → 8 dígitos 94287082; 6 dígitos 287082; deslocamento 11
- UnixTime 1111111109 → T = 37037036 → 07081804 / 081804
- UnixTime 1234567890 → T = 41152263 → 89005924 / 005924
- UnixTime 20000000000 → T = 666666666 → 65353130 / 353130

TOTP com semente inédita:

- semente = "CofraForge-2026-estudos.local"; UnixTime 1795700000 (2026-11-26T13:33:20+00:00)
- T = ⌊1795700000 ÷ 30⌋ = 59856666; HMAC = c04196c4026a7ce0c2ae7aea87a0a5ad5f421c77
- deslocamento = 7; inteiro de 31 bits = 1623371386; código de 6 dígitos = 371386

Fixação de chave (valor sintético, não uma chave real):

- bytes simulados: "estudos.local|CofraForge|leaf|SPKI-sintetico-v1|2026"
- SHA-256 hex: 3e312ee94b95a407361e1d97a83a6b393ae6a084c766c03e09356b3c79a91160
- SHA-256 em Base64 (formato de pin): PjEu6UuVpAc2Hh2XqDprOTrmoITHZsA+CTVrPHmpEWA=
- resumo de referência: SHA-256("CofraForge") = afb58510e4e7820b5c0b2f8d8ae8a1eab2356f2783c2ab4b6bcafd0b34fec7de

O pin acima é demonstrativo: uma fixação real hash a codificação DER da SubjectPublicKeyInfo extraída do certificado, não uma frase escolhida à mão. O comando de extração com OpenSSL não foi executado nesta sessão: **ponto a confirmar**.

### 8.3 Limites do que foi verificado

Os cálculos numéricos, o HMAC e os hashes foram executados localmente. Não foram executados: Argon2id (módulo ausente), handshake TLS real, geração de certificado X.509 e fluxo OAuth completo. Afirmações sobre RFC 9106 e PASETO v4 foram conferidas nos textos das especificações; afirmações sobre comportamento de versões específicas de sistemas operacionais permanecem sinalizadas no corpo do documento.

Nenhuma estimativa de tempo de quebra inclui erros de implementação, vazamento por canal lateral ou reutilização de senha entre serviços — fatores que costumam dominar incidentes reais.

### 8.4 Pendências para o diário

Consolidando os marcadores espalhados pelo texto, registrar como pendências: (a) versões mínimas de kernel/glibc para getrandom(2) e arc4random_buf(); (b) limites exatos de mensagem por nonce em GCM e XChaCha20 na biblioteca escolhida; (c) garantias de mlock()/VirtualLock() por plataforma; (d) vetor de tag Argon2id executado com biblioteca real; (e) número mínimo de iterações na NIST SP 800-132; (f) tamanho mínimo da chave TOTP no RFC 6238; (g) comportamento de passkeys sincronizadas por provedor; (h) lista completa de algoritmos removidos no TLS 1.3; (i) status atual do HPKP e políticas de fixação por loja; (j) extração real da SubjectPublicKeyInfo para o pin de estudos.local; (k) perfil de PKCE exigido por cada provedor OAuth 2.0.

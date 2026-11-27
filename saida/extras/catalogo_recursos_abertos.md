# Catálogo de recursos abertos e gratuitos do FORGE

Este catálogo reúne 37 recursos públicos organizados por área. Nenhum foi usado como dependência para gerar o ecossistema: as entradas são complementos para aprofundar, conferir ou praticar depois que o material local do FORGE já foi estudado.

Critérios de inclusão adotados:

1. O recurso precisa estar em domínio público conhecido, em projeto de código aberto ou em programa educacional gratuito.
2. A condição de uso precisa poder ser resumida em uma frase; quando há dúvida, o texto manda conferir a página oficial.
3. O recurso precisa ter ligação clara com uma das seis áreas do FORGE.
4. Não entram cursos pagos, assinaturas, serviços que exigem cartão ou APIs com cobrança por chamada.
5. Nenhum trecho de livro ou PDF foi copiado para este catálogo; as descrições são autorais.
6. As URLs são localizadores públicos estáveis. Conteúdo específico pode mudar de endereço; o domínio é o que importa.

Cada entrada traz nome, URL, licença ou condição, cobertura e uma forma concreta de uso conjunto com o FORGE.

---

## 1. Matemática (Mathematics)

Documentação de bibliotecas simbólicas, referências de constantes e conjuntos de problemas. Use depois do compêndio local, nunca no lugar dele.

| Recurso | URL pública | Licença ou condição de uso | O que cobre | Como usar junto com o FORGE |
| --- | --- | --- | --- | --- |
| SymPy | https://www.sympy.org/ | BSD de 3 cláusulas, código aberto | Álgebra simbólica, derivadas, integrais, matrizes e aritmética modular | Conferir as fórmulas da folha local com o auditor `saida/codigo/referencia_04_auditor_sympy.py` |
| GNU Octave | https://www.gnu.org/software/octave/ | GPL, software livre | Cálculo numérico, matrizes e gráficos | Repetir cálculos do compêndio em outra ferramenta e comparar arredondamentos |
| SageMath | https://www.sagemath.org/ | GPL, software livre | Matemática computacional ampla, incluindo teoria dos números | Explorar primos e congruências da gênese das descobertas E e J |
| NIST DLMF | https://dlmf.nist.gov/ | Domínio público do governo dos Estados Unidos | Funções especiais, identidades e referências analíticas | Checar afirmações sobre logaritmos e funções elementares sem depender de forum |
| OpenStax Matemática | https://openstax.org/subjects/math | CC BY 4.0; basta atribuição | Pré-cálculo, cálculo, estatística e álgebra | Escolher exercícios extras de um tópico que o banco local ainda não cobre |
| Project Euler | https://projecteuler.net/ | Uso gratuito e pessoal; ver regras do site | Problemas que misturam matemática e programação | Criar uma ponte entre o banco de exercícios e scripts Python do FORGE |

---

## 2. Linguagem C (C programming language)

Referências de linguagem, compiladores e práticas seguras. O ambiente local já compila com MinGW; estes recursos servem para explicar avisos e comportamentos.

| Recurso | URL pública | Licença ou condição de uso | O que cobre | Como usar junto com o FORGE |
| --- | --- | --- | --- | --- |
| cppreference C | https://en.cppreference.com/w/c | CC BY-SA 3.0 e GFDL, conforme a página | Sintaxe, biblioteca padrão e comportamento de funções | Consultar a assinatura exata de malloc, realloc e free ao ler o buffer seguro |
| GNU C Library Manual | https://www.gnu.org/software/libc/manual/ | Documentação livre da GNU; ver aviso na página | Biblioteca C, alocação, threads e funções de sistema | Entender as diferenças entre POSIX e Windows no servidor TCP |
| GCC Online Documentation | https://gcc.gnu.org/onlinedocs/ | Documentação livre da GNU | Flags de compilação, avisos e diagnósticos | Interpretar `-Wall -Wextra -Werror -pedantic` registrados no log local |
| SEI CERT C Coding Standard | https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard | Acesso livre; ver condições do SEI | Regras para evitar estouro, use after free e comportamento indefinido | Transformar cada regra em item de revisão dos códigos de referência |
| MinGW | https://www.mingw.org/ | Ferramentas gratuitas; licenças por componente | Toolchain GCC para Windows | Comparar a versão 6.3 instalada com versões mais recentes e o uso de C11 |
| Google Sanitizers | https://github.com/google/sanitizers | Apache 2.0 na maior parte dos componentes | AddressSanitizer, UndefinedBehaviorSanitizer e ThreadSanitizer | Propor uma extensão futura ao script de compilação, sem mudar o pipeline atual |

---

## 3. Redes (Networks)

Especificações, documentação de protocolos e ferramentas de observação. Combine com os mapas 5 e 6 do arquivo de mapas conceituais.

| Recurso | URL pública | Licença ou condição de uso | O que cobre | Como usar junto com o FORGE |
| --- | --- | --- | --- | --- |
| RFC Editor | https://www.rfc-editor.org/ | Acesso livre; direitos sob regras da IETF Trust | Especificações de TCP, IP, DNS, TLS e TOTP | Localizar o RFC citado em cada seção da arquitetura criptográfica |
| W3C Technical Reports | https://www.w3.org/TR/ | Documentos públicos; licença W3C conforme o texto | Padrões web, incluindo HTTP e WebAuthn | Conferir termos de origem e de token antes de escrever testes de autenticação |
| Linux Kernel Documentation | https://www.kernel.org/doc/html/latest/ | Documentação livre; licença por arquivo | Rede no kernel, sockets, getrandom e pilha TCP/IP | Entender a diferença entre a API do Windows e a do Linux no código C |
| Wireshark | https://www.wireshark.org/ | GPL e licenças complementares, software livre | Captura e análise de quadros, pacotes e segmentos | Observar um handshake TCP real e comparar com o mapa de camadas |
| tcpdump | https://www.tcpdump.org/ | Licença tipo BSD, software livre | Captura de pacotes por linha de comando | Verificar TTL e endereços em uma consulta DNS local |
| IANA Address Registry | https://www.iana.org/addressing/ | Dados públicos mantidos pela IANA | Blocos de endereços IPv4 e IPv6 | Escolher faixas fictícias realistas para exercícios de CIDR |

---

## 4. Engenharia de Software (Software Engineering)

Documentação de ferramentas, práticas de teste e segurança. O foco é comportamento observável, não teoria abstrata.

| Recurso | URL pública | Licença ou condição de uso | O que cobre | Como usar junto com o FORGE |
| --- | --- | --- | --- | --- |
| Git Documentation | https://git-scm.com/doc | Documentação livre do projeto Git | Comandos, branches, merge e histórico | Organizar o trabalho por fases sem sobrescrever arquivos de outras fases |
| GitHub Docs | https://docs.github.com/ | Documentação pública; condições no rodapé | Issues, pull requests, ações e revisão | Transformar pendências do cofre em itens rastreáveis de teste |
| OWASP Top 10 | https://owasp.org/www-project-top-ten/ | Conteúdo aberto; conferir licença na página | Principais riscos de aplicações web | Classificar cada ameaça da matriz do cofre em uma categoria conhecida |
| NIST SP 800 Series | https://csrc.nist.gov/publications/sp800 | Domínio público do governo dos Estados Unidos | Criptografia, identidade e segurança de sistemas | Checar recomendações de derivação de chave e autenticação |
| Python Documentation | https://docs.python.org/3/ | Licença da Python Software Foundation | Biblioteca padrão, ipaddress, hashlib e hmac | Validar a calculadora CIDR e o código TOTP sem instalar pacotes extras |
| Agile Alliance | https://www.agilealliance.org/ | Conteúdo gratuito; ver condições por item | Práticas de entrega incremental e retrospectiva | Converter as rotinas de estudo em iterações curtas com critério de conclusão |

---

## 5. Ciência do Estudo (Learning Science)

Leituras de apoio para a Fase 5. Resumos e artigos de acesso aberto ajudam a separar evidência de opinião.

| Recurso | URL pública | Licença ou condição de uso | O que cobre | Como usar junto com o FORGE |
| --- | --- | --- | --- | --- |
| OpenStax Psychology | https://openstax.org/details/books/psychology-2e | CC BY 4.0 | Memória, cognição, motivação e desenvolvimento | Conferir vocabulário de metacognição e carga cognitiva |
| PubMed | https://pubmed.ncbi.nlm.nih.gov/ | Resumos gratuitos; acesso ao texto completo varia | Literatura biomédica e psicológica indexada | Localizar resumos citados na bibliografia local antes de generalizar uma técnica |
| DOAJ | https://doaj.org/ | Periódicos de acesso aberto; licença por artigo | Artigos revisados por pares em acesso aberto | Encontrar estudos recentes sobre repetição espaçada sem paywall |
| Anki | https://apps.ankiweb.net/ | AGPL 3.0 para o cliente de desktop | Cartões de memória e agendamento de revisões | Importar `saida/04_exercicios/anki/forge_matematica.csv` e respeitar os intervalos 1, 3, 7, 16 e 35 |
| Zotero | https://www.zotero.org/ | AGPL 3.0, software livre | Gestão de referências e notas | Organizar a bibliografia comentada da Fase 5 sem planos pagos |
| The Learning Scientists | https://www.learningscientists.org/ | Site gratuito; ver direitos por material | Recuperação espaçada, intercalação e elaboração | Comparar a linguagem do site com o vocabulário usado em `metodologias.md` |

---

## 6. Criptografia (Cryptography)

Especificações, bibliotecas e guias de configuração. Use para verificar o que o documento local marcou como ponto a confirmar.

| Recurso | URL pública | Licença ou condição de uso | O que cobre | Como usar junto com o FORGE |
| --- | --- | --- | --- | --- |
| OpenSSL Documentation | https://docs.openssl.org/ | Apache 2.0 na versão 3; ver notas por versão | TLS, resumos, cifras e comandos de certificado | Checar a sintaxe para extrair a SubjectPublicKeyInfo de um certificado de teste |
| libsodium Documentation | https://doc.libsodium.org/ | Licença ISC, equivalente a permissiva | AEAD, KDF, nonce e limpeza segura de memória | Comparar `sodium_memzero` com a higienização feita no buffer seguro |
| RFC 9106 | https://www.rfc-editor.org/rfc/rfc9106.html | Acesso livre; regras da IETF Trust | Argon2 e Argon2id, parâmetros e vetores | Confirmar m, t, p, tamanho de sal e de etiqueta usados no cofre fictício |
| OWASP Password Storage Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html | CC BY-SA, conforme o site | Armazenamento de senhas, sal e escolha de KDF | Revisar a preferência Argon2id, scrypt, PBKDF2 do documento local |
| Let's Encrypt Documentation | https://letsencrypt.org/docs/ | Serviço e documentação gratuitos | Certificados X.509 automatizados e renovação | Simular o ciclo de renovação que exige chave reserva na fixação |
| age | https://age-encryption.org/ | Formato e implementações de código aberto | Cifragem de arquivos com chaves e recipientes | Comparar o formato do cofre CofraForge com um contêiner simples já auditado |
| NIST FIPS 180-4 | https://csrc.nist.gov/publications/detail/fips/180/4/final | Domínio público do governo dos Estados Unidos | SHA-1, SHA-2 e famílias de funções de resumo | Verificar por que resumos rápidos não servem para guardar senhas |

---

## Verificação local

As URLs foram selecionadas por pertencerem a domínios oficiais conhecidos e estáveis, como kernel.org, docs.python.org, sympy.org, openssl.org, rfc-editor.org (IETF), gnu.org, nist.gov, owasp.org e openstax.org. Isso não significa que cada página foi aberta durante a escrita: nenhuma rede foi consultada e nenhum download foi executado para produzir este catálogo.

O ecossistema FORGE funciona 100% offline. Os resumos, o compêndio, o banco de exercícios, os simulados, o código de referência, os logs e os materiais da Fase 6 foram gerados com ferramentas locais e textos já presentes no repositório. Os recursos acima são complementos, não dependências:

- Se uma URL mudar, o estudo continua com os arquivos de `saida/`.
- Se uma licença mudar, basta deixar de usar aquele recurso; nada no FORGE deixa de funcionar.
- Se o leitor estiver sem internet, todas as rotas de leitura continuam executáveis.
- Nenhuma entrada exige API paga, chave de serviço ou cadastro com cobrança.
- Onde a condição de uso não é universal, o texto orienta conferir a página oficial em vez de presumir permissão.

Para verificar localmente o que já existe, comece por `saida/00_inventario/ferramentas.md`, que registra o ambiente real usado na geração do projeto. Depois consulte `saida/logs/compilacao.md` para ver o que foi efetivamente compilado e executado.

---

## Ferramentas já presentes no ecossistema

Os dados abaixo vieram de `saida/00_inventario/ferramentas.md`, que registra a auditoria do ambiente em 2026-11-26T20:21:52-03:00 em Windows 10 AMD64, com diretório base `./`.

| Ferramenta | Caminho ou versão registrada | Função real no pipeline |
| --- | --- | --- |
| Python | Python 3.13.15, sem caminho fixo registrado no inventário | Interpretador dos scripts em `saida/scripts/` e dos códigos de referência em `saida/codigo/` |
| SymPy | Módulo `sympy` DISPONÍVEL | Validação simbólica de fórmulas; usada em `saida/codigo/referencia_04_auditor_sympy.py` e na verificação de fórmulas |
| GCC/MinGW | `C:\MinGW\bin\gcc.EXE` — gcc.exe (MinGW.org GCC-6.3.0-1) 6.3.0 | Compilação C com `-Wall -Wextra -Werror -pedantic`; o teste com `-std=c17` falhou nesta versão, então os códigos usam `-std=c11` |
| reportlab | Módulo `reportlab` DISPONÍVEL | Geração dos PDFs mestres, substituindo pandoc, xelatex e tectonic |
| RapidOCR | Módulo `rapidocr_onnxruntime` DISPONÍVEL | OCR das capas do PDF "como estudei mat", com `cv2` no pré-processamento e `PIL` na manipulação de imagens |

Leituras complementares registradas no mesmo inventário: `pypdf` para contagem de páginas e extração de texto, `fitz` (PyMuPDF) para renderização e extração estruturada e `numpy` para validação numérica e estatística.

Ausências registradas e já contornadas: `pdftotext`, `pdfinfo`, `ocrmypdf`, `tesseract`, `pandoc`, `xelatex`, `tectonic`, `clang` e `valgrind`. Nenhuma delas foi substituída por serviço externo pago; as soluções são módulos Python locais e textos OCR distribuídos junto do corpus.

---

## Como combinar catálogo e rotas

1. Na Rota 1, use apenas OpenStax e The Learning Scientists se quiser uma segunda explicação de recuperação espaçada.
2. Na Rota 3, use SymPy e NIST DLMF para confirmar identidades antes de alterar qualquer fórmula local.
3. Na Rota 5, use cppreference e RFC Editor para decifrar avisos de compilação e camadas de protocolo.
4. Na Rota 6, use RFC 9106, libsodium e OWASP para transformar pontos a confirmar em verificações com fonte primária.
5. Em qualquer rota, anote no caderno de erros qual recurso externo foi consultado e por quê.
6. Nunca substitua a verificação local por uma citação externa: o critério de conclusão continua sendo comportamento observável no repositório.

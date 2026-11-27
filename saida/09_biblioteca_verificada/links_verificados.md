# Verificação de links do catálogo FORGE

- Data da checagem: **2026-11-27**
- Método: Python urllib.request GET (User-Agent FORGE-LinkAudit/1.0), timeout 20s, redirecionamentos seguidos
- Entradas no catálogo: **73**; URLs únicos: **57**
- URLs com HTTP 200: **55/57**
- Entradas com HTTP 200: **57** (delas, **55** marcadas como gratuitas)
- `free: false` com URL 200 significa apenas que o link responde; não implica acesso aberto.
- Status diferente de 200 (ou vazio) está registrado com o erro exato; não é contado como verificado.

## Por área

| Área | Entradas | HTTP 200 | HTTP 200 e gratuitas |
| --- | ---: | ---: | ---: |
| Algoritmos | 3 | 1 | 1 |
| Algoritmos/C/Linguagens | 5 | 5 | 5 |
| Aprendizagem | 4 | 2 | 1 |
| Arquitetura/SO | 5 | 5 | 5 |
| C | 6 | 2 | 2 |
| Cálculo | 5 | 5 | 5 |
| Engenharia | 5 | 3 | 3 |
| IA/ML | 5 | 5 | 5 |
| Linux | 5 | 5 | 4 |
| Matemática | 19 | 14 | 14 |
| Redes | 6 | 5 | 5 |
| Redes/Cripto | 5 | 5 | 5 |

## Meta FORGE 7.0 (6 categorias)

As seis categorias da curadoria verificada: Matemática (14), Cálculo (5), Algoritmos/C/Linguagens (5), Arquitetura/SO (5), Redes/Cripto (5), IA/ML (5).
**Total: 39 recursos com HTTP 200** (meta: pelo menos 30).

Entradas sem URL são do catálogo legado e ficam fora da verificação HTTP;
isso está registrado como `sem resposta`, nunca como 200.

## Detalhe por recurso

| Título | Área | Acesso no catálogo | Status | URL | Destino final / erro |
| --- | --- | --- | ---: | --- | --- |
| OpenStax Prealgebra / Elementary Algebra / College Algebra | Matemática | gratuito | 200 | https://openstax.org/subjects/math | — |
| OpenStax Algebra and Trigonometry 2e | Matemática | gratuito | 200 | https://openstax.org/details/books/algebra-and-trigonometry-2e | — |
| OpenStax Precalculus 2e | Matemática | gratuito | 200 | https://openstax.org/details/books/precalculus-2e | — |
| A Matemática do Ensino Médio — SBM | Matemática | não gratuito | sem resposta |  | URL ausente |
| OpenStax Calculus, Volumes 1–3 | Matemática | gratuito | 200 | https://openstax.org/subjects/math | — |
| MIT OpenCourseWare — 18.01SC Single Variable Calculus | Matemática | gratuito | 200 | https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/ | — |
| MIT OpenCourseWare — 18.02SC Multivariable Calculus | Matemática | gratuito | 200 | https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/ | — |
| MIT OpenCourseWare — 18.03SC Differential Equations | Matemática | gratuito | 200 | https://ocw.mit.edu/courses/18-03sc-differential-equations-fall-2011/ | — |
| MIT OpenCourseWare — 18.06SC Linear Algebra | Matemática | gratuito | 200 | https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/ | — |
| Calculus | Matemática | não gratuito | sem resposta |  | URL ausente |
| Calculus | Matemática | não gratuito | sem resposta |  | URL ausente |
| Mathematics for Computer Science | Matemática | gratuito | 200 | https://courses.csail.mit.edu/6.042/spring18/mcs.pdf | — |
| Concrete Mathematics | Matemática | não gratuito | sem resposta |  | URL ausente |
| How to Prove It | Matemática | não gratuito | sem resposta |  | URL ausente |
| C Programming: A Modern Approach | C | não gratuito | sem resposta |  | URL ausente |
| Beej's Guide to C Programming | C | gratuito | 200 | https://beej.us/guide/bgc/ | — |
| GNU C Language Introduction and Reference Manual | C | gratuito | 200 | https://www.gnu.org/software/c-intro-and-ref/ | — |
| Effective C | C | não gratuito | sem resposta |  | URL ausente |
| Modern C | C | não gratuito | sem resposta |  | URL ausente |
| Computer Systems: A Programmer's Perspective (CS:APP) | C | não gratuito | sem resposta |  | URL ausente |
| Introduction to Algorithms | Algoritmos | não gratuito | sem resposta |  | URL ausente |
| The Algorithm Design Manual | Algoritmos | não gratuito | sem resposta |  | URL ausente |
| Open Data Structures | Algoritmos | gratuito | 200 | https://opendatastructures.org/ | — |
| Computer Networking: A Top-Down Approach | Redes | não gratuito | sem resposta |  | URL ausente |
| An Introduction to Computer Networks | Redes | gratuito | 200 | https://intronetworks.cs.luc.edu/ | — |
| Computer Networks: A Systems Approach | Redes | gratuito | 200 | https://book.systemsapproach.org/ | — |
| Stanford CS144 — Introduction to Computer Networking | Redes | gratuito | 200 | https://cs144.github.io/ | — |
| Beej's Guide to Network Programming | Redes | gratuito | 200 | https://beej.us/guide/bgnet/ | — |
| Wireshark Documentation | Redes | gratuito | 200 | https://www.wireshark.org/docs/ | — |
| The Linux Command Line | Linux | gratuito | 200 | https://linuxcommand.org/tlcl.php | — |
| Operating Systems: Three Easy Pieces (OSTEP) | Linux | gratuito | 200 | https://pages.cs.wisc.edu/~remzi/OSTEP/ | — |
| The Linux Programming Interface | Linux | não gratuito | 200 | https://man7.org/linux/man-pages/ | — |
| Linux man-pages | Linux | gratuito | 200 | https://man7.org/linux/man-pages/ | — |
| Linux Kernel Documentation | Linux | gratuito | 200 | https://docs.kernel.org/ | — |
| Pro Git | Engenharia | gratuito | 200 | https://git-scm.com/book/pt-br/v2 | — |
| Software Engineering at Google | Engenharia | gratuito | 200 | https://abseil.io/resources/swe-book | — |
| The Architecture of Open Source Applications | Engenharia | gratuito | 200 | https://aosabook.org/ | — |
| Code Complete | Engenharia | não gratuito | sem resposta |  | URL ausente |
| Designing Data-Intensive Applications | Engenharia | não gratuito | sem resposta |  | URL ausente |
| Improving Students' Learning With Effective Learning Techniques | Aprendizagem | não gratuito | 403 | https://doi.org/10.1177/1529100612453266 | HTTPError Forbidden |
| Test-Enhanced Learning | Aprendizagem | não gratuito | 403 | https://doi.org/10.1111/j.1467-9280.2006.01693.x | HTTPError Forbidden |
| The science of effective learning with spacing and retrieval practice | Aprendizagem | não gratuito | 200 | https://www.nature.com/articles/s44159-022-00089-1 | — |
| Anki Manual e FSRS | Aprendizagem | gratuito | 200 | https://docs.ankiweb.net/ | — |
| Khan Academy — Matemática | Matemática | gratuito | 200 | https://www.khanacademy.org/math | — |
| 3Blue1Brown — Visões geométricas da matemática | Matemática | gratuito | 200 | https://www.3blue1brown.com/ | — |
| NIST Digital Library of Mathematical Functions (DLMF) | Matemática | gratuito | 200 | https://dlmf.nist.gov/ | — |
| OpenStax Elementary Algebra 2e | Matemática | gratuito | 200 | https://openstax.org/details/books/elementary-algebra-2e | — |
| OpenStax Introductory Statistics 2e | Matemática | gratuito | 200 | https://openstax.org/details/books/introductory-statistics | https://openstax.org/details/books/introductory-statistics-2e |
| OpenStax Calculus Volume 1 | Cálculo | gratuito | 200 | https://openstax.org/details/books/calculus-volume-1 | — |
| OpenStax Calculus Volume 2 | Cálculo | gratuito | 200 | https://openstax.org/details/books/calculus-volume-2 | — |
| OpenStax Calculus Volume 3 | Cálculo | gratuito | 200 | https://openstax.org/details/books/calculus-volume-3 | — |
| 3Blue1Brown — Essence of Calculus | Cálculo | gratuito | 200 | https://www.3blue1brown.com/topics/calculus | https://www.3blue1brown.com/?topic=calculus |
| Khan Academy — Differential Calculus | Cálculo | gratuito | 200 | https://www.khanacademy.org/math/differential-calculus | — |
| Exercism — Trilha C | Algoritmos/C/Linguagens | gratuito | 200 | https://exercism.org/tracks/c | — |
| Compiler Explorer (Godbolt) | Algoritmos/C/Linguagens | gratuito | 200 | https://godbolt.org/ | — |
| MIT OpenCourseWare — 6.006 Introduction to Algorithms | Algoritmos/C/Linguagens | gratuito | 200 | https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/ | — |
| MIT OpenCourseWare — 6.046J Design and Analysis of Algorithms | Algoritmos/C/Linguagens | gratuito | 200 | https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/ | — |
| SEI CERT C Coding Standard | Algoritmos/C/Linguagens | gratuito | 200 | https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard | https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/ |
| MIT OpenCourseWare — 6.828 Operating System Engineering | Arquitetura/SO | gratuito | 200 | https://ocw.mit.edu/courses/6-828-operating-system-engineering-fall-2012/ | — |
| CS:APP — site oficial e materiais de apoio | Arquitetura/SO | gratuito | 200 | https://csapp.cs.cmu.edu/ | — |
| MIT OpenCourseWare — 6.033 Computer Systems Engineering | Arquitetura/SO | gratuito | 200 | https://ocw.mit.edu/courses/6-033-computer-system-engineering-spring-2018/ | — |
| Linux Kernel Documentation (latest) | Arquitetura/SO | gratuito | 200 | https://www.kernel.org/doc/html/latest/ | — |
| TLDP — Linux Filesystem Hierarchy | Arquitetura/SO | gratuito | 200 | https://tldp.org/LDP/Linux-Filesystem-Hierarchy/html/ | — |
| IETF RFC 793 — Transmission Control Protocol | Redes/Cripto | gratuito | 200 | https://www.rfc-editor.org/rfc/rfc793 | https://www.rfc-editor.org/info/rfc793/ |
| IETF RFC 8259 — JSON | Redes/Cripto | gratuito | 200 | https://www.rfc-editor.org/rfc/rfc8259 | https://www.rfc-editor.org/info/rfc8259/ |
| NIST FIPS 180-4 — Secure Hash Standard | Redes/Cripto | gratuito | 200 | https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf | — |
| NIST SP 800-90Ar1 — Geradores de números aleatórios | Redes/Cripto | gratuito | 200 | https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-90Ar1.pdf | — |
| OpenSSL Documentation | Redes/Cripto | gratuito | 200 | https://docs.openssl.org/master/ | — |
| fast.ai — Deep Learning prático | IA/ML | gratuito | 200 | https://www.fast.ai/ | — |
| Dive into Deep Learning (D2L.ai) | IA/ML | gratuito | 200 | https://d2l.ai/ | — |
| PyTorch — documentação estável | IA/ML | gratuito | 200 | https://docs.pytorch.org/docs/stable/index.html | — |
| TensorFlow — Learn | IA/ML | gratuito | 200 | https://www.tensorflow.org/learn | — |
| scikit-learn — documentação estável | IA/ML | gratuito | 200 | https://scikit-learn.org/stable/ | — |

## Não verificados (sem HTTP 200)

- **A Matemática do Ensino Médio — SBM** — `` — None: URL ausente
- **Calculus** — `` — None: URL ausente
- **Calculus** — `` — None: URL ausente
- **Concrete Mathematics** — `` — None: URL ausente
- **How to Prove It** — `` — None: URL ausente
- **C Programming: A Modern Approach** — `` — None: URL ausente
- **Effective C** — `` — None: URL ausente
- **Modern C** — `` — None: URL ausente
- **Computer Systems: A Programmer's Perspective (CS:APP)** — `` — None: URL ausente
- **Introduction to Algorithms** — `` — None: URL ausente
- **The Algorithm Design Manual** — `` — None: URL ausente
- **Computer Networking: A Top-Down Approach** — `` — None: URL ausente
- **Code Complete** — `` — None: URL ausente
- **Designing Data-Intensive Applications** — `` — None: URL ausente
- **Improving Students' Learning With Effective Learning Techniques** — `https://doi.org/10.1177/1529100612453266` — 403: HTTPError Forbidden
- **Test-Enhanced Learning** — `https://doi.org/10.1111/j.1467-9280.2006.01693.x` — 403: HTTPError Forbidden

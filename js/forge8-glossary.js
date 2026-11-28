/* ============================================================
   FORGE 8.0 — glossário local para micro-cards contextuais.
   Cada explicação tem no máximo duas linhas curtas, em português
   direto, sem jargão não explicado. Zero rede, zero dependência.
   ============================================================ */

(function () {
  "use strict";

  const GLOSSARY = {
    "SM-2": "É o algoritmo que calcula o dia exato em que você deve revisar uma matéria para não esquecê-la.",
    "Feynman": "É o teste em que você ensina o conceito com as próprias palavras, sem olhar a fonte.",
    "CIDR": "É a forma curta de escrever um bloco de IPs, como 192.168.0.0/24.",
    "CSPRNG": "É um gerador de números aleatórios seguro o bastante para senhas e chaves criptográficas.",
    "Peano": "Peano criou regras simples para construir os números naturais a partir do zero e do sucessor.",
    "LCG": "É uma fórmula que gera uma sequência de números previsíveis a partir de uma semente.",
    "FNV-1a": "É uma função que transforma um texto em um número curto e estável para ordenar revisões.",
    "SAT": "O problema booleano satisfatível: decidir se existe uma atribuição que torna uma fórmula verdadeira.",
    "AEAD": "É uma cifragem que protege ao mesmo tempo o segredo e a integridade da mensagem.",
    "Argon2id": "É uma função que torna senhas caras de adivinhar, mesmo com hardware poderoso.",
    "TLS": "É o protocolo que cria um canal privado e verificado entre seu navegador e um site.",
    "RSA": "É um método de cifrar e assinar usando um par de chaves: uma pública e uma secreta.",
    "SHA-256": "É uma função que gera um resumo de 256 bits de um arquivo; mudar um bit muda tudo.",
    "x86-64": "É a linguagem de baixo nível usada pela maioria dos processadores de computador.",
    "ARM64": "É a linguagem de baixo nível dos processadores de celulares e servidores eficientes.",
    "RISC-V": "É uma arquitetura de processador aberta, com um conjunto de instruções simples.",
    "RAM": "É a memória temporária onde o computador guarda o que está usando agora.",
    "Cache": "É uma cópia próxima e rápida de dados usados com frequência.",
    "SWR": "É a estratégia de responder com a cópia salva e atualizar em segundo plano.",
    "PWA": "É um site que pode ser instalado e continuar funcionando sem internet.",
    "Service Worker": "É um programa que roda em segundo plano para guardar arquivos e funcionar offline.",
    "CLS": "É a medida de quanto a página pula durante o carregamento; o alvo é zero.",
    "WCAG": "São regras internacionais para tornar páginas usáveis por todas as pessoas.",
    "axe-core": "É a ferramenta que verifica automaticamente se a página segue as regras de acessibilidade.",
    "Lighthouse": "É a ferramenta do Chrome que mede velocidade, acessibilidade e boas práticas.",
    "KaTeX": "É a biblioteca local que desenha fórmulas matemáticas dentro da página.",
    "PDF.js": "É a biblioteca local que abre PDFs dentro do navegador, sem enviar arquivos para fora.",
    "Combinatória": "É a área da matemática que conta formas de escolher e organizar sem listar tudo.",
    "Autovalor": "É o fator pelo qual um vetor apenas muda de tamanho quando uma matriz o transforma.",
    "Bayes": "É a regra para atualizar uma crença quando você recebe uma nova evidência.",
    "ε–δ": "É a definição rigorosa de limite: controlar a saída controlando a entrada.",
    "TFC": "O teorema fundamental do cálculo liga a área acumulada à derivada.",
    "Indução": "É uma prova que mostra o primeiro caso e que, se um caso vale, o próximo também vale.",
    "MDC": "É o maior número que divide dois ou mais números sem deixar resto.",
    "MMC": "É o menor número que é múltiplo de dois ou mais números ao mesmo tempo.",
    "Congruência": "É a ideia de que números com o mesmo resto são equivalentes, como num relógio.",
    "VLSM": "É dividir uma rede IP em blocos de tamanhos diferentes conforme a necessidade.",
    "epoll": "É o mecanismo do Linux que avisa quando uma conexão de rede tem dados prontos.",
    "pthreads": "É a biblioteca POSIX que permite um programa C usar várias threads.",
    "UAF": "É o erro de usar um pedaço de memória depois de tê-lo devolvido ao sistema.",
    "Segmentation Fault": "É a falha que acontece quando um programa tenta acessar memória que não é sua.",
    "IEEE 754": "É o padrão que define como números com vírgula são guardados em bits.",
    "ALU": "É a parte do processador que calcula e compara números.",
    "Flag ZF": "É um bit da CPU que fica ligado quando uma operação termina em zero.",
    "Syscall": "É a porta de entrada pela qual um programa pede um serviço ao sistema operacional.",
    "SM-2 Radar": "É o painel que mostra quais cartões estão vencidos e quando cada um volta.",
    "Grafo de evolução": "É o mapa que mostra o que você já domina e o que cada pré-requisito libera.",
    "Nívelamento": "É um teste curto que descobre por onde começar sem perder tempo com o que você já sabe."
  };

  window.FORGE8_GLOSSARY = GLOSSARY;

  window.forge8Glossary = function forge8Glossary(term) {
    return GLOSSARY[term] || GLOSSARY[String(term || "").trim()] || null;
  };
})();

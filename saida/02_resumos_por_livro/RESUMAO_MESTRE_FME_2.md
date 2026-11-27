# Resumo Mestre — FME_2

- **Obra:** FME 2 — Logaritmos
- **Autoria registrada no inventário:** Iezzi / Dolce / Murakami
- **BOOK_ID:** `FME_2`
- **Capítulos extraídos (fontes locais):** 20 arquivo(s) `capXX.md`
- **Capítulos detectados no índice local:** 20
- **Data de extração informada no índice:** 2026-11-26T20:31:40-03:00
- **Base:** textos extraídos localmente em `saida/01_texto_extraido/FME_2/`; nenhuma fonte externa foi consultada.
- **Fidelidade:** síntese pedagógica a partir dos capítulos disponíveis; segmentação proporcional do OCR, portanto os 'capítulos' são blocos de texto e não necessariamente capítulos editoriais.
- **Gerado por:** `scripts/generate_master_summaries.py` em 2026-11-27T06:48:35-03:00 (FORGE 7.0, 100% aditivo).

## 1. Mapa Conceitual da Obra (1 página)

```text
FME_2: potências, raízes, logaritmos e equações exponenciais
+-- eixo 1: FUNDAMENTOS DE MATEMÁTICA ELEMENTAR
|   +-- potência  ->  expoente natural
+-- eixo 2: GELSON IEZZI OSVALDO DOLCE CARLOS MURAKAMI FUNDAMENTOS
|   +-- expoente negativo  ->  raiz n-ésima
+-- eixo 3: DE MATEMÁTICA ELEMENTAR
|   +-- logaritmo  ->  base
+-- eixo 4: POTÊNCIAS E RAÍZES
    +-- argumento  ->  mudança de base
```

- **Títulos reais observados no índice:** FUNDAMENTOS DE MATEMÁTICA ELEMENTAR; GELSON IEZZI OSVALDO DOLCE CARLOS MURAKAMI FUNDAMENTOS; DE MATEMÁTICA ELEMENTAR; POTÊNCIAS E RAÍZES.
- **Palavras-chave medida no texto extraído:** função, equação, logaritmos, equações, reais, logaritmo, tempo, exponenciais.
- **Rótulos recorrentes no sumário interno dos capítulos:** 2. Exemplos:; 4. Calcule:; Gn Ss Sae; 2. Calcule:
- **Conexão lógica:** potência -> expoente natural -> expoente negativo -> raiz n-ésima -> logaritmo -> aplicação em FUNDAMENTOS DE MATEMÁTICA ELEMENTAR.
- **Leitura do mapa:** cada eixo vem de um título/indício presente no texto local; os nós em `->` são conceitos didáticos que articulam esse eixo.

## 2. Enciclopédia dos 'Porquês' Respondidos

> Cada entrada responde a uma pergunta de primeira princípios usando definições, axiomas ou escolhas de construção. Quando o OCR é escasso, a resposta é síntese pedagógica a partir dos capítulos disponíveis.

### 1. Por que potências são atalhos?

**Resposta:** Porque transformar produtos longos em expoentes torna visíveis padrões de crescimento e simplifica equações.

*Noção associada:* potência — Produto repetido aⁿ com base a e expoente n.

### 2. Por que a base pode ser negativa com expoente ímpar mas não com par?

**Resposta:** Porque (−a)ⁿ alterna sinal conforme n; para n par o resultado é positivo, para n ímpar negativo.

*Noção associada:* expoente natural — Contador de fatores iguais na potência.

### 3. Por que a ≠ 0 é obrigatório?

**Resposta:** Porque 1/0 não existe; estender a regra ao zero geraria divisão por zero.

*Noção associada:* expoente negativo — a⁻ⁿ = 1/aⁿ, com a ≠ 0.

### 4. Por que √9 = 3 e não ±3?

**Resposta:** Porque o símbolo √ denota a raiz aritmética não negativa; as duas soluções de x² = 9 são escritas como ±√9.

*Noção associada:* raiz n-ésima — Número que elevado a n devolve o radicando.

### 5. Por que logaritmo é o inverso da exponenciação?

**Resposta:** Porque a exponenciação responde "qual é o resultado?", e o logaritmo responde "qual expoente produziu este resultado?".

*Noção associada:* logaritmo — y = logₐ x é o expoente y tal que aʸ = x.

### 6. Por que a base não pode ser 1?

**Resposta:** Porque 1ʸ = 1 para todo y; a função não seria injetora e o logaritmo não teria valor único.

*Noção associada:* base — Número a fixado em logₐ, com a > 0 e a ≠ 1.

### 7. Por que o argumento deve ser positivo?

**Resposta:** Porque aʸ > 0 para qualquer y real com a > 0; não existe expoente real que produza um número não positivo.

*Noção associada:* argumento — Valor x > 0 cujo logaritmo se calcula.

### 8. Por que mudar de base é sempre possível?

**Resposta:** Porque basta dividir as identidades x = a^(logₐ x) e x = b^(log_b x) e aplicar logaritmos; a razão é independente de x.

*Noção associada:* mudança de base — logₐ x = log_b x / log_b a.

### 9. Por que produto vira soma?

**Resposta:** Porque aᵘ·aᵛ = aᵘ⁺ᵛ; os expoentes que representam M e N se somam ao representar MN.

*Noção associada:* propriedade do produto — logₐ(MN) = logₐ M + logₐ N.

### 10. Por que quociente vira subtração?

**Resposta:** Porque aᵘ/aᵛ = aᵘ⁻ᵛ, então o expoente de M/N é a diferença dos expoentes de M e N.

*Noção associada:* propriedade do quociente — logₐ(M/N) = logₐ M − logₐ N.

### 11. Por que o expoente k sai multiplicando?

**Resposta:** Porque (aᵘ)ᵏ = aᵏᵘ; repetir M k vezes no argumento repete k vezes seu expoente.

*Noção associada:* propriedade da potência — logₐ(Mᵏ) = k·logₐ M.

### 12. Por que igualar bases resolve a equação?

**Resposta:** Porque aˢ é estritamente monótona para a > 0 e a ≠ 1; bases iguais implicam expoentes iguais.

*Noção associada:* equação exponencial — Equação em que a incógnita está no expoente.

## 3. Repositório de Fórmulas e Códigos Auditados

> **Critério de auditoria:** o OCR local corrompe símbolos matemáticos. Por isso **todas** as fórmulas abaixo estão marcadas como ilustrativas: são reconstruções canônicas dos temas detectados, não transcrições literais. Os números dos gabaritos foram calculados pelo próprio gerador; os snippets foram verificados por `compile()` (Python) e por GCC `-std=c11 -fsyntax-only` (C, compatível com C17).

1. `aᵐ·aⁿ = aᵐ⁺ⁿ` — Produto de potências de mesma base. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
2. `a⁻ⁿ = 1/aⁿ, a ≠ 0` — Expoente negativo como recíproco. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
3. `ⁿ√a = a^(1/n)` — Raiz como expoente fracionário. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
4. `logₐ x = y ⟺ aʸ = x` — Definição operacional do logaritmo. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
5. `logₐ(M·N) = logₐ M + logₐ N` — Produto vira soma. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
6. `logₐ(M/N) = logₐ M − logₐ N` — Quociente vira diferença. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
7. `logₐ(Mᵏ) = k·logₐ M` — Expoente do argumento vira multiplicador. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
8. `logₐ x = log_b x / log_b a` — Troca de base. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
9. `a^(logₐ M) = M` — Exponenciação e logaritmo se cancelam. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
10. `logₐ 1 = 0 e logₐ a = 1` — Valores especiais. 〔ilustrativa — reconstrução didática; não extraída literalmente〕

**Snippet 1 — Python** (Python: compile() OK; todas as linhas comentadas):

```python
from math import log       # importa o logaritmo natural da biblioteca padrão
a, M, N = 2, 8, 4          # define a base e os argumentos do exemplo
lado1 = log(M * N, a)      # calcula o logaritmo do produto na base a
lado2 = log(M, a) + log(N, a) # calcula a soma dos dois logaritmos
print(lado1, lado2)        # confere que os dois lados são iguais
```

**Snippet 2 — C17** (C17: GCC -fsyntax-only OK; todas as linhas comentadas):

```c
#include <stdio.h> // inclui printf
#include <math.h> // inclui log
int main(void) { // abre a funcao principal
    double base = 2.0; // define a base do logaritmo
    double M = 8.0; // define o primeiro argumento
    double N = 4.0; // define o segundo argumento
    double esq = log(M * N) / log(base); // logaritmo do produto por mudanca de base
    double dir = log(M) / log(base) + log(N) / log(base); // soma dos logaritmos
    printf("%.3f %.3f\n", esq, dir); // imprime os dois lados da identidade
    return 0; // encerra o programa
} // fecha a funcao principal
```

## 4. Guia Prático: Como Dar Uma Aula Sobre Este Livro

**Analogias para o quadro**

- A exponenciação é uma esteira que multiplica; o logaritmo é o contador de voltas dessa esteira até chegar a um destino.
- Mudar a base é como trocar a unidade de um ruler: o número de passos muda, mas a distância percorrida é a mesma.
- A propriedade do produto é o mesmo que somar tempos de viagem quando se multiplicam etapas de crescimento.

**Sequência sugerida no quadro**

- **Passo 1:** Escreva o título FME_2 e o foco potências, raízes, logaritmos e equações exponenciais; pergunte o que já se sabe sobre potência.
- **Passo 2:** Desenhe o mapa da seção 1 e justifique a seta entre potência e expoente natural.
- **Passo 3:** Derive uma fórmula do catálogo (por exemplo, `aᵐ·aⁿ = aᵐ⁺ⁿ`) antes de aplicá-la a números.
- **Passo 4:** Resolva um exemplo no quadro em voz alta, marcando onde cada hipótese foi usada.
- **Passo 5:** Peça aos alunos que reformulem o mesmo exemplo com outros dados e comparem os resultados.
- **Passo 6:** Feche com equação exponencial: por que essa ideia aparece em FUNDAMENTOS DE MATEMÁTICA ELEMENTAR?

**Perguntas de verificação em aula**

- Por que potências são atalhos? (Resposta esperada: Porque transformar produtos longos em expoentes torna visíveis padrões de crescimento e simplifica equações.)
- Por que a base pode ser negativa com expoente ímpar mas não com par? (Resposta esperada: Porque (−a)ⁿ alterna sinal conforme n; para n par o resultado é positivo, para n ímpar negativo.)
- Por que a ≠ 0 é obrigatório? (Resposta esperada: Porque 1/0 não existe; estender a regra ao zero geraria divisão por zero.)
- Ao aplicar `a⁻ⁿ = 1/aⁿ, a ≠ 0`, qual hipótese impediria o cálculo? (Resposta esperada: verificar as condições de validade antes de substituir os valores.)

## 5. Avaliação Mestre — 20 Questões com Gabarito Comentado

**Bloco A — 10 questões conceituais**

1. **(Conceitual)** Explique o que é «potência» em FME 2 — Logaritmos e por que essa noção é necessária.
   - **Gabarito comentado:** Produto repetido aⁿ com base a e expoente n. Relação: Porque transformar produtos longos em expoentes torna visíveis padrões de crescimento e simplifica equações.
2. **(Conceitual)** Explique o que é «expoente natural» em FME 2 — Logaritmos e por que essa noção é necessária.
   - **Gabarito comentado:** Contador de fatores iguais na potência. Relação: Porque (−a)ⁿ alterna sinal conforme n; para n par o resultado é positivo, para n ímpar negativo.
3. **(Conceitual)** Explique o que é «expoente negativo» em FME 2 — Logaritmos e por que essa noção é necessária.
   - **Gabarito comentado:** a⁻ⁿ = 1/aⁿ, com a ≠ 0. Relação: Porque 1/0 não existe; estender a regra ao zero geraria divisão por zero.
4. **(Conceitual)** Explique o que é «raiz n-ésima» em FME 2 — Logaritmos e por que essa noção é necessária.
   - **Gabarito comentado:** Número que elevado a n devolve o radicando. Relação: Porque o símbolo √ denota a raiz aritmética não negativa; as duas soluções de x² = 9 são escritas como ±√9.
5. **(Conceitual)** Explique o que é «logaritmo» em FME 2 — Logaritmos e por que essa noção é necessária.
   - **Gabarito comentado:** y = logₐ x é o expoente y tal que aʸ = x. Relação: Porque a exponenciação responde "qual é o resultado?", e o logaritmo responde "qual expoente produziu este resultado?".
6. **(Conceitual)** Explique o que é «base» em FME 2 — Logaritmos e por que essa noção é necessária.
   - **Gabarito comentado:** Número a fixado em logₐ, com a > 0 e a ≠ 1. Relação: Porque 1ʸ = 1 para todo y; a função não seria injetora e o logaritmo não teria valor único.
7. **(Conceitual)** Explique o que é «argumento» em FME 2 — Logaritmos e por que essa noção é necessária.
   - **Gabarito comentado:** Valor x > 0 cujo logaritmo se calcula. Relação: Porque aʸ > 0 para qualquer y real com a > 0; não existe expoente real que produza um número não positivo.
8. **(Conceitual)** Explique o que é «mudança de base» em FME 2 — Logaritmos e por que essa noção é necessária.
   - **Gabarito comentado:** logₐ x = log_b x / log_b a. Relação: Porque basta dividir as identidades x = a^(logₐ x) e x = b^(log_b x) e aplicar logaritmos; a razão é independente de x.
9. **(Conceitual)** Explique o que é «propriedade do produto» em FME 2 — Logaritmos e por que essa noção é necessária.
   - **Gabarito comentado:** logₐ(MN) = logₐ M + logₐ N. Relação: Porque aᵘ·aᵛ = aᵘ⁺ᵛ; os expoentes que representam M e N se somam ao representar MN.
10. **(Conceitual)** Explique o que é «propriedade do quociente» em FME 2 — Logaritmos e por que essa noção é necessária.
   - **Gabarito comentado:** logₐ(M/N) = logₐ M − logₐ N. Relação: Porque aᵘ/aᵛ = aᵘ⁻ᵛ, então o expoente de M/N é a diferença dos expoentes de M e N.

**Bloco B — 10 questões práticas**

11. **(Prática)** Calcule 2³·2⁴.
   - **Gabarito comentado:** 128. 2⁷ = 128. Verificação: `aᵐ·aⁿ = aᵐ⁺ⁿ`.
12. **(Prática)** Calcule 2⁻³.
   - **Gabarito comentado:** 0,125. 1/8 = 0,125. Verificação: `a⁻ⁿ = 1/aⁿ, a ≠ 0`.
13. **(Prática)** Calcule ³√64.
   - **Gabarito comentado:** 4. 64^(1/3) = 4. Verificação: `ⁿ√a = a^(1/n)`.
14. **(Prática)** Calcule log₂8.
   - **Gabarito comentado:** 3. 2³ = 8, logo o logaritmo é 3. Verificação: `logₐ x = y ⟺ aʸ = x`.
15. **(Prática)** Calcule log₂(8·4).
   - **Gabarito comentado:** 5. log₂8 = 3 e log₂4 = 2; soma 5. Verificação: `logₐ(M·N) = logₐ M + logₐ N`.
16. **(Prática)** Calcule log₂(32/4).
   - **Gabarito comentado:** 3. 5 − 2 = 3, e 32/4 = 8 = 2³. Verificação: `logₐ(M/N) = logₐ M − logₐ N`.
17. **(Prática)** Calcule log₂(3⁴).
   - **Gabarito comentado:** 6,33985. 4·log₂3 ≈ 6,33985. Verificação: `logₐ(Mᵏ) = k·logₐ M`.
18. **(Prática)** Calcule log₂64 usando logaritmos decimais.
   - **Gabarito comentado:** 6. log64/log2 ≈ 1,80618/0,30103 = 6. Verificação: `logₐ x = log_b x / log_b a`.
19. **(Prática)** Calcule 3^(log₃81).
   - **Gabarito comentado:** 81. log₃81 = 4 e 3⁴ = 81. Verificação: `a^(logₐ M) = M`.
20. **(Prática)** Calcule log₇1.
   - **Gabarito comentado:** 0. Qualquer base elevada a 0 dá 1, logo o resultado é 0. Verificação: `logₐ 1 = 0 e logₐ a = 1`.

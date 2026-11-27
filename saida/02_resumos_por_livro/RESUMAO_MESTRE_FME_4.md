# Resumo Mestre — FME_4

- **Obra:** FME 4 — Sequências, Matrizes e Determinantes
- **Autoria registrada no inventário:** Hazzan / Murakami
- **BOOK_ID:** `FME_4`
- **Capítulos extraídos (fontes locais):** 20 arquivo(s) `capXX.md`
- **Capítulos detectados no índice local:** 20
- **Data de extração informada no índice:** 2026-11-26T20:31:40-03:00
- **Base:** textos extraídos localmente em `saida/01_texto_extraido/FME_4/`; nenhuma fonte externa foi consultada.
- **Fidelidade:** síntese pedagógica a partir dos capítulos disponíveis; segmentação proporcional do OCR, portanto os 'capítulos' são blocos de texto e não necessariamente capítulos editoriais.
- **Gerado por:** `scripts/generate_master_summaries.py` em 2026-11-27T06:48:35-03:00 (FORGE 7.0, 100% aditivo).

## 1. Mapa Conceitual da Obra (1 página)

```text
FME_4: sequências, progressões, matrizes, determinantes e sistemas
+-- eixo 1: FUNDAMENTOS ES DE MATEMÁTICA
|   +-- sequência  ->  recorrência
+-- eixo 2: SAMUEL HAZZAN FUNDAMENTOS DE MATEMÁTICA ELEMENTAR
|   +-- termo geral  ->  PA
+-- eixo 3: SEQUÊNCIAS
|   +-- soma de PA  ->  PG
+-- eixo 4: PROGRESSÃO ARITMÉTICA
    +-- soma de PG  ->  soma infinita
```

- **Títulos reais observados no índice:** FUNDAMENTOS ES DE MATEMÁTICA; SAMUEL HAZZAN FUNDAMENTOS DE MATEMÁTICA ELEMENTAR; SEQUÊNCIAS; PROGRESSÃO ARITMÉTICA.
- **Palavras-chave medida no texto extraído:** matriz, sistema, termos, progressão, ordem, matrizes, termo, razão.
- **Rótulos recorrentes no sumário interno dos capítulos:** 4. Sabemos que duas aplicações, f e g, são iguais quando têm domínios iguais e; 5. Por fórmula de recorrência; 6. Expressando cada termo em função de sua posição; 1. Escreva os seis termos iniciais das sequências dadas pelas seguintes fórmulas
- **Conexão lógica:** sequência -> recorrência -> termo geral -> PA -> soma de PA -> aplicação em FUNDAMENTOS ES DE MATEMÁTICA.
- **Leitura do mapa:** cada eixo vem de um título/indício presente no texto local; os nós em `->` são conceitos didáticos que articulam esse eixo.

## 2. Enciclopédia dos 'Porquês' Respondidos

> Cada entrada responde a uma pergunta de primeira princípios usando definições, axiomas ou escolhas de construção. Quando o OCR é escasso, a resposta é síntese pedagógica a partir dos capítulos disponíveis.

### 1. Por que uma sequência é uma função?

**Resposta:** Porque cada posição n recebe exatamente um valor aₙ; isso permite usar linguagem funcional para ordens infinitas.

*Noção associada:* sequência — Função cujo domínio é o conjunto dos índices naturais.

### 2. Por que recorrências são úteis?

**Resposta:** Porque muitos processos são descritos pela transição de um passo ao seguinte, sem necessidade de uma fórmula fechada imediata.

*Noção associada:* recorrência — Lei que define aₙ a partir de termos anteriores.

### 3. Por que o termo geral é preferível para n grande?

**Resposta:** Porque evita calcular todos os termos anteriores; basta substituir o índice desejado.

*Noção associada:* termo geral — Fórmula que dá aₙ diretamente em função de n.

### 4. Por que a razão constante define uma reta discreta?

**Resposta:** Porque aₙ = a₁ + (n−1)r é linear em n, cuja imagem são pontos igualmente espaçados.

*Noção associada:* PA — Sequência em que aₙ₊₁ − aₙ = r constante.

### 5. Por que essa fórmula funciona?

**Resposta:** Porque emparelhar o primeiro com o último, o segundo com o penúltimo, dá n/2 pares com a mesma soma a₁ + aₙ.

*Noção associada:* soma de PA — Sₙ = n(a₁ + aₙ)/2.

### 6. Por que a razão q não pode ser zero?

**Resposta:** Porque q = 0 tornaria todos os termos após o primeiro iguais a zero e a razão seguinte deixaria de ser definida.

*Noção associada:* PG — Sequência em que aₙ₊₁/aₙ = q constante.

### 7. Por que q = 1 é caso separado?

**Resposta:** Porque o denominador se anula; nesse caso todos os termos valem a₁ e Sₙ = n·a₁.

*Noção associada:* soma de PG — Sₙ = a₁(qⁿ − 1)/(q − 1), q ≠ 1.

### 8. Por que a condição módulo(q) < 1 é necessária?

**Resposta:** Porque se módulo(q) ≥ 1 os termos não tendem a zero e a soma parcial não converge.

*Noção associada:* soma infinita — S∞ = a₁/(1 − q) quando o módulo de q é menor que 1.

### 9. Por que a ordem das linhas e colunas importa?

**Resposta:** Porque uma matriz representa uma aplicação linear: trocar linhas ou colunas altera a transformação descrita.

*Noção associada:* matriz — Arranjo retangular de números em linhas e colunas.

### 10. Por que determinante nulo indica sistema sem solução única?

**Resposta:** Porque a transformação achata o espaço, perdendo dimensão; a matriz não pode ser invertida.

*Noção associada:* determinante — Escalar associado a uma matriz quadrada que mede fator de área/volume.

### 11. Por que resolver é intersectar soluções?

**Resposta:** Porque cada equação descreve uma reta/hiperplano e a solução comum é a interseção desses conjuntos.

*Noção associada:* sistema linear — Conjunto de equações lineares com incógnitas comuns.

### 12. Por que det(A) deve ser não nulo?

**Resposta:** Porque ele aparece no denominador e garante que a matriz de coeficientes seja invertível.

*Noção associada:* Cramer — xᵢ = det(Aᵢ)/det(A) quando det(A) ≠ 0.

## 3. Repositório de Fórmulas e Códigos Auditados

> **Critério de auditoria:** o OCR local corrompe símbolos matemáticos. Por isso **todas** as fórmulas abaixo estão marcadas como ilustrativas: são reconstruções canônicas dos temas detectados, não transcrições literais. Os números dos gabaritos foram calculados pelo próprio gerador; os snippets foram verificados por `compile()` (Python) e por GCC `-std=c11 -fsyntax-only` (C, compatível com C17).

1. `aₙ = a₁ + (n−1)r` — Termo geral da progressão aritmética. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
2. `Sₙ = n(a₁ + aₙ)/2` — Soma dos n primeiros termos de uma PA. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
3. `aₙ = a₁·qⁿ⁻¹` — Termo geral da progressão geométrica. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
4. `Sₙ = a₁(qⁿ − 1)/(q − 1), q ≠ 1` — Soma dos n primeiros termos de uma PG. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
5. `S∞ = a₁/(1 − q), módulo(q) < 1` — Soma de PG infinita convergente. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
6. `det[[a,b],[c,d]] = ad − bc` — Determinante de matriz 2×2. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
7. `det₃ = aei + bfg + cdh − ceg − bdi − afh` — Regra de Sarrus para matriz 3×3. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
8. `Cᵢⱼ = Σₖ aᵢₖ·bₖⱼ` — Elemento do produto de matrizes. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
9. `x = det(Aₓ)/det(A), det(A) ≠ 0` — Regra de Cramer para uma incógnita. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
10. `aₙ = a₀ + n·d` — Sequência definida por recorrência linear simples. 〔ilustrativa — reconstrução didática; não extraída literalmente〕

**Snippet 1 — Python** (Python: compile() OK; todas as linhas comentadas):

```python
a1, r, n = 3, 5, 17          # define primeiro termo, razão e índice da PA
termo = a1 + (n - 1) * r     # aplica a fórmula do termo geral
soma = n * (a1 + termo) // 2 # aplica a fórmula da soma dos n termos
print(termo, soma)           # imprime 83 e 442
```

**Snippet 2 — C17** (C17: GCC -fsyntax-only OK; todas as linhas comentadas):

```c
#include <stdio.h> // inclui printf
int main(void) { // abre a funcao principal
    int a = 2, b = 3; // define a primeira linha da matriz
    int c = 4, d = 5; // define a segunda linha da matriz
    int det = a * d - b * c; // calcula o determinante 2x2
    printf("%d\n", det); // imprime o resultado -2
    return 0; // encerra o programa
} // fecha a funcao principal
```

## 4. Guia Prático: Como Dar Uma Aula Sobre Este Livro

**Analogias para o quadro**

- Uma PA é uma escada com degraus iguais; uma PG é um crescimento por duplicação, como o número de grãos em um tabuleiro.
- A soma da PA é emparelhar degraus da base com degraus do topo; cada par tem a mesma altura total.
- Um determinante é o fator pelo qual uma mola transforma uma área; se ele é zero, a mola achatou tudo em uma linha.

**Sequência sugerida no quadro**

- **Passo 1:** Escreva o título FME_4 e o foco sequências, progressões, matrizes, determinantes e sistemas; pergunte o que já se sabe sobre sequência.
- **Passo 2:** Desenhe o mapa da seção 1 e justifique a seta entre sequência e recorrência.
- **Passo 3:** Derive uma fórmula do catálogo (por exemplo, `aₙ = a₁ + (n−1)r`) antes de aplicá-la a números.
- **Passo 4:** Resolva um exemplo no quadro em voz alta, marcando onde cada hipótese foi usada.
- **Passo 5:** Peça aos alunos que reformulem o mesmo exemplo com outros dados e comparem os resultados.
- **Passo 6:** Feche com Cramer: por que essa ideia aparece em FUNDAMENTOS ES DE MATEMÁTICA?

**Perguntas de verificação em aula**

- Por que uma sequência é uma função? (Resposta esperada: Porque cada posição n recebe exatamente um valor aₙ; isso permite usar linguagem funcional para ordens infinitas.)
- Por que recorrências são úteis? (Resposta esperada: Porque muitos processos são descritos pela transição de um passo ao seguinte, sem necessidade de uma fórmula fechada imediata.)
- Por que o termo geral é preferível para n grande? (Resposta esperada: Porque evita calcular todos os termos anteriores; basta substituir o índice desejado.)
- Ao aplicar `Sₙ = n(a₁ + aₙ)/2`, qual hipótese impediria o cálculo? (Resposta esperada: verificar as condições de validade antes de substituir os valores.)

## 5. Avaliação Mestre — 20 Questões com Gabarito Comentado

**Bloco A — 10 questões conceituais**

1. **(Conceitual)** Explique o que é «sequência» em FME 4 — Sequências, Matrizes e Determinantes e por que essa noção é necessária.
   - **Gabarito comentado:** Função cujo domínio é o conjunto dos índices naturais. Relação: Porque cada posição n recebe exatamente um valor aₙ; isso permite usar linguagem funcional para ordens infinitas.
2. **(Conceitual)** Explique o que é «recorrência» em FME 4 — Sequências, Matrizes e Determinantes e por que essa noção é necessária.
   - **Gabarito comentado:** Lei que define aₙ a partir de termos anteriores. Relação: Porque muitos processos são descritos pela transição de um passo ao seguinte, sem necessidade de uma fórmula fechada imediata.
3. **(Conceitual)** Explique o que é «termo geral» em FME 4 — Sequências, Matrizes e Determinantes e por que essa noção é necessária.
   - **Gabarito comentado:** Fórmula que dá aₙ diretamente em função de n. Relação: Porque evita calcular todos os termos anteriores; basta substituir o índice desejado.
4. **(Conceitual)** Explique o que é «PA» em FME 4 — Sequências, Matrizes e Determinantes e por que essa noção é necessária.
   - **Gabarito comentado:** Sequência em que aₙ₊₁ − aₙ = r constante. Relação: Porque aₙ = a₁ + (n−1)r é linear em n, cuja imagem são pontos igualmente espaçados.
5. **(Conceitual)** Explique o que é «soma de PA» em FME 4 — Sequências, Matrizes e Determinantes e por que essa noção é necessária.
   - **Gabarito comentado:** Sₙ = n(a₁ + aₙ)/2. Relação: Porque emparelhar o primeiro com o último, o segundo com o penúltimo, dá n/2 pares com a mesma soma a₁ + aₙ.
6. **(Conceitual)** Explique o que é «PG» em FME 4 — Sequências, Matrizes e Determinantes e por que essa noção é necessária.
   - **Gabarito comentado:** Sequência em que aₙ₊₁/aₙ = q constante. Relação: Porque q = 0 tornaria todos os termos após o primeiro iguais a zero e a razão seguinte deixaria de ser definida.
7. **(Conceitual)** Explique o que é «soma de PG» em FME 4 — Sequências, Matrizes e Determinantes e por que essa noção é necessária.
   - **Gabarito comentado:** Sₙ = a₁(qⁿ − 1)/(q − 1), q ≠ 1. Relação: Porque o denominador se anula; nesse caso todos os termos valem a₁ e Sₙ = n·a₁.
8. **(Conceitual)** Explique o que é «soma infinita» em FME 4 — Sequências, Matrizes e Determinantes e por que essa noção é necessária.
   - **Gabarito comentado:** S∞ = a₁/(1 − q) quando o módulo de q é menor que 1. Relação: Porque se módulo(q) ≥ 1 os termos não tendem a zero e a soma parcial não converge.
9. **(Conceitual)** Explique o que é «matriz» em FME 4 — Sequências, Matrizes e Determinantes e por que essa noção é necessária.
   - **Gabarito comentado:** Arranjo retangular de números em linhas e colunas. Relação: Porque uma matriz representa uma aplicação linear: trocar linhas ou colunas altera a transformação descrita.
10. **(Conceitual)** Explique o que é «determinante» em FME 4 — Sequências, Matrizes e Determinantes e por que essa noção é necessária.
   - **Gabarito comentado:** Escalar associado a uma matriz quadrada que mede fator de área/volume. Relação: Porque a transformação achata o espaço, perdendo dimensão; a matriz não pode ser invertida.

**Bloco B — 10 questões práticas**

11. **(Prática)** Calcule o 17º termo da PA com a₁=3 e r=5.
   - **Gabarito comentado:** 83. 3 + 16·5 = 83. Verificação: `aₙ = a₁ + (n−1)r`.
12. **(Prática)** Calcule a soma dos 17 termos de uma PA com a₁=2 e a₁₇=50.
   - **Gabarito comentado:** 442. 17·52/2 = 442. Verificação: `Sₙ = n(a₁ + aₙ)/2`.
13. **(Prática)** Calcule o 5º termo da PG com a₁=2 e q=3.
   - **Gabarito comentado:** 162. 2·3⁴ = 162. Verificação: `aₙ = a₁·qⁿ⁻¹`.
14. **(Prática)** Some os 4 primeiros termos da PG 2, 6, 18, 54.
   - **Gabarito comentado:** 80. 2+6+18+54 = 80. Verificação: `Sₙ = a₁(qⁿ − 1)/(q − 1), q ≠ 1`.
15. **(Prática)** Calcule a soma infinita da PG com a₁=8 e q=1/2.
   - **Gabarito comentado:** 16. 8/(1−0,5) = 16. Verificação: `S∞ = a₁/(1 − q), módulo(q) < 1`.
16. **(Prática)** Calcule o determinante de [[2,3],[4,5]].
   - **Gabarito comentado:** -2. 2·5 − 3·4 = −2. Verificação: `det[[a,b],[c,d]] = ad − bc`.
17. **(Prática)** Calcule o determinante da matriz 3×3 com linhas 1,2,3 / 4,5,6 / 7,8,9.
   - **Gabarito comentado:** 0. As linhas são linearmente dependentes; resultado 0. Verificação: `det₃ = aei + bfg + cdh − ceg − bdi − afh`.
18. **(Prática)** Calcule o elemento (1,1) do produto de [[1,2]] por [[3],[4]].
   - **Gabarito comentado:** 11. 1·3 + 2·4 = 11. Verificação: `Cᵢⱼ = Σₖ aᵢₖ·bₖⱼ`.
19. **(Prática)** Com det(A)=5 e det(Aₓ)=15, calcule x.
   - **Gabarito comentado:** 3. 15/5 = 3. Verificação: `x = det(Aₓ)/det(A), det(A) ≠ 0`.
20. **(Prática)** Com a₀=4 e d=3, calcule a₅ a partir da recorrência.
   - **Gabarito comentado:** 19. 4 + 5·3 = 19. Verificação: `aₙ = a₀ + n·d`.

# Resumo Mestre — FME_1

- **Obra:** FME 1 — Conjuntos e Funções
- **Autoria registrada no inventário:** Iezzi / Murakami
- **BOOK_ID:** `FME_1`
- **Capítulos extraídos (fontes locais):** 20 arquivo(s) `capXX.md`
- **Capítulos detectados no índice local:** 20
- **Data de extração informada no índice:** 2026-11-26T20:31:40-03:00
- **Base:** textos extraídos localmente em `saida/01_texto_extraido/FME_1/`; nenhuma fonte externa foi consultada.
- **Fidelidade:** síntese pedagógica a partir dos capítulos disponíveis; segmentação proporcional do OCR, portanto os 'capítulos' são blocos de texto e não necessariamente capítulos editoriais.
- **Gerado por:** `scripts/generate_master_summaries.py` em 2026-11-27T06:48:35-03:00 (FORGE 7.0, 100% aditivo).

## 1. Mapa Conceitual da Obra (1 página)

```text
FME_1: lógica, conjuntos, funções e noções de relação
+-- eixo 1: FUNDAMENTOS E DE MATEMÁTICA
|   +-- conjunto  ->  número natural
+-- eixo 2: GELSON IEZZI CARLOS MURAKAMI FUNDAMENTOS DE MATEMÁTICA
|   +-- pertinência  ->  número inteiro
+-- eixo 3: ELEMENTAR
|   +-- subconjunto  ->  número racional
+-- eixo 4: NOÇÕES DE LÓGICA
    +-- união  ->  divisibilidade
```

- **Títulos reais observados no índice:** FUNDAMENTOS E DE MATEMÁTICA; GELSON IEZZI CARLOS MURAKAMI FUNDAMENTOS DE MATEMÁTICA; ELEMENTAR; NOÇÕES DE LÓGICA.
- **Palavras-chave medida no texto extraído:** função, conjunto, gráfico, funções, reais, equação, conjuntos, definida.
- **Rótulos recorrentes no sumário interno dos capítulos:** 4. Conectivo V; 3. Classifique em verdadeira ou falsa cada uma das seguintes proposições com; 5. Condicional —s; 6. Condicional <>
- **Conexão lógica:** conjunto -> número natural -> pertinência -> número inteiro -> subconjunto -> aplicação em FUNDAMENTOS E DE MATEMÁTICA.
- **Leitura do mapa:** cada eixo vem de um título/indício presente no texto local; os nós em `->` são conceitos didáticos que articulam esse eixo.

## 2. Enciclopédia dos 'Porquês' Respondidos

> Cada entrada responde a uma pergunta de primeira princípios usando definições, axiomas ou escolhas de construção. Quando o OCR é escasso, a resposta é síntese pedagógica a partir dos capítulos disponíveis.

### 1. Por que a definição deve ser bem definida?

**Resposta:** Porque sem critério objetivo de pertinência não há como decidir se x pertence ao conjunto, e todas as operações seguintes ficam ambíguas.

*Noção associada:* conjunto — Coleção bem definida de elementos, com pertinência decidível.

### 2. Por que começamos pelos naturais?

**Resposta:** Porque toda medição e contagem precisa de um conjunto mínimo fechado para somar e multiplicar sem sair dele.

*Noção associada:* número natural — Conjunto {0,1,2,3,...} usado para contar e ordenar.

### 3. Por que distinguir ∈ de ⊂?

**Resposta:** Porque ∈ liga elemento a conjunto, enquanto ⊂ liga conjunto a conjunto; confundi-los gera afirmações sem sentido.

*Noção associada:* pertinência — Relação x ∈ A que indica x ser elemento de A.

### 4. Por que incluir negativos?

**Resposta:** Para representar dívida, temperatura abaixo de zero e qualquer grandeza com direção oposta; sem eles, a subtração não seria sempre possível.

*Noção associada:* número inteiro — Naturais, seus opostos e o zero.

### 5. Por que A ∩ B = A caracteriza A ⊂ B?

**Resposta:** Porque a interseção só conserva elementos comuns; se ela já é igual a A, todos os elementos de A estavam em B.

*Noção associada:* subconjunto — A ⊂ B quando todo elemento de A pertence a B.

### 6. Por que frações são necessárias?

**Resposta:** Porque dividir 3 unidades entre 4 pessoas não tem resposta nos inteiros; o racional fecha a divisão (exceto por zero).

*Noção associada:* número racional — Quociente a/b com a inteiro e b inteiro não nulo.

### 7. Por que a união não soma cardinalidades diretamente?

**Resposta:** Porque elementos em A ∩ B seriam contados duas vezes; daí card(A ∪ B) = card(A) + card(B) − card(A ∩ B).

*Noção associada:* união — A ∪ B reúne os elementos que pertencem a A ou a B.

### 8. Por que definir divisibilidade antes do MDC?

**Resposta:** Porque o MDC e o MMC só fazem sentido quando conseguimos reconhecer quais fatores são comuns aos números.

*Noção associada:* divisibilidade — Dizer que b divide a quando existe inteiro q com a = bq.

### 9. Por que a interseção modela "e" lógico?

**Resposta:** Porque pertencer aos dois conjuntos é exatamente a condição simultânea p ∧ q da lógica proposicional.

*Noção associada:* interseção — A ∩ B contém os elementos comuns a A e B.

### 10. Por que o MDC é único?

**Resposta:** Porque o conjunto dos divisores comuns é finito e não vazio (contém 1), logo possui um maior elemento bem definido.

*Noção associada:* MDC — Maior inteiro positivo que divide dois ou mais inteiros.

### 11. Por que o universo precisa ser declarado?

**Resposta:** Porque "o que não está em A" depende do domínio considerado; sem universo, o complementar não é determinado.

*Noção associada:* complementar — Aᶜ contém os elementos do universo que não estão em A.

### 12. Por que o MMC aparece na soma de frações?

**Resposta:** Porque ele é o denominador comum mínimo que preserva o valor das frações e evita números desnecessariamente grandes.

*Noção associada:* MMC — Menor inteiro positivo múltiplo comum de dois ou mais inteiros.

## 3. Repositório de Fórmulas e Códigos Auditados

> **Critério de auditoria:** o OCR local corrompe símbolos matemáticos. Por isso **todas** as fórmulas abaixo estão marcadas como ilustrativas: são reconstruções canônicas dos temas detectados, não transcrições literais. Os números dos gabaritos foram calculados pelo próprio gerador; os snippets foram verificados por `compile()` (Python) e por GCC `-std=c11 -fsyntax-only` (C, compatível com C17).

1. `A ∪ B: card(A ∪ B) = card(A) + card(B) − card(A ∩ B)` — Cardinalidade da união com correção da interseção. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
2. `r = a − b·⌊a/b⌋, 0 ≤ r < b` — Divisão euclidiana: resto sempre menor que o divisor. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
3. `A × B: card(A × B) = card(A)·card(B)` — Cardinalidade do produto cartesiano. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
4. `mdc(a,b) = mdc(b, a mod b)` — Algoritmo de Euclides reduz o problema a restos menores. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
5. `A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)` — Interseção distribui sobre união. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
6. `mmc(a,b) = a·b/mdc(a,b)` — Produto dividido pelo maior divisor comum. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
7. `¬(p ∨ q) ≡ ¬p ∧ ¬q` — Leis de De Morgan para disjunção. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
8. `a/b + c/d = (ad + bc)/(bd)` — Soma de frações com denominador comum. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
9. `p → q ≡ ¬p ∨ q` — Implicação material em forma disjuntiva. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
10. `a/b = (a/k)/(b/k), k ≠ 0` — Simplificação preserva o valor da fração. 〔ilustrativa — reconstrução didática; não extraída literalmente〕

**Snippet 1 — Python** (Python: compile() OK; todas as linhas comentadas):

```python
A = {1, 2, 3, 4}             # define o conjunto A
B = {3, 4, 5}                # define o conjunto B
uniao = A | B                # calcula a união dos dois conjuntos
intersecao = A & B           # calcula a interseção dos dois conjuntos
print(sorted(uniao), sorted(intersecao)) # mostra união e interseção ordenadas
```

**Snippet 2 — C17** (C17: GCC -fsyntax-only OK; todas as linhas comentadas):

```c
#include <stdio.h> // inclui printf
int main(void) { // abre a funcao principal
    unsigned a = 0xBu; // representa o conjunto A como mascara de bits
    unsigned b = 0xCu; // representa o conjunto B como mascara de bits
    unsigned uniao = a | b; // uniao: bit presente em A ou em B
    unsigned inter = a & b; // intersecao: bit presente em A e em B
    printf("%u %u\n", uniao, inter); // imprime as duas mascaras
    return 0; // encerra o programa
} // fecha a funcao principal
```

## 4. Guia Prático: Como Dar Uma Aula Sobre Este Livro

**Analogias para o quadro**

- Um conjunto é uma caixa com etiqueta clara: pertencer é estar dentro da caixa; a união reúne o conteúdo de duas caixas.
- A interseção é a interseção de dois corredores: só passa quem está nos dois; o complementar é tudo que ficou de fora do limite traçado.
- Tabela-verdade é um interruptor com todas as posições possíveis; conectivos são as regras de fiação que decidem a luz final.

**Sequência sugerida no quadro**

- **Passo 1:** Escreva o título FME_1 e o foco lógica, conjuntos, funções e noções de relação; pergunte o que já se sabe sobre conjunto.
- **Passo 2:** Desenhe o mapa da seção 1 e justifique a seta entre conjunto e número natural.
- **Passo 3:** Derive uma fórmula do catálogo (por exemplo, `A ∪ B: card(A ∪ B) = card(A) + card(B) − card(A ∩ B)`) antes de aplicá-la a números.
- **Passo 4:** Resolva um exemplo no quadro em voz alta, marcando onde cada hipótese foi usada.
- **Passo 5:** Peça aos alunos que reformulem o mesmo exemplo com outros dados e comparem os resultados.
- **Passo 6:** Feche com MMC: por que essa ideia aparece em FUNDAMENTOS E DE MATEMÁTICA?

**Perguntas de verificação em aula**

- Por que a definição deve ser bem definida? (Resposta esperada: Porque sem critério objetivo de pertinência não há como decidir se x pertence ao conjunto, e todas as operações seguintes ficam ambíguas.)
- Por que começamos pelos naturais? (Resposta esperada: Porque toda medição e contagem precisa de um conjunto mínimo fechado para somar e multiplicar sem sair dele.)
- Por que distinguir ∈ de ⊂? (Resposta esperada: Porque ∈ liga elemento a conjunto, enquanto ⊂ liga conjunto a conjunto; confundi-los gera afirmações sem sentido.)
- Ao aplicar `r = a − b·⌊a/b⌋, 0 ≤ r < b`, qual hipótese impediria o cálculo? (Resposta esperada: verificar as condições de validade antes de substituir os valores.)

## 5. Avaliação Mestre — 20 Questões com Gabarito Comentado

**Bloco A — 10 questões conceituais**

1. **(Conceitual)** Explique o que é «conjunto» em FME 1 — Conjuntos e Funções e por que essa noção é necessária.
   - **Gabarito comentado:** Coleção bem definida de elementos, com pertinência decidível. Relação: Porque sem critério objetivo de pertinência não há como decidir se x pertence ao conjunto, e todas as operações seguintes ficam ambíguas.
2. **(Conceitual)** Explique o que é «número natural» em FME 1 — Conjuntos e Funções e por que essa noção é necessária.
   - **Gabarito comentado:** Conjunto {0,1,2,3,...} usado para contar e ordenar. Relação: Porque toda medição e contagem precisa de um conjunto mínimo fechado para somar e multiplicar sem sair dele.
3. **(Conceitual)** Explique o que é «pertinência» em FME 1 — Conjuntos e Funções e por que essa noção é necessária.
   - **Gabarito comentado:** Relação x ∈ A que indica x ser elemento de A. Relação: Porque ∈ liga elemento a conjunto, enquanto ⊂ liga conjunto a conjunto; confundi-los gera afirmações sem sentido.
4. **(Conceitual)** Explique o que é «número inteiro» em FME 1 — Conjuntos e Funções e por que essa noção é necessária.
   - **Gabarito comentado:** Naturais, seus opostos e o zero. Relação: Para representar dívida, temperatura abaixo de zero e qualquer grandeza com direção oposta; sem eles, a subtração não seria sempre possível.
5. **(Conceitual)** Explique o que é «subconjunto» em FME 1 — Conjuntos e Funções e por que essa noção é necessária.
   - **Gabarito comentado:** A ⊂ B quando todo elemento de A pertence a B. Relação: Porque a interseção só conserva elementos comuns; se ela já é igual a A, todos os elementos de A estavam em B.
6. **(Conceitual)** Explique o que é «número racional» em FME 1 — Conjuntos e Funções e por que essa noção é necessária.
   - **Gabarito comentado:** Quociente a/b com a inteiro e b inteiro não nulo. Relação: Porque dividir 3 unidades entre 4 pessoas não tem resposta nos inteiros; o racional fecha a divisão (exceto por zero).
7. **(Conceitual)** Explique o que é «união» em FME 1 — Conjuntos e Funções e por que essa noção é necessária.
   - **Gabarito comentado:** A ∪ B reúne os elementos que pertencem a A ou a B. Relação: Porque elementos em A ∩ B seriam contados duas vezes; daí card(A ∪ B) = card(A) + card(B) − card(A ∩ B).
8. **(Conceitual)** Explique o que é «divisibilidade» em FME 1 — Conjuntos e Funções e por que essa noção é necessária.
   - **Gabarito comentado:** Dizer que b divide a quando existe inteiro q com a = bq. Relação: Porque o MDC e o MMC só fazem sentido quando conseguimos reconhecer quais fatores são comuns aos números.
9. **(Conceitual)** Explique o que é «interseção» em FME 1 — Conjuntos e Funções e por que essa noção é necessária.
   - **Gabarito comentado:** A ∩ B contém os elementos comuns a A e B. Relação: Porque pertencer aos dois conjuntos é exatamente a condição simultânea p ∧ q da lógica proposicional.
10. **(Conceitual)** Explique o que é «MDC» em FME 1 — Conjuntos e Funções e por que essa noção é necessária.
   - **Gabarito comentado:** Maior inteiro positivo que divide dois ou mais inteiros. Relação: Porque o conjunto dos divisores comuns é finito e não vazio (contém 1), logo possui um maior elemento bem definido.

**Bloco B — 10 questões práticas**

11. **(Prática)** Se card(A)=12, card(B)=5 e card(A∩B)=3, calcule card(A∪B).
   - **Gabarito comentado:** 14. 12 + 5 − 3 = 14. Verificação: `A ∪ B: card(A ∪ B) = card(A) + card(B) − card(A ∩ B)`.
12. **(Prática)** Na divisão euclidiana de 47 por 5, qual é o resto?
   - **Gabarito comentado:** 2. 47 = 5·9 + 2, e 2 < 5. Verificação: `r = a − b·⌊a/b⌋, 0 ≤ r < b`.
13. **(Prática)** Com card(A)=3 e card(B)=4, calcule card(A×B).
   - **Gabarito comentado:** 12. 3·4 = 12 pares ordenados. Verificação: `A × B: card(A × B) = card(A)·card(B)`.
14. **(Prática)** Calcule mdc(48,18).
   - **Gabarito comentado:** 6. A sequência 18, 12, 6 termina em 6. Verificação: `mdc(a,b) = mdc(b, a mod b)`.
15. **(Prática)** Com a=V, b=F, c=V, a distributiva é verdadeira?
   - **Gabarito comentado:** V (verdadeiro). Ambos os lados são V. Verificação: `A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)`.
16. **(Prática)** Calcule mmc(12,18).
   - **Gabarito comentado:** 36. mdc = 6, logo mmc = 216/6 = 36. Verificação: `mmc(a,b) = a·b/mdc(a,b)`.
17. **(Prática)** Com p=F e q=V, a equivalência de De Morgan é V ou F?
   - **Gabarito comentado:** V (verdadeiro). ¬(F∨V)=F e ¬F∧¬V=F∧V=F; logo V. Verificação: `¬(p ∨ q) ≡ ¬p ∧ ¬q`.
18. **(Prática)** Calcule 1/2 + 1/3.
   - **Gabarito comentado:** 5/6. Denominador comum 6; 3/6 + 2/6 = 5/6. Verificação: `a/b + c/d = (ad + bc)/(bd)`.
19. **(Prática)** Com p=V e q=F, qual é o valor de p → q?
   - **Gabarito comentado:** F (falso). Falso: é a única combinação que viola a promessa condicional. Verificação: `p → q ≡ ¬p ∨ q`.
20. **(Prática)** Simplifique 12/18.
   - **Gabarito comentado:** 2/3. Dividindo por k = 6 obtemos 2/3. Verificação: `a/b = (a/k)/(b/k), k ≠ 0`.

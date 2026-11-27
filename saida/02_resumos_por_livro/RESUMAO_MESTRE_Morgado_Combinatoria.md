# Resumo Mestre — Morgado_Combinatoria

- **Obra:** Análise Combinatória e Probabilidade (Morgado)
- **Autoria registrada no inventário:** Augusto C. Morgado et al.
- **BOOK_ID:** `Morgado_Combinatoria`
- **Capítulos extraídos (fontes locais):** 7 arquivo(s) `capXX.md`
- **Capítulos detectados no índice local:** 7
- **Data de extração informada no índice:** 2026-11-26T20:31:40-03:00
- **Base:** textos extraídos localmente em `saida/01_texto_extraido/Morgado_Combinatoria/`; nenhuma fonte externa foi consultada.
- **Fidelidade:** síntese pedagógica a partir dos capítulos disponíveis; segmentação proporcional do OCR, portanto os 'capítulos' são blocos de texto e não necessariamente capítulos editoriais.
- **Gerado por:** `scripts/generate_master_summaries.py` em 2026-11-27T06:48:35-03:00 (FORGE 7.0, 100% aditivo).

## 1. Mapa Conceitual da Obra (1 página)

```text
Morgado_Combinatoria: conjuntos, princípios de contagem e probabilidade
+-- eixo 1: I S I C A
|   +-- princípio multiplicativo  ->  conjunto
+-- eixo 2: ADQUIRIDO DE
|   +-- princípio aditivo  ->  pertinência
+-- eixo 3: M A M T
|   +-- fatorial  ->  subconjunto
+-- eixo 4: Í A T E M A
    +-- permutação  ->  união
```

- **Títulos reais observados no índice:** I S I C A; ADQUIRIDO DE; M A M T; Í A T E M A.
- **Palavras-chave medida no texto extraído:** probabilidade, modos, elementos, resposta, permutações, eventos, contagem, bolas.
- **Rótulos recorrentes no sumário interno dos capítulos:** 9. Como explicar isso? Galileii estiidou riiidadosamente as pro; 1. Um conjiinto pode tambkm ser descrito por uma p~opriedade; 4. Qiiando temos mais dr! dois coiliimtos, dizemos que eles são; 3. A C R se c sornenlcl se A í l B = A.
- **Conexão lógica:** princípio multiplicativo -> conjunto -> princípio aditivo -> pertinência -> fatorial -> aplicação em I S I C A.
- **Leitura do mapa:** cada eixo vem de um título/indício presente no texto local; os nós em `->` são conceitos didáticos que articulam esse eixo.

## 2. Enciclopédia dos 'Porquês' Respondidos

> Cada entrada responde a uma pergunta de primeira princípios usando definições, axiomas ou escolhas de construção. Quando o OCR é escasso, a resposta é síntese pedagógica a partir dos capítulos disponíveis.

### 1. Por que multiplicar e não somar?

**Resposta:** Porque cada escolha da primeira etapa combina com todas as escolhas da segunda; as combinações formam uma malha retangular.

*Noção associada:* princípio multiplicativo — Se há m escolhas para a primeira etapa e n para a segunda, há m·n resultados.

### 2. Por que a definição deve ser bem definida?

**Resposta:** Porque sem critério objetivo de pertinência não há como decidir se x pertence ao conjunto, e todas as operações seguintes ficam ambíguas.

*Noção associada:* conjunto — Coleção bem definida de elementos, com pertinência decidível.

### 3. Por que excludência é indispensável?

**Resposta:** Porque se as alternativas se sobrepõem, contar duas vezes o mesmo resultado infla a resposta.

*Noção associada:* princípio aditivo — Se etapas alternativas são excludentes, some as contagens.

### 4. Por que distinguir ∈ de ⊂?

**Resposta:** Porque ∈ liga elemento a conjunto, enquanto ⊂ liga conjunto a conjunto; confundi-los gera afirmações sem sentido.

*Noção associada:* pertinência — Relação x ∈ A que indica x ser elemento de A.

### 5. Por que 0! = 1?

**Resposta:** Porque é a única convenção que mantém C(n,n) = 1 e a recorrência n! = n·(n−1)! válida em n = 1.

*Noção associada:* fatorial — n! = 1·2·...·n, com 0! = 1.

### 6. Por que A ∩ B = A caracteriza A ⊂ B?

**Resposta:** Porque a interseção só conserva elementos comuns; se ela já é igual a A, todos os elementos de A estavam em B.

*Noção associada:* subconjunto — A ⊂ B quando todo elemento de A pertence a B.

### 7. Por que ordenar aumenta a contagem?

**Resposta:** Porque os mesmos k elementos geram k! arranjos diferentes quando a ordem é relevante.

*Noção associada:* permutação — Ordenação de elementos; P(n,k) = n!/(n−k)!.

### 8. Por que a união não soma cardinalidades diretamente?

**Resposta:** Porque elementos em A ∩ B seriam contados duas vezes; daí card(A ∪ B) = card(A) + card(B) − card(A ∩ B).

*Noção associada:* união — A ∪ B reúne os elementos que pertencem a A ou a B.

### 9. Por que dividir por k!?

**Resposta:** Porque cada grupo de k elementos aparece k! vezes nas permutações; dividir remove essa redundância.

*Noção associada:* combinação — Seleção sem ordem; C(n,k) = n!/[k!(n−k)!].

### 10. Por que a interseção modela "e" lógico?

**Resposta:** Porque pertencer aos dois conjuntos é exatamente a condição simultânea p ∧ q da lógica proposicional.

*Noção associada:* interseção — A ∩ B contém os elementos comuns a A e B.

### 11. Por que distinguir repetição?

**Resposta:** Porque "algarismos podem se repetir" troca n·(n−1) por nᶜ e muda radicalmente o total.

*Noção associada:* arranjo — Seleção com ordem e sem repetição, ou com repetição conforme o enunciado.

### 12. Por que o universo precisa ser declarado?

**Resposta:** Porque "o que não está em A" depende do domínio considerado; sem universo, o complementar não é determinado.

*Noção associada:* complementar — Aᶜ contém os elementos do universo que não estão em A.

## 3. Repositório de Fórmulas e Códigos Auditados

> **Critério de auditoria:** o OCR local corrompe símbolos matemáticos. Por isso **todas** as fórmulas abaixo estão marcadas como ilustrativas: são reconstruções canônicas dos temas detectados, não transcrições literais. Os números dos gabaritos foram calculados pelo próprio gerador; os snippets foram verificados por `compile()` (Python) e por GCC `-std=c11 -fsyntax-only` (C, compatível com C17).

1. `n! = 1·2·...·n e 0! = 1` — Fatorial. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
2. `A ∪ B: card(A ∪ B) = card(A) + card(B) − card(A ∩ B)` — Cardinalidade da união com correção da interseção. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
3. `P(n,k) = n!/(n−k)!` — Permutação simples sem repetição. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
4. `A × B: card(A × B) = card(A)·card(B)` — Cardinalidade do produto cartesiano. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
5. `C(n,k) = n!/[k!(n−k)!]` — Combinação simples. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
6. `A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)` — Interseção distribui sobre união. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
7. `n^k` — Arranjo com repetição permitida. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
8. `¬(p ∨ q) ≡ ¬p ∧ ¬q` — Leis de De Morgan para disjunção. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
9. `P Total = m₁·m₂·...·mᵣ` — Princípio fundamental da contagem. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
10. `p → q ≡ ¬p ∨ q` — Implicação material em forma disjuntiva. 〔ilustrativa — reconstrução didática; não extraída literalmente〕

**Snippet 1 — Python** (Python: compile() OK; todas as linhas comentadas):

```python
from math import comb, factorial # importa combinação e fatorial
n, k = 8, 3                   # define os parâmetros do exemplo
total = comb(n, k)            # calcula C(8,3) sem repetição
print(total, factorial(k))    # imprime 56 e 6
```

**Snippet 2 — C17** (C17: GCC -fsyntax-only OK; todas as linhas comentadas):

```c
#include <stdio.h> // inclui printf
long fatorial(int n) { // calcula o fatorial de n por iteracao
    long r = 1; // inicializa o acumulador
    for (int i = 2; i <= n; ++i) { // percorre os fatores de 2 ate n
        r *= i; // multiplica o acumulador pelo fator atual
    } // fecha o laco
    return r; // devolve o fatorial calculado
} // fecha a funcao fatorial
int main(void) { // abre a funcao principal
    printf("%ld\n", fatorial(6)); // imprime 720
    return 0; // encerra o programa
} // fecha a funcao principal
```

## 4. Guia Prático: Como Dar Uma Aula Sobre Este Livro

**Analogias para o quadro**

- Escolher roupa é o princípio multiplicativo: cada blusa combina com cada saia; escolher sobremesa ou bebida é o princípio aditivo.
- Ordenar três pessoas em uma fila é permutar; escolher três para uma comissão é combinar — a fila tem ordem, a comissão não.
- Probabilidade é pesar o espaço amostral; a condicional é colocar uma balança nova sobre apenas parte dos resultados.

**Sequência sugerida no quadro**

- **Passo 1:** Escreva o título Morgado_Combinatoria e o foco conjuntos, princípios de contagem e probabilidade; pergunte o que já se sabe sobre princípio multiplicativo.
- **Passo 2:** Desenhe o mapa da seção 1 e justifique a seta entre princípio multiplicativo e conjunto.
- **Passo 3:** Derive uma fórmula do catálogo (por exemplo, `n! = 1·2·...·n e 0! = 1`) antes de aplicá-la a números.
- **Passo 4:** Resolva um exemplo no quadro em voz alta, marcando onde cada hipótese foi usada.
- **Passo 5:** Peça aos alunos que reformulem o mesmo exemplo com outros dados e comparem os resultados.
- **Passo 6:** Feche com complementar: por que essa ideia aparece em I S I C A?

**Perguntas de verificação em aula**

- Por que multiplicar e não somar? (Resposta esperada: Porque cada escolha da primeira etapa combina com todas as escolhas da segunda; as combinações formam uma malha retangular.)
- Por que a definição deve ser bem definida? (Resposta esperada: Porque sem critério objetivo de pertinência não há como decidir se x pertence ao conjunto, e todas as operações seguintes ficam ambíguas.)
- Por que excludência é indispensável? (Resposta esperada: Porque se as alternativas se sobrepõem, contar duas vezes o mesmo resultado infla a resposta.)
- Ao aplicar `A ∪ B: card(A ∪ B) = card(A) + card(B) − card(A ∩ B)`, qual hipótese impediria o cálculo? (Resposta esperada: verificar as condições de validade antes de substituir os valores.)

## 5. Avaliação Mestre — 20 Questões com Gabarito Comentado

**Bloco A — 10 questões conceituais**

1. **(Conceitual)** Explique o que é «princípio multiplicativo» em Análise Combinatória e Probabilidade (Morgado) e por que essa noção é necessária.
   - **Gabarito comentado:** Se há m escolhas para a primeira etapa e n para a segunda, há m·n resultados. Relação: Porque cada escolha da primeira etapa combina com todas as escolhas da segunda; as combinações formam uma malha retangular.
2. **(Conceitual)** Explique o que é «conjunto» em Análise Combinatória e Probabilidade (Morgado) e por que essa noção é necessária.
   - **Gabarito comentado:** Coleção bem definida de elementos, com pertinência decidível. Relação: Porque sem critério objetivo de pertinência não há como decidir se x pertence ao conjunto, e todas as operações seguintes ficam ambíguas.
3. **(Conceitual)** Explique o que é «princípio aditivo» em Análise Combinatória e Probabilidade (Morgado) e por que essa noção é necessária.
   - **Gabarito comentado:** Se etapas alternativas são excludentes, some as contagens. Relação: Porque se as alternativas se sobrepõem, contar duas vezes o mesmo resultado infla a resposta.
4. **(Conceitual)** Explique o que é «pertinência» em Análise Combinatória e Probabilidade (Morgado) e por que essa noção é necessária.
   - **Gabarito comentado:** Relação x ∈ A que indica x ser elemento de A. Relação: Porque ∈ liga elemento a conjunto, enquanto ⊂ liga conjunto a conjunto; confundi-los gera afirmações sem sentido.
5. **(Conceitual)** Explique o que é «fatorial» em Análise Combinatória e Probabilidade (Morgado) e por que essa noção é necessária.
   - **Gabarito comentado:** n! = 1·2·...·n, com 0! = 1. Relação: Porque é a única convenção que mantém C(n,n) = 1 e a recorrência n! = n·(n−1)! válida em n = 1.
6. **(Conceitual)** Explique o que é «subconjunto» em Análise Combinatória e Probabilidade (Morgado) e por que essa noção é necessária.
   - **Gabarito comentado:** A ⊂ B quando todo elemento de A pertence a B. Relação: Porque a interseção só conserva elementos comuns; se ela já é igual a A, todos os elementos de A estavam em B.
7. **(Conceitual)** Explique o que é «permutação» em Análise Combinatória e Probabilidade (Morgado) e por que essa noção é necessária.
   - **Gabarito comentado:** Ordenação de elementos; P(n,k) = n!/(n−k)!. Relação: Porque os mesmos k elementos geram k! arranjos diferentes quando a ordem é relevante.
8. **(Conceitual)** Explique o que é «união» em Análise Combinatória e Probabilidade (Morgado) e por que essa noção é necessária.
   - **Gabarito comentado:** A ∪ B reúne os elementos que pertencem a A ou a B. Relação: Porque elementos em A ∩ B seriam contados duas vezes; daí card(A ∪ B) = card(A) + card(B) − card(A ∩ B).
9. **(Conceitual)** Explique o que é «combinação» em Análise Combinatória e Probabilidade (Morgado) e por que essa noção é necessária.
   - **Gabarito comentado:** Seleção sem ordem; C(n,k) = n!/[k!(n−k)!]. Relação: Porque cada grupo de k elementos aparece k! vezes nas permutações; dividir remove essa redundância.
10. **(Conceitual)** Explique o que é «interseção» em Análise Combinatória e Probabilidade (Morgado) e por que essa noção é necessária.
   - **Gabarito comentado:** A ∩ B contém os elementos comuns a A e B. Relação: Porque pertencer aos dois conjuntos é exatamente a condição simultânea p ∧ q da lógica proposicional.

**Bloco B — 10 questões práticas**

11. **(Prática)** Calcule 6!.
   - **Gabarito comentado:** 720. 720. Verificação: `n! = 1·2·...·n e 0! = 1`.
12. **(Prática)** Se card(A)=12, card(B)=5 e card(A∩B)=3, calcule card(A∪B).
   - **Gabarito comentado:** 14. 12 + 5 − 3 = 14. Verificação: `A ∪ B: card(A ∪ B) = card(A) + card(B) − card(A ∩ B)`.
13. **(Prática)** Calcule P(7,3).
   - **Gabarito comentado:** 210. 7·6·5 = 210. Verificação: `P(n,k) = n!/(n−k)!`.
14. **(Prática)** Com card(A)=3 e card(B)=4, calcule card(A×B).
   - **Gabarito comentado:** 12. 3·4 = 12 pares ordenados. Verificação: `A × B: card(A × B) = card(A)·card(B)`.
15. **(Prática)** Calcule C(8,3).
   - **Gabarito comentado:** 56. 56. Verificação: `C(n,k) = n!/[k!(n−k)!]`.
16. **(Prática)** Com a=V, b=F, c=V, a distributiva é verdadeira?
   - **Gabarito comentado:** V (verdadeiro). Ambos os lados são V. Verificação: `A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)`.
17. **(Prática)** Com 3 algarismos e 4 posições com repetição, quantos números?
   - **Gabarito comentado:** 81. 3⁴ = 81. Verificação: `n^k`.
18. **(Prática)** Com p=F e q=V, a equivalência de De Morgan é V ou F?
   - **Gabarito comentado:** V (verdadeiro). ¬(F∨V)=F e ¬F∧¬V=F∧V=F; logo V. Verificação: `¬(p ∨ q) ≡ ¬p ∧ ¬q`.
19. **(Prática)** 5 blusas e 6 saias dão quantos conjuntos?
   - **Gabarito comentado:** 30. 5·6 = 30. Verificação: `P Total = m₁·m₂·...·mᵣ`.
20. **(Prática)** Com p=V e q=F, qual é o valor de p → q?
   - **Gabarito comentado:** F (falso). Falso: é a única combinação que viola a promessa condicional. Verificação: `p → q ≡ ¬p ∨ q`.

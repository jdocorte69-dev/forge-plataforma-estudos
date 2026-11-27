# Resumo Mestre — FME_5

- **Obra:** FME 5 — Análise Combinatória e Probabilidade
- **Autoria registrada no inventário:** Hazzan / Murakami
- **BOOK_ID:** `FME_5`
- **Capítulos extraídos (fontes locais):** 20 arquivo(s) `capXX.md`
- **Capítulos detectados no índice local:** 20
- **Data de extração informada no índice:** 2026-11-26T20:31:40-03:00
- **Base:** textos extraídos localmente em `saida/01_texto_extraido/FME_5/`; nenhuma fonte externa foi consultada.
- **Fidelidade:** síntese pedagógica a partir dos capítulos disponíveis; segmentação proporcional do OCR, portanto os 'capítulos' são blocos de texto e não necessariamente capítulos editoriais.
- **Gerado por:** `scripts/generate_master_summaries.py` em 2026-11-27T06:48:35-03:00 (FORGE 7.0, 100% aditivo).

## 1. Mapa Conceitual da Obra (1 página)

```text
FME_5: contagem, permutações, combinações e probabilidade
+-- eixo 1: FUNDAMENTOS DE MATEMÁTICA ELEMENTAR
|   +-- princípio multiplicativo  ->  princípio aditivo
+-- eixo 2: SAMUEL HAZZAN
|   +-- fatorial  ->  permutação
+-- eixo 3: SAMUEL HAZZAN FUNDAMENTOS DE MATEMÁTICA ELEMENTAR
|   +-- combinação  ->  arranjo
+-- eixo 4: ANÁLISE COMBINATÓRIA
    +-- binomial  ->  espaço amostral
```

- **Títulos reais observados no índice:** FUNDAMENTOS DE MATEMÁTICA ELEMENTAR; SAMUEL HAZZAN; SAMUEL HAZZAN FUNDAMENTOS DE MATEMÁTICA ELEMENTAR; ANÁLISE COMBINATÓRIA.
- **Palavras-chave medida no texto extraído:** probabilidade, quantas, elementos, acaso, bolas, evento, quantos, eventos.
- **Rótulos recorrentes no sumário interno dos capítulos:** 3. Tal princípio consta de duas partes (A e B) ligeiramente diferentes. Antes de; 4. ILemal; 5. Exemplos:; 6. Lema 2
- **Conexão lógica:** princípio multiplicativo -> princípio aditivo -> fatorial -> permutação -> combinação -> aplicação em FUNDAMENTOS DE MATEMÁTICA ELEMENTAR.
- **Leitura do mapa:** cada eixo vem de um título/indício presente no texto local; os nós em `->` são conceitos didáticos que articulam esse eixo.

## 2. Enciclopédia dos 'Porquês' Respondidos

> Cada entrada responde a uma pergunta de primeira princípios usando definições, axiomas ou escolhas de construção. Quando o OCR é escasso, a resposta é síntese pedagógica a partir dos capítulos disponíveis.

### 1. Por que multiplicar e não somar?

**Resposta:** Porque cada escolha da primeira etapa combina com todas as escolhas da segunda; as combinações formam uma malha retangular.

*Noção associada:* princípio multiplicativo — Se há m escolhas para a primeira etapa e n para a segunda, há m·n resultados.

### 2. Por que excludência é indispensável?

**Resposta:** Porque se as alternativas se sobrepõem, contar duas vezes o mesmo resultado infla a resposta.

*Noção associada:* princípio aditivo — Se etapas alternativas são excludentes, some as contagens.

### 3. Por que 0! = 1?

**Resposta:** Porque é a única convenção que mantém C(n,n) = 1 e a recorrência n! = n·(n−1)! válida em n = 1.

*Noção associada:* fatorial — n! = 1·2·...·n, com 0! = 1.

### 4. Por que ordenar aumenta a contagem?

**Resposta:** Porque os mesmos k elementos geram k! arranjos diferentes quando a ordem é relevante.

*Noção associada:* permutação — Ordenação de elementos; P(n,k) = n!/(n−k)!.

### 5. Por que dividir por k!?

**Resposta:** Porque cada grupo de k elementos aparece k! vezes nas permutações; dividir remove essa redundância.

*Noção associada:* combinação — Seleção sem ordem; C(n,k) = n!/[k!(n−k)!].

### 6. Por que distinguir repetição?

**Resposta:** Porque "algarismos podem se repetir" troca n·(n−1) por nᶜ e muda radicalmente o total.

*Noção associada:* arranjo — Seleção com ordem e sem repetição, ou com repetição conforme o enunciado.

### 7. Por que os coeficientes são combinações?

**Resposta:** Porque escolher k fatores para fornecer y entre n fatores idênticos é exatamente escolher um subconjunto de tamanho k.

*Noção associada:* binomial — (x + y)ⁿ = Σ C(n,k)xⁿ⁻ᵏyᵏ.

### 8. Por que defini-lo antes de calcular?

**Resposta:** Porque probabilidade é razão entre eventos e espaço amostral; sem esse conjunto não há denominador.

*Noção associada:* espaço amostral — Conjunto de todos os resultados possíveis de um experimento.

### 9. Por que equiprovabilidade é hipótese necessária?

**Resposta:** Porque contar resultados só equivale a medir chance quando cada resultado tem o mesmo peso.

*Noção associada:* probabilidade clássica — P(A) = card(A)/card(Ω) quando todos os resultados são equiprováveis.

### 10. Por que o denominador muda para P(B)?

**Resposta:** Porque restringimos o universo aos casos em que B ocorreu; a nova escala é P(B).

*Noção associada:* probabilidade condicional — P(A dado B) = P(A∩B)/P(B), com P(B) > 0.

### 11. Por que independência não é o mesmo que disjointo?

**Resposta:** Porque eventos disjuntos têm P(A∩B) = 0, enquanto independentes podem ocorrer juntos com probabilidade produto.

*Noção associada:* independência — P(A∩B) = P(A)·P(B).

### 12. Por que subtrair a interseção?

**Resposta:** Porque os resultados comuns foram somados duas vezes e devem ser contados uma única vez.

*Noção associada:* inclusão-exclusão — P(A∪B) = P(A)+P(B)−P(A∩B).

## 3. Repositório de Fórmulas e Códigos Auditados

> **Critério de auditoria:** o OCR local corrompe símbolos matemáticos. Por isso **todas** as fórmulas abaixo estão marcadas como ilustrativas: são reconstruções canônicas dos temas detectados, não transcrições literais. Os números dos gabaritos foram calculados pelo próprio gerador; os snippets foram verificados por `compile()` (Python) e por GCC `-std=c11 -fsyntax-only` (C, compatível com C17).

1. `n! = 1·2·...·n e 0! = 1` — Fatorial. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
2. `P(n,k) = n!/(n−k)!` — Permutação simples sem repetição. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
3. `C(n,k) = n!/[k!(n−k)!]` — Combinação simples. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
4. `n^k` — Arranjo com repetição permitida. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
5. `P Total = m₁·m₂·...·mᵣ` — Princípio fundamental da contagem. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
6. `Coeficiente de xⁿ⁻ᵏyᵏ em (x+y)ⁿ é C(n,k)` — Teorema binomial. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
7. `P(A∪B) = P(A)+P(B)−P(A∩B)` — Probabilidade da união. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
8. `P(A dado B) = P(A∩B)/P(B), P(B)>0` — Probabilidade condicional. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
9. `P(A∩B) = P(A)·P(B)` — Eventos independentes. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
10. `P(Aᶜ) = 1 − P(A)` — Probabilidade do complementar. 〔ilustrativa — reconstrução didática; não extraída literalmente〕

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

- **Passo 1:** Escreva o título FME_5 e o foco contagem, permutações, combinações e probabilidade; pergunte o que já se sabe sobre princípio multiplicativo.
- **Passo 2:** Desenhe o mapa da seção 1 e justifique a seta entre princípio multiplicativo e princípio aditivo.
- **Passo 3:** Derive uma fórmula do catálogo (por exemplo, `n! = 1·2·...·n e 0! = 1`) antes de aplicá-la a números.
- **Passo 4:** Resolva um exemplo no quadro em voz alta, marcando onde cada hipótese foi usada.
- **Passo 5:** Peça aos alunos que reformulem o mesmo exemplo com outros dados e comparem os resultados.
- **Passo 6:** Feche com inclusão-exclusão: por que essa ideia aparece em FUNDAMENTOS DE MATEMÁTICA ELEMENTAR?

**Perguntas de verificação em aula**

- Por que multiplicar e não somar? (Resposta esperada: Porque cada escolha da primeira etapa combina com todas as escolhas da segunda; as combinações formam uma malha retangular.)
- Por que excludência é indispensável? (Resposta esperada: Porque se as alternativas se sobrepõem, contar duas vezes o mesmo resultado infla a resposta.)
- Por que 0! = 1? (Resposta esperada: Porque é a única convenção que mantém C(n,n) = 1 e a recorrência n! = n·(n−1)! válida em n = 1.)
- Ao aplicar `P(n,k) = n!/(n−k)!`, qual hipótese impediria o cálculo? (Resposta esperada: verificar as condições de validade antes de substituir os valores.)

## 5. Avaliação Mestre — 20 Questões com Gabarito Comentado

**Bloco A — 10 questões conceituais**

1. **(Conceitual)** Explique o que é «princípio multiplicativo» em FME 5 — Análise Combinatória e Probabilidade e por que essa noção é necessária.
   - **Gabarito comentado:** Se há m escolhas para a primeira etapa e n para a segunda, há m·n resultados. Relação: Porque cada escolha da primeira etapa combina com todas as escolhas da segunda; as combinações formam uma malha retangular.
2. **(Conceitual)** Explique o que é «princípio aditivo» em FME 5 — Análise Combinatória e Probabilidade e por que essa noção é necessária.
   - **Gabarito comentado:** Se etapas alternativas são excludentes, some as contagens. Relação: Porque se as alternativas se sobrepõem, contar duas vezes o mesmo resultado infla a resposta.
3. **(Conceitual)** Explique o que é «fatorial» em FME 5 — Análise Combinatória e Probabilidade e por que essa noção é necessária.
   - **Gabarito comentado:** n! = 1·2·...·n, com 0! = 1. Relação: Porque é a única convenção que mantém C(n,n) = 1 e a recorrência n! = n·(n−1)! válida em n = 1.
4. **(Conceitual)** Explique o que é «permutação» em FME 5 — Análise Combinatória e Probabilidade e por que essa noção é necessária.
   - **Gabarito comentado:** Ordenação de elementos; P(n,k) = n!/(n−k)!. Relação: Porque os mesmos k elementos geram k! arranjos diferentes quando a ordem é relevante.
5. **(Conceitual)** Explique o que é «combinação» em FME 5 — Análise Combinatória e Probabilidade e por que essa noção é necessária.
   - **Gabarito comentado:** Seleção sem ordem; C(n,k) = n!/[k!(n−k)!]. Relação: Porque cada grupo de k elementos aparece k! vezes nas permutações; dividir remove essa redundância.
6. **(Conceitual)** Explique o que é «arranjo» em FME 5 — Análise Combinatória e Probabilidade e por que essa noção é necessária.
   - **Gabarito comentado:** Seleção com ordem e sem repetição, ou com repetição conforme o enunciado. Relação: Porque "algarismos podem se repetir" troca n·(n−1) por nᶜ e muda radicalmente o total.
7. **(Conceitual)** Explique o que é «binomial» em FME 5 — Análise Combinatória e Probabilidade e por que essa noção é necessária.
   - **Gabarito comentado:** (x + y)ⁿ = Σ C(n,k)xⁿ⁻ᵏyᵏ. Relação: Porque escolher k fatores para fornecer y entre n fatores idênticos é exatamente escolher um subconjunto de tamanho k.
8. **(Conceitual)** Explique o que é «espaço amostral» em FME 5 — Análise Combinatória e Probabilidade e por que essa noção é necessária.
   - **Gabarito comentado:** Conjunto de todos os resultados possíveis de um experimento. Relação: Porque probabilidade é razão entre eventos e espaço amostral; sem esse conjunto não há denominador.
9. **(Conceitual)** Explique o que é «probabilidade clássica» em FME 5 — Análise Combinatória e Probabilidade e por que essa noção é necessária.
   - **Gabarito comentado:** P(A) = card(A)/card(Ω) quando todos os resultados são equiprováveis. Relação: Porque contar resultados só equivale a medir chance quando cada resultado tem o mesmo peso.
10. **(Conceitual)** Explique o que é «probabilidade condicional» em FME 5 — Análise Combinatória e Probabilidade e por que essa noção é necessária.
   - **Gabarito comentado:** P(A dado B) = P(A∩B)/P(B), com P(B) > 0. Relação: Porque restringimos o universo aos casos em que B ocorreu; a nova escala é P(B).

**Bloco B — 10 questões práticas**

11. **(Prática)** Calcule 6!.
   - **Gabarito comentado:** 720. 720. Verificação: `n! = 1·2·...·n e 0! = 1`.
12. **(Prática)** Calcule P(7,3).
   - **Gabarito comentado:** 210. 7·6·5 = 210. Verificação: `P(n,k) = n!/(n−k)!`.
13. **(Prática)** Calcule C(8,3).
   - **Gabarito comentado:** 56. 56. Verificação: `C(n,k) = n!/[k!(n−k)!]`.
14. **(Prática)** Com 3 algarismos e 4 posições com repetição, quantos números?
   - **Gabarito comentado:** 81. 3⁴ = 81. Verificação: `n^k`.
15. **(Prática)** 5 blusas e 6 saias dão quantos conjuntos?
   - **Gabarito comentado:** 30. 5·6 = 30. Verificação: `P Total = m₁·m₂·...·mᵣ`.
16. **(Prática)** Qual o coeficiente de x³y² em (x+y)⁵?
   - **Gabarito comentado:** 10. C(5,2) = 10. Verificação: `Coeficiente de xⁿ⁻ᵏyᵏ em (x+y)ⁿ é C(n,k)`.
17. **(Prática)** Com P(A)=0,4; P(B)=0,3; P(A∩B)=0,1, calcule P(A∪B).
   - **Gabarito comentado:** 0,6. 0,4+0,3−0,1 = 0,6. Verificação: `P(A∪B) = P(A)+P(B)−P(A∩B)`.
18. **(Prática)** Com P(A∩B)=0,2 e P(B)=0,5, calcule P(A dado B).
   - **Gabarito comentado:** 0,4. 0,2/0,5 = 0,4. Verificação: `P(A dado B) = P(A∩B)/P(B), P(B)>0`.
19. **(Prática)** Se P(A)=0,3 e P(B)=0,4 e são independentes, calcule P(A∩B).
   - **Gabarito comentado:** 0,12. 0,3·0,4 = 0,12. Verificação: `P(A∩B) = P(A)·P(B)`.
20. **(Prática)** Se P(A)=0,7, calcule P(Aᶜ).
   - **Gabarito comentado:** 0,3. 1 − 0,7 = 0,3. Verificação: `P(Aᶜ) = 1 − P(A)`.

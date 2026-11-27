# Resumo Mestre — TQM_Fundamental

- **Obra:** TQM — Ensino Fundamental (verde)
- **Autoria registrada no inventário:** Roberto Ávila
- **BOOK_ID:** `TQM_Fundamental`
- **Capítulos extraídos (fontes locais):** 30 arquivo(s) `capXX.md`
- **Capítulos detectados no índice local:** 30
- **Data de extração informada no índice:** 2026-11-26T20:31:39-03:00
- **Base:** textos extraídos localmente em `saida/01_texto_extraido/TQM_Fundamental/`; nenhuma fonte externa foi consultada.
- **Fidelidade:** síntese pedagógica a partir dos capítulos disponíveis; segmentação proporcional do OCR, portanto os 'capítulos' são blocos de texto e não necessariamente capítulos editoriais.
- **Gerado por:** `scripts/generate_master_summaries.py` em 2026-11-27T06:48:35-03:00 (FORGE 7.0, 100% aditivo).

## 1. Mapa Conceitual da Obra (1 página)

```text
TQM_Fundamental: aritmética, divisibilidade, frações, razões e geometria elementar
+-- eixo 1: — 29 caso: Base qualquer para base 10
|   +-- número natural  ->  número inteiro
+-- eixo 2: Sistema decimal de питегсао mimi eee reten 04
|   +-- número racional  ->  divisibilidade
+-- eixo 3: Operações fundamentais ci ette 09
|   +-- MDC  ->  MMC
+-- eixo 4: Números РИТОВ әниен ннн эмимимимөмөнимимэмиөнөөөөэнтөт 16
    +-- fração equivalente  ->  razão
```

- **Títulos reais observados no índice:** — 29 caso: Base qualquer para base 10; Sistema decimal de питегсао mimi eee reten 04; Operações fundamentais ci ette 09; Números РИТОВ әниен ннн эмимимимөмөнимимэмиөнөөөөэнтөт 16.
- **Palavras-chave medida no texto extraído:** triángulo, nümero, maior, sabendo, menor, resto, círculo, conjunto.
- **Rótulos recorrentes no sumário interno dos capítulos:** 4. DIVISÃO; Capítulo 3; Capítulo. 3; 1. Assim, por exemplo, se n = 12, tem-se:
- **Conexão lógica:** número natural -> número inteiro -> número racional -> divisibilidade -> MDC -> aplicação em — 29 caso: Base qualquer para base 10.
- **Leitura do mapa:** cada eixo vem de um título/indício presente no texto local; os nós em `->` são conceitos didáticos que articulam esse eixo.

## 2. Enciclopédia dos 'Porquês' Respondidos

> Cada entrada responde a uma pergunta de primeira princípios usando definições, axiomas ou escolhas de construção. Quando o OCR é escasso, a resposta é síntese pedagógica a partir dos capítulos disponíveis.

### 1. Por que começamos pelos naturais?

**Resposta:** Porque toda medição e contagem precisa de um conjunto mínimo fechado para somar e multiplicar sem sair dele.

*Noção associada:* número natural — Conjunto {0,1,2,3,...} usado para contar e ordenar.

### 2. Por que incluir negativos?

**Resposta:** Para representar dívida, temperatura abaixo de zero e qualquer grandeza com direção oposta; sem eles, a subtração não seria sempre possível.

*Noção associada:* número inteiro — Naturais, seus opostos e o zero.

### 3. Por que frações são necessárias?

**Resposta:** Porque dividir 3 unidades entre 4 pessoas não tem resposta nos inteiros; o racional fecha a divisão (exceto por zero).

*Noção associada:* número racional — Quociente a/b com a inteiro e b inteiro não nulo.

### 4. Por que definir divisibilidade antes do MDC?

**Resposta:** Porque o MDC e o MMC só fazem sentido quando conseguimos reconhecer quais fatores são comuns aos números.

*Noção associada:* divisibilidade — Dizer que b divide a quando existe inteiro q com a = bq.

### 5. Por que o MDC é único?

**Resposta:** Porque o conjunto dos divisores comuns é finito e não vazio (contém 1), logo possui um maior elemento bem definido.

*Noção associada:* MDC — Maior inteiro positivo que divide dois ou mais inteiros.

### 6. Por que o MMC aparece na soma de frações?

**Resposta:** Porque ele é o denominador comum mínimo que preserva o valor das frações e evita números desnecessariamente grandes.

*Noção associada:* MMC — Menor inteiro positivo múltiplo comum de dois ou mais inteiros.

### 7. Por que multiplicar numerador e denominador pelo mesmo fator não muda o valor?

**Resposta:** Porque isso equivale a multiplicar por k/k = 1; a identidade multiplicativa preserva o número.

*Noção associada:* fração equivalente — a/b e c/d representam o mesmo número quando ad = bc.

### 8. Por que razões exigem mesma unidade?

**Resposta:** Porque comparar 2 metros com 3 centímetros diretamente daria 2/3 em vez de 200/3 após converter.

*Noção associada:* razão — Comparação de duas grandezas por quociente.

### 9. Por que a igualdade ad = bc é útil?

**Resposta:** Porque remove denominadores e transforma uma relação de grandezas em uma equação linear simples.

*Noção associada:* proporção — Igualdade entre duas razões.

### 10. Por que usar 100 como referência?

**Resposta:** Porque padroniza comparações de partes de inteiros diferentes e permite comunicar variações com uma escala comum.

*Noção associada:* porcentagem — Razão com denominador 100.

### 11. Por que a⁰ = 1?

**Resposta:** Para que a regra aᵐ·aⁿ = aᵐ⁺ⁿ continue válida quando n = 0; impor outro valor quebraria a consistência algébrica.

*Noção associada:* potência — aⁿ representa n fatores iguais a a multiplicados.

### 12. Por que raiz de índice par exige a ≥ 0 no conjunto real?

**Resposta:** Porque x² é sempre não negativo no conjunto real; exigir √(−1) real levaria a contradição.

*Noção associada:* raiz — ⁿ√a é o número x tal que xⁿ = a (com restrições de sinal).

## 3. Repositório de Fórmulas e Códigos Auditados

> **Critério de auditoria:** o OCR local corrompe símbolos matemáticos. Por isso **todas** as fórmulas abaixo estão marcadas como ilustrativas: são reconstruções canônicas dos temas detectados, não transcrições literais. Os números dos gabaritos foram calculados pelo próprio gerador; os snippets foram verificados por `compile()` (Python) e por GCC `-std=c11 -fsyntax-only` (C, compatível com C17).

1. `r = a − b·⌊a/b⌋, 0 ≤ r < b` — Divisão euclidiana: resto sempre menor que o divisor. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
2. `mdc(a,b) = mdc(b, a mod b)` — Algoritmo de Euclides reduz o problema a restos menores. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
3. `mmc(a,b) = a·b/mdc(a,b)` — Produto dividido pelo maior divisor comum. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
4. `a/b + c/d = (ad + bc)/(bd)` — Soma de frações com denominador comum. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
5. `a/b = (a/k)/(b/k), k ≠ 0` — Simplificação preserva o valor da fração. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
6. `a/b = c/d ⇒ ad = bc` — Produto cruzado remove denominadores. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
7. `Vf = Vi·(1 + p/100)` — Aumento percentual como fator multiplicativo. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
8. `aᵐ·aⁿ = aᵐ⁺ⁿ` — Multiplicação de potências de mesma base. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
9. `(a+b)(a−b) = a² − b²` — Diferença de quadrados. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
10. `(a+b)² = a² + 2ab + b²` — Quadrado da soma. 〔ilustrativa — reconstrução didática; não extraída literalmente〕

**Snippet 1 — Python** (Python: compile() OK; todas as linhas comentadas):

```python
from math import gcd       # importa o algoritmo de Euclides da biblioteca padrão
a, b = 48, 18              # define os dois inteiros do exemplo
m = gcd(a, b)              # calcula o máximo divisor comum
l = a // m * b             # calcula o mmc dividindo antes para evitar crescimento
print(f"mdc={m}, mmc={l}") # mostra mdc=6 e mmc=144
```

**Snippet 2 — C17** (C17: GCC -fsyntax-only OK; todas as linhas comentadas):

```c
#include <stdio.h> // inclui a funcao printf
int main(void) { // abre a funcao principal
    double inicial = 200.0; // define o valor inicial
    double taxa = 12.5; // define a taxa percentual
    double final = inicial * (1.0 + taxa / 100.0); // aplica o fator de aumento
    printf("final = %.2f\n", final); // imprime o valor final
    return 0; // encerra o programa com sucesso
} // fecha a funcao principal
```

## 4. Guia Prático: Como Dar Uma Aula Sobre Este Livro

**Analogias para o quadro**

- Contar moedas é o modelo dos naturais; devolver uma moeda emprestada explica o negativo; dividir uma pizza em fatias explica a fração.
- O MDC é como encontrar a maior 'régua' que mede dois comprimentos sem sobra; o MMC é o primeiro ponto onde duas esteiras se encontram.
- Uma porcentagem é uma receita escrita por 100 porções: o fator multiplicativo é o modo de aplicar a receita a qualquer quantidade.

**Sequência sugerida no quadro**

- **Passo 1:** Escreva o título TQM_Fundamental e o foco aritmética, divisibilidade, frações, razões e geometria elementar; pergunte o que já se sabe sobre número natural.
- **Passo 2:** Desenhe o mapa da seção 1 e justifique a seta entre número natural e número inteiro.
- **Passo 3:** Derive uma fórmula do catálogo (por exemplo, `r = a − b·⌊a/b⌋, 0 ≤ r < b`) antes de aplicá-la a números.
- **Passo 4:** Resolva um exemplo no quadro em voz alta, marcando onde cada hipótese foi usada.
- **Passo 5:** Peça aos alunos que reformulem o mesmo exemplo com outros dados e comparem os resultados.
- **Passo 6:** Feche com raiz: por que essa ideia aparece em — 29 caso: Base qualquer para base 10?

**Perguntas de verificação em aula**

- Por que começamos pelos naturais? (Resposta esperada: Porque toda medição e contagem precisa de um conjunto mínimo fechado para somar e multiplicar sem sair dele.)
- Por que incluir negativos? (Resposta esperada: Para representar dívida, temperatura abaixo de zero e qualquer grandeza com direção oposta; sem eles, a subtração não seria sempre possível.)
- Por que frações são necessárias? (Resposta esperada: Porque dividir 3 unidades entre 4 pessoas não tem resposta nos inteiros; o racional fecha a divisão (exceto por zero).)
- Ao aplicar `mdc(a,b) = mdc(b, a mod b)`, qual hipótese impediria o cálculo? (Resposta esperada: verificar as condições de validade antes de substituir os valores.)

## 5. Avaliação Mestre — 20 Questões com Gabarito Comentado

**Bloco A — 10 questões conceituais**

1. **(Conceitual)** Explique o que é «número natural» em TQM — Ensino Fundamental (verde) e por que essa noção é necessária.
   - **Gabarito comentado:** Conjunto {0,1,2,3,...} usado para contar e ordenar. Relação: Porque toda medição e contagem precisa de um conjunto mínimo fechado para somar e multiplicar sem sair dele.
2. **(Conceitual)** Explique o que é «número inteiro» em TQM — Ensino Fundamental (verde) e por que essa noção é necessária.
   - **Gabarito comentado:** Naturais, seus opostos e o zero. Relação: Para representar dívida, temperatura abaixo de zero e qualquer grandeza com direção oposta; sem eles, a subtração não seria sempre possível.
3. **(Conceitual)** Explique o que é «número racional» em TQM — Ensino Fundamental (verde) e por que essa noção é necessária.
   - **Gabarito comentado:** Quociente a/b com a inteiro e b inteiro não nulo. Relação: Porque dividir 3 unidades entre 4 pessoas não tem resposta nos inteiros; o racional fecha a divisão (exceto por zero).
4. **(Conceitual)** Explique o que é «divisibilidade» em TQM — Ensino Fundamental (verde) e por que essa noção é necessária.
   - **Gabarito comentado:** Dizer que b divide a quando existe inteiro q com a = bq. Relação: Porque o MDC e o MMC só fazem sentido quando conseguimos reconhecer quais fatores são comuns aos números.
5. **(Conceitual)** Explique o que é «MDC» em TQM — Ensino Fundamental (verde) e por que essa noção é necessária.
   - **Gabarito comentado:** Maior inteiro positivo que divide dois ou mais inteiros. Relação: Porque o conjunto dos divisores comuns é finito e não vazio (contém 1), logo possui um maior elemento bem definido.
6. **(Conceitual)** Explique o que é «MMC» em TQM — Ensino Fundamental (verde) e por que essa noção é necessária.
   - **Gabarito comentado:** Menor inteiro positivo múltiplo comum de dois ou mais inteiros. Relação: Porque ele é o denominador comum mínimo que preserva o valor das frações e evita números desnecessariamente grandes.
7. **(Conceitual)** Explique o que é «fração equivalente» em TQM — Ensino Fundamental (verde) e por que essa noção é necessária.
   - **Gabarito comentado:** a/b e c/d representam o mesmo número quando ad = bc. Relação: Porque isso equivale a multiplicar por k/k = 1; a identidade multiplicativa preserva o número.
8. **(Conceitual)** Explique o que é «razão» em TQM — Ensino Fundamental (verde) e por que essa noção é necessária.
   - **Gabarito comentado:** Comparação de duas grandezas por quociente. Relação: Porque comparar 2 metros com 3 centímetros diretamente daria 2/3 em vez de 200/3 após converter.
9. **(Conceitual)** Explique o que é «proporção» em TQM — Ensino Fundamental (verde) e por que essa noção é necessária.
   - **Gabarito comentado:** Igualdade entre duas razões. Relação: Porque remove denominadores e transforma uma relação de grandezas em uma equação linear simples.
10. **(Conceitual)** Explique o que é «porcentagem» em TQM — Ensino Fundamental (verde) e por que essa noção é necessária.
   - **Gabarito comentado:** Razão com denominador 100. Relação: Porque padroniza comparações de partes de inteiros diferentes e permite comunicar variações com uma escala comum.

**Bloco B — 10 questões práticas**

11. **(Prática)** Na divisão euclidiana de 47 por 5, qual é o resto?
   - **Gabarito comentado:** 2. 47 = 5·9 + 2, e 2 < 5. Verificação: `r = a − b·⌊a/b⌋, 0 ≤ r < b`.
12. **(Prática)** Calcule mdc(48,18).
   - **Gabarito comentado:** 6. A sequência 18, 12, 6 termina em 6. Verificação: `mdc(a,b) = mdc(b, a mod b)`.
13. **(Prática)** Calcule mmc(12,18).
   - **Gabarito comentado:** 36. mdc = 6, logo mmc = 216/6 = 36. Verificação: `mmc(a,b) = a·b/mdc(a,b)`.
14. **(Prática)** Calcule 1/2 + 1/3.
   - **Gabarito comentado:** 5/6. Denominador comum 6; 3/6 + 2/6 = 5/6. Verificação: `a/b + c/d = (ad + bc)/(bd)`.
15. **(Prática)** Simplifique 12/18.
   - **Gabarito comentado:** 2/3. Dividindo por k = 6 obtemos 2/3. Verificação: `a/b = (a/k)/(b/k), k ≠ 0`.
16. **(Prática)** Se 2/3 = 4/6, qual é o valor do produto cruzado ad?
   - **Gabarito comentado:** 12. 2·6 = 12 = 3·4. Verificação: `a/b = c/d ⇒ ad = bc`.
17. **(Prática)** Um valor de 200 sofre aumento de 12,5%. Qual o novo valor?
   - **Gabarito comentado:** 225. Fator 1,125; 200·1,125 = 225. Verificação: `Vf = Vi·(1 + p/100)`.
18. **(Prática)** Calcule 2³·2⁴.
   - **Gabarito comentado:** 128. Somando expoentes: 2⁷ = 128. Verificação: `aᵐ·aⁿ = aᵐ⁺ⁿ`.
19. **(Prática)** Calcule (7+3)(7−3).
   - **Gabarito comentado:** 40. 49 − 9 = 40. Verificação: `(a+b)(a−b) = a² − b²`.
20. **(Prática)** Calcule (5+2)².
   - **Gabarito comentado:** 49. 25 + 20 + 4 = 49. Verificação: `(a+b)² = a² + 2ab + b²`.

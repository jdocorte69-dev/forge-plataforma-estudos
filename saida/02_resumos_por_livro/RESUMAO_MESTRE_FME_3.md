# Resumo Mestre — FME_3

- **Obra:** FME 3 — Trigonometria
- **Autoria registrada no inventário:** Iezzi / Dolce / Murakami
- **BOOK_ID:** `FME_3`
- **Capítulos extraídos (fontes locais):** 20 arquivo(s) `capXX.md`
- **Capítulos detectados no índice local:** 20
- **Data de extração informada no índice:** 2026-11-26T20:31:40-03:00
- **Base:** textos extraídos localmente em `saida/01_texto_extraido/FME_3/`; nenhuma fonte externa foi consultada.
- **Fidelidade:** síntese pedagógica a partir dos capítulos disponíveis; segmentação proporcional do OCR, portanto os 'capítulos' são blocos de texto e não necessariamente capítulos editoriais.
- **Gerado por:** `scripts/generate_master_summaries.py` em 2026-11-27T06:48:35-03:00 (FORGE 7.0, 100% aditivo).

## 1. Mapa Conceitual da Obra (1 página)

```text
FME_3: ângulos, razões trigonométricas, ciclo e equações
+-- eixo 1: FUNDAMENTOS DE MATEMÁTICA ELEMENTAR
|   +-- ângulo  ->  radiano
+-- eixo 2: GELSON IEZZI
|   +-- seno  ->  cosseno
+-- eixo 3: GELSON IEZZI FUNDAMENTOS DE MATEMÁTICA ELEMENTAR
|   +-- tangente  ->  cossecante
+-- eixo 4: REVISÃO INICIAL DE GEOMETRIA
    +-- ciclo trigonométrico  ->  quadrante
```

- **Títulos reais observados no índice:** FUNDAMENTOS DE MATEMÁTICA ELEMENTAR; GELSON IEZZI; GELSON IEZZI FUNDAMENTOS DE MATEMÁTICA ELEMENTAR; REVISÃO INICIAL DE GEOMETRIA.
- **Palavras-chave medida no texto extraído:** função, ângulo, triângulo, cossec, ciclo, funções, quadrante, ângulos.
- **Rótulos recorrentes no sumário interno dos capítulos:** CAPÍTULO XI-= Emuações sos n SDS ei a R 159; CAPÍTULO XII — Inequações ... sssssissieseresereseeresrnsda 182; CAPÍTULO XIII — Funções circulares inversas ... citreterserenes 197; 1. Semirreta
- **Conexão lógica:** ângulo -> radiano -> seno -> cosseno -> tangente -> aplicação em FUNDAMENTOS DE MATEMÁTICA ELEMENTAR.
- **Leitura do mapa:** cada eixo vem de um título/indício presente no texto local; os nós em `->` são conceitos didáticos que articulam esse eixo.

## 2. Enciclopédia dos 'Porquês' Respondidos

> Cada entrada responde a uma pergunta de primeira princípios usando definições, axiomas ou escolhas de construção. Quando o OCR é escasso, a resposta é síntese pedagógica a partir dos capítulos disponíveis.

### 1. Por que precisamos medir rotação e não só distância?

**Resposta:** Porque formas inclinadas não são descritas apenas por comprimentos; a abertura entre direções é uma grandeza independente.

*Noção associada:* ângulo — Figura formada por duas semirretas com origem comum.

### 2. Por que o radiano é natural em cálculo?

**Resposta:** Porque s = rθ elimina fatores de conversão e torna derivadas trigonométricas simples.

*Noção associada:* radiano — Ângulo cuja medida é o comprimento do arco dividido pelo raio.

### 3. Por que seno depende só do ângulo?

**Resposta:** Porque triângulos retângulos semelhantes mantêm a mesma razão entre cateto oposto e hipotenusa.

*Noção associada:* seno — No triângulo retângulo, cateto oposto dividido pela hipotenusa.

### 4. Por que seno e cosseno satisfazem s² + c² = 1?

**Resposta:** Porque o Teorema de Pitágoras divide todos os lados pela hipotenusa: (op/hip)² + (adj/hip)² = 1.

*Noção associada:* cosseno — Cateto adjacente dividido pela hipotenusa.

### 5. Por que tangente não existe em 90°?

**Resposta:** Porque cosseno de 90° é zero e a divisão por zero é indefinida; geometricamente a reta tangente é vertical.

*Noção associada:* tangente — Razão seno/cosseno, igual a cateto oposto/cateto adjacente.

### 6. Por que funções recíprocas são úteis?

**Resposta:** Porque certas relações de alturas e razões ficam mais curtas quando escritas com o inverso da razão principal.

*Noção associada:* cossecante — Recíproco do seno: csc x = 1/sen x.

### 7. Por que estender além de 90°?

**Resposta:** Porque fenômenos periódicos (rotação, ondas, corrente alternada) percorrem o ciclo completo, não apenas o triângulo retângulo.

*Noção associada:* ciclo trigonométrico — Circunferência unitária usada para estender as razões a qualquer ângulo.

### 8. Por que os sinais mudam de quadrante?

**Resposta:** Porque as coordenadas x e y do ponto no ciclo unitário trocam de sinal, e seno/cosseno herdam esses sinais.

*Noção associada:* quadrante — Uma das quatro regiões do plano cartesiano limitada pelos eixos.

### 9. Por que ela é uma identidade e não uma equação?

**Resposta:** Porque vale para todo x real; equações trigonométricas valem apenas para valores específicos da incógnita.

*Noção associada:* identidade pitagórica — sen²x + cos²x = 1.

### 10. Por que seno e cosseno têm período 2π enquanto tangente tem π?

**Resposta:** Porque o par de coordenadas (cos x, sen x) só retorna após volta completa, mas a razão sen/cos repete após meia volta com ambos os sinais invertidos.

*Noção associada:* período — Menor intervalo após o qual a função repete seus valores.

### 11. Por que ela resolve triângulos sem ângulo reto?

**Resposta:** Porque relaciona lados e ângulos opostos sem exigir Pitágoras, usando o raio da circunferência circunscrita.

*Noção associada:* lei dos senos — Em qualquer triângulo, a/sen A = b/sen B = c/sen C = 2R.

### 12. Por que ela generaliza Pitágoras?

**Resposta:** Porque quando A = 90°, cos A = 0 e a expressão reduz a a² = b² + c².

*Noção associada:* lei dos cossenos — a² = b² + c² − 2bc·cos A.

## 3. Repositório de Fórmulas e Códigos Auditados

> **Critério de auditoria:** o OCR local corrompe símbolos matemáticos. Por isso **todas** as fórmulas abaixo estão marcadas como ilustrativas: são reconstruções canônicas dos temas detectados, não transcrições literais. Os números dos gabaritos foram calculados pelo próprio gerador; os snippets foram verificados por `compile()` (Python) e por GCC `-std=c11 -fsyntax-only` (C, compatível com C17).

1. `sen²x + cos²x = 1` — Pitágoras no ciclo unitário. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
2. `tg x = sen x/cos x` — Razão seno sobre cosseno. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
3. `sec x = 1/cos x` — Recíproco do cosseno. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
4. `csc x = 1/sen x` — Recíproco do seno. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
5. `1 + tg²x = sec²x` — Identidade derivada da pitagórica. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
6. `sen(α+β) = sen α·cos β + cos α·sen β` — Fórmula da soma para o seno. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
7. `cos 2x = cos²x − sen²x` — Formulação do cosseno do ângulo duplo. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
8. `sen 2x = 2·sen x·cos x` — Sen do ângulo duplo. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
9. `180° = π rad` — Conversão grau-radiano. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
10. `a² = b² + c² − 2bc·cos A` — Generalização de Pitágoras. 〔ilustrativa — reconstrução didática; não extraída literalmente〕

**Snippet 1 — Python** (Python: compile() OK; todas as linhas comentadas):

```python
from math import sin, cos, pi # importa seno, cosseno e a constante pi
x = pi / 6                    # escolhe o ângulo de 30 graus em radianos
soma = sin(x) ** 2 + cos(x) ** 2 # calcula a identidade pitagórica
print(round(soma, 12))        # imprime 1.0 dentro da precisão numérica
```

**Snippet 2 — C17** (C17: GCC -fsyntax-only OK; todas as linhas comentadas):

```c
#include <stdio.h> // inclui printf
#include <math.h> // inclui sin
int main(void) { // abre a funcao principal
    const double pi = 3.14159265358979323846; // define pi sem depender de extensoes
    double graus = 60.0; // define o angulo em graus
    double rad = graus * pi / 180.0; // converte graus para radianos
    printf("%.6f\n", sin(rad)); // imprime o seno de 60 graus
    return 0; // encerra o programa
} // fecha a funcao principal
```

## 4. Guia Prático: Como Dar Uma Aula Sobre Este Livro

**Analogias para o quadro**

- O ciclo unitário é um relógio: seno é a altura do ponteiro, cosseno é o deslocamento horizontal e a volta completa dura 2π.
- Triângulos semelhantes são fotografias em escalas diferentes: o ângulo permanece, então seno e cosseno não mudam.
- A lei dos cossenos é um 'Pitágoras com correção': quando o ângulo deixa de ser reto, acrescenta-se o termo que mede o desvio.

**Sequência sugerida no quadro**

- **Passo 1:** Escreva o título FME_3 e o foco ângulos, razões trigonométricas, ciclo e equações; pergunte o que já se sabe sobre ângulo.
- **Passo 2:** Desenhe o mapa da seção 1 e justifique a seta entre ângulo e radiano.
- **Passo 3:** Derive uma fórmula do catálogo (por exemplo, `sen²x + cos²x = 1`) antes de aplicá-la a números.
- **Passo 4:** Resolva um exemplo no quadro em voz alta, marcando onde cada hipótese foi usada.
- **Passo 5:** Peça aos alunos que reformulem o mesmo exemplo com outros dados e comparem os resultados.
- **Passo 6:** Feche com lei dos cossenos: por que essa ideia aparece em FUNDAMENTOS DE MATEMÁTICA ELEMENTAR?

**Perguntas de verificação em aula**

- Por que precisamos medir rotação e não só distância? (Resposta esperada: Porque formas inclinadas não são descritas apenas por comprimentos; a abertura entre direções é uma grandeza independente.)
- Por que o radiano é natural em cálculo? (Resposta esperada: Porque s = rθ elimina fatores de conversão e torna derivadas trigonométricas simples.)
- Por que seno depende só do ângulo? (Resposta esperada: Porque triângulos retângulos semelhantes mantêm a mesma razão entre cateto oposto e hipotenusa.)
- Ao aplicar `tg x = sen x/cos x`, qual hipótese impediria o cálculo? (Resposta esperada: verificar as condições de validade antes de substituir os valores.)

## 5. Avaliação Mestre — 20 Questões com Gabarito Comentado

**Bloco A — 10 questões conceituais**

1. **(Conceitual)** Explique o que é «ângulo» em FME 3 — Trigonometria e por que essa noção é necessária.
   - **Gabarito comentado:** Figura formada por duas semirretas com origem comum. Relação: Porque formas inclinadas não são descritas apenas por comprimentos; a abertura entre direções é uma grandeza independente.
2. **(Conceitual)** Explique o que é «radiano» em FME 3 — Trigonometria e por que essa noção é necessária.
   - **Gabarito comentado:** Ângulo cuja medida é o comprimento do arco dividido pelo raio. Relação: Porque s = rθ elimina fatores de conversão e torna derivadas trigonométricas simples.
3. **(Conceitual)** Explique o que é «seno» em FME 3 — Trigonometria e por que essa noção é necessária.
   - **Gabarito comentado:** No triângulo retângulo, cateto oposto dividido pela hipotenusa. Relação: Porque triângulos retângulos semelhantes mantêm a mesma razão entre cateto oposto e hipotenusa.
4. **(Conceitual)** Explique o que é «cosseno» em FME 3 — Trigonometria e por que essa noção é necessária.
   - **Gabarito comentado:** Cateto adjacente dividido pela hipotenusa. Relação: Porque o Teorema de Pitágoras divide todos os lados pela hipotenusa: (op/hip)² + (adj/hip)² = 1.
5. **(Conceitual)** Explique o que é «tangente» em FME 3 — Trigonometria e por que essa noção é necessária.
   - **Gabarito comentado:** Razão seno/cosseno, igual a cateto oposto/cateto adjacente. Relação: Porque cosseno de 90° é zero e a divisão por zero é indefinida; geometricamente a reta tangente é vertical.
6. **(Conceitual)** Explique o que é «cossecante» em FME 3 — Trigonometria e por que essa noção é necessária.
   - **Gabarito comentado:** Recíproco do seno: csc x = 1/sen x. Relação: Porque certas relações de alturas e razões ficam mais curtas quando escritas com o inverso da razão principal.
7. **(Conceitual)** Explique o que é «ciclo trigonométrico» em FME 3 — Trigonometria e por que essa noção é necessária.
   - **Gabarito comentado:** Circunferência unitária usada para estender as razões a qualquer ângulo. Relação: Porque fenômenos periódicos (rotação, ondas, corrente alternada) percorrem o ciclo completo, não apenas o triângulo retângulo.
8. **(Conceitual)** Explique o que é «quadrante» em FME 3 — Trigonometria e por que essa noção é necessária.
   - **Gabarito comentado:** Uma das quatro regiões do plano cartesiano limitada pelos eixos. Relação: Porque as coordenadas x e y do ponto no ciclo unitário trocam de sinal, e seno/cosseno herdam esses sinais.
9. **(Conceitual)** Explique o que é «identidade pitagórica» em FME 3 — Trigonometria e por que essa noção é necessária.
   - **Gabarito comentado:** sen²x + cos²x = 1. Relação: Porque vale para todo x real; equações trigonométricas valem apenas para valores específicos da incógnita.
10. **(Conceitual)** Explique o que é «período» em FME 3 — Trigonometria e por que essa noção é necessária.
   - **Gabarito comentado:** Menor intervalo após o qual a função repete seus valores. Relação: Porque o par de coordenadas (cos x, sen x) só retorna após volta completa, mas a razão sen/cos repete após meia volta com ambos os sinais invertidos.

**Bloco B — 10 questões práticas**

11. **(Prática)** Calcule sen²(0,5) + cos²(0,5).
   - **Gabarito comentado:** 1. A identidade garante exatamente 1. Verificação: `sen²x + cos²x = 1`.
12. **(Prática)** Calcule tg(π/4).
   - **Gabarito comentado:** 1. sen e cos valem √2/2; a razão é 1. Verificação: `tg x = sen x/cos x`.
13. **(Prática)** Calcule sec(π/3).
   - **Gabarito comentado:** 2. cos(π/3) = 1/2, logo sec = 2. Verificação: `sec x = 1/cos x`.
14. **(Prática)** Calcule csc(π/6).
   - **Gabarito comentado:** 2. sen(π/6) = 1/2, logo csc = 2. Verificação: `csc x = 1/sen x`.
15. **(Prática)** Calcule 1 + tg²(π/4).
   - **Gabarito comentado:** 2. tg = 1; resultado 2, igual a sec²(π/4). Verificação: `1 + tg²x = sec²x`.
16. **(Prática)** Calcule sen(0,2 + 0,5).
   - **Gabarito comentado:** 0,644218. Aplicando a fórmula obtém-se o mesmo valor da soma direta. Verificação: `sen(α+β) = sen α·cos β + cos α·sen β`.
17. **(Prática)** Calcule cos(2·π/6).
   - **Gabarito comentado:** 0,5. cos(π/3) = 0,5. Verificação: `cos 2x = cos²x − sen²x`.
18. **(Prática)** Calcule sen(π/3) pela fórmula do ângulo duplo.
   - **Gabarito comentado:** 0,866025. 2·(1/2)·(√3/2) = √3/2 ≈ 0,866025. Verificação: `sen 2x = 2·sen x·cos x`.
19. **(Prática)** Converta 60° para radianos.
   - **Gabarito comentado:** 1,0472. 60·π/180 = π/3 ≈ 1,0472. Verificação: `180° = π rad`.
20. **(Prática)** Com b=3, c=4 e A=90°, calcule a.
   - **Gabarito comentado:** 5. cos 90° = 0; a = √(9+16) = 5. Verificação: `a² = b² + c² − 2bc·cos A`.

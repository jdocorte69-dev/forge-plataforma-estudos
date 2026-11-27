# Resumo Mestre — FME_7

- **Obra:** FME 7 — Geometria Analítica
- **Autoria registrada no inventário:** Iezzi / Murakami
- **BOOK_ID:** `FME_7`
- **Capítulos extraídos (fontes locais):** 20 arquivo(s) `capXX.md`
- **Capítulos detectados no índice local:** 20
- **Data de extração informada no índice:** 2026-11-26T20:31:40-03:00
- **Base:** textos extraídos localmente em `saida/01_texto_extraido/FME_7/`; nenhuma fonte externa foi consultada.
- **Fidelidade:** síntese pedagógica a partir dos capítulos disponíveis; segmentação proporcional do OCR, portanto os 'capítulos' são blocos de texto e não necessariamente capítulos editoriais.
- **Gerado por:** `scripts/generate_master_summaries.py` em 2026-11-27T06:48:35-03:00 (FORGE 7.0, 100% aditivo).

## 1. Mapa Conceitual da Obra (1 página)

```text
FME_7: coordenadas, retas, circunferência e cônicas
+-- eixo 1: FUNDAMENTOS DE MATEMÁTICA ELEMENTAR
|   +-- coordenada  ->  eixos cartesianos
+-- eixo 2: GELSON IEZZI FUNDAMENTOS DE MATEMÁTICA ELEMENTAR
|   +-- distância  ->  ponto médio
+-- eixo 3: COORDENADAS CARTESIANAS NO PLANO
|   +-- inclinação  ->  equação da reta
+-- eixo 4: EXERCÍCIO
    +-- paralelismo  ->  perpendicularismo
```

- **Títulos reais observados no índice:** FUNDAMENTOS DE MATEMÁTICA ELEMENTAR; GELSON IEZZI FUNDAMENTOS DE MATEMÁTICA ELEMENTAR; COORDENADAS CARTESIANAS NO PLANO; EXERCÍCIO.
- **Palavras-chave medida no texto extraído:** equação, circunferência, retas, coordenadas, triângulo, plano, centro, distância.
- **Rótulos recorrentes no sumário interno dos capítulos:** 5. A principal consequência deste teorema é que em Geometria Analítica; 6. Oseixos xe y dividem o plano carte- y; 8. Um ponto pertence ao eixo das ordenadas se, e somente se, sua abscissa; 9. Um ponto pertence à bissetriz dos
- **Conexão lógica:** coordenada -> eixos cartesianos -> distância -> ponto médio -> inclinação -> aplicação em FUNDAMENTOS DE MATEMÁTICA ELEMENTAR.
- **Leitura do mapa:** cada eixo vem de um título/indício presente no texto local; os nós em `->` são conceitos didáticos que articulam esse eixo.

## 2. Enciclopédia dos 'Porquês' Respondidos

> Cada entrada responde a uma pergunta de primeira princípios usando definições, axiomas ou escolhas de construção. Quando o OCR é escasso, a resposta é síntese pedagógica a partir dos capítulos disponíveis.

### 1. Por que dois números bastam?

**Resposta:** Porque o plano é bidimensional: uma referência horizontal e outra vertical determinam o ponto de forma única.

*Noção associada:* coordenada — Par (x,y) que localiza um ponto no plano a partir de dois eixos.

### 2. Por que os eixos precisam ser perpendiculares?

**Resposta:** Porque assim as distâncias e projeções são independentes e Pitágoras aplica-se diretamente às coordenadas.

*Noção associada:* eixos cartesianos — Retas perpendiculares x e y que se cortam na origem.

### 3. Por que a fórmula vem de Pitágoras?

**Resposta:** Porque as diferenças de coordenadas são os catetos de um triângulo retângulo cuja hipotenusa é o segmento entre os pontos.

*Noção associada:* distância — d = √[(x₂−x₁)² + (y₂−y₁)²].

### 4. Por que média das coordenadas dá o meio?

**Resposta:** Porque em cada eixo o ponto médio divide o segmento em duas partes iguais; a média aritmética é exatamente essa posição.

*Noção associada:* ponto médio — M = ((x₁+x₂)/2, (y₁+y₂)/2).

### 5. Por que reta vertical não tem inclinação?

**Resposta:** Porque x₂ = x₁ daria divisão por zero; a inclinação da vertical é infinita e tratada à parte.

*Noção associada:* inclinação — m = (y₂−y₁)/(x₂−x₁), quando x₂ ≠ x₁.

### 6. Por que b é a ordenada na origem?

**Resposta:** Porque fazendo x = 0 obtemos y = b; o parâmetro b fixa onde a reta cruza o eixo y.

*Noção associada:* equação da reta — y = mx + b, com b o coeficiente linear.

### 7. Por que mesma inclinação implica paralelismo?

**Resposta:** Porque crescer a mesma quantidade em y para cada avanço em x mantém a distância entre as retas constante.

*Noção associada:* paralelismo — Retas distintas paralelas têm a mesma inclinação.

### 8. Por que o produto é −1?

**Resposta:** Porque girar uma reta de 90° troca o vetor (1,m) por (−m,1), cujo produto escalar com o original é zero.

*Noção associada:* perpendicularismo — Retas perpendiculares não verticais satisfazem m₁·m₂ = −1.

### 9. Por que o módulo é necessário?

**Resposta:** Porque o sinal de ax₀+by₀+c depende do lado da reta; distância é grandeza não negativa.

*Noção associada:* distância ponto-reta — d = módulo(ax₀+by₀+c)/√(a²+b²).

### 10. Por que a equação é uma aplicação direta da distância?

**Resposta:** Porque circunferência é o lugar de pontos a distância fixa R do centro.

*Noção associada:* circunferência — (x−a)² + (y−b)² = R², centro (a,b).

### 11. Por que o parâmetro p controla a abertura?

**Resposta:** Porque p é a distância entre foco e diretriz; aumentar p afasta o foco e alarga a curva.

*Noção associada:* parábola — y² = 2px (forma canônica).

### 12. Por que metade do determinante?

**Resposta:** Porque o determinante dos dois vetores-lado mede a área do paralelogramo, e o triângulo ocupa exatamente metade dele.

*Noção associada:* área por determinante — A = módulo[x₁(y₂−y₃)+x₂(y₃−y₁)+x₃(y₁−y₂)]/2.

## 3. Repositório de Fórmulas e Códigos Auditados

> **Critério de auditoria:** o OCR local corrompe símbolos matemáticos. Por isso **todas** as fórmulas abaixo estão marcadas como ilustrativas: são reconstruções canônicas dos temas detectados, não transcrições literais. Os números dos gabaritos foram calculados pelo próprio gerador; os snippets foram verificados por `compile()` (Python) e por GCC `-std=c11 -fsyntax-only` (C, compatível com C17).

1. `d = √[(x₂−x₁)² + (y₂−y₁)²]` — Distância entre dois pontos. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
2. `M = ((x₁+x₂)/2, (y₁+y₂)/2)` — Coordenadas do ponto médio. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
3. `m = (y₂−y₁)/(x₂−x₁), x₂ ≠ x₁` — Inclinação da reta. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
4. `m⊥ = −1/m` — Inclinação da perpendicular. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
5. `d = módulo(ax₀+by₀+c)/√(a²+b²)` — Distância de ponto à reta ax+by+c=0. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
6. `(x−a)²+(y−b)² = R²` — Equação da circunferência. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
7. `x²/a² + y²/b² = 1` — Equação canônica da elipse. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
8. `y² = 2px` — Parábola canônica com eixo horizontal. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
9. `A = módulo[x₁(y₂−y₃)+x₂(y₃−y₁)+x₃(y₁−y₂)]/2` — Área por determinante de coordenadas. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
10. `y = mx + b` — Equação da reta na forma reduzida. 〔ilustrativa — reconstrução didática; não extraída literalmente〕

**Snippet 1 — Python** (Python: compile() OK; todas as linhas comentadas):

```python
from math import hypot # importa a função de distância euclidiana
x1, y1, x2, y2 = 1, 2, 4, 6 # define os dois pontos do exemplo
d = hypot(x2 - x1, y2 - y1) # calcula a distância entre eles
mx = (x1 + x2) / 2          # calcula a abscissa do ponto médio
print(d, mx)                # imprime 5.0 e a abscissa 3.0
```

**Snippet 2 — C17** (C17: GCC -fsyntax-only OK; todas as linhas comentadas):

```c
#include <stdio.h> // inclui printf
#include <math.h> // inclui fabs e sqrt
int main(void) { // abre a funcao principal
    double a = 3.0, b = 4.0, c = -5.0; // define a reta 3x+4y-5=0
    double x = 1.0, y = 1.0; // define o ponto avaliado
    double num = fabs(a * x + b * y + c); // modulo da expressao linear
    double den = sqrt(a * a + b * b); // norma do vetor normal
    printf("%.6f\n", num / den); // imprime a distancia do ponto a reta
    return 0; // encerra o programa
} // fecha a funcao principal
```

## 4. Guia Prático: Como Dar Uma Aula Sobre Este Livro

**Analogias para o quadro**

- O plano cartesiano é uma cidade com ruas horizontais e verticais: as coordenadas são o endereço, a distância é o trajeto em diagonal.
- A inclinação é a rampa da reta; retas paralelas têm a mesma rampa e perpendiculares têm rampas que se anulam ao multiplicar.
- Uma circunferência é o conjunto de pontos a um mesmo comprimento de corda do centro; a equação traduz essa corda em números.

**Sequência sugerida no quadro**

- **Passo 1:** Escreva o título FME_7 e o foco coordenadas, retas, circunferência e cônicas; pergunte o que já se sabe sobre coordenada.
- **Passo 2:** Desenhe o mapa da seção 1 e justifique a seta entre coordenada e eixos cartesianos.
- **Passo 3:** Derive uma fórmula do catálogo (por exemplo, `d = √[(x₂−x₁)² + (y₂−y₁)²]`) antes de aplicá-la a números.
- **Passo 4:** Resolva um exemplo no quadro em voz alta, marcando onde cada hipótese foi usada.
- **Passo 5:** Peça aos alunos que reformulem o mesmo exemplo com outros dados e comparem os resultados.
- **Passo 6:** Feche com área por determinante: por que essa ideia aparece em FUNDAMENTOS DE MATEMÁTICA ELEMENTAR?

**Perguntas de verificação em aula**

- Por que dois números bastam? (Resposta esperada: Porque o plano é bidimensional: uma referência horizontal e outra vertical determinam o ponto de forma única.)
- Por que os eixos precisam ser perpendiculares? (Resposta esperada: Porque assim as distâncias e projeções são independentes e Pitágoras aplica-se diretamente às coordenadas.)
- Por que a fórmula vem de Pitágoras? (Resposta esperada: Porque as diferenças de coordenadas são os catetos de um triângulo retângulo cuja hipotenusa é o segmento entre os pontos.)
- Ao aplicar `M = ((x₁+x₂)/2, (y₁+y₂)/2)`, qual hipótese impediria o cálculo? (Resposta esperada: verificar as condições de validade antes de substituir os valores.)

## 5. Avaliação Mestre — 20 Questões com Gabarito Comentado

**Bloco A — 10 questões conceituais**

1. **(Conceitual)** Explique o que é «coordenada» em FME 7 — Geometria Analítica e por que essa noção é necessária.
   - **Gabarito comentado:** Par (x,y) que localiza um ponto no plano a partir de dois eixos. Relação: Porque o plano é bidimensional: uma referência horizontal e outra vertical determinam o ponto de forma única.
2. **(Conceitual)** Explique o que é «eixos cartesianos» em FME 7 — Geometria Analítica e por que essa noção é necessária.
   - **Gabarito comentado:** Retas perpendiculares x e y que se cortam na origem. Relação: Porque assim as distâncias e projeções são independentes e Pitágoras aplica-se diretamente às coordenadas.
3. **(Conceitual)** Explique o que é «distância» em FME 7 — Geometria Analítica e por que essa noção é necessária.
   - **Gabarito comentado:** d = √[(x₂−x₁)² + (y₂−y₁)²]. Relação: Porque as diferenças de coordenadas são os catetos de um triângulo retângulo cuja hipotenusa é o segmento entre os pontos.
4. **(Conceitual)** Explique o que é «ponto médio» em FME 7 — Geometria Analítica e por que essa noção é necessária.
   - **Gabarito comentado:** M = ((x₁+x₂)/2, (y₁+y₂)/2). Relação: Porque em cada eixo o ponto médio divide o segmento em duas partes iguais; a média aritmética é exatamente essa posição.
5. **(Conceitual)** Explique o que é «inclinação» em FME 7 — Geometria Analítica e por que essa noção é necessária.
   - **Gabarito comentado:** m = (y₂−y₁)/(x₂−x₁), quando x₂ ≠ x₁. Relação: Porque x₂ = x₁ daria divisão por zero; a inclinação da vertical é infinita e tratada à parte.
6. **(Conceitual)** Explique o que é «equação da reta» em FME 7 — Geometria Analítica e por que essa noção é necessária.
   - **Gabarito comentado:** y = mx + b, com b o coeficiente linear. Relação: Porque fazendo x = 0 obtemos y = b; o parâmetro b fixa onde a reta cruza o eixo y.
7. **(Conceitual)** Explique o que é «paralelismo» em FME 7 — Geometria Analítica e por que essa noção é necessária.
   - **Gabarito comentado:** Retas distintas paralelas têm a mesma inclinação. Relação: Porque crescer a mesma quantidade em y para cada avanço em x mantém a distância entre as retas constante.
8. **(Conceitual)** Explique o que é «perpendicularismo» em FME 7 — Geometria Analítica e por que essa noção é necessária.
   - **Gabarito comentado:** Retas perpendiculares não verticais satisfazem m₁·m₂ = −1. Relação: Porque girar uma reta de 90° troca o vetor (1,m) por (−m,1), cujo produto escalar com o original é zero.
9. **(Conceitual)** Explique o que é «distância ponto-reta» em FME 7 — Geometria Analítica e por que essa noção é necessária.
   - **Gabarito comentado:** d = módulo(ax₀+by₀+c)/√(a²+b²). Relação: Porque o sinal de ax₀+by₀+c depende do lado da reta; distância é grandeza não negativa.
10. **(Conceitual)** Explique o que é «circunferência» em FME 7 — Geometria Analítica e por que essa noção é necessária.
   - **Gabarito comentado:** (x−a)² + (y−b)² = R², centro (a,b). Relação: Porque circunferência é o lugar de pontos a distância fixa R do centro.

**Bloco B — 10 questões práticas**

11. **(Prática)** Calcule a distância entre A(1,2) e B(4,6).
   - **Gabarito comentado:** 5. Δx=3, Δy=4; d=√(9+16)=5. Verificação: `d = √[(x₂−x₁)² + (y₂−y₁)²]`.
12. **(Prática)** Qual a abscissa do ponto médio entre x=3 e x=9?
   - **Gabarito comentado:** 6. (3+9)/2 = 6. Verificação: `M = ((x₁+x₂)/2, (y₁+y₂)/2)`.
13. **(Prática)** Calcule a inclinação da reta por (1,2) e (4,8).
   - **Gabarito comentado:** 2. (8−2)/(4−1) = 2. Verificação: `m = (y₂−y₁)/(x₂−x₁), x₂ ≠ x₁`.
14. **(Prática)** Qual a inclinação da reta perpendicular a uma reta de inclinação 2?
   - **Gabarito comentado:** -0,5. −1/2 = −0,5. Verificação: `m⊥ = −1/m`.
15. **(Prática)** Calcule a distância de (1,1) à reta 3x+4y−5=0.
   - **Gabarito comentado:** 0,4. Número = módulo(3+4−5) = 2; denominador = 5; d = 0,4. Verificação: `d = módulo(ax₀+by₀+c)/√(a²+b²)`.
16. **(Prática)** Qual o raio da circunferência de centro (1,2) que passa por (4,5)?
   - **Gabarito comentado:** 4,24264. √[(4−1)²+(5−2)²] = √18 ≈ 4,24264. Verificação: `(x−a)²+(y−b)² = R²`.
17. **(Prática)** O ponto (0,4) pertence à elipse com a=3, b=4?
   - **Gabarito comentado:** 1. 0 + 16/16 = 1; pertence. Verificação: `x²/a² + y²/b² = 1`.
18. **(Prática)** Para p=2 e y=4, qual o valor de x na parábola y²=2px?
   - **Gabarito comentado:** 4. x = 16/4 = 4. Verificação: `y² = 2px`.
19. **(Prática)** Calcule a área do triângulo de vértices (0,0), (4,0), (0,3).
   - **Gabarito comentado:** 6. Base 4, altura 3; área 6. Verificação: `A = módulo[x₁(y₂−y₃)+x₂(y₃−y₁)+x₃(y₁−y₂)]/2`.
20. **(Prática)** Com m=2 e b=−3, qual y quando x=5?
   - **Gabarito comentado:** 7. 2·5 − 3 = 7. Verificação: `y = mx + b`.

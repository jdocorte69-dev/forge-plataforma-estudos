# Resumo Mestre — FME_9

- **Obra:** FME 9 — Geometria Plana
- **Autoria registrada no inventário:** Dolce / Pompeo
- **BOOK_ID:** `FME_9`
- **Capítulos extraídos (fontes locais):** 20 arquivo(s) `capXX.md`
- **Capítulos detectados no índice local:** 20
- **Data de extração informada no índice:** 2026-11-26T20:31:40-03:00
- **Base:** textos extraídos localmente em `saida/01_texto_extraido/FME_9/`; nenhuma fonte externa foi consultada.
- **Fidelidade:** síntese pedagógica a partir dos capítulos disponíveis; segmentação proporcional do OCR, portanto os 'capítulos' são blocos de texto e não necessariamente capítulos editoriais.
- **Gerado por:** `scripts/generate_master_summaries.py` em 2026-11-27T06:48:35-03:00 (FORGE 7.0, 100% aditivo).

## 1. Mapa Conceitual da Obra (1 página)

```text
FME_9: noções primitivas, segmentos, ângulos, triângulos e circunferência
+-- eixo 1: FUNDAMENTOS É DE MATEMÁTICA
|   +-- ponto  ->  reta
+-- eixo 2: OSVALDO DOLCE JOSÉ NICOLAU POMPEO FUNDAMENTOS
|   +-- segmento  ->  ângulo
+-- eixo 3: DE MATEMÁTICA ELEMENTAR
|   +-- congruência  ->  semelhança
+-- eixo 4: NOÇÕES E PROPOSIÇÕES PRIMITIVAS
    +-- Pitágoras  ->  circunferência
```

- **Títulos reais observados no índice:** FUNDAMENTOS É DE MATEMÁTICA; OSVALDO DOLCE JOSÉ NICOLAU POMPEO FUNDAMENTOS; DE MATEMÁTICA ELEMENTAR; NOÇÕES E PROPOSIÇÕES PRIMITIVAS.
- **Palavras-chave medida no texto extraído:** triângulo, ângulo, ângulos, circunferência, medida, triângulos, retângulo, círculo.
- **Rótulos recorrentes no sumário interno dos capítulos:** 14. Resumo; 15. Segmentos consecutivos; 16. Segmentos colineares; 17. Segmentos adjacentes
- **Conexão lógica:** ponto -> reta -> segmento -> ângulo -> congruência -> aplicação em FUNDAMENTOS É DE MATEMÁTICA.
- **Leitura do mapa:** cada eixo vem de um título/indício presente no texto local; os nós em `->` são conceitos didáticos que articulam esse eixo.

## 2. Enciclopédia dos 'Porquês' Respondidos

> Cada entrada responde a uma pergunta de primeira princípios usando definições, axiomas ou escolhas de construção. Quando o OCR é escasso, a resposta é síntese pedagógica a partir dos capítulos disponíveis.

### 1. Por que pontos são primitivos?

**Resposta:** Porque toda definição precisa começar em algum lugar; tentar definir ponto geraria regresso infinito.

*Noção associada:* ponto — Entidade primitiva sem dimensão, representada por uma letra.

### 2. Por que uma reta não tem extremos?

**Resposta:** Porque ela é o modelo ideals para direção; segmentos e semirretas são recortes dela com 2 e 1 extremos.

*Noção associada:* reta — Entidade primitiva que se estende indefinidamente em dois sentidos.

### 3. Por que medir segmento é possível mas medir reta não?

**Resposta:** Porque o segmento tem comprimento finito; a reta infinita não possui medida finita.

*Noção associada:* segmento — Parte da reta entre dois pontos, inclusive eles.

### 4. Por que ângulo é grandeza independente do comprimento?

**Resposta:** Porque dois ângulos com lados de comprimentos diferentes podem ter a mesma abertura; o que importa é a rotação.

*Noção associada:* ângulo — Região entre duas semirretas de mesma origem.

### 5. Por que congruentes podem ser sobrepostos?

**Resposta:** Porque congruência é definida por uma isometria: translação, rotação e reflexão preservam distâncias.

*Noção associada:* congruência — Figuras com mesma forma e mesma medida.

### 6. Por que a razão de semelhança elevada ao quadrado dá a razão de áreas?

**Resposta:** Porque área depende do produto de duas dimensões, ambas multiplicadas pela mesma razão.

*Noção associada:* semelhança — Figuras com mesma forma, com lados proporcionais.

### 7. Por que o teorema exige ângulo reto?

**Resposta:** Porque a prova clássica usa a quadratura dos lados do quadrado construído sobre a hipotenusa; sem reto a relação muda (lei dos cossenos).

*Noção associada:* Pitágoras — Em triângulo retângulo, a² + b² = c².

### 8. Por que toda reta perpendicular a um raio na extremidade é tangente?

**Resposta:** Porque qualquer outro ponto dessa reta está mais distante do centro, igualando a definição de tangente.

*Noção associada:* circunferência — Lugar dos pontos a uma distância fixa de um centro.

### 9. Por que a soma dos ângulos internos é (n−2)·180°?

**Resposta:** Porque decompor o polígono em n−2 triângulos a partir de um vértice soma exatamente essa quantidade de ângulos.

*Noção associada:* polígono — Figura plana fechada por segmentos consecutivos.

### 10. Por que as três medianas concorrem no centroide?

**Resposta:** Porque o ponto de equilíbrio do triângulo tem coordenadas médias dos vértices, comum às três medianas.

*Noção associada:* mediana — Segmento do vértice ao ponto médio do lado oposto.

### 11. Por que o paralelismo gera proporção?

**Resposta:** Porque os dois triângulos formados são semelhantes por ângulos correspondentes iguais.

*Noção associada:* Tales — Uma reta paralela a um lado do triângulo corta os outros dois proporcionalmente.

### 12. Por que ele mede metade do ângulo central?

**Resposta:** Porque o ângulo central subtende o mesmo arco a partir do centro e o teorema do arco divide essa medida por dois.

*Noção associada:* ângulo inscrito — Ângulo com vértice na circunferência e lados secantes.

## 3. Repositório de Fórmulas e Códigos Auditados

> **Critério de auditoria:** o OCR local corrompe símbolos matemáticos. Por isso **todas** as fórmulas abaixo estão marcadas como ilustrativas: são reconstruções canônicas dos temas detectados, não transcrições literais. Os números dos gabaritos foram calculados pelo próprio gerador; os snippets foram verificados por `compile()` (Python) e por GCC `-std=c11 -fsyntax-only` (C, compatível com C17).

1. `Soma interna = (n−2)·180°` — Soma dos ângulos internos de um polígono. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
2. `a² + b² = c² no triângulo retângulo` — Teorema de Pitágoras. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
3. `A = b·h/2` — Área do triângulo. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
4. `A = πr²` — Área do círculo. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
5. `C = 2πr` — Comprimento da circunferência. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
6. `Lado escalado = k·lado original` — Razão de semelhança entre figuras. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
7. `AB/BC = DE/EF em retas paralelas` — Teorema de Tales. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
8. `Ângulo inscrito = metade do ângulo central` — Relação entre ângulos na circunferência. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
9. `A = (B+b)·h/2` — Área do trapézio. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
10. `Cada ângulo externo de polígono regular = 360°/n` — Ângulo externo de polígono regular. 〔ilustrativa — reconstrução didática; não extraída literalmente〕

**Snippet 1 — Python** (Python: compile() OK; todas as linhas comentadas):

```python
from math import sqrt # importa a raiz quadrada
a, b = 3, 4           # define os catetos do triângulo retângulo
c = sqrt(a*a + b*b)   # aplica Pitágoras para obter a hipotenusa
area = a*b/2          # calcula a área do triângulo
print(c, area)        # imprime 5.0 e 6.0
```

**Snippet 2 — C17** (C17: GCC -fsyntax-only OK; todas as linhas comentadas):

```c
#include <stdio.h> // inclui printf
int main(void) { // abre a funcao principal
    double base = 6.0, altura = 4.0; // define base e altura
    double area = base * altura / 2.0; // calcula a area do triangulo
    printf("%.2f\n", area); // imprime 12.00
    return 0; // encerra o programa
} // fecha a funcao principal
```

## 4. Guia Prático: Como Dar Uma Aula Sobre Este Livro

**Analogias para o quadro**

- Ponto é um endereço sem tamanho, reta é uma estrada infinita e segmento é o trecho entre duas paradas.
- Semelhança é ampliar uma fotografia: os ângulos continuam iguais e os lados crescem na mesma proporção.
- Ângulo inscrito é um observador na arquibancada; o ângulo central é o mesmo arco visto do centro do estádio.

**Sequência sugerida no quadro**

- **Passo 1:** Escreva o título FME_9 e o foco noções primitivas, segmentos, ângulos, triângulos e circunferência; pergunte o que já se sabe sobre ponto.
- **Passo 2:** Desenhe o mapa da seção 1 e justifique a seta entre ponto e reta.
- **Passo 3:** Derive uma fórmula do catálogo (por exemplo, `Soma interna = (n−2)·180°`) antes de aplicá-la a números.
- **Passo 4:** Resolva um exemplo no quadro em voz alta, marcando onde cada hipótese foi usada.
- **Passo 5:** Peça aos alunos que reformulem o mesmo exemplo com outros dados e comparem os resultados.
- **Passo 6:** Feche com ângulo inscrito: por que essa ideia aparece em FUNDAMENTOS É DE MATEMÁTICA?

**Perguntas de verificação em aula**

- Por que pontos são primitivos? (Resposta esperada: Porque toda definição precisa começar em algum lugar; tentar definir ponto geraria regresso infinito.)
- Por que uma reta não tem extremos? (Resposta esperada: Porque ela é o modelo ideals para direção; segmentos e semirretas são recortes dela com 2 e 1 extremos.)
- Por que medir segmento é possível mas medir reta não? (Resposta esperada: Porque o segmento tem comprimento finito; a reta infinita não possui medida finita.)
- Ao aplicar `a² + b² = c² no triângulo retângulo`, qual hipótese impediria o cálculo? (Resposta esperada: verificar as condições de validade antes de substituir os valores.)

## 5. Avaliação Mestre — 20 Questões com Gabarito Comentado

**Bloco A — 10 questões conceituais**

1. **(Conceitual)** Explique o que é «ponto» em FME 9 — Geometria Plana e por que essa noção é necessária.
   - **Gabarito comentado:** Entidade primitiva sem dimensão, representada por uma letra. Relação: Porque toda definição precisa começar em algum lugar; tentar definir ponto geraria regresso infinito.
2. **(Conceitual)** Explique o que é «reta» em FME 9 — Geometria Plana e por que essa noção é necessária.
   - **Gabarito comentado:** Entidade primitiva que se estende indefinidamente em dois sentidos. Relação: Porque ela é o modelo ideals para direção; segmentos e semirretas são recortes dela com 2 e 1 extremos.
3. **(Conceitual)** Explique o que é «segmento» em FME 9 — Geometria Plana e por que essa noção é necessária.
   - **Gabarito comentado:** Parte da reta entre dois pontos, inclusive eles. Relação: Porque o segmento tem comprimento finito; a reta infinita não possui medida finita.
4. **(Conceitual)** Explique o que é «ângulo» em FME 9 — Geometria Plana e por que essa noção é necessária.
   - **Gabarito comentado:** Região entre duas semirretas de mesma origem. Relação: Porque dois ângulos com lados de comprimentos diferentes podem ter a mesma abertura; o que importa é a rotação.
5. **(Conceitual)** Explique o que é «congruência» em FME 9 — Geometria Plana e por que essa noção é necessária.
   - **Gabarito comentado:** Figuras com mesma forma e mesma medida. Relação: Porque congruência é definida por uma isometria: translação, rotação e reflexão preservam distâncias.
6. **(Conceitual)** Explique o que é «semelhança» em FME 9 — Geometria Plana e por que essa noção é necessária.
   - **Gabarito comentado:** Figuras com mesma forma, com lados proporcionais. Relação: Porque área depende do produto de duas dimensões, ambas multiplicadas pela mesma razão.
7. **(Conceitual)** Explique o que é «Pitágoras» em FME 9 — Geometria Plana e por que essa noção é necessária.
   - **Gabarito comentado:** Em triângulo retângulo, a² + b² = c². Relação: Porque a prova clássica usa a quadratura dos lados do quadrado construído sobre a hipotenusa; sem reto a relação muda (lei dos cossenos).
8. **(Conceitual)** Explique o que é «circunferência» em FME 9 — Geometria Plana e por que essa noção é necessária.
   - **Gabarito comentado:** Lugar dos pontos a uma distância fixa de um centro. Relação: Porque qualquer outro ponto dessa reta está mais distante do centro, igualando a definição de tangente.
9. **(Conceitual)** Explique o que é «polígono» em FME 9 — Geometria Plana e por que essa noção é necessária.
   - **Gabarito comentado:** Figura plana fechada por segmentos consecutivos. Relação: Porque decompor o polígono em n−2 triângulos a partir de um vértice soma exatamente essa quantidade de ângulos.
10. **(Conceitual)** Explique o que é «mediana» em FME 9 — Geometria Plana e por que essa noção é necessária.
   - **Gabarito comentado:** Segmento do vértice ao ponto médio do lado oposto. Relação: Porque o ponto de equilíbrio do triângulo tem coordenadas médias dos vértices, comum às três medianas.

**Bloco B — 10 questões práticas**

11. **(Prática)** Calcule a soma dos ângulos internos de um pentágono.
   - **Gabarito comentado:** 540. (5−2)·180° = 540°. Verificação: `Soma interna = (n−2)·180°`.
12. **(Prática)** Com catetos 3 e 4, calcule a hipotenusa.
   - **Gabarito comentado:** 5. √(9+16) = 5. Verificação: `a² + b² = c² no triângulo retângulo`.
13. **(Prática)** Calcule a área de um triângulo de base 6 e altura 4.
   - **Gabarito comentado:** 12. 6·4/2 = 12. Verificação: `A = b·h/2`.
14. **(Prática)** Calcule a área de um círculo de raio 3.
   - **Gabarito comentado:** 28,2743. 9π ≈ 28,2743. Verificação: `A = πr²`.
15. **(Prática)** Calcule o comprimento de uma circunferência de raio 3.
   - **Gabarito comentado:** 18,8496. 6π ≈ 18,8496. Verificação: `C = 2πr`.
16. **(Prática)** Com razão k=2, quanto mede o lado correspondente a 5?
   - **Gabarito comentado:** 10. 2·5 = 10. Verificação: `Lado escalado = k·lado original`.
17. **(Prática)** Se AB/BC = 2/3 e AB = 4, calcule BC.
   - **Gabarito comentado:** 6. BC = 4·3/2 = 6. Verificação: `AB/BC = DE/EF em retas paralelas`.
18. **(Prática)** Um ângulo central mede 80°. Quanto mede o ângulo inscrito no mesmo arco?
   - **Gabarito comentado:** 40. 80°/2 = 40°. Verificação: `Ângulo inscrito = metade do ângulo central`.
19. **(Prática)** Calcule a área de um trapézio com bases 8 e 4 e altura 3.
   - **Gabarito comentado:** 18. (8+4)·3/2 = 18. Verificação: `A = (B+b)·h/2`.
20. **(Prática)** Calcule cada ângulo externo de um hexágono regular.
   - **Gabarito comentado:** 60. 360°/6 = 60°. Verificação: `Cada ângulo externo de polígono regular = 360°/n`.

# Resumo Mestre — FME_10

- **Obra:** FME 10 — Geometria Espacial, Posição e Métrica
- **Autoria registrada no inventário:** Iezzi / Murakami
- **BOOK_ID:** `FME_10`
- **Capítulos extraídos (fontes locais):** 1 arquivo(s) `capXX.md`
- **Capítulos detectados no índice local:** 1
- **Data de extração informada no índice:** 2026-11-26T20:31:40-03:00
- **Base:** textos extraídos localmente em `saida/01_texto_extraido/FME_10/`; nenhuma fonte externa foi consultada.
- **Fidelidade:** síntese pedagógica a partir dos capítulos disponíveis (apenas 1 capítulo extraído); não há cobertura documental plena da obra.
- **Gerado por:** `scripts/generate_master_summaries.py` em 2026-11-27T06:48:35-03:00 (FORGE 7.0, 100% aditivo).

## 1. Mapa Conceitual da Obra (1 página)

```text
FME_10: posições relativas de retas e planos, métrica espacial e sólidos
+-- eixo 1: a a O
|   +-- plano  ->  reta reversa
+-- eixo 2: métrica espacial e sólidos
|   +-- posições relativas  ->  diedro
+-- eixo 3: posições relativas de retas e planos
|   +-- poliedro  ->  prisma
+-- eixo 4: métrica espacial e sólidos
    +-- pirâmide  ->  cilindro
```

- **Títulos reais observados no índice:** a a O.
- **Palavras-chave medida no texto extraído:** plano, retas, planos, paralelas, paralela, reversas, comum, distintos.
- **Rótulos recorrentes no sumário interno dos capítulos:** 8. Quantos planos passam por dois pontos distintos?; 9. Prove que duas retas paralelas distintas e uma concorrente com as duas são; 10. Mostre que, se duas retas são paralelas e distintas, todo plano que contém; 11. Num plano « há uma reta r e um ponto P não pertencente a r. Prove que: se
- **Conexão lógica:** plano -> reta reversa -> posições relativas -> diedro -> poliedro -> aplicação em a a O.
- **Leitura do mapa:** cada eixo vem de um título/indício presente no texto local; os nós em `->` são conceitos didáticos que articulam esse eixo.

## 2. Enciclopédia dos 'Porquês' Respondidos

> Cada entrada responde a uma pergunta de primeira princípios usando definições, axiomas ou escolhas de construção. Quando o OCR é escasso, a resposta é síntese pedagógica a partir dos capítulos disponíveis.

### 1. Por que três pontos colineares não determinam plano único?

**Resposta:** Porque uma reta pertence a infinitos planos; é necessário um terceiro ponto fora dela para fixar um único plano.

*Noção associada:* plano — Superfície plana infinita determinada por três pontos não colineares.

### 2. Por que elas não podem ser paralelas nem concorrentes?

**Resposta:** Porque retas paralelas e retas concorrentes sempre determinam um plano; resta apenas a situação de não coplanaridade.

*Noção associada:* reta reversa — Duas retas que não pertencem a nenhum plano comum.

### 3. Por que a classificação é exaustiva?

**Resposta:** Porque ou há ponto comum (concorrentes), ou não há; se não há, ou existe plano comum (paralelas) ou não existe (reversas).

*Noção associada:* posições relativas — Duas retas no espaço são paralelas, concorrentes ou reversas.

### 4. Por que medir um diedro é medir um ângulo plano?

**Resposta:** Porque o ângulo entre os semiplanos é definido cortando-os por um plano perpendicular à aresta comum.

*Noção associada:* diedro — Figura formada por dois semiplanos com mesma fronteira.

### 5. Por que as faces devem ser planas?

**Resposta:** Porque a noção de face, aresta e vértice depende de polígonos; superfícies curvas dão outros sólidos (cilindro, cone, esfera).

*Noção associada:* poliedro — Sólido limitado por faces poligonais planas.

### 6. Por que o volume é área da base vezes altura?

**Resposta:** Porque o prisma empilha cópias idênticas da base ao longo da altura, como uma pilha de fatias.

*Noção associada:* prisma — Poliedro com duas bases paralelas e congruentes e faces laterais paralelogramos.

### 7. Por que o fator 1/3 no volume?

**Resposta:** Porque três pirâmides de mesma base e altura decompõem um prisma equivalente; é o análogo discreto da integração de áreas decrescentes.

*Noção associada:* pirâmide — Poliedro com uma base poligonal e faces triangulares concurrentes no vértice.

### 8. Por que seu volume é πr²h?

**Resposta:** Porque cada fatia horizontal é um círculo de área πr² e há h camadas empilhadas.

*Noção associada:* cilindro — Sólido gerado pela translação de um círculo ao longo de um eixo.

### 9. Por que o volume do cone é um terço do cilindro circunscrito?

**Resposta:** Porque as seções paralelas à base têm raios que diminuem linearmente; a média cúbica dos raios fornece o fator 1/3.

*Noção associada:* cone — Sólido com base circular e vértice único.

### 10. Por que a área é 4πr²?

**Resposta:** Porque a esfera decomposta em faixas equiprováveis tem área equivalente à de quatro círculos grandes.

*Noção associada:* esfera — Lugar dos pontos a distância fixa de um centro no espaço.

### 11. Por que área e volume escalam diferente?

**Resposta:** Porque área cresce com o quadrado da escala e volume com o cubo; essa diferença explica efeitos de tamanho em biologia e engenharia.

*Noção associada:* área superficial — Soma das áreas das faces ou superfícies externas.

### 12. Por que essa relação é invariante?

**Resposta:** Porque deformar o poliedro sem criar buracos preserva a característica topológica da esfera.

*Noção associada:* relação de Euler — Para poliedros convexos, V − A + F = 2.

## 3. Repositório de Fórmulas e Códigos Auditados

> **Critério de auditoria:** o OCR local corrompe símbolos matemáticos. Por isso **todas** as fórmulas abaixo estão marcadas como ilustrativas: são reconstruções canônicas dos temas detectados, não transcrições literais. Os números dos gabaritos foram calculados pelo próprio gerador; os snippets foram verificados por `compile()` (Python) e por GCC `-std=c11 -fsyntax-only` (C, compatível com C17).

1. `V = a³` — Volume do cubo. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
2. `V = a·b·c` — Volume do paralelepípedo retângulo. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
3. `V = πr²h` — Volume do cilindro. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
4. `V = (1/3)πr²h` — Volume do cone. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
5. `V = (4/3)πr³` — Volume da esfera. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
6. `A = 4πr²` — Área superficial da esfera. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
7. `V = A_base·h/3` — Volume da pirâmide. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
8. `V − A + F = 2 (poliedros convexos)` — Relação de Euler para poliedros. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
9. `d = √(a²+b²+c²)` — Diagonal do paralelepípedo. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
10. `d = módulo(ax+by+cz+d₀)/√(a²+b²+c²)` — Distância de ponto a plano. 〔ilustrativa — reconstrução didática; não extraída literalmente〕

**Snippet 1 — Python** (Python: compile() OK; todas as linhas comentadas):

```python
from math import pi # importa a constante pi
r, h = 2.0, 5.0     # define raio e altura do cilindro
volume = pi * r**2 * h # aplica a fórmula do volume do cilindro
area = 2 * pi * r * (r + h) # calcula a área total do cilindro
print(round(volume, 4), round(area, 4)) # imprime volume e área
```

**Snippet 2 — C17** (C17: GCC -fsyntax-only OK; todas as linhas comentadas):

```c
#include <stdio.h> // inclui printf
#include <math.h> // inclui sqrt
int main(void) { // abre a funcao principal
    double a = 2.0, b = 3.0, c = 6.0; // define as arestas do bloco
    double d = sqrt(a*a + b*b + c*c); // calcula a diagonal espacial
    printf("%.2f\n", d); // imprime 7.00
    return 0; // encerra o programa
} // fecha a funcao principal
```

## 4. Guia Prático: Como Dar Uma Aula Sobre Este Livro

**Analogias para o quadro**

- Uma reta é como um fio: em um plano aberto ele pode coincidir ou cruzar, mas no espaço um fio pode passar 'por cima' de outro sem encontrá-lo.
- Três pontos não alinhados são como três pés de tripé: eles sustentam um único plano; alinhados, viram uma barra que gira.
- Volume é contar fatias empilhadas: a área da base é o tamanho de cada fatia e a altura é o número de camadas.

**Sequência sugerida no quadro**

- **Passo 1:** Escreva o título FME_10 e o foco posições relativas de retas e planos, métrica espacial e sólidos; pergunte o que já se sabe sobre plano.
- **Passo 2:** Desenhe o mapa da seção 1 e justifique a seta entre plano e reta reversa.
- **Passo 3:** Derive uma fórmula do catálogo (por exemplo, `V = a³`) antes de aplicá-la a números.
- **Passo 4:** Resolva um exemplo no quadro em voz alta, marcando onde cada hipótese foi usada.
- **Passo 5:** Peça aos alunos que reformulem o mesmo exemplo com outros dados e comparem os resultados.
- **Passo 6:** Feche com relação de Euler: por que essa ideia aparece em a a O?

**Perguntas de verificação em aula**

- Por que três pontos colineares não determinam plano único? (Resposta esperada: Porque uma reta pertence a infinitos planos; é necessário um terceiro ponto fora dela para fixar um único plano.)
- Por que elas não podem ser paralelas nem concorrentes? (Resposta esperada: Porque retas paralelas e retas concorrentes sempre determinam um plano; resta apenas a situação de não coplanaridade.)
- Por que a classificação é exaustiva? (Resposta esperada: Porque ou há ponto comum (concorrentes), ou não há; se não há, ou existe plano comum (paralelas) ou não existe (reversas).)
- Ao aplicar `V = a·b·c`, qual hipótese impediria o cálculo? (Resposta esperada: verificar as condições de validade antes de substituir os valores.)

## 5. Avaliação Mestre — 20 Questões com Gabarito Comentado

**Bloco A — 10 questões conceituais**

1. **(Conceitual)** Explique o que é «plano» em FME 10 — Geometria Espacial, Posição e Métrica e por que essa noção é necessária.
   - **Gabarito comentado:** Superfície plana infinita determinada por três pontos não colineares. Relação: Porque uma reta pertence a infinitos planos; é necessário um terceiro ponto fora dela para fixar um único plano.
2. **(Conceitual)** Explique o que é «reta reversa» em FME 10 — Geometria Espacial, Posição e Métrica e por que essa noção é necessária.
   - **Gabarito comentado:** Duas retas que não pertencem a nenhum plano comum. Relação: Porque retas paralelas e retas concorrentes sempre determinam um plano; resta apenas a situação de não coplanaridade.
3. **(Conceitual)** Explique o que é «posições relativas» em FME 10 — Geometria Espacial, Posição e Métrica e por que essa noção é necessária.
   - **Gabarito comentado:** Duas retas no espaço são paralelas, concorrentes ou reversas. Relação: Porque ou há ponto comum (concorrentes), ou não há; se não há, ou existe plano comum (paralelas) ou não existe (reversas).
4. **(Conceitual)** Explique o que é «diedro» em FME 10 — Geometria Espacial, Posição e Métrica e por que essa noção é necessária.
   - **Gabarito comentado:** Figura formada por dois semiplanos com mesma fronteira. Relação: Porque o ângulo entre os semiplanos é definido cortando-os por um plano perpendicular à aresta comum.
5. **(Conceitual)** Explique o que é «poliedro» em FME 10 — Geometria Espacial, Posição e Métrica e por que essa noção é necessária.
   - **Gabarito comentado:** Sólido limitado por faces poligonais planas. Relação: Porque a noção de face, aresta e vértice depende de polígonos; superfícies curvas dão outros sólidos (cilindro, cone, esfera).
6. **(Conceitual)** Explique o que é «prisma» em FME 10 — Geometria Espacial, Posição e Métrica e por que essa noção é necessária.
   - **Gabarito comentado:** Poliedro com duas bases paralelas e congruentes e faces laterais paralelogramos. Relação: Porque o prisma empilha cópias idênticas da base ao longo da altura, como uma pilha de fatias.
7. **(Conceitual)** Explique o que é «pirâmide» em FME 10 — Geometria Espacial, Posição e Métrica e por que essa noção é necessária.
   - **Gabarito comentado:** Poliedro com uma base poligonal e faces triangulares concurrentes no vértice. Relação: Porque três pirâmides de mesma base e altura decompõem um prisma equivalente; é o análogo discreto da integração de áreas decrescentes.
8. **(Conceitual)** Explique o que é «cilindro» em FME 10 — Geometria Espacial, Posição e Métrica e por que essa noção é necessária.
   - **Gabarito comentado:** Sólido gerado pela translação de um círculo ao longo de um eixo. Relação: Porque cada fatia horizontal é um círculo de área πr² e há h camadas empilhadas.
9. **(Conceitual)** Explique o que é «cone» em FME 10 — Geometria Espacial, Posição e Métrica e por que essa noção é necessária.
   - **Gabarito comentado:** Sólido com base circular e vértice único. Relação: Porque as seções paralelas à base têm raios que diminuem linearmente; a média cúbica dos raios fornece o fator 1/3.
10. **(Conceitual)** Explique o que é «esfera» em FME 10 — Geometria Espacial, Posição e Métrica e por que essa noção é necessária.
   - **Gabarito comentado:** Lugar dos pontos a distância fixa de um centro no espaço. Relação: Porque a esfera decomposta em faixas equiprováveis tem área equivalente à de quatro círculos grandes.

**Bloco B — 10 questões práticas**

11. **(Prática)** Calcule o volume de um cubo de aresta 3.
   - **Gabarito comentado:** 27. 3³ = 27. Verificação: `V = a³`.
12. **(Prática)** Calcule o volume de um bloco 2×3×4.
   - **Gabarito comentado:** 24. 2·3·4 = 24. Verificação: `V = a·b·c`.
13. **(Prática)** Calcule o volume de um cilindro de raio 2 e altura 5.
   - **Gabarito comentado:** 62,8319. π·4·5 = 20π ≈ 62,8319. Verificação: `V = πr²h`.
14. **(Prática)** Calcule o volume de um cone de raio 2 e altura 5.
   - **Gabarito comentado:** 20,944. 20π/3 ≈ 20,944. Verificação: `V = (1/3)πr²h`.
15. **(Prática)** Calcule o volume de uma esfera de raio 3.
   - **Gabarito comentado:** 113,097. 4π·27/3 = 36π ≈ 113,097. Verificação: `V = (4/3)πr³`.
16. **(Prática)** Calcule a área de uma esfera de raio 2.
   - **Gabarito comentado:** 50,2655. 16π ≈ 50,2655. Verificação: `A = 4πr²`.
17. **(Prática)** Com área da base 12 e altura 6, calcule o volume.
   - **Gabarito comentado:** 24. 12·6/3 = 24. Verificação: `V = A_base·h/3`.
18. **(Prática)** Um cubo tem V=8, A=12 e F=6. Confira Euler.
   - **Gabarito comentado:** 2. 8−12+6 = 2. Verificação: `V − A + F = 2 (poliedros convexos)`.
19. **(Prática)** Calcule a diagonal de um bloco 2×3×6.
   - **Gabarito comentado:** 7. √(4+9+36) = 7. Verificação: `d = √(a²+b²+c²)`.
20. **(Prática)** Calcule a distância de (1,2,3) ao plano x+2y+2z−9=0.
   - **Gabarito comentado:** 0,666667. Numerador módulo(1+4+6−9) = 2; denominador 3; d ≈ 0,666667. Verificação: `d = módulo(ax+by+cz+d₀)/√(a²+b²+c²)`.

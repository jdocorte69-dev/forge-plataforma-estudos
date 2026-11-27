# Resumo Mestre — FME_11

- **Obra:** FME 11 — Matemática Comercial, Financeira e Estatística Descritiva
- **Autoria registrada no inventário:** Iezzi / Hazzan / Degenszajn
- **BOOK_ID:** `FME_11`
- **Capítulos extraídos (fontes locais):** 20 arquivo(s) `capXX.md`
- **Capítulos detectados no índice local:** 20
- **Data de extração informada no índice:** 2026-11-26T20:31:40-03:00
- **Base:** textos extraídos localmente em `saida/01_texto_extraido/FME_11/`; nenhuma fonte externa foi consultada.
- **Fidelidade:** síntese pedagógica a partir dos capítulos disponíveis; segmentação proporcional do OCR, portanto os 'capítulos' são blocos de texto e não necessariamente capítulos editoriais.
- **Gerado por:** `scripts/generate_master_summaries.py` em 2026-11-27T06:48:35-03:00 (FORGE 7.0, 100% aditivo).

## 1. Mapa Conceitual da Obra (1 página)

```text
FME_11: proporcionalidade, percentual, juros e estatística descritiva
+-- eixo 1: FUNDAMENTOS
|   +-- grandeza proporcional  ->  variação percentual
+-- eixo 2: BSS DE MATEMÁTICA
|   +-- juros simples  ->  capital
+-- eixo 3: GELSON IEZZI SAMUEL HAZZAN DAVID MAURO DEGENSZAJN
|   +-- taxa  ->  montante
+-- eixo 4: FUNDAMENTOS DE MATEMÁTICA ELEMENTAR
    +-- valor presente  ->  desconto
```

- **Títulos reais observados no índice:** FUNDAMENTOS; BSS DE MATEMÁTICA; GELSON IEZZI SAMUEL HAZZAN DAVID MAURO DEGENSZAJN; FUNDAMENTOS DE MATEMÁTICA ELEMENTAR.
- **Palavras-chave medida no texto extraído:** média, juros, preço, meses, dados, reais, montante, período.
- **Rótulos recorrentes no sumário interno dos capítulos:** 2. = S; 4. Grandezas diretamente proporcionais; 5. Grandezas inversamente proporcionais; 30. + = iSg
- **Conexão lógica:** grandeza proporcional -> variação percentual -> juros simples -> capital -> taxa -> aplicação em FUNDAMENTOS.
- **Leitura do mapa:** cada eixo vem de um título/indício presente no texto local; os nós em `->` são conceitos didáticos que articulam esse eixo.

## 2. Enciclopédia dos 'Porquês' Respondidos

> Cada entrada responde a uma pergunta de primeira princípios usando definições, axiomas ou escolhas de construção. Quando o OCR é escasso, a resposta é síntese pedagógica a partir dos capítulos disponíveis.

### 1. Por que distinguir direta de inversa?

**Resposta:** Porque na direta o quociente é constante (y = kx) e na inversa o produto é constante (xy = k); confundi-las inverte a resposta.

*Noção associada:* grandeza proporcional — Grandezas que variam por multiplicação por uma constante.

### 2. Por que usar Vi como denominador?

**Resposta:** Porque a variação é medida em relação ao valor de partida; usar Vf troca a referência e distorce a taxa.

*Noção associada:* variação percentual — (Vf − Vi)/Vi · 100%.

### 3. Por que o crescimento é linear?

**Resposta:** Porque a base de cálculo não muda; a cada período acresce a mesma quantia C·i.

*Noção associada:* juros simples — J = C·i·t, com juros calculados sempre sobre o capital inicial.

### 4. Por que ele difere de montante?

**Resposta:** Porque capital é o que se coloca no início e montante é capital mais juros acumulados no fim.

*Noção associada:* capital — Valor inicial aplicado ou emprestado.

### 5. Por que a taxa deve ser convertida para decimal?

**Resposta:** Porque fórmulas algébricas usam i = 5/100 = 0,05; deixar 5 quebraria o cálculo por fator 100.

*Noção associada:* taxa — Razão entre juros e capital em um período, geralmente expressa em porcentagem.

### 6. Por que a exponenciação aparece?

**Resposta:** Porque os juros de cada período incidem também sobre os juros anteriores; a multiplicação se repete n vezes.

*Noção associada:* montante — M = C(1 + i)ⁿ nos juros compostos.

### 7. Por que descontar é necessário?

**Resposta:** Porque dinheiro futuro vale menos que dinheiro atual; trazer para o presente torna montantes de datas diferentes comparáveis.

*Noção associada:* valor presente — C = M/(1 + i)ⁿ.

### 8. Por que desconto simples e composto diferem?

**Resposta:** Porque o simples incide sobre o valor nominal e o composto sobre o valor já descontado, alterando a base.

*Noção associada:* desconto — Valor deduzido de um título antes do vencimento.

### 9. Por que a média é sensível a outliers?

**Resposta:** Porque cada valor entra linearmente na soma; um valor extremo desloca o resultado na proporção de seu tamanho.

*Noção associada:* média aritmética — x̄ = (x₁+...+xₙ)/n.

### 10. Por que usar mediana quando há outliers?

**Resposta:** Porque ela depende apenas da posição, não da magnitude dos valores extremos.

*Noção associada:* mediana — Valor central dos dados ordenados.

### 11. Por que elevar ao quadrado?

**Resposta:** Porque desvios positivos e negativos se cancelariam na soma; o quadrado mede dispersão sem sinal.

*Noção associada:* variância — σ² = Σ(xᵢ − x̄)²/n.

### 12. Por que tirar a raiz?

**Resposta:** Porque a variância está em unidades ao quadrado; a raiz devolve a dispersão na unidade original dos dados.

*Noção associada:* desvio padrão — σ = √σ², raiz da variância.

## 3. Repositório de Fórmulas e Códigos Auditados

> **Critério de auditoria:** o OCR local corrompe símbolos matemáticos. Por isso **todas** as fórmulas abaixo estão marcadas como ilustrativas: são reconstruções canônicas dos temas detectados, não transcrições literais. Os números dos gabaritos foram calculados pelo próprio gerador; os snippets foram verificados por `compile()` (Python) e por GCC `-std=c11 -fsyntax-only` (C, compatível com C17).

1. `J = C·i·t` — Juros calculados sempre sobre o capital inicial. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
2. `M = C(1+i)ⁿ` — Capitalização composta. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
3. `C = M/(1+i)ⁿ` — Desconto de montante futuro. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
4. `i_ef = (1 + i_nom/m)ᵐ − 1` — Conversão de taxa nominal para efetiva. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
5. `D = M·d·t` — Desconto simples sobre valor nominal. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
6. `(Vf − Vi)/Vi·100%` — Variação percentual relativa ao valor inicial. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
7. `x̄ = (x₁+...+xₙ)/n` — Média aritmética dos dados. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
8. `σ² = Σ(xᵢ−x̄)²/n` — Variância populacional. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
9. `σ = √σ²` — Desvio padrão populacional. 〔ilustrativa — reconstrução didática; não extraída literalmente〕
10. `CV = σ/x̄·100%` — Coeficiente de variação. 〔ilustrativa — reconstrução didática; não extraída literalmente〕

**Snippet 1 — Python** (Python: compile() OK; todas as linhas comentadas):

```python
C, i, n = 1000.0, 0.05, 2 # define capital, taxa e número de períodos
M = C * (1 + i) ** n      # calcula o montante composto
J = M - C                 # obtém os juros acumulados
print(round(M, 2), round(J, 2)) # imprime 1102.5 e 102.5
```

**Snippet 2 — C17** (C17: GCC -fsyntax-only OK; todas as linhas comentadas):

```c
#include <stdio.h> // inclui printf
int main(void) { // abre a funcao principal
    double capital = 1000.0, taxa = 0.05, tempo = 2.0; // define os dados
    double juros = capital * taxa * tempo; // calcula juros simples
    printf("%.2f\n", juros); // imprime 100.00
    return 0; // encerra o programa
} // fecha a funcao principal
```

## 4. Guia Prático: Como Dar Uma Aula Sobre Este Livro

**Analogias para o quadro**

- Juros simples são uma esteira que acrescenta sempre a mesma quantia; juros compostos são uma bola de neve que cresce sobre o que já cresceu.
- Trazer um valor futuro para o presente é como descontar o pedágio do tempo: quanto mais longe a data, menor o valor de hoje.
- Média é o nível de água depois de despejar todos os copos; variância mede quanto cada copo se desviou desse nível.

**Sequência sugerida no quadro**

- **Passo 1:** Escreva o título FME_11 e o foco proporcionalidade, percentual, juros e estatística descritiva; pergunte o que já se sabe sobre grandeza proporcional.
- **Passo 2:** Desenhe o mapa da seção 1 e justifique a seta entre grandeza proporcional e variação percentual.
- **Passo 3:** Derive uma fórmula do catálogo (por exemplo, `J = C·i·t`) antes de aplicá-la a números.
- **Passo 4:** Resolva um exemplo no quadro em voz alta, marcando onde cada hipótese foi usada.
- **Passo 5:** Peça aos alunos que reformulem o mesmo exemplo com outros dados e comparem os resultados.
- **Passo 6:** Feche com desvio padrão: por que essa ideia aparece em FUNDAMENTOS?

**Perguntas de verificação em aula**

- Por que distinguir direta de inversa? (Resposta esperada: Porque na direta o quociente é constante (y = kx) e na inversa o produto é constante (xy = k); confundi-las inverte a resposta.)
- Por que usar Vi como denominador? (Resposta esperada: Porque a variação é medida em relação ao valor de partida; usar Vf troca a referência e distorce a taxa.)
- Por que o crescimento é linear? (Resposta esperada: Porque a base de cálculo não muda; a cada período acresce a mesma quantia C·i.)
- Ao aplicar `M = C(1+i)ⁿ`, qual hipótese impediria o cálculo? (Resposta esperada: verificar as condições de validade antes de substituir os valores.)

## 5. Avaliação Mestre — 20 Questões com Gabarito Comentado

**Bloco A — 10 questões conceituais**

1. **(Conceitual)** Explique o que é «grandeza proporcional» em FME 11 — Matemática Comercial, Financeira e Estatística Descritiva e por que essa noção é necessária.
   - **Gabarito comentado:** Grandezas que variam por multiplicação por uma constante. Relação: Porque na direta o quociente é constante (y = kx) e na inversa o produto é constante (xy = k); confundi-las inverte a resposta.
2. **(Conceitual)** Explique o que é «variação percentual» em FME 11 — Matemática Comercial, Financeira e Estatística Descritiva e por que essa noção é necessária.
   - **Gabarito comentado:** (Vf − Vi)/Vi · 100%. Relação: Porque a variação é medida em relação ao valor de partida; usar Vf troca a referência e distorce a taxa.
3. **(Conceitual)** Explique o que é «juros simples» em FME 11 — Matemática Comercial, Financeira e Estatística Descritiva e por que essa noção é necessária.
   - **Gabarito comentado:** J = C·i·t, com juros calculados sempre sobre o capital inicial. Relação: Porque a base de cálculo não muda; a cada período acresce a mesma quantia C·i.
4. **(Conceitual)** Explique o que é «capital» em FME 11 — Matemática Comercial, Financeira e Estatística Descritiva e por que essa noção é necessária.
   - **Gabarito comentado:** Valor inicial aplicado ou emprestado. Relação: Porque capital é o que se coloca no início e montante é capital mais juros acumulados no fim.
5. **(Conceitual)** Explique o que é «taxa» em FME 11 — Matemática Comercial, Financeira e Estatística Descritiva e por que essa noção é necessária.
   - **Gabarito comentado:** Razão entre juros e capital em um período, geralmente expressa em porcentagem. Relação: Porque fórmulas algébricas usam i = 5/100 = 0,05; deixar 5 quebraria o cálculo por fator 100.
6. **(Conceitual)** Explique o que é «montante» em FME 11 — Matemática Comercial, Financeira e Estatística Descritiva e por que essa noção é necessária.
   - **Gabarito comentado:** M = C(1 + i)ⁿ nos juros compostos. Relação: Porque os juros de cada período incidem também sobre os juros anteriores; a multiplicação se repete n vezes.
7. **(Conceitual)** Explique o que é «valor presente» em FME 11 — Matemática Comercial, Financeira e Estatística Descritiva e por que essa noção é necessária.
   - **Gabarito comentado:** C = M/(1 + i)ⁿ. Relação: Porque dinheiro futuro vale menos que dinheiro atual; trazer para o presente torna montantes de datas diferentes comparáveis.
8. **(Conceitual)** Explique o que é «desconto» em FME 11 — Matemática Comercial, Financeira e Estatística Descritiva e por que essa noção é necessária.
   - **Gabarito comentado:** Valor deduzido de um título antes do vencimento. Relação: Porque o simples incide sobre o valor nominal e o composto sobre o valor já descontado, alterando a base.
9. **(Conceitual)** Explique o que é «média aritmética» em FME 11 — Matemática Comercial, Financeira e Estatística Descritiva e por que essa noção é necessária.
   - **Gabarito comentado:** x̄ = (x₁+...+xₙ)/n. Relação: Porque cada valor entra linearmente na soma; um valor extremo desloca o resultado na proporção de seu tamanho.
10. **(Conceitual)** Explique o que é «mediana» em FME 11 — Matemática Comercial, Financeira e Estatística Descritiva e por que essa noção é necessária.
   - **Gabarito comentado:** Valor central dos dados ordenados. Relação: Porque ela depende apenas da posição, não da magnitude dos valores extremos.

**Bloco B — 10 questões práticas**

11. **(Prática)** Calcule os juros simples de 1000 a 5% ao período por 2 períodos.
   - **Gabarito comentado:** 100. 1000·0,05·2 = 100. Verificação: `J = C·i·t`.
12. **(Prática)** Calcule o montante de 1000 a 5% por 2 períodos.
   - **Gabarito comentado:** 1102,5. 1000·1,05² = 1102,5. Verificação: `M = C(1+i)ⁿ`.
13. **(Prática)** Qual o valor presente de 1210 a 10% por 2 períodos?
   - **Gabarito comentado:** 1000. 1210/1,21 = 1000. Verificação: `C = M/(1+i)ⁿ`.
14. **(Prática)** Converta 12% nominal mensal para taxa efetiva anual.
   - **Gabarito comentado:** 0,126825. (1+0,01)¹²−1 ≈ 0,126825. Verificação: `i_ef = (1 + i_nom/m)ᵐ − 1`.
15. **(Prática)** Calcule o desconto simples de 1000 a 2% por 3 períodos.
   - **Gabarito comentado:** 60. 1000·0,02·3 = 60. Verificação: `D = M·d·t`.
16. **(Prática)** Um preço foi de 50 para 52. Qual a variação percentual?
   - **Gabarito comentado:** 4. 2/50 = 4%. Verificação: `(Vf − Vi)/Vi·100%`.
17. **(Prática)** Calcule a média de 2, 4, 6 e 8.
   - **Gabarito comentado:** 5. 20/4 = 5. Verificação: `x̄ = (x₁+...+xₙ)/n`.
18. **(Prática)** Calcule a variância de 2, 4, 6 e 8.
   - **Gabarito comentado:** 5. Desvios −3, −1, 1, 3; soma de quadrados 20; /4 = 5. Verificação: `σ² = Σ(xᵢ−x̄)²/n`.
19. **(Prática)** Calcule o desvio padrão de 2, 4, 6 e 8.
   - **Gabarito comentado:** 2,23607. √5 ≈ 2,23607. Verificação: `σ = √σ²`.
20. **(Prática)** Com média 5 e desvio 2,23607, calcule o CV.
   - **Gabarito comentado:** 44,7214. ≈44,7214%. Verificação: `CV = σ/x̄·100%`.

# Resumo de Domínio — Capítulo 03: GELSON IEZZI SAMUEL HAZZAN DAVID MAURO DEGENSZAJN

- Tema mapeado: `conjuntos_numericos`
- Fonte estruturada: `01_texto_extraido/` (capítulo 03)
- Gerado em: 2026-11-26T20:31:41-03:00
- Reescrita autoral: nenhum trecho foi copiado do PDF.

### 1. Ideia Central

Organizar a paisagem dos números em conjuntos encaixados, do mais restrito ao mais amplo, para saber sempre em qual terreno uma operação é válida.

### 2. Pré-requisitos Necessários

- Noção de quantidade e contagem.
- Noção de igualdade e ordem.

### 3. Conceitos-chave

#### Conjunto numérico

- **Definição formal:** Coleção bem definida de números com uma propriedade comum.
- **Intuição prática:** Pense em gavetas dentro de gavetas: cada gaveta menor cabe na maior.
- **Exemplo original:** O número −3 pertence a ℤ e a ℚ, mas não a ℕ.
- **Erro comum:** Confundir 'pertencer' com 'ser subconjunto'.

#### Número racional

- **Definição formal:** Todo número que pode ser escrito como p/q com p e q inteiros e q ≠ 0.
- **Intuição prática:** É qualquer fração ou decimal que termina ou repete.
- **Exemplo original:** 0,125 = 1/8; 0,333… = 1/3.
- **Erro comum:** Achar que decimal infinito nunca é racional — apenas a repetição importa.

#### Número irracional

- **Definição formal:** Número real que não admite representação como fração de inteiros.
- **Intuição prática:** É aquele decimal infinito e sem padrão repetitivo.
- **Exemplo original:** √2 e π são irracionais.
- **Erro comum:** Usar aproximação 3,14 para π e concluir que ele é racional.

### 4. Teoremas, Leis e Fórmulas

- Encadeamento: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ.
- Todo inteiro é racional: n = n/1.
- Densidade de ℚ: entre dois reais distintos existe sempre um racional.

### 5. Exemplo Resolvido Passo a Passo

1. Classificar −7/4, √9, √10 e 0,121212…
2. 1) −7/4 já é fração de inteiros ⇒ racional.
3. 2) √9 = 3 ⇒ inteiro, logo racional (a raiz engana olhos apressados).
4. 3) √10 não é inteiro nem fração ⇒ irracional.
5. 4) 0,121212… repete o bloco 12 ⇒ racional; escrevendo x = 0,121212…, 100x − x = 12 ⇒ x = 12/99 = 4/33.

### 6. Conexões Interdisciplinares

A classificação dos números sustenta a teoria dos conjuntos, a álgebra abstrata e a representação de ponto flutuante em computadores (ℝ é approximation infinita; a máquina usa finita).

### 7. Código Funcional (validado)

```python
from fractions import Fraction
print(Fraction(12, 99))  # 4/33
```

### 8. Checklist de Domínio

- [ ] Sei explicar a diferença entre ℕ, ℤ, ℚ, ℝ e ℂ sem olhar o caderno.
- [ ] Consigo transformar uma dízima periódica em fração.
- [ ] Sei justificar por que √2 é irracional.
- [ ] Identifico quando uma raiz é na verdade um inteiro disfarçado.
- [ ] Não confundo '∈' com '⊂'.

### 9. Perguntas de Revisão e Gabarito

**P1.** 0,090909… é racional? Justifique.

> **Gabarito (retenção):** Sim. O bloco 09 repete; x = 0,0909…, 100x − x = 9 ⇒ x = 9/99 = 1/11.

**P2.** Todo número racional é real?

> **Gabarito (retenção):** Sim. ℚ ⊂ ℝ, embora a recíproca seja falsa.

**P3.** √4 é irracional?

> **Gabarito (retenção):** Não. √4 = 2, inteiro; a classificação deve usar o valor simplificado.


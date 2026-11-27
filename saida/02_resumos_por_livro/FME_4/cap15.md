# Resumo de Domínio — Capítulo 15: PROGRESSÃO ARITMÉTICA

- Tema mapeado: `sequencias`
- Fonte estruturada: `01_texto_extraido/` (capítulo 15)
- Gerado em: 2026-11-26T20:31:41-03:00
- Reescrita autoral: nenhum trecho foi copiado do PDF.

### 1. Ideia Central

Descrever listas ordenadas por uma regra e prever o termo longeano sem escrever todos os anteriores.

### 2. Pré-requisitos Necessários

- Funções.
- Indução.

### 3. Conceitos-chave

#### Progressão aritmética

- **Definição formal:** Sequência em que aₙ = a₁ + (n−1)r.
- **Intuição prática:** É uma caminhada de passo constante r.
- **Exemplo original:** 2, 5, 8, 11, … tem r = 3.
- **Erro comum:** Usar n em vez de n−1 na fórmula do termo geral.

#### Progressão geométrica

- **Definição formal:** Sequência em que aₙ = a₁·qⁿ⁻¹.
- **Intuição prática:** É um crescimento multiplicativo: cada passo é uma multiplicação.
- **Exemplo original:** 3, 6, 12, 24 tem q = 2.
- **Erro comum:** Confundir razão q com diferença r.

#### Soma dos termos

- **Definição formal:** PA: Sₙ = n(a₁+aₙ)/2; PG: Sₙ = a₁(qⁿ−1)/(q−1) para q ≠ 1.
- **Intuição prática:** É 'emparelhar' os termos para somar rápido.
- **Exemplo original:** S₄ de 2,5,8,11 é 26.
- **Erro comum:** Aplicar a fórmula da PG com q = 1.

### 4. Teoremas, Leis e Fórmulas

- PA: aₙ = a₁ + (n−1)r; Sₙ = n(a₁ + aₙ)/2.
- PG: aₙ = a₁·qⁿ⁻¹; Sₙ = a₁(qⁿ − 1)/(q − 1), q ≠ 1.
- Em PA, termos equidistantes têm soma constante.

### 5. Exemplo Resolvido Passo a Passo

1. Um torneio começa com 2 participantes e dobra a cada rodada. Quantos após 6 rodadas?
2. 1) É PG com a₁ = 2 e q = 2.
3. 2) a₆ = 2·2⁵ = 64.
4. 3) Verificação iterativa em Python.
5. 4) Se a₁ fosse 3, teríamos 96.

### 6. Conexões Interdisciplinares

Sequências aparecem em juros compostos, crescimento populacional, análise de algoritmos recursivos e séries de Taylor.

### 7. Código Funcional (validado)

```python
a=2
for _ in range(5): a*=2
print(a)  # 64
```

### 8. Checklist de Domínio

- [ ] Identifico se a sequência é PA ou PG.
- [ ] Aplico a fórmula do termo geral com n−1.
- [ ] Calculo somas sem escrever todos os termos.
- [ ] Trato o caso q = 1 separadamente.
- [ ] Verifico pequenos casos à mão.

### 9. Perguntas de Revisão e Gabarito

**P1.** Qual o 10º termo de 3, 7, 11, …?

> **Gabarito (retenção):** 39.

**P2.** Qual a soma dos 5 primeiros termos de 1, 2, 4, 8, 16?

> **Gabarito (retenção):** 31.

**P3.** O que é r em uma PA?

> **Gabarito (retenção):** A razão, passo constante entre termos.


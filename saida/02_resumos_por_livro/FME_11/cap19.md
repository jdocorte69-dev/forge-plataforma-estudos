# Resumo de Domínio — Capítulo 19: MATEMÁTICA COMERCIAL

- Tema mapeado: `financeira`
- Fonte estruturada: `01_texto_extraido/` (capítulo 19)
- Gerado em: 2026-11-26T20:31:41-03:00
- Reescrita autoral: nenhum trecho foi copiado do PDF.

### 1. Ideia Central

Traduzir dinheiro no tempo em juros, percentuais e séries de pagamentos.

### 2. Pré-requisitos Necessários

- Porcentagem.
- Sequências geométricas.

### 3. Conceitos-chave

#### Juros simples

- **Definição formal:** J = P·i·t; montante M = P(1 + i·t).
- **Intuição prática:** O juro incide sempre sobre o capital inicial.
- **Exemplo original:** R$ 1000 a 2% a.m. por 6 meses ⇒ M = 1120.
- **Erro comum:** Aplicar juros simples em prazo longo sem perceber a diferença.

#### Juros compostos

- **Definição formal:** M = P(1 + i)ⁿ.
- **Intuição prática:** O juro do mês seguinte incide sobre o montante anterior: efeito bola de neve.
- **Exemplo original:** R$1000 a 2% a.m. em 6 meses ⇒ ≈1126,16.
- **Erro comum:** Somar juros em vez de multiplicar.

#### Percentual

- **Definição formal:** p% de x = x·p/100.
- **Intuição prática:** É uma fração com denominador escondido 100.
- **Exemplo original:** 15% de 80 = 12.
- **Erro comum:** Aplicar o percentual sobre o valor já aumentado.

### 4. Teoremas, Leis e Fórmulas

- Juros simples: M = P(1 + it).
- Juros compostos: M = P(1+i)ⁿ.
- Taxa equivalente: (1+i) = (1+iₘ)ᵐ.

### 5. Exemplo Resolvido Passo a Passo

1. Comparar R$1000 a 2% a.m. por 6 meses nos dois regimes.
2. 1) Simples: 1000(1 + 0,02·6) = 1120.
3. 2) Composto: 1000(1,02)⁶ ≈ 1126,16.
4. 3) Diferença: ≈ 6,16 a mais no regime composto.
5. 4) Verificação: 1,02⁶ ≈ 1,126162.

### 6. Conexões Interdisciplinares

Matemática financeira conecta PGs, logaritmos e modelagem de risco; é base de engenharia financeira.

### 7. Código Funcional (validado)

```python
print(1000*(1+0.02*6), 1000*(1.02)**6)  # 1120.0  1126.1624...
```

### 8. Checklist de Domínio

- [ ] Distingo juros simples de compostos.
- [ ] Resolvo a fórmula para qualquer variável.
- [ ] Converto taxas de período.
- [ ] Uso logaritmos para descobrir prazo.
- [ ] Arredondo apenas no final.

### 9. Perguntas de Revisão e Gabarito

**P1.** Quanto rende R$500 a 10% a.a. por 2 anos (simples)?

> **Gabarito (retenção):** R$600.

**P2.** Por que compostos rendem mais?

> **Gabarito (retenção):** Porque incidem sobre juros acumulados.

**P3.** Como achar o prazo em juros compostos?

> **Gabarito (retenção):** Com logaritmos: n = log(M/P)/log(1+i).


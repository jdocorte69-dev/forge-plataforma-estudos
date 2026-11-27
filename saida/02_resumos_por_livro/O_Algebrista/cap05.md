# Resumo de Domínio — Capítulo 05: Fatoração

- Tema mapeado: `fatoracao`
- Fonte estruturada: `01_texto_extraido/` (capítulo 05)
- Gerado em: 2026-11-26T20:31:42-03:00
- Reescrita autoral: nenhum trecho foi copiado do PDF.

### 1. Ideia Central

Reescrever uma soma como produto — a operação que transformada equações difíceis em equações triviais.

### 2. Pré-requisitos Necessários

- Produtos notáveis.
- MDC.

### 3. Conceitos-chave

#### Fator comum

- **Definição formal:** Fator que divide todos os termos da expressão.
- **Intuição prática:** É 'tirar o que todos têm' como retirar um saco de cada fileira.
- **Exemplo original:** 6x² + 9x = 3x(2x + 3).
- **Erro comum:** Parar antes de esgotar o fator comum.

#### Fatoração por agrupamento

- **Definição formal:** Agrupar termos para revelar um fator comum escondido.
- **Intuição prática:** É reorganizar peças até que uma mesma peça apareça em dois grupos.
- **Exemplo original:** ax+ay+bx+by = (a+b)(x+y).
- **Erro comum:** Agrupar de forma que não surja fator repetido.

#### Trinômio quadrado perfeito

- **Definição formal:** x² + 2kx + k² = (x+k)².
- **Intuição prática:** É reconhecer o quadrado da soma ao contrário.
- **Exemplo original:** x² + 8x + 16 = (x+4)².
- **Erro comum:** Ignorar o sinal do termo do meio.

### 4. Teoremas, Leis e Fórmulas

- a² − b² = (a−b)(a+b).
- x² + (p+q)x + pq = (x+p)(x+q).
- Um polinômio de grau n tem no máximo n raízes reais distintas.

### 5. Exemplo Resolvido Passo a Passo

1. Fatorar 2x² + 11x + 12.
2. 1) Procuramos p e q com p·q = 2·12 = 24 e p+q = 11.
3. 2) O par (3, 8) serve.
4. 3) Escreva 2x² + 3x + 8x + 12.
5. 4) Agrupe: x(2x+3) + 4(2x+3) = (x+4)(2x+3).
6. 5) Verifique expandindo: 2x²+3x+8x+12.

### 6. Conexões Interdisciplinares

Fatoração é usada em criptografia (fatorar inteiros grandes é difícil — base do RSA) e em simplificação de expressões em engenharia de software simbólico.

### 7. Código Funcional (validado)

```python
import sympy as sp
x=sp.symbols('x')
print(sp.factor(2*x**2+11*x+12))  # (x+4)*(2*x+3)
```

### 8. Checklist de Domínio

- [ ] Sempre verifico a fatoração expandindo de volta.
- [ ] Reconheço trinômios quadrados perfeitos.
- [ ] Sei fatorar por agrupamento.
- [ ] Retiro o fator comum antes de outros métodos.
- [ ] Entendo por que fatorar ajuda a encontrar raízes.

### 9. Perguntas de Revisão e Gabarito

**P1.** Fatore x² + 7x + 12.

> **Gabarito (retenção):** (x+3)(x+4).

**P2.** Fatore 3x² − 12.

> **Gabarito (retenção):** 3(x−2)(x+2).

**P3.** Por que fatorar ajuda a resolver equações?

> **Gabarito (retenção):** Porque produto nulo implica algum fator nulo.


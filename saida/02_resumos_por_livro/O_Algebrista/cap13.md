# Resumo de Domínio — Capítulo 13: Equações do segundo grau

- Tema mapeado: `equacoes`
- Fonte estruturada: `01_texto_extraido/` (capítulo 13)
- Gerado em: 2026-11-26T20:31:42-03:00
- Reescrita autoral: nenhum trecho foi copiado do PDF.

### 1. Ideia Central

Isolar a incógnita preservando o equilíbrio da igualdade — a ideia da balança que nunca entorta.

### 2. Pré-requisitos Necessários

- Operações com inteiros.
- Frações.

### 3. Conceitos-chave

#### Equação

- **Definição formal:** Igualdade entre duas expressões que contêm incógnitas.
- **Intuição prática:** É uma balança: o que se faz de um lado, faz-se do outro.
- **Exemplo original:** 2x + 3 = 11 ⇒ x = 4.
- **Erro comum:** Fazer 'passar para o outro lado trocando sinal' sem entender o porquê.

#### Equação do 2º grau

- **Definição formal:** Equação da forma ax² + bx + c = 0 com a ≠ 0.
- **Intuição prática:** Descreve uma parábola; as raízes são onde ela cruza o eixo horizontal.
- **Exemplo original:** x² − 5x + 6 = 0 ⇒ x = 2 ou x = 3.
- **Erro comum:** Esquecer a condição a ≠ 0.

#### Delta

- **Definição formal:** Discriminante Δ = b² − 4ac, que conta quantas raízes reais existem.
- **Intuição prática:** É o 'semáforo' da equação: negativo pare, zero um ponto, positivo dois.
- **Exemplo original:** Em x²−5x+6, Δ = 25−24 = 1 > 0.
- **Erro comum:** Calcular b² como b·2.

### 4. Teoremas, Leis e Fórmulas

- Fórmula de Bháskara: x = (−b ± √Δ)/(2a), com Δ = b² − 4ac.
- Relações de Viète: soma das raízes = −b/a; produto = c/a.
- Teorema do Resto: o resto da divisão de P(x) por (x − r) é P(r).

### 5. Exemplo Resolvido Passo a Passo

1. Resolver x² − 5x + 6 = 0 de duas formas.
2. 1) Fatoração: procuramos dois números cujo produto é 6 e soma é 5: 2 e 3.
3. 2) Logo (x − 2)(x − 3) = 0 ⇒ x = 2 ou x = 3.
4. 3) Via Bháskara: a=1, b=−5, c=6 ⇒ Δ = 25−24 = 1; x = (5 ± 1)/2 ∈ {2, 3}.
5. 4) Verificação: 2²−5·2+6 = 0 e 3²−5·3+6 = 0.

### 6. Conexões Interdisciplinares

Raízes de polinômios aparecem em sistemas de controle, em funções de transferência e na fatoração de matrizes pelo polinômio característico.

### 7. Código Funcional (validado)

```python
import sympy as sp
x=sp.symbols('x')
print(sp.solve(x**2-5*x+6,x))  # [2, 3]
```

### 8. Checklist de Domínio

- [ ] Verifico as raízes substituindo na equação original.
- [ ] Sei interpretar o sinal de Δ geometricamente.
- [ ] Consigo usar as relações de Viète sem resolver a equação.
- [ ] Respeito a restrição a ≠ 0.
- [ ] Transformo problemas de texto em equação.

### 9. Perguntas de Revisão e Gabarito

**P1.** Se Δ = 0, quantas raízes reais existem?

> **Gabarito (retenção):** Uma raiz real dupla: x = −b/(2a).

**P2.** Quais são as raízes de x² + x − 6 = 0?

> **Gabarito (retenção):** x = 2 e x = −3; o produto é −6 e a soma é −1.

**P3.** O que afirma o Teorema do Resto?

> **Gabarito (retenção):** Que P(r) é o resto da divisão de P(x) por (x − r).


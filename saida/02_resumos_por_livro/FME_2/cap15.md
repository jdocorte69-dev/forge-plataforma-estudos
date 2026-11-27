# Resumo de Domínio — Capítulo 15: POTÊNCIAS E RAÍZES

- Tema mapeado: `operacoes_inteiros`
- Fonte estruturada: `01_texto_extraido/` (capítulo 15)
- Gerado em: 2026-11-26T20:31:41-03:00
- Reescrita autoral: nenhum trecho foi copiado do PDF.

### 1. Ideia Central

Dominar as regras de sinal, prioridade e potenciação para que a álgebra deixe de ser um jogo de adivinhação.

### 2. Pré-requisitos Necessários

- Conjuntos numéricos.
- Noção de subtração.

### 3. Conceitos-chave

#### Módulo

- **Definição formal:** Distância de um número até zero, sempre não negativa.
- **Intuição prática:** É o 'quanto o número anda' sem importar a direção.
- **Exemplo original:** |−6| = 6.
- **Erro comum:** Trocar |−6| por −6.

#### Potenciação

- **Definição formal:** Multiplicação repetida de um fator por si mesmo.
- **Intuição prática:** O expoente conta quantas cópias do fator entram no produto.
- **Exemplo original:** 2⁴ = 2·2·2·2 = 16.
- **Erro comum:** Aplicar a regra (aᵐ)ⁿ = aᵐ⁺ⁿ em vez de aᵐⁿ.

#### Prioridade

- **Definição formal:** Ordem convencional: parênteses, potências, multiplicação/divisão, adição/subtração.
- **Intuição prática:** É a 'hierarquia' que evita duas respostas para a mesma conta.
- **Exemplo original:** 3 + 2·4 = 11, não 20.
- **Erro comum:** Calcular da esquerda para a direita sem respeitar a hierarquia.

### 4. Teoremas, Leis e Fórmulas

- aᵐ · aⁿ = aᵐ⁺ⁿ; aᵐ / aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ.
- a⁰ = 1 para a ≠ 0; a⁻ⁿ = 1/aⁿ.
- Lei de sinais na multiplicação: (−)(−) = (+); (−)(+) = (−).

### 5. Exemplo Resolvido Passo a Passo

1. Calcular −2³ + (−2)² · 3.
2. 1) −2³ = −(2³) = −8 (o sinal está fora da potência).
3. 2) (−2)² = 4 (aqui o sinal está dentro dos parênteses).
4. 3) 4 · 3 = 12.
5. 4) −8 + 12 = 4.
6. Conferência: Python calcula -2**3 + (-2)**2*3 = 4.

### 6. Conexões Interdisciplinares

A precedência de operadores é a mesma ideia usada por compiladores C e interpretadores Python na construção da árvore sintática de expressões.

### 7. Código Funcional (validado)

```python
print(-2**3 + (-2)**2*3)  # 4
```

### 8. Checklist de Domínio

- [ ] Diferencio −aⁿ de (−a)ⁿ.
- [ ] Aplico corretamente as leis dos expoentes.
- [ ] Resolvo expressões com parênteses aninhados.
- [ ] Sei o que é 0⁰ (indefinido por convenção elementar).
- [ ] Justifico cada passo, sem pular direto para a resposta.

### 9. Perguntas de Revisão e Gabarito

**P1.** Quanto é −3²?

> **Gabarito (retenção):** −9. O sinal não está elevado ao quadrado; se fosse (−3)², seria 9.

**P2.** Quanto é 2⁰ + 2⁻¹?

> **Gabarito (retenção):** 1 + 1/2 = 3/2.

**P3.** Por que (a²)³ = a⁶?

> **Gabarito (retenção):** Porque potência de potência multiplica expoentes.


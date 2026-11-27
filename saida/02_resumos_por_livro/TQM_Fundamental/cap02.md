# Resumo de Domínio — Capítulo 02: Sistema decimal de питегсао mimi eee reten 04

- Tema mapeado: `matrizes`
- Fonte estruturada: `01_texto_extraido/` (capítulo 02)
- Gerado em: 2026-11-26T20:31:42-03:00
- Reescrita autoral: nenhum trecho foi copiado do PDF.

### 1. Ideia Central

Organizar dados em malhas retangulares e operar sobre eles como um único objeto — álgebra em escala

### 2. Pré-requisitos Necessários

- Sistemas de equações.
- Vetores.

### 3. Conceitos-chave

#### Matriz

- **Definição formal:** Tabela retangular de números com m linhas e n colunas.
- **Intuição prática:** É uma planilha que pode ser somada e multiplicada como um número só.
- **Exemplo original:** A = [[1,2],[3,4]] é 2×2.
- **Erro comum:** Multiplicar matrizes 'elemento por elemento' como se fosse soma.

#### Determinante

- **Definição formal:** Escalar que mede o fator de distortion de área/volume de uma transformação.
- **Intuição prática:** Se o determinante é zero, a transformação 'achata' o espaço e perde informação.
- **Exemplo original:** det([[1,2],[3,4]]) = −2.
- **Erro comum:** Achar que determinante existe para matriz não quadrada.

#### Posto

- **Definição formal:** Número de linhas ou colunas linearmente independentes.
- **Intuição prática:** Conta quantas direções realmente 'sobram' depois da transformação.
- **Exemplo original:** A 2×3 pode ter posto no máximo 2.
- **Erro comum:** Confundir posto com número de linhas.

### 4. Teoremas, Leis e Fórmulas

- det(AB) = det(A)·det(B).
- (AB)ᵀ = BᵀAᵀ.
- Teorema de Rouché–Capelli: sistema consistente ⇔ posto(A) = posto(A|b).
- A é invertível ⇔ det(A) ≠ 0.

### 5. Exemplo Resolvido Passo a Passo

1. Resolver o sistema 2x + y = 8; −3x − y = −11.
2. 1) Matriz ampliada: [[2,1,8],[−3,−1,−11]].
3. 2) Some a primeira linha com a segunda: [−1,0,−3] ⇒ x = 3.
4. 3) Substitua: 2·3 + y = 8 ⇒ y = 2.
5. 4) Conferência por SymPy: A.LUsolve(b) devolve (3, 2).

### 6. Conexões Interdisciplinares

Matrizes são a base de transformações gráficas 3D, redes neurais,compressão de imagem e resolução numérica de EDPs.

### 7. Código Funcional (validado)

```python
import sympy as sp
A=sp.Matrix([[2,1],[-3,-1]])
b=sp.Matrix([8,-11])
print(A.LUsolve(b))  # Matrix([3, 2])
```

### 8. Checklist de Domínio

- [ ] Multiplico matrizes respeitando ordem e dimensões.
- [ ] Calculo determinante 2×2 e 3×3.
- [ ] Aplico Rouché–Capelli para classificar sistemas.
- [ ] Sei quando a inversa existe.
- [ ] Verifico soluções por substituição.

### 9. Perguntas de Revisão e Gabarito

**P1.** Toda matriz quadrada é invertível?

> **Gabarito (retenção):** Não; é preciso det ≠ 0.

**P2.** AB = BA sempre?

> **Gabarito (retenção):** Não, multiplicação matricial não é comutativa.

**P3.** O que significa posto zero?

> **Gabarito (retenção):** Todos os elementos são zero; nenhuma direção sobrevive.


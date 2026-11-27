# Resumo de Domínio — Capítulo 07: ANÁLISE COMBINATÓRIA

- Tema mapeado: `combinatoria`
- Fonte estruturada: `01_texto_extraido/` (capítulo 07)
- Gerado em: 2026-11-26T20:31:41-03:00
- Reescrita autoral: nenhum trecho foi copiado do PDF.

### 1. Ideia Central

Contar sem listar — transformar 'quantas possibilidades?' em fórmulas confiáveis.

### 2. Pré-requisitos Necessários

- Produto cartesiano.
- Fatorial.

### 3. Conceitos-chave

#### Princípio multiplicativo

- **Definição formal:** Se uma tarefa tem a etapas independentes com nᵢ escolhas, o total é o produto dos nᵢ.
- **Intuição prática:** É o 'cardápio': 3 bebidas × 4 pratos = 12 combinações.
- **Exemplo original:** Camisetas em 5 cores e 3 tamanhos ⇒ 15 opções.
- **Erro comum:** Somar quando deveria multiplicar.

#### Permutação com repetição

- **Definição formal:** n!/(n₁!·n₂!·…·nₖ!) quando há elementos iguais.
- **Intuição prática:** É dividir para descontar as cópias que não são distinguishable.
- **Exemplo original:**  PALAVRA tem 7 letras com A repetido 3 vezes.
- **Erro comum:** Esquecer de dividir pelo fatorial das repetições.

#### Combinação

- **Definição formal:** C(n,k) = n!/(k!(n−k)!) — escolher k elementos sem importar a ordem.
- **Intuição prática:** É montar um time: a ordem de escolha não muda o time.
- **Exemplo original:** C(5,2) = 10 duplas.
- **Erro comum:** Usar arranjo quando a ordem não importa.

### 4. Teoremas, Leis e Fórmulas

- A(n,k) = n!/(n−k)!; C(n,k) = n!/(k!(n−k)!).
- C(n,k) = C(n,n−k).
- Binômio de Newton: (a+b)ⁿ = ∑ₖ C(n,k)·aⁿ⁻ᵏ·bᵏ.
- Princípio da Inclusão–Exclusão para união de conjuntos.

### 5. Exemplo Resolvido Passo a Passo

1. Quantos grupos de 3 pessoas podem ser formados entre 8 alunos?
2. 1) A ordem dentro do grupo não importa ⇒ combinação.
3. 2) C(8,3) = 8!/(3!·5!) = (8·7·6)/(3·2·1) = 56.
4. 3) Verificação: Python math.comb(8,3) = 56.
5. 4) Se houvesse presidente, vice e tesoureiro, seria A(8,3) = 336.

### 6. Conexões Interdisciplinares

Combinatória é a espinha dorsal da probabilidade, da teoria dos grafos e da análise de complexidade de algoritmos de busca.

### 7. Código Funcional (validado)

```python
import math
print(math.comb(8,3), math.perm(8,3))  # 56 336
```

### 8. Checklist de Domínio

- [ ] Distingo arranjo de combinação pelo critério da ordem.
- [ ] Sei contar com repetição e sem repetição.
- [ ] Aplico inclusão–exclusão em problemas de 'pelo menos'.
- [ ] Verifico contagens pequenas por listagem.
- [ ] Uso o binômio de Newton com segurança.

### 9. Perguntas de Revisão e Gabarito

**P1.** C(10,8) é igual a quê?

> **Gabarito (retenção):** C(10,2) = 45.

**P2.** Quantas senhas de 3 dígitos distintos existem?

> **Gabarito (retenção):** A(10,3) = 720.

**P3.** Quando dividir por k!?

> **Gabarito (retenção):** Quando a ordem não importa.


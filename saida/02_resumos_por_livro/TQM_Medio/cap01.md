# Resumo de Domínio — Capítulo 01: Produto Cartesiano

- Tema mapeado: `produtos_notaveis`
- Fonte estruturada: `01_texto_extraido/` (capítulo 01)
- Gerado em: 2026-11-26T20:31:42-03:00
- Reescrita autoral: nenhum trecho foi copiado do PDF.

### 1. Ideia Central

Reconhecer padrões de multiplicação que evitam centenas de contas e revelam a estrutura por trás do polinômio.

### 2. Pré-requisitos Necessários

- Distributividade.
- Potenciação.

### 3. Conceitos-chave

#### Diferença de quadrados

- **Definição formal:** a² − b² = (a − b)(a + b).
- **Intuição prática:** É um quadrado grande com um quadrado menor recortado: sobra duas faixas.
- **Exemplo original:** 49 − 9 = (7−3)(7+3) = 40.
- **Erro comum:** Escrever a² + b² = (a+b)² — falta o termo 2ab.

#### Quadrado da soma

- **Definição formal:** (a + b)² = a² + 2ab + b².
- **Intuição prática:** É o quadrado de um lado (a+b) decomposto em quatro regiões.
- **Exemplo original:** (x+3)² = x² + 6x + 9.
- **Erro comum:** Esquecer o termo do meio 2ab.

#### Cubo da soma

- **Definição formal:** (a + b)³ = a³ + 3a²b + 3ab² + b³.
- **Intuição prática:** É o análogo tridimensional do quadrado da soma.
- **Exemplo original:** (1+2)³ = 1+6+12+8 = 27.
- **Erro comum:** Trocar os coeficientes 3 e 3 por 2 e 2.

### 4. Teoremas, Leis e Fórmulas

- (a + b)² = a² + 2ab + b²; (a − b)² = a² − 2ab + b².
- a² − b² = (a − b)(a + b).
- (a + b)(c + d) = ac + ad + bc + bd (distributividade dupla).

### 5. Exemplo Resolvido Passo a Passo

1. Calcular 103 × 97 sem multiplicação direta.
2. 1) Escreva 103 = 100 + 3 e 97 = 100 − 3.
3. 2) Aplicando (a+b)(a−b) = a² − b² com a = 100 e b = 3.
4. 3) 100² − 3² = 10000 − 9 = 9991.
5. 4) Conferência direta: 103 × 97 = 9991.

### 6. Conexões Interdisciplinares

Produtos notáveis são a base da fatoração, da simplificação de frações algébricas e da aceleração de multiplicações em hardware (algoritmos de Karatsuba).

### 7. Código Funcional (validado)

```python
print((100+3)*(100-3), 100**2-3**2)  # 9991 9991
```

### 8. Checklist de Domínio

- [ ] Reconheço uma diferença de quadrados em meio a uma expressão.
- [ ] Não esqueço o 2ab.
- [ ] Consigo fatorar x² − 16 em segundos.
- [ ] Uso produtos notáveis para cálculo mental.
- [ ] Verifico a identidade com um valor numérico.

### 9. Perguntas de Revisão e Gabarito

**P1.** Fatore x² − 25.

> **Gabarito (retenção):** (x−5)(x+5).

**P2.** Quanto é (a−b)² − (a²+b²)?

> **Gabarito (retenção):** −2ab.

**P3.** Por que 51×49 = 2499?

> **Gabarito (retenção):** Porque (50+1)(50−1) = 2500−1 = 2499.


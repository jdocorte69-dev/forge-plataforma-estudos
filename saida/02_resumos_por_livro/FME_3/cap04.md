# Resumo de Domínio — Capítulo 04: REVISÃO INICIAL DE GEOMETRIA

- Tema mapeado: `geometria_plana`
- Fonte estruturada: `01_texto_extraido/` (capítulo 04)
- Gerado em: 2026-11-26T20:31:41-03:00
- Reescrita autoral: nenhum trecho foi copiado do PDF.

### 1. Ideia Central

Descrever o espaço plano com poucos axiomas e converter formas em números — área, comprimento e ângulo.

### 2. Pré-requisitos Necessários

- Raciocínio lógico.
- Álgebra elementar.

### 3. Conceitos-chave

#### Triângulo

- **Definição formal:** Polígono de três lados cujos ângulos internos somam 180°.
- **Intuição prática:** É a forma mais rígida: três barras cravam um único formato.
- **Exemplo original:**  Ângulos 50°, 60°, 70° somam 180°.
- **Erro comum:** Supor que 'triângulo isósceles' tem todos os lados iguais.

#### Semelhança

- **Definição formal:** Mesma forma, tamanho diferente; lados proporcionais e ângulos iguais.
- **Intuição prática:** É um 'zoom' de uma figura: a proporção não muda.
- **Exemplo original:** Triângulos 3-4-5 e 6-8-10 são semelhantes.
- **Erro comum:** Confundir semelhança com congruência.

#### Teorema de Pitágoras

- **Definição formal:** Em triângulo retângulo, a² + b² = c².
- **Intuição prática:** É a régua para distância em linha reta quando se conhecem os deslocamentos.
- **Exemplo original:** 3² + 4² = 5².
- **Erro comum:** Aplicar a hipotenusa como se fosse cateto.

### 4. Teoremas, Leis e Fórmulas

- Soma dos ângulos internos de um triângulo: 180°.
- Teorema de Pitágoras: a² + b² = c².
- Área do triângulo: A = (b·h)/2; área do círculo: A = πr².
- Em triângulos semelhantes, a razão de áreas é o quadrado da razão de semelhança.

### 5. Exemplo Resolvido Passo a Passo

1. Uma escada de 5 m apoia a parede a 3 m do chão. A que altura ela chega?
2. 1) A escada é a hipotenusa c = 5; a distância na parede é um cateto a = 3.
3. 2) b² = c² − a² = 25 − 9 = 16.
4. 3) b = 4 m.
5. 4) Verificação: 3² + 4² = 9 + 16 = 25 = 5².

### 6. Conexões Interdisciplinares

Geometria plana é a base da trigonometria, da geometria analítica e da computação gráfica 2D.

### 7. Código Funcional (validado)

```python
import math
print(math.sqrt(5**2-3**2))  # 4.0
```

### 8. Checklist de Domínio

- [ ] Identifico a hipotenusa antes de aplicar Pitágoras.
- [ ] Distingo semelhança de congruência.
- [ ] Calculo áreas de figuras compostas.
- [ ] Uso ângulos alternos internos em retas paralelas.
- [ ] Verifico resultados com medidas plausíveis.

### 9. Perguntas de Revisão e Gabarito

**P1.** Quanto mede o terceiro ângulo de um triângulo com 45° e 65°?

> **Gabarito (retenção):** 70°.

**P2.** Se a razão de semelhança é 3, a razão de áreas é?

> **Gabarito (retenção):** 9.

**P3.** Qual a área de um círculo de raio 2?

> **Gabarito (retenção):** 4π.


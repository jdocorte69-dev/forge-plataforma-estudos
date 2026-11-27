# Resumo de Domínio — Capítulo 17: RAZÕES TRIGONOMÉTRICAS NO TRIÂNGULO RETÂNGULO

- Tema mapeado: `trigonometria`
- Fonte estruturada: `01_texto_extraido/` (capítulo 17)
- Gerado em: 2026-11-26T20:31:41-03:00
- Reescrita autoral: nenhum trecho foi copiado do PDF.

### 1. Ideia Central

Medir o que 'gira' relacionando ângulos e razões de triângulos — a ponte entre geometria e movimento.

### 2. Pré-requisitos Necessários

- Geometria plana.
- Teorema de Pitágoras.
- Funções.

### 3. Conceitos-chave

#### Seno e cosseno

- **Definição formal:** No círculo unitário, seno é a coordenada vertical e cosseno a horizontal.
- **Intuição prática:** É a sombra de um ponteiro girando dentro de um relógio de raio 1.
- **Exemplo original:** sen(30°) = 1/2; cos(60°) = 1/2.
- **Erro comum:** Usar graus em modo radianos da calculadora.

#### Radianos

- **Definição formal:** Ângulo igual ao comprimento do arco dividido pelo raio.
- **Intuição prática:** É medir giros pelo próprio arco, não por uma divisão arbitrária em 360.
- **Exemplo original:** 180° = π rad; 90° = π/2 rad.
- **Erro comum:** Esquecer de converter antes de derivar função trigonométrica.

#### Identidade fundamental

- **Definição formal:** sen²θ + cos²θ = 1.
- **Intuição prática:** É apenas Pitágoras aplicado ao triângulo dentro do círculo unitário.
- **Exemplo original:** sen²(45°) + cos²(45°) = 1/2+1/2 = 1.
- **Erro comum:** Aplicar a identidade a ângulos em graus inside funções hiperbólicas.

### 4. Teoremas, Leis e Fórmulas

- sen²θ + cos²θ = 1; tanθ = senθ/cosθ.
- sen(a+b) = sen a·cos b + cos a·sen b.
- Lei dos senos: a/sen A = b/sen B = c/sen C = 2R.
- Lei dos cossenos: c² = a² + b² − 2ab·cos C.

### 5. Exemplo Resolvido Passo a Passo

1. Calcular a altura de uma torre cuja sombra mede 12 m quando o Sol está a 60°.
2. 1) Monte o triângulo retângulo: altura h é cateto oposto, sombra 12 m é cateto adjacente.
3. 2) tan(60°) = h/12.
4. 3) h = 12·tan(60°) = 12·√3 ≈ 20,78 m.
5. 4) Verificação numérica com Python.

### 6. Conexões Interdisciplinares

Trigonometria sustenta navegação, processamento de sinal (transformada de Fourier), computação gráfica e corrente alternada em engenharia elétrica.

### 7. Código Funcional (validado)

```python
import math
print(12*math.tan(math.radians(60)))  # ~20.7846
```

### 8. Checklist de Domínio

- [ ] Converto graus ↔ radianos sem errar.
- [ ] Conheço a tabela do círculo unitário nos ângulos notáveis.
- [ ] Sei quando usar lei dos senos ou dos cossenos.
- [ ] Verifico identidades com um ângulo de teste.
- [ ] Entendo o significado de seno e cosseno como projeções.

### 9. Perguntas de Revisão e Gabarito

**P1.** Quanto vale sen(90°)?

> **Gabarito (retenção):** 1.

**P2.** Qual a relação entre radianos e graus?

> **Gabarito (retenção):** 180° = π radianos.

**P3.** Quando usar a lei dos cossenos?

> **Gabarito (retenção):** Quando não se tem um par ângulo-lado oposto conhecido.


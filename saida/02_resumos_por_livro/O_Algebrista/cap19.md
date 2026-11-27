# Resumo de Domínio — Capítulo 19: Funções

- Tema mapeado: `funcoes`
- Fonte estruturada: `01_texto_extraido/` (capítulo 19)
- Gerado em: 2026-11-26T20:31:42-03:00
- Reescrita autoral: nenhum trecho foi copiado do PDF.

### 1. Ideia Central

Modelar uma dependência: para cada entrada, exatamente uma saída — a máquina que transforma números.

### 2. Pré-requisitos Necessários

- Conjuntos.
- Equações.

### 3. Conceitos-chave

#### Função

- **Definição formal:** Relação que associa a cada elemento do domínio um único elemento do contradomínio.
- **Intuição prática:** É uma máquina de ingresso: uma ficha entra, uma saída sai, nunca duas.
- **Exemplo original:** f(x) = 2x + 1.
- **Erro comum:** Achar que f(x) = ±√x é função (para x>0 dá dois valores).

#### Injetora

- **Definição formal:** Elementos distintos do domínio geram imagens distintas.
- **Intuição prática:** Duas fichas diferentes nunca caem no mesmo destino.
- **Exemplo original:** f(x)=3x+2 é injetora.
- **Erro comum:** Testar injetividade só olhando o gráfico sem critério.

#### Sobrejetora

- **Definição formal:** Todo elemento do contradomínio é atingido por algum elemento do domínio.
- **Intuição prática:** Nenhum destino fica vazio.
- **Exemplo original:** f: ℝ→ℝ, f(x)=x³ é sobrejetora.
- **Erro comum:** Confundir sobrejetora com injetora.

### 4. Teoremas, Leis e Fórmulas

- Composição: (f∘g)(x) = f(g(x)); a ordem importa.
- Se f é bijetora, existe f⁻¹ com f(f⁻¹(x)) = x.
- Gráfico de f⁻¹ é o reflexo do gráfico de f em torno da reta y = x.

### 5. Exemplo Resolvido Passo a Passo

1. Dada f(x) = 2x + 1, encontrar a inversa.
2. 1) Escreva y = 2x + 1.
3. 2) Isole x: x = (y − 1)/2.
4. 3) Troque os papéis: f⁻¹(x) = (x − 1)/2.
5. 4) Verifique: f(f⁻¹(7)) = 2·3 + 1 = 7.

### 6. Conexões Interdisciplinares

Funções são a linguagem natural da programação (função pura em C/Python), de modelos estatísticos e de transformações lineares em álgebra.

### 7. Código Funcional (validado)

```python
def f(x): return 2*x+1
def inv(y): return (y-1)/2
print(f(inv(7)))  # 7.0
```

### 8. Checklist de Domínio

- [ ] Aplico o teste da reta vertical.
- [ ] Diferencio domínio, contradomínio e imagem.
- [ ] Calculo a inversa e verifico a composição.
- [ ] Componho funções na ordem correta.
- [ ] Sei dar exemplo de função que não é injetora.

### 9. Perguntas de Revisão e Gabarito

**P1.** Toda função injetora é bijetora?

> **Gabarito (retenção):** Não; falta ser sobrejetora.

**P2.** Qual o domínio de f(x) = 1/(x−2)?

> **Gabarito (retenção):** ℝ − {2}.

**P3.** Se f(x)=x² em ℝ, ela é injetora?

> **Gabarito (retenção):** Não, pois f(2)=f(−2)=4.


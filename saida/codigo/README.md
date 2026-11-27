# Código de referência auditado (FORGE 7.0)

Todos os arquivos desta pasta são didáticos e foram escritos em português (pt-BR).
Nenhum deles depende de pacotes externos em navegador; as dependências de sistema
são apenas a biblioteca padrão C/POSIX/Win32 e, no Python, a biblioteca padrão
(`sympy` é opcional, com degradação explícita).

## Compilação estrita

O auditor usa **exatamente** estas flags — nenhuma foi enfraquecida:

```
-std=c17 -Wall -Wextra -Werror -pedantic -O2
```

Nesta máquina existem dois GCC:

| Caminho | Versão | `-std=c17` |
| --- | --- | --- |
| `gcc` no PATH (`C:\MinGW\bin\gcc.exe`) | MinGW.org GCC 6.3.0 | **não** (rejeita a opção) |
| `C:\mingw64\mingw64\bin\gcc.exe` | MinGW-W64 UCRT GCC 16.2.0 | **sim** — é o usado na auditoria |

`clang` não está instalado. O script `auditar_tudo.py` descobre automaticamente
um compilador que aceite `-std=c17`; também aceita sobrescrever com `FORGE_CC`.
Se nenhum compilador aceitar as flags, a auditoria falha com mensagem clara —
não há fallback para `-std=c11`.

Exemplo manual (GCC 16.2):

```powershell
& 'C:\mingw64\mingw64\bin\gcc.exe' -std=c17 -Wall -Wextra -Werror -pedantic -O2 `
  'saida/codigo/tensor_engine.c' -lm -o 'C:\Users\João\AppData\Local\Temp\opencode\tensor.exe'
python 'saida/codigo/auditar_tudo.py'
```

## Arquivos

| Arquivo | Finalidade |
| --- | --- |
| `referencia_01_senha_csprng.c` | Gerador de senhas com entropia do SO e *rejection sampling* (sem viés de módulo); zera a memória com `volatile`. |
| `referencia_02_buffer_seguro.c` | Buffer dinâmico com checagem de overflow, realocação segura e sanitização antes de `free`. |
| `referencia_03_servidor_tcp.c` | Servidor TCP mínimo: Winsock + thread por cliente no Windows; `fork()` + `sigaction` no POSIX. Não é executado pelo auditor (seria bloqueante). |
| `referencia_04_auditor_sympy.py` | Auditoria simbólica: derivada, integral, sistema linear, inverso modular e Fermat. Sem SymPy, executa verificações em Python puro e informa o que foi pulado. |
| `referencia_05_calculadora_cidr.py` | CIDR/VLSM com `ipaddress` e casos determinísticos embutidos (inclui `192.168.10.0/24 -> 4 /26`). |
| `tensor_engine.c` / `.h` | Esqueleto didático de tensor 2D: strides, matmul com loop desenrolado, GEMM, argmax, ReLU, softmax e um forward pass com pesos fixos. |
| `quantizacao.c` | Quantização simétrica int8 → desquantização e medição do erro. |
| `auditar_tudo.py` | Executa todas as compilações, checagens de sintaxe Python e testes determinísticos, imprimindo PASS/FAIL por item. |
| `verificar_links_biblioteca.py` | Verifica por HTTP os URLs do catálogo e grava `saida/09_biblioteca_verificada/`. |

## Limites do Tensor Engine (importante)

Este código **não é um runtime de LLM**. Ele existe para tornar visíveis, em C
simples, as peças que um framework esconde:

- tensores densos e contíguos, no máximo 4 dimensões; operações implementadas só para 2D;
- `double` (sem half-precision, sem int8 aqui — veja `quantizacao.c`);
- sem BLAS, sem GPU, sem SIMD explícito, sem paralelismo, complexidade O(n³);
- sem autograd, sem camadas treináveis reais e sem carregamento de pesos;
- softmax por linha com subtração do máximo (estabilidade numérica);
- `matmul` desenrola o eixo de contração de 4 em 4 e trata o resto; `gemm` é o
  triple loop direto com `alpha` e `beta`;
- saída determinística: os pesos são constantes no código; a única aleatoriedade
  do diretório está em `referencia_01_senha_csprng.c`, que usa CSPRNG do SO.

A demonstração imprime `h`, `logits`, `probs`, `argmax` e a soma das
probabilidades (≈1.000000). A quantização em int8 tem erro máximo de
aproximadamente `2.8e-3` para a amostra fixa — isso é perda de arredondamento,
 não propriedade de segurança.

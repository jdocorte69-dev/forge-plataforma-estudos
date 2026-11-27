# Relatório de auditoria — FORGE 7.0 (código e biblioteca)

**Data:** 2026-11-27 · **Escopo:** `saida/codigo/**`, `js/data-library-extra.js`,
`saida/09_biblioteca_verificada/**`. Nenhum commit/push realizado. Arquivos de
outras áreas (`js/app.js`, `js/storage.js`, `css/`, `index.html`, `sw.js`,
`tests/`, `saida/02_resumos_por_livro/**`) não foram modificados.

## 1. Ferramentas disponíveis (detectadas, não presumidas)

| Ferramenta | Versão exata / resultado | Uso |
| --- | --- | --- |
| `gcc` no PATH (`C:\MinGW\bin\gcc.exe`) | `gcc.exe (MinGW.org GCC-6.3.0-1) 6.3.0` | **Não aceita** `-std=c17`; não usado na auditoria. |
| `C:\mingw64\mingw64\bin\gcc.exe` | `gcc.exe (MinGW-W64 x86_64-ucrt-posix-seh, built by Brecht Sanders, r3) 16.2.0` | Compilador efetivo: aceita `-std=c17`. |
| `clang --version` | comando não reconhecido no PowerShell | Indisponível. |
| `python --version` | `Python 3.13.15` | Scripts Python e auditoria. |
| `sympy` / `numpy` | `1.14.0` / `2.5.3` | SymPy disponível; NumPy não é exigido pelo auditor. |
| `node --version` | `v26.13.1` | Validação de forma do catálogo JS (somente leitura). |

**Flags C (inalteradas):** `-std=c17 -Wall -Wextra -Werror -pedantic -O2`.
Bibliotecas de link necessárias no Windows: `-ladvapi32` (CryptoAPI),
`-lws2_32` (Winsock) e `-lm` (`log2`, `exp`, `round`).

## 2. Comandos executados

Detecção:

```powershell
gcc --version
clang --version
python --version
& 'C:\mingw64\mingw64\bin\gcc.exe' --version
```

Compilações (todas com as seis flags estritas acima):

```powershell
& 'C:\mingw64\mingw64\bin\gcc.exe' -std=c17 -Wall -Wextra -Werror -pedantic -O2 saida/codigo/referencia_01_senha_csprng.c -lm -ladvapi32 -o <temp>\referencia_01_senha_csprng.exe
& 'C:\mingw64\mingw64\bin\gcc.exe' -std=c17 -Wall -Wextra -Werror -pedantic -O2 saida/codigo/referencia_02_buffer_seguro.c -o <temp>\referencia_02_buffer_seguro.exe
& 'C:\mingw64\mingw64\bin\gcc.exe' -std=c17 -Wall -Wextra -Werror -pedantic -O2 saida/codigo/referencia_03_servidor_tcp.c -lws2_32 -o <temp>\referencia_03_servidor_tcp.exe
& 'C:\mingw64\mingw64\bin\gcc.exe' -std=c17 -Wall -Wextra -Werror -pedantic -O2 saida/codigo/tensor_engine.c -lm -o <temp>\tensor_engine.exe
& 'C:\mingw64\mingw64\bin\gcc.exe' -std=c17 -Wall -Wextra -Werror -pedantic -O2 saida/codigo/quantizacao.c -lm -o <temp>\quantizacao.exe
```

Auditoria completa e verificação de links:

```powershell
python saida/codigo/auditar_tudo.py
python saida/codigo/verificar_links_biblioteca.py
node -e "global.window={}; require('./js/data-library-extra.js'); ..."
```

Os executáveis são gerados em diretório temporário (`tempfile.TemporaryDirectory`),
não no repositório. `<temp>` acima é esse diretório.

## 3. Resultado por arquivo

| Arquivo | Compilação (0 avisos/erros) | Execução | Detalhe |
| --- | --- | --- | --- |
| `referencia_01_senha_csprng.c` | **PASS** | **PASS** (`16`) | Saída com 94 símbolos, 104.87 bits; rejection sampling e `volatile` zero intactos. |
| `referencia_02_buffer_seguro.c` | **PASS** | **PASS** | `tamanho=26 capacidade=32`, sanitização final. |
| `referencia_03_servidor_tcp.c` | **PASS** | não executado (servidor bloqueante) | Correção aplicada: `#include <winsock2.h>` **antes** de `<windows.h>`; antes disso-gcc 16.2 emitia `#warning ... [-Werror=cpp]` e falhava. |
| `tensor_engine.c` + `tensor_engine.h` | **PASS** | **PASS** | Novo; saída determinística (abaixo). |
| `quantizacao.c` | **PASS** | **PASS** | Novo; erro máximo `0.00275591`. |
| `referencia_04_auditor_sympy.py` | sintaxe **PASS** | **PASS** (com SymPy) e **PASS** (`FORGE_SEM_SYMPY=1`) | Sem SymPy, imprime explicitamente 2 itens `NAO VERIFICADAS` e valida inverso modular, Fermat e sistema via `Fraction`. Sem instalação de pacotes. |
| `referencia_05_calculadora_cidr.py` | sintaxe **PASS** | **PASS** | Casos fixos com `assert`: `192.168.10.0/26` → `.0`/`.63`, 64 IPs/62 hosts; `192.168.10.0/24` → **4 /26**; `/30` e VLSM. |
| `compilar_e_testar.py` | sintaxe **PASS** | não reexecutado (usa `-std=c11` histórico) | Arquivo preservado; auditoria atual é `auditar_tudo.py`. |
| `auditar_tudo.py` | sintaxe **PASS** | **PASS** | `RESULTADO: 0 falha(s). TUDO OK.` (exit code 0). |
| `verificar_links_biblioteca.py` | sintaxe **PASS** | **PASS** | Gera os dois arquivos de verificação. |

Saída determinística do `tensor_engine.c` (trecho):

```text
h=ReLU  = [0.290000 0.000000 0.250000 0.185000]
logits  = [0.194000 0.131750 0.163250]
probs   = [0.343718 0.322973 0.333309]
argmax = 0 | soma(probs) = 1.000000
```

O módulo `tensor_engine.c` implementa strides row-major, `matmul` com o eixo de
contração desenrolado de 4 em 4 (com resto), GEMM com `alpha`/`beta`, `argmax`,
ReLU in-place e softmax estável; limites didáticos estão em `saida/codigo/README.md`.

## 4. Biblioteca verificada

- `js/data-library-extra.js`: **73 entradas** (30 novas, aditivas), **12 chaves
  por objeto** em mesma ordem (`title, author, type, area, level, language, free,
  license, url, verifiedAt, note, priority`); `window.LIBRARY_EXTRA` preservado.
- Método: `urllib.request` com GET, User-Agent identificável, timeout de 20 s,
  redirecionamentos seguidos e leitura de 512 bytes. Nenhum pacote instalado.
- **57 URLs únicos verificados: 55 com HTTP 200, 2 com HTTP 403** (os dois DOI
  de artigos de aprendizagem). 16 entradas legadas não têm URL e estão marcadas
  como `sem resposta`/`URL ausente` — nunca como 200.
- **39 recursos com HTTP 200 nas 6 categorias da meta**: Matemática 14; Cálculo 5;
  Algoritmos/C/Linguagens 5; Arquitetura/SO 5; Redes/Cripto 5; IA/ML 5.
  As 30 entradas adicionadas hoje respondem 200 e têm `verifiedAt: 2026-11-27`.
- Evidência completa: `saida/09_biblioteca_verificada/links_verificados.md` e
  `links_verificados.json` (status, URL final após redirect, erro exato e data
  por recurso; agregação por área).

Links que retornaram 403 e estão **marcados como não verificados**:
`https://doi.org/10.1177/1529100612453266` e
`https://doi.org/10.1111/j.1467-9280.2006.01693.x`. Também foram descartados da
curadoria adicional (não adicionados ao catálogo) candidatos com 403/404/erro de
certificado: cppreference, OSDev Wiki, Paul's Online Math Notes,
crypto.stanford.edu/~dabo/cryptoclass, MIT 6.036-2024 e neuralnetworksanddeeplearning.com.

## 5. Conclusão

Auditoria C/Python: **PASS (0 falhas)** com as flags estritas solicitadas e GCC 16.2.0.
Biblioteca: meta de **≥30 recursos verificados em 6 categorias** atendida (39).
Nenhuma verificação HTTP foi inventada: status não-200 e ausência de URL estão
explicitamente registrados nos arquivos de evidência.

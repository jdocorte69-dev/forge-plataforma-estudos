# Log de compilacao e execucao — Codigos de Referencia

- Data/hora: 2026-11-26T20:48:24-03:00
- Flags C: `-std=c11 -Wall -Wextra -Werror -pedantic`

## `referencia_01_senha_csprng.c`

- Comando: `gcc -std=c11 -Wall -Wextra -Werror -pedantic D:\João\Desktop\ESTUDOS\saida\codigo\referencia_01_senha_csprng.c -ladvapi32 -o D:\João\Desktop\ESTUDOS\saida\logs\referencia_01_senha_csprng.exe`
- Exit code: 0
- Warnings/erros: NENHUM

- Execucao de teste:
```
Senha: <cIWrq)gjS!Q8Jgx
Comprimento: 16 | Alfabeto: 94 | Entropia: 104.87 bits
```

## `referencia_02_buffer_seguro.c`

- Comando: `gcc -std=c11 -Wall -Wextra -Werror -pedantic D:\João\Desktop\ESTUDOS\saida\codigo\referencia_02_buffer_seguro.c -o D:\João\Desktop\ESTUDOS\saida\logs\referencia_02_buffer_seguro.exe`
- Exit code: 0
- Warnings/erros: NENHUM

## `referencia_03_servidor_tcp.c`

- Comando: `gcc -std=c11 -Wall -Wextra -Werror -pedantic D:\João\Desktop\ESTUDOS\saida\codigo\referencia_03_servidor_tcp.c -lws2_32 -o D:\João\Desktop\ESTUDOS\saida\logs\referencia_03_servidor_tcp.exe`
- Exit code: 0
- Warnings/erros: NENHUM

## `referencia_04_auditor_sympy.py`

- Exit code: 0
- Saida:
```
=== AUDITORIA MATEMATICA SIMBOLICA (SYMPY) ===

1. f(x) = exp(3*x)*sin(x**2)
   f'(x) = 2*x*exp(3*x)*cos(x**2) + 3*exp(3*x)*sin(x**2)
   identidade simplificada = 0

2. integral de x**2*cos(x) de 0 a pi = -2*pi
   valor numerico = -6.283185307179586
   forma esperada = -2*pi  ->  diferenca: 0

3. Sistema Ax=b -> x = 2 y = 3 z = -1
   residuo Ax-b = [0, 0, 0]

4. inverso de 17 mod 3120 = 2753
   verificacao (a*inv) mod m = 1

5. Fermat: 12345 ^ 104728 mod 104729 = 1 (esperado 1)

[OK] Todas as verificacoes simbolicas passaram.
```

## `referencia_05_calculadora_cidr.py`

- Exit code: 0
- Saida:
```
=== ANALISE DE SUB-REDE: 192.168.10.0/26 ===
Endereco de rede : 192.168.10.0
Mascara          : 255.255.255.192
Mascara reversa  : 0.0.0.63
Broadcast        : 192.168.10.63
Total de IPs     : 64
Hosts uteis      : 62
Primeiro host    : 192.168.10.1
Ultimo host      : 192.168.10.62

=== ANALISE DE SUB-REDE: 10.20.30.0/30 ===
Endereco de rede : 10.20.30.0
Mascara          : 255.255.255.252
Mascara reversa  : 0.0.0.3
Broadcast        : 10.20.30.3
Total de IPs     : 4
Hosts uteis      : 2
Primeiro host    : 10.20.30.1
Ultimo host      : 10.20.30.2

=== DIVISAO VLSM DO BLOCO 10.0.0.0/24 ===
Requerido  100 hosts | alocado 10.0.0.0/25        | faixa 10.0.0.1 - 10.0.0.126
Requerido   50 hosts | alocado 10.0.0.128/26      | faixa 10.0.0.129 - 10.0.0.190
Requerido   20 hosts | alocado 10.0.0.192/27      | faixa 10.0.0.193 - 10.0.0.222
Requerido   10 hosts | alocado 10.0.0.224/28      | faixa 10.0.0.225 - 10.0.0.238

[OK] Calculos de CIDR/VLSM concluidos.
```

## Resultado

- 5/5 codigos compilaram/executaram com sucesso.
